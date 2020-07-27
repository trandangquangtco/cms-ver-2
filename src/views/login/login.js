import axios from "axios";
import facebookLogin from 'facebook-login-vuejs'
import Resful from "@/services/resful.js"

import Loader from "@/components/Loader.vue";
export default {
    data() {
        return {

            loading: false,
            test: "asdasd",
            loginByBotup: 1,

            email: "",
            passwordBotup: "",

            username: "",
            passwordCms: "",

            colorUsername: "",
            colorPassWordCms: "",

            colorEmail: "",
            colorPassWordBotup: "",

            errorMessage: "",

            staff_username: "",
            staff_password: ""
        }
    },
    components: {
        Loader,
        facebookLogin
    },
    created() {
        window.fbAsyncInit = function () {
            FB.init({
                appId: '2279252778962648',
                cookie: true,
                xfbml: true,
                version: 'v3.3',
                autoLogAppEvents: true
            });
            FB.AppEvents.logPageView();
        };
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

    },
    mounted() {
        localStorage.clear();
        this.$store.state.$loading = false

    },
    watch: {
        username: function (val) {
            if (val) this.colorUsername = ""
            else this.colorUsername = "red";
        },
        passwordCms: function (val) {
            if (val) this.colorPassWordCms = ""
            else this.colorPassWordCms = "red";
        },

        email: function (val) {
            if (val) this.colorEmail = ""
            else this.colorEmail = "red";
        },

        passwordBotup: function (val) {
            if (val) this.colorPassWordBotup = ""
            else this.colorPassWordBotup = "red";
        },


    },
    computed: {
    },

    methods: {

        // Đăng hập bằng tài khoản botup
        loginBotup(evt) {
            evt.preventDefault();

            // kiểm tra email và password rỗng 
            if (!this.email) return this.colorEmail = "red";
            if (!this.passwordBotup) return this.colorPassWordBotup = "red";

            this.$store.state.$loading = true
            // cấu hình api và params
            let url = "https://api.botup.io/v1/auth/sign-in",
                body = {
                    email: this.email,
                    password: this.passwordBotup
                },
                config = {
                    headers: {
                        "content-type": "application/json"
                    }
                };

            // gọi api đăng nhập botup
            this.$http
                .post(url, JSON.stringify(body), config)
                .then((res) => {
                    if (res.data.data.token) {
                        let user = res.data.data.user;

                        // Login user trong cms
                        this.signInBotupCms(user);
                    } else {
                        this.$store.state.$loading = false
                        localStorage.removeItem("user-cms");
                        return this.$toasted.show("Vui lòng đăng nhập lại sau 5 phút !", {
                            type: "error",
                            duration: 10000
                        });
                    }
                })
                .catch(e => {
                    this.$store.state.$loading = false
                    localStorage.removeItem("user-cms");
                    //console.log("lỗi gọi api đăng nhập bằng botup", e.response);

                    return this.$toasted.show("Email hoặc mật khẩu botup không đúng !", {
                        type: "error",
                        duration: 10000
                    });
                })
        },

        // Đăng nhập bằng tài khoản CMS
        loginCms(evt) {
            evt.preventDefault();

            // kiểm tra email và password rỗng 
            if (!this.username) return this.colorEmail = "red";
            if (!this.passwordCms) return this.colorPassWordpasswordCms = "red";

            this.apiLoginCms();
        },


        // Đăng nhập bằng facebook
        loginFacbook() {
            this.$store.state.$loading = true;

            let thisVue = this;
            FB.login(function (response) {
                if (response.authResponse.accessToken) {
                    let url = "https://api.botup.io/v1/auth/sign-in-facebook";
                    thisVue.$http.get(url, {
                        params: {
                            accessToken: response.authResponse.accessToken
                        }
                    })
                        .then(res => {
                            // gọi api đăng nhập bằng botup trong cms
                            thisVue.signInBotupCms(res.data.data.user)
                        })
                        .catch(err => {
                            console.log("không thành công", err);
                        })
                }
            })
        },


        // Tạo người dùng mới sau khi đăng nhập bằng botup
        // api Đăng nhập cms bằng tài khoản botup
        signInBotupCms(user) {

            let thisVue = this;
            // cấu hình api và params
            let url = thisVue.$configs.api + "users/users/singinbotup",
                body = {
                    username: user.id,
                    password: user.username,
                    role: user.role,
                    email: user.email,
                    last_name: user.last_name,
                    first_name: user.first_name
                }
            // gọi api đăng nhập bằng botup trong cms
            thisVue.$http
                .post(url, body)
                .then((response) => {
                    this.$store.state.$loading = false
                    if (response.data.data.token) {
                        localStorage.setItem("user-cms", JSON.stringify(response.data.data));
                        this.$http.defaults.headers.common["x-botup-token"] = response.data.data.token;
                        this.$toasted.success("Đăng nhập thành công", {
                            duration: 5000
                        });
                        this.$router.push("/");
                    } else {
                        this.$store.state.$loading = false
                        localStorage.removeItem("user-cms");
                        return this.$toasted.show("Email hoặc mật khẩu botup không đúng !", {
                            type: "error",
                            duration: 10000
                        });
                    }
                })
                .catch(e => {
                    console.log("err", e.response);
                    thisVue.$store.state.$loading = false
                    localStorage.removeItem("user-cms");
                    return thisVue.$toasted.show("Email hoặc mật khẩu botup không đúng !", {
                        type: "error",
                        duration: 10000
                    });
                })
        },

        // api login bằng cms
        apiLoginCms() {

            // khai báo biến
            this.$store.state.$loading = true
            let url = this.$configs.api + "users/users/singin",
                body = {
                    username: this.username,
                    password: this.passwordCms
                },
                config = {
                    headers: {
                        "content-type": "application/json"
                    }
                };

            // Gọi API đăng nhập
            this.$http
                .post(url, body, config)
                .then(response => {
                    this.$store.state.$loading = false;
                    if (response.data.data.token) {
                        localStorage.setItem("user-cms", JSON.stringify(response.data.data));
                        this.$http.defaults.headers.common["x-botup-token"] = response.data.data.token;

                        this.$toasted.success("Đăng nhập thành công ", {
                            duration: 5000
                        });
                        this.$router.push("/");
                    } else {
                        localStorage.removeItem("user-cms");

                        return this.$toasted.show("Tên đăng hoặc mật khẩu botup không đúng !", {
                            type: "error",
                            duration: 10000
                        });
                    }
                })
                .catch(err => {
                    this.$store.state.$loading = false;
                    console.log(err.response);
                    localStorage.removeItem("user-cms");
                    return this.$toasted.show("Tên đăng nhập hoặc mật khẩu botup không đúng !", {
                        type: "error",
                        duration: 10000
                    });
                    //  this.errorMessage = "username hoặc mật khẩu không đúng !"
                })
        },

        //Tài khoản đăng nhập của nhân viên
        async staff_login() {
            try {

                let body = {
                    username: this.staff_username,
                    password: this.staff_password
                }

                let staff_login = await Resful.post("users/SubUser/sub_user_login", body)
                if (staff_login) {

                    localStorage.setItem("user-cms", JSON.stringify(staff_login.data.data));
                    this.$http.defaults.headers.common["x-botup-token"] = staff_login.data.data.token_login;

                    this.$toasted.success("Đăng nhập thành công ", {
                        duration: 5000
                    });
                    this.$router.push("/");
                }

            } catch (error) {
                if (error && error.data && error.data.error_message) {
                    return this.$toasted.show(error.data.error_message, {
                        type: "error",
                        duration: 5000
                    });
                }
            }
        }
    }
}