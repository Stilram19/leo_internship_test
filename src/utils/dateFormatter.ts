export function dayAndTimeDateFormat(date: number) {
    return (new Date(date).toLocaleString('en-US', {
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }))
}