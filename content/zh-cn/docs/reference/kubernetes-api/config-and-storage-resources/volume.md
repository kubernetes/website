---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "Volume"
content_type: "api_reference"
description: "Volume 表示 Pod 中一个有名字的卷，可以由 Pod 中的任意容器进行访问。"
title: "Volume"
weight: 10
---
<!--
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "Volume"
content_type: "api_reference"
description: "Volume represents a named volume in a pod that may be accessed by any container in the pod."
title: "Volume"
weight: 10
auto_generated: true
-->

`import "k8s.io/api/core/v1"`

## Volume {#Volume}

<!--
Volume represents a named volume in a pod that may be accessed by any container in the pod.
-->
Volume 表示 Pod 中一个有名字的卷，可以由 Pod 中的任意容器进行访问。

<hr>

<!--
- **name** (string), required
  name of the volume. Must be a DNS_LABEL and unique within the pod. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
-->
- **name** (string)，必需

  卷的名称。必须是 DNS_LABEL 且在 Pod 内是唯一的。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

<!--
### Exposed Persistent volumes

- **persistentVolumeClaim** (PersistentVolumeClaimVolumeSource)
  persistentVolumeClaimVolumeSource represents a reference to a PersistentVolumeClaim in the same namespace. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

  <a name="PersistentVolumeClaimVolumeSource"></a>
  *PersistentVolumeClaimVolumeSource references the user's PVC in the same namespace. This volume finds the bound PV and mounts that volume for the pod. A PersistentVolumeClaimVolumeSource is, essentially, a wrapper around another type of volume that is owned by someone else (the system).*
-->
### 暴露的持久卷 {#exposed-persistent-volumes}

- **persistentVolumeClaim** (PersistentVolumeClaimVolumeSource)

  persistentVolumeClaimVolumeSource 表示对同一名字空间中 PersistentVolumeClaim 的引用。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

  <a name="PersistentVolumeClaimVolumeSource"></a>
  **PersistentVolumeClaimVolumeSource 引用同一名字空间中用户的 PVC。
  此卷找到绑定的 PV 并为 Pod 挂载这个 PV 卷。
  PersistentVolumeClaimVolumeSource 本质上是其他人（或系统）拥有的另一类卷的包装类。**

  <!--
  - **persistentVolumeClaim.claimName** (string), required
    claimName is the name of a PersistentVolumeClaim in the same namespace as the pod using this volume. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

  - **persistentVolumeClaim.readOnly** (boolean)
    readOnly Will force the ReadOnly setting in VolumeMounts. Default false.
  -->

  - **persistentVolumeClaim.claimName** (string)，必需

    `claimName` 是与使用此卷的 Pod 位于同一名字空间中的 PersistentVolumeClaim 的名称。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

  - **persistentVolumeClaim.readOnly** (boolean)

    `readOnly` 将在卷挂载中强制设置 readOnly 属性。默认为 false。

<!--
### Projections

- **configMap** (ConfigMapVolumeSource)

  configMap represents a configMap that should populate this volume

  <a name="ConfigMapVolumeSource"></a>
  *Adapts a ConfigMap into a volume.

  The contents of the target ConfigMap's Data field will be presented in a volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths. ConfigMap volumes support ownership management and SELinux relabeling.*
-->
### 投射 {#projections}

- **configMap** (ConfigMapVolumeSource)

  `configMap` 表示应填充此卷的 configMap。

  <a name="ConfigMapVolumeSource"></a>
  **将 ConfigMap 适配到一个卷中。目标 ConfigMap 的 data 字段的内容将以文件的形式呈现在一个卷中，
  使用 data 字段中的键名作为文件名，除非 items 元素中已经填充了由键名到路径的特定映射。
  ConfigMap 卷支持所有权管理和 SELinux 重新打标签。**

  <!--
  - **configMap.name** (string)

    Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

  - **configMap.optional** (boolean)

    optional specify whether the ConfigMap or its keys must be defined
  -->
  - **configMap.name** (string)

    被引用资源的名称。此字段实际上是必需的，但由于向后兼容性，可以允许为空。
    此类型的实例如果将此字段的值设为空，几乎可以肯定是错误的。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

  - **configMap.optional** (boolean)

    `optional` 指定是否所引用的 ConfigMap 或其键必须已经被定义。

  <!--
  - **configMap.defaultMode** (int32)

    defaultMode is optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.

  - **configMap.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

    *Atomic: will be replaced during a merge*
    
    items if unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.
  -->

  - **configMap.defaultMode** (int32)

    `defaultMode` 是可选的：默认情况下，模式位用于为已创建的文件设置权限。
    必须是 0000 到 0777 之间的八进制值或 0 到 511 之间的十进制值。
    YAML 既接受八进制值也接受十进制值，JSON 针对模式位需要十进制值。此字段默认为 0644。
    路径内的目录不受此设置的影响。这可能与影响文件模式的其他选项（如 fsGroup）有冲突，且结果可以是其他模式位也被设置。

  - **configMap.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

    **原子性：将在合并期间被替换**

    如果未指定 `items`，则所引用的 ConfigMap 的 `data` 字段中的每个键值对将作为一个文件被投射到卷中，
    这个文件的名称是键名，而文件的内容是键的取值。
    如果指定 `items`，则所列出的键将被投射到指定的路径中，且不会显示未列出的键。
    如果指定的键不在 ConfigMap 中，则卷设置将出错，除非对应的键被标记为可选。
    路径必须是相对路径，不能包含 “..” 路径，也不能以 “..” 开头。

<!--
- **secret** (SecretVolumeSource)

  secret represents a secret that should populate this volume. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret

  <a name="SecretVolumeSource"></a>
  *Adapts a Secret into a volume.
  
  The contents of the target Secret's Data field will be presented in a volume as files using the keys in the Data field as the file names. Secret volumes support ownership management and SELinux relabeling.*
-->
- **secret** (SecretVolumeSource)

  `secret` 表示用来填充此卷的 Secret。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#secret

  <a name="SecretVolumeSource"></a>
  **将 Secret 适配到一个卷中。
  目标 Secret 的 `data` 字段的内容将以文件的形式呈现在一个卷中，使用 `data` 字段中的键名作为文件名。
  Secret 卷支持所有权管理和 SELinux 重新打标签。**

  <!--
  - **secret.secretName** (string)

    secretName is the name of the secret in the pod's namespace to use. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret

  - **secret.optional** (boolean)

    optional field specify whether the Secret or its keys must be defined
  -->

  - **secret.secretName** (string)

    `secretName` 是要使用的、位于 Pod 的名字空间中的 Secret 名称。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#secret

  - **secret.optional** (boolean)

    `optional` 字段指定是否 Secret 或其键必须已经定义。

  <!--
  - **secret.defaultMode** (int32)

    defaultMode is Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.

  - **secret.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

    *Atomic: will be replaced during a merge*
    
    items If unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the Secret, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.
  -->

  - **secret.defaultMode** (int32)

    `defaultMode` 是可选的：默认情况下，模式位用于为已创建的文件设置权限。
    必须是 0000 到 0777 之间的八进制值或 0 到 511 之间的十进制值。
    YAML 既接受八进制值也接受十进制值，JSON 针对模式位需要十进制值。此字段默认为 0644。
    路径内的目录不受此设置的影响。
    这可能与影响文件模式的其他选项（如 fsGroup）有冲突，且结果可以是其他模式位也被设置。

  - **secret.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

    **原子：将在合并期间被替换**

    如果未指定 `items`，则所引用的 Secret 的 `data` 字段中的每个键值对将作为一个文件被投射到卷中，
    这个文件的名称是键名，而文件的内容是键的取值。
    如果指定 `items`，则所列出的键将被投射到指定的路径中，且不会显示未列出的键。
    如果指定的键不在 Secret 中，则卷设置将出错，除非对应的键被标记为可选。
    路径必须是相对路径，不能包含 “..” 路径，也不能以 “..” 开头。

<!--
- **downwardAPI** (DownwardAPIVolumeSource)

  downwardAPI represents downward API about the pod that should populate this volume

  <a name="DownwardAPIVolumeSource"></a>
  *DownwardAPIVolumeSource represents a volume containing downward API info. Downward API volumes support ownership management and SELinux relabeling.*
-->
- **downwardAPI** (DownwardAPIVolumeSource)

  `downwardAPI` 表示有关 Pod 的 Downward API，用来填充此卷。

  <a name="DownwardAPIVolumeSource"></a>
  **DownwardAPIVolumeSource 表示包含 Downward API 信息的一个卷。Downward API
  卷支持所有权管理和 SELinux 重新打标签。**

  <!--
  - **downwardAPI.defaultMode** (int32)

    Optional: mode bits to use on created files by default. Must be a Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.

  - **downwardAPI.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#DownwardAPIVolumeFile" >}}">DownwardAPIVolumeFile</a>)

    *Atomic: will be replaced during a merge*
    
    Items is a list of downward API volume file
  -->

  - **downwardAPI.defaultMode** (int32)

    可选：默认情况下，模式位用于已创建的文件。
    必须是可选的：默认情况下，模式位用于为已创建的文件设置权限。
    必须是 0000 到 0777 之间的八进制值或 0 到 511 之间的十进制值。
    YAML 既接受八进制值也接受十进制值，JSON 针对模式位需要十进制值。此字段默认为 0644。
    路径内的目录不受此设置的影响。这可能与影响文件模式的其他选项（如 fsGroup）有冲突，
    且结果可以是其他模式位也被设置。

  - **downwardAPI.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#DownwardAPIVolumeFile" >}}">DownwardAPIVolumeFile</a>)

    **原子性：将在合并期间被替换**

    `items` 是 Downward API 卷文件的列表。

<!--
- **projected** (ProjectedVolumeSource)

  projected items for all in one resources secrets, configmaps, and downward API

  <a name="ProjectedVolumeSource"></a>
  *Represents a projected volume source*

  - **projected.defaultMode** (int32)

    defaultMode are the mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
-->
- **projected** (ProjectedVolumeSource)

  这是供 Secret、ConfigMap 和 Downward API 等所有资源使用的投射项。

  <a name="ProjectedVolumeSource"></a>
  **表示一个投射的卷源。**

  - **projected.defaultMode** (int32)

    `defaultMode` 是默认情况下用于为已创建的文件设置权限的模式位。
    必须是 0000 到 0777 之间的八进制值或 0 到 511 之间的十进制值。
    YAML 既接受八进制值也接受十进制值，JSON 针对模式位需要十进制值。
    路径内的目录不受此设置的影响。
    这可能与影响文件模式的其他选项（如 fsGroup）有冲突，且结果可以是其他模式位也被设置。

  <!--
  - **projected.sources** ([]VolumeProjection)

    *Atomic: will be replaced during a merge*
    
    sources is the list of volume projections. Each entry in this list handles one source.

    <a name="VolumeProjection"></a>
    *Projection that may be projected along with other supported volume types. Exactly one of these fields must be set.*
  -->

  - **projected.sources** ([]VolumeProjection)

    **原子性：将在合并期间被替换**

    `sources` 是卷投射的列表。此列表中的每个条目处理一个数据源。

    <a name="VolumeProjection"></a>
    **这里的投射项目可能与其他受支持的卷类型一起进行投射。这些字段中必须且仅能设置一个。**

    <!--
    - **projected.sources.clusterTrustBundle** (ClusterTrustBundleProjection)

      ClusterTrustBundle allows a pod to access the `.spec.trustBundle` field of ClusterTrustBundle objects in an auto-updating file.

      Alpha, gated by the ClusterTrustBundleProjection feature gate.

      ClusterTrustBundle objects can either be selected by name, or by the combination of signer name and a label selector.
    -->

    - **projected.sources.clusterTrustBundle**（ClusterTrustBundleProjection）

      `clusterTrustBundle` 允许 Pod 访问一个自动更新的文件中 ClusterTrustBundle
      对象的 `.spec.trustBundle` 字段。

      处于 Alpha 阶段，由 ClusterTrustBundleProjection 特性门控进行控制。

      ClusterTrustBundle 对象可以通过名称选择，也可以通过签名者名称和标签选择算符的组合进行选择。

      <!--
      Kubelet performs aggressive normalization of the PEM contents written into the pod filesystem.  Esoteric PEM features such as inter-block comments and block headers are stripped.  Certificates are deduplicated. The ordering of certificates within the file is arbitrary, and Kubelet may change the order over time.

      <a name="ClusterTrustBundleProjection"></a>
      *ClusterTrustBundleProjection describes how to select a set of ClusterTrustBundle objects and project their contents into the pod filesystem.*
      -->

      kubelet 对写入 Pod 文件系统的 PEM 内容进行了严格的规范化。
      像跨块注释和块头这类冷门 PEM 特性被剥离。证书被去重。文件内证书的顺序是任意的，kubelet
      可能会随着时间改变其顺序。

      <a name="ClusterTrustBundleProjection"></a>
      **ClusterTrustBundleProjection 描述如何选择一组 ClusterTrustBundle 对象并将其内容投射到 Pod 文件系统中。**

      <!--
      - **projected.sources.clusterTrustBundle.path** (string), required

        Relative path from the volume root to write the bundle.

      - **projected.sources.clusterTrustBundle.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        Select all ClusterTrustBundles that match this label selector.  Only has effect if signerName is set.  Mutually-exclusive with name.  If unset, interpreted as "match nothing".  If set but empty, interpreted as "match everything".
      -->

      - **projected.sources.clusterTrustBundle.path** (string)，必需

        相对于卷根的路径，用于写入信任包。

      - **projected.sources.clusterTrustBundle.labelSelector**（<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

        选择所有匹配此标签选择算符的 ClusterTrustBundle。仅在 `signerName` 被设置时有效。
        与 `name` 互斥。如果不设置，则解释为“没有匹配项”。如果设置但为空，则解释为“匹配所有”。

      <!--
      - **projected.sources.clusterTrustBundle.name** (string)

        Select a single ClusterTrustBundle by object name.  Mutually-exclusive with signerName and labelSelector.

      - **projected.sources.clusterTrustBundle.optional** (boolean)

        If true, don't block pod startup if the referenced ClusterTrustBundle(s) aren't available.  If using name, then the named ClusterTrustBundle is allowed not to exist.  If using signerName, then the combination of signerName and labelSelector is allowed to match zero ClusterTrustBundles.

      - **projected.sources.clusterTrustBundle.signerName** (string)

        Select all ClusterTrustBundles that match this signer name. Mutually-exclusive with name.  The contents of all selected ClusterTrustBundles will be unified and deduplicated.
      -->

      - **projected.sources.clusterTrustBundle.name** (string)

        通过对象名称选择单个 `clusterTrustBundle`。与 `signerName` 和 `labelSelector` 互斥。

      - **projected.sources.clusterTrustBundle.optional** (boolean)

        如果为 true，若引用的 ClusterTrustBundle 不可用，则不会阻止 Pod 启动。
        如果使用 `name`，则允许指定的 ClusterTrustBundle 不存在。
        如果使用 `signerName`，则 `signerName` 和 `labelSelector` 的组合被允许以匹配零个 ClusterTrustBundle。

      - **projected.sources.clusterTrustBundle.signerName** (string)

        选择所有与此签名者名称匹配的 ClusterTrustBundle。此字段与 `name` 互斥。
        所有选定的 ClusterTrustBundle 的内容将被统一并去重。

    <!--
    - **projected.sources.configMap** (ConfigMapProjection)

      configMap information about the configMap data to project

      <a name="ConfigMapProjection"></a>
      *Adapts a ConfigMap into a projected volume.

      The contents of the target ConfigMap's Data field will be presented in a projected volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths. Note that this is identical to a configmap volume source without the default mode.*
    -->

    - **projected.sources.configMap** (ConfigMapProjection)

      与要投射的 ConfigMap 数据有关的 ConfigMap 信息。

      <a name="ConfigMapProjection"></a>
      **将 ConfigMap 适配到一个投射的卷中。
      目标 ConfigMap 的 `data` 字段的内容将以文件的形式呈现在一个被投射的卷中，
      使用 `data` 字段中的键名作为文件名，除非 `items` 元素中已经填充了由键名到路径的特定映射。
      请注意，这等同于没有默认模式的 ConfigMap 卷源。**

      <!--
      - **projected.sources.configMap.name** (string)

        Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **projected.sources.configMap.optional** (boolean)

        optional specify whether the ConfigMap or its keys must be defined
      -->

      - **projected.sources.configMap.name** (string)

        被引用资源的名称。此字段实际上是必需的，但由于向后兼容性，可以允许为空。
        此类型的实例如果将此字段的值设置为空，几乎可以肯定是错误的。更多信息：
        https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      - **projected.sources.configMap.optional** (boolean)

        optional 指定是否所引用的 ConfigMap 或其键必须已经被定义。

      <!--
      - **projected.sources.configMap.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

        *Atomic: will be replaced during a merge*

        items if unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.
      -->

      - **projected.sources.configMap.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

        **原子性：将在合并期间被替换**

        如果未指定 `items`，则所引用的 ConfigMap 的 `data` 字段中的每个键值对将作为一个文件被投射到卷中，
        这个文件的名称是键名，而文件的内容是键的取值。
        如果指定 `items`，则所列出的键将被投射到指定的路径中，且不会显示未列出的键。
        如果指定的键不在 ConfigMap 中，则卷设置将出错，除非对应的键被标记为可选。
        路径必须是相对路径，不能包含 “..” 路径，也不能以 “..” 开头。

    <!--
    - **projected.sources.downwardAPI** (DownwardAPIProjection)

      downwardAPI information about the downwardAPI data to project

      <a name="DownwardAPIProjection"></a>
      *Represents downward API info for projecting into a projected volume. Note that this is identical to a downwardAPI volume source without the default mode.*

      - **projected.sources.downwardAPI.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#DownwardAPIVolumeFile" >}}">DownwardAPIVolumeFile</a>)

        *Atomic: will be replaced during a merge*

        Items is a list of DownwardAPIVolume file
    -->

    - **projected.sources.downwardAPI** (DownwardAPIProjection)

      与要投射的 `downwardAPI` 数据有关的 `downwardAPI` 信息。

      <a name="DownwardAPIProjection"></a>
      **表示投射到投射卷的 Downward API 信息。请注意，这等同于没有默认模式的 downwardAPI 卷源。**

      - **projected.sources.downwardAPI.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#DownwardAPIVolumeFile" >}}">DownwardAPIVolumeFile</a>)

        **原子性：将在合并期间被替换**

        `items` 是 DownwardAPIVolume 文件的列表。

    - **projected.sources.podCertificate** (PodCertificateProjection)

      <!--
      Projects an auto-rotating credential bundle (private key and certificate chain) that the pod can use either as a TLS client or server.
      
      Kubelet generates a private key and uses it to send a PodCertificateRequest to the named signer.  Once the signer approves the request and issues a certificate chain, Kubelet writes the key and certificate chain to the pod filesystem.  The pod does not start until certificates have been issued for each podCertificate projected volume source in its spec.
      
      Kubelet will begin trying to rotate the certificate at the time indicated by the signer using the PodCertificateRequest.Status.BeginRefreshAt timestamp.
      -->

      将一个自动轮换的凭据包（私钥和证书链）投射到 Pod 中，Pod 可以将其用作 TLS 客户端或服务器。

      kubelet 生成一个私钥，并使用它发送 PodCertificateRequest 到指定的签名者。一旦签名者批准请求并颁发证书链，
      kubelet 将密钥和证书链写入 Pod 文件系统。在其规约中的每个 `podCertificate`
      投射卷源都已被颁发证书之前，Pod 不会启动。

      kubelet 将在签名者通过 `PodCertificateRequest.Status.BeginRefreshAt`
      时间戳所给出的时间点开始尝试轮换证书。

      <!--
      Kubelet can write a single file, indicated by the credentialBundlePath field, or separate files, indicated by the keyPath and certificateChainPath fields.

      The credential bundle is a single file in PEM format.  The first PEM entry is the private key (in PKCS#8 format), and the remaining PEM entries are the certificate chain issued by the signer (typically, signers will return their certificate chain in leaf-to-root order).
      -->

      kubelet 可以写入单个文件（由 `credentialBundlePath` 字段指示），
      或者由 `keyPath` 和 `certificateChainPath` 字段所给出的两个独立的文件。

      凭据包是单个 PEM 格式的文件。第一个 PEM 条目是私钥（以 PKCS#8 格式），剩余的 PEM 条目是由签名者颁发的证书链
     （通常，签名者会按照从叶到根的顺序返回其证书链）。

      <!--
      Prefer using the credential bundle format, since your application code can read it atomically.  If you use keyPath and certificateChainPath, your application must make two separate file reads. If these coincide with a certificate rotation, it is possible that the private key and leaf certificate you read may not correspond to each other.  Your application will need to check for this condition, and re-read until they are consistent.

      The named signer controls chooses the format of the certificate it issues; consult the signer implementation's documentation to learn how to use the certificates it issues.
      -->

      建议使用凭据包格式，因为你的应用程序代码可以原子性地读取它。如果你使用 `keyPath` 和 `certificateChainPath`，
      你的应用程序必须进行两次单独的文件读取。如果这些恰好与证书轮换同时发生，则读取的私钥和叶子证书可能不对应。
      你的应用程序需要检查这种情况，并重新读取直到它们一致。

      指定的签名者控制其颁发证书的格式；查阅签名者实现的文档以了解如何使用它所颁发的证书。

      <a name="PodCertificateProjection"></a>
      <!--
      *PodCertificateProjection provides a private key and X.509 certificate in the pod filesystem.*
      -->
 
      **PodCertificateProjection 在 Pod 文件系统中提供私钥和 X.509 证书。**

      <!--
      - **projected.sources.podCertificate.keyType** (string), required

        The type of keypair Kubelet will generate for the pod.
        
        Valid values are "RSA3072", "RSA4096", "ECDSAP256", "ECDSAP384", "ECDSAP521", and "ED25519".
      -->
      - **projected.sources.podCertificate.keyType** (string)，必需

        kubelet 将为 Pod 生成的密钥对类型。

        有效值包括 "RSA3072"、"RSA4096"、"ECDSAP256"、"ECDSAP384"、"ECDSAP521" 和 "ED25519"。

      <!--
      - **projected.sources.podCertificate.signerName** (string), required

        Kubelet's generated CSRs will be addressed to this signer.

      - **projected.sources.podCertificate.certificateChainPath** (string)

        Write the certificate chain at this path in the projected volume.
        
        Most applications should use credentialBundlePath.  When using keyPath and certificateChainPath, your application needs to check that the key and leaf certificate are consistent, because it is possible to read the files mid-rotation.
      -->

      - **projected.sources.podCertificate.signerName** (string)，必需

        kubelet 生成的 CSR 将提交给此签名者。

      - **projected.sources.podCertificate.certificateChainPath** (string)

        在投射卷中的此路径下写入证书链。

        大多数应用程序应使用 `credentialBundlePath`。当使用 `keyPath` 和 `certificateChainPath`
        时，你的应用程序需要检查密钥和叶子证书是否一致，因为有可能在轮换过程中读取这些文件。

      <!--
      - **projected.sources.podCertificate.credentialBundlePath** (string)

        Write the credential bundle at this path in the projected volume.

        The credential bundle is a single file that contains multiple PEM blocks. The first PEM block is a PRIVATE KEY block, containing a PKCS#8 private key.

        The remaining blocks are CERTIFICATE blocks, containing the issued certificate chain from the signer (leaf and any intermediates).

        Using credentialBundlePath lets your Pod's application code make a single atomic read that retrieves a consistent key and certificate chain.  If you project them to separate files, your application code will need to additionally check that the leaf certificate was issued to the key.
      -->

      - **projected.sources.podCertificate.credentialBundlePath** (string)

        在投射卷中的此路径下写入凭证包。

        凭证包是一个包含多个 PEM 块的单一文件。第一个 PEM 块是 PRIVATE KEY 块，包含了 PKCS#8 私钥。

        其余的块是 CERTIFICATE 块，包含了由签发者提供的证书链（叶子证书及任何中间证书）。

        使用 `credentialBundlePath` 可让 Pod 中的应用代码进行一次原子读取，获取一致的密钥和证书链。
        如果你将它们投影到单独的文件中，你的应用程序代码还需要额外检查叶子证书是否由该密钥签发。

      <!--
      - **projected.sources.podCertificate.keyPath** (string)

        Write the key at this path in the projected volume.
        
        Most applications should use credentialBundlePath.  When using keyPath and certificateChainPath, your application needs to check that the key and leaf certificate are consistent, because it is possible to read the files mid-rotation.
      -->

      - **projected.sources.podCertificate.keyPath** (string)

        在投射卷中的此路径下写入密钥。

        大多数应用程序应当使用 `credentialBundlePath`。当使用 `keyPath` 和 `certificateChainPath`
        时，你的应用程序需要检查密钥和叶子证书是否一致，因为有可能在文件轮换过程中读取这些文件。

      <!--
      - **projected.sources.podCertificate.maxExpirationSeconds** (int32)

        maxExpirationSeconds is the maximum lifetime permitted for the certificate.

        Kubelet copies this value verbatim into the PodCertificateRequests it generates for this projection.

        If omitted, kube-apiserver will set it to 86400(24 hours). kube-apiserver will reject values shorter than 3600 (1 hour).  The maximum allowable value is 7862400 (91 days).

        The signer implementation is then free to issue a certificate with any lifetime *shorter* than MaxExpirationSeconds, but no shorter than 3600 seconds (1 hour).  This constraint is enforced by kube-apiserver. `kubernetes.io` signers will never issue certificates with a lifetime longer than 24 hours.
      -->

      - **projected.sources.podCertificate.maxExpirationSeconds** (int32)

        `maxExpirationSeconds` 是证书允许的最大生命周期。
        
        kubelet 将此值直接复制到为此投射生成的 PodCertificateRequests 中。
        
        如果省略，kube-apiserver 会将其设置为 86400（24 小时）。kube-apiserver 会拒绝短于
        3600 秒（1 小时）的值。允许的最大值是 7862400（91 天）。
        
        签名者实现可以自由签发任何生命周期**短于** `maxExpirationSeconds` 但不少于
        3600 秒（1 小时）的证书。
        此约束由 kube-apiserver 强制执行。`kubernetes.io` 签名者永远不会签发生命周期超过

      <!--
      - **projected.sources.podCertificate.userAnnotations** (map[string]string)

        userAnnotations allow pod authors to pass additional information to the signer implementation.  Kubernetes does not restrict or validate this metadata in any way.
        
        These values are copied verbatim into the `spec.unverifiedUserAnnotations` field of the PodCertificateRequest objects that Kubelet creates.
        
        Entries are subject to the same validation as object metadata annotations, with the addition that all keys must be domain-prefixed. No restrictions are placed on values, except an overall size limitation on the entire field.
        
        Signers should document the keys and values they support. Signers should deny requests that contain keys they do not recognize.
      -->
  
      - **projected.sources.podCertificate.userAnnotations** (map[string]string)
      
        `userAnnotations` 允许 Pod 作者向签名实现传递附加信息。Kubernetes 不会以任何方式限制或验证此元数据。
        
        这些值会原封不动地复制到 kubelet 创建的 PodCertificateRequest 对象的
        `spec.unverifiedUserAnnotations` 字段中。
        
        条目的验证方式与对象元数据注解相同，但所有键都必须带有域名前缀。
        除了整个字段的大小限制外，对值本身没有任何限制。
        
        签名者应记录他们支持的键和值。签名者应拒绝包含他们无法识别的键的请求。
      
    <!--
    - **projected.sources.secret** (SecretProjection)

      secret information about the secret data to project

      <a name="SecretProjection"></a>
      *Adapts a secret into a projected volume.

      The contents of the target Secret's Data field will be presented in a projected volume as files using the keys in the Data field as the file names. Note that this is identical to a secret volume source without the default mode.*

      - **projected.sources.secret.name** (string)

        Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
      -->

    - **projected.sources.secret** (SecretProjection)

      与要投射的 Secret 数据有关的 Secret 信息。

      <a name="SecretProjection"></a>
      **将 Secret 适配到一个投射卷中。
      目标 Secret 的 data 字段的内容将以文件的形式呈现在一个投射卷中，使用 data 字段中的键名作为文件名。
      请注意，这等同于没有默认模式的 Secret 卷源。**

      - **projected.sources.secret.name** (string)

        被引用资源的名称。此字段实际上是必需的，但由于向后兼容性，可以允许为空。
        此类型的实例如果将此字段的值设置为空，几乎可以肯定是错误的。更多信息：
        https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      <!--
      - **projected.sources.secret.optional** (boolean)

        optional field specify whether the Secret or its key must be defined

      - **projected.sources.secret.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

        *Atomic: will be replaced during a merge*
        
        items if unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the Secret, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.
      -->

      - **projected.sources.secret.optional** (boolean)

        optional 字段指定是否 Secret 或其键必须已经定义。

      - **projected.sources.secret.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

        **原子：将在合并期间被替换**

        如果未指定 items，则所引用的 Secret 的 data 字段中的每个键值对将作为一个文件被投射到卷中，
        这个文件的名称是键名，而文件的内容是键的取值。
        如果指定 items，则所列出的键将被投射到指定的路径中，且不会显示未列出的键。
        如果指定的键不在 Secret 中，则卷设置将出错，除非对应的键被标记为可选。
        路径必须是相对路径，不能包含 “..” 路径，也不能以 “..” 开头。

    <!--
    - **projected.sources.serviceAccountToken** (ServiceAccountTokenProjection)

      serviceAccountToken is information about the serviceAccountToken data to project

      <a name="ServiceAccountTokenProjection"></a>
      *ServiceAccountTokenProjection represents a projected service account token volume. This projection can be used to insert a service account token into the pods runtime filesystem for use against APIs (Kubernetes API Server or otherwise).*

      - **projected.sources.serviceAccountToken.path** (string), required

        path is the path relative to the mount point of the file to project the token into.
    -->

    - **projected.sources.serviceAccountToken** (ServiceAccountTokenProjection)

      serviceAccountToken 是与要投射的服务账号令牌数据有关的信息。

      <a name="ServiceAccountTokenProjection"></a>
      **ServiceAccountTokenProjection 表示一个投射的服务账号令牌卷。
      这种投射可用于将服务账号令牌插入到 Pod 运行时文件系统，供访问 API（Kubernetes API Server 或其他）使用。**

      - **projected.sources.serviceAccountToken.path** (string)，必需

        path 是相对于令牌投射目标文件的挂载点的路径。

      <!--
      - **projected.sources.serviceAccountToken.audience** (string)

        audience is the intended audience of the token. A recipient of a token must identify itself with an identifier specified in the audience of the token, and otherwise should reject the token. The audience defaults to the identifier of the apiserver.

      - **projected.sources.serviceAccountToken.expirationSeconds** (int64)

        expirationSeconds is the requested duration of validity of the service account token. As the token approaches expiration, the kubelet volume plugin will proactively rotate the service account token. The kubelet will start trying to rotate the token if the token is older than 80 percent of its time to live or if the token is older than 24 hours.Defaults to 1 hour and must be at least 10 minutes.
      -->

      - **projected.sources.serviceAccountToken.audience** (string)

        audience 是令牌的目标受众。
        令牌的接收方必须用令牌受众中指定的一个标识符来标识自己，否则应拒绝此令牌。
        受众默认为 apiserver 的标识符。

      - **projected.sources.serviceAccountToken.expirationSeconds** (int64)

        expirationSeconds 是所请求的服务账号令牌的有效期。
        当令牌即将到期时，kubelet 卷插件将主动轮换服务账号令牌。
        如果令牌超过其生存时间的 80% 或令牌超过 24 小时，kubelet 将开始尝试轮换令牌。
        默认为 1 小时且必须至少为 10 分钟。

<!--
### Local / Temporary Directory

- **emptyDir** (EmptyDirVolumeSource)

  emptyDir represents a temporary directory that shares a pod's lifetime. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir

  <a name="EmptyDirVolumeSource"></a>
  *Represents an empty directory for a pod. Empty directory volumes support ownership management and SELinux relabeling.*

  - **emptyDir.medium** (string)

    medium represents what type of storage medium should back this directory. The default is "" which means to use the node's default medium. Must be an empty string (default) or Memory. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir
-->
### 本地/临时目录 {#local-temporary-directory}

- **emptyDir** (EmptyDirVolumeSource)

  emptyDir 表示与 Pod 生命周期相同的临时目录。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#emptydir

  <a name="EmptyDirVolumeSource"></a>
  **表示供 Pod 使用的一个空目录。空目录卷支持所有权管理和 SELinux 重新打标签。**

  - **emptyDir.medium** (string)

    medium 表示此目录应使用哪种类别的存储介质。默认为 ""，这意味着使用节点的默认介质。
    必须是空字符串（默认值）或 Memory。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#emptydir

  <!--
  - **emptyDir.sizeLimit** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    sizeLimit is the total amount of local storage required for this EmptyDir volume. The size limit is also applicable for memory medium. The maximum usage on memory medium EmptyDir would be the minimum value between the SizeLimit specified here and the sum of memory limits of all containers in a pod. The default is nil which means that the limit is undefined. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir
  -->

  - **emptyDir.sizeLimit** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    sizeLimit 是这个 EmptyDir 卷所需的本地存储总量。这个大小限制也适用于内存介质。
    EmptyDir 的内存介质最大使用量将是此处指定的 sizeLimit 与 Pod 中所有容器内存限制总和这两个值之间的最小值。
    默认为 nil，这意味着限制未被定义。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#emptydir

<!--
- **hostPath** (HostPathVolumeSource)

  hostPath represents a pre-existing file or directory on the host machine that is directly exposed to the container. This is generally used for system agents or other privileged things that are allowed to see the host machine. Most containers will NOT need this. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath

  <a name="HostPathVolumeSource"></a>
  *Represents a host path mapped into a pod. Host path volumes do not support ownership management or SELinux relabeling.*
-->
- **hostPath** (HostPathVolumeSource)

  hostPath 表示主机上预先存在的文件或目录，它们将被直接暴露给容器。
  这种卷通常用于系统代理或允许查看主机的其他特权操作。大多数容器**不需要**这种卷。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#hostpath

  <a name="HostPathVolumeSource"></a>
  **表示映射到 Pod 中的主机路径。主机路径卷不支持所有权管理或 SELinux 重新打标签。**

  <!--
  - **hostPath.path** (string), required

    path of the directory on the host. If the path is a symlink, it will follow the link to the real path. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath

  - **hostPath.type** (string)

    type for HostPath Volume Defaults to "" More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath
  -->

  - **hostPath.path** (string)，必需

    目录在主机上的路径。如果该路径是一个符号链接，则它将沿着链接指向真实路径。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#hostpath

  - **hostPath.type** (string)

    HostPath 卷的类型。默认为 ""。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#hostpath

     <!--
    Possible enum values:
     - `""` For backwards compatible, leave it empty if unset
     - `"BlockDevice"` A block device must exist at the given path
     - `"CharDevice"` A character device must exist at the given path
     - `"Directory"` A directory must exist at the given path
     - `"DirectoryOrCreate"` If nothing exists at the given path, an empty directory will be created there as needed with file mode 0755, having the same group and ownership with Kubelet.
     - `"File"` A file must exist at the given path
     - `"FileOrCreate"` If nothing exists at the given path, an empty file will be created there as needed with file mode 0644, having the same group and ownership with Kubelet.
     - `"Socket"` A UNIX socket must exist at the given path
     -->
  
    可能的枚举值：
      - `""`：用于向后兼容，如果没有设置则留空。
      - `"BlockDevice"`：给定路径必须存在一个块设备。
      - `"CharDevice"`：给定路径必须存在一个字符设备。
      - `"Directory"`：给定路径必须存在一个目录。
      - `"DirectoryOrCreate"`：如果在给定路径没有文件或目录，将根据需要创建一个空目录，文件模式为 0755，
        具有与 kubelet 相同的组和所有权。
      - `"File"`：给定路径必须存在一个文件。
      - `"FileOrCreate"`：如果在给定路径不存在文件或目录，将根据需要创建一个空文件，文件模式为 0644，
        具有与 kubelet 相同的组和所有权。
      - `"Socket"`：给定路径必须存在一个 UNIX 套接字。
  
<!--
### Persistent volumes

- **awsElasticBlockStore** (AWSElasticBlockStoreVolumeSource)

  awsElasticBlockStore represents an AWS Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Deprecated: AWSElasticBlockStore is deprecated. All operations for the in-tree awsElasticBlockStore type are redirected to the ebs.csi.aws.com CSI driver. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

  <a name="AWSElasticBlockStoreVolumeSource"></a>
  *Represents a Persistent Disk resource in AWS.

  An AWS EBS disk must exist before mounting to a container. The disk must also be in the same AWS zone as the kubelet. An AWS EBS disk can only be mounted as read/write once. AWS EBS volumes support ownership management and SELinux relabeling.*
-->
### 持久卷 {#persistent-volumes}

- **awsElasticBlockStore** (AWSElasticBlockStoreVolumeSource)

  awsElasticBlockStore 表示挂接到 kubelet 的主机随后暴露给 Pod 的一个 AWS Disk 资源。
  已弃用：AWSElasticBlockStore 已被弃用。所有针对树内 awsElasticBlockStore 类型的操作都被重定向到
  ebs.csi.aws.com CSI 驱动。
  更多信息：https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#awselasticblockstore

  <a name="AWSElasticBlockStoreVolumeSource"></a>
  **表示 AWS 上的 Persistent Disk 资源。挂载到一个容器之前 AWS EBS 磁盘必须存在。
  该磁盘还必须与 kubelet 位于相同的 AWS 区域中。AWS EBS 磁盘只能以读/写一次进行挂载。
  AWS EBS 卷支持所有权管理和 SELinux 重新打标签。**

  <!--
  - **awsElasticBlockStore.volumeID** (string), required

    volumeID is unique ID of the persistent disk resource in AWS (Amazon EBS volume). More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

  - **awsElasticBlockStore.fsType** (string)

    fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore
  -->

  - **awsElasticBlockStore.volumeID** (string)，必需

    volumeID 是 AWS（Amazon EBS 卷）中持久磁盘资源的唯一 ID。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#awselasticblockstore

  - **awsElasticBlockStore.fsType** (string)

    fsType 是你要挂载的卷的文件系统类型。提示：确保主机操作系统支持此文件系统类型。
    例如：“ext4”、“xfs”、“ntfs”。如果未指定，则隐式推断为 “ext4”。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#awselasticblockstore

  <!--
  - **awsElasticBlockStore.partition** (int32)

    partition is the partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty).

  - **awsElasticBlockStore.readOnly** (boolean)

    readOnly value true will force the readOnly setting in VolumeMounts. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore
  -->

  - **awsElasticBlockStore.partition** (int32)

    partition 是你要挂载的卷中的分区。如果省略，则默认为按卷名称进行挂载。例如：对于卷 /dev/sda1，
    将分区指定为 “1”。类似地，/dev/sda 的卷分区为 “0”（或可以将属性留空）。

  - **awsElasticBlockStore.readOnly** (boolean)

    readOnly 值为 true 将使得卷挂载被强制设置为 readOnly。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#awselasticblockstore

<!--
- **azureDisk** (AzureDiskVolumeSource)

  azureDisk represents an Azure Data Disk mount on the host and bind mount to the pod. Deprecated: AzureDisk is deprecated. All operations for the in-tree azureDisk type are redirected to the disk.csi.azure.com CSI driver.

  <a name="AzureDiskVolumeSource"></a>
  *AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.*
-->
- **azureDisk** (AzureDiskVolumeSource)

  azureDisk 表示挂载到主机上并绑定挂载到 Pod 上的 Azure 数据盘。
  已弃用：AzureDisk 已被弃用。所有针对树内 azureDisk 类型的操作都被重定向到
  disk.csi.azure.com CSI 驱动。

  <a name="AzureDiskVolumeSource"></a>
  **azureDisk 表示挂载到主机上并绑定挂载到 Pod 上的 Azure 数据盘。**

  <!--
  - **azureDisk.diskName** (string), required

    diskName is the Name of the data disk in the blob storage

  - **azureDisk.diskURI** (string), required

    diskURI is the URI of data disk in the blob storage

  - **azureDisk.cachingMode** (string)

    cachingMode is the Host Caching mode: None, Read Only, Read Write.
  -->

  - **azureDisk.diskName** (string)，必需

    diskName 是 Blob 存储中数据盘的名称。

  - **azureDisk.diskURI** (string)，必需

    diskURI 是 Blob 存储中数据盘的 URI。

  - **azureDisk.cachingMode** (string)

    cachingMode 是主机缓存（Host Caching）模式：None、Read Only、Read Write。
  
   <!--
   Possible enum values:
    - `"None"`
    - `"ReadOnly"`
    - `"ReadWrite"`
   -->
 
   可能的枚举值：
   - `"None"`
   - `"ReadOnly"`
   - `"ReadWrite"`

  <!--
  - **azureDisk.fsType** (string)

    fsType is Filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.

  - **azureDisk.kind** (string)

    kind expected values are Shared: multiple blob disks per storage account  Dedicated: single blob disk per storage account  Managed: azure managed data disk (only in managed availability set). defaults to shared

    Possible enum values:
     - `"Dedicated"`
     - `"Managed"`
     - `"Shared"`
  
  - **azureDisk.readOnly** (boolean)

    readOnly Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
  -->

  - **azureDisk.fsType** (string)

    fsType 是要挂载的文件系统类型。必须是主机操作系统所支持的文件系统类型之一。
    例如 “ext4”、“xfs”、“ntfs”。如果未指定，则隐式推断为 “ext4”。

  - **azureDisk.kind** (string)

    kind 预期值包括：

    - Shared：每个存储帐户多个 Blob 磁盘；
    - Dedicated：每个存储帐户单个 Blob 磁盘；
    - Managed：azure 托管的数据盘（仅托管的可用性集合中）。

    默认为 Shared。

    可能的枚举值：
    - `"None"`
    - `"ReadOnly"`
    - `"ReadWrite"`

  - **azureDisk.readOnly** (boolean)

    readOnly 默认为 false（读/写）。此处的 readOnly 将强制设置卷挂载中的 readOnly 属性。

<!--
- **azureFile** (AzureFileVolumeSource)

  azureFile represents an Azure File Service mount on the host and bind mount to the pod. Deprecated: AzureFile is deprecated. All operations for the in-tree azureFile type are redirected to the file.csi.azure.com CSI driver.

  <a name="AzureFileVolumeSource"></a>
  *AzureFile represents an Azure File Service mount on the host and bind mount to the pod.*
-->
- **azureFile** (AzureFileVolumeSource)

  azureDisk 表示挂载到主机上并绑定挂载到 Pod 上的 Azure File Service。
  已弃用：AzureFile 已被弃用。所有针对 in-tree azureFile 类型的操作都被重定向到
  file.csi.azure.com CSI 驱动。

  <a name="AzureFileVolumeSource"></a>
  **azureFile 表示挂载到主机上并绑定挂载到 Pod 上的 Azure File Service。**

  <!--
  - **azureFile.secretName** (string), required

    secretName is the  name of secret that contains Azure Storage Account Name and Key

  - **azureFile.shareName** (string), required

    shareName is the azure share Name

  - **azureFile.readOnly** (boolean)

    readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
  -->

  - **azureFile.secretName** (string)，必需

    secretName 是包含 Azure 存储账号名称和主键的 Secret 的名称。

  - **azureFile.shareName** (string)，必需

    shareName 是 Azure 共享名称。

  - **azureFile.readOnly** (boolean)

    readOnly 默认为 false（读/写）。此处的 readOnly 将强制设置卷挂载中的 readOnly 属性。

<!--
- **cephfs** (CephFSVolumeSource)

  cephFS represents a Ceph FS mount on the host that shares a pod's lifetime. Deprecated: CephFS is deprecated and the in-tree cephfs type is no longer supported.

  <a name="CephFSVolumeSource"></a>
  *Represents a Ceph Filesystem mount that lasts the lifetime of a pod Cephfs volumes do not support ownership management or SELinux relabeling.*

  - **cephfs.monitors** ([]string), required

    *Atomic: will be replaced during a merge*
    
    monitors is Required: Monitors is a collection of Ceph monitors More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it
-->
- **cephfs** (CephFSVolumeSource)

  cephfs 表示在主机上挂载的 Ceph FS，该文件系统挂载与 Pod 的生命周期相同。
  已弃用：CephFS 已被弃用，且不再支持 in-tree cephfs 类型。

  <a name="CephFSVolumeSource"></a>
  **表示在 Pod 的生命周期内持续的 Ceph Filesystem 挂载。cephfs 卷不支持所有权管理或 SELinux 重新打标签。**

  - **cephfs.monitors** ([]string)，必需

    **原子：将在合并期间被替换**

    monitors 是必需的。monitors 是 Ceph 监测的集合。更多信息：
    https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  <!--
  - **cephfs.path** (string)

    path is Optional: Used as the mounted root, rather than the full Ceph tree, default is /

  - **cephfs.readOnly** (boolean)

    readOnly is Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it
  -->

  - **cephfs.path** (string)

    path 是可选的。用作挂载的根，而不是挂载完整的 Ceph 树，默认为 “/”。

  - **cephfs.readOnly** (boolean)

    readOnly 是可选的。默认为 false（读/写）。
    此处的 readOnly 将强制设置卷挂载中的 readOnly 属性。更多信息：
    https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  <!--
  - **cephfs.secretFile** (string)

    secretFile is Optional: SecretFile is the path to key ring for User, default is /etc/ceph/user.secret More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef is Optional: SecretRef is reference to the authentication secret for User, default is empty. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.user** (string)

    user is optional: User is the rados user name, default is admin More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it
  -->

  - **cephfs.secretFile** (string)

    secretFile 是可选的。secretFile 是 User 对应的密钥环的路径，默认为 /etc/ceph/user.secret。更多信息：
    https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef 是可选的。secretRef 是针对用户的身份认证 Secret 的引用，默认为空。更多信息：
    https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.user** (string)

    user 是可选的。user 是 rados 用户名，默认为 admin。更多信息：
    https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

<!--
- **cinder** (CinderVolumeSource)

  cinder represents a cinder volume attached and mounted on kubelets host machine. Deprecated: Cinder is deprecated. All operations for the in-tree cinder type are redirected to the cinder.csi.openstack.org CSI driver. More info: https://examples.k8s.io/mysql-cinder-pd/README.md

  <a name="CinderVolumeSource"></a>
  *Represents a cinder volume resource in Openstack. A Cinder volume must exist before mounting to a container. The volume must also be in the same region as the kubelet. Cinder volumes support ownership management and SELinux relabeling.*

  - **cinder.volumeID** (string), required

    volumeID used to identify the volume in cinder. More info: https://examples.k8s.io/mysql-cinder-pd/README.md
-->
- **cinder** (CinderVolumeSource)

  cinder 表示 kubelet 主机上挂接和挂载的 Cinder 卷。
  **已弃用：** Cinder 已被弃用。所有针对 in-tree Cinder 类型的操作都将重定向到
  cinder.csi.openstack.org CSI 驱动。
  更多信息：
  https://examples.k8s.io/mysql-cinder-pd/README.md

  <a name="CinderVolumeSource"></a>
  **表示 Openstack 中的一个 Cinder 卷资源。挂载到一个容器之前 Cinder 卷必须已经存在。
  该卷还必须与 kubelet 位于相同的地区中。cinder 卷支持所有权管理和 SELinux 重新打标签。**

  - **cinder.volumeID** (string)，必需

    volumeID 用于标识 Cinder 中的卷。更多信息：
    https://examples.k8s.io/mysql-cinder-pd/README.md

  <!--
  - **cinder.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.readOnly** (boolean)

    readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef is optional: points to a secret object containing parameters used to connect to OpenStack.
  -->

  - **cinder.fsType** (string)

    fsType 是要挂载的文件系统类型。必须是主机操作系统所支持的文件系统类型之一。例如：“ext4”、“xfs”、“ntfs”。
    如果未指定，则隐式推断为“ext4”。更多信息：
    https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.readOnly** (boolean)

    readOnly 默认为 false（读/写）。此处的 readOnly 将强制设置卷挂载中的 readOnly 属性。
    更多信息：https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef 是可选的。指向 Secret 对象，内含的参数用于连接到 OpenStack。

<!--
- **csi** (CSIVolumeSource)

  csi (Container Storage Interface) represents ephemeral storage that is handled by certain external CSI drivers.

  <a name="CSIVolumeSource"></a>
  *Represents a source location of a volume to mount, managed by an external CSI driver*

  - **csi.driver** (string), required

    driver is the name of the CSI driver that handles this volume. Consult with your admin for the correct name as registered in the cluster.

  - **csi.fsType** (string)

    fsType to mount. Ex. "ext4", "xfs", "ntfs". If not provided, the empty value is passed to the associated CSI driver which will determine the default filesystem to apply.
-->
- **csi** (CSIVolumeSource)

  csi 表示由某个外部容器存储接口（Container Storage Interface，CSI）驱动处理的临时存储。

  <a name="CSIVolumeSource"></a>
  **表示要挂载的卷的源位置，由外部 CSI 驱动进行管理。**

  - **csi.driver** (string)，必需

    driver 是处理此卷的 CSI 驱动的名称。咨询你的管理员以获取在集群中注册的正确名称。

  - **csi.fsType** (string)

    要挂载的 fsType。例如 “ext4”、“xfs”、“ntfs”。
    如果未提供，则将空值传递给关联的 CSI 驱动，以便决定要应用的默认文件系统。

  <!--
  - **csi.nodePublishSecretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    nodePublishSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI NodePublishVolume and NodeUnpublishVolume calls. This field is optional, and  may be empty if no secret is required. If the secret object contains more than one secret, all secret references are passed.

  - **csi.readOnly** (boolean)

    readOnly specifies a read-only configuration for the volume. Defaults to false (read/write).

  - **csi.volumeAttributes** (map[string]string)

    volumeAttributes stores driver-specific properties that are passed to the CSI driver. Consult your driver's documentation for supported values.
  -->

  - **csi.nodePublishSecretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    nodePublishSecretRef 是对包含敏感信息的 Secret 对象的引用，
    该 Secret 对象将被传递到 CSI 驱动以完成 CSI NodePublishVolume 和 NodeUnpublishVolume 调用。
    此字段是可选的，如果不需要 Secret，则此字段可以为空。
    如果 Secret 对象包含多个 Secret，则所有 Secret 引用将被传递。

  - **csi.readOnly** (boolean)

    readOnly 指定供卷使用的只读配置。默认为 false（读/写）。

  - **csi.volumeAttributes** (map[string]string)

    volumeAttributes 存储传递给 CSI 驱动且特定于驱动的属性。查阅你的驱动文档，了解支持的值。

<!--
- **ephemeral** (EphemeralVolumeSource)

  ephemeral represents a volume that is handled by a cluster storage driver. The volume's lifecycle is tied to the pod that defines it - it will be created before the pod starts, and deleted when the pod is removed.
-->
- **ephemeral** (EphemeralVolumeSource)

  ephemeral 表示由一个集群存储驱动处理的卷。此卷的生命周期与定义该卷的 Pod 相关联。
  Pod 启动前创建此卷，Pod 移除时删除此卷。

  <!--
  Use this if: a) the volume is only needed while the pod runs, b) features of normal volumes like restoring from snapshot or capacity
     tracking are needed,
  c) the storage driver is specified through a storage class, and d) the storage driver supports dynamic volume provisioning through
     a PersistentVolumeClaim (see EphemeralVolumeSource for more
     information on the connection between this volume type
     and PersistentVolumeClaim).
  -->

  使用此字段的情形包括：
  a) 仅在 Pod 运行时才需要此卷，
  b) 需要从快照恢复或容量跟踪等正常卷的功能特性，
  c) 通过存储类指定存储驱动，以及
  d) 存储驱动支持通过 PersistentVolumeClaim 进行动态卷制备
  （有关此卷类型和 PersistentVolumeClaim 之间连接的更多信息，请参考 EphemeralVolumeSource）。

  <!--
  Use PersistentVolumeClaim or one of the vendor-specific APIs for volumes that persist for longer than the lifecycle of an individual pod.

  Use CSI for light-weight local ephemeral volumes if the CSI driver is meant to be used that way - see the documentation of the driver for more information.

  A pod can use both types of ephemeral volumes and persistent volumes at the same time.
  -->

  对于持续时间超过单个 Pod 生命周期的卷，使用 PersistentVolumeClaim 或某种特定于供应商的 API。

  如果打算以这种方式使用 CSI 驱动，则将 CSI 用于轻量级本地临时卷。更多的相关信息，请参考驱动文档。

  一个 Pod 可以同时使用临时卷和持久卷这两种类别的卷。

  <!--
  <a name="EphemeralVolumeSource"></a>
  *Represents an ephemeral volume that is handled by a normal storage driver.*

  - **ephemeral.volumeClaimTemplate** (PersistentVolumeClaimTemplate)

    Will be used to create a stand-alone PVC to provision the volume. The pod in which this EphemeralVolumeSource is embedded will be the owner of the PVC, i.e. the PVC will be deleted together with the pod.  The name of the PVC will be `\<pod name>-\<volume name>` where `\<volume name>` is the name from the `PodSpec.Volumes` array entry. Pod validation will reject the pod if the concatenated name is not valid for a PVC (for example, too long).
  -->

  <a name="EphemeralVolumeSource"></a>
  **表示由一个正常存储驱动处理的临时卷。**

  - **ephemeral.volumeClaimTemplate** (PersistentVolumeClaimTemplate)

    将用于创建独立的 PVC 以制备卷。
    嵌入了 EphemeralVolumeSource 的 Pod 将是 PVC 的所有者，即 PVC 将与 Pod 一起删除。
    PVC 的名称将是 `<pod 名称>-<卷名称>`，其中 `<卷名称>` 是来自 `PodSpec.Volumes` 数组条目的名称。
    如果串联的名称对于 PVC 无效（例如太长），则 Pod 验证将拒绝该 Pod。

    <!--
    An existing PVC with that name that is not owned by the pod will *not* be used for the pod to avoid using an unrelated volume by mistake. Starting the pod is then blocked until the unrelated PVC is removed. If such a pre-created PVC is meant to be used by the pod, the PVC has to updated with an owner reference to the pod once the pod exists. Normally this should not be necessary, but it may be useful when manually reconstructing a broken cluster.

    This field is read-only and no changes will be made by Kubernetes to the PVC after it has been created.
    -->

    如果具有此名称的现有 PVC 不属于此 Pod，则这一 PVC 将**不会**被用于此 Pod，以避免错误地使用不相关的卷。
    如果出现这种情况，Pod 的启动操作会被阻塞直到不相关的 PVC 被移除。
    如果 Pod 准备使用这样一个预先创建的 PVC，那么一旦此 Pod 出现，就必须更新 PVC，
    将其属主引用指向该 Pod。通常没有必要这样做，但这对手动重构损坏的集群时可能很有用。

    此字段是只读的，PVC 被创建后 Kubernetes 不会对其进行任何更改。

    <!--
    Required, must not be nil.

    <a name="PersistentVolumeClaimTemplate"></a>
    *PersistentVolumeClaimTemplate is used to produce PersistentVolumeClaim objects as part of an EphemeralVolumeSource.*
    -->

    必需，不能为 nil。

    <a name="PersistentVolumeClaimTemplate"></a>
    **PersistentVolumeClaimTemplate 用于作为 EphemeralVolumeSource 的一部分生成 PersistentVolumeClaim 对象。**

    <!--
    - **ephemeral.volumeClaimTemplate.spec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimSpec" >}}">PersistentVolumeClaimSpec</a>), required

      The specification for the PersistentVolumeClaim. The entire content is copied unchanged into the PVC that gets created from this template. The same fields as in a PersistentVolumeClaim are also valid here.

    - **ephemeral.volumeClaimTemplate.metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

      May contain labels and annotations that will be copied into the PVC when creating it. No other fields are allowed and will be rejected during validation.
    -->

    - **ephemeral.volumeClaimTemplate.spec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimSpec" >}}">PersistentVolumeClaimSpec</a>)，必需

      PersistentVolumeClaim 的规约。整个规约的内容将被原封不动地复制到从此模板创建的 PVC 中。
      与 PersistentVolumeClaim 相同的字段在此处也有效。

    - **ephemeral.volumeClaimTemplate.metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

      可能包含一些标签和注解，在创建 PVC 时，这些数据会被复制到 PVC 中。
      在验证期间，其他字段都不允许设置，即便设置也会在验证阶段被拒绝。

<!--
- **fc** (FCVolumeSource)

  fc represents a Fibre Channel resource that is attached to a kubelet's host machine and then exposed to the pod.

  <a name="FCVolumeSource"></a>
  *Represents a Fibre Channel volume. Fibre Channel volumes can only be mounted as read/write once. Fibre Channel volumes support ownership management and SELinux relabeling.*
-->
- **fc** (FCVolumeSource)

  fc 表示挂接到 kubelet 的主机随后暴露给 Pod 的一个 Fibre Channel 资源。

  <a name="FCVolumeSource"></a>
  **表示 Fibre Channel 卷。Fibre Channel 卷只能以读/写一次进行挂载。
  Fibre Channel 卷支持所有权管理和 SELinux 重新打标签。**

  <!--
  - **fc.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.

  - **fc.lun** (int32)
    lun is Optional: FC target lun number
  -->

  - **fc.fsType** (string)

    fsType 是要挂载的文件系统类型。必须是主机操作系统所支持的文件系统类型之一。
    例如 “ext4”、“xfs”、“ntfs”。如果未指定，则隐式推断为 “ext4”。

  - **fc.lun** (int32)

    lun 是可选的：FC 目标 lun 编号。

  <!--
  - **fc.readOnly** (boolean)

    readOnly is Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.

  - **fc.targetWWNs** ([]string)

    *Atomic: will be replaced during a merge*
    
    targetWWNs is Optional: FC target worldwide names (WWNs)

  - **fc.wwids** ([]string)

    *Atomic: will be replaced during a merge*
    
    wwids Optional: FC volume world wide identifiers (wwids) Either wwids or combination of targetWWNs and lun must be set, but not both simultaneously.
  -->

  - **fc.readOnly** (boolean)

    readOnly 是可选的。默认为 false（读/写）。此处的 readOnly 将强制设置卷挂载中的 readOnly 属性。

  - **fc.targetWWNs** ([]string)

    **原子：将在合并期间被替换**

    targetWWNs 是可选的。FC 目标全球名称（WWN）。

  - **fc.wwids** ([]string)

    **原子：将在合并期间被替换**

    wwids 是可选的。FC 卷全球识别号（wwids）。
    必须设置 wwids 或 targetWWNs 及 lun 的组合，但不能同时设置两者。

<!--
- **flexVolume** (FlexVolumeSource)

  flexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin. Deprecated: FlexVolume is deprecated. Consider using a CSIDriver instead.

  <a name="FlexVolumeSource"></a>
  *FlexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin.*

  - **flexVolume.driver** (string), required

    driver is the name of the driver to use for this volume.

  - **flexVolume.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". The default filesystem depends on FlexVolume script.
-->
- **flexVolume** (FlexVolumeSource)

  flexVolume 表示使用基于 exec 的插件制备/挂接的通用卷资源。
  已弃用：FlexVolume 已被弃用，请考虑使用 CSIDriver 代替。

  <a name="FlexVolumeSource"></a>
  **flexVolume 表示使用基于 exec 的插件制备/挂接的通用卷资源。**

  - **flexVolume.driver** (string)，必需

    driver 是供此卷使用的驱动的名称。

  - **flexVolume.fsType** (string)

    fsType 是要挂载的文件系统类型。必须是主机操作系统所支持的文件系统类型之一。
    例如 “ext4”、“xfs”、“ntfs”。
    默认的文件系统取决于 flexVolume 脚本。

  <!--
  - **flexVolume.options** (map[string]string)

    options is Optional: this field holds extra command options if any.

  - **flexVolume.readOnly** (boolean)

    readOnly is Optional: defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.

  - **flexVolume.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef is Optional: secretRef is reference to the secret object containing sensitive information to pass to the plugin scripts. This may be empty if no secret object is specified. If the secret object contains more than one secret, all secrets are passed to the plugin scripts.
  -->

  - **flexVolume.options** (map[string]string)

    options 是可选的。此字段包含额外的命令选项（如果有）。

  - **flexVolume.readOnly** (boolean)

    readOnly 是可选的。默认为 false（读/写）。此处的 readOnly 将强制设置卷挂载中的 readOnly 属性。

  - **flexVolume.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef 是可选的。secretRef 是对包含敏感信息的 Secret 对象的引用，该 Secret 会被传递到插件脚本。
    如果未指定 Secret 对象，则此字段可以为空。如果 Secret 对象包含多个 Secret，则所有 Secret 被传递到插件脚本。

<!--
- **flocker** (FlockerVolumeSource)

  flocker represents a Flocker volume attached to a kubelet's host machine. This depends on the Flocker control service being running. Deprecated: Flocker is deprecated and the in-tree flocker type is no longer supported.

  <a name="FlockerVolumeSource"></a>
  *Represents a Flocker volume mounted by the Flocker agent. One and only one of datasetName and datasetUUID should be set. Flocker volumes do not support ownership management or SELinux relabeling.*

  - **flocker.datasetName** (string)

    datasetName is Name of the dataset stored as metadata -> name on the dataset for Flocker should be considered as deprecated

  - **flocker.datasetUUID** (string)

    datasetUUID is the UUID of the dataset. This is unique identifier of a Flocker dataset
-->
- **flocker** (FlockerVolumeSource)

  flocker 表示挂接到一个 kubelet 主机的 Flocker 卷。Flocker
  卷依赖于正在运行的 Flocker 控制服务。
  已弃用：Flocker 已被弃用，且树内 Flocker 类型不再受支持。

  <a name="FlockerVolumeSource"></a>
  **表示 Flocker 代理挂载的 Flocker 卷。应设置一个且仅设置 datasetName 和 datasetUUID 中的一个。
  Flocker 卷不支持所有权管理或 SELinux 重新打标签。**

  - **flocker.datasetName** (string)

    datasetName 是存储为元数据的数据集的名称。Flocker 数据集的名称应视为已弃用。

  - **flocker.datasetUUID** (string)

    datasetUUID 是数据集的 UUID。这是 Flocker 数据集的唯一标识符。

<!--
- **gcePersistentDisk** (GCEPersistentDiskVolumeSource)

  gcePersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Deprecated: GCEPersistentDisk is deprecated. All operations for the in-tree gcePersistentDisk type are redirected to the pd.csi.storage.gke.io CSI driver. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

  <a name="GCEPersistentDiskVolumeSource"></a>
  *Represents a Persistent Disk resource in Google Compute Engine.

  A GCE PD must exist before mounting to a container. The disk must also be in the same GCE project and zone as the kubelet. A GCE PD can only be mounted as read/write once or read-only many times. GCE PDs support ownership management and SELinux relabeling.*
-->
- **gcePersistentDisk** (GCEPersistentDiskVolumeSource)

  gcePersistentDisk 表示挂接到 kubelet 的主机随后暴露给 Pod 的一个 GCE Disk 资源。
  已弃用：GCEPersistentDisk 已被弃用。所有针对树内 gcePersistentDisk
  类型的操作都将重定向至 pd.csi.storage.gke.io CSI 驱动。
  更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#gcepersistentdisk

  <a name="GCEPersistentDiskVolumeSource"></a>
  **表示 Google Compute Engine 中的 Persistent Disk 资源。
  挂载到一个容器之前 GCE PD 必须已经存在。该磁盘还必须与 kubelet 位于相同的 GCE 项目和区域中。
  GCE PD 只能挂载为读/写一次或只读多次。GCE PD 支持所有权管理和 SELinux 重新打标签。**

  <!--
  - **gcePersistentDisk.pdName** (string), required

    pdName is unique name of the PD resource in GCE. Used to identify the disk in GCE. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.fsType** (string)

    fsType is filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk
  -->

  - **gcePersistentDisk.pdName** (string)，必需

    pdName 是 GCE 中 PD 资源的唯一名称。用于标识 GCE 中的磁盘。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.fsType** (string)

    fsType 是你要挂载的卷的文件系统类型。提示：确保主机操作系统支持此文件系统类型。
    例如：“ext4”、“xfs”、“ntfs”。如果未指定，则隐式推断为“ext4”。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#gcepersistentdisk

  <!--
  - **gcePersistentDisk.partition** (int32)

    partition is the partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty). More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.readOnly** (boolean)

    readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk
  -->

  - **gcePersistentDisk.partition** (int32)

    partition 是你要挂载的卷中的分区。如果省略，则默认为按卷名称进行挂载。
    例如：对于卷 /dev/sda1，将分区指定为 “1”。类似地，/dev/sda 的卷分区为 “0”（或可以将属性留空）。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.readOnly** (boolean)

    此处的 readOnly 将强制设置卷挂载中的 readOnly 属性。默认为 false。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#gcepersistentdisk

<!--
- **glusterfs** (GlusterfsVolumeSource)

  glusterfs represents a Glusterfs mount on the host that shares a pod's lifetime. Deprecated: Glusterfs is deprecated and the in-tree glusterfs type is no longer supported.

  <a name="GlusterfsVolumeSource"></a>
  *Represents a Glusterfs mount that lasts the lifetime of a pod. Glusterfs volumes do not support ownership management or SELinux relabeling.*
-->

- **glusterfs** （GlusterfsVolumeSource）

  glusterfs 表示关联到主机并暴露给 Pod 的 Glusterfs 卷。由管理员配置。
  已弃用：glusterfs 已被弃用，且树内 glusterfs 类型不再受支持。

  <a name="GlusterfsVolumeSource"></a>
  **表示在 Pod 生命周期内一直存在的 Glusterfs 挂载卷。Glusterfs 卷不支持属主管理或 SELinux 重标记。**
  
  <!--
  - **glusterfs.endpoints** (string), required

    endpoints is the endpoint name that details Glusterfs topology.

  - **glusterfs.path** (string), required

    path is the Glusterfs volume path. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.readOnly** (boolean)

    readOnly here will force the Glusterfs volume to be mounted with read-only permissions. Defaults to false. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod
  -->

  - **glusterfs.endpoints** (string)，必需

    endpoints 是详细给出 Glusterfs 拓扑结构的端点的名称。

  - **glusterfs.path** (string)，必需

    path 是 Glusterfs 卷的路径。更多信息：
    https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.readOnly** (boolean)

    此处的 readOnly 将强制以只读权限挂载 Glusterfs 卷。
    默认为 false。更多信息：
    https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

<!--
- **iscsi** (ISCSIVolumeSource)

  iscsi represents an ISCSI Disk resource that is attached to a kubelet's host machine and then exposed to the pod.

  <a name="ISCSIVolumeSource"></a>
  *Represents an ISCSI disk. ISCSI volumes can only be mounted as read/write once. ISCSI volumes support ownership management and SELinux relabeling.*
-->
- **iscsi** (ISCSIVolumeSource)

  iscsi 表示挂接到 kubelet 的主机随后暴露给 Pod 的一个 ISCSI Disk 资源。

  <a name="ISCSIVolumeSource"></a>
  **表示一个 ISCSI 磁盘。ISCSI 卷只能以读/写一次进行挂载。ISCSI 卷支持所有权管理和 SELinux 重新打标签。**

  <!--
  - **iscsi.iqn** (string), required

    iqn is the target iSCSI Qualified Name.

  - **iscsi.lun** (int32), required

    lun represents iSCSI Target Lun number.

  - **iscsi.targetPortal** (string), required

    targetPortal is iSCSI Target Portal. The Portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).
  -->

  - **iscsi.iqn** (string)，必需

    iqn 是目标 iSCSI 限定名称。

  - **iscsi.lun** (int32)，必需

    lun 表示 iSCSI 目标逻辑单元号。

  - **iscsi.targetPortal** (string)，必需

    targetPortal 是 iSCSI 目标门户。
    如果不是默认端口（通常是 TCP 端口 860 和 3260），则 Portal 为 IP 或 ip_addr:port。

  <!--
  - **iscsi.chapAuthDiscovery** (boolean)

    chapAuthDiscovery defines whether support iSCSI Discovery CHAP authentication

  - **iscsi.chapAuthSession** (boolean)

    chapAuthSession defines whether support iSCSI Session CHAP authentication
  -->

  - **iscsi.chapAuthDiscovery** (boolean)

    chapAuthDiscovery 定义是否支持 iSCSI Discovery CHAP 身份认证。

  - **iscsi.chapAuthSession** (boolean)

    chapAuthSession 定义是否支持 iSCSI Session CHAP 身份认证。

  <!--
  - **iscsi.fsType** (string)

    fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#iscsi

  - **iscsi.initiatorName** (string)

    initiatorName is the custom iSCSI Initiator Name. If initiatorName is specified with iscsiInterface simultaneously, new iSCSI interface \<target portal>:\<volume name> will be created for the connection.
  -->

  - **iscsi.fsType** (string)

    fsType 是你要挂载的卷的文件系统类型。提示：确保主机操作系统支持此文件系统类型。
    例如：“ext4”、“xfs”、“ntfs”。如果未指定，则隐式推断为 “ext4”。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#iscsi

  - **iscsi.initiatorName** (string)

    initiatorName 是自定义的 iSCSI 发起程序名称（iSCSI Initiator Name）。
    如果同时用 iscsiInterface 指定 initiatorName，将为连接创建新的 iSCSI 接口 \<目标门户>:\<卷名称>。

  <!--
  - **iscsi.iscsiInterface** (string)

    iscsiInterface is the interface Name that uses an iSCSI transport. Defaults to 'default' (tcp).

  - **iscsi.portals** ([]string)

    *Atomic: will be replaced during a merge*
    
    portals is the iSCSI Target Portal List. The portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).
  -->

  - **iscsi.iscsiInterface** (string)

    iscsiInterface 是使用 iSCSI 传输的接口名称。默认为 “default”（tcp）。

  - **iscsi.portals** ([]string)

    **原子：将在合并期间被替换**

    portals 是 iSCSI 目标门户列表（iSCSI Target Portal List）。
    如果不是默认端口（通常是 TCP 端口 860 和 3260），则 Portal 为 IP 或 ip_addr:port。

  <!--
  - **iscsi.readOnly** (boolean)

    readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false.

  - **iscsi.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef is the CHAP Secret for iSCSI target and initiator authentication
  -->

  - **iscsi.readOnly** (boolean)

    此处的 readOnly 将强制设置卷挂载中的 readOnly 属性。默认为 false。

  - **iscsi.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef 是 iSCSI 目标和发起程序身份认证所用的 CHAP Secret。

<!--
- **image** (ImageVolumeSource)

  image represents an OCI object (a container image or artifact) pulled and mounted on the kubelet's host machine. The volume is resolved at pod startup depending on which PullPolicy value is provided:
-->
- **image** (ImageVolumeSource)

  image 表示一个在 kubelet 的主机上拉取并挂载的 OCI 对象（容器镜像或工件）。
  其卷在 Pod 启动时根据提供的 PullPolicy 值进行解析：

  <!--
  - Always: the kubelet always attempts to pull the reference. Container creation will fail If the pull fails. - Never: the kubelet never pulls the reference and only uses a local image or artifact. Container creation will fail if the reference isn't present. - IfNotPresent: the kubelet pulls if the reference isn't already present on disk. Container creation will fail if the reference isn't present and the pull fails.
  -->

  - Always：kubelet 始终尝试拉取此引用。如果拉取失败，容器创建将失败。
  - Never：kubelet 从不拉取此引用，只使用本地镜像或工件。如果引用不存在，容器创建将失败。
  - IfNotPresent：如果磁盘上尚不存在此引用，kubelet 执行拉取操作。若此引用不存在且拉取失败，则容器创建将失败。

  <!--
  The volume gets re-resolved if the pod gets deleted and recreated, which means that new remote content will become available on pod recreation. A failure to resolve or pull the image during pod startup will block containers from starting and may add significant latency. Failures will be retried using normal volume backoff and will be reported on the pod reason and message. The types of objects that may be mounted by this volume are defined by the container runtime implementation on a host machine and at minimum must include all valid types supported by the container image field. The OCI object gets mounted in a single directory (spec.containers[*].volumeMounts.mountPath) by merging the manifest layers in the same way as for container images. The volume will be mounted read-only (ro) and non-executable files (noexec). Sub path mounts for containers are not supported (spec.containers[*].volumeMounts.subpath) before 1.33. The field spec.securityContext.fsGroupChangePolicy has no effect on this volume type.
  -->

  如果 Pod 被删除并重新创建，此卷会被重新解析，这意味着在 Pod 重新创建时将可以访问新的远程内容。
  在 Pod 启动期间解析或拉取镜像失败将导致容器无法启动，并可能显著增加延迟。
  如果失败，将使用正常的卷回退机制进行重试，并输出 Pod 失败的原因和相关消息。
  此卷可以挂载的对象类型由主机上的容器运行时实现负责定义，至少必须包含容器镜像字段所支持的所有有效类型。
  OCI 对象将以只读方式被挂载到单个目录（`spec.containers[*].volumeMounts.mountPath`）中。
  在 Linux 上，容器运行时通常还会挂载阻止文件执行（`noexec`）的卷。
  1.33 版本之前不支持容器使用子路径挂载（`spec.containers[*].volumeMounts.subpath`）。
  `spec.securityContext.fsGroupChangePolicy` 字段对这种卷没有效果。

  <!--
  <a name="ImageVolumeSource"></a>
  *ImageVolumeSource represents a image volume resource.*

  - **image.pullPolicy** (string)

    Policy for pulling OCI objects. Possible values are: Always: the kubelet always attempts to pull the reference. Container creation will fail If the pull fails. Never: the kubelet never pulls the reference and only uses a local image or artifact. Container creation will fail if the reference isn't present. IfNotPresent: the kubelet pulls if the reference isn't already present on disk. Container creation will fail if the reference isn't present and the pull fails. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise.
  -->

  <a name="ImageVolumeSource"></a>
  **ImageVolumeSource 表示一个镜像卷资源。**

  - **image.pullPolicy**（字符串）

    OCI 对象的拉取策略。可能的值有：

    - Always：kubelet 始终尝试拉取此引用。如果拉取失败，容器创建将失败。
    - Never：kubelet 从不拉取此引用，只使用本地镜像或工件。如果引用不存在，容器创建将失败。
    - IfNotPresent：如果磁盘上尚不存在此引用，kubelet 执行拉取操作。
      如果引用不存在且拉取失败，容器创建将失败。
      如果指定了 `:latest` 标签，则默认为 Always，否则默认为 IfNotPresent。

    <!--
    Possible enum values:
     - `"Always"` means that kubelet always attempts to pull the latest image. Container will fail If the pull fails.
     - `"IfNotPresent"` means that kubelet pulls if the image isn't present on disk. Container will fail if the image isn't present and the pull fails.
     - `"Never"` means that kubelet never pulls an image, but only uses a local image. Container will fail if the image isn't present
    -->
  
    可能的枚举值：
    - `"Always"` 表示 kubelet 总是尝试拉取最新的镜像。如果拉取失败，容器将失败。
    - `"IfNotPresent"` 表示如果磁盘上没有所指定的镜像，则 kubelet 会拉取。如果镜像不存在且拉取失败，容器将失败。
    - `"Never"` 表示 kubelet 从不拉取镜像，仅使用本地镜像。如果镜像不存在，容器将失败。
  
  - **image.reference** (string)

    <!--
    Required: Image or artifact reference to be used. Behaves in the same way as pod.spec.containers[*].image. Pull secrets will be assembled in the same way as for the container image by looking up node credentials, SA image pull secrets, and pod spec image pull secrets. More info: https://kubernetes.io/docs/concepts/containers/images This field is optional to allow higher level config management to default or override container images in workload controllers like Deployments and StatefulSets.
    -->
  
    必需：要使用的镜像或工件引用。行为与 pod.spec.containers[*].image 相同。
    拉取 Secret 的组装方式与容器镜像所用的方式相同，
    都是通过查找节点凭据、服务账户（SA）镜像拉取 Secret 和 Pod 规约镜像拉取 Secret。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/containers/images
    此字段是可选的，以允许更高层次的配置管理在 Deployment 和 StatefulSet 这类工作负载控制器中默认或覆盖容器镜像。

<!--
- **nfs** (NFSVolumeSource)

  nfs represents an NFS mount on the host that shares a pod's lifetime More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs

  <a name="NFSVolumeSource"></a>
  *Represents an NFS mount that lasts the lifetime of a pod. NFS volumes do not support ownership management or SELinux relabeling.*

  - **nfs.path** (string), required

    path that is exported by the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs
-->
- **nfs** (NFSVolumeSource)

  nfs 表示在主机上挂载的 NFS，其生命周期与 Pod 相同。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#nfs

  <a name="NFSVolumeSource"></a>
  **表示 Pod 的生命周期内一直存在的 NFS 挂载。NFS 卷不支持所有权管理或 SELinux 重新打标签。**

  - **nfs.path** (string)，必需

    path 是由 NFS 服务器导出的路径。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#nfs

  <!--
  - **nfs.server** (string), required

    server is the hostname or IP address of the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs

  - **nfs.readOnly** (boolean)

    readOnly here will force the NFS export to be mounted with read-only permissions. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs
  -->

  - **nfs.server** (string)，必需

    server 是 NFS 服务器的主机名或 IP 地址。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#nfs

  - **nfs.readOnly** (boolean)

    此处 readOnly 将强制使用只读权限挂载 NFS 导出。默认为 false。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#nfs

<!--
- **photonPersistentDisk** (PhotonPersistentDiskVolumeSource)

  photonPersistentDisk represents a PhotonController persistent disk attached and mounted on kubelets host machine. Deprecated: PhotonPersistentDisk is deprecated and the in-tree photonPersistentDisk type is no longer supported.

  <a name="PhotonPersistentDiskVolumeSource"></a>
  *Represents a Photon Controller persistent disk resource.*

  - **photonPersistentDisk.pdID** (string), required

    pdID is the ID that identifies Photon Controller persistent disk

  - **photonPersistentDisk.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.
-->
- **photonPersistentDisk** (PhotonPersistentDiskVolumeSource)

  photonPersistentDisk 表示 kubelet 主机上挂接和挂载的 PhotonController 持久磁盘。
  已弃用：PhotonPersistentDisk 已被弃用，且树内 photonPersistentDisk 类型不再受支持。

  <a name="PhotonPersistentDiskVolumeSource"></a>
  **表示 Photon Controller 持久磁盘资源。**

  - **photonPersistentDisk.pdID** (string)，必需

    pdID 是标识 Photon Controller 持久磁盘的 ID。

  - **photonPersistentDisk.fsType** (string)

    fsType 是要挂载的文件系统类型。必须是主机操作系统所支持的文件系统类型之一。
    例如 “ext4”、“xfs”、“ntfs”。如果未指定，则隐式推断为 “ext4”。

<!--
- **portworxVolume** (PortworxVolumeSource)

  portworxVolume represents a portworx volume attached and mounted on kubelets host machine. Deprecated: PortworxVolume is deprecated. All operations for the in-tree portworxVolume type are redirected to the pxd.portworx.com CSI driver when the CSIMigrationPortworx feature-gate is on.

  <a name="PortworxVolumeSource"></a>
  *PortworxVolumeSource represents a Portworx volume resource.*

  - **portworxVolume.volumeID** (string), required

    volumeID uniquely identifies a Portworx volume
-->
- **portworxVolume** (PortworxVolumeSource)

  portworxVolume 表示 kubelet 主机上挂接和挂载的 portworx 卷。
  已弃用：PortworxVolume 已被弃用。当 CSIMigrationPortworx 特性开关开启时，
  所有树内 PortworxVolume 类型的操作都将重定向到 pxd.portworx.com CSI 驱动。

  <a name="PortworxVolumeSource"></a>
  **PortworxVolumeSource 表示 Portworx 卷资源。**

  - **portworxVolume.volumeID** (string)，必需

    volumeID 唯一标识 Portworx 卷。

  <!--
  - **portworxVolume.fsType** (string)

    fSType represents the filesystem type to mount Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs". Implicitly inferred to be "ext4" if unspecified.

  - **portworxVolume.readOnly** (boolean)

    readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
  -->

  - **portworxVolume.fsType** (string)

    fSType 表示要挂载的文件系统类型。必须是主机操作系统支持的文件系统类型。例如 “ext4”、“xfs”。
    如果未指定，则隐式推断为 “ext4”。

  - **portworxVolume.readOnly** (boolean)

    readOnly 默认为 false（读/写）。此处的 readOnly 将强制设置卷挂载中的 readOnly 属性。

<!--
- **quobyte** (QuobyteVolumeSource)

  quobyte represents a Quobyte mount on the host that shares a pod's lifetime. Deprecated: Quobyte is deprecated and the in-tree quobyte type is no longer supported.

  <a name="QuobyteVolumeSource"></a>
  *Represents a Quobyte mount that lasts the lifetime of a pod. Quobyte volumes do not support ownership management or SELinux relabeling.*
-->
- **quobyte** (QuobyteVolumeSource)

  quobyte 表示在共享 Pod 生命周期的主机上挂载的 Quobyte。
  已弃用：quobyte 已被弃用，且树内 quobyte 类型不再受支持。

  <a name="QuobyteVolumeSource"></a>
  **表示在 Pod 的生命周期内持续的 Quobyte 挂载。Quobyte 卷不支持所有权管理或 SELinux 重新打标签。**

  <!--
  - **quobyte.registry** (string), required

    registry represents a single or multiple Quobyte Registry services specified as a string as host:port pair (multiple entries are separated with commas) which acts as the central registry for volumes

  - **quobyte.volume** (string), required

    volume is a string that references an already created Quobyte volume by name.

  - **quobyte.group** (string)

    group to map volume access to Default is no group
  -->

  - **quobyte.registry** (string)，必需

    registry 表示将一个或多个 Quobyte Registry 服务指定为 host:port 对的字符串形式
    （多个条目用英文逗号分隔），用作卷的中央注册表。

  - **quobyte.volume** (string)，必需

    volume 是按名称引用已创建的 Quobyte 卷的字符串。

  - **quobyte.group** (string)

    group 是将卷访问映射到的组。默认为无组。

  <!--
  - **quobyte.readOnly** (boolean)

    readOnly here will force the Quobyte volume to be mounted with read-only permissions. Defaults to false.

  - **quobyte.tenant** (string)

    tenant owning the given Quobyte volume in the Backend Used with dynamically provisioned Quobyte volumes, value is set by the plugin

  - **quobyte.user** (string)

    user to map volume access to Defaults to serivceaccount user
  -->

  - **quobyte.readOnly** (boolean)

    此处 readOnly 将强制使用只读权限挂载 Quobyte 卷。默认为 false。

  - **quobyte.tenant** (string)

    tenant 拥有 Backend Used 中给定的 Quobyte 卷，随动态制备的 Quobyte 卷一起使用，值由插件设置。

  - **quobyte.user** (string)

    user 是将卷访问映射到的用户。默认为 serivceaccount 用户。

<!--
- **rbd** (RBDVolumeSource)

  rbd represents a Rados Block Device mount on the host that shares a pod's lifetime. Deprecated: RBD is deprecated and the in-tree rbd type is no longer supported.

  <a name="RBDVolumeSource"></a>
  *Represents a Rados Block Device mount that lasts the lifetime of a pod. RBD volumes support ownership management and SELinux relabeling.*

  - **rbd.image** (string), required

    image is the rados image name. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
-->

- **rbd** (RBDVolumeSource)

  rbd 表示在共享 Pod 生命周期的主机上挂载的 Rados Block Device。
  已弃用：RBD 已被弃用，且树内 rbd 类型不再受支持。

  <a name="RBDVolumeSource"></a>
  **表示在 Pod 的生命周期内持续的 Rados Block Device 挂载。RBD 卷支持所有权管理和 SELinux 重新打标签。**

  - **rbd.image** (string)，必需

    image 是 rados 镜像名称。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  <!--
  - **rbd.monitors** ([]string), required

    *Atomic: will be replaced during a merge*
    
    monitors is a collection of Ceph monitors. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.fsType** (string)

    fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#rbd
  -->

  - **rbd.monitors** ([]string)，必需

    **原子：将在合并期间被替换**

    monitors 是 Ceph 监测的集合。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.fsType** (string)

    fsType 是你要挂载的卷的文件系统类型。提示：确保主机操作系统支持此文件系统类型。
    例如：“ext4”、“xfs”、“ntfs”。如果未指定，则隐式推断为 “ext4”。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#rbd

  <!--
  - **rbd.keyring** (string)

    keyring is the path to key ring for RBDUser. Default is /etc/ceph/keyring. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.pool** (string)

    pool is the rados pool name. Default is rbd. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.readOnly** (boolean)

    readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
  -->

  - **rbd.keyring** (string)

    keyring 是 RBDUser 密钥环的路径。默认为 /etc/ceph/keyring。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.pool** (string)

    pool 是 rados 池名称。默认为 rbd。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.readOnly** (boolean)

    此处的 readOnly 将强制设置卷挂载中的 readOnly 属性。默认为 false。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  <!--
  - **rbd.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef is name of the authentication secret for RBDUser. If provided overrides keyring. Default is nil. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.user** (string)

    user is the rados user name. Default is admin. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
  -->

  - **rbd.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef 是 RBDUser 的身份认证 Secret 的名称。如果提供，则重载 keyring。默认为 nil。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.user** (string)

    user 是 rados 用户名。默认为 admin。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

<!--
- **scaleIO** (ScaleIOVolumeSource)

  scaleIO represents a ScaleIO persistent volume attached and mounted on Kubernetes nodes. Deprecated: ScaleIO is deprecated and the in-tree scaleIO type is no longer supported.

  <a name="ScaleIOVolumeSource"></a>
  *ScaleIOVolumeSource represents a persistent ScaleIO volume*

  - **scaleIO.gateway** (string), required

    gateway is the host address of the ScaleIO API Gateway.
-->
- **scaleIO** (ScaleIOVolumeSource)

  scaleIO 表示 Kubernetes 节点上挂接和挂载的 ScaleIO 持久卷。
  已弃用：scaleIO 已被弃用，且树内 scaleIO 类型不再受支持。

  <a name="ScaleIOVolumeSource"></a>
  **ScaleIOVolumeSource 表示一个 ScaleIO 持久卷。**

  - **scaleIO.gateway** (string)，必需

    gateway 是 ScaleIO API 网关的主机地址。

  <!--
  - **scaleIO.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>), required

    secretRef references to the secret for ScaleIO user and other sensitive information. If this is not provided, Login operation will fail.

  - **scaleIO.system** (string), required

    system is the name of the storage system as configured in ScaleIO.

  - **scaleIO.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Default is "xfs".
  -->

  - **scaleIO.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)，必需

    secretRef 引用到 ScaleIO 用户的 Secret 和其他敏感信息。如果未提供此项，则 Login 操作将失败。

  - **scaleIO.system** (string)，必需

    system 是存储系统的名称，与 ScaleIO 中的配置相同。

  - **scaleIO.fsType** (string)

    fsType 是要挂载的文件系统类型。必须是主机操作系统所支持的文件系统类型之一。
    例如 “ext4”、“xfs”、“ntfs”。默认为 “xfs”。

  <!--
  - **scaleIO.protectionDomain** (string)

    protectionDomain is the name of the ScaleIO Protection Domain for the configured storage.

  - **scaleIO.readOnly** (boolean)

    readOnly Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.

  - **scaleIO.sslEnabled** (boolean)

    sslEnabled Flag enable/disable SSL communication with Gateway, default false
  -->

  - **scaleIO.protectionDomain** (string)

    protectionDomain 是 ScaleIO 保护域（ScaleIO Protection Domain）的名称，用于已配置的存储。

  - **scaleIO.readOnly** (boolean)

    readOnly 默认为 false（读/写）。此处的 readOnly 将强制设置卷挂载中的 readOnly 属性。

  - **scaleIO.sslEnabled** (boolean)

    sslEnabled 标志启用/禁用与网关的 SSL 通信，默认为 false。

  <!--
  - **scaleIO.storageMode** (string)

    storageMode indicates whether the storage for a volume should be ThickProvisioned or ThinProvisioned. Default is ThinProvisioned.

  - **scaleIO.storagePool** (string)

    storagePool is the ScaleIO Storage Pool associated with the protection domain.

  - **scaleIO.volumeName** (string)

    volumeName is the name of a volume already created in the ScaleIO system that is associated with this volume source.
  -->

  - **scaleIO.storageMode** (string)

    storageMode 指示卷所用的存储应是 ThickProvisioned 或 ThinProvisioned。默认为 ThinProvisioned。

  - **scaleIO.storagePool** (string)

    storagePool 是与保护域关联的 ScaleIO Storage Pool。

  - **scaleIO.volumeName** (string)

    volumeName 是在与此卷源关联的 ScaleIO 系统中已创建的卷的名称。

<!--
- **storageos** (StorageOSVolumeSource)

  storageOS represents a StorageOS volume attached and mounted on Kubernetes nodes. Deprecated: StorageOS is deprecated and the in-tree storageos type is no longer supported.

  <a name="StorageOSVolumeSource"></a>
  *Represents a StorageOS persistent volume resource.*

  - **storageos.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.
-->
- **storageos** (StorageOSVolumeSource)

  storageOS 表示 Kubernetes 节点上挂接和挂载的 StorageOS 卷。
  已弃用：storageOS 已被弃用，且树内 storageOS 类型不再受支持。

  <a name="StorageOSVolumeSource"></a>
  **表示 StorageOS 持久卷资源。**

  - **storageos.fsType** (string)

    fsType 是要挂载的文件系统类型。必须是主机操作系统所支持的文件系统类型之一。
    例如 “ext4”、“xfs”、“ntfs”。如果未指定，则隐式推断为 “ext4”。

  <!--
  - **storageos.readOnly** (boolean)

    readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.

  - **storageos.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef specifies the secret to use for obtaining the StorageOS API credentials.  If not specified, default values will be attempted.
  -->

  - **storageos.readOnly** (boolean)

    readOnly 默认为 false（读/写）。此处的 readOnly 将强制设置卷挂载中的 readOnly 属性。

  - **storageos.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef 指定用于获取 StorageOS API 凭据的 Secret。如果未指定，则将尝试使用默认值。

  <!--
  - **storageos.volumeName** (string)

    volumeName is the human-readable name of the StorageOS volume.  Volume names are only unique within a namespace.

  - **storageos.volumeNamespace** (string)

    volumeNamespace specifies the scope of the volume within StorageOS.  If no namespace is specified then the Pod's namespace will be used.  This allows the Kubernetes name scoping to be mirrored within StorageOS for tighter integration. Set VolumeName to any name to override the default behaviour. Set to "default" if you are not using namespaces within StorageOS. Namespaces that do not pre-exist within StorageOS will be created.
  -->

  - **storageos.volumeName** (string)

    volumeName 是 StorageOS 卷的人类可读名称。这些卷名称在一个名字空间内是唯一的。

  - **storageos.volumeNamespace** (string)

    volumeNamespace 指定 StorageOS 内卷的作用域。如果未指定名字空间，则将使用 Pod 的名字空间。
    这个设置使得 Kubernetes 的名字作用域可以在 StorageOS 内进行映射，实现更紧密的集成。
    将 volumeName 设为任何名称以重载默认的行为。如果你未在 StorageOS 内使用名字空间，则设为 “default”。
    将创建 StorageOS 内预先不存在的名字空间。

<!--
- **vsphereVolume** (VsphereVirtualDiskVolumeSource)

  vsphereVolume represents a vSphere volume attached and mounted on kubelets host machine. Deprecated: VsphereVolume is deprecated. All operations for the in-tree vsphereVolume type are redirected to the csi.vsphere.vmware.com CSI driver.

  <a name="VsphereVirtualDiskVolumeSource"></a>
  *Represents a vSphere volume resource.*

  - **vsphereVolume.volumePath** (string), required

    volumePath is the path that identifies vSphere volume vmdk
-->
- **vsphereVolume** (VsphereVirtualDiskVolumeSource)

  vsphereVolume 表示 kubelet 主机上挂接和挂载的 vSphere 卷。
  已弃用：VsphereVolume 已被弃用。所有针对树内 vsphereVolume
  类型的操作都将重定向至 csi.vsphere.vmware.com CSI 驱动。

  <a name="VsphereVirtualDiskVolumeSource"></a>
  **表示 vSphere 卷资源。**

  - **vsphereVolume.volumePath** (string)，必需

    volumePath 是标识 vSphere 卷 vmdk 的路径。

  <!--
  - **vsphereVolume.fsType** (string)

    fsType is filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.

  - **vsphereVolume.storagePolicyID** (string)

    storagePolicyID is the storage Policy Based Management (SPBM) profile ID associated with the StoragePolicyName.

  - **vsphereVolume.storagePolicyName** (string)

    storagePolicyName is the storage Policy Based Management (SPBM) profile name.
  -->

  - **vsphereVolume.fsType** (string)

    fsType 是要挂载的文件系统类型。必须是主机操作系统所支持的文件系统类型之一。
    例如 “ext4”、“xfs”、“ntfs”。如果未指定，则隐式推断为 “ext4”。

  - **vsphereVolume.storagePolicyID** (string)

    storagePolicyID 是与 StoragePolicyName 关联的基于存储策略的管理（SPBM）配置文件 ID。

  - **vsphereVolume.storagePolicyName** (string)

    storagePolicyName 是基于存储策略的管理（SPBM）配置文件名称。

<!--
### Deprecated

- **gitRepo** (GitRepoVolumeSource)

  gitRepo represents a git repository at a particular revision. Deprecated: GitRepo is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod's container.

  <a name="GitRepoVolumeSource"></a>
  *Represents a volume that is populated with the contents of a git repository. Git repo volumes do not support ownership management. Git repo volumes support SELinux relabeling.

  DEPRECATED: GitRepo is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod's container.*
-->
### 已弃用 {#deprecated}

- **gitRepo** (GitRepoVolumeSource)

  gitRepo 表示特定修订版本的 git 仓库。（注意：GitRepo 已被弃用。）如果与为某容器提速 Git 仓库，
  可以先将 emptyDir 挂载到 InitContainer 上，由后者使用 git 克隆仓库，然后将 emptyDir 挂载到 Pod 的容器中。

  <a name="GitRepoVolumeSource"></a>
  **表示用 Git 仓库的内容进行填充的一个卷。Git 仓库卷不支持所有权管理。Git 仓库卷支持 SELinux 重新打标签。
  （注意：GitRepo 已被弃用。）如果与为某容器提速 Git 仓库，
  可以先将 emptyDir 挂载到 InitContainer 上，由后者使用 git 克隆仓库，然后将 emptyDir 挂载到 Pod 的容器中。**

  <!--
  - **gitRepo.repository** (string), required

    repository is the URL

  - **gitRepo.directory** (string)

    directory is the target directory name. Must not contain or start with '..'.  If '.' is supplied, the volume directory will be the git repository.  Otherwise, if specified, the volume will contain the git repository in the subdirectory with the given name.

  - **gitRepo.revision** (string)

    revision is the commit hash for the specified revision.
  -->

  - **gitRepo.repository** (string)，必需

    repository 是仓库的 URL。

  - **gitRepo.directory** (string)

    directory 是目标目录的名称。不得包含 “..” 或以 “..” 开头。如果提供了 “.”，则卷目录将是 Git 仓库。
    否则，如果指定，卷将用给定名称的子目录中存放 Git 仓库。

  - **gitRepo.revision** (string)

    revision 是指定修订版本的提交哈希值。

## DownwardAPIVolumeFile {#DownwardAPIVolumeFile}

<!--
DownwardAPIVolumeFile represents information to create the file containing the pod field

<hr>

- **path** (string), required

  Required: Path is  the relative path name of the file to be created. Must not be absolute or contain the '..' path. Must be utf-8 encoded. The first item of the relative path must not start with '..'

- **fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

  Required: Selects a field of the pod: only annotations, labels, name, namespace and uid are supported.
-->
DownwardAPIVolumeFile 表示创建包含 Pod 字段的文件的信息。

<hr>

- **path** (string)，必需

  必需。path 是要创建的文件的相对路径名称。不得使用绝对路径，也不得包含 “..” 路径。
  必须用 UTF-8 进行编码。相对路径的第一项不得用 “..” 开头。

- **fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

  必需。选择 Pod 的字段：仅支持注解、标签、名称、名字空间和 uid。

<!--
- **mode** (int32)

  Optional: mode bits used to set permissions on this file, must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.

- **resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

  Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, requests.cpu and requests.memory) are currently supported.
-->
- **mode** (int32)

  可选：模式位用于设置文件的权限，必须是 0000 到 0777 之间的八进制值或 0 到 511 之间的十进制值。
  YAML 既接受八进制值也接受十进制值，JSON 针对模式位需要十进制值。
  如果未指定，则将使用卷 defaultMode。
  这可能与影响文件模式的其他选项（如 fsGroup）有冲突，且结果可以是其他模式位也被设置。

- **resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

  选择容器的资源：目前仅支持资源限制与请求（limits.cpu、limits.memory、requests.cpu 和 requests.memory）。

## KeyToPath {#KeyToPath}

<!--
Maps a string key to a path within a volume.

<hr>

- **key** (string), required

  key is the key to project.

- **path** (string), required

  path is the relative path of the file to map the key to. May not be an absolute path. May not contain the path element '..'. May not start with the string '..'.
-->
将一个字符串键映射到卷中的一个路径。

<hr>

- **key** (string)，必需

  key 是要投射的键。

- **path** (string)，必需

  path 是将键映射到的文件的相对路径。不能是绝对路径。不能包含路径元素 “..”。不能以字符串 “..” 开头。

<!--
- **mode** (int32)

  mode is Optional: mode bits used to set permissions on this file. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
-->
- **mode** (int32)

  mode 是可选的：模式位用于为文件设置权限。必须是 0000 到 0777 之间的八进制值或 0 到 511 之间的十进制值。
  YAML 既接受八进制值也接受十进制值，JSON 针对模式位需要十进制值。
  如果未指定，则将使用卷 defaultMode。
  这可能与影响文件模式的其他选项（如 fsGroup）有冲突，且结果可以是其他模式位也被设置。
