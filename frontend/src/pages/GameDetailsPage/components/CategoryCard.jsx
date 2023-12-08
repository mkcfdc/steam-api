
import PropTypes from 'prop-types';
import { List, Tag, Card } from 'antd';

const CategoryCard = ({ categories }) => {
  return (
    <Card title="Game Categories" bordered={false} style={{ width: 300 }}>
      <List
        dataSource={categories}
        renderItem={item => (
          <List.Item>
            <Tag color="blue">{item.description}</Tag>
          </List.Item>
        )}
      />
    </Card>
  );
};

CategoryCard.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CategoryCard;
