---
layout: blog
title: 'Kong Ingress Controller and Service Mesh: Setting up Ingress to Istio on Kubernetes'
date: 2020-03-18
slug: kong-ingress-controller-and-istio-service-mesh
author: >
  Kevin Chen,
  Kong
---

Kubernetes has become the de facto way to orchestrate containers and the services within services. But how do we give services outside our cluster access to what is within? Kubernetes comes with the Ingress API object that manages external access to services within a cluster.

Ingress is a group of rules that will proxy inbound connections to endpoints defined by a backend. However, Kubernetes does not know what to do with Ingress resources without an Ingress controller, which is where an open source controller can come into play. In this post, we are going to use one option for this: the Kong Ingress Controller. The Kong Ingress Controller was open-sourced a year ago and recently reached one million downloads. In the recent 0.7 release, service mesh support was also added. Other features of this release include:

* **Built-In Kubernetes Admission Controller**, which validates Custom Resource Definitions (CRD) as they are created or updated and rejects any invalid configurations. 
* **In-memory Mode** - Each pod’s controller actively configures the Kong container in its pod, which limits the blast radius of failure of a single container of Kong or controller container to that pod only.
* **Native gRPC Routing** - gRPC traffic can now be routed via Kong Ingress Controller natively with support for method-based routing.

![K4K-gRPC](/images/blog/Kong-Ingress-Controller-and-Service-Mesh/KIC-gRPC.png)

If you would like a deeper dive into Kong Ingress Controller 0.7, please check out the [GitHub repository](https://github.com/Kong/kubernetes-ingress-controller).

But let’s get back to the service mesh support since that will be the main focal point of this blog post. Service mesh allows organizations to address microservices challenges related to security, reliability, and observability by abstracting inter-service communication into a mesh layer. But what if our mesh layer sits within Kubernetes and we still need to expose certain services beyond our cluster? Then you need an Ingress controller such as the Kong Ingress Controller. In this blog post, we’ll cover how to deploy Kong Ingress Controller as your Ingress layer to an Istio mesh. Let’s dive right in:

![Kong Kubernetes Ingress Controller](/images/blog/Kong-Ingress-Controller-and-Service-Mesh/k4k8s.png)

### Part 0: Set up Istio on Kubernetes

This blog will assume you have Istio set up on Kubernetes. If you need to catch up to this point, please check out the [Istio documentation](https://istio.io/docs/setup/). It will walk you through setting up Istio on Kubernetes.  

### 1. Install the Bookinfo Application

First, we need to label the namespaces that will host our application and Kong proxy. To label our default namespace where the bookinfo app sits, run this command:

```
$ kubectl label namespace default istio-injection=enabled
namespace/default labeled
```

Then create a new namespace that will be hosting our Kong gateway and the Ingress controller:

```
$ kubectl create namespace kong
namespace/kong created
```

Because Kong will be sitting outside the default namespace, be sure you also label the Kong namespace with istio-injection enabled as well:

```
$ kubectl label namespace kong istio-injection=enabled
namespace/kong labeled
```

Having both namespaces labeled `istio-injection=enabled` is necessary. Or else the default configuration will not inject a sidecar container into the pods of your namespaces.

Now deploy your BookInfo application with the following command:

```
$ kubectl apply -f http://bit.ly/bookinfoapp
service/details created
serviceaccount/bookinfo-details created
deployment.apps/details-v1 created
service/ratings created
serviceaccount/bookinfo-ratings created
deployment.apps/ratings-v1 created
service/reviews created
serviceaccount/bookinfo-reviews created
deployment.apps/reviews-v1 created
deployment.apps/reviews-v2 created
deployment.apps/reviews-v3 created
service/productpage created
serviceaccount/bookinfo-productpage created
deployment.apps/productpage-v1 created
```

Let’s double-check our Services and Pods to make sure that we have it all set up correctly:

```
$ kubectl get services
NAME          TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
details       ClusterIP   10.97.125.254    <none>        9080/TCP   29s
kubernetes    ClusterIP   10.96.0.1        <none>        443/TCP    29h
productpage   ClusterIP   10.97.62.68      <none>        9080/TCP   28s
ratings       ClusterIP   10.96.15.180     <none>        9080/TCP   28s
reviews       ClusterIP   10.104.207.136   <none>        9080/TCP   28s
```

You should see four new services: details, productpage, ratings, and reviews. None of them have an external IP so we will use the [Kong gateway](https://github.com/Kong/kong) to expose the necessary services. And to check pods, run the following command:

```
$ kubectl get pods
NAME                              READY   STATUS    RESTARTS   AGE
details-v1-c5b5f496d-9wm29        2/2     Running   0          101s
productpage-v1-7d6cfb7dfd-5mc96   2/2     Running   0          100s
ratings-v1-f745cf57b-hmkwf        2/2     Running   0          101s
reviews-v1-85c474d9b8-kqcpt       2/2     Running   0          101s
reviews-v2-ccffdd984-9jnsj        2/2     Running   0          101s
reviews-v3-98dc67b68-nzw97        2/2     Running   0          101s
```

This command outputs useful data, so let’s take a second to understand it. If you examine the READY column, each pod has two containers running: the service and an Envoy sidecar injected alongside it. Another thing to highlight is that there are three review pods but only 1 review service. The Envoy sidecar will load balance the traffic to three different review pods that contain different versions, giving us the ability to A/B test our changes. We have one step before we can access the deployed application. We need to add an additional annotation to the `productpage` service. To do so, run:

```
$ kubectl annotate service productpage ingress.kubernetes.io/service-upstream=true
service/productpage annotated
```

Both the API gateway (Kong) and the service mesh (Istio) can handle the load-balancing. Without the additional `ingress.kubernetes.io/service-upstream: "true"` annotation, Kong will try to load-balance by selecting its own endpoint/target from the productpage service. This causes Envoy to receive that pod’s IP as the upstream local address, instead of the service’s cluster IP. But we want the service's cluster IP so that Envoy can properly load balance.  

With that added, you should now be able to access your product page!

```
$ kubectl exec -it $(kubectl get pod -l app=ratings -o jsonpath='{.items[0].metadata.name}') -c ratings -- curl productpage:9080/productpage | grep -o "<title>.*</title>"
<title>Simple Bookstore App</title>
```

### 2. Kong Kubernetes Ingress Controller Without Database

To expose your services to the world, we will deploy Kong as the north-south traffic gateway. [Kong 1.1](https://github.com/Kong/kong/releases/tag/1.1.2) released with declarative configuration and DB-less mode. Declarative configuration allows you to specify the desired system state through a YAML or JSON file instead of a sequence of API calls. Using declarative config provides several key benefits to reduce complexity, increase automation and enhance system performance. And with the Kong Ingress Controller, any Ingress rules you apply to the cluster will automatically be configured on the Kong proxy. Let’s set up the Kong Ingress Controller and the actual Kong proxy first like this:

```
$ kubectl apply -f https://bit.ly/k4k8s
namespace/kong configured
customresourcedefinition.apiextensions.k8s.io/kongconsumers.configuration.konghq.com created
customresourcedefinition.apiextensions.k8s.io/kongcredentials.configuration.konghq.com created
customresourcedefinition.apiextensions.k8s.io/kongingresses.configuration.konghq.com created
customresourcedefinition.apiextensions.k8s.io/kongplugins.configuration.konghq.com created
serviceaccount/kong-serviceaccount created
clusterrole.rbac.authorization.k8s.io/kong-ingress-clusterrole created
clusterrolebinding.rbac.authorization.k8s.io/kong-ingress-clusterrole-nisa-binding created
configmap/kong-server-blocks created
service/kong-proxy created
service/kong-validation-webhook created
deployment.apps/ingress-kong created
```

To check if the Kong pod is up and running, run:

```
$ kubectl get pods -n kong
NAME                               READY   STATUS    RESTARTS   AGE
pod/ingress-kong-8b44c9856-9s42v   3/3     Running   0          2m26s
```

There will be three containers within this pod. The first container is the Kong Gateway that will be the Ingress point to your cluster. The second container is the Ingress controller. It uses Ingress resources and updates the proxy to follow rules defined in the resource. And lastly, the third container is the Envoy proxy injected by Istio. Kong will route traffic through the Envoy sidecar proxy to the appropriate service. To send requests into the cluster via our newly deployed Kong Gateway, setup an environment variable with the a URL based on the IP address at which Kong is accessible.

```
$ export PROXY_URL="$(minikube service -n kong kong-proxy --url | head -1)"
$ echo $PROXY_URL
http://192.168.99.100:32728
```

Next, we need to change some configuration so that the side-car Envoy process can route the request correctly based on the host/authority header of the request. Run the following to stop the route from preserving host:

```
$ echo "
apiVersion: configuration.konghq.com/v1
kind: KongIngress
metadata:
    name: do-not-preserve-host
route:
  preserve_host: false
upstream:
  host_header: productpage.default.svc
" | kubectl apply -f -
kongingress.configuration.konghq.com/do-not-preserve-host created
```

And annotate the existing productpage service to set service-upstream as true:

```
$ kubectl annotate svc productpage Ingress.kubernetes.io/service-upstream="true"
service/productpage annotated
```

Now that we have everything set up, we can look at how to use the Ingress resource to help route external traffic to the services within your Istio mesh. We’ll create an Ingress rule that routes all traffic with the path of `/` to our productpage service:

```
$ echo "
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: productpage
  annotations:
    configuration.konghq.com: do-not-preserve-host
spec:
  rules:
  - http:
      paths:
      - path: /
        backend:
          serviceName: productpage
          servicePort: 9080
" | kubectl apply -f -
ingress.extensions/productpage created
```

And just like that, the Kong Ingress Controller is able to understand the rules you defined in the Ingress resource and routes it to the productpage service! To view the product page service’s GUI, go to `$PROXY_URL/productpage` in your browser. Or to test it in your command line, try:

```
$ curl $PROXY_URL/productpage
```

That is all I have for this walk-through. If you enjoyed the technologies used in this post, please check out their repositories since they are all open source and would love to have more contributors! Here are their links for your convenience:

* Kong: [[GitHub](https://github.com/Kong/kubernetes-ingress-controller)] [[Twitter](https://twitter.com/thekonginc)]
* Kubernetes: [[GitHub](https://github.com/kubernetes/kubernetes)] [[Twitter](https://twitter.com/kubernetesio)]
* Istio: [[GitHub](https://github.com/istio/istio)] [[Twitter](https://twitter.com/IstioMesh)]
* Envoy: [[GitHub](https://github.com/envoyproxy/envoy)] [[Twitter](https://twitter.com/EnvoyProxy)]

Thank you for following along!
