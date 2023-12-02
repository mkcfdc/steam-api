import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const API_URL = import.meta.env.VITE_APP_API_URL;

const SteamUserGameStats = ({ steamId, appId }) => {
    const [gameStats, setGameStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/api/userstatsforgame/${steamId}/${appId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setGameStats(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [steamId, appId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!gameStats || gameStats.achievements.length === 0) {
        return <div>No achievements available for this game.</div>;
    }

    return (
        <div>
            <h2>Game Achievements for {gameStats.gameName}</h2>
            <ul>
                {gameStats.achievements.map(achievement => (
                    <li key={achievement.name}>
                        {achievement.name.replace(/_/g, ' ')}: {achievement.achieved === 1 ? 'Achieved' : 'Not Achieved'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

SteamUserGameStats.propTypes = {
    steamId: PropTypes.string.isRequired,
    appId: PropTypes.string.isRequired,
};

export default SteamUserGameStats;
