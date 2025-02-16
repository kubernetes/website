---
title: Exposing an External IP Address to Access an Application in a Cluster
content_type: tutorial
weight: 10
---

<!-- overview -->

This page shows how to create a Kubernetes Service object that exposes an
external IP address.

## {{% heading "prerequisites" %}}

* Install [kubectl](/docs/tasks/tools/).
* Use a cloud provider like Google Kubernetes Engine or Amazon Web Services to
  create a Kubernetes cluster. This tutorial creates an
  [external load balancer](/docs/tasks/access-application-cluster/create-external-load-balancer/),
  which requires a cloud provider.
* Configure `kubectl` to communicate with your Kubernetes API server. For instructions, see the
  documentation for your cloud provider.

## {{% heading "objectives" %}}

* Run five instances of a Hello World application.
* Create a Service object that exposes an external IP address.
* Use the Service object to access the running application.

<!-- lessoncontent -->

## Creating a service for an application running in five pods

1. Run a Hello World application in your cluster:

   {{% code_sample file="service/load-balancer-example.yaml" %}}

   ```shell
   kubectl apply -f https://k8s.io/examples/service/load-balancer-example.yaml
   ```
   The preceding command creates a
   {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
   and an associated
   {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}.
   The ReplicaSet has five
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
   kubectl expose deployment hello-world --type=LoadBalancer --name=my-service
   ```

1. Display information about the Service:

   ```shell
   kubectl get services my-service
   ```

   The output is similar to:

   ```console
   NAME         TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)    AGE
   my-service   LoadBalancer   10.3.245.137   104.198.205.71   8080/TCP   54s
   ```

   {{< note >}}

   The `type=LoadBalancer` service is backed by external cloud providers, which is not covered in this example, please refer to [this page](/docs/concepts/services-networking/service/#loadbalancer) for the details.

   {{< /note >}}

   {{< note >}}

   If the external IP address is shown as \<pending\>, wait for a minute and enter the same command again.

   {{< /note >}}

1. Display detailed information about the Service:

   ```shell
   kubectl describe services my-service
   ```

   The output is similar to:

   ```console
   Name:           my-service
   Namespace:      default
   Labels:         app.kubernetes.io/name=load-balancer-example
   Annotations:    <none>
   Selector:       app.kubernetes.io/name=load-balancer-example
   Type:           LoadBalancer
   IP:             10.3.245.137
   LoadBalancer Ingress:   104.198.205.71
   Port:           <unset> 8080/TCP
   NodePort:       <unset> 32377/TCP
   Endpoints:      10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2 more...
   Session Affinity:   None
   Events:         <none>
   ```

   Make a note of the external IP address (`LoadBalancer Ingress`) exposed by
   your service. In this example, the external IP address is 104.198.205.71.
   Also note the value of `Port` and `NodePort`. In this example, the `Port`
   is 8080 and the `NodePort` is 32377.

1. In the preceding output, you can see that the service has several endpoints:
   10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2 more. These are internal
   addresses of the pods that are running the Hello World application. To
   verify these are pod addresses, enter this command:

   ```shell
   kubectl get pods --output=wide
   ```

   The output is similar to:

   ```console
   NAME                         ...  IP         NODE
   hello-world-2895499144-1jaz9 ...  10.0.1.6   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-2e5uh ...  10.0.1.8   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-9m4h1 ...  10.0.0.6   gke-cluster-1-default-pool-e0b8d269-5v7a
   hello-world-2895499144-o4z13 ...  10.0.1.7   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-segjf ...  10.0.2.5   gke-cluster-1-default-pool-e0b8d269-cpuc
   ```

1. Use the external IP address (`LoadBalancer Ingress`) to access the Hello
   World application:

   ```shell
   curl http://<external-ip>:<port>
   ```

   where `<external-ip>` is the external IP address (`LoadBalancer Ingress`)
   of your Service, and `<port>` is the value of `Port` in your Service
   description.
   If you are using minikube, typing `minikube service my-service` will
   automatically open the Hello World application in a browser.

   The response to a successful request is a hello message:

   ```shell
   Hello, world!
   Version: 2.0.0
   Hostname: 0bd46b45f32f
   ```

## {{% heading "cleanup" %}}

To delete the Service, enter this command:

```shell
kubectl delete services my-service
```

To delete the Deployment, the ReplicaSet, and the Pods that are running
the Hello World application, enter this command:

```shell
kubectl delete deployment hello-world
```

## {{% heading "whatsnext" %}}

Learn more about
[connecting applications with services](/docs/tutorials/services/connect-applications-service/).
