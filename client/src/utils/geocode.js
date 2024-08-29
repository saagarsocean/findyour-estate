// src/utils/geocode.js
export const getCoordinates = async (address) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${'AIzaSyAUl0nmSmshgQX3SD1bppZL93ect_8_7Pw'}`
    );
    const data = await response.json();
    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } else {
      throw new Error('Address not found');
    }
  };
  