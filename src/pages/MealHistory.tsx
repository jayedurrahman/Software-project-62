import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import { Loader2, History } from 'lucide-react';

type MonthRow = {
  monthYear: string;
  label: string;
  totalMeals: number;
  totalBazar: number;
  mealRate: number;
};

const MealHistory = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<MonthRow[]>([]);

  useEffect(() => {
    if (!profile?.hostel_id) return;
    const load = async () => {
      setLoading(true);
      const now = new Date();
      // last 12 months including current
      const months: { monthStart: string; nextMonthStart: string; label: string; monthYear: string }[] = [];
      for (let i = 0; i < 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const fmt = (x: Date) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-01`;
        months.push({
          monthStart: fmt(d),
          nextMonthStart: fmt(nd),
          label: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
          monthYear: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        });
      }

      const results = await Promise.all(
        months.map(m =>
          supabase.rpc('get_hostel_meal_stats', {
            _hostel_id: profile.hostel_id!,
            _month_start: m.monthStart,
            _next_month_start: m.nextMonthStart,
          })
        )
      );

      const data: MonthRow[] = results.map((r, i) => {
        const s = (r.data as any)?.[0];
        return {
          monthYear: months[i].monthYear,
          label: months[i].label,
          totalMeals: Number(s?.total_meals ?? 0),
          totalBazar: Number(s?.total_bazar ?? 0),
          mealRate: Number(s?.meal_rate ?? 0),
        };
      });

      setRows(data);
      setLoading(false);
    };
    load();
  }, [profile?.hostel_id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <History className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Meal History</h1>
            <p className="text-muted-foreground mt-1">Monthly totals and meal rate for your hostel</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">Month</th>
                  <th className="text-right px-3 py-3 font-medium text-muted-foreground">Total Meals</th>
                  <th className="text-right px-3 py-3 font-medium text-muted-foreground">Total Bazar</th>
                  <th className="text-right px-5 py-3 font-medium text-muted-foreground">Meal Rate</th>
                </tr>
              </thead>
              <tbody>
                {rows.filter(r => r.totalMeals > 0 || r.totalBazar > 0).map(r => (
                  <tr key={r.monthYear} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{r.label}</td>
                    <td className="text-right px-3 py-3 text-muted-foreground">{r.totalMeals}</td>
                    <td className="text-right px-3 py-3 text-muted-foreground">৳{r.totalBazar.toLocaleString()}</td>
                    <td className="text-right px-5 py-3 font-semibold text-primary">
                      {r.mealRate > 0 ? `৳${r.mealRate}` : '—'}
                    </td>
                  </tr>
                ))}
                {rows.every(r => r.totalMeals === 0 && r.totalBazar === 0) && (
                  <tr>
                    <td colSpan={4} className="text-center px-5 py-10 text-muted-foreground">
                      No meal history yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MealHistory;
