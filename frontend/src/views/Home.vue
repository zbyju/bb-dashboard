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
                  v-if="item.lastData && item.lastData.status == 0"
                  :key="item._id"
                  :class="[item.lastData.status ? 'red' : 'green', 'cursor']"
                  :to="{
                    name: 'Babybox',
                    params: {
                      name: item.name
                    }
                  }"
                  tag="tr"
                >
                  <td>{{ item.customName }}</td>

                  <td>{{ item.lastData.temperature.inner || "-" }}</td>
                  <td>{{ item.lastData.voltage.in || "-" }}</td>
                  <td>{{ item.lastData.voltage.battery || "-" }}</td>

                  <td>OK</td>

                  <td v-if="item.lastServisDate">{{ item.lastServisDate }}</td>
                  <td v-else>- -.- -.- - - -</td>
                </router-link>
                <router-link
                  v-else
                  :key="item._id"
                  :class="['red', 'cursor']"
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
export default {
  name: "Home",
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
  created() {
    fetch("http://localhost:3000/api/babybox/all/populate")
      .then(response => response.json())
      .then(babyboxes => {
        this.babyboxes = babyboxes;
        this.loading = false;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style>
.cursor {
  cursor: pointer;
}
</style>
