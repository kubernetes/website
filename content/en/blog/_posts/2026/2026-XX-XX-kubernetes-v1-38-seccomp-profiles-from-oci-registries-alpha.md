---
layout: blog
title: "Kubernetes v1.38: Seccomp profiles from OCI registries (alpha)"
draft: true
slug: kubernetes-v1-38-seccomp-profiles-from-oci-registries-alpha
author: >
  [Sascha Grunert](https://github.com/saschagrunert) (Red Hat)
---

<!-- TODO: Feature blog for [KEP-6061](https://github.com/kubernetes/enhancements/issues/6061), seccomp profiles distributed as OCI artifacts, alpha in Kubernetes v1.38. Introduce `seccompProfile.type: OCI` with a digest-pinned `oci.ref`, the `SecurityProfileOCI` feature gate, and why profiles on every node were a problem. -->

## Why pull seccomp profiles from a registry?

<!-- TODO: Node image baking, DaemonSets, and the Security Profiles Operator as the alternatives, and what a registry adds: versioning, signing, the same credentials as images. -->

## How it works

<!-- TODO: The kubelet pulls the profile through the new CRI calls before the Pod starts; the container runtime merges it with its default profile (or a Localhost base profile) by intersection, so a pulled profile can only tighten. -->

## How to use it

<!-- TODO: Publishing a profile with ORAS, an example Pod, the events to look for, and the Pod Security Standards caveat in alpha. -->

## Container runtime support

<!-- TODO: CRI-O support and the state of containerd, Node Declared Features keeping Pods on capable nodes. -->

## What's next?

<!-- TODO: Beta plans: AppArmor, credential verification, Pod Security Standards; how to give feedback to SIG Node. -->
