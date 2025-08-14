<template>
  <div
    style="
      width: 200px;
      max-width: 200px;
      height: 40px;
      max-height: 40px;
      border-radius: 20px;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    "
  >
    <el-input
      :prefix-icon="Search"
      style="width: 200px; max-width: 200px; height: 40px; max-height: 40px"
      v-model="searchInputText"
      clearable
      placeholder="통합검색(저수지명)"
      @keypress="searchKeypress($event)"
      ></el-input>
      <!-- @change="search()" -->
  </div>
</template>

<script>
import { Search } from "@element-plus/icons-vue";

export default {
  name: "GeneralSearch",

  data() {
    return {
      searchInputText: "",
      Search,
    };
  },

  mounted() {},

  methods: {
    search() {
      if (this.searchInputText !== "")
        this.$emit("main-total-search", this.searchInputText);
    },

    searchKeypress(e) {
      if (e.code === "Enter" && e.keyCode === 13 && e.charCode === 13) {
        this.search();
      }
    },
  },
};
</script>

<style>
.el-input {
  --el-input-border-radius: 20px;
  font-family: "NotoSansKR-Medium";
  font-size: 14px;
  line-height: 40px;
}

.el-input__inner {
  font-family: "NotoSansKR-Regular";
  font-size: 14px;
  line-height: 40px;
}
</style>
