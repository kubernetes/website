---
title: 准入控制器参考
linkTitle: 准入控制器
content_type: concept
weight: 40
---
<!--
reviewers:
- lavalamp
- davidopp
- derekwaynecarr
- erictune
- janetkuo
- thockin
title: Admission Controllers Reference
linkTitle: Admission Controllers
content_type: concept
weight: 40
-->

<!-- overview -->
<!--
This page provides an overview of Admission Controllers.
-->
此页面提供准入控制器（Admission Controller）的概述。

<!-- body -->

<!--
## What are they?
-->
## 什么是准入控制插件？  {#what-are-they}

<!--
An _admission controller_ is a piece of code that intercepts requests to the
Kubernetes API server prior to persistence of the object, but after the request
is authenticated and authorized.

Admission controllers may be _validating_, _mutating_, or both. Mutating
controllers may modify objects related to the requests they admit; validating controllers may not.

Admission controllers limit requests to create, delete, modify objects. Admission
controllers can also block custom verbs, such as a request connect to a Pod via
an API server proxy. Admission controllers do _not_ (and cannot) block requests
to read (**get**, **watch** or **list**) objects.
-->
**准入控制器** 是一段代码，它会在请求通过认证和鉴权之后、对象被持久化之前拦截到达 API
服务器的请求。

准入控制器可以执行**验证（Validating）** 和/或**变更（Mutating）** 操作。
变更（mutating）控制器可以根据被其接受的请求更改相关对象；验证（validating）控制器则不行。

准入控制器限制创建、删除、修改对象的请求。
准入控制器也可以阻止自定义动作，例如通过 API 服务器代理连接到 Pod 的请求。
准入控制器**不会** （也不能）阻止读取（**get**、**watch** 或 **list**）对象的请求。

<!--
The admission controllers in Kubernetes {{< skew currentVersion >}} consist of the
[list](#what-does-each-admission-controller-do) below, are compiled into the
`kube-apiserver` binary, and may only be configured by the cluster
administrator. In that list, there are two special controllers:
MutatingAdmissionWebhook and ValidatingAdmissionWebhook.  These execute the
mutating and validating (respectively)
[admission control webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
which are configured in the API.
-->
Kubernetes {{< skew currentVersion >}}
中的准入控制器由下面的[列表](#what-does-each-admission-controller-do)组成，
并编译进 `kube-apiserver` 可执行文件，并且只能由集群管理员配置。
在该列表中，有两个特殊的控制器：MutatingAdmissionWebhook 和 ValidatingAdmissionWebhook。
它们根据 API 中的配置，
分别执行变更和验证[准入控制 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)。

<!--
## Admission control phases

The admission control process proceeds in two phases. In the first phase,
mutating admission controllers are run. In the second phase, validating
admission controllers are run. Note again that some of the controllers are
both.

If any of the controllers in either phase reject the request, the entire
request is rejected immediately and an error is returned to the end-user.
-->
## 准入控制阶段   {#admission-control-phases}

准入控制过程分为两个阶段。第一阶段，运行变更准入控制器。第二阶段，运行验证准入控制器。
再次提醒，某些控制器既是变更准入控制器又是验证准入控制器。

如果两个阶段之一的任何一个控制器拒绝了某请求，则整个请求将立即被拒绝，并向最终用户返回错误。

<!--
Finally, in addition to sometimes mutating the object in question, admission
controllers may sometimes have side effects, that is, mutate related
resources as part of request processing. Incrementing quota usage is the
canonical example of why this is necessary. Any such side-effect needs a
corresponding reclamation or reconciliation process, as a given admission
controller does not know for sure that a given request will pass all of the
other admission controllers.
-->
最后，除了对对象进行变更外，准入控制器还可能有其它副作用：将相关资源作为请求处理的一部分进行变更。
增加配额用量就是一个典型的示例，说明了这样做的必要性。
此类用法都需要相应的回收或回调过程，因为任一准入控制器都无法确定某个请求能否通过所有其它准入控制器。

<!--
## Why do I need them?

Several important features of Kubernetes require an admission controller to be enabled in order
to properly support the feature.  As a result, a Kubernetes API server that is not properly
configured with the right set of admission controllers is an incomplete server and will not
support all the features you expect.
-->
## 为什么需要准入控制器？    {#why-do-i-need-them}

Kubernetes 的若干重要功能都要求启用一个准入控制器，以便正确地支持该特性。
因此，没有正确配置准入控制器的 Kubernetes API 服务器是不完整的，它无法支持你所期望的所有特性。

<!--
## How do I turn on an admission controller?

The Kubernetes API server flag `enable-admission-plugins` takes a comma-delimited list of admission control plugins to invoke prior to modifying objects in the cluster.
For example, the following command line enables the `NamespaceLifecycle` and the `LimitRanger`
admission control plugins:
-->
## 如何启用一个准入控制器？  {#how-do-i-turn-on-an-admission-controller}

Kubernetes API 服务器的 `enable-admission-plugins` 标志接受一个（以逗号分隔的）准入控制插件列表，
这些插件会在集群修改对象之前被调用。

例如，下面的命令启用 `NamespaceLifecycle` 和 `LimitRanger` 准入控制插件：

```shell
kube-apiserver --enable-admission-plugins=NamespaceLifecycle,LimitRanger ...
```

{{< note >}}
<!--
Depending on the way your Kubernetes cluster is deployed and how the API server is
started, you may need to apply the settings in different ways. For example, you may
have to modify the systemd unit file if the API server is deployed as a systemd
service, you may modify the manifest file for the API server if Kubernetes is deployed
in a self-hosted way.
-->
根据你 Kubernetes 集群的部署方式以及 API 服务器的启动方式，你可能需要以不同的方式应用设置。
例如，如果将 API 服务器部署为 systemd 服务，你可能需要修改 systemd 单元文件；
如果以自托管方式部署 Kubernetes，你可能需要修改 API 服务器的清单文件。
{{< /note >}}

<!--
## How do I turn off an admission controller?

The Kubernetes API server flag `disable-admission-plugins` takes a comma-delimited list of admission control plugins to be disabled, even if they are in the list of plugins enabled by default.
-->
## 怎么关闭准入控制器？   {#how-do-i-turn-off-an-admission-controller}

Kubernetes API 服务器的 `disable-admission-plugins` 标志，会将传入的（以逗号分隔的）
准入控制插件列表禁用，即使是默认启用的插件也会被禁用。

```shell
kube-apiserver --disable-admission-plugins=PodNodeSelector,AlwaysDeny ...
```

<!--
## Which plugins are enabled by default?

To see which admission plugins are enabled:
-->
## 哪些插件是默认启用的？  {#which-plugins-are-enabled-by-default}

要查看哪些插件是被启用的：

```shell
kube-apiserver -h | grep enable-admission-plugins
```

<!--
In Kubernetes {{< skew currentVersion >}}, the default ones are:
-->
在 Kubernetes {{< skew currentVersion >}} 中，默认启用的插件有：

```shell
CertificateApproval, CertificateSigning, CertificateSubjectRestriction, DefaultIngressClass, DefaultStorageClass, DefaultTolerationSeconds, LimitRanger, MutatingAdmissionWebhook, NamespaceLifecycle, PersistentVolumeClaimResize, PodSecurity, Priority, ResourceQuota, RuntimeClass, ServiceAccount, StorageObjectInUseProtection, TaintNodesByCondition, ValidatingAdmissionPolicy, ValidatingAdmissionWebhook
```

{{< note >}}
<!--
The [`ValidatingAdmissionPolicy`](#validatingadmissionpolicy) admission plugin is enabled
by default, but is only active if you enable the `ValidatingAdmissionPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) **and**
the `admissionregistration.k8s.io/v1alpha1` API.
-->
[`ValidatingAdmissionPolicy`](#validatingadmissionpolicy) 准入插件默认被启用，
但只有启用 `ValidatingAdmissionPolicy`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/) **和**
`admissionregistration.k8s.io/v1alpha1` API 时才会激活。
{{< /note >}}

<!--
## What does each admission controller do?
-->
## 每个准入控制器的作用是什么？  {#what-does-each-admission-controller-do}

### AlwaysAdmit {#alwaysadmit}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
This admission controller allows all pods into the cluster. It is **deprecated** because
its behavior is the same as if there were no admission controller at all.
-->
该准入控制器允许所有的 Pod 进入集群。此插件**已被弃用**，因其行为与没有准入控制器一样。

### AlwaysDeny {#alwaysdeny}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
Rejects all requests. AlwaysDeny is **deprecated** as it has no real meaning.
-->
拒绝所有的请求。由于它没有实际意义，**已被弃用**。

### AlwaysPullImages {#alwayspullimages}

<!--
This admission controller modifies every new Pod to force the image pull policy to `Always`. This is useful in a
multitenant cluster so that users can be assured that their private images can only be used by those
who have the credentials to pull them. Without this admission controller, once an image has been pulled to a
node, any pod from any user can use it by knowing the image's name (assuming the Pod is
scheduled onto the right node), without any authorization check against the image. When this admission controller
is enabled, images are always pulled prior to starting containers, which means valid credentials are
required.
-->
该准入控制器会修改每个新创建的 Pod，将其镜像拉取策略设置为 `Always`。
这在多租户集群中是有用的，这样用户就可以放心，他们的私有镜像只能被那些有凭证的人使用。
如果没有这个准入控制器，一旦镜像被拉取到节点上，任何用户的 Pod 都可以通过已了解到的镜像的名称
（假设 Pod 被调度到正确的节点上）来使用它，而不需要对镜像进行任何鉴权检查。
启用这个准入控制器之后，启动容器之前必须拉取镜像，这意味着需要有效的凭证。

### CertificateApproval {#certificateapproval}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
This admission controller observes requests to approve CertificateSigningRequest resources and performs additional
authorization checks to ensure the approving user has permission to **approve** certificate requests with the
`spec.signerName` requested on the CertificateSigningRequest resource.
-->
此准入控制器获取审批 CertificateSigningRequest 资源的请求并执行额外的鉴权检查，
以确保针对设置了 `spec.signerName` 的 CertificateSigningRequest 资源而言，
审批请求的用户有权限对证书请求执行 **审批** 操作。

<!--
See [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/) for more
information on the permissions required to perform different actions on CertificateSigningRequest resources.
-->
有关对 CertificateSigningRequest 资源执行不同操作所需权限的详细信息，
请参阅[证书签名请求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)。

### CertificateSigning  {#certificatesigning}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
This admission controller observes updates to the `status.certificate` field of CertificateSigningRequest resources
and performs an additional authorization checks to ensure the signing user has permission to **sign** certificate
requests with the `spec.signerName` requested on the CertificateSigningRequest resource.
-->
此准入控制器监视对 CertificateSigningRequest 资源的 `status.certificate` 字段的更新请求，
并执行额外的鉴权检查，以确保针对设置了 `spec.signerName` 的 CertificateSigningRequest 资源而言，
签发证书的用户有权限对证书请求执行 **签发** 操作。

<!--
See [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/) for more
information on the permissions required to perform different actions on CertificateSigningRequest resources.
-->
有关对 CertificateSigningRequest 资源执行不同操作所需权限的详细信息，
请参阅[证书签名请求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)。

### CertificateSubjectRestriction {#certificatesubjectrestriction}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
This admission controller observes creation of CertificateSigningRequest resources that have a `spec.signerName`
of `kubernetes.io/kube-apiserver-client`. It rejects any request that specifies a 'group' (or 'organization attribute')
of `system:masters`.
-->
此准入控制器监视 `spec.signerName` 被设置为 `kubernetes.io/kube-apiserver-client` 的
CertificateSigningRequest 资源创建请求，并拒绝所有将 “group”（或 “organization attribute”）
设置为 `system:masters` 的请求。

### DefaultIngressClass {#defaultingressclass}

<!--
**Type**: Mutating.
-->
**类别**：变更。

<!--
This admission controller observes creation of `Ingress` objects that do not request any specific
ingress class and automatically adds a default ingress class to them.  This way, users that do not
request any special ingress class do not need to care about them at all and they will get the
default one.
-->
该准入控制器监测没有请求任何特定 Ingress 类的 `Ingress` 对象创建请求，并自动向其添加默认 Ingress 类。
这样，没有任何特殊 Ingress 类需求的用户根本不需要关心它们，他们将被设置为默认 Ingress 类。

<!--
This admission controller does not do anything when no default ingress class is configured. When more than one ingress
class is marked as default, it rejects any creation of `Ingress` with an error and an administrator
must revisit their `IngressClass` objects and mark only one as default (with the annotation
"ingressclass.kubernetes.io/is-default-class").  This admission controller ignores any `Ingress`
updates; it acts only on creation.
-->
当未配置默认 Ingress 类时，此准入控制器不执行任何操作。如果有多个 Ingress 类被标记为默认 Ingress 类，
此控制器将拒绝所有创建 `Ingress` 的操作，并返回错误信息。
要修复此错误，管理员必须重新检查其 `IngressClass` 对象，并仅将其中一个标记为默认
（通过注解 "ingressclass.kubernetes.io/is-default-class"）。
此准入控制器会忽略所有 `Ingress` 更新操作，仅处理创建操作。

<!--
See the [Ingress](/docs/concepts/services-networking/ingress/) documentation for more about ingress
classes and how to mark one as default.
-->
关于 Ingress 类以及如何将 Ingress 类标记为默认的更多信息，请参见
[Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 页面。

### DefaultStorageClass {#defaultstorageclass}

<!--
**Type**: Mutating.
-->
**类别**：变更。

<!--
This admission controller observes creation of `PersistentVolumeClaim` objects that do not request any specific storage class
and automatically adds a default storage class to them.
This way, users that do not request any special storage class do not need to care about them at all and they
will get the default one.
-->
此准入控制器监测没有请求任何特定存储类的 `PersistentVolumeClaim` 对象的创建请求，
并自动向其添加默认存储类。
这样，没有任何特殊存储类需求的用户根本不需要关心它们，它们将被设置为使用默认存储类。

<!--
This admission controller does not do anything when no default storage class is configured. When more than one storage
class is marked as default, it rejects any creation of `PersistentVolumeClaim` with an error and an administrator
must revisit their `StorageClass` objects and mark only one as default.
This admission controller ignores any `PersistentVolumeClaim` updates; it acts only on creation.
-->
当未配置默认存储类时，此准入控制器不执行任何操作。如果将多个存储类标记为默认存储类，
此控制器将拒绝所有创建 `PersistentVolumeClaim` 的请求，并返回错误信息。
要修复此错误，管理员必须重新检查其 `StorageClass` 对象，并仅将其中一个标记为默认。
此准入控制器会忽略所有 `PersistentVolumeClaim` 更新操作，仅处理创建操作。

<!--
See [persistent volume](/docs/concepts/storage/persistent-volumes/) documentation about persistent volume claims and
storage classes and how to mark a storage class as default.
-->
关于持久卷申领和存储类，以及如何将存储类标记为默认，
请参见[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)页面。

### DefaultTolerationSeconds {#defaulttolerationseconds}

<!--
**Type**: Mutating.
-->
**类别**：变更。

<!--
This admission controller sets the default forgiveness toleration for pods to tolerate
the taints `notready:NoExecute` and `unreachable:NoExecute` based on the k8s-apiserver input parameters
`default-not-ready-toleration-seconds` and `default-unreachable-toleration-seconds` if the pods don't already
have toleration for taints `node.kubernetes.io/not-ready:NoExecute` or
`node.kubernetes.io/unreachable:NoExecute`.
The default value for `default-not-ready-toleration-seconds` and `default-unreachable-toleration-seconds` is 5 minutes.
-->
此准入控制器基于 k8s-apiserver 的输入参数 `default-not-ready-toleration-seconds` 和
`default-unreachable-toleration-seconds` 为 Pod 设置默认的容忍度，以容忍 `notready:NoExecute` 和
`unreachable:NoExecute` 污点
（如果 Pod 尚未容忍 `node.kubernetes.io/not-ready：NoExecute` 和
`node.kubernetes.io/unreachable：NoExecute` 污点的话）。
`default-not-ready-toleration-seconds` 和 `default-unreachable-toleration-seconds`
的默认值是 5 分钟。

### DenyServiceExternalIPs   {#denyserviceexternalips}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
This admission controller rejects all net-new usage of the `Service` field `externalIPs`.  This
feature is very powerful (allows network traffic interception) and not well
controlled by policy.  When enabled, users of the cluster may not create new
Services which use `externalIPs` and may not add new values to `externalIPs` on
existing `Service` objects.  Existing uses of `externalIPs` are not affected,
and users may remove values from `externalIPs` on existing `Service` objects.
-->
此准入控制器拒绝新的 `Service` 中使用字段 `externalIPs`。
此功能非常强大（允许网络流量拦截），并且无法很好地受策略控制。
启用后，集群用户将无法创建使用 `externalIPs` 的新 `Service`，也无法在现有
`Service` 对象上为 `externalIPs` 添加新值。
`externalIPs` 的现有使用不受影响，用户可以在现有 `Service` 对象上从
`externalIPs` 中删除值。

<!--
Most users do not need this feature at all, and cluster admins should consider disabling it.
Clusters that do need to use this feature should consider using some custom policy to manage usage
of it.
This admission controller is disabled by default.
-->
大多数用户根本不需要此特性，集群管理员应考虑将其禁用。
确实需要使用此特性的集群应考虑使用一些自定义策略来管理 `externalIPs` 的使用。
此准入控制器默认被禁用。

### EventRateLimit {#eventratelimit}

{{< feature-state for_k8s_version="v1.13" state="alpha" >}}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
This admission controller mitigates the problem where the API server gets flooded by
requests to store new Events. The cluster admin can specify event rate limits by:
-->
此准入控制器缓解了请求存储新事件时淹没 API 服务器的问题。集群管理员可以通过以下方式指定事件速率限制：

<!--
* Enabling the `EventRateLimit` admission controller;
* Referencing an `EventRateLimit` configuration file from the file provided to the API
  server's command line flag `--admission-control-config-file`:
-->
* 启用 `EventRateLimit` 准入控制器；
* 在通过 API 服务器的命令行标志 `--admission-control-config-file` 设置的文件中，
  引用 `EventRateLimit` 配置文件：

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
  - name: EventRateLimit
    path: eventconfig.yaml
...
```

<!--
There are four types of limits that can be specified in the configuration:
-->
可以在配置中指定的限制有四种类型：

<!--
 * `Server`: All Event requests (creation or modifications) received by the API server share a single bucket.
 * `Namespace`: Each namespace has a dedicated bucket.
 * `User`: Each user is allocated a bucket.
 * `SourceAndObject`: A bucket is assigned by each combination of source and
   involved object of the event.
-->
* `Server`：API 服务器收到的所有（创建或修改）Event 请求共享一个桶。
* `Namespace`：每个名字空间都对应一个专用的桶。
* `User`：为每个用户分配一个桶。
* `SourceAndObject`：根据事件的来源和涉及对象的各种组合分配桶。

<!--
Below is a sample `eventconfig.yaml` for such a configuration:
-->
下面是一个针对此配置的 `eventconfig.yaml` 示例：

```yaml
apiVersion: eventratelimit.admission.k8s.io/v1alpha1
kind: Configuration
limits:
  - type: Namespace
    qps: 50
    burst: 100
    cacheSize: 2000
  - type: User
    qps: 10
    burst: 50
```

<!--
See the [EventRateLimit Config API (v1alpha1)](/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
for more details.

This admission controller is disabled by default.
-->
详情请参见
[EventRateLimit 配置 API 文档（v1alpha1）](/zh-cn/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)。

此准入控制器默认被禁用。

### ExtendedResourceToleration {#extendedresourcetoleration}

<!--
**Type**: Mutating.
-->
**类别**：变更。

<!--
This plug-in facilitates creation of dedicated nodes with extended resources.
If operators want to create dedicated nodes with extended resources (like GPUs, FPGAs etc.), they are expected to
[taint the node](/docs/concepts/scheduling-eviction/taint-and-toleration/#example-use-cases) with the extended resource
name as the key. This admission controller, if enabled, automatically
adds tolerations for such taints to pods requesting extended resources, so users don't have to manually
add these tolerations.

This admission controller is disabled by default.
-->
此插件有助于创建带有扩展资源的专用节点。
如果运维人员想要创建带有扩展资源（如 GPU、FPGA 等）的专用节点，他们应该以扩展资源名称作为键名，
[为节点设置污点](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。
如果启用了此准入控制器，会将此类污点的容忍度自动添加到请求扩展资源的 Pod 中，
用户不必再手动添加这些容忍度。

此准入控制器默认被禁用。

### ImagePolicyWebhook {#imagepolicywebhook}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
The ImagePolicyWebhook admission controller allows a backend webhook to make admission decisions.

This admission controller is disabled by default.
-->
ImagePolicyWebhook 准入控制器允许使用后端 Webhook 做出准入决策。

此准入控制器默认被禁用。

<!--
#### Configuration file format {#imagereview-config-file-format}

ImagePolicyWebhook uses a configuration file to set options for the behavior of the backend.
This file may be json or yaml and has the following format:
-->
#### 配置文件格式  {#imagereview-config-file-format}

ImagePolicyWebhook 使用配置文件来为后端行为设置选项。该文件可以是 JSON 或 YAML，
并具有以下格式:

<!--
```yaml
imagePolicy:
  kubeConfigFile: /path/to/kubeconfig/for/backend
  # time in s to cache approval
  allowTTL: 50
  # time in s to cache denial
  denyTTL: 50
  # time in ms to wait between retries
  retryBackoff: 500
  # determines behavior if the webhook backend fails
  defaultAllow: true
```
-->
```yaml
imagePolicy:
  kubeConfigFile: /path/to/kubeconfig/for/backend
  # 以秒计的时长，控制批准请求的缓存时间
  allowTTL: 50
  # 以秒计的时长，控制拒绝请求的缓存时间
  denyTTL: 50
  # 以毫秒计的时长，控制重试间隔
  retryBackoff: 500
  # 确定 Webhook 后端失效时的行为
  defaultAllow: true
```

<!--
Reference the ImagePolicyWebhook configuration file from the file provided to the API server's command line flag `--admission-control-config-file`:
-->
在通过命令行标志 `--admission-control-config-file` 为 API 服务器提供的文件中，
引用 ImagePolicyWebhook 配置文件：

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
  - name: ImagePolicyWebhook
    path: imagepolicyconfig.yaml
...
```

<!--
Alternatively, you can embed the configuration directly in the file:
-->
或者，你也可以直接将配置嵌入到该文件中：

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
  - name: ImagePolicyWebhook
    configuration:
      imagePolicy:
        kubeConfigFile: <kubeconfig 文件路径>
        allowTTL: 50
        denyTTL: 50
        retryBackoff: 500
        defaultAllow: true
```

<!--
The ImagePolicyWebhook config file must reference a
[kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
formatted file which sets up the connection to the backend.
It is required that the backend communicate over TLS.
-->
ImagePolicyWebhook 的配置文件必须引用
[kubeconfig](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
格式的文件；该文件用来设置与后端的连接。要求后端使用 TLS 进行通信。

<!--
The kubeconfig file's `cluster` field must point to the remote service, and the `user` field
must contain the returned authorizer.
-->
kubeconfig 文件的 `clusters` 字段需要指向远端服务，`users` 字段需要包含已返回的授权者。

<!--
```yaml
# clusters refers to the remote service.
clusters:
  - name: name-of-remote-imagepolicy-service
    cluster:
      certificate-authority: /path/to/ca.pem    # CA for verifying the remote service.
      server: https://images.example.com/policy # URL of remote service to query. Must use 'https'.

# users refers to the API server's webhook configuration.
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # cert for the webhook admission controller to use
      client-key: /path/to/key.pem          # key matching the cert
```
-->

```yaml
# clusters 指的是远程服务。
clusters:
  - name: name-of-remote-imagepolicy-service
    cluster:
      certificate-authority: /path/to/ca.pem    # CA 用于验证远程服务
      server: https://images.example.com/policy # 要查询的远程服务的 URL，必须是 'https'。

# users 指的是 API 服务器的 Webhook 配置。
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # Webhook 准入控制器使用的证书
      client-key: /path/to/key.pem          # 证书匹配的密钥
```

<!--
For additional HTTP configuration, refer to the
[kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) documentation.
-->
关于 HTTP 配置的更多信息，请参阅
[kubeconfig](/zh-cn/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
文档。

<!--
#### Request payloads

When faced with an admission decision, the API Server POSTs a JSON serialized
`imagepolicy.k8s.io/v1alpha1` `ImageReview` object describing the action.
This object contains fields describing the containers being admitted, as well as
any pod annotations that match `*.image-policy.k8s.io/*`.
-->
#### 请求载荷  {#request-payloads}

当面对一个准入决策时，API 服务器发送一个描述操作的 JSON 序列化的
`imagepolicy.k8s.io/v1alpha1` `ImageReview` 对象。
该对象包含描述被准入容器的字段，以及与 `*.image-policy.k8s.io/*` 匹配的所有 Pod 注解。

{{< note >}}
<!--
The webhook API objects are subject to the same versioning compatibility rules
as other Kubernetes API objects. Implementers should be aware of looser compatibility
promises for alpha objects and check the `apiVersion` field of the request to
ensure correct deserialization.
Additionally, the API Server must enable the `imagepolicy.k8s.io/v1alpha1` API extensions
group (`--runtime-config=imagepolicy.k8s.io/v1alpha1=true`).
-->
注意，Webhook API 对象与其他 Kubernetes API 对象一样受制于相同的版本控制兼容性规则。
实现者应该知道对 alpha 对象兼容性是相对宽松的，并检查请求的 "apiVersion" 字段，
以确保正确的反序列化。此外，API 服务器必须启用 `imagepolicy.k8s.io/v1alpha1` API 扩展组
（`--runtime-config=imagepolicy.k8s.io/v1alpha1=true`）。
{{< /note >}}

<!--
An example request body:
-->
请求体示例：

```json
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "spec": {
    "containers": [
      {
        "image": "myrepo/myimage:v1"
      },
      {
        "image": "myrepo/myimage@sha256:beb6bd6a68f114c1dc2ea4b28db81bdf91de202a9014972bec5e4d9171d90ed"
      }
    ],
    "annotations": {
      "mycluster.image-policy.k8s.io/ticket-1234": "break-glass"
    },
    "namespace": "mynamespace"
  }
}
```

<!--
The remote service is expected to fill the `status` field of the request and
respond to either allow or disallow access. The response body's `spec` field is ignored, and
may be omitted. A permissive response would return:
-->
远程服务将填充请求的 `status` 字段，并返回允许或不允许访问的响应。
响应体的 `spec` 字段会被忽略，并且可以被省略。一个允许访问应答会返回：

```json
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "status": {
    "allowed": true
  }
}
```

<!--
To disallow access, the service would return:
-->
若不允许访问，服务将返回：

```json
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "status": {
    "allowed": false,
    "reason": "image currently blacklisted"
  }
}
```

<!--
For further documentation refer to the
[`imagepolicy.v1alpha1` API](/docs/reference/config-api/imagepolicy.v1alpha1/).
-->
更多的文档，请参阅 [`imagepolicy.v1alpha1` API](/zh-cn/docs/reference/config-api/imagepolicy.v1alpha1/)。

<!--
#### Extending with Annotations

All annotations on a Pod that match `*.image-policy.k8s.io/*` are sent to the webhook.
Sending annotations allows users who are aware of the image policy backend to
send extra information to it, and for different backends implementations to
accept different information.
-->
#### 使用注解进行扩展  {#extending-with-annotations}

一个 Pod 中匹配 `*.image-policy.k8s.io/*` 的注解都会被发送给 Webhook。
这样做使得了解后端镜像策略的用户可以向它发送额外的信息，
并让不同的后端实现接收不同的信息。

<!--
Examples of information you might put here are:

* request to "break glass" to override a policy, in case of emergency.
* a ticket number from a ticket system that documents the break-glass request
* provide a hint to the policy server as to the imageID of the image being provided, to save it a lookup
-->
你可以在这里输入的信息有：

* 在紧急情况下，请求破例覆盖某个策略。
* 从一个记录了破例的请求的工单（Ticket）系统得到的一个工单号码。
* 向策略服务器提供提示信息，用于提供镜像的 imageID，以方便它进行查找。

<!--
In any case, the annotations are provided by the user and are not validated by Kubernetes in any way.
-->
在任何情况下，注解都是由用户提供的，并不会被 Kubernetes 以任何方式进行验证。

### LimitPodHardAntiAffinityTopology   {#limitpodhardantiaffinitytopology}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
This admission controller denies any pod that defines `AntiAffinity` topology key other than
`kubernetes.io/hostname` in `requiredDuringSchedulingRequiredDuringExecution`.

This admission controller is disabled by default.
-->
此准入控制器拒绝定义了 `AntiAffinity` 拓扑键的任何 Pod
（`requiredDuringSchedulingRequiredDuringExecution` 中的 `kubernetes.io/hostname` 除外）。

此准入控制器默认被禁用。

### LimitRanger {#limitranger}

<!--
**Type**: Mutating and Validating.
-->
**类别**：变更和验证。

<!--
This admission controller will observe the incoming request and ensure that it does not violate
any of the constraints enumerated in the `LimitRange` object in a `Namespace`.  If you are using
`LimitRange` objects in your Kubernetes deployment, you MUST use this admission controller to
enforce those constraints. LimitRanger can also be used to apply default resource requests to Pods
that don't specify any; currently, the default LimitRanger applies a 0.1 CPU requirement to all
Pods in the `default` namespace.
-->
此准入控制器会监测传入的请求，并确保请求不会违反 `Namespace` 中 `LimitRange` 对象所设置的任何约束。
如果你在 Kubernetes 部署中使用了 `LimitRange` 对象，则必须使用此准入控制器来执行这些约束。
LimitRanger 还可以用于将默认资源请求应用到没有设定资源约束的 Pod；
当前，默认的 LimitRanger 对 `default` 名字空间中的所有 Pod 都设置 0.1 CPU 的需求。

<!--
See the [LimitRange API reference](/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)
and the [example of LimitRange](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
for more details.
-->
请查看
[limitRange API 文档](/zh-cn/docs/reference/kubernetes-api/policy-resources/limit-range-v1/)和
[LimitRange 例子](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)以了解更多细节。

### MutatingAdmissionWebhook {#mutatingadmissionwebhook}

<!--
**Type**: Mutating.
-->
**类别**：变更。

<!--
This admission controller calls any mutating webhooks which match the request. Matching
webhooks are called in serial; each one may modify the object if it desires.

This admission controller (as implied by the name) only runs in the mutating phase.
-->
此准入控制器调用任何与请求匹配的变更（Mutating） Webhook。匹配的 Webhook 将被顺序调用。
每一个 Webhook 都可以自由修改对象。

`MutatingAdmissionWebhook`，顾名思义，仅在变更阶段运行。

<!--
If a webhook called by this has side effects (for example, decrementing quota) it
*must* have a reconciliation system, as it is not guaranteed that subsequent
webhooks or validating admission controllers will permit the request to finish.
-->
如果由此准入控制器调用的 Webhook 有副作用（如：减少配额），
则它 **必须** 具有协调系统，因为不能保证后续的 Webhook 和验证准入控制器都会允许完成请求。

<!--
If you disable the MutatingAdmissionWebhook, you must also disable the
`MutatingWebhookConfiguration` object in the `admissionregistration.k8s.io/v1`
group/version via the `--runtime-config` flag, both are on by default.
-->
如果你禁用了 MutatingAdmissionWebhook，那么还必须使用 `--runtime-config` 标志禁止
`admissionregistration.k8s.io/v1` 组/版本中的 `MutatingWebhookConfiguration`，
二者都是默认启用的。

<!--
#### Use caution when authoring and installing mutating webhooks
-->
#### 谨慎编写和安装变更 Webhook  {#use-caution-when-authoring-and-installing-mutating-webhooks}

<!--
* Users may be confused when the objects they try to create are different from
  what they get back.
* Built in control loops may break when the objects they try to create are
  different when read back.
  * Setting originally unset fields is less likely to cause problems than
    overwriting fields set in the original request. Avoid doing the latter.
* Future changes to control loops for built-in resources or third-party resources
  may break webhooks that work well today. Even when the webhook installation API
  is finalized, not all possible webhook behaviors will be guaranteed to be supported
  indefinitely.
-->
* 当用户尝试创建的对象与返回的对象不同时，用户可能会感到困惑。
* 当他们读回的对象与尝试创建的对象不同，内建的控制回路可能会出问题。
  * 与覆盖原始请求中设置的字段相比，使用原始请求未设置的字段会引起问题的可能性较小。
    应尽量避免覆盖原始请求中的字段设置。
* 内建资源和第三方资源的控制回路未来可能会出现破坏性的变更，使现在运行良好的 Webhook
  无法再正常运行。即使完成了 Webhook API 安装，也不代表该 Webhook 会被提供无限期的支持。

### NamespaceAutoProvision {#namespaceautoprovision}

<!--
**Type**: Mutating.
-->
**类别**：变更。

<!--
This admission controller examines all incoming requests on namespaced resources and checks
if the referenced namespace does exist.
It creates a namespace if it cannot be found.
This admission controller is useful in deployments that do not want to restrict creation of
a namespace prior to its usage.
-->
此准入控制器会检查针对名字空间域资源的所有传入请求，并检查所引用的名字空间是否确实存在。
如果找不到所引用的名字空间，控制器将创建一个名字空间。
此准入控制器对于不想要求名字空间必须先创建后使用的集群部署很有用。

### NamespaceExists {#namespaceexists}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
This admission controller checks all requests on namespaced resources other than `Namespace` itself.
If the namespace referenced from a request doesn't exist, the request is rejected.
-->
此准入控制器检查针对名字空间作用域的资源（除 `Namespace` 自身）的所有请求。
如果请求引用的名字空间不存在，则拒绝该请求。

### NamespaceLifecycle {#namespacelifecycle}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
This admission controller enforces that a `Namespace` that is undergoing termination cannot have
new objects created in it, and ensures that requests in a non-existent `Namespace` are rejected.
This admission controller also prevents deletion of three system reserved namespaces `default`,
`kube-system`, `kube-public`.
-->
该准入控制器禁止在一个正在被终止的 `Namespace` 中创建新对象，并确保针对不存在的
`Namespace` 的请求被拒绝。该准入控制器还会禁止删除三个系统保留的名字空间，即 `default`、
`kube-system` 和 `kube-public`。

<!--
A `Namespace` deletion kicks off a sequence of operations that remove all objects (pods, services,
etc.) in that namespace.  In order to enforce integrity of that process, we strongly recommend
running this admission controller.
-->
`Namespace` 的删除操作会触发一系列删除该名字空间中所有对象（Pod、Service 等）的操作。
为了确保这个过程的完整性，我们强烈建议启用这个准入控制器。

### NodeRestriction {#noderestriction}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
This admission controller limits the `Node` and `Pod` objects a kubelet can modify. In order to be limited by this admission controller,
kubelets must use credentials in the `system:nodes` group, with a username in the form `system:node:<nodeName>`.
Such kubelets will only be allowed to modify their own `Node` API object, and only modify `Pod` API objects that are bound to their node.
-->
该准入控制器限制了某 kubelet 可以修改的 `Node` 和 `Pod` 对象。
为了受到这个准入控制器的限制，kubelet 必须使用在 `system:nodes` 组中的凭证，
并使用 `system:node:<nodeName>` 形式的用户名。
这样，kubelet 只可修改自己的 `Node` API 对象，只能修改绑定到自身节点的 Pod 对象。

<!--
kubelets are not allowed to update or remove taints from their `Node` API object.

The `NodeRestriction` admission plugin prevents kubelets from deleting their `Node` API object,
and enforces kubelet modification of labels under the `kubernetes.io/` or `k8s.io/` prefixes as follows:
-->
不允许 kubelet 更新或删除 `Node` API 对象的污点。

`NodeRestriction` 准入插件可防止 kubelet 删除其 `Node` API 对象，
并对前缀为 `kubernetes.io/` 或 `k8s.io/` 的标签的修改对 kubelet 作如下限制：

<!--
* **Prevents** kubelets from adding/removing/updating labels with a `node-restriction.kubernetes.io/` prefix.
  This label prefix is reserved for administrators to label their `Node` objects for workload isolation purposes,
  and kubelets will not be allowed to modify labels with that prefix.
* **Allows** kubelets to add/remove/update these labels and label prefixes:
-->
* **禁止** kubelet 添加、删除或更新前缀为 `node-restriction.kubernetes.io/` 的标签。
  这类前缀的标签时保留给管理员的，用以为 `Node` 对象设置标签以隔离工作负载，而不允许 kubelet
  修改带有该前缀的标签。
* **允许** kubelet 添加、删除、更新以下标签：
  * `kubernetes.io/hostname`
  * `kubernetes.io/arch`
  * `kubernetes.io/os`
  * `beta.kubernetes.io/instance-type`
  * `node.kubernetes.io/instance-type`
  * `failure-domain.beta.kubernetes.io/region`（已弃用）
  * `failure-domain.beta.kubernetes.io/zone`（已弃用）
  * `topology.kubernetes.io/region`
  * `topology.kubernetes.io/zone`
  * `kubelet.kubernetes.io/` 为前缀的标签
  * `node.kubernetes.io/` 为前缀的标签

<!--
Use of any other labels under the `kubernetes.io` or `k8s.io` prefixes by kubelets is reserved,
and may be disallowed or allowed by the `NodeRestriction` admission plugin in the future.

Future versions may add additional restrictions to ensure kubelets have the minimal set of
permissions required to operate correctly.
-->
以 `kubernetes.io` 或 `k8s.io` 为前缀的所有其他标签都限制 kubelet 使用，并且将来可能会被
`NodeRestriction` 准入插件允许或禁止。

将来的版本可能会增加其他限制，以确保 kubelet 具有正常运行所需的最小权限集。

### OwnerReferencesPermissionEnforcement {#ownerreferencespermissionenforcement}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
This admission controller protects the access to the `metadata.ownerReferences` of an object
so that only users with **delete** permission to the object can change it.
This admission controller also protects the access to `metadata.ownerReferences[x].blockOwnerDeletion`
of an object, so that only users with **update** permission to the `finalizers`
subresource of the referenced *owner* can change it.
-->
此准入控制器保护对对象的 `metadata.ownerReferences` 的访问，以便只有对该对象具有
**delete** 权限的用户才能对其进行更改。
该准入控制器还保护对 `metadata.ownerReferences[x].blockOwnerDeletion` 对象的访问，
以便只有对所引用的 **属主（owner）** 的 `finalizers` 子资源具有 **update**
权限的用户才能对其进行更改。

### PersistentVolumeClaimResize {#persistentvolumeclaimresize}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
This admission controller implements additional validations for checking incoming
`PersistentVolumeClaim` resize requests.
-->
此准入控制器检查传入的 `PersistentVolumeClaim` 调整大小请求，对其执行额外的验证检查操作。

<!--
Enabling the `PersistentVolumeClaimResize` admission controller is recommended.
This admission controller prevents resizing of all claims by default unless a claim's `StorageClass`
 explicitly enables resizing by setting `allowVolumeExpansion` to `true`.

For example: all `PersistentVolumeClaim`s created from the following `StorageClass` support volume expansion:
-->
建议启用 `PersistentVolumeClaimResize` 准入控制器。除非 PVC 的 `StorageClass` 明确地将
`allowVolumeExpansion` 设置为 `true` 来显式启用调整大小。
否则，默认情况下该准入控制器会阻止所有对 PVC 大小的调整。

例如：由以下 `StorageClass` 创建的所有 `PersistentVolumeClaim` 都支持卷容量扩充：

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gluster-vol-default
provisioner: kubernetes.io/glusterfs
parameters:
  resturl: "http://192.168.10.100:8080"
  restuser: ""
  secretNamespace: ""
  secretName: ""
allowVolumeExpansion: true
```

<!--
For more information about persistent volume claims, see [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims).
-->
关于持久化卷申领的更多信息，请参见
[PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)。

### PersistentVolumeLabel {#persistentvolumelabel}

{{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

<!--
**Type**: Mutating.
-->
**类别**：变更。

<!--
This admission controller automatically attaches region or zone labels to PersistentVolumes
as defined by the cloud provider (for example, Azure or GCP).
It helps ensure the Pods and the PersistentVolumes mounted are in the same
region and/or zone.
If the admission controller doesn't support automatic labelling your PersistentVolumes, you
may need to add the labels manually to prevent pods from mounting volumes from
a different zone. PersistentVolumeLabel is **deprecated** as labeling for persistent volumes has been taken over by
the {{< glossary_tooltip text="cloud-controller-manager" term_id="cloud-controller-manager" >}}.

This admission controller is disabled by default.
-->
此准入控制器会自动将由云提供商（如 Azure 或 GCP）定义的区（region）或区域（zone）
标签附加到 PersistentVolume 上。这有助于确保 Pod 和 PersistentVolume 位于相同的区或区域。
如果准入控制器不支持为 PersistentVolumes 自动添加标签，那你可能需要手动添加标签，
以防止 Pod 挂载其他区域的卷。PersistentVolumeLabel **已被弃用**，
为持久卷添加标签的操作已由{{< glossary_tooltip text="云管理控制器" term_id="cloud-controller-manager" >}}接管。

此准入控制器默认被禁用。

### PodNodeSelector {#podnodeselector}

{{< feature-state for_k8s_version="v1.5" state="alpha" >}}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
This admission controller defaults and limits what node selectors may be used within a namespace
by reading a namespace annotation and a global configuration.

This admission controller is disabled by default.
-->
此准入控制器通过读取名字空间注解和全局配置，来为名字空间中可以使用的节点选择器设置默认值并实施限制。

此准入控制器默认被禁用。

<!--
#### Configuration file format

`PodNodeSelector` uses a configuration file to set options for the behavior of the backend.
Note that the configuration file format will move to a versioned file in a future release.
This file may be json or yaml and has the following format:
-->
#### 配置文件格式    {#configuration-file-format-podnodeselector}

`PodNodeSelector` 使用配置文件来设置后端行为的选项。
请注意，配置文件格式将在将来某个版本中改为版本化文件。
该文件可以是 JSON 或 YAML，格式如下：

```yaml
podNodeSelectorPluginConfig:
  clusterDefaultNodeSelector: name-of-node-selector
  namespace1: name-of-node-selector
  namespace2: name-of-node-selector
```

<!--
Reference the `PodNodeSelector` configuration file from the file provided to the API server's
command line flag `--admission-control-config-file`:
-->
通过 API 服务器命令行标志 `--admission-control-config-file` 为 API 服务器提供的文件中，
需要引用 `PodNodeSelector` 配置文件：

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodNodeSelector
  path: podnodeselector.yaml
...
```

<!--
#### Configuration Annotation Format

`PodNodeSelector` uses the annotation key `scheduler.alpha.kubernetes.io/node-selector` to assign
node selectors to namespaces.
-->
#### 配置注解格式   {#configuration-annotation-format}

`PodNodeSelector` 使用键为 `scheduler.alpha.kubernetes.io/node-selector`
的注解为名字空间设置节点选择算符。

```yaml
apiVersion: v1
kind: Namespace
metadata:
  annotations:
    scheduler.alpha.kubernetes.io/node-selector: name-of-node-selector
  name: namespace3
```

<!--
#### Internal Behavior

This admission controller has the following behavior:
-->
#### 内部行为   {#internal-behavior}

此准入控制器行为如下：

<!--
1. If the `Namespace` has an annotation with a key `scheduler.alpha.kubernetes.io/node-selector`,
   use its value as the node selector.
2. If the namespace lacks such an annotation, use the `clusterDefaultNodeSelector` defined in the
   `PodNodeSelector` plugin configuration file as the node selector.
3. Evaluate the pod's node selector against the namespace node selector for conflicts. Conflicts
   result in rejection.
4. Evaluate the pod's node selector against the namespace-specific allowed selector defined the
   plugin configuration file. Conflicts result in rejection.
-->
1. 如果 `Namespace` 的注解带有键 `scheduler.alpha.kubernetes.io/node-selector`，
   则将其值用作节点选择算符。
2. 如果名字空间缺少此类注解，则使用 `PodNodeSelector` 插件配置文件中定义的
   `clusterDefaultNodeSelector` 作为节点选择算符。
3. 评估 Pod 节点选择算符和名字空间节点选择算符是否存在冲突。存在冲突将拒绝 Pod。
4. 评估 Pod 节点选择算符和特定于名字空间的被允许的选择算符所定义的插件配置文件是否存在冲突。
   存在冲突将导致拒绝 Pod。

{{< note >}}
<!--
PodNodeSelector allows forcing pods to run on specifically labeled nodes. Also see the PodTolerationRestriction
admission plugin, which allows preventing pods from running on specifically tainted nodes.
-->
PodNodeSelector 允许 Pod 强制在特定标签的节点上运行。
另请参阅 PodTolerationRestriction 准入插件，该插件可防止 Pod 在特定污点的节点上运行。
{{< /note >}}

### PodSecurity {#podsecurity}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
The PodSecurity admission controller checks new Pods before they are
admitted, determines if it should be admitted based on the requested security context and the restrictions on permitted
[Pod Security Standards](/docs/concepts/security/pod-security-standards/)
for the namespace that the Pod would be in.
-->
PodSecurity 准入控制器在新 Pod 被准入之前对其进行检查，
根据请求的安全上下文和 Pod 所在名字空间允许的
[Pod 安全性标准](/zh/docs/concepts/security/pod-security-standards/)的限制来确定新 Pod
是否应该被准入。

<!--
See the [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
documentation for more information.
-->
更多信息请参阅 [Pod 安全性准入](/zh-cn/docs/concepts/security/pod-security-admission/)。

<!--
PodSecurity replaced an older admission controller named PodSecurityPolicy.
-->
PodSecurity 取代了一个名为 PodSecurityPolicy 的旧准入控制器。

### PodTolerationRestriction {#podtolerationrestriction}

{{< feature-state for_k8s_version="v1.7" state="alpha" >}}

<!--
**Type**: Mutating and Validating.
-->
**类别**：变更和验证。

<!--
The PodTolerationRestriction admission controller verifies any conflict between tolerations of a
pod and the tolerations of its namespace.
It rejects the pod request if there is a conflict.
It then merges the tolerations annotated on the namespace into the tolerations of the pod.
The resulting tolerations are checked against a list of allowed tolerations annotated to the namespace.
If the check succeeds, the pod request is admitted otherwise it is rejected.
-->
准入控制器 PodTolerationRestriction 检查 Pod 的容忍度与其名字空间的容忍度之间是否存在冲突。
如果存在冲突，则拒绝 Pod 请求。
控制器接下来会将名字空间的容忍度合并到 Pod 的容忍度中，
根据名字空间的容忍度白名单检查所得到的容忍度结果。
如果检查成功，则将接受 Pod 请求，否则拒绝该请求。

<!--
If the namespace of the pod does not have any associated default tolerations or allowed
tolerations annotated, the cluster-level default tolerations or cluster-level list of allowed tolerations are used
instead if they are specified.
-->
如果 Pod 的名字空间没有任何关联的默认容忍度或容忍度白名单，
则使用集群级别的默认容忍度或容忍度白名单（如果有的话）。

<!--
Tolerations to a namespace are assigned via the `scheduler.alpha.kubernetes.io/defaultTolerations` annotation key.
The list of allowed tolerations can be added via the `scheduler.alpha.kubernetes.io/tolerationsWhitelist` annotation key.

Example for namespace annotations:
-->
名字空间的容忍度通过注解键 `scheduler.alpha.kubernetes.io/defaultTolerations`
来设置。可接受的容忍度可以通过 `scheduler.alpha.kubernetes.io/tolerationsWhitelist`
注解键来添加。

名字空间注解的示例：

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: apps-that-need-nodes-exclusively
  annotations:
    scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'
    scheduler.alpha.kubernetes.io/tolerationsWhitelist: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'
```

<!--
This admission controller is disabled by default.
-->
此准入控制器默认被禁用。

<!--
### Priority {#priority}

**Type**: Mutating and Validating.

The priority admission controller uses the `priorityClassName` field and populates the integer
value of the priority.
If the priority class is not found, the Pod is rejected.
-->
### 优先级 {#priority}

**类别**：变更和验证。

优先级准入控制器使用 `priorityClassName` 字段并用整型值填充优先级。
如果找不到优先级，则拒绝 Pod。

### ResourceQuota {#resourcequota}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
This admission controller will observe the incoming request and ensure that it does not violate
any of the constraints enumerated in the `ResourceQuota` object in a `Namespace`.  If you are
using `ResourceQuota` objects in your Kubernetes deployment, you MUST use this admission
controller to enforce quota constraints.
-->
此准入控制器会监测传入的请求，并确保它不违反任何一个 `Namespace` 中的 `ResourceQuota`
对象中列举的约束。如果你在 Kubernetes 部署中使用了 `ResourceQuota`，
则必须使用这个准入控制器来强制执行配额限制。

<!--
See the [ResourceQuota API reference](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
and the [example of Resource Quota](/docs/concepts/policy/resource-quotas/) for more details.
-->
请参阅
[resourceQuota API 参考](/zh-cn/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
和 [Resource Quota 例子](/zh-cn/docs/concepts/policy/resource-quotas/)了解更多细节。

### RuntimeClass {#runtimeclass}

<!--
**Type**: Mutating and Validating.
-->
**类别**：变更和验证。

<!--
If you define a RuntimeClass with [Pod overhead](/docs/concepts/scheduling-eviction/pod-overhead/)
configured, this admission controller checks incoming Pods.
When enabled, this admission controller rejects any Pod create requests
that have the overhead already set.
For Pods that have a RuntimeClass configured and selected in their `.spec`,
this admission controller sets `.spec.overhead` in the Pod based on the value
defined in the corresponding RuntimeClass.

See also [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/)
for more information.
-->
如果你所定义的 RuntimeClass 包含 [Pod 开销](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)，
这个准入控制器会检查新的 Pod。
被启用后，此准入控制器会拒绝所有已经设置了 overhead 字段的 Pod 创建请求。
对于配置了 RuntimeClass 并在其 `.spec` 中选定 RuntimeClass 的 Pod，
此准入控制器会根据相应 RuntimeClass 中定义的值为 Pod 设置 `.spec.overhead`。

详情请参见 [Pod 开销](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)。

### ServiceAccount {#serviceaccount}

<!--
**Type**: Mutating and Validating.
-->
**类别**：变更和验证。

<!--
This admission controller implements automation for
[serviceAccounts](/docs/tasks/configure-pod-container/configure-service-account/).
The Kubernetes project strongly recommends enabling this admission controller.
You should enable this admission controller if you intend to make any use of Kubernetes
`ServiceAccount` objects.
-->
此准入控制器实现了
[ServiceAccount](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)
的自动化。强烈推荐为 Kubernetes 项目启用此准入控制器。
如果你打算使用 Kubernetes 的 `ServiceAccount` 对象，你应启用这个准入控制器。

<!--
Regarding the annotation `kubernetes.io/enforce-mountable-secrets`: While the annotation's name suggests it only concerns the mounting of Secrets,
its enforcement also extends to other ways Secrets are used in the context of a Pod.
Therefore, it is crucial to ensure that all the referenced secrets are correctly specified in the ServiceAccount.
-->
关于 `kubernetes.io/enforce-mountable-secrets` 注解：尽管注解的名称表明它只涉及 Secret 的挂载，
但其执行范围也扩展到 Pod 上下文中 Secret 的其他使用方式。
因此，确保所有引用的 Secret 在 ServiceAccount 中被正确指定是至关重要的。


### StorageObjectInUseProtection   {#storageobjectinuseprotection}

<!--
**Type**: Mutating.
-->
**类别**：变更。

<!--
The `StorageObjectInUseProtection` plugin adds the `kubernetes.io/pvc-protection` or `kubernetes.io/pv-protection`
finalizers to newly created Persistent Volume Claims (PVCs) or Persistent Volumes (PV).
In case a user deletes a PVC or PV the PVC or PV is not removed until the finalizer is removed
from the PVC or PV by PVC or PV Protection Controller.
Refer to the
[Storage Object in Use Protection](/docs/concepts/storage/persistent-volumes/#storage-object-in-use-protection)
for more detailed information.
-->
`StorageObjectInUseProtection` 插件将 `kubernetes.io/pvc-protection` 或
`kubernetes.io/pv-protection` 终结器（finalizers）添加到新创建的持久卷申领（PVC）
或持久卷（PV）中。如果用户尝试删除 PVC/PV，除非 PVC/PV 的保护控制器移除终结器，
否则 PVC/PV 不会被删除。有关更多详细信息，
请参考[保护使用中的存储对象](/zh-cn/docs/concepts/storage/persistent-volumes/#storage-object-in-use-protection)。

### TaintNodesByCondition {#taintnodesbycondition}

<!--
**Type**: Mutating.
-->
**类别**：变更。

<!--
This admission controller {{< glossary_tooltip text="taints" term_id="taint" >}} newly created
Nodes as `NotReady` and `NoSchedule`. That tainting avoids a race condition that could cause Pods
to be scheduled on new Nodes before their taints were updated to accurately reflect their reported
conditions.
-->
该准入控制器为新创建的节点添加 `NotReady` 和 `NoSchedule`
{{< glossary_tooltip text="污点" term_id="taint" >}}。
这些污点能够避免一些竞态条件的发生，而这类竞态条件可能导致 Pod
在更新节点污点以准确反映其所报告状况之前，就被调度到新节点上。

### ValidatingAdmissionPolicy {#validatingadmissionpolicy}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
[This admission controller](/docs/reference/access-authn-authz/validating-admission-policy/) implements the CEL validation for incoming matched requests.
It is enabled when both feature gate `validatingadmissionpolicy` and `admissionregistration.k8s.io/v1alpha1` group/version are enabled.
If any of the ValidatingAdmissionPolicy fails, the request fails.
-->
[此准入控制器](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)针对传入的匹配请求实现
CEL 校验。当 `validatingadmissionpolicy` 和 `admissionregistration.k8s.io/v1alpha1` 特性门控组/版本被启用时，
此特性被启用。如果任意 ValidatingAdmissionPolicy 失败，则请求失败。

### ValidatingAdmissionWebhook {#validatingadmissionwebhook}

<!--
**Type**: Validating.
-->
**类别**：验证。

<!--
This admission controller calls any validating webhooks which match the request. Matching
webhooks are called in parallel; if any of them rejects the request, the request
fails. This admission controller only runs in the validation phase; the webhooks it calls may not
mutate the object, as opposed to the webhooks called by the `MutatingAdmissionWebhook` admission controller.
-->
此准入控制器调用与请求匹配的所有验证性 Webhook。
匹配的 Webhook 将被并行调用。如果其中任何一个拒绝请求，则整个请求将失败。
该准入控制器仅在验证（Validating）阶段运行；与 `MutatingAdmissionWebhook`
准入控制器所调用的 Webhook 相反，它调用的 Webhook 不可以变更对象。

<!--
If a webhook called by this has side effects (for example, decrementing quota) it
*must* have a reconciliation system, as it is not guaranteed that subsequent
webhooks or other validating admission controllers will permit the request to finish.
-->
如果以此方式调用的 Webhook 有其它副作用（如：减少配额），则它 **必须** 具有协调机制。
这是因为无法保证后续的 Webhook 或其他验证性准入控制器都允许请求完成。

<!--
If you disable the ValidatingAdmissionWebhook, you must also disable the
`ValidatingWebhookConfiguration` object in the `admissionregistration.k8s.io/v1`
group/version via the `--runtime-config` flag.
-->
如果你禁用了 ValidatingAdmissionWebhook，还必须通过 `--runtime-config` 标志来禁用
`admissionregistration.k8s.io/v1` 组/版本中的 `ValidatingWebhookConfiguration` 对象。

<!--
## Is there a recommended set of admission controllers to use?

Yes. The recommended admission controllers are enabled by default
(shown [here](/docs/reference/command-line-tools-reference/kube-apiserver/#options)),
so you do not need to explicitly specify them.
You can enable additional admission controllers beyond the default set using the
`--enable-admission-plugins` flag (**order doesn't matter**).
-->
## 有推荐的准入控制器吗？   {#is-there-a-recommended-set-of-admission-controllers-to-use}

有。推荐使用的准入控制器默认情况下都处于启用状态
（请查看[这里](/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/#options)）。
因此，你无需显式指定它们。
你可以使用 `--enable-admission-plugins` 标志（ **顺序不重要** ）来启用默认设置以外的其他准入控制器。
