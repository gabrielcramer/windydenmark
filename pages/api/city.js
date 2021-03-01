import cities from '../../data/city.list.json'

export default (req, res) => {

    const { country } = req.query;

    const citiesByCountry = cities.filter(city => city.country === country)

    res.status(200).json(citiesByCountry.map(({ id, name, coord }) => ({ id, name, coord })))
}
