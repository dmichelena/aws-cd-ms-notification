import * as cdk from '@aws-cdk/core';
import { AppStack } from './lib/app';

const app = new cdk.App();
new AppStack(app, 'NotificationMS', {
  env: {
    region: 'us-west-1',
  },
});