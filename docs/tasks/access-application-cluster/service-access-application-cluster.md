---
title: Use a Service to Access an Application in a Cluster
---

{% capture overview %}

This page shows how to create a Kubernetes Service object that external
clients can use to access an application running in a cluster. The Service
provides load balancing for an application that has two running instances.

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture objectives %}

* Run two instances of a Hello World application.
* Create a Service object that exposes a node port.
* Use the Service object to access the running application.

{% endcapture %}


{% capture lessoncontent %}

## Creating a service for an application running in two pods

1. Run a Hello World application in your cluster:

        kubectl run hello-world --replicas=2 --labels="run=load-balancer-example" --image=gcr.io/google-samples/node-hello:1.0  --port=8080

    The preceding command creates a
    [Deployment](/docs/concepts/workloads/controllers/deployment/)
    object and an associated
    [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
    object. The ReplicaSet has two
    [Pods](/docs/concepts/workloads/pods/pod/),
    each of which runs the Hello World application.

1. Display information about the Deployment:

        kubectl get deployments hello-world
        kubectl describe deployments hello-world

1. Display information about your ReplicaSet objects:

        kubectl get replicasets
        kubectl describe replicasets

1. Create a Service object that exposes the deployment:

        kubectl expose deployment hello-world --type=NodePort --name=example-service

1. Display information about the Service:

        kubectl describe services example-service

    The output is similar to this:

        Name:                   example-service
        Namespace:              default
        Labels:                 run=load-balancer-example
        Selector:               run=load-balancer-example
        Type:                   NodePort
        IP:                     10.32.0.16
        Port:                   <unset> 8080/TCP
        NodePort:               <unset> 31496/TCP
        Endpoints:              10.200.1.4:8080,10.200.2.5:8080
        Session Affinity:       None
        No events.

    Make a note of the NodePort value for the service. For example,
    in the preceding output, the NodePort value is 31496.

1. List the pods that are running the Hello World application:

        kubectl get pods --selector="run=load-balancer-example" --output=wide

    The output is similar to this:

        NAME                           READY   STATUS    ...  IP           NODE
        hello-world-2895499144-bsbk5   1/1     Running   ...  10.200.1.4   worker1
        hello-world-2895499144-m1pwt   1/1     Running   ...  10.200.2.5   worker2

1. Get the public IP address of one of your nodes that is running
   a Hello World pod. How you get this address depends on how you set
   up your cluster. For example, if you are using Minikube, you can
   see the node address by running `kubectl cluster-info`. If you are
   using Google Compute Engine instances, you can use the
   `gcloud compute instances list` command to see the public addresses of your
   nodes.

1. On your chosen node, create a firewall rule that allows TCP traffic
   on your node port. For example, if your Service has a NodePort value of
   31568, create a firewall rule that allows TCP traffic on port 31568.

1. Use the node address and node port to access the Hello World application:

        curl http://<public-node-ip>:<node-port>

    where `<public-node-ip>` is the public IP address of your node,
    and `<node-port>` is the NodePort value for your service.

    The response to a successful request is a hello message:

        Hello Kubernetes!

## Using a service configuration file

As an alternative to using `kubectl expose`, you can use a
[service configuration file](/docs/user-guide/services/operations)
to create a Service.

{% endcapture %}


{% capture cleanup %}

To delete the Service, enter this command:

    kubectl delete services example-service

To delete the Deployment, the ReplicaSet, and the Pods that are running
the Hello World application, enter this command:

    kubectl delete deployment hello-world

{% endcapture %}


{% capture whatsnext %}

Learn more about
[connecting applications with services](/docs/concepts/services-networking/connect-applications-service/).
{% endcapture %}

{% include templates/tutorial.md %}

