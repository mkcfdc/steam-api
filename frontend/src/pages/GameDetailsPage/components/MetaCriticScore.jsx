import PropTypes from 'prop-types';
import { Badge } from 'antd';

const getBadgeColor = (score) => {
  if (score >= 80) return 'gold';
  if (score >= 70) return 'green';
  if (score >= 50) return 'orange';
  return 'red';
};

const MetacriticScore = ({ score, url }) => {
  const badgeColor = getBadgeColor(score);

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Badge 
        count={score} 
        style={{ 
          backgroundColor: badgeColor, 
          fontSize: '40px',
          padding: '60px',
          borderRadius: '10px',
        }} 
      />
    </a>
  );
};

MetacriticScore.propTypes = {
  score: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired
};

export default MetacriticScore;