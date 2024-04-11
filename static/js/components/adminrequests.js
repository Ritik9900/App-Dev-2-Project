const adminrequests = Vue.component("adminrequests", {
  template: `
  <div class="container mt-5">
    <h2 class="text-center" style="color: #3498db;">Category Create Requests</h2>
    <h4 v-if="showc" class="text-center text-danger">{{ errorcmessage }}</h4>
    <h4 v-if="createcatdata.length === 0" class="text-center" style="color: #3498db;">No Requests</h4>
    <table class="table table-bordered table-striped table-hover mx-auto" v-if="createcatdata.length > 0" style="box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); border-radius: 10px;">
      <thead class="thead-dark">
        <tr>
          <th class="text-center">Info</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="createcat in createcatdata" :key="createcat.req_id">
          <td class="text-center">
            Create category {{ createcat.category_name }}?
          </td>
          <td class="text-center">
            <button class="btn btn-success" @click="createcatapprove(createcat.category_name)">Approve</button>
            <button class="btn btn-danger" @click="createcatreject(createcat.category_name)">Reject</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h2 class="text-center mb-4" style="color: #2ecc71;">Category Update Requests</h2>
    <h4 v-if="showp" class="text-center text-danger">{{ errorpmessage }}</h4>
    <h4 v-if="modifydata.length === 0" class="text-center" style="color: #3498db;">No Requests</h4>
    <table class="table table-bordered table-striped table-hover mx-auto" v-if="modifydata.length > 0" style="box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); border-radius: 10px;">
      <thead class="thead-dark">
        <tr>
          <th class="text-center">Info</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mod in modifydata" :key="mod.req_id">
          <td class="text-center">
            Change category name from {{ mod.actual_category_name }} to {{ mod.req_categ_name }}
          </td>
          <td class="text-center">
            <button class="btn btn-success" @click="modapprove(mod.req_categ_id, mod.req_categ_name)">Approve</button>
            <button class="btn btn-danger" @click="modreject(mod.req_categ_id)">Reject</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h2 class="text-center mt-5" style="color: #e74c3c;">Category Delete Requests</h2>
    <h4 v-if="showd" class="text-center text-danger">{{ errordmessage }}</h4>
    <h4 v-if="deldata.length === 0" class="text-center" style="color: #3498db;">No Requests</h4>
    <table class="table table-bordered table-striped table-hover mx-auto" v-if="deldata.length > 0" style="box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); border-radius: 10px;">
      <thead class="thead-dark">
        <tr>
          <th class="text-center">Info</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="del in deldata" :key="del.req_id">
          <td class="text-center">Delete {{ del.actual_categ_name }}?</td>
          <td class="text-center">
            <button class="btn btn-success" @click="delapprove(del.req_categ_id)">Approve</button>
            <button class="btn btn-danger" @click="delreject(del.req_categ_id)">Reject</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h2 class="text-center mt-5" style="color: #f39c12;">Profile Update Requests</h2>
    <h4 v-if="show" class="text-center text-danger">{{ errormessage }}</h4>
    <h4 v-if="profileUpdateData.length === 0" class="text-center" style="color: #3498db;">No Requests</h4>
    <table class="table table-bordered table-striped table-hover mx-auto" v-if="profileUpdateData.length > 0" style="box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); border-radius: 10px;">
      <thead class="thead-dark">
        <tr>
          <th class="text-center">Info</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="profileUpdate in profileUpdateData" :key="profileUpdate.req_id">
          <td class="text-center">
            Change user profile for user ID {{ profileUpdate.user_id }} to manager profile
          </td>
          <td class="text-center">
            <button class="btn btn-success" @click="approveProfileUpdate(profileUpdate.user_id)">Approve</button>
            <button class="btn btn-danger" @click="rejectProfileUpdate(profileUpdate.user_id)">Reject</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
`,
  data() {
    return {
      modifydata: {},
      deldata: {},
      profileUpdateData: {},
      createcatdata: {},
      show: false,
      showc: false,
      showp: false,
      errormessage: "",
      showd: false,
      errordmessage: "",
      errorpmessage: "",
      errorcmessage: "",
    };
  },
  methods: {
    fetchdata() {
      const authtoken = localStorage.getItem("auth_token");
      fetch("http://127.0.0.1:5000/modifyreq", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("No requests to update");
          }
        })
        .then((data) => {
          this.modifydata = data;
        })
        .catch((error) => {
          this.show = true;
          this.errormessage = error.message;
        });
      fetch("http://127.0.0.1:5000/deletereq", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("No requests to delete");
          }
        })
        .then((data) => {
          console.log(data);
          this.deldata = data;
        })
        .catch((error) => {
          this.showd = true;
          this.errordmessage = error.message;
        });
      fetch("/api/request_manager/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("No requests to delete");
          }
        })
        .then((data) => {
          this.profileUpdateData = data;
        })
        .catch((error) => {
          this.showd = true;
          this.errorpmessage = error.message;
        });
      fetch("/createreq", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("No requests to delete");
          }
        })
        .then((data) => {
          this.createcatdata = data;
        })
        .catch((error) => {
          this.showd = true;
          this.errorpmessage = error.message;
        });
    },
    createcatapprove(cname) {
      const Data = {
        category_name: cname,
        state: "approved",
      };
      const authtoken = localStorage.getItem("auth_token");
      fetch(`/createreq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
        body: JSON.stringify(Data),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(
              "This Category is already present, please enter new category to be added"
            );
          }
        })
        .then((data) => {
          this.showc = true;
          this.errorcmessage = "category added successfully!!";
        })
        .catch((error) => {
          this.showc = true;
          this.errorcmessage = error;
        });
    },
    createcatreject(category_name) {
      const Data = {
        category_name: category_name,
        state: "rejected",
      };
      const authtoken = localStorage.getItem("auth_token");
      fetch(`/createreq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
        body: JSON.stringify(Data),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("something went wrong, please try again later");
          }
        })
        .then((data) => {
          this.showc = true;
          this.errorcmessage = "category rejected successfully!!";
        })
        .catch((error) => {
          this.showc = true;
          this.errorcmessage = error;
        });
    },
    modapprove(cid, cname) {
      const Data = {
        category_id: cid,
        state: "approved",
        categ_name_req: cname,
      };
      const authtoken = localStorage.getItem("auth_token");
      fetch("http://127.0.0.1:5000/modifyreq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
        body: JSON.stringify(Data),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Not Found!!!");
          }
        })
        .then((data) => {
          this.showp = true;
          this.errorpmessage = "Request to update category Approved";

          setTimeout(() => {
            this.showp = false;
            this.errorpmessage = "";
            this.category_name = "";
            this.fetchdata();
          }, 2000);
        })
        .catch((error) => {
          this.showp = true;
          this.errorpmessage = error;
        });
    },

    modreject(cid) {
      const Data = {
        category_id: cid,
        state: "rejected",
        categ_name_req: "",
      };
      const authtoken = localStorage.getItem("auth_token");
      fetch("http://127.0.0.1:5000/modifyreq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
        body: JSON.stringify(Data),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Not Found!!!");
          }
        })
        .then((data) => {
          this.showp = true;
          this.errorpmessage = "Request to delete category Rejected";

          setTimeout(() => {
            this.showp = false;
            this.errorpmessage = "";
            this.category_name = "";
            this.fetchdata();
          }, 2000);
        })
        .catch((error) => {
          this.showp = true;
          this.errorpmessage = error.message;
        });
    },
    delapprove(cid) {
      const Data = {
        category_id: cid,
        state: "approved",
      };
      const authtoken = localStorage.getItem("auth_token");
      fetch("http://127.0.0.1:5000/deletereq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
        body: JSON.stringify(Data),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Not Found!!!");
          }
        })
        .then((data) => {
          this.showd = true;
          this.errordmessage = "Category Deleted";

          setTimeout(() => {
            this.showd = false;
            this.errordmessage = "";
            this.category_name = "";
            this.fetchdata();
          }, 2000);
        })
        .catch((error) => {
          this.showd = true;
          this.errordmessage = error;
        });
    },
    delreject(cid) {
      const Data = {
        category_id: cid,
        state: "rejected",
      };
      const authtoken = localStorage.getItem("auth_token");
      fetch("http://127.0.0.1:5000/deletereq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
        body: JSON.stringify(Data),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Not Found!!!");
          }
        })
        .then((data) => {
          this.showd = true;
          this.errordmessage = "Request Rejected";

          setTimeout(() => {
            this.showd = false;
            this.errordmessage = "";
            this.category_name = "";
            this.fetchdata();
          }, 2000);
        })
        .catch((error) => {
          this.showd = true;
          this.errordmessage = error;
        });
    },
    approveProfileUpdate(userId) {
      const data = {
        user_id: userId,
        state: "approved",
      };

      const authtoken = localStorage.getItem("auth_token");
      fetch(`http://127.0.0.1:5000/api/request_manager/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Not Found!!!");
          }
        })
        .then((data) => {
          this.show = true;
          this.errormessage = "Profile update request approved";

          setTimeout(() => {
            this.show = false;
            this.errormessage = "";
            this.fetchdata();
          }, 2000);
        })
        .catch((error) => {
          this.show = true;
          this.errormessage = error;
        });
    },

    rejectProfileUpdate(userId) {
      const data = {
        user_id: userId,
        state: "rejected",
      };

      const authtoken = localStorage.getItem("auth_token");
      fetch("http://127.0.0.1:5000/api/request_manager/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Not Found!!!");
          }
        })
        .then((data) => {
          this.show = true;
          this.errormessage = "Profile update request rejected";

          setTimeout(() => {
            this.show = false;
            this.errormessage = "";
            this.fetchdata();
          }, 2000);
        })
        .catch((error) => {
          this.showp = true;
          this.errormessage = error;
        });
    },
  },

  mounted() {
    this.fetchdata();
  },
});
export default adminrequests;
