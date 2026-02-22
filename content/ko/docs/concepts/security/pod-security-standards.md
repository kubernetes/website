---
# reviewers:
# - 
title: 파드 시큐리티 스탠다드
description: >
  파드 시큐리티 스탠다드에 정의된 여러 가지 정책 레벨에 대한 세부사항
content_type: concept
weight: 10
---

<!-- overview -->

파드 시큐리티 스탠다드에서는 보안 범위를 넓게 다루기 위해 세 가지 _정책을_ 정의한다.
이러한 정책은 _점증적이며_ 매우 허용적인 것부터 매우 제한적인 것까지 있다.
이 가이드는 각 정책의 요구사항을 간략히 설명한다.

| 프로필 | 설명 |
| ------ | ----------- |
| <strong style="white-space: nowrap">특권(Privileged)</strong> | 무제한 정책으로, 가장 넓은 범위의 권한 수준을 제공한다. 이 정책은 알려진 권한 상승(privilege escalations)을 허용한다. |
| <strong style="white-space: nowrap">기본(Baseline)</strong> | 알려진 권한 상승을 방지하는 최소한의 제한 정책이다. 기본(최소로 명시된) 파드 구성을 허용한다. |
| <strong style="white-space: nowrap">제한(Restricted)</strong> | 엄격히 제한된 정책으로 현재 파드 하드닝 모범 사례를 따른다. |

<!-- body -->

## 프로필 세부사항

### 특권(Privileged) {#privileged}

**_특권_ 정책은 의도적으로 열려있으며 전적으로 제한이 없다.** 이러한 종류의 정책은
권한이 있고 신뢰할 수 있는 사용자가 관리하는 시스템 및 인프라 수준의 워크로드를 대상으로 한다. 

특권 정책은 제한 사항이 없는 것으로 정의한다. 기본으로 허용하는 메커니즘(예를 들면, gatekeeper)은 당연히 특권 정책일 수 있다.
반대로, 기본적으로 거부하는 메커니즘(예를 들면, 파드 시큐리티 폴리시)의 경우 특권 정책은
모든 제한 사항을 비활성화해야 한다.

### 기본(Baseline) {#baseline}

**_기본_ 정책은 알려진 권한 상승을 방지하면서 일반적인 컨테이너 워크로드에 대해 정책 채택을 쉽게 하는 것을 목표로 한다.**
이 정책은 일반적인(non-critical) 애플리케이션의 운영자 및 개발자를 대상으로 한다.
아래 명시한 제어 방식은 다음과 같이
강행되거나 금지되어야 한다.

{{< note >}}
다음 표에서 와일드카드(`*`)는 리스트에 포함된 모든 요소들을 가리킨다. 
예를 들어, `spec.containers[*].securityContext`는 시큐리티 컨텍스트 오브젝트에 _정의되어 있는 모든 컨테이너를_ 가리킨다. 
정의된 컨테이너 중 하나라도 요구사항을 충족시키지 못한다면, 파드 전체가 
검증 과정에서 실패한다.
{{< /note >}}

<table>
	<caption style="display:none">기본(Baseline) 정책 명세서</caption>
	<tbody>
		<tr>
			<th>제어</th>
			<th>정책</th>
		</tr>
		<tr>
			<td style="white-space: nowrap">호스트 프로세스</td>
			<td>
				<p>윈도우 파드는 <a href="/docs/tasks/configure-pod-container/create-hostprocess-pod">호스트 프로세스 컨테이너</a>를 실행할 권한을 제공하며, 이는 윈도우 노드에 대한 특권 접근을 가능하게 한다. 기본 정책에서의 호스트에 대한 특권 접근은 허용되지 않는다. {{< feature-state for_k8s_version="v1.23" state="beta" >}}</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.containers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.initContainers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.windowsOptions.hostProcess</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">호스트 네임스페이스</td>
			<td>
				<p>호스트 네임스페이스 공유는 금지된다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.hostNetwork</code></li>
					<li><code>spec.hostPID</code></li>
					<li><code>spec.hostIPC</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">특권 컨테이너</td>
			<td>
				<p>특권 파드(Privileged Pods)는 대부분의 보안 메커니즘을 비활성화하므로 금지된다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.privileged</code></li>
					<li><code>spec.initContainers[*].securityContext.privileged</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.privileged</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">기능(Capabilities)</td>
			<td>
				<p>아래 명시되지 않은 부가 기능을 추가하는 작업은 금지된다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
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
			<td style="white-space: nowrap">호스트 경로(hostPath) 볼륨</td>
			<td>
				<p>호스트 경로 볼륨은 금지된다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.volumes[*].hostPath</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>Undefined/nil</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">호스트 포트</td>
			<td>
				<p>호스트 포트는 허용되지 않아야 하며, 또는 적어도 알려진 목록 범위내로 제한되어야 한다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.containers[*].ports[*].hostPort</code></li>
					<li><code>spec.initContainers[*].ports[*].hostPort</code></li>
					<li><code>spec.ephemeralContainers[*].ports[*].hostPort</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li>Known list</li>
					<li><code>0</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">AppArmor</td>
			<td>
				<p>지원되는 호스트에서는, <code>runtime/default</code> AppArmor 프로필이 기본으로 적용된다. 기본 정책은 기본 AppArmor 프로필이 오버라이드 및 비활성화되는 것을 방지해야 하며, 또는 허용된 프로필에 한해서만 오버라이드 되도록 제한해야 한다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>metadata.annotations["container.apparmor.security.beta.kubernetes.io/*"]</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
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
				<p>SELinux 타입을 설정하는 것은 제한되며, 맞춤 SELinux 사용자 및 역할 옵션을 설정하는 것은 금지되어 있다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.type</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>Undefined/""</li>
					<li><code>container_t</code></li>
					<li><code>container_init_t</code></li>
					<li><code>container_kvm_t</code></li>
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
					<li>Undefined/""</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><code>/proc</code> 마운트 타입</td>
			<td>
				<p>기본 <code>/proc</code> 마스크는 공격 가능 영역을 최소화하기 위해 설정되고 필수이다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.procMount</code></li>
					<li><code>spec.initContainers[*].securityContext.procMount</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.procMount</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>Default</code></li>
				</ul>
			</td>
		</tr>
		<tr>
  			<td>Seccomp</td>
  			<td>
  				<p>Seccomp 프로필은 <code>Unconfined</code>으로 설정하면 안된다.</p>
  				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
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
				<p>Sysctls는 보안 메커니즘을 비활성화 시키거나 호스트에 위치한 모든 컨테이너에 영향을 미칠 수 있으며, 허용된 "안전한" 서브넷을 제외한 곳에서는 허용되지 않아야 한다. 컨테이너 또는 파드 네임스페이스에 속해 있거나, 같은 노드 내의 다른 파드 및 프로세스와 격리된 상황에서만 sysctl 사용이 안전하다고 간주한다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.securityContext.sysctls[*].name</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>Undefined/nil</li>
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

### 제한(Restricted) {#restricted}

**_제한_ 정책은 일부 호환성을 희생하면서 현재 사용되고 있는 파드 하드닝 모범 사례 시행하는 것을 목표로 한다.** 
보안이 중요한 애플리케이션의 운영자 및 개발자는 물론 신뢰도가 낮은 사용자도 대상으로 한다.
아래에 나열된 제어 방식은
강제되거나 금지되어야 한다.

{{< note >}}
다음 표에서 와일드카드(`*`)는 리스트에 포함된 모든 요소들을 가리킨다. 
예를 들어, `spec.containers[*].securityContext`는 시큐리티 컨텍스트 오브젝트에 _정의되어 있는 모든 컨테이너를_ 가리킨다. 
나열된 컨테이너 중 하나라도 요구사항을 충족시키지 못한다면, 파드 전체가 
검증에 실패한다.
{{< /note >}}

<table>
	<caption style="display:none">제한 정책 명세서</caption>
	<tbody>
		<tr>
			<td><strong>제어</strong></td>
			<td><strong>정책</strong></td>
		</tr>
		<tr>
			<td colspan="2"><em>기본 프로필에 해당하는 모든 요소</em></td>
		</tr>
		<tr>
			<td style="white-space: nowrap">볼륨 타입</td>
			<td>
				<p>제한 정책은 다음과 같은 볼륨 타입만 허용한다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.volumes[*]</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<code>spec.volumes[*]</code> 목록에 속한 모든 아이템은 다음 필드 중 하나를 null이 아닌 값으로 설정해야 한다.
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
			<td style="white-space: nowrap">권한 상승(v1.8+)</td>
			<td>
				<p>권한 상승(예를 들어, set-user-ID 또는 set-group-ID 파일 모드를 통한)은 허용되지 않아야 한다. <em>v1.25+에서는 <a href="#policies-specific-to-linux">리눅스 전용 정책이다.</a><code>(spec.os.name != windows)</code></em></p>
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
			<td style="white-space: nowrap">루트가 아닌 권한으로 실행</td>
			<td>
				<p>컨테이너는 루트가 아닌 사용자 권한으로 실행되어야 한다.</p>
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
					pod-level에서 <code>spec.securityContext.runAsNonRoot</code>가 <code>true</code>로 설정되면
					컨테이너 필드는 undefined/<code>nil</code>로 설정될 수 있다.
				</small>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">루트가 아닌 사용자로 실행(v1.23+)</td>
			<td>
				<p>컨테이너에서는 <tt>runAsUser</tt> 값을 0으로 설정하지 않아야 한다.</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsUser</code></li>
					<li><code>spec.containers[*].securityContext.runAsUser</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsUser</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsUser</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li>any non-zero value</li>
					<li><code>undefined/null</code></li>
				</ul>
			</td>
		</tr>
		<tr>
  			<td style="white-space: nowrap">Seccomp(v1.19+)</td>
  			<td>
  				<p>Seccomp 프로필은 다음과 같은 값으로 설정되어야 한다.<code>Unconfined</code> 프로필 및 프로필의 <em>absence</em>는 금지되어 있다. <em>v1.25+에서는 <a href="#policies-specific-to-linux">리눅스 전용 정책이다.</a><code>(spec.os.name != windows)</code></em></p>
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
					pod-level의 <code>spec.securityContext.seccompProfile.type</code> 필드가 적절하게 설정되면, 
					컨테이너 필드는 undefined/<code>nil</code>로 설정될 수 있다.
					모든 컨테이너 레벨 필드가 설정되어 있다면, 
					pod-level 필드는 undefined/<code>nil</code>로 설정될 수 있다.
				</small>
  			</td>
  		</tr>
		  <tr>
			<td style="white-space: nowrap">능력(Capabilities) (v1.22+)</td>
			<td>
				<p>
					컨테이너는 <code>ALL</code> 능력을 내려놓아야 하며, 
					<code>NET_BIND_SERVICE</code> 능력을 다시 추가하기 위한 목적일 때만 허용되어야 한다. <em>v1.25+에서는 <a href="#policies-specific-to-linux">리눅스 전용 정책이다.</a><code>(spec.os.name != windows)</code></em>
				</p>
				<p><strong>제한된 필드</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.drop</code></li>
				</ul>
				<p><strong>허용된 값</strong></p>
				<ul>
					<li><code>ALL</code>을 포함하고 있는 모든 능력 리스트</li>
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
					<li>Undefined/nil</li>
					<li><code>NET_BIND_SERVICE</code></li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>

## 정책 초기화

정책 초기화에서의 디커플링(Decoupling) 정책 정의는,
내재되어 있는 시행 메커니즘과 별개로
클러스터 사이의 공통된 이해와 일관된 정책 언어 사용을 가능하게끔 한다.

메커니즘이 발달함에 따라, 아래와 같이 정책별로 정의가 될 것이다.
개별 정책에 대한 시행 방식은 여기서 정의하고 있지 않는다.

[**파드 시큐리티 어드미션 컨트롤러**](/ko/docs/concepts/security/pod-security-admission/)

- {{< example file="security/podsecurity-privileged.yaml" >}}특권 네임스페이스{{< /example >}}
- {{< example file="security/podsecurity-baseline.yaml" >}}기본 네임스페이스{{< /example >}}
- {{< example file="security/podsecurity-restricted.yaml" >}}제한 네임스페이스{{< /example >}}

### 대안

{{% thirdparty-content %}}

쿠버네티스 환경에서 정책을 시행하기 위한 대안이 개발되고 있으며 다음은 몇 가지 예시이다. 

- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io/policies/pod-security/)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)

## 파드 OS 필드

쿠버네티스에서는 리눅스 또는 윈도우를 실행하는 노드를 사용할 수 있다.
하나의 클러스터에 두 종류의 노드를 혼합하여 사용할 수 있다.
윈도우 환경 쿠버네티스는 리눅스 기반 워크로드와 비교하였을 때 몇 가지 제한사항 및 차별점이 있다.
구체적으로 말하자면, 대부분의 파드 `securityContext` 필드는 
[윈도우 환경에서 효과가 없다](/ko/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext).

{{< note >}}
v1.24 이전 Kubelet은 파드 OS 필드를 필수로 요구하지 않으며, 만일 클러스터 내에 v1.24 이전에 해당하는 노드가 있다면 v1.25 이전 버전의 제한 정책을 적용해야 한다.
{{< /note >}}

### 제한 파드의 시큐리티 스탠다드 변화
쿠버네티스 v1.25에서 나타난 또 다른 중요 변화는, _제한_ 파드 시큐리티가 `pod.spec.os.name` 필드를 사용하도록 업데이트 되었다는 것이다.
특정 OS에 특화된 일부 정책은 OS 이름에 근거하여 
다른 OS에 대해서는 완화될 수 있다


#### 특정 OS 정책 제어
`spec.os.name`의 값이 `windows`가 아닐 시에만 다음 제어 항목에 대한 제한 사항이 요구된다.
- 권한 상승
- Seccomp
- Linux 기능

## FAQ

### 왜 특권 프로필과 기본 프로필 사이의 프로필은 없는 것인가?

여기서 정의된 세 가지 프로필은 가장 높은 보안에서(제한 프로필) 가장 낮은 보안까지(특권 프로필)
명백한 선형 관계를 가지며 넓은 범위의 워크로드를 다룬다. 
기본 정책을 넘는 요청 권한은 일반적으로 애플리케이션 전용에 속하므로 이러한 틈새시장에 대해서는 표준 프로필을 제공하지 않는다.
이 경우에는 항상 특권 프로필을 사용해야 한다는 주장은 아니지만, 
해당 영역의 정책은 케이스 별로 정의되어야 한다는 것이다.

이외 프로필이 분명히 필요하다면 SIG Auth는 향후에 이러한 입장을 재고할 수 있다. 

### 시큐리티 컨텍스트와 시큐리티 프로필의 차이점은 무엇인가?

[시큐리티 컨텍스트](/docs/tasks/configure-pod-container/security-context/)는 파드 및 컨테이너를 런타임에 설정한다. 
시큐리티 컨텍스트는 파드 매니페스트 내 
파드 및 컨테이너 명세의 일부로 정의되고 컨테이너 런타임에 파라미터로 제공한다. 

시큐리티 프로필은 컨트롤 플레인 메커니즘으로, 시큐리티 컨텍스트의 상세 설정을 비롯하여 
시큐리티 컨텍스트 외부의 다른 관련된 파라미터도 적용한다.
2021년 7월부로, [파드 시큐리티 폴리시](/ko/docs/concepts/security/pod-security-policy/)는 
내장된 [파드 시큐리티 어드미션 컨트롤러](/ko/docs/concepts/security/pod-security-admission/)에 의해 대체되어 사용이 중단되었다. 


### 샌드박스 파드는 어떠한가?

현재로서는, 파드가 샌드박스 특성을 가지는지 제어할 수 있는 API 표준이 존재하지 않는다.
샌드박스 파드는 샌드박스 런타임(예를 들면, gVisor 혹은 Kata 컨테이너)을 통해 식별할 수 있지만, 
샌드박스 런타임이 무엇인지에 대한 표준 정의는 없는 상태이다.

샌드박스 워크로드가 필요로하는 보호물은 다른 워크로드와 다를 수 있다.
예를 들어, 내재된 커널과 분리된 워크로드에서는 제한된 특수 권한의 필요성이 적어진다.
이는 높아진 권한을 요구하는 워크로드가 분리될 수 있도록 허용한다.

추가적으로, 샌드박스 방식에 따라 샌드박스 워크로드에 대한 보호가 달라진다.
이와 같은 경우에는, 하나의 프로필만을 모든 샌드박스 워크로드에 대해 권장할 수 없다.

