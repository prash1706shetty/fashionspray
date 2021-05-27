var orderList = '';
var cookieValue = readCookie();

jQuery(document).ready(function ($) {
  jQuery.ajax({
    type: "GET",
    url: "/fs/getOrdersForFabrics",
    async: false,
    headers: {
      'Conten-Type':'application/json',
      'Authorization': cookieValue
    },
    success: function (result) {
      orderList = result.rows;
      var deliveryDate = '';
      var monthNames = ["Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];
      var table = "<table class='ibm-data-table display dataTable no-footer dtr-inline ibm-widget-processed ibm-grid ibm-altrows' data-info='true' data-ordering='true' data-paging='true' data-searching='true'  role='grid' style='width: 748px;' aria-describedby='table_info'  data-scrollaxis='x' data-widget='datatable' id='prodTable'><thead class='tableHead'><tr><th data-ordering='true'>Order Number</th><th >Customer Name</th><th>Mobile Number</th><th>Delivery Date</th><th>Fabrics</th><th>Action</th></tr></thead><tbody>";
      result.rows.forEach((row, index) => {
        deliveryDate = new Date(row.value.deliveryDate.year, row.value.deliveryDate.month - 1, row.value.deliveryDate.date);
        var rowBgColor = '';
        var deliveryDateValue = '';
        var fabricStatusValue = 'Added';

        var tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        var yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        var currentYear = deliveryDate.getFullYear().toString();
        currentYear = currentYear.substring(currentYear.length - 2);
        if (deliveryDate.getDate() < 10) {
          deliveryDateValue = '0' + deliveryDate.getDate() + monthNames[deliveryDate.getMonth()] + ' ' + currentYear;
        } else {
          deliveryDateValue = deliveryDate.getDate() + monthNames[deliveryDate.getMonth()] + ' ' + currentYear;
        }
        if (deliveryDate.getDate() == new Date().getDate() && deliveryDate.getMonth() == new Date().getMonth() && deliveryDate.getYear() == new Date().getYear()) {
          deliveryDateValue = 'Today';
        } else if (deliveryDate.getDate() == tomorrowDate.getDate() && deliveryDate.getMonth() == tomorrowDate.getMonth() && deliveryDate.getYear() == tomorrowDate.getYear()) {
          deliveryDateValue = 'Tomorrow';
        } else if (deliveryDate.getDate() == yesterdayDate.getDate() && deliveryDate.getMonth() == yesterdayDate.getMonth() && deliveryDate.getYear() == yesterdayDate.getYear()) {
          deliveryDateValue = 'Yesterday';
        }
        var editFabrics = '';

        if (row.value.fabrics == 'Fashion Spray fabrics') {
          rowBgColor = "background-color:#f9ff99";
          fabricStatusValue = 'FS fabrics.'
          editFabrics = '<li><a  style="cursor: pointer;text-decoration: none;" id ="addFabrics-' + row.value._id + '" href="/addfabrics?on=' + row.value.orderNumber + '">Add Fabrics</a></li><li><a  style="cursor: pointer;text-decoration: none;" id ="notRequiredProduct-' + row.value._id + '" onclick="showNotRequiredOverlay(this);">Not required</a></li><li><a  style="cursor: pointer;text-decoration: none;" id ="deleteProduct-' + row.value._id + '" onclick="showDeleteOverlay(this);">Delete Fabrics</a></li>';

        } else if (row.value.fabrics == 'Customer fabrics') {
          rowBgColor = "background-color:#f9ff99";
          fabricStatusValue = 'Customer fabrics.'
          editFabrics = '<li><a  style="cursor: pointer;text-decoration: none;" id ="addFabrics-' + row.value._id + '" href="/addfabrics?on=' + row.value.orderNumber + '">Add Fabrics</a></li><li><a  style="cursor: pointer;text-decoration: none;" id ="notRequiredProduct-' + row.value._id + '" onclick="showNotRequiredOverlay(this);">Not required</a></li><li><a  style="cursor: pointer;text-decoration: none;" id ="deleteProduct-' + row.value._id + '" onclick="showDeleteOverlay(this);">Delete Fabrics</a></li>';

        } else if (row.value.fabrics == undefined) {
          rowBgColor = "background-color:#ff3333";
          fabricStatusValue = 'Not added.'
          editFabrics = '<li><a  style="cursor: pointer;text-decoration: none;" id ="addFabrics-' + row.value._id + '" href="/addfabrics?on=' + row.value.orderNumber + '">Add Fabrics</a></li><li><a  style="cursor: pointer;text-decoration: none;" id ="notRequiredProduct-' + row.value._id + '" onclick="showNotRequiredOverlay(this);">Not required</a></li>';

        } else {
          rowBgColor = "background-color:#99ff99";
          editFabrics = '<li><a  style="cursor: pointer;text-decoration: none;" id ="editFabrics-' + row.value._id + '" href="/editfabrics?on=' + row.value.orderNumber + '">Edit Fabrics</a></li><li><a  style="cursor: pointer;text-decoration: none;" id ="deleteProduct-' + row.value._id + '" onclick="showDeleteOverlay(this);">Delete Fabrics</a></li><li><a  style="cursor: pointer;text-decoration: none;" id ="notRequiredProduct-' + row.value._id + '" onclick="showNotRequiredOverlay(this);">Not required</a></li>';

        }
        table = table + '<tr>' +
          '<td>' + row.value.orderNumber + '</td>' +
          '<td id ="orderDetails-' + row.value._id + '" onclick="getOrderDetails(this);IBMCore.common.widget.overlay.show(\'overlayOrder\'); return false;">' + row.value.customerName + '</td>' +

          '<td>' + row.value.mobileNumber + '</td>' +
          '<td>' + deliveryDateValue + '</td>' +
          '<td style=' + rowBgColor + '>' + fabricStatusValue + '</td>' +
          '<td id="toggle' + index + '" class="elipsis"><img src="/images/overflow-menu--vertical.svg" class="elipsis" style="cursor: pointer;" onclick= "productActionToggle(' + index + ');  return false;\" width="30" height="30"><div style="position:absolute;z-index:1"><ul id="productAction' + index + '" style="display:none;" class="ibm-dropdown-menu productAction">' + editFabrics + '</ul></div></td>' +
          '</tr>';
      });

      table = table + "</tbody></table>";
      jQuery('#table').prepend(table);
      jQuery('.display').dataTable();
      jQuery("#demoLoadingMessage").empty();
      jQuery('body').click(function (e) {
        if (!jQuery(e.target).hasClass('elipsis')) {
          jQuery('.productAction').attr('style', 'display:none')
          return;
        }
      });
    },
    error: function (e) {
      alert("There was some internal error while updating, Please try again after sometime")
    }
  });

});

function getOrderDetails(e) {
  var odId = e.id.split('orderDetails-')[1];
  jQuery('#overlayOrder').html('');
  orderList.forEach((row, index) => {
    if (row.value._id == odId) {
      var orderDate = row.value.orderDate;
      var orderOverlayDetails = "<div id='customerNameDetails'><span class='ibm-bold'>Customer name : </span><span>" + row.value.customerName + "</span></div>" +
        "<div id='dressForDetails'><span class='ibm-bold'>Dress : </span><span>" + row.value.dressFor + " " + row.value.dressType + "</span></div>" +
        "<div id='orderStatus'><span class='ibm-bold'>Order status : </span><span>" + row.value.orderStatus + "</span></div>" +
        "<div id='totalAmountDetails'><span class='ibm-bold'>Total amount : </span><span>" + row.value.totalAmount + "</span></div>" +
        "<div id=advanceAmountDetails><span class='ibm-bold'>Advance paid : </span><span>" + row.value.advanceAmount + "</span></div>" +
        "<div id='modeOfPaymentDetails'><span class='ibm-bold'>Payment mode : </span><span>" + row.value.modeOfPayment + "</span></div>" +
        "<div id='fabricsFromDetails'><span class='ibm-bold'>Fabrics from : </span><span>" + row.value.fabricsFrom + "</span></div>" +
        "<div id='customerLocationDetails'><span class='ibm-bold'>Location : </span><span>" + row.value.customerLocation + "</span></div>" +
        "<div id='measureByDetails'><span class='ibm-bold'>Measurement taken by : </span><span>" + row.value.measureBy + "</span></div>" +
        "<div id='orderDateDetails'><span class='ibm-bold'>Order given date : </span><span>" + orderDate.date + '/' + orderDate.month + '/' + orderDate.year + "</span></div>" +
        "<div id='orderNoteDetails'><span class='ibm-bold'>More details about order : </span><span>" + row.value.orderNote + "</span></div>";
      var occasionDetailsOverlay = '';
      if (row.value.occationDetails.occasion == 'Festival') {
        var festivalDate = row.value.occationDetails.festivalDate;
        occasionDetailsOverlay = "<div id='occasionDetails'><span class='ibm-bold'>Occasion : </span><span>" + row.value.occationDetails.festivalName + " " + row.value.occationDetails.occasion + " on " + festivalDate.date + '/' + festivalDate.month + '/' + festivalDate.year + "</span></div>";
      } else if (row.value.occationDetails.occasion == 'Marriage' || row.value.occationDetails.occasion == 'Birthday') {
        var occasionDate = row.value.occationDetails.occasionDate;
        if (row.value.occationDetails.occasionof == 'family') {
          occasionDetailsOverlay = "<div id='occasionDetails'><span class='ibm-bold'>Occasion : </span><span>" + row.value.occationDetails.occasion + " of " + row.value.occationDetails.familyMemberRelation + " on " + occasionDate.date + '/' + occasionDate.month + '/' + occasionDate.year + "</span></div>";
        } else if (row.value.occationDetails.occasionof == 'other') {
          occasionDetailsOverlay = "<div id='occasionDetails'><span class='ibm-bold'>Occasion : </span><span>" + row.value.occationDetails.occasion + " of " + row.value.occationDetails.occasionof + "</span></div>";
        } else {
          occasionDetailsOverlay = "<div id='occasionDetails'><span class='ibm-bold'>Occasion : </span><span>" + row.value.occationDetails.occasion + " of " + row.value.occationDetails.occasionof + " on " + occasionDate.date + '/' + occasionDate.month + '/' + occasionDate.year + "</span></div>";
        }
      } else if (row.value.occationDetails.occasion == 'other') {
        occasionDetailsOverlay = "<div id='occasionDetails'><span class='ibm-bold'>Occasion : </span><span>" + row.value.occationDetails.otherOccasionName + "</span></div>";
      } else {
        occasionDetailsOverlay = "<div id='occasionDetails'><span class='ibm-bold'>Occasion : </span><span>" + row.value.occationDetails.occasion + "</span></div>";
      }

      var fieldUpdateBoolean = '';
      if (row.value.isFieldUpdateRequired == 'yes') {
        fieldUpdateBoolean = "<div id='isFieldUpdateRequiredDetails' class='ibm-padding-top-r1' style='color: red;''><span class='ibm-bold'>Please update the fields </span><span>" + row.value.updateFields + "</span></div>";
      }

      var finalOrderOverlayDetails = orderOverlayDetails + occasionDetailsOverlay + fieldUpdateBoolean;
      jQuery('#overlayOrder').append(finalOrderOverlayDetails);
    }
  });
}

function productActionToggle(id) {
  jQuery('.productAction').attr('style', 'display:none')
  jQuery("#productAction" + id).attr('style', 'display:block');
}

function closeOverlay(name) {
  IBMCore.common.widget.overlay.hide(name);
}

function showDeleteOverlay(e) {
  jQuery('#deleteOverlay').empty();
  var rejectOverlay = `<p class="ibm-h2">Delete</p><p id="deleteConfirmMsg">Are you sure you want to delete this fabrics for this order?</p>` +
    `<div class="ibm-fluid"><div class="ibm-col-12-12"><p class="ibm-btn-row"> <span id="deleteSpinner" class="ibm-spinner ibm-h2 ibm-fright" />` +
    `<button id="deletePrdBtn-${e.id.split('deleteProduct-')[1]}" class="ibm-btn-pri pg2-overlay-save ibm-btn-blue-50" style="float: right;" onclick="deleteDemo(this);">Delete</button>` +
    `<button id="cancelOverlayBtn-${e.id.split('deleteProduct-')[1]}" class="ibm-btn-sec ibm-btn-transparent ibm-btn-blue-50" style="float: right"; onclick='closeOverlay("deleteOverlay")'>Cancel</button></p>` +
    `</div></div>`;

  jQuery('#deleteOverlay').append(rejectOverlay);
  IBMCore.common.widget.overlay.show('deleteOverlay');
  jQuery("#deleteSpinner").css("display", "none");
}

function showNotRequiredOverlay(e) {
  jQuery('#notRequiredOverlay').empty();
  var rejectOverlay = `<p class="ibm-h2">Fabrics not required?</p><p id="notRequiredConfirmMsg">Why fabrics not required for this order?</p>` +
    `<div class="ibm-fluid"><div class="ibm-col-12-12"><p class="ibm-btn-row"> <span id="notRequiredSpinner" class="ibm-spinner ibm-h2 ibm-fright" />` +
    `<button id="notRequiredPrdBtn-${e.id.split('notRequiredProduct-')[1]}" class="ibm-btn-pri pg2-overlay-save ibm-btn-blue-50" style="float: right;" onclick="customerFabrics(this);">Customer Fabrics</button>` +
    `<button id="notRequiredPrdBtn-${e.id.split('notRequiredProduct-')[1]}" class="ibm-btn-pri pg2-overlay-save ibm-btn-blue-50" style="float: right;" onclick="fsFabrics(this);">FS Fabrics</button>` +
    `<button id="cancelOverlayBtn-${e.id.split('notRequiredProduct-')[1]}" class="ibm-btn-sec ibm-btn-transparent ibm-btn-blue-50" style="float: right"; onclick='closeOverlay("notRequiredOverlay")'>Cancel</button></p>` +
    `</div></div>`;

  jQuery('#notRequiredOverlay').append(rejectOverlay);
  IBMCore.common.widget.overlay.show('notRequiredOverlay');
  jQuery("#notRequiredSpinner").css("display", "none");
}


function escapeSpecialCharacter(text) {
  return text
    .replaceAll('`', '\\`')
    .replaceAll('`', '\\`')
    .replaceAll('!', '\\!')
    .replaceAll('@', '\\@')
    .replaceAll('#', '\\#')
    .replaceAll('$', '\\$')
    .replaceAll('%', '\\%')
    .replaceAll('^', '\\^')
    .replaceAll('&', '\\&')
    .replaceAll('*', '\\*')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)')
    .replaceAll('+', '\\+')
    .replaceAll('=', '\\=')
    .replaceAll('{', '\\{')
    .replaceAll('}', '\\}')
    .replaceAll('[', '\\[')
    .replaceAll(']', '\\]')
    .replaceAll('|', '\\|')
    .replaceAll(':', '\\:')
    .replaceAll(';', '\\;')
    .replaceAll('<', '\\<')
    .replaceAll('>', '\\>')
    .replaceAll(',', '\\,')
    .replaceAll('.', '\\.')
    .replaceAll('?', '\\?')
    .replaceAll('/', '\\/');

}

function deleteDemo(e) {
  var id = escapeSpecialCharacter(e.id);
  jQuery('#' + id).prop('disabled', 'true');
  jQuery('#cancelOverlayBtn-' + id.split('deletePrdBtn-')[1]).prop('disabled', 'true');
  jQuery("#deleteSpinner").addClass('display-inline-block');

  setTimeout(function () {
    let docId = id.split('deletePrdBtn-')[1].replaceAll('\\', '');
    var doc = {
      docId: docId
    }
    jQuery.ajax({
      type: "POST",
      url: "/fs/deletefabrics",
      data: doc,
      headers: {
        'Conten-Type':'application/json',
        'Authorization': cookieValue
      },
      async: false,
      success: function (result) {
        if (result.statusCode == 200) {
          closeOverlay('deleteOverlay');
          window.location.replace("/orderlistforfabrics");
        } else {
          alert('There was some error while updating data');
          closeOverlay('deleteOverlay');

        }
      },
      error: function (e) {
        alert("There was some internal error while updating, Please try again after sometime")
      }
    });

  }, 100);
}

function customerFabrics(e) {
  var id = escapeSpecialCharacter(e.id);
  jQuery('#' + id).prop('disabled', 'true');
  jQuery('#cancelOverlayBtn-' + id.split('notRequiredPrdBtn-')[1]).prop('disabled', 'true');
  jQuery("#notRequiredSpinner").addClass('display-inline-block');

  setTimeout(function () {
    let docId = id.split('notRequiredPrdBtn-')[1].replaceAll('\\', '');

    var doc = {
      docId: docId,
      fabrics: 'Customer fabrics'
    }
    jQuery.ajax({
      type: "POST",
      url: "/fs/addFabrics",
      data: doc,
      headers: {
        'Conten-Type':'application/json',
        'Authorization': cookieValue
      },
      async: false,
      success: function (result) {
        if (result.statusCode == 200) {
          closeOverlay('notRequiredOverlay');
          window.location.replace("/orderlistforfabrics");
        } else {
          alert('There was some error while updating data');
          closeOverlay('notRequiredOverlay');

        }
      },
      error: function (e) {
        alert("There was some internal error while updating, Please try again after sometime")
      }
    });

  }, 100);
}


function fsFabrics(e) {
  var id = escapeSpecialCharacter(e.id);
  jQuery('#' + id).prop('disabled', 'true');
  jQuery('#cancelOverlayBtn-' + id.split('notRequiredPrdBtn-')[1]).prop('disabled', 'true');
  jQuery("#notRequiredSpinner").addClass('display-inline-block');

  setTimeout(function () {
    let docId = id.split('notRequiredPrdBtn-')[1].replaceAll('\\', '');

    var doc = {
      docId: docId,
      fabrics: 'Fashion Spray fabrics'
    }
    jQuery.ajax({
      type: "POST",
      url: "/fs/addFabrics",
      data: doc,
      headers: {
        'Conten-Type':'application/json',
        'Authorization': cookieValue
      },
      async: false,
      success: function (result) {
        if (result.statusCode == 200) {
          closeOverlay('notRequiredOverlay');
          window.location.replace("/orderlistforfabrics");
        } else {
          alert('There was some error while updating data');
          closeOverlay('notRequiredOverlay');

        }
      },
      error: function (e) {
        alert("There was some internal error while updating, Please try again after sometime")
      }
    });

  }, 100);
}

