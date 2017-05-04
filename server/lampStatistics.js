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
    incrementTotalLamps: function () {
        lampsCount.total += 1;
    },
    setAnomalyLampsCount: function (c) {
        lampsCount.anomalies = c;

    },
    incrementAnomalyLamps: function () {
        lampsCount.anomalies += 1;
    },
    setWorkingLamps: function (c) {
        lampsCount.working = c;
    },
    incrementWorkingLamps: function () {
        lampsCount.working += 1;
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
        //streetCount.total = streetStat.statHour.length;
        //console.log("UPDATE " + streetCount);
    },
    finalLampList: function () {
        return finalLampList;
    },
    emptyLampList: function () {
        finalLampList = [];
    },
    setLampList: function (list) {
        finalLampList = list;
    },
    pushLampList: function (item) {
        finalLampList.push(item);
    },
    finalStreetList: function () {
        return finalStreetList;
    },
    emptyStreetList: function () {
        finalStreetList = [];
    },
    setStreetList: function (list) {
        finalStreetList = list;
    },
    pushStreetList: function (item) {
        finalStreetList.push(item);
    },
    streetCount: function () {
        return streetCount;
    },
    setTotalStreets: function (c) {
        streetCount.total = c;
        console.log("SET " + streetCount.total);
    },
    incrementTotalStreets: function () {
        streetCount.total += 1;
        console.log("INCREMENT " + streetCount.total);
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