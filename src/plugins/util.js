import currency from 'currency.js';


class util {
  static transformImageUrl(path) {
    return new URL(path, import.meta.url).href;
  }
  
  static formatCurrency(val) {
    return currency(val, {symbol: ':-', pattern: '#!'}).format();
  }
};


export default util;