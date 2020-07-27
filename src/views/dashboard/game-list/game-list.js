
export default {
    data() {
        return {
            data: [],
            limit: 18,
            skip: 0,
            
            current: 0,
            pageBegin:0,
            pageactive: 4,
            countpage: 1,
            page: []
        }
    },
    created() {
        //this.gameList()
    },
    components: {
        
    },
    mounted() {
        this.$store.state.$loading = false;
        //this.gameList();
        this.pageGamePlays(this.current)
    },
    methods: {

        removeGame(id) {
            
            this.$toasted.show("Bạn có chắc chắn muốn xóa",{
                type:"info",
                theme:"outline",
                duration:10000,
                action : [
                    {
                        text : 'Hủy',
                        onClick : (e, toastObject) => {
                            toastObject.goAway(0);
                        }
                    },
                    {
                        text : 'Xóa',
                        onClick : (e, toastObject) => {
                            toastObject.goAway(0);
                            this.delete(id)
                        }
                    }
                ]
            })
        },

        // xóa game
        delete(id) {
            this.$store.state.$loading = true;
            let url = this.$configs.api+"minigame/MinigameConfigLuckWheel/removeOneId";
            let configs = {
               id: id 
            }

            this.$http
                .post(url, configs)
                .then(respons => {
                    this.$store.state.$loading = false;
                    this.gameList();
                    this.$toasted.success("xóa game thành công",{
                        duration:5000
                    });
                   // console.log("respons",respons);
                    
                })
                .catch( err => {
                    this.$store.state.$loading = false;
                    console.log(err);
                })


        },

        pageGamePlays(current) {
            this.current = current;
            this.skip = this.limit*current
            this.gameList();
        },
        // Lấy danh sách game
        gameList() {
            this.$store.state.$loading = true;
            // khai báo biến cấu hình
            let url = this.$configs.api+"minigame/MinigameConfigLuckWheel/getAll";
            let configs = {
                params: {
                    limit: this.limit,
                    current: this.current,
                    sort: "createdAt DESC"

                }
            }

            
            // Gọi API lấy danh sách game
            this.$http
                .get(url, configs)
                .then(respons => {
                    this.$store.state.$loading = false;
                    this.data = respons.data.data.list
                    this.countpage = Math.ceil(respons.data.data.count/this.limit);
                    this.phantrang()
                })
                .catch( err => {
                    this.$store.state.$loading = false;
                    console.log(err);
                })
        },


        // Phân trang

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
    }
}