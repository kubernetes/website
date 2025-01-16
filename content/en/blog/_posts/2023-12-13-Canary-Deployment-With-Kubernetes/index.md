---
layout: blog
title: "A Comprehensive Guide to Canary Deployment with Kubernetes"
date: 2024-09-14
slug: canary-deployment-with-kubernetes
evergreen: true
author: >
  Mohammed Affan (AccuKnox)
---

Welcome to a comprehensive guide to canary deployment with Kubernetes.
In modern software development getting quick feedback form the users
is crucial for delivering a high-quality product and implementing agile
delivery. Developers try to get feedback from the users without ruining the
user experience. That's why canary deployment come into the picture.

## Prerequisites

- You need to have a Kubernetes cluster (Minikube would also work).
- You also need to have `kubectl` installed on the local machine - see [install tools](/docs/tasks/tools/#kubectl).
- You need `bash` to be installed on your device to run the shell commands
  specified in this guide.

## What is a canary deployment?

Suppose you have a web application and you want to implement a new feature, but
you're not sure if users will like it. Testing and gathering user feedback on the entire
user base can be risky. A canary deployment mitigates this risk by testing the new
feature with a limited number of users.

So, you have two versions of an app, App v1 and App v2. Currently, only App v1
is in production. To gather user feedback without disrupting the experience for
everyone, you decide to send 90% of your traffic to App v1 and, 10% to App v2. This
weighted deployment method is known as a canary deployment.

{{< figure src="canary-deployment.png" alt="Illustration of canary deployment where 90% of the traffic is going towards the app v1 and the 10% of the traffic going towards the app v2" >}}

## Creat Docker images and push it to Docker Hub

Before getting started with the deployment you need to create two Docker images. One for
the stable version of app another one for the canary version of app.

First create an `index.html` file. And add the following line inside the file:

```
Hello from app-v1
```

Now create a `Dockerfile` in same directory with the following content:

```dockerfile
FROM httpd:latest

COPY index.html /usr/local/apache2/htdocs/
```

Now you need to create a container image using these files and push it to Docker Hub
(or you can also use any other container registry). For pushing an image to Docker Hub
you would have to login using `docker login` command. Enter the username
and password of your Docker Hub account (you can also use a personal access token
instead of password).

Once you are logged in, build and push your image to Docker Hub via this command
(replace your Docker Hub username in this command):

```bash
docker build . -t <your Docker Hub username>/canary-app:v1
docker push <your Docker Hub username>/canary-app:v1
```

Now modify text inside the `index.html` file using this command:

```bash
echo "Hello from app-v2" > index.html
```
Create Docker image for canary version of app, using a `v2` tag by running
this command:

```bash
docker build . -t <your Docker Hub username>/canary-app:v2
```

Push the canary version container image to the Docker Hub using this command:

```bash
docker push <your Docker Hub username>/canary-app:v2
```

## Deploy the app

To deploy the app, create a `deployment.yaml` manifest file with the following
configuration, and replace your Docker Hub username in the `image` field.

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: canary-app-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: canary-app
      version: v1
  template:
    metadata:
      labels:
        app: canary-app
        version: v1
    spec:
      containers:
        - name: canary-app
          image: <your Docker Hub username>/canary-app:v1
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: canary-app-deployment-v2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: canary-app
      version: v2
  template:
    metadata:
      labels:
        app: canary-app
        version: v2
    spec:
      containers:
        - name: canary-app
          image: <your Docker Hub username>/canary-app:v2
---
apiVersion: v1
kind: Service
metadata:
  name: canary-app-service
spec:
  type: LoadBalancer
  selector:
    app: canary-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```

This Kubernetes manifest deploys two different apps, `canary-app:v1`, `canary-app:v2`
and a single service for both of the apps. The service is exposed via a `LoadBalancer`.

To access the application running inside the pod you need to get the IP of the
load balancer. To get the IP of load balancer simply run `kubectl get services`
you will see the `canary-app-service` of type `LoadBalancer`. This IP will be used
in the next command. And if you are using Minikube and see the IP of load balancer
is in pending state, just run the `minikube tunnel` command in the background.
And then run `kubectl get services`.

{{< figure src="load-balancer-ip.png" alt="A screenshot of a terminal window showing external IP of load balancer service." >}}

Now run this command to make requests to the load-balancer
(replace the ip of the load-balancer in the command):

```bash
for i in {1..10}; do curl <ip of load-balancer service>; done
```

After running this command you will get a similar output like the following.

{{< figure src="curl-to-load-balancer.png" alt="A screenshot of terminal window showing output of making CURL request to the load balancer. The output contains `Hello from app-v1` 4 times and `Hello from app-v2` 6 times">}}

Kubernetes networking tries to equally distribute the traffic across the pods. At first
it may seem like the traffic is not getting distributed equally. But over a larger
number of requests traffic gets distributed equally. If you increase the values of
the `replicas` to the `9` for the `canary-app:v1`. 90% of the traffic will go towards the
`canary-app:v1` and the remaining 10% traffic will go towards the `canary-app:v2`.

Here is the output after changing the value:

{{< figure src="9-1-traffic-split.png" alt="A screenshot of a terminal window showing output of making CURL request to the load balancer. The output contains `Hello from app-v1` 9 times and `Hello from app-v2` a single time" >}}

You can see that 90% of traffic is flowing towards the app-v1 and
10% traffic is going towards the app-v2 and that's a canary deployment.

Now consider the case where you want to send just 1% of the traffic to the canary
version of the app. You would need to create 99 pod replicas for the stable version
of app and a single pod for the canary version of the app. To solve this problem
we can use Istio.

Before moving forward with Istio, change the value of `replicas` back to `1`
for the `canary-app:v1`. Change the service type from `LoadBalancer` to
`ClusterIP`, as you will be exposing the service using Istio instead of using a
load-balancer.

## What is Istio?

[Istio](https://www.cncf.io/projects/istio/) is an open source service mesh platform
that helps you connect, monitor and secure the communication between your microservices.
Istio helps you to mange your network inside the Kubernetes cluster. It adds a layer of
control and visibility to your microservices architecture, making it easier to manage
the complexity that comes with the distributed systems.

## Install Istio

For installing Istio refer to the [Istio getting started](https://istio.io/latest/docs/setup/getting-started/)
documentation.

Once you have installed the `istioctl`, run the `istioctl install`. It will install
Istio into the cluster with the default profile and create an Istio ingress gateway
as well.

## Deploy Istio gateway

To make Istio service mesh accessible from outside the cluster, you need to define
an Istio gateway. Create a manifest file named `istio-gateway.yaml` with the following
content:

```yaml
# istio-gateway.yaml
apiVersion: networking.istio.io/v1
kind: Gateway
metadata:
  name: canary-app-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*"
```

## Creating a virtual service and destination rule

An Istio virtual service is used to implement the traffic routing inside a Kubernetes
cluster. The Istio virtual service defines a set of rules for how network traffic
should be routed to different destination services. It allows you to control the
traffic routing, apply timeouts, retries and utilize some other features. Think of it
as a way to define the rules for how requests to a particular service should be handled
within the Istio service mesh.

You can use the virtual service to route a percentage of traffic to the new version of an
app, for doing a canary deployment. Create a `virtual-service.yaml` file and add the
following content to it.

```yaml
# virtual-service.yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: canary-app-virtual-service
spec:
  hosts:
    - "*"
  gateways:
    - canary-app-gateway
  http:
    - route:
        - destination:
            host: canary-app-service.default.svc.cluster.local
            subset: v1
          weight: 90
        - destination:
            host: canary-app-service.default.svc.cluster.local
            subset: v2
          weight: 10
```

Here you can see that the `canary-gateway` is specified in the virtual service. Specifying
the gateway makes the service accessible from outside the cluster. The
`route.destination.host` field contains the internal domain name of the service.
Here is a breakdown of it:

- `canary-app-service`: This is the name of the service of the app.
- `default`: This is the namespace in which the service resides. In this case, 
  it's the default namespace.
- `svc`: It stands for "service" and is a standard suffix for Kubernetes services.
- `cluster.local`: This is the default cluster domain in Kubernetes.

Both virtual service and Istio gateway manifests have a `hosts` field with a wildcard
symbol in it. In the production environment it should a fully qualified domain name like
`www.example.com`.

The `weight` field defines the routing weight of the requests. The `subset` field allows
you to specify a destination for the requests using pod labels, specified via a
`DestinationRule` resource. Create a `destination-rule.yaml` file and add the
following lines to it:

```yaml
# destination-rule.yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: canary-app
spec:
  host: canary-app-service
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
```

Now apply these manifests, using the following command: 

```shell
kubectl apply -f istio-gateway.yaml -f virtual-service.yaml -f destination-rule.yaml
```

After applying these manifests, use the following command to get the external IP address of the
Istio ingress gateway load balancer. (If you are using Minikube you also need to execute
`minikube tunnel` and let it run in the background)

```shell
kubectl get svc -n istio-system
```

Run this command and replace the ip of your load-balancer service.

```bash
for i in {1..10}; do curl <ip load-balancer service>; done
```

And you will see an output like this. Where 90% of the requests are going to the app-v1,
and only 10% of the requests are going towards the app-v2.

{{< figure src="9-1-traffic-split-istio.png" alt="A screenshot of a terminal window showing output of making CURL request to the load balancer. The output contains `Hello from app-v1` 9 times and `Hello from app-v2` a single time" >}}

Instead of doing curl request you can also open up a browser and paste the ip of
load-balancer, refresh it multiple times to see how traffic is splitting.