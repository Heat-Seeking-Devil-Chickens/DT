import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Spotify from './Spotify';
import Weather from './Weather';
import Window from './Window';
import Search from './Search';

import Favorites from './Favorites';
import { FontAwesomeIcon as FAIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regStar } from '@fortawesome/free-regular-svg-icons';

function Home() {
  const [current, setCurrent] = useState({});
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [query, setQuery] = useState('');
  useEffect(() => {
    fetch(`http://localhost:8080/api/user`)
      .then((res) => res.json())
      .then((user) => {
        setUserName(user.display_name);
        setEmail(user.email);
        setFavorites(user.favsArray);
      })
      .catch((err) => err);
  }, []);
  const grabLocationData = (location) => {
    console.log(location);
    if (!location) return;
    let locationString = location
      .split(',')
      .map((word) => word.trim())
      .join('&');
    fetch(`http://localhost:8080/api/${locationString}`)
      .then((data) => data.json())
      .then((response) => {
        setCurrent(response);
        setQuery(email + ', ' + response.userQuery);
      });
  };

  const toggleFav = (query) => {
    const values = query.split(',').map((elem) => elem.trim());
    const city = values[1];
    const country = values[2];
    const email = values[0];
    let method = 'POST';
    fetch(`http://localhost:8080/api/toggleFav/${city}&${country}&${email}`, {
      method: 'POST',
    })
      .then((data) => data.json())
      .then((updatedFavs) => {
        setFavorites(updatedFavs);
      });
  };

  if (!Object.keys(current).length)
    return (
      <div>
        <div id="leftColumn">
          <Search grabLocationData={grabLocationData} />
          <div className="welcoming">Welcome, {username}!</div>
        </div>
        <div id="middleColumn"></div>
        <div className="rightColumn">
          <Favorites
            favorites={favorites}
            grabLocationData={grabLocationData}
            setCurrent={setCurrent}
          />
        </div>
      </div>
    );
  let FavIcon = (
    <span className="favIcon">
      <FAIcon
        onClick={() => toggleFav(query)}
        icon={solidStar}
        style={{ color: 'steelblue' }}
      />
    </span>
  );
  return (
    <div id="main">
      <div id="leftColumn">
        <div className="welcoming">
          {' '}
          <br></br>Welcome, {username}!<br></br>
          <br></br>{' '}
        </div>
        <Weather weather={current.weatherData} />
        <Spotify songs={current.trackList} />
      </div>
      <div id="middleColumn">
        <Search grabLocationData={grabLocationData} />

        {FavIcon}

        <Window setFavorites={setFavorites} country={current.countryData} />
      </div>
      <div id="rightColumn">
        <Favorites
          favorites={favorites}
          grabLocationData={grabLocationData}
          setCurrent={setCurrent}
        />
      </div>
    </div>
  );
}

export default Home;
