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

With modern web services, users expect applications to be available 24/7, and developers expect to deploy new versions of those applications several times a day. Kubernetes helps package software to serve these goals:


  - Enables applications to be released and updated in an easy and fast way without downtime
  * Ensures that containerized applications run where and when you want
  * Helps the applications to find the resources and tools they need to work


{{% /capture %}}


{{% capture body %}}
## Try it out
Try our virtual terminal in your web browser to run Minikube. Minikube is a small-scale local deployment of Kubernetes that can run anywhere.
* After you run these commands, you will learn to:
* Create a cluster
* Deploy a containerized application on a cluster
* Expose the app
* Scale the deployment
* Update the containerized application with a new software version
* Debug the containerized application

<div id="terminal_simulator"
  data-embed="kt-app"
  data-url="https://www.gstatic.com/cloud-site-ux/kubernetes-terminal.min.html">
</div>

{{< tabs name="test_drive_k8s" >}}
{{% tab name="1. Deploy" %}}

1. Deploy a sample app.

    ```
    kubectl run kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1 --port=8080
    ```

1. Verify the deployment.

    ```
    kubectl get deployments
    ```

1. View the app deployment.

    ```
    curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME/proxy/
    ```

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu nibh ultrices, fermentum dui a, rhoncus arcu. Aliquam sed ultricies est, quis rhoncus sapien. Aliquam at risus sed odio maximus rhoncus et et tellus. Vivamus euismod dui ac ligula iaculis, in facilisis nulla tincidunt. Ut consequat metus sed turpis tempus, vel fermentum mi lacinia. Vestibulum orci lacus, tincidunt sit amet aliquam at, venenatis vitae metus. Aenean molestie metus at dui mollis congue. Aliquam ac venenatis ante. Maecenas convallis viverra sapien ac imperdiet. Proin eget erat venenatis, mollis nunc at, facilisis metus.

{{% /tab %}}
{{< tab name="2. Scale" >}}

1. Scale the app to 3 pods.

    ```
    kubectl scale deployment app --replicas 3
    ```

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu nibh ultrices, fermentum dui a, rhoncus arcu.

{{< /tab >}}
{{< tab name="3. Expose" >}}

1. Expose the app

    ```
    kubectl expose deployment app --port 80 --type=LoadBalancer
    ```

### H3

This is in an H3 section.


#### H4

This is in an H4 section.


##### H5

This is in an H5 section.

###### H6

This is in an H6 section.


1. Create a new service

    ```
    kubectl get pods
    ```
<<<<<<< HEAD




<pre><code>kubectl get pods</code></pre>
<ul><li>I am unordered list.</li></ul>
=======
**bold**
_italic_
    - ***bold italic***
    - ~~strikethrough~~
    - <u>underline</u>
    - _<u>underline italic</u>_
    - **<u>underline bold</u>**
    - ***<u>underline bold italic</u>***
    - `monospace text`
    - **`monospace bold`**

>>>>>>> no message



Mauris sagittis nunc mi, eget dapibus sem sagittis sit amet. In ut massa dui. Etiam efficitur varius est egestas convallis. Aenean facilisis nisi vel arcu hendrerit sodales. Maecenas sed semper ipsum. Duis aliquam nunc ac erat pellentesque, vel cursus lectus consequat. Aenean condimentum rhoncus felis a venenatis. Aenean commodo odio id mi sollicitudin, nec accumsan sapien fermentum. Cras consectetur ligula ac nulla pretium, sit amet placerat nisl ultricies. Praesent fermentum venenatis tortor.

{{< /tab >}}
{{< tab name="4. Update" >}}

Cras eget orci sagittis, lacinia urna eleifend, sodales tortor. Praesent velit dui, tincidunt at molestie eu, porta a libero. Sed tincidunt laoreet arcu. Donec sed quam dui. Maecenas dignissim porta mauris, nec vehicula purus luctus sit amet. Nunc venenatis diam lorem, semper accumsan ligula ornare vitae. Fusce velit ex, commodo sed tincidunt sed, blandit ut nibh. Ut id urna felis. Duis ultrices dignissim libero, nec sodales felis. Duis a enim massa. Vivamus lobortis erat nec orci rutrum, sit amet viverra nunc posuere. Ut mattis suscipit sodales. Cras interdum convallis sodales. Quisque in mollis nunc.

{{< /tab >}}
{{< /tabs >}}

## Understanding Kubernetes basics



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

* *(Optional)* {{< link text="Install Docker" url="/docs/setup/independent/install-kubeadm/#installing-docker" >}} if you plan to run your Minikube cluster as part of a local development environment.

   Minikube includes a Docker daemon, but if you're developing applications locally, you'll want an independent Docker instance to support your workflow. This allows you to create {{< glossary_tooltip text="containers" term_id="container" >}} and push them to a container registry.

   {{< note  >}}
   Version 1.12 is recommended for full compatibility with Kubernetes, but a few other versions are tested and known to work.
   {{< /note  >}}

You can get basic information about your cluster with the commands `kubectl cluster-info` and `kubectl get nodes`. However, to get a good idea of what's really going on, you need to deploy an application to your cluster. This is covered in the next section.

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

You can read more about the Kubernetes API {{< link text="here" url="/docs/concepts/overview/working-with-objects/kubernetes-objects/" >}}.

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

By continuously looping, these controllers ensure the cluster can pick up new updates and avoid drifting from the desired state. These ideas are covered in more detail {{< link text="here" url="https://kubernetes.io/docs/concepts/" >}}.

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

* {{< link text="Kubernetes 101" url="/docs/user-guide/walkthrough/" >}}

* {{< link text="Kubernetes 201" url="/docs/user-guide/walkthrough/k8s201/" >}}

* {{< link text="Kubernetes object management" url="/docs/tutorials/object-management-kubectl/object-management/" >}}

### What's next

If you feel fairly comfortable with the topics on this page and want to learn more, check out the following user journeys:

* {{< link text="Intermediate App Developer" url="/docs/user-journeys/users/application-developer/intermediate/" >}} - Dive deeper, with the next level of this journey.
* {{< link text="Foundational Cluster Operator" url="/docs/user-journeys/users/cluster-operator/foundational/" >}} - Build breadth, by exploring other journeys.

{{% /capture %}}
