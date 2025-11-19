---
title: 從 PodSecurityPolicy 映射到 Pod 安全性標準
content_type: concept
weight: 95
---

<!--
reviewers:
- tallclair
- liggitt
title: Mapping PodSecurityPolicies to Pod Security Standards
content_type: concept
weight: 95
-->

<!-- overview -->

<!--
The tables below enumerate the configuration parameters on
`PodSecurityPolicy` objects,  whether the field mutates
and/or validates pods, and how the configuration values map to the
[Pod Security Standards](/docs/concepts/security/pod-security-standards/).
-->
下面的表格列舉了 `PodSecurityPolicy`
對象上的配置參數，這些字段是否會變更或檢查 Pod 配置，以及這些配置值如何映射到
[Pod 安全性標準（Pod Security Standards）](/zh-cn/docs/concepts/security/pod-security-standards/)
之上。

<!--
For each applicable parameter, the allowed values for the
[Baseline](/docs/concepts/security/pod-security-standards/#baseline) and
[Restricted](/docs/concepts/security/pod-security-standards/#restricted) profiles are listed.
Anything outside the allowed values for those profiles would fall under the
[Privileged](/docs/concepts/security/pod-security-standards/#privileged) profile. "No opinion"
means all values are allowed under all Pod Security Standards.
-->
對於每個可應用的參數，表格中給出了
[Baseline](/zh-cn/docs/concepts/security/pod-security-standards/#baseline) 和
[Restricted](/zh-cn/docs/concepts/security/pod-security-standards/#restricted)
配置下可接受的取值。
對這兩種配置而言不可接受的取值均歸入
[Privileged](/zh-cn/docs/concepts/security/pod-security-standards/#privileged)
配置下。“無意見”意味着對所有 Pod 安全性標準而言所有取值都可接受。

<!--
For a step-by-step migration guide, see
[Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp/).
-->
如果想要了解如何一步步完成遷移，可參閱[從 PodSecurityPolicy 遷移到內置的 PodSecurity 准入控制器](/zh-cn/docs/tasks/configure-pod-container/migrate-from-psp/)。

<!-- body -->

<!--
## PodSecurityPolicy Spec

The fields enumerated in this table are part of the `PodSecurityPolicySpec`, which is specified
under the `.spec` field path.
-->
## PodSecurityPolicy 規約   {#podsecuritypolicy-spec}

下面表格中所列舉的字段是 `PodSecurityPolicySpec` 的一部分，是通過 `.spec`
字段路徑來設置的。

<table class="no-word-break">
  <caption style="display:none"><!--Mapping PodSecurityPolicySpec fields to Pod Security Standards-->從 PodSecurityPolicySpec 字段映射到 Pod Security 標準</caption>
    <tbody>
      <tr>
      <th><code>PodSecurityPolicySpec</code></th>
      <th><!-- Type -->類型</th>
      <th><!--Pod Security Standards Equivalent-->Pod 安全性標準中對應設置</th>
    </tr>
    <tr>
      <td><code>privileged</code></td>
      <td><!-- Validating -->檢查性質</td>
      <td><b>Baseline & Restricted</b>: <code>false</code> / 未定義 / nil</td>
    </tr>
    <tr>
      <td><code>defaultAddCapabilities</code></td>
      <td><!-- Mutating & Validating -->更改性質 & 檢查性質</td>
      <td><!--Requirements match <code>allowedCapabilities</code> below.-->需求滿足下面的 <code>allallowedCapabilities</code></td>
    </tr>
    <tr>
      <td><code>allowedCapabilities</code></td>
      <td><!-- Validating -->檢查性質</td>
      <td>
        <!-- p><b>Baseline</b>: subset of</p -->
        <p><b>Baseline</b>：下面各項的子集</p>
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
        <!-- p><b>Restricted</b>: empty / undefined / nil OR a list containing <i>only</i> <code>NET_BIND_SERVICE</code -->
        <p><b>Restricted</b>：空 / 未定義 / nil 或<i>僅</i>包含 <code>NET_BIND_SERVICE</code> 的列表</p>
      </td>
    </tr>
    <tr>
      <td><code>requiredDropCapabilities</code></td>
      <td><!--Mutating & Validating-->更改性質 & 檢查性質</td>
      <td>
        <p><b>Baseline</b><!-- : no opinion-->：無意見</p>
        <p><b>Restricted</b><!-- : must include-->：必須包含 <code>ALL</code></p>
      </td>
    </tr>
    <tr>
      <td><code>volumes</code></td>
      <td><!-- Validating -->檢查性質</td>
      <td>
        <p><b>Baseline</b><!--: anything except -->除下列取值之外的任何值</p>
        <ul>
          <li><code>hostPath</code></li>
          <li><code>*</code></li>
        </ul>
        <p><b>Restricted</b><!-- : subset of-->：下列取值的子集</p>
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
      <td><!-- Validating -->檢查性質</td>
      <td><b>Baseline & Restricted</b>：<code>false</code> / 未定義 / nil</td>
    </tr>
    <tr>
      <td><code>hostPorts</code></td>
      <td><!-- Validating -->檢查性質</td>
      <td><b>Baseline & Restricted</b>：未定義 / nil / 空</td>
    </tr>
    <tr>
      <td><code>hostPID</code></td>
      <td><!-- Validating -->檢查性質</td>
      <td><b>Baseline & Restricted</b>：<code>false</code> / 未定義 / nil</td>
    </tr>
    <tr>
      <td><code>hostIPC</code></td>
      <td><!-- Validating -->檢查性質</td>
      <td><b>Baseline & Restricted</b>：<code>false</code> / 未定義 / nil</td>
    </tr>
    <tr>
      <td><code>seLinux</code></td>
      <td><!-- Mutating & Validating -->更改性質 & 檢查性質</td>
      <td>
        <p><b>Baseline & Restricted</b>：
        <!-- code>seLinux.rule</code> is <code>MustRunAs</code>, with the following <code>options</code-->
        <code>seLinux.rule</code> 爲 <code>MustRunAs</code>，且 <code>options</code> 如下：
        </p>
        <ul>
          <!--
          <li><code>user</code> is unset (<code>""</code> / undefined / nil)</li>
          <li><code>role</code> is unset (<code>""</code> / undefined / nil)</li>
          <li><code>type</code> is unset or one of: <code>container_t, container_init_t, container_kvm_t, container_engine_t</code></li>
          <li><code>level</code> is anything</li>
          -->
          <li><code>user</code> 未設置（<code>""</code> / 未定義 / nil）</li>
          <li><code>role</code> 未設置（<code>""</code> / 未定義 / nil）</li>
          <li><code>type</code> 未設置或者取值爲 <code>container_t</code>、<code>container_init_t</code>、<code>container_kvm_t</code> 或 <code>container_engine_t</code> 之一</li>
          <li><code>level</code> 是任何取值</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>runAsUser</code></td>
      <td><!-- Mutating & Validating -->變更性質 & 檢查性質</td>
      <td>
        <p><b>Baseline</b><!-- : Anything -->：任何取值</p>
        <p><b>Restricted</b><!-- : <code>rule</code> is <code>MustRunAsNonRoot</code -->：<code>rule</code> 是 <code>MustRunAsNonRoot</code></p>
      </td>
    </tr>
    <tr>
      <td><code>runAsGroup</code></td>
      <td><!-- Mutating (MustRunAs) & Validating-->變更性質（MustRunAs）& 檢查性質</td>
      <td>
        <i><!-- No opinion -->無意見</i>
      </td>
    </tr>
    <tr>
      <td><code>supplementalGroups</code></td>
      <td><!-- Mutating & Validating -->變更性質 & 檢查性質</td>
      <td>
        <i><!-- No opinion -->無意見</i>
      </td>
    </tr>
    <tr>
      <td><code>fsGroup</code></td>
      <td><!-- Mutating & Validating -->變更性質 & 驗證性質</td>
      <td>
        <i><!-- No opinion -->無意見</i>
      </td>
    </tr>
    <tr>
      <td><code>readOnlyRootFilesystem</code></td>
      <td><!-- Mutating & Validating -->變更性質 & 檢查性質</td>
      <td>
        <i><!-- No opinion -->無意見</i>
      </td>
    </tr>
    <tr>
      <td><code>defaultAllowPrivilegeEscalation</code></td>
      <td><!-- Mutating -->變更性質</td>
      <td>
        <i><!-- No opinion (non-validating) -->無意見（非變更性質）</i>
      </td>
    </tr>
    <tr>
      <td><code>allowPrivilegeEscalation</code></td>
      <td><!-- Mutating & Validating -->變更性質 & 檢查性質</td>
      <td>
        <!--
        <p><i>Only mutating if set to <code>false</code></i></p>
        <p><b>Baseline</b>: No opinion</p>
        <p><b>Restricted</b>: <code>false</code></p>
        -->
        <p><i>只有設置爲 <code>false</code> 時才執行變更動作</i></p>
        <p><b>Baseline</b>：無意見</p>
        <p><b>Restricted</b>：<code>false</code></p>
      </td>
    </tr>
    <tr>
      <td><code>allowedHostPaths</code></td>
      <td><!-- Validating -->檢查性質</td>
      <td><i><!-- No opinion (volumes takes precedence)-->無意見（volumes 優先）</i></td>
    </tr>
    <tr>
      <td><code>allowedFlexVolumes</code></td>
      <td><!-- Validating -->檢查性質</td>
      <td><i><!-- No opinion (volumes takes precedence)-->無意見（volumes 優先）</i></td>
    </tr>
    <tr>
      <td><code>allowedCSIDrivers</code></td>
      <td><!-- Validating -->檢查性質</td>
      <td><i><!-- No opinion (volumes takes precedence) -->無意見（volumes 優先）</i></td>
    </tr>
    <tr>
      <td><code>allowedUnsafeSysctls</code></td>
      <td><!-- Validating -->檢查性質</td>
      <td><b>Baseline & Restricted</b>：未定義 / nil / 空</td>
    </tr>
    <tr>
      <td><code>forbiddenSysctls</code></td>
      <td><!-- Validating -->檢查性質</td>
      <td><i><!-- No opinion -->無意見</i></td>
    </tr>
    <tr>
      <td><code>allowedProcMountTypes</code><br><i>(alpha feature)</i></td>
      <td><!-- Validating -->檢查性質</td>
      <!-- td><b>Baseline & Restricted</b>: <code>["Default"]</code> OR undefined / nil / empty</td -->
      <td><b>Baseline & Restricted</b>：<code>["Default"]</code> 或者未定義 / nil / 空</td>
    </tr>
    <tr>
      <td><code>runtimeClass</code><br><code>&nbsp;.defaultRuntimeClassName</code></td>
      <td><!-- Mutating -->變更性質</td>
      <td><i><!-- No opinion -->無意見</i></td>
    </tr>
    <tr>
      <td><code>runtimeClass</code><br><code>&nbsp;.allowedRuntimeClassNames</code></td>
      <td><!-- Validating -->檢查性質</td>
      <td><i><!-- No opinion -->無意見</i></td>
    </tr>
  </tbody>
</table>

<!--
## PodSecurityPolicy annotations

The [annotations](/docs/concepts/overview/working-with-objects/annotations/) enumerated in this
table can be specified under `.metadata.annotations` on the PodSecurityPolicy object.
-->
## PodSecurityPolicy 註解    {#podsecuritypolicy-annotations}

下面表格中所列舉的[註解](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)可以通過
`.metadata.annotations` 設置到 PodSecurityPolicy 對象之上。

<table class="no-word-break">
  <caption style="display:none"><!-- Mapping PodSecurityPolicy annotations to Pod Security Standards-->將 PodSecurityPolicy 註解映射到 Pod 安全性標準</caption>
  <tbody>
    <tr>
      <th><code><!--PSP Annotation-->PSP 註解</code></th>
      <th><!-- Type -->類型</th>
      <th><!-- Pod Security Standards Equivalent-->Pod 安全性標準中對應設置</th>
    </tr>
    <tr>
      <td><code>seccomp.security.alpha.kubernetes.io</code><br><code>/defaultProfileName</code></td>
      <td><!-- Mutating -->變更性質</td>
      <td><i><!-- No opinion -->無意見</i></td>
    </tr>
    <tr>
      <td><code>seccomp.security.alpha.kubernetes.io</code><br><code>/allowedProfileNames</code></td>
      <td><!-- Validating -->檢查性質</td>
      <td>
        <!--
        <p><b>Baseline</b>: <code>"runtime/default,"</code> <i>(Trailing comma to allow unset)</i></p>
        <p><b>Restricted</b>: <code>"runtime/default"</code> <i>(No trailing comma)</i></p>
        <p><i><code>localhost/*</code> values are also permitted for both Baseline & Restricted.</i></p>
        -->
        <p><b>Baseline</b>：<code>"runtime/default,"</code> <i>（其中尾部的逗號允許取消設置）</i></p>
        <p><b>Restricted</b>：<code>"runtime/default"</code> <i>（沒有尾部逗號）</i></p>
        <p><i><code>localhost/*</code> 取值對於 Baseline 和 Restricted 都是可接受的</i></p>
      </td>
    </tr>
    <tr>
      <td><code>apparmor.security.beta.kubernetes.io</code><br><code>/defaultProfileName</code></td>
      <td><!-- Mutating -->變更性質</td>
      <td><i><!-- No opinion -->無意見</i></td>
    </tr>
    <tr>
      <td><code>apparmor.security.beta.kubernetes.io</code><br><code>/allowedProfileNames</code></td>
      <td><!-- Validating -->檢查性質</td>
      <td>
        <!--
        <p><b>Baseline</b>: <code>"runtime/default,"</code> <i>(Trailing comma to allow unset)</i></p>
        <p><b>Restricted</b>: <code>"runtime/default"</code> <i>(No trailing comma)</i></p>
        <p><i><code>localhost/*</code> values are also permitted for both Baseline & Restricted.</i></p>
        -->
        <p><b>Baseline</b>：<code>"runtime/default,"</code> <i>（其中尾部的逗號允許取消設置）</i></p>
        <p><b>Restricted</b>：<code>"runtime/default"</code> <i>（沒有尾部逗號）</i></p>
        <p><i><code>localhost/*</code> 取值對於 Baseline 和 Restricted 都是可接受的</i></p>
      </td>
    </tr>
  </tbody>
</table>

