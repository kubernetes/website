---
layout: blog
title: "Current State: 2019 Third Party Security Audit of Kubernetes"
date: 2022-10-05
slug: current-state-2019-third-party-audit
evergreen: true
author: >
  Cailyn Edwards (Shopify),
  Pushkar Joglekar (VMware),
  Rey Lejano (SUSE),
  Rory McCune (DataDog)
---

We expect the brand new Third Party Security Audit of Kubernetes will be
published later this month (Oct 2022).

In preparation for that, let's look at the state of findings that were made
public as part of the last [third party security audit of
2019](https://github.com/kubernetes/sig-security/tree/main/sig-security-external-audit/security-audit-2019)
that was based on [Kubernetes v1.13.4](https://github.com/kubernetes/kubernetes/tree/release-1.13).

## Motivation

[Craig Ingram](https://github.com/cji) has graciously attempted over the years to keep track of the
status of the findings reported in the last audit in this issue:
[kubernetes/kubernetes#81146](https://github.com/kubernetes/kubernetes/issues/81146).
This blog post will attempt to dive deeper into this, address any gaps
in tracking and become a point in time summary of the state of the
findings reported from 2019.

This article should also help readers gain confidence through transparent
communication, of work done by the community to address these findings and
bubble up any findings that need help from community contributors.

## Current State

The status of each issue / finding here is represented in a best effort manner.
Authors do not claim to be 100% accurate on the status and welcome any
corrections or feedback if the current state is not reflected accurately by
commenting directly on the relevant issue.

| **\#** | **Title**                                                                                                    | **Issue**                                                       | **Status**                                                                                                                                                                                                                      |
| ------ | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | hostPath PersistentVolumes enable PodSecurityPolicy bypass                                                   | [#81110](https://github.com/kubernetes/kubernetes/issues/81110) | closed, addressed by [kubernetes/website#15756](https://github.com/kubernetes/website/pull/15756) and [kubernetes/kubernetes#109798](https://github.com/kubernetes/kubernetes/pull/109798)                                                                                                                |
| 2      | Kubernetes does not facilitate certificate revocation                                                        | [#81111](https://github.com/kubernetes/kubernetes/issues/81111) | duplicate of [#18982](https://github.com/kubernetes/kubernetes/issues/18982) and **needs a KEP**                                                                                                                                    |
| 3      | HTTPS connections are not authenticated                                                                      | [#81112](https://github.com/kubernetes/kubernetes/issues/81112) | Largely left as an end user exercise in setting up the right configuration                                                                                                                                                      |
| 4      | <abbr title="Time-of-check to time-of-use bug">TOCTOU</abbr> when moving PID to manager's cgroup via kubelet | [#81113](https://github.com/kubernetes/kubernetes/issues/81113) | Requires Node access for successful exploitation. Fix needed                                                                                                                                                                    |
| 5      | Improperly patched directory traversal in `kubectl cp`                                                         | [#76788](https://github.com/kubernetes/kubernetes/pull/76788)   | closed, assigned [CVE-2019-11249](https://github.com/advisories/GHSA-v8c4-hw4j-x4pr), fixed in [#80436](https://github.com/kubernetes/kubernetes/pull/80436)                                                                    |
| 6      | Bearer tokens are revealed in logs                                                                           | [#81114](https://github.com/kubernetes/kubernetes/issues/81114) | closed, assigned [CVE-2019-11250](https://github.com/advisories/GHSA-jmrx-5g74-6v2f), fixed in [#81330](https://github.com/kubernetes/kubernetes/pull/81330)                                                                    |
| 7      | Seccomp is disabled by default                                                                               | [#81115](https://github.com/kubernetes/kubernetes/issues/81115) | closed, addressed by [#101943](https://github.com/kubernetes/kubernetes/pull/101943)                                                                                                                                            |
| 8      | Pervasive world-accessible file permissions                                                                  | [#81116](https://github.com/kubernetes/kubernetes/issues/81116) | [#112384](https://github.com/kubernetes/kubernetes/pull/112384) ( in progress)                                                                                                                                                  |
| 9      | Environment variables expose sensitive data                                                                  | [#81117](https://github.com/kubernetes/kubernetes/issues/81117) | closed, addressed by [#84992](https://github.com/kubernetes/kubernetes/pull/84992) and [#84677](https://github.com/kubernetes/kubernetes/pull/84677)                                                                            |
| 10     | Use of InsecureIgnoreHostKey in SSH connections                                                              | [#81118](https://github.com/kubernetes/kubernetes/issues/81118) | This feature was removed in v1.22: [#102297](https://github.com/kubernetes/kubernetes/pull/102297)                                                                                                                              |
| 11     | Use of InsecureSkipVerify and other TLS weaknesses                                                           | [#81119](https://github.com/kubernetes/kubernetes/issues/81119) | **Needs a KEP**                                                                                                                                                                                                                     |
| 12     | `kubeadm` performs potentially-dangerous reset operations                                                    | [#81120](https://github.com/kubernetes/kubernetes/issues/81120) | closed, fixed by [#81495](https://github.com/kubernetes/kubernetes/pull/81495), [#81494](https://github.com/kubernetes/kubernetes/pull/81494), and [kubernetes/website#15881](https://github.com/kubernetes/website/pull/15881) |
| 13     | Overflows when using strconv.Atoi and downcasting the result                                                 | [#81121](https://github.com/kubernetes/kubernetes/issues/81121) | closed, fixed by [#89120](https://github.com/kubernetes/kubernetes/pull/89120)                                                                                                                                                  |
| 14     | kubelet can cause an Out of Memory error with a malicious manifest                                           | [#81122](https://github.com/kubernetes/kubernetes/issues/81122) | closed, fixed by [#76518](https://github.com/kubernetes/kubernetes/pull/76518)                                                                                                                                                  |
| 15     | `kubectl` can cause an Out Of Memory error with a malicious Pod specification                                | [#81123](https://github.com/kubernetes/kubernetes/issues/81123) | Fix needed                                                                                                                                                                                                                      |
| 16     | Improper fetching of PIDs allows incorrect cgroup movement                                                   | [#81124](https://github.com/kubernetes/kubernetes/issues/81124) | Fix needed                                                                                                                                                                                                                      |
| 17     | Directory traversal of host logs running kube-apiserver and kubelet                                          | [#81125](https://github.com/kubernetes/kubernetes/issues/81125) | closed, fixed by [#87273](https://github.com/kubernetes/kubernetes/pull/87273)                                                                                                                                                  |
| 18     | Non-constant time password comparison                                                                        | [#81126](https://github.com/kubernetes/kubernetes/issues/81126) | closed, fixed by [#81152](https://github.com/kubernetes/kubernetes/pull/81152)                                                                                                                                                  |
| 19     | Encryption recommendations not in accordance with best practices                                             | [#81127](https://github.com/kubernetes/kubernetes/issues/81127) | Work in Progress                                                                                                                                                                                                                |
| 20     | Adding credentials to containers by default is unsafe                                                        | [#81128](https://github.com/kubernetes/kubernetes/issues/81128) | Closed, fixed by [#89193](https://github.com/kubernetes/kubernetes/pull/89193)                                                                                                                                                  |
| 21     | kubelet liveness probes can be used to enumerate host network                                                | [#81129](https://github.com/kubernetes/kubernetes/issues/81129) | **Needs a KEP**                                                                                                                                                                                                                     |
| 22     | iSCSI volume storage cleartext secrets in logs                                                               | [#81130](https://github.com/kubernetes/kubernetes/issues/81130) | closed, fixed by [#81215](https://github.com/kubernetes/kubernetes/pull/81215)                                                                                                                                                  |
| 23     | Hard coded credential paths                                                                                  | [#81131](https://github.com/kubernetes/kubernetes/issues/81131) | closed, awaiting more evidence                                                                                                                                                                                                  |
| 24     | Log rotation is not atomic                                                                                   | [#81132](https://github.com/kubernetes/kubernetes/issues/81132) | Fix needed                                                                                                                                                                                                                      |
| 25     | Arbitrary file paths without bounding                                                                        | [#81133](https://github.com/kubernetes/kubernetes/issues/81133) | Fix needed.                                                                                                                                                                                                                     |
| 26     | Unsafe JSON construction                                                                                     | [#81134](https://github.com/kubernetes/kubernetes/issues/81134) | Partially fixed                                                                                                                                                                                                                 |
| 27     | kubelet crash due to improperly handled errors                                                               | [#81135](https://github.com/kubernetes/kubernetes/issues/81135) | Closed. Fixed by [#81135](https://github.com/kubernetes/kubernetes/issues/81135)                                                                                                                                                |
| 28     | Legacy tokens do not expire                                                                                  | [#81136](https://github.com/kubernetes/kubernetes/issues/81136) | closed, fixed as part of [#70679](https://github.com/kubernetes/kubernetes/issues/70679)                                                                                                                                        |
| 29     | CoreDNS leaks internal cluster information across namespaces                                                 | [#81137](https://github.com/kubernetes/kubernetes/issues/81137) | Closed, resolved with CoreDNS v1.6.2. [#81137](https://github.com/kubernetes/kubernetes/issues/81137) (comment)                                                                                                                 |
| 30     | Services use questionable default functions                                                                  | [#81138](https://github.com/kubernetes/kubernetes/issues/81138) | Fix needed                                                                                                                                                                                                                      |
| 31     | Incorrect docker daemon process name in container manager                                                    | [#81139](https://github.com/kubernetes/kubernetes/issues/81139) | closed, fixed by [#81083](https://github.com/kubernetes/kubernetes/pull/81083)                                                                                                                                                  |
| 32     | Use standard formats everywhere                                                                              | [#81140](https://github.com/kubernetes/kubernetes/issues/81140) | **Needs a KEP**                                                                                                                                                                                                                     |
| 33     | Superficial health check provides false sense of safety                                                      | [#81141](https://github.com/kubernetes/kubernetes/issues/81141) | closed, fixed by [#81319](https://github.com/kubernetes/kubernetes/pull/81319)                                                                                                                                                  |
| 34     | Hardcoded use of insecure gRPC transport                                                                     | [#81142](https://github.com/kubernetes/kubernetes/issues/81142) | **Needs a KEP**                                                                                                                                                                                                                     |
| 35     | Incorrect handling of `Retry-After`                                                                          | [#81143](https://github.com/kubernetes/kubernetes/issues/81143) | closed, fixed by [#91048](https://github.com/kubernetes/kubernetes/pull/91048)                                                                                                                                                  |
| 36     | Incorrect isKernelPid check                                                                                  | [#81144](https://github.com/kubernetes/kubernetes/issues/81144) | closed, fixed by [#81086](https://github.com/kubernetes/kubernetes/pull/81086)                                                                                                                                                  |
| 37     | Kubelet supports insecure TLS ciphersuites                                                                   | [#81145](https://github.com/kubernetes/kubernetes/issues/81145) | closed but fix needed for [#91444](https://github.com/kubernetes/kubernetes/issues/91444) (see [this comment](https://github.com/kubernetes/kubernetes/issues/81145#issuecomment-630291221))                                    |


### Inspired outcomes

Apart from fixes to the specific issues, the 2019 third party security audit
also motivated security focussed enhancements in the next few releases of
Kubernetes. One such example is
[Kubernetes Enhancement Proposal (KEP) 1933 Defend Against Logging Secrets via Static Analysis](https://github.com/kubernetes/enhancements/tree/master/keps/sig-security/1933-secret-logging-static-analysis) to prevent exposing
secrets to logs with [Patrick Rhomberg](@PurelyApplied) driving the
implementation. As a result of this KEP,
[`go-flow-levee`](https://github.com/google/go-flow-levee), a taint propagation
analysis tool configured to detect logging of secrets, is executed in a
[script](https://github.com/kubernetes/kubernetes/blob/master/hack/verify-govet-levee.sh)
as a Prow presubmit job. This KEP was introduced in v1.20.0 as an alpha
feature, then graduated to beta in v1.21.0, and graduated to stable in
v1.23.0. As stable, the analysis runs as a blocking presubmit test. This
KEP also helped resolve the following issues from the 2019 third party security audit:

- [#81114 Bearer tokens are revealed in logs](https://github.com/kubernetes/kubernetes/issues/81114)
- [#81117 Environment variables expose sensitive data](https://github.com/kubernetes/kubernetes/issues/81117)
- [#81130 iSCSI volume storage cleartext secrets in logs](https://github.com/kubernetes/kubernetes/issues/81130)

## Remaining Work

Many of the 37 findings identified were fixed by work from
our community members over the last 3 years. However, we still have some work
left to do. Here's a breakdown of remaining work with rough estimates on
time commitment, complexity and benefits to the ecosystem on fixing
these pending issues.

{{<note>}}

Anything requiring a KEP (Kubernetes Enhancement Proposal) is considered
_high_ time commitment and _high_ complexity. Benefits to Ecosystem are
roughly equivalent to risk of keeping the finding unfixed which is
determined by Severity Level + Likelihood of a successful vulnerability
exploit. These estimates and values in the table below are the authors'
personal opinion. An individual or end users' threat model may rate the
benefits to fix a particular issue higher or lower.

{{</note>}}

| Title                                                                                                        | Issue                                                           | Time Commitment | Complexity | Benefit to Ecosystem |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | --------------- | ---------- | -------------------- |
| Kubernetes does not facilitate certificate revocation                                                        | [#81111](https://github.com/kubernetes/kubernetes/issues/81111) | High            | High       | Medium               |
| Use of InsecureSkipVerify and other TLS weaknesses                                                           | [#81119](https://github.com/kubernetes/kubernetes/issues/81119) | High            | High       | Medium               |
| `kubectl` can cause a local Out Of Memory error with a malicious Pod specification                             | [#81123](https://github.com/kubernetes/kubernetes/issues/81123) | Medium          | Medium     | Medium               |
| Improper fetching of PIDs allows incorrect cgroup movement                                                   | [#81124](https://github.com/kubernetes/kubernetes/issues/81124) | Medium          | Medium     | Medium               |
| kubelet liveness probes can be used to enumerate host network                                                | [#81129](https://github.com/kubernetes/kubernetes/issues/81129) | High            | High       | Medium               |
| API Server supports insecure TLS ciphersuites                                                                | [#81145](https://github.com/kubernetes/kubernetes/issues/81145) | Medium          | Medium     | Low                  |
| <abbr title="Time-of-check to time-of-use bug">TOCTOU</abbr> when moving PID to manager's cgroup via kubelet | [#81113](https://github.com/kubernetes/kubernetes/issues/81113) | Medium          | Medium     | Low                  |
| Log rotation is not atomic                                                                                   | [#81132](https://github.com/kubernetes/kubernetes/issues/81132) | Medium          | Medium     | Low                  |
| Arbitrary file paths without bounding                                                                        | [#81133](https://github.com/kubernetes/kubernetes/issues/81133) | Medium          | Medium     | Low                  |
| Services use questionable default functions                                                                  | [#81138](https://github.com/kubernetes/kubernetes/issues/81138) | Medium          | Medium     | Low                  |
| Use standard formats everywhere                                                                              | [#81140](https://github.com/kubernetes/kubernetes/issues/81140) | High            | High       | Very Low             |
| Hardcoded use of insecure gRPC transport                                                                     | [#81142](https://github.com/kubernetes/kubernetes/issues/81142) | High            | High       | Very Low             |

To get started on fixing any of these findings that need help, please
consider getting involved in [Kubernetes SIG
Security](https://github.com/kubernetes/community/tree/master/sig-security#contact)
by joining our bi-weekly meetings or hanging out with us on our Slack
Channel.
