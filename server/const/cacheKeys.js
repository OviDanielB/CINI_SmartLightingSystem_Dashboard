
/**
 * Keys used in Redis putting and getting to
 * differentiate various statistics (lamps,streets,global)
 * with different periods (hour,day,week)
 */
module.exports = {
    ANOMALY_LAMPS_ID_KEY: 'anomaly:lamp:id',
    STATISTICS_LAMPS_ID_KEY: 'statistics:lamp:id',
    STATISTICS_STREET_NAME_KEY: 'statistics:street:name',
    STATISTICS_GLOBAL_KEY: 'statistics:global',
    HOURLY_KEY: ':hour:',
    DAILY_KEY: ':day:',
    WEEKLY_KEY: ':week:'
};