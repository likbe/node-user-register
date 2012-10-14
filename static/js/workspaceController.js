angular.module("WorkspaceListModule", ['ngResource']);

function WorkspaceCtrl($scope, $http) {
    $scope.workspaceList = function(){
        $scope.workspaces = [];
        $http.get('/services/workspacesList').
        success(function(data, status, headers, config) {
            angular.forEach(data, function(workspace) {
                workspace.creationDate = moment(workspace.creationDate).fromNow();
                $scope.workspaces.push(workspace);
            });
        });
    }
}

angular.module('LikbeApp', ['WorkspaceListModule', 'userProfileModule'])
