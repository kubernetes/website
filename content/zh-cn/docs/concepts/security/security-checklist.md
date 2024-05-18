---
title: 安全检查清单
description: >
  确保 Kubernetes 集群安全的基线检查清单。
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
本清单旨在提供一个基本的指导列表，其中包含链接，指向各个主题的更为全面的文档。
此清单不求详尽无遗，是预计会不断演化的。

关于如何阅读和使用本文档：

- 主题的顺序并不代表优先级的顺序。
- 在每章节的列表下面的段落中，都详细列举了一些检查清项目。

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
单靠检查清单是**不够的**，无法获得良好的安全态势。
实现良好的安全态势需要持续的关注和改进，实现安全上有备无患的目标道路漫长，清单可作为征程上的第一步。
对于你的特定安全需求，此清单中的某些建议可能过于严格或过于宽松。
由于 Kubernetes 的安全性并不是“一刀切”的，因此针对每一类检查清单项目都应该做价值评估。
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
## 认证和鉴权 {#authentication-authorization}

- [ ] 在启动后 `system:masters` 组不用于用户或组件的身份验证。
- [ ] kube-controller-manager 运行时要启用 `--use-service-account-credentials` 参数。
- [ ] 根证书要受到保护（或离线 CA，或一个具有有效访问控制的托管型在线 CA）。
- [ ] 中级证书和叶子证书的有效期不要超过未来 3 年。
- [ ] 存在定期访问审查的流程，审查间隔不要超过 24 个月。
- [ ] 遵循[基于角色的访问控制良好实践](/zh-cn/docs/concepts/security/rbac-good-practices/)，
  以获得与身份验证和授权相关的指导。

<!--
After bootstrapping, neither users nor components should authenticate to the
Kubernetes API as `system:masters`. Similarly, running all of
kube-controller-manager as `system:masters` should be avoided. In fact,
`system:masters` should only be used as a break-glass mechanism, as opposed to
an admin user.
-->
在启动后，用户和组件都不应以 `system:masters` 身份向 Kubernetes API 进行身份验证。
同样，应避免将任何 kube-controller-manager 以 `system:masters` 运行。
事实上，`system:masters` 应该只用作一个例外机制，而不是管理员用户。

<!--
## Network security

- [ ] CNI plugins in-use supports network policies.
- [ ] Ingress and egress network policies are applied to all workloads in the
  cluster.
- [ ] Default network policies within each namespace, selecting all pods, denying
  everything, are in place.
- [ ] If appropriate, a service mesh is used to encrypt all communications inside of the cluster.
- [ ] The Kubernetes API, kubelet API and etcd are not exposed publicly on Internet.
- [ ] Access from the workloads to the cloud metadata API is filtered.
- [ ] Use of LoadBalancer and ExternalIPs is restricted.
-->
## 网络安全 {#network-security}

- [ ] 使用的 CNI 插件可支持网络策略。
- [ ] 对集群中的所有工作负载应用入站和出站的网络策略。
- [ ] 落实每个名字空间内的默认网络策略，覆盖所有 Pod，拒绝一切访问。
- [ ] 如果合适，使用服务网格来加密集群内的所有通信。
- [ ] 不在互联网上公开 Kubernetes API、kubelet API 和 etcd。
- [ ] 过滤工作负载对云元数据 API 的访问。
- [ ] 限制使用 LoadBalancer 和 ExternalIP。

<!--
A number of [Container Network Interface (CNI) plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
plugins provide the functionality to
restrict network resources that pods may communicate with. This is most commonly done
through [Network Policies](/docs/concepts/services-networking/network-policies/)
which provide a namespaced resource to define rules. Default network policies
blocking everything egress and ingress, in each namespace, selecting all the
pods, can be useful to adopt an allow list approach, ensuring that no workloads
is missed.
-->
许多[容器网络接口（Container Network Interface，CNI）插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)提供了限制
Pod 可能与之通信的网络资源的功能。
这种限制通常通过[网络策略](/zh-cn/docs/concepts/services-networking/network-policies/)来完成，
网络策略提供了一种名字空间作用域的资源来定义规则。
在每个名字空间中，默认的网络策略会阻塞所有的出入站流量，并选择所有 Pod，
采用允许列表的方法很有用，可以确保不遗漏任何工作负载。

<!--
Not all CNI plugins provide encryption in transit. If the chosen plugin lacks this
feature, an alternative solution could be to use a service mesh to provide that
functionality.

The etcd datastore of the control plane should have controls to limit access and
not be publicly exposed on the Internet. Furthermore, mutual TLS (mTLS) should
be used to communicate securely with it. The certificate authority for this
should be unique to etcd.
-->
并非所有 CNI 插件都在传输过程中提供加密。
如果所选的插件缺少此功能，一种替代方案是可以使用服务网格来提供该功能。

控制平面的 etcd 数据存储应该实施访问限制控制，并且不要在互联网上公开。
此外，应使用双向 TLS（mTLS）与其进行安全通信。
用在这里的证书机构应该仅用于 etcd。

<!--
External Internet access to the Kubernetes API server should be restricted to
not expose the API publicly. Be careful as many managed Kubernetes distribution
are publicly exposing the API server by default. You can then use a bastion host
to access the server.

The [kubelet](/docs/reference/command-line-tools-reference/kubelet/) API access
should be restricted and not publicly exposed, the defaults authentication and
authorization settings, when no configuration file specified with the `--config`
flag, are overly permissive.
-->
应该限制外部互联网对 Kubernetes API 服务器未公开的 API 的访问。
请小心，因为许多托管的 Kubernetes 发行版在默认情况下公开了 API 服务器。
当然，你可以使用堡垒机访问服务器。

对 [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) API 的访问应该受到限制，
并且不公开，当没有使用 `--config` 参数来设置配置文件时，默认的身份验证和鉴权设置是过于宽松的。

<!--
If a cloud provider is used for hosting Kubernetes, the access from pods to the cloud
metadata API `169.254.169.254` should also be restricted or blocked if not needed
because it may leak information.

For restricted LoadBalancer and ExternalIPs use, see
[CVE-2020-8554: Man in the middle using LoadBalancer or ExternalIPs](https://github.com/kubernetes/kubernetes/issues/97076)
and the [DenyServiceExternalIPs admission controller](/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)
for further information.
-->
如果使用云服务供应商托管的 Kubernetes，在没有明确需要的情况下，
也应该限制或阻止从 Pod 对云元数据 API `169.254.169.254` 的访问，因为这可能泄露信息。

关于限制使用 LoadBalancer 和 ExternalIP 请参阅
[CVE-2020-8554：中间人使用 LoadBalancer 或 ExternalIP](https://github.com/kubernetes/kubernetes/issues/97076)
和
[DenyServiceExternalIPs 准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)获取更多信息。

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

- [ ] 仅在必要时才授予 `create`、`update`、`patch`、`delete` 工作负载的 RBAC 权限。
- [ ] 对所有名字空间实施适当的 Pod 安全标准策略，并强制执行。
- [ ] 为工作负载设置内存限制值，并确保限制值等于或者不高于请求值。
- [ ] 对敏感工作负载可以设置 CPU 限制。
- [ ] 对于支持 Seccomp 的节点，可以为程序启用合适的系统调用配置文件。
- [ ] 对于支持 AppArmor 或 SELinux 的系统，可以为程序启用合适的配置文件。

<!--
RBAC authorization is crucial but
[cannot be granular enough to have authorization on the Pods' resources](/docs/concepts/security/rbac-good-practices/#workload-creation)
(or on any resource that manages Pods). The only granularity is the API verbs
on the resource itself, for example, `create` on Pods. Without
additional admission, the authorization to create these resources allows direct
unrestricted access to the schedulable nodes of a cluster.
-->
RBAC 的授权是至关重要的，
但[不能在足够细的粒度上对 Pod 的资源进行授权](/zh-cn/docs/concepts/security/rbac-good-practices/#workload-creation)，
也不足以对管理 Pod 的任何资源进行授权。
唯一的粒度是资源本身上的 API 动作，例如，对 Pod 的 `create`。
在未指定额外许可的情况下，创建这些资源的权限允许直接不受限制地访问集群的可调度节点。

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
[Pod 安全性标准](/zh-cn/docs/concepts/security/pod-security-standards/)定义了三种不同的策略：
特权策略（Privileged）、基线策略（Baseline）和限制策略（Restricted），它们限制了 `PodSpec` 中关于安全的字段的设置。
这些标准可以通过默认启用的新的
[Pod 安全性准入](/zh-cn/docs/concepts/security/pod-security-admission/)或第三方准入 Webhook 在名字空间级别强制执行。
请注意，与它所取代的、已被移除的 PodSecurityPolicy 准入机制相反，
[Pod 安全性准入](/zh-cn/docs/concepts/security/pod-security-admission/)可以轻松地与准入 Webhook 和外部服务相结合使用。

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
`restricted` Pod 安全准入策略是 [Pod 安全性标准](/zh-cn/docs/concepts/security/pod-security-standards/)集中最严格的策略，
可以在[多种种模式下运行](/zh-cn/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces)，
根据最佳安全实践，逐步地采用 `warn`、`audit` 或者 `enforce`
模式以应用最合适的[安全上下文（Security Context）](/zh-cn/docs/tasks/configure-pod-container/security-context/)。
尽管如此，对于特定的用例，应该单独审查 Pod 的[安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/)，
以限制 Pod 在预定义的安全性标准之上可能具有的特权和访问权限。

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
有关 [Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission/)的实践教程，
请参阅博文 [Kubernetes 1.23：Pod 安全性升级到 Beta](/blog/2021/12/09/pod-security-admission-beta/)。

为了限制一个 Pod 可以使用的内存和 CPU 资源，
应该设置 Pod 在节点上可消费的[内存和 CPU 限制](/zh-cn/docs/concepts/configuration/manage-resources-containers/),
从而防止来自恶意的或已被攻破的工作负载的潜在 DoS 攻击。这种策略可以由准入控制器强制执行。
请注意，CPU 限制设置可能会影响 CPU 用量，从而可能会对自动扩缩功能或效率产生意外的影响，
换言之，系统会在可用的 CPU 资源下最大限度地运行进程。

{{< caution >}}
<!--
Memory limit superior to request can expose the whole node to OOM issues.
-->
内存限制高于请求的，可能会使整个节点面临 OOM 问题。
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
### 启用 Seccomp {#enabling-seccomp}

Seccomp 代表安全计算模式（Secure computing mode），这是一个自 Linux 内核版本 2.6.12 被加入的特性。
它可以将进程的特权沙箱化，来限制从用户空间发起的对内核的调用。
Kubernetes 允许你将加载到节点上的 Seccomp 配置文件自动应用于你的 Pod 和容器。

Seccomp 通过减少容器内对 Linux 内核的系统调用（System Call）以缩小攻击面，从而提高工作负载的安全性。
Seccomp 过滤器模式借助 BPF 创建具体系统调用的允许清单或拒绝清单，名为配置文件（Profile）。

从 Kubernetes 1.27 开始，你可以将 `RuntimeDefault` 设置为工作负载的默认 Seccomp 配置。
你可以阅读相应的[安全教程](/zh-cn/docs/tutorials/security/seccomp/)。
此外，[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator)
是一个方便在集群中管理和使用 Seccomp 的项目。

{{< note >}}
<!--
Seccomp is only available on Linux nodes.
-->
Seccomp 仅适用于 Linux 节点。
{{< /note >}}

<!--
### Enabling AppArmor or SELinux
-->
### 启用 AppArmor 或 SELinux {#enabling-appArmor-or-SELinux}

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
[AppArmor](/zh-cn/docs/tutorials/security/apparmor/) 是一个 Linux 内核安全模块，
可以提供一种简单的方法来实现强制访问控制（Mandatory Access Control, MAC）并通过系统日志进行更好地审计。
默认 AppArmor 配置文件在支持它的节点上强制执行，或者可以配置自定义配置文件。
与 Seccomp 一样，AppArmor 也通过配置文件进行配置，
其中每个配置文件要么在强制（Enforcing）模式下运行，即阻止访问不允许的资源，要么在投诉（Complaining）模式下运行，只报告违规行为。
AppArmor 配置文件是通过注解的方式，以容器为粒度强制执行的，允许进程获得刚好合适的权限。

{{< note >}}
<!--
AppArmor is only available on Linux nodes, and enabled in
[some Linux distributions](https://gitlab.com/apparmor/apparmor/-/wikis/home#distributions-and-ports).
-->
AppArmor 仅在 Linux 节点上可用，
在[一些 Linux 发行版](https://gitlab.com/apparmor/apparmor/-/wikis/home#distributions-and-ports)中已启用。
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
也是一个 Linux 内核安全模块，可以提供支持访问控制安全策略的机制，包括强制访问控制（MAC）。
SELinux 标签可以[通过 `securityContext` 节](/zh-cn/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container)指配给容器或 Pod。

{{< note >}}
<!--
SELinux is only available on Linux nodes, and enabled in
[some Linux distributions](https://en.wikipedia.org/wiki/Security-Enhanced_Linux#Implementations).
-->
SELinux 仅在 Linux 节点上可用，
在[一些 Linux 发行版](https://en.wikipedia.org/wiki/Security-Enhanced_Linux#Implementations)中已启用。
{{< /note >}}

<!--
## Pod placement

- [ ] Pod placement is done in accordance with the tiers of sensitivity of the
  application.
- [ ] Sensitive applications are running isolated on nodes or with specific
  sandboxed runtimes.
-->
## Pod 布局 {#pod-placement}

- [ ] Pod 布局是根据应用程序的敏感级别来完成的。
- [ ] 敏感应用程序在节点上隔离运行或使用特定的沙箱运行时运行。

<!--
Pods that are on different tiers of sensitivity, for example, an application pod
and the Kubernetes API server, should be deployed onto separate nodes. The
purpose of node isolation is to prevent an application container breakout to
directly providing access to applications with higher level of sensitivity to easily
pivot within the cluster. This separation should be enforced to prevent pods
accidentally being deployed onto the same node. This could be enforced with the
following features:
-->
处于不同敏感级别的 Pod，例如，应用程序 Pod 和 Kubernetes API 服务器，应该部署到不同的节点上。
节点隔离的目的是防止应用程序容器的逃逸，进而直接访问敏感度更高的应用，
甚至轻松地改变集群工作机制。
这种隔离应该被强制执行，以防止 Pod 集合被意外部署到同一节点上。
可以通过以下功能实现：

<!--
[Node Selectors](/docs/concepts/scheduling-eviction/assign-pod-node/)
: Key-value pairs, as part of the pod specification, that specify which nodes to
deploy onto. These can be enforced at the namespace and cluster level with the
[PodNodeSelector](/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)
admission controller.
-->
[节点选择器（Node Selector）](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)
: 作为 Pod 规约的一部分来设置的键值对，指定 Pod 可部署到哪些节点。
  通过 [PodNodeSelector](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)
  准入控制器可以在名字空间和集群级别强制实施节点选择。

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
  允许管理员设置在名字空间内允许使用的容忍度。
  名字空间中的 Pod 只能使用名字空间对象的注解键上所指定的容忍度，这些键提供默认和允许的容忍度集合。

<!--
[RuntimeClass](/docs/concepts/containers/runtime-class/)
: RuntimeClass is a feature for selecting the container runtime configuration.
The container runtime configuration is used to run a Pod's containers and can
provide more or less isolation from the host at the cost of performance
overhead.
-->
[RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/)
: RuntimeClass 是一个用于选择容器运行时配置的特性，容器运行时配置用于运行 Pod 中的容器，
  并以性能开销为代价提供或多或少的主机隔离能力。

## Secrets {#secrets}

<!--
- [ ] ConfigMaps are not used to hold confidential data.
- [ ] Encryption at rest is configured for the Secret API.
- [ ] If appropriate, a mechanism to inject secrets stored in third-party storage
  is deployed and available.
- [ ] Service account tokens are not mounted in pods that don't require them.
- [ ] [Bound service account token volume](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)
  is in-use instead of non-expiring tokens.
-->
- [ ] 不用 ConfigMap 保存机密数据。
- [ ] 为 Secret API 配置静态加密。
- [ ] 如果合适，可以部署和使用一种机制，负责注入保存在第三方存储中的 Secret。
- [ ] 不应该将服务账号令牌挂载到不需要它们的 Pod 中。
- [ ] 使用[绑定的服务账号令牌卷](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)，
  而不要使用不会过期的令牌。

<!--
Secrets required for pods should be stored within Kubernetes Secrets as opposed
to alternatives such as ConfigMap. Secret resources stored within etcd should
be [encrypted at rest](/docs/tasks/administer-cluster/encrypt-data/).
-->
Pod 所需的秘密信息应该存储在 Kubernetes Secret 中，而不是像 ConfigMap 这样的替代品中。
存储在 etcd 中的 Secret 资源应该被静态加密。

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
需要 Secret 的 Pod 应该通过卷自动挂载这些信息，
最好使用 [`emptyDir.medium` 选项](/zh-cn/docs/concepts/storage/volumes/#emptydir)存储在内存中。
该机制还可以用于从第三方存储中注入 Secret 作为卷，如 [Secret Store CSI 驱动](https://secrets-store-csi-driver.sigs.k8s.io/)。
与通过 RBAC 来允许 Pod 服务账号访问 Secret 相比，应该优先使用上述机制。这种机制允许将 Secret 作为环境变量或文件添加到 Pod 中。
请注意，与带访问权限控制的文件相比，由于日志的崩溃转储，以及 Linux 的环境变量的非机密性，环境变量方法可能更容易发生泄漏。

<!--
Service account tokens should not be mounted into pods that do not require them. This can be configured by setting
[`automountServiceAccountToken`](/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server)
to `false` either within the service account to apply throughout the namespace
or specifically for a pod. For Kubernetes v1.22 and above, use
[Bound Service Accounts](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)
for time-bound service account credentials.
-->
不应该将服务账号令牌挂载到不需要它们的 Pod 中。这可以通过在服务账号内将
[`automountServiceAccountToken`](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#use-the-default-service-account-to-access-the-api-server)
设置为 `false` 来完成整个名字空间范围的配置，或者也可以单独在 Pod 层面定制。
对于 Kubernetes v1.22 及更高版本，
请使用[绑定服务账号](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-token-volume)作为有时间限制的服务账号凭证。

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
## 镜像 {#images}

- [ ] 尽量减少容器镜像中不必要的内容。
- [ ] 容器镜像配置为以非特权用户身份运行。
- [ ] 对容器镜像的引用是通过 Sha256 摘要实现的，而不是标签（tags），
  或者[通过准入控制器](/zh-cn/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures-with-admission-controller)在部署时验证镜像的数字签名来验证镜像的来源。
- [ ] 在创建和部署过程中定期扫描容器镜像，并对已知的漏洞软件进行修补。

<!--
Container image should contain the bare minimum to run the program they
package. Preferably, only the program and its dependencies, building the image
from the minimal possible base. In particular, image used in production should not
contain shells or debugging utilities, as an
[ephemeral debug container](/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container)
can be used for troubleshooting.
-->
容器镜像应该包含运行其所打包的程序所需要的最少内容。
最好，只使用程序及其依赖项，基于最小的基础镜像来构建镜像。
尤其是，在生产中使用的镜像不应包含 Shell 或调试工具，
因为可以使用[临时调试容器](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container)进行故障排除。

<!--
Build images to directly start with an unprivileged user by using the
[`USER` instruction in Dockerfile](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user).
The [Security Context](/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod)
allows a container image to be started with a specific user and group with
`runAsUser` and `runAsGroup`, even if not specified in the image manifest.
However, the file permissions in the image layers might make it impossible to just
start the process with a new unprivileged user without image modification.
-->
构建镜像时使用 [Dockerfile 中的 `USER`](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#user)
指令直接开始使用非特权用户。
[安全上下文（Security Context）](/zh-cn/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod)
允许使用 `runAsUser` 和 `runAsGroup` 来指定使用特定的用户和组来启动容器镜像，
即使没有在镜像清单文件（Manifest）中指定这些配置信息。
不过，镜像层中的文件权限设置可能无法做到在不修改镜像的情况下，使用新的非特权用户来启动进程。

<!--
Avoid using image tags to reference an image, especially the `latest` tag, the
image behind a tag can be easily modified in a registry. Prefer using the
complete `sha256` digest which is unique to the image manifest. This policy can be
enforced via an [ImagePolicyWebhook](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook).
Image signatures can also be automatically [verified with an admission controller](/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures-with-admission-controller)
at deploy time to validate their authenticity and integrity.
-->
避免使用镜像标签来引用镜像，尤其是 `latest` 标签，因为标签对应的镜像可以在仓库中被轻松地修改。
首选使用完整的 `Sha256` 摘要，该摘要对特定镜像清单文件而言是唯一的。
可以通过 [ImagePolicyWebhook](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
强制执行此策略。
镜像签名还可以在部署时由[准入控制器自动验证](/zh-cn/docs/tasks/administer-cluster/verify-signed-artifacts/#verifying-image-signatures-with-admission-controller)，
以验证其真实性和完整性。

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
扫描容器镜像可以防止关键性的漏洞随着容器镜像一起被部署到集群中。
镜像扫描应在将容器镜像部署到集群之前完成，通常作为 CI/CD 流水线中的部署过程的一部分来完成。
镜像扫描的目的是获取有关容器镜像中可能存在的漏洞及其预防措施的信息，
例如使用[公共漏洞评分系统 （Common Vulnerability Scoring System，CVSS）](https://www.first.org/cvss/)评分。
如果镜像扫描的结果与管道合性规则匹配，则只有经过正确修补的容器镜像才会最终进入生产环境。

<!--
## Admission controllers

- [ ] An appropriate selection of admission controllers is enabled.
- [ ] A pod security policy is enforced by the Pod Security Admission or/and a
  webhook admission controller.
- [ ] The admission chain plugins and webhooks are securely configured.
-->
## 准入控制器 {#admission-controllers}

- [ ] 选择启用适当的准入控制器。
- [ ] Pod 安全策略由 Pod 安全准入强制执行，或者和 Webhook 准入控制器一起强制执行。
- [ ] 保证准入链插件和 Webhook 的配置都是安全的。

<!--
Admission controllers can help to improve the security of the cluster. However,
they can present risks themselves as they extend the API server and
[should be properly secured](/blog/2022/01/19/secure-your-admission-controllers-and-webhooks/).
-->
准入控制器可以帮助提高集群的安全性。
然而，由于它们是对 API 服务器的扩展，其自身可能会带来风险，
所以它们[应该得到适当的保护](/blog/2022/01/19/secure-your-admission-controllers-and-webhooks/)。

<!--
The following lists present a number of admission controllers that could be
considered to enhance the security posture of your cluster and application. It
includes controllers that may be referenced in other parts of this document.
-->
下面列出了一些准入控制器，可以考虑用这些控制器来增强集群和应用程序的安全状况。
列表中包括了可能在本文档其他部分曾提及的控制器。

<!--
This first group of admission controllers includes plugins
[enabled by default](/docs/reference/access-authn-authz/admission-controllers/#which-plugins-are-enabled-by-default),
consider to leave them enabled unless you know what you are doing:
-->
第一组准入控制器包括[默认启用的插件](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#which-plugins-are-enabled-by-default)，
除非你知道自己在做什么，否则请考虑保持它们处于被启用的状态：

<!--
[`CertificateApproval`](/docs/reference/access-authn-authz/admission-controllers/#certificateapproval)
: Performs additional authorization checks to ensure the approving user has
permission to approve certificate request.
-->
[`CertificateApproval`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#certificateapproval)
: 执行额外的授权检查，以确保审批用户具有审批证书请求的权限。

<!--
[`CertificateSigning`](/docs/reference/access-authn-authz/admission-controllers/#certificatesigning)
: Performs additional authorization checks to ensure the signing user has
permission to sign certificate requests.
-->
[`CertificateSigning`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#certificatesigning)
: 执行其他授权检查，以确保签名用户具有签名证书请求的权限。

<!--
[`CertificateSubjectRestriction`](/docs/reference/access-authn-authz/admission-controllers/#certificatesubjectrestriction)
: Rejects any certificate request that specifies a 'group' (or 'organization
attribute') of `system:masters`.
-->
[`CertificateSubjectRestriction`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#certificatesubjectrestriction)
: 拒绝将 `group`（或 `organization attribute`）设置为 `system:masters` 的所有证书请求。

<!--
[`LimitRanger`](/docs/reference/access-authn-authz/admission-controllers/#limitranger)
: Enforce the LimitRange API constraints.
-->
[`LimitRanger`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#limitranger)
: 强制执行 LimitRange API 约束。

<!--
[`MutatingAdmissionWebhook`](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
: Allows the use of custom controllers through webhooks, these controllers may
mutate requests that it reviews.
-->
[`MutatingAdmissionWebhook`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
: 允许通过 Webhook 使用自定义控制器，这些控制器可能会变更它所审查的请求。

<!--
[`PodSecurity`](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
: Replacement for Pod Security Policy, restricts security contexts of deployed
Pods.
-->
[`PodSecurity`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
: Pod Security Policy 的替代品，用于约束所部署 Pod 的安全上下文。

<!--
[`ResourceQuota`](/docs/reference/access-authn-authz/admission-controllers/#resourcequota)
: Enforces resource quotas to prevent over-usage of resources.
-->
[`ResourceQuota`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#resourcequota)
: 强制执行资源配额，以防止资源被过度使用。

<!--
[`ValidatingAdmissionWebhook`](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
: Allows the use of custom controllers through webhooks, these controllers do
not mutate requests that it reviews.
-->
[`ValidatingAdmissionWebhook`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
: 允许通过 Webhook 使用自定义控制器，这些控制器不变更它所审查的请求。

<!--
The second group includes plugin that are not enabled by default but in general
availability state and recommended to improve your security posture:
-->
第二组包括默认情况下没有启用、但处于正式发布状态的插件，建议启用这些插件以改善你的安全状况：

<!--
[`DenyServiceExternalIPs`](/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)
: Rejects all net-new usage of the `Service.spec.externalIPs` field. This is a mitigation for
[CVE-2020-8554: Man in the middle using LoadBalancer or ExternalIPs](https://github.com/kubernetes/kubernetes/issues/97076).
-->
[`DenyServiceExternalIPs`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#denyserviceexternalips)
: 拒绝使用 `Service.spec.externalIPs` 字段，已有的 Service 不受影响，新增或者变更时不允许使用。
  这是 [CVE-2020-8554：中间人使用 LoadBalancer 或 ExternalIP](https://github.com/kubernetes/kubernetes/issues/97076)
  的缓解措施。

<!--
[`NodeRestriction`](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
: Restricts kubelet's permissions to only modify the pods API resources they own
or the node API resource that represent themselves. It also prevents kubelet
from using the `node-restriction.kubernetes.io/` annotation, which can be used
by an attacker with access to the kubelet's credentials to influence pod
placement to the controlled node.
-->
[`NodeRestriction`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
: 将 kubelet 的权限限制为只能修改其拥有的 Pod API 资源或代表其自身的节点 API 资源。
  此插件还可以防止 kubelet 使用 `node-restriction.kubernetes.io/` 注解，
  攻击者可以使用该注解来访问 kubelet 的凭证，从而影响所控制的节点上的 Pod 布局。

<!--
The third group includes plugins that are not enabled by default but could be
considered for certain use cases:
-->
第三组包括默认情况下未启用，但可以考虑在某些场景下启用的插件：

<!--
[`AlwaysPullImages`](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
: Enforces the usage of the latest version of a tagged image and ensures that the deployer
has permissions to use the image.
-->
[`AlwaysPullImages`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
: 强制使用最新版本标记的镜像，并确保部署者有权使用该镜像。

<!--
[`ImagePolicyWebhook`](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
: Allows enforcing additional controls for images through webhooks.
-->
[`ImagePolicyWebhook`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
: 允许通过 Webhook 对镜像强制执行额外的控制。

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
## 接下来  {#what-is-next}

- [通过 Pod 创建进行权限升级](/zh-cn/docs/reference/access-authn-authz/authorization/#privilege-escalation-via-pod-creation)会警告你特定的访问控制风险；
  请检查你如何管理该风险。
  - 如果你使用 Kubernetes RBAC，请阅读
    [RBAC 良好实践](/zh-cn/docs/concepts/security/rbac-good-practices/)获取有关鉴权的更多信息。
- [保护集群](/zh-cn/docs/tasks/administer-cluster/securing-a-cluster/)提供如何保护集群免受意外或恶意访问的信息。
- [集群多租户指南](/zh-cn/docs/concepts/security/multi-tenancy/)提供有关多租户的配置选项建议和最佳实践。
- [博文“深入了解 NSA/CISA Kubernetes 强化指南”](/blog/2021/10/05/nsa-cisa-kubernetes-hardening-guidance/#building-secure-container-images)为强化
  Kubernetes 集群提供补充资源。
