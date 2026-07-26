---
title: 基于清单的准入控制
content_type: concept
---
<!--
title: Manifest-Based Admission Control
content_type: concept
-->

<!-- overview -->

{{< feature-state feature_gate_name="ManifestBasedAdmissionControlConfig" >}}

<!--
This page provides an overview of manifest-based admission control configuration.
Manifest-based admission control lets you load
[admission webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/)
and CEL-based admission policies from static files on disk, rather than from the
Kubernetes API. These policies are active from API server startup, operate
independently of {{< glossary_tooltip text="etcd" term_id="etcd" >}}, and can
protect API-based admission resources from modification.
-->
本页面概述了基于清单的准入控制配置。
基于清单的准入控制允许你从磁盘上的静态文件而非 Kubernetes API
加载[准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
和基于 CEL 的准入策略。这些策略从 API 服务器启动时就处于活跃状态，
独立于 {{< glossary_tooltip text="etcd" term_id="etcd" >}} 运行，
并且可以保护基于 API 的准入资源免受修改。

<!--
To use the feature, enable the `ManifestBasedAdmissionControlConfig`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/#ManifestBasedAdmissionControlConfig) and
configure the `staticManifestsDir` field in the
[AdmissionConfiguration](/docs/reference/config-api/apiserver-config.v1/#apiserver-k8s-io-v1-AdmissionConfiguration)
file passed to the kube-apiserver via `--admission-control-config-file`.
-->
要使用此功能，请在 kube-apiserver 上启用
`ManifestBasedAdmissionControlConfig`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#ManifestBasedAdmissionControlConfig)，
并在通过 `--admission-control-config-file` 传递给 kube-apiserver 的
[AdmissionConfiguration](/zh-cn/docs/reference/config-api/apiserver-config.v1/#apiserver-k8s-io-v1-AdmissionConfiguration)
文件中配置 `staticManifestsDir` 字段。

<!-- body -->

<!--
## Why use manifest-based admission control?
-->
## 为什么要使用基于清单的准入控制？

<!--
Admission policies and webhooks registered through the Kubernetes API (such as
ValidatingAdmissionPolicy, MutatingAdmissionPolicy,
ValidatingWebhookConfiguration, and MutatingWebhookConfiguration) have several
inherent limitations:
-->
通过 Kubernetes API 注册的准入策略和 Webhook（如 ValidatingAdmissionPolicy、
MutatingAdmissionPolicy、ValidatingWebhookConfiguration 和
MutatingWebhookConfiguration）有几个固有局限性：

<!--
- **Bootstrap gap**: REST-based policy enforcement requires the API objects to be
  created and loaded by the dynamic admission controller. Until that happens,
  policies are not enforced.
- **Self-protection gap**: Admission configuration resources (such as
  ValidatingWebhookConfiguration) are not themselves subject to webhook
  admission, to prevent circular dependencies. A user with sufficient privileges
  can delete or modify critical admission policies.
- **etcd dependency**: REST-based admission configurations depend on etcd
  availability. If etcd is unavailable or corrupted, admission policies may not
  load correctly.
-->
- **引导间隙**：基于 REST 的策略执行需要由动态准入控制器创建和加载
  API 对象。在此之前，策略不会被执行。
- **自我保护间隙**：准入配置资源（如 ValidatingWebhookConfiguration）
  本身不受 Webhook 准入控制，以防止循环依赖。
  具有足够权限的用户可以删除或修改关键准入策略。
- **etcd 依赖**：基于 REST 的准入配置依赖于 etcd 的可用性。
  如果 etcd 不可用或损坏，准入策略可能无法正确加载。

<!--
Manifest-based admission control addresses these limitations by loading
configurations from files on disk. These configurations are:

- Active as soon as the API server is ready to serve requests
- Not visible or changeable through the Kubernetes API
- Independent of etcd availability
- Able to intercept operations on API-based admission resources themselves
-->
基于清单的准入控制通过从磁盘上的文件加载配置来解决这些局限性。
这些配置具有以下特点：

- 从 API 服务器准备好提供请求服务的那一刻起就处于活跃状态
- 通过 Kubernetes API 无法查看或更改
- 不依赖于 etcd 的可用性
- 能够拦截对基于 API 的准入资源本身的操作

<!--
## Supported resource types
-->
## 支持的资源类型 

<!--
You can include the following resource types in manifest files. Only the
`admissionregistration.k8s.io/v1` API version is supported.
-->
你可以在清单文件中包含以下资源类型。仅支持
`admissionregistration.k8s.io/v1` API 版本。

<!--
{{< table caption="Supported resource types for manifest-based admission control" >}}
| Plugin name | Supported resource types |
|:------------|:------------------------|
| `ValidatingAdmissionWebhook` | ValidatingWebhookConfiguration |
| `MutatingAdmissionWebhook` | MutatingWebhookConfiguration |
| `ValidatingAdmissionPolicy` | ValidatingAdmissionPolicy, ValidatingAdmissionPolicyBinding |
| `MutatingAdmissionPolicy` | MutatingAdmissionPolicy, MutatingAdmissionPolicyBinding |
{{< /table >}}
-->
{{< table caption="基于清单的准入控制支持的资源类型" >}}
| 插件名称 | 支持的资源类型 |
|:------------|:------------------------|
| `ValidatingAdmissionWebhook` | ValidatingWebhookConfiguration |
| `MutatingAdmissionWebhook` | MutatingWebhookConfiguration |
| `ValidatingAdmissionPolicy` | ValidatingAdmissionPolicy、ValidatingAdmissionPolicyBinding |
| `MutatingAdmissionPolicy` | MutatingAdmissionPolicy、MutatingAdmissionPolicyBinding |
{{< /table >}}

<!--
You can also use `v1.List` to wrap multiple resources of the same plugin type
in a single document.

Each admission plugin's `staticManifestsDir` must only contain resource types
allowed for that plugin. For example, a directory configured for the
`ValidatingAdmissionPolicy` plugin can only contain ValidatingAdmissionPolicy
and ValidatingAdmissionPolicyBinding resources.
-->
你也可以使用 `v1.List` 将同一插件类型的多个资源包装在单个文档中。

每个准入插件的 `staticManifestsDir` 只能包含该插件允许的资源类型。
例如，为 `ValidatingAdmissionPolicy` 插件配置的目录只能包含
ValidatingAdmissionPolicy 和 ValidatingAdmissionPolicyBinding 资源。

<!--
## Configuring manifest-based admission control {#configuration}
-->
## 配置基于清单的准入控制    {#configuration}

<!--
To enable manifest-based admission control, you need:

1. The `ManifestBasedAdmissionControlConfig` feature gate enabled on the
   kube-apiserver.
1. An `AdmissionConfiguration` file with `staticManifestsDir` fields pointing
   to directories containing your manifest files.
1. The manifest files themselves on disk, accessible to the kube-apiserver
   process.
-->
要启用基于清单的准入控制，你需要：

1. 在 kube-apiserver 上启用 `ManifestBasedAdmissionControlConfig` 特性门控。
2. 一个 `AdmissionConfiguration` 文件，其 `staticManifestsDir`
   字段指向包含清单文件的目录。
3. 清单文件本身在磁盘上，且 kube-apiserver 进程可以访问。

<!--
### AdmissionConfiguration
-->
### AdmissionConfiguration

<!--
Add `staticManifestsDir` to the plugin configuration for each admission plugin
that should load manifests from disk. Each plugin requires its own directory.
-->
为每个需要从磁盘加载清单的准入插件在插件配置中添加 `staticManifestsDir`。
每个插件都需要自己的目录。

<!--
The `staticManifestsDir` field accepts an absolute path to a directory. All
direct-children files with `.yaml`, `.yml`, or `.json` extensions in the
directory are loaded. Subdirectories and files with other extensions are ignored.
Glob patterns and relative paths are not supported.

Pass this file to the kube-apiserver with the `--admission-control-config-file`
flag.
-->
`staticManifestsDir` 字段接受目录的绝对路径。目录中所有带 `.yaml`、`.yml`
或 `.json` 扩展名的直接子文件都会被加载。子目录和其他扩展名的文件会被忽略。
不支持 Glob 模式和相对路径。

使用 `--admission-control-config-file` 标志将此文件传递给 kube-apiserver。

<!--
### Configuration types
-->
### 配置类型

<!--
Each admission plugin uses a specific configuration kind:
-->
每个准入插件使用特定配置类型：

<!--
{{< table caption="Configuration types for each admission plugin" >}}
| Plugin | apiVersion | kind |
|:-------|:-----------|:-----|
| `ValidatingAdmissionWebhook` | `apiserver.config.k8s.io/v1` | `WebhookAdmissionConfiguration` |
| `MutatingAdmissionWebhook` | `apiserver.config.k8s.io/v1` | `WebhookAdmissionConfiguration` |
| `ValidatingAdmissionPolicy` | `apiserver.config.k8s.io/v1` | `ValidatingAdmissionPolicyConfiguration` |
| `MutatingAdmissionPolicy` | `apiserver.config.k8s.io/v1` | `MutatingAdmissionPolicyConfiguration` |
{{< /table >}}
-->
{{< table caption="每个准入插件的配置类型" >}}
| 插件 | apiVersion | kind |
|:-------|:-----------|:-----|
| `ValidatingAdmissionWebhook` | `apiserver.config.k8s.io/v1` | `WebhookAdmissionConfiguration` |
| `MutatingAdmissionWebhook` | `apiserver.config.k8s.io/v1` | `WebhookAdmissionConfiguration` |
| `ValidatingAdmissionPolicy` | `apiserver.config.k8s.io/v1` | `ValidatingAdmissionPolicyConfiguration` |
| `MutatingAdmissionPolicy` | `apiserver.config.k8s.io/v1` | `MutatingAdmissionPolicyConfiguration` |
{{< /table >}}

<!--
## Writing manifest files {#manifest-files}
-->
## 编写清单文件    {#manifest-files}

<!--
Manifest files contain standard Kubernetes resource definitions. You can include
multiple resources in a single file using YAML document separators (`---`).
-->
清单文件包含标准的 Kubernetes 资源定义。你可以使用 YAML 文档分隔符（`---`）
在单个文件中包含多个资源。

<!--
### Naming convention {#naming}
-->
### 命名约定    {#naming}

<!--
All objects in manifest files must have names ending with the `.static.k8s.io`
suffix. For example: `deny-privileged.static.k8s.io`.

When the `ManifestBasedAdmissionControlConfig` feature gate is enabled, creation
of API-based admission objects with names ending in `.static.k8s.io` is blocked.
When the feature gate is disabled, a warning is returned instead.
-->
清单文件中的所有对象名称必须以 `.static.k8s.io` 后缀结尾。
例如：`deny-privileged.static.k8s.io`。

当 `ManifestBasedAdmissionControlConfig` 特性门控被启用时，
阻止创建名称以 `.static.k8s.io` 结尾的基于 API 的准入对象。
当特性门控被禁用时，则返回一个警告。

{{< note >}}
<!--
If two manifest files define objects of the same type with the same name, the
API server fails to start, displaying a descriptive error.
-->
如果两个清单文件定义了相同类型的对象，且对象名称相同，则
API 服务器启动失败，显示描述性错误。
{{< /note >}}

<!--
### Restrictions
-->
### 限制

<!--
Manifest-based admission configurations exist in isolation and cannot
reference API resources. The following restrictions apply:

- **Webhooks**: Must use `clientConfig.url`. The `clientConfig.service` field is
  not allowed because the service network may not be available at API server
  startup.
- **Policies**: The `spec.paramKind` field is not allowed. Policies cannot
  reference ConfigMaps or other cluster objects for parameters.
- **Bindings**: The `spec.paramRef` field is not allowed. The `spec.policyName`
  must reference a policy defined in the same manifest file set and must end
  with `.static.k8s.io`.

Manifest files are decoded using the strict decoder, which rejects files
containing duplicate fields or unknown fields. Each object undergoes the same
defaulting and validation that the REST API applies.
-->
基于清单的准入配置独立存在，不能引用 API 资源。适用以下限制：

- **Webhook**：必须使用 `clientConfig.url`。不允许使用 `clientConfig.service`
  字段，因为服务网络可能在 API 服务器启动时不可用。
- **策略**：不允许使用 `spec.paramKind` 字段。策略不能引用 ConfigMap
  或其他集群对象作为参数。
- **绑定**：不允许使用 `spec.paramRef` 字段。`spec.policyName`
  必须引用在同一清单文件集中定义的策略，且必须以 `.static.k8s.io` 结尾。

清单文件使用严格解码器进行解码，该解码器会拒绝包含重复字段或未知字段的文件。
每个对象都会经历与 REST API 相同的默认设置和验证。

<!--
## Examples {#examples}
-->
## 示例    {#examples}

<!--
### Protecting API-based admission resources {#protecting-admission-resources}
-->
### 保护基于 API 的准入资源    {#protecting-admission-resources}

<!--
A key capability of manifest-based admission control is the ability to intercept
operations on admission configuration resources themselves
(ValidatingAdmissionPolicy, MutatingAdmissionPolicy,
ValidatingWebhookConfiguration, MutatingWebhookConfiguration, and their
bindings). REST-based admission webhooks and policies are not invoked on these
resource types to prevent circular dependencies, but manifest-based policies
can enforce rules on them because they do not have that circular dependency.

The following example prevents deletion or modification of admission resources
that carry the `platform.example.com/protected: "true"` label:
-->
基于清单的准入控制的一个关键能力是能够拦截对准入配置资源本身的操作
（ValidatingAdmissionPolicy、MutatingAdmissionPolicy、
ValidatingWebhookConfiguration、MutatingWebhookConfiguration 及其绑定）。
基于 REST 的准入 Webhook 和策略不会对这些资源类型调用，以防止循环依赖，
但基于清单的策略可以对其执行规则，因为它们没有这种循环依赖。

以下示例防止删除或修改带有 `platform.example.com/protected: "true"` 标签的准入资源：

<!--
### Enforcing a ValidatingAdmissionPolicy from disk
-->
### 从磁盘强制执行 ValidatingAdmissionPolicy

<!--
The following example defines a policy that denies privileged containers in all
namespaces except `kube-system`:

Place this file in the directory configured as `staticManifestsDir` for the
`ValidatingAdmissionPolicy` plugin. The policy and its binding are loaded
together atomically.
-->
以下示例定义了一个策略，除 `kube-system` 外拒绝所有名字空间中的特权容器：

将此文件放入为 `ValidatingAdmissionPolicy` 插件配置的
`staticManifestsDir` 目录中。策略及其绑定会被一起原子性地加载。

<!--
### Configuring a ValidatingWebhookConfiguration from disk
-->
### 从磁盘配置 ValidatingWebhookConfiguration

<!--
The following example configures a validating webhook that calls an external URL:
-->
以下示例配置了一个调用外部 URL 的验证 Webhook：

{{< note >}}
<!--
Webhook URLs must be reachable from the kube-apiserver at startup. Only
URL-based endpoints are supported; service references are not allowed in
manifest-based webhook configurations.
-->
Webhook URL 必须在启动时从 kube-apiserver 可达。仅支持基于 URL 的端点；
在基于清单的 Webhook 配置中不允许使用服务引用。
{{< /note >}}
-->

<!--
### Using the List format
-->
### 使用 List 格式

<!--
You can use `v1.List` to group related resources together in a single document:
-->
你可以使用 `v1.List` 将相关资源分组在单个文档中：

<!--
## Evaluation order
-->
## 评估顺序

<!--
Manifest-based configurations are evaluated before API-based configurations.
This ensures that platform-level policies enforced via static configuration take
precedence over API-based policies.

For admission configuration resources themselves (ValidatingAdmissionPolicy,
MutatingAdmissionPolicy, ValidatingAdmissionPolicyBinding,
MutatingAdmissionPolicyBinding, ValidatingWebhookConfiguration,
MutatingWebhookConfiguration), only manifest-based admission hooks are
evaluated. API-based hooks are skipped for these resource types to prevent
circular dependencies.
-->
基于清单的配置在基于 API 的配置之前被评估。
这确保了通过静态配置强制执行的平台级策略优先于基于 API 的策略。

对于准入配置资源本身（ValidatingAdmissionPolicy、
MutatingAdmissionPolicy、ValidatingAdmissionPolicyBinding、
MutatingAdmissionPolicyBinding、ValidatingWebhookConfiguration、
MutatingWebhookConfiguration），只评估基于清单的准入钩子。
为防止循环依赖，这些资源类型会跳过基于 API 的钩子。

<!--
## File watching and dynamic reloading {#dynamic-reloading}
-->
## 文件监视和动态重新加载    {#dynamic-reloading}

<!--
The kube-apiserver watches the configured directories for changes:

1. **Initial load**: At startup, all configured paths are read and validated.
   The API server does not become ready until all manifests are loaded
   successfully. Invalid manifests cause startup failure.
-->
kube-apiserver 监视配置的目录以获取变更：

1. **初始加载**：在启动时，所有配置的路径都会被读取和验证。
   在所有清单成功加载之前，API 服务器不会变为就绪状态。
   无效的清单会导致启动失败。

<!--
1. **Runtime reloading**: Changes to manifest files trigger a reload cycle:
   - File modifications are detected using
     [fsnotify](https://github.com/fsnotify/fsnotify) with a polling fallback
     (default 1 minute interval), similar to other config file reloading in
     kube-apiserver.
   - A content hash of all manifest files is computed on each check. If the hash
     is unchanged, no reload occurs.
   - New configurations are validated before being applied.
   - If validation fails, the error is logged, metrics are updated, and the
     previous valid configuration is retained.
   - Successful reloads atomically replace the previous configuration.
-->
2. **运行时重新加载**：对清单文件的更改会触发重新加载周期：
   - 使用 [fsnotify](https://github.com/fsnotify/fsnotify) 检测文件修改，
     并有轮询回退机制（默认间隔 1 分钟），类似于 kube-apiserver
     中的其他配置文件重新加载。
   - 每次检查时计算所有清单文件的内容哈希。如果哈希未更改，则不会重新加载。
   - 新配置在应用之前会被验证。
   - 如果验证失败，错误会被记录，指标会被更新，并保留之前的有效配置。
   - 成功的重新加载会原子性地替换之前的配置。

<!--
1. **Atomic file updates**: To avoid partial reads during file writes, make
   changes atomically (for example, write to a temporary file and rename it).
   This is especially important when updating mounted ConfigMaps or Secrets in
   containerized environments.
-->
3. **原子性文件更新**：为避免在文件写入期间进行部分读取，
   请原子性地进行更改（例如，先写入临时文件然后重命名）。
   这在更新容器化环境中挂载的 ConfigMap 或 Secret 时尤为重要。

{{< caution >}}
<!--
If an invalid manifest file is present at startup, the API server does not
start. At runtime, if a reload fails due to validation errors, the previous
valid configuration is retained and the error is logged.
-->
如果启动时存在无效的清单文件，API 服务器不会启动。
如果在运行时重新加载失败，会保留之前的有效配置并记录错误。
{{< /caution >}}

<!--
## Observability {#observability}
-->
## 可观测性    {#observability}

<!--
### Metrics
-->
### 指标

<!--
Manifest-based admission control provides the following metrics for monitoring
reload health:
-->
基于清单的准入控制提供以下指标用于监控重新加载健康状态：

<!--
{{< table caption="Metrics for manifest-based admission control" >}}
| Type | Description | Metric |
|:-----|:------------|:-------|
| Counter | Total number of reload attempts, with `status` (`success` or `failure`), `plugin`, and `apiserver_id_hash` labels. | `apiserver_manifest_admission_config_controller_automatic_reloads_total` |
| Gauge | Timestamp of the last reload attempt, with `status`, `plugin`, and `apiserver_id_hash` labels. | `apiserver_manifest_admission_config_controller_automatic_reload_last_timestamp_seconds` |
| Gauge | Current configuration information (value is always 1), with `plugin`, `apiserver_id_hash`, and `hash` labels. Use the `hash` label to detect configuration drift across API servers. | `apiserver_manifest_admission_config_controller_last_config_info` |
{{< /table >}}
-->
{{< table caption="基于清单的准入控制的指标" >}}
| 类型 | 描述 | 指标 |
|:-----|:------------|:-------|
| Counter | 重新加载尝试总数，带有 `status`（`success` 或 `failure`）、`plugin` 和 `apiserver_id_hash` 标签。 | `apiserver_manifest_admission_config_controller_automatic_reloads_total` |
| Gauge | 最后一次重新加载尝试的时间戳，带有 `status`、`plugin` 和 `apiserver_id_hash` 标签。 | `apiserver_manifest_admission_config_controller_automatic_reload_last_timestamp_seconds` |
| Gauge | 当前配置信息（值始终为 1），带有 `plugin`、`apiserver_id_hash` 和 `hash` 标签。使用 `hash` 标签可以检测跨 API 服务器的配置漂移。 | `apiserver_manifest_admission_config_controller_last_config_info` |
{{< /table >}}

<!--
The `plugin` label identifies which admission plugin the metric applies to:
`ValidatingAdmissionWebhook`, `MutatingAdmissionWebhook`,
`ValidatingAdmissionPolicy`, or `MutatingAdmissionPolicy`.

Since manifest-based objects have names ending in `.static.k8s.io`, existing
admission metrics (such as `apiserver_admission_webhook_rejection_count`) can
identify manifest-based decisions by filtering on the `name` label.
-->
`plugin` 标签标识指标适用的准入插件：
`ValidatingAdmissionWebhook`、`MutatingAdmissionWebhook`、
`ValidatingAdmissionPolicy` 或 `MutatingAdmissionPolicy`。

由于基于清单的对象名称以 `.static.k8s.io` 结尾，
现有的准入指标（如 `apiserver_admission_webhook_rejection_count`）
可以通过过滤 `name` 标签来识别基于清单的决策。

<!--
### Audit annotations
-->
### 审计注解

<!--
Existing audit annotations (such as
`validation.policy.admission.k8s.io/validation_failure` and
`mutation.webhook.admission.k8s.io/round_0_index_0`) include the object name.
You can identify manifest-based admission decisions by filtering for names
ending in `.static.k8s.io`.
-->
现有审计注解（如 `validation.policy.admission.k8s.io/validation_failure`
和 `mutation.webhook.admission.k8s.io/round_0_index_0`）包含对象名称。
你可以通过过滤以 `.static.k8s.io` 结尾的名称来识别基于清单的准入决策。

<!--
## High availability considerations {#ha-considerations}
-->
## 高可用性注意事项    {#ha-considerations}

<!--
Each kube-apiserver instance loads its own manifest files independently. In
high availability setups with multiple API server instances:

- Each API server must be configured individually. There is no cross-apiserver
  synchronization of manifest-based configurations.
- Use external configuration management tools (such as Ansible, Puppet, or
  shared storage mounts) to keep manifest files consistent across instances.
- The `apiserver_manifest_admission_config_controller_last_config_info` metric
  exposes a `hash` label that you can use to detect configuration drift across
  API server instances.
-->
每个 kube-apiserver 实例独立加载自己的清单文件。
在具有多个 API 服务器实例的高可用性设置中：

- 每个 API 服务器必须单独配置。基于清单的配置没有跨 API 服务器同步。
- 使用外部配置管理工具（如 Ansible、Puppet 或共享存储挂载）
  来保持清单文件在各个实例之间一致。
- `apiserver_manifest_admission_config_controller_last_config_info`
  指标暴露了一个 `hash` 标签，你可以使用它来检测跨 API 服务器实例的配置漂移。

<!--
This behavior is similar to other file-based kube-apiserver configurations such as
[encryption at rest](/docs/tasks/administer-cluster/encrypt-data/) and
[authentication](/docs/reference/access-authn-authz/authentication/).
-->
此行为类似于其他基于文件的 kube-apiserver 配置，
如[静态加密](/zh-cn/docs/tasks/administer-cluster/encrypt-data/)
和[身份验证](/zh-cn/docs/reference/access-authn-authz/authentication/)。

<!--
## Upgrade and downgrade {#upgrade-downgrade}
-->
## 升级和降级    {#upgrade-downgrade}

<!--
**Upgrade**: Enabling the feature and providing manifest configuration is
opt-in. Existing clusters without manifest configuration see no behavioral
change.

**Downgrade**: Before downgrading to a version without this feature:

1. Remove `staticManifestsDir` entries from the `AdmissionConfiguration` file.
1. If relying on manifest-based policies, recreate them as API objects where
   possible.
1. Restart the kube-apiserver.
-->
**升级**：启用此功能并提供清单配置是可选的。
没有清单配置的现有集群不会看到行为变化。

**降级**：在降级到没有此功能的版本之前：

1. 从 `AdmissionConfiguration` 文件中移除 `staticManifestsDir` 条目。
2. 如果依赖基于清单的策略，请尽可能将它们重新创建为 API 对象。
3. 重启 kube-apiserver。

{{< warning >}}
<!--
Downgrading without removing the `staticManifestsDir` configuration causes the
API server to fail to start due to unknown configuration fields.
-->
降级时，如果不移除 `staticManifestsDir` 配置，API 服务器会启动失败，
因为存在未知的配置字段。
{{< /warning >}}

<!--
## Troubleshooting {#troubleshooting}
-->
## 故障排除    {#troubleshooting}

<!--
{{< table caption="Common issues and their resolution" >}}
| Symptom | Possible cause | Resolution |
|:--------|:--------------|:-----------|
| API server fails to start | Invalid manifest file at startup | Check API server logs for validation errors. Fix the manifest file and restart. |
| API server fails to start | Duplicate object names across manifest files | Ensure all object names within a plugin's `staticManifestsDir` are unique. |
| Policies not enforced after file update | Reload validation failure | Check `automatic_reloads_total{status="failure"}` metric and API server logs. Fix the manifest and wait for the next reload cycle. |
| Webhook requests failing | Webhook URL not reachable | Verify that the URL specified in `clientConfig.url` is accessible from the kube-apiserver. |
| Cannot create API objects with `.static.k8s.io` suffix | Name suffix reserved by feature gate | The `.static.k8s.io` suffix is reserved for manifest-based configurations when the feature gate is enabled. Use a different name for API-based objects. |
{{< /table >}}
-->
{{< table caption="常见问题及其解决方法" >}}
| 症状 | 可能原因 | 解决方法 |
|:--------|:--------------|:-----------|
| API 服务器启动失败 | 启动时存在无效的清单文件 | 检查 API 服务器日志中的验证错误。修复清单文件并重启。 |
| API 服务器启动失败 | 清单文件之间存在重复的对象名称 | 确保插件的 `staticManifestsDir` 内的所有对象名称唯一。 |
| 文件更新后策略未执行 | 重新加载验证失败 | 检查 `automatic_reloads_total{status="failure"}` 指标和 API 服务器日志。修复清单并等待下一个重新加载周期。 |
| Webhook 请求失败 | Webhook URL 不可达 | 验证 `clientConfig.url` 中指定的 URL 从 kube-apiserver 可访问。 |
| 无法创建带有 `.static.k8s.io` 后缀的 API 对象 | 名称后缀被特性门控保留 | 当特性门控启用时，`.static.k8s.io` 后缀保留用于基于清单的配置。为基于 API 的对象使用其他名称。 |
{{< /table >}}

<!--
## {{% heading "whatsnext" %}}
-->
## 接下来    {#whatsnext}

<!--
- Learn about [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/)
  for CEL-based validation policies.
- Learn about [MutatingAdmissionPolicy](/docs/reference/access-authn-authz/mutating-admission-policy/)
  for CEL-based mutation policies.
- Learn about [Dynamic Admission Control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
  for webhook-based admission control.
- Read the [KEP-5793](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/5793-manifest-based-admission-control-config)
  design document.
-->
- 了解 [ValidatingAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)
  以获取基于 CEL 的验证策略。
- 了解 [MutatingAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/mutating-admission-policy/)
  以获取基于 CEL 的变更策略。
- 了解[动态准入控制](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
  以获取基于 Webhook 的准入控制。
- 阅读 [KEP-5793](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/5793-manifest-based-admission-control-config)
  设计文档。
