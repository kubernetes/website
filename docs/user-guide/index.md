---
assignees:
- davidopp
title: User Guide
---

{% include user-guide-migration-notice.md %}

The Kubernetes **Guides** can help you work with various aspects of the Kubernetes system.

* The Kubernetes [User Guide](#user-guide-internal) can help you run programs and services on an existing Kubernetes cluster.
* The [Cluster Admin Guide](/docs/tasks/administer-cluster/overview/) can help you set up and administrate your own Kubernetes cluster.
* The [Developer Guide] can help you either write code to directly access the Kubernetes API, or to contribute directly to the Kubernetes project.

## <a name="user-guide-internal"></a>Kubernetes User Guide

The following topics in the Kubernetes User Guide can help you run applications and services on a Kubernetes cluster:

1. [Quick start: launch and expose an application](/docs/user-guide/quick-start/)
1. [Configuring and launching containers: configuring common container parameters](/docs/user-guide/configuring-containers/)
1. [Deploying continuously running applications](/docs/user-guide/deploying-applications/)
1. [Connecting applications: exposing applications to clients and users](/docs/concepts/services-networking/connect-applications-service/)
1. [Working with containers in production](/docs/user-guide/production-pods/)
1. [Managing deployments](/docs/concepts/cluster-administration/manage-deployment/)
1. [Application introspection and debugging](/docs/tasks/debug-application-cluster/debug-application-introspection/)
    1. [Using the Kubernetes web user interface](/docs/tasks/web-ui-dashboard/)
    1. [Logging](/docs/concepts/clusters/logging/)
    1. [Monitoring](/docs/concepts/cluster-administration/resource-usage-monitoring/)
    1. [Getting into containers via `exec`](/docs/tasks/kubectl/get-shell-running-container/)
    1. [Connecting to containers via proxies](/docs/tasks/access-kubernetes-api/http-proxy-access-api/)
    1. [Connecting to containers via port forwarding](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)

Before running examples in the user guides, please ensure you have completed [installing kubectl](/docs/tasks/kubectl/install/).

## Kubernetes Concepts

[**Cluster**](/docs/tasks/administer-cluster/overview/)
: A cluster is a set of physical or virtual machines and other infrastructure resources used by Kubernetes to run your applications.

[**Node**](/docs/concepts/nodes/node/)
: A node is a physical or virtual machine running Kubernetes, onto which pods can be scheduled.

[**Pod**](/docs/concepts/workloads/pods/pod/)
: A pod is a co-located group of containers and volumes.

[**Label**](/docs/user-guide/labels/)
: A label is a key/value pair that is attached to a resource, such as a pod, to convey a user-defined identifying attribute. Labels can be used to organize and to select subsets of resources.

[**Selector**](/docs/user-guide/labels/#label-selectors)
: A selector is an expression that matches labels in order to identify related resources, such as which pods are targeted by a load-balanced service.

[**Replication Controller**](/docs/concepts/workloads/controllers/replicationcontroller/)
: A replication controller ensures that a specified number of pod replicas are running at any one time. It both allows for easy scaling of replicated systems and handles re-creation of a pod when the machine it is on reboots or otherwise fails.

[**Service**](/docs/concepts/services-networking/service/)
: A service defines a set of pods and a means by which to access them, such as single stable IP address and corresponding DNS name.

[**Volume**](/docs/concepts/storage/volumes/)
: A volume is a directory, possibly with some data in it, which is accessible to a Container as part of its filesystem.  Kubernetes volumes build upon [Docker Volumes](https://docs.docker.com/engine/tutorials/dockervolumes/), adding provisioning of the volume directory and/or device.

[**Secret**](/docs/concepts/configuration/secret/)
: A secret stores sensitive data, such as authentication tokens, which can be made available to containers upon request.

[**Name**](/docs/concepts/overview/working-with-objects/names/)
: A user- or client-provided name for a resource.

[**Namespace**](/docs/concepts/overview/working-with-objects/namespaces/)
: A namespace is like a prefix to the name of a resource. Namespaces help different projects, teams, or customers to share a cluster, such as by preventing name collisions between unrelated teams.

[**Annotation**](/docs/concepts/overview/working-with-objects/annotations/)
: A key/value pair that can hold larger (compared to a label), and possibly not human-readable, data, intended to store non-identifying auxiliary data, especially data manipulated by tools and system extensions.  Efficient filtering by annotation values is not supported.

## Further reading

API resources

  * [Working with resources](/docs/concepts/tools/kubectl/object-management-overview/)

Pods and containers

  * [Pod lifecycle and restart policies](/docs/concepts/workloads/pods/pod-lifecycle/)
  * [Lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/)
  * [Compute resources, such as cpu and memory](/docs/concepts/configuration/manage-compute-resources-container/)
  * [Specifying commands and requesting capabilities](/docs/user-guide/containers/)
  * [Downward API: accessing system configuration from a pod](/docs/tasks/configure-pod-container/downward-api-volume-expose-pod-information/)
  * [Images and registries](/docs/concepts/containers/images/)
  * [Migrating from docker-cli to kubectl](/docs/user-guide/docker-cli-to-kubectl/)
  * [Configuration Best Practices and Tips](/docs/concepts/configuration/overview/)
  * [Assign pods to selected nodes](/docs/concepts/configuration/assign-pod-node/)
  * [Perform a rolling update on a running group of pods](/docs/tasks/run-application/rolling-update-replication-controller/)

[Developer Guide]: https://github.com/kubernetes/community/blob/master/contributors/devel/README.md
