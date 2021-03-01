import React from "react";

const getWindDirection = (deg) => {
    let compassSector = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];

    return compassSector[(deg / 22.5).toFixed(0)];
}

const handleToggle = (name, isFavorite, toggleFavorite) => {
    if (isFavorite) {
        window.confirm(`Are you sure you want to remove ${name} from favorites?`) && toggleFavorite()
    } else {
        toggleFavorite()
    }
}

export default function CityCard({ city, toggleFavorite, isFavorite }) {

    const { name } = city
    const { icon, description } = city.weather[0]
    const { temp } = city.main
    const { speed, deg } = city.wind
    const cloudiness = city.clouds.all

    return (
        <article className="overflow-hidden rounded-lg shadow-lg bg-gray-900">
            <div className="flex justify-between p-4">
                <h1>{name}</h1>
                <button onClick={() => handleToggle(name, isFavorite, toggleFavorite)} className="p-0.5 text-yellow-300 hover:text-yellow-200 focus:text-yellow-200" type="button">
                    {isFavorite ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path
                                    d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                            </svg>)
                        :(
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                                <path
                                    d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                            </svg>)
                    }
                </button>
            </div>
            <div className="flex flex-wrap justify-center items-center p-4">
                <div className="w-1/3">
                    <img className="block max-w-full mx-auto" src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt={description}/>
                </div>
                <div className="w-1/3 text-5xl text-center">
                    {temp}°
                </div>
                <div className="w-full text-center text-gray-400 capitalize">
                    {description}
                </div>
            </div>
            <div className="flex justify-center px-4 py-6">
                <div className="w-1/3 text-center">
                    <div className="">{speed}m/s</div>
                    <div className="text-xs text-gray-400">wind speed</div>
                </div>
                <div className="w-1/3 text-center">
                    <div className="">{getWindDirection(deg)}</div>
                    <div className="text-xs text-gray-400">wind direction</div>
                </div>
                <div className="w-1/3 text-center">
                    <div className="">{cloudiness}%</div>
                    <div className="text-xs text-gray-400">cloudiness</div>
                </div>
            </div>
        </article>
    )
}
