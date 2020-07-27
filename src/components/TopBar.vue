<template>
    <!-------------------- START - Top Bar -------------------->
    <div>
        <div class="top-bar color-scheme-dark">
            <!--------------------   START - Top Menu Controls -------------------->
            <div class="top-menu-controls">
              <!-------------------- START - User avatar and menu in secondary top menu  -------------------->
              <div class="logged-user-w">
                <div class="logged-user-i">
                  <div class="avatar-w">
                    <img alt="" src="img/user.jpg">
                  </div>
                  <div class="logged-user-menu color-style-bright" >
                    <div class="logged-user-avatar-info">
                      <div class="avatar-w">
                        <img alt="" src="img/user.jpg">
                      </div>
                      <div class="logged-user-info-w">

                      </div>
                    </div>
                    <div class="bg-icon">
                      <i class="os-icon os-icon-wallet-loaded"></i>
                    </div>
                    <ul>

                      <li>
                        <a href="#/profile"><i class="os-icon os-icon-user-male-circle2"></i><span>Hồ sơ </span></a>
                      </li>

                      <li>
                        <a @click = "logout"><i class="os-icon os-icon-signs-11"></i><span>Đăng xuất</span></a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <!--------------------  END - User avatar and menu in secondary top menu  -------------------->
            </div>
            <!--------------------   END - Top Menu Controls  -------------------->
        </div>
        <div>
             <ul class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="#/">cms</a>
              </li>
              <li class="breadcrumb-item">
                <a >{{title}}</a>
              </li>
            </ul>
          </div>
   </div>
   <!--------------------   END - Top Bar  -------------------->
</template>

<script>
    export default {
        name: 'TopBar',
        props: ["title"],
        methods: {
          logout() {
              localStorage.removeItem("user-cms");
              delete this.$http.defaults.headers.common["x-botup-token"];
              this.$router.push('/login');
          }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.logged-user-menu {
  left: unset !important;
  right: 10px !important;
  width: 200px !important;
}
</style>
