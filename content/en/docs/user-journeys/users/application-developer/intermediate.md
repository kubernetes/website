---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Intermediate
track: "USERS › APPLICATION DEVELOPER › INTERMEDIATE"
content_template: templates/user-journey-content
---


{{% capture overview %}}

{{< note  >}}
  This page assumes that you've experimented with Kubernetes before. At this point, you should have basic experience interacting with a Kubernetes cluster (locally with Minikube, or elsewhere), and using API objects like Deployments to run your applications.<br><br>If not, you should review the {{< link text="Beginner App Developer" url="/docs/user-journeys/users/application-developer/foundational/" >}} topics first.
{{< /note  >}}
After checking out the current page and its linked sections, you should have a better understanding of the following:

* Additional Kubernetes workload patterns, beyond Deployments
* What it takes to make a Kubernetes application production-ready
* Community tools that can improve your development workflow

{{% /capture %}}


{{% capture body %}}

## Learn additional workload patterns

As your Kubernetes use cases become more complex, you may find it helpful to familiarize yourself with more of the toolkit that Kubernetes provides. {{< link text="Basic workload" url="/docs/user-journeys/users/application-developer/foundational/#section-2" >}} objects like {{< glossary_tooltip text="Deployments" term_id="deployment" >}} make it straightforward to run, update, and scale applications, but they are not ideal for every scenario.

The following API objects provide functionality for additional workload types, whether they are *persistent* or *terminating*.

#### Persistent workloads

Like Deployments, these API objects run indefinitely on a cluster until they are manually terminated. They are best for long-running applications.

*  **{{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}}** - Like Deployments, StatefulSets allow you to specify that a
   certain number of replicas should be running for your application.

    {{< note  >}} It's misleading to say that Deployments can't handle stateful workloads. Using {{< glossary_tooltip text="PersistentVolumes" term_id="persistent-volume" >}}, you can persist data beyond the lifecycle of any individual Pod in your Deployment.
    {{< /note  >}}

    However, StatefulSets can provide stronger guarantees about "recovery" behavior than Deployments. StatefulSets maintain a sticky, stable identity for their Pods. The following table provides some concrete examples of what this might look like:

    |   | Deployment | StatefulSet |
    |---|---|---|
    | **Example Pod name** | `example-b1c4` | `example-0` |
    | **When a Pod dies** | Reschedule on *any* node, with new name `example-a51z` | Reschedule on same node, as `example-0` |
    | **When a node becomes unreachable** | Pod(s) are scheduled onto new node, with new names | Pod(s) are marked as "Unknown", and aren't rescheduled unless the Node object is forcefully deleted |

    In practice, this means that StatefulSets are best suited for scenarios where replicas (Pods) need to coordinate their workloads in a strongly consistent manner. Guaranteeing an identity for each Pod helps avoid {{< link text="split-brain" url="https://en.wikipedia.org/wiki/Split-brain_(computing)" >}} side effects in the case when a node becomes unreachable ({{< link text="network partition" url="https://en.wikipedia.org/wiki/Network_partition" >}}). This makes StatefulSets a great fit for distributed datastores like Cassandra or Elasticsearch.


* **{{< glossary_tooltip text="DaemonSets" term_id="daemonset" >}}** - DaemonSets run continuously on every node in your cluster, even as nodes are added or swapped in. This guarantee is particularly useful for setting up global behavior across your cluster, such as:

  * Logging and monitoring, from applications like `fluentd`
  * Network proxy or {{< link text="service mesh" url="https://www.linux.com/news/whats-service-mesh-and-why-do-i-need-one" >}}


#### Terminating workloads

In contrast to Deployments, these API objects are finite. They stop once the specified number of Pods have completed successfully.

* **{{< glossary_tooltip text="Jobs" term_id="job" >}}** - You can use these for one-off tasks like running a script or setting up a work queue. These tasks can be executed sequentially or in parallel. These tasks should be relatively independent, as Jobs do not support closely communicating parallel processes. {{< link text="Read more about Job patterns" url="/docs/concepts/workloads/controllers/jobs-run-to-completion/#job-patterns" >}}.

* **{{< glossary_tooltip text="CronJobs" term_id="cronjob" >}}** - These are similar to Jobs, but allow you to schedule their execution for a specific time or for periodic recurrence. You might use CronJobs to send reminder emails or to run backup jobs. They are set up with a similar syntax as *crontab*.

#### Other resources

For more info, you can check out {{< link text="a list of additional Kubernetes resource types" url="/docs/reference/kubectl/overview/#resource-types" >}} as well as the {{< link text="API reference docs" url="{{ reference_docs_url }}" >}}.

There may be additional features not mentioned here that you may find useful, which are covered in the {{< link text="full Kubernetes documentation" url="/docs/home/?path=browse" >}}.

## Deploy a production-ready workload

The beginner tutorials on this site, such as the {{< link text="Guestbook app" url="/docs/tutorials/stateless-application/guestbook/" >}}, are geared towards getting workloads up and running on your cluster. This prototyping is great for building your intuition around Kubernetes! However, in order to reliably and securely promote your workloads to production, you need to follow some additional best practices.

#### Declarative configuration

You are likely interacting with your Kubernetes cluster via {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}. kubectl can be used to debug the current state of your cluster (such as checking the number of nodes), or to modify live Kubernetes objects (such as updating a workload's replica count with `kubectl scale`).

When using kubectl to update your Kubernetes objects, it's important to be aware that different commands correspond to different approaches:

* {{< link text="Purely imperative" url="/docs/tutorials/object-management-kubectl/imperative-object-management-command/" >}}
* {{< link text="Imperative with local configuration files" url="/docs/tutorials/object-management-kubectl/imperative-object-management-configuration/" >}} (typically YAML)
* {{< link text="Declarative with local configuration files" url="/docs/tutorials/object-management-kubectl/declarative-object-management-configuration/" >}} (typically YAML)

There are pros and cons to each approach, though the declarative approach (such as `kubectl apply -f`) may be most helpful in production. With this approach, you rely on local YAML files as the source of truth about your desired state. This enables you to version control your configuration, which is helpful for code reviews and audit tracking.

For additional configuration best practices, familiarize yourself with {{< link text="this guide" url="/docs/concepts/configuration/overview/" >}}.

#### Security

You may be familiar with the *principle of least privilege*---if you are too generous with permissions when writing or using software, the negative effects of a compromise can escalate out of control. Would you be cautious handing out `sudo` privileges to software on your OS? If so, you should be just as careful when granting your workload permissions to the {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}} server! The API server is the gateway for your cluster's source of truth; it provides endpoints to read or modify cluster state.

You (or your {{< glossary_tooltip text="cluster operator" term_id="cluster-operator" >}}) can lock down API access with the following:

* **{{< glossary_tooltip text="ServiceAccounts" term_id="service-account" >}}** - An "identity" that your Pods can be tied to
* **{{< glossary_tooltip text="RBAC" term_id="rbac" >}}** - One way of granting your ServiceAccount explicit permissions

For even more comprehensive reading about security best practices, consider checking out the following topics:

* {{< link text="Authentication" url="/docs/admin/authentication/" >}} (Is the user who they say they are?)
* {{< link text="Authorization" url="/docs/admin/authorization/" >}} (Does the user actually have permissions to do what they're asking?)

#### Resource isolation and management

If your workloads are operating in a *multi-tenant* environment with multiple teams or projects, your container(s) are not necessarily running alone on their node(s). They are sharing node resources with other containers which you do not own.

Even if your cluster operator is managing the cluster on your behalf, it is helpful to be aware of the following:

* **{{< glossary_tooltip text="Namespaces" term_id="namespace" >}}**, used for isolation
* **{{< link text="Resource quotas" url="/docs/concepts/policy/resource-quotas/" >}}**, which affect what your team's workloads can use
* **{{< link text="Memory" url="/docs/tasks/configure-pod-container/assign-memory-resource/" >}} and {{< link text="CPU" url="/docs/tasks/configure-pod-container/assign-cpu-resource/" >}} requests**, for a given Pod or container
* **{{< link text="Monitoring" url="/docs/tasks/debug-application-cluster/resource-usage-monitoring/" >}}**, both on the cluster level and the app level

This list may not be completely comprehensive, but many teams have existing processes that take care of all this. If this is not the case, you'll find the Kubernetes documentation fairly rich in detail.

## Improve your dev workflow with tooling

As an app developer, you'll likely encounter the following tools in your workflow.

#### kubectl

`kubectl` is a command-line tool that allows you to easily read or modify your Kubernetes cluster. It provides convenient, short commands for common operations like scaling app instances and getting node info. How does kubectl do this? It's basically just a user-friendly wrapper for making API requests. It's written using {{< link text="client-go" url="https://github.com/kubernetes/client-go/#client-go" >}}, the Go library for the Kubernetes API.

To learn about the most commonly used kubectl commands, check out the {{< link text="kubectl cheatsheet" url="/docs/reference/kubectl/cheatsheet/" >}}. It explains topics such as the following:

* {{< link text="kubeconfig files" url="/docs/tasks/access-application-cluster/configure-access-multiple-clusters/" >}} - Your kubeconfig file tells kubectl what cluster to talk to, and can reference multiple clusters (such as dev and prod).
* {{< link text="The various output formats available" url="/docs/reference/kubectl/cheatsheet/#formatting-output" >}} - This is useful to know when you are using `kubectl get` to list information about certain API objects.

* {{< link text="The JSONPath output format" url="/docs/reference/kubectl/jsonpath/" >}} - This is related to the output formats above. JSONPath is especially useful for parsing specific subfields out of `kubectl get` output (such as the URL of a {{< glossary_tooltip text="Service" term_id="service" >}}).

* {{< link text="`kubectl run` vs `kubectl apply`" url="/docs/reference/kubectl/conventions/" >}} - This ties into the [declarative configuration](#declarative-configuration) discussion in the previous section.

For the full list of kubectl commands and their options, check out {{< link text="the reference guide" url="/docs/reference/generated/kubectl/kubectl-commands" >}}.

#### Helm

To leverage pre-packaged configurations from the community, you can use **{{< glossary_tooltip text="Helm charts" term_id="helm-chart" >}}**.

Helm charts package up YAML configurations for specific apps like Jenkins and Postgres. You can then  install and run these apps on your cluster with minimal extra configuration. This approach makes the most sense for "off-the-shelf" components which do not require much custom implementation logic.

For writing your own Kubernetes app configurations, there is a {{< link text="thriving ecosystem of tools" url="https://docs.google.com/a/heptio.com/spreadsheets/d/1FCgqz1Ci7_VCz_wdh8vBitZ3giBtac_H8SBw4uxnrsE/edit?usp=drive_web" >}} that you may find useful.

## Explore additional resources

#### References
Now that you're fairly familiar with Kubernetes, you may find it useful to browse the following reference pages. Doing so provides a high level view of what other features may exist:

* {{< link text="Commonly used `kubectl` commands" url="/docs/reference/kubectl/cheatsheet/" >}}
* {{< link text="Kubernetes API reference" url="{{ reference_docs_url }}" >}}
* {{< link text="Standardized Glossary" url="/docs/reference/glossary/" >}}

In addition, {{< link text="the Kubernetes Blog" url="https://kubernetes.io/blog/" >}} often has helpful posts on Kubernetes design patterns and case studies.

#### What's next
If you feel fairly comfortable with the topics on this page and want to learn more, check out the following user journeys:

* {{< link text="Advanced App Developer" url="/docs/user-journeys/users/application-developer/advanced/" >}} - Dive deeper, with the next level of this journey.
* {{< link text="Foundational Cluster Operator" url="/docs/user-journeys/users/cluster-operator/foundational/" >}} - Build breadth, by exploring other journeys.
{{% /capture %}}


