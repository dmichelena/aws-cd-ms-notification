const sns = require('aws-lambda-sns');

sns.configure({
  user_registered(data) {
    console.log('Sending welcome email to: ' + data.email);
  },
  paid_order(data) {
    console.log(`Sending purchase confirmation email to: ${data.email}. Order ${data.order_id}`);
  }
})

exports.handler = async (event, context) => {
  await sns.process(event);

  return {status: 'OK'};
};