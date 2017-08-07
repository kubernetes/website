---
title: Create an External Load Balancer
---


{% capture overview %}

This page shows how to create an External Load Balancer.

When creating a service, you have the option of automatically creating a
cloud network load balancer. This provides an
externally-accessible IP address that sends traffic to the correct port on your
cluster nodes _provided your cluster runs in a supported environment and is configured with the correct cloud load balancer provider package_.

{% endcapture %}

{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## Configuration file

To create an external load balancer, add the following line to your
[service configuration file](/docs/user-guide/services/operations/#service-configuration-file):

```json
    "type": "LoadBalancer"
```

Your configuration file might look like:

```json
    {
      "kind": "Service",
      "apiVersion": "v1",
      "metadata": {
        "name": "example-service"
      },
      "spec": {
        "ports": [{
          "port": 8765,
          "targetPort": 9376
        }],
        "selector": {
          "app": "example"
        },
        "type": "LoadBalancer"
      }
    }
```

## Using kubectl

You can alternatively create the service with the `kubectl expose` command and
its `--type=LoadBalancer` flag:

```bash
    kubectl expose rc example --port=8765 --target-port=9376 \
        --name=example-service --type=LoadBalancer
```

This command creates a new service using the same selectors as the referenced
resource (in the case of the example above, a replication controller named
`example`.)

For more information, including optional flags, refer to the
[`kubectl expose` reference](/docs/user-guide/kubectl/v1.6/#expose).

## Finding your IP address

You can find the IP address created for your service by getting the service
information through `kubectl`:

```bash
    kubectl describe services example-service
```

which should produce output like this:

```bash
    Name:  example-service
    Selector:   app=example
    Type:     LoadBalancer
    IP:     10.67.252.103
    LoadBalancer Ingress: 123.45.678.9
    Port:     <unnamed> 80/TCP
    NodePort:   <unnamed> 32445/TCP
    Endpoints:    10.64.0.4:80,10.64.1.5:80,10.64.2.4:80
    Session Affinity: None
    No events.
```

The IP address is listed next to `LoadBalancer Ingress`.

## Preserving the client source IP

Due to the implementation of this feature, the source IP seen in the target
container will *not be the original source IP* of the client. To enable
preservation of the client IP, the following fields can be configured in the
service spec (supported in GCE/GKE environments):

* `service.spec.externalTrafficPolicy` - denotes if this Service desires to route
external traffic to node-local or cluster-wide endpoints. There are two available
options: "Cluster" (default) and "Local". "Cluster" obscures the client source
IP and may cause a second hop to another node, but should have good overall
load-spreading. "Local" preserves the client source IP and avoids a second hop
for LoadBalancer and NodePort type services, but risks potentially imbalanced
traffic spreading.
* `service.spec.healthCheckNodePort` - specifies the healthcheck nodePort
(numeric port number) for the service. If not specified, healthCheckNodePort is
created by the service API backend with the allocated nodePort. It will use the
user-specified nodePort value if specified by the client. It only has an
effect when type is set to "LoadBalancer" and externalTrafficPolicy is set
to "Local".

This feature can be activated by setting `externalTrafficPolicy` to "Local" in the
Service Configuration file.

```json
    {
      "kind": "Service",
      "apiVersion": "v1",
      "metadata": {
        "name": "example-service",
      },
      "spec": {
        "ports": [{
          "port": 8765,
          "targetPort": 9376
        }],
        "selector": {
          "app": "example"
        },
        "type": "LoadBalancer",
        "externalTrafficPolicy": "Local"
      }
    }
```

### Feature availability

| k8s version | Feature support |
| :---------: |:-----------:|
| 1.7+ | Supports the full API fields |
| 1.5 - 1.6 | Supports Beta Annotations |
| <1.5 | Unsupported |

Below you could find the deprecated Beta annotations used to enable this feature
prior to its stable version. Newer Kubernetes versions may stop supporting these
after v1.7. Please update existing applications to use the fields directly.

* `service.beta.kubernetes.io/external-traffic` annotation <-> `service.spec.externalTrafficPolicy` field
* `service.beta.kubernetes.io/healthcheck-nodeport` annotation <-> `service.spec.healthCheckNodePort` field

`service.beta.kubernetes.io/external-traffic` annotation has a different set of values
compared to the `service.spec.externalTrafficPolicy` field. The values match as follows:

* "OnlyLocal" for annotation <-> "Local" for field
* "Global" for annotation <-> "Cluster" for field

**Note that this feature is not currently implemented for all cloudproviders/environments.**


{% endcapture %}

{% capture discussion %}

## External Load Balancer Providers

It is important to note that the datapath for this functionality is provided by a load balancer external to the Kubernetes cluster.

When the service type is set to `LoadBalancer`, Kubernetes provides functionality equivalent to `type=<ClusterIP>` to pods within the cluster and extends it by programming the (external to Kubernetes) load balancer with entries for the Kubernetes VMs. The Kubernetes service controller automates the creation of the external load balancer, health checks (if needed), firewall rules (if needed) and retrieves the external IP allocated by the cloud provider and populates it in the service object.

### AWS

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
* `service.beta.kubernetes.io/aws-load-balancer-ssl-cert`: Used on the service to request a secure listener. Value is a valid certificate ARN. For more, see http://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/elb-listener-config.html CertARN is an IAM or CM certificate ARN, e.g. `arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012`.
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled`: Used on the service to enable or disable connection draining.
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout`: Used on the service to specify a connection draining timeout.
* `service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout`: Used on the service to specify the idle connection timeout.
* `service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled`: Used on the service to enable or disable cross-zone load balancing.
* `service.beta.kubernetes.io/aws-load-balancer-extra-security-groups`: Used one the service to specify additional security groups to be added to ELB created
* `service.beta.kubernetes.io/aws-load-balancer-internal`: Used on the service to indicate that we want an internal ELB.
* `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol`: Used on the service to enable the proxy protocol on an ELB. Right now we only accept the value `*` which means enable the proxy protocol on all ELB backends. In the future we could adjust this to allow setting the proxy protocol only on certain backends.
* `service.beta.kubernetes.io/aws-load-balancer-ssl-ports`: Used on the service to specify a comma-separated list of ports that will use SSL/HTTPS listeners. Defaults to `*` (all)

The information for the annotations for AWS is taken from the comments on [aws.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/providers/aws/aws.go)

## Caveats and Limitations when preserving source IPs

GCE/AWS load balancers do not provide weights for their target pools. This was not an issue with the old LB
kube-proxy rules which would correctly balance across all endpoints.

With the new functionality, the external traffic will not be equally load balanced across pods, but rather
equally balanced at the node level (because GCE/AWS and other external LB implementations do not have the ability
for specifying the weight per node, they balance equally across all target nodes, disregarding the number of
pods on each node).

We can, however, state that for NumServicePods << NumNodes or NumServicePods >> NumNodes, a fairly close-to-equal
distribution will be seen, even without weights.

Once the external load balancers provide weights, this functionality can be added to the LB programming path.
*Future Work: No support for weights is provided for the 1.4 release, but may be added at a future date*

Internal pod to pod traffic should behave similar to ClusterIP services, with equal probability across all pods.

{% endcapture %}

{% include templates/task.md %}
