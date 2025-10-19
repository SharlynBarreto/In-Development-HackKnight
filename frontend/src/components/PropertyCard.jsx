function PropertyCard({ property, onClick }) {
  return (
    <div
      onClick={() => onClick(property)}
      className="relative h-80 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    >
      {/* Property Image */}
      <img
        src={property.imageUrl}
        alt={property.address}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Price Badge (Always Visible) */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
        <p className="font-bold text-gray-900 text-lg">${(property.price / 1000).toFixed(0)}k</p>
        <p className="text-sm text-gray-600">{property.bedrooms} bed • {property.bathrooms} bath</p>
      </div>
    </div>
  );
}

export default PropertyCard;