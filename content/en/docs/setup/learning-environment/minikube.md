---
reviewers:
- dlorenc
- balopat
- aaron-prindle
title: Installing Kubernetes with Minikube
content_template: templates/concept
---

{{% capture overview %}}

Minikube is a tool that makes it easy to run Kubernetes locally. Minikube runs a single-node Kubernetes cluster inside a Virtual Machine (VM) on your laptop for users looking to try out Kubernetes or develop with it day-to-day.

{{% /capture %}}

{{% capture body %}}

## Minikube Features

This document has moved to https://minikube.sigs.k8s.io/docs/overview/

## Installation

This document has moved to https://minikube.sigs.k8s.io/docs/start/linux/

## Quickstart

This document has moved to https://minikube.sigs.k8s.io/docs/examples/

## Managing your Cluster

### Starting a Cluster

This document has moved to https://minikube.sigs.k8s.io/docs/reference/commands/start/


#### Specifying the Kubernetes version

This document has moved to https://minikube.sigs.k8s.io/docs/reference/configuration/kubernetes/

#### Specifying the VM driver

This document has moved to https://minikube.sigs.k8s.io/docs/reference/drivers/

#### Starting a cluster on alternative container runtimes

This document has moved to https://minikube.sigs.k8s.io/docs/reference/runtimes/

#### Use local images by re-using the Docker daemon

This document has moved to https://minikube.sigs.k8s.io/docs/tasks/docker_daemon/

### Configuring Kubernetes

This document has moved to https://minikube.sigs.k8s.io/docs/reference/configuration/kubernetes/

#### Examples

This document has moved to https://minikube.sigs.k8s.io/docs/reference/configuration/kubernetes/

### Stopping a Cluster

This document has moved to https://minikube.sigs.k8s.io/docs/reference/commands/stop/

### Deleting a Cluster

This document has moved to https://minikube.sigs.k8s.io/docs/reference/commands/delete/

## Interacting with Your Cluster

### Kubectl

This document has moved to https://minikube.sigs.k8s.io/docs/reference/commands/kubectl/

### Dashboard

This document has moved to https://minikube.sigs.k8s.io/docs/tasks/dashboard/

### Services

This document has moved to https://minikube.sigs.k8s.io/docs/reference/commands/service/

## Networking

This document has moved to https://minikube.sigs.k8s.io/docs/reference/networking/

## Persistent Volumes

This document has moved to https://minikube.sigs.k8s.io/docs/reference/persistent_volumes/

## Mounted Host Folders

This document has moved to https://minikube.sigs.k8s.io/docs/reference/persistent_volumes/

## Private Container Registries

This document has moved to https://minikube.sigs.k8s.io/docs/tasks/registry/private/

## Add-ons

This document has moved to https://minikube.sigs.k8s.io/docs/tasks/addons/

## Using Minikube with an HTTP Proxy

This document has moved to https://minikube.sigs.k8s.io/docs/reference/networking/proxy/

## Known Issues

Features that require multiple nodes will not work in Minikube.

## Design

Minikube uses [libmachine](https://github.com/docker/machine/tree/master/libmachine) for provisioning VMs, and [kubeadm](https://github.com/kubernetes/kubeadm) to provision a Kubernetes cluster.

For more information about Minikube, see the [proposal](https://git.k8s.io/community/contributors/design-proposals/cluster-lifecycle/local-cluster-ux.md).

## Additional Links

* **Goals and Non-Goals**: For the goals and non-goals of the Minikube project, please see our [roadmap](https://minikube.sigs.k8s.io/docs/contributing/roadmap/).
* **Development Guide**: See [CONTRIBUTING.md](https://git.k8s.io/minikube/CONTRIBUTING.md) for an overview of how to send pull requests.
* **Building Minikube**: For instructions on how to build/test Minikube from source, see the [build guide](https://git.k8s.io/minikube/docs/contributors/build_guide.md).
* **Adding a New Dependency**: For instructions on how to add a new dependency to Minikube, see the [adding dependencies guide](https://git.k8s.io/minikube/docs/contributors/adding_a_dependency.md).
* **Adding a New Addon**: For instructions on how to add a new addon for Minikube, see the [adding an addon guide](https://git.k8s.io/minikube/docs/contributors/adding_an_addon.md).
* **MicroK8s**: Linux users wishing to avoid running a virtual machine may consider [MicroK8s](https://microk8s.io/) as an alternative.

## Community

This document has moved to https://minikube.sigs.k8s.io/community/
{{% /capture %}}
