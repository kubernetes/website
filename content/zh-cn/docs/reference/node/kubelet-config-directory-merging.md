---
content_type: "reference"
title: kubelet 配置目录合并
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
当使用 kubelet 的 `--config-dir` 标志来指定存放配置的目录时，不同类型的配置会有一些特定的行为。

以下是在配置合并过程中不同数据类型的一些行为示例：

<!--
### Structure Fields

There are two types of structure fields in a YAML structure: singular (or a
scalar type) and embedded (structures that contain scalar types).
The configuration merging process handles the overriding of singular and embedded struct fields to create a resulting kubelet configuration.
-->
### 结构字段   {#structure-fields}

在 YAML 结构中有两种结构字段：独立（标量类型）和嵌入式（此结构包含标量类型）。
配置合并过程将处理独立构造字段和嵌入式构造字段的重载，以创建最终的 kubelet 配置。

<!--
For instance, you may want a baseline kubelet configuration for all nodes, but you may want to customize the `address` and `authorization` fields.
This can be done as follows:

Main kubelet configuration file contents:
-->
例如，你可能想要为所有节点设置一个基准 kubelet 配置，但希望自定义 `address` 和 `authorization` 字段。
这种情况下，你可以按以下方式完成：

kubelet 主配置文件内容：

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
`--config-dir` 目录中文件的内容：

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
生成的配置如下所示：

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

你可以重载 kubelet 配置的切片/列表值。
但在合并过程中整个列表将被重载。
例如，你可以按以下方式重载 `clusterDNS` 列表：

kubelet 主配置文件的内容：

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
`--config-dir` 目录中文件的内容：

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
生成的配置如下所示：

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
### 含嵌套结构的映射   {#maps-including-nested-structures}

映射中的各个字段（无论其值类型是布尔值、字符串等）都可以被选择性地重载。
但对于 `map[string][]string` 类型来说，与特定字段关联的整个列表都将被重载。
让我们通过一个例子更好地理解这一点，特别是 `featureGates` 和 `staticPodURLHeader` 这类字段：

kubelet 主配置文件的内容：

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
`--config-dir` 目录中文件的内容：

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
生成的配置如下所示：

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
