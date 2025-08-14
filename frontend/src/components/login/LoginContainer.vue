<template>
  <div
    style="
      font-family: 'NotoSansKR-Regular';
      /* margin: 0 auto; */
      display: flex;
      width: 100%;
      background-color: #e7e7e7;
      justify-content: center;
      align-items: center;
    "
  >
    <div
      style="
        width: 300px;
        border: 1px solid #dad9d9;
        border-radius: 15px;
        padding: 90px 60px;
        background-color: #fff;
      "
    >
      <div
        style="
          text-align: center;
          font-size: 40px;
          font-family: 'NotoSansKR-Medium';
        "
      >
        로그인
      </div>
      <div style="display: flex; align-items: center; margin: 30px 0 0 0">
        <div style="width: 80px">아이디</div>
        <div>
          <el-input
            style="width: 220px"
            placeholder="아이디를 입력해주세요."
          ></el-input>
        </div>
      </div>
      <div style="display: flex; margin: 20px 0 0 0; align-items: center">
        <div style="width: 80px">비밀번호</div>
        <div>
          <el-input
            style="width: 220px"
            placeholder="비밀번호를 입력해주세요."
          ></el-input>
        </div>
      </div>
      <div style="margin: 10px 0 0 0; text-align: right">
        <el-checkbox>아이디 기억하기</el-checkbox>
      </div>
      <div style="margin: 20px 0 0 0">
        <el-button
          style="width: 100%; height: 40px; font-size: 18px"
          color="#0d4ba9"
          @click="changeRoute('/main')"
          >로그인</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginContainer",

  data() {
    return {};
  },

  mounted() {},

  methods: {
    changeRoute(path) {
      this.$router.push(path);
    },
  },
};
</script>
