import PropTypes from 'prop-types';
import useSteam from '../hookers/useSteam';

import PlaytimeInsult from './steamPlaytimeInsult';

const SteamTotalPlaytimeCard = ({ steamId }) => {
  const { data, isLoading } = useSteam(steamId, 'totalplaytime'); // Use the custom hook

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Total Playtime</h2>
        {isLoading ? (
          <p className="card-text">Loading total playtime...</p>
        ) : (
          <>
            <p className="card-text">Total playtime: {data?.total_playtime_forever_hours} hours</p>
            <div>
              <PlaytimeInsult steamId={steamId} />
            </div>
            <p className="card-text">Playtime in the last 2 weeks: {data?.total_playtime_week_hours} hours</p>
          </>
        )}
      </div>
    </div>
  );
};

SteamTotalPlaytimeCard.propTypes = {
  steamId: PropTypes.string.isRequired,
};

export default SteamTotalPlaytimeCard;

