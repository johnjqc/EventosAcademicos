


function checkLanguage() {
    navigator.globalization.getPreferredLanguage(
        function (language) {
            alert(language.value);
            return language.value;
        },
        function () {alert('Error getting language\n');}
    );

    navigator.globalization.getLocaleName(
        function (locale) {alert('locale: ' + locale.value + '\n');},
        function () {alert('Error getting locale\n');}
    );
}

function updateGlobalization(){
      navigator.globalization.getPreferredLanguage(
              function (language) {document.getElementById("globInfo").innerHTML = 'Preferred Language: '+ language.value;},
              function () {document.getElementById("globInfo").innerHTML = 'Error getting language';}
            );

   }

   function updateGlobalization1(){
         navigator.globalization.getLocaleName(
                    function (locale) {document.getElementById("globInfo").innerHTML = 'Locale: ' + locale.value;
                    $("globInfo").html("Locale Name: " + locale.value + "<br/>");},
                    function () {document.getElementById("globInfo").innerHTML = 'Error getting locale';}
                  );

      }

$(function() {

$('#getLocaleName').bind('tap', function(e) { console.log('User tapped1 #myElement');  updateGlobalization();});
$('#getPreferredLanguage').bind('tap', function(e) { console.log('User tapped1 #myElement');  updateGlobalization1();});

    var globalizationManager = GlobalizationManager.getInstance();

    $(document).on("pageinit", "#globalization", function(e) {
        e.preventDefault();

        $("#getLocaleName").on("tap", function(e) {
            e.preventDefault();
            var callback = {};
            callback.onSuccess = handleLocaleSuccess;
            callback.onError = handleLocaleError;
            globalizationManager.getLocaleName(callback);
        });

        $("#getPreferredLanguage").on("tap", function(e) {
            e.preventDefault();
            var callback = {};
            callback.onSuccess = handleLangSuccess;
            callback.onError = handleLangError;
            globalizationManager.getPreferredLanguage(callback);
        });
    });

    function handleLocaleSuccess(locale) {
        $("#globInfo").html("Locale Name: " + locale.value + "<br/>");
    }

    function handleLocaleError(locale) {
        $("#globInfo").html("Locale Name: Error<br/>");
    }

    function handleLangSuccess(languaje) {
        $("#globInfo").html("Locale Name: " + languaje.value + "<br/>");
    }

    function handleLangError(languaje) {
		$("#globInfo").html("Locale Name: Error<br/>");
	}

})();

var GlobalizationManager = (function () {
	var instance;
	
	function createObject(){
		return { 
			getLocaleName: function (callback) {
				navigator.globalization.getLocaleName(callback.onSuccess, callback.onError);
			},
			getPreferredLanguage: function (callback) {
				navigator.globalization.getPreferredLanguage(callback.onSuccess, callback.onError);
			}
		};
	};
	
	return {
		getInstance: function () { alert(1);
			if (!instance) {
				instance = createObject();
			}
			
			return instance;
		}
	};
})();