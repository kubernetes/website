---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js, https://cloud.google.com/js/embed.min.js
title: Foundational
track: "USERS › APPLICATION DEVELOPER › Concepts"
content_template: templates/user-journey-content
---

{{% capture overview %}}



### Control Plane
A _control plane_ comprises an API server and controllers.

The control plane maintains a record of all of the Kubernetes Objects in the system, and runs continuous control loops to manage the state of these objects. The Control Plane’s control loops respond to changes in the cluster and work to make the current state of all the objects in the system match the desired state that you provided.

For example, when you use the Kubernetes API to create a Deployment object, you provide a new desired state for the system. The Kubernetes Control Plane records that object creation, and carries out your instructions by starting the required applications and scheduling them to cluster nodes–thus making the cluster’s actual state match the desired state.


#### Kubernetes API server

A _Kubernetes API server_ is the central management entity that validates and configures data for the API objects such as pods, deployments etc.

Your YAML or JSON *configuration files* declare the desired state in terms of one or more API objects, such as {{< glossary_tooltip text="Deployments" term_id="deployment" >}}. To make updates to your cluster's state, you submit these files to the {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}} server (`kube-apiserver`) and then specific controllers run the control loops to change the current state of the object to the desired state.

Some examples of state include the following:

* The applications or other workloads to run
* The container images for your applications and workloads
* Allocation of network and disk resources


### Controller Manager


A _controller manager_ is a daemon that embeds the most of the core controllers shipped with Kubernetes.  The Controller Manager also performs functions such as namespace creation and lifecycle, event garbage collection, terminated-pod garbage collection, cascading-deletion garbage collection, node garbage collection, etc.



#### Controllers

The *controllers* work to make the cluster’s current state match the desired state that you have declared through the Kubernetes API by running the control loops. Some examples of controllers that ship with Kubernetes include the Replication Controller, Endpoints Controller, and Namespace Controller.

The standard controller processes are {{< link text="`kube-controller-manager`" url="/docs/reference/generated/kube-controller-manager/" >}} and {{< link text="`cloud-controller-manager`" url="/docs/concepts/overview/components/#cloud-controller-manager" >}}, but you can also write your own controllers as well.

All of these controllers implement a *control loop*. For simplicity, you can think of this as the following:

{{< note >}}
1. the current state of the cluster is X

1. the desired state of the cluster is Y

1. If X == Y

   * `true` - Do nothing.
   * `false` - Perform tasks to get to Y, such as starting or restarting containers,
   or scaling the number of replicas of a given application. Return to 1.

{{< /note >}}

### Scheduler

A _scheduler_ is a kind of controller which uses the Kubernetes API to find newly created pods and assigns them to the available nodes depending upon the constraints expressed in the pods specification.

While multiple pods can be assigned to the same node, scheduling multiple replicas of the same application onto the same node compromises the reliability in case of node failure. Therefore, the scheduler ensures that pods from the same application are distributed onto different machines by examining labels, affinity, and tolerations on the pod.
