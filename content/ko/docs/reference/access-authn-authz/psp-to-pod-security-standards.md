---
# reviewers:
# - tallclair
# - liggitt
title: 파드시큐리티폴리시(PodSecurityPolicy)를 파드 시큐리티 스탠다드에 매핑
content_type: concept
weight: 95
---

<!-- overview -->
아래 표는 `PodSecurityPolicy` 오브젝트의 구성 파라미터와,
해당 필드가 파드를 변형하는지 그리고/또는 유효성을 검사하는지,
그리고 구성 값이
[파드 시큐리티 스탠다드(Pod Security Standards)](/docs/concepts/security/pod-security-standards/)에 어떻게 매핑되는지를 나열한다.

적용 가능한 각 파라미터에 대해,
[기본(Baseline)](/docs/concepts/security/pod-security-standards/#baseline) 및
[제한(Restricted)](/docs/concepts/security/pod-security-standards/#restricted) 프로파일에서 허용되는 값을 나열한다.
이러한 프로파일에서 허용되는 값을 벗어나는 값은 모두
[특권(Privileged)](/docs/concepts/security/pod-security-standards/#privileged) 프로파일에 해당한다. "규정하지 않음"은
모든 파드 시큐리티 스탠다드에서 모든 값이 허용됨을 의미한다.

단계별 마이그레이션 가이드는
[파드시큐리티폴리시에서 내장 PodSecurity 어드미션 컨트롤러로 마이그레이션](/docs/tasks/configure-pod-container/migrate-from-psp/)을 참고한다.

<!-- body -->

## 파드시큐리티폴리시 스펙

이 표에 나열된 필드는 `PodSecurityPolicySpec`의 일부이며, 이는
`.spec` 필드 경로 아래에 지정된다.

<table class="no-word-break">
  <caption style="display:none">PodSecurityPolicySpec 필드와 파드 시큐리티 스탠다드 매핑</caption>
  <tbody>
    <tr>
      <th><code>PodSecurityPolicySpec</code></th>
      <th>유형</th>
      <th>파드 시큐리티 스탠다드 대응값</th>
    </tr>
    <tr>
      <td><code>privileged</code></td>
      <td>유효성 검사</td>
      <td><b>기본 및 제한</b>: <code>false</code> / 정의되지 않음 / nil</td>
    </tr>
    <tr>
      <td><code>defaultAddCapabilities</code></td>
      <td>변형 및 유효성 검사</td>
      <td>요구 사항은 아래 <code>allowedCapabilities</code>와 일치한다.</td>
    </tr>
    <tr>
      <td><code>allowedCapabilities</code></td>
      <td>유효성 검사</td>
      <td>
        <p><b>기본</b>: 다음의 부분집합</p>
        <ul>
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
        <p><b>제한</b>: 비어 있음 / 정의되지 않음 / nil 또는 <i>오직</i> <code>NET_BIND_SERVICE</code>만 포함하는 목록
      </td>
    </tr>
    <tr>
      <td><code>requiredDropCapabilities</code></td>
      <td>변형 및 유효성 검사</td>
      <td>
        <p><b>기본</b>: 규정하지 않음</p>
        <p><b>제한</b>: <code>ALL</code>을 포함해야 함</p>
      </td>
    </tr>
    <tr>
      <td><code>volumes</code></td>
      <td>유효성 검사</td>
      <td>
        <p><b>기본</b>: 다음을 제외한 모든 값</p>
        <ul>
          <li><code>hostPath</code></li>
          <li><code>*</code></li>
        </ul>
        <p><b>제한</b>: 다음의 부분집합</p>
        <ul>
          <li><code>configMap</code></li>
          <li><code>csi</code></li>
          <li><code>downwardAPI</code></li>
          <li><code>emptyDir</code></li>
          <li><code>ephemeral</code></li>
          <li><code>persistentVolumeClaim</code></li>
          <li><code>projected</code></li>
          <li><code>secret</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>hostNetwork</code></td>
      <td>유효성 검사</td>
      <td><b>기본 및 제한</b>: <code>false</code> / 정의되지 않음 / nil</td>
    </tr>
    <tr>
      <td><code>hostPorts</code></td>
      <td>유효성 검사</td>
      <td><b>기본 및 제한</b>: 정의되지 않음 / nil / 비어 있음</td>
    </tr>
    <tr>
      <td><code>hostPID</code></td>
      <td>유효성 검사</td>
      <td><b>기본 및 제한</b>: <code>false</code> / 정의되지 않음 / nil</td>
    </tr>
    <tr>
      <td><code>hostIPC</code></td>
      <td>유효성 검사</td>
      <td><b>기본 및 제한</b>: <code>false</code> / 정의되지 않음 / nil</td>
    </tr>
    <tr>
      <td><code>seLinux</code></td>
      <td>변형 및 유효성 검사</td>
      <td>
        <p><b>기본 및 제한</b>:
        <code>seLinux.rule</code>이 <code>MustRunAs</code>이며, 다음 <code>options</code>을 가짐</p>
        <ul>
          <li><code>user</code>가 설정되지 않음 (<code>""</code> / 정의되지 않음 / nil)</li>
          <li><code>role</code>이 설정되지 않음 (<code>""</code> / 정의되지 않음 / nil)</li>
          <li><code>type</code>이 설정되지 않았거나 다음 중 하나: <code>container_t, container_init_t, container_kvm_t, container_engine_t</code></li>
          <li><code>level</code>은 어떤 값이든 가능</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>runAsUser</code></td>
      <td>변형 및 유효성 검사</td>
      <td>
        <p><b>기본</b>: 어떤 값이든 가능</p>
        <p><b>제한</b>: <code>rule</code>이 <code>MustRunAsNonRoot</code></p>
      </td>
    </tr>
    <tr>
      <td><code>runAsGroup</code></td>
      <td>변형 (MustRunAs) 및 유효성 검사</td>
      <td>
        <i>규정하지 않음</i>
      </td>
    </tr>
    <tr>
      <td><code>supplementalGroups</code></td>
      <td>변형 및 유효성 검사</td>
      <td>
        <i>규정하지 않음</i>
      </td>
    </tr>
    <tr>
      <td><code>fsGroup</code></td>
      <td>변형 및 유효성 검사</td>
      <td>
        <i>규정하지 않음</i>
      </td>
    </tr>
    <tr>
      <td><code>readOnlyRootFilesystem</code></td>
      <td>변형 및 유효성 검사</td>
      <td>
        <i>규정하지 않음</i>
      </td>
    </tr>
    <tr>
      <td><code>defaultAllowPrivilegeEscalation</code></td>
      <td>변형</td>
      <td>
        <i>규정하지 않음 (유효성 검사 대상 아님)</i>
      </td>
    </tr>
    <tr>
      <td><code>allowPrivilegeEscalation</code></td>
      <td>변형 및 유효성 검사</td>
      <td>
        <p><i><code>false</code>로 설정된 경우에만 변형함</i></p>
        <p><b>기본</b>: 규정하지 않음</p>
        <p><b>제한</b>: <code>false</code></p>
      </td>
    </tr>
    <tr>
      <td><code>allowedHostPaths</code></td>
      <td>유효성 검사</td>
      <td><i>규정하지 않음 (volumes가 우선함)</i></td>
    </tr>
    <tr>
      <td><code>allowedFlexVolumes</code></td>
      <td>유효성 검사</td>
      <td><i>규정하지 않음 (volumes가 우선함)</i></td>
    </tr>
    <tr>
      <td><code>allowedCSIDrivers</code></td>
      <td>유효성 검사</td>
      <td><i>규정하지 않음 (volumes가 우선함)</i></td>
    </tr>
    <tr>
      <td><code>allowedUnsafeSysctls</code></td>
      <td>유효성 검사</td>
      <td><b>기본 및 제한</b>: 정의되지 않음 / nil / 비어 있음</td>
    </tr>
    <tr>
      <td><code>forbiddenSysctls</code></td>
      <td>유효성 검사</td>
      <td><i>규정하지 않음</i></td>
    </tr>
    <tr>
      <td><code>allowedProcMountTypes</code><br><i>(알파 기능)</i></td>
      <td>유효성 검사</td>
      <td><b>기본 및 제한</b>: <code>["Default"]</code> 또는 정의되지 않음 / nil / 비어 있음</td>
    </tr>
    <tr>
      <td><code>runtimeClass</code><br><code>&nbsp;.defaultRuntimeClassName</code></td>
      <td>변형</td>
      <td><i>규정하지 않음</i></td>
    </tr>
    <tr>
      <td><code>runtimeClass</code><br><code>&nbsp;.allowedRuntimeClassNames</code></td>
      <td>유효성 검사</td>
      <td><i>규정하지 않음</i></td>
    </tr>
  </tbody>
</table>

## 파드시큐리티폴리시 어노테이션

이 표에 나열된 [어노테이션](/docs/concepts/overview/working-with-objects/annotations/)은
파드시큐리티폴리시 오브젝트의 `.metadata.annotations` 아래에 지정할 수 있다.

<table class="no-word-break">
  <caption style="display:none">파드시큐리티폴리시 어노테이션과 파드 시큐리티 스탠다드 매핑</caption>
  <tbody>
    <tr>
      <th><code>PSP 어노테이션</code></th>
      <th>유형</th>
      <th>파드 시큐리티 스탠다드 대응값</th>
    </tr>
    <tr>
      <td><code>seccomp.security.alpha.kubernetes.io</code><br><code>/defaultProfileName</code></td>
      <td>변형</td>
      <td><i>규정하지 않음</i></td>
    </tr>
    <tr>
      <td><code>seccomp.security.alpha.kubernetes.io</code><br><code>/allowedProfileNames</code></td>
      <td>유효성 검사</td>
      <td>
        <p><b>기본</b>: <code>"runtime/default,"</code> <i>(설정되지 않은 경우를 허용하기 위한 후행 쉼표)</i></p>
        <p><b>제한</b>: <code>"runtime/default"</code> <i>(후행 쉼표 없음)</i></p>
        <p><i><code>localhost/*</code> 값도 기본 및 제한 모두에서 허용된다.</i></p>
      </td>
    </tr>
    <tr>
      <td><code>apparmor.security.beta.kubernetes.io</code><br><code>/defaultProfileName</code></td>
      <td>변형</td>
      <td><i>규정하지 않음</i></td>
    </tr>
    <tr>
      <td><code>apparmor.security.beta.kubernetes.io</code><br><code>/allowedProfileNames</code></td>
      <td>유효성 검사</td>
      <td>
        <p><b>기본</b>: <code>"runtime/default,"</code> <i>(설정되지 않은 경우를 허용하기 위한 후행 쉼표)</i></p>
        <p><b>제한</b>: <code>"runtime/default"</code> <i>(후행 쉼표 없음)</i></p>
        <p><i><code>localhost/*</code> 값도 기본 및 제한 모두에서 허용된다.</i></p>
      </td>
    </tr>
  </tbody>
</table>
