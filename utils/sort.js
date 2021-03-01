import {calculateDistance} from "./location";

export const sortCitiesByProximity = (cities, lat, long) => {
    const citiesWithDistance = cities.map(city => {
        const { lat: cityLat, lon: cityLong } = city.coord
        return {
            ...city,
            distance: calculateDistance(cityLat, cityLong, lat, long)
        }
    })

    return citiesWithDistance.sort((a, b) => a.distance - b.distance)
}

export function sortCitiesByWindSpeedAsc (cities) {
    return cities.sort((a, b) => a.wind.speed - b.wind.speed )
}

export function sortCitiesByWindSpeedDesc (cities) {
    return cities.sort((a, b) => b.wind.speed - a.wind.speed )
}
