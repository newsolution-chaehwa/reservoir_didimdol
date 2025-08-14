<template>
    <div style="
      position: absolute;
      margin: 0 0 0 30px;
      width: 300px;
      justify-content: space-between;
      background-color: #fff;
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
      padding: 10px;
      " :style="collapse === true ? 'height: 25px' : ''">

        <div style="
        font-size: 14px;
        font-family: 'NotoSansKR-Medium';
        border-bottom: 1px solid lightgray;
        display: flex;
        justify-content: space-between;
        ">
            <div>본부 & 지사</div>
            <div>
                전남본부 - 해남·완도지사
                <el-icon v-if="collapse === false" class="mouse-hover" @click="toggleTab()">
                    <ArrowUpBold />
                </el-icon>
                <el-icon v-else class="mouse-hover" @click="toggleTab()">
                    <ArrowDownBold />
                </el-icon>
            </div>
        </div>
        <div style="display: flex; margin: 5px 0 0 0" :style="collapse === true ? 'display: none' : ''">
            <div style="font-family: 'NotoSansKR-Regular'; ">
                <!-- <el-tree :data="list"></el-tree> -->
                <div v-for="headquarter in headquarters" :key="'h' + headquarter.id">
                    <el-button style="margin: 10px 0 0 0" :disabled="headquarter.id !== 5"
                        :type="headquarter.id === 5 ? 'primary' : ''">
                        {{ headquarter.name }}
                    </el-button>
                </div>
            </div>
            <div style="margin: 0 0 0 10px; border-left: 1px solid #f4f4f4">
                <div v-for="branch in branches" :key="'h' + branch.id">
                    <el-button :disabled="branch.id !== 12" style="margin: 10px 0 0 10px"
                        :type="branch.id === 12 ? 'primary' : ''">
                        {{ branch.name }}
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'BranchesContainer',

    data() {
        return {
            headquarters: [],
            branches: [],
            list: [],
            collapse: true
        }
    },

    mounted() {

        this.$nextTick(() => {
            this.initHeadquarters()
        })

    },

    methods: {

        initHeadquarters() {
            this.list = []

            axios.get('http://192.168.0.73:3000/static/headquarters').then(hResponse => {
                axios.get('http://192.168.0.73:3000/static/branches').then(bResponse => {

                    this.headquarters = hResponse.data
                    this.branches = bResponse.data

                })
            })
        },

        toggleTab() {
            this.collapse = !this.collapse;
            console.log(this.collapse)
        },

    }
}
</script>