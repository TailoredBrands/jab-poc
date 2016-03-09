(function() {
  'use strict';

  angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'

  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider'];

  function config($urlProvider, $locationProvider) {
    $urlProvider.otherwise('/');

    $locationProvider.html5Mode({
      enabled:false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    FastClick.attach(document.body);
  }

  // START CUSTOM APP CODE


  angular.module('application').controller('TasksController', TasksController);
  angular.module('application').controller('CheckoutController', CheckoutController);
  angular.module('application').controller('CheckoutTabsController', CheckoutController);


  TasksController.$inject = ['$scope', '$stateParams', '$state', '$controller'];
  CheckoutController.$inject = ['$scope', '$stateParams', '$state', '$controller'];
  CheckoutTabsController.$inject = ['$scope', '$stateParams', '$state', '$controller'];


  // Start TasksController 
  function TasksController($scope, $stateParams, $state, $controller) {

    angular.extend(this, $controller('DefaultController', {$scope: $scope, $stateParams: $stateParams, $state: $state}));

    // localStorage.removeItem("saved_tasks");
    // localStorage.removeItem("all_tags");

    $scope.editMode = true;

    $scope.showstatus = 'incomplete';

    $scope.showtag = {};

    $scope.tasks = JSON.parse(localStorage.getItem("saved_tasks"));
    if (typeof $scope.tasks === 'undefined' || $scope.tasks === null){
      $scope.tasks = [];
    }

    $scope.allTags = JSON.parse(localStorage.getItem("all_tags"));
    if (typeof $scope.allTags === 'undefined' || $scope.allTags === null){
      $scope.allTags = [];
    }

    $scope.CreateTask = function(title, body, tags){
      var task = {};

      task.title = title;
      task.body = body;
      task.status = 'incomplete';
      task.color = '';

      // Convert comma separated tags into array
      tags = tags.replace(/, /g, ',');
      task.tags = tags.split(',');

      // Combine all task tag arrays into allTags array
      $scope.allTags = $scope.allTags.concat(task.tags);

      // Strip duplicate tags
      $scope.allTags = $scope.allTags.filter(function(element, index) {
        return $scope.allTags.indexOf(element) == index;
      }); 

      // Set unique ID from current timestamp
      task.id = Date.now();

      $scope.tasks.push(task);

      localStorage.setItem("all_tags", JSON.stringify($scope.allTags));
      localStorage.setItem("saved_tasks", JSON.stringify($scope.tasks));
    };

    $scope.DeleteTask = function(id){

      // Store the tags used by this task
      var these_tags;

      // Delete task
      $scope.tasks = $scope.tasks.filter(function(element) {
        if (element.id != id) {
          // Add non-targeted element back into the array
          return element;
        } else {
          // When target is found, store the tags is uses
          these_tags = element.tags;
        }
      });

      // Check if this theme's tags used by other tasks
      // If not, delete from "allTags"
      for (var tag = 0; tag < these_tags.length; tag++) {

        var check_tag = these_tags[tag];

        for (var i = 0; i < $scope.tasks.length; i++) {
          var this_task = $scope.tasks[i];
          var tag_on_other = ( this_task.tags.indexOf(check_tag) == -1 ) ? false : true;

          if (!tag_on_other){
            $scope.allTags = $scope.allTags.filter(function(element) {
              return element != check_tag;
            });
          }
        }

      }
      
      // Update local storage
      localStorage.setItem("all_tags", JSON.stringify($scope.allTags));
      localStorage.setItem("saved_tasks", JSON.stringify($scope.tasks));
    };

    $scope.UpdateTags = function(id){

      var findTask = $scope.tasks.filter(function(element) {
        if (element.id == id) {
          // return element to be updated when found
          var tags = element.tags.replace(/, /g, ',');
          element.tags = tags.split(',');

          return element;

        } else {

          return element;

        }
      });

    }

    $scope.UpdateTasks = function(){

      // Empty allTags to rebuild
      $scope.allTags = [];

      // Get all task tags
      for (var i = 0; i < $scope.tasks.length; i++) {
        $scope.allTags = $scope.allTags.concat($scope.tasks[i].tags);
      }

      // Strip duplicate tags
      $scope.allTags = $scope.allTags.filter(function(element, index) {
        return $scope.allTags.indexOf(element) == index;
      });

      localStorage.setItem("all_tags", JSON.stringify($scope.allTags));
      localStorage.setItem("saved_tasks", JSON.stringify($scope.tasks));

    }

    $scope.SetTaskColor = function(id, color){

      var findTask = $scope.tasks.filter(function(element) {
        if (element.id == id) {

          element.color = color;
          return element;

        } else {

          return element;

        }
      });
      
      localStorage.setItem("saved_tasks", JSON.stringify($scope.tasks));

    }

    $scope.SetTaskStatus = function(id, status){

      var findTask = $scope.tasks.filter(function(element) {
        if (element.id == id) {

          element.status = status;
          return element;

        } else {

          return element;

        }
      });
      
      localStorage.removeItem("saved_tasks");
      localStorage.setItem("saved_tasks", JSON.stringify($scope.tasks));

      $scope.tasks = JSON.parse(localStorage.getItem("saved_tasks"));

    }

  }
  // End TasksController


  // Start CheckoutController
  function CheckoutController($scope, $stateParams, $state, $controller) {
    angular.extend(this, $controller('DefaultController', {$scope: $scope, $stateParams: $stateParams, $state: $state}));
    
    $scope.editSignInMode = true;
    $scope.editShippingMode = false;
    $scope.editBillingMode = false;
    $scope.editOrderReviewMode = false;

    $scope.checkout = JSON.parse(localStorage.getItem("saved_tasks"));

    if (typeof $scope.checkout === 'undefined' || $scope.checkout === null){
      $scope.checkout = [];
    }

    $scope.UpdateSignInFields = function(){
      localStorage.setItem("saved_tasks", JSON.stringify($scope.checkout));
      $scope.editShippingMode = true;
    }

    $scope.UpdateShippingFields = function(){
      localStorage.setItem("saved_tasks", JSON.stringify($scope.checkout));
      $scope.editBillingMode = true;
    }

    $scope.UpdateBillingFields = function(){
      localStorage.setItem("saved_tasks", JSON.stringify($scope.checkout));
      $scope.editOrderReviewMode = true;
    }
    $scope.UpdateOrderReviewFields = function(){
      localStorage.setItem("saved_tasks", JSON.stringify($scope.checkout));
    }
  }
  // END CheckoutController

  // Start CheckoutTabsController
  function CheckoutController($scope, $stateParams, $state, $controller) {
    angular.extend(this, $controller('DefaultController', {$scope: $scope, $stateParams: $stateParams, $state: $state}));
    
  }
  // END CheckoutTabsController


  // END CUSTOM APP CODE

})();
