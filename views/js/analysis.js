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
    if(row.value.dressFor == 'kids'){
      kidsCount++;
    } else if(row.value.dressFor == 'women'){
      womenCount++;
    } else if(row.value.dressFor == 'men'){
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
      datasets: [
        {
          label: "Number of order for each type of person.",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f"],
          data: countArray
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Total dress order for each type of Gender'
      }
    }
});
   
  
      },
      error: function (e) {
          alert("There was some internal error while updating, Please try again after sometime")
      }
  });



// Bar chart
new Chart(document.getElementById("bar-chart"), {
    type: 'bar',
    data: {
      labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
      datasets: [
        {
          label: "Population (millions)",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
          data: [2478,5267,734,784,433]
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Predicted world population (millions) in 2050'
      }
    }
});

new Chart(document.getElementById("pie-chart"), {
    type: 'pie',
    data: {
      labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
      datasets: [{
        label: "Population (millions)",
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        data: [2478,5267,734,784,433]
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Predicted world population (millions) in 2050'
      }
    }
});



});
