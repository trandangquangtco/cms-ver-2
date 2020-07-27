export default {
    data() {
        return {
            picked: "null",
            close: false,
           
            // bắt đầu các tham số  phân trang
            current:1,
            limit: 20,
            countpage: 0,
            pageactive: 4,
            pageBegin: 0,
            page: [],
            // Kết thúc tham số phân trang
            search: "",
            listInvoice: [],
            invoice: {},
            newInvoice: {
                customerEmail: "",
                customerName: "",
                customerTel: "",
                note: "",
                type: null
            }
        }
    },
    mounted() {
        this.getInvoice(this.current);
    },

    methods : {

        searchForm() {
            this.ApiSearch();
        },
        // Tạo mới mã code
        createInvoice(evt) {
            evt.preventDefault();

            //  kiểm tra tên khách hàng
            if(!this.newInvoice.customerName){
                return this.$toasted.show("Vui lòng chọn nhập tên khách hàng !",{
                    type:"error",
                    duration: 10000
                });
            }

            // kiểm tra gói mua
            if(!this.newInvoice.type){
                return this.$toasted.show("Vui lòng chọn gói mua!",{
                    type:"error",
                    duration: 10000
                });
            }

            // gọi api tạo token
            let url = this.$configs.api +"minigame/CreateInvoice/create_invoice";

            this.$http
                    .post(url,this.newInvoice)
                    .then(res => {
                        this.invoice = this.newInvoice;
                        this.invoice.code = res.data.data.code;
                        this.newInvoice = {};

                        this.$toasted.success("Tạo token thành công !",{
                            duration: 5000
                        });
                        this.close = true;
                        this.getInvoice();
                       // console.log("data",res);
                        //this.invoice = res.data.data.code
                    })
                    .catch(err => {
                        console.log('Lỗi tạo token !', err);
                        
                        
                    })
        },

        // Xem chi tiết code khách hàng
        invoiceDetail(item) {
            this.invoice = item;
            this.close = true;
        },

        // Hàm lấy danh sách invoice
        getInvoice(current) {
            this.current = current;
            this.apiGetInvoice();
        },
        // gọi api lấy danh sách Invoice
        apiGetInvoice() {
            
            let url = this.$configs.api + "minigame/CreateInvoice/get_invoice";
            
            this.$http.get(url,{ 
                params: {
                    page : this.current+1,
                    perPage: this.limit
                },
            })
            .then(res => { 
                this.listInvoice = res.data.data.invoice;
                this.countpage = Math.ceil(res.data.data.count/this.limit);
                this.phantrang();
            })
            .catch(err => {
                //this.loadInterWind = false;
                console.log("lỗi lấy danh sách người chơi:", err.response);
                
            })
        },

        // Gọi api tìm kiếm 
        ApiSearch() {
           // this.loadInterWind = true;
           
            let url = this.$configs.api + "minigame/activegame/search";
            let configs = {
               params: {search: this.search}
            }
            this.$http
                .get(url, configs)
                .then(res => {
                   // console.log(res);
                   this.countpage = Math.ceil(res.data.data.count/ this.limit)
                   this.listInvoice = res.data.data.list
                   this.phantrang();
                })
                .catch(err => {
                    console.log("lỗi search: ", err.response);

                })

        },

    /* ----- Bắt đầu  phân trang ----- */
       
        // chuyển page
        next() {
            this.page = [];
            
            if(this.countpage <this.pageactive){    
                this.pageactive = this.countpage;
                this.pageBegin =  this.pageactive -4;
                
                if(this.pageBegin<0 ) this.pageBegin = 0

                for( let i = this.pageBegin ; i < this.pageactive; i++) {
                    this.page.push(i)
                }
                
            } else {
                
                this.pageactive += 4;
                this.pageBegin =  this.pageactive -4;
                
                if(this.pageBegin<0 ) this.pageBegin = 0
               
                if(this.pageactive > this.countpage){
                    
                    this.pageactive = this.countpage;
                    this.pageBegin =  this.pageactive -4;
                    if(this.pageBegin<0 ) this.pageBegin = 0;
                    
                    for( let i = this.pageBegin ; i < this.pageactive; i++) {
                        this.page.push(i)
                    }   
                } else {
                   
                    for( let i = this.pageBegin ; i < this.pageactive; i++) {
                        this.page.push(i)
                    }
                 
                }  
            }
        },

        // lùi page
        pre() {
            this.page = [];
            if(this.pageBegin < 4 ) {
                this.pageBegin = 0;
                if(this.countpage < 4 ) {
                    this.pageactive = this.countpage;
                    for( let i = this.pageBegin ; i < this.pageactive; i++) {
                        this.page.push(i)
                    }
                } else {
                    this.pageactive = 4;
                    for( let i = this.pageBegin ; i < this.pageactive; i++) {
                        this.page.push(i)
                    }
                }
            }  else {
                this.pageactive -= 4;
                this.pageBegin =  this.pageactive -4;
                for( let i = this.pageBegin ; i < this.pageactive; i++) {
                    this.page.push(i)
                }
            }
        },
        
        // chuyển đến đầu page
        dau() {
            this.page = [];
            this.pageBegin = 0;
            this.pageactive = 4;
            if(this.pageactive >= this.countpage){
                this.pageactive = this.countpage
            }
            for( let i = this.pageBegin ; i <=  this.pageactive-1; i++) {
                this.page.push(i)
            }
          
        },

        // chuyển đến cuối page
        cuoi() {
            
            this.page = []; 
            this.pageactive = this.countpage;
            this.pageBegin = this.pageactive - 4;
            
            if( this.pageBegin < 0){
                this.pageBegin = 0
            }
            
            for( let i = this.pageBegin ; i <=  this.pageactive-1; i++) {
                this.page.push(i)
            }
        },

        // phân trang
        phantrang() {
            this.page = [];
            if(this.current === 0 ) {
                this.pageBegin = 0;
                this.pageactive = 4;
            }

            if(this.current === this.countpage ) {
                
                this.pageactive = this.countpage;
                this.pageBegin = this.pageactive;
            }

            if(this.countpage < 4) {
                this.pageactive = this.countpage;
                this.pageBegin = 0;
            }
             
            for( let i = this.pageBegin ; i < this.pageactive; i++) {
                this.page.push(i)
            }
        },
        /* ----- kết thúc phân trang ----- */
      
    }
}