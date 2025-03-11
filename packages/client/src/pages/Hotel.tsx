import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Hotel as HotelType } from '../types';
import { API_URL } from '../config';

function Hotel() {
  console.log('hotelaowejdfiopawejdioajwe');
  const { id } = useParams();

  console.log('id', id);
  const [hotel, setHotel] = useState<HotelType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    console.log('fetching data', id);
    const response = await fetch(`${API_URL}/hotels/hotel/${id}`);
    console.log('response', response);
    const data = await response.json();
    setHotel(data);
    setIsLoading(false);
    return data;
  }

  
  useEffect(() => {
      console.log('useEffect', id);
      
      fetchData();
    }, [id]);
    if (isLoading) return <div>Loading...</div>;
    
  return <div>
    <h1>{hotel?.hotel_name}</h1>
    <p>{hotel?.chain_name}</p>
    <p>{hotel?.city}</p>
    <p>{hotel?.country}</p>
  </div>;
}

export default Hotel;