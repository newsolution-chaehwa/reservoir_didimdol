<template>
  <div style="
      position: absolute;
      margin: 0 0 0 1250px;
      width: 280px;
      justify-content: space-between;
      background-color: #fff;
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
      padding: 10px;
      /* height: 115px; */
    " :style="collapse
        ? 'height: 25px'
        : isOpen
          ? 'height: 280px; padding: 10px 10xp 30px 10px'
          : 'height: 115px'
      ">
    <div style="
        font-size: 14px;
        font-family: 'NotoSansKR-Medium';
        border-bottom: 1px solid lightgray;
        display: flex;
        justify-content: space-between;
      ">
      <div>기상정보(최대 10일)</div>
      <div>
        <div>
          <el-icon v-if="collapse === false" class="mouse-hover" @click="toggleTab()">
            <ArrowUpBold />
          </el-icon>
          <el-icon v-else class="mouse-hover" @click="toggleTab()">
            <ArrowDownBold />
          </el-icon>
        </div>
      </div>
    </div>
    <div v-show="collapse === false" class="weather-container" style="
        height: calc(100% - 20px);
        overflow: scroll;
        overflow-y: auto;
        overflow-x: hidden;
      " :style="isOpen ? 'height: 245px' : 'height: 80px'">
      <div class="weather-data" style="
          margin: 5px 0 0 0;
          font-family: 'NotoSansKR-Regular';
          font-size: 14px;
        " v-for="weatherInfo in weatherInfoList" :key="weatherInfo.date">
        <div style="font-family: 'NotoSansKR-Regular'; font-size: 13px">
          <span style="">
            {{ weatherInfo.date }}
            <img src="@/assets/icon/sun.png" alt="" style="height: 15px; width: 15px" />
          </span>
          <span style="margin: 0 0 0 15px; color: #7294eb">
            {{ weatherInfo.min }}°
          </span>
          <span style="color: #aaa"> / </span>
          <span style="color: red; font-weight: 200">
            {{ weatherInfo.max }}°
          </span>
          <span style="margin: 0 0 0 15px">
            {{ weatherInfo.rain }}
          </span>
          <span style="font-size: 10px"> mm</span>
          <span style="color: #aaa"> / </span>
          <span style="color: #7294eb">
            {{ weatherInfo.rainPercent }}
          </span>
          <span style="font-size: 10px"> % </span>
        </div>
      </div>
    </div>
    <div v-show="collapse === false" style="
        height: 20px;
        font-family: 'NotoSansKR-Regular';
        font-size: 14px;
        text-align: center;
        color: #aaa;
      " class="mouse-hover" @click="toggleShowMore()">
      <span v-if="isOpen === false"> 더보기 </span>
      <span v-if="isOpen === true">닫기</span>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "WeatherContainer",

  data() {
    return {
      // date: 날짜, rain: 강우량, min: 최저기온, max: 최고기온, rainPercent: 강수확률
      weatherInfoList: [{ date: "", rain: 0, min: 0, max: 0, rainPercent: 0 }],
      isOpen: false,
      collapse: false,
    };
  },

  mounted() {
    this.initWeatherInfoList();
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

    toggleShowMore() {
      this.isOpen = !this.isOpen;
    },

    toggleTab() {
      this.collapse = !this.collapse;
    },
  },
};
</script>

<style>
.weather-container::-webkit-scrollbar-track {
  background-color: grey;
  border-radius: 10px;
  box-shadow: inset 0px 0px 5px white;
}

.weather-container::-webkit-scrollbar-thumb {
  background-color: #2f3542;
  border-radius: 10px;
}

.weather-container::-webkit-scrollbar {
  width: 7px;
}

.weather-data:nth-child(even) {
  background-color: #f4f4f4;
}
</style>
