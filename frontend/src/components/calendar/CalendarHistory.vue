<template>
  <div style="padding: 20px 20px 0 20px; width: 100%">
    <breadcrumb-component :breadcrumb-path="[{ title: '일정' }, { title: '이력' }]" breadcrumb-title=" 수문개방이력"
      :is-calendar="true"></breadcrumb-component>
  </div>
  <div style="display: flex; height: calc(100% - 130px); margin: 0 0 0 20px">
    <div style="width: 50%">
      <div style="
          font-family: 'NotoSansKR-Regular';
          align-items: end;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        ">
        <div style="font-family: 'NotoSansKR-Medium'; font-size: 18px;">수문개방이력</div>
        <div>
          총 {{ gateHistory.length }} 회
        </div>
        <!-- <div>
          <el-button color="#0d4ba9" @click="resetDataFilter">필터값 초기화</el-button>
        </div> -->
      </div>
      <el-table border :data="gateHistory" stripe ref="table" style="
          /* font-size: 10px; */
          margin: 10px 0 0 0;
          /* height: calc(100% - 37px); */
          height: calc(50% - 50px);
          font-family: 'NotoSansKR-Regular';
        " :header-cell-class-name="headerCellStyle">
        <el-table-column sortable align="center" label="#" type="index" width="70"></el-table-column>
        <el-table-column sortable align="center" prop="date" column-key="date" width="120" label="일자"></el-table-column>
        <el-table-column sortable align="center" prop="reservoirId" width="120" label="표준코드"></el-table-column>
        <el-table-column sortable align="center" prop="reservoirName" label="저수지명"
          column-key="reservoirName"></el-table-column>
        <el-table-column align="center" label="공급시간" prop="requestTime"></el-table-column>
        <!-- <el-table-column align="center" label="저수율 (단위: %)">
          <el-table-column sortable align="center" label="개방 전" prop="waterRateBefore" column-key="waterRateBefore"
            :filters="tableFilterByRate" :filter-method="filterTableByRate"></el-table-column>
          <el-table-column sortable align="center" prop="waterRateAfter" label="개방 후" column-key="waterRateAfter"
            :filters="tableFilterByRate" :filter-method="filterTableByRate"></el-table-column>
        </el-table-column> -->
      </el-table>
      <hr color="#ccc" />
      <div
        style="margin: 10px 0 0 0; font-family: 'NotoSansKR-Medium'; font-size: 18px; display: flex; justify-content: space-between; align-items: center;">
        <div>물 공급/중단 요청 이력</div>
        <div style=" font-family: 'NotoSansKR-Regular';  font-size: 14px;">총 {{ requestTableData.length }} 회
          <span style="margin: 0 0 0 10px"><el-button @click="refreshRequest()" color="#0d4ba9">새로고침</el-button></span>
        </div>
      </div>
      <el-table border stripe style="font-family: 'NotoSansKR-Regular'; margin: 9px 0 0 0" :data="requestTableData"
        height="390" :header-cell-class-name="headerCellStyle">
        <el-table-column sortable label="#" prop="index" width="70" align="center"></el-table-column>
        <el-table-column sortable label="신청일자" prop="date" align="center"></el-table-column>
        <el-table-column sortable label="표준코드" prop="id" align="center"></el-table-column>
        <el-table-column sortable label="저수지명" prop="reservoirName" align="center"></el-table-column>
        <el-table-column sortable label="유저명 " prop="userName" align="center"></el-table-column>
        <el-table-column sortable label="요청타입" prop="type" align="center"></el-table-column>
      </el-table>
    </div>

    <div style="width: 50%; height: calc(100% - 40px); padding: 0 10px">

      <el-dialog center align-center draggable v-model="showDetailViewDialog" :show-close="true">
      </el-dialog>

      <div style="height: calc(50% + 5px)">
        <apexchart type="bar" height="100%" ref="chart" :options="chartOptions" :series="series"></apexchart>
      </div>
      <hr color="#ccc" />
      <div style="height: 50%; margin: 20px 0 0 0">
        <div style="
            font-family: 'NotoSansKR-Regular';
            display: flex;
            justify-content: space-between;
            font-size: 14px;
          ">
          <div style="font-family: 'NotoSansKR-Medium'; font-size: 18px;">
            {{ currentYear }}년도 저수율 고위험군 (50%이하) 수문개방이력
          </div>
          <div>
            총 {{ highRiskTableData.length }} 회
          </div>
        </div>

        <!-- :data="dataSortedByYear" -->
        <el-table border :data="highRiskTableData" stripe style="
            height: calc(100% - 15px);
            font-family: 'NotoSansKR-Regular';
            margin: 5px 0 0 0;
          " :header-cell-class-name="headerCellStyle">
          <el-table-column sortable align="center" label="#" type="index" width="70"></el-table-column>
          <el-table-column sortable align="center" prop="date" column-key="date" width="120" label="일자"
            :filters="tableFilterByYearMonth" :filter-method="filterTableByYearMonth"></el-table-column>
          <el-table-column sortable align="center" prop="reservoirId" width="120" label="표준코드"></el-table-column>
          <el-table-column sortable align="center" prop="reservoirName" label="저수지명" column-key="reservoirName"
            :filters="tableFilterByName" :filter-method="filterTableByName"></el-table-column>
          <el-table-column align="center" label="저수율 (단위: %)">
            <el-table-column sortable align="center" label="개방 전" prop="waterRateBefore" column-key="waterRateBefore"
              :filters="tableFilterByRate" :filter-method="filterTableByRate"></el-table-column>
            <el-table-column sortable align="center" prop="waterRateAfter" label="개방 후" column-key="waterRateAfter"
              :filters="tableFilterByRate" :filter-method="filterTableByRate"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import BreadcrumbComponent from "../common/BreadcrumbComponent.vue";
import VueApexCharts from "vue3-apexcharts";
import reservoirList from '@/modules/hard_data/reservoir.json'
// import gateHistory from "../../modules/hard_data/gateHistory.json";
import moment from "moment";

export default {
  name: "CalendarHistory",

  components: { BreadcrumbComponent, apexchart: VueApexCharts },

  data() {
    return {
      highRiskTableData: [],
      reservoirList,
      dataSortedByRate: [],
      currentYear: new Date().getUTCFullYear(),
      gateHistory: [],
      // gateHistory,
      detailTableData: [],
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
          // size: ,
        },
        xaxis: {
          tickAmount: 10,
          tickPlacement: "between",
          categories: [],
          labels: {
            show: true,
            // rotate: -60,
            // rotateAlways: true,
            // tickAmount: 10
            // maxHeight: 200
            style: {
              fontSize: "12px",
            },
          },
        },

        tooltip: {
          x: {
            show: true,
          },
          y: {
            formatter: (value) => {
              return value + "회";
            },
          },
        },
      },

      series: [
        {
          data: [],
        },
      ],

      chart: undefined,

      tableFilterByName: [],

      tableFilterByRate: [
        { text: "80초과", value: 81 },
        { text: "80이하 50초과", value: 80 },
        { text: "50이하 30초과", value: 50 },
        { text: "30이하", value: 30 },
      ],

      yearlySupplyAverage: [],

      tableFilterByYearMonth: [],

      selectedYear: "",

      filteredYearMonthArray: [],
      duplicateCount: 0,

      yearlyTotalCount: [],
      dataSortedByYear: [],

      allYears: [],

      showDetailViewDialog: false,
      requestTableData: []
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.initTableFilterList();
      this.setGraphXAxis();

      this.initGraph();
      this.initDetailTableData();

      this.initRequestTableData()

      this.initHighRistTableData()

    });
  },

  methods: {

    initHighRistTableData() {
      for (let i = 0; i < 5; i++) {
        this.highRiskTableData.push({
          index: i + 1,
          date: moment().subtract(i + 1, 'month').format('YYYY-MM-DD'),
          reservoirId: 4682010078,
          reservoirName: '구산',
          waterRateBefore: 48 - i * 0.5,
          waterRateAfter: 32 - i * 2
        })
      }
    },

    refreshRequest() {
      this.initRequestTableData()
    },

    initRequestTableData() {

      this.requestTableData = []

      this.$axios.get('http://192.168.0.73:3000/request/history').then(response => {
        let index = 1
        response.data.forEach(d => {
          if (d.request_type === 0 || d.request_type === 2) {
            this.reservoirList.forEach(reservoir => {
              if (reservoir.reservoirId == d.reservoir_id) {

                this.requestTableData.push({
                  index,
                  seq: d.seq,
                  reservoirName: reservoir.reservoirName,
                  date: moment(d.date).format('YYYY-MM-DD'),
                  id: d.reservoir_id,
                  type: d.request_type === 0 ? '공급' : '중단',
                  requestDate: d.request_date,
                  requestTime: d.request_start_time + ' - ' + d.reqeust_end_time,
                  userName: reservoir.userName
                })
                index++
              }
            })
          }
          else if (d.request_type === 1) {
            this.reservoirList.forEach(reservoir => {
              if (reservoir.reservoirId == d.reservoir_id) {
                this.gateHistory.push({
                  index,
                  date: moment(d.reqeust_date).format('YYYY-MM-DD'),
                  reservoirId: d.reservoir_id,
                  reservoirName: reservoir.reservoirName,
                  requestTime: d.request_start_time + ' - ' + d.request_end_time
                })
              }
            })
            index++
          }
        })
      })
    },

    initGraph() {
      this.chart = this.$refs.chart;

      let xaxisData = ['1월', '2월', '3월', "4월", "5월", "6월", "7월", "8월", "9월", "10월", '11월', '12월'];

      this.$refs.chart.updateOptions({
        xaxis: {
          categories: xaxisData,
        },
      });

      this.$refs.chart.updateSeries([
        { name: "2024년 전체 개방 횟수", data: [1, 5, 10, 13, 9, 6] },
        { name: "2023년 전체 개방 횟수", data: [7, 14, 19, 20, 7, 10, 21, 8, 7, 12, 20, 9] },
        { name: "2022년 전체 개방 횟수", data: [14, 21, 10, 4, 7, 9, 16, 4, 10, 3, 21, 11] },
      ]);

      this.getYearlyCountTotalData();
      this.getMonthlyCountTotalData();
    },

    // 그래프 하단 테이블 데이터
    initDetailTableData() {
      let newList = [];

      this.gateHistory.forEach((history) => {
        if (
          moment(history.date).format("YYYY") == new Date().getUTCFullYear()
        ) {
          if (history.waterRateBefore < 51) {
            newList.push(history);
          }
        }
      });

      function compare(a, b) {
        if (a.waterRateBefore < b.waterRateBefore) {
          return -1;
        }

        if (a.waterRateBefore > b.waterRateBefore) {
          return 1;
        }

        return 0;
      }

      this.dataSortedByRate = newList.sort(compare);
    },

    getYearlyCountTotalData() {
      let years = this.removeDuplicates(this.gateHistory, (it) =>
        moment(it.date).format("YYYY")
      );

      let keysArray = [];

      years.forEach((data) => {
        keysArray.push(moment(data.date).format("YYYY"));
      });

      let dataSet = [];
      keysArray.forEach((key) => {
        let count = 0;
        dataSet = [];
        this.gateHistory.forEach((history) => {
          if (key === moment(history.date).format("YYYY")) {
            count++;
            dataSet.push(history);
          }
        });

        this.yearlyTotalCount.push({
          [key]: count,
        });

        this.allYears.push(key);

        this.dataSortedByYear.push({
          year: key,
          data: dataSet,
          total: count,
        });
      });
    },

    getMonthlyCountTotalData() { },

    setGraphXAxis() { },

    initTableFilterList() {
      // reservoir name
      let filteredArray = this.removeDuplicates(
        this.gateHistory,
        (it) => it.reservoirId
      );

      for (let i = 0; i < filteredArray.length; i++) {
        this.tableFilterByName.push({
          text: filteredArray[i].reservoirName,
          value: filteredArray[i].reservoirName,
        });
      }

      // reservoir date
      this.filteredYearMonthArray = this.removeDuplicates(
        this.gateHistory,
        (it) => moment(it.date).format("YYYY-MM")
      );

      for (let i = 0; i < this.filteredYearMonthArray.length; i++) {
        this.tableFilterByYearMonth.push({
          text: this.filteredYearMonthArray[i].date.slice(0, 7),
          value: this.filteredYearMonthArray[i].date.slice(0, 7),
        });
      }
    },

    removeDuplicates(data, key) {
      return [...new Map(data.map((x) => [key(x), x])).values()];
    },

    filterTableByName(filterValue, filterObject) {
      return filterObject.reservoirName === filterValue;
    },

    filterTableByRate(filterValue, filterObject, row) {
      if (row.property === "waterRateBefore") {
        if (filterValue === 81) {
          return filterObject.waterRateBefore >= 81;
        } else if (filterValue === 80) {
          return (
            filterObject.waterRateBefore <= 80 &&
            filterObject.waterRateBefore >= 51
          );
        } else if (filterValue === 50) {
          return (
            filterObject.waterRateBefore <= 50 &&
            filterObject.waterRateBefore >= 31
          );
        } else if (filterValue === 30) {
          return filterObject.waterRateBefore <= 30;
        }
      } else if (row.property === "waterRateAfter") {
        if (filterValue === 81) {
          return filterObject.waterRateAfter >= 81;
        } else if (filterValue === 80) {
          return (
            filterObject.waterRateAfter <= 80 &&
            filterObject.waterRateAfter >= 51
          );
        } else if (filterValue === 50) {
          return (
            filterObject.waterRateAfter <= 50 &&
            filterObject.waterRateAfter >= 31
          );
        } else if (filterValue === 30) {
          return filterObject.waterRateAfter <= 30;
        }
      }
    },

    filterTableByYearMonth(filterValue, filterObject) {
      return filterObject.date.includes(filterValue);
    },

    resetDataFilter() {
      this.$refs.table.clearFilter(["date"]);
      this.$refs.table.clearFilter(["reservoirName"]);
      this.$refs.table.clearFilter(["waterRateBefore"]);
      this.$refs.table.clearFilter(["waterRateAfter"]);
    },

    headerCellStyle() {
      return "table-header-cell-basic-class";
    },
  },
};
</script>

<style>
.table-header-cell-basic-class {
  background-color: #f4f4f4 !important;
}

.el-checkbox {
  font-family: "NotoSansKR-Regular";
}
</style>
