/*jshint esversion: 6 */
var cookieValue = readCookie();
var landingPageData = "";
var document_id = "";
var actionFlow = "";
var caasAttachments = [];
var dataSaved = true;
var fieldValuesChanged = true;

jQuery(document).ready(function ($) {

  $("#offerURL").keyup(function () {
    if (!jQuery("#offerURL").val().includes("ibm.com")) {
      $('#external').prop('checked', true);
    } else {
      $('#external').prop('checked', false);
    }

  });

  landingPageData = JSON.parse(sessionStorage.getItem('firstPageData'));
  if (location.pathname.includes("/edit")) {
    actionFlow = 'edit';
    fieldValuesChanged = false;
    const urlParams = new URLSearchParams(window.location.search);
    document_id = encodeURIComponent(urlParams.get('productName'));
  } else {
    actionFlow = 'add';
    fieldValuesChanged = false;
    document_id = landingPageData.offeringName.trim().replaceAll(' ', '-');
  }

  generateUsecaseView(landingPageData);

});

function updateImageName(eventData) {
  jQuery('#' + eventData.id + 'Name').html(jQuery('#' + eventData.id)[0].files[0].name);
}

function uploadSceneImage(imageData) {
  var fieldIndex = imageData.id.substr(-1);
  var usecaseIndex = imageData.id.charAt(7);
  jQuery('#usecase' + usecaseIndex + 'animationBrowse' + fieldIndex).addClass('display-none');
  jQuery('#usecase' + usecaseIndex + 'videoLink' + fieldIndex).addClass('display-none');
  jQuery('#usecase' + usecaseIndex + 'imageBrowse' + fieldIndex).removeClass('display-none');
}

function uploadExitImage() {
  jQuery('#exitVideoUrlLink').addClass('display-none');
  jQuery('#exitPageImage').removeClass('display-none');
  jQuery('#exitVideoUrl').val('');
}

function uploadExitVideo() {
  jQuery('#exitVideoUrlLink').removeClass('display-none');
  jQuery('#exitPageImage').addClass('display-none');
}

function uploadSceneAnimation(animationData) {
  var fieldIndex = animationData.id.substr(-1);
  var usecaseIndex = animationData.id.charAt(7);
  jQuery('#usecase' + usecaseIndex + 'imageBrowse' + fieldIndex).addClass('display-none');
  jQuery('#usecase' + usecaseIndex + 'videoLink' + fieldIndex).addClass('display-none');
  jQuery('#usecase' + usecaseIndex + 'animationBrowse' + fieldIndex).removeClass('display-none');

}

function uploadSceneVideo(videoData) {
  var fieldIndex = videoData.id.substr(-1);
  var usecaseIndex = videoData.id.charAt(7);
  jQuery('#usecase' + usecaseIndex + 'imageBrowse' + fieldIndex).addClass('display-none');
  jQuery('#usecase' + usecaseIndex + 'animationBrowse' + fieldIndex).addClass('display-none');
  jQuery('#usecase' + usecaseIndex + 'videoLink' + fieldIndex).removeClass('display-none');

}

function loadUseCaseData() {

  for (var i = 0; i < landingPageData.useCases.length; i++) {
    var usecase = landingPageData.useCases[i];
    var resp = fetchDocFileByDocIdAndLang(document_id, usecase.useCaseURL);
    if (resp.statusCode == 200) {
      loadDataToField((i + 1), resp.body);
    }
  }

}

function loadDataToField(useCase, usecaseData) {
  var usecaseData = JSON.parse(usecaseData).useCaseScenes;
  for (var i = 0; i < usecaseData.length; i++) {
    let sceneUrl = usecaseData[i].sceneURL;
    sceneUrl = sceneUrl.replace("/", "");
    jQuery('#usecase' + useCase + 'SceneTitle' + i).val(usecaseData[i].sceneTitle);
    jQuery('#usecase' + useCase + 'SceneInfo' + i).val(usecaseData[i].sceneInformation);
    jQuery('#usecase' + useCase + 'SceneDesc' + i).val(usecaseData[i].sceneDescription);
    jQuery('#usecase' + useCase + 'SceneUrl' + i).val(sceneUrl);
    jQuery('#usecase' + useCase + 'AltText' + i).val(usecaseData[i].sceneGraphicAltText);
    jQuery('#usecase' + useCase + 'cta1' + i).val(usecaseData[i].scenePrimaryCTATitle);
    jQuery('#usecase' + useCase + 'Url1' + i).val(usecaseData[i].scenePrimaryCTAUrl);
    jQuery('#usecase' + useCase + 'cta2' + i).val(usecaseData[i].sceneSecondaryCTATitle);
    jQuery('#usecase' + useCase + 'Url2' + i).val(usecaseData[i].sceneSecondaryCTAUrl);
    jQuery('usecase1graphicType0')
    if (usecaseData[i].sceneGraphicType == "image") {
      jQuery("#usecase" + useCase + "graphicImage" + i).prop("checked", true);
    } else if (usecaseData[i].sceneGraphicType == "animation") {
      jQuery("#usecase" + useCase + "graphicAnimation" + i).prop("checked", true);
    } else {
      jQuery("#usecase" + useCase + "graphicVideo" + i).prop("checked", true);
    }
  }
}

function prepareOffer(e) {
  var formValidation = true;
  var offerTitle = jQuery('#offerTitle').val();
  var offerDesc = jQuery('#offerDesc').val();
  var offerLinkName = jQuery('#offerLinkName').val();
  var offerURL = jQuery('#offerURL').val();
  var isExternalLink = jQuery('#external').prop("checked");

  var overlaySaveName = jQuery('#overlaySave').attr('data-offer-name');
  let offer = '';
  if (overlaySaveName.includes('exitOfferCard'))
    offer = overlaySaveName.charAt(13);
  else
    offer = overlaySaveName.charAt(9);

  if (formValidation) {
    let cards = "<div class='ibm-card cardFormat' style='margin:10px;'><div class='ibm-card__content' id='exitOfferCard" + offer + "' style='height:250px;word-wrap: break-word; overflow: hidden; text-overflow: ellipsis;'>" +
      "<h4 class='ibm-h4' id ='exitOfferCardTitle" + offer + "'>" + offerTitle + "</h4><h6 class='ibm-h6 ibm-textcolor-gray-50' id='exitOfferCardDesc" + offer + "'>" + offerDesc + "</h6>" +
      "<p class='cardUrlName' hidden id='exitOfferCardLink" + offer + "'>" + offerLinkName + "</p><p class='cardUrlLink' hidden id='exitOfferCardLinkURL" + offer + "'>" + offerURL + "</p>" +
      "<p class='cardUrlExternal' hidden id='exitOfferIsLinkExternal" + offer + "'>" + isExternalLink + "</p>" +
      "<p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a id ='exitOfferEdit" + offer + "' class='ibm-edit-link tipso_style' onclick='cardEdit(this); IBMCore.common.widget.overlay.show(\"overlayOffer\"); return false;' href='' role='button' >Edit UseCase</a>" +
      "</p><p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a class='ibm-close-link' id ='deleteOffer" + offer + "' onclick='deleteOffer(this);' role='button' >Delete UseCase</a></p></div></div></div>";
    jQuery("#exitPageCard" + offer).html(cards);
    jQuery("#offerTitle").val('');
    jQuery("#offerDesc").val('');
    jQuery("#offerURL").val('');
    IBMCore.common.widget.overlay.hide('overlayOffer', true);
  }
};

function deleteOffer(e) {
  var offerNumber = e.id.charAt(11);
  jQuery(e).parent().parent().parent().parent().html('<a id="exitOffer' + offerNumber + '" name="exitOffer' + offerNumber + '" onclick="formOverlayVal(this);IBMCore.common.widget.overlay.show(\'overlayOffer\'); return false;"><div class="add-usecase">Add offer ' + offerNumber + ' details + </div></a>');
}

function cardEdit(e) {

  //jQuery('.offerTileNo').html(jQuery(e).parent().parent().parent().parent().index());
  let tileID = e.id.replace(/[^\d]+/, '');
  let dataoffername = jQuery(e).parent().parent().attr('id');
  jQuery('#overlaySave').attr('data-offer', tileID);
  jQuery('#overlaySave').attr('data-offer-name', dataoffername);
  let title = jQuery(e).parent().parent().find("h4").html();
  let desc = jQuery(e).parent().parent().find("h6").html();
  let urlName = jQuery(e).parent().parent().find(".cardUrlName").html();
  let url = jQuery(e).parent().parent().find(".cardUrlLink").html();

  jQuery("#offerTitle").val(title);
  jQuery("#offerDesc").val(desc);
  jQuery("#offerLinkName").val(urlName);
  jQuery("#offerURL").val(url);

}


function formOverlayVal(e) {
  jQuery("#offerTitle").val('');
  jQuery("#offerDesc").val('');
  jQuery("#offerLinkName").val('');
  jQuery("#offerURL").val('');
  jQuery('#overlaySave').attr('data-offer-name', e.id);
 
  var landingPage = JSON.parse(sessionStorage.getItem('firstPageData'));
  var options = '<select id="scenes" onchange=""  style="width:160px; height:40px"> <option value="">Select Usecase</option>';
 for (var i = 0; i <= (landingPage.useCases.length) - 1; i++) {
      let url = landingPageData.useCases[i].useCaseURL;
      options = options + '<option value="' + i + '">' + url + '</option>';
 }
  options = options + '</select>';
  jQuery('#usecaseDropdown').empty().append(options);
}

// card preview
jQuery(".ibm-btn-pri").on("click", function () {
  let title = jQuery("#uc-title").val();
  let desc = jQuery("#uc-desc").val();
  let scene = jQuery("#scenes option:selected").html();
  let cards = "<div class='ibm-card'><div class='ibm-card__image'><img src='https://image.shutterstock.com/image-photo/white-transparent-leaf-on-mirror-260nw-1029171697.jpg' alt='card_3' width='100%' height='100'  ></div><div class='ibm-card__content'><h3 class='ibm-h3'>" + title + "</h3><p>" + desc + "</p><p class='ibm-ind-link'><a href='javascript:;' class='ibm-forward-link'>" + scene + "</a></p></div></div></div>";
  let usecase = parseInt(jQuery("#landingPageForm").attr("data-usecase"));
  jQuery(".ibm-col-12-3:eq(" + usecase + ")").html(cards);
});
jQuery(".add-usecase").parent("a").on("click", function () {
  let usecase = jQuery(this).parent('div').attr("id").slice(-1);
  jQuery("#landingPageForm").attr("data-usecase", usecase);
});

function formReset() {
  var usecases = JSON.parse(sessionStorage.getItem('firstPageData')).useCases;
  var usecaseSize = usecases.length;
  jQuery('#useCaseForm').trigger("reset");

  var offerId = 0;
  for (var i = 1; i <= usecaseSize; i++) {
    for (var j = 1; j <= 4; j++) {
      jQuery('.usecase' + i + 'offerTile' + j).html('<a id="offer' + offerId++ + '" name="usecase' + i + 'Tile' + j + '" href="" onclick="formOverlayVal(this);IBMCore.common.widget.overlay.show(\'overlayOffer\'); return false;"><div class="add-usecase">Add offer ' + j + ' details + </div></a>');
    }
  }
  removeformError();
}

function removeformError() {


  var usecases = JSON.parse(sessionStorage.getItem('firstPageData')).useCases;
  var usecaseSize = usecases.length;
  var counts = 0;

  for (var j = 1; j <= usecaseSize; j++) {
    jQuery("#uc" + j).attr('style', '');
    jQuery("[name='intro" + j + "']").removeClass('ibm-caution-link ibm-textcolor-red-50');
    jQuery("[name='exit" + j + "']").removeClass('ibm-caution-link ibm-textcolor-red-50');

    jQuery("#usecase" + j + "IntroStepInfo").removeClass('ibm-field-error');
    jQuery("#introStepInfoError" + j).addClass('display-none');
    jQuery("#usecase" + j + "IntroStepTitle").removeClass('ibm-field-error');
    jQuery("#introSceneTitleError" + j).addClass('display-none');
    jQuery("#usecase" + j + "IntroSceneInfo").removeClass('ibm-field-error');
    jQuery("#introSceneInfoError" + j).addClass('display-none');
    jQuery("#usecase" + j + "InroSceneDesc").removeClass('ibm-field-error');
    jQuery("#introSceneDescError" + j).addClass('display-none');
    jQuery("#usecase" + j + "InroNextStep").removeClass('ibm-field-error');
    jQuery("#introNextError" + j).addClass('display-none');
    jQuery("#usecase" + j + "ExitSubTitle").removeClass('ibm-field-error');
    jQuery("#taglineError" + j).addClass('display-none');
    jQuery("#usecase" + j + "ExitUcURL").removeClass('ibm-field-error');
    jQuery("#exitWhereError" + j).addClass('display-none');
    jQuery("#usecase" + j + "ExitBackImage").addClass('display-none');
    jQuery("#usecase" + j + "IntroBackImage").addClass('display-none');
    jQuery("#exitOverlayError" + j).css({
      "display": "none"
    });

  }

  for (var i = 1; i <= usecaseSize; i++) {
    for (var j = 1; j <= usecases[i - 1].scene; j++) {

      jQuery("[name='uc" + i + "scene" + j + "']").removeClass('ibm-caution-link ibm-textcolor-red-50');

      jQuery("#usecase" + i + "SceneBackImage" + j).addClass('display-none');
      jQuery("#usecase" + i + "stepInfo" + j).removeClass('ibm-field-error');
      jQuery("#usecase" + i + "stepInfoError" + j).addClass('display-none');
      jQuery("#usecase" + i + "sceneTitle" + j).removeClass('ibm-field-error');
      jQuery("#usecase" + i + "sceneTitleError" + j).addClass('display-none');
      jQuery("#usecase" + i + "sceneInfo" + j).removeClass('ibm-field-error');
      jQuery("#usecase" + i + "sceneInfoError" + j).addClass('display-none');
      jQuery("#usecase" + i + "SceneDesc" + j).removeClass('ibm-field-error');
      jQuery("#usecase" + i + "SceneDescError" + j).addClass('display-none');
      jQuery("#usecase" + i + "NextStep" + j).removeClass('ibm-field-error');
      jQuery("#usecase" + i + "NextStepError" + j).addClass('display-none');

    }
  }

}


function processImage(e) {
  var idis = e.id;
  if (jQuery('#' + e.id)[0].files && jQuery('#' + e.id)[0].files[0]) {
    var FR = new FileReader();
    FR.addEventListener("load", function (e) {
      let image = e.target.result;
      jQuery('#' + idis + 'b64').css({
        "width": "130px",
        "height": "130px",
        "padding-top": "10px"
      });
      jQuery('#' + idis + 'b64').attr('src', image);
    });
    FR.readAsDataURL(jQuery('#' + e.id)[0].files[0]);
  }
}


async function useCaseFormValidation(e) {
  removeformError();

  var formValidation = true;
  var usecases = JSON.parse(sessionStorage.getItem('firstPageData')).useCases;
  var usecaseSize = usecases.length;
  var counts = 0;

  for (var i = 1; i <= usecaseSize; i++) {
    for (var j = 1; j <= 4; j++) {
      if ((jQuery('#usecase' + i + 'Tile' + j + 'Title').length) >= 1) {
        counts = counts + 1;
      }
    }
    if (counts < 1) {
      jQuery("#exitOverlayError" + i).empty().append("Min 1 offer to be selected");
      jQuery("#exitOverlayError" + i).css({
        "display": ""
      });
      jQuery("[name='exit" + i + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + i).attr('style', 'color:red;');
      formValidation = false;
    } else {
      jQuery("#exitOverlayError").css({
        "display": "none"
      });
    }
    counts = 0;
  }

  for (var j = 1; j <= usecaseSize; j++) {

    if (jQuery("#usecase" + j + "InTroImageb64").attr('src') == "") {

      jQuery("#usecase" + j + "IntroBackImage").removeClass('display-none');
      jQuery("[name='intro" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "IntroStepInfo").val() == "") {
      jQuery("#usecase" + j + "IntroStepInfo").addClass('ibm-field-error');
      jQuery("[name='intro" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "IntroStepInfo").val().length > 50) {
      jQuery("#usecase" + j + "IntroStepInfo").addClass('ibm-field-error');
      jQuery("#introStepInfoError" + j).empty().append('Step Information is more than 50 characters');
      jQuery("#introStepInfoError" + j).removeClass('display-none');
      jQuery("[name='intro" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "IntroStepTitle").val() == "") {
      jQuery("#usecase" + j + "IntroStepTitle").addClass('ibm-field-error');
      jQuery("[name='intro" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "IntroStepTitle").val().length > 60) {
      jQuery("#usecase" + j + "IntroStepTitle").addClass('ibm-field-error');
      jQuery("#introSceneTitleError" + j).empty().append('Step Title is more than 60 characters');
      jQuery("[name='intro" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#introSceneTitleError" + j).removeClass('display-none');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "IntroSceneInfo").val() == "") {
      jQuery("#usecase" + j + "IntroSceneInfo").addClass('ibm-field-error');
      jQuery("[name='intro" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "IntroSceneInfo").val().length > 300) {
      jQuery("#usecase" + j + "IntroSceneInfo").addClass('ibm-field-error');
      jQuery("#introSceneInfoError" + j).empty().append('Scene Information is more than 300 characters');
      jQuery("#introSceneInfoError" + j).removeClass('display-none');
      jQuery("[name='intro" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "InroSceneDesc").val() == "") {
      jQuery("#usecase" + j + "InroSceneDesc").addClass('ibm-field-error');
      jQuery("[name='intro" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "InroSceneDesc").val().length > 300) {
      jQuery("#usecase" + j + "InroSceneDesc").addClass('ibm-field-error');
      jQuery("#introSceneDescError" + j).empty().append('Scene Description is more than 300 characters');
      jQuery("#introSceneDescError" + j).removeClass('display-none');
      jQuery("[name='intro" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "InroNextStep").val() == "") {
      jQuery("#usecase" + j + "InroNextStep").addClass('ibm-field-error');
      jQuery("[name='intro" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "InroNextStep").val().length > 60) {
      jQuery("#usecase" + j + "InroNextStep").addClass('ibm-field-error');
      jQuery("#introNextError" + j).empty().append('Next Step is more than 60 characters');
      jQuery("#introNextError" + j).removeClass('display-none');
      jQuery("[name='intro" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "ExitSubTitle").val() == "") {
      jQuery("#usecase" + j + "ExitSubTitle").addClass('ibm-field-error');
      jQuery("[name='exit" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "ExitSubTitle").val().length > 60) {
      jQuery("#usecase" + j + "ExitSubTitle").addClass('ibm-field-error');
      jQuery("#taglineError" + j).empty().append('Tagline is more than 60 characters');
      jQuery("#taglineError" + j).removeClass('display-none');
      jQuery("[name='exit" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }

    if (jQuery("#usecase" + j + "ExitImageb64").attr('src') == "") {
      jQuery("#usecase" + j + "ExitBackImage").removeClass('display-none');
      jQuery("[name='exit" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }

    if (jQuery("#usecase" + j + "ExitUcURL").val() == "") {
      jQuery("#usecase" + j + "ExitUcURL").addClass('ibm-field-error');
      jQuery("[name='exit" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "ExitUcURL").val().length > 40) {
      jQuery("#usecase" + j + "ExitUcURL").addClass('ibm-field-error');
      jQuery("#exitWhereError" + j).empty().append('Is more than 40 characters');
      jQuery("#exitWhereError" + j).removeClass('display-none');
      jQuery("[name='exit" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc" + j).attr('style', 'color:red;');
      formValidation = false;
    }
  }
  for (var i = 1; i <= usecaseSize; i++) {
    for (var j = 1; j <= usecases[i - 1].scene; j++) {
      if (jQuery("#usecase" + i + "Scene" + j + "Imageb64").attr('src') == "") {
        jQuery("#usecase" + i + "SceneBackImage" + j).removeClass('display-none');
        jQuery("[name='uc" + i + "scene" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc" + i).attr('style', 'color:red;');
        formValidation = false;
      }

      if (jQuery("#usecase" + i + "stepInfo" + j).val() == "") {
        jQuery("#usecase" + i + "stepInfo" + j).addClass('ibm-field-error');
        jQuery("[name='uc" + i + "scene" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc" + i).attr('style', 'color:red;');
        formValidation = false;
      }
      if (jQuery("#usecase" + i + "stepInfo" + j).val().length > 50) {
        jQuery("#usecase" + i + "stepInfo" + j).addClass('ibm-field-error');
        jQuery("#usecase" + i + "stepInfoError" + j).empty().append('Step Information is more than 50 characters');
        jQuery("#usecase" + i + "stepInfoError" + j).removeClass('display-none');
        jQuery("[name='uc" + i + "scene" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc" + i).attr('style', 'color:red;');
        formValidation = false;
      }
      if (jQuery("#usecase" + i + "sceneTitle" + j).val() == "") {
        jQuery("#usecase" + i + "sceneTitle" + j).addClass('ibm-field-error');
        jQuery("[name='uc" + i + "scene" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc" + i).attr('style', 'color:red;');
        formValidation = false;
      }
      if (jQuery("#usecase" + i + "sceneTitle" + j).val().length > 60) {
        jQuery("#usecase" + i + "sceneTitle" + j).addClass('ibm-field-error');
        jQuery("#usecase" + i + "sceneTitleError" + j).empty().append('Scene Title is more than 60 characters');
        jQuery("#usecase" + i + "sceneTitleError" + j).removeClass('display-none');
        jQuery("[name='uc" + i + "scene" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc" + i).attr('style', 'color:red;');
        formValidation = false;
      }
      if (jQuery("#usecase" + i + "sceneInfo" + j).val() == "") {
        jQuery("#usecase" + i + "sceneInfo" + j).addClass('ibm-field-error');
        jQuery("[name='uc" + i + "scene" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc" + i).attr('style', 'color:red;');
        formValidation = false;
      }
      if (jQuery("#usecase" + i + "sceneInfo" + j).val().length > 300) {
        jQuery("#usecase" + i + "sceneInfo" + j).addClass('ibm-field-error');
        jQuery("#usecase" + i + "sceneInfoError" + j).empty().append('Scene Information is more than 300 characters');
        jQuery("#usecase" + i + "sceneInfoError" + j).removeClass('display-none');
        jQuery("[name='uc" + i + "scene" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc" + i).attr('style', 'color:red;');
        formValidation = false;
      }

      if (jQuery("#usecase" + i + "SceneDesc" + j).val().length > 300) {
        jQuery("#usecase" + i + "SceneDesc" + j).addClass('ibm-field-error');
        jQuery("#usecase" + i + "SceneDescError" + j).empty().append('Scene Description is more than 300 characters');
        jQuery("#usecase" + i + "SceneDescError" + j).removeClass('display-none');
        jQuery("[name='uc" + i + "scene" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc" + i).attr('style', 'color:red;');
        formValidation = false;
      }
      if (jQuery("#usecase" + i + "NextStep" + j).val() == "") {
        jQuery("#usecase" + i + "NextStep" + j).addClass('ibm-field-error');
        jQuery("[name='uc" + i + "scene" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc" + i).attr('style', 'color:red;');
        formValidation = false;
      }
      if (jQuery("#usecase" + i + "NextStep" + j).val().length > 60) {
        jQuery("#usecase" + i + "NextStep" + j).addClass('ibm-field-error');
        jQuery("#usecase" + i + "NextStepError" + j).empty().append('Next Step more than 60 characters');
        jQuery("#usecase" + i + "NextStepError" + j).removeClass('display-none');
        jQuery("[name='uc" + i + "scene" + j + "']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc" + i).attr('style', 'color:red;');
        formValidation = false;
      }

    }
  }

  if (formValidation) {

    jQuery('#loadingIndicator').css('display', '');
    prepareJson();

    //e.preventDefault();
  } else {
    return false;
  }
}

function prepareJson() {
  jQuery('#publishButton').attr("disabled", "disabled");
  var jsonData = JSON.parse(sessionStorage.getItem('firstPageData'));
  for (var i = 0; i < jsonData.useCases.length; i++) {
    var introPage = {
      "image": jQuery('#usecase' + (i + 1) + 'InTroImageb64').attr('src'),
      "sceneStepInfo": jQuery('#usecase' + (i + 1) + 'IntroStepInfo').val(),
      "sceneTitle": jQuery('#usecase' + (i + 1) + 'IntroStepTitle').val(),
      "sceneInfo": {
        "para": jQuery('#usecase' + (i + 1) + 'IntroSceneInfo').val()
      },
      "sceneDesc": jQuery('#usecase' + (i + 1) + 'InroSceneDesc').val(),
      "tease": jQuery('#usecase' + (i + 1) + 'InroNextStep').val()
    }
    jsonData.useCases[i]["introPage"] = introPage;
    for (var j = 0; j < parseInt(jsonData.useCases[i].scene); j++) {
      var scene = scene + (j + 1);
      var values = {
        "image": jQuery('#usecase' + (i + 1) + 'Scene' + (j + 1) + 'Imageb64').attr('src'),
        "sceneStepInfo": jQuery('#usecase' + (i + 1) + 'stepInfo' + (j + 1) + '').val(),
        "sceneTitle": jQuery('#usecase' + (i + 1) + 'sceneTitle' + (j + 1) + '').val(),
        "sceneInfo": {
          "para": jQuery('#usecase' + (i + 1) + 'sceneInfo' + (j + 1) + '').val()
        },
        "sceneDesc": jQuery('#usecase' + (i + 1) + 'SceneDesc' + (j + 1) + '').val(),
        "tease": jQuery('#usecase' + (i + 1) + 'NextStep' + (j + 1) + '').val()
      }
      jsonData.useCases[i]["scene" + (j + 1)] = values;
    }
    var offerArr = [];
    for (var j = 0; j < 4; j++) {
      if (typeof jQuery("#usecase" + (i + 1) + "Tile" + (j + 1) + "Title").html() != "undefined") {
        var usecaseDetails = {
          "nextStep": jQuery("#usecase" + (i + 1) + "Tile" + (j + 1) + "Title").html(),
          "nextStepDescription": jQuery("#usecase" + (i + 1) + "Tile" + (j + 1) + "Desc").html(),
          "nextStepLink": jQuery("#usecase" + (i + 1) + "Tile" + (j + 1) + "URL").html()
        }
        offerArr.push(usecaseDetails);
      }
    }
    var exitPage = {
      "tagline": jQuery('#usecase' + (i + 1) + 'ExitSubTitle').val(),
      "image": jQuery('#usecase' + (i + 1) + 'ExitImageb64').attr('src'),
      "offerCases": offerArr,
      "render": jQuery('#usecase' + (i + 1) + 'ExitUcURL').val(),

    }

    jsonData.useCases[i]["exitPage"] = exitPage;
  }
  jQuery.ajax({
    type: "POST",
    url: "/cloudant/add",
    data: JSON.stringify(jsonData),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + cookieValue,
    },
    success: function (result) {
      jQuery('#loadingIndicator').attr('style', 'display:none;');
      if (result.statusCode != 201) {
        IBMCore.common.widget.overlay.show("confirmationOverlay");
        jQuery("#overlayMsg").empty().append("There was an error - " + result.message);
        window.location.href = '/';
      } else {
        if (window.confirm("Product id - " + result.data.createdId + " is been added . Do you want to view tour?")) {
          window.location.href = 'http://showcase-viewer.mybluemix.net?prdId=' + result.data.createdId;
        } else {
          window.close();
        }
      }
      sessionStorage.clear();
    },
    error: function (e) {
      jQuery('#loadingIndicator').attr('style', 'display:none;');
      jQuery('#publishButton').removeAttr("disabled");
      IBMCore.common.widget.overlay.show("confirmationOverlay");
      jQuery("#overlayMsg").empty().append('There was an error while adding data please try again later');
      sessionStorage.clear();
      window.close();
    }
  });
}

async function generateUsecaseView(landingPageData) {

  jQuery('#loadigText').attr('style', 'display:none;');
  jQuery('#loadingIndicator').attr('style', 'display:none;');
  jQuery("#footerButtons").css("display", "block");
  jQuery("input[name='useCaseSelect']:radio").attr('disabled', true);
  if (landingPageData.usecaseType == 'single') {
    jQuery("input[id='useCaseSingle']:radio").attr('checked', true);
  }

  var usecaseSize = landingPageData.useCases.length;
  var usecasesValues = '';
  var usecasedetails = '';
  var scence = '';
  var allScence = '';
  var allScenceDetails = '';
  var k = 0;
  var l = 0;

  var usecasesDiv = '<div class=" ibm-text-tabs" id="tabs">' +
    '<ul id="usecases" role="tablist" class="ibm-tabs" aria-label="Tab navigation"></ul>' +
    '</div>';
  for (var i = 1; i <= usecaseSize + 1; i++) {
    l++;
    var displayblock = '';
    if (i != 1) {
      displayblock = 'display-none';
    }

    var pageTitle = '',
      pageDesc = '',
      usecaseMainTab = '',
      tabId = '';

    if (i == usecaseSize + 1) {
      pageTitle = '';
      pageDesc = '';
      usecaseMainTab = 'Exit Page';
      tabId = 'exitTab';


      usecasedetails = usecasedetails + '<div class="ibm-fluid ' + displayblock + '" id="exitPagedetails' + i + '" >' +
        '<div class="ibm-col-12-12">' +
        '<div for="tagLine" class="ibm-textcolor-green-60 tooltip">Tag line' +
        '<span class="tooltiptext">Catchy tagline for your exit page, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#tagLine" target="_blank">Read more...</a></span>' +
        '<span class="ibm-required"> *</span>' +
        '</div> <span class="ibm-textcolor-gray-40 ibm-small"> max 60 characters</span>' +
        '<div class="fieldPaddingTop"><input type="text" spellcheck="true" class="usecaseFieldWidth" id="exitTitle" maxlength="60" name="exitTitle" placeholder="Enter tag line"></div><p class="validationFontSize display-none" id="exitTitleError">Title is required</p>' +
        '<label></label>' +


        '<div style="width:250px;display: inline-block;">' +
        '<div>' +

        '<div class="ibm-padding-top-1"><div for="exitPageGraphicType" class="ibm-textcolor-green-60 tooltip">Exit page graphic type' +
        '<span class="tooltiptext">Video or image to inform readers and encourage further interaction, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#exitGraphicType" target="_blank">Read more...</a></span>' +
        '</div><span class="ibm-required"> </span></div>' +
        '</div>' +
        '<div class="fieldPaddingTop"><span class="ibm-input-group ibm-radio-group">' +
        '<span><input id="exitGraphicImage"  name="exitSelect" type="radio" checked value="image" onclick="uploadExitImage();" />' +
        '<label for="exitGraphicImage"  class="ibm-textcolor-green-60">Image</label>' +
        '</span> ' +
        '<span><input  id="exitGraphicVideo" name="exitSelect" type="radio" value="video" onclick="uploadExitVideo();" />' +
        '<label for="exitGraphicVideo" class="ibm-textcolor-green-60">Video</label>' +
        '</span>' +
        '</span></div>' +
        '</div>' +

        '<div style="display: inline-block;">' +
        '<div id="exitPageImage" style="margin-left:230px;width:145px;">' +

        '<div class="ibm-padding-top-1">' +
        '<div for="exitPageGraphicImage" class="ibm-textcolor-green-60 tooltip">Browse image' +
        '<span class="tooltiptext">Browse image, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#exitGraphic" target="_blank">Read more...</a></span>' +
        '</div>' +
        '<span class="ibm-required"> </span>' +
        '</div>' +

        '<div class="fieldPaddingTop"><input id="exitPageGraphicImage" type="file" data-multiple="false" onchange="updateImageName(this)" accept="image/*" style="display:none;" /><label for="exitPageGraphicImage" class="btn ibm-center">Browse</label><span class="ibm-small floatLeft" id="exitPageGraphicImageName"></span>' +
        '</div>' +
        '<span>' +
        '<img src="" id="exitPageGraphicImageb64" style="display:none;"/>' +
        '</span>' +
        '<p class="validationFontSize display-none" id="exitPageGraphicImageError">Image is required</p>' +
        '</div>' +


        '<div id="exitVideoUrlLink" class="display-none" style="width:390px;">' +

        '<div class="ibm-padding-top-1"><div for="exitVideoUrl" class="ibm-textcolor-green-60 tooltip">Video URL' +
        '<span class="tooltiptext">Video URL, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#exitGraphicVideo" target="_blank">Read more...</a></span>' +
        '</div></div>' +
        '<div class="fieldPaddingTop"><input type="text" spellcheck="true" maxlength="50" value="" id="exitVideoUrl" name="exitVideoUrl" class="usecaseFieldWidth" placeholder="Enter video url"></div><p class="validationFontSize display-none" id="exitVideoUrlError">Video URL is required</p>' +

        '</div>' +

        '</div>' +

        '</br><div for="exitAltText" class="ibm-textcolor-green-60 tooltip paddingTop20">Alt text' +
        '<span class="tooltiptext">Alt text, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#exitGraphicAltText" target="_blank">Read more...</a></span>' +
        '<span class="ibm-required"> *</span>' +
        '</div>' +
        '<div class="fieldPaddingTop"><input type="text" spellcheck="true" value="" id="exitAltText" name="exitAltText" maxlength="50" class="usecaseFieldWidth" placeholder="Alt text"></div><p class="validationFontSize display-none" id="exitAltTextError">Alt Text is required</p>' +

        '</br>' +
        '<div style="width:300px;display: inline-block;"><div><div for="exitPageBImage" class="ibm-textcolor-green-60 tooltip">Background image for exit page' +
        '<span class="tooltiptext">A graphic on which you will overlay the other elements of the page, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#exitBackgroundImage" target="_blank">Read more...</a></span>' +
        '<span class="ibm-required"> *</span>' +
        '</div>' +
        '<div class="fieldPaddingTop"><input id="exitPageBImage" type="file" data-multiple="false" onchange="updateImageName(this)" accept="image/*" style="display:none;" /><label for="exitPageBImage" class="btn ibm-center">Browse</label><span class="ibm-small floatLeft" id="exitPageBImageName"></span>' +
        '</div>' +
        '<span>' +
        '<img src="" id="exitPageBImageb64" style="display:none;"/>' +
        '</span>' +
        '<p><span class="validationFontSize display-none" id="exitPageBImageError">Image is required</span></p>' +
        '</div>' +
        '</div>' +

        '<div style="margin-left:15px;width:325px;display: inline-block;">' +

        '<div for="backgroundImgAlt" class="ibm-textcolor-green-60 tooltip">Background image Alt text' +
        '<span class="tooltiptext">Background image Alt text, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#exitBackgroundImageAltText" target="_blank">Read more...</a></span>' +
        '<span class="ibm-required"> *</span>' +
        '</div>' +
        '<div class="fieldPaddingTop"><input type="text" value="" id="backgroundImageAlt" name="backgroundImageAlt" maxlength="50" class="usecaseFieldWidth"  placeholder="Background image Alt text"></div><p class="validationFontSize display-none" id="backgroundImageAltError">Alt text is required</p>' +

        '</div>' +

        '</br><div class="fieldPaddingTop"><div for="exitPgURL" class="ibm-textcolor-green-60 tooltip">Requested exit page URL name' +
        '<span class="tooltiptext">Requested exit page URL name, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#exitRequestUrl" target="_blank">Read more...</a></span>' +
        '<span class="ibm-required"> *</span>' +
        '</div></div>' +
        '<div><input type="text" value="" spellcheck="true" id="exitPageUrl" name="exitPageUrl" maxlength="50" class="usecaseFieldWidth"  placeholder=".../exitpg"></div><p class="validationFontSize display-none" id="exitPageUrlError">URL name is required</p>' +

        '<div class="ibm-padding-top-1"><div for="exitconfigureProductTitle" class="ibm-textcolor-green-60  tooltip"><span class="ibm-h4">Configure product links</span>' +
        '<span class="tooltiptext">Configure product links, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#exitConfigureLink" target="_blank">Read more...</a></span>' +
        '</div></div>' +

        '<div>' +
        '<div class="fieldPaddingTop">' +

        '<div for="exitcta" class="ibm-textcolor-green-60  tooltip" style="display: inline-block;">CTA 1' +
        '<span class="tooltiptext">Your main call to action for the Exit page, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#exitCta1" target="_blank">Read more...</a></span>' +
        '<span class="ibm-required"> *</span>' +
        '</div>' +
        '<div style="display: inline-block;padding-left:278px;"><div for="exitURL" class="ibm-textcolor-green-60 tooltip">URL' +
        '<span class="tooltiptext">URL, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#exitCtaUrl" target="_blank">Read more...</a></span>' +
        '</div><span class="ibm-required"> *</span></div>' +

        '</div>' +
        '<div class="fieldPaddingTop">' +
        '<input style="display: inline-block;" spellcheck="true" type="text" value="" maxlength="25" class="usecaseCtaWidth" id="exitcta" name="exitcta"  placeholder="Enter CTA name">' +
        '<input style="display: inline-block;margin-left:10px;" type="text"  value="" class="usecaseFieldWidth" id="exitUrl" name="exitUrl" placeholder="Enter URL">' +
        '<p class="ibm-external-link"' +
        'style="position: relative;color:grey;display: inline-block;margin-bottom:3px;"></p><span class="validationFontSize display-none" id="exitctaError">CTA is required</span><span class="validationFontSize display-none" id="exitUrlError">URL is required</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="ibm-col-12-12">' +
        '<label for="addOffersTitle" class="ibm-textcolor-black-60 ibm-padding-top-1 ibm-h4">Add offer(s)</label><p class="validationFontSize display-none" id="offerError">Minimum 1 offer is required</p><p class="validationFontSize display-none" id="offerVal"></p><p class="validationFontSize display-none" id="offerValError"></p>' +
        '</div>' +
        '<div class="ibm-col-12-12 ibm-widget-processed ibm-sameheight-processed offerSection" data-widget="setsameheight" data-items=".ibm-col-12-4" >' +

        '<div class="ibm-col-12-4" id="exitPageCard1" style="height: 320px;">' +
        '<a id="exitOffer1" name="exitOffer1" href="" onclick="formOverlayVal(this);IBMCore.common.widget.overlay.show(\'overlayOffer\'); return false;">' +
        '<div class="add-usecase">Add offer 1 details + </div>' +
        '</a></div>' +
        '<div class="ibm-col-12-4" id="exitPageCard2" style="height: 320px;">' +
        '<a id="exitOffer2"  name="exitOffer2"  href="" onclick="formOverlayVal(this);IBMCore.common.widget.overlay.show(\'overlayOffer\'); return false;">' +
        '<div class="add-usecase">Add offer 2 details + </div>' +
        '</a></div>' +
        '<div class="ibm-col-12-4" id="exitPageCard3" style="height: 320px;">' +
        '<a id="exitOffer3"  name="exitOffer3"  href="" onclick="formOverlayVal(this);IBMCore.common.widget.overlay.show(\'overlayOffer\'); return false;">' +
        '<div class="add-usecase">Add offer 3 details + </div>' +
        '</a></div>' +
        '</div>' +
        '</div>';

    } else {
      pageTitle = landingPageData.useCases[i - 1].useCaseTitle;
      pageDesc = landingPageData.useCases[i - 1].useCaseDescription;
      usecaseMainTab = 'Usecase ' + i;
      tabId = 'Usecase' + i;


      usecasedetails = usecasedetails + '<div class="ibm-fluid ' + displayblock + '" id="usecasedetails' + i + '" ><div class="ibm-col-12-12">' +

        '<div for="ucTitle" class="ibm-textcolor-green-60 tooltip">Usecase Title' +
        '<span class="tooltiptext">Populated  automatically from the Start Page, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#usecaseTitle" target="_blank">Read more...</a></span>' +
        '</div><span class="ibm-required"> *</span>' +

        '<div><input type="text" value="' + pageTitle + '" style="width:35em" id="ucTitleValue' + i + '" name="ucTitle' + i + '"  disabled></div></p></div>' +
        '<div class="ibm-col-12-12">' +
        '<div for="ucDesc" class="ibm-textcolor-green-60 tooltip fieldPaddingTopMax">Usecase Description' +
        '<span class="tooltiptext">Usecase description, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#usecaseDescription" target="_blank">Read more...</a></span>' +
        '</div><span class="ibm-required"> *</span>' +
        '<div><textarea value="" rows="4" id="ucDescValue' + i + '" name="ucDesc' + i + '" style="width:35em"  disabled>' + pageDesc + '</textarea></div></div></div>';

    }
    usecasesValues = usecasesValues + '<li role="presentation" id="usecase' + i + '"><a role="tab" id="' + tabId + '" href="#">' + usecaseMainTab + '</a></li>';
    var scence = '';
    var preFields = '';
    if (i != usecaseSize + 1) {
      preFields = '<ul class="ibm-tabs ' + displayblock + '" role="tablist" id="scence' + i + '" >' +
        '<li id="eachScene' + l + '"><a aria-selected="true" role="tab" href="#introTab" name="intro' + i + '">Intro Page</a></li>';
    }
    var finalScence = '';
    if (i != usecaseSize + 1)
      for (var j = 1; j <= Number(landingPageData.useCases[i - 1].useCaseScene); j++) {
        l++;
        if (j == Number(landingPageData.useCases[i - 1].useCaseScene)) {
          scence = scence + '<li id="eachScene' + l + '"><a role="tab" href="#uc1Scene1" name="uc' + i + 'scene' + j + '">Scene ' + j + '</a></li></ul>';
        } else {
          scence = scence + '<li id="eachScene' + l + '"><a role="tab" href="#uc1Scene1" name="uc' + i + 'scene' + j + '">Scene ' + j + '</a></li>';
        }

      }

    l++;

    var noOfScence = '';
    if (i != usecaseSize + 1)
      noOfScence = Number(landingPageData.useCases[i - 1].useCaseScene) + 2;
    var scenceDetails = '';
    if (i != usecaseSize + 1)
      for (var j = 1; j <= noOfScence; j++) {
        var displayblockScence = 'display-block';
        if (k != 0) {
          displayblockScence = 'display-none';
        }
        k++;
        if (j == noOfScence) { } else if (j == 1) {

          var idValue = 0;

          scenceDetails = scenceDetails + '<div id="scenceDetails' + k + '" class="ibm-tabs-content ' + displayblockScence + '">' +

            '<div for="IntroTitle" class="ibm-textcolor-green-60 tooltip">Scene title' +
            '<span class="tooltiptext">Scene title, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#introSceneTitle" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span><span class="ibm-textcolor-gray-40 ibm-small"> max 60 characters</span>' +

            '<div><input type="text" spellcheck="true" id="usecase' + i + 'SceneTitle' + idValue + '" name="usecase' + i + 'SceneTitle' + idValue + '"  maxlength="60" placeholder="Enter scene title" class="usecaseFieldWidth"></div><p class="validationFontSize display-none" id="usecase' + i + 'SceneTitle' + idValue + 'Error">Title is required</p>' +

            '<div class="ibm-padding-top-1"><div for="IntroSceneInfo" class="ibm-textcolor-green-60 tooltip">Scene information' +
            '<span class="tooltiptext">Scene information, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#introSceneInfo" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span><span class="ibm-textcolor-gray-40 ibm-small"> max 600 characters</span></div>' +
            '<div><textarea  spellcheck="true" id="usecase' + i + 'SceneInfo' + idValue + '" name="usecase' + i + 'SceneInfo' + idValue + '" rows="4" maxlength="600" placeholder="Enter scene information" class="usecaseFieldWidth"></textarea></div><p class="validationFontSize display-none" id="usecase' + i + 'SceneInfo' + idValue + 'Error">Scene information is required</p>' +

            '<div class="ibm-padding-top-1"><div for="IntroDesc" class="ibm-textcolor-green-60 tooltip">Scene description' +
            '<span class="tooltiptext">Scene description, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#introSceneDesc" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"></span><span class="ibm-textcolor-gray-40 ibm-small"> max 600 characters</span></div>' +

            '<span><textarea spellcheck="true" id="usecase' + i + 'SceneDesc' + idValue + '"  name="usecase' + i + 'SceneDesc' + idValue + '" rows="4" maxlength="600" placeholder="Enter scene description" class="usecaseFieldWidth"></textarea></span><p class="validationFontSize display-none" id="usecase' + i + 'SceneDesc' + idValue + 'Error">Scene Description is required</p>' +

            '<div class="ibm-padding-top-1"><div for="sceneTease" class="ibm-textcolor-green-60 tooltip">Scene tease' +
            '<span class="tooltiptext">Scene tease, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#introSceneTease" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required">*</span></div>' +
            '<span><input type="text" spellcheck="true" maxlength="60" id="usecase' + i + 'SceneTease' + idValue + '" name="usecase' + i + 'SceneTease' + idValue + '"  placeholder="Enter scene tease" class="usecaseFieldWidth"></span><p class="validationFontSize display-none" id="usecase' + i + 'SceneTease' + idValue + 'Error">Tease is required</p>' +

            '<div class="ibm-padding-top-1"><div for="sceneUrl" class="ibm-textcolor-green-60 tooltip">Requested scene URL name' +
            '<span class="tooltiptext">Requested scene URL name, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#introSceneUrlName" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required">*</span></div>' +

            '<span><input type="text" spellcheck="true" id="usecase' + i + 'SceneUrl' + idValue + '" maxlength="50" name="usecase' + i + 'SceneUrl' + idValue + '"  placeholder="Explain the next step description" class="usecaseFieldWidth"></span><p class="validationFontSize display-none" id="usecase' + i + 'SceneUrl' + idValue + 'Error">URL Name is required</p>' +

            '<label></label><div style="width:300px;display: inline-block;">' +
            '<div>' +

            '<div class="ibm-padding-top-1"><div for="sceneGraphicTitle" class="ibm-textcolor-green-60 tooltip">Scene graphic type' +
            '<span class="tooltiptext">Scene graphic type, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#introSceneGraphicType" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span></div>' +


            '</div>' +
            '<div class="fieldPaddingTop"><span class="ibm-input-group ibm-radio-group">' +
            '<span><input id="usecase' + i + 'graphicImage' + idValue + '" name="usecase' + i + 'graphicType' + idValue + '" type="radio" checked value="image" onclick="uploadSceneImage(this);" />' +
            '<label for="usecase' + i + 'graphicImage' + idValue + '" class="ibm-textcolor-green-60">Image</label>' +
            '</span> ' +
            '<span><input  id="usecase' + i + 'graphicAnimation' + idValue + '" name="usecase' + i + 'graphicType' + idValue + '" type="radio" value="animation" onclick="uploadSceneAnimation(this);"   />' +
            '<label for="usecase' + i + 'graphicAnimation' + idValue + '" class="ibm-textcolor-green-60">Animation</label>' +
            '</span>' +
            '<span><input  id="usecase' + i + 'graphicVideo' + idValue + '" name="usecase' + i + 'graphicType' + idValue + '" type="radio" value="video" onclick="uploadSceneVideo(this);" />' +
            '<label for="usecase' + i + 'graphicVideo' + idValue + '" class="ibm-textcolor-green-60">Video</label>' +
            '</span>' +
            '</span></div>' +
            '</div>' +

            '<div style="display: inline-block;">' +
            '<div id="usecase' + i + 'imageBrowse' + idValue + '" style="margin-left:180px;width:145px;">' +

            '<div class="ibm-padding-top-1">' +
            '<div for="sceneImage" class="ibm-textcolor-green-60 tooltip">Browse image' +
            '<span class="tooltiptext">Browse image, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#introSceneGraphic" target="_blank">Read more...</a></span>' +
            '</div>' +
            '<span class="ibm-required"> *</span>' +
            '</div>' +

            '<div class="fieldPaddingTop"><input id="usecase' + i + 'Scene' + idValue + 'Image" type="file" data-multiple="false" onchange="updateImageName(this)" accept="image/*" style="display:none;" /><label for="usecase' + i + 'Scene' + idValue + 'Image" class="btn ibm-center">Browse</label><span class="ibm-small floatLeft" id="usecase' + i + 'Scene' + idValue + 'ImageName"></span>' +
            '</div>' +
            '<span>' +
            '<img src="" id="usecase' + i + 'Scene' + idValue + 'Imageb64" style="display:none;"/>' +
            '</span>' +
            '<p class="validationFontSize display-none" id="usecase' + i + 'Scene' + idValue + 'ImageError">Image is required</p>' +
            '</div>' +

            '<div id="usecase' + i + 'animationBrowse' + idValue + '" class="display-none" style="margin-left:180px;width:145px;">' +

            '<div class="ibm-padding-top-1">' +
            '<div for="sceneImage" class="ibm-textcolor-green-60 tooltip">Browse animation' +
            '<span class="tooltiptext">Browse animation, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#introSceneGraphic" target="_blank">Read more...</a></span>' +
            '</div>' +
            '<span class="ibm-required"> *</span>' +
            '</div>' +

            '<div class="fieldPaddingTop"><input id="usecase' + i + 'Scene' + idValue + 'Animation" type="file" data-multiple="false" onchange="updateImageName(this)" accept="image/gif" style="display:none;" /><label for="usecase' + i + 'Scene' + idValue + 'Animation" class="btn ibm-center">Browse</label><span class="ibm-small floatLeft" id="usecase' + i + 'Scene' + idValue + 'AnimationName"></span>' +
            '</div>' +
            '<span>' +
            '<img src="" id="usecase' + i + 'Scene' + idValue + 'Animationb64" style="display:none;"/>' +
            '</span>' +
            '<p class="validationFontSize display-none" id="usecase' + i + 'Scene' + idValue + 'AnimationError">Animation is required</p>' +
            '</div>' +


            '<div id="usecase' + i + 'videoLink' + idValue + '" class="display-none" style="margin-left:5px;width:335px;">' +

            '<div class="ibm-padding-top-1"><div for="videoUrl" class="ibm-textcolor-green-60 tooltip">Video URL' +
            '<span class="tooltiptext">Video URL, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#introSceneGraphicVideoUrl" target="_blank">Read more...</a></span>' +
            '</div></div>' +
            '<div class="fieldPaddingTop"><input type="text" spellcheck="true" maxlength="50" value="" id="usecase' + i + 'Scene' + idValue + 'VideoLink" name="usecase' + i + 'Scene' + idValue + 'VideoLink" class="usecaseFieldWidth" placeholder="Enter video url"></div><p class="validationFontSize display-none" id="usecase' + i + 'Scene' + idValue + 'VideoLinkError" >Video URL is required</p>' +

            '</div>' +

            '</div>' +

            '<div class="paddingTop15"><div for="altText" class="ibm-textcolor-green-60 tooltip">Alt text' +
            '<span class="tooltiptext">Alt text, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#introSceneGraphicAltText" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span></div>' +

            '<div class="fieldPaddingTop"><input type="text" spellcheck="true" maxlength="50" value="" id="usecase' + i + 'AltText' + idValue + '" name="usecase' + i + 'AltText' + idValue + '" class="usecaseFieldWidth" placeholder="Enter alt text"></div><p class="validationFontSize display-none" id="usecase' + i + 'AltText' + idValue + 'Error">Alt Text is required</p>' +

            '<div class="ibm-padding-top-1"><div for="configureProductTitle" class="ibm-textcolor-green-60 tooltip"><span class="ibm-h4">Configure product links</span>' +
            '<span class="tooltiptext">Configure product links, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#introSceneConfigureLinks" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span></div>' +

            '<div>' +
            '<div>' +

            '<div class="ibm-padding-top-1" style="display: inline-block;"><div for="cta1" class="ibm-textcolor-green-60 tooltip">CTA 1' +
            '<span class="tooltiptext">This CTA should drive to a gated asset that collects leads, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#introSceneCta1" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span></div>' +

            '<div class="ibm-padding-top-1" style="display: inline-block;padding-left:278px;"><div for="URL1" class="ibm-textcolor-green-60 tooltip">URL' +
            '<span class="tooltiptext">URL, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#introSceneCtA1Url" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span></div>' +

            '</div>' +

            '<div>' +
            '<input style="display: inline-block;" maxlength="25" spellcheck="true" type="text" value="" id="usecase' + i + 'cta1' + idValue + '" name="usecase' + i + 'cta1' + idValue + '" class="usecaseCtaWidth" placeholder="Enter CTA name">' +
            '<input style="display: inline-block;margin-left:10px;" spellcheck="true" type="text" value="" size="55" id="usecase' + i + 'Url1' + idValue + '" name="usecase' + i + 'Url1' + idValue + '" class="usecaseUrlWidth"  placeholder="Enter URL">' +
            '<p class="ibm-external-link"' +
            'style="position: relative;color:grey;display: inline-block;margin-bottom:3px;"></p><span class="validationFontSize display-none"  id="usecase' + i + 'cta1' + idValue + 'Error">CTA is required</span><span class="validationFontSize display-none"  id="usecase' + i + 'Url1' + idValue + 'Error">URL is required</span>' +
            '</div>' +
            '<div class="ibm-padding-top-1">' +
            '<div>' +

            '<div style="display: inline-block;"><div for="cta2" class="ibm-textcolor-green-60 tooltip">CTA 2' +
            '<span class="tooltiptext">This CTA can drive to gated assets or "learn more"-type assets, like product briefs, blogs, or communities, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#introSceneCta2" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span></div>' +

            '<div style="display: inline-block;padding-left:278px;"><div for="URL2" class="ibm-textcolor-green-60 tooltip">URL' +
            '<span class="tooltiptext">URL, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#introSceneCta2Url" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span></div>' +

            '</div>' +
            '<input style="display: inline-block;" type="text" spellcheck="true" maxlength="25" value="" size="30" id="usecase' + i + 'cta2' + idValue + '" name="usecase' + i + 'Url1' + idValue + '" class="usecaseCtaWidth"  placeholder="Enter CTA name">' +
            '<input style="display: inline-block;margin-left:10px;" type="text" value="" size="55" id="usecase' + i + 'Url2' + idValue + '" name="usecase' + i + 'Url2' + idValue + '" class="usecaseUrlWidth"  placeholder="Enter URL">' +
            '<p class="ibm-external-link"' +
            'style="position: relative;color:grey;display: inline-block;margin-bottom:3px;"></p><span class="validationFontSize display-none"  id="usecase' + i + 'cta2' + idValue + 'Error">CTA is required</span><span class="validationFontSize display-none"  id="usecase' + i + 'Url2' + idValue + 'Error">URL is required</span>' +
            '</div>' +
            '</div>' +
            '</div>';
        } else {
          var idValue = j - 1;

          scenceDetails = scenceDetails + '<div id="scenceDetails' + k + '" class="ibm-tabs-content ' + displayblockScence + '">' +

            '<div for="sceneTitle" class="ibm-textcolor-green-60 tooltip">Scene title' +
            '<span class="tooltiptext">Scene title, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#sceneTitle" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span><span class="ibm-textcolor-gray-40 ibm-small"> max 60 characters</span>' +

            '<div><input type="text" maxlength="60" spellcheck="true" id="usecase' + i + 'SceneTitle' + idValue + '" name="usecase' + i + 'SceneTitle' + idValue + '" placeholder="Enter scene title" class="usecaseFieldWidth"></div><p class="validationFontSize display-none" id="usecase' + i + 'SceneTitle' + idValue + 'Error">Title is required</p>' +

            '<div class="ibm-padding-top-1"><div for="sceneInfo" class="ibm-textcolor-green-60 tooltip">Scene information' +
            '<span class="tooltiptext">Scene information, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#sceneInfo" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span><span class="ibm-textcolor-gray-40 ibm-small"> max 600 characters</span></div>' +

            '<span><textarea maxlength="600" spellcheck="true" id="usecase' + i + 'SceneInfo' + idValue + '" name="usecase' + i + 'SceneInfo' + idValue + '" rows="4" placeholder="Enter scene information" class="usecaseFieldWidth"></textarea></span><p class="validationFontSize display-none" id="usecase' + i + 'SceneInfo' + idValue + 'Error">Scene Information is required</p>' +

            '<div class="ibm-padding-top-1"><div for="sceneDesc" class="ibm-textcolor-green-60 tooltip">Scene description' +
            '<span class="tooltiptext">Scene description, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#sceneDesc" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> </span><span class="ibm-textcolor-gray-40 ibm-small"> max 600 characters</span></div>' +

            '<span><textarea spellcheck="true" maxlength="600" id="usecase' + i + 'SceneDesc' + idValue + '" name="usecase' + i + 'SceneDesc' + idValue + '" rows="4" placeholder="Enter scene description" class="usecaseFieldWidth"></textarea></span><p class="validationFontSize display-none" id="usecase' + i + 'SceneDesc' + idValue + 'Error"></p>' +


            '<div class="ibm-padding-top-1"><div for="sceneTease" class="ibm-textcolor-green-60 tooltip">Scene tease' +
            '<span class="tooltiptext">Scene tease, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#sceneTease" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required">*</span></div>' +
            '<span><input type="text" spellcheck="true" maxlength="60" id="usecase' + i + 'SceneTease' + idValue + '" name="usecase' + i + 'SceneTease' + idValue + '"  placeholder="Enter scene tease" class="usecaseFieldWidth"></span><p class="validationFontSize display-none" id="usecase' + i + 'SceneTease' + idValue + 'Error">Tease is required</p>' +

            '<div class="ibm-padding-top-1"><div for="sceneUrl" class="ibm-textcolor-green-60 tooltip">Requested scene URL name' +
            '<span class="tooltiptext">Requested scene URL name, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#sceneUrlName" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required">*</span></div>' +

            '<span><input spellcheck="true" maxlength="50" type="text" id="usecase' + i + 'SceneUrl' + idValue + '" name="usecase' + i + 'SceneUrl' + idValue + '"  placeholder="Explain the next step description" class="usecaseFieldWidth"></span><p class="validationFontSize display-none" id="usecase' + i + 'SceneUrl' + idValue + 'Error">URL Name is required</p>' +

            '<label></label><div style="width:300px;display: inline-block;">' +
            '<div>' +
            '<div class="ibm-padding-top-1"><div for="sceneGraphicTitle" class="ibm-textcolor-green-60 tooltip">Scene graphic type' +
            '<span class="tooltiptext">Scene graphic type, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#sceneGraphicType" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span></div>' +
            '</div>' +
            '<div class="fieldPaddingTop"><span class="ibm-input-group ibm-radio-group">' +
            '<span><input id="usecase' + i + 'graphicImage' + idValue + '" name="usecase' + i + 'graphicType' + idValue + '" type="radio" checked value="image" onclick="uploadSceneImage(this);" />' +
            '<label for="usecase' + i + 'graphicImage' + idValue + '" class="ibm-textcolor-green-60">Image</label>' +
            '</span> ' +
            '<span><input  id="usecase' + i + 'graphicAnimation' + idValue + '" name="usecase' + i + 'graphicType' + idValue + '" type="radio" value="animation" onclick="uploadSceneAnimation(this);" />' +
            '<label for="usecase' + i + 'graphicAnimation' + idValue + '" class="ibm-textcolor-green-60">Animation</label>' +
            '</span>' +
            '<span><input  id="usecase' + i + 'graphicVideo' + idValue + '" name="usecase' + i + 'graphicType' + idValue + '" type="radio" value="video" onclick="uploadSceneVideo(this);" />' +
            '<label for="usecase' + i + 'graphicVideo' + idValue + '" class="ibm-textcolor-green-60">Video</label>' +
            '</span>' +
            '</span></div>' +
            '</div>' +

            '<div style="display: inline-block;">' +
            '<div id="usecase' + i + 'imageBrowse' + idValue + '" style="margin-left:180px;width:145px;">' +

            '<div class="ibm-padding-top-1">' +
            '<div for="sceneImage" class="ibm-textcolor-green-60 tooltip">Browse image' +
            '<span class="tooltiptext">Browse image, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#sceneGraphic" target="_blank">Read more...</a></span>' +
            '</div>' +
            '<span class="ibm-required"> *</span>' +
            '</div>' +

            '<div class="fieldPaddingTop"><input id="usecase' + i + 'Scene' + idValue + 'Image" type="file" data-multiple="false" onchange="updateImageName(this)" accept="image/*" style="display:none;" /><label for="usecase' + i + 'Scene' + idValue + 'Image" class="btn ibm-center">Browse</label><span class="ibm-small floatLeft" id="usecase' + i + 'Scene' + idValue + 'ImageName"></span>' +
            '</div>' +
            '<span>' +
            '<img src="" id="usecase' + i + 'Scene' + idValue + 'Imageb64" style="display:none;"/>' +
            '</span>' +
            '<p class="validationFontSize display-none" id="usecase' + i + 'Scene' + idValue + 'ImageError">Image is required</p>' +
            '</div>' +

            '<div id="usecase' + i + 'animationBrowse' + idValue + '" class="display-none" style="margin-left:180px;width:145px;">' +

            '<div class="ibm-padding-top-1">' +
            '<div for="sceneImage" class="ibm-textcolor-green-60 tooltip">Browse animation' +
            '<span class="tooltiptext">Browse animation, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#sceneGraphic" target="_blank">Read more...</a></span>' +
            '</div>' +
            '<span class="ibm-required"> *</span>' +
            '</div>' +

            '<div class="fieldPaddingTop"><input id="usecase' + i + 'Scene' + idValue + 'Animation" type="file" data-multiple="false" onchange="updateImageName(this)" accept="image/gif" style="display:none;" /><label for="usecase' + i + 'Scene' + idValue + 'Animation" class="btn ibm-center">Browse</label><span class="ibm-small floatLeft" id="usecase' + i + 'Scene' + idValue + 'AnimationName"></span>' +
            '</div>' +
            '<span>' +
            '<img src="" id="usecase' + i + 'Scene' + idValue + 'Animationb64" style="display:none;"/>' +
            '</span>' +
            '<p class="validationFontSize display-none" id="usecase' + i + 'Scene' + idValue + 'AnimationError">Animation is required</p>' +
            '</div>' +


            '<div id="usecase' + i + 'videoLink' + idValue + '" class="display-none" style="margin-left:5px;width:335px;">' +

            '<div class="ibm-padding-top-1"><div for="videoUrl" class="ibm-textcolor-green-60 tooltip">Video URL' +
            '<span class="tooltiptext">Video URL, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#sceneGraphicVideoUrl" target="_blank">Read more...</a></span>' +
            '</div></div>' +
            '<div class="fieldPaddingTop"><input type="text" spellcheck="true" maxlength="50" value="" id="usecase' + i + 'Scene' + idValue + 'VideoLink" name="usecase' + i + 'Scene' + idValue + 'VideoLink" class="usecaseFieldWidth" placeholder="Enter video url"></div><p class="validationFontSize display-none" id="usecase' + i + 'Scene' + idValue + 'VideoLinkError">Video URL is required</p>' +

            '</div>' +

            '</div>' +

            '<div class="fieldPaddingTop"><div for="altText" class="ibm-textcolor-green-60 tooltip">Alt text' +
            '<span class="tooltiptext">Alt text, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#sceneGraphicAltText" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span></div>' +
            '<div class="fieldPaddingTop"><input type="text" spellcheck="true" value="" id="usecase' + i + 'AltText' + idValue + '" name="usecase' + i + 'AltText' + idValue + '" placeholder="Enter alt text" class="usecaseFieldWidth"></div><p class="validationFontSize display-none" id="usecase' + i + 'AltText' + idValue + 'Error">Alt Text is required</p>' +

            '<div class="ibm-padding-top-1"><div for="configureProductTitle" class="ibm-textcolor-green-60 tooltip"><span class="ibm-h4">Configure product links</span>' +
            '<span class="tooltiptext">Configure product links, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#sceneConfigureLinks" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span></div>' +

            '<div>' +
            '<div>' +

            '<div class="ibm-padding-top-1" style="display: inline-block;"><div for="cta1" class="ibm-textcolor-green-60 tooltip">CTA 1' +
            '<span class="tooltiptext">This CTA should drive to a gated asset that collects leads, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#sceneCta1" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span></div>' +

            '<div class="ibm-padding-top-1" style="display: inline-block;padding-left:278px;"><div for="URL1" class="ibm-textcolor-green-60 tooltip">URL' +
            '<span class="tooltiptext">URL, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#sceneCtA1Url" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span></div>' +

            '</div>' +
            '<div>' +
            '<input style="display: inline-block;" type="text" spellcheck="true" maxlength="25" value="" class="usecaseCtaWidth" id="usecase' + i + 'cta1' + idValue + '" name="usecase' + i + 'cta1' + idValue + '" placeholder="Enter CTA name">' +
            '<input style="display: inline-block;margin-left:10px;" type="text" value="" class="usecaseUrlWidth" id="usecase' + i + 'Url1' + idValue + '" name="usecase' + i + 'Url1' + idValue + '" placeholder="Enter URL">' +
            '<p class="ibm-external-link"' +
            'style="position: relative;color:grey;display: inline-block;margin-bottom:3px;"></p><span class="validationFontSize display-none"  id="usecase' + i + 'cta1' + idValue + 'Error">CTA is required</span><span class="validationFontSize display-none"  id="usecase' + i + 'Url1' + idValue + 'Error">Video URL is required</span>' +
            '</div>' +
            '<div class="ibm-padding-top-1">' +
            '<div>' +

            '<div style="display: inline-block;"><div for="cta2" class="ibm-textcolor-green-60 tooltip">CTA 2' +
            '<span class="tooltiptext">This CTA can drive to gated assets or "learn more"-type assets, like product briefs, blogs, or communities, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#sceneCta2" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span></div>' +

            '<div style="display: inline-block;padding-left:278px;"><div for="URL2" class="ibm-textcolor-green-60 tooltip">URL' +
            '<span class="tooltiptext">URL, <a style="color:white;" href="https://github.ibm.com/dwedge/demo-container-planning/blob/master/guidance.md#sceneCta2Url" target="_blank">Read more...</a></span>' +
            '</div><span class="ibm-required"> *</span></div>' +


            '</div>' +
            '<input style="display: inline-block;" type="text" value="" spellcheck="true" maxlength="25" class="usecaseCtaWidth" id="usecase' + i + 'cta2' + idValue + '" name="usecase' + i + 'Url1' + idValue + '" placeholder="Enter CTA name">' +
            '<input style="display: inline-block;margin-left:10px;" type="text" value="" class="usecaseUrlWidth" id="usecase' + i + 'Url2' + idValue + '" name="usecase' + i + 'Url2' + idValue + '"  placeholder="Enter URL">' +
            '<p class="ibm-external-link"' +
            'style="position: relative;color:grey;display: inline-block;"></p><span class="validationFontSize display-none"  id="usecase' + i + 'cta2' + idValue + 'Error">CTA is required</span><span class="validationFontSize display-none"  id="usecase' + i + 'Url2' + idValue + 'Error">URL is required</span>' +
            '</div>' +
            '</div>' +
            '</div>';
        }
      }

    var oneScene = preFields + scence;
    allScence = allScence + oneScene
    finalScence = finalScence + allScence;
    allScenceDetails = allScenceDetails + scenceDetails;
  }

  jQuery("#usecaseDiv").append(usecasesDiv);
  jQuery("#usecases").append(usecasesValues);
  jQuery('#usecase1 a').attr("aria-selected", "true");
  jQuery("#usecasedetails").append(usecasedetails);
  jQuery("#scence").append(finalScence);
  jQuery("#scenceDetails").append(allScenceDetails);

  if (actionFlow == 'edit' || actionFlow == 'add') {
    var resp = fetchDocByIdAndLang(document_id);
    if (JSON.parse(resp.body).attachments != undefined) {
      for (var i = 0; i < JSON.parse(resp.body).attachments.length; i++) {
        caasAttachments.push(JSON.parse(resp.body).attachments[i].file.split('.')[0]);
      }
    }
    var useCaseSceneDetails = fetchDocContentAll(document_id);
    var useCaseSceneArr = JSON.parse(useCaseSceneDetails.body);
    for (var i = 0; i < landingPageData.useCases.length; i++) {
      for (var j = 0; j < useCaseSceneArr.length; j++) {
        if (useCaseSceneArr[j].file == landingPageData.useCases[i].useCaseTitle.replaceAll(' ', '-').toLowerCase() + '.json') {
          var sceneArr = JSON.parse(useCaseSceneArr[j].content).useCaseScenes;
          for (var sceneCount = 0; sceneCount < sceneArr.length; sceneCount++) {
            populateCaasDataToUseCase(sceneArr[sceneCount], sceneCount, (i + 1));
          }
        }
      }
    }

    for (var j = 0; j < useCaseSceneArr.length; j++) {
      if (useCaseSceneArr[j].file == 'exit-page.json') {
        var scene = JSON.parse(useCaseSceneArr[j].content);
        let exitPageUrl = scene.exitPageURL;
        exitPageUrl = exitPageUrl.replace("/", "");
        jQuery('#exitTitle').val(scene.tagline);
        jQuery('#exitAltText').val(scene.graphicAltText);
        jQuery('#backgroundImageAlt').val(scene.backgroundImageAltText);
        jQuery('#exitPageUrl').val(exitPageUrl);

        jQuery('#exitcta').val(scene.primaryCTATitle);
        jQuery('#exitUrl').val(scene.primaryCTAUrl);
        if (scene.backgroundImage != undefined) {
          jQuery('#exitPageBImageName').html(scene.backgroundImage.split('/')[1]);
        }
        if (scene.graphicType == 'image' && scene.graphicLink != undefined) {
          jQuery('#exitPageGraphicImageName').html(scene.graphicLink.split('/')[1]);
        } else if (scene.graphicType == 'video' && scene.graphicLink != undefined) {
          jQuery("input[id='exitGraphicVideo']:radio").attr('checked', true);
          jQuery('#exitVideoUrlLink').removeClass('display-none');
          jQuery('#exitPageImage').addClass('display-none');
          jQuery('#exitVideoUrl').val(scene.graphicLink);
        }
        if (scene.offerCases != undefined) {
          scene.offerCases.forEach(function (item, index) {
            let cards = "<div class='ibm-card cardFormat' style='margin:10px;'><div class='ibm-card__content' id='exitOfferCard" + (index + 1) + "' style='height:250px;word-wrap: break-word; overflow: hidden; text-overflow: ellipsis;'>" +
              "<h4 class='ibm-h4' id ='exitOfferCardTitle" + (index + 1) + "'>" + item.nextStep + "</h4><h6 class='ibm-h6 ibm-textcolor-gray-50' id='exitOfferCardDesc" + (index + 1) + "'>" + item.nextStepDescription + "</h6>" +
              "<p class='cardUrlName' hidden id='exitOfferCardLink" + (index + 1) + "'>" + item.nextStepLinkText + "</p><p class='cardUrlLink' hidden id='exitOfferCardLinkURL" + (index + 1) + "'>" + item.nextStepLinkUrl + "</p>" +
              "<p class='cardUrlExternal' hidden id='exitOfferIsLinkExternal" + (index + 1) + "'>" + item.nextStepIsExternalLink + "</p>" +
              "<p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a id ='exitOfferEdit" + (index + 1) + "' class='ibm-edit-link tipso_style' onclick='cardEdit(this); IBMCore.common.widget.overlay.show(\"overlayOffer\"); return false;' href='' role='button' >Edit UseCase</a>" +
              "</p><p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a class='ibm-close-link' id='deleteOffer" + (index + 1) + "' onclick='deleteOffer(this);' role='button' >Delete UseCase</a></p></div></div></div>";
            jQuery("#exitPageCard" + (index + 1)).html(cards);
          });
        }
        break;
      }
    }
  }

  jQuery("#usecases li").click(function () {
    var clickedLiId = jQuery(this).attr("id");
    for (var i = 1; i <= usecaseSize + 1; i++) {
      if (i == clickedLiId.substr(7)) {
        jQuery('#usecasedetails' + i).removeClass('display-none');
        jQuery('#scence' + i).removeClass('display-none');
        jQuery('#scence'+i).children().find('a').attr("aria-selected", "false");
        jQuery('#scence'+i).children().find('a').eq(0).attr("aria-selected", "true");
        if (i == usecaseSize + 1) {
          jQuery('#exitPagedetails' + i).removeClass('display-none');
          jQuery('#horizLine').addClass('display-none');
        } else {
          jQuery('#horizLine').removeClass('display-none');
        }

        //display scene info based on usecase click
        var n = 1;
        if (i == 1) {
          n = 1;
        } else {
          for (m = 0; m < i - 1; m++) {
            n = n + Number(landingPageData.useCases[m].useCaseScene) + 2;
          }
        }
        for (a = 1; a <= k; a++) {
          if (a == n) {
            jQuery('#scenceDetails' + a).removeClass('display-none').addClass('display-block');
          } else {
            jQuery('#scenceDetails' + a).removeClass('display-block').addClass('display-none');
          }
        }
        //end
      } else {
        jQuery('#usecasedetails' + i).addClass('display-none');

        jQuery('#scence' + i).addClass('display-none');
        if (i == usecaseSize + 1) {
          jQuery('#exitPagedetails' + i).addClass('display-none');
        }
      }
    }
  });

  jQuery("#scence ul li").click(function () {
    var clickedUlLiId = jQuery(this).attr("id");
    for (var i = 1; i <= k; i++) {
      if (i == clickedUlLiId.substr(9)) {
        jQuery('#scenceDetails' + i).removeClass('display-none').addClass('display-block');
      } else {
        jQuery('#scenceDetails' + i).removeClass('display-block').addClass('display-none');
      }

    }
  });

  //tab selection
  jQuery('#usecases li a').on('click', function (e) {

    e.preventDefault();
    jQuery(this).parent().parent().find('a').attr("aria-selected", "false");
    jQuery(this).attr("aria-selected", "true");
    jQuery('#usecase1').attr("aria-selected", "true");
  });

  //left navigation tab

  jQuery('#scence ul li a').on('click', function (e) {

    e.preventDefault();
    jQuery(this).parent().parent().find('a').attr("aria-selected", "false");
    let IDSelector = jQuery(this).attr('href');
    jQuery(this).attr("aria-selected", "true");
    jQuery(IDSelector).show();
  });

  //  exit overlay fields click
  jQuery('#offerTitle').click(function () {
    jQuery("#offerTitle").addClass('background-white');
  });
  jQuery('#offerDesc').click(function () {
    jQuery("#offerDesc").addClass('background-white');
  });
  jQuery('#offerURL').click(function () {
    jQuery("#offerURL").addClass('background-white');
  });

  jQuery('input').change(function () {
    fieldValuesChanged = true;
    dataSaved = false;
  });
  jQuery('textarea').change(function () {
    fieldValuesChanged = true;
    dataSaved = false;
  });
}

function previousPage() {

  if (JSON.parse(sessionStorage.getItem('firstPageData')).action != 'add') {
    window.location.href = '/edit?prdId=' + JSON.parse(sessionStorage.getItem('firstPageData')).prdId;
  } else {
    window.location.href = '/add';
  }

}

function imageSize(e) {
  return new Promise((resolve, reject) => {
    var _URL = window.URL || window.webkitURL;
    var file, img;
    if ((file = e[0].files[0])) {
      img = new Image();
      var objectUrl = _URL.createObjectURL(file);
      img.onload = function (err) {
        resolve({
          width: this.width,
          height: this.height,
          id: e
        });
        _URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    }
  });
}

async function uploadProductToCaas(state) {

  jQuery('#ucLoadingIndicator').removeClass('display-none');
  jQuery('.buttonusecaseGeneral').attr('disabled', true);

  setTimeout(async function () {
    var usecases = landingPageData.useCases;
    let docId = encodeURIComponent(landingPageData.offeringName.trim().replaceAll(' ', '-').toLowerCase());
    landingPageData['status'] = state;
    var data = createDocumentJson(landingPageData);

    var resp = createDocument(data, docId);
    checkRespStatus(resp);
    if (landingPageData.startPageBg != undefined) {
      resp = uploadImage(landingPageData.startPageBg, 'startPageBg', docId);
      checkRespStatus(resp);
    }

    for (var i = 0; i < landingPageData.useCases.length; i++) {
      if (landingPageData['useCaseBImg' + i] != undefined) {
        var resp = uploadImage(landingPageData['useCaseBImg' + i], 'useCase' + (i + 1) + 'Card', docId);
        checkRespStatus(resp);
      }
    }
    for (var i = 0; i < usecases.length; i++) {
      var useCasesSceneArr = [];
      for (var j = 0; j < (parseInt(usecases[i].useCaseScene) + 1); j++) {
        var useCaseScene = {
          sceneTitle: jQuery('#usecase' + (i + 1) + 'SceneTitle' + j).val(),
          sceneURL: '/' + jQuery('#usecase' + (i + 1) + 'SceneUrl' + j).val(),
          sceneInformation: jQuery('#usecase' + (i + 1) + 'SceneInfo' + j).val(),
          sceneDescription: jQuery('#usecase' + (i + 1) + 'SceneDesc' + j).val(),
          sceneTease: jQuery('#usecase' + (i + 1) + 'SceneTease' + j).val(),
          scenePrimaryCTATitle: jQuery('#usecase' + (i + 1) + 'cta1' + j).val(),
          sceneSecondaryCTATitle: jQuery('#usecase' + (i + 1) + 'cta2' + j).val(),
          scenePrimaryCTAUrl: jQuery('#usecase' + (i + 1) + 'Url1' + j).val(),
          sceneSecondaryCTAUrl: jQuery('#usecase' + (i + 1) + 'Url2' + j).val(),
          sceneGraphicType: jQuery("input[name=usecase" + (i + 1) + "graphicType" + j + "]:checked").val(),
          sceneGraphicAltText: jQuery('#usecase' + (i + 1) + 'AltText' + j).val()
        }
        var k = i + 1;
        var graphicType = jQuery('input[name="usecase' + k + 'graphicType' + j + '"]:checked').val();
        if (j == 0) {
          if (graphicType == 'image' && jQuery('#usecase' + (i + 1) + 'Scene' + j + 'Image')[0].files.length != 0) {
            if (jQuery('#usecase' + (i + 1) + 'Scene' + j + 'Image')[0].files.lenght != 0) {
              var base64Data = await renderImage(jQuery('#usecase' + (i + 1) + 'Scene' + j + 'Image'));
              var imageType = base64Data.image.substring("data:image/".length, base64Data.image.indexOf(";base64"));
              useCaseScene['sceneGraphicLink'] = "_attachments/useCase" + (i + 1) + "IntroSceneImage." + imageType;
              var resp = uploadImage(base64Data.image, 'useCase' + (i + 1) + 'IntroSceneImage', docId);
              checkRespStatus(resp);
            }
          } else if (graphicType == 'animation' && jQuery('#usecase' + (i + 1) + 'Scene' + j + 'Animation')[0].files.length != 0) {
            var base64Data = await renderImage(jQuery('#usecase' + (i + 1) + 'Scene' + j + 'Animation'));
            var imageType = base64Data.image.substring("data:image/".length, base64Data.image.indexOf(";base64"));
            useCaseScene['sceneGraphicLink'] = "_attachments/useCase" + (i + 1) + "IntroSceneAnimation." + imageType;
            var resp = uploadImage(base64Data.image, 'useCase' + (i + 1) + 'IntroSceneAnimation', docId);
            checkRespStatus(resp);
          } else if (graphicType == 'video' && jQuery('#usecase' + (i + 1) + 'Scene' + j + 'VideoLink').val() != '') {
            useCaseScene['sceneGraphicLink'] = jQuery('#usecase' + (i + 1) + 'Scene' + j + 'VideoLink').val();
          } else if (graphicType == 'image' && caasAttachments.includes('_attachments/useCase' + k + 'IntroSceneImage')) {
            var imageName = jQuery('#usecase' + k + 'Scene' + j + 'ImageName').text();
            useCaseScene['sceneGraphicLink'] = '_attachments/useCase' + k + 'IntroSceneImage.' + imageName.split('.')[1];
          } else if (graphicType == 'animation' && caasAttachments.includes('_attachments/useCase' + k + 'IntroSceneAnimation')) {
            var animationName = jQuery('#usecase' + k + 'Scene' + j + 'AnimationName').text();
            useCaseScene['sceneGraphicLink'] = '_attachments/useCase' + k + 'IntroSceneAnimation.' + animationName.split('.')[1];
          } else {
            useCaseScene['sceneGraphicLink'] = '';
          }
        } else {
          if (graphicType == 'image' && jQuery('#usecase' + (i + 1) + 'Scene' + j + 'Image')[0].files.length != 0) {
            var base64Data = await renderImage(jQuery('#usecase' + (i + 1) + 'Scene' + j + 'Image'));
            var imageType = base64Data.image.substring("data:image/".length, base64Data.image.indexOf(";base64"));
            useCaseScene['sceneGraphicLink'] = "_attachments/useCase" + (i + 1) + "Scene" + j + "Image." + imageType
            var resp = uploadImage(base64Data.image, 'useCase' + (i + 1) + 'Scene' + j + 'Image', docId);
            checkRespStatus(resp);
          } else if (graphicType == 'animation' && jQuery('#usecase' + (i + 1) + 'Scene' + j + 'Animation')[0].files.length != 0) {
            var base64Data = await renderImage(jQuery('#usecase' + (i + 1) + 'Scene' + j + 'Animation'));
            var imageType = base64Data.image.substring("data:image/".length, base64Data.image.indexOf(";base64"));
            useCaseScene['sceneGraphicLink'] = "_attachments/useCase" + (i + 1) + "Scene" + j + "Animation." + imageType
            var resp = uploadImage(base64Data.image, 'useCase' + (i + 1) + 'Scene' + j + 'Animation', docId);
            checkRespStatus(resp);

          } else if (graphicType == 'video' && jQuery('#usecase' + (i + 1) + 'Scene' + j + 'VideoLink').val() != '') {
            useCaseScene['sceneGraphicLink'] = jQuery('#usecase' + (i + 1) + 'Scene' + j + 'VideoLink').val();

          } else if (graphicType == 'image' && caasAttachments.includes('_attachments/useCase' + k + 'Scene' + j + 'Image')) {
            var imageName = jQuery('#usecase' + k + 'Scene' + j + 'ImageName').text();
            useCaseScene['sceneGraphicLink'] = '_attachments/useCase' + k + 'Scene' + j + 'Image.' + imageName.split('.')[1];
          } else if (graphicType == 'animation' && caasAttachments.includes('_attachments/useCase' + k + 'Scene' + j + 'Animation')) {
            var animationName = jQuery('#usecase' + k + 'Scene' + j + 'AnimationName').text();
            useCaseScene['sceneGraphicLink'] = '_attachments/useCase' + k + 'Scene' + j + 'Animation.' + animationName.split('.')[1];
          } else {
            useCaseScene['sceneGraphicLink'] = '';
          }
        }
        useCasesSceneArr.push(useCaseScene);
      }
      var useCaseScenes = {
        useCaseScenes: useCasesSceneArr
      }
      let file = encodeURIComponent(landingPageData.useCases[i].useCaseTitle.replaceAll(' ', '-').toLowerCase());
      var resp = updateDocumentFile(useCaseScenes, docId, file);
      checkRespStatus(resp);
    }

    var exitPage = {
      tagline: jQuery('#exitTitle').val(),
      backgroundImageAltText: jQuery('#backgroundImageAlt').val(),
      primaryCTATitle: jQuery('#exitcta').val(),
      primaryCTAUrl: jQuery('#exitUrl').val(),
      graphicType: jQuery("input[name='exitSelect']:checked").val(),
      exitPageURL: '/' + jQuery('#exitPageUrl').val(),
      graphicAltText: jQuery('#exitAltText').val(),
      demoCompletionMessage: "You've completed the demo",
      learnMoreText: "Learn more",
      startOverLinkTxt: "Start over"
    }

    var k = i + 1;
    var exitGraphicType = jQuery('input[name="exitSelect"]:checked').val();
    if (exitGraphicType == 'image' && jQuery('#exitPageGraphicImage')[0].files.length != 0) {
      var base64Data = await renderImage(jQuery('#exitPageGraphicImage'));
      var graphicType = base64Data.image.substring("data:image/".length, base64Data.image.indexOf(";base64"));
      var resp = uploadImage(base64Data.image, 'exitPageMediaImage', docId);
      checkRespStatus(resp);
      exitPage['graphicLink'] = "_attachments/exitPageMediaImage." + graphicType;
    } else if (exitGraphicType == 'video' && jQuery('#exitVideoUrl').val() != '') {
      exitPage['graphicLink'] = jQuery('#exitVideoUrl').val();
    } else if (exitGraphicType == 'image' && caasAttachments.includes('_attachments/exitPageMediaImage')) {
      var imageName = jQuery('#exitPageGraphicImageName').text();
      exitPage['graphicLink'] = '_attachments/exitPageMediaImage.' + imageName.split('.')[1];
    } else {
      exitPage['graphicLink'] = '';
    }

    if (jQuery('#exitPageBImage')[0].files.length != 0) {
      base64Data = await renderImage(jQuery('#exitPageBImage'));
      var bImageType = base64Data.image.substring("data:image/".length, base64Data.image.indexOf(";base64"));
      var resp = uploadImage(base64Data.image, 'exitPageBg', docId);
      checkRespStatus(resp);
      exitPage['backgroundImage'] = "_attachments/exitPageBg." + bImageType;
    } else if (caasAttachments.includes('_attachments/exitPageBg')) {
      var imageName = jQuery('#exitPageBImageName').text();
      exitPage['backgroundImage'] = '_attachments/exitPageBg.' + imageName.split('.')[1];
    } else {
      exitPage['backgroundImage'] = '';
    }

    var offerCasesArr = [];
    for (var i = 1; i < 4; i++) {
      if (jQuery('#exitOfferCardTitle' + i).html() != undefined) {
        var offerCase = {
          nextStep: jQuery('#exitOfferCardTitle' + i).html(),
          nextStepDescription: jQuery('#exitOfferCardDesc' + i).html(),
          nextStepIsExternalLink: jQuery('#exitOfferIsLinkExternal' + i).html(),
          nextStepLinkText: jQuery('#exitOfferCardLink' + i).html(),
          nextStepLinkUrl: jQuery('#exitOfferCardLinkURL' + i).html()
        }
        offerCasesArr.push(offerCase);
      }
    }

    exitPage['offerCases'] = offerCasesArr;
    var resp = updateDocumentFile(exitPage, docId, 'exit-page');
    checkRespStatus(resp);

    dataSaved = true;
    fieldValuesChanged = false;
    jQuery('#ucLoadingIndicator').addClass('display-none');
    jQuery('.buttonusecaseGeneral').removeAttr('disabled');
    IBMCore.common.widget.overlay.show("confirmationOverlay");
    jQuery("#overlayMsg").empty().append("Data upload is successful");
  }, 100);

}

function createDocumentJson(sessionData) {
  let tempData = JSON.parse(JSON.stringify(sessionData));;
  delete tempData['startPageBg'];
  for (var i = 0; i < landingPageData.useCases.length; i++) {
    delete tempData['useCaseBImg' + i];
  }
  var loggedInUser = loadUserPrivilege()
  tempData['updatedBy'] = loggedInUser.userEmailId.toLowerCase();
  return tempData;
}

function getPreviousPageDetails() {

  var url = ""
  if (actionFlow == 'edit') {
    if (fieldValuesChanged == true && dataSaved == false) {
      alert(USECASE_SAVE_DATA_MESSAGE);
      return;
    }
    url = '/' + actionFlow + '?productName=' + document_id;
  } else {
    if (fieldValuesChanged == true && dataSaved == false) {
      alert(USECASE_SAVE_DATA_MESSAGE);
      return;
    }
    url = '/' + actionFlow;
  }
  showProdListPage(url);
}

function validateField(id) {
  let value = jQuery("#" + id).val();
  if (value == "") {
    jQuery('#' + id).addClass('redBorder');
    jQuery('#' + id + 'Error').removeClass('display-none');
    jQuery('#' + id + 'Error').addClass('display-block');
    formValidation = false;

    if (id.includes("usecase")) {
      var val = id.slice(7, 8);
      jQuery('#Usecase' + val).addClass('redColorTxt');
    } else {
      jQuery('#exitTab').addClass('redColorTxt');
    }
  }
}

function validateOffer(id) {
  let value = jQuery("#" + id).text();
  if (value == "") {
    formValidation = false;
    jQuery('#exitTab').addClass('redColorTxt');
    jQuery('#offerVal').removeClass('display-none');
    jQuery('#offerVal').empty().append("Enter all offer details");
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
      if (id.includes("usecase")) {
        var val = id.slice(7, 8);
        jQuery('#Usecase' + val).addClass('redColorTxt');
      } else {
        jQuery('#exitTab').addClass('redColorTxt');
      }
    }
  }
}

function is_relative_url(id) {
  let value = jQuery("#" + id).val();
  if (value !== "") {
    var filter = /^[a-zA-Z0-9]*$/;
    if (!filter.test(value)) {
      jQuery('#' + id).addClass('redBorder');
      jQuery('#' + id + 'Error').removeClass('display-none');
      jQuery('#' + id + 'Error').addClass('display-block');
      jQuery('#' + id + 'Error').empty().append("Enter valid URL");
      formValidation = false;
      if (id.includes("usecase")) {
        var val = id.slice(7, 8);
        jQuery('#Usecase' + val).addClass('redColorTxt');
      } else {
        jQuery('#exitTab').addClass('redColorTxt');
      }
    }
  }
}


function validateLanding() {
  jQuery('#ucValError').addClass("display-none");
  jQuery('#ucCardError').addClass('display-none');
  jQuery('#minUCError').addClass('display-none');
  jQuery('#invalidUrl').addClass('display-none');

  var landingPage = JSON.parse(sessionStorage.getItem('firstPageData'));
  if (landingPage.productTitle == "") {
    jQuery('#landingPageErrors').empty().append('<p class="validationFontSize no-padding">Please fill in all required fields</p>');
    formValidation = false;
  }
  if (landingPage.offeringName == "") {
    jQuery('#landingPageErrors').empty().append('<p class="validationFontSize no-padding">Please fill in all required fields</p>');
    formValidation = false;
  }
  if (landingPage.titleHelpText == "") {
    jQuery('#landingPageErrors').empty().append('<p class="validationFontSize no-padding">Please fill in all required fields</p>');
    formValidation = false;
  }
  if (landingPage.exitTourURL == "") {
    jQuery('#landingPageErrors').empty().append('<p class="validationFontSize no-padding">Please fill in all required fields</p>');
    formValidation = false;
  }
  let productUrl = landingPage.exitTourURL;
  if (productUrl !== "") {
    var filter = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    if (!filter.test(productUrl)) {
      jQuery('#invalidUrl').empty().append('<p class="validationFontSize no-padding">Invalid URL</p>');
      jQuery('#invalidUrl').removeClass('display-none');
    }
  }
  if (landingPage.shareEmailSubject == "") {
    jQuery('#landingPageErrors').empty().append('<p class="validationFontSize no-padding">Please fill in all required fields</p>');
    formValidation = false;
  }
  if (landingPage.shareEmailMessage == "") {
    jQuery('#landingPageErrors').empty().append('<p class="validationFontSize no-padding">Please fill in all required fields</p>');
    formValidation = false;
  }
  if (landingPage.shareLinkedinMessage == "") {
    jQuery('#landingPageErrors').empty().append('<p class="validationFontSize no-padding">Please fill in all required fields</p>');
    formValidation = false;
  }
  if (landingPage.shareLinkedinHashTag == "") {
    jQuery('#landingPageErrors').empty().append('<p class="validationFontSize no-padding">Please fill in all required fields</p>');
    formValidation = false;
  }
  if (landingPage.shareTwitterMessage == "") {
    jQuery('#landingPageErrors').empty().append('<p class="validationFontSize no-padding">Please fill in all required fields</p>');
    formValidation = false;
  }
  if (landingPage.shareTwitterHashTag == "") {
    jQuery('#landingPageErrors').empty().append('<p class="validationFontSize no-padding">Please fill in all required fields</p>');
    formValidation = false;
  }
  if (landingPage.productOwnerName == "") {
    jQuery('#landingPageErrors').empty().append('<p class="validationFontSize no-padding">Please fill in all required fields</p>');
    formValidation = false;
  }
  if (jQuery("input[name='useCaseSelect']:checked").val() == 'multi') {
    if (landingPage.backgroundImageAltText == "") {
      jQuery('#landingPageErrors').empty().append('<p class="validationFontSize no-padding">Please fill in all required fields</p>');
      formValidation = false;
    }
    if (landingPage.useCases.length < 2) {
      jQuery('#minUCError').empty().append('<p class="validationFontSize no-padding">Minimum 2 usecases are required</p>');
      jQuery('#minUCError').removeClass('display-none');
      formValidation = false;
    }
  }
    for (var i = 0; i <= (landingPage.useCases.length) - 1; i++) {
      let url = landingPageData.useCases[i].useCaseURL;
      validateUC(landingPageData.useCases[i].useCaseTitle);
      validateUC(landingPageData.useCases[i].useCaseDescription);
      validateUC(landingPageData.useCases[i].useCaseLinkText);
      validateUC(url);
      if (jQuery("input[name='useCaseSelect']:checked").val() == 'multi') {
        validateUC(landingPageData.useCases[i].useCaseImage);
        validateUC(landingPageData.useCases[i].useCaseImageAltText);
      }

      if (url !== "") {
        url = url.replace("/", "");
        let filter = /^[a-zA-Z0-9-]*$/;
        if (!filter.test(url)) {
          jQuery('#ucValError').removeClass("display-none");
          jQuery('#ucValError').empty().append("Invalid usecase url name");
          formValidation = false;
        }
      }
    }
  if (jQuery("input[name='useCaseSelect']:checked").val() == 'single') {
    if (landingPage.useCases.length < 1) {
      jQuery('#landingPageErrors').append('<p class="validationFontSize no-padding">Minimum 1 usecase is required</p>');
      formValidation = false;
    }
  }
}

function validateUC(value) {
  if (value == "") {
    formValidation = false;
    jQuery('#ucCardError').removeClass('display-none');
    jQuery('#ucCardError').empty().append("Enter all usecase card details");
  }
}

function resetValidation(id) {
  jQuery('#' + id).removeClass('redBorder');
  jQuery('#' + id + 'Error').removeClass('display-block');
  jQuery('#' + id + 'Error').addClass('display-none');
  formValidation = true;
  if (id.includes("usecase")) {
    var val = id.slice(7, 8);
    jQuery('#Usecase' + val).removeClass('redColorTxt');
  } else {
    jQuery('#exitTab').removeClass('redColorTxt');
  }
}

function validateUsecases() {
  formValidation = true;
  var usecases = JSON.parse(sessionStorage.getItem('firstPageData')).useCases;
  var usecaseSize = usecases.length;

  resetValidation('exitTitle');
  resetValidation('exitAltText');
  resetValidation('exitPageBImage');
  resetValidation('exitPageUrl');
  resetValidation('backgroundImageAlt');
  resetValidation('exitcta');
  resetValidation('exitUrl');
  resetValidation('exitVideoUrl');
  resetValidation('offer');
  jQuery('#offerVal').addClass('display-none');
  jQuery('#offerVal').empty();
  jQuery('#offerValError').addClass('display-none');
  jQuery('#offerValError').empty();

  for (var j = 1; j <= usecaseSize; j++) {
    resetValidation('usecase' + j + 'SceneTitle0');
    resetValidation('usecase' + j + 'SceneInfo0');
    resetValidation('usecase' + j + 'SceneDesc0');
    resetValidation('usecase' + j + 'SceneUrl0');
    resetValidation('usecase' + j + 'Scene0Image');
    resetValidation('usecase' + j + 'Scene0Animation');
    resetValidation('usecase' + j + 'Scene0VideoLink');
    resetValidation('usecase' + j + 'SceneTease0');
    resetValidation('usecase' + j + 'AltText0');
    resetValidation('usecase' + j + 'cta10');
    resetValidation('usecase' + j + 'Url10');
    resetValidation('usecase' + j + 'cta20');
    resetValidation('usecase' + j + 'Url20');
  }

  for (var i = 1; i <= usecaseSize; i++) {
    for (var k = 1; k <= usecases[i - 1].useCaseScene; k++) {
      resetValidation('usecase' + i + 'SceneTitle' + k);
      resetValidation('usecase' + i + 'SceneInfo' + k);
      resetValidation('usecase' + i + 'SceneDesc' + k);
      resetValidation('usecase' + i + 'SceneUrl' + k);
      resetValidation('usecase' + i + 'Scene' + k + 'Image');
      resetValidation('usecase' + i + 'Scene' + k + 'Animation');
      resetValidation('usecase' + i + 'Scene' + k + 'VideoLink');
      resetValidation('usecase' + i + 'SceneTease' + k);
      resetValidation('usecase' + i + 'AltText' + k);
      resetValidation('usecase' + i + 'cta1' + k);
      resetValidation('usecase' + i + 'Url1' + k);
      resetValidation('usecase' + i + 'cta2' + k);
      resetValidation('usecase' + i + 'Url2' + k);
    }
  }
  validateLanding();
  validateField('exitTitle');
  validateField('exitAltText');
  if (!caasAttachments.includes('_attachments/exitPageBg')) {
    validateField('exitPageBImage');
  }
  validateField('exitPageUrl');
  is_relative_url('exitPageUrl');
  validateField('backgroundImageAlt');
  validateField('exitcta');
  validateField('exitUrl');
  is_valid_url('exitUrl');
  if (jQuery("input[name='exitSelect']:checked").val() == 'video') {
    is_valid_url('exitVideoUrl');
  }
  var ucCount = 0;
  for (var i = 1; i <= 4; i++) {
    if ((jQuery('#exitOfferCardTitle' + i).length) >= 1) {
      ucCount = ucCount + 1;
    }
  }
  if (ucCount < 1) {
    jQuery("#offerError").removeClass("display-none");
    formValidation = false;
  }
  for (var i = 1; i <= ucCount; i++) {
    let linkName = jQuery('#exitOfferCardLink' + i).text();
    let offerURL = jQuery('#exitOfferCardLinkURL' + i).text();
    validateOffer('exitOfferCardTitle' + i)
    validateOffer('exitOfferCardDesc' + i)
    validateOffer('exitOfferCardLink' + i)
    validateOffer('exitOfferCardLinkURL' + i)

    if (offerURL !== "") {
      var filter = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
      if (!filter.test(offerURL)) {
        jQuery('#offerValError').append("Invalid offer " + i + " URL </br>");
        formValidation = false;
        jQuery('#offerValError').removeClass("display-none");
        jQuery('#exitTab').addClass('redColorTxt');

      }
    }
  }

  for (var j = 1; j <= usecaseSize; j++) {
    validateField('usecase' + j + 'SceneTitle0');
    validateField('usecase' + j + 'SceneInfo0');
    validateField('usecase' + j + 'SceneUrl0');
    is_relative_url('usecase' + j + 'SceneUrl0');
    validateField('usecase' + j + 'SceneTease0');
    validateField('usecase' + j + 'AltText0');
    validateField('usecase' + j + 'cta10');
    validateField('usecase' + j + 'Url10');
    is_valid_url('usecase' + j + 'Url10');
    validateField('usecase' + j + 'cta20');
    validateField('usecase' + j + 'Url20');
    is_valid_url('usecase' + j + 'Url20');
    let descCount = jQuery('#usecase' + j + 'SceneDesc0').val().length;
    let infoCount = jQuery('#usecase' + j + 'SceneInfo0').val().length;
    let total = descCount + infoCount;
    if (total > 600) {
      jQuery('#usecase' + j + 'SceneDesc0Error').addClass("display-block");
      jQuery('#usecase' + j + 'SceneDesc0Error').empty().append("Scene Info and Description exceeds 600 characters");
      formValidation = false;
    }
    if (jQuery("input[name='usecase" + j + "graphicType0']:checked").val() == 'video') {
      validateField('usecase' + j + 'Scene0VideoLink');
      is_valid_url('usecase' + j + 'Scene0VideoLink');
    }
    if (jQuery("input[name='usecase" + j + "graphicType0']:checked").val() == 'animation' && !caasAttachments.includes('_attachments/useCase' + j + 'IntroSceneAnimation')) {
      validateField('usecase' + j + 'Scene0Animation');
    }
    if (jQuery("input[name='usecase" + j + "graphicType0']:checked").val() == 'image' && !caasAttachments.includes('_attachments/useCase' + j + 'IntroSceneImage')) {
      validateField('usecase' + j + 'Scene0Image');
    }
  }
  for (var i = 1; i <= usecaseSize; i++) {
    for (var k = 1; k <= usecases[i - 1].useCaseScene; k++) {
      validateField('usecase' + i + 'SceneTitle' + k);
      validateField('usecase' + i + 'SceneInfo' + k);
      validateField('usecase' + i + 'SceneUrl' + k);
      is_relative_url('usecase' + i + 'SceneUrl' + k);
      if (jQuery("input[name='usecase" + i + "graphicType" + k + "']:checked").val() == 'video') {
        validateField('usecase' + i + 'Scene' + k + 'VideoLink');
        is_valid_url('usecase' + i + 'Scene' + k + 'VideoLink');
      }
      if (jQuery("input[name='usecase" + i + "graphicType" + k + "']:checked").val() == 'animation' && !caasAttachments.includes('_attachments/useCase' + i + 'Scene' + k + 'Animation')) {
        validateField('usecase' + i + 'Scene' + k + 'Animation');
      }
      if (jQuery("input[name='usecase" + i + "graphicType" + k + "']:checked").val() == 'image' && !caasAttachments.includes('_attachments/useCase' + i + 'Scene' + k + 'Image')) {
        validateField('usecase' + i + 'Scene' + k + 'Image');
      }
      validateField('usecase' + i + 'SceneTease' + k);
      validateField('usecase' + i + 'AltText' + k);
      validateField('usecase' + i + 'cta1' + k);
      validateField('usecase' + i + 'Url1' + k);
      validateField('usecase' + i + 'cta2' + k);
      validateField('usecase' + i + 'Url2' + k);
      let ucDescCount = jQuery('#usecase' + i + 'SceneDesc' + k).val().length;
      let ucInfoCount = jQuery('#usecase' + i + 'SceneInfo' + k).val().length;
      let ucTotal = ucDescCount + ucInfoCount;
      if (ucTotal > 600) {
        jQuery('#usecase' + i + 'SceneDesc' + k + 'Error').addClass("display-block");
        jQuery('#usecase' + i + 'SceneDesc' + k + 'Error').empty().append("Scene Info and Description exceeds 600 characters");
        formValidation = false;
      }
    }
  }
  if (formValidation) {
    uploadProductToCaas('Ready for review');
    jQuery('#overlayOk').click(function () {
      window.location.href = '/';
    });
  }
}


function populateCaasDataToUseCase(scene, sceneNo, usecase) {

  let sceneUrl = scene.sceneURL;
  sceneUrl = sceneUrl.replace("/", "");
  jQuery('#usecase' + usecase + 'SceneTitle' + sceneNo).val(scene.sceneTitle);
  jQuery('#usecase' + usecase + 'SceneInfo' + sceneNo).val(scene.sceneInformation);
  jQuery('#usecase' + usecase + 'SceneDesc' + sceneNo).val(scene.sceneDescription);
  jQuery('#usecase' + usecase + 'SceneTease' + sceneNo).val(scene.sceneTease);
  jQuery('#usecase' + usecase + 'SceneUrl' + sceneNo).val(sceneUrl);
  jQuery('#usecase' + usecase + 'AltText' + sceneNo).val(scene.sceneGraphicAltText);
  jQuery('#usecase' + usecase + 'cta1' + sceneNo).val(scene.scenePrimaryCTATitle);
  jQuery('#usecase' + usecase + 'cta2' + sceneNo).val(scene.sceneSecondaryCTATitle);
  jQuery('#usecase' + usecase + 'Url1' + sceneNo).val(scene.scenePrimaryCTAUrl);
  jQuery('#usecase' + usecase + 'Url2' + sceneNo).val(scene.sceneSecondaryCTAUrl);
  if (scene.sceneGraphicType == 'image' && scene.sceneGraphicLink != undefined) {
    jQuery('#usecase' + usecase + 'Scene' + sceneNo + 'ImageName').html(scene.sceneGraphicLink.split('/')[1]);
  } else if (scene.sceneGraphicType == 'animation' && scene.sceneGraphicLink != undefined) {
    jQuery('#usecase' + usecase + 'Scene' + sceneNo + 'AnimationName').html(scene.sceneGraphicLink.split('/')[1]);
    var idValue = 'usecase' + usecase + 'graphicAnimation' + sceneNo;
    jQuery("input[id='" + idValue + "']:radio").attr('checked', true);
    jQuery('#usecase' + usecase + 'imageBrowse' + sceneNo).addClass('display-none');
    jQuery('#usecase' + usecase + 'videoLink' + sceneNo).addClass('display-none');
    jQuery('#usecase' + usecase + 'animationBrowse' + sceneNo).removeClass('display-none');
  } else if (scene.sceneGraphicType == 'video' && scene.sceneGraphicLink != undefined) {
    var idValue = 'usecase' + usecase + 'graphicVideo' + sceneNo;
    jQuery("input[id='" + idValue + "']:radio").attr('checked', true);
    jQuery('#usecase' + usecase + 'imageBrowse' + sceneNo).addClass('display-none');
    jQuery('#usecase' + usecase + 'videoLink' + sceneNo).removeClass('display-none');
    jQuery('#usecase' + usecase + 'animationBrowse' + sceneNo).addClass('display-none');
    jQuery('#usecase' + usecase + 'Scene' + sceneNo + 'VideoLink').val(scene.sceneGraphicLink);
  }
}

function saveDraft() {

  var landingPage = JSON.parse(sessionStorage.getItem('firstPageData'));
  if (landingPage.offeringName == "") {
    jQuery('#landingPageErrors').empty().append('<p class="validationFontSize no-padding">Offering Name is required to Save</p>');
    window.location.href = '#';
  } else {
    uploadProductToCaas('Draft');
  }
}

function showViewer() {
  let landingPage = JSON.parse(sessionStorage.getItem('firstPageData'));
  let productName = landingPage.offeringName.trim().replaceAll(' ', '-').toLowerCase();
  if (productName != "") {
    let url = SHOWCASE_DEMO_URL.replace("{product}", productName);
    window.open(url);
  } else {
    IBMCore.common.widget.overlay.show("confirmationOverlay");
    jQuery("#overlayMsg").empty().append("Offering name is required to preview");
  }

}

function offerUsecase()
{
	jQuery("#offerLink").removeClass("display-none");
	jQuery("#offerUrl").addClass("display-none");
}

function offerLink()
{
	jQuery("#offerUrl").removeClass("display-none");
	jQuery("#offerLink").addClass("display-none");
}
