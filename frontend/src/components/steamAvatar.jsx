import PropTypes from 'prop-types';
import useSteam from '../hookers/useSteam.js'; // Import your custom hook

const SteamAvatar = ({ steamId }) => {
  const { data, isLoading, error } = useSteam(steamId, 'stats'); // Use the custom hook

  return (
    <div>
      {isLoading ? (
        <p>Loading avatar...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : data ? (
        <img
          src={data.avatarfull}
          alt="Avatar"
          style={{
            alignContent: 'center',
            borderRadius: '50%', // Make it round
            border: '2px solid #ccc', // Add a border
          }}
        />
      ) : (
        <p>No avatar data found</p>
      )}
    </div>
  );
};

SteamAvatar.propTypes = {
  steamId: PropTypes.string.isRequired,
};

export default SteamAvatar;
