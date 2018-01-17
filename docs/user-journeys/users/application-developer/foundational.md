---
approvers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css, https://fonts.googleapis.com/icon?family=Material+Icons
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Application Developer - Foundational
track: "USERS › APPLICATION DEVELOPER › FOUNDATIONAL"
---

{% capture overview %}
If you're a developer looking to run applications on Kubernetes, this page and its linked topics should help you get started with the fundamentals. Though this level primarily describes development workflows, [subsequent levels](/docs/home/?path=users&persona=app-developer&level=intermediate){:target="_blank"} cover more advanced, production setups.

##### **A quick note**
Generally, app developers can focus more on *what* they're deploying to Kubernetes, rather than *how* the underlying infrastructure works. Though it's possible for a single person to manage both, in many organizations, it’s common to assign the latter to a dedicated {% glossary_tooltip text="cluster operator" term_id="cluster-operator" %}. The cluster operator takes on the responsibility of setting up and maintaining Kubernetes clusters.

As a result, the app developer "user journey" is *not* a comprehensive overview of Kubernetes. It does, however, highlight the aspects of cluster admin that are most relevant to development, testing, and deployment at the application level.

{% endcapture %}


{% capture body %}
## Set up Kubernetes

Check to see if your organization already provides a dev cluster. If so, ask your cluster operator about credentials that you can use with the [kubectl command-line tool](/docs/tasks/tools/install-kubectl/){:target="_blank"}.
*Skip to the [next section](#deploy-scale-and-update-an-application) once you have this set up.*

Otherwise, you can get started with a couple of different options:
* A web-based environment
* A single-{% glossary_tooltip text="node" term_id="node" %} cluster called *Minikube*
* A multi-node cluster


#### Web-based Environment

If you're brand new to Kubernetes and simply want to experiment, web-based environments are a good place to start:

* [Katacoda Kubernetes Playground](https://www.katacoda.com/courses/kubernetes/playground){:target="_blank"} provides a set of web-based tutorials complete with their own Kubernetes environment. This is particularly helpful if you're unfamiliar with Kubernetes concepts.

* [Play with Kubernetes](http://labs.play-with-k8s.com/){:target="_blank"} allows you to explore further without setting up a local environment. Its environment is less structured than the Katacoda Playground, and allows you to spin up multiple nodes.

#### Minikube

Web-based environments are easy to access, but are not persistent. If you want to continue exploring Kubernetes in a workspace that you can come back to and change, Minikube is a good option.

Minikube can be installed locally, and runs a simple, single-node Kubernetes cluster inside a VM. This cluster is fully functioning and contains all core Kubernetes components. Quite a few developers have actually found this sufficient for local application development!

* [Install Minikube](/docs/tasks/tools/install-minikube/){:target="_blank"}

* *(Optional)* [Install Docker](/docs/setup/independent/install-kubeadm/#installing-docker){:target="_blank"} if you plan to run your Minikube cluster as part of a local development environment.

   Minikube includes a Docker daemon, but to create and push {% glossary_tooltip text="containers" term_id="container" %} as part of your development workflow, you'll want an independent Docker instance. Note that version 1.12 is recommended for full compatibility with Kubernetes, but a few other versions are tested and known to work.


You can get basic information about your cluster with the command `kubectl get nodes`. To get a good idea of what's really going on, however, you need to deploy an application to your cluster. This is covered in the next major section.

#### Multi-node cluster

Take a look at [these options](/docs/setup/pick-right-solution/){:target="_blank"}. Note that unlike with the Minikube setup, you'll need to configure `kubectl` yourself.

This is covered more in depth in the page for [intermediate app developers](){:target="_blank"}(LINK TODO).


## Deploy, scale, and update an application

When first trying to understand Kubernetes, you should start with the approach that best matches your learning style:

* **Concrete -> Abstract**
    *(Pods, Deployments, Jobs, etc. -> API Objects)*

    *This is the default ordering, so you don't need to do anything else.* Check out this section's tutorials and tasks, before proceeding to the high-level overview in the next section.

* **Abstract -> Concrete**
  *(API Objects -> Pods, Deployments, Jobs, etc.)*

    Skip ahead to the next section on [how Kubernetes works](#how-kubernetes-works-an-introduction). Return to this section afterwards to see those architectural patterns in practice.

Alternating between these two approaches can also help you better understand the key, extensible abstractions in Kubernetes.

#### A Basic Workload

To learn the basics of deploying an app to Kubernetes, you can check out any of the following resources. *(You do not have to do all of them, if you find one enough):*
* Guided tutorials that embed conceptual explanations
    * [Kubernetes 101](https://kubernetes.io/docs/user-guide/walkthrough/){:target="_blank"}

    * [Kubernetes 201](https://kubernetes.io/docs/user-guide/walkthrough/k8s201/){:target="_blank"}

* Shorter, practical examples
  * [Deploy a simple, stateless nginx server](/docs/tasks/run-application/run-stateless-application-deployment/){:target="_blank"}. Nginx is often used as the web server to help provide ingress from outside your cluster (in other words, external requests).

  * [Deploy a stateful, externally accessible MySQL database](/docs/tasks/run-application/run-single-instance-stateful-application/){:target="_blank"}. This introduces the concept of storage.

Through these tutorials, you'll gain familiarity with the following concepts:
* Fundamentals

  * **Kubernetes manifests** - These configuration files describe the desired state of your application and related resources as Kubernetes should maintain them. They are written in YAML or JSON. (See the [example from the nginx app](/docs/tasks/run-application/run-stateless-application-deployment/#creating-and-exploring-an-nginx-deployment))

  * **{% glossary_tooltip text="Pods" term_id="pod" %}** - This is the basic unit for all of the workloads you run on Kubernetes. You may find this [explanation of Pods and Nodes](/docs/tutorials/kubernetes-basics/explore-intro/){:target="_blank"} helpful.

* Common workload objects
  * **{% glossary_tooltip text="Deployment" term_id="deployment" %}** - The most common way of running X copies of your application. Supports rolling updates to your container images.

  * **{% glossary_tooltip text="Ingress" term_id="ingress" %}** - A general API object that determines routing rules, e.g. how to handle traffic requests between your cluster and the outside world.

  * **{% glossary_tooltip text="Service" term_id="deployment" %}** - By itself, a Deployment can't provide ingress. This is one of the simplest ways to configure ingress, as it supports load balancing and {% glossary_tooltip text="label" term_id="labels" %}  selection.

The subsequent sections here describe other useful areas to know for app deployment.

#### Metadata

{% glossary_tooltip text="Labels" term_id="labels" %} let you specify identifying information for Kubernetes objects that you define, such as pods. This information is entirely user-defined, and is used to sort and select sets of objects.

* When you previously [created a basic nginx Deployment](/docs/tasks/run-application/run-stateless-application-deployment/){:target="_blank"}, you specify the `app: nginx` label as part of the template metadata. The `matchLabels` selector then specifies this label as part of the spec.

* You can use these to tie a Service to a Deployment via the `selector` field, which you may have seen in the [MySQL example](/docs/tasks/run-application/run-single-instance-stateful-application/){:target="_blank"}.

* You also specify labels to customize your cluster, for example by [assigning pods to nodes](/docs/concepts/configuration/assign-pod-node/).

#### Storage

You'll also want to think about storage. Kubernetes provides different types of storage for different storage needs:

* **{% glossary_tooltip text="Volumes" term_id="volume" %}** -  Let you define storage for your cluster that is tied to the lifecycle of a Pod. It is therefore more persistent than container storage. Learn [how to configure volume storage](/docs/tasks/configure-pod-container/configure-volume-storage/), or [read more about about volume storage](/docs/concepts/storage/volumes/).

* **{% glossary_tooltip text="PersistentVolumes" term_id="persistent-volume" %}** and **{% glossary_tooltip text="PersistentVolumeClaims" term_id="persistent-volume-claim" %}** - Let you define storage at the cluster level. Typically a cluster administrator defines the PersistentVolume objects for the cluster, and cluster users (application developers, you) define the PersistentVolumeClaim objects that your application requires. Learn [how to set up persistent storage for your cluster](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/) or [read more about persistent volumes](/docs/concepts/storage/persistent-volumes/).

#### Configuration

To provide configuration data for your application, you can specify Kubernetes environment variables as part of the container definition in your Deployment manifest. However, this may require you to rebuild your container or modify your Deployment.

To decouple configuration data from your workload, you can also use the following objects:

* **{% glossary_tooltip text="ConfigMaps" term_id="configmap" %}** - For non-confidential data (e.g. an nginx-specific configuration file).

* **{% glossary_tooltip text="Secrets" term_id="secret" %}** - Similar to ConfigMaps, but for confidential data.

*ConfigMaps and Secrets are not overlapping options.* If you have *any* data that you want to keep private, you should be using a Secret. Otherwise there is nothing stopping that data from being exposed to malicious users.

## How Kubernetes works: an introduction

As an app developer, you don't need to know everything about the inner workings of Kubernetes, but you may find it helpful to understand it at a high-level.

#### Overview

Say that your team is deploying an ordinary Rails application. You've run some calculations and determined that you need five instances of your app running at any given time, in order to handle external traffic.

If you're not running Kubernetes or a similar automated system, you might find the following scenario familiar:
1. One instance of your app (a complete machine instance or just a container) goes down.
2. Because your team has monitoring set up, this pages the person on-call.
3. The on-call has to go in, investigate, and manually spin up a new instance.
4. Depending how your team handles DNS/networking, the on-call may also need to also update the service discovery mechanism to point at the IP of the new Rails instance rather than the old.

This process can be tedious and also inconvenient, especially if (2) happens in the early hours of the morning!

**If you have Kubernetes set up, however, manual intervention is not as necessary.** Kubernetes will gracefully handle (3) and (4) on your behalf. As a a result, it's often referred to as a *self-healing* system.

On a high-level, there are two key concepts to making this work: the *Kubernetes API* and the *Control Plane*.

#### Kubernetes API

For Kubernetes to be useful, it needs to know *what* sort of cluster state you want it to maintain. The {% glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" %} provides a way for you to declare this desired state, in terms of API objects (e.g. {% glossary_tooltip text="Deployments" term_id="deployment" %}). Cluster state includes but is not limited to the following information:

* The applications or other workloads to run
* The container images for your applications and workloads
* Allocation of network and disk resources

Each API object can be described in a YAML or JSON file called a *manifest*, which can be submitted to the appropriate API server endpoint.

`kubectl`, the command-line tool that allows you to easily read or modify your Kubernetes cluster, is basically just a user-friendly wrapper for the Kubernetes API. You're able to scale app instances and get node info because, under the hood, it's making API requests for you.

You can read more about the Kubernetes API [here](/docs/concepts/overview/working-with-objects/kubernetes-objects/){:target="_blank"}.

#### Control Plane

Once you’ve set your desired state -- that is, applied your YAML manifest to your cluster -- the **Kubernetes Control Plane** works to make the cluster’s current state match the desired state.

It's referred to as a "plane" because it is not a single, coherent component, but rather different processes spread across your cluster's [master node(s)](/docs/concepts/overview/components/#master-components){:target="_blank"} and [worker nodes](/docs/concepts/overview/components/#node-components){:target="_blank"}.

The aforementioned Kubernetes API server actually runs as part of the Control Plane (`kube-apiserver`).

The rest of the Control Plane (`kube-controller-manager`, `kube-scheduler`, `kubelet`, etc) essentially implements a "control loop". For simplicity, you can think of it as continuously asking the following:

```
 1. What is the current state of the cluster (X)?
 2. What is the desired state of the cluster (Y)?
 3. X == Y ?
   * true - Do nothing.
   * false - Perform tasks to get to Y (e.g. starting or restarting containers,
             scaling the number of replicas of a given application, etc.).
```

<br>

These ideas are covered in more detail [here](https://kubernetes.io/docs/concepts/){:target="_blank"}.

## Additional resources

The Kubernetes documentation is rich in detail. Here's a curated list of resources to help you start digging deeper.

### Basic concepts

* [More about Kubernetes components](https://kubernetes.io/docs/concepts/overview/components/)

* [Understanding Kubernetes objects](https://kubernetes.io/docs/concepts/overview/working-with-objects/kubernetes-objects/)

* [More about Node objects](https://kubernetes.io/docs/concepts/architecture/nodes/)

* [More about Pod objects](https://kubernetes.io/docs/concepts/workloads/pods/pod-overview/)

### Tutorials

* [Hello Minikube](https://kubernetes.io/docs/tutorials/stateless-application/hello-minikube/)

* [Kubernetes object management](https://kubernetes.io/docs/tutorials/object-management-kubectl/object-management/)

### What's next
If you feel fairly comfortable with the topics on this page and want to learn more, check out the following user journeys:
* [Intermediate App Developer](/docs/user-journeys/users/application-developer/intermediate/){:target="_blank"} - Dive deeper, with the next level of this journey.
* [Foundational Cluster Operator](/docs/user-journeys/users/cluster-operator/foundational/){:target="_blank"} - Build breadth, by exploring other journeys.

{% endcapture %}


{% include templates/user-journey-content.md %}
