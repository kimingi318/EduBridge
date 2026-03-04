// helper for calculating time remaining until a given HH:MM:SS string
export function getTimeRemaining(
  start_time: string,
  end_time: string,
  eta_min: number = 0,
): string {
  if (!start_time) return "";
  const now = new Date();
  const [startH, startM, startS] = start_time.split(":").map(Number);
  const [endH, endM, endS] = end_time.split(":").map(Number);

  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    startH,
    startM + eta_min,
    startS || 0,
  );
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    endH,
    endM,
    endS || 0,
  );

  //after class has ended
  if (now >= end) return "Ended";
  //during class
  if (now >= start && now < end) return "Ongoing";

  //before class starts
  const diffMs = start.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const hrs = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;

  return hrs > 0 ? `Starts in ${hrs}h ${mins}m` : `Starts in ${mins} mins`;
}
