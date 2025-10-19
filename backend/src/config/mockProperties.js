// Mock property data matching frontend
// This matches the properties used in the frontend application

export const MOCK_PROPERTIES = [
  {
    id: '1',
    address: '123 Main St, Austin, TX 78701',
    city: 'Austin',
    state: 'TX',
    price: 450000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    latitude: 30.2672,
    longitude: -97.7431,
  },
  {
    id: '2',
    address: '456 Oak Ave, Denver, CO 80202',
    city: 'Denver',
    state: 'CO',
    price: 380000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1400,
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    latitude: 39.7392,
    longitude: -104.9903,
  },
  {
    id: '3',
    address: '789 Sunset Blvd, Miami, FL 33139',
    city: 'Miami',
    state: 'FL',
    price: 520000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    latitude: 25.7907,
    longitude: -80.1300,
  },
  {
    id: '4',
    address: '321 Desert Rd, Phoenix, AZ 85001',
    city: 'Phoenix',
    state: 'AZ',
    price: 310000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1600,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    latitude: 33.4484,
    longitude: -112.0740,
  },
  {
    id: '5',
    address: '555 Music Row, Nashville, TN 37203',
    city: 'Nashville',
    state: 'TN',
    price: 425000,
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 1900,
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    latitude: 36.1627,
    longitude: -86.7816,
  },
  {
    id: '6',
    address: '888 Mountain View Dr, Denver, CO 80203',
    city: 'Denver',
    state: 'CO',
    price: 550000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2400,
    imageUrl: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
    latitude: 39.7500,
    longitude: -104.9900,
  },
];

export function getAllProperties() {
  return MOCK_PROPERTIES;
}

/**
 * Get property by ID
 */
export function getPropertyById(id) {
  const stringId = String(id);
  const found = MOCK_PROPERTIES.find(p => String(p.id) === stringId);
  return found;
}

/**
 * Search properties by city
 */
export function searchPropertiesByCity(city) {
  return MOCK_PROPERTIES.filter(p => 
    p.city.toLowerCase().includes(city.toLowerCase())
  );
}

/**
 * Filter properties with multiple criteria
 */
export function filterProperties(filters = {}) {
  let properties = [...MOCK_PROPERTIES];

  if (filters.city) {
    properties = properties.filter(p => 
      p.city.toLowerCase().includes(filters.city.toLowerCase())
    );
  }

  if (filters.state) {
    properties = properties.filter(p => 
      p.state.toLowerCase() === filters.state.toLowerCase()
    );
  }

  if (filters.minPrice) {
    properties = properties.filter(p => p.price >= parseInt(filters.minPrice));
  }

  if (filters.maxPrice) {
    properties = properties.filter(p => p.price <= parseInt(filters.maxPrice));
  }

  if (filters.bedrooms) {
    properties = properties.filter(p => p.bedrooms >= parseInt(filters.bedrooms));
  }

  if (filters.bathrooms) {
    properties = properties.filter(p => p.bathrooms >= parseInt(filters.bathrooms));
  }

  return properties;
}