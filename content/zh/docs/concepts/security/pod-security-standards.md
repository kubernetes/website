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
The Pod Security Standards define three different _policies_ to broadly cover the security
spectrum. These policies are _cumulative_ and range from highly-permissive to highly-restrictive.
This guide outlines the requirements of each policy.

| Profile | Description |
| ------ | ----------- |
| <strong style="white-space: nowrap">Privileged</strong> | Unrestricted policy, providing the widest possible level of permissions. This policy allows for known privilege escalations. |
| <strong style="white-space: nowrap">Baseline</strong> | Minimally restrictive policy which prevents known privilege escalations. Allows the default (minimally specified) Pod configuration. |
| <strong style="white-space: nowrap">Restricted</strong> | Heavily restricted policy, following current Pod hardening best practices. |
-->
Pod 安全性标准定义了三种不同的 _策略（Policy）_，以广泛覆盖安全应用场景。
这些策略是 _渐进式的（Cumulative）_，安全级别从高度宽松至高度受限。
本指南概述了每个策略的要求。

| Profile | 描述 |
| ------ | ----------- |
| <strong style="white-space: nowrap">Privileged</strong> | 不受限制的策略，提供最大可能范围的权限许可。此策略允许已知的特权提升。 |
| <strong style="white-space: nowrap">Baseline</strong> | 限制性最弱的策略，禁止已知的策略提升。允许使用默认的（规定最少）Pod 配置。 |
| <strong style="white-space: nowrap">Restricted</strong> | 限制性非常强的策略，遵循当前的保护 Pod 的最佳实践。 |

<!-- body -->

<!--
## Profile Details

### Privileged
-->
## Profile 细节    {#profile-details}

### Privileged

<!--
**The _Privileged_ policy is purposely-open, and entirely unrestricted.** This type of policy is
typically aimed at system- and infrastructure-level workloads managed by privileged, trusted users.

The privileged policy is defined by an absence of restrictions. For allow-by-default enforcement
mechanisms (such as gatekeeper), the privileged profile may be an absence of applied constraints
rather than an instantiated policy. In contrast, for a deny-by-default mechanism (such as Pod
Security Policy) the privileged policy should enable all controls (disable all restrictions).
-->
**_Privileged_ 策略是有目的地开放且完全无限制的策略。**
此类策略通常针对由特权较高、受信任的用户所管理的系统级或基础设施级负载。

Privileged 策略定义中限制较少。对于默认允许（Allow-by-default）实施机制（例如 gatekeeper），
Privileged 框架可能意味着不应用任何约束而不是实施某策略实例。
与此不同，对于默认拒绝（Deny-by-default）实施机制（如 Pod 安全策略）而言，
Privileged 策略应该默认允许所有控制（即，禁止所有限制）。

### Baseline

<!--
**The _Baseline_ policy is aimed at ease of adoption for common containerized workloads while
preventing known privilege escalations.** This policy is targeted at application operators and
developers of non-critical applications. The following listed controls should be
enforced/disallowed:
-->
**_Baseline_ 策略的目标是便于常见的容器化应用采用，同时禁止已知的特权提升。**
此策略针对的是应用运维人员和非关键性应用的开发人员。
下面列举的控制应该被实施（禁止）：

{{< note >}}
<!--
In this table, wildcards (`*`) indicate all elements in a list. For example,
`spec.containers[*].securityContext` refers to the Security Context object for _all defined
containers_. If any of the listed containers fails to meet the requirements, the entire pod will
fail validation.
-->
在下述表格中，通配符（`*`）意味着一个列表中的所有元素。
例如 `spec.containers[*].securityContext` 表示 _所定义的所有容器_ 的安全性上下文对象。
如果所列出的任一容器不能满足要求，整个 Pod 将无法通过校验。
{{< /note >}}

<table>
	<!-- caption style="display:none">Baseline policy specification</caption -->
	<caption style="display:none">Baseline 策略规范</caption>
	<tbody>
		<tr>
			<td>控制（Control）</td>
			<td>策略（Policy）</td>
		</tr>
    <tr>
			<!-- <td style="white-space: nowrap">HostProcess</td> -->
      <td style="white-space: nowrap">HostProcess</td>
      <!-- <td>
				<p>Windows pods offer the ability to run <a href="/docs/tasks/configure-pod-container/create-hostprocess-pod">HostProcess containers</a> which enables privileged access to the Windows node. Privileged access to the host is disallowed in the baseline policy. HostProcess pods are an <strong>alpha</strong> feature as of Kubernetes <strong>v1.22</strong>.</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.containers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.initContainers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.windowsOptions.hostProcess</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>false</code></li>
				</ul>
			</td> -->
			<td>
				<p>Windows Pod 提供了运行
         <a href="/zh/docs/tasks/configure-pod-container/create-hostprocess-pod">HostProcess 容器</a> 的能力，
         这使得对 Windows 节点的特权访问成为可能。 
         基线策略中对宿主的特权访问是被禁止的。 
         HostProcess Pod 是 Kubernetes <strong>v1.22</strong> 版本的
          <strong>alpha</strong> 特性。</p>
				<p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.containers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.initContainers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.windowsOptions.hostProcess</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li>未定义/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<!-- <td style="white-space: nowrap">Host Namespaces</td> -->
			<td style="white-space: nowrap">宿主名字空间</td>
			<!-- 
      <td>
				<p>Sharing the host namespaces must be disallowed.</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.hostNetwork</code></li>
					<li><code>spec.hostPID</code></li>
					<li><code>spec.hostIPC</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
      -->
			<td>
        <p>必须禁止共享宿主名字空间。</p>
        <p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.hostNetwork</code></li>
					<li><code>spec.hostPID</code></li>
					<li><code>spec.hostIPC</code></li>
				</ul>
        <p><strong>允许的值</strong></p>
				<ul>
					<li>未定义/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<!-- <td style="white-space: nowrap">Privileged Containers</td> -->
			<td style="white-space: nowrap">特权容器</td>
			<!-- <td>
				<p>Privileged Pods disable most security mechanisms and must be disallowed.</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.privileged</code></li>
					<li><code>spec.initContainers[*].securityContext.privileged</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.privileged</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>false</code></li>
				</ul>
			</td> -->
			<td>
        <p>特权 Pod 关闭了大多数安全性机制，必须被禁止。</p>
				<p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.privileged</code></li>
					<li><code>spec.initContainers[*].securityContext.privileged</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.privileged</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li>未定义/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<!-- <td style="white-space: nowrap">Capabilities</td> -->
			<td style="white-space: nowrap">权能</td>
			<!-- <td>
				<p>Adding additional capabilities beyond those listed below must be disallowed.</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>AUDIT_WRITE</code></li>
					<li><code>CHOWN</code></li>
					<li><code>DAC_OVERRIDE</code></li>
					<li><code>FOWNER</code></li>
					<li><code>FSETID</code></li>
					<li><code>KILL</code></li>
					<li><code>MKNOD</code></li>
					<li><code>NET_BIND_SERVICE</code></li>
					<li><code>SETFCAP</code></li>
					<li><code>SETGID</code></li>
					<li><code>SETPCAP</code></li>
					<li><code>SETUID</code></li>
					<li><code>SYS_CHROOT</code></li>
				</ul>
			</td> -->
			<td>
        <p>必须禁止添加除下列字段之外的权能。</p>
				<p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>AUDIT_WRITE</code></li>
					<li><code>CHOWN</code></li>
					<li><code>DAC_OVERRIDE</code></li>
					<li><code>FOWNER</code></li>
					<li><code>FSETID</code></li>
					<li><code>KILL</code></li>
					<li><code>MKNOD</code></li>
					<li><code>NET_BIND_SERVICE</code></li>
					<li><code>SETFCAP</code></li>
					<li><code>SETGID</code></li>
					<li><code>SETPCAP</code></li>
					<li><code>SETUID</code></li>
					<li><code>SYS_CHROOT</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<!-- <td style="white-space: nowrap">HostPath Volumes</td>-->
			<td style="white-space: nowrap">HostPath 卷</td>
			<!-- <td>
				<p>HostPath volumes must be forbidden.</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.volumes[*].hostPath</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
				</ul>
			</td> -->
			<td>
        <p>必须禁止 HostPath 卷。</p>
				<p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.volumes[*].hostPath</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li>未定义/nil</li>
				</ul>
			</td>
		</tr>
		<tr>
			<!-- <td style="white-space: nowrap">Host Ports</td> -->
			<td style="white-space: nowrap">宿主端口</td>
			<!-- <td>
				<p>HostPorts should be disallowed, or at minimum restricted to a known list.</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.containers[*].ports[*].hostPort</code></li>
					<li><code>spec.initContainers[*].ports[*].hostPort</code></li>
					<li><code>spec.ephemeralContainers[*].ports[*].hostPort</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li>Known list</li>
					<li><code>0</code></li>
				</ul>
			</td>-->
			<td>
        <p>应禁止使用宿主端口，或者至少限定为已知列表。</p>
        <p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].ports[*].hostPort</code></li>
					<li><code>spec.initContainers[*].ports[*].hostPort</code></li>
					<li><code>spec.ephemeralContainers[*].ports[*].hostPort</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li>未定义/nil</li>
					<li>已知列表</li>
					<li><code>0</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<!-- <td style="white-space: nowrap">AppArmor</td> -->
			<td style="white-space: nowrap">AppArmor</td>
			<!-- <td>
				<p>On supported hosts, the <code>runtime/default</code> AppArmor profile is applied by default. The baseline policy should prevent overriding or disabling the default AppArmor profile, or restrict overrides to an allowed set of profiles.</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>metadata.annotations["container.apparmor.security.beta.kubernetes.io/*"]</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>runtime/default</code></li>
					<li><code>localhost/*</code></li>
				</ul>
			</td> -->
			<td>
        <p>在受支持的主机上，默认使用 <code>runtime/default</code> AppArmor Profile。
				基线策略应避免覆盖或者禁用默认策略，以及限制覆盖一些 Profile 集合的权限。</p>
				<p><strong>限制的字段</strong></p>
				<ul>
					<li><code>metadata.annotations["container.apparmor.security.beta.kubernetes.io/*"]</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li>未定义/nil</li>
					<li><code>runtime/default</code></li>
					<li><code>localhost/*</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<!-- <td style="white-space: nowrap">SELinux</td> -->
			<td style="white-space: nowrap">SELinux</td>
			<!-- <td>
				<p>Setting the SELinux type is restricted, and setting a custom SELinux user or role option is forbidden.</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.type</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/""</li>
					<li><code>container_t</code></li>
					<li><code>container_init_t</code></li>
					<li><code>container_kvm_t</code></li>
				</ul>
				<hr />
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.securityContext.seLinuxOptions.user</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.user</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.user</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.user</code></li>
					<li><code>spec.securityContext.seLinuxOptions.role</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.role</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.role</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.role</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/""</li>
				</ul>
			</td>-->
			<td>
        <p>设置 SELinux 类型的操作是被限制的，设置自定义的 SELinux 用户或角色选项是被禁止的。</p>
        <p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.type</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li>未定义/""</li>
					<li><code>container_t</code></li>
					<li><code>container_init_t</code></li>
					<li><code>container_kvm_t</code></li>
				</ul>
				<hr />
				<p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.seLinuxOptions.user</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.user</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.user</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.user</code></li>
					<li><code>spec.securityContext.seLinuxOptions.role</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.role</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.role</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.role</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li>未定义/""</li>
				</ul>
			</td>
		</tr>
		<tr>
			<!-- <td style="white-space: nowrap"><code>/proc</code> Mount Type</td> -->
			<td style="white-space: nowrap"><code>/proc</code> 挂载类型</td>
			<!-- <td>
				<p>The default <code>/proc</code> masks are set up to reduce attack surface, and should be required.</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.procMount</code></li>
					<li><code>spec.initContainers[*].securityContext.procMount</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.procMount</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>Default</code></li>
				</ul>
			</td> -->
			<td>
        <p>要求使用默认的 <code>/proc</code> 掩码以减小攻击面。</p>
				<p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.procMount</code></li>
					<li><code>spec.initContainers[*].securityContext.procMount</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.procMount</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li>未定义/nil</li>
					<li><code>Default</code></li>
				</ul>
			</td>
		</tr>
    <tr>
  			<td>Seccomp</td>
  			<!-- <td>
  				<p>Seccomp profile must not be explicitly set to <code>Unconfined</code>.</p>
  				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
  			</td> -->
        <td>
  				<p>Seccomp Profile 禁止被显式设置为 <code>Unconfined</code>。</p>
  				<p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li>未定义/nil</li>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
  			</td>
  		</tr>
		<tr>
			<td>Sysctls</td>
			<!-- <td>
				<p>Sysctls can disable security mechanisms or affect all containers on a host, and should be disallowed except for an allowed "safe" subset. A sysctl is considered safe if it is namespaced in the container or the Pod, and it is isolated from other Pods or processes on the same Node.</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.securityContext.sysctls[*].name</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>kernel.shm_rmid_forced</code></li>
					<li><code>net.ipv4.ip_local_port_range</code></li>
					<li><code>net.ipv4.ip_unprivileged_port_start</code></li>
					<li><code>net.ipv4.tcp_syncookies</code></li>
					<li><code>net.ipv4.ping_group_range</code></li>
				</ul>
			</td> -->
			<td>
        <p>Sysctls 可以禁用安全机制或影响宿主上所有容器，因此除了若干“安全”的子集之外，应该被禁止。
				如果某 sysctl 是受容器或 Pod 的名字空间限制，且与节点上其他 Pod 或进程相隔离，可认为是安全的。</p>
				<p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.sysctls[*].name</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li>未定义/nil</li>
					<li><code>kernel.shm_rmid_forced</code></li>
					<li><code>net.ipv4.ip_local_port_range</code></li>
					<li><code>net.ipv4.ip_unprivileged_port_start</code></li>
					<li><code>net.ipv4.tcp_syncookies</code></li>
					<li><code>net.ipv4.ping_group_range</code></li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>

### Restricted

<!--
**The _Restricted_ policy is aimed at enforcing current Pod hardening best practices, at the
expense of some compatibility.** It is targeted at operators and developers of security-critical
applications, as well as lower-trust users. The following listed controls should be
enforced/disallowed:

In this table, wildcards (`*`) indicate all elements in a list. For example, 
`spec.containers[*].securityContext` refers to the Security Context object for _all defined
containers_. If any of the listed containers fails to meet the requirements, the entire pod will
fail validation.
-->
**_Restricted_ 策略旨在实施当前保护 Pod 的最佳实践，尽管这样作可能会牺牲一些兼容性。**
该类策略主要针对运维人员和安全性很重要的应用的开发人员，以及不太被信任的用户。
下面列举的控制需要被实施（禁止）：

{{< note >}}
在下述表格中，通配符（`*`）意味着一个列表中的所有元素。
例如 `spec.containers[*].securityContext` 表示 _所定义的所有容器_ 的安全性上下文对象。
如果所列出的任一容器不能满足要求，整个 Pod 将无法通过校验。
{{< /note >}}

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
      <!-- <td style="white-space: nowrap">Volume Types</td>
			<td>
				<p>In addition to restricting HostPath volumes, the restricted policy limits usage of non-core volume types to those defined through PersistentVolumes.</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.volumes[*]</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				Every item in the <code>spec.volumes[*]</code> list must set one of the following fields to a non-null value:
				<ul>
					<li><code>spec.volumes[*].configMap</code></li>
					<li><code>spec.volumes[*].csi</code></li>
					<li><code>spec.volumes[*].downwardAPI</code></li>
					<li><code>spec.volumes[*].emptyDir</code></li>
					<li><code>spec.volumes[*].ephemeral</code></li>
					<li><code>spec.volumes[*].persistentVolumeClaim</code></li>
					<li><code>spec.volumes[*].projected</code></li>
					<li><code>spec.volumes[*].secret</code></li>
				</ul>
			</td> -->
			<td>卷类型</td>
			<td>
        <p>除了限制 HostPath 卷之外，此类策略还限制可以通过 PersistentVolumes 定义的非核心卷类型。</p>
				<p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.volumes[*]</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<code>spec.volumes[*]</code> 列表中的每个条目必须将下面字段之一设置为非空值：
				<ul>
					<li><code>spec.volumes[*].configMap</code></li>
					<li><code>spec.volumes[*].csi</code></li>
					<li><code>spec.volumes[*].downwardAPI</code></li>
					<li><code>spec.volumes[*].emptyDir</code></li>
					<li><code>spec.volumes[*].ephemeral</code></li>
					<li><code>spec.volumes[*].persistentVolumeClaim</code></li>
					<li><code>spec.volumes[*].projected</code></li>
					<li><code>spec.volumes[*].secret</code></li>
				</ul>
			</td>
		</tr>
		<tr>
      <!-- <td style="white-space: nowrap">Privilege Escalation (v1.8+)</td>
			<td>
				<p>Privilege escalation (such as via set-user-ID or set-group-ID file mode) should not be allowed.</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.initContainers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.allowPrivilegeEscalation</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li><code>false</code></li>
				</ul>
			</td> -->
			<td style="white-space: nowrap">特权提升（v1.8+）</td>
			<td>
        <p>禁止（通过 SetUID 或 SetGID 文件模式）获得特权提升。</p>
				<br>
				<p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.initContainers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.allowPrivilegeEscalation</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
      <!-- <td style="white-space: nowrap">Running as Non-root</td> -->
			<td style="white-space: nowrap">以非 root 账号运行 </td>
      <!-- <td>
				<p>Containers must be required to run as non-root users.</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsNonRoot</code></li>
					<li><code>spec.containers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsNonRoot</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li><code>true</code></li>
				</ul>
				<small>
					The container fields may be undefined/<code>nil</code> if the pod-level
					<code>spec.securityContext.runAsNonRoot</code> is set to <code>true</code>.
				</small>
			</td> -->
			<td>
        <p>必须要求容器以非 root 用户运行。</p>
				<p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsNonRoot</code></li>
					<li><code>spec.containers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsNonRoot</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li><code>true</code></li>
				</ul>
				<small>
					如果 Pod 级别 <code>spec.securityContext.runAsNonRoot</code> 设置为 
          <code>true</code>，则允许容器组的安全上下文字段设置为 未定义/<code>nil</code>。
				</small>
			</td>
		</tr>
		<tr>
			<!-- <td style="white-space: nowrap">Running as Non-root user (v1.23+)</td> -->
			<td style="white-space: nowrap">非 root 用户（v1.23+）</td>
			<td>
				<!--
				<p>Containers must not set <tt>runAsUser</tt> to 0</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsUser</code></li>
					<li><code>spec.containers[*].securityContext.runAsUser</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsUser</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsUser</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>any non-zero value</li>
					<li><code>undefined/null</code></li>
				</ul>
			</td> -->
				<p>Containers 不可以将 <tt>runAsUser</tt> 设置为 0</p>
				<p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsUser</code></li>
					<li><code>spec.containers[*].securityContext.runAsUser</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsUser</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsUser</code></li>
				</ul>
				<p><strong>允许的字段</strong></p>
				<ul>
					<li>any non-zero value</li>
					<li><code>未定义/空值</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Seccomp (v1.19+)</td>
			<td>
				<!-- <td>
  				<p>Seccomp profile must be explicitly set to one of the allowed values. Both the <code>Unconfined</code> profile and the <em>absence</em> of a profile are prohibited.</p>
  				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
				<small>
					The container fields may be undefined/<code>nil</code> if the pod-level
					<code>spec.securityContext.seccompProfile.type</code> field is set appropriately.
					Conversely, the pod-level field may be undefined/<code>nil</code> if _all_ container-
					level fields are set.
				</small>
  			</td> -->
        <p>Seccomp Profile 必须被显式设置成一个允许的值。禁止使用 <code>Unconfined</code> 
        Profile 或者指定 <em>不存在的</em> Profile。</p>
				<p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
				<small>
					如果 Pod 级别的 <code>spec.securityContext.seccompProfile.type</code> 
          已设置得当，容器级别的安全上下文字段可以为 未定义/<code>nil</code>。
          反过来说，如果 _所有的_ 容器级别的安全上下文字段已设置，则 Pod 级别的字段可为 未定义/<code>nil</code>。 
				</small>
			</td>
		</tr>
    <tr>
			<!-- <td style="white-space: nowrap">Capabilities (v1.22+)</td> -->
      <td style="white-space: nowrap">权能（v1.22+）</td>
      <!-- <td>
				<p>
					Containers must drop <code>ALL</code> capabilities, and are only permitted to add back
					the <code>NET_BIND_SERVICE</code> capability.
				</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.drop</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Any list of capabilities that includes <code>ALL</code></li>
				</ul>
				<hr />
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>NET_BIND_SERVICE</code></li>
				</ul>
			</td> -->
			<td>
        <p>
					容器组必须弃用 <code>ALL</code> 权能，并且只允许添加 <code>NET_BIND_SERVICE</code> 权能。
				</p>
        <p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.drop</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li>包含 <code>ALL</code> 的任何一种权能列表。</li>
				</ul>
				<hr />
				<p><strong>限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong>允许的值</strong></p>
				<ul>
					<li>未定义/nil</li>
					<li><code>NET_BIND_SERVICE</code></li>
				</ul>
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

[**Pod 安全性准入控制器**](/zh/docs/concepts/security/pod-security-admission/)

- {{< example file="security/podsecurity-privileged.yaml" >}}Privileged 名字空间{{< /example >}}
- {{< example file="security/podsecurity-baseline.yaml" >}}Baseline 名字空间{{< /example >}}
- {{< example file="security/podsecurity-restricted.yaml" >}}Restricted 名字空间{{< /example >}}

[**PodSecurityPolicy**](/zh/docs/concepts/security/pod-security-policy/) （已弃用）

- {{< example file="policy/privileged-psp.yaml" >}}Privileged{{< /example >}}
- {{< example file="policy/baseline-psp.yaml" >}}Baseline{{< /example >}}
- {{< example file="policy/restricted-psp.yaml" >}}Restricted{{< /example >}}

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
Security profiles are control plane mechanisms to enforce specific settings in the Security Context,
as well as other related parameters outside the Security Context. As of July 2021, 
[Pod Security Policies](/docs/concepts/profile/pod-security-profile/) are deprecated in favor of the
built-in [Pod Security Admission Controller](/docs/concepts/security/pod-security-admission/). 

Other alternatives for enforcing security profiles are being developed in the Kubernetes
ecosystem, such as: 
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper).
- [Kubewarden](https://github.com/kubewarden).
- [Kyverno](https://kyverno.io/policies/pod-security/).
-->
安全策略则是控制面用来对安全上下文以及安全性上下文之外的参数实施某种设置的机制。
在 2020 年 7 月，
[Pod 安全性策略](/zh/docs/concepts/security/pod-security-policy/)已被废弃，
取而代之的是内置的 [Pod 安全性准入控制器](/zh/docs/concepts/security/pod-security-admission/)。

Kubernetes 生态系统中还在开发一些其他的替代方案，例如
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)。
- [Kubewarden](https://github.com/kubewarden)。
- [Kyverno](https://kyverno.io/policies/pod-security/)。

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
If you apply the restricted profile for a Windows pod, this **may** have an impact on the pod
at runtime. The restricted profile requires enforcing Linux-specific restrictions (such as seccomp
profile, and disallowing privilege escalation). If the kubelet and / or its container runtime ignore
these Linux-specific values, then the Windows pod should still work normally within the restricted
profile. However, the lack of enforcement means that there is no additional restriction, for Pods
that use Windows containers, compared to the baseline profile.

The use of the HostProcess flag to create a HostProcess pod should only be done in alignment with the privileged policy. Creation of a Windows HostProcess pod is blocked under the baseline and restricted policies, so any HostProcess pod should be considered privileged.
-->

如果你为一个 Windows Pod 应用了 Restricted 策略，**可能会** 对该 Pod 的运行时产生影响。
Restricted 策略需要强制执行 Linux 特有的限制（如 seccomp Profile，并且禁止特权提升）。
如果 kubelet 和/或其容器运行时忽略了 Linux 特有的值，那么应该不影响 Windows Pod 正常工作。
然而，对于使用 Windows 容器的 Pod 来说，缺乏强制执行意味着相比于 Restricted 策略，没有任何额外的限制。

你应该只在 Privileged 策略下使用 HostProcess 标志来创建 HostProcess Pod。
在 Baseline 和 Restricted 策略下，创建 Windows HostProcess Pod 是被禁止的，
因此任何 HostProcess Pod 都应该被认为是有特权的。

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
