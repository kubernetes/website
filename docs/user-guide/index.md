---
---

* TOC
{:toc}

The user guide is intended for anyone who wants to run programs and services on an existing Kubernetes cluster.  Setup and administration of a Kubernetes cluster is described in the [Cluster Admin Guide](/docs/admin/). The [Developer Guide](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/docs/devel/) is for anyone wanting to either write code which directly accesses the Kubernetes API, or to contribute directly to the Kubernetes project.

Please ensure you have completed the [prerequisites for running examples from the user guide](/docs/user-guide/prereqs).

## Quick walkthrough

1. [Kubernetes 101](/docs/user-guide/walkthrough/)
1. [Kubernetes 201](/docs/user-guide/walkthrough/k8s201)

## Thorough walkthrough

If you don't have much familiarity with Kubernetes, we recommend you read the following sections in order:

1. [Quick start: launch and expose an application](/docs/user-guide/quick-start)
1. [Configuring and launching containers: configuring common container parameters](/docs/user-guide/configuring-containers)
1. [Deploying continuously running applications](/docs/user-guide/deploying-applications)
1. [Connecting applications: exposing applications to clients and users](/docs/user-guide/connecting-applications)
1. [Working with containers in production](/docs/user-guide/production-pods)
1. [Managing deployments](/docs/user-guide/managing-deployments)
1. [Application introspection and debugging](/docs/user-guide/introspection-and-debugging)
    1. [Using the Kubernetes web user interface](/docs/user-guide/ui)
    1. [Logging](/docs/user-guide/logging)
    1. [Monitoring](/docs/user-guide/monitoring)
    1. [Getting into containers via `exec`](/docs/user-guide/getting-into-containers)
    1. [Connecting to containers via proxies](/docs/user-guide/connecting-to-applications-proxy)
    1. [Connecting to containers via port forwarding](/docs/user-guide/connecting-to-applications-port-forward)

## Overview

Kubernetes is an open-source system for managing containerized applications across multiple hosts in a cluster. Kubernetes is intended to make deploying containerized/microservice-based applications easy but powerful.

Kubernetes provides mechanisms for application deployment, scheduling, updating, maintenance, and scaling. A key feature of Kubernetes is that it actively manages the containers to ensure that the state of the cluster continually matches the user's intentions. An operations user should be able to launch a micro-service, letting the scheduler find the right placement. We also want to improve the tools and experience for how users can roll-out applications through patterns like canary deployments.

Kubernetes supports [Docker](http://www.docker.io) and [Rocket](https://coreos.com/blog/rocket/) containers, and other container image formats and container runtimes will be supported in the future.

While Kubernetes currently focuses on continuously-running stateless (e.g. web server or in-memory object cache) and "cloud native" stateful applications (e.g. NoSQL datastores), in the near future it will support all the other workload types commonly found in production cluster environments, such as batch, stream processing, and traditional databases.

In Kubernetes, all containers run inside [pods](/docs/user-guide/pods). A pod can host a single container, or multiple cooperating containers; in the latter case, the containers in the pod are guaranteed to be co-located on the same machine and can share resources. A pod can also contain zero or more [volumes](/docs/user-guide/volumes), which are directories that are private to a container or shared across containers in a pod. For each pod the user creates, the system finds a machine that is healthy and that has sufficient available capacity, and starts up the corresponding container(s) there. If a container fails it can be automatically restarted by Kubernetes' node agent, called the Kubelet. But if the pod or its machine fails, it is not automatically moved or restarted unless the user also defines a [replication controller](/docs/user-guide/replication-controller), which we discuss next.

Users can create and manage pods themselves, but Kubernetes drastically simplifies system management by allowing users to delegate two common pod-related activities: deploying multiple pod replicas based on the same pod configuration, and creating replacement pods when a pod or its machine fails. The Kubernetes API object that manages these behaviors is called a [replication controller](/docs/user-guide/replication-controller). It defines a pod in terms of a template, that the system then instantiates as some number of pods (specified by the user). The replicated set of pods might constitute an entire application, a micro-service, or one layer in a multi-tier application. Once the pods are created, the system continually monitors their health and that of the machines they are running on; if a pod fails due to a software problem or machine failure, the replication controller automatically creates a new pod on a healthy machine, to maintain the set of pods at the desired replication level. Multiple pods from the same or different applications can share the same machine. Note that a replication controller is needed even in the case of a single non-replicated pod if the user wants it to be re-created when it or its machine fails.

Frequently it is useful to refer to a set of pods, for example to limit the set of pods on which a mutating operation should be performed, or that should be queried for status. As a general mechanism, users can attach to most Kubernetes API objects arbitrary key-value pairs called [labels](/docs/user-guide/labels), and then use a set of label selectors (key-value queries over labels) to constrain the target of API operations. Each resource also has a map of string keys and values that can be used by external tooling to store and retrieve arbitrary metadata about this object, called [annotations](/docs/user-guide/annotations).

Kubernetes supports a unique [networking model](/docs/admin/networking). Kubernetes encourages a flat address space and does not dynamically allocate ports, instead allowing users to select whichever ports are convenient for them. To achieve this, it allocates an IP address for each pod.

Modern Internet applications are commonly built by layering micro-services, for example a set of web front-ends talking to a distributed in-memory key-value store talking to a replicated storage service. To facilitate this architecture, Kubernetes offers the [service](/docs/user-guide/services) abstraction, which provides a stable IP address and [DNS name](/docs/admin/dns) that corresponds to a dynamic set of pods such as the set of pods constituting a micro-service. The set is defined using a label selector and thus can refer to any set of pods. When a container running in a Kubernetes pod connects to this address, the connection is forwarded by a local agent (called the kube proxy) running on the source machine, to one of the corresponding back-end containers. The exact back-end is chosen using a round-robin policy to balance load. The kube proxy takes care of tracking the dynamic set of back-ends as pods are replaced by new pods on new hosts, so that the service IP address (and DNS name) never changes.

Every resource in Kubernetes, such as a pod, is identified by a URI and has a UID. Important components of the URI are the kind of object (e.g. pod), the object's name, and the object's [namespace](/docs/user-guide/namespaces). For a certain object kind, every name is unique within its namespace. In contexts where an object name is provided without a namespace, it is assumed to be in the default namespace. UID is unique across time and space.

## Concept guide

[**Cluster**](/docs/admin/)
: A cluster is a set of physical or virtual machines and other infrastructure resources used by Kubernetes to run your applications.

[**Node**](/docs/admin/node)
: A node is a physical or virtual machine running Kubernetes, onto which pods can be scheduled.

[**Pod**](/docs/user-guide/pods)
: A pod is a co-located group of containers and volumes.

[**Label**](/docs/user-guide/labels)
: A label is a key/value pair that is attached to a resource, such as a pod, to convey a user-defined identifying attribute. Labels can be used to organize and to select subsets of resources.

[**Selector**](/docs/user-guide/labels/#label-selectors)
: A selector is an expression that matches labels in order to identify related resources, such as which pods are targeted by a load-balanced service.

[**Replication Controller**](/docs/user-guide/replication-controller)
: A replication controller ensures that a specified number of pod replicas are running at any one time. It both allows for easy scaling of replicated systems and handles re-creation of a pod when the machine it is on reboots or otherwise fails.

[**Service**](/docs/user-guide/services)
: A service defines a set of pods and a means by which to access them, such as single stable IP address and corresponding DNS name.

[**Volume**](/docs/user-guide/volumes)
: A volume is a directory, possibly with some data in it, which is accessible to a Container as part of its filesystem.  Kubernetes volumes build upon [Docker Volumes](https://docs.docker.com/userguide/dockervolumes/), adding provisioning of the volume directory and/or device.

[**Secret**](/docs/user-guide/secrets)
: A secret stores sensitive data, such as authentication tokens, which can be made available to containers upon request.

[**Name**](/docs/user-guide/identifiers)
: A user- or client-provided name for a resource.

[**Namespace**](/docs/user-guide/namespaces)
: A namespace is like a prefix to the name of a resource. Namespaces help different projects, teams, or customers to share a cluster, such as by preventing name collisions between unrelated teams.

[**Annotation**](/docs/user-guide/annotations)
: A key/value pair that can hold larger (compared to a label), and possibly not human-readable, data, intended to store non-identifying auxiliary data, especially data manipulated by tools and system extensions.  Efficient filtering by annotation values is not supported.

## Further reading

* API resources
  * [Working with resources](/docs/user-guide/working-with-resources)

* Pods and containers
  * [Pod lifecycle and restart policies](/docs/user-guide/pod-states)
  * [Lifecycle hooks](/docs/user-guide/container-environment)
  * [Compute resources, such as cpu and memory](/docs/user-guide/compute-resources)
  * [Specifying commands and requesting capabilities](/docs/user-guide/containers)
  * [Downward API: accessing system configuration from a pod](/docs/user-guide/downward-api)
  * [Images and registries](/docs/user-guide/images)
  * [Migrating from docker-cli to kubectl](/docs/user-guide/docker-cli-to-kubectl)
  * [Tips and tricks when working with config](/docs/user-guide/config-best-practices)
  * [Assign pods to selected nodes](/docs/user-guide/node-selection/)
  * [Perform a rolling update on a running group of pods](/docs/user-guide/update-demo/)