import Resful from "@/services/resful.js"
export default {
    data() {
        return {
            shop: {
                shopName: "",
                shopDescription: "",
                shopAddress: "",
                shopPhone: "",
                shopEmail: "",
                shopUrl: ""
            }
        }
    },
    methods: {
        async createShop() {
            try {
                //Kiểm tra tên shop
                if (!this.shop.shopName) {
                    return this.$toasted.show("Vui lòng nhập tên Shop !", {
                        type: "error",
                        duration: 5000
                    });
                }

                let body = {
                    user: this.$userLogged.user.id,
                    shopName: this.shop.shopName,
                    shopDescription: this.shop.shopDescription,
                    shopAddress: this.shop.shopAddress,
                    shopPhone: this.shop.shopPhone,
                    shopEmail: this.shop.shopEmail,
                    shopUrl: this.shop.shopUrl
                }
                let createShop =  await Resful.post("cms-sale/shoplist/create_shop", body)
                if(createShop) {
                    this.$router.push({ path: "shop-list"});
                    // thông báo
                    this.$toasted.success("Tạo Shop thành công",{
                        duration:5000
                    });
                }
            } catch (error) {
                console.log(error)
            }

        }
    }
}