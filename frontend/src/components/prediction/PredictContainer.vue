<template>
  <div style="padding: 20px; width: calc(100% - 240px); margin: 0 auto">
    <breadcrumb-component :breadcrumb-path="[{ title: '예측' }]" breadcrumb-title="저수지 저수율 예측"></breadcrumb-component>
    <div style="
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        font-family: 'NotoSansKR-Medium';
        align-items: center;
        margin: 10px 0 0 0;
      ">
      <div style="display: flex; align-items: center">
        <div style="margin: 0 10px 0 0">저수지명</div>
        <el-select style="width: 200px" v-model="selectedReservoir" class="m-2" placeholder="저수지를 선택해주세요."
          @change="selectReservoir">
          <!-- :disabled="reservoir.isForTest === false" -->
          <el-option v-for="reservoir in reservoirList" :key="reservoir.reservoirId"
            :value="reservoir.reservoirName"></el-option></el-select>
      </div>
      <div style="display: flex; align-items: center">
        <div style="margin: 0 10px 0 0">단기예측</div>
        <el-button v-for="(button, buttonShortIndex) in buttonSetShort" :key="button.title" :class="button.class"
          @click="
            updateChart(buttonShortIndex, button.param[0], button.param[1])
            ">
          {{ button.title }}
        </el-button>
        <div style="margin: 0 10px 0 30px">장기예측</div>
        <el-button v-for="(button, buttonLongIndex) in buttonSetLong" :key="button.title" :class="button.class" @click="
          updateChart(buttonLongIndex, button.param[0], button.param[1])
          ">
          {{ button.title }}
        </el-button>
        <div style="margin: 0 10px 0 30px">기상 데이터 ON/OFF</div>
        <el-switch v-model="weatherSwitch" @change="addWeatherData" />
      </div>
    </div>

    <!-- 기상 -->
    <div style="
        margin: 10px 0 0 0;
        display: flex;
        font-family: 'NotoSansKR-Regular';
        font-size: 13px;
        justify-content: center;
      ">
      <div v-for="weather in weatherInfoList" :key="weather.date" style="
          border: 1px solid #ddd;
          padding: 0px 5px;
          margin: 0 5px;
          border-radius: 8px;
          text-align: center;
        ">
        <span>
          {{ weather.date }}
          <img src="@/assets/icon/sun.png" alt="" style="height: 15px; width: 15px" />
        </span>
        <div>
          <span style="margin: 0 0 0 10px; color: #7294eb">
            {{ weather.min }}°
          </span>
          <span style="color: #aaa"> / </span>
          <span style="color: red; font-weight: 200"> {{ weather.max }}° </span>
          <span style="margin: 0 0 0 10px">
            {{ weather.rain }}
          </span>
          <span style="font-size: 10px"> mm</span>
          <span style="color: #aaa"> / </span>
          <span style="color: #7294eb">
            {{ weather.rainPercent }}
          </span>
          <span style="font-size: 10px"> % </span>
        </div>
      </div>
    </div>
    <!-- 기상 -->

    <apexchart type="line" height="50%" ref="chart" :options="chartOptions" :series="series" @legendClick="legendClick">
    </apexchart>
    <div style="height: 27%; max-height: 27%">
      <el-table :data="tableData" style="
          margin: 30px 0 0 0;
          width: 100%;
          font-family: 'NotoSansKR-Regular';
        " border stripe fit height="100%" :header-cell-class-name="headerCellStyle">
        <el-table-column sortable align="center" prop="date" label="날짜(시간)">
        </el-table-column>
        <el-table-column header-align="center" label="예측 데이터(기상 데이터 미포함)">
          <el-table-column align="center" prop="rate" sortable label="저수율(%)"></el-table-column>
          <el-table-column align="center" prop="amount" sortable label="저수량"></el-table-column>
        </el-table-column>
        <el-table-column header-align="center" label="예측 데이터(기상 데이터 포함)">
          <el-table-column align="center" sortable prop="rateWithWeather" label="저수율(%)"></el-table-column>
          <el-table-column align="center" sortable prop="amountWithWeather" label="저수량">
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import BreadcrumbComponent from "../common/BreadcrumbComponent.vue";
import moment from "moment";
import reservoirList from "../../modules/hard_data/reservoir.json";

// import simpleData from "@/modules/shorttime/test.json";
import dongheaSimple from "@/modules/hard_data/short/donghea.json";
import gahackSimple from "@/modules/hard_data/short/gahack.json";
import gungockSimple from "@/modules/hard_data/short/gungock.json";
import gusanSimple from "@/modules/hard_data/short/gusan.json";
import gusiSimple from "@/modules/hard_data/short/gusi.json";
import heawonSimple from "@/modules/hard_data/short/heawon.json";
import hwawonSimple from "@/modules/hard_data/short/hwawon.json";
import sinbangSimple from "@/modules/hard_data/short/sinbang.json";
import sinduckSimple from "@/modules/hard_data/short/sinduck.json";
import yeonhwaSimple from "@/modules/hard_data/short/yeonhwa.json";

import { mapGetters } from "vuex";

export default {
  name: "PredictContainer",

  components: {
    BreadcrumbComponent,
    apexchart: VueApexCharts,
  },

  data() {
    return {
      dongheaSimple,
      gahackSimple,
      gungockSimple,
      gusanSimple,
      gusiSimple,
      heawonSimple,
      sinbangSimple,
      sinduckSimple,
      yeonhwaSimple,
      hwawonSimple,

      selectedReservoirId: 0,

      simpleData: [],
      // gusanData,
      // sinbangData,
      testJsonFormat: undefined,

      isLoading: true,

      buttonSet: [0, 0, 6],
      selectedReservoir: "",
      reservoirList,
      chart: null,
      predictReservoirName: "",

      sampleWeatherData: [], //rate
      sampleWeatherDataValue: [], //amount

      dataSet: [],

      series: [
        {
          data: [],
        },
      ],

      timeline: [],
      tableTimeDataForWeather: [],

      chartOptions: {
        chart: {
          type: "line",
          zoom: {
            enabled: false,
          },

          toolbar: {
            show: false,
          },
          fontFamily: "NotoSansKR-Regular",
        },

        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
          width: 1,
        },
        legend: {
          show: true,
          showForSingleSeries: true,
        },
        toolbar: {
          show: false,
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        markers: {},
        xaxis: {
          tickAmount: 6,
          tickPlacement: "between",
          categories: [],
          labels: {
            show: true,
            rotate: -60,
            rotateAlways: true,
            // tickAmount: 10
            // maxHeight: 200
            style: {
              fontSize: "12px",
            },
          },
        },
        yaxis: {
          min: 0,
          max: 140,
        },
        tooltip: {
          x: {
            show: true,
          },
          y: {
            formatter: (value) => {
              return value + "%";
            },
          },
        },
        annotations: {
          yaxis: [
            //만수위, 사수위, 홍수위, 제정고 순
          ],
        },
      },

      tableData: [],

      weatherSwitch: false,

      defaultButtonColor: "rgb(13, 75, 169)",
      focusButtonColor: "rgb(255, 255, 0)",

      buttonSetShort: [
        {
          title: "6시간 예측",
          class: "predict-button-default predict-button-off",
          param: [0, 6],
        },
        {
          title: "12시간 예측",
          class: "predict-button-default predict-button-off",
          param: [0, 12],
        },
        {
          title: "24시간 예측",
          class: "predict-button-default predict-button-off",
          param: [0, 24],
        },
      ],

      buttonSetLong: [
        {
          title: "7일 예측",
          class: "predict-button-default predict-button-off",
          param: [1, 7],
        },
        {
          title: "30일 예측",
          class: "predict-button-default predict-button-off",
          param: [1, 30],
        },
        {
          title: "90일 예측",
          class: "predict-button-default predict-button-off",
          param: [1, 90],
        },
      ],

      toggleWeatherData: false,

      rateSet: [],
      valueSet: [],

      resultData: [],

      isLoadedData: false,

      gusanDataFromDB: {
        sixHous: { default: [], weather: [] },
        halfDay: { default: [], weather: [] },
        oneDay: { default: [], weather: [] },
        week: {
          default: [],
          weather: [],
        },
        month: {
          default: [],
          weather: [],
        },
        quarter: {
          default: [],
          weather: [],
        },
      },

      sinbangDataFromDB: {
        sixHous: { default: [], weather: [] },
        halfDay: { default: [], weather: [] },
        oneDay: { default: [], weather: [] },
        week: {
          default: [],
          weather: [],
        },
        month: {
          default: [],
          weather: [],
        },
        quarter: {
          default: [],
          weather: [],
        },
      },

      dongheaDataFromDB: {
        sixHous: { default: [], weather: [] },
        halfDay: { default: [], weather: [] },
        oneDay: { default: [], weather: [] },
        week: {
          default: [],
          weather: [],
        },
        month: {
          default: [],
          weather: [],
        },
        quarter: {
          default: [],
          weather: [],
        },
      },

      gahackDataFromDB: {
        sixHous: { default: [], weather: [] },
        halfDay: { default: [], weather: [] },
        oneDay: { default: [], weather: [] },
        week: {
          default: [],
          weather: [],
        },
        month: {
          default: [],
          weather: [],
        },
        quarter: {
          default: [],
          weather: [],
        },
      },

      gungockDataFromDB: {
        sixHous: { default: [], weather: [] },
        halfDay: { default: [], weather: [] },
        oneDay: { default: [], weather: [] },
        week: {
          default: [],
          weather: [],
        },
        month: {
          default: [],
          weather: [],
        },
        quarter: {
          default: [],
          weather: [],
        },
      },

      gusiDataFromDB: {
        sixHous: { default: [], weather: [] },
        halfDay: { default: [], weather: [] },
        oneDay: { default: [], weather: [] },
        week: {
          default: [],
          weather: [],
        },
        month: {
          default: [],
          weather: [],
        },
        quarter: {
          default: [],
          weather: [],
        },
      },

      sinduckDataFromDB: {
        sixHous: { default: [], weather: [] },
        halfDay: { default: [], weather: [] },
        oneDay: { default: [], weather: [] },
        week: {
          default: [],
          weather: [],
        },
        month: {
          default: [],
          weather: [],
        },
        quarter: {
          default: [],
          weather: [],
        },
      },

      yeonhwaDataFromDB: {
        sixHous: { default: [], weather: [] },
        halfDay: { default: [], weather: [] },
        oneDay: { default: [], weather: [] },
        week: {
          default: [],
          weather: [],
        },
        month: {
          default: [],
          weather: [],
        },
        quarter: {
          default: [],
          weather: [],
        },
      },

      heawonDataFromDB: {
        sixHous: { default: [], weather: [] },
        halfDay: { default: [], weather: [] },
        oneDay: { default: [], weather: [] },
        week: {
          default: [],
          weather: [],
        },
        month: {
          default: [],
          weather: [],
        },
        quarter: {
          default: [],
          weather: [],
        },
      },

      hwawonDataFromDB: {
        sixHous: { default: [], weather: [] },
        halfDay: { default: [], weather: [] },
        oneDay: { default: [], weather: [] },
        week: {
          default: [],
          weather: [],
        },
        month: {
          default: [],
          weather: [],
        },
        quarter: {
          default: [],
          weather: [],
        },
      },

      isWeeklyDefaultLoaded: false,
      isWeeklyWeatherLoaded: false,
      isMonthlyDefaultLoaded: false,
      isMonthlyWeatherLoaded: false,
      isQuarterDefaultLoaded: false,
      isQuarterWeatherLoaded: false,

      weatherInfoList: [{ date: "", rain: 0, min: 0, max: 0, rainPercent: 0 }],
    };
  },

  created() {
    this.testJsonFormat = [];

    this.initPredictDataFromDB();
    this.initWeatherInfoList();
  },

  mounted() {
    this.$nextTick(() => {
      this.testJsonFormat = [];

      this.buttonSetLong[0].class = "predict-button-default predict-button-on";
      this.isLoading = false;
    });

    this.selectedReservoir = this.getReservoirInfo.reservoirName;
  },

  methods: {
    initWeatherInfoList() {
      // let count = 10

      this.weatherInfoList = [];

      for (let i = 0; i < 10; i++) {
        let date = undefined;
        if (i === 0) {
          date = moment().add(i, "days").format("MM. DD (오늘)");
        } else {
          date = moment().add(i, "days").format("MM. DD (ddd)");
        }

        this.weatherInfoList.push({
          date,
          min: Math.floor(Math.random() * (18 - 12 + 1) + 12),
          max: Math.floor(Math.random() * (33 - 18 + 1) + 18),
          rain: 0,
          rainPercent: Math.floor(Math.random() * (30 - 0 + 1) + 0),
        });
      }
    },

    async initDataOnlyForDemo() {
      this.testJsonFormat = [];

      switch (this.getReservoirInfo.reservoirId) {
        case 4682010373:
          this.testJsonFormat = this.sinbangDataFromDB;
          this.initChart();
          break;
        case 4682010078:
          this.testJsonFormat = this.gusanDataFromDB;
          this.initChart();
          break;
        case 4682010117:
          this.testJsonFormat = this.dongheaDataFromDB;
          this.initChart();
          break;
        case 4682010098:
          this.testJsonFormat = this.heawonDataFromDB;
          this.initChart();
          break;
        case 4682010067:
          this.testJsonFormat = this.gusiDataFromDB;
          this.initChart();
          break;
        case 4682010346:
          this.testJsonFormat = this.sinduckDataFromDB;
          this.initChart();
          break;
        case 4682010168:
          this.testJsonFormat = this.hwawonDataFromDB;
          this.initChart();
          break;
        case 4682010099:
          this.testJsonFormat = this.gungockDataFromDB;
          this.initChart();
          break;
        case 4682010050:
          this.testJsonFormat = this.yeonhwaDataFromDB;
          this.initChart();
          break;
        case 4682010160:
          this.testJsonFormat = this.gahackDataFromDB;
          this.initChart();
          break;
      }
    },

    setSixHour() {

      console.log('this.simepleData', this.simepleData)

      for (let i = 0; i < this.simepleData.length; i++) {
        this.gusanDataFromDB.sixHous.default.push({
          date: this.simpleData[i].date,
          value: this.simpleData[i].value,
          rate: this.simepleData[i].rate,
        });
      }
    },

    setDataWeekFromDB(response) {
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].reservoir_ID === 4682010078) {
          this.gusanDataFromDB.week.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010373) {
          this.sinbangDataFromDB.week.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010160) {
          this.gahackDataFromDB.week.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010117) {
          this.dongheaDataFromDB.week.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010050) {
          this.yeonhwaDataFromDB.week.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010098) {
          this.heawonDataFromDB.week.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010067) {
          this.gusiDataFromDB.week.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010346) {
          this.sinduckDataFromDB.week.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010168) {
          this.hwawonDataFromDB.week.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010099) {
          this.gungockDataFromDB.week.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        }
      }
    },

    setDataWeekWeatherFromDB(response) {
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].reservoir_ID === 4682010078) {
          this.gusanDataFromDB.week.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010373) {
          this.sinbangDataFromDB.week.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010160) {
          this.gahackDataFromDB.week.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010117) {
          this.dongheaDataFromDB.week.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010050) {
          this.yeonhwaDataFromDB.week.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010098) {
          this.heawonDataFromDB.week.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010067) {
          this.gusiDataFromDB.week.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010346) {
          this.sinduckDataFromDB.week.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010168) {
          this.hwawonDataFromDB.week.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010099) {
          this.gungockDataFromDB.week.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        }
      }
    },

    setDataMonthFromDB(response) {
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].reservoir_ID === 4682010078) {
          this.gusanDataFromDB.month.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010373) {
          this.sinbangDataFromDB.month.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010160) {
          this.gahackDataFromDB.month.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010117) {
          this.dongheaDataFromDB.month.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010050) {
          this.yeonhwaDataFromDB.month.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010098) {
          this.heawonDataFromDB.month.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010067) {
          this.gusiDataFromDB.month.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010346) {
          this.sinduckDataFromDB.month.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010168) {
          this.hwawonDataFromDB.month.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010099) {
          this.gungockDataFromDB.month.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        }
      }
    },

    setDataMonthWeatherFromDB(response) {
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].reservoir_ID === 4682010078) {
          this.gusanDataFromDB.month.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010373) {
          this.sinbangDataFromDB.month.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010160) {
          this.gahackDataFromDB.month.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010117) {
          this.dongheaDataFromDB.month.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010050) {
          this.yeonhwaDataFromDB.month.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010098) {
          this.heawonDataFromDB.month.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010067) {
          this.gusiDataFromDB.month.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010346) {
          this.sinduckDataFromDB.month.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010168) {
          this.hwawonDataFromDB.month.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010099) {
          this.gungockDataFromDB.month.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        }
      }
    },

    setDataThreeMonthsFromDB(response) {
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].reservoir_ID === 4682010078) {
          this.gusanDataFromDB.quarter.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010373) {
          this.sinbangDataFromDB.quarter.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010160) {
          this.gahackDataFromDB.quarter.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010117) {
          this.dongheaDataFromDB.quarter.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010050) {
          this.yeonhwaDataFromDB.quarter.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010098) {
          this.heawonDataFromDB.quarter.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010067) {
          this.gusiDataFromDB.quarter.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010346) {
          this.sinduckDataFromDB.quarter.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010168) {
          this.hwawonDataFromDB.quarter.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010099) {
          this.gungockDataFromDB.quarter.default.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        }
      }
    },

    setDataThreeMonthsWeatherFromDB(response) {
      for (let i = 0; i < response.data.length; i++) {
        if (response.data[i].reservoir_ID === 4682010078) {
          this.gusanDataFromDB.quarter.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010373) {
          this.sinbangDataFromDB.quarter.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010160) {
          this.gahackDataFromDB.quarter.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010117) {
          this.dongheaDataFromDB.quarter.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010050) {
          this.yeonhwaDataFromDB.quarter.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010098) {
          this.heawonDataFromDB.quarter.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010067) {
          this.gusiDataFromDB.quarter.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010346) {
          this.sinduckDataFromDB.quarter.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010168) {
          this.hwawonDataFromDB.quarter.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        } else if (response.data[i].reservoir_ID === 4682010099) {
          this.gungockDataFromDB.quarter.weather.push({
            date: response.data[i].date,
            value: response.data[i].value,
            rate: response.data[i].rate,
          });
        }
      }
    },

    initPredictDataFromDB() {
      // 주
      this.$axios
        .get("http://192.168.0.73:3000/predict/week")
        .then((response) => {
          this.isWeeklyDefaultLoaded = false;
          this.setDataWeekFromDB(response);

          this.isWeeklyDefaultLoaded = true;
        });

      this.$axios
        .get("http://192.168.0.73:3000/predict/week/weather")
        .then((response) => {
          this.isWeeklyWeatherLoaded = false;
          this.setDataWeekWeatherFromDB(response);
          this.isWeeklyWeatherLoaded = true;
        });

      // 월
      this.$axios
        .get("http://192.168.0.73:3000/predict/month")
        .then((response) => {
          this.isMonthlyDefaultLoaded = false;

          this.setDataMonthFromDB(response);
          this.isMonthlyDefaultLoaded = true;
        });

      this.$axios
        .get("http://192.168.0.73:3000/predict/month/weather")
        .then((response) => {
          this.isMonthlyWeatherLoaded = false;
          this.setDataMonthWeatherFromDB(response);

          this.isMonthlyWeatherLoaded = true;
        });

      // 분기
      this.$axios
        .get("http://192.168.0.73:3000/predict/quarter")
        .then((response) => {
          this.isQuarterDefaultLoaded = false;
          this.setDataThreeMonthsFromDB(response);

          this.isQuarterDefaultLoaded = true;
        });

      this.$axios
        .get("http://192.168.0.73:3000/predict/quarter/weather")
        .then((response) => {
          this.isQuarterWeatherLoaded = false;
          this.setDataThreeMonthsWeatherFromDB(response);

          this.isQuarterWeatherLoaded = true;
        });
    },

    headerCellStyle(data) {
      let headerCellClass = "";

      if (
        (data.rowIndex === 1 && data.columnIndex === 0) ||
        (data.rowIndex === 1 && data.columnIndex === 1) ||
        (data.rowIndex === 0 && data.columnIndex === 1)
      ) {
        headerCellClass = "header-without-weather-data";
      } else if (
        (data.rowIndex === 1 && data.columnIndex === 2) ||
        (data.rowIndex === 1 && data.columnIndex === 3) ||
        (data.rowIndex === 0 && data.columnIndex === 2)
      ) {
        headerCellClass = "header-with-weather-data";
      } else if (data.rowIndex === 0 && data.columnIndex === 0) {
        headerCellClass = "header-data-date";
      }

      return headerCellClass;
    },

    legendClick(chartContext, seriesIndex, config) {
      console.log("legend Click", chartContext, seriesIndex, config);
      if (seriesIndex === 1) {
        if (this.weatherSwitch === true) {
          this.weatherSwitch = false;
          this.toggleWeatherData = false;
          this.setTableData(
            this.tableTimeDataForWeather,
            this.rateSet,
            this.valueSet,
            []
          );
        } else {
          this.weatherSwitch = true;
          this.toggleWeatherData = true;
          this.setTableData(
            this.tableTimeDataForWeather,
            this.rateSet,
            this.valueSet,
            this.sampleWeatherData
          );
        }
      }
    },

    initChart() {
      this.isLoading = true;

      this.tableData = [];
      this.rateSet = [];
      this.valueSet = [];

      this.setDataForDemo();
    },

    setDataForDemo() {
      let timeline = [];
      let tableTimeData = [];

      for (let i = 0; i < this.getTestData.week.default.length; i++) {
        timeline.push(this.getTestData.week.default[i].date);
        tableTimeData.push(this.getTestData.week.default[i].date);

        this.rateSet.push(this.getTestData.week.default[i].rate);

        this.valueSet.push(this.getTestData.week.default[i].value);
      }

      for (let i = 0; i < this.getTestData.week.weather.length; i++) {
        this.sampleWeatherData.push(this.getTestData.week.weather[i].rate);
        this.sampleWeatherDataValue.push(
          this.getTestData.week.weather[i].value
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }

      // 홍수위, 만수위, 사수위, 제정고 데이터 추가

      // let fullWaterElm = 0,
        // overflowElm = 0,
        let deadElm = 0
        // damHeightElm = 0;
      // damHeightElm = 0;

      let overFlowElmToPercentage = 0
      this.reservoirList.forEach((reservoir) => {
        if (reservoir.reservoirName === this.selectedReservoir) {
          // fullWaterElm = reservoir.fullElm;
          // overflowElm = reservoir.overflowElm;
          // overflowElm = reservoir.overflowElm;
          // overflowElm = reservoir.overflowPercentage;
          deadElm = 1;
          // damHeightElm = reservoir.damHeight;
          overFlowElmToPercentage = reservoir.overflowPercentage
        }
      });
      console.log('-deadElm, ', deadElm)

      // let fullWaterElmToPercentage = Math.round(
      //   (fullWaterElm / damHeightElm) * 100
      //   // (fullWaterElm / fullWaterElm) * 100
      // );

      // let overFlowElmToPercentage = Math.round(
      //   (overflowElm / damHeightElm) * 100
      //   // (overflowElm / fullWaterElm) * 100
      // );


      // let diffPercentage = overFlowElmToPercentage - fullWaterElmToPercentage;

      this.$refs.chart.updateOptions({
        xaxis: {
          categories: timeline,
        },
        annotations: {
          yaxis: [
            {
              y: 100,
              borderColor: "darkgreen",
              label: {
                borderColor: "darkgreen",
                style: {
                  color: "#fff",
                  background: "darkgreen",
                },
                text: "만수위(%)",
              },
            },
            {
              y: overFlowElmToPercentage,
              borderColor: "purple",
              label: {
                borderColor: "purple",
                style: {
                  color: "#fff",
                  background: "purple",
                },
                text: "홍수위(%)",
              },
            },
            // {
            //   y: deadElm,
            //   borderColor: "black",
            //   label: {
            //     borderColor: "black",
            //     style: {
            //       color: "#fff",
            //       background: "black",
            //     },
            //     text: "사수위(%)",
            //   },
            // },
          ],
        },
      });

      this.$refs.chart.updateSeries([
        {
          name: "예측값",
          data: this.rateSet,
        },
      ]);

      this.tableTimeDataForWeather = tableTimeData;
      this.setTableData(tableTimeData, this.rateSet, this.valueSet, []);
    },

    setTableData(timeData, rates, amounts, weatherData) {
      let dataForTable = [];
      this.tableData = [];

      if (weatherData.length === 0) {
        for (let i = 0; i < rates.length; i++) {
          dataForTable.push({
            // date: moment(timeData[i]).format('mm'),
            date: moment(timeData[i]).format("YYYY-MM-DD a HH:mm:ss"),
            rate: rates[i],
            amount: amounts[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            rateWithWeather: [],
            amountWithWeather: [],
            usableWaterAmount: this.getReservoirInfo.usableWaterAmount,
          });
        }
      } else {
        for (let i = 0; i < rates.length; i++) {
          dataForTable.push({
            date: moment(timeData[i]).format("YYYY-MM-DD a HH:mm:ss"),
            rate: rates[i],
            amount: amounts[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            rateWithWeather: weatherData[i],
            amountWithWeather: this.sampleWeatherDataValue[i],
            usableWaterAmount: this.getReservoirInfo.usableWaterAmount,
          });
        }
      }

      this.tableData = dataForTable;
    },

    updateChart(index, type, time) {
      let timeline = [];
      let newData = [];
      this.sampleWeatherData = [];

      if (type === 0) {
        this.rateSet = newData;
        this.valueSet = [];

        this.$refs.chart.updateOptions({
          xaxis: {
            categories: timeline,
          },
        });

        this.$refs.chart.updateSeries([
          {
            name: "예측값",
            data: newData,
          },
        ]);

        for (let i = 0; i < this.buttonSetShort.length; i++) {
          if (i === index) {
            this.buttonSetShort[i].class =
              "predict-button-default predict-button-on";
          } else {
            this.buttonSetShort[i].class =
              "predict-button-default predict-button-off";
          }
        }

        for (let i = 0; i < this.buttonSetLong.length; i++) {
          this.buttonSetLong[i].class =
            "predict-button-default predict-button-off";
        }

        this.rateSet = [];
        this.valueSet = [];
        this.sampleWeatherData = [];
        this.sampleWeatherDataValue = [];
        this.tableData = [];

        this.simpleData = [];

        switch (this.getReservoirInfo.reservoirId) {
          case 4682010373:
            this.simpleData = this.sinbangSimple;
            break;
          case 4682010078:
            this.simpleData = this.gusanSimple;
            break;
          case 4682010117:
            this.simpleData = this.dongheaSimple;
            break;
          case 4682010098:
            this.simpleData = this.heawonSimple;
            break;
          case 4682010067:
            this.simpleData = this.gusiSimple;
            break;
          case 4682010346:
            this.simpleData = this.sinduckSimple;
            break;
          case 4682010168:
            this.simpleData = this.hwawonSimple;
            break;
          case 4682010099:
            this.simpleData = this.gungockSimple;
            break;
          case 4682010050:
            this.simpleData = this.yeonhwaSimple;
            break;
          case 4682010160:
            this.simpleData = this.gahackSimple;
            break;
        }

        if (time === 6) {

          for (let i = 0; i < this.simpleData.six.default.length; i++) {
            timeline.push(this.simpleData.six.default[i].date);
            this.rateSet.push(this.simpleData.six.default[i].rate);
            this.valueSet.push(this.simpleData.six.default[i].value.toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ","));
          }

          for (let i = 0; i < this.simpleData.six.weather.length; i++) {
            // timeline.push(this.simpleData.six.weather[i].date);
            this.sampleWeatherData.push(this.simpleData.six.weather[i].rate);
            this.sampleWeatherDataValue.push(this.simpleData.six.weather[i].value)
          }
        } else if (time === 12) {
          for (let i = 0; i < this.simpleData.tw.default.length; i++) {
            timeline.push(this.simpleData.tw.default[i].date);
            this.rateSet.push(this.simpleData.tw.default[i].rate);
            this.valueSet.push(this.simpleData.tw.default[i].value);
          }

          for (let i = 0; i < this.simpleData.tw.weather.length; i++) {
            // timeline.push(this.simpleData.six.weather[i].date);
            this.sampleWeatherData.push(this.simpleData.tw.weather[i].rate);
            this.sampleWeatherDataValue.push(this.simpleData.tw.weather[i].value)
          }

        } else if (time === 24) {
          for (let i = 0; i < this.simpleData.tf.default.length; i++) {
            timeline.push(this.simpleData.tf.default[i].date);
            this.rateSet.push(this.simpleData.tf.default[i].rate);
            this.valueSet.push(this.simpleData.tf.default[i].value);
          }

          for (let i = 0; i < this.simpleData.tf.weather.length; i++) {
            // timeline.push(this.simpleData.six.weather[i].date);
            this.sampleWeatherData.push(this.simpleData.tf.weather[i].rate);
            this.sampleWeatherDataValue.push(this.simpleData.tf.weather[i].value)
          }
        }

        this.setTableData(timeline, this.rateSet, this.valueSet, []);

        for (let i = 0; i < this.buttonSetShort.length; i++) {
          if (i === index) {
            this.buttonSetLong[i].class =
              "predict-button-default predict-button-on";
          } else {
            this.buttonSetLong[i].class =
              "predict-button-default predict-button-off";
          }
        }

        for (let i = 0; i < this.buttonSetLong.length; i++) {
          this.buttonSetLong[i].class =
            "predict-button-default predict-button-off";
        }

        this.$refs.chart.updateOptions({
          xaxis: {
            categories: timeline,
          },
        });

        this.$refs.chart.updateSeries([
          {
            name: "예측값",
            data: this.rateSet,
          },
        ]);

        if (this.toggleWeatherData === true) {
          this.addWeatherData(true);
        }

        this.buttonSet = [index, type, time];
      } else {
        this.rateSet = [];
        this.valueSet = [];
        this.sampleWeatherData = [];
        this.sampleWeatherDataValue = [];
        this.tableData = [];

        switch (time) {
          case 7:
            for (let i = 0; i < this.getTestData.week.default.length; i++) {
              timeline.push(this.getTestData.week.default[i].date);
              this.rateSet.push(this.getTestData.week.default[i].rate);
              this.valueSet.push(
                this.getTestData.week.default[i].value
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }

            // for (let i = 0; i < this.testJsonFormat.week.weather.length; i++) {
            for (let i = 0; i < this.getTestData.week.weather.length; i++) {
              this.sampleWeatherData.push(
                // this.testJsonFormat.week.weather[i].rate
                this.getTestData.week.weather[i].rate
              );
              this.sampleWeatherDataValue.push(
                // this.testJsonFormat.week.weather[i].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                this.getTestData.week.weather[i].value
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }

            this.tableTimeDataForWeather = timeline;
            break;
          case 30:
            for (let i = 0; i < this.getTestData.month.default.length; i++) {
              timeline.push(this.getTestData.month.default[i].date);
              this.rateSet.push(this.getTestData.month.default[i].rate);
              this.valueSet.push(this.getTestData.month.default[i].value);
            }

            // for (let i = 0; i < this.testJsonFormat.month.weather.length; i++) {
            for (let i = 0; i < this.getTestData.month.weather.length; i++) {
              this.sampleWeatherData.push(
                // this.testJsonFormat.month.weather[i].rate
                this.getTestData.month.weather[i].rate
              );
              this.sampleWeatherDataValue.push(
                // this.testJsonFormat.month.weather[i].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                this.getTestData.month.weather[i].value
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }

            this.tableTimeDataForWeather = timeline;
            break;
          case 90:
            for (
              let i = 0;
              // i < this.testJsonFormat.quarter.default.length;
              i < this.getTestData.quarter.default.length;
              i++
            ) {
              timeline.push(this.getTestData.quarter.default[i].date);
              this.rateSet.push(this.getTestData.quarter.default[i].rate);
              this.valueSet.push(
                this.getTestData.quarter.default[i].value
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }

            for (
              let i = 0;
              // i < this.testJsonFormat.quarter.weather.length;
              i < this.getTestData.quarter.weather.length;
              i++
            ) {
              this.sampleWeatherData.push(
                // this.testJsonFormat.quarter.weather[i].rate
                this.getTestData.quarter.weather[i].rate
              );
              this.sampleWeatherDataValue.push(
                // this.testJsonFormat.quarter.weather[i].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                this.getTestData.quarter.weather[i].value
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              );
            }

            this.tableTimeDataForWeather = timeline;

            break;
        }

        this.$refs.chart.updateOptions({
          xaxis: {
            categories: timeline,
          },
        });

        this.$refs.chart.updateSeries([
          {
            name: "예측값",
            data: this.rateSet,
          },
        ]);

        this.setTableData(timeline, this.rateSet, this.valueSet, []);

        for (let i = 0; i < this.buttonSetLong.length; i++) {
          if (i === index) {
            this.buttonSetLong[i].class =
              "predict-button-default predict-button-on";
          } else {
            this.buttonSetLong[i].class =
              "predict-button-default predict-button-off";
          }
        }

        for (let i = 0; i < this.buttonSetShort.length; i++) {
          this.buttonSetShort[i].class =
            "predict-button-default predict-button-off";
        }
      }

      if (this.toggleWeatherData === true) {
        this.addWeatherData(true);
      }

      this.buttonSet = [index, type, time];
    },

    addWeatherData(value) {
      if (value === true) {
        this.toggleWeatherData = true;
        this.$refs.chart.updateSeries([
          {
            name: "예측값",
            data: this.rateSet,
          },
          {
            name: "기상 데이터 기반 예측값",
            data: this.sampleWeatherData,
          },
        ]);

        this.setTableData(
          this.tableTimeDataForWeather,
          this.rateSet,
          this.valueSet,
          this.sampleWeatherData
        );
      } else {
        this.toggleWeatherData = false;
        this.setTableData(
          this.tableTimeDataForWeather,
          this.rateSet,
          this.valueSet,
          []
        );
        this.$refs.chart.hideSeries("기상 데이터 기반 예측값");
      }
    },

    selectReservoir(value) {
      this.toggleWeatherData = false;
      this.weatherSwitch = false;

      this.timeline = [];
      this.tableData = [];
      this.rateSet = [];
      this.valueSet = [];
      this.sampleWeatherData = [];
      this.sampleWeatherDataValue = [];
      this.tableTimeDataForWeather = [];

      for (let i = 0; i < this.reservoirList.length; i++) {
        if (this.reservoirList[i].reservoirName.includes(value)) {
          this.selectedReservoirId = this.reservoirList[i].reservoirId;
          this.$store.commit(
            "reservoir/SET_RESERVOIR_INFO",
            this.reservoirList[i]
          );
        }
      }

      this.initDataOnlyForDemo();

      for (let i = 0; i < this.buttonSetLong.length; i++) {
        if (i === 0) {
          this.buttonSetLong[i].class =
            "predict-button-default predict-button-on";
        } else {
          this.buttonSetLong[i].class =
            "predict-button-default predict-button-off";
        }
      }
    },
  },

  computed: {
    ...mapGetters({
      getReservoirInfo: "reservoir/GET_RESERVOIR_INFO",
    }),

    getIsLoading() {
      return this.isLoading;
    },

    getTestData() {
      return this.testJsonFormat;
    },

    getIsQuarterWeatherLoaded() {
      return this.isQuarterWeatherLoaded;
    },
  },

  watch: {
    getIsQuarterWeatherLoaded(data) {
      if (data === true) {
        this.initDataOnlyForDemo();
      }
    },
  },
};
</script>

<style>
.predict-button-set {
  display: flex;
  margin: 10px 0 0 0;
  font-size: 14px;
  font-family: "NotoSansKR-Medium";
  align-items: center;
  width: 400px;
}

.predict-button-set div:nth-child(1) {
  margin: 0 10px 0 0;
}

.predict-button-default {
  font-size: 14px;
  font-family: "NotoSansKR-Regular";
}

.predict-button-off {
  border: 1px solid rgb(13, 75, 169);
  color: #fff;
  background-color: rgb(13, 75, 169);
}

.predict-button-on {
  border: 1px solid rgb(13, 75, 169);
  color: rgb(13, 75, 169);
  background-color: #fff;
}

.header-with-weather-data {
  /* background: rgb(0, 227, 150) !important; */
  background: rgb(0, 227, 150) !important;
  color: #494949;
}

.header-without-weather-data {
  /* background: #409eff !important; */
  background: #409eff !important;
  color: #494949;
  /* color: #fff; */
}

.header-data-date {
  background-color: rgb(212, 212, 212) !important;
  color: #494949;
}

.apexcharts-gridline {
  stroke-width: 2px;
}
</style>
