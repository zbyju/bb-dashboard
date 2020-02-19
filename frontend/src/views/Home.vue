<template>
  <v-container>
    <v-row>
      {{babyboxes}}
      <v-col cols="12" red>
        <v-data-table
          :headers="headers"
          :items="babyboxes"
          :sort-by="['customName']"
          :sort-desc="[false]"
          multi-sort>
            <template v-slot:body="{ items }">
              <tbody>           
                <tr v-for="item in items" :key="item._id">
                    <td>{{  item.customName  }}</td>
                    <td>{{  item.lastData.temperature.inner  }}</td>
                    <td>{{  item.lastData.voltage.in  }}</td>
                    <td>{{  item.lastData.voltage.battery  }}</td>
                    <td>{{  item.lastData.status  }}</td>
                    <td v-if="item.lastServisDate">{{item.lastServisDate}}</td>
                    <td v-else>- -.- -.- - - -</td>
                </tr>
           </tbody>
            </template>
        </v-data-table>
        <v-data-table
          :items="babyboxes"
          :headers="headers2">
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  data: () => ({
    headers: [{ text: 'Umístění' },
      { text: 'Teplota vnitřní' },
      { text: 'Napětí vstupní' },
      { text: 'Napětí akumulátoru' },
      { text: 'Status' },
      { text: 'Poslední servis' },
    ],
    headers2: [{text: "test", value: ""}],
    babyboxes: []
  }),
  created() {
    fetch('http://localhost:3000/api/babybox/all/populate')
    .then(response => response.json())
    .then(babyboxes => {
      this.babyboxes = babyboxes
    })
    .catch(err => {
      console.log(err)
    })
  },
};
</script>
