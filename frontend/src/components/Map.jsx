import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite/React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Map({ properties = [], selectedProperty = null, centerLocation = null }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Initialize the map only once
    if (!mapInstanceRef.current && mapRef.current) {
      const defaultCenter = centerLocation 
        ? [centerLocation.lat, centerLocation.lng] 
        : [30.2672, -97.7431]; // Default to Austin
      
      const map = L.map(mapRef.current).setView(defaultCenter, 12);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map center when centerLocation changes
  useEffect(() => {
    if (mapInstanceRef.current && centerLocation) {
      mapInstanceRef.current.setView([centerLocation.lat, centerLocation.lng], 12);
    }
  }, [centerLocation]);

  // Update markers when properties change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for all properties
    properties.forEach(property => {
      if (property.latitude && property.longitude) {
        const marker = L.marker([property.latitude, property.longitude])
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div style="min-width: 200px;">
              <strong>${property.address}</strong><br/>
              <span style="font-size: 16px; font-weight: bold; color: #2563eb;">
                $${property.price.toLocaleString()}
              </span><br/>
              ${property.bedrooms} bed • ${property.bathrooms} bath • ${property.sqft} sqft
            </div>
          `);
        
        markersRef.current.push(marker);
      }
    });
  }, [properties]);

  // Highlight selected property
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedProperty) return;

    if (selectedProperty.latitude && selectedProperty.longitude) {
      mapInstanceRef.current.setView(
        [selectedProperty.latitude, selectedProperty.longitude], 
        15,
        { animate: true }
      );

      // Find and open the popup for the selected property
      markersRef.current.forEach(marker => {
        const latLng = marker.getLatLng();
        if (latLng.lat === selectedProperty.latitude && 
            latLng.lng === selectedProperty.longitude) {
          marker.openPopup();
        }
      });
    }
  }, [selectedProperty]);

  return (
    <div 
      ref={mapRef} 
      style={{ height: '130%', width: '100%', minHeight: '400px' }} 
      className="rounded-xl overflow-hidden shadow-lg"
    />
  );
}

export default Map;