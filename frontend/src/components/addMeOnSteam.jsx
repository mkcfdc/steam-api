import PropTypes from 'prop-types';

const AddMeOnSteam = ({ steamId }) => (
    <a 
        href={`steam://friends/add/${steamId}`}
        target="_blank" 
        rel="noopener noreferrer" 
        className="add-me-steam-button"
        aria-label="Add me on Steam"
    >
        Add Me on Steam
    </a>
);

AddMeOnSteam.propTypes = {
    steamId: PropTypes.string.isRequired, // Consider more specific validation if necessary
};

export default AddMeOnSteam;
