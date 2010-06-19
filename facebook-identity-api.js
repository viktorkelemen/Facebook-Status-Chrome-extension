FACEBOOK_IDENTITY_API = (function () {


    var usernameRegexp = /id="navAccountName">([^<]*)<\/a>/i,
        logoutLinkRegexp = /(http:\/\/www.facebook\.com\/logout.php?[^"]+)/;
    

    /**
     * It returns the username of the logged user
     *
     * @param callback {Function} This function will be called with the username, username is undefined if there is no user logged in
     */
    function getUserName(callback) {

        var currentUser, 
            logoutLink = "";

        VAIKE.xhr.sendXHR('http://www.facebook.com/login.php', function (xhr) {
            
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