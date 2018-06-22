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

chunk 2

How does Kubernetes recognize something as a Pod?
Workload(?) - How do we bridge w/ terms used in day-to-day conversations?


### Application - set of Pods running, not time bound


### Job - run and done, time bound
A job creates one or more pods and ensures that a specified number of them successfully terminate. As pods successfully complete, the job tracks the successful completions. When a specified number of successful completions is reached, the job itself is complete. Deleting a Job will cleanup the pods it created.

A simple case is to create one Job object in order to reliably run one Pod to completion. The Job object will start a new Pod if the first pod fails or is deleted (for example due to a node hardware failure or a node reboot).

A Job can also be used to run multiple pods in parallel.

A Kubernetes  job is a supervisor for pods carrying out batch processes, that is, a process that runs for a certain time to completion, for example a calculation or a backup operation. This page gathers resources about Kubernetes Jobs, including an introduction, tutorials,examples and more.


### Workloads in Kubernetes
As more and more enterprises adopt a container based architecture, a container orchestrator has become necessary in order to provide wide-ranging options to manage containerized workloads. Kubernetes provides many options to manage containerized workloads. This page gathers resources on how to run workloads in Kubernetes.

### Kubernetes Services
A Kubernetes Guide service is an abstraction which defines a logical set of Pods and a policy by which to access them - sometimes called a micro-service. The set of Pods targeted by a service is usually determined by a Label Selector. This page gathers resources about the Kubernetes service types and how to create and work with them.

chunk 4

### Control Plane
The _Control Plane_ maintains a record of all of the Kubernetes Objects in the system, and runs continuous control loops to manage the state of these objects. The Control Plane’s control loops respond to changes in the cluster and work to make the current state of all the objects in the system match the desired state that you provided.

For example, when you use the Kubernetes API to create a Deployment object, you provide a new desired state for the system. The Kubernetes Control Plane records that object creation, and carries out your instructions by starting the required applications and scheduling them to cluster nodes–thus making the cluster’s actual state match the desired state.


#### Kubernetes API server

For Kubernetes to be useful, it needs to know *what* sort of cluster state you want it to maintain. Your YAML or JSON *configuration files* declare this desired state in terms of one or more API objects, such as {{< glossary_tooltip text="Deployments" term_id="deployment" >}}. To make updates to your cluster's state, you submit these files to the {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}} server (`kube-apiserver`).

Examples of state include but are not limited to the following:

* The applications or other workloads to run
* The container images for your applications and workloads
* Allocation of network and disk resources

Note that the API server is just the gateway, and that object data is actually stored in a highly available datastore called {{< link text="*etcd*" url="https://github.com/coreos/etcd" >}}. For most intents and purposes, though, you can focus on the API server. Most reads and writes to cluster state take place as API requests.

You can read more about the Kubernetes API {{< link text="here" url="/docs/concepts/overview/working-with-objects/kubernetes-objects/" >}}.

#### Controllers

The *controllers* work to make the cluster’s current state match the desired state that you have declared through the Kubernetes API.

The standard controller processes are {{< link text="`kube-controller-manager`" url="/docs/reference/generated/kube-controller-manager/" >}} and {{< link text="`cloud-controller-manager`" url="/docs/concepts/overview/components/#cloud-controller-manager" >}}, but you can also write your own controllers as well.

All of these controllers implement a *control loop*. For simplicity, you can think of this as the following:

{{< note >}}
1. What is the current state of the cluster (X)?

1. What is the desired state of the cluster (Y)?

1. X == Y ?

   * `true` - Do nothing.
   * `false` - Perform tasks to get to Y, such as starting or restarting containers,
   or scaling the number of replicas of a given application. Return to 1.

{{< /note >}}

### Scheduler

Scheduler is kind of a controller which uses the Kubernetes API to find newly created pods and assigns them to the available nodes depending upon the constraints expressed in the pods manifests.

While multiple pods can be assigned to the same node, scheduling multiple replicas of the same application onto the same node compromises the reliability in case of node failure. Therefore, the scheduler ensures that pods from the same application are distributed onto different machines.
