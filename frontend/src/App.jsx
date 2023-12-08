import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import { Layout, Spin, Typography, Row, Col, Alert } from 'antd';
import axios from 'axios';

import SteamStatus from './components/steamStatus';
import SteamRecentlyPlayedGames from './components/steamRecentlyPlayed';
import SteamOwnedGames from './components/steamOwnedGames';
import AddMeOnSteam from './components/addMeOnSteam';
import SteamAvatar from './components/steamAvatar';
import SteamTotalPlaytimeCard from './components/steamTotalPlaytimeCard';
import SteamTotalDollarSpent from './components/steamTotalSpent';

import './App.css';
import SteamGamesTable from './components/steamGamesTable';
import GameDetailsPage from './pages/GameDetailsPage/steamGameDetails';

const { Header, Content } = Layout;
const { Title } = Typography;

const HomePage = () => {
    const { steamName } = useParams();
    const defaultSteamId = import.meta.env.VITE_APP_STEAM_ID;
    const [steamId, setSteamId] = useState(defaultSteamId);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSteamId = async () => {
            if (!steamName) return;

            // Check if steamName is already a numeric Steam ID
            if (/^\d+$/.test(steamName)) return setSteamId(steamName);

            try {
                setLoading(true);
                const response = await axios.get(import.meta.env.VITE_APP_API_URL + `/resolveVanity/${steamName}`);
                if (response.data?.steamId) {
                    setSteamId(response.data.steamId);
                } else {
                    setError('Steam ID not found for given username');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSteamId();
    }, [steamName]);

    return (
        <Layout style={{ backgroundColor: '#121212' }}>
            <Header>
                <Title level={2}>Welcome to {steamName} Steam Profile Page</Title>
            </Header>
            <Content>
                {isLoading ? (
                    <Spin size="large" />
                ) : error ? (
                    <Alert message={`Error: ${error}`} type="error" />
                ) : (
                    <>
                        <Row gutter={[16, 16]} justify="center">
                            <Col>
                                <SteamAvatar steamId={steamId} />
                            </Col>
                            <Col>
                                <SteamStatus steamId={steamId} />
                            </Col>
                            <Col>
                                <AddMeOnSteam steamId={steamId} />
                            </Col>
                        </Row>
                        <Row gutter={[16, 16]} justify="center">
                            <Col>
                                <SteamTotalPlaytimeCard steamId={steamId} />
                            </Col>
                            <Col>
                                <SteamTotalDollarSpent steamId={steamId} />
                            </Col>
                        </Row>
                        <Row justify="center">
                            <Col span={24}>
                                <SteamRecentlyPlayedGames steamId={steamId} />
                            </Col>
                        </Row>
                        <Row justify="center">
                            <Col span={24}>
                                <SteamOwnedGames steamId={steamId} />
                            </Col>
                        </Row>
                    </>
                )}
            </Content>
        </Layout>
    );
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/:steamName" element={<HomePage />} />
                <Route path="/app/:appId" element={<GameDetailsPage />} />
                <Route path="/table" element={<SteamGamesTable steamId='76561198092215183' />} />
            </Routes>
        </Router>
    );
};

export default App;