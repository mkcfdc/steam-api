import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faUser, faUserSlash, faUserClock, faGamepad } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_APP_API_URL;

const SteamStatus = ({ steamId }) => {
    const [status, setStatus] = useState({
        text: 'Loading...',
        icon: faCircleNotch,
        class: '',
        game: null,
        gameserverip: null
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_URL}/api/stats/${steamId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const player = data[0];
                if (player) {
                    setStatus({
                        text: player.personastate_formatted || 'Unknown status',
                        icon: getStatusIcon(player.personastate, player.gameextrainfo),
                        class: getStatusClass(player.personastate),
                        game: player.gameextrainfo || null,
                        gameserverip: player.gameserverip || null
                    });
                } else {
                    setError('Player not found');
                }
            })
            .catch(error => {
                setError(error.message);
            });
    }, [steamId]);

    const getStatusIcon = (personastate, game) => {
        if (game) return faGamepad;
        switch (personastate) {
            case 0: return faUserSlash; // Offline
            case 1: return faUser; // Online
            case 2: return faUserClock; // Away
            default: return faCircleNotch; // Loading or unknown status
        }
    };

    const getStatusClass = (personastate) => {
        switch (personastate) {
            case 0: return 'status-offline';
            case 1: return 'status-online';
            case 2: return 'status-away';
            default: return '';
        }
    };

    return (
        <div>
            {error ? (
                <span>Error: {error}</span>
            ) : (
                <>
                    <span className={status.class}>
                        <FontAwesomeIcon icon={status.icon} />
                        Status: {status.text}
                        {status.game && <span> - Playing {status.game}</span>}
                    </span>
                    {status.gameserverip && (
                        <a href={`steam://connect/${status.gameserverip}`} className="join-game-button">
                            Join Now
                        </a>
                    )}
                </>
            )}
        </div>
    );
};

SteamStatus.propTypes = {
    steamId: PropTypes.string.isRequired,
};

export default SteamStatus;