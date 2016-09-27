---
---

{% capture overview %}

This page shows how to create a Kubernetes Service object that external
clients can use to access an application running in a cluster. The
Service exposes a stable IP address and provides load balancing for
an application that has two running instances.

{% endcapture %}


{% capture prerequisites %}

* Install [kubectl](http://kubernetes.io/docs/user-guide/prereqs).

* Create a Kubernetes cluster, including a running Kubernetes
  API server. One way to create a new cluster is to use
  [Minikube](/docs/getting-started-guides/minikube).

* Configure `kubectl` to communicate with your Kubernetes API server. This
  configuration is done automatically if you use Minikube.

{% endcapture %}


{% capture objectives %}

* Run two instances of a Hello World application.
* Create a Service object that exposes an external IP address.
* Use the Service object to access the running application.

{% endcapture %}


{% capture lessoncontent %}

### Creating a service for an application running in two pods

1. Run a Hello World application in your cluster:

        kubectl run hello-world --replicas=2 --labels="run=load-balancer-example" --image=gcr.io/google-samples/node-hello:1.0  --port=8080

    The preceding command creates a
    [Deployment](/docs/user-guide/deployments/)
    object and an associated
    [ReplicaSet](/docs/user-guide/replicasets/)
    object. The ReplicaSet has two
    [Pods](/docs/user-guide/pods/),
    each of which runs the Hello World application.

1. Display information about the Deployment:

        kubectl get deployments hello-world
        kubectl describe deployments hello-world

1. Display information about the ReplicaSet:

        kubectl get replicasets hello-world
        kubectl describe replicasets hello-world

1. List the pods that are running the Hello World application:

        kubectl get pods --selector="run=load-balancer-example"

    The output is similar to this:

        NAME                           READY     STATUS    RESTARTS   AGE
        hello-world-2189936611-8fyp0   1/1       Running   0          6m
        hello-world-2189936611-9isq8   1/1       Running   0          6m

1. Create a Service object that exposes the deployment:

        kubectl expose deployment hello-world --type="LoadBalancer" --name="example-service"

1. Display the IP addresses for your service:

        kubectl get services example-service

   The output shows the internal IP address and the external IP address of
   your service. If the external IP address shows as `<pending>`, repeat the
   command.

   Note: If you are using Minikube, you don't get an external IP address. The
   external IP address remains in the pending state.

       NAME              CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
       example-service   10.0.0.160   <pending>     8080/TCP   40s

1. Use your service to access the Hello World application:

        curl <your-external-ip-address>:8080

    where `<your-external-ip-address>` is the external IP address of your
    service.

    The output is a hello message from the application:

        Hello Kubernetes!

    Note: If you are using Minikube, enter these commands:

        kubectl cluster-info
        kubectl describe services example-service

    The output displays the IP address of your Minikube node and the NodePort
    value for your service. Enter this command to access the Hello World
    application:

        curl <minikube-node-ip-address>:<service-node-port>

    where `<minikube-node-ip-address>` us the IP address of your Minikube node,
    and `<service-node-port>` is the NodePort value for your service.

### Using a service configuration file

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
[connecting applications with services](/docs/user-guide/connecting-applications/).
{% endcapture %}

{% include templates/tutorial.md %}

