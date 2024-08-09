---
layout: blog
title: "A Comprehensive Guide to Canary Deployment with Kubernetes"
date: 2023-12-13
slug: canary-deployment-with-kubernetes
evergreen: true
---

author: >
  Mohammed Affan

Welcome to a comprehensive guide to canary deployment with Kubernetes.
In modern software development getting quick feedback form the users
is crucial for delivering a high-quality product and implementing agile
delivery. Developers try to get feedback from the users without ruining the
user experience. That's where canary deployment comes into the picture.

## Prerequisites

- You need to have a Kubernetes cluster (minikube would also work).
- You also need to have `kubectl` installed on the local machine - see [install tools](/docs/tasks/tools/#kubectl).

## What is a canary deployment?

Suppose you have a web application and you want to implement a new feature.
But you are not sure if your users are going to like this feature or n ot.
This makes testing and getting user feedback risky. A solution to mitigate
this risk is to test the new feature with a limited number of users.

Here is an example showing canary deployment. Assume that you have two versions of an app. Named App v1
and App v2 respectively. Currently, only the App v1 is deployed to the production. To fully deploy the
App v2 to the production first you need to gather some user feedback. To gather the user
feedback without ruining user experience you decided to send 90% of your traffic
to the App v1 and 10% of the traffic to the App v2. This type of weighted deployment
method is known as the canary deployment.

{{< figure src="canary-deployment.png" alt="Illustration of canary deployment where 90% of the traffic is going towards the app v1 and the 10% of the traffic going towards the app v2" >}}

## Deploying the app

Let's deploy the stable and canary versions of the app. The
[canary-app](https://hub.docker.com/repository/docker/affan7/canary-app/general)
repository contains two docker images. One is canary-app:v1, which is the
stable version of the app. The other image is canary-app:v2, which is the
canary version of the app.

To deploy the app, create a `deployment.yaml` manifest file with the following
configuration.

```yaml
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
          image: affan7/canary-app:v1
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
          image: affan7/canary-app:v2
---
apiVersion: v1
kind: Service
metadata:
  name: canary-app-service
spec:
  type: NodePort
  selector:
    app: canary-app
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 80
```

This Kubernetes manifest deploys two different apps, `canary-app:v1`, `canary-app:v2`
and a single service for both of the apps. The service is exposed via a `NodePort`.

Use the following command to access the service.

```bash
for i in {1..10}; do curl <url of the nodeport service>; done
```

Note: If you are using the minikube, you can get the url of your `NodePort`
service by running the `minikube service canary-app-service --url` command.

After running this command you will get a similar output like the following.

{{< figure src="equally-distributed-traffic.png" alt="A screenshot of a terminal window with a code snippet and output text. The code snippet is written in Bash and the code is looping through a range of numbers and making a cURL request to the server. The output text shows the equal number of server responses from two different servers. The response contains the strings 'Hello from app-v1' 5 times and the 'Hello from app-v2' 5 times." >}}

Kubernetes networking tries to equally distribute the traffic across the pods, and
you can see that the traffic is almost equally distributed across the pods.
This equal distribution of the requests becomes more accurate over a larger
number of requests. So if you increase the values of the `replicas` to the `9`
for the canary-app:v1. 90% of the traffic will go towards the
`canary-app:v1` and the remaining 10% traffic will go towards the
`canary-app:v2`.

Here is the output after changing the value:

{{< figure src="splitted-traffic.png" alt="A screenshot of a terminal window with a code snippet and output text. The code snippet is written in Bash and the code is looping through a range of numbers and making a cURL request to the server. The output shows the traffic split between the servers in a 9:1 ratio. The response contains the strings 'Hello from app-v1' 9 times and the 'Hello from app-v2' a single time." >}}

You can see that 90% of traffic is flowing towards the app-v1 and
10% traffic is going towards the app-v2 and that's a canary deployment.

Now consider the case where you want to send just 1% of the traffic to the canary
version of the app. You would need to create 99 pod replicas for the stable version
of your app and a single pod for the canary version of the app. That doesn't
seem efficient. That's why Istio comes into the picture. Istio is a more
sophisticated solution to address these types of issues.

Before moving forward with Istio, change the value of `replicas` back to `1`
for the canary-app:v1. Change the service type from `NodePort` to
`ClusterIP`, as you will be exposing the service using Istio instead of using the
node port. Also change the service port value to `80` from `3000` for
convenience.

## What is Istio?

[Istio](https://www.cncf.io/projects/istio/) is an open source service mesh platform that helps you connect, monitor
and secure the communication between your microservices. It ensures
that a microservice has the access to communicate with other microservices.
It adds a layer of control and visibility to your microservices architecture,
making it easier to manage the complexity that comes with the distributed
systems.

## Installing Istio

Once you have an active Kubernetes cluster and `kubectl` is configured to
communicate with the cluster. You can proceed to install Istio. For installing Istio
refer to the [Istio getting started](https://istio.io/latest/docs/setup/getting-started/)
documentation.

## Deploying Istio gateway

To make Istio service mesh accessible from outside the cluster, you need to define
an Istio gateway. Create a manifest file named `istio.yaml` with the following content:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: canary-gateway
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

In the hosts field a wildcard `*` symbol is specified. This allows the service
to be accessible from any domain name or IP address. In production environment this
should be a fully qualified domain name such as `www.example.com`.

## Creating a virtual service and destination rule

An Istio virtual service is used to implement the traffic routing inside a Kubernetes
cluster. The Istio virtual service defines a set of rules for how network traffic
should be routed to different destination services. It allows you to control the
traffic routing, apply timeouts, retries and utilize some other features. Think of it
as a way to define the rules for how requests to a particular service should be handled
within the Istio service mesh.

You can use the virtual service to route a percentage of traffic to the new version of an
app for testing purposes, apply different routing rules based on request headers,
or define fault injection policies.

Add the following lines to your istio.yaml file.

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: canary-app-virtual-service
spec:
  hosts:
    - "*"
  gateways:
    - canary-gateway
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
the gateway makes the service accessible from outside the cluster. Here is a breakdown of
the `route.destination.host` field.

- `canary-app-service`: This is the name of the service of the app.
- `default`: This is the namespace in which the service resides. In this case, it's the default namespace.
- `svc`: It stands for "service" and is a standard suffix for Kubernetes services.
- `cluster.local`: This is the default cluster domain in Kubernetes.

The `weight` field defines the routing weight of the requests. The `subset` field allows
you to specify a destination for requests specified via a `DestinationRule` resource.
Create and add a `DestinationRule` resource into the istio.yaml file.

```yaml
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

The `DestinationRule` resource defines `subsets`. The `subsets` allow you to
define a group of pods as a destination for the incoming requests using pod labels.

Now apply the `istio.yaml` manifests, using the following commands: #TODO: add commands for all of the manifests here 

```shell
kubectl apply -f istio.yaml
```

After applying `istio.yaml`, use the following command to get the external IP address of the
Istio ingress gateway load balancer.

```shell
kubectl get svc -n istio-system
```

Note: If you are using the minikube, and the external IP of the load balancer is in the
pending state use the `minikube tunnel` command. Running this command will provide an
external IP for your load balancer. And if you are using the `kind` to create the
Kubernetes cluster, you would need to install the [MetalLB](https://metallb.universe.tf/installation/).

Copy the external IP of the load balancer and paste that into your browser, specifying
port `80`. You will see the output of the app. And if you refresh the page several
times you'll see that the traffic is distributed in a 9:1 ratio. You can
also change the value of the `weight` in the virtual service as per your need.
