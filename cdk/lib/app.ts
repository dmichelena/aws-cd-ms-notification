import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';
import * as lambda from '@aws-cdk/aws-lambda';

export class AppStack extends cdk.Stack {

  constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const layer = lambda.LayerVersion.fromLayerVersionArn(
      this, 'latestLayer',  cdk.Fn.importValue('sns-lib-layer')
    );

    const lambdaFunction = new lambda.Function(this, 'NotificationFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('./src'),
      handler: 'index.handler',
      layers: [layer]
    });

    const topics = ['user_registered', 'paid_order'];
    for (const topicName of topics) {
      const topic = this.getTopic(topicName);
      topic.addSubscription(new subscriptions.LambdaSubscription(lambdaFunction));
    }
  }

  private getTopic(topicName: string): sns.ITopic {
    return sns.Topic.fromTopicArn(
      this, topicName, this.topicArn(topicName)
    );
  }

  private topicArn(topicName: string): string {
    const topicReference = topicName.replace(/_/g, '-') + '-arn';

    return cdk.Fn.importValue(topicReference);
  }
}
