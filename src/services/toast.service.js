import Vue from "vue"
import Toasted from "vue-toasted"
Vue.use(Toasted)

/*
Modelo de data {
  icone: "close-outline",
  title:'Erro ao fazer login',
  description: "mensagem",
  time: 5000,
}
*/

class ToastService {
  create(data, type) {
    if (!data.icon) {
      switch (type) {
        case "warning":
          data.icon = "warning-outline"
          break
        case "error":
          data.icon = "close-outline"
          break
        case "info":
          data.icon = "information-outline"
          break
        case "success":
          data.icon = "checkmark-outline"
          break
      }
    }

    var description = data.description ? `<div class='description'>${data.description}</div>` : ""
    var htmlRender = `
      <div class='toast-container'>
      <div class='icone'><ion-icon name="${data.icon}"></ion-icon> </div>
      <div class='texto'><div class='title'> ${data.title} </div> <div class='description'> ${description} </div></div>`

    Vue.toasted.show(htmlRender, {
      position: "top-right",
      duration: data.time ? data.time : 5000,
      className: type,
    })
  }

  warning(data) {
    this.create(data, "warning")
  }
  error(data) {
    this.create(data, "error")
  }
  info(data) {
    this.create(data, "info")
  }
  success(data) {
    this.create(data, "success")
  }
}

export default new ToastService()
