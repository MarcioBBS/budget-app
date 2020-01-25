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
            ID = data.allItems[type][data.allItems[type].length -1].id + 1;
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
      inputButton: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list',
   };

   return {
      getInput: function() {
         return {
            type: document.querySelector(DOMSTrings.inputType).value, // inc or exp (Specified in the html)
            description: document.querySelector(DOMSTrings.inputDescription).value,
            value: document.querySelector(DOMSTrings.inputValue).value
         }         
      },

      addListItem: function(obj, type) {
         var html, newHTML, element;

         // Create HTML string with placeholder text
         if (type === 'inc') {
            element = DOMSTrings.incomeContainer;

            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

         } else if (type === 'exp') {
            element = DOMSTrings.expensesContainer;

            html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
         }       

         // Replace the placeholder text with with actual data
         newHTML = html.replace('%id%', obj.id);
         newHTML = newHTML.replace('%description%', obj.description);
         newHTML = newHTML.replace('%value%', obj.value);

         // Insert HTML into the DOM
         document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
      },

      clearFields: function() {
         var fields, fieldsArr;
         
         fields = document.querySelectorAll(DOMSTrings.inputDescription + ', ' + DOMSTrings.inputValue );

         // List to an array
         fieldsArr = Array.prototype.slice.call(fields);

         fieldsArr.forEach(function(current, index, array){
            current.value = "";
         });

         // Set focus to the description
         fieldsArr[0].focus();
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
      var input, newItem

      // Get the field input data
      input = UIController.getInput();

      // Add the item to the budget controller      
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);      

      // Add the item to the UI
      UIctrl.addListItem(newItem, input.type);

      // Clear the fields
      UIctrl.clearFields(); 

      // Calculate the budget

      // Display the budget on the UI       
      
   }

   return {
      init: function() {
         setupEventListeners();
         console.log('Applicaton has started');
      }
   }   

})(budgetController, UIController);

controller.init();