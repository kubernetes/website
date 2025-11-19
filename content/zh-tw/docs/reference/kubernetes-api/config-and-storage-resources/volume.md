---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "Volume"
content_type: "api_reference"
description: "Volume 表示 Pod 中一個有名字的卷，可以由 Pod 中的任意容器進行訪問。"
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
Volume 表示 Pod 中一個有名字的卷，可以由 Pod 中的任意容器進行訪問。

<hr>

<!--
- **name** (string), required
  name of the volume. Must be a DNS_LABEL and unique within the pod. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names
-->
- **name** (string)，必需

  卷的名稱。必須是 DNS_LABEL 且在 Pod 內是唯一的。更多信息：
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

  persistentVolumeClaimVolumeSource 表示對同一名字空間中 PersistentVolumeClaim 的引用。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

  <a name="PersistentVolumeClaimVolumeSource"></a>
  **PersistentVolumeClaimVolumeSource 引用同一名字空間中用戶的 PVC。
  此卷找到綁定的 PV 併爲 Pod 掛載這個 PV 卷。
  PersistentVolumeClaimVolumeSource 本質上是其他人（或系統）擁有的另一類卷的包裝類。**

  <!--
  - **persistentVolumeClaim.claimName** (string), required
    claimName is the name of a PersistentVolumeClaim in the same namespace as the pod using this volume. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

  - **persistentVolumeClaim.readOnly** (boolean)
    readOnly Will force the ReadOnly setting in VolumeMounts. Default false.
  -->

  - **persistentVolumeClaim.claimName** (string)，必需

    claimName 是與使用此卷的 Pod 位於同一名字空間中的 PersistentVolumeClaim 的名稱。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes#persistentvolumeclaims

  - **persistentVolumeClaim.readOnly** (boolean)

    readOnly 將在卷掛載中強制設置 readOnly 屬性。默認爲 false。

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

  configMap 表示應填充此卷的 configMap。

  <a name="ConfigMapVolumeSource"></a>
  **將 ConfigMap 適配到一個卷中。目標 ConfigMap 的 data 字段的內容將以文件的形式呈現在一個卷中，
  使用 data 字段中的鍵名作爲文件名，除非 items 元素中已經填充了由鍵名到路徑的特定映射。
  ConfigMap 卷支持所有權管理和 SELinux 重新打標籤。**

  <!--
  - **configMap.name** (string)

    Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

  - **configMap.optional** (boolean)

    optional specify whether the ConfigMap or its keys must be defined
  -->
  - **configMap.name** (string)

    被引用資源的名稱。此字段實際上是必需的，但由於向後兼容性，可以允許爲空。
    此類型的實例如果將此字段的值設爲空，幾乎可以肯定是錯誤的。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

  - **configMap.optional** (boolean)

    optional 指定是否所引用的 ConfigMap 或其鍵必須已經被定義。

  <!--
  - **configMap.defaultMode** (int32)

    defaultMode is optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.

  - **configMap.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

    *Atomic: will be replaced during a merge*
    
    items if unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.
  -->

  - **configMap.defaultMode** (int32)

    defaultMode 是可選的：默認情況下，模式位用於爲已創建的文件設置權限。
    必須是 0000 到 0777 之間的八進制值或 0 到 511 之間的十進制值。
    YAML 既接受八進制值也接受十進制值，JSON 針對模式位需要十進制值。此字段默認爲 0644。
    路徑內的目錄不受此設置的影響。這可能與影響文件模式的其他選項（如 fsGroup）有衝突，且結果可以是其他模式位也被設置。

  - **configMap.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

    **原子：將在合併期間被替換**

    如果未指定 items，則所引用的 ConfigMap 的 data 字段中的每個鍵值對將作爲一個文件被投射到卷中，
    這個文件的名稱是鍵名，而文件的內容是鍵的取值。
    如果指定 items，則所列出的鍵將被投射到指定的路徑中，且不會顯示未列出的鍵。
    如果指定的鍵不在 ConfigMap 中，則卷設置將出錯，除非對應的鍵被標記爲可選。
    路徑必須是相對路徑，不能包含 “..” 路徑，也不能以 “..” 開頭。

<!--
- **secret** (SecretVolumeSource)

  secret represents a secret that should populate this volume. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret

  <a name="SecretVolumeSource"></a>
  *Adapts a Secret into a volume.
  
  The contents of the target Secret's Data field will be presented in a volume as files using the keys in the Data field as the file names. Secret volumes support ownership management and SELinux relabeling.*
-->
- **secret** (SecretVolumeSource)

  secret 表示用來填充此卷的 Secret。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#secret

  <a name="SecretVolumeSource"></a>
  **將 Secret 適配到一個卷中。
  目標 Secret 的 data 字段的內容將以文件的形式呈現在一個卷中，使用 data 字段中的鍵名作爲文件名。
  Secret 卷支持所有權管理和 SELinux 重新打標籤。**

  <!--
  - **secret.secretName** (string)

    secretName is the name of the secret in the pod's namespace to use. More info: https://kubernetes.io/docs/concepts/storage/volumes#secret

  - **secret.optional** (boolean)

    optional field specify whether the Secret or its keys must be defined
  -->

  - **secret.secretName** (string)

    secretName 是要使用的、位於 Pod 的名字空間中的 Secret 名稱。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#secret

  - **secret.optional** (boolean)

    optional 字段指定是否 Secret 或其鍵必須已經定義。

  <!--
  - **secret.defaultMode** (int32)

    defaultMode is Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.

  - **secret.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

    *Atomic: will be replaced during a merge*
    
    items If unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the Secret, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.
  -->

  - **secret.defaultMode** (int32)

    defaultMode 是可選的：默認情況下，模式位用於爲已創建的文件設置權限。
    必須是 0000 到 0777 之間的八進制值或 0 到 511 之間的十進制值。
    YAML 既接受八進制值也接受十進制值，JSON 針對模式位需要十進制值。此字段默認爲 0644。
    路徑內的目錄不受此設置的影響。
    這可能與影響文件模式的其他選項（如 fsGroup）有衝突，且結果可以是其他模式位也被設置。

  - **secret.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

    **原子：將在合併期間被替換**

    如果未指定 items，則所引用的 Secret 的 data 字段中的每個鍵值對將作爲一個文件被投射到卷中，
    這個文件的名稱是鍵名，而文件的內容是鍵的取值。
    如果指定 items，則所列出的鍵將被投射到指定的路徑中，且不會顯示未列出的鍵。
    如果指定的鍵不在 Secret 中，則卷設置將出錯，除非對應的鍵被標記爲可選。
    路徑必須是相對路徑，不能包含 “..” 路徑，也不能以 “..” 開頭。

<!--
- **downwardAPI** (DownwardAPIVolumeSource)

  downwardAPI represents downward API about the pod that should populate this volume

  <a name="DownwardAPIVolumeSource"></a>
  *DownwardAPIVolumeSource represents a volume containing downward API info. Downward API volumes support ownership management and SELinux relabeling.*
-->
- **downwardAPI** (DownwardAPIVolumeSource)

  downwardAPI 表示有關 Pod 的 Downward API，用來填充此卷。

  <a name="DownwardAPIVolumeSource"></a>
  **DownwardAPIVolumeSource 表示包含 Downward API 信息的一個卷。Downward API
  卷支持所有權管理和 SELinux 重新打標籤。**

  <!--
  - **downwardAPI.defaultMode** (int32)

    Optional: mode bits to use on created files by default. Must be a Optional: mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Defaults to 0644. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.

  - **downwardAPI.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#DownwardAPIVolumeFile" >}}">DownwardAPIVolumeFile</a>)

    *Atomic: will be replaced during a merge*
    
    Items is a list of downward API volume file
  -->

  - **downwardAPI.defaultMode** (int32)

    可選：默認情況下，模式位用於已創建的文件。
    必須是可選的：默認情況下，模式位用於爲已創建的文件設置權限。
    必須是 0000 到 0777 之間的八進制值或 0 到 511 之間的十進制值。
    YAML 既接受八進制值也接受十進制值，JSON 針對模式位需要十進制值。此字段默認爲 0644。
    路徑內的目錄不受此設置的影響。這可能與影響文件模式的其他選項（如 fsGroup）有衝突，
    且結果可以是其他模式位也被設置。

  - **downwardAPI.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#DownwardAPIVolumeFile" >}}">DownwardAPIVolumeFile</a>)

    **原子：將在合併期間被替換**

    items 是 Downward API 卷文件的列表。

<!--
- **projected** (ProjectedVolumeSource)

  projected items for all in one resources secrets, configmaps, and downward API

  <a name="ProjectedVolumeSource"></a>
  *Represents a projected volume source*

  - **projected.defaultMode** (int32)

    defaultMode are the mode bits used to set permissions on created files by default. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. Directories within the path are not affected by this setting. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
-->
- **projected** (ProjectedVolumeSource)

  這是供 Secret、ConfigMap 和 Downward API 等所有資源使用的投射項。

  <a name="ProjectedVolumeSource"></a>
  **表示一個投射的卷源。**

  - **projected.defaultMode** (int32)

    defaultMode 是默認情況下用於爲已創建的文件設置權限的模式位。
    必須是 0000 到 0777 之間的八進制值或 0 到 511 之間的十進制值。
    YAML 既接受八進制值也接受十進制值，JSON 針對模式位需要十進制值。
    路徑內的目錄不受此設置的影響。
    這可能與影響文件模式的其他選項（如 fsGroup）有衝突，且結果可以是其他模式位也被設置。

  <!--
  - **projected.sources** ([]VolumeProjection)

    *Atomic: will be replaced during a merge*
    
    sources is the list of volume projections. Each entry in this list handles one source.

    <a name="VolumeProjection"></a>
    *Projection that may be projected along with other supported volume types. Exactly one of these fields must be set.*
  -->

  - **projected.sources** ([]VolumeProjection)

    **原子：將在合併期間被替換**

    sources 是卷投射的列表。此列表中的每個條目處理一個數據源。

    <a name="VolumeProjection"></a>
    **這裏的投射項目可能與其他受支持的卷類型一起進行投射。這些字段中必須且僅能設置一個。**

    <!--
    - **projected.sources.clusterTrustBundle** (ClusterTrustBundleProjection)

      ClusterTrustBundle allows a pod to access the `.spec.trustBundle` field of ClusterTrustBundle objects in an auto-updating file.

      Alpha, gated by the ClusterTrustBundleProjection feature gate.

      ClusterTrustBundle objects can either be selected by name, or by the combination of signer name and a label selector.
    -->

    - **projected.sources.clusterTrustBundle**（ClusterTrustBundleProjection）

      clusterTrustBundle 允許 Pod 訪問一個自動更新的文件中 ClusterTrustBundle 對象的 `.spec.trustBundle` 字段。

      處於 Alpha 階段，由 ClusterTrustBundleProjection 特性門控進行控制。

      ClusterTrustBundle 對象可以通過名稱選擇，也可以通過簽名者名稱和標籤選擇算符的組合進行選擇。

      <!--
      Kubelet performs aggressive normalization of the PEM contents written into the pod filesystem.  Esoteric PEM features such as inter-block comments and block headers are stripped.  Certificates are deduplicated. The ordering of certificates within the file is arbitrary, and Kubelet may change the order over time.

      <a name="ClusterTrustBundleProjection"></a>
      *ClusterTrustBundleProjection describes how to select a set of ClusterTrustBundle objects and project their contents into the pod filesystem.*
      -->

      kubelet 對寫入 Pod 文件系統的 PEM 內容進行了嚴格的規範化。
      像跨塊註釋和塊頭這類冷門 PEM 特性被剝離。證書被去重。文件內證書的順序是任意的，kubelet 可能會隨着時間改變其順序。

      <a name="ClusterTrustBundleProjection"></a>
      **ClusterTrustBundleProjection 描述如何選擇一組 ClusterTrustBundle 對象並將其內容投射到 Pod 文件系統中。**

      <!--
      - **projected.sources.clusterTrustBundle.path** (string), required

        Relative path from the volume root to write the bundle.

      - **projected.sources.clusterTrustBundle.labelSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

        Select all ClusterTrustBundles that match this label selector.  Only has effect if signerName is set.  Mutually-exclusive with name.  If unset, interpreted as "match nothing".  If set but empty, interpreted as "match everything".
      -->

      - **projected.sources.clusterTrustBundle.path** (string)，必需

        相對於卷根的路徑，用於寫入信任包。

      - **projected.sources.clusterTrustBundle.labelSelector**（<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>）

        選擇所有匹配此標籤選擇算符的 ClusterTrustBundle。僅在 signerName 被設置時有效。
        與 name 互斥。如果不設置，則解釋爲“沒有匹配項”。如果設置但爲空，則解釋爲“匹配所有”。

      <!--
      - **projected.sources.clusterTrustBundle.name** (string)

        Select a single ClusterTrustBundle by object name.  Mutually-exclusive with signerName and labelSelector.

      - **projected.sources.clusterTrustBundle.optional** (boolean)

        If true, don't block pod startup if the referenced ClusterTrustBundle(s) aren't available.  If using name, then the named ClusterTrustBundle is allowed not to exist.  If using signerName, then the combination of signerName and labelSelector is allowed to match zero ClusterTrustBundles.

      - **projected.sources.clusterTrustBundle.signerName** (string)

        Select all ClusterTrustBundles that match this signer name. Mutually-exclusive with name.  The contents of all selected ClusterTrustBundles will be unified and deduplicated.
      -->

      - **projected.sources.clusterTrustBundle.name** (string)

        通過對象名稱選擇單個 clusterTrustBundle。與 signerName 和 labelSelector 互斥。

      - **projected.sources.clusterTrustBundle.optional** (boolean)

        如果爲 true，若引用的 ClusterTrustBundle 不可用，則不會阻止 Pod 啓動。
        如果使用 name，則允許指定的 ClusterTrustBundle 不存在。
        如果使用 signerName，則 signerName 和 labelSelector 的組合被允許以匹配零個 ClusterTrustBundle。

      - **projected.sources.clusterTrustBundle.signerName** (string)

        選擇所有與此簽名者名稱匹配的 ClusterTrustBundle。此字段與 name 互斥。
        所有選定的 ClusterTrustBundle 的內容將被統一併去重。

    <!--
    - **projected.sources.configMap** (ConfigMapProjection)

      configMap information about the configMap data to project

      <a name="ConfigMapProjection"></a>
      *Adapts a ConfigMap into a projected volume.

      The contents of the target ConfigMap's Data field will be presented in a projected volume as files using the keys in the Data field as the file names, unless the items element is populated with specific mappings of keys to paths. Note that this is identical to a configmap volume source without the default mode.*
    -->

    - **projected.sources.configMap** (ConfigMapProjection)

      與要投射的 ConfigMap 數據有關的 ConfigMap 信息。

      <a name="ConfigMapProjection"></a>
      **將 ConfigMap 適配到一個投射的卷中。
      目標 ConfigMap 的 Data 字段的內容將以文件的形式呈現在一個被投射的卷中，
      使用 data 字段中的鍵名作爲文件名，除非 items 元素中已經填充了由鍵名到路徑的特定映射。
      請注意，這等同於沒有默認模式的 ConfigMap 卷源。**

      <!--
      - **projected.sources.configMap.name** (string)

        Name of the referent. This field is effectively required, but due to backwards compatibility is allowed to be empty. Instances of this type with an empty value here are almost certainly wrong. More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names

      - **projected.sources.configMap.optional** (boolean)

        optional specify whether the ConfigMap or its keys must be defined
      -->

      - **projected.sources.configMap.name** (string)

        被引用資源的名稱。此字段實際上是必需的，但由於向後兼容性，可以允許爲空。
        此類型的實例如果將此字段的值設置爲空，幾乎可以肯定是錯誤的。更多信息：
        https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      - **projected.sources.configMap.optional** (boolean)

        optional 指定是否所引用的 ConfigMap 或其鍵必須已經被定義。

      <!--
      - **projected.sources.configMap.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

        *Atomic: will be replaced during a merge*

        items if unspecified, each key-value pair in the Data field of the referenced ConfigMap will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the ConfigMap, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.
      -->

      - **projected.sources.configMap.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

        **原子：將在合併期間被替換**

        如果未指定 items，則所引用的 ConfigMap 的 data 字段中的每個鍵值對將作爲一個文件被投射到卷中，
        這個文件的名稱是鍵名，而文件的內容是鍵的取值。
        如果指定 items，則所列出的鍵將被投射到指定的路徑中，且不會顯示未列出的鍵。
        如果指定的鍵不在 ConfigMap 中，則卷設置將出錯，除非對應的鍵被標記爲可選。
        路徑必須是相對路徑，不能包含 “..” 路徑，也不能以 “..” 開頭。

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

      與要投射的 downwardAPI 數據有關的 downwardAPI 信息。

      <a name="DownwardAPIProjection"></a>
      **表示投射到投射卷的 Downward API 信息。請注意，這等同於沒有默認模式的 downwardAPI 卷源。**

      - **projected.sources.downwardAPI.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#DownwardAPIVolumeFile" >}}">DownwardAPIVolumeFile</a>)

        **原子：將在合併期間被替換**

        items 是 DownwardAPIVolume 文件的列表。

    - **projected.sources.podCertificate** (PodCertificateProjection)

      <!--
      Projects an auto-rotating credential bundle (private key and certificate chain) that the pod can use either as a TLS client or server.
      
      Kubelet generates a private key and uses it to send a PodCertificateRequest to the named signer.  Once the signer approves the request and issues a certificate chain, Kubelet writes the key and certificate chain to the pod filesystem.  The pod does not start until certificates have been issued for each podCertificate projected volume source in its spec.
      
      Kubelet will begin trying to rotate the certificate at the time indicated by the signer using the PodCertificateRequest.Status.BeginRefreshAt timestamp.
      -->

      將一個自動輪換的憑據包（私鑰和證書鏈）投射到 Pod 中，Pod 可以將其用作 TLS 客戶端或服務器。

      kubelet 生成一個私鑰，並使用它發送 PodCertificateRequest 到指定的簽名者。一旦簽名者批准請求並頒發證書鏈，
      kubelet 將密鑰和證書鏈寫入 Pod 文件系統。在其規約中的每個 podCertificate
      投射卷源都已被頒發證書之前，Pod 不會啓動。

      kubelet 將在簽名者通過 `PodCertificateRequest.Status.BeginRefreshAt`
      時間戳所給出的時間點開始嘗試輪換證書。

      <!--
      Kubelet can write a single file, indicated by the credentialBundlePath field, or separate files, indicated by the keyPath and certificateChainPath fields.

      The credential bundle is a single file in PEM format.  The first PEM entry is the private key (in PKCS#8 format), and the remaining PEM entries are the certificate chain issued by the signer (typically, signers will return their certificate chain in leaf-to-root order).
      -->

      kubelet 可以寫入單個文件（由 `credentialBundlePath` 字段指示），
      或者由 `keyPath` 和 `certificateChainPath` 字段所給出的兩個獨立的文件。

      憑據包是單個 PEM 格式的文件。第一個 PEM 條目是私鑰（以 PKCS#8 格式），剩餘的 PEM 條目是由簽名者頒發的證書鏈
     （通常，簽名者會按照從葉到根的順序返回其證書鏈）。

      <!--
      Prefer using the credential bundle format, since your application code can read it atomically.  If you use keyPath and certificateChainPath, your application must make two separate file reads. If these coincide with a certificate rotation, it is possible that the private key and leaf certificate you read may not correspond to each other.  Your application will need to check for this condition, and re-read until they are consistent.

      The named signer controls chooses the format of the certificate it issues; consult the signer implementation's documentation to learn how to use the certificates it issues.
      -->

      建議使用憑據包格式，因爲你的應用程序代碼可以原子性地讀取它。如果你使用 `keyPath` 和 `certificateChainPath`，
      你的應用程序必須進行兩次單獨的文件讀取。如果這些恰好與證書輪換同時發生，則讀取的私鑰和葉子證書可能不對應。
      你的應用程序需要檢查這種情況，並重新讀取直到它們一致。

      指定的簽名者控制其頒發證書的格式；查閱簽名者實現的文檔以瞭解如何使用它所頒發的證書。

      <a name="PodCertificateProjection"></a>
      <!--
      *PodCertificateProjection provides a private key and X.509 certificate in the pod filesystem.*
      -->
 
      **PodCertificateProjection 在 Pod 文件系統中提供私鑰和 X.509 證書。**

      <!--
      - **projected.sources.podCertificate.keyType** (string), required

        The type of keypair Kubelet will generate for the pod.
        
        Valid values are "RSA3072", "RSA4096", "ECDSAP256", "ECDSAP384", "ECDSAP521", and "ED25519".
      -->
      - **projected.sources.podCertificate.keyType** (string)，必需

        kubelet 將爲 Pod 生成的密鑰對類型。

        有效值包括 "RSA3072"、"RSA4096"、"ECDSAP256"、"ECDSAP384"、"ECDSAP521" 和 "ED25519"。

      <!--
      - **projected.sources.podCertificate.signerName** (string), required

        Kubelet's generated CSRs will be addressed to this signer.

      - **projected.sources.podCertificate.certificateChainPath** (string)

        Write the certificate chain at this path in the projected volume.
        
        Most applications should use credentialBundlePath.  When using keyPath and certificateChainPath, your application needs to check that the key and leaf certificate are consistent, because it is possible to read the files mid-rotation.
      -->

      - **projected.sources.podCertificate.signerName** (string)，必需

        kubelet 生成的 CSR 將提交給此簽名者。

      - **projected.sources.podCertificate.certificateChainPath** (string)

        在投射卷中的此路徑下寫入證書鏈。

        大多數應用程序應使用 `credentialBundlePath`。當使用 `keyPath` 和 `certificateChainPath`
        時，你的應用程序需要檢查密鑰和葉子證書是否一致，因爲有可能在輪換過程中讀取這些文件。

      <!--
      - **projected.sources.podCertificate.credentialBundlePath** (string)

        Write the credential bundle at this path in the projected volume.

        The credential bundle is a single file that contains multiple PEM blocks. The first PEM block is a PRIVATE KEY block, containing a PKCS#8 private key.

        The remaining blocks are CERTIFICATE blocks, containing the issued certificate chain from the signer (leaf and any intermediates).

        Using credentialBundlePath lets your Pod's application code make a single atomic read that retrieves a consistent key and certificate chain.  If you project them to separate files, your application code will need to additionally check that the leaf certificate was issued to the key.
      -->

      - **projected.sources.podCertificate.credentialBundlePath** (string)

        在投射卷中的此路徑下寫入憑證包。

        憑證包是一個包含多個 PEM 塊的單一文件。第一個 PEM 塊是 PRIVATE KEY 塊，包含了 PKCS#8 私鑰。

        其餘的塊是 CERTIFICATE 塊，包含了由簽發者提供的證書鏈（葉子證書及任何中間證書）。

        使用 `credentialBundlePath` 可讓 Pod 中的應用代碼進行一次原子讀取，獲取一致的密鑰和證書鏈。
        如果你將它們投影到單獨的文件中，你的應用程序代碼還需要額外檢查葉子證書是否由該密鑰簽發。

      <!--
      - **projected.sources.podCertificate.keyPath** (string)

        Write the key at this path in the projected volume.
        
        Most applications should use credentialBundlePath.  When using keyPath and certificateChainPath, your application needs to check that the key and leaf certificate are consistent, because it is possible to read the files mid-rotation.
      -->

      - **projected.sources.podCertificate.keyPath** (string)

        在投射卷中的此路徑下寫入密鑰。

        大多數應用程序應當使用 `credentialBundlePath`。當使用 `keyPath` 和 `certificateChainPath`
        時，你的應用程序需要檢查密鑰和葉子證書是否一致，因爲有可能在文件輪換過程中讀取這些文件。

      <!--
      - **projected.sources.podCertificate.maxExpirationSeconds** (int32)

        maxExpirationSeconds is the maximum lifetime permitted for the certificate.

        Kubelet copies this value verbatim into the PodCertificateRequests it generates for this projection.

        If omitted, kube-apiserver will set it to 86400(24 hours). kube-apiserver will reject values shorter than 3600 (1 hour).  The maximum allowable value is 7862400 (91 days).

        The signer implementation is then free to issue a certificate with any lifetime *shorter* than MaxExpirationSeconds, but no shorter than 3600 seconds (1 hour).  This constraint is enforced by kube-apiserver. `kubernetes.io` signers will never issue certificates with a lifetime longer than 24 hours.
      -->

      - **projected.sources.podCertificate.maxExpirationSeconds** (int32)

        `maxExpirationSeconds` 是證書允許的最大生命週期。
        
        kubelet 將此值直接複製到爲此投射生成的 PodCertificateRequests 中。
        
        如果省略，kube-apiserver 會將其設置爲 86400（24 小時）。kube-apiserver 會拒絕短於
        3600 秒（1 小時）的值。允許的最大值是 7862400（91 天）。
        
        簽名者實現可以自由簽發任何生命週期**短於** `maxExpirationSeconds` 但不少於
        3600 秒（1 小時）的證書。
        此約束由 kube-apiserver 強制執行。`kubernetes.io` 簽名者永遠不會簽發生命週期超過

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

      與要投射的 Secret 數據有關的 Secret 信息。

      <a name="SecretProjection"></a>
      **將 Secret 適配到一個投射卷中。
      目標 Secret 的 data 字段的內容將以文件的形式呈現在一個投射卷中，使用 data 字段中的鍵名作爲文件名。
      請注意，這等同於沒有默認模式的 Secret 卷源。**

      - **projected.sources.secret.name** (string)

        被引用資源的名稱。此字段實際上是必需的，但由於向後兼容性，可以允許爲空。
        此類型的實例如果將此字段的值設置爲空，幾乎可以肯定是錯誤的。更多信息：
        https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/names/#names

      <!--
      - **projected.sources.secret.optional** (boolean)

        optional field specify whether the Secret or its key must be defined

      - **projected.sources.secret.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

        *Atomic: will be replaced during a merge*
        
        items if unspecified, each key-value pair in the Data field of the referenced Secret will be projected into the volume as a file whose name is the key and content is the value. If specified, the listed keys will be projected into the specified paths, and unlisted keys will not be present. If a key is specified which is not present in the Secret, the volume setup will error unless it is marked optional. Paths must be relative and may not contain the '..' path or start with '..'.
      -->

      - **projected.sources.secret.optional** (boolean)

        optional 字段指定是否 Secret 或其鍵必須已經定義。

      - **projected.sources.secret.items** ([]<a href="{{< ref "../config-and-storage-resources/volume#KeyToPath" >}}">KeyToPath</a>)

        **原子：將在合併期間被替換**

        如果未指定 items，則所引用的 Secret 的 data 字段中的每個鍵值對將作爲一個文件被投射到卷中，
        這個文件的名稱是鍵名，而文件的內容是鍵的取值。
        如果指定 items，則所列出的鍵將被投射到指定的路徑中，且不會顯示未列出的鍵。
        如果指定的鍵不在 Secret 中，則卷設置將出錯，除非對應的鍵被標記爲可選。
        路徑必須是相對路徑，不能包含 “..” 路徑，也不能以 “..” 開頭。

    <!--
    - **projected.sources.serviceAccountToken** (ServiceAccountTokenProjection)

      serviceAccountToken is information about the serviceAccountToken data to project

      <a name="ServiceAccountTokenProjection"></a>
      *ServiceAccountTokenProjection represents a projected service account token volume. This projection can be used to insert a service account token into the pods runtime filesystem for use against APIs (Kubernetes API Server or otherwise).*

      - **projected.sources.serviceAccountToken.path** (string), required

        path is the path relative to the mount point of the file to project the token into.
    -->

    - **projected.sources.serviceAccountToken** (ServiceAccountTokenProjection)

      serviceAccountToken 是與要投射的服務賬號令牌數據有關的信息。

      <a name="ServiceAccountTokenProjection"></a>
      **ServiceAccountTokenProjection 表示一個投射的服務賬號令牌卷。
      這種投射可用於將服務賬號令牌插入到 Pod 運行時文件系統，供訪問 API（Kubernetes API Server 或其他）使用。**

      - **projected.sources.serviceAccountToken.path** (string)，必需

        path 是相對於令牌投射目標文件的掛載點的路徑。

      <!--
      - **projected.sources.serviceAccountToken.audience** (string)

        audience is the intended audience of the token. A recipient of a token must identify itself with an identifier specified in the audience of the token, and otherwise should reject the token. The audience defaults to the identifier of the apiserver.

      - **projected.sources.serviceAccountToken.expirationSeconds** (int64)

        expirationSeconds is the requested duration of validity of the service account token. As the token approaches expiration, the kubelet volume plugin will proactively rotate the service account token. The kubelet will start trying to rotate the token if the token is older than 80 percent of its time to live or if the token is older than 24 hours.Defaults to 1 hour and must be at least 10 minutes.
      -->

      - **projected.sources.serviceAccountToken.audience** (string)

        audience 是令牌的目標受衆。
        令牌的接收方必須用令牌受衆中指定的一個標識符來標識自己，否則應拒絕此令牌。
        受衆默認爲 apiserver 的標識符。

      - **projected.sources.serviceAccountToken.expirationSeconds** (int64)

        expirationSeconds 是所請求的服務賬號令牌的有效期。
        當令牌即將到期時，kubelet 卷插件將主動輪換服務賬號令牌。
        如果令牌超過其生存時間的 80% 或令牌超過 24 小時，kubelet 將開始嘗試輪換令牌。
        默認爲 1 小時且必須至少爲 10 分鐘。

<!--
### Local / Temporary Directory

- **emptyDir** (EmptyDirVolumeSource)

  emptyDir represents a temporary directory that shares a pod's lifetime. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir

  <a name="EmptyDirVolumeSource"></a>
  *Represents an empty directory for a pod. Empty directory volumes support ownership management and SELinux relabeling.*

  - **emptyDir.medium** (string)

    medium represents what type of storage medium should back this directory. The default is "" which means to use the node's default medium. Must be an empty string (default) or Memory. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir
-->
### 本地/臨時目錄 {#local-temporary-directory}

- **emptyDir** (EmptyDirVolumeSource)

  emptyDir 表示與 Pod 生命週期相同的臨時目錄。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#emptydir

  <a name="EmptyDirVolumeSource"></a>
  **表示供 Pod 使用的一個空目錄。空目錄卷支持所有權管理和 SELinux 重新打標籤。**

  - **emptyDir.medium** (string)

    medium 表示此目錄應使用哪種類別的存儲介質。默認爲 ""，這意味着使用節點的默認介質。
    必須是空字符串（默認值）或 Memory。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#emptydir

  <!--
  - **emptyDir.sizeLimit** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    sizeLimit is the total amount of local storage required for this EmptyDir volume. The size limit is also applicable for memory medium. The maximum usage on memory medium EmptyDir would be the minimum value between the SizeLimit specified here and the sum of memory limits of all containers in a pod. The default is nil which means that the limit is undefined. More info: https://kubernetes.io/docs/concepts/storage/volumes#emptydir
  -->

  - **emptyDir.sizeLimit** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

    sizeLimit 是這個 EmptyDir 卷所需的本地存儲總量。這個大小限制也適用於內存介質。
    EmptyDir 的內存介質最大使用量將是此處指定的 sizeLimit 與 Pod 中所有容器內存限制總和這兩個值之間的最小值。
    默認爲 nil，這意味着限制未被定義。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#emptydir

<!--
- **hostPath** (HostPathVolumeSource)

  hostPath represents a pre-existing file or directory on the host machine that is directly exposed to the container. This is generally used for system agents or other privileged things that are allowed to see the host machine. Most containers will NOT need this. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath

  <a name="HostPathVolumeSource"></a>
  *Represents a host path mapped into a pod. Host path volumes do not support ownership management or SELinux relabeling.*
-->
- **hostPath** (HostPathVolumeSource)

  hostPath 表示主機上預先存在的文件或目錄，它們將被直接暴露給容器。
  這種卷通常用於系統代理或允許查看主機的其他特權操作。大多數容器**不需要**這種卷。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#hostpath

  <a name="HostPathVolumeSource"></a>
  **表示映射到 Pod 中的主機路徑。主機路徑卷不支持所有權管理或 SELinux 重新打標籤。**

  <!--
  - **hostPath.path** (string), required

    path of the directory on the host. If the path is a symlink, it will follow the link to the real path. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath

  - **hostPath.type** (string)

    type for HostPath Volume Defaults to "" More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath
  -->

  - **hostPath.path** (string)，必需

    目錄在主機上的路徑。如果該路徑是一個符號鏈接，則它將沿着鏈接指向真實路徑。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#hostpath

  - **hostPath.type** (string)

    HostPath 卷的類型。默認爲 ""。更多信息：
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
  
    可能的枚舉值：
      - `""`：用於向後兼容，如果沒有設置則留空。
      - `"BlockDevice"`：給定路徑必須存在一個塊設備。
      - `"CharDevice"`：給定路徑必須存在一個字符設備。
      - `"Directory"`：給定路徑必須存在一個目錄。
      - `"DirectoryOrCreate"`：如果在給定路徑沒有文件或目錄，將根據需要創建一個空目錄，文件模式爲 0755，
        具有與 kubelet 相同的組和所有權。
      - `"File"`：給定路徑必須存在一個文件。
      - `"FileOrCreate"`：如果在給定路徑不存在文件或目錄，將根據需要創建一個空文件，文件模式爲 0644，
        具有與 kubelet 相同的組和所有權。
      - `"Socket"`：給定路徑必須存在一個 UNIX 套接字。
  
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

  awsElasticBlockStore 表示掛接到 kubelet 的主機隨後暴露給 Pod 的一個 AWS Disk 資源。
  已棄用：AWSElasticBlockStore 已被棄用。所有針對樹內 awsElasticBlockStore 類型的操作都被重定向到
  ebs.csi.aws.com CSI 驅動。
  更多信息：https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#awselasticblockstore

  <a name="AWSElasticBlockStoreVolumeSource"></a>
  **表示 AWS 上的 Persistent Disk 資源。掛載到一個容器之前 AWS EBS 磁盤必須存在。
  該磁盤還必須與 kubelet 位於相同的 AWS 區域中。AWS EBS 磁盤只能以讀/寫一次進行掛載。
  AWS EBS 卷支持所有權管理和 SELinux 重新打標籤。**

  <!--
  - **awsElasticBlockStore.volumeID** (string), required

    volumeID is unique ID of the persistent disk resource in AWS (Amazon EBS volume). More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore

  - **awsElasticBlockStore.fsType** (string)

    fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore
  -->

  - **awsElasticBlockStore.volumeID** (string)，必需

    volumeID 是 AWS（Amazon EBS 卷）中持久磁盤資源的唯一 ID。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#awselasticblockstore

  - **awsElasticBlockStore.fsType** (string)

    fsType 是你要掛載的卷的文件系統類型。提示：確保主機操作系統支持此文件系統類型。
    例如：“ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#awselasticblockstore

  <!--
  - **awsElasticBlockStore.partition** (int32)

    partition is the partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty).

  - **awsElasticBlockStore.readOnly** (boolean)

    readOnly value true will force the readOnly setting in VolumeMounts. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore
  -->

  - **awsElasticBlockStore.partition** (int32)

    partition 是你要掛載的卷中的分區。如果省略，則默認爲按卷名稱進行掛載。例如：對於卷 /dev/sda1，
    將分區指定爲 “1”。類似地，/dev/sda 的卷分區爲 “0”（或可以將屬性留空）。

  - **awsElasticBlockStore.readOnly** (boolean)

    readOnly 值爲 true 將使得卷掛載被強制設置爲 readOnly。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#awselasticblockstore

<!--
- **azureDisk** (AzureDiskVolumeSource)

  azureDisk represents an Azure Data Disk mount on the host and bind mount to the pod. Deprecated: AzureDisk is deprecated. All operations for the in-tree azureDisk type are redirected to the disk.csi.azure.com CSI driver.

  <a name="AzureDiskVolumeSource"></a>
  *AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.*
-->
- **azureDisk** (AzureDiskVolumeSource)

  azureDisk 表示掛載到主機上並綁定掛載到 Pod 上的 Azure 數據盤。
  已棄用：AzureDisk 已被棄用。所有針對樹內 azureDisk 類型的操作都被重定向到
  disk.csi.azure.com CSI 驅動。

  <a name="AzureDiskVolumeSource"></a>
  **azureDisk 表示掛載到主機上並綁定掛載到 Pod 上的 Azure 數據盤。**

  <!--
  - **azureDisk.diskName** (string), required

    diskName is the Name of the data disk in the blob storage

  - **azureDisk.diskURI** (string), required

    diskURI is the URI of data disk in the blob storage

  - **azureDisk.cachingMode** (string)

    cachingMode is the Host Caching mode: None, Read Only, Read Write.
  -->

  - **azureDisk.diskName** (string)，必需

    diskName 是 Blob 存儲中數據盤的名稱。

  - **azureDisk.diskURI** (string)，必需

    diskURI 是 Blob 存儲中數據盤的 URI。

  - **azureDisk.cachingMode** (string)

    cachingMode 是主機緩存（Host Caching）模式：None、Read Only、Read Write。
  
   <!--
   Possible enum values:
    - `"None"`
    - `"ReadOnly"`
    - `"ReadWrite"`
   -->
 
   可能的枚舉值：
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

    fsType 是要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。
    例如 “ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。

  - **azureDisk.kind** (string)

    kind 預期值包括：

    - Shared：每個存儲帳戶多個 Blob 磁盤；
    - Dedicated：每個存儲帳戶單個 Blob 磁盤；
    - Managed：azure 託管的數據盤（僅託管的可用性集合中）。

    默認爲 Shared。

    可能的枚舉值：
    - `"None"`
    - `"ReadOnly"`
    - `"ReadWrite"`

  - **azureDisk.readOnly** (boolean)

    readOnly 默認爲 false（讀/寫）。此處的 readOnly 將強制設置卷掛載中的 readOnly 屬性。

<!--
- **azureFile** (AzureFileVolumeSource)

  azureFile represents an Azure File Service mount on the host and bind mount to the pod. Deprecated: AzureFile is deprecated. All operations for the in-tree azureFile type are redirected to the file.csi.azure.com CSI driver.

  <a name="AzureFileVolumeSource"></a>
  *AzureFile represents an Azure File Service mount on the host and bind mount to the pod.*
-->
- **azureFile** (AzureFileVolumeSource)

  azureDisk 表示掛載到主機上並綁定掛載到 Pod 上的 Azure File Service。
  已棄用：AzureFile 已被棄用。所有針對 in-tree azureFile 類型的操作都被重定向到
  file.csi.azure.com CSI 驅動。

  <a name="AzureFileVolumeSource"></a>
  **azureFile 表示掛載到主機上並綁定掛載到 Pod 上的 Azure File Service。**

  <!--
  - **azureFile.secretName** (string), required

    secretName is the  name of secret that contains Azure Storage Account Name and Key

  - **azureFile.shareName** (string), required

    shareName is the azure share Name

  - **azureFile.readOnly** (boolean)

    readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
  -->

  - **azureFile.secretName** (string)，必需

    secretName 是包含 Azure 存儲賬號名稱和主鍵的 Secret 的名稱。

  - **azureFile.shareName** (string)，必需

    shareName 是 Azure 共享名稱。

  - **azureFile.readOnly** (boolean)

    readOnly 默認爲 false（讀/寫）。此處的 readOnly 將強制設置卷掛載中的 readOnly 屬性。

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

  cephfs 表示在主機上掛載的 Ceph FS，該文件系統掛載與 Pod 的生命週期相同。
  已棄用：CephFS 已被棄用，且不再支持 in-tree cephfs 類型。

  <a name="CephFSVolumeSource"></a>
  **表示在 Pod 的生命週期內持續的 Ceph Filesystem 掛載。cephfs 卷不支持所有權管理或 SELinux 重新打標籤。**

  - **cephfs.monitors** ([]string)，必需

    **原子：將在合併期間被替換**

    monitors 是必需的。monitors 是 Ceph 監測的集合。更多信息：
    https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  <!--
  - **cephfs.path** (string)

    path is Optional: Used as the mounted root, rather than the full Ceph tree, default is /

  - **cephfs.readOnly** (boolean)

    readOnly is Optional: Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts. More info: https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it
  -->

  - **cephfs.path** (string)

    path 是可選的。用作掛載的根，而不是掛載完整的 Ceph 樹，默認爲 “/”。

  - **cephfs.readOnly** (boolean)

    readOnly 是可選的。默認爲 false（讀/寫）。
    此處的 readOnly 將強制設置卷掛載中的 readOnly 屬性。更多信息：
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

    secretFile 是可選的。secretFile 是 User 對應的密鑰環的路徑，默認爲 /etc/ceph/user.secret。更多信息：
    https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef 是可選的。secretRef 是針對用戶的身份認證 Secret 的引用，默認爲空。更多信息：
    https://examples.k8s.io/volumes/cephfs/README.md#how-to-use-it

  - **cephfs.user** (string)

    user 是可選的。user 是 rados 用戶名，默認爲 admin。更多信息：
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

  cinder 表示 kubelet 主機上掛接和掛載的 Cinder 卷。
  **已棄用：** Cinder 已被棄用。所有針對 in-tree Cinder 類型的操作都將重定向到
  cinder.csi.openstack.org CSI 驅動。
  更多信息：
  https://examples.k8s.io/mysql-cinder-pd/README.md

  <a name="CinderVolumeSource"></a>
  **表示 Openstack 中的一個 Cinder 卷資源。掛載到一個容器之前 Cinder 卷必須已經存在。
  該卷還必須與 kubelet 位於相同的地區中。cinder 卷支持所有權管理和 SELinux 重新打標籤。**

  - **cinder.volumeID** (string)，必需

    volumeID 用於標識 Cinder 中的卷。更多信息：
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

    fsType 是要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。例如：“ext4”、“xfs”、“ntfs”。
    如果未指定，則隱式推斷爲“ext4”。更多信息：
    https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.readOnly** (boolean)

    readOnly 默認爲 false（讀/寫）。此處的 readOnly 將強制設置卷掛載中的 readOnly 屬性。
    更多信息：https://examples.k8s.io/mysql-cinder-pd/README.md

  - **cinder.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef 是可選的。指向 Secret 對象，內含的參數用於連接到 OpenStack。

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

  csi 表示由某個外部容器存儲接口（Container Storage Interface，CSI）驅動處理的臨時存儲。

  <a name="CSIVolumeSource"></a>
  **表示要掛載的卷的源位置，由外部 CSI 驅動進行管理。**

  - **csi.driver** (string)，必需

    driver 是處理此卷的 CSI 驅動的名稱。諮詢你的管理員以獲取在集羣中註冊的正確名稱。

  - **csi.fsType** (string)

    要掛載的 fsType。例如 “ext4”、“xfs”、“ntfs”。
    如果未提供，則將空值傳遞給關聯的 CSI 驅動，以便決定要應用的默認文件系統。

  <!--
  - **csi.nodePublishSecretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    nodePublishSecretRef is a reference to the secret object containing sensitive information to pass to the CSI driver to complete the CSI NodePublishVolume and NodeUnpublishVolume calls. This field is optional, and  may be empty if no secret is required. If the secret object contains more than one secret, all secret references are passed.

  - **csi.readOnly** (boolean)

    readOnly specifies a read-only configuration for the volume. Defaults to false (read/write).

  - **csi.volumeAttributes** (map[string]string)

    volumeAttributes stores driver-specific properties that are passed to the CSI driver. Consult your driver's documentation for supported values.
  -->

  - **csi.nodePublishSecretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    nodePublishSecretRef 是對包含敏感信息的 Secret 對象的引用，
    該 Secret 對象將被傳遞到 CSI 驅動以完成 CSI NodePublishVolume 和 NodeUnpublishVolume 調用。
    此字段是可選的，如果不需要 Secret，則此字段可以爲空。
    如果 Secret 對象包含多個 Secret，則所有 Secret 引用將被傳遞。

  - **csi.readOnly** (boolean)

    readOnly 指定供卷使用的只讀配置。默認爲 false（讀/寫）。

  - **csi.volumeAttributes** (map[string]string)

    volumeAttributes 存儲傳遞給 CSI 驅動且特定於驅動的屬性。查閱你的驅動文檔，瞭解支持的值。

<!--
- **ephemeral** (EphemeralVolumeSource)

  ephemeral represents a volume that is handled by a cluster storage driver. The volume's lifecycle is tied to the pod that defines it - it will be created before the pod starts, and deleted when the pod is removed.
-->
- **ephemeral** (EphemeralVolumeSource)

  ephemeral 表示由一個集羣存儲驅動處理的卷。此卷的生命週期與定義該卷的 Pod 相關聯。
  Pod 啓動前創建此卷，Pod 移除時刪除此卷。

  <!--
  Use this if: a) the volume is only needed while the pod runs, b) features of normal volumes like restoring from snapshot or capacity
     tracking are needed,
  c) the storage driver is specified through a storage class, and d) the storage driver supports dynamic volume provisioning through
     a PersistentVolumeClaim (see EphemeralVolumeSource for more
     information on the connection between this volume type
     and PersistentVolumeClaim).
  -->

  使用此字段的情形包括：
  a) 僅在 Pod 運行時才需要此卷，
  b) 需要從快照恢復或容量跟蹤等正常卷的功能特性，
  c) 通過存儲類指定存儲驅動，以及
  d) 存儲驅動支持通過 PersistentVolumeClaim 進行動態卷製備
  （有關此卷類型和 PersistentVolumeClaim 之間連接的更多信息，請參考 EphemeralVolumeSource）。

  <!--
  Use PersistentVolumeClaim or one of the vendor-specific APIs for volumes that persist for longer than the lifecycle of an individual pod.

  Use CSI for light-weight local ephemeral volumes if the CSI driver is meant to be used that way - see the documentation of the driver for more information.

  A pod can use both types of ephemeral volumes and persistent volumes at the same time.
  -->

  對於持續時間超過單個 Pod 生命週期的卷，使用 PersistentVolumeClaim 或某種特定於供應商的 API。

  如果打算以這種方式使用 CSI 驅動，則將 CSI 用於輕量級本地臨時卷。更多的相關信息，請參考驅動文檔。

  一個 Pod 可以同時使用臨時卷和持久卷這兩種類別的卷。

  <!--
  <a name="EphemeralVolumeSource"></a>
  *Represents an ephemeral volume that is handled by a normal storage driver.*

  - **ephemeral.volumeClaimTemplate** (PersistentVolumeClaimTemplate)

    Will be used to create a stand-alone PVC to provision the volume. The pod in which this EphemeralVolumeSource is embedded will be the owner of the PVC, i.e. the PVC will be deleted together with the pod.  The name of the PVC will be `\<pod name>-\<volume name>` where `\<volume name>` is the name from the `PodSpec.Volumes` array entry. Pod validation will reject the pod if the concatenated name is not valid for a PVC (for example, too long).
  -->

  <a name="EphemeralVolumeSource"></a>
  **表示由一個正常存儲驅動處理的臨時卷。**

  - **ephemeral.volumeClaimTemplate** (PersistentVolumeClaimTemplate)

    將用於創建獨立的 PVC 以製備卷。
    嵌入了 EphemeralVolumeSource 的 Pod 將是 PVC 的所有者，即 PVC 將與 Pod 一起刪除。
    PVC 的名稱將是 `<pod 名稱>-<卷名稱>`，其中 `<卷名稱>` 是來自 `PodSpec.Volumes` 數組條目的名稱。
    如果串聯的名稱對於 PVC 無效（例如太長），則 Pod 驗證將拒絕該 Pod。

    <!--
    An existing PVC with that name that is not owned by the pod will *not* be used for the pod to avoid using an unrelated volume by mistake. Starting the pod is then blocked until the unrelated PVC is removed. If such a pre-created PVC is meant to be used by the pod, the PVC has to updated with an owner reference to the pod once the pod exists. Normally this should not be necessary, but it may be useful when manually reconstructing a broken cluster.

    This field is read-only and no changes will be made by Kubernetes to the PVC after it has been created.
    -->

    如果具有此名稱的現有 PVC 不屬於此 Pod，則這一 PVC 將**不會**被用於此 Pod，以避免錯誤地使用不相關的卷。
    如果出現這種情況，Pod 的啓動操作會被阻塞直到不相關的 PVC 被移除。
    如果 Pod 準備使用這樣一個預先創建的 PVC，那麼一旦此 Pod 出現，就必須更新 PVC，
    將其屬主引用指向該 Pod。通常沒有必要這樣做，但這對手動重構損壞的集羣時可能很有用。

    此字段是隻讀的，PVC 被創建後 Kubernetes 不會對其進行任何更改。

    <!--
    Required, must not be nil.

    <a name="PersistentVolumeClaimTemplate"></a>
    *PersistentVolumeClaimTemplate is used to produce PersistentVolumeClaim objects as part of an EphemeralVolumeSource.*
    -->

    必需，不能爲 nil。

    <a name="PersistentVolumeClaimTemplate"></a>
    **PersistentVolumeClaimTemplate 用於作爲 EphemeralVolumeSource 的一部分生成 PersistentVolumeClaim 對象。**

    <!--
    - **ephemeral.volumeClaimTemplate.spec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimSpec" >}}">PersistentVolumeClaimSpec</a>), required

      The specification for the PersistentVolumeClaim. The entire content is copied unchanged into the PVC that gets created from this template. The same fields as in a PersistentVolumeClaim are also valid here.

    - **ephemeral.volumeClaimTemplate.metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

      May contain labels and annotations that will be copied into the PVC when creating it. No other fields are allowed and will be rejected during validation.
    -->

    - **ephemeral.volumeClaimTemplate.spec** (<a href="{{< ref "../config-and-storage-resources/persistent-volume-claim-v1#PersistentVolumeClaimSpec" >}}">PersistentVolumeClaimSpec</a>)，必需

      PersistentVolumeClaim 的規約。整個規約的內容將被原封不動地複製到從此模板創建的 PVC 中。
      與 PersistentVolumeClaim 相同的字段在此處也有效。

    - **ephemeral.volumeClaimTemplate.metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

      可能包含一些標籤和註解，在創建 PVC 時，這些數據會被複制到 PVC 中。
      在驗證期間，其他字段都不允許設置，即便設置也會在驗證階段被拒絕。

<!--
- **fc** (FCVolumeSource)

  fc represents a Fibre Channel resource that is attached to a kubelet's host machine and then exposed to the pod.

  <a name="FCVolumeSource"></a>
  *Represents a Fibre Channel volume. Fibre Channel volumes can only be mounted as read/write once. Fibre Channel volumes support ownership management and SELinux relabeling.*
-->
- **fc** (FCVolumeSource)

  fc 表示掛接到 kubelet 的主機隨後暴露給 Pod 的一個 Fibre Channel 資源。

  <a name="FCVolumeSource"></a>
  **表示 Fibre Channel 卷。Fibre Channel 卷只能以讀/寫一次進行掛載。
  Fibre Channel 卷支持所有權管理和 SELinux 重新打標籤。**

  <!--
  - **fc.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.

  - **fc.lun** (int32)
    lun is Optional: FC target lun number
  -->

  - **fc.fsType** (string)

    fsType 是要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。
    例如 “ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。

  - **fc.lun** (int32)

    lun 是可選的：FC 目標 lun 編號。

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

    readOnly 是可選的。默認爲 false（讀/寫）。此處的 readOnly 將強制設置卷掛載中的 readOnly 屬性。

  - **fc.targetWWNs** ([]string)

    **原子：將在合併期間被替換**

    targetWWNs 是可選的。FC 目標全球名稱（WWN）。

  - **fc.wwids** ([]string)

    **原子：將在合併期間被替換**

    wwids 是可選的。FC 卷全球識別號（wwids）。
    必須設置 wwids 或 targetWWNs 及 lun 的組合，但不能同時設置兩者。

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

  flexVolume 表示使用基於 exec 的插件製備/掛接的通用卷資源。
  已棄用：FlexVolume 已被棄用，請考慮使用 CSIDriver 代替。

  <a name="FlexVolumeSource"></a>
  **flexVolume 表示使用基於 exec 的插件製備/掛接的通用卷資源。**

  - **flexVolume.driver** (string)，必需

    driver 是供此卷使用的驅動的名稱。

  - **flexVolume.fsType** (string)

    fsType 是要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。
    例如 “ext4”、“xfs”、“ntfs”。
    默認的文件系統取決於 flexVolume 腳本。

  <!--
  - **flexVolume.options** (map[string]string)

    options is Optional: this field holds extra command options if any.

  - **flexVolume.readOnly** (boolean)

    readOnly is Optional: defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.

  - **flexVolume.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef is Optional: secretRef is reference to the secret object containing sensitive information to pass to the plugin scripts. This may be empty if no secret object is specified. If the secret object contains more than one secret, all secrets are passed to the plugin scripts.
  -->

  - **flexVolume.options** (map[string]string)

    options 是可選的。此字段包含額外的命令選項（如果有）。

  - **flexVolume.readOnly** (boolean)

    readOnly 是可選的。默認爲 false（讀/寫）。此處的 readOnly 將強制設置卷掛載中的 readOnly 屬性。

  - **flexVolume.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef 是可選的。secretRef 是對包含敏感信息的 Secret 對象的引用，該 Secret 會被傳遞到插件腳本。
    如果未指定 Secret 對象，則此字段可以爲空。如果 Secret 對象包含多個 Secret，則所有 Secret 被傳遞到插件腳本。

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

  flocker 表示掛接到一個 kubelet 主機的 Flocker 卷。Flocker
  卷依賴於正在運行的 Flocker 控制服務。
  已棄用：Flocker 已被棄用，且樹內 Flocker 類型不再受支持。

  <a name="FlockerVolumeSource"></a>
  **表示 Flocker 代理掛載的 Flocker 卷。應設置一個且僅設置 datasetName 和 datasetUUID 中的一個。
  Flocker 卷不支持所有權管理或 SELinux 重新打標籤。**

  - **flocker.datasetName** (string)

    datasetName 是存儲爲元數據的數據集的名稱。Flocker 數據集的名稱應視爲已棄用。

  - **flocker.datasetUUID** (string)

    datasetUUID 是數據集的 UUID。這是 Flocker 數據集的唯一標識符。

<!--
- **gcePersistentDisk** (GCEPersistentDiskVolumeSource)

  gcePersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Deprecated: GCEPersistentDisk is deprecated. All operations for the in-tree gcePersistentDisk type are redirected to the pd.csi.storage.gke.io CSI driver. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

  <a name="GCEPersistentDiskVolumeSource"></a>
  *Represents a Persistent Disk resource in Google Compute Engine.

  A GCE PD must exist before mounting to a container. The disk must also be in the same GCE project and zone as the kubelet. A GCE PD can only be mounted as read/write once or read-only many times. GCE PDs support ownership management and SELinux relabeling.*
-->
- **gcePersistentDisk** (GCEPersistentDiskVolumeSource)

  gcePersistentDisk 表示掛接到 kubelet 的主機隨後暴露給 Pod 的一個 GCE Disk 資源。
  已棄用：GCEPersistentDisk 已被棄用。所有針對樹內 gcePersistentDisk
  類型的操作都將重定向至 pd.csi.storage.gke.io CSI 驅動。
  更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#gcepersistentdisk

  <a name="GCEPersistentDiskVolumeSource"></a>
  **表示 Google Compute Engine 中的 Persistent Disk 資源。
  掛載到一個容器之前 GCE PD 必須已經存在。該磁盤還必須與 kubelet 位於相同的 GCE 項目和區域中。
  GCE PD 只能掛載爲讀/寫一次或只讀多次。GCE PD 支持所有權管理和 SELinux 重新打標籤。**

  <!--
  - **gcePersistentDisk.pdName** (string), required

    pdName is unique name of the PD resource in GCE. Used to identify the disk in GCE. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.fsType** (string)

    fsType is filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk
  -->

  - **gcePersistentDisk.pdName** (string)，必需

    pdName 是 GCE 中 PD 資源的唯一名稱。用於標識 GCE 中的磁盤。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.fsType** (string)

    fsType 是你要掛載的卷的文件系統類型。提示：確保主機操作系統支持此文件系統類型。
    例如：“ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲“ext4”。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#gcepersistentdisk

  <!--
  - **gcePersistentDisk.partition** (int32)

    partition is the partition in the volume that you want to mount. If omitted, the default is to mount by volume name. Examples: For volume /dev/sda1, you specify the partition as "1". Similarly, the volume partition for /dev/sda is "0" (or you can leave the property empty). More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.readOnly** (boolean)

    readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk
  -->

  - **gcePersistentDisk.partition** (int32)

    partition 是你要掛載的卷中的分區。如果省略，則默認爲按卷名稱進行掛載。
    例如：對於卷 /dev/sda1，將分區指定爲 “1”。類似地，/dev/sda 的卷分區爲 “0”（或可以將屬性留空）。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#gcepersistentdisk

  - **gcePersistentDisk.readOnly** (boolean)

    此處的 readOnly 將強制設置卷掛載中的 readOnly 屬性。默認爲 false。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#gcepersistentdisk

<!--
- **glusterfs** (GlusterfsVolumeSource)

  glusterfs represents a Glusterfs mount on the host that shares a pod's lifetime. Deprecated: Glusterfs is deprecated and the in-tree glusterfs type is no longer supported.

  <a name="GlusterfsVolumeSource"></a>
  *Represents a Glusterfs mount that lasts the lifetime of a pod. Glusterfs volumes do not support ownership management or SELinux relabeling.*
-->

- **glusterfs** （GlusterfsVolumeSource）

  glusterfs 表示關聯到主機並暴露給 Pod 的 Glusterfs 卷。由管理員配置。
  已棄用：glusterfs 已被棄用，且樹內 glusterfs 類型不再受支持。

  <a name="GlusterfsVolumeSource"></a>
  **表示在 Pod 生命週期內一直存在的 Glusterfs 掛載卷。Glusterfs 卷不支持屬主管理或 SELinux 重標記。**
  
  <!--
  - **glusterfs.endpoints** (string), required

    endpoints is the endpoint name that details Glusterfs topology.

  - **glusterfs.path** (string), required

    path is the Glusterfs volume path. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.readOnly** (boolean)

    readOnly here will force the Glusterfs volume to be mounted with read-only permissions. Defaults to false. More info: https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod
  -->

  - **glusterfs.endpoints** (string)，必需

    endpoints 是詳細給出 Glusterfs 拓撲結構的端點的名稱。

  - **glusterfs.path** (string)，必需

    path 是 Glusterfs 卷的路徑。更多信息：
    https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

  - **glusterfs.readOnly** (boolean)

    此處的 readOnly 將強制以只讀權限掛載 Glusterfs 卷。
    默認爲 false。更多信息：
    https://examples.k8s.io/volumes/glusterfs/README.md#create-a-pod

<!--
- **iscsi** (ISCSIVolumeSource)

  iscsi represents an ISCSI Disk resource that is attached to a kubelet's host machine and then exposed to the pod.

  <a name="ISCSIVolumeSource"></a>
  *Represents an ISCSI disk. ISCSI volumes can only be mounted as read/write once. ISCSI volumes support ownership management and SELinux relabeling.*
-->
- **iscsi** (ISCSIVolumeSource)

  iscsi 表示掛接到 kubelet 的主機隨後暴露給 Pod 的一個 ISCSI Disk 資源。

  <a name="ISCSIVolumeSource"></a>
  **表示一個 ISCSI 磁盤。ISCSI 卷只能以讀/寫一次進行掛載。ISCSI 卷支持所有權管理和 SELinux 重新打標籤。**

  <!--
  - **iscsi.iqn** (string), required

    iqn is the target iSCSI Qualified Name.

  - **iscsi.lun** (int32), required

    lun represents iSCSI Target Lun number.

  - **iscsi.targetPortal** (string), required

    targetPortal is iSCSI Target Portal. The Portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).
  -->

  - **iscsi.iqn** (string)，必需

    iqn 是目標 iSCSI 限定名稱。

  - **iscsi.lun** (int32)，必需

    lun 表示 iSCSI 目標邏輯單元號。

  - **iscsi.targetPortal** (string)，必需

    targetPortal 是 iSCSI 目標門戶。
    如果不是默認端口（通常是 TCP 端口 860 和 3260），則 Portal 爲 IP 或 ip_addr:port。

  <!--
  - **iscsi.chapAuthDiscovery** (boolean)

    chapAuthDiscovery defines whether support iSCSI Discovery CHAP authentication

  - **iscsi.chapAuthSession** (boolean)

    chapAuthSession defines whether support iSCSI Session CHAP authentication
  -->

  - **iscsi.chapAuthDiscovery** (boolean)

    chapAuthDiscovery 定義是否支持 iSCSI Discovery CHAP 身份認證。

  - **iscsi.chapAuthSession** (boolean)

    chapAuthSession 定義是否支持 iSCSI Session CHAP 身份認證。

  <!--
  - **iscsi.fsType** (string)

    fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#iscsi

  - **iscsi.initiatorName** (string)

    initiatorName is the custom iSCSI Initiator Name. If initiatorName is specified with iscsiInterface simultaneously, new iSCSI interface \<target portal>:\<volume name> will be created for the connection.
  -->

  - **iscsi.fsType** (string)

    fsType 是你要掛載的卷的文件系統類型。提示：確保主機操作系統支持此文件系統類型。
    例如：“ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#iscsi

  - **iscsi.initiatorName** (string)

    initiatorName 是自定義的 iSCSI 發起程序名稱（iSCSI Initiator Name）。
    如果同時用 iscsiInterface 指定 initiatorName，將爲連接創建新的 iSCSI 接口 \<目標門戶>:\<卷名稱>。

  <!--
  - **iscsi.iscsiInterface** (string)

    iscsiInterface is the interface Name that uses an iSCSI transport. Defaults to 'default' (tcp).

  - **iscsi.portals** ([]string)

    *Atomic: will be replaced during a merge*
    
    portals is the iSCSI Target Portal List. The portal is either an IP or ip_addr:port if the port is other than default (typically TCP ports 860 and 3260).
  -->

  - **iscsi.iscsiInterface** (string)

    iscsiInterface 是使用 iSCSI 傳輸的接口名稱。默認爲 “default”（tcp）。

  - **iscsi.portals** ([]string)

    **原子：將在合併期間被替換**

    portals 是 iSCSI 目標門戶列表（iSCSI Target Portal List）。
    如果不是默認端口（通常是 TCP 端口 860 和 3260），則 Portal 爲 IP 或 ip_addr:port。

  <!--
  - **iscsi.readOnly** (boolean)

    readOnly here will force the ReadOnly setting in VolumeMounts. Defaults to false.

  - **iscsi.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef is the CHAP Secret for iSCSI target and initiator authentication
  -->

  - **iscsi.readOnly** (boolean)

    此處的 readOnly 將強制設置卷掛載中的 readOnly 屬性。默認爲 false。

  - **iscsi.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef 是 iSCSI 目標和發起程序身份認證所用的 CHAP Secret。

<!--
- **image** (ImageVolumeSource)

  image represents an OCI object (a container image or artifact) pulled and mounted on the kubelet's host machine. The volume is resolved at pod startup depending on which PullPolicy value is provided:
-->
- **image** (ImageVolumeSource)

  image 表示一個在 kubelet 的主機上拉取並掛載的 OCI 對象（容器鏡像或工件）。
  其卷在 Pod 啓動時根據提供的 PullPolicy 值進行解析：

  <!--
  - Always: the kubelet always attempts to pull the reference. Container creation will fail If the pull fails. - Never: the kubelet never pulls the reference and only uses a local image or artifact. Container creation will fail if the reference isn't present. - IfNotPresent: the kubelet pulls if the reference isn't already present on disk. Container creation will fail if the reference isn't present and the pull fails.
  -->

  - Always：kubelet 始終嘗試拉取此引用。如果拉取失敗，容器創建將失敗。
  - Never：kubelet 從不拉取此引用，只使用本地鏡像或工件。如果引用不存在，容器創建將失敗。
  - IfNotPresent：如果磁盤上尚不存在此引用，kubelet 執行拉取操作。若此引用不存在且拉取失敗，則容器創建將失敗。

  <!--
  The volume gets re-resolved if the pod gets deleted and recreated, which means that new remote content will become available on pod recreation. A failure to resolve or pull the image during pod startup will block containers from starting and may add significant latency. Failures will be retried using normal volume backoff and will be reported on the pod reason and message. The types of objects that may be mounted by this volume are defined by the container runtime implementation on a host machine and at minimum must include all valid types supported by the container image field. The OCI object gets mounted in a single directory (spec.containers[*].volumeMounts.mountPath) by merging the manifest layers in the same way as for container images. The volume will be mounted read-only (ro) and non-executable files (noexec). Sub path mounts for containers are not supported (spec.containers[*].volumeMounts.subpath) before 1.33. The field spec.securityContext.fsGroupChangePolicy has no effect on this volume type.
  -->

  如果 Pod 被刪除並重新創建，此卷會被重新解析，這意味着在 Pod 重新創建時將可以訪問新的遠程內容。
  在 Pod 啓動期間解析或拉取鏡像失敗將導致容器無法啓動，並可能顯著增加延遲。
  如果失敗，將使用正常的捲回退機制進行重試，並輸出 Pod 失敗的原因和相關消息。
  此卷可以掛載的對象類型由主機上的容器運行時實現負責定義，至少必須包含容器鏡像字段所支持的所有有效類型。
  OCI 對象將以只讀方式被掛載到單個目錄（`spec.containers[*].volumeMounts.mountPath`）中。
  在 Linux 上，容器運行時通常還會掛載阻止文件執行（`noexec`）的卷。
  1.33 版本之前不支持容器使用子路徑掛載（`spec.containers[*].volumeMounts.subpath`）。
  `spec.securityContext.fsGroupChangePolicy` 字段對這種卷沒有效果。

  <!--
  <a name="ImageVolumeSource"></a>
  *ImageVolumeSource represents a image volume resource.*

  - **image.pullPolicy** (string)

    Policy for pulling OCI objects. Possible values are: Always: the kubelet always attempts to pull the reference. Container creation will fail If the pull fails. Never: the kubelet never pulls the reference and only uses a local image or artifact. Container creation will fail if the reference isn't present. IfNotPresent: the kubelet pulls if the reference isn't already present on disk. Container creation will fail if the reference isn't present and the pull fails. Defaults to Always if :latest tag is specified, or IfNotPresent otherwise.
  -->

  <a name="ImageVolumeSource"></a>
  **ImageVolumeSource 表示一個鏡像卷資源。**

  - **image.pullPolicy**（字符串）

    OCI 對象的拉取策略。可能的值有：

    - Always：kubelet 始終嘗試拉取此引用。如果拉取失敗，容器創建將失敗。
    - Never：kubelet 從不拉取此引用，只使用本地鏡像或工件。如果引用不存在，容器創建將失敗。
    - IfNotPresent：如果磁盤上尚不存在此引用，kubelet 執行拉取操作。
      如果引用不存在且拉取失敗，容器創建將失敗。
      如果指定了 `:latest` 標籤，則默認爲 Always，否則默認爲 IfNotPresent。

    <!--
    Possible enum values:
     - `"Always"` means that kubelet always attempts to pull the latest image. Container will fail If the pull fails.
     - `"IfNotPresent"` means that kubelet pulls if the image isn't present on disk. Container will fail if the image isn't present and the pull fails.
     - `"Never"` means that kubelet never pulls an image, but only uses a local image. Container will fail if the image isn't present
    -->
  
    可能的枚舉值：
    - `"Always"` 表示 kubelet 總是嘗試拉取最新的鏡像。如果拉取失敗，容器將失敗。
    - `"IfNotPresent"` 表示如果磁盤上沒有所指定的鏡像，則 kubelet 會拉取。如果鏡像不存在且拉取失敗，容器將失敗。
    - `"Never"` 表示 kubelet 從不拉取鏡像，僅使用本地鏡像。如果鏡像不存在，容器將失敗。
  
  - **image.reference** (string)

    <!--
    Required: Image or artifact reference to be used. Behaves in the same way as pod.spec.containers[*].image. Pull secrets will be assembled in the same way as for the container image by looking up node credentials, SA image pull secrets, and pod spec image pull secrets. More info: https://kubernetes.io/docs/concepts/containers/images This field is optional to allow higher level config management to default or override container images in workload controllers like Deployments and StatefulSets.
    -->
  
    必需：要使用的鏡像或工件引用。行爲與 pod.spec.containers[*].image 相同。
    拉取 Secret 的組裝方式與容器鏡像所用的方式相同，
    都是通過查找節點憑據、服務賬戶（SA）鏡像拉取 Secret 和 Pod 規約鏡像拉取 Secret。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/containers/images
    此字段是可選的，以允許更高層次的配置管理在 Deployment 和 StatefulSet 這類工作負載控制器中默認或覆蓋容器鏡像。

<!--
- **nfs** (NFSVolumeSource)

  nfs represents an NFS mount on the host that shares a pod's lifetime More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs

  <a name="NFSVolumeSource"></a>
  *Represents an NFS mount that lasts the lifetime of a pod. NFS volumes do not support ownership management or SELinux relabeling.*

  - **nfs.path** (string), required

    path that is exported by the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs
-->
- **nfs** (NFSVolumeSource)

  nfs 表示在主機上掛載的 NFS，其生命週期與 Pod 相同。更多信息：
  https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#nfs

  <a name="NFSVolumeSource"></a>
  **表示 Pod 的生命週期內一直存在的 NFS 掛載。NFS 卷不支持所有權管理或 SELinux 重新打標籤。**

  - **nfs.path** (string)，必需

    path 是由 NFS 服務器導出的路徑。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#nfs

  <!--
  - **nfs.server** (string), required

    server is the hostname or IP address of the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs

  - **nfs.readOnly** (boolean)

    readOnly here will force the NFS export to be mounted with read-only permissions. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs
  -->

  - **nfs.server** (string)，必需

    server 是 NFS 服務器的主機名或 IP 地址。更多信息：
    https://kubernetes.io/zh-cn/docs/concepts/storage/volumes#nfs

  - **nfs.readOnly** (boolean)

    此處 readOnly 將強制使用只讀權限掛載 NFS 導出。默認爲 false。更多信息：
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

  photonPersistentDisk 表示 kubelet 主機上掛接和掛載的 PhotonController 持久磁盤。
  已棄用：PhotonPersistentDisk 已被棄用，且樹內 photonPersistentDisk 類型不再受支持。

  <a name="PhotonPersistentDiskVolumeSource"></a>
  **表示 Photon Controller 持久磁盤資源。**

  - **photonPersistentDisk.pdID** (string)，必需

    pdID 是標識 Photon Controller 持久磁盤的 ID。

  - **photonPersistentDisk.fsType** (string)

    fsType 是要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。
    例如 “ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。

<!--
- **portworxVolume** (PortworxVolumeSource)

  portworxVolume represents a portworx volume attached and mounted on kubelets host machine. Deprecated: PortworxVolume is deprecated. All operations for the in-tree portworxVolume type are redirected to the pxd.portworx.com CSI driver when the CSIMigrationPortworx feature-gate is on.

  <a name="PortworxVolumeSource"></a>
  *PortworxVolumeSource represents a Portworx volume resource.*

  - **portworxVolume.volumeID** (string), required

    volumeID uniquely identifies a Portworx volume
-->
- **portworxVolume** (PortworxVolumeSource)

  portworxVolume 表示 kubelet 主機上掛接和掛載的 portworx 卷。
  已棄用：PortworxVolume 已被棄用。當 CSIMigrationPortworx 特性開關開啓時，
  所有樹內 PortworxVolume 類型的操作都將重定向到 pxd.portworx.com CSI 驅動。

  <a name="PortworxVolumeSource"></a>
  **PortworxVolumeSource 表示 Portworx 卷資源。**

  - **portworxVolume.volumeID** (string)，必需

    volumeID 唯一標識 Portworx 卷。

  <!--
  - **portworxVolume.fsType** (string)

    fSType represents the filesystem type to mount Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs". Implicitly inferred to be "ext4" if unspecified.

  - **portworxVolume.readOnly** (boolean)

    readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.
  -->

  - **portworxVolume.fsType** (string)

    fSType 表示要掛載的文件系統類型。必須是主機操作系統支持的文件系統類型。例如 “ext4”、“xfs”。
    如果未指定，則隱式推斷爲 “ext4”。

  - **portworxVolume.readOnly** (boolean)

    readOnly 默認爲 false（讀/寫）。此處的 readOnly 將強制設置卷掛載中的 readOnly 屬性。

<!--
- **quobyte** (QuobyteVolumeSource)

  quobyte represents a Quobyte mount on the host that shares a pod's lifetime. Deprecated: Quobyte is deprecated and the in-tree quobyte type is no longer supported.

  <a name="QuobyteVolumeSource"></a>
  *Represents a Quobyte mount that lasts the lifetime of a pod. Quobyte volumes do not support ownership management or SELinux relabeling.*
-->
- **quobyte** (QuobyteVolumeSource)

  quobyte 表示在共享 Pod 生命週期的主機上掛載的 Quobyte。
  已棄用：quobyte 已被棄用，且樹內 quobyte 類型不再受支持。

  <a name="QuobyteVolumeSource"></a>
  **表示在 Pod 的生命週期內持續的 Quobyte 掛載。Quobyte 卷不支持所有權管理或 SELinux 重新打標籤。**

  <!--
  - **quobyte.registry** (string), required

    registry represents a single or multiple Quobyte Registry services specified as a string as host:port pair (multiple entries are separated with commas) which acts as the central registry for volumes

  - **quobyte.volume** (string), required

    volume is a string that references an already created Quobyte volume by name.

  - **quobyte.group** (string)

    group to map volume access to Default is no group
  -->

  - **quobyte.registry** (string)，必需

    registry 表示將一個或多個 Quobyte Registry 服務指定爲 host:port 對的字符串形式
    （多個條目用英文逗號分隔），用作卷的中央註冊表。

  - **quobyte.volume** (string)，必需

    volume 是按名稱引用已創建的 Quobyte 卷的字符串。

  - **quobyte.group** (string)

    group 是將卷訪問映射到的組。默認爲無組。

  <!--
  - **quobyte.readOnly** (boolean)

    readOnly here will force the Quobyte volume to be mounted with read-only permissions. Defaults to false.

  - **quobyte.tenant** (string)

    tenant owning the given Quobyte volume in the Backend Used with dynamically provisioned Quobyte volumes, value is set by the plugin

  - **quobyte.user** (string)

    user to map volume access to Defaults to serivceaccount user
  -->

  - **quobyte.readOnly** (boolean)

    此處 readOnly 將強制使用只讀權限掛載 Quobyte 卷。默認爲 false。

  - **quobyte.tenant** (string)

    tenant 擁有 Backend Used 中給定的 Quobyte 卷，隨動態製備的 Quobyte 卷一起使用，值由插件設置。

  - **quobyte.user** (string)

    user 是將卷訪問映射到的用戶。默認爲 serivceaccount 用戶。

<!--
- **rbd** (RBDVolumeSource)

  rbd represents a Rados Block Device mount on the host that shares a pod's lifetime. Deprecated: RBD is deprecated and the in-tree rbd type is no longer supported.

  <a name="RBDVolumeSource"></a>
  *Represents a Rados Block Device mount that lasts the lifetime of a pod. RBD volumes support ownership management and SELinux relabeling.*

  - **rbd.image** (string), required

    image is the rados image name. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
-->

- **rbd** (RBDVolumeSource)

  rbd 表示在共享 Pod 生命週期的主機上掛載的 Rados Block Device。
  已棄用：RBD 已被棄用，且樹內 rbd 類型不再受支持。

  <a name="RBDVolumeSource"></a>
  **表示在 Pod 的生命週期內持續的 Rados Block Device 掛載。RBD 卷支持所有權管理和 SELinux 重新打標籤。**

  - **rbd.image** (string)，必需

    image 是 rados 鏡像名稱。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  <!--
  - **rbd.monitors** ([]string), required

    *Atomic: will be replaced during a merge*
    
    monitors is a collection of Ceph monitors. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.fsType** (string)

    fsType is the filesystem type of the volume that you want to mount. Tip: Ensure that the filesystem type is supported by the host operating system. Examples: "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified. More info: https://kubernetes.io/docs/concepts/storage/volumes#rbd
  -->

  - **rbd.monitors** ([]string)，必需

    **原子：將在合併期間被替換**

    monitors 是 Ceph 監測的集合。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.fsType** (string)

    fsType 是你要掛載的卷的文件系統類型。提示：確保主機操作系統支持此文件系統類型。
    例如：“ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。更多信息：
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

    keyring 是 RBDUser 密鑰環的路徑。默認爲 /etc/ceph/keyring。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.pool** (string)

    pool 是 rados 池名稱。默認爲 rbd。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.readOnly** (boolean)

    此處的 readOnly 將強制設置卷掛載中的 readOnly 屬性。默認爲 false。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  <!--
  - **rbd.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef is name of the authentication secret for RBDUser. If provided overrides keyring. Default is nil. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.user** (string)

    user is the rados user name. Default is admin. More info: https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it
  -->

  - **rbd.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef 是 RBDUser 的身份認證 Secret 的名稱。如果提供，則重載 keyring。默認爲 nil。更多信息：
    https://examples.k8s.io/volumes/rbd/README.md#how-to-use-it

  - **rbd.user** (string)

    user 是 rados 用戶名。默認爲 admin。更多信息：
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

  scaleIO 表示 Kubernetes 節點上掛接和掛載的 ScaleIO 持久卷。
  已棄用：scaleIO 已被棄用，且樹內 scaleIO 類型不再受支持。

  <a name="ScaleIOVolumeSource"></a>
  **ScaleIOVolumeSource 表示一個 ScaleIO 持久卷。**

  - **scaleIO.gateway** (string)，必需

    gateway 是 ScaleIO API 網關的主機地址。

  <!--
  - **scaleIO.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>), required

    secretRef references to the secret for ScaleIO user and other sensitive information. If this is not provided, Login operation will fail.

  - **scaleIO.system** (string), required

    system is the name of the storage system as configured in ScaleIO.

  - **scaleIO.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Default is "xfs".
  -->

  - **scaleIO.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)，必需

    secretRef 引用到 ScaleIO 用戶的 Secret 和其他敏感信息。如果未提供此項，則 Login 操作將失敗。

  - **scaleIO.system** (string)，必需

    system 是存儲系統的名稱，與 ScaleIO 中的配置相同。

  - **scaleIO.fsType** (string)

    fsType 是要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。
    例如 “ext4”、“xfs”、“ntfs”。默認爲 “xfs”。

  <!--
  - **scaleIO.protectionDomain** (string)

    protectionDomain is the name of the ScaleIO Protection Domain for the configured storage.

  - **scaleIO.readOnly** (boolean)

    readOnly Defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.

  - **scaleIO.sslEnabled** (boolean)

    sslEnabled Flag enable/disable SSL communication with Gateway, default false
  -->

  - **scaleIO.protectionDomain** (string)

    protectionDomain 是 ScaleIO 保護域（ScaleIO Protection Domain）的名稱，用於已配置的存儲。

  - **scaleIO.readOnly** (boolean)

    readOnly 默認爲 false（讀/寫）。此處的 readOnly 將強制設置卷掛載中的 readOnly 屬性。

  - **scaleIO.sslEnabled** (boolean)

    sslEnabled 標誌啓用/禁用與網關的 SSL 通信，默認爲 false。

  <!--
  - **scaleIO.storageMode** (string)

    storageMode indicates whether the storage for a volume should be ThickProvisioned or ThinProvisioned. Default is ThinProvisioned.

  - **scaleIO.storagePool** (string)

    storagePool is the ScaleIO Storage Pool associated with the protection domain.

  - **scaleIO.volumeName** (string)

    volumeName is the name of a volume already created in the ScaleIO system that is associated with this volume source.
  -->

  - **scaleIO.storageMode** (string)

    storageMode 指示卷所用的存儲應是 ThickProvisioned 或 ThinProvisioned。默認爲 ThinProvisioned。

  - **scaleIO.storagePool** (string)

    storagePool 是與保護域關聯的 ScaleIO Storage Pool。

  - **scaleIO.volumeName** (string)

    volumeName 是在與此卷源關聯的 ScaleIO 系統中已創建的卷的名稱。

<!--
- **storageos** (StorageOSVolumeSource)

  storageOS represents a StorageOS volume attached and mounted on Kubernetes nodes. Deprecated: StorageOS is deprecated and the in-tree storageos type is no longer supported.

  <a name="StorageOSVolumeSource"></a>
  *Represents a StorageOS persistent volume resource.*

  - **storageos.fsType** (string)

    fsType is the filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.
-->
- **storageos** (StorageOSVolumeSource)

  storageOS 表示 Kubernetes 節點上掛接和掛載的 StorageOS 卷。
  已棄用：storageOS 已被棄用，且樹內 storageOS 類型不再受支持。

  <a name="StorageOSVolumeSource"></a>
  **表示 StorageOS 持久卷資源。**

  - **storageos.fsType** (string)

    fsType 是要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。
    例如 “ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。

  <!--
  - **storageos.readOnly** (boolean)

    readOnly defaults to false (read/write). ReadOnly here will force the ReadOnly setting in VolumeMounts.

  - **storageos.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef specifies the secret to use for obtaining the StorageOS API credentials.  If not specified, default values will be attempted.
  -->

  - **storageos.readOnly** (boolean)

    readOnly 默認爲 false（讀/寫）。此處的 readOnly 將強制設置卷掛載中的 readOnly 屬性。

  - **storageos.secretRef** (<a href="{{< ref "../common-definitions/local-object-reference#LocalObjectReference" >}}">LocalObjectReference</a>)

    secretRef 指定用於獲取 StorageOS API 憑據的 Secret。如果未指定，則將嘗試使用默認值。

  <!--
  - **storageos.volumeName** (string)

    volumeName is the human-readable name of the StorageOS volume.  Volume names are only unique within a namespace.

  - **storageos.volumeNamespace** (string)

    volumeNamespace specifies the scope of the volume within StorageOS.  If no namespace is specified then the Pod's namespace will be used.  This allows the Kubernetes name scoping to be mirrored within StorageOS for tighter integration. Set VolumeName to any name to override the default behaviour. Set to "default" if you are not using namespaces within StorageOS. Namespaces that do not pre-exist within StorageOS will be created.
  -->

  - **storageos.volumeName** (string)

    volumeName 是 StorageOS 卷的人類可讀名稱。這些卷名稱在一個名字空間內是唯一的。

  - **storageos.volumeNamespace** (string)

    volumeNamespace 指定 StorageOS 內卷的作用域。如果未指定名字空間，則將使用 Pod 的名字空間。
    這個設置使得 Kubernetes 的名字作用域可以在 StorageOS 內進行映射，實現更緊密的集成。
    將 volumeName 設爲任何名稱以重載默認的行爲。如果你未在 StorageOS 內使用名字空間，則設爲 “default”。
    將創建 StorageOS 內預先不存在的名字空間。

<!--
- **vsphereVolume** (VsphereVirtualDiskVolumeSource)

  vsphereVolume represents a vSphere volume attached and mounted on kubelets host machine. Deprecated: VsphereVolume is deprecated. All operations for the in-tree vsphereVolume type are redirected to the csi.vsphere.vmware.com CSI driver.

  <a name="VsphereVirtualDiskVolumeSource"></a>
  *Represents a vSphere volume resource.*

  - **vsphereVolume.volumePath** (string), required

    volumePath is the path that identifies vSphere volume vmdk
-->
- **vsphereVolume** (VsphereVirtualDiskVolumeSource)

  vsphereVolume 表示 kubelet 主機上掛接和掛載的 vSphere 卷。
  已棄用：VsphereVolume 已被棄用。所有針對樹內 vsphereVolume
  類型的操作都將重定向至 csi.vsphere.vmware.com CSI 驅動。

  <a name="VsphereVirtualDiskVolumeSource"></a>
  **表示 vSphere 卷資源。**

  - **vsphereVolume.volumePath** (string)，必需

    volumePath 是標識 vSphere 卷 vmdk 的路徑。

  <!--
  - **vsphereVolume.fsType** (string)

    fsType is filesystem type to mount. Must be a filesystem type supported by the host operating system. Ex. "ext4", "xfs", "ntfs". Implicitly inferred to be "ext4" if unspecified.

  - **vsphereVolume.storagePolicyID** (string)

    storagePolicyID is the storage Policy Based Management (SPBM) profile ID associated with the StoragePolicyName.

  - **vsphereVolume.storagePolicyName** (string)

    storagePolicyName is the storage Policy Based Management (SPBM) profile name.
  -->

  - **vsphereVolume.fsType** (string)

    fsType 是要掛載的文件系統類型。必須是主機操作系統所支持的文件系統類型之一。
    例如 “ext4”、“xfs”、“ntfs”。如果未指定，則隱式推斷爲 “ext4”。

  - **vsphereVolume.storagePolicyID** (string)

    storagePolicyID 是與 StoragePolicyName 關聯的基於存儲策略的管理（SPBM）配置文件 ID。

  - **vsphereVolume.storagePolicyName** (string)

    storagePolicyName 是基於存儲策略的管理（SPBM）配置文件名稱。

<!--
### Deprecated

- **gitRepo** (GitRepoVolumeSource)

  gitRepo represents a git repository at a particular revision. Deprecated: GitRepo is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod's container.

  <a name="GitRepoVolumeSource"></a>
  *Represents a volume that is populated with the contents of a git repository. Git repo volumes do not support ownership management. Git repo volumes support SELinux relabeling.

  DEPRECATED: GitRepo is deprecated. To provision a container with a git repo, mount an EmptyDir into an InitContainer that clones the repo using git, then mount the EmptyDir into the Pod's container.*
-->
### 已棄用 {#deprecated}

- **gitRepo** (GitRepoVolumeSource)

  gitRepo 表示特定修訂版本的 git 倉庫。（注意：GitRepo 已被棄用。）如果與爲某容器提速 Git 倉庫，
  可以先將 emptyDir 掛載到 InitContainer 上，由後者使用 git 克隆倉庫，然後將 emptyDir 掛載到 Pod 的容器中。

  <a name="GitRepoVolumeSource"></a>
  **表示用 Git 倉庫的內容進行填充的一個卷。Git 倉庫卷不支持所有權管理。Git 倉庫卷支持 SELinux 重新打標籤。
  （注意：GitRepo 已被棄用。）如果與爲某容器提速 Git 倉庫，
  可以先將 emptyDir 掛載到 InitContainer 上，由後者使用 git 克隆倉庫，然後將 emptyDir 掛載到 Pod 的容器中。**

  <!--
  - **gitRepo.repository** (string), required

    repository is the URL

  - **gitRepo.directory** (string)

    directory is the target directory name. Must not contain or start with '..'.  If '.' is supplied, the volume directory will be the git repository.  Otherwise, if specified, the volume will contain the git repository in the subdirectory with the given name.

  - **gitRepo.revision** (string)

    revision is the commit hash for the specified revision.
  -->

  - **gitRepo.repository** (string)，必需

    repository 是倉庫的 URL。

  - **gitRepo.directory** (string)

    directory 是目標目錄的名稱。不得包含 “..” 或以 “..” 開頭。如果提供了 “.”，則卷目錄將是 Git 倉庫。
    否則，如果指定，卷將用給定名稱的子目錄中存放 Git 倉庫。

  - **gitRepo.revision** (string)

    revision 是指定修訂版本的提交哈希值。

## DownwardAPIVolumeFile {#DownwardAPIVolumeFile}

<!--
DownwardAPIVolumeFile represents information to create the file containing the pod field

<hr>

- **path** (string), required

  Required: Path is  the relative path name of the file to be created. Must not be absolute or contain the '..' path. Must be utf-8 encoded. The first item of the relative path must not start with '..'

- **fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

  Required: Selects a field of the pod: only annotations, labels, name, namespace and uid are supported.
-->
DownwardAPIVolumeFile 表示創建包含 Pod 字段的文件的信息。

<hr>

- **path** (string)，必需

  必需。path 是要創建的文件的相對路徑名稱。不得使用絕對路徑，也不得包含 “..” 路徑。
  必須用 UTF-8 進行編碼。相對路徑的第一項不得用 “..” 開頭。

- **fieldRef** (<a href="{{< ref "../common-definitions/object-field-selector#ObjectFieldSelector" >}}">ObjectFieldSelector</a>)

  必需。選擇 Pod 的字段：僅支持註解、標籤、名稱、名字空間和 uid。

<!--
- **mode** (int32)

  Optional: mode bits used to set permissions on this file, must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.

- **resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

  Selects a resource of the container: only resources limits and requests (limits.cpu, limits.memory, requests.cpu and requests.memory) are currently supported.
-->
- **mode** (int32)

  可選：模式位用於設置文件的權限，必須是 0000 到 0777 之間的八進制值或 0 到 511 之間的十進制值。
  YAML 既接受八進制值也接受十進制值，JSON 針對模式位需要十進制值。
  如果未指定，則將使用卷 defaultMode。
  這可能與影響文件模式的其他選項（如 fsGroup）有衝突，且結果可以是其他模式位也被設置。

- **resourceFieldRef** (<a href="{{< ref "../common-definitions/resource-field-selector#ResourceFieldSelector" >}}">ResourceFieldSelector</a>)

  選擇容器的資源：目前僅支持資源限制與請求（limits.cpu、limits.memory、requests.cpu 和 requests.memory）。

## KeyToPath {#KeyToPath}

<!--
Maps a string key to a path within a volume.

<hr>

- **key** (string), required

  key is the key to project.

- **path** (string), required

  path is the relative path of the file to map the key to. May not be an absolute path. May not contain the path element '..'. May not start with the string '..'.
-->
將一個字符串鍵映射到卷中的一個路徑。

<hr>

- **key** (string)，必需

  key 是要投射的鍵。

- **path** (string)，必需

  path 是將鍵映射到的文件的相對路徑。不能是絕對路徑。不能包含路徑元素 “..”。不能以字符串 “..” 開頭。

<!--
- **mode** (int32)

  mode is Optional: mode bits used to set permissions on this file. Must be an octal value between 0000 and 0777 or a decimal value between 0 and 511. YAML accepts both octal and decimal values, JSON requires decimal values for mode bits. If not specified, the volume defaultMode will be used. This might be in conflict with other options that affect the file mode, like fsGroup, and the result can be other mode bits set.
-->
- **mode** (int32)

  mode 是可選的：模式位用於爲文件設置權限。必須是 0000 到 0777 之間的八進制值或 0 到 511 之間的十進制值。
  YAML 既接受八進制值也接受十進制值，JSON 針對模式位需要十進制值。
  如果未指定，則將使用卷 defaultMode。
  這可能與影響文件模式的其他選項（如 fsGroup）有衝突，且結果可以是其他模式位也被設置。
