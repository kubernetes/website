---
title: 用户自定义资源的版本
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
[CustomResourceDefinitions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1beta1-apiextensions), to indicate the stability
level of your CustomResourceDefinitions or advance your API to a new version with conversion between API representations. It also describes how to upgrade an object from one version to another.
-->
本页介绍如何添加版本信息到
[CustomResourceDefinitions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1beta1-apiextensions)，
如何表示 CustomResourceDefinitions 的稳定水平或者用 API 之间的表征的转换提高您的 API 到一个新的版本。
本页还描述如何将对象从一个版本升级到另一个版本。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You should have a initial understanding of [custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
-->
你应该对[自定义资源](/zh/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
有一些初步了解。

{{< version-check >}}

<!-- steps -->

<!--
## Overview
-->
## 概览

<!--
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
CustomResourceDefinition API 提供了用于引入和升级的工作流程到 CustomResourceDefinition 的新版本。

创建 CustomResourceDefinition 时，会在 CustomResourceDefinition `spec.versions` 列表设置适当的稳定级和版本号。例如`v1beta1`表示第一个版本尚未稳定。所有自定义资源对象将首先存储在这个版本

创建 CustomResourceDefinition 后，客户端可以开始使用 v1beta1 API。

稍后可能需要添加新版本，例如 v1。

<!--
Adding a new version:

1. Pick a conversion strategy. Since custom resource objects need to be able to
   be served at both versions, that means they will sometimes be served at a
   different version than their storage version. In order for this to be
   possible, the custom resource objects must sometimes be converted between the
   version they are stored at and the version they are served at. If the
   conversion involves schema changes and requires custom logic, a conversion
   webhook should be used. If there are no schema changes, the default `None`
   conversion strategy may be used and only the `apiVersion` field will be
   modified when serving different versions.
2. If using conversion webhooks, create and deploy the conversion webhook. See
   the [Webhook conversion](#webhook-conversion) for more details.
3. Update the CustomResourceDefinition to include the new version in the
   `spec.versions` list with `served:true`.  Also, set `spec.conversion` field
   to the selected conversion strategy. If using a conversion webhook, configure
   `spec.conversion.webhookClientConfig` field to call the webhook.
-->
增加一个新版本：

1. 选择一种转化策略。由于自定义资源对象需要能够两种版本都可用，这意味着它们有时会以与存储版本不同的版本。为了能够做到这一点，
   有时必须在它们存储的版本和提供的版本。如果转换涉及结构变更，并且需要自定义逻辑，转换应该使用 webhook。如果没有结构变更，
   则使用 None 默认转换策略，不同版本时只有`apiVersion`字段有变更。
2. 如果使用转换 Webhook，请创建并部署转换 Webhook。希望看到更多详细信息，请参见 [Webhook conversion](#webhook转换)。
3. 更新 CustomResourceDefinition，来将新版本包含在具有`served：true`的 spec.versions 列表。另外，设置`spec.conversion`字段
   到所选的转换策略。如果使用转换 Webhook，请配置`spec.conversion.webhookClientConfig`来调用 webhook。

<!--
Once the new version is added, clients may incrementally migrate to the new
version. It is perfectly safe for some clients to use the old version while
others use the new version.

Migrate stored objects to the new version:

1. See the [upgrade existing objects to a new stored version](#upgrade-existing-objects-to-a-new-stored-version) section.

It is safe for clients to use both the old and new version before, during and
after upgrading the objects to a new stored version.
-->
添加新版本后，客户端可以逐步迁移到新版本。对于某些客户而言，在使用旧版本的同时支持其他人使用新版本。

将存储的对象迁移到新版本：

1. 请参阅 [将现有对象升级到新的存储版本](#将现有对象升级到新的存储版本) 章节。

对于客户来说，在将对象升级到新的存储版本之前，期间和之后使用旧版本和新版本都是安全的。

<!--
Removing an old version:

1. Ensure all clients are fully migrated to the new version. The kube-apiserver
   logs can reviewed to help identify any clients that are still accessing via
   the old version.
1. Set `served` to `false` for the old version in the `spec.versions` list. If
   any clients are still unexpectedly using the old version they may begin reporting
   errors attempting to access the custom resource objects at the old version.
   If this occurs, switch back to using `served:true` on the old version, migrate the 
   remaining clients to the new version and repeat this step.
1. Ensure the [upgrade of existing objects to the new stored version](#upgrade-existing-objects-to-a-new-stored-version) step has been completed.
    1. Verify that the `stored` is set to `true` for the new version in the `spec.versions` list in the CustomResourceDefinition.
    1. Verify that the old version is no longer listed in the CustomResourceDefinition `status.storedVersions`.
1. Remove the old version from the CustomResourceDefinition `spec.versions` list.
1. Drop conversion support for the old version in conversion webhooks.
-->
删除旧版本：

1. 确保所有客户端都已完全迁移到新版本。kube-apiserver 可以查看日志以帮助识别仍通过进行访问的所有客户端旧版本。
2. 在`spec.versions`列表中将旧版本的 served 设置为 false。如果任何客户端仍然意外地使用他们可能开始报告的旧版本尝试访问旧版本的自定义资源对象时出错。
   如果发生这种情况，请切换回在旧版本上使用`served：true`，然后迁移其他客户使用新版本，然后重复此步骤。
3. 确保已完成 [将现有对象升级到新存储版本](#将现有对象升级到新的存储版本) 的步骤。
    1. 在 CustomResourceDefinition 的`spec.versions`列表中，确认新版本的`stored`已设置为`true`。
    2. 确认旧版本不再列在 CustomResourceDefinition `status.storedVersions`。
4. 从 CustomResourceDefinition`spec.versions` 列表中删除旧版本。
5. 在转换 webhooks 中放弃对旧版本的转换支持。

<!--
## Specify multiple versions

The CustomResourceDefinition API `versions` field can be used to support multiple versions of custom resources that you
have developed. Versions can have different schemas, and conversion webhooks can convert custom resources between versions.
Webhook conversions should follow the [Kubernetes API conventions](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md) wherever applicable.
Specifically, See the [API change documentation](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md) for a set of useful gotchas and suggestions.
-->
## 指定多个版本  {#specify-multiple-versions}

CustomResourceDefinition API 的`versions`字段可用于支持您自定义资源的多个版本已经开发的。版本可以具有不同的架构，并且转换 Webhooks 可以在版本之间转换自定义资源。
在适用的情况下，Webhook 转换应遵循 [Kubernetes API](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md)。

<!--
In `apiextensions.k8s.io/v1beta1`, there was a `version` field instead of `versions`. The
`version` field is deprecated and optional, but if it is not empty, it must
match the first item in the `versions` field.
-->
{{< note >}}
在 `apiextensions.k8s.io/v1beta1` 版本中，有一个 `version` 字段，名字不叫做 `versions`。
`version` 字段已经被废弃，成为可选项。不过如果该字段不是空，则必须与
`versions` 字段中的第一个条目匹配。
{{< /note >}}

<!--
This example shows a CustomResourceDefinition with two versions. For the first
example, the assumption is all versions share the same schema with no conversion
between them. The comments in the YAML provide more context.
-->
此示例显示了两个版本的 CustomResourceDefinition。第一个例子，假设所有的版本共享相同的模式而它们之间没有转换。YAML 中的评论提供了更多背景信息。

{{< tabs name="CustomResourceDefinition_versioning_example_1" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # name must match the spec fields below, and be in the form: <plural>.<group>
  name: crontabs.example.com
spec:
  # group name to use for REST API: /apis/<group>/<version>
  group: example.com
  # list of versions supported by this CustomResourceDefinition
  versions:
  - name: v1beta1
    # Each version can be enabled/disabled by Served flag.
    served: true
    # One and only one version must be marked as the storage version.
    storage: true
    # A schema is required
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
  # The conversion section is introduced in Kubernetes 1.13+ with a default value of
  # None conversion (strategy sub-field set to None).
  conversion:
    # None conversion assumes the same schema for all versions and only sets the apiVersion
    # field of custom resources to the proper value
    strategy: None
  # either Namespaced or Cluster
  scope: Namespaced
  names:
    # plural name to be used in the URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # singular name to be used as an alias on the CLI and for display
    singular: crontab
    # kind is normally the CamelCased singular type. Your resource manifests use this.
    kind: CronTab
    # shortNames allow shorter string to match your resource on the CLI
    shortNames:
    - ct
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # name must match the spec fields below, and be in the form: <plural>.<group>
  name: crontabs.example.com
spec:
  # group name to use for REST API: /apis/<group>/<version>
  group: example.com
  # list of versions supported by this CustomResourceDefinition
  versions:
  - name: v1beta1
    # Each version can be enabled/disabled by Served flag.
    served: true
    # One and only one version must be marked as the storage version.
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
  # The conversion section is introduced in Kubernetes 1.13+ with a default value of
  # None conversion (strategy sub-field set to None).
  conversion:
    # None conversion assumes the same schema for all versions and only sets the apiVersion
    # field of custom resources to the proper value
    strategy: None
  # either Namespaced or Cluster
  scope: Namespaced
  names:
    # plural name to be used in the URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # singular name to be used as an alias on the CLI and for display
    singular: crontab
    # kind is normally the CamelCased singular type. Your resource manifests use this.
    kind: CronTab
    # shortNames allow shorter string to match your resource on the CLI
    shortNames:
    - ct
```
{{% /tab %}}
{{< /tabs >}}

<!--
You can save the CustomResourceDefinition in a YAML file, then use
`kubectl apply` to create it.
-->
你可以将 CustomResourceDefinition 存储在 YAML 文件中，然后使用`kubectl apply`来创建它。

```shell
kubectl apply -f my-versioned-crontab.yaml
```

<!--
After creation, the API server starts to serve each enabled version at an HTTP
REST endpoint. In the above example, the API versions are available at
`/apis/example.com/v1beta1` and `/apis/example.com/v1`.
-->
在创建之后，apiserver 开始在 HTTP REST 端点上为每个启用的版本提供服务。
在上面的示例中，API 版本可以在`/apis/example.com/v1beta1` 和 `/apis/example.com/v1`中获得。

<!--
### Version priority

Regardless of the order in which versions are defined in a
CustomResourceDefinition, the version with the highest priority is used by
kubectl as the default version to access objects. The priority is determined
by parsing the _name_ field to determine the version number, the stability
(GA, Beta, or Alpha), and the sequence within that stability level.
-->
### 版本优先级

不考虑 CustomResourceDefinition 中版本被定义的顺序，kubectl 使用具有最高优先级的版本作为访问对象的默认版本。
通过解析 _name_ 字段确定优先级来决定版本号，稳定性（GA，Beta，或者 Alpha），以及该稳定性水平内的序列。

<!--
The algorithm used for sorting the versions is designed to sort versions in the
same way that the Kubernetes project sorts Kubernetes versions. Versions start with a
`v` followed by a number, an optional `beta` or `alpha` designation, and
optional additional numeric versioning information. Broadly, a version string might look
like `v2` or `v2beta1`. Versions are sorted using the following algorithm:
-->
用于对版本进行排序的算法被设计成与 Kubernetes 项目对 Kubernetes 版本进行排序的方式相同。
版本以`v`开头跟一个数字，一个可选的`beta` 或者 `alpha`命名，和一个可选的附加的数字型的版本信息。
从广义上讲，版本字符串可能看起来像`v2`或者`v2beta1`。
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
- 如果字符串 `beta` 或 `alpha` 跟随第一数字部分，它们按顺序排序，在没有 `beta` 或 `alpha`
  后缀（假定为 GA 版本）的等效字符串后面。
- 如果另一个数字跟在`beta`或`alpha`之后，那么这些数字也是从最大到最小排序。
- 不符合上述格式的字符串按字母顺序排序，数字部分不经过特殊处理。
  请注意，在下面的示例中，`foo1`在 `foo10`上方排序。这与遵循 Kubernetes 版本模式的条目的数字部分排序不同。

<!--
This might make sense if you look at the following sorted version list:
-->
如果查看以下排序版本列表可以明白：

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
对于 [指定多个版本](#specify-multiple-versions) 中的示例，版本排序顺序为 `v1`，后跟着 `v1beta1`。
这导致了 kubectl 命令使用 `v1` 作为默认版本，除非提供对象指定版本。

<!--
## Webhook conversion

Webhook conversion is available as beta since 1.15, and as alpha since Kubernetes 1.13. The
`CustomResourceWebhookConversion` feature should be enabled. Please refer to the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) documentation for more information.
-->
## Webhook转换

{{< feature-state state="stable" for_k8s_version="v1.16" >}}

{{< note >}}
Webhook 转换在 Kubernetes 1.15 中作为 beta 功能。
要使用它，应启用`CustomResourceWebhookConversion`功能。
在大多数集群上，这类 beta 特性应该时自动启用的。
请参阅[特行门控](/zh/docs/reference/command-line-tools-reference/feature-gates/) 文档以获得更多信息。
{{< /note >}}

<!--
The above example has a None conversion between versions which only sets the `apiVersion` field
on conversion and does not change the rest of the object. The API server also supports webhook
conversions that call an external service in case a conversion is required. For example when:
-->
上面的例子在版本之间有一个 None 转换，它只在转换时设置`apiVersion`字段而不改变对象的其余部分。apiserver 还支持在需要转换时调用外部服务的 webhook 转换。例如：

<!--
* custom resource is requested in a different version than stored version.
* Watch is created in one version but the changed object is stored in another version.
* custom resource PUT request is in a different version than storage version.
-->
* 自定义资源被要求在一个不同的版本里而不是一个存储的版本里。
* Watch 在一个版本中创建，但更改对象存储在另一个版本中。
* 自定义资源 PUT 请求在一个不同的版本里而不是一个存储的版本。

<!--
To cover all of these cases and to optimize conversion by the API server, the conversion requests may contain multiple objects in order to minimize the external calls. The webhook should perform these conversions independently.
-->
为了涵盖所有这些情况并通过 API 服务优化转换，转换对象可能包含多个对象，以便最大限度地减少外部调用。webhook 应该独立执行这些转换。

<!--
### Write a conversion webhook server

Please refer to the implementation of the [custom resource conversion webhook
server](https://github.com/kubernetes/kubernetes/tree/v1.15.0/test/images/crd-conversion-webhook/main.go)
that is validated in a Kubernetes e2e test. The webhook handles the
`ConversionReview` requests sent by the API servers, and sends back conversion
results wrapped in `ConversionResponse`. Note that the request
contains a list of custom resources that need to be converted independently without
changing the order of objects.
The example server is organized in a way to be reused for other conversions. Most of the common code are located in the [framework file](https://github.com/kubernetes/kubernetes/tree/v1.15.0/test/images/crd-conversion-webhook/converter/framework.go) that leaves only [one function](https://github.com/kubernetes/kubernetes/blob/v1.15.0/test/images/crd-conversion-webhook/converter/example_converter.go#L29-L80) to be implemented for different conversions.
-->
### 编写一个转换 Webhook 服务器

请参考[自定义资源转换 webhook 服务](https://github.com/kubernetes/kubernetes/tree/v1.15.0/test/images/crd-conversion-webhook/main.go) 的实施，这在 Kubernetes e2e 测试中得到验证。webhook 处理由 apiserver 发送的`ConversionReview`请求，并发送回包含在`ConversionResponse`中的转换结果。请注意，请求包含需要独立转换不改变对象顺序的自定义资源列表。示例服务器的组织方式使其可以重用于其他转换。大多数常见代码都位于 [框架文件](https://github.com/kubernetes/kubernetes/tree/v1.14.0/test/images/crd-conversion-webhook/converter/framework.go) 中，只留下 [示例](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/images/crd-conversion-webhook/converter/example_converter.go#L29-L80) 用于实施不同的转换。

<!--
The example conversion webhook server leaves the `ClientAuth` field
[empty](https://github.com/kubernetes/kubernetes/tree/v1.13.0/test/images/crd-conversion-webhook/config.go#L47-L48),
which defaults to `NoClientCert`. This means that the webhook server does not
authenticate the identity of the clients, supposedly API servers. If you need
mutual TLS or other ways to authenticate the clients, see
how to [authenticate API servers](/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers).
-->
{{< note >}}
示例转换 webhook 服务器留下`ClientAuth`字段为
[空](https://github.com/kubernetes/kubernetes/tree/v1.13.0/test/images/crd-conversion-webhook/config.go#L47-L48)，
默认为`NoClientCert`。

这意味着 webhook 服务器没有验证客户端的身份，据称是 apiserver。

如果您需要相互 TLS 或者其他方式来验证客户端，请参阅如何
[验证 API 服务](/zh/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers)。
{{< /note >}}

<!--
### Deploy the conversion webhook service

Documentation for deploying the conversion webhook is the same as for the [admission webhook example service](/docs/reference/access-authn-authz/extensible-admission-controllers/#deploy_the_admission_webhook_service).
The assumption for next sections is that the conversion webhook server is deployed to a service named `example-conversion-webhook-server` in `default` namespace and serving traffic on path `/crdconvert`.
-->
### 部署转换 Webhook 服务

用于部署转换 webhook 的文档与
[准入webhook示例服务](/zh/docs/reference/access-authn-authz/extensible-admission-controllers/#deploy_the_admission_webhook_service)。
下一节的假设是转换 webhook 服务器部署到`default`命名空间中名为`example-conversion-webhook-server`的服务器上，并在路径`/crdconvert`上提供流量。

<!--
When the webhook server is deployed into the Kubernetes cluster as a
service, it has to be exposed via a service on port 443 (The server
itself can have an arbitrary port but the service object should map it to port 443).
The communication between the API server and the webhook service may fail
if a different port is used for the service.
-->
{{< note >}}
当 webhook 服务器作为一个部署到 Kubernetes 集群中的服务器时，它必须通过端口443上的服务器公开(服务器本身可以有一个任意端口，但是服务器对象应该将它映射到端口443)。
如果为服务器使用不同的端口，则 apiserver 和 webhook 服务器之间的通信可能会失败。
{{< /note >}}

<!--
### Configure CustomResourceDefinition to use conversion webhooks

The `None` conversion example can be extended to use the conversion webhook by modifying `conversion`
section of the `spec`:
-->
### 配置 CustomResourceDefinition 以使用转换 Webhook

通过修改 `spec` 中的 `conversion` 部分，可以扩展 `None` 转换示例来使用转换 webhook。

{{< tabs name="CustomResourceDefinition_versioning_example_2" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # name must match the spec fields below, and be in the form: <plural>.<group>
  name: crontabs.example.com
spec:
  # group name to use for REST API: /apis/<group>/<version>
  group: example.com
  # list of versions supported by this CustomResourceDefinition
  versions:
  - name: v1beta1
    # Each version can be enabled/disabled by Served flag.
    served: true
    # One and only one version must be marked as the storage version.
    storage: true
    # Each version can define it's own schema when there is no top-level
    # schema is defined.
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
    # a Webhook strategy instruct API server to call an external webhook for any conversion between custom resources.
    strategy: Webhook
    # webhook is required when strategy is `Webhook` and it configures the webhook endpoint to be called by API server.
    webhook:
      # conversionReviewVersions indicates what ConversionReview versions are understood/preferred by the webhook.
      # The first version in the list understood by the API server is sent to the webhook.
      # The webhook must respond with a ConversionReview object in the same version it received.
      conversionReviewVersions: ["v1","v1beta1"]
      clientConfig:
        service:
          namespace: default
          name: example-conversion-webhook-server
          path: /crdconvert
        caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
  # either Namespaced or Cluster
  scope: Namespaced
  names:
    # plural name to be used in the URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # singular name to be used as an alias on the CLI and for display
    singular: crontab
    # kind is normally the CamelCased singular type. Your resource manifests use this.
    kind: CronTab
    # shortNames allow shorter string to match your resource on the CLI
    shortNames:
    - ct
```
{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of apiextensions.k8s.io/v1
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # name must match the spec fields below, and be in the form: <plural>.<group>
  name: crontabs.example.com
spec:
  # group name to use for REST API: /apis/<group>/<version>
  group: example.com
  # prunes object fields that are not specified in OpenAPI schemas below.
  preserveUnknownFields: false
  # list of versions supported by this CustomResourceDefinition
  versions:
  - name: v1beta1
    # Each version can be enabled/disabled by Served flag.
    served: true
    # One and only one version must be marked as the storage version.
    storage: true
    # Each version can define it's own schema when there is no top-level
    # schema is defined.
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
    # a Webhook strategy instruct API server to call an external webhook for any conversion between custom resources.
    strategy: Webhook
    # webhookClientConfig is required when strategy is `Webhook` and it configures the webhook endpoint to be called by API server.
    webhookClientConfig:
      service:
        namespace: default
        name: example-conversion-webhook-server
        path: /crdconvert
      caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
  # either Namespaced or Cluster
  scope: Namespaced
  names:
    # plural name to be used in the URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # singular name to be used as an alias on the CLI and for display
    singular: crontab
    # kind is normally the CamelCased singular type. Your resource manifests use this.
    kind: CronTab
    # shortNames allow shorter string to match your resource on the CLI
    shortNames:
    - ct
```
{{% /tab %}}
{{< /tabs >}}

<!--
You can save the CustomResourceDefinition in a YAML file, then use
`kubectl apply` to apply it.
-->
您可以将 CustomResourceDefinition 保存在 YAML 文件中，然后使用`kubectl apply`来应用它。

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
### 调用 Webhook

apiserver 一旦确定请求应发送到转换 webhook，它需要知道如何调用 webhook。这是在`webhookClientConfig`中指定的 webhook 配置。

转换 webhook 可以通过调用 URL 或服务，并且可以选择包含自定义 CA 包，以用于验证 TLS 连接。

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
webhook. Such installs are likely to be non-portable, i.e., not easy
to turn up in a new cluster.
-->

url 以标准 URL 形式给出 webhook 的位置（`scheme://host:port/path`）。
`host`不应引用集群中运行的服务；采用通过指定`service`字段来提供服务引用。
`host`可以通过某些 apiserver 中的外部 DNS 进行解析（即`kube-apiserver`无法解析集群内 DNS 违反分层规则）。主机也可以是 IP 地址。

请注意，除非您非常小心在所有主机上运行此 Webhook，否则 localhost 或 127.0.0.1 用作主机是风险很大的，运行一个 apiserver 可能需要对此进行调用
 webhook。这样的安装很可能是不可移植的，即不容易出现在新集群中。

<!--
The scheme must be "https"; the URL must begin with "https://".

Attempting to use a user or basic auth e.g. "user:password@" is not allowed.
Fragments ("#...") and query parameters ("?...") are also not allowed.

Here is an example of a conversion webhook configured to call a URL
(and expects the TLS certificate to be verified using system trust roots, so does not specify a caBundle):
-->

方案必须为`https`：URL 必须以`https://`开头。

尝试使用用户或基本身份验证，例如不允许使用`user:password@`。片段（`#...`）和查询参数（`?...`）也不允许。

这是配置为调用 URL 的转换 Webhook 的示例（并且期望使用系统信任根来验证 TLS 证书，因此不指定 caBundle）：

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
# Deprecated in v1.16 in favor of apiextensions.k8s.io/v1
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
### 服务引用

`webhookClientConfig`内部的`service`段是对转换 webhook 服务的引用。如果 Webhook 在集群中运行，则应使用`service`而不是`url`。
服务名称空间和名称是必需的。端口是可选的，默认为 443。该路径是可选的，默认为`/`。

这是一个配置为在端口`1234`上调用服务的 Webhook 的示例在子路径`/my-path`下，并针对 ServerName 验证 TLS 连接
使用自定义 CA 捆绑包的`my-service-name.my-service-namespace.svc`。

{{< tabs name="CustomResourceDefinition_versioning_example_4" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
apiVersion: apiextensions.k8s.io/v1b
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
# Deprecated in v1.16 in favor of apiextensions.k8s.io/v1
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
## Webhook 请求和响应

### 请求

向 Webhooks 发送 POST 请求，请求的内容类型为：application/json，与 APIapitensions.k8s.io API 组中的 ConversionReview API 对象一起使用序列化为 JSON 作为主体。

Webhooks 可以指定他们接受的`ConversionReview`对象的版本在其 CustomResourceDefinition 中使用`conversionReviewVersions`字段：

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

创建时，`conversionReviewVersions`是必填字段`apiextensions.k8s.io/v1`自定义资源定义。
需要 Webhooks 支持至少一个`ConversionReview`当前和以前的 apiserver 可以理解的版本。

{{% /tab %}}
{{% tab name="apiextensions.k8s.io/v1beta1" %}}
```yaml
# Deprecated in v1.16 in favor of apiextensions.k8s.io/v1
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

如果未指定`conversionReviewVersions`，则创建时的默认值 apiextensions.k8s.io/v1beta1 自定义资源定义为 v1beta1。
{{% /tab %}}
{{< /tabs >}}

API servers send the first `ConversionReview` version in the `conversionReviewVersions` list they support.
If none of the versions in the list are supported by the API server, the custom resource definition will not be allowed to be created.
If an API server encounters a conversion webhook configuration that was previously created and does not support any of the `ConversionReview`
versions the API server knows how to send, attempts to call to the webhook will fail.

<!--
This example shows the data contained in an `ConversionReview` object
for a request to convert `CronTab` objects to `example.com/v1`:
-->

此示例显示了包含在`ConversionReview`对象中的数据请求将`CronTab`对象转换为`example.com/v1`：

{{< tabs name="ConversionReview_request" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "request": {
    # Random uid uniquely identifying this conversion call
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    
    # The API group and version the objects should be converted to
    "desiredAPIVersion": "example.com/v1",
    
    # The list of objects to convert.
    # May contain one or more objects, in one or more versions.
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
  # Deprecated in v1.16 in favor of apiextensions.k8s.io/v1
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "request": {
    # Random uid uniquely identifying this conversion call
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    
    # The API group and version the objects should be converted to
    "desiredAPIVersion": "example.com/v1",
    
    # The list of objects to convert.
    # May contain one or more objects, in one or more versions.
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
* `convertedObjects`, containing all of the objects from `request.objects`, converted to `request.desiredVersion`

Example of a minimal successful response from a webhook:
-->
### 响应

Webhooks 响应是以 200 HTTP 状态代码，`Content-Type:application/json`，和包含 ConversionReview 对象的主体（与发送的版本相同），
带有`response`节的序列，并序列化为 JSON。

如果转换成功，则 Webhook 应该返回包含以下字段的`response`节：
* `uid`，从发送到 webhook 的`request.uid`复制而来
* `result`，设置为`{"status":"Success"}}`
* `convertedObjects`，包含来自`request.objects`的所有对象，转换为`request.desiredVersion`

Webhook 的最简单成功响应示例：

{{< tabs name="ConversionReview_response_success" >}}
{{% tab name="apiextensions.k8s.io/v1" %}}
```yaml
{
  "apiVersion": "apiextensions.k8s.io/v1",
  "kind": "ConversionReview",
  "response": {
    # must match <request.uid>
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    "result": {
      "status": "Success"
    },
    # Objects must match the order of request.objects, and have apiVersion set to <request.desiredAPIVersion>.
    # kind, metadata.uid, metadata.name, and metadata.namespace fields must not be changed by the webhook.
    # metadata.labels and metadata.annotations fields may be changed by the webhook.
    # All other changes to metadata fields by the webhook are ignored.
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
  # Deprecated in v1.16 in favor of apiextensions.k8s.io/v1
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "kind": "ConversionReview",
  "response": {
    # must match <request.uid>
    "uid": "705ab4f5-6393-11e8-b7cc-42010a800002",
    "result": {
      "status": "Failed"
    },
    # Objects must match the order of request.objects, and have apiVersion set to <request.desiredAPIVersion>.
    # kind, metadata.uid, metadata.name, and metadata.namespace fields must not be changed by the webhook.
    # metadata.labels and metadata.annotations fields may be changed by the webhook.
    # All other changes to metadata fields by the webhook are ignored.
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

如果转换失败，则 Webhook 应该返回包含以下字段的`response`节：
*`uid`，从发送到 webhook 的`request.uid`复制而来
*`result`，设置为`{"status":"Failed"}`

{{< warning >}}
<!--
Failing conversion can disrupt read and write access to the custom resources,
including the ability to update or delete the resources. Conversion failures 
should be avoided whenever possible, and should not be used to enforce validation
 constraints (use validation schemas or webhook admission instead).
-->

转换失败会破坏对自定义资源的读写访问，包括更新或删除资源的能力。转换失败应尽可能避免使用，并且不应用于强制验证
 约束（改用验证模式 或 Webhook admission）。
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
  # Deprecated in v1.16 in favor of apiextensions.k8s.io/v1
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
## 编写、读取和更新版本化的 CustomResourceDefinition 对象

<!--
When an object is written, it is persisted at the version designated as the
storage version at the time of the write. If the storage version changes,
existing objects are never converted automatically. However, newly-created
or updated objects are written at the new storage version. It is possible for an
object to have been written at a version that is no longer served.
-->

写入对象时，它将保留在写入时指定为存储版本的版本中。如果存储版本发生变化，现有对象永远不会自动转换。然而，新创建或更新的对象将在新的存储版本中编写。对象可能已在不再被服务的版本中编写。

<!--
When you read an object, you specify the version as part of the path. If you
specify a version that is different from the object's persisted version,
Kubernetes returns the object to you at the version you requested, but the
persisted object is neither changed on disk, nor converted in any way
(other than changing the `apiVersion` string) while serving the request.
You can request an object at any version that is currently served.
-->

当读取对象时，将版本指定为路径的一部分。
如果指定的版本与对象的持久版本不同，Kubernetes 会在您请求的版本里将对象返还给您，但是在提供请求时，持久化对象既不会在磁盘上更改，也不会以任何方式进行转换（除了更改`apiVersion`字符串）。您可以在当前提供的任何版本中请求对象。

<!--
If you update an existing object, it is rewritten at the version that is
currently the storage version. This is the only way that objects can change from
one version to another.
-->
如果您更新了一个现有对象，它将在现在的存储版本中被重写。
这是对象可以从一个版本改到另一个版本的唯一办法。

<!--
To illustrate this, consider the following hypothetical series of events:
-->
为了说明这一点，请考虑以下假设的一系列事件：

<!--
1.  The storage version is `v1beta1`. You create an object. It is persisted in
    storage at version `v1beta1`
2.  You add version `v1` to your CustomResourceDefinition and designate it as
    the storage version.
3.  You read your object at version `v1beta1`, then you read the object again at
    version `v1`. Both returned objects are identical except for the apiVersion
    field.
4.  You create a new object. It is persisted in storage at version `v1`. You now
    have two objects, one of which is at `v1beta1`, and the other of which is at
    `v1`.
5.  You update the first object. It is now persisted at version `v1` since that
    is the current storage version.
-->
1.  存储版本是`v1beta1`。
    它保存在版本`v1beta1`的存储中。
2.  您将版本`v1`添加到 CustomResourceDefinition 中，并将其指定为存储版本。
3.  您在版本`v1beta1`中读取您的对象，然后您再次在版本`v1`中读取对象。
    除了 apiVersion 字段之外，两个返回的对象都是相同的。
4.  您创建一个新对象。
    它存储在版本`v1`的存储中。
    您现在有两个对象，其中一个位于`v1beta1`，另一个位于`v1`。
5.  您更新第一个对象。
    它现在保存在版本`v1`中，因为那是当前的存储版本。

<!--
### Previous storage versions
-->
### 以前的存储版本

<!--
The API server records each version which has ever been marked as the storage
version in the status field `storedVersions`. Objects may have been persisted
at any version that has ever been designated as a storage version. No objects
can exist in storage at a version that has never been a storage version.
-->
API 服务在状态字段`storedVersions`中记录曾被标记为存储版本的每个版本。
对象可能已被保留在任何曾被指定为存储版本的版本中。
从未成为存储版本的版本的存储中不能存在任何对象。

<!--
## Upgrade existing objects to a new stored version
-->
## 将现有对象升级到新的存储版本

<!--
When deprecating versions and dropping support, devise a storage upgrade
procedure. The following is an example procedure to upgrade from `v1beta1`
to `v1`.
-->
弃用版本并删除支持时，请设计存储升级过程。
以下是从`v1beta1`升级到`v1`的示例过程。

<!--
1.  Set `v1` as the storage in the CustomResourceDefinition file and apply it
    using kubectl. The `storedVersions` is now `v1beta1, v1`.
2.  Write an upgrade procedure to list all existing objects and write them with
    the same content. This forces the backend to write objects in the current
    storage version, which is `v1`.
3.  Update the CustomResourceDefinition `Status` by removing `v1beta1` from
    `storedVersions` field.
-->
1.  将`v1`设置为 CustomResourceDefinition 文件中的存储，并使用 kubectl 应用它。
    `storedVersions`现在是`v1beta1、 v1`。
2.  编写升级过程以列出所有现有对象并使用相同内容编写它们。
    这会强制后端在当前存储版本中写入对象，即`v1`。
3.  通过从`storedVersions`字段中删除`v1beta1`来更新 CustomResourceDefinition`Status`。 


