---
title: Compatibility Version For Kubernetes Control Plane Components
reviewers:
- jpbetz
- siyuanfoundation
content_type: concept
weight: 70
---

<!-- overview -->

Since release v1.32, we introduced configurable version compatibility and emulation options to Kubernetes control plane components to make upgrades safer by providing more control and increasing the granularity of steps available to cluster administrators.

<!-- body -->

## Emulated Version

The emulation option is set by the `--emulated-version` flag of control plane components. It allows the component to emulate the behavior (APIs, features, ...) of an earlier version of Kubernetes.

When used, the capabilities available will match the emulated version: 
* Any capabilities present in the binary version that were introduced after the emulation version will be unavailable. 
* Any capabilities removed after the emulation version will be available. 

This enables a binary from a particular Kubernetes release to emulate the behavior of a previous version with sufficient fidelity that interoperability with other system components can be defined in terms of the emulated version.

The `--emulated-version` must be <= `binaryVersion`. See the help message of the `--emulated-version` flag for supported range of emulated versions.