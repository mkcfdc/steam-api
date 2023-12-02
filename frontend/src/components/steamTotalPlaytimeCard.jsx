import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const API_URL = import.meta.env.VITE_APP_API_URL;

const SteamTotalPlaytimeCard = ({ steamId }) => {
  const [totalPlaytimeHours, setTotalPlaytimeHours] = useState(null);
  const [totalPlaytimeWeekHours, setTotalPlaytimeWeekHours] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/totalplaytime/${steamId}`)
      .then((response) => response.json())
      .then((data) => {
        const totalHours = data.total_playtime_forever_hours;
        const totalWeekHours = data.total_playtime_week_hours;
        setTotalPlaytimeHours(totalHours);
        setTotalPlaytimeWeekHours(totalWeekHours);
      })
      .catch((error) => {
        console.error('Error fetching total playtime:', error);
      });
  }, [steamId]);

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Total Playtime</h2>
        {totalPlaytimeHours !== null ? (
          <p className="card-text">Total playtime: {totalPlaytimeHours} hours</p>
        ) : (
          <p className="card-text">Loading total playtime...</p>
        )}

        {totalPlaytimeWeekHours !== null ? (
          <p className="card-text">Playtime in the last 2 weeks: {totalPlaytimeWeekHours} hours</p>
        ) : (
          <p className="card-text">Loading playtime in the last 2 weeks...</p>
        )}
      </div>
    </div>
  );
};

SteamTotalPlaytimeCard.propTypes = {
  steamId: PropTypes.string.isRequired,
};

export default SteamTotalPlaytimeCard;

