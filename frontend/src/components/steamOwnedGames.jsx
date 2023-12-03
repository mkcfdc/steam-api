import { useState } from 'react';
import PropTypes from 'prop-types';
import useSteam from '../hookers/useSteam';

import SteamUserGameStats from './SteamGameStats';

const SteamOwnedGames = ({ steamId }) => {
    const { data, isLoading, error } = useSteam(steamId, 'ownedgames');
    const [selectedGameId, setSelectedGameId] = useState(null);
    const [showAll, setShowAll] = useState(false);

    const handleGameClick = (appId) => setSelectedGameId(appId === selectedGameId ? null : appId);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const games = data?.games || [];

    // Determine which games to display
    const gamesToDisplay = showAll ? games : games.slice(0, 5);

    return (
        <>
            <h2>Owned Games</h2>
            <ul>

                {gamesToDisplay.map(game => (
                    <li key={game.appid} onClick={() => handleGameClick(game.appid)} style={{ cursor: 'pointer' }}>
                        <img src={game.img_icon_url} alt={game.name} />
                        <div>
                            <strong>{game.name}</strong> - Total Playtime: {game.playtime_forever_formatted}
                        </div>
                        {selectedGameId === game.appid && <SteamUserGameStats steamId={steamId} appId={String(game.appid)} />}
                    </li>
                ))}


            </ul>
            {games.length > 5 && (
                <button onClick={() => setShowAll(prev => !prev)}>
                    {showAll ? 'Hide' : `Display all ${games.length}`}
                </button>
            )}
        </>
    );
};

SteamOwnedGames.propTypes = {
    steamId: PropTypes.string.isRequired,
};

export default SteamOwnedGames;
