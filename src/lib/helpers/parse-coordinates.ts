export function parseCoordinates(pointString: string) {
  const coords = pointString.replace(/[()]/g, '').split(',');
  return {
    longitude: parseFloat(coords[0].trim()),
    latitude: parseFloat(coords[1].trim())
  };
}