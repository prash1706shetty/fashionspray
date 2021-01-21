var cookieValue = readCookie();
var loggedInUserEmailId = "";
var userPrivilege = ""
var catalogsDetail = ""
var orderList = '';


jQuery(document).ready(function ($) {
  var data = {
    "test1": "test1"
  }
  jQuery.ajax({
    type: "POST",
    url: "/caas/getDocuments",
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + cookieValue
    },
    async: false,
    success: function (result) {
      orderList = result.rows;
      var deliveryDate = '';
      var orderDate = '';
      var table = "<table class='ibm-data-table display dataTable no-footer dtr-inline ibm-widget-processed ibm-grid ibm-altrows' data-info='true' data-ordering='true' data-paging='true' data-searching='true'  role='grid' style='width: 748px;' aria-describedby='table_info'  data-scrollaxis='x' data-widget='datatable' id='prodTable'><thead class='tableHead'><tr><th data-ordering='true'>Customer Name</th><th>Order Number</th><th>Mobile No</th><th>Delivery Date</th><th>Status</th><th>Action</th></tr></thead><tbody>";
      //for (row of result.rows) {
      result.rows.forEach((row, index) => {
        deliveryDate = new Date(row.value.deliveryDate);
        orderDate = new Date(row.value.createDate);
        var rowBgColor = '';
        var orderStatusValue = row.value.orderStatus;
        if (row.value.orderStatus == 'new') {
          rowBgColor = "background-color:#99ff99";
          var Difference_In_Time = deliveryDate - new Date().getTime();
          var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
          if (Difference_In_Days < 2) {
            rowBgColor = "background-color:#b30000";
            orderStatusValue = orderStatusValue + ' Risk';
          } else if (Difference_In_Days < 6) {
            rowBgColor = "background-color:#ff3333";
            orderStatusValue = orderStatusValue + ' Critical'
          }
        }

        if (row.value.orderStatus == 'On process') {
          rowBgColor = "background-color:#ffff66";
        } else if (row.value.orderStatus == 'Delivered') {
          rowBgColor = "background-color:#6666ff";
        } else if (row.value.orderStatus == 'Rejected') {
          rowBgColor = "background-color:#ff66ff";
        }
        table = table + '<tr>' +
          '<td id ="orderDetails-' + row.value._id + '" onclick="getOrderDetails(this);IBMCore.common.widget.overlay.show(\'overlayOffer\'); return false;">' + row.value.customerName + '</td>' +
          '<td>' + row.value.orderNumber + '</td>' +
          '<td>' + row.value.mobileNumber + '</td>' +
          //'<td>'+orderDate.getDate() + '/' + (orderDate.getMonth()+1) + '/' + orderDate.getFullYear()+'</td>'+    
          '<td>' + deliveryDate.getDate() + '/' + (deliveryDate.getMonth() + 1) + '/' + deliveryDate.getFullYear() + '</td>' +
          '<td style=' + rowBgColor + '>' + orderStatusValue + '</td>' +
          '<td id="toggle' + index + '" class="elipsis"><img src="/images/overflow-menu--vertical.svg" class="elipsis" style="cursor: pointer;" onclick= "productActionToggle(' + index + ');  return false;\" width="30" height="30"><div style="position:absolute;z-index:1"><ul id="productAction' + index + '" style="display:none;" class="ibm-dropdown-menu productAction"><li><a  style="cursor: pointer;text-decoration: none;" id ="editProduct-' + row.value._id + '" href="/editorder?on=' + row.value.orderNumber + '">Edit</a></li><li><a  style="cursor: pointer;text-decoration: none;" id ="deleteProduct-' + row.value._id + '" onclick="showDeleteOverlay(this);">Delete</a></li></ul></div></td>' +



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

function populateWelcomePageData(caasData, userAccess) {

  jQuery('#table').empty();
  var productLength = 0;
  var privilegeArray = userAccess.userPrivileges.rows[0].value;
  var userRole = userAccess.userPrivileges.rows[0].key;
  var table = "<table class='ibm-data-table display dataTable no-footer dtr-inline ibm-widget-processed ibm-grid ibm-altrows' data-info='true' data-ordering='true' data-paging='true' data-searching='true'  role='grid' style='width: 748px;' aria-describedby='table_info'  data-scrollaxis='x' data-widget='datatable' id='prodTable'><thead class='tableHead'><tr><th data-ordering='true'>Product Name </th><th>Created By</th><th>Updated By</th><th>Last Updated On</th><th>Status</th><th>Comments</th> <th>Action</th> </tr></thead><tbody>";
  var createDemoButton = privilegeArray.includes('create') ? '<button type="button" class="ibm-btn-pri"  onclick="window.open(\'/add\',\'_self\')" style="float:right;background-color:#0f62fe;font-size:16px;">Create New Demo &emsp; +</button>' : '';
  jQuery("#createDemo").html(createDemoButton);
  var approveContent = '<label>' + REVIEWER_APPROVE_TEXT + '</label>';
  var confirmMessage = '<label>' + REVIEWER_CONFIRM_TEXT + '</label>';
  if (userRole == 'publisher') {
    approveContent = '<label>' + APPROVER_APPROVE_TEXT + '</label>';
    confirmMessage = '<label>' + APPROVER_CONFIRM_TEXT + '</label>';
  }
  jQuery("#approveContent").html(approveContent);
  jQuery("#confirmMessage").html(confirmMessage);

  caasData.forEach((elem, index) => {

    if (elem.document.updatedBy != undefined && (elem.catalog.catalogId == catalogsDetail.publishedCatalogId || (elem.catalog.catalogId == catalogsDetail.draftCatalogId && elem.document.status != 'Published'))) {
      if (userRole != 'author') {
        productLength++;
        // table = table + showProduct(elem, index, privilegeArray, userRole);
      } else if (loggedInUserEmailId.toLowerCase() == elem.document.updatedBy.toLowerCase() && elem.document.productId != DEFAULT_PRODUCT_ID) {
        productLength++;
        // table = table + showProduct(elem, index, privilegeArray, userRole);
      }
    }
  });
  jQuery(".count").append(productLength);
  //jQuery("#demoLoadingMessage").empty();
  jQuery(".prodCount").html('Products(' + productLength + ')');
  table = table + '<tr>' +
    '<td>test Nixon</td>' +
    '<td>Edinburgh</td>' +
    '<td>61</td>' +
    '<td>2011/04/25</td>' +
    '<td>Edinburgh</td>' +
    '<td>61</td>' +
    '<td>2011/04/25</td>' +
    '</tr>' +
    '<tr>' +
    '<td>Tiger Nixon</td>' +
    '<td>Edinburgh</td>' +
    '<td>61</td>' +
    '<td>2011/04/25</td>' +
    '<td>Edinburgh</td>' +
    '<td>61</td>' +
    '<td>2011/04/25</td>' +
    '</tr>';
  table = table + "</tbody></table>";
  //jQuery('#table').prepend(table);
  // jQuery('.display').dataTable();
  jQuery('body').click(function (e) {
    if (!jQuery(e.target).hasClass('elipsis')) {
      jQuery('.productAction').attr('style', 'display:none')
      return;
    }
  });
}

function notificationToggle() {
  jQuery('.count').attr('style', 'display:none')
  jQuery('.notificationList').attr('style', 'display:block');
}

function productActionToggle(id) {
  jQuery('.productAction').attr('style', 'display:none')
  jQuery("#productAction" + id).attr('style', 'display:block');
}

function showInpBoxToInpPrdIdToEdit() {

  jQuery('#editError').attr('style', 'display:none');
  jQuery('#viewError').attr('style', 'display:none');
  jQuery('#viewDiv').addClass('display-none');
  if (jQuery('#editDiv').hasClass('display-none')) {
    jQuery('#editDiv').removeClass('display-none');
  } else {
    jQuery('#editDiv').addClass('display-none');
  }

}

function showInpBoxToInpPrdIdToView() {

  jQuery('#editError').attr('style', 'display:none');
  jQuery('#viewError').attr('style', 'display:none');
  jQuery('#editDiv').addClass('display-none');
  if (jQuery('#viewDiv').hasClass('display-none')) {
    jQuery('#viewDiv').removeClass('display-none');
  } else {
    jQuery('#viewDiv').addClass('display-none');
  }

}

function verifyProductToEdit() {

  jQuery('#editError').attr('style', 'display:none');
  if (jQuery('#editProdId').val() == '') {
    jQuery('#editError').attr('style', '').html('product Id cannnot be empty');
  } else {
    jQuery('#editSpinner').attr('style', 'display:');
    jQuery('#editButton').prop('disabled', true);
    jQuery.ajax({
      type: "POST",
      url: "/cloudant/fetchById",
      data: JSON.stringify({
        productId: jQuery('#editProdId').val()
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookieValue,
      },
      success: function (result) {
        if (JSON.parse(result) == 'missing') {
          jQuery('#editError').attr('style', '').html('Product associated with id ' + jQuery('#editProdId').val() + ' not presnt');
        } else if (JSON.parse(result) == 'deleted') {
          jQuery('#editError').attr('style', '').html('Product associated with id ' + jQuery('#editProdId').val() + ' is been deleted');
        } else {
          window.location.href = '/edit?prdId=' + JSON.parse(result)._id;
        }
        jQuery('#editSpinner').attr('style', 'display:none');
        jQuery('#editButton').prop('disabled', false);
      },
      error: function (e) {
        jQuery('#editError').attr('style', '').html('There was an internal error');
      }
    });
  }
}

function verifyProductToView() {

  jQuery('#viewError').attr('style', 'display:none');
  if (jQuery('#viewProdId').val() == '') {
    jQuery('#viewError').attr('style', '').html('Product Id cannot be empty');
  } else {
    jQuery('#viewSpinner').attr('style', 'display:');
    jQuery('#viewButton').prop('disabled', true);
    jQuery.ajax({
      type: "POST",
      url: "/cloudant/fetchById",
      data: JSON.stringify({
        productId: jQuery('#viewProdId').val()
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookieValue,
      },
      success: function (result) {
        if (JSON.parse(result) == 'missing') {
          jQuery('#viewError').attr('style', '').html('Product associated with id ' + jQuery('#editProdId').val() + 'not presnt');
        } else if (JSON.parse(result) == 'deleted') {
          jQuery('#viewError').attr('style', '').html('Product associated with id ' + jQuery('#editProdId').val() + ' is been deleted');
        } else {
          window.open('/view?prdId=' + JSON.parse(result)._id);
        }
        jQuery('#viewSpinner').attr('style', 'display:none');
        jQuery('#viewButton').prop('disabled', false);
      },
      error: function (e) {
        jQuery('#viewError').attr('style', '').html('There was an internal error');
      }
    });
  }
}

function loadEditFlow(e) {
  var url = encodeURIComponent(e.id.split('edit')[1]);
  window.open('/edit?productName=' + url, '_self');
}

function viewClick(e) {
  let productName = encodeURIComponent(e.id.split('productName-')[1]);
  let productState = jQuery('#productState-' + escapeSpecialCharacter(e.id.split('productName-')[1]));
  let url;
  if (productState == "Published") {
    url = SHOWCASE_DEMO_URL.replace("{product}", productName);
    window.open(url);
  } else {
    url = SHOWCASE_DEMO_URL.replace("{product}", productName);
    window.open(url);
  }
}

function copyToClipBoard() {
  var jQuerytemp = jQuery("<input>");
  jQuery("body").append(jQuerytemp);
  jQuerytemp.val(jQuery("#data").html()).select();
  document.execCommand("copy");
  jQuerytemp.remove();
}

function showRejectOverlay(e) {

  var rejectDom = "";
  var comment = "";

  IBMCore.common.widget.overlay.show('rejectOverlay');
  jQuery('#rejectOverlay').empty();
  if (e.id.includes('rejectReviewedProduct')) {
    rejectDom = `<button id="rejectprdBtn-${e.id.split('rejectReviewedProduct-')[1]}" class="ibm-btn-pri pg2-overlay-save ibm-btn-blue-50" style="float: right;" onclick="rejectReviewedDemo(this);">Reject</button>`;
    comment = fetchDocFileByDocIdAndLang(e.id.split('rejectReviewedProduct-')[1], 'feedback');
  } else {
    rejectDom = `<button id="rejectprdBtn-${e.id.split('rejectReviewProduct-')[1]}" class="ibm-btn-pri pg2-overlay-save ibm-btn-blue-50" style="float: right;" onclick="rejectDemo(this);">Reject</button>`;
    comment = fetchDocFileByDocIdAndLang(e.id.split('rejectReviewProduct-')[1], 'feedback');
  }
  var rejectOverlay = `<p class="ibm-h2">Reject</p><p id="rejectConfirmMsg">please input the comment to reject</p>` +
    `<p><label>Comments<span class="ibm-required">*</span></label></p><textarea  rows="4" cols="40" id="rejectCommentText" name="rejectCommentText" required placeholder="Enter your comments"></textarea><p>` +
    `<div class="ibm-fluid"><div class="ibm-col-12-12"><p class="ibm-btn-row"> <span id="rejectSpinner" class="ibm-spinner ibm-h2 ibm-fright" />`;
  rejectOverlay = rejectOverlay + rejectDom + `<button id="cancelOverlayBtn-${e.id.split('rejectProduct-')[1]}" class="ibm-btn-sec ibm-btn-transparent ibm-btn-blue-50" style="float: right"; onclick='closeOverlay("rejectOverlay")'>Cancel</button></p>` +
    `</div></div></p>`;

  jQuery('#rejectOverlay').append(rejectOverlay);
  if (comment.statusCode == 200) {
    jQuery('#rejectCommentText').html(JSON.parse(comment.body).feedback);
  }
  jQuery("#rejectSpinner").css("display", "none");
  jQuery('#rejectCommentText').focus(function () {
    jQuery('#rejectCommentText').removeClass('text-area-error');
  });
}

function showApproveOverlay(e) {
  var approveConfirmMsg = "";
  var approveDom = "";
  var overlayTitle = ""

  if (e.id.includes('publishReviewedProduct')) {
    overlayTitle = "Publish";
    approveConfirmMsg = "Are you sure you want to publish this demo?"
    approveDom = `<button id="approvePrdBtn-${e.id.split('publishReviewedProduct-')[1]}" class="ibm-btn-pri pg2-overlay-save ibm-btn-blue-50" style="float: right;" onclick="publishDemo(this);">Publish</button>`;
  } else {
    overlayTitle = "Approve";
    approveConfirmMsg = "Are you sure you want to approve this demo?"
    approveDom = `<button id="approvePrdBtn-${e.id.split('approveReviewProduct-')[1]}" class="ibm-btn-pri pg2-overlay-save ibm-btn-blue-50" style="float: right;" onclick="approveDemo(this);">Approve</button>`;
  }

  jQuery('#approveOverlay').empty();
  var approveOverlay = `<p class="ibm-h2">${overlayTitle}</p><p id="approveConfirmMsg">${approveConfirmMsg}</p>` +
    `<div class="ibm-fluid"><div class="ibm-col-12-12"><p class="ibm-btn-row"> <span id="approveSpinner" class="ibm-spinner ibm-h2 ibm-fright" />`;
  approveOverlay = approveOverlay + approveDom + `<button id="cancelOverlayBtn-${e.id.split('approveProduct-')[1]}" class="ibm-btn-sec ibm-btn-transparent ibm-btn-blue-50" style="float: right"; onclick='closeOverlay("approvOverlay")'>Cancel</button></p>` +
    `</div></div>`;

  jQuery('#approveOverlay').append(approveOverlay);
  IBMCore.common.widget.overlay.show('approveOverlay');
  jQuery("#approveSpinner").css("display", "none");

}

function showDeleteOverlay(e) {
  jQuery('#deleteOverlay').empty();
  var rejectOverlay = `<p class="ibm-h2">Delete</p><p id="deleteConfirmMsg">Are you sure you want to delete this demo?</p>` +
    `<div class="ibm-fluid"><div class="ibm-col-12-12"><p class="ibm-btn-row"> <span id="deleteSpinner" class="ibm-spinner ibm-h2 ibm-fright" />` +
    `<button id="deletePrdBtn-${e.id.split('deleteProduct-')[1]}" class="ibm-btn-pri pg2-overlay-save ibm-btn-blue-50" style="float: right;" onclick="deleteDemo(this);">Delete</button>` +
    `<button id="cancelOverlayBtn-${e.id.split('deleteProduct-')[1]}" class="ibm-btn-sec ibm-btn-transparent ibm-btn-blue-50" style="float: right"; onclick='closeOverlay("deleteOverlay")'>Cancel</button></p>` +
    `</div></div>`;

  jQuery('#deleteOverlay').append(rejectOverlay);
  IBMCore.common.widget.overlay.show('deleteOverlay');
  jQuery("#deleteSpinner").css("display", "none");

}

function getOrderDetails(e) {

  var odId = e.id.split('orderDetails-')[1];
  console.log("test->" + JSON.stringify(orderList));
  orderList.forEach((row, index) => {
    if (row.value._id == odId) {
      jQuery('#customerNameDetails').text("Customer name : " + row.value.customerName);      
      jQuery('#dressForDetails').text("Dress for : " + row.value.dressFor);
      jQuery('#dressTypeDetails').text("Dress type : " + row.value.dressType);
      jQuery('#totalAmountDetails').text("Total amount : " + row.value.totalAmount);
      jQuery('#advanceAmountDetails').text("Advance paid : " + row.value.advanceAmount);
      jQuery('#fabricsFromDetails').text("Fabrics from : " + row.value.fabricsFrom);
      jQuery('#customerLocationDetails').text("Location : " + row.value.customerLocation);
      jQuery('#modeOfPaymentDetails').text("Payment mode : " + row.value.modeOfPayment);
      jQuery('#measureByDetails').text("Measurement taken by : " + row.value.measureBy);
    }
  });
}

function closeOverlay(name) {

  IBMCore.common.widget.overlay.hide(name);
}

function rejectDemo(e) {

  var id = escapeSpecialCharacter(e.id);
  if (jQuery('#rejectCommentText').val() == "") {
    jQuery('#rejectCommentText').addClass('text-area-error');
  } else {
    jQuery('#cancelOverlayBtn' + id.split('rejectprdBtn-')[1]).prop('disabled', 'true');
    jQuery('#' + id).prop('disabled', 'true');
    jQuery("#rejectSpinner").addClass('display-inline-block');

    setTimeout(function () {
      updateRejectDocStatus(e, 'Draft');
    }, 100);
  }
}

function approveDemo(e) {
  var id = escapeSpecialCharacter(e.id);

  jQuery('#cancelOverlayBtn' + id.split('approvePrdBtn-')[1]).prop('disabled', 'true');
  jQuery('#' + id).prop('disabled', 'true');
  jQuery("#approveSpinner").addClass('display-inline-block');

  setTimeout(function () {
    let docId = id.split('approvePrdBtn-')[1].replaceAll('\\', '');

    var doc = {
      status: "Reviewed"
    }
    resp = updateDocumentJson(doc, docId);
    if (resp.statusCode == 200) {
      updateTable();
      closeOverlay('approveOverlay');
    } else {
      alert('There was some error while updating data');
      closeOverlay('approveOverlay');
    }

  }, 100);

}

function deleteDemo(e) {
  var id = escapeSpecialCharacter(e.id);

  jQuery('#' + id).prop('disabled', 'true');
  jQuery('#cancelOverlayBtn-' + id.split('deletePrdBtn-')[1]).prop('disabled', 'true');
  jQuery("#deleteSpinner").addClass('display-inline-block');

  setTimeout(function () {
    let docId = id.split('deletePrdBtn-')[1].replaceAll('\\', '');
    var doc = {
      docId: docId,
      status: "Deleted"
    }


    jQuery.ajax({
      type: "POST",
      url: "/fs/deleteorder",
      data: JSON.stringify(doc),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookieValue
      },
      async: false,
      success: function (result) {
        if (result.statusCode == 200) {
          // updateTable();
          closeOverlay('deleteOverlay');
          window.location.replace("/");
        } else {
          alert('There was some error while updating data');
          closeOverlay('deleteOverlay');

        }
      },
      error: function (e) {
        alert("There was some internal error while updating, Please try again after sometime")
      }
    });






    //resp = updateDocumentJson(doc, docId);

  }, 100);

}

function fetchComment(e) {

  var resp = fetchDocFileByDocIdAndLang(e.id.split('comment-')[1], 'feedback');
  jQuery('#commentOverlay').empty().append('<div id="commentText"></div>');
  IBMCore.common.widget.overlay.show('commentOverlay');
  if (resp.statusCode == 200 && JSON.parse(resp.body).comment != "") {
    jQuery('#commentText').html(JSON.parse(resp.body).feedback);
  } else {
    jQuery('#commentText').html("No Comments");
  }
}

function updateTable() {

  var caasData = fetchDocumentListByBrief();
  if (caasData.statusCode == 200) {
    populateWelcomePageData(JSON.parse(caasData.body), userPrivilege);
  } else {
    IBMCore.common.widget.overlay.show("confirmationOverlay");
    jQuery("#overlayMsg").empty().append("There was some error while updating data");
  }
}

function publishDemo(e) {
  var id = (escapeSpecialCharacter(e.id));

  var docId = id.split('approvePrdBtn-')[1].replaceAll('\\', '');
  jQuery('#cancelOverlayBtn' + id.split('approvePrdBtn-')[1]).prop('disabled', 'true');
  jQuery('#' + id).prop('disabled', 'true');
  jQuery("#approveSpinner").addClass('display-inline-block');

  setTimeout(function () {
    var doc = {
      status: "To be Published"
    }
    resp = updateDocumentJson(doc, docId);
    if (resp.statusCode == 200) {
      updateTable();
      closeOverlay('approveOverlay');
    } else {
      alert('There was some error while updating data');
      closeOverlay('approveOverlay');
    }
  }, 100);

}

function updateRejectDocStatus(e, status) {
  var id = (escapeSpecialCharacter(e.id));

  let docId = id.split('rejectprdBtn-')[1].replaceAll('\\', '');
  var doc = {
    status: status
  }
  updateDocumentJson(doc, docId);
  var comment = {
    reviewerId: loggedInUserEmailId,
    updatedOn: new Date().getTime(),
    feedback: jQuery('#rejectCommentText').val()
  }
  resp = updateDocumentFile(comment, docId, 'feedback');
  if (resp.statusCode == 200) {
    updateTable();
    closeOverlay('rejectOverlay');
  } else {
    alert('There was some error while updating data');
    closeOverlay('rejectOverlay');
  }
}

function rejectReviewedDemo(e) {
  var id = (escapeSpecialCharacter(e.id));

  if (jQuery('#rejectCommentText').val() == "") {
    jQuery('#rejectCommentText').addClass('text-area-error');
  } else {
    jQuery('#cancelOverlayBtn' + id.split('rejectprdBtn-')[1]).prop('disabled', 'true');
    jQuery('#' + id).prop('disabled', 'true');
    jQuery("#rejectSpinner").addClass('display-inline-block');

    setTimeout(function () {
      updateRejectDocStatus(e, 'Draft');
    }, 100);

  }
}

function showOptions(approveid, rejectId, privilegeArray) {
  var approveVal = "";
  if (approveid.includes('approveReviewProduct')) {
    approveVal = 'Approve';
  } else {
    approveVal = 'Publish';
  }

  var privilegeJson = {
    approvePrivilege: privilegeArray.includes('approve') ? `<li><a  style='cursor: pointer;text-decoration: none;' id ="${approveid}" onclick="showApproveOverlay(this);">${approveVal}</a></li>` : '',
    rejectPrivilege: privilegeArray.includes('reject') ? `<li><a style='cursor:pointer;text-decoration: none;' id ="${rejectId}"onclick="showRejectOverlay(this);">Reject</a></li>` : ''
  }

  return privilegeJson;
}

function showProduct(elem, index, privilegeArray, userRole) {
  var approvePrivilege = "";
  var rejectPrivilege = "";
  var editPrivilege = "";
  var deletePrivilege = "";

  if (userRole == 'publisher' && elem.document.status == 'Reviewed') {

    approvePrivilege = showPublishMenu(elem, privilegeArray).approvePrivilege;
    rejectPrivilege = showPublishMenu(elem, privilegeArray).rejectPrivilege;
  } else if (userRole == 'reviewer' && elem.document.status == 'Ready for review') {

    approvePrivilege = showApproveMenu(elem, privilegeArray).approvePrivilege;
    rejectPrivilege = showApproveMenu(elem, privilegeArray).rejectPrivilege;
  } else if (userRole == 'admin') {

    if (elem.document.status == 'Ready for review') {

      approvePrivilege = showApproveMenu(elem, privilegeArray).approvePrivilege;
      rejectPrivilege = showApproveMenu(elem, privilegeArray).rejectPrivilege;
    } else if (elem.document.status == 'Reviewed') {

      approvePrivilege = showPublishMenu(elem, privilegeArray).approvePrivilege;
      rejectPrivilege = showPublishMenu(elem, privilegeArray).rejectPrivilege;
    } else if (elem.document.status == 'Draft') {
      editPrivilege = showEditDeleteMenu(elem, privilegeArray).editPrivilege;
      deletePrivilege = showEditDeleteMenu(elem, privilegeArray).deletePrivilege;
    }
  } else if (userRole == 'author' && elem.document.status == 'Draft') {

    editPrivilege = showEditDeleteMenu(elem, privilegeArray).editPrivilege;
    deletePrivilege = showEditDeleteMenu(elem, privilegeArray).deletePrivilege;
  }

  var tr = `<tr id="${elem.key}">
              <td onclick= 'viewClick(this)' id="productName-${elem.catalog.document.documentId}"  style='color:blue;cursor: pointer;' >${elem.document.offeringName}</td>
              <td id="createdBy-${elem.catalog.document.documentId}"  style='color:blue;cursor: pointer;' >${elem.document.createdBy}</td>
              <td id="updatedBy-${elem.catalog.document.documentId}"  style='color:blue;cursor: pointer;' >${elem.document.updatedBy}</td>
              <td id="productUpdated-${elem.catalog.document.documentId}" style='position: relative;'>${timeStampToDate(elem.document.updatedDate)}</td>
              <td id="productStatus-${elem.catalog.document.documentId}" style='position: relative;'>${elem.document.status}</td>
              <td style='position: relative;'>
               <img id="comment-${elem.catalog.document.documentId}"src="/images/document.svg"  width="30" height="30" onclick= "fetchComment(this)" style="cursor: pointer;"></td>
              <td id="toggle${index}" class='elipsis'>
                  <img src="/images/overflow-menu--vertical.svg" class='elipsis' style="cursor: pointer;" onclick= \"productActionToggle(${index});  return false;\" width="30" height="30">
                  <div style='position:absolute;z-index:1'>
                  <ul id='productAction${index}' style='display:none;' class='ibm-dropdown-menu productAction'>` +
    approvePrivilege + rejectPrivilege + editPrivilege + deletePrivilege +
    `</ul>
                  </div>
              </td>
          </tr>`;
  var notification = `<li><a href="#">"${elem.document.offeringName}" is ready for review</a></li>`;
  jQuery(".notificationList").append(notification);
  return tr;
}

function showApproveMenu(elem, privilegeArray) {

  let statusJson = showOptions('approveReviewProduct-' + elem.catalog.document.documentId, 'rejectReviewProduct-' + elem.catalog.document.documentId, privilegeArray);
  var approveRejectJson = {
    approvePrivilege: statusJson.approvePrivilege,
    rejectPrivilege: statusJson.rejectPrivilege,
  }
  return approveRejectJson;
}

function showPublishMenu(elem, privilegeArray) {

  let statusJson = showOptions('publishReviewedProduct-' + elem.catalog.document.documentId, 'rejectReviewedProduct-' + elem.catalog.document.documentId, privilegeArray);
  var publishRejectJson = {
    approvePrivilege: statusJson.approvePrivilege,
    rejectPrivilege: statusJson.rejectPrivilege,
  }
  return publishRejectJson;
}

function showEditDeleteMenu(elem, privilegeArray) {

  var editDeleteJson = {
    editPrivilege: privilegeArray.includes('edit') ? `<li><a id='edit${elem.catalog.document.documentId.replaceAll("'", "%27").replaceAll('\"', '%22')}'  style='cursor: pointer;text-decoration: none;' onclick="loadEditFlow(this)">Edit</a></li>` : '',
    deletePrivilege: privilegeArray.includes('delete') ? `<li><a id='deleteProduct-${elem.catalog.document.documentId}' style='cursor: pointer;text-decoration: none;' onclick="showDeleteOverlay(this)">Delete</a></li>` : '',
  }
  return editDeleteJson;
}
