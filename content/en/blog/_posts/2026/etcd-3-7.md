---
title: Announcing etcd v3.7.0
slug: announcing-etcd-3.7
date: 2026-07-08T20:00:00+0800
canonicalUrl: https://etcd.io/blog/2026/announcing-etcd-3.7/
draft: true
author: "SIG Etcd Leads"
---

_This article is a mirror of the [original announcement](https://etcd.io/blog/2026/announcing-etcd-3.7/)_

Today, SIG etcd is releasing [etcd v3.7.0](https://github.com/etcd-io/etcd/releases/tag/v3.7.0), the latest minor release of the popular distributed key-value store and core Kubernetes component. v3.7 ships the long-requested RangeStream feature, delivers several other performance improvements, removes the last remnants of the legacy v2store, and completes a major protobuf overhaul.

You can download etcd v3.7.0 here:

* [Source code](https://github.com/etcd-io/etcd/archive/refs/tags/v3.7.0.tar.gz)
* [Binaries](https://github.com/etcd-io/etcd/releases/tag/v3.7.0)
* [Official container images](https://gcr.io/etcd-development/etcd)

This release also includes new versions of the two core etcd dependencies, [bbolt v1.5.0](https://github.com/etcd-io/bbolt/releases/tag/v1.5.0) and [raft v3.7.0](https://github.com/etcd-io/raft/releases/tag/v3.7.0).

For instructions on installing etcd, see the [install documentation](https://etcd.io/docs/v3.7/install/). For the full list of changes, see the [etcd v3.7 changelog](https://github.com/etcd-io/etcd/blob/main/CHANGELOG/CHANGELOG-3.7.md).

A heartfelt thank you to all the contributors who made this release possible!

## Major features

The most significant changes in v3.7.0 include:

* [**RangeStream**](#rangestream) — stream large result sets in chunks instead of buffering the whole response.
* **Keys-only range requests, faster and more reliable leases,** and several other [**performance improvements**](#performance-improvements).
* etcd now [boots entirely from v3store](#bootstrap-from-v3store), eliminating a long-standing dependency on the legacy v2 store
* A completed [**protobuf overhaul**](#protobuf-overhaul), replacing outdated protobuf libraries with fully supported ones.
* etcd v3.7 ships with [bbolt v1.5.1](#bbolt-v151) and [raft v3.7.0](#raft-v370).

## Features

### RangeStream

In etcd v3.6 and earlier, it is challenging to work with requests that return large result sets. The database would buffer the full result set before sending, leading to unpredictable latency and memory usage,  both on the server and the client. [The RangeStream RPC](https://github.com/kubernetes/enhancements/tree/master/keps/sig-etcd/5966-etcd-range-stream) lets calling applications accept result sets in chunks, reducing latency and making buffering memory usage more predictable.

Instructions on how to use RangeStream [in gRPC calls](https://etcd.io/docs/v3.7/learning/api/#rangestream) and [in etcdctl](https://etcd.io/docs/v3.7/dev-guide/interacting_v3/#read-keys) can be found in the etcd documentation. Users should try it out for their own applications.

In coordinated releases, the RangeStream feature will become available to users running the upcoming v1.37 of Kubernetes by enabling the `EtcdRangeStream` feature gate.  This early and planned adoption is possible thanks to the merger of etcd and Kubernetes development in 2023.

### Performance improvements

v3.7 delivers multiple specific performance improvements, both for the Kubernetes control plane and for other use cases.  Kubernetes users should see a significant decrease in overall CPU usage by the etcd members, compared with v3.6.

#### Keys-only range optimization

etcd v3.7.0 includes a keys-only Range optimization ([#21791: keys-only Range optimization](https://github.com/etcd-io/etcd/pull/21791)). When processing a keys_only Range request or `etcdctl get --keys-only`, etcd reads solely from its in-memory index. It returns the matched keys without loading all serialized values from bbolt as it did previously.  The only exception where loading from bbolt is still required is when `keys_only` Range requests must be sorted by value (i.e., when SortTarget is set to VALUE).

This reduces unnecessary backend reads and memory use for workloads that only need key names, making large keys-only range requests more efficient.

#### Faster, more reliable etcd leases

v3.7 improves lease expiration and renewal:

* LeaseRevoke requests are now prioritized to ensure timely lease expiration during overload ([#20492: stability enhancement during overload conditions](https://github.com/etcd-io/etcd/pull/20492)).
* The new FastLeaseKeepAlive feature enables faster lease renewal by skipping the wait for the applied index ([#20589: etcdserver: improve linearizable renew lease](https://github.com/etcd-io/etcd/pull/20589)).

#### Faster find() operations

etcd 3.7 improves the performance of concurrent watches on keys by making find() operations faster ([#19768: adt: split interval tree by right endpoint on matched left endpoints](https://github.com/etcd-io/etcd/pull/19768)).

### Other features

#### Protobuf overhaul

v3.7 migrates and replaces multiple outdated protobuf libraries with fully supported dependencies. This includes replacing `github.com/golang/protobuf` and `github.com/gogo/protobuf` with the fully-supported `google.golang.org/protobuf` ([#14533: Protobuf: cleanup both golang/protobuf and gogo/protobuf](https://github.com/etcd-io/etcd/issues/14533)), and migrating grpc-logging to grpc-middleware v2 ([#20420: Migrate grpc-logging to grpc-middleware v2](https://github.com/etcd-io/etcd/pull/20420)).

As well as improving security and maintainability, this refactor has been shown to reduce CPU usage by etcd components.

While these changes are not expected to directly affect users running etcd via official binaries or container images, they may affect users who depend on etcd Go modules, such as the client SDK or packages under `api/` or `pkg/`. These consumers may need to update their code or dependencies due to protobuf and related API changes introduced in this release. More detailed information is available from [the API change tracking issue](https://github.com/etcd-io/website/issues/1162).

#### Unix socket support

etcd now supports Unix socket endpoints ([#19760: Add Support for Unix Socket endpoints](https://github.com/etcd-io/etcd/pull/19760)), enabling local communication without a TCP port.  Since this is restricted to single-member clusters, it is mainly aimed at development, testing, and edge device use-cases.

#### Bootstrap from v3store

One of the major changes in etcd v3.7 is that the server now bootstraps entirely from the v3 store ([#20187 Bootstrap etcdserver from v3store](https://github.com/etcd-io/etcd/issues/20187)), eliminating its dependency on the legacy v2 store during startup.

This milestone is the result of a long-term effort spanning multiple releases, from v3.4 through v3.7. It resolves a long-standing technical debt, significantly simplifies the bootstrap workflow, and lays the foundation for future improvements to etcd.

To maintain backward compatibility, etcd v3.7 continues to generate v2 snapshots. As a result, the `--snapshot-count` flag is also retained in v3.7. This is the last remaining dependency on the legacy v2 store, and both the v2 snapshot generation and the `--snapshot-count` flag will be removed in v3.8.

#### etcdutl timeouts

All etcdutl commands now have a timeout command line argument ([#20708: etcdutl: enable timeout functionality for all commands](https://github.com/etcd-io/etcd/pull/20708)), so offline utility commands no longer block indefinitely when holding a lock.

#### Setting the authentication token directly

Client v3 now allows users to set the JWT directly, offering more flexibility in authentication options ([#16803: clientv3: allow setting JWT directly](https://github.com/etcd-io/etcd/pull/16803), [#20747: clientv3: disable auth retry when token is set](https://github.com/etcd-io/etcd/pull/20747)),

#### Retrieve AuthStatus without authenticating

Clients can check their AuthStatus without attempting to authenticate first, eliminating some application overhead ([#20802: etcdserver: remove permission check on AuthStatus api](https://github.com/etcd-io/etcd/pull/20802)).

#### New watch metrics

v3.7 adds optional watch send-loop metrics ([#21030: Instrument watchstream send loop](https://github.com/etcd-io/etcd/pull/21030)) for better observability of the watch path:

* `etcd_debugging_server_watch_send_loop_watch_stream_duration_seconds`
* `etcd_debugging_server_watch_send_loop_watch_stream_duration_per_event_seconds`
* `etcd_debugging_server_watch_send_loop_control_stream_duration_seconds`
* `etcd_debugging_server_watch_send_loop_progress_duration_seconds`

There is also a new `etcd_server_request_duration_seconds` metric ([#21038: Add metric `etcd_server_request_duration_seconds`](https://github.com/etcd-io/etcd/pull/21038)).

#### etcdctl command cleanup

etcdctl commands were reorganized for clarity ([#20162: etcdctl: organize etcdctl subcommand](https://github.com/etcd-io/etcd/pull/20162)) and global command line arguments are now hidden to streamline help output ([#20493: etcdctl: hide global flags](https://github.com/etcd-io/etcd/pull/20493)).

## Upgrading

This release contains breaking changes, particularly around the removal of legacy v2 components. Users should review the [upgrade guide](https://etcd.io/docs/v3.7/upgrades/upgrade_3_7/) before upgrading their nodes. As with all minor releases, perform a rolling upgrade one member at a time and confirm cluster health between steps.

### Experimental flags removed

All deprecated experimental flags have been removed ([#19959: Cleanup the deprecated experimental flags](https://github.com/etcd-io/etcd/pull/19959)). Features in etcd now follow the Kubernetes-style feature-gate lifecycle (Alpha → Beta → GA) introduced in v3.6, rather than the old `--experimental` prefix. If your configuration still relies on `--experimental-*` command line arguments, migrate to using the corresponding feature gates or stable command line arguments before you upgrade to etcd 3.7.

### Legacy V2 API packages and code cleanup

To remove the dependencies on v2store, the following components have been removed:

*  [v2 discovery](https://github.com/etcd-io/etcd/pull/20109) ([#20109: Remove v2discovery](https://github.com/etcd-io/etcd/pull/20109)) packages removed,
* [v2 request](https://github.com/etcd-io/etcd/pull/21263) support ([#21263: Remove v2 Request and apply_v2.go](https://github.com/etcd-io/etcd/pull/21263))
*  [v2 client](https://github.com/etcd-io/etcd/pull/20117) support ([#20117: Remove client/internal/v2](https://github.com/etcd-io/etcd/pull/20117)).

These changes may create some breakage for users, particularly those who have not already updated to v3.6.11 or later. Users should report any blockers encountered, or cases that need better upgrade documentation.

### Non-blocking client creation

etcd no longer honors the deprecated `grpc.WithBlock` dial option ( [\#21942: Make the etcd client creation non-blocking](https://github.com/etcd-io/etcd/pull/21942)). To preserve the previous blocking behavior when needed, follow the guidance in grpc-go's [anti-patterns documentation](https://github.com/grpc/grpc-go/blob/master/Documentation/anti-patterns.md#especially-bad-using-deprecated-dialoptions).

### Multiarch container images only

For users relying on the official etcd container images, v3.7 will be distributed **only** as multiarch containers.  Architecture-tagged images will not be available, so adjust deployments accordingly.

### API changes

As with every etcd release, there are a number of API changes.  These are designed to be backwards-compatible to the extent possible, but may require adjustment by some users.  See our [API documentation](https://etcd.io/docs/v3.7/learning/api/) page for full information.

## bbolt v1.5.1

etcd v3.7 depends on, and includes, [v1.5.1](https://github.com/etcd-io/bbolt/blob/main/CHANGELOG/CHANGELOG-1.5.md) of the bbolt storage engine.  v1.5 includes several improvements to functionality and performance, including:

* [Database file size limits](https://github.com/etcd-io/bbolt/pull/929): users may set, and bbolt will enforce, file size limits.  When a bolt database exceeds these limits it will refuse to accept writes until the database is compacted or the limit is changed.
* [Disable statistics for performance](https://github.com/etcd-io/bbolt/pull/977): users may set `NoStatistics` to limit overhead from locks taken by the database statistics viewer.
* [More efficient hashmap processing](https://github.com/etcd-io/bbolt/pull/1179): merge spans faster and with less overhead.

## raft v3.7.0

etcd 3.7 depends on, and includes, v3.7.0 of the raft consensus engine.  v3.7 includes several improvements, including:

* [Update the bootstrap process](https://github.com/etcd-io/raft/pull/370): v3.7 now allows booting from partly initialized snapshots, supporting etcd's initializing directly from v3store.
* [Improve the ReadIndex flow to prevent stale reads](https://github.com/etcd-io/raft/pull/397) by injecting a unique identifier into the heartbeat context for read-only operations.

raft v3.7.0 also includes the [same protobuf library updates](https://github.com/etcd-io/etcd/issues/14533) and refactoring as etcd does.

## Dependency updates

Other dependency updates include a bump to `golang.org/x/crypto` v0.52.0 for CVE resolution ([#21903: \[release-3.7\] Bump golang.org/x/crypto to v0.52.0](https://github.com/etcd-io/etcd/pull/21903)), an OpenTelemetry contrib update to v0.61.0 ([#20017: Update otelgrpc to v0.61.0](https://github.com/etcd-io/etcd/pull/20017)), and compilation with Go 1.26.4 ([#21891: \[release-3.7\] Update Go to 1.26.4](https://github.com/etcd-io/etcd/pull/21891)).

## Contributors

etcd v3.7.0 is the product of more than a hundred contributors across the community. Thank you to everyone who wrote code, reviewed PRs, filed and triaged issues, and helped test the alpha, beta, and release candidates.

### Leads

The SIG etcd leads for the v3.7 release are [ivanvc](https://github.com/ivanvc), [serathius](https://github.com/serathius), [ahrtr](https://github.com/ahrtr), [fuweid](https://github.com/fuweid), [siyuanfoundation](https://github.com/siyuanfoundation), and [jberkus](https://github.com/jberkus).  Ivan leads our release team.

### Other contributors

[ah8ad3](https://github.com/ah8ad3), [ajaysundark](https://github.com/ajaysundark), [aladesawe](https://github.com/aladesawe), [amosehiguese](https://github.com/amosehiguese), [ArkaSaha30](https://github.com/ArkaSaha30), [ashikjm](https://github.com/ashikjm), [AwesomePatrol](https://github.com/AwesomePatrol), [dims](https://github.com/dims), [Elbehery](https://github.com/Elbehery), [gangli113](https://github.com/gangli113), [henrybear327](https://github.com/henrybear327), [Jille](https://github.com/Jille), [jmhbnz](https://github.com/jmhbnz), [joshuazh-x](https://github.com/joshuazh-x), [kishen-v](https://github.com/kishen-v), [lavishpal](https://github.com/lavishpal), [liggitt](https://github.com/liggitt), [marcelfranca](https://github.com/marcelfranca), [miancheng7](https://github.com/miancheng7), [mmorel-35](https://github.com/mmorel-35), [MrDXY](https://github.com/MrDXY), [mrueg](https://github.com/mrueg), [purpleidea](https://github.com/purpleidea), [qsyqian](https://github.com/qsyqian), [redwrasse](https://github.com/redwrasse), [ronaldngounou](https://github.com/ronaldngounou), [skitt](https://github.com/skitt), [spzala](https://github.com/spzala), [tcchawla](https://github.com/tcchawla), [tjungblu](https://github.com/tjungblu), [vivekpatani](https://github.com/vivekpatani), [wenjiaswe](https://github.com/wenjiaswe)

### New contributors

A special welcome to the contributors who made their first etcd contribution in this cycle — including [Jeffrey Ying](https://github.com/jefftree), whose work drove the RangeStream feature. New contributors can have a substantial impact on etcd; if you’d like to get involved, see the [contributor guide](https://github.com/etcd-io/etcd/blob/main/CONTRIBUTING.md).

[1911860538](https://github.com/1911860538), [4rivappa](https://github.com/4rivappa), [aaronjzhang](https://github.com/aaronjzhang), [abdurrehman107](https://github.com/abdurrehman107), [ABin-Huang](https://github.com/ABin-Huang), [adeptvin1](https://github.com/adeptvin1), [aditya7880900936](https://github.com/aditya7880900936), [AHBICJ](https://github.com/AHBICJ), [akstron](https://github.com/akstron), [alliasgher](https://github.com/alliasgher), [aman4433](https://github.com/aman4433), [aojea](https://github.com/aojea), [apullo777](https://github.com/apullo777), [AR21SM](https://github.com/AR21SM), [arturmelanchyk](https://github.com/arturmelanchyk), [AshrafAhmed9](https://github.com/AshrafAhmed9), [asttool](https://github.com/asttool), [asutorufa](https://github.com/asutorufa), [BBQing](https://github.com/BBQing), [beforetech](https://github.com/beforetech), [boqishan](https://github.com/boqishan), [caltechustc](https://github.com/caltechustc), [carsontham](https://github.com/carsontham), [christophsj](https://github.com/christophsj), [chuanye-gao](https://github.com/chuanye-gao), [cnuss](https://github.com/cnuss), [cuiweixie](https://github.com/cuiweixie), [dmvolod](https://github.com/dmvolod), [Dogacel](https://github.com/Dogacel), [dongjiang1989](https://github.com/dongjiang1989), [EduardoVega](https://github.com/EduardoVega), [evertrain](https://github.com/evertrain), [eyupcanakman](https://github.com/eyupcanakman), [gaganhr94](https://github.com/gaganhr94), [goingforstudying-ctrl](https://github.com/goingforstudying-ctrl), [greenblade29](https://github.com/greenblade29), [Himanshu-370](https://github.com/Himanshu-370), [HossamSaberX](https://github.com/HossamSaberX), [huajianxiaowanzi](https://github.com/huajianxiaowanzi), [hwdef](https://github.com/hwdef), [ishan-gupta2005](https://github.com/ishan-gupta2005), [ishan16696](https://github.com/ishan16696), [ivangsm](https://github.com/ivangsm), [JasonLove-Coding](https://github.com/JasonLove-Coding), [Jefftree](https://github.com/Jefftree), [jihogh](https://github.com/jihogh), [jonathan-albrecht-ibm](https://github.com/jonathan-albrecht-ibm), [joshjms](https://github.com/joshjms), [kairosci](https://github.com/kairosci), [kei01234kei](https://github.com/kei01234kei), [kjgorman](https://github.com/kjgorman), [kovan](https://github.com/kovan), [kstrifonoff](https://github.com/kstrifonoff), [Kunalbehbud](https://github.com/Kunalbehbud), [letreturn](https://github.com/letreturn), [lorenz](https://github.com/lorenz), [m4l1c1ou5](https://github.com/m4l1c1ou5), [madhav-murali](https://github.com/madhav-murali), [madvimer](https://github.com/madvimer), [majiayu000](https://github.com/majiayu000), [marcus-hodgson-antithesis](https://github.com/marcus-hodgson-antithesis), [mattsains](https://github.com/mattsains), [mcrute](https://github.com/mcrute), [mingl1](https://github.com/mingl1), [MohanadKh03](https://github.com/MohanadKh03), [mstrYoda](https://github.com/mstrYoda), [NAM-MAN](https://github.com/NAM-MAN), [neeraj542](https://github.com/neeraj542), [nicknikolakakis](https://github.com/nicknikolakakis), [nihalmaddala](https://github.com/nihalmaddala), [niuyueyang1996](https://github.com/niuyueyang1996), [notandruu](https://github.com/notandruu), [ntdkhiem](https://github.com/ntdkhiem), [nwnt](https://github.com/nwnt), [olamilekan000](https://github.com/olamilekan000), [pigeio](https://github.com/pigeio), [pjsharath28](https://github.com/pjsharath28), [progmem](https://github.com/progmem), [Qian-Cheng-nju](https://github.com/Qian-Cheng-nju), [quocvibui](https://github.com/quocvibui), [ravisastryk](https://github.com/ravisastryk), [robin-vidal](https://github.com/robin-vidal), [robinkb](https://github.com/robinkb), [rockswe](https://github.com/rockswe), [roman-khimov](https://github.com/roman-khimov), [rsafonseca](https://github.com/rsafonseca), [sahilpatel09](https://github.com/sahilpatel09), [SalehBorhani](https://github.com/SalehBorhani), [SebTardif](https://github.com/SebTardif), [seshachalam-yv](https://github.com/seshachalam-yv), [shashwat010](https://github.com/shashwat010), [shivamgcodes](https://github.com/shivamgcodes), [shuan1026](https://github.com/shuan1026), [silentred](https://github.com/silentred), [sneaky-potato](https://github.com/sneaky-potato), [socketpair](https://github.com/socketpair), [srri](https://github.com/srri), [subrajeet-maharana](https://github.com/subrajeet-maharana), [sxllwx](https://github.com/sxllwx), [tchap](https://github.com/tchap), [tsujiri](https://github.com/tsujiri), [tzfun](https://github.com/tzfun), [upamanyus](https://github.com/upamanyus), [uzairhameed](https://github.com/uzairhameed), [varunu28](https://github.com/varunu28), [vihasmakwana](https://github.com/vihasmakwana), [wendy-ha18](https://github.com/wendy-ha18), [xiaoxiangirl](https://github.com/xiaoxiangirl), [xigang](https://github.com/xigang), [xUser5000](https://github.com/xUser5000), [yagikota](https://github.com/yagikota), [yajianggroup](https://github.com/yajianggroup), [yedou37](https://github.com/yedou37), [Zanda256](https://github.com/Zanda256), [zechariahkasina](https://github.com/zechariahkasina), [zhijun42](https://github.com/zhijun42), [zhoujiaweii](https://github.com/zhoujiaweii)

Feedback can be shared through:

- [GitHub issues](https://github.com/etcd-io/etcd/issues)
- [#sig-etcd slack channel](https://kubernetes.slack.com/archives/C3HD8ARJ5) in [Kubernetes Slack](https://www.kubernetes.dev/docs/comms/slack/#joining-slack)
- [etcd-dev mailing list](https://groups.google.com/g/etcd-dev)
