---
linktitle: Release History
title: Releases
type: docs
layout: release-info
notoc: true
---

<!-- overview -->

The Kubernetes project maintains release branches for the most recent three minor releases
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
Kubernetes 1.19 and newer receive
[approximately 1 year of patch support](/releases/patch-releases/#support-period).
Kubernetes 1.18 and older received approximately 9 months of patch support.

Kubernetes versions are expressed as **x.y.z**,
where **x** is the major version, **y** is the minor version, and **z** is the patch version,
following [Semantic Versioning](https://semver.org/) terminology.

More information in the [version skew policy](/releases/version-skew-policy/) document.

<!-- body -->

## Version Compatibility Mode (Version Emulation)

Starting with Kubernetes v1.33, clusters can be configured to run in **Version Compatibility Mode**. This mode allows a newer Kubernetes version (e.g., v1.33) to emulate an older version (e.g., v1.31), ensuring compatibility with workloads, Helm charts, or tools that rely on specific Kubernetes versions.

### Operational Overview

In Version Compatibility Mode, the API server operates in accordance with the specifications of the emulated version. For example, when running a Kubernetes v1.33 cluster in compatibility mode for v1.31, the API adheres to v1.31's standards and behavior, while the underlying cluster remains on v1.33.

### Use Cases

- **Helm charts or workloads**: Suitable for workloads designed for a specific Kubernetes version, ensuring compatibility while testing or migrating to a newer release.
- **Legacy API support**: Enables applications dependent on APIs that were modified or deprecated in newer versions to function without immediate changes.

### Limitations

- **Limited feature compatibility**: Certain features deprecated or removed in the newer version may not behave as expected, even when the API is emulating an older version.
- **Partial compatibility**: Version Compatibility Mode ensures API compatibility, but other Kubernetes components and behaviors may still follow the newer version.

## Release History

{{< release-data >}}

## Upcoming Release

Check out the [schedule](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})
for the upcoming **{{< skew nextMinorVersion >}}** Kubernetes release!

## Helpful Resources

Refer to the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team) resources 
for key information on roles and the release process.
