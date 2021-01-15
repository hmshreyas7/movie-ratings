import countries from 'i18n-iso-countries';
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

let regionOptions = Object.entries(
  countries.getNames('en', { select: 'official' })
)
  .sort((a, b) => a[1].localeCompare(b[1]))
  .map((country) => {
    return {
      value: country[0],
      label: country[1],
    };
  });

regionOptions.unshift({
  value: '',
  label: 'Worldwide',
});

export default regionOptions;
