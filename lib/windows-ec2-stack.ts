import * as cdk from '@aws-cdk/core';
import {
  Instance,
  InstanceClass, InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
  SubnetType, Vpc, WindowsImage, WindowsVersion
} from "@aws-cdk/aws-ec2";
import {Tags} from "@aws-cdk/core";

export class WindowsEc2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    // NOTE: use common resource
    const vpc = Vpc.fromLookup(this, 'VPC', {vpcName: 'InfrastructureCdkStack/Vpc'});

    // Security Group
    const cidrIp = '0.0.0.0/0';
    const securityGroup = new SecurityGroup(this, 'Ec2WindowsServerSg', {
        securityGroupName: 'Ec2WindowsServerSecurityGroup',
        description: 'security group for EC2 Windows Server',
        vpc: vpc,
      }
    );
    securityGroup.addEgressRule(Peer.anyIpv4(), Port.allTraffic());
    securityGroup.addIngressRule(Peer.ipv4(cidrIp), Port.tcp(3389));

    // EC2
    const ec2Instance = new Instance(this, 'Ec2WindowsServer', {
      vpc: vpc,
      vpcSubnets: {subnetType: SubnetType.PUBLIC},
      securityGroup: securityGroup,
      instanceName: 'windows-server',
      machineImage: new WindowsImage(WindowsVersion.WINDOWS_SERVER_2019_JAPANESE_FULL_BASE),
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      keyName: 'ec2-windows-server',
    });

    Tags.of(this).add('ServiceName', 'windows-server-ec2');

    new cdk.CfnOutput(this, 'PublicIp', {value: ec2Instance.instancePublicIp});
    new cdk.CfnOutput(this, 'PublicDnsName', {value: ec2Instance.instancePublicDnsName});
  }
}
