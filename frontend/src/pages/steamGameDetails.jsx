import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Descriptions, Carousel, Tabs, Tag, Badge } from 'antd';

const { Title } = Typography;
const { TabPane } = Tabs;

const GameDetailsComponent = () => {
    const { appId } = useParams();
    const [gameDetails, setGameDetails] = useState(null);
    // Axios the endpoint. gameData.

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const response = await axios.post(import.meta.env.VITE_APP_API_URL + '/appdetails', { appids: [appId] });
                setGameDetails(response.data[0]);
            } catch (error) {
                console.error('Error fetching game details:', error);
                // Optionally handle the error, e.g., set an error state
            }
        };

        fetchGameDetails();
    }, [appId]);

    const gameData = gameDetails;

    if (!gameData) {
        return <div>Loading...</div>;
    }

    const { pcRequirements, macRequirements, linuxRequirements } = gameData;

    const price = gameData.priceOverview?.final_formatted || `${gameData.priceOverview?.currency} ${gameData.priceOverview?.final / 100}`;
    const discountPercent = gameData.priceOverview?.discount_percent;

    return (
        <div>

            <Typography>
                <Title level={2}>Description</Title>
                <div dangerouslySetInnerHTML={{__html: gameData.detailed_description}}></div>
            </Typography>

            <Descriptions title="Game Details">
                <Descriptions.Item label="Steam App ID">{gameData.steam_appid}</Descriptions.Item>
                <Descriptions.Item label="Required Age">{gameData.required_age}</Descriptions.Item>
                <Descriptions.Item label="Supported Languages">{gameData.supported_languages}</Descriptions.Item>
                {/* Add more Descriptions.Item components for other details */}
            </Descriptions>

            <Carousel autoplay>
                {gameData.screenshots?.map((screenshot, index) => (
                    <div key={index}>
                        <img
                            src={screenshot.path_full}
                            alt={`Screenshot ${index + 1}`}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                ))}
            </Carousel>

            <Tabs defaultActiveKey="1">
                <TabPane tab="PC Requirements" key="1">
                    <div dangerouslySetInnerHTML={{ __html: pcRequirements?.minimum }} />
                    {/* You can also display recommended requirements if available */}
                </TabPane>
                <TabPane tab="Mac Requirements" key="2">
                    <div dangerouslySetInnerHTML={{ __html: macRequirements?.minimum }} />
                    {/* Similar for Mac */}
                </TabPane>
                <TabPane tab="Linux Requirements" key="3">
                    <div dangerouslySetInnerHTML={{ __html: linuxRequirements?.minimum }} />
                    {/* Similar for Linux */}
                </TabPane>
            </Tabs>

            <div>
                <Tag color={discountPercent > 0 ? "green" : "default"}>{price}</Tag>
                {discountPercent > 0 && <Badge count={`${discountPercent}% Off`} style={{ backgroundColor: '#52c41a' }} />}
            </div>
        </div>
    );
};

export default GameDetailsComponent;

