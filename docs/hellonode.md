---
---

* TOC
{:toc}

## Introduction

The goal of this codelab is for you to turn a simple Hello World node.js app into a replicated application running on Kubernetes. We will show you how to take code that you have developed on your machine, turn it into a Docker container image, and then run that image on [Google Container Engine](https://cloud.google.com/container-engine/).

Here’s a diagram of the various parts in play in this codelab to help you understand how pieces fit with one another. Use this as a reference as we progress through the codelab; it should all make sense by the time we get to the end.

![image](/images/hellonode/image_1.png)

Kubernetes is an open source project which can run on many different environments, from laptops to high-availability multi-node clusters, from public clouds to on-premise deployments, from virtual machines to bare metal. Using a managed environment such as Google Container Engine (a Google-hosted version of Kubernetes) will allow you to focus more on experiencing Kubernetes rather than setting up the underlying infrastructure.

## Setup and Requirements

If you don't already have a Google Account (Gmail or Google Apps), you must [create one](https://accounts.google.com/SignUp). Then, sign-in to Google Cloud Platform console ([console.cloud.google.com](http://console.cloud.google.com)) and create a new project:

![image](/images/hellonode/image_2.png)

![image](/images/hellonode/image_3.png)

Remember the project ID; it will be referred to later in this codelab as `PROJECT_ID`.

Next, [enable billing](https://console.developers.google.com/billing) in the Developers Console in order to use Google Cloud resources and [enable the Container Engine API](https://console.developers.google.com/project/_/kubernetes/list).

New users of Google Cloud Platform recieve a [$300 free trial](https://console.developers.google.com/billing/freetrial?hl=en). Running through this codelab shouldn’t cost you more than a few dollars of that trial. Google Container Engine pricing is documented [here](https://cloud.google.com/container-engine/docs/#pricing).

Next, make sure you [download Node.js](https://nodejs.org/en/download/).

## Create your Node.js application

The first step is to write the application. Save this code in a folder called "`hellonode/`" with the filename `server.js`:

#### server.js

```javascript
var http = require('http');
var handleRequest = function(request, response) {
  response.writeHead(200);
  response.end("Hello World!");
}
var www = http.createServer(handleRequest);
www.listen(8080);
```

Now run this simple command :

```shell
node server.js
```

You should be able to see your "Hello World!" message at http://localhost:8080/

Stop the running node server by pressing Ctrl-C.

Now let’s package this application in a Docker container.

## Create a Docker container image

Next, create a file, also within `helloworld/` named `Dockerfile`. A Dockerfile describes the image that you want to build. Docker container images can extend from other existing images so for this image, we'll extend from an existing Node image.

#### Dockerfile

```conf
FROM node:0.12
EXPOSE 8080
COPY server.js .
CMD node server.js
```

This "recipe" for the Docker image will start from the Node 0.12 image found on the Docker registry, expose port 8080, copy our `server.js` file to the image and start the Node server.

Now build an image of your container by running `docker build`, tagging the image with the Google  Container Registry repo for your `PROJECT_ID`:

```shell
docker build -t gcr.io/PROJECT_ID/hello-node:v1 .
```
Now there is a trusted source for getting an image of your containerized app.

Let's try your image out with Docker:

```shell
docker run -d -p 8080:8080 gcr.io/PROJECT_ID/hello-node:v1
325301e6b2bffd1d0049c621866831316d653c0b25a496d04ce0ec6854cb7998
```

Visit your app in the browser, or use `curl` or `wget` if you’d like :

```shell
curl http://localhost:8080
Hello World!
```

Let’s now stop the container. In this example, our app was running as Docker process `2c66d0efcbd4`, which we looked up with `docker ps`:

```shell
docker ps
CONTAINER ID        IMAGE                              COMMAND
2c66d0efcbd4        gcr.io/PROJECT_ID/hello-node:v1    "/bin/sh -c 'node    

$ docker stop 2c66d0efcbd4
2c66d0efcbd4
```

Now that the image works as intended and is all tagged with your `PROJECT_ID`, we can push it to the [Google Container Registry](https://cloud.google.com/tools/container-registry/), a private repository for your Docker images accessible from every Google Cloud project (but also from outside Google Cloud Platform) :

```shell
gcloud docker push gcr.io/PROJECT_ID/hello-node:v1
```

If all goes well, you should be able to see the container image listed in the console: *Compute > Container Engine > Container Registry*. We now have a project-wide Docker image available which Kubernetes can access and orchestrate.

![image](/images/hellonode/image_10.png)


## Create your cluster

A cluster consists of a master API server and a set of worker VMs called nodes. 

Create a cluster via the Console: *Compute > Container Engine > Container Clusters > New container cluster*. Leave all the options default, and you should get a Kubernetes cluster with three nodes, ready to receive your container image.

![image](/images/hellonode/image_11.png)

It’s now time to deploy your own containerized application to the Kubernetes cluster! Please ensure that you have [configured](https://cloud.google.com/container-engine/docs/before-you-begin#optional_set_gcloud_defaults) `kubectl` to use the cluster you just created.

## Create your pod

A kubernetes **pod** is a group of containers, tied together for the purposes of administration and networking. It can contain a single container or multiple.

Create a pod with the `kubectl run` command:

```shell
kubectl run hello-node \
    --image=gcr.io/PROJECT_ID/hello-node:v1 \
    --port=8080
CONTROLLER  CONTAINER(S)  IMAGE(S)                     SELECTOR        REPLICAS
hello-node  hello-node    gcr.io/..../hello-node:v1    run=hello-node  1
```

Now is probably a good time to run through some of the following interesting kubectl commands (none of these will change the state of the cluster, full documentation is available [here](https://cloud.google.com/container-engine/docs/kubectl/)):

```shell
$ kubectl get pods
$ kubectl logs
$ kubectl cluster-info
$ kubectl config view
$ kubectl get events
```

At this point you should have our container running under the control of Kubernetes but we still have to make it accessible to the outside world.

## Allow external traffic

By default, the pod is only accessible by its internal IP within the Kubernetes cluster. In order to make the `hello-node` container accessible from outside the kubernetes virtual network, you have to expose the pod as a kubernetes service.

From our development machine we can expose the pod with the `kubectl` expose command and the `--type="LoadBalancer"` flag which creates an external IP to accept traffic:

```shell
kubectl expose rc hello-node --type="LoadBalancer"
```

The flag used in this command specifies that we’ll be using the load-balancer provided by the underlying infrastructure (in this case the [Compute Engine load balancer](https://cloud.google.com/compute/docs/load-balancing/)). The `rc` refers to the Kubernetes "replication controller" -- which is a Kubernetes service which controls load balancing and scaling behavior for your cluster. 

The Kubernetes master creates the load balancer and related Compute Engine forwarding rules, target pools, and firewall rules to make the service fully accessible from outside of Google Cloud Platform.

To find the publicly-accessible IP address, ask `kubectl` to describe the `hello-node` cluster service:

```shell
kubectl get services hello-node
NAME         CLUSTER_IP    EXTERNAL_IP     PORT(S)    SELECTOR         AGE
hello-node   10.3.246.12   23.251.159.72   8080/TCP   run=hello-node   53s
```

Note there are 2 IP addresses listed, both serving port 8080. One is the internal IP that is only visible inside your cloud virtual network; the other is the external load-balanced IP. In this example, the external IP address is 23.251.159.72. Traffic to the load-balanced IP will be load balanced to the three nodes you provisioned when initially creating the cluster!

You should now be able to reach the service by pointing your browser to this address: http://<EXTERNAL_IP>**:8080**

![image](/images/hellonode/image_12.png)

## Scale up your website

One of the powerful features offered by Kubernetes is how easy it is to scale your application. Suppose you suddenly need more capacity for your application; you can simply tell the replication controller to manage a new number of replicas for your pod:

```shell
kubectl scale rc hello-node --replicas=4
$ kubectl get pods
NAME               READY     STATUS    RESTARTS   AGE
hello-node-6uzt8   1/1       Running   0          8m
hello-node-gxhty   1/1       Running   0          34s
hello-node-z2odh   1/1       Running   0          34s
```

You now have four replicas of your application, each running independently on the cluster with the load balancer you created earlier and serving traffic to all of them. 

```shell
kubectl get rc hello-node
CONTROLLER   CONTAINER(S)   IMAGE(S)                    SELECTOR         REPLICAS
hello-node   hello-node     gcr.io/..../hello-node:v1   run=hello-node   3
```

Note the **declarative approach** here - rather than starting or stopping new instances you declare how many instances you want to be running. Kubernetes reconciliation loops simply make sure the reality matches what you requested and take action if needed.

Here’s a diagram summarizing the state of our Kubernetes cluster:

![image](/images/hellonode/image_13.png)

## Roll out an upgrade to your website

As always, the application you deployed to production requires bug fixes or additional features. Kubernetes is here to help you deploy a new version to production without impacting your users.

First, let’s modify the application. On the development machine, edit server.js and update the response message:

```javascript
  response.end("Hello Kubernetes World!");
```


We can now build and publish a new container image to the registry with an incremented tag:

```shell
docker build -t gcr.io/PROJECT_ID/hello-node:v2 . 
docker push gcr.io/PROJECT_ID/hello-node:v2
```

Building and pushing this updated image should be much quicker as we take full advantage of the Docker cache.

We’re now ready for kubernetes to smoothly update our replication controller to the new version of the application:

```shell
kubectl rolling-update hello-node \
    --image=gcr.io/PROJECT_ID/hello-node:v2 \
    --update-period=2s
Creating hello-node-324d23dd3e0e2474d6b76dc599abb519
At beginning of loop: hello-node replicas: 2, hello-node-324d23dd3e0e2474d6b76dc599abb519 replicas: 1
...
At end of loop: hello-node replicas: 0, hello-node-324d23dd3e0e2474d6b76dc599abb519 replicas: 3
Update succeeded. Deleting old controller: hello-node
Renaming hello-node-324d23dd3e0e2474d6b76dc599abb519 to hello-node
hello-node
```

You should see in the standard output how the rolling update actually works:

1. A new replication controller is created based on the new image

2. The replica count on the new and old controllers is increased/decreased by one respectively until the desired number of replicas is reached

3. The original replication controller is deleted.

While this is happening, the users of the services should not see any interruption. After a little while they will start accessing the new version of your application. You can find more details on rolling updates in [this documentation](https://cloud.google.com/container-engine/docs/rolling-updates).

Hopefully with these deployment, scaling and update features you’ll agree that once you’ve setup your environment (your GKE/Kubernetes cluster here), Kubernetes is here to help you focus on the application rather than the infrastructure.

## Observe the Kubernetes Graphical dashboard (optional)

While logged into your development machine, execute the following commands:

```shell
kubectl config view | grep "password"
    password: vUYwC5ATJMWa6goh
$ kubectl cluster-info
  ... 
  KubeUI is running at https://<ip-address>/api/v1/proxy/namespaces/kube-system/services/kube-ui
  ...
```

Navigate to the URL that is shown under after KubeUI is running at and log in with username "admin" and the password retrieved above and enjoy the Kubernetes graphical dashboard!

![image](/images/hellonode/image_14.png)

## That's it! Time to tear it down

That's it for the demo! So you don't leave this all running and incur charges, let's learn how to tear things down. 

First, delete the Service, which also deletes your external load balancer:

```shell
kubectl delete services hello-node
```

Delete the running pods:

```shell
kubectl delete rc hello-node
```

Delete your cluster:

```shell
gcloud container clusters delete hello-world
Waiting for cluster deletion...done.
name: operation-xxxxxxxxxxxxxxxx
operationType: deleteCluster
status: done
target: /projects/kubernetes-codelab/zones/us-central1-f/clusters/hello-world
zone: us-central1-f
```

This deletes the Google Compute Engine instances that are running the cluster.

Finally delete the Docker registry storage bucket hosting your image(s) :

```shell
gsutil ls
gs://artifacts.<PROJECT_ID>.appspot.com/
$ gsutil rm -r gs://artifacts.<PROJECT_ID>.appspot.com/
Removing gs://artifacts.<PROJECT_ID>.appspot.com/...
```

Of course, you can also delete the entire project but note that you must first disable billing on the project. Additionally, deleting a project will only happen after the current billing cycle ends.
