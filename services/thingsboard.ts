/**
 * ThingsBoard REST API Service
 * Handles data fetching from ThingsBoard using Device Access Token.
 * 
 * Note: If fetching telemetry via Device Access Token is restricted by ThingsBoard,
 * this service might need to be updated to use a User JWT Token and the 
 * /api/plugins/telemetry/DEVICE/{entityId}/values/timeseries endpoint.
 */

const TB_URL = process.env.NEXT_PUBLIC_THINGSBOARD_URL;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_THINGSBOARD_ACCESS_TOKEN;

export interface TelemetryResponse {
  [key: string]: {
    ts: number;
    value: string | number | boolean;
  }[];
}

// Fallback mock data in case API fails or is unreachable
export const FALLBACK_MOCK_DATA = {
  "sensors.ph": [{ ts: Date.now(), value: "6.25" }],
  "sensors.ec": [{ ts: Date.now(), value: "1.82" }],
  "sensors.water_temp": [{ ts: Date.now(), value: "24.5" }],
  "sensors.humidity": [{ ts: Date.now(), value: "72.0" }],
  "actuators.water_pump": [{ ts: Date.now(), value: "true" }],
  "actuators.nutrient_pump_a": [{ ts: Date.now(), value: "false" }],
  "actuators.exhaust_fan": [{ ts: Date.now(), value: "true" }],
};

export async function getLatestTelemetry(): Promise<TelemetryResponse> {
  if (!TB_URL || !ACCESS_TOKEN) {
    console.warn("ThingsBoard URL or Access Token is missing in environment variables. Using fallback mock data.");
    return FALLBACK_MOCK_DATA;
  }

  try {
    // Attempting to fetch via standard device attributes/telemetry API.
    // Replace this endpoint if your ThingsBoard instance uses a custom path for device-level telemetry retrieval.
    const response = await fetch(`${TB_URL}/api/v1/${ACCESS_TOKEN}/attributes`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // cache: 'no-store' is important for polling
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`ThingsBoard API returned status ${response.status}`);
    }

    const data = await response.json();
    
    // In ThingsBoard, attributes response might look like:
    // { "client": { "sensors.ph": 6.2 }, "shared": { ... } }
    // Or if there's a custom endpoint returning latest telemetry directly:
    // { "sensors.ph": [{ "ts": ..., "value": ... }] }
    
    // For this MVP, we normalize the response to match the expected format
    // assuming it returns key-value pairs or the structured format.
    const normalizedData: TelemetryResponse = {};
    
    // Handle both direct key-value or array structures flexibly
    const extractKeys = (obj: any) => {
      Object.entries(obj).forEach(([key, val]) => {
        if (Array.isArray(val) && val[0]?.ts && val[0]?.value !== undefined) {
           normalizedData[key] = val;
        } else if (typeof val === 'object' && val !== null) {
           // Might be nested under "client" or "shared"
           extractKeys(val);
        } else {
           // Convert raw key-value to structured format
           normalizedData[key] = [{ ts: Date.now(), value: val as any }];
        }
      });
    };
    
    extractKeys(data);
    
    // If no telemetry found in attributes, fallback to mock data for development
    if (Object.keys(normalizedData).length === 0) {
       console.warn("No telemetry data found in ThingsBoard response. Using fallback mock data.");
       return FALLBACK_MOCK_DATA;
    }

    return normalizedData;
  } catch (error) {
    console.error("Error fetching telemetry from ThingsBoard:", error);
    return FALLBACK_MOCK_DATA;
  }
}
