var cookieValue = readCookie();
jQuery(document).ready(function ($) {
   
    var data = {
        "test1": "test1"
      }
      jQuery.ajax({
        type: "POST",
        url: "/fs/getDifferentOrderCounts",
        data: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + cookieValue
        },
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

      jQuery.ajax({
        
        type: "POST",
        url: "/fs/getYTTOrders",
        data: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + cookieValue
        },
        async: false,
        success: function (result) {      
          var yestOrderCount = 0;
          var yestDeliveryCount = 0;
          var todayOrderCount = 0;
          var todayDeliveryCount = 0;
          var tomoDeliveryCount = 0;
          for(var i=0;i<result.rows.length;i++){
            var orderType = result.rows[i].value
            if(orderType.type == 'delivery' && orderType.when == 'yesterday'){
              yestDeliveryCount++;
            } else if(orderType.type == 'neworder' && orderType.when == 'yesterday'){
              yestOrderCount++;
            } else if(orderType.type == 'neworder' && orderType.when == 'today'){
              todayOrderCount++;
            } else if(orderType.type == 'delivery' && orderType.when == 'today'){
              todayDeliveryCount++;          
            } else if(orderType.type == 'delivery' && orderType.when == 'tomorrow'){
              tomoDeliveryCount++;
            }
          }

          $("#numberOfDeliveredYest").text(yestDeliveryCount);
          $("#numberOfOrderYest").text(yestOrderCount);

          $("#numberOfDeliveredToday").text(todayDeliveryCount);
          $("#numberOfOrderToday").text(todayOrderCount);

          $("#numberOfDelivertomo").text(tomoDeliveryCount);
        },
        error: function (e) {
          alert("There was some internal error while updating, Please try again after sometime")
        }
      });

});

