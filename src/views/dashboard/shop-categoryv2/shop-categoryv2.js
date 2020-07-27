import Resful from "@/services/resful.js"

export default {
   data() {
      return {
         modal_create: false,
         categoryNew:{
            category_name: "",
            description:""
         },
         category_list: "",
         modal_update: false,
         categoryUpdate: {
            category_name_update: "",
            description_update:""
         },
         id_update: ""
      }
   },
   mounted() {
      this.getCategoryList();
   },
   methods: {
      async createNewCategory() {
         try {

            if (!this.categoryNew.category_name) {
               return this.$toasted.show("Vui lòng nhập danh mục !", {
                  type: "error",
                  duration: 5000
               });
            }

            let body = {
               store_id: this.$route.query.store_id,
               category_name: this.categoryNew.category_name,
               description: this.categoryNew.description
            }
            let create_category = await Resful.post("selling-page/category/category_create", body)
            if (create_category) {

               this.$toasted.success("Tạo danh mục thành công", {
                  duration: 5000
               });
               this.modal_create = false
               this.getCategoryList()
            }

         } catch (error) {
            console.log(error)
         }
      },

      async getCategoryList() {
         try {
            let body = {
               store_id: this.$route.query.store_id
            }
            let get_category_list = await Resful.post("selling-page/category/category_read", body);
            this.category_list = get_category_list.data.data

         } catch (error) {
            console.log(error)
         }
      },

      isShowCategoryUpdate(item) {
         console.log(item);
         this.modal_update = true
         this.categoryUpdate.category_name_update = item.category_name
         this.id_update = item.id
      },

      async updateCategory() {
         try {

            if (!this.categoryUpdate.category_name_update) {
               return this.$toasted.show("Vui lòng nhập danh mục !", {
                  type: "error",
                  duration: 5000
               });
            }

            let body = {
               id: this.id_update,
               category_name: this.categoryUpdate.category_name_update,
               description: this.categoryUpdate.description_update
            }

            let update_category = await Resful.post("selling-page/category/category_update", body)
            if (update_category) {

               this.$toasted.success("Update danh mục thành công", {
                  duration: 5000
               });
               this.modal_update = false
               this.getCategoryList()
            }

         } catch (error) {
            console.log(error)
         }
      },

      removeCategory(id) {
         this.$toasted.show("Bạn có chắc chắn muốn xóa danh mục này", {
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
                     this.deleteCategory(id)
                  }
               }
            ]
         })
      },
      async deleteCategory(id) {
         this.$store.state.$loading = true;
         try {
            let body = {
               id: id
            }
            let deleteCategory = await Resful.post("selling-page/category/category_delete", body)
            if (deleteCategory) {
               this.getCategoryList();
               this.$store.state.$loading = false;
               this.$toasted.success("xóa shop thành công", {
                  duration: 5000
               });

            }
         } catch (error) {
            this.$store.state.$loading = false;
            console.log(error);
            return error
         }
      }

   }
}