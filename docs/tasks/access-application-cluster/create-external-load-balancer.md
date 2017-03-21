---
title: Creating an External Load Balancer
---

* TOC
{:toc}

## Overview

When creating a service, you have the option of automatically creating a
cloud network load balancer. This provides an
externally-accessible IP address that sends traffic to the correct port on your
cluster nodes _provided your cluster runs in a supported environment and is configured with the correct cloud load balancer provider package_.

## External Load Balancer Providers

It is important to note that the datapath for this functionality is provided by a load balancer external to the Kubernetes cluster.

When the service type is set to `LoadBalancer`, Kubernetes provides functionality equivalent to type=`ClusterIP` to pods within the cluster and extends it by programming the (external to Kubernetes) load balancer with entries for the Kubernetes VMs. The Kubernetes service controller automates the creation of the external load balancer, health checks (if needed), firewall rules (if needed) and retrieves the external IP allocated by the cloud provider and populates it in the service object.

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
    $ kubectl expose rc example --port=8765 --target-port=9376 \
        --name=example-service --type=LoadBalancer
```

This command creates a new service using the same selectors as the referenced
resource (in the case of the example above, a replication controller named
`example`.)

For more information, including optional flags, refer to the
[`kubectl expose` reference](/docs/user-guide/kubectl/kubectl_expose/).

## Finding your IP address

You can find the IP address created for your service by getting the service
information through `kubectl`:

```bash
    $ kubectl describe services example-service
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

## Loss of client source IP for external traffic

Due to the implementation of this feature, the source IP for sessions as seen in the target container will *not be the original source IP* of the client. This is the default behavior as of Kubernetes v1.5. However, starting in v1.5, an optional beta feature has been added
that will preserve the client Source IP for GCE/GKE environments. This feature will be phased in for other cloud providers in subsequent releases.

## Annotation to modify the LoadBalancer behavior for preservation of Source IP
In 1.5, a Beta feature has been added that changes the behavior of the external LoadBalancer feature.

This feature can be activated by adding the beta annotation below to the metadata section of the Service Configuration file.

```json
    {
      "kind": "Service",
      "apiVersion": "v1",
      "metadata": {
        "name": "example-service",
        "annotations": {
            "service.beta.kubernetes.io/external-traffic": "OnlyLocal"
        }
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

**Note that this feature is not currently implemented for all cloudproviders/environments.**

### Caveats and Limitations when preserving source IPs

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
