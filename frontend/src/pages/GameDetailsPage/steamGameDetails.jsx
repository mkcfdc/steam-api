import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Descriptions, Row, Col, Layout, Space } from 'antd';

import GameRequirementsTab from './components/gameRequirmentsTab';
import DiscountCard from './components/DiscountCard';
import ScreenShotCarousel from './components/screenshotCarousel';
import MetacriticScore from './components/MetaCriticScore';
import AchievementsCard from './components/AchievementsCard';
import CategoryCard from './components/CategoryCard';

const { Title } = Typography;
const { Content } = Layout;

const GameDetailsPage = () => {
    const { appId } = useParams();
    const [gameDetails, setGameDetails] = useState(null);

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

    if (!gameDetails) return <div>Loading...</div>;

    // Deconstruct some shit
    const { score: criticScore, url: criticUrl } = gameDetails.metacritic;
    const { pc_requirements, mac_requirements, linux_requirements } = gameDetails;

    return (
        <Layout style={{
            backgroundColor: '#121212',
            backgroundImage: `url(${gameDetails.background_raw})`,
            backgroundSize: 'cover', // This ensures that the background covers the entire Layout
            backgroundPosition: 'center', // This centers the background image
            backgroundRepeat: 'no-repeat' // This prevents the image from repeating
        }}>
            <Content>
                <Space direction="horizontal" size={16} style={{ width: '100%' }}>
                    <Title level={2}>Description</Title>
                    <div dangerouslySetInnerHTML={{ __html: gameDetails.short_description }}></div>

                    <Row gutter={16}>

                        <Col span={12}>
                            <Descriptions title="Game Details">
                                <Descriptions.Item label="Steam App ID">{gameDetails.steam_appid}</Descriptions.Item>
                                <Descriptions.Item>{gameDetails.name}</Descriptions.Item>
                                <Descriptions.Item label="Supported Languages">{gameDetails.supported_languages}</Descriptions.Item>
                            </Descriptions>
                        </Col>

                        <Col span={12}>

                            <MetacriticScore score={criticScore} url={criticUrl} />

                            <DiscountCard priceOverview={gameDetails?.price_overview} />

                            <AchievementsCard achievements={gameDetails.achievements} />

                            <CategoryCard categories={gameDetails.categories} />

                            <Title level={2}>Requirements</Title>
                            <GameRequirementsTab pcRequirements={pc_requirements} macRequirements={mac_requirements} linuxRequirements={linux_requirements} />


                        </Col>

                    </Row>

                    <Title level={2}>Screenshots</Title>
                    <ScreenShotCarousel screenshots={gameDetails?.screenshots} />

                </Space>
            </Content>
        </Layout>
    );
};

export default GameDetailsPage;

