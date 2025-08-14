import { createRouter, createWebHistory } from "vue-router";

// Login
import LoginContainer from "../components/login/LoginContainer.vue";

import MainContainer from "../components/main/MainContainer.vue";
import MainMapContainer from "../components/main/MainMapContainer.vue";
import PredictContainer from "../components/prediction/PredictContainer.vue";
import SpiContainer from "../components/spi/SpiContainer.vue";
import TrendContainer from "../components/trend/TrendContainer.vue";

// 일정
import CalendarContainer from "../components/calendar/CalendarContainer.vue";
import CalendarComponent from "../components/calendar/CalendarComponent.vue";
import CalendarHistory from "../components/calendar/CalendarHistory.vue";
import CalendarRequest from '../components/calendar/CalendarRequest.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      component: LoginContainer,
      name: "login",
    },
    {
      path: "/",
      component: MainContainer,
      redirect: "main",
      children: [
        {
          path: "main",
          component: MainMapContainer,
          name: "main",
        },
        {
          path: "predict",
          component: PredictContainer,
          name: "predict",
        },
        {
          path: "trend",
          component: TrendContainer,
          name: "trend",
        },
        {
          path: "spi",
          component: SpiContainer,
          name: "spi",
        },
        {
          path: "calendar",
          component: CalendarContainer,
          children: [
            {
              path: "",
              component: CalendarComponent,
              name: "calendar",
            },
            {
              path: "history",
              component: CalendarHistory,
              name: "calendar-history",
            },
            {
              path: 'request',
              component: CalendarRequest,
              name: 'calendar-request'
            }
          ],
        },
      ],
    },
  ],
});

export default router;
