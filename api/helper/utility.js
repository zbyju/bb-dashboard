module.exports = {
    fixValuesFromBabybox: function(data) {
        data.temperature.outside = (data.temperature.outside / 100).toFixed(2)
        data.temperature.inner = (data.temperature.inner / 100).toFixed(2)
        data.temperature.bottom = (data.temperature.bottom / 100).toFixed(2)
        data.temperature.top = (data.temperature.top / 100).toFixed(2)
        data.temperature.casing = (data.temperature.casing / 100).toFixed(2)

        data.voltage.in = (data.voltage.in / 100).toFixed(2)
        data.voltage.battery = (data.voltage.battery / 100).toFixed(2)
        return data
    }
}