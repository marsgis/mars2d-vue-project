<template>
  <div :id="`mars2d-container${mapKey}`" :class="['map']">
    <div
      onclick="L.widget.activate('manageBasemaps', true)"
      style="position: absolute; left: 5px; bottom: 25px; width: 36px; height: 36px; padding: 5px; background-color: rgba(0, 0, 0, 0.3); z-index: 9999"
    >
      <img src="http://mars2d.cn/lib/leafletjs/leaflet/images/layers.png" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

// 使用免费开源版本
// import * as L from 'mars2d'
// import 'mars2d/dist/mars2d.css'

const L = window.L

// 为了方便使用,绑定到原型链，在其他vue文件，直接 this.L 来使用
Vue.prototype.L = L

export default {
  name: 'mars2dViewer',

  props: {
    // 初始化配置参数
    url: String,
    widgetUrl: String,

    // 地图唯一性标识
    mapKey: {
      type: String,
      default: ''
    },

    // 自定义参数
    options: Object,

    // 是否插入到body元素上
    appendToBody: {
      type: Boolean,
      default: false
    },

    // 自定义css类名
    customClass: {
      type: String,
      default: ''
    }
  },
  mounted() {
    if (this.appendToBody) {
      document.body.appendChild(this.$el)
    }

    if (this.mapKey) {
      this.initMars2d(this.options)
    } else {
      fetch(this.url)
        .then(function (response) {
          return response.json()
        })
        .then((json) => {
          this.initMars2d(json.map)
        })
    }
  },

  destroy() {
    this[`map${this.mapKey}`].remove()
    delete this[`map${this.mapKey}`]
  },

  methods: {
    initMars2d(options) {
      if (this[`map${this.mapKey}`]) return

      const mapOptions = {
        ...options,
        ...this.options
      }

      var map = L.mars.createMap({
        id: `mars2d-container${this.mapKey}`, // 地图Div容器的id，
        data: mapOptions
      })

      this[`map${this.mapKey}`] = map

      console.log('>>>>> 2D地图创建成功 >>>>', map)

      // widget处理
      fetch(this.widgetUrl)
        .then(function (response) {
          return response.json()
        })
        .then((json) => {
          this.initStaticWidget(map, json)
        })

      // 抛出事件
      this.$emit('onload', map)
    },

    // 初始化外部静态widget功能（兼容使用传统模式开发的一些widget）
    initStaticWidget(map, widget) {
      L.widget.init(map, widget, '/')
    }
  }
}
</script>

<style >
.map {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/*弹出层皮肤*/
.layui-layer-title {
  background-color: #1e9fff !important;
  color: #fff !important;
}
</style>
