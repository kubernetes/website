---
title: CustomResourceDefinition 的版本
content_type: task
weight: 30
min-kubernetes-server-version: v1.16
---
<!--
title: Versions in CustomResourceDefinitions
reviewers:
- sttts
- liggitt
content_type: task
weight: 30
min-kubernetes-server-version: v1.16
-->

<!-- overview -->
<!--
This page explains how to add versioning information to
[CustomResourceDefinitions](/docs/reference/kubernetes-api/extend-resources/custom-resource-definition-v1/), to indicate the stability
level of your CustomResourceDefinitions or advance your API to a new version with conversion between API representations. It also describes how to upgrade an object from one version to another.
-->
本页介绍如何添加版本信息到
[CustomResourceDefinitions](/zh-cn/docs/reference/kubernetes-api/extend-resources/custom-resource-definition-v1/)。
目的是标明 CustomResourceDefinitions 的稳定级别或者服务于 API 升级。
API 升级时需要在不同 API 表示形式之间进行转换。
本页还描述如何将对象从一个版本升级到另一个版本。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You should have an initial understanding of [custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
-->
你应该对[定制资源](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)有一些初步了解。

{{< version-check >}}

<!-- steps -->

<!--
## Overview

The CustomResourceDefinition API provides a workflow for introducing and upgrading
to new versions of a CustomResourceDefinition.

When a CustomResourceDefinition is created, the first version is set in the
CustomResourceDefinition `spec.versions` list to an appropriate stability level
and a version number. For example `v1beta1` would indicate that the first
version is not yet stable. All custom resource objects will initially be stored
at this version.

Once the CustomResourceDefinition is created, clients may begin using the
`v1beta1` API.

Later it might be necessary to add new version such as `v1`.
-->
## 概览   {#overview}

CustomResourceDefinition API 提供了引入和升级 CustomResourceDefinition 新版本所用的工作流程。

创建 CustomResourceDefinition 时，会在 CustomResourceDefinition `spec.versions`
列表设置适当的稳定级别和版本号。例如，`v1beta1` 表示第一个版本尚未稳定。
所有定制资源对象将首先用这个版本保存。

创建 CustomResourceDefinition 后，客户端可以开始使用 `v1beta1` API。

稍后可能需要添加新版本，例如 `v1`。

<!--
Adding a new version:

1. Pick a conversion strategy. Since custom resource objects need the ability to
   be served at both versions, that means they will sometimes be served in a
   different version than the one stored. To make this possible, the custom resource objects must sometimes be converted between the
   version they are stored at and the version they are served at. If the
   conversion involves schema changes and requires custom logic, a conversion
   webhook should be used. If there are no schema changes, the default `None`
   conversion strategy may be used and only the `apiVersion` field will be
   modified when serving different versions.
1. If using conversion webhooks, create and deploy the conversion webhook. See
   the [Webhook conversion](#webhook-conversion) for more details.
1. Update the CustomResourceDefinition to include the new version in the
   `spec.versions` list with `served:true`.  Also, set `spec.conversion` field
   to the selected conversion strategy. If using a conversion webhook, configure
   `spec.conversion.webhookClientConfig` field to call the webhook.
-->
添加新版本：

1. 选择一种转化策略。由于定制资源对象需要能够两种版本都可用，
   这意味着它们有时会以与存储版本不同的版本来提供服务。为了能够做到这一点，
   有时必须在它们存储的版本和提供的版本之间进行转换。如果转换涉及模式变更，
   并且需要自定义逻辑，则应该使用 Webhook 来完成。如果没有模式变更，
   则可使用默认的 `None` 转换策略，为不同版本提供服务时只有 `apiVersion` 字段会被改变。
2. 如果使用转换 Webhook，请创建并部署转换 Webhook。更多详细信息请参见
   [Webhook 转换](#webhook-conversion)。
3. 更新 CustomResourceDefinition，将新版本设置为 `served：true`，加入到
   `spec.versions` 列表。另外，还要设置 `spec.conversion` 字段为所选的转换策略。
   如果使用转换 Webhook，请配置 `spec.conversion.webhookClientConfig` 来调用 Webhook。

<!--
Once the new version is added, clients may incrementally migrate to the new
version. It is perfectly safe for some clients to use the old version while
others use the new version.

Migrate stored objects to the new version:
-->
添加新版本后，客户端可以逐步迁移到新版本。
让某些客户使用旧版本的同时支持其他人使用新版本是相当安全的。

将存储的对象迁移到新版本：

<!--
1. See the [upgrade existing objects to a new stored version](#upgrade-existing-objects-to-a-new-stored-version) section.

It is safe for clients to use both the old and new version before, during and
after upgrading the objects to a new stored version.
-->

1. 请参阅[将现有对象升级到新的存储版本](#upgrade-existing-objects-to-a-new-stored-version)节。

   对于客户来说，在将对象升级到新的存储版本之前、期间和之后使用旧版本和新版本都是安全的。

<!--
Removing an old version:

1. Ensure all clients are fully migrated to the new version. The kube-apiserver
   logs can be reviewed to help identify any clients that are still accessing via
   the old version.
1. Set `served` to `false` for the old version in the `spec.versions` list. If
   any clients are still unexpectedly using the old version they may begin reporting
   errors attempting to access the custom resource objects at the old version.
   If this occurs, switch back to using `served:true` on the old version, migrate the
   remaining clients to the new version and repeat this step.
1. Ensure the [upgrade of existing objects to the new stored version](#upgrade-existing-objects-to-a-new-stored-version) step has been completed.
   1. Verify that the `storage` is set to `true` for the new version in the `spec.versions` list in the CustomResourceDefinition.
   1. Verify that the old version is no longer listed in the CustomResourceDefinition `status.storedVersions`.
1. Remove the old version from the CustomResourceDefinition `spec.versions` list.
1. Drop conversion support for the old version in conversion webhooks.
-->
删除旧版本：

1. 确保所有客户端都已完全迁移到新版本。
   可以查看 kube-apiserver 的日志以识别仍通过旧版本进行访问的所有客户端。
1. 在 `spec.versions` 列表中将旧版本的 `served` 设置为 `false`。
   如果仍有客户端意外地使用旧版本，他们可能开始会报告采用旧版本尝试访问定制资源的错误消息。
   如果发生这种情况，请将旧版本的 `served：true` 恢复，然后迁移余下的客户端使用新版本，然后重复此步骤。
1. 确保已完成[将现有对象升级到新存储版本](#upgrade-existing-objects-to-a-new-stored-version)的步骤。
   1. 在 CustomResourceDefinition 的 `spec.versions` 列表中，确认新版本的
      `storage` 已被设置为 `true`。
   2. 确认旧版本不在 CustomResourceDefinition `status.storedVersions` 中。
1. 从 CustomResourceDefinition `spec.versions` 列表中删除旧版本。
1. 在转换 Webhooks 中放弃对旧版本的转换支持。

<!--
## Specify multiple versions

The CustomResourceDefinition API `versions` field can be used to support multiple versions of custom resources that you
have developed. Versions can have different schemas, and conversion webhooks can convert custom resources between versions.
Webhook conversions should follow the [Kubernetes API conventions](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md) wherever applicable.
Specifically, See the [API change documentation](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md) for a set of useful gotchas and suggestions.
-->
## 指定多个版本  {#specify-multiple-versions}

CustomResourceDefinition API 的 `versions` 字段可用于支持你所开发的定制资源的多个版本。
版本可以具有不同的模式，并且转换 Webhook 可以在多个版本之间转换定制资源。
在适当的情况下，Webhook 转换应遵循
[Kubernetes API 约定](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md)。
具体来说，请查阅
[API 变更文档](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)
以获取一些有用的问题和建议。

{{< note >}}
<!--
In `apiextensions.k8s.io/v1beta1`, there was a `version` field instead of `versions`. The
`version` field is deprecated and optional, but if it is not empty, it must
match the first item in the `versions` field.
-->
在 `apiextensions.k8s.io/v1beta1` 版本中曾经有一个 `version` 字段，
名字不叫做 `versions`。该 `version` 字段已经被废弃，成为可选项。
不过如果该字段不是空，则必须与 `versions` 字段中的第一个条目匹配。
{{< /note >}}

<!--
This example shows a CustomResourceDefinition with two versions. For the first
example, the assumption is all versions share the same schema with no conversion
between them. The comments in the YAML provide more context.
-->
下面的示例显示了两个版本的 CustomResourceDefinition。
第一个例子中假设所有的版本使用相同的模式而它们之间没有转换。
YAML 中的注释提供了更多背景信息。

{{< tabs name="CustomResourceDefinition_versioning_example_1" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # name 必须匹配后面 spec 中的字段，且使用格式 <plural>.<group>
  name: crontabs.example.com
spec:
  # 组名，用于 REST API: /apis/<group>/<version>
  group: example.com
  # 此 CustomResourceDefinition 所支持的版本列表
  versions:
  - name: v1beta1
    # 每个 version 可以通过 served 标志启用或禁止
    served: true
    # 有且只能有一个 version 必须被标记为存储版本
    storage: true
    # schema 是必需字段
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  - name: v1
    served: true
    storage: false
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  # conversion 节是 Kubernetes 1.13+ 版本引入的，其默认值为无转换，即 strategy 子字段设置为 None。
  conversion:
    # None 转换假定所有版本采用相同的模式定义，仅仅将定制资源的 apiVersion 设置为合适的值.
    strategy: None
  # 可以是 Namespaced 或 Cluster
  scope: Namespaced
  names:
    # 名称的复数形式，用于 URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # 名称的单数形式，用于在命令行接口和显示时作为其别名
    singular: crontab
    # kind 通常是驼峰编码（CamelCased）的单数形式，用于资源清单中
    kind: CronTab
    # shortNames 允许你在命令行接口中使用更短的字符串来匹配你的资源
    shortNames:
    - ct
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}

```yaml
# 在 v1.16 中被弃用以推荐使用 apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # name 必须匹配后面 spec 中的字段，且使用格式 <plural>.<group>
  name: crontabs.example.com
spec:
  # 组名，用于 REST API: /apis/<group>/<version>
  group: example.com
  # 此 CustomResourceDefinition 所支持的版本列表
  versions:
  - name: v1beta1
    # 每个 version 可以通过 served 标志启用或禁止
    served: true
    # 有且只能有一个 version 必须被标记为存储版本
    storage: true
  - name: v1
    served: true
    storage: false
  validation:
    openAPIV3Schema:
      type: object
      properties:
        host:
          type: string
        port:
          type: string
  # conversion 节是 Kubernetes 1.13+ 版本引入的，其默认值为无转换，即 strategy 子字段设置为 None。
  conversion:
    # None 转换假定所有版本采用相同的模式定义，仅仅将定制资源的 apiVersion 设置为合适的值.
    strategy: None
  # 可以是 Namespaced 或 Cluster
  scope: Namespaced
  names:
    # 名称的复数形式，用于 URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # 名称的单数形式，用于在命令行接口和显示时作为其别名
    singular: crontab
    # kind 通常是大驼峰编码（PascalCased）的单数形式，用于资源清单中
    kind: CronTab
    # shortNames 允许你在命令行接口中使用更短的字符串来匹配你的资源
    shortNames:
    - ct
```
{{% /tab %}}
{{< /tabs >}}

<!--
You can save the CustomResourceDefinition in a YAML file, then use
`kubectl apply` to create it.
-->
你可以将 CustomResourceDefinition 存储在 YAML 文件中，然后使用
`kubectl apply` 来创建它。

```shell
kubectl apply -f my-versioned-crontab.yaml
```

<!--
After creation, the API server starts to serve each enabled version at an HTTP
REST endpoint. In the above example, the API versions are available at
`/apis/example.com/v1beta1` and `/apis/example.com/v1`.
-->
在创建之后，API 服务器开始在 HTTP REST 端点上为每个已启用的版本提供服务。
在上面的示例中，API 版本可以在 `/apis/example.com/v1beta1` 和
`/apis/example.com/v1` 处获得。

<!--
### Version priority

Regardless of the order in which versions are defined in a
CustomResourceDefinition, the version with the highest priority is used by
kubectl as the default version to access objects. The priority is determined
by parsing the _name_ field to determine the version number, the stability
(GA, Beta, or Alpha), and the sequence within that stability level.
-->
### 版本优先级   {#version-priority}

不考虑 CustomResourceDefinition 中版本被定义的顺序，kubectl
使用具有最高优先级的版本作为访问对象的默认版本。
优先级是通过解析 **name** 字段来确定版本号、稳定性（GA、Beta 或 Alpha）
以及该稳定性级别内的序列。

<!--
The algorithm used for sorting the versions is designed to sort versions in the
same way that the Kubernetes project sorts Kubernetes versions. Versions start with a
`v` followed by a number, an optional `beta` or `alpha` designation, and
optional additional numeric versioning information. Broadly, a version string might look
like `v2` or `v2beta1`. Versions are sorted using the following algorithm:
-->
用于对版本进行排序的算法在设计上与 Kubernetes 项目对 Kubernetes 版本进行排序的方式相同。
版本以 `v` 开头跟一个数字，一个可选的 `beta` 或者 `alpha` 和一个可选的附加数字作为版本信息。
从广义上讲，版本字符串可能看起来像 `v2` 或者 `v2beta1`。
使用以下算法对版本进行排序：

<!--
- Entries that follow Kubernetes version patterns are sorted before those that
  do not.
- For entries that follow Kubernetes version patterns, the numeric portions of
  the version string is sorted largest to smallest.
- If the strings `beta` or `alpha` follow the first numeric portion, they sorted
  in that order, after the equivalent string without the `beta` or `alpha`
  suffix (which is presumed to be the GA version).
- If another number follows the `beta`, or `alpha`, those numbers are also
  sorted from largest to smallest.
- Strings that don't fit the above format are sorted alphabetically and the
  numeric portions are not treated specially. Notice that in the example below,
  `foo1` is sorted above `foo10`. This is different from the sorting of the
  numeric portion of entries that do follow the Kubernetes version patterns.
-->
- 遵循 Kubernetes 版本模式的条目在不符合条件的条目之前进行排序。
- 对于遵循 Kubernetes 版本模式的条目，版本字符串的数字部分从最大到最小排序。
- 如果第一个数字后面有字符串 `beta` 或 `alpha`，它们首先按去掉 `beta` 或
  `alpha` 之后的版本号排序（相当于 GA 版本），之后按 `beta` 先、`alpha` 后的顺序排序，
- 如果 `beta` 或 `alpha` 之后还有另一个数字，那么也会针对这些数字从大到小排序。
- 不符合上述格式的字符串按字母顺序排序，数字部分不经过特殊处理。
  请注意，在下面的示例中，`foo1` 排在 `foo10` 之前。
  这与遵循 Kubernetes 版本模式的条目的数字部分排序不同。

<!--
This might make sense if you look at the following sorted version list:
-->
如果查看以下版本排序列表，这些规则就容易懂了：

```none
- v10
- v2
- v1
- v11beta2
- v10beta3
- v3beta1
- v12alpha1
- v11alpha2
- foo1
- foo10
```

<!--
For the example in [Specify multiple versions](#specify-multiple-versions), the
version sort order is `v1`, followed by `v1beta1`. This causes the kubectl
command to use `v1` as the default version unless the provided object specifies
the version.
-->
对于[指定多个版本](#specify-multiple-versions)中的示例，版本排序顺序为
`v1`，后跟着 `v1beta1`。
这导致了 kubectl 命令使用 `v1` 作为默认版本，除非所提供的对象指定了版本。

<!--
### Version deprecation
-->
### 版本废弃   {#version-deprecation}

{{< feature-state state="stable" for_k8s_version="v1.19" >}}

<!--
Starting in v1.19, a CustomResourceDefinition can indicate a particular version of the resource it defines is deprecated.
When API requests to a deprecated version of that resource are made, a warning message is returned in the API response as a header.
The warning message for each deprecated version of the resource can be customized if desired.
-->
从 v1.19 开始，CustomResourceDefinition 可以指示其定义的资源的特定版本已废弃。
当该资源的已废弃版本发出 API 请求时，会在 API 响应中以报头的形式返回警告消息。
如果需要，可以自定义每个不推荐使用的资源版本的警告消息。

<!--
A customized warning message should indicate the deprecated API group, version, and kind,
and should indicate what API group, version, and kind should be used instead, if applicable.
-->
定制的警告消息应该标明废弃的 API 组、版本和类别（kind），
并且应该标明应该使用（如果有的话）哪个 API 组、版本和类别作为替代。

{{< tabs name="CustomResourceDefinition_versioning_deprecated" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
  name: crontabs.example.com
spec:
  group: example.com
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
  scope: Namespaced
  versions:
  - name: v1alpha1
    served: true
    storage: false
    # 此属性标明此定制资源的 v1alpha1 版本已被弃用。
    # 发给此版本的 API 请求会在服务器响应中收到警告消息头。
    deprecated: true
    # 此属性设置用来覆盖返回给发送 v1alpha1 API 请求的客户端的默认警告信息。
    deprecationWarning: "example.com/v1alpha1 CronTab is deprecated; see http://example.com/v1alpha1-v1 for instructions to migrate to example.com/v1 CronTab"
    schema: ...
  - name: v1beta1
    served: true
    # 此属性标明该定制资源的 v1beta1 版本已被弃用。
    # 发给此版本的 API 请求会在服务器响应中收到警告消息头。
    # 针对此版本的请求所返回的是默认的警告消息。
    deprecated: true
    schema: ...
  - name: v1
    served: true
    storage: true
    schema: ...
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# 在 v1.16 中弃用以推荐使用  apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: crontabs.example.com
spec:
  group: example.com
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
  scope: Namespaced
  validation: ...
  versions:
  - name: v1alpha1
    served: true
    storage: false
    # 此属性标明此定制资源的 v1alpha1 版本已被弃用。
    # 发给此版本的 API 请求会在服务器响应中收到警告消息头。
    deprecated: true
    # 此属性设置用来覆盖返回给发送 v1alpha1 API 请求的客户端的默认警告信息。
    deprecationWarning: "example.com/v1alpha1 CronTab is deprecated; see http://example.com/v1alpha1-v1 for instructions to migrate to example.com/v1 CronTab"
  - name: v1beta1
    served: true
    # 此属性标明该定制资源的 v1beta1 版本已被弃用。
    # 发给此版本的 API 请求会在服务器响应中收到警告消息头。
    # 针对此版本的请求所返回的是默认的警告消息。
    deprecated: true
  - name: v1
    served: true
    storage: true
```
{{% /tab %}}
{{< /tabs >}}

<!--
### Version removal

An older API version cannot be dropped from a CustomResourceDefinition manifest until existing stored data has been migrated to the newer API version for all clusters that served the older version of the custom resource, and the old version is removed from the `status.storedVersions` of the CustomResourceDefinition.
-->
### 版本删除   {#version-removal}

在为所有提供旧版本自定义资源的集群将现有存储数据迁移到新 API 版本，并且从 CustomResourceDefinition 的
`status.storedVersions` 中删除旧版本之前，无法从 CustomResourceDefinition 清单文件中删除旧 API 版本。

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
  name: crontabs.example.com
spec:
  group: example.com
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
  scope: Namespaced
  versions:
  - name: v1beta1
    # 此属性标明该自定义资源的 v1beta1 版本已不再提供。
    # 发给此版本的 API 请求会在服务器响应中收到未找到的错误。
    served: false
    schema: ...
  - name: v1
    served: true
    # 新提供的版本应该设置为存储版本。
    storage: true
    schema: ...
```

<!--
## Webhook conversion
-->
## Webhook 转换   {#webhook-conversion}

{{< feature-state state="stable" for_k8s_version="v1.16" >}}

{{< note >}}
<!--
Webhook conversion is available as beta since 1.15, and as alpha since Kubernetes 1.13. The
`CustomResourceWebhookConversion` feature must be enabled, which is the case automatically for many clusters for beta features. Please refer to the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) documentation for more information.
-->
Webhook 转换在 Kubernetes 1.13 版本作为 Alpha 功能引入，在 Kubernetes 1.15 版本中成为 Beta 功能。
要使用此功能，应启用 `CustomResourceWebhookConversion` 特性。
在大多数集群上，这类 Beta 特性应该是自动启用的。
请参阅[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)文档以获得更多信息。
{{< /note >}}

<!--
The above example has a None conversion between versions which only sets the `apiVersion` field
on conversion and does not change the rest of the object. The API server also supports webhook
conversions that call an external service in case a conversion is required. For example when:
-->
上面的例子在版本之间有一个 None 转换，它只在转换时设置 `apiVersion` 字段而不改变对象的其余部分。
API 服务器还支持在需要转换时调用外部服务的 webhook 转换。例如：

<!--
* custom resource is requested in a different version than stored version.
* Watch is created in one version but the changed object is stored in another version.
* custom resource PUT request is in a different version than storage version.
-->
* 定制资源的请求版本与其存储版本不同。
* 使用某版本创建了 Watch 请求，但所更改对象以另一版本存储。
* 定制资源的 PUT 请求所针对版本与存储版本不同。

<!--
To cover all of these cases and to optimize conversion by the API server,
the conversion requests may contain multiple objects in order to minimize the external calls.
The webhook should perform these conversions independently.
-->
为了涵盖所有这些情况并优化 API 服务器所作的转换，转换请求可以包含多个对象，
以便减少外部调用。Webhook 应该独立执行各个转换。

<!--
### Write a conversion webhook server

Please refer to the implementation of the [custom resource conversion webhook
server](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/main.go)
that is validated in a Kubernetes e2e test. The webhook handles the
`ConversionReview` requests sent by the API servers, and sends back conversion
results wrapped in `ConversionResponse`. Note that the request
contains a list of custom resources that need to be converted independently without
changing the order of objects.
The example server is organized in a way to be reused for other conversions.
Most of the common code are located in the
[framework file](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/converter/framework.go)
that leaves only
[one function](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/converter/example_converter.go#L29-L80)
to be implemented for different conversions.
-->
### 编写一个转换 Webhook 服务器   {#write-a-conversion-webhook-server}

请参考[定制资源转换 Webhook 服务器](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/main.go)的实现；
该实现在 Kubernetes e2e 测试中得到验证。
Webhook 处理由 API 服务器发送的 `ConversionReview` 请求，并在
`ConversionResponse` 中封装发回转换结果。
请注意，请求包含需要独立转换的定制资源列表，这些对象在被转换之后不能改变其在列表中的顺序。
该示例服务器的组织方式使其可以复用于其他转换。大多数常见代码都位于
[framework 文件](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/converter/framework.go)中，
只留下[一个函数](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/converter/example_converter.go#L29-L80)用于实现不同的转换。

{{< note >}}
<!--
The example conversion webhook server leaves the `ClientAuth` field
[empty](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/config.go#L47-L48),
which defaults to `NoClientCert`. This means that the webhook server does not
authenticate the identity of the clients, supposedly API servers. If you need
mutual TLS or other ways to authenticate the clients, see
how to [authenticate API servers](/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers).
-->
转换 Webhook 服务器示例中将 `ClientAuth`
字段设置为[空](https://github.com/kubernetes/kubernetes/tree/v1.25.3/test/images/agnhost/crd-conversion-webhook/config.go#L47-L48)，
默认为 `NoClientCert`。
这意味着 webhook 服务器没有验证客户端（也就是 API 服务器）的身份。
如果你需要双向 TLS 或者其他方式来验证客户端，
请参阅如何[验证 API 服务](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers)。
{{< /note >}}

<!--
#### Permissible mutations

A conversion webhook must not mutate anything inside of `metadata` of the converted object
other than `labels` and `annotations`.
Attempted changes to `name`, `UID` and `namespace` are rejected and fail the request
which caused the conversion. All other changes are ignored.
-->
#### 被允许的变更

转换 Webhook 不可以更改被转换对象的 `metadata` 中除 `labels` 和 `annotations`
之外的任何属性。
尝试更改 `name`、`UID` 和 `namespace` 时都会导致引起转换的请求失败。
所有其他变更都被忽略。

<!--
### Deploy the conversion webhook service

Documentation for deploying the conversion webhook is the same as for the
[admission webhook example service](/docs/reference/access-authn-authz/extensible-admission-controllers/#deploy-the-admission-webhook-service).
The assumption for next sections is that the conversion webhook server is deployed to a service
named `example-conversion-webhook-server` in `default` namespace and serving traffic on path `/crdconvert`.
-->
### 部署转换 Webhook 服务   {#deploy-the-conversion-webhook-service}

用于部署转换 Webhook
的文档与[准入 Webhook 服务示例](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#deploy-the-admission-webhook-service)相同。
这里的假设是转换 Webhook 服务器被部署为 `default` 名字空间中名为
`example-conversion-webhook-server` 的服务，并在路径 `/crdconvert`
上处理请求。

{{< note >}}
<!--
When the webhook server is deployed into the Kubernetes cluster as a
service, it has to be exposed via a service on port 443 (The server
itself can have an arbitrary port but the service object should map it to port 443).
The communication between the API server and the webhook service may fail
if a different port is used for the service.
-->
当 Webhook 服务器作为一个服务被部署到 Kubernetes 集群中时，它必须通过端口 443
公开其服务（服务器本身可以使用任意端口，但是服务对象应该将它映射到端口 443）。
如果为服务器使用不同的端口，则 API 服务器和 Webhook 服务器之间的通信可能会失败。
{{< /note >}}

<!--
### Configure CustomResourceDefinition to use conversion webhooks

The `None` conversion example can be extended to use the conversion webhook by modifying `conversion`
section of the `spec`:
-->
### 配置 CustomResourceDefinition 以使用转换 Webhook   {#configure-crd-to-use-conversion-webhooks}

通过修改 `spec` 中的 `conversion` 部分，可以扩展 `None` 转换示例来使用转换 Webhook。

{{< tabs name="CustomResourceDefinition_versioning_example_2" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # name 必须匹配后面 spec 中的字段，且使用格式 <plural>.<group>
  name: crontabs.example.com
spec:
  # 组名，用于 REST API: /apis/<group>/<version>
  group: example.com
  # 此 CustomResourceDefinition 所支持的版本列表
  versions:
  - name: v1beta1
    # 每个 version 可以通过 served 标志启用或禁止
    served: true
    # 有且只能有一个 version 必须被标记为存储版本
    storage: true
    # 当不存在顶级模式定义时，每个版本（version）可以定义其自身的模式
    schema:
      openAPIV3Schema:
        type: object
        properties:
          hostPort:
            type: string
  - name: v1
    served: true
    storage: false
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  conversion:
    # Webhook strategy 告诉 API 服务器调用外部 Webhook 来完成定制资源之间的转换
    strategy: Webhook
    # 当 strategy 为 "Webhook" 时，webhook 属性是必需的，该属性配置将被 API 服务器调用的 Webhook 端点
    webhook:
      # conversionReviewVersions 标明 Webhook 所能理解或偏好使用的
      # ConversionReview 对象版本。
      # API 服务器所能理解的列表中的第一个版本会被发送到 Webhook
      # Webhook 必须按所接收到的版本响应一个 ConversionReview 对象
      conversionReviewVersions: ["v1","v1beta1"]
      clientConfig:
        service:
          namespace: default
          name: example-conversion-webhook-server
          path: /crdconvert
        caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
  # 可以是 Namespaced 或 Cluster
  scope: Namespaced
  names:
    # 名称的复数形式，用于 URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # 名称的单数形式，用于在命令行接口和显示时作为其别名
    singular: crontab
    # kind 通常是驼峰编码（CamelCased）的单数形式，用于资源清单中
    kind: CronTab
    # shortNames 允许你在命令行接口中使用更短的字符串来匹配你的资源
    shortNames:
    - ct
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# 在 v1.16 中被弃用以推荐使用 apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # name 必须匹配后面 spec 中的字段，且使用格式 <plural>.<group>
  name: crontabs.example.com
spec:
  # 组名，用于 REST API: /apis/<group>/<version>
  group: example.com
  # 裁剪掉下面的 OpenAPI 模式中未曾定义的对象字段
  preserveUnknownFields: false
  # 此 CustomResourceDefinition 所支持的版本列表
  versions:
  - name: v1beta1
    # 每个 version 可以通过 served 标志启用或禁止
    served: true
    # 有且只能有一个 version 必须被标记为存储版本
    storage: true
    # 当不存在顶级模式定义时，每个版本（version）可以定义其自身的模式
    schema:
      openAPIV3Schema:
        type: object
        properties:
          hostPort:
            type: string
  - name: v1
    served: true
    storage: false
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  conversion:
    # Webhook strategy 告诉 API 服务器调用外部 Webhook 来完成定制资源
    strategy: Webhook
    # 当 strategy 为 "Webhook" 时，webhookClientConfig 属性是必需的
    # 该属性配置将被 API 服务器调用的 Webhook 端点
    webhookClientConfig:
      service:
        namespace: default
        name: example-conversion-webhook-server
        path: /crdconvert
      caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
  # 可以是 Namespaced 或 Cluster
  scope: Namespaced
  names:
    # 名称的复数形式，用于 URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # 名称的单数形式，用于在命令行接口和显示时作为其别名
    singular: crontab
    # kind 通常是驼峰编码（CamelCased）的单数形式，用于资源清单中
    kind: CronTab
    # shortNames 允许你在命令行接口中使用更短的字符串来匹配你的资源
    shortNames:
    - ct
```
{{% /tab %}}
{{< /tabs >}}

<!--
You can save the CustomResourceDefinition in a YAML file, then use
`kubectl apply` to apply it.
-->
你可以将 CustomResourceDefinition 保存在 YAML 文件中，然后使用
`kubectl apply` 来应用它。

```shell
kubectl apply -f my-versioned-crontab-with-conversion.yaml
```

<!--
Make sure the conversion service is up and running before applying new changes.
-->
在应用新更改之前，请确保转换服务器已启动并正在运行。

<!--
### Contacting the webhook

Once the API server has determined a request should be sent to a conversion webhook,
it needs to know how to contact the webhook. This is specified in the `webhookClientConfig`
stanza of the webhook configuration.

Conversion webhooks can either be called via a URL or a service reference,
and can optionally include a custom CA bundle to use to verify the TLS connection.
-->
### 调用 Webhook   {#contacting-the-webhook}

API 服务器一旦确定请求应发送到转换 Webhook，它需要知道如何调用 Webhook。
这是在 `webhookClientConfig` 中指定的 Webhook 配置。

转换 Webhook 可以通过 URL 或服务引用来调用，并且可以选择包含自定义 CA 包，
以用于验证 TLS 连接。

### URL

<!--
`url` gives the location of the webhook, in standard URL form
(`scheme://host:port/path`).

The `host` should not refer to a service running in the cluster; use
a service reference by specifying the `service` field instead.
The host might be resolved via external DNS in some apiservers
(i.e., `kube-apiserver` cannot resolve in-cluster DNS as that would
be a layering violation). `host` may also be an IP address.

Please note that using `localhost` or `127.0.0.1` as a `host` is
risky unless you take great care to run this webhook on all hosts
which run an apiserver which might need to make calls to this
webhook. Such installations are likely to be non-portable or not readily run in a new cluster.
-->
`url` 以标准 URL 形式给出 Webhook 的位置（`scheme://host:port/path`）。
`host` 不应引用集群中运行的服务，而应通过指定 `service` 字段来提供服务引用。
在某些 API 服务器中，`host` 可以通过外部 DNS 进行解析（即
`kube-apiserver` 无法解析集群内 DNS，那样会违反分层规则）。
`host` 也可以是 IP 地址。

请注意，除非你非常小心地在所有运行着可能调用 Webhook 的 API 服务器的主机上运行此 Webhook，
否则将 `localhost` 或 `127.0.0.1` 用作 `host` 是风险很大的。
这样的安装可能是不可移植的，或者不容易在一个新的集群中运行。
<!--
The scheme must be "https"; the URL must begin with "https://".

Attempting to use a user or basic auth (for example "user:password@") is not allowed.
Fragments ("#...") and query parameters ("?...") are also not allowed.

Here is an example of a conversion webhook configured to call a URL
(and expects the TLS certificate to be verified using system trust roots, so does not specify a caBundle):
-->
HTTP 协议必须为 `https`；URL 必须以 `https://` 开头。

尝试使用用户或基本身份验证（例如，使用 `user:password@`）是不允许的。
URL 片段（`#...`）和查询参数（`?...`）也是不允许的。

下面是为调用 URL 来执行转换 Webhook 的示例，其中期望使用系统信任根来验证
TLS 证书，因此未指定 caBundle：

{{< tabs name="CustomResourceDefinition_versioning_example_3" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhook:
      clientConfig:
        url: "https://my-webhook.example.com:9443/my-webhook-path"
...
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# 在 v1.16 中已弃用以推荐使用 apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhookClientConfig:
      url: "https://my-webhook.example.com:9443/my-webhook-path"
...
```
{{% /tab %}}
{{< /tabs >}}

<!--
### Service Reference

The `service` stanza inside `webhookClientConfig` is a reference to the service for a conversion webhook.
If the webhook is running within the cluster, then you should use `service` instead of `url`.
The service namespace and name are required. The port is optional and defaults to 443.
The path is optional and defaults to "/".

Here is an example of a webhook that is configured to call a service on port "1234"
at the subpath "/my-path", and to verify the TLS connection against the ServerName
`my-service-name.my-service-namespace.svc` using a custom CA bundle.
-->
### 服务引用   {#service-reference}

`webhookClientConfig` 内部的 `service` 段是对转换 Webhook 服务的引用。
如果 Webhook 在集群中运行，则应使用 `service` 而不是 `url`。
服务的名字空间和名称是必需的。端口是可选的，默认为 443。
路径是可选的，默认为`/`。

下面配置中，服务配置为在端口 `1234`、子路径 `/my-path` 上被调用。
例子中针对 ServerName `my-service-name.my-service-namespace.svc`，
使用自定义 CA 包验证 TLS 连接。

{{< tabs name="CustomResourceDefinition_versioning_example_4" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhook:
      clientConfig:
        service:
          namespace: my-service-namespace
          name: my-service-name
          path: /my-path
          port: 1234
        caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
...
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
#  v1.16 中被弃用以推荐使用 apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhookClientConfig:
      service:
        namespace: my-service-namespace
        name: my-service-name
        path: /my-path
        port: 1234
      caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
...
```
{{% /tab %}}
{{< /tabs >}}

<!--
## Webhook request and response

### Request

Webhooks are sent a POST request, with `Content-Type: application/json`,
with a `ConversionReview` API object in the `apiextensions.k8s.io` API group
serialized to JSON as the body.

Webhooks can specify what versions of `ConversionReview` objects they accept
with the `conversionReviewVersions` field in their CustomResourceDefinition:
-->
## Webhook 请求和响应   {#webhook-request-and-response}

### 请求   {#request}

向 Webhook 发起请求的动词是 POST，请求的 `Content-Type` 为 `application/json`。
请求的主题为 JSON 序列化形式的
apiextensions.k8s.io API 组的 ConversionReview API 对象。

Webhook 可以在其 CustomResourceDefinition 中使用 `conversionReviewVersions`
字段设置它们接受的 `ConversionReview` 对象的版本：

{{< tabs name="conversionReviewVersions" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhook:
      conversionReviewVersions: ["v1", "v1beta1"]
      ...
```

<!--
`conversionReviewVersions` is a required field when creating
`apiextensions.k8s.io/v1` custom resource definitions.
Webhooks are required to support at least one `ConversionReview`
version understood by the current and previous API server.
-->
创建 `apiextensions.k8s.io/v1` 版本的自定义资源定义时，
`conversionReviewVersions` 是必填字段。
Webhook 要求支持至少一个 `ConversionReview` 当前和以前的 API 服务器可以理解的版本。

{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# v1.16 已弃用以推荐使用 apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    conversionReviewVersions: ["v1", "v1beta1"]
    ...
```
<!--
If no `conversionReviewVersions` are specified, the default when creating
`apiextensions.k8s.io/v1beta1` custom resource definitions is `v1beta1`.
-->
创建 apiextensions.k8s.io/v1beta1 定制资源定义时若未指定
`conversionReviewVersions`，则默认值为 v1beta1。

{{% /tab %}}
{{< /tabs >}}

<!--
API servers send the first `ConversionReview` version in the `conversionReviewVersions` list they support.
If none of the versions in the list are supported by the API server, the custom resource definition will not be allowed to be created.
If an API server encounters a conversion webhook configuration that was previously created and does not support any of the `ConversionReview`
versions the API server knows how to send, attempts to call to the webhook will fail.
-->
API 服务器将 `conversionReviewVersions` 列表中他们所支持的第一个
`ConversionReview` 资源版本发送给 Webhook。
如果列表中的版本都不被 API 服务器支持，则无法创建自定义资源定义。
如果某 API 服务器遇到之前创建的转换 Webhook 配置，并且该配置不支持
API 服务器知道如何发送的任何 `ConversionReview` 版本，调用 Webhook
的尝试会失败。

<!--
This example shows the data contained in an `ConversionReview` object
for a request to convert `CronTab` objects to `example.com/v1`:
-->
下面的示例显示了包含在 `ConversionReview` 对象中的数据，
该请求意在将 `CronTab` 对象转换为 `example.com/v1`：

{{< tabs name="ConversionReview_request" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "request": {
    # 用来唯一标识此转换调用的随机 UID
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    
    # 对象要转换到的目标 API 组和版本
    "desiredAPIVersion": "example.com/v1",
    
    # 要转换的对象列表，其中可能包含一个或多个对象，版本可能相同也可能不同
    "objects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "hostPort": "localhost:1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "hostPort": "example.com:2345"
      }
    ]
  }
}
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
{
  # v1.16 中已废弃以推荐使用 apiextensions.k8s.io/v1
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "request": {
    # 用来唯一标识此转换调用的随机 UID
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    
    # 对象要转换到的目标 API 组和版本
    "desiredAPIVersion": "example.com/v1",
    
    # 要转换的对象列表，其中可能包含一个或多个对象，版本可能相同也可能不同
    "objects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "hostPort": "localhost:1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1beta1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "hostPort": "example.com:2345"
      }
    ]
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
### Response

Webhooks respond with a 200 HTTP status code, `Content-Type: application/json`,
and a body containing a `ConversionReview` object (in the same version they were sent),
with the `response` stanza populated, serialized to JSON.

If conversion succeeds, a webhook should return a `response` stanza containing the following fields:
* `uid`, copied from the `request.uid` sent to the webhook
* `result`, set to `{"status":"Success"}`
* `convertedObjects`, containing all of the objects from `request.objects`, converted to `request.desiredAPIVersion`

Example of a minimal successful response from a webhook:
-->
### 响应   {#response}

Webhook 响应包含 200 HTTP 状态代码、`Content-Type: application/json`，
在主体中包含 JSON 序列化形式的数据，在 `response` 节中给出
`ConversionReview` 对象（与发送的版本相同）。

如果转换成功，则 Webhook 应该返回包含以下字段的 `response` 节：

* `uid`，从发送到 webhook 的 `request.uid` 复制而来
* `result`，设置为 `{"status":"Success"}}`
* `convertedObjects`，包含来自 `request.objects` 的所有对象，均已转换为
  `request.desiredAPIVersion`

Webhook 的最简单成功响应示例：

{{< tabs name="ConversionReview_response_success" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "response": {
    # 必须与 <request.uid> 匹配
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    "result": {
      "status": "Success"
    },
    # 这里的对象必须与 request.objects 中的对象顺序相同并且其 apiVersion 被设置为 <request.desiredAPIVersion>。
    # kind、metadata.uid、metadata.name 和 metadata.namespace 等字段都不可被 Webhook 修改。
    # Webhook 可以更改 metadata.labels 和 metadata.annotations 字段值。
    # Webhook 对 metadata 中其他字段的更改都会被忽略
    "convertedObjects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "host": "localhost",
        "port": "1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "host": "example.com",
        "port": "2345"
      }
    ]
  }
}
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
{
  # v1.16 中已弃用以推荐使用  apiextensions.k8s.io/v1
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "response": {
    # 必须与 <request.uid> 匹配
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    "result": {
      "status": "Failed"
    },
    # 这里的对象必须与 request.objects 中的对象顺序相同并且其 apiVersion 被设置为 <request.desiredAPIVersion>。
    # kind、metadata.uid、metadata.name 和 metadata.namespace 等字段都不可被 Webhook 修改。
    # Webhook 可以更改 metadata.labels 和 metadata.annotations 字段值。
    # Webhook 对 metadata 中其他字段的更改都会被忽略。
    "convertedObjects": [
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-04T14:03:02Z",
          "name": "local-crontab",
          "namespace": "default",
          "resourceVersion": "143",
          "uid": "3415a7fc-162b-4300-b5da-fd6083580d66"
        },
        "host": "localhost",
        "port": "1234"
      },
      {
        "kind": "CronTab",
        "apiVersion": "example.com/v1",
        "metadata": {
          "creationTimestamp": "2019-09-03T13:02:01Z",
          "name": "remote-crontab",
          "resourceVersion": "12893",
          "uid": "359a83ec-b575-460d-b553-d859cedde8a0"
        },
        "host": "example.com",
        "port": "2345"
      }
    ]
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
If conversion fails, a webhook should return a `response` stanza containing the following fields:
* `uid`, copied from the `request.uid` sent to the webhook
* `result`, set to `{"status":"Failed"}`
-->
如果转换失败，则 Webhook 应该返回包含以下字段的 `response` 节：

* `uid`，从发送到 Webhook 的 `request.uid` 复制而来
* `result`，设置为 `{"status": "Failed"}`

{{< warning >}}
<!--
Failing conversion can disrupt read and write access to the custom resources,
including the ability to update or delete the resources. Conversion failures
should be avoided whenever possible, and should not be used to enforce validation
 constraints (use validation schemas or webhook admission instead).
-->
转换失败会破坏对定制资源的读写访问，包括更新或删除资源的能力。
转换失败应尽可能避免，并且不可用于实施合法性检查约束
（应改用验证模式或 Webhook 准入插件）。
{{< /warning >}}

<!--
Example of a response from a webhook indicating a conversion request failed, with an optional message:
-->
来自 Webhook 的响应示例，指示转换请求失败，并带有可选消息：

{{< tabs name="ConversionReview_response_failure" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "response": {
    "uid": "<value from request.uid>",
    "result": {
      "status": "Failed",
      "message": "hostPort could not be parsed into a separate host and port"
    }
  }
}
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
{
  # v1.16 中弃用以推荐使用 apiextensions.k8s.io/v1
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "response": {
    "uid": "<value from request.uid>",
    "result": {
      "status": "Failed",
      "message": "hostPort could not be parsed into a separate host and port"
    }
  }
}
```
{{% /tab %}}
{{< /tabs >}}

<!--
## Writing, reading, and updating versioned CustomResourceDefinition objects
-->
## 编写、读取和更新版本化的 CustomResourceDefinition 对象   {#write-read-and-update-versioned-crd-objects}

<!--
When an object is written, it is stored at the version designated as the
storage version at the time of the write. If the storage version changes,
existing objects are never converted automatically. However, newly-created
or updated objects are written at the new storage version. It is possible for an
object to have been written at a version that is no longer served.
-->
写入对象时，将存储为写入时指定的存储版本。如果存储版本发生变化，
现有对象永远不会被自动转换。然而，新创建或被更新的对象将以新的存储版本写入。
对象写入的版本不再被支持是有可能的。

<!--
When you read an object, you specify the version as part of the path.
You can request an object at any version that is currently served.
If you specify a version that is different from the object's stored version,
Kubernetes returns the object to you at the version you requested, but the
stored object is not changed on disk.
-->
当读取对象时，你需要在路径中指定版本。
你可以请求当前提供的任意版本的对象。
如果所指定的版本与对象的存储版本不同，Kubernetes 会按所请求的版本将对象返回，
但磁盘上存储的对象不会更改。

<!--
What happens to the object that is being returned while serving the read
request depends on what is specified in the CRD's `spec.conversion`:
-->
在为读取请求提供服务时正返回的对象会发生什么取决于 CRD 的 `spec.conversion` 中指定的内容：

<!--
- if the default `strategy` value `None` is specified, the only modifications
  to the object are changing the `apiVersion` string and perhaps [pruning
  unknown fields](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning)
  (depending on the configuration). Note that this is unlikely to lead to good
  results if the schemas differ between the storage and requested version.
  In particular, you should not use this strategy if the same data is
  represented in different fields between versions.
- if [webhook conversion](#webhook-conversion) is specified, then this
  mechanism controls the conversion.
-->
- 如果所指定的 `strategy` 值是默认的 `None`，则针对对象的唯一修改是更改其 `apiVersion` 字符串，
  并且可能[修剪未知字段](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning)（取决于配置）。
  请注意，如果存储和请求版本之间的模式不同，这不太可能导致好的结果。
  尤其是如果在相同的数据类不同版本中采用不同字段来表示时，不应使用此策略。
- 如果指定了 [Webhook 转换](#webhook-conversion)，则此机制将控制转换。

<!--
If you update an existing object, it is rewritten at the version that is
currently the storage version. This is the only way that objects can change from
one version to another.
-->
如果你更新一个现有对象，它将以当前的存储版本被重写。
这是可以将对象从一个版本改到另一个版本的唯一办法。

<!--
To illustrate this, consider the following hypothetical series of events:
-->
为了说明这一点，请考虑以下假设的一系列事件：

<!--
1. The storage version is `v1beta1`. You create an object. It is stored at version `v1beta1`
2. You add version `v1` to your CustomResourceDefinition and designate it as
   the storage version. Here the schemas for `v1` and `v1beta1` are identical,
   which is typically the case when promoting an API to stable in the
   Kubernetes ecosystem.
3. You read your object at version `v1beta1`, then you read the object again at
   version `v1`. Both returned objects are identical except for the apiVersion
   field.
4. You create a new object. It is stored at version `v1`. You now
   have two objects, one of which is at `v1beta1`, and the other of which is at
   `v1`.
5. You update the first object. It is now stored at version `v1` since that
   is the current storage version.
-->
1. 存储版本是 `v1beta1`。你创建一个对象。该对象以版本 `v1beta1` 存储。
2. 你将为 CustomResourceDefinition 添加版本 `v1`，并将其指定为存储版本。
   此处 `v1` 和 `v1beta1` 的模式是相同的，这通常是在 Kubernetes 生态系统中将 API 提升为稳定版时的情况。
3. 你使用版本 `v1beta1` 来读取你的对象，然后你再次用版本 `v1` 读取对象。
   除了 apiVersion 字段之外，返回的两个对象是完全相同的。
4. 你创建一个新对象。该对象存储为版本 `v1`。
   你现在有两个对象，其中一个是 `v1beta1`，另一个是 `v1`。
5. 你更新第一个对象。该对象现在以版本 `v1` 保存，因为 `v1` 是当前的存储版本。

<!--
### Previous storage versions
-->
### 以前的存储版本   {#previous-storage-versions}

<!--
The API server records each version which has ever been marked as the storage
version in the status field `storedVersions`. Objects may have been stored
at any version that has ever been designated as a storage version. No objects
can exist in storage at a version that has never been a storage version.
-->
API 服务器在状态字段 `storedVersions` 中记录曾被标记为存储版本的每个版本。
对象可能以任何曾被指定为存储版本的版本保存。
存储中不会出现从未成为存储版本的版本的对象。

<!--
## Upgrade existing objects to a new stored version
-->
## 将现有对象升级到新的存储版本     {#upgrade-existing-objects-to-a-new-stored-version}

<!--
When deprecating versions and dropping support, select a storage upgrade
procedure.
-->
弃用版本并删除其支持时，请选择存储升级过程。

<!--
*Option 1:* Use the Storage Version Migrator

1. Run the [storage Version migrator](https://github.com/kubernetes-sigs/kube-storage-version-migrator)
2. Remove the old version from the CustomResourceDefinition `status.storedVersions` field.
-->

**选项 1：** 使用存储版本迁移程序（Storage Version Migrator）

1. 运行[存储版本迁移程序](https://github.com/kubernetes-sigs/kube-storage-version-migrator)
2. 从 CustomResourceDefinition 的 `status.storedVersions` 字段中去掉老的版本。

<!--
*Option 2:* Manually upgrade the existing objects to a new stored version

The following is an example procedure to upgrade from `v1beta1` to `v1`.
-->
**选项 2：** 手动将现有对象升级到新的存储版本

以下是从 `v1beta1` 升级到 `v1` 的示例过程。

<!--
1. Set `v1` as the storage in the CustomResourceDefinition file and apply it
   using kubectl. The `storedVersions` is now `v1beta1, v1`.
2. Write an upgrade procedure to list all existing objects and write them with
   the same content. This forces the backend to write objects in the current
   storage version, which is `v1`.
3. Remove `v1beta1` from the CustomResourceDefinition `status.storedVersions` field.
-->
1. 在 CustomResourceDefinition 文件中将 `v1` 设置为存储版本，并使用 kubectl 应用它。
   `storedVersions`现在是 `v1beta1, v1`。
2. 编写升级过程以列出所有现有对象并使用相同内容将其写回存储。
   这会强制后端使用当前存储版本（即 `v1`）写入对象。
3. 从 CustomResourceDefinition 的 `status.storedVersions` 字段中删除 `v1beta1`。

{{< note >}}
<!--
The flag `--subresource` is used with the kubectl get, patch, edit, and replace commands to
fetch and update the subresources, `status` and `scale`, for all the API resources that
support them. This flag is available starting from kubectl version v1.24. Previously, reading
subresources (like `status`) via kubectl involved using `kubectl --raw`, and updating
subresources using kubectl was not possible at all. Starting from v1.24, the `kubectl` tool
can be used to edit or patch the `status` subresource on a CRD object. See [How to patch a Deployment using the subresource flag](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/#scale-kubectl-patch).
-->
`--subresource` 标志在 kubectl get、patch、edit 和 replace 命令中用于获取和更新所有支持它们的
API 资源的子资源、`status` 和 `scale`。此标志从 kubectl 版本 v1.24 开始可用。
以前通过 kubectl 读取子资源（如 `status`）涉及使用 `kubectl --raw`，并且根本不可能使用 kubectl 更新子资源。
从 v1.24 开始，`kubectl` 工具可用于编辑或修补有关 CRD 对象的 `status` 子资源。
请参阅[如何使用子资源标志修补 Deployment](/zh-cn/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/#scale-kubectl-patch)。

<!--
This page is part of the documentation for Kubernetes v{{< skew currentVersion >}}.
If you are running a different version of Kubernetes, consult the documentation for that release.

Here is an example of how to patch the `status` subresource for a CRD object using `kubectl`:
-->
此页面是 Kubernetes v{{< skew currentVersion >}} 文档的一部分。
如果你运行的是不同版本的 Kubernetes，请查阅相应版本的文档。

以下是如何使用 `kubectl` 为一个 CRD 对象修补 `status` 子资源的示例：

```bash
kubectl patch customresourcedefinitions <CRD_Name> --subresource='status' --type='merge' -p '{"status":{"storedVersions":["v1"]}}'
```
{{< /note >}}

