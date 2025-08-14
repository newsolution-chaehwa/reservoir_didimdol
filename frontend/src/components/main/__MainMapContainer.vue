<template>
  <div
    style="
      display: flex;
      z-index: 990;
      position: absolute;
      margin: 0 0 0 60px;
      width: calc(100% - 100px);
      justify-content: space-between;
    "
  >
    <div style="display: flex">
      <total-dashboard
        :total-count="totalCount"
        :below-80-count="below80Count"
        :below-50-count="below50Count"
        :below-30-count="below30Count"
        :over-80-count="over80Count"
        :is-all-null="isAllNull"
      ></total-dashboard>
      <rates-container
        index="1"
        title="80%이하"
        :collapse-class="collapseClass80"
        :collapse="collapse80"
        v-on:close-tab="closeTab"
        point-color="#F0981C"
        v-on:show-more="showMore"
        :reservoir-list="below80Count"
        v-on:set-map-center="setMapCenter"
        v-on:open-reservoir-detail="openReservoirDetail"
      ></rates-container>
      <rates-container
        index="2"
        title="50%이하"
        :collapse-class="collapseClass50"
        :collapse="collapse50"
        v-on:close-tab="closeTab"
        point-color="#E6EB03"
        v-on:show-more="showMore"
        :reservoir-list="below50Count"
        v-on:set-map-center="setMapCenter"
        v-on:open-reservoir-detail="openReservoirDetail"
      ></rates-container>
      <rates-container
        index="3"
        title="30%이하"
        :collapse-class="collapseClass30"
        :collapse="collapse30"
        v-on:close-tab="closeTab"
        v-on:show-more="showMore"
        point-color="#E6EB03"
        :reservoir-list="below30Count"
        v-on:set-map-center="setMapCenter"
        v-on:open-reservoir-detail="openReservoirDetail"
      ></rates-container>
    </div>
    <div
      style="
        margin: 20px 30px 0 0;
        max-width: 200px;
        width: 200px;
        height: 40px;
        max-height: 40px;
      "
    >
      <general-search v-on:main-total-search="mainTotalSearch"></general-search>
    </div>
  </div>
  <div style="width: calc(100vw - 90px)">
    <el-dialog
      center
      align-center
      draggable
      v-model="showDialog"
      style="
        z-index: 9000;
        width: 750px;
        /* height: 530px; */
        height: 500px;
        background-color: #fff;
        border-radius: 8px;
      "
      :show-close="true"
      @close="closeReservoirInfo(reservoirInfo)"
    >
      <template #header>
        <div
          style="
            margin: 0;
            padding: 0;
            font-family: 'NotoSansKR-Medium';
            font-size: 20px;
          "
        >
          {{ reservoirInfo.reservoirName }}
        </div>
      </template>

      <div style="display: flex; justify-content: space-between">
        <reservoir-info :info="reservoirInfo"></reservoir-info>
        <div
          style="width: 50%; font-family: 'NotoSansKR-Regular'; height: 100%"
        >
          <div class="reservoir-info-content-title" style="margin: 0 0 5px 0">
            저수율 & 저수위 정보
          </div>

          <div class="rate-container">
            <div>
              <div>현재 저수위</div>
              <div style="font-size: 11px; display: flex; align-items: center">
                서비스 준비 중 입니다.
              </div>
            </div>
            <div>
              <div>전일 저수위</div>
              <!-- {{ yesterdayData.gusan.elm }} -->
              <div v-if="reservoirInfo.reservoirId === 4682010078">
                <!-- {{ yesterdayData.gusan.rate }} -->
                <span style="font-size: 13px"> elm</span>
              </div>
              <div
                v-else
                style="font-size: 11px; display: flex; align-items: center"
              >
                서비스 준비 중 입니다.
              </div>
            </div>
            <div>
              <div>작년 대비</div>
              <div v-if="reservoirInfo.reservoirId === 4682010078">
                <div
                  style="
                    display: flex;
                    font-size: 20px;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <!-- <div>{{ yesterdayData.gusan.elmUdValue }}</div> -->
                  <div style="display: flex; align-items: center">
                    <!-- <el-icon v-if="yesterdayData.gusan.elmUd === 1"
                      ><CaretTop
                    /></el-icon>
                    <el-icon v-else><CaretBottom /></el-icon> -->
                  </div>
                </div>
              </div>
              <div
                v-else
                style="font-size: 11px; display: flex; align-items: center"
              >
                서비스 준비 중 입니다.
              </div>
            </div>
          </div>
          <div class="rate-container" style="margin: 10px 0 0 0">
            <div>
              <div>현재 저수율</div>
              <div style="font-size: 11px; display: flex; align-items: center">
                서비스 준비 중 입니다.
              </div>
            </div>
            <div>
              <div>전일 저수율</div>
              <!-- <div>80<span style="font-size: 14px">%</span></div> -->

              <div v-if="reservoirInfo.reservoirId === 4682010078">
                <!-- {{ yesterdayData.gusan.rate }} -->
                <span style="font-size: 13px"> elm</span>
              </div>
              <div
                v-else
                style="font-size: 11px; display: flex; align-items: center"
              >
                서비스 준비 중 입니다.
              </div>
            </div>
            <div>
              <div>작년 대비</div>
              <div v-if="reservoirInfo.reservoirId === 4682010078">
                <div
                  style="
                    display: flex;
                    font-size: 20px;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <!-- <div>{{ yesterdayData.gusan.rateUdValue }}</div> -->
                  <div style="display: flex; align-items: center">
                    <!-- <el-icon v-if="yesterdayData.gusan.rateUd === 1"
                      ><CaretTop
                    /></el-icon>
                    <el-icon v-else><CaretBottom /></el-icon> -->
                  </div>
                </div>
              </div>
              <div
                v-else
                style="font-size: 11px; display: flex; align-items: center"
              >
                서비스 준비 중 입니다.
              </div>
            </div>
          </div>

          <div>
            <el-button
              @click="changeRoute('/predict')"
              color="#0d4ba9"
              class="rate-button"
              :disabled="reservoirInfo.isForTest === false"
              >예측 저수율 보러 가기</el-button
            >
          </div>

          <div style="margin: 30px 0 0 0">
            <div
              class="reservoir-info-content-title"
              style="display: flex; justify-content: space-between"
            >
              <div>기상 정보(서비스 준비 중 입니다)</div>
              <div style="font-size: 14px">{{ reservoirInfo.observatory }}</div>
            </div>
            <div class="rate-container" style="margin: 5px 0 0 0">
              <div>
                <div>강수량</div>
                <div>-</div>
              </div>
              <div>
                <div>평균온도</div>
                <div>-</div>
              </div>
              <div>
                <div>최고기온</div>
                <div>-</div>
              </div>
              <div>
                <div>풍속</div>
                <div>-</div>
              </div>
              <div>
                <div>습도</div>
                <div>-</div>
              </div>
            </div>
            <div></div>
          </div>

          <!-- <div>
            <el-button
              @click="changeRoute('/spi')"
              color="#0d4ba9"
              class="rate-button"
              >SPI지수 보러 가기</el-button
            >
          </div> -->
        </div>
      </div>
      <!-- button -->
    </el-dialog>

    <!-- warning dialog -->
    <el-dialog
      v-model="showSearchError"
      :show-close="true"
      center
      align-center
      style="width: 400px; border-radius: 8px"
      @keypress.enter="showSearchError = false"
    >
      <template #header="{ titleId, titleClass }">
        <div :id="titleId" :class="titleClass">
          <div class="warning-header">
            <el-icon style="margin: 0 5px 0 0"><WarningFilled /></el-icon> 경고
          </div>
        </div>
      </template>

      <div
        style="
          font-size: 15px;
          font-family: 'NotoSansKR-Regular';
          text-align: center;
        "
      >
        <span style="color: red; font-family: 'NotoSansKR-Medium'">
          {{ searchKeyword }}</span
        >
        와 일치하는 저수지가 없습니다. <br />
        저수지명을 다시 입력해주세요.
      </div>
      <template #footer>
        <div style="display: flex; justify-content: flex-end">
          <el-button color="#0d4ba9" @click="showSearchError = false"
            >확인</el-button
          >
        </div>
      </template>
    </el-dialog>

    <div ref="map" style="height: 100%; width: calc(100% + 30px)"></div>
  </div>
</template>

<script>
import TotalDashboard from "../main/TotalDashboard.vue";
import RatesContainer from "../main/RatesDashboard.vue";
import GeneralSearch from "../common/GeneralSearch.vue";

import reservoirList from "../../modules/hard_data/reservoir.json";
import reservoirPolygon from "../../modules/hard_data/reservoirPolygon.json";
import ReservoirInfo from "./ReservoirInfo.vue";

import * as L from "leaflet";
import selectArea from "leaflet-area-select";

import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("map");

import observerList from "../../modules/hard_data/observatoryGeoData.json";

console.log("SelectedArea", selectArea);
import haenam from "../../modules/hard_data/map_geo/haenam.json";
import haenamDetail from "../../modules/hard_data/map_geo/real_detail.json";

import haename_static from "../../modules/hard_data/map_geo/haenam_static.json";
import yesterdayPolygon from "../../yesterday_polygon.json";
// import yesterdayData from ''

// import {toRaw} from 'vue'

export default {
  name: "MainMapContainer",

  components: {
    TotalDashboard,
    RatesContainer,
    GeneralSearch,
    ReservoirInfo,
  },

  data() {
    return {
      yesterdayPolygon,
      // yesterdayData,
      isAllNull: false,
      haename_static,
      observerList,
      haenam,
      haenamDetail,

      showSearchError: false,
      titleClass: "warning-header",
      titleId: 0,

      mapDiv: null,
      map: null,

      showDialog: false,

      tableData: [],

      reservoirName: "샘플 저수지명",
      reservoirPolygon,

      reservoirBasicInformation: [],
      reservoirRateHistory: [],

      collapse80: false,
      collapse50: false,
      collapse30: false,
      collapseClass80: "top-box-container-rate top-rates",
      collapseClass50: "top-box-container-rate top-rates",
      collapseClass30: "top-box-container-rate top-rates",

      reservoirList,
      listPerRatesList: [],

      reservoirDialogInfo: {},
      reservoirInfo: {},

      // to total-dashboard
      totalCount: 0,
      below80Count: [],
      below50Count: [],
      below30Count: [],
      over80Count: [],

      tempGroupList: [],
      searchKeyword: "",

      markers: [],

      currentZoomLevel: 0,

      markerLayer: undefined,
      haenamPolygonLayer: undefined,
      reservoirPolygonLayer: undefined,
      baseLayer: undefined,

      mapCenter: [],

      // test data only for demo
      // yesterdayElm: 0,
      // yesterdayRate: 0,
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.setInitRate();

      let nullCount = 0;

      for (let i = 0; i < this.reservoirList.length; i++) {
        if (this.reservoirList[i].currentWaterRate === null) {
          // this.isAllNull = false
          nullCount++;
        }
      }

      if (this.reservoirList.length === nullCount) {
        this.isAllNull = true;
      }

      let baseLayer = L.tileLayer(
        "http://xdworld.vworld.kr:8080/2d/Base/service/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      );

      this.initializeMap();

      this.setMapMarkerLayer();
      this.initHaenamDetailPolygon();
      this.initReservoirPolygon();

      let overlays = {};

      overlays.해남군 = this.haenamPolygonLayer;
      overlays.저수지위치 = this.markerLayer;
      overlays.저수지모형 = this.reservoirPolygonLayer;

      this.map = L.map(this.mapDiv, {
        // center: [34.451248, 126.590949],
        center: this.mapCenterLatlng,
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
        selectArea: true,
        maxZoom: 17,
        minZoom: 7,
        zoomAnimation: false,
        layers: [
          baseLayer,
          this.haenamPolygonLayer,
          this.markerLayer,
          this.reservoirPolygonLayer,
        ],
      });

      L.control.layers({}, overlays).addTo(this.map);

      L.control
        .zoom({
          position: "topright",
        })
        .addTo(this.map);

      L.control
        .scale({
          metric: true,
          position: "bottomright",
        })
        .addTo(this.map);

      // this.map.selectArea.enable();

      // this.map.on("areaselected", (e) => {
      //   console.log(e.bounds.toBBoxString()); // lon, lat, lon, lat
      // });

      this.groupByRates();
    });
  },

  methods: {
    setInitRate() {
      this.reservoirPolygon.forEach((reservoir) => {
        for (let i = 0; i < this.yesterdayPolygon.length; i++) {
          if (reservoir.properties.ID == this.yesterdayPolygon[i].ID) {
            reservoir.properties.currentWaterRate =
              this.yesterdayPolygon[i].yesterdayWaterRate;
          }
        }
      });

      this.reservoirList.forEach((reservoir) => {
        for (let i = 0; i < this.yesterdayPolygon.length; i++) {
          if (reservoir.reservoirId == this.yesterdayPolygon[i].ID) {
            reservoir.currentWaterRate =
              this.yesterdayPolygon[i].yesterdayWaterRate;
          }
        }
      });

      console.log("--->>", this.reservoirPolygon);
      // for(let i=0; i<this.yesterdayPolygon.length; i++) {
      // if(this.ysetetdca)
      // }
    },

    // 지도 위 해남지역 polygon
    initHaenamPolygon() {
      L.geoJson(this.haenam, {
        style: (feature) => {
          console.log("feature", feature);
          return {
            fillColor: "grey",
          };
        },
      }).addTo(this.map);
    },

    initHaenamDetailPolygon() {
      let haenamPolygonLocal = L.layerGroup();

      let newHaenamGeojson = { type: undefined, features: undefined };
      let haenamDetailLocal = [];

      this.haenamDetail.features.forEach((data) => {
        if (data.properties.COL_ADM_SE == 46820) {
          haenamDetailLocal.push(data);
        }
      });

      newHaenamGeojson.type = "FeatureCollection";
      newHaenamGeojson.features = haenamDetailLocal;

      L.geoJSON(newHaenamGeojson, {
        style: (feature) => {
          return {
            fillColor: "#000",
            weight: 1,
            opacity: 1,
            color: "#797979",
            aling: feature,
          };
        },

        onEachFeature: (feature, layer) => {
          layer.on("mouseover", (e) => {
            layer.setStyle({
              opacity: 0.7,
              fillColor: "transparent",
              aling: feature,
              test: e,
            });
          });

          layer.on("mouseout", (e) => {
            layer.setStyle({
              fillColor: "000",
              test: e,
            });
          });

          layer.on("mouseup", (e) => {
            layer.setStyle({
              test: e,
            });
          });
        },
      }).addTo(haenamPolygonLocal);

      this.haenamPolygonLayer = haenamPolygonLocal;
      // .addTo(this.map);
    },

    setMouseoverStyle() {},

    // 관측소 geojson
    initObservatories() {
      // let observatoryMarkers = [];

      let layerGroup = undefined;
      let layers = [];

      this.observerList.features.forEach((data) => {
        // console.log('D:', data)

        layers.push(
          L.marker([data.geometry.coordinates[1], data.geometry.coordinates[0]])
        );
      });

      // layerGroup = L.layerGroup(layers);
      layerGroup = L.featureGroup(layers);

      layerGroup.addTo(this.map);

      // this.map.scrollWheelZoom = function (e) {
      // console.log("-EEE-", e);
      // };
    },

    checkCurrentZoomLevel() {
      console.log("checkCurrentZoomLevel");
    },

    initializeMap() {
      this.mapDiv = this.$refs.map;
    },

    addLayerControlButton() {
      // map marker layer
      let markerLayerButton = L.DomUtil.create(
        "div",
        "leaflet-control leaflet-bar leaflet-select-control",
        this.map._controlCorners.topright
      );

      let boundarypolygonLayerButton = L.DomUtil.create(
        "div",
        "leaflet-control leaflet-bar leaflet-select-control",
        this.map._controlCorners.topright
      );

      // boundarypolygonLayerButton.innerHTML = `<div class="custom-layer-control-button layer-control-button-boundary-polygon"><img  src=${require("../../assets/icon/marker.png")}></img></div>`;
      boundarypolygonLayerButton.innerHTML = `<div class="custom-layer-control-button layer-control-button-boundary-polygon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
      <path
        d="M96 151.4V360.6c9.7 5.6 17.8 13.7 23.4 23.4H328.6c0-.1 .1-.2 .1-.3l-4.5-7.9-32-56 0 0c-1.4 .1-2.8 .1-4.2 .1c-35.3 0-64-28.7-64-64s28.7-64 64-64c1.4 0 2.8 0 4.2 .1l0 0 32-56 4.5-7.9-.1-.3H119.4c-5.6 9.7-13.7 17.8-23.4 23.4zM384.3 352c35.2 .2 63.7 28.7 63.7 64c0 35.3-28.7 64-64 64c-23.7 0-44.4-12.9-55.4-32H119.4c-11.1 19.1-31.7 32-55.4 32c-35.3 0-64-28.7-64-64c0-23.7 12.9-44.4 32-55.4V151.4C12.9 140.4 0 119.7 0 96C0 60.7 28.7 32 64 32c23.7 0 44.4 12.9 55.4 32H328.6c11.1-19.1 31.7-32 55.4-32c35.3 0 64 28.7 64 64c0 35.3-28.5 63.8-63.7 64l-4.5 7.9-32 56-2.3 4c4.2 8.5 6.5 18 6.5 28.1s-2.3 19.6-6.5 28.1l2.3 4 32 56 4.5 7.9z"
      />
    </svg>
        </div>`;
      markerLayerButton.innerHTML = `<div class="custom-layer-control-button layer-control-button-marker"><img  src=${require("../../assets/icon/marker_light.png")}></img></div>`;
    },

    controlButton() {},

    initReservoirPolygon() {
      let reservoirPolygonLocal = L.layerGroup();

      L.geoJson(this.reservoirPolygon, {
        style: (feature) => {
          console.log("feature", feature);

          return {
            fillColor: this.setColor(feature.properties.currentWaterRate),
            fillOpacity: 0.5,
            weight: 2,
            color: this.setColor(feature.properties.currentWaterRate),
          };
        },
      }).addTo(reservoirPolygonLocal);

      this.reservoirPolygonLayer = reservoirPolygonLocal;
    },

    setColor(data) {
      console.log("--DATA", data);

      let colorCode = "";

      if (data > 80) {
        colorCode = "#5BE11C";
      } else if (data > 50 && data <= 80) {
        colorCode = "#F0981C";
      } else if (data > 30 && data <= 50) {
        colorCode = "#F0981C";
      } else if (data > 30 && data <= 0) {
        colorCode = "#F0981C";
      } else if (data === null) {
        colorCode = "#000";
      }

      return colorCode;

      // data > 80
      //   ? "#5BE11C"
      //   : data > 50 && data <= 80
      //   ? "#F0981C"
      //   : data > 30 && data <= 50
      //   ? "#E6EB03"
      //   : data < 30
      //   ? "#E40303"
      //   : data === null
      //   ? "#ddddd"
      //   : "";
      // ? data === null
      // : "#ddd" : '';
    },

    setMapCenter(payload) {
      console.log("??", payload);
      this.map.setView(payload, 13);
    },

    groupByRates() {
      this.totalCount = this.reservoirList.length;

      for (let i = 0; i < this.reservoirList.length; i++) {
        if (
          this.reservoirList[i].currentWaterRate > 50 &&
          this.reservoirList[i].currentWaterRate <= 80
        ) {
          this.below80Count.push(this.reservoirList[i]);
        } else if (
          this.reservoirList[i].currentWaterRate > 30 &&
          this.reservoirList[i].currentWaterRate <= 50
        ) {
          this.below50Count.push(this.reservoirList[i]);
        } else if (
          this.reservoirList[i].currentWaterRate <= 30 &&
          this.reservoirList[i].currentWaterRate > 0
        ) {
          this.below30Count.push(this.reservoirList[i]);
        } else if (this.reservoirList[i].currentWaterRate > 80) {
          this.over80Count.push(this.reservoirList[i]);
        } else if (this.reservoirList[i].currentWaterRate == null) {
          console.log("--? nullllll");
        }
      }
    },

    changeRoute(path) {
      this.$router.push(path);

      for (let i = 0; i < this.reservoirList.length; i++) {
        this.reservoirList[i].className = "";
      }

      this.$store.commit("map/SET_CENTER_LATLNG", this.reservoirInfo.latlng);
      this.$store.commit("reservoir/SET_RESERVOIR_INFO", this.reservoirInfo);
    },

    openReservoirDetail(payload) {
      this.reservoirName = payload.reservoirName;
      this.showDialog = true;
      this.reservoirInfo = payload;
    },

    closeTab(payload) {
      if (payload.collapse === true) {
        switch (payload.index) {
          case "1":
            this.collapse80 = false;
            this.collapseClass80 = "top-box-container top-rates";
            break;
          case "2":
            this.collapse50 = false;
            this.collapseClass50 = "top-box-container top-rates";
            break;
          case "3":
            this.collapse30 = false;
            this.collapseClass30 = "top-box-container top-rates";
            break;
        }
      } else {
        switch (payload.index) {
          case "1":
            this.collapse80 = true;
            this.collapseClass80 = "top-box-container-collapse top-rates";
            break;
          case "2":
            this.collapse50 = true;
            this.collapseClass50 = "top-box-container-collapse top-rates";
            break;
          case "3":
            this.collapse30 = true;
            this.collapseClass30 = "top-box-container-collapse top-rates";
            break;
        }
      }
    },

    showMore(payload) {
      if (payload.showMore === true) {
        switch (payload.index) {
          case "1":
            this.collapse80 = false;
            this.collapseClass80 =
              "top-box-container top-tox-container-rate-show-more  top-rates";
            break;
          case "2":
            this.collapse50 = false;
            this.collapseClass50 =
              "top-box-container top-tox-container-rate-show-more  top-rates";
            break;
          case "3":
            this.collapse30 = false;
            this.collapseClass30 =
              "top-box-container  top-tox-container-rate-show-more  top-rates";
            break;
        }
      } else {
        switch (payload.index) {
          case "1":
            this.collapseClass80 = "top-box-container top-rates";
            break;
          case "2":
            this.collapseClass50 = "top-box-container top-rates";
            break;
          case "3":
            this.collapseClass30 = "top-box-container top-rates";
            break;
        }
      }
    },

    closeReservoirInfo(reservoir) {
      this.map.closePopup();
      reservoir.className = "";
    },

    setMapMarkerLayer() {
      let markersLocal = L.layerGroup();

      let iconUrlColor = "";

      this.reservoirList.forEach((reservoir) => {
        console.log("??++", reservoir.currentWaterRate);

        if (reservoir.currentWaterRate > 80) {
          iconUrlColor = "green";
        } else if (
          reservoir.currentWaterRate > 50 &&
          reservoir.currentWaterRate <= 80
        ) {
          iconUrlColor = "orange";
        } else if (
          reservoir.currentWaterRate > 30 &&
          reservoir.currentWaterRate <= 50
        ) {
          iconUrlColor = "yellow";
        } else if (
          reservoir.currentWaterRate > 30 &&
          reservoir.currentWaterRate <= 0
        ) {
          iconUrlColor = "red";
        } else if (reservoir.currentWaterRate == null) {
          iconUrlColor = "black";
        }

        new L.marker([reservoir.latlng[0], reservoir.latlng[1]], {
          icon: new L.Icon({
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconUrlColor}.png`,
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 40],
            iconAnchor: [12, 40],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        })
          .on("click", () => {
            this.$store.commit("map/SET_CENTER_LATLNG", reservoir.latlng);
            this.$store.commit("reservoir/SET_RESERVOIR_INFO", reservoir);

            this.reservoirDialogInfo = reservoir;
            this.reservoirName = reservoir.reservoirName;
            this.reservoirInfo = reservoir;

            if (this.showDialog === true) {
              this.showDialog = false;
            } else {
              this.showDialog = true;
            }

            this.map.setView(reservoir.latlng, 13);

            this.mapCenter = reservoir.latlng;
          })
          .on("mouseover", () => {
            L.popup([reservoir.latlng[0], reservoir.latlng[1]], {
              offset: [0, -30],
              content: `<div style="font-family:'NotoSansKR-Regular'; font-size: 16px; ">
                   <div> ${reservoir.reservoirName} 저수지 </div>
                  </div>`,
            }).openOn(this.map);
          })
          .addTo(markersLocal)
          .bindPopup();
      });

      // this.map.setView();

      this.markerLayer = markersLocal;

      // this.map.setView([1, 1], 13)
    },

    mainTotalSearch(payload) {
      let isSearched = false;

      let keyword = "";

      let pattern = /\s/g;

      let regExpTrimSpace = new RegExp(pattern).test(payload);

      if (regExpTrimSpace) {
        keyword = payload.replace(pattern, "");
      }

      let formedKeyword = "";

      if (keyword.includes("저수지")) {
        formedKeyword = keyword.replace("저수지", "");
      } else {
        formedKeyword = payload;
      }

      for (let i = 0; i < this.reservoirList.length; i++) {
        if (this.reservoirList[i].reservoirName.includes(formedKeyword)) {
          isSearched = true;
          this.map.setView(this.reservoirList[i].latlng, 13);
          this.showDialog = true;
          this.reservoirInfo = this.reservoirList[i];
        }
      }

      if (isSearched === false) {
        this.showSearchError = true;
        this.searchKeyword = payload;
      }
    },

    updateZoomLevel() {
      console.log("updateZoomLevel");
    },
  },

  computed: {
    ...mapGetters({
      mapCenterLatlng: "GET_CENTER_LATLNG",
    }),

    getCurrentZoomLevel() {
      return this.updateZoomLevel();
    },

    getMapCenter() {
      return this.mapCenter;
    },
  },

  watch: {
    getMapCenter(newVal, oldVal) {
      console.log("--newVla", newVal, oldVal);
      console.log("===WATCH", this.mapCenter);
      this.map.setView(newVal, 13);
    },
  },
};
</script>

<style>
.warning-header {
  font-family: "NotoSansKR-Medium";
  color: #ff0000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-layer-control-button {
  display: flex;
  justify-content: center;
  padding: 5px;
  border-radius: 2px;
  color: #000;
  font-size: 22px;
  width: 20px;
  height: 20px;
  line-height: 30px;
  background-color: #fff;
}

.layer-control-button-marker:hover,
.layer-control-button-boundary-polygon:hover {
  background-color: #f4f4f4;
  cursor: pointer;
}

.rate-container {
  border: 2px solid #f4f4f4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  height: 70px;
}

.rate-container > div {
  width: 30%;
  height: 70px;
}

.rate-container > div:nth-child(odd) {
  background-color: #f4f4f4;
}

.rate-container > div > div:nth-child(1) {
  font-family: "NotoSansKR-Medium";
  font-size: 14px;
  margin: 10px 0 0 0;
}

.rate-container > div > div:nth-child(2) {
  font-family: "NotoSansKR-Regular";
  font-size: 20px;
  height: 30px;
  color: #929292;
}

.rate-button {
  justify-content: space-between;
  flex-direction: column;
  display: flex;
  height: 45px;
  font-family: "NotoSansKR-Medium";
  border-radius: 12px;
  align-items: center;
  line-height: 25px;
  font-size: 15px;
  width: 100%;
  margin: 10px 0 0 0;

  /* width: 180px; */
}
</style>
