---
approvers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css, https://fonts.googleapis.com/icon?family=Material+Icons
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Cluster Operator - Foundational
track: "USERS › CLUSTER OPERATOR › FOUNDATIONAL"
---

{% capture overview %}
If you want to learn how to get started managing and operating a Kubernetes cluster, this page and the linked topics will introduce you to foundational concepts and tasks.
The concepts introduce you to a kubernetes cluster and key concepts to understand and manage it, favoring focusing on the cluster itself over the software running within the cluster.
{% endcapture %}

<!-- Foundational:
Nodes, Pods, Networks, Deployments, Services, ConfigMaps, Secrets
Labels, Selectors, Annotations
Metrics -->


{% capture body %}
## Kubernetes Clusters

If you have not already done so, start your understanding by reading through [What is Kubernetes?](/docs/concepts/overview/what-is-kubernetes/), which will introduce you to a number of basic concepts and terms. 

Kubernetes is quite flexible, and can a cluster can be run in a wide variety of places. You can interact with Kubernetes entirely on your own laptop or local development machine with it running within a virtual machine. Kubernetes can also run on virtual machines hosted either locally or in a cloud provider, and you can run a kubernetes cluster on bare metal. 

A cluster is made up of one or more [Nodes](/docs/concepts/architecture/nodes/); where a node is a physical or virtual machine. If there are more than one node in your cluster, then each of the nodes are connected with a [cluster network](/docs/concepts/cluster-administration/networking/). Regardless of how many nodes, all Kubernetes clusters will generally have the same components, which are described in [Kubernetes Components](/docs/concepts/overview/components).





 - label: Pod Overview
    icon: fa-book
    url: /docs/concepts/workloads/pods/pod-overview/
 - label: Services
    icon: fa-book
    url: /docs/concepts/services-networking/service/
  - label: Deployments
    icon: fa-book
    url: /docs/concepts/workloads/controllers/deployment/
  - label: Labels and Selectors
    icon: fa-book
    url: /docs/concepts/overview/working-with-objects/labels/
  - label: Annotations
    icon: fa-book
    url: /docs/concepts/overview/working-with-objects/annotations/
  - label: ConfigMaps
    icon: fa-book
    url: /docs/tasks/configure-pod-container/configmap/
  - label: Secrets
    icon: fa-book
    url: /docs/concepts/configuration/secret/

  - label: Metrics
    icon: fa-book
    url: /docs/concepts/cluster-administration/controller-metrics/

## Set up Kubernetes

One good way to learn Kubernetes basics is with Minikube, which lets you create a simple single-node cluster with all core Kubernetes components. If you install locally, you may find that your cluster is sufficient for local application development. Installing Minikube locally is also a good idea if you want to continue exploring in a persistent environment that you can come back to and change.

If you're brand new to Kubernetes, you also might want to try out the [Katacoda Kubernetes Playground](https://www.katacoda.com/courses/kubernetes/playground), which provides a set of web-based tutorials complete with their own Kubernetes environment.

If you want to explore further without setting up a local environment, the web-based [Play with Kubernetes](http://labs.play-with-k8s.com/) gives you a less structured Kubernetes environment on the web.

Before you install Minikube:

* [Install a hypervisor if you don't have one already](/docs/tasks/tools/install-minikube/#install-a-hypervisor):
    * For OS X: xhyve, VirtualBox, or VMWare Fusion
    * For Linux: VirtualBox or KVM
    * For Windows: VirtualBox or Hyper-V
* [Install kubectl, the Kubernetes command-line tool](/docs/tasks/tools/install-kubectl/). Note that when you start Minikube, your kubectl is automatically configured to communicate with the server. You should therefore skip kubectl configuration at this point.
* (optional) If you plan to run your Minikube cluster as part of a local development environment, consider [installing Docker](/docs/setup/independent/install-kubeadm/#installing-docker). Minikube includes a Docker daemon, but to create and push containers as part of your development workflow, you'll want an independent Docker instance. Note that version 1.12 is recommended for full compatibility with Kubernetes, but a few other versions are tested and known to work.

Now you can [install Minikube](/docs/tasks/tools/install-minikube/).

You can get basic information about your cluster with the command `kubectl get nodes`. And you can [view your cluster's Pods and Nodes](/docs/tutorials/kubernetes-basics/explore-intro/). But to get a good idea of what's really going on, you need to deploy an application to your cluster.

## Deploy, scale, and update an application

You can deploy a simple application in Kubernetes with a Deployment manifest, also called a configuration or config file, or sometimes a spec. The manifest is written in YAML or JSON, and describes the desired state of the application and related resources as Kubernetes should maintain them.

* [Get started by deploying a simple nginx server](/docs/tasks/run-application/run-stateless-application-deployment/). Nginx is often used as the web server to help provide ingress from outside your cluster.
* By itself, a Deployment can't provide ingress. The simplest way to configure ingress is to [create a Service](/docs/tasks/access-application-cluster/service-access-application-cluster/) of type `NodePort`, which takes care of routing external traffic to your cluster over a dynamically allocated IP address and port. The service also takes care of load balancing.
* Optionally, learn more about providing external access:
    * [More about Deployments](/docs/concepts/workloads/controllers/deployment/).
    * [More about Services](/docs/concepts/services-networking/service/).
    * [Learn more about Ingress](/docs/concepts/services-networking/ingress/).

You'll also want to think about storage. Kubernetes provides different types of storage for different storage needs:

* A Volume lets you define storage for your cluster that is tied to the lifecycle of a Pod. It is therefore more persistent than container storage. Learn [how to configure volume storage](/docs/tasks/configure-pod-container/configure-volume-storage/), or [read more about about volume storage](/docs/concepts/storage/volumes/).
* A PersistentVolume and PersistentVolumeClaim let you define storage at the cluster level. Typically a cluster administrator defines the PersistentVolume objects for the cluster, and cluster users (application developers, you) define the PersistentVolumeClaim objects that your application requires. Learn [how to set up persistent storage for your cluster](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/) or [read more about persistent volumes](/docs/concepts/storage/persistent-volumes/).

Labels let you specify identifying information for Kubernetes objects that you define, such as pods. This information is entirely user-defined, and is used to sort and select sets of objects.

* When you [create a basic nginx Deployment](/docs/tasks/run-application/run-stateless-application-deployment/), you specify the `app: nginx` label as part of the template metadata. The `matchLabels` selector then specifies this label as part of the spec.
* [More about labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
* You also specify labels to customize your cluster, for example by [assigning pods to nodes](/docs/concepts/configuration/assign-pod-node/).

To provide configuration data for your application, you can specify Kubernetes environment variables as part of the container definition in your Deployment manifest. But to manage configuration data without having to rebuild your container or modify your Deployment, you can also [use a ConfigMap](/docs/tasks/configure-pod-container/configmap/) for non-confidential data, or [a Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/) for confidential data.

Note that ingress provides networking between your cluster and the outside world. A production cluster should also configure networking between containers and between nodes, which is [defined in a network policy](/docs/tasks/administer-cluster/declare-network-policy/).

## How Kubernetes works: an introduction

To work with Kubernetes, you describe your cluster's desired state in terms of Kubernetes API objects. Cluster state includes but is not limited to the following information:

* The applications or other workloads to run
* The container images for your applications and workloads
* Allocation of network and disk resources

Once you’ve set your desired state -- that is, applied your manifest or spec to your cluster -- the Kubernetes Control Plane works to make the cluster’s current state match the desired state. To do so, Kubernetes performs a variety of tasks automatically: starting or restarting containers, scaling the number of replicas of a given application, and more. The Kubernetes Control Plane consists of a collection of processes running on your cluster:

* The Kubernetes Master: a collection of three processes that run on a single node in your cluster, which is designated as the master node: 
    * kube-apiserver
    * kube-controller-manager
    * kube-scheduler.
* Each individual non-master node in your cluster runs two processes:
    * kubelet, which communicates with the Kubernetes Master.
    * kube-proxy, a network proxy that reflects Kubernetes networking services on each node.

[Read more](https://kubernetes.io/docs/concepts/)

## Additional resources

The Kubernetes documentation is rich in detail. Here's a curated list of resources to help you start digging deeper.

### Basic concepts

* [More about Kubernetes components](https://kubernetes.io/docs/concepts/overview/components/)

* [Understanding Kubernetes objects](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/)

* [More about Node objects](https://kubernetes.io/docs/concepts/architecture/nodes/)

* [More about Pod objects](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/)

### Tutorials

* [Hello Minikube](https://kubernetes.io/docs/tutorials/stateless-application/hello-minikube/)

* [Kubernetes 101](https://kubernetes.io/docs/user-guide/walkthrough/)

* [Kubernetes 201](https://kubernetes.io/docs/user-guide/walkthrough/k8s201/)

* [Kubernetes object management](https://kubernetes.io/docs/tutorials/object-management-kubectl/object-management/)


{% endcapture %}


{% include templates/user-journey-content.md %}
