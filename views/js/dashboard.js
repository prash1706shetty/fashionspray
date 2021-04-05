jQuery(document).ready(function ($) {

  jQuery.ajax({
    type: "GET",
    url: "/fs/getDifferentOrderCounts",
    async: false,
    success: function (result) {
      if (result.rows.length != 0) {
        var totalCountDelivered = result.rows[0].value.delivered;
        var totalCountNew = result.rows[0].value.new;
        var totalCountOnProcess = result.rows[0].value.onProcess;
        var totalCountReady = result.rows[0].value.ready;
        var allOrders = totalCountDelivered + totalCountNew + totalCountOnProcess + totalCountReady;

        $("#numberOfNewOrders").text(totalCountNew);
        $("#numberOfProcessOrders").text(totalCountOnProcess);
        $("#numberOfReadyOrders").text(totalCountReady);
        $("#numberOfDeliveredOrders").text(totalCountDelivered);
        $("#numberOfAllOrders").text(allOrders);
      }
    },
    error: function (e) {
      alert("There was some internal error while updating, Please try again after sometime")
    }
  });


  var todayDate = new Date().getDate();
  var todaymonth = new Date().getMonth() + 1;
  var todayyear = new Date().getFullYear();
  const yesterday = new Date();
  const tomorrow = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  var yesterdayDate = yesterday.getDate();
  var yesterdayMonth = yesterday.getMonth() + 1;
  var yesterdayYear = yesterday.getFullYear();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var tomorrowDate = tomorrow.getDate();
  var tomorrowMonth = tomorrow.getMonth() + 1;
  var tomorrowYear = tomorrow.getFullYear();

  var doc = {
    todayDate: todayDate,
    yesterdayDate: yesterdayDate,
    tomorrowDate: tomorrowDate,
    todaymonth: todaymonth,
    yesterdayMonth: yesterdayMonth,
    tomorrowMonth: tomorrowMonth,
    todayyear: todayyear,
    yesterdayYear: yesterdayYear,
    tomorrowYear: tomorrowYear
  }

  jQuery.ajax({
    type: "POST",
    url: "/fs/getYTTOrders",
    data: JSON.stringify(doc),
    headers: {
      'Content-Type': 'application/json'
    },
    async: false,
    success: function (result) {

      var yestOrderCount = 0;
      var yestDeliveryCount = 0;
      var yestDeliveredCount = 0;
      var todayOrderCount = 0;
      var todayDeliveryCount = 0;
      var todayDeliveredCount = 0;
      var tomoDeliveryCount = 0;

      for (order of result.data) {
        var orderDateDB = order.orderDate.date + '/' + order.orderDate.month + '/' + order.orderDate.year;
        var deliveryDateDB = order.deliveryDate.date + '/' + order.deliveryDate.month + '/' + order.deliveryDate.year;
        var todayDateLocal = todayDate + '/' + todaymonth + '/' + todayyear;
        var yesterdayDateLocal = yesterdayDate + '/' + yesterdayMonth + '/' + yesterdayYear;
        var tomorrowDateLocal = tomorrowDate + '/' + tomorrowMonth + '/' + tomorrowYear;

        if (orderDateDB === todayDateLocal) {
          todayOrderCount++
        } else if (orderDateDB === yesterdayDateLocal) {
          yestOrderCount++;
        }

        if (deliveryDateDB === todayDateLocal) {
          todayDeliveryCount++
          if (order.orderStatus === 'Delivered')
            todayDeliveredCount++;

        } else if (deliveryDateDB === yesterdayDateLocal) {
          yestDeliveryCount++;
          if (order.orderStatus === 'Delivered')
            yestDeliveredCount++;
        }

        if (deliveryDateDB === tomorrowDateLocal) {
          tomoDeliveryCount++
        }
      }

      $("#numberOfDeliveryYest").text(yestDeliveryCount);
      $("#numberOfDeliveredYest").text(yestDeliveredCount);
      $("#numberOfOrderYest").text(yestOrderCount);
      $("#numberOfDeliveryToday").text(todayDeliveryCount);
      $("#numberOfDeliveredToday").text(todayDeliveredCount);
      $("#numberOfOrderToday").text(todayOrderCount);
      $("#numberOfDelivertomo").text(tomoDeliveryCount);
    },
    error: function (e) {
      alert("There was some internal error while updating, Please try again after sometime")
    }
  });

});

