---
assignees:
- crassirostris
- piosz
title: Events Using Stackdriver
---

Kubernetes events are objects that provide an insight into what is happening
inside a cluster, for example, what decisions were made by scheduler or why
some pods were evicted from the node. You can read more about using events
for debugging your application in the [Application Introspection and Debugging
](docs/tasks/debug-application-cluster/debug-application-introspection)
section.

Since events are API objects, they are stored in the apiserver on master. To
avoid filling up master's disk, a retention policy is enforced: events are
removed after one hour after the last occurence. To provide longer history
and aggregation capabilities, a third party solution should be installed,
to where events would be exported for future use.

This article describes a solution that exports Kubernetes events to
Stackdriver Logging, where they can be made useful.

*Note:* evets are considered best-effort, so it's possible that some events
will be lost on their way to Stackdriver. For example, because of the
technical constraints, events that happen while event exporter is not
running are not exported. You should not depend on every event happening in
the cluster making its way to Stackdriver. In particular, this implies that
alerting based on events might be not a good idea.

* TOC
{:toc}

## Deployment

### Google Container Engine

In Google Container Engine event exporter is deployed by default to the
clusters with master in version 1.7 and higher, if cloud logging is enabled.
Note, that in order to prevent disturbing your workloads, event exporter
doesn't have resources set and is in the best effort QOS class, which
effectively means that it will be the first to kill in case of resource
starvation. If you want your events to be exported, make sure you have
enough resources to facilitate the event exporter pod (depends on the
workload, but on average approximately 100Mb RAM and 100m CPU).

### Deploying to the Existing Cluster

Deploy event exporter to your cluster using the following command:

```shell
kubectl create -f https://k8s.io/docs/tasks/debug-application-cluster/event-exporter-deploy.yaml
```

Since event exporter accesses Kubernetes API, it requres permissions to
do so. The following deployment is configured to work with RBAC
authorization. It sets up a service account and a cluster role binding
to allow event exporter to read events. To make sure that event exporter
pod will not be evicted from the node, you can additionally set up resource
requests. As mentioned earlier, 100Mb RAM and 100m CPU should be enough.

{% include code.html language="yaml" file="event-exporter-deploy.yaml" ghlink="/docs/tasks/debug-application-cluster/event-exporter-deploy.yaml" %}

## User Guide

Events are exported to the `GKE Cluster` resource in Stackdriver Logging,
you can find them by selecting an appropriate option from a drop-down menu
of available resources:

![Events location in the Stackdriver Logging interface](/images/docs/stackdriver-event-exporter-resource.png)

You can filter based on the event object fields using Stackdriver Logging
[filtering mechanism](https://cloud.google.com/logging/docs/view/advanced_filters).
For example, the following query will show events from scheduler
about pods from deployment `nginx-deployment`:

```
resource.type="gke_cluster"
jsonPayload.kind="Event"
jsonPayload.source.component="default-scheduler"
jsonPayload.involvedObject.name:"nginx-deployment"
```

![Filtered events in the Stackdriver Logging interface](/images/docs/stackdriver-event-exporter-filter.png)