import PropTypes from 'prop-types';

import useSteam from '../hookers/useSteam';

import styles from './SteamAvatar.module.css';

const SteamAvatar = ({ steamId }) => {
  const { data, isLoading, error } = useSteam(steamId, 'stats');

  if (isLoading) return <p>Loading avatar...</p>;
  if (error) return <p>Unable to load avatar. Please try again later.</p>;
  if (!data) return <p>Avatar not available.</p>;

  return <img src={data.avatarfull} alt="Avatar" className={styles.avatar} />;
};

SteamAvatar.propTypes = {
  steamId: PropTypes.string.isRequired,
};

export default SteamAvatar;