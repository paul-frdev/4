import api from '../services/apiService';

class Locations {
  constructor(api) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.shortCitiesList = null;
  }

  async init() {
    const response = await Promise.all([
      this.api.countries(),
      this.api.cities()
    ])

    const [countries, cities] = response;
    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.shortCitiesList = this.createShortCitiesList(this.cities)
    return response
  }

  async fetchTickets(params) {
    const response = await this.api.prices(params)
     console.log(response);
  }

  createShortCitiesList(cities) {
    return Object.entries(cities).reduce((acc, [key]) => {
      acc[key] = null;
      return acc;
    }, {})
  }
  serializeCountries(countries) {
    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    }, {})
  }

  serializeCities(cities) {
    return cities.reduce((acc, city) => {
      const cityName = city.name || city.name_translations.en;
      const countryName = this.getCityByCountryName(city.country_code)
      const key = `${cityName},${countryName}`;
      acc[key] = city;
      return acc;
    }, {})
  }
  getCityByCountryName(code) {
    return this.countries[code].name
  }
  getCityCodeByKey(key) {
    return this.cities[key].code
  }
}

const locations = new Locations(api);

export default locations;
