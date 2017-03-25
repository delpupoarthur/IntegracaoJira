// client-side js
// run by the browser each time your view template is loaded


window.mdc.autoInit();
    
(function(global) {
    'use strict';

    var MDCSnackbar = global.mdc.snackbar.MDCSnackbar;
    var snackbar = new MDCSnackbar(document.getElementById('mdc-js-snackbar'));

    var show = function(sb) {
        var data =  {
          message: "URL Generated. Copied to Clipboard",
          multiline: false
        };

        sb.show(data);
    }

    document.getElementById('greeting-form').addEventListener('submit', function(evt) {
      evt.preventDefault();
      var discordHookUrl = evt.target.elements.url.value;
      if (discordHookUrl) {
        discordHookUrl = discordHookUrl.replace("discordapp.com", "skyhook.glitch.me")
        //add the provider
        var index = select.selectedIndex
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
        }

      }
      console.log(discordHookUrl)
      show(snackbar);

      window.copyToClipboard(discordHookUrl);
    });

    var MDCSelect = mdc.select.MDCSelect;
    var selectElement = document.getElementById('js-select');
    var select = MDCSelect.attachTo(selectElement);

  })(this);
