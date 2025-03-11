import { useState, useEffect } from 'react';
import { Results, Hotel, Country, City } from '../types';
import { API_URL } from '../config';

const fetchResults = async (
  value: string,
  setData: (data: Results) => void,
  setShowClearBtn: (showClearBtn: boolean) => void,
) => {
  try {
    const results = await fetch(`${API_URL}/hotels/${value}`);
    
    setShowClearBtn(true);
    setData((await results.json()) as { 
      hotels: Hotel[], countries: Country[], cities: City[] 
    });

  } catch (error) {
    console.error(error);
    setShowClearBtn(false);
    setData({ hotels: [], countries: [], cities: [] });
  }
}

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

function Search() {
  const [data, setData] = useState<{ hotels: Hotel[], countries: Country[], cities: City[] }>({ hotels: [], countries: [], cities: [] });
  const [query, setQuery] = useState('');
  const [showClearBtn, setShowClearBtn] = useState(false);

  const debouncedFetchResults = debounce(fetchResults, 500);

  useEffect(() => {
    if (!query) {
      setData({ hotels: [], countries: [], cities: [] });
      setShowClearBtn(false);
      return;
    }

    debouncedFetchResults(query, setData, setShowClearBtn);
  }, [query]);

  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex padding-bottom-8 justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="dropdown">
              <div className="form">
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  className="form-control form-input"
                  placeholder="Search accommodation..."
                  onChange={(e) => setQuery(e.target.value)}
                  value={query}
                />
                {showClearBtn && (
                  <span className="left-pan" onClick={() => setQuery('')}>
                    <i className="fa fa-close"></i>
                  </span>
                )}
              </div>
              {query && (
                <div className="search-dropdown-menu dropdown-menu w-100 show p-2">
                  <h2>Hotels</h2>
                  {data.hotels.length ? data.hotels.map((hotel, index) => (
                    <li key={index}>
                      <a href={`/hotels/${hotel._id}`} className="dropdown-item">
                        <i className="fa fa-building mr-2"></i>
                        {hotel.hotel_name}
                      </a>
                      <hr className="divider" />
                    </li>
                  )) : <p>No hotels matched</p>}
                  <h2>Countries</h2>
                  {data.countries.length ? data.countries.map((country, index) => (
                    <li key={index}>
                      <a href={`/countries/${country._id}`} className="dropdown-item">
                        <i className="fa fa-flag mr-2"></i>
                        {country.country}
                      </a>
                    </li> 
                  )) : <p>No countries matched</p>}
                  <h2>Cities</h2>
                  {data.cities.length ? data.cities.map((city, index) => (
                    <li key={index}>
                      <a href={`/cities/${city._id}`} className="dropdown-item">
                        <i className="fa fa-city mr-2"></i>
                        {city.name}
                      </a>
                    </li>
                  )) : <p>No cities matched</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
