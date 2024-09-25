
export const fetchBudgets = async (year: number, month: number) => {
    try {
      const res = await fetch(`/api/budgets/user?year=${year}&month=${month}`);
      if (res.ok) {
        return await res.json();
      } else {
        console.error("Failed to fetch budgets");
        return [];
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
      return [];
    }
  };
  
  export const deleteBudget = async (budgetId: string) => {
    try {
      const res = await fetch(`/api/budgets/${budgetId}`, { method: "DELETE" });
      if (res.ok) {
        return true;
      } else {
        const data = await res.json();
        console.error("Failed to delete budget:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      return false;
    }
  };
  
  