import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { getCoordinates } from '../utils/geocode';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const MapComponent = ({ address }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyAUl0nmSmshgQX3SD1bppZL93ect_8_7Pw',
      version: 'weekly',
    });

    const loadMap = async () => {
      try {
        const coordinates = await getCoordinates(address);
        await loader.load();
        
        if (mapRef.current && window.google) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: coordinates,
            zoom: 15,
          });

          if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
            new window.google.maps.marker.AdvancedMarkerElement({
              position: coordinates,
              map,
              // Customize the marker here if needed
            });
          } else {
            console.warn('AdvancedMarkerElement is not available, using default marker.');
            new window.google.maps.Marker({
              position: coordinates,
              map,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    loadMap();
  }, [address]);

  return <div ref={mapRef} style={containerStyle}></div>;
};

export default MapComponent;
