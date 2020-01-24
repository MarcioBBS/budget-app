// BUDGET CONTROLLER
var budgetController = (function() {
   
   var Expense = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
   };

   var Income = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
   };

   var data = {
      allItems: {
         exp: [],
         inc: []
      },
      totals: {
         exp: 0,
         inc: 0
      }
   };

   return {
      addItem: function(type, desc, val) {
         var newItem, ID;

         // Create new ID
         if (data.allItems[type].length > 0) {
            ID = data.allItems[type][data.allItems[type].length -1].id + 1; // By Jonas
         } else {
            ID = 0;
         }

         // Create new Item based on 'inc' or 'exp'
         if (type === 'exp') {
            newItem = new Expense(ID, desc, val);
         } else if (type === 'inc') {
            newItem = new Income(ID, desc, val);
         }

         // Push into the data structure, Array
         data.allItems[type].push(newItem); 

         // Returning the new element
         return newItem;
      },

      data
   };

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
            type: document.querySelector(DOMSTrings.inputType).value, // inc or exp (Specified in the html)
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

      /*
       * Why two event listeners? Because one is for the mouse click and the second is
       * for when the enter key (13 code) is pressed
      */ 
      document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
      document.addEventListener('keypress', function(evt) {
         if (evt.keyCode === 13 || evt.which === 13) {
            ctrlAddItem();
         }
      
      });
   }

   var ctrlAddItem  = function() {
      var input, newItem

      // Get the field input data
      input = UIController.getInput();

      // Add the item to the budget controller      
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);      

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