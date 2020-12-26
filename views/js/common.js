var cookieName = 'IBM-W3-OIDC-SE';
function is_valid_url(url) {
  return /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(url);
}

function is_valid_email(emailId) {
  /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
  var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (filter.test(emailId)) {
    return true;
  } else {
    return false;
  }
}

function readCookie() {
  var nameEQ = cookieName + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function timeStampToDate(timeStamp) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  var date = new Date(parseInt(timeStamp));
  return date.getDate() + '-' + monthNames[date.getMonth()] + '-' + date.getFullYear();
}

function uploadImage(base64Data, imageName, docId) {

  var imageData = {
    base64Image: base64Data,
    imageName: imageName,
    imageType: base64Data.substring("data:image/".length, base64Data.indexOf(";base64")),
    docId: docId
  }
  return createImageFile(imageData);
}

function renderImage(e) {
  return new Promise((resolve, reject) => {
    if (e[0].files && e[0].files[0]) {
      var FR = new FileReader();
      FR.addEventListener("load", function (e) {
        resolve({ image: e.target.result });
      });
      FR.readAsDataURL(e[0].files[0]);
    }
  });
}

function imagageType(image) {

  var imageType = ""
  if (image = 'png') {
    imageType = 'image/png';
  } else if (image = 'gif') {
    imageType = 'image/gif';
  } else {
    imageType = 'image/jpeg';
  }
  return imageType;
}


function checkRespStatus(resp) {

  if (resp.statusCode != 200) {
    alert('There was some internal error while uploading data');
    throw new Error("There was some internal error while uploading data");
  }
}

function showProdListPage(url) {

  var data = JSON.parse(sessionStorage.getItem('firstPageData'));
  data['dataFromUsecase'] = true;
  sessionStorage.clear();
  sessionStorage.setItem('firstPageData', JSON.stringify(data));
  location.href = url;
}

function escapeHtml(text) {
  return text
       .replaceAll("&amp;",'&')
       .replaceAll("&lt;",'<')
       .replaceAll("&gt;",'>')
       .replaceAll("&quot;",'"')
       .replaceAll("&#039;","'");
}

function escapeSpecialCharacter(text){
  return text
          .replaceAll('`','\\`')
          .replaceAll('`','\\`')
          .replaceAll('!','\\!')
          .replaceAll('@','\\@')
          .replaceAll('#','\\#')
          .replaceAll('$','\\$')
          .replaceAll('%','\\%')
          .replaceAll('^','\\^')
          .replaceAll('&','\\&')
          .replaceAll('*','\\*')
          .replaceAll('(','\\(')
          .replaceAll(')','\\)')
          .replaceAll('+','\\+')
          .replaceAll('=','\\=')
          .replaceAll('{','\\{')
          .replaceAll('}','\\}')
          .replaceAll('[','\\[')
          .replaceAll(']','\\]')
          .replaceAll('|','\\|')
          .replaceAll(':','\\:')
          .replaceAll(';','\\;')
          .replaceAll('<','\\<')
          .replaceAll('>','\\>')
          .replaceAll(',','\\,')
          .replaceAll('.','\\.')
          .replaceAll('?','\\?')
          .replaceAll('/','\\/');

}
