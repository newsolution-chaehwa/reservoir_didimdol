<template>
  <div
    style="margin: 20px 0 0 0; font-family: 'NotoSansKR-Regular'; display: flex"
  >
    <div
      v-for="(path, pathIndex) in breadcrumbPath"
      :key="pathIndex + '_path'"
      style="display: flex; align-items: center"
    >
      <div>
        {{ path.title }}
      </div>
      <div v-show="breadcrumbPath.length > 1 && pathIndex % 2 === 0">
        <el-icon><ArrowRight /></el-icon>
      </div>
    </div>
    <!-- {{ breadcrumbPath }} -->
  </div>
  <div style="font-size: 30px; font-family: 'NotoSansKR-Medium'">
    <span v-if="!isCalendar">
      {{ getReservoirInfo.reservoirName }}
    </span>
    <span>
      {{ breadcrumbTitle }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "BreadcrumbComponent",

  data() {
    return { currentRoute: "" };
  },

  props: {
    breadcrumbPath: {
      type: Array,
      default() {
        return [];
      },
    },

    breadcrumbTitle: {
      type: String,
      default() {
        return "";
      },
    },

    isCalendar: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },

  updated() {
    console.log("updated");
  },

  computed: {
    ...mapGetters({
      getReservoirInfo: "reservoir/GET_RESERVOIR_INFO",
    }),
  },
};
</script>
