import type { Listing } from './listings';

/** Search metadata stays factual; the visible editorial headline stays authored. */
export function listingMetadata(listing: Listing) {
  const property = listing.propertyType === 'apartment' ? 'Piso' : 'Casa';
  const transaction = listing.transaction === 'sale' ? 'en venta' : 'en alquiler';
  const location = [...new Set([
    listing.location.neighborhood, listing.location.district, listing.location.city,
  ].filter(Boolean))].join(', ');
  const area = listing.area.measurement === 'usable' ? ' útiles'
    : listing.area.measurement === 'built' ? ' construidos' : '';
  return {
    title: `${property} ${transaction} en ${location} | Alfaro & Partners`,
    description: `${property} ${transaction} en ${location}: ${listing.area.squareMeters} m²${area}, ${listing.rooms.bedrooms} dormitorios y ${listing.rooms.bathrooms} baños. Fotografías y visita privada con Alfaro & Partners.`,
  };
}

/** Reserved is a supported ItemAvailability, not a completed sale. */
export function offerAvailability(value: Listing['availability']) {
  return { available: 'https://schema.org/InStock', reserved: 'https://schema.org/Reserved',
    sold: 'https://schema.org/SoldOut', unconfirmed: undefined }[value];
}

/** Only the release-gated caller may emit these public property entities. */
export function listingSchema(listing: Listing, pageUrl: string, homeUrl: string, imageUrl: string) {
  const reference = (id: string) => ({ '@id': id });
  const propertyId = `${pageUrl}#property`;
  const offerId = `${pageUrl}#offer`;
  const agencyId = `${homeUrl}#organization`;
  const availability = offerAvailability(listing.availability);
  return {
    page: {
      '@type': 'RealEstateListing',
      mainEntity: reference(propertyId),
      about: reference(propertyId),
      offers: reference(offerId),
      description: listing.editorial.summary,
      primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl },
    },
    entities: [{
      '@type': listing.propertyType === 'apartment' ? 'Apartment' : 'House',
      '@id': propertyId,
      name: listing.editorial.title,
      image: imageUrl,
      numberOfBedrooms: listing.rooms.bedrooms,
      numberOfBathroomsTotal: listing.rooms.bathrooms,
      floorSize: { '@type': 'QuantitativeValue', value: listing.area.squareMeters, unitCode: 'MTK' },
      containedInPlace: { '@type': 'Place', name: listing.location.displayName },
      subjectOf: reference(`${pageUrl}#webpage`),
      ...(listing.energy.rating ? { additionalProperty: {
        '@type': 'PropertyValue', name: 'Calificación energética', value: listing.energy.rating,
      } } : {}),
    }, {
      '@type': 'Offer',
      '@id': offerId,
      url: pageUrl,
      price: listing.price.amount,
      priceCurrency: listing.price.currency,
      businessFunction: listing.transaction === 'sale'
        ? 'http://purl.org/goodrelations/v1#Sell' : 'http://purl.org/goodrelations/v1#LeaseOut',
      seller: reference(agencyId),
      itemOffered: reference(propertyId),
      ...(availability ? { availability } : {}),
    }],
  };
}
