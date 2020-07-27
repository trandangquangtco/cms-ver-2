let api;
if(process.env.NODE_ENV === "production"){
    api = "https://ext.botup.io/v1/";
} else {
    // api = "http://localhost:1337/v1/";
    api = "https://ext.botup.io/v1/";
}
export default api
