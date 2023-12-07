import PropTypes from 'prop-types';
import useSteam from '../hookers/useSteam'; // Import your custom hook

const PlaytimeInsult = ({ steamId }) => {
  const { data: playtime, isLoading, error } = useSteam(steamId, 'totalplaytime');
  const insults = [
    "playing games",
    "wasting time",
    "avoiding responsibilities",
    "ignoring the real world",
    "pretending to be productive",
  ];


    if (error) return <div>Error fetching playtime data: {error}</div>;

  // Function to format the playtime duration
  const formatPlaytime = (minutes) => {
    const years = Math.floor(minutes / (60 * 24 * 365));
    const months = Math.floor((minutes % (60 * 24 * 365)) / (60 * 24 * 30));
    const days = Math.floor((minutes % (60 * 24 * 30)) / (60 * 24));
    const hours = Math.floor((minutes % (60 * 24)) / 60);
    const remainingMinutes = minutes % 60;

    const formattedTime = [];
    if (years > 0) formattedTime.push(`${years} years`);
    if (months > 0) formattedTime.push(`${months} months`);
    if (days > 0) formattedTime.push(`${days} days`);
    if (hours > 0) formattedTime.push(`${hours} hours`);
    if (remainingMinutes > 0) formattedTime.push(`${remainingMinutes} minutes`);

    return formattedTime.join(', ');
  };

  // Function to select a random insult
  const getRandomInsult = () => {
    const randomIndex = Math.floor(Math.random() * insults.length);
    return insults[randomIndex];
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <p>
          You have spent {formatPlaytime(playtime?.total_playtime_forever_minutes || 0)} {getRandomInsult()}.
        </p>
      )}
    </div>
  );
};

PlaytimeInsult.propTypes = {
  steamId: PropTypes.string.isRequired,
};

export default PlaytimeInsult;
