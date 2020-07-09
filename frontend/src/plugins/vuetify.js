import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            dark: {
                primary: '#1da1f3',
                secondary: '#f00',
                accent: '#f00',
                error: '#f00',
                info: '#f00',
                success: '#f00',
                warning: '#f00',
            },
        },
        dark: true
    }
});
