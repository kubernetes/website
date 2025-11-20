---
title: Pod 安全性標準
description: >
  詳細瞭解 Pod 安全性標準（Pod Security Standard）中所定義的不同策略級別。
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
Pod 安全性標準定義了三種不同的**策略（Policy）**，以廣泛覆蓋安全應用場景。
這些策略是**疊加式的（Cumulative）**，安全級別從高度寬鬆至高度受限。
本指南概述了每個策略的要求。

<!--
| Profile | Description |
| ------ | ----------- |
| <strong style="white-space: nowrap">Privileged</strong> | Unrestricted policy, providing the widest possible level of permissions. This policy allows for known privilege escalations. |
| <strong style="white-space: nowrap">Baseline</strong> | Minimally restrictive policy which prevents known privilege escalations. Allows the default (minimally specified) Pod configuration. |
| <strong style="white-space: nowrap">Restricted</strong> | Heavily restricted policy, following current Pod hardening best practices. |
-->
| Profile | 描述 |
| ------ | ----------- |
| <strong style="white-space: nowrap">Privileged</strong> | 不受限制的策略，提供最大可能範圍的權限許可。此策略允許已知的特權提升。 |
| <strong style="white-space: nowrap">Baseline</strong> | 限制性最弱的策略，禁止已知的特權提升。允許使用預設的（規定最少）Pod 設定。 |
| <strong style="white-space: nowrap">Restricted</strong> | 限制性非常強的策略，遵循當前的保護 Pod 的最佳實踐。 |

<!-- body -->

<!--
## Profile Details
-->
## Profile 細節    {#profile-details}

### Privileged

<!--
**The _Privileged_ policy is purposely-open, and entirely unrestricted.** This type of policy is
typically aimed at system- and infrastructure-level workloads managed by privileged, trusted users.

The Privileged policy is defined by an absence of restrictions. If you define a Pod where the Privileged
security policy applies, the Pod you define is able to bypass typical container isolation mechanisms.
For example, you can define a Pod that has access to the node's host network.
-->
**_Privileged_ 策略是有目的地開放且完全無限制的策略。**
此類策略通常針對由特權較高、受信任的使用者所管理的系統級或基礎設施級負載。

Privileged 策略定義中限制較少。
如果你定義應用了 Privileged 安全策略的 Pod，你所定義的這個 Pod 能夠繞過典型的容器隔離機制。
例如，你可以定義有權訪問節點主機網路的 Pod。

### Baseline

<!--
**The _Baseline_ policy is aimed at ease of adoption for common containerized workloads while
preventing known privilege escalations.** This policy is targeted at application operators and
developers of non-critical applications. The following listed controls should be
enforced/disallowed:
-->
**_Baseline_ 策略的目標是便於常見的容器化應用採用，同時禁止已知的特權提升。**
此策略針對的是應用運維人員和非關鍵性應用的開發人員。
下面列舉的控制應該被實施（禁止）：

{{< note >}}
<!--
In this table, wildcards (`*`) indicate all elements in a list. For example,
`spec.containers[*].securityContext` refers to the Security Context object for _all defined
containers_. If any of the listed containers fails to meet the requirements, the entire pod will
fail validation.
-->
在下述表格中，通配符（`*`）意味着一個列表中的所有元素。
例如 `spec.containers[*].securityContext` 表示**所定義的所有容器**的安全性上下文對象。
如果所列出的任一容器不能滿足要求，整個 Pod 將無法通過校驗。
{{< /note >}}

<table>
	<!-- caption style="display:none">Baseline policy specification</caption -->
	<caption style="display:none">Baseline 策略規範</caption>
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
				Windows Pod 提供了運行
				<a href="/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod">HostProcess 容器</a>的能力，
				這使得對 Windows 宿主的特權訪問成爲可能。Baseline 策略中禁止對宿主的特權訪問。
				{{< feature-state for_k8s_version="v1.26" state="stable" >}}
				</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.containers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.initContainers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.windowsOptions.hostProcess</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定義、nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><!--Host Namespaces-->宿主名字空間</td>
			<td>
				<p><!--Sharing the host namespaces must be disallowed.-->必須禁止共享宿主上的名字空間。</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.hostNetwork</code></li>
					<li><code>spec.hostPID</code></li>
					<li><code>spec.hostIPC</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定義、nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><!--Privileged Containers-->特權容器</td>
			<td>
				<p>
				<!--
				Privileged Pods disable most security mechanisms and must be disallowed.
				-->
				特權 Pod 會使大多數安全性機制失效，必須被禁止。
				</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.privileged</code></li>
					<li><code>spec.initContainers[*].securityContext.privileged</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.privileged</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定義、nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><!--Capabilities-->權能</td>
			<td>
				<p>
				<!--
				Adding additional capabilities beyond those listed below must be disallowed.
				-->
				必須禁止添加除下列字段之外的權能。
				</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定義、nil</li>
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
				<p><!--HostPath volumes must be forbidden.-->必須禁止 HostPath 卷。</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.volumes[*].hostPath</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定義、nil</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><!--Host Ports-->宿主端口</td>
			<td>
				<p>
				<!--
				HostPorts should be disallowed entirely (recommended) or restricted to a known list.
				-->
				應該完全禁止使用宿主端口（推薦）或者至少限制只能使用某確定列表中的端口。
				</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].ports[*].hostPort</code></li>
					<li><code>spec.initContainers[*].ports[*].hostPort</code></li>
					<li><code>spec.ephemeralContainers[*].ports[*].hostPort</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定義、nil</li>
					<li><!--Known list (not supported by the built-in <a href="/docs/concepts/security/pod-security-admission/">Pod Security Admission controller</a>)-->
					已知列表（不支持內置的 <a href="/zh-cn/docs/concepts/security/pod-security-admission/">Pod 安全性准入控制器</a> ）</li>
					<li><code>0</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>
			<!--
			Host Probes / Lifecycle Hooks (v1.34+)
			-->
			主機探針/生命週期回調（v1.34+）
			</td>
			<td>
				<p>
				<!--
				The Host field in probes and lifecycle hooks must be disallowed.
				-->
				探針和生命週期回調中的 Host 字段必須被禁止使用。
				</p>
				<p><strong>
				<!--
				Restricted Fields
				-->
				限制的字段
				</strong></p>
				<ul>
					<li><code>spec.containers[*].livenessProbe.httpGet.host</code></li>
					<li><code>spec.containers[*].readinessProbe.httpGet.host</code></li>
					<li><code>spec.containers[*].startupProbe.httpGet.host</code></li>
					<li><code>spec.containers[*].livenessProbe.tcpSocket.host</code></li>
					<li><code>spec.containers[*].readinessProbe.tcpSocket.host</code></li>
					<li><code>spec.containers[*].startupProbe.tcpSocket.host</code></li>
					<li><code>spec.containers[*].lifecycle.postStart.tcpSocket.host</code>
					<li><code>spec.containers[*].lifecycle.preStop.tcpSocket.host</code>
					<li><code>spec.containers[*].lifecycle.postStart.httpGet.host</code></li>
					<li><code>spec.containers[*].lifecycle.preStop.httpGet.host</code></li>
					<li><code>spec.initContainers[*].livenessProbe.httpGet.host</code></li>
					<li><code>spec.initContainers[*].readinessProbe.httpGet.host</code></li>
					<li><code>spec.initContainers[*].startupProbe.httpGet.host</code></li>
					<li><code>spec.initContainers[*].livenessProbe.tcpSocket.host</code></li>
					<li><code>spec.initContainers[*].readinessProbe.tcpSocket.host</code></li>
					<li><code>spec.initContainers[*].startupProbe.tcpSocket.host</code></li>
					<li><code>spec.initContainers[*].lifecycle.postStart.tcpSocket.host</code>
					<li><code>spec.initContainers[*].lifecycle.preStop.tcpSocket.host</code>
					<li><code>spec.initContainers[*].lifecycle.postStart.httpGet.host</code></li>
					<li><code>spec.initContainers[*].lifecycle.preStop.httpGet.host</code></li>
				</ul>
				<p><strong>
				<!--
				Allowed Values
				-->
				准許的取值
				</strong></p>
				<ul>
					<li>
					<!--
					Undefined/nil
					-->
					未定義、nil
					</li>
					<li>""</li>
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
				在受支持的主機上，預設使用 <code>RuntimeDefault</code> AppArmor 設定。Baseline
				策略應避免覆蓋或者禁用預設策略，以及限制覆蓋一些設定集合的權限。
				</p>
        <p><strong><!--Restricted Fields-->限制的字段</strong></p>
        <ul>
              <li><code>spec.securityContext.appArmorProfile.type</code></li>
              <li><code>spec.containers[*].securityContext.appArmorProfile.type</code></li>
              <li><code>spec.initContainers[*].securityContext.appArmorProfile.type</code></li>
              <li><code>spec.ephemeralContainers[*].securityContext.appArmorProfile.type</code></li>
        </ul>
        <p><strong><!--Allowed Values-->准許的取值<</strong></p>
        <ul>
              <li><!--Undefined/nil-->未定義、nil</li>
              <li><code>RuntimeDefault</code></li>
              <li><code>Localhost</code></li>
        </ul>
        <hr />
				<ul>
					<li><code>metadata.annotations["container.apparmor.security.beta.kubernetes.io/*"]</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定義、nil</li>
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
				設置 SELinux 類型的操作是被限制的，設置自定義的 SELinux 使用者或角色選項是被禁止的。
				</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.type</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><!--Undefined/""-->未定義、""</li>
					<li><code>container_t</code></li>
					<li><code>container_init_t</code></li>
					<li><code>container_kvm_t</code></li>
          <li><code>container_engine_t</code> <!--(since Kubernetes 1.31)-->（自從 Kubernetes 1.31）</li>
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
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><!--Undefined/""-->未定義、""</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><code>/proc</code><!--Mount Type-->掛載類型</td>
			<td>
				<p>
				<!--
				The default <code>/proc</code> masks are set up to reduce attack surface, and should be required.
				-->
				要求使用預設的 <code>/proc</code> 掩碼以減小攻擊面。
				</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.procMount</code></li>
					<li><code>spec.initContainers[*].securityContext.procMount</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.procMount</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定義、nil</li>
					<li><code>Default</code></li>
				</ul>
			</td>
		</tr>
		<tr>
  			<td>Seccomp</td>
  			<td>
  				<p>
				<!--
				Seccomp profile must not be explicitly set to <code>Unconfined</code>.
				-->
				Seccomp 設定必須不能顯式設置爲 <code>Unconfined</code>。
				</p>
  				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定義、nil</li>
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
				sysctl 可以禁用安全機制或影響宿主上所有容器，因此除了若干“安全”的允許子集之外，其他都應該被禁止。
				如果某 sysctl 是受容器或 Pod 的名字空間限制，且與節點上其他 Pod 或進程相隔離，可認爲是安全的。
				</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.sysctls[*].name</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定義、nil</li>
					<li><code>kernel.shm_rmid_forced</code></li>
					<li><code>net.ipv4.ip_local_port_range</code></li>
					<li><code>net.ipv4.ip_unprivileged_port_start</code></li>
					<li><code>net.ipv4.tcp_syncookies</code></li>
					<li><code>net.ipv4.ping_group_range</code></li>
					<li><code>net.ipv4.ip_local_reserved_ports</code><!-- (since Kubernetes 1.27)-->（從 Kubernetes 1.27 開始）</li>
					<li><code>net.ipv4.tcp_keepalive_time</code><!-- (since Kubernetes 1.29)-->（從 Kubernetes 1.29 開始）</li>
					<li><code>net.ipv4.tcp_fin_timeout</code><!-- (since Kubernetes 1.29)-->（從 Kubernetes 1.29 開始）</li>
					<li><code>net.ipv4.tcp_keepalive_intvl</code><!-- (since Kubernetes 1.29)-->（從 Kubernetes 1.29 開始）</li>
					<li><code>net.ipv4.tcp_keepalive_probes</code><!-- (since Kubernetes 1.29)-->（從 Kubernetes 1.29 開始）</li>
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
**_Restricted_ 策略旨在實施當前保護 Pod 的最佳實踐，儘管這樣作可能會犧牲一些兼容性。**
該類策略主要針對運維人員和安全性很重要的應用的開發人員，以及不太被信任的使用者。
下面列舉的控制需要被實施（禁止）：

{{< note >}}
<!--
In this table, wildcards (`*`) indicate all elements in a list. For example,
`spec.containers[*].securityContext` refers to the Security Context object for _all defined
containers_. If any of the listed containers fails to meet the requirements, the entire pod will
fail validation.
-->
在下述表格中，通配符（`*`）意味着一個列表中的所有元素。
例如 `spec.containers[*].securityContext` 表示**所定義的所有容器**的安全性上下文對象。
如果所列出的任一容器不能滿足要求，整個 Pod 將無法通過校驗。
{{< /note >}}

<table>
	<caption style="display:none"><!--Restricted policy specification-->Restricted 策略規範</caption>
	<tbody>
		<tr>
			<td width="30%"><strong><!--Control-->控制</strong></td>
			<td><strong><!--Policy-->策略</strong></td>
		</tr>
		<tr>
			<td colspan="2"><em><!--Everything from the Baseline policy-->Baseline 策略的所有要求</em></td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><!--Volume Types-->卷類型</td>
			<td>
				<p>
				  <!--
				  The Restricted policy only permits the following volume types.
				  -->
				  Restricted 策略僅允許以下卷類型。
				</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.volumes[*]</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<!--Every item in the <code>spec.volumes[*]</code> list must set one of the following fields to a non-null value:--><code>spec.volumes[*]</code> 列表中的每個條目必須將下面字段之一設置爲非空值：
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
			<td style="white-space: nowrap"><!--Privilege Escalation (v1.8+)-->特權提升（v1.8+）</td>
			<td>
				<p><!--Privilege escalation (such as via set-user-ID or set-group-ID file mode) should not be allowed. <em><a href="#os-specific-policy-controls">This is Linux only policy</a> in v1.25+ <code>(spec.os.name != windows)</code></em>-->禁止（通過 SetUID 或 SetGID 檔案模式）獲得特權提升。<em><a href="#policies-specific-to-linux">這是 v1.25+ 中僅針對 Linux 的策略</a> <code>(spec.os.name != windows)</code></em></p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.initContainers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.allowPrivilegeEscalation</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><!--Running as Non-root-->以非 root 賬號運行</td>
			<td>
				<p><!--Containers must be required to run as non-root users.-->容器必須以非 root 賬號運行。</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsNonRoot</code></li>
					<li><code>spec.containers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsNonRoot</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><code>true</code></li>
				</ul>
				<small>
					<!--
					The container fields may be undefined/<code>nil</code> if the pod-level
					<code>spec.securityContext.runAsNonRoot</code> is set to <code>true</code>.
					-->
					如果 Pod 級別 <code>spec.securityContext.runAsNonRoot</code> 設置爲 <code>true</code>，
					則允許容器組的安全上下文字段設置爲未定義/<code>nil</code>。
				</small>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><!--Running as Non-root user (v1.23+)-->非 root 使用者（v1.23+）</td>
			<td>
				<p><!--Containers must not set <tt>runAsUser</tt> to 0-->容器不可以將 <tt>runAsUser</tt> 設置爲 0</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsUser</code></li>
          <li><code>spec.containers[*].securityContext.runAsUser</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsUser</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsUser</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><!--any non-zero value-->所有的非零值</li>
					<li><code>undefined/null</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Seccomp (v1.19+)</td>
			<td>
  				<p><!--Seccomp profile must be explicitly set to one of the allowed values. Both the <code>Unconfined</code> profile and the <em>absence</em> of a profile are prohibited. <em><a href="#os-specific-policy-controls">This is Linux only policy</a> in v1.25+ <code>(spec.os.name != windows)</code></em>-->Seccomp Profile 必須被顯式設置成一個允許的值。禁止使用 <code>Unconfined</code> Profile 或者指定 <em>不存在的</em> Profile。<em><a href="#policies-specific-to-linux">這是 v1.25+ 中僅針對 Linux 的策略</a> <code>(spec.os.name != windows)</code></em></p>
  				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
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
          如果 Pod 級別的 <code>spec.securityContext.seccompProfile.type</code>
          已設置得當，容器級別的安全上下文字段可以爲未定義/<code>nil</code>。
          反之如果 <bold>所有的</bold> 容器級別的安全上下文字段已設置，
          則 Pod 級別的字段可爲 未定義/<code>nil</code>。
				</small>
  			</td>
  		</tr>
		  <tr>
			<td style="white-space: nowrap"><!--Capabilities (v1.22+) -->權能（v1.22+）</td>
			<td>
				<p>
					<!--
					Containers must drop <code>ALL</code> capabilities, and are only permitted to add back
					the <code>NET_BIND_SERVICE</code> capability. <em><a href="#os-specific-policy-controls">This is Linux only policy</a> in v1.25+ <code>(.spec.os.name != "windows")</code></em>
          -->
          容器必須棄用 <code>ALL</code> 權能，並且只允許添加
          <code>NET_BIND_SERVICE</code> 權能。<em><a href="#policies-specific-to-linux">這是
          v1.25+ 中僅針對 Linux 的策略</a> <code>(.spec.os.name != "windows")</code></em>。
				</p>
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.drop</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><!--Any list of capabilities that includes <code>ALL</code>-->包括 <code>ALL</code> 在內的任意權能列表。</li>
				</ul>
				<hr />
				<p><strong><!--Restricted Fields-->限制的字段</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong><!--Allowed Values-->准許的取值</strong></p>
				<ul>
					<li><!--Undefined/nil-->未定義、nil</li>
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
## 策略實例化   {#policy-instantiation}

將策略定義從策略實例中解耦出來有助於形成跨叢集的策略理解和語言陳述，
以免綁定到特定的下層實施機制。

隨着相關機制的成熟，這些機制會按策略分別定義在下面。特定策略的實施方法不在這裏定義。

<!--
[**Pod Security Admission Controller**](/docs/concepts/security/pod-security-admission/)
-->
[**Pod 安全性准入控制器**](/zh-cn/docs/concepts/security/pod-security-admission/)

- {{< example file="security/podsecurity-privileged.yaml" >}}Privileged 名字空間{{< /example >}}
- {{< example file="security/podsecurity-baseline.yaml" >}}Baseline 名字空間{{< /example >}}
- {{< example file="security/podsecurity-restricted.yaml" >}}Restricted 名字空間{{< /example >}}

<!--
### Alternatives
-->
### 替代方案   {#alternatives}

{{% thirdparty-content %}}

<!--
Other alternatives for enforcing policies are being developed in the Kubernetes ecosystem, such as:
-->
在 Kubernetes 生態系統中還在開發一些其他的替代方案，例如：

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

Kubernetes 允許你使用運行 Linux 或 Windows 的節點。你可以在一個叢集中混用兩種類型的節點。
Kubernetes 中的 Windows 與基於 Linux 的工作負載相比有一些限制和差異。
具體而言，許多 Pod `securityContext`
字段[在 Windows 上不起作用](/zh-cn/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext)。


{{< note >}}
<!--
Kubelets prior to v1.24 don't enforce the pod OS field, and if a cluster has nodes on versions earlier than v1.24 the Restricted policies should be pinned to a version prior to v1.25.
-->
v1.24 之前的 kubelet 不強制處理 Pod OS 字段，如果叢集中有些節點運行早於 v1.24 的版本，
則應將 Restricted 策略鎖定到 v1.25 之前的版本。
{{< /note >}}

<!--
### Restricted Pod Security Standard changes
Another important change, made in Kubernetes v1.25 is that the  _Restricted_ policy
has been updated to use the `pod.spec.os.name` field. Based on the OS name, certain policies that are specific
to a particular OS can be relaxed for the other OS.
-->
### 限制性的 Pod Security Standard 變更   {#restricted-pod-security-standard-changes}

Kubernetes v1.25 中的另一個重要變化是 _Restricted_ 策略已更新，
能夠處理 `pod.spec.os.name` 字段。根據 OS 名稱，專用於特定 OS 的某些策略對其他 OS 可以放寬限制。

<!--
#### OS-specific policy controls

Restrictions on the following controls are only required if `.spec.os.name` is not `windows`:
- Privilege Escalation
- Seccomp
- Linux Capabilities
-->
#### OS 特定的策略控制

僅當 `.spec.os.name` 不是 `windows` 時，才需要對以下控制進行限制：

- 特權提升
- Seccomp
- Linux 權能

<!--
## User namespaces

User Namespaces are a Linux-only feature to run workloads with increased
isolation. How they work together with Pod Security Standards is described in
the [documentation](/docs/concepts/workloads/pods/user-namespaces#integration-with-pod-security-admission-checks) for Pods that use user namespaces.
-->
## 使用者命名空間    {#user-namespaces}

使用者命名空間是 Linux 特有的功能，可在運行工作負載時提高隔離度。
關於使用者命名空間如何與 PodSecurityStandard 協同工作，
請參閱[文檔](/zh-cn/docs/concepts/workloads/pods/user-namespaces#integration-with-pod-security-admission-checks)瞭解
Pod 如何使用使用者命名空間。

<!--
## FAQ

### Why isn't there a profile between Privileged and Baseline?
-->
## 常見問題    {#faq}

### 爲什麼不存在介於 Privileged 和 Baseline 之間的策略類型   {#why-isnt-there-a-profile-between-privileged-and-baseline}

<!--
The three profiles defined here have a clear linear progression from most secure (Restricted) to least
secure (Privileged), and cover a broad set of workloads. Privileges required above the Baseline
policy are typically very application specific, so we do not offer a standard profile in this
niche. This is not to say that the privileged profile should always be used in this case, but that
policies in this space need to be defined on a case-by-case basis.

SIG Auth may reconsider this position in the future, should a clear need for other profiles arise.
-->
這裏定義的三種策略框架有一個明晰的線性遞進關係，從最安全（Restricted）到最不安全（Privileged），
並且覆蓋了很大範圍的工作負載。特權要求超出 Baseline 策略，這通常是特定於應用的需求，
所以我們沒有在這個範圍內提供標準框架。這並不意味着在這樣的情形下仍然只能使用 Privileged 框架，
只是說處於這個範圍的策略需要因地制宜地定義。

SIG Auth 可能會在將來考慮這個範圍的框架，前提是有對其他框架的需求。

<!--
### What's the difference between a security profile and a security context?

[Security Contexts](/docs/tasks/configure-pod-container/security-context/) configure Pods and
Containers at runtime. Security contexts are defined as part of the Pod and container specifications
in the Pod manifest, and represent parameters to the container runtime.
-->
### 安全設定與安全上下文的區別是什麼？   {#whats-the-difference-between-security-profile-and-security-context}

[安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/)在運行時設定 Pod
和容器。安全上下文是在 Pod 清單中作爲 Pod 和容器規約的一部分來定義的，
所代表的是傳遞給容器運行時的參數。

<!--
Security profiles are control plane mechanisms to enforce specific settings in the Security Context,
as well as other related parameters outside the Security Context. As of July 2021,
[Pod Security Policies](/docs/concepts/security/pod-security-policy/) are deprecated in favor of the
built-in [Pod Security Admission Controller](/docs/concepts/security/pod-security-admission/).
-->
安全策略則是控制面用來對安全上下文以及安全性上下文之外的參數實施某種設置的機制。
在 2021 年 7 月，
[Pod 安全性策略](/zh-cn/docs/concepts/security/pod-security-policy/)已被廢棄，
取而代之的是內置的 [Pod 安全性准入控制器](/zh-cn/docs/concepts/security/pod-security-admission/)。

<!--
### What about sandboxed Pods?

There is currently no API standard that controls whether a Pod is considered sandboxed or
not. Sandbox Pods may be identified by the use of a sandboxed runtime (such as gVisor or Kata
Containers), but there is no standard definition of what a sandboxed runtime is.
-->
### 沙箱（Sandboxed）Pod 怎麼處理？  {#what-about-sandboxed-pods}

現在還沒有 API 標準來控制 Pod 是否被視作沙箱化 Pod。
沙箱 Pod 可以通過其是否使用沙箱化運行時（如 gVisor 或 Kata Container）來辨別，
不過目前還沒有關於什麼是沙箱化運行時的標準定義。

<!--
The protections necessary for sandboxed workloads can differ from others. For example, the need to
restrict privileged permissions is lessened when the workload is isolated from the underlying
kernel. This allows for workloads requiring heightened permissions to still be isolated.

Additionally, the protection of sandboxed workloads is highly dependent on the method of
sandboxing. As such, no single recommended profile is recommended for all sandboxed workloads.
-->
沙箱化負載所需要的保護可能彼此各不相同。例如，當負載與下層內核直接隔離開來時，
限制特權化操作的許可就不那麼重要。這使得那些需要更多許可權限的負載仍能被有效隔離。

此外，沙箱化負載的保護高度依賴於沙箱化的實現方法。
因此，現在還沒有針對所有沙箱化負載的建議設定。
