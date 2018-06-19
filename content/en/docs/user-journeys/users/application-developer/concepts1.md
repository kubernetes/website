---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js, https://cloud.google.com/js/embed.min.js
title: Foundational
track: "USERS › APPLICATION DEVELOPER › FOUNDATIONAL"
content_template: templates/user-journey-content
---

{{% capture overview %}}


## Basic Kubernetes concepts

### Container

Containers are objects that contain everything required (such as code, system tools, system libraries, settings) to run an application.

Containers sit on a physical or virtual host machine and run on the host’s operating system. This makes containers lightweight and portable: only megabytes in size. Containers help ensure that applications deploy quickly and reliably unlike virtual machines which are bulky and take a longer time to reboot.

### Image

An Image is a binary package that encapsulates all of the files necessary to run an application inside of an OS container.{Do I need to site this?x}  
For better understanding, you can think of an image as a class in a programming language and a container as an instance of that class.


### Container Engine (Docker)

Container engine is a system for automating deployment, scaling, and management of containerized applications. Container engine provisions the compute resources required by the application after a user specifies them.

### Control Loop/ Reconciliation Loop









More concepts

chunk 1
### Node
A node is a virtual or a physical machine that hosts the kubelet and the container engine.A node runs the services necessary to support the containers that make up cluster's workloads.


Kubelet - facilitator between etcd and container engine
diagram:



chunk 2
Pod
How does Kubernetes recognize something as a Pod?
Workload(?) - How do we bridge w/ terms used in day-to-day conversations?
Application - set of Pods running, not time bound
Job - run and done, time bound
chunk 3
Etcd - storage, analogous to memory in a computer, through which communication is done; distributed and fault tolerant
Resource
need to identify usages
chunk 4
Control Plane
Controller
Scheduler


Pods are the only schedulable unit in the Kubernetes environment that you can create and deploy. A Pod is a set of one or more containers that are run together in the container engine and local network.

A pod specification includes paths to one or more container images and configuration settings for running the containers.

The containers in a pod share the same IP address and get scheduled together. Pods reside on a node; more than one pod can reside in a single node.

Node is a machine (virtual or physical computer)


Kubelet is a service present on each node responsible for monitoring the node and relaying the distribution of pods to its container engine. Kubelet checks that all containers and their pods are running. When the controller assigns tasks to a pod, it is the kubelet that directs the pod to run these jobs.
 Kubelets talk to the container engine to instantiate the container.
1:1 relationship between kubelet and node.

Cluster master is the unified endpoint of the cluster that runs the Kubernetes control plane processes, including the Kubernetes API server, scheduler, and core resource controllers. (Should we be calling this master node?)

Cluster comprises at least one cluster master and a set of worker nodes. A cluster is the foundation of Kubernetes Engine: the Kubernetes objects that represent your containerized applications all run on top of a cluster.
