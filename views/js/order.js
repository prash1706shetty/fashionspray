/*jshint esversion: 6 */
var tempData;
var isMainBgImgChanged = false;
var isOverlayImageChanged = false;
var cookieValue = readCookie();
var attachment_url = ""
var landingPageData = "";
var formValidation = true;
var cassAttachmentUrl = "";
var actionFlow = "";
var caasAttachments = "";
var loggedInUserEmailId = "";
var dataSaved = false;
var fieldValuesChanged = true;
var offeringNameChanged = false;
var imageValue = "";

jQuery(document).ready(function ($) {

  //$('.ibm-calendar-link').hide();
  $("#dressFor").change(function () {
    var personType = $('#dressFor').val();
    $('#dressType').removeAttr("disabled");
    console.log("personType->" + personType);
    $('#dressType')
      .find('option')
      .remove();
    if (personType == 'Women') {
      $('#dressType').append('<option selected value="selectType">Select Dress Type</option>')
        .append('<option value="Gown">Gown</option>')
        .append('<option value="Lehanga">Lehanga</option>')
        .append('<option value="Blouse">Blouse</option>')
        .append('<option value="Salwar">Salwar</option>')
        .append('<option value="Saree">Saree</option>');
    } else if (personType == 'Kids') {
      $('#dressType').append('<option selected value="selectType">Select Dress Type</option>')
        .append('<option value="Frock">Frock</option>')
        .append('<option value="Gown">Gown</option>')
        .append('<option value="Lehanga">Lehanga</option>')
        .append('<option value="Western Wear">Western Wear</option>');
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
      console.log("Exists!");
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
      console.log("value->" + JSON.stringify(result));
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



});

function clearRedColor(focusEvent){  
  console.log("focusEvent->"+focusEvent.id);
  jQuery('#'+focusEvent.id).removeClass('redBorder');
}

function loadEditFlow(landingPageData) {

  preLoadData(landingPageData);
  if (landingPageData.usecaseType == 'single') {
    singleUseCase();
  }
  loadCards(landingPageData);

}

async function loadCards(landingPageData) {
  for (var i = 0; i < landingPageData.useCases.length; i++) {
    let cards = "<div class='ibm-card' style='margin:10px;'><div class='ibm-card__image'>";
    if (landingPageData.usecaseType != "single") {
      var src = "";
      if (landingPageData['useCaseBImg' + i] != undefined && landingPageData['useCaseBImg' + i].includes('base64')) {
        src = landingPageData['useCaseBImg' + i];
      } else if (landingPageData.useCases[i].useCaseImage != undefined && landingPageData.useCases[i].useCaseImage != '') {
        src = cassAttachmentUrl + "/" + landingPageData.useCases[i].useCaseImage;
      }
      cards = (src != '') ? cards + "<img id ='useCaseBImg" + i + "' src='" + src + "' alt='card_3' width='100%' height='90'  >" : cards;
    }
    let ucUrl = landingPageData.useCases[i].useCaseURL;
    ucUrl = ucUrl.replace("/", "");
    cards = cards + " </div><div class='ibm-card__content' style='padding-bottom:57px;'><h3 class='ibm-h3 elipsis' id ='useCasetitle" + i + "'>" + landingPageData.useCases[i].useCaseTitle + "</h3><p id = 'useCaseDesc" + i + "' class='elipsis''>" + landingPageData.useCases[i].useCaseDescription + "</p><p><span class='ibm-small ibm-textcolor-gray-30' >No of Scene(s): </span> <span class='ibm-small' id='useCaseScene" + i + "'>" + landingPageData.useCases[i].useCaseScene + "</span></p>" +
      "<p hidden><span class='ibm-small ibm-textcolor-gray-30' hidden >Image alt text: </span> <span class='ibm-small' id='useCaseImgAlTxt" + i + "' hidden>" + landingPageData.useCases[i].useCaseImageAltText + "</span></p>" +
      "<p hidden><span class='ibm-small ibm-textcolor-gray-30' hidden >Explore Link Name: </span> <span class='ibm-small' hidden id='useCaseExplLinkName" + i + "' hidden>" + landingPageData.useCases[i].useCaseLinkText + "</span></p>" +
      "<p hidden><span class='ibm-small ibm-textcolor-gray-30' hidden>RequestUrlName: </span> <span class='ibm-small' id='requestUrlName" + i + "' hidden>" + ucUrl + "</span></p>" +
      "<p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a id ='edit" + i + "' class='ibm-edit-link tipso_style' onclick='formOverlayVal(this); IBMCore.common.widget.overlay.show(\"usecaseOverLay\"); return false;' href='' role='button' >Edit UseCase</a></p>" +
      "<p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a class='ibm-close-link' id ='deleteUC" + i + "' onclick='deleteUC(this);' role='button' >Delete UseCase</a></p></div></div></div>";
    jQuery(".ibm-col-12-3:eq(" + i + ")").attr('style', 'height:auto;').html(cards);
  }
  if (landingPageData.usecaseType == "single") {
    for (var i = 1; i <= 3; i++) {
      jQuery('#useCase' + i).addClass('display-none');
    }
  }
}

function loadSessionData(landingPageData) {

  landingPageData = landingPageData;
  preLoadData(landingPageData);
  if (landingPageData.usecaseType == 'single') {
    jQuery("#useCaseSingle").prop("checked", true);
    jQuery("#singleUseCase").removeClass('display-none');
    jQuery("#useCaseSelectP").addClass('display-none');
    jQuery('#mainBImageDiv').addClass('display-none');
    jQuery('#backgroundImageMainDiv').addClass('display-none');
    for (var i = 1; i <= 3; i++) {
      jQuery('#useCase' + i).addClass('display-none');
    }
  } else {
    if (landingPageData.backgroundImage != undefined) {
      jQuery('#backgroundImageName').html(landingPageData.backgroundImage.split('_attachments/')[1]);
    }
  }
  for (var i = 0; i < landingPageData.useCases.length; i++) {
    let cards = "<div class='ibm-card' style='margin:10px;'><div class='ibm-card__image'>";
    if (landingPageData.usecaseType != 'single' && landingPageData['useCaseBImg' + i] != undefined) {
      cards = cards + "<img id ='useCaseBImg" + i + "' src='" + landingPageData['useCaseBImg' + i] + "' alt='card_3' width='100%' height='90'  >";
    }
    cards = cards + " </div><div class='ibm-card__content' style='padding-bottom:57px;'><h3 class='ibm-h3 elipsis' id ='useCasetitle" + i + "'>" + landingPageData.useCases[i].useCaseTitle + "</h3><p id = 'useCaseDesc" + i + "' class='elipsis''>" + landingPageData.useCases[i].useCaseDescription + "</p><p><span class='ibm-small ibm-textcolor-gray-30' >No of Scene(s): </span> <span class='ibm-small' id='useCaseScene" + i + "'>" + landingPageData.useCases[i].useCaseScene + "</span></p>" +
      "<p hidden><span class='ibm-small ibm-textcolor-gray-30' hidden >Image alt text: </span> <span class='ibm-small' id='useCaseImgAlTxt" + i + "' hidden>" + landingPageData.useCases[i].useCaseImageAltText + "</span></p>" +
      "<p hidden><span class='ibm-small ibm-textcolor-gray-30' hidden >Explore Link Name: </span> <span class='ibm-small' hidden id='useCaseExplLinkName" + i + "' hidden>" + landingPageData.useCases[i].useCaseLinkText + "</span></p>" +
      "<p hidden><span class='ibm-small ibm-textcolor-gray-30' hidden>RequestUrlName: </span> <span class='ibm-small' id='requestUrlName" + i + "' hidden>" + landingPageData.useCases[i].useCaseURL + "</span></p>" +
      "<p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a id ='edit" + i + "' class='ibm-edit-link tipso_style' onclick='formOverlayVal(this); IBMCore.common.widget.overlay.show(\"usecaseOverLay\"); return false;' href='' role='button' >Edit UseCase</a></p>" +
      "<p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a class='ibm-close-link' id ='deleteUC" + i + "' onclick='deleteUC(this);' role='button' >Delete UseCase</a></p></div></div></div>";
    jQuery(".ibm-col-12-3:eq(" + i + ")").attr('style', 'height:auto;').html(cards);
  }
}

function preLoadData(data) {

  jQuery("#productName").val(data.productTitle);
  jQuery("#offerName").val(data.offeringName);
  jQuery("#helpText").val(data.titleHelpText);
  jQuery("#marketPlaceUrl").val(data.exitTourURL);
  jQuery("#imageAltText").val(data.backgroundImageAltText);
  jQuery("#emailSubject").val(data.shareEmailSubject);
  jQuery("#emailBody").val(data.shareEmailMessage);
  jQuery("#twitterMessage").val(data.shareTwitterMessage);
  jQuery("#twitterHashtags").val(data.shareTwitterHashTag);
  jQuery("#linkedinMessage").val(data.shareLinkedinMessage);
  jQuery("#linkedinHashtags").val(data.shareLinkedinHashTag);
  jQuery("#productOwner").val(data.productOwnerName);

  if (caasAttachments != undefined) {
    for (var i = 0; i < caasAttachments.length; i++) {
      if (caasAttachments[i].file.includes('startPageBg')) {
        jQuery('#backgroundImageName').html(data.backgroundImage.split('/')[1]);
        break;
      }
    }
  }
  if (landingPageData.usecaseType == "single") {
    jQuery("#useCaseSingle").prop("checked", true);
  } else {
    jQuery("#useCaseMulti").prop("checked", true);

  }
}

function singleUseCase() {


  for (var i = 1; i <= 3; i++) {
    jQuery('#usecaseTile' + i).addClass('display-none');
  }
  jQuery('#backgroundImage').attr('disabled', true);
  jQuery('#imageAltText').attr('disabled', true);
  jQuery('.backgroundImage').addClass('background-color-textField');
  jQuery('#backgroundImageMainDiv').addClass('display-none');
}

function mutipleUseCase() {

  for (var i = 1; i <= 3; i++) {
    jQuery('#usecaseTile' + i).removeClass('display-none');
  }
  jQuery('#imageAltText').removeAttr("disabled");
  jQuery('#backgroundImage').removeAttr("disabled");
  jQuery('#backgroundImageMainDiv').removeClass('display-none');
}

function renderImage(e) {
  return new Promise((resolve, reject) => {
    if (e[0].files && e[0].files[0]) {
      var FR = new FileReader();
      FR.addEventListener("load", function (e) {
        resolve({
          image: e.target.result
        });
      });
      FR.readAsDataURL(e[0].files[0]);
    }
  });
}

function formOverlayVal(e) {

  imageValue = '';
  jQuery("#useCaseError").empty();
  jQuery("#useCaseError").css({
    "display": "none"
  });
  jQuery("#useCaseTitleError").addClass('display-none');
  jQuery('#useCaseDescError').addClass('display-none');
  jQuery("#uc-title").attr('style', 'background: ');
  jQuery("#uc-desc").attr('style', 'background: ');
  jQuery("#overLayImageError").addClass('display-none');
  jQuery("#overlaySelerror").addClass('display-none');
  jQuery('#overLayImaP').find('a.ibm-remove-link').click();
  if (jQuery("input[name='useCaseSelect']:checked").val() == 'single') {
    jQuery('#overlayImageBrowseDiv').addClass('display-none');
    jQuery('#overLayImaP').addClass('display-none');
    jQuery('#overlayImageAltDiv').addClass('display-none');


  } else {
    jQuery('#overlayImageBrowseDiv').removeClass('display-none');
    jQuery('#overLayImaP').removeClass('display-none');
    jQuery('#overlayImageAltDiv').removeClass('display-none');
  }
  var options = '<select id="scenes" onchange="removeError(\'overlaySelerror\')"  style="width:102px; height:40px"> <option value="1">1</option>';
  for (var i = 2; i < 7; i++) {
    options = options + '<option value="' + i + '">' + i + '</option>';
  }
  options = options + '</select>';
  jQuery('#overlaySceneP').empty().append(options);
  let usecaseId = e.id.slice(-1);
  jQuery('#overlayImgNm').html("");
  if (e.id.includes('edit')) {
    jQuery('#scenes').val(parseInt(jQuery('#useCaseScene' + usecaseId).html()))
    if (jQuery('#useCaseBImg' + usecaseId).attr('src') != undefined && jQuery('#useCaseBImg' + usecaseId).attr('src') != '') {
      jQuery('#overlayImgNm').html('useCase' + (parseInt(usecaseId) + 1) + '.jpg');
      imageValue = jQuery('#useCaseBImg' + usecaseId).attr('src');
    }
  } else {
    jQuery('#scenes').val('');
    isOverlayImageChanged = true;
  }
  jQuery('#uc-title').val(jQuery('#useCasetitle' + usecaseId).html() != undefined ? escapeHtml(jQuery('#useCasetitle' + usecaseId).html()) : '');
  jQuery('#uc-desc').val(jQuery('#useCaseDesc' + usecaseId).html() != undefined ? escapeHtml(jQuery('#useCaseDesc' + usecaseId).html()) : '');
  jQuery('#overlaySave').attr('data-Usecase', usecaseId);
  jQuery('#overlayImageAlt').val((jQuery('#useCaseImgAlTxt' + usecaseId).html() != undefined ? escapeHtml(jQuery('#useCaseImgAlTxt' + usecaseId).html()) : ''));
  jQuery('#exploreLink').val((jQuery('#useCaseExplLinkName' + usecaseId).html() != undefined ? escapeHtml(jQuery('#useCaseExplLinkName' + usecaseId).html()) : ''));
  jQuery('#usecaseURL').val((jQuery('#requestUrlName' + usecaseId).html() != undefined ? escapeHtml(jQuery('#requestUrlName' + usecaseId).html()) : ''));
  jQuery("#scenes").val("1");

}

function validateLanding() {
  formValidation = true;
  resetValidation("productName");
  resetValidation("offerName");
  resetValidation("marketPlaceUrl");
  resetValidation("imageAltText");
  resetValidation("helpText");
  resetValidation("emailSubject");
  resetValidation("twitterMessage");
  resetValidation("linkedinMessage");
  resetValidation("emailBody");
  resetValidation("twitterHashtags");
  resetValidation("linkedinHashtags");
  resetValidation("productOwner");
  resetValidation("usecase");
  validateField("productName");
  validateField("offerName");
  validateField("marketPlaceUrl");
  is_valid_url("marketPlaceUrl");
  validateField("helpText");
  validateField("emailSubject");
  validateField("twitterMessage");
  validateField("linkedinMessage");
  validateField("emailBody");
  validateField("twitterHashtags");
  validateField("linkedinHashtags");
  validateField("productOwner");
  if (jQuery("input[name='useCaseSelect']:checked").val() == 'multi') {
    validateField("imageAltText");
    let ucCount = 0;
    for (var i = 0; i < 4; i++) {
      if ((jQuery('#useCasetitle' + i).length) >= 1) {
        ucCount = ucCount + 1;
      }
    }
    if (ucCount < 2) {
      jQuery('#usecaseError').removeClass("display-none");
      jQuery('#usecaseError').empty().append('<p class="validationFontSize no-padding">Minimum 2 usecases are required</p>');
    }
  }
  if (jQuery("input[name='useCaseSelect']:checked").val() == 'single') {
    // validateField("imageAltText");
    let ucCount = 0;
    for (var i = 0; i < 4; i++) {
      if ((jQuery('#useCasetitle' + i).length) >= 1) {
        ucCount = ucCount + 1;
      }
    }
    if (ucCount < 1) {
      jQuery('#usecaseError').removeClass("display-none");
      jQuery('#usecaseError').empty().append('<p class="validationFontSize no-padding">Minimum 1 usecase is required</p>');
    }
  }
}



function validateField(id) {
  let value = jQuery('#' + id).val();
  if (value == "") {
    jQuery('#' + id).addClass('redBorder');
    jQuery('#' + id + 'Error').removeClass('display-none');
    jQuery('#' + id + 'Error').addClass('display-block');
    window.location.href = '#';
    formValidation = false;
  }
}


function is_valid_url(id) {
  let value = jQuery("#" + id).val();
  if (value !== "") {
    var filter = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    if (!filter.test(value)) {
      jQuery('#' + id).addClass('redBorder');
      jQuery('#' + id + 'Error').removeClass('display-none');
      jQuery('#' + id + 'Error').addClass('display-block');
      jQuery('#' + id + 'Error').empty().append("Enter valid URL");
      formValidation = false;
    }
  }
}


function resetValidation(id) {
  jQuery('#' + id).removeClass('redBorder');
  jQuery('#' + id + 'Error').removeClass('display-block');
  jQuery('#' + id + 'Error').addClass('display-none');
  formValidation = true;
}


async function overlayVal() {
  formValidation = true;
  resetOverlayValidation("uc-title");
  validateField("uc-title");

  let usecaseId = jQuery('#overlaySave').attr('data-Usecase');
  if (formValidation) {
    let cards = "<div class='ibm-card' style='margin:10px;'>";
    let image = "";
    let imageContent = "";
    if (jQuery("#overlayImage")[0].files.length != 0) {
      image = await renderImage(jQuery("#overlayImage"));
      imageContent = image.image;
      cards = cards + "<div class='ibm-card__image'></div>";
    } else if (imageValue != '') {
      imageContent = imageValue;
    }
    if (jQuery("input[name='useCaseSelect']:checked").val() == 'multi' && imageContent != undefined) {
      cards = cards + "<img id ='useCaseBImg" + usecaseId + "' src='" + imageContent + "' alt='card_3' width='100%' height='90'  >";
    }
    cards = cards + " <div class='ibm-card__content' style='padding-bottom:57px;'><h3 class='ibm-h3 elipsis' id ='useCasetitle" + usecaseId + "'></h3><p id = 'useCaseDesc" + usecaseId + "' class='elipsis''></p><p><span class='ibm-small ibm-textcolor-gray-30' >No of Scene(s): </span> <span class='ibm-small' id='useCaseScene" + usecaseId + "'></span></p>" +
      "<p hidden><span class='ibm-small ibm-textcolor-gray-30' hidden >Image alt text: </span> <span class='ibm-small' id='useCaseImgAlTxt" + usecaseId + "' hidden></span></p>" +
      "<p hidden><span class='ibm-small ibm-textcolor-gray-30' hidden >Explore Link Name: </span> <span class='ibm-small' hidden id='useCaseExplLinkName" + usecaseId + "' hidden></span></p>" +
      "<p hidden><span class='ibm-small ibm-textcolor-gray-30' hidden>RequestUrlName: </span> <span class='ibm-small' id='requestUrlName" + usecaseId + "' hidden></span></p>" +
      "<p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a id ='edit" + usecaseId + "' class='ibm-edit-link tipso_style' onclick='formOverlayVal(this); IBMCore.common.widget.overlay.show(\"usecaseOverLay\"); return false;' href='' role='button' >Edit UseCase</a></p>" +
      "<p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a class='ibm-close-link' id ='deleteUC" + usecaseId + "' onclick='deleteUC(this);' role='button' >Delete UseCase</a></p></div></div></div>";
    jQuery(".ibm-col-12-3:eq(" + usecaseId + ")").attr('style', 'height:auto;').html(cards);
    jQuery('#useCasetitle' + usecaseId).html(jQuery("#uc-title").val());
    jQuery('#useCaseDesc' + usecaseId).html(jQuery("#uc-desc").val());
    jQuery('#useCaseScene' + usecaseId).html(jQuery("#scenes").val());
    jQuery('#useCaseImgAlTxt' + usecaseId).html(jQuery("#overlayImageAlt").val());
    jQuery('#useCaseExplLinkName' + usecaseId).html(jQuery("#exploreLink").val());
    jQuery('#requestUrlName' + usecaseId).html(jQuery("#usecaseURL").val());
    jQuery("#uc-title").val('');
    jQuery("#uc-desc").val('');
    jQuery('#overlayImage').val('');
    jQuery("#overlayImageAlt").val('');
    jQuery("#exploreLink").val('');
    jQuery("#usecaseURL").val('');
    IBMCore.common.widget.overlay.hide('usecaseOverLay', true);
  }
}

function resetOverlayValidation(id) {
  jQuery('#' + id).removeClass('redBorder');
  jQuery('#' + id + 'Error').removeClass('display-block');
  jQuery('#' + id + 'Error').addClass('display-none');
  formValidation = true;
}

function saveAsDraft() {
  jQuery('#loadingIndicator').removeClass('display-none');
  jQuery('.buttonusecaseGeneral').attr('disabled', true);

  setTimeout(async function () {

    if (offeringNameChanged == true) {

      var offeringNameArray = [];
      var caasData = fetchDocumentListByBrief();
      if (caasData.statusCode == 200) {
        var masterCaasData = fetchDocListFromMasterByBrief();
        if (masterCaasData.statusCode == 200) {
          masterCaasData = JSON.parse(masterCaasData.body);
          caasData = JSON.parse(caasData.body);
          masterCaasData.forEach((elem, index) => {
            offeringNameArray.push(elem.document.offeringName);
          });
          caasData.forEach((elem, index) => {
            offeringNameArray.push(elem.document.offeringName);
          });

          if (offeringNameArray.includes(jQuery('#offerName').val())) {
            IBMCore.common.widget.overlay.show("confirmationOverlay");
            jQuery("#overlayMsg").empty().append("Offering name you entered already exists.");
            jQuery('#loadingIndicator').addClass('display-none');
            jQuery('.buttonusecaseGeneral').removeAttr('disabled');
            offeringNameChanged = true;
            return;
          }
        } else {
          IBMCore.common.widget.overlay.show("confirmationOverlay");
          jQuery("#overlayMsg").empty().append("Not able to save the data, please try again later.");
          jQuery('#loadingIndicator').addClass('display-none');
          jQuery('.buttonusecaseGeneral').removeAttr('disabled');
          return;
        }
      } else {
        IBMCore.common.widget.overlay.show("confirmationOverlay");
        jQuery("#overlayMsg").empty().append("Not able to save the data, please try again later.");
        jQuery('#loadingIndicator').addClass('display-none');
        jQuery('.buttonusecaseGeneral').removeAttr('disabled');
        return;
      }
    }

    var data = await createDocumentJson();
    let tempData = JSON.parse(JSON.stringify(data));;
    delete tempData['startPageBg'];
    var docId = encodeURIComponent(jQuery('#offerName').val().trim().replaceAll(' ', '-').toLowerCase());
    var resp = createDocument(tempData, docId);
    checkRespStatus(resp);
    var resp = createTocFile(docId);
    checkRespStatus(resp);

    if (jQuery('#backgroundImage')[0].files.length != 0) {
      var base64Data = await renderImage(jQuery('#backgroundImage'));
      resp = uploadImage(base64Data.image, 'startPageBg', docId);
      checkRespStatus(resp);
    } else if (data.startPageBg != undefined) {
      resp = uploadImage(data.startPageBg, 'startPageBg', docId);
      checkRespStatus(resp);
    }
    count = 0
    for (var i = 0; i < 4; i++) {
      if (actionFlow == 'add') {
        if (jQuery("#useCaseBImg" + i).attr('src') != undefined) {
          var base64Data = jQuery("#useCaseBImg" + count).attr('src');
          resp = uploadImage(base64Data, 'useCase' + (count + 1) + 'Card', docId);
          checkRespStatus(resp);
          count = count + 1;
        }
      } else {
        if (jQuery("#useCaseBImg" + i).attr('src') != undefined) {
          if (!jQuery("#useCaseBImg" + i).attr('src').includes('developer.ibm.com')) {
            count = i + 1;
            var base64Data = jQuery("#useCaseBImg" + i).attr('src');
            resp = uploadImage(base64Data, 'useCase' + count + 'Card', docId);
            checkRespStatus(resp);
          }
        }
      }
    }
    dataSaved = true;
    fieldValuesChanged = false;
    IBMCore.common.widget.overlay.show("confirmationOverlay");
    jQuery("#overlayMsg").empty().append("Data upload is successful");
    jQuery('#loadingIndicator').addClass('display-none');
    jQuery('.buttonusecaseGeneral').removeAttr('disabled');
    offeringNameChanged = false;
  }, 100);
}

function deleteUC(e) {
  let ucNumber = parseInt(e.id.charAt(8));
  jQuery(e).parent().parent().parent().parent().html('<a href="" id="useCase' + ucNumber + '" onclick="formOverlayVal(this); IBMCore.common.widget.overlay.show(\'usecaseOverLay\'); return false;"><div class="landing-usecase">Add usecase ' + parseInt(ucNumber + 1) + '+</div></a>');
}

async function createSessionData() {

  if (actionFlow == 'add' && fieldValuesChanged == true && dataSaved == false) {
    alert(LANDING_SAVE_DATA_MESSAGE);
    return;
  }
  var data = await createDocumentJson();
  var usecaseSelect = jQuery("input[name='useCaseSelect']:checked").val();
  if (usecaseSelect == 'multi') {
    if (jQuery('#backgroundImage')[0].files.length != 0) {
      var base64Data = await renderImage(jQuery('#backgroundImage'));
      data['startPageBg'] = base64Data.image;
      data['backgroundImage'] = "_attachments/startPageBg." + base64Data.image.substring("data:image/".length, base64Data.image.indexOf(";base64"));
    }
    var count = 0;
    for (var i = 0; i < 4; i++) {
      if (jQuery("#useCasetitle" + i).html() != undefined) {
        if (jQuery("#useCaseBImg" + i).attr('src') != undefined && jQuery("#useCaseBImg" + i).attr('src').includes('base64')) {
          data['useCaseBImg' + count] = jQuery("#useCaseBImg" + i).attr('src');
        }
        count = count + 1;

      }
    }
  }
  sessionStorage.clear();
  sessionStorage.setItem('firstPageData', JSON.stringify(data));
  if (actionFlow == 'add') {
    window.location.href = '/add/useCases'
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    var document_id = encodeURIComponent(urlParams.get('productName'));
    window.location.href = '/edit/useCases?productName=' + document_id;
  }

}

async function createDocumentJson() {

  var usecaseSelect = jQuery("input[name='useCaseSelect']:checked").val();
  var numberOfusecases = 4;
  var imageAltText = jQuery('#imageAltText').val();
  if (usecaseSelect == 'single') {
    numberOfusecases = 1;
    imageAltText = '';
  }
  var createdDate = new Date().getTime();
  var createdBy = loggedInUserEmailId.toLowerCase();
  if (landingPageData != "") {
    createdDate = landingPageData.createdDate;
    createdBy = landingPageData.createdBy;
  }
  var useCaseArr = [];
  var data = {
    createdDate: createdDate,
    updatedDate: new Date().getTime(),
    status: 'Draft',
    usecaseType: usecaseSelect,
    productTitle: jQuery('#productName').val(),
    offeringName: jQuery('#offerName').val(),
    titleHelpText: jQuery('#helpText').val(),
    exitTourURL: jQuery('#marketPlaceUrl').val(),
    exitTourText: "",
    backgroundImageAltText: imageAltText,
    shareEmailSubject: jQuery('#emailSubject').val(),
    shareEmailMessage: jQuery('#emailBody').val(),
    shareLinkedinMessage: jQuery('#linkedinMessage').val(),
    shareLinkedinHashTag: jQuery('#linkedinHashtags').val(),
    shareTwitterMessage: jQuery('#twitterMessage').val(),
    shareTwitterHashTag: jQuery('#twitterHashtags').val(),
    productOwnerName: jQuery('#productOwner').val(),
    publishDate: "",
    effectiveDate: "",
    expiryDate: "",
    createdBy: createdBy,
    updatedBy: loggedInUserEmailId.toLowerCase()
  }
  if (actionFlow == 'add') {

    if (jQuery('#backgroundImage')[0].files.length != 0) {
      var startBgImgBase64Img = await renderImage(jQuery('#backgroundImage'));
      data['backgroundImage'] = "_attachments/startPageBg." + startBgImgBase64Img.image.substring("data:image/".length, startBgImgBase64Img.image.indexOf(";base64"));
    } else if (landingPageData.startPageBg != undefined) {
      data['startPageBg'] = landingPageData.startPageBg;
      data['backgroundImage'] = "_attachments/startPageBg." + landingPageData.startPageBg.substring("data:image/".length, landingPageData.startPageBg.indexOf(";base64"));
    }
  } else {

    if (jQuery('#backgroundImage')[0].files.length != 0) {
      var startBgImgBase64Img = await renderImage(jQuery('#backgroundImage'));
      data['backgroundImage'] = "_attachments/startPageBg." + startBgImgBase64Img.image.substring("data:image/".length, startBgImgBase64Img.image.indexOf(";base64"));
    } else if (landingPageData.startPageBg != undefined) {
      data['startPageBg'] = landingPageData.startPageBg;
      data['backgroundImage'] = "_attachments/startPageBg." + landingPageData.startPageBg.substring("data:image/".length, landingPageData.startPageBg.indexOf(";base64"));
    } else {
      if (caasAttachments != undefined) {
        for (var i = 0; i < caasAttachments.length; i++) {
          if (caasAttachments[i].file.includes('startPageBg')) {
            data['backgroundImage'] = "_attachments/startPageBg." + caasAttachments[i].file.split('.')[1];
            break;
          }
        }
      }
    }
  }
  var count = 0;

  for (var i = 0; i < numberOfusecases; i++) {
    if (jQuery('#useCasetitle' + i).html() != undefined) {

      var useCaseImageAltText = '',
        useCaseLinkText = '',
        useCaseURL = '';
      let usecaseImage = "";
      if (usecaseSelect == "multi") {
        if (jQuery("#useCaseBImg" + count).attr('src') != undefined) {
          if (!jQuery("#useCaseBImg" + count).attr('src').includes('developer.ibm.com')) {
            var base64Data = jQuery("#useCaseBImg" + count).attr('src');
            usecaseImage = "_attachments/useCase" + (count + 1) + "Card." + base64Data.substring("data:image/".length, base64Data.indexOf(";base64"));
          } else {
            usecaseImage = landingPageData.useCases[count].useCaseImage;
          }
        }
      }
      useCaseImageAltText = escapeHtml(jQuery('#useCaseImgAlTxt' + count).html());
      useCaseLinkText = escapeHtml(jQuery('#useCaseExplLinkName' + count).html());
      useCaseURL = escapeHtml(jQuery('#requestUrlName' + count).html());
      var usecase = {
        useCaseTitle: escapeHtml(jQuery('#useCasetitle' + count).html()),
        useCaseDescription: escapeHtml(jQuery('#useCaseDesc' + count).html()),
        useCaseScene: jQuery('#useCaseScene' + count).html(),
        useCaseLinkText: useCaseLinkText,
        useCaseURL: "/" + useCaseURL,
        useCaseImage: usecaseImage,
        useCaseImageAltText: useCaseImageAltText
      }
      useCaseArr.push(usecase);
      count = count + 1;
    }
  }
  data['useCases'] = useCaseArr;
  return data;
}

async function checkIsBImageUploadedByUser(data) {

  var uploaded = false;
  if (jQuery('#backgroundImage')[0].files.length != 0) {

    var startBgImgBase64Img = await renderImage(jQuery('#backgroundImage'));
    data['backgroundImage'] = "_attachments/startPageBg." + startBgImgBase64Img.image.substring("data:image/".length, startBgImgBase64Img.image.indexOf(";base64"));
    uploaded = true;
  } else if (landingPageData.backgroundImage != undefined) {
    data['backgroundImage'] = landingPageData.backgroundImage;
    uploaded = true;
  }

  return {
    formData: data,
    isUploaded: uploaded
  };
}

function saveOrder() {
  var formValidation = true;
  var timeStampDate = '';
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
  var deliveryTime = jQuery("#deliveryTime option:selected").val();
  var orderStatus = 'new';  
  if(deliveryDate == ''){
    jQuery('#deliveryDate').addClass('redBorder');  
    formValidation = false;
  } else{
    timeStampDate = (new Date(deliveryDate)).getTime();
  }
  
  if(customerName == ''){
    jQuery('#customerName').addClass('redBorder');
    formValidation = false;
  }
  if(orderNumber == ''){
    jQuery('#orderNumber').addClass('redBorder');
    formValidation = false;
  }
  if(orderNote == ''){
    jQuery('#orderNote').addClass('redBorder');
    formValidation = false;
  }
  if(mobileNumber == ''){
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
  if(deliveryDate == ''){
    jQuery('#deliveryDate').addClass('redBorder');
    formValidation = false;
  }
  if(dressType == 'selectType'){    
    formValidation = false;
  }
  if(dressFor == 'selectPerson'){    
    formValidation = false;
  }
  if(deliveryTime == 'selectRange'){    
    formValidation = false;
  }
  if(fabricsFrom == 'select'){    
    formValidation = false;
  }
  if(measureBy == 'select'){    
    formValidation = false;
  }
  
console.log("fabricsFrom->"+fabricsFrom);
 if(formValidation){
  jQuery('#loadingIndicator').removeClass('visibility-hidden');
  var data = {
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
    "deliveryTime":deliveryTime,
    "measureBy":measureBy,
    "orderNote":orderNote,
    "createDate":new Date().getTime(),
    "orderStatus": orderStatus
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
      console.log("success");
      jQuery('#loadingIndicator').addClass('visibility-hidden');
      IBMCore.common.widget.overlay.show("confirmationOverlay");
      jQuery("#overlayMsg").empty().append('<span style="color: red;">Data upload is successful</span>');
    },
    error: function (e) {
      alert("There was some internal error while updating, Please try again after sometime")
    }
  });
 } else {
  IBMCore.common.widget.overlay.show("confirmationOverlay");
  jQuery("#overlayMsg").empty().append('<span style="color: red;">Please fill all the fields and select required option.</span>');
 }

}

function validateLandingField(id) {
  var errorCount = 0;
  let value = jQuery("#" + id).val();
  if (value == "") {
    jQuery('#' + id).addClass('redBorder');
    jQuery('#' + id + 'Error').removeClass('display-none');
    jQuery('#' + id + 'Error').addClass('display-block');
    errorCount = errorCount + 1;
  }
  return errorCount;
}

function removeError(val) {
  jQuery('#' + val).addClass('display-none');
}
