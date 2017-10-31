/**
 * Created by hangweiping on 2017/7/14.
 */
import Vue from 'vue'
import Vuex from 'Vuex'
import ticketSysModule from './modules/ticketSysModule'
import calendarCard from './modules/calendarCard'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ticketSysModule,
    calendarCard
  }
})
