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
是一種樹外 Kubernetes 增強功能，用於更方便、更便捷地管理 [seccomp](https://en.wikipedia.org/wiki/Seccomp)、
[SELinux](https://zh.wikipedia.org/wiki/%E5%AE%89%E5%85%A8%E5%A2%9E%E5%BC%BA%E5%BC%8FLinux) 和
[AppArmor](https://zh.wikipedia.org/wiki/AppArmor) 配置文件。 
我們很高興地宣佈，我們最近[發佈了 v0.4.0](https://github.com/kubernetes-sigs/security-profiles-operator/releases/tag/v0.4.0)
的 Operator，其中包含了大量的新功能、缺陷修復和可用性改進。

<!--
## What's new

It has been a while since the last
[v0.3.0](https://github.com/kubernetes-sigs/security-profiles-operator/releases/tag/v0.3.0)
release of the operator. We added new features, fine-tuned existing ones and
reworked our documentation in 290 commits over the past half year.
-->
## 有哪些新特性

距離上次的 [v0.3.0](https://github.com/kubernetes-sigs/security-profiles-operator/releases/tag/v0.3.0)
的發佈已經有一段時間了。在過去的半年裏，我們增加了新的功能，對現有的功能進行了微調，
並且在過去的半年裏，我們通過 290 個提交重新編寫了文檔。


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

亮點之一是我們現在能夠使用 Operator 的[日誌增強組件](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#log-enricher-based-recording)
記錄 seccomp 和 SELinux 的配置文件。
這使我們能夠減少配置文件記錄所需的依賴事項，使得僅剩的依賴變爲在節點上運行
[auditd](https://linux.die.net/man/8/auditd) 或 [syslog](https://en.wikipedia.org/wiki/Syslog)（作爲一種回退機制）。
通過使用 `ProfileRecording` CRD 及其對應的[標籤選擇算符](/zh-cn/concepts/overview/working-with-objects/labels)，
Operator 中的所有配置文件記錄都以相同的方式工作。
日誌增強組件本身也可用於獲得有關節點上的 seccomp 和 SELinux 消息的有意義的洞察。
查看[官方文檔](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#using-the-log-enricher)
瞭解更多信息。

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

### 與 seccomp 有關的改進

除了基於日誌豐富器的記錄之外，我們現在還使用 [ebpf](https://ebpf.io)
作爲記錄 seccomp 配置文件的一種替代方法。可以通過將 `enableBpfRecorder` 設置爲 `true` 來啓用此可選功能。
啓用之後會導致一個專用的容器被啓動運行；該容器在每個節點上提供一個自定義 bpf 模塊以收集容器的系統調用。 
它甚至支持默認不公開 [BPF 類型格式 (BTF)](https://www.kernel.org/doc/html/latest/bpf/btf.html) 
的舊內核版本以及 `amd64 ` 和 `arm64` 架構。查看 [我們的文檔](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#ebpf-based-recording) 
以查看它的實際效果。順便說一句，我們現在也將記錄器主機的 seccomp 配置文件體系結構添加到記錄的配置文件中。

<!--
We also graduated the seccomp profile API from `v1alpha1` to `v1beta1`. This
aligns with our overall goal to stabilize the CRD APIs over time. The only thing
which has changed is that the seccomp profile type `Architectures` now points to
`[]Arch` instead of `[]*Arch`.
-->
我們還將 seccomp 配置文件 API 從 `v1alpha1` 升級到 `v1beta1`。 
這符合我們隨着時間的推移穩定 CRD API 的總體目標。 
唯一改變的是 seccomp 配置文件類型 `Architectures` 現在指向 `[]Arch` 而不是 `[]*Arch`。


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
### SELinux 增強功能

管理 SELinux 策略（相當於使用通常在單個服務器上調用的 `semodule` ）不是由 SPO 本身完成的，
而是由另一個名爲 selinuxd 的容器完成，以提供更好的隔離。此版本將所使用的 selinuxd
容器鏡像從個人倉庫遷移到位於[我們團隊的 quay.io 倉庫](https://quay.io/organization/security-profiles-operator)下的鏡像。
selinuxd 倉庫也已移至[GitHub 組織 containers](https://github.com/containers/selinuxd)。

<!--
Please note that selinuxd links dynamically to `libsemanage` and mounts the
SELinux directories from the nodes, which means that the selinuxd container
must be running the same distribution as the cluster nodes. SPO defaults
to using CentOS-8 based containers, but we also build Fedora based ones.
If you are using another distribution and would like us to add support for
it, please file [an issue against selinuxd](https://github.com/containers/selinuxd/issues).
-->
請注意，selinuxd 動態鏈接到 libsemanage 並掛載節點上的 SELinux 目錄，
這意味着 selinuxd 容器必須與集羣節點運行相同的發行版。SPO 默認使用基於 CentOS-8 的容器，
但我們也構建基於 Fedora 的容器。如果你使用其他發行版並希望我們添加對它的支持，
請[針對 selinuxd 提交 issue](https://github.com/containers/selinuxd/issues)。

<!--
#### Profile Recording

This release adds support for recording of SELinux profiles.
The recording itself is managed via an instance of a `ProfileRecording` Custom
Resource as seen in an
[example](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/examples/profilerecording-selinux-logs.yaml)
in our repository. From the user's point of view it works pretty much the same
as recording of seccomp profiles.
-->
#### 配置文件記錄

此版本（0.4.0）增加了記錄 SELinux 配置文件的支持。記錄本身是通過 `ProfileRecording` 自定義資源的實例管理的，
如我們倉庫中的[示例](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/examples/profilerecording-selinux-logs.yaml)
所示。從用戶的角度來看，它的工作原理與記錄 seccomp 配置文件幾乎相同。

<!--
Under the hood, to know what the workload is doing SPO installs a special
permissive policy called [selinuxrecording](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/deploy/base/profiles/selinuxrecording.cil)
on startup which allows everything and logs all AVCs to `audit.log`.
These AVC messages are scraped by the log enricher component and when
the recorded workload exits, the policy is created.
-->
在後臺，爲了知道工作負載在做什麼，SPO 安裝了一個名爲 [selinuxrecording](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/deploy/base/profiles/selinuxrecording.cil)
的、限制寬鬆的策略，允許執行所有操作並將所有 AVC 記錄到 `audit.log` 中。
這些 AVC 消息由日誌增強組件抓取，當所記錄的工作負載退出時，該策略被創建。

<!--
#### `SELinuxProfile` CRD graduation

An `v1alpha2` version of the `SelinuxProfile` object has been introduced. This
removes the raw Common Intermediate Language (CIL) from the object itself and
instead adds a simple policy language to ease the writing and parsing
experience.
-->
#### `SELinuxProfile` CRD 畢業

我們引入了 `SelinuxProfile` 對象的 `v1alpha2` 版本。
這個版本從對象中刪除了原始的通用中間語言 (CIL)，並添加了一種簡單的策略語言來簡化編寫和解析體驗。

<!--
Alongside, a `RawSelinuxProfile` object was also introduced. This contains a
wrapped and raw representation of the policy. This was intended for folks to be
able to take their existing policies into use as soon as possible. However, on
validations are done here.
-->
此外，我們還引入了 `RawSelinuxProfile` 對象。該對象包含策略的包裝和原始表示。
引入此對象是爲了讓人們能夠儘快將他們現有的策略付諸實現。但是，策略的驗證是在這裏完成的。

<!--
### AppArmor support

This version introduces the initial support for AppArmor, allowing users to load and 
unload AppArmor profiles into cluster nodes by using the new [AppArmorProfile](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/deploy/base-crds/crds/apparmorprofile.yaml) CRD.
-->
### AppArmor 支持

0.4.0 版本引入了對 AppArmor 的初始支持，允許用戶通過使用新的
[AppArmorProfile](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/deploy/base-crds/crds/apparmorprofile.yaml)
在集羣節點中 CRD 加載或卸載 AppArmor 配置文件。

<!--
To enable AppArmor support use the [enableAppArmor feature gate](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/examples/config.yaml#L10) switch of your SPO configuration.
Then use our [apparmor example](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/examples/apparmorprofile.yaml) to deploy your first profile across your cluster.
-->
要啓用 AppArmor 支持，請使用 SPO 配置的 [enableAppArmor 特性門控](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/examples/config.yaml#L10)開關。
然後使用我們的 [apparmor 示例](https://github.com/kubernetes-sigs/security-profiles-operator/blob/main/examples/apparmorprofile.yaml) 在集羣中部署你第一個配置文件。

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
### 指標

Operator 現在能夠公開在我們的新[指標文檔](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#using-metrics)中詳細描述的指標。
我們決定使用 [kube-rbac-proxy](https://github.com/brancz/kube-rbac-proxy) 來保護指標檢索過程，
同時我們提供了一個額外的 `spo-metrics-client` 集羣角色（和綁定）以從集羣內檢索指標。 
如果你使用 [OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift)，
那麼我們提供了一個開箱即用的 [`ServiceMonitor`](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#automatic-servicemonitor-deployment)
來訪問指標。


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
#### 可調試性和穩健性

除了所有這些新功能外，我們還決定在內部重組安全配置文件操作程序的部分內容，使其更易於調試和更穩健。
例如，我們現在維護了一個內部 [gRPC](https://grpc.io) API，以便在 Operator 內部跨不同功能組件進行通信。
我們還提高了日誌增強組件的性能，現在它可以緩存結果，以便更快地檢索日誌數據。
Operator 可以通過將 `verbosity` 設置從 `0` 改爲 `1`，啓用更詳細的日誌模式(https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#set-logging-verbosity)。

<!--
We also print the used `libseccomp` and `libbpf` versions on startup, as well as
expose CPU and memory profiling endpoints for each container via the
[`enableProfiling` option](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#enable-cpu-and-memory-profiling).
Dedicated liveness and startup probes inside of the operator daemon will now
additionally improve the life cycle of the operator.
-->
我們還在啓動時打印所使用的 `libseccomp` 和 `libbpf` 版本，
並通過 [`enableProfiling` 選項](https://github.com/kubernetes-sigs/security-profiles-operator/blob/71b3915/installation-usage.md#enable-cpu-and-memory-profiling)
公開每個容器的 CPU 和內存性能分析端點。
Operator 守護程序內部的專用的存活態探測和啓動探測現在能進一步改善 Operator 的生命週期管理。


<!--
## Conclusion

Thank you for reading this update. We're looking forward to future enhancements
of the operator and would love to get your feedback about the latest release.
Feel free to reach out to us via the Kubernetes slack
[#security-profiles-operator](https://kubernetes.slack.com/messages/security-profiles-operator)
for any feedback or question.
-->
## 總結

感謝你閱讀這次更新。我們期待着 Operater 的未來改進，並希望得到你對最新版本的反饋。
歡迎通過 Kubernetes slack [#security-profiles-operator](https://kubernetes.slack.com/messages/security-profiles-operator)
與我們聯繫，提出任何反饋或問題。
