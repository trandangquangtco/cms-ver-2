import Resful from "@/services/resful.js"

export default {
    data() {
        return {
            modal_create: false,
            category_name: "",
            category_list : "",
            modal_update: false ,
            category_name_update: "",
            id_update: ""
        }
    },
    mounted() {
        this.getCategoryList();
    },
    methods: {
        async createNewCategory() {
            try {

                if(!this.category_name) {
                    return this.$toasted.show("Vui lòng nhập danh mục !", {
                        type: "error",
                        duration: 5000
                    });
                }

                let body = {
                    shop: this.$route.query.id,
                    categoryName: this.category_name
                }
                let create_category = await Resful.post("cms-sale/Category/create_category", body)
                if(create_category) {

                    this.$toasted.success("Tạo danh mục thành công",{
                        duration:5000
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
                    shop: this.$route.query.id
                }

                let get_category_list = await Resful.post("cms-sale/Category/get_category_list", body);
                this.category_list = get_category_list.data.data
                
            } catch (error) {
                console.log(error)
            }
        },

        isShowCategoryUpdate(item) {
            this.modal_update = true
            this.category_name_update = item.categoryName
            this.id_update = item.id
        },

        async updateCategory() {
            try {

                if(!this.category_name_update) {
                    return this.$toasted.show("Vui lòng nhập danh mục !", {
                        type: "error",
                        duration: 5000
                    });
                }

                let body = {
                    id: this.id_update,
                    categoryName: this.category_name_update    
                }

                let update_category = await Resful.post("cms-sale/Category/update_category", body)
                if(update_category) {

                    this.$toasted.success("Update danh mục thành công",{
                        duration:5000
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
                let deleteCategory = await Resful.post("cms-sale/Category/delete_category", body)
                if(deleteCategory) {
                    this.getCategoryList();
                    this.$store.state.$loading = false;
                    this.$toasted.success("xóa shop thành công",{
                        duration:5000
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