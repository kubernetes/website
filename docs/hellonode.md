---
---

* TOC
{:toc}

## Introduction

The goal of this codelab is for you to turn your code (a simple Hello World node.js app here) into a replicated application running on Kubernetes. We will show you how to take code that you have developed on your machine, turn it into a Docker container image, and then run that image on [Google Container Engine](https://cloud.google.com/container-engine/).

Here’s a diagram of the various parts in play in this codelab to help you understand how pieces fit with one another. Use this as a reference as we progress through the codelab; it should all make sense by the time we get to the end (but feel free to ignore this for now).

![image](/images/hellonode/image_1.png)

Kubernetes is an open source project which can run on many different environments, from laptops to high-availability multi-node clusters, from public clouds to on-premise deployments, from virtual machines to bare metal.

For the purpose of this codelab, using a managed environment such as Google Container Engine (a Google-hosted version of Kubernetes running on Compute Engine) will allow you to focus more on experiencing Kubernetes rather than setting up the underlying infrastructure.

## Setup and Requirements

### Self-paced environment setup

Environment: Web

If you don't already have a Google Account (Gmail or Google Apps), you must [create one](https://accounts.google.com/SignUp). Sign-in to Google Cloud Platform console ([console.cloud.google.com](http://console.cloud.google.com)) and create a new project:

![image](/images/hellonode/image_2.png)

![image](/images/hellonode/image_3.png)

Remember the project ID, a unique name across all Google Cloud projects (the name above has already been taken and will not work for you, sorry!). It will be referred to later in this codelab as `PROJECT_ID`.

Next, you'll need to [enable billing](https://console.developers.google.com/billing) in the Developers Console in order to use Google Cloud resources and [enable the Container Engine API](https://console.developers.google.com/project/_/kubernetes/list).

Running through this codelab shouldn’t cost you more than a few dollars, but it could be more if you decide to use more resources or if you leave them running (see "cleanup" section at the end of this document). Google Container Engine pricing is documented [here](https://cloud.google.com/container-engine/docs/#pricing).

New users of Google Cloud Platform are eligible for a [$300 free trial](https://console.developers.google.com/billing/freetrial?hl=en).

### Codelab-at-a-conference setup

Environment: gcp-next

The instructor will be sharing with you temporary accounts with existing projects that are already setup so you do not need to worry about enabling billing or any cost associated with running this codelab. Note that all these accounts will be disabled soon after the codelab is over.

TODO: what will they find when they log in? See [https://docs.google.com/document/d/1WwSTJErQyfQrFE6dXhkAcxE3NLX95dd2CHass8muFvg/edit#](https://docs.google.com/document/d/1WwSTJErQyfQrFE6dXhkAcxE3NLX95dd2CHass8muFvg/edit#) 

### Google Cloud Shell

While Google Cloud and Kubernetes can be operated remotely from your laptop, in this codelab we will be using [Google Cloud Shell](https://cloud.google.com/cloud-shell/), a command line environment running in the Cloud. This Debian-based virtual machine is loaded with all the development tools you’ll need (docker, gcloud, kubectl and more), it offers a persistent 5GB home directory, and runs on the Google Cloud, greatly enhancing network performance and authentication. This means that all you will need for this codelab is a browser (yes, it works on a Chromebook).

To activate Google Cloud Shell, from the developer console simply click the button on the top right-hand side (it should only take a few moments to provision and connect to the environment):

![image](/images/hellonode/image_4.png)

![image](/images/hellonode/image_5.png)

Once connected to the cloud shell, you should see that you are already authenticated and that the project is already set to your `PROJECT_ID`:

```shell
gcloud auth list
Credentialed accounts:
 - <myaccount>@<mydomain>.com (active)
```


```shell
gcloud config list project
[core]
project = <PROJECT_ID>
```


If the project is not set, simply issue the following command :

```shell
gcloud config set project <PROJECT_ID>
```


Looking for you PROJECT_ID? Check out what ID you used in the setup steps or look it up in the console dashboard :

![image](/images/hellonode/image_6.png)

Finally, set the default zone and project configuration:

```shell
gcloud config set compute/zone us-central1-f
$ gcloud config set compute/region us-central1
```

You can pick and choose different zones too. Learn more about zones in [Regions & Zones documentation](https://cloud.google.com/compute/docs/zones).

Note: When you run gcloud on your own machine, the config settings would’ve been persisted across sessions.  But in Cloud Shell, you will need to set this for every new session or reconnection.


## Create your Node.js application

The first step is to write the application that we want to deploy to Google Container Engine. Here is a simple Node.js server:

```shell
nano server.js
```

```javascript
var http = require('http');
var handleRequest = function(request, response) {
  response.writeHead(200);
  response.end("Hello World!");
}
var www = http.createServer(handleRequest);
www.listen(8080);
```

We recommend using the nano editor but vi and emacs are also available in Cloud Shell.

From Cloud Shell simply exit the editor and save the server.js file. Since CloudShell has the node executable installed we can now run this simple command :

```shell
nano server.js
```

and use the built-in Web [preview feature](https://cloud.google.com/cloud-shell/docs/features#web_preview) of CloudShell to open a new browser tab and proxy a request to the instance you just started on port 8080.

![image](/images/hellonode/image_7.png)

![image](/images/hellonode/image_8.png)

Now, more importantly, let’s package this application in a Docker container.

Before we continue, simply stop the running node server by pressing Ctrl-C in CloudShell.

## Create a Docker container image

Next, create a Dockerfile which describes the image that you want to build. Docker container images can extend from other existing images so for this image, we'll extend from an existing Node image.


```shell
nano Dockerfile
```

#### Dockerfile

```conf
FROM node:0.12
EXPOSE 8080
COPY server.js .
CMD node server.js
```

This "recipe" for the Docker image will start from the node image found on the Docker hub, expose port 8080, copy our server.js file to the image and start the node server as we previously did manually.

Save this Dockerfile and build this image by running :

```shell
docker build -t gcr.io/PROJECT_ID/hello-node:v1 .
```


Once this completes (it’ll take some time to download and extract everything) you can test the image locally with the following command which will run a Docker container as a daemon on port 8080 from our newly-created container image:

```shell
docker run -d -p 8080:8080 gcr.io/PROJECT_ID/hello-node:v1
325301e6b2bffd1d0049c621866831316d653c0b25a496d04ce0ec6854cb7998
```


And again take advantage of the Web preview feature of CloudShell :

![image](/images/hellonode/image_9.png)

Or use `curl` or `wget` from your CloudShell prompt if you’d like :

```shell
curl http://localhost:8080
Hello World!
```

Here’s [the full documentation for the docker run command](https://docs.docker.com/reference/run/).


Let’s now stop the container :

```shell
docker ps
CONTAINER ID        IMAGE                              COMMAND
2c66d0efcbd4        gcr.io/PROJECT_ID/hello-node:v1    "/bin/sh -c 'node    
$ docker stop 2c66d0efcbd4
2c66d0efcbd4
```


Now that the image works as intended we can push it to the [Google Container Registry](https://cloud.google.com/tools/container-registry/), a private repository for your Docker images accessible from every Google Cloud project (but also from outside Google Cloud Platform) :

```shell
gcloud docker push gcr.io/PROJECT_ID/hello-node:v1
```


If all goes well, you should be able to see the container image listed in the console: *Compute > Container Engine > Container Registry*. We now have a project-wide Docker image available which Kubernetes can access and orchestrate as we’ll see in a few minutes.

![image](/images/hellonode/image_10.png)

Note that while here we used a generic domain for the registry (gcr.io), you can also be more specific about which zone and bucket to use, details are documented here: https://cloud.google.com/container-registry/#pushing_to_the_registry

If you’re curious, you can navigate through the container images as they are stored in Google Cloud Storage by following this link: [https://console.cloud.google.com/storage/browser/](https://console.cloud.google.com/storage/browser/) 

(the full link should read https://console.cloud.google.com/project/*PROJECT_ID*/storage/browser/)

## Create your cluster

Ok, you are now ready to create your Container Engine cluster. A cluster consists of a master API server hosted by Google and a set of worker nodes. The worker nodes are Compute Engine virtual machines. Let’s create a cluster with two [n1-standard-1](https://cloud.google.com/compute/docs/machine-types) nodes (this will take a few minutes to complete):

```shell
gcloud container clusters create hello-world \
		--num-nodes 2 \
		--machine-type n1-standard-1
Creating cluster hello-world...done.
Created [https://container.googleapis.com/v1/projects/kubernetes-codelab/zones/us-central1-f/clusters/hello-world].
kubeconfig entry generated for hello-world.
NAME         ZONE           MASTER_VERSION  MASTER_IP       MACHINE_TYPE   STATUS
hello-world  us-central1-f  1.0.7           146.148.46.124  n1-standard-1  RUNNING
```

Alternatively, you could create this cluster via the Console: Compute > Container Engine > Container Clusters > New container cluster.

You should now have a fully-functioning Kubernetes cluster powered by Google Container Engine:

![image](/images/hellonode/image_11.png)

Each node in the cluster is a Compute Engine instance provisioned with Kubernetes and docker binaries. If you are curious, you can list all Compute Engine instances in the project:

```shell
gcloud compute instances list
NAME                ZONE          MACHINE_TYPE   INTERNAL_IP   EXTERNAL_IP    STATUS
gke-hello-world-... us-central1-f n1-standard-1  10.240.223.99 104.197.29.149 RUNNING
gke-hello-world-... us-central1-f n1-standard-1  10.240.22.199 104.197.53.8   RUNNING
```

But you really shouldn’t have to use anything Compute Engine-specific but rather stick to the kubectl Kubernetes command line.

It’s now time to deploy your own containerized application to the Kubernetes cluster!

## Create your pod

From now on we’ll be using the standard Kubernetes command line tool: kubectl (already set up in your Cloud Shell environment).

A kubernetes **pod** is a group of containers, tied together for the purposes of administration and networking. It can contain a single container or multiple. Here we’ll simply use one container built with your Node.js image stored in our private container registry. It will serve content on port 8080.

Let’s now create a pod with the kubectl run command (replace PROJECT_ID with your own project name) :

```shell
kubectl run hello-node \
    --image=gcr.io/PROJECT_ID/hello-node:v1 \
    --port=8080
CONTROLLER  CONTAINER(S)  IMAGE(S)                     SELECTOR        REPLICAS
hello-node  hello-node    gcr.io/..../hello-node:v1    run=hello-node  1
```


Note you can also [create pods from JSON or YAML templates](https://cloud.google.com/container-engine/docs/kubectl/create).

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

By default, the pod is only accessible by its internal IP within the cluster. In order to make the hello-node container accessible from outside the kubernetes virtual network, you have to expose the pod as a kubernetes service.

From our development machine we can expose the pod with the kubectl expose command and the --create-external-load-balancer=true flag which creates an external IP to accept traffic:

```shell
kubectl expose rc hello-node --type="LoadBalancer"
```


The flag used in this command specifies that we’ll be using the load-balancer provided by the underlying infrastructure (in this case the [Compute Engine load balancer](https://cloud.google.com/compute/docs/load-balancing/)) and "rc" is a reference to the implicit replication controller created when the pod was created.

The Kubernetes master creates the load balancer and related Compute Engine forwarding rules, target pools, and firewall rules to make the service fully accessible from outside of Google Cloud Platform.

**A note on Kubernetes replication controllers**

A [replication controller](https://cloud.google.com/container-engine/docs/replicationcontrollers/) is responsible for ensuring that a specified number of pod "replicas" are running at any given time (more on that in the next section) and it will create or delete replicas to reach the desired state.

While in this simple codelab the replication controller is implicitly created, this is a critical (and arguably somewhat awesome) piece of the Kubernetes architecture. For anything beyond this codelab you will probably have to configure your own controller. Here’s a simple example of a nginx replication controller :

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: nginx
spec:
  replicas: 3
  selector:
    app: nginx
  template:
    metadata:
      name: nginx
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
```


More details on defining and configuring replication controllers can be found [here](https://cloud.google.com/container-engine/docs/replicationcontrollers/operations).

If you’re interested in what Container Engine does under the covers with Compute Engine VMs, you can check how all of your VMs are tagged with a common prefix (kubectl get nodes). This tag can be used to operate on all of the VMs in your container cluster with a single command.

To find the publicly-accessible IP address of the service, simply request kubectl to list the hello-node cluster service:

```shell
kubectl get services hello-node
NAME         CLUSTER_IP    EXTERNAL_IP     PORT(S)    SELECTOR         AGE
hello-node   10.3.246.12   23.251.159.72   8080/TCP   run=hello-node   53s
```

Note there are 2 IP addresses listed, both serving port 8080. One is the internal IP that is only visible inside your cloud virtual network; the other is the external load-balanced IP. In this example, the external IP address is 23.251.159.72.

You should now be able to reach the service by pointing your browser to this address: http://<EXTERNAL_IP>**:8080**

![image](/images/hellonode/image_12.png)

## Scale up your website

One of the powerful features offered by Kubernetes is how easy it is to scale your application. Suppose you suddenly need more capacity for your application; you can simply tell the replication controller to manage a new number of replicas for your pod:

```shell
kubectl scale rc hello-node --replicas=3
$ kubectl get pods
NAME               READY     STATUS    RESTARTS   AGE
hello-node-6uzt8   1/1       Running   0          8m
hello-node-gxhty   1/1       Running   0          34s
hello-node-z2odh   1/1       Running   0          34s
```


You now have three replicas of your application, each running independently on the cluster with the load balancer you created earlier and serving traffic to all of them. 

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
gcloud docker push gcr.io/PROJECT_ID/hello-node:v2
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
gcloud container clusters describe hello-world | egrep "password"
    password: vUYwC5ATJMWa6goh
$ kubectl cluster-info
  ... 
  KubeUI is running at https://<ip-address>/api/v1/proxy/namespaces/kube-system/services/kube-ui
  ...
```

Navigate to the URL that is shown under after KubeUI is running at and log in with username "admin" and the password retrieved above and enjoy the Kubernetes graphical dashboard!

![image](/images/hellonode/image_14.png)

## Cleanup

Time for some cleaning of the resources used (to save on cost and to be a good cloud citizen).

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

## What’s next?

This concludes this simple getting started codelab with Kubernetes. We’ve only scratched the surface of this technology and we encourage you to explore further with your own pods, replication controllers, and services but also to check out liveness probes (health checks) and consider using the Kubernetes API directly.

Here are some follow-up steps :

* Go through the more advanced ["Compute Engine & Kubernetes" codelab](https://codelabs.developers.google.com/codelabs/compute-kubernetes/) from [https://codelabs.developers.google.com](https://codelabs.developers.google.com).

* Try out other Google Cloud Platform features for yourself. Have a look at our [tutorials](https://cloud.google.com/docs/tutorials).

* Remember, Kubernetes is an open source project hosted on [GitHub](https://github.com/kubernetes/kubernetes). Your feedback and contributions are always welcome.

* You can follow the Kubernetes news on [Twitter](https://twitter.com/kubernetesio) and on the [community’s blog](http://blog.kubernetes.io/).

