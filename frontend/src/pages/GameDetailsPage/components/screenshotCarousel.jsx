import { Carousel, Image } from 'antd';
import PropTypes from 'prop-types';
import './screenshotCarousel.style.css';

const ScreenShotCarousel = ({ screenshots }) => {
  return (
    <div className="screenshot-carousel">
      <Carousel autoplay>
        {screenshots?.map((screenshot) => {
          const imagePath = screenshot.path_full.split('?')[0];

          return (
            <div key={screenshot.id} className="screenshot-item">
              <Image
                src={imagePath}
                alt={`Screenshot ${screenshot.id + 1}`}
                className="screenshot-image"
              />
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

// Define PropTypes for the 'screenshots' prop
ScreenShotCarousel.propTypes = {
  screenshots: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      path_thumbnail: PropTypes.string,
      path_full: PropTypes.string.isRequired,
    })
  ),
};

export default ScreenShotCarousel;