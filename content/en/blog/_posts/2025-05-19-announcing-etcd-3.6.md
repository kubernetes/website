---
layout: blog
title: "Announcing etcd v3.6.0"
date: 2025-05-15T16:00:00-08:00
slug: announcing-etcd-3.6
author: >
  Benjamin Wang (VMware by Broadcom)
canonicalUrl: "https://etcd.io/blog/2025/announcing-etcd-3.6/"
---

_This announcement originally [appeared](https://etcd.io/blog/2025/announcing-etcd-3.6/) on the etcd blog._

Today, we are releasing [etcd v3.6.0][], the first minor release since etcd v3.5.0 on June 15, 2021. This release
introduces several new features, makes significant progress on long-standing efforts like downgrade support and
migration to v3store, and addresses numerous critical & major issues. It also includes major optimizations in
memory usage, improving efficiency and performance.

In addition to the features of v3.6.0, etcd has joined Kubernetes as a SIG (sig-etcd), enabling us to improve
project sustainability. We've introduced systematic robustness testing to ensure correctness and reliability.
Through the etcd-operator Working Group, we plan to improve usability as well.

What follows are the most significant changes introduced in etcd v3.6.0, along with the discussion of the
roadmap for future development. For a detailed list of changes, please refer to the [CHANGELOG-3.6][].

A heartfelt thank you to all the contributors who made this release possible!

## Security

etcd takes security seriously. To enhance software security in v3.6.0, we have improved our workflow checks by
integrating `govulncheck` to scan the source code and `trivy` to scan container images. These improvements
have also been backported to supported stable releases.

etcd continues to follow the [Security Release Process][] to ensure vulnerabilities are properly managed and addressed.

## Features

### Migration to v3store

The v2store has been deprecated since etcd v3.4 but could still be enabled via `--enable-v2`. It remained the source of
truth for membership data. In etcd v3.6.0, v2store can no longer be enabled as the `--enable-v2` flag has been removed,
and v3store has become the sole source of truth for membership data.

While v2store still exists in v3.6.0, etcd will fail to start if it contains any data other than membership information.
To assist with migration, etcd v3.5.18+ provides the `etcdutl check v2store` command, which verifies that v2store
contains only membership data (see [PR 19113][]).

Compared to v2store, v3store offers better performance and transactional support. It is also the actively maintained
storage engine moving forward.

The removal of v2store is still ongoing and is tracked in [issues/12913][].

### Downgrade

etcd v3.6.0 is the first version to fully support downgrade. The effort for this downgrade task spans
both versions 3.5 and 3.6, and all related work is tracked in [issues/11716][].

At a high level, the process involves migrating the data schema to the target version (e.g., v3.5),
followed by a rolling downgrade.

Ensure the cluster is healthy, and take a snapshot backup. Validate whether the downgrade is valid:

```bash
$ etcdctl downgrade validate 3.5
Downgrade validate success, cluster version 3.6
```

If the downgrade is valid, enable downgrade mode:

```bash
$ etcdctl downgrade enable 3.5
Downgrade enable success, cluster version 3.6
```

etcd will then migrate the data schema in the background. Once complete, proceed with the rolling downgrade.

For details, refer to the [Downgrade-3.6] guide.

### Feature gates

In etcd v3.6.0, we introduced Kubernetes-style feature gates for managing new features. Previously, we
indicated unstable features through the `--experimental` prefix in feature flag names. The prefix was removed
once the feature was stable, causing a breaking change. Now, features will start in Alpha, progress
to Beta, then GA, or get deprecated. This ensures a much smoother upgrade and downgrade experience for users.

See [feature-gates][] for details.

### livez / readyz checks {#livezreadyz-checks}

etcd now supports `/livez` and `/readyz` endpoints, aligning with Kubernetes' Liveness and Readiness probes.
`/livez` indicates whether the etcd instance is alive, while `/readyz` indicates when it is ready to serve requests.
This feature has also been backported to release-3.5 (starting from v3.5.11) and release-3.4 (starting from v3.4.29).
See [livez/readyz][] for details.

The existing `/health` endpoint remains functional. `/livez` is similar to `/health?serializable=true`, while
`/readyz` is similar to `/health` or `/health?serializable=false`. Clearly, the `/livez` and `/readyz`
endpoints provide clearer semantics and are easier to understand.

### v3discovery

In etcd v3.6.0, the new discovery protocol [v3discovery][] was introduced, based on clientv3.
It facilitates the discovery of all cluster members during the bootstrap phase.

The previous [v2discovery][] protocol, based on clientv2, has been deprecated. Additionally,
the public discovery service at <https://discovery.etcd.io/>, which relied on v2discovery, is no longer maintained.

## Performance

### Memory

In this release, we reduced average memory consumption by at least 50% (see Figure 1). This improvement is primarily due to two changes:

- The default value of `--snapshot-count` has been reduced from 100,000 in v3.5 to 10,000 in v3.6. As a result, etcd v3.6 now retains only about 10% of the history records compared to v3.5.
- Raft history is compacted more frequently, as introduced in [PR/18825][].

![figure-1](../2025-05-19-announcing-etcd-3.6/figure-1.png "Diagram of memory usage")

_**Figure 1:** Memory usage comparison between etcd v3.5.20 and v3.6.0-rc.2 under different read/write ratios.
Each subplot shows the memory usage over time with a specific read/write ratio. The red line represents etcd
v3.5.20, while the teal line represents v3.6.0-rc.2. Across all tested ratios, v3.6.0-rc.2 exhibits lower and
more stable memory usage._

### Throughput

Compared to v3.5, etcd v3.6 delivers an average performance improvement of approximately 10%
in both read and write throughput (see Figure 2, 3, 4 and 5). This improvement is not attributed to
any single major change, but rather the cumulative effect of multiple minor enhancements. One such
example is the optimization of the free page queries introduced in [PR/419][].

![figure-2](../2025-05-19-announcing-etcd-3.6/figure-2.png "etcd read transaction performance with a high write ratio")

_**Figure 2:** Read throughput comparison between etcd v3.5.20 and v3.6.0-rc.2 under a high write ratio. The
read/write ratio is 0.0078, meaning 1 read per 128 writes. The right bar shows the percentage improvement
in read throughput of v3.6.0-rc.2 over v3.5.20, ranging from 3.21% to 25.59%._

![figure-3](../2025-05-19-announcing-etcd-3.6/figure-3.png "etcd read transaction performance with a high read ratio")

_**Figure 3:** Read throughput comparison between etcd v3.5.20 and v3.6.0-rc.2 under a high read ratio.
The read/write ratio is 8, meaning 8 reads per write. The right bar shows the percentage improvement in
read throughput of v3.6.0-rc.2 over v3.5.20, ranging from 4.38% to 27.20%._

![figure-4](../2025-05-19-announcing-etcd-3.6/figure-4.png "etcd write transaction performance with a high write ratio")

_**Figure 4:** Write throughput comparison between etcd v3.5.20 and v3.6.0-rc.2 under a high write ratio. The
read/write ratio is 0.0078, meaning 1 read per 128 writes. The right bar shows the percentage improvement
in write throughput of v3.6.0-rc.2 over v3.5.20, ranging from 2.95% to 24.24%._

![figure-5](../2025-05-19-announcing-etcd-3.6/figure-5.png "etcd write transaction performance with a high read ratio")

_**Figure 5:** Write throughput comparison between etcd v3.5.20 and v3.6.0-rc.2 under a high read ratio.
The read/write ratio is 8, meaning 8 reads per write. The right bar shows the percentage improvement in
write throughput of v3.6.0-rc.2 over v3.5.20, ranging from 3.86% to 28.37%._

## Breaking changes

This section highlights a few notable breaking changes. For a complete list, please refer to
the [Upgrade etcd from v3.5 to v3.6][] and the [CHANGELOG-3.6][].

Old binaries are incompatible with new schema versions

Old etcd binaries are not compatible with newer data schema versions. For example, etcd 3.5 cannot start with
data created by etcd 3.6, and etcd 3.4 cannot start with data created by either 3.5 or 3.6.

When downgrading etcd, it's important to follow the documented downgrade procedure. Simply replacing
the binary or image will result in the incompatibility issue.

### Peer endpoints no longer serve client requests

Client endpoints (`--advertise-client-urls`) are intended to serve client requests only, while peer
endpoints (`--initial-advertise-peer-urls`) are intended solely for peer communication. However, due to an implementation
oversight, the peer endpoints were also able to handle client requests in etcd 3.4 and 3.5. This behavior was misleading and
encouraged incorrect usage patterns. In etcd 3.6, this misleading behavior was corrected via [PR/13565][]; peer endpoints
no longer serve client requests.

### Clear boundary between etcdctl and etcdutl

Both `etcdctl` and `etcdutl` are command line tools. `etcdutl` is an offline utility designed to operate directly on
etcd data files, while `etcdctl` is an online tool that interacts with etcd over a network. Previously, there were some
overlapping functionalities between the two, but these overlaps were removed in 3.6.0.

- Removed `etcdctl defrag --data-dir`

  The `etcdctl defrag` command only support online defragmentation and no longer supports offline defragmentation.
To perform offline defragmentation, use the `etcdutl defrag --data-dir` command instead.

- Removed `etcdctl snapshot status`

  `etcdctl` no longer supports retrieving the status of a snapshot. Use the `etcdutl snapshot status` command instead.

- Removed `etcdctl snapshot restore`

  `etcdctl` no longer supports restoring from a snapshot. Use the `etcdutl snapshot restore` command instead.

## Critical bug fixes

Correctness has always been a top priority for the etcd project. In the process of developing 3.6.0, we found and
fixed a few notable bugs that could lead to data inconsistency in specific cases. These fixes have been backported
to previous releases, but we believe they deserve special mention here.

- Data Inconsistency when Crashing Under Load

Previously, when etcd was applying data, it would update the consistent-index first, followed by committing the
data. However, these operations were not atomic. If etcd crashed in between, it could lead to data inconsistency
(see [issue/13766][]). The issue was introduced in v3.5.0, and fixed in v3.5.3 with [PR/13854][].

- Durability API guarantee broken in single node cluster

When a client writes data and receives a success response, the data is expected to be persisted. However, the data might
be lost if etcd crashes immediately after sending the success response to the client. This was a legacy issue (see [issue/14370][])
affecting all previous releases. It was addressed in v3.4.21 and v3.5.5 with [PR/14400][], and fixed in raft side in
main branch (now release-3.6) with [PR/14413][].

- Revision Inconsistency when Crashing During Defragmentation

If etcd crashed during the defragmentation operation, upon restart, it might reapply
some entries which had already been applied, accordingly leading to the revision inconsistency issue
(see the discussions in [PR/14685][]). The issue was introduced in v3.5.0, and fixed in v3.5.6 with [PR/14730][].

## Upgrade issue

This section highlights a common issue [issues/19557][] in the etcd v3.5 to v3.6 upgrade that may cause the upgrade
process to fail. For a complete upgrade guide, refer to [Upgrade etcd from v3.5 to v3.6][].

The issue was introduced in etcd v3.5.1, and resolved in v3.5.20.

**Key takeaway**: users are required to first upgrade to etcd v3.5.20 (or a higher patch version) before upgrading
to etcd v3.6.0; otherwise, the upgrade may fail.

For more background and technical context, see [upgrade_from_3.5_to_3.6_issue][].

## Testing

We introduced the [Robustness testing][] to verify correctness, which has always been our top priority.
It plays traffic of various types and volumes against an etcd cluster, concurrently injects a random
failpoint, records all operations (including both requests and responses), and finally performs a
linearizability check. It also verifies that the [Watch APIs][] guarantees have not been violated.
The robustness test increases our confidence in ensuring the quality of each etcd release.

We have migrated most of the etcd workflow tests to Kubernetes' Prow testing infrastructure to
take advantage of its benefit, such as nice dashboards for viewing test results and the ability
for contributors to rerun failed tests themselves.

## Platforms

While retaining all existing supported platforms, we have promoted Linux/ARM64 to Tier 1 support.
For more details, please refer to [issues/15951][]. For the complete list of supported platforms,
see [supported-platform][].

## Dependencies

### Dependency bumping guide

We have published an official guide on how to bump dependencies for etcd’s main branch and stable releases.
It also covers how to update the Go version. For more details, please refer to [dependency_management][].
With this guide available, any contributors can now help with dependency upgrades.

### Core Dependency Updates

[bbolt][] and [raft][] are two core dependencies of etcd.

Both etcd v3.4 and v3.5 depend on bbolt v1.3, while etcd v3.6 depends on bbolt v1.4.

For the release-3.4 and release-3.5 branches, raft is included in the etcd repository itself, so etcd v3.4 and v3.5
do not depend on an external raft module. Starting from etcd v3.6, raft was moved to a separate repository ([raft][]),
and the first standalone raft release is v3.6.0. As a result, etcd v3.6.0 depends on raft v3.6.0.

Please see the table below for a summary:

| etcd versions | bbolt versions | raft versions |
|---------------|----------------|---------------|
| 3.4.x         | v1.3.x         | N/A           |
| 3.5.x         | v1.3.x         | N/A           |
| 3.6.x         | v1.4.x         | v3.6.x        |

### grpc-gateway@v2

We upgraded [grpc-gateway][] from v1 to v2 via [PR/16595][] in etcd v3.6.0. This is a major step toward
migrating to [protobuf-go][], the second major version of the Go protocol buffer API implementation.

grpc-gateway@v2 is designed to work with [protobuf-go][]. However, etcd v3.6 still depends on the deprecated
[gogo/protobuf][], which is actually protocol buffer v1 implementation. To resolve this incompatibility,
we applied a [patch][] to the generated *.pb.gw.go files to convert v1 messages to v2 messages.

### grpc-ecosystem/go-grpc-middleware/providers/prometheus

We switched from the deprecated (and archived) [grpc-ecosystem/go-grpc-prometheus][] to
[grpc-ecosystem/go-grpc-middleware/providers/prometheus][] via [PR/19195][]. This change ensures continued
support and access to the latest features and improvements in the gRPC Prometheus integration.

## Community

There are exciting developments in the etcd community that reflect our ongoing commitment
to strengthening collaboration, improving maintainability, and evolving the project’s governance.

### etcd Becomes a Kubernetes SIG

etcd has officially become a Kubernetes Special Interest Group: SIG-etcd. This change reflects
etcd’s critical role as the primary datastore for Kubernetes and establishes a more structured
and transparent home for long-term stewardship and cross-project collaboration. The new SIG
designation will help streamline decision-making, align roadmaps with Kubernetes needs,
and attract broader community involvement.

### New contributors, maintainers, and reviewers

We’ve seen increasing engagement from contributors, which has resulted in the addition of three new maintainers:

- [fuweid][]
- [jmhbnz][]
- [wenjiaswe][]

Their continued contributions have been instrumental in driving the project forward.

We also welcome two new reviewers to the project:

- [ivanvc][]
- [siyuanfoundation][]

We appreciate their dedication to code quality and their willingness to take on broader review responsibilities
within the community.

New release team

We've formed a new release team led by [ivanvc][] and [jmhbnz][], streamlining the release process by automating
many previously manual steps. Inspired by Kubernetes SIG Release, we've adopted several best practices, including
clearly defined release team roles and the introduction of release shadows to support knowledge sharing and team
sustainability. These changes have made our releases smoother and more reliable, allowing us to approach each
release with greater confidence and consistency.

### Introducing the etcd Operator Working Group

To further advance etcd’s operational excellence, we have formed a new working group: [WG-etcd-operator][].
The working group is dedicated to enabling the automatic and efficient operation of etcd clusters that run in
the Kubernetes environment using an etcd-operator.

## Future Development

The legacy v2store has been deprecated since etcd v3.4, and the flag `--enable-v2` was removed entirely in v3.6.
This means that starting from v3.6, there is no longer a way to enable or use the v2store. However, etcd still
bootstraps internally from the legacy v2 snapshots. To address this inconsistency, We plan to change etcd to
bootstrap from the v3store and replay the WAL entries based on the `consistent-index`. The work is being tracked
in [issues/12913].

One of the most persistent challenges remains the large range of queries from the kube-apiserver, which can
lead to process crashes due to their unpredictable nature. The range stream feature, originally outlined in
the [v3.5 release blog/Future roadmaps][], remains an idea worth revisiting to address the challenges of large
range queries.

For more details and upcoming plans, please refer to the [etcd roadmap][].

[etcd v3.6.0]: https://github.com/etcd-io/etcd/releases/tag/v3.6.0
[CHANGELOG-3.6]: https://github.com/etcd-io/etcd/blob/main/CHANGELOG/CHANGELOG-3.6.md
[Security Release Process]: https://github.com/etcd-io/etcd/blob/main/security/security-release-process.md
[PR 19113]: https://github.com/etcd-io/etcd/pull/19113
[issues/12913]: https://github.com/etcd-io/etcd/issues/12913
[issues/11716]: https://github.com/etcd-io/etcd/issues/11716
[Downgrade-3.6]: https://etcd.io/docs/v3.6/downgrades/downgrade_3_6/
[feature-gates]: https://etcd.io/docs/v3.6/feature-gates/
[livez/readyz]: https://etcd.io/docs/v3.6/op-guide/monitoring/
[v3discovery]: https://etcd.io/docs/v3.6/dev-internal/discovery_protocol/
[v2discovery]: https://etcd.io/docs/v3.5/dev-internal/discovery_protocol/
[Upgrade etcd from v3.5 to v3.6]: https://etcd.io/docs/v3.6/upgrades/upgrade_3_6/
[PR/13565]: https://github.com/etcd-io/etcd/pull/13565
[issue/13766]: https://github.com/etcd-io/etcd/issues/13766
[PR/13854]: https://github.com/etcd-io/etcd/pull/13854
[issue/14370]: https://github.com/etcd-io/etcd/issues/14370
[PR/14400]: https://github.com/etcd-io/etcd/pull/14400
[PR/14413]: https://github.com/etcd-io/etcd/pull/14413
[PR/14685]: https://github.com/etcd-io/etcd/pull/14685
[PR/14730]: https://github.com/etcd-io/etcd/pull/14730
[PR/18825]: https://github.com/etcd-io/etcd/pull/18825
[PR/419]: https://github.com/etcd-io/bbolt/pull/419
[Robustness testing]: https://github.com/etcd-io/etcd/tree/main/tests/robustness
[Watch APIs]: https://etcd.io/docs/v3.5/learning/api_guarantees/#watch-apis
[issues/15951]: https://github.com/etcd-io/etcd/issues/15951
[supported-platform]: https://etcd.io/docs/v3.6/op-guide/supported-platform/
[dependency_management]: https://github.com/etcd-io/etcd/blob/main/Documentation/contributor-guide/dependency_management.md
[bbolt]: https://github.com/etcd-io/bbolt
[raft]: https://github.com/etcd-io/raft
[grpc-gateway]: https://github.com/grpc-ecosystem/grpc-gateway
[PR/16595]: https://github.com/etcd-io/etcd/pull/16595
[protobuf-go]: https://github.com/protocolbuffers/protobuf-go
[gogo/protobuf]: https://github.com/gogo/protobuf
[patch]: https://github.com/etcd-io/etcd/blob/158b9e0d468d310c3edf4cf13f2458c51b0406fa/scripts/genproto.sh#L151-L184
[grpc-ecosystem/go-grpc-prometheus]: https://github.com/grpc-ecosystem/go-grpc-prometheus
[grpc-ecosystem/go-grpc-middleware/providers/prometheus]: https://github.com/grpc-ecosystem/go-grpc-middleware/tree/main/providers/prometheus
[PR/19195]: https://github.com/etcd-io/etcd/pull/19195
[issues/19557]: https://github.com/etcd-io/etcd/issues/19557
[upgrade_from_3.5_to_3.6_issue]: https://etcd.io/blog/2025/upgrade_from_3.5_to_3.6_issue/
[WG-etcd-operator]: https://github.com/kubernetes/community/tree/master/wg-etcd-operator
[v3.5 release blog/Future roadmaps]: https://etcd.io/blog/2021/announcing-etcd-3.5/#future-roadmaps
[etcd roadmap]: https://github.com/etcd-io/etcd/blob/main/Documentation/contributor-guide/roadmap.md
[fuweid]: https://github.com/fuweid
[jmhbnz]: https://github.com/jmhbnz
[wenjiaswe]: https://github.com/wenjiaswe
[ivanvc]: https://github.com/ivanvc
[siyuanfoundation]: https://github.com/siyuanfoundation
