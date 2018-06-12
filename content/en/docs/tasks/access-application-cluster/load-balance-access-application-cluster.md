---
title: Provide Load-Balanced Access to an Application in a Cluster
content_template: templates/tutorial
weight: 50
---

{{% capture overview %}}

This page shows how to create a Kubernetes Service object that provides
load-balanced access to an application running in a cluster.

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture objectives %}}

* Run two instances of a Hello World application
* Create a Service object
* Use the Service object to access the running application

{{% /capture %}}


{{% capture lessoncontent %}}

## Creating a Service for an application running in two pods

1. Run a Hello World application in your cluster:

       ```
       kubectl run hello-world --replicas=2 --labels="run=load-balancer-example" --image=gcr.io/google-samples/node-hello:1.0  --port=8080
       ```
       
1. List the pods that are running the Hello World application:

       ```
       kubectl get pods --selector="run=load-balancer-example"
       ```

    The output is similar to this:

       ```
       NAME                           READY     STATUS    RESTARTS   AGE
       hello-world-2189936611-8fyp0   1/1       Running   0          6m
       hello-world-2189936611-9isq8   1/1       Running   0          6m
       ```

1. Create a Service object that exposes the deployment:

       ```
       kubectl expose deployment <your-deployment-name> --type=NodePort --name=example-service
       ```

    where `<your-deployment-name>` is the name of your deployment.

1. Display the IP addresses for your service:

       ```
       kubectl get services example-service
       ```
   
   The output shows the internal IP address and the external IP address of
   your service. If the external IP address shows as `<pending>`, repeat the
   command.

   {{< note >}}
   **Note:** If you are using Minikube, you don't get an external IP address. The
   external IP address remains in the pending state.
   {{< /note >}}

       NAME              CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
       example-service   10.0.0.160   <pending>     8080/TCP   40s

1. Use your Service object to access the Hello World application:

       curl <your-external-ip-address>:8080

   where `<your-external-ip-address>` is the external IP address of your
   service.

   The output is a hello message from the application:

       Hello Kubernetes!

   {{< note >}}
   **Note:** If you are using Minikube, enter these commands:
   {{< /note >}}

       kubectl cluster-info
       kubectl describe services example-service

   The output displays the IP address of your Minikube node and the NodePort
   value for your service. Then enter this command to access the Hello World
   application:

       curl <minikube-node-ip-address>:<service-node-port>

   where `<minikube-node-ip-address>` us the IP address of your Minikube node,
   and `<service-node-port>` is the NodePort value for your service.

## Using a service configuration file

As an alternative to using `kubectl expose`, you can use a
[service configuration file](/docs/concepts/services-networking/service/)
to create a Service.


{{% /capture %}}


{{% capture whatsnext %}}

Learn more about
[connecting applications with services](/docs/concepts/services-networking/connect-applications-service/).
{{% /capture %}}



