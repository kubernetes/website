---
object_rankings:
- concept: livenessProbe
  rank: 1
- concept: probe
  rank: 1
concept_rankings:
- concept: pod
  rank: 2
- concept: container
  rank: 2
- concept: restartPolicy
  rank: 2
---

{% capture overview %}
This page shows how to use an external load balancer to access and application
running in a Kubernetes cluster.
{% endcapture %}

{% capture prerequisites %}
? Hava a cluster ?
{% endcapture %}

{% capture steps %}

1. To create an external load balancer, add the this line to your
   [service configuration file](/docs/user-guide/services/operations/#service-configuration-file):

        "type": "LoadBalancer"

    For example, your configuration file might look like this:

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

    As an alternative to using a configuration file, you can create the service
    by using the `kubectl expose` command with the `--type=LoadBalancer` flag:

        kubectl expose rc example --port=8765 --target-port=9376 \
            --name=example-service --type=LoadBalancer

2. Find the IP address for your service:

        kubectl describe services example-service

    The IP address is listed next to `LoadBalancer Ingress`.

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

{% endcapture %}

{% capture discussion %}
Link to alpha information in release notes or in a special seciont of the docs.
{% endcapture %}

{% capture whats_next %}
1. xxx
1. xxx
{% endcapture %}

{% include templates/task.md %}
