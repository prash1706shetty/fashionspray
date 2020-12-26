var cookieValue = readCookie();

function getCaasData(prdId) {
    jQuery.ajax({
        type: "POST",
        url: "/cloudant/fetchById",
        data: JSON.stringify({ productId: prdId }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue,
        },
        success: function (result) {
            var obj = JSON.parse(result);
            sessionStorage.setItem("Json", JSON.stringify(obj));;

            if (obj.description.page === "multi") {
                jQuery("#useCaseMulti").prop('checked', true);
            }
            else {
                jQuery("#useCaseSingle").prop('checked', true);
            }

            jQuery("#orgId").val(obj.description.orgId);
            jQuery("#userId").val(obj.description.userId);
            jQuery("#pDemoName").val(obj.description.prdName);
            jQuery("#pId").val(obj._id);
            jQuery("#pNameMUrl").val(obj.description.prMarkUrl);
            jQuery("#cta1").val(obj.description.cta1);
            jQuery("#cta2").val(obj.description.cta2);
            jQuery("#url1").val(obj.description.url1);
            jQuery("#url2").val(obj.description.url2);




            for (i = 0; i < obj.description.useCases.length; i++) {

                var usecaseId = i;
                var title = obj.description.useCases[i].title;
                var desc = obj.description.useCases[i].desc;
                var scene = obj.description.useCases[i].scene;


                let cards = "<div class='ibm-card' style='margin:10px;'><div class='ibm-card__image'><img id ='useCaseBImg" + usecaseId + "' src='' alt='Thumbnail Image' width='100%' height='90'  ></div><div class='ibm-card__content' style='padding-bottom:57px;'><h3 class='ibm-h3 elipsis' id ='useCasetitle" + usecaseId + "'>" + title + "</h3><p id = 'useCaseDesc" + usecaseId + "' class='elipsis''>" + desc + "</p><p><span class='ibm-small ibm-textcolor-gray-30' >No of Scene(s): </span> <span class='ibm-small' id='useCaseScene" + usecaseId + "'>" + scene + "</span></p><p class='ibm-ind-link ibm-icononly ibm-fright pf-pencil white-bg'><a id ='edit" + usecaseId + "' class='ibm-edit-link tipso_style' onclick='formOverlayVal(this); IBMCore.common.widget.overlay.show(\"overlayExampleAlert\"); return false;' href='' role='button' >Edit UseCase</a></p></div></div></div>";

                jQuery(".ibm-col-12-3:eq(" + usecaseId + ")").attr('style', 'height:auto;').html(cards);

            }
        },
        error: function (e) {
            console.log('error------------');
        }
    });
}
