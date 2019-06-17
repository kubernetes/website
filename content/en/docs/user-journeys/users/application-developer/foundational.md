---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Foundational
track: "USERS › APPLICATION DEVELOPER › FOUNDATIONAL"
content_template: templates/user-journey-content
---

{{% capture overview %}}
If you're a developer looking to run applications on Kubernetes, this page and its linked topics can help you get started with the fundamentals. Though this page primarily describes development workflows, {{< link text="the subsequent page in the series" url="/docs/home/?path=users&persona=app-developer&level=intermediate" >}} covers more advanced, production setups.

{{< note  >}}
**A quick note**<br>This app developer "user journey" is *not* a comprehensive overview of Kubernetes. It focuses more on *what* you develop, test, and deploy to Kubernetes, rather than *how* the underlying infrastructure works.<br><br>Though it's possible for a single person to manage both, in many organizations, it’s common to assign the latter to a dedicated {{< glossary_tooltip text="cluster operator" term_id="cluster-operator" >}}.
{{< /note  >}}
{{% /capture %}}


{{% capture body %}}
## Get started with a cluster

#### Web-based environment

If you're brand new to Kubernetes and simply want to experiment without setting up a full development environment, *web-based environments* are a good place to start:

* {{< link text="Kubernetes Basics" url="/docs/tutorials/kubernetes-basics/#basics-modules" >}} - Introduces you to six common Kubernetes workflows. Each section walks you through browser-based, interactive exercises complete with their own Kubernetes environment.

* {{< link text="Katacoda" url="https://www.katacoda.com/courses/kubernetes/playground" >}} - The playground equivalent of the environment used in *Kubernetes Basics* above. Katacoda also provides {{< link text="more advanced tutorials" url="https://www.katacoda.com/courses/kubernetes/" >}}, such as "Liveness and Readiness Healthchecks".


* {{< link text="Play with Kubernetes" url="http://labs.play-with-k8s.com/" >}} - A less structured environment than the *Katacoda* playground, for those who are more comfortable with Kubernetes concepts and want to explore further. It supports the ability to spin up multiple nodes.


#### Minikube (recommended)

Web-based environments are easy to access, but are not persistent. If you want to continue exploring Kubernetes in a workspace that you can come back to and change, *Minikube* is a good option.

Minikube can be installed locally, and runs a simple, single-node Kubernetes cluster inside a virtual machine (VM). This cluster is fully functioning and contains all core Kubernetes components. Many developers have found this sufficient for local application development.

* {{< link text="Install Minikube" url="/docs/tasks/tools/install-minikube/" >}}.

* {{< link text="Install kubectl" url="/docs/tasks/tools/install-kubectl/" >}}. ({{< glossary_tooltip text="What is kubectl?" term_id="kubectl" >}})

* *(Optional)* {{< link text="Install Docker" url="/docs/setup/production-environment/container-runtimes/#docker" >}} if you plan to run your Minikube cluster as part of a local development environment.

   Minikube includes a Docker daemon, but if you're developing applications locally, you'll want an independent Docker instance to support your workflow. This allows you to create {{< glossary_tooltip text="containers" term_id="container" >}} and push them to a container registry.

   {{< note  >}}
   Version 1.12 is recommended for full compatibility with Kubernetes, but a few other versions are tested and known to work.
   {{< /note  >}}

You can get basic information about your cluster with the commands `kubectl cluster-info` and `kubectl get nodes`. However, to get a good idea of what's really going on, you need to deploy an application to your cluster. This is covered in the next section.

#### MicroK8s

On Linux, *MicroK8s* is a good alternative to Minikube for a local
install of Kubernetes:

* Runs on the native OS, so there is no overhead from running a virtual machine.
* Always provides the latest stable version of Kubernetes, using built-in auto-upgrade functionality.
* Installs in less than a minute.

* {{< link text="Install microk8s" url="https://microk8s.io/" >}}.

After you install MicroK8s, you can use its tab-completion
functionality. All MicroK8s commands start with `microk8s.`. Type
`microk8s.` (with the period) and then use the tab key to see a list
of available commands.

It also includes commands to enable Kubernetes subsystems. For example:

* the Kubernetes Dashboard
* the DNS service
* GPU passthrough (for NVIDIA)
* Ingress
* Istio
* Metrics server
* Registry
* Storage

## Deploy an application

#### Basic workloads

The following examples demonstrate the fundamentals of deploying Kubernetes apps:

  * **Stateless apps**: {{< link text="Deploy a simple nginx server" url="/docs/tasks/run-application/run-stateless-application-deployment/" >}}.

  * **Stateful apps**: {{< link text="Deploy a MySQL database" url="/docs/tasks/run-application/run-single-instance-stateful-application/" >}}.

Through these deployment tasks, you'll gain familiarity with the following:

* General concepts

  * **Configuration files** - Written in YAML or JSON, these files describe the desired state of your application in terms of Kubernetes API objects. A file can include one or more API object descriptions (*manifests*). (See [the example YAML](/docs/tasks/run-application/run-stateless-application-deployment/#creating-and-exploring-an-nginx-deployment) from the stateless app).

  * **{{< glossary_tooltip text="Pods" term_id="pod" >}}** - This is the basic unit for all of the workloads you run on Kubernetes. These workloads, such as *Deployments* and *Jobs*, are composed of one or more Pods. To learn more, check out {{< link text="this explanation of Pods and Nodes" url="/docs/tutorials/kubernetes-basics/explore-intro/" >}}.

* Common workload objects
  * **{{< glossary_tooltip text="Deployment" term_id="deployment" >}}** - The most common way of running *X* copies (Pods) of your application. Supports rolling updates to your container images.

  * **{{< glossary_tooltip text="Service" term_id="service" >}}** - By itself, a Deployment can't receive traffic. Setting up a Service is one of the simplest ways to configure a Deployment to receive and loadbalance requests. Depending on the `type` of Service used, these requests can come from external client apps or be limited to apps within the same cluster. A Service is tied to a specific Deployment using {{< glossary_tooltip text="label" term_id="label" >}} selection.

The subsequent topics are also useful to know for basic application deployment.

#### Metadata

You can also specify custom information about your Kubernetes API objects by attaching key/value fields. Kubernetes provides two ways of doing this:

* **{{< glossary_tooltip text="Labels" term_id="label" >}}** - Identifying metadata that you can use to sort and select sets of API objects. Labels have many applications, including the following:

  * *To keep the right number of replicas (Pods) running in a Deployment.* The specified label (`app: nginx` in the {{< link text="stateless app example" url="/docs/tasks/run-application/run-stateless-application-deployment/#creating-and-exploring-an-nginx-deployment" >}}) is used to stamp the Deployment's newly created Pods (as the value of the `spec.template.labels` configuration field), and to query which Pods it already manages (as the value of `spec.selector.matchLabels`).

  * *To tie a Service to a Deployment* using the `selector` field, which is demonstrated in the {{< link text="stateful app example" url="/docs/tasks/run-application/run-single-instance-stateful-application/#deploy-mysql" >}}.

  * *To look for specific subset of Kubernetes objects, when you are using {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}.* For instance, the command `kubectl get deployments --selector=app=nginx` only displays Deployments from the nginx app.

* **{{< glossary_tooltip text="Annotations" term_id="annotation" >}}** - Nonidentifying metadata that you can attach to API objects, usually if you don't intend to use them for sorting purposes. These often serve as supplementary data about an app's deployment, such as Git SHAs, PR numbers, or URL pointers to observability dashboards.


#### Storage

You'll also want to think about storage. Kubernetes provides different types of storage API objects for different storage needs:

* **{{< glossary_tooltip text="Volumes" term_id="volume" >}}** -  Let you define storage for your cluster that is tied to the lifecycle of a Pod. It is therefore more persistent than container storage. Learn {{< link text="how to configure volume storage" url="/docs/tasks/configure-pod-container/configure-volume-storage/" >}}, or {{< link text="read more about volume storage" url="/docs/concepts/storage/volumes/" >}}.

* **{{< glossary_tooltip text="PersistentVolumes" term_id="persistent-volume" >}}** and **{{< glossary_tooltip text="PersistentVolumeClaims" term_id="persistent-volume-claim" >}}** - Let you define storage at the cluster level. Typically a cluster operator defines the PersistentVolume objects for the cluster, and cluster users (application developers, you) define the PersistentVolumeClaim objects that your application requires. Learn {{< link text="how to set up persistent storage for your cluster" url="/docs/tasks/configure-pod-container/configure-persistent-volume-storage/" >}} or {{< link text="read more about persistent volumes" url="/docs/concepts/storage/persistent-volumes/" >}}.

#### Configuration

To avoid having to unnecessarily rebuild your container images, you should decouple your application's *configuration data* from the code required to run it. There are a couple ways of doing this, which you should choose according to your use case:

<!-- Using HTML tables because the glossary_tooltip isn't compatible with the Markdown approach -->
<table>
  <thead>
    <tr>
      <th>Approach</th>
      <th>Type of Data</th>
      <th>How it's mounted</th>
      <th>Example</th>
    </tr>
  </thead>
  <tr>
    <td><a href="/docs/tasks/inject-data-application/define-environment-variable-container/">Using a manifest's container definition</a></td>
    <td>Non-confidential</td>
    <td>Environment variable</td>
    <td>Command-line flag</td>
  </tr>
  <tr>
    <td>Using <b>{{< glossary_tooltip text="ConfigMaps" term_id="configmap" >}}</b></td>
    <td>Non-confidential</td>
    <td>Environment variable OR local file</td>
    <td>nginx configuration</td>
  </tr>
  <tr>
    <td>Using <b>{{< glossary_tooltip text="Secrets" term_id="secret" >}}</b></td>
    <td>Confidential</td>
    <td>Environment variable OR local file</td>
    <td>Database credentials</td>
  </tr>
</table>

{{< note  >}}
If you have any data that you want to keep private, you should be using a Secret. Otherwise there is nothing stopping that data from being exposed to malicious users.
{{< /note  >}}

## Understand basic Kubernetes architecture

As an app developer, you don't need to know everything about the inner workings of Kubernetes, but you may find it helpful to understand it at a high level.

#### What Kubernetes offers

Say that your team is deploying an ordinary Rails application. You've run some calculations and determined that you need five instances of your app running at any given time, in order to handle external traffic.

If you're not running Kubernetes or a similar automated system, you might find the following scenario familiar:

{{< note >}}
1. One instance of your app (a complete machine instance or just a container) goes down.</li>

1. Because your team has monitoring set up, this pages the person on call.</li>

1. The on-call person has to go in, investigate, and manually spin up a new instance.</li>

1. Depending how your team handles DNS/networking, the on-call person may also need to also update the service discovery mechanism to point at the IP of the new Rails instance rather than the old.</li>
{{< /note >}}

This process can be tedious and also inconvenient, especially if (2) happens in the early hours of the morning!

**If you have Kubernetes set up, however, manual intervention is not as necessary.** The Kubernetes {{< link text="control plane" url="/docs/concepts/overview/components/#master-components" >}}, which runs on your cluster's master node, gracefully handles (3) and (4) on your behalf. As a result, Kubernetes is often referred to as a *self-healing* system.

There are two key parts of the control plane that facilitate this behavior: the *Kubernetes API server* and the *Controllers*.

#### Kubernetes API server

For Kubernetes to be useful, it needs to know *what* sort of cluster state you want it to maintain. Your YAML or JSON *configuration files* declare this desired state in terms of one or more API objects, such as {{< glossary_tooltip text="Deployments" term_id="deployment" >}}. To make updates to your cluster's state, you submit these files to the {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}} server (`kube-apiserver`).

Examples of state include but are not limited to the following:

* The applications or other workloads to run
* The container images for your applications and workloads
* Allocation of network and disk resources

Note that the API server is just the gateway, and that object data is actually stored in a highly available datastore called {{< link text="*etcd*" url="https://github.com/coreos/etcd" >}}. For most intents and purposes, though, you can focus on the API server. Most reads and writes to cluster state take place as API requests.

For more information, see {{< link text="Understanding Kubernetes Objects" url="/docs/concepts/overview/working-with-objects/kubernetes-objects/" >}}.

#### Controllers

Once you’ve declared your desired state through the Kubernetes API, the *controllers* work to make the cluster’s current state match this desired state.

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

By continuously looping, these controllers ensure the cluster can pick up new updates and avoid drifting from the desired state. These ideas are covered in more detail {{< link text="here" url="/docs/concepts/" >}}.

## Additional resources

The Kubernetes documentation is rich in detail. Here's a curated list of resources to help you start digging deeper.

### Basic concepts

* {{< link text="More about the components that run Kubernetes" url="/docs/concepts/overview/components/" >}}

* {{< link text="Understanding Kubernetes objects" url="/docs/concepts/overview/working-with-objects/kubernetes-objects/" >}}

* {{< link text="More about Node objects" url="/docs/concepts/architecture/nodes/" >}}

* {{< link text="More about Pod objects" url="/docs/concepts/workloads/pods/pod-overview/" >}}

### Tutorials

* {{< link text="Kubernetes Basics" url="/docs/tutorials/kubernetes-basics/" >}}

* {{< link text="Hello Minikube" url="/docs/tutorials/stateless-application/hello-minikube/" >}} *(Runs on Mac only)*

* {{< link text="Kubernetes object management" url="/docs/tutorials/object-management-kubectl/object-management/" >}}

### What's next

If you feel fairly comfortable with the topics on this page and want to learn more, check out the following user journeys:

* {{< link text="Intermediate App Developer" url="/docs/user-journeys/users/application-developer/intermediate/" >}} - Dive deeper, with the next level of this journey.
* {{< link text="Foundational Cluster Operator" url="/docs/user-journeys/users/cluster-operator/foundational/" >}} - Build breadth, by exploring other journeys.

{{% /capture %}}
