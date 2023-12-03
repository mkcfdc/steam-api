import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faUser, faUserSlash, faUserClock, faGamepad } from '@fortawesome/free-solid-svg-icons';
import useSteam from '../hookers/useSteam'; // Import your custom hook

const SteamStatus = ({ steamId }) => {
  const { data: player, isLoading, error } = useSteam(steamId, 'stats'); // Use the custom hook

  if (isLoading) return <div>Loading...</div>;

  const getStatusIcon = (personastate, gameextrainfo) => {
    const statusIcons = {
      0: faUserSlash, // Offline
      1: faUser,     // Online
      2: faUserClock // Away
    };
    return gameextrainfo ? faGamepad : (statusIcons[personastate] || faCircleNotch);
  };

  const getStatusClass = (personastate) => {
    const statusClasses = {
      0: 'status-offline',
      1: 'status-online',
      2: 'status-away'
    };
    return statusClasses[personastate] || '';
  };

  return (
    <>
      {error ? (
        <span>Error: {error}</span>
      ) : (
        <>
          <span className={getStatusClass(player?.personastate)}>
            <FontAwesomeIcon icon={getStatusIcon(player?.personastate, player?.gameextrainfo)} />
            Status: {player?.personastate_formatted || 'Unknown status'}
            {player?.gameextrainfo && <span> - Playing {player?.gameextrainfo}</span>}
          </span>
          {player?.gameserverip && (
            <a href={`steam://connect/${player?.gameserverip}`} className="join-game-button">
              Join Now
            </a>
          )}
        </>
      )}
    </>
  );
};

SteamStatus.propTypes = {
  steamId: PropTypes.string.isRequired,
};

export default SteamStatus;