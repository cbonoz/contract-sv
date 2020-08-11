const library = (function () {
  function formatEpochSeconds(epochSeconds) {
    return formatDate(epochSecondsToDate(epochSeconds));
  }

  function epochSecondsToDate(epochSeconds) {
    const d = new Date(epochSeconds * 1000);
    if (d.getFullYear() === 1969) {
      console.log("e", epochSeconds, d);
    }
    return d;
  }

  function formatDate(date) {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  return {
    formatEpochSeconds,
    epochSecondsToDate,
    formatDate,
  };
})();

module.exports = library;
