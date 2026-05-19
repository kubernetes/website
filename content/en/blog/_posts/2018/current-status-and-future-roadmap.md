---
layout: blog
title: 'etcd: Current status and future roadmap'
date: 2018-12-11
author: >
  Gyuho Lee (Amazon),
  Joe Betz (Google Cloud)
---

etcd is a distributed key value store that provides a reliable way to manage the coordination state of distributed systems. etcd was first announced in June 2013 by CoreOS (part of Red Hat as of 2018). Since its adoption in Kubernetes in 2014, etcd has become a fundamental part of the Kubernetes cluster management software design, and the etcd community has grown exponentially. etcd is now being used in production environments of multiple companies, including large cloud provider environments such as AWS, Google Cloud Platform, Azure, and other on-premises Kubernetes implementations. CNCF currently has [32 conformant Kubernetes platforms and distributions](https://www.cncf.io/announcement/2017/11/13/cloud-native-computing-foundation-launches-certified-kubernetes-program-32-conformant-distributions-platforms/), all of which use etcd as the datastore.

In this blog post, we’ll review some of the milestones achieved in latest etcd releases, and go over the future roadmap for etcd. Share your thoughts and feedback on features you consider important on the mailing list: etcd-dev@googlegroups.com.

## etcd, 2013

In June 2014, Kubernetes was released with etcd as a backing storage for all master states. Kubernetes v0.4 used etcd v0.2 API, which was in an alpha stage at the time. As Kubernetes reached the v1.0 milestone in 2015, etcd stabilized its v2.0 API. The widespread adoption of Kubernetes led to a dramatic increase in the scalability requirements for etcd. To handle large number of workloads and the growing requirements on scale, etcd released v3.0 API in June 2016. Kubernetes v1.13 finally [dropped support for etcd v2.0 API](https://github.com/kubernetes/enhancements/issues/622) and adopted the etcd v3.0 API. The table below gives a visual snapshot of the release cycles of etcd and Kubernetes.

|   | etcd | Kubernetes |
|---|---|---|
| Initial Commit | June 2, 2013 | June 1, 2014 |
| First Stable Release | January 28, 2015 (v2.0.0) | July 13, 2015 (v1.0.0) |
| Latest Release | October 10, 2018 (v3.3.10) | December 3, 2018 (v1.13.0) |

## etcd v3.1, early 2017

etcd v3.1 features provide better read performance and better availability during version upgrades. Given the high use of etcd in production even to this day, these features were very useful for users. It implements Raft read index, which bypasses [Raft WAL](https://godoc.org/github.com/etcd-io/etcd/wal) disk writes for linearizable reads. The follower requests read index from the leader. Responses from the leader indicate whether a follower has advanced as much as the leader. When the follower's logs are up-to-date, quorum read is served locally without going through the full Raft protocol. Thus, no disk write is required for read requests. etcd v3.1 introduces automatic leadership transfer. When etcd leader receives an interrupt signal, it automatically transfers its leadership to a follower. This provides higher availability when the cluster adds or loses a member.

## etcd v3.2 (summer 2017)

etcd v3.2 focuses on stability. Its client was shipped in Kubernetes v1.10, v1.11, and v1.12. The etcd team still actively maintains the branch by backporting all the bug fixes. This release introduces gRPC proxy to support, watch, and coalesce all watch event broadcasts into one gRPC stream. These event broadcasts can go up to one million events per second.

etcd v3.2 also introduces changes such as `“snapshot-count”` default value from 10,000 to 100,000. With higher snapshot count, etcd server holds Raft entries in-memory for longer periods before compacting the old ones. etcd v3.2 default configuration shows higher memory usage, while giving more time for slow followers to catch up. It is a trade-off between less frequent snapshot sends and higher memory usage. Users can employ lower `etcd --snapshot-count` value to reduce the memory usage or higher `“snapshot-count”` value to increase the availability of slow followers.

Another new feature backported to etcd v3.2.19 was `etcd --initial-election-tick-advance` flag. By default, a rejoining follower fast-forwards election ticks to speed up its initial cluster bootstrap. For example, the starting follower node only waits 200ms instead of full election timeout 1-second before starting an election. Ideally, within the 200ms, it receives a leader heartbeat and immediately joins the cluster as a follower. However, if network partition happens, heartbeat may drop and thus leadership election will be triggered. A vote request from a partitioned node is quite disruptive. If it contains a higher Raft term, current leader is forced to step down. With “initial-election-tick-advance” set to false, a rejoining node has [more chance to receive leader heartbeats](https://github.com/etcd-io/etcd/pull/9591) before disrupting the cluster.

## etcd v3.3 (early 2018)

etcd v3.3 continues the theme of stability. Its client is included in [Kubernetes v1.13](https://github.com/kubernetes/kubernetes/pull/69322). Previously, etcd client carelessly retried on network disconnects without any backoff or failover logic. The client was often stuck with a partitioned node, [affecting several production users](https://github.com/etcd-io/etcd/issues/7321). v3.3 client balancer now maintains a list of unhealthy endpoints using gRPC health checking protocol, making more efficient retries and failover in the face of transient disconnects and [network partitions](https://github.com/etcd-io/etcd/issues/8711). This was backported to etcd v3.2 and also [included in Kubernetes v1.10 API server](https://github.com/kubernetes/kubernetes/pull/57480). etcd v3.3 also provides more predictable database size. etcd used to maintain a separate freelist DB to track pages that were no longer in use and freed after transactions, so that following transactions can reuse them. However, it turns out persisting freelist demands high disk space and introduces high latency for Kubernetes workloads. Especially when there were frequent snapshots with lots of read transactions, etcd database size quickly grew from 16 MB to 4 GB. etcd v3.3 disables freelist sync and rebuilds the freelist on restart. The overhead is so small that it is unnoticeable to most users. See ["database space exceeded" issue](https://github.com/etcd-io/etcd/issues/8009) for more information on this.

## etcd v3.4 and beyond

etcd v3.4 focuses on improving the operational experience. It adds [Raft pre-vote feature](https://github.com/etcd-io/etcd/pull/9352) to improve the robustness of leadership election. When a node becomes isolated (e.g. network partition), this member will start an election requesting votes with increased Raft terms. When a leader receives a vote request with a higher term, it steps down to a follower. With pre-vote, Raft runs an additional election phase to check if the candidate can get enough votes to win an election. The isolated follower's vote request is rejected because it does not contain the latest log entries.

etcd v3.4 adds a [Raft learner](https://etcd.io/docs/v3.4.0/learning/design-learner/#Raft%20Learner) that joins the cluster as a non-voting member that still receives all the updates from leader. Adding a learner node does not increase the size of quorum and hence improves the cluster availability during membership reconfiguration. It only serves as a standby node until it gets promoted to a voting member. Moreover, to handle unexpected upgrade failures, v3.4 introduces [etcd downgrade](https://groups.google.com/forum/?hl=en#!topic/etcd-dev/Hq6zru44L74) feature.

etcd v3 storage uses multi-version concurrency control model to preserve key updates as event history. Kubernetes runs compaction to discard the event history that is no longer needed, and reclaims the storage space. etcd v3.4 will improve this storage compact operation, boost backend [concurrency for large read transactions](https://github.com/etcd-io/etcd/pull/9384), and [optimize storage commit interval](https://github.com/etcd-io/etcd/pull/10283) for Kubernetes use-case.

To further improve etcd client load balancer, the v3.4 balancer was rewritten to leverage the newly introduced gRPC load balancing API. By leveraging gPRC, the etcd client load balancer codebase was substantially simplified while retaining feature parity with the v3.3 implementation and improving overall load balancing by round-robining requests across healthy endpoints. See [Client Architecture](https://etcd.io/docs/v3.4.0/learning/design-client/) for more details.

Additionally, etcd maintainers will continue to make improvements to Kubernetes test frameworks: kubemark integration for scalability tests, Kubernetes API server conformance tests with etcd to provide release recommends and version skew policy, specifying conformance testing requirements for each cloud provider, etc.

## etcd Joins CNCF

etcd now has a new home at [etcd-io](https://github.com/etcd-io) and [joined CNCF as an incubating project](https://www.cncf.io/blog/2018/12/11/cncf-to-host-etcd/).

The synergistic efforts with Kubernetes have driven the evolution of etcd. Without community feedback and contribution, etcd could not have achieved its maturity and reliability. We’re looking forward to continuing the growth of etcd as an open source project and are excited to work with the Kubernetes and the wider CNCF community.

Finally, we’d like to thank all contributors with special thanks to [Xiang Li](https://github.com/xiang90) for his leadership in etcd and Kubernetes.
