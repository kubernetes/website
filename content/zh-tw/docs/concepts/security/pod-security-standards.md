---
title: Pod 安全性標準
description: >
  詳細瞭解 Pod 安全性標準（Pod Security Standards）中所定義的不同策略級別。
content_type: concept
weight: 10
---
<!--
reviewers:
- tallclair
title: Pod Security Standards
description: >
  A detailed look at the different policy levels defined in the Pod Security Standards.
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
Pod 安全性標準定義了三種不同的 _策略（Policy）_，以廣泛覆蓋安全應用場景。
這些策略是 _漸進式的（Cumulative）_，安全級別從高度寬鬆至高度受限。
本指南概述了每個策略的要求。

| Profile | 描述 |
| ------ | ----------- |
| <strong style="white-space: nowrap">Privileged</strong> | 不受限制的策略，提供最大可能範圍的許可權許可。此策略允許已知的特權提升。 |
| <strong style="white-space: nowrap">Baseline</strong> | 限制性最弱的策略，禁止已知的策略提升。允許使用預設的（規定最少）Pod 配置。 |
| <strong style="white-space: nowrap">Restricted</strong> | 限制性非常強的策略，遵循當前的保護 Pod 的最佳實踐。 |

<!-- body -->

<!--
## Profile Details

### Privileged
-->
## Profile 細節    {#profile-details}

### Privileged

<!--
**The _Privileged_ policy is purposely-open, and entirely unrestricted.** This type of policy is
typically aimed at system- and infrastructure-level workloads managed by privileged, trusted users.

The Privileged policy is defined by an absence of restrictions. Allow-by-default
mechanisms (such as gatekeeper) may be Privileged by default. In contrast, for a deny-by-default mechanism (such as Pod
Security Policy) the Privileged policy should disable all restrictions.
-->
**_Privileged_ 策略是有目的地開放且完全無限制的策略。**
此類策略通常針對由特權較高、受信任的使用者所管理的系統級或基礎設施級負載。

Privileged 策略定義中限制較少。預設允許的（Allow-by-default）實施機制（例如 gatekeeper）
可以預設設定為 Privileged。
與此不同，對於預設拒絕（Deny-by-default）的實施機制（如 Pod 安全策略）而言，
Privileged 策略應該禁止所有限制。

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
在下述表格中，萬用字元（`*`）意味著一個列表中的所有元素。
例如 `spec.containers[*].securityContext` 表示 _所定義的所有容器_ 的安全性上下文物件。
如果所列出的任一容器不能滿足要求，整個 Pod 將無法透過校驗。
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
				<p>Windows Pod 提供了執行
         <a href="/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod">HostProcess 容器</a> 的能力，
         這使得對 Windows 節點的特權訪問成為可能。 
         基線策略中對宿主的特權訪問是被禁止的。 
         HostProcess Pod 是 Kubernetes <strong>v1.22</strong> 版本的
          <strong>alpha</strong> 特性。</p>
				<p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.containers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.initContainers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.windowsOptions.hostProcess</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
				<ul>
					<li>未定義/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<!-- <td style="white-space: nowrap">Host Namespaces</td> -->
			<td style="white-space: nowrap">宿主名字空間</td>
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
        <p>必須禁止共享宿主名字空間。</p>
        <p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.hostNetwork</code></li>
					<li><code>spec.hostPID</code></li>
					<li><code>spec.hostIPC</code></li>
				</ul>
        <p><strong>允許的值</strong></p>
				<ul>
					<li>未定義/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<!-- <td style="white-space: nowrap">Privileged Containers</td> -->
			<td style="white-space: nowrap">特權容器</td>
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
        <p>特權 Pod 關閉了大多數安全性機制，必須被禁止。</p>
				<p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.privileged</code></li>
					<li><code>spec.initContainers[*].securityContext.privileged</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.privileged</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
				<ul>
					<li>未定義/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<!-- <td style="white-space: nowrap">Capabilities</td> -->
			<td style="white-space: nowrap">權能</td>
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
        <p>必須禁止新增除下列欄位之外的權能。</p>
				<p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
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
        <p>必須禁止 HostPath 卷。</p>
				<p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.volumes[*].hostPath</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
				<ul>
					<li>未定義/nil</li>
				</ul>
			</td>
		</tr>
		<tr>
			<!-- <td style="white-space: nowrap">Host Ports</td> -->
			<td style="white-space: nowrap">宿主埠</td>
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
        <p>應禁止使用宿主埠，或者至少限定為已知列表。</p>
        <p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.containers[*].ports[*].hostPort</code></li>
					<li><code>spec.initContainers[*].ports[*].hostPort</code></li>
					<li><code>spec.ephemeralContainers[*].ports[*].hostPort</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
				<ul>
					<li>未定義/nil</li>
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
        <p>在受支援的主機上，預設使用 <code>runtime/default</code> AppArmor Profile。
				基線策略應避免覆蓋或者禁用預設策略，以及限制覆蓋一些 Profile 集合的許可權。</p>
				<p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>metadata.annotations["container.apparmor.security.beta.kubernetes.io/*"]</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
				<ul>
					<li>未定義/nil</li>
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
        <p>設定 SELinux 型別的操作是被限制的，設定自定義的 SELinux 使用者或角色選項是被禁止的。</p>
        <p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.type</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
				<ul>
					<li>未定義/""</li>
					<li><code>container_t</code></li>
					<li><code>container_init_t</code></li>
					<li><code>container_kvm_t</code></li>
				</ul>
				<hr />
				<p><strong>限制的欄位</strong></p>
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
				<p><strong>允許的值</strong></p>
				<ul>
					<li>未定義/""</li>
				</ul>
			</td>
		</tr>
		<tr>
			<!-- <td style="white-space: nowrap"><code>/proc</code> Mount Type</td> -->
			<td style="white-space: nowrap"><code>/proc</code> 掛載型別</td>
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
        <p>要求使用預設的 <code>/proc</code> 掩碼以減小攻擊面。</p>
				<p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.procMount</code></li>
					<li><code>spec.initContainers[*].securityContext.procMount</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.procMount</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
				<ul>
					<li>未定義/nil</li>
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
  				<p>Seccomp Profile 禁止被顯式設定為 <code>Unconfined</code>。</p>
  				<p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
				<ul>
					<li>未定義/nil</li>
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
        <p>Sysctls 可以禁用安全機制或影響宿主上所有容器，因此除了若干“安全”的子集之外，應該被禁止。
				如果某 sysctl 是受容器或 Pod 的名字空間限制，且與節點上其他 Pod 或程序相隔離，可認為是安全的。</p>
				<p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.securityContext.sysctls[*].name</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
				<ul>
					<li>未定義/nil</li>
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
**_Restricted_ 策略旨在實施當前保護 Pod 的最佳實踐，儘管這樣作可能會犧牲一些相容性。**
該類策略主要針對運維人員和安全性很重要的應用的開發人員，以及不太被信任的使用者。
下面列舉的控制需要被實施（禁止）：

{{< note >}}
在下述表格中，萬用字元（`*`）意味著一個列表中的所有元素。
例如 `spec.containers[*].securityContext` 表示 _所定義的所有容器_ 的安全性上下文物件。
如果所列出的任一容器不能滿足要求，整個 Pod 將無法透過校驗。
{{< /note >}}

<table>
	<!-- caption style="display:none">Restricted policy specification</caption -->
	<caption style="display:none">Restricted 策略規範</caption>
	<tbody>
		<tr>
			<!-- td><strong>Control</strong></td -->
			<td width="30%"><strong>控制（Control）</strong></td>
			<!-- td><strong>Policy</strong></td -->
			<td><strong>策略（Policy）</strong></td>
		</tr>
		<tr>
			<!-- <td colspan="2"><em>Everything from the baseline profile.</em></td> -->
			<td colspan="2"><em>基線策略的所有要求。</em></td>
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
			<td>卷型別</td>
			<td>
        <p>除了限制 HostPath 卷之外，此類策略還限制可以透過 PersistentVolumes 定義的非核心卷型別。</p>
				<p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.volumes[*]</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
				<code>spec.volumes[*]</code> 列表中的每個條目必須將下面欄位之一設定為非空值：
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
			<td style="white-space: nowrap">特權提升（v1.8+）</td>
			<td>
        <p>禁止（透過 SetUID 或 SetGID 檔案模式）獲得特權提升。</p>
				<br>
				<p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.initContainers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.allowPrivilegeEscalation</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
				<ul>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
      <!-- <td style="white-space: nowrap">Running as Non-root</td> -->
			<td style="white-space: nowrap">以非 root 賬號執行 </td>
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
        <p>必須要求容器以非 root 使用者執行。</p>
				<p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsNonRoot</code></li>
					<li><code>spec.containers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsNonRoot</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
				<ul>
					<li><code>true</code></li>
				</ul>
				<small>
					如果 Pod 級別 <code>spec.securityContext.runAsNonRoot</code> 設定為 
          <code>true</code>，則允許容器組的安全上下文欄位設定為 未定義/<code>nil</code>。
				</small>
			</td>
		</tr>
		<tr>
			<!-- <td style="white-space: nowrap">Running as Non-root user (v1.23+)</td> -->
			<td style="white-space: nowrap">非 root 使用者（v1.23+）</td>
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
				<p>Containers 不可以將 <tt>runAsUser</tt> 設定為 0</p>
				<p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsUser</code></li>
					<li><code>spec.containers[*].securityContext.runAsUser</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsUser</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsUser</code></li>
				</ul>
				<p><strong>允許的欄位</strong></p>
				<ul>
					<li>any non-zero value</li>
					<li><code>未定義/空值</code></li>
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
        <p>Seccomp Profile 必須被顯式設定成一個允許的值。禁止使用 <code>Unconfined</code> 
        Profile 或者指定 <em>不存在的</em> Profile。</p>
				<p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
				<ul>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
				<small>
					如果 Pod 級別的 <code>spec.securityContext.seccompProfile.type</code> 
          已設定得當，容器級別的安全上下文欄位可以為 未定義/<code>nil</code>。
          反過來說，如果 _所有的_ 容器級別的安全上下文欄位已設定，則 Pod 級別的欄位可為 未定義/<code>nil</code>。 
				</small>
			</td>
		</tr>
    <tr>
			<!-- <td style="white-space: nowrap">Capabilities (v1.22+)</td> -->
      <td style="white-space: nowrap">權能（v1.22+）</td>
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
					容器組必須棄用 <code>ALL</code> 權能，並且只允許新增 <code>NET_BIND_SERVICE</code> 權能。
				</p>
        <p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.drop</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
				<ul>
					<li>包含 <code>ALL</code> 的任何一種權能列表。</li>
				</ul>
				<hr />
				<p><strong>限制的欄位</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong>允許的值</strong></p>
				<ul>
					<li>未定義/nil</li>
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
## 策略例項化   {#policy-instantiation}

將策略定義從策略例項中解耦出來有助於形成跨叢集的策略理解和語言陳述，
以免繫結到特定的下層實施機制。

隨著相關機制的成熟，這些機制會按策略分別定義在下面。特定策略的實施方法不在這裡定義。

[**Pod 安全性准入控制器**](/zh-cn/docs/concepts/security/pod-security-admission/)

- {{< example file="security/podsecurity-privileged.yaml" >}}Privileged 名字空間{{< /example >}}
- {{< example file="security/podsecurity-baseline.yaml" >}}Baseline 名字空間{{< /example >}}
- {{< example file="security/podsecurity-restricted.yaml" >}}Restricted 名字空間{{< /example >}}

[**PodSecurityPolicy**](/zh-cn/docs/concepts/security/pod-security-policy/) （已棄用）

- {{< example file="policy/privileged-psp.yaml" >}}Privileged{{< /example >}}
- {{< example file="policy/baseline-psp.yaml" >}}Baseline{{< /example >}}
- {{< example file="policy/restricted-psp.yaml" >}}Restricted{{< /example >}}

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
## FAQ

### Why isn't there a profile between privileged and baseline?
-->
## 常見問題    {#faq}

### 為什麼不存在介於 Privileged 和 Baseline 之間的策略型別

<!--
The three profiles defined here have a clear linear progression from most secure (restricted) to least
secure (privileged), and cover a broad set of workloads. Privileges required above the baseline
policy are typically very application specific, so we do not offer a standard profile in this
niche. This is not to say that the privileged profile should always be used in this case, but that
policies in this space need to be defined on a case-by-case basis.

SIG Auth may reconsider this position in the future, should a clear need for other profiles arise.
-->
這裡定義的三種策略框架有一個明晰的線性遞進關係，從最安全（Restricted）到最不安全，
並且覆蓋了很大範圍的工作負載。特權要求超出 Baseline 策略者通常是特定於應用的需求，
所以我們沒有在這個範圍內提供標準框架。
這並不意味著在這樣的情形下仍然只能使用 Privileged 框架，
只是說處於這個範圍的策略需要因地制宜地定義。

SIG Auth 可能會在將來考慮這個範圍的框架，前提是有對其他框架的需求。

<!--
### What's the difference between a security policy and a security context?

[Security Contexts](/docs/tasks/configure-pod-container/security-context/) configure Pods and
Containers at runtime. Security contexts are defined as part of the Pod and container specifications
in the Pod manifest, and represent parameters to the container runtime.
-->
### 安全策略與安全上下文的區別是什麼？

[安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/)在執行時配置 Pod
和容器。安全上下文是在 Pod 清單中作為 Pod 和容器規約的一部分來定義的，
所代表的是傳遞給容器執行時的引數。

<!--
Security profiles are control plane mechanisms to enforce specific settings in the Security Context,
as well as other related parameters outside the Security Context. As of July 2021, 
[Pod Security Policies](/docs/concepts/security/pod-security-policy/) are deprecated in favor of the
built-in [Pod Security Admission Controller](/docs/concepts/security/pod-security-admission/). 
-->
安全策略則是控制面用來對安全上下文以及安全性上下文之外的引數實施某種設定的機制。
在 2020 年 7 月，
[Pod 安全性策略](/zh-cn/docs/concepts/security/pod-security-policy/)已被廢棄，
取而代之的是內建的 [Pod 安全性准入控制器](/zh-cn/docs/concepts/security/pod-security-admission/)。

<!--
### What profiles should I apply to my Windows Pods?

Windows in Kubernetes has some limitations and differentiators from standard Linux-based
workloads. Specifically, the Pod SecurityContext fields [have no effect on
Windows](/docs/setup/production-environment/windows/intro-windows-in-kubernetes/#v1-podsecuritycontext). As
such, no standardized Pod Security profiles currently exists.
-->
### 我應該為我的 Windows Pod 實施哪種框架？

Kubernetes 中的 Windows 負載與標準的基於 Linux 的負載相比有一些侷限性和區別。
尤其是 Pod SecurityContext
欄位[對 Windows 不起作用](/zh-cn/docs/setup/production-environment/windows/intro-windows-in-kubernetes/#v1-podsecuritycontext)。
因此，目前沒有對應的標準 Pod 安全性框架。

<!-- 
If you apply the restricted profile for a Windows pod, this **may** have an impact on the pod
at runtime. The restricted profile requires enforcing Linux-specific restrictions (such as seccomp
profile, and disallowing privilege escalation). If the kubelet and / or its container runtime ignore
these Linux-specific values, then the Windows pod should still work normally within the restricted
profile. However, the lack of enforcement means that there is no additional restriction, for Pods
that use Windows containers, compared to the baseline profile.
-->
如果你為一個 Windows Pod 應用了 Restricted 策略，**可能會** 對該 Pod 的執行時產生影響。
Restricted 策略需要強制執行 Linux 特有的限制（如 seccomp Profile，並且禁止特權提升）。
如果 kubelet 和/或其容器執行時忽略了 Linux 特有的值，那麼應該不影響 Windows Pod 正常工作。
然而，對於使用 Windows 容器的 Pod 來說，缺乏強制執行意味著相比於 Restricted 策略，沒有任何額外的限制。

<!--
The use of the HostProcess flag to create a HostProcess pod should only be done in alignment with the privileged policy. Creation of a Windows HostProcess pod is blocked under the baseline and restricted policies, so any HostProcess pod should be considered privileged.
-->
你應該只在 Privileged 策略下使用 HostProcess 標誌來建立 HostProcess Pod。
在 Baseline 和 Restricted 策略下，建立 Windows HostProcess Pod 是被禁止的，
因此任何 HostProcess Pod 都應該被認為是有特權的。

<!--
### What about sandboxed Pods?

There is not currently an API standard that controls whether a Pod is considered sandboxed or
not. Sandbox Pods may be identified by the use of a sandboxed runtime (such as gVisor or Kata
Containers), but there is no standard definition of what a sandboxed runtime is.
-->
### 沙箱（Sandboxed） Pod 怎麼處理？

現在還沒有 API 標準來控制 Pod 是否被視作沙箱化 Pod。
沙箱 Pod 可以透過其是否使用沙箱化執行時（如 gVisor 或 Kata Container）來辨別，
不過目前還沒有關於什麼是沙箱化執行時的標準定義。

<!--
The protections necessary for sandboxed workloads can differ from others. For example, the need to
restrict privileged permissions is lessened when the workload is isolated from the underlying
kernel. This allows for workloads requiring heightened permissions to still be isolated.

Additionally, the protection of sandboxed workloads is highly dependent on the method of
sandboxing. As such, no single recommended policy is recommended for all sandboxed workloads.
-->
沙箱化負載所需要的保護可能彼此各不相同。例如，當負載與下層核心直接隔離開來時，
限制特權化操作的許可就不那麼重要。這使得那些需要更多許可許可權的負載仍能被有效隔離。

此外，沙箱化負載的保護高度依賴於沙箱化的實現方法。
因此，現在還沒有針對所有沙箱化負載的建議策略。

