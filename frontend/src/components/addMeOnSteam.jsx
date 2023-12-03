import PropTypes from 'prop-types';

const AddMeOnSteam = ({ steamId }) => {
    return (
        <a 
            href={`steam://friends/add/${steamId}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="add-me-steam-button"
        >
            Add Me on Steam
        </a>
    );
};

AddMeOnSteam.propTypes = {
    steamId: PropTypes.string.isRequired,
};

export default AddMeOnSteam;