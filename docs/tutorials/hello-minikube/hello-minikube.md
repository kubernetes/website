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

* Run a hello world Node application in Docker
* Deploy the application to Minikube. 

{% endcapture %}

{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

Since this tutorial uses Minikube, instead of pushing Docker images to a
registry, you can simply build the image using the same Docker daemon as
Minikube, so that the images are automatically present. To do so, make
sure you are using the Minikube docker daemon

```shell
minikube start
eval $(minikube docker-env)
```

{% endcapture %}

{% capture lessoncontent %}

## Create your Node.js application

The first step is to write the application. Save this code in a folder called "`hellonode/`" with the filename `server.js`:

#### server.js

```javascript
var http = require('http');
var handleRequest = function(request, response) {
  console.log('Received request for URL: ' + request.url);
  response.writeHead(200);
  response.end('Hello World!');
};
var www = http.createServer(handleRequest);
www.listen(8080);
```

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

```conf
FROM node:6.9.2
EXPOSE 8080
COPY server.js .
CMD node server.js
```

This "recipe" for the Docker image will start from the official Node.js LTS image found on the Docker registry, 
expose port 8080, copy our `server.js` file to the image and start the Node server.

Now build an image of your container by running `docker build`, tagging the 
image your DockerHub username. Make sure you build the image using the 
Minikube daemon.

```shell
eval $(minikube docker-env)
docker build -t $DOCKERHUB_USER/hello-node:v1 .
```
Now there is a trusted source for getting an image of your containerized app.

Let's try your image out with Docker:

```shell
docker run -d -p 8080:8080 --name hello_tutorial $DOCKERHUB_USER/hello-node:v1
```

Visit your app in the browser, or use `curl` or `wget` if you’d like :

```shell
curl http://localhost:8080
```

You should see `Hello World!`

**Note:** *If you receive a `Connection refused` message from Docker for Mac, ensure you are using the latest version of Docker (1.12 or later). Alternatively, if you are using Docker Toolbox on OSX, make sure you are using the VM's IP and not localhost:*

```shell
curl "http://$(docker-machine ip YOUR-VM-MACHINE-NAME):8080"
```

Let’s now stop the container. You can list the docker containers with:

```shell
docker ps
```

You should see something like this:

```shell
CONTAINER ID        IMAGE                                 COMMAND                  NAMES
c5b6d4b9f36d        $DOCKERHUB_USER/hello-node:v1      "/bin/sh -c 'node ser"   hello_tutorial
```

Now stop the running container with

```
docker stop hello_tutorial
```


## Create your pod

A Kubernetes **[pod](/docs/user-guide/pods/)** is a group of containers, tied 
together for the purposes of administration and networking. It can contain a 
single container or multiple.

Create a Pod with the `kubectl run` command:

```shell
kubectl run hello-node --image=$DOCKERHUB_USER/hello-node:v1 --port=8080
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

## View your service

By default, the pod is only accessible by its internal IP within the Kubernetes cluster. In order to make the `hello-node` container accessible from outside the Kubernetes virtual network, you have to expose the Pod as a Kubernetes **[Service](/docs/user-guide/services/)**.

From our Development machine we can expose the pod to the public internet 
using the `kubectl expose` command.  

```shell
kubectl expose deployment hello-node
```

![image](/images/hellonode/image_12.png)

On a cloud provider, we would create a Service of type LoadBalancer and be
given an external IP. However, on Minikube, there are no LoadBalancers or
external IPs supported, and instead our service can be viewed with the
`minikube service` command:

```shell
minikube service hello-node
```

This will automatically open up your browser window with a local IP that 
will serve your app.

Assuming you've sent requests to your new webservice via the browser or curl,
you should now be able to see some logs by running:

```shell
kubectl logs <POD-NAME>
```

{% endcapture %}


{% capture whatsnext %}

* Learn more about [Deployment objects](/docs/user-guide/deployments/).

{% endcapture %}

{% include templates/tutorial.md %}
