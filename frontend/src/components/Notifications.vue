<template>
  <div class="Notifications">
    <v-skeleton-loader :loading="loading" v-if="loading" type="paragraph">
    </v-skeleton-loader>
    <template v-if="!loading">
      <div v-if="groupedNotifications.length == 0">
        <p>Žádné notifikace</p>
      </div>
      <v-alert
        v-for="notificationGroup in groupedNotifications"
        :key="notificationGroup[0]._id"
        border="bottom"
        colored-border
        :type="notificationGroup[0].status"
        elevation="7"
        prominent
      >
        <div class="d-flex flex-row">
          <div class="flex-grow-1">
            <h3>{{ notificationGroup[0].notificationTemplate.title }}</h3>
            <p>{{ notificationGroup[0].notificationTemplate.message }}</p>
            <div class="d-flex flex-row flex-wrap">
              <v-card v-for="notification in notificationGroup" :key="notification._id" class="ma-1 pa-2 time" elevation="8">
                <v-tooltip top color="#253340">
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">{{ notification.createdAtTime }}</span>
                  </template>
                  <h3 class="my-2 pa-0">Data {{ timeFormat(notification.data.time) }}:</h3>
                  <p class="mt-0 mb-1 pa-0">Status:
                    <span :class="{
                      'green--text' : notification.data.status == 0,
                      'red--text' : notification.data.status == 1,
                      'yellow--text text--darken-1' : notification.data.status > 1,
                    }">{{ statusToString(notification.data.status) }}</span>
                  </p>
                  <template v-if="notification.data.status != 1">
                    <p class="my-0 pa-0 orange--text">Teplota vnitřní: {{ notification.data.temperature.inner || "--" }}°C</p>
                    <p class="my-0 pa-0 green--text">Teplota venkovní: {{ notification.data.temperature.outside || "--" }}°C</p>
                    <p class="my-0 pa-0 blue--text">Teplota dolní: {{ notification.data.temperature.bottom || "--" }}°C</p>
                    <p class="my-0 pa-0 red--text">Teplota horní: {{ notification.data.temperature.top || "--" }}°C</p>
                    <p class="mt-0 mb-1 pa-0 yellow--text text--darken-1">Teplota pláště: {{ notification.data.temperature.casing || "--" }}°C</p>
                    <p class="my-0 pa-0 teal--text text--accent-3">Napětí vnitřní: {{ notification.data.voltage.in || "--" }}V</p>
                    <p class="my-0 pa-0 purple--text text--lighten-1">Napětí akumulátoru: {{ notification.data.voltage.battery || "--" }}V</p>
                    <!-- <p class="my-0 pa-0">Template: {{notification.notificationTemplate.title }} </p> -->
                  </template>
                </v-tooltip>
              </v-card>
            </div>
          </div>
          <div>
            <p>{{ notificationGroup[0].createdAtDate }}</p>
          </div>
        </div>
      </v-alert>
    </template>
  </div>
</template>

<style lang="scss">
.Notifications {
  .v-alert {
    .v-icon {
      margin-top: 5px;
      align-self: flex-start;
    }

    .times {
      display: flex;
      flex-direction: row;
    }

    .time {
      display: flex;
      flex-direction: row;
      justify-content: center;
      background: var(--lightGrey) !important;
      text-align: center

      span {
        margin: auto;
        text-align: center
      }
    }
  }
}
</style>

<script>
import moment from "moment"

import statusToString from "../mixins/data/statusToString"

export default {
  name: "Stats",
  props: ["notifications"],
  mixins: [statusToString],
  data() {
    return {
      groupedNotifications: [],
      loading: true
    }
  },
  watch: {
    notifications: function(newNotifications, oldNotifications) {
      if(newNotifications.length == 0) {
        this.loading = false
        return
      }
      let groupedNotifications = []
      let currentGroup = []
      let lastNotificationTemplateID = newNotifications[0].notificationTemplate._id
      let lastDate = moment(newNotifications[0].createdAt)

      newNotifications.forEach(notification => {
        let diff = Math.abs(
                    moment.duration(
                      lastDate.diff(
                        moment(notification.createdAt)
                      )
                    ).asMinutes())
        if(Math.abs(diff) > 60 || lastNotificationTemplateID != notification.notificationTemplate._id) {
          groupedNotifications.push(currentGroup)
          currentGroup = []
        }
        let customNotification = notification
        customNotification.status = this.getNotificationStatus(customNotification)
        customNotification.createdAtDate = moment(notification.createdAt).format("DD.MM.YYYY")
        customNotification.createdAtTime = moment(notification.createdAt).format("HH:mm")
        currentGroup.push(customNotification)

        lastNotificationTemplateID = notification.notificationTemplate._id
        lastDate = moment(notification.createdAt)
      })
      groupedNotifications.push(currentGroup)
      groupedNotifications.sort((a, b) => {
        if(a[0].createdAtDate > b[0].createdAtDate) {
          return -1
        } else if(a[0].createdAtDate < b[0].createdAtDate){
          return 1
        } else {

          if(a[0].notificationTemplate.priority > b[0].notificationTemplate.priority) {
            return -1
          } else if(a[0].notificationTemplate.priority < b[0].notificationTemplate.priority) {
            return 1
          } else {

            if(a[0].createdAtTime > b[0].createdAtTime) {
              return -1
            } else if(a[0].createdAtTime < b[0].createdAtTime) {
              return 1
            } else {
              return 0
            }

          }
        }
      })
      this.groupedNotifications = groupedNotifications
      this.loading = false
    }
  },
  methods: {
    getNotificationStatus: function(notification) {
      if (notification.notificationTemplate.priority <= 3) {
        return "info"
      } else if (notification.notificationTemplate.priority >= 3 && notification.notificationTemplate.priority <= 6) {
        return "warning"
      } else {
        return "error"
      }
    },
    timeFormat(time) {
      return moment(time).format("DD.MM.YYYY HH:mm")
    },
  }
}
</script>
