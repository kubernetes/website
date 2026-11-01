---
layout: blog
title: "Kubernetes v1.36：无法删除的准入策略"
date: 2026-05-04T10:35:00-08:00
slug: kubernetes-v1-36-manifest-based-admission-control
author: >
  [Anish Ramasekar](https://github.com/aramase) (Microsoft),
  [Benjamin Elder](https://github.com/BenTheElder) (Google)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes v1.36: Admission Policies That Can't Be Deleted"
date: 2026-05-04T10:35:00-08:00
slug: kubernetes-v1-36-manifest-based-admission-control
author: >
  [Anish Ramasekar](https://github.com/aramase) (Microsoft),
  [Benjamin Elder](https://github.com/BenTheElder) (Google)
-->

<!--
If you've ever tried to enforce a security policy across a fleet of
Kubernetes clusters, you've probably run into a frustrating chicken-and-egg
problem. Your admission policies are API objects, which means they don't
exist until someone creates them, and they can be deleted by anyone with
the right permissions. There's always a window during cluster bootstrap
where your policies aren't active yet, and there's no way to prevent a
privileged user from removing them.
-->
如果你曾尝试在一组 Kubernetes 集群上强制执行安全策略，你可能遇到过一个令人沮丧的先有鸡还是先有蛋的问题。
你的准入策略是 API 对象，这意味着它们在有人创建之前不存在，并且任何具有适当权限的人都可以删除它们。
在集群引导期间，总是存在一个窗口，此时你的策略尚未生效，并且无法阻止特权用户删除它们。

<!--
Kubernetes v1.36 introduces an alpha feature that addresses this:
*manifest-based admission control*. It lets you define admission webhooks
and [CEL](/docs/reference/using-api/cel/)-based policies as files on disk, loaded by the API server at
startup, before it serves any requests.
-->
Kubernetes v1.36 引入了一个 Alpha 特性来解决这个问题：
**基于清单的准入控制**。它允许你将准入 Webhook 和基于
[CEL](/zh-cn/docs/reference/using-api/cel/) 的策略定义为磁盘上的文件，
由 API 服务器在启动时、处理任何请求之前加载。

<!--
## The gap we're closing
-->
## 我们正在填补的空白

<!--
Most Kubernetes policy enforcement today works through the API. You create
a ValidatingAdmissionPolicy or a webhook configuration as an API object,
and the admission controller picks it up. This works well in steady state,
but it has some fundamental limitations.
-->
如今，大多数 Kubernetes 策略强制执行都是通过 API 进行的。
你创建 ValidatingAdmissionPolicy 或 Webhook 配置作为 API 对象，准入控制器会接收它。
这在稳定状态下工作良好，但存在一些基本限制。

<!--
During cluster bootstrap, there's a gap between when the API server starts
serving requests and when your policies are created and active. If you're
restoring from a backup or recovering from an etcd failure, that gap can be
significant.
-->
在集群引导期间，API 服务器开始处理请求与你的策略创建并生效之间存在一个间隙。
如果你从备份恢复或从 etcd 故障中恢复，这个间隙可能会很大。

<!--
There's also a self-protection problem. Admission webhooks and policies
can't intercept operations on their own configuration resources. Kubernetes
skips invoking webhooks on types like ValidatingWebhookConfiguration to
avoid circular dependencies. That means a sufficiently privileged user can
delete your critical admission policies, and there's nothing in the
admission chain to stop them.
-->
还有一个自我保护问题。准入 Webhook 和策略无法拦截对其自身配置资源的操作。
Kubernetes 跳过对 ValidatingWebhookConfiguration 等类型调用 Webhook，以避免循环依赖。
这意味着具有足够权限的用户可以删除你的关键准入策略，而准入链中没有任何东西可以阻止他们。

<!--
We - Kubernetes SIG API Machinery - wanted a way to say "these policies are always on, full stop."
-->
我们 —— Kubernetes SIG API Machinery —— 希望有一种方式可以说"这些策略始终启用，到此为止。"

<!--
## How it works
-->
## 工作原理

<!--
You add a `staticManifestsDir` field to the `AdmissionConfiguration` file
that you already pass to the API server via `--admission-control-config-file`.
Point it at a directory, drop your policy YAML files in there, and the API
server loads them before it starts serving.
-->
你在已经通过 `--admission-control-config-file` 传递给 API 服务器的
`AdmissionConfiguration` 文件中添加一个 `staticManifestsDir` 字段。
将其指向一个目录，将你的策略 YAML 文件放在那里，API 服务器会在开始服务之前加载它们。

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: ValidatingAdmissionPolicy
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: ValidatingAdmissionPolicyConfiguration
    staticManifestsDir: "/etc/kubernetes/admission/validating-policies/"
```

<!--
The manifest files are standard Kubernetes resource definitions. The only
requirement is that all the objects that these manifests define **must** have names ending in `.static.k8s.io`.
This reserved suffix prevents collisions with API-based configurations and
makes it easy to tell where an admission decision came from when you're
looking at metrics or audit logs.
-->
清单文件是标准的 Kubernetes 资源定义。唯一的要求是这些清单定义的所有对象**必须**以 `.static.k8s.io` 结尾。
这个保留的后缀可以防止与基于 API 的配置冲突，并在查看指标或审计日志时轻松判断准入决策的来源。

<!--
Here's a complete example that denies privileged containers outside
kube-system:
-->
以下是一个完整的示例，拒绝 kube-system 之外的特权容器：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "deny-privileged.static.k8s.io"
  annotations:
    kubernetes.io/description: "Deny launching privileged pods, anywhere this policy is applied"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups: [""]
      apiVersions: ["v1"]
      operations: ["CREATE", "UPDATE"]
      resources: ["pods"]
  variables:
  - name: allContainers
    expression: >-
      object.spec.containers +
      (has(object.spec.initContainers) ? object.spec.initContainers : []) +
      (has(object.spec.ephemeralContainers) ? object.spec.ephemeralContainers : [])
  validations:
  - expression: >-
      !variables.allContainers.exists(c,
      has(c.securityContext) && has(c.securityContext.privileged) &&
      c.securityContext.privileged == true)
    message: "Privileged containers are not allowed"
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "deny-privileged-binding.static.k8s.io"
  annotations:
    kubernetes.io/description: "Bind deny-privileged policy to all namespaces except kube-system"
spec:
  policyName: "deny-privileged.static.k8s.io"
  validationActions:
  - Deny
  matchResources:
    namespaceSelector:
      matchExpressions:
      - key: "kubernetes.io/metadata.name"
        operator: NotIn
        values: ["kube-system"]
```

<!--
## Protecting what couldn't be protected before
-->
## 保护以前无法保护的内容

<!--
The part we're most excited about is the ability to intercept operations on
admission configuration resources themselves.
-->
我们最兴奋的部分是能够拦截对准入配置资源本身的操作。

<!--
With API-based admission, webhooks and policies are never invoked on types
like ValidatingAdmissionPolicy or ValidatingWebhookConfiguration. That
restriction exists for good reason: if a webhook could reject changes to
its own configuration, you could end up locked out with no way to fix it
through the API.
-->
使用基于 API 的准入，Webhook 和策略永远不会在 ValidatingAdmissionPolicy 或 ValidatingWebhookConfiguration 等类型上调用。
这个限制存在是有充分理由的：如果 Webhook 可以拒绝对其自身配置的更改，你可能会被锁定，无法通过 API 修复它。

<!--
Manifest-based policies don't have that problem. If a bad policy is
blocking something it shouldn't, you fix the file on disk and the API
server picks up the change. There's no circular dependency because the
recovery path doesn't go through the API.
-->
基于清单的策略没有这个问题。如果一个错误的策略阻止了它不应该阻止的东西，你可以修复磁盘上的文件，API 服务器会接收到更改。
不存在循环依赖，因为恢复路径不通过 API。

<!--
This means you can write a manifest-based policy that prevents deletion of
your critical API-based admission policies. For platform teams managing
shared clusters, this is a significant improvement. You can now guarantee
that your baseline security policies can't be removed by a cluster admin,
accidentally or otherwise.
-->
这意味着你可以编写一个基于清单的策略来防止删除关键的基于 API 的准入策略。
对于管理共享集群的平台团队来说，这是一个重大改进。
你现在可以保证你的基线安全策略不会被集群管理员删除，无论是意外还是故意。

<!--
Here's what that looks like in practice. This policy prevents any
modification or deletion of admission resources that carry the
`platform.example.com/protected: "true"` label:
-->
以下是实际应用中的示例。此策略防止修改或删除带有
`platform.example.com/protected: "true"` 标签的准入资源：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "protect-policies.static.k8s.io"
  annotations:
    kubernetes.io/description: "Prevent modification or deletion of protected admission resources"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups: ["admissionregistration.k8s.io"]
      apiVersions: ["*"]
      operations: ["DELETE", "UPDATE"]
      resources:
      - "validatingadmissionpolicies"
      - "validatingadmissionpolicybindings"
      - "validatingwebhookconfigurations"
      - "mutatingwebhookconfigurations"
  validations:
  - expression: >-
      !has(oldObject.metadata.labels) ||
      !('platform.example.com/protected' in oldObject.metadata.labels) ||
      oldObject.metadata.labels['platform.example.com/protected'] != 'true'
    message: "Protected admission resources cannot be modified or deleted"
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "protect-policies-binding.static.k8s.io"
  annotations:
    kubernetes.io/description: "Bind protect-policies policy to all admission resources"
spec:
  policyName: "protect-policies.static.k8s.io"
  validationActions:
  - Deny
```

<!--
With this in place, any API-based admission policy or webhook configuration
labeled `platform.example.com/protected: "true"` is shielded from tampering.
The protection itself lives on disk and can't be removed through the API.
-->
有了这个策略，任何带有 `platform.example.com/protected: "true"`
标签的基于 API 的准入策略或 webhook 配置都受到保护，不会被篡改。
保护本身存储在磁盘上，无法通过 API 删除。

<!--
## A few things to know
-->
## 需要知道的几件事

<!--
Manifest-based configurations are intentionally self-contained. They can't
reference API resources, which means no `paramKind` for policies, no
Service references for admission webhooks (instead they are URL-only),
and bindings may only reference
policies in the same manifest set. These restrictions exist because the
configurations need to work without any cluster state, including at startup
before etcd is available.
-->
基于清单的配置故意设计为自包含的。它们不能引用 API 资源，这意味着策略没有 `paramKind`，
准入 Webhook 没有 Service 引用（而是仅使用 URL），
并且绑定只能引用同一清单集中的策略。这些限制存在是因为配置需要在没有任何集群状态的情况下工作，
包括在 etcd 可用之前的启动阶段。

<!--
If you run multiple API server instances, each one loads its own manifest
files independently. There's no cross-server synchronization built in. This
is the same model as other file-based API server configurations like
encryption at rest. When this feature is enabled, Kubernetes exposes a configuration hash as a label on relevant metrics, so you can
detect drift.
-->
如果你运行多个 API 服务器实例，每个实例独立加载自己的清单文件。没有内置的跨服务器同步。
这与其他基于文件的 API 服务器配置（如静态加密）的模型相同。
启用此特性后，Kubernetes 会在相关指标上公开配置哈希作为标签，因此你可以检测漂移。

<!--
Files are watched for changes at runtime, so you don't need to restart the
API server to update policies. If you update a manifest file, the API
server validates the new configuration and swaps it in atomically. If
validation fails, it keeps the previous good configuration and logs the
error. This means you can roll out policy changes across your fleet using
standard configuration management tools (Ansible, Puppet, or even mounted
ConfigMaps) without any API server downtime.
-->
文件在运行时会被监视更改，因此你无需重启 API 服务器即可更新策略。
如果你更新清单文件，API 服务器会验证新配置并原子性地切换到新配置。
如果验证失败，它会保留之前的良好配置并记录错误。
这意味着你可以使用标准配置管理工具（Ansible、Puppet，甚至挂载的 ConfigMap）在整个集群中推出策略更改，
而不会导致 API 服务器停机。

<!--
The initial load at startup is stricter: if any manifest is invalid, the
API server won't start. This is intentional. At startup, failing fast is
safer than running without your expected policies.
-->
启动时的初始加载更加严格：如果任何清单无效，API 服务器将不会启动。这是有意为之的。
在启动时，快速失败比没有预期策略运行更安全。

<!--
## Try it out
-->
## 尝试一下

<!--
To try this in Kubernetes v1.36:

1. Enable the [`ManifestBasedAdmissionControlConfig`](/docs/reference/command-line-tools-reference/feature-gates/#ManifestBasedAdmissionControlConfig)
   feature gate for each kube-apiserver.
2. Create a directory with your static manifest files.
   If you need to mount that in to the Pod where the API server runs, do that too. Read-only is fine.
3. Configure `staticManifestsDir` in your [`AdmissionConfiguration`](/docs/reference/access-authn-authz/admission-controllers/)
   with the directory path.
4. Start the API server with `--admission-control-config-file` pointing to
   your `AdmissionConfiguration` file.
-->
要在 Kubernetes v1.36 中尝试此特性：

1. 为每个 kube-apiserver 启用
   [`ManifestBasedAdmissionControlConfig`](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#ManifestBasedAdmissionControlConfig)
   特性门控。
2. 创建一个包含静态清单文件的目录。
   如果需要将其挂载到 API 服务器运行的 Pod 中，请进行挂载。只读模式即可。
3. 在你的 [`AdmissionConfiguration`](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
   中配置 `staticManifestsDir`，指定目录路径。
4. 使用 `--admission-control-config-file` 指向你的 `AdmissionConfiguration` 文件启动 API 服务器。

<!--
The full documentation is at
[Manifest-Based Admission Control](/docs/reference/access-authn-authz/manifest-admission-control/),
and you can follow
[KEP-5793](https://kep.k8s.io/5793)
for ongoing progress.
-->
完整文档位于
[Manifest-Based Admission Control](/zh-cn/docs/reference/access-authn-authz/manifest-admission-control/)，
你可以关注
[KEP-5793](https://kep.k8s.io/5793)
了解持续进展。

<!--
We'd love to hear your feedback. Reach out on the
[#sig-api-machinery](https://kubernetes.slack.com/archives/C0EG7JC6T)
channel on Kubernetes Slack
(for an invitation, visit [https://slack.k8s.io/](https://slack.k8s.io/)).
-->
我们很想听听你的反馈。请在 Kubernetes Slack 上的
[#sig-api-machinery](https://kubernetes.slack.com/archives/C0EG7JC6T)
频道联系我们
（如需邀请，请访问 [https://slack.k8s.io/](https://slack.k8s.io/)）。

<!--
## How to get involved
-->
## 如何参与

<!--
If you're interested in contributing to this feature or other
SIG API Machinery projects, join us on
[#sig-api-machinery](https://kubernetes.slack.com/archives/C0EG7JC6T)
on Kubernetes Slack. You're also welcome to attend the
[SIG API Machinery meetings](https://github.com/kubernetes/community/blob/master/sig-api-machinery/README.md#meetings),
held every other Wednesday.
-->
如果你有兴趣为这个特性或其他 SIG API Machinery 项目做出贡献，请加入 Kubernetes Slack 上的
[#sig-api-machinery](https://kubernetes.slack.com/archives/C0EG7JC6T)。
也欢迎你参加
[SIG API Machinery 会议](https://github.com/kubernetes/community/blob/master/sig-api-machinery/README.md#meetings)，
每两周周三举行一次。
