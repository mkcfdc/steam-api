import { faCircleNotch, faUser, faUserSlash, faUserClock, faGamepad } from '@fortawesome/free-solid-svg-icons';

export const getStatusIcon = (personastate, gameextrainfo) => {
  const statusIcons = {
    0: faUserSlash, // Offline
    1: faUser,     // Online
    2: faUserClock // Away
  };
  return gameextrainfo ? faGamepad : (statusIcons[personastate] || faCircleNotch);
};

export const getStatusClass = (personastate) => {
  const statusClasses = {
    0: 'status-offline',
    1: 'status-online',
    2: 'status-away'
  };
  return statusClasses[personastate] || '';
};