const library = (function () {

    function formatEpochSeconds(epochSeconds) {
        return formatDate(epochSecondsToDate(epochSeconds));
    }

    function epochSecondsToDate(epochSeconds) {
        return new Date(epochSeconds * 1000);
    }

    function formatDate(date) {
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    }

    return {
        formatEpochSeconds,
        epochSecondsToDate,
        formatDate
    };
})();

module.exports = library;
