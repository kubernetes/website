---
approvers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css, https://fonts.googleapis.com/icon?family=Material+Icons
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Application Developer - Advanced
track: "USERS › APPLICATION DEVELOPER › ADVANCED"
---

{% capture overview %}

*This page assumes that you're familiar with core Kubernetes concepts, and are comfortable deploying your own apps. If not, we recommend reviewing the [Intermediate App Developer](/docs/user-journeys/users/application-developer/intermediate/){:target="_blank"} topics first.*

After checking out the current page and its linked sections, you should have a better understanding of the following:
* Advanced features that you can leverage in your application
* The various ways of extending the Kubernetes API

{% endcapture %}


{% capture body %}

## Deploy an application with advanced features

Now you know the set of API objects that Kubernetes provides. Understanding the difference between a DaemonSet and a Deployment is oftentimes sufficient for app deployment. That being said, it's also worth familiarizing yourself with Kubernetes's lesser known features. They can be quite powerful when applied to the right use cases.

#### Container-level features

As you may know, it's an *antipattern* to migrate an entire app (e.g. containerized Rails app, MySQL database, and all) into a single Pod. That being said, there are some very useful patterns that go beyond a 1:1 correspondence between a container and its Pod:
* **Sidecar container**: Although your Pod should still have a single "main" container, you can add a secondary container that acts as a helper (see a [logging example](/docs/concepts/cluster-administration/logging/#using-a-sidecar-container-with-the-logging-agent){:target="_blank"}). Two containers within a single Pod can communicate [via a shared volume](/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/){:target="_blank"}.
* **Init containers**: "Init containers" run before any of a Pod's "app containers" (such as main and sidecar containers). [Read more](/docs/concepts/workloads/pods/init-containers/){:target="_blank"}, see them applied to an [nginx server example](/docs/tasks/configure-pod-container/configure-pod-initialization/){:target="_blank"}, and [learn how to debug these containers](/docs/tasks/debug-application-cluster/debug-init-containers/){:target="_blank"}.

#### Pod configuration

Usually, you use {% glossary_tooltip text="labels" term_id="labels" %} and {% glossary_tooltip text="annotations" term_id="annotation" %} to attach metadata to your resources. To inject data into your resources, you'd likely create {% glossary_tooltip text="ConfigMaps" term_id="configmap" %} (for nonconfidential data) or {% glossary_tooltip text="Secrets" term_id="secret" %} (for confidential data).

Below are some other, lesser-known ways of configuring your resources' Pods:

* **Taints and Tolerations** - These provide a way for nodes to "attract" or "repel" your Pods. They are often used when an application needs to be deployed onto specific hardware, such as GPUs for scientific computing. [Read more](/docs/concepts/configuration/taint-and-toleration/){:target="_blank"}.
* **Downward API** - This allows your containers to consume information about themselves or the cluster, without being overly coupled to the Kubernetes API server. This can be achieved with [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/){:target="_blank"} or [DownwardAPIVolumeFiles](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/){:target="_blank"}.
* **Pod Presets** - Normally, to mount runtime requirements (such as environmental variables, ConfigMaps, and Secrets) into a resource, you specify them in the resource's configuration file. [PodPresets](/docs/concepts/workloads/pods/podpreset/) allow you to dynamically inject these requirements instead, when the resource is created. This allows team A to mount any number of new Secrets into the resources created by teams B and C, without requiring action from B and C. [See an example](/docs/tasks/inject-data-application/podpreset/).

#### Additional API Objects

* **{% glossary_tooltip text="Horizontal Pod Autoscaler (HPA)" term_id="horizontal-pod-autoscaler" %}** - These resources are a great way to automate the process of scaling your application when CPU usage or other [custom metrics](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/custom-metrics-api.md) spike. [See an example](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) to understand how HPAs are set up. *NOTE: Before setting up an HPA, check to see if this task is the responsibility of your organization's {% glossary_tooltip text="cluster operators" term_id="cluster-operator" %}.*
* **Federated cluster objects** - If you are running an application on multiple Kubernetes clusters using *federation*, you need to deploy the federated version of the standard Kubernetes API objects. For reference, check out the guides for setting up [Federated ConfigMaps](/docs/tasks/administer-federation/configmap/) and [Federated Deployments](/docs/tasks/administer-federation/deployment/).

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


{: .note yo }
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

#### Service Catalog

...

## Additional resources


* [Kubernetes Client Libraries](/docs/reference/client-libraries/){:target="_blank"}

#### What's next
Congrats on completing the Application Developer user journey!

If you are interested in learning more about the inner workings of Kubernetes (e.g. networking), consider checking out the [Cluster Operator journey](/docs/user-journeys/users/cluster-operator/foundational/){:target="_blank"}

{% endcapture %}

{% include templates/user-journey-content.md %}
