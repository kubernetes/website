---
title: Pod 安全策略
content_type: concept
weight: 30
---

<!--
reviewers:
- pweil-
- tallclair
title: Pod Security Policies
content_type: concept
weight: 30
-->

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

{{< caution >}}
<!--
PodSecurityPolicy is deprecated as of Kubernetes v1.21, and **will be removed in v1.25**. We recommend migrating to
[Pod Security Admission](/docs/concepts/security/pod-security-admission/), or a 3rd party admission plugin.
For a migration guide, see [Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp/).
For more information on the deprecation,
see [PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/).
-->
PodSecurityPolicy 在 Kubernetes v1.21 版本中被棄用，**將在 v1.25 中刪除**。
我們建議遷移到 [Pod 安全性准入](/zh-cn/docs/concepts/security/pod-security-admission)，
或者第三方的准入外掛。
若需瞭解遷移指南，可參閱[從 PodSecurityPolicy 遷移到內建的 PodSecurity 准入控制器](/zh-cn/docs/tasks/configure-pod-container/migrate-from-psp/)。
關於棄用的更多資訊，請查閱 [PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)。
{{< /caution >}}

<!--
Pod Security Policies enable fine-grained authorization of pod creation and
updates.
-->
Pod 安全策略使得對 Pod 建立和更新進行細粒度的許可權控制成為可能。

<!-- body -->

<!--
## What is a Pod Security Policy?

A _Pod Security Policy_ is a cluster-level resource that controls security
sensitive aspects of the pod specification. The
[PodSecurityPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritypolicy-v1beta1-policy) objects
define a set of conditions that a pod must run with in order to be accepted into
the system, as well as defaults for the related fields. They allow an
administrator to control the following:
-->
## 什麼是 Pod 安全策略？   {#what-is-a-pod-security-policy}

_Pod 安全策略（Pod Security Policy）_ 是叢集級別的資源，它能夠控制 Pod 規約
中與安全性相關的各個方面。
[PodSecurityPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritypolicy-v1beta1-policy)
物件定義了一組 Pod 執行時必須遵循的條件及相關欄位的預設值，只有 Pod 滿足這些條件才會被系統接受。
Pod 安全策略允許管理員控制如下方面：

<!--
| Control Aspect                                      | Field Names                                 |
| ----------------------------------------------------| ----------------------------------------- |
| Running of privileged containers                    | [`privileged`](#privileged)                                |
| Usage of host namespaces                            | [`hostPID`, `hostIPC`](#host-namespaces)    |
| Usage of host networking and ports                  | [`hostNetwork`, `hostPorts`](#host-namespaces) |
| Usage of volume types                               | [`volumes`](#volumes-and-file-systems)      |
| Usage of the host filesystem                        | [`allowedHostPaths`](#volumes-and-file-systems) |
| Allow specific FlexVolume drivers                   | [`allowedFlexVolumes`](#flexvolume-drivers) |
| Allocating an FSGroup that owns the pod's volumes   | [`fsGroup`](#volumes-and-file-systems)      |
| Requiring the use of a read only root file system   | [`readOnlyRootFilesystem`](#volumes-and-file-systems) |
| The user and group IDs of the container             | [`runAsUser`, `runAsGroup`, `supplementalGroups`](#users-and-groups) |
| Restricting escalation to root privileges           | [`allowPrivilegeEscalation`, `defaultAllowPrivilegeEscalation`](#privilege-escalation) |
| Linux capabilities                                  | [`defaultAddCapabilities`, `requiredDropCapabilities`, `allowedCapabilities`](#capabilities) |
| The SELinux context of the container                | [`seLinux`](#selinux)                       |
| The Allowed Proc Mount types for the container      | [`allowedProcMountTypes`](#allowedprocmounttypes) |
| The AppArmor profile used by containers             | [annotations](#apparmor)                    |
| The seccomp profile used by containers              | [annotations](#seccomp)                     |
| The sysctl profile used by containers               | [`forbiddenSysctls`,`allowedUnsafeSysctls`](#sysctl)                      |
-->
| 控制的角度                          | 欄位名稱                          |
| ----------------------------------- | --------------------------------- |
| 執行特權容器                        | [`privileged`](#privileged) |
| 使用宿主名字空間                    | [`hostPID`、`hostIPC`](#host-namespaces) |
| 使用宿主的網路和埠                | [`hostNetwork`, `hostPorts`](#host-namespaces) |
| 控制卷型別的使用                    | [`volumes`](#volumes-and-file-systems) |
| 使用宿主檔案系統                    | [`allowedHostPaths`](#volumes-and-file-systems) |
| 允許使用特定的 FlexVolume 驅動      | [`allowedFlexVolumes`](#flexvolume-drivers) |
| 分配擁有 Pod 卷的 FSGroup 賬號      | [`fsGroup`](#volumes-and-file-systems)      |
| 以只讀方式訪問根檔案系統            | [`readOnlyRootFilesystem`](#volumes-and-file-systems) |
| 設定容器的使用者和組 ID               | [`runAsUser`, `runAsGroup`, `supplementalGroups`](#users-and-groups) |
| 限制 root 賬號特權級提升             | [`allowPrivilegeEscalation`, `defaultAllowPrivilegeEscalation`](#privilege-escalation) |
| Linux 權能字（Capabilities）        | [`defaultAddCapabilities`, `requiredDropCapabilities`, `allowedCapabilities`](#capabilities) |
| 設定容器的 SELinux 上下文           | [`seLinux`](#selinux)                       |
| 指定容器可以掛載的 proc 型別        | [`allowedProcMountTypes`](#allowedprocmounttypes) |
| 指定容器使用的 AppArmor 模版        | [annotations](#apparmor)                    |
| 指定容器使用的 seccomp 模版         | [annotations](#seccomp)                     |
| 指定容器使用的 sysctl 模版          | [`forbiddenSysctls`,`allowedUnsafeSysctls`](#sysctl)  | 

<!--
## Enabling Pod Security Policies

Pod security policy control is implemented as an optional
[admission controller](/docs/reference/access-authn-authz/admission-controllers/#podsecuritypolicy).
PodSecurityPolicies are enforced by
[enabling the admission controller](/docs/reference/access-authn-authz/admission-controllers/#how-do-i-turn-on-an-admission-control-plug-in),
but doing so without authorizing any policies **will prevent any pods from being created** in the
cluster.
-->
## 啟用 Pod 安全策略   {#enabling-pod-security-policies}

Pod 安全策略實現為一種可選的[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podsecuritypolicy)。
[啟用了准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#how-do-i-turn-on-an-admission-control-plug-in)即可強制實施
Pod 安全策略，不過如果沒有授權認可策略之前即啟用准入控制器 **將導致叢集中無法建立任何 Pod**。

<!--
Since the pod security policy API (`policy/v1beta1/podsecuritypolicy`) is
enabled independently of the admission controller, for existing clusters it is
recommended that policies are added and authorized before enabling the admission
controller.
-->
由於 Pod 安全策略 API（`policy/v1beta1/podsecuritypolicy`）是獨立於准入控制器
來啟用的，對於現有叢集而言，建議在啟用准入控制器之前先新增策略並對其授權。

<!--
## Authorizing Policies

When a PodSecurityPolicy resource is created, it does nothing. In order to use
it, the requesting user or target pod's
[service account](/docs/tasks/configure-pod-container/configure-service-account/)
must be authorized to use the policy, by allowing the `use` verb on the policy.
-->
## 授權策略    {#authorizing-policies}

PodSecurityPolicy 資源被建立時，並不執行任何操作。為了使用該資源，
需要對發出請求的使用者或者目標 Pod
的[服務賬號](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)授權，
透過允許其對策略執行 `use` 動詞允許其使用該策略。

<!--
Most Kubernetes pods are not created directly by users. Instead, they are
typically created indirectly as part of a
[Deployment](/docs/concepts/workloads/controllers/deployment/),
[ReplicaSet](/docs/concepts/workloads/controllers/replicaset/), or other
templated controller via the controller manager. Granting the controller access
to the policy would grant access for *all* pods created by that controller,
so the preferred method for authorizing policies is to grant access to the
pod's service account (see [example](#run-another-pod)).
-->
大多數 Kubernetes Pod 不是由使用者直接建立的。相反，這些 Pod 是由
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)、
[ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/)
或者經由控制器管理器模版化的控制器建立。
賦予控制器訪問策略的許可權意味著對應控制器所建立的 *所有* Pod 都可訪問策略。
因此，對策略進行授權的優先方案是為 Pod 的服務賬號授予訪問許可權
（參見[示例](#run-another-pod)）。

<!--
### Via RBAC

[RBAC](/docs/reference/access-authn-authz/rbac/) is a standard Kubernetes
authorization mode, and can easily be used to authorize use of policies.

First, a `Role` or `ClusterRole` needs to grant access to `use` the desired
policies. The rules to grant access look like this:
-->
### 透過 RBAC 授權   {#via-rbac}

[RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 是一種標準的 Kubernetes
鑑權模式，可以很容易地用來授權策略訪問。

首先，某 `Role` 或 `ClusterRole` 需要獲得使用 `use` 訪問目標策略的許可權。
訪問授權的規則看起來像這樣：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: <Role 名稱>
rules:
- apiGroups: ['policy']
  resources: ['podsecuritypolicies']
  verbs:     ['use']
  resourceNames:
  - <要授權的策略列表>
```

<!--
Then the `(Cluster)Role` is bound to the authorized user(s):

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: <binding name>
roleRef:
  kind: ClusterRole
  name: <role name>
  apiGroup: rbac.authorization.k8s.io
subjects:
# Authorize all service accounts in a namespace (recommended):
- kind: Group
  apiGroup: rbac.authorization.k8s.io
  name: system:serviceaccounts:<authorized namespace>
# Authorize specific service accounts (not recommended):
- kind: ServiceAccount
  name: <authorized service account name>
  namespace: <authorized pod namespace>
# Authorize specific users (not recommended):
- kind: User
  apiGroup: rbac.authorization.k8s.io
  name: <authorized user name>
```
-->
接下來將該 `Role`（或 `ClusterRole`）繫結到授權的使用者：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: <繫結名稱>
roleRef:
  kind: ClusterRole
  name: <角色名稱>
  apiGroup: rbac.authorization.k8s.io
subjects:
  # 授權名稱空間下的所有服務賬號（推薦）：
  - kind: Group
    apiGroup: rbac.authorization.k8s.io
    name: system:serviceaccounts:<authorized namespace>
  # 授權特定的服務賬號（不建議這樣操作）：
  - kind: ServiceAccount
    name: <被授權的服務賬號名稱>
    namespace: <被授權的 Pod 名字空間>
  # 授權特定的使用者（不建議這樣操作）：
  - kind: User
    apiGroup: rbac.authorization.k8s.io
    name: <被授權的使用者名稱>
```

<!--
If a `RoleBinding` (not a `ClusterRoleBinding`) is used, it will only grant
usage for pods being run in the same namespace as the binding. This can be
paired with system groups to grant access to all pods run in the namespace:

```yaml
# Authorize all service accounts in a namespace:
- kind: Group
  apiGroup: rbac.authorization.k8s.io
  name: system:serviceaccounts
# Or equivalently, all authenticated users in a namespace:
- kind: Group
  apiGroup: rbac.authorization.k8s.io
  name: system:authenticated
```
-->
如果使用的是 `RoleBinding`（而不是 `ClusterRoleBinding`），授權僅限於與該
`RoleBinding` 處於同一名字空間中的 Pod。
可以考慮將這種授權模式和系統組結合，對名字空間中的所有 Pod 授予訪問許可權。

```yaml
# 授權某名字空間中所有服務賬號
- kind: Group
  apiGroup: rbac.authorization.k8s.io
  name: system:serviceaccounts
# 或者與此等價，授權給某名字空間中所有被認證過的使用者
- kind: Group
  apiGroup: rbac.authorization.k8s.io
  name: system:authenticated
```

<!--
For more examples of RBAC bindings, see
[Role Binding Examples](/docs/reference/access-authn-authz/rbac#role-binding-examples).
For a complete example of authorizing a PodSecurityPolicy, see [below](#example).
-->
參閱[角色繫結示例](/zh-cn/docs/reference/access-authn-authz/rbac#role-binding-examples)檢視
RBAC 繫結的更多例項。
參閱[下文](#example)，檢視對 PodSecurityPolicy 進行授權的完整示例。

<!--
### Recommended Practice

PodSecurityPolicy is being replaced by a new, simplified `PodSecurity`
{{< glossary_tooltip text="admission controller" term_id="admission-controller" >}}.
For more details on this change, see
[PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/).
Follow these guidelines to simplify migration from PodSecurityPolicy to the
new admission controller:
-->
## 推薦實踐   {#recommended-practice}

PodSecurityPolicy 正在被一個新的、簡化的 `PodSecurity`
{{< glossary_tooltip text="准入控制器" term_id="admission-controller" >}}替代。
有關此變更的更多詳細資訊，請參閱
[PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)。
參照下述指導，簡化從 PodSecurityPolicy 遷移到新的准入控制器步驟：

<!--
1. Limit your PodSecurityPolicies to the policies defined by the
   [Pod Security Standards](/docs/concepts/security/pod-security-standards):

   - {{< example file="policy/privileged-psp.yaml" >}}Privileged{{< /example >}}
   - {{< example file="policy/baseline-psp.yaml" >}}Baseline{{< /example >}}
   - {{< example file="policy/restricted-psp.yaml" >}}Restricted{{< /example >}}
-->
1. 將 PodSecurityPolicies 限制為
   [Pod 安全性標準](/zh-cn/docs/concepts/security/pod-security-standards)所定義的策略：

   - {{< example file="policy/privileged-psp.yaml" >}}Privileged{{< /example >}}
   - {{< example file="policy/baseline-psp.yaml" >}}Baseline{{< /example >}}
   - {{< example file="policy/restricted-psp.yaml" >}}Restricted{{< /example >}}

<!--
2. Only bind PSPs to entire namespaces, by using the `system:serviceaccounts:<namespace>` group
   (where `<namespace>` is the target namespace). For example:

   ```yaml
   apiVersion: rbac.authorization.k8s.io/v1
   # This cluster role binding allows all pods in the "development" namespace to use the baseline PSP.
   kind: ClusterRoleBinding
   metadata:
     name: psp-baseline-namespaces
   roleRef:
     kind: ClusterRole
     name: psp-baseline
     apiGroup: rbac.authorization.k8s.io
   subjects:
   - kind: Group
     name: system:serviceaccounts:development
     apiGroup: rbac.authorization.k8s.io
   - kind: Group
     name: system:serviceaccounts:canary
     apiGroup: rbac.authorization.k8s.io
   ```
-->
2. 透過配置 `system:serviceaccounts:<namespace>` 組（`<namespace>` 是目標名字空間），
   僅將 PSP 繫結到整個名稱空間。示例：

    ```yaml
    apiVersion: rbac.authorization.k8s.io/v1
    # 此叢集角色繫結允許 "development" 名字空間中的所有 Pod 使用 baseline PSP。
    kind: ClusterRoleBinding
    metadata:
      name: psp-baseline-namespaces
    roleRef:
      kind: ClusterRole
      name: psp-baseline
      apiGroup: rbac.authorization.k8s.io
    subjects:
    - kind: Group
      name: system:serviceaccounts:development
      apiGroup: rbac.authorization.k8s.io
    - kind: Group
      name: system:serviceaccounts:canary
      apiGroup: rbac.authorization.k8s.io
    ```

<!--
### Troubleshooting

- The [Controller Manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)
  must be run against the secured API port and must not have superuser permissions. See
  [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access)
  to learn about API server access controls.  
  If the controller manager connected through the trusted API port (also known as the
  `localhost` listener), requests would bypass authentication and authorization modules;
  all PodSecurityPolicy objects would be allowed, and users would be able to create grant
  themselves the ability to create privileged containers.

  For more details on configuring controller manager authorization, see
  [Controller Roles](/docs/reference/access-authn-authz/rbac/#controller-roles).
-->
### 故障排查   {#troubleshooting}

- [控制器管理器元件](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)
  必須執行在安全的 API 埠之上，並且不能擁有超級使用者的訪問許可權。
  參閱[控制 Kubernetes API 的訪問](/zh-cn/docs/concepts/security/controlling-access)以瞭解
  API 伺服器的訪問控制。

  如果控制器管理器透過可信的 API 埠連線（也稱作 `localhost` 監聽元件），
  其請求會繞過身份認證和鑑權模組控制，從而導致所有 PodSecurityPolicy 物件都被允許，
  使用者亦能授予自身建立特權容器的特權。

  關於配置控制器管理器鑑權的進一步細節，
  請參閱[控制器角色](/zh-cn/docs/reference/access-authn-authz/rbac/#controller-roles)。

<!--
## Policy Order

In addition to restricting pod creation and update, pod security policies can
also be used to provide default values for many of the fields that it
controls. When multiple policies are available, the pod security policy
controller selects policies according to the following criteria:
-->
## 策略順序  {#policy-order}

除了限制 Pod 建立與更新，Pod 安全策略也可用來為其所控制的很多欄位設定預設值。
當存在多個策略物件時，Pod 安全策略控制器依據以下條件選擇策略：

<!--
1. PodSecurityPolicies which allow the pod as-is, without changing defaults or
   mutating the pod, are preferred.  The order of these non-mutating
   PodSecurityPolicies doesn't matter.
2. If the pod must be defaulted or mutated, the first PodSecurityPolicy
   (ordered by name) to allow the pod is selected.
-->
1. 優先考慮允許 Pod 保持原樣，不會更改 Pod 欄位預設值或其他配置的 PodSecurityPolicy。
   這類非更改性質的 PodSecurityPolicy 物件之間的順序無關緊要。
2. 如果必須要為 Pod 設定預設值或者其他配置，（按名稱順序）選擇第一個允許
   Pod 操作的 PodSecurityPolicy 物件。

{{< note >}}
<!--
During update operations (during which mutations to pod specs are disallowed)
only non-mutating PodSecurityPolicies are used to validate the pod.
-->
在更新操作期間（這時不允許更改 Pod 規約），僅使用非更改性質的
PodSecurityPolicy 來對 Pod 執行驗證操作。
{{< /note >}}

<!--
## Example

This example assumes you have a running cluster with the PodSecurityPolicy
admission controller enabled and you have cluster admin privileges.
-->
## 示例   {#example}

本示例假定你已經有一個啟動了 PodSecurityPolicy 准入控制器的叢集並且你擁有叢集管理員特權。

<!--
### Set up

Set up a namespace and a service account to act as for this example. We'll use
this service account to mock a non-admin user.
-->
### 配置   {#set-up}

為執行此示例，配置一個名字空間和一個服務賬號。我們將用這個服務賬號來模擬一個非管理員賬號的使用者。

```shell
kubectl create namespace psp-example
kubectl create serviceaccount -n psp-example fake-user
kubectl create rolebinding -n psp-example fake-editor --clusterrole=edit --serviceaccount=psp-example:fake-user
```

<!--
To make it clear which user we're acting as and save some typing, create 2
aliases:
-->
建立兩個別名，以更清晰地展示我們所使用的使用者賬號，同時減少一些鍵盤輸入：

```shell
alias kubectl-admin='kubectl -n psp-example'
alias kubectl-user='kubectl --as=system:serviceaccount:psp-example:fake-user -n psp-example'
```

<!--
### Create a policy and a pod

Define the example PodSecurityPolicy object in a file. This is a policy that
simply prevents the creation of privileged pods.
The name of a PodSecurityPolicy object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
### 建立一個策略和一個 Pod

在一個檔案中定義一個示例的 PodSecurityPolicy 物件。
這裡的策略只是用來禁止建立有特權要求的 Pods。
PodSecurityPolicy 物件的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。

{{< codenew file="policy/example-psp.yaml" >}}

<!--
And create it with kubectl:
-->
使用 kubectl 執行建立操作：

```shell
kubectl-admin create -f example-psp.yaml
```

<!--
Now, as the unprivileged user, try to create a simple pod:
-->
現在，作為一個非特權使用者，嘗試建立一個簡單的 Pod：

```shell
kubectl-user create -f- <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: pause
spec:
  containers:
    - name: pause
      image: k8s.gcr.io/pause
EOF
```

<!--
The output is similar to this:
-->
輸出類似於：
```
Error from server (Forbidden): error when creating "STDIN": pods "pause" is forbidden: unable to validate against any pod security policy: []
```

<!--
**What happened?** Although the PodSecurityPolicy was created, neither the
pod's service account nor `fake-user` have permission to use the new policy:
-->
**發生了什麼？** 儘管 PodSecurityPolicy 被建立，Pod 的服務賬號或者
`fake-user` 使用者都沒有使用該策略的許可權。

```shell
kubectl-user auth can-i use podsecuritypolicy/example
```

```
no
```
<!--
Create the rolebinding to grant `fake-user` the `use` verb on the example
policy:
-->
建立角色繫結，賦予 `fake-user` `use`（使用）示例策略的許可權：

{{< note >}}
<!--
This is not the recommended way! See the [next section](#run-another-pod)
for the preferred approach.
-->
不建議使用這種方法！
欲瞭解優先考慮的方法，請參見[下節](#run-another-pod)。
{{< /note >}}

```shell
kubectl-admin create role psp:unprivileged \
    --verb=use \
    --resource=podsecuritypolicy \
    --resource-name=example
```

輸出：

```
role "psp:unprivileged" created
```

```shell
kubectl-admin create rolebinding fake-user:psp:unprivileged \
    --role=psp:unprivileged \
    --serviceaccount=psp-example:fake-user
```

輸出：

```
rolebinding "fake-user:psp:unprivileged" created
```

```shell
kubectl-user auth can-i use podsecuritypolicy/example
```

輸出：

```
yes
```

<!--
Now retry creating the pod:
-->
現在重試建立 Pod：

```shell
kubectl-user create -f- <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: pause
spec:
  containers:
    - name: pause
      image: k8s.gcr.io/pause
EOF
```
<!--
The output is similar to this:
-->
輸出類似於：

```
pod "pause" created
```

<!--
It works as expected! But any attempts to create a privileged pod should still
be denied:
-->
此次嘗試不出所料地成功了！
不過任何建立特權 Pod 的嘗試還是會被拒絕：

```shell
kubectl-user create -f- <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: privileged
spec:
  containers:
    - name: pause
      image: k8s.gcr.io/pause
      securityContext:
        privileged: true
EOF
```

<!--
The output is similar to this:
-->

輸出類似於：
```
Error from server (Forbidden): error when creating "STDIN": pods "privileged" is forbidden: unable to validate against any pod security policy: [spec.containers[0].securityContext.privileged: Invalid value: true: Privileged containers are not allowed]
```

<!--
Delete the pod before moving on:
-->
繼續此例之前先刪除該 Pod：

```shell
kubectl-user delete pod pause
```

<!--
### Run another pod

Let's try that again, slightly differently:
-->
### 執行另一個 Pod  {#run-another-pod}

我們再試一次，稍微有些不同：

```shell
kubectl-user create deployment pause --image=k8s.gcr.io/pause
```

輸出為：

```
deployment "pause" created
```

```shell
kubectl-user get pods
```

輸出為：

```
No resources found.
```

```shell
kubectl-user get events | head -n 2
```

輸出為：
```
LASTSEEN   FIRSTSEEN   COUNT     NAME              KIND         SUBOBJECT                TYPE      REASON                  SOURCE                                  MESSAGE
1m         2m          15        pause-7774d79b5   ReplicaSet                            Warning   FailedCreate            replicaset-controller                   Error creating: pods "pause-7774d79b5-" is forbidden: no providers available to validate pod request
```

<!--
**What happened?** We already bound the `psp:unprivileged` role for our `fake-user`,
why are we getting the error `Error creating: pods "pause-7774d79b5-" is
forbidden: no providers available to validate pod request`? The answer lies in
the source - `replicaset-controller`. Fake-user successfully created the
deployment (which successfully created a replicaset), but when the replicaset
went to create the pod it was not authorized to use the example
podsecuritypolicy.
-->
**發生了什麼？** 我們已經為使用者 `fake-user` 綁定了 `psp:unprivileged` 角色，
為什麼還會收到錯誤 `Error creating: pods "pause-7774d79b5-" is
forbidden: no providers available to validate pod request
（建立錯誤：pods "pause-7774d79b5" 被禁止：沒有可用來驗證 pod 請求的驅動）`？ 
答案在於原始檔 - `replicaset-controller`。
`fake-user` 使用者成功地建立了 Deployment，而後者也成功地建立了 ReplicaSet，
不過當 ReplicaSet 建立 Pod 時，發現未被授權使用示例 PodSecurityPolicy 資源。

<!--
In order to fix this, bind the `psp:unprivileged` role to the pod's service
account instead. In this case (since we didn't specify it) the service account
is `default`:
-->
為了修復這一問題，將 `psp:unprivileged` 角色繫結到 Pod 的服務賬號。
在這裡，因為我們沒有給出服務賬號名稱，預設的服務賬號是 `default`。

```shell
kubectl-admin create rolebinding default:psp:unprivileged \
    --role=psp:unprivileged \
    --serviceaccount=psp-example:default
```

輸出為：

```none
rolebinding "default:psp:unprivileged" created
```

<!--
Now if you give it a minute to retry, the replicaset-controller should
eventually succeed in creating the pod:
-->
現在如果你給 ReplicaSet 控制器一分鐘的時間來重試，該控制器最終將能夠
成功地建立 Pod：

```shell
kubectl-user get pods --watch
```

輸出類似於：

```none
NAME                    READY     STATUS    RESTARTS   AGE
pause-7774d79b5-qrgcb   0/1       Pending   0         1s
pause-7774d79b5-qrgcb   0/1       Pending   0         1s
pause-7774d79b5-qrgcb   0/1       ContainerCreating   0         1s
pause-7774d79b5-qrgcb   1/1       Running   0         2s
```

<!--
### Clean up

Delete the namespace to clean up most of the example resources:
-->
### 清理  {#clean-up}

刪除名字空間即可清理大部分示例資源：

```shell
kubectl-admin delete ns psp-example
```

輸出類似於：

```
namespace "psp-example" deleted
```

<!--
Note that `PodSecurityPolicy` resources are not namespaced, and must be cleaned
up separately:
-->
注意 `PodSecurityPolicy` 資源不是名字空間域的資源，必須單獨清理：

```shell
kubectl-admin delete psp example
```

輸出類似於：

```none
podsecuritypolicy "example" deleted
```

<!--
### Example Policies

This is the least restrictive policy you can create, equivalent to not using the
pod security policy admission controller:
-->
### 示例策略  {#example-policies}

下面是一個你可以建立的約束性非常弱的策略，其效果等價於沒有使用 Pod 安全策略准入控制器：

{{< codenew file="policy/privileged-psp.yaml" >}}

<!--
This is an example of a restrictive policy that requires users to run as an
unprivileged user, blocks possible escalations to root, and requires use of
several security mechanisms.
-->
下面是一個具有約束性的策略，要求使用者以非特權賬號執行，禁止可能的向 root 許可權的升級，
同時要求使用若干安全機制。

{{< codenew file="policy/restricted-psp.yaml" >}}

<!--
See [Pod Security Standards](/docs/concepts/security/pod-security-standards/#policy-instantiation) for more examples.
-->
更多的示例可參考
[Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/#policy-instantiation)。

<!--
## Policy Reference

### Privileged

**Privileged** - determines if any container in a pod can enable privileged mode.
By default a container is not allowed to access any devices on the host, but a
"privileged" container is given access to all devices on the host. This allows
the container nearly all the same access as processes running on the host.
This is useful for containers that want to use linux capabilities like
manipulating the network stack and accessing devices.
-->
## 策略參考    {#policy-reference}

### Privileged

**Privileged** - 決定是否 Pod 中的某容器可以啟用特權模式。
預設情況下，容器是不可以訪問宿主上的任何裝置的，不過一個“privileged（特權的）”
容器則被授權訪問宿主上所有裝置。
這種容器幾乎享有宿主上執行的程序的所有訪問許可權。
對於需要使用 Linux 權能字（如操控網路堆疊和訪問裝置）的容器而言是有用的。

<!--
### Host namespaces

**HostPID** - Controls whether the pod containers can share the host process ID
namespace. Note that when paired with ptrace this can be used to escalate
privileges outside of the container (ptrace is forbidden by default).

**HostIPC** - Controls whether the pod containers can share the host IPC
namespace.

**HostNetwork** - Controls whether the pod may use the node network
namespace. Doing so gives the pod access to the loopback device, services
listening on localhost, and could be used to snoop on network activity of other
pods on the same node.

**HostPorts** - Provides a list of ranges of allowable ports in the host
network namespace. Defined as a list of `HostPortRange`, with `min`(inclusive)
and `max`(inclusive). Defaults to no allowed host ports.
-->
### 宿主名字空間   {#host-namespaces}

**HostPID** - 控制 Pod 中容器是否可以共享宿主上的程序 ID 空間。
注意，如果與 `ptrace` 相結合，這種授權可能被利用，導致向容器外的特權逃逸
（預設情況下 `ptrace` 是被禁止的）。

**HostIPC** - 控制 Pod 容器是否可共享宿主上的 IPC 名字空間。

**HostNetwork** - 控制是否 Pod 可以使用節點的網路名字空間。
此類授權將允許 Pod 訪問本地迴路（loopback）裝置、在本地主機（localhost）
上監聽的服務、還可能用來監聽同一節點上其他 Pod 的網路活動。

**HostPorts** -提供可以在宿主網路名字空間中可使用的埠範圍列表。 
該屬性定義為一組 `HostPortRange` 物件的列表，每個物件中包含
`min`（含）與 `max`（含）值的設定。
預設不允許訪問宿主埠。

<!--
### Volumes and file systems

**Volumes** - Provides a list of allowed volume types. The allowable values
correspond to the volume sources that are defined when creating a volume. For
the complete list of volume types, see [Types of
Volumes](/docs/concepts/storage/volumes/#types-of-volumes). Additionally,
`*` may be used to allow all volume types.

The **recommended minimum set** of allowed volumes for new PSPs are:
-->
### 卷和檔案系統   {#volumes-and-file-systems}

**Volumes** - 提供一組被允許的卷型別列表。可被允許的值對應於建立卷時可以設定的捲來源。
卷型別的完整列表可參見[卷型別](/zh-cn/docs/concepts/storage/volumes/#types-of-volumes)。
此外，`*` 可以用來允許所有卷型別。

對於新的 Pod 安全策略設定而言，建議設定的卷型別的**最小列表**包含：

- `configMap`
- `downwardAPI`
- `emptyDir`
- `persistentVolumeClaim`
- `secret`
- `projected`

{{< warning >}}
<!--
PodSecurityPolicy does not limit the types of `PersistentVolume` objects that
may be referenced by a `PersistentVolumeClaim`, and hostPath type
`PersistentVolumes` do not support read-only access mode. Only trusted users
should be granted permission to create `PersistentVolume` objects.
-->
PodSecurityPolicy 並不限制可以被 `PersistentVolumeClaim` 所引用的
`PersistentVolume` 物件的型別。
此外 `hostPath` 型別的 `PersistentVolume` 不支援只讀訪問模式。
應該僅賦予受信使用者建立 `PersistentVolume` 物件的訪問許可權。
{{< /warning >}}

<!--
**FSGroup** - Controls the supplemental group applied to some volumes.

- *MustRunAs* - Requires at least one `range` to be specified. Uses the
minimum value of the first range as the default. Validates against all ranges.
- *MayRunAs* - Requires at least one `range` to be specified. Allows
`FSGroups` to be left unset without providing a default. Validates against
all ranges if `FSGroups` is set.
- *RunAsAny* - No default provided. Allows any `fsGroup` ID to be specified.
-->
**FSGroup** - 控制應用到某些捲上的附加使用者組。

- *MustRunAs* - 要求至少指定一個 `range`。
  使用範圍中的最小值作為預設值。所有 range 值都會被用來執行驗證。
- *MayRunAs* - 要求至少指定一個 `range`。
  允許不設定 `FSGroups`，且無預設值。
  如果 `FSGroup` 被設定，則所有 range 值都會被用來執行驗證檢查。
- *RunAsAny* - 不提供預設值。允許設定任意 `fsGroup` ID 值。

<!--
**AllowedHostPaths** - This specifies a list of host paths that are allowed
to be used by hostPath volumes. An empty list means there is no restriction on
host paths used. This is defined as a list of objects with a single `pathPrefix`
field, which allows hostPath volumes to mount a path that begins with an
allowed prefix, and a `readOnly` field indicating it must be mounted read-only.
For example:
-->
**AllowedHostPaths** - 設定一組宿主檔案目錄，這些目錄項可以在 `hostPath` 卷中使用。
列表為空意味著對所使用的宿主目錄沒有限制。
此選項定義包含一個物件列表，表中物件包含 `pathPrefix` 欄位，用來表示允許
`hostPath` 卷掛載以所指定字首開頭的路徑。
物件中還包含一個 `readOnly` 欄位，用來表示對應的卷必須以只讀方式掛載。
例如：

<!--
```yaml
allowedHostPaths:
  # This allows "/foo", "/foo/", "/foo/bar" etc., but
  # disallows "/fool", "/etc/foo" etc.
  # "/foo/../" is never valid.
  - pathPrefix: "/foo"
    readOnly: true # only allow read-only mounts
```
-->
```yaml
allowedHostPaths:
  # 下面的設定允許 "/foo"、"/foo/"、"/foo/bar" 等路徑，但禁止
  # "/fool"、"/etc/foo" 這些路徑。
  # "/foo/../" 總會被當作非法路徑。
  - pathPrefix: "/foo"
    readOnly: true # 僅允許只讀模式掛載
```

{{< warning >}}
<!--
There are many ways a container with unrestricted access to the host
filesystem can escalate privileges, including reading data from other
containers, and abusing the credentials of system services, such as Kubelet.
-->
容器如果對宿主檔案系統擁有不受限制的訪問許可權，就可以有很多種方式提升自己的特權，
包括讀取其他容器中的資料、濫用系統服務（如 `kubelet`）的憑據資訊等。

<!--
Writeable hostPath directory volumes allow containers to write
to the filesystem in ways that let them traverse the host filesystem outside the `pathPrefix`.
`readOnly: true`, available in Kubernetes 1.11+, must be used on **all** `allowedHostPaths`
to effectively limit access to the specified `pathPrefix`.
-->
由可寫入的目錄所構造的 `hostPath` 卷能夠允許容器寫入資料到宿主檔案系統，
並且在寫入時避開 `pathPrefix` 所設定的目錄限制。
`readOnly: true` 這一設定在 Kubernetes 1.11 版本之後可用。
必須針對 `allowedHostPaths` 中的 *所有* 條目設定此屬性才能有效地限制容器只能訪問
`pathPrefix` 所指定的目錄。
{{< /warning >}}

<!--
**ReadOnlyRootFilesystem** - Requires that containers must run with a read-only
root filesystem (i.e. no writable layer).
-->
**ReadOnlyRootFilesystem** - 要求容器必須以只讀方式掛載根檔案系統來執行
（即不允許存在可寫入層）。

<!--
### FlexVolume drivers

This specifies a list of FlexVolume drivers that are allowed to be used
by flexvolume. An empty list or nil means there is no restriction on the drivers.
Please make sure [`volumes`](#volumes-and-file-systems) field contains the
`flexVolume` volume type; no FlexVolume driver is allowed otherwise.

For example:
-->
### FlexVolume 驅動  {#flexvolume-drivers}

此配置指定一個可以被 FlexVolume 卷使用的驅動程式的列表。
空的列表或者 nil 值意味著對驅動沒有任何限制。
請確保[`volumes`](#volumes-and-file-systems) 欄位包含了 `flexVolume` 卷型別，
否則所有 FlexVolume 驅動都被禁止。

<!--
```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: allow-flex-volumes
spec:
  # ... other spec fields
  volumes:
    - flexVolume
  allowedFlexVolumes:
    - driver: example/lvm
    - driver: example/cifs
```
-->

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: allow-flex-volumes
spec:
  # spec 的其他欄位
  volumes:
    - flexVolume
  allowedFlexVolumes:
    - driver: example/lvm
    - driver: example/cifs
```

<!--
### Users and groups

**RunAsUser** - Controls which user ID the containers are run with.

- *MustRunAs* - Requires at least one `range` to be specified. Uses the
  minimum value of the first range as the default. Validates against all ranges.
- *MustRunAsNonRoot* - Requires that the pod be submitted with a non-zero
  `runAsUser` or have the `USER` directive defined (using a numeric UID) in the
  image. Pods which have specified neither `runAsNonRoot` nor `runAsUser` settings
  will be mutated to set `runAsNonRoot=true`, thus requiring a defined non-zero 
  numeric `USER` directive in the container. No default provided. Setting 
  `allowPrivilegeEscalation=false` is strongly recommended with this strategy.
- *RunAsAny* - No default provided. Allows any `runAsUser` to be specified.
-->
### 使用者和組    {#users-and-groups}

**RunAsUser** - 控制使用哪個使用者 ID 來執行容器。

- *MustRunAs* - 必須至少設定一個 `range`。使用該範圍內的第一個值作為預設值。
  所有範圍值都會被驗證檢查。

- *MustRunAsNonRoot* - 要求提交的 Pod 具有非零 `runAsUser` 值，或在映象中
  （使用 UID 數值）定義了 `USER` 環境變數。
  如果 Pod 既沒有設定 `runAsNonRoot`，也沒有設定 `runAsUser`，則該 Pod
  會被修改以設定 `runAsNonRoot=true`，從而要求容器透過 `USER` 指令給出非零的數值形式的使用者 ID。
  此配置沒有預設值。採用此配置時，強烈建議設定 `allowPrivilegeEscalation=false`。
- *RunAsAny* - 沒有提供預設值。允許指定任何 `runAsUser` 配置。

<!--
**RunAsGroup** - Controls which primary group ID the containers are run with.

- *MustRunAs* - Requires at least one `range` to be specified. Uses the 
  minimum value of the first range as the default. Validates against all ranges.
- *MayRunAs* - Does not require that RunAsGroup be specified. However, when RunAsGroup
  is specified, they have to fall in the defined range.
- *RunAsAny* - No default provided. Allows any `runAsGroup` to be specified.
-->
**RunAsGroup** - 控制執行容器時使用的主使用者組 ID。

- *MustRunAs* - 要求至少指定一個 `range` 值。第一個範圍中的最小值作為預設值。
  所有範圍值都被用來執行驗證檢查。
- *MayRunAs* - 不要求設定 `RunAsGroup`。
  不過，如果指定了 `RunAsGroup` 被設定，所設定值必須處於所定義的範圍內。
- *RunAsAny* - 未指定預設值。允許 `runAsGroup` 設定任何值。

<!--
**SupplementalGroups** - Controls which group IDs containers add.

- *MustRunAs* - Requires at least one `range` to be specified. Uses the
  minimum value of the first range as the default. Validates against all ranges.
- *MayRunAs* - Requires at least one `range` to be specified. Allows
  `supplementalGroups` to be left unset without providing a default.
  Validates against all ranges if `supplementalGroups` is set.
- *RunAsAny* - No default provided. Allows any `supplementalGroups` to be
  specified.
-->
**SupplementalGroups** - 控制容器可以新增的組 ID。

- *MustRunAs* - 要求至少指定一個 `range` 值。第一個範圍中的最小值用作預設值。
  所有範圍值都被用來執行驗證檢查。
- *MayRunAs* - 要求至少指定一個 `range` 值。
  允許不指定 `supplementalGroups` 且不設定預設值。
  如果 `supplementalGroups` 被設定，則所有 range 值都被用來執行驗證檢查。
- *RunAsAny* - 未指定預設值。允許為 `supplementalGroups` 設定任何值。

<!--
### Privilege Escalation

These options control the `allowPrivilegeEscalation` container option. This bool
directly controls whether the
[`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)
flag gets set on the container process. This flag will prevent `setuid` binaries
from changing the effective user ID, and prevent files from enabling extra
capabilities (e.g. it will prevent the use of the `ping` tool). This behavior is
required to effectively enforce `MustRunAsNonRoot`.
-->
### 特權提升   {#privilege-escalation}

這一組選項控制容器的`allowPrivilegeEscalation` 屬性。該屬性直接決定是否為容器程序設定
[`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)
引數。此引數會禁止 `setuid` 屬性的可執行檔案更改有效使用者 ID（EUID），
並且禁止啟用額外權能的檔案。例如，`no_new_privs` 會禁止使用 `ping` 工具。
如果想有效地實施 `MustRunAsNonRoot` 控制，需要配置這一選項。

<!--
**AllowPrivilegeEscalation** - Gates whether or not a user is allowed to set the
security context of a container to `allowPrivilegeEscalation=true`. This
defaults to allowed so as to not break setuid binaries. Setting it to `false`
ensures that no child process of a container can gain more privileges than its parent.
-->
**AllowPrivilegeEscalation** - 決定是否使用者可以將容器的安全上下文設定為
`allowPrivilegeEscalation=true`。預設設定下，這樣做是允許的，
目的是避免造成現有的 `setuid` 應用無法執行。將此選項設定為 `false`
可以確保容器的所有子程序都無法獲得比父程序更多的特權。

<!--
**DefaultAllowPrivilegeEscalation** - Sets the default for the
`allowPrivilegeEscalation` option. The default behavior without this is to allow
privilege escalation so as to not break setuid binaries. If that behavior is not
desired, this field can be used to default to disallow, while still permitting
pods to request `allowPrivilegeEscalation` explicitly.
-->
**DefaultAllowPrivilegeEscalation** - 為 `allowPrivilegeEscalation` 選項設定預設值。
不設定此選項時的預設行為是允許特權提升，以便執行 setuid 程式。
如果不希望執行 setuid 程式，可以使用此欄位將選項的預設值設定為禁止，
同時仍然允許 Pod 顯式地請求 `allowPrivilegeEscalation`。 

<!--
### Capabilities

Linux capabilities provide a finer grained breakdown of the privileges
traditionally associated with the superuser. Some of these capabilities can be
used to escalate privileges or for container breakout, and may be restricted by
the PodSecurityPolicy. For more details on Linux capabilities, see
[capabilities(7)](http://man7.org/linux/man-pages/man7/capabilities.7.html).

The following fields take a list of capabilities, specified as the capability
name in ALL_CAPS without the `CAP\_` prefix.
-->
### 權能字    {#capabilities}

Linux 權能字（Capabilities）將傳統上與超級使用者相關聯的特權作了細粒度的分解。
其中某些權能字可以用來提升特權，打破容器邊界，可以透過 PodSecurityPolicy 來限制。
關於 Linux 權能字的更多細節，可參閱
[capabilities(7)](http://man7.org/linux/man-pages/man7/capabilities.7.html)。

下列欄位都可以配置為權能字的列表。表中的每一項都是 `ALL_CAPS` 中的一個權能字名稱，
只是需要去掉 `CAP_` 字首。

<!--
**AllowedCapabilities** - Provides a list of capabilities that are allowed to be added
to a container. The default set of capabilities are implicitly allowed. The
empty set means that no additional capabilities may be added beyond the default
set. `*` can be used to allow all capabilities.
-->
**AllowedCapabilities** - 給出可以被新增到容器的權能字列表。
預設的權能字集合是被隱式允許的那些。空集合意味著只能使用預設權能字集合，
不允許新增額外的權能字。`*` 可以用來設定允許所有權能字。

<!--
**RequiredDropCapabilities** - The capabilities which must be dropped from
containers. These capabilities are removed from the default set, and must not be
added. Capabilities listed in `RequiredDropCapabilities` must not be included in
`AllowedCapabilities` or `DefaultAddCapabilities`.
-->
**RequiredDropCapabilities** - 必須從容器中去除的權能字。
所給的權能字會從預設權能字集合中去除，並且一定不可以新增。
`RequiredDropCapabilities` 中列舉的權能字不能出現在
`AllowedCapabilities` 或 `DefaultAddCapabilities` 所給的列表中。

<!--
**DefaultAddCapabilities** - The capabilities which are added to containers by
default, in addition to the runtime defaults. See the
documentation for your container runtime for information on working with Linux capabilities. 
-->
**DefaultAddCapabilities** - 預設新增到容器的權能字集合。
這一集合是作為容器執行時所設值的補充。
關於使用 Docker 容器執行引擎時預設的權能字列表，
可參閱你的容器執行時的文件來了解使用 Linux 權能字的資訊。

<!--
### SELinux

- *MustRunAs* - Requires `seLinuxOptions` to be configured. Uses
`seLinuxOptions` as the default. Validates against `seLinuxOptions`.
- *RunAsAny* - No default provided. Allows any `seLinuxOptions` to be
specified.
-->
### SELinux

- *MustRunAs* - 要求必須配置 `seLinuxOptions`。預設使用 `seLinuxOptions`。
  針對 `seLinuxOptions` 所給值執行驗證檢查。
- *RunAsAny* - 沒有提供預設值。允許任意指定的 `seLinuxOptions` 選項。

<!--
### AllowedProcMountTypes

`allowedProcMountTypes` is a list of allowed ProcMountTypes.
Empty or nil indicates that only the `DefaultProcMountType` may be used.

`DefaultProcMount` uses the container runtime defaults for readonly and masked
paths for /proc.  Most container runtimes mask certain paths in /proc to avoid
accidental security exposure of special devices or information. This is denoted
as the string `Default`.

The only other ProcMountType is `UnmaskedProcMount`, which bypasses the
default masking behavior of the container runtime and ensures the newly
created /proc the container stays intact with no modifications. This is
denoted as the string `Unmasked`.
-->
### AllowedProcMountTypes

`allowedProcMountTypes` 是一組可以允許的 proc 掛載型別列表。
空表或者 nil 值表示只能使用 `DefaultProcMountType`。

`DefaultProcMount` 使用容器執行時的預設值設定來決定 `/proc` 的只讀掛載模式和路徑遮蔽。
大多數容器執行時都會遮蔽 `/proc` 下面的某些路徑以避免特殊裝置或資訊被不小心暴露給容器。
這一配置使所有 `Default` 字串值來表示。

此外唯一的ProcMountType 是 `UnmaskedProcMount`，意味著即將繞過容器執行時的路徑遮蔽行為，
確保新建立的 `/proc` 不會被容器修改。此配置用字串 `Unmasked` 來表示。

<!--
### AppArmor

Controlled via annotations on the PodSecurityPolicy. Refer to the [AppArmor
documentation](/docs/tutorials/policy/apparmor/#podsecuritypolicy-annotations).
-->
### AppArmor

透過 PodSecurityPolicy 上的註解來控制。
詳情請參閱
[AppArmor 文件](/zh-cn/docs/tutorials/policy/apparmor/#podsecuritypolicy-annotations)。


<!--
### Seccomp

As of Kubernetes v1.19, you can use the `seccompProfile` field in the
`securityContext` of Pods or containers to
[control use of seccomp profiles](/docs/tutorials/security/seccomp/).
In prior versions, seccomp was controlled by adding annotations to a Pod. The
same PodSecurityPolicies can be used with either version to enforce how these
fields or annotations are applied.

**seccomp.security.alpha.kubernetes.io/defaultProfileName** - Annotation that
specifies the default seccomp profile to apply to containers. Possible values
are:
-->
### Seccomp

從 Kubernetes v1.19 開始，你可以使用 Pod 或容器的 `securityContext` 中的 `seccompProfile`
欄位來[控制 seccomp 配置的使用](/zh-cn/docs/tutorials/security/seccomp/)。
在更早的版本中，seccomp 是透過為 Pod 添加註解來控制的。
相同的 PodSecurityPolicy 可以用於不同版本，進而控制如何應用對應的欄位或註解。

**seccomp.security.alpha.kubernetes.io/defaultProfileName** -
註解用來指定為容器配置預設的 seccomp 模版。可選值為：

<!--
- `unconfined` - Seccomp is not applied to the container processes (this is the
  default in Kubernetes), if no alternative is provided.
- `runtime/default` - The default container runtime profile is used.
- `docker/default` - The Docker default seccomp profile is used. Deprecated as
  of Kubernetes 1.11. Use `runtime/default` instead.
- `localhost/<path>` - Specify a profile as a file on the node located at
  `<seccomp_root>/<path>`, where `<seccomp_root>` is defined via the
  `-seccomp-profile-root` flag on the Kubelet. If the `--seccomp-profile-root`
  flag is not defined, the default path will be used, which is
  `<root-dir>/seccomp` where `<root-dir>` is specified by the `--root-dir` flag.

  {{< note >}}
  The `--seccomp-profile-root` flag is deprecated since Kubernetes
  v1.19. Users are encouraged to use the default path.
  {{< /note >}}

-->
- `unconfined` - 如果沒有指定其他替代方案，Seccomp 不會被應用到容器程序上
  （Kubernets 中的預設設定）。
- `runtime/default` - 使用預設的容器執行時模版。
- `docker/default` - 使用 Docker 的預設 seccomp 模版。自 1.11 版本廢棄。
  應改為使用 `runtime/default`。
- `localhost/<路徑名>` - 指定節點上路徑 `<seccomp_root>/<路徑名>` 下的一個檔案作為其模版。
  其中 `<seccomp_root>` 是透過 `kubelet` 的標誌 `--seccomp-profile-root` 來指定的。
  如果未定義 `--seccomp-profile-root` 標誌，則使用預設的路徑 `<root-dir>/seccomp`，
  其中 `<root-dir>` 是透過 `--root-dir` 標誌來設定的。

  {{< note >}}
  <!--
  The `--seccomp-profile-root` flag is deprecated since Kubernetes
  v1.19. Users are encouraged to use the default path.
  -->
  從 Kubernetes v1.19 開始，`--seccomp-profile-root` 標誌已被啟用。
  使用者應嘗試使用預設路徑。
  {{< /note >}}

<!--
**seccomp.security.alpha.kubernetes.io/allowedProfileNames** - Annotation that
specifies which values are allowed for the pod seccomp annotations. Specified as
a comma-delimited list of allowed values. Possible values are those listed
above, plus `*` to allow all profiles. Absence of this annotation means that the
default cannot be changed.
-->
**seccomp.security.alpha.kubernetes.io/allowedProfileNames** - 指定可以為
Pod seccomp 註解配置的值的註解。取值為一個可用值的列表。
表中每項可以是上述各值之一，還可以是 `*`，用來表示允許所有的模版。
如果沒有設定此註解，意味著預設的 seccomp 模版是不可更改的。

<!--
### Sysctl

By default, all safe sysctls are allowed. 
-->
### Sysctl

預設情況下，所有的安全的 sysctl 都是被允許的。

<!--
- `forbiddenSysctls` - excludes specific sysctls. You can forbid a combination
  of safe and unsafe sysctls in the list. To forbid setting any sysctls, use
  `*` on its own.
- `allowedUnsafeSysctls` - allows specific sysctls that had been disallowed by
  the default list, so long as these are not listed in `forbiddenSysctls`.
-->
- `forbiddenSysctls` - 用來排除某些特定的 sysctl。
  你可以在此列表中禁止一些安全的或者不安全的 sysctl。
  此選項設定為 `*` 意味著禁止設定所有 sysctl。
- `allowedUnsafeSysctls` - 用來啟用那些被預設列表所禁用的 sysctl，
  前提是所啟用的 sysctl 沒有被列在 `forbiddenSysctls` 中。

<!--
Refer to the [Sysctl documentation](/docs/tasks/administer-cluster/sysctl-cluster/#podsecuritypolicy).
-->
參閱 [Sysctl 文件](/zh-cn/docs/tasks/administer-cluster/sysctl-cluster/#podsecuritypolicy)。

## {{% heading "whatsnext" %}}

<!--
- See [PodSecurityPolicy Deprecation: Past, Present, and
  Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/) to learn about
  the future of pod security policy.

- See [Pod Security Standards](/docs/concepts/security/pod-security-standards/) for policy recommendations.

- Refer to [Pod Security Policy Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritypolicy-v1beta1-policy) for the api details.
-->
- 參閱 [PodSecurityPolicy Deprecation: Past, Present, and
  Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)，
  瞭解 Pod 安全策略的未來。

- 參閱[Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/)，
  瞭解策略建議。
- 閱讀 [Pod 安全策略參考](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritypolicy-v1beta1-policy)，
  瞭解 API 細節。

