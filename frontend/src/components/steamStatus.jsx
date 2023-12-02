import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faUser, faUserSlash, faUserClock, faGamepad } from '@fortawesome/free-solid-svg-icons';
import useSteam from '../hookers/useSteam'; // Import your custom hook

const SteamStatus = ({ steamId }) => {
  const { data: player, error } = useSteam(steamId, 'stats'); // Use the custom hook

  const getStatusIcon = (personastate, gameextrainfo) => {
    if (gameextrainfo) return faGamepad;
    switch (personastate) {
      case 0:
        return faUserSlash; // Offline
      case 1:
        return faUser; // Online
      case 2:
        return faUserClock; // Away
      default:
        return faCircleNotch; // Loading or unknown status
    }
  };

  const getStatusClass = (personastate) => {
    switch (personastate) {
      case 0:
        return 'status-offline';
      case 1:
        return 'status-online';
      case 2:
        return 'status-away';
      default:
        return '';
    }
  };

  return (
    <div>
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
    </div>
  );
};

SteamStatus.propTypes = {
  steamId: PropTypes.string.isRequired,
};

export default SteamStatus;