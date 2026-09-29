import { createClient } from 'npm:@supabase/supabase-js@2';
import { verifyWebhook, EventName, type PaddleEnv } from '../_shared/paddle.ts';

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
  }
  return _supabase;
}

// Paddle price ID -> plan (src/lib/paddle.ts er ID gulor sathe mil thakte hobe)
const YEARLY_PRICE_IDS = ['pri_01m3q9n8wmc5bfs9bpv42fexvs'];

function detectPlan(item: any): { plan: string; months: number } {
  const externalId = item?.price?.importMeta?.externalId;
  const interval = item?.price?.billingCycle?.interval;
  const isYearly =
    externalId === 'hostel_yearly' ||
    interval === 'year' ||
    YEARLY_PRICE_IDS.includes(item?.price?.id);
  return isYearly ? { plan: 'yearly', months: 12 } : { plan: 'monthly', months: 1 };
}

function addMonths(d: Date, months: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + months);
  return r;
}

async function handleSubscriptionCreated(data: any) {
  const { id, customerId, items, status, currentBillingPeriod, customData } = data;
  const hostelId = customData?.hostelId;
  if (!hostelId) {
    console.error('No hostelId in customData');
    return;
  }
  const item = items?.[0];
  if (!item) {
    console.error('No items in subscription');
    return;
  }
  const { plan, months } = detectPlan(item);
  const startDate = currentBillingPeriod?.startsAt
    ? new Date(currentBillingPeriod.startsAt)
    : new Date();
  const endDate = currentBillingPeriod?.endsAt
    ? new Date(currentBillingPeriod.endsAt)
    : addMonths(startDate, months);
  const amount = Number(item.price?.unitPrice?.amount || 0) / 100;

  // Duplicate webhook hole abar insert korbe na
  const { data: existing } = await getSupabase()
    .from('subscriptions')
    .select('id')
    .eq('stripe_subscription_id', id)
    .maybeSingle();
  if (existing) {
    console.log('Subscription already recorded:', id);
    return;
  }

  const { error } = await getSupabase().from('subscriptions').insert({
    hostel_id: hostelId,
    plan,
    status: status === 'active' || status === 'trialing' ? 'active' : status,
    start_date: startDate.toISOString().slice(0, 10),
    end_date: endDate.toISOString().slice(0, 10),
    amount,
    stripe_customer_id: customerId,
    stripe_subscription_id: id,
  });
  if (error) throw error;
}

async function handleSubscriptionUpdated(data: any) {
  const { id, status, currentBillingPeriod } = data;
  const { error } = await getSupabase().from('subscriptions')
    .update({
      status: status === 'active' || status === 'trialing' ? 'active' : status,
      end_date: currentBillingPeriod?.endsAt
        ? new Date(currentBillingPeriod.endsAt).toISOString().slice(0, 10)
        : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', id);
  if (error) throw error;
}

async function handleSubscriptionCanceled(data: any) {
  const { error } = await getSupabase().from('subscriptions')
    .update({ status: 'canceled', updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', data.id);
  if (error) throw error;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const url = new URL(req.url);
  const env = (url.searchParams.get('env') || 'sandbox') as PaddleEnv;
  try {
    const event = await verifyWebhook(req, env);
    switch (event.eventType) {
      case EventName.SubscriptionCreated:
        await handleSubscriptionCreated(event.data);
        break;
      case EventName.SubscriptionUpdated:
        await handleSubscriptionUpdated(event.data);
        break;
      case EventName.SubscriptionCanceled:
        await handleSubscriptionCanceled(event.data);
        break;
      default:
        console.log('Unhandled event:', event.eventType);
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Webhook error:', e);
    return new Response('Webhook error', { status: 400 });
  }
});
