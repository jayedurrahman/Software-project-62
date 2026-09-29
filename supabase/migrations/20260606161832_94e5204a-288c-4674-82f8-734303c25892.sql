
CREATE OR REPLACE FUNCTION public.get_hostel_meal_stats(_hostel_id uuid, _month_start date, _next_month_start date)
RETURNS TABLE(total_meals bigint, total_bazar numeric, meal_rate numeric)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  WITH m AS (
    SELECT COALESCE(SUM(lunch + dinner), 0)::bigint AS total_meals
    FROM public.meals
    WHERE hostel_id = _hostel_id
      AND date >= _month_start
      AND date < _next_month_start
  ),
  b AS (
    SELECT COALESCE(SUM(amount), 0)::numeric AS total_bazar
    FROM public.expenses
    WHERE hostel_id = _hostel_id
      AND category = 'bazar'
      AND date >= _month_start
      AND date < _next_month_start
  )
  SELECT m.total_meals,
         b.total_bazar,
         CASE WHEN m.total_meals > 0 THEN ROUND(b.total_bazar / m.total_meals) ELSE 0 END AS meal_rate
  FROM m, b;
$$;

GRANT EXECUTE ON FUNCTION public.get_hostel_meal_stats(uuid, date, date) TO authenticated;
