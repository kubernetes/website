---
layout: blog
title: "Kubernetes v1.34: Decoupling taint-manager from node-lifecycle-controller Moves to GA"
date: XXXX-XX-XX
slug: kubernetes-1-34-taint-eviction-controller
author: >
  Baofa Fan (DaoCloud),
---

## Background

The node controller was responsible for adding taints to nodes and evicting pods. But after 1.29,
the taint-based eviction implementation has been moved out of node controller into a separate,
and independent component called `taint-eviction-controller` which is enabled by default and 
gated with `SeparateTaintEvictionController`.

## What's new?

The feature gate `SeparateTaintEvictionController` has been promoted to GA in this release.
Users can optionally disable taint-based eviction by setting `--controllers=-taint-eviction-controller` 
in kube-controller-manager. 

## How can I learn more?

For more details, refer to the [KEP](http://kep.k8s.io/3902) and [Blog](/blog/2023/12/19/taint-eviction-controller).

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
