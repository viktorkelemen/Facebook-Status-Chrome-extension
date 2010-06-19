FACEBOOK_IDENTITY_API = (function () {


    var usernameRegexp = /id="navAccountName">([^<]*)<\/a>/i,
        logoutLinkRegexp = /(http:\/\/www.facebook\.com\/logout.php?[^"]+)/;
    
    var lastDate = "";
    

    /**
     * Creates an XHR request, utility function
     *
     * @param {String} url
     * @param {Function} function
     */
    function sendXHR(url, successHandler) {

        var xhr = new XMLHttpRequest();

        var abortTimerId = window.setTimeout(function() {
           xhr.abort();
         }, requestTimeout);

         function handleSuccess() {
           requestFailureCount = 0;
           window.clearTimeout(abortTimerId);
           if (successHandler !== undefined) {
               successHandler(xhr);
           }
         }

         function handleError() {
           ++requestFailureCount;
           window.clearTimeout(abortTimerId);
         }


        xhr.onreadystatechange = function(data) {
            
            if (xhr.readyState === 4) {
                lastDate = xhr.getResponseHeader("Date");
                handleSuccess();
            }
        };

        xhr.onerror = function(error) {
             handleError();
        };


        xhr.open('GET', url, true);
        xhr.setRequestHeader("Cache-Control","max-stale");
        // xhr.setRequestHeader("Cache-Control","max-stale");
        if (lastDate !== "") {
            xhr.setRequestHeader("If-Modified-Since", lastDate);
        }
        xhr.send();
    }

    /**
     * It returns the username of the logged user
     *
     * @param callback {Function} This function will be called with the username, username is undefined if there is no user logged in
     */
    function getUserName(callback) {

        var currentUser, 
            logoutLink = "";

        sendXHR('http://www.facebook.com/login.php', function (xhr) {
            
            if (xhr.status === 200) {
                var m = usernameRegexp.exec(xhr.responseText);
                if (m != null && m.length == 2) {
                    currentUser = m[1];
                }
                
                 m = logoutLinkRegexp.exec(xhr.responseText);
                 if (m != null && m.length == 2) {
                     logoutLink = m[1];
                 }   
            }
            
            // we have a response anyway
            if (callback !== undefined) {
                callback(currentUser, logoutLink);
            }
        });
    }

    return {
        getUserName: getUserName
    };
})();