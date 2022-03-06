/**
 * 图上选点
 * @copyright 火星科技 mars2d.cn
 * @author 火星胡椒 2022-01-10
 */
import * as mars2d from "mars2d"
let map: mars2d.Map // 地图对象
// 事件对象，用于抛出事件给vue
export const eventTarget = new mars2d.BaseClass()

// 初始化当前业务
export function onMounted(mapInstance: mars2d.Map): void {
  map = mapInstance // 记录map

  const point = map.getCenter()
  point.format()
  const currJD = point.lng
  const currWD = point.lat
  const currGD = point.alt

  eventTarget.fire("loadOK", { currJD, currWD, currGD })
}

// 释放当前业务
export function onUnmounted(): void {
  if (pointEntity) {
    pointEntity.remove()
    pointEntity = null
  }
  map = null
}

// 坐标转化的三种方法
export function marsUtilFormtNum(item: number, num: number) {
  return mars2d.Util.formatNum(item, num)
}

export function marsPointTrans(item: number) {
  return mars2d.PointTrans.degree2dms(item)
}

export function marsProj4Trans(JD: number, WD: number, radio: string) {
  if (radio === "2") {
    return mars2d.PointTrans.proj4Trans([JD, WD], mars2d.CRS.EPSG4326, mars2d.CRS.CGCS2000_GK_Zone_6)
  } else {
    return mars2d.PointTrans.proj4Trans([JD, WD], mars2d.CRS.EPSG4326, mars2d.CRS.CGCS2000_GK_Zone_3)
  }
}

// 转换成十进制的方法，修改input中的值时进行置换
export function marsDms2degree(du: number, fen: number, miao: number) {
  return mars2d.PointTrans.dms2degree(du, fen, miao)
}
export function marsZONEtoCRS(jd: number, wd: number, radio: string) {
  if (radio === "2") {
    return mars2d.PointTrans.proj4Trans([jd, wd], mars2d.CRS.CGCS2000_GK_Zone_6, mars2d.CRS.EPSG4326)
  } else {
    return mars2d.PointTrans.proj4Trans([jd, wd], mars2d.CRS.CGCS2000_GK_Zone_3, mars2d.CRS.EPSG4326)
  }
}

// 地图选点
export function bindMourseClick() {
  map.once(mars2d.EventType.click, function (event: any) {
    const point = event.latlng
    eventTarget.fire("clickMap", { point })
  })
}

let pointEntity: mars2d.graphic.Marker // 定位的坐标点-矢量数据
export function updateMarker(hasCenter: boolean, jd: number, wd: number) {
  const latlng = [wd, jd]

  if (pointEntity == null) {
    pointEntity = new mars2d.graphic.Marker({
      latlng: latlng,
      style: {
        image: "img/marker/mark1.png",
        width: 32,
        height: 44
      }
    })
    map.graphicLayer.addGraphic(pointEntity)
  } else {
    pointEntity.latlng = latlng
  }

  if (hasCenter) {
    map.flyToGraphic(pointEntity)
  }
}
