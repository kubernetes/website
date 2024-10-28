---
layout: blog
title: "Extension developers: You too can have feature gates"
slug: feature-gates-for-extensions
date: 2024-XX-XX
author: >
  [Joe Betz](https://github.com/jpbetz)
  Google, Techncal Lead, SIG API Machinery
---

Ever wondered if you could use Kubernetes' feature gate system for your own extensions? You
can! This blog post shows you how to implement feature gates for your Kubernetes extensions,
enabling you to safely introduce experimental features, gather user feedback, and safely
progress the feature to stable.  We'll walk you through the process using a practical
example and demonstrate how to leverage Kubernetes APIs to achieve this.

## Why use feature gates?

Feature gates provide a well proven mechanism for managing the lifecycle of features. By gating
functionality, you can:

- Gather feedback: Release experimental features and gather feedback from users before enabling
  the features for all users.

- Reduce risk: Introduce new features incrementally and with the option for users to turn the
  features off if there are problems.

## Implementing feature gates for extensions

Let's imagine we're building a custom cron job controller for Kubernetes. Cluster administrators
have complained that it is common to configure cron jobs to run hourly, and the result is that there
is a surge of jobs that start at the beginning of each our. Wouldn't it be better if hourly job
start times were distributed across each hour? We want to introduce a new "jitter" feature that
distributes start times, but we want to introduce the feature in a controlled manner. Here's how we
can implement feature gating for this feature:

## 1. Define the feature gate configuration

First, we need a way to store and manage our feature gate configurations. We can achieve this using
a *CustomResourceDefinition* (CRD):

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: featuregateconfigurations.extensions.example.com
spec:
  group: extensions.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            metadata:
              type: object
              properties:
                name:
                  # Make this a singleton by only allowing one resource name
                  type: string
                  pattern: "cluster.featuregate.extensions.example.com"
            featureGates:
              x-kubernetes-list-type: map
              x-kubernetes-list-map-keys: [name]
              type: array
              items:
                type: object
                properties:
                  name:
                    type: string
                  state:
                    type: string
                    enum: [Enabled, Disabled]
                required: [name, state]
  scope: Cluster
  names:
    plural: featuregateconfigurations
    singular: featuregateconfiguration
    kind: FeatureGateConfiguration
```

By using a pattern on metadata.name, we ensure only a single *FeatureGateConfiguration* resource named
'cluster.featuregate.extensions.example.com' exists per cluster.

## 2. Define the Custom Resource with the Gated Feature

Next, let's define our custom cron job CRD with the experimental *jitter* field:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.extensions.example.com
spec:
  group: extensions.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                jitter:
                  description: >
                    Experimental Feature!
                    Disabled by default. Enable "CronJobJitter" feature gate to use.
                    Enables jittered start times for jobs.
                    For example, a hourly cron job will run once per hour instead of once at the start of each hour.
                    Default: If unset, the job is run exactly as defined by the cron spec.
                  type: string
                  enum: [PickRandom]
            status:
              type: object
              properties:
                effectiveCronSpec:
                  description: >
                    The cron spec that is used by run the job. If jitter is set, this will include the exact time
                    assigned after jitter is applied.
                  type: string
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
```

## 3. Enforce feature gates with a ValidatingAdmissionPolicy

Now, we'll use a *ValidatingAdmissionPolicy* to enforce the feature gate's rules:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: crondtab-featuregate-policy
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["extensions.example.com"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["crontabs"]
  variables:
    # Feature gates
    - name: "jitterEnabled"
      # jitter feature is enabled for this resource if the feature gate is enabled or the resource already has the jitter field set
      expression: |
        params.featureGates.exists(fg, fg.name == 'CronJobJitter' && fg.state == 'Enabled') ||
        optional.ofNonZeroValue(oldObject).spec.jitter.hasValue()
  validations:
    # Feature gated field behavior
    - expression: "variables.jitterEnabled || !object.spec.?jitter.hasValue()"
      message: "spec.jitter may not be set unless the 'CronJobJitter' feature gate is enabled in cluster.featuregate.extensions.example.com"
  paramKind:
    apiVersion: extensions.example.com/v1
    kind: FeatureGateConfiguration
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "crondtab-featuregate-policy-binding"
spec:
  policyName: "crondtab-featuregate-policy-policy"
  validationActions: [Deny]
  paramRef:
    name: cluster.featuregate.extensions.example.com
    parameterNotFoundAction: Deny
```

Let's break down this policy:

- *matchConstraints*: This section defines that the policy applies to CREATE and UPDATE operations
  on our CronTab resource.
- *variables*: This section defines a variable called *jitterEnabled*, which has is enabled when
  at least one of the these conditions are met:
  - The *CronJobJitter* feature gate is enabled in our *FeatureGateConfiguration* resource.
  - The jitter field was already set previously on the resource. Consistent with how Kubernetes
    handles feature gates, even if the feature gate is currently disabled, if the resources already
    uses the feature, it may continue to use it.
- *validations*: This section ensures that the jitter field can only be set if *jitterEnabled* is
  true.
- *paramKind* and *paramRef*: These link the policy to our *FeatureGateConfiguration* singleton
  resource.

## 4. Testing the Feature Gate

To test this, first create the *FeatureGateConfiguration* resource and set *CronJobJitter* to
*Disabled*:

```yaml
apiVersion: extensions.example.com/v1
kind: FeatureGateConfiguration
metadata:
  name: cluster.featuregate.extensions.example.com
featureGates:
  - name: CronJobJitter
    state: Disabled
```

Now, try to create a *CronTab* resource with the jitter field enabled:

```yaml
apiVersion: extensions.example.com/v1
kind: CronTab
metadata:
  name: testcron-example
spec:
  cronSpec: "* * * *"
  image: "nginx-v1.0"
  jitter: PickRandom

```

You should see a validation error like this:

```
The crontabs "testcron-example" is invalid: : ValidatingAdmissionPolicy 'crondtab-featuregate-policy-policy' with binding 'crondtab-featuregate-policy-binding' denied request: spec.jitter may not be set unless the 'CronJobJitter' feature gate is enabled in cluster.featuregate.extensions.example.com
```

By leveraging Kubernetes APIs like CRDs and *ValidatingAdmissionPolicy*, you can implement a feature
gating system for your extensions. This allows you to manage the evolution of your projects
effectively, reduce risks, and gather valuable user feedback.

Ready to unlock the power of feature gates for your own Kubernetes extensions? Give it a try and let
us know what you think!
