---
title: "  Managing microservices with the Istio service mesh "
date: 2017-05-31
slug: managing-microservices-with-istio-service-mesh
url: /blog/2017/05/Managing-Microservices-With-Istio-Service-Mesh
---

_Today’s post is by the Istio team showing how you can get visibility, resiliency, security and control for your microservices in Kubernetes._  

Services are at the core of modern software architecture. Deploying a series of modular, small (micro-)services rather than big monoliths gives developers the flexibility to work in different languages, technologies and release cadence across the system; resulting in higher productivity and velocity, especially for larger teams.  

With the adoption of microservices, however, new problems emerge due to the sheer number of services that exist in a larger system. Problems that had to be solved once for a monolith, like security, load balancing, monitoring, and rate limiting need to be handled for each service.  

**Kubernetes and Services**  

Kubernetes supports a microservices architecture through the [Service](/docs/concepts/services-networking/service/) construct. It allows developers to abstract away the functionality of a set of [Pods](/docs/concepts/workloads/pods/pod/), and expose it to other developers through a well-defined API. It allows adding a name to this level of abstraction and perform rudimentary L4 load balancing. But it doesn’t help with higher-level problems, such as L7 metrics, traffic splitting, rate limiting, circuit breaking, etc.  

[Istio](https://istio.io/), announced last week at GlueCon 2017, addresses these problems in a fundamental way through a service mesh framework. With Istio, developers can implement the core logic for the microservices, and let the framework take care of the rest – traffic management, discovery, service identity and security, and policy enforcement. Better yet, this can be also done for existing microservices without rewriting or recompiling any of their parts. Istio uses [Envoy](https://lyft.github.io/envoy/) as its runtime proxy component and provides an [extensible intermediation layer](https://istio.io/docs/concepts/policy-and-control/mixer.html) which allows global cross-cutting policy enforcement and telemetry collection.  

The current release of Istio is targeted to Kubernetes users and is packaged in a way that you can install in a few lines and get visibility, resiliency, security and control for your microservices in Kubernetes out of the box.  

In a series of blog posts, we'll look at a simple application that is composed of 4 separate microservices. We'll start by looking at how the application can be deployed using plain Kubernetes. We'll then deploy the exact same services into an Istio-enabled cluster without changing any of the application code -- and see how we can observe metrics.   

In subsequent posts, we’ll focus on more advanced capabilities such as HTTP request routing, policy, identity and security management.  

**Example Application: BookInfo**  

We will use a simple application called BookInfo, that displays information, reviews and ratings for books in a store. The application is composed of four microservices written in different languages:  

 ![BookInfo-all (2).png](https://lh6.googleusercontent.com/2l4VGkujZ2U_Ujuo55vTz08JBKhMVjNgQqlnX7DZHttDhJs_rKudWsXh6kU4JkwkKZETR7ljN70zAzhb__LqC0CondM_ps3h3viYGqxfvVcIYnFhbahEjXvGEZSmmEOET1oc7dRL)Since the container images for these microservices can all be found in Docker Hub, all we need to deploy this application in Kubernetes are the yaml configurations.  

It’s worth noting that these services have no dependencies on Kubernetes and Istio, but make an interesting case study. Particularly, the multitude of services, languages and versions for the reviews service make it an interesting service mesh example. More information about this example can be found [here](https://istio.io/docs/samples/bookinfo.html).  



**Running the Bookinfo Application in Kubernetes**

In this post we’ll focus on the v1 version of the app:



 ![BookInfo-v1 (3).png](https://lh4.googleusercontent.com/yD_ktHrTzgybi2DXdRWlrGD78rQgWvcGgDoWj0Pv5QtREPsmoz5pNDd2JI_MeiXx6kIS4QKy_Ved2hXsa68AqGpLftcWlPmYtew5DJqi6fNZrBHfVymjhDCGWgoHEIuzWaf9_doP)

Deploying it with Kubernetes is straightforward, no different than deploying any other services. Service and Deployment resources for the **productpage** microservice looks like this:



 ```
apiVersion: v1

kind: Service

metadata:

 name: productpage

 labels:

   app: productpage

spec:

 type: NodePort

 ports:

 - port: 9080

   name: http

 selector:

   app: productpage

---

apiVersion: extensions/v1beta1

kind: Deployment

metadata:

 name: productpage-v1

spec:

 replicas: 1

 template:

   metadata:

     labels:

       app: productpage

       track: stable

   spec:

     containers:

     - name: productpage

       image: istio/examples-bookinfo-productpage-v1

       imagePullPolicy: IfNotPresent

       ports:

       - containerPort: 9080
  ```




The other two services that we will need to deploy if we want to run the app are **details** and **reviews-v1**. We don’t need to deploy the **ratings** service at this time because v1 of the reviews service doesn’t use it. The remaining services follow essentially the same pattern as **productpage**. The yaml files for all services can be found [here](https://raw.githubusercontent.com/istio/istio/master/samples/bookinfo/platform/kube/bookinfo.yaml).



To run the services as an ordinary Kubernetes app:  

 ```
kubectl apply -f bookinfo-v1.yaml
  ```



To access the application from outside the cluster we’ll need the NodePort address of the **productpage** service:



 ```
export BOOKINFO\_URL=$(kubectl get po -l app=productpage -o jsonpath={.items[0].status.hostIP}):$(kubectl get svc productpage -o jsonpath={.spec.ports[0].nodePort})
  ```



We can now point the browser to http://$BOOKINFO\_URL/productpage, and see:



 ![](https://lh3.googleusercontent.com/AP3bEJR9uqsXufk5kZqD4DaRUs9ynuybfM8KBJlv_sF0g6A8LRO606jr_Z8xL71TrKWt_OfTXDJCcISZGy6ucj4KVZVFPFT8NCOOf6PpEZ0XVKlw-fgRP0iJvaBKuZaH-dySdJZ-)




**Running the Bookinfo Application with Istio**  

Now that we’ve seen the app, we’ll adjust our deployment slightly to make it work with Istio. We first need to [install Istio](https://istio.io/docs/tasks/installing-istio.html) in our cluster. To see all of the metrics and tracing features in action, we also install the optional Prometheus, Grafana, and Zipkin addons. We can now delete the previous app and start the Bookinfo app again using the exact same yaml file, this time with Istio:



 ```
kubectl delete -f bookinfo-v1.yaml

kubectl apply -f \<(istioctl kube-inject -f bookinfo-v1.yaml)
  ```



Notice that this time we use the istioctl kube-inject command to modify bookinfo-v1.yaml before creating the deployments. It injects the Envoy sidecar into the Kubernetes pods as documented [here](https://istio.io/docs/reference/commands/istioctl.html#istioctl-kube-inject). Consequently, all of the microservices are packaged with an Envoy sidecar that manages incoming and outgoing traffic for the service.  


In the Istio service mesh we will not want to access the application **productpage** directly, as we did in plain Kubernetes. Instead, we want an Envoy sidecar in the request path so that we can use Istio’s management features (version routing, circuit breakers, policies, etc.) to control external calls to **productpage** , just like we can for internal requests. Istio’s Ingress controller is used for this purpose.  


To use the Istio Ingress controller, we need to create a Kubernetes [Ingress resource](https://raw.githubusercontent.com/istio/istio/master/samples/bookinfo/platform/kube/bookinfo-ingress.yaml) for the app, annotated with kubernetes.io/ingress.class: "istio", like this:



 ```
cat \<\<EOF  ``` kubectl create -f -

apiVersion: extensions/v1beta1

kind: Ingress

metadata:

 name: bookinfo

 annotations:

   kubernetes.io/ingress.class: "istio"

spec:

 rules:

 - http:

     paths:

     - path: /productpage

       backend:

         serviceName: productpage

         servicePort: 9080

     - path: /login

       backend:

         serviceName: productpage

         servicePort: 9080

     - path: /logout

       backend:

         serviceName: productpage

         servicePort: 9080

EOF
  ```



The resulting deployment with Istio and v1 version of the bookinfo app looks like this:  

 ![BookInfo-v1-Istio (5).png](https://lh3.googleusercontent.com/4gc7Yp7vX3uQjcJ7UUBTSP8szTyIn_muB9Xn8UvS8UMJ2C-OQApiX1NObwuqS92hJ42KjkUKt3otGjPtOUQhkb_qlauJA3ezOOu8KH4VchOE8DcY4JvO0aXjaTnVX_ivgbWyGqka)

This time we will access the app using the NodePort address of the Istio Ingress controller:



 ```
export BOOKINFO\_URL=$(kubectl get po -l istio=ingress -o jsonpath={.items[0].status.hostIP}):$(kubectl get svc istio-ingress -o jsonpath={.spec.ports[0].nodePort})
  ```



We can now load the page at http://$BOOKINFO\_URL/productpage and once again see the running app -- there should be no difference from the previous deployment without Istio for the user.  

However, now that the application is running in the Istio service mesh, we can immediately start to see some benefits.



**Metrics collection**  


The first thing we get from Istio out-of-the-box is the collection of metrics in Prometheus. These metrics are generated by the Istio filter in Envoy, collected according to default rules (which can be customized), and then sent to Prometheus. The metrics can be visualized in the Istio dashboard in Grafana. Note that while Prometheus is the out-of-the-box default metrics backend, Istio allows you to plug in to others, as we’ll demonstrate in future blog posts.  


To demonstrate, we'll start by running the following command to generate some load on the application:



 ```
wrk -t1 -c1 -d20s http://$BOOKINFO\_URL/productpage
  ```



We obtain Grafana’s NodePort URL:



 ```
export GRAFANA\_URL=$(kubectl get po -l app=grafana -o jsonpath={.items[0].status.hostIP}):$(kubectl get svc grafana -o jsonpath={.spec.ports[0].nodePort})
  ```



We can now open a browser at http://$GRAFANA\_URL/dashboard/db/istio-dashboard and examine the various performance metrics for each of the Bookinfo services:



 ![istio-dashboard-k8s-blog.png](https://lh5.googleusercontent.com/yFBKYWEmNxs-8VLtlJIG4BV0dUzqrvCfhWLh2CrGHyTtH5dArQy-owua3vdMCSjkdjtk8E3ZmEz32EupRL28WHALLm9MqJwCJrs1N5yv8typUJiLS_ExsO-uleaZ3bgbPraC8lgi)



**Distributed tracing**  The next thing we get from Istio is call tracing with Zipkin. We obtain its NodePort URL:  


 ```
export ZIPKIN\_URL=$(kubectl get po -l app=zipkin -o jsonpath={.items[0].status.hostIP}):$(kubectl get svc zipkin -o jsonpath={.spec.ports[0].nodePort})
  ```


We can now point a browser at http://$ZIPKIN\_URL/ to see request trace spans through the Bookinfo services.  


 ![](https://lh4.googleusercontent.com/qfm6Jobqaw9J6sdeG93rXb9KYb39DoVKJ0fqKFQiyi5JVEfiypAbvAOBw8OTPOgnAnv3TzDEripkOw9xCJLrwbE7jJziU_tHoyS8CFeVrGG_X0Ut1oV0OyUCB8Xo4U8UGNgm-7Ve)

Although the Envoy proxies send trace spans to Zipkin out-of-the-box, to leverage its full potential, applications need to be Zipkin aware and forward some headers to tie the individual spans together. See [zipkin-tracing](https://istio.io/docs/tasks/zipkin-tracing.html) for details.

**Holistic view of the entire fleet** The metrics that Istio provides are much more than just a convenience. They provide a consistent view of the service mesh, by generating uniform metrics throughout. We don’t have to worry about reconciling different types of metrics emitted by various runtime agents, or add arbitrary agents to gather metrics for legacy uninstrumented apps. We also no longer have to rely on the development process to properly instrument the application to generate metrics. The service mesh sees all the traffic, even into and out of legacy "black box" services, and generates metrics for all of it. **Summary** The demo above showed how in a few steps, we can launch Istio-backed services and observe L7 metrics on them. Over the next weeks we’ll follow on with demonstration of more Istio capabilities like policy management and HTTP request routing. Google, IBM and Lyft joined forces to create Istio based on our common experiences building and operating large and complex microservice deployments for internal and enterprise customers. Istio is an industry-wide community effort. We’ve been thrilled to see the enthusiasm from the industry partners and the insights they brought. As we take the next step and release Istio to the wild, we cannot wait to see what the broader community of contributors will bring to it. If you’re using or considering to use a microservices architecture on Kubernetes, we encourage you to give Istio a try, learn about it more at [istio.io](http://istio.io/), let us know what you think, or better yet, [**join**](https://istio.io/community/) the developer community to help shape its future!

_--On behalf of the Istio team. Frank Budinsky, Software Engineer at IBM, Andra Cismaru, Software Engineer and Israel Shalom, Product Manager at Google._  



- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
