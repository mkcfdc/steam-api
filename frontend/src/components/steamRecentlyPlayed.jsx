import { useState } from 'react';
import PropTypes from 'prop-types';
import useSteam from '../hookers/useSteam';
import GameListItem from './gameListItem';

const SteamRecentlyPlayedGames = ({ steamId }) => {
  const { data, isLoading, error } = useSteam(steamId, 'recentlyplayedgames');
  const [selectedGameId, setSelectedGameId] = useState(null);

  if (error) return <div>Error loading games. Please try again later.</div>;
  if (isLoading) return <div>Loading...</div>;

  const games = data?.games || [];
  const handleGameClick = (appId) => setSelectedGameId(appId === selectedGameId ? null : appId);

  return (
    <div>
      <h2>Recently Played Games</h2>
      <ul>
        {games.map(game => (
          <GameListItem
            key={game.appid}
            steamId={steamId}
            game={game}
            isSelected={selectedGameId === game.appid}
            onClick={() => handleGameClick(game.appid)}
          />
        ))}
      </ul>
    </div>
  );
};

SteamRecentlyPlayedGames.propTypes = {
  steamId: PropTypes.string.isRequired,
};

export default SteamRecentlyPlayedGames;