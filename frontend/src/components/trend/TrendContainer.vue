<template>
  <div style="padding: 20px; width: calc(100% - 240px); margin: 0 auto">
    <breadcrumb-component :breadcrumb-path="[{ title: '비교분석' }]" breadcrumb-title=" 저수율 비교분석"></breadcrumb-component>
    <div style="
        display: flex;
        margin: 10px 0 0 0;
        font-family: 'NotoSansKR-Medium';
        align-items: center;
        font-size: 14px;
      ">
      <div style="margin: 0 10px 0 0">저수지명</div>
      <div>
        <el-select style="width: 200px" v-model="selectedReservoir" class="m-2" placeholder="저수지를 선택해주세요."
          @change="selectReservoir">
          <el-option v-for="reservoir in reservoirList" :key="reservoir.reservoirId"
            :value="reservoir.reservoirName"></el-option>
        </el-select>
      </div>
      <div style="margin: 0 0 0 10px">
        <el-date-picker type="daterange" v-model="selectedDateRange" @change="checkPeriod()" :clearable="false"
          style="font-family: 'NotoSansKR-Regular'; border-radius: 20px"></el-date-picker>
      </div>
      <div style="margin: 0 0 0 10px">
        <el-button @click="search()"
          style="width: 130px; color: #fff; background-color: rgb(13, 75, 169)">검색</el-button>
      </div>
    </div>
    <div style=" display: flex; justify-content: end;">
      <el-button @click="openModal()" style=" background-color: rgb(13, 75, 169); color: #fff">표 데이터
        보기</el-button>
    </div>
    <div>
      <div id="rateHistory" style="
          border: 1px solid #e9e9e9;
          border-radius: 10px;
          padding: 20px;
          margin: 10px 0 0 0;
        ">
        <div style="
            font-family: 'NotoSansKR-Medium';
            display: flex;
            justify-content: space-between;
          ">
          <div>저수율 조회 결과</div>
        </div>
        <apexchart ref="rate" type="line" height="290" :options="rateHistoryChartOptions" :series="rateHistorySeries">
        </apexchart>
      </div>
      <div id="elmHistory" style="
          margin: 20px 0 0 0;
          border: 1px solid #e9e9e9;
          border-radius: 10px;
          padding: 20px;
        ">
        <div style="
            font-family: 'NotoSansKR-Medium';
            display: flex;
            justify-content: space-between;
          ">
          <div>수위 조회 결과</div>
        </div>
        <apexchart ref="elm" type="line" height="290" :options="elmHistoryChartOptions" :series="elmHistorySeries">
        </apexchart>
      </div>
    </div>

    <el-dialog v-model="showDialog" width="1000">
      <template #header>
        <div style="font-family: 'NotoSansKR-Medium';">
          표 데이터
        </div>
      </template>
      <div>
        <el-table border :data="tableData" stripe height="600" style="font-family: 'NotoSansKR-Regular'">
          <el-table-column prop="date" label="일자"></el-table-column>
          <el-table-column prop="predictRate" label="예측저수율(%)"></el-table-column>
          <el-table-column prop="realRate" label="실측저수율(%)"></el-table-column>
          <el-table-column prop="predictElm" label="예측저수위(El.m)"></el-table-column>
          <el-table-column prop="realElm" label="실측저수위(El.m)"></el-table-column>
          <el-table-column prop="rainfall" label="강수량(mm)"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BreadcrumbComponent from "../common/BreadcrumbComponent.vue";
import reservoirList from "../../modules/hard_data/reservoir.json";
import VueApexCharts from "vue3-apexcharts";
import moment from "moment";

import { mapGetters } from "vuex";

export default {
  name: "TrendContainer",
  components: {
    BreadcrumbComponent,
    apexchart: VueApexCharts,
  },
  data() {
    return {
      reservoirList,
      selectedReservoir: "",
      showDialog: false,
      dialogTitle: '',

      rateHistoryChartOptions: {
        chart: {
          height: 350,
          type: "line",
          id: "rateHistory",
          toolbar: {
            show: false
          },
        },
        toolbar: {
          show: false
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
        grid: {
          padding: {
            right: 30,
            left: 20,
          },
        },
        // labels: [],
        xaxis: {
          tickAmount: 2,
          tickPlacement: "between",
          categories: [],
          labels: {
            show: true,
            rotate: 0,
            // rotateAlways: true,
            // // tickAmount: 10
            // // maxHeight: 200
            // style: {
            //   fontSize: "12px",
            // },
          }
        },
        yaxis: {
          min: 0,
          max: 110,
        }
      },
      rateHistorySeries: [
        {
          name: '예측 저수율(%)',
          data: []
        },
        {
          name: '실측 저수율(%)',
          data: []
        },
      ],

      elmHistoryChartOptions: {
        chart: {
          height: 350,
          type: "line",
          id: "elmHistory",
          toolbar: {
            show: false
          },
        },
        tooltip: {
          y: {
            // formatter: (value) => {
            //   console.log('-1', value)
            // },
            title: {
              formatter: (seriesname) => {
                console.log('seriesname', seriesname)
              }
            }
          }
        },
        annotations: {
        },
        dataLabels: {
          enabled: false,
          enabledOnSeries: [1],
        },
        stroke: {
          curve: "straight",
          width: 1,
        },
        grid: {
          padding: {
            right: 30,
            left: 20,
          },
        },
        xaxis: {
          tickAmount: 2,
          tickPlacement: "between",
          categories: [],
          labels: {
            show: true,
            rotate: 0,
            // rotateAlways: true,
            // // tickAmount: 10
            // // maxHeight: 200
            // style: {
            //   fontSize: "12px",
            // },
          }
        },
        yaxis: [
          {
            title: {
              text: "예측수위(El.m)",
            },
            min: 0,
            max: 100,
          },
          {
            title: {
              text: "실측수위(El.m)",
            },
            min: 0,
            max: 100,
          },
          {
            opposite: true,
            title: {
              text: "강수량(mm)",
            },
            min: 0,
            max: 200,
          },
        ],
      },
      elmHistorySeries: [
        {
          name: "저수위(El.m)",
          data: [],
        },
        {
          name: "강수량(mm)",
          data: [],
        },
      ],
      selectedDateRange: undefined,
      fullElm: 0,
      overElm: 0,

      tableData: []
    };
  },

  mounted() {
    this.selectedReservoir = this.getReservoirInfo.reservoirName;
    this.selectedDateRange = [
      moment().subtract(7, "days").format("YYYY-MM-DD"),
      moment().format("YYYY-MM-DD"),
    ];
  },

  methods: {
    search() {
      let params = {
        reservoirId: this.getReservoirInfo.reservoirId,
        startDate: moment(this.selectedDateRange[0]).format('YYYY-MM-DD 00:00:00'),
        endDate: moment(this.selectedDateRange[1]).format('YYYY-MM-DD 00:00:00')
      }

      this.tableData = []

      this.$axios.get('http://192.168.0.73:3000/search', { params }).then(response => {

        console.log(response)

        if (response.data.length > 0) {

          let rateHistorySet = [], ratePredictSet = [], rateTimeline = []
          let elmHistorySet = [], elmPredictSet = [], rainRate = []

          response.data.forEach(d => {

            this.reservoirList.forEach(reservoir => {
              if (d.reservoir_ID == reservoir.reservoirId) {
                this.fullElm = reservoir.fullElm
                this.overElm = reservoir.overflowElm
              }

            })

            rateHistorySet.push(d.rate)
            ratePredictSet.push(d.y_rate)
            rateTimeline.push(d.date)
            elmHistorySet.push(d.y_elm)
            elmPredictSet.push(d.elm)
            rainRate.push(d.rainfall)

            this.tableData.push({
              date: d.date,
              predictRate: d.rate,
              realRate: d.y_rate,
              predictElm: d.elm,
              realElm: d.y_elm,
              rainfall: d.rainfall
            })
          })

          this.$refs.rate.updateOptions({
            xaxis: {
              categories: rateTimeline
            }
          })

          this.$refs.rate.updateSeries([
            {
              name: '예측 저수율(%)',
              data: ratePredictSet
            },
            {
              name: '실측 저수율(%)',
              data: rateHistorySet
            },
          ])

          this.$refs.elm.updateOptions({
            xaxis: {
              categories: rateTimeline
            },
            annotations: {
              yaxis: [
                {
                  y: this.fullElm,
                  borderColor: 'darkgreen',
                  label: {
                    borderColor: 'darkgreen',
                    style: {
                      color: '#fff',
                      background: 'darkgreen'
                    },
                    text: '만수위(El.m)'
                  }
                },
                {
                  y: this.overElm,
                  borderColor: 'purple',
                  label: {
                    borderColor: 'purple',
                    style: {
                      color: '#fff',
                      background: 'purple'
                    },
                    text: '홍수위(El.m)'
                  }
                }
              ]
            }
          })

          this.$refs.elm.updateSeries([

            {
              name: '예측수위(El.m)',
              type: 'line',
              data: elmPredictSet
            },
            {
              name: '실측수위(El.m)',
              type: 'line',
              data: elmHistorySet
            },
            {
              name: '강수량(mm)',
              type: 'column',
              data: rainRate
            },
          ])
        }
      })
    },

    openModal() {
      this.showDialog = true
      this.dialogTitle = '저수위 조회 결과'
    },

    selectReservoir(value) {

      let reservoirObj = {}
      this.reservoirList.forEach(reservoir => {
        if (reservoir.reservoirName == value) {
          reservoirObj = reservoir
        }
      })

      this.$store.commit('reservoir/SET_RESERVOIR_INFO', reservoirObj)
    },

    checkPeriod() {
      let diff = 0;

      let startDay = moment([
        parseInt(moment(this.selectedDateRange[0]).format("YYYY")),
        parseInt(moment(this.selectedDateRange[0]).format("MM")),
        parseInt(moment(this.selectedDateRange[0]).format("DD")),
      ]);

      let endDay = moment([
        parseInt(moment(this.selectedDateRange[1]).format("YYYY")),
        parseInt(moment(this.selectedDateRange[1]).format("MM")),
        parseInt(moment(this.selectedDateRange[1]).format("DD")),
      ]);

      diff = endDay.diff(startDay, "days");

      let todayOverDiff = endDay.diff(
        [moment().format("YYYY"), moment().format("MM"), moment().format("DD")],
        "days"
      );

      if (diff > 7) {
        this.selectedDateRange = [
          moment().subtract(7, "days").format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD"),
        ];
        alert("최대 7일까지 선택 가능합니다.");
      }

      if (todayOverDiff > 0) {
        alert(`금일(${moment().format("YYYY. MM. DD.")}까지 선택 가능합니다.)`);
        this.selectedDateRange = [
          moment().subtract(7, "days").format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD"),
        ];
      }
    },
  },

  computed: {
    ...mapGetters({
      getReservoirInfo: "reservoir/GET_RESERVOIR_INFO",
    }),
  },
};
</script>
