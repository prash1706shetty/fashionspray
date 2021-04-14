var formValidation = true;
var addCount = 1;

jQuery(document).ready(function ($) {

    var searchParams = new URLSearchParams(window.location.search);
    let param = searchParams.get('on')
    var doc = {
        docId: 'fs21200'
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
    jQuery('#customerName').text(result.customerName);
    jQuery('#mobileNumber').text(result.mobileNumber);
    jQuery('#orderNumber').text(result.orderNumber);
    jQuery('#dress').text(result.dressFor + ' ' + result.dressType);
    jQuery('#orderDate').text(result.orderDate.date + '/' + result.orderDate.month + '/' + result.orderDate.year);
    jQuery('#deliveryDate').text(result.deliveryDate.date + '/' + result.deliveryDate.month + '/' + result.deliveryDate.year);
    jQuery('#orderNote').text(result.orderNote);
}

function saveOrder() {
    console.log("count-->" + addCount);
}

function clearRedColor(focusEvent) {
    jQuery('#' + focusEvent.id).removeClass('redBorder');
}


