import Resful from "@/services/resful.js"
import router from '../../../router'
import Vue from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import VueSweetalert2 from 'vue-sweetalert2';
Vue.use(VueSweetalert2);
export default {
  components:{
    Loading
  },
  data() {
    return {
      modal:false,
      login:{
        apiUserName:'',
        secretKey:''
      },
      isLoading: false,
      fullPage: true
    }
  },
  methods: {
    confirm(){
      this.modal = true
    },
    async merge() {
      try {
        if(!this.login.apiUserName||!this.login.secretKey){
          return this.$toasted.show('Không được nhập thiếu dữ kiện', {
            type: "error",
            duration: 5000
        });
        }
        let body = {
          store_id: this.$route.query.store_id,
          api_username: this.login.apiUserName,
          secret_key: this.login.secretKey
        }
        let merge = await Resful.post("selling-page/category/sync_category_nhanh_vn",body)
        let merge2 = await Resful.post("selling-page/product/sync_product_nhanh_vn",body)
        if(merge&&merge2){
          this.isLoading = true;
          this.$toasted.show("Đang đồng bộ dữ liệu",{
            position: "top-center",
            theme: "bubble",
            duration: 300000
          });
          // simulate AJAX
          setTimeout(() => {
            this.isLoading = false
          },300000)
        }       
      } catch (error) {
        this.$toasted.show("Sai Api-Username hoặc SecretKey",{
          position: "top-center",
          theme: "bubble",
          duration: 300000
        });
      }
    },
  }
}