
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



})();


/**
 * GLOBAL APP CONTROLLER
 * App controller. 
 */

 var controller = (function(budgetCtrl,UICtrl){
    
    var ctrlAddItem = function(){

        //1. Get the field input data
        //2. Add item to the budget controller
        //3. Add the item to the user interface
        //4. Calculate the overall budget
        //5. Display the overall budget.
        console.log("TEST");
    };
    
    //Controls the action that occurs when someone clicks the checkmark button
    document.querySelector(".add__btn").addEventListener("click",ctrlAddItem);

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


 })(budgetController,UIController);










