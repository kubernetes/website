---
title: 使用准入控制器
content_template: templates/concept
weight: 30
---

<!--
---
reviewers:
- lavalamp
- davidopp
- derekwaynecarr
- erictune
- janetkuo
- thockin
title: Using Admission Controllers
content_template: templates/concept
weight: 30
---
-->


{{% capture overview %}}
<!--
This page provides an overview of Admission Controllers.
-->
此页面概述了准入控制器。
{{% /capture %}}

{{% capture body %}}

<!--
## What are they?
-->

## 什么是准入控制插件？

<!--
An admission controller is a piece of code that intercepts requests to the
Kubernetes API server prior to persistence of the object, but after the request
is authenticated and authorized.  The controllers consist of the
[list](#what-does-each-admission-controller-do) below, are compiled into the
`kube-apiserver` binary, and may only be configured by the cluster
administrator. In that list, there are two special controllers:
MutatingAdmissionWebhook and ValidatingAdmissionWebhook.  These execute the
mutating and validating (respectively) [admission control
webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
which are configured in the API.
-->

准入控制器是一段代码，它会在请求通过认证和授权之后、对象被持久化之前拦截到达 API 服务器的请求。控制器由下面的[列表](#what-does-each-admission-controller-do)组成，并编译进 `kube-apiserver` 二进制文件，并且只能由集群管理员配置。在该列表中，有两个特殊的控制器：MutatingAdmissionWebhook 和 ValidatingAdmissionWebhook。它们根据 API 中的配置，分别执行变更和验证[准入控制 webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)。


<!--
Admission controllers may be "validating", "mutating", or both. Mutating
controllers may modify the objects they admit; validating controllers may not.

The admission control process proceeds in two phases. In the first phase,
mutating admission controllers are run. In the second phase, validating
admission controllers are run. Note again that some of the controllers are
both.

If any of the controllers in either phase reject the request, the entire
request is rejected immediately and an error is returned to the end-user.
-->

准入控制器可以执行 “验证” 和/或 “变更” 操作。变更（mutating）控制器可以修改被其接受的对象；验证（validating）控制器则不行。

准入控制过程分为两个阶段。第一阶段，运行变更准入控制器。第二阶段，运行验证准入控制器。
再次提醒，某些控制器既是变更准入控制器又是验证准入控制器。

如果任何一个阶段的任何控制器拒绝了该请求，则整个请求将立即被拒绝，并向终端用户返回一个错误。

<!--
Finally, in addition to sometimes mutating the object in question, admission
controllers may sometimes have side effects, that is, mutate related
resources as part of request processing. Incrementing quota usage is the
canonical example of why this is necessary. Any such side-effect needs a
corresponding reclamation or reconciliation process, as a given admission
controller does not know for sure that a given request will pass all of the
other admission controllers.
-->

最后，除了对对象进行变更外，准入控制器还可以有其它作用：将相关资源作为请求处理的一部分进行变更。
增加使用配额就是一个典型的示例，说明了这样做的必要性。
此类用法都需要相应的回收或回调过程，因为任一准入控制器都无法确定某个请能否通过所有其它准入控制器。

<!--
## Why do I need them?
-->
## 为什么需要准入控制器？

<!--
Many advanced features in Kubernetes require an admission controller to be enabled in order
to properly support the feature.  As a result, a Kubernetes API server that is not properly
configured with the right set of admission controllers is an incomplete server and will not
support all the features you expect.
-->
Kubernetes 的许多高级功能都要求启用一个准入控制器，以便正确地支持该特性。因此，没有正确配置准入控制器的 Kubernetes API 服务器是不完整的，它无法支持您期望的所有特性。

<!--
## How do I turn on an admission controller?
-->

## 如何启用一个准入控制器？

<!--
The Kubernetes API server flag `enable-admission-plugins` takes a comma-delimited list of admission control plugins to invoke prior to modifying objects in the cluster.
For example, the following command line enables the `NamespaceLifecycle` and the `LimitRanger`
admission control plugins:
-->
Kubernetes API 服务器的 `enable-admission-plugins` 标志，它指定了一个用于在集群修改对象之前调用的（以逗号分隔的）准入控制插件顺序列表。

例如，下面的命令就启用了 `NamespaceLifecycle` 和 `LimitRanger` 准入控制插件：

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
根据您 Kubernetes 集群的部署方式以及 API 服务器的启动方式的不同，您可能需要以不同的方式应用设置。
例如，如果将 API 服务器部署为 systemd 服务，你可能需要修改 systemd 单元文件；
如果以自托管方式部署 Kubernetes，你可能需要修改 API 服务器的清单文件。
{{< /note >}}

<!--
## How do I turn off an admission controller?

The Kubernetes API server flag `disable-admission-plugins` takes a comma-delimited list of admission control plugins to be disabled, even if they are in the list of plugins enabled by default.
-->

## 怎么关闭准入控制器？

Kubernetes API 服务器的 `disable-admission-plugins` 标志，会将传入的（以逗号分隔的）准入控制插件列表禁用，即使是默认启用的插件也会被禁用。

```shell
kube-apiserver --disable-admission-plugins=PodNodeSelector,AlwaysDeny ...
```

<!--
## Which plugins are enabled by default?

To see which admission plugins are enabled:
-->

## 哪些插件是默认启用的？

下面的命令可以查看哪些插件是默认启用的：

```shell
kube-apiserver -h | grep enable-admission-plugins
```

<!--
In 1.16, they are:
-->

在 1.16 中，它们是：

```shell
NamespaceLifecycle, LimitRanger, ServiceAccount, TaintNodesByCondition, Priority, DefaultTolerationSeconds, DefaultStorageClass, StorageObjectInUseProtection, PersistentVolumeClaimResize, MutatingAdmissionWebhook, ValidatingAdmissionWebhook, RuntimeClass, ResourceQuota
```

<!--
## What does each admission controller do?

### AlwaysAdmit {#alwaysadmit} {{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

This admission controller allows all pods into the cluster. It is deprecated because its behavior is the same as if there were no admission controller at all.
-->

## 每个准入控制器的作用是什么？

### AlwaysAdmit {#alwaysadmit} {{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

该准入控制器会允许所有的 pod 接入集群。已废弃，因为它的行为根本就和没有准入控制器一样。

### AlwaysPullImages {#alwayspullimages}

<!--
This admission controller modifies every new Pod to force the image pull policy to Always. This is useful in a
multitenant cluster so that users can be assured that their private images can only be used by those
who have the credentials to pull them. Without this admission controller, once an image has been pulled to a
node, any pod from any user can use it simply by knowing the image's name (assuming the Pod is
scheduled onto the right node), without any authorization check against the image. When this admission controller
is enabled, images are always pulled prior to starting containers, which means valid credentials are
required.
-->
该准入控制器会修改每一个新创建的 Pod 的镜像拉取策略为 Always 。
这在多租户集群中是有用的，这样用户就可以放心，他们的私有镜像只能被那些有凭证的人使用。
如果没有这个准入控制器，一旦镜像被拉取到节点上，任何用户的 pod 都可以通过已了解到的镜像的名称（假设 pod 被调度到正确的节点上）来使用它，而不需要对镜像进行任何授权检查。
当启用这个准入控制器时，总是在启动容器之前拉取镜像，这意味着需要有效的凭证。

### AlwaysDeny {#alwaysdeny} {{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

<!--
Rejects all requests. AlwaysDeny is DEPRECATED as no real meaning.
-->
拒绝所有的请求。由于没有实际意义，已废弃。

### DefaultStorageClass {#defaultstorageclass}

<!--
This admission controller observes creation of `PersistentVolumeClaim` objects that do not request any specific storage class
and automatically adds a default storage class to them.
This way, users that do not request any special storage class do not need to care about them at all and they
will get the default one.
-->

该准入控制器监测没有请求任何特定存储类的 `PersistentVolumeClaim` 对象的创建，并自动向其添加默认存储类。
这样，没有任何特殊存储类需求的用户根本不需要关心它们，它们将获得默认存储类。

<!--
This admission controller does not do anything when no default storage class is configured. When more than one storage
class is marked as default, it rejects any creation of `PersistentVolumeClaim` with an error and an administrator
must revisit their `StorageClass` objects and mark only one as default.
This admission controller ignores any `PersistentVolumeClaim` updates; it acts only on creation.
-->

当未配置默认存储类时，此准入控制器不执行任何操作。如果将多个存储类标记为默认存储类，它将拒绝任何创建 `PersistentVolumeClaim` 的操作，并显示错误。此时准入控制器会忽略任何 `PersistentVolumeClaim` 更新操作，仅响应创建操作。要修复此错误，管理员必须重新访问其 `StorageClass` 对象，并仅将其中一个标记为默认。

<!--
See [persistent volume](/docs/concepts/storage/persistent-volumes/) documentation about persistent volume claims and
storage classes and how to mark a storage class as default.
-->

关于持久化卷和存储类，以及如何将存储类标记为默认，请参见[持久化卷](/docs/concepts/storage/persistent-volumes/)。

### DefaultTolerationSeconds {#defaulttolerationseconds}

<!--
This admission controller sets the default forgiveness toleration for pods to tolerate
the taints `notready:NoExecute` and `unreachable:NoExecute` for 5 minutes,
if the pods don't already have toleration for taints
`node.kubernetes.io/not-ready:NoExecute` or
`node.alpha.kubernetes.io/unreachable:NoExecute`.
-->

该准入控制器为 Pod 设置默认的容忍度，在 5 分钟内容忍 `notready:NoExecute` 和 `unreachable:NoExecute` 污点。（如果 Pod 尚未容忍 `node.kubernetes.io/not-ready：NoExecute` 和 `node.alpha.kubernetes.io/unreachable：NoExecute` 污点的话）

### DenyExecOnPrivileged {#denyexeconprivileged} {{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

<!--
This admission controller will intercept all requests to exec a command in a pod if that pod has a privileged container.
-->
如果一个 pod 拥有一个特权容器，该准入控制器将拦截所有在该 pod 中执行 exec 命令的请求。

<!--
This functionality has been merged into [DenyEscalatingExec](#denyescalatingexec).
The DenyExecOnPrivileged admission plugin is deprecated and will be removed in v1.18.
-->

此功能已合并至 [DenyEscalatingExec](#denyescalatingexec)。
而 DenyExecOnPrivileged 准入插件已被废弃，并将在 v1.18 被移除。

<!--
Use of a policy-based admission plugin (like [PodSecurityPolicy](#podsecuritypolicy) or a custom admission plugin)
which can be targeted at specific users or Namespaces and also protects against creation of overly privileged Pods
is recommended instead.
-->

建议使用基于策略的准入插件（例如 [PodSecurityPolicy](#podsecuritypolicy) 和自定义准入插件），
该插件可以针对特定用户或命名空间，还可以防止创建权限过高的 Pod。

### DenyEscalatingExec {#denyescalatingexec} {{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

<!--
This admission controller will deny exec and attach commands to pods that run with escalated privileges that
allow host access.  This includes pods that run as privileged, have access to the host IPC namespace, and
have access to the host PID namespace.
-->

该准入控制器将拒绝在由于拥有升级特权，而具备访问宿主机能力的 pod 中执行 exec 和 attach 命令。这包括在特权模式运行的 pod ，可以访问主机 IPC 命名空间的 pod ，和访问主机 PID 命名空间的 pod 。

<!--
The DenyEscalatingExec admission plugin is deprecated and will be removed in v1.18.

Use of a policy-based admission plugin (like [PodSecurityPolicy](#podsecuritypolicy) or a custom admission plugin)
which can be targeted at specific users or Namespaces and also protects against creation of overly privileged Pods
is recommended instead.
-->

DenyExecOnPrivileged 准入插件已被废弃，并将在 v1.18 被移除。

建议使用基于策略的准入插件（例如 [PodSecurityPolicy](#podsecuritypolicy) 和自定义准入插件），
该插件可以针对特定用户或命名空间，还可以防止创建权限过高的 Pod。

### EventRateLimit {#eventratelimit} {{< feature-state for_k8s_version="v1.13" state="alpha" >}}

<!--
This admission controller mitigates the problem where the API server gets flooded by
event requests. The cluster admin can specify event rate limits by:
-->

该准入控制器缓解了事件请求淹没 API 服务器的问题。集群管理员可以通过以下方式指定事件速率限制：

<!--
 * Ensuring that `eventratelimit.admission.k8s.io/v1alpha1=true` is included in the
   `--runtime-config` flag for the API server;
 * Enabling the `EventRateLimit` admission controller;
 * Referencing an `EventRateLimit` configuration file from the file provided to the API
   server's command line flag `--admission-control-config-file`:
-->

 * 确保 API 服务器的 `--runtime-config` 标志中包含了 `eventratelimit.admission.k8s.io/v1alpha1=true`；
 * 启用 `EventRateLimit` 准入控制器；
 * 从文件中引用 `EventRateLimit` 配置文件，并提供给 API 服务器命令的 `--admission-control-config-file` 标志：

{{< tabs name="eventratelimit_example" >}}
{{% tab name="apiserver.config.k8s.io/v1" %}}
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: EventRateLimit
  path: eventconfig.yaml
...
```
{{% /tab %}}
{{% tab name="apiserver.k8s.io/v1alpha1" %}}
```yaml
# Deprecated in v1.17 in favor of apiserver.config.k8s.io/v1
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: EventRateLimit
  path: eventconfig.yaml
...
```
{{% /tab %}}
{{< /tabs >}}

<!--
There are four types of limits that can be specified in the configuration:
-->

可以在配置中指定四种类型的限制：

<!--
 * `Server`: All event requests received by the API server share a single bucket.
 * `Namespace`: Each namespace has a dedicated bucket.
 * `User`: Each user is allocated a bucket.
 * `SourceAndObject`: A bucket is assigned by each combination of source and
   involved object of the event.
-->

 * `Server`: API 服务器收到的所有事件请求共享一个桶。
 * `Namespace`: 每个命名空间都有一个专用的桶。
 * `User`: 给每个用户都分配一个桶。
 * `SourceAndObject`: 根据事件的源和涉及对象的每种组合分配桶。

<!--
Below is a sample `eventconfig.yaml` for such a configuration:
-->

下面是一个配置示例 `eventconfig.yaml`：

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
See the [EventRateLimit proposal](https://git.k8s.io/community/contributors/design-proposals/api-machinery/admission_control_event_rate_limit.md)
for more details.
-->

详情请参见[事件速率限制提案](https://git.k8s.io/community/contributors/design-proposals/api-machinery/admission_control_event_rate_limit.md)。

### ExtendedResourceToleration {#extendedresourcetoleration}

<!--
This plug-in facilitates creation of dedicated nodes with extended resources.
If operators want to create dedicated nodes with extended resources (like GPUs, FPGAs etc.), they are expected to
[taint the node](/docs/concepts/configuration/taint-and-toleration/#example-use-cases) with the extended resource
name as the key. This admission controller, if enabled, automatically
adds tolerations for such taints to pods requesting extended resources, so users don't have to manually
add these tolerations.
-->

该插件有助于创建可扩展资源的专用节点。
如果运营商想创建可扩展资源的专用节点（如 GPU、FPGA 等），
那他们应该以扩展资源名称作为键名，[为节点设置污点](/docs/concepts/configuration/taint-and-toleration/#example-use-cases)。
如果启用了该准入控制器，会将此类污点的容忍自动添加到请求扩展资源的 Pod 中，用户不必再手动添加这些容忍。

### ImagePolicyWebhook {#imagepolicywebhook}

<!--
The ImagePolicyWebhook admission controller allows a backend webhook to make admission decisions.
-->

ImagePolicyWebhook 准入控制器允许使用一个后端的 webhook 做出准入决策。

<!--
#### Configuration File Format
-->

#### 配置文件格式

<!--
ImagePolicyWebhook uses a configuration file to set options for the behavior of the backend.
This file may be json or yaml and has the following format:
-->

ImagePolicyWebhook 使用配置文件来为后端行为设置配置选项。该文件可以是 json 或 yaml ，并具有以下格式:

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

<!--
Reference the ImagePolicyWebhook configuration file from the file provided to the API server's command line flag `--admission-control-config-file`:
-->
从文件中引用 ImagePolicyWebhook 的配置文件，并将其提供给 API 服务器命令 `--admission-control-config-file` 标志：

{{< tabs name="imagepolicywebhook_example1" >}}
{{% tab name="apiserver.config.k8s.io/v1" %}}
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: ImagePolicyWebhook
  path: imagepolicyconfig.yaml
...
```
{{% /tab %}}
{{% tab name="apiserver.k8s.io/v1alpha1" %}}
```yaml
# Deprecated in v1.17 in favor of apiserver.config.k8s.io/v1
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: ImagePolicyWebhook
  path: imagepolicyconfig.yaml
...
```
{{% /tab %}}
{{< /tabs >}}

<!--
Alternatively, you can embed the configuration directly in the file:
-->

或者，您也可以直接将配置嵌入到文件中：

{{< tabs name="imagepolicywebhook_example2" >}}
{{% tab name="apiserver.config.k8s.io/v1" %}}
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: ImagePolicyWebhook
  configuration:
    imagePolicy:
      kubeConfigFile: <path-to-kubeconfig-file>
      allowTTL: 50
      denyTTL: 50
      retryBackoff: 500
      defaultAllow: true
```
{{% /tab %}}
{{% tab name="apiserver.k8s.io/v1alpha1" %}}
```yaml
# Deprecated in v1.17 in favor of apiserver.config.k8s.io/v1
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: ImagePolicyWebhook
  configuration:
    imagePolicy:
      kubeConfigFile: <path-to-kubeconfig-file>
      allowTTL: 50
      denyTTL: 50
      retryBackoff: 500
      defaultAllow: true
```
{{% /tab %}}
{{< /tabs >}}

<!--
The ImagePolicyWebhook config file must reference a [kubeconfig](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/) formatted file which sets up the connection to the backend. It is required that the backend communicate over TLS.
-->

ImagePolicyWebhook 的配置文件必须引用 [kubeconfig](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/) 格式的文件，该文件设置了到后端的连接，要求后端使用 TLS 进行通信。

<!--
The kubeconfig file's cluster field must point to the remote service, and the user field must contain the returned authorizer.
-->
kubeconfig 文件的 cluster 字段需要指向远端服务，user 字段需要包含已返回的授权者。

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
    server: https://images.example.com/policy # 要查询的远程服务的 URL。必须是 'https' 。

# users 指的是 API 服务器的 Webhook 配置。
users:
- name: name-of-api-server
  user:
    client-certificate: /path/to/cert.pem # webhook 准入控制器使用的证书
    client-key: /path/to/key.pem          # 证书匹配的密钥
```

<!--
For additional HTTP configuration, refer to the [kubeconfig](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/) documentation.
-->

HTTP 更多的配置，请参阅 [kubeconfig](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/) 文档。

<!--
#### Request Payloads
-->
#### 请求载荷

<!--
When faced with an admission decision, the API Server POSTs a JSON serialized `imagepolicy.k8s.io/v1alpha1` `ImageReview` object describing the action. This object contains fields describing the containers being admitted, as well as any pod annotations that match `*.image-policy.k8s.io/*`.
-->
当面对一个准入决策时，API server 发送一个描述操作的 JSON 序列化的 `imagepolicy.k8s.io/v1alpha1` `ImageReview` 对象。该对象包含描述被审核容器的字段，以及所有匹配 `*.image-policy.k8s.io/*` 的 pod 注释。

<!--
Note that webhook API objects are subject to the same versioning compatibility rules as other Kubernetes API objects. Implementers should be aware of looser compatibility promises for alpha objects and check the "apiVersion" field of the request to ensure correct deserialization. Additionally, the API Server must enable the imagepolicy.k8s.io/v1alpha1 API extensions group (`--runtime-config=imagepolicy.k8s.io/v1alpha1=true`).
-->
注意，webhook API 对象与其他 Kubernetes API 对象一样受制于相同的版本控制兼容性规则。实现者应该知道对 alpha 对象的更宽松的兼容性，并检查请求的 "apiVersion" 字段，以确保正确的反序列化。此外，API server 必须启用 imagepolicy.k8s.io/v1alpha1 API 扩展组 (`--runtime-config=imagepolicy.k8s.io/v1alpha1=true`)。

<!--
An example request body:
-->
请求载荷示例：

```json
{
  "apiVersion":"imagepolicy.k8s.io/v1alpha1",
  "kind":"ImageReview",
  "spec":{
    "containers":[
      {
        "image":"myrepo/myimage:v1"
      },
      {
        "image":"myrepo/myimage@sha256:beb6bd6a68f114c1dc2ea4b28db81bdf91de202a9014972bec5e4d9171d90ed"
      }
    ],
    "annotations":{
      "mycluster.image-policy.k8s.io/ticket-1234": "break-glass"
    },
    "namespace":"mynamespace"
  }
}
```

<!--
The remote service is expected to fill the `ImageReviewStatus` field of the request and respond to either allow or disallow access. The response body's "spec" field is ignored and may be omitted. A permissive response would return:
-->
远程服务将填充请求的 `ImageReviewStatus` 字段，并返回允许或不允许访问的响应。响应体的 "spec" 字段会被忽略，并且可以省略。一个允许访问应答会返回：

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
不允许访问，服务将返回：

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
For further documentation refer to the `imagepolicy.v1alpha1` API objects and `plugin/pkg/admission/imagepolicy/admission.go`.
-->
更多的文档，请参阅 `imagepolicy.v1alpha1` API 对象 和 `plugin/pkg/admission/imagepolicy/admission.go`。

<!--
#### Extending with Annotations
-->
#### 使用注解进行扩展

<!--
All annotations on a Pod that match `*.image-policy.k8s.io/*` are sent to the webhook. Sending annotations allows users who are aware of the image policy backend to send extra information to it, and for different backends implementations to accept different information.
-->
一个 pod 中匹配 `*.image-policy.k8s.io/*` 的注解都会被发送给 webhook。这允许了解后端镜像策略的用户向它发送额外的信息，并为不同的后端实现接收不同的信息。

<!--
Examples of information you might put here are:
-->
您可以在这里输入的信息有：

<!--
 * request to "break glass" to override a policy, in case of emergency.
 * a ticket number from a ticket system that documents the break-glass request
 * provide a hint to the policy server as to the imageID of the image being provided, to save it a lookup
-->

 * 在紧急情况下，请求 "break glass" 覆盖一个策略。
 * 从一个记录了 break-glass 的请求的 ticket 系统得到的一个 ticket 号号码。
 * 向策略服务器提供一个提示，用于提供镜像的 imageID，以方便它进行查找。

<!--
In any case, the annotations are provided by the user and are not validated by Kubernetes in any way. In the future, if an annotation is determined to be widely useful, it may be promoted to a named field of `ImageReviewSpec`.
-->
在任何情况下，注解都是由用户提供的，并不会被 Kubernetes 以任何方式进行验证。在将来，如果一个注解确定将被广泛使用，它可能会被提升为  ImageReviewSpec 的一个命名字段。

### LimitPodHardAntiAffinityTopology {#limitpodhardantiaffinitytopology}

<!--
This admission controller denies any pod that defines `AntiAffinity` topology key other than
`kubernetes.io/hostname` in `requiredDuringSchedulingRequiredDuringExecution`.
-->
该准入控制器拒绝（定义了 `Anti Affinity` 拓扑键的）任何 Pod（`requiredDuringSchedulingRequiredDuringExecution` 中的 `kubernetes.io/hostname` 除外）

### LimitRanger {#limitranger}

<!--
This admission controller will observe the incoming request and ensure that it does not violate any of the constraints
enumerated in the `LimitRange` object in a `Namespace`.  If you are using `LimitRange` objects in
your Kubernetes deployment, you MUST use this admission controller to enforce those constraints. LimitRanger can also
be used to apply default resource requests to Pods that don't specify any; currently, the default LimitRanger
applies a 0.1 CPU requirement to all Pods in the `default` namespace.
-->

该准入控制器会观察传入的请求，并确保它不会违反 `Namespace` 中 `LimitRange` 对象枚举的任何约束。如果您在 Kubernetes 部署中使用了 `LimitRange` 对象，则必须使用此准入控制器来执行这些约束。LimitRanger 还可以用于将默认资源请求应用到没有指定任何内容的 Pod；当前，默认的 LimitRanger 对 `default` 命名空间中的所有 pod 都应用了 0.1 CPU 的需求。

<!--
See the [limitRange design doc](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md) and the [example of Limit Range](/docs/tasks/configure-pod-container/limit-range/) for more details.
-->

请查看 [limitRange 设计文档](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md) 和 [Limit Range 例子](/docs/tasks/configure-pod-container/limit-range/)了解更多细节。

### MutatingAdmissionWebhook {#mutatingadmissionwebhook} {{< feature-state for_k8s_version="v1.13" state="beta" >}}

<!--
This admission controller calls any mutating webhooks which match the request. Matching
webhooks are called in serial; each one may modify the object if it desires.

This admission controller (as implied by the name) only runs in the mutating phase.
-->
该准入控制器调用任何与请求匹配的变更 webhook。匹配的 webhook 将被串行调用。每一个 webhook 都可以根据需要修改对象。

`MutatingAdmissionWebhook` ，顾名思义，仅在变更阶段运行。

<!--
If a webhook called by this has side effects (for example, decrementing quota) it
*must* have a reconciliation system, as it is not guaranteed that subsequent
webhooks or validating admission controllers will permit the request to finish.
-->
如果由此准入控制器调用的 Webhook 有副作用（如降低配额），
则它 *必须* 具有协调系统，因为不能保证后续的 Webhook 和验证准入控制器都会允许完成请求。

<!--
If you disable the MutatingAdmissionWebhook, you must also disable the
`MutatingWebhookConfiguration` object in the `admissionregistration.k8s.io/v1beta1`
group/version via the `--runtime-config` flag (both are on by default in
versions >= 1.9).
-->
如果你禁用了 MutatingAdmissionWebhook，那么还必须使用 `--runtime-config` 标志禁止 `admissionregistration.k8s.io/v1beta1` 组/版本中的 `MutatingWebhookConfiguration` 对象（版本 >=1.9 时，这两个对象都是默认启用的）。

<!--
#### Use caution when authoring and installing mutating webhooks
-->
#### 谨慎编写和安装变更 webhook

<!--
 * Users may be confused when the objects they try to create are different from
   what they get back.
 * Built in control loops may break when the objects they try to create are
   different when read back.
   * Setting originally unset fields is less likely to cause problems than
     overwriting fields set in the original request. Avoid doing the latter.
 * This is a beta feature. Future versions of Kubernetes may restrict the types of
   mutations these webhooks can make.
 * Future changes to control loops for built-in resources or third-party resources
   may break webhooks that work well today. Even when the webhook installation API
   is finalized, not all possible webhook behaviors will be guaranteed to be supported
   indefinitely.
-->

 * 当用户尝试创建的对象与返回的对象不同时，用户可能会感到困惑。
 * 当它们回读的对象与尝试创建的对象不同，内建的控制环可能会出问题。
   * 与覆盖原始请求中设置的字段相比，使用原始请求未设置的字段会引起问题的可能性较小。应尽量避免前面那种方式。
 * 这是一个 beta 特性。Kubernetes 未来的版本可能会限制这些 webhook 可以进行的变更类型。
 * 内建资源和第三方资源的控制环，未来可能会受到破坏性的更改，使现在运行良好的 Webhook 无法再正常运行。即使完成了 webhook API 安装，也不代表会为该 webhook 提供无限期的支持。

### NamespaceAutoProvision {#namespaceautoprovision}

<!--
This admission controller examines all incoming requests on namespaced resources and checks
if the referenced namespace does exist.
It creates a namespace if it cannot be found.
This admission controller is useful in deployments that do not want to restrict creation of
a namespace prior to its usage.
-->
该准入控制器会检查命名空间资源上的所有传入请求，并检查所引用的命名空间是否确实存在。如果找不到，它将创建一个命名空间。
此准入控制器对于不想要求命名空间必须先创建后使用的集群部署中很有用。

### NamespaceExists {#namespaceexists}

<!--
This admission controller checks all requests on namespaced resources other than `Namespace` itself.
If the namespace referenced from a request doesn't exist, the request is rejected.
-->
该准入控制器检查除自身 `Namespace` 以外的命名空间资源上的所有请求。如果请求引用的命名空间不存在，则拒绝该请求。

### NamespaceLifecycle {#namespacelifecycle}

<!--
This admission controller enforces that a `Namespace` that is undergoing termination cannot have new objects created in it,
and ensures that requests in a non-existent `Namespace` are rejected. This admission controller also prevents deletion of
three system reserved namespaces `default`, `kube-system`, `kube-public`.
-->
该准入控制器禁止在一个正在被终止的 `Namespace` 中创建新对象，并确保使用不存在的 `Namespace` 的请求被拒绝。
该准入控制器还会禁止删除三个系统保留的命名空间，即 `default`、`kube-system` 和 `kube-public`。

<!--
A `Namespace` deletion kicks off a sequence of operations that remove all objects (pods, services, etc.) in that
namespace.  In order to enforce integrity of that process, we strongly recommend running this admission controller.
-->
删除 `Namespace` 会触发删除该命名空间中所有对象（pod、services 等）的一系列操作。为了确保这个过程的完整性，我们强烈建议启用这个准入控制器。

### NodeRestriction {#noderestriction}

<!--
This admission controller limits the `Node` and `Pod` objects a kubelet can modify. In order to be limited by this admission controller,
kubelets must use credentials in the `system:nodes` group, with a username in the form `system:node:<nodeName>`.
Such kubelets will only be allowed to modify their own `Node` API object, and only modify `Pod` API objects that are bound to their node.
-->
该准入控制器限制了 kubelet 可以修改的 `Node` 和 `Pod` 对象。 为了受到这个准入控制器的限制，kubelet 必须使用在 `system:nodes` 组中的凭证，并使用 `system:node:<nodeName>` 形式的用户名。这样，kubelet 只可修改自己的 `Node` API 对象，只能修改绑定到节点本身的 `Pod` 对象。

<!--
In Kubernetes 1.11+, kubelets are not allowed to update or remove taints from their `Node` API object.

In Kubernetes 1.13+, the `NodeRestriction` admission plugin prevents kubelets from deleting their `Node` API object,
and enforces kubelet modification of labels under the `kubernetes.io/` or `k8s.io/` prefixes as follows:
-->
在 Kubernetes 1.11+ 的版本中，不允许 kubelet 从 `Node` API 对象中更新或删除污点。

在 Kubernetes 1.13+ 的版本中，`NodeRestriction` 准入插件可防止 kubelet 删除 `Node` API 对象，并对 `kubernetes.io/` 或 `k8s.io/` 前缀标签的 kubelet 强制进行如下修改：

<!--
* **Prevents** kubelets from adding/removing/updating labels with a `node-restriction.kubernetes.io/` prefix.
This label prefix is reserved for administrators to label their `Node` objects for workload isolation purposes,
and kubelets will not be allowed to modify labels with that prefix.
* **Allows** kubelets to add/remove/update these labels and label prefixes:
-->

* **防止** kubelets 添加/删除/更新带有 `node-restriction.kubernetes.io/` 前缀的标签。保留此前缀的标签，供管理员用来标记 `Node` 对象以隔离工作负载，并且不允许 kubelet 修改带有该前缀的标签。
* **允许** kubelet 添加/删除/更新这些和这些前缀的标签：
  * `kubernetes.io/hostname`
  * `kubernetes.io/arch`
  * `kubernetes.io/os`
  * `beta.kubernetes.io/instance-type`
  * `node.kubernetes.io/instance-type`
  * `failure-domain.beta.kubernetes.io/region`
  * `failure-domain.beta.kubernetes.io/zone`
  * `topology.kubernetes.io/region`
  * `topology.kubernetes.io/zone`
  * `kubelet.kubernetes.io/`-prefixed labels
  * `node.kubernetes.io/`-prefixed labels

<!--
Use of any other labels under the `kubernetes.io` or `k8s.io` prefixes by kubelets is reserved, and may be disallowed or allowed by the `NodeRestriction` admission plugin in the future.

Future versions may add additional restrictions to ensure kubelets have the minimal set of permissions required to operate correctly.
-->
kubelet 保留 `kubernetes.io` 或 `k8s.io` 前缀的所有标签，并且将来可能会被 `NodeRestriction` 准入插件允许或禁止。

将来的版本可能会增加其他限制，以确保 kubelet 具有正常运行所需的最小权限集。

### OwnerReferencesPermissionEnforcement {#ownerreferencespermissionenforcement}

<!--
This admission controller protects the access to the `metadata.ownerReferences` of an object
so that only users with "delete" permission to the object can change it.
This admission controller also protects the access to `metadata.ownerReferences[x].blockOwnerDeletion`
of an object, so that only users with "update" permission to the `finalizers`
subresource of the referenced *owner* can change it.
-->

该准入控制器保护对 `metadata.ownerReferences` 对象的访问，以便只有对该对象具有 “删除” 权限的用户才能对其进行更改。该准入控制器还保护对 `metadata.ownerReferences[x].blockOwnerDeletion` 对象的访问，以便只有对所引用的 **属主（owner）** 的 `finalizers` 子资源具有 “更新” 权限的用户才能对其进行更改。

### PersistentVolumeLabel {#persistentvolumelabel} {{< feature-state for_k8s_version="v1.13" state="deprecated" >}}

<!--
This admission controller automatically attaches region or zone labels to PersistentVolumes
as defined by the cloud provider (for example, GCE or AWS).
It helps ensure the Pods and the PersistentVolumes mounted are in the same
region and/or zone.
If the admission controller doesn't support automatic labelling your PersistentVolumes, you
may need to add the labels manually to prevent pods from mounting volumes from
a different zone. PersistentVolumeLabel is DEPRECATED and labeling persistent volumes has been taken over by
[cloud controller manager](/docs/tasks/administer-cluster/running-cloud-controller/).
Starting from 1.11, this admission controller is disabled by default.
-->
该准入控制器会自动将区（region）或区域（zone）标签附加到由云提供商（如 GCE、AWS）定义的 PersistentVolumes 中。
这有助于确保 Pod 和 PersistentVolume 位于相同的区或区域。
如果准入控制器不支持为 PersistentVolumes 自动添加标签，那你可能需要手动添加标签，以防止 Pod 挂载其他区域的卷。
PersistentVolumeLabel 已被废弃，标记持久卷已由[云管理控制器](/docs/tasks/administer-cluster/running-cloud-controller/)接管。
从 1.11 开始，默认情况下禁用此准入控制器。

### PodNodeSelector {#podnodeselector}

<!--
This admission controller defaults and limits what node selectors may be used within a namespace by reading a namespace annotation and a global configuration.
-->
该准入控制器通过读取命名空间注解和全局配置，来为命名空间中可以可以使用的节点选择器设置默认值并实施限制。

<!--
#### Configuration File Format

`PodNodeSelector` uses a configuration file to set options for the behavior of the backend.
Note that the configuration file format will move to a versioned file in a future release.
This file may be json or yaml and has the following format:
-->

#### 配置文件格式

`PodNodeSelector` 使用配置文件来设置后端行为的选项。
请注意，配置文件格式将在将来某个版本中迁移为版本化文件。
该文件可以是 json 或 yaml，格式如下：

```yaml
podNodeSelectorPluginConfig:
 clusterDefaultNodeSelector: name-of-node-selector
 namespace1: name-of-node-selector
 namespace2: name-of-node-selector
```

<!--
Reference the `PodNodeSelector` configuration file from the file provided to the API server's command line flag `--admission-control-config-file`:
-->
从文件中引用 `PodNodeSelector` 配置文件，提供给 API 服务器命令行标志 `--admission-control-config-file`：

{{< tabs name="podnodeselector_example1" >}}
{{% tab name="apiserver.config.k8s.io/v1" %}}
```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodNodeSelector
  path: podnodeselector.yaml
...
```
{{% /tab %}}
{{% tab name="apiserver.k8s.io/v1alpha1" %}}
```yaml
# Deprecated in v1.17 in favor of apiserver.config.k8s.io/v1
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: PodNodeSelector
  path: podnodeselector.yaml
...
```
{{% /tab %}}
{{< /tabs >}}

<!--
#### Configuration Annotation Format

`PodNodeSelector` uses the annotation key `scheduler.alpha.kubernetes.io/node-selector` to assign node selectors to namespaces.
-->
#### 配置注解格式

`PodNodeSelector` 使用键为 `scheduler.alpha.kubernetes.io/node-selector` 的注解将节点选择器分配给命名空间。

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

#### 内部行为

该准入控制器行为如下：

<!--
1. If the `Namespace` has an annotation with a key `scheduler.alpha.kubernetes.io/node-selector`, use its value as the
node selector.
2. If the namespace lacks such an annotation, use the `clusterDefaultNodeSelector` defined in the `PodNodeSelector`
plugin configuration file as the node selector.
3. Evaluate the pod's node selector against the namespace node selector for conflicts. Conflicts result in rejection.
4. Evaluate the pod's node selector against the namespace-specific whitelist defined the plugin configuration file.
Conflicts result in rejection.
-->
1. 如果 `Namespace` 的注解带有键 `scheduler.alpha.kubernetes.io/node-selector` ，则将其值用作节点选择器。
2. 如果命名空间缺少此类注解，则使用 `PodNodeSelector` 插件配置文件中定义的 `clusterDefaultNodeSelector` 作为节点选择器。
3. 评估 pod 节点选择器和命名空间节点选择器是否存在冲突。存在冲突将导致拒绝。
4. 评估 pod 节点选择器和命名空间的白名单定义的插件配置文件是否存在冲突。存在冲突将导致拒绝。

{{< note >}}
<!--
PodNodeSelector allows forcing pods to run on specifically labeled nodes. Also see the PodTolerationRestriction
admission plugin, which allows preventing pods from running on specifically tainted nodes.
-->
PodNodeSelector 允许 Pod 强制在特定标签的节点上运行。另请参阅 PodTolerationRestriction 准入插件，该插件可防止 Pod 在特定污点的节点上运行。
{{< /note >}}

### PersistentVolumeClaimResize {#persistentvolumeclaimresize}

<!--
This admission controller implements additional validations for checking incoming `PersistentVolumeClaim` resize requests.
-->
该准入控制器检查传入的 `PersistentVolumeClaim` 调整大小请求，对其执行额外的验证操作。

{{< note >}}
<!--
Support for volume resizing is available as an alpha feature. Admins must set the feature gate `ExpandPersistentVolumes`
to `true` to enable resizing.
-->
对调整卷大小的支持是一种 Alpha 特性。管理员必须将特性门控 `ExpandPersistentVolumes` 设置为 `true` 才能启用调整大小。
{{< /note >}}

<!--
After enabling the `ExpandPersistentVolumes` feature gate, enabling the `PersistentVolumeClaimResize` admission
controller is recommended, too. This admission controller prevents resizing of all claims by default unless a claim's `StorageClass`
 explicitly enables resizing by setting `allowVolumeExpansion` to `true`.

For example: all `PersistentVolumeClaim`s created from the following `StorageClass` support volume expansion:
-->
启用 `ExpandPersistentVolumes` 特性门控之后，建议将 `PersistentVolumeClaimResize` 准入控制器也启用。除非 PVC 的 `StorageClass` 明确地将 `allowVolumeExpansion` 设置为 `true` 来显式启用调整大小。否则，默认情况下该准入控制器会阻止所有对 PVC 大小的调整。

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

关于持久化卷申领的更多信息，请参见 [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)。

### PodPreset {#podpreset}

<!--
This admission controller injects a pod with the fields specified in a matching PodPreset.
See also [PodPreset concept](/docs/concepts/workloads/pods/podpreset/) and
[Inject Information into Pods Using a PodPreset](/docs/tasks/inject-data-application/podpreset)
for more information.
-->

该准入控制器根据与 PodPreset 中条件的匹配情况，将指定字段注入一个 pod。
另请参见 [PodPreset 概念](/docs/concepts/workloads/pods/podpreset/)和[使用 PodPreset 将信息注入 Pod](/docs/tasks/inject-data-application/podpreset) 获取详情。

### PodSecurityPolicy {#podsecuritypolicy}

<!--
This admission controller acts on creation and modification of the pod and determines if it should be admitted
based on the requested security context and the available Pod Security Policies.
-->
此准入控制器负责在创建和修改 pod 时根据请求的安全上下文和可用的 pod 安全策略确定是否可以执行请求。

<!--
For Kubernetes < 1.6.0, the API Server must enable the extensions/v1beta1/podsecuritypolicy API
extensions group (`--runtime-config=extensions/v1beta1/podsecuritypolicy=true`).
-->
对于 Kubernetes < 1.6.0 的版本，API Server 必须启用 extensions/v1beta1/podsecuritypolicy API 扩展组 (`--runtime-config=extensions/v1beta1/podsecuritypolicy=true`)。

<!--
See also [Pod Security Policy documentation](/docs/concepts/policy/pod-security-policy/)
for more information.
-->
查看 [Pod 安全策略文档](/docs/concepts/policy/pod-security-policy/)了解更多细节。

### PodTolerationRestriction {#podtolerationrestriction}

<!--
This admission controller first verifies any conflict between a pod's tolerations and its
namespace's tolerations, and rejects the pod request if there is a conflict.
It then merges the namespace's tolerations into the pod's tolerations.
The resulting tolerations are checked against the namespace's whitelist of
tolerations. If the check succeeds, the pod request is admitted otherwise
rejected.
-->

该准入控制器首先验证 Pod 的容忍度与其命名空间的容忍度之间的冲突。如果存在冲突，则拒绝 Pod 请求。
然后，它将命名空间的容忍度合并到 pod 的容忍度中，之后根据命名空间的容忍度白名单检查所得到的容忍度结果。
如果检查成功，则将接受 pod 请求，否则拒绝该请求。

<!--
If the pod's namespace does not have any associated default or whitelist of
tolerations, then the cluster-level default or whitelist of tolerations are used
instead if specified.
-->

如果 pod 的命名空间没有任何关联的默认容忍度或容忍度白名单，则使用集群级别的默认容忍度或容忍度白名单（如果有的话）。

<!--
Tolerations to a namespace are assigned via the
`scheduler.alpha.kubernetes.io/defaultTolerations` and
`scheduler.alpha.kubernetes.io/tolerationsWhitelist`
annotation keys.
-->
命名空间的容忍度通过注解健 `scheduler.alpha.kubernetes.io/defaultTolerations` 和 `scheduler.alpha.kubernetes.io/tolerationsWhitelist` 设置。


<!--
### Priority {#priority}

The priority admission controller uses the `priorityClassName` field and populates the integer value of the priority. If the priority class is not found, the Pod is rejected.
-->

### 优先级 {#priority}

优先级准入控制器使用 `priorityClassName` 字段并用整型值填充优先级。如果找不到优先级，则拒绝 Pod。

### ResourceQuota {#resourcequota}

<!--
This admission controller will observe the incoming request and ensure that it does not violate any of the constraints
enumerated in the `ResourceQuota` object in a `Namespace`.  If you are using `ResourceQuota`
objects in your Kubernetes deployment, you MUST use this admission controller to enforce quota constraints.
-->
该准入控制器会监测传入的请求，并确保它不违反任何一个 `Namespace` 中的 `ResourceQuota` 对象中枚举出来的约束。
如果您在 Kubernetes 部署中使用了 `ResourceQuota` ，您必须使用这个准入控制器来强制执行配额限制。

<!--
See the [resourceQuota design doc](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_resource_quota.md) and the [example of Resource Quota](/docs/concepts/policy/resource-quotas/) for more details.
-->
请查看 [resourceQuota 设计文档](https://git.k8s.io/community/contributors/design-proposals/admission_control_resource_quota.md)和 [Resource Quota 例子](/docs/concepts/policy/resource-quotas/)了解更多细节。


<!--
### RuntimeClass {#runtimeclass} {{< feature-state for_k8s_version="v1.16" state="alpha" >}}

For [RuntimeClass](/docs/concepts/containers/runtime-class/) definitions which describe an overhead associated with running a pod,
this admission controller will set the pod.Spec.Overhead field accordingly.

See also [Pod Overhead](/docs/concepts/configuration/pod-overhead/)
for more information.
-->

### 容器运行时类 {#runtimeclass} {{< feature-state for_k8s_version="v1.16" state="alpha" >}}

[容器运行时类](/docs/concepts/containers/runtime-class/)定义描述了与运行 Pod 相关的开销。此准入控制器将相应地设置 pod.Spec.Overhead 字段。

详情请参见 [Pod 开销](/docs/concepts/configuration/pod-overhead/)。

### SecurityContextDeny {#securitycontextdeny}

<!--
This admission controller will deny any pod that attempts to set certain escalating [SecurityContext](/docs/user-guide/security-context) fields. This should be enabled if a cluster doesn't utilize [pod security policies](/docs/user-guide/pod-security-policy) to restrict the set of values a security context can take.
-->
该准入控制器将拒绝任何试图设置特定提升 [SecurityContext](/docs/user-guide/security-context) 字段的 pod。
如果集群没有使用 [pod 安全策略](/docs/user-guide/pod-security-policy)来限制安全上下文所能获取的值集，那么应该启用这个功能。

### ServiceAccount {#serviceaccount}

<!--
This admission controller implements automation for [serviceAccounts](/docs/user-guide/service-accounts).
We strongly recommend using this admission controller if you intend to make use of Kubernetes `ServiceAccount` objects.
-->
该准入控制器实现了 [serviceAccounts](/docs/user-guide/service-accounts) 的自动化。
如果您打算使用 Kubernetes 的 ServiceAccount 对象，我们强烈建议您使用这个准入控制器。

### StorageObjectInUseProtection

<!--
The `StorageObjectInUseProtection` plugin adds the `kubernetes.io/pvc-protection` or `kubernetes.io/pv-protection` finalizers to newly created Persistent Volume Claims (PVCs) or Persistent Volumes (PV). In case a user deletes a PVC or PV the PVC or PV is not removed until the finalizer is removed from the PVC or PV by PVC or PV Protection Controller. Refer to the [Storage Object in Use Protection](/docs/concepts/storage/persistent-volumes/#storage-object-in-use-protection) for more detailed information.
-->
`StorageObjectInUseProtection` 插件将 `kubernetes.io/pvc-protection` 或 `kubernetes.io/pv-protection` finalizers 添加到新创建的持久化卷声明（PVC）或持久化卷（PV）中。 如果用户尝试删除 PVC/PV，除非 PVC/PV 的保护控制器移除 finalizers，否则 PVC/PV 不会被删除。有关更多详细信息，请参考[保护使用中的存储对象](/docs/concepts/storage/persistent-volumes/#storage-object-in-use-protection)。

### TaintNodesByCondition {#taintnodesbycondition} {{< feature-state for_k8s_version="v1.12" state="beta" >}}

<!--
This admission controller {{< glossary_tooltip text="taints" term_id="taint" >}} newly created Nodes as `NotReady` and `NoSchedule`. That tainting avoids a race condition that could cause Pods to be scheduled on new Nodes before their taints were updated to accurately reflect their reported conditions.
-->
该准入控制器 {{< glossary_tooltip text="污点" term_id="taint" >}} 新创建的 `NotReady` 和 `NoSchedule` 节点。
避免了可能导致 Pod 在更新其污点以准确反映其所报告状况之前，就安排了在新节点上的竞争条件的情况。

### ValidatingAdmissionWebhook {#validatingadmissionwebhook} {{< feature-state for_k8s_version="v1.13" state="beta" >}}

<!--
This admission controller calls any validating webhooks which match the request. Matching
webhooks are called in parallel; if any of them rejects the request, the request
fails. This admission controller only runs in the validation phase; the webhooks it calls may not
mutate the object, as opposed to the webhooks called by the `MutatingAdmissionWebhook` admission controller.
-->
该准入控制器调用与请求匹配的所有验证 webhook。匹配的 webhook 将被并行调用。如果其中任何一个拒绝请求，则整个请求将失败。
该准入控制器仅在验证阶段运行；与 `MutatingAdmissionWebhook` 准入控制器所调用的 webhook 相反，它调用的 webhook 应该不会使对象出现变更。

<!--
If a webhook called by this has side effects (for example, decrementing quota) it
*must* have a reconciliation system, as it is not guaranteed that subsequent
webhooks or other validating admission controllers will permit the request to finish.
-->
如果以此方式调用的 webhook 有其它作用（如，配额递减），则它必须具有协调系统，因为不能保证后续的 webhook 或其他有效的准入控制器都允许请求完成。

<!-
If you disable the ValidatingAdmissionWebhook, you must also disable the
`ValidatingWebhookConfiguration` object in the `admissionregistration.k8s.io/v1beta1`
group/version via the `--runtime-config` flag (both are on by default in
versions 1.9 and later).
-->
如果您禁用了 ValidatingAdmissionWebhook，还必须在 `admissionregistration.k8s.io/v1beta1` 组/版本中使用 `--runtime-config` 标志来禁用 `ValidatingWebhookConfiguration` 对象（默认情况下在 1.9 版和更高版本中均处于启用状态）。


<!--
## Is there a recommended set of admission controllers to use?

Yes. For Kubernetes version 1.10 and later, the recommended admission controllers are enabled by default (shown [here](/docs/reference/command-line-tools-reference/kube-apiserver/#options)), so you do not need to explicitly specify them. You can enable additional admission controllers beyond the default set using the `--enable-admission-plugins` flag (**order doesn't matter**).
-->
## 有推荐的准入控制器吗？

有，对于 Kubernetes 1.10 以上的版本，推荐使用的准入控制器默认情况下都处于启用状态（查看[这里](/docs/reference/command-line-tools-reference/kube-apiserver/#options)）。
因此您无需显式指定它们。您可以使用 `--enable-admission-plugins` 标志（ **顺序不重要** ）来启用默认设置以外的其他准入控制器。

{{< note >}}
<!--
`--admission-control` was deprecated in 1.10 and replaced with `--enable-admission-plugins`.
-->
`--admission-control` 在 1.10 中已废弃，已由 `--enable-admission-plugins` 取代。
{{< /note >}}

<!--
For Kubernetes 1.9 and earlier, we recommend running the following set of admission controllers using the `--admission-control` flag (**order matters**).
-->

对于 Kubernetes 1.9 及更早版本，我们建议使用 `--admission-control` 标志（**顺序很重要**）运行下面的一组准入控制器。

* v1.9

  ```shell
  --admission-control=NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota
  ```

<!--
  * It's worth reiterating that in 1.9, these happen in a mutating phase
and a validating phase, and that for example `ResourceQuota` runs in the validating
phase, and therefore is the last admission controller to run.
`MutatingAdmissionWebhook` appears before it in this list, because it runs
in the mutating phase.
-->

* 需要重申的是，在 1.9 中，它们都发生在变更阶段和验证阶段，例如 `ResourceQuota` 在验证阶段运行，因此是最后一个运行的准入控制器。
  `MutatingAdmissionWebhook` 出现在此列表的前面，因为它在变更阶段运行。

<!--
    For earlier versions, there was no concept of validating versus mutating and the
admission controllers ran in the exact order specified.
-->
    对于更早期版本，没有验证和变更的概念，并且准入控制器按照指定的确切顺序运行。

{{% /capture %}}
