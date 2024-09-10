---
reviewers:
- tallclair
title: Pod Security Standards
description: >
  A detailed look at the different policy levels defined in the Pod Security Standards.
content_type: concept
weight: 15
---

<!-- overview -->

The Pod Security Standards define three different _policies_ to broadly cover the security
spectrum. These policies are _cumulative_ and range from highly-permissive to highly-restrictive.
This guide outlines the requirements of each policy.

| Profile | Description |
| ------ | ----------- |
| <strong style="white-space: nowrap">Privileged</strong> | Unrestricted policy, providing the widest possible level of permissions. This policy allows for known privilege escalations. |
| <strong style="white-space: nowrap">Baseline</strong> | Minimally restrictive policy which prevents known privilege escalations. Allows the default (minimally specified) Pod configuration. |
| <strong style="white-space: nowrap">Restricted</strong> | Heavily restricted policy, following current Pod hardening best practices. |

<!-- body -->

## Profile Details

### Privileged

**The _Privileged_ policy is purposely-open, and entirely unrestricted.** This type of policy is
typically aimed at system- and infrastructure-level workloads managed by privileged, trusted users.

The Privileged policy is defined by an absence of restrictions. If you define a Pod where the Privileged
security policy applies, the Pod you define is able to bypass typical container isolation mechanisms.
For example, you can define a Pod that has access to the node's host network.

### Baseline

**The _Baseline_ policy is aimed at ease of adoption for common containerized workloads while
preventing known privilege escalations.** This policy is targeted at application operators and
developers of non-critical applications. The following listed controls should be
enforced/disallowed:

{{< note >}}
In this table, wildcards (`*`) indicate all elements in a list. For example,
`spec.containers[*].securityContext` refers to the Security Context object for _all defined
containers_. If any of the listed containers fails to meet the requirements, the entire pod will
fail validation.
{{< /note >}}

<table>
	<caption style="display:none">Baseline policy specification</caption>
	<tbody>
		<tr>
			<th>Control</th>
			<th>Policy</th>
		</tr>
		<tr>
			<td style="white-space: nowrap">HostProcess</td>
			<td>
				<p>Windows Pods offer the ability to run <a href="/docs/tasks/configure-pod-container/create-hostprocess-pod">HostProcess containers</a> which enables privileged access to the Windows host machine. Privileged access to the host is disallowed in the Baseline policy. {{< feature-state for_k8s_version="v1.26" state="stable" >}}</p>
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
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Host Namespaces</td>
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
		</tr>
		<tr>
			<td style="white-space: nowrap">Privileged Containers</td>
			<td>
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
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Capabilities</td>
			<td>
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
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">HostPath Volumes</td>
			<td>
				<p>HostPath volumes must be forbidden.</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.volumes[*].hostPath</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Host Ports</td>
			<td>
				<p>HostPorts should be disallowed entirely (recommended) or restricted to a known list</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.containers[*].ports[*].hostPort</code></li>
					<li><code>spec.initContainers[*].ports[*].hostPort</code></li>
					<li><code>spec.ephemeralContainers[*].ports[*].hostPort</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li>Known list (not supported by the built-in <a href="/docs/concepts/security/pod-security-admission/">Pod Security Admission controller</a>)</li>
					<li><code>0</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">AppArmor</td>
			<td>
				<p>On supported hosts, the <code>RuntimeDefault</code> AppArmor profile is applied by default. The baseline policy should prevent overriding or disabling the default AppArmor profile, or restrict overrides to an allowed set of profiles.</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.securityContext.appArmorProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.appArmorProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.appArmorProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.appArmorProfile.type</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
				<hr />
				<ul>
					<li><code>metadata.annotations["container.apparmor.security.beta.kubernetes.io/*"]</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>runtime/default</code></li>
					<li><code>localhost/*</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">SELinux</td>
			<td>
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
					<li><code>container_engine_t</code> (since Kubernetes 1.31)</li>
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
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><code>/proc</code> Mount Type</td>
			<td>
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
			</td>
		</tr>
		<tr>
  			<td>Seccomp</td>
  			<td>
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
  			</td>
  		</tr>
		<tr>
			<td style="white-space: nowrap">Sysctls</td>
			<td>
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
					<li><code>net.ipv4.ip_local_reserved_ports</code> (since Kubernetes 1.27)</li>
					<li><code>net.ipv4.tcp_keepalive_time</code> (since Kubernetes 1.29)</li>
					<li><code>net.ipv4.tcp_fin_timeout</code> (since Kubernetes 1.29)</li>
					<li><code>net.ipv4.tcp_keepalive_intvl</code> (since Kubernetes 1.29)</li>
					<li><code>net.ipv4.tcp_keepalive_probes</code> (since Kubernetes 1.29)</li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>

### Restricted

**The _Restricted_ policy is aimed at enforcing current Pod hardening best practices, at the
expense of some compatibility.** It is targeted at operators and developers of security-critical
applications, as well as lower-trust users. The following listed controls should be
enforced/disallowed:

{{< note >}}
In this table, wildcards (`*`) indicate all elements in a list. For example,
`spec.containers[*].securityContext` refers to the Security Context object for _all defined
containers_. If any of the listed containers fails to meet the requirements, the entire pod will
fail validation.
{{< /note >}}

<table>
	<caption style="display:none">Restricted policy specification</caption>
	<tbody>
		<tr>
			<td><strong>Control</strong></td>
			<td><strong>Policy</strong></td>
		</tr>
		<tr>
			<td colspan="2"><em>Everything from the Baseline policy</em></td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Volume Types</td>
			<td>
				<p>The Restricted policy only permits the following volume types.</p>
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
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Privilege Escalation (v1.8+)</td>
			<td>
				<p>Privilege escalation (such as via set-user-ID or set-group-ID file mode) should not be allowed. <em><a href="#os-specific-policy-controls">This is Linux only policy</a> in v1.25+ <code>(spec.os.name != windows)</code></em></p>
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
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Running as Non-root</td>
			<td>
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
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Running as Non-root user (v1.23+)</td>
			<td>
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
			</td>
		</tr>
		<tr>
  			<td style="white-space: nowrap">Seccomp (v1.19+)</td>
  			<td>
  				<p>Seccomp profile must be explicitly set to one of the allowed values. Both the <code>Unconfined</code> profile and the <em>absence</em> of a profile are prohibited. <em><a href="#os-specific-policy-controls">This is Linux only policy</a> in v1.25+ <code>(spec.os.name != windows)</code></em></p>
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
  			</td>
  		</tr>
		  <tr>
			<td style="white-space: nowrap">Capabilities (v1.22+)</td>
			<td>
				<p>
					Containers must drop <code>ALL</code> capabilities, and are only permitted to add back
 					the <code>NET_BIND_SERVICE</code> capability. <em><a href="#os-specific-policy-controls">This is Linux only policy</a> in v1.25+ <code>(.spec.os.name != "windows")</code></em>
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
			</td>
		</tr>
	</tbody>
</table>

## Policy Instantiation

Decoupling policy definition from policy instantiation allows for a common understanding and
consistent language of policies across clusters, independent of the underlying enforcement
mechanism.

As mechanisms mature, they will be defined below on a per-policy basis. The methods of enforcement
of individual policies are not defined here.

[**Pod Security Admission Controller**](/docs/concepts/security/pod-security-admission/)

- {{< example file="security/podsecurity-privileged.yaml" >}}Privileged namespace{{< /example >}}
- {{< example file="security/podsecurity-baseline.yaml" >}}Baseline namespace{{< /example >}}
- {{< example file="security/podsecurity-restricted.yaml" >}}Restricted namespace{{< /example >}}

### Alternatives

{{% thirdparty-content %}}

Other alternatives for enforcing policies are being developed in the Kubernetes ecosystem, such as:

- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io/policies/pod-security/)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)

## Pod OS field

Kubernetes lets you use nodes that run either Linux or Windows. You can mix both kinds of
node in one cluster.
Windows in Kubernetes has some limitations and differentiators from Linux-based
workloads. Specifically, many of the Pod `securityContext` fields
[have no effect on Windows](/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext).

{{< note >}}
Kubelets prior to v1.24 don't enforce the pod OS field, and if a cluster has nodes on versions earlier than v1.24 the Restricted policies should be pinned to a version prior to v1.25.
{{< /note >}}

### Restricted Pod Security Standard changes
Another important change, made in Kubernetes v1.25 is that the  _Restricted_ policy
has been updated to use the `pod.spec.os.name` field. Based on the OS name, certain policies that are specific
to a particular OS can be relaxed for the other OS.

#### OS-specific policy controls
Restrictions on the following controls are only required if `.spec.os.name` is not `windows`:
- Privilege Escalation
- Seccomp
- Linux Capabilities

## User namespaces

User Namespaces are a Linux-only feature to run workloads with increased
isolation. How they work together with Pod Security Standards is described in
the [documentation](/docs/concepts/workloads/pods/user-namespaces#integration-with-pod-security-admission-checks) for Pods that use user namespaces.

## FAQ

### Why isn't there a profile between Privileged and Baseline?

The three profiles defined here have a clear linear progression from most secure (Restricted) to least
secure (Privileged), and cover a broad set of workloads. Privileges required above the Baseline
policy are typically very application specific, so we do not offer a standard profile in this
niche. This is not to say that the privileged profile should always be used in this case, but that
policies in this space need to be defined on a case-by-case basis.

SIG Auth may reconsider this position in the future, should a clear need for other profiles arise.

### What's the difference between a security profile and a security context?

[Security Contexts](/docs/tasks/configure-pod-container/security-context/) configure Pods and
Containers at runtime. Security contexts are defined as part of the Pod and container specifications
in the Pod manifest, and represent parameters to the container runtime.

Security profiles are control plane mechanisms to enforce specific settings in the Security Context,
as well as other related parameters outside the Security Context. As of July 2021,
[Pod Security Policies](/docs/concepts/security/pod-security-policy/) are deprecated in favor of the
built-in [Pod Security Admission Controller](/docs/concepts/security/pod-security-admission/).


### What about sandboxed Pods?

There is not currently an API standard that controls whether a Pod is considered sandboxed or
not. Sandbox Pods may be identified by the use of a sandboxed runtime (such as gVisor or Kata
Containers), but there is no standard definition of what a sandboxed runtime is.

The protections necessary for sandboxed workloads can differ from others. For example, the need to
restrict privileged permissions is lessened when the workload is isolated from the underlying
kernel. This allows for workloads requiring heightened permissions to still be isolated.

Additionally, the protection of sandboxed workloads is highly dependent on the method of
sandboxing. As such, no single recommended profile is recommended for all sandboxed workloads.
