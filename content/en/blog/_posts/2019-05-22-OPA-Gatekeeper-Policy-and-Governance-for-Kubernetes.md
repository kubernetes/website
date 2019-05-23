
---
layout: blog
title: "OPA Gatekeeper: Policy and Governance for Kubernetes"
date: 2019-05-22
slug: OPA-Gatekeeper-Policy-and-Governance-for-Kubernetes 
---

**Authors:** Rita Zhang (Microsoft)

In this post, we will walkthrough the goals, history, and current state of the [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) project, and how you can leverage it to enforce policies and strengthen governance in your Kubernetes environment. 

You can also check out recordings from the following Kubecon EU 2019 sessions:
* [Intro: Open Policy Agent Gatekeeper](https://sched.co/MPiM)
* [Deep Dive: Open Policy Agent](https://sched.co/MPk0)

## Motivations 

If your organization has been operating Kubernetes, you probably have been looking for ways to control what end-users can do on the cluster and ways to ensure the clusters are always in compliance with company policies. These policies may be there to meet governance and legal requirements or to enforce best practices and organizational conventions. With Kubernetes, how do we ensure compliance without sacrificing development agility and operation independence? 

Kubernetes allows decoupling policy decisions from the API server by means of [admission controller webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/) to intercept admission requests before they are persisted as objects in Kubernetes. [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) was created to enable users to customize admission control via configuration, not code and to bring awareness of the cluster’s state, not just the single object under evaluation at admission time. Gatekeeper is a customizable admission webhook for Kubernetes that enforces policies executed by the [Open Policy Agent (OPA)](https://www.openpolicyagent.org), a policy engine for Cloud Native environments hosted by CNCF.

## Evolution 

Before we dive into the current state of Gatekeeper, let’s take a look at how the Gatekeeper project has evolved. 

* Gatekeeper v1.0 - Uses OPA as the admission controller with the kube-mgmt sidecar enforcing configmap-based policies. It provides validating and mutating admission control. Donated by Styra. 
* Gatekeeper v2.0 - Uses Kubernetes policy controller as the admission controller with OPA and kube-mgmt sidecars enforcing configmap-based policies. It provides validating and mutating admission control and audit functionality. Donated by Microsoft. 
* Gatekeeper v3.0 - The admission controller is integrated with the [OPA constraint framework](https://github.com/open-policy-agent/frameworks/tree/master/constraint) to enforce CRD-based policies and allow declaratively configured policies to be reliably shareable. Built with kubebuilder, it provides validating and mutating (to be implemented) admission control and audit functionality. This enables the creation of policy templates for [Rego](https://www.openpolicyagent.org/docs/v0.10.7/how-do-i-write-policies/) policies, creation of policies as CRDs, and storage of audit results on policy CRDs. This project is a collaboration between Google, Microsoft, Red Hat, and Styra. 

![](/images/blog/2019-05-22-opa-gatekeeper/v3.png)
 
## Gatekeeper v3.0 Features 

Now let’s take a closer look at the current state of Gatekeeper and how you can leverage all the latest features. Consider an organization that wants to ensure all objects in a cluster have departmental information provided as part of the object’s labels. How do we do this with Gatekeeper? 

### Validating Admission Control 

Once all the Gatekeeper components have been [installed](https://github.com/open-policy-agent/gatekeeper) in your cluster, the API server will trigger the Gatekeeper admission webhook to process the admission request whenever a resource in the cluster is created, updated, or deleted. 

During the validation process, Gatekeeper will enforce all policies executed by OPA. Each policy is written with [Rego](https://www.openpolicyagent.org/docs/v0.10.7/how-do-i-write-policies/), a declarative query language used by OPA to enumerate instances of data that violate the expected state of the system. All policies are evaluated as a logical AND. If one policy is not satisfied, then the whole request is rejected. 

### Policies and Constraints 

With the integration of the OPA constraint framework, a policy is also known as a constraint. A constraint is a declaration that its author wants a system to meet a given set of requirements. Before defining a policy (aka constraint), you need to create a Policy Template (aka Constraint Template) that allows people to declare new policies (constraints). Each template describes both the [Rego](https://www.openpolicyagent.org/docs/v0.10.7/how-do-i-write-policies/) logic that enforces the policy and the schema for the policy, which includes the schema of the CRD and the parameters that can be passed into a policy, much like arguments to a function. 

For example, here is a policy (constraint) template CRD that requires certain labels to be present on an arbitrary object. 

```yaml
apiVersion: templates.gatekeeper.sh/v1alpha1
kind: ConstraintTemplate
metadata:
  name: k8srequiredlabels
spec:
  crd:
    spec:
      names:
        kind: K8sRequiredLabels
        listKind: K8sRequiredLabelsList
        plural: k8srequiredlabels
        singular: k8srequiredlabels
      validation:
        # Schema for the `parameters` field
        openAPIV3Schema:
          properties:
            labels:
              type: array
              items: string
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8srequiredlabels

        deny[{"msg": msg, "details": {"missing_labels": missing}}] {
          provided := {label | input.review.object.metadata.labels[label]}
          required := {label | label := input.constraint.spec.parameters.labels[_]}
          missing := required - provided
          count(missing) > 0
          msg := sprintf("you must provide labels: %v", [missing])
        }
```

Once a policy template has been deployed in the cluster, an admin can now create individual policy CRDs as defined by the policy template. For example, here is a policy CRD that requires the label `hr` to be present on all namespaces. 

```yaml
apiVersion: constraints.gatekeeper.sh/v1alpha1
kind: K8sRequiredLabels
metadata:
  name: ns-must-have-hr
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Namespace"]
  parameters:
    labels: ["hr"]
```

Similarly, another policy CRD that requires the label `finance` to be present on all namespaces can easily be created from the same policy template. 

```yaml
apiVersion: constraints.gatekeeper.sh/v1alpha1
kind: K8sRequiredLabels
metadata:
  name: ns-must-have-finance
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Namespace"]
  parameters:
    labels: ["finance"]
```

As you can see, with the Constraint framework, we can reliably share Regos via the constraint templates, define the scope of enforcement with the match field, and provide user-defined parameters to the policies to create customized behavior for each policy. 

### Audit 

The audit functionality enables periodic evaluations of replicated resources against the policies enforced in the cluster to detect pre-existing misconfigurations. Audit results are stored as violations listed in the status field of the policy CRD.  

```yaml
apiVersion: constraints.gatekeeper.sh/v1alpha1
kind: K8sRequiredLabels
metadata:
  name: ns-must-have-hr
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: ["Namespace"]
  parameters:
    labels: ["hr"]
status:
  auditTimestamp: "2019-05-22T01:46:13Z"
  enforced: true
  violations:
  - kind: Namespace
    message: 'you must provide labels: {"hr"}'
    name: default
  - kind: Namespace
    message: 'you must provide labels: {"hr"}'
    name: gatekeeper-system
  - kind: Namespace
    message: 'you must provide labels: {"hr"}'
    name: kube-public
  - kind: Namespace
    message: 'you must provide labels: {"hr"}'
    name: kube-system
```

### Data Replication 

Audit requires replication of Kubernetes resources into OPA before they can be evaluated against the enforced policies. Data replication is also required by policies that need access to objects in the cluster other than the object under evaluation. For example, a policy that enforces uniqueness of ingress hostname must have access to all other ingresses in the cluster. 

To configure Kubernetes data to be replicated, create a sync config resource with the resources to be replicated into OPA. For example, the below configuration replicates all namespace and pod resources to OPA. 

```yaml
apiVersion: config.gatekeeper.sh/v1alpha1
kind: Config
metadata:
  name: config
  namespace: "gatekeeper-system"
spec:
  sync:
    syncOnly:
      - group: ""
        version: "v1"
        kind: "Namespace"
      - group: ""
        version: "v1"
        kind: "Pod"
```

## Planned for Future 

Post KubeCon EU, the community behind the Gatekeeper project will be focusing on providing mutating admission control to support mutation scenarios (for example: annotate objects automatically with departmental information when creating a new resource), support external data to inject context external to the cluster into the admission decisions, support dry run to see impact of a policy on existing resources in the cluster before enforcing it, and more audit functionalities.  

If you are interested in learning more about the project, check out the [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) repo. If you are interested to help define the direction of Gatekeeper, join the [#kubernetes-policy](https://openpolicyagent.slack.com/messages/CDTN970AX) channel on OPA Slack, and join our [weekly meetings](https://docs.google.com/document/d/1A1-Q-1OMw3QODs1wT6eqfLTagcGmgzAJAjJihiO3T48/edit) to discuss development, issues, use cases, etc.  