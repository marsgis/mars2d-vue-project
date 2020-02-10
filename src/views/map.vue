<template>
  <div id="map" class="map"></div>
</template>

<script>
import { getMapConfig,getWidgetConfig } from "../map/api";
import { createMap,initStaticWidget } from "../map/main";

export default {
  name: "mapContainer",
  beforeCreate() {
    getMapConfig().then(config => {

      var map = createMap("map",config); 
      window.map = map; //绑定到全局

      getWidgetConfig().then(widgetdata => { 
        initStaticWidget(map, widgetdata); 
      });

    });
  },
  data() {
    return {};
  },
  methods: {
  

  }
};
</script>

<style >
.map {
  width: 100%;
  height: 100%;
}
</style>