---
title: AWS Load-Balancer Annotations
content_type: concept
weight: 80
---

## AWS load-balancer related annotations

### service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval: "5"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer for a Service based on this annotation. The value determines
how often the load balancer writes log entries. For example, if you set the value
to 5, the log writes occur 5 seconds apart.

### service.beta.kubernetes.io/aws-load-balancer-access-log-enabled

Stage: Beta
Type: Annotation

Example: `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "false"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer for a Service based on this annotation. Access logging is enabled
if you set the annotation to "true".

### service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: example`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer for a Service based on this annotation. The load balancer
writes logs to an S3 bucket with the name you specify.

### service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "/example"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer for a Service based on this annotation. The load balancer
writes log objects with the prefix that you specify.

### service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "Environment=demo,Project=example"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
tags (an AWS concept) for a load balancer based on the comma-separated key/value
pairs in the value of this annotation.

### service.beta.kubernetes.io/aws-load-balancer-alpn-policy

State: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-alpn-policy: HTTP2Optional`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.

### service.beta.kubernetes.io/aws-load-balancer-attributes

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-attributes: "deletion_protection.enabled=true"`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.

### service.beta.kubernetes.io/aws-load-balancer-backend-protocol

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer listener based on the value of this annotation.

### service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled: "false"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
the load balancer based on this annotation. The load balancer's connection draining
setting depends on the value you set.

### service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout: "60"`

Used on: Service

If you configure [connection draining](#service-beta-kubernetes-io-aws-load-balancer-connection-draining-enabled)
for a Service of `type: LoadBalancer`, and you use the AWS cloud, the integration configures
the draining period based on this annotation. The value you set determines the draining
timeout in seconds.

### service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout: "60"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The load balancer has a configured idle
timeout period (in seconds) that applies to its connections. If no data has been
sent or received by the time that the idle timeout period elapses, the load balancer
closes the connection.

### service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. If you set this annotation to "true",
each load balancer node distributes requests evenly across the registered targets
in all enabled [availability zones](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones).
If you disable cross-zone load balancing, each load balancer node distributes requests
evenly across the registered targets in its availability zone only.

### service.beta.kubernetes.io/aws-load-balancer-eip-allocations

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-eip-allocations: "eipalloc-01bcdef23bcdef456,eipalloc-def1234abc4567890"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The value is a comma-separated list
of elastic IP address allocation IDs.

This annotation is only relevant for Services of `type: LoadBalancer`, where
the load balancer is an AWS Network Load Balancer.

### service.beta.kubernetes.io/aws-load-balancer-extra-security-groups

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-extra-security-groups: "sg-12abcd3456,sg-34dcba6543"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value is a comma-separated
list of extra AWS VPC security groups to configure for the load balancer.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold: "3"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value specifies the number of
successive successful health checks required for a backend to be considered healthy
for traffic.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval: "30"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value specifies the interval,
in seconds, between health check probes made by the load balancer.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-path

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-path: /healthcheck`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value determines the
path part of the URL that is used for HTTP health checks.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-port

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-port: "24"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value determines which
port the load balancer connects to when performing health checks.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-protocol

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-protocol: TCP`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value determines how the
load balancer checks the health of backend targets.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout: "3"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value specifies the number
of seconds before a probe that hasn't yet succeeded is automatically treated as
having failed.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold: "3"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. The annotation value specifies the number of
successive unsuccessful health checks required for a backend to be considered unhealthy
for traffic.

### service.beta.kubernetes.io/aws-load-balancer-internal

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-internal: "true"`

Used on: Service

The cloud controller manager integration with AWS elastic load balancing configures
a load balancer based on this annotation. When you set this annotation to "true",
the integration configures an internal load balancer.

If you use the [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/),
see [`service.beta.kubernetes.io/aws-load-balancer-scheme`](#service-beta-kubernetes-io-aws-load-balancer-scheme).

### service.beta.kubernetes.io/aws-load-balancer-ip-address-type

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-ip-address-type: ipv4`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.

### service.beta.kubernetes.io/aws-load-balancer-manage-backend-security-group-rules

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-manage-backend-security-group-rules: "true"`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.

### service.beta.kubernetes.io/aws-load-balancer-name

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-name: my-elb`

Used on: Service

If you set this annotation on a Service, and you also annotate that Service with
`service.beta.kubernetes.io/aws-load-balancer-type: "external"`, and you use the
[AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
in your cluster, then the AWS load balancer controller sets the name of that load
balancer to the value you set for _this_ annotation.

See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.

### service.beta.kubernetes.io/aws-load-balancer-nlb-target-type

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: "true"`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.

### service.beta.kubernetes.io/aws-load-balancer-private-ipv4-addresses

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-private-ipv4-addresses: "198.51.100.0,198.51.100.64"`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.

### service.beta.kubernetes.io/aws-load-balancer-proxy-protocol

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: "*"`

Used on: Service

The official Kubernetes integration with AWS elastic load balancing configures
a load balancer based on this annotation. The only permitted value is `"*"`,
which indicates that the load balancer should wrap TCP connections to the backend
Pod with the PROXY protocol.

### service.beta.kubernetes.io/aws-load-balancer-scheme

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-scheme: internal`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.

### service.beta.kubernetes.io/aws-load-balancer-security-groups

Stage: Deprecated

Example: `service.beta.kubernetes.io/aws-load-balancer-security-groups: "sg-53fae93f,sg-8725gr62r"`

Used on: Service

The AWS load balancer controller uses this annotation to specify a comma separated list
of security groups you want to attach to an AWS load balancer. Both name and ID of security
are supported where name matches a `Name` tag, not the `groupName` attribute.

When this annotation is added to a Service, the load-balancer controller attaches the security groups
referenced by the annotation to the load balancer. If you omit this annotation, the AWS load balancer
controller automatically creates a new security group and attaches it to the load balancer.

{{< note >}}
Kubernetes v1.27 and later do not directly set or read this annotation. However, the AWS
load balancer controller (part of the Kubernetes project) does still use the
`service.beta.kubernetes.io/aws-load-balancer-security-groups` annotation.
{{< /note >}}

### service.beta.kubernetes.io/aws-load-balancer-ssl-cert

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"`

Used on: Service

The official integration with AWS elastic load balancing configures TLS for a Service of
`type: LoadBalancer` based on this annotation. The value of the annotation is the
AWS Resource Name (ARN) of the X.509 certificate that the load balancer listener should
use.

(The TLS protocol is based on an older technology that abbreviates to SSL.)

### service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy

Stage: Beta

Type: Annotation

Example: `service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy: ELBSecurityPolicy-TLS-1-2-2017-01`

The official integration with AWS elastic load balancing configures TLS for a Service of
`type: LoadBalancer` based on this annotation. The value of the annotation is the name
of an AWS policy for negotiating TLS with a client peer.

### service.beta.kubernetes.io/aws-load-balancer-ssl-ports

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "*"`

The official integration with AWS elastic load balancing configures TLS for a Service of
`type: LoadBalancer` based on this annotation. The value of the annotation is either `"*"`,
which means that all the load balancer's ports should use TLS, or it is a comma separated
list of port numbers.

### service.beta.kubernetes.io/aws-load-balancer-subnets

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-subnets: "private-a,private-b"`

Kubernetes' official integration with AWS uses this annotation to configure a
load balancer and determine in which AWS availability zones to deploy the managed
load balancing service. The value is either a comma separated list of subnet names, or a
comma separated list of subnet IDs.

### service.beta.kubernetes.io/aws-load-balancer-target-group-attributes

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-target-group-attributes: "stickiness.enabled=true,stickiness.type=source_ip"`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation.
See [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
in the AWS load balancer controller documentation.

### service.beta.kubernetes.io/aws-load-balancer-target-node-labels

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-target-node-labels: "kubernetes.io/os=Linux,topology.kubernetes.io/region=us-east-2"`

Kubernetes' official integration with AWS uses this annotation to determine which
nodes in your cluster should be considered as valid targets for the load balancer.

### service.beta.kubernetes.io/aws-load-balancer-type

Stage: Beta

Example: `service.beta.kubernetes.io/aws-load-balancer-type: external`

Kubernetes' official integrations with AWS use this annotation to determine
whether the AWS cloud provider integration should manage a Service of
`type: LoadBalancer`.

There are two permitted values:

`nlb`
: the cloud controller manager configures a Network Load Balancer

`external`
: the cloud controller manager does not configure any load balancer

If you deploy a Service of `type: LoadBalancer` on AWS, and you don't set any
`service.beta.kubernetes.io/aws-load-balancer-type` annotation,
the AWS integration deploys a classic Elastic Load Balancer. This behavior,
with no annotation present, is the default unless you specify otherwise.

When you set this annotation to `external` on a Service of `type: LoadBalancer`,
and your cluster has a working deployment of the AWS Load Balancer controller,
then the AWS Load Balancer controller attempts to deploy a load balancer based
on the Service specification.

{{< caution >}}
Do not modify or add the `service.beta.kubernetes.io/aws-load-balancer-type` annotation
on an existing Service object. See the AWS documentation on this topic for more
details.
{{< /caution >}}


### service.beta.kubernetes.io/load-balancer-source-ranges

Stage: Deprecated

Example: `service.beta.kubernetes.io/load-balancer-source-ranges: "192.0.2.0/25"`

Used on: Service

The [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
uses this annotation. You should set `.spec.loadBalancerSourceRanges` for the Service instead.

