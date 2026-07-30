---
layout: blog
title: "宣布 etcd v3.7.0 发布"
date: 2026-07-08T20:00:00+0800
slug: announcing-etcd-3.7
draft: false
author: "SIG Etcd Leads"
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: Announcing etcd v3.7.0
date: 2026-07-08T20:00:00+0800
slug: announcing-etcd-3.7
canonicalUrl: https://etcd.io/blog/2026/announcing-etcd-3.7/
draft: false
author: "SIG Etcd Leads"
-->

<!--
_This article is a mirror of the [original announcement](https://etcd.io/blog/2026/announcing-etcd-3.7/)_
-->
**本文是[原始公告](https://etcd.io/blog/2026/announcing-etcd-3.7/)的镜像版本的中文翻译**

<!--
Today, SIG etcd is releasing [etcd v3.7.0](https://github.com/etcd-io/etcd/releases/tag/v3.7.0), the latest minor release of the popular distributed key-value store and core Kubernetes component. v3.7 ships the long-requested RangeStream feature, delivers several other performance improvements, removes the last remnants of the legacy v2store, and completes a major protobuf overhaul.
-->
今天，SIG etcd 发布了
[etcd v3.7.0](https://github.com/etcd-io/etcd/releases/tag/v3.7.0)，
这是广受欢迎的分布式键值存储和核心 Kubernetes 组件的最新次要版本。
v3.7 包含了期待已久的 RangeStream 功能，提供了多项其他性能改进，
移除了遗留 v2store 的最后残余，并完成了一次重大的 protobuf 重构。

<!--
You can download etcd v3.7.0 here:
-->
你可以在这里下载 etcd v3.7.0：

* [源代码](https://github.com/etcd-io/etcd/archive/refs/tags/v3.7.0.tar.gz)
* [二进制文件](https://github.com/etcd-io/etcd/releases/tag/v3.7.0)
* [官方容器镜像](https://gcr.io/etcd-development/etcd)

<!--
This release also includes new versions of the two core etcd dependencies, [bbolt v1.5.0](https://github.com/etcd-io/bbolt/releases/tag/v1.5.0) and [raft v3.7.0](https://github.com/etcd-io/raft/releases/tag/v3.7.0).
-->
此版本还包括两个核心 etcd 依赖项的新版本：
[bbolt v1.5.0](https://github.com/etcd-io/bbolt/releases/tag/v1.5.0) 和
[raft v3.7.0](https://github.com/etcd-io/raft/releases/tag/v3.7.0)。

<!--
For instructions on installing etcd, see the [install documentation](https://etcd.io/docs/v3.7/install/). For the full list of changes, see the [etcd v3.7 changelog](https://github.com/etcd-io/etcd/blob/main/CHANGELOG/CHANGELOG-3.7.md).
-->
有关安装 etcd 的说明，请参阅[安装文档](https://etcd.io/docs/v3.7/install/)。
有关完整的更改列表，请参阅
[etcd v3.7 变更日志](https://github.com/etcd-io/etcd/blob/main/CHANGELOG/CHANGELOG-3.7.md)。

<!--
A heartfelt thank you to all the contributors who made this release possible!
-->
衷心感谢所有促成此次发布的贡献者！

<!--
## Major features
-->
## 主要功能

<!--
The most significant changes in v3.7.0 include:

* [**RangeStream**](#rangestream) — stream large result sets in chunks instead of buffering the whole response.
* **Keys-only range requests, faster and more reliable leases,** and several other [**performance improvements**](#performance-improvements).
* etcd now [boots entirely from v3store](#bootstrap-from-v3store), eliminating a long-standing dependency on the legacy v2 store
* A completed [**protobuf overhaul**](#protobuf-overhaul), replacing outdated protobuf libraries with fully supported ones.
* etcd v3.7 ships with [bbolt v1.5.1](#bbolt-v151) and [raft v3.7.0](#raft-v370).
-->
v3.7.0 中的最重要变化包括：

* [**RangeStream**](#rangestream) — 分块流式传输大型结果集，而不是缓冲整个响应。
* **仅限键（Keys-only）的范围请求，更快、更可靠的租约机制**，以及其他多项[**性能改进**](#performance-improvements)。
* etcd 现在[完全从 v3store 启动](#bootstrap-from-v3store)，消除了对遗留 v2 store 的长期依赖
* 已完成的 [**protobuf 重构**](#protobuf-overhaul)，用完全支持的库替换过时的 protobuf 库。
* etcd v3.7 包含 [bbolt v1.5.1](#bbolt-v151) 和 [raft v3.7.0](#raft-v370)。

<!--
## Features

### RangeStream
-->
## 功能特性

### RangeStream

<!--
In etcd v3.6 and earlier, it is challenging to work with requests that return large result sets. The database would buffer the full result set before sending, leading to unpredictable latency and memory usage,  both on the server and the client. [The RangeStream RPC](https://github.com/kubernetes/enhancements/tree/master/keps/sig-etcd/5966-etcd-range-stream) lets calling applications accept result sets in chunks, reducing latency and making buffering memory usage more predictable.
-->
在 etcd v3.6 及更早版本中，处理返回大型结果集的请求具有挑战性。数据库会在发送前缓冲完整的结果集，
导致服务器和客户端的延迟和内存使用都不可预测。
[RangeStream RPC](https://github.com/kubernetes/enhancements/tree/master/keps/sig-etcd/5966-etcd-range-stream)
允许调用应用程序分块接受结果集，减少延迟并使缓冲内存使用更加可预测。

<!--
Instructions on how to use RangeStream [in gRPC calls](https://etcd.io/docs/v3.7/learning/api/#rangestream) and [in etcdctl](https://etcd.io/docs/v3.7/dev-guide/interacting_v3/#read-keys) can be found in the etcd documentation. Users should try it out for their own applications.
-->
在 etcd 文档中可以找到如何在
[gRPC 调用](https://etcd.io/docs/v3.7/learning/api/#rangestream)和
[etcdctl](https://etcd.io/docs/v3.7/dev-guide/interacting_v3/#read-keys)中使用 RangeStream 的说明。
用户应该为自己的应用程序试用它。

<!--
In coordinated releases, the RangeStream feature will become available to users running the upcoming v1.37 of Kubernetes by enabling the `EtcdRangeStream` feature gate.  This early and planned adoption is possible thanks to the merger of etcd and Kubernetes development in 2023.
-->
在协调发布中，运行即将推出的 Kubernetes v1.37 的用户可以通过启用
`EtcdRangeStream` 特性门控来使用 RangeStream 功能。由于 2023 年 etcd 和
Kubernetes 开发的合并，这种早期且有计划的采用成为可能。

<!--
### Performance improvements
-->
### 性能改进  {#performance-improvements}

<!--
v3.7 delivers multiple specific performance improvements, both for the Kubernetes control plane and for other use cases.  Kubernetes users should see a significant decrease in overall CPU usage by the etcd members, compared with v3.6.
-->
v3.7 为 Kubernetes 控制平面和其他用例提供了多项具体的性能改进。
与 v3.6 相比，Kubernetes 用户应该会看到 etcd 成员的整体 CPU 使用率显著降低。

<!--
#### Keys-only range optimization
-->
#### 仅键范围优化

<!--
etcd v3.7.0 includes a keys-only Range optimization ([#21791: keys-only Range optimization](https://github.com/etcd-io/etcd/pull/21791)). When processing a keys_only Range request or `etcdctl get --keys-only`, etcd reads solely from its in-memory index. It returns the matched keys without loading all serialized values from bbolt as it did previously.  The only exception where loading from bbolt is still required is when `keys_only` Range requests must be sorted by value (i.e., when SortTarget is set to VALUE).
-->
etcd v3.7.0 包含仅键范围优化（[#21791: keys-only Range optimization](https://github.com/etcd-io/etcd/pull/21791)）。
当处理 keys_only Range 请求或 `etcdctl get --keys-only` 时，etcd 仅从其内存索引中读取。
它返回匹配的键，而不像以前那样从 bbolt 加载所有序列化的值。
唯一仍需要从 bbolt 加载的例外情况是当 `keys_only` Range 请求必须按值排序时
（即 SortTarget 设置为 VALUE 时）。

<!--
This reduces unnecessary backend reads and memory use for workloads that only need key names, making large keys-only range requests more efficient.
-->
这减少了仅需要键名的工作负载的不必要后端读取和内存使用，使大型仅键范围请求更加高效。

<!--
#### Faster, more reliable etcd leases

v3.7 improves lease expiration and renewal:
-->
#### 更快、更可靠的 etcd 租约

v3.7 改进了租约过期和续期：

<!--
* LeaseRevoke requests are now prioritized to ensure timely lease expiration during overload ([#20492: stability enhancement during overload conditions](https://github.com/etcd-io/etcd/pull/20492)).
-->
* LeaseRevoke 请求现在被优先处理，以确保在过载期间租约及时过期
（[#20492: stability enhancement during overload conditions](https://github.com/etcd-io/etcd/pull/20492)）。

<!--
* The new FastLeaseKeepAlive feature enables faster lease renewal by skipping the wait for the applied index ([#20589: etcdserver: improve linearizable renew lease](https://github.com/etcd-io/etcd/pull/20589)).
-->
* 新的 FastLeaseKeepAlive 功能通过跳过等待应用索引来实现更快的租约续期
（[#20589: etcdserver: improve linearizable renew lease](https://github.com/etcd-io/etcd/pull/20589)）。

<!--
#### Faster find() operations
-->
#### 更快的 find() 操作

<!--
etcd 3.7 improves the performance of concurrent watches on keys by making find() operations faster ([#19768: adt: split interval tree by right endpoint on matched left endpoints](https://github.com/etcd-io/etcd/pull/19768)).
-->
etcd 3.7 通过加快 find() 操作来提高键的并发监视性能
（[#19768: adt: split interval tree by right endpoint on matched left endpoints](https://github.com/etcd-io/etcd/pull/19768)）。

<!--
### Other features
-->
### 其他功能

<!--
#### Protobuf overhaul
-->
#### Protobuf 重构  {#protobuf-overhaul}

<!--
v3.7 migrates and replaces multiple outdated protobuf libraries with fully supported dependencies. This includes replacing `github.com/golang/protobuf` and `github.com/gogo/protobuf` with the fully-supported `google.golang.org/protobuf` ([#14533: Protobuf: cleanup both golang/protobuf and gogo/protobuf](https://github.com/etcd-io/etcd/issues/14533)), and migrating grpc-logging to grpc-middleware v2 ([#20420: Migrate grpc-logging to grpc-middleware v2](https://github.com/etcd-io/etcd/pull/20420)).
-->
v3.7 将多个过时的 protobuf 库迁移并替换为完全支持的依赖项。
这包括用完全支持的 `google.golang.org/protobuf` 替换
`github.com/golang/protobuf` 和 `github.com/gogo/protobuf`
（[#14533: Protobuf: cleanup both golang/protobuf and gogo/protobuf](https://github.com/etcd-io/etcd/issues/14533)），
以及将 grpc-logging 迁移到 grpc-middleware v2
（[#20420: Migrate grpc-logging to grpc-middleware v2](https://github.com/etcd-io/etcd/pull/20420)）。

<!--
As well as improving security and maintainability, this refactor has been shown to reduce CPU usage by etcd components.
-->
除了提高安全性和可维护性外，此重构已被证明可以减少 etcd 组件的 CPU 使用率。

<!--
While these changes are not expected to directly affect users running etcd via official binaries or container images, they may affect users who depend on etcd Go modules, such as the client SDK or packages under `api/` or `pkg/`. These consumers may need to update their code or dependencies due to protobuf and related API changes introduced in this release. More detailed information is available from [the API change tracking issue](https://github.com/etcd-io/website/issues/1162).
-->
虽然这些更改预计不会直接影响通过官方二进制文件或容器镜像运行 etcd 的用户，
但它们可能会影响依赖 etcd Go 模块的用户，例如客户端 SDK 或 `api/` 或 `pkg/` 下的包。
由于此版本引入的 protobuf 和相关 API 更改，这些使用者可能需要更新其代码或依赖项。
更详细的信息可从 [API 变更跟踪问题](https://github.com/etcd-io/website/issues/1162)获取。

<!--
#### Unix socket support
-->
#### Unix socket 支持

<!--
etcd now supports Unix socket endpoints ([#19760: Add Support for Unix Socket endpoints](https://github.com/etcd-io/etcd/pull/19760)), enabling local communication without a TCP port.  Since this is restricted to single-member clusters, it is mainly aimed at development, testing, and edge device use-cases.
-->
etcd 现在支持 Unix socket 端点
（[#19760: Add Support for Unix Socket endpoints](https://github.com/etcd-io/etcd/pull/19760)），
无需 TCP 端口即可进行本地通信。由于这仅限于单成员集群，因此主要面向开发、测试和边缘设备用例。

<!--
#### Bootstrap from v3store
-->
#### 从 v3store 启动  {#bootstrap-from-v3store}

<!--
One of the major changes in etcd v3.7 is that the server now bootstraps entirely from the v3 store ([#20187 Bootstrap etcdserver from v3store](https://github.com/etcd-io/etcd/issues/20187)), eliminating its dependency on the legacy v2 store during startup.
-->
etcd v3.7 的重大变化之一是服务器现在完全从 v3 store 启动
（[#20187 Bootstrap etcdserver from v3store](https://github.com/etcd-io/etcd/issues/20187)），
消除了启动期间对遗留 v2 store 的依赖。

<!--
This milestone is the result of a long-term effort spanning multiple releases, from v3.4 through v3.7. It resolves a long-standing technical debt, significantly simplifies the bootstrap workflow, and lays the foundation for future improvements to etcd.
-->
这一里程碑是跨越多个版本（从 v3.4 到 v3.7）的长期努力的结果。
它解决了长期存在的技术债务，显著简化了启动工作流程，并为 etcd 的未来改进奠定了基础。

<!--
To maintain backward compatibility, etcd v3.7 continues to generate v2 snapshots. As a result, the `--snapshot-count` flag is also retained in v3.7. This is the last remaining dependency on the legacy v2 store, and both the v2 snapshot generation and the `--snapshot-count` flag will be removed in v3.8.
-->
为了保持向后兼容性，etcd v3.7 继续生成 v2 快照。因此，`--snapshot-count` 标志在 v3.7 中也被保留。
这是对遗留 v2 store 的最后依赖，v2 快照生成和 `--snapshot-count` 标志都将在 v3.8 中移除。

<!--
#### etcdutl timeouts
-->
#### etcdutl 超时  {#etcdutl-timeouts}

<!--
All etcdutl commands now have a timeout command line argument ([#20708: etcdutl: enable timeout functionality for all commands](https://github.com/etcd-io/etcd/pull/20708)), so offline utility commands no longer block indefinitely when holding a lock.
-->
所有 etcdutl 命令现在都有一个超时命令行参数
（[#20708: etcdutl: enable timeout functionality for all commands](https://github.com/etcd-io/etcd/pull/20708)），
因此离线实用程序命令在持有锁时不再无限期阻塞。

<!--
#### Setting the authentication token directly
-->
#### 直接设置认证令牌  {#setting-the-authentication-token-directly}

<!--
Client v3 now allows users to set the JWT directly, offering more flexibility in authentication options ([#16803: clientv3: allow setting JWT directly](https://github.com/etcd-io/etcd/pull/16803), [#20747: clientv3: disable auth retry when token is set](https://github.com/etcd-io/etcd/pull/20747)),
-->
Client v3 现在允许用户直接设置 JWT，在认证选项方面提供了更大的灵活性
（[#16803: clientv3: allow setting JWT directly](https://github.com/etcd-io/etcd/pull/16803)，
[#20747: clientv3: disable auth retry when token is set](https://github.com/etcd-io/etcd/pull/20747)）。

<!--
#### Retrieve AuthStatus without authenticating
-->
#### 无需认证即可检索 AuthStatus

<!--
Clients can check their AuthStatus without attempting to authenticate first, eliminating some application overhead ([#20802: etcdserver: remove permission check on AuthStatus api](https://github.com/etcd-io/etcd/pull/20802)).
-->
客户端可以在不先尝试认证的情况下检查其 AuthStatus，消除了一些应用程序开销
（[#20802: etcdserver: remove permission check on AuthStatus api](https://github.com/etcd-io/etcd/pull/20802)）。

<!--
#### New watch metrics

v3.7 adds optional watch send-loop metrics ([#21030: Instrument watchstream send loop](https://github.com/etcd-io/etcd/pull/21030)) for better observability of the watch path:
-->
#### 新的监视指标

v3.7 添加了可选的监视发送循环指标
（[#21030: Instrument watchstream send loop](https://github.com/etcd-io/etcd/pull/21030)），
以更好地观察监视路径：

* `etcd_debugging_server_watch_send_loop_watch_stream_duration_seconds`
* `etcd_debugging_server_watch_send_loop_watch_stream_duration_per_event_seconds`
* `etcd_debugging_server_watch_send_loop_control_stream_duration_seconds`
* `etcd_debugging_server_watch_send_loop_progress_duration_seconds`

<!--
There is also a new `etcd_server_request_duration_seconds` metric ([#21038: Add metric `etcd_server_request_duration_seconds`](https://github.com/etcd-io/etcd/pull/21038)).
-->
还有一个新的 `etcd_server_request_duration_seconds` 指标
（[#21038: Add metric `etcd_server_request_duration_seconds`](https://github.com/etcd-io/etcd/pull/21038)）。

<!--
#### etcdctl command cleanup
-->
#### etcdctl 命令清理

<!--
etcdctl commands were reorganized for clarity ([#20162: etcdctl: organize etcdctl subcommand](https://github.com/etcd-io/etcd/pull/20162)) and global command line arguments are now hidden to streamline help output ([#20493: etcdctl: hide global flags](https://github.com/etcd-io/etcd/pull/20493)).
-->
etcdctl 命令为了清晰起见进行了重组
（[#20162: etcdctl: organize etcdctl subcommand](https://github.com/etcd-io/etcd/pull/20162)），
全局命令行参数现在被隐藏以简化帮助输出
（[#20493: etcdctl: hide global flags](https://github.com/etcd-io/etcd/pull/20493)）。

<!--
## Upgrading
-->
## 升级

<!--
This release contains breaking changes, particularly around the removal of legacy v2 components. Users should review the [upgrade guide](https://etcd.io/docs/v3.7/upgrades/upgrade_3_7/) before upgrading their nodes. As with all minor releases, perform a rolling upgrade one member at a time and confirm cluster health between steps.
-->
此版本包含破坏性更改，特别是关于移除遗留 v2 组件的更改。
用户在升级其节点之前应查看[升级指南](https://etcd.io/docs/v3.7/upgrades/upgrade_3_7/)。
与所有次要版本一样，一次升级一个成员，并在步骤之间确认集群健康状况。

<!--
### Experimental flags removed
-->
### 移除实验性标志

<!--
All deprecated experimental flags have been removed ([#19959: Cleanup the deprecated experimental flags](https://github.com/etcd-io/etcd/pull/19959)). Features in etcd now follow the Kubernetes-style feature-gate lifecycle (Alpha → Beta → GA) introduced in v3.6, rather than the old `--experimental` prefix. If your configuration still relies on `--experimental-*` command line arguments, migrate to using the corresponding feature gates or stable command line arguments before you upgrade to etcd 3.7.
-->
所有已弃用的实验性标志已被移除
（[#19959: Cleanup the deprecated experimental flags](https://github.com/etcd-io/etcd/pull/19959)）。
etcd 中的功能现在遵循 v3.6 中引入的 Kubernetes 风格的特性门控生命周期
（Alpha → Beta → GA），而不是旧的 `--experimental` 前缀。
如果你的配置仍然依赖 `--experimental-*` 命令行参数，请在升级到 etcd 3.7 之前迁移到使用相应的特性门控或稳定的命令行参数。

<!--
### Legacy V2 API packages and code cleanup
-->
### 遗留 V2 API 包和代码清理

<!--
To remove the dependencies on v2store, the following components have been removed:
-->
为了移除对 v2store 的依赖，以下组件已被移除：

* [v2 discovery](https://github.com/etcd-io/etcd/pull/20109)（[#20109: Remove v2discovery](https://github.com/etcd-io/etcd/pull/20109)）包已移除，
* [v2 request](https://github.com/etcd-io/etcd/pull/21263) 支持（[#21263: Remove v2 Request and apply_v2.go](https://github.com/etcd-io/etcd/pull/21263)）
* [v2 client](https://github.com/etcd-io/etcd/pull/20117) 支持（[#20117: Remove client/internal/v2](https://github.com/etcd-io/etcd/pull/20117)）。

<!--
These changes may create some breakage for users, particularly those who have not already updated to v3.6.11 or later. Users should report any blockers encountered, or cases that need better upgrade documentation.
-->
这些更改可能会给用户带来一些问题，特别是那些尚未更新到 v3.6.11 或更高版本的用户。
用户应报告遇到的任何阻碍，或需要更好的升级文档的情况。

<!--
### Non-blocking client creation
-->
### 非阻塞客户端创建

<!--
etcd no longer honors the deprecated `grpc.WithBlock` dial option ( [\#21942: Make the etcd client creation non-blocking](https://github.com/etcd-io/etcd/pull/21942)). To preserve the previous blocking behavior when needed, follow the guidance in grpc-go's [anti-patterns documentation](https://github.com/grpc/grpc-go/blob/master/Documentation/anti-patterns.md#especially-bad-using-deprecated-dialoptions).
-->
etcd 不再支持已弃用的 `grpc.WithBlock` 拨号选项
（[#21942: Make the etcd client creation non-blocking](https://github.com/etcd-io/etcd/pull/21942)）。
如需保留之前的阻塞行为，请遵循 grpc-go 的[反模式文档](https://github.com/grpc/grpc-go/blob/master/Documentation/anti-patterns.md#especially-bad-using-deprecated-dialoptions)中的指导。

<!--
### Multiarch container images only
-->
### 仅提供多架构容器镜像

<!--
For users relying on the official etcd container images, v3.7 will be distributed **only** as multiarch containers.  Architecture-tagged images will not be available, so adjust deployments accordingly.
-->
对于依赖官方 etcd 容器镜像的用户，v3.7 **仅**以多架构容器形式分发。
将不再提供架构标签的镜像，请相应调整部署。

<!--
### API changes
-->
### API 更改

<!--
As with every etcd release, there are a number of API changes.  These are designed to be backwards-compatible to the extent possible, but may require adjustment by some users.  See our [API documentation](https://etcd.io/docs/v3.7/learning/api/) page for full information.
-->
与每个 etcd 版本一样，有多项 API 更改。这些更改旨在尽可能向后兼容，
但可能需要一些用户进行调整。有关完整信息，请参阅我们的
[API 文档](https://etcd.io/docs/v3.7/learning/api/)页面。

<!--
## bbolt v1.5.1
-->
## bbolt v1.5.1  {#bbolt-v1-5-1}

<!--
etcd v3.7 depends on, and includes, [v1.5.1](https://github.com/etcd-io/bbolt/blob/main/CHANGELOG/CHANGELOG-1.5.md) of the bbolt storage engine.  v1.5 includes several improvements to functionality and performance, including:
-->
etcd v3.7 依赖并包含 bbolt 存储引擎的
[v1.5.1](https://github.com/etcd-io/bbolt/blob/main/CHANGELOG/CHANGELOG-1.5.md) 版本。
v1.5 包括多项功能和性能改进，包括：

<!--
* [Database file size limits](https://github.com/etcd-io/bbolt/pull/929): users may set, and bbolt will enforce, file size limits.  When a bolt database exceeds these limits it will refuse to accept writes until the database is compacted or the limit is changed.
-->
* [数据库文件大小限制](https://github.com/etcd-io/bbolt/pull/929)：用户可以设置文件大小限制，bbolt 将强制执行。
当 bolt 数据库超过这些限制时，它将拒绝接受写入，直到数据库被压缩或限制被更改。

<!--
* [Disable statistics for performance](https://github.com/etcd-io/bbolt/pull/977): users may set `NoStatistics` to limit overhead from locks taken by the database statistics viewer.
-->
* [为性能禁用统计信息](https://github.com/etcd-io/bbolt/pull/977)：用户可以设置 `NoStatistics`
  来限制数据库统计信息查看器获取锁的开销。

<!--
* [More efficient hashmap processing](https://github.com/etcd-io/bbolt/pull/1179): merge spans faster and with less overhead.
-->
* [更高效的哈希映射处理](https://github.com/etcd-io/bbolt/pull/1179)：更快地合并跨度，且开销更低。

<!--
## raft v3.7.0
-->
## raft v3.7.0  {#raft-v3-7-0}

<!--
etcd 3.7 depends on, and includes, v3.7.0 of the raft consensus engine.  v3.7 includes several improvements, including:
-->
etcd 3.7 依赖并包含 raft 共识引擎的 v3.7.0 版本。v3.7 包括多项改进，包括：

<!--
* [Update the bootstrap process](https://github.com/etcd-io/raft/pull/370): v3.7 now allows booting from partly initialized snapshots, supporting etcd's initializing directly from v3store.
-->
* [更新启动过程](https://github.com/etcd-io/raft/pull/370)：v3.7
  现在允许从部分初始化的快照启动，支持 etcd 直接从 v3store 初始化。

<!--
* [Improve the ReadIndex flow to prevent stale reads](https://github.com/etcd-io/raft/pull/397) by injecting a unique identifier into the heartbeat context for read-only operations.
-->
* [改进 ReadIndex 流程以防止陈旧读取](https://github.com/etcd-io/raft/pull/397)，
  通过在只读操作的心跳上下文中注入唯一标识符。

<!--
raft v3.7.0 also includes the [same protobuf library updates](https://github.com/etcd-io/etcd/issues/14533) and refactoring as etcd does.
-->
Raft v3.7.0 还包含与 etcd 相同的
[protobuf 库更新](https://github.com/etcd-io/etcd/issues/14533)和重构。

<!--
## Dependency updates
-->
## 依赖更新

<!--
Other dependency updates include a bump to `golang.org/x/crypto` v0.52.0 for CVE resolution ([#21903: \[release-3.7\] Bump golang.org/x/crypto to v0.52.0](https://github.com/etcd-io/etcd/pull/21903)), an OpenTelemetry contrib update to v0.61.0 ([#20017: Update otelgrpc to v0.61.0](https://github.com/etcd-io/etcd/pull/20017)), and compilation with Go 1.26.4 ([#21891: \[release-3.7\] Update Go to 1.26.4](https://github.com/etcd-io/etcd/pull/21891)).
-->
其他依赖更新包括将 `golang.org/x/crypto` 升级到 v0.52.0 以解决 CVE
（[#21903: \[release-3.7\] Bump golang.org/x/crypto to v0.52.0](https://github.com/etcd-io/etcd/pull/21903)），
将 OpenTelemetry contrib 更新到 v0.61.0
（[#20017: Update otelgrpc to v0.61.0](https://github.com/etcd-io/etcd/pull/20017)），
以及使用 Go 1.26.4 编译
（[#21891: \[release-3.7\] Update Go to 1.26.4](https://github.com/etcd-io/etcd/pull/21891)）。

<!--
## Contributors
-->
## 贡献者

<!--
etcd v3.7.0 is the product of more than a hundred contributors across the community. Thank you to everyone who wrote code, reviewed PRs, filed and triaged issues, and helped test the alpha, beta, and release candidates.
-->
etcd v3.7.0 是社区中一百多位贡献者的成果。感谢所有编写代码、审查 PR、
提交和分类问题以及帮助测试 Alpha、Beta 和候选版本的人。

<!--
### Leads
-->
### 负责人

<!--
The SIG etcd leads for the v3.7 release are [ivanvc](https://github.com/ivanvc), [serathius](https://github.com/serathius), [ahrtr](https://github.com/ahrtr), [fuweid](https://github.com/fuweid), [siyuanfoundation](https://github.com/siyuanfoundation), and [jberkus](https://github.com/jberkus).  Ivan leads our release team.
-->
v3.7 版本的 SIG etcd 负责人是
[ivanvc](https://github.com/ivanvc)、[serathius](https://github.com/serathius)、
[ahrtr](https://github.com/ahrtr)、[fuweid](https://github.com/fuweid)、
[siyuanfoundation](https://github.com/siyuanfoundation) 和
[jberkus](https://github.com/jberkus)。Ivan 领导我们的发布团队。

<!--
### Other contributors
-->
### 其他贡献者

[ah8ad3](https://github.com/ah8ad3), [ajaysundark](https://github.com/ajaysundark), [aladesawe](https://github.com/aladesawe), [amosehiguese](https://github.com/amosehiguese), [ArkaSaha30](https://github.com/ArkaSaha30), [ashikjm](https://github.com/ashikjm), [AwesomePatrol](https://github.com/AwesomePatrol), [dims](https://github.com/dims), [Elbehery](https://github.com/Elbehery), [gangli113](https://github.com/gangli113), [henrybear327](https://github.com/henrybear327), [Jille](https://github.com/Jille), [jmhbnz](https://github.com/jmhbnz), [joshuazh-x](https://github.com/joshuazh-x), [kishen-v](https://github.com/kishen-v), [lavishpal](https://github.com/lavishpal), [liggitt](https://github.com/liggitt), [marcelfranca](https://github.com/marcelfranca), [miancheng7](https://github.com/miancheng7), [mmorel-35](https://github.com/mmorel-35), [MrDXY](https://github.com/MrDXY), [mrueg](https://github.com/mrueg), [purpleidea](https://github.com/purpleidea), [qsyqian](https://github.com/qsyqian), [redwrasse](https://github.com/redwrasse), [ronaldngounou](https://github.com/ronaldngounou), [skitt](https://github.com/skitt), [spzala](https://github.com/spzala), [tcchawla](https://github.com/tcchawla), [tjungblu](https://github.com/tjungblu), [vivekpatani](https://github.com/vivekpatani), [wenjiaswe](https://github.com/wenjiaswe)

<!--
### New contributors
-->
### 新贡献者

<!--
A special welcome to the contributors who made their first etcd contribution in this cycle — including [Jeffrey Ying](https://github.com/jefftree), whose work drove the RangeStream feature. New contributors can have a substantial impact on etcd; if you'd like to get involved, see the [contributor guide](https://github.com/etcd-io/etcd/blob/main/CONTRIBUTING.md).
-->
特别欢迎在此周期中首次为 etcd 做出贡献的贡献者 — 包括
[Jeffrey Ying](https://github.com/jefftree)，他的工作推动了 RangeStream 功能的实现。
新贡献者可以对 etcd 产生重大影响；如果你想参与，请参阅
[贡献者指南](https://github.com/etcd-io/etcd/blob/main/CONTRIBUTING.md)。

[1911860538](https://github.com/1911860538), [4rivappa](https://github.com/4rivappa), [aaronjzhang](https://github.com/aaronjzhang), [abdurrehman107](https://github.com/abdurrehman107), [ABin-Huang](https://github.com/ABin-Huang), [adeptvin1](https://github.com/adeptvin1), [aditya7880900936](https://github.com/aditya7880900936), [AHBICJ](https://github.com/AHBICJ), [akstron](https://github.com/akstron), [alliasgher](https://github.com/alliasgher), [aman4433](https://github.com/aman4433), [aojea](https://github.com/aojea), [apullo777](https://github.com/apullo777), [AR21SM](https://github.com/AR21SM), [arturmelanchyk](https://github.com/arturmelanchyk), [AshrafAhmed9](https://github.com/AshrafAhmed9), [asttool](https://github.com/asttool), [asutorufa](https://github.com/asutorufa), [BBQing](https://github.com/BBQing), [beforetech](https://github.com/beforetech), [boqishan](https://github.com/boqishan), [caltechustc](https://github.com/caltechustc), [carsontham](https://github.com/carsontham), [christophsj](https://github.com/christophsj), [chuanye-gao](https://github.com/chuanye-gao), [cnuss](https://github.com/cnuss), [cuiweixie](https://github.com/cuiweixie), [dmvolod](https://github.com/dmvolod), [Dogacel](https://github.com/Dogacel), [dongjiang1989](https://github.com/dongjiang1989), [EduardoVega](https://github.com/EduardoVega), [evertrain](https://github.com/evertrain), [eyupcanakman](https://github.com/eyupcanakman), [gaganhr94](https://github.com/gaganhr94), [goingforstudying-ctrl](https://github.com/goingforstudying-ctrl), [greenblade29](https://github.com/greenblade29), [Himanshu-370](https://github.com/Himanshu-370), [HossamSaberX](https://github.com/HossamSaberX), [huajianxiaowanzi](https://github.com/huajianxiaowanzi), [hwdef](https://github.com/hwdef), [ishan-gupta2005](https://github.com/ishan-gupta2005), [ishan16696](https://github.com/ishan16696), [ivangsm](https://github.com/ivangsm), [JasonLove-Coding](https://github.com/JasonLove-Coding), [Jefftree](https://github.com/Jefftree), [jianfengye](https://github.com/jianfengye), [jiminhu](https://github.com/jiminhu), [jinmingming2016](https://github.com/jinmingming2016), [jinseopim](https://github.com/jinseopim), [johscheuer](https://github.com/johscheuer), [jonathan-taylor](https://github.com/jonathan-taylor), [juan-lee](https://github.com/juan-lee), [JustinKuli](https://github.com/JustinKuli), [kevinklinger](https://github.com/kevinklinger), [krasin](https://github.com/krasin), [KravtsovV](https://github.com/KravtsovV), [la55u](https://github.com/la55u), [lanshiqin](https://github.com/lanshiqin), [lindycoder](https://github.com/lindycoder), [linuxbean](https://github.com/linuxbean), [liufuyang](https://github.com/liufuyang), [lunarwhite](https://github.com/lunarwhite), [M00nLight](https://github.com/M00nLight), [majiayi](https://github.com/majiayi), [marcosqf](https://github.com/marcosqf), [MartinForReal](https://github.com/MartinForReal), [matthias-lohr](https://github.com/matthias-lohr), [mattlqx](https://github.com/mattlqx), [mcarrano](https://github.com/mcarrano), [michmike](https://github.com/michmike), [mike-chen01](https://github.com/mike-chen01), [mikefarah](https://github.com/mikefarah), [MikulasZelinka](https://github.com/MikulasZelinka), [miztiik](https://github.com/miztiik), [mlauner](https://github.com/mlauner), [mlh758](https://github.com/mlh758), [moelholm](https://github.com/moelholm), [morsapaes](https://github.com/morsapaes), [MrTomSawyer](https://github.com/MrTomSawyer), [nate-double-u](https://github.com/nate-double-u), [nishanttotla](https://github.com/nishanttotla), [nomorethink](https://github.com/nomorethink), [Oberon00](https://github.com/Oberon00), [octaviof](https://github.com/octaviof), [OmarZayed](https://github.com/OmarZayed), [pavolloffay](https://github.com/pavolloffay), [pencor](https://github.com/pencor), [petermattis](https://github.com/petermattis), [phanvanhai](https://github.com/phanvanhai), [philip5096](https://github.com/philip5096), [pixdrift](https://github.com/pixdrift), [PivotalJosh](https://github.com/PivotalJosh), [pmorie](https://github.com/pmorie), [q3k](https://github.com/q3k), [raghavendra-talur](https://github.com/raghavendra-talur), [rajatchopra](https://github.com/rajatchopra), [RanjiK](https://github.com/RanjiK), [ravisw2013](https://github.com/ravisw2013), [redskal](https://github.com/redskal), [remyleone](https://github.com/remyleone), [robert-scheck](https://github.com/robert-scheck), [rohan-kanade](https://github.com/rohan-kanade), [rqlite](https://github.com/rqlite), [sethp-nr](https://github.com/sethp-nr), [shadow1305](https://github.com/shadow1305), [sheldux](https://github.com/sheldux), [shizhiguo](https://github.com/shizhiguo), [sidje2001](https://github.com/sidje2001), [simbafs](https://github.com/simbafs), [skgsergio](https://github.com/skgsergio), [slawomir-smyk](https://github.com/slawomir-smyk), [smunaut](https://github.com/smunaut), [sohlich](https://github.com/sohlich), [sparkoo](https://github.com/sparkoo), [spinkube](https://github.com/spinkube), [stefanprodan](https://github.com/stefanprodan), [stilldavid](https://github.com/stilldavid), [str4d](https://github.com/str4d), [szentistvan0](https://github.com/szentistvan0), [talayhan](https://github.com/talayhan), [tommy-sho](https://github.com/tommy-sho), [topolovec](https://github.com/topolovec), [travlerz](https://github.com/travlerz), [tupyy](https://github.com/tupyy), [uablrek](https://github.com/uablrek), [ueokande](https://github.com/ueokande), [vaporz01](https://github.com/vaporz01), [Verf](https://github.com/Verf), [vincent-pli](https://github.com/vincent-pli), [wenyiqing](https://github.com/wenyiqing), [wlgw](https://github.com/wlgw), [wuyue92tree](https://github.com/wuyue92tree), [xiaobailong24](https://github.com/xiaobailong24), [xiangpengzhao](https://github.com/xiangpengzhao), [xiliangMa](https://github.com/xiliangMa), [xinchenh](https://github.com/xinchenh), [xuwen](https://github.com/xuwen), [y0ssar1an](https://github.com/y0ssar1an), [yanniszark](https://github.com/yanniszark), [yihuafan](https://github.com/yihuafan), [yinheyi](https://github.com/yinheyi), [yorkie](https://github.com/yorkie), [yuancheng-liu](https://github.com/yuancheng-liu), [zhizhenxu](https://github.com/zhizhenxu), [zlsun](https://github.com/zlsun), [Zombie110year](https://github.com/Zombie110year), [zx2c4](https://github.com/zx2c4)

<!--
Feedback can be shared through:
-->
反馈可以通过以下方式分享：

* [GitHub issues](https://github.com/etcd-io/etcd/issues)
* [Kubernetes Slack](https://www.kubernetes.dev/docs/comms/slack/#joining-slack) 中的
[#sig-etcd slack 频道](https://kubernetes.slack.com/archives/C3HD8ARJ5)
* [etcd-dev 邮件列表](https://groups.google.com/g/etcd-dev)
