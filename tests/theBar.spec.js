const {
  expect
} = require('chai')

const {
  describe,
  it
} = require('mocha')

const {
  test,
  createBar,
  Customer,
  findDrink,
  buyDrink,
  drinkBeer

} = require('..')

describe('tests', () => {
  it('should prove test environment is set up', () => {
    expect(test()).to.equal('working')
  })
})

describe('the bar', () => {
  const bar = createBar()
  it('should have a fridge containing Asahi and Yebisu beers', () => {
    expect(bar.fridge).to.contain.keys('asahi', 'yebisu')
  })
})

describe('customer properties', () => {
  const customer = new Customer(1000, 2, 1)
  it('should have a wallet for yen', () => {
    expect(customer.wallet).to.equal(1000)
  })
  it('should have stamina defining how many hours they want to drink', () => {
    expect(customer.stamina).to.equal(2)
  })
  it('should have a default favourite beer of Asahi', () => {
    expect(customer.favourite).to.equal('asahi')
  })
  it('should be possible to change favorite beer', () => {
    const yebisuCustomer = new Customer(1000, 2, 1, 'yebisu')
    expect(yebisuCustomer.favourite).to.equal('yebisu')
  })
  it('should define how many beers an hour they drink', () => {
    expect(customer.perHour).to.equal(1)
  })
})

describe('the customer drinking at the bar', () => {
  describe('finding the right beer', () => {
    it('should be possible to find their favourite beer', () => {
      const bar = createBar()
      const customer = new Customer(1000, 2)
      const drink = findDrink(customer, bar)
      expect(drink.price).to.equal(500)
    })
    it('should return undefined if their favourite beer is not stocked', () => {
      const bar = createBar()
      const customer = new Customer(1000, 2, 1, 'kirin')
      const drink = findDrink(customer, bar)
      expect(drink).to.equal(undefined)
    })
    it('should return out of beer message if amount is zero', () => {
      const barWithoutBeer = createBar()
      barWithoutBeer.fridge.asahi.amount = 0
      const customer = new Customer(1000, 2)
      const drink = findDrink(customer, barWithoutBeer)
      expect(drink).to.equal('out of asahi')
    })
  })
  describe('buying a beer', () => {
    const customer = new Customer(1000, 2)
    const bar = createBar()
    buyDrink(customer, bar)
    it('should cost money to buy a beer', () => {
      expect(customer.wallet).to.equal(500)
    })
    it('should remove a beer from the fridge when the customer buys it', () => {
      expect(bar.fridge.asahi.amount).to.equal(11)
    })
    it('should add money to the takings when beer is purchased', () => {
      expect(bar.takings).to.equal(500)
    })
  })
  describe('when it is time to start drinking', () => {
    const customer = new Customer(5000, 1, 2)
    const bar = createBar()

    it('should return undefined if the start time parameter is missing', () => {
      const startDrinking = drinkBeer(customer, bar)
      expect(startDrinking).to.equal(undefined)
    })
    it('should drink beers at the perHour rate', () => {
      drinkBeer(customer, bar, 6)
      expect(customer.wallet).to.equal(4000)
    })
  })
  describe('when it is time to stop drinking', () => {
    const bar = createBar()
    it('should stop drinking when customer is out of money', () => {
      const poorCustomer = new Customer(1100, 2, 2)
      drinkBeer(poorCustomer, bar, 6)
      expect(poorCustomer.wallet).to.equal(100)
      expect(bar.fridge.asahi.amount).to.equal(10)
    })
    it('should stop drinking when stamina is reached', () => {
      const busyCustomer = new Customer(5000, 1, 2)
      drinkBeer(busyCustomer, bar, 6)
      expect(busyCustomer.wallet).to.equal(4000)
    })
    it('should stop drinking at midnight', () => {
      const lateCustomer = new Customer(5000, 6, 2)
      drinkBeer(lateCustomer, bar, 10)
      expect(lateCustomer.wallet).to.equal(3000)
    })
    it('should stop drinking when their favourite beer runs out', () => {
      const thirstyCustomer = new Customer(5000, 6, 3, 'yebisu')
      drinkBeer(thirstyCustomer, bar, 6)
      expect(thirstyCustomer.wallet).to.equal(800)
    })
  })
})