import * as cdk from "@aws-cdk/core";
import { Vpc, SubnetType } from "@aws-cdk/aws-ec2";
import * as dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export class AwsSiteVpnStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        if (!process.env.HOME_IP || !process.env.HOME_CIDR)
            throw new Error("Env error");

        new Vpc(this, "vpn_vpc", {
            cidr: "10.0.0.0/16",
            maxAzs: 1,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: "private",
                    subnetType: SubnetType.PRIVATE_WITH_NAT,
                },
                {
                    cidrMask: 24,
                    name: "public",
                    subnetType: SubnetType.PUBLIC,
                },
            ],
            vpnGateway: true,
            vpnConnections: {
                homeVPN: {
                    ip: process.env.HOME_IP!,
                    staticRoutes: [process.env.HOME_CIDR!],
                },
            },
        });
    }
}
