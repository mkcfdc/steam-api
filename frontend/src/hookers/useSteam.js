import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

const useSteam = (steamId, endpoint = 'stats') => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/${endpoint}/${steamId}`);
        if (response.status !== 200) throw new Error('Network response was not ok');
        const responseData = response.data;

        if (Array.isArray(responseData) && responseData.length > 0) {
          setData(responseData[0]);
        } else {
          setData(responseData);
        }

        setIsLoading(false);
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [steamId, endpoint]);

  return { data, isLoading, error };
};

export default useSteam;
