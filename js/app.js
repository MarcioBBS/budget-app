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

   var calculateTotal = function(type) {
      var sum = 0;

      data.allItems[type].forEach(function(current) {
         sum += current.value;
      });

      data.totals[type] = sum;
   }

   var data = {
      allItems: { // It storages the object containing the id, description and value - For Expenses and Incomes
         exp: [],
         inc: []
      },
      totals: { // It storages the total sum of Expenses/Incomes
         exp: 0,
         inc: 0
      },
      budget: 0, // It storages the global budget
      percentage: -1 // non existence. It's the percentage of the expenses from the global budget.
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

      calculateBudget: function() {

         // Calculate total income and expenses
         calculateTotal('inc');
         calculateTotal('exp');

         // Calculate the budget: income - expenses
         data.budget = data.totals.inc - data.totals.exp;

         // Calculate the percentage of spent income.
         if (data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
         } else {
            data.percentage = -1; // non existence
         }
         
      },

      getBudget: function() {
         return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
         };
      },

      testing: function() {
         return data;
      }      
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
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage'
   };

   return {
      getInput: function() {
         return {
            type: document.querySelector(DOMSTrings.inputType).value, // inc or exp (Specified in the html)
            description: document.querySelector(DOMSTrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMSTrings.inputValue).value)
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

         // Convert list to an array
         fieldsArr = Array.prototype.slice.call(fields);

         fieldsArr.forEach(function(current, index, array){
            current.value = "";
         });

         // Set focus to the description
         fieldsArr[0].focus();
      },

      displayBudget: function(obj) {         
         document.querySelector(DOMSTrings.budgetLabel).textContent =  '+ ' + obj.budget;
         document.querySelector(DOMSTrings.incomeLabel).textContent = '+ ' + obj.totalInc;
         document.querySelector(DOMSTrings.expensesLabel).textContent =  '- ' +  obj.totalExp;
         
         if (obj.percentage > 0) {
            document.querySelector(DOMSTrings.percentageLabel).textContent = obj.percentage + '%';
         } else {
            document.querySelector(DOMSTrings.percentageLabel).textContent = '---'
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
      var DOM = UIctrl.getDOMStrings();
      
      document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
      document.addEventListener('keypress', function(evt) {
         if (evt.keyCode === 13 || evt.which === 13) {
            ctrlAddItem();
         }
      
      });
   };

   var updateBudget = function() {
      // Calculate the budget
      budgetCtrl.calculateBudget();

      // Return the budget
      var budget = budgetCtrl.getBudget();

      // Display the budget on the UI
      UIctrl.displayBudget(budget);
   }

   var ctrlAddItem  = function() {

      var input, newItem

      // Get the field input data
      input = UIctrl.getInput();

      // Verify if the fields are not empty, and value bigger than 0
      if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

         // Add the item to the budget controller      
         newItem = budgetCtrl.addItem(input.type, input.description, input.value);      

         // Add the item to the UI
         UIctrl.addListItem(newItem, input.type);

         // Clear the fields
         UIctrl.clearFields();       
         
         // Calculate and update budget
         updateBudget();
      }      
      
   };

   return {
      init: function() {
         console.log('Applicaton has started');
         UIctrl.displayBudget({
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: -1
         });
         setupEventListeners();
      }
   };  

})(budgetController, UIController);

controller.init();