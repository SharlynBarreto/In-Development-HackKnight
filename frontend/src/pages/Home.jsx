import { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import Map from '../components/Map';
import { mockProperties } from '../data/mockProperties';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://localhost:8787';

const AVAILABLE_LOCATIONS = [
  { state: 'TX', label: 'Texas', lat: 30.2672, lng: -97.7431 },
  { state: 'FL', label: 'Florida', lat: 25.7907, lng: -80.1300 },
  { state: 'AZ', label: 'Arizona', lat: 33.4484, lng: -112.0740 },
  { state: 'TN', label: 'Tennessee', lat: 36.1627, lng: -86.7816 },
  { state: 'CO', label: 'Colorado', lat: 39.7392, lng: -104.9903 },
];
 

function filterPropertiesByLocation(properties, location) {
  if (!location) return properties;
  
  return properties.filter(property => 
    property.state === location.state
  );
}


async function fetchAllStrategies(propertyId, params) {
  const { downPayment, interestRate, loanTerm } = params;
  
  // Convert propertyId to string to match backend
  const id = String(propertyId);
  
  try {
    const [airbnbRes, leaseRes, flipRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/calculate/${id}?strategy=airbnb&downPayment=${downPayment}&interestRate=${interestRate}&loanTerm=${loanTerm}`),
      fetch(`${API_BASE_URL}/api/calculate/${id}?strategy=lease&downPayment=${downPayment}&interestRate=${interestRate}&loanTerm=${loanTerm}`),
      fetch(`${API_BASE_URL}/api/calculate/${id}?strategy=flip&downPayment=${downPayment}&interestRate=${interestRate}&loanTerm=${loanTerm}&renovationBudget=50000&afterRepairValue=550000&holdingPeriod=6`)
    ]);

    const [airbnbData, leaseData, flipData] = await Promise.all([
      airbnbRes.json(),
      leaseRes.json(),
      flipRes.json()
    ]);

    if (!airbnbData.success || !leaseData.success || !flipData.success) {
      throw new Error('Failed to fetch calculation data');
    }

    return {
      airbnb: airbnbData.data,
      lease: leaseData.data,
      flip: flipData.data
    };
  } catch (error) {
    console.error('Error fetching strategies:', error);
    return null;
  }
}

const getROIRanking = (calculations) => {
  if (!calculations) return null;

  const strategies = [
    { name: 'airbnb', roi: calculations.airbnb.results.totalROI },
    { name: 'lease', roi: calculations.lease.results.totalROI },
    { name: 'flip', roi: calculations.flip.results.annualizedROI }
  ];
  
  strategies.sort((a, b) => b.roi - a.roi);
  
  const ranking = {};
  ranking[strategies[0].name] = { rank: 1, color: 'green' };
  ranking[strategies[1].name] = { rank: 2, color: 'yellow' };
  ranking[strategies[2].name] = { rank: 3, color: 'red' };
  
  return ranking;
};

const colorClasses = {
  green: {
    bg: 'from-green-50 to-emerald-50',
    text: 'text-green-600',
    border: 'border-green-200',
  },
  yellow: {
    bg: 'from-yellow-50 to-amber-50',
    text: 'text-yellow-600',
    border: 'border-yellow-200',
  },
  red: {
    bg: 'from-red-50 to-rose-50',
    text: 'text-red-600',
    border: 'border-red-200',
  }
};

function Home() {
  // Modal states
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [calculations, setCalculations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Location filter states
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  // Default investment parameters
  const defaultParams = {
    downPayment: 90000,
    interestRate: 6.5,
    loanTerm: 30
  };

  // Show all properties immediately on page load
  useEffect(() => {
    setFilteredProperties(mockProperties);
    setShowLocationPrompt(false);
    
    // Auto-select Texas as default
    setSelectedLocation({ state: 'TX', label: 'Texas', lat: 30.2672, lng: -97.7431 });
  }, []);

  const resetLocation = () => {
    setSelectedLocation(null);
    setShowLocationPrompt(true);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handlePropertyClick = async (property) => {
    setSelectedProperty(property);
    setModalOpen(true);
    setLoading(true);
    setError(null);
    
    console.log("Selected Property:", property);

    const results = await fetchAllStrategies(property.id, defaultParams);
    
    if (results) {
      setCalculations(results);
      console.log("Backend Calculations:", results);
    } else {
      setError("Failed to load investment calculations");
    }
    
    setLoading(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCalculations(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-white">
      <header className="bg-white bg-opacity-80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center space-x-3">
            <img 
                src="/up_logo.png" 
                alt="Up Logo" 
                className="h-20 w-20 object-contain"
              />
              <span className="text-4xl font-semibold text-sky-500  drop-shadow-lg">UP Real Estate</span>
          </div>

          {/* LOCATION SELECTOR */}
          <div className="flex items-center space-x-4">
            {/* Location Dropdown */}
            <div className="bg-white rounded-full px-6 py-2 shadow-md flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <select 
                className="outline-none bg-transparent text-gray-700 cursor-pointer"
                value={selectedLocation?.label || ''}
                onChange={(e) => {
                  const location = AVAILABLE_LOCATIONS.find(loc => loc.label === e.target.value);
                  handleLocationSelect(location);
                }}
              >

                {AVAILABLE_LOCATIONS.map((location) => (
                  <option key={location.label} value={location.label}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Reset Location Button */}
            {selectedLocation && (
              <button 
                onClick={resetLocation}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full px-6 py-2 shadow-md font-semibold transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-7 py-7">
        {/* Location Selection Prompt */}
        {showLocationPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-12 mb-8 text-center"
          >
            <div className="text-6xl mb-4">📍</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Choose Your Investment State
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Select a state from the dropdown above to explore investment properties. 
              We'll show you all available properties in that state.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {AVAILABLE_LOCATIONS.map((location) => (
                <button
                  key={location.label}
                  onClick={() => handleLocationSelect(location)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md hover:shadow-lg"
                >
                  {location.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Properties Grid & Map - only show when location selected */}
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col md:flex-row gap-6"
          >
            {/* Left: Property Cards (70%) */}
            <div className="w-full md:w-[70%]">
              {/* Results Header */}
              <div className="mb-6 bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Properties in {selectedLocation.label}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Found {filteredProperties.length} properties in this state
                    </p>
                  </div>
                  <div className="bg-blue-50 px-4 py-2 rounded-lg">
                    <span className="text-2xl font-bold text-blue-600">
                      {filteredProperties.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Cards */}
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onClick={handlePropertyClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No Properties Found
                  </h3>
                  <p className="text-gray-600">
                    Try selecting a different state with available properties.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Map (30%) */}
            <div className="w-full md:w-[30%]">
              <div className="sticky top-24 h-[600px]">
                <Map 
                  properties={filteredProperties}
                  selectedProperty={selectedProperty}
                  centerLocation={selectedLocation}
                />
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Modal Popup */}
      <AnimatePresence>
        {modalOpen && selectedProperty && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Modal Content */}
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                >
                  {/* Close Button */}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 text-gray-600 hover:text-gray-900 transition shadow-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="flex flex-col md:flex-row max-h-[90vh]">
                    {/* Left Side - Image & Map */}
                    <div className="md:w-1/2 bg-gray-50">
                      {/* Property Image */}
                      <div className="relative h-64 md:h-80">
                        <img 
                          src={selectedProperty.imageUrl} 
                          alt={selectedProperty.address}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2">
                          <p className="text-2xl font-bold text-gray-900">
                            ${selectedProperty.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Map in Modal */}
                      <div className="p-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Location</h4>
                        <div className="h-64 rounded-xl overflow-hidden">
                          <Map selectedProperty={selectedProperty} />
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Details */}
                    <div className="md:w-1/2 overflow-y-auto">
                      <div className="p-8">
                        {/* Property Info */}
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                          Property Details
                        </h2>
                        <p className="text-gray-600 text-lg mb-6">{selectedProperty.address}</p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                          <div className="bg-blue-50 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-blue-600">{selectedProperty.bedrooms}</p>
                            <p className="text-sm text-gray-600 mt-1">Bedrooms</p>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-blue-600">{selectedProperty.bathrooms}</p>
                            <p className="text-sm text-gray-600 mt-1">Bathrooms</p>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-blue-600">{(selectedProperty.sqft / 1000).toFixed(1)}k</p>
                            <p className="text-sm text-gray-600 mt-1">Sq Ft</p>
                          </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                          <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Calculating investment strategies...</span>
                          </div>
                        )}

                        {/* Error State */}
                        {error && (
                          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
                            <p className="text-red-600 font-semibold">⚠️ {error}</p>
                            <p className="text-sm text-red-500 mt-2">Please try again or contact support.</p>
                          </div>
                        )}

                        {/* Investment Strategy Comparison - Powered by Backend */}
                        {!loading && !error && calculations && (() => {
                          const ranking = getROIRanking(calculations);
                          
                          return (
                            <>
                              <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Investment Strategy Comparison
                              </h3>

                              <div className="space-y-4 mb-6">
                                {/* Strategy 1: Airbnb */}
                                <div className={`bg-gradient-to-br ${colorClasses[ranking.airbnb.color].bg} rounded-xl p-5 border-2 ${colorClasses[ranking.airbnb.color].border}`}>
                                  <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-gray-900 text-sm">
                                      🏠 Airbnb Short-Term Rental
                                    </h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${colorClasses[ranking.airbnb.color].text} bg-white/80`}>
                                      #{ranking.airbnb.rank} {ranking.airbnb.rank === 1 ? '🏆' : ranking.airbnb.rank === 2 ? '🥈' : '🥉'}
                                    </span>
                                  </div>
                                  
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-700">Monthly Income</span>
                                      <span className={`font-bold ${colorClasses[ranking.airbnb.color].text}`}>
                                        ${calculations.airbnb.results.monthlyIncome.toLocaleString()}/mo
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-700">Monthly Cash Flow</span>
                                      <span className={`font-bold ${colorClasses[ranking.airbnb.color].text}`}>
                                        ${calculations.airbnb.results.monthlyCashFlow.toLocaleString()}/mo
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-700">Annual Cash Flow</span>
                                      <span className={`font-bold ${colorClasses[ranking.airbnb.color].text}`}>
                                        ${calculations.airbnb.results.annualCashFlow.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className={`border-t ${colorClasses[ranking.airbnb.color].border} pt-2`}>
                                      <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">Total ROI</span>
                                        <span className={`text-xl font-bold ${colorClasses[ranking.airbnb.color].text}`}>
                                          {calculations.airbnb.results.totalROI.toFixed(1)}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Strategy 2: Long-Term Lease */}
                                <div className={`bg-gradient-to-br ${colorClasses[ranking.lease.color].bg} rounded-xl p-5 border-2 ${colorClasses[ranking.lease.color].border}`}>
                                  <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-gray-900 text-sm">
                                      📋 Long-Term Lease
                                    </h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${colorClasses[ranking.lease.color].text} bg-white/80`}>
                                      #{ranking.lease.rank} {ranking.lease.rank === 1 ? '🏆' : ranking.lease.rank === 2 ? '🥈' : '🥉'}
                                    </span>
                                  </div>
                                  
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-700">Monthly Income</span>
                                      <span className={`font-bold ${colorClasses[ranking.lease.color].text}`}>
                                        ${calculations.lease.results.monthlyIncome.toLocaleString()}/mo
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-700">Monthly Cash Flow</span>
                                      <span className={`font-bold ${colorClasses[ranking.lease.color].text}`}>
                                        ${calculations.lease.results.monthlyCashFlow.toLocaleString()}/mo
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-700">Annual Cash Flow</span>
                                      <span className={`font-bold ${colorClasses[ranking.lease.color].text}`}>
                                        ${calculations.lease.results.annualCashFlow.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className={`border-t ${colorClasses[ranking.lease.color].border} pt-2`}>
                                      <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">Total ROI</span>
                                        <span className={`text-xl font-bold ${colorClasses[ranking.lease.color].text}`}>
                                          {calculations.lease.results.totalROI.toFixed(1)}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Strategy 3: Fix & Flip */}
                                <div className={`bg-gradient-to-br ${colorClasses[ranking.flip.color].bg} rounded-xl p-5 border-2 ${colorClasses[ranking.flip.color].border}`}>
                                  <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-gray-900 text-sm">
                                      🔨 Fix & Flip
                                    </h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${colorClasses[ranking.flip.color].text} bg-white/80`}>
                                      #{ranking.flip.rank} {ranking.flip.rank === 1 ? '🏆' : ranking.flip.rank === 2 ? '🥈' : '🥉'}
                                    </span>
                                  </div>
                                  
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-700">Renovation Budget</span>
                                      <span className={`font-bold ${colorClasses[ranking.flip.color].text}`}>
                                        ${calculations.flip.costBreakdown.renovationBudget.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-700">Total Investment</span>
                                      <span className={`font-bold ${colorClasses[ranking.flip.color].text}`}>
                                        ${calculations.flip.results.totalInvestment.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-700">Net Profit</span>
                                      <span className={`font-bold ${colorClasses[ranking.flip.color].text}`}>
                                        ${calculations.flip.results.netProfit.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className={`border-t ${colorClasses[ranking.flip.color].border} pt-2`}>
                                      <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">Annualized ROI</span>
                                        <span className={`text-xl font-bold ${colorClasses[ranking.flip.color].text}`}>
                                          {calculations.flip.results.annualizedROI.toFixed(1)}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Recommendation Summary */}
                              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                <h4 className="font-bold text-gray-900 mb-3">💡 Recommendation</h4>
                                <p className="text-gray-700 text-sm">
                                  Based on comprehensive analysis including market data, cash flow, and appreciation, 
                                  <span className="font-bold"> {
                                    ranking.airbnb.rank === 1 ? 'Airbnb Short-Term Rental' :
                                    ranking.lease.rank === 1 ? 'Long-Term Lease' :
                                    'Fix & Flip'
                                  }</span> offers the best return with an ROI of 
                                  <span className={`font-bold text-green-600`}> {
                                    Math.max(
                                      calculations.airbnb.results.totalROI,
                                      calculations.lease.results.totalROI,
                                      calculations.flip.results.annualizedROI
                                    ).toFixed(1)
                                  }%</span>.
                                </p>
                              </div>
                            </>
                          );
                        })()}
                        {/* Additional Info */}
                        <div className="space-y-3 mb-6">
                          <h4 className="font-semibold text-gray-900">Property Features</h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">Garage</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">Backyard</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">Updated Kitchen</span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">Hardwood Floors</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition shadow-lg hover:shadow-xl">
                            View Full Analysis
                          </button>
                          <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-4 rounded-xl transition">
                            Save Property
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;