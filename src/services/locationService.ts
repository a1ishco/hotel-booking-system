export interface LocationResponse {
    ip: string;
    country: string;
}

export async function getUserLocation(): Promise<LocationResponse | null> {
    try {
        const response = await fetch('https://api.country.is/');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: LocationResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch user location:', error);
        return null;
    }
}

