// BUDGET CONTROLLER
var budgetController = (function() {
   

})();


// UI CONTROLLER
var UIController = (function () {

    // To be defined

})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UIctrl) {


   var ctrlAddItem  = function() {
      // Get the field input data

      // Add the item to the budget controller

      // Add the item to the UI

      // Calculate the budget

      // Display the budget on the UI            
   }

   document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

   document.addEventListener('keypress', function(evt) {
      if (evt.keyCode === 13 || evt.which === 13) {
         ctrlAddItem();
      }
      
   });

})(budgetController, UIController);