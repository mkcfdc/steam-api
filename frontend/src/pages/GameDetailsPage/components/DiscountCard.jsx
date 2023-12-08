import { Card, Tag, Badge } from 'antd';
import PropTypes from 'prop-types';

const DiscountCard = ({ priceOverview }) => {
  if (!priceOverview) return null;
  
  const { final, final_formatted, currency, discount_percent } = priceOverview || {};
  const formattedPrice = final_formatted || `${currency} ${final / 100}`;
  const discountPercent = discount_percent || 0;

  return (
    <Card>
      <div>
        <Tag color={discountPercent > 0 ? 'green' : 'default'}>{formattedPrice}</Tag>
        {discountPercent > 0 && (
          <Badge
            count={`${discountPercent}% Off`}
            style={{ backgroundColor: '#52c41a' }}
            aria-label={`${discountPercent}% Off`}
          />
        )}
      </div>
    </Card>
  );
};

// Define PropTypes for the component with priceOverview prop
DiscountCard.propTypes = {
  priceOverview: PropTypes.shape({
    final: PropTypes.number,
    final_formatted: PropTypes.string,
    currency: PropTypes.string,
    discount_percent: PropTypes.number,
  }),
};

export default DiscountCard;