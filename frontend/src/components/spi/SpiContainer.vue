<template>
  <div style="padding: 20px; width: calc(100% - 240px); margin: 0 auto">
    <breadcrumb-component
      :breadcrumb-path="[{ title: 'SPI' }]"
      breadcrumb-title="저수지 SPI 지수"
    ></breadcrumb-component>

    <div
      style="
        margin: 20px 0;
        display: flex;
        align-items: center;
        font-family: 'NotoSansKR-Medium';
      "
    >
      <div style="margin: 0 10px 0 0">저수지명</div>
      <el-select
        v-model="selectedReservoir"
        placeholder="저수지를 선택해주세요."
        @change="selectReservoir"
      >
        <el-option
          v-for="reservoir in reservoirList"
          :key="reservoir.reservoirId"
          :value="reservoir.reservoirName"
        >
        </el-option>
      </el-select>
    </div>

    <div class="spi-graph-raw">
      <div class="spi-graph-raw-set">
        <div class="chart-title-box">저수지 유량</div>
        <div class="chart-box">
          <apexchart
            ref="chart1"
            type="bar"
            :options="chart1Option"
            :series="chart1Series"
            height="100%"
          ></apexchart>
        </div>
      </div>
      <div class="spi-graph-raw-set">
        <div class="chart-title-box">가뭄지수(SPI)</div>
        <div class="chart-box">
          <apexchart
            ref="chart2"
            type="line"
            :options="chart2Option"
            :series="chart2Series"
            height="100%"
          ></apexchart>
        </div>
      </div>
    </div>

    <div class="spi-graph-raw" style="width: 100%; margin: 30px 0 0 0">
      <div class="spi-graph-raw-set">
        <div class="chart-title-box">평년강수 시나리오 가뭄지수(SPI)</div>
        <div class="chart-box">
          <apexchart
            ref="chart3"
            type="line"
            :options="chart3Option"
            :series="chart3Series"
            height="100%"
          ></apexchart>
        </div>
      </div>
      <div class="spi-graph-raw-set">
        <div class="chart-title-box">무강수 시나리오 가뭄지수(SPI)</div>
        <div class="chart-box">
          <apexchart
            ref="chart4"
            type="line"
            :options="chart4Option"
            :series="chart4Series"
            height="100%"
          ></apexchart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadcrumbComponent from "../common/BreadcrumbComponent.vue";
import VueApexCharts from "vue3-apexcharts";
import moment from "moment";

import reservoirList from "../../modules/hard_data/reservoir.json";
import { mapGetters } from "vuex";

export default {
  name: "SpiContainer",

  components: {
    BreadcrumbComponent,
    apexchart: VueApexCharts,
  },

  data() {
    return {
      reservoirList,
      selectedReservoir: "",
      chart1Option: {
        chart: {
          type: "line",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
          fontFamily: "NotoSansKR-Regular",
          // events: {
          //   legendClick: function (chartContext, seriesIndex, config) {
          //     console.log("++++++");
          //     console.log(chartContext, seriesIndex, config);
          //     console.log("++++++");
          //   },
          // },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
          width: 1,
        },
        // title: {
        // text: "Product Trends by Month",
        // align: "left",
        // },
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
          size: 5,
        },
        xaxis: {
          categories: [],
          labels: {
            show: true,
            rotate: -60,
            // rotateAlways: true,
            // tickAmount: 10
            // maxHeight: 200
            style: {
              fontSize: "12px",
            },
          },
        },
      },
      chart1Series: [{ data: [] }],

      chart2Option: {
        chart: {
          type: "line",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
          fontFamily: "NotoSansKR-Regular",
          // events: {
          //   legendClick: function (chartContext, seriesIndex, config) {
          //     console.log("++++++");
          //     console.log(chartContext, seriesIndex, config);
          //     console.log("++++++");
          //   },
          // },
        },
        annotations: {
          yaxis: [
            {
              y: 1,
              borderColor: "#775DD0",
            },
          ],
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
          width: 1,
        },
        // title: {
        // text: "Product Trends by Month",
        // align: "left",
        // },
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
        // markers: {
        //   size: 5,
        // },
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
      },
      chart2Series: [{ data: [] }],

      chart3Option: {
        chart: {
          type: "line",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
          fontFamily: "NotoSansKR-Regular",
          // events: {
          //   legendClick: function (chartContext, seriesIndex, config) {
          //     console.log("++++++");
          //     console.log(chartContext, seriesIndex, config);
          //     console.log("++++++");
          //   },
          // },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
          width: 1,
        },
        // title: {
        // text: "Product Trends by Month",
        // align: "left",
        // },
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
        // markers: {
        //   size: 5,
        // },
        annotations: {
          yaxis: [
            {
              y: 1,
              borderColor: "#775DD0",
            },
          ],
          xaxis: [
            {
              x: "10-20",
              borderColor: "#775DD0",
            },
          ],
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
      },
      chart3Series: [{ data: [] }],

      chart4Option: {
        chart: {
          type: "line",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
          fontFamily: "NotoSansKR-Regular",
          // events: {
          //   legendClick: function (chartContext, seriesIndex, config) {
          //     console.log("++++++");
          //     console.log(chartContext, seriesIndex, config);
          //     console.log("++++++");
          //   },
          // },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
          width: 1,
        },
        // title: {
        // text: "Product Trends by Month",
        // align: "left",
        // },
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
        annotations: {
          yaxis: [
            {
              y: 1,
              borderColor: "purple",
            },
          ],
          xaxis: [
            {
              x: "10-20",
              borderColor: "red",
            },
          ],
        },

        // markers: {
        //   size: 5,
        // },
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
      },
      chart4Series: [{ data: [] }],
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.setChartData();
      this.selectedReservoir = this.getReservoirInfo.reservoirName;
    });
  },

  methods: {
    selectReservoir(value) {
      this.setChartData();
      for (let i = 0; i < this.reservoirList.length; i++) {
        if (this.reservoirList[i].reservoirName.includes(value)) {
          this.$store.commit(
            "reservoir/SET_RESERVOIR_INFO",
            this.reservoirList[i]
          );
        }
      }
    },

    setChartData() {
      let chart1SeriesLocal = [],
        chart1CategoryLocal = [],
        chart2CategoryLocal = [],
        chart3CategoryLocal = [],
        chart4CategoryLocal = [];

      // chart1. 저수지 유량
      let year1 = [],
        year2 = [],
        year3 = [];
      for (let i = -1; i < 6; i++) {
        // for (let k = 0; k < 4; k++) {
        year1.push(Math.floor(Math.random() * (100 - 50 + 1)) + 50);
        year2.push(Math.floor(Math.random() * (100 - 50 + 1)) + 50);
        year3.push(Math.floor(Math.random() * (100 - 50 + 1)) + 50);
        // }

        // chart1SeriesLocal.push([year1, year2, year3]);
        chart1SeriesLocal.push(Math.floor(Math.random() * (100 - 50 + 1)) + 50);

        chart1CategoryLocal.unshift(new Date().getUTCMonth() - i + "월");
      }

      this.$refs.chart1.updateOptions({
        xaxis: { categories: chart1CategoryLocal },
      });

      this.$refs.chart1.updateSeries([
        { name: "2023년", data: year1 },
        { name: "2024년", data: year2 },
        { name: "과거평년", data: year3 },
      ]);

      /////////// chart2 가뭄지수
      let spi3 = [],
        spi6 = [],
        spi9 = [];
      for (let i = 0; i < 25; i++) {
        spi3.push(Math.floor(Math.random() * (5 - 0 + 1)) + 0);
        spi6.push(Math.floor(Math.random() * (5 - 0 + 1)) + 0);
        spi9.push(Math.floor(Math.random() * (5 - 0 + 1)) + 0);

        chart2CategoryLocal.unshift(
          moment().subtract(i, "days").format("MM-DD")
        );
      }

      this.$refs.chart2.updateOptions({
        xaxis: { categories: chart2CategoryLocal },
      });

      this.$refs.chart2.updateSeries([
        { name: "SPI3", data: spi3 },
        { name: "SPI6", data: spi6 },
        { name: "SPI9", data: spi9 },
      ]);

      ////// chart3. 평년강수 시나리오
      let spi33 = [],
        spi36 = [],
        spi39 = [];
      for (let i = 0; i < 25; i++) {
        spi33.push(Math.floor(Math.random() * (5 - 0 + 1)) + 0);
        spi36.push(Math.floor(Math.random() * (5 - 0 + 1)) + 0);
        spi39.push(Math.floor(Math.random() * (5 - 0 + 1)) + 0);

        chart3CategoryLocal.unshift(
          moment().subtract(i, "days").format("MM-DD")
        );
      }

      this.$refs.chart3.updateOptions({
        xaxis: { categories: chart3CategoryLocal },
      });

      this.$refs.chart3.updateSeries([
        { name: "SPI3", data: spi33 },
        { name: "SPI6", data: spi36 },
        { name: "SPI9", data: spi39 },
      ]);

      ////// chart4. 무강수 시나리오
      let spi43 = [],
        spi46 = [],
        spi49 = [];
      for (let i = 0; i < 25; i++) {
        spi43.push(Math.floor(Math.random() * (5 - 0 + 1)) + 0);
        spi46.push(Math.floor(Math.random() * (5 - 0 + 1)) + 0);
        spi49.push(Math.floor(Math.random() * (5 - 0 + 1)) + 0);

        chart4CategoryLocal.unshift(
          moment().subtract(i, "days").format("MM-DD")
        );
      }

      this.$refs.chart4.updateOptions({
        xaxis: { categories: chart4CategoryLocal },
      });

      this.$refs.chart4.updateSeries([
        { name: "SPI3", data: spi43 },
        { name: "SPI6", data: spi46 },
        { name: "SPI9", data: spi49 },
      ]);
    },
  },
  computed: {
    ...mapGetters({
      getReservoirInfo: "reservoir/GET_RESERVOIR_INFO",
    }),
  },
};
</script>

<style>
.spi-graph-raw {
  display: flex;
  height: 35%;
  width: 100%;
  font-family: "NotoSansKR-Medium";
}

.spi-graph-raw-set {
  width: 50%;
  height: 100%;
  padding: 5px;
}

.chart-title-box {
  background-color: rgb(13, 75, 169);
  width: 230px;
  height: 30px;
  color: #fff;
  line-height: 30px;
  padding: 0 0 0 10px;
}

.chart-box {
  /* width: 50%; */
  border: 1px solid #ccc;
  /* margin: 5px; */
  height: 90%;
}
</style>
