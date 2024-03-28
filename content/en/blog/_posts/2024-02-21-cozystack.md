---
layout: blog
title: "Introducing Cozystack: A Free PaaS Platform based on Kubernetes"
slug: first-release-of-cozystack
slug: introducing-cozystack-a-free-paas-platform-based-on-kubernetes
date: 2024-01-21
---

**Author**: Andrei Kvapil (Ænix)

[Published](https://github.com/aenix-io/cozystack/releases/tag/v0.1.0) the first release of the free PaaS platform [Cozystack](https://github.com/aenix-io/cozystack/releases/tag/v0.1.0), based on Kubernetes.
The project positioned as a ready-to-use platform for hosting providers and a framework for building private and public clouds. The code is [available](https://github.com/aenix-io/cozystack) on GitHub and is distributed under the Apache-2.0 license.

Cozystack is a system that is installed directly on servers and covers all aspects of preparing infrastructure for providing managed services. The installed platform allows to spawn tenant Kubernetes clusters, databases, and virtual machines on demand.

![Cozystack screenshot](https://cozystack.io/img/screenshot.png)

Talos Linux and Flux CD are used as the base technology stack. The kernel and all necessary kernel modules are pre-built into system images, which distributed and installed atomically.
This approach allows to eliminate moving parts and ensure stable operation.

KubeVirt technology is used to run virtual machines. It lets you run traditional virtual machines inside containers and comes with all the needed Cluster API integrations. This makes it possible to run and operate tenant Kubernetes clusters within a main Kubernetes cluster.

The platform includes a free implementation of the network fabric based on Kube-OVN and uses Cilium for service networking, MetalLB is used for external announcements.
Storage is implemented using LINSTOR, proposing ZFS as the base layer for storage and DRBD for replication.
A pre-configured monitoring stack based on VictoriaMetrics and Grafana is included.

One of the platform's key features is an easy installation method in a blank data center using PXE and a Debian-like installer, [talos-bootstrap](https://github.com/aenix-io/talos-bootstrap/).

[![talos-bootstrap](https://asciinema.org/a/627123.svg)](https://asciinema.org/a/627123?autoplay=1)

Despite commercial interest, the project is developed by the community enthusiasts.
It's planed to remain always free and open. To prove that we [submitted](https://github.com/cncf/sandbox/issues/87) a request for joining CNCF Sandbox.
