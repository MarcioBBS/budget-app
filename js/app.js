// BUDGET CONTROLLER
var budgetController = (function() {
   
   var Expense = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
   };

   // Calculates the percentage
   Expense.prototype.calcPercentage = function(totalIncome) {
      if (totalIncome > 0) {
         this.percentage = Math.round((this.value / totalIncome) * 100);
      } else {
         this.percentage = -1;
      }
   };

   // Return the percentage
   Expense.prototype.getPercentage = function() {
      return this.percentage;
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

      deleteItem: function(type, id) {
         var ids, index;
    
         ids = data.allItems[type].map(function(current){
            return current.id;
         });

         index = ids.indexOf(id);

         if (index !== -1) {
            data.allItems[type].splice(index, 1);
         }
      },     

      calculatePercentages: function() {
         data.allItems.exp.forEach(function(current){
            current.calcPercentage(data.totals.inc);
         });
      },

      getPercentages: function() {
         var allPerc = data.allItems.exp.map(function(current){
            return current.getPercentage();
         });

         return allPerc;
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
      percentageLabel: '.budget__expenses--percentage',
      container: '.container',
      expensesPercLabel: '.item__percentage'
   };

   var formatNumber = function(num, type) {
      var numSplit, int, dec;

      num = Math.abs(num); // Remove the signal of the number ( - or +)
      num = num.toFixed(2); // Add the decimal and returns a String representing the given number using fixed-point notation.

      numSplit = num.split('.');
      int = numSplit[0];

      //Add the comma if it's thousands
      if (int.length > 3) {
         int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // input 23510, output 23,510
      }

      dec = numSplit[1];

      return (type === 'exp'? '-' : '+') + ' ' + int + '.' + dec;

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
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            
         } else if (type === 'exp') {
            element = DOMSTrings.expensesContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
         }       

         // Replace the placeholder text with with actual data
         newHTML = html.replace('%id%', obj.id);
         newHTML = newHTML.replace('%description%', obj.description);
         newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

         // Insert HTML into the DOM
         document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
      },

      deleteListItem: function(selectorID) {
         var el = document.getElementById(selectorID);
         el.parentNode.removeChild(el);
      },

      clearFields: function() {
         var fields, fieldsArr;
         
         fields = document.querySelectorAll(DOMSTrings.inputDescription + ', ' + DOMSTrings.inputValue );

         // Convert Nodelist to an array
         fieldsArr = Array.prototype.slice.call(fields);

         fieldsArr.forEach(function(current, index, array){
            current.value = "";
         });

         // Set focus to the description
         fieldsArr[0].focus();
      },

      displayBudget: function(obj) {
         var type;

         obj.budget > 0 ? type = 'inc' : type = 'exp';

         document.querySelector(DOMSTrings.budgetLabel).textContent = formatNumber(obj.budget, type);
         document.querySelector(DOMSTrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
         document.querySelector(DOMSTrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
         
         if (obj.percentage > 0) {
            document.querySelector(DOMSTrings.percentageLabel).textContent = obj.percentage + '%';
         } else {
            document.querySelector(DOMSTrings.percentageLabel).textContent = '---';
         }
      },

      displayPercentages: function(percentages) {
         var fields = document.querySelectorAll(DOMSTrings.expensesPercLabel);

         var nodeListForEach = function(list, callback) {
            for (var i = 0; i < list.length; i++) {
               callback(list[i], i);
            }
         };

         nodeListForEach(fields, function(current, index){
            if (percentages[index] > 0) {
               current.textContent = percentages[index] + '%';
            } else {
               current.textContent = '---';
            }
         });
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

      document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem); // Using Event Delegation
   };

   var updateBudget = function() {
      // Calculate the budget
      budgetCtrl.calculateBudget();

      // Return the budget
      var budget = budgetCtrl.getBudget();

      // Display the budget on the UI
      UIctrl.displayBudget(budget);
   };

   var updatePercentages =  function() {
      // Calculate percentages
      budgetCtrl.calculatePercentages();
      // Read percentages from the budget controller
      var percentages = budgetCtrl.getPercentages();

      // Update the UI with the new percentages.
      UIctrl.displayPercentages(percentages);
   };

   var ctrlAddItem  = function() {

      var input, newItem;

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

         // Calculate and update percentages
         updatePercentages();
      }      
      
   };

   var ctrlDeleteItem = function(event) {
      var itemID, splitID, type, ID;
      itemID = event.target.closest('.item').id; // Using closest method for DOM tranversing

      if (itemID) {
         splitID = itemID.split('-');
         type = splitID[0];
         ID = parseInt(splitID[1]);

         // Delete the intem from the data structure
         budgetCtrl.deleteItem(type, ID);

         // Delete the item from the UI
         UIctrl.deleteListItem(itemID);

         // Update and how the new budget.
         updateBudget();

         // Calculate and update percentages
         updatePercentages();
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