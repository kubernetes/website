---
title: Pod 安全性标准
content_type: concept
weight: 10
---
<!--
reviewers:
- tallclair
title: Pod Security Standards
content_type: concept
weight: 10
-->

<!-- overview -->

<!--
Security settings for Pods are typically applied by using [security
contexts](/docs/tasks/configure-pod-container/security-context/). Security Contexts allow for the
definition of privilege and access controls on a per-Pod basis.

The enforcement and policy-based definition of cluster requirements of security contexts has
previously been achieved using [Pod Security Policy](/docs/concepts/policy/pod-security-policy/). A
_Pod Security Policy_ is a cluster-level resource that controls security sensitive aspects of the
Pod specification.

However, numerous means of policy enforcement have arisen that augment or replace the use of
PodSecurityPolicy. The intent of this page is to detail recommended Pod security profiles, decoupled
from any specific instantiation.
-->
Pod 的安全性配置一般通过使用
[安全性上下文（Security Context）](/zh/docs/tasks/configure-pod-container/security-context/)
来保证。安全性上下文允许用户逐个 Pod 地定义特权级及访问控制。

以前，对集群的安全性上下文的需求的实施及其基于策略的定义都通过使用
[Pod 安全性策略](/zh/docs/concepts/policy/pod-security-policy/)来实现。
_Pod 安全性策略（Pod Security Policy）_ 是一种集群层面的资源，控制 Pod 规约中
安全性敏感的部分。

不过，新的策略实施方式不断涌现，或增强或替换 PodSecurityPolicy 的使用。
本页的目的是详细介绍建议实施的 Pod 安全框架；这些内容与具体的实现无关。

<!-- body -->

<!--
## Policy Types

There is an immediate need for base policy definitions to broadly cover the security spectrum. These
should range from highly restricted to highly flexible:

- **_Privileged_** - Unrestricted policy, providing the widest possible level of permissions. This
  policy allows for known privilege escalations.
- **_Baseline_** - Minimally restrictive policy while preventing known privilege
  escalations. Allows the default (minimally specified) Pod configuration.
- **_Restricted_** - Heavily restricted policy, following current Pod hardening best practices.
-->
## 策略类型   {#policy-types}

在进一步讨论整个策略谱系之前，有必要对基本的策略下个定义。
策略可以是很严格的也可以是很宽松的：

- **_Privileged_** - 不受限制的策略，提供最大可能范围的权限许可。这些策略
  允许已知的特权提升。
- **_Baseline_** - 限制性最弱的策略，禁止已知的策略提升。
  允许使用默认的（规定最少）Pod 配置。
- **_Restricted_** - 限制性非常强的策略，遵循当前的保护 Pod 的最佳实践。

<!--
## Policies

### Privileged
-->
## 策略    {#policies}

### Privileged

<!--
The Privileged policy is purposely-open, and entirely unrestricted. This type of policy is typically
aimed at system- and infrastructure-level workloads managed by privileged, trusted users.

The privileged policy is defined by an absence of restrictions. For allow-by-default enforcement
mechanisms (such as gatekeeper), the privileged profile may be an absence of applied constraints
rather than an instantiated policy. In contrast, for a deny-by-default mechanism (such as Pod
Security Policy) the privileged policy should enable all controls (disable all restrictions).
-->
Privileged 策略是有目的地开放且完全无限制的策略。此类策略通常针对由
特权较高、受信任的用户所管理的系统级或基础设施级负载。

Privileged 策略定义中限制较少。对于默认允许（Allow-by-default）实施机制（例如 gatekeeper），
Privileged 框架可能意味着不应用任何约束而不是实施某策略实例。
与此不同，对于默认拒绝（Deny-by-default）实施机制（如 Pod 安全策略）而言，
Privileged 策略应该默认允许所有控制（即，禁止所有限制）。

### Baseline

<!--
The Baseline policy is aimed at ease of adoption for common containerized workloads while
preventing known privilege escalations. This policy is targeted at application operators and
developers of non-critical applications. The following listed controls should be
enforced/disallowed:
-->
Baseline 策略的目标是便于常见的容器化应用采用，同时禁止已知的特权提升。
此策略针对的是应用运维人员和非关键性应用的开发人员。
下面列举的控制应该被实施（禁止）：

<table>
	<!-- caption style="display:none">Baseline policy specification</caption -->
	<caption style="display:none">Baseline 策略规范</caption>
	<tbody>
		<tr>
			<td width="30%"><strong>控制（Control）</strong></td>
			<td><strong>策略（Policy）</strong></td>
		</tr>
		<tr>
			<!-- td>Host Namespaces</td -->
			<td>宿主名字空间</td>
			<!-- td>
				Sharing the host namespaces must be disallowed.<br>
				<br><b>限制的字段：</b><br>
				spec.hostNetwork<br>
				spec.hostPID<br>
				spec.hostIPC<br>
				<br><b>Allowed Values:</b> false<br>
			</td -->
			<td>
				必须禁止共享宿主名字空间。<br>
				<br><b>限制的字段：</b><br>
				spec.hostNetwork<br>
				spec.hostPID<br>
				spec.hostIPC<br>
				<br><b>允许的值：</b> false<br>
			</td>
		</tr>
		<tr>
			<!-- td>Privileged Containers</td -->
			<td>特权容器</td>
			<!-- td>
				Privileged Pods disable most security mechanisms and must be disallowed.<br>
				<br><b>限制的字段：</b><br>
				spec.containers[*].securityContext.privileged<br>
				spec.initContainers[*].securityContext.privileged<br>
				<br><b>Allowed Values:</b> false, undefined/nil<br>
			</td -->
			<td>
				特权 Pod 禁用大多数安全性机制，必须被禁止。<br>
				<br><b>限制的字段：</b><br>
				spec.containers[*].securityContext.privileged<br>
				spec.initContainers[*].securityContext.privileged<br>
				<br><b>允许的值：</b> false、未定义/nil<br>
			</td>
		</tr>
		<tr>
			<!-- td>Capabilities</td -->
			<td>权能</td>
			<!-- td>
				Adding additional capabilities beyond the <a href="https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities">default set</a> must be disallowed.<br>
				<br><b>限制的字段：</b><br>
				spec.containers[*].securityContext.capabilities.add<br>
				spec.initContainers[*].securityContext.capabilities.add<br>
				<br><b>Allowed Values:</b> empty (or restricted to a known list)<br>
			</td -->
			<td>
				必须禁止添加<a href="https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities">默认集合</a>之外的权能。<br>
				<br><b>限制的字段：</b><br>
				spec.containers[*].securityContext.capabilities.add<br>
				spec.initContainers[*].securityContext.capabilities.add<br>
				<br><b>允许的值：</b> 空（或限定为一个已知列表）<br>
			</td>
		</tr>
		<tr>
			<!-- td>HostPath Volumes</td -->
			<td>HostPath 卷</td>
			<!-- td>
				HostPath volumes must be forbidden.<br>
				<br><b>限制的字段：</b><br>
				spec.volumes[*].hostPath<br>
				<br><b>Allowed Values:</b> undefined/nil<br>
			</td -->
			<td>
				必须禁止 HostPath 卷。<br>
				<br><b>限制的字段：</b><br>
				spec.volumes[*].hostPath<br>
				<br><b>允许的值：</b> 未定义/nil<br>
			</td>
		</tr>
		<tr>
			<!-- td>Host Ports</td -->
			<td>宿主端口</td>
			<!-- td>
				HostPorts should be disallowed, or at minimum restricted to a known list.<br>
				<br><b>限制的字段：</b><br>
				spec.containers[*].ports[*].hostPort<br>
				spec.initContainers[*].ports[*].hostPort<br>
				<br><b>Allowed Values:</b> 0, undefined (or restricted to a known list)<br>
			</td -->
			<td>
				应禁止使用宿主端口，或者至少限定为已知列表。<br>
				<br><b>限制的字段：</b><br>
				spec.containers[*].ports[*].hostPort<br>
				spec.initContainers[*].ports[*].hostPort<br>
				<br><b>允许的值：</b> 0、未定义（或限定为已知列表）<br>
			</td>
		</tr>
		<tr>
			<!-- <td>AppArmor <em>(optional)</em></td> -->
			<td>AppArmor</td>
			<!-- td>
				On supported hosts, the 'runtime/default' AppArmor profile is applied by default.
				The baseline policy should prevent overriding or disabling the default AppArmor
				profile, or restrict overrides to an allowed set of profiles.<br>
				<br><b>限制的字段：</b><br>
				metadata.annotations['container.apparmor.security.beta.kubernetes.io/*']<br>
				<br><b>Allowed Values:</b> 'runtime/default', undefined<br>
			</td -->
			<td>
				在被支持的主机上，默认使用 'runtime/default' AppArmor Profile。
				基线策略应避免覆盖或者禁用默认策略，以及限制覆盖一些 profile 集合的权限。<br>
				<br><b>限制的字段：</b><br>
				metadata.annotations['container.apparmor.security.beta.kubernetes.io/*']<br>
				<br><b>允许的值：</b> 'runtime/default'、未定义<br>
			</td>
		</tr>
		<tr>
			<!-- <td>SELinux</td> -->
			<td>SELinux</td>
			<!-- td>
				Setting the SELinux type is restricted, and setting a custom SELinux user or role option is forbidden.<br>
				<br><b>Restricted Fields:</b><br>
				spec.securityContext.seLinuxOptions.type<br>
				spec.containers[*].securityContext.seLinuxOptions.type<br>
				spec.initContainers[*].securityContext.seLinuxOptions.type<br>
				<br><b>Allowed Values:</b><br>
				undefined/empty<br>
				container_t<br>
				container_init_t<br>
				container_kvm_t<br>
				<br><b>Restricted Fields:</b><br>
				spec.securityContext.seLinuxOptions.user<br>
				spec.containers[*].securityContext.seLinuxOptions.user<br>
				spec.initContainers[*].securityContext.seLinuxOptions.user<br>
				spec.securityContext.seLinuxOptions.role<br>
				spec.containers[*].securityContext.seLinuxOptions.role<br>
				spec.initContainers[*].securityContext.seLinuxOptions.role<br>
				<br><b>Allowed Values:</b> undefined/empty<br>
			</td -->
			<td>
				设置 SELinux 类型的操作是被限制的，设置自定义的 SELinux 用户或角色选项是被禁止的。<br>
				<br><b>限制的字段：</b><br>
				spec.securityContext.seLinuxOptions.type<br>
				spec.containers[*].securityContext.seLinuxOptions.type<br>
				spec.initContainers[*].securityContext.seLinuxOptions.type<br>
				<br><b>允许的值：</b><br>
				未定义/空<br>
				container_t<br>
				container_init_t<br>
				container_kvm_t<br>
				<br><b>被限制的字段：</b><br>
				spec.securityContext.seLinuxOptions.user<br>
				spec.containers[*].securityContext.seLinuxOptions.user<br>
				spec.initContainers[*].securityContext.seLinuxOptions.user<br>
				spec.securityContext.seLinuxOptions.role<br>
				spec.containers[*].securityContext.seLinuxOptions.role<br>
				spec.initContainers[*].securityContext.seLinuxOptions.role<br>
				<br><b>允许的值：</b> 未定义或空<br>
			</td>
		</tr>
		<tr>
			<!-- td>/proc Mount Type</td -->
			<td>/proc 挂载类型</td>
			<!-- td>
				The default /proc masks are set up to reduce attack surface, and should be required.<br>
				<br><b>Restricted Fields:</b><br>
				spec.containers[*].securityContext.procMount<br>
				spec.initContainers[*].securityContext.procMount<br>
				<br><b>Allowed Values:</b> undefined/nil, 'Default'<br>
			</td -->
			<td>
				要求使用默认的 <code>/proc</code> 掩码以减小攻击面。<br>
				<br><b>限制的字段：</b><br>
				spec.containers[*].securityContext.procMount<br>
				spec.initContainers[*].securityContext.procMount<br>
				<br><b>允许的值：</b> 未定义/nil、'Default'<br>
			</td>
		</tr>
		<tr>
			<td>Sysctls</td>
			<!-- td>
				Sysctls can disable security mechanisms or affect all containers on a host, and should be disallowed except for an allowed "safe" subset.
				A sysctl is considered safe if it is namespaced in the container or the Pod, and it is isolated from other Pods or processes on the same Node.<br>
				<br><b>Restricted Fields:</b><br>
				spec.securityContext.sysctls<br>
				<br><b>Allowed Values:</b><br>
				kernel.shm_rmid_forced<br>
				net.ipv4.ip_local_port_range<br>
				net.ipv4.tcp_syncookies<br>
				net.ipv4.ping_group_range<br>
				undefined/empty<br>
			</td -->
			<td>
				Sysctls 可以禁用安全机制或影响宿主上所有容器，因此除了若干『安全』的子集之外，应该被禁止。
				如果某 sysctl 是受容器或 Pod 的名字空间限制，且与节点上其他 Pod 或进程相隔离，可认为是安全的。<br>
				<br><b>限制的字段：</b><br>
				spec.securityContext.sysctls<br>
				<br><b>允许的值：</b><br>
				kernel.shm_rmid_forced<br>
				net.ipv4.ip_local_port_range<br>
				net.ipv4.tcp_syncookies<br>
				net.ipv4.ping_group_range<br>
				未定义/空值<br>
			</td>
		</tr>
	</tbody>
</table>

### Restricted

<!--
The Restricted policy is aimed at enforcing current Pod hardening best practices, at the expense of
some compatibility. It is targeted at operators and developers of security-critical applications, as
well as lower-trust users.The following listed controls should be enforced/disallowed:
-->
Restricted 策略旨在实施当前保护 Pod 的最佳实践，尽管这样作可能会牺牲一些兼容性。
该类策略主要针对运维人员和安全性很重要的应用的开发人员，以及不太被信任的用户。
下面列举的控制需要被实施（禁止）：

<table>
	<!-- caption style="display:none">Restricted policy specification</caption -->
	<caption style="display:none">Restricted 策略规范</caption>
	<tbody>
		<tr>
			<!-- td><strong>Control</strong></td -->
			<td width="30%"><strong>控制（Control）</strong></td>
			<!-- td><strong>Policy</strong></td -->
			<td><strong>策略（Policy）</strong></td>
		</tr>
		<tr>
			<!-- <td colspan="2"><em>Everything from the baseline profile.</em></td> -->
			<td colspan="2"><em>基线策略的所有要求。</em></td>
		</tr>
		<tr>
			<!-- td>Volume Types</td -->
			<td>卷类型</td>
			<td>
				<!-- In addition to restricting HostPath volumes, the restricted profile limits usage of non-core volume types to those defined through PersistentVolumes. -->
				除了限制 HostPath 卷之外，此类策略还限制可以通过 PersistentVolumes 定义的非核心卷类型。<br>
				<br><b>限制的字段：</b><br>
				spec.volumes[*].hostPath<br>
				spec.volumes[*].gcePersistentDisk<br>
				spec.volumes[*].awsElasticBlockStore<br>
				spec.volumes[*].gitRepo<br>
				spec.volumes[*].nfs<br>
				spec.volumes[*].iscsi<br>
				spec.volumes[*].glusterfs<br>
				spec.volumes[*].rbd<br>
				spec.volumes[*].flexVolume<br>
				spec.volumes[*].cinder<br>
				spec.volumes[*].cephFS<br>
				spec.volumes[*].flocker<br>
				spec.volumes[*].fc<br>
				spec.volumes[*].azureFile<br>
				spec.volumes[*].vsphereVolume<br>
				spec.volumes[*].quobyte<br>
				spec.volumes[*].azureDisk<br>
				spec.volumes[*].portworxVolume<br>
				spec.volumes[*].scaleIO<br>
				spec.volumes[*].storageos<br>
				spec.volumes[*].csi<br>
				<br><b>允许的值：</b> 未定义/nil<br>
			</td>
		</tr>
		<tr>
			<!-- td>Privilege Escalation</td -->
			<td>特权提升</td>
			<td>
				<!-- Privilege escalation (such as via set-user-ID or set-group-ID file mode) should not be allowed. -->
				禁止（通过 SetUID 或 SetGID 文件模式）获得特权提升。<br>
				<br><b>限制的字段：</b><br>
				spec.containers[*].securityContext.allowPrivilegeEscalation<br>
				spec.initContainers[*].securityContext.allowPrivilegeEscalation<br>
				<br><b>允许的值：</b> false<br>
			</td>
		</tr>
		<tr>
			<!-- td>Running as Non-root</td -->
			<td>以非 root 账号运行 </td>
			<td>
				<!-- Containers must be required to run as non-root users. -->
				必须要求容器以非 root 用户运行。<br>
				<br><b>限制的字段：</b><br>
				spec.securityContext.runAsNonRoot<br>
				spec.containers[*].securityContext.runAsNonRoot<br>
				spec.initContainers[*].securityContext.runAsNonRoot<br>
				<br><b>允许的值：</b> true<br>
			</td>
		</tr>
		<tr>
			<!-- td>Non-root groups <em>(optional)</em></td -->
			<td>非 root 组 <em>（可选）</em></td>
			<td>
				<!-- Containers should be forbidden from running with a root primary or supplementary GID. -->
				禁止容器使用 root 作为主要或辅助 GID 来运行。<br>
				<br><b>限制的字段：</b><br>
				spec.securityContext.runAsGroup<br>
				spec.securityContext.supplementalGroups[*]<br>
				spec.securityContext.fsGroup<br>
				spec.containers[*].securityContext.runAsGroup<br>
				spec.initContainers[*].securityContext.runAsGroup<br>
				<br><b>允许的值：</b><br>
				非零值<br>
				未定义/nil （<code>*.runAsGroup</code> 除外）<br>
			</td>
		</tr>
		<tr>
			<td>Seccomp</td>
			<td>
				<!-- The RuntimeDefault seccomp profile must be required, or allow specific additional profiles. -->
				必须要求使用 RuntimeDefault seccomp profile 或者允许使用特定的 profiles。<br>
				<br><b>限制的字段：</b><br>
				spec.securityContext.seccompProfile.type<br>
				spec.containers[*].securityContext.seccompProfile<br>
				spec.initContainers[*].securityContext.seccompProfile<br>
				<br><b>允许的值：</b><br>
				'runtime/default'<br>
				未定义/nil<br>
			</td>
		</tr>
	</tbody>
</table>

<!--
## Policy Instantiation

Decoupling policy definition from policy instantiation allows for a common understanding and
consistent language of policies across clusters, independent of the underlying enforcement
mechanism.

As mechanisms mature, they will be defined below on a per-policy basis. The methods of enforcement
of individual policies are not defined here.
-->
## 策略实例化   {#policy-instantiation}

将策略定义从策略实例中解耦出来有助于形成跨集群的策略理解和语言陈述，
以免绑定到特定的下层实施机制。

随着相关机制的成熟，这些机制会按策略分别定义在下面。特定策略的实施方法不在这里定义。

[**PodSecurityPolicy**](/zh/docs/concepts/policy/pod-security-policy/)

- [Privileged](https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/policy/privileged-psp.yaml)
- [Baseline](https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/policy/baseline-psp.yaml)
- [Restricted](https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/policy/restricted-psp.yaml)

<!--
## FAQ

### Why isn't there a profile between privileged and baseline?
-->
## 常见问题    {#faq}

### 为什么不存在介于 Privileged 和 Baseline 之间的策略类型

<!--
The three profiles defined here have a clear linear progression from most secure (restricted) to least
secure (privileged), and cover a broad set of workloads. Privileges required above the baseline
policy are typically very application specific, so we do not offer a standard profile in this
niche. This is not to say that the privileged profile should always be used in this case, but that
policies in this space need to be defined on a case-by-case basis.

SIG Auth may reconsider this position in the future, should a clear need for other profiles arise.
-->
这里定义的三种策略框架有一个明晰的线性递进关系，从最安全（Restricted）到最不安全，
并且覆盖了很大范围的工作负载。特权要求超出 Baseline 策略者通常是特定于应用的需求，
所以我们没有在这个范围内提供标准框架。
这并不意味着在这样的情形下仍然只能使用 Privileged 框架，只是说处于这个范围的
策略需要因地制宜地定义。

SIG Auth 可能会在将来考虑这个范围的框架，前提是有对其他框架的需求。

<!--
### What's the difference between a security policy and a security context?

[Security Contexts](/docs/tasks/configure-pod-container/security-context/) configure Pods and
Containers at runtime. Security contexts are defined as part of the Pod and container specifications
in the Pod manifest, and represent parameters to the container runtime.
-->
### 安全策略与安全上下文的区别是什么？

[安全上下文](/zh/docs/tasks/configure-pod-container/security-context/)在运行时配置 Pod
和容器。安全上下文是在 Pod 清单中作为 Pod 和容器规约的一部分来定义的，所代表的是
传递给容器运行时的参数。

<!--
Security policies are control plane mechanisms to enforce specific settings in the Security Context,
as well as other parameters outside the Security Context. As of February 2020, the current native
solution for enforcing these security policies is [Pod Security
Policy](/docs/concepts/policy/pod-security-policy/) - a mechanism for centrally enforcing security
policy on Pods across a cluster. Other alternatives for enforcing security policy are being
developed in the Kubernetes ecosystem, such as [OPA
Gatekeeper](https://github.com/open-policy-agent/gatekeeper).
-->
安全策略则是控制面用来对安全上下文以及安全性上下文之外的参数实施某种设置的机制。
在 2020 年 2 月，目前实施这些安全性策略的原生解决方案是
[Pod 安全性策略](/zh/docs/concepts/policy/pod-security-policy/) - 一种对集群中
Pod 的安全性策略进行集中控制的机制。
Kubernetes 生态系统中还在开发一些其他的替代方案，例如
[OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)。

<!--
### What profiles should I apply to my Windows Pods?

Windows in Kubernetes has some limitations and differentiators from standard Linux-based
workloads. Specifically, the Pod SecurityContext fields [have no effect on
Windows](/docs/setup/production-environment/windows/intro-windows-in-kubernetes/#v1-podsecuritycontext). As
such, no standardized Pod Security profiles currently exists.
-->
### 我应该为我的 Windows Pod 实施哪种框架？

Kubernetes 中的 Windows 负载与标准的基于 Linux 的负载相比有一些局限性和区别。
尤其是 Pod SecurityContext 字段
[对 Windows 不起作用](/zh/docs/setup/production-environment/windows/intro-windows-in-kubernetes/#v1-podsecuritycontext)。
因此，目前没有对应的标准 Pod 安全性框架。

<!--
### What about sandboxed Pods?

There is not currently an API standard that controls whether a Pod is considered sandboxed or
not. Sandbox Pods may be identified by the use of a sandboxed runtime (such as gVisor or Kata
Containers), but there is no standard definition of what a sandboxed runtime is.

The protections necessary for sandboxed workloads can differ from others. For example, the need to
restrict privileged permissions is lessened when the workload is isolated from the underlying
kernel. This allows for workloads requiring heightened permissions to still be isolated.

Additionally, the protection of sandboxed workloads is highly dependent on the method of
sandboxing. As such, no single recommended policy is recommended for all sandboxed workloads.
-->
### 沙箱（Sandboxed） Pod 怎么处理？

现在还没有 API 标准来控制 Pod 是否被视作沙箱化 Pod。
沙箱 Pod 可以通过其是否使用沙箱化运行时（如 gVisor 或 Kata Container）来辨别，不过
目前还没有关于什么是沙箱化运行时的标准定义。

沙箱化负载所需要的保护可能彼此各不相同。例如，当负载与下层内核直接隔离开来时，
限制特权化操作的许可就不那么重要。这使得那些需要更多许可权限的负载仍能被有效隔离。

此外，沙箱化负载的保护高度依赖于沙箱化的实现方法。
因此，现在还没有针对所有沙箱化负载的建议策略。
