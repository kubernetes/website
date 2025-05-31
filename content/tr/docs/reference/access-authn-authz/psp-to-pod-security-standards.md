---
reviewers:
- tallclair
- liggitt
title: Mapping PodSecurityPolicies to Pod Security Standards
content_type: concept
weight: 95
---

<!-- overview -->
The tables below enumerate the configuration parameters on
`PodSecurityPolicy` objects, whether the field mutates
and/or validates pods, and how the configuration values map to the
[Pod Security Standards](/docs/concepts/security/pod-security-standards/).

For each applicable parameter, the allowed values for the
[Baseline](/docs/concepts/security/pod-security-standards/#baseline) and
[Restricted](/docs/concepts/security/pod-security-standards/#restricted) profiles are listed.
Anything outside the allowed values for those profiles would fall under the
[Privileged](/docs/concepts/security/pod-security-standards/#privileged) profile. "No opinion"
means all values are allowed under all Pod Security Standards.

For a step-by-step migration guide, see
[Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp/).

<!-- body -->

## PodSecurityPolicy Spec

The fields enumerated in this table are part of the `PodSecurityPolicySpec`, which is specified
under the `.spec` field path.

<table class="no-word-break">
  <caption style="display:none">Mapping PodSecurityPolicySpec fields to Pod Security Standards</caption>
  <tbody>
    <tr>
      <th><code>PodSecurityPolicySpec</code></th>
      <th>Type</th>
      <th>Pod Security Standards Equivalent</th>
    </tr>
    <tr>
      <td><code>privileged</code></td>
      <td>Validating</td>
      <td><b>Baseline & Restricted</b>: <code>false</code> / undefined / nil</td>
    </tr>
    <tr>
      <td><code>defaultAddCapabilities</code></td>
      <td>Mutating & Validating</td>
      <td>Requirements match <code>allowedCapabilities</code> below.</td>
    </tr>
    <tr>
      <td><code>allowedCapabilities</code></td>
      <td>Validating</td>
      <td>
        <p><b>Baseline</b>: subset of</p>
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
        <p><b>Restricted</b>: empty / undefined / nil OR a list containing <i>only</i> <code>NET_BIND_SERVICE</code>
      </td>
    </tr>
    <tr>
      <td><code>requiredDropCapabilities</code></td>
      <td>Mutating & Validating</td>
      <td>
        <p><b>Baseline</b>: no opinion</p>
        <p><b>Restricted</b>: must include <code>ALL</code></p>
      </td>
    </tr>
    <tr>
      <td><code>volumes</code></td>
      <td>Validating</td>
      <td>
        <p><b>Baseline</b>: anything except</p>
        <ul>
          <li><code>hostPath</code></li>
          <li><code>*</code></li>
        </ul>
        <p><b>Restricted</b>: subset of</p>
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
      <td>Validating</td>
      <td><b>Baseline & Restricted</b>: <code>false</code> / undefined / nil</td>
    </tr>
    <tr>
      <td><code>hostPorts</code></td>
      <td>Validating</td>
      <td><b>Baseline & Restricted</b>: undefined / nil / empty</td>
    </tr>
    <tr>
      <td><code>hostPID</code></td>
      <td>Validating</td>
      <td><b>Baseline & Restricted</b>: <code>false</code> / undefined / nil</td>
    </tr>
    <tr>
      <td><code>hostIPC</code></td>
      <td>Validating</td>
      <td><b>Baseline & Restricted</b>: <code>false</code> / undefined / nil</td>
    </tr>
    <tr>
      <td><code>seLinux</code></td>
      <td>Mutating & Validating</td>
      <td>
        <p><b>Baseline & Restricted</b>:
        <code>seLinux.rule</code> is <code>MustRunAs</code>, with the following <code>options</code></p>
        <ul>
          <li><code>user</code> is unset (<code>""</code> / undefined / nil)</li>
          <li><code>role</code> is unset (<code>""</code> / undefined / nil)</li>
          <li><code>type</code> is unset or one of: <code>container_t, container_init_t, container_kvm_t, container_engine_t</code></li>
          <li><code>level</code> is anything</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>runAsUser</code></td>
      <td>Mutating & Validating</td>
      <td>
        <p><b>Baseline</b>: Anything</p>
        <p><b>Restricted</b>: <code>rule</code> is <code>MustRunAsNonRoot</code></p>
      </td>
    </tr>
    <tr>
      <td><code>runAsGroup</code></td>
      <td>Mutating (MustRunAs) & Validating</td>
      <td>
        <i>No opinion</i>
      </td>
    </tr>
    <tr>
      <td><code>supplementalGroups</code></td>
      <td>Mutating & Validating</td>
      <td>
        <i>No opinion</i>
      </td>
    </tr>
    <tr>
      <td><code>fsGroup</code></td>
      <td>Mutating & Validating</td>
      <td>
        <i>No opinion</i>
      </td>
    </tr>
    <tr>
      <td><code>readOnlyRootFilesystem</code></td>
      <td>Mutating & Validating</td>
      <td>
        <i>No opinion</i>
      </td>
    </tr>
    <tr>
      <td><code>defaultAllowPrivilegeEscalation</code></td>
      <td>Mutating</td>
      <td>
        <i>No opinion (non-validating)</i>
      </td>
    </tr>
    <tr>
      <td><code>allowPrivilegeEscalation</code></td>
      <td>Mutating & Validating</td>
      <td>
        <p><i>Only mutating if set to <code>false</code></i></p>
        <p><b>Baseline</b>: No opinion</p>
        <p><b>Restricted</b>: <code>false</code></p>
      </td>
    </tr>
    <tr>
      <td><code>allowedHostPaths</code></td>
      <td>Validating</td>
      <td><i>No opinion (volumes takes precedence)</i></td>
    </tr>
    <tr>
      <td><code>allowedFlexVolumes</code></td>
      <td>Validating</td>
      <td><i>No opinion (volumes takes precedence)</i></td>
    </tr>
    <tr>
      <td><code>allowedCSIDrivers</code></td>
      <td>Validating</td>
      <td><i>No opinion (volumes takes precedence)</i></td>
    </tr>
    <tr>
      <td><code>allowedUnsafeSysctls</code></td>
      <td>Validating</td>
      <td><b>Baseline & Restricted</b>: undefined / nil / empty</td>
    </tr>
    <tr>
      <td><code>forbiddenSysctls</code></td>
      <td>Validating</td>
      <td><i>No opinion</i></td>
    </tr>
    <tr>
      <td><code>allowedProcMountTypes</code><br><i>(alpha feature)</i></td>
      <td>Validating</td>
      <td><b>Baseline & Restricted</b>: <code>["Default"]</code> OR undefined / nil / empty</td>
    </tr>
    <tr>
      <td><code>runtimeClass</code><br><code>&nbsp;.defaultRuntimeClassName</code></td>
      <td>Mutating</td>
      <td><i>No opinion</i></td>
    </tr>
    <tr>
      <td><code>runtimeClass</code><br><code>&nbsp;.allowedRuntimeClassNames</code></td>
      <td>Validating</td>
      <td><i>No opinion</i></td>
    </tr>
  </tbody>
</table>

## PodSecurityPolicy annotations

The [annotations](/docs/concepts/overview/working-with-objects/annotations/) enumerated in this
table can be specified under `.metadata.annotations` on the PodSecurityPolicy object.

<table class="no-word-break">
  <caption style="display:none">Mapping PodSecurityPolicy annotations to Pod Security Standards</caption>
  <tbody>
    <tr>
      <th><code>PSP Annotation</code></th>
      <th>Type</th>
      <th>Pod Security Standards Equivalent</th>
    </tr>
    <tr>
      <td><code>seccomp.security.alpha.kubernetes.io</code><br><code>/defaultProfileName</code></td>
      <td>Mutating</td>
      <td><i>No opinion</i></td>
    </tr>
    <tr>
      <td><code>seccomp.security.alpha.kubernetes.io</code><br><code>/allowedProfileNames</code></td>
      <td>Validating</td>
      <td>
        <p><b>Baseline</b>: <code>"runtime/default,"</code> <i>(Trailing comma to allow unset)</i></p>
        <p><b>Restricted</b>: <code>"runtime/default"</code> <i>(No trailing comma)</i></p>
        <p><i><code>localhost/*</code> values are also permitted for both Baseline & Restricted.</i></p>
      </td>
    </tr>
    <tr>
      <td><code>apparmor.security.beta.kubernetes.io</code><br><code>/defaultProfileName</code></td>
      <td>Mutating</td>
      <td><i>No opinion</i></td>
    </tr>
    <tr>
      <td><code>apparmor.security.beta.kubernetes.io</code><br><code>/allowedProfileNames</code></td>
      <td>Validating</td>
      <td>
        <p><b>Baseline</b>: <code>"runtime/default,"</code> <i>(Trailing comma to allow unset)</i></p>
        <p><b>Restricted</b>: <code>"runtime/default"</code> <i>(No trailing comma)</i></p>
        <p><i><code>localhost/*</code> values are also permitted for both Baseline & Restricted.</i></p>
      </td>
    </tr>
  </tbody>
</table>
