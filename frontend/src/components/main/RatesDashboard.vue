<template>
  <div :class="collapseClass">
    <!-- top-tox-container-rate-show-more -->
    <div style="
        height: 25px;
        display: flex;
        font-size: 15px;
        justify-content: space-between;
        font-family: 'NotoSansKR-Medium';
        border-bottom: 1px solid lightgray;
        align-items: center;
      ">
      <div>{{ title }}</div>
      <div>
        <el-tooltip effect="dark" content=" 전체 리스트 보기">
          <el-icon class="mouse-hover" style="margin: 0 10px 0 0" @click="openDialog('all')">
            <More />
          </el-icon>
        </el-tooltip>
        <el-icon v-if="collapse === false" class="mouse-hover" @click="closeTab">
          <ArrowUpBold />
        </el-icon>
        <el-icon v-else class="mouse-hover" @click="closeTab">
          <ArrowDownBold />
        </el-icon>
      </div>
    </div>
    <div>
      <div v-show="collapse === false">
        <div class="rate-item-container" :class="showMore === true ? 'rate-item-container-show-more' : ''">
          <!-- <div class="rate-item-container-show-more"> -->

          <div v-if="getReservoirItem.length > 0">
            <div v-for="reservoir in getReservoirItem" :key="reservoir.id" :class="reservoir.className"
              class="mouse-hover rate-item-title-off" @click="
                openReservoirDetail(
                  'reservoir',
                  reservoir.reservoirId,
                  reservoir.currentWaterRate,
                  reservoir
                )
                ">
              <span>
                {{ reservoir.reservoirName }}
              </span>
            </div>
          </div>
          <div v-else>
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'NotoSansKR-Regular';
                color: darkgrey;
                font-size: 11px;
                margin: 20px;
              ">
              데이터 없음
            </div>
          </div>
        </div>
        <div class="mouse-hover" style="
            font-family: 'NotoSansKR-Regular';
            font-size: 14px;
            text-align: center;
            color: #aaa;
          " @click="toggleShowMore()">
          {{ this.showMore === false ? "더보기" : "닫기" }}
        </div>
      </div>
    </div>
  </div>

  <el-dialog v-model="showDialog" style="
      z-index: 9000;
      width: 1400px;
      height: 580px;
      background-color: #fff;
      border-radius: 8px;
    " center align-center draggable @close="closeDialog" :show-close="true">
    <template #header>
      <div style="
          margin: 0;
          padding: 0;
          font-family: 'NotoSansKR-Medium';
          font-size: 20px;
        ">
        {{ title }} 저수율 목록
      </div>
    </template>

    <el-table stripe :data="reservoirListLocal" border height="400" style="width: 1350px"
      :header-cell-class-name="setHeaderClass">
      <el-table-column label="#" width="50" sortable align="center" type="index"></el-table-column>
      <el-table-column label="저수지명" width="125" sortable align="center" prop="reservoirName"></el-table-column>
      <el-table-column label="표준코드" width="110" align="center" prop="reservoirId"></el-table-column>
      <el-table-column label="위치" width="270" prop="address"></el-table-column>
      <el-table-column label="본부" align="center" width="80" prop="bonbu"></el-table-column>
      <el-table-column label="지사" align="center" width="100" prop="jisa"></el-table-column>
      <el-table-column label="준공일자" width="100" align="center" prop="builtYear"></el-table-column>
      <el-table-column label="기상 관측소" width="100" align="center" prop="observatory"></el-table-column>
      <el-table-column sortable label="현재 저수율" width="125" align="center" prop="currentWaterRate">
        <template #default="scope">
          <div>{{ scope.row.currentWaterRate }}%</div>
        </template>
      </el-table-column>
      <el-table-column sortable label="유효 저수량" width="125" align="center" prop="currentWaterRate">
        <template #default="scope">
          <div>{{ scope.row.usableWaterAmount }} (천m3)</div>
        </template>
      </el-table-column>
      <el-table-column label="예측 저수율 확인" prop="registerId" align="center">
        <template #default="scope">
          <el-button @click="changeRoute('/predict', scope.row)" color="#0d4ba9">저수율 확인</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div style="display: flex; justify-content: flex-end">
        <el-button color="#0d4ba9" @click="showDialog = false">확인</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "RatesDashboard",

  components: {},

  props: {
    title: {
      type: String,
      default() {
        return "";
      },
    },

    collapseClass: {
      type: String,
      default() {
        return "";
      },
    },

    collapse: {
      type: Boolean,
      default() {
        return false;
      },
    },

    index: {
      type: String,
      default() {
        return "";
      },
    },

    reservoirList: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
      showMore: false,
      isContainerOpen: true,
      showDialog: false,
      tableData: [],
      reservoirListLocal: [],
      currentId: null,
    };
  },

  mounted() {
    this.reservoirListLocal = this.reservoirList;

  },

  methods: {
    setHeaderClass(data) {
      let className = "";

      if (data.rowIndex === 0) {
        className = "default-header-class";
      }
      return className;
    },

    changeRoute(path, reservoir) {
      this.$router.push(path);
      // console.log("------!@#", path, reservoir);
      this.$store.commit("map/SET_CENTER_LATLNG", reservoir.latlng);
      this.$store.commit("reservoir/SET_RESERVOIR_INFO", reservoir);
    },

    openDialog(type, id, rate, reservoirInfo) {
      if (type === "all") {
        this.showDialog = true;
      } else {
        this.showDialog = true;

        for (let i = 0; i < this.reservoirListLocal.length; i++) {
          if (this.reservoirListLocal[i].reservoirId == id) {
            if (rate > 50 && rate <= 80) {
              this.reservoirListLocal[i].className = "rate-item-title-on-80";
            } else if (rate > 30 && rate <= 50) {
              this.reservoirListLocal[i].className = "rate-item-title-on-50";
            } else if (rate <= 30) {
              this.reservoirListLocal[i].className = "rate-item-title-on-30";
            }
          }
        }

        let latlng = reservoirInfo.latlng;
        this.$emit("set-map-center", latlng);
      }
    },

    openReservoirDetail(type, id, rate, reservoirInfo) {
      if (type === "all") {
        // this.showDialog = true;
        console.log("-all");
      } else {
        // this.showDialog = true;

        for (let i = 0; i < this.reservoirListLocal.length; i++) {
          if (this.reservoirListLocal[i].reservoirId == id) {
            if (rate > 50 && rate <= 80) {
              this.reservoirListLocal[i].className = "rate-item-title-on-80";
            } else if (rate > 30 && rate <= 50) {
              this.reservoirListLocal[i].className = "rate-item-title-on-50";
            } else if (rate <= 30) {
              this.reservoirListLocal[i].className = "rate-item-title-on-30";
            }
          }
        }

        let latlng = reservoirInfo.latlng;
        this.$emit("set-map-center", latlng);
      }

      this.$emit("open-reservoir-detail", reservoirInfo);
    },

    closeTab() {
      let props = {
        index: this.index,
        collapse: this.collapse,
      };

      this.$emit("close-tab", props);
    },

    toggleShowMore() {
      if (this.showMore === true) {
        this.showMore = false;
      } else {
        this.showMore = true;
      }

      let payload = {
        showMore: this.showMore,
        index: this.index,
      };
      this.$emit("show-more", payload);
    },
  },

  computed: {
    getReservoirItem() {
      console.log("++++++++++++++++++++++++++++");
      return this.reservoirListLocal;
    },
  },
};
</script>

<style>
.top-rates {
  background-color: #fff;
  padding: 5px 10px 10px 10px;
}

.arrow-up-icon:hover {
  cursor: pointer;
}

.mouse-hover:hover {
  cursor: pointer;
}

.top-box-container-rate {
  padding: 5px 10px 10px 10px;
  width: 180px;
  height: 120px;
  background-color: #fff;
  border-radius: 0px 0px 15px 15px;

  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  margin: 0 0 0 20px;
}

.top-tox-container-rate-show-more {
  height: 300px;
}

.top-box-container-collapse {
  padding: 5px 10px 10px 10px;
  width: 180px;
  height: 30px;
  background-color: #fff;
  border-radius: 0px 0px 15px 15px;

  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  margin: 0 0 0 20px;
}

.rate-item-container {
  overflow-y: auto;
  overflow-x: hidden;
  height: 80px;
}

.rate-item-container-show-more {
  height: 260px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* .rate-item-container-show-more {
  overflow-y: auto;
  overflow-x: hidden;
  height: 150px;
  background-color: #fff;
} */

.rate-item-container::-webkit-scrollbar {
  width: 7px;
}

.rate-item-container::-webkit-scrollbar-thumb {
  background-color: #2f3542;
  border-radius: 10px;
}

.rate-item-container::-webkit-scrollbar-track {
  background-color: grey;
  border-radius: 10px;
  box-shadow: inset 0px 0px 5px white;
}

.rate-item-title-off {
  width: 170px;
  height: 12px;
  margin: 5px 0 0 0;
  flex-shrink: 0;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  font-size: 13px;
  font-family: "NotoSansKR-Regular";
  color: #9fa0a1;
}

.rate-item-title-off {
  background: #edf2f9;
}

.rate-item-title-on-80 {
  background-color: #f0981c !important;
  color: #fff;
}

.rate-item-title-on-50 {
  background-color: #e6eb03 !important;
  color: #555555;
}

.rate-item-title-on-30 {
  background-color: #e40303 !important;
  color: #fff;
}

.el-table .rate-row-header {
  --el-table-tr-bg-color: lightblue;
}

.default-header-class {
  background-color: #f5f7fa !important;
}
</style>
