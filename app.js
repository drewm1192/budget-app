


/*
BUDGET CONTROLLER
We use an IIFE  for data security. Data within here lies in its
own scope and keeps data private.
*/
var budgetController = (function(){

    //Some code
    
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
    }

    return {
        getInput: function(){
            return {
            //returns the html value field (inc or exp)
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: document.querySelector(DOMstrings.inputValue).value
            }

        },

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
    };


    /**
     * This function manages adding a new item to the page.
     */
    var ctrlAddItem = function(){

        //1. Get the field input data
        var input = UICtrl.getInput();
        //2. Add item to the budget controller
        //3. Add the item to the user interface
        //4. Calculate the overall budget
        //5. Display the overall budget.
        console.log(input);
    };
    
    return{
        init: function(){
            console.log("APP HAS STARTED");
            setupEventListeners();
        }
    }

 })(budgetController,UIController);


 //Calling this runs the app. Without this, app will not run.
controller.init();







