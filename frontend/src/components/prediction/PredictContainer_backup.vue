<template>
  <div style="padding: 20px; width: calc(100% - 240px); margin: 0 auto">
    <breadcrumb-component
      :breadcrumb-path="[{ title: '예측' }]"
      breadcrumb-title="저수지 저수율 예측"
    ></breadcrumb-component>
    <div
      style="
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        font-family: 'NotoSansKR-Medium';
        align-items: center;
        margin: 10px 0 0 0;
      "
    >
      <div style="display: flex; align-items: center">
        <div style="margin: 0 10px 0 0">저수지명</div>
        <el-select
          style="width: 200px"
          v-model="selectedReservoir"
          class="m-2"
          placeholder="저수지를 선택해주세요."
          @change="selectReservoir"
        >
          <el-option
            v-for="reservoir in reservoirList"
            :key="reservoir.reservoirId"
            :value="reservoir.reservoirName"
            :disabled="reservoir.isForTest === false"
          ></el-option
        ></el-select>
      </div>
      <div style="display: flex; align-items: center">
        <div style="margin: 0 10px 0 0">단기예측</div>
        <el-button
          v-for="(button, buttonShortIndex) in buttonSetShort"
          :key="button.title"
          :class="button.class"
          :disabled="true"
          @click="
            updateChart(buttonShortIndex, button.param[0], button.param[1])
          "
        >
          {{ button.title }}
        </el-button>
        <div style="margin: 0 10px 0 30px">장기예측</div>
        <el-button
          v-for="(button, buttonLongIndex) in buttonSetLong"
          :key="button.title"
          :class="button.class"
          @click="
            updateChart(buttonLongIndex, button.param[0], button.param[1])
          "
        >
          {{ button.title }}
        </el-button>
        <div style="margin: 0 10px 0 30px">기상 데이터 ON/OFF</div>
        <el-switch v-model="weatherSwitch" @change="addWeatherData" />
      </div>
    </div>
    <apexchart
      type="line"
      height="50%"
      ref="chart"
      :options="chartOptions"
      :series="series"
      @legendClick="legendClick"
    ></apexchart>
    <div style="height: 27%; max-height: 27%">
      <el-table
        :data="tableData"
        style="
          margin: 30px 0 0 0;
          width: 100%;
          font-family: 'NotoSansKR-Regular';
        "
        border
        stripe
        fit
        height="100%"
        :header-cell-class-name="headerCellStyle"
      >
        <!-- :header-cell-class-name="headerCellStyle" -->
        <el-table-column sortable align="center" prop="date" label="날짜(시간)">
        </el-table-column>

        <el-table-column
          header-align="center"
          label="예측 데이터(기상 데이터 미포함)"
        >
          <!-- style="background-color: lightblue;" -->
          <el-table-column
            align="center"
            prop="rate"
            sortable
            label="저수율(%)"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="amount"
            sortable
            label="저수량"
          ></el-table-column>
        </el-table-column>
        <el-table-column
          header-align="center"
          label="예측 데이터(기상 데이터 포함)"
        >
          <el-table-column
            align="center"
            sortable
            prop="rateWithWeather"
            label="저수율(%)"
          ></el-table-column>
          <el-table-column
            align="center"
            sortable
            prop="amountWithWeather"
            label="저수량"
          >
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
// import testJsonFormat from "@/test-format.json";

// import gusanData from "/home/gpuadmin/Saeron/sungmin/server/model_result/gusan_result.json";
import gusanData from "../../../gusan_result.json";
// import sinbangData from "/home/gpuadmin/Saeron/sungmin/server/model_result/sinbang_result.json";
// import donghaeData from "/home/gpuadmin/Saeron/sungmin/server/model_result/donghae_result.json";
// import sinhakData from "/home/gpuadmin/Saeron/sungmin/server/model_result/sinhak_result.json";

import { mapGetters } from "vuex";
console.log("moment", moment);

export default {
  name: "PredictContainer",

  components: {
    BreadcrumbComponent,
    apexchart: VueApexCharts,
  },

  data() {
    return {
      gusanData,
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
        markers: {
          // size: ,
        },
        xaxis: {
          tickAmount: 10,
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
          max: 110,
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

      // gusanData,
      // sinbangData,
      // donghaeData,
      // sinhakData,
      resultData: [],
    };
  },

  mounted() {
    this.$nextTick(() => {

      this.initDataOnlyForDemo();

      this.testJsonFormat = gusanData;

      this.initChart();
      this.buttonSetLong[0].class = "predict-button-default predict-button-on";
      this.isLoading = false;
    });

    this.selectedReservoir = this.getReservoirInfo.reservoirName;
  },

  methods: {
    initDataOnlyForDemo() {
      // ids
      // 신방: 4682010373
      // 구산: 4682010078
      // 신학: 4689010018
      // 동해: 4682010117

      switch (this.getReservoirInfo.reservoirId) {
        case 4682010373:
          console.log("333 신방");
          // this.resultData =
          // this.testJsonFormat = sinbangData
          break;
        case 4682010078:
          console.log("333 구산");
          // this.testJsonFormat = gusanData
          break;
        case 4689010018:
          console.log("333 신학");
          // this.testJsonFormat = sinhakData
          break;
        case 4682010117:
          console.log("333 동해");
          // this.testJsonFormat = donghaeData
          break;
      }
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

      for (let i = 0; i < this.testJsonFormat.week.default.length; i++) {
        timeline.push(this.testJsonFormat.week.default[i].date);
        tableTimeData.push(this.testJsonFormat.week.default[i].date);

        this.rateSet.push(this.testJsonFormat.week.default[i].rate);

        this.valueSet.push(this.testJsonFormat.week.default[i].value);
      }

      /// weather
      for (let i = 0; i < this.testJsonFormat.week.weather.length; i++) {
        this.sampleWeatherData.push(this.testJsonFormat.week.weather[i].rate);
        this.sampleWeatherDataValue.push(
          this.testJsonFormat.week.weather[i].value
        );
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

      this.tableTimeDataForWeather = tableTimeData;
      this.setTableData(tableTimeData, this.rateSet, this.valueSet, []);
    },

    setTableData(timeData, rates, amounts, weatherData) {
      console.log("timedata length", timeData.length);

      let dataForTable = [];
      this.tableData = [];

      if (weatherData.length === 0) {
        for (let i = 0; i < rates.length; i++) {
          dataForTable.push({
            // date: moment(timeData[i]).format('mm'),
            date: timeData[i],
            rate: rates[i],
            amount: amounts[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            rateWithWeather: [],
            amountWithWeather: [],
            usableWaterAmount: this.getReservoirInfo.usableWaterAmount,
          });
        }
      } else {
        for (let i = 0; i < rates.length; i++) {
          dataForTable.push({
            date: timeData[i],
            rate: rates[i],
            amount: amounts[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
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
      } else {
        this.rateSet = [];
        this.valueSet = [];
        this.sampleWeatherData = [];
        this.sampleWeatherDataValue = [];
        this.tableData = [];

        switch (time) {
          case 7:
            // this.initChart();
            for (let i = 0; i < this.testJsonFormat.week.default.length; i++) {
              timeline.push(this.testJsonFormat.week.default[i].date);
              this.rateSet.push(this.testJsonFormat.week.default[i].rate);
              this.valueSet.push(this.testJsonFormat.week.default[i].value);
            }

            for (let i = 0; i < this.testJsonFormat.week.weather.length; i++) {
              this.sampleWeatherData.push(
                this.testJsonFormat.week.weather[i].rate
              );
              this.sampleWeatherDataValue.push(
                this.testJsonFormat.week.weather[i].value
              );
            }

            this.tableTimeDataForWeather = timeline
            break;
          case 30:
            for (let i = 0; i < this.testJsonFormat.month.default.length; i++) {
              timeline.push(this.testJsonFormat.month.default[i].date);
              this.rateSet.push(this.testJsonFormat.month.default[i].rate);
              this.valueSet.push(this.testJsonFormat.month.default[i].value);
            }

            for (let i = 0; i < this.testJsonFormat.month.weather.length; i++) {
              this.sampleWeatherData.push(
                this.testJsonFormat.month.weather[i].rate
              );
              this.sampleWeatherDataValue.push(
                this.testJsonFormat.month.weather[i].value
              );
            }

            this.tableTimeDataForWeather = timeline
            break;
          case 90:
            for (
              let i = 0;
              i < this.testJsonFormat.quarter.default.length;
              i++
            ) {
              timeline.push(this.testJsonFormat.quarter.default[i].date);
              this.rateSet.push(this.testJsonFormat.quarter.default[i].rate);
              this.valueSet.push(this.testJsonFormat.quarter.default[i].value);
            }

            for (
              let i = 0;
              i < this.testJsonFormat.quarter.weather.length;
              i++
            ) {
              this.sampleWeatherData.push(
                this.testJsonFormat.quarter.weather[i].rate
              );
              this.sampleWeatherDataValue.push(
                this.testJsonFormat.quarter.weather[i].value
              );
            }

            this.tableTimeDataForWeather = timeline

            break;
        }

        this.$refs.chart.updateOptions({
          xaxis: {
            categories: timeline,
          },
        });

        console.log("timelinelength", timeline.length);

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

      this.basicData = newData;

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

        console.log("tableTimeDataForWeather", this.tableTimeDataForWeather.length);

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
      for (let i = 0; i < this.reservoirList.length; i++) {
        if (this.reservoirList[i].reservoirName.includes(value)) {
          this.$store.commit(
            "reservoir/SET_RESERVOIR_INFO",
            this.reservoirList[i]
          );
        }
      }

      this.initDataOnlyForDemo();
      this.updateChart(this.buttonSet[0], this.buttonSet[1], this.buttonSet[2]);

      this.toggleWeatherData = false;

      switch (value) {
        case "구산":
          this.initChart();
          break;
        case "신방":
          this.initChart();
          break;
        case "동해":
          this.initChart();
          break;
        case "신학":
          this.initChart();
          break;
      }

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
      console.log(">>>>>", this.isLoading);
      return this.isLoading;
    },
  },

  watch: {
    getReservoirInfo(data) {
      console.log("-GET RESERVOIR INFO: DATA", data);
    },
  },

  update() {
    console.log("-123");
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
</style>
