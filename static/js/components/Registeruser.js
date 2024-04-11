const RegisterUser = Vue.component("RegisterUser", {
  template: `
    <div>
      <div class="container">
        <h1 class="text-center">Registration Page</h1>
        <h4 :class="{ 'text-success': ermsg === 'successfully registered!!', 'text-danger': ermsg !== 'successfully registered!!' }" v-if="showmessage">{{ ermsg }}</h4>
        <form @submit.prevent="registerUser">
          <div class="form-group">
            <label for="username">Username:</label>
            <input
              v-model="formData.username"
              type="text"
              class="form-control"
              id="username"
              name="username"
              required
            >
            <p class="error" style="color: red;">{{ usernameError }}</p>
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              v-model="formData.email"
              type="email"
              class="form-control"
              id="email"
              name="email"
              required
            >
            <p class="error" style="color: red;">{{ emailError }}</p>
          </div>
          <div class="form-group">
            <label for="city">City:</label>
            <input
              v-model="formData.city"
              type="text"
              class="form-control"
              id="city"
              name="city"
              required
            >
          </div>
          <div class="form-group">
            <label for="age">Age:</label>
            <input
              v-model="formData.age"
              type="text"
              class="form-control"
              id="age"
              name="age"
              required
            >
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input
              v-model="formData.password"
              type="password"
              class="form-control"
              id="password"
              name="password"
              required
            >
          </div>
          <input
            type="submit"
            class="btn btn-primary btn-block"
            value="Register"
            style="margin-top: 10px;"
          >
        </form>
      </div>
    </div>
  `,
  data() {
    return {
      showmessage: false,
      ermsg: "",
      showform: true,
      formData: {
        username: "",
        email: "",
        city: "",
        age: "",
        password: "",
      },
      emailError: "",
      usernameError: "",
      userId: "",
    };
  },
  methods: {
    registerUser() {
      const data = {
        user_name: this.formData.username,
        email: this.formData.email,
        city: this.formData.city,
        age: this.formData.age,
        mobile_n: this.formData.mobile_n,
        password: this.formData.password,
      };
      fetch("http://127.0.0.1:5000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.status === 200) return response.json();
        })
        .then((data) => {
          this.showmessage = true;
          this.ermsg = data.message;
          if (data.message === "successfully registered user!!") {
            setTimeout(() => {
              this.$router.push("/login");
            }, 2000);
          }
        });
    },
    fetchUserData() {
      fetch(`http://127.0.0.1:5000/api/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.userdata = data;
        });
    },
    requestManager() {
      const data = {
        user_name: this.formData.username,
        email: this.formData.email,
        city: this.formData.city,
        age: this.formData.age,
        mobile_n: this.formData.mobile_n,
        password: this.formData.password,
      };
      fetch("http://127.0.0.1:5000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error("Failed to register user");
          }
        })
        .then((userData) => {
          this.userId = userData.id;
        })
        .catch((error) => {
          this.showMessage = true;
          this.successMessage = false;
          this.errorMessage = true;
          this.message = "Failed to register user";
          console.error(error);
        });
    },
  },
  watch: {
    "formData.username": function (newVal) {
      this.usernameError = this.userdata.some(
        (user) => user.user_name === newVal
      )
        ? "Provided Username already exists"
        : "";
    },
    "formData.email": function (newVal) {
      this.emailError = this.userdata.some((user) => user.email === newVal)
        ? "Provided Email-ID already exists"
        : "";
    },
  },
  mounted() {
    this.fetchUserData();
  },
});

export default RegisterUser;
