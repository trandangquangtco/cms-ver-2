<template>
    <div class="animationload">
        <div class="osahanloading"></div>
    </div>
</template>

<script>
    export default {
    name: 'Loader',
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.animationload {
    background-color: rgba(32, 32, 32, 0.322);
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10000;
}
.osahanloading {
    animation: 1.5s linear 0s normal none infinite running osahanloading;
    background: #fed37f none repeat scroll 0 0;
    border-radius: 50px;
    height: 30px;
    left: 50%;
    margin-left: -25px;
    margin-top: -25px;
    position: sticky;
    top: 25%;
    width: 30px;
}
 
.osahanloading::after {
    animation: 1.5s linear 0s normal none infinite running osahanloading_after;
    border-color: #85d6de transparent;
    border-radius: 80px;
    border-style: solid;
    border-width: 10px;
    content: "";
    height: 70px;
    left: -19px;
    position: absolute;
    top: -19px;
    width: 70px;
}
 
@keyframes osahanloading {
0% {
    transform: rotate(0deg);
}
50% {
    background: #85d6de none repeat scroll 0 0;
    transform: rotate(180deg);
}
100% {
    transform: rotate(360deg);
}
}
</style>
