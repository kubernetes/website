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

## Minimum Compatibility Version

The version compatibility can be set by the `--min-compatibility-version` flag of control plane components. It controls the minimum version a control plane component is compatible with (in terms of storage versions, validation rules, ...). 

When used, the component tolerates workloads that expect the behavior of the specified minimum compatibility version, component skew ranges extend based on the minimum compatibility version, and rollbacks can be performed back to the specified minimum compatibility version.

When there is no need to rollback, setting `--min-compatibility-version=$(binaryVersion)` can be used to indicate that the cluster does not require any feature availability delay to support a compatibility range and benefit from access to all the latest available features.

The `--min-compatibility-version` must be <= `--emulated-version`. See the help message of the `--min-compatibility-version` flag for supported range of minimum compatibility versions.
