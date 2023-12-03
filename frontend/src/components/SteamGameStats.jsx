import PropTypes from 'prop-types';
import useSteam from '../hookers/useSteam';

const SteamUserGameStats = ({ steamId, appId }) => {
    const { data: gameStats, isLoading, error } = useSteam(steamId, `userstatsforgame/${appId}`);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Check if achievements data exists and is not empty
    const hasAchievements = gameStats && gameStats.achievements && gameStats.achievements.length > 0;
    if (!hasAchievements) return <div> No achievements available for this game.</div>;

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
