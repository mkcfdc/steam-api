import SteamStatus from './components/steamStatus';
import SteamRecentlyPlayedGames from './components/steamRecentlyPlayed';
import SteamOwnedGames from './components/steamOwnedGames';
import AddMeOnSteam from './components/addMeOnSteam';
import SteamAvatar from './components/steamAvatar';
import SteamTotalPlaytimeCard from './components/steamTotalPlaytimeCard';

import './App.css';

const HomePage = () => {
    const steamId = import.meta.env.VITE_APP_STEAM_ID;

    return (
        <>
            <h1>Welcome to My Steam Profile Page</h1>

            <div className="steam-components">
                <span><SteamAvatar steamId={steamId} /></span>
                <span><SteamStatus steamId={steamId} /></span>
                <span><AddMeOnSteam steamUsername='gladwater' /></span>
            </div>

            <div>
                <SteamTotalPlaytimeCard steamId={steamId} />
            </div>

            <SteamRecentlyPlayedGames steamId={steamId} />
            <SteamOwnedGames steamId={steamId} />
        </>
    );
};

export default HomePage;
