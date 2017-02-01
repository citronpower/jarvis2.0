angular.module('app').service('sharedService', [ '$localStorage', function ($localStorage) {

        var key = CryptoJS.enc.Base64.parse("MTIzNDU2NzgxMjM0NTY3OA==");
        var iv  = CryptoJS.enc.Base64.parse("EBESExQVFhcYGRobHB0eHw==");

        return {
            getUser: function () {
                var user = $localStorage.user;
                if(user){
                    user = JSON.parse(CryptoJS.AES.decrypt(user, key, {iv: iv}).toString(CryptoJS.enc.Utf8));
                }else{
                    user = null;
                }
                return user;
            },
            setUser: function(value) {

                if(!value){
                    value = null;
                }
                var user = CryptoJS.AES.encrypt(JSON.stringify(value), key, {iv: iv}).toString();

                $localStorage.user = user;
            }
        };
}]);