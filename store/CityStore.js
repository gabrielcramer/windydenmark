import {action, computed, makeObservable, observable, set, get, reaction} from "mobx";
import { sortCitiesByProximity, sortCitiesByWindSpeedAsc, sortCitiesByWindSpeedDesc } from "../utils/sort";
import { API_KEY } from '../config'


const fetchCityById= async (id) => {
    const city = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${API_KEY}&units=metric`)).json()
    city.timestamp = new Date().getTime()

    return city
}

const CITIES_PER_PAGE = 3;
const TEN_MINUTES = 10 * 60000;
const THIRTY_MINUTES = 30 * 60000;
const SIX_HOURS = 6 * 60 * 60000;

class ObservableCityStore {
    favoriteCityIds = observable.array()
    rawCities = observable.array()
    weatherData = observable.object({})
    location = {}
    sortOrder = 'PROXIMITY'
    page = 1
    interval = 0

    constructor() {
        makeObservable(this, {
            rawCities: observable,
            favoriteCityIds: observable,
            weatherData: observable,
            location: observable,
            sortOrder: observable,
            sortedCities: computed,
            displayedWeatherData: computed,
            favoritesSortedCities: computed,
            setRawCities: action,
            setLocation: action,
            setPage: action,
            setSortOrder: action.bound,
            toggleFavorite: action.bound,
        });

        if (process.browser) {
            reaction(() => JSON.stringify(this), json => {
                window.localStorage.setItem('store',json);
            }, {
                delay: 500,
            });

            let json = window.localStorage.getItem('store');
            if (json) {
                set(this, JSON.parse(json));
            }

            this.interval = setInterval(() => this.refreshCities(), TEN_MINUTES)
        }
    }

    get cities () {
        return this.location ? sortCitiesByProximity(this.rawCities, this.location.latitude, this.location.longitude) : this.rawCities
    }
    get sortedCities () {
        const cities = this.displayedWeatherData;
        switch (this.sortOrder) {
            case "LEAST_WINDY": {
                return sortCitiesByWindSpeedAsc(cities)
            }
            case "MOST_WINDY": {
                return sortCitiesByWindSpeedDesc(cities)
            }
        }
        return cities
    }
    get favoritesSortedCities () {
        return this.sortedCities.filter(city => this.favoriteCityIds.includes(city.id))
    }
    get displayedWeatherData() {
        return Object.keys(this.weatherData).map(key => this.weatherData[key])
    }

    get displayedCities() {
        return this.cities.slice(0, this.page * CITIES_PER_PAGE)
    }

    setRawCities(cities) {
        this.rawCities = cities
    }

    setLocation(location) {
        this.location = location
    }

    setSortOrder(sortOrder) {
        this.sortOrder = sortOrder
    }

    setPage(page) {
        const ids = this.cities.slice(this.page * CITIES_PER_PAGE, page * CITIES_PER_PAGE).map(city => city.id)
        this.fetchCities(ids)
        this.page = page
    }

    toggleFavorite(id) {
        const index = this.favoriteCityIds.indexOf(id)
        if (index > -1) {
            this.favoriteCityIds.splice(index, 1)
        } else {
            this.fetchCities([id])
            this.favoriteCityIds.push(id)
        }
    }
    async fetchCities(ids) {
        const weatherData = await Promise.all(ids.map(id => fetchCityById(id)))
        set(this.weatherData, weatherData.reduce((acc, data) => {
            acc[data.id] = data
            return acc
        }, {}))
    }

    async refreshCities() {
        const now = new Date().getTime()
        const ids = this.displayedWeatherData.filter(({id, timestamp}) => {
            if (this.favoriteCityIds.includes(id) && timestamp + THIRTY_MINUTES - TEN_MINUTES <= now) {
                return true
            }

            return timestamp + SIX_HOURS - TEN_MINUTES <= now;
        })

        return this.fetchCities(ids)
    }

    async fetchWeatherData() {
        const weatherData = await Promise.all(this.displayedCities.map(city => fetchCityById(city.id, city.name)))
        const wd = weatherData.reduce((acc, data) => {
            acc[data.id] = data
            return acc
        }, {})
        set(this.weatherData, wd)
        return weatherData
    }
}

const observableTodoStore = new ObservableCityStore();

export default observableTodoStore;
