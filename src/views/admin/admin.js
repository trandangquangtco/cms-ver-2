import TopBar from "@/components/TopBar.vue";
import MenuMobile from "@/components/MenuMobile.vue";
import MainMenu from "@/components/MainMenu.vue";
import Loader from "@/components/Loader.vue";
export default {
    components: {    
        TopBar,
        MainMenu,
        MenuMobile,
        Loader
    },
    methods: {
        logout() {
            localStorage.removeItem("user-cms");
            delete this.$http.defaults.headers.common["x-botup-token"];
            this.$router.push('/login');
        }
    }
}