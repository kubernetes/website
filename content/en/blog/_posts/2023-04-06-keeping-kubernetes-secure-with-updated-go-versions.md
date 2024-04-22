---
layout: blog
title: "Keeping Kubernetes Secure with Updated Go Versions"
date: 2023-04-06
slug: keeping-kubernetes-secure-with-updated-go-versions
author: >
   [Jordan Liggitt](https://github.com/liggitt) (Google)
---

### The problem

Since v1.19 (released in 2020), the Kubernetes project provides 12-14 months of patch releases for each minor version.
This enables users to qualify and adopt Kubernetes versions in an annual upgrade cycle and receive security fixes for a year.

The [Go project](https://github.com/golang/go/wiki/Go-Release-Cycle#release-maintenance) releases new minor versions twice a year,
and provides security fixes for the last two minor versions, resulting in about a year of support for each Go version.
Even though each new Kubernetes minor version is built with a supported Go version when it is first released,
that Go version falls out of support before the Kubernetes minor version does,
and the lengthened Kubernetes patch support since v1.19 only widened that gap.

At the time this was written, just over half of all [Go patch releases](https://go.dev/doc/devel/release) (88/171) have contained fixes for issues with possible security implications.
Even though many of these issues were not relevant to Kubernetes, some were, so it remained important to use supported Go versions that received those fixes.

An obvious solution would be to simply update Kubernetes release branches to new minor versions of Go.
However, Kubernetes avoids [destabilizing changes in patch releases](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/cherry-picks.md#what-kind-of-prs-are-good-for-cherry-picks),
and historically, this prevented updating existing release branches to new minor versions of Go, due to changes that were considered prohibitively complex, risky, or breaking to include in a patch release.
Examples include:

* Go 1.6: enabling http/2 by default
* Go 1.14: EINTR handling issues
* Go 1.17: dropping x509 CN support, ParseIP changes
* Go 1.18: disabling x509 SHA-1 certificate support by default
* Go 1.19: dropping current-dir LookPath behavior

Some of these changes could be easily mitigated in Kubernetes code,
some could only be opted out of via a user-specified `GODEBUG` envvar,
and others required invasive code changes or could not be avoided at all.
Because of this inconsistency, Kubernetes release branches have typically remained on a single Go minor version,
and risked being unable to pick up relevant Go security fixes for the last several months of each Kubernetes minor version's support lifetime.

When a relevant Go security fix was only available in newer Kubernetes minor versions,
users would have to upgrade away from older Kubernetes minor versions before their 12-14 month support period ended, just to pick up those fixes.
If a user was not prepared to do that upgrade, it could result in vulnerable Kubernetes clusters.
Even if a user could accommodate the unexpected upgrade, the uncertainty made Kubernetes' annual support less reliable for planning.

### The solution

We're happy to announce that the gap between supported Kubernetes versions and supported Go versions has been resolved as of January 2023.

We worked closely with the Go team over the past year to address the difficulties adopting new Go versions.
This prompted a [discussion](https://github.com/golang/go/discussions/55090), [proposal](https://github.com/golang/go/issues/56986),
[talk at GopherCon](https://www.youtube.com/watch?v=v24wrd3RwGo), and a [design](https://go.dev/design/56986-godebug) for improving backward compatibility in Go,
ensuring new Go versions can maintain compatible runtime behavior with previous Go versions for a minimum of two years (four Go releases).
This allows projects like Kubernetes to update release branches to supported Go versions without exposing users to behavior changes.

The proposed improvements are on track to be [included in Go 1.21](https://tip.golang.org/doc/godebug), and the Go team already delivered targeted compatibility improvements in a Go 1.19 patch release in late 2022.
Those changes enabled Kubernetes 1.23+ to update to Go 1.19 in January of 2023, while avoiding any user-facing configuration or behavior changes.
All supported Kubernetes release branches now use supported Go versions, and can pick up new Go patch releases with available security fixes.

Going forward, Kubernetes maintainers remain committed to making Kubernetes patch releases as safe and non-disruptive as possible,
so there are several requirements a new Go minor version must meet before existing Kubernetes release branches will update to use it:

1. The new Go version must be available for at least 3 months.
   This gives time for adoption by the Go community, and for reports of issues or regressions.
2. The new Go version must be used in a new Kubernetes minor release for at least 1 month.
   This ensures all Kubernetes release-blocking tests pass on the new Go version,
   and gives time for feedback from the Kubernetes community on release candidates and early adoption of the new minor release.
3. There must be no regressions from the previous Go version known to impact Kubernetes.
4. Runtime behavior must be preserved by default, without requiring any action by Kubernetes users / administrators.
5. Kubernetes libraries like `k8s.io/client-go` must remain compatible with the original Go version used for each minor release,
   so consumers won't *have* to update Go versions to pick up a library patch release (though they are encouraged to build with supported Go versions,
   which is made even easier with the [compatibility improvements](https://go.dev/design/56986-godebug) planned in Go 1.21).

The goal of all of this work is to unobtrusively make Kubernetes patch releases safer and more secure,
and to make Kubernetes minor versions safe to use for the entire duration of their support lifetime.

Many thanks to the Go team, especially Russ Cox, for helping drive these improvements in ways that will benefit all Go users, not just Kubernetes.
