<template>
  <div class="help">
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      <span>{{ snackbar.text }}</span>
      <v-btn
        :color="snackbar.colorBtn"
        text
        @click="snackbar.show = false"
      >
        Zavřít
      </v-btn>
    </v-snackbar>
      <v-container>
        <v-skeleton-loader :loading="loading" type="table">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Název</th>
                  <th class="text-left">Zpráva</th>
                  <th class="text-left">Podmínka</th>
                  <th class="text-left">Série</th>
                  <th class="text-left">Priorita</th>
                  <th class="text-left">Emailové notifikace</th>
                  <th class="text-left">Emaily</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in notifications" :key="index">
                  <td>{{ item.title }}</td>
                  <td>{{ item.message }}</td>
                  <td>{{ variableText(item.variable) }} {{ item.comparison }} {{ item.threshold }}</td>
                  <td>{{ item.streak }}</td>
                  <td>{{ item.priority }}</td>
                  <td v-if="item.emailNotification === true">
                    <span><v-icon class="green--text">mdi-check</v-icon></span>
                  </td>
                  <td v-if="item.emailNotification !== true">
                    <span><v-icon class="red--text">mdi-close</v-icon></span>
                  </td>
                  <td v-if="item.emailNotification">
                    <p v-for="(email, index) in item.emails" :key="index">{{ email }}</p>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-skeleton-loader>
      </v-container>

    <v-container>
      <v-form class="mb-10">
        <v-container class="main mt-10">
          <h1 class="ma-3">Přidat notifikaci</h1>
          <v-row>
            <v-col>
              <v-text-field
                label="Název"
                v-model="activeNotification.title"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                outlined
                label="Zpráva"
                v-model="activeNotification.message"></v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
              :items="[
                { text: 'Teplota vnitřní', value: 1 },
                { text: 'Teplota venkovní', value: 2 },
                { text: 'Teplota dolní', value: 3 },
                { text: 'Teplota horní', value: 4 },
                { text: 'Teplota pláště', value: 5 },
                { text: 'Napětí vstupní', value: 6 },
                { text: 'Napětí akumulátor', value: 7 },
                { text: 'Status', value: 0 }
              ]"
              item-value="value"
              item-text="text"
              v-model="activeNotification.variable"
              label="Proměnná"
            ></v-select>
            </v-col>
            <v-col>
              <v-select
                :items="[
                  { text: 'Menší než (proměnná < hranice)', value: '<' },
                  { text: 'Větší než (proměnná > hranice)', value: '>' },
                  { text: 'Menší, nebo rovno než (proměnná <= hranice)', value: '<=' },
                  { text: 'Větší, nebo rovno než (proměnná >= hranice)', value: '>=' },
                  { text: 'Rovno (proměnná == hranice)', value: '==' },
                  { text: 'Nerovno (proměnná != hranice)', value: '!=' },
                ]"
                item-value="value"
                item-text="text"
                v-model="activeNotification.comparison"
                label="Porovnání"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label class="small-text">Hranice (hodnota = {{activeNotification.threshold}})</label>
              <v-slider
                v-model="activeNotification.threshold"
                :min="form.min"
                :max="form.max"
                :step="form.step"
                thumb-label
              ></v-slider>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label class="small-text">Série (hodnota = {{activeNotification.streak}})</label>
              <v-slider
                v-model="activeNotification.streak"
                min="0"
                max="144"
                thumb-label
              ></v-slider>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <label class="small-text">
                Priorita (hodnota = <span :class="{
                  'blue--text': activeNotification.priority <= 3,
                  'warning--text': activeNotification.priority <= 6 && activeNotification.priority > 3,
                  'red--text': activeNotification.priority <= 10 && activeNotification.priority > 6
                }">{{activeNotification.priority}}</span>)
              </label>
              <v-slider
                v-model="activeNotification.priority"
                :min="1"
                :max="10"
                thumb-label
              ></v-slider>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-row>
                <h4 class="align-self-center mr-5 mb-1">Emaily</h4>
                <v-switch
                  v-model="activeNotification.emailNotification"
                ></v-switch>
              </v-row>
              <v-row v-if="activeNotification.emailNotification">
                <v-col>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Emailová adresa</th>
                          <th class="text-center">Smazat</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(email, index) in activeNotification.emails" :key="index">
                          <td class="text-left">{{ email }}</td>
                          <td class="text-center">
                            <v-icon
                              small
                              @click="deleteEmail(index)"
                              >mdi-delete</v-icon>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
                <v-col>
                  <v-text-field
                    label="Email"
                    v-model="form.email"></v-text-field>
                </v-col>
                <v-btn
                  class="align-self-center"
                  @click="addEmail()"
                >Přidat email</v-btn>
              </v-row>
            </v-col>
          </v-row>
          <v-btn class="mx-3" @click="submit">Uložit</v-btn>
        </v-container>
      </v-form>
    </v-container>
  </div>
</template>
<script>

export default {
  name: "EditBabybox",
  data: () => ({
    defaultNotification: {
      idBabyboxes: [],
      global: true,
      title: "",
      message: "",
      emailNotification: true,
      emails: [],
      variable: null,
      comparison: "",
      threshold: null,
      streak: null,
      priority: null,
    },
    activeNotification: {
      idBabyboxes: [],
      global: true,
      title: "",
      message: "",
      emailNotification: true,
      emails: [],
      variable: 0,
      comparison: "==",
      threshold: 0,
      streak: 1,
      priority: 5
    },
    notifications: [],
    form: {
      email: '',
      min: -1,
      max: 10,
      step: 1,
    },
    loading: true,
    snackbar: {
      show: false,
      text: '',
      color: '',
      colorBtn: '',
      timeout: 10000
    }
  }),
  async created() {
    try {
      this.notifications = await this.$store.dispatch("getGlobalNotifications")
      this.loading = false
    } catch(err) {
      console.log(err);      
    }
  },
  methods: {
    submit: async function() {
      try {
        let notification = await this.$store.dispatch("createGlobalNotification", this.activeNotification)
        this.notifications.push(notification);
        this.activeNotification = this._.merge({}, this.defaultNotification);
        this.loading = false;
        this.snackbar.show = true;
        this.snackbar.text = "Telefonní číslo úspěšně přidáno."
        this.snackbar.color = "success"
        this.snackbar.colorBtn = "white"
      } catch(err) {
        this.snackbar.show = true;
        this.snackbar.text = "Vyskytla se chyba při přidávání telefonního čísla."
        this.snackbar.color = "error"
        this.snackbar.colorBtn = "white"
        console.log(err);
      }
    },
    addEmail: function() {
      this.activeNotification.emails.push(this.form.email);
      this.form.email = "";
    },
    deleteEmail: function(index) {
      this.activeNotification.emails.splice(index, 1);
    },
    variableText: function(index) {
      if(index == 0) {
        return "Status"
      } else if(index == 1) {
        return "Teplota vnitřní"
      } else if(index == 2) {
        return "Teplota venkovní"
      } else if(index == 3) {
        return "Teplota dolní"
      } else if(index == 4) {
        return "Teplota horní"
      } else if(index == 5) {
        return "Teplota plášť"
      } else if(index == 6) {
        return "Napětí vstupní"
      } else if(index == 7) {
        return "Napětí akumulátor"
      }
    }
  },
  watch: {
    "activeNotification.variable": function(val) {
      if(val > 0 && val <= 5) { //Teplota
        this.activeNotification.threshold = 25;
        this.form.min = -20;
        this.form.max = 70;
        this.form.step = 0.1;
      } else if(val > 5 && val <= 7) { //Napeti
        this.activeNotification.threshold = 14;
        this.form.min = 0;
        this.form.max = 20;
        this.form.step = 0.01;
      } else if(val == 0) { //Status
        this.activeNotification.threshold = 0;
        this.form.min = -1;
        this.form.max = 10;
        this.form.step = 1;
      } else {  //Error
        this.activeNotification.threshold = 50;
        this.form.min = 0;
        this.form.max = 100;
        this.form.step = 1;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.theme--dark.v-data-table tbody tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: var(--lightGrey) !important;
}
</style>
