var cookieValue = readCookie();

jQuery(document).ready(function ($) {
  jQuery.ajax({
    type: "GET",
    url: "/fs/getAllOrderData",
    async: false,
    headers: {
      'Conten-Type': 'application/json',
      'Authorization': cookieValue
    },
    success: function (result) {

      var kidsCount = 0;
      var womenCount = 0;
      var menCount = 0;
      var sunday = 0;
      var monday = 0;
      var tuesday = 0;
      var wednesday = 0;
      var thursday = 0;
      var friday = 0;
      var saturday = 0;
      var countArray = [];

      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      for (row of result.rows) {
        if (row.value.dressFor == 'Kids') {
          kidsCount++;
        } else if (row.value.dressFor == 'Women') {
          womenCount++;
        } else if (row.value.dressFor == 'Men') {
          menCount++;
        }

        var dayIs = new Date(row.value.orderDate.year, row.value.orderDate.month - 1, row.value.orderDate.date).getDay();
        if (dayIs === 0) {
          sunday++;
        } else if (dayIs === 1) {
          monday++;
        } else if (dayIs === 2) {
          tuesday++;
        } else if (dayIs === 3) {
          wednesday++;
        } else if (dayIs === 4) {
          thursday++;
        } else if (dayIs === 5) {
          friday++;
        } else {
          saturday++;
        }
      }

      countArray.push(kidsCount);
      countArray.push(womenCount);
      countArray.push(menCount);

      new Chart(document.getElementById("doughnut-chart"), {
        type: 'doughnut',
        data: {
          labels: ["Kids", "Women", "Men"],
          datasets: [{
            label: "Total order",
            backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f"],
            data: countArray
          }]
        },
        options: {
          title: {
            display: true,
            text: 'Number of orders per person.'
          }
        }
      });

      var weekArray = [sunday, monday, tuesday, wednesday, thursday, friday, saturday];
      new Chart(document.getElementById("weekly-bar-chart"), {
        type: 'bar',
        data: {
          labels: days,
          datasets: [
            {
              label: "Total order",
              backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#3e95cd", "#8e5ea2", "#3cba9f", "#8e5ea2"],
              data: weekArray
            }
          ]
        },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Order by each day of week.'
          }
        }
      });
    },
    error: function (e) {
      alert("There was some internal error while updating, Please try again after sometime")
    }
  });

  jQuery.ajax({
    type: "GET",
    url: "/fs/getOrderByMonth",
    async: false,
    headers: {
      'Conten-Type':'application/json',
      'Authorization': cookieValue
    },
    success: function (result) {
      if (result.rows.length != 0) {
        var janCount = result.rows[0].value.jan;
        var febCount = result.rows[0].value.feb;
        var marchCount = result.rows[0].value.march;
        var aprilCount = result.rows[0].value.april;

        new Chart(document.getElementById("bar-chart"), {
          type: 'bar',
          data: {
            labels: ["January 2021", "February 2021", "March 2021", "April 2021"],
            datasets: [
              {
                label: "Total order",
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9"],
                data: [janCount, febCount, marchCount, aprilCount]
              }
            ]
          },
          options: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Order by each month'
            }
          }
        });

      }
    },
    error: function (e) {
      alert("There was some internal error while updating, Please try again after sometime")
    }
  });

  $("#usecases li").on("click", function () {
    var id = $(this).attr('id');

    if (id == 'monthlyOrder') {
      $('#genderChart').addClass('display-none');
      $('#weeklyChart').addClass('display-none');
      $('#monthlyChart').removeClass('display-none');
      $("#monthlyOrderAnchor").css("color", "blue");
      $("#orderByGenderAnchor").css("color", "");
      $("#weeklyOrderAnchor").css("color", "");
      $('#monthlyOrderAnchor').attr('aria-selected', true);
      $('#orderByGenderAnchor').attr('aria-selected', false);
      $('#weeklyOrderAnchor').attr('aria-selected', false);
    } else if (id == 'orderByGender') {
      $('#monthlyChart').addClass('display-none');
      $('#weeklyChart').addClass('display-none');
      $('#genderChart').removeClass('display-none');
      $("#orderByGenderAnchor").css("color", "blue");
      $("#monthlyOrderAnchor").css("color", "");
      $("#weeklyOrderAnchor").css("color", "");
      $('#monthlyOrderAnchor').attr('aria-selected', false);
      $('#weeklyOrderAnchor').attr('aria-selected', false);
      $('#orderByGenderAnchor').attr('aria-selected', true);
    } else {
      $('#monthlyChart').addClass('display-none');
      $('#genderChart').addClass('display-none');
      $('#weeklyChart').removeClass('display-none');
      $("#weeklyOrderAnchor").css("color", "blue");
      $("#monthlyOrderAnchor").css("color", "");
      $("#orderByGenderAnchor").css("color", "");
      $('#monthlyOrderAnchor').attr('aria-selected', false);
      $('#orderByGenderAnchor').attr('aria-selected', false);
      $('#weeklyOrderAnchor').attr('aria-selected', true);
    }
  });
});
