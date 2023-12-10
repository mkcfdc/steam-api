import { useState } from 'react';
import { Badge, Popover, Modal } from 'antd';
import PropTypes from 'prop-types';
import SteamUserGameStats from './SteamGameStats';
import CdKeysTable from '../pages/CdKeysModal/CdKeysTable';

import './gameListItem.style.css';

const GameListItem = ({ game, isSelected, onGameClick, steamId }) => {
  const { appid, name, capsule_image, playtime_forever_formatted, discount_percent } = game;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const getSteamLink = (appid) => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isWindows = userAgent.includes('windows');
    // const isLinux = userAgent.includes('linux'); // All phones are Linux... so just check for windows.

    // If Windows or Linux, return steam protocol link
    if (isWindows) return `steam://store/${appid}`;

    // For other platforms, return web URL
    return `https://store.steampowered.com/app/${appid}`;
  };

const popoverContent = (
  <div>
    <a href="#" onClick={showModal}>Search CDKeys.com</a>
  </div>
);

return (
  <li role="button" onClick={() => onGameClick(appid)} tabIndex={0}>
    <img src={capsule_image} alt={name} onError={(e) => e.target.src = 'path/to/placeholder.png'} />
    <span>
      <Popover content={popoverContent} title={name} trigger="hover">
        <a href={getSteamLink(appid)} rel='noopener noreferrer'>
          <strong>{name}</strong>
        </a>
      </Popover>
      {Number(discount_percent) > 0 && (
        <Badge count={'Sale'} style={{ backgroundColor: '#52c41a', marginLeft: '8px' }} />
      )}
      - Total Playtime: {playtime_forever_formatted}
    </span>
    {isSelected && <SteamUserGameStats steamId={steamId} appId={String(appid)} />}
    <Modal title={`Search results for "${name}"`} className="cdkeysTableModal" open={isModalVisible} onCancel={handleCancel} footer={null}>
      <CdKeysTable query={name} />
    </Modal>
  </li>
);
};

GameListItem.propTypes = {
  game: PropTypes.shape({
    appid: PropTypes.number,
    name: PropTypes.string,
    capsule_image: PropTypes.string,
    playtime_forever_formatted: PropTypes.string,
    discount_percent: PropTypes.number,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onGameClick: PropTypes.func.isRequired,
  steamId: PropTypes.number.isRequired,
};

export default GameListItem;