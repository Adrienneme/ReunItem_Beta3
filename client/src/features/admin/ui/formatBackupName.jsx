export default function formatBackupName(file) {
  const filename = file.name;
  const sizeBytes = file.size_bytes;

  // Convert bytes → readable format
  let sizeFormatted = "";
  if (sizeBytes < 1024) {
    sizeFormatted = `${sizeBytes} B`;
  } else if (sizeBytes < 1024 * 1024) {
    sizeFormatted = `${(sizeBytes / 1024).toFixed(1)} KB`;
  } else {
    sizeFormatted = `${(sizeBytes / 1024 / 1024).toFixed(2)} MB`;
  }

  // Remove prefix + suffix
  let clean = filename
    .replace("full_backup_", "")
    .replace("_metadata.json", "");

  const parts = clean.split("_");

  // Extract date
  const month = parts[0];
  const day = parts[1];
  const year = parts[2];

  let time = "";

  // Time format 1: Time_HH_MM_SSPM
  const timeIndex = parts.indexOf("Time");
  if (timeIndex !== -1) {
    const h = parts[timeIndex + 1];
    const m = parts[timeIndex + 2];
    const s = parts[timeIndex + 3];
    time = `${h}:${m} ${s.replace(/(\d{2})(AM|PM)/, "$2")}`;
  } else {
    // Time format 2: HHMMSS or HH_MM_PM
    const timePart = parts.find(p =>
      p.includes("AM") ||
      p.includes("PM") ||
      /^\d{6}$/.test(p)
    );

    if (timePart) {
      if (/^\d{6}$/.test(timePart)) {
        const hh = timePart.slice(0, 2);
        const mm = timePart.slice(2, 4);
        time = `${hh}:${mm}`;
      } else {
        time = timePart.replace(/_/g, ":");
      }
    }
  }

  // Build readable output
  return `${month} ${day}, ${year} — ${time} — ${sizeFormatted}`;
}
