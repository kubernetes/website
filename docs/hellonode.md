---
assignees:
- dchen1107
- pwittrock

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

Remember the project ID; it will be referred to later in this codelab as `$PROJECT_ID`.

Make sure you have a Linux terminal available, you will use it to control your cluster via command line. You can use [Google Cloud Shell](https://console.cloud.google.com?cloudshell=true), it has the software this codelab uses pre-installed so that you can skip most of the environment configuration steps below.

It may be helpful to store your project ID into a variable as many commands below use it:

```shell
export PROJECT_ID="your-project-id"
```

Next, [enable billing](https://console.cloud.google.com/billing) in the Cloud Console in order to use Google Cloud resources and [enable the Container Engine API](https://console.cloud.google.com/project/_/kubernetes/list).

New users of Google Cloud Platform receive a [$300 free trial](https://console.cloud.google.com/billing/freetrial?hl=en). Running through this codelab shouldn’t cost you more than a few dollars of that trial. Google Container Engine pricing is documented [here](https://cloud.google.com/container-engine/pricing).

Next, make sure you [download Node.js](https://nodejs.org/en/download/). You can skip this and the steps for installing Docker and Cloud SDK if you're using Cloud Shell.

Then install [Docker](https://docs.docker.com/engine/installation/), and [Google Cloud SDK](https://cloud.google.com/sdk/).

Finally, after Google Cloud SDK installs, run the following command to install [`kubectl`](http://kubernetes.io/docs/user-guide/kubectl-overview/):

```shell
gcloud components install kubectl
```

You're all set up with an environment that can build container images, run Node apps, run Kubernetes clusters locally, and deploy Kubernetes clusters to Google Container Engine. Let's begin!

## Create your Node.js application

The first step is to write the application. Save this code in a folder called "`hellonode/`" with the filename `server.js`:

#### server.js

```javascript
const http = require('http');
const handleRequest = (request, response) => {
  console.log('Received request for URL: ' + request.url);
  response.writeHead(200);
  response.end('Hello World!');
};
const www = http.createServer(handleRequest);
www.listen(8080);
```

Now run this simple command:

```shell
node server.js
```

You should be able to see your "Hello World!" message at http://localhost:8080/. If using Cloud Shell, use [Web Preview](https://cloud.google.com/shell/docs/using-web-preview) to view the URL.

Stop the running node server by pressing Ctrl-C.

Now let’s package this application in a Docker container.

## Create a Docker container image

Next, create a file, also within `hellonode/` named `Dockerfile`. A Dockerfile describes the image that you want to build. Docker container images can extend from other existing images so for this image, we'll extend from an existing Node image.

#### Dockerfile

```conf
FROM node:4.5
EXPOSE 8080
COPY server.js .
CMD node server.js
```

This "recipe" for the Docker image will start from the official Node.js LTS image found on the Docker registry, expose port 8080, copy our `server.js` file to the image and start the Node server.

Now build an image of your container by running `docker build`, tagging the image with the Google  Container Registry repo for your `$PROJECT_ID`:

```shell
docker build -t gcr.io/$PROJECT_ID/hello-node:v1 .
```
Now there is a trusted source for getting an image of your containerized app.

Let's try your image out with Docker:

```shell
docker run -d -p 8080:8080 --name hello_tutorial gcr.io/$PROJECT_ID/hello-node:v1
```

Visit your app in the browser, or use `curl` or `wget` if you’d like :

```shell
curl http://localhost:8080
```

You should see `Hello World!`

**Note:** *If you recieve a `Connection refused` message from Docker for Mac, ensure you are using the latest version of Docker (1.12 or later). Alternatively, if you are using Docker Toolbox on OSX, make sure you are using the VM's IP and not localhost:*

```shell
curl "http://$(docker-machine ip YOUR-VM-MACHINE-NAME):8080"
```

Let’s now stop the container. You can list the docker containers with:

```shell
docker ps
```

You should something like see:

```shell
CONTAINER ID        IMAGE                                 COMMAND                  NAMES
c5b6d4b9f36d        gcr.io/$PROJECT_ID/hello-node:v1      "/bin/sh -c 'node ser"   hello_tutorial
```

Now stop the running container with

```
docker stop hello_tutorial
```

Now that the image works as intended and is all tagged with your `$PROJECT_ID`, we can push it to the [Google Container Registry](https://cloud.google.com/tools/container-registry/), a private repository for your Docker images accessible from every Google Cloud project (but also from outside Google Cloud Platform) :

```shell
gcloud docker push gcr.io/$PROJECT_ID/hello-node:v1
```

If all goes well, you should be able to see the container image listed in the console: *Compute > Container Engine > Container Registry*. We now have a project-wide Docker image available which Kubernetes can access and orchestrate.

![image](/images/hellonode/image_10.png)

## Create your Kubernetes Cluster

A cluster consists of a Master API server and a set of worker VMs called Nodes.

First, choose a [Google Cloud Project zone](https://cloud.google.com/compute/docs/regions-zones/regions-zones) to run
your service. For this tutorial, we will be using **us-central1-a**. This is
configured on the command line via:

```
gcloud config set compute/zone us-central1-a
```

Now, create a cluster via the `gcloud` command line tool:

```shell
gcloud container clusters create hello-world
```

Alternatively, you can create a cluster via the [Google Cloud Console](https://console.cloud.google.com): *Compute > Container Engine > Container Clusters > New container cluster*.  Set the name to **hello-world**, leaving all other options default.

You should get a Kubernetes cluster with three nodes, ready to receive your container image! (this may take a couple of minutes)

![image](/images/hellonode/image_11.png)

It’s now time to deploy your own containerized application to the Kubernetes cluster!

```shell
gcloud container clusters get-credentials hello-world
```

**The rest of this document requires both the Kubernetes client and server version to be 1.3. Run `kubectl version` to see your current versions.**  For 1.2 see [this document](https://github.com/kubernetes/kubernetes.github.io/blob/release-1.2/docs/hellonode.md).

## Create your pod

A Kubernetes **[pod](/docs/user-guide/pods/)** is a group of containers, tied together for the purposes of administration and networking. It can contain a single container or multiple.

Create a Pod with the `kubectl run` command:

```shell
kubectl run hello-node --image=gcr.io/$PROJECT_ID/hello-node:v1 --port=8080
```

As shown in the output, the `kubectl run` created a **[Deployment](/docs/user-guide/deployments/)** object.  Deployments are the recommended way for managing creation and scaling of pods.  In this example, a new deployment manages a single pod replica running the *hello-node:v1* image.

To view the Deployment we just created run:

```shell
kubectl get deployments

NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
hello-node   1         1         1            1           3m
```

To view the Pod created by the deployment run:

```shell
kubectl get pods

NAME                         READY     STATUS    RESTARTS   AGE
hello-node-714049816-ztzrb   1/1       Running   0          6m
```

To view the stdout / stderr from a Pod run (probably empty currently):

```shell
kubectl logs <POD-NAME>
```

To view metadata about the cluster run:

```shell
kubectl cluster-info
```

To view cluster events run:

```shell
kubectl get events
```

To view the kubectl configuration run:

```shell
kubectl config view
```

Full documentation for kubectl commands is available **[here](/docs/user-guide/kubectl-overview/)**:

At this point you should have our container running under the control of Kubernetes but we still have to make it accessible to the outside world.

## Allow external traffic

By default, the pod is only accessible by its internal IP within the Kubernetes cluster. In order to make the `hello-node` container accessible from outside the Kubernetes virtual network, you have to expose the Pod as a Kubernetes **[Service](/docs/user-guide/services/)**.

From our Development machine we can expose the pod to the public internet using the `kubectl expose` command combined with the `--type="LoadBalancer"` flag.  The flag is needed for the creation of an externally accessible ip:

```shell
kubectl expose deployment hello-node --type="LoadBalancer"
```

**If this fails, make sure your client and server are both version 1.3.  See the [Create your cluster](#create-your-cluster) section for details.**

The flag used in this command specifies that we’ll be using the load-balancer provided by the underlying infrastructure (in this case the [Compute Engine load balancer](https://cloud.google.com/compute/docs/load-balancing/)). Note that we expose the deployment, and not the pod directly.  This will cause the resulting service to load balance traffic across all pods managed by the deployment (in this case only 1 pod, but we will add more replicas later).

The Kubernetes master creates the load balancer and related Compute Engine forwarding rules, target pools, and firewall rules to make the service fully accessible from outside of Google Cloud Platform.

To find the ip addresses associated with the service run:

```shell
kubectl get services hello-node

NAME         CLUSTER_IP    EXTERNAL_IP     PORT(S)    AGE
hello-node   10.3.246.12                   8080/TCP   23s
```

The `EXTERNAL_IP` may take several minutes to become available and visible.  If the `EXTERNAL_IP` is missing, wait a few minutes and try again.

```shell
kubectl get services hello-node

NAME         CLUSTER_IP    EXTERNAL_IP     PORT(S)    AGE
hello-node   10.3.246.12   23.251.159.72   8080/TCP   2m
```

Note there are 2 IP addresses listed, both serving port 8080.  `CLUSTER_IP` is only visible inside your cloud virtual network.  `EXTERNAL_IP` is externally accessible.  In this example, the external IP address is 23.251.159.72.

You should now be able to reach the service by pointing your browser to this address: http://EXTERNAL_IP**:8080** or running `curl http://EXTERNAL_IP:8080`.

![image](/images/hellonode/image_12.png)

Assuming you've sent requests to your new webservice via the browser or curl,
you should now be able to see some logs by running:

```shell
kubectl logs <POD-NAME>
```

## Scale up your website

One of the powerful features offered by Kubernetes is how easy it is to scale your application. Suppose you suddenly need more capacity for your application; you can simply tell the deployment to manage a new number of replicas for your pod:

```shell
kubectl scale deployment hello-node --replicas=4
```

You now have four replicas of your application, each running independently on the cluster with the load balancer you created earlier and serving traffic to all of them.

```shell
kubectl get deployment

NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
hello-node   4         4         4            3           40m
```

```shell
kubectl get pods

NAME                         READY     STATUS    RESTARTS   AGE
hello-node-714049816-g4azy   1/1       Running   0          1m
hello-node-714049816-rk0u6   1/1       Running   0          1m
hello-node-714049816-sh812   1/1       Running   0          1m
hello-node-714049816-ztzrb   1/1       Running   0          41m
```

Note the **declarative approach** here - rather than starting or stopping new instances you declare how many instances you want to be running. Kubernetes reconciliation loops simply make sure the reality matches what you requested and take action if needed.

Here’s a diagram summarizing the state of our Kubernetes cluster:

![image](/images/hellonode/image_13.png)

## Roll out an upgrade to your website

As always, the application you deployed to production requires bug fixes or additional features. Kubernetes is here to help you deploy a new version to production without impacting your users.

First, let’s modify the application. On the development machine, edit server.js and update the response message:

```javascript
  response.end('Hello Kubernetes World!');
```

We can now build and publish a new container image to the registry with an incremented tag:

```shell
docker build -t gcr.io/$PROJECT_ID/hello-node:v2 .
gcloud docker push gcr.io/$PROJECT_ID/hello-node:v2
```

Building and pushing this updated image should be much quicker as we take full advantage of the Docker cache.

We’re now ready for Kubernetes to smoothly update our deployment to the new version of the application.  In order to change
the image label for our running container, we will need to edit the existing *hello-node deployment* and change the image from
`gcr.io/$PROJECT_ID/hello-node:v1` to `gcr.io/$PROJECT_ID/hello-node:v2`.  To do this, we will use the `kubectl set image` command.

```shell
kubectl set image deployment/hello-node hello-node=gcr.io/$PROJECT_ID/hello-node:v2
```

This updates the deployment with the new image, causing new pods to be created with the new image and old pods to be deleted.

```
kubectl get deployments

NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
hello-node   4         5         4            3           1h
```

While this is happening, the users of the services should not see any interruption. After a little while they will start accessing the new version of your application. You can find more details in the [deployment documentation](/docs/user-guide/deployments/).

Hopefully with these deployment, scaling and update features you’ll agree that once you’ve setup your environment (your GKE/Kubernetes cluster here), Kubernetes is here to help you focus on the application rather than the infrastructure.

## Observe the Kubernetes Web UI (optional)

Kubernetes comes with a graphical web user interface that is enabled by default with your clusters.

This user interface allows you to get started quickly and enables some of the functionality found in the CLI as a more approachable and discoverable way of interacting with the system.

Enjoy the Kubernetes graphical dashboard and use it for deploying containerized applications, as well as for monitoring and managing your clusters!

![image](/images/docs/ui-dashboard-workloadview.png)

Learn more about the web interface by taking the [Dashboard tour](/docs/user-guide/ui/).

## Cleaning it Up

That's it for the demo! So you don't leave this all running and incur charges, let's learn how to tear things down.

Delete the Deployment (which also deletes the running pods) and Service (which also deletes your external load balancer):

```shell
kubectl delete service,deployment hello-node
```

Delete your cluster:

```shell
gcloud container clusters delete hello-world
```

You should see:

```
The following clusters will be deleted.
 - [hello-world] in [us-central1-a]

Do you want to continue (Y/n)?

Deleting cluster hello-world...done.
Deleted [https://container.googleapis.com/v1/projects/<$PROJECT_ID>/zones/us-central1-a/clusters/hello-world].
```

This deletes the Google Compute Engine instances that are running the cluster.

Finally delete the Docker registry storage bucket hosting your image(s) by using
`gsutil`, which should have been installed during the gcloud installation
process. For more information on gsutil, see [the gsutil documentation](https://cloud.google.com/storage/docs/gsutil)

To list the images we created earlier in the tutorial:

```shell
gsutil ls
```

You should see:

```shell
gs://artifacts.<$PROJECT_ID>.appspot.com/
```

And then to remove the all the images under this path, run:

```shell
gsutil rm -r gs://artifacts.$PROJECT_ID.appspot.com/
```

You can also delete the entire Google Cloud project but note that you must first disable billing on the project. Additionally, deleting a project will only happen after the current billing cycle ends.
