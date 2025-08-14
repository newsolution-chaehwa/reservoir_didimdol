<template>
  <div class="top-box-container top-box-total">
    <div
      style="display: flex; align-items: center"
      v-if="isAllNull === false"
      class="top-bar-background"
    >
      <div
        class="top-rate-over-80-bar"
        :style="setBarWidth(0, over80Count.length)"
        v-show="over80Count.length > 0"
      >
        {{ over80Count.length }}
      </div>
      <div
        class="top-rate-80-bar"
        :style="setBarWidth(1, below80Count.length)"
        v-show="below80Count.length > 0"
      >
        {{ below80Count.length }}
      </div>
      <div
        class="top-rate-50-bar"
        :style="setBarWidth(2, below50Count.length)"
        v-show="below50Count.length > 0"
      >
        {{ below50Count.length }}
      </div>
      <div
        class="top-rate-30-bar"
        :style="setBarWidth(3, below30Count.length)"
        v-show="below30Count.length > 0"
      >
        {{ below30Count.length }}
      </div>
    </div>
    <div
      v-else
      style="
        width: 170px;
        background-color: darkgrey;
        padding: 0 10px 0 0;
        font-size: 10px;
        font-family: 'NotoSansKR-Regulars';
        height: 12px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        display: flex;
        justify-content: center;
      "
    >
      데이터 없음
    </div>
    <div class="top-rate-total-count-bar">
      {{ totalCount }}
    </div>
    <!-- bottom list -->
    <div style="border-top: 1px dashed #284063; margin: 5px 0 0 0">
      <div class="top-box-row-font" style="margin: 5px 0 0 0">
        <div class="top-box-row-container">
          <div class="top-box-row-container">
            <div class="top-box-row-circle" style="background-color: #"></div>
            전체 (저수율)
          </div>
          <div>{{ totalCount }}</div>
        </div>
      </div>
      <div class="top-box-row-font">
        <div class="top-box-row-container">
          <div class="top-box-row-container">
            <div
              class="top-box-row-circle"
              style="background-color: #f0981c"
            ></div>
            80% 이하
          </div>
          <div>{{ below80Count.length }}</div>
        </div>
      </div>
      <div class="top-box-row-font">
        <div class="top-box-row-container">
          <div class="top-box-row-container">
            <div
              class="top-box-row-circle"
              style="background-color: #e6eb03"
            ></div>
            50% 이하
          </div>
          <div>{{ below50Count.length }}</div>
        </div>
      </div>
      <div class="top-box-row-font">
        <div class="top-box-row-container">
          <div class="top-box-row-container">
            <div
              class="top-box-row-circle"
              style="background-color: #e40303"
            ></div>
            30% 이하
          </div>
          <div>{{ below30Count.length }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TotalDashboard",

  props: {
    totalCount: {
      type: Number,
      default() {
        return 0;
      },
    },

    below80Count: {
      type: Array,
      default() {
        return [];
      },
    },

    below50Count: {
      type: Array,
      default() {
        return [];
      },
    },

    below30Count: {
      type: Array,
      default() {
        return [];
      },
    },

    over80Count: {
      type: Array,
      defualt() {
        return [];
      },
    },

    isAllNull: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },

  data() {
    return {
      list: [],
    };
  },

  mounted() {},

  methods: {
    setBarWidth(order, width) {
      let style = "";
      let barWidth = (width / this.totalCount) * 100;

      style += `width: ${barWidth}%; height: 10px; `;

      return style;
    },
  },
};
</script>

<style>
.top-bar-background {
  width: 180px;
  height: 10px;
  background-color: darkgrey;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.top-box-container {
  padding: 5px 10px 10px 10px;
  width: 180px;
  height: 120px;
  background-color: #fff;
  border-radius: 0px 0px 15px 15px;
  background-color: lightskyblue;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  margin: 0 0 0 20px;
}

.top-box-total {
  background: #212a5d;
}

.top-box-row-font {
  font-size: 13px;
  font-family: "NotoSansKR-Regular";
  color: #fff;
  height: 22px;
}

.top-box-row-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.top-box-row-circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #fff;
  margin: 0 5px 0 0;
}

.top-rate-over-80-bar {
  width: 180px;
  height: 12px;
  border-top-left-radius: 10px;
  background-color: #5be11c;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 10px;
  font-family: "NotoSansKR-Medium";
  padding: 0 10px 0 0;
  line-height: 12px;
}

.top-rate-80-bar {
  width: 180px;
  height: 12px;
  background-color: #f0981c;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 10px;
  font-family: "NotoSansKR-Medium";
  padding: 0 10px 0 0;
  line-height: 12px;
}

.top-rate-50-bar {
  width: 180px;
  height: 12px;
  background-color: #e6eb03;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 10px;
  font-family: "NotoSansKR-Medium";
  padding: 0 10px 0 0;
}

.top-rate-30-bar {
  width: 180px;
  height: 12px;
  background-color: #e40303;
  border-top-right-radius: 10px;
  display: flex;
  justify-content: flex-end;
  font-size: 10px;
  font-family: "NotoSansKR-Medium";
  align-items: center;
  padding: 0 10px 0 0;
}

.top-rate-total-count-bar {
  width: 170px;
  height: 12px;
  background-color: #5be11c;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  font-size: 10px;
  font-family: "NotoSansKR-Medium";
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 10px 0 0;
}
</style>
