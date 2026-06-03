------
layout: blog
title: "Kubernetes 1.30: Validating Admission Policy Is Generally Available"
slug: validating-admission-policy-ga
date: 2024-04-24
author: >
  Jiahui Feng (Google)
---

On behalf of the Kubernetes project, I am excited to announce that ValidatingAdmissionPolicy has reached
**general availability**
as part of Kubernetes 1.30 release. If you have not yet read about this new declarative alternative to
validating admission webhooks, it may be interesting to read our
[previous post](/blog/2022/12/20/validating-admission-policies-alpha/) about the new feature.
If you have already heard about ValidatingAdmissionPolicies and you are eager to try them out,
there is no better time to do it than now.

Let's have a taste of a ValidatingAdmissionPolicy, by replacing a simple webhook. 

## Example admission webhook
First, let's take a look at an example of a simple webhook. Here is an excerpt from a webhook that
enforces `runAsNonRoot`, `readOnlyRootFilesystem`, `allowPrivilegeEscalation`, and `privileged` to be set to the least permissive values.

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

Check out [What are admission webhooks?](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
Or, see the [full code](webhook.go) of this webhook to follow along with this walkthrough. 

## The policy
Now let's try to recreate the validation faithfully with a ValidatingAdmissionPolicy.
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
Create the policy with `kubectl`. Great, no complain so far. But let's get the policy object back and take a look at its status.
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
The policy was checked against its matched type, which is `apps/v1.Deployment`.
Looking at the `fieldRef`, the problem was with the 3rd expression (index starts with 0)
The expression in question accessed an undefined `Privileged` field.
Ahh, looks like it was a copy-and-paste error. The field name should be in lowercase.

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
Check its status again, and you should see all warnings cleared.

Next, let's create a namespace for our tests.
```shell
kubectl create namespace policy-test
```
Then, I bind the policy to the namespace. But at this point, I set the action to `Warn`
so that the policy prints out [warnings](/blog/2020/09/03/warnings/) instead of rejecting the requests.
This is especially useful to collect results from all expressions during development and automated testing.
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
Tests out policy enforcement.
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
Looks great! The policy and the webhook give equivalent results.
After a few other cases, when we are confident with our policy, maybe it is time to do some cleanup.

- For every expression, we repeat access to `object.spec.template.spec.containers` and to each `securityContext`;
- There is a pattern of checking presence of a field and then accessing it, which looks a bit verbose.

Fortunately, since Kubernetes 1.28, we have new solutions for both issues.
Variable Composition allows us to extract repeated sub-expressions into their own variables.
Kubernetes enables [the optional library](https://github.com/google/cel-spec/wiki/proposal-246) for CEL, which are excellent to work with fields that are, you guessed it, optional. 

With both features in mind, let's refactor the policy a bit.
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
The policy is now much cleaner and more readable. Update the policy, and you should see
it function the same as before.

Now let's change the policy binding from warning to actually denying requests that fail validation.
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
And finally, remove the webhook. Now the result should include only messages from 
the policy.
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
Please notice that, by design, the policy will stop evaluation after the first expression that causes the request to be denied.
This is different from what happens when the expressions generate only warnings.

## Set up monitoring
Unlike a webhook, a policy is not a dedicated process that can expose its own metrics.
Instead, you can use metrics from the API server in their place.

Here are some examples in Prometheus Query Language of common monitoring tasks.

To find the 95th percentile execution duration of the policy shown above. 
```text
histogram_quantile(0.95, sum(rate(apiserver_validating_admission_policy_check_duration_seconds_bucket{policy="pod-security.policy.example.com"}[5m])) by (le)) 
```

To find the rate of the policy evaluation.
```text
rate(apiserver_validating_admission_policy_check_total{policy="pod-security.policy.example.com"}[5m])
```

You can read [the metrics reference](/docs/reference/instrumentation/metrics/) to learn more about the metrics above.
The metrics of ValidatingAdmissionPolicy are currently in alpha,
and more and better metrics will come while the stability graduates in the future release. 