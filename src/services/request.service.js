import axios from "axios"

const ContactRequest = () => {
  let instance = axios.create({
    baseURL: process.env.VUE_APP_ROOT_API,
    headers: { "content-type": "appllication-json" },
  })

  instance.interceptors.request.use(function (config) {
    var user = JSON.parse(localStorage.getItem("user"))
    if (user && user.token) {
      config.headers["x-access-token"] = user.token
    }
    return config
  })

  return instance
}

export default ContactRequest()
