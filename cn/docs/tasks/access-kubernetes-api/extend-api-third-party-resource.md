---
approvers:
- enisoc
- IanLewis
cn-approvers:
- zhangqx2010
title: 使用 ThirdPartyResources 扩展 Kubernetes API
---
<!--
---
approvers:
- enisoc
- IanLewis
title: Extend the Kubernetes API with ThirdPartyResources
---
 -->

{% assign for_k8s_version="1.7" %}{% include feature-state-deprecated.md %}

* TOC
{:toc}

<!--
## What is ThirdPartyResource?
-->
## 什么是 ThirdPartyResource ？

<!--
**ThirdPartyResource is deprecated as of Kubernetes 1.7 and has been removed in version 1.8 in
accordance with the [deprecation policy](/docs/reference/deprecation-policy) for beta features.**
-->
**ThirdPartyResource 在 Kubernetes 1.7 中被弃用。它在 1.8 版本中已经依据 [降级策略](/docs/reference/deprecation-policy) 移除。

<!--
**To avoid losing data stored in ThirdPartyResources, you must
[migrate to CustomResourceDefinition](/docs/tasks/access-kubernetes-api/migrate-third-party-resource/)
before upgrading to Kubernetes 1.8 or higher.**
-->
**为了避免丢失存放于 ThirdPartyResource 的数据，在升级到 Kubernetes 1.8 或更高版本之前，必须将数据 [迁移至 CustomResourceDefinition](/docs/tasks/access-kubernetes-api/migrate-third-party-resource/)。**

<!--
Kubernetes comes with many built-in API objects. However, there are often times when you might need to extend Kubernetes with your own API objects in order to do custom automation.
-->
Kubernetes 有许多的内置 API 对象。然而，为实现自定义自动化，很多时候需要使用您自己的 API 对象扩展 Kubernetes。

<!--
`ThirdPartyResource` objects are a way to extend the Kubernetes API with a new API object type. The new API object type will be given an API endpoint URL and support CRUD operations, and watch API. You can then create custom objects using this API endpoint. You can think of `ThirdPartyResources` as being much like the schema for a database table. Once you have created the table, you can then start storing rows in the table. Once created, `ThirdPartyResources` can act as the data model behind custom controllers or automation programs.
-->
`ThirdPartyResource` 对象是一种使用新 API 对象类型扩展 Kubernetes API 的方式。新 API 对象类型会被赋予一个 API 端点 URL、支持的 CRUD 操作和 watch API。您可以使用这个 API 端点创建自定义对象。您可以将 `ThirdPartyResources` 理解为数据库表的 schema。一旦您创建了表，就可以在表中存放一行行的数据。`ThirdPartyResources` 一旦被创建，就能够像数据模型一样，服务于自定义控制器或者自动化程序。

<!--
## Structure of a ThirdPartyResource
-->
## ThirdPartyResource 的结构

<!--
Each `ThirdPartyResource` has the following:

   * `metadata` - Standard Kubernetes object metadata.
   * `kind` - The kind of the resources described by this third party resource.
   * `description` - A free text description of the resource.
   * `versions` - A list of the versions of the resource.
-->
每个 `ThirdPartyResource` 都包含：

   * `metadata` - 标准 Kubernetes 对象元数据。
   * `kind` - 由第三方资源描述的资源类型。
   * `description` - 资源的描述文本。
   * `versions` - 资源的版本列表。

<!--
The `kind` for a `ThirdPartyResource` takes the form `<kind name>.<domain>`. You are expected to provide a unique kind and domain name in order to avoid conflicts with other `ThirdPartyResource` objects. Kind names will be converted to CamelCase when creating instances of the `ThirdPartyResource`. Hyphens in the `kind` are assumed to be word breaks. For instance the kind `camel-case` would be converted to `CamelCase` but `camelcase` would be converted to `Camelcase`.
-->
`ThirdPartyResource` 的 `kind` 取自于 `<kind name>.<domain>`。您必须提供一个唯一的 kind 和 domain 名来防止与其他 `ThirdPartyResource` 对象冲突。当创建 `ThirdPartyResource` 实例时，Kind 名称会按照驼峰命名法（CamelCase）进行转换。`kind` 内的连字符用于断词，比如， `camel-case` 会转换成 `CamelCase`，而 `camelcase` 会转换成 `Camelcase`。

<!--
Other fields on the `ThirdPartyResource` are treated as custom data fields. These fields can hold arbitrary JSON data and have any structure.
-->
`ThirdPartyResource` 的其他字段会被视作自定义数据字段。这些字段可以是任意 JSON 数据或者其他任何结构类型。

<!--
You can view the full documentation about `ThirdPartyResources` using the `explain` command in kubectl.
-->
你可以使用 kubctl 的  `explain` 参数查看 `ThirdPartyResources` 的完整文档。

```
$ kubectl explain thirdpartyresource
```

<!--
## Creating a ThirdPartyResource
-->
## 创建 ThirdPartyResource

<!--
When you create a new `ThirdPartyResource`, the Kubernetes API Server reacts by creating a new, namespaced RESTful resource path. For now, non-namespaced objects are not supported. As with existing built-in objects, deleting a namespace deletes all custom objects in that namespace. `ThirdPartyResources` themselves are non-namespaced and are available to all namespaces.
-->
当创建一个新的 `ThirdPartyResource`，Kubernetes API Server 会创建一个新的、按 namespace 存放的 RESTful 资源路径。目前不支持 non-namespaced 的对象。与现有的内置对象一样，删除一个 namespace 会删除那个 namespace 中所有的自定义对象。 `ThirdPartyResources` 本身是 non-namespaced，并对所有 namespace 可用。

<!--
For example, if you save the following `ThirdPartyResource` to `resource.yaml`:
-->
例如，如果将如下的 `ThirdPartyResource` 存到 `resource.yaml`：

```yaml
apiVersion: extensions/v1beta1
kind: ThirdPartyResource
metadata:
  name: cron-tab.stable.example.com
description: "A specification of a Pod to run on a cron style schedule"
versions:
- name: v1
```

<!--
And create it:
-->
然后进行创建：

```shell
$ kubectl create -f resource.yaml
thirdpartyresource "cron-tab.stable.example.com" created
```

<!--
Then a new RESTful API endpoint is created at:
-->
那么一个新的 RESTful API 端点就会创建在：

`/apis/stable.example.com/v1/namespaces/<namespace>/crontabs/...`

<!--
This endpoint URL can then be used to create and manage custom objects.
The `kind` of these objects will be `CronTab` following the camel case
rules applied to the `metadata.name` of this `ThirdPartyResource`
(`cron-tab.stable.example.com`)
-->
这个端点 URL 就能用于创建和管理自定义对象。依据驼峰命名规则（应用于 ThirdPartyResource(cron-tab.stable.example.com) 的 metadata.name 字段），这些对象的 kind 值为 CronTab。

<!--
## Creating Custom Objects
-->
## 创建自定义对象

<!--
After the `ThirdPartyResource` object has been created you can create custom objects. Custom objects can contain custom fields. These fields can contain arbitrary JSON.
In the following example, a `cronSpec` and `image` custom fields are set to the custom object of kind `CronTab`.  The kind `CronTab` is derived from the
`metadata.name` of the `ThirdPartyResource` object we created above.
-->
在创建了 `ThirdPartyResource` 对象之后，就可以创建自定义对象。自定义对象包含自定义字段。这些字段可以包含任意 JSON。
在如下例子中，`cronSpec` 和 `image` 字段被设置到了名为 `CronTab` 的自定义对象中。`CronTab` 取自我们刚刚创建的 `ThirdPartyResource` 对象的 `metadata.name`。

<!--
If you save the following YAML to `my-crontab.yaml`:
 -->
如果你将如下 YAML 保存到 `my-crontab.yaml` 中：

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
cronSpec: "* * * * /5"
image: my-awesome-cron-image
```

<!--
and create it:
-->
然后创建：

```shell
$ kubectl create -f my-crontab.yaml
crontab "my-new-cron-object" created
```

<!--
You can then manage our `CronTab` objects using kubectl. Note that resource names are not case-sensitive when using kubectl:
-->
你就能使用 kubectl 管理 `CronTab` 对象。注意，使用 kubectl 时资源名是大小写不敏感的。

```shell
$ kubectl get crontab
NAME                 KIND
my-new-cron-object   CronTab.v1.stable.example.com
```

<!--
You can also view the raw JSON data. Here you can see that it contains the custom `cronSpec` and `image` fields from the yaml you used to create it:
-->
你也可以查看 JSON raw 数据。此处你可以看到它包含用于创建它的 yaml 文件中的 `cronSpec` 和 `image` 字段：

```yaml
$ kubectl get crontab -o json
{
    "apiVersion": "v1",
    "items": [
        {
            "apiVersion": "stable.example.com/v1",
            "cronSpec": "* * * * /5",
            "image": "my-awesome-cron-image",
            "kind": "CronTab",
            "metadata": {
                "creationTimestamp": "2016-09-29T04:59:00Z",
                "name": "my-new-cron-object",
                "namespace": "default",
                "resourceVersion": "12601503",
                "selfLink": "/apis/stable.example.com/v1/namespaces/default/crontabs/my-new-cron-object",
                "uid": "6f65e7a3-8601-11e6-a23e-42010af0000c"
            }
        }
    ],
    "kind": "List",
    "metadata": {},
    "resourceVersion": "",
    "selfLink": ""
}
```

<!--
## What's next

* [Migrate a ThirdPartyResource to a CustomResourceDefinition](/docs/tasks/access-kubernetes-api/migrate-third-party-resource/)
* [Extend the Kubernetes API with CustomResourceDefinitions](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)
* [ThirdPartyResource](/docs/api-reference/v1.7/#thirdpartyresource-v1beta1-extensions)
-->
## 接下来

* [将 ThirdPartyResource 迁移到 CustomResourceDefinition](/docs/tasks/access-kubernetes-api/migrate-third-party-resource/)
* [使用 CustomResourceDefinitions 扩展 Kubernetes API](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)
* [ThirdPartyResource](/docs/api-reference/v1.7/#thirdpartyresource-v1beta1-extensions)

