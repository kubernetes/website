---
api_metadata:
  apiVersion: "policy/v1beta1"
  import: "k8s.io/api/policy/v1beta1"
  kind: "PodSecurityPolicy"
content_type: "api_reference"
description: "PodSecurityPolicy 对影响到安全上下文的请求能力进行治理，而安全上下文可以应用到 Pod 和容器上。"
title: "PodSecurityPolicy v1beta1"
weight: 5
---
<!--
api_metadata:
  apiVersion: "policy/v1beta1"
  import: "k8s.io/api/policy/v1beta1"
  kind: "PodSecurityPolicy"
content_type: "api_reference"
description: "PodSecurityPolicy governs the ability to make requests that affect the Security Context that will be applied to a pod and container."
title: "PodSecurityPolicy v1beta1"
weight: 5
auto_generated: true
-->

`apiVersion: policy/v1beta1`

`import "k8s.io/api/policy/v1beta1"`

## PodSecurityPolicy {#PodSecurityPolicy}

<!--
PodSecurityPolicy governs the ability to make requests that affect the Security Context that will be applied to a pod and container. Deprecated in 1.21.
-->
PodSecurityPolicy 对影响到安全上下文的请求能力进行治理，而安全上下文可以应用到 Pod 和容器上。
在 1.21 中已被弃用。

<hr>

- **apiVersion**: policy/v1beta1

- **kind**: PodSecurityPolicy

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicySpec" >}}">PodSecurityPolicySpec</a>)
  spec defines the policy enforced.
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  
  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicySpec" >}}">PodSecurityPolicySpec</a>)
  
  spec 定义强制执行的策略。

## PodSecurityPolicySpec {#PodSecurityPolicySpec}

<!--
PodSecurityPolicySpec defines the policy enforced.
-->
PodSecurityPolicySpec 定义强制执行的策略。

<hr>

<!--
- **runAsUser** (RunAsUserStrategyOptions), required
  runAsUser is the strategy that will dictate the allowable RunAsUser values that may be set.

  <a name="RunAsUserStrategyOptions"></a>
  *RunAsUserStrategyOptions defines the strategy type and any options used to create the strategy.*
-->
- **runAsUser** (RunAsUserStrategyOptions)，必需
  
  runAsUser 是一种策略，它将规定允许为 runAsUser 设置的值。
  
  <a name="RunAsUserStrategyOptions"></a> 
  **RunAsUserStrategyOptions 定义策略类型和用于创建该策略的任意选项。**
  
  <!--
  - **runAsUser.rule** (string), required
    rule is the strategy that will dictate the allowable RunAsUser values that may be set.

  - **runAsUser.ranges** ([]IDRange)
    ranges are the allowed ranges of uids that may be used. If you would like to force a single uid then supply a single range with the same start and end. Required for MustRunAs.

    <a name="IDRange"></a>
    *IDRange provides a min/max of an allowed range of IDs.*
  -->

  - **runAsUser.rule** (string)，必需
    
    rule 是一种策略，它将规定允许为 runAsUser 设置的值。
  
  - **runAsUser.ranges** ([]IDRange)
    
    ranges 是可以使用的 UID 的允许范围。
    如果你要强制使用某个确定 UID，则应提供起点值和终点值相同的范围设定。
    对于 mustRunAs 而言是必需的。
    
    <a name="IDRange"></a> 
    **IDRange 提供了 ID 的最小/最大允许范围。**
    
    <!--
    - **runAsUser.ranges.max** (int64), required
      max is the end of the range, inclusive.

    - **runAsUser.ranges.min** (int64), required
      min is the start of the range, inclusive.
    -->

    - **runAsUser.ranges.max** (int64)，必需
      
      max 是范围的终点，该值包含在此范围内。
    
    - **runAsUser.ranges.min** (int64)，必需
      
      min 是范围的起点，该值包含在此范围内。

<!--
- **runAsGroup** (RunAsGroupStrategyOptions)
  RunAsGroup is the strategy that will dictate the allowable RunAsGroup values that may be set. If this field is omitted, the pod's RunAsGroup can take any value. This field requires the RunAsGroup feature gate to be enabled.

  <a name="RunAsGroupStrategyOptions"></a>
  *RunAsGroupStrategyOptions defines the strategy type and any options used to create the strategy.*
-->
- **runAsGroup** (RunAsGroupStrategyOptions)
  
  runAsGroup 是一种策略，它将规定可以为 runAsGroup 设置的值。
  如果省略此字段，则 Pod 的 runAsGroup 可以取任何值。
  此字段要求启用 `RunAsGroup` 特性门控。
  
  <a name="RunAsGroupStrategyOptions"></a> 
  **RunAsGroupStrategyOptions 定义策略类型和用于创建该策略的任意选项。**
  
  <!--
  - **runAsGroup.rule** (string), required
    rule is the strategy that will dictate the allowable RunAsGroup values that may be set.

  - **runAsGroup.ranges** ([]IDRange)
    ranges are the allowed ranges of gids that may be used. If you would like to force a single gid then supply a single range with the same start and end. Required for MustRunAs.

    <a name="IDRange"></a>
    *IDRange provides a min/max of an allowed range of IDs.*
  -->

  - **runAsGroup.rule** (string)，必需
    
    rule 是一种策略，它将规定可以为 runAsGroup 设置的值。
  
  - **runAsGroup.ranges** ([]IDRange)
    
    ranges 是可以使用的 GID 的范围。
    如果你要强制使用某个确定的 GID，则可提供起点和终点相同的范围设定。
    对于 mustRunAs 而言是必需的。
    
    <a name="IDRange"></a> 
    **IDRange 提供了 ID 的最小/最大允许范围。**
    
    <!--
    - **runAsGroup.ranges.max** (int64), required
      max is the end of the range, inclusive.

    - **runAsGroup.ranges.min** (int64), required
      min is the start of the range, inclusive.
    -->
    
    - **runAsGroup.ranges.max** (int64)，必需
      
      max 是范围的终点，该值包含在此范围内。
    
    - **runAsGroup.ranges.min** (int64)，必需
      
      min 是范围的起点，该值包含在此范围内。

<!--
- **fsGroup** (FSGroupStrategyOptions), required
  fsGroup is the strategy that will dictate what fs group is used by the SecurityContext.

  <a name="FSGroupStrategyOptions"></a>
  *FSGroupStrategyOptions defines the strategy type and options used to create the strategy.*
-->
- **fsGroup** (FSGroupStrategyOptions)，必需
  
  fsGroup 是一种策略，它将规定 SecurityContext 将使用哪个 fs 组。
  
  <a name="FSGroupStrategyOptions"></a> 
  **FSGroupStrategyOptions 定义策略类型和用于创建该策略的任意选项。**
  
  <!--
  - **fsGroup.ranges** ([]IDRange)
    ranges are the allowed ranges of fs groups.  If you would like to force a single fs group then supply a single range with the same start and end. Required for MustRunAs.

    <a name="IDRange"></a>
    *IDRange provides a min/max of an allowed range of IDs.*
  -->

  - **fsGroup.ranges** ([]IDRange)
    
    ranges 是 fs 组的允许范围。
    如果你要强制使用某个确定的 fs 组，则应提供起点和终点相同的范围设定。
    对于 mustRunAs 而言是必需的。
    
    <a name="IDRange"></a>
    **IDRange 提供了 ID 的最小/最大允许范围。**
    
    <!--
    - **fsGroup.ranges.max** (int64), required
      max is the end of the range, inclusive.

    - **fsGroup.ranges.min** (int64), required
      min is the start of the range, inclusive.
    -->

    - **fsGroup.ranges.max** (int64)，必需
      
      max 是范围的终点，该值包含在此范围内。
    
    - **fsGroup.ranges.min** (int64)，必需
      
      min 是范围的起点，该值包含在此范围内。
  
  <!--
  - **fsGroup.rule** (string)

    rule is the strategy that will dictate what FSGroup is used in the SecurityContext.
  -->

  - **fsGroup.rule** (string)
    
    rule 是一种策略，它将规定 SecurityContext 中使用哪个 FSGroup。

<!--
- **supplementalGroups** (SupplementalGroupsStrategyOptions), required
  supplementalGroups is the strategy that will dictate what supplemental groups are used by the SecurityContext.

  <a name="SupplementalGroupsStrategyOptions"></a>
  *SupplementalGroupsStrategyOptions defines the strategy type and options used to create the strategy.*
-->
- **supplementalGroups** (SupplementalGroupsStrategyOptions)，必需
  
  supplementalGroups 是一种策略，它将规定 SecurityContext 将使用哪个补充组。
  
  <a name="SupplementalGroupsStrategyOptions"></a> 
  **SupplementalGroupsStrategyOptions 定义策略类型和用于创建该策略的任意选项。**
  
  <!--
  - **supplementalGroups.ranges** ([]IDRange)
    ranges are the allowed ranges of supplemental groups.  If you would like to force a single supplemental group then supply a single range with the same start and end. Required for MustRunAs.

    <a name="IDRange"></a>
    *IDRange provides a min/max of an allowed range of IDs.*
  -->

  - **supplementalGroups.ranges** ([]IDRange)
    
    ranges 是补充组的允许范围。
    如果你要强制使用固定的某个补充组，则应提供起点和终点相同的范围设定。
    对于 mustRunAs 而言是必需的。
    
    <a name="IDRange"></a>
    **IDRange 提供了 ID 的最小/最大允许范围。**
    
    <!--
    - **supplementalGroups.ranges.max** (int64), required
      max is the end of the range, inclusive.

    - **supplementalGroups.ranges.min** (int64), required
      min is the start of the range, inclusive.
    -->

    - **supplementalGroups.ranges.max** (int64)，必需
      
      max 是范围的终点，该值包含在此范围内。
    
    - **supplementalGroups.ranges.min** (int64)，必需
      
      min 是范围的起点，该值包含在此范围内。
  
  <!--
  - **supplementalGroups.rule** (string)

    rule is the strategy that will dictate what supplemental groups is used in the SecurityContext.
  -->

  - **supplementalGroups.rule** (string)
    
    rule 是一种策略，它将规定 SecurityContext 中使用哪个补充组。

<!--
- **seLinux** (SELinuxStrategyOptions), required
  seLinux is the strategy that will dictate the allowable labels that may be set.

  <a name="SELinuxStrategyOptions"></a>
  *SELinuxStrategyOptions defines the strategy type and any options used to create the strategy.*
-->
- **seLinux** (SELinuxStrategyOptions)，必需
  
  seLinux 是一种策略，它将规定可以设置的标签集合。
  
  <a name="SELinuxStrategyOptions"></a> 
  **SELinuxStrategyOptions 定义策略类型和用于创建该策略的任意选项。**

  <!--
  - **seLinux.rule** (string), required

    rule is the strategy that will dictate the allowable labels that may be set.

  - **seLinux.seLinuxOptions** (SELinuxOptions)

    seLinuxOptions required to run as; required for MustRunAs More info: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/

    <a name="SELinuxOptions"></a>
    *SELinuxOptions are the labels to be applied to the container*
  -->  

  - **seLinux.rule** (string)，必需
    
    rule 是一种策略，它将规定可以设置的标签集合。
  
  - **seLinux.seLinuxOptions** (SELinuxOptions)
    
    seLinuxOptions 是运行所必需的。对于 mustRunAs 而言是必需的。更多信息：
    https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/security-context/
    
    <a name="SELinuxOptions"></a>
    **SELinuxOptions 是应用到容器的标签。**
    
    <!--
    - **seLinux.seLinuxOptions.level** (string)
      Level is SELinux level label that applies to the container.

    - **seLinux.seLinuxOptions.role** (string)
      Role is a SELinux role label that applies to the container.

    - **seLinux.seLinuxOptions.type** (string)
      Type is a SELinux type label that applies to the container.

    - **seLinux.seLinuxOptions.user** (string)
      User is a SELinux user label that applies to the container.
    -->
    
    - **seLinux.seLinuxOptions.level** (string)
      
      level 是应用到容器的 SELinux 级别标签。
    
    - **seLinux.seLinuxOptions.role** (string)
      
      role 是应用到容器的 SELinux 角色标签。
    
    - **seLinux.seLinuxOptions.type** (string)
      
      type 是应用到容器的 SELinux 类型标签。
    
    - **seLinux.seLinuxOptions.user** (string)
      
      user 是应用到容器的 SELinux 用户标签。

<!--
- **readOnlyRootFilesystem** (boolean)
  readOnlyRootFilesystem when set to true will force containers to run with a read only root file system.  If the container specifically requests to run with a non-read only root file system the PSP should deny the pod. If set to false the container may run with a read only root file system if it wishes but it will not be forced to.

- **privileged** (boolean)
  privileged determines if a pod can request to be run as privileged.
-->
- **readOnlyRootFilesystem** (boolean)
  
  readOnlyRootFilesystem 设为 true 时将强制容器使用只读根文件系统来运行。
  如果容器明确请求以非只读根文件系统来运行，则 PSP 应拒绝该 Pod。
  如果设置为 false，则如果愿意，容器可以以只读根文件系统来运行，但不是必须使用只读根文件系统。

- **privileged** (boolean)
  
  privileged 决定 Pod 是否可以请求以特权模式运行。

<!--
- **allowPrivilegeEscalation** (boolean)
  allowPrivilegeEscalation determines if a pod can request to allow privilege escalation. If unspecified, defaults to true.

- **defaultAllowPrivilegeEscalation** (boolean)
  defaultAllowPrivilegeEscalation controls the default setting for whether a process can gain more privileges than its parent process.
-->
- **allowPrivilegeEscalation** (boolean)
  
  allowPrivilegeEscalation 决定 Pod 是否可以请求允许提升特权。如果未指定，则默认为 true。

- **defaultAllowPrivilegeEscalation** (boolean)
  
  defaultAllowPrivilegeEscalation 控制一个进程是否可以获得比其父进程更多权限的默认设置。

<!--
- **allowedCSIDrivers** ([]AllowedCSIDriver)
  AllowedCSIDrivers is an allowlist of inline CSI drivers that must be explicitly set to be embedded within a pod spec. An empty value indicates that any CSI driver can be used for inline ephemeral volumes. This is a beta field, and is only honored if the API server enables the CSIInlineVolume feature gate.

  <a name="AllowedCSIDriver"></a>
  *AllowedCSIDriver represents a single inline CSI Driver that is allowed to be used.*
-->
- **allowedCSIDrivers** ([]AllowedCSIDriver)
  
  allowedCSIDrivers 是允许使用的内联 CSI 驱动列表，这些驱动必须被显式嵌入到 Pod 规约中。
  空值表示任何 CSI 驱动都可以用于内联临时卷。这是一个 beta 字段，
  只有 API 服务器启用 CSIInlineVolume 特性门控，才会使用此字段。
  
  <a name="AllowedCSIDriver"></a>
  **AllowedCSIDriver 表示允许使用的单个内联 CSI 驱动。**

  <!--
  - **allowedCSIDrivers.name** (string), required
    Name is the registered name of the CSI driver
  -->  
  
  - **allowedCSIDrivers.name** (string)，必需
    
    name 是 CSI 驱动的注册名称。

<!--
- **allowedCapabilities** ([]string)
  allowedCapabilities is a list of capabilities that can be requested to add to the container. Capabilities in this field may be added at the pod author's discretion. You must not list a capability in both allowedCapabilities and requiredDropCapabilities.

- **requiredDropCapabilities** ([]string)
  requiredDropCapabilities are the capabilities that will be dropped from the container.  These are required to be dropped and cannot be added.
-->
- **allowedCapabilities** ([]string)
  
  allowedCapabilities 是可以请求添加到容器的权能列表。
  这个字段中的权能可以由 Pod 作者自行添加。
  你不得同时在 allowedCapabilities 和 requiredDropCapabilities 中列出同一个权能。

- **requiredDropCapabilities** ([]string)
  
  requiredDropCapabilities 是将从容器中丢弃的权能。这些权能需要被丢弃，且不能添加。

<!--
- **defaultAddCapabilities** ([]string)

  defaultAddCapabilities is the default set of capabilities that will be added to the container unless the pod spec specifically drops the capability.  You may not list a capability in both defaultAddCapabilities and requiredDropCapabilities. Capabilities added here are implicitly allowed, and need not be included in the allowedCapabilities list.
-->
- **defaultAddCapabilities** ([]string)
  
  defaultAddCapabilities 是默认被添加到容器的权能集，除非 Pod 规约特意丢弃该权能。
  你不可以同时在 defaultAddCapabilities 和 requiredDropCapabilities 中列出同一个权能。
  此处添加的权能是被隐式允许的，不必包括在 allowedCapabilities 列表中。

<!--
- **allowedFlexVolumes** ([]AllowedFlexVolume)
  allowedFlexVolumes is an allowlist of Flexvolumes.  Empty or nil indicates that all Flexvolumes may be used.  This parameter is effective only when the usage of the Flexvolumes is allowed in the "volumes" field.

  <a name="AllowedFlexVolume"></a>
  *AllowedFlexVolume represents a single Flexvolume that is allowed to be used.*
-->
- **allowedFlexVolumes** ([]AllowedFlexVolume)
  
  allowedFlexVolumes 是允许设置的 FlexVolume 卷的列表。
  空或 nil 值表示可以使用所有 FlexVolume。
  只有在 “volumes” 字段中允许使用 Flexvolume 卷时，此参数才有效。
  
  <a name="AllowedFlexVolume"></a> 
  **AllowedFlexVolume 表示允许使用的单个 Flexvolume。**
  
  <!--
  - **allowedFlexVolumes.driver** (string), required
    driver is the name of the Flexvolume driver.
  -->

  - **allowedFlexVolumes.driver** (string)，必需
    
    driver 是 FlexVolume 驱动的名称。

<!--
- **allowedHostPaths** ([]AllowedHostPath)
  allowedHostPaths is an allowlist of host paths. Empty indicates that all host paths may be used.

  <a name="AllowedHostPath"></a>
  *AllowedHostPath defines the host volume conditions that will be enabled by a policy for pods to use. It requires the path prefix to be defined.*
-->
- **allowedHostPaths** ([]AllowedHostPath)
  
  allowedHostPaths 是允许使用的主机路径的列表。空表示可以使用所有主机路径。
  
  <a name="AllowedHostPath"></a> 
  **allowedHostPath 定义将按 Pod 使用的策略启用的主机卷条件。它要求定义路径前缀。**

  <!--
  - **allowedHostPaths.pathPrefix** (string)
    pathPrefix is the path prefix that the host volume must match. It does not support `*`. Trailing slashes are trimmed when validating the path prefix with a host path.
    
    Examples: `/foo` would allow `/foo`, `/foo/` and `/foo/bar` `/foo` would not allow `/food` or `/etc/foo`
  -->

  - **allowedHostPaths.pathPrefix** (string)
    
    pathPrefix 是主机卷必须匹配的路径前缀。
    此字段不支持 `*`。使用主机路径检验路径前缀时，会裁剪掉尾部的斜线。
    
    例如：`/foo` 将允许 `/foo`、`/foo/` 和 `/foo/bar`。
    `/foo` 将不允许 `/food` 或 `/etc/foo`。
  
  <!--
  - **allowedHostPaths.readOnly** (boolean)
    when set to true, will allow host volumes matching the pathPrefix only if all volume mounts are readOnly.
  -->

  - **allowedHostPaths.readOnly** (boolean)
    
    当设置为 true 时，仅当所有与 pathPrefix 匹配的主机卷的卷挂载均为 readOnly 时，才允许使用。

<!--
- **allowedProcMountTypes** ([]string)

  AllowedProcMountTypes is an allowlist of allowed ProcMountTypes. Empty or nil indicates that only the DefaultProcMountType may be used. This requires the ProcMountType feature flag to be enabled.
-->
- **allowedProcMountTypes** ([]string)
  
  AllowedProcMountTypes 是允许使用的 ProcMountType 的列表。
  空表或 nil 表示仅可以使用 DefaultProcMountType。
  此字段要求启用 ProcMountType 特性门控。

<!--
- **allowedUnsafeSysctls** ([]string)
  allowedUnsafeSysctls is a list of explicitly allowed unsafe sysctls, defaults to none. Each entry is either a plain sysctl name or ends in "*" in which case it is considered as a prefix of allowed sysctls. Single * means all unsafe sysctls are allowed. Kubelet has to allowlist all allowed unsafe sysctls explicitly to avoid rejection.
  
  Examples: e.g. "foo/*" allows "foo/bar", "foo/baz", etc. e.g. "foo.*" allows "foo.bar", "foo.baz", etc.
-->
- **allowedUnsafeSysctls** ([]string)
  
  allowedUnsafeSysctls 是明确允许的不安全 sysctl 的列表，默认为空。
  每个条目要么是一个普通的 sysctl 名称，要么以 “*” 结尾，
  在后面这种情况下字符串值被视为所允许的 sysctl 的前缀。
  单个 `*` 意味着允许所有不安全的 sysctl。
  Kubelet 必须显式列出所有被允许的、不安全的 sysctl，以防被拒绝。
  
  例如 `foo/*` 允许 `foo/bar`、`foo/baz` 等。
  例如 `foo.*` 允许 `foo.bar`、`foo.baz` 等。

<!--
- **forbiddenSysctls** ([]string)
  forbiddenSysctls is a list of explicitly forbidden sysctls, defaults to none. Each entry is either a plain sysctl name or ends in "*" in which case it is considered as a prefix of forbidden sysctls. Single * means all sysctls are forbidden.
  
  Examples: e.g. "foo/*" forbids "foo/bar", "foo/baz", etc. e.g. "foo.*" forbids "foo.bar", "foo.baz", etc.
-->
- **forbiddenSysctls** ([]string)
  
  forbiddenSysctls 是被明确禁止的 sysctl 的列表，默认为空。
  每个条目要么是一个普通的 sysctl 名称，要么以 `*` 结尾，
  以 `*` 结尾的字符串值表示被禁止的 sysctl 的前缀。
  单个 `*` 意味着禁止所有 sysctl。
  
  例如 `foo/*` 禁止 `foo/bar`、`foo/baz` 等。
  例如 `foo.*` 禁止 `foo.bar`、`foo.baz` 等。

<!--
- **hostIPC** (boolean)
  hostIPC determines if the policy allows the use of HostIPC in the pod spec.

- **hostNetwork** (boolean)
  hostNetwork determines if the policy allows the use of HostNetwork in the pod spec.

- **hostPID** (boolean)
  hostPID determines if the policy allows the use of HostPID in the pod spec.
-->
- **hostIPC** (boolean)
  
  hostIPC 决定此策略是否允许在 Pod 规约中使用 hostIPC。

- **hostNetwork** (boolean)
  
  hostNetwork 决定此策略是否允许在 Pod 规约中使用 hostNetwork。

- **hostPID** (boolean)
  
  hostPID 决定此策略是否允许在 Pod 规约中使用 hostPID。

<!--
- **hostPorts** ([]HostPortRange)
  hostPorts determines which host port ranges are allowed to be exposed.

  <a name="HostPortRange"></a>
  *HostPortRange defines a range of host ports that will be enabled by a policy for pods to use.  It requires both the start and end to be defined.*
-->
- **hostPorts** ([]HostPortRange)
  
  hostPorts 决定允许暴露哪些主机端口范围。
  
  <a name="HostPortRange"></a> 
  **HostPortRange 定义将按 Pod 使用的策略启用的主机端口范围。它要求同时定义起点和终点。**
  
  <!--
  - **hostPorts.max** (int32), required
    max is the end of the range, inclusive.

  - **hostPorts.min** (int32), required
    min is the start of the range, inclusive.
  -->

  - **hostPorts.max** (int32)，必需
    
    max 是范围的终点，该值包含在此范围内。
  
  - **hostPorts.min** (int32)，必需
    
    min 是范围的起点，该值包含在此范围内。

<!--
- **runtimeClass** (RuntimeClassStrategyOptions)
  runtimeClass is the strategy that will dictate the allowable RuntimeClasses for a pod. If this field is omitted, the pod's runtimeClassName field is unrestricted. Enforcement of this field depends on the RuntimeClass feature gate being enabled.

  <a name="RuntimeClassStrategyOptions"></a>
  *RuntimeClassStrategyOptions define the strategy that will dictate the allowable RuntimeClasses for a pod.*
-->
- **runtimeClass** (RuntimeClassStrategyOptions)
  
  runtimeClass 是一种策略，它将规定 Pod 所被允许的 RuntimeClass。
  如果省略此字段，则 Pod 的 runtimeClassName 将不受限制。
  该字段的实施取决于被启用的 RuntimeClass 特性门控。
  
  <a name="RuntimeClassStrategyOptions"></a>
  **RuntimeClassStrategyOptions 定义一种策略，它将规定 Pod 所被允许的 RuntimeClass。**
  
  <!--
  - **runtimeClass.allowedRuntimeClassNames** ([]string), required
    allowedRuntimeClassNames is an allowlist of RuntimeClass names that may be specified on a pod. A value of "*" means that any RuntimeClass name is allowed, and must be the only item in the list. An empty list requires the RuntimeClassName field to be unset.

  - **runtimeClass.defaultRuntimeClassName** (string)
    defaultRuntimeClassName is the default RuntimeClassName to set on the pod. The default MUST be allowed by the allowedRuntimeClassNames list. A value of nil does not mutate the Pod.
  -->

  - **runtimeClass.allowedRuntimeClassNames** ([]string)，必需
    
    allowedRuntimeClassNames 是可以在 Pod 中指定的 runtimeClass 名称的列表。
    `*` 值意味着允许任何 runtimeClass 值，并且如果设置了 `*`，则它必须是唯一的列表项。
    空列表要求不能设置 runtimeClassName 字段。
  
  - **runtimeClass.defaultRuntimeClassName** (string)
    
    defaultRuntimeClassName 是要在 Pod 中设置的默认 runtimeClassName。
    该默认值必须被 allowedRuntimeClassNames 列表所允许。nil 值不会改变 Pod 设置。

<!--
- **volumes** ([]string)
  volumes is an allowlist of volume plugins. Empty indicates that no volumes may be used. To allow all volumes you may use '*'.
-->
- **volumes** ([]string)
  
  volumes 是所允许的卷插件的列表。空的列表意味着不可以使用卷。要允许所有卷，你可以使用 `*`。

## PodSecurityPolicyList {#PodSecurityPolicyList}

<!--
PodSecurityPolicyList is a list of PodSecurityPolicy objects.
-->
PodSecurityPolicyList 是 PodSecurityPolicy 对象的列表。

<hr>

- **apiVersion**: policy/v1beta1

- **kind**: PodSecurityPolicyList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>), required
  items is a list of schema objects.
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)
  
  标准的列表元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>)，必需
  
  items 是 PodSecurityPolicy 对象的列表。

<!--
## Operations {#Operations}
<hr>
### `get` read the specified PodSecurityPolicy
#### HTTP Request
-->
## 操作 {#Operations}

<hr>

### `get` 读取指定的 PodSecurityPolicy

#### HTTP 请求

GET /apis/policy/v1beta1/podsecuritypolicies/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PodSecurityPolicy
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需
  
  PodSecurityPolicy 的名称

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind PodSecurityPolicy
#### HTTP Request
-->
### `list` 列出或监视 PodSecurityPolicy 类别的对象

#### HTTP 请求

GET /apis/policy/v1beta1/podsecuritypolicies

<!--
#### Parameters
- **allowWatchBookmarks** (*in query*): boolean
- **continue** (*in query*): string
- **fieldSelector** (*in query*): string
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
- **watch** (*in query*): boolean
-->
#### 参数

- **allowWatchBookmarks** (**查询参数**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **timeoutSeconds** (**查询参数**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查询参数**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicyList" >}}">PodSecurityPolicyList</a>): OK

401: Unauthorized

<!--
### `create` create a PodSecurityPolicy
#### HTTP Request
-->
### `create` 创建 PodSecurityPolicy

#### HTTP 请求

POST /apis/policy/v1beta1/podsecuritypolicies

<!--
#### Parameters
- **body**: <a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **body**: <a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>，必需

- **dryRun** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>): Created

202 (<a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified PodSecurityPolicy
#### HTTP Request
-->
### `update` 替换指定的 PodSecurityPolicy

#### HTTP 请求

PUT /apis/policy/v1beta1/podsecuritypolicies/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PodSecurityPolicy
- **body**: <a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需
  
  PodSecurityPolicy 的名称

- **body**: <a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>，必需

- **dryRun** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified PodSecurityPolicy
#### HTTP Request
-->
### `patch` 部分更新指定的 PodSecurityPolicy

#### HTTP 请求

PATCH /apis/policy/v1beta1/podsecuritypolicies/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PodSecurityPolicy
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
- **dryRun** (*in query*): string
- **fieldManager** (*in query*): string
- **fieldValidation** (*in query*): string
- **force** (*in query*): boolean
- **pretty** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需
  
  PodSecurityPolicy 的名称

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查询参数**): boolean
  
  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>): Created

401: Unauthorized

<!--
### `delete` delete a PodSecurityPolicy
#### HTTP Request
-->
### `delete` 删除 PodSecurityPolicy

#### HTTP 请求

DELETE /apis/policy/v1beta1/podsecuritypolicies/{name}

<!--
#### Parameters
- **name** (*in path*): string, required
  name of the PodSecurityPolicy
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **dryRun** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
-->
#### 参数

- **name** (**路径参数**): string，必需
  
  PodSecurityPolicy 的名称

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查询参数**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>): OK

202 (<a href="{{< ref "../policy-resources/pod-security-policy-v1beta1#PodSecurityPolicy" >}}">PodSecurityPolicy</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of PodSecurityPolicy
#### HTTP Request
-->
### `deletecollection` 删除 PodSecurityPolicy 的集合

#### HTTP 请求

DELETE /apis/policy/v1beta1/podsecuritypolicies

<!--
#### Parameters
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
- **continue** (*in query*): string
- **dryRun** (*in query*): string
- **fieldSelector** (*in query*): string
- **gracePeriodSeconds** (*in query*): integer
- **labelSelector** (*in query*): string
- **limit** (*in query*): integer
- **pretty** (*in query*): string
- **propagationPolicy** (*in query*): string
- **resourceVersion** (*in query*): string
- **resourceVersionMatch** (*in query*): string
- **timeoutSeconds** (*in query*): integer
-->
#### 参数

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查询参数**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string
  
  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **timeoutSeconds** (**查询参数**): integer
  
  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
