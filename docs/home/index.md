---
approvers:
- bgrant0607
- thockin
title: Kubernetes Documentation
---

Kubernetes documentation can help you set up Kubernetes, learn about the system, or get your applications and workloads running on Kubernetes. To learn the basics of what Kubernetes is and how it works, read "[What is Kubernetes](/docs/concepts/overview/what-is-kubernetes/)".

## Interactive Tutorial

The [Kubernetes Basics interactive tutorial](/docs/tutorials/kubernetes-basics/) lets you try out Kubernetes right out of your web browser, using a virtual terminal. Learn about the Kubernetes system and deploy, expose, scale, and upgrade a containerized application in just a few minutes.

## Installing/Setting Up Kubernetes

[Picking the Right Solution](/docs/setup/pick-right-solution/) can help you get a Kubernetes cluster up and running, either for local development, or on your cloud provider of choice.

## Concepts, Tasks, and Tutorials

The Kubernetes documentation contains a number of resources to help you understand and work with Kubernetes.

* [Concepts](/docs/concepts/) provide a deep understanding of how Kubernetes works.
* [Tasks](/docs/tasks/) contain step-by-step instructions for common Kubernetes tasks.
* [Tutorials](/docs/tutorials/) contain detailed walkthroughs of the Kubernetes workflow.

## API and Command References

The [Reference](/docs/reference/) documentation provides complete information on the Kubernetes APIs and the `kubectl` command-line interface.

## Tools

The [Tools](/docs/tools/) page contains a list of native and third-party tools for Kubernetes.

## Troubleshooting

The [Troubleshooting](/docs/tasks/debug-application-cluster/troubleshooting) page outlines some resources for troubleshooting and finding help.

## Supported Versions

Kubernetes has a _X.Y.Z_ versioning scheme, where _X_ is the major version, _Y_ is the minor version, and _Z_ is the patch version. 

Kubernetes is supported for three minor versions at a time. This includes the current release version and two previous versions. 

See the [Kubernetes Release](https://github.com/kubernetes/kubernetes/releases) page on GitHub for the latest release information.

### Minor Versions

A certain amount of version skew is permissible between master components, node components, and the kubectl client. Nodes may lag master by up to two versions, but not exceed the master version. Clients may lag master by one version and may exceed master up to one version.

For example, a v1.8 master is expected to be compatible with v1.6, v1.7, and v1.8 nodes, and compatible with v1.7, v1.8, and v1.9 clients. 

### Patch Versions

Patch releases often include critical bug fixes. You should be running the latest patch release of a given minor release.
