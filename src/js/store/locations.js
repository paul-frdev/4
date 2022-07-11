import api from '../services/apiService';
import { formatDate } from '../helpers/date';
class Locations {
  constructor(api, helpers) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.shortCitiesList = null;
    this.lastSearch = {};
    this.airlines = {};
    this.formatDate = helpers.formatDate;
  }
  async init() {
    const response = await Promise.all([
      this.api.countries(),
      this.api.cities(),
      this.api.airlines()
    ]);

    const [countries, cities, airlines] = response;
    this.countries = this.serializeCountries(countries);
    this.cities = this.serializeCities(cities);
    this.shortCitiesList = this.createShortCitiesList(this.cities)
    console.log(this.cities);
    this.airlines = airlines
    return response;
  }
  async fetchTickets(params) {
    const response = await this.api.prices(params);
    this.lastSearch = this.serializeTickets(response.data);
    console.log(this.lastSearch);
  }
  createShortCitiesList(cities) {
    return Object.entries(cities).reduce((acc, [, city]) => {
      acc[city.full_name] = null;
      return acc;
    }, {})
  }
  serializeTickets(tickets) {
    return Object.values(tickets).map(ticket => {
      return {
        ...ticket,
        origin_name: this.getCityNameByCode(ticket.origin),
        destination_name: this.getCityNameByCode(ticket.destination),
        airline_logo: this.getAirlineLogoByCode(ticket.airline),
        airline_name: this.getAirlineNameByCode(ticket.airline),
        departure_at: this.formatDate(ticket.departure_at, 'dd MMM yyyy hh:mm'),
        return_at: this.formatDate(ticket.return_at, 'dd MMM yyyy hh:mm'),
      }
    })
  }
  serializeCountries(countries) {
    // {'country code': {...}}
    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    }, {})
  }
  serializeCities(cities) {
    // {'City name, Country name': {...} }
    return cities.reduce((acc, city) => {
      const countryName = this.countries[city.country_code].name;
      city.name = city.name || city.name_translations.en;
      const full_name = `${city.name},${countryName}`;
      acc[city.code] = {
        ...city,
        countryName,
        full_name
      };
      return acc;
    }, {})
  }
  getCountryNameByCode(code) {
    // {'Country Code': {...}}
    return this.countries[code].name;
  }
  getCityCodeByKey(key) {
    const city = Object.values(this.cities).find((item) => item.full_name === key);
    return city.code;
  }
  // return name 
  getAirlineNameByCode(code) {
    return this.airlines[code] ? this.airlines[code].name : '';
  }
  // return logo 
  getAirlineLogoByCode(code) {
    return this.airlines[code] ? this.airlines[code].logo : '';
  }

  // city's names
  getCityNameByCode(code) {
    return this.cities[code].name;
  }

}

const locations = new Locations(api, { formatDate });
export default locations;

// {'City, Country': null},
// [{}, {}]
// {City: {}}
