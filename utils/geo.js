// Validate a GeoJSON coordinates array (longitude, latitude and optional altitude).
function validateGeoJsonCoordinates(value) {
	if (!value || value.length === 0) {
		return "OK, aucune localisation n'est enregistrée";
	}

	return (
		Array.isArray(value) &&
		value.length >= 2 &&
		value.length <= 3 &&
		isLongitude(value[0]) &&
		isLatitude(value[1])
	);
}

function isLatitude(value) {
	return value >= -90 && value <= 90;
}

function isLongitude(value) {
	return value >= -180 && value <= 180;
}

export { validateGeoJsonCoordinates };
