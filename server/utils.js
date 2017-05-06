/**
 * Utility Functions
 */


module.exports = {
    isHourly: function (window) {
        return window === 3600;
    },

    isDaily: function (window) {
        return window === 3600 * 24;
    },

    isWeekly: function (window) {
        return window === 3600 * 24 * 7;
    }

};