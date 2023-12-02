import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const API_URL = import.meta.env.VITE_APP_API_URL;

const SteamOwnedGames = ({ steamId }) => {
    const [games, setGames] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/api/ownedgames/${steamId}`)
            .then(response => response.ok ? response.json() : Promise.reject('Failed to load'))
            .then(data => setGames(data.games.sort((a, b) => b.playtime_forever - a.playtime_forever)))
            .catch(setError)
            .finally(() => setIsLoading(false));
    }, [steamId]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Owned Games</h2>
            <ul>
                {(showAll ? games : games.slice(0, 5)).map(game => (
                    <li key={game.appid}>
                        <img src={game.img_icon_url} alt={game.name} />
                        <div><strong>{game.name}</strong> - Total Playtime: {game.playtime_forever_formatted}</div>
                    </li>
                ))}
            </ul>
            {games.length > 5 && (
                <button onClick={() => setShowAll(prev => !prev)}>
                    {showAll ? 'Hide' : `Display all ${games.length}`}
                </button>
            )}
        </div>
    );
};

SteamOwnedGames.propTypes = {
    steamId: PropTypes.string.isRequired,
};

export default SteamOwnedGames;