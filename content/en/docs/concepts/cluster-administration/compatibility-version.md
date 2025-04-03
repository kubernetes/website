---
title: Compatibility Version for Kubernetes Control Plane Components
reviewers:
- jpbetz
- siyuanfoundation
content_type: concept
weight: 70
---

<!-- overview -->

Since Kubernetes v1.32, configurable version compatibility and emulation options have been introduced for control plane components. These enhancements provide cluster administrators with greater control over upgrades, enabling safer transitions and minimizing compatibility risks.

<!-- body -->

## Emulated Version

The `--emulated-version` flag allows a control plane component to emulate the behavior of an earlier Kubernetes version. When set, the component's available capabilities align with the specified emulated version:

* Features introduced after the emulated version are disabled.
* Features that were removed after the emulated version can be configured again based on their default settings.

This enables a binary from a specific Kubernetes release to emulate the behavior of an earlier version with high fidelity, ensuring interoperability with other system components based on the emulated version.

The `--emulated-version` must be <= `binaryVersion`. Refer to the help message of the `--emulated-version` flag for the supported range of emulated versions.

## Benefits for Cluster Administrators

Using version emulation provides several advantages for cluster administrators:

* **Controlled Upgrades**: Allows administrators to upgrade the control plane with more granular steps, so that failures are more easily diagnosed and more easily auto-reverted on a failure condition.
* **Skip Binary Version Upgrade**: It is possible to skip binary versions while still performing a stepwise upgrade of Kubernetes control-plane.
* **Rollback Flexibility**: Provides an additional safeguard by allowing reversion to a previous emulated version without immediate downgrades, minimizing downtime and operational disruptions.

By leveraging version emulation, administrators can enhance the stability and reliability of Kubernetes clusters while managing upgrades with greater confidence.
