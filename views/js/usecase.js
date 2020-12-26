/*jshint esversion: 6 */
var cookieValue = readCookie();

jQuery(document).ready(function ($) {

  var landingPageData = JSON.parse(sessionStorage.getItem('firstPageData'));
  var prdid = landingPageData.action == 'edit' ? landingPageData.prdId : '1593414667329';

  jQuery.ajax({
    type: "POST",
    url: "/cloudant/fetchById",
    data: JSON.stringify({ productId: prdid }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization':'Bearer ' +  cookieValue,
    },
    success: function (result) {
      generateUsecaseView(JSON.parse(result), landingPageData);
    },
    error: function (e) {
      alert("There was some internal error while fetching data from db")
    }
  });
});

function prepareOffer() { 
  let title = jQuery("#offerTitle").val();
  let description = jQuery("#offerDesc").val();
  let url = jQuery("#offerURL").val();
  let usecaseSave=jQuery('#overlaySave').parent().parent()
  

  let usecaseTileId = jQuery('#overlaySave').attr('data-offer-name');
  //let usecaseId = jQuery('#overlaySave').attr('data-offer');
  let usecaseId=usecaseTileId.charAt(7);
  let tileId=usecaseTileId.charAt(12);
  var formValidation = true;
  var usecaseTitleValue = usecaseTileId + 'Title';
  var usecaseURLValue = usecaseTileId + 'URL';
  if (title == "") {
    jQuery("#offerTitle").attr('style', 'background: rgba(255,0,0,.2);');
    formValidation = false;
  }
  if (jQuery("#offerTitle").val().length > 30) {
    jQuery("#overlayTitleError").empty().append('Offer Title is more than 30 characters');
    jQuery("#overlayTitleError").removeClass('display-none');
    formValidation = false;
  }
  if (jQuery("#offerTitle").val().length <= 30)
  {
	  jQuery("#overlayTitleError").addClass('display-none');
  }
  if (description == "") {
    jQuery("#offerDesc").attr('style', 'background: rgba(255,0,0,.2);');
    formValidation = false;
  }
  if (jQuery("#offerDesc").val().length > 150) {
    jQuery("#overlayDescError").empty().append('Offer Description is more than 150 characters');
    jQuery("#overlayDescError").removeClass('display-none');
    formValidation = false;
  }
  if (jQuery("#offerDesc").val().length <= 150)
  {
	  jQuery("#overlayDescError").addClass('display-none');
  }
  if (url == "") {
    jQuery("#offerURL").attr('style', 'background: rgba(255,0,0,.2);');
    jQuery("#overlayUrlError").removeClass('display-none');
    formValidation = false;
  }
  else if (is_valid_url(jQuery("#offerURL").val())) {
    jQuery("#overlayUrlError").addClass('display-none');

    jQuery("#offerURL").attr('style', 'background: none');

  } else {

    jQuery("#overlayUrlError").removeClass('display-none');
    jQuery("#overlayUrlError").empty().append('Offer URL is invalid');
    formValidation = false;
  }



  if (formValidation) {
    //let cards = "<div class='ibm-card cardFormat' style='margin:10px;'><div class='ibm-card__content' id='" + usecaseTileId + "' style='height:250px;word-wrap: break-word; overflow: hidden; text-overflow: ellipsis;'><h4 class='ibm-h4 offerh4" + usecaseId + "' id ='" + usecaseTitleValue + "'>" + title + "</h4><h6 class='ibm-h6 ibm-textcolor-gray-50' id='" + usecaseTileId + "Desc'>" + description + "</h6><p class='cardUrl' hidden id='" + usecaseURLValue + "'>" + url + "</p><p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a id ='edit" + usecaseId + "' class='ibm-edit-link tipso_style' onclick='cardEdit(this); IBMCore.common.widget.overlay.show(\"overlayExampleAlert\"); return false;' href='' role='button' >Edit UseCase</a></p></div></div></div>";
    let cards = "<div class='ibm-card cardFormat' style='margin:10px;'><div class='ibm-card__content' id='" + usecaseTileId + "' style='height:250px;word-wrap: break-word; overflow: hidden; text-overflow: ellipsis;'><h4 class='ibm-h4 offerh4" + usecaseId + "' id ='" + usecaseTitleValue + "'>" + title + "</h4><h6 class='ibm-h6 ibm-textcolor-gray-50' id='" + usecaseTileId + "Desc'>" + description + "</h6><p class='cardUrl' hidden id='" + usecaseURLValue + "'>" + url + "</p><p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a id ='edit" + usecaseId + "' class='ibm-edit-link tipso_style' onclick='cardEdit(this); IBMCore.common.widget.overlay.show(\"overlayExampleAlert\"); return false;' href='' role='button' >Edit UseCase</a></p><p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a class='ibm-close-link' onclick='deleteOffer(this);' role='button' >Delete UseCase</a></p></div></div></div>";
   //jQuery(".ibm-col-12-3:eq(" + usecaseId + ")").html(cards);
    jQuery(".usecase"+usecaseId+"offerTile"+tileId+"").html(cards);
    jQuery("#offerTitle").val('');
    jQuery("#offerDesc").val('');
    jQuery("#offerURL").val('');
    IBMCore.common.widget.overlay.hide('overlayExampleAlert', true);
  }
};

function deleteOffer(e) {
  let dataoffername = jQuery(e).parent().parent().attr('id');
  //let usecase=dataoffername.slice(5,4);
  let usecase = dataoffername.charAt(7);
  let offerId = jQuery(e).parent().parent().parent().parent().index();
  let offerNo = offerId;  
  if (usecase === "2") {
    offerNo = offerNo + 4;
  }
  else if (usecase === "3") {
    offerNo = offerNo + 8;
  }
  else if (usecase === "4") {    
    offerNo = offerNo + 12;
  }  

  jQuery(e).parent().parent().parent().parent().html('<a id="offer' + offerNo++ + '" name="' + dataoffername + '" onclick="formOverlayVal(this);IBMCore.common.widget.overlay.show(\'overlayExampleAlert\'); return false;"><div class="add-usecase">Add offer ' + (offerId + 1) + ' details + </div></a>');
}

function cardEdit(e) {

  //jQuery('.offerTileNo').html(jQuery(e).parent().parent().parent().parent().index());
  let tileID = e.id.replace(/[^\d]+/, '');
  let dataoffername = jQuery(e).parent().parent().attr('id');
  jQuery('#overlaySave').attr('data-offer', tileID);
  jQuery('#overlaySave').attr('data-offer-name', dataoffername);
  let title = jQuery(e).parent().parent().find("h4").html();
  let desc = jQuery(e).parent().parent().find("h6").html();
  let url = jQuery(e).parent().parent().find(".cardUrl").html();

  jQuery("#offerTitle").val(title);
  jQuery("#offerDesc").val(desc);
  jQuery("#offerURL").val(url);

}


function formOverlayVal(e) {
  jQuery("#offerTitle").val('');
  jQuery("#offerDesc").val('');
  jQuery("#offerURL").val('');
  let usecaseTileId = e.id.substring(5);
  let usecaseTileName = e.name;
  jQuery('#overlaySave').attr('data-offer', usecaseTileId);
  jQuery('#overlaySave').attr('data-offer-name', usecaseTileName);
}

function doIt(e) {
  jQuery('#' + e.target.id).removeClass('ibm-field-error');


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
      jQuery('.usecase' + i + 'offerTile' + j).html('<a id="offer' + offerId++ + '" name="usecase' + i + 'Tile' + j + '" href="" onclick="formOverlayVal(this);IBMCore.common.widget.overlay.show(\'overlayExampleAlert\'); return false;"><div class="add-usecase">Add offer ' + j + ' details + </div></a>');
    }
  }
  removeformError();
}

function removeformError() {


  var usecases = JSON.parse(sessionStorage.getItem('firstPageData')).useCases;
  var usecaseSize = usecases.length;
  var counts = 0;

  for (var j = 1; j <= usecaseSize; j++) {
	  jQuery("#uc"+j).attr('style', '');
	  jQuery("[name='intro"+j+"']").removeClass('ibm-caution-link ibm-textcolor-red-50');
	  jQuery("[name='exit"+j+"']").removeClass('ibm-caution-link ibm-textcolor-red-50');

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
    jQuery("#exitOverlayError" + j).css({ "display": "none" });

  }

  for (var i = 1; i <= usecaseSize; i++) {
    for (var j = 1; j <= usecases[i - 1].scene; j++) {
    	
    	jQuery("[name='uc"+i+"scene"+j+"']").removeClass('ibm-caution-link ibm-textcolor-red-50');

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
	  jQuery('#' + idis + 'b64').css({"width":"130px","height":"130px", "padding-top":"10px"});
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
      jQuery("[name='exit"+i+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+i).attr('style', 'color:red;');
      formValidation = false;
    }
    else {
      jQuery("#exitOverlayError").css({
        "display": "none"
      });
    }
    counts = 0;
  }

  for (var j = 1; j <= usecaseSize; j++) {
	  
    if (jQuery("#usecase" + j + "InTroImageb64").attr('src') == "") {

      jQuery("#usecase" + j + "IntroBackImage").removeClass('display-none');
      jQuery("[name='intro"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    } 
    if (jQuery("#usecase" + j + "IntroStepInfo").val() == "") {
      jQuery("#usecase" + j + "IntroStepInfo").addClass('ibm-field-error');
      jQuery("[name='intro"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "IntroStepInfo").val().length > 50) {
      jQuery("#usecase" + j + "IntroStepInfo").addClass('ibm-field-error');
      jQuery("#introStepInfoError" + j).empty().append('Step Information is more than 50 characters');
      jQuery("#introStepInfoError" + j).removeClass('display-none');
      jQuery("[name='intro"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "IntroStepTitle").val() == "") {
      jQuery("#usecase" + j + "IntroStepTitle").addClass('ibm-field-error');
      jQuery("[name='intro"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "IntroStepTitle").val().length > 60) {
      jQuery("#usecase" + j + "IntroStepTitle").addClass('ibm-field-error');
      jQuery("#introSceneTitleError" + j).empty().append('Step Title is more than 60 characters');
      jQuery("[name='intro"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#introSceneTitleError" + j).removeClass('display-none');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "IntroSceneInfo").val() == "") {
      jQuery("#usecase" + j + "IntroSceneInfo").addClass('ibm-field-error');
      jQuery("[name='intro"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "IntroSceneInfo").val().length > 300) {
      jQuery("#usecase" + j + "IntroSceneInfo").addClass('ibm-field-error');
      jQuery("#introSceneInfoError" + j).empty().append('Scene Information is more than 300 characters');
      jQuery("#introSceneInfoError" + j).removeClass('display-none');
      jQuery("[name='intro"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "InroSceneDesc").val() == "") {
      jQuery("#usecase" + j + "InroSceneDesc").addClass('ibm-field-error');
      jQuery("[name='intro"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "InroSceneDesc").val().length > 300) {
      jQuery("#usecase" + j + "InroSceneDesc").addClass('ibm-field-error');
      jQuery("#introSceneDescError" + j).empty().append('Scene Description is more than 300 characters');
      jQuery("#introSceneDescError" + j).removeClass('display-none');
      jQuery("[name='intro"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "InroNextStep").val() == "") {
      jQuery("#usecase" + j + "InroNextStep").addClass('ibm-field-error');
      jQuery("[name='intro"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "InroNextStep").val().length > 60) {
      jQuery("#usecase" + j + "InroNextStep").addClass('ibm-field-error');
      jQuery("#introNextError" + j).empty().append('Next Step is more than 60 characters');
      jQuery("#introNextError" + j).removeClass('display-none');
      jQuery("[name='intro"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "ExitSubTitle").val() == "") {
      jQuery("#usecase" + j + "ExitSubTitle").addClass('ibm-field-error');
      jQuery("[name='exit"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "ExitSubTitle").val().length > 60) {
      jQuery("#usecase" + j + "ExitSubTitle").addClass('ibm-field-error');
      jQuery("#taglineError" + j).empty().append('Tagline is more than 60 characters');
      jQuery("#taglineError" + j).removeClass('display-none');
      jQuery("[name='exit"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    }
	
    if (jQuery("#usecase" + j + "ExitImageb64").attr('src') == "") {
      jQuery("#usecase" + j + "ExitBackImage").removeClass('display-none');
      jQuery("[name='exit"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    } 

    if (jQuery("#usecase" + j + "ExitUcURL").val() == "") {
      jQuery("#usecase" + j + "ExitUcURL").addClass('ibm-field-error');
      jQuery("[name='exit"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    }
    if (jQuery("#usecase" + j + "ExitUcURL").val().length > 40) {
      jQuery("#usecase" + j + "ExitUcURL").addClass('ibm-field-error');
      jQuery("#exitWhereError" + j).empty().append('Is more than 40 characters');
      jQuery("#exitWhereError" + j).removeClass('display-none');
      jQuery("[name='exit"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
      jQuery("#uc"+j).attr('style', 'color:red;');
      formValidation = false;
    }
  }
  for (var i = 1; i <= usecaseSize; i++) {
    for (var j = 1; j <= usecases[i - 1].scene; j++) {
	  if (jQuery("#usecase" + i + "Scene" + j + "Imageb64").attr('src') == "") {
        jQuery("#usecase" + i + "SceneBackImage" + j).removeClass('display-none');
        jQuery("[name='uc"+i+"scene"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc"+i).attr('style', 'color:red;');
        formValidation = false;
      } 

      if (jQuery("#usecase" + i + "stepInfo" + j).val() == "") {
        jQuery("#usecase" + i + "stepInfo" + j).addClass('ibm-field-error');
        jQuery("[name='uc"+i+"scene"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc"+i).attr('style', 'color:red;');
        formValidation = false;
      }
      if (jQuery("#usecase" + i + "stepInfo" + j).val().length > 50) {
        jQuery("#usecase" + i + "stepInfo" + j).addClass('ibm-field-error');
        jQuery("#usecase" + i + "stepInfoError" + j).empty().append('Step Information is more than 50 characters');
        jQuery("#usecase" + i + "stepInfoError" + j).removeClass('display-none');
        jQuery("[name='uc"+i+"scene"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc"+i).attr('style', 'color:red;');
        formValidation = false;
      }
      if (jQuery("#usecase" + i + "sceneTitle" + j).val() == "") {
        jQuery("#usecase" + i + "sceneTitle" + j).addClass('ibm-field-error');
        jQuery("[name='uc"+i+"scene"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc"+i).attr('style', 'color:red;');
        formValidation = false;
      }
      if (jQuery("#usecase" + i + "sceneTitle" + j).val().length > 60) {
        jQuery("#usecase" + i + "sceneTitle" + j).addClass('ibm-field-error');
        jQuery("#usecase" + i + "sceneTitleError" + j).empty().append('Scene Title is more than 60 characters');
        jQuery("#usecase" + i + "sceneTitleError" + j).removeClass('display-none');
        jQuery("[name='uc"+i+"scene"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc"+i).attr('style', 'color:red;');
        formValidation = false;
      }
      if (jQuery("#usecase" + i + "sceneInfo" + j).val() == "") {
        jQuery("#usecase" + i + "sceneInfo" + j).addClass('ibm-field-error');
        jQuery("[name='uc"+i+"scene"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc"+i).attr('style', 'color:red;');
        formValidation = false;
      }
      if (jQuery("#usecase" + i + "sceneInfo" + j).val().length > 300) {
        jQuery("#usecase" + i + "sceneInfo" + j).addClass('ibm-field-error');
        jQuery("#usecase" + i + "sceneInfoError" + j).empty().append('Scene Information is more than 300 characters');
        jQuery("#usecase" + i + "sceneInfoError" + j).removeClass('display-none');
        jQuery("[name='uc"+i+"scene"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc"+i).attr('style', 'color:red;');
        formValidation = false;
      }

      if (jQuery("#usecase" + i + "SceneDesc" + j).val().length > 300) {
        jQuery("#usecase" + i + "SceneDesc" + j).addClass('ibm-field-error');
        jQuery("#usecase" + i + "SceneDescError" + j).empty().append('Scene Description is more than 300 characters');
        jQuery("#usecase" + i + "SceneDescError" + j).removeClass('display-none');
        jQuery("[name='uc"+i+"scene"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc"+i).attr('style', 'color:red;');
        formValidation = false;
      }
      if (jQuery("#usecase" + i + "NextStep" + j).val() == "") {
        jQuery("#usecase" + i + "NextStep" + j).addClass('ibm-field-error');
        jQuery("[name='uc"+i+"scene"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc"+i).attr('style', 'color:red;');
        formValidation = false;
      }
      if (jQuery("#usecase" + i + "NextStep" + j).val().length > 60) {
        jQuery("#usecase" + i + "NextStep" + j).addClass('ibm-field-error');
        jQuery("#usecase" + i + "NextStepError" + j).empty().append('Next Step more than 60 characters');
        jQuery("#usecase" + i + "NextStepError" + j).removeClass('display-none');
        jQuery("[name='uc"+i+"scene"+j+"']").addClass('ibm-caution-link ibm-textcolor-red-50');
        jQuery("#uc"+i).attr('style', 'color:red;');
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
      "sceneInfo": { "para": jQuery('#usecase' + (i + 1) + 'IntroSceneInfo').val() },
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
        "sceneInfo": { "para": jQuery('#usecase' + (i + 1) + 'sceneInfo' + (j + 1) + '').val() },
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
    data: JSON.stringify(jsonData
    ),
    headers: {
      'Content-Type': 'application/json',
      'Authorization':'Bearer ' +  cookieValue,
    },
    success: function (result) {
      jQuery('#loadingIndicator').attr('style', 'display:none;');
      if (result.statusCode != 201) {
        alert('There was an error - '+ result.message);
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
      alert('There was an error while adding data please try again later');
      sessionStorage.clear();
      window.close();
    }
  });
}


function generateUsecaseView(usecaseData, landingPageData) {

  jQuery('#loadigText').attr('style', 'display:none;');
  jQuery('#loadingIndicator').attr('style', 'display:none;');

  jQuery("#footerButtons").css("display", "block");

  var docValue = usecaseData.description;
  var usecaseSize = landingPageData.useCases.length;
  var usecasesValues = '';
  var usecasedetails = '';
  var scence = '';
  var allScence = '';
  var allScenceDetails = '';
  var k = 0;
  var l = 0;
  var offerId = 0;
  var editId = 0;

  var usecasesDiv = '<div class=" ibm-text-tabs" id="tabs">' +
    '<ul id="usecases" role="tablist" class="ibm-tabs" aria-label="Tab navigation"></ul>' +
    '</div>';
  for (var i = 1; i <= usecaseSize; i++) {
    l++;
    var displayblock = '';
    if (i != 1) {
      displayblock = 'style="display:none"';
    }
    usecasesValues = usecasesValues + '<li role="presentation" id="usecase' + i + '"><a role="tab" id="uc'+i+'" href="#">Usecase ' + i + '</a></li>';
    usecasedetails = usecasedetails + '<div class="ibm-fluid" id="usecasedetails' + i + '" ' + displayblock + '><div class="ibm-col-12-12"><label for="ucTitle" class="ibm-textcolor-green-60">Use Case Title<span class="ibm-required">*</span></label>' +
      '<span><input type="text" value="' + landingPageData.useCases[i - 1].title + '" size="40" id="ucTitleValue' + i + '" name="ucTitle' + i + '" required disabled></span></p></div>' +
      '<div class="ibm-col-12-12"><label for="uc1Desc" class="ibm-textcolor-green-60">Use Case Description<span class="ibm-required">*</span></label>' +
      '<span><textarea value="" rows="4" cols="50" id="ucDescValue' + i + '" name="ucDesc' + i + '" required disabled>' + landingPageData.useCases[i - 1].desc + '</textarea></span></div></div>';

    var scence = '';
    var preFields = '<ul class="ibm-tabs" role="tablist" id="scence' + i + '" ' + displayblock + '>' +
      '<li id="eachScene' + l + '"><a aria-selected="true" role="tab" href="#introTab" name="intro'+i+'">Intro Page</a></li>';
    var finalScence = '';
    for (var j = 1; j <= Number(landingPageData.useCases[i - 1].scene); j++) {
      l++;
      scence = scence + '<li id="eachScene' + l + '"><a role="tab" href="#uc1Scene1" name="uc'+i+'scene'+j+'">Scene ' + j + '</a></li>';
    }

    l++;
    var postFields = '<li id="eachScene' + l + '"><a role="tab" href="#uc1SceneExit" name="exit'+i+'">Exit Page</a></li></ul>';
    var noOfScence = Number(landingPageData.useCases[i - 1].scene) + 2;
    var scenceDetails = '';

    for (var j = 1; j <= noOfScence; j++) {
      var displayblockScence = 'style="display:block"';
      if (k != 0) {
        displayblockScence = 'style="display:none"';
      }
      k++;
      if (j == noOfScence) {

        var tagline = '', render = '', exitImageSrcValue = '';
        if (docValue.useCases[i - 1] != undefined) {
		      var exitImageCloudantId = "usecase"+i+"ExitImage";		  
		      exitImageSrcValue = 'data:image/jpeg;base64,' + usecaseData._attachments[exitImageCloudantId].data;
          tagline = docValue.useCases[i - 1].exitPage.tagline;
          render = docValue.useCases[i - 1].exitPage.render;
        }
		//check the value of usecaseData._attachments[exitImageCloudantId] for undefined...
		
		var exitStyleValue ='';
		if(exitImageSrcValue != ''){
			
			exitStyleValue = 'width:130px;height:130px; padding-top: 10px;';
		}
		//style="width:130px;height:130px; padding-top: 10px;"

        scenceDetails = scenceDetails + '<div id="scenceDetails' + k + '" class="ibm-tabs-content"' + displayblockScence + '>' +

          '<label for="subTitle" class="ibm-textcolor-green-60">Tagline<span class="ibm-required">*</span><span class="ibm-textcolor-gray-40 ibm-small"> max 60 characters</span></label>' +
          '<span><input type="text" value="' + tagline + '" size="70" id="usecase' + i + 'ExitSubTitle" name="usecase' + i + 'ExitSubTitle" required></span><p class="redColorTxt display-none" id="taglineError' + i + '"></p></p>' +

          '<label for="exitImage" class="ibm-textcolor-green-60">Exit Page Background Image<span class="ibm-required">*' +
          '</span> <span><a class="ibm-information-link" style="position: relative; font-size:1.0em; left:5px;"' +
          'href="#" onclick="alert(\'Image size : 300Kb and dimention :1226px * 933px \');return false;" title="Exit Page Background Image."></a> </span>' +
          '</label>' +
          '<span><input id="usecase' + i + 'ExitImage" type="file" data-multiple="false" onchange="processImage(this)" accept="image/*" style="display:none;" /><label for="usecase' + i + 'ExitImage" class="btn">Browse</label>' +          
          '</span>' +
          '<span>' +
          '<img src="'+exitImageSrcValue+'" id="usecase' + i + 'ExitImageb64" style="'+exitStyleValue+'"/>' +
          '</span>' +
          '<p><span class="redColorTxt display-none" id="usecase' + i + 'ExitBackImage"> No Image selected </span></p>' +

          '<label for="ucURL" class="ibm-textcolor-green-60">Where do you want readers to go?<span class="ibm-required">*</span><span class="ibm-textcolor-gray-40 ibm-small"> max 40 characters</span></label>' +
          '<span><input type="text" value="' + render + '" size="70" id="usecase' + i + 'ExitUcURL" name="usecase' + i + 'ExitUcURL" required></span><p class="redColorTxt display-none" id="exitWhereError' + i + '"></p>' +
          '<p></p>' +

          '<label for="myInputField1"><b>Add offer(s)</b><span class="ibm-required">*</span><span class="ibm-textcolor-gray-40 ibm-small"> (min 1,max 4)</span></label><p class="redColorTxt display-none" id="addOfferError' + i + '"></p>' +

          '<span class="ibm-item-note ibm-alert-link " style="display:none;" id="exitOverlayError' + i + '"></span>' +

          '<div class="ibm-columns offerSection" data-widget="setsameheight" data-items=".ibm-col-12-3">' +
          '<div class="ibm-col-12-3 usecase' + i + 'offerTile1">' +
          '<a id="offer' + offerId++ + '" name="usecase' + i + 'Tile1" href="" onclick="formOverlayVal(this);IBMCore.common.widget.overlay.show(\'overlayExampleAlert\'); return false;">' +
          '<div class="add-usecase">Add offer 1 details + </div>' +
          '</a></div>' +
          '<div class="ibm-col-12-3  usecase' + i + 'offerTile2">' +
          '<a id="offer' + offerId++ + '" name="usecase' + i + 'Tile2" href="" onclick="formOverlayVal(this);IBMCore.common.widget.overlay.show(\'overlayExampleAlert\'); return false;">' +
          '<div class="add-usecase">Add offer 2 details + </div>' +
          '</a></div>' +
          '<div class="ibm-col-12-3  usecase' + i + 'offerTile3">' +
          '<a id="offer' + offerId++ + '" name="usecase' + i + 'Tile3" href="" onclick="formOverlayVal(this);IBMCore.common.widget.overlay.show(\'overlayExampleAlert\'); return false;">' +
          '<div class="add-usecase">Add offer 3 details + </div>' +
          '</a></div>' +
          '<div class="ibm-col-12-3  usecase' + i + 'offerTile4">' +
          '<a id="offer' + offerId++ + '" name="usecase' + i + 'Tile4" href="" onclick="formOverlayVal(this);IBMCore.common.widget.overlay.show(\'overlayExampleAlert\'); return false;">' +
          '<div class="add-usecase">Add offer 4 details + </div>' +
          '</a></div>' +
          '</div>' +
          '</div>';
      } else if (j == 1) {
        var sceneStepInfo = '', introStepTitle = '', introSceneInfo = '', inroSceneDesc = '', inroNextStep = '', imageSrcValue = '';
        if (docValue.useCases[i - 1] != undefined) {
			
		  var imageCloudantId = "usecase"+i+"IntroImage";
		  imageSrcValue = 'data:image/jpeg;base64,' + usecaseData._attachments[imageCloudantId].data;
          sceneStepInfo = docValue.useCases[i - 1].introPage.sceneStepInfo;
          introStepTitle = docValue.useCases[i - 1].introPage.sceneTitle;
          introSceneInfo = docValue.useCases[i - 1].introPage.sceneInfo.para;
          inroSceneDesc = docValue.useCases[i - 1].introPage.sceneDesc;
          inroNextStep = docValue.useCases[i - 1].introPage.tease;
        }
		
		var introStyleValue ='';		
		if(imageSrcValue != ''){			
			introStyleValue = 'width:130px;height:130px; padding-top: 10px;';
		}

        scenceDetails = scenceDetails + '<div id="scenceDetails' + k + '" class="ibm-tabs-content"' + displayblockScence + '>' +
          '<label for="mainBImage" class="ibm-textcolor-green-60">Introduction Image<span class="ibm-required">*' +
          '</span> <span><a class="ibm-information-link" style="position: relative; font-size:1.0em; left:5px;"' +
          'href="#" onclick="alert(\'Image size : 300Kb and dimention :1226px * 933px\');return false;" title="Introduction Image"></a> </span>' +
          '</label>' +
          '<span><input id="usecase' + i + 'InTroImage" type="file" data-multiple="false" onchange="processImage(this)" accept="image/*" style="display:none;" /><label for="usecase' + i + 'InTroImage" class="btn">Browse</label>' +
          '</span>' +          
          '<span>' +
          '<img src="' + imageSrcValue + '" id="usecase' + i + 'InTroImageb64" style="'+introStyleValue+'"/>' +
          '</span>' +
          '<p><span class="redColorTxt display-none" id="usecase' + i + 'IntroBackImage"> No Image selected </span></p>' +

          '<label for="IntroStepInfo" class="ibm-textcolor-green-60">Step Information<span class="ibm-required">*</span><span class="ibm-textcolor-gray-40 ibm-small"> max 50 characters</span></label>' +
          '<span><input type="text" value="' + sceneStepInfo + '" size="70" id="usecase' + i + 'IntroStepInfo" name="usecase' + i + 'IntroStepInfo" required placeholder="Enter Step Information"></span><p class="redColorTxt display-none" id="introStepInfoError' + i + '"></p>' +
          '<label for="IntroTitle" class="ibm-textcolor-green-60">Scene Title<span class="ibm-required">*</span><span class="ibm-textcolor-gray-40 ibm-small"> max 60 characters</span></label>' +
          '<span><input type="text" value="' + introStepTitle + '" size="70" id="usecase' + i + 'IntroStepTitle" name="usecase' + i + 'IntroStepTitle" required placeholder="Enter Scene Title"></span><p class="redColorTxt display-none" id="introSceneTitleError' + i + '"></p>' +
          '<label for="IntroSceneInfo" class="ibm-textcolor-green-60">Scene Information<span class="ibm-required">*</span><span class="ibm-textcolor-gray-40 ibm-small"> max 300 characters</span></label>' +
          //'<span><input type="text" value="" size="70" id="usecase' + i + 'InroSceneTitle" name="usecase' + i + 'InroSceneTitle" required placeholder="Enter Step Information"></span>' +
          '<span><textarea value="' + introSceneInfo + '" id="usecase' + i + 'IntroSceneInfo" name="usecase' + i + 'IntroSceneInfo" rows="4" cols="67" placeholder="Enter Scene Information">' + introSceneInfo + '</textarea></span><p class="redColorTxt display-none" id="introSceneInfoError' + i + '"></p>' +
          '<label for="IntroDesc" class="ibm-textcolor-green-60">Scene description<span class="ibm-required">*</span><span class="ibm-textcolor-gray-40 ibm-small"> max 300 characters</span></label>' +
          '<span><textarea id="usecase' + i + 'InroSceneDesc" name="usecase' + i + 'InroSceneDesc" rows="4" cols="67" placeholder="Enter Scene Description">' + inroSceneDesc + '</textarea></span><p class="redColorTxt display-none" id="introSceneDescError' + i + '"></p>' +
          '<label for="nextStep" class="ibm-textcolor-green-60">About Next Step<span class="ibm-required">*</span><span class="ibm-textcolor-gray-40 ibm-small"> max 60 characters</span></label>' +
          '<span><input type="text" value="' + inroNextStep + '" size="70" id="usecase' + i + 'InroNextStep" name="usecase' + i + 'InroNextStep" required placeholder=""></span><p class="redColorTxt display-none" id="introNextError' + i + '"></p></div>';
      } else {
        var idValue = j - 1;;
        var sceneStepInfo = '', sceneTitle = '', sceneInfo = '', sceneDesc = '', tease = '', sceneImageSrcValue='';
        if (docValue.useCases[i - 1] != undefined && docValue.useCases[i - 1]['scene' + idValue] != undefined) {
		  var sceneImageCloudantId = "usecase" + i + "Scene" + idValue + "Image";
		  sceneImageSrcValue = 'data:image/jpeg;base64,' + usecaseData._attachments[sceneImageCloudantId].data;
          sceneStepInfo = docValue.useCases[i - 1]['scene' + idValue].sceneStepInfo;
          sceneTitle = docValue.useCases[i - 1]['scene' + idValue].sceneTitle;
          sceneInfo = docValue.useCases[i - 1]['scene' + idValue].sceneInfo.para;
          sceneDesc = docValue.useCases[i - 1]['scene' + idValue].sceneDesc;
          tease = docValue.useCases[i - 1]['scene' + idValue].tease;
        }
		
		var sceneStyleValue ='';
		if(sceneImageSrcValue != ''){
			
			sceneStyleValue = 'width:130px;height:130px; padding-top: 10px;';
		}

        scenceDetails = scenceDetails + '<div id="scenceDetails' + k + '" class="ibm-tabs-content"' + displayblockScence + '>' +
          '<label for="sceneImage" class="ibm-textcolor-green-60">Scene Image<span class="ibm-required">*' +
          '</span> <span><a class="ibm-information-link" style="position: relative; font-size:1.0em; left:5px;"' +
          'href="#" onclick="alert(\'Image size : 300Kb and dimention :1226px * 933px\');return false;" title="Scene image"></a> </span>' +
          '</label>' +

          '<span><input id="usecase' + i + 'Scene' + idValue + 'Image" type="file" data-multiple="false" onchange="processImage(this)" accept="image/*" style="display:none;" /><label for="usecase' + i + 'Scene' + idValue + 'Image" class="btn">Browse</label>' +          
          '</span>' +
          '<span>' +
          '<img src="'+sceneImageSrcValue+'" id="usecase' + i + 'Scene' + idValue + 'Imageb64" style="'+sceneStyleValue+'"/>' +
          '</span>' +
          '<p><span class="redColorTxt display-none" id="usecase' + i + 'SceneBackImage' + idValue + '"> No Image selected </span></p>' +

          '<label for="stepInfo" class="ibm-textcolor-green-60">Step Information<span class="ibm-required">*</span><span class="ibm-textcolor-gray-40 ibm-small"> max 50 characters</span></label>' +
          '<span><input type="text" value="' + sceneStepInfo + '" size="70" id="usecase' + i + 'stepInfo' + idValue + '" name="usecase' + i + 'stepInfo' + idValue + '" required placeholder="Enter Step Information"></span><p class="redColorTxt display-none" id="usecase' + i + 'stepInfoError' + idValue + '"></p>' +
          '<label for="sceneTitle" class="ibm-textcolor-green-60">Scene Title<span class="ibm-required">*</span><span class="ibm-textcolor-gray-40 ibm-small"> max 60 characters</span></label>' +
          '<span><input type="text" value="' + sceneTitle + '" size="70" id="usecase' + i + 'sceneTitle' + idValue + '" name="usecase' + i + 'sceneTitle' + idValue + '" required placeholder="Enter Scene Title"></span><p class="redColorTxt display-none" id="usecase' + i + 'sceneTitleError' + idValue + '"></p>' +
          '<label for="sceneInfo" class="ibm-textcolor-green-60">Scene Information<span class="ibm-required">*</span><span class="ibm-textcolor-gray-40 ibm-small"> max 300 characters</span></label>' +
          //'<span><input type="text" value="" size="70" id="usecase' + i + 'SceneTitle' + idValue + '" name="usecase' + i + 'SceneTitle' + idValue + '" required placeholder="Enter step information"></span>' +
          '<span><textarea id="usecase' + i + 'sceneInfo' + idValue + '" name="usecase' + i + 'sceneInfo' + idValue + '" rows="4" cols="67" placeholder="Enter Scene Information">' + sceneInfo + '</textarea></span><p class="redColorTxt display-none" id="usecase' + i + 'sceneInfoError' + idValue + '"></p>' +
          '<label for="sceneDesc" class="ibm-textcolor-green-60">Scene Description<span class="ibm-textcolor-gray-40 ibm-small"> max 300 characters</span></label>' +
          '<span><textarea id="usecase' + i + 'SceneDesc' + idValue + '" name="usecase' + i + 'SceneDesc' + idValue + '" rows="4" cols="67" placeholder="Enter scene description">' + sceneDesc + '</textarea></span><p class="redColorTxt display-none" id="usecase' + i + 'SceneDescError' + idValue + '"></p>' +
          '<label for="nextStep" class="ibm-textcolor-green-60">About Next Step<span class="ibm-required">*</span><span class="ibm-textcolor-gray-40 ibm-small"> max 60 characters</span></label>' +
          '<span><input type="text" value="' + tease + '" size="70" id="usecase' + i + 'NextStep' + idValue + '" name="usecase' + i + 'NextStep' + idValue + '" required placeholder="Explain the next step description"></span><p class="redColorTxt display-none" id="usecase' + i + 'NextStepError' + idValue + '"></p></div>';
      }
    }

    var oneScene = preFields + scence + postFields;
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

  for (i = 1; i <= usecaseSize; i++) {
    if (docValue.useCases[i - 1] != undefined) {
      for (p = 1; p <= docValue.useCases[i - 1].exitPage.offerCases.length; p++) {
        var b = p - 1;
        // var cards = "<div class='ibm-card cardFormat' style='margin:10px;'><div class='ibm-card__content' id='usecase" + i + "Tile" + p + "' style='height:250px;word-wrap: break-word; overflow: hidden; text-overflow: ellipsis;'><h4 class='ibm-h4 offerh4" + editId + "' id ='usecase" + i + "Tile" + p + "Title'>" + docValue.useCases[i - 1].exitPage.offerCases[b].nextStep + "</h4><h6 class='ibm-h6 ibm-textcolor-gray-50' id='usecase" + i + "Tile" + p + "Desc'>" + docValue.useCases[i - 1].exitPage.offerCases[b].nextStepDescription + "</h6><p class='cardUrl' hidden id='usecase" + i + "Tile" + p + "URL' hidden=''>" + docValue.useCases[i - 1].exitPage.offerCases[b].nextStepLink + "</p><p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a id ='edit" + editId + "' class='ibm-edit-link tipso_style' onclick='cardEdit(this); IBMCore.common.widget.overlay.show(\"overlayExampleAlert\"); return false;' href='' role='button' >Edit UseCase</a></p></div></div></div>";
        var cards = "<div class='ibm-card cardFormat' style='margin:10px;'><div class='ibm-card__content' id='usecase" + i + "Tile" + p + "' style='height:250px;word-wrap: break-word; overflow: hidden; text-overflow: ellipsis;'><h4 class='ibm-h4 offerh4" + editId + "' id ='usecase" + i + "Tile" + p + "Title'>" + docValue.useCases[i - 1].exitPage.offerCases[b].nextStep + "</h4><h6 class='ibm-h6 ibm-textcolor-gray-50' id='usecase" + i + "Tile" + p + "Desc'>" + docValue.useCases[i - 1].exitPage.offerCases[b].nextStepDescription + "</h6><p class='cardUrl' hidden id='usecase" + i + "Tile" + p + "URL' hidden=''>" + docValue.useCases[i - 1].exitPage.offerCases[b].nextStepLink + "</p><p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a id ='edit" + editId + "' class='ibm-edit-link tipso_style' onclick='cardEdit(this); IBMCore.common.widget.overlay.show(\"overlayExampleAlert\"); return false;' href='' role='button' >Edit UseCase</a></p><p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a class='ibm-close-link' onclick='deleteOffer(this);' role='button' >Delete UseCase</a></p></div></div></div>";
        // jQuery(".ibm-col-12-3:eq(" + editId + ")").html(cards);
        jQuery(".usecase" + i + "offerTile" + p).html(cards);
        editId++;
      }
    }
  }

  setTimeout(() => {
    //jQuery('input[type=file]').fileinput();
  }, 1000);

  jQuery("#usecases li").click(function () {
    var clickedLiId = jQuery(this).attr("id");
    for (var i = 1; i <= usecaseSize; i++) {
      if (i == clickedLiId.substr(7)) {
        jQuery('#usecasedetails' + i).css({
          'display': 'block'
        });
        jQuery('#scence' + i).css({
          'display': 'block'
        });

        //display scene info based on usecase click
        var n = 1;
        if (i == 1) {
          n = 1;
        } else {
          for (m = 0; m < i - 1; m++) {
            n = n + Number(landingPageData.useCases[m].scene) + 2;
          }
        }

        for (a = 1; a <= k; a++) {
          if (a == n) {
            jQuery('#scenceDetails' + a).css({
              'display': 'block'
            });
          } else {
            jQuery('#scenceDetails' + a).css({
              'display': 'none'
            });
          }
        }
        //end
      } else {
        jQuery('#usecasedetails' + i).css({
          'display': 'none'
        });
        jQuery('#scence' + i).css({
          'display': 'none'
        });
      }
    }
  });

  jQuery("#scence ul li").click(function () {
    var clickedUlLiId = jQuery(this).attr("id");
    for (var i = 1; i <= k; i++) {
      if (i == clickedUlLiId.substr(9)) {
        jQuery('#scenceDetails' + i).css({
          'display': 'block'
        });
      } else {
        jQuery('#scenceDetails' + i).css({
          'display': 'none'
        });
      }

    }
  });

  for (var j = 1; j <= usecaseSize; j++) {
    jQuery('#usecase' + j + 'InroStepInfo').click(function (e) {
      jQuery("#usecase" + j + "InroStepInfo").click(doIt(e));
    });
    jQuery('#usecase' + j + 'InroSceneTitle').click(function (e) {
      jQuery("#usecase" + j + "InroSceneTitle").click(doIt(e));
    });
    jQuery('#usecase' + j + 'InroSceneDesc').click(function (e) {
      jQuery("#usecase" + j + "InroSceneDesc").click(doIt(e));
    });
    jQuery('#usecase' + j + 'InroNextStep').click(function (e) {
      jQuery("#usecase" + j + "InroNextStep").click(doIt(e));
    });
    jQuery('#usecase' + j + 'ExitSubTitle').click(function (e) {
      jQuery("#usecase" + j + "ExitSubTitle").click(doIt(e));
    });
    jQuery('#usecase' + j + 'ExitUcURL').click(function (e) {
      jQuery("#usecase" + j + "ExitUcURL").click(doIt(e));
    });
  }

  var usecasevalues = landingPageData.useCases;
  for (var i = 1; i <= usecaseSize; i++) {
    for (var j = 1; j <= usecasevalues[i - 1].scene; j++) {
      jQuery('#usecase' + i + 'StepInfo' + j).click(function (e) {
        jQuery('#usecase' + i + 'StepInfo' + j).click(doIt(e));
      });
      jQuery('#usecase' + i + 'SceneTitle' + j).click(function (e) {
        jQuery('#usecase' + i + 'SceneTitle' + j).click(doIt(e));
      });
      jQuery('#usecase' + i + 'SceneDesc' + j).click(function (e) {
        jQuery('#usecase' + i + 'SceneDesc' + j).click(doIt(e));
      });
      jQuery('#usecase' + i + 'NextStep' + j).click(function (e) {
        jQuery('#usecase' + i + 'NextStep' + j).click(doIt(e));
      });
    }
  }

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
    //jQuery('.ibm-tabs-content').hide();
    jQuery(this).parent().parent().find('a').attr("aria-selected", "false");
    let IDSelector = jQuery(this).attr('href');
    jQuery(this).attr("aria-selected", "true");
    jQuery(IDSelector).show();
  });

  //  exit overlay fields click
  jQuery('#offerTitle').click(function () {
    jQuery("#offerTitle").attr('style', 'background: white;');
  });
  jQuery('#offerDesc').click(function () {
    jQuery("#offerDesc").attr('style', 'background: white;');
  });
  jQuery('#offerURL').click(function () {
    jQuery("#offerURL").attr('style', 'background: white;');
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
        resolve({ width: this.width, height: this.height, id: e });
        _URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    }
  });
}
