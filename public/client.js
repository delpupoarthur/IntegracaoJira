// client-side js
// run by the browser each time your view template is loaded


window.mdc.autoInit();

(function(global) {
  'use strict';
  console.log("initing")
  var MDCSnackbar = global.mdc.snackbar.MDCSnackbar;
  var snackbar = new MDCSnackbar(document.getElementById('mdc-js-snackbar'));
  
  //Radio setup
  var MDCFormField = global.mdc.formField.MDCFormField;
  var MDCRadio = global.mdc.radio.MDCRadio;
  
  var formFields = document.querySelectorAll('.mdc-form-field');
  for (var i = 0, formField; formField = formFields[i]; i++) {
    var formFieldInstance = new MDCFormField(formField);
    
    var radio = formField.querySelector('.mdc-radio:not([data-demo-no-js])');
    if (radio) {
      var radioInstance = new MDCRadio(radio);
      formFieldInstance.input = radioInstance;
    }
  }
  
  
  var show = function(sb, theMessage) {
    var data =  {
      message: theMessage,
      multiline: false
    };
    
    sb.show(data);
  }
  
  var button = document.getElementById('button-generate')
  button.addEventListener('click', function(evt) {
    var discordHookUrl = evt.target.elements.url.value;
    var error = false
    if (discordHookUrl) {
      discordHookUrl = discordHookUrl.replace("discordapp.com", "skyhook.glitch.me")
      //add the provider
      //TODO fix
      var index = 0
      switch(index) {
        case 0:
        discordHookUrl = discordHookUrl + "/appveyor"
        break;
        case 1:
        discordHookUrl = discordHookUrl + "/circleci"
        break;
        case 2:
        discordHookUrl = discordHookUrl + "/gitlab"
        break;
        case 3:
        discordHookUrl = discordHookUrl + "/travis"
        break;
        default:
        error = true
        break;
      }
    } else {
      error = true
    }
    
    if (!error){
      window.copyToClipboard(discordHookUrl);
      show(snackbar, "URL Generated. Copied to Clipboard");
    } else {
      show(snackbar, "Unable to create URL. Please fill in all fields");
    }
  });
  
  button.addEventListener("click", function(){ alert("Hello World!"); });
  
})(this);
