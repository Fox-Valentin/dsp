// import axios from '@/config/axios'
const state = {
  activeKey: null,
  activeNames: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'],
  ticket_id: null
}

const getters = {
  getActiveKey: state => state.activeKey,
  getActiveNames: state => state.activeNames,
  getTicketId: state => state.ticket_id
}

const mutations = {
  updateActiveNames (state, payload) {
    state.activeName = payload
  },
  updateActiveKey (state, payload) {
    state.activeKey = payload
  },
  updateProductId (state, payload) {
    state.ticket_id = payload
  }
}

export default {
  state,
  getters,
  mutations
}
