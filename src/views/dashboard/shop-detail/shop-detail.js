import Resful from "@/services/resful.js"
import XLSX from "xlsx"
import router from "../../../router"
export default {
    data() {
        return {
            listUpload: '',
            listTitle: '',
            isShowModal: false,
            listKeyCMS: [
                //Thông tin chính
                {
                    name: "1",
                    value: "",
                    text: "Mã sản phẩm"
                },
                {
                    name: "2",
                    value: "",
                    text: "Tên sản phẩm"
                },
                {
                    name: "3",
                    value: "",
                    text: "Mô tả sản phẩm"
                },
                {
                    name: "4",
                    value: "",
                    text: "Giá sản phẩm"
                },
                {
                    name: "5",
                    value: "",
                    text: "Số lượng sản phẩm"
                },
                {
                    name: "6",
                    value: "",
                    text: "Hình ảnh chính"
                },
                {
                    name: '7',
                    value: "",
                    text: "Danh mục"
                },

                //Thông tin thêm
                {
                    name: '8',
                    value: "",
                    text: "Giá gốc"
                },
                {
                    name: '9',
                    value: "",
                    text: "Discount"
                },
                {
                    name: '10',
                    value: "",
                    text: "Đã bán"
                },
                {
                    name: '11',
                    value: "",
                    text: "Hình ảnh mô tả"
                },
                
                //Hình ảnh thêm
                {
                    name: '12',
                    value: "",
                    text: "Hình ảnh 1"
                },
                {
                    name: '13',
                    value: "",
                    text: "Hình ảnh 2"
                },
                {
                    name: '14',
                    value: "",
                    text: "Hình ảnh 3"
                },
                {
                    name: '15',
                    value: "",
                    text: "Hình ảnh 4"
                },
                {
                    name: '16',
                    value: "",
                    text: "Hình ảnh 5"
                },
                {
                    name: '17',
                    value: "",
                    text: "Hình ảnh 6"
                },
                {
                    name: '18',
                    value: "",
                    text: "Hình ảnh 7"
                },

                //Size sản phẩm
                {
                    name: '19',
                    value: "",
                    text: "Size 1"
                },
                {
                    name: '20',
                    value: "",
                    text: "Size 2"
                },
                {
                    name: '21',
                    value: "",
                    text: "Size 3"
                },
                {
                    name: '22',
                    value: "",
                    text: "Size 4"
                },
                {
                    name: '23',
                    value: "",
                    text: "Size 5"
                },
                {
                    name: '24',
                    value: "",
                    text: "Size 6"
                },
                {
                    name: '25',
                    value: "",
                    text: "Size 7"
                },
                {
                    name: '26',
                    value: "",
                    text: "Size 8"
                },
                {
                    name: '27',
                    value: "",
                    text: "Size 9"
                },
                {
                    name: '28',
                    value: "",
                    text: "Size 10"
                },

                //Màu sắc sản phẩm
                {
                    name: '29',
                    value: "",
                    text: "Màu sắc 1"
                },
                {
                    name: '30',
                    value: "",
                    text: "Màu sắc 2"
                },
                {
                    name: '31',
                    value: "",
                    text: "Màu sắc 3"
                },
                {
                    name: '32',
                    value: "",
                    text: "Màu sắc 4"
                },
                {
                    name: '33',
                    value: "",
                    text: "Màu sắc 5"
                },
                {
                    name: '34',
                    value: "",
                    text: "Màu sắc 6"
                },
                {
                    name: '35',
                    value: "",
                    text: "Màu sắc 7"
                },
                {
                    name: '36',
                    value: "",
                    text: "Màu sắc 8"
                },
                {
                    name: '37',
                    value: "",
                    text: "Màu sắc 9"
                },
                {
                    name: '38',
                    value: "",
                    text: "Màu sắc 10"
                },

                //Thuộc tính khác
                {
                    name: '39',
                    value: "",
                    text: "Thuộc tính 1"
                },
                {
                    name: '40',
                    value: "",
                    text: "Thuộc tính 2"
                },{
                    name: '41',
                    value: "",
                    text: "Thuộc tính 3"
                },
                {
                    name: '42',
                    value: "",
                    text: "Thuộc tính 4"
                },
                {
                    name: '43',
                    value: "",
                    text: "Thuộc tính 5"
                },
                {
                    name: '44',
                    value: "",
                    text: "Thuộc tính 6"
                },
                {
                    name: '45',
                    value: "",
                    text: "Thuộc tính 7"
                },
                {
                    name: '46',
                    value: "",
                    text: "Thuộc tính 8"
                },
                {
                    name: '47',
                    value: "",
                    text: "Thuộc tính 9"
                },
                {
                    name: '48',
                    value: "",
                    text: "Thuộc tính 10"
                },

            ],
            listProduct: [],
            shopID: this.$route.query.id,
            close: false,
            productItem: {},
            page: this.$route.query.page,
            categoryList: "",
            category_filter: "",
        }
    },
    mounted() {
        this.getProductList(this.shopID, this.category_filter);
        this.getCategoryList();
    },
    methods: {
        //Tìm tới file excel upload
        previewFiles(event) {
            const files = event.target.files;
            if (files && files[0]) this.convert(files[0]);
        },

        //Chuyển đổi file excel thành array
        convert(file) {

            const reader = new FileReader();
            reader.onload = (e) => {
                /* Parse data */
                const bstr = e.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                /* Get first worksheet */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                /* Convert array of arrays */
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

                const rowTitle = data[0];

                //List key của excel
                this.listTitle = data[0]

                if (rowTitle.length > 0) {
                    this.isShowModal = true
                }

                const rowValue = data.slice(1, data.length + 1)
                let dataUpload = [];

                for (let i = 0; i < rowValue.length; i++) {

                    var value = rowValue[i];

                    var item = {};

                    for (var j = 0; j < rowTitle.length; j++) {
                        item[rowTitle[j]] = value[j];
                    }
                    dataUpload.push(item);
                }

                //List data json
                this.listUpload = dataUpload;
                console.log(this.listUpload)



            };
            reader.readAsBinaryString(file);

            console.log(this.$route.query.id)
        },

        //lưu key đầu vào
        mapsKeyCMS: function () {


            if (!this.listKeyCMS[1].value) {
                return this.$toasted.show("Vui lòng chọn tên sản phẩm !", {
                    type: "error",
                    duration: 5000
                });
            }
            if (!this.listKeyCMS[3].value) {
                return this.$toasted.show("Vui lòng chọn giá sản phẩm !", {
                    type: "error",
                    duration: 5000
                });
            }
            if (!this.listKeyCMS[4].value) {
                return this.$toasted.show("Vui lòng chọn số lượng sản phẩm !", {
                    type: "error",
                    duration: 5000
                });
            }


            let data = this.listUpload

            var i;
            for (i = 0; i < data.length; i++) {

                //Xử lý thông tin chính
                data[i].shop = this.$route.query.id;
                data[i].productID = data[i][this.listKeyCMS[0].value];
                data[i].productName = data[i][this.listKeyCMS[1].value];
                data[i].productDescription = data[i][this.listKeyCMS[2].value];
                data[i].productPrice = data[i][this.listKeyCMS[3].value];
                data[i].productQuantity = data[i][this.listKeyCMS[4].value];
                data[i].productPicture = data[i][this.listKeyCMS[5].value];
                data[i].categoryName = data[i][this.listKeyCMS[6].value];

                //Xử lý thông tin phụ
                data[i].cost = data[i][this.listKeyCMS[7].value];
                data[i].discount = data[i][this.listKeyCMS[8].value];
                data[i].sold = data[i][this.listKeyCMS[9].value];
                data[i].productImageDescription = data[i][this.listKeyCMS[10].value];

                //Xử lý ảnh
                data[i].productImages1 = data[i][this.listKeyCMS[11].value];
                data[i].productImages2 = data[i][this.listKeyCMS[12].value];
                data[i].productImages3 = data[i][this.listKeyCMS[13].value];
                data[i].productImages4 = data[i][this.listKeyCMS[14].value];
                data[i].productImages5 = data[i][this.listKeyCMS[15].value];
                data[i].productImages6 = data[i][this.listKeyCMS[16].value];
                data[i].productImages7 = data[i][this.listKeyCMS[17].value];

                //Xử lý size sản phẩm
                data[i].productSize1 = data[i][this.listKeyCMS[18].value];
                data[i].productSize2 = data[i][this.listKeyCMS[19].value];
                data[i].productSize3 = data[i][this.listKeyCMS[20].value];
                data[i].productSize4 = data[i][this.listKeyCMS[21].value];
                data[i].productSize5 = data[i][this.listKeyCMS[22].value];
                data[i].productSize6 = data[i][this.listKeyCMS[23].value];
                data[i].productSize7 = data[i][this.listKeyCMS[24].value];
                data[i].productSize8 = data[i][this.listKeyCMS[25].value];
                data[i].productSize9 = data[i][this.listKeyCMS[26].value];
                data[i].productSize10 = data[i][this.listKeyCMS[27].value];

                //Xử lý màu sắc sản phẩm
                data[i].productColor1 = data[i][this.listKeyCMS[28].value];
                data[i].productColor2 = data[i][this.listKeyCMS[29].value];
                data[i].productColor3 = data[i][this.listKeyCMS[30].value];
                data[i].productColor4 = data[i][this.listKeyCMS[31].value];
                data[i].productColor5 = data[i][this.listKeyCMS[32].value];
                data[i].productColor6 = data[i][this.listKeyCMS[33].value];
                data[i].productColor7 = data[i][this.listKeyCMS[34].value];
                data[i].productColor8 = data[i][this.listKeyCMS[35].value];
                data[i].productColor9 = data[i][this.listKeyCMS[36].value];
                data[i].productColor10 = data[i][this.listKeyCMS[37].value];

                //Xử lý thông tin khác của sản phẩm
                data[i].productOtherInfo1 = data[i][this.listKeyCMS[38].value];
                data[i].productOtherInfo2 = data[i][this.listKeyCMS[39].value];
                data[i].productOtherInfo3 = data[i][this.listKeyCMS[40].value];
                data[i].productOtherInfo4 = data[i][this.listKeyCMS[41].value];
                data[i].productOtherInfo5 = data[i][this.listKeyCMS[42].value];
                data[i].productOtherInfo6 = data[i][this.listKeyCMS[43].value];
                data[i].productOtherInfo7 = data[i][this.listKeyCMS[44].value];
                data[i].productOtherInfo8 = data[i][this.listKeyCMS[45].value];
                data[i].productOtherInfo9 = data[i][this.listKeyCMS[46].value];
                data[i].productOtherInfo10 = data[i][this.listKeyCMS[47].value];


                delete data[i][this.listKeyCMS[0].value];
                delete data[i][this.listKeyCMS[1].value];
                delete data[i][this.listKeyCMS[2].value];
                delete data[i][this.listKeyCMS[3].value];
                delete data[i][this.listKeyCMS[4].value];
                delete data[i][this.listKeyCMS[5].value];
                delete data[i][this.listKeyCMS[6].value]
                delete data[i][this.listKeyCMS[7].value]
                delete data[i][this.listKeyCMS[8].value]
                delete data[i][this.listKeyCMS[9].value]
                delete data[i][this.listKeyCMS[10].value]
                delete data[i][this.listKeyCMS[11].value]
                delete data[i][this.listKeyCMS[12].value]
                delete data[i][this.listKeyCMS[13].value]
                delete data[i][this.listKeyCMS[14].value]
                delete data[i][this.listKeyCMS[15].value]
                delete data[i][this.listKeyCMS[16].value]
                delete data[i][this.listKeyCMS[17].value]
                delete data[i][this.listKeyCMS[18].value]
                delete data[i][this.listKeyCMS[19].value]
                delete data[i][this.listKeyCMS[20].value]
                delete data[i][this.listKeyCMS[21].value]
                delete data[i][this.listKeyCMS[22].value]
                delete data[i][this.listKeyCMS[23].value]
                delete data[i][this.listKeyCMS[24].value]
                delete data[i][this.listKeyCMS[25].value]
                delete data[i][this.listKeyCMS[26].value]
                delete data[i][this.listKeyCMS[27].value]
                delete data[i][this.listKeyCMS[28].value]
                delete data[i][this.listKeyCMS[29].value]
                delete data[i][this.listKeyCMS[30].value]
                delete data[i][this.listKeyCMS[31].value]
                delete data[i][this.listKeyCMS[32].value]
                delete data[i][this.listKeyCMS[33].value]
                delete data[i][this.listKeyCMS[34].value]
                delete data[i][this.listKeyCMS[35].value]
                delete data[i][this.listKeyCMS[36].value]
                delete data[i][this.listKeyCMS[37].value]
                delete data[i][this.listKeyCMS[38].value]
                delete data[i][this.listKeyCMS[39].value]
                delete data[i][this.listKeyCMS[40].value]
                delete data[i][this.listKeyCMS[41].value]
                delete data[i][this.listKeyCMS[42].value]
                delete data[i][this.listKeyCMS[43].value]
                delete data[i][this.listKeyCMS[44].value]
                delete data[i][this.listKeyCMS[45].value]
                delete data[i][this.listKeyCMS[46].value]
                delete data[i][this.listKeyCMS[47].value]
            }

            console.log("first handle", data)

            data.map(item => {
                //Xử lý ảnh
                item.productImages = []
                if(item.productImages1) {
                    item.productImages.push(item.productImages1)
                }
                if(item.productImages2) {
                    item.productImages.push(item.productImages2)
                }
                if(item.productImages3) {
                    item.productImages.push(item.productImages3)
                }
                if(item.productImages4) {
                    item.productImages.push(item.productImages4)
                }
                if(item.productImages5) {
                    item.productImages.push(item.productImages5)
                }
                if(item.productImages6) {
                    item.productImages.push(item.productImages6)
                }
                if(item.productImages7) {
                    item.productImages.push(item.productImages7)
                }

                //Xử lý size    
                item.productSizes = []
                if(item.productSize1) {
                    item.productSizes.push(item.productSize1)
                }
                if(item.productSize2) {
                    item.productSizes.push(item.productSize2)
                }
                if(item.productSize3) {
                    item.productSizes.push(item.productSize3)
                }
                if(item.productSize4) {
                    item.productSizes.push(item.productSize4)
                }
                if(item.productSize5) {
                    item.productSizes.push(item.productSize5)
                }
                if(item.productSize6) {
                    item.productSizes.push(item.productSize6)
                }
                if(item.productSize7) {
                    item.productSizes.push(item.productSize7)
                }
                if(item.productSize8) {
                    item.productSizes.push(item.productSize8)
                }
                if(item.productSize9) {
                    item.productSizes.push(item.productSize9)
                }
                if(item.productSize10) {
                    item.productSizes.push(item.productSize10)
                }


                //Xử lý màu sắc
                item.productColors = [];
                if(item.productColor1) {
                    item.productColors.push(item.productColor1)
                }
                if(item.productColor2) {
                    item.productColors.push(item.productColor2)
                }
                if(item.productColor3) {
                    item.productColors.push(item.productColor3)
                }
                if(item.productColor4) {
                    item.productColors.push(item.productColor4)
                }
                if(item.productColor5) {
                    item.productColors.push(item.productColor5)
                }
                if(item.productColor6) {
                    item.productColors.push(item.productColor6)
                }
                if(item.productColor7) {
                    item.productColors.push(item.productColor7)
                }
                if(item.productColor8) {
                    item.productColors.push(item.productColor8)
                }
                if(item.productColor9) {
                    item.productColors.push(item.productColor9)
                }
                if(item.productColor10) {
                    item.productColors.push(item.productColor10)
                }

                //Xử lý thông tin khác
                item.otherInfor = []
                if(item.productOtherInfo1) {
                    item.otherInfor.push(item.productOtherInfo1)
                }
                if(item.productOtherInfo2) {
                    item.otherInfor.push(item.productOtherInfo2)
                }
                if(item.productOtherInfo3) {
                    item.otherInfor.push(item.productOtherInfo3)
                }
                if(item.productOtherInfo4) {
                    item.otherInfor.push(item.productOtherInfo4)
                }
                if(item.productOtherInfo5) {
                    item.otherInfor.push(item.productOtherInfo5)
                }
                if(item.productOtherInfo6) {
                    item.otherInfor.push(item.productOtherInfo6)
                }
                if(item.productOtherInfo7) {
                    item.otherInfor.push(item.productOtherInfo7)
                }
                if(item.productOtherInfo8) {
                    item.otherInfor.push(item.productOtherInfo8)
                }
                if(item.productOtherInfo9) {
                    item.otherInfor.push(item.productOtherInfo9)
                }
                if(item.productOtherInfo10) {
                    item.otherInfor.push(item.productOtherInfo10)
                }

                return item
            })

            this.listUpload = data

            console.log('data after', data)
            this.isShowModal = false
            this.createManyproduct();
        },

        //Tạo ra nhiều sản phẩm từ sheet
        async createManyproduct() {
            try {
                this.$store.state.$loading = true;
                //Kiểm tra data import
                if (!this.listUpload) {
                    return;
                }

                // Xóa toàn bộ sản phẩm đã tồn tại
                let body = {
                    shop: this.$route.query.id,
                }

                let deleteAllProduct = await Resful.post("cms-sale/ProductList/delete_all_product", body)
                console.log("xóa thành công", deleteAllProduct)
                if (!deleteAllProduct.length > 0) { }

                

                //Tạo mới tất cả Sản phẩm
                let data = this.listUpload
                let createManyproduct = await Resful.post("cms-sale/ProductList/create_many_product", data)
                console.log("Thêm thành công", createManyproduct)
                location.reload();

            } catch (error) {
                console.log(error)
            }
        },

        //Lấy danh sách sản phẩm
        async getProductList(shop, category) {
            try {
                // Lấy toàn bộ sản phẩm của shop
                let body = {
                    shop: shop,
                    categoryName: category,
                    page: this.page,

                }
                if(!category) delete body.categoryName
                let getproductList = await Resful.post("cms-sale/ProductList/get_product_list", body)
                this.listProduct = getproductList.data.data
                this.$store.state.$loading = false;
            } catch (error) {
                console.log(error)
            }
        },

        //Điều hướng sang danh sách order
        getOrderList() {
            router.push({ path: 'shop-order', query: { id: this.$route.query.id, page: 1} })
        },

        //
        getProductDetail(item) {
            this.close = true;
            this.productItem = item
        },

        //Xóa sản phẩm
        async deleteProduct(productID) {
            try {
                let body = {
                    productID: productID
                }
                await Resful.post("cms-sale/ProductList/delete_product", body)

                this.getProductList()

            } catch (error) {
                this.$store.state.$loading = false;
                console.log(error)
            }
        },

        //Xác nhận xóa sản phẩm
        removeProduct(productID) {
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
                            this.deleteProduct(productID);
                            this.$store.state.$loading = true;
                        }
                    }
                ]
            })
        },

        //Điều hướng update sản phẩm
        getProductInfor(id) {
            router.push({ path: 'update-product', query: { product: id } });
        },

        //Phân trang tiến
        nextPage() {
            let page = this.page
            let id = this.shopID
            let pages = Number(page) + 1 
            router.push({ path: 'shop-detail', query: { id: id, page: pages} });
            this.getProductList()
            location.reload();
            window.scrollTo(0,0);
        },
        //Phân trang lùi
        previousPage() {
            let page = this.page
            if(page > 1) {
                let id = this.shopID
                let pages = page - 1
                router.push({ path: 'shop-detail', query: { id: id, page: pages} });
                this.getProductList();
                location.reload();
                window.scrollTo(0,0);
            }
        },

        //Lấy list danh mục
        async getCategoryList() {
            try {
                let body = {
                    shop: this.$route.query.id,
                }
                let getproductList = await Resful.post("cms-sale/ProductList/get_category_name", body)
                this.categoryList = getproductList.data.data
            } catch (error) {
                console.log(error);
            }
        },

        filterByCategoryName(category_name) {
            this.getProductList(this.shopID, category_name)
        }
        
    }
}
