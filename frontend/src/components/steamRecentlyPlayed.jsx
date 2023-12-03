import { useState } from 'react';
import PropTypes from 'prop-types';
import useSteam from '../hookers/useSteam';
import SteamUserGameStats from './SteamGameStats';

const GameListItem = ({ game, steamId, isSelected, onClick }) => (
  <li onClick={onClick}>
    <img src={game.img_icon_url} alt={`Icon of ${game.name}`} />
    <span>
      {game.name} - {game.playtime_forever_formatted}
    </span>
    {isSelected && <SteamUserGameStats steamId={steamId} appId={String(game.appid)} />}
  </li>
);

GameListItem.propTypes = {
  game: PropTypes.shape({
    appid: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    img_icon_url: PropTypes.string.isRequired,
    playtime_forever_formatted: PropTypes.string.isRequired
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  steamId: PropTypes.number.isRequired
};

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