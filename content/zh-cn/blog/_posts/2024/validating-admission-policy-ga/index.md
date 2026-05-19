---
layout: blog
title: "Kubernetes 1.30：验证准入策略 ValidatingAdmissionPolicy 正式发布"
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
我代表 Kubernetes 项目组成员，很高兴地宣布 ValidatingAdmissionPolicy 已经作为 Kubernetes 1.30 发布的一部分**正式发布**。
如果你还不了解这个全新的声明式验证准入 Webhook 的替代方案，
请参阅有关这个新特性的[上一篇博文](/blog/2022/12/20/validating-admission-policies-alpha/)。
如果你已经对 ValidatingAdmissionPolicy 有所了解并且想要尝试一下，那么现在是最好的时机。

让我们替换一个简单的 Webhook，体验一下 ValidatingAdmissionPolicy。

<!--
## Example admission webhook
First, let's take a look at an example of a simple webhook. Here is an excerpt from a webhook that
enforces `runAsNonRoot`, `readOnlyRootFilesystem`, `allowPrivilegeEscalation`, and `privileged` to be set to the least permissive values.
-->
## 准入 Webhook 示例

首先，让我们看一个简单 Webhook 的示例。以下是一个强制将
`runAsNonRoot`、`readOnlyRootFilesystem`、`allowPrivilegeEscalation` 和 `privileged` 设置为最低权限值的 Webhook 代码片段。

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
查阅[什么是准入 Webhook？](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)，
或者查看这个 Webhook 的[完整代码](webhook.go)以便更好地理解下述演示。

## 策略

现在，让我们尝试使用 ValidatingAdmissionPolicy 来忠实地重新创建验证。

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
使用 `kubectl` 创建策略。很好，到目前为止没有任何问题。那我们获取此策略对象并查看其状态。

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
系统根据所匹配的类别 `apps/v1.Deployment` 对策略执行了检查。
查看 `fieldRef` 后，发现问题出现在第 3 个表达式上（索引从 0 开始）。
有问题的表达式访问了一个未定义的 `Privileged` 字段。
噢，看起来是一个复制粘贴错误。字段名应该是小写的。

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
再次检查状态，你应该看到所有警告都已被清除。

接下来，我们创建一个命名空间进行测试。

```shell
kubectl create namespace policy-test
```

<!--
Then, I bind the policy to the namespace. But at this point, I set the action to `Warn`
so that the policy prints out [warnings](/blog/2020/09/03/warnings/) instead of rejecting the requests.
This is especially useful to collect results from all expressions during development and automated testing.
-->
接下来，我将策略绑定到命名空间。但此时我将动作设置为 `Warn`，
这样此策略将打印出[警告](/zh-cn/blog/2020/09/03/warnings/)而不是拒绝请求。
这对于在开发和自动化测试期间收集所有表达式的结果非常有用。

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
测试策略的执行过程。

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
看起来很不错！策略和 Webhook 给出了等效的结果。
又测试了其他几种情形后，当我们对策略有信心时，也许是时候进行一些清理工作了。

- 对于每个表达式，我们重复访问 `object.spec.template.spec.containers` 和每个 `securityContext`；
- 有一个检查某字段是否存在然后访问该字段的模式，这种模式看起来有点繁琐。

<!--
Fortunately, since Kubernetes 1.28, we have new solutions for both issues.
Variable Composition allows us to extract repeated sub-expressions into their own variables.
Kubernetes enables [the optional library](https://github.com/google/cel-spec/wiki/proposal-246) for CEL, which are excellent to work with fields that are, you guessed it, optional. 

With both features in mind, let's refactor the policy a bit.
-->
幸运的是，自 Kubernetes 1.28 以来，我们对这两个问题都有了新的解决方案。
变量组合（Variable Composition）允许我们将重复的子表达式提取到单独的变量中。
Kubernetes 允许为 CEL 使用[可选库](https://github.com/google/cel-spec/wiki/proposal-246)，
这些库非常适合处理可选的字段，你猜对了。

在了解了这两个特性后，让我们稍微重构一下此策略。

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
策略现在更简洁、更易读。更新策略后，你应该看到它的功用与之前无异。

现在让我们将策略绑定从警告更改为实际拒绝验证失败的请求。

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
最后，移除 Webhook。现在结果应该只包含来自策略的消息。

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
请注意，根据设计，此策略在第一个导致请求被拒绝的表达式之后停止处理。
这与表达式只生成警告时的情况不同。

<!--
## Set up monitoring
Unlike a webhook, a policy is not a dedicated process that can expose its own metrics.
Instead, you can use metrics from the API server in their place.

Here are some examples in Prometheus Query Language of common monitoring tasks.

To find the 95th percentile execution duration of the policy shown above.
-->
## 设置监控

与 Webhook 不同，策略不是一个可以公开其自身指标的专用进程。
相反，你可以使用源自 API 服务器的指标来代替。

以下是使用 Prometheus 查询语言执行一些常见监控任务的示例。

找到上述策略执行期间的 95 分位值：

```text
histogram_quantile(0.95, sum(rate(apiserver_validating_admission_policy_check_duration_seconds_bucket{policy="pod-security.policy.example.com"}[5m])) by (le)) 
```

<!--
To find the rate of the policy evaluation.
-->
找到策略评估的速率：

```text
rate(apiserver_validating_admission_policy_check_total{policy="pod-security.policy.example.com"}[5m])
```

<!--
You can read [the metrics reference](/docs/reference/instrumentation/metrics/) to learn more about the metrics above.
The metrics of ValidatingAdmissionPolicy are currently in alpha,
and more and better metrics will come while the stability graduates in the future release.
-->
你可以阅读[指标参考](/docs/reference/instrumentation/metrics/)了解有关上述指标的更多信息。
ValidatingAdmissionPolicy 的指标目前处于 Alpha 阶段，随着稳定性在未来版本中的提升，将会有更多和更好的指标。
