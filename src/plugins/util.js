const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "SEK",
});

class util {
  static transformImageUrl(path) {
    return new URL(path, import.meta.url).href;
  }

  static formatCurrency(val) {
    return formatter.format(val);
    //return `${val.toFixed(2)}:-`;
  }
}

export default util;
