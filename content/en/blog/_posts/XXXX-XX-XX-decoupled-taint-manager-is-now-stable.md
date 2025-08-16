---
layout: blog
title: "Kubernetes v1.34: Decoupled Taint Manager Is Now Stable"
draft: true
date: 2025-XX-XX
slug: kubernetes-v1-34-decoupled-taint-manager-is-now-stable
author: >
  Baofa Fan (DaoCloud)
---

This enhancement separates the responsibility of managing node lifecycle and pod eviction into two distinct components.
Previously, the node lifecycle controller handled both marking nodes as unhealthy with NoExecute taints and evicting pods from them.
Now, a dedicated taint eviction controller manages the eviction process, while the node lifecycle controller focuses solely on applying taints.
This separation not only improves code organization but also makes it easier to improve taint eviction controller or build custom implementations of the taint based eviction.

## What's new?

The feature gate `SeparateTaintEvictionController` has been promoted to GA in this release.
Users can optionally disable taint-based eviction by setting `--controllers=-taint-eviction-controller` 
in kube-controller-manager. 

## How can I learn more?

For more details, refer to the [KEP](http://kep.k8s.io/3902) and to the beta announcement article: [Kubernetes 1.29: Decoupling taint manager from node lifecycle controller](/blog/2023/12/19/kubernetes-1-29-taint-eviction-controller/).

## How to get involved?

We offer a huge thank you to all the contributors who helped with design,
implementation, and review of this feature and helped move it from beta to stable:

- Ed Bartosh (@bart0sh)
- Yuan Chen (@yuanchen8911)
- Aldo Culquicondor (@alculquicondor)
- Baofa Fan (@carlory)
- Sergey Kanzhelev (@SergeyKanzhelev)
- Tim Bannister (@lmktfy)
- Maciej Skoczeń (@macsko)
- Maciej Szulik (@soltysh)
- Wojciech Tyczynski (@wojtek-t)
