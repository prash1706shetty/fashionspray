function fetchDocFileByDocIdAndLang(document_id, fileName) {
    var resp = ""
    jQuery.ajax({
        type: "POST",
        url: "/caas/fetchDocFileByIdAndLang",
        data: JSON.stringify({ language: "en", document_id: document_id, fileName: fileName }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue
        },
        async: false,
        success: function (result) {
            resp = result;
        },
        error: function (e) {
            alert("There was some internal error while fetching data, Please try again after sometime")
        }
    });
    return resp;
}

function fetchDocByIdAndLang(document_id) {
    var resp = ""
    jQuery.ajax({
        type: "POST",
        url: "/caas/fetchDocByIdAndLang",
        data: JSON.stringify({ language: "en", document_id: document_id }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue
        },
        async: false,
        success: function (result) {
            resp = result;
        },
        error: function (e) {
            alert("There was some internal error while fetching data, Please try again after sometime")
        }
    });
    return resp;
}

function updateDocumentJson(data, docId) {
    var resp;
    jQuery.ajax({
        type: "POST",
        url: "/caas/updateDocument",
        data: JSON.stringify({ 'docId': docId, 'updateDoc': data }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue
        },
        async: false,
        success: function (result) {
            resp = result;
        },
        error: function (e) {
            alert("There was some internal error while updating, Please try again after sometime")
        }
    });
    return resp;
}

function createDocument(data, docId) {
    var resp;
    jQuery.ajax({
        type: "POST",
        url: "/caas/createDocument",
        data: JSON.stringify({ 'docId': docId, 'updateDoc': data }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue
        },
        async: false,
        success: function (result) {
            resp = result;
        },
        error: function (e) {
            alert("There was some internal error while updating, Please try again after sometime")
        }
    });
    return resp;
}

function fetchDocumentListByBrief() {
    var resp = "";
    jQuery.ajax({
        type: "POST",
        url: "/caas/documentListByBrief",
        data: JSON.stringify({ language: "en" }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue
        },
        async: false,
        success: function (result) {
            resp = result;
        },
        error: function (e) {
            alert("There was some internal error while fetching data, Please try again after sometime");
        }
    });
    return resp;
}

function updateDocumentFile(doc, docId, fileName) {

    var resp;
    jQuery.ajax({
        type: "POST",
        url: "/caas/updateDocumentFile",
        data: JSON.stringify({ 'docId': docId, 'updateDoc': doc, 'fileName': fileName }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue
        },
        async: false,
        success: function (result) {
            resp = result;
        },
        error: function (e) {
            alert("There was some internal error while updating data, Please try again after sometime");
        }
    });
    return resp;

}

function deleteDocumentFile(docId, fileName) {

    var resp;
    jQuery.ajax({
        type: "POST",
        url: "/caas/deleteDocumentFile",
        data: JSON.stringify({ 'docId': docId, 'fileName': fileName }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue
        },
        async: false,
        success: function (result) {
            resp = result;
        },
        error: function (e) {
            alert("There was some internal error while updating data, Please try again after sometime");
        }
    });
    return resp;

}

function deleteDocument(docId) {

    var resp;
    jQuery.ajax({
        type: "DELETE",
        url: "/caas/deleteDocument",
        data: JSON.stringify({ 'docId': docId }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue
        },
        async: false,
        success: function (result) {
            resp = result;
        },
        error: function (e) {
            alert("There was some internal error while deleting data, Please try again after sometime");
        }
    });
    return resp;

}

function createImageFile(data) {

    var resp;
    jQuery.ajax({
        type: "POST",
        url: "/caas/createImageFile",
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue
        },
        async: false,
        success: function (result) {
            resp = result;
        },
        error: function (e) {
            alert("There was some internal error while adding images, Please try again after sometime");
        }
    });
    return resp;

}

function loadUserPrivilege() {

    var userPrivilege = "";
    jQuery.ajax({
        type: "POST",
        url: "/cloudant/view",
        data: JSON.stringify({ view: 'allDoc' }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue,
        },
        async: false,
        success: function (result) {
            userPrivilege = result;
        },
        error: function (e) {
            console.log('There was error in fetching data from cloudant');
        }
    });
    return userPrivilege;
}

function fetchDocContentAll(document_id) {

    var resp = ""
    jQuery.ajax({
        type: "POST",
        url: "/caas/fetchDocContentAll",
        data: JSON.stringify({ language: "en", document_id: document_id }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue
        },
        async: false,
        success: function (result) {
            resp = result;
        },
        error: function (e) {
            alert("There was some internal error, Please try again later")
        }
    });
    return resp;
}

function createTocFile(docId) {

    var resp;
    jQuery.ajax({
        type: "POST",
        url: "/caas/createTocFile",
        data: JSON.stringify({ 'docId': docId}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue
        },
        async: false,
        success: function (result) {
            resp = result;
        },
        error: function (e) {
            alert("There was some internal error while updating, please try again after sometime")
        }
    });
    return resp;

}

function fetchDocListFromMasterByBrief() {
    var resp = "";
    jQuery.ajax({
        type: "POST",
        url: "/caas/masterDocListByBrief",
        data: JSON.stringify({ language: "en" }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue
        },
        async: false,
        success: function (result) {
            resp = result;
        },
        error: function (e) {
            alert("There was some internal error while fetching data, Please try again after sometime");
        }
    });
    return resp;
}

function fetchCatalogDetails() {
    var resp = "";
    jQuery.ajax({
        type: "GET",
        url: "/caas/fetchCatalogDetails",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookieValue
        },
        success: function (result) {
            resp = result;
        },
        async: false,
        error: function (e) {
            alert("There was some internal error while fetching data, Please try again after sometime");
        }
    });
    return resp;
}

