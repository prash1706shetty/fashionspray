jQuery(document).ready(function ($) {




  jQuery.ajax({
    type: "GET",
    url: "/fs/getOrderData",
    async: false,
    success: function (result) {

      var kidsCount = 0;
      var womenCount = 0;
      var menCount = 0;
      var countArray = [];
      for (row of result.rows) {
        if (row.value.dressFor == 'Kids') {
          kidsCount++;
        } else if (row.value.dressFor == 'Women') {
          womenCount++;
        } else if (row.value.dressFor == 'Men') {
          menCount++;
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
    },
    error: function (e) {
      alert("There was some internal error while updating, Please try again after sometime")
    }
  });



  jQuery.ajax({
    type: "GET",
    url: "/fs/getOrderByMonth",
    async: false,
    success: function (result) {
      if (result.rows.length != 0) {
        var janCount = result.rows[0].value.jan;
        var febCount = result.rows[0].value.feb;
        var marchCount = result.rows[0].value.march;
        var aprilCount = result.rows[0].value.april;

        // new Chart(document.getElementById("bar-chart"), {
        //   type: 'bar',
        //   data: {
        //     labels: ["January 2021", "February 2021", "March 2021", "April 2021"],
        //     datasets: [{
        //       label: "Total order",
        //       backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#3cba6d"],
        //       data: [janCount,febCount,marchCount,aprilCount]
        //     }]
        //   },
        //   options: {
        //     title: {
        //       display: true,
        //       text: 'Number of orders per person.'
        //     }
        //   }
        // });


        new Chart(document.getElementById("bar-chart"), {
          type: 'bar',
          data: {
            labels: ["January 2021", "February 2021", "March 2021", "April 2021"],
            datasets: [
              {
                label: "Total order",
                backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
                data: [janCount,febCount,marchCount,aprilCount]
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


  $("#usecases li").on("click", function(){
    var id = $(this).attr('id');
    
    if(id=='monthlyOrder'){
      $('#genderChart').addClass('display-none');
      $('#monthlyChart').removeClass('display-none');
      $("#monthlyOrderAnchor").css("color","blue");
      $("#orderByGenderAnchor").css("color","");
      $('#monthlyOrderAnchor').attr('aria-selected', true);
      $('#orderByGenderAnchor').attr('aria-selected', false);
    } else {
      $('#monthlyChart').addClass('display-none');
      $('#genderChart').removeClass('display-none');
      $("#orderByGenderAnchor").css("color","blue");
      $("#monthlyOrderAnchor").css("color","");
      $('#monthlyOrderAnchor').attr('aria-selected', false);
      $('#orderByGenderAnchor').attr('aria-selected', true);
    }
  });

  

  // new Chart(document.getElementById("pie-chart"), {
  //   type: 'pie',
  //   data: {
  //     labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
  //     datasets: [{
  //       label: "Population (millions)",
  //       backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
  //       data: [2478, 5267, 734, 784, 433]
  //     }]
  //   },
  //   options: {
  //     title: {
  //       display: true,
  //       text: 'Predicted world population (millions) in 2050'
  //     }
  //   }
  // });
});
