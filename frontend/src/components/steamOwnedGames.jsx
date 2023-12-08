import { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'antd';
import useSteam from '../hookers/useSteam';
import SteamUserGameStats from './SteamGameStats';

const GameListItem = ({ game, isSelected, onGameClick, steamId }) => (
  <li onClick={() => onGameClick(game.appid)}>
    <img src={game.img_icon_url} alt={game.name} />
    <span>
      <a href={`steam://store/${game.appid}`} rel='noopener'>
        <strong>{game.name}</strong>
      </a>
      {game.discount_percent > 0 && (
        <Badge count={'Sale'} style={{ backgroundColor: '#52c41a', marginLeft: '8px' }} />
      )}
      - Total Playtime: {game.playtime_forever_formatted}
    </span>
    {isSelected && <SteamUserGameStats steamId={steamId} appId={String(game.appid)} />}
  </li>
);

GameListItem.propTypes = {
  game: PropTypes.shape({
    appid: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    img_icon_url: PropTypes.string.isRequired,
    playtime_forever_formatted: PropTypes.string.isRequired,
    discount_percent: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onGameClick: PropTypes.func.isRequired,
  steamId: PropTypes.number.isRequired,
};

const SteamOwnedGames = ({ steamId }) => {
  const { data, isLoading, error } = useSteam(steamId, 'ownedgames');
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [isAllGamesShown, setIsAllGamesShown] = useState(false);

  const handleGameClick = (appId) => setSelectedGameId(appId === selectedGameId ? null : appId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading games. Please try again later.</div>;

  const games = data?.games || [];
  const gamesToDisplay = isAllGamesShown ? games : games.slice(0, 5);

  return (
    <>
      <h2>Owned Games</h2>
      <ul>
        {gamesToDisplay.map(game => (
          <GameListItem
            key={game.appid}
            game={game}
            isSelected={selectedGameId === game.appid}
            onGameClick={handleGameClick}
            steamId={steamId}
          />
        ))}
      </ul>
      {games.length > 5 && (
        <button onClick={() => setIsAllGamesShown(prev => !prev)} className="toggleButton">
          {isAllGamesShown ? 'Hide' : `Display all ${games.length}`}
        </button>
      )}
    </>
  );
};

SteamOwnedGames.propTypes = {
  steamId: PropTypes.number.isRequired,
};

export default SteamOwnedGames;