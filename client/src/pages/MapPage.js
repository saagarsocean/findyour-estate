import React from 'react';
import { useLocation } from 'react-router-dom';
import MapComponent from '../components/MapComponent';

const MapPage = () => {
  const location = useLocation();
  const { address } = location.state || {};

  if (!address) {
    return <div>Error: Address not found</div>;
  }

  return (
    <div>
      <div className='p-4 text-center'>
        <p className='text-1xl font-sans uppercase'>{/*Google map to reach - */}  <span className='text-slate-800 text-1xl y font-semibold uppercase'>{address}</span></p>
      </div>
      <div className='object-contain ml-20 mr-20 bg-black'>
        <MapComponent address={address} />
      </div>
    </div>
  );
};

export default MapPage;
