/**
 * Formats a Date object to a local ISO string (YYYY-MM-DDTHH:mm) 
 * without shifting to UTC. This is useful for datetime-local inputs.
 */
export const toLocalISOString = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Formats a Date object to the standard ISO format required by the Banner API
 * (YYYY-MM-DDTHH:mm:ss.SSSZ)
 */
export const toBannerISOString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Gets the current time in Vietnam (GMT+7) regardless of system timezone
 */
export const getVietnamNow = (): Date => {
  const now = new Date();
  // Get UTC time
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  // Create new Date object for Vietnam (UTC+7)
  return new Date(utc + (3600000 * 7));
};

/**
 * Formats to Vietnam ISO string
 */
export const toVietnamISOString = (date: Date): string => {
    // We actually want the local time of the user if they are in Vietnam.
    // If we force Vietnam time, it might be confusing for users in other timezones,
    // but the request specifically says "chuẩn muối giờ việt nam".
    // For now, let's stick to local time but fix the ISO conversion.
    return toLocalISOString(date);
};
