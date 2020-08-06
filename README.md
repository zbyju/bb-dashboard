# Babybox Dashboard v2
Web application that reads and saves data from babyboxes. You can view advanced charts and statistics.


## Technologies
### Main technologies
- **Node.js** to create the web server (REST) and run all the necessary tasks and connect to the database
- **Vue.js** to create the frontend of the webapp that connects to the REST server.
- **Vuetify** to quickly style the webapp so it looks nice
- **MongoDB** as the database for storing all the data from babyboxes (a lot of data)

### Other small libraries
- **JSONWebTokens (JWT)** - to create tokens for user authentication
- **Bcrypt** to hash passwords and store them safely
- **Lodash** for advanced javascript functions
- **Moment.js** to work with time and dates easily
- **Node-cron** to schedule tasks
- **Chart.js** to display data in charts
- **Multer** to receive images from users and store them


## Data

### Babybox data
Data are sent as a GET request (because the device cant make POST requests) and the data is in the query string.

The query string contains a lot of variables:
- T0 - Outside temperature / Venkovni teplota
- T1 - Inner temperature / Vnitrni teplota
- T2 - Bottom temperature / Dolni teplota
- T3 - Top temperature / Horni teplota
- T4 - Voltage in / Vstupni napeti
- T5 - Battery voltage / Napeti akumulatoru
- T6 - Status / Stav (0 = ok, 1 = chyba)
- T7 - Casing temperature / Teplota plaste

#### Example data
http://localhost:3000/BB.PRAHA.data?BB=PRAHA&T0=2750&T1=3348&T2=2750&T3=2318&T4=1413&T5=1376&T6=0&T7=3348
http://localhost:3000/BB.PRAHA.data?BB=PRAHA&T0=2550&T1=3112&T2=2750&T3=2718&T4=1483&T5=1366&T6=0&T7=3348