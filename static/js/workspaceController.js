angular.module("WorkspaceListModule", ['ngResource']);

function WorkspaceCtrl($scope, $http) {
    $scope.workspaceList = function(){
        $http.get('/services/workspacesList').
        success(function(data, status, headers, config) {
            $scope.workspaces = data;
        });
    }
}

angular.module('LikbeApp', ['WorkspaceListModule', 'userProfileModule'])
