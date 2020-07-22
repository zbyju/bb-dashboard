const moment = require('moment')

module.exports = {
    mapDataToIndex(data, index) {
        if(index == 0) {
            return data.temperature.outside
        } else if(index == 1) {
            return data.temperature.inner
        } else if(index == 2) {
            return data.temperature.bottom
        } else if(index == 3) {
            return data.temperature.top
        } else if(index == 4) {
            return data.temperature.casing
        } else if(index == 5) {
            return data.temperature.in
        } else if(index == 6) {
            return data.temperature.battery
        }
        return null
    },
    fixValuesFromBabybox: function(data) {
        data.temperature.outside = (data.temperature.outside / 100).toFixed(2)
        data.temperature.inner = (data.temperature.inner / 100).toFixed(2)
        data.temperature.bottom = (data.temperature.bottom / 100).toFixed(2)
        data.temperature.top = (data.temperature.top / 100).toFixed(2)
        data.temperature.casing = (data.temperature.casing / 100).toFixed(2)

        data.voltage.in = (data.voltage.in / 100).toFixed(2)
        data.voltage.battery = (data.voltage.battery / 100).toFixed(2)

        const minute = moment(data.time).minute()
        const lastDigitMinute = minute.toString()[1]
        if(lastDigitMinute != 9 && lastDigitMinute != 0 && lastDigitMinute != 1) {
            data.status = 2 //Data came, but not at the rigth time (x9, x0, x1)
        }

        for(let i = 0; i < 7; ++i) {
            if(Math.abs(this.mapDataToIndex[i] < 0.1)) {
                data.status = 3 //Thermometer not working
            }
        }

        return data
    },
    checkForNotifications: function(data) {
    
    }
}