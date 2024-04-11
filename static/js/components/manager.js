const manager = Vue.component("manager", {
  template: `
    <div class="container mt-5">
      <h1 class="text-center">Welcome Store Manager</h1>
      <h4 v-if="show" class="text-center text-danger">{{ errormessage }}</h4>
      <h4 v-if="categoriesdata.length === 0" class="text-center">No categories yet</h4>
      <table class="table table-bordered table-striped table-hover mx-auto">
        <thead>
          <tr>
            <th class="text-center">Category Name</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categoriesdata" :key="cat.category_id">
            <td class="text-center">{{ cat.category_name }}</td>
            <td class="text-center">
              <button class="btn btn-primary" @click="ucategory(cat)">Update</button>
              <button class="btn btn-danger" @click="deletecategory(cat.category_id)">Request to Delete</button>
              <button class="btn btn-secondary" @click="goproduct(cat.category_name,cat.category_id)">Products</button>
              <button class="btn btn-secondary" @click="exportcat(cat.category_id)">export CSV</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-primary" @click="category">Add Category</button>
      <form v-if="showform" class="text-center">
        <label for="category_name">Category Name:</label>
        <input type="text" class="form-control" v-model="category_name" required>
        <button class="btn btn-success" @click="addcategory(category_name)">Request New Category</button>
      </form>
      <form v-if="showuform" class="text-center">
        <label for="category_name">Category Name:</label>
        <input type="text" class="form-control" v-model="ucateg.category_name" required>
        <button class="btn btn-primary" @click="updatecategory(ucateg.category_id,ucateg.category_name)">Request To Change</button>
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
            throw new Error("Not Found!!!");
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
    category() {
      this.showform = !this.showform;
    },
    ucategory(cat) {
      this.showuform = !this.showuform;
      if (this.showuform) {
        this.ucateg = { ...cat };
      } else {
        this.ucateg = {};
      }
    },
    deletecategory(cid) {
      const Data = {
        category_id: cid,
        state: "created",
      };
      const authtoken = localStorage.getItem("auth_token");
      fetch(`http://127.0.0.1:5000/deletereq/`, {
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
          this.show = true;
          this.errormessage = "Deleted Successfully!!";

          setTimeout(() => {
            this.show = false;
            this.errormessage = "";
            this.category_name = "";
            this.fetchdata();
          }, 2000);
        })
        .catch((error) => {
          this.show = true;
          this.errormessage = error.message;
        });
    },
    updatecategory(cid, cname) {
      const Data = {
        category_id: cid,
        state: "created",
        categ_name_req: cname,
      };
      const authtoken = localStorage.getItem("auth_token");
      fetch(`http://127.0.0.1:5000/modifyreq`, {
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
          this.show = true;
          this.errormessage = "Updated Successfully!!";

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
          this.errormessage = error.message;
        });
    },
    exportcat(cid) {
      const authtoken = localStorage.getItem("auth_token");
      fetch(`http://127.0.0.1:5000/generate/${cid}`, {
        method: "POST",
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
          this.errormessage = "Exported Successfully!!";

          setTimeout(() => {
            this.show = false;
            this.errormessage = "";
          }, 2000);
        })
        .catch((error) => {
          this.show = true;
          this.errormessage = error.message;
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
    addcategory(cname) {
      const Data = {
        category_name: cname,
        state: "created",
      };
      const authtoken = localStorage.getItem("auth_token");
      fetch(`http://127.0.0.1:5000/createreq`, {
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
          this.show = true;
          this.errormessage = data.message;

          setTimeout(() => {
            this.show = false;
            this.errormessage = "";
            this.category_name = "";
            this.showform = false;
            this.fetchdata();
          }, 2000);
        })
        .catch((error) => {
          this.show = true;
          this.errormessage = error.message;
        });
    },
  },
});
export default manager;
