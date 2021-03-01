import '../styles/globals.css'
import CityStore from '../store/CityStore'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} store={CityStore} />
}

export default MyApp
