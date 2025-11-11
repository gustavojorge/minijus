export function formatDate(date: string | undefined | null): string {
  if (!date) return "-";

  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return "-";
    }

    return dateObj.toLocaleDateString("pt-BR");
  } catch {
    return "-";
  }
}
