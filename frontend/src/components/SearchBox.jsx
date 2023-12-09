import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Space, message } from 'antd';
import './searchBox.style.css';

const SteamSearchBox = () => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const showMessage = (content, type = 'error', duration = 3) => {
    // duration in seconds, 3 is the default value
    document.body.classList.add('custom-message');
    message[type](content, duration, () => {
      document.body.classList.remove('custom-message');
    });
  };

  const handleChange = (event) => setInputValue(event.target.value);

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      // Show an error message if the input is empty
      showMessage('Please enter a Steam Community URL or ID', 'error', 3);
      return;
    }
    setIsLoading(true);
    // Proceed with your existing logic
    const steamId = inputValue.split('/').pop() || inputValue;
    navigate(`/${steamId}`).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <Space size="small">
      <Input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter Steam Community URL or ID"
        disabled={isLoading}
      />
      <Button
        onClick={handleSubmit}
        type="primary"
        loading={isLoading}
      >
        Search
      </Button>
    </Space>
  );
};

export default SteamSearchBox;