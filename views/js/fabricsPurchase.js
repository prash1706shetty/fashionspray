var orderList = '';
jQuery(document).ready(function ($) {
    jQuery.ajax({
        type: "GET",
        url: "/fs/getFabrics",
        async: false,
        success: function (result) {
            orderList = result.rows;
            var deliveryDate = '';
            var monthNames = ["Jan", "Feb", "Mar", "Apr",
                "May", "Jun", "Jul", "Aug",
                "Sep", "Oct", "Nov", "Dec"];
            var table = "<table class='ibm-data-table display dataTable no-footer dtr-inline ibm-widget-processed ibm-grid ibm-altrows' data-info='true' data-ordering='true' data-paging='true' data-searching='true'  role='grid' style='width: 748px;' aria-describedby='table_info'  data-scrollaxis='x' data-widget='datatable' id='prodTable'><thead class='tableHead'><tr><th data-ordering='true'>Customer details</th><th>Fabrics details</th></tr></thead><tbody>";
            result.rows.forEach((row, index) => {
                deliveryDate = new Date(row.value.deliveryDate.year, row.value.deliveryDate.month - 1, row.value.deliveryDate.date);
                var orderDate = row.value.orderDate;
                var deliveryDateValue = '';
                var orderDateValue = '';
                var tomorrowDate = new Date();
                tomorrowDate.setDate(tomorrowDate.getDate() + 1);
                var yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);

                if (deliveryDate.getDate() < 10) {
                    deliveryDateValue = '0' + deliveryDate.getDate() + ' ' + monthNames[deliveryDate.getMonth()] + ' ' + deliveryDate.getFullYear();
                } else {
                    deliveryDateValue = deliveryDate.getDate() + ' ' + monthNames[deliveryDate.getMonth()] + ' ' + deliveryDate.getFullYear();
                }
                if (deliveryDate.getDate() == new Date().getDate() && deliveryDate.getMonth() == new Date().getMonth() && deliveryDate.getYear() == new Date().getYear()) {
                    deliveryDateValue = 'Today';
                } else if (deliveryDate.getDate() == tomorrowDate.getDate() && deliveryDate.getMonth() == tomorrowDate.getMonth() && deliveryDate.getYear() == tomorrowDate.getYear()) {
                    deliveryDateValue = 'Tomorrow';
                } else if (deliveryDate.getDate() == yesterdayDate.getDate() && deliveryDate.getMonth() == yesterdayDate.getMonth() && deliveryDate.getYear() == yesterdayDate.getYear()) {
                    deliveryDateValue = 'Yesterday';
                }

                var orderMonth = orderDate.month - 1;
                if (orderDate.date < 10) {
                    orderDateValue = '0' + orderDate.date + ' ' + monthNames[orderMonth] + ' ' + orderDate.year;
                } else {
                    orderDateValue = orderDate.date + ' ' + monthNames[orderMonth] + ' ' + orderDate.year;
                }


                if (orderDate.date == new Date().getDate() && orderMonth == new Date().getMonth() && orderDate.year == new Date().getFullYear()) {
                    orderDateValue = 'Today';
                } else if (orderDate.date == tomorrowDate.getDate() && orderMonth == tomorrowDate.getMonth() && orderDate.year == tomorrowDate.getFullYear()) {
                    orderDateValue = 'Tomorrow';
                } else if (orderDate.date == yesterdayDate.getDate() && orderMonth == yesterdayDate.getMonth() && orderDate.year == yesterdayDate.getFullYear()) {
                    orderDateValue = 'Yesterday';
                }

                var fabricsList = '';
                var fabricCount = 1;
                for (var i = 0; i < row.value.fabrics.length; i++) {
                    var eachFabric = row.value.fabrics[i]
                    fabricCount = i + fabricCount;
                    fabricsList = fabricsList + fabricCount + '. ' + eachFabric.fabricType + ' ' + eachFabric.colorType + ' ' + eachFabric.fabricQuantity + 'meter : ' + eachFabric.fabricNote + '</br>';
                }

                var threeDigitNumber = row.value.mobileNumber.substring(6);
                table = table + '<tr>' +
                    '<td id ="orderDetails-' + row.value._id + '" onclick="getOrderDetails(this);IBMCore.common.widget.overlay.show(\'overlayOrder\'); return false;">' + row.value.customerName + '</br>Dress : ' + row.value.dressType + '</br>Amount : ' + row.value.totalAmount + '</br>OD : ' + orderDateValue + '</br>DD : ' + deliveryDateValue + '</br>MN : ******' + threeDigitNumber + '</br>ON : ' + row.value.orderNumber + '</td>' +
                    '<td>' + fabricsList + '</td>' +
                    '</tr>';
            });

            table = table + "</tbody></table>";
            jQuery('#table').prepend(table);
            jQuery('.display').dataTable();
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


    jQuery("#printContent").click(function () {
        $('#firstHeader').addClass('display-none');
        $('#secondHeader').addClass('display-none');
        $('#prodTable_length').addClass('display-none');
        $('#prodTable_filter').addClass('display-none');
        $('#prodTable_info').addClass('display-none');
        $('#prodTable_paginate').addClass('display-none');
        window.print();
        $('#firstHeader').removeClass('display-none');
        $('#secondHeader').removeClass('display-none');
        $('#prodTable_length').removeClass('display-none');
        $('#prodTable_filter').removeClass('display-none');
        $('#prodTable_info').removeClass('display-none');
        $('#prodTable_paginate').removeClass('display-none');
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

function closeOverlay(name) {
    IBMCore.common.widget.overlay.hide(name);
}
