---
assignees:
- bprashanth
- davidopp
- derekwaynecarr
- erictune
- janetkuo
- thockin
title: 使用准入控制器
---

* TOC
{:toc}

## 它们是什么？

准入控制插件是拦截对 Kubernetes 的请求的一段代码
API 服务器在对象持久化之前，但在请求被认证和
授权后. 插件代码在 API 服务器进程中
并且必须被编译成二进制以便在这个时候被使用.

在请求被接收到集群中之前，每个准入控制插件都将按顺序运行. 如果
序列中的任何插件拒绝请求，整个请求将立即被拒绝
并将错误返回给最终用户.

准入控制插件在某些情况下可能会改变传入对象，以应用系统配置
默认值. 此外，准入控制插件可能会将相关资源变为请求的一部分
处理做增量配额使用等事情.

## 为什么我需要它们？

Kubernetes 中的许多高级功能需要启用准入控制插件
以正确支持该功能. 因此，Kubernetes API 服务器不正确
配置准入控制插件是一个不完整的服务器，不会
支持您期望的所有功能.

## 如何打开准入控制插件？

Kubernetes API 服务器支持一个标志，`accept-control`，以逗号分隔，
在修改集群中的对象之前调用准入控制选项的有序列表.

##每个插件做什么？

### AlwaysAdmit

使用这个插件本身来传递所有的请求.

### AlwaysPullImages

该插件修改每个新的 Pod，强制图像拉动策略为 Always. 这在一个
多租户群集有用，所以用户可以确保他们的私人图像只能被那些
有资格拉他们的使用. 没有这个插件，一旦图像被拉到一个
节点，任何用户的任何 pod 可以通过知道图像的名称(假设 Pod 被
安排在正确的节点上)，无需任何授权检查图像. 当这个插件
启用，图像始终在启动容器之前，这意味着有效的凭据
是需要的.

### AlwaysDeny

拒绝所有请求. 用于测试.

### DenyExecOnPrivileged(已弃用)

该插件将拦截所有请求以执行一个 pod 中的命令，如果该 pod 有一个特权容器.

如果您的集群支持特权容器，并且希望限制最终用户执行
这些容器中的命令，我们强烈建议启用此插件.

此功能已合并到[DenyEscalatingExec](#denyescalatingexec)中.

### DenyEscalatingExec

此插件将拒绝执行并附加命令到运行与升级特权的pod
允许主机访问. 这包括以特权运行的 pod，可以访问主机 IPC 命名空间，以及
可以访问主机 PID 命名空间.

如果您的集群支持使用升级的权限运行的容器，并且您希望
限制最终用户在这些容器中执行命令的能力，我们强烈建议
启用此插件.

### ImagePolicyWebhook

ImagePolicyWebhook 插件允许后端 webhook 作出准入决定. 您可以通过设置接纳控制选项来启用此插件，如下所示:

```shell
--admission-control=ImagePolicyWebhook
```

#### 配置文件格式
ImagePolicyWebhook 使用入口配置文件`--admission-control-config-file`设置后端行为的配置选项. 此文件可能是 json或yaml，并具有以下格式:

```javascript
{
  "imagePolicy": {
     "kubeConfigFile": "path/to/kubeconfig/for/backend",
     "allowTTL": 50,           // time in s to cache approval
     "denyTTL": 50,            // time in s to cache denial
     "retryBackoff": 500,      // time in ms to wait between retries
     "defaultAllow": true      // determines behavior if the webhook backend fails
  }
}
```

配置文件必须引用设置与后端的连接的[kubeconfig](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/)格式文件. 需要后端通过 TLS 进行通信.

kubeconfig 文件的集群字段必须指向远程服务，用户字段必须包含返回的授权方.

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
    client-certificate: /path/to/cert.pem # cert for the webhook plugin to use
    client-key: /path/to/key.pem          # key matching the cert
```
有关其他 HTTP 配置，请参阅[kubeconfig](/docs/concepts/cluster-administration/authenticate-across-clusters-kubeconfig/)文档.

#### 请求有效负载

当面临准入决定时，API 服务器会发布描述该操作的 JSON 序列化 api.imagepolicy.v1alpha1.ImageReview对象. 此对象包含描述被允许的容器的字段，以及与`*.image-policy.k8s.io/*`匹配的任何 pod 注释.

请注意，webhook API 对象和其他 Kubernetes API 对象一样受到相同版本的兼容性规则的约束. 实现者应该意识到 alpha 对象的更宽松的兼容性承诺，并检查请求的“apiVersion"字段，以确保正确的反序列化. 此外，API 服务器必须启用 imagepolicy.k8s.io/v1alpha1 API扩展组(`--runtime-config=imagepolicy.k8s.io/v1alpha1=true`).

示例的请求正文:

```
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
    "annotations":[
      "mycluster.image-policy.k8s.io/ticket-1234": "break-glass"
    ],
    "namespace":"mynamespace"
  }
}
```

远程服务预计将填满请求的 ImageReviewStatus 字段，并响应允许或不允许访问. 响应体的“spec"字段被忽略，可以省略. 一个宽容的回应将返回:

```
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "status": {
    "allowed": true
  }
}
```

要禁止访问，服务将返回:

```
{
  "apiVersion": "imagepolicy.k8s.io/v1alpha1",
  "kind": "ImageReview",
  "status": {
    "allowed": false,
    "reason": "image currently blacklisted"
  }
}
```

有关进一步的文档，请参阅`imagepolicy.v1alpha1` API 对象和`plugin/pkg/admission/imagepolicy/admission.go`.

#### 使用注释扩展

匹配“*.image-policy.k8s.io/*"的Pod上的所有注释都将发送到webhook. 发送注释允许知道图像策略后端的用户向其发送额外的信息，并为不同的后端实现接收不同的信息.

您可以在这里提供的信息如下:

* 在紧急情况下，要求“打破玻璃"来覆盖政策.
* 来自售票系统的机票号码，用于记录拆装请求
* 向策略服务器提供有关正在提供的图像的 imageID 的提示，以保存它的查找

在任何情况下，注释由用户提供，并且不被 Kubernetes 以任何方式验证. 在将来，如果一个注释被确定为广泛有用，那么它可以被提升为ImageReviewSpec的命名字段.

### ServiceAccount

该插件实现了[serviceAccounts](/docs/user-guide/service-accounts)的自动化.
如果您打算使用 Kubernetes`ServiceAccount`对象，我们强烈建议您使用此插件.

### SecurityContextDeny

该插件将拒绝尝试设置某些升级[SecurityContext](/docs/user-guide/security-context)字段的任何 pod. 如果集群不使用[pod安全策略](/docs/user-guide/pod-security-policy)限制安全上下文可以采用的值集，则应启用此功能.

### ResourceQuota

该插件将遵守传入的请求，并确保它不违反任何约束，
约束在`Namespace`中的`ResourceQuota`对象中枚举. 如果你在 Kubernetes 部署中使用`ResourceQuota`
对象，您必须使用此插件来实施配额约束.

请参阅[resourceQuota设计文档](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/admission_control_resource_quota.md)和[资源配额示例](/docs/concepts/policy/resource-quotas/).

强烈建议这个插件按照准入控制插件的顺序配置. 这样
配额就不会只为准入控制时会被拒绝的请求过早增加。

### LimitRanger

该插件将遵守传入的请求，并确保它不违反任何约束
在`Namespace`中的`LimitRange`对象中的枚举. 如果您正在使用`LimitRange`对象
于您的 Kubernetes 部署中，您必须使用此插件来强制执行这些约束.  LimitRanger也可以
用于将默认资源请求应用于不做任何指定的 Pods; 目前，默认的 LimitRanger
对“default"命名空间中的所有 Pod 应用 0.1 CPU要求.

请参阅[limitRange设计文档](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/admission_control_limit_range.md)和[范围限制范例](/docs/tasks/configure-pod-container/limit-range/)了解更多详细信息.

### InitialResources(测试)

该插件观察 pod 创建请求. 如果容器省略了计算资源请求和限制，
那么插件会根据运行相同映像的容器的历史使​​用自动填充计算资源请求.
如果没有足够的数据作出决定，请求保持不变.
当插件设置计算资源请求时，它将使用自动填充的计算资源的信息对 pod 进行注释.

有关详细信息，请参阅[InitialResouces提案](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/proposals/initial-resources.md).

### NamespaceLifecycle

该插件强制执行终止的`Namespace`不能在其中创建新对象，
并确保不存在的`Namespace`中的请求被拒绝.

`Namespace` 删除将启动删除所有对象(pod，services 等)的操作序列
命名空间. 为了强化该过程的完整性，我们强烈建议您运行此插件.

### DefaultStorageClass

该插件观察到不要求任何特定存储类的`PersistentVolumeClaim`对象的创建
并自动向其添加默认存储类.
这样，不要求任何特殊的存储类的用户根本就不需要关心它们并且它们
将获得默认值.

当没有配置默认存储类时，此插件不会执行任何操作. 当多个存储
类被标记为默认值，它拒绝创建任何具有错误的`PersistentVolumeClaim`，并且管理员
必须重新访问`StorageClass`对象，并仅标记一个为默认对象.
此插件忽略任何`PersistentVolumeClaim`更新，它仅作用于创建.

请参阅关于持久性卷声明[persistent volume](/docs/user-guide/persistent-volumes)以及
存储类和如何将存储类标记为默认值的文档.

### DefaultTolerationSeconds

该插件为不受宽容容忍的 pod 设置默认的宽恕容忍度以容忍
`notready:NoExecute` 和 `unreachable:NoExecute`，时间为 5 分钟

### PodSecurityPolicy

该插件用于创建和修改 pod，并确定是否应该被承认
基于所请求的安全语境和可用的 Pod 安全策略.

对于 Kubernetes < 1.6.0，API 服务器必须启用扩展名/v1beta1/podsecuritypolicy API
扩展组(`--runtime-config=extensions/v1beta1/podsecuritypolicy=true`).

另请参阅[Pod安全策略文档](/docs/concepts/policy/pod-security-policy/)
了解更多信息.

## 有没有推荐使用的一些插件？

是.
对于Kubernetes> = 1.6.0，我们强烈建议您运行以下一组入门控制插件(订购事宜):

```shell
--admission-control=NamespaceLifecycle,LimitRanger,ServiceAccount,PersistentVolumeLabel,DefaultStorageClass,ResourceQuota,DefaultTolerationSeconds
```

对于Kubernetes> = 1.4.0，我们强烈建议您运行以下入门控制插件(订单事宜):

```shell
--admission-control=NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,ResourceQuota
```

对于Kubernetes> = 1.2.0，我们强烈建议您运行以下入门控制插件(订单事宜):

```shell
--admission-control=NamespaceLifecycle,LimitRanger,ServiceAccount,ResourceQuota
```

对于Kubernetes> = 1.0.0，我们强烈建议您运行以下一组入门控制插件(订购事宜):

```shell
--admission-control=NamespaceLifecycle,LimitRanger,SecurityContextDeny,ServiceAccount,PersistentVolumeLabel,ResourceQuota
```
