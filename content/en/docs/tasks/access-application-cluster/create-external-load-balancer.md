---
title: Create an External Load Balancer
content_template: templates/task
weight: 80
---


{{% capture overview %}}

This page shows how to create an External Load Balancer.

When creating a service, you have the option of automatically creating a
cloud network load balancer. This provides an externally-accessible IP address
that sends traffic to the correct port on your cluster nodes
_provided your cluster runs in a supported environment and is configured with
the correct cloud load balancer provider package_.

For information on provisioning and using an Ingress resource that can give
services externally-reachable URLs, load balance the traffic, terminate SSL etc.,
please check the [Ingress](/docs/concepts/services-networking/ingress/)
documentation.

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Configuration file

To create an external load balancer, add the following line to your
[service configuration file](/docs/concepts/services-networking/service/#loadbalancer):

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
`example`).

For more information, including optional flags, refer to the
[`kubectl expose` reference](/docs/reference/generated/kubectl/kubectl-commands/#expose).

## Finding your IP address

You can find the IP address created for your service by getting the service
information through `kubectl`:

```bash
kubectl describe services example-service
```

which should produce output like this:

```bash
    Name:                   example-service
    Namespace:              default
    Labels:                 <none>
    Annotations:            <none>
    Selector:               app=example
    Type:                   LoadBalancer
    IP:                     10.67.252.103
    LoadBalancer Ingress:   192.0.2.89
    Port:                   <unnamed> 80/TCP
    NodePort:               <unnamed> 32445/TCP
    Endpoints:              10.64.0.4:80,10.64.1.5:80,10.64.2.4:80
    Session Affinity:       None
    Events:                 <none>
```

The IP address is listed next to `LoadBalancer Ingress`.

{{< note >}}
If you are running your service on Minikube, you can find the assigned IP address and port with:
{{< /note >}}

```bash
minikube service example-service --url
```

## Preserving the client source IP

Due to the implementation of this feature, the source IP seen in the target
container will *not be the original source IP* of the client. To enable
preservation of the client IP, the following fields can be configured in the
service spec (supported in GCE/Google Kubernetes Engine environments):

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
        "type": "LoadBalancer",
        "externalTrafficPolicy": "Local"
      }
    }
```

### Feature availability

| K8s version | Feature support |
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

{{< note >}}
This feature is not currently implemented for all cloudproviders/environments.
{{< /note >}}

Known issues:

* AWS: [kubernetes/kubernetes#35758](https://github.com/kubernetes/kubernetes/issues/35758)
* Weave-Net: [weaveworks/weave/#2924](https://github.com/weaveworks/weave/issues/2924)

{{% /capture %}}

{{% capture discussion %}}

## Garbage Collecting Load Balancers

In usual case, the correlating load balancer resources in cloud provider should
be cleaned up soon after a LoadBalancer type Service is deleted. But it is known
that there are various corner cases where cloud resources are orphaned after the
associated Service is deleted. Finalizer Protection for Service LoadBalancers was
introduced to prevent this from happening. By using finalizers, a Service resource
will never be deleted until the correlating load balancer resources are also deleted.

Specifically, if a Service has Type=LoadBalancer, the service controller will attach
a finalizer named `service.kubernetes.io/load-balancer-cleanup`.
The finalizer will only be removed after the load balancer resource is cleaned up.
This prevents dangling load balancer resources even in corner cases such as the
service controller crashing.

This feature was introduced as alpha in Kubernetes v1.15. You can start using it by
enabling the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`ServiceLoadBalancerFinalizer`.

## External Load Balancer Providers

It is important to note that the datapath for this functionality is provided by a load balancer external to the Kubernetes cluster.

When the service type is set to `LoadBalancer`, Kubernetes provides functionality equivalent to `type=<ClusterIP>` to pods within the cluster and extends it by programming the (external to Kubernetes) load balancer with entries for the Kubernetes pods. The Kubernetes service controller automates the creation of the external load balancer, health checks (if needed), firewall rules (if needed) and retrieves the external IP allocated by the cloud provider and populates it in the service object.

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

{{% /capture %}}


