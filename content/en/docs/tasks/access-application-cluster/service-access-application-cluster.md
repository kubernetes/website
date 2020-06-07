---
title: Use a Service to Access an Application in a Cluster
content_template: templates/tutorial
weight: 60
---

{{% capture overview %}}

This page shows how to create a Kubernetes Service object that external
clients can use to access an application running in a cluster. The Service
provides load balancing for an application that has two running instances.

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture objectives %}}

* Run two instances of a Hello World application.
* Create a Service object that exposes a node port.
* Use the Service object to access the running application.

{{% /capture %}}


{{% capture lessoncontent %}}

## Creating a service for an application running in two pods

Here is the configuration file for the application Deployment:

{{< codenew file="service/access/hello-application.yaml" >}}

1. Run a Hello World application in your cluster:
   Create the application Deployment using the file above:
   ```shell
   kubectl apply -f https://k8s.io/examples/service/access/hello-application.yaml
   ```
   The preceding command creates a
   [Deployment](/docs/concepts/workloads/controllers/deployment/)
   object and an associated
   [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
   object. The ReplicaSet has two
   [Pods](/docs/concepts/workloads/pods/pod/),
   each of which runs the Hello World application.

1. Display information about the Deployment:
   ```shell
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

1. Display information about your ReplicaSet objects:
   ```shell
   kubectl get replicasets
   kubectl describe replicasets
   ```

1. Create a Service object that exposes the deployment:
   ```shell
   kubectl expose deployment hello-world --type=NodePort --name=example-service
   ```

1. Display information about the Service:
   ```shell
   kubectl describe services example-service
   ```
   The output is similar to this:
   ```shell
   Name:                   example-service
   Namespace:              default
   Labels:                 run=load-balancer-example
   Annotations:            <none>
   Selector:               run=load-balancer-example
   Type:                   NodePort
   IP:                     10.32.0.16
   Port:                   <unset> 8080/TCP
   TargetPort:             8080/TCP
   NodePort:               <unset> 31496/TCP
   Endpoints:              10.200.1.4:8080,10.200.2.5:8080
   Session Affinity:       None
   Events:                 <none>
   ```
   Make a note of the NodePort value for the service. For example,
   in the preceding output, the NodePort value is 31496.

1. List the pods that are running the Hello World application:
   ```shell
   kubectl get pods --selector="run=load-balancer-example" --output=wide
   ```
   The output is similar to this:
   ```shell
   NAME                           READY   STATUS    ...  IP           NODE
   hello-world-2895499144-bsbk5   1/1     Running   ...  10.200.1.4   worker1
   hello-world-2895499144-m1pwt   1/1     Running   ...  10.200.2.5   worker2
   ```
1. Get the public IP address of one of your nodes that is running
   a Hello World pod. How you get this address depends on how you set
   up your cluster. For example, if you are using Minikube, you can
   see the node address by running `kubectl cluster-info`. If you are
   using Google Compute Engine instances, you can use the
   `gcloud compute instances list` command to see the public addresses of your
   nodes.

1. On your chosen node, create a firewall rule that allows TCP traffic
   on your node port. For example, if your Service has a NodePort value of
   31568, create a firewall rule that allows TCP traffic on port 31568. Different
   cloud providers offer different ways of configuring firewall rules.

1. Use the node address and node port to access the Hello World application:
   ```shell
   curl http://<public-node-ip>:<node-port>
   ```
   where `<public-node-ip>` is the public IP address of your node,
   and `<node-port>` is the NodePort value for your service. The
   response to a successful request is a hello message:
   ```shell
   Hello Kubernetes!
   ```

## Using a service configuration file

As an alternative to using `kubectl expose`, you can use a
[service configuration file](/docs/concepts/services-networking/service/)
to create a Service.

{{% /capture %}}


{{% capture cleanup %}}

To delete the Service, enter this command:

    kubectl delete services example-service

To delete the Deployment, the ReplicaSet, and the Pods that are running
the Hello World application, enter this command:

    kubectl delete deployment hello-world

{{% /capture %}}


{{% capture whatsnext %}}

Learn more about
[connecting applications with services](/docs/concepts/services-networking/connect-applications-service/).
{{% /capture %}}
