import PropTypes from 'prop-types';
import { Card, Row, Col } from 'antd';

const AchievementsCard = ({ achievements }) => {
  return (
    <Card title="Achievements" bordered={false} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        {achievements.highlighted.slice(0, 5).map((achievement, index) => (
          <Col key={index} span={4}>
            <img
              src={achievement.path}
              alt={achievement.name}
              style={{ width: '100%', height: 'auto' }}
            />
          </Col>
        ))}
        {achievements.total > 5 && (
          <Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', backgroundColor: '#f0f2f5' }}>
            +{achievements.total - 5}
          </Col>
        )}
      </Row>
    </Card>
  );
};

AchievementsCard.propTypes = {
  achievements: PropTypes.shape({
    total: PropTypes.number.isRequired,
    highlighted: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default AchievementsCard; 
