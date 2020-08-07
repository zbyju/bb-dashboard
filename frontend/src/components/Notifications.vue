<template>
  <div class="Notification">
    <v-alert
      v-for="notificationGroup in groupedNotifications"
      :key="notificationGroup[0]._id"
      border="bottom"
      colored-border
      type="warning"
      elevation="7"
    >
      <v-row align="center">
        <v-col class="grow pa-0">
          <v-row>
            <v-col>
              <h3>{{ notificationGroup[0].notificationTemplate.title }}</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <p>{{ notificationGroup[0].notificationTemplate.message }}</p>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col
              v-for="notification in notificationGroup"
              :key="notification._id"
            >
              <p>{{ notification.createdAtTime }}</p>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="shrink pa-0 mb-7 align-self-end">
          <div class="d-flex flex-column jusitfy-space-between">
            <p>{{ notificationGroup[0].createdAtDate }}</p>
            <v-btn
              router
              text
              disabled
              height="24px"
            >Smazat</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-alert>
  </div> 
</template>

<script>
import moment from "moment"

export default {
  name: "Stats",
  props: ["notifications"],
  data() {
    return {
      groupedNotifications: []
    }
  },
  mounted() {
    console.log(this.notifications)
  },
  watch: {
    notifications: function(newNotifications, oldNotifications) {
      let groupedNotifications = []
      let currentGroup = []
      let lastDate = moment(newNotifications[0].createdAt)

      newNotifications.forEach(notification => {
        let diff = Math.abs(
                    moment.duration(
                      lastDate.diff(
                        moment(notification.createdAt)
                      )
                    ).asMinutes())
        if(Math.abs(diff) > 10) {
          groupedNotifications.push(currentGroup)
          currentGroup = []
        }
        let customNotification = notification
        customNotification.status = this.getNotificationStatus(customNotification)
        customNotification.createdAtDate = moment(notification.createdAt).format("DD.MM.YYYY")
        customNotification.createdAtTime = moment(notification.createdAt).format("HH:mm")
        currentGroup.push(customNotification)
        lastDate = moment(notification.createdAt)
      })
      groupedNotifications.push(currentGroup)
      this.groupedNotifications = groupedNotifications
    }
  },
  methods: {
    getNotificationStatus: function(notification) {
      if (notification.priority <= 3) {
        return "info"
      } else if (notification.priority >= 3 && notification.priority <= 6) {
        return "warning"
      } else {
        return "error"
      }
    }
  }
}
</script>

<style lang="scss">

</style>
