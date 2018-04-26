<!--
---
title: Extend the Kubernetes API with CustomResourceDefinitions
assignees:
- deads2k
- enisoc
---
-->
---
title: 使用CRD(CustomResourceDefinitions)扩展Kubernetes API  
assignees:
- deads2k
- enisoc
---

<!--
{% capture overview %}
This page shows how to install a [custom resource](/docs/concepts/api-extension/custom-resources/)
into the Kubernetes API by creating a CustomResourceDefinition.
{% endcapture %}
-->
本文展示了如何通过创建一个CRD来安装一个自定义资源到Kubernetes API中。  

<!--
{% capture prerequisites %}
* Read about [custom resources](/docs/concepts/api-extension/custom-resources/).
* Make sure your Kubernetes cluster has a master version of 1.7.0 or higher.
{% endcapture %}
-->
* 阅读[自定义资源](/docs/concepts/api-extension/custom-resources/)。
* 确保你的Kubernetes集群的主版本为1.7.0或者更高版本。

<!--
{% capture steps %}
## Create a CustomResourceDefinition

When you create a new *CustomResourceDefinition* (CRD), the Kubernetes API Server
reacts by creating a new RESTful resource path, either namespaced or cluster-scoped,
as specified in the CRD's `scope` field. As with existing built-in objects, deleting a
namespace deletes all custom objects in that namespace.
CustomResourceDefinitions themselves are non-namespaced and are available to all namespaces.

For example, if you save the following CustomResourceDefinition to `resourcedefinition.yaml`:
-->
## 创建一个CRD

当创建一个新的*自定义资源定义*（CRD）时，Kubernetes API Server 通过创建一个新的RESTful资源路径进行应答，无论是在命名空间还是在集群范围内，正如在CRD的`scope`域指定的那样。  
与现有的内建对象一样，删除一个命名空间将会删除该命名空间内所有的自定义对象。  
CRD本身并不区分命名空间，对所有的命名空间可用。

例如，如果将以下的CRD保存到`resourcedefinition.yaml`中:
```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # name must match the spec fields below, and be in the form: <plural>.<group>
  name: crontabs.stable.example.com
spec:
  # group name to use for REST API: /apis/<group>/<version>
  group: stable.example.com
  # version name to use for REST API: /apis/<group>/<version>
  version: v1
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
And create it:
-->
创建它：

```shell
kubectl create -f resourcedefinition.yaml
```

<!--
Then a new namespaced RESTful API endpoint is created at:
-->
然后一个新的区分命名空间的RESTful API 端点被创建了：

```
/apis/stable.example.com/v1/namespaces/*/crontabs/...
```

<!--
This endpoint URL can then be used to create and manage custom objects.
The `kind` of these objects will be `CronTab` from the spec of the
CustomResourceDefinition object you created above.
-->
然后可以使用此端点URL来创建和管理自定义对象。
这些对象的`kind`就是你在上面创建的CRD中指定的`CronTab`对象。

<!--
## Create custom objects

After the CustomResourceDefinition object has been created, you can create
custom objects. Custom objects can contain custom fields. These fields can
contain arbitrary JSON.
In the following example, the `cronSpec` and `image` custom fields are set in a
custom object of kind `CronTab`.  The kind `CronTab` comes from the spec of the
CustomResourceDefinition object you created above.

If you save the following YAML to `my-crontab.yaml`:
-->
## 创建自定义对象

在CRD对象创建完成之后，你可以创建自定义对象了。自定义对象可以包含自定义的字段。这些字段可以包含任意的JSON。  
以下的示例中，在一个自定义对象`CronTab`种类中设置了`cronSpec`和`image`字段。这个`CronTab`种类来自于你在上面创建的CRD对象。

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * /5"
  image: my-awesome-cron-image
```

<!--
and create it:
-->
创建它：

```shell
kubectl create -f my-crontab.yaml
```

<!--
You can then manage your CronTab objects using kubectl. For example:
-->
你可以使用kubectl来管理你的CronTab对象。例如：

```shell
kubectl get crontab
```

<!--
Should print a list like this:
-->
应该打印这样的一个列表：

```console
NAME                 KIND
my-new-cron-object   CronTab.v1.stable.example.com
```

<!--
Note that resource names are not case-sensitive when using kubectl,
and you can use either the singular or plural forms defined in the CRD,
as well as any short names.

You can also view the raw JSON data:
-->
注意当使用kubectl时，资源名称是大小写不敏感的，你可以使用单数或者复数形式以及任何缩写在CRD中定义资源。

你还可以查看原始的JSON数据：

```shell
kubectl get ct -o yaml
```

<!--
You should see that it contains the custom `cronSpec` and `image` fields
from the yaml you used to create it:
-->
你应该可以看到它包含了自定义的`cronSpec`和`image`字段，来自于你用于创建它的yaml:

```console
apiVersion: v1
items:
- apiVersion: stable.example.com/v1
  kind: CronTab
  metadata:
    clusterName: ""
    creationTimestamp: 2017-05-31T12:56:35Z
    deletionGracePeriodSeconds: null
    deletionTimestamp: null
    name: my-new-cron-object
    namespace: default
    resourceVersion: "285"
    selfLink: /apis/stable.example.com/v1/namespaces/default/crontabs/my-new-cron-object
    uid: 9423255b-4600-11e7-af6a-28d2447dc82b
  spec:
    cronSpec: '* * * * /5'
    image: my-awesome-cron-image
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
```
<!--
{% endcapture %}

{% capture discussion %}
## Advanced topics

### Finalizers

*Finalizers* allow controllers to implement asynchronous pre-delete hooks.
Custom objects support finalizers just like built-in objects.

You can add a finalizer to a custom object like this:
-->

## 高级话题

### 终止器

*终止器*允许控制器实现异步的预删除钩子。
自定义对象支持终止器就像内建对象一样。

你可以给一个自定义对象添加一个终止器，如下所示：

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  finalizers:
  - finalizer.stable.example.com
```

<!--
The first delete request on an object with finalizers merely sets a value for the
`metadata.deletionTimestamp` field instead of deleting it.
This triggers controllers watching the object to execute any finalizers they handle.

Each controller then removes its finalizer from the list and issues the delete request again.
This request only deletes the object if the list of finalizers is now empty,
meaning all finalizers are done.
{% endcapture %}

{% capture whatsnext %}
* Learn how to [Migrate a ThirdPartyResource to CustomResourceDefinition](/docs/tasks/access-kubernetes-api/migrate-third-party-resource/).
{% endcapture %}

{% include templates/task.md %}
-->
对于具有终止器的一个对象，第一个删除请求仅仅是为`metadata.deletionTimestamp`字段设置一个值，而不是删除它。  
这将触发监控该对象的控制器执行他们所能处理的任意终止器。

然后，每一个控制器从列表中删除它的终止器并再一次发出删除请求。
如果这个终止器列表现在是空的，则此请求仅删除该对象，意味着所有的终止器都完成了。

* 学习如何[迁移第三方资源到CRD](/docs/tasks/access-kubernetes-api/migrate-third-party-resource/)。

