<template>
  <mars-pannel customClass="base-pannel" right="10" top="10">
    <template v-for="(item, i) in data" :key="i">
      <mars-button v-if="item.widget && !item.children" type="link" @click="showWidget(item.widget)">
        <mars-icon :icon="item.icon" width="18"></mars-icon>
        <span>{{ item.name }}</span>
      </mars-button>
      <mars-dropdown v-if="item.children && !item.widget" trigger="click" placement="bottomRight">
        <mars-button type="link">
          <mars-icon :icon="item.icon" width="18"></mars-icon>
          <span>{{ item.name }}</span>
          <mars-icon icon="icon-park-outline:down" width="18"></mars-icon>
        </mars-button>
        <template #overlay>
          <a-menu @click="clickMenu">
            <a-menu-item v-for="child in item.children" :key="child.widget">
              <mars-icon :icon="child.icon" width="18"></mars-icon>
              <span>{{ child.name }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </mars-dropdown>
      <a-divider v-if="i < data.length - 1" type="vertical" />
    </template>
  </mars-pannel>
</template>

<script setup lang="ts">
/**
 * 导航菜单按钮 （右上角）
 * @copyright 火星科技 mars2d.cn
 * @author 火星吴彦祖 2022-01-10
 */
import { useWidget } from "@mars/common/store/widget"

const { activate } = useWidget()

const data = [
  { name: "底图", icon: "icon-park-outline:international", widget: "manage-basemap" },
  { name: "图层", icon: "icon-park-outline:layers", widget: "manage-layers" },
  {
    name: "工具",
    icon: "icon-park-outline:tool",
    children: [
      // { name: "图上量算", icon: "icon-park-outline:ruler", widget: "measure" },
      { name: "坐标定位", icon: "icon-park-outline:local", widget: "location-point" }
      // { name: "地区导航", icon: "fa:paper-plane-o", widget: "location-region" },
      // { name: "我的标记", icon: "icon-park-outline:mark", widget: "addmarker" },
      // { name: "视角书签", icon: "icon-park-outline:bookmark", widget: "bookmark" },
      // { name: "地图打印", icon: "icon-park-outline:printer", widget: "print" },
      // { name: "地图出图", icon: "ant-design:file-image-outlined", widget: "expImg" },
      // { name: "图上标绘", icon: "icon-park-outline:hand-painted-plate", widget: "plot" },
      // { name: "路线导航", icon: "icon-park-outline:connection", widget: "query-route" },
      // { name: "分屏对比", icon: "icon-park-outline:full-screen-play", widget: "map-compare" },
      // { name: "百度街景", icon: "icon-park-outline:full-screen-play", widget: "street-view" }
    ]
  }
]

const showWidget = (widget: string) => {
  // console.log(widget)
  activate(widget)
}

const clickMenu = ({ key }: any) => {
  showWidget(key)
}
</script>

<style lang="less">
.base-pannel {
  background: none !important;
  padding: 0 !important;
  border: none !important;
  background-color: @mars-basecolor-reverse !important;
  .ant-btn {
    padding: 5px 10px;
    color: #575c6e;
    background-color: #fff !important;
    &:hover {
      background-color: @primary-color;
    }
  }
  .mars-icon {
    margin-right: 5px;
  }
}
</style>
