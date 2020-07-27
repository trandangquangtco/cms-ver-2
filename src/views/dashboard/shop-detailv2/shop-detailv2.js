import Resful from "@/services/resful.js"
import XLSX from "xlsx"
import axios from 'axios'
import router from "../../../router"
export default {
    data() {
        return {
            listUpload: '',
            listTitle: '',
            isShowModal: false,
            listProduct: [],
            close: false,
            createnew: false,
            update: false,
            productItem: {},
            page: this.$route.query.page,
            categoryList: '',
            categoryId: [],
            categoryname: '',
            productShow: {},
            storeID: this.$route.query.store_id,
            search_product:'',
            productNew: {
                product_code: '',
                product_name: '',
                product_price: '',
                product_quantity: '',
                product_description: '',
                category_id: '',
                image: '',
                images: [],
                colors: [],
                sizes: [],
                other_info: '',
                sold: '',
                product_unit: '',
                discount: ''
            },
        }
    },
    mounted() {
        this.getCategoryList();
        this.getProductList();
        // this.nameCategoryById(this.$route.query.store_id,this.category_filter)
    },
    methods: {

        // -----Get danh mục------
        async getCategoryList() {
            try {
                let body = { store_id: this.$route.query.store_id }
                let listcate = await Resful.post('selling-page/category/category_read', body)
                this.categoryList = listcate.data.data
                console.log('object', listcate.data.data);
            } catch (error) {
                console.log('err', error);
            }
        },

        // ------thêm sản phẩm------
        isNewProduct() {
            this.createnew = true
        },

        async createProduct() {
            try {
                if (!this.productNew.product_name) {
                    return this.$toasted.show('Tên sản phẩm không được trống', {
                        type: "error",
                        duration: 5000
                    });

                }
                let body = {
                    store_id: this.$route.query.store_id,
                    product_code: this.productNew.product_code,
                    product_name: this.productNew.product_name,
                    product_price: this.productNew.product_price,
                    product_quantity: this.productNew.product_quantity,
                    product_description: this.productNew.product_description,
                    category_id: this.productNew.category_id,
                    image: this.productNew.image,
                    images: this.productNew.images,
                    colors: this.productNew.colors,
                    sizes: this.productNew.sizes,
                    other_info: this.productNew.other_info,
                    sold: this.productNew.sold,
                    product_unit: this.productNew.product_unit,
                    discount: this.productNew.discount
                }
                let createProduct = await Resful.post("selling-page/product/product_create", body)
                if (createProduct) {
                    this.getProductList(this.$route.query.store_id)
                    // thông báo
                    this.$toasted.success("Tạo xong sản phẩm", {
                        duration: 5000
                    });
                    this.createnew = false
                }
            } catch (error) {
                console.log(error)
            }
        },
        // -------end Thêm sản phẩm-------

        //Get sản phẩm
        async getProductList() {
            try {
                let body = {
                    store_id: this.$route.query.store_id,
                }
                let getproductList = await Resful.post("selling-page/product/product_read", body)
                console.log('getProductlist', getproductList);
                this.listProduct = getproductList.data.data.map(item => {
                    item.category_name = ''
                    this.categoryList.map(item2 => {
                        if(item.category_id == item2.id){
                            item.category_name = item2.category_name
                        }
                    })
                    return item
                })

                this.$store.state.$loading = false;

            } catch (error) {
                console.log(error)
            }
        },

        search(){
            // let input = document.getElementById('search').value 
            // input=input.toLowerCase(); 
            // let z = document.getElementsByClassName('pname');  
        
            // let x = this.listProduct
            // let y=x.map(item=>{
            //     return item.product_name
            // })
            // console.log(y);
            // for(let i= 0;i<=y.length;i++){
            //     if(y.includes(input)){
            //         alert('true')
            //     }else{alert('false')}
            // }
            
           
            // if (!x[i].innerHTML.toLowerCase().includes(input)) { 
            //     alert('sai')
            //     }else { 
            //     // x[i].style.display="list-item";   
            //     this.getProductDetail(item)     
            //     } 
            // x.forEach(element=>{
            //     let y = []
            //     let z = element.product_name
            //     y.map(item=>{
            //         return item
            //     })
            //     // if((element.product_name).includes($('#search').val().toLowerCase())){
            //     //     alert('dung')
            //     // }else{
            //     //     alert('sai')
            //     // }
            // })

        },
        //

        getProductDetail(item) {
            console.log('detail', item);
            this.close = true;
            this.productItem = item
        },

        //Xóa sản phẩm
        async deleteProduct(id) {
            try {
                let body = {
                    id: id
                }
                await Resful.post("selling-page/product/product_delete", body)

                this.getProductList(this.shopID)

            } catch (error) {
                this.$store.state.$loading = false;
                console.log(error)
            }
        },

        //Xác nhận xóa sản phẩm
        removeProduct(item) {
            this.$toasted.show("Bạn có chắc chắn muốn xóa sản phẩm", {
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
                            this.deleteProduct(item.id);
                            this.$store.state.$loading = true;
                        }
                    }
                ]
            })
        },

        // -----Update Product------
        async updateProduct() {
            try {
                let body = {
                    id: this.productShow.id,
                    product_code: this.productShow.product_code,
                    product_name: this.productShow.product_name,
                    product_description: this.productShow.product_description,
                    product_price: this.productShow.product_price,
                    product_quantity: this.productShow.product_quantity,
                    product_category: this.productShow.product_category,
                    colors: this.productShow.colors,
                    sizes: this.productShow.sizes
                }
                await Resful.post("selling-page/product/product_update", body)
                this.$toasted.success("Update sản phẩm thành công", {
                    duration: 5000
                });
            } catch (error) {
                console.log(error)
                return this.$toasted.show("Update sản phẩm không thành công !", {
                    type: "error",
                    duration: 5000
                });
            }
            this.update = false
        },

        isProductUpdate(item) {
            this.update = true
            this.productShow = item
            console.log('iem', item);
        },

    }
}