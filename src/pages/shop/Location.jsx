import { decode } from 'base-64';
import React from 'react';
import { useParams } from 'react-router-dom';
import LocationMaps from '../../component/shop/locationMaps/LocationMaps';

const Location = () => {
  const { latitude } = useParams();
  const { longitude } = useParams();

  return (
    <div>
      <LocationMaps
        latitude={decode(latitude)}
        longitude={decode(longitude)}
        title="Arjuna Elektronik"
      />
    </div>
  );
};

export default Location;
