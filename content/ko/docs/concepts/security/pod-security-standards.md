---
# reviewers:
# - tallclair
title: 파드 시큐리티 표준
description: >
  파드 시큐리티 표준에 정의된 여러 정책 수준을 자세히 살펴본다.
content_type: concept
weight: 15
---

<!-- overview -->

파드 시큐리티 표준은 보안 범위를 폭넓게 다루기 위해 세 가지 _정책_ 을
정의한다. 이 정책은 _누적적_ 이며, 매우 허용적인 수준부터 매우 제한적인 수준까지 있다.
이 가이드는 각 정책의 요구 사항을 간략히 설명한다.

| 프로필 | 설명 |
| ------ | ----------- |
| <strong style="white-space: nowrap">특권(Privileged)</strong> | 제한이 없는 정책으로, 가능한 가장 넓은 권한 수준을 제공한다. 이 정책은 알려진 권한 상승(privilege escalation)을 허용한다. |
| <strong style="white-space: nowrap">기본(Baseline)</strong> | 알려진 권한 상승을 방지하는 최소한의 제한 정책이다. 기본(최소한으로 지정된) 파드 구성을 허용한다. |
| <strong style="white-space: nowrap">제한(Restricted)</strong> | 현재의 파드 보안 강화 모범 사례를 따르는 엄격하게 제한된 정책이다. |

<!-- body -->

## 프로필 상세 {#profile-details}

### 특권 {#privileged}

**_특권_ 정책은 의도적으로 개방되어 있으며 아무런 제한이 없다.** 이 유형의 정책은
일반적으로 특권을 가진(privileged), 신뢰할 수 있는 사용자가 관리하는 시스템 및 인프라 수준의 워크로드를 대상으로 한다.

특권 정책은 제한이 없는 것으로 정의된다. 특권 보안 정책이 적용되는 파드를
정의하면 해당 파드는 일반적인 컨테이너 격리 메커니즘을 우회할 수 있다.
예를 들어 노드의 호스트 네트워크에 접근하는 파드를 정의할 수 있다.

### 기본 {#baseline}

**_기본_ 정책은 알려진 권한 상승을 방지하면서 일반적인 컨테이너화된 워크로드에
쉽게 적용할 수 있도록 하는 것을 목표로 한다.** 이 정책은 중요도가 높지 않은 애플리케이션의
운영자와 개발자를 대상으로 한다. 아래에 나열된 제어 사항을
적용하거나 금지해야 한다.

{{< note >}}
이 표에서 와일드카드(`*`)는 목록의 모든 요소를 나타낸다. 예를 들어,
`spec.containers[*].securityContext`는 _정의된 모든 컨테이너_ 의
시큐리티 컨텍스트 오브젝트를 가리킨다. 나열된 컨테이너 중 하나라도 요구 사항을
충족하지 못하면 파드 전체의 검증이 실패한다.
{{< /note >}}

<table>
	<caption style="display:none">기본 정책 명세</caption>
	<tbody>
		<tr>
			<th>제어</th>
			<th>정책</th>
		</tr>
		<tr>
			<td style="white-space: nowrap">호스트 프로세스</td>
			<td>
				<p>윈도우 파드는 윈도우 호스트 머신에 대한 특권 접근을 가능하게 하는 <a href="/docs/tasks/configure-pod-container/create-hostprocess-pod">호스트 프로세스 컨테이너</a>를 실행할 수 있다. 기본 정책에서는 호스트에 대한 특권 접근을 허용하지 않는다. {{< feature-state for_k8s_version="v1.26" state="stable" >}}</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.containers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.initContainers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.windowsOptions.hostProcess</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>미설정/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">호스트 네임스페이스</td>
			<td>
				<p>호스트 네임스페이스 공유를 허용해서는 안 된다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.hostNetwork</code></li>
					<li><code>spec.hostPID</code></li>
					<li><code>spec.hostIPC</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>미설정/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">특권 컨테이너</td>
			<td>
				<p>특권 파드는 대부분의 보안 메커니즘을 비활성화하므로 허용해서는 안 된다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.privileged</code></li>
					<li><code>spec.initContainers[*].securityContext.privileged</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.privileged</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>미설정/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">리눅스 기능(Capabilities)</td>
			<td>
				<p>아래에 나열된 것 이외의 추가 리눅스 기능을 허용해서는 안 된다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>미설정/nil</li>
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
			<td style="white-space: nowrap">HostPath 볼륨</td>
			<td>
				<p>HostPath 볼륨은 금지해야 한다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.volumes[*].hostPath</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>미설정/nil</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">호스트 포트</td>
			<td>
				<p>호스트 포트는 전면 금지하거나(권장), 정해진 목록으로 제한해야 한다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.containers[*].ports[*].hostPort</code></li>
					<li><code>spec.initContainers[*].ports[*].hostPort</code></li>
					<li><code>spec.ephemeralContainers[*].ports[*].hostPort</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>미설정/nil</li>
					<li>정해진 목록(기본 제공 <a href="/docs/concepts/security/pod-security-admission/">파드 시큐리티 어드미션 컨트롤러</a>는 지원하지 않음)</li>
					<li><code>0</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>호스트 프로브 / 라이프사이클 훅(hook) (v1.34+)</td>
			<td>
				<p>프로브(probe)와 라이프사이클 훅에서 Host 필드를 허용해서는 안 된다.</p>
				<p><strong>제한된 필드</strong></p>
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
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>미설정/nil</li>
					<li>""</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">AppArmor</td>
			<td>
				<p>지원되는 호스트에서는 <code>RuntimeDefault</code> AppArmor 프로필이 기본적으로 적용된다. 기본 정책은 기본 AppArmor 프로필의 재정의 또는 비활성화를 방지하거나, 허용된 프로필 집합 내에서만 재정의하도록 제한해야 한다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.securityContext.appArmorProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.appArmorProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.appArmorProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.appArmorProfile.type</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>미설정/nil</li>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
				<hr />
				<ul>
					<li><code>metadata.annotations["container.apparmor.security.beta.kubernetes.io/*"]</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>미설정/nil</li>
					<li><code>runtime/default</code></li>
					<li><code>localhost/*</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">SELinux</td>
			<td>
				<p>SELinux 타입 설정은 제한되며, 사용자 정의 SELinux 사용자 또는 역할 옵션 설정은 금지된다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.type</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>미설정/""</li>
					<li><code>container_t</code></li>
					<li><code>container_init_t</code></li>
					<li><code>container_kvm_t</code></li>
					<li><code>container_engine_t</code> (쿠버네티스 1.31부터)</li>
				</ul>
				<hr />
				<p><strong>제한된 필드</strong></p>
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
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>미설정/""</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><code>/proc</code> 마운트 타입</td>
			<td>
				<p>기본 <code>/proc</code> 마스크는 공격 표면을 줄이도록 설정되어 있으므로 반드시 사용하도록 해야 한다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.procMount</code></li>
					<li><code>spec.initContainers[*].securityContext.procMount</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.procMount</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>미설정/nil</li>
					<li><code>Default</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>Seccomp</td>
			<td>
				<p>Seccomp 프로필을 명시적으로 <code>Unconfined</code>로 설정해서는 안 된다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>미설정/nil</li>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Sysctls</td>
			<td>
				<p>sysctl은 보안 메커니즘을 비활성화하거나 호스트의 모든 컨테이너에 영향을 줄 수 있으므로, 허용된 "안전한" 일부 항목을 제외하고는 허용하지 않아야 한다. sysctl이 컨테이너나 파드의 네임스페이스에 속하고, 같은 노드의 다른 파드나 프로세스로부터 격리되어 있으면 안전한 것으로 간주한다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.securityContext.sysctls[*].name</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>미설정/nil</li>
					<li><code>kernel.shm_rmid_forced</code></li>
					<li><code>net.ipv4.ip_local_port_range</code></li>
					<li><code>net.ipv4.ip_unprivileged_port_start</code></li>
					<li><code>net.ipv4.tcp_syncookies</code></li>
					<li><code>net.ipv4.ping_group_range</code></li>
					<li><code>net.ipv4.ip_local_reserved_ports</code> (쿠버네티스 1.27부터)</li>
					<li><code>net.ipv4.tcp_keepalive_time</code> (쿠버네티스 1.29부터)</li>
					<li><code>net.ipv4.tcp_fin_timeout</code> (쿠버네티스 1.29부터)</li>
					<li><code>net.ipv4.tcp_keepalive_intvl</code> (쿠버네티스 1.29부터)</li>
					<li><code>net.ipv4.tcp_keepalive_probes</code> (쿠버네티스 1.29부터)</li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>

### 제한 {#restricted}

**_제한_ 정책은 일부 호환성을 희생하더라도 현재의 파드 보안 강화 모범 사례를
적용하는 것을 목표로 한다.** 보안이 중요한 애플리케이션의 운영자와 개발자,
그리고 신뢰 수준이 낮은 사용자를 대상으로 한다. 아래에 나열된 제어 사항을
적용하거나 금지해야 한다.

{{< note >}}
이 표에서 와일드카드(`*`)는 목록의 모든 요소를 나타낸다. 예를 들어,
`spec.containers[*].securityContext`는 _정의된 모든 컨테이너_ 의
시큐리티 컨텍스트 오브젝트를 가리킨다. 나열된 컨테이너 중 하나라도 요구 사항을
충족하지 못하면 파드 전체의 검증이 실패한다.
{{< /note >}}

<table>
	<caption style="display:none">제한 정책 명세</caption>
	<tbody>
		<tr>
			<td><strong>제어</strong></td>
			<td><strong>정책</strong></td>
		</tr>
		<tr>
			<td colspan="2"><em>기본 정책의 모든 항목</em></td>
		</tr>
		<tr>
			<td style="white-space: nowrap">볼륨 타입</td>
			<td>
				<p>제한 정책은 다음 볼륨 타입만 허용한다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.volumes[*]</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<code>spec.volumes[*]</code> 목록의 모든 항목은 다음 필드 중 하나를 null이 아닌 값으로 설정해야 한다.
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
			<td style="white-space: nowrap">권한 상승 (v1.8+)</td>
			<td>
				<p>set-user-ID나 set-group-ID 파일 모드를 통한 권한 상승 등을 허용해서는 안 된다. <em>v1.25 이상에서는 <a href="#os-specific-policy-controls">리눅스 전용 정책이다</a> <code>(spec.os.name != windows)</code></em></p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.initContainers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.allowPrivilegeEscalation</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">루트가 아닌 사용자로 실행</td>
			<td>
				<p>컨테이너는 반드시 루트가 아닌 사용자로 실행하도록 해야 한다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsNonRoot</code></li>
					<li><code>spec.containers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsNonRoot</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li><code>true</code></li>
				</ul>
				<small>
					파드 수준의 <code>spec.securityContext.runAsNonRoot</code>가
					<code>true</code>이면 컨테이너 필드는 설정하지 않거나 <code>nil</code>일 수 있다.
				</small>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">루트가 아닌 사용자로 실행 (v1.23+)</td>
			<td>
				<p>컨테이너는 <tt>runAsUser</tt>를 0으로 설정해서는 안 된다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsUser</code></li>
				    <li><code>spec.containers[*].securityContext.runAsUser</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsUser</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsUser</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>0이 아닌 모든 값</li>
					<li><code>undefined/null</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Seccomp (v1.19+)</td>
			<td>
				<p>Seccomp 프로필은 허용된 값 중 하나로 명시적으로 설정해야 한다. <code>Unconfined</code> 프로필과 프로필 <em>미설정</em> 모두 금지된다. <em>v1.25 이상에서는 <a href="#os-specific-policy-controls">리눅스 전용 정책이다</a> <code>(spec.os.name != windows)</code></em></p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
				<small>
					파드 수준의 <code>spec.securityContext.seccompProfile.type</code> 필드가
					적절하게 설정되어 있으면 컨테이너 필드는 설정하지 않거나 <code>nil</code>일 수 있다.
					반대로 <em>모든</em> 컨테이너 수준 필드가 설정되어 있으면, 파드 수준 필드는
					설정하지 않거나 <code>nil</code>일 수 있다.
				</small>
			</td>
		</tr>
		  <tr>
			<td style="white-space: nowrap">리눅스 기능 (v1.22+)</td>
			<td>
				<p>
					컨테이너는 <code>ALL</code>로 모든 리눅스 기능을 제거해야 하며, 다시 추가할 수 있는 것은
					<code>NET_BIND_SERVICE</code> 기능뿐이다. <em>v1.25 이상에서는 <a href="#os-specific-policy-controls">리눅스 전용 정책이다</a> <code>(.spec.os.name != "windows")</code></em>
				</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.drop</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li><code>ALL</code>을 포함하는 모든 리눅스 기능 목록</li>
				</ul>
				<hr />
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>미설정/nil</li>
					<li><code>NET_BIND_SERVICE</code></li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>

## 정책 구현 {#policy-instantiation}

정책 정의와 정책 구현을 분리하면, 실제 적용 메커니즘과
관계없이 클러스터 전반에서 정책에 대한 공통된 이해와
일관된 용어를 사용할 수 있다.

메커니즘이 성숙해지면 아래에 정책별로 정의할 것이다. 개별 정책의
적용 방법은 여기서 정의하지 않는다.

[**파드 시큐리티 어드미션 컨트롤러**](/docs/concepts/security/pod-security-admission/)

- {{< example file="security/podsecurity-privileged.yaml" >}}특권 네임스페이스{{< /example >}}
- {{< example file="security/podsecurity-baseline.yaml" >}}기본 네임스페이스{{< /example >}}
- {{< example file="security/podsecurity-restricted.yaml" >}}제한 네임스페이스{{< /example >}}

### 대안 {#alternatives}

{{% thirdparty-content %}}

쿠버네티스 생태계에서는 정책 적용을 위한 다음과 같은 다른 대안도 개발되고 있다.

- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io/policies)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)

## 파드 OS 필드 {#pod-os-field}

쿠버네티스에서는 리눅스 또는 윈도우를 실행하는 노드를 사용할 수 있다. 한 클러스터에서
두 종류의 노드를 함께 사용할 수도 있다.
쿠버네티스의 윈도우 워크로드에는 리눅스 기반 워크로드와 다른 몇 가지 제한과
차이점이 있다. 특히 파드의 `securityContext` 필드 중 다수는
[윈도우에서 효과가 없다](/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext).

{{< note >}}
v1.24 이전의 kubelet은 파드 OS 필드를 적용하지 않으므로, 클러스터에 v1.24 이전 버전의 노드가 있다면 제한 정책을 v1.25 이전 버전으로 고정해야 한다.
{{< /note >}}

### 제한 파드 시큐리티 표준의 변경 사항 {#restricted-pod-security-standard-changes}
쿠버네티스 v1.25의 또 다른 중요한 변경 사항은 _제한_ 정책이
`pod.spec.os.name` 필드를 사용하도록 업데이트되었다는 점이다. OS 이름을 기준으로,
특정 OS에만 해당하는 정책은 다른 OS에서 완화할 수 있다.

#### OS별 정책 제어 {#os-specific-policy-controls}
다음 제어 사항에 대한 제한은 `.spec.os.name`이 `windows`가 아닌 경우에만 필요하다.
- 권한 상승
- Seccomp
- 리눅스 기능

## 사용자 네임스페이스 {#user-namespaces}

사용자 네임스페이스는 격리 수준을 높여 워크로드를 실행하는
리눅스 전용 기능이다. 파드 시큐리티 표준과 함께 동작하는 방식은
사용자 네임스페이스를 사용하는 파드의 [문서](https://kubernetes.io/docs/concepts/workloads/pods/user-namespaces#integration-with-pod-security-admission-checks)에 설명되어 있다.

## 자주 묻는 질문 {#faq}

### 특권과 기본 사이의 프로필이 없는 이유는 무엇인가? {#why-isn-t-there-a-profile-between-privileged-and-baseline}

여기에 정의된 세 프로필은 가장 안전한 수준(제한)에서 가장 덜 안전한
수준(특권)까지 명확한 선형 단계를 이루며, 다양한 워크로드를 포괄한다. 기본 정책을
넘어서는 권한 요구 사항은 일반적으로 애플리케이션에 매우 특화되어 있으므로,
이 영역에는 표준 프로필을 제공하지 않는다. 그렇다고 이 경우 항상 특권 프로필을
사용해야 한다는 의미는 아니며, 각 상황에 맞게 정책을 정의해야 한다는 의미이다.

다른 프로필에 대한 명확한 필요가 생기면 SIG Auth는 향후 이 입장을 재검토할 수 있다.

### 보안 프로필과 시큐리티 컨텍스트의 차이는 무엇인가? {#what-s-the-difference-between-a-security-profile-and-a-security-context}

[시큐리티 컨텍스트](/docs/tasks/configure-pod-container/security-context/)는 런타임에서 파드와
컨테이너를 구성한다. 시큐리티 컨텍스트는 파드 매니페스트의 파드 및 컨테이너 명세의
일부로 정의되며, 컨테이너 런타임에 전달할 파라미터를 나타낸다.

보안 프로필은 시큐리티 컨텍스트의 특정 설정과 그 밖의 관련 파라미터를
강제하는 컨트롤 플레인 메커니즘이다. 2021년 7월부로,
[파드 시큐리티 폴리시](/docs/concepts/security/pod-security-policy/)는 사용 중단(deprecated)되었으며,
기본 제공 [파드 시큐리티 어드미션 컨트롤러](/docs/concepts/security/pod-security-admission/)로 대체되었다.


### 샌드박스 파드는 어떻게 다루는가? {#what-about-sandboxed-pods}

현재 파드가 샌드박스(sandbox)에서 실행되는 것으로 간주할지 제어하는 API
표준은 없다. gVisor나 Kata Containers와 같은 샌드박스 런타임의 사용 여부로
샌드박스 파드를 식별할 수 있지만, 샌드박스 런타임에 대한 표준 정의는 없다.

샌드박스 워크로드에 필요한 보호는 다른 워크로드와 다를 수 있다. 예를 들어,
워크로드가 기반 커널과 격리되어 있으면 특권을 제한할 필요성이
줄어든다. 이를 통해 높은 권한이 필요한 워크로드도 격리된 상태로 실행할 수 있다.

또한 샌드박스 워크로드의 보호 수준은 샌드박스 구현 방식에 크게
의존한다. 따라서 모든 샌드박스 워크로드에 권장할 수 있는 단일 프로필은 없다.
