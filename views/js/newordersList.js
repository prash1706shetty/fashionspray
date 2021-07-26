var orderList = '';
var cookieValue = readCookie();

jQuery(document).ready(function($) {
    jQuery.ajax({
        type: "GET",
        url: "/fs/getNewOrders",
        async: false,
        headers: {
            'Conten-Type': 'application/json',
            'Authorization': cookieValue
        },
        success: function(result) {
            orderList = result.rows;
            var deliveryDate = '';
            var orderDate = '';
            var monthNames = ["Jan", "Feb", "Mar", "Apr",
                "May", "Jun", "Jul", "Aug",
                "Sep", "Oct", "Nov", "Dec"
            ];
            var table = "<table class='ibm-data-table display dataTable no-footer dtr-inline ibm-widget-processed ibm-grid ibm-altrows' data-info='true' data-ordering='true' data-paging='true' data-searching='true'  role='grid' style='width: 748px;' aria-describedby='table_info'  data-scrollaxis='x' data-widget='datatable' id='prodTable'><thead class='tableHead'><tr><th data-ordering='true'>Order Number</th><th >Customer Name</th><th>Mobile Number</th><th>Delivery Date</th><th>Status</th><th>Action</th></tr></thead><tbody>";
            result.rows.forEach((row, index) => {
                deliveryDate = new Date(row.value.deliveryDate.year, row.value.deliveryDate.month - 1, row.value.deliveryDate.date);
                orderDate = new Date(row.value.orderDate.year, row.value.orderDate.month - 1, row.value.orderDate.date);
                var rowBgColor = '';
                var deliveryDateValue = '';
                var orderDateValue = '';
                var orderStatusValue = row.value.orderStatus;
                if (row.value.orderStatus == 'New') {
                    rowBgColor = "background-color:#99ff99";
                    var Difference_In_Time = deliveryDate.getTime() - new Date().getTime();
                    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                    if (Difference_In_Days < 2) {
                        rowBgColor = "background-color:#b30000";
                        orderStatusValue = orderStatusValue + ' - Risk';
                    } else if (Difference_In_Days < 6) {
                        rowBgColor = "background-color:#ff3333";
                        orderStatusValue = orderStatusValue + ' - Critical'
                    }
                }

                if (row.value.orderStatus == 'On process') {
                    rowBgColor = "background-color:#ffff66";
                } else if (row.value.orderStatus == 'Delivered') {
                    rowBgColor = "background-color:#6666ff";
                } else if (row.value.orderStatus == 'Rejected') {
                    rowBgColor = "background-color:#ff66ff";
                } else if (row.value.orderStatus == 'Ready to deliver') {
                    rowBgColor = "background-color:#ffa31a";
                }
                var tomorrowDate = new Date();
                tomorrowDate.setDate(tomorrowDate.getDate() + 1);
                var yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                var currentYear = deliveryDate.getFullYear().toString();
                currentYear = currentYear.substring(currentYear.length - 2);

                var orderDateYear = orderDate.getFullYear().toString();
                orderDateYear = orderDateYear.substring(orderDateYear.length - 2);


                if (deliveryDate.getDate() < 10) {
                    deliveryDateValue = '0' + deliveryDate.getDate() + monthNames[deliveryDate.getMonth()] + ' ' + currentYear;
                } else {
                    deliveryDateValue = deliveryDate.getDate() + monthNames[deliveryDate.getMonth()] + ' ' + currentYear;
                }
                if (deliveryDate.getDate() == new Date().getDate() && deliveryDate.getMonth() == new Date().getMonth() && deliveryDate.getYear() == new Date().getYear()) {
                    deliveryDateValue = 'Today';
                } else if (deliveryDate.getDate() == tomorrowDate.getDate() && deliveryDate.getMonth() == tomorrowDate.getMonth() && deliveryDate.getYear() == tomorrowDate.getYear()) {
                    deliveryDateValue = 'Tomorrow';
                } else if (deliveryDate.getDate() == yesterdayDate.getDate() && deliveryDate.getMonth() == yesterdayDate.getMonth() && deliveryDate.getYear() == yesterdayDate.getYear()) {
                    deliveryDateValue = 'Yesterday';
                }

                if (orderDate.getDate() < 10) {
                    orderDateValue = '0' + orderDate.getDate() + monthNames[orderDate.getMonth()] + ' ' + orderDateYear;
                } else {
                    orderDateValue = orderDate.getDate() + monthNames[orderDate.getMonth()] + ' ' + orderDateYear;
                }
                if (orderDate.getDate() == new Date().getDate() && orderDate.getMonth() == new Date().getMonth() && orderDate.getYear() == new Date().getYear()) {
                    orderDateValue = 'Today';
                } else if (orderDate.getDate() == tomorrowDate.getDate() && orderDate.getMonth() == tomorrowDate.getMonth() && orderDate.getYear() == tomorrowDate.getYear()) {
                    orderDateValue = 'Tomorrow';
                } else if (orderDate.getDate() == yesterdayDate.getDate() && orderDate.getMonth() == yesterdayDate.getMonth() && orderDate.getYear() == yesterdayDate.getYear()) {
                    orderDateValue = 'Yesterday';
                }
                table = table + '<tr>' +
                    '<td>' + row.value.orderNumber + '</td>' +
                    '<td id ="orderDetails-' + row.value._id + '" onclick="getOrderDetails(this);IBMCore.common.widget.overlay.show(\'overlayOrder\'); return false;">' + row.value.customerName + '</td>' +

                    '<td>' + row.value.mobileNumber + '</td>' +
                    '<td>' + deliveryDateValue + '</td>' +
                    '<td style=' + rowBgColor + '>' + orderStatusValue + '</td>' +
                    '<td id="toggle' + index + '" class="elipsis"><img src="/images/overflow-menu--vertical.svg" class="elipsis" style="cursor: pointer;" onclick= "productActionToggle(' + index + ');  return false;\" width="30" height="30"><div style="position:absolute;z-index:1"><ul id="productAction' + index + '" style="display:none;" class="ibm-dropdown-menu productAction"><li><a  style="cursor: pointer;text-decoration: none;" id ="editProduct-' + row.value._id + '" href="/editorder?on=' + row.value.orderNumber + '">Edit</a></li></ul></div></td>' +
                    '</tr>';

            });

            table = table + "</tbody></table>";
            jQuery('#table').prepend(table);
            jQuery('.display').dataTable();
            jQuery("#demoLoadingMessage").empty();
            jQuery('body').click(function(e) {
                if (!jQuery(e.target).hasClass('elipsis')) {
                    jQuery('.productAction').attr('style', 'display:none')
                    return;
                }
            });
        },
        error: function(e) {
            alert("There was some internal error while updating, Please try again after sometime")
        }
    });
});

function productActionToggle(id) {
    jQuery('.productAction').attr('style', 'display:none')
    jQuery("#productAction" + id).attr('style', 'display:block');
}

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