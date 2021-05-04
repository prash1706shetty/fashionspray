var addCount = 0;
var orderNumber = '';

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
            'Content-Type': 'application/json'
        },
        async: false,
        success: function (result) {
            preloadForm(result.data);
        },
        error: function (e) {
            alert("There was some internal error while updating, Please try again after sometime")
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
    $("#Add").on("click", function () {
        addCount++;
        $("#textboxDiv").append(' <div class=" ibm-col-12-12"><div class=" ibm-col-12-3">' +
            '<div for="fabricType' + addCount + '" class="ibm-textcolor-green-60 ibm-padding-top-1 tooltip">Fabric type ' + addCount +
            '<span class="tooltiptext">Type of fabric.</span>' +
            '<span class="ibm-required">' +
            '*</span>' +
            '</div>' +
            '<div class="fieldPaddingTop">' +
            '<input type="text" class="fieldWidthSmall" id="fabricType' + addCount + '" name="fabricType' + addCount + '" value=""' +
            'placeholder="Enter type of fabric." onfocus="clearRedColor(this)">' +
            '</div>' +
            '</div>' +

            '<div class=" ibm-col-12-3">' +
            '<div for="colorType' + addCount + '" class="ibm-textcolor-green-60 ibm-padding-top-1 tooltip">Color' +
            '<span class="tooltiptext">Color of the fabric</span>' +
            '<span class="ibm-required">' +
            '*</span>' +
            '</div>' +
            '<div class="fieldPaddingTop">' +
            '<input type="text" class="fieldWidthSmall" id="colorType' + addCount + '" name="colorType' + addCount + '" value=""' +
            'placeholder="Enter color of the fabric." onfocus="clearRedColor(this)">' +
            '</div>' +
            '</div>' +
            '<div class=" ibm-col-12-3">' +
            '<div for="fabricQuantity' + addCount + '" class="ibm-textcolor-green-60 ibm-padding-top-1 tooltip">Quantity' +
            '<span class="tooltiptext">Number of meter fabric required.</span>' +
            '<span class="ibm-required">' +
            '*</span>' +
            '</div>' +
            '<div class="fieldPaddingTop">' +
            '<input type="text" class="fieldWidthSmall" id="fabricQuantity' + addCount + '" name="fabricQuantity' + addCount + '" value=""' +
            'placeholder="Enter number of meter." onfocus="clearRedColor(this)">' +
            '</div>' +
            '</div>' +

            '<div class=" ibm-col-12-3">' +
            '<div for="fabricNote' + addCount + '" class="ibm-textcolor-green-60 ibm-padding-top-1 tooltip">Note' +
            '<span class="tooltiptext">Note.</span>' +
            '<span class="ibm-required">' +
            '*</span>' +
            '</div>' +
            '<div class="fieldPaddingTop">' +
            '<textarea placeholder="Enter fabric details." value="" rows="2" class="fabricNote" id="fabricNote' + addCount + '"' +
            'name="orderNote' + addCount + '" maxlength="500"></textarea>' +
            '</div>' +
            '</div>' +
            '</div>');

    });
    $("#Remove").on("click", function () {
        if (addCount > 1) {
            addCount--;
            $("#textboxDiv").children().last().remove();
        } else {
            addCount = 1;
        }
    });

    var existCondition = setInterval(function () {
        if ($('.ibm-calendar-link').length) {
            clearInterval(existCondition);
            $('.ibm-calendar-link').hide();
        }
    }, 100); // check every 100ms
});

function preloadForm(result) {
    orderNumber = result.orderNumber;
    jQuery('#customerName').text(result.customerName);
    jQuery('#mobileNumber').text(result.mobileNumber);
    jQuery('#orderNumber').text(result.orderNumber);
    jQuery('#dress').text(result.dressFor + ' ' + result.dressType);
    jQuery('#orderDate').text(result.orderDate.date + '/' + result.orderDate.month + '/' + result.orderDate.year);
    jQuery('#deliveryDate').text(result.deliveryDate.date + '/' + result.deliveryDate.month + '/' + result.deliveryDate.year);
    jQuery('#orderNote').text(result.orderNote);

    var eachFabricDetails = '';
    var finalValue = '';
    for (var i = 0; i < result.fabrics.length; i++) {
        addCount++;
        var fabricValue = result.fabrics[i];
        var idValue = i + 1;
        eachFabricDetails = '<div class=" ibm-col-12-12"><div class=" ibm-col-12-3">' +
            '<div for="fabricType' + idValue + '" class="ibm-textcolor-green-60 ibm-padding-top-1 tooltip">Fabric type ' + idValue +
            '<span class="tooltiptext">Type of fabric.</span>' +
            '<span class="ibm-required">' +
            '*</span>' +
            '</div>' +
            '<div class="fieldPaddingTop">' +
            '<input type="text" class="fieldWidthSmall" id="fabricType' + idValue + '" name="fabricType' + idValue + '" value="' + fabricValue.fabricType + '"' +
            'placeholder="Enter type of fabric." onfocus="clearRedColor(this)">' +
            '</div>' +
            '</div>' +

            '<div class=" ibm-col-12-3">' +
            '<div for="colorType' + idValue + '" class="ibm-textcolor-green-60 ibm-padding-top-1 tooltip">Color' +
            '<span class="tooltiptext">Color of the fabric</span>' +
            '<span class="ibm-required">' +
            '*</span>' +
            '</div>' +
            '<div class="fieldPaddingTop">' +
            '<input type="text" class="fieldWidthSmall" id="colorType' + idValue + '" name="colorType' + idValue + '" value="' + fabricValue.colorType + '"' +
            'placeholder="Enter color of the fabric." onfocus="clearRedColor(this)">' +
            '</div>' +
            '</div>' +
            '<div class=" ibm-col-12-3">' +
            '<div for="fabricQuantity' + idValue + '" class="ibm-textcolor-green-60 ibm-padding-top-1 tooltip">Quantity' +
            '<span class="tooltiptext">Number of meter fabric required.</span>' +
            '<span class="ibm-required">' +
            '*</span>' +
            '</div>' +
            '<div class="fieldPaddingTop">' +
            '<input type="text" class="fieldWidthSmall" id="fabricQuantity' + idValue + '" name="fabricQuantity' + idValue + '" value="' + fabricValue.fabricQuantity + '"' +
            'placeholder="Enter number of meter." onfocus="clearRedColor(this)">' +
            '</div>' +
            '</div>' +

            '<div class=" ibm-col-12-3">' +
            '<div for="fabricNote' + idValue + '" class="ibm-textcolor-green-60 ibm-padding-top-1 tooltip">Note' +
            '<span class="tooltiptext">Note.</span>' +
            '<span class="ibm-required">' +
            '*</span>' +
            '</div>' +
            '<div class="fieldPaddingTop">' +
            '<textarea  rows="2" class="fabricNote" id="fabricNote' + idValue + '"' +
            'name="orderNote' + idValue + '" maxlength="500"></textarea>' +
            '</div>' +
            '</div>' +
            '</div>';
        finalValue = finalValue + eachFabricDetails;
    }
    jQuery("#textboxDiv").append(finalValue);
    for (var i = 0; i < result.fabrics.length; i++) {
        var idValue = i + 1;
        jQuery('#fabricNote' + idValue).val(result.fabrics[i].fabricNote);
    }

}

function saveOrder() {

    var formValidation = true;
    var fabricsArray = [];
    for (var i = 1; i <= addCount; i++) {
        var fabrics = {};

        var fabricType = jQuery('#fabricType' + i).val();
        var colorType = jQuery('#colorType' + i).val();
        var fabricQuantity = jQuery('#fabricQuantity' + i).val();
        var fabricNote = jQuery('#fabricNote' + i).val();

        if (fabricType == '') {
            jQuery('#fabricType' + i).addClass('redBorder');
            formValidation = false;
        } else {
            fabrics['fabricType'] = fabricType;
        }

        if (colorType == '') {
            jQuery('#colorType' + i).addClass('redBorder');
            formValidation = false;
        } else {
            fabrics['colorType'] = colorType;
        }

        if (fabricQuantity == '') {
            jQuery('#fabricQuantity' + i).addClass('redBorder');
            formValidation = false;
        } else {
            fabrics['fabricQuantity'] = fabricQuantity;
        }

        if (fabricNote == '') {
            jQuery('#fabricNote' + i).addClass('redBorder');
            formValidation = false;
        } else {
            fabrics['fabricNote'] = fabricNote;
        }

        fabricsArray.push(fabrics);
    }
    var doc = {
        docId: orderNumber,
        fabrics: fabricsArray
    }
    if (formValidation) {
        jQuery.ajax({
            type: "POST",
            url: "/fs/addFabrics",
            data: JSON.stringify(doc),
            headers: {
                'Content-Type': 'application/json'
            },
            async: false,
            success: function (result) {
                if (result.statusCode == 200) {
                    jQuery('#loadingIndicator').addClass('visibility-hidden');
                    IBMCore.common.widget.overlay.show("confirmationOverlay");
                    jQuery("#overlayMsg").empty().append('<span style="color: red;">Fabrics details updated.</span>');
                } else {
                    alert('There was some error while updating data');

                }
            },
            error: function (e) {
                jQuery('#loadingIndicator').addClass('visibility-hidden');
                IBMCore.common.widget.overlay.show("errorOverlay");
                jQuery("#errorOverlayMsg").empty().append('<span style="color: red;">Please fill all the fields and select required option.</span>');

            }
        });
    } else {
        jQuery('#loadingIndicator').addClass('visibility-hidden');
        IBMCore.common.widget.overlay.show("errorOverlay");
        jQuery("#errorOverlayMsg").empty().append('<span style="color: red;">Please fill all the fields.</span>');
    }
}

function clearRedColor(focusEvent) {
    console.log("focusEvent.id->" + focusEvent.id);
    jQuery('#' + focusEvent.id).removeClass('redBorder');
}
