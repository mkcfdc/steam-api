import PropTypes from 'prop-types';
import useSteam from '../hookers/useSteam'; // Import your custom hook

const SteamRecentlyPlayedGames = ({ steamId }) => {
  const { data, isLoading, error } = useSteam(steamId, 'recentlyplayedgames'); // Use the custom hook

  if (error) return <div>Error: {error}</div>;
  if (isLoading) return <div>Loading...</div>;

  const games = data?.games || [];

  return (
    <div>
      <h2>Recently Played Games</h2>
      <ul>

        {games?.map(game => (
          <li key={game.appid}>
            <img src={game.img_icon_url} alt={game.name} />
            <span>
              {game.name} - {game.playtime_forever_formatted}
            </span>
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
