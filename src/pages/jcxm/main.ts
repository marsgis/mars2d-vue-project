import "leaflet/dist/leaflet.css"
import "mars2d/dist/mars2d.css"

import "leaflet"
import "mars2d"
import "mars2d-esri"

import { createApp } from "vue"
import Application from "./App.vue"
import { injectState, key } from "@mars/common/store/widget"
import store from "./widget-store"
import MarsUIInstall from "@mars/components/mars-ui"

const app = createApp(Application)

MarsUIInstall(app)

app.use(injectState(store), key)

app.mount("#app")
