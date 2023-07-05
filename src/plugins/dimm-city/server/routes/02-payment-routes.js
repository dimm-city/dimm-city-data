module.exports = {
  routes: [
    { // Path defined with an URL parameter
      method: 'POST',
      path: '/payments/begin', 
      handler: 'payment.createPaymentIntent',
    },
    { // Path defined with an URL parameter
      method: 'POST',
      path: '/payments/purchased/:paymentId', 
      handler: 'payment.purchaseCompleted',
    }
  ]
}