------
layout: blog
title: "Kubernetes 1.30: Validating Admission Policy Is Generally Available"
slug: validating-admission-policy-ga
date: 2024-04-01
canonicalUrl: https://www.k8s.dev/blog/2024/04/01/validating-admission-policy/
---

** Author **: Jiahui Feng (Google)

We are excited to announce that Validating Admission Policy has reached its General Availability
as part of Kubernetes 1.30 release. If you have not yet read about this new declarative alternative to
validating admission webhooks, it may be interesting to read our
[previous post](/blog/2022/12/20/validating-admission-policies-alpha/) about the new feature.

If you have already heard about Validating Admission Policy and you are eager to try it out, there is no better way to
start using it by replacing an existing webhook. 

# The Webhook
First, let's take a look at an example of a webhook that can be a good candidate. Here is an excerpt from a webhook that
enforce `runAsNonRoot`, `readOnlyRootFilesystem`, `allowPrivilegeEscalation`, and `privileged` to be set to the least permissive values.

```go
func verifyDeployment(deploy *appsv1.Deployment) error {
	for i, c := range deploy.Spec.Template.Spec.Containers {
		if c.Name == "" {
			return fmt.Errorf("container %d has no name", i)
		}
		if c.SecurityContext == nil {
			return fmt.Errorf("container %q does not have SecurityContext", c.Name)
		}
		if c.SecurityContext.RunAsNonRoot == nil || !*c.SecurityContext.RunAsNonRoot {
			return fmt.Errorf("container %q must set RunAsNonRoot to true in its SecurityContext", c.Name)
		}
		if c.SecurityContext.ReadOnlyRootFilesystem == nil || !*c.SecurityContext.ReadOnlyRootFilesystem {
			return fmt.Errorf("container %q must set ReadOnlyRootFilesystem to true in its SecurityContext", c.Name)
		}
		if c.SecurityContext.AllowPrivilegeEscalation != nil && *c.SecurityContext.AllowPrivilegeEscalation {
			return fmt.Errorf("container %q must NOT set AllowPrivilegeEscalation to true in its SecurityContext", c.Name)
		}
		if c.SecurityContext.Privileged != nil && *c.SecurityContext.Privileged {
			return fmt.Errorf("container %q must NOT set Privileged to true in its SecurityContext", c.Name)
		}
	}
	return nil
}
```

Check out [the doc](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
for a refresher on how admission webhooks work. Or, see the [full code](https://gist.github.com/jiahuif/2653f2ce41fe6a2e5739ea7cd76b182b) of this webhook to follow along this tutorial. 

# The Policy
Now let's try to recreate the validation with a ValidatingAdmissionPolicy.
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
    message: 'all containers must set allowPrivilegeEscalation to false'
  - expression: object.spec.template.spec.containers.all(c, !has(c.securityContext) || !has(c.securityContext.Privileged) || !c.securityContext.Privileged)
    message: 'all containers must set privileged to false'
```
Create the policy with `kubectl`. Great, no complain so far. But let's take a look at its status.
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
Ah, seems like a copy-paste error. Let's correct it real quick.
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
    message: 'all containers must set allowPrivilegeEscalation to false'
  - expression: object.spec.template.spec.containers.all(c, !has(c.securityContext) || !has(c.securityContext.privileged) || !c.securityContext.privileged)
    message: 'all containers must set privileged to false'
```
Check its status again, and you should see all warnings cleared.

Next, let's create a namespace for our tests.
```shell
kubectl create namespace policy-test
```
Then, bind the policy to the namespace. But at this point, we set the action to `Warn` 
so that the policy prints out warnings instead of rejecting the requests.
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
Warning: Validation failed for ValidatingAdmissionPolicy 'pod-security.policy.example.com' with binding 'pod-security.policy-binding.example.com': all containers must set allowPrivilegeEscalation to false
Warning: Validation failed for ValidatingAdmissionPolicy 'pod-security.policy.example.com' with binding 'pod-security.policy-binding.example.com': all containers must set privileged to false
Error from server: error when creating "STDIN": admission webhook "webhook.example.com" denied the request: container "nginx" must set RunAsNonRoot to true in its SecurityContext
```
Not quite the exact same behavior but good enough. After a few other cases, when we are confident with our policy, maybe it is time for some refactoring.
We can extract repeated sub-expressions into their own variables.
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
    expression: 'variables.containers.map(c, has(c.securityContext) ? c.securityContext : {})'
  validations:
  - expression: variables.securityContexts.all(c, has(c.runAsNonRoot) && c.runAsNonRoot)
    message: 'all containers must set runAsNonRoot to true'
  - expression: variables.securityContexts.all(c, has(c.readOnlyRootFilesystem) && c.readOnlyRootFilesystem)
    message: 'all containers must set readOnlyRootFilesystem to true'
  - expression: variables.securityContexts.all(c, !has(c.allowPrivilegeEscalation) || !c.allowPrivilegeEscalation)
    message: 'all containers must set allowPrivilegeEscalation to false'
  - expression: variables.securityContexts.all(c, !has(c.privileged) || !c.privileged)
    message: 'all containers must set privileged to false'
```