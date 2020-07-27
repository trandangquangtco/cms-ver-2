export default {
    data() {
        return {
            test: "12",
            game: {
                gameId: "",
                luot_quay_toi_da: 1,
                luot_quay_mac_dinh: 1,
                loai_vong_quay: "text",
                thiet_lap: [
                    { text: "quà tặng 1", ty_le: 50, flow: "", custom: {}},
                    { text: "quà tặng 2", ty_le: 50, flow: "" ,custom: {} }
                ],
                custom : []
                
            },
            closeModal: false,
            indexThietLap : 0,
            optionsLoaiVongQuay: [
                { text: 'text', value: "text" },
                { text: 'image', value: "image" },
              ],
              
            
        }
    },
    wacth : {
       
    },

    methods : {
        
        createGame() {
            // Kiểm tra tên game không được rỗng
            if(!this.game.gameId) {
                return this.$toasted.show("Vui lòng nhập tên game !",{
                     type:"error",
                     duration: 10000
                 });
             }

            // kiểm tra game mặc định không lớn hơn game tối đa
            if(this.game.luot_quay_mac_dinh > this.game.luot_quay_toi_da){
                return this.$toasted.show("Lượt quay mặc định không được lớn hơn lượt quay tối đa !",{
                    type:"error",
                    duration: 10000
                }); 
            }

            // tính tổng tỷ lệ
            let kt = 0;
            let tongPhanTram = 0;
            this.game.thiet_lap.forEach((element,index) => {
                element.stt = index
                if(!element.text) return kt =1 
                tongPhanTram += Number(element.ty_le);
            });
            
            // Kiểm tra thông tin quà tặng không được rỗng
            if(kt === 1) {
               return this.$toasted.show("Vui lòng nhập thông tin quà tặng !",{
                    type:"error",
                    duration: 10000
                });
            }

            // kiểm tra tổng tỷ lệ không được lớn hơn 100 hoặc bằng 0
            if(tongPhanTram > 100 || tongPhanTram <= 0){
                return this.$toasted.show("Tổng tỷ lệ không được lớn hơn 100% hoặc bằng 0 !",{
                    type:"error",
                    duration: 10000
                }); 
            }
            
            this.$store.state.$loading = true;

            // đưa tên game về  viết liền không dấu
            this.game.gameId = this.game.gameId.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
            this.game.gameId = this.game.gameId.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
            this.game.gameId = this.game.gameId.replace(/ì|í|ị|ỉ|ĩ/g, "i");
            this.game.gameId = this.game.gameId.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
            this.game.gameId = this.game.gameId.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
            this.game.gameId = this.game.gameId.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
            this.game.gameId = this.game.gameId.replace(/đ/g, "d");
            this.game.gameId = this.game.gameId.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
            this.game.gameId = this.game.gameId.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
            this.game.gameId = this.game.gameId.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
            this.game.gameId = this.game.gameId.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
            this.game.gameId = this.game.gameId.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
            this.game.gameId = this.game.gameId.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
            this.game.gameId = this.game.gameId.replace(/Đ/g, "D");
            // Combining Diacritical Marks
            this.game.gameId = this.game.gameId.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // huyền, sắc, hỏi, ngã, nặng 
            this.game.gameId = this.game.gameId.replace(/\u02C6|\u0306|\u031B/g, ""); // mũ â (ê), mũ ă, mũ ơ (ư)
            this.game.gameId = this.game.gameId.replace(/ /g, "_");

            // Tạo game mới
            let url = this.$configs.api + "minigame/MinigameConfigLuckWheel/createOne";
            // Gọi api tạo game mới
            this.$http
                .post(url,this.game)
                .then(res => {
                    if (res.data.data.status === false) {
                        this.$store.state.$loading = false;
                        return this.$toasted.show(res.data.data.message,{
                            type:"error",
                            duration: 10000
                        });            
                    }
                    else {
                        this.$store.state.$loading = false;
                        
                        // chuyển trang sang chi tiết game
                        this.$router.push({ path: "/game-detail", query : { 
                            id: res.data.data.id, 
                            gameId: res.data.data.gameId 
                        }});

                        // thông báo
                        this.$toasted.success("Tạo Game thành công",{
                            duration:5000
                        });
                    }
                })
                .catch(err => {
                    this.$store.state.$loading = false;
                    console.log("lỗi tạo game",err);
                    return this.$toasted.show("Hệ thống hiện tại không thể  tạo game",{
                        type:"error",
                        duration: 10000
                    });  
                })
        },
       
       // Lưu và đóng thiết lập
     async  saveCustomThietLap(evt) {
         evt.preventDefault();
           if(this.game.custom.length >0){
               this.game.custom.forEach(async el => {
                if(el.type === "Object" && this.game.thiet_lap[this.indexThietLap].custom[el.name]){
                    let kiemTraObject = await this.isJson(this.game.thiet_lap[this.indexThietLap].custom[el.name])
                    if(!kiemTraObject){
                        this.closeModal = true
                        return this.$toasted.show(`${el.name} không phải là Object !`, {
                            duration: 5000,
                            type: "error"
                        })
                    } 
                }
            })
            this.closeModal = false
           } else {
            this.closeModal = false
           }
          
       },

       // thêm custom vào trong thiết lập
       addCustomThietLap(index) {
            this.indexThietLap = index;
            this.closeModal = true
       },

        // xóa custom 
        deleteCustom(index){
            this.game.custom.splice(index,1)
        },
       
        // xóa custom 
        addCustom(evt){   
            evt.preventDefault(); 
           // console.log(this.game.custom);
          //  let customCoppy = [...this.game.custo]
            this.game.custom.push({
                name: "", 
                type: "String"
            })
          //  this.game.custom = customCoppy;
           
            
       },
        // xóa thiết lập
        xoaThietLap(stt) {
            //Xoa du lieu
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
                        // router navigation
                        onClick : (e, toastObject) => {
                            toastObject.goAway(0);
                            this.game.thiet_lap.splice(stt, 1);
                        }
                    }
                ]
            })
           
        },
         // thêm thiết lập
         themThietLap(evt) {
            evt.preventDefault();
            
            let tongPhanTram = 0;
            let kt = 0;
            this.game.thiet_lap.forEach(element => {
                if(!element.text) return kt ++
                tongPhanTram += element.ty_le;               
            });

            if(kt >= 6) {
               return this.$toasted.show("Vui lòng nhập thông tin quà tặng !",{
                    type:"error",
                    duration: 10000
                });
            }
            
            if(tongPhanTram > 100){
                return this.$toasted.show("Tổng tỷ lệ không được lớn hơn 100% !",{
                    type:"error",
                    duration: 10000
                }); 
            }
            this.game.thiet_lap.push({
                stt: this.game.thiet_lap.length,
                text: "",
                ty_le: 0, 
                flow: ""
            })
        },


        // Hàm kiểm tra là object 
        async isJson(stringOjb) {
            try {
                const json = JSON.parse(stringOjb);
                if (Object.prototype.toString.call(json).slice(8, -1) !== 'Object') {
                    return false;
                }
                return json;
            } catch (error) {
                return false
            }
        }
    }
}