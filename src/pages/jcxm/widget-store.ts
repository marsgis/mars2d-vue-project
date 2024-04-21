/**
 * index页面的widget配置
 * @copyright 火星科技 mars2d.cn
 * @author 火星吴彦祖 2022-02-19
 */
import { defineAsyncComponent, markRaw } from "vue"
import { WidgetState } from "@mars/common/store/widget"
import { StoreOptions } from "vuex"

const store: StoreOptions<WidgetState> = {
  state: {
    widgets: [
      {
        component: markRaw(defineAsyncComponent(() => import(/* webpackChunkName: "query-poi" */ "@mars/widgets/basic/query-poi/index.vue"))),
        name: "query-poi",
        autoDisable: true
      },
      {
        component: markRaw(defineAsyncComponent(() => import(/* webpackChunkName: "toolbar" */ "@mars/widgets/basic/toolbar/index.vue"))),
        name: "toolbar",
        autoDisable: true
      },
      {
        component: markRaw(
          defineAsyncComponent(() => import(/* webpackChunkName: "manage-basemap" */ "@mars/widgets/basic/manage-basemap/index.vue"))
        ),
        name: "manage-basemap",
        group: "manage"
      },
      {
        component: markRaw(defineAsyncComponent(() => import(/* webpackChunkName: "manage-layers" */ "@mars/widgets/basic/manage-layers/index.vue"))),
        name: "manage-layers",
        group: "manage",
        disableOther: ["roamLine"]
      },

      {
        component: markRaw(
          defineAsyncComponent(
            () => import(/* webpackChunkName: "layer-picture-heatmap" */ "@mars/widgets/basic/manage-layers/layer-picture-heatmap.vue")
          )
        ),
        name: "layer-picture-heatmap"
      },
      {
        component: markRaw(
          defineAsyncComponent(
            () => import(/* webpackChunkName: "layer-picture-guihua" */ "@mars/widgets/basic/manage-layers/layer-picture-guihua.vue")
          )
        ),
        name: "layer-picture-guihua"
      },
      {
        component: markRaw(
          defineAsyncComponent(() => import(/* webpackChunkName: "location-point" */ "@mars/widgets/basic/location-point/index.vue"))
        ),
        name: "location-point",
        group: "tools"
      }
    ],
    openAtStart: ["query-poi", "toolbar"]
  }
}

export default store

// src\widgets\basic\toolbar\index.vue 中使用的菜单数组
window.toolBarMenuData = [
  { name: "底图", img: "img/icon/basemap.png", activeImg: "img/icon/basemap-active.png", widget: "manage-basemap" },
  { name: "图层", img: "img/icon/layer.png", activeImg: "img/icon/layer-active.png", widget: "manage-layers" },
  {
    name: "工具",
    img: "img/icon/tool.png",
    activeImg: "img/icon/tool-active.png",
    children: [
      { name: "坐标定位", icon: "local", widget: "location-point" }
    ]
  }
]
