---
layout: blog
title: "API Priority and Fairness Alpha"
date: 2020-04-06
slug: kubernetes-1-18-feature-api-priority-and-fairness-alpha
author: >
  Min Kim (Ant Financial),
  Mike Spreitzer (IBM),
  Daniel Smith (Google)
---

This blog describes “API Priority And Fairness”, a new alpha feature in Kubernetes 1.18. API Priority And Fairness permits cluster administrators to divide the concurrency of the control plane into different weighted priority levels. Every request arriving at a kube-apiserver will be categorized into one of the priority levels and get its fair share of the control plane’s throughput.

## What problem does this solve?
Today the apiserver has a simple mechanism for protecting itself against CPU and memory overloads: max-in-flight limits for mutating and for readonly requests. Apart from the distinction between mutating and readonly, no other distinctions are made among requests; consequently, there can be undesirable scenarios where one subset of the requests crowds out other requests.

In short, it is far too easy for Kubernetes workloads to accidentally DoS the apiservers, causing other important traffic--like system controllers or leader elections---to fail intermittently. In the worst cases, a few broken nodes or controllers can push a busy cluster over the edge, turning a local problem into a control plane outage.

## How do we solve the problem?
The new feature “API Priority and Fairness” is about generalizing the existing max-in-flight request handler in each apiserver, to make the behavior more intelligent and configurable. The overall approach is as follows.

1. Each request is matched by a _Flow Schema_. The Flow Schema states the Priority Level for requests that match it, and assigns a “flow identifier” to these requests. Flow identifiers are how the system determines whether requests are from the same source or not.
2. Priority Levels may be configured to behave in several ways. Each Priority Level gets its own isolated concurrency pool.  Priority levels also introduce the concept of queuing requests that cannot be serviced immediately.
3. To prevent any one user or namespace from monopolizing a Priority Level, they may be configured to have multiple queues. [“Shuffle Sharding”](https://aws.amazon.com/builders-library/workload-isolation-using-shuffle-sharding/#What_is_shuffle_sharding.3F) is used to assign each flow of requests to a subset of the queues.
4. Finally, when there is capacity to service a request, a [“Fair Queuing”](https://en.wikipedia.org/wiki/Fair_queuing) algorithm is used to select the next request. Within each priority level the queues compete with even fairness.

Early results have been very promising! Take a look at this [analysis](https://github.com/kubernetes/kubernetes/pull/88177#issuecomment-588945806).

## How do I try this out?
You are required to prepare the following things in order to try out the feature:

* Download and install a kubectl greater than v1.18.0 version
* Enabling the new API groups with the command line flag `--runtime-config="flowcontrol.apiserver.k8s.io/v1alpha1=true"` on the kube-apiservers
* Switch on the feature gate with the command line flag `--feature-gates=APIPriorityAndFairness=true` on the kube-apiservers

After successfully starting your kube-apiservers, you will see a few default FlowSchema and PriorityLevelConfiguration resources in the cluster. These default configurations are designed for a general protection and traffic management for your cluster.
You can examine and customize the default configuration by running the usual tools, e.g.:

* `kubectl get flowschemas`
* `kubectl get prioritylevelconfigurations`


## How does this work under the hood?
Upon arrival at the handler, a request is assigned to exactly one priority level and exactly one flow within that priority level. Hence understanding how FlowSchema and PriorityLevelConfiguration works will be helping you manage the request traffic going through your kube-apiservers.

* FlowSchema: FlowSchema will identify a PriorityLevelConfiguration object and the way to compute the request’s “flow identifier”. Currently we support matching requests according to: the identity making the request, the verb, and the target object. The identity can match in terms of: a username, a user group name, or a ServiceAccount. And as for the target objects, we can match by apiGroup, resource[/subresource], and namespace.
  * The flow identifier is used for shuffle sharding, so it’s important that requests have the same flow identifier if they are from the same source! We like to consider scenarios with “elephants” (which send many/heavy requests) vs “mice” (which send few/light requests): it is important to make sure the elephant’s requests all get the same flow identifier, otherwise they will look like many different mice to the system!
  * See the API Documentation [here](https://kubernetes.io/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#flowschema-v1alpha1-flowcontrol-apiserver-k8s-io)!

* PriorityLevelConfiguration: Defines a priority level.
  * For apiserver self requests, and any reentrant traffic (e.g., admission webhooks which themselves make API requests), a Priority Level can be marked “exempt”, which means that no queueing or limiting of any sort is done. This is to prevent priority inversions.
  * Each non-exempt Priority Level is configured with a number of "concurrency shares" and gets an isolated pool of concurrency to use.  Requests of that Priority Level run in that pool when it is not full, never anywhere else.  Each apiserver is configured with a total concurrency limit (taken to be the sum of the old limits on mutating and readonly requests), and this is then divided among the Priority Levels in proportion to their concurrency shares.
  * A non-exempt Priority Level may select a number of queues and a "hand size" to use for the shuffle sharding.  Shuffle sharding maps flows to queues in a way that is better than consistent hashing.  A given flow has access to a small collection of queues, and for each incoming request the shortest queue is chosen.  When a Priority Level has queues, it also sets a limit on queue length.  There is also a limit placed on how long a request can wait in its queue; this is a fixed fraction of the apiserver's request timeout.  A request that cannot be executed and cannot be queued (any longer) is rejected.
  * Alternatively, a non-exempt Priority Level may select immediate rejection instead of waiting in a queue.
  * See the [API documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#prioritylevelconfiguration-v1alpha1-flowcontrol-apiserver-k8s-io) for this feature.

## What’s missing? When will there be a beta?
We’re already planning a few enhancements based on alpha and there will be more as users send feedback to our community. Here’s a list of them:

* Traffic management for WATCH and EXEC requests
* Adjusting and improving the default set of FlowSchema/PriorityLevelConfiguration
* Enhancing observability on how this feature works
* Join the discussion [here](https://github.com/kubernetes/enhancements/pull/1632)

Possibly treat LIST requests differently depending on an estimate of how big their result will be.

## How can I get involved?
As always! Reach us on slack [#sig-api-machinery](https://kubernetes.slack.com/messages/sig-api-machinery), or through the [mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-api-machinery). We have lots of exciting features to build and can use all sorts of help.

Many thanks to the contributors that have gotten this feature this far: Aaron Prindle, Daniel Smith, Jonathan Tomer, Mike Spreitzer, Min Kim, Bruce Ma, Yu Liao, Mengyi Zhou!
