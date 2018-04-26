---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css, https://fonts.googleapis.com/icon?family=Material+Icons
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Intermediate
track: "USERS › APPLICATION DEVELOPER › INTERMEDIATE"
---
{% assign reference_docs_url = '/docs/reference/generated/kubernetes-api/' | append: site.latest %}

{% capture overview %}

{: .note }
  This page assumes that you've experimented with Kubernetes before. At this point, you should have basic experience interacting with a Kubernetes cluster (locally with Minikube, or elsewhere), and using API objects like Deployments to run your applications.<br><br>If not, you should review the [Beginner App Developer](/docs/user-journeys/users/application-developer/foundational/){:target="_blank"} topics first.

After checking out the current page and its linked sections, you should have a better understanding of the following:
* Additional Kubernetes workload patterns, beyond Deployments
* What it takes to make a Kubernetes application production-ready
* Community tools that can improve your development workflow

{% endcapture %}


{% capture body %}

## Learn additional workload patterns

As your Kubernetes use cases become more complex, you may find it helpful to familiarize yourself with more of the toolkit that Kubernetes provides. [Basic workload](/docs/user-journeys/users/application-developer/foundational/#section-2){:target="_blank"} objects like {% glossary_tooltip text="Deployments" term_id="deployment" %} make it straightforward to run, update, and scale applications, but they are not ideal for every scenario.

The following API objects provide functionality for additional workload types, whether they are *persistent* or *terminating*.

#### Persistent workloads

Like Deployments, these API objects run indefinitely on a cluster until they are manually terminated. They are best for long-running applications.

* **{% glossary_tooltip text="StatefulSets" term_id="statefulset" %}** - Like Deployments, StatefulSets allow you to specify that a certain number of replicas should be running for your application.

  {: .note }
  It's misleading to say that Deployments can't handle stateful workloads. Using {% glossary_tooltip text="PersistentVolumes" term_id="persistent-volume" %}, you can persist data beyond the lifecycle of any individual Pod in your Deployment.

     However, StatefulSets can provide stronger guarantees about "recovery" behavior than Deployments. StatefulSets maintain a sticky, stable identity for their Pods. The following table provides some concrete examples of what this might look like:

    | | Deployment | StatefulSet |
    |---|---|---|
    | **Example Pod name** | `example-b1c4` | `example-0` |
    | **When a Pod dies** | Reschedule on *any* node, with new name `example-a51z` | Reschedule on same node, as `example-0` |
    | **When a node becomes unreachable** | Pod(s) are scheduled onto new node, with new names | Pod(s) are marked as "Unknown", and aren't rescheduled unless the Node object is forcefully deleted |

     In practice, this means that StatefulSets are best suited for scenarios where replicas (Pods) need to coordinate their workloads in a strongly consistent manner. Guaranteeing an identity for each Pod helps avoid [split-brain](https://en.wikipedia.org/wiki/Split-brain_(computing)){:target="_blank"} side effects in the case when a node becomes unreachable ([network partition](https://en.wikipedia.org/wiki/Network_partition){:target="_blank"}). This makes StatefulSets a great fit for distributed datastores like Cassandra or Elasticsearch.


* **{% glossary_tooltip text="DaemonSets" term_id="daemonset" %}** - DaemonSets run continuously on every node in your cluster, even as nodes are added or swapped in. This guarantee is particularly useful for setting up global behavior across your cluster, such as:

  * Logging and monitoring, from applications like `fluentd`
  * Network proxy or [service mesh](https://www.linux.com/news/whats-service-mesh-and-why-do-i-need-one){:target="_blank"}


#### Terminating workloads

In contrast to Deployments, these API objects are finite. They stop once the specified number of Pods have completed successfully.

* **{% glossary_tooltip text="Jobs" term_id="job" %}** - You can use these for one-off tasks like running a script or setting up a work queue. These tasks can be executed sequentially or in parallel. These tasks should be relatively independent, as Jobs do not support closely communicating parallel processes. [Read more about Job patterns](/docs/concepts/workloads/controllers/jobs-run-to-completion/#job-patterns){:target="_blank"}.

* **{% glossary_tooltip text="CronJobs" term_id="cronjob" %}** - These are similar to Jobs, but allow you to schedule their execution for a specific time or for periodic recurrence. You might use CronJobs to send reminder emails or to run backup jobs. They are set up with a similar syntax as *crontab*.

#### Other resources

For more info, you can check out [a list of additional Kubernetes resource types](/docs/reference/kubectl/overview/#resource-types){:target="_blank"} as well as the [API reference docs]({{ reference_docs_url }}){:target="_blank"}.

There may be additional features not mentioned here that you may find useful, which are covered in the [full Kubernetes documentation](/docs/home/?path=browse){:target="_blank"}.

## Deploy a production-ready workload

The beginner tutorials on this site, such as the [Guestbook app](/docs/tutorials/stateless-application/guestbook/){:target="_blank"}, are geared towards getting workloads up and running on your cluster. This prototyping is great for building your intuition around Kubernetes! However, in order to reliably and securely promote your workloads to production, you need to follow some additional best practices.

#### Declarative configuration

You are likely interacting with your Kubernetes cluster via {% glossary_tooltip text="kubectl" term_id="kubectl" %}. kubectl can be used to debug the current state of your cluster (such as checking the number of nodes), or to modify live Kubernetes objects (such as updating a workload's replica count with `kubectl scale`).

When using kubectl to update your Kubernetes objects, it's important to be aware that different commands correspond to different approaches:
* [Purely imperative](/docs/tutorials/object-management-kubectl/imperative-object-management-command/){:target="_blank"}
* [Imperative with local configuration files](/docs/tutorials/object-management-kubectl/imperative-object-management-configuration/){:target="_blank"} (typically YAML)
* [Declarative with local configuration files](/docs/tutorials/object-management-kubectl/declarative-object-management-configuration/){:target="_blank"} (typically YAML)

There are pros and cons to each approach, though the declarative approach (such as `kubectl apply -f`) may be most helpful in production. With this approach, you rely on local YAML files as the source of truth about your desired state. This enables you to version control your configuration, which is helpful for code reviews and audit tracking.

For additional configuration best practices, familiarize yourself with [this guide](/docs/concepts/configuration/overview/){:target="_blank"}.

#### Security

You may be familiar with the *principle of least privilege*---if you are too generous with permissions when writing or using software, the negative effects of a compromise can escalate out of control. Would you be cautious handing out `sudo` privileges to software on your OS? If so, you should be just as careful when granting your workload permissions to the {% glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" %} server! The API server is the gateway for your cluster's source of truth; it provides endpoints to read or modify cluster state.

You (or your {% glossary_tooltip text="cluster operator" term_id="cluster-operator" %}) can lock down API access with the following:
* **{% glossary_tooltip text="ServiceAccounts" term_id="service-account" %}** - An "identity" that your Pods can be tied to
* **{% glossary_tooltip text="RBAC" term_id="rbac" %}** - One way of granting your ServiceAccount explicit permissions

For even more comprehensive reading about security best practices, consider checking out the following topics:
* [Authentication](/docs/admin/authentication/){:target="_blank"} (Is the user who they say they are?)
* [Authorization](/docs/admin/authorization/){:target="_blank"} (Does the user actually have permissions to do what they're asking?)

#### Resource isolation and management

If your workloads are operating in a *multi-tenant* environment with multiple teams or projects, your container(s) are not necessarily running alone on their node(s). They are sharing node resources with other containers which you do not own.

Even if your cluster operator is managing the cluster on your behalf, it is helpful to be aware of the following:
* **{% glossary_tooltip text="Namespaces" term_id="namespace" %}**, used for isolation
* **[Resource quotas](/docs/concepts/policy/resource-quotas/){:target="_blank"}**, which affect what your team's workloads can use
* **[Memory](/docs/tasks/configure-pod-container/assign-memory-resource/){:target="_blank"} and [CPU](/docs/tasks/configure-pod-container/assign-cpu-resource/){:target="_blank"} requests**, for a given Pod or container
* **[Monitoring](/docs/tasks/debug-application-cluster/resource-usage-monitoring/){:target="_blank"}**, both on the cluster level and the app level

This list may not be completely comprehensive, but many teams have existing processes that take care of all this. If this is not the case, you'll find the Kubernetes documentation fairly rich in detail.

## Improve your dev workflow with tooling

As an app developer, you'll likely encounter the following tools in your workflow.

#### kubectl

`kubectl` is a command-line tool that allows you to easily read or modify your Kubernetes cluster. It provides convenient, short commands for common operations like scaling app instances and getting node info. How does kubectl do this? It's basically just a user-friendly wrapper for making API requests. It's written using [client-go](https://github.com/kubernetes/client-go/#client-go){:target="_blank"}, the Go library for the Kubernetes API.

To learn about the most commonly used kubectl commands, check out the [kubectl cheatsheet](/docs/reference/kubectl/cheatsheet/){:target="_blank"}. It explains topics such as the following:
* [kubeconfig files](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/){:target="_blank"} - Your kubeconfig file tells kubectl what cluster to talk to, and can reference multiple clusters (such as dev and prod).
* [The various output formats available](/docs/reference/kubectl/cheatsheet/#formatting-output){:target="_blank"} - This is useful to know when you are using `kubectl get` to list information about certain API objects.

* [The JSONPath output format](/docs/reference/kubectl/jsonpath/){:target="_blank"} - This is related to the output formats above. JSONPath is especially useful for parsing specific subfields out of `kubectl get` output (such as the URL of a {% glossary_tooltip text="Service" term_id="service" %}).

* [`kubectl run` vs `kubectl apply`](/docs/reference/kubectl/conventions/){:target="_blank"} - This ties into the [declarative configuration](#declarative-configuration) discussion in the previous section.

For the full list of kubectl commands and their options, check out [the reference guide](/docs/reference/generated/kubectl/kubectl-commands){:target="_blank"}.

#### Helm

To leverage pre-packaged configurations from the community, you can use **{% glossary_tooltip text="Helm charts" term_id="helm-chart" %}**.

Helm charts package up YAML configurations for specific apps like Jenkins and Postgres. You can then  install and run these apps on your cluster with minimal extra configuration. This approach makes the most sense for "off-the-shelf" components which do not require much custom implementation logic.

For writing your own Kubernetes app configurations, there is a [thriving ecosystem of tools](https://docs.google.com/a/heptio.com/spreadsheets/d/1FCgqz1Ci7_VCz_wdh8vBitZ3giBtac_H8SBw4uxnrsE/edit?usp=drive_web){:target="_blank"} that you may find useful.

## Explore additional resources

#### References
Now that you're fairly familiar with Kubernetes, you may find it useful to browse the following reference pages. Doing so provides a high level view of what other features may exist:

* [Commonly used `kubectl` commands](/docs/reference/kubectl/cheatsheet/){:target="_blank"}
* [Kubernetes API reference]({{ reference_docs_url }}){:target="_blank"}
* [Standardized Glossary](/docs/reference/glossary/){:target="_blank"}

In addition, [the Kubernetes blog](http://blog.kubernetes.io/){:target="_blank"} often has helpful posts on Kubernetes design patterns and case studies.

#### What's next
If you feel fairly comfortable with the topics on this page and want to learn more, check out the following user journeys:
* [Advanced App Developer](/docs/user-journeys/users/application-developer/advanced/){:target="_blank"} - Dive deeper, with the next level of this journey.
* [Foundational Cluster Operator](/docs/user-journeys/users/cluster-operator/foundational/){:target="_blank"} - Build breadth, by exploring other journeys.
{% endcapture %}

{% include templates/user-journey-content.md %}
