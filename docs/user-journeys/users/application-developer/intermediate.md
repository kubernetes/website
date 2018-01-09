---
approvers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css, https://fonts.googleapis.com/icon?family=Material+Icons
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Application Developer - Intermediate
track: "USERS > APPLICATION DEVELOPER > INTERMEDIATE"
---

{% capture overview %}

*This page assumes that you've had a chance to experiment with Kubernetes and deploy some basic applications. At this point, you should have basic experience with the following:*
* *A working Kubernetes cluster (locally with Minikube, with a cloud provider, or somewhere else)*
* *Kubernetes API objects ({% glossary_tooltip text="Deployments" term_id="deployment" %}, {% glossary_tooltip text="ConfigMaps" term_id="configmap" %}, etc)*
* *`kubectl`, the command-line tool for interacting with your cluster*

*If not, we recommend reviewing the [Beginner App Developer](/docs/user-journeys/users/application-developer/foundational/){:target="_blank"} topics.*

After checking out this page and its linked sections, you should have a better understanding of additional Kubernetes workload patterns, how to extend the Kubernetes API if these patterns are not sufficient for your use cases, and what it takes to make a Kubernetes workload "production-ready".

{% endcapture %}


{% capture body %}

## Beyond Deployments: More workload patterns

As you gain familiarity with Kubernetes and your use cases become more complex, you may find it helpful to familiarize yourself with more of the toolkit that Kubernetes provides (beyond the [common Kubernetes object types](/docs/user-journeys/users/application-developer/foundational/#section-2){:target="_blank"}).

#### Workloads

{% glossary_tooltip text="Deployments" term_id="deployment" %}, which you previously covered, are ideal for running, updating, and scaling stateless web servers (e.g. a Rails app). However, for other workloads, you may find other Kubernetes API resources more useful:
* **{% glossary_tooltip text="StatefulSets" term_id="statefulset" %}** - Because each Pod in a StatefulSet has a sticky identity, StatefulSets can be used to run datastores like Cassandra or Elasticsearch.
* **{% glossary_tooltip text="DaemonSets" term_id="daemonset" %}** - Because they run per node, you may find DaemonSets useful for logging and monitoring.
* **{% glossary_tooltip text="Jobs" term_id="job" %}** - You can use these for one-off tasks like running a script or setting up a work queue.
* **{% glossary_tooltip text="CronJobs" term_id="cronjob" %}** - These are similar to Jobs, but allow you to schedule their execution (similarly to *crontab*).

For more info, you can see the [full set of Kubernetes resource types](/docs/reference/kubectl/overview/#resource-types){:target="_blank"} and reference the [accompanying API spec](/docs/api-reference/v1.9/){:target="_blank"}.

#### Containers

As you may know, it's an *antipattern* to migrate an entire app (e.g. containerized Rails app, MySQL database, and all) into a single Pod. That being said, you can leverage some powerful patterns that go beyond a 1:1 correspondence between a container and its Pod:
* **Sidecar container**: Although your Pod should still have a single "main" container, you can add a secondary container that acts as a helper (see a [logging example](/docs/concepts/cluster-administration/logging/#using-a-sidecar-container-with-the-logging-agent){:target="_blank"}). Two containers within a single Pod can communicate [via a shared volume](/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/){:target="_blank"}.
* **Init containers**: "Init containers" run before any of a Pod's "app containers" (e.g. main and sidecar containers). [Read more](/docs/concepts/workloads/pods/init-containers/){:target="_blank"}, [see an example](/docs/tasks/configure-pod-container/configure-pod-initialization/){:target="_blank"}, and [learn how to debug them](/docs/tasks/debug-application-cluster/debug-init-containers/){:target="_blank"}.

#### Configuration

Kubernetes provides ways to attach metadata or inject data into your resources:
* **Taints and Tolerations** - These provide a way for nodes to "attract" or "repel" your Pods. [Read more](/docs/concepts/configuration/taint-and-toleration/){:target="_blank"}.
* **Downward API** - This allows your containers to consume information about themselves or the cluster, without being overly coupled to the Kubernetes API server. This can be achieved with [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/){:target="_blank"} or [DownwardAPIVolumeFiles](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/){:target="_blank"}.
* **ConfigMaps** - This was mentioned in the beginner section, and is worth another highlight because it is a common way to decouple runtime-specific parameters from your container images. [Read more](/docs/tasks/configure-pod-container/configure-pod-configmap/){:target="_blank"}.

There may be additional features not mentioned here that you may find useful, for that, we recommend searching or browsing through the [full Kubernetes documentation](/docs/home/#browsedocs){:target="_blank"}.

## Extend the Kubernetes API

Kubernetes is designed with extensibility in mind. If the API resources and features mentioned above are not enough for your needs, there are ways to customize its behavior *without* having to modify core Kubernetes code.

#### Understand Kubernetes's default behavior

Before making any customizations, it's important that you understand how Kubernetes achieves its "self-healing" behavior. *Feel free to skip this part if you're already familiar.*

Although Deployments and Secrets may seem quite different, the following concepts are true for *any* type of Kubernetes object:

* **Kubernetes objects are a way of storing structured data about your cluster.**
  In the case of Deployments, this data represents *desired state* (e.g. "How many replicas should be running?"), but it can also be general metadata.
* **Kubernetes objects are modified via the {% glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" %}**.
  In other words, you can make `GET` and `POST` requests to a specific resource path (e.g. `<api-server-url>/api/v1/namespaces/default/deployments`) to read and write the corresponding object type.
* **By leveraging the [Controller pattern](/docs/concepts/api-extension/custom-resources/#custom-controllers){:target="_blank"}, Kubernetes objects can be used to enforce desired state**. For simplicity, you can think of the Controller pattern as the following continuous loop:
    1. Check current state (number of replicas, container image, etc)
    2. Compare current state to desired state
    3. Update if there's a mismatch

  These states are obtained from the Kubernetes API.

(*Note that not all Kubernetes objects need to have a Controller. Though Deployments trigger the cluster to "do things", ConfigMaps act purely as storage.*)

#### Create Custom Resources

Based on the ideas above, there is no reason you can't define a completely new [Custom Resource](/docs/concepts/api-extension/custom-resources/#custom-resources){:target="_blank"} that is just as legitimate as a Deployment. For example, you might want to define a `Backup` object for periodic backups, if `CronJobs` don't provide all the functionality you need.

There are two main ways of setting up custom resources:
1. **Custom Resource Definitions (CRDs)** - See [an example](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/){:target="_blank"}.
2. **API aggregation** - This requires some [pre-configuration](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/){:target="_blank"} before you actually [set up a separate, extension API server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/){:target="_blank"}.

Note that unlike standard Kubernetes objects, which rely on the built-in [`kube-controller-manager`](/docs/reference/generated/kube-controller-manager/){:target="_blank"}, you'll need to write and run your own [custom controllers](https://github.com/kubernetes/sample-controller).

You may also find the following info helpful:
* [How to know if custom resources are right for your use case](/docs/concepts/api-extension/custom-resources/#should-i-use-a-configmap-or-a-custom-resource){:target="_blank"}
* [How to decide between CRDs and API aggregation](/docs/concepts/api-extension/custom-resources/#choosing-a-method-for-adding-custom-resources){:target="_blank"}
* [Other points of extensibility within Kubernetes](/docs/concepts/overview/extending/){:target="_blank"}

## Deploy a production-ready workload

The beginner tutorials on this site (e.g. [Guestbook](/docs/tutorials/stateless-application/guestbook/){:target="_blank"}) are geared towards getting workloads up-and-running on your cluster. This sort of prototyping is great for building your intuition around Kubernetes! However, in order to reliably and securely promote your workloads to production, you'll need to follow some additional best practices.

#### Declarative configuration

You are likely interacting with your Kubernetes cluster via {% glossary_tooltip text="kubectl" term_id="kubectl" %}. `kubectl` can be used to debug the current state of your cluster (such as checking the number of nodes), or to update the configurations of actual Kubernetes objects (e.g. updating the replica count with `kubectl autoscale`).

When using `kubectl` to update your Kubernetes object configurations, it's important to be aware that different `kubectl` commands correspond to different approaches:
* [Purely imperative](/docs/tutorials/object-management-kubectl/imperative-object-management-command/){:target="_blank"}
* [Imperative with local configuration files](/docs/tutorials/object-management-kubectl/imperative-object-management-configuration/){:target="_blank"} (typically YAML)
* [Declarative with local configuration files](/docs/tutorials/object-management-kubectl/declarative-object-management-configuration/){:target="_blank"} (typically YAML)

There are pros and cons to each approach, though the *declarative approach* (e.g. `kubectl apply -f`) may be most helpful in production. Relying on local YAML files as the source of truth allows you to track and version control your configuration.

For additional configuration best practices, familiarize yourself with [this guide](/docs/concepts/configuration/overview/){:target="_blank"}.

To leverage pre-packaged configurations from the community, you may also be interested in checking out **{% glossary_tooltip text="Helm charts" term_id="helm-chart" %}**.

#### Security

You may be familiar with the principle of least privilege---if you are too generous with permissions when writing or using software, during a compromise, the negative effects can escalate out of control. Would you be cautious handing out `sudo` privileges to software on your OS? If so, you should be just as careful when granting your workload permissions to the Kubernetes API server (which is your cluster's source of truth!).

You (or your {% glossary_tooltip text="cluster operator" term_id="cluster-operator" %}) can take care of this with the following:
* **{% glossary_tooltip text="ServiceAccounts" term_id="service-account" %}** - An "identity" that your Pods can be tied to
* **{% glossary_tooltip text="RBAC" term_id="rbac" %}** - One way of granting your ServiceAccount permissions

[Authentication](/docs/admin/authentication/){:target="_blank"} and [Authorization](/docs/admin/authorization/){:target="_blank"} cover this topic more comprehensively, but are not mandatory reads.

#### Resource isolation and management

If your workloads may be operating in a **multi-tenant** environment with multiple teams or projects, your container(s) are *not* necessarily running alone on their node(s). They are sharing node resources with other containers which you do not own.

Even if your cluster operator is managing the cluster on your behalf, it is helpful to be aware of the following:
* **{% glossary_tooltip text="Namespaces" term_id="namespace" %}**, used for isolation
* **[Resource quotas](/docs/concepts/policy/resource-quotas/){:target="_blank"}**, which may affect what your team's workloads can use
* **[Memory](/docs/tasks/configure-pod-container/assign-memory-resource/){:target="_blank"} and [CPU](/docs/tasks/configure-pod-container/assign-cpu-resource/){:target="_blank"} requests**, for a given Pod or container

Although this list may not be completely comprehensive, the Kubernetes documentation is fairly rich and details other topics like [monitoring](/docs/tasks/debug-application-cluster/resource-usage-monitoring/){:target="_blank"} and [Ingress](/docs/concepts/services-networking/ingress/){:target="_blank"}. On the other hand, your team may already have existing processes that take care of all of the topics just covered!

## Additional resources

Now that you're fairly familiar with Kubernetes, you may find it useful to browse the following reference pages to get a high-level view of what other features may exist:

* [Commonly used `kubectl` commands](/docs/reference/kubectl/cheatsheet/){:target="_blank"}
* [Kubernetes API reference](/docs/reference/generated/kubernetes-api/v1.9/){:target="_blank"}
* [Kubernetes Client Libraries](/docs/reference/client-libraries/){:target="_blank"}

Also, although it is not official documentation, [the Kubernetes blog](http://blog.kubernetes.io/){:target="_blank"} often has helpful posts on Kubernetes design patterns and case studies.

{% endcapture %}

{% include templates/user-journey-content.md %}
