const Profile = Vue.component("Profile", {
  template: `
  <div class="login text-center mt-5">
    <div v-if="showMessage" class="alert alert-success" role="alert">
      {{ message }}
    </div>
    <h4>Username: {{ username }}</h4>
    <h4>Email: {{ email }}</h4>
    <button class="btn btn-success mt-3" @click="show = !show">Update Profile</button>
    <form v-if="show" class="mt-3">
      <div class="mb-3">
        <label for="uname" class="form-label">Username:</label>
        <input type="text" class="form-control" v-model="uname" required>
      </div>
      <div class="mb-3">
        <label for="uemail" class="form-label">Email:</label>
        <input type="email" class="form-control" v-model="uemail" required>
      </div>
      <div class="mb-3">
        <label for="upswd" class="form-label">Password:</label>
        <input type="password" class="form-control" v-model="upswd" required>
      </div>
      <button type="submit" class="btn btn-primary" @click="updateprofile">Update Profile</button>
    </form>
    <div class="mt-3">
      <button class="btn btn-secondary" @click="requestmanager">Register as Manager</button>
    </div>
  </div>
`,

  data() {
    return {
      username: "",
      email: "",
      show: false,
      showMessage: false,
      message: "",
      uname: "",
      uemail: "",
      upswd: "",
      userid: "",
    };
  },
  mounted() {
    const authtoken = localStorage.getItem("auth_token");
    fetch("/api/profile/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authentication-Token": authtoken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.username = data.user_name;
        this.email = data.email;
      });
  },
  methods: {
    requestmanager() {
      // Display a confirmation dialog box message before proceeding
      const userConfirmed = window.confirm(
        "Are you sure you want to register as a manager?"
      );

      // Check if the user confirmed
      if (!userConfirmed) {
        // User canceled the operation
        return;
      }

      const authtoken = localStorage.getItem("auth_token");
      fetch(`http://127.0.0.1:5000/api/request_manager/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error("Failed to send manager request");
          }
        })
        .then((data) => {
          this.showMessage = true;
          this.message = "Request sent successfully!";
          console.log(data);
        })
        .catch((error) => {
          this.showMessage = true;
          this.message = "Failed to send manager request";
          console.error(error);
        });
    },
    updateprofile() {
      const authtoken = localStorage.getItem("auth_token");
      fetch("/api/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
        body: JSON.stringify({
          user_name: this.uname,
          email: this.uemail,
          password: this.upswd,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.username = data.username;
          this.email = data.email;
        });
    },
  },
});
export default Profile;
