import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import BalanceIndicator from '@/components/dashboard/BalanceIndicator';
import { Download, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';

const Reports = () => {
  const { profile } = useAuth();


  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any[]>([]);
  const [expenseByCategory, setExpenseByCategory] = useState<{ name: string; value: number }[]>([]);
  const [mealRate, setMealRate] = useState(0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthYear = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const monthStart = `${monthYear}-01`;
      const nextMonthStart = `${month === 11 ? year + 1 : year}-${String(((month + 1) % 12) + 1).padStart(2, '0')}-01`;
      const [mealsRes, paymentsRes, expensesRes, profilesRes, statsRes] = await Promise.all([
        supabase.from('meals').select('*').gte('date', monthStart).lt('date', nextMonthStart),
        supabase.from('payments').select('*').eq('month_year', monthYear),
        supabase.from('expenses').select('*').eq('month_year', monthYear),
        supabase.from('profiles').select('id, full_name'),
        profile?.hostel_id
          ? supabase.rpc('get_hostel_meal_stats', {
              _hostel_id: profile.hostel_id,
              _month_start: monthStart,
              _next_month_start: nextMonthStart,
            })
          : Promise.resolve({ data: null } as any),
      ]);

      const meals = mealsRes.data || [];
      const payments = paymentsRes.data || [];
      const expenses = expensesRes.data || [];
      const profiles = profilesRes.data || [];
      const hostelStats = (statsRes as any)?.data?.[0];

      const totalBazar = Number(hostelStats?.total_bazar ?? expenses.filter(e => e.category === 'bazar').reduce((s, e) => s + Number(e.amount), 0));
      const allMeals = Number(hostelStats?.total_meals ?? meals.reduce((s, m) => s + (m.lunch as number || 0) + (m.dinner as number || 0), 0));
      const rate = Number(hostelStats?.meal_rate ?? (allMeals > 0 ? Math.round(totalBazar / allMeals) : 0));
      setMealRate(rate);


      const data = profiles.map(p => {
        const pMeals = meals.filter(m => m.user_id === p.id);
        const mealCount = pMeals.reduce((s, m) => s + (m.lunch as number || 0) + (m.dinner as number || 0), 0);
        const cost = mealCount * rate;
        const mealPaid = payments.filter(pm => pm.user_id === p.id && pm.type === 'meal').reduce((s, pm) => s + Number(pm.amount), 0);
        const utilityPaid = payments.filter(pm => pm.user_id === p.id && pm.type === 'utility').reduce((s, pm) => s + Number(pm.amount), 0);
        return { name: p.full_name, meals: mealCount, cost, mealPaid, utilityPaid, balance: cost - mealPaid };
      });
      setReportData(data);

      const catMap = new Map<string, number>();
      expenses.forEach((e: any) => {
        catMap.set(e.category, (catMap.get(e.category) || 0) + Number(e.amount));
      });
      setExpenseByCategory(Array.from(catMap, ([name, value]) => ({ name, value })));
      setLoading(false);
    };
    load();
  }, [monthYear, profile?.hostel_id]);

  const totalMeals = reportData.reduce((s, m) => s + m.meals, 0);
  const totalCost = reportData.reduce((s, m) => s + m.cost, 0);
  const totalPaid = reportData.reduce((s, m) => s + m.mealPaid + m.utilityPaid, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground mt-1">Monthly summaries & data</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(year, month - 1))}><ChevronLeft className="w-4 h-4" /></Button>
            <span className="text-sm font-medium min-w-[140px] text-center">{monthName}</span>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(year, month + 1))}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="stat-card text-center">
            <p className="text-2xl font-bold text-foreground">{totalMeals}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Meals</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl font-bold text-foreground">{mealRate > 0 ? `৳${mealRate}` : '—'}</p>
            <p className="text-xs text-muted-foreground mt-1">Meal Rate</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl font-bold text-foreground">৳{totalCost.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Cost</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-2xl font-bold text-foreground">৳{totalPaid.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Collected</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground mb-3">Expenses by Category</h3>
              {expenseByCategory.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No expenses</p>
              ) : (
                <ChartContainer
                  config={Object.fromEntries(
                    expenseByCategory.map((c, i) => [c.name, { label: c.name, color: `hsl(var(--chart-${(i % 5) + 1}))` }])
                  )}
                  className="h-[280px] w-full"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                    <Pie data={expenseByCategory} dataKey="value" nameKey="name" outerRadius={90} label={true}>
                      {expenseByCategory.map((_, i) => (
                        <Cell key={i} fill={`hsl(var(--chart-${(i % 5) + 1}))`} />
                      ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                  </PieChart>
                </ChartContainer>
              )}
            </div>

            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground mb-3">Member Meals vs Payments</h3>
              <ChartContainer
                config={{
                  meals: { label: 'Meals', color: 'hsl(var(--chart-1))' },
                  paid: { label: 'Paid (৳)', color: 'hsl(var(--chart-2))' },
                  cost: { label: 'Cost (৳)', color: 'hsl(var(--chart-3))' },
                }}
                className="h-[280px] w-full"
              >
                <BarChart data={reportData.map((r) => ({ name: (r.name || '').split(' ')[0], meals: r.meals, paid: r.mealPaid + r.utilityPaid, cost: r.cost }))}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="cost" fill="hsl(var(--chart-3))" radius={4} />
                  <Bar dataKey="paid" fill="hsl(var(--chart-2))" radius={4} />
                  <Bar dataKey="meals" fill="hsl(var(--chart-1))" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Member Report</h3>
              <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                    <th className="text-center px-3 py-3 font-medium text-muted-foreground">Meals</th>
                    <th className="text-right px-3 py-3 font-medium text-muted-foreground hidden sm:table-cell">Cost</th>
                    <th className="text-right px-3 py-3 font-medium text-muted-foreground">Paid</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((m, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{m.name}</td>
                      <td className="text-center px-3 py-3 text-muted-foreground">{m.meals}</td>
                      <td className="text-right px-3 py-3 text-muted-foreground hidden sm:table-cell">৳{m.cost.toLocaleString()}</td>
                      <td className="text-right px-3 py-3 text-muted-foreground">৳{(m.mealPaid + m.utilityPaid).toLocaleString()}</td>
                      <td className="text-right px-4 py-3"><BalanceIndicator amount={m.balance} size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
                {reportData.length > 0 && (
                  <tfoot>
                    <tr className="bg-muted/30 font-semibold">
                      <td className="px-4 py-3 text-foreground">Total</td>
                      <td className="text-center px-3 py-3 text-foreground">{totalMeals}</td>
                      <td className="text-right px-3 py-3 text-foreground hidden sm:table-cell">৳{totalCost.toLocaleString()}</td>
                      <td className="text-right px-3 py-3 text-foreground">৳{totalPaid.toLocaleString()}</td>
                      <td className="text-right px-4 py-3"><BalanceIndicator amount={totalCost - totalPaid} size="sm" /></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Reports;
