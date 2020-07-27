import Interwind from "@/components/loader/Interwind.vue";
import OnOff from "@/components/loader/OnOff.vue";
import XLSX from "xlsx"
import Swal from 'vue-sweetalert2';
import async from 'async'
import Resful from "@/services/resful.js"

export default {
    data() {
        return {
            voucherChecked: false,
            gameVoucher: '',
            checked: true,
            gameId: "",
            id_game: "",
            listUser: [],
            game: {},
            thongtin: [],
            limit: 15,
            code: "", // code active
            chiaSe: null,
            nhanQua: null,
            search: "", // tìm kiếm
            closeModal: false,  // tắt mở modal
            loi_thiet_lap: "",
            tong: 100,
            arrID: [], // xóa người chơi theo danh sách id
            optionsLimit: [
                { text: 'Giới hạn', value: 15 },
                { text: '15', value: 15 },
                { text: '40', value: 40 },
                { text: '70', value: 70 },
                { text: '100', value: 100 },
                { text: '200', value: 200 },
                { text: '500', value: 500 },
                { text: '700', value: 700 },
                { text: '1000', value: 1000 }
            ],
            optionsChiaSe: [
                { text: 'Chia sẻ', value: null },
                { text: 'Đã chia sẻ', value: 1 },
                { text: 'chưa chia sẻ', value: 0 },
            ],

            optionsNhanQua: [
                { text: 'Nhận quà', value: null },
                { text: 'Đã nhận quà', value: 1 },
                { text: 'chưa nhận quà', value: 0 },
            ],

            count: 0, // tổng số  người chơi 
            countDaNhan: 0, // số  người chơi đã nhận quà
            countChuaNhan: 0, // số  người chơi chưa nhận quà

            // bắt đầu các tham số  phân trang
            current: 0,
            countpage: 0,
            pageactive: 4,
            pageBegin: 0,
            page: [],
            // Kết thúc các tham số  phân trang

            indexThietLap: 0,
            status: null, // 0: thống kê chưa nhận quà, 1: đã nhận quà, null : người chơi
            loadInterWind: false, // loader người dùng,
            hienThietLap: false,
            tong_nguoi_choi: "",
            da_nhan_qua: "",
            chua_nhan_qua: "",
            modal_voucher: false,
            voucher_input: false,
            voucher_id: "",
            voucher_data: {},
            old_modal_voucher: false,
            old_voucher_input: false,
            old_voucher_id: "",
            old_voucher_data: {},
            staff_username: "",
            staff_password: "",
            modal_staff: false,
            is_staff: false
        }
    },

    created() {

    },
    components: {
        Interwind,
        OnOff
    },
    mounted() {
        this.check_staff_role()
        this.gameId = this.$route.query.gameId;
        this.id_game = this.$route.query.id;
        this.getGame();
        this.pageUserPlays(0);

        // $(".dac").height($(".dong").height());
    },
    filters: {
        prepend: (name) => {
            return this.tong - Number(name)
        }
    },
    watch: {
        game: function (val) {
            let tongthietlap = 0
            val.thiet_lap.map(el => {
                tongthietlap += Number(el.ty_le);
            })
            this.tong -= tongthietlap;
        }
    },
    computed: {
        selectAll: {
            get() {
                return this.arrID.length === this.listUser.length
            },
            set(value) {
                this.arrID = []

                if (value) {
                    if (this.listUser) {
                        this.listUser.forEach((select) => {
                            this.arrID.push(select.id)
                        })
                    }
                }
            }
        }
    },
    methods: {
        saveCustomThietLap(evt) {
            //this.closeModal = false
            evt.preventDefault();
            if (this.game.custom.length > 0) {
                this.game.custom.forEach(async el => {
                    if (el.type === "Object" && this.game.thiet_lap[this.indexThietLap].custom[el.name]) {
                        let kiemTraObject = await this.isJson(this.game.thiet_lap[this.indexThietLap].custom[el.name])
                        if (!kiemTraObject) {
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

        // thêm custom
        addCustom(evt) {
            evt.preventDefault();
            this.game.custom.push({
                name: "",
                type: "String"
            })
        },
        addCustomThietLap(index) {
            this.indexThietLap = index;
            this.closeModal = true
        },

        // xóa custom
        deleteCustom(index) {
            this.game.custom.splice(index, 1)
        },

        // // tắt game
        onOffGame(evt) {
            evt.preventDefault();

            if (this.checked) {
                this.checked = false;
                this.apiCloseGame();
            } else {
                this.checked = true;
                this.apiOpenGame();
            }
        },
        onOffVoucher() {
            if (!this.voucherChecked) {
                this.$swal({
                    title: 'Nhập kiểu mẫu voucher của bạn dưới đây',
                    text: "Voucher sau khi tạo sẽ có dạng: kieumaucuaban-abc-123",
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Chấp nhận',
                    cancelButtonText: 'Từ chối',
                    showLoaderOnConfirm: true,
                    preConfirm: (voucherPattern) => {
                        let url = this.$configs.api + "minigame/v2/config/update-game";
                        return this.$http
                            .post(url, { game_id: this.game.id, voucher_name: voucherPattern })
                            .then(res => {
                                this.game = res.data.data;
                                this.voucherChecked = true;
                                return this.$toasted.success("Khởi tạo game voucher cho game thành công", {
                                    duration: 7000
                                })
                            })
                            .catch(err => {
                                console.log("Lỗi tạo voucher cho game :", err.response)
                                return this.$toasted.show("Khởi tạo game voucher cho game thất bại, vui lòng thử lại", {
                                    type: "error",
                                    duration: 7000
                                })
                            })
                    },
                    allowOutsideClick: () => !this.$swal.isLoading()
                })
            } else {
                this.$swal({
                    title: 'Bạn có chắc là muốn xóa mẫu voucher đã tạo',
                    text: "Bạn không thể hoàn tác lại mẫu voucher cũ",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Xóa ngay',
                    cancelButtonText: 'Từ chối',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: () => !this.$swal.isLoading()
                }).then((result) => {
                    if (result.value) {
                        let url = this.$configs.api + "minigame/v2/config/update-game";
                        this.$http
                            .post(url, { game_id: this.game.id, voucher_name: "" })
                            .then(res => {
                                this.game = res.data.data;
                                this.voucherChecked = false;
                                return this.$toasted.success("Xóa mẫu voucher cho game thành công", {
                                    duration: 7000
                                })
                            })
                            .catch(err => {
                                console.log("Lỗi tạo voucher cho game :", err.response)
                                return this.$toasted.show("Xóa mẫu voucher cho game thất bại, vui lòng thử lại", {
                                    type: "error",
                                    duration: 7000
                                })

                            })
                    }
                })
            }
        },

        // api đóng game
        apiCloseGame() {
            let url = this.$configs.api + "minigame/ConfigMinigameLuckyWheel/close-game";

            this.$http
                .post(url, { id: this.game.id })
                .then(res => {

                    return this.$toasted.success("Game đã được tắt!", {
                        duration: 7000
                    })
                })
                .catch(err => {
                    console.log("Lỗi tắt game :", err.response)
                    return this.$toasted.show("Hiện tại không thể tắt game !", {
                        type: "error",
                        duration: 7000
                    })

                })
        },

        // api đóng game
        apiOpenGame() {
            let url = this.$configs.api + "minigame/ConfigMinigameLuckyWheel/open-game";
            this.$http
                .post(url, { id: this.game.id })
                .then(res => {
                    console.log("mở", res.data);
                    return this.$toasted.success("Game đã được mở !", {
                        duration: 7000
                    })
                })
                .catch(err => {
                    console.log("Lỗi mở game :", err.response)
                    return this.$toasted.show("Hiện tại không thể  mở game !", {
                        type: "error",
                        duration: 7000
                    })
                })
        },

        // Lấy danh sách người chơi đã nhận quag theo phân trang
        pagethongKeDaNhanQua(current) {
            this.tong_nguoi_choi = false
            this.da_nhan_qua = true
            this.chua_nhan_qua = false

            this.current = current;
            this.thongKeDaNhanQua();
        },

        // Lấy danh sách người chơi chưa nhận theo phân trang
        pagethongKeChuaNhanQua(current) {
            this.tong_nguoi_choi = false
            this.da_nhan_qua = false
            this.chua_nhan_qua = true

            this.current = current;
            this.thongKeChuaNhanQua();
        },

        // Lấy danh sách người chơi theo phân trang
        pageUserPlays(current) {
            this.tong_nguoi_choi = true
            this.da_nhan_qua = false
            this.chua_nhan_qua = false

            this.current = current;
            this.getUserPlay();
        },

        // Tìm kiếm
        searchForm(evt) {
            evt.preventDefault();
            this.ApiSearch();
        },

        // function Active Game
        activeGame(evt) {
            if (!this.code) {
                return this.$toasted.show("Vui lòng nhập vào code !", {
                    type: "error",
                    duration: 10000
                })
            }
            evt.preventDefault();
            this.apiActiveGame();
        },

        // Xóa người chơi theo uid
        removeUser(uid) {
            //Xoa du lieu
            this.$toasted.show("Bạn có chắc chắn muốn xóa", {
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
                            this.deleteByUid(uid);
                        }
                    }
                ]
            })
        },

        // Xóa người chơi theo Id người chơi
        removeUserByID(id) {
            //Xoa du lieu
            this.$toasted.show("Bạn có chắc chắn muốn xóa", {
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
                            this.ApiDeleteById(id);
                        }
                    }
                ]
            })
        },

        // xóa danh sách người chơi
        RemoveArrId(evt) {
            evt.preventDefault();
            if (this.arrID.length === 0) {
                return this.$toasted.show("Vui lòng chọn đối tượng cần xóa !", {
                    type: "error",
                    duration: 7000
                })
            }
            //Xoa du lieu
            this.$toasted.show("Bạn có chắc chắn muốn xóa", {
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
                        // router navigation
                        onClick: (e, toastObject) => {
                            toastObject.goAway(0);
                            // gọi api xóa
                            this.ApiDeleteArrId();
                        }
                    }
                ]
            })

            // if(this.arrID.length === 0){
            //     return this.$toasted.show("Vui lòng chọn người chơi cần xóa !",{
            //         type: "error",
            //         duration: 5000
            //     })
            // }

        },

        // cập nhật
        update(evt) {
            evt.preventDefault();
            this.$store.state.$loading = true;
            let tongPhanTram = 0;
            let kt = 0;
            this.game.thiet_lap.map((el, index) => {
                tongPhanTram += Number(el.ty_le);
                el.stt = index;
                if (!el.text) kt = 1
            })

            if (kt === 1) {
                this.$store.state.$loading = false;
                return this.$toasted.show("Vui lòng nhập quà tặng !", {
                    type: "error",
                    duration: 10000
                });
            }

            if (tongPhanTram > 100) {
                this.$store.state.$loading = false;
                return this.$toasted.show("Tổng tỷ lệ phần quà không được lớn hơn 100%", {
                    type: "error",
                    duration: 10000
                });
            }

            if (Number(this.game.luot_quay_mac_dinh) > Number(this.game.luot_quay_toi_da)) {
                this.$store.state.$loading = false;
                return this.$toasted.show("Lượt quay mặc định không lớn hơn lượt quay tối đa !", {
                    type: "error",
                    duration: 10000
                });
            }

            if (!this.game.luot_quay_mac_dinh) {
                this.$store.state.$loading = false;
                return this.$toasted.show("Vui lòng nhập lượt quay mặc đinh !", {
                    type: "error",
                    duration: 10000
                });
            }

            if (!this.game.luot_quay_toi_da) {
                this.$store.state.$loading = false;
                return this.$toasted.show("Vui lòng nhập lượt quay tối đa !", {
                    type: "error",
                    duration: 10000
                });
            }
            // cập nhật
            let url = this.$configs.api + "minigame/MinigameConfigLuckWheel/update-game";


            // gọi api cập nhật
            this.$http
                .post(url, this.game)
                .then(res => {
                    this.$store.state.$loading = false;
                    this.game = res.data.data;
                    this.$toasted.success("Cập nhật thành công", {
                        duration: 5000
                    });
                })
                .catch(err => {
                    this.$store.state.$loading = false;
                    this.$toasted.show("Cập nhật thất bại", {
                        type: "error",
                        duration: 5000
                    });
                    console.log("Lỗi cập nhật :", err.response)
                })

        },

        // xóa thiết lập
        xoaThietLap(stt) {
            //Xoa du lieu
            this.$toasted.show("Bạn có chắc chắn muốn xóa", {
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
                        // router navigation
                        onClick: (e, toastObject) => {
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
            this.game.thiet_lap.push({
                stt: this.game.thiet_lap.length,
                text: "",
                ty_le: 0,
                flow: "",
                custom: {}
            })
        },


        /* ------------------------- CÁC FUNCTION GỌI API ----------------------------*/

        // Gọi api active game
        apiActiveGame() {
            this.$store.state.$loading = true;
            let url = this.$configs.api + "minigame/activegame/active_game";
            let config = {
                id: this.game.id,
                code: this.code
            }

            // gọi api active
            this.$http
                .post(url, config)
                .then(res => {
                    this.$store.state.$loading = false;

                    this.$toasted.success("Active game thành công", {
                        duration: 5000,
                    })
                    this.game.active = 1

                })
                .catch(err => {
                    this.$store.state.$loading = false;
                    console.log("lỗi active", err.response);
                    this.$toasted.show(err.response.data.error_message.message, {
                        duration: 10000,
                        type: "error"
                    })
                })
        },

        // chọn xóa tất cả người dùng
        selectAll() {
            this.arrID = [];
            this.listUser.forEach(el => {
                this.arrID.push(el.id);
            })
        },

        // Gọi Api xóa người chơi theo danh sách id
        ApiDeleteArrId() {
            this.$store.state.$loading = true;
            let url = this.$configs.api + "minigame/MinigameLuckWheel/removeArrId";

            this.$http
                .post(url, {
                    arrID: this.arrID
                })
                .then((res) => {
                    console.log("danh sách xóa ::", res.data);
                    this.$store.state.$loading = false;
                    this.$toasted.success(`Đã xóa thành công ${this.arrID.length} người chơi !`, {
                        duration: 5000
                    })
                    this.arrID = []
                    this.pageUserPlays(this.current)

                })
                .catch(e => {
                    this.$store.state.$loading = false;
                    console.log("Lỗi xoa người chơi ::", e.response);
                    this.$toasted.show("Vui lòng trở lại sau 5 phút !", {
                        type: "error",
                        duration: 10000
                    })
                })
        },

        // Gọi api xóa người chơi theo uid
        deleteByUid(uid) {
            this.$store.state.$loading = true;
            let url = this.$configs.api + "minigame/MinigameLuckWheel/removeOneUid";
            let configs = {
                uid: uid,
                gameId: this.gameId
            };

            // gọi api
            this.$http
                .post(url, configs)
                .then(res => {
                    this.$store.state.$loading = false;
                    this.$toasted.success("Xóa người chơi thành công !", {
                        duration: 5000
                    });
                    this.pageUserPlays(this.current);

                })
                .catch(err => {
                    this.$store.state.$loading = false;
                    return this.$toasted.show(`Hiện tại không không thể xóa được người chơi, 
                        Vui lòng trở lại sau !`, {
                        type: "error",
                        duration: 10000
                    });
                })
        },

        // Gọi api xóa người chơi theo Id
        ApiDeleteById(id) {
            this.$store.state.$loading = true;
            let url = this.$configs.api + "minigame/MinigameLuckWheel/removeOneId";
            let configs = {
                id: id,
            };

            // gọi api
            this.$http
                .post(url, configs)
                .then(res => {
                    this.$store.state.$loading = false;
                    this.$toasted.success("Xóa người chơi thành công !", {
                        duration: 5000
                    });
                    this.pageUserPlays(this.current);

                })
                .catch(err => {
                    this.$store.state.$loading = false;
                    console.log("Lỗi xóa người chơi", err.response);

                    return this.$toasted.show(`Hiện tại không không thể xóa được người chơi, 
                        Vui lòng trở lại sau !`, {
                        type: "error",
                        duration: 10000
                    });
                })
        },
        // Gọi api tìm kiếm 
        ApiSearch() {
            this.loadInterWind = true;
            let query = {};
            if (this.chiaSe) query = {
                chia_se: this.chiaSe
            }
            let url = this.$configs.api + "minigame/minigameLuckWheel/search";
            let configs = {

                limit: this.limit,
                search: this.search,
                current: this.current,
                id_game: this.game.id,
                nhan_qua: this.nhanQua,
                gameId: this.gameId,
                query: query

            }

            this.$http
                .post(url, configs)
                .then(res => {
                    this.loadInterWind = false;
                    this.listUser = res.data.data.list;
                    this.countpage = Math.ceil(res.data.data.countsearch / this.limit);
                    this.phantrang();

                    // xử  lý hiển thị hiển thị thông tin khách hàng
                    if (this.listUser.length > 0) {
                        let size = 0;
                        this.listUser.map((e) => {
                            if (e.thong_tin_khach_hang) {
                                if (Object.keys(e.thong_tin_khach_hang).length > size) {
                                    size = Object.keys(e.thong_tin_khach_hang).length
                                    this.thongtin = Object.keys(e.thong_tin_khach_hang);
                                }
                            }

                            let phut = new Date(e.updatedAt).getMinutes();
                            let gio = new Date(e.updatedAt).getHours();
                            let ngay = new Date(e.updatedAt).getDate();
                            let thang = new Date(e.updatedAt).getMonth() + 1;
                            let nam = new Date(e.updatedAt).getFullYear();
                            e.updatedAt = `${gio}:${phut} ${ngay}/${thang}/${nam}`;
                        });
                    }
                })
                .catch(err => {
                    this.loadInterWind = false;
                    console.log("lỗi search: ", err.response);

                })

        },

        // Thống kê đã nhận quà
        thongKeDaNhanQua() {
            this.status = 1;
            this.loadInterWind = true;
            let url = this.$configs.api + "minigame/MinigameConfigLuckWheel/thongkedanhanqua";
            let params = {
                id: this.game.id,
                skip: this.current * this.limit,
                limit: this.limit
            }

            this.$http
                .get(url, { params: params })
                .then((res) => {
                    this.loadInterWind = false;
                    this.listUser = res.data.data.list;

                    this.countpage = Math.ceil(res.data.data.count / this.limit);
                    this.phantrang();

                    let size = 0;
                    if (this.listUser.length > 0) {
                        this.thongtin = Object.keys(this.listUser[0].thong_tin_khach_hang);
                        this.listUser.map((e) => {
                            if (Object.keys(e.thong_tin_khach_hang).length > size) {
                                size = Object.keys(e.thong_tin_khach_hang).length
                                this.thongtin = Object.keys(e.thong_tin_khach_hang);
                            }

                            let phut = new Date(e.updatedAt).getMinutes();
                            let gio = new Date(e.updatedAt).getHours();
                            let ngay = new Date(e.updatedAt).getDate();
                            let thang = new Date(e.updatedAt).getMonth() + 1;
                            let nam = new Date(e.updatedAt).getFullYear();
                            e.updatedAt = `${gio}:${phut} ${ngay}/${thang}/${nam}`;
                        });


                    }
                })
                .catch((err) => {
                    this.loadInterWind = false;
                    console.log("lỗi thống kê đã nhận quà", err.response)
                })
        },


        // Thống kê chưa nhận quà
        thongKeChuaNhanQua() {
            this.status = 0;
            this.loadInterWind = true;
            let url = this.$configs.api + "minigame/MinigameConfigLuckWheel/thongkechuanhanqua";
            let params = {
                id: this.game.id,
                skip: this.current * this.limit,
                limit: this.limit
            }


            this.$http
                .get(url, { params: params })
                .then(res => {
                    this.loadInterWind = false;
                    this.listUser = res.data.data.list;
                    this.countpage = Math.ceil(res.data.data.count / this.limit);
                    this.phantrang();
                    if (this.listUser.length > 0) {
                        this.listUser.map((e) => {
                            let phut = new Date(e.updatedAt).getMinutes();
                            let gio = new Date(e.updatedAt).getHours();
                            let ngay = new Date(e.updatedAt).getDate();
                            let thang = new Date(e.updatedAt).getMonth() + 1;
                            let nam = new Date(e.updatedAt).getFullYear();
                            e.updatedAt = `${gio}:${phut} ${ngay}/${thang}/${nam}`;
                        });
                    }
                })
                .catch(err => {
                    this.loadInterWind = false;
                    console.log("lỗi thống kê chưa nhận quà", err.response)
                })
        },

        // lấy tất cả người chơi
        getUserPlay() {
            this.loadInterWind = true;
            this.status = null;
            let url = this.$configs.api + "minigame/MinigameLuckWheel/get-all-user-game";
            let skip = this.current * this.limit
            // gọi API
            this.$http.get(url, {
                params: {
                    id_game: this.id_game,
                    gameId: this.gameId,
                    skip: skip,
                    limit: this.limit
                }
            })
                .then(res => {
                    if (res.data.data.list) {
                        this.loadInterWind = false;
                        this.listUser = res.data.data.list;
                        this.count = res.data.data.count;
                        this.countDaNhan = res.data.data.da_nhan;
                        this.countChuaNhan = res.data.data.chua_nhan;

                        this.countpage = Math.ceil(res.data.data.count / this.limit);
                        this.phantrang();

                        // xử lý hiển thị thông tin khách hàng theo cột
                        let size = 0;
                        if (this.listUser.length > 0) {
                            //this.thongtin = Object.keys(this.listUser[0].thong_tin_khach_hang);   
                            this.listUser.map((e) => {
                                if (e.thong_tin_khach_hang) {
                                    if (Object.keys(e.thong_tin_khach_hang).length > size) {
                                        size = Object.keys(e.thong_tin_khach_hang).length
                                        this.thongtin = Object.keys(e.thong_tin_khach_hang);
                                    }
                                }

                                let phut = new Date(e.updatedAt).getMinutes();
                                let gio = new Date(e.updatedAt).getHours();
                                let ngay = new Date(e.updatedAt).getDate();
                                let thang = new Date(e.updatedAt).getMonth() + 1;
                                let nam = new Date(e.updatedAt).getFullYear();
                                e.updatedAt = `${gio}:${phut} ${ngay}/${thang}/${nam}`;
                            });
                        }

                    } else {
                        this.loadInterWind = false;
                        console.log("Lỗi lấy dánh sách người chơi !", res);

                    }
                })
                .catch(err => {
                    this.loadInterWind = false;
                    console.log("lỗi lấy danh sác người chơi:", err.response);

                })
        },

        // Lấy chi tiết game
        getGame() {
            let url = this.$configs.api + "minigame/MinigameConfigLuckWheel/getOne";
            this.$http.get(url, {
                params: { gameId: this.gameId }
            })
                .then(res => {
                    if (!res.data.data.err) {
                        this.game = res.data.data
                        if (!res.data.data.custom || res.data.data.custom.length === 0) {
                            res.data.data.custom = [];
                            this.game.thiet_lap.map(el => {
                                el.custom = {}
                            })
                        }

                        let gameCoppy = { ...res.data.data };
                        this.game = gameCoppy

                        if (res.data.data.status) this.checked = res.data.data.status
                        else this.checked = true

                        if (this.game.voucher_name != undefined && this.game.voucher_name != "") {
                            this.voucherChecked = true
                        }
                        else {
                            this.voucherChecked = false
                        }

                    } else {
                        console.log("Lỗi lấy thông tin game:", res.data.data);
                    }
                })
                .catch(err => {
                    console.log("lỗi lấy chi tiết game", err.response);
                })
        },


        /* ----- Bắt đầu  phân trang ----- */
        // chuyển page
        next() {
            this.page = [];

            if (this.countpage < this.pageactive) {
                this.pageactive = this.countpage;
                this.pageBegin = this.pageactive - 4;

                if (this.pageBegin < 0) this.pageBegin = 0

                for (let i = this.pageBegin; i < this.pageactive; i++) {
                    this.page.push(i)
                }

            } else {

                this.pageactive += 4;
                this.pageBegin = this.pageactive - 4;

                if (this.pageBegin < 0) this.pageBegin = 0

                if (this.pageactive > this.countpage) {

                    this.pageactive = this.countpage;
                    this.pageBegin = this.pageactive - 4;
                    if (this.pageBegin < 0) this.pageBegin = 0;

                    for (let i = this.pageBegin; i < this.pageactive; i++) {
                        this.page.push(i)
                    }
                } else {

                    for (let i = this.pageBegin; i < this.pageactive; i++) {
                        this.page.push(i)
                    }

                }
            }
        },

        // lùi page
        pre() {
            this.page = [];
            if (this.pageBegin < 4) {
                this.pageBegin = 0;
                if (this.countpage < 4) {
                    this.pageactive = this.countpage;
                    for (let i = this.pageBegin; i < this.pageactive; i++) {
                        this.page.push(i)
                    }
                } else {
                    this.pageactive = 4;
                    for (let i = this.pageBegin; i < this.pageactive; i++) {
                        this.page.push(i)
                    }
                }
            } else {
                this.pageactive -= 4;
                this.pageBegin = this.pageactive - 4;
                for (let i = this.pageBegin; i < this.pageactive; i++) {
                    this.page.push(i)
                }
            }
        },

        // chuyển đến đầu page
        dau() {
            this.page = [];
            this.pageBegin = 0;
            this.pageactive = 4;
            if (this.pageactive >= this.countpage) {
                this.pageactive = this.countpage
            }
            for (let i = this.pageBegin; i <= this.pageactive - 1; i++) {
                this.page.push(i)
            }

        },

        // chuyển đến cuối page
        cuoi() {

            this.page = [];
            this.pageactive = this.countpage;
            this.pageBegin = this.pageactive - 4;

            if (this.pageBegin < 0) {
                this.pageBegin = 0
            }

            for (let i = this.pageBegin; i <= this.pageactive - 1; i++) {
                this.page.push(i)
            }
        },

        // phân trang
        phantrang() {
            this.page = [];
            if (this.current === 0) {
                this.pageBegin = 0;
                this.pageactive = 4;
            }

            if (this.current === this.countpage) {

                this.pageactive = this.countpage;
                this.pageBegin = this.pageactive;
            }

            if (this.countpage < 4) {
                this.pageactive = this.countpage;
                this.pageBegin = 0;
            }

            for (let i = this.pageBegin; i < this.pageactive; i++) {
                this.page.push(i)
            }
        },
        /* ----- kết thúc phân trang ----- */

        hiddenform() {

            if (!this.hienThietLap) this.hienThietLap = true
            else this.hienThietLap = false
            // var thietlapDiv = document.getElementById("thietlap");
            // thietlapDiv.classList.toggle("hien");

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
        },

        //Dowload file excel
        exportToExcel() {
            let data = this.listUser
            const fileName = 'Player_List.xlsx';

            let i;
            for (i = 0; i < data.length; i++) {

                if (data[i].thong_tin_khach_hang !== null && data !== '') {
                    let item = data[i].thong_tin_khach_hang

                    if (item.name && item.phone && item.address) {

                        data[i].ten_khach_hang = item.name
                        data[i].so_dien_thoai = item.phone
                        data[i].dia_chi_email = item.email
                        data[i].dia_chi_nhan_qua = item.address

                    }
                    else {
                        data[i].ten_khach_hang = item.hoten
                        data[i].so_dien_thoai = item.sdt
                        data[i].dia_chi_email = item.email
                        data[i].dia_chi_nhan_qua = item["Địa chỉ nhận quà"]
                    }

                }
                delete data[i].var
                delete data[i].user
                delete data[i].id_game
                delete data[i].var
                delete data[i].createdAt
                delete data[i].id
                delete data[i].thong_tin_khach_hang
            }
            // export
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'test');
            XLSX.writeFile(wb, fileName);
        },
        onChange(event) {
            this.limit = event.target.value
            if (this.tong_nguoi_choi === true) {
                this.getUserPlay();
            } else if (this.da_nhan_qua === true) {
                this.thongKeDaNhanQua();
            } else if (this.chua_nhan_qua === true) {
                this.thongKeChuaNhanQua();
            }
        },
        post(query, next) {
            let url = this.$configs.api + 'minigame/MinigameLuckWheel/get-all-user-game'
            this.$http.post(url, query).then(res => next(null, res.data)).catch(err => next(err))
        },
        exportAllToExcel() {
            this.$store.state.$loading = true;
            /**
             * {
                id_game: this.id_game,
                gameId: this.gameId,
                skip: skip,
                limit: limit
            }
             */
            console.log(`STEP 1 : Tính tổng số người chơi`)
            console.log(`---> ${this.count}`)
            console.log(`STEP 2 : Tính tổng số vòng lặp cần thực hiện`)
            let loop_round = Math.ceil(this.count / 500)
            console.log(`---> ${loop_round}`)
            let skip = 0
            async.eachLimit(new Array(loop_round), 1, (item, cb) => {
                console.log(`STEP 3 : Lấy 500 bản ghi từ db`)
                async.waterfall([
                    (next) => {
                        console.log(`---> Skip ${skip}`)
                        this.post({
                            id_game: this.id_game,
                            gameId: this.gameId,
                            skip: skip,
                            limit: 500
                        }, (e, r) => {
                            if (e) return next(e)
                            console.log(`---> Record ${r.data.list.length}`)
                            next(null, r.data.list)
                        })
                    },
                    (data, next) => {
                        const fileName = `Player_List${skip}.xlsx`;

                        let i;
                        for (i = 0; i < data.length; i++) {
                            
                            //Đổi thời gian tạo
                            let a = new Date(data[i].createdAt);
                            let months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
                            let year = a.getFullYear();
                            let month = months[a.getMonth()];
                            let date = a.getDate();
                            let hour = a.getHours();
                            let min = a.getMinutes();
                            let sec = a.getSeconds();
                            let time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec;

                            data[i].createdAt = time

                            //Đổi thời gian cập nhật
                            let b = new Date(data[i].updatedAt);
                            let months_b = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
                            let year_b = b.getFullYear();
                            let month_b = months_b[b.getMonth()];
                            let date_b = b.getDate();
                            let hour_b = b.getHours();
                            let min_b = b.getMinutes();
                            let sec_b = b.getSeconds();
                            let time_b = date_b + '/' + month_b + '/' + year_b + ' ' + hour_b + ':' + min_b + ':' + sec_b;

                            data[i].updatedAt = time_b

                            if (data[i].thong_tin_khach_hang !== null && data !== '') {
                                let item = data[i].thong_tin_khach_hang

                                if (item.name && item.phone && item.address) {

                                    data[i].ten_khach_hang = item.name
                                    data[i].so_dien_thoai = item.phone
                                    data[i].dia_chi_email = item.email
                                    data[i].dia_chi_nhan_qua = item.address

                                }
                                else {
                                    data[i].ten_khach_hang = item.hoten
                                    data[i].so_dien_thoai = item.sdt
                                    data[i].dia_chi_email = item.email
                                    data[i].dia_chi_nhan_qua = item["Địa chỉ nhận quà"]
                                }

                            }
                            delete data[i].var
                            delete data[i].user
                            delete data[i].id_game
                            delete data[i].var
                            delete data[i].id
                            delete data[i].thong_tin_khach_hang

                            if (data[i].list_voucher) {
                                let item2 = data[i].list_voucher

                                //Voucher index 0
                                if (item2[0] && item2[0].vocher_name !== 'matluot' && item2[0].vocher_name !== 'themluot') {

                                    data[i].voucher_1 = item2[0].voucher

                                    if (item2[0].status == 0) {
                                        data[i].status_1 = "Chưa sử dụng"
                                    }
                                    if (item2[0].status == 1) {
                                        data[i].status_1 = "Đã sử dụng"
                                    }

                                    data[i].voucher_name_1 = item2[0].vocher_name
                                    data[i].time_use_1 = item2[0].time_use
                                }

                                //Voucher index 1
                                if (item2[1] && item2[1].vocher_name !== 'matluot' && item2[1].vocher_name !== 'themluot') {

                                    data[i].voucher_2 = item2[1].voucher

                                    if (item2[1].status == 0) {
                                        data[i].status_2 = "Chưa sử dụng"
                                    }
                                    if (item2[1].status == 1) {
                                        data[i].status_2 = "Đã sử dụng"
                                    }

                                    data[i].voucher_name_2 = item2[1].vocher_name
                                    data[i].time_use_2 = item2[1].time_use
                                }

                                //Voucher index 3
                                if (item2[2] && item2[2].vocher_name !== 'matluot' && item2[2].vocher_name !== 'themluot') {

                                    data[i].voucher_3 = item2[2].voucher

                                    if (item2[2].status == 0) {
                                        data[i].status_3 = "Chưa sử dụng"
                                    }
                                    if (item2[2].status == 1) {
                                        data[i].status_3 = "Đã sử dụng"
                                    }

                                    data[i].voucher_name_3 = item2[2].vocher_name
                                    data[i].time_use_3 = item2[2].time_use
                                }

                                //Voucher index 4
                                if (item2[3] && item2[3].vocher_name !== 'matluot' && item2[3].vocher_name !== 'themluot') {

                                    data[i].voucher_4 = item2[3].voucher

                                    if (item2[3].status == 0) {
                                        data[i].status_4 = "Chưa sử dụng"
                                    }
                                    if (item2[3].status == 1) {
                                        data[i].status_4 = "Đã sử dụng"
                                    }

                                    data[i].voucher_name_4 = item2[3].vocher_name
                                    data[i].time_use_4 = item2[3].time_use
                                }

                                //Voucher index 5
                                if (item2[4] && item2[4].vocher_name !== 'matluot' && item2[4].vocher_name !== 'themluot') {

                                    data[i].voucher_5 = item2[4].voucher

                                    if (item2[4].status == 0) {
                                        data[i].status_5 = "Chưa sử dụng"
                                    }
                                    if (item2[4].status == 1) {
                                        data[i].status_5 = "Đã sử dụng"
                                    }

                                    data[i].voucher_name_5 = item2[4].vocher_name
                                    data[i].time_use_5 = item2[4].time_use
                                }

                                //Voucher index 6
                                if (item2[5] && item2[5].vocher_name !== 'matluot' && item2[5].vocher_name !== 'themluot') {

                                    data[i].voucher_6 = item2[5].voucher

                                    if (item2[5].status == 0) {
                                        data[i].status_6 = "Chưa sử dụng"
                                    }
                                    if (item2[5].status == 1) {
                                        data[i].status_6 = "Đã sử dụng"
                                    }

                                    data[i].voucher_name_6 = item2[5].vocher_name
                                    data[i].time_use_6 = item2[5].time_use
                                }

                                //Voucher index 7
                                if (item2[6] && item2[6].vocher_name !== 'matluot' && item2[6].vocher_name !== 'themluot') {

                                    data[i].voucher_7 = item2[6].voucher

                                    if (item2[6].status == 0) {
                                        data[i].status_7 = "Chưa sử dụng"
                                    }
                                    if (item2[6].status == 1) {
                                        data[i].status_7 = "Đã sử dụng"
                                    }

                                    data[i].voucher_name_7 = item2[6].vocher_name
                                    data[i].time_use_7 = item2[6].time_use
                                }

                                //Voucher index 8
                                if (item2[7] && item2[7].vocher_name !== 'matluot' && item2[7].vocher_name !== 'themluot') {

                                    data[i].voucher_8 = item2[7].voucher

                                    if (item2[7].status == 0) {
                                        data[i].status_8 = "Chưa sử dụng"
                                    }
                                    if (item2[7].status == 1) {
                                        data[i].status_8 = "Đã sử dụng"
                                    }

                                    data[i].voucher_name_8 = item2[7].vocher_name
                                    data[i].time_use_8 = item2[7].time_use
                                }

                                //Voucher index 9
                                if (item2[8] && item2[8].vocher_name !== 'matluot' && item2[8].vocher_name !== 'themluot') {

                                    data[i].voucher_9 = item2[8].voucher

                                    if (item2[8].status == 0) {
                                        data[i].status_9 = "Chưa sử dụng"
                                    }
                                    if (item2[8].status == 1) {
                                        data[i].status_9 = "Đã sử dụng"
                                    }

                                    data[i].voucher_name_9 = item2[8].vocher_name
                                    data[i].time_use_9 = item2[8].time_use
                                }

                                //Voucher index 10
                                if (item2[9] && item2[9].vocher_name !== 'matluot' && item2[9].vocher_name !== 'themluot') {

                                    data[i].voucher_10 = item2[9].voucher

                                    if (item2[9].status == 0) {
                                        data[i].status_10 = "Chưa sử dụng"
                                    }
                                    if (item2[9].status == 1) {
                                        data[i].status_10 = "Đã sử dụng"
                                    }

                                    data[i].voucher_name_10 = item2[9].vocher_name
                                    data[i].time_use_10 = item2[9].time_use
                                }

                            }


                        }
                        // export
                        const ws = XLSX.utils.json_to_sheet(data);
                        const wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, 'test');
                        XLSX.writeFile(wb, fileName);
                        skip += 500
                        next()
                    }
                ], (e, r) => {
                    if (e) return cb(e)
                    cb()
                })
            }, e => {
                if (e) console.log(`ERROR : ${e}`)
                console.log(`---> DONE`)
                this.$store.state.$loading = false;
            })


            return
            let data = this.listUser
            const fileName = 'Player_List.xlsx';

            let i;
            for (i = 0; i < data.length; i++) {

                if (data[i].thong_tin_khach_hang !== null && data !== '') {
                    let item = data[i].thong_tin_khach_hang

                    if (item.name && item.phone && item.address) {

                        data[i].ten_khach_hang = item.name
                        data[i].so_dien_thoai = item.phone
                        data[i].dia_chi_email = item.email
                        data[i].dia_chi_nhan_qua = item.address

                    }
                    else {
                        data[i].ten_khach_hang = item.hoten
                        data[i].so_dien_thoai = item.sdt
                        data[i].dia_chi_email = item.email
                        data[i].dia_chi_nhan_qua = item["Địa chỉ nhận quà"]
                    }

                }
                delete data[i].var
                delete data[i].user
                delete data[i].id_game
                delete data[i].var
                delete data[i].createdAt
                delete data[i].id
                delete data[i].thong_tin_khach_hang
            }
            // export
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'test');
            XLSX.writeFile(wb, fileName);
        },

        //Search voucher
        async searchVoucher() {
            try {

                if (!this.voucher_id) {
                    return this.$toasted.show("Vui lòng nhập voucher", {
                        type: "error",
                        duration: 5000
                    });
                }

                let body = {
                    id_game: this.$route.query.id,
                    voucher: this.voucher_id
                }
                let search_voucher = await Resful.post("minigame/MinigameLuckWheel/find-voucher", body)
                if (search_voucher) {
                    this.voucher_data = search_voucher.data.data
                    this.voucher_input = false
                }

            } catch (error) {
                return this.$toasted.show("Không tìm thấy voucher", {
                    type: "error",
                    duration: 5000
                });
            }
        },

        async updateVoucher(item) {
            try {

                item.status = 1
                item.time_use = new Date().getDay() + "/" + (Number(new Date().getMonth()) + 1) + "/" + new Date().getFullYear() + "   " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()

                let body = {
                    id_game: this.$route.query.id,
                    list_voucher: this.voucher_data.list_voucher,
                    uid: this.voucher_data.uid
                }
                let update_voucher = await Resful.post("minigame/MinigameLuckWheel/update-voucher", body)
                if (update_voucher) {
                    this.$toasted.success("Sử dụng voucher thành công", {
                        duration: 5000
                    });
                }

            } catch (error) {
                console.log(error)
            }
        },

        //search_old_voucher
        async search_old_voucher() {
            try {

                if (!this.old_voucher_id) {
                    return this.$toasted.show("Vui lòng nhập voucher", {
                        type: "error",
                        duration: 5000
                    });
                }

                let body = {
                    id_game: this.$route.query.id,
                    voucher: this.old_voucher_id,

                }

                let search_old_voucher = await Resful.post("minigame/MinigameLuckWheel/find_old_voucher", body)

                if (search_old_voucher) {
                    this.old_voucher_data = search_old_voucher.data.data
                    this.old_voucher_input = false
                }

            } catch (error) {
                return this.$toasted.show("Không tìm thấy voucher", {
                    type: "error",
                    duration: 5000
                });
            }
        },

        //update mã voucher cũ
        async updateOldVoucher(old_voucher_data) {
            try {
                old_voucher_data.nhan_qua = 1

                let body = {
                    id_game: this.$route.query.id,
                    voucher: this.old_voucher_data.voucher,
                    uid: this.old_voucher_data.uid
                }
                let update_voucher = await Resful.post("minigame/MinigameLuckWheel/update_old_voucher", body)
                if (update_voucher) {
                    this.$toasted.success("Sử dụng voucher thành công", {
                        duration: 5000
                    });
                }

            } catch (error) {
                console.log(error)
            }
        },
        async create_new_staff() {
            try {

                let owner_data = JSON.parse(localStorage.getItem("user-cms"))

                let body = {
                    username: this.staff_username,
                    password: this.staff_password,
                    owner: owner_data.user.email,
                    token_login: owner_data.token
                }

                let create_new_staff = await Resful.post("users/SubUser/create_new_sub_user", body)
                if (create_new_staff) {
                    this.$toasted.success("Tạo tài khoản nhân viên thành công", {
                        duration: 5000
                    });
                }

            } catch (error) {
                console.log(error)
                if (error && error.data && error.data.error_message) {
                    return this.$toasted.show(error.data.error_message, {
                        type: "error",
                        duration: 5000
                    });
                }
            }
        },
        check_staff_role() {
            let staff_data = JSON.parse(localStorage.getItem("user-cms"))
            console.log("staff_data", staff_data)
            if (staff_data && staff_data.role == 'staff') {
                this.is_staff = true
            }
        }
    },
}