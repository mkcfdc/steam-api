import PropTypes from 'prop-types';
import useSteam from '../hookers/useSteam';
import { Statistic, Row, Col } from 'antd';
import CountUp from 'react-countup';

const SteamTotalDollarSpent = ({ steamId }) => {
  const { data, isLoading } = useSteam(steamId, 'ownedgames');

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Statistic
          title={<h2 style={{ color: '#E0E0E0' }}>Total Dollars Spent</h2>}
          value={isLoading ? 0 : data?.total_spent || 0}
          precision={2}
          formatter={(value) => (
            <CountUp
              end={value}
              separator=","
              style={{ fontSize: '24px', color: 'green' }}
              start={0} // Start from 0 to include the dollar sign
              decimals={2} // Display two decimal places
              prefix="$" // Add a dollar sign prefix
            />
          )}
        />
      </Col>
    </Row>
  );
};

SteamTotalDollarSpent.propTypes = {
  steamId: PropTypes.string.isRequired,
};

export default SteamTotalDollarSpent;
