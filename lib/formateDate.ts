export function formatDate(
  date: Date,
  format: string = "MMM d, yyyy",
  locale: string = "fa-IR"
): string {
  const now = new Date();
  const differenceInMilliseconds = now.getTime() - date.getTime();
  const differenceInDays = Math.floor(
    Math.abs(differenceInMilliseconds) / (1000 * 60 * 60 * 24)
  );
  const isPast = differenceInMilliseconds > 0;

  // Return relative date for recent dates
  if (differenceInDays === 0) return locale === "fa-IR" ? "امروز" : "today";
  if (differenceInDays === 1)
    return locale === "fa-IR"
      ? isPast
        ? "دیروز"
        : "فردا"
      : isPast
      ? "yesterday"
      : "tomorrow";
  if (differenceInDays < 7) {
    return locale === "fa-IR"
      ? `${differenceInDays} روز ${isPast ? "پیش" : "بعد"}`
      : `${differenceInDays} days ${isPast ? "ago" : "from now"}`;
  }

  // If date is older than a week, use the specified format
  const options: Intl.DateTimeFormatOptions = {
    calendar: "persian", // Use Persian calendar
  };

  // Adjust the options based on the format
  if (format.includes("yyyy")) options.year = "numeric";
  if (format.includes("MMM")) options.month = "short";
  else if (format.includes("MM")) options.month = "2-digit";
  else if (format.includes("M")) options.month = "numeric";

  if (format.includes("dd")) options.day = "2-digit";
  else if (format.includes("d")) options.day = "numeric";

  return new Intl.DateTimeFormat(locale, options).format(date);
}
