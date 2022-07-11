import './plugins';
import '../css/style.css';
import locations from './store/locations';
import formUl from './views/formUI';
import currencyUI from './views/currency';
import ticketsUI from './views/ticketsUI';


document.addEventListener('DOMContentLoaded', () => {
  initApp();
  const form = formUl.form;

  form.addEventListener('submit', e => {
    e.preventDefault();
    onSubmitForm()
  })


  async function initApp() {
    await locations.init();
    formUl.setAutoCompleteData(locations.shortCitiesList)
  }
  async function onSubmitForm() {
    const origin = locations.getCityCodeByKey(formUl.originValue.replace(/\s/g, ''));
    const destination = locations.getCityCodeByKey(formUl.destinationValue.replace(/\s/g, ''));
    const depart_date = formUl.departDateValue;
    const return_date = formUl.returnDateValue;
    const currency = currencyUI.currencyValue

    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency
    });
    
    ticketsUI.ticketTemplate(locations.lastSearch)
  }
})

// locations.init().then(res => {
//   console.log(res);
//   console.log(locations);
//   // console.log(locations.getCitiesByCountryCode('PE'));
// });


