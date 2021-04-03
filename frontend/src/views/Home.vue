<template>
  <v-container>
    <v-row>
      <v-col cols="12" red>
        <v-data-table
          v-show="loading"
          loading
          loading-text="Načítám data..."
          :headers="headers"
          :sort-by="['customName']"
          items-per-page-options
          :footer-props="{
            'items-per-page-options': [5,20,40,-1],
            'items-per-page-text': 'Počet položek na stránce:',
            'items-per-page-all-text': 'Vše',
          }"
          :items-per-page="-1"
        ></v-data-table>
        <v-data-table
          v-show="!loading"
          dense
          :headers="headers"
          :items="babyboxes"
          :sort-by="['customName']"
          :footer-props="{
            'items-per-page-options': [5,20,40,-1],
            'items-per-page-text': 'Počet položek na stránce:',
            'items-per-page-all-text': 'Vše',
          }"
          :items-per-page="-1"
        >
          <template v-slot:body="{ items }">
            <tbody>
              <template v-for="item in items">
                <router-link
                  v-if="item.lastData.temperature && item.lastData.status != 1"
                  :key="item._id"
                  :class="{
                    'red': item.lastData.status == 1,
                    'green': item.lastData.status == 0,
                    'orange': item.lastData.status != 1 && item.lastData.status != 0,
                    'cursor': true,
                    }"
                  :to="{
                    name: 'Babybox',
                    params: {
                      name: item.name
                    }
                  }"
                  tag="tr"
                >
                  <td>{{ item.customName }}</td>
                  <td>{{ toFixed(item.lastData.temperature.inner, 2) || "-" }}</td>
                  <td>{{ toFixed(item.lastData.voltage.in, 2) || "-" }}</td>
                  <td>{{ toFixed(item.lastData.voltage.battery, 2) || "-" }}</td>

                  <td>{{ statusToString(item.lastData.status) }}</td>

                  <td v-if="item.lastServisDate">{{ item.lastServisDate }}</td>
                  <td v-else>- -.- -.- - - -</td>
                </router-link>
                <router-link
                  v-else
                  :key="item._id"
                  class="red cursor"
                  :to="{
                    name: 'Babybox',
                    params: {
                      id: item._id,
                      name: item.name
                    }
                  }"
                  tag="tr"
                >
                  <td>{{ item.customName }}</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>Chyba</td>
                  <td v-if="item.lastServisDate">{{ item.lastServisDate }}</td>
                  <td v-else>- -.- -.- - - -</td>
                </router-link>
              </template>
            </tbody>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import statusToString from "../mixins/data/statusToString"

export default {
  name: "Home",
  mixins: [statusToString],
  data: () => ({
    headers: [
      { text: "Umístění", value: "customName" },
      { text: "Teplota vnitřní", value: "lastData.temperature.inner" },
      { text: "Napětí vstupní", value: "lastData.voltage.in" },
      { text: "Napětí akumulátoru", value: "lastData.voltage.battery" },
      { text: "Status", value: "lastData.status" },
      { text: "Poslední servis", value: "lastServisDate" }
    ],
    babyboxes: [],
    loading: true
  }),
  async created() {
    try {
      this.babyboxes = await this.$store.dispatch("getAllBabyboxes")
      this.loading = false
    } catch(err) {
      console.log(err);
    }
  },
  methods: {
    toFixed: function(number, decimals) {
      return number.toFixed(decimals)
    }
  }
};
</script>

<style>
.cursor {
  cursor: pointer;
}
</style>
