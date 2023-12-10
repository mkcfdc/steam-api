import { Card } from 'antd';

const PrivacyPage = () => (
  <Card title="Privacy Policy" bordered={false} style={{ width: 300 }}>
    <p>We do not store any user information.</p>
    <p>We only cache information from Steam and CdKeys.com APIs.</p>
    <p>No user information is stored.</p>
  </Card>
);

export default PrivacyPage;