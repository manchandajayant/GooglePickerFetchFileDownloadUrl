// Load GAPI from CDN
// var googleAPIPickerScript = document.createElement('script');
// googleAPIPickerScript.setAttribute('src','https://apis.google.com/js/api.js?onload=loadPicker');
// document.head.appendChild(googleAPIPickerScript);

// The Browser API key obtained from the Google API Console.
// Replace with your own Browser API key, or your own key.
var developerKey = "AIzaSyCEQtG69HxG1mm5MmU6ktxeJL4ZjhK0YQA";

// The Client ID obtained from the Google API Console. Replace with your own Client ID.
var clientId =
  "986098807831-itas6baqjdu5v4o7tqdq3h342o1m4jod.apps.googleusercontent.com";

// Replace with your own project number from console.developers.google.com.
// See "Project number" under "IAM & Admin" > "Settings"
var appId = "967714590070";

// Scope to use to access user's Drive items.
var scope = "https://www.googleapis.com/auth/drive.file";

var pickerApiLoaded = false;

var oauthToken;
var audioArrayBuffer;
var downloadUrl;
var downloadUrl;
var urL;
var fileId;

function button() {
  loadPicker();
}

// Use the Google API Loader script to load the google.picker script.
function loadPicker() {
  gapi.load("auth", { callback: onAuthApiLoad });
  gapi.load("picker", { callback: onPickerApiLoad });
}
// function loadClient() {
//   gapi.client.load("drive", "v2", { callback: initClient });
// }
function onAuthApiLoad() {
  window.gapi.auth.authorize(
    {
      client_id: clientId,
      scope: scope,
      immediate: false,
    },
    handleAuthResult
  );
}

function onPickerApiLoad() {
  pickerApiLoaded = true;
  createPicker();
}

function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    oauthToken = authResult.access_token;
    createPicker();
  }
}

// Create and render a Picker object for searching images.
function createPicker() {
  if (pickerApiLoaded && oauthToken) {
    var view = new google.picker.View(google.picker.ViewId.DOCS);
    view.setMimeTypes("audio/wav");
    //view.setMimeTypes("text/html");
    var picker = new google.picker.PickerBuilder()
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
      .setAppId(appId)
      .setOAuthToken(oauthToken)
      .addView(view)
      .addView(new google.picker.DocsUploadView())
      .setDeveloperKey(developerKey)
      .setCallback(pickerCallback)

      .build();
    picker.setVisible(true);
  }
}

function pickerCallback(data) {
  if (data.action == google.picker.Action.PICKED) {
    //fileId = data.docs[0].url;
    fileId = data.docs[0].id;
    var audio = document.getElementById("my-audio");
    console.log(data);
    // audio.src = fileId;
  }
}

async function fetchDownloadUrl() {
  gapi.load("client", function () {
    gapi.client.load("drive", "v2", function () {
      gapi.client.setApiKey(developerKey);
      console.log(gapi.auth.getToken().access_token);
      gapi.client.setToken(gapi.auth.getToken().access_token);
      var file = gapi.client.drive.files.get({
        fileId: fileId,
      });
      file.execute(function (resp) {
        downloadUrl = resp.webContentLink; //this is the download link
        console.log(downloadUrl);
        let u = downloadUrl.split("&"); //download split from the url
        urL = u[0];
      });
    });
  });
}

async function fetchUrl() {
  const fetchAudioData = `https://cors-anywhere.herokuapp.com/${urL}`; //works with the africa-toto link and the locals assets folder
  // "https://cors-anywhere.herokuapp.com/http://www.ee.columbia.edu/~dpwe/sounds/music/africa-toto.wav";

  const response = await fetch(fetchAudioData);
  console.log(response);
  audioArrayBuffer = await response.arrayBuffer();
  console.log(audioArrayBuffer);
}
