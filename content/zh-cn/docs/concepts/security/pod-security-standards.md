---
title: Pod 安全性标准
description: >
  详细了解 Pod 安全性标准（Pod Security Standard）中所定义的不同策略级别。
content_type: concept
weight: 15
---
<!--
reviewers:
- tallclair
title: Pod Security Standards
description: >
  A detailed look at the different policy levels defined in the Pod Security Standards.
content_type: concept
weight: 15
-->

<!-- overview -->

<!--
The Pod Security Standards define three different _policies_ to broadly cover the security
spectrum. These policies are _cumulative_ and range from highly-permissive to highly-restrictive.
This guide outlines the requirements of each policy.
-->
Pod 安全性标准定义了三种不同的**策略（Policy）**，以广泛覆盖安全应用场景。
这些策略是**叠加式的（Cumulative）**，安全级别从高度宽松至高度受限。
本指南概述了每个策略的要求。

<!--
| Profile | Description |
| ------ | ----------- |
| <strong style="white-space: nowrap">Privileged</strong> | Unrestricted policy, providing the widest possible level of permissions. This policy allows for known privilege escalations. |
| <strong style="white-space: nowrap">Baseline</strong> | Minimally restrictive policy which prevents known privilege escalations. Allows the default (minimally specified) Pod configuration. |
| <strong style="white-space: nowrap">Restricted</strong> | Heavily restricted policy, following current Pod hardening best practices. |
-->
| Profile | 描述 |
| ------ | ----------- |
| <strong style="white-space: nowrap">Privileged</strong> | 不受限制的策略，提供最大可能范围的权限许可。此策略允许已知的特权提升。 |
| <strong style="white-space: nowrap">Baseline</strong> | 限制性最弱的策略，禁止已知的特权提升。允许使用默认的（规定最少）Pod 配置。 |
| <strong style="white-space: nowrap">Restricted</strong> | 限制性非常强的策略，遵循当前的保护 Pod 的最佳实践。 |

<!-- body -->

<!--
## Profile Details
-->
## Profile 细节    {#profile-details}

### Privileged

<!--
**The _Privileged_ policy is purposely-open, and entirely unrestricted.** This type of policy is
typically aimed at system- and infrastructure-level workloads managed by privileged, trusted users.

The Privileged policy is defined by an absence of restrictions. If you define a Pod where the Privileged
security policy applies, the Pod you define is able to bypass typical container isolation mechanisms.
For example, you can define a Pod that has access to the node's host network.
-->
**_Privileged_ 策略是有目的地开放且完全无限制的策略。**
此类策略通常针对由特权较高、受信任的用户所管理的系统级或基础设施级负载。

Privileged 策略定义中限制较少。
如果你定义应用了 Privileged 安全策略的 Pod，你所定义的这个 Pod 能够绕过典型的容器隔离机制。
例如，你可以定义有权访问节点主机网络的 Pod。

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
例如 `spec.containers[*].securityContext` 表示**所定义的所有容器**的安全性上下文对象。
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
			<td style="white-space: nowrap">HostProcess</td>
			<td>
				<p>
				<!--
				Windows Pods offer the ability to run <a href="/docs/tasks/configure-pod-container/create-hostprocess-pod">HostProcess containers</a> which enables privileged access to the Windows host machine. Privileged access to the host is disallowed in the Baseline policy.
				-->
				Windows Pod 提供了运行
				<a href="/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod">HostProcess 容器</a>的能力，
				这使得对 Windows 宿主的特权访问成为可能。Baseline 策略中禁止对宿主的特权访问。
				{{< feature-state for_k8s_version="v1.26" state="stable" >}}
				</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.containers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.initContainers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.windowsOptions.hostProcess</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定义、nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><!--Host Namespaces-->宿主名字空间</td>
			<td>
				<p><!--Sharing the host namespaces must be disallowed.-->必须禁止共享宿主上的名字空间。</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.hostNetwork</code></li>
					<li><code>spec.hostPID</code></li>
					<li><code>spec.hostIPC</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定义、nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><!--Privileged Containers-->特权容器</td>
			<td>
				<p><!--Privileged Pods disable most security mechanisms and must be disallowed.-->特权 Pod 会使大多数安全性机制失效，必须被禁止。</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.privileged</code></li>
					<li><code>spec.initContainers[*].securityContext.privileged</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.privileged</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定义、nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><!--Capabilities-->权能</td>
			<td>
				<p><!--Adding additional capabilities beyond those listed below must be disallowed.-->必须禁止添加除下列字段之外的权能。</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定义、nil</li>
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
			<td style="white-space: nowrap"><!--HostPath Volumes-->HostPath 卷</td>
			<td>
				<p><!--HostPath volumes must be forbidden.-->必须禁止 HostPath 卷。</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.volumes[*].hostPath</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定义、nil</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><!--Host Ports-->宿主端口</td>
			<td>
				<p><!--HostPorts should be disallowed entirely (recommended) or restricted to a known list.-->应该完全禁止使用宿主端口（推荐）或者至少限制只能使用某确定列表中的端口。</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].ports[*].hostPort</code></li>
					<li><code>spec.initContainers[*].ports[*].hostPort</code></li>
					<li><code>spec.ephemeralContainers[*].ports[*].hostPort</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定义、nil</li>
					<li><!--Known list (not supported by the built-in <a href="/docs/concepts/security/pod-security-admission/">Pod Security Admission controller</a>)-->
					已知列表（不支持内置的 <a href="/zh-cn/docs/concepts/security/pod-security-admission/">Pod 安全性准入控制器</a> ）</li>
					<li><code>0</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">AppArmor</td>
			<td>
				<p>
				<!--
				On supported hosts, the <code>RuntimeDefault</code> AppArmor profile is applied by default. The baseline policy should prevent overriding or disabling the default AppArmor profile, or restrict overrides to an allowed set of profiles.
				-->
				在受支持的主机上，默认使用 <code>RuntimeDefault</code> AppArmor 配置。Baseline
				策略应避免覆盖或者禁用默认策略，以及限制覆盖一些配置集合的权限。
				</p>
        <p><strong><!--Restricted Fields-->限制的字段</strong></p>
        <ul>
              <li><code>spec.securityContext.appArmorProfile.type</code></li>
              <li><code>spec.containers[*].securityContext.appArmorProfile.type</code></li>
              <li><code>spec.initContainers[*].securityContext.appArmorProfile.type</code></li>
              <li><code>spec.ephemeralContainers[*].securityContext.appArmorProfile.type</code></li>
        </ul>
        <p><strong><!--Allowed Values-->准许的取值<</strong></p>
        <ul>
              <li>Undefined/nil</li>
              <li><code>RuntimeDefault</code></li>
              <li><code>Localhost</code></li>
        </ul>
        <hr />
				<ul>
					<li><code>metadata.annotations["container.apparmor.security.beta.kubernetes.io/*"]</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定义、nil</li>
					<li><code>runtime/default</code></li>
					<li><code>localhost/*</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">SELinux</td>
			<td>
				<p>
				<!--
				Setting the SELinux type is restricted, and setting a custom SELinux user or role option is forbidden.
				-->
				设置 SELinux 类型的操作是被限制的，设置自定义的 SELinux 用户或角色选项是被禁止的。
				</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.type</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><!--Undefined/""-->未定义、""</li>
					<li><code>container_t</code></li>
					<li><code>container_init_t</code></li>
					<li><code>container_kvm_t</code></li>
				</ul>
				<hr />
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
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
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><!--Undefined/""-->未定义、""</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><code>/proc</code><!--Mount Type-->挂载类型</td>
			<td>
				<p><!--The default <code>/proc</code> masks are set up to reduce attack surface, and should be required.-->要求使用默认的 <code>/proc</code> 掩码以减小攻击面。</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.procMount</code></li>
					<li><code>spec.initContainers[*].securityContext.procMount</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.procMount</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定义、nil</li>
					<li><code>Default</code></li>
				</ul>
			</td>
		</tr>
		<tr>
  			<td>Seccomp</td>
  			<td>
  				<p><!--Seccomp profile must not be explicitly set to <code>Unconfined</code>.-->Seccomp 配置必须不能显式设置为 <code>Unconfined</code>。</p>
  				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定义、nil</li>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
  			</td>
  		</tr>
		<tr>
			<td style="white-space: nowrap">Sysctls</td>
			<td>
				<p>
				<!--
				Sysctls can disable security mechanisms or affect all containers on a host, and should be disallowed except for an allowed "safe" subset. A sysctl is considered safe if it is namespaced in the container or the Pod, and it is isolated from other Pods or processes on the same Node.
				-->
				sysctl 可以禁用安全机制或影响宿主上所有容器，因此除了若干“安全”的允许子集之外，其他都应该被禁止。
				如果某 sysctl 是受容器或 Pod 的名字空间限制，且与节点上其他 Pod 或进程相隔离，可认为是安全的。
				</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.sysctls[*].name</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定义、nil</li>
					<li><code>kernel.shm_rmid_forced</code></li>
					<li><code>net.ipv4.ip_local_port_range</code></li>
					<li><code>net.ipv4.ip_unprivileged_port_start</code></li>
					<li><code>net.ipv4.tcp_syncookies</code></li>
					<li><code>net.ipv4.ping_group_range</code></li>
					<li><code>net.ipv4.ip_local_reserved_ports</code><!-- (since Kubernetes 1.27)-->（从 Kubernetes 1.27 开始）</li>
					<li><code>net.ipv4.tcp_keepalive_time</code><!-- (since Kubernetes 1.29)-->（从 Kubernetes 1.29 开始）</li>
					<li><code>net.ipv4.tcp_fin_timeout</code><!-- (since Kubernetes 1.29)-->（从 Kubernetes 1.29 开始）</li>
					<li><code>net.ipv4.tcp_keepalive_intvl</code><!-- (since Kubernetes 1.29)-->（从 Kubernetes 1.29 开始）</li>
					<li><code>net.ipv4.tcp_keepalive_probes</code><!-- (since Kubernetes 1.29)-->（从 Kubernetes 1.29 开始）</li>
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
-->
**_Restricted_ 策略旨在实施当前保护 Pod 的最佳实践，尽管这样作可能会牺牲一些兼容性。**
该类策略主要针对运维人员和安全性很重要的应用的开发人员，以及不太被信任的用户。
下面列举的控制需要被实施（禁止）：

{{< note >}}
<!--
In this table, wildcards (`*`) indicate all elements in a list. For example,
`spec.containers[*].securityContext` refers to the Security Context object for _all defined
containers_. If any of the listed containers fails to meet the requirements, the entire pod will
fail validation.
-->
在下述表格中，通配符（`*`）意味着一个列表中的所有元素。
例如 `spec.containers[*].securityContext` 表示**所定义的所有容器**的安全性上下文对象。
如果所列出的任一容器不能满足要求，整个 Pod 将无法通过校验。
{{< /note >}}

<table>
	<caption style="display:none"><!--Restricted policy specification-->Restricted 策略规范</caption>
	<tbody>
		<tr>
			<td width="30%"><strong><!--Control-->控制</strong></td>
			<td><strong><!--Policy-->策略</strong></td>
		</tr>
		<tr>
			<td colspan="2"><em><!--Everything from the Baseline policy-->Baseline 策略的所有要求</em></td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><!--Volume Types-->卷类型</td>
			<td>
				<p>
				  <!--
				  The Restricted policy only permits the following volume types.
				  -->
				  Restricted 策略仅允许以下卷类型。
				</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.volumes[*]</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<!--Every item in the <code>spec.volumes[*]</code> list must set one of the following fields to a non-null value:--><code>spec.volumes[*]</code> 列表中的每个条目必须将下面字段之一设置为非空值：
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
			<td style="white-space: nowrap"><!--Privilege Escalation (v1.8+)-->特权提升（v1.8+）</td>
			<td>
				<p><!--Privilege escalation (such as via set-user-ID or set-group-ID file mode) should not be allowed. <em><a href="#os-specific-policy-controls">This is Linux only policy</a> in v1.25+ <code>(spec.os.name != windows)</code></em>-->禁止（通过 SetUID 或 SetGID 文件模式）获得特权提升。<em><a href="#policies-specific-to-linux">这是 v1.25+ 中仅针对 Linux 的策略</a> <code>(spec.os.name != windows)</code></em></p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.initContainers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.allowPrivilegeEscalation</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><!--Running as Non-root-->以非 root 账号运行</td>
			<td>
				<p><!--Containers must be required to run as non-root users.-->容器必须以非 root 账号运行。</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsNonRoot</code></li>
					<li><code>spec.containers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsNonRoot</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><code>true</code></li>
				</ul>
				<small>
					<!--The container fields may be undefined/<code>nil</code> if the pod-level
					<code>spec.securityContext.runAsNonRoot</code> is set to <code>true</code>.-->如果 Pod 级别 <code>spec.securityContext.runAsNonRoot</code> 设置为 <code>true</code>，则允许容器组的安全上下文字段设置为 未定义/<code>nil</code>。
				</small>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><!--Running as Non-root user (v1.23+)-->非 root 用户（v1.23+）</td>
			<td>
				<p><!--Containers must not set <tt>runAsUser</tt> to 0-->容器不可以将 <tt>runAsUser</tt> 设置为 0</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsUser</code></li>
          <li><code>spec.containers[*].securityContext.runAsUser</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsUser</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsUser</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><!--any non-zero value-->所有的非零值</li>
					<li><code>undefined/null</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Seccomp (v1.19+)</td>
			<td>
  				<p><!--Seccomp profile must be explicitly set to one of the allowed values. Both the <code>Unconfined</code> profile and the <em>absence</em> of a profile are prohibited. <em><a href="#os-specific-policy-controls">This is Linux only policy</a> in v1.25+ <code>(spec.os.name != windows)</code></em>-->Seccomp Profile 必须被显式设置成一个允许的值。禁止使用 <code>Unconfined</code> Profile 或者指定 <em>不存在的</em> Profile。<em><a href="#policies-specific-to-linux">这是 v1.25+ 中仅针对 Linux 的策略</a> <code>(spec.os.name != windows)</code></em></p>
  				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
				<small>
					<!--
          The container fields may be undefined/<code>nil</code> if the pod-level
					<code>spec.securityContext.seccompProfile.type</code> field is set appropriately.
					Conversely, the pod-level field may be undefined/<code>nil</code> if _all_ container-
					level fields are set.
          -->
          如果 Pod 级别的 <code>spec.securityContext.seccompProfile.type</code>
          已设置得当，容器级别的安全上下文字段可以为未定义/<code>nil</code>。
          反之如果 <bold>所有的</bold> 容器级别的安全上下文字段已设置，
          则 Pod 级别的字段可为 未定义/<code>nil</code>。
				</small>
  			</td>
  		</tr>
		  <tr>
			<td style="white-space: nowrap"><!--Capabilities (v1.22+) -->权能（v1.22+）</td>
			<td>
				<p>
					<!--
					Containers must drop <code>ALL</code> capabilities, and are only permitted to add back
					the <code>NET_BIND_SERVICE</code> capability. <em><a href="#os-specific-policy-controls">This is Linux only policy</a> in v1.25+ <code>(.spec.os.name != "windows")</code></em>
          -->
          容器必须弃用 <code>ALL</code> 权能，并且只允许添加
          <code>NET_BIND_SERVICE</code> 权能。<em><a href="#policies-specific-to-linux">这是 v1.25+ 中仅针对 Linux 的策略</a> <code>(.spec.os.name != "windows")</code></em>
				</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.drop</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><!--Any list of capabilities that includes <code>ALL</code>-->包括 <code>ALL</code> 在内的任意权能列表。</li>
				</ul>
				<hr />
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准许的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定义、nil</li>
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

<!--
[**Pod Security Admission Controller**](/docs/concepts/security/pod-security-admission/)
-->
[**Pod 安全性准入控制器**](/zh-cn/docs/concepts/security/pod-security-admission/)

- {{< example file="security/podsecurity-privileged.yaml" >}}Privileged 名字空间{{< /example >}}
- {{< example file="security/podsecurity-baseline.yaml" >}}Baseline 名字空间{{< /example >}}
- {{< example file="security/podsecurity-restricted.yaml" >}}Restricted 名字空间{{< /example >}}

<!--
### Alternatives
-->
### 替代方案   {#alternatives}

{{% thirdparty-content %}}

<!--
Other alternatives for enforcing policies are being developed in the Kubernetes ecosystem, such as:
-->
在 Kubernetes 生态系统中还在开发一些其他的替代方案，例如：

- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io/policies/pod-security/)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)

<!--
## Pod OS field

Kubernetes lets you use nodes that run either Linux or Windows. You can mix both kinds of
node in one cluster.
Windows in Kubernetes has some limitations and differentiators from Linux-based
workloads. Specifically, many of the Pod `securityContext` fields
[have no effect on Windows](/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext).
-->
## Pod OS 字段   {#pod-os-field}

Kubernetes 允许你使用运行 Linux 或 Windows 的节点。你可以在一个集群中混用两种类型的节点。
Kubernetes 中的 Windows 与基于 Linux 的工作负载相比有一些限制和差异。
具体而言，许多 Pod `securityContext`
字段[在 Windows 上不起作用](/zh-cn/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext)。


{{< note >}}
<!--
Kubelets prior to v1.24 don't enforce the pod OS field, and if a cluster has nodes on versions earlier than v1.24 the Restricted policies should be pinned to a version prior to v1.25.
-->
v1.24 之前的 kubelet 不强制处理 Pod OS 字段，如果集群中有些节点运行早于 v1.24 的版本，
则应将 Restricted 策略锁定到 v1.25 之前的版本。
{{< /note >}}

<!--
### Restricted Pod Security Standard changes
Another important change, made in Kubernetes v1.25 is that the  _Restricted_ policy
has been updated to use the `pod.spec.os.name` field. Based on the OS name, certain policies that are specific
to a particular OS can be relaxed for the other OS.
-->
### 限制性的 Pod Security Standard 变更   {#restricted-pod-security-standard-changes}

Kubernetes v1.25 中的另一个重要变化是 _Restricted_ 策略已更新，
能够处理 `pod.spec.os.name` 字段。根据 OS 名称，专用于特定 OS 的某些策略对其他 OS 可以放宽限制。

<!--
#### OS-specific policy controls

Restrictions on the following controls are only required if `.spec.os.name` is not `windows`:
- Privilege Escalation
- Seccomp
- Linux Capabilities
-->
#### OS 特定的策略控制

仅当 `.spec.os.name` 不是 `windows` 时，才需要对以下控制进行限制：

- 特权提升
- Seccomp
- Linux 权能

<!--
## User namespaces

User Namespaces are a Linux-only feature to run workloads with increased
isolation. How they work together with Pod Security Standards is described in
the [documentation](/docs/concepts/workloads/pods/user-namespaces#integration-with-pod-security-admission-checks) for Pods that use user namespaces.
-->
## 用户命名空间    {#user-namespaces}

用户命名空间是 Linux 特有的功能，可在运行工作负载时提高隔离度。
关于用户命名空间如何与 PodSecurityStandard 协同工作，
请参阅[文档](/zh-cn/docs/concepts/workloads/pods/user-namespaces#integration-with-pod-security-admission-checks)了解
Pod 如何使用用户命名空间。

<!--
## FAQ

### Why isn't there a profile between Privileged and Baseline?
-->
## 常见问题    {#faq}

### 为什么不存在介于 Privileged 和 Baseline 之间的策略类型   {#why-isnt-there-a-profile-between-privileged-and-baseline}

<!--
The three profiles defined here have a clear linear progression from most secure (Restricted) to least
secure (Privileged), and cover a broad set of workloads. Privileges required above the Baseline
policy are typically very application specific, so we do not offer a standard profile in this
niche. This is not to say that the privileged profile should always be used in this case, but that
policies in this space need to be defined on a case-by-case basis.

SIG Auth may reconsider this position in the future, should a clear need for other profiles arise.
-->
这里定义的三种策略框架有一个明晰的线性递进关系，从最安全（Restricted）到最不安全（Privileged），
并且覆盖了很大范围的工作负载。特权要求超出 Baseline 策略，这通常是特定于应用的需求，
所以我们没有在这个范围内提供标准框架。这并不意味着在这样的情形下仍然只能使用 Privileged 框架，
只是说处于这个范围的策略需要因地制宜地定义。

SIG Auth 可能会在将来考虑这个范围的框架，前提是有对其他框架的需求。

<!--
### What's the difference between a security profile and a security context?

[Security Contexts](/docs/tasks/configure-pod-container/security-context/) configure Pods and
Containers at runtime. Security contexts are defined as part of the Pod and container specifications
in the Pod manifest, and represent parameters to the container runtime.
-->
### 安全配置与安全上下文的区别是什么？   {#whats-the-difference-between-security-profile-and-security-context}

[安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/)在运行时配置 Pod
和容器。安全上下文是在 Pod 清单中作为 Pod 和容器规约的一部分来定义的，
所代表的是传递给容器运行时的参数。

<!--
Security profiles are control plane mechanisms to enforce specific settings in the Security Context,
as well as other related parameters outside the Security Context. As of July 2021,
[Pod Security Policies](/docs/concepts/security/pod-security-policy/) are deprecated in favor of the
built-in [Pod Security Admission Controller](/docs/concepts/security/pod-security-admission/).
-->
安全策略则是控制面用来对安全上下文以及安全性上下文之外的参数实施某种设置的机制。
在 2021 年 7 月，
[Pod 安全性策略](/zh-cn/docs/concepts/security/pod-security-policy/)已被废弃，
取而代之的是内置的 [Pod 安全性准入控制器](/zh-cn/docs/concepts/security/pod-security-admission/)。

<!--
### What about sandboxed Pods?

There is not currently an API standard that controls whether a Pod is considered sandboxed or
not. Sandbox Pods may be identified by the use of a sandboxed runtime (such as gVisor or Kata
Containers), but there is no standard definition of what a sandboxed runtime is.
-->
### 沙箱（Sandboxed）Pod 怎么处理？  {#what-about-sandboxed-pods}

现在还没有 API 标准来控制 Pod 是否被视作沙箱化 Pod。
沙箱 Pod 可以通过其是否使用沙箱化运行时（如 gVisor 或 Kata Container）来辨别，
不过目前还没有关于什么是沙箱化运行时的标准定义。

<!--
The protections necessary for sandboxed workloads can differ from others. For example, the need to
restrict privileged permissions is lessened when the workload is isolated from the underlying
kernel. This allows for workloads requiring heightened permissions to still be isolated.

Additionally, the protection of sandboxed workloads is highly dependent on the method of
sandboxing. As such, no single recommended profile is recommended for all sandboxed workloads.
-->
沙箱化负载所需要的保护可能彼此各不相同。例如，当负载与下层内核直接隔离开来时，
限制特权化操作的许可就不那么重要。这使得那些需要更多许可权限的负载仍能被有效隔离。

此外，沙箱化负载的保护高度依赖于沙箱化的实现方法。
因此，现在还没有针对所有沙箱化负载的建议配置。
