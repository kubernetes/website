---
reviewers:
- lavalamp
title: Kubernetes Components
content_type: concept
description: >
  An overview of the key components that make up a Kubernetes cluster.
weight: 10
card:
  title: Components of a cluster
  name: concepts
  weight: 20
---

<!-- overview -->

This page provides a high-level overview of the essential components that make up a Kubernetes cluster.

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Components of Kubernetes" caption="The components of a Kubernetes cluster" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## Core Components

A Kubernetes cluster consists of a control plane and one or more worker nodes.
Here's a brief overview of the main components:

### Control Plane Components

Manage the overall state of the cluster:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: The core component server that exposes the Kubernetes HTTP API

[etcd](/docs/concepts/architecture/#etcd)
: Consistent and highly-available key value store for all API server data

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: Looks for Pods not yet bound to a node, and assigns each Pod to a suitable node.

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: Runs {{< glossary_tooltip text="controllers" term_id="controller" >}} to implement Kubernetes API behavior.

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (optional)
: Integrates with underlying cloud provider(s).

### Node Components

Run on every node, maintaining running pods and providing the Kubernetes runtime environment:

[kubelet](/docs/concepts/architecture/#kubelet)
: Ensures that Pods are running, including their containers.

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (optional)
: Maintains network rules on nodes to implement {{< glossary_tooltip text="Services" term_id="service" >}}.

[Container runtime](/docs/concepts/architecture/#container-runtime)
: Software responsible for running containers. Read
  [Container Runtimes](/docs/setup/production-environment/container-runtimes/) to learn more.

{{% thirdparty-content single="true" %}}

Your cluster may require additional software on each node; for example, you might also
run [systemd](https://systemd.io/) on a Linux node to supervise local components.

## Addons

Addons extend the functionality of Kubernetes. A few important examples include:

[DNS](/docs/concepts/architecture/#dns)
: For cluster-wide DNS resolution

[Web UI](/docs/concepts/architecture/#web-ui-dashboard) (Dashboard)
: For cluster management via a web interface

[Container Resource Monitoring](/docs/concepts/architecture/#container-resource-monitoring)
: For collecting and storing container metrics

[Cluster-level Logging](/docs/concepts/architecture/#cluster-level-logging)
: For saving container logs to a central log store

## Flexibility in Architecture

Kubernetes allows for flexibility in how these components are deployed and managed.
The architecture can be adapted to various needs, from small development environments
to large-scale production deployments.

For more detailed information about each component and various ways to configure your
cluster architecture, see the [Cluster Architecture](/docs/concepts/architecture/) page.
