---
approvers:
- smarterclayton
- lavalamp
- whitlockjc
- caesarxuchao
title: Dynamic Admission Control
---

* TOC
{:toc}

## 概述

<!--
## Overview
-->

<!--
The [admission controllers documentation](/docs/admin/admission-controllers/)
introduces how to use standard, plugin-style admission controllers. However,
plugin admission controllers are not flexible enough for all use cases, due to
the following:
-->

[admission controllers 文档](/docs/admin/admission-controllers/)介绍了怎么使用标准的，插件化的
admission controller。然而，由于以下原因，admission controller 对于大多数用户来说还不够灵活：

<!--
* They need to be compiled into kube-apiserver.
* They are only configurable when the apiserver starts up.
-->

* 需要把它编译到kube-apiserver 二进制文件中
* 只能在启动时进行配置

<!--
1.7 introduces two alpha features, *Initializers* and *External Admission
Webhooks*, that address these limitations. These features allow admission
controllers to be developed out-of-tree and configured at runtime.
-->

1.7 引入了2个alpha的功能，*Initializers* 和 *外部 Admission Webhooks*
来解决这些限制。这些功能可以让我们在它之外进行开发和在运行时改变它的配置

<!--
This page describes how to use Initializers and External Admission Webhooks.
-->

这篇文档详细介绍了怎么使用 Initializers 和 外部 Admission Webhooks.

<!--
## Initializers
-->

## Initializers

<!--
### What are initializers?
-->

### 什么是 Initializers

<!--
*Initializer* has two meanings:
-->

*Initializers* 有两层意思

<!--
* A list of pending pre-initialization tasks, stored in every object's metadata
  (e.g., "AddMyCorporatePolicySidecar").
-->

* 存储在每一个对象元数据中的一系列的预初始化的任务，
 （例如，"AddMyCorporatePolicySidecar")。

<!--
* A user customized controller, which actually performs those tasks. The name of the task
  corresponds to the controller which performs the task. For clarity, we call
  them *initializer controllers* in this page.
-->

* 用户自定义的 controller，用来执行那些初始化任务。任务的名称跟执行该任务的控制器是相关联的，
  我们在这里称之为 *initializer controllers*

<!--
Once the controller has performed its assigned task, it removes its name from
the list. For example, it may send a PATCH that inserts a container in a pod and
also removes its name from `metadata.initializers.pending`. Initializers may make
mutations to objects.
-->

一旦一个controller执行了分配给它的任务，他就会把他的名字从这个列表中删除。例如，发送一个PATCH请求，在pod中添加一个container，
然后把它的名字从`metadata.initializers.pending`中删除。 Initializers 有可能造成这个对象突变。

<!--
Objects which have a non-empty initializer list are considered uninitialized,
and are not visible in the API unless specifically requested by using the query parameter,
`?includeUninitialized=true`.
-->

一个对象如果有一个 initializer 的非空列表，我们就认为它没有被初始化，而且不能在API中看到，除非我们用这个查询参数发了一个特殊的请求,
`?includeUninitialized=true`

<!--
### When to use initializers?
-->

### 什么时候使用 initializers?

<!--
Initializers are useful for admins to force policies (e.g., the
[AlwaysPullImages](/docs/admin/admission-controllers/#alwayspullimages)
admission controller), or to inject defaults (e.g., the
[DefaultStorageClass](/docs/admin/admission-controllers/#defaultstorageclass)
admission controller), etc.
-->

Initializers 对管理员用来强加一些策略是非常有用的
（例如，[AlwaysPullImages](/docs/admin/admission-controllers/#alwayspullimages))

<!--
**Note:** If your use case does not involve mutating objects, consider using
external admission webhooks, as they have better performance.
-->

**注释** 如果你的使用场景并不总会突变这个资源，可以考虑使用外部的 admission webhooks, 它的性能会更好

<!--
### How are initializers triggered?
-->

### initializers 是怎么被触发的

<!--
When an object is POSTed, it is checked against all existing
`initializerConfiguration` objects (explained below). For all that it matches,
all `spec.initializers[].name`s are appended to the new object's
`metadata.initializers.pending` field.
-->

当向一个资源发送一个POST请求的时候，所有的`initializerConfiguration`
对象(下文有介绍)都会对它进行检查。所有匹配的这些对象的
`spec.initializers[].name`会被附加在这个资源的`metadata.initializers.pending` 字段.

<!--
An initializer controller should list and watch for uninitialized objects, by
using the query parameter `?includeUninitialized=true`. If using client-go, just
set
[listOptions.includeUninitialized](https://github.com/kubernetes/kubernetes/blob/v1.7.0-rc.1/staging/src/k8s.io/apimachinery/pkg/apis/meta/v1/types.go#L315)
to true.
-->

一个 initializer controller 应该通过查询参数`?includeUninitialized=true` 来 list 和 watch 没有被初始化的对象。
如果使用 client-go, 只需要设置[listOptions.includeUninitialized](https://github.com/kubernetes/kubernetes/blob/v1.7.0-rc.1/staging/src/k8s.io/apimachinery/pkg/apis/meta/v1/types.go#L315)
为 true.

<!--
For the observed uninitialized objects, an initializer controller should first
check if its name matches `metadata.initializers.pending[0]`. If so, it should then
perform its assigned task and remove its name from the list.
-->

对于观察到的没有被初始化的对象， initializer controller 应该首先检查它的名称是否和
`metadata.initializers.pending[0]` 匹配。如果匹配他就会被分配的任务然后在列表中删除它的名字

<!--
### Enable initializers alpha feature
-->

### 启用 initializers alpha 功能

<!--
*Initializers* is an alpha feature, so it is disabled by default. To turn it on,
you need to:
-->

*Initializers* 目前是alpha的功能，默认是被关闭的。要打开它，你需要：

<!--
* Include "Initializers" in the `--admission-control` flag when starting
  `kube-apiserver`. If you have multiple `kube-apiserver` replicas, all should
  have the same flag setting.
-->

* 当你启动 `kube-apiserver` 的时候，在`--admission-control` 这个参数加上"Initializers"。
  如果你有多个`kube-apiserver`副本， 你需要在所有的上面加上这个参数。

<!--
* Enable the dynamic admission controller registration API by adding
  `admissionregistration.k8s.io/v1alpha1` to the `--runtime-config` flag passed
  to `kube-apiserver`, e.g.
  `--runtime-config=admissionregistration.k8s.io/v1alpha1`. Again, all replicas
  should have the same flag setting.
-->

* 启动`kube-apiserver`的时候，在`--runtime-config` 参数加上`admissionregistration.k8s.io/v1alpha1`
  来打开动态 admission controller 注册 API 的功能。再一次，如果你有多个`kube-apiserver`，
  你需要在所有的上面加上这个参数

<!--
### Deploy an initializer controller
-->

### 部署 initializer controller

<!--
You should deploy an initializer controller via the [deployment
API](/docs/api-reference/{{page.version}}/#deployment-v1beta1-apps).
-->

你应该通过[deployment
     API](/docs/api-reference/{{page.version}}/#deployment-v1beta1-apps)
来部署 initializer controller

<!--
### Configure initializers on the fly
-->

### 运行时配置 initializer controller

<!--
You can configure what initializers are enabled and what resources are subject
to the initializers by creating `initializerConfiguration` resources.
-->

你可以通过创建 `initializerConfiguration` 资源来配置开启哪个 initializer controller 和初始化那种资源

<!--
You should first deploy the initializer controller and make sure that it is
working properly before creating the `initializerConfiguration`. Otherwise, any
newly created resources will be stuck in an uninitialized state.
-->

首先你需要部署一个 initializer controller 并且确保在创建 `initializerConfiguration` 之前工作正常。
否则，任何新创建的资源都会处在 uninitialized 的状态

<!--
The following is an example `initializerConfiguration`:
-->
下面是一个 `initializerConfiguration` 的例子：

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: InitializerConfiguration
metadata:
  name: example-config
initializers:
  # the name needs to be fully qualified, i.e., containing at least two "."
  - name: podimage.example.com
    rules:
      # apiGroups, apiVersion, resources all support wildcard "*".
      # "*" cannot be mixed with non-wildcard.
      - apiGroups:
          - ""
        apiVersions:
          - v1
        resources:
          - pods
```
<!--
After you create the `initializerConfiguration`, the system will take a few
seconds to honor the new configuration. Then, `"podimage.example.com"` will be
appended to the `metadata.initializers.pending` field of newly created pods. You
should already have a ready "podimage" initializer controller that handles pods
whose `metadata.initializers.pending[0].name="podimage.example.com"`. Otherwise
the pods will stuck uninitialized.
-->

你在创建了 `initializerConfiguration` 之后，系统会花费几妙中时间响应这个新的配置, 然后，
`"podimage.example.com"` 回被添加到新创建Pod的 `metadata.initializers.pending` 字段。
你应该已经提前有一个工作正常的 initializer controller 来处理这些
`metadata.initializers.pending[0].name="podimage.example.com"`
的Pod。 否则这些Pod会一直出在 uninitialized 状态

<!--
Make sure that all expansions of the `<apiGroup, apiVersions, resources>` tuple
in a `rule` are valid. If they are not, separate them in different `rules`.
-->

确保每一条 `rule` 内所有的 `<apiGroup, apiVersions, resources>` 展开的元组是有效的，如果不是的话
把他们放在不同的 `rule` 下面。

<!--
## External Admission Webhooks
-->
## 外部 Admission Webhooks

<!--
### What are external admission webhooks?
-->

### 什么是外部 admission webhooks?

<!--
External admission webhooks are HTTP callbacks that are intended to receive
admission requests and do something with them. What an external admission
webhook does is up to you, but there is an
[interface](https://github.com/kubernetes/kubernetes/blob/v1.7.0-rc.1/pkg/apis/admission/v1alpha1/types.go)
that it must adhere to so that it responds with whether or not the
admission request should be allowed.
-->

外部 admission webhooks 是一些 HTTP 的 callback, 用来接受 admission 的请求，
并且做一些相应的处理。 外部 admission webhook 做什么是由你来决定的, 但是有一个
[接口](https://github.com/kubernetes/kubernetes/blob/v1.7.0-rc.1/pkg/apis/admission/v1alpha1/types.go)
必须遵从, 来响应是否允许这个 admission 请求。

<!--
Unlike initializers or the plugin-style admission controllers, external
admission webhooks are not allowed to mutate the admission request in any way.
-->

跟 initializers 或者插件化的 admission controllers 不一样的是, 外部的
admission webhooks 不允许以任何方式突变这个 admission request

<!--
Because admission is a high security operation, the external admission webhooks
must support TLS.
-->

因为 admission 是一个很高级别的安全相关的操作, 外部的 admission webhooks 必须支持TLS。

<!--
### When to use admission webhooks?
-->

### 什么时候使用 admission webhooks？

<!--
A simple example use case for an external admission webhook is to do semantic validation
of Kubernetes resources. Suppose that your infrastructure requires that all `Pod`
resources have a common set of labels, and you do not want any `Pod` to be
persisted to Kubernetes if those needs are not met. You could write your
external admission webhook to do this validation and respond accordingly.
-->

使用外部 admission webhook 的一个简单的例子就是对 kubernetes 的资源进行语义验证。假如说你的架构需要所有的
Pod 资源有一些共同的 label, 而且如果这些 Pod 没有满足需要的话你不想对其持久化。 你可以写一个你自己的外部
的 admission webhook 来做这些验证并且对其做相应的响应。

<!--
### How are external admission webhooks triggered?
-->

### 外部 admission webhooks 是怎么触发的？

<!--
Whenever a request comes in, the `GenericAdmissionWebhook` admission plugin will
get the list of interested external admission webhooks from
`externalAdmissionHookConfiguration` objects (explained below) and call them in
parallel. If **all** of the external admission webhooks approve the admission
request, the admission chain continues. If **any** of the external admission
webhooks deny the admission request, the admission request will be denied, and
the reason for doing so will be based on the _first_ external admission webhook
denial reason. _This means if there is more than one external admission webhook
that denied the admission request, only the first will be returned to the
user._ If there is an error encountered when calling an external admission
webhook, that request is ignored and will not be used to approve/deny the
admission request.
-->

无论什么时候接受到请求， `GenericAdmissionWebhook` admission 插件会从 `externalAdmissionHookConfiguration`
对象 (下文有介绍)拿到相应的外部 admission webhooks 的一个列表然后并行的调用它们。如果**所有**的外部
admission webhooks 允许了这个 admission 请求，那么请求就会继续。 如果**任何**一个
外部 admission webhooks 拒绝了这个 admission 请求， 那么这个请求就会被拒绝，拒绝请求的原因就是第一个拒绝
请求的 admission webhook 的拒绝原因。这意味着如果如果多个外部 admission webhook 拒绝了请求，只有第一个会
被返回给用户。 如果当调用外部 admission webhook 发生错误, 这个 admission webhook 将被忽略掉， 不会用来
允许/拒绝这个 admission 请求。

<!--
**Note:** The admission chain depends solely on the order of the
`--admission-control` option passed to `kube-apiserver`.
-->

**注释** admission 链的执行顺序仅依赖 `kube-apiserver` 的 `--admission-control` 选项配置的顺序

<!--
### Enable external admission webhooks
-->

### 启用外部 admission webhooks

<!--
*External Admission Webhooks* is an alpha feature, so it is disabled by default.
To turn it on, you need to
-->

*外部 admission webhooks* 是一个 alpha 的功能，默认似乎被关闭的，要打开它你需要：

<!--
* Include "GenericAdmissionWebhook" in the `--admission-control` flag when
  starting the apiserver. If you have multiple `kube-apiserver` replicas, all
  should have the same flag setting.
-->

* 当启动 apiserver 的时候在 `--admission-control` 选项中包含 "GenericAdmissionWebhook"。
  如果你有多个 `kube-apiserver`， 你需要在所有的上面加上这个参数。

<!--
* Enable the dynamic admission controller registration API by adding
  `admissionregistration.k8s.io/v1alpha1` to the `--runtime-config` flag passed
  to `kube-apiserver`, e.g.
  `--runtime-config=admissionregistration.k8s.io/v1alpha1`. Again, all replicas
  should have the same flag setting.
-->

* 在启动`kube-apiserver`的时候，在`--runtime-config` 选项加上`admissionregistration.k8s.io/v1alpha1`
  来打开动态 admission controller 注册 API 的功能。再一次，如果你有多个`kube-apiserver`，
  你需要在所有的上面加上这个参数。

<!--
### Write a webhook admission controller
-->

### 实现 webhook admission controller

<!--
See [caesarxuchao/example-webhook-admission-controller](https://github.com/caesarxuchao/example-webhook-admission-controller)
for an example webhook admission controller.
-->

这[caesarxuchao/example-webhook-admission-controller](https://github.com/caesarxuchao/example-webhook-admission-controller)
是一个 webhook admission controller 的例子.

<!--
The communication between the webhook admission controller and the apiserver, or
more precisely, the GenericAdmissionWebhook admission controller, needs to be
TLS secured. You need to generate a CA cert and use it to sign the server cert
used by your webhook admission controller. The pem formatted CA cert is supplied
to the apiserver via the dynamic registration API
`externaladmissionhookconfigurations.clientConfig.caBundle`.
-->

webhook admission controller, 更准取得说是 GenericAdmissionWebhook admission controller
和 apiserver 之间的通信，需要TLS加密。 你需要生更一个CA证书然后用它来对你 webhook admission controller
使用的服务器证书进行签名。 这个CA证书需要在动态注册API的时候通过
 `externaladmissionhookconfigurations.clientConfig.caBundle` 提供给 apiserver

<!--
For each request received by the apiserver, the GenericAdmissionWebhook
admission controller sends an
[admissionReview](https://github.com/kubernetes/kubernetes/blob/v1.7.0-rc.1/pkg/apis/admission/v1alpha1/types.go#L27)
to the relevant webhook admission controller. The webhook admission controller
gathers information like `object`, `oldobject`, and `userInfo`, from
`admissionReview.spec`, sends back a response with the body also being the
`admissionReview`, whose `status` field is filled with the admission decision.
-->

对于每一个 apiserver 接收到的请求，GenericAdmissionWebhook admission controller 会发送一个
[admissionReview](https://github.com/kubernetes/kubernetes/blob/v1.7.0-rc.1/pkg/apis/admission/v1alpha1/types.go#L27)
到对应的 webhook admission controller。 webhook admission controller 会从
`admissionReview.spec` 收集 `object`, `oldobject`, and `userInfo` 等信息
并且以 `admissionReview` 的格式发送一个响应。 在 `status` 字段填充 admission 的结果。

<!--
### Deploy the webhook admission controller
-->

部署 webhook admission controller

<!--
See [caesarxuchao/example-webhook-admission-controller deployment](https://github.com/caesarxuchao/example-webhook-admission-controller/tree/master/deployment)
for an example deployment.
-->

[caesarxuchao/example-webhook-admission-controller deployment](https://github.com/caesarxuchao/example-webhook-admission-controller/tree/master/deployment)
是一个部署的例子

<!--
The webhook admission controller should be deployed via the
[deployment API](/docs/api-reference/{{page.version}}/#deployment-v1beta1-apps).
You also need to create a
[service](/docs/api-reference/{{page.version}}/#service-v1-core) as the
front-end of the deployment.
-->

我们应该通过 [deployment API](/docs/api-reference/{{page.version}}/#deployment-v1beta1-apps)
来部署 webhook controller
并且需要创建一个 [service](/docs/api-reference/{{page.version}}/#service-v1-core) 作为部署的
前端

<!--
### Configure webhook admission controller on the fly
-->

运行时配置 webhook admission controller

<!--
You can configure what webhook admission controllers are enabled and what
resources are subject to the admission controller via creating
externaladmissionhookconfigurations.
-->

你可以通过创建 externaladmissionhookconfigurations 来配置启动哪些 webhook admission controllers
和作用于哪些目标对象

<!--
We suggest that you first deploy the webhook admission controller and make sure
it is working properly before creating the externaladmissionhookconfigurations.
Otherwise, depending whether the webhook is configured as fail open or fail
closed, operations will be unconditionally accepted or rejected.
-->

首先你需要部署一个 webhook admission controller 并且确保在创建 `externaladmissionhookconfigurations`
之前工作正常。否则，处理结果将会有条件的接受或者拒绝，这取决于你的 webhook 配置为 `fail open` 还是 `fail closed`

<!--
The following is an example `externaladmissionhookconfiguration`:
-->

下面是一个 `externaladmissionhookconfiguration` 的例子

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: ExternalAdmissionHookConfiguration
metadata:
  name: example-config
externalAdmissionHooks:
- name: pod-image.k8s.io
  rules:
  - apiGroups:
    - ""
    apiVersions:
    - v1
    operations:
    - CREATE
    resources:
    - pods
  failurePolicy: Ignore
  clientConfig:
    caBundle: <pem encoded ca cert that signs the server cert used by the webhook>
    service:
      name: <name of the front-end service>
      namespace: <namespace of the front-end service>
```

<!--
For a request received by the apiserver, if the request matches any of the
`rules` of an `externalAdmissionHook`, the `GenericAdmissionWebhook` admission
controller will send an `admissionReview` request to the `externalAdmissionHook`
to ask for admission decision.
-->

对于 apiserver 接受到的请求，如果这个请求满足任何一个 `externalAdmissionHook` `rules` 中
的 `rule`，`GenericAdmissionWebhook` admission controller 会发送一个 `admissionReview`
请求到 `externalAdmissionHook` 来获取 admission 结果。

<!--
The `rule` is similar to the `rule` in `initializerConfiguration`, with two
differences:
-->

这里的 `rule` 和 `externalAdmissionHook` 中的 `rule` 非常相似，但有两点不同：

<!--
* The addition of the `operations` field, specifying what operations the webhook
  is interested in;
-->

* 新添加了 `operations` 字段，来描述这个 webhook 会做什么样的操作

<!--
* The `resources` field accepts subresources in the form or resource/subresource.
-->

* 添加 `resources` 字段支持 `resource/subresource` 方式的 subresources

<!--
Make sure that all expansions of the `<apiGroup, apiVersions,resources>` tuple
in a `rule` are valid. If they are not, separate them to different `rules`.
-->

确保每一条 `rule` 内所有的`<apiGroup, apiVersions, resources>` 展开的元组是有效的，如果不是的话
把他们放在不同的 `rule` 下面。

<!--
You can also specify the `failurePolicy`. In 1.7, the system supports `Ignore`
and `Fail` policies, meaning that upon a communication error with the webhook
admission controller, the `GenericAdmissionWebhook` can admit or reject the
operation based on the configured policy.
-->

你也可以指定 `failurePolicy`. 在1.7的时候， 系统支持 `Ignore` 和 `Fail` 策略，当与webhook
admission controller 通信发生错误的时候，`GenericAdmissionWebhook` 可以根据配置的策略来确定、
是允许还是拒绝请求。

<!--
After you create the `externalAdmissionHookConfiguration`, the system will take a few
seconds to honor the new configuration.
-->

你在创建了 `externalAdmissionHookConfiguration` 之后，系统会花费几妙中时间响应这个新的配置
