import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useSteam from '../hookers/useSteam';
import { getStatusClass, getStatusIcon } from '../helpers/steamStatus';

const SteamStatus = ({ steamId }) => {
  const { data: player, isLoading, error } = useSteam(steamId, 'stats'); // Use the custom hook

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
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
  );
};

SteamStatus.propTypes = {
  steamId: PropTypes.string.isRequired,
};

export default SteamStatus;