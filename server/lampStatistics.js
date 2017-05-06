/**
 * Defines main objects that hold
 * lamp and street statistics,
 * anomalies, ranking, etc
 */


module.exports = {
    lampsCount: function () {
        return lampsCount;
    },
    setTotalLamps: function (c) {
        lampsCount.total = c;
        lampsCount.working = lampsCount.total - lampsCount.anomalies;
    },
    setAnomalyLampsCount: function (c) {
        lampsCount.anomalies = c;

    },
    lampAnomalies: function () {
        return lampAnomalies;
    },
    setLampAnomalies: function (list) {
      lampAnomalies = list;
    },
    lampsStat: function () {
        return lampsStat;
    },
    updateLampStat: function (newStat) {
        lampsStat = newStat;
    },
    streetStat: function () {
        return streetStat;
    },
    updateStreetStat: function (newValue) {
        streetStat = newValue;
    },
    finalLampList: function () {
        return finalLampList;
    },
    setLampList: function (list) {
        finalLampList = list;
    },
    finalStreetList: function () {
        return finalStreetList;
    },
    setStreetList: function (list) {
        finalStreetList = list;
    },
    streetCount: function () {
        return streetCount;
    },
    setTotalStreets: function (c) {
        streetCount.total = c;
        console.log("SET " + streetCount.total);
    },
    ranking: function () {
        return ranking;
    },
    setRanking: function (list) {
        ranking = list;
    }
};


var streetCount = {
    total: 0
};

var lampsCount = {
    total: 0,
    working: 0,
    anomalies: 0
};

/* lamps with relative anomalies */
var lampAnomalies = [];

/* support lamp statistics arrays */
var lampsStat = {
    statHour: [],
    statDay: [],
    statWeek: []
};

/* support street statistics arrays */
var streetStat = {
    statHour: [],
    statDay: [],
    statWeek: []
};

/* final list with all period consumption statistics */
var finalLampList = [];
var finalStreetList = [];

/* lamp ranking array */
var ranking = [];