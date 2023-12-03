// Helper function to get descriptive status from personastate
export function getPersonaStateDescription(personastate) {
    const states = {
        0: 'Offline',
        1: 'Online',
        2: 'Busy',
        3: 'Away',
        4: 'Snooze',
        5: 'Looking to trade',
        6: 'Looking to play'
    };
    return states[personastate] || 'Unknown';
}