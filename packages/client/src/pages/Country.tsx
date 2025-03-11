import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Country as countryType } from '../types';
import { API_URL } from '../config';
function Country() {
  const { id } = useParams();

  const [country, setCountry] = useState<countryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const response = await fetch(`${API_URL}/countries/${id}`);

    const data = await response.json();
    setCountry(data);
    setIsLoading(false);
    return data;
  }
  
  useEffect(() => {      
      fetchData();
    }, [id]);

    if (isLoading) return <div>Loading...</div>;
    
  return <div>
    <h1>{country?.country}</h1>
  </div>;
}

export default Country;