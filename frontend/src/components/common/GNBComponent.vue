<template>
  <div style="background-image: linear-gradient(#0d4ba9, #212a5d); height: 100vh">
    <div style="position: relative; height: 100%; width: 60px">
      <el-tooltip content="메인" placement="right">
        <div class="mouse-hover gnb-icon-hover gnb-menu-button" @click="changeRoute('main')"
          :class="setOnMenuClassName('/main')">
          <el-icon>
            <HomeFilled />
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="예측" placement="right">
        <div class="mouse-hover gnb-icon-hover gnb-menu-button-container" @click="changeRoute('predict')"
          :class="setOnMenuClassName('/predict')">
          <el-icon><predict-icon></predict-icon></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="과거조회" placement="right">
        <div class="mouse-hover gnb-icon-hover gnb-menu-button-container" @click="changeRoute('trend')"
          :class="setOnMenuClassName('/trend')">
          <el-icon>
            <trend-icon></trend-icon>
          </el-icon>
        </div>
      </el-tooltip>

      <el-tooltip content="SPI지수" placement="right">
        <div :class="setOnMenuClassName('/spi')" class="mouse-hover gnb-icon-hover gnb-menu-button-container"
          @click="changeRoute('spi')" style="font-size: 20px">
          SPI
        </div>
      </el-tooltip>
      <div style="display: flex">
        <div style="width: 80px" @mouseenter="toggleSubMenu('calendar')">
          <div :class="calendarClassName" class="mouse-hover gnb-icon-hover gnb-menu-button-container"
            @click="changeRoute('/calendar')" style="font-size: 25px">
            <el-icon>
              <Calendar />
            </el-icon>
          </div>
        </div>
        <div @mouseleave="toggleSubMenu('calendar')" v-show="showCalendarSubMenu" class="sub-menu-container">
          <div :class="calendarAdminClassName" @click="changeRoute('calendar')" class="sub-menu sub-menu-first">
            일정관리
          </div>
          <!-- <div :class="calendarRequestClassName" 
          class="sub-menu sub-menu-middle"
          @click="changeRoute('calendar-request')">
            요청이력
          </div> -->
          <div @click="changeRoute('calendar-history')" class="sub-menu sub-menu-last"
            :class="calendarHistoryClassName">
            수문개방
            <br />
            이력
          </div>
        </div>
      </div>
      <div class="gnb-setting-icon-container" @click="changeRoute('login')">
        <el-icon class="gnb-setting-mouse-over">
          <Setting />
        </el-icon>
      </div>

      <el-dialog v-model="showErrorDialog" :show-close="true" center align-center style="width: 400px">
        <template #header="{ titleId, titleClass }">
          <div :id="titleId" :class="titleClass">
            <div class="warning-header">
              <el-icon style="margin: 0 5px 0 0; color: #000">
                <WarningFilled />
              </el-icon>
              알림
            </div>
          </div>
        </template>

        <div style="
            font-size: 15px;
            font-family: 'NotoSansKR-Regular';
            text-align: center;
          ">
          예측 데이터 확인을 위한 저수지를 먼저 선택해주세요.
        </div>
        <template #footer>
          <div style="display: flex; justify-content: flex-end">
            <el-button color="#0d4ba9" @click="showErrorDialog = false">확인</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import TrendIcon from "@/components/common/icons/TrendIcon.vue";
import PredictIcon from "@/components/common/icons/PredictIcon.vue";

export default {
  name: "GNBComponent",

  components: {
    TrendIcon,
    PredictIcon,
  },

  data() {
    return {
      calendarAdminClassName: "",
      calendarHistoryClassName: "",
      calendarRequestClassName: '',
      showErrorDialog: false,
      spiOnClassName: "",
      predictOnClassName: "",

      showCalendarSubMenu: false,
      calendarClassName: "",

      mainClassName: "",
    };
  },

  methods: {
    changeRoute(path) {
      this.calendarClassName = "";

      this.$router.push({
        name: path,
      });
    },

    setOnMenuClassName(name) {
      let className = "";
      let path = this.$router.currentRoute.value.path;

      if (path === name) {
        className = "menu-on";
      } else {
        className = "";
      }

      if (path === "/calendar/history" || path === "/calendar") {
        this.calendarClassName = "menu-on";
        if (path === "/calendar") {
          this.calendarAdminClassName = "sub-menu-on";
          this.calendarHistoryClassName = "";
        } else if (path === "/calendar/history") {
          this.calendarAdminClassName = "";
          this.calendarHistoryClassName = "sub-menu-on";
        }
      } else {
        this.calendarClassName = "";
        this.calendarAdminClassName = "";
        this.calendarHistoryClassName = "";
      }

      return className;
    },

    toggleSubMenu(menu) {
      switch (menu) {
        case "calendar":
          if (this.showCalendarSubMenu === false) {
            this.showCalendarSubMenu = true;
          } else {
            this.showCalendarSubMenu = false;
          }
          break;
      }
    },
  },
  computed: {
    getRouter() {
      return this.$router;
    },
  },
};
</script>

<style>
.gnb-icon-hover:hover {
  color: #fff;
}

.gnb-menu-button-container {
  height: 60px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  border-bottom: 1px solid black;
  font-family: "NotoSansKR-Regular";
}

.sub-menu:hover {
  cursor: pointer;
  background-color: #f4f4f4;
  /* border-radius: 15px; */
  font-family: "NotoSansKR-Medium";
}

.sub-menu:nth-child(1):hover {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.sub-menu:nth-child(3):hover {
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.sub-menu-container {
  position: absolute;
  width: 60px;
  z-index: 9999;
  padding: 0 0 0 80px;
  font-family: "NotoSansKR-Regular";
  font-size: 12px;
  color: #575757;
}

.menu-on {
  color: #fff;
}

.sub-menu-middle {
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  border: 1px solid #aaa;
  border-top: none;
  background-color: #fff;
}

.sub-menu-first {
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  border: 1px solid #aaa;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  background-color: #fff;
}


.sub-menu-last {
  width: 60px;
  height: 60px;
  border-top: 1px solid #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
  border: 1px solid #aaa;
  border-top: 0px;
  background-color: #fff;
}

.gnb-setting-icon-container {
  position: absolute;
  bottom: 0;
  height: 60px;
  width: 60px;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gnb-setting-mouse-over {
  color: #a3a3a3;
}

.gnb-setting-mouse-over:hover {
  color: #fff;
  cursor: pointer;
}

.gnb-menu-button {
  height: 60px;
  width: 60px;
  font-size: 30px;
  background: #13a8a6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sub-menu-on {
  background-color: #f4f4f4;
  text-decoration: underline;
}
</style>
