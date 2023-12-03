// Helper function to format playtime in minutes to hours and minutes
export function formatPlaytime(minutes) {
    if (minutes == null || minutes === 0) return '0 hrs';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hrs ${remainingMinutes} mins`;
}

// Helper function to format Date
export const formatDate = (date) => date.toLocaleDateString("en-US") + ' ' + date.toLocaleTimeString("en-US");