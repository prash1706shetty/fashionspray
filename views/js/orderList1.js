jQuery(document).ready(function ($) {
    console.log("ordelist");

    var data = {
        "test1":"test1"
    }
    jQuery.ajax({
        type: "POST",
        url: "/caas/getDocuments",
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue
        },
        async: false,
        success: function (result) {
            var eachOrder = '';    
           // var preDomElements = '<table class="ibm-data-table ibm-grid ibm-altrows" data-info="true" data-ordering="true" data-paging="true" data-searching="true" data-widget="datatable" id="test1table"><thead><tr><th>Name1</th><th>Name2</th><th>Name3</th><th>Name4</th></tr></thead><tbody>';
           // var postDomElements = '</tbody></table>';
           var table = "<table class='ibm-data-table display dataTable no-footer dtr-inline ibm-widget-processed' data-info='true' data-ordering='true' data-paging='true' data-searching='true'  role='grid' style='width: 748px;' aria-describedby='table_info'  data-scrollaxis='x' data-widget='datatable' id='prodTable'><thead class='tableHead'><tr><th data-ordering='true'>Product Name </th><th>Created By</th><th>Updated By</th><th>Last Updated On</th><th>Status</th><th>Comments</th> <th>Action</th> </tr></thead><tbody>"+
           '<tr>'+
           '<td>Tiger Nixon</td>'+
           '<td>Edinburgh</td>'+
           '<td>61</td>'+
           '<td>61</td>'+
           '<td>61</td>'+
           '<td>61</td>'+
           '<td>2011/04/25</td>'+
       '</tr>'+
       '<tr>'+
           '<td>Tiger Nixon</td>'+
           '<td>Edinburgh</td>'+
           '<td>61</td>'+
           '<td>61</td>'+
           '<td>61</td>'+
           '<td>61</td>'+
           '<td>2011/04/25</td>'+
       '</tr>';
       table = table + "</tbody></table>";
       jQuery('#orderList').prepend(table);
            for (row of result.rows) {    
                //eachOrder = eachOrder +  "<tr><td>"+row.value.customerName+"</td><td>"+row.value.mobileNumber+"</td><td>"+row.value.dressFor+"</td><td>"+row.value.dressTypeSelect+"</td></tr>";           
               
            }
            //jQuery("#orderList").html("<tr><td>Tiger Nixon</td><td>Edinburgh</td><td>61</td><td>2011/04/25</td></tr><tr><td>Tiger Nixon</td><td>Edinburgh</td><td>61</td><td>2011/04/25</td></tr>");


        },
        error: function (e) {
            alert("There was some internal error while updating, Please try again after sometime")
        }
    });

    

});