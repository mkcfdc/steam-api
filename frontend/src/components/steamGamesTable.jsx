import PropTypes from 'prop-types';
import useSteam from '../hookers/useSteam'; // Adjust the import path as needed
import { Table } from 'antd';

const SteamGamesTable = ({ steamId }) => {
  const { data, isLoading, error } = useSteam(steamId, 'ownedgames');

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const columns = [
    {
      title: 'App ID',
      dataIndex: 'appid',
      key: 'appid',
      sorter: (a, b) => a.appid - b.appid,
    },
    {
      title: 'Icon',
      dataIndex: 'img_icon_url',
      key: 'img_icon_url',
      render: (text, record) => (
        record.img_icon_url ? <img src={record.img_icon_url} alt={record.name} style={{ width: 30, height: 30 }} /> : 'No Icon'
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Playtime Forever (hrs)',
      dataIndex: 'playtime_forever',
      key: 'playtime_forever',
      render: (text) => text !== undefined ? `${(text / 60).toFixed(2)}` : 'N/A',
      sorter: (a, b) => a.playtime_forever - b.playtime_forever,
    },
    {
      title: 'Community Stats',
      dataIndex: 'has_community_visible_stats',
      key: 'has_community_visible_stats',
      render: (text) => text ? 'Yes' : 'No',
      sorter: (a, b) => a.has_community_visible_stats - b.has_community_visible_stats,
    },
    {
      title: 'Playtime Windows (hrs)',
      dataIndex: 'playtime_windows_forever',
      key: 'playtime_windows_forever',
      render: (text) => text !== undefined ? `${(text / 60).toFixed(2)}` : 'N/A',
      sorter: (a, b) => a.playtime_windows_forever - b.playtime_windows_forever,
    },
    {
      title: 'Playtime Mac (hrs)',
      dataIndex: 'playtime_mac_forever',
      key: 'playtime_mac_forever',
      render: (text) => text !== undefined ? `${(text / 60).toFixed(2)}` : 'N/A',
      sorter: (a, b) => a.playtime_mac_forever - b.playtime_mac_forever,
    },
    {
      title: 'Playtime Linux (hrs)',
      dataIndex: 'playtime_linux_forever',
      key: 'playtime_linux_forever',
      render: (text) => text !== undefined ? `${(text / 60).toFixed(2)}` : 'N/A',
      sorter: (a, b) => a.playtime_linux_forever - b.playtime_linux_forever,
    },
    {
      title: 'Last Played',
      dataIndex: 'rtime_last_played',
      key: 'rtime_last_played',
      render: (text) => text ? new Date(text * 1000).toLocaleDateString() : 'Never',
      sorter: (a, b) => a.rtime_last_played - b.rtime_last_played,
    },
    {
      title: 'Playtime Disconnected (hrs)',
      dataIndex: 'playtime_disconnected',
      key: 'playtime_disconnected',
      render: (text) => text !== undefined ? `${(text / 60).toFixed(2)}` : 'N/A',
      sorter: (a, b) => a.playtime_disconnected - b.playtime_disconnected,
    },
    {
      title: 'Playtime Last 2 Weeks',
      dataIndex: 'playtime_2weeks_formatted',
      key: 'playtime_2weeks_formatted',
      // Assuming playtime_2weeks is available for sorting
      sorter: (a, b) => (a.playtime_2weeks || 0) - (b.playtime_2weeks || 0),
    },
    // {
    //   title: 'Playtime Forever Formatted',
    //   dataIndex: 'playtime_forever_formatted',
    //   key: 'playtime_forever_formatted',
    //   // No sorter added here as the formatted string is not straightforward to sort
    // },
    {
      title: 'Price (USD)',
      dataIndex: 'price',
      key: 'price',
      render: (text) => text !== undefined ? `$${text.toFixed(2)}` : 'N/A',
      sorter: (a, b) => (a.price || 0) - (b.price || 0),
    }
  ];
  

  // Assuming 'data' contains an array of games
  const dataSource = data?.games || [];

  return <Table dataSource={dataSource} columns={columns} rowKey="appid" />;
};

SteamGamesTable.propTypes = {
  steamId: PropTypes.string.isRequired, // Define steamId as a required string
};

export default SteamGamesTable;