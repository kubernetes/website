---
title: CustomResourceDefinitions 的版本
reviewers:
- mbohlool
- sttts
- liggitt
content_template: templates/task
weight: 30
---
<!--
---
title: Versions of CustomResourceDefinitions
reviewers:
- mbohlool
- sttts
- liggitt
content_template: templates/task
weight: 30
---
-->

{{% capture overview %}}
<!--
This page explains how to add versioning information to
[CustomResourceDefinitions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1beta1-apiextensions), to indicate the stability
level of your CustomResourceDefinitions or advance your API to a new version with conversion between API representations. It also describes how to upgrade an object from one version to another.
-->
本页介绍了如何添加版本信息到[CustomResourceDefinitions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1beta1-apiextensions)，如何表示 CustomResourceDefinitions 的稳定水平或者用 API 之间的表征的转换提高您的 API 到一个新的版本。它还描述了如何将对象从一个版本升级到另一个版本。

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* Make sure your Kubernetes cluster has a master version of 1.11.0 or higher.
-->
* 确保您的 Kubernetes 集群的主版本为1.11.0或更高版本。

<!--
* Read about [custom resources](/docs/concepts/api-extension/custom-resources/).
-->
* 阅读[自定义资源](/docs/concepts/api-extension/custom-resources/)。

{{% /capture %}}

{{% capture steps %}}

<!--
## Overview
-->
## 概览

<!--
The CustomResourceDefinition API supports a `versions` field that you can use to
support multiple versions of custom resources that you have developed. Versions
can have different schemas with a conversion webhook to convert custom resources between versions.
Webhook conversions should follow the [Kubernetes API conventions](https://github.com/kubernetes/community/blob/master/contributors/devel/api-conventions.md) wherever applicable.
Specifically, See the [API change documentation](https://github.com/kubernetes/community/blob/master/contributors/devel/api_changes.md) for a set of useful gotchas and suggestions.
-->
CustomResourceDefinition API 支持您使用`versions`字段来开发多个版本的自定义资源。
版本可以有不同的模式与转换 webhook 在版本之间转换自定义资源。
Webhook 转换应遵循适用的[Kubernetes API 约定](https://github.com/kubernetes/community/blob/master/contributors/devel/api-conventions.md)。
具体来说，请参阅 [API 更改文档](https://github.com/kubernetes/community/blob/master/contributors/devel/api_changes.md)以获取一组有用的问题和建议。

<!--
Earlier iterations included a `version` field instead of `versions`. The
`version` field is deprecated and optional, but if it is not empty, it must
match the first item in the `versions` field.
-->
{{< note >}}
早期的迭代包括 `version` 字段而不是`versions`。
`version` 字段已弃用且可选，但如果它不为空，则必须必配`versions` 字段中的第一项。
{{< /note >}}

<!--
## Specify multiple versions
-->
## 指定多个版本

<!--
This example shows a CustomResourceDefinition with two versions. For the first
example, the assumption is all versions share the same schema with no conversion
between them. The comments in the YAML provide more context.
-->
此示例显示了两个版本的 CustomResourceDefinition。第一个例子，假设所有的版本共享相同的模式而它们之间没有转换。YAML 中的评论提供了更多背景信息。

```yaml
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
在创建之后，API 服务器开始在 HTTP REST 端点上为每个启用的版本提供服务。在上面的示例中，API 版本可以在`/apis/example.com/v1beta1` 和 `/apis/example.com/v1`中获得。

<!--
### Version priority
-->
### 版本优先级

<!--
Regardless of the order in which versions are defined in a
CustomResourceDefinition, the version with the highest priority is used by
kubectl as the default version to access objects. The priority is determined
by parsing the _name_ field to determine the version number, the stability
(GA, Beta, or Alpha), and the sequence within that stability level.
-->
不考虑 CustomResourceDefinition 中版本被定义的顺序，kubectl 使用具有最高优先级的版本作为访问对象的默认版本。
通过解析_name_字段确定优先级来决定版本号，稳定性(GA, Beta, 或者 Alpha)，以及该稳定性水平内的序列。

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
- 如果字符串`beta` 或 `alpha`跟随第一数字部分，它们按顺序排序，在没有`beta` 或 `alpha`后缀（假定为 GA 版本）的等效字符串后面。
- 如果另一个数字跟在`beta`或`alpha`之后，那么这些数字也是从最大到最小排序。
- 不符合上述格式的字符串按字母顺序排序，数字部分不经过特殊处理。请注意，在下面的示例中，`foo1`在 `foo10`上方排序。这与遵循 Kubernetes 版本模式的条目的数字部分排序不同。

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
对于 [指定多个版本](#specify-multiple-versions)中的示例，版本排序顺序为`v1`，后跟着`v1beta1`。
这导致了 kubectl 命令使用`v1`作为默认版本，除非提供对象指定版本。

<!--
## Webhook conversion
-->
## Webhook 转换

<!--
Webhook conversion is introduced in Kubernetes 1.13 as an alpha feature. To use it, the
`CustomResourceWebhookConversion` feature should be enabled. Please refer to the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) documentation for more information.
-->
{{< note >}}
Webhook 转换在 Kubernetes 1.13中作为 alpha 功能引入。要使用它，应启用`CustomResourceWebhookConversion`功能。 请参阅 [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) 文档以获得更多信息。
{{< /note >}}

<!--
The above example has a None conversion between versions which only sets the `apiVersion` field
on conversion and does not change the rest of the object. The API server also supports webhook
conversions that call an external service in case a conversion is required. For example when:
-->
上面的例子在版本之间有一个 None 转换，它只在转换时设置`apiVersion`字段而不改变对象的其余部分。API 服务器还支持在需要转换时调用外部服务的 webhook 转换。例如：

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
为了涵盖所有这些情况并通过 API 服务器优化转换，转换对象可能包含多个对象，以便最大限度地减少外部调用。webhook 应该独立执行这些转换。

<!--
### Write a conversion webhook server
-->
### 编写一个 webhook 服务器的转换

<!--
Please refer to the implementation of the [custom resource conversion webhook
server](https://github.com/kubernetes/kubernetes/tree/v1.13.0/test/images/crd-conversion-webhook/main.go)
that is validated in a Kubernetes e2e test. The webhook handles the
`ConversionReview` requests sent by the API servers, and sends back conversion
results wrapped in `ConversionResponse`. Note that the request
contains a list of custom resources that need to be converted independently without
changing the order of objects.
The example server is organized in a way to be reused for other conversions. Most of the common code are located in the [framework file](https://github.com/kubernetes/kubernetes/tree/v1.14.0/test/images/crd-conversion-webhook/converter/framework.go) that leaves only [one function](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/images/crd-conversion-webhook/converter/example_converter.go#L29-L80) to be implemented for different conversions.
-->
请参考[自定义资源转换 webhook
服务器](https://github.com/kubernetes/kubernetes/tree/v1.13.0/test/images/crd-conversion-webhook/main.go)的实施，这在Kubernetes e2e测试中得到验证。
webhook 处理由 API 服务器发送的`ConversionReview`请求，并发送回包含在`ConversionResponse`中的转换结果。
请注意，请求包含需要独立转换不改变对象顺序的自定义资源列表。
示例服务器的组织方式使其可以重用于其他转换。
大多数常见代码都位于[框架文件](https://github.com/kubernetes/kubernetes/tree/v1.14.0/test/images/crd-conversion-webhook/converter/framework.go)中，只留下[一个功能](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/images/crd-conversion-webhook/converter/example_converter.go#L29-L80)用于实施不同的转换。

<!--
The example conversion webhook server leaves the `ClientAuth` field
[empty](https://github.com/kubernetes/kubernetes/tree/v1.13.0/test/images/crd-conversion-webhook/config.go#L47-L48),
which defaults to `NoClientCert`. This means that the webhook server does not
authenticate the identity of the clients, supposedly API servers. If you need
mutual TLS or other ways to authenticate the clients, see
how to [authenticate API servers](/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers).
-->
{{< note >}}
示例转换 webhook 服务器留下`ClientAuth`字段[empty](https://github.com/kubernetes/kubernetes/tree/v1.13.0/test/images/crd-conversion-webhook/config.go#L47-L48)，默认为`NoClientCert`。
这意味着 webhook 服务器没有验证客户端的身份，据称是 API 服务器。
如果您需要相互 TLS 或者其他方式来验证客户端，请参阅如何[验证 API 服务器](/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers)。
{{< /note >}}

<!--
### Deploy the conversion webhook service
-->
### 部署转换 webhook 服务器

<!--
Documentation for deploying the conversion webhook is the same as for the [admission webhook example service](/docs/reference/access-authn-authz/extensible-admission-controllers/#deploy_the_admission_webhook_service).
The assumption for next sections is that the conversion webhook server is deployed to a service named `example-conversion-webhook-server` in `default` namespace and serving traffic on path `/crdconvert`.
-->
用于部署转换 webhook 的文档与[准入 webhook 示例服务](/docs/reference/access-authn-authz/extensible-admission-controllers/#deploy_the_admission_webhook_service)。
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
如果为服务器使用不同的端口，则 API 服务器和 webhook 服务器之间的通信可能会失败。
{{< /note >}}

<!--
### Configure CustomResourceDefinition to use conversion webhooks
-->
### 配置 CustomResourceDefinition 以使用转换 webhook

<!--
The `None` conversion example can be extended to use the conversion webhook by modifying `conversion`
section of the `spec`:
-->
通过修改`spec`中的`conversion`部分，可以扩展`None`转换示例来使用转换 webhook。

```yaml
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
    # Each version can define it's own schema when there is no top-level
    # schema is defined.
    schema:
      openAPIV3Schema:
        properties:
          hostPort:
            type: string
  - name: v1
    served: true
    storage: false
    schema:
      openAPIV3Schema:
        properties:
          host:
            type: string
          port:
            type: string
  conversion:
    # a Webhook strategy instruct API server to call an external webhook for any conversion between custom resources.
    strategy: Webhook
    # webhookClientConfig is required when strategy is `Webhook` and it configure the webhook endpoint to be
    # called by API server.
    webhookClientConfig:
      service:
        namespace: default
        name: example-conversion-webhook-server
        # path is the url the API server will call. It should match what the webhook is serving at. The default is '/'.
        path: /crdconvert
      caBundle: <pem encoded ca cert that signs the server cert used by the webhook>
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

<!--
When using `clientConfig.service`, the server cert must be valid for
`<svc_name>.<svc_namespace>.svc`.
-->
{{< note >}}
当使用 `clientConfig.service`时，服务器证书必须对`<svc_name>.<svc_namespace>.svc`有效。
{{< /note >}}

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
写入对象时，它将保留在写入时指定为存储版本的版本中。
如果存储版本发生变化，现有对象永远不会自动转换。
然而，新创建或更新的对象将在新的存储版本中编写。
对象可能已在不再被服务的版本中编写。

<!--
When you read an object, you specify the version as part of the path. If you
specify a version that is different from the object's persisted version,
Kubernetes returns the object to you at the version you requested, but the
persisted object is neither changed on disk, nor converted in any way
(other than changing the `apiVersion` string) while serving the request.
You can request an object at any version that is currently served.
-->
当读取对象时，将版本指定为路径的一部分。
如果指定的版本与对象的持久版本不同， Kubernetes 会在您请求的版本里将对象返还给您，但是在提供请求时，持久化对象既不会在磁盘上更改，也不会以任何方式进行转换（除了更改`apiVersion`字符串）。
您可以在当前提供的任何版本中请求对象。

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
API 服务器在状态字段`storedVersions`中记录曾被标记为存储版本的每个版本。
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

{{% /capture %}}
