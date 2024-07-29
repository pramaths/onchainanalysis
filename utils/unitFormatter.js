function formatNumber(value, chain) {
  if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + "B " + chain; // Billion
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + "M " + chain; // Million
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(1) + "K " + chain; // Thousand
  } else {
    return value + " " + chain; // Less than thousand
  }
}

module.exports = { formatNumber };
