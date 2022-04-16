import axios from "axios";
const baseAPI = process.env.VUE_APP_API_URL;

class Auth {
  async checkUser(user) {
    return await this.getUser(user.uid).then(async (currentUser) => {
      if (currentUser.code === 404) {
        var newUser = {
          id: user.uid,
          displayName: user.displayName ? user.displayName : "",
          email: user.email,
        };

        var saveUser = await this.setUser(newUser);
        console.log(saveUser);
        return saveUser;
      }
      return currentUser;
    });
  }
  async getUser(id) {
    return await axios({ method: "GET", url: `${baseAPI}users/${id}` })
      .then(
        (res) => {
          return res.data;
        },
        () => {
          return Promise.resolve({ code: 404 });
        }
      )
      .catch((error) => {
        return Promise.reject(error);
      });
  }
  async setUser(user) {
    return await axios({ method: "POST", url: `${baseAPI}users`, data: user })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
}
export default new Auth();
