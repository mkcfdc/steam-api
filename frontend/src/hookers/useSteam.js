import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

const useSteam = (steamId, endpoint = 'stats') => {
  const [state, setState] = useState({ data: null, isLoading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/${endpoint}/${steamId}`, { signal: controller.signal });
        setState({ data: Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : response.data, isLoading: false, error: null });
      } catch (error) {
        if (!axios.isCancel(error)) setState({ data: null, isLoading: false, error: `Error fetching data: ${error.message}` });
      }
    };

    fetchData();

    return () => controller.abort();
  }, [steamId, endpoint]);

  return state;
};

export default useSteam;