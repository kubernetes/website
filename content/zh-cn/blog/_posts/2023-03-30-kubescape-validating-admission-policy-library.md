---
layout: blog
title: "Kubernetes 验证准入策略：一个真实示例"
date: 2023-03-30T00:00:00+0000
slug: kubescape-validating-admission-policy-library
---

<!--
layout: blog
title: "Kubernetes Validating Admission Policies: A Practical Example"
date: 2023-03-30T00:00:00+0000
slug: kubescape-validating-admission-policy-library
-->

<!--
**Authors**: Craig Box (ARMO), Ben Hirschberg (ARMO)
-->
**作者**：Craig Box (ARMO), Ben Hirschberg (ARMO)

**译者**：Xiaoyang Zhang (Huawei)

<!--
Admission control is an important part of the Kubernetes control plane, with several internal
features depending on the ability to approve or change an API object as it is submitted to the
server. It is also useful for an administrator to be able to define business logic, or policies,
regarding what objects can be admitted into a cluster. To better support that use case, [Kubernetes
introduced external admission control in
v1.7](/blog/2017/06/kubernetes-1-7-security-hardening-stateful-application-extensibility-updates/).
-->
准入控制是 Kubernetes 控制平面的重要组成部分，在向服务器提交请求时，可根据批准或更改 API 对象的能力来实现多项内部功能。
对于管理员来说，定义有关哪些对象可以进入集群的业务逻辑或策略是很有用的。为了更好地支持该场景，
[Kubernetes 在 v1.7 中引入了外部准入控制](/blog/2017/06/kubernetes-1-7-security-hardening-stateful-application-extensibility-updates/)。

<!--
In addition to countless custom, internal implementations, many open source projects and commercial
solutions implement admission controllers with user-specified policy, including
[Kyverno](https://github.com/kyverno/kyverno) and Open Policy Agent’s
[Gatekeeper](https://github.com/open-policy-agent/gatekeeper).
-->
除了众多的自定义内部实现外，许多开源项目和商业解决方案还使用用户指定的策略实现准入控制器，包括
[Kyverno](https://github.com/kyverno/kyverno) 和 Open Policy Agent 的
[Gatekeep](https://github.com/open-policy-agent/gatekeeper)。

<!--
While admission controllers for policy have seen adoption, there are blockers for their widespread
use. Webhook infrastructure must be maintained as a production service, with all that entails. The
failure case of an admission control webhook must either be closed, reducing the availability of the
cluster; or open, negating the use of the feature for policy enforcement. The network hop and
evaluation time makes admission control a notable component of latency when dealing with, for
example, pods being spun up to respond to a network request in a "serverless" environment.
-->
虽然针对策略的准入控制器已经被人采用，但其广泛使用仍存在障碍。
Webhook 基础设施必须作为生产服务进行维护，且包含所有相关内容。
如果准入控制 Webhook 失败，则要么必须关闭，从而降低集群的可用性；要么打开，使该功能在策略执行中的使用失效。
例如，在 “serverless” 环境中，当 Pod 启动以响应网络请求时，网络跳跃和评估时间使准入控制成为处理延迟的重要组成部分。

<!--
## Validating admission policies and the Common Expression Language

Version 1.26 of Kubernetes introduced, in alpha, a compromise solution. [Validating admission
policies](/docs/reference/access-authn-authz/validating-admission-policy/) are a declarative,
in-process alternative to admission webhooks. They use the [Common Expression
Language](https://github.com/google/cel-spec) (CEL) to declare validation rules.
-->
## 验证准入策略和通用表达语言 {#validating-admission-policies-and-the-common-expression-language}

Kubernetes 1.26 版本引入了一个折中的、Alpha 状态的解决方案。
[验证准入策略](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)是一种声明式的、
进程内的方案，用来替代验证准入 Webhook。使用[通用表达语言](https://github.com/google/cel-spec)
(Common Expression Language，CEL) 来声明策略的验证规则。

<!--
CEL was developed by Google for security and policy use cases, based on learnings from the Firebase
real-time database. Its design allows it to be safely embedded into applications and executed in
microseconds, with limited compute and memory impact. [Validation rules for
CRDs](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
introduced CEL to the Kubernetes ecosystem in v1.23, and at the time it was noted that the language
would suit a more generic implementation of validation by admission control.
-->
CEL 是由 Google 根据 Firebase 实时数据库的经验，针对安全和策略用例而开发的。
它的设计使得它可以安全地嵌入到应用程序中，执行时间在微秒量级，对计算和内存的影响很小。
v1.23 版本中，[针对 CRD 的验证规则](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)将
CEL 引入了 Kubernetes 生态系统，当时人们注意到该语言将适合实现通过准入控制进行更通用的验证。

<!--
## Giving CEL a roll - a practical example

[Kubescape](https://github.com/kubescape/kubescape) is a CNCF project which has become one of the
most popular ways for users to improve the security posture of a Kubernetes cluster and validate its
compliance. Its [controls](https://github.com/kubescape/regolibrary) — groups of tests against API
objects — are built in [Rego](https://www.openpolicyagent.org/docs/latest/policy-language/), the
policy language of Open Policy Agent.
-->
## 让 CEL 发挥作用——一个实际例子 {#giving-cel-a-roll-a-practical-example}

[Kubescape](https://github.com/kubescape/kubescape) 是一个 CNCF 项目，
已成为用户改善 Kubernetes 集群安全状况并验证其合规性的最流行方法之一。
它的[控件](https://github.com/kubescape/regolibrary)——针对 API 对象的多组测试——是用
Open Policy Agent 的策略语言 [Rego](https://www.openpolicyagent.org/docs/latest/policy-language/) 构建的。

<!--
Rego has a reputation for complexity, based largely on the fact that it is a declarative query
language (like SQL). It [was
considered](https://github.com/kubernetes/enhancements/blob/499e28/keps/sig-api-machinery/2876-crd-validation-expression-language/README.md#alternatives)
for use in Kubernetes, but it does not offer the same sandbox constraints as CEL.
-->
Rego 以复杂性著称，这主要是因为它是一种声明式查询语言（如 SQL）。
它[被考虑](https://github.com/kubernetes/enhancements/blob/499e28/keps/sig-api-machinery/2876-crd-validation-expression-language/README.md#alternatives)在
Kubernetes 中使用，但它没有提供与 CEL 相同的沙箱约束。

<!--
A common feature request for the project is to be able to implement policies based on Kubescape’s
findings and output. For example, after scanning pods for [known paths to cloud credential
files](https://hub.armosec.io/docs/c-0020), users would like the ability to enforce policy that
these pods should not be admitted at all. The Kubescape team thought this would be the perfect
opportunity to try and port our existing controls to CEL and apply them as admission policies.
-->
该项目的一个常见功能要求是能够根据 Kubescape 的发现和输出来实现策略。例如，在扫描 Pod
是否存在[云凭据文件的已知路径](https://hub.armosec.io/docs/c-0020)后，
用户希望能够执行完全不允许这些 Pod 进入的策略。
Kubescape 团队认为这是一个绝佳的机会，可以尝试将现有的控制措施移植到 CEL，并将其应用为准入策略。

<!--
### Show me the policy

It did not take us long to convert many of our controls and build a [library of validating admission
policies](https://github.com/kubescape/cel-admission-library). Let’s look at one as an example.
-->
### 策略展示 {#show-me-the-policy}

我们很快就转换了许多控件并建立了一个验证准入策略的库。让我们看一个例子。

<!--
Kubescape’s [control C-0017](https://hub.armosec.io/docs/c-0017) covers the requirement for
containers to have an immutable (read-only) root filesystem. This is a best practice according to
the [NSA Kubernetes hardening
guidelines](/blog/2021/10/05/nsa-cisa-kubernetes-hardening-guidance/#immutable-container-filesystems),
but is not currently required as a part of any of the [pod security
standards](/docs/concepts/security/pod-security-standards/).
-->
Kubescape 的 [control C-0017](https://hub.armosec.io/docs/c-0017) 涵盖了容器具有不可变（只读）根文件系统的要求。
根据 [NSA Kubernetes 强化指南](/blog/2021/10/05/nsa-cisa-kubernetes-hardening-guidance/#immutable-container-filesystems)，
这是最佳实践，但目前不要求将其作为任何 [Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards/)的一部分。

<!--
Here's how we implemented it in CEL:
-->
以下是我们用 CEL 的实现方式：

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: ValidatingAdmissionPolicy
metadata:
  name: "kubescape-c-0017-deny-resources-with-mutable-container-filesystem"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   [""]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["pods"]
    - apiGroups:   ["apps"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["deployments","replicasets","daemonsets","statefulsets"]
    - apiGroups:   ["batch"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["jobs","cronjobs"]
  validations:
    - expression: "object.kind != 'Pod' || object.spec.containers.all(container, has(container.securityContext) && has(container.securityContext.readOnlyRootFilesystem) &&  container.securityContext.readOnlyRootFilesystem == true)"
      message: "Pods having containers with mutable filesystem not allowed! (see more at https://hub.armosec.io/docs/c-0017)"
    - expression: "['Deployment','ReplicaSet','DaemonSet','StatefulSet','Job'].all(kind, object.kind != kind) || object.spec.template.spec.containers.all(container, has(container.securityContext) && has(container.securityContext.readOnlyRootFilesystem) &&  container.securityContext.readOnlyRootFilesystem == true)"
      message: "Workloads having containers with mutable filesystem not allowed! (see more at https://hub.armosec.io/docs/c-0017)"
    - expression: "object.kind != 'CronJob' || object.spec.jobTemplate.spec.template.spec.containers.all(container, has(container.securityContext) && has(container.securityContext.readOnlyRootFilesystem) &&  container.securityContext.readOnlyRootFilesystem == true)"
      message: "CronJob having containers with mutable filesystem not allowed! (see more at https://hub.armosec.io/docs/c-0017)"
```

<!--
Match constraints are provided for three possible API groups: the `core/v1` group for Pods, the
`apps/v1` workload controllers, and the `batch/v1` job controllers. 
-->
此策略为三个可能的 API 组提供匹配约束：Pod 的 `core/v1` 组、负载控制器的 `apps/v1`
和作业控制器的 `batch/v1`。

{{< note >}}
<!--
`matchConstraints` will convert the API object to the matched version for you. If, for
example, an API request was for `apps/v1beta1` and you match `apps/v1` in matchConstraints, the API
request will be converted from `apps/v1beta1` to `apps/v1` and then validated. This has the useful
property of making validation rules secure against the introduction of new versions of APIs, which
would otherwise allow API requests to sneak past the validation rule by using the newly introduced
version. 
-->
`matchConstraints` 会为你将 API 对象转换为匹配的版本。例如，如果 API 请求的对象是 `apps/v1beta1`，
而你在 matchConstraints 中要匹配 `apps/v1`，那么 API 请求就会从 `apps/v1beta1` 转换为 `apps/v1` 然后进行验证。
这样做的好处是可以确保验证规则不会被引入新版本的 API 所破坏，否则 API 请求就会通过使用新引入的版本而躲过验证规则的检查。
{{< /note >}}

<!--
The `validations` include the CEL rules for the objects. There are three different expressions,
catering for the fact that a Pod `spec` can be at the root of the object (a [naked
pod](/docs/concepts/configuration/overview/#naked-pods-vs-replicasets-deployments-and-jobs)),
under `template` (a workload controller or a Job), or under `jobTemplate` (a CronJob).
-->
其中 `validations` 包括对象的 CEL 规则。有三种不同的表达方式，以满足 Pod `spec`
可以位于对象的根部（[独立的 Pod](/zh-cn/docs/concepts/configuration/overview/#naked-pods-vs-replicasets-deployments-and-jobs)）、
在 `template` 下（负载控制器或作业）或位于 `jobTemplate`（CronJob）下的情况。

<!--
In the event that any `spec` does not have `readOnlyRootFilesystem` set to true, the object will not
be admitted.
-->
如果任何一个 `spec` 没有将 `readOnlyRootFilesystem` 设为 true，则该对象将不会被接受。

{{< note >}}
<!--
In our initial release, we have grouped the three expressions into the same policy
object. This means they can be enabled and disabled atomically, and thus there is no chance that a
user will accidentally leave a compliance gap by enabling policy for one API group and not the
others. Breaking them into separate policies would allow us access to improvements targeted for the
1.27 release, including type checking. We are talking to SIG API Machinery about how to best address
this before the APIs reach `v1`. 
-->
在最初的版本中，我们将这三个表达式分组到同一个策略对象中。这意味着可以原子性地启用和禁用它们，
因此不会出现以下情况：用户启用一个 API 组的策略而未启用其他组的策略，从而不小心留下合规性漏洞。
将它们分成单独的策略将使我们能够使用针对 1.27 版本所作的改进，包括类型检查。
我们正在与 SIG API Machinery 讨论如何在 API 达到 `v1` 之前最好地解决这个问题。
{{< /note >}}

<!--
### Using the CEL library in your cluster

Policies are provided as Kubernetes objects, which are then bound to certain resources by a
[selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors).
-->
### 在集群中使用 CEL 库 {#using-the-cel-library-in-your-cluster}

策略以 Kubernetes 对象的形式提供，并通过[选择算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)绑定到某些资源。

<!--
[Minikube](https://minikube.sigs.k8s.io/docs/) is a quick and easy way to install and configure a
Kubernetes cluster for testing. To install Kubernetes v1.26 with the `ValidatingAdmissionPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled:
-->
[Minikube](https://minikube.sigs.k8s.io/docs/) 是一种安装和配置 Kubernetes 集群以进行测试的快速简便的方法。
安装 Kubernetes v1.26 并启用[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
`ValidatingAdmissionPolicy`：

```shell
minikube start --kubernetes-version=1.26.1 --extra-config=apiserver.runtime-config=admissionregistration.k8s.io/v1alpha1  --feature-gates='ValidatingAdmissionPolicy=true'
```

<!--
To install the policies in your cluster:

```shell
# Install configuration CRD
kubectl apply -f https://github.com/kubescape/cel-admission-library/releases/latest/download/policy-configuration-definition.yaml
# Install basic configuration
kubectl apply -f https://github.com/kubescape/cel-admission-library/releases/latest/download/basic-control-configuration.yaml
# Install policies
kubectl apply -f https://github.com/kubescape/cel-admission-library/releases/latest/download/kubescape-validating-admission-policies.yaml
```
-->
要在集群中安装策略：

```shell
# 安装配置 CRD
kubectl apply -f https://github.com/kubescape/cel-admission-library/releases/latest/download/policy-configuration-definition.yaml
# 安装基础配置
kubectl apply -f https://github.com/kubescape/cel-admission-library/releases/latest/download/basic-control-configuration.yaml
# 安装策略
kubectl apply -f https://github.com/kubescape/cel-admission-library/releases/latest/download/kubescape-validating-admission-policies.yaml
```

<!--
To apply policies to objects, create a `ValidatingAdmissionPolicyBinding` resource. Let’s apply the
above Kubescape C-0017 control to any namespace with the label `policy=enforced`:
-->
要将策略应用到对象，请创建一个 `ValidatingAdmissionPolicyBinding` 资源。
让我们把上述 Kubescape C-0017 控件应用到所有带有标签 `policy=enforced` 的命名空间：

<!--
```shell
# Create a binding
kubectl apply -f - <<EOT
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: c0017-binding
spec:
  policyName: kubescape-c-0017-deny-mutable-container-filesystem
  matchResources:
    namespaceSelector:
      matchLabels:
        policy: enforced
EOT

# Create a namespace for running the example
kubectl create namespace policy-example
kubectl label namespace policy-example 'policy=enforced'
```
-->
```shell
# 创建绑定
kubectl apply -f - <<EOT
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: c0017-binding
spec:
  policyName: kubescape-c-0017-deny-mutable-container-filesystem
  matchResources:
    namespaceSelector:
      matchLabels:
        policy: enforced
EOT

# 创建用于运行示例的命名空间
kubectl create namespace policy-example
kubectl label namespace policy-example 'policy=enforced'
```

<!--
Now, if you attempt to create an object without specifying a `readOnlyRootFilesystem`, it will not
be created.

```shell
# The next line should fail
kubectl -n policy-example run nginx --image=nginx --restart=Never
```
-->
现在，如果尝试创建一个对象但不指定 `readOnlyRootFilesystem`，该对象将不会被创建。

```shell
# 如下命令会失败
kubectl -n policy-example run nginx --image=nginx --restart=Never
```

<!--
The output shows our error:
-->
输出错误信息：

```
The pods "nginx" is invalid: : ValidatingAdmissionPolicy 'kubescape-c-0017-deny-mutable-container-filesystem' with binding 'c0017-binding' denied request: Pods having containers with mutable filesystem not allowed! (see more at https://hub.armosec.io/docs/c-0017)
```

<!--
### Configuration

Policy objects can include configuration, which is provided in a different object. Many of the
Kubescape controls require a configuration: which labels to require, which capabilities to allow or
deny, which registries to allow containers to be deployed from, etc. Default values for those
controls are defined in [the ControlConfiguration
object](https://github.com/kubescape/cel-admission-library/blob/main/configuration/basic-control-configuration.yaml).
-->
### 配置

策略对象可以包括在不同对象中提供的配置。许多 Kubescape 控件需要配置：
需要哪些标签、允许或拒绝哪些权能、允许从哪些镜像库部署容器等。
这些控件的默认值在 [ControlConfiguration 对象](https://github.com/kubescape/cel-admission-library/blob/main/configuration/basic-control-configuration.yaml)中定义。

<!--
To use this configuration object, or your own object in the same format, add a `paramRef.name` value
to your binding object:
-->
要使用这个配置对象，或者以相同的格式使用你自己的对象，在你绑定对象中添加一个 `paramRef.name` 值:

```yaml
apiVersion: admissionregistration.k8s.io/v1alpha1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: c0001-binding
spec:
  policyName: kubescape-c-0001-deny-forbidden-container-registries
  paramRef:
    name: basic-control-configuration
  matchResources:
    namespaceSelector:
      matchLabels:
        policy: enforced
```

<!--
## Summary

Converting our controls to CEL was simple, in most cases. We cannot port the whole Kubescape
library, as some controls check for things outside a Kubernetes cluster, and some require data that
is not available in the admission request object. Overall, we are happy to contribute this library
to the Kubernetes community and will continue to develop it for Kubescape and Kubernetes users
alike. We hope it becomes useful, either as something you use yourself, or as examples for you to
write your own policies.
-->
## 总结 {#summary}

在大多数情况下，将我们的控件转换为 CEL 很简单。我们无法移植整个 Kubescape 库，因为有些控件会检查
Kubernetes 集群外部的事物，有些控件需要访问准入请求对象中不可用的数据。
总的来说，我们很高兴将这个库贡献给 Kubernetes 社区，并将继续为 Kubescape 和 Kubernetes 用户开发它。
我们希望它能成为有用的工具，既可以作为你自己使用的工具，也可以作为你编写自己的策略的范例。

<!--
As for the validating admission policy feature itself, we are very excited to see this native
functionality introduced to Kubernetes. We look forward to watching it move to Beta and then GA,
hopefully by the end of the year. It is important to note this feature is currently in Alpha, which
means this is the perfect opportunity to play around with it in environments like Minikube and give
a test drive. However, it is not yet considered production-ready and stable, and will not be enabled
on most managed Kubernetes environments. We will not recommend Kubescape users use these policies in
production until the underlying functionality becomes stable. Keep an eye on [the
KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/3488-cel-admission-control/README.md),
and of course this blog, for an eventual release announcement.
-->
至于验证准入策略功能本身，我们很高兴看到 Kubernetes 引入这一原生功能。
我们期待看到它进入 Beta 版，然后进入 GA 版，希望能在今年年底前完成。
值得注意的是，该功能目前还处于 Alpha 阶段，这意味着这是在 Minikube 等环境中试用该功能的绝佳机会。
然而，它尚未被视为生产就绪且稳定，且不会在大多数托管的 Kubernetes 环境中启用。
底层功能变得稳定之前，我们不会建议 Kubescape 用户在生产环境中使用这些策略。
请密切关注 [KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/3488-cel-admission-control/README.md)，
当然还有此博客，以获取最终的发布公告。