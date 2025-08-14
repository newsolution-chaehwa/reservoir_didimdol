<template>
  <div class="reservoir-info-container">
    <div
      class="reservoir-info-content-title"
      style="display: flex; align-items: center"
    >
      <div>기본 정보</div>
    </div>
    <div style="border: 2px solid #f4f4f4; margin: 5px 0 0 0">
      <div
        v-for="info in reservoirInfoArray"
        :key="info.title"
        class="reservoir-info-items"
        style="
          padding: 5px;
          display: flex;
          justify-content: space-between;
          font-size: 15px;
        "
      >
        <div
          style="
            padding: 0 0 0 5px;
            display: flex;
            font-family: 'NotoSansKR-Medium';
          "
        >
          <!-- <el-icon style="padding: 0 3px 0 0"><Check /></el-icon> -->
          {{ info.title }}
        </div>
        <div
          style="
            /* padding: 0 0 0 40px; */
            font-family: 'NotoSansKR-Regular';
            color: #929292;
          "
        >
          {{ info.value }}
        </div>
      </div>
    </div>

    <div
      class="reservoir-info-content-title"
      style="
        margin: 40px 0 0 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
      "
    >
      <div>수위 정보</div>
      <div style="font-size: 14px">단위(elm)</div>
    </div>
    <div
      style="display: flex; justify-content: space-between; margin: 5px 0 0 0"
    >
      <div
        v-for="elmItem in elmArrays"
        :key="elmItem.title"
        style="
          padding: 5px;
          font-size: 15px;
          text-align: center;
          width: 30%;
          border: 2px solid #f4f4f4;
        "
        class="reservoir-info-items"
      >
        <div style="padding: 0 0 0 5px; font-family: 'NotoSansKR-Medium'">
          {{ elmItem.title }}
        </div>
        <div style="font-family: 'NotoSansKR-Regular'; color: #929292">
          {{ elmItem.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReservoirInfo",

  props: {
    info: {
      Type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      reservoirInfoArray: [],
      itemKeys: [
        "저수지명",
        "표준코드",
        "유효 저수량(천m3)",
        "위치",
        "본부 & 지사",
        "준공일자",
        "기상 관측소",
      ],

      elmItems: ["만수위", "사수위", "홍수위"],
      elmArrays: [],
    };
  },

  mounted() {
    this.updateData();
  },

  methods: {
    updateData() {
      let values = [],
        elmValues = [];

      let bonbuJisa = this.info.bonbu + " " + this.info.jisa;

      values = [
        this.info.reservoirName,
        this.info.reservoirId,
        this.info.usableWaterAmount,
        this.info.address,
        bonbuJisa,
        this.info.builtYear,
        this.info.observatory,
      ];

      this.reservoirInfoArray = [];
      this.elmArrays = [];

      elmValues = [this.info.fullElm, this.info.deadElm, this.info.overflowElm];

      for (let i = 0; i < this.itemKeys.length; i++) {
        this.reservoirInfoArray.push({
          title: this.itemKeys[i],
          value: values[i],
        });
      }

      for (let i = 0; i < elmValues.length; i++) {
        this.elmArrays.push({
          title: this.elmItems[i],
          value: elmValues[i],
        });
      }
    },
  },

  computed: {
    getInfo() {
      return this.info;
    },
  },

  watch: {
    getInfo(newValue, oldValue) {
      console.log("newValue", newValue, oldValue);
      this.updateData();
    },
  },
};
</script>

<style>
.reservoir-info-container {
  width: 50%;
  padding: 0 10px 0 0;
}

.reservoir-info-item-set {
  align-items: center;
  display: flex;
  /* padding: 0 0 0 10px; */
}

.reservoir-info-item-set > div {
  height: 25px;
  line-height: 25px;
}

.reservoir-info-item-set:nth-child(odd) {
  background-color: #f4f4f4;
}

.reservoir-info-item-container > div:nth-child(odd) {
  /* background-color: #f4f4f4; */
}

.reservoir-info-item-container > div {
  /* height: 25px; */
}

.reservoir-info-item-title {
  width: 120px;
  padding: 0 0 0 5px;
  /* background-color: lightblue; */
}

.reservoir-info-content-title {
  font-size: 18px;
  font-family: "NotoSansKR-Medium";
}

.reservoir-info-elevation-level {
  /* width: 300px; */
  display: flex;
  height: 90px;
  text-align: center;
  justify-content: space-between;
  background-color: lightgrey;
  align-items: center;
}

.reservoir-info-elevation-level > div {
  width: 50%;
  height: 100%;
}

.reservoir-info-elevation-level > div:nth-child(2) > div {
  width: 100%;
  height: 30px;
  align-items: center;
  display: flex;
}

.reservoir-info-elevation-level > div:nth-child(2) > div > div:nth-child(2) {
  width: 50%;
}

.reservoir-info-elevation-level > div > div {
  width: 100px;
  font-family: "NotoSansKR-Regular";
  font-size: 16px;
}

.elm-title {
  font-family: "NotoSansKR-Regular";
}

.reservoir-info-items:nth-child(odd) {
  background-color: #f4f4f4;
}

.reservoir-info-items:nth-child(even) {
  /* background-color: lightblue; */
}
</style>
