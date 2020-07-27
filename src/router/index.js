import axios from "axios"
import Vue from "vue"
import VueRouter from "vue-router"

// components
const Login = () => import(/* webpackChunkName: "login" */ "@/views/login/login.vue");
const Dashboard = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/dashboard.vue");
const GameList = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/game-list/game-list.vue");
const GameDetail = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/game-detail/game-detail.vue");
const CreateGame = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/create-game/create-game.vue");
const Profile = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/profile/profile.vue");
const Admin = () => import(/* webpackChunkName: "dashboard" */ "@/views/admin/admin.vue");
const Invoice = () => import(/* webpackChunkName: "dashboard" */ "@/views/admin/invoice/invoice.vue");
const ShopList = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/shop-list/shop-list.vue");
const StoreList = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/shop-listv2/shop-listv2.vue");
const CreateShop = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/create-shop/create-shop.vue");
const ShopDetail = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/shop-detail/shop-detail.vue");
const StoreDetail = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/shop-detailv2/shop-detailv2.vue");
const ShopOrder = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/shop-order/shop-order.vue");
const UpdateProduct = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/update-product/update-product.vue");
const ShopCategory = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/shop-category/shop-category.vue");
const ShopTable = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/shop-table/shop-table.vue");
const StoreMerge = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/store-merge/store-merge.vue");
const StoreCategory = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/shop-categoryv2/shop-categoryv2.vue");
const StoreOrder = () => import(/* webpackChunkName: "dashboard" */ "@/views/dashboard/store-order/store-order.vue");

Vue.use(VueRouter)

const routes = [

  {
    path: "/",
    //  name: "dashboard",
    component: Dashboard,
    redirect: "/home",
    children: [
      {
        path: "home",
        component: GameList,
        name: "home",
      },
      {
        path: "create-game",
        component: CreateGame,
        name: "create-game",
      },
      {
        path: "game-detail",
        component: GameDetail,
        name: "game-detail",
      },
      {
        path: "profile",
        component: Profile,
        name: "profile",
      },
      {
        path: "shop-list",
        component: ShopList,
        name: "shop-list",
      },
      {
        path: "store-list",
        component: StoreList,
        name: "store-list",
      },
      {
        path: "create-shop",
        component: CreateShop,
        name: "create-shop",
      },
      {
        path: "shop-detail",
        component: ShopDetail,
        name: "shop-detail",
      },
      {
        path: "store-detail",
        component: StoreDetail,
        name: "store-detail",
      },
      {
        path: "shop-order",
        component: ShopOrder,
        name: "shop-order",
      },
      {
        path: "shop-category",
        name: "shop-category",
        component: ShopCategory
      },
      {
        path: "store-category",
        name: "store-category",
        component: StoreCategory
      },
      {
        path: "shop-table",
        name: "shop-table",
        component: ShopTable
      },
      {
        path: "update-product",
        component: UpdateProduct,
        name: "update-product"
      },
      {
        path: "store-merge",
        component: StoreMerge,
        name: "store-merge"
      },
      {
        path: "store-order",
        component: StoreOrder,
        name: "store-order"
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "*",
    redirect: "home",
  },
  {
    path: "/admin",
    name: "admin",
    component: Admin,
    redirect: "admin/invoice",
    children: [
      {
        path: "invoice",
        component: Invoice,
        name: "invoice",
      },
    ]
  },


]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  let user = localStorage.getItem("user-cms");
  if (to.name !== "Login") {
    if (user == null) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath }
      });
    } else {
      Vue.prototype.$userLogged = JSON.parse(user);
      // đường dẫn dành cho admin
      if (to.name === "admin") {

        let url = "https://ext.botup.io/v1/users/users/getuser"
        axios.get(url)
          .then((reponses) => {
            if (reponses.data.data.user.role === "admin") {
              next();
            }
            else {
              next({
                path: "/",
                params: { nextUrl: to.fullPath }
              });
            }
          })
          .catch((err) => {
            console.log(err);
            next({
              path: "/",
              params: { nextUrl: to.fullPath }
            });
            localStorage.removeItem("user-cms");
          })
      } else {
        next();
      }

    }
  } else {
    if (user) {
      Vue.prototype.$userLogged = JSON.parse(user);
      next({
        path: "/",
        params: { nextUrl: to.fullPath }
      });
    } else {
      next();
    }
  }
});

export default router
