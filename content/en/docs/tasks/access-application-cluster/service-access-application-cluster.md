---
title: Use a Service to Access an Application in a Cluster
content_type: tutorial
weight: 60
---

<!-- overview -->

This page shows how to create a Kubernetes Service object that external
clients can use to access an application running in a cluster. The Service
provides load balancing for an application that has two running instances.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

## {{% heading "objectives" %}}

- Run two instances of a Hello World application.
- Create a Service object that exposes a node port.
- Use the Service object to access the running application.

<!-- lessoncontent -->

## Creating a service for an application running in two pods

Here is the configuration file for the application Deployment:

{{% code_sample file="service/access/hello-application.yaml" %}}

1. Run a Hello World application in your cluster:
   Create the application Deployment using the file above:

   ```shell
   kubectl apply -f https://k8s.io/examples/service/access/hello-application.yaml
   ```

   The preceding command creates a
   {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
   and an associated
   {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}.
   The ReplicaSet has two
   {{< glossary_tooltip text="Pods" term_id="pod" >}}
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

   ```none
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

   Make a note of the NodePort value for the Service. For example,
   in the preceding output, the NodePort value is 31496.

1. List the pods that are running the Hello World application:

   ```shell
   kubectl get pods --selector="run=load-balancer-example" --output=wide
   ```

   The output is similar to this:

   ```none
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

   ```none
   Hello, world!
   Version: 2.0.0
   Hostname: hello-world-cdd4458f4-m47c8
   ```

## Using a service configuration file

As an alternative to using `kubectl expose`, you can use a
[service configuration file](/docs/concepts/services-networking/service/)
to create a Service.

## {{% heading "cleanup" %}}

To delete the Service, enter this command:

    kubectl delete services example-service

To delete the Deployment, the ReplicaSet, and the Pods that are running
the Hello World application, enter this command:

    kubectl delete deployment hello-world

## {{% heading "whatsnext" %}}

Follow the
[Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/)
tutorial.
