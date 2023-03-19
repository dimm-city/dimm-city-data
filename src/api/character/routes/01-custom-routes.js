module.exports = {
  routes: [
    { // Path defined with an URL parameter
      method: 'POST',
      path: '/characters/purchased/:paymentId', 
      handler: 'character.characterPurchased',
    }
  ]
}