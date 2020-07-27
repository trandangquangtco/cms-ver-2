import Resful from "@/services/resful.js"
import XLSX from "xlsx"
import router from "../../../router"
export default {
  data() {
    return {
      orderList: "",
      close: false,
      orderItem: {},
      shopID: this.$route.query.id,
      page: this.$route.query.page,
      perpage: 50,
      select: [
        {
          value: 50
        },
        {
          value: 100
        },
        {
          value: 150
        },
        {
          value: 200
        }
      ]
    }
  },
  mounted() {
    this.getOrderList();
  },
  methods: {
    // Lấy toàn bộ đơn hàng của shop
    async getOrderList() {
      try {
        console.log(this.$route.query.store_id)
        let body = {
          store_id: this.$route.query.store_id,
          // page: this.page,
          // perpage: this.perpage
        }
        let getOrderList = await Resful.post("selling-page/order/order_read", body)
        console.log(getOrderList);
        this.orderList = getOrderList.data.data.map(item => {

          let a = new Date(item.createdAt);
          let months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
          let year = a.getFullYear();
          let month = months[a.getMonth()];
          let date = a.getDate();
          let hour = a.getHours();
          let min = a.getMinutes();
          let sec = a.getSeconds();
          let time = date + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec;

          item.createdAt = time

          return item
        })
      } catch (error) {
        console.log(error)
      }
    },
    //Lấy ra chi tiết của từng hóa đơn
    getOrderDetail(item) {
      this.close = true;
      this.orderItem = item
    },

    //Xác nhận đơn hàng
    async acceptOrder(orderID) {
      this.$store.state.$loading = true;
      this.close = false;

      try {
        let body = {
          orderID: orderID
        }
        let acceptOrder = await Resful.post("cms-sale/OrderList/accept_order", body)
        console.log(acceptOrder)

        this.getOrderList()
        this.$store.state.$loading = false;

      } catch (error) {
        this.$store.state.$loading = false;
        console.log(error)
      }
    },

    //Xóa 1 đơn hàng
    async deleteOrder(orderID) {
      try {
        let body = {
          id: orderID
        }
        let deleteOrder = await Resful.post("selling-page/order/order_delete", body)

        this.getOrderList()
        console.log(deleteOrder)
        this.$store.state.$loading = false;

      } catch (error) {
        this.$store.state.$loading = false;
        console.log(error)
      }
    },

    //Xác nhận xóa đơn hàng
    removeOrder(orderID) {
      this.$toasted.show("Bạn có chắc chắn muốn xóa đơn hàng", {
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
              this.deleteOrder(orderID);
              this.$store.state.$loading = true;
              this.close = false;
            }
          }
        ]
      })
    },

    //Dowload file excel
    exportToExcel() {
      //Khai báo
      let data = this.orderList;
      const fileName = 'Order_List.xlsx';

      //Xử lý array
      let i;
      for (i = 0; i < data.length; i++) {
        //Khai báo tên cột dữ liệu
        let createdAt = "Thời gian tạo đơn";
        let updatedAt = "Thời gian cập nhập đơn hàng";
        let id = "Mã đơn hàng";
        let customerName = "Tên khách hàng";
        let customerPhone = "Số điện thoại";
        let customerMail = "Địa chỉ email";
        let customerAddress = "Địa chỉ nhận hàng";
        let note = "Ghi chú";
        let totalPrice = "Giá trị đơn hàng"
        let status = "Trạng thái đơn hàng"

        //Xử lý phần thông tin khách hàng
        data[i][createdAt] = data[i].createdAt
        data[i][updatedAt] = data[i].updatedAt
        data[i][id] = data[i].id
        data[i][customerName] = data[i].customerName
        data[i][customerPhone] = data[i].customerPhone
        data[i][customerMail] = data[i].customerMail
        data[i][customerAddress] = data[i].customerAddress
        data[i][note] = data[i].note
        data[i][totalPrice] = data[i].totalPrice
        data[i][status] = data[i].status

        delete data[i].createdAt
        delete data[i].updatedAt
        delete data[i].id
        delete data[i].customerName
        delete data[i].customerPhone
        delete data[i].customerMail
        delete data[i].customerAddress
        delete data[i].note
        delete data[i].totalPrice
        delete data[i].status

        //Xử lý phần thông tin sản phẩm
        let item = data[i].productInfor
        data[i].ten_san_pham_1 = item[0].productName
        data[i].gia_san_pham_1 = item[0].productPrice
        data[i].so_luong_san_pham_1 = item[0].productQuantity
        if (item[1]) {
          data[i].ten_san_pham_2 = item[1].productName
          data[i].gia_san_pham_2 = item[1].productPrice
          data[i].so_luong_san_pham_2 = item[1].productQuantity
        }
        if (item[2]) {
          data[i].ten_san_pham_3 = item[2].productName
          data[i].gia_san_pham_3 = item[2].productPrice
          data[i].so_luong_san_pham_3 = item[2].productQuantity
        }
        if (item[3]) {
          data[i].ten_san_pham_4 = item[3].productName
          data[i].gia_san_pham_4 = item[3].productPrice
          data[i].so_luong_san_pham_4 = item[3].productQuantity
        }
        if (item[4]) {
          data[i].ten_san_pham_5 = item[4].productName
          data[i].gia_san_pham_5 = item[4].productPrice
          data[i].so_luong_san_pham_5 = item[4].productQuantity
        }
        if (item[5]) {
          data[i].ten_san_pham_6 = item[5].productName
          data[i].gia_san_pham_6 = item[5].productPrice
          data[i].so_luong_san_pham_6 = item[5].productQuantity
        }
        if (item[6]) {
          data[i].ten_san_pham_7 = item[6].productName
          data[i].gia_san_pham_7 = item[6].productPrice
          data[i].so_luong_san_pham_7 = item[6].productQuantity
        }
        if (item[7]) {
          data[i].ten_san_pham_8 = item[7].productName
          data[i].gia_san_pham_8 = item[7].productPrice
          data[i].so_luong_san_pham_8 = item[7].productQuantity
        }
        if (item[8]) {
          data[i].ten_san_pham_9 = item[8].productName
          data[i].gia_san_pham_9 = item[8].productPrice
          data[i].so_luong_san_pham_9 = item[8].productQuantity
        }
        if (item[9]) {
          data[i].ten_san_pham_10 = item[9].productName
          data[i].gia_san_pham_10 = item[9].productPrice
          data[i].so_luong_san_pham_10 = item[9].productQuantity
        }
        delete data[i].productInfor
      }
      console.log("handle data", data)

      //export
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'test');
      XLSX.writeFile(wb, fileName);
    },

    //phân trang lùi
    previous() {
      let page = this.page
      if (page > 1) {
        let id = this.shopID
        let pages = page - 1
        router.push({ path: 'store-order', query: { id: id, page: pages } });
        this.getOrderList();
        location.reload();
        window.scrollTo(0, 0);
      }
    },

    //Phân trang tiến
    next() {
      let page = this.page
      let id = this.shopID
      let pages = Number(page) + 1
      router.push({ path: 'store-order', query: { id: id, page: pages } });
      this.getOrderList()
      location.reload();
      window.scrollTo(0, 0);
    },
    onChange(event) {
      console.log(event.target.value)
      this.perpage = event.target.value
      this.getOrderList()
    }
  }
}