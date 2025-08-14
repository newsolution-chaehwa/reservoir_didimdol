<template>
  <div style="padding: 20px; width: 100%; height: 73%">
    <breadcrumb-component :breadcrumb-path="[{ title: '일정' }]" breadcrumb-title=" 물 관리 일정"
      :is-calendar="true"></breadcrumb-component>

    <div style="
        display: flex;
        margin: 20px 0 0 0;
        align-items: center;
        font-family: 'NotoSansKR-Medium';
      ">
      <div>저수지</div>
      <div style="margin: 0 0 0 5px">
        <el-select v-model="selectedReservoirForCalendar" @change="changeCalendar()">
          <el-option value="전체" label="전체">전체</el-option>
          <el-option v-for="reservoir in reservoirList" :key="reservoir.reservoirId" :label="reservoir.reservoirName"
            :value="reservoir.reservoirName"></el-option>
        </el-select>
      </div>
    </div>

    <el-dialog v-model="showDialog" :show-close="true" center align-center draggable :selectable="true"
      class="calendar-container" @close="closeModal()">
      <template #header>
        <div class="calendar-header">물 공급 일정 추가</div>
      </template>

      <template #default>
        <div style="display: flex">
          <div>
            <div>일정</div>
            <div style="margin: 3px 0 0 0">
              <el-date-picker type="date" v-model="eventDate" placeholder="공급일정 선택"></el-date-picker>
            </div>
          </div>
          <div style="margin: 0 0 0 10px">
            <div>저수지</div>
            <div style="margin: 3px 0 0 0">
              <el-select :disabled="fixSelectedReservoir" style="width: 220px" v-model="selectedReservoir" clearable
                placeholder="저수지를 선택해주세요.">
                <el-option v-for="reservoir in reservoirList" :key="reservoir.reservoirId"
                  :label="reservoir.reservoirName" :value="reservoir.reservoirName"></el-option></el-select>
            </div>
          </div>
        </div>
        <div style="margin: 10px 0 0 0">
          공급시간
          <el-time-picker style="border-radius: 20px" range-separator="-" is-range v-model="selectedTime" format="HH:mm"
            :default-time="[new Date(), new Date()]"></el-time-picker>
        </div>
        <div style="margin: 20px 0 0 0; text-align: right">
          <el-button @click="closeDialog()">취소</el-button>
          <el-button color="#0d4ba9" @click="updateCalendar()">저장</el-button>
        </div>

        <!-- confirm modal -->
        <el-dialog v-model="showConfirmDialog" :show-close="true" center align-center draggable
          style="width: 300px; border-radius: 8px" @keypress.enter="confirmSave()">
          <template #header>
            <div>일정추가</div>
          </template>

          <div v-if="isError" style="
              display: flex;
              color: #ff0000;
              justify-content: center;
              align-items: center;
            ">
            일자 또는 저수지를 선택해주세요.
          </div>
          <div v-else style="
              display: flex;
              color: #424242;
              justify-content: center;
              align-items: center;
            ">
            저장하시겠습니까?
          </div>
          <div style="text-align: center; margin: 30px 0 0 0">
            <el-button @click="showConfirmDialog = false">취소</el-button>
            <el-button color="#0d4ba9" :disabled="isError" @click="confirmSave()">저장</el-button>
          </div>
        </el-dialog>
      </template>
    </el-dialog>

    <el-dialog v-model="showEditDialog" align-center class="calendar-container" draggable :show-close="true">
      <template #header>
        <div class="calendar-header" style="text-align: center">
          물 공급 일정 상세정보
        </div>
      </template>

      <template #default>
        <div class="calendar-info-detail">
          <div style="display: flex">
            <div>{{ formedEventDate }}</div>
          </div>
          <div style="display: flex">
            <div>{{ selectedReservoir }}</div>
          </div>
        </div>
        <div style="
            font-family: 'NotoSansKR-Regular';
            display: flex;
            justify-content: space-between;
            margin: 10px 0 0 0;
          ">
          <el-button color="red" plain @click="deleteEvent()">일정삭제</el-button>
          <el-button color="#0d4ba9" @click="showEditDialog = false">확인</el-button>
        </div>

        <!-- confirm modal -->
        <el-dialog v-model="showDeleteConfirmDialog" :show-close="true" center align-center draggable
          style="width: 300px; border-radius: 8px" @keypress.enter="confirmSave()">
          <template #header>
            <div>일정삭제</div>
          </template>

          <div style="text-align: center">삭제하시겠습니까?</div>

          <div style="text-align: center; margin: 30px 0 0 0">
            <el-button @click="showDeleteConfirmDialog = false">취소</el-button>
            <el-button color="red" @click="confirmDeleteEvent()">삭제</el-button>
          </div>
        </el-dialog>
      </template>
    </el-dialog>

    <div ref="calendar" style="
        height: 70%;
        width: 100%;
        margin: 10px 0 0 0;
        font-family: 'NotoSansKR-Regular';
      "></div>
  </div>
</template>

<script>
import BreadcrumbComponent from "../common/BreadcrumbComponent.vue";
import { Calendar } from "fullcalendar";
import reservoirList from "../../modules/hard_data/reservoir.json";
import moment from "moment";

export default {
  name: "CalendarContainer",

  components: {
    BreadcrumbComponent,
  },

  data() {
    return {
      showDeleteConfirmDialog: false,
      showEditDialog: false,
      selectedEventObject: {},

      isError: false,
      errorMessage: "",
      selectedReservoirForCalendar: "전체",
      reservoirList,
      fixSelectedReservoir: false,

      showConfirmDialog: false,

      showDialog: false,
      selectedReservoir: "",

      eventDate: undefined,

      calendar: undefined,
      calendarOptions: {
        defaultAllDay: true,
        droppable: true,
        height: "100%",
        locale: "ko",
        editable: false,
        headerToolbar: {
          left: "prev next today",
          center: "title",
          right: "dayGridMonth timeGridWeek timeGridDay addEvent",
        },
        buttonText: {
          today: "오늘",
          month: "월",
          week: "주",
          day: "일",
          addEvent: "일정추가",
        },
        customButtons: {
          addEvent: {
            text: "일정 추가",
            click: () => {
              // console.log('click')
              if (this.selectedReservoirForCalendar !== "전체") {
                this.selectedReservoir = this.selectedReservoirForCalendar;
              } else {
                this.selectReservoir = "";
              }
              this.eventDate = "";
              this.showDialog = true;
            },
          },
          selectReservoir: {
            text: "저수지",
          },
        },
        dayMaxEventRows: true,
        views: {
          timeGrid: {
            dayMaxEventRows: 3,
          },
        },
        events: [],
        eventClick: (info) => {
          this.showEditDialog = true;

          this.selectedEventObject = info;
          this.selectedEventId = info.event._def.publicId;
          this.formedEventDate = info.event.startStr;
          this.selectedReservoir = info.event._def.title;
          console.log("info", info);
        },
        dateClick: (info) => {
          this.calendarInfo = info;
          this.selectDate();
        },
      },

      newEventList: [],

      formedEventDate: "",

      calendarEvents: [], // original ones
      eventsForDisplay: [], // events for display

      calendarInfo: undefined,
      selectedEventId: "",
      selectedTime: [new Date(), new Date()],

      calendarList: [],
      seletedSeq: 0,
      selectedReservoirId: 0,
    };
  },

  mounted() {
    this.initCalendar();
  },

  methods: {
    deleteEvent() {
      this.showDeleteConfirmDialog = true;
    },

    confirmDeleteEvent() {
      let eventList = this.calendar.getEventById(this.selectedEventId);
      eventList.remove();
      this.showDeleteConfirmDialog = false;
      this.showEditDialog = false;

      let seqForDelete = this.selectedEventId;

      this.$axios
        .delete("http://192.168.0.73:3000/request/delete", {
          params: { seq: seqForDelete },
        })
        .then((response) => {
          console.log("response", response);
        });
    },

    changeCalendar() {
      this.calendar.destroy();

      if (this.selectedReservoirForCalendar !== "전체") {
        // console.log()
        this.reservoirList.forEach((reservoir) => {
          if (reservoir.reservoirName === this.selectedReservoirForCalendar) {
            this.selectedReservoirId = reservoir.reservoirId;
          }
        });

        this.selectedReservoir = this.selectedReservoirForCalendar;

        this.fixSelectedReservoir = true;
        this.initCalendar();
      } else {
        this.displayAllCalendarEvent();
        this.initCalendar();
      }
    },

    displayAllCalendarEvent() {
      for (let i = 0; i < this.newEventList.length; i++) {
        this.calendar.addEvent({
          start: this.newEventList[i].start,
          end: this.newEventList[i].end,
          title: this.newEventList[i].title,
          id: i,
        });
      }
    },

    initCalendar() {
      let calendarDiv = this.$refs.calendar;

      this.calendar = new Calendar(calendarDiv, this.calendarOptions);

      this.calendar.render();

      let title = undefined;

      this.calendarList = [];
      console.log('calendarList')
      console.log(this.calendarList)

      this.$axios
        .get("http://192.168.0.73:3000/request/history")
        .then((response) => {
          response.data.forEach((data) => {
            if (data.request_type === 1) {
              this.calendarList.push(data)
              if (this.selectedReservoirForCalendar !== "전체") {
                if (data.reservoir_id == this.selectedReservoirId) {
                  this.reservoirList.forEach((reservoir) => {
                    if (
                      reservoir.reservoirName ==
                      this.selectedReservoirForCalendar
                    ) {
                      this.calendarList.push(data);

                      title =
                        reservoir.reservoirName +
                        " " +
                        data.request_start_time +
                        "~" +
                        data.request_end_time;

                      this.calendar.addEvent({
                        start: data.request_date,
                        end: data.request_date,
                        title,
                        id: data.seq,
                        seq: data.seq,
                      });
                    }
                  });
                }
              } else {
                this.reservoirList.forEach((reservoir) => {

                  console.log('123')

                  if (reservoir.reservoirId == data.reservoir_id) {

                    console.log('data---', data)

                    title =
                      reservoir.reservoirName +
                      " " +
                      data.request_start_time +
                      "~" +
                      data.request_end_time;

                    this.calendar.addEvent({
                      start: data.request_date,
                      end: data.request_date,
                      title,
                      id: data.seq,
                      seq: data.seq,
                    });
                  }
                });
              }
            }
          });
        });

      this.fixSelectedReservoir = false;
    },

    selectDate() {
      this.showDialog = true;
      this.eventDate = this.calendarInfo.date;
      this.calendarInfo.dayEl.style.backgroundColor = "#c6e2ff";
    },

    updateCalendar() {
      this.newEventList.push({
        start: this.eventDate,
        end: this.eventDate,
        title: this.selectedReservoir,
      });

      this.showConfirmDialog = true;
    },

    closeDialog() {
      this.showDialog = false;
    },

    closeModal() { },

    confirmSave() {
      let startDay = moment(this.eventDate).format("YYYY-MM-DD 00:00:00");

      let startTime = moment(this.selectedTime[0]).format("HH:mm");
      let endTime = moment(this.selectedTime[1]).format("HH:mm");

      let reservoirId = 0;

      this.reservoirList.forEach((reservoir) => {
        if (reservoir.reservoirName == this.selectedReservoir) {
          reservoirId = reservoir.reservoirId;
        }
      });

      this.calendar.addEvent({
        start: this.eventDate,
        end: this.eventDate,
        title: this.selectedReservoir + " " + startTime + "~" + endTime,
        id: this.newEventList.length + 1,
      });

      this.formedEventDate = moment(this.eventDate).format(
        "YYYY-MM-DD a hh:mm:ss"
      );

      this.showConfirmDialog = false;
      this.showDialog = false;

      this.$axios
        .post("http://192.168.0.73:3000/request/create", {
          params: {
            date: moment().format("YYYY-MM-DD HH:mm:ss"),
            reservoirId,
            requestType: 1,
            requestDate: startDay,
            requestStartTime: startTime,
            requestEndTime: endTime,
          },
        })
        .then((response) => {
          console.log('response', response)
          this.initCalendar()
        });
    },
  },

  computed: {
    detectDialogClosingEvent() {
      return this.showDialog;
    },
  },

  watch: {
    detectDialogClosingEvent(data) {
      if (data === false) {
        if (this.calendarInfo !== undefined) {
          this.calendarInfo.dayEl.style.backgroundColor = "#fff";
        }
      } else {
        if (this.fixSelectedReservoir === false) {
          this.selectedReservoir = "";
        }
      }
    },

    showConfirmDialog(data) {
      if (data === true) {
        if (this.selectedReservoir === "" || this.eventDate === "") {
          this.isError = true;
        } else {
          this.isError = false;
        }
      }
    },
  },
};
</script>

<style>
@import "../../assets/css/dialog.css";

:root {
  /* --fc-button-text-color: rgb(13, 75, 169); */
  /* --fc-button-text-color: #fff; */
  --fc-button-bg-color: rgb(13, 75, 169);
  --fc-button-border-color: rgb(13, 75, 169);

  --fc-button-hover-bg-color: #ecf5ff;
  --fc-button-hover-border-color: #c6e2ff;

  --fc-button-active-border-color: rgb(13, 75, 169);
  --fc-button-active-bg-color: #fff;
  /* --fc-button-active-bg-color: #ecf5ff; */
  /* --fc-button-active- */
  --fc-event-text-color: #409eff;
}

.fc .fc-button:hover {
  color: #409eff;
}

/* .fc .fc-button-active::before {
  color: rgb(13, 75, 169) !important;
} */

.fc .fc-button-active {
  color: rgb(13, 75, 169) !important;
}

.fc .fc-button:disabled {
  opacity: 1;
  background-color: #fff;
  border-color: #aaa;
  color: #aaa;
}

.fc .fc-button:disabled:hover {
  cursor: not-allowed;
}
</style>
