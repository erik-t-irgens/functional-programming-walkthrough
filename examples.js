//? class Plant {
//?   constructor() {
//?     this.water = 0;
//?     this.soil = 0;
//?     this.light = 0;
//?   }

//?   hydrate() {
//?     this.water++
//?   }

//?   feed() {
//?     this.soil++
//?   }

//?   giveLight() {
//?     this.light++
//?   }
//? }

//  The above approach would hold all state inside of an instantiation of the object class like so:
// let newPlant = new Plant();
// We'd then call all updates upon this object instantiation.

//? FUNCTIONAL

// Instead of mutating state, our functions take current state, and return new state. The changes happen internally.

// Feeding plant example

//? We provide "plant" as parameter in our function.
//? The spread operator takes the current information of this plant and puts it into our return object
//? We then update the soil property. We check the current value; if there isn't one, it becomes 0 then is incremented by one

const feed = (plant) => {
  return {
    ...plant,
    soil: (plant.soil || 0) + 1
  }
};


//! We can make this modular and allow it to take any property as an argument instead of only updating soil.
//? Property now is an arugment and will be used in the same way. If a property doesn't exist, it will be added. 

const changePlantState = (plant, property) => {
  return {
    ...plant,
    [property]: (plant[property] || 0) + 1
  }
}

//! we can abstract this function even further to be modular and used on any stateful object.
//? Now we instead can update any object as long as we can provide the current state, the property to update, adn the value to update it to. 

const changeState = (state, prop, value) => ({
  ...state,
  [prop]: (state[prop] || 0) + value
})

//! THIS ISN"T A UNARY FUNCTION THOUGH!
//? We then move to currying to have multiple unary functions together, and we can provide the same information and it works the same.

const changeStateUnary = (prop) => {
  return (value) => {
    return (state) => ({
      ...state,
      [prop]: (state[prop] || 0) + value
    })
  }
}

//! STORING STATE
//? Now we can move onto storing state within a function instead of as a variable
// We create an empty object to store state from the beginning.The only purpose of the outermost function is to store the state.
// It returns an anonymous inner function, which then changes the `currentState` when called. 
// The function we pass in as an argument when calling storeState()(function) will specify the exact change that should bve made to currentState. That function is the changeStateUnary function from above.

const storeState = () => {
  let currentState = {};
  return (stateChangeFunction) => {
    const newState = stateChangeFunction(currentState); // This is calling the function we passed in.
    currentState = { ...newState }; // This is receiving the return of the above function, and setting currentState to the newState.
    return newState;
  }
}

// {soil: 5}

//? WE then store this function in a constant
//? We are invoking storeState() and creating a closure over the currentState.

const stateControl = storeState();

//? Here are some consts that call our changeStateUnary that pass in a property of "soil" and a value to update it to. 

const blueFood = changeStateUnary("soil")(5)
const greenFood = changeStateUnary("soil")(10)
const yuckyFood = changeStateUnary("soil")(-5)

const sharpSheers = changeStateUnary("wool")(-10)

//? We can pass these consts into state control and store the return in a const

const fedPlant = stateControl(blueFood)
const sheeredSheep = stateControl(sharpSheers)
// { soil : 5, wool: -10 }
//? The initial state {} is changed because storeState is given three things.
//! 1) blueFood is actually the changeState function, which becomes our anonymous function in our storeState
//! 2) That anonymous function also has the property to change as well as the value to change it by (soil, 5)
//! 3) Our changeState function ALSO receives the original currentState (which is just an empty {}) and updates that.
//! 4) It will return that information into our newState const, which we then
//! 5) Spread that information into currentState, and return newState.
//? This successfully updates the currentState property held within the stateControl

//? if we wanted to update that state again, we'd create a new const that calls stateControl (that holds ourn updated current state) and provides it with new state updating infomration.

// {soil: 15, wool: -10}

const plantFedAgain = stateControl(greenFood)
// {soil: 15} <-- This used to be a value of 5. Greenfood adds 10 to the current value. currentState is 5!


//! We can go further and give our storeState function the ability to receive initialState upon creation of the store if we wish to.

// const storeState = (initialState || {}) => {
//   let currentState = initialState; // We could pass in an initial state to the object instead of starting with an empty object as well.

//! We can also modify the storeState method to return current state if no stateChangeFUnction is defined for the anonymous function, and just returns state instead:

const storeStateReturnsState = () => {
  let currentState = {};
  return (stateChangeFunction = state => state) => { // This is saying if stateChangeFunction is undefined, return state (current state)
    const newState = stateChangeFunction(currentState);
    currentState = { ...newState };
    return newState;
  }
}
