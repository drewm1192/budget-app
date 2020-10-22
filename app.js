


/*
BUDGET CONTROLLER
We use an IIFE  for data security. Data within here lies in its
own scope and keeps data private.
*/
var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    //Get the percent of income each expense is.
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round(this.value/totalIncome * 100);
        }
        else{
            this.percentage = -1;
        }
    };

    //Getter for an expense's percentage
    Expense.prototype.getPercentage = function(){
        return this.percentage
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //Gets the sum of all elements in either expenses or income
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });
        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    

    return {
        addItem: function(type, des, value){
            //Instantiate new items
            var newItem, ID;
            //Create new ID by getting the last element's ID and adding 1
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            //Create new item based on inc or exp type
            if(type === "exp"){
                newItem = new Expense(ID, des, value);
            }
            else if(type === "inc"){
                newItem = new Income(ID, des, value)
            }
            //Add it to the data structure.
            data.allItems[type].push(newItem);
            //Return the new item.
            return newItem;
        },

        /*
        /Deletes an item from the DS once the x is clicked.
        */
        deleteItem: function(type, id){
            var ids, index;
            //Creates a new array of all the elements.
            ids = data.allItems[type].map(function(cur){
                return cur.id;
            });
            //Returns the index of the inputted element to deleteItem()
            index = ids.indexOf(id);

            if(index !== -1){
                //Removes elements from index to just index (1 is num elements)
                data.allItems[type].splice(index,1);
            }
        },

        calculateBudget: function(){
          
            //Calculate total income and expenses
            calculateTotal("inc");
            calculateTotal("exp");
            //Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            //Calcualte the percentage of income that we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else{
                data.percentage = -1;
            }
        },

        //Calculates the percentage for each expense
        calculatePercentages: function(){ 
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        //Gets the array of all expenses and their percentages
        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },

        //Getter for the overall budget
        getBudget: function(){

            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },

        testing: function(){
            console.log(data);
        }
    }

//The parentheses here () automatically invoke the function.
})();

/**
 * UI CONTROLLER
 * User interface controller. It is independent of the budgetController.
 */
var UIController = (function(){

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputButton: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPercentageLabel: ".item__percentage",
        dateLabel: '.budget__title--month'
    }

    //Set to format all numbers
    var formatNumber = function(num, type){
        var numSplit, int, dec;
        num = Math.abs(num);
        //Adds decimals.
        num = num.toFixed(2);
        numSplit = num.split(".");
        int = numSplit[0];
        if(int.length > 3){
            int = int.substr(0,int.length-3) + "," + int.substr(int.length-3,3);
        }

        dec = numSplit[1];
        
        return (type === "exp" ? '-': '+') + ' ' + int + '.' + dec;
    };

    return {
        getInput: function(){
            return {
            //returns the html value field (inc or exp)
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }

        },

        //Adds elements to the page.
        addListItem: function(obj, type){
            //Instantiate variables
            var html, newHtml, element;
            //Create HTML string with placeholder text
            if(type === "inc"){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === "exp"){
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //Replace the placeholder text with some actual data
            newHtml = html.replace("%id%",obj.id);
            newHtml = newHtml.replace("%description%",obj.description);
            newHtml = newHtml.replace("%value%", formatNumber(obj.value,type));
            console.log(newHtml);
            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);
        },

        /**
         * Deletes an item from the UI.
         */
        deleteListItem: function(selectorId){
            var el = document.getElementById(selectorId);
            //We have to remove a child, can't remove an element itself in JS
            el.parentNode.removeChild(el);
        },

        //This function clears out the fields on the UI.
        clearFields: function(){
            var fields, fieldsArray;
            //To select all, you need a comma between the items.
            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);
            //Fields is a list which we will convert to an array and loop over.
            /**
             * Lists can be converted to an array if we call the array prototype,
             * access the slice() method for arrays, and use it on our list. 
             * Once we get the slice function out, we add "call".
             */
            fieldsArray = Array.prototype.slice.call(fields);
            //Now we use a for each loop. We just use "forEach" and give it a 
            //callback function to apply to each item in the array. This function
            //can receive up to 3 arguments: the current item, the index, and the
            //entire array. Can take any names.
            fieldsArray.forEach(function(current, index, array){
                //Simply select the current and set it to empty.
                current.value = "";
            });
            //Make it so that after the fields are cleared, the blue
            //box focus goes bback to the description field which is 
            //at index 0.
            fieldsArray[0].focus();

        },

        displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type = "inc" : type = "exp";
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,"inc");
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp,"exp");
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";
            }
        },

        displayPercentages: function(percentages){
            //This returns a node list. Each element is a node.
            var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);
            //Now we loop over all of them and change the text property of the percentage field.
            //Use a nodelistforeach since this is not an array
            var nodeListForEach = function(list,callBack){
                for(var i = 0; i < list.length; i++){
                    callBack(list[i],i);
                }
            }
            //This is the call back.
            nodeListForEach(fields, function(cur, index){
                if(percentages[index] > 0){
                    cur.textContent = percentages[index] + '%';
                }
                else{
                    cur.textContent = "---";
                }
            });
        },

        displayMonth: function(){
            var now, year, month, months;
            //Using new because it's an object constructor.
            months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ', ' + year;
        },

        //Getter for the DOMstrings
        getDOMstrings: function(){
            return DOMstrings;
        }
    }


})();

/**
 * GLOBAL APP CONTROLLER
 * App controller. 
 */

 var controller = (function(budgetCtrl,UICtrl){
    
    var setupEventListeners = function(){
        //Get access to all DOM event listeners.
        var DOM = UICtrl.getDOMstrings();
        //Controls the action that occurs when someone clicks the checkmark button
        document.querySelector(DOM.inputButton).addEventListener("click",ctrlAddItem);
        /**
         * We then add an event listener for when someone hits the return
         * key so that it updates the budget when they hit enter. We don't
         * put it on a querySelector or specific ID because this action is not 
         * tied to a specific place on the document. Just if the user hits enter
         * anywhere on the document, it should add if there is something to add.
         * The function in this case takes one argument, which is they key 
         */
        document.addEventListener("keypress",function(event){
            //Which is used by older browsers. Use an or statement for 
            //compatability with other browsers.
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });
        //This enables event bubbling
        document.querySelector(DOM.container).addEventListener("click",ctrlDeleteItem);
    };

    var updatePercentages = function(){

        //Calculate the percentages
        budgetCtrl.calculatePercentages();
        //Read them from budget controller
        var percentages = budgetCtrl.getPercentages();
        //Add them to the UI
        console.log(percentages);
        UICtrl.displayPercentages(percentages);
    };

    var updateBudget = function(){
        //1. Calculate the budget
        budgetCtrl.calculateBudget();
        //2. Return the budget
        var budget = budgetCtrl.getBudget();
        //3. Display the overall budget.
        UICtrl.displayBudget(budget);
    };

    /**
     * This function manages adding a new item to the page.
     */
    var ctrlAddItem = function(){
        
            var input, newItem;
            //1. Get the field input data
            input = UICtrl.getInput();
            //Only execute and add item if the input has a description and 
            //a value. No blank fields allowed.
            if(input.description !== "" && !isNaN(input.value) && input.value > 0){
                //2. Add item to the budget controller
                newItem = budgetCtrl.addItem(input.type,input.description,input.value);
                //3. Add the item to the user interface
                UICtrl.addListItem(newItem, input.type);
                //4. Clear the fields
                UICtrl.clearFields();
                //5. Calculate and upate budget
                updateBudget();
                //6. Calculate and update percentages
                updatePercentages();
            }
    };
    
    //We get access to the event object to determine what the target
    //element is. The event bubbles up and we know where it was fired by
    //looking at the target element of the event.
    var ctrlDeleteItem = function(event){
        var itemId, splitId, type, ID;
        //Calling parentNode gets us the parent of what we clicked. We need
        //4 parents up.
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id
        if(itemId){
            //Split the id name by the "-"
            splitID = itemId.split("-");
            type = splitID[0];
            //This is a string so must be cast to int
            ID = parseInt(splitID[1]);
            //Delete the item from the data structure
            budgetCtrl.deleteItem(type,ID);
            //Delete the item from the user interface
            UICtrl.deleteListItem(itemId);
            //Update and show the new budget
            updateBudget();
            //Calculate and update percentages
            updatePercentages();
        }
    };

    return{
        init: function(){
            console.log("Application has started.");
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: "0",
                percentage: "0",
                totalInc: "0",
                totalExp: "0"
            });
            setupEventListeners();
        }
    }

 })(budgetController,UIController);


 //Calling this runs the app. Without this, app will not run.
controller.init();







