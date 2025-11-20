---
layout: blog
title: "Kubernetes 驗證准入策略：一個真實示例"
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

**譯者**：Xiaoyang Zhang (Huawei)

<!--
Admission control is an important part of the Kubernetes control plane, with several internal
features depending on the ability to approve or change an API object as it is submitted to the
server. It is also useful for an administrator to be able to define business logic, or policies,
regarding what objects can be admitted into a cluster. To better support that use case, [Kubernetes
introduced external admission control in
v1.7](/blog/2017/06/kubernetes-1-7-security-hardening-stateful-application-extensibility-updates/).
-->
准入控制是 Kubernetes 控制平面的重要組成部分，在向伺服器提交請求時，可根據批准或更改 API 對象的能力來實現多項內部功能。
對於管理員來說，定義有關哪些對象可以進入叢集的業務邏輯或策略是很有用的。爲了更好地支持該場景，
[Kubernetes 在 v1.7 中引入了外部准入控制](/blog/2017/06/kubernetes-1-7-security-hardening-stateful-application-extensibility-updates/)。

<!--
In addition to countless custom, internal implementations, many open source projects and commercial
solutions implement admission controllers with user-specified policy, including
[Kyverno](https://github.com/kyverno/kyverno) and Open Policy Agent’s
[Gatekeeper](https://github.com/open-policy-agent/gatekeeper).
-->
除了衆多的自定義內部實現外，許多開源項目和商業解決方案還使用使用者指定的策略實現准入控制器，包括
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
雖然針對策略的准入控制器已經被人採用，但其廣泛使用仍存在障礙。
Webhook 基礎設施必須作爲生產服務進行維護，且包含所有相關內容。
如果准入控制 Webhook 失敗，則要麼必須關閉，從而降低叢集的可用性；要麼打開，使該功能在策略執行中的使用失效。
例如，在 “serverless” 環境中，當 Pod 啓動以響應網路請求時，網路跳躍和評估時間使准入控制成爲處理延遲的重要組成部分。

<!--
## Validating admission policies and the Common Expression Language

Version 1.26 of Kubernetes introduced, in alpha, a compromise solution. [Validating admission
policies](/docs/reference/access-authn-authz/validating-admission-policy/) are a declarative,
in-process alternative to admission webhooks. They use the [Common Expression
Language](https://github.com/google/cel-spec) (CEL) to declare validation rules.
-->
## 驗證准入策略和通用表達語言 {#validating-admission-policies-and-the-common-expression-language}

Kubernetes 1.26 版本引入了一個折中的、Alpha 狀態的解決方案。
[驗證准入策略](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)是一種聲明式的、
進程內的方案，用來替代驗證准入 Webhook。使用[通用表達語言](https://github.com/google/cel-spec)
(Common Expression Language，CEL) 來聲明策略的驗證規則。

<!--
CEL was developed by Google for security and policy use cases, based on learnings from the Firebase
real-time database. Its design allows it to be safely embedded into applications and executed in
microseconds, with limited compute and memory impact. [Validation rules for
CRDs](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
introduced CEL to the Kubernetes ecosystem in v1.23, and at the time it was noted that the language
would suit a more generic implementation of validation by admission control.
-->
CEL 是由 Google 根據 Firebase 實時資料庫的經驗，針對安全和策略用例而開發的。
它的設計使得它可以安全地嵌入到應用程式中，執行時間在微秒量級，對計算和內存的影響很小。
v1.23 版本中，[針對 CRD 的驗證規則](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)將
CEL 引入了 Kubernetes 生態系統，當時人們注意到該語言將適合實現通過准入控制進行更通用的驗證。

<!--
## Giving CEL a roll - a practical example

[Kubescape](https://github.com/kubescape/kubescape) is a CNCF project which has become one of the
most popular ways for users to improve the security posture of a Kubernetes cluster and validate its
compliance. Its [controls](https://github.com/kubescape/regolibrary) — groups of tests against API
objects — are built in [Rego](https://www.openpolicyagent.org/docs/latest/policy-language/), the
policy language of Open Policy Agent.
-->
## 讓 CEL 發揮作用——一個實際例子 {#giving-cel-a-roll-a-practical-example}

[Kubescape](https://github.com/kubescape/kubescape) 是一個 CNCF 項目，
已成爲使用者改善 Kubernetes 叢集安全狀況並驗證其合規性的最流行方法之一。
它的[控件](https://github.com/kubescape/regolibrary)——針對 API 對象的多組測試——是用
Open Policy Agent 的策略語言 [Rego](https://www.openpolicyagent.org/docs/latest/policy-language/) 構建的。

<!--
Rego has a reputation for complexity, based largely on the fact that it is a declarative query
language (like SQL). It [was
considered](https://github.com/kubernetes/enhancements/blob/499e28/keps/sig-api-machinery/2876-crd-validation-expression-language/README.md#alternatives)
for use in Kubernetes, but it does not offer the same sandbox constraints as CEL.
-->
Rego 以複雜性著稱，這主要是因爲它是一種聲明式查詢語言（如 SQL）。
它[被考慮](https://github.com/kubernetes/enhancements/blob/499e28/keps/sig-api-machinery/2876-crd-validation-expression-language/README.md#alternatives)在
Kubernetes 中使用，但它沒有提供與 CEL 相同的沙箱約束。

<!--
A common feature request for the project is to be able to implement policies based on Kubescape’s
findings and output. For example, after scanning pods for [known paths to cloud credential
files](https://hub.armosec.io/docs/c-0020), users would like the ability to enforce policy that
these pods should not be admitted at all. The Kubescape team thought this would be the perfect
opportunity to try and port our existing controls to CEL and apply them as admission policies.
-->
該項目的一個常見功能要求是能夠根據 Kubescape 的發現和輸出來實現策略。例如，在掃描 Pod
是否存在[雲憑據檔案的已知路徑](https://hub.armosec.io/docs/c-0020)後，
使用者希望能夠執行完全不允許這些 Pod 進入的策略。
Kubescape 團隊認爲這是一個絕佳的機會，可以嘗試將現有的控制措施移植到 CEL，並將其應用爲準入策略。

<!--
### Show me the policy

It did not take us long to convert many of our controls and build a [library of validating admission
policies](https://github.com/kubescape/cel-admission-library). Let’s look at one as an example.
-->
### 策略展示 {#show-me-the-policy}

我們很快就轉換了許多控件並建立了一個驗證准入策略的庫。讓我們看一個例子。

<!--
Kubescape’s [control C-0017](https://hub.armosec.io/docs/c-0017) covers the requirement for
containers to have an immutable (read-only) root filesystem. This is a best practice according to
the [NSA Kubernetes hardening
guidelines](/blog/2021/10/05/nsa-cisa-kubernetes-hardening-guidance/#immutable-container-filesystems),
but is not currently required as a part of any of the [pod security
standards](/docs/concepts/security/pod-security-standards/).
-->
Kubescape 的 [control C-0017](https://hub.armosec.io/docs/c-0017) 涵蓋了容器具有不可變（只讀）根檔案系統的要求。
根據 [NSA Kubernetes 強化指南](/blog/2021/10/05/nsa-cisa-kubernetes-hardening-guidance/#immutable-container-filesystems)，
這是最佳實踐，但目前不要求將其作爲任何 [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/)的一部分。

<!--
Here's how we implemented it in CEL:
-->
以下是我們用 CEL 的實現方式：

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
此策略爲三個可能的 API 組提供匹配約束：Pod 的 `core/v1` 組、負載控制器的 `apps/v1`
和作業控制器的 `batch/v1`。

{{< note >}}
<!--
`matchConstraints` will convert the API object to the matched version for you. If, for
example, an API request was for `apps/v1beta1` and you match `apps/v1` in matchConstraints, the API
request will be converted from `apps/v1beta1` to `apps/v1` and then validated. This has the useful
property of making validation rules secure against the introduction of new versions of APIs, which
would otherwise allow API requests to sneak past the validation rule by using the newly introduced
version. 
-->
`matchConstraints` 會爲你將 API 對象轉換爲匹配的版本。例如，如果 API 請求的對象是 `apps/v1beta1`，
而你在 matchConstraints 中要匹配 `apps/v1`，那麼 API 請求就會從 `apps/v1beta1` 轉換爲 `apps/v1` 然後進行驗證。
這樣做的好處是可以確保驗證規則不會被引入新版本的 API 所破壞，否則 API 請求就會通過使用新引入的版本而躲過驗證規則的檢查。
{{< /note >}}

<!--
The `validations` include the CEL rules for the objects. There are three different expressions,
catering for the fact that a Pod `spec` can be at the root of the object (a [naked
pod](/docs/concepts/configuration/overview/#naked-pods-vs-replicasets-deployments-and-jobs)),
under `template` (a workload controller or a Job), or under `jobTemplate` (a CronJob).
-->
其中 `validations` 包括對象的 CEL 規則。有三種不同的表達方式，以滿足 Pod `spec`
可以位於對象的根部（[獨立的 Pod](/zh-cn/docs/concepts/configuration/overview/#naked-pods-vs-replicasets-deployments-and-jobs)）、
在 `template` 下（負載控制器或作業）或位於 `jobTemplate`（CronJob）下的情況。

<!--
In the event that any `spec` does not have `readOnlyRootFilesystem` set to true, the object will not
be admitted.
-->
如果任何一個 `spec` 沒有將 `readOnlyRootFilesystem` 設爲 true，則該對象將不會被接受。

{{< note >}}
<!--
In our initial release, we have grouped the three expressions into the same policy
object. This means they can be enabled and disabled atomically, and thus there is no chance that a
user will accidentally leave a compliance gap by enabling policy for one API group and not the
others. Breaking them into separate policies would allow us access to improvements targeted for the
1.27 release, including type checking. We are talking to SIG API Machinery about how to best address
this before the APIs reach `v1`. 
-->
在最初的版本中，我們將這三個表達式分組到同一個策略對象中。這意味着可以原子性地啓用和禁用它們，
因此不會出現以下情況：使用者啓用一個 API 組的策略而未啓用其他組的策略，從而不小心留下合規性漏洞。
將它們分成單獨的策略將使我們能夠使用針對 1.27 版本所作的改進，包括類型檢查。
我們正在與 SIG API Machinery 討論如何在 API 達到 `v1` 之前最好地解決這個問題。
{{< /note >}}

<!--
### Using the CEL library in your cluster

Policies are provided as Kubernetes objects, which are then bound to certain resources by a
[selector](/docs/concepts/overview/working-with-objects/labels/#label-selectors).
-->
### 在叢集中使用 CEL 庫 {#using-the-cel-library-in-your-cluster}

策略以 Kubernetes 對象的形式提供，並通過[選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/#label-selectors)綁定到某些資源。

<!--
[Minikube](https://minikube.sigs.k8s.io/docs/) is a quick and easy way to install and configure a
Kubernetes cluster for testing. To install Kubernetes v1.26 with the `ValidatingAdmissionPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) enabled:
-->
[Minikube](https://minikube.sigs.k8s.io/docs/) 是一種安裝和設定 Kubernetes 叢集以進行測試的快速簡便的方法。
安裝 Kubernetes v1.26 並啓用[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
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
要在叢集中安裝策略：

```shell
# 安裝配置 CRD
kubectl apply -f https://github.com/kubescape/cel-admission-library/releases/latest/download/policy-configuration-definition.yaml
# 安裝基礎配置
kubectl apply -f https://github.com/kubescape/cel-admission-library/releases/latest/download/basic-control-configuration.yaml
# 安裝策略
kubectl apply -f https://github.com/kubescape/cel-admission-library/releases/latest/download/kubescape-validating-admission-policies.yaml
```

<!--
To apply policies to objects, create a `ValidatingAdmissionPolicyBinding` resource. Let’s apply the
above Kubescape C-0017 control to any namespace with the label `policy=enforced`:
-->
要將策略應用到對象，請創建一個 `ValidatingAdmissionPolicyBinding` 資源。
讓我們把上述 Kubescape C-0017 控件應用到所有帶有標籤 `policy=enforced` 的命名空間：

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
# 創建綁定
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

# 創建用於運行示例的命名空間
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
現在，如果嘗試創建一個對象但不指定 `readOnlyRootFilesystem`，該對象將不會被創建。

```shell
# 如下命令會失敗
kubectl -n policy-example run nginx --image=nginx --restart=Never
```

<!--
The output shows our error:
-->
輸出錯誤資訊：

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
### 設定

策略對象可以包括在不同對象中提供的設定。許多 Kubescape 控件需要設定：
需要哪些標籤、允許或拒絕哪些權能、允許從哪些映像檔庫部署容器等。
這些控件的預設值在 [ControlConfiguration 對象](https://github.com/kubescape/cel-admission-library/blob/main/configuration/basic-control-configuration.yaml)中定義。

<!--
To use this configuration object, or your own object in the same format, add a `paramRef.name` value
to your binding object:
-->
要使用這個設定對象，或者以相同的格式使用你自己的對象，在你綁定對象中添加一個 `paramRef.name` 值:

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
## 總結 {#summary}

在大多數情況下，將我們的控件轉換爲 CEL 很簡單。我們無法移植整個 Kubescape 庫，因爲有些控件會檢查
Kubernetes 叢集外部的事物，有些控件需要訪問准入請求對象中不可用的資料。
總的來說，我們很高興將這個庫貢獻給 Kubernetes 社區，並將繼續爲 Kubescape 和 Kubernetes 使用者開發它。
我們希望它能成爲有用的工具，既可以作爲你自己使用的工具，也可以作爲你編寫自己的策略的範例。

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
至於驗證准入策略功能本身，我們很高興看到 Kubernetes 引入這一原生功能。
我們期待看到它進入 Beta 版，然後進入 GA 版，希望能在今年年底前完成。
值得注意的是，該功能目前還處於 Alpha 階段，這意味着這是在 Minikube 等環境中試用該功能的絕佳機會。
然而，它尚未被視爲生產就緒且穩定，且不會在大多數託管的 Kubernetes 環境中啓用。
底層功能變得穩定之前，我們不會建議 Kubescape 使用者在生產環境中使用這些策略。
請密切關注 [KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/3488-cel-admission-control/README.md)，
當然還有此博客，以獲取最終的發佈公告。