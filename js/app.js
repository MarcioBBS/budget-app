// BUDGET CONTROLLER
var budgetController = (function() {
   

})();


// UI CONTROLLER
var UIController = (function () {

   var DOMSTrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputButton: '.add__btn'
   };

   return {
      getInput: function() {
         return {
            type: document.querySelector(DOMSTrings.inputType).value,
            description: document.querySelector(DOMSTrings.inputDescription).value,
            value: document.querySelector(DOMSTrings.inputValue).value
         }         
      },
      getDOMStrings: function() {
         return DOMSTrings;         
      }
   };
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UIctrl) {

   var setupEventListeners = function() {
      var DOM = UIController.getDOMStrings();

      document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
      document.addEventListener('keypress', function(evt) {
         if (evt.keyCode === 13 || evt.which === 13) {
            ctrlAddItem();
         }
      
      });
   }

   var ctrlAddItem  = function() {
      // Get the field input data
      var values = UIController.getInput();
      console.log(values);
      // Add the item to the budget controller

      // Add the item to the UI

      // Calculate the budget

      // Display the budget on the UI            
   }

   return {
      init: function() {
         setupEventListeners();
      }
   }   

})(budgetController, UIController);

controller.init();