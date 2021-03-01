import React  from 'react'
import Head from 'next/head'
import NoSSR from 'react-no-ssr';
import { API_URL } from '../config'
import { observer } from "mobx-react-lite"

import CityCard from "../components/CityCard";

export async function getServerSideProps(context) {
    const allCities = await (await fetch(`${API_URL}/api/city?country=DK`)).json()

    return {
        props: { allCities },
    }
}

const SortButtons = observer(({ store: { sortOrder, setSortOrder }}) => {
    const getClassName = (isSelected) => isSelected ? 'text-gray-200 bg-gray-700 proximity' : 'text-gray-400 bg-gray-900'
    return (
        <div className="flex justify-center mb-8">
            <button
                className={`${ getClassName(sortOrder === 'PROXIMITY')} block px-6 py-3 text-sm rounded shadow hover:text-gray-200 hover:bg-gray-700 focus:text-gray-200 focus:bg-gray-700`}
                type="button"
                onClick={() => setSortOrder('PROXIMITY')}>
                Proximity
            </button>
            <button
                className={`${ getClassName(sortOrder === 'MOST_WINDY')} block mx-3 px-6 py-3 text-sm rounded shadow hover:text-gray-200 hover:bg-gray-700 focus:text-gray-200 focus:bg-gray-700`}
                type="button"
                onClick={() => setSortOrder('MOST_WINDY')}>
                Most windy
            </button>
            <button
                className={`${ getClassName(sortOrder === 'LEAST_WINDY')} block px-6 py-3 text-sm rounded shadow hover:text-gray-200 hover:bg-gray-700 focus:text-gray-200 focus:bg-gray-700`}
                type="button"
                onClick={() => setSortOrder('LEAST_WINDY')}>
                Least windy
            </button>
        </div>
    )
})

const AllCities = observer(({ store }) => {
    const isFavorite = (id) => store.favoriteCityIds.includes(id)
    const sortOrder = store.sortOrder
    return (
        <>
            <h2 className="my-6 text-2xl" key="all_cities">All cities</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                { store.sortedCities.map((city) => <CityCard toggleFavorite={() => store.toggleFavorite(city.id)}
                                                       isFavorite={isFavorite(city.id)}
                                                       city={city}
                                                       key={city.id}/> ) }
            </div>
        </>
    )
})

const FavoriteCities = observer(({ store: { favoritesSortedCities, sortOrder, toggleFavorite } }) => {
    const _sortOrder = sortOrder
    return (
        <> {favoritesSortedCities.length > 0 && (
            <>
                <h2 className="my-6 text-2xl" key="favorites">Favorites</h2>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {favoritesSortedCities.map((city) => <CityCard toggleFavorite={() => toggleFavorite(city.id)}
                                                                   city={city}
                                                                   key={city.id}
                                                                   isFavorite/>)}
                </div>
            </>
        )}
        </>
    )
})

const Home = ({ store, allCities }) => {
    store.setRawCities(allCities)

    if (process.browser) {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            store.setLocation({ latitude, longitude })
            store.fetchWeatherData()
        })
    }

    return (
        <div className="min-h-screen text-gray-200 bg-gray-800">
            <Head>
                <title>Windy Denmark</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container p-6 mx-auto">
                <h1 className="py-10 text-3xl text-center">Windy Denmark</h1>

                <NoSSR>
                    <SortButtons store={store} />

                    <FavoriteCities store={store} />

                    <AllCities store={store} />
                </NoSSR>

                <div className="mt-12">
                    <button
                        className="block px-6 py-3 mx-auto text-sm rounded shadow text-gray-400 bg-gray-900 hover:text-gray-200 hover:bg-gray-700 focus:text-gray-200 focus:bg-gray-700"
                        type="button"
                        onClick={() => store.setPage(store.page + 1)}>
                        Load more
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Home;
