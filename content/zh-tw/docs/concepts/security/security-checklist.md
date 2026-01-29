---
title: 安全檢查清單
description: >
  確保 Kubernetes 叢集安全的基線檢查清單。
content_type: concept
weight: 100
---
<!--
title: Security Checklist
description: >
  Baseline checklist for ensuring security in Kubernetes clusters.
content_type: concept
weight: 100
-->

<!-- overview -->
<!--
This checklist aims at providing a basic list of guidance with links to more
comprehensive documentation on each topic. It does not claim to be exhaustive
and is meant to evolve.

On how to read and use this document:

- The order of topics does not reflect an order of priority.
- Some checklist items are detailed in the paragraph below the list of each section.
-->
本清單旨在提供一個基本的指導列表，其中包含鏈接，指向各個主題的更爲全面的文檔。
此清單不求詳盡無遺，是預計會不斷演化的。

關於如何閱讀和使用本文檔：

- 主題的順序並不代表優先級的順序。
- 在每章節的列表下面的段落中，都詳細列舉了一些檢查清項目。

{{< caution >}}
<!--
Checklists are **not** sufficient for attaining a good security posture on their
own. A good security posture requires constant attention and improvement, but a
checklist can be the first step on the never-ending journey towards security
preparedness. Some of the recommendations in this checklist may be too
restrictive or too lax for your specific security needs. Since Kubernetes
security is not "one size fits all", each category of checklist items should be
evaluated on its merits.
-->
單靠檢查清單是**不夠的**，無法獲得良好的安全態勢。
實現良好的安全態勢需要持續的關注和改進，實現安全上有備無患的目標道路漫長，清單可作爲征程上的第一步。
對於你的特定安全需求，此清單中的某些建議可能過於嚴格或過於寬鬆。
由於 Kubernetes 的安全性並不是“一刀切”的，因此針對每一類檢查清單項目都應該做價值評估。
{{< /caution >}}

<!-- body -->

<!--
## Authentication & Authorization

- [ ] `system:masters` group is not used for user or component authentication after bootstrapping.
- [ ] The kube-controller-manager is running with `--use-service-account-credentials`
  enabled.
- [ ] The root certificate is protected (either an offline CA, or a managed
  online CA with effective access controls).
- [ ] Intermediate and leaf certificates have an expiry date no more than 3
  years in the future.
- [ ] A process exists for periodic access review, and reviews occur no more
  than 24 months apart.
- [ ] The [Role Based Access Control Good Practices](/docs/concepts/security/rbac-good-practices/)
  are followed for guidance related to authentication and authorization.
-->
## 身份驗證和鑑權 {#authentication-authorization}

- [ ] 在啓動後 `system:masters` 組不用於使用者或組件的身份驗證。
- [ ] kube-controller-manager 運行時要啓用 `--use-service-account-credentials` 參數。
- [ ] 根證書要受到保護（或離線 CA，或一個具有有效訪問控制的託管型在線 CA）。
- [ ] 中級證書和葉子證書的有效期不要超過未來 3 年。
- [ ] 存在定期訪問審查的流程，審查間隔不要超過 24 個月。
- [ ] 遵循[基於角色的訪問控制良好實踐](/zh-cn/docs/concepts/security/rbac-good-practices/)，
  以獲得與身份驗證和授權相關的指導。

<!--
After bootstrapping, neither users nor components should authenticate to the
Kubernetes API as `system:masters`. Similarly, running all of
kube-controller-manager as `system:masters` should be avoided. In fact,
`system:masters` should only be used as a break-glass mechanism, as opposed to
an admin user.
-->
在啓動後，使用者和組件都不應以 `system:masters` 身份向 Kubernetes API 進行身份驗證。
同樣，應避免將任何 kube-controller-manager 以 `system:masters` 運行。
事實上，`system:masters` 應該只用作一個例外機制，而不是管理員使用者。

<!--
## Network security

- [ ] CNI plugins in use support network policies.
- [ ] Ingress and egress network policies are applied to all workloads in the
  cluster.
- [ ] Default network policies within each namespace, selecting all pods, denying
  everything, are in place.
- [ ] If appropriate, a service mesh is used to encrypt all communications inside of the cluster.
- [ ] The Kubernetes API, kubelet API and etcd are not exposed publicly on Internet.
- [ ] Access from the workloads to the cloud metadata API is filtered.
- [ ] Use of LoadBalancer and ExternalIPs is restricted.
-->
## 網路安全 {#network-security}

- [ ] 使用的 CNI 插件可支持網路策略。
- [ ] 對叢集中的所有工作負載應用入站和出站的網路策略。
- [ ] 落實每個名字空間內的預設網路策略，覆蓋所有 Pod，拒絕一切訪問。
- [ ] 如果合適，使用服務網格來加密叢集內的所有通信。
- [ ] 不在互聯網上公開 Kubernetes API、kubelet API 和 etcd。
- [ ] 過濾工作負載對雲元資料 API 的訪問。
- [ ] 限制使用 LoadBalancer 和 ExternalIP。

<!--
A number of [Container Network Interface (CNI) plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
plugins provide the functionality to
restrict network resources that pods may communicate with. This is most commonly done
through [Network Policies](/docs/concepts/services-networking/network-policies/)
which provide a namespaced resource to define rules. Default network policies
that block all egress and ingress, in each namespace, selecting all pods, can be
useful to adopt an allow list approach to ensure that no workloads are missed.
-->
許多[容器網路介面（Container Network Interface，CNI）插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)提供了限制
Pod 可能與之通信的網路資源的功能。
這種限制通常通過[網路策略](/zh-cn/docs/concepts/services-networking/network-policies/)來完成，
網路策略提供了一種名字空間作用域的資源來定義規則。
在每個名字空間中，預設的網路策略會阻塞所有的出入站流量，並選擇所有 Pod，
這種採用允許列表的方法很有用，可以確保不遺漏任何工作負載。

<!--
Not all CNI plugins provide encryption in transit. If the chosen plugin lacks this
feature, an alternative solution could be to use a service mesh to provide that
functionality.

The etcd datastore of the control plane should have controls to limit access and
not be publicly exposed on the Internet. Furthermore, mutual TLS (mTLS) should
be used to communicate securely with it. The certificate authority for this
should be unique to etcd.
-->
並非所有 CNI 插件都在傳輸過程中提供加密。
如果所選的插件缺少此功能，一種替代方案是可以使用服務網格來提供該功能。

控制平面的 etcd 資料儲存應該實施訪問限制控制，並且不要在互聯網上公開。
此外，應使用雙向 TLS（mTLS）與其進行安全通信。
用在這裏的證書機構應該僅用於 etcd。

<!--
External Internet access to the Kubernetes API server should be restricted to
not expose the API publicly. Be careful, as many managed Kubernetes distributions
are publicly exposing the API server by default. You can then use a bastion host
to access the server.

The [kubelet](/docs/reference/command-line-tools-reference/kubelet/) API access
should be restricted and not exposed publicly, the default authentication and
authorization settings, when no configuration file specified with the `--config`
flag, are overly permissive.
-->
應該限制外部互聯網對 Kubernetes API 伺服器未公開的 API 的訪問。
請小心，因爲許多託管的 Kubernetes 發行版在預設情況下公開了 API 伺服器。
當然，你可以使用堡壘機訪問伺服器。

對 [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) API 的訪問應該受到限制，
並且不公開，當沒有使用 `--config` 參數來設置設定檔案時，預設的身份驗證和鑑權設置是過於寬鬆的。

<!--
If a cloud provider is used for hosting Kubernetes, the access from pods to the cloud
metadata API `169.254.169.254` should also be restricted or blocked if not needed
because it may leak information.

For restricted LoadBalancer and ExternalIPs use, see
[CVE-2020-8554: Man in the middle using LoadBalancer or ExternalIPs](https://github.com/kubernetes/kubernetes/issues/97076)
and the [DenyServiceExternalIPs admission controller](/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)
for further information.
-->
如果使用雲服務供應商託管的 Kubernetes，在沒有明確需要的情況下，
也應該限制或阻止從 Pod 對雲元資料 API `169.254.169.254` 的訪問，因爲這可能泄露資訊。

關於限制使用 LoadBalancer 和 ExternalIP 請參閱
[CVE-2020-8554：中間人使用 LoadBalancer 或 ExternalIP](https://github.com/kubernetes/kubernetes/issues/97076)
和
[DenyServiceExternalIPs 准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)獲取更多資訊。

<!--
## Pod security

- [ ] RBAC rights to `create`, `update`, `patch`, `delete` workloads is only granted if necessary.
- [ ] Appropriate Pod Security Standards policy is applied for all namespaces and enforced.
- [ ] Memory limit is set for the workloads with a limit equal or inferior to the request.
- [ ] CPU limit might be set on sensitive workloads.
- [ ] For nodes that support it, Seccomp is enabled with appropriate syscalls
  profile for programs.
- [ ] For nodes that support it, AppArmor or SELinux is enabled with appropriate
  profile for programs.
-->
## Pod 安全 {#pod-security}

- [ ] 僅在必要時才授予 `create`、`update`、`patch`、`delete` 工作負載的 RBAC 權限。
- [ ] 對所有名字空間實施適當的 Pod 安全標準策略，並強制執行。
- [ ] 爲工作負載設置內存限制值，並確保限制值等於或者不高於請求值。
- [ ] 對敏感工作負載可以設置 CPU 限制。
- [ ] 對於支持 Seccomp 的節點，可以爲程式啓用合適的系統調用設定檔案。
- [ ] 對於支持 AppArmor 或 SELinux 的系統，可以爲程式啓用合適的設定檔案。

<!--
RBAC authorization is crucial but
[cannot be granular enough to have authorization on the Pods' resources](/docs/concepts/security/rbac-good-practices/#workload-creation)
(or on any resource that manages Pods). The only granularity is the API verbs
on the resource itself, for example, `create` on Pods. Without
additional admission, the authorization to create these resources allows direct
unrestricted access to the schedulable nodes of a cluster.
-->
RBAC 的授權是至關重要的，
但[不能在足夠細的粒度上對 Pod 的資源進行授權](/zh-cn/docs/concepts/security/rbac-good-practices/#workload-creation)，
也不足以對管理 Pod 的任何資源進行授權。
唯一的粒度是資源本身上的 API 動作，例如，對 Pod 的 `create`。
在未指定額外許可的情況下，創建這些資源的權限允許直接不受限制地訪問叢集的可調度節點。

<!--
The [Pod Security Standards](/docs/concepts/security/pod-security-standards/)
define three different policies, privileged, baseline and restricted that limit
how fields can be set in the `PodSpec` regarding security.
These standards can be enforced at the namespace level with the new
[Pod Security](/docs/concepts/security/pod-security-admission/) admission,
enabled by default, or by third-party admission webhook. Please note that,
contrary to the removed PodSecurityPolicy admission it replaces,
[Pod Security](/docs/concepts/security/pod-security-admission/)
admission can be easily combined with admission webhooks and external services.
-->
[Pod 安全性標準](/zh-cn/docs/concepts/security/pod-security-standards/)定義了三種不同的策略：
特權策略（Privileged）、基線策略（Baseline）和限制策略（Restricted），它們限制了 `PodSpec` 中關於安全的字段的設置。
這些標準可以通過預設啓用的新的
[Pod 安全性准入](/zh-cn/docs/concepts/security/pod-security-admission/)或第三方准入 Webhook 在名字空間級別強制執行。
請注意，與它所取代的、已被移除的 PodSecurityPolicy 准入機制相反，
[Pod 安全性准入](/zh-cn/docs/concepts/security/pod-security-admission/)可以輕鬆地與准入 Webhook 和外部服務相結合使用。

<!--
Pod Security admission `restricted` policy, the most restrictive policy of the
[Pod Security Standards](/docs/concepts/security/pod-security-standards/) set,
[can operate in several modes](/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces),
`warn`, `audit` or `enforce` to gradually apply the most appropriate
[security context](/docs/tasks/configure-pod-container/security-context/)
according to security best practices. Nevertheless, pods'
[security context](/docs/tasks/configure-pod-container/security-context/)
should be separately investigated to limit the privileges and access pods may
have on top of the predefined security standards, for specific use cases.
-->
`restricted` Pod 安全准入策略是 [Pod 安全性標準](/zh-cn/docs/concepts/security/pod-security-standards/)集中最嚴格的策略，
可以在[多種種模式下運行](/zh-cn/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces)，
根據最佳安全實踐，逐步地採用 `warn`、`audit` 或者 `enforce`
模式以應用最合適的[安全上下文（Security Context）](/zh-cn/docs/tasks/configure-pod-container/security-context/)。
儘管如此，對於特定的用例，應該單獨審查 Pod 的[安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/)，
以限制 Pod 在預定義的安全性標準之上可能具有的特權和訪問權限。

<!--
For a hands-on tutorial on [Pod Security](/docs/concepts/security/pod-security-admission/),
see the blog post
[Kubernetes 1.23: Pod Security Graduates to Beta](/blog/2021/12/09/pod-security-admission-beta/).

[Memory and CPU limits](/docs/concepts/configuration/manage-resources-containers/)
should be set in order to restrict the memory and CPU resources a pod can
consume on a node, and therefore prevent potential DoS attacks from malicious or
breached workloads. Such policy can be enforced by an admission controller.
Please note that CPU limits will throttle usage and thus can have unintended
effects on auto-scaling features or efficiency i.e. running the process in best
effort with the CPU resource available.
-->
有關 [Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission/)的實踐教程，
請參閱博文 [Kubernetes 1.23：Pod 安全性升級到 Beta](/blog/2021/12/09/pod-security-admission-beta/)。

爲了限制一個 Pod 可以使用的內存和 CPU 資源，
應該設置 Pod 在節點上可消費的[內存和 CPU 限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/),
從而防止來自惡意的或已被攻破的工作負載的潛在 DoS 攻擊。這種策略可以由准入控制器強制執行。
請注意，CPU 限制設置可能會影響 CPU 用量，從而可能會對自動擴縮功能或效率產生意外的影響，
換言之，系統會在可用的 CPU 資源下最大限度地運行進程。

{{< caution >}}
<!--
Memory limit superior to request can expose the whole node to OOM issues.
-->
內存限制高於請求的，可能會使整個節點面臨 OOM 問題。
{{< /caution >}}

<!--
### Enabling Seccomp

Seccomp stands for secure computing mode and has been a feature of the Linux kernel since version 2.6.12.
It can be used to sandbox the privileges of a process, restricting the calls it is able to make
from userspace into the kernel. Kubernetes lets you automatically apply seccomp profiles loaded onto
a node to your Pods and containers.

Seccomp can improve the security of your workloads by reducing the Linux kernel syscall attack
surface available inside containers. The seccomp filter mode leverages BPF to create an allow or
deny list of specific syscalls, named profiles.

Since Kubernetes 1.27, you can enable the use of `RuntimeDefault` as the default seccomp profile
for all workloads. A [security tutorial](/docs/tutorials/security/seccomp/) is available on this
topic. In addition, the
[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator)
is a project that facilitates the management and use of seccomp in clusters.
-->
### 啓用 Seccomp {#enabling-seccomp}

Seccomp 代表安全計算模式（Secure computing mode），這是一個自 Linux 內核版本 2.6.12 被加入的特性。
它可以將進程的特權沙箱化，來限制從使用者空間發起的對內核的調用。
Kubernetes 允許你將加載到節點上的 Seccomp 設定檔案自動應用於你的 Pod 和容器。

Seccomp 通過減少容器內對 Linux 內核的系統調用（System Call）以縮小攻擊面，從而提高工作負載的安全性。
Seccomp 過濾器模式藉助 BPF 創建具體系統調用的允許清單或拒絕清單，名爲設定檔案（Profile）。

從 Kubernetes 1.27 開始，你可以將 `RuntimeDefault` 設置爲工作負載的預設 Seccomp 設定。
你可以閱讀相應的[安全教程](/zh-cn/docs/tutorials/security/seccomp/)。
此外，[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator)
是一個方便在叢集中管理和使用 Seccomp 的項目。

{{< note >}}
<!--
Seccomp is only available on Linux nodes.
-->
Seccomp 僅適用於 Linux 節點。
{{< /note >}}

<!--
### Enabling AppArmor or SELinux
-->
### 啓用 AppArmor 或 SELinux {#enabling-appArmor-or-SELinux}

#### AppArmor

<!--
[AppArmor](/docs/tutorials/security/apparmor/) is a Linux kernel security module that can
provide an easy way to implement Mandatory Access Control (MAC) and better
auditing through system logs. A default AppArmor profile is enforced on nodes that support it, or a custom profile can be configured.
Like seccomp, AppArmor is also configured
through profiles, where each profile is either running in enforcing mode, which
blocks access to disallowed resources or complain mode, which only reports
violations. AppArmor profiles are enforced on a per-container basis, with an
annotation, allowing for processes to gain just the right privileges.
-->
[AppArmor](/zh-cn/docs/tutorials/security/apparmor/) 是一個 Linux 內核安全模塊，
可以提供一種簡單的方法來實現強制訪問控制（Mandatory Access Control, MAC）並通過系統日誌進行更好地審計。
預設 AppArmor 設定檔案在支持它的節點上強制執行，或者可以設定自定義設定檔案。
與 Seccomp 一樣，AppArmor 也通過設定檔案進行設定，
其中每個設定檔案要麼在強制（Enforcing）模式下運行，即阻止訪問不允許的資源，要麼在投訴（Complaining）模式下運行，只報告違規行爲。
AppArmor 設定檔案是通過註解的方式，以容器爲粒度強制執行的，允許進程獲得剛好合適的權限。

{{< note >}}
<!--
AppArmor is only available on Linux nodes, and enabled in
[some Linux distributions](https://gitlab.com/apparmor/apparmor/-/wikis/home#distributions-and-ports).
-->
AppArmor 僅在 Linux 節點上可用，
在[一些 Linux 發行版](https://gitlab.com/apparmor/apparmor/-/wikis/home#distributions-and-ports)中已啓用。
{{< /note >}}

#### SELinux

<!--
[SELinux](https://github.com/SELinuxProject/selinux-notebook/blob/main/src/selinux_overview.md) is also a
Linux kernel security module that can provide a mechanism for supporting access
control security policies, including Mandatory Access Controls (MAC). SELinux
labels can be assigned to containers or pods
[via their `securityContext` section](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container).
-->
[SELinux](https://github.com/SELinuxProject/selinux-notebook/blob/main/src/selinux_overview.md)
也是一個 Linux 內核安全模塊，可以提供支持訪問控制安全策略的機制，包括強制訪問控制（MAC）。
SELinux 標籤可以[通過 `securityContext` 節](/zh-cn/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container)指配給容器或 Pod。

{{< note >}}
<!--
SELinux is only available on Linux nodes, and enabled in
[some Linux distributions](https://en.wikipedia.org/wiki/Security-Enhanced_Linux#Implementations).
-->
SELinux 僅在 Linux 節點上可用，
在[一些 Linux 發行版](https://en.wikipedia.org/wiki/Security-Enhanced_Linux#Implementations)中已啓用。
{{< /note >}}

<!--
## Pod placement

- [ ] Pod placement is done in accordance with the tiers of sensitivity of the
  application.
- [ ] Sensitive applications are running isolated on nodes or with specific
  sandboxed runtimes.
-->
## Pod 佈局 {#pod-placement}

- [ ] Pod 佈局是根據應用的敏感級別來完成的。
- [ ] 敏感應用在節點上隔離運行或使用特定的沙箱運行時運行。

<!--
Pods that are on different tiers of sensitivity, for example, an application pod
and the Kubernetes API server, should be deployed onto separate nodes. The
purpose of node isolation is to prevent an application container breakout to
directly providing access to applications with higher level of sensitivity to easily
pivot within the cluster. This separation should be enforced to prevent pods
accidentally being deployed onto the same node. This could be enforced with the
following features:
-->
處於不同敏感級別的 Pod，例如，應用程式 Pod 和 Kubernetes API 伺服器應該被部署到不同的節點上。
節點隔離的目的是防止應用容器的逃逸，進而直接訪問敏感度更高的應用，
甚至輕鬆地改變叢集工作機制。
這種隔離應該被強制執行，以防止 Pod 集合被意外部署到同一節點上。
可以通過以下功能實現：

<!--
[Node Selectors](/docs/concepts/scheduling-eviction/assign-pod-node/)
: Key-value pairs, as part of the pod specification, that specify which nodes to
deploy onto. These can be enforced at the namespace and cluster level with the
[PodNodeSelector](/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)
admission controller.
-->
[節點選擇器（Node Selector）](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)
: 作爲 Pod 規約的一部分來設置的鍵值對，指定 Pod 可部署到哪些節點。
  通過 [PodNodeSelector](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)
  准入控制器可以在名字空間和叢集級別強制實施節點選擇。

<!--
[PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
: An admission controller that allows administrators to restrict permitted
[tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) within a
namespace. Pods within a namespace may only utilize the tolerations specified on
the namespace object annotation keys that provide a set of default and allowed
tolerations.
-->
[PodTolerationRestriction](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
: [容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)准入控制器，
  允許管理員設置在名字空間內允許使用的容忍度。
  名字空間中的 Pod 只能使用名字空間對象的註解鍵上所指定的容忍度，這些鍵提供預設和允許的容忍度集合。

<!--
[RuntimeClass](/docs/concepts/containers/runtime-class/)
: RuntimeClass is a feature for selecting the container runtime configuration.
The container runtime configuration is used to run a Pod's containers and can
provide more or less isolation from the host at the cost of performance
overhead.
-->
[RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/)
: RuntimeClass 是一個用於選擇容器運行時設定的特性，容器運行時設定用於運行 Pod 中的容器，
  並以性能開銷爲代價提供或多或少的主機隔離能力。

## Secret {#secrets}

<!--
- [ ] ConfigMaps are not used to hold confidential data.
- [ ] Encryption at rest is configured for the Secret API.
- [ ] If appropriate, a mechanism to inject secrets stored in third-party storage
  is deployed and available.
- [ ] Service account tokens are not mounted in pods that don't require them.
- [ ] [Bound service account token volume](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)
  is in-use instead of non-expiring tokens.
-->
- [ ] 不用 ConfigMap 保存機密資料。
- [ ] 爲 Secret API 設定靜態加密。
- [ ] 如果合適，可以部署和使用一種機制，負責注入保存在第三方儲存中的 Secret。
- [ ] 不應該將服務賬號令牌掛載到不需要它們的 Pod 中。
- [ ] 使用[綁定的服務賬號令牌卷](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)，
  而不要使用不會過期的令牌。

<!--
Secrets required for pods should be stored within Kubernetes Secrets as opposed
to alternatives such as ConfigMap. Secret resources stored within etcd should
be [encrypted at rest](/docs/tasks/administer-cluster/encrypt-data/).
-->
Pod 所需的祕密資訊應該儲存在 Kubernetes Secret 中，而不是像 ConfigMap 這樣的替代品中。
儲存在 etcd 中的 Secret 資源應該被靜態加密。

<!--
Pods needing secrets should have these automatically mounted through volumes,
preferably stored in memory like with the [`emptyDir.medium` option](/docs/concepts/storage/volumes/#emptydir).
Mechanism can be used to also inject secrets from third-party storages as
volume, like the [Secrets Store CSI Driver](https://secrets-store-csi-driver.sigs.k8s.io/).
This should be done preferentially as compared to providing the pods service
account RBAC access to secrets. This would allow adding secrets into the pod as
environment variables or files. Please note that the environment variable method
might be more prone to leakage due to crash dumps in logs and the
non-confidential nature of environment variable in Linux, as opposed to the
permission mechanism on files.
-->
需要 Secret 的 Pod 應該通過卷自動掛載這些資訊，
最好使用 [`emptyDir.medium` 選項](/zh-cn/docs/concepts/storage/volumes/#emptydir)儲存在內存中。
該機制還可以用於從第三方儲存中注入 Secret 作爲卷，如 [Secret Store CSI 驅動](https://secrets-store-csi-driver.sigs.k8s.io/)。
與通過 RBAC 來允許 Pod 服務賬號訪問 Secret 相比，應該優先使用上述機制。這種機制允許將 Secret 作爲環境變量或檔案添加到 Pod 中。
請注意，與帶訪問權限控制的檔案相比，由於日誌的崩潰轉儲，以及 Linux 的環境變量的非機密性，環境變量方法可能更容易發生泄漏。

<!--
Service account tokens should not be mounted into pods that do not require them. This can be configured by setting
[`automountServiceAccountToken`](/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server)
to `false` either within the service account to apply throughout the namespace
or specifically for a pod. For Kubernetes v1.22 and above, use
[Bound Service Accounts](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)
for time-bound service account credentials.
-->
不應該將服務賬號令牌掛載到不需要它們的 Pod 中。這可以通過在服務賬號內將
[`automountServiceAccountToken`](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server)
設置爲 `false` 來完成整個名字空間範圍的設定，或者也可以單獨在 Pod 層面定製。
對於 Kubernetes v1.22 及更高版本，
請使用[綁定服務賬號](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)作爲有時間限制的服務賬號憑證。

<!--
## Images

- [ ] Minimize unnecessary content in container images.
- [ ] Container images are configured to be run as unprivileged user.
- [ ] References to container images are made by sha256 digests (rather than
tags) or the provenance of the image is validated by verifying the image's
digital signature at deploy time [via admission control](/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures-with-admission-controller).
- [ ] Container images are regularly scanned during creation and in deployment, and
  known vulnerable software is patched.
-->
## 映像檔 {#images}

- [ ] 儘量減少容器映像檔中不必要的內容。
- [ ] 容器映像檔設定爲以非特權使用者身份運行。
- [ ] 對容器映像檔的引用是通過 Sha256 摘要實現的，而不是標籤（tags），
  或者[通過准入控制器](/zh-cn/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures-with-admission-controller)在部署時驗證映像檔的數字簽名來驗證映像檔的來源。
- [ ] 在創建和部署過程中定期掃描容器映像檔，並對已知的漏洞軟體進行修補。

<!--
Container image should contain the bare minimum to run the program they
package. Preferably, only the program and its dependencies, building the image
from the minimal possible base. In particular, image used in production should not
contain shells or debugging utilities, as an
[ephemeral debug container](/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container)
can be used for troubleshooting.
-->
容器映像檔應該包含運行其所打包的程式所需要的最少內容。
最好，只使用程式及其依賴項，基於最小的基礎映像檔來構建映像檔。
尤其是，在生產中使用的映像檔不應包含 Shell 或調試工具，
因爲可以使用[臨時調試容器](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container)進行故障排除。

<!--
Build images to directly start with an unprivileged user by using the
[`USER` instruction in Dockerfile](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user).
The [Security Context](/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod)
allows a container image to be started with a specific user and group with
`runAsUser` and `runAsGroup`, even if not specified in the image manifest.
However, the file permissions in the image layers might make it impossible to just
start the process with a new unprivileged user without image modification.
-->
構建映像檔時使用 [Dockerfile 中的 `USER`](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user)
指令直接開始使用非特權使用者。
[安全上下文（Security Context）](/zh-cn/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod)
允許使用 `runAsUser` 和 `runAsGroup` 來指定使用特定的使用者和組來啓動容器映像檔，
即使沒有在映像檔清單檔案（Manifest）中指定這些設定資訊。
不過，映像檔層中的檔案權限設置可能無法做到在不修改映像檔的情況下，使用新的非特權使用者來啓動進程。

<!--
Avoid using image tags to reference an image, especially the `latest` tag, the
image behind a tag can be easily modified in a registry. Prefer using the
complete `sha256` digest which is unique to the image manifest. This policy can be
enforced via an [ImagePolicyWebhook](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook).
Image signatures can also be automatically [verified with an admission controller](/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures-with-admission-controller)
at deploy time to validate their authenticity and integrity.
-->
避免使用映像檔標籤來引用映像檔，尤其是 `latest` 標籤，因爲標籤對應的映像檔可以在倉庫中被輕鬆地修改。
首選使用完整的 `Sha256` 摘要，該摘要對特定映像檔清單檔案而言是唯一的。
可以通過 [ImagePolicyWebhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
強制執行此策略。
映像檔簽名還可以在部署時由[准入控制器自動驗證](/zh-cn/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures-with-admission-controller)，
以驗證其真實性和完整性。

<!--
Scanning a container image can prevent critical vulnerabilities from being
deployed to the cluster alongside the container image. Image scanning should be
completed before deploying a container image to a cluster and is usually done
as part of the deployment process in a CI/CD pipeline. The purpose of an image
scan is to obtain information about possible vulnerabilities and their
prevention in the container image, such as a
[Common Vulnerability Scoring System (CVSS)](https://www.first.org/cvss/)
score. If the result of the image scans is combined with the pipeline
compliance rules, only properly patched container images will end up in
Production.
-->
掃描容器映像檔可以防止關鍵性的漏洞隨着容器映像檔一起被部署到叢集中。
映像檔掃描應在將容器映像檔部署到叢集之前完成，通常作爲 CI/CD 流水線中的部署過程的一部分來完成。
映像檔掃描的目的是獲取有關容器映像檔中可能存在的漏洞及其預防措施的資訊，
例如使用[公共漏洞評分系統 （Common Vulnerability Scoring System，CVSS）](https://www.first.org/cvss/)評分。
如果映像檔掃描的結果與管道合性規則匹配，則只有經過正確修補的容器映像檔纔會最終進入生產環境。

<!--
## Admission controllers

- [ ] An appropriate selection of admission controllers is enabled.
- [ ] A pod security policy is enforced by the Pod Security Admission or/and a
  webhook admission controller.
- [ ] The admission chain plugins and webhooks are securely configured.
-->
## 准入控制器 {#admission-controllers}

- [ ] 選擇啓用適當的准入控制器。
- [ ] Pod 安全策略由 Pod 安全准入強制執行，或者和 Webhook 准入控制器一起強制執行。
- [ ] 保證准入鏈插件和 Webhook 的設定都是安全的。

<!--
Admission controllers can help improve the security of the cluster. However,
they can present risks themselves as they extend the API server and
[should be properly secured](/blog/2022/01/19/secure-your-admission-controllers-and-webhooks/).
-->
准入控制器可以幫助提高叢集的安全性。
然而，由於它們是對 API 伺服器的擴展，其自身可能會帶來風險，
所以它們[應該得到適當的保護](/zh-cn/blog/2022/01/19/secure-your-admission-controllers-and-webhooks/)。

<!--
The following lists present a number of admission controllers that could be
considered to enhance the security posture of your cluster and application. It
includes controllers that may be referenced in other parts of this document.
-->
下面列出了一些准入控制器，可以考慮用這些控制器來增強叢集和應用的安全狀況。
列表中包括了可能在本文檔其他部分曾提及的控制器。

<!--
This first group of admission controllers includes plugins
[enabled by default](/docs/reference/access-authn-authz/admission-controllers/#which-plugins-are-enabled-by-default),
consider to leave them enabled unless you know what you are doing:
-->
第一組准入控制器包括[預設啓用的插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#which-plugins-are-enabled-by-default)，
除非你知道自己在做什麼，否則請考慮保持它們處於被啓用的狀態：

<!--
[`CertificateApproval`](/docs/reference/access-authn-authz/admission-controllers/#certificateapproval)
: Performs additional authorization checks to ensure the approving user has
permission to approve certificate request.
-->
[`CertificateApproval`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#certificateapproval)
: 執行額外的授權檢查，以確保審批使用者具有審批證書請求的權限。

<!--
[`CertificateSigning`](/docs/reference/access-authn-authz/admission-controllers/#certificatesigning)
: Performs additional authorization checks to ensure the signing user has
permission to sign certificate requests.
-->
[`CertificateSigning`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#certificatesigning)
: 執行其他授權檢查，以確保簽名使用者具有簽名證書請求的權限。

<!--
[`CertificateSubjectRestriction`](/docs/reference/access-authn-authz/admission-controllers/#certificatesubjectrestriction)
: Rejects any certificate request that specifies a 'group' (or 'organization
attribute') of `system:masters`.
-->
[`CertificateSubjectRestriction`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#certificatesubjectrestriction)
: 拒絕將 `group`（或 `organization attribute`）設置爲 `system:masters` 的所有證書請求。

<!--
[`LimitRanger`](/docs/reference/access-authn-authz/admission-controllers/#limitranger)
: Enforces the LimitRange API constraints.
-->
[`LimitRanger`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#limitranger)
: 強制執行 LimitRange API 約束。

<!--
[`MutatingAdmissionWebhook`](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
: Allows the use of custom controllers through webhooks, these controllers may
mutate requests that they review.
-->
[`MutatingAdmissionWebhook`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
: 允許通過 Webhook 使用自定義控制器，這些控制器可能會變更它們所審查的請求。

<!--
[`PodSecurity`](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
: Replacement for Pod Security Policy, restricts security contexts of deployed
Pods.
-->
[`PodSecurity`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
: Pod Security Policy 的替代品，用於約束所部署 Pod 的安全上下文。

<!--
[`ResourceQuota`](/docs/reference/access-authn-authz/admission-controllers/#resourcequota)
: Enforces resource quotas to prevent over-usage of resources.
-->
[`ResourceQuota`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#resourcequota)
: 強制執行資源配額，以防止資源被過度使用。

<!--
[`ValidatingAdmissionWebhook`](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
: Allows the use of custom controllers through webhooks, these controllers do
not mutate requests that it reviews.
-->
[`ValidatingAdmissionWebhook`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
: 允許通過 Webhook 使用自定義控制器，這些控制器不變更它所審查的請求。

<!--
The second group includes plugins that are not enabled by default but are in general
availability state and are recommended to improve your security posture:
-->
第二組包括預設情況下沒有啓用、但處於正式發佈狀態的插件，建議啓用這些插件以改善你的安全狀況：

<!--
[`DenyServiceExternalIPs`](/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)
: Rejects all net-new usage of the `Service.spec.externalIPs` field. This is a mitigation for
[CVE-2020-8554: Man in the middle using LoadBalancer or ExternalIPs](https://github.com/kubernetes/kubernetes/issues/97076).
-->
[`DenyServiceExternalIPs`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)
: 拒絕使用 `Service.spec.externalIPs` 字段，已有的 Service 不受影響，新增或者變更時不允許使用。
  這是 [CVE-2020-8554：中間人使用 LoadBalancer 或 ExternalIP](https://github.com/kubernetes/kubernetes/issues/97076)
  的緩解措施。

<!--
[`NodeRestriction`](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
: Restricts kubelet's permissions to only modify the pods API resources they own
or the node API resource that represent themselves. It also prevents kubelet
from using the `node-restriction.kubernetes.io/` annotation, which can be used
by an attacker with access to the kubelet's credentials to influence pod
placement to the controlled node.
-->
[`NodeRestriction`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
: 將 kubelet 的權限限制爲只能修改其擁有的 Pod API 資源或代表其自身的節點 API 資源。
  此插件還可以防止 kubelet 使用 `node-restriction.kubernetes.io/` 註解，
  攻擊者可以使用該註解來訪問 kubelet 的憑證，從而影響所控制的節點上的 Pod 佈局。

<!--
The third group includes plugins that are not enabled by default but could be
considered for certain use cases:
-->
第三組包括預設情況下未啓用，但可以考慮在某些場景下啓用的插件：

<!--
[`AlwaysPullImages`](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
: Enforces the usage of the latest version of a tagged image and ensures that the deployer
has permissions to use the image.
-->
[`AlwaysPullImages`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
: 強制使用最新版本標記的映像檔，並確保部署者有權使用該映像檔。

<!--
[`ImagePolicyWebhook`](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
: Allows enforcing additional controls for images through webhooks.
-->
[`ImagePolicyWebhook`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
: 允許通過 Webhook 對映像檔強制執行額外的控制。

<!--
## What's next

- [Privilege escalation via Pod creation](/docs/reference/access-authn-authz/authorization/#privilege-escalation-via-pod-creation)
  warns you about a specific access control risk; check how you're managing that
  threat.
  - If you use Kubernetes RBAC, read
    [RBAC Good Practices](/docs/concepts/security/rbac-good-practices/) for
    further information on authorization.
- [Securing a Cluster](/docs/tasks/administer-cluster/securing-a-cluster/) for
  information on protecting a cluster from accidental or malicious access.
- [Cluster Multi-tenancy guide](/docs/concepts/security/multi-tenancy/) for
  configuration options recommendations and best practices on multi-tenancy.
- [Blog post "A Closer Look at NSA/CISA Kubernetes Hardening Guidance"](/blog/2021/10/05/nsa-cisa-kubernetes-hardening-guidance/#building-secure-container-images)
  for complementary resource on hardening Kubernetes clusters.
-->
## 接下來  {#what-is-next}

- [通過 Pod 創建進行權限升級](/zh-cn/docs/reference/access-authn-authz/authorization/#privilege-escalation-via-pod-creation)會警告你特定的訪問控制風險；
  請檢查你如何管理該風險。
  - 如果你使用 Kubernetes RBAC，請閱讀
    [RBAC 良好實踐](/zh-cn/docs/concepts/security/rbac-good-practices/)獲取有關鑑權的更多資訊。
- [保護叢集](/zh-cn/docs/tasks/administer-cluster/securing-a-cluster/)提供如何保護叢集免受意外或惡意訪問的資訊。
- [叢集多租戶指南](/zh-cn/docs/concepts/security/multi-tenancy/)提供有關多租戶的設定選項建議和最佳實踐。
- [博文“深入瞭解 NSA/CISA Kubernetes 強化指南”](/blog/2021/10/05/nsa-cisa-kubernetes-hardening-guidance/#building-secure-container-images)爲強化
  Kubernetes 叢集提供補充資源。
