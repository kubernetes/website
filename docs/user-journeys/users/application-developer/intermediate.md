---
approvers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css, https://fonts.googleapis.com/icon?family=Material+Icons
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Application Developer - Intermediate
track: "USERS › APPLICATION DEVELOPER › INTERMEDIATE"
---

{% capture overview %}

*This page assumes that you've experimented with Kubernetes before. At this point, you should have basic experience interacting with a Kubernetes cluster (locally with Minikube, or elsewhere), and using API objects like Deployments to run your applications.*

*If not, we recommend reviewing the [Beginner App Developer](/docs/user-journeys/users/application-developer/foundational/){:target="_blank"} topics first.*

After checking out the current page and its linked sections, you should have a better understanding of the following:
* Community tools that can improve your development workflow
* Additional Kubernetes workload patterns
* What it takes to make a Kubernetes application "production-ready"

{% endcapture %}


{% capture body %}

## Improve your dev workflow with tooling

The Kubernetes community

#### kubectl

`kubectl`, the command-line tool that allows you to easily read or modify your Kubernetes cluster, is basically just a user-friendly wrapper for the Kubernetes API. You're able to scale app instances and get node info because, under the hood, it's making API requests for you.

#### Helm

https://docs.google.com/a/heptio.com/spreadsheets/d/1FCgqz1Ci7_VCz_wdh8vBitZ3giBtac_H8SBw4uxnrsE/edit?usp=drive_web

## Beyond Deployments: More workload patterns

As you gain familiarity with Kubernetes and your use cases become more complex, you may find it helpful to familiarize yourself with more of the toolkit that Kubernetes provides (beyond the [common Kubernetes object types](/docs/user-journeys/users/application-developer/foundational/#section-2){:target="_blank"}).

#### Workloads

{% glossary_tooltip text="Deployments" term_id="deployment" %}, which you previously covered, are ideal for running, updating, and scaling stateless web servers (e.g. a Rails app). However, for other workloads, you may find other Kubernetes API resources more useful:
* **{% glossary_tooltip text="StatefulSets" term_id="statefulset" %}** - Because each Pod in a StatefulSet has a sticky identity, StatefulSets can be used to run datastores like Cassandra or Elasticsearch.
* **{% glossary_tooltip text="DaemonSets" term_id="daemonset" %}** - Because they run per node, DaemonSets are useful for logging and monitoring.
* **{% glossary_tooltip text="Jobs" term_id="job" %}** - You can use these for one-off tasks like running a script or setting up a work queue.
* **{% glossary_tooltip text="CronJobs" term_id="cronjob" %}** - These are similar to Jobs, but allow you to schedule their execution (similarly to *crontab*).

For more info, you can see the [full set of Kubernetes resource types](/docs/reference/kubectl/overview/#resource-types){:target="_blank"} and reference the [accompanying API spec](/docs/api-reference/v1.9/){:target="_blank"}.



There may be additional features not mentioned here that you may find useful, for that, we recommend searching or browsing through the [full Kubernetes documentation](/docs/home/#browsedocs){:target="_blank"}.

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

If your workloads are operating in a **multi-tenant** environment with multiple teams or projects, your container(s) are *not* necessarily running alone on their node(s). They are sharing node resources with other containers which you do not own.

Even if your cluster operator is managing the cluster on your behalf, it is helpful to be aware of the following:
* **{% glossary_tooltip text="Namespaces" term_id="namespace" %}**, used for isolation
* **[Resource quotas](/docs/concepts/policy/resource-quotas/){:target="_blank"}**, which affect what your team's workloads can use
* **[Memory](/docs/tasks/configure-pod-container/assign-memory-resource/){:target="_blank"} and [CPU](/docs/tasks/configure-pod-container/assign-cpu-resource/){:target="_blank"} requests**, for a given Pod or container

Although this list may not be completely comprehensive, the Kubernetes documentation is fairly rich and details other topics like [monitoring](/docs/tasks/debug-application-cluster/resource-usage-monitoring/){:target="_blank"} and [Ingress](/docs/concepts/services-networking/ingress/){:target="_blank"}. On the other hand, your team may already have existing processes that take care of all of the topics just covered!

## Additional resources

Now that you're fairly familiar with Kubernetes, you may find it useful to browse the following reference pages to get a high level view of what other features may exist:

* [Commonly used `kubectl` commands](/docs/reference/kubectl/cheatsheet/){:target="_blank"}
* [Kubernetes API reference](/docs/reference/generated/kubernetes-api/v1.9/){:target="_blank"}
* [Kubernetes Client Libraries](/docs/reference/client-libraries/){:target="_blank"}

In addition, [the Kubernetes blog](http://blog.kubernetes.io/){:target="_blank"} often has helpful posts on Kubernetes design patterns and case studies.

### What's next
If you feel fairly comfortable with the topics on this page and want to learn more, check out the following user journeys:
* [Advanced App Developer](/docs/user-journeys/users/application-developer/advanced/){:target="_blank"} - Dive deeper, with the next level of this journey.
* [Foundational Cluster Operator](/docs/user-journeys/users/cluster-operator/foundational/){:target="_blank"} - Build breadth, by exploring other journeys.
{% endcapture %}

{% include templates/user-journey-content.md %}
