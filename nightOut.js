const {
  createBar,
  Customer,
  drinkBeer
} = require('.')

const printBar = function () {
  console.log('The Fridge', matsBar.fridge)
  console.log('Takings', matsBar.takings)
  console.log("Richard's wallet", richard.wallet)
}

const matsBar = createBar()
const richard = new Customer(6000, 4, 2)

drinkBeer(richard, matsBar, 6)

printBar()
