---
approvers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css, https://fonts.googleapis.com/icon?family=Material+Icons
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Application Developer - Foundational
track: "USERS > APPLICATION DEVELOPER > FOUNDATIONAL"
---

{% capture overview %}
If you're an application developer looking to get started with Kubernetes, this page and its linked topics introduce you to foundational concepts and tasks. The focus is on a development workflow -- check out other user journeys to learn about managing production clusters, or providing high availability (HA) for critical application deployments.

In a production workflow, it's common to assign the tasks and responsibilities of setting up and maintaining a Kubernetes cluster to the distinct roles of cluster administrator and cluster user. These roles might or might not be assigned to different individuals or teams. As an application developer, you don't need to learn all the intricacies of cluster administration. But you do need to learn the basics, and to understand how certain aspects of administering a cluster can affect development, testing, and deployment at the application level.

{% endcapture %}


{% capture body %}
## Set up Kubernetes

One good way to learn Kubernetes basics is with Minikube, which lets you create a simple single-node cluster with all core Kubernetes components. If you install locally, you may find that your cluster is sufficient for local application development. Installing Minikube locally is also a good idea if you want to continue exploring in a persistent environment that you can come back to and change.

If you're brand new to Kubernetes, you might want to try out the [Katacoda Kubernetes Playground](https://www.katacoda.com/courses/kubernetes/playground), which provides a set of web-based tutorials complete with their own Kubernetes environment.

If you want to explore further, the web-based [Play with Kubernetes](http://labs.play-with-k8s.com/) gives you a less structured Kubernetes environment on the web.

Before you install Minikube:

* [Install a hypervisor if you don't have one already](/docs/tasks/tools/install-minikube/#install-a-hypervisor):
    * For OS X, xhyve, VirtualBox, or VMWare Fusion
    * For Linux, VirtualBox or KVM
    * For Windows, VirtualBox or Hyper-V
* [Install kubectl, the Kubernetes command-line tool](/docs/tasks/tools/install-kubectl/). Note that when you start Minikube, your kubectl is automatically configured to communicate with the server. You should therefore skip kubectl configuration at this point.
* (optional) If you plan to run your Minikube cluster as part of a local development environment, consider [installing Docker](/docs/setup/independent/install-kubeadm/#installing-docker). Minikube includes a Docker daemon, but to create and push containers as part of your development workflow, you'll want an independent Docker instance. Note that version 1.12 is recommended for full compatibility with Kubernetes, but a few other versions are tested and known to work.

Now you can [install Minikube](/docs/tasks/tools/install-minikube/).

You can now get basic information about your cluster with the command `kubectl get nodes`. And you can [view your cluster's Pods and Nodes](/docs/tutorials/kubernetes-basics/explore-intro/). But to get a good idea of what's really going on, you need to deploy an application to your cluster.

## Deploy, scale, and update an application

You can deploy a simple application in Kubernetes with a Deployment manifest, also called a configuration or config file. The manifest is written in YAML or JSON, and describes the desired state of the application and related resources as Kubernetes should maintain them.

* [Get started by deploying a simple nginx server](/docs/tasks/run-application/run-stateless-application-deployment/). Nginx is often used as the web server to help provide ingress from outside your cluster.
* By itself, a Deployment can't provide ingress. The simplest way to configure ingress is to [create a Service](/docs/tasks/access-application-cluster/service-access-application-cluster/) of type `NodePort`, which takes care of routing external traffic to your cluster over a dynamically allocated IP address and port. The service also takes care of load balancing.
* Optionally, learn more about providing external access:
    * [More about Deployments](/docs/concepts/workloads/controllers/deployment/).
    * [More about Services](/docs/concepts/services-networking/service/).
    * [Learn more about Ingress](/docs/concepts/services-networking/ingress/).

You'll also want to think about storage. Kubernetes provides different types of storage for different storage needs:

* A Volume lets you define storage for your cluster that is tied to the lifecycle of a Pod. It is therefore more persistent than container storage. Learn [how to configure volume storage](/docs/tasks/configure-pod-container/configure-volume-storage/), or [read more about about volume storage](/docs/concepts/storage/volumes/).
* A PersistentVolume and PersistentVolumeClaim let you define storage at the cluster level. Typically a cluster administrator defines the PersistentVolume objects for the cluster, and cluster users (application developers, you) define the PersistentVolumeClaim objects that your application requires. Learn [how to set up persistent storage for your cluster](/docs/tasks/configure-pod-container/configure-persistent-volume-storage/) or [read more about persistent volumes](/docs/concepts/storage/persistent-volumes/).

Labels let you specify identifying information for Kubernetes objects, such as pods, that you define. This information is entirely user-defined, and is used to sort and select sets of objects.

* When you [create a basic nginx Deployment](/docs/tasks/run-application/run-stateless-application-deployment/), you specify the `app: nginx` label as part of the template metadata. The `matchLabels` selector then specifies this label as part of the spec.
* [More about labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
* You also specify labels to customize your cluster, for example by [assigning pods to nodes](/docs/concepts/configuration/assign-pod-node/).

To provide configuration data for your application, you can specify Kubernetes environment variables as part of the container definition in your Deployment manifest. But to manage configuration data without having to rebuild your container or modify your Deployment, you can also [use a ConfigMap](/docs/tasks/configure-pod-container/configmap/) for non-confidential data, or [a Secret](/docs/tasks/inject-data-application/distribute-credentials-secure/) for confidential data.

Note that ingress provides networking between your cluster and the outside world. A production cluster should also configure networking between containers and between nodes, which is [defined in a network policy](/docs/tasks/administer-cluster/declare-network-policy/).

## Understand Kubernetes basics

To work with Kubernetes, you describe your cluster's desired state in terms of Kubernetes API objects. Cluster state includes but is not limited to the following information:

* The applications or other workloads to run
* The container images for your applications and workloads
* Allocation of network and disk resources

Once you’ve set your desired state, the Kubernetes Control Plane works to make the cluster’s current state match the desired state. To do so, Kubernetes performs a variety of tasks automatically–such as starting or restarting containers, scaling the number of replicas of a given application, and more. The Kubernetes Control Plane consists of a collection of processes running on your cluster:

* The Kubernetes Master is a collection of three processes that run on a single node in your cluster, which is designated as the master node. Those processes are: kube-apiserver, kube-controller-manager and kube-scheduler.
* Each individual non-master node in your cluster runs two processes:
    * kubelet, which communicates with the Kubernetes Master.
    * kube-proxy, a network proxy which reflects Kubernetes networking services on each node.


## Additional resources

TODO More tutorials (links to items in tutorials section of docs)

TODO Links to closely related user journeys (when we have them)

[https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/](https://kubernetes.io/docs/concepts/cluster-administration/manage-deployment/)

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id felis non enim faucibus lacinia. Aliquam massa mauris, interdum a ex ut, sagittis rutrum nulla. In pellentesque est at molestie fringilla. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec eu mi at velit lacinia venenatis ac nec sem. In volutpat pellentesque dui ut commodo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis sollicitudin eleifend felis non facilisis. Pellentesque leo urna, congue id auctor non, varius a nunc. Duis ultrices, odio ut hendrerit suscipit, nisi mauris dignissim mauris, nec bibendum ante neque ut augue. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam condimentum libero sit amet rutrum fermentum. Proin posuere condimentum odio. Aenean volutpat, ex vel tincidunt tincidunt, massa odio condimentum lectus, vel iaculis libero dolor in nisi.

Curabitur bibendum tempor mi, vel lacinia nisi vulputate ac. Nulla dignissim consectetur nisl nec tincidunt. Etiam pharetra facilisis sapien, non gravida velit fermentum sed. Ut ac ultrices nunc, in vestibulum urna. Suspendisse accumsan euismod felis, sit amet rhoncus neque volutpat luctus. Aliquam tincidunt pellentesque mauris, sed tempus diam. Mauris in elit eget justo tempor suscipit.

Aenean suscipit arcu ac leo tincidunt tempus. Donec maximus tellus libero, ac ullamcorper magna lobortis ac. Integer mollis nisl vitae magna gravida, nec ornare ex consectetur. Sed mattis tincidunt nisi, at consequat tellus malesuada non. Integer vel semper nisi, ut fringilla velit. Nam felis ex, congue non dui vitae, sollicitudin convallis turpis. Phasellus porttitor maximus turpis, in varius nibh fermentum aliquam. Cras finibus lacus non diam porttitor porttitor. Nulla fringilla sagittis nibh nec condimentum. Duis egestas mauris nec dolor hendrerit ullamcorper sit amet in mi. Phasellus sollicitudin justo diam.

{% endcapture %}


{% include templates/user-journey-content.md %}
