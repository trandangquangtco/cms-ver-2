<template>
    <!--------------------START - Main Menu -------------------->
        <div class="menu-w selected-menu-color-light menu-activated-on-hover menu-has-selected-link color-scheme-dark color-style-default sub-menu-color-light menu-position-side menu-side-left menu-layout-compact sub-menu-style-over">
          <div class="logo-w">
            <a class="logo" href="/">
              <img src="https://botup.io/images/logo/logo.png" alt="logo">
              <div class="logo-label">
                CMS
              </div>
            </a>
          </div>
          <h1 class="menu-page-header">
            Page Header
          </h1>
          <ul class="main-menu">
            <li class="sub-header">
              <span>MiniGame</span>
            </li>
            <li class="selected has-sub-menu">
              <a href="/">
                <div class="icon-w">
                  <div class="os-icon os-icon-layout"></div>
                </div>
                <span>Vòng quay may mắn</span>
              </a>
            </li>
            <li class="selected has-sub-menu" v-if="this.$userLogged.user.role === 'admin'" >
              <a href="#/admin">
                <div class="icon-w">
                  <div class="os-icon os-icon-file-text"></div>
                </div>
                <span>Tạo mã code </span>
              </a>
            </li>
            <li class="selected has-sub-menu">
              <a href="#/shop-list">
                <div class="icon-w">
                  <div class="os-icon os-icon-delivery-box-2"></div>
                </div>
                <span>Danh sách cửa hàng</span>
              </a>
            </li>
            <li class="selected has-sub-menu">
              <a href="#/store-list">
                <div class="icon-w">
                  <div class="os-icon os-icon-delivery-box-2"></div>
                </div>
                <span>Quản lý Store</span>
              </a>
            </li>
          </ul>
        </div>
        <!--------------------  END - Main Menu-------------------->
</template>

<script>
    export default {
    name: 'MainMenu',
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
