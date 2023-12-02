import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const API_URL = import.meta.env.VITE_APP_API_URL;

const SteamRecentlyPlayedGames = ({ steamId }) => {
    const [games, setGames] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/api/recentlyplayedgames/${steamId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setGames(data.games || []);
            })
            .catch(error => {
                setError(error.message);
            });
    }, [steamId]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Recently Played Games</h2>
            <ul>
                {games.map(game => (
                    <li key={game.appid}>
                        <img src={game.img_icon_url} alt={game.name} />
                        <span>{game.name} - {game.playtime_forever_formatted}</span>
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
