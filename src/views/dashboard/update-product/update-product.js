import Resful from "@/services/resful.js"
import router from "../../../router"
export default {
    data() {
        return {
            productObjectID: this.$route.query.product,
            productInfor: "",
            Pname: "",
            Pdescription: "",
            Pprice: "",
            Pquantity: "",
            Ppiture: ""
        }
    },
    mounted() {
        this.getProductInfor()
    },
    methods: {
        //Lấy thông tin sản phẩm
        async getProductInfor() {
            try {
                let body = {
                    productID: this.productObjectID
                }
                let getProductInfor = await Resful.post("cms-sale/ProductList/get_product_detail", body)
                this.productInfor = getProductInfor.data.data[0]
                this.Pname = this.productInfor.productName
                this.Pdescription = this.productInfor.productDescription
                this.Pprice = this.productInfor.productPrice
                this.Pquantity = this.productInfor.productQuantity
                this.Ppiture = this.productInfor.productPicture
                
            } catch (error) {
                console.log(error)
            }
        },
        async updateProduct() {
            try {
                let body = {
                    productID: this.productObjectID,
                    productName: this.Pname,
                    productDescription: this.Pdescription,
                    productPrice: this.Pprice,
                    productQuantity: this.Pquantity,
                    productPicture: this.Ppiture
                }
                await Resful.post("cms-sale/ProductList/update_product", body)
                this.$toasted.success("Update sản phẩm thành công",{
                    duration:5000
                });
            } catch (error) {
                console.log(error)
                return this.$toasted.show("Update sản phẩm không thành công !", {
                    type: "error",
                    duration: 5000
                });
            }
            
        }
    }
}