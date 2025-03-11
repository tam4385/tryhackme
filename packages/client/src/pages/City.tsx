import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { City as cityType } from '../types';
import { API_URL } from '../config';

function City() {
  const { id } = useParams();

  const [city, setCity] = useState<cityType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const response = await fetch(`${API_URL}/cities/${id}`);

    const data = await response.json();
    setCity(data);
    setIsLoading(false);
    return data;
  }
  
  useEffect(() => {      
      fetchData();
    }, [id]);

    if (isLoading) return <div>Loading...</div>;
    
  return <div>
    <h1>{city?.name}</h1>
  </div>;
}

export default City;