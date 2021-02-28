---
title: "Example: Deploying PHP Guestbook application with MongoDB"
reviewers:
- ahmetb
content_type: tutorial
weight: 20
card:
  name: tutorials
  weight: 30
  title: "Stateless Example: PHP Guestbook with MongoDB"
min-kubernetes-server-version: v1.14
---

<!-- overview -->
This tutorial shows you how to build and deploy a simple _(not production ready)_, multi-tier web application using Kubernetes and [Docker](https://www.docker.com/). This example consists of the following components:

* A single-instance [MongoDB](https://www.mongodb.com/) to store guestbook entries
* Multiple web frontend instances

## {{% heading "objectives" %}}

* Start up a Mongo database.
* Start up the guestbook frontend.
* Expose and view the Frontend Service.
* Clean up.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}



<!-- lessoncontent -->

## Start up the Mongo Database

The guestbook application uses MongoDB to store its data.

### Creating the Mongo Deployment

The manifest file, included below, specifies a Deployment controller that runs a single replica MongoDB Pod.

{{< codenew file="application/guestbook/mongo-deployment.yaml" >}}

1. Launch a terminal window in the directory you downloaded the manifest files.
1. Apply the MongoDB Deployment from the `mongo-deployment.yaml` file:

      <!---
      for local testing of the content via relative file path
      kubectl apply -f ./content/en/examples/application/guestbook/mongo-deployment.yaml
      -->

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/mongo-deployment.yaml
      ```

1. Query the list of Pods to verify that the MongoDB Pod is running:

      ```shell
      kubectl get pods
      ```

      The response should be similar to this:

      ```shell
      NAME                     READY   STATUS    RESTARTS   AGE
      mongo-75f59d57f4-w9gv8   1/1     Running   0          100s
      ```

1. Run the following command to view the logs from the MongoDB Deployment:

     ```shell
     kubectl logs -f deployment/mongo
     ```

### Creating the MongoDB Service

The guestbook application needs to communicate to the MongoDB to write its data. You need to apply a [Service](/docs/concepts/services-networking/service/) to proxy the traffic to the MongoDB Pod. A Service defines a policy to access the Pods.

{{< codenew file="application/guestbook/mongo-service.yaml" >}}

1. Apply the MongoDB Service from the following `mongo-service.yaml` file:

      <!---
      for local testing of the content via relative file path
      kubectl apply -f ./content/en/examples/application/guestbook/mongo-service.yaml
      -->
      
      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/mongo-service.yaml
      ```

1. Query the list of Services to verify that the MongoDB Service is running:

      ```shell
      kubectl get service
      ```

      The response should be similar to this:

      ```shell
      NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
      kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP     7m7s
      mongo        ClusterIP   10.96.30.147   <none>        27017/TCP   2m17s
      ```

{{< note >}}
This manifest file creates a Service named `mongo` with a set of labels that match the labels previously defined, so the Service routes network traffic to the MongoDB Pod.
{{< /note >}}


## Set up and Expose the Guestbook Frontend

The guestbook application has a web frontend serving the HTTP requests written in PHP. It is configured to connect to the `mongo` Service to store Guestbook entries.

### Creating the Guestbook Frontend Deployment

{{< codenew file="application/guestbook/frontend-deployment.yaml" >}}

1. Apply the frontend Deployment from the `frontend-deployment.yaml` file:

      <!---
      for local testing of the content via relative file path
      kubectl apply -f ./content/en/examples/application/guestbook/frontend-deployment.yaml
      -->

      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-deployment.yaml
      ```

1. Query the list of Pods to verify that the three frontend replicas are running:

      ```shell
      kubectl get pods -l app.kubernetes.io/name=guestbook -l app.kubernetes.io/component=frontend
      ```

      The response should be similar to this:

      ```
      NAME                       READY   STATUS    RESTARTS   AGE
      frontend-848d88c7c-hpf8z   1/1     Running   0          28s
      frontend-848d88c7c-hwxg4   1/1     Running   0          28s
      frontend-848d88c7c-njxgk   1/1     Running   0          28s
      ```

### Creating the Frontend Service

The `mongo` Services you applied is only accessible within the Kubernetes cluster because the default type for a Service is [ClusterIP](/docs/concepts/services-networking/service/#publishing-services---service-types). `ClusterIP` provides a single IP address for the set of Pods the Service is pointing to. This IP address is accessible only within the cluster.

If you want guests to be able to access your guestbook, you must configure the frontend Service to be externally visible, so a client can request the Service from outside the Kubernetes cluster. However a Kubernetes user you can use `kubectl port-forward` to access the service even though it uses a `ClusterIP`.

{{< note >}}
Some cloud providers, like Google Compute Engine or Google Kubernetes Engine, support external load balancers. If your cloud provider supports load balancers and you want to use it, uncomment `type: LoadBalancer`.
{{< /note >}}

{{< codenew file="application/guestbook/frontend-service.yaml" >}}

1. Apply the frontend Service from the `frontend-service.yaml` file:

      <!---
      for local testing of the content via relative file path
      kubectl apply -f ./content/en/examples/application/guestbook/frontend-service.yaml
      -->
      
      ```shell
      kubectl apply -f https://k8s.io/examples/application/guestbook/frontend-service.yaml
      ```

1. Query the list of Services to verify that the frontend Service is running:

      ```shell
      kubectl get services
      ```

      The response should be similar to this:

      ```
      NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
      frontend     ClusterIP   10.96.35.36    <none>        80/TCP      23s
      kubernetes   ClusterIP   10.96.0.1      <none>        443/TCP     9m17s
      mongo        ClusterIP   10.96.30.147   <none>        27017/TCP   4m27s
      ```

### Viewing the Frontend Service via `kubectl port-forward`

1. Run the following command to forward port `8080` on your local machine to port `80` on the service.

      ```shell
      kubectl port-forward svc/frontend 8080:80
      ```

      The response should be similar to this:

      ```
      Forwarding from 127.0.0.1:8080 -> 80
      Forwarding from [::1]:8080 -> 80
      ```

1. load the page [http://localhost:8080](http://localhost:8080) in your browser to view your guestbook.

### Viewing the Frontend Service via `LoadBalancer`

If you deployed the `frontend-service.yaml` manifest with type: `LoadBalancer` you need to find the IP address to view your Guestbook.

1. Run the following command to get the IP address for the frontend Service.

      ```shell
      kubectl get service frontend
      ```

      The response should be similar to this:

      ```
      NAME       TYPE           CLUSTER-IP      EXTERNAL-IP        PORT(S)        AGE
      frontend   LoadBalancer   10.96.35.36     109.197.92.229     80:32372/TCP   1m
      ```

1. Copy the external IP address, and load the page in your browser to view your guestbook.

## Scale the Web Frontend

You can scale up or down as needed because your servers are defined as a Service that uses a Deployment controller.

1. Run the following command to scale up the number of frontend Pods:

      ```shell
      kubectl scale deployment frontend --replicas=5
      ```

1. Query the list of Pods to verify the number of frontend Pods running:

      ```shell
      kubectl get pods
      ```

      The response should look similar to this:

      ```
      NAME                       READY   STATUS    RESTARTS   AGE
      frontend-848d88c7c-fnphh   1/1     Running   0          6s
      frontend-848d88c7c-hpf8z   1/1     Running   0          10m
      frontend-848d88c7c-hwxg4   1/1     Running   0          10m
      frontend-848d88c7c-kb54g   1/1     Running   0          6s
      frontend-848d88c7c-njxgk   1/1     Running   0          10m
      mongo-75f59d57f4-w9gv8     1/1     Running   0          15m
      ```

1. Run the following command to scale down the number of frontend Pods:

      ```shell
      kubectl scale deployment frontend --replicas=2
      ```

1. Query the list of Pods to verify the number of frontend Pods running:

      ```shell
      kubectl get pods
      ```

      The response should look similar to this:

      ```
      NAME                       READY   STATUS    RESTARTS   AGE
      frontend-848d88c7c-hpf8z   1/1     Running   0          12m
      frontend-848d88c7c-njxgk   1/1     Running   0          12m
      mongo-75f59d57f4-w9gv8     1/1     Running   0          16m
      ```



## {{% heading "cleanup" %}}

Deleting the Deployments and Services also deletes any running Pods. Use labels to delete multiple resources with one command.

1. Run the following commands to delete all Pods, Deployments, and Services.

      ```shell
      kubectl delete deployment -l app.kubernetes.io/name=mongo
      kubectl delete service -l app.kubernetes.io/name=mongo
      kubectl delete deployment -l app.kubernetes.io/name=guestbook
      kubectl delete service -l app.kubernetes.io/name=guestbook
      ```

      The responses should be:

      ```
      deployment.apps "mongo" deleted
      service "mongo" deleted
      deployment.apps "frontend" deleted
      service "frontend" deleted
      ```

1. Query the list of Pods to verify that no Pods are running:

      ```shell
      kubectl get pods
      ```

      The response should be this:

      ```
      No resources found.
      ```



## {{% heading "whatsnext" %}}

* Complete the [Kubernetes Basics](/docs/tutorials/kubernetes-basics/) Interactive Tutorials
* Use Kubernetes to create a blog using [Persistent Volumes for MySQL and Wordpress](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/#visit-your-new-wordpress-blog)
* Read more about [connecting applications](/docs/concepts/services-networking/connect-applications-service/)
* Read more about [Managing Resources](/docs/concepts/cluster-administration/manage-deployment/#using-labels-effectively)
