import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const API_URL = import.meta.env.VITE_APP_API_URL;

const SteamAvatar = ({ steamId }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const fetchAvatar = async () => {
        try {
          const response = await fetch(`${API_URL}/api/stats/${steamId}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
      
          // Check if the response contains data
          if (Array.isArray(data) && data.length > 0) {
            const avatarFullUrl = data[0].avatarfull;
            setAvatarUrl(avatarFullUrl);
          } else {
            console.error('No avatar data found in the response');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    fetchAvatar();
  }, [steamId]);

  return (
    <div>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          style={{
            alignContent: 'center',
            borderRadius: '50%', // Make it round
            border: '2px solid #ccc', // Add a border
          }}
        />
      ) : (
        <p>Loading avatar...</p>
      )}
    </div>
  );

};

SteamAvatar.propTypes = {
    steamId: PropTypes.string.isRequired,
};

export default SteamAvatar;
