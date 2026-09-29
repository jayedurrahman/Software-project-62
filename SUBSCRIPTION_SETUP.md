# Subscription (Paddle) setup

## Ki ki change hoyeche
- `src/lib/paddle.ts` : Paddle price ID (pri_...) sorasori code e boshano, Lovable gateway lage na.
- `supabase/functions/payments-webhook` : plan Paddle er billing interval theke chine, duplicate handle kore.
- `supabase/functions/_shared/paddle.ts` : webhook verify korte Lovable key lage na.
- `supabase/config.toml` : webhook e verify_jwt = false (na hole Paddle er call 401 pay).
- `AuthContext.tsx` + `Login.tsx` : subscription expire holeo admin login kore /subscription e giye renew korte pare.
- `Subscription.tsx` : hostel_id na thakle error message dekhay.

## Tomake ja korte hobe
1. Price ID: Monthly = pri_01m3q9knsr63ggzncr0q69vcn3, Yearly = pri_01m3q9n8wmc5bfs9bpv42fexvs
   Ulto hole `src/lib/paddle.ts` ar `payments-webhook/index.ts` (YEARLY_PRICE_IDS) e adol-badol koro.
2. Vercel env: `VITE_PAYMENTS_CLIENT_TOKEN`
   - Price ID sandbox er hole `test_...` token, live er hole `live_...` token.
   - Change korar por Redeploy.
3. Paddle dashboard -> Checkout settings -> Default payment link ar approved domain e Vercel site er URL dao.
4. Supabase -> Edge Functions: `supabase functions deploy payments-webhook`
5. Supabase secrets: `PAYMENTS_SANDBOX_WEBHOOK_SECRET` (live hole `PAYMENTS_LIVE_WEBHOOK_SECRET`)
   (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` Supabase nije dey.)
6. Paddle -> Developer Tools -> Notifications: URL
   `https://jyytalbzisrexdjcolhk.supabase.co/functions/v1/payments-webhook?env=sandbox` (live hole env=live)
   Events: subscription.created, subscription.updated, subscription.canceled
7. Admin account diye Subscription page theke test korো (test card 4242 4242 4242 4242).

## Backup (demo)
```sql
insert into public.subscriptions (hostel_id, plan, status, start_date, end_date, amount)
values ('YOUR_HOSTEL_ID', 'monthly', 'active', current_date, current_date + interval '30 days', 20);
```
