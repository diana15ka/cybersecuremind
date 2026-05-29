"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import axios from "axios";

type MapComponentProps = {
  currentThreat?: any;
};

export default function MapComponent({ currentThreat }: MapComponentProps) {
  const [threats, setThreats] = useState<any[]>([]);
  const [mapKey, setMapKey] = useState<number>(Date.now());

  useEffect(() => {
    setMapKey(Date.now());

    axios
      .get("http://127.0.0.1:8000/api/telemetry")
      .then((res) => {
        setThreats(res.data || []);
      })
      .catch((err) => {
        console.error("Telemetry fetch failed:", err);
        setThreats([]);
      });
  }, [currentThreat]);

  return (
    <div className="h-[700px] w-full">
      <MapContainer
        key={mapKey}
        center={[48.0196, 66.9237]}
        zoom={5}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {threats
          .filter(
            (threat) =>
              Number(threat.latitude) &&
              Number(threat.longitude)
          )
          .map((threat, index) => {
            const severity = threat.severity?.toLowerCase();

            let color = "#22c55e";

            if (severity === "medium") color = "#eab308";
            if (severity === "high") color = "#f97316";
            if (severity === "critical") color = "#ef4444";

            return (
              <CircleMarker
                key={`${threat.url}-${index}`}
                center={[
                  Number(threat.latitude),
                  Number(threat.longitude),
                ]}
                radius={12}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.65,
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <div>
                      <strong>{threat.city}</strong>
                    </div>

                    <div>Severity: {threat.severity}</div>
                    <div>Fraud Score: {threat.fraud_score}</div>
                    <div>Confidence: {threat.confidence}%</div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </div>
  );
}