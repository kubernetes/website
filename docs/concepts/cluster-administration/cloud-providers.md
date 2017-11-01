---
title: Cloud Providers
---

{% capture overview %}
This page explains how to manage Kubernetes running on a specific
cloud provider.
{% endcapture %}

{% capture body %}
# AWS
This section describes all the possible configurations which can
be used when running Kubernetes on Amazon Web Services.

## Load Balancers
You can setup [external load balancers](/docs/tasks/access-application-cluster/create-external-load-balancer/)
to use specific features in AWS by configuring the annotations as shown below.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example
  namespace: kube-system
  labels:
    run: example
  annotations:
     service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:xx-xxxx-x:xxxxxxxxx:xxxxxxx/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxx #replace this value
     service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
spec:
  type: LoadBalancer
  ports:
  - port: 443
    targetPort: 5556
    protocol: TCP
  selector:
    app: example
```
Different settings can be applied to a load balancer service in AWS using _annotations_. The following describes the annotations supported on AWS ELBs:

* `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval`: Used to specify access log emit interval.
* `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled`: Used on the service to enable or disable access logs.
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name`: Used to specify access log s3 bucket name.
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix`: Used to specify access log s3 bucket prefix.
* `service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags`: Used on the service to specify a comma-separated list of key-value pairs which will be recorded as additional tags in the ELB. For example: `"Key1=Val1,Key2=Val2,KeyNoVal1=,KeyNoVal2"`.
* `service.beta.kubernetes.io/aws-load-balancer-backend-protocol`: Used on the service to specify the protocol spoken by the backend (pod) behind a listener. If `http` (default) or `https`, an HTTPS listener that terminates the connection and parses headers is created. If set to `ssl` or `tcp`, a "raw" SSL listener is used. If set to `http` and `aws-load-balancer-ssl-cert` is not used then a HTTP listener is used.
* `service.beta.kubernetes.io/aws-load-balancer-ssl-cert`: Used on the service to request a secure listener. Value is a valid certificate ARN. For more, see [ELB Listener Config](http://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/elb-listener-config.html) CertARN is an IAM or CM certificate ARN, e.g. `arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012`.
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled`: Used on the service to enable or disable connection draining.
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout`: Used on the service to specify a connection draining timeout.
* `service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout`: Used on the service to specify the idle connection timeout.
* `service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled`: Used on the service to enable or disable cross-zone load balancing.
* `service.beta.kubernetes.io/aws-load-balancer-extra-security-groups`: Used on the service to specify additional security groups to be added to ELB created
* `service.beta.kubernetes.io/aws-load-balancer-internal`: Used on the service to indicate that we want an internal ELB.
* `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol`: Used on the service to enable the proxy protocol on an ELB. Right now we only accept the value `*` which means enable the proxy protocol on all ELB backends. In the future we could adjust this to allow setting the proxy protocol only on certain backends.
* `service.beta.kubernetes.io/aws-load-balancer-ssl-ports`: Used on the service to specify a comma-separated list of ports that will use SSL/HTTPS listeners. Defaults to `*` (all)

The information for the annotations for AWS is taken from the comments on [aws.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/providers/aws/aws.go)

# OpenStack
This section describes all the possible configurations which can
be used when using OpenStack with Kubernetes.

## cloud.conf
Kubernetes knows how to interact with OpenStack via the file cloud.conf. It is the file that will provide Kubernetes with credentials and location for the OpenStack auth endpoint.
You can create a cloud.conf file by specifying the following details in it

### Minimal configuration
This is an example of a minimal configuration that touches the values that most often need to be set:

```yaml
[Global]
username=user  
password=pass  
auth-url=https://<keystone_ip>/identity/v3  
tenant-id=c869168a828847f39f7f06edd7305637  
domain-id=2a73b8f597c04551a0fdc8e95544be8a

[LoadBalancer]
subnet-id=6937f8fa-858d-4bc9-a3a5-18d2c957166a  
```

#### Global
* `username`: Refers to the username of a valid user set in keystone.
* `password`:Refers to the password of a valid user set in keystone.
* `auth-url`: The URL of the keystone API used to authenticate. On OpenStack control panels, this can be found at Access and Security > API Access > Credentials.
* `tenant-id`: Used to specify the id of the project where you want to create your resources.
* `domain-id`: Used to specify the id of the domain your user belongs to.

####  Load Balancer
* `subnet-id`: Used to specify the id of the subnet you want to create your loadbalancer on. Can be found at Network > Networks. Click on the respective network to get its subnets.

### Optional configuration

#### Block Storage

Kubernetes uses the OpenStack service catalog to locate services it knows how to
use including Cinder Block Storage. The cloud provider configuration does
however include an additional option for influencing the way the block storage
API is used:

* `bs-version`: Refers to the version of the block storage API to use. Valid
  values are `v1`, `v2`, `v3` and `auto`. The `auto` value is the default and
  will use the newest version of the block storage API supported by the
  underlying OpenStack cloud.

If deploying Kubernetes versions <= 1.8 on an OpenStack deployment that uses
paths rather than ports to differentiate between endpoints it may be necessary
to explicitly set the `bs-version` parameter. A path based endpoint is of the
form `http://foo.bar/volume` while a port based endpoint is of the form
`http://foo.bar:xxx`.

In environments that use path based endpoints and Kubernetes is using the older
auto-detection logic a `BS API version autodetection failed.` error will be
returned on attempting volume detachment. To workaround this issue it is
possible to force the use of Cinder API version 2 by adding this to the cloud
provider configuration:

```yaml
[BlockStorage]
bs-version=v2
```
{% endcapture %}

{% include templates/concept.md %}
