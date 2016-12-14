---
---

{% capture overview %}

The goal of this codelab is for you to turn a simple Hello World node.js app 
into a replicated application running on Kubernetes. We will show you how to 
take code that you have developed on your machine, turn it into a Docker
container image, and then run that image on [Minikube](/docs/getting-started-guides/minikube).

Kubernetes is an open source project which can run on many different environments, 
from laptops to high-availability multi-node clusters, from public clouds to 
on-premise deployments, from virtual machines to bare metal. Minikube provides
a simple way of running Kubernetes on your local workstation for free.

{% endcapture %}

{% capture objectives %}

* Run a hello world Node application
* Deploy the application to Minikube
* View application logs
* Update the application image

{% endcapture %}

{% capture prerequisites %}

* Install Docker. On OS X, we recommend 
[Docker for Mac](https://docs.docker.com/engine/installation/mac/).


{% endcapture %}

{% capture lessoncontent %}

## Create a Minikube cluster

This tutorial uses [Minikube](https://github.com/kubernetes/minikube) to 
create a local cluster. This tutorial also assumes you are using [Docker for Mac](https://docs.docker.com/engine/installation/mac/)
on OS X. If you are on a different platform like Linux, or using VirtualBox
instead of Docker for Mac, the instructions to install Minikube may be
slightly different. For general Minikube installation instructions, see
the [Minikube installation guide](https://github.com/kubernetes/minikube/releases).

### Download and install the Minikube release

Use `curl` to download and install the latest Minikube release:

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-darwin-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/
```

Download the latest version of the `kubectl` command-line tool, which you can
use to interact with Kubernetes clusters.

```shell
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl
```

Start the Minikube cluster:

```shell
minikube start --vm-driver=xhyve
```

The `--vm-driver=xyhve` flag specifies that we are using Docker for Mac. The
default VM driver is VirtualBox. Now set the Minikube context:

```shell
kubectl config use-context minikube
```

Now you should be able to run:

```shell
kubectl cluster-info
```

to verify the cluster is running and view its metadata.

## Create your Node.js application

The next step is to write the application. Save this code in a folder called "`hellonode/`" with the filename `server.js`:

#### server.js

{% include code.html language="js" file="server.js" ghlink="/docs/tutorials/hello-minikube/server.js" %}

Now run this simple command:

```shell
node server.js
```

You should be able to see your "Hello World!" message at http://localhost:8080/. 

Stop the running node server by pressing Ctrl-C.

Now let’s package this application in a Docker container.

## Create a Docker container image

Next, create a file, also within `hellonode/` named `Dockerfile`. A Dockerfile describes the image that you want to build. Docker container images can extend from other existing images so for this image, we'll extend from an existing Node image.

#### Dockerfile

{% include code.html language="conf" file="Dockerfile" ghlink="/docs/tutorials/hello-minikube/Dockerfile" %}

This "recipe" for the Docker image will start from the official Node.js LTS image found on the Docker registry, 
expose port 8080, copy our `server.js` file to the image and start the Node server.

Since this tutorial uses Minikube, instead of pushing Docker images to a
registry, you can simply build the image using the same Docker host as
the Minikube VM, so that the images are automatically present. To do so, make
sure you are using the Minikube docker daemon

```shell
eval $(minikube docker-env)
```

If you no longer with to use the Minikube host, you can undo this change by
running the same command with the `-u` flag.

Now build an image of your container by running `docker build`, tagging the 
image your DockerHub username. Make sure you build the image using the 
Minikube daemon.

```shell
docker build -t hello-node:v1 .
```

Now the Minikube VM can run the image you built.

## Create your pod

A Kubernetes **[pod](/docs/user-guide/pods/)** is a group of containers, tied 
together for the purposes of administration and networking. It can contain a 
single container or multiple.

Create a Pod with the `kubectl run` command:

```shell
kubectl run hello-node --image=hello-node:v1 --port=8080
```

As shown in the output, the `kubectl run` created a **[Deployment](/docs/user-guide/deployments/)** object.  
Deployments are the recommended way for managing creation and scaling of pods.  
In this example, a new deployment manages a single pod replica 
running the *hello-node:v1* image.

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

To view cluster events run:

```shell
kubectl get events
```

To view the kubectl configuration run:

```shell
kubectl config view
```

Full documentation for kubectl commands is available **[here](/docs/user-guide/kubectl-overview/)**:

## View your service

By default, the pod is only accessible by its internal IP within the Kubernetes cluster. 
In order to make the `hello-node` container accessible from outside the 
Kubernetes virtual network, you have to expose the Pod as a 
Kubernetes **[Service](/docs/user-guide/services/)**.

From our Development machine we can expose the pod to the public internet 
using the `kubectl expose` command.  

```shell
kubectl expose deployment hello-node --type=LoadBalancer         
```

To view the service you just created, run:

```shell
kubectl get services

NAME         CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
hello-node   10.0.0.71    <pending>     8080/TCP   6m
kubernetes   10.0.0.1     <none>        443/TCP    14d
```

The `--type=LoadBalancer` flag indicates that we want to expose our service 
outside of the cluster. On a cloud providers that support Load Balancers, 
an external IP would be provisioned to access the service. On Minikube, 
the LoadBalancer type makes the Service accessible using the `minikube service`
command. 

```shell
minikube service hello-node
```

This will automatically open up your browser window with a local IP that 
will serve your app and show the "Hello World" message.

Assuming you've sent requests to your new webservice via the browser or curl,
you should now be able to see some logs by running:

```shell
kubectl logs <POD-NAME>
```

## Update Your App

Edit your `server.js` file to return a new message:

```javascript
response.end('Hello World Again!');

```

Build a new version of your image:

```shell
docker build -t hello-node:v2 .
```

Update the image of your Deployment:

```shell
kubectl set image deployment/hello-node hello-node=hello-node:v2
```

Now you can again run:

```shell
minikube service hello-node
```

to view the new message in your web browser.


## Clean Up

Now, you can clean up the resources you created in your cluster.

```shell
kubectl delete service hello-node
kubectl delete deployment hell-node
```

Optionally, stop Minikube.

```shell
minikube stop
```


{% endcapture %}


{% capture whatsnext %}

* Learn more about [Deployment objects](/docs/user-guide/deployments/).
* Learn more about [Deploying applications](http://localhost:4000/docs/user-guide/deploying-applications/)
* Learn more about [Service objects](/docs/user-guide/services/).


{% endcapture %}

{% include templates/tutorial.md %}
