var cookieValue = readCookie();
var formValidation = true;

jQuery(document).ready(function ($) {

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
        .append('<option value="Blouse and Embroidery">Blouse & Embroidery</option>')
        .append('<option value="Blouse and Saree">Blouse & Saree</option>') 
        .append('<option value="Blouse Saree and Embroidery">Blouse Saree & Embroidery</option>')        
        .append('<option value="Salwar and kameez">Salwar & kameez</option>')
        .append('<option value="Kurtha">Kurtha</option>')
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
    if(occasion == 'Birthday'){
      $('#occasionOfId').removeClass('display-none');
      $("#occaionOfTitle").text("Birthday of");
      $('#festivalNameId').addClass('display-none'); 
      $("#occasionDateTitle").text("Birthday date");
      //var selectOption = '<select name="occasionOf" id="occasionOf" style="width:180px;"><option selected value="select">Select relation</option> <option value="customer">Customer</option><option value="familyMember">Family Member</option><option value="other">Other</option></select>';
      //$('#occasionOfSelect').prepend(selectOption);
    } else if( occasion == 'Marriage'){
      $('#occasionOfId').removeClass('display-none');      
      $("#occaionOfTitle").text("Marriage of");
      $('#festivalNameId').addClass('display-none'); 
      $("#occasionDateTitle").text("Marriage date");
    } else if( occasion == 'Festival'){
      $('#occasionOfId').addClass('display-none');
      $('#festivalNameId').removeClass('display-none'); 
      $('#occasionDateId').removeClass('display-none'); 
      $("#occasionDateTitle").text("Festival date");
           
    }  else if( occasion == 'other'){
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



  var data = {
    "test1": "test1"
  }
  jQuery.ajax({
    type: "POST",
    url: "/caas/getOrderCount",
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + cookieValue
    },
    async: false,
    success: function (result) {      
      if (result.rows.length != 0) {
        var totalCount = result.rows[0].value + 1;
        if (totalCount < 10){
          totalCount = "0"+totalCount;
        }        
        $("#orderNumber").val("fs" + (new Date()).getFullYear().toString().substr(-2) + totalCount);
      } else {
        $("#orderNumber").val("fs" + (new Date()).getFullYear().toString().substr(-2) + "01");
      }
    },
    error: function (e) {
      alert("There was some internal error while updating, Please try again after sometime")
    }
  });


  $("#mobileNumber").blur(function() {
    var mobileNumber = $("#mobileNumber").val();    
    if(mobileNumber.length != 10){
      $('#mobileNumber').addClass('redBorder');
      alert('Mobile number should be 10 digits.');
    }
  });
  



});

function clearRedColor(focusEvent){    
  jQuery('#'+focusEvent.id).removeClass('redBorder');
}

function checkMobileNumber(keyUpEvent){  
  if (/\D/g.test(keyUpEvent.value)){
  jQuery('#mobileNumber').val(keyUpEvent.value.replace(/\D/g,''));
  }  
}

function occasionOf(occasionOf){
jQuery('#occasionDate').val("");
jQuery('#familyMemberRelation').val("");

if(occasionOf.id == 'customerOccasion'){
  jQuery('#occasionDateId').removeClass('display-none');
  jQuery('#familyMemberRelationId').addClass('display-none');
}  else if(occasionOf.id == 'familyOccasion'){
  jQuery('#occasionDateId').removeClass('display-none');
  jQuery('#familyMemberRelationId').removeClass('display-none');  
} else {
  jQuery('#occasionDateId').addClass('display-none');
  jQuery('#familyMemberRelationId').addClass('display-none'); 
}
}


  function fieldsUpdateRequired(updateChecked){  
  if(updateChecked.id == 'anyUpdateYes'){
    jQuery('#fieldsNumber').removeClass('display-none');
    
  } else {
    jQuery('#fieldsNumber').addClass('display-none');   
  }
  }


function saveOrder() {
  jQuery('saveOrderId').prop('disabled', true);
  var formValidation = true;
  var timeStampDate = '';  
  var timeStampOrderDate = '';
  var deliveryDate = jQuery('#deliveryDate').val();   
  var customerName = jQuery('#customerName').val();
  var orderNumber = jQuery('#orderNumber').val();
  var mobileNumber = jQuery('#mobileNumber').val();
  var customerLocation = jQuery('#customerLocation').val();
  var customerSource = jQuery('#customerSource').val();
  var modeOfPayment = jQuery('#modeOfPayment').val();
  var totalAmount = jQuery('#totalAmount').val();
  var advanceAmount = jQuery('#advanceAmount').val();
  var fabricsFrom = jQuery('#fabricsFrom1 option:selected').val();
  var orderNote = jQuery('#orderNote').val();
  var typeOfCustomer = jQuery('#typeOfCustomer option:selected').val();
  var measureBy = jQuery('#measureBy option:selected').val();
  var dressFor = jQuery("#dressFor option:selected").val();
  var dressType = jQuery("#dressType option:selected").val();  
  var orderDate = jQuery('#orderDate').val();     
  var fieldUpdate = jQuery('input[name="updateRequired"]:checked').val(); 
  var fieldsNumber = '';
  if(fieldUpdate == 'yes'){
     fieldsNumber = jQuery('#updateFields').val();
     if(fieldsNumber == ''){
      formValidation = false;
     }
  } else if(fieldUpdate == undefined){
    formValidation = false;
  } 
  var occasion = jQuery("#occasion option:selected").val(); 
  var occasionData = '';   
  if(occasion == 'Birthday' || occasion == 'Marriage'){
    var checkedValue = jQuery('input[name="occasionPerson"]:checked').val();    
    var occasionDate = '';   
    if(checkedValue == 'customer'){      
       occasionDate = jQuery('#occasionDate').val();       
      if(occasionDate == ''){
        jQuery('#occasionDate').addClass('redBorder'); 
        formValidation = false;
      } else {
        var occasionDateTimeStamp = (new Date(occasionDate)).getTime();
        occasionData = {
          occasion : occasion,
          occasionof:checkedValue,
          occasionDate:occasionDateTimeStamp
        };
      }      
    } else if(checkedValue == undefined){      
      formValidation = false;
    }else if(checkedValue == 'family'){
      occasionDate = jQuery('#occasionDate').val();
      var familyMemberRelation = jQuery('#familyMemberRelation').val();
            
      if(occasionDate == ''){
        jQuery('#occasionDate').addClass('redBorder'); 
        formValidation = false;
      } 
      if(familyMemberRelation == ''){
        jQuery('#familyMemberRelation').addClass('redBorder'); 
        formValidation = false;
      } 
      
      if(occasionDate != '' && familyMemberRelation != ''){
        occasionDateFamilyTimeStamp = (new Date(occasionDate)).getTime();
        occasionData = {
          occasion : occasion,
          occasionof:checkedValue,
          occasionDate:occasionDateFamilyTimeStamp,
          familyMemberRelation:familyMemberRelation
        };
      } 

      
    } else if(checkedValue == 'other'){

      occasionData = {
        occasion : occasion,
        occasionof:checkedValue
      };

    }
  } else if(occasion == 'select'){    
    formValidation = false;
  } else if(occasion == 'Festival'){
    var festivalName = jQuery('#festivalName').val();
    var occasionDate = jQuery('#occasionDate').val();
    if(festivalName == ''){
      jQuery('#festivalName').addClass('redBorder'); 
      formValidation = false;
    } 
    if(occasionDate == ''){
      jQuery('#occasionDate').addClass('redBorder'); 
      formValidation = false;
    } 
    if(festivalName != '' && occasionDate != ''){
      var festivalDateFamilyTimeStamp = (new Date(occasionDate)).getTime();
      occasionData = {
        occasion : occasion,
        festivalName:festivalName,
        festivalDate:festivalDateFamilyTimeStamp
      };
    }

  } else if(occasion == 'other'){
    var otherOccasionName = jQuery('#otherOccasionName').val();    
    if(otherOccasionName == ''){
      jQuery('#otherOccasionName').addClass('redBorder'); 
      formValidation = false;
    } else{
    occasionData = {
      occasion : occasion,
      otherOccasionName:otherOccasionName
    };
  }
  } else if(occasion == 'Daily Wear'){
    occasionData = {
      occasion : occasion
    };
  }  

  if(deliveryDate == ''){
    jQuery('#deliveryDate').addClass('redBorder');  
    formValidation = false;
  } else{
    timeStampDate = (new Date(deliveryDate)).getTime();
  }


  if(orderDate == ''){
    jQuery('#orderDate').addClass('redBorder');
    formValidation = false;
  } else {
    timeStampOrderDate = (new Date(orderDate)).getTime();
  }
  
  if(customerName == ''){
    jQuery('#customerName').addClass('redBorder');
    formValidation = false;
  }
  if(orderNumber == ''){
    jQuery('#orderNumber').addClass('redBorder');
    formValidation = false;
  }
  
  if(mobileNumber == ''){
    jQuery('#mobileNumber').addClass('redBorder');
    formValidation = false;
  } else if(mobileNumber.length != 10){
    jQuery('#mobileNumber').addClass('redBorder');
    formValidation = false;
  }
  if(customerLocation == ''){
    jQuery('#customerLocation').addClass('redBorder');
    formValidation = false;
  }
  if(customerSource == ''){
    jQuery('#customerSource').addClass('redBorder');
    formValidation = false;
  }
  if(typeOfCustomer == 'select'){    
    formValidation = false;
  }
  if(totalAmount == ''){
    jQuery('#totalAmount').addClass('redBorder');
    formValidation = false;
  }
  if(advanceAmount == ''){
    jQuery('#advanceAmount').addClass('redBorder');
    formValidation = false;
  }
  if(modeOfPayment == ''){
    jQuery('#modeOfPayment').addClass('redBorder');
    formValidation = false;
  }  
 
  
  if(dressType == 'selectType'){    
    formValidation = false;
  }
  if(dressFor == 'selectPerson'){    
    formValidation = false;
  }

  if(fabricsFrom == 'select'){    
    formValidation = false;
  }
  if(measureBy == 'select'){    
    formValidation = false;
  }  
  if(orderNote == ''){
    jQuery('#orderNote').addClass('redBorder');
    formValidation = false;
  }

 if(formValidation){
  jQuery('#loadingIndicator').removeClass('visibility-hidden');
  jQuery('saveOrderId').prop('disabled', true);
  var data = {
    "_id":orderNumber,
    "customerName": customerName,
    "orderNumber":orderNumber,
    "mobileNumber": mobileNumber,
    "customerLocation": customerLocation,
    "customerSource": customerSource,
    "typeOfCustomer":typeOfCustomer,
    "modeOfPayment": modeOfPayment,
    "totalAmount": totalAmount,
    "advanceAmount": advanceAmount,
    "dressFor": dressFor,
    "dressType": dressType,
    "fabricsFrom": fabricsFrom,
    "deliveryDate":timeStampDate,
    "measureBy":measureBy,
    "createDate":new Date().getTime(),
    "updatedDate":new Date().getTime(), 
    "orderDate":timeStampOrderDate,  
    "orderStatus": "New",
    "orderNote":orderNote,
    "isFieldUpdateRequired":fieldUpdate,
    "updateFields":fieldsNumber,
    "occationDetails":occasionData
  }
  jQuery.ajax({
    type: "POST",
    url: "/caas/createDocument",
    data: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + cookieValue
    },
    async: false,
    success: function (result) {            
      jQuery('#loadingIndicator').addClass('visibility-hidden');
      IBMCore.common.widget.overlay.show("confirmationOverlay");
      jQuery("#overlayMsg").empty().append('<span style="color: red;">Order data uploaded successfully</span>');
      //
    },
    error: function (e) {
      alert("There was an error while creating order.")
    }
  });
 } else {
  IBMCore.common.widget.overlay.show("errorOverlay");
  jQuery("#errorOverlayMsg").empty().append('<span style="color: red;">Please fill all the fields and select required option.</span>');
 }

}
