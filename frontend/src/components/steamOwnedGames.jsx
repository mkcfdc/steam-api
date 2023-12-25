import { useState } from 'react';
import PropTypes from 'prop-types';
import useSteam from '../hookers/useSteam';
import GameListItem from './gameListItem';
import SteamGamesTable from './steamGamesTable';

const SteamOwnedGames = ({ steamId }) => {
  const { data, isLoading, error } = useSteam(steamId, 'ownedgames');
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [isAllGamesShown, setIsAllGamesShown] = useState(false);
  const [isTableView, setIsTableView] = useState(false);

  const handleGameClick = (appId) => setSelectedGameId(appId === selectedGameId ? null : appId);
  const toggleView = () => setIsTableView(prev => !prev);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading games. Please try again later.</div>;

  const games = data?.games || [];
  const gamesToDisplay = isAllGamesShown ? games : games.slice(0, 5);

  return (
    <>
      <h2>Owned Games</h2> 
      <button onClick={toggleView}>{isTableView ? 'List View' : 'Table View'}</button>
      {isTableView ? (
        <SteamGamesTable steamId={steamId} games={games} />
      ) : (
        <>
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
      )}
    </>
  );
};

SteamOwnedGames.propTypes = {
  steamId: PropTypes.string.isRequired,
};

export default SteamOwnedGames;
