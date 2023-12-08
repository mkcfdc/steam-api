
import { Tabs, Card } from 'antd';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindows, faApple, faLinux } from '@fortawesome/free-brands-svg-icons';

const GameRequirementsTab = ({ pcRequirements, macRequirements, linuxRequirements }) => {
  const items = [
    {
      key: 'pc',
      label: <><FontAwesomeIcon icon={faWindows} /> PC Requirements</>,
      children: (
        <div>
          <div dangerouslySetInnerHTML={{ __html: pcRequirements?.minimum }} />
          {pcRequirements?.recommended && (
            <div>
              <h3>Recommended Requirements</h3>
              <div dangerouslySetInnerHTML={{ __html: pcRequirements.recommended }} />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'mac',
      label: <><FontAwesomeIcon icon={faApple} /> Mac Requirements</>,
      children: (
        <div>
          <div dangerouslySetInnerHTML={{ __html: macRequirements?.minimum }} />
          {macRequirements?.recommended && (
            <div>
              <h3>Recommended Requirements</h3>
              <div dangerouslySetInnerHTML={{ __html: macRequirements.recommended }} />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'linux',
      label: <><FontAwesomeIcon icon={faLinux} /> Linux Requirements</>,
      children: (
        <div>
          <div dangerouslySetInnerHTML={{ __html: linuxRequirements?.minimum }} />
          {linuxRequirements?.recommended && (
            <div>
              <h3>Recommended Requirements</h3>
              <div dangerouslySetInnerHTML={{ __html: linuxRequirements.recommended }} />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card style={{backgroundColor: '#121212'}}>
    <Tabs defaultActiveKey="pc" items={items} />
    </Card>
  );
};

GameRequirementsTab.propTypes = {
  pcRequirements: PropTypes.shape({
    minimum: PropTypes.string,
    recommended: PropTypes.string,
  }),
  macRequirements: PropTypes.shape({
    minimum: PropTypes.string,
    recommended: PropTypes.string,
  }),
  linuxRequirements: PropTypes.shape({
    minimum: PropTypes.string,
    recommended: PropTypes.string,
  }),
};

export default GameRequirementsTab;