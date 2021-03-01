import { calculateDistance } from '../utils/location'
import { sortCitiesByWindSpeedAsc, sortCitiesByWindSpeedDesc } from '../utils/sort'

describe("Utils/Location", () => {
    it("distance between the same points is 0", () => {
        expect(calculateDistance(15, 32.2, 15, 32.2)).toBe(0)
    });
});

describe("Utils/Sort", () => {
    const cities = [
        {
            id: 0,
            wind: {
                speed: 1.5
            }
        },{
            id: 1,
            wind: {
                speed: 1.0
            }
        }, {
            id: 2,
            wind: {
                speed: 2.0
            }
        }]

    it("sortCitiesByWindSpeedAsc", () => {
        expect(sortCitiesByWindSpeedAsc(cities)[0].id).toBe(1)
    });

    it("sortCitiesByWindSpeedDesc", () => {
        expect(sortCitiesByWindSpeedDesc(cities)[0].id).toBe(2)
    });
});

