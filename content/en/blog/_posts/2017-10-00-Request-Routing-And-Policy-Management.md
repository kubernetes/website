---
title: " Request Routing and Policy Management with the Istio Service Mesh "
date: 2017-10-10
slug: request-routing-and-policy-management
url: /blog/2017/10/Request-Routing-And-Policy-Management
author: >
  Frank Budinsky (IBM),
  Andra Cismaru (Google),
  Israel Shalom (Google)
---
_**Editor's note:** Today’s post is the second post in a three-part series on Istio._

In a [previous article](https://kubernetes.io/blog/2017/05/managing-microservices-with-istio-service-mesh), we looked at a [simple application (Bookinfo)](https://istio.io/docs/guides/bookinfo.html) that is composed of four separate microservices. The article showed how to deploy an application with Kubernetes and an Istio-enabled cluster without changing any application code. The article also outlined how to view Istio provided L7 metrics on the running services.  

This article follows up by taking a deeper look at Istio using Bookinfo. Specifically, we’ll look at two more features of Istio: request routing and policy management.  


## Running the Bookinfo Application
As before, we run the v1 version of the Bookinfo application. After [installing Istio](https://istio.io/docs/setup/kubernetes/quick-start.html) in our cluster, we start the app defined in [bookinfo-v1.yaml](https://raw.githubusercontent.com/istio/istio/master/samples/kubernetes-blog/bookinfo-v1.yaml) using the following command:  



 ```  
kubectl apply -f \<(istioctl kube-inject -f bookinfo-v1.yaml)
  ```

We created an Ingress resource for the app:




 ```  
cat \<\<EOF | kubectl create -f -

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

Then we retrieved the NodePort address of the Istio Ingress controller:



 ```  
export BOOKINFO\_URL=$(kubectl get po -n istio-system -l istio=ingress -o jsonpath={.items[0].status.hostIP}):$(kubectl get svc -n istio-system istio-ingress -o jsonpath={.spec.ports[0].nodePort})
  ```

Finally, we pointed our browser to [http://$BOOKINFO\_URL/productpage](about:blank), to see the running v1 application:



 ![](https://lh3.googleusercontent.com/kGRJnhkf30FBOY2pyZzID90f_zxlyMUv43hEvfq70bcmYhKrGv2em2qph21k-ahlwfBthV3XQSf6CuUQXMlvgSlOUJr4W1ksDVXIvChEd6a5Y51lwepHmyQx2ksJgUpyTiEbZN11)  



## HTTP request routing
Existing container orchestration platforms like Kubernetes, Mesos, and other microservice frameworks allow operators to control when a particular set of pods/VMs should receive traffic (e.g., by adding/removing specific labels). Unlike existing techniques, Istio decouples traffic flow and infrastructure scaling. This allows Istio to provide a variety of traffic management features that reside outside the application code, including dynamic HTTP [request routing](https://istio.io/docs/concepts/traffic-management/#routing-rules) for A/B testing, canary releases, gradual rollouts, [failure recovery](https://istio.io/docs/concepts/traffic-management/#network-resilience-and-testing) using timeouts, retries, circuit breakers, and [fault injection](https://istio.io/docs/concepts/traffic-management/fault-injection.html) to test compatibility of failure recovery policies across services.   

To demonstrate, we’ll deploy v2 of the **reviews** service and use Istio to make it visible only for a specific test user. We can create a Kubernetes deployment, reviews-v2, with [this YAML file](https://raw.githubusercontent.com/istio/istio/master/samples/kubernetes-blog/bookinfo-reviews-v2.yaml):  




 ```  
apiVersion: extensions/v1beta1

kind: Deployment

metadata:

 name: reviews-v2

spec:

 replicas: 1

 template:

     metadata:

         labels:

             app: reviews

             version: v2

     spec:

         containers:

         - name: reviews

             image: istio/examples-bookinfo-reviews-v2:0.2.3

             imagePullPolicy: IfNotPresent

             ports:

             - containerPort: 9080
  ```

From a Kubernetes perspective, the v2 deployment adds additional pods that the reviews service selector includes in the round-robin load balancing algorithm. This is also the default behavior for Istio.  

Before we start reviews:v2, we’ll start the last of the four Bookinfo services, ratings, which is used by the v2 version to provide ratings stars corresponding to each review:



 ```  
kubectl apply -f \<(istioctl kube-inject -f bookinfo-ratings.yaml)
  ```

If we were to start **reviews:v2** now, we would see browser responses alternating between v1 (reviews with no corresponding ratings) and v2 (review with black rating stars). This will not happen, however, because we’ll use Istio’s traffic management feature to control traffic.  

With Istio, new versions don’t need to become visible based on the number of running pods. Version visibility is controlled instead by rules that specify the exact criteria. To demonstrate, we start by using Istio to specify that we want to send 100% of reviews traffic to v1 pods only.   

Immediately setting a default rule [for every service](https://github.com/istio/istio/blob/master/samples/bookinfo/kube/route-rule-all-v1.yaml) in the mesh is an Istio best practice. Doing so avoids accidental visibility of newer, potentially unstable versions. For the purpose of this demonstration, however, we’ll only do it for the reviews service:




 ```  
cat \<\<EOF | istioctl create -f -

apiVersion: config.istio.io/v1alpha2

kind: RouteRule

metadata:

   name: reviews-default

spec:

   destination:

       name: reviews

   route:

   - labels:

           version: v1

       weight: 100

EOF
  ```

This command directs the service mesh to send 100% of traffic for the reviews service to pods with the label “version: v1”. With this rule in place, we can safely deploy the v2 version without exposing it.




 ```  
kubectl apply -f \<(istioctl kube-inject -f bookinfo-reviews-v2.yaml)
  ```

Refreshing the Bookinfo web page confirms that nothing has changed.  

At this point we have all kinds of options for how we might want to expose **reviews:v2**. If for example we wanted to do a simple canary test, we could send 10% of the traffic to v2 using a rule like this:




 ```  
apiVersion: config.istio.io/v1alpha2

kind: RouteRule

metadata:

   name: reviews-default

spec:

   destination:

       name: reviews

   route:

   - labels:

           version: v2

       weight: 10

   - labels:

           version: v1

       weight: 90
  ```

A better approach for early testing of a service version is to instead restrict access to it much more specifically. To demonstrate, we’ll set a rule to only make reviews:v2 visible to a specific test user. We do this by setting a second, higher priority rule that will only be applied if the request matches a specific condition:




 ```  
cat \<\<EOF | istioctl create -f -

apiVersion: config.istio.io/v1alpha2

kind: RouteRule

metadata:

 name: reviews-test-v2

spec:

 destination:

     name: reviews

 precedence: 2

 match:

     request:

         headers:

             cookie:

                 regex: "^(.\*?;)?(user=jason)(;.\*)?$"

 route:

 - labels:

         version: v2

     weight: 100

EOF
  ```

Here we’re specifying that the request headers need to include a user cookie with value “tester” as the condition. If this rule is not matched, we fall back to the default routing rule for v1.  

If we login to the Bookinfo UI with the user name “tester” (no password needed), we will now see version v2 of the application (each review includes 1-5 black rating stars). Every other user is unaffected by this change.  



 ![](https://lh5.googleusercontent.com/WLvX01Oja8R_cMb_AD91jIiF0bHW0nSJTRJ6Vt3Xz75MLzivZ5-ghHEZkdTJryhNXyTCUemF4OwxYn_96ntimOwyjABuZjaH3O2RsJyYQbqWoQgvSQktQd98t3T3Qe3KZSd20Cam)  

Once the v2 version has been thoroughly tested, we can use Istio to proceed with a canary test using the rule shown previously, or we can simply migrate all of the traffic from v1 to v2, optionally in a gradual fashion by using a sequence of rules with weights less than 100 (for example: 10, 20, 30, ... 100). This traffic control is independent of the number of pods implementing each version. If, for example, we had auto scaling in place, and high traffic volumes, we would likely see a corresponding scale up of v2 and scale down of v1 pods happening independently at the same time. For more about version routing with autoscaling, check out ["Canary Deployments using Istio"](https://istio.io/blog/canary-deployments-using-istio.html).  

In our case, we’ll send all of the traffic to v2 with one command:




 ```  
cat \<\<EOF | istioctl replace -f -

apiVersion: config.istio.io/v1alpha2

kind: RouteRule

metadata:

   name: reviews-default

spec:

   destination:

       name: reviews

   route:

   - labels:

           version: v2

       weight: 100

EOF
  ```

We should also remove the special rule we created for the tester so that it doesn’t override any future rollouts we decide to do:  



 ```  
istioctl delete routerule reviews-test-v2
  ```

In the Bookinfo UI, we’ll see that we are now exposing the v2 version of reviews to all users.  


## Policy enforcement
Istio provides policy enforcement functions, such as quotas, precondition checking, and access control. We can demonstrate Istio’s open and extensible framework for policies with an example: rate limiting.  

Let’s pretend that the Bookinfo ratings service is an external paid service--for example, [Rotten Tomatoes®](https://www.rottentomatoes.com/)--with a free quota of 1 request per second (req/sec). To make sure the application doesn’t exceed this limit, we’ll specify an Istio policy to cut off requests once the limit is reached. We’ll use one of Istio’s built-in policies for this purpose.  

To set a 1 req/sec quota, we first configure a **memquota** handler with rate limits:




 ```  
cat \<\<EOF | istioctl create -f -

apiVersion: "config.istio.io/v1alpha2"

kind: memquota

metadata:

 name: handler

 namespace: default

spec:

 quotas:

 - name: requestcount.quota.default

     maxAmount: 5000

     validDuration: 1s

     overrides:

     - dimensions:

             destination: ratings

         maxAmount: 1

         validDuration: 1s

EOF
  ```

Then we create a **quota** instance that maps incoming attributes to quota dimensions, and create a **rule** that uses it with the **memquota** handler:




 ```  
cat \<\<EOF | istioctl create -f -

apiVersion: "config.istio.io/v1alpha2"

kind: quota

metadata:

 name: requestcount

 namespace: default

spec:

 dimensions:

     source: source.labels["app"] | source.service | "unknown"

     sourceVersion: source.labels["version"] | "unknown"

     destination: destination.labels["app"] | destination.service | "unknown"

     destinationVersion: destination.labels["version"] | "unknown"

---

apiVersion: "config.istio.io/v1alpha2"

kind: rule

metadata:

 name: quota

 namespace: default

spec:

 actions:

 - handler: handler.memquota

     instances:

     - requestcount.quota

EOF
  ```

To see the rate limiting in action, we’ll generate some load on the application:




 ```  
wrk -t1 -c1 -d20s http://$BOOKINFO\_URL/productpage
  ```

In the web browser, we’ll notice that while the load generator is running (i.e., generating more than 1 req/sec), browser traffic is cut off. Instead of the black stars next to each review, the page now displays a message indicating that ratings are not currently available.  

Stopping the load generator means the limit will no longer be exceeded: the black stars return when we refresh the page.  


## Summary
We’ve shown you how to introduce advanced features like HTTP request routing and policy injection into a service mesh configured with Istio without restarting any of the services. This lets you develop and deploy without worrying about the ongoing management of the service mesh; service-wide policies can always be added later.  

In the next and last installment of this series, we’ll focus on Istio’s security and authentication capabilities. We’ll discuss how to secure all interservice communications in a mesh, even against insiders with access to the network, without any changes to the application code or the deployment.