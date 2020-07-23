<template>
  <div class="help">
    <v-card
      class="mx-auto my-5 pa-3"
      max-width="90%"
      tile
    >
      <v-list-item>
        <v-list-item-content>
          <h2>Kontrola připojení</h2>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Připojení k serveru:
            <v-progress-circular
              indeterminate
              :size="25"
              :width="2"
              color="primary"
              class="ml-1"
              v-if="!connection.server.loaded"
            ></v-progress-circular>
            <template v-else>
              <template v-if="connection.server.status == 1">
                <v-icon class="green--text">mdi-check</v-icon>
              </template>
              <template v-else>
                <v-icon class="red--text">mdi-close</v-icon>
              </template>
              <span class="small-text">({{connection.server.message}})</span>
            </template>
          </v-list-item-title>
          <v-list-item-subtitle>Kontroluje připojení k serveru, na který babyboxy posílají data (109.105.46.123)</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Připojení k databázi: 
            <v-progress-circular
              indeterminate
              :size="25"
              :width="2"
              color="primary"
              class="ml-1"
              v-if="!connection.database.loaded"
            ></v-progress-circular>
            <template v-else>
              <template v-if="connection.database.status == 1">
                <v-icon class="green--text">mdi-check</v-icon>
              </template>
              <template v-else>
                <v-icon class="red--text">mdi-close</v-icon>
              </template>
              <span class="small-text">({{connection.database.message}})</span>
            </template>
          </v-list-item-title>
          <v-list-item-subtitle>Kontroluje připojení k databázi na serveru, kde se ukládají data</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "CheckConnection",
  data: () => ({
    connection: {
      server: {
          status: 0,
          message: '',
          loaded: false
      },
      database: {
          status: 0,
          message: '',
          loaded: false
      }
    }
  }),
  created() {
    setTimeout(() => {
      fetch(`http://192.168.101.142:3000/check`)
        .then(response => response.json())
        .then(data => {
          console.log(data.database)
          this.connection = this._.merge(this.connection, data)
        })
        .catch(err => {
          this.connection = {
            server: {
              status: 0,
              message: 'Chyba',
              loaded: true
            },
            database: {
                status: 0,
                message: 'Odpojeno',
                loaded: true
            }
          }
          console.log(err);
        });
    }, 1000)
  },
};
</script>

<style lang="scss">
</style>
