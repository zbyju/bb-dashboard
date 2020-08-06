<template>
  <div id="Navbar">
    <v-toolbar>
      <v-toolbar-title @click="$router.push({ name: 'Home' }).catch(err => {})" class="pointer">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <div class="link" v-for="(link, index) in links" :key="index">
          <template v-if="link.authRequired && loggedIn || !link.authRequired && !loggedIn">
            <v-btn
              v-if="!link.dropdown"
              text
              router
              :to="link.destination"
              exact
            >
              <v-icon class="mr-2">{{ link.icon }}</v-icon>
              <span>{{ link.title }}</span>
            </v-btn>
            <v-menu v-else offset-y>
              <template v-slot:activator="{ on }">
                <v-btn text v-on="on">
                  <v-icon class="mr-2">{{ link.icon }}</v-icon>
                  <span>{{ link.title }}</span>
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(sublink, index) in link.sublinks"
                  :key="index"
                  router
                  :to="sublink.destination"
                >
                  <v-list-item-title>
                    <v-icon class="mr-2">{{ sublink.icon }}</v-icon>
                    <span>{{ sublink.title }}</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </div>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      title: "Babybox Dashboard",
      links: [
        {
          title: "Domů",
          icon: "mdi-home",
          destination: { name: "Home" },
          dropdown: false,
          authRequired: true
        },
        {
          title: "Nastavení",
          icon: "mdi-cog",
          destination: "/nastaveni",
          dropdown: true,
          authRequired: true,
          sublinks: [{
              title: "Notifikace",
              icon: "mdi-bell",
              destination: { name: "NotificationsGlobal" }
            },{
              title: "Registrace",
              icon: "mdi-account-plus",
              destination: { name: "Register" }
            },{
              title: "Zkontrolovat připojení",
              icon: "mdi-signal",
              destination: { name: "CheckConnection" }
            },{
              title: "Nápověda",
              icon: "mdi-help",
              destination: { name: "Help" }
            }]
        },
        {
          title: "Přihlásit",
          icon: "mdi-account",
          destination: { name: "Login" },
          dropdown: false,
          authRequired: false
        },{
          title: "Odhlásit",
          icon: "mdi-logout",
          destination: { name: "Logout" },
          dropdown: false,
          authRequired: true
        },
      ]
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn
    }
  }
};
</script>

<style lang="scss">
#Navbar {
  .v-toolbar {
    .v-toolbar__title {
      color: var(--white);
      font-weight: 900;
      font-size: 32px;
    }

    .v-toolbar__items {
      .link {
        .v-menu {
          height: 100%;
        }

        .v-btn {
          height: 100%;
          border-radius: 0;

          .v-btn__content {
            color: var(--darkWhite);
          }
        }

        .v-btn:hover {
          background-color: transparent !important;
          box-shadow: inset var(--primary) 0 -3px 0 0;

          .v-btn__content {
            color: var(--primary);
          }
        }

        .v-btn--active {
          background-color: transparent !important;
          box-shadow: inset var(--primary) 0 -3px 0 0;

          .v-btn__content {
            color: var(--primary);
          }
        }

        .v-btn:before {
          background-color: transparent !important;
        }
      }
    }
  }
}
</style>
