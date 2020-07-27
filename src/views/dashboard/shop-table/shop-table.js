import Resful from "@/services/resful.js"

export default {
    data() {
        return {
            modal_create: false,
            table_name: "",
            table_number: "",
            modal_update: false ,
            table_list: [],
            table_info: {}
            
        }
    },
    mounted() {
        this.getTableList();
    },
    methods: {
        async createNewTable() {
            try {

                if(!this.table_name) {
                    return this.$toasted.show("Vui lòng nhập tên bàn !", {
                        type: "error",
                        duration: 5000
                    });
                }
                if(!this.table_number) {
                    return this.$toasted.show("Vui lòng nhập số bàn !", {
                        type: "error",
                        duration: 5000
                    });
                }

                let body = {
                    shop: this.$route.query.id,
                    table_name: this.table_name,
                    table_number: this.table_number
                }
                let create_table = await Resful.post("cms-sale/Table/create-table", body)
                if(create_table) {

                    this.$toasted.success("Tạo bàn thành công",{
                        duration:5000
                    });
                    this.modal_create = false
                    this.getTableList()
                }
                
            } catch (error) {
                console.log(error)
            }
        },

        async getTableList() {
            try {
                let body = {
                    shop: this.$route.query.id
                }

                let get_table_list = await Resful.post("cms-sale/Table/read-table", body);
                this.table_list = get_table_list.data.data
                
            } catch (error) {
                console.log(error)
            }
        },

        isShowTableUpdate(item) {
            this.modal_update = true
            this.table_info = item
        },

        async updateTable() {
            try {

                if(!this.table_info.table_name) {
                    return this.$toasted.show("Vui lòng nhập tên bàn !", {
                        type: "error",
                        duration: 5000
                    });
                }
                if(!this.table_info.table_number) {
                    return this.$toasted.show("Vui lòng nhập số bàn !", {
                        type: "error",
                        duration: 5000
                    });
                }

                let body = {
                    shop: this.$route.query.id,
                    id: this.table_info.id,
                    table_name: this.table_info.table_name,
                    table_number: this.table_info.table_number   
                }

                let update_table = await Resful.post("cms-sale/Table/update-table", body)
                if(update_table) {

                    this.$toasted.success("Update thông tin bàn thành công",{
                        duration:5000
                    });
                    this.modal_update = false
                    this.getTableList()
                }
                
            } catch (error) {
                console.log(error)
            }
        },

        removeTable(item) {
            this.$toasted.show("Bạn có chắc chắn muốn xóa bàn này", {
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
                            this.deleteTable(item)
                        }
                    }
                ]
            })
        },
        async deleteTable(item) {
            this.$store.state.$loading = true;
            try {
                let body = {
                    shop: item.shop,
                    id: item.id
                }
                let deleteTable = await Resful.post("cms-sale/Table/delete-table", body)
                if(deleteTable) {
                    this.getTableList();
                    this.$store.state.$loading = false;
                    this.$toasted.success("Xóa bàn thành công",{
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