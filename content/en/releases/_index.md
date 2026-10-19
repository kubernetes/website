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

## Release History

{{< release-data >}}

## End-of-Life Releases

Older Kubernetes releases that are no longer maintained are listed below.

<details>
  <summary>End-of-life releases</summary>
  {{< note >}}
  These releases are no longer supported and do not receive security updates or bug fixes.
  If you are running one of these releases, the Kubernetes project strongly recommends upgrading to a [supported version](#release-history).
  {{< /note >}}
  
  {{< eol-releases >}}
</details>

## Upcoming Release

Check out the [schedule](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})
for the upcoming **{{< skew nextMinorVersion >}}** Kubernetes release!

{{< note >}}
This schedule link may be temporarily unavailable during early release planning phases.  
Check the [SIG Release repository](https://github.com/kubernetes/sig-release/tree/master/releases) for the latest updates.
{{< /note >}}

## Helpful Resources

Refer to the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team) resources 
for key information on roles and the release process.
