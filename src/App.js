import { useState } from "react";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [countClicks, setCountClicks] = useState(0);
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  // Selected map provider
  const [mapProvider, setMapProvider] = useState("osm");

  const lat = position?.lat;
  const lng = position?.lng;

  function getPosition() {
    setError(null);
    setCountClicks((count) => count + 1);

    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation.");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });

        setIsLoading(false);
      },
      (error) => {
        switch (error.code) {
          case 1:
            setError(
              "Location access was denied.Please reset browser permissions.",
            );
            break;

          case 2:
            setError("Your location could not be determined.");
            break;

          case 3:
            setError("Location request timed out.");
            break;

          default:
            setError("Unable to determine your location.");
        }

        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }

  const mapUrl =
    lat !== undefined && lng !== undefined
      ? mapProvider === "google"
        ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
        : `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`
      : "";

  return (
    <div>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "15px" }}>
          <input
            type="radio"
            name="provider"
            value="osm"
            checked={mapProvider === "osm"}
            onChange={(e) => setMapProvider(e.target.value)}
          />
          OpenStreetMap
        </label>

        <label>
          <input
            type="radio"
            name="provider"
            value="google"
            checked={mapProvider === "google"}
            onChange={(e) => setMapProvider(e.target.value)}
          />
          Google Maps
        </label>
      </div>

      <button onClick={getPosition} disabled={isLoading}>
        {isLoading ? "Getting position..." : "Get my position"}
      </button>

      {isLoading && <p>Loading position...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!isLoading && !error && position && (
        <p>
          Your GPS position:{" "}
          <a target="_blank" rel="noreferrer" href={mapUrl}>
            Open in {mapProvider === "google" ? "Google Maps" : "OpenStreetMap"}{" "}
            ({lat}, {lng})
          </a>
        </p>
      )}

      <p style={{ marginTop: "15px" }}>
        You requested position {countClicks} times
      </p>
    </div>
  );
}
