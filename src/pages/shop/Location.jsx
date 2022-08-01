import { decode } from 'base-64';
import React from 'react';
import { useParams } from 'react-router-dom';
import LocationMaps from '../../component/shop/locationMaps/LocationMaps';

const Location = () => {
  const { name } = useParams();
  const { latitude } = useParams();
  const { longitude } = useParams();

  return (
    <div>
      <LocationMaps
        latitude={decode(latitude)}
        longitude={decode(longitude)}
        title={decode(name)}
      />
    </div>
  );
};

export default Location;
