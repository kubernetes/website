---
title: " How Bitmovin is Doing Multi-Stage Canary Deployments with Kubernetes in the Cloud and On-Prem "
date: 2017-04-21
slug: multi-stage-canary-deployments-with-kubernetes-in-the-cloud-onprem
url: /blog/2017/04/Multi-Stage-Canary-Deployments-With-Kubernetes-In-The-Cloud-Onprem
author: >
  Daniel Hoelbling-Inzko (Bitmovin)
---
Running a large scale video encoding infrastructure on multiple public clouds is tough. At [Bitmovin](http://bitmovin.com/), we have been doing it successfully for the last few years, but from an engineering perspective, it’s neither been enjoyable nor particularly fun.   

So obviously, one of the main things that really sold us on using Kubernetes, was it’s common abstraction from the different supported cloud providers and the well thought out programming interface it provides. More importantly, the Kubernetes project did not settle for the lowest common denominator approach. Instead, they added the necessary abstract concepts that are required and useful to run containerized workloads in a cloud and then did all the hard work to map these concepts to the different cloud providers and their offerings.  

The great stability, speed and operational reliability we saw in our early tests in mid-2016 made the migration to Kubernetes a no-brainer.  

And, it didn’t hurt that the vision for scale the Kubernetes project has been pursuing is closely aligned with our own goals as a company. Aiming for \>1,000 node clusters might be a lofty goal, but for a fast growing video company like ours, having your infrastructure aim to support future growth is essential. Also, after initial brainstorming for our new infrastructure, we immediately knew that we would be running a huge number of containers and having a system, with the expressed goal of working at global scale, was the perfect fit for us. Now with the recent [Kubernetes 1.6](https://kubernetes.io/blog/2017/03/kubernetes-1-6-multi-user-multi-workloads-at-scale/) release and its [support for 5,000 node clusters](https://kubernetes.io/blog/2017/03/scalability-updates-in-kubernetes-1-6/), we feel even more validated in our choice of a container orchestration system.

During the testing and migration phase of getting our infrastructure running on Kubernetes, we got quite familiar with the Kubernetes API and the whole ecosystem around it. So when we were looking at expanding our cloud video encoding offering for customers to use in their own datacenters or cloud environments, we quickly decided to leverage Kubernetes as our ubiquitous cloud operating system to base the solution on.  

Just a few months later this effort has become our newest service offering: [Bitmovin Managed On-Premise encoding](https://bitmovin.com/managed-on-premise-encoding/). Since all Kubernetes clusters share the same API, adapting our cloud encoding service to also run on Kubernetes enabled us to deploy into our customer’s datacenter, regardless of the hardware infrastructure running underneath. With great tools from the community, like kube-up and turnkey solutions, like Google Container Engine, anyone can easily provision a new Kubernetes cluster, either within their own infrastructure or in their own cloud accounts.   

To give us the maximum flexibility for customers that deploy to bare metal and might not have any custom cloud integrations for Kubernetes yet, we decided to base our solution solely on facilities that are available in any Kubernetes install and don’t require any integration into the surrounding infrastructure (it will even run inside [Minikube](https://github.com/kubernetes/minikube)!). We don’t rely on Services of type LoadBalancer, primarily because enterprise IT is usually reluctant to open up ports to the open internet - and not every bare metal Kubernetes install supports externally provisioned load balancers out of the box. To avoid these issues, we deploy a BitmovinAgent that runs inside the Cluster and polls our API for new encoding jobs without requiring any network setup. This agent then uses the locally available Kubernetes credentials to start up new deployments that run the encoders on the available hardware through the Kubernetes API.  

Even without having a full cloud integration available, the consistent scheduling, health checking and monitoring we get from using the Kubernetes API really enabled us to focus on making the encoder work inside a container rather than spending precious engineering resources on integrating a bunch of different hypervisors, machine provisioners and monitoring systems.  


 ![](https://lh3.googleusercontent.com/k825xk4UlrK1IxnhRGFsxi_g_Yu65hbneXTmo2-F_rmVngxm7ghLdhiYMrjbi3xCf74wPANxJPDdSO4ZQJu43SKjR-JzRGbvf3fWewZ2-pcmXl3Uf-86xt4gYKwblsRiQXkvt_rv)
**Multi-Stage Canary Deployments**  

Our first encounters with the Kubernetes API were not for the On-Premise encoding product. Building our containerized encoding workflow on Kubernetes was rather a decision we made after seeing how incredibly easy and powerful the Kubernetes platform proved during development and rollout of our Bitmovin API infrastructure. We migrated to Kubernetes around four months ago and it has enabled us to provide rapid development iterations to our service while meeting our requirements of downtime-free deployments and a stable development to production pipeline. To achieve this we came up with an architecture that runs almost a thousand containers and meets the following requirements we had laid out on day one:  


1. 1.Zero downtime deployments for our customers
2. 2.Continuous deployment to production on each git mainline push
3. 3.High stability of deployed services for customers

Obviously #2 and #3 are at odds with each other, if each merged feature gets deployed to production right away - how can we ensure these releases are bug-free and don’t have adverse side effects for our customers?  

To overcome this oxymoron, we came up with a four-stage canary pipeline for each microservice where we simultaneously deploy to production and keep changes away from customers until the new build has proven to work reliably and correctly in the production environment.  

Once a new build is pushed, we deploy it to an internal stage that’s only accessible for our internal tests and the integration test suite. Once the internal test suite passes, QA reports no issues, and we don’t detect any abnormal behavior, we push the new build to our free stage. This means that 5% of our free users would get randomly assigned to this new build. After some time in this stage the build gets promoted to the next stage that gets 5% of our paid users routed to it. Only once the build has successfully passed all 3 of these hurdles, does it get deployed to the production tier, where it will receive all traffic from our remaining users as well as our enterprise customers, which are not part of the paid bucket and never see their traffic routed to a canary track.  


 ![](https://lh3.googleusercontent.com/4iiw1O-Ik8KeLSMh8Ubk9j4wh3Npelqon-ZJ8joGeXqpFoZvi6won9vLOBLyAEuHcFkigKYXH_twCVKWvjxL-YEJRAFbLbLP7Ry8DTMIAVKmrlp7pBIEnM5bE-22I7eZD3NBoMeB)

This setup makes us a pretty big Kubernetes installation by default, since all of our canary tiers are available at a minimum replication of 2. Since we are currently deploying around 30 microservices (and growing) to our clusters, it adds up to a minimum of 10 pods per service (8 application pods + minimum 2 HAProxy pods that do the canary routing). Although, in reality our preferred standard configuration is usually running 2 internal, 4 free, 4 others and 10 production pods alongside 4 HAProxy pods - totalling around 700 pods in total. This also means that we are running at least 150 services that provide a static ClusterIP to their underlying microservice canary tier.  

A typical deployment looks like this:  


| Services (ClusterIP) | Deployments | #Pods |
| account-service | account-service-haproxy | 4 |
| account-service-internal | account-service-internal-v1.18.0 | 2 |
| account-service-canary | account-service-canary-v1.17.0 | 4 |
| account-service-paid | account-service-paid-v1.15.0 | 4 |
| account-service-production | account-service-production-v1.15.0 | 10 |


An example service definition the production track will have the following label selectors:  


```
apiVersion: v1

kind: Service

metadata:

 name: account-service-production

 labels:

 app: account-service-production

 tier: service

 lb: private

spec:

 ports:

 - port: 8080

 name: http

 targetPort: 8080

 protocol: TCP

 selector:

 app: account-service

 tier: service

 track: production
 ```



In front of the Kubernetes services, load balancing the different canary versions of the service, lives a small cluster of HAProxy pods that get their haproxy.conf from the Kubernetes [ConfigMaps](/docs/tasks/configure-pod-container/configmap/) that looks something like this:



```
frontend http-in

 bind \*:80

 log 127.0.0.1 local2 debug


 acl traffic\_internal hdr(X-Traffic-Group) -m str -i INTERNAL

 acl traffic\_free  hdr(X-Traffic-Group) -m str -i FREE

 acl traffic\_enterprise hdr(X-Traffic-Group) -m str -i ENTERPRISE


 use\_backend internal if traffic\_internal

 use\_backend canary if traffic\_free

 use\_backend enterprise if traffic\_enterprise


 default\_backend paid


backend internal

 balance roundrobin

 server internal-lb  user-resource-service-internal:8080 resolvers dns check inter 2000

backend canary

 balance roundrobin

 server canary-lb    user-resource-service-canary:8080 resolvers dns check inter 2000 weight 5

 server production-lb user-resource-service-production:8080 resolvers dns check inter 2000 weight 95

backend paid

 balance roundrobin

 server canary-paid-lb user-resource-service-paid:8080 resolvers dns check inter 2000 weight 5

 server production-lb user-resource-service-production:8080 resolvers dns check inter 2000 weight 95

backend enterprise

 balance roundrobin

 server production-lb user-resource-service-production:8080 resolvers dns check inter 2000 weight 100
 ```



Each HAProxy will inspect a header that gets assigned by our API-Gateway called X-Traffic-Group that determines which bucket of customers this request belongs to. Based on that, a decision is made to hit either a canary deployment or the production deployment.



Obviously, at this scale, kubectl (while still our main day-to-day tool to work on the cluster) doesn’t really give us a good overview of whether everything is actually running as it’s supposed to and what is maybe over or under replicated.



Since we do blue/green deployments, we sometimes forget to shut down the old version after the new one comes up, so some services might be running over replicated and finding these issues in a soup of 25 deployments listed in kubectl is not trivial, to say the least.

So, having a container orchestrator like Kubernetes, that’s very API driven, was really a godsend for us, as it allowed us to write tools that take care of that.



We built tools that either run directly off kubectl (eg bash-scripts) or interact directly with the API and understand our special architecture to give us a quick overview of the system. These tools were mostly built in Go using the [client-go](https://github.com/kubernetes/client-go) library.



One of these tools is worth highlighting, as it’s basically our only way to really see service health at a glance. It goes through all our Kubernetes services that have the tier: service selector and checks if the accompanying HAProxy deployment is available and all pods are running with 4 replicas. It also checks if the 4 services behind the HAProxys (internal, free, others and production) have at least 2 endpoints running. If any of these conditions are not met, we immediately get a notification in Slack and by email.



Managing this many pods with our previous orchestrator proved very unreliable and the overlay network frequently caused issues. Not so with Kubernetes - even doubling our current workload for test purposes worked flawlessly and in general, the cluster has been working like clockwork ever since we installed it.



Another advantage of switching over to Kubernetes was the availability of the kubernetes resource specifications, in addition to the API (which we used to write some internal tools for deployment). This enabled us to have a Git repo with all our Kubernetes specifications, where each track is generated off a common template and only contains placeholders for variable things like the canary track and the names.



All changes to the cluster have to go through tools that modify these resource specifications and get checked into git automatically so, whenever we see issues, we can debug what changes the infrastructure went through over time!



To summarize this post - by migrating our infrastructure to Kubernetes, Bitmovin is able to have:

- Zero downtime deployments, allowing our customers to encode 24/7 without interruption
- Fast development to production cycles, enabling us to ship new features faster
- Multiple levels of quality assurance and high confidence in production deployments
- Ubiquitous abstractions across cloud architectures and on-premise deployments
- Stable and reliable health-checking and scheduling of services
- Custom tooling around our infrastructure to check and validate the system
- History of deployments (resource specifications in git + custom tooling)


We want to thank the Kubernetes community for the incredible job they have done with the project. The velocity at which the project moves is just breathtaking! Maintaining such a high level of quality and robustness in such a diverse environment is really astonishing.


- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Join the community portal for advocates on [K8sPort](http://k8sport.org/)
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Connect with the community on [Slack](http://slack.k8s.io/)
- [Download](http://get.k8s.io/) Kubernetes
