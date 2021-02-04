var cookieValue = readCookie();
var formValidation = true;
var createDate = '';

jQuery(document).ready(function ($) {

  var searchParams = new URLSearchParams(window.location.search);
  let param = searchParams.get('on')
  var doc = {
    docId: param
  }

  jQuery.ajax({
    type: "POST",
    url: "/getOrder",
    data: JSON.stringify(doc),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + cookieValue
    },
    async: false,
    success: function (result) {
      
      preloadForm(result);
    },
    error: function (e) {
      alert("There was some internal error while updating, Please try again after sometime")
    }
  });



  //$('.ibm-calendar-link').hide();
  $("#dressFor").change(function () {
    var personType = $('#dressFor').val();
    $('#dressType').removeAttr("disabled");
    $('#dressType')
      .find('option')
      .remove();
    if (personType == 'Women') {
      $('#dressType').append('<option selected value="selectType">Select Dress Type</option>')
        .append('<option value="Gown">Gown</option>')
        .append('<option value="Lehanga">Lehanga</option>')
        .append('<option value="Blouse">Blouse</option>')
        .append('<option value="Blouse and Saree">Blouse & Saree</option>')
        .append('<option value="Blouse and Embroidery">Blouse & Embroidery</option>')
        .append('<option value="Salwar">Salwar</option>')
        .append('<option value="Salwar and kameez">Salwar & kameez</option>')
        .append('<option value="Western">Western</option>')
        .append('<option value="Crop top">Crop top</option>')
        .append('<option value="Long skirt">Long skirt</option>')
        .append('<option value="Crop top & long skirt">Crop top & long skirt</option>')
        .append('<option value="Saree">Saree</option>');
    } else if (personType == 'Kids') {
      $('#dressType').append('<option selected value="selectType">Select Dress Type</option>')
        .append('<option value="Frock">Frock</option>')
        .append('<option value="Gown">Gown</option>')
        .append('<option value="Lehanga">Lehanga</option>')
        .append('<option value="Langa dhavani">Langa dhavani</option>')
        .append('<option value="Traditional">Traditional</option>')
        .append('<option value="Western">Western</option>');
    } else if (personType == 'Men') {
      $('#dressType').append('<option selected value="selectType">Select Dress Type</option>')
        .append('<option value="Shirt">Shirt and Pant</option>')
        .append('<option value="Pant">Western</option>')
        .append('<option value="Sherwani">Sherwani</option>');
    } else if (personType == 'selectPerson') {
      $('#dressType').append('<option selected value="selectType">Select Dress Type</option');
      $('#dressType').attr('disabled', true);
    }
  });

  $("#occasion").change(function () {
    var occasion = $('#occasion').val();
    $('#occasionDateId').addClass('display-none');
    $('#familyMemberRelationId').addClass('display-none');
    $('input[name="occasionPerson"]').prop('checked', false);
    $('#occasionDate').val("");
    $('#festivalName').val("");
    $('#otherOccasionName').val("");
    $('#familyMemberRelation').val("");
    $('#otherOccasionId').addClass('display-none');
    if (occasion == 'Birthday') {
      $('#occasionOfId').removeClass('display-none');
      $("#occaionOfTitle").text("Birthday of");
      $('#festivalNameId').addClass('display-none');
      $("#occasionDateTitle").text("Birthday date");
      //var selectOption = '<select name="occasionOf" id="occasionOf" style="width:180px;"><option selected value="select">Select relation</option> <option value="customer">Customer</option><option value="familyMember">Family Member</option><option value="other">Other</option></select>';
      //$('#occasionOfSelect').prepend(selectOption);
    } else if (occasion == 'Marriage') {
      $('#occasionOfId').removeClass('display-none');
      $("#occaionOfTitle").text("Marriage of");
      $('#festivalNameId').addClass('display-none');
      $("#occasionDateTitle").text("Marriage date");
    } else if (occasion == 'Festival') {
      $('#occasionOfId').addClass('display-none');
      $('#festivalNameId').removeClass('display-none');
      $('#occasionDateId').removeClass('display-none');
      $("#occasionDateTitle").text("Festival date");

    } else if (occasion == 'other') {
      $('#occasionOfId').addClass('display-none');
      $('#festivalNameId').addClass('display-none');
      $('#occasionDateId').addClass('display-none');
      $('#otherOccasionId').removeClass('display-none');

    } else {
      $('#occasionOfId').addClass('display-none');
      $('#festivalNameId').addClass('display-none');
    }
  });


  $("#fabricsFrom").change(function () {
    var faricsFrom = $('#fabricsFrom').val();
    if (faricsFrom == 'fs') {
      $('#addFabrics').removeClass('display-none');
    } else {
      $('#addFabrics').addClass('display-none');
    }

  });
  var addCount = 0;
  $("#Add").on("click", function () {
    addCount++;
    //$("#textboxDiv").append('<div><br><input id="fabrics' + addCount + '" type="text"/><br></div>');
    $("#textboxDiv").append('<div class="ibm-padding-top-1"><div style="display: inline-block;"><div class="fieldPaddingTop"><input type="text" class="fieldWidthSmall" id="advanceAmount" name="advanceAmount" value="" placeholder="Enter type of fabric." onfocus="clearRedColor(this)"></div></div><div style="display: inline-block;margin-left:38px;"><div class="fieldPaddingTop"><input type="text" class="fieldWidthSmall" id="advanceAmount" name="advanceAmount" value="" placeholder="Enter advance paid." onfocus="clearRedColor(this)"></div></div> <div style="display: inline-block;margin-left:38px;"><div class="fieldPaddingTop"><input type="text" class="fieldWidthSmall" id="advanceAmount" name="advanceAmount" value="" placeholder="Enter advance paid." onfocus="clearRedColor(this)"></div></div></div>');
  });
  $("#Remove").on("click", function () {
    if (addCount != 0) {
      addCount--;
    }

    $("#textboxDiv").children().last().remove();
  });


  // $('.ibm-calendar-link').hide();

  var existCondition = setInterval(function () {
    if ($('.ibm-calendar-link').length) {
      clearInterval(existCondition);
      $('.ibm-calendar-link').hide();
    }
  }, 100); // check every 100ms


  $("form").dblclick(function (e) {
    var inputId = $(e.target).closest('input').attr('id');
    if(inputId !=undefined){
      $('#' + inputId).prop('readonly', false);    
      if (inputId.includes("TextField")) {
        $('#' + inputId + 'dd').removeClass('display-none');
        $('#' + inputId).addClass('display-none');
        $('#' + inputId).val('');
        if (inputId == 'occasionTextField') {
          $('#occasionOfId').addClass('display-none');
          $('#occasionDateId').addClass('display-none');
          $('#familyMemberRelationId').addClass('display-none');
          $('#festivalNameId').addClass('display-none');
          $('#otherOccasionId').addClass('display-none');        
        }
        if (inputId == 'dressForTextField') {
          $('#dressTypeTextField').prop('disabled', false);
          $('#dressTypeTextFielddd').removeClass('display-none');
          $('#dressTypeTextField').addClass('display-none');
        }
      }
    }
   
    var textAreaId = $(e.target).closest('textarea').attr('id');    
    if(textAreaId != undefined){      
      $('#orderNote').prop('readonly', false);
    }
  });
});

function preloadForm(result) {
  createDate = result.data.createDate;
  jQuery('#customerName').prop('readonly', true);
  jQuery('#customerName').val(result.data.customerName);

  jQuery('#dressForTextField').prop('readonly', true);
  jQuery('#dressForTextField').val(result.data.dressFor);

  //jQuery('#dressTypeTextField').prop('readonly', true);
  jQuery('#dressTypeTextField').prop('disabled', true);
  jQuery('#dressTypeTextField').val(result.data.dressType);

  jQuery('#totalAmount').prop('readonly', true);
  jQuery('#totalAmount').val(result.data.totalAmount);

  jQuery('#advanceAmount').prop('readonly', true);
  jQuery('#advanceAmount').val(result.data.advanceAmount);

  jQuery('#mobileNumber').prop('readonly', true);
  jQuery('#mobileNumber').val(result.data.mobileNumber);

  jQuery('#orderNumber').val(result.data.orderNumber);

  var deliveryDate = new Date(result.data.deliveryDate);
  jQuery('#deliveryDate').prop('readonly', true);
  jQuery('#deliveryDate').val(deliveryDate.getDate() + '/' + (deliveryDate.getMonth() + 1) + '/' + deliveryDate.getFullYear());

  var orderDate = new Date(result.data.orderDate);
  jQuery('#orderDate').prop('readonly', true);
  jQuery('#orderDate').val(orderDate.getDate() + '/' + (orderDate.getMonth() + 1) + '/' + orderDate.getFullYear());

  
  jQuery('#deliveryTimeTextField').prop('readonly', true);
  jQuery('#deliveryTimeTextField').val(result.data.deliveryTime);

  jQuery('#customerLocation').prop('readonly', true);
  jQuery('#customerLocation').val(result.data.customerLocation);

  jQuery('#modeOfPayment').prop('readonly', true);
  jQuery('#modeOfPayment').val(result.data.modeOfPayment);

  jQuery('#fabricsFromTextField').prop('readonly', true);
  jQuery('#fabricsFromTextField').val(result.data.fabricsFrom);

  jQuery('#orderStatusTextField').prop('readonly', true);
  jQuery('#orderStatusTextField').val(result.data.orderStatus);

  jQuery('#customerSource').prop('readonly', true);
  jQuery('#customerSource').val(result.data.customerSource);

  jQuery('#typeOfCustomerTextField').prop('readonly', true);
  jQuery('#typeOfCustomerTextField').val(result.data.typeOfCustomer);

  jQuery('#measureByTextField').prop('readonly', true);
  jQuery('#measureByTextField').val(result.data.measureBy);

  jQuery('#occasionTextField').prop('readonly', true);
  jQuery('#occasionTextField').val(result.data.occationDetails.occasion);
  var occationDetails = result.data.occationDetails;

  if (occationDetails.occasion == 'Birthday' || occationDetails.occasion == 'Marriage') {
   
    jQuery('#occasionOfId').removeClass('display-none');
    jQuery("#occaionOfTitle").text("Occasion of");
    var checkedValue = occationDetails.occasionof;
    var occasionDate = '';
    if (checkedValue == 'customer') {
      jQuery("#customerOccasion").prop("checked", true);
      occasionDate = occationDetails.occasionDate;
      jQuery("#occasionDateTitle").text("Occasion date");
      jQuery('#occasionDateId').removeClass('display-none');
      jQuery('#occasionDate').prop('readonly', true);
      var occasionDateTimestamp = new Date(occationDetails.occasionDate);
      jQuery('#occasionDate').val(occasionDateTimestamp.getDate() + '/' + (occasionDateTimestamp.getMonth() + 1) + '/' + occasionDateTimestamp.getFullYear());
    } else if (checkedValue == 'family') {
      jQuery("#familyOccasion").prop("checked", true);
      occasionDate = occationDetails.occasionDate;
      jQuery("#occasionDateTitle").text("Occasions date");
      jQuery('#occasionDateId').removeClass('display-none');
      //jQuery('#occasionDate').prop('readonly', true);
      var occasionDateTimestamp = new Date(occationDetails.occasionDate);
      jQuery('#occasionDate').val(occasionDateTimestamp.getDate() + '/' + (occasionDateTimestamp.getMonth() + 1) + '/' + occasionDateTimestamp.getFullYear());

      jQuery('#familyMemberRelationId').removeClass('display-none');
      jQuery('#familyMemberRelation').prop('readonly', true);
      jQuery('#familyMemberRelation').val(occationDetails.familyMemberRelation);
    } else if (checkedValue == 'other') {
      jQuery("#otherOccasion").prop("checked", true);

    }
  } else if (occationDetails.occasion == 'Festival') {

    jQuery('#festivalNameId').removeClass('display-none');
    jQuery('#occasionDateId').removeClass('display-none');
    jQuery("#occasionDateTitle").text("Festival date");
    jQuery('#festivalName').val(occationDetails.festivalName);
    var occasionDateTimestamp = new Date(occationDetails.festivalDate);
    jQuery('#occasionDate').val(occasionDateTimestamp.getDate() + '/' + (occasionDateTimestamp.getMonth() + 1) + '/' + occasionDateTimestamp.getFullYear());

  } else if (occationDetails.occasion == 'other') {
    jQuery('#otherOccasionId').removeClass('display-none');
    jQuery('#otherOccasionName').val(occationDetails.otherOccasionName);
  }
  jQuery('#orderNote').prop('readonly', true);
  jQuery('#orderNote').val(result.data.orderNote);
  if(result.data.isFieldUpdateRequired == 'yes'){
    jQuery("#anyUpdateYes").prop("checked", true);
    

    jQuery('#fieldsNumber').removeClass('display-none');
      jQuery('#fieldsNumber').prop('readonly', true);
      jQuery('#updateFields').val(result.data.updateFields);
  } else{
    jQuery("#anyUpdateNo").prop("checked", true);
  }
 
}

function clearRedColor(focusEvent) {
  jQuery('#' + focusEvent.id).removeClass('redBorder');
}

function occasionOf(occasionOf) {
  jQuery('#occasionDate').val("");
  jQuery('#familyMemberRelation').val("");

  if (occasionOf.id == 'customerOccasion') {
    jQuery('#occasionDateId').removeClass('display-none');
    jQuery('#familyMemberRelationId').addClass('display-none');
    jQuery("#occasionDateTitle").text("Occasion date");
  } else if (occasionOf.id == 'familyOccasion') {
    jQuery('#occasionDateId').removeClass('display-none');
    jQuery('#familyMemberRelationId').removeClass('display-none');
    jQuery("#occasionDateTitle").text("Occasion date");
  } else {
    jQuery('#occasionDateId').addClass('display-none');
    jQuery('#familyMemberRelationId').addClass('display-none');
  }
}


function fieldsUpdateRequired(updateChecked) {
  if (updateChecked.id == 'anyUpdateYes') {
    jQuery('#fieldsNumber').removeClass('display-none');

  } else {
    jQuery('#fieldsNumber').addClass('display-none');
  }
}


function saveOrder() {
  var formValidation = true;
  var timeStampDate = '';
  var timeStampOrderDate = '';
  var deliveryDate = jQuery('#deliveryDate').val();

  var orderDate = jQuery('#orderDate').val();
  
  var customerName = jQuery('#customerName').val();

  var orderNumber = jQuery('#orderNumber').val();
 
  var mobileNumber = jQuery('#mobileNumber').val();
 
  var customerLocation = jQuery('#customerLocation').val();

  var customerSource = jQuery('#customerSource').val();
  var modeOfPayment = jQuery('#modeOfPayment').val();
  var totalAmount = jQuery('#totalAmount').val();

  var advanceAmount = jQuery('#advanceAmount').val();
 
  var fabricsFrom = jQuery('#fabricsFromTextField').val();
  if(fabricsFrom == ''){
    fabricsFrom = jQuery('#fabricsFrom1 option:selected').val();
  }
 
  
  var orderNote = jQuery('#orderNote').val();

  var typeOfCustomer = jQuery('#typeOfCustomerTextField').val();
  if(typeOfCustomer == ''){
    typeOfCustomer = jQuery('#typeOfCustomer option:selected').val();
  }


  var measureBy = jQuery('#measureByTextField').val();
  if(measureBy == ''){
    measureBy = jQuery('#measureBy option:selected').val();
  }

  
  var dressFor = jQuery('#dressForTextField').val();
  var dressType = jQuery('#dressTypeTextField').val();
  if(dressFor == ''){
    dressFor = jQuery("#dressFor option:selected").val();
    dressType = jQuery("#dressType option:selected").val();
  }

  var deliveryTime = jQuery('#deliveryTimeTextField').val();
  if(deliveryTime  == '')
   deliveryTime = jQuery("#deliveryTime option:selected").val();

   var orderStatus = jQuery('#orderStatusTextField').val();
   if(orderStatus  == '')
   orderStatus = jQuery("#orderStatus option:selected").val();
    

  var fieldUpdate = jQuery('input[name="updateRequired"]:checked').val();
  var fieldsNumber = '';
  if (fieldUpdate == 'yes') {
    fieldsNumber = jQuery('#updateFields').val();
    if (fieldsNumber == '') {
      formValidation = false;
    }
  } else if (fieldUpdate == undefined) {
    formValidation = false;
  }

  var occasion = jQuery('#occasionTextField').val();
  if(occasion == ''){
    occasion = jQuery("#occasion option:selected").val();
  }

  var occasionData = '';
  if (occasion == 'Birthday' || occasion == 'Marriage') {
    
    var checkedValue = jQuery('input[name="occasionPerson"]:checked').val();
    
    var occasionDate = '';
    if (checkedValue == 'customer') {
      occasionDate = jQuery('#occasionDate').val();
      
      if (occasionDate == '') {
        jQuery('#occasionDate').addClass('redBorder');
        formValidation = false;
      } else {
        var occasionDateTimeStamp =  (new Date(occasionDate)).getTime();

        if(occasionDate.includes('/')){
          var from = occasionDate.split("/");
          occasionDateTimeStamp = new Date(from[2], from[1] - 1, from[0]).getTime();
        }
        


        occasionData = {
          occasion: occasion,
          occasionof: checkedValue,
          occasionDate: occasionDateTimeStamp
        };
      }
    } else if (checkedValue == undefined) {
      
      formValidation = false;
    } else if (checkedValue == 'family') {
      occasionDate = jQuery('#occasionDate').val();
      
      var familyMemberRelation = jQuery('#familyMemberRelation').val();
      
      if (occasionDate == '') {
        jQuery('#occasionDate').addClass('redBorder');
        formValidation = false;
      }
      if (familyMemberRelation == '') {
        jQuery('#familyMemberRelation').addClass('redBorder');
        formValidation = false;
      }

      if (occasionDate != '' && familyMemberRelation != '') {  
        var occasionDateFamilyTimeStamp = (new Date(occasionDate)).getTime();     
        if(occasionDate.includes('/')){
          var from = occasionDate.split("/");
          occasionDateFamilyTimeStamp = new Date(from[2], from[1] - 1, from[0]).getTime();
        }
        

        occasionData = {
          occasion: occasion,
          occasionof: checkedValue,
          occasionDate: occasionDateFamilyTimeStamp,
          familyMemberRelation: familyMemberRelation
        };
      }


    } else if (checkedValue == 'other') {

      occasionData = {
        occasion: occasion,
        occasionof: checkedValue
      };

    }
  } else if (occasion == 'select') {
    formValidation = false;
  } else if (occasion == 'Festival') {
    var festivalName = jQuery('#festivalName').val();
    var occasionDate = jQuery('#occasionDate').val();

    if (festivalName == '') {
      jQuery('#festivalName').addClass('redBorder');
      formValidation = false;
    }
    if (occasionDate == '') {
      jQuery('#occasionDate').addClass('redBorder');
      formValidation = false;
    }
    if (festivalName != '' && occasionDate != '') {
      //var festivalDateFamilyTimeStamp = (new Date(occasionDate)).getTime();

      var festivalDateFamilyTimeStamp = (new Date(occasionDate)).getTime();     
      if(occasionDate.includes('/')){
        var from = occasionDate.split("/");
        festivalDateFamilyTimeStamp = new Date(from[2], from[1] - 1, from[0]).getTime();
      }
      



      occasionData = {
        occasion: occasion,
        festivalName: festivalName,
        festivalDate: festivalDateFamilyTimeStamp
      };
    }

  } else if (occasion == 'other') {
    var otherOccasionName = jQuery('#otherOccasionName').val();
    
    if (otherOccasionName == '') {
      jQuery('#otherOccasionName').addClass('redBorder');
      formValidation = false;
    } else {
      occasionData = {
        occasion: occasion,
        otherOccasionName: otherOccasionName
      };
    }
  } else if (occasion == 'Daily Wear') {
    occasionData = {
      occasion: occasion
    };
  }

  if (deliveryDate == '') {
    jQuery('#deliveryDate').addClass('redBorder');
    formValidation = false;
  } else {
  
    if(deliveryDate.includes('/')){
      var from = deliveryDate.split("/");
      timeStampDate = new Date(from[2], from[1] - 1, from[0]).getTime();
    } else{
      timeStampDate = (new Date(deliveryDate)).getTime();
    }    
   
  }

  if (orderDate == '') {
    jQuery('#orderDate').addClass('redBorder');
    formValidation = false;
  } else {
  
    if(orderDate.includes('/')){
      var from = orderDate.split("/");
      timeStampOrderDate = new Date(from[2], from[1] - 1, from[0]).getTime();
    } else{
      timeStampOrderDate = (new Date(orderDate)).getTime();
    }    
   
  }

  if (customerName == '') {
    jQuery('#customerName').addClass('redBorder');
    formValidation = false;
  }
  if (orderNumber == '') {
    jQuery('#orderNumber').addClass('redBorder');
    formValidation = false;
  }

  if (mobileNumber == '') {
    jQuery('#mobileNumber').addClass('redBorder');
    formValidation = false;
  }
  if (customerLocation == '') {
    jQuery('#customerLocation').addClass('redBorder');
    formValidation = false;
  }
  if (customerSource == '') {
    jQuery('#customerSource').addClass('redBorder');
    formValidation = false;
  }
  if (typeOfCustomer == 'select') {
    formValidation = false;
  }
  if (totalAmount == '') {
    jQuery('#totalAmount').addClass('redBorder');
    formValidation = false;
  }
  if (advanceAmount == '') {
    jQuery('#advanceAmount').addClass('redBorder');
    formValidation = false;
  }
  if (modeOfPayment == '') {
    jQuery('#modeOfPayment').addClass('redBorder');
    formValidation = false;
  }

  if (dressType == 'selectType') {
    formValidation = false;
  }
  if (dressFor == 'selectPerson') {
    formValidation = false;
  }
  if (deliveryTime == 'selectRange') {
    formValidation = false;
  }
  if (fabricsFrom == 'select') {
    formValidation = false;
  }
  if (measureBy == 'select') {
    formValidation = false;
  }
  if (orderNote == '') {
    jQuery('#orderNote').addClass('redBorder');
    formValidation = false;
  }

  if (formValidation) {
    jQuery('#loadingIndicator').removeClass('visibility-hidden');    
    var data = {
      "customerName": customerName,
      "orderNumber": orderNumber,
      "mobileNumber": mobileNumber,
      "customerLocation": customerLocation,
      "customerSource": customerSource,
      "typeOfCustomer": typeOfCustomer,
      "modeOfPayment": modeOfPayment,
      "totalAmount": totalAmount,
      "advanceAmount": advanceAmount,
      "dressFor": dressFor,
      "dressType": dressType,
      "fabricsFrom": fabricsFrom,
      "deliveryDate": timeStampDate,
      "orderDate": timeStampOrderDate,
      "deliveryTime": deliveryTime,
      "measureBy": measureBy,
      "createDate": createDate,
      "updatedDate":new Date().getTime(),
      "orderStatus": orderStatus,
      "orderNote": orderNote,
      "isFieldUpdateRequired": fieldUpdate,
      "updateFields": fieldsNumber,
      "occationDetails": occasionData
    }

    jQuery.ajax({
      type: "POST",
      url: "/fs/updateorder",
      data: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookieValue
      },
      async: false,
      success: function (result) {      
        if (result.statusCode == 200) {
         // updateTable();
         // closeOverlay('deleteOverlay');
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



  } else {
    IBMCore.common.widget.overlay.show("errorOverlay");
    jQuery("#errorOverlayMsg").empty().append('<span style="color: red;">Please fill all the fields and select required option.</span>');
  }

}
