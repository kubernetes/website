---
---

{% assign concept="Pod" %}

{% capture what_is %}
A pod is the vehicle for running containers in Kubernetes. A pod consists of:

- One or more containers
- An IP address that is unique within the cluster
- Optionally: Environment variables, storage volumes, and enterprise features (such as health checking)

TODO: Mention that these things are shared amongst containers in the pod

TODO: Containers within a pod share an IP address and port space, and can find each other via localhost, or interprocess communications (such as semaphores)

![Pod diagram](/images/docs/pod-overview.svg){: style="max-width: 25%" }
{% comment %}https://drive.google.com/open?id=1pQe4-s76fqyrzB8f3xoJo4MPLNVoBlsE1tT9MyLNINg{% endcomment %}

{% endcapture %}

{% capture when_to_use %}
Pods are used any time you need a container to be run. However, they are rarely created by a user, and are instead automatically created by controllers such as jobs, replication controllers, deployments, daemon set. The following table describes the strategy each controller uses to create pods.


| Controller | Usage Strategy |
|------------|----------------|
| Deployment | For running pods as a continuous and healthy application |
| Replication Controller | Used for the same purpose as Deployments (superseded Replication Controllers) |
| Jobs | For running pods "to completion" (which are then shut down) |
| Daemon Set | Mainly for performing operations on any nodes that match given parameters | 

{% endcapture %}

{% capture when_not_to_use %}
Do not use pods directly. Pods should always be managed by a controller.
{% endcapture %}

{% capture status %}
GA as of 1.0
{% endcapture %}

{% capture usage %}
Pods are defined when configuring the controller of your choice. In these controller specifications,
the parts that define the contents of the pod are inside the `template:` section.

{% capture tabspec %}controllers
Deployment,yaml,deployment.yaml,/docs/pods/deployment.yaml
Job,yaml,job.yaml,/docs/pods/job.yaml
ReplicationController,yaml,rc.yaml,/docs/pods/rc.yaml{% endcapture %}
{% include tabs.html %}


{% endcapture %}

{% include templates/concept-overview.md %}