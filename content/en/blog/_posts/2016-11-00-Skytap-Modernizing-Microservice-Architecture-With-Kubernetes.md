---
title: " Modernizing the Skytap Cloud Micro-Service Architecture with Kubernetes "
date: 2016-11-07
slug: skytap-modernizing-microservice-architecture-with-kubernetes
url: /blog/2016/11/Skytap-Modernizing-Microservice-Architecture-With-Kubernetes
author: >
  Shawn Falkner-Horine (Skytap),
  Joe Burchett (Skytap)
---

[Skytap](https://www.skytap.com/) is a global public cloud that provides our customers the ability to save and clone complex virtualized environments in any given state. Our customers include enterprise organizations running applications in a hybrid cloud, educational organizations providing [virtual training labs](https://www.skytap.com/solutions/virtual-training/), users who need easy-to-maintain development and test labs, and a variety of organizations with diverse DevOps workflows.  

Some time ago, we started growing our business at an accelerated pace — our user base and our engineering organization continue to grow simultaneously. These are exciting, rewarding challenges! However, it's difficult to scale applications and organizations smoothly, and we’re approaching the task carefully. When we first began looking at improvements to scale our toolset, it was very clear that traditional OS virtualization was not going to be an effective way to achieve our scaling goals. We found that the persistent nature of VMs encouraged engineers to build and maintain bespoke ‘pet’ VMs; this did not align well with our desire to build reusable runtime environments with a stable, predictable state. Fortuitously, growth in the Docker and Kubernetes communities has aligned with our growth, and the concurrent explosion in community engagement has (from our perspective) helped these tools mature.  

In this article we’ll explore how Skytap uses Kubernetes as a key component in services that handle production workloads growing the Skytap Cloud.  

As we add engineers, we want to maintain our agility and continue enabling ownership of components throughout the software development lifecycle. This requires a lot of modularization and consistency in key aspects of our process. Previously, we drove reuse with systems-level packaging through our VM and environment templates, but as we scale, containers have become increasingly important as a packaging mechanism due to their comparatively lightweight and precise control of the runtime environment.&nbsp;  

In addition to this packaging flexibility, containers help us establish more efficient resource utilization, and they head off growing complexity arising from the natural inclination of teams to mix resources into large, highly-specialized VMs. For example, our operations team would install tools for monitoring health and resource utilization, a development team would deploy a service, and the security team might install traffic monitoring; combining all of that into a single VM greatly increases the test burden and often results in surprises—oops, you pulled in a new system-level Ruby gem!  

Containerization of individual components in a service is pretty trivial with Docker. Getting started is easy, but as anyone who has built a distributed system with more than a handful of components knows, the real difficulties are deployment, scaling, availability, consistency, and communication between each unit in the cluster.  

**Let’s containerize!&nbsp;**  

We’d begun to trade a lot of our heavily-loved pet VMs for, [as the saying goes](https://ericsysmin.com/2016/03/07/pets-vs-cattle/), cattle.

```
_____
/ Moo \
\---- /
       \   ^__^
        \  (oo)\_______
           (__)\       )\/\
               ||-----w |
               ||     ||
```  

The challenges of distributed systems aren’t simplified by creating a large herd of free-range containers, though. When we started using containers, we recognized the need for a container management framework. We evaluated Docker Swarm, Mesosphere, and Kubernetes, but we found that the Mesosphere usage model didn’t match our needs — we need the ability to manage discrete VMs; this doesn’t match the Mesosphere ‘distributed operating system’ model — and Docker Swarm was still not mature enough. So, we selected Kubernetes. &nbsp;



Launching Kubernetes and building a new distributed service is relatively easy (inasmuch as this can be said for such a service: you can’t beat [CAP theorem](https://en.wikipedia.org/wiki/CAP_theorem)). However, we need to integrate container management with our existing platform and infrastructure. Some components of the platform are better served by VMs, and we need the ability to containerize services iteratively.&nbsp;

We broke this integration problem down into four categories:&nbsp;

1. 1.Service control and deployment
2. 2.Inter-service communication
3. 3.Infrastructure integration
4. 4.Engineering support and education

**Service Control and Deployment**



We use a custom extension of [Capistrano](https://github.com/capistrano/capistrano) (we call it ‘Skycap’) to deploy services and manage those services at runtime. It is important for us to manage both containerized and classic services through a single, well-established framework. We also need to isolate Skycap from the inevitable breaking changes inherent in an actively-developed tool like Kubernetes.&nbsp;



To handle this, we use wrappers in to our service control framework that isolate kubectl behind Skycap and handle issues like ignoring spurious log messages.



Deployment adds a layer of complexity for us. Docker images are a great way to package software, but historically, we’ve deployed from source, not packages. Our engineering team expects that making changes to source is sufficient to get their work released; devs don’t expect to handle additional packaging steps. Rather than rebuild our entire deployment and orchestration framework for the sake of containerization, we use a continuous integration pipeline for our containerized services. We automatically build a new Docker image for every commit to a project, and then we tag it with the Mercurial (Hg) changeset number of that commit. On the Skycap side, a deployment from a specific Hg revision will then pull the Docker images that are tagged with that same revision number.&nbsp;



We reuse container images across multiple environments. This requires environment-specific configuration to be injected into each container instance. Until recently, we used similar source-based principles to inject these configuration values: each container would copy relevant configuration files from Hg by cURL-ing raw files from the repo at run time. Network availability and variability are a challenge best avoided, though, so we now load the configuration into Kubernetes’ [**ConfigMap**](https://kubernetes.io/blog/2016/04/configuration-management-with-containers) feature. This not only simplifies our Docker images, but it also makes pod startup faster and more predictable (because containers don’t have to download files from Hg). &nbsp;&nbsp;



**Inter-service communication**



Our services communicate using two primary methods. The first, message brokering, is typical for process-to-process communication within the Skytap platform. The second is through direct point-to-point TCP connections, which are typical for services that communicate with the outside world (such as web services). We’ll discuss the TCP method in the next section, as a component of infrastructure integration.&nbsp;



Managing direct connections between pods in a way that services can understand is complicated. Additionally, our containerized services need to communicate with classic VM-based services. To mitigate this complexity, we primarily use our existing message queueing system. This helped us avoid writing a TCP-based service discovery and load balancing system for handling traffic between pods and non-Kubernetes services.&nbsp;



This reduces our configuration load—services only need to know how to talk to the message queues, rather than to every other service they need to interact with. We have additional flexibility for things like managing the run-state of pods; messages buffer in the queue while nodes are restarting, and we avoid the overhead of re-configuring TCP endpoints each time a pod is added or removed from the cluster. Furthermore, the MQ model allows us to manage load balancing with a more accurate ‘pull’ based approach, in which recipients determine when they are ready to process a new message, instead of using heuristics like ‘least connections’ that simply count the number of open sockets to estimate load. &nbsp;



Migrating MQ-enabled services to Kubernetes is relatively straightforward compared to migrating services that use the complex TCP-based direct or load balanced connections. Additionally, the isolation provided by the message broker means that the switchover from a classic service to a container-based service is essentially transparent to any other MQ-enabled service.&nbsp;



**Infrastructure Integration**



As an infrastructure provider, we face some unique challenges in configuring Kubernetes for use with our platform. [AWS](https://aws.amazon.com/) & [GCP](https://cloud.google.com/) provide out-of-box solutions that simplify Kubernetes provisioning but make assumptions about the underlying infrastructure that do not match our reality. Some organizations have purpose-built data centers. This option would have required us to abandon our existing load balancing infrastructure, our Puppet based provisioning system and the expertise we’d built up around these tools. We weren’t interested in abandoning the tools or our vested experience, so we needed a way to manage Kubernetes that could integrate with our world instead of rebuild it.



So, we use Puppet to provision and configure VMs that, in turn, run the Skytap Platform. We wrote custom deployment scripts to install Kubernetes on these, and we coordinate with our operations team to do capacity planning for Kube-master and Kube-node hosts.&nbsp;



In the previous section, we mentioned point-to-point TCP-based communication. For customer-facing services, the pods need a way to interface with Skytap’s layer 3 network infrastructure. Examples at Skytap include our web applications and API over HTTPS, Remote Desktop over Web Sockets, FTP, TCP/UDP port forwarding services, full public IPs, etc. We need careful management of network ingress and egress for this external traffic, and have historically used [F5](https://f5.com/) load balancers. The MQ infrastructure for internal services is inadequate for handling this workload because the protocols used by various clients (like web browsers) are very specific and TCP is the lowest common denominator.



To get our load balancers communicating with our Kubernetes pods, we run the kube-proxy on each node. Load balancers route to the node, and kube-proxy handles the final handoff to the appropriate pod.



We mustn’t forget that Kubernetes needs to route traffic between pods (for both TCP-based and MQ-based messaging). We use the [Calico](https://www.projectcalico.org/calico-networking-for-kubernetes/) plugin for Kubernetes networking, with a specialized service to reconfigure the F5 when Kubernetes launches or reaps pods. Calico handles route advertisement with [BGP](https://en.wikipedia.org/wiki/Border_Gateway_Protocol), which eases integration with the F5.



F5s also need to have their [load balancing pool](https://support.f5.com/kb/en-us/products/big-ip_ltm/manuals/product/ltm-concepts-11-2-0/ltm_pools.html) reconfigured when pods enter or leave the cluster. The F5 appliance maintains a pool of load-balanced back-ends; ingress to a containerized service is directed through this pool to one of the nodes hosting a service pod. This is straightforward for static network configurations – but since we're using Kubernetes to manage pod replication and availability, our networking situation becomes dynamic. To handle changes, we have a 'load balancer' pod that monitors the Kubernetes svc object for changes; if a pod is removed or added, the ‘load balancer’ pod will detect this change through the svc object, and then update the F5 configuration through the appliance's web API. This way, Kubernetes transparently handles replication and failover/recovery, and the dynamic load balancer configuration lets this process remain invisible to the service or user who originated the request. Similarly, the combination of the Calico virtual network plus the F5 load balancer means that TCP connections should behave consistently for services that are running on both the traditional VM infrastructure, or that have been migrated to containers.&nbsp;



 ![kubernetes_f5_messaging.png](https://lh4.googleusercontent.com/2wfBbW3zxYLPg8Xgl6GIAE9Xt9afjZfTAyfR0H6EzfdHAJyDjg7N1RCpZLoLG9N9wVAnsczXUBicJ4QUydCOJ1uZ6A1SP44ki-XAnpDYTiL5cLaXFoi2YtKjKYxC5hFoCoOs7nWM)



With dynamic reconfiguration of the network, the replication mechanics of Kubernetes make horizontal scaling and (most) failover/recovery very straightforward. We haven’t yet reached the reactive scaling milestone, but we've laid the groundwork with the Kubernetes and Calico infrastructure, making one avenue to implement it straightforward:

- Configure upper and lower bounds for service replication
- Build a load analysis and scaling service (easy, right?)
- If load patterns match the configured triggers in the scaling service (for example, request rate or volume above certain bounds), issue: kubectl scale --replicas=COUNT rc NAME

This would allow us fine-grained control of autoscaling at the platform level, instead of from the applications themselves – but we’ll also evaluate [**Horizontal Pod Autoscaling**](/docs/user-guide/horizontal-pod-autoscaling/) in Kubernetes; which may suit our need without a custom service.&nbsp;



Keep an eye on [our GitHub account](https://github.com/skytap) and the [Skytap blog](https://www.skytap.com/blog/); as our solutions to problems like these mature, we hope to share what we’ve built with the open source community.



**Engineering Support**



A transition like our containerization project requires the engineers involved in maintaining and contributing to the platform change their workflow and learn new methods for creating and troubleshooting services.&nbsp;



Because a variety of learning styles require a multi-faceted approach, we handle this in three ways: with documentation, with direct outreach to engineers (that is, brownbag sessions or coaching teams), and by offering easy-to-access, ad-hoc support. &nbsp;



We continue to curate a collection of documents that provide guidance on transitioning classic services to Kubernetes, creating new services, and operating containerized services. Documentation isn’t for everyone, and sometimes it’s missing or incomplete despite our best efforts, so we also run an internal #kube-help Slack channel, where anyone can stop in for assistance or arrange a more in-depth face-to-face discussion.



We have one more powerful support tool: we automatically construct and test prod-like environments that include this Kubernetes infrastructure, which allows engineers a lot of freedom to experiment and work with Kubernetes hands-on. We explore the details of automated environment delivery in more detail in [this post](https://www.skytap.com/blog/continuous-delivery-fully-functional-environments-skytap-part-1/).



**Final Thoughts**



We’ve had great success with Kubernetes and containerization in general, but we’ve certainly found that integrating with an existing full-stack environment has presented many challenges. While not exactly plug-and-play from an enterprise lifecycle standpoint, the flexibility and configurability of Kubernetes still remains a very powerful tool for building our modularized service ecosystem.



We love application modernization challenges. The Skytap platform is well suited for these sorts of migration efforts – we run Skytap in Skytap, of course, which helped us tremendously in our Kubernetes integration project. If you’re planning modernization efforts of your own, [connect with us](https://www.skytap.com/), we’re happy to help.






- [Download](http://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)&nbsp;
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)&nbsp;
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
