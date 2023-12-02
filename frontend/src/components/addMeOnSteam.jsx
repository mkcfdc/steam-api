import PropTypes from 'prop-types';

const AddMeOnSteam = ({ steamUsername }) => {
    return (
        <a 
            href={`https://steamcommunity.com/id/${steamUsername}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="add-me-steam-button"
        >
            Add Me on Steam
        </a>
    );
};

AddMeOnSteam.propTypes = {
    steamUsername: PropTypes.string.isRequired,
};

export default AddMeOnSteam;