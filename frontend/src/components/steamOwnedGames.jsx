import { useState } from 'react';
import PropTypes from 'prop-types';
import useSteam from '../hookers/useSteam'; // Import your custom hook

const SteamOwnedGames = ({ steamId }) => {
    const { data, isLoading, error } = useSteam(steamId, 'ownedgames'); // Use the custom hook
    const [showAll, setShowAll] = useState(false);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const games = data?.games || [];

    return (
        <div>
            <h2>Owned Games</h2>
            <ul>


                {games.slice(0, 5).map(game => (
                    <li key={game.appid}>
                        <img src={game.img_icon_url} alt={game.name} />
                        <div>
                            <strong>{game.name}</strong> - Total Playtime: {game.playtime_forever_formatted}
                        </div>
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