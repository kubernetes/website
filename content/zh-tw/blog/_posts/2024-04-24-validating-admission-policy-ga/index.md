---
layout: blog
title: "Kubernetes 1.30：驗證准入策略 ValidatingAdmissionPolicy 正式發佈"
slug: validating-admission-policy-ga
date: 2024-04-24
author: >
  Jiahui Feng (Google)
translator: Michael Yao (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes 1.30: Validating Admission Policy Is Generally Available"
slug: validating-admission-policy-ga
date: 2024-04-24
author: >
  Jiahui Feng (Google)
-->

<!--
On behalf of the Kubernetes project, I am excited to announce that ValidatingAdmissionPolicy has reached
**general availability**
as part of Kubernetes 1.30 release. If you have not yet read about this new declarative alternative to
validating admission webhooks, it may be interesting to read our
[previous post](/blog/2022/12/20/validating-admission-policies-alpha/) about the new feature.
If you have already heard about ValidatingAdmissionPolicies and you are eager to try them out,
there is no better time to do it than now.

Let's have a taste of a ValidatingAdmissionPolicy, by replacing a simple webhook.
-->
我代表 Kubernetes 項目組成員，很高興地宣佈 ValidatingAdmissionPolicy 已經作爲 Kubernetes 1.30 發佈的一部分**正式發佈**。
如果你還不瞭解這個全新的聲明式驗證准入 Webhook 的替代方案，
請參閱有關這個新特性的[上一篇博文](/blog/2022/12/20/validating-admission-policies-alpha/)。
如果你已經對 ValidatingAdmissionPolicy 有所瞭解並且想要嘗試一下，那麼現在是最好的時機。

讓我們替換一個簡單的 Webhook，體驗一下 ValidatingAdmissionPolicy。

<!--
## Example admission webhook
First, let's take a look at an example of a simple webhook. Here is an excerpt from a webhook that
enforces `runAsNonRoot`, `readOnlyRootFilesystem`, `allowPrivilegeEscalation`, and `privileged` to be set to the least permissive values.
-->
## 准入 Webhook 示例

首先，讓我們看一個簡單 Webhook 的示例。以下是一個強制將
`runAsNonRoot`、`readOnlyRootFilesystem`、`allowPrivilegeEscalation` 和 `privileged` 設置爲最低權限值的 Webhook 代碼片段。

```go
func verifyDeployment(deploy *appsv1.Deployment) error {
	var errs []error
	for i, c := range deploy.Spec.Template.Spec.Containers {
		if c.Name == "" {
			return fmt.Errorf("container %d has no name", i)
		}
		if c.SecurityContext == nil {
			errs = append(errs, fmt.Errorf("container %q does not have SecurityContext", c.Name))
		}
		if c.SecurityContext.RunAsNonRoot == nil || !*c.SecurityContext.RunAsNonRoot {
			errs = append(errs, fmt.Errorf("container %q must set RunAsNonRoot to true in its SecurityContext", c.Name))
		}
		if c.SecurityContext.ReadOnlyRootFilesystem == nil || !*c.SecurityContext.ReadOnlyRootFilesystem {
			errs = append(errs, fmt.Errorf("container %q must set ReadOnlyRootFilesystem to true in its SecurityContext", c.Name))
		}
		if c.SecurityContext.AllowPrivilegeEscalation != nil && *c.SecurityContext.AllowPrivilegeEscalation {
			errs = append(errs, fmt.Errorf("container %q must NOT set AllowPrivilegeEscalation to true in its SecurityContext", c.Name))
		}
		if c.SecurityContext.Privileged != nil && *c.SecurityContext.Privileged {
			errs = append(errs, fmt.Errorf("container %q must NOT set Privileged to true in its SecurityContext", c.Name))
		}
	}
	return errors.NewAggregate(errs)
}
```

<!--
Check out [What are admission webhooks?](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
Or, see the [full code](webhook.go) of this webhook to follow along with this walkthrough. 

## The policy
Now let's try to recreate the validation faithfully with a ValidatingAdmissionPolicy.
-->
查閱[什麼是准入 Webhook？](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)，
或者查看這個 Webhook 的[完整代碼](webhook.go)以便更好地理解下述演示。

## 策略

現在，讓我們嘗試使用 ValidatingAdmissionPolicy 來忠實地重新創建驗證。

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "pod-security.policy.example.com"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["apps"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["deployments"]
  validations:
  - expression: object.spec.template.spec.containers.all(c, has(c.securityContext) && has(c.securityContext.runAsNonRoot) && c.securityContext.runAsNonRoot)
    message: 'all containers must set runAsNonRoot to true'
  - expression: object.spec.template.spec.containers.all(c, has(c.securityContext) && has(c.securityContext.readOnlyRootFilesystem) && c.securityContext.readOnlyRootFilesystem)
    message: 'all containers must set readOnlyRootFilesystem to true'
  - expression: object.spec.template.spec.containers.all(c, !has(c.securityContext) || !has(c.securityContext.allowPrivilegeEscalation) || !c.securityContext.allowPrivilegeEscalation)
    message: 'all containers must NOT set allowPrivilegeEscalation to true'
  - expression: object.spec.template.spec.containers.all(c, !has(c.securityContext) || !has(c.securityContext.Privileged) || !c.securityContext.Privileged)
    message: 'all containers must NOT set privileged to true'
```

<!--
Create the policy with `kubectl`. Great, no complain so far. But let's get the policy object back and take a look at its status.
-->
使用 `kubectl` 創建策略。很好，到目前爲止沒有任何問題。那我們獲取此策略對象並查看其狀態。

```shell
kubectl get -oyaml validatingadmissionpolicies/pod-security.policy.example.com
```

```yaml
  status:
    typeChecking:
      expressionWarnings:
      - fieldRef: spec.validations[3].expression
        warning: |
          apps/v1, Kind=Deployment: ERROR: <input>:1:76: undefined field 'Privileged'
           | object.spec.template.spec.containers.all(c, !has(c.securityContext) || !has(c.securityContext.Privileged) || !c.securityContext.Privileged)
           | ...........................................................................^
          ERROR: <input>:1:128: undefined field 'Privileged'
           | object.spec.template.spec.containers.all(c, !has(c.securityContext) || !has(c.securityContext.Privileged) || !c.securityContext.Privileged)
           | ...............................................................................................................................^

```

<!--
The policy was checked against its matched type, which is `apps/v1.Deployment`.
Looking at the `fieldRef`, the problem was with the 3rd expression (index starts with 0)
The expression in question accessed an undefined `Privileged` field.
Ahh, looks like it was a copy-and-paste error. The field name should be in lowercase.
-->
系統根據所匹配的類別 `apps/v1.Deployment` 對策略執行了檢查。
查看 `fieldRef` 後，發現問題出現在第 3 個表達式上（索引從 0 開始）。
有問題的表達式訪問了一個未定義的 `Privileged` 字段。
噢，看起來是一個複製粘貼錯誤。字段名應該是小寫的。

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "pod-security.policy.example.com"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["apps"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["deployments"]
  validations:
  - expression: object.spec.template.spec.containers.all(c, has(c.securityContext) && has(c.securityContext.runAsNonRoot) && c.securityContext.runAsNonRoot)
    message: 'all containers must set runAsNonRoot to true'
  - expression: object.spec.template.spec.containers.all(c, has(c.securityContext) && has(c.securityContext.readOnlyRootFilesystem) && c.securityContext.readOnlyRootFilesystem)
    message: 'all containers must set readOnlyRootFilesystem to true'
  - expression: object.spec.template.spec.containers.all(c, !has(c.securityContext) || !has(c.securityContext.allowPrivilegeEscalation) || !c.securityContext.allowPrivilegeEscalation)
    message: 'all containers must NOT set allowPrivilegeEscalation to true'
  - expression: object.spec.template.spec.containers.all(c, !has(c.securityContext) || !has(c.securityContext.privileged) || !c.securityContext.privileged)
    message: 'all containers must NOT set privileged to true'
```

<!--
Check its status again, and you should see all warnings cleared.

Next, let's create a namespace for our tests.
-->
再次檢查狀態，你應該看到所有警告都已被清除。

接下來，我們創建一個命名空間進行測試。

```shell
kubectl create namespace policy-test
```

<!--
Then, I bind the policy to the namespace. But at this point, I set the action to `Warn`
so that the policy prints out [warnings](/blog/2020/09/03/warnings/) instead of rejecting the requests.
This is especially useful to collect results from all expressions during development and automated testing.
-->
接下來，我將策略綁定到命名空間。但此時我將動作設置爲 `Warn`，
這樣此策略將打印出[警告](/zh-cn/blog/2020/09/03/warnings/)而不是拒絕請求。
這對於在開發和自動化測試期間收集所有表達式的結果非常有用。

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "pod-security.policy-binding.example.com"
spec:
  policyName: "pod-security.policy.example.com"
  validationActions: ["Warn"]
  matchResources:
    namespaceSelector:
      matchLabels:
        "kubernetes.io/metadata.name": "policy-test"
```

<!--
Tests out policy enforcement.
-->
測試策略的執行過程。

```shell
kubectl create -n policy-test -f- <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nginx
  name: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx
        name: nginx
        securityContext:
          privileged: true
          allowPrivilegeEscalation: true
EOF
```

```text
Warning: Validation failed for ValidatingAdmissionPolicy 'pod-security.policy.example.com' with binding 'pod-security.policy-binding.example.com': all containers must set runAsNonRoot to true
Warning: Validation failed for ValidatingAdmissionPolicy 'pod-security.policy.example.com' with binding 'pod-security.policy-binding.example.com': all containers must set readOnlyRootFilesystem to true
Warning: Validation failed for ValidatingAdmissionPolicy 'pod-security.policy.example.com' with binding 'pod-security.policy-binding.example.com': all containers must NOT set allowPrivilegeEscalation to true
Warning: Validation failed for ValidatingAdmissionPolicy 'pod-security.policy.example.com' with binding 'pod-security.policy-binding.example.com': all containers must NOT set privileged to true
Error from server: error when creating "STDIN": admission webhook "webhook.example.com" denied the request: [container "nginx" must set RunAsNonRoot to true in its SecurityContext, container "nginx" must set ReadOnlyRootFilesystem to true in its SecurityContext, container "nginx" must NOT set AllowPrivilegeEscalation to true in its SecurityContext, container "nginx" must NOT set Privileged to true in its SecurityContext]
```

<!--
Looks great! The policy and the webhook give equivalent results.
After a few other cases, when we are confident with our policy, maybe it is time to do some cleanup.

- For every expression, we repeat access to `object.spec.template.spec.containers` and to each `securityContext`;
- There is a pattern of checking presence of a field and then accessing it, which looks a bit verbose.
-->
看起來很不錯！策略和 Webhook 給出了等效的結果。
又測試了其他幾種情形後，當我們對策略有信心時，也許是時候進行一些清理工作了。

- 對於每個表達式，我們重複訪問 `object.spec.template.spec.containers` 和每個 `securityContext`；
- 有一個檢查某字段是否存在然後訪問該字段的模式，這種模式看起來有點繁瑣。

<!--
Fortunately, since Kubernetes 1.28, we have new solutions for both issues.
Variable Composition allows us to extract repeated sub-expressions into their own variables.
Kubernetes enables [the optional library](https://github.com/google/cel-spec/wiki/proposal-246) for CEL, which are excellent to work with fields that are, you guessed it, optional. 

With both features in mind, let's refactor the policy a bit.
-->
幸運的是，自 Kubernetes 1.28 以來，我們對這兩個問題都有了新的解決方案。
變量組合（Variable Composition）允許我們將重複的子表達式提取到單獨的變量中。
Kubernetes 允許爲 CEL 使用[可選庫](https://github.com/google/cel-spec/wiki/proposal-246)，
這些庫非常適合處理可選的字段，你猜對了。

在瞭解了這兩個特性後，讓我們稍微重構一下此策略。

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "pod-security.policy.example.com"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["apps"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["deployments"]
  variables:
  - name: containers
    expression: object.spec.template.spec.containers
  - name: securityContexts
    expression: 'variables.containers.map(c, c.?securityContext)'
  validations:
  - expression: variables.securityContexts.all(c, c.?runAsNonRoot == optional.of(true))
    message: 'all containers must set runAsNonRoot to true'
  - expression: variables.securityContexts.all(c, c.?readOnlyRootFilesystem == optional.of(true))
    message: 'all containers must set readOnlyRootFilesystem to true'
  - expression: variables.securityContexts.all(c, c.?allowPrivilegeEscalation != optional.of(true))
    message: 'all containers must NOT set allowPrivilegeEscalation to true'
  - expression: variables.securityContexts.all(c, c.?privileged != optional.of(true))
    message: 'all containers must NOT set privileged to true'
```

<!--
The policy is now much cleaner and more readable. Update the policy, and you should see
it function the same as before.

Now let's change the policy binding from warning to actually denying requests that fail validation.
-->
策略現在更簡潔、更易讀。更新策略後，你應該看到它的功用與之前無異。

現在讓我們將策略綁定從警告更改爲實際拒絕驗證失敗的請求。

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "pod-security.policy-binding.example.com"
spec:
  policyName: "pod-security.policy.example.com"
  validationActions: ["Deny"]
  matchResources:
    namespaceSelector:
      matchLabels:
        "kubernetes.io/metadata.name": "policy-test"
```

<!--
And finally, remove the webhook. Now the result should include only messages from 
the policy.
-->
最後，移除 Webhook。現在結果應該只包含來自策略的消息。

```shell
kubectl create -n policy-test -f- <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nginx
  name: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx
        name: nginx
        securityContext:
          privileged: true
          allowPrivilegeEscalation: true
EOF
```

```text
The deployments "nginx" is invalid: : ValidatingAdmissionPolicy 'pod-security.policy.example.com' with binding 'pod-security.policy-binding.example.com' denied request: all containers must set runAsNonRoot to true
```

<!--
Please notice that, by design, the policy will stop evaluation after the first expression that causes the request to be denied.
This is different from what happens when the expressions generate only warnings.
-->
請注意，根據設計，此策略在第一個導致請求被拒絕的表達式之後停止處理。
這與表達式只生成警告時的情況不同。

<!--
## Set up monitoring
Unlike a webhook, a policy is not a dedicated process that can expose its own metrics.
Instead, you can use metrics from the API server in their place.

Here are some examples in Prometheus Query Language of common monitoring tasks.

To find the 95th percentile execution duration of the policy shown above.
-->
## 設置監控

與 Webhook 不同，策略不是一個可以公開其自身指標的專用進程。
相反，你可以使用源自 API 伺服器的指標來代替。

以下是使用 Prometheus 查詢語言執行一些常見監控任務的示例。

找到上述策略執行期間的 95 分位值：

```text
histogram_quantile(0.95, sum(rate(apiserver_validating_admission_policy_check_duration_seconds_bucket{policy="pod-security.policy.example.com"}[5m])) by (le)) 
```

<!--
To find the rate of the policy evaluation.
-->
找到策略評估的速率：

```text
rate(apiserver_validating_admission_policy_check_total{policy="pod-security.policy.example.com"}[5m])
```

<!--
You can read [the metrics reference](/docs/reference/instrumentation/metrics/) to learn more about the metrics above.
The metrics of ValidatingAdmissionPolicy are currently in alpha,
and more and better metrics will come while the stability graduates in the future release.
-->
你可以閱讀[指標參考](/docs/reference/instrumentation/metrics/)瞭解有關上述指標的更多信息。
ValidatingAdmissionPolicy 的指標目前處於 Alpha 階段，隨着穩定性在未來版本中的提升，將會有更多和更好的指標。
