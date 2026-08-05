---
layout: blog
title: "Security Profiles Operator v0.4.0 中的新功能"
date: 2021-12-17
slug: security-profiles-operator
---

<!--
layout: blog
title: "What's new in Security Profiles Operator v0.4.0"
date: 2021-12-17
slug: security-profiles-operator
-->

<!--
**Authors:** Jakub Hrozek, Juan Antonio Osorio, Paulo Gomes, Sascha Grunert
-->
**作者:** Jakub Hrozek, Juan Antonio Osorio, Paulo Gomes, Sascha Grunert

---

<!--
The [Security Profiles Operator (SPO)](https://sigs.k8s.io/security-profiles-operator)
is an out-of-tree Kubernetes enhancement to make the management of
[seccomp](https://en.wikipedia.org/wiki/Seccomp),
[SELinux](https://en.wikipedia.org/wiki/Security-Enhanced_Linux) and
[AppArmor](https://en.wikipedia.org/wiki/AppArmor) profiles easier and more
convenient. We're happy to announce that we recently [released
v0.4.0](https://github.com/kubernetes-sigs/security-profiles-operator/releases/tag/v0.4.0)
of the operator, which contains a ton of new features, fixes and usability
improvements.
-->

[Security Profiles Operator (SPO)](https://sigs.k8s.io/security-profiles-operator) 
是一种树外 Kubernetes 增强功能，用于更方便、更便捷地管理 [seccomp](https://en.wikipedia.org/wiki/Seccomp)、
[SELinux](https://zh.wikipedia.org/wiki/%E5%AE%89%E5%85%A8%E5%A2%9E%E5%BC%BA%E5%BC%8FLinux) 和
[AppArmor](https://zh.wikipedia.org/wiki/AppArmor) 配置文件。 
我们很高兴地宣布，我们最近[发布了 v0.4.0](https://github.com/kubernetes-sigs/security-profiles-operator/releases/tag/v0.4.0)
的 Operator，其中包含了大量的新功能、缺陷修复和可用性改进。

<!--
## What's new

It has been a while since the last
[v0.3.0](https://github.com/kubernetes-sigs/security-profiles-operator/releases/tag/v0.3.0)
release of the operator. We added new features, fine-tuned existing ones and
reworked our documentation in 290 commits over the past half year.
-->
## 有哪些新特性

距离上次的 [v0.3.0](https://github.com/kubernetes-sigs/security-profiles-operator/releases/tag/v0.3.0)
的发布已经有一段时间了。在过去的半年里，我们增加了新的功能，对现有的功能进行了微调，
并且在过去的半年里，我们通过 290 个提交重新编写了文档。


<!--
One of the highlights is that we're now able to record seccomp and SELinux
profiles using the operators [log enricher](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#log-enricher-based-recording).
This allows us to reduce the dependencies required for profile recording to have
[auditd](https://linux.die.net/man/8/auditd) or
[syslog](https://en.wikipedia.org/wiki/Syslog) (as fallback) running on the
nodes. All profile recordings in the operator work in the same way by using the
`ProfileRecording` CRD as well as their corresponding [label
selectors](/docs/concepts/overview/working-with-objects/labels). The log
enricher itself can be also used to gather meaningful insights about seccomp and
SELinux messages of a node. Checkout the [official
documentation](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#using-the-log-enricher)
to learn more about it.
-->

亮点之一是我们现在能够使用 Operator 的[日志增强组件](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#log-enricher-based-recording)
记录 seccomp 和 SELinux 的配置文件。
这使我们能够减少配置文件记录所需的依赖事项，使得仅剩的依赖变为在节点上运行
[auditd](https://linux.die.net/man/8/auditd) 或 [syslog](https://en.wikipedia.org/wiki/Syslog)（作为一种回退机制）。
通过使用 `ProfileRecording` CRD 及其对应的[标签选择算符](/zh-cn/concepts/overview/working-with-objects/labels)，
Operator 中的所有配置文件记录都以相同的方式工作。
日志增强组件本身也可用于获得有关节点上的 seccomp 和 SELinux 消息的有意义的洞察。
查看[官方文档](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#using-the-log-enricher)
了解更多信息。

<!--
### seccomp related improvements

Beside the log enricher based recording we now offer an alternative to record
seccomp profiles by utilizing [ebpf](https://ebpf.io). This optional feature can
be enabled by setting `enableBpfRecorder` to `true`. This results in running a
dedicated container, which ships a custom bpf module on every node to collect
the syscalls for containers. It even supports older Kernel versions which do not
expose the [BPF Type Format (BTF)](https://www.kernel.org/doc/html/latest/bpf/btf.html) per
default as well as the `amd64` and `arm64` architectures. Checkout
[our documentation](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#ebpf-based-recording)
to see it in action. By the way, we now add the seccomp profile architecture of
the recorder host to the recorded profile as well.
-->

### 与 seccomp 有关的改进

除了基于日志丰富器的记录之外，我们现在还使用 [ebpf](https://ebpf.io)
作为记录 seccomp 配置文件的一种替代方法。可以通过将 `enableBpfRecorder` 设置为 `true` 来启用此可选功能。
启用之后会导致一个专用的容器被启动运行；该容器在每个节点上提供一个自定义 bpf 模块以收集容器的系统调用。 
它甚至支持默认不公开 [BPF 类型格式 (BTF)](https://www.kernel.org/doc/html/latest/bpf/btf.html) 
的旧内核版本以及 `amd64 ` 和 `arm64` 架构。查看 [我们的文档](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#ebpf-based-recording) 
以查看它的实际效果。顺便说一句，我们现在也将记录器主机的 seccomp 配置文件体系结构添加到记录的配置文件中。

<!--
We also graduated the seccomp profile API from `v1alpha1` to `v1beta1`. This
aligns with our overall goal to stabilize the CRD APIs over time. The only thing
which has changed is that the seccomp profile type `Architectures` now points to
`[]Arch` instead of `[]*Arch`.
-->
我们还将 seccomp 配置文件 API 从 `v1alpha1` 升级到 `v1beta1`。 
这符合我们随着时间的推移稳定 CRD API 的总体目标。 
唯一改变的是 seccomp 配置文件类型 `Architectures` 现在指向 `[]Arch` 而不是 `[]*Arch`。


<!--
### SELinux enhancements

Managing SELinux policies (an equivalent to using `semodule` that
you would normally call on a single server) is not done by SPO
itself, but by another container called selinuxd to provide better
isolation. This release switched to using selinuxd containers from
a personal repository to images located under [our team's quay.io
repository](https://quay.io/organization/security-profiles-operator).
The selinuxd repository has moved as well to [the containers GitHub
organization](https://github.com/containers/selinuxd).
-->
### SELinux 增强功能

管理 SELinux 策略（相当于使用通常在单个服务器上调用的 `semodule` ）不是由 SPO 本身完成的，
而是由另一个名为 selinuxd 的容器完成，以提供更好的隔离。此版本将所使用的 selinuxd
容器镜像从个人仓库迁移到位于[我们团队的 quay.io 仓库](https://quay.io/organization/security-profiles-operator)下的镜像。
selinuxd 仓库也已移至[GitHub 组织 containers](https://github.com/containers/selinuxd)。

<!--
Please note that selinuxd links dynamically to `libsemanage` and mounts the
SELinux directories from the nodes, which means that the selinuxd container
must be running the same distribution as the cluster nodes. SPO defaults
to using CentOS-8 based containers, but we also build Fedora based ones.
If you are using another distribution and would like us to add support for
it, please file [an issue against selinuxd](https://github.com/containers/selinuxd/issues).
-->
请注意，selinuxd 动态链接到 libsemanage 并挂载节点上的 SELinux 目录，
这意味着 selinuxd 容器必须与集群节点运行相同的发行版。SPO 默认使用基于 CentOS-8 的容器，
但我们也构建基于 Fedora 的容器。如果你使用其他发行版并希望我们添加对它的支持，
请[针对 selinuxd 提交 issue](https://github.com/containers/selinuxd/issues)。

<!--
#### Profile Recording

This release adds support for recording of SELinux profiles.
The recording itself is managed via an instance of a `ProfileRecording` Custom
Resource as seen in an
[example](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/examples/profilerecording-selinux-logs.yaml)
in our repository. From the user's point of view it works pretty much the same
as recording of seccomp profiles.
-->
#### 配置文件记录

此版本（0.4.0）增加了记录 SELinux 配置文件的支持。记录本身是通过 `ProfileRecording` 自定义资源的实例管理的，
如我们仓库中的[示例](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/examples/profilerecording-selinux-logs.yaml)
所示。从用户的角度来看，它的工作原理与记录 seccomp 配置文件几乎相同。

<!--
Under the hood, to know what the workload is doing SPO installs a special
permissive policy called [selinuxrecording](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/deploy/base/profiles/selinuxrecording.cil)
on startup which allows everything and logs all AVCs to `audit.log`.
These AVC messages are scraped by the log enricher component and when
the recorded workload exits, the policy is created.
-->
在后台，为了知道工作负载在做什么，SPO 安装了一个名为 [selinuxrecording](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/deploy/base/profiles/selinuxrecording.cil)
的、限制宽松的策略，允许执行所有操作并将所有 AVC 记录到 `audit.log` 中。
这些 AVC 消息由日志增强组件抓取，当所记录的工作负载退出时，该策略被创建。

<!--
#### `SELinuxProfile` CRD graduation

An `v1alpha2` version of the `SelinuxProfile` object has been introduced. This
removes the raw Common Intermediate Language (CIL) from the object itself and
instead adds a simple policy language to ease the writing and parsing
experience.
-->
#### `SELinuxProfile` CRD 毕业

我们引入了 `SelinuxProfile` 对象的 `v1alpha2` 版本。
这个版本从对象中删除了原始的通用中间语言 (CIL)，并添加了一种简单的策略语言来简化编写和解析体验。

<!--
Alongside, a `RawSelinuxProfile` object was also introduced. This contains a
wrapped and raw representation of the policy. This was intended for folks to be
able to take their existing policies into use as soon as possible. However, on
validations are done here.
-->
此外，我们还引入了 `RawSelinuxProfile` 对象。该对象包含策略的包装和原始表示。
引入此对象是为了让人们能够尽快将他们现有的策略付诸实现。但是，策略的验证是在这里完成的。

<!--
### AppArmor support

This version introduces the initial support for AppArmor, allowing users to load and 
unload AppArmor profiles into cluster nodes by using the new [AppArmorProfile](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/deploy/base-crds/crds/apparmorprofile.yaml) CRD.
-->
### AppArmor 支持

0.4.0 版本引入了对 AppArmor 的初始支持，允许用户通过使用新的
[AppArmorProfile](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/deploy/base-crds/crds/apparmorprofile.yaml)
在集群节点中 CRD 加载或卸载 AppArmor 配置文件。

<!--
To enable AppArmor support use the [enableAppArmor feature gate](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/examples/config.yaml#L10) switch of your SPO configuration.
Then use our [apparmor example](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/examples/apparmorprofile.yaml) to deploy your first profile across your cluster.
-->
要启用 AppArmor 支持，请使用 SPO 配置的 [enableAppArmor 特性门控](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/examples/config.yaml#L10)开关。
然后使用我们的 [apparmor 示例](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/examples/apparmorprofile.yaml) 在集群中部署你第一个配置文件。

<!--
### Metrics

The operator now exposes metrics, which are described in detail in
our new [metrics documentation](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#using-metrics).
We decided to secure the metrics retrieval process by using
[kube-rbac-proxy](https://github.com/brancz/kube-rbac-proxy), while we ship an
additional `spo-metrics-client` cluster role (and binding) to retrieve the
metrics from within the cluster. If you're using
[OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift),
then we provide an out of the box working
[`ServiceMonitor`](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#automatic-servicemonitor-deployment)
to access the metrics.
-->
### 指标

Operator 现在能够公开在我们的新[指标文档](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#using-metrics)中详细描述的指标。
我们决定使用 [kube-rbac-proxy](https://github.com/brancz/kube-rbac-proxy) 来保护指标检索过程，
同时我们提供了一个额外的 `spo-metrics-client` 集群角色（和绑定）以从集群内检索指标。 
如果你使用 [OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift)，
那么我们提供了一个开箱即用的 [`ServiceMonitor`](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#automatic-servicemonitor-deployment)
来访问指标。


<!--
#### Debuggability and robustness

Beside all those new features, we decided to restructure parts of the Security
Profiles Operator internally to make it better to debug and more robust. For
example, we now maintain an internal [gRPC](https://grpc.io) API to communicate
within the operator across different features. We also improved the performance
of the log enricher, which now caches results for faster retrieval of the log
data. The operator can be put into a more [verbose log mode](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#set-logging-verbosity)
by setting `verbosity` from `0` to `1`.
-->
#### 可调试性和稳健性

除了所有这些新功能外，我们还决定在内部重组安全配置文件操作程序的部分内容，使其更易于调试和更稳健。
例如，我们现在维护了一个内部 [gRPC](https://grpc.io) API，以便在 Operator 内部跨不同功能组件进行通信。
我们还提高了日志增强组件的性能，现在它可以缓存结果，以便更快地检索日志数据。
Operator 可以通过将 `verbosity` 设置从 `0` 改为 `1`，启用更详细的日志模式(https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#set-logging-verbosity)。

<!--
We also print the used `libseccomp` and `libbpf` versions on startup, as well as
expose CPU and memory profiling endpoints for each container via the
[`enableProfiling` option](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#enable-cpu-and-memory-profiling).
Dedicated liveness and startup probes inside of the operator daemon will now
additionally improve the life cycle of the operator.
-->
我们还在启动时打印所使用的 `libseccomp` 和 `libbpf` 版本，
并通过 [`enableProfiling` 选项](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#enable-cpu-and-memory-profiling)
公开每个容器的 CPU 和内存性能分析端点。
Operator 守护程序内部的专用的存活态探测和启动探测现在能进一步改善 Operator 的生命周期管理。


<!--
## Conclusion

Thank you for reading this update. We're looking forward to future enhancements
of the operator and would love to get your feedback about the latest release.
Feel free to reach out to us via the Kubernetes slack
[#security-profiles-operator](https://kubernetes.slack.com/messages/security-profiles-operator)
for any feedback or question.
-->
## 总结

感谢你阅读这次更新。我们期待着 Operater 的未来改进，并希望得到你对最新版本的反馈。
欢迎通过 Kubernetes slack [#security-profiles-operator](https://kubernetes.slack.com/messages/security-profiles-operator)
与我们联系，提出任何反馈或问题。
