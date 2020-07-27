import Resful from "@/services/resful.js"
export default {
   data() {
      return {
         getListShop: "",
         modal: false,
         modalnew: false,
         shop_info: {},
         shop: {},
         shopnew: {
            store_name: "",
            store_description: "",
            store_address: "",
            store_phone: "",
            store_email: "",
         }
      }
   },
   mounted() {
      this.$store.state.$loading = false;
      this.getShopList();
   },
   methods: {
      async getShopList() {
         this.$store.state.$loading = false;
         try {
            let body = {
               // user: this.$userLogged.user.owner_id,
               owner_id: (JSON.parse(localStorage.getItem('user-cms'))).user.id
            }
            let getShopList = await Resful.post("selling-page/store/store_read", body)
            this.getListShop = getShopList.data.data
         } catch (error) {
            console.log(error);
         }
      },
      removeShop(id) {
         this.$toasted.show("Bạn có chắc chắn muốn xóa cửa hàng", {
            type: "info",
            theme: "outline",
            duration: 10000,
            action: [
               {
                  text: 'Hủy',
                  onClick: (e, toastObject) => {
                     toastObject.goAway(0);
                  }
               },
               {
                  text: 'Xóa',
                  onClick: (e, toastObject) => {
                     toastObject.goAway(0);
                     this.deleteShop(id)
                  }
               }
            ]
         })
      },
      async deleteShop(id) {
         this.$store.state.$loading = true;
         try {
            let body = {
               id: id
            }
            let deleteShop = await Resful.post("selling-page/store/store_delete", body)
            this.getShopList()
            this.$toasted.success("xóa shop thành công", {
               duration: 5000
            });
            console.log(deleteShop)

         } catch (error) {
            this.$store.state.$loading = false;
            console.log(error);
            return error
         }
      },
      isShowUpdate(item) {
         this.modal = true
         this.shop = item
         console.log('item',item);
      },
      isNewShop() {
         this.modalnew = true
      },
      async updateShop() {
         try {
            let body = {
               id: this.shop.id,
               store_name: this.shop.store_name,
               store_description: this.shop.store_description,
               store_address: this.shop.store_address,
               store_phone: this.shop.store_phone,
               store_email: this.shop.store_email,
            }
            let update_shop = await Resful.post("selling-page/store/store_update", body)
            if (update_shop) {
               this.$toasted.success("Update thông tin shop thành công", {
                  duration: 5000
               });
               this.modal = false
            }
         } catch (error) {
            return error
         }
      },
      async createShop() {
         try {
            //Kiểm tra tên shop
            if (!this.shopnew.store_name) {
               return this.$toasted.show(this.shopnew.store_name, {
                  type: "error",
                  duration: 5000
               });
            }
            let body = {
               owner_id: (JSON.parse(localStorage.getItem('user-cms'))).user.id,
               store_name: this.shopnew.store_name,
               store_description: this.shopnew.store_description,
               store_address: this.shopnew.store_address,
               store_phone: this.shopnew.store_phone,
               store_email: this.shopnew.store_email,
            }
            let createShop = await Resful.post("selling-page/store/store_create", body)
            if (createShop) {
               this.getShopList()
               // thông báo
               this.$toasted.success("Tạo Shop thành công", {
                  duration: 5000
               });
               this.modalnew = false
            }
         } catch (error) {
            console.log(error)
         }

      }
   }
}