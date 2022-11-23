class util {
  static transformImageUrl(path) {
    return new URL(path, import.meta.url).href;
  }

  static formatCurrency(val) {
    return `${val.toFixed(2)}:-`;
  }
}

export default util;
