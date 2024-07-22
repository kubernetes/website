---
reviewers:
- lavalamp
title: Kubernetes Components
content_type: concept
description: >
  An overview of the key components that make up a Kubernetes cluster.
weight: 30
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

A Kubernetes cluster consists of a control plane and one or more worker nodes. Here's a brief overview of the main components:

### Control Plane Components

Manage the overall state of the cluster:

<dl>
  <dt>kube-apiserver</dt>
  <dd>The API server that exposes the Kubernetes API</dd>

  <dt>etcd</dt>
  <dd>Consistent and highly-available key value store for all cluster data</dd>

  <dt>kube-scheduler</dt>
  <dd>Assigns Pods to Nodes</dd>

  <dt>kube-controller-manager</dt>
  <dd>Runs controller processes</dd>

  <dt>cloud-controller-manager</dt>
  <dd>Integrates with underlying cloud providers</dd>
</dl>

### Node Components

Run on every node, maintaining running pods and providing the Kubernetes runtime environment:

<dl>
  <dt>kubelet</dt>
  <dd>Ensures that containers are running in a Pod</dd>

  <dt>kube-proxy</dt>
  <dd>Maintains network rules on nodes</dd>

  <dt>Container runtime</dt>
  <dd>Software responsible for running containers</dd>
</dl>

## Addons

Addons extend the functionality of Kubernetes. A few important examples include:

<dl>
  <dt>DNS</dt>
  <dd>For cluster-wide DNS resolution</dd>

  <dt>Web UI (Dashboard)</dt>
  <dd>For cluster management via a web interface</dd>

  <dt>Container Resource Monitoring</dt>
  <dd>For collecting and storing container metrics</dd>

  <dt>Cluster-level Logging</dt>
  <dd>For saving container logs to a central log store</dd>
</dl>

## Flexibility in Architecture

Kubernetes allows for flexibility in how these components are deployed and managed. The architecture can be adapted to various needs, from small development environments to large-scale production deployments.

For more detailed information about each component and various ways to configure your cluster architecture, see the [Cluster Architecture](/docs/concepts/architecture/) page.
