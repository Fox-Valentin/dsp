/**
 * Created by hangweiping on 2017/7/14.
 */
import axios from 'axios'

axios.defaults.timeout = 5000
axios.defaults.headers.post['Content-Type'] = 'application/json'
let token = localStorage.getItem('currentUser_token')
if (token) {
  axios.defaults.headers.Authorization = `Bearer ${token}`
}

const instance = axios.create({
  baseURL: 'http://local.lal.com'
  // withCredentials: true
})

// instance.defaults.headers.post['Content-Type'] = 'application/json'

export default instance
