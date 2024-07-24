---
layout: blog
title: "Is Your Cluster Ready for v1.24?"
date: 2022-03-31
slug: ready-for-dockershim-removal
author: >
   Kat Cosgrove
---

Way back in December of 2020, Kubernetes announced the [deprecation of Dockershim](/blog/2020/12/02/dont-panic-kubernetes-and-docker/). In Kubernetes, dockershim is a software shim that allows you to use the entire Docker engine as your container runtime within Kubernetes. In the upcoming v1.24 release, we are removing Dockershim - the delay between deprecation and removal in line with the [project’s policy](https://kubernetes.io/docs/reference/using-api/deprecation-policy/) of supporting features for at least one year after deprecation. If you are a cluster operator, this guide includes the practical realities of what you need to know going into this release. Also, what do you need to do to ensure your cluster doesn’t fall over!

## First, does this even affect you?

If you are rolling your own cluster or are otherwise unsure whether or not this removal affects you, stay on the safe side and [check to see if you have any dependencies on Docker Engine](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/). Please note that using Docker Desktop to build your application containers is not a Docker dependency for your cluster. Container images created by Docker are compliant with the [Open Container Initiative (OCI)](https://opencontainers.org/), a Linux Foundation governance structure that defines industry standards around container formats and runtimes. They will work just fine on any container runtime supported by Kubernetes.

If you are using a managed Kubernetes service from a cloud provider, and you haven’t explicitly changed the container runtime, there may be nothing else for you to do. Amazon EKS, Azure AKS, and Google GKE all default to containerd now, though you should make sure they do not need updating if you have any node customizations. To check the runtime of your nodes, follow [Find Out What Container Runtime is Used on a Node](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/).

Regardless of whether you are rolling your own cluster or using a managed Kubernetes service from a cloud provider, you may need to [migrate telemetry or security agents that rely on Docker Engine](/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/). 

## I have a Docker dependency. What now?

If your Kubernetes cluster depends on Docker Engine and you intend to upgrade to Kubernetes v1.24 (which you should eventually do for security and similar reasons), you will need to change your container runtime from Docker Engine to something else or use [cri-dockerd](https://github.com/Mirantis/cri-dockerd). Since [containerd](https://containerd.io/) is a graduated CNCF project and the runtime within Docker itself, it’s a safe bet as an alternative container runtime. Fortunately, the Kubernetes project has already documented the process of [changing a node’s container runtime](/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/), using containerd as an example. Instructions are similar for switching to one of the other supported runtimes.

## I want to upgrade Kubernetes, and I need to maintain compatibility with Docker as a runtime. What are my options?

Fear not, you aren’t being left out in the cold and you don’t have to take the security risk of staying on an old version of Kubernetes. Mirantis and Docker have jointly released, and are maintaining, a replacement for dockershim. That replacement is called [cri-dockerd](https://github.com/Mirantis/cri-dockerd). If you do need to maintain compatibility with Docker as a runtime, install cri-dockerd following the instructions in the project’s documentation.

## Is that it?


Yes. As long as you go into this release aware of the changes being made and the details of your own clusters, and you make sure to communicate clearly with your development teams, it will be minimally dramatic. You may have some changes to make to your cluster, application code, or scripts, but all of these requirements are documented. Switching from using Docker Engine as your runtime to using [one of the other supported container runtimes](/docs/setup/production-environment/container-runtimes/) effectively means removing the middleman, since the purpose of dockershim is to access the container runtime used by Docker itself. From a practical perspective, this removal is better both for you and for Kubernetes maintainers in the long-run.

If you still have questions, please first check the [Dockershim Removal FAQ](/blog/2022/02/17/dockershim-faq/).
