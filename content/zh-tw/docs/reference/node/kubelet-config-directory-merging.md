---
content_type: "reference"
title: kubelet 設定目錄合併
weight: 50
---
<!--
content_type: "reference"
title: Kubelet Configuration Directory Merging
weight: 50
-->

<!--
When using the kubelet's `--config-dir` flag to specify a drop-in directory for
configuration, there is some specific behavior on how different types are
merged.

Here are some examples of how different data types behave during configuration merging:
-->
當使用 kubelet 的 `--config-dir` 標誌來指定存放設定的目錄時，不同類型的設定會有一些特定的行爲。

以下是在設定合併過程中不同資料類型的一些行爲示例：

<!--
### Structure Fields

There are two types of structure fields in a YAML structure: singular (or a
scalar type) and embedded (structures that contain scalar types).
The configuration merging process handles the overriding of singular and embedded struct fields to create a resulting kubelet configuration.
-->
### 結構字段   {#structure-fields}

在 YAML 結構中有兩種結構字段：獨立（標量類型）和嵌入式（此結構包含標量類型）。
設定合併過程將處理獨立構造字段和嵌入式構造字段的重載，以創建最終的 kubelet 設定。

<!--
For instance, you may want a baseline kubelet configuration for all nodes, but you may want to customize the `address` and `authorization` fields.
This can be done as follows:

Main kubelet configuration file contents:
-->
例如，你可能想要爲所有節點設置一個基準 kubelet 設定，但希望自定義 `address` 和 `authorization` 字段。
這種情況下，你可以按以下方式完成：

kubelet 主設定檔案內容：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
port: 20250
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: "5m"
    cacheUnauthorizedTTL: "30s"
serializeImagePulls: false
address: "192.168.0.1"
```

<!--
Contents of a file in `--config-dir` directory:
-->
`--config-dir` 目錄中檔案的內容：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
authorization:
  mode: AlwaysAllow
  webhook:
    cacheAuthorizedTTL: "8m"
    cacheUnauthorizedTTL: "45s"
address: "192.168.0.8"
```

<!--
The resulting configuration will be as follows:
-->
生成的設定如下所示：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
port: 20250
serializeImagePulls: false
authorization:
  mode: AlwaysAllow
  webhook:
    cacheAuthorizedTTL: "8m"
    cacheUnauthorizedTTL: "45s"
address: "192.168.0.8"
```

<!--
### Lists
You can overide the slices/lists values of the kubelet configuration.
However, the entire list gets overridden during the merging process.
For example, you can override the `clusterDNS` list as follows:

Main kubelet configuration file contents:
-->
### 列表   {#lists}

你可以重載 kubelet 設定的切片/列表值。
但在合併過程中整個列表將被重載。
例如，你可以按以下方式重載 `clusterDNS` 列表：

kubelet 主設定檔案的內容：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
port: 20250
serializeImagePulls: false
clusterDNS:
  - "192.168.0.9"
  - "192.168.0.8"
```

<!--
Contents of a file in `--config-dir` directory:
-->
`--config-dir` 目錄中檔案的內容：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
  - "192.168.0.2"
  - "192.168.0.3"
  - "192.168.0.5"
```

<!--
The resulting configuration will be as follows:
-->
生成的設定如下所示：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
port: 20250
serializeImagePulls: false
clusterDNS:
  - "192.168.0.2"
  - "192.168.0.3"
  - "192.168.0.5"
```

<!--
### Maps, including Nested Structures

Individual fields in maps, regardless of their value types (boolean, string, etc.), can be selectively overridden.
However, for `map[string][]string`, the entire list associated with a specific field gets overridden.
Let's understand this better with an example, particularly on fields like `featureGates` and `staticPodURLHeader`:

Main kubelet configuration file contents:
-->
### 含嵌套結構的映射   {#maps-including-nested-structures}

映射中的各個字段（無論其值類型是布爾值、字符串等）都可以被選擇性地重載。
但對於 `map[string][]string` 類型來說，與特定字段關聯的整個列表都將被重載。
讓我們通過一個例子更好地理解這一點，特別是 `featureGates` 和 `staticPodURLHeader` 這類字段：

kubelet 主設定檔案的內容：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
port: 20250
serializeImagePulls: false
featureGates:
  AllAlpha: false
  MemoryQoS: true
staticPodURLHeader:
  kubelet-api-support:
  - "Authorization: 234APSDFA"
  - "X-Custom-Header: 123"
  custom-static-pod:
  - "Authorization: 223EWRWER"
  - "X-Custom-Header: 456"
```

<!--
Contents of a file in `--config-dir` directory:
-->
`--config-dir` 目錄中檔案的內容：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  MemoryQoS: false
  KubeletTracing: true
  DynamicResourceAllocation: true
staticPodURLHeader:
  custom-static-pod:
  - "Authorization: 223EWRWER"
  - "X-Custom-Header: 345"
```

<!--
The resulting configuration will be as follows:
-->
生成的設定如下所示：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
port: 20250
serializeImagePulls: false
featureGates:
  AllAlpha: false
  MemoryQoS: false
  KubeletTracing: true
  DynamicResourceAllocation: true
staticPodURLHeader:
  kubelet-api-support:
  - "Authorization: 234APSDFA"
  - "X-Custom-Header: 123"
  custom-static-pod:
  - "Authorization: 223EWRWER"
  - "X-Custom-Header: 345"
```
