const admin = Vue.component("admin", {
  template: `
    <div class="container mt-5 login">
      <h1 class="text-center">Welcome Admin</h1>
      <div v-if="show" class="alert alert-danger">{{ errormessage }}</div>
      <h4 v-if="categoriesdata.length === 0" class="text-center mt-3">No categories created yet. Please add some.</h4>
      <table class="table table-striped table-bordered mt-3 text-center">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Category Name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categoriesdata" :key="cat.category_id">
            <td>{{ cat.category_name }}</td>
            <td>
              <button class="btn btn-primary mr-2" @click="ucategory(cat)">
                Update
              </button>
              <button class="btn btn-danger mr-2" @click="deletecategory(cat.category_id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-success" @click="categories">+ Category</button>
      <form v-if="showform" class="mt-3">
        <div class="form-group">
          <label for="category_name">Category Name:</label>
          <input type="text" class="form-control" v-model="category_name" required>
        </div>
        <button class="btn btn-primary" @click="createcat">Create Category</button>
      </form>
      <form v-if="showuform" class="mt-3">
        <div class="form-group">
          <label for="category_name">Category Name:</label>
          <input type="text" class="form-control" v-model="ucateg.category_name" required>
        </div>
        <button class="btn btn-primary" @click="updatecategory(ucateg.category_id)">Update Category</button>
      </form>
    </div>
  `,
  data() {
    return {
      categoriesdata: "",
      show: false,
      category_name: "",
      ucateg_name: "",
      showform: false,
      showuform: false,
      errormessage: "",
      ucateg: {},
    };
  },
  mounted() {
    this.fetchdata();
  },
  methods: {
    fetchdata() {
      const authtoken = localStorage.getItem("auth_token");
      fetch(`http://127.0.0.1:5000/categories`, {
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
            throw new Error(
              "No categories are currently present, please add some."
            );
          }
        })
        .then((data) => {
          this.categoriesdata = data;
          console.log(data);
        })
        .catch((error) => {
          this.show = true;
          this.errormessage = error;
          setTimeout(() => {
            this.show = false;
            this.errormessage = "";
          }, 2000);
        });
    },
    categories() {
      this.showform = !this.showform;
    },
    ucategory(cat) {
      this.showuform = !this.showform;
      if (this.showuform) {
        this.ucateg = { ...cat };
      } else {
        this.ucateg = {};
      }
    },
    createcat() {
      const Data = {
        category_name: this.category_name,
      };
      const authtoken = localStorage.getItem("auth_token");
      fetch(`http://127.0.0.1:5000/categories`, {
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
          this.show = true;
          this.errormessage = "category added successfully!!";

          setTimeout(() => {
            this.show = false;
            this.errormessage = "";
            this.showform = false;
            this.category_name = "";
            this.fetchdata();
          }, 2000);
        })
        .catch((error) => {
          this.show = true;
          this.errormessage = error;
        });
    },
    deletecategory(cid) {
      const authtoken = localStorage.getItem("auth_token");
      fetch(`http://127.0.0.1:5000/categories/${cid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authentication-Token": authtoken,
        },
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
          this.errormessage = "category Deleted successfully!!";

          setTimeout(() => {
            this.show = false;
            this.errormessage = "";
            this.category_name = "";
            this.fetchdata();
          }, 2000);
        })
        .catch((error) => {
          this.show = true;
          this.errormessage = error;
        });
    },
    updatecategory(cid) {
      const Data = {
        category_name: this.ucateg.category_name,
      };
      const authtoken = localStorage.getItem("auth_token");
      fetch(`http://127.0.0.1:5000/categories/${cid}`, {
        method: "PUT",
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
          this.show = true;
          this.errormessage = "category Updated successfully!!";

          setTimeout(() => {
            this.show = false;
            this.errormessage = "";
            this.category_name = "";
            this.showuform = false;
            this.fetchdata();
          }, 2000);
        })
        .catch((error) => {
          this.show = true;
          this.errormessage = error;
        });
    },
    approveCategory(cid) {
      const authtoken = localStorage.getItem("auth_token");
      fetch(`http://127.0.0.1:5000/approvecat/${cid}`, {
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
            throw new Error("Not Found!!!");
          }
        })
        .then((data) => {
          this.show = true;
          this.errormessage = "category Approved !";

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
    goproduct(category_name, cid) {
      this.$router.push({
        name: "MProducts",
        params: {
          cname: category_name,
          cid: cid,
        },
      });
    },
  },
});
export default admin;
