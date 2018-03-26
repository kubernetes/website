---
reviewers:
- crassirostris
- piosz
title: Events in Stackdriver
---



Kubernetes events are objects that provide insight into what is happening
inside a cluster, such as what decisions were made by scheduler or why some
pods were evicted from the node. You can read more about using events
for debugging your application in the [Application Introspection and Debugging
](/docs/tasks/debug-application-cluster/debug-application-introspection/)
section.

Since events are API objects, they are stored in the apiserver on master. To
avoid filling up master's disk, a retention policy is enforced: events are
removed one hour after the last occurrence. To provide longer history
and aggregation capabilities, a third party solution should be installed
to capture events.

This article describes a solution that exports Kubernetes events to
Stackdriver Logging, where they can be processed and analyzed.

**Note:** it is not guaranteed that all events happening in a cluster will be
exported to Stackdriver. One possible scenario when events will not be
exported is when event exporter is not running (e.g. during restart or
upgrade). In most cases it's fine to use events for purposes like setting up
[metrics][sdLogMetrics] and [alerts][sdAlerts], but you should be aware
of the potential inaccuracy.

[sdLogMetrics]: https://cloud.google.com/logging/docs/view/logs_based_metrics
[sdAlerts]: https://cloud.google.com/logging/docs/view/logs_based_metrics#creating_an_alerting_policy

* TOC
{:toc}

## Deployment

### Google Kubernetes Engine

In Google Kubernetes Engine, if cloud logging is enabled, event exporter
is deployed by default to the clusters with master running version 1.7 and
higher. To prevent disturbing your workloads, event exporter does not have
resources set and is in the best effort QOS class, which means that it will
be the first to be killed in the case of resource starvation. If you want
your events to be exported, make sure you have enough resources to facilitate
the event exporter pod. This may vary depending on the workload, but on
average, approximately 100Mb RAM and 100m CPU is needed.

### Deploying to the Existing Cluster

Deploy event exporter to your cluster using the following command:

```shell
kubectl create -f https://k8s.io/docs/tasks/debug-application-cluster/event-exporter-deploy.yaml
```

Since event exporter accesses the Kubernetes API, it requires permissions to
do so. The following deployment is configured to work with RBAC
authorization. It sets up a service account and a cluster role binding
to allow event exporter to read events. To make sure that event exporter
pod will not be evicted from the node, you can additionally set up resource
requests. As mentioned earlier, 100Mb RAM and 100m CPU should be enough.

{% include code.html language="yaml" file="event-exporter-deploy.yaml" ghlink="/docs/tasks/debug-application-cluster/event-exporter-deploy.yaml" %}

## User Guide

Events are exported to the `GKE Cluster` resource in Stackdriver Logging.
You can find them by selecting an appropriate option from a drop-down menu
of available resources:

<img src="/images/docs/stackdriver-event-exporter-resource.png" alt="Events location in the Stackdriver Logging interface" width="500">

You can filter based on the event object fields using Stackdriver Logging
[filtering mechanism](https://cloud.google.com/logging/docs/view/advanced_filters).
For example, the following query will show events from the scheduler
about pods from deployment `nginx-deployment`:

```
resource.type="gke_cluster"
jsonPayload.kind="Event"
jsonPayload.source.component="default-scheduler"
jsonPayload.involvedObject.name:"nginx-deployment"
```

<img src="/images/docs/stackdriver-event-exporter-filter.png" alt="Filtered events in the Stackdriver Logging interface" width="500">
