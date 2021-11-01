#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {WindowsEc2Stack} from '../lib/windows-ec2-stack';
import {VpcStack} from "../lib/vpc-stack";

const account = 'xxx';

const env = {
  region: 'ap-northeast-1',
  account: account,
};

const app = new cdk.App();
const vpcStack = new VpcStack(app, 'VpcStack', {env: env});
new WindowsEc2Stack(app, 'AwsCdkWindowsEc2Stack', {
  env: env,
  vpcStack: vpcStack,
});
