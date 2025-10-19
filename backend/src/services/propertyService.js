import { 
  getAllProperties, 
  getPropertyById, 
  searchPropertiesByCity,
  filterProperties 
} from '../config/mockProperties.js';

export async function searchProperties(filters = {}) {
  try {
    const properties = filterProperties(filters);
    return properties;
  } catch (error) {
    console.error('Search failed:', error);
    throw new Error('Failed to search properties');
  }
}



export async function getProperty(propertyId) {
  try {
    // Ensure we're comparing strings
    const property = getPropertyById(String(propertyId));
    
    if (!property) {
      console.log('Property not found for ID:', propertyId);
      console.log('Available IDs:', MOCK_PROPERTIES.map(p => p.id));
      throw new Error('Property not found');
    }
    
    return property;
  } catch (error) {
    console.error('Failed to get property:', error);
    throw error;
  }
}

export async function listAllProperties() {
  try {
    return getAllProperties();
  } catch (error) {
    console.error('Failed to list properties:', error);
    throw new Error('Failed to list properties');
  }
}