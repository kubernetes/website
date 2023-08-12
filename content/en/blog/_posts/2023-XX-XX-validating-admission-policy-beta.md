---
layout: blog
title: "ValidatingAdmissionPolicy Graudates to Beta"
date: 2023-07-20
slug: validating-admission-policy-beta
canonicalUrl: https://www.kubernetes.dev/blog/2023/XX/XX/validating-admission-policy-beta/
---

**Author**: Alex Zielenski (@alexzielenski, Google), Jiahui Feng (@jiahuif, Google)

We are excited to announce that ValidatingAdmissionPolicy has graduated to beta 
in Kubernetes 1.28!

First introduced as an Alpha feature in 1.26, ValidatingAdmissionPolicy is an 
admission plugin for Kubernetes clusters which allows authors to define complex 
rules in Common Expression Language (CEL) to enforce custom rules to requests 
made to the cluster. Rules could apply to all requests or perhaps a chosen 
subset of requests matching a filter. Policies are also configurable with multiple 
parameters from a designated namespace or from a namespace dependent upon the 
request for ultimate flexibility ValidatingAdmissionPolicy is a powerful tool that
can be used to improve the simplicity and stability of your Kubernetes cluster. 
We encourage you to try it out and let us know what you think.

# Goodbye (Simple) Webhooks

Today admission webhooks are often used to ensure resource requests meet a set 
of custom constraints. Developers use webhooks to perform validation logic on 
their resources. Operators also might use webhooks to enforce custom rules for 
what kind of changes can occur on their cluster. 

Unfortunately webhooks can be burdensome to develop and operate; and for many 
cases developers give up since the cost of a webhook is too high. Webhook 
developers must implement and maintain a webhook binary to handle admission
requests. Also, admission webhooks are complex to operate. Each webhook must 
be deployed, monitored and have a well defined upgrade and rollback plan. 

To make matters worse, if a webhook times out or becomes unavailable, the 
Kubernetes control plane can become unavailable. This enhancement avoids 
much of this complexity of admission webhooks by embedding CEL expressions 
into Kubernetes resources instead of calling out to a remote webhook binary.

# How does it work?
Below is a basic example of using ValidatingAdmissionPolicy to enforce a replica 
limit on Deployments. 

For a deeper look at the capabilities of this feature, please see 
documentation for ValidatingAdmissionPolicy.

## Create a Policy

To set a limit on how many replicas a Deployment can have, start by defining a validation policy:

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingAdmissionPolicy
metadata:
 name: "demo-policy.example.com"
spec:
 paramKind:
   apiVersion: rules.example.com/v1 # You also need a CustomResourceDefinition for this API
   kind: ReplicaLimit
 matchConstraints:
   resourceRules:
   - apiGroups:   ["apps"]
     apiVersions: ["v1"]
     operations:  ["CREATE", "UPDATE"]
     resources:   ["deployments"]
 validations:
   - expression: "object.spec.replicas <= params.maxReplicas"
```

This policy refers to the builtin variables object and params. Usage of parameters is optional and params will be null if ParamKind is not specified.

## Create a Parameter

Since our policy expects parameters, we will create two parameters of the policie’s paramKind. One for test deployments, and another for production deployments:


### Test Parameter
```yaml
apiVersion: rules.example.com/v1 # defined via a CustomResourceDefinition
kind: ReplicaLimit
metadata:
 name: "demo-params-test.example.com"
maxReplicas: 3
```

```yaml
Production Parameter
apiVersion: rules.example.com/v1 # defined via a CustomResourceDefinition
kind: ReplicaLimit
metadata:
 name: "demo-params-production.example.com"
maxReplicas: 1000
```

## Bind the Parameter to the Policy

Now we will create bindings for our policy: one for test and another for production.

### Test Binding
```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingAdmissionPolicyBinding
metadata:
 name: "demo-binding-test.example.com"
spec:
 policyName: "demo-policy.example.com"
 paramRef:
   name: "demo-params-test.example.com"
   namespace: "default"
 matchResources:
   namespaceSelector:
     matchExpressions:
     - key: environment
       operator: In
       values:
       - test
```

### Production Binding

```yaml
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingAdmissionPolicyBinding
metadata:
 name: "demo-binding-production.example.com"
spec:
 policyName: "demo-policy.example.com"
 paramRef:
   name: "demo-params-production.example.com"
   namespace: "default"
 matchResources:
   namespaceSelector:
     matchExpressions:
     - key: environment
       operator: In
       values:
       - production
```

This example shows how the same policy may be used by more than one binding. 
Previously this example would have required a webhook which requires separate 
upgrade planning, rollbacks, reliable uptime, separate observability. 

With ValidatingAdmissionPolicy operators can focus on their business logic in the
familiar Kubernetes Resource Model and get metrics and enforcement for free.

# New Functionality for 1.28
## Access to Namespace Object
TODO(jiahuif)

## Multiple Parameters
In earlier versions of ValidatingAdmissionPolicy, users were limited to either 0 
or one parameter per policy binding. Users now may now use label selector to 
select multiple parameters at once, or all resources of the policy ParamKind if 
so desired. The policy is evaluated for each matching parameter, and only admits 
the resource request if evaluating the policy for every parameter results in success.

For more information, check the documentation (LINK TODO)

## Per-namespace Parameters
Parameters of ValidatingAdmissionPolicyBinding previously were applied for all resource requests. Authors of ValidatingAdmissionPolicyBinding now have the option to make evaluate their 

## Variable Composition
TODO(jiahuif)

# How do I get involved?
If you want to get involved in development of admission policies, discuss enhancement roadmaps, or report a bug, you can get in touch with developers at SIG API Machinery.
