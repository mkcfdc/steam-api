import { useState } from 'react';
import PropTypes from 'prop-types';

import useSteam from '../hookers/useSteam';
import SteamUserGameStats from './SteamGameStats';

const SteamRecentlyPlayedGames = ({ steamId }) => {
  const { data, isLoading, error } = useSteam(steamId, 'recentlyplayedgames');
  const [selectedGameId, setSelectedGameId] = useState(null);

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Loading...</div>;

  const games = data?.games || [];

  const handleGameClick = (appId) => setSelectedGameId(appId === selectedGameId ? null : appId);

  return (
    <div>
      <h2>Recently Played Games</h2>
      <ul>
        {games.map(game => (
          <li key={game.appid} onClick={() => handleGameClick(game.appid)} style={{ cursor: 'pointer' }}>
            <img src={game.img_icon_url} alt={game.name} />
            <span>
              {game.name} - {game.playtime_forever_formatted}
            </span>
            {selectedGameId === game.appid && <SteamUserGameStats steamId={steamId} appId={String(game.appid)} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

SteamRecentlyPlayedGames.propTypes = {
  steamId: PropTypes.string.isRequired,
};

export default SteamRecentlyPlayedGames;

