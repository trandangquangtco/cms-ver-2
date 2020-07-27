import Resful from "@/services/resful.js"
export default {
    data() {
        return {
            getListShop: "",
            modal: false,
            shop_info: {},
            shop: {}
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
                    user: this.$userLogged.user.id,
                }
                console.log(body);
                let getShopList = await Resful.post("cms-sale/ShopList/get_shop_list", body)
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
                let deleteShop = await Resful.post("cms-sale/ShopList/delete_shop", body)
                this.getShopList()
                this.$toasted.success("xóa shop thành công",{
                    duration:5000
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
            this.shop =  item
        },
        async updateShop() {
            try {
                let body = {
                    id: this.shop.id,
                    shopName: this.shop.shopName,
                    shopDescription: this.shop.shopDescription,
                    shopAddress: this.shop.shopAddress,
                    shopPhone: this.shop.shopPhone,
                    shopEmail: this.shop.shopEmail,
                    shopUrl: this.shop.shopUrl
                }
                let update_shop = await Resful.post("cms-sale/shoplist/update_shop", body)
                if(update_shop) {
                    this.$toasted.success("Update thông tin shop thành công",{
                        duration:5000
                    });
                    this.modal = false
                }
            } catch (error) {
                console.log(error);
                return error
            }
        }
    }
}