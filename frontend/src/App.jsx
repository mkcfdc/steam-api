import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';

import axios from 'axios';

import SteamStatus from './components/steamStatus';
import SteamRecentlyPlayedGames from './components/steamRecentlyPlayed';
import SteamOwnedGames from './components/steamOwnedGames';
import AddMeOnSteam from './components/addMeOnSteam';
import SteamAvatar from './components/steamAvatar';
import SteamTotalPlaytimeCard from './components/steamTotalPlaytimeCard';

import './App.css';

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


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <h1>Welcome to {steamName} Steam Profile Page</h1>

            <div className="steam-components">
                <span><SteamAvatar steamId={steamId} /></span>
                <span><SteamStatus steamId={steamId} /></span>
                <span><AddMeOnSteam steamId={steamId} /></span>
            </div>

            <div>
                <SteamTotalPlaytimeCard steamId={steamId} />
            </div>

            <SteamRecentlyPlayedGames steamId={steamId} />
            <SteamOwnedGames steamId={steamId} />
        </>
    );
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/:steamName" element={<HomePage />} />
            </Routes>
        </Router>
    );
};

export default App;