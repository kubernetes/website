---

---

* TOC
{:toc}

## Overview

When creating a service, you have the option of automatically creating a
network load balancer. This provides an
externally-accessible IP address that sends traffic to the correct port on your
cluster nodes.

## Configuration file

To create an external load balancer, add the following line to your
[service configuration file](/docs/user-guide/services/operations/#service-configuration-file):

    "type": "LoadBalancer"

Your configuration file might look like:

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

## Using kubectl

You can alternatively create the service with the `kubectl expose` command and
its `--type=LoadBalancer` flag:

    $ kubectl expose rc example --port=8765 --target-port=9376 \
        --name=example-service --type=LoadBalancer

This command creates a new service using the same selectors as the referenced
resource (in the case of the example above, a replication controller named
`example`.)

For more information, including optional flags, refer to the
[`kubectl expose` reference](/docs/user-guide/kubectl/kubectl_expose/).

## Finding your IP address

You can find the IP address created for your service by getting the service
information through `kubectl`:

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

The IP address is listed next to `LoadBalancer Ingress`.
