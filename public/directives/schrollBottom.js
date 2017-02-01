/**
 * Created by Louis on 30.01.2017.
 */
angular.module('app').directive('schrollBottom', function () {
    return {
        scope: {
            schrollBottom: "="
        },
        link: function (scope, element) {
            scope.$watchCollection('schrollBottom', function (newValue) {
                if (newValue)
                {
                    $(element).scrollTop($(element)[0].scrollHeight);
                }
            });
        }
    }
})