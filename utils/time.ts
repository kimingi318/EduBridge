// helper for calculating time remaining until a given HH:MM:SS string
export function getTimeRemaining(start_time: string): string {
  if (!start_time) return "";
  const now = new Date();
  const [hours, minutes, seconds] = start_time.split(":").map(Number);

  const start = new Date();
  start.setHours(hours, minutes, seconds || 0, 0);

  const diffMs = start.getTime() - now.getTime();

  if (diffMs <= 0) return "Ongoing";

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const hrs = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }

  return `${mins} mins`;
}
