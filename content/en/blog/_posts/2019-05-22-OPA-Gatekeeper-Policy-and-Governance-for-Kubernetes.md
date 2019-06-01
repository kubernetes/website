
---
layout: blog
title: "OPA Gatekeeper: Policy and Governance for Kubernetes"
date: 2019-05-22
slug: OPA-Gatekeeper-Policy-and-Governance-for-Kubernetes 
---

**Authors:** Rita Zhang (Microsoft), Max Smythe (Google), Tim Hinrichs (Styra), Lachie Evenson (Microsoft), Torin Sandall (Styra)

In this post, we will walk through the goals, history, and current state of the [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) project, and how you can leverage it to help enforce policies and strengthen governance in your Kubernetes environment. 

You can also check out recordings from the following Kubecon EU 2019 sessions:

* [Intro: Open Policy Agent Gatekeeper](https://youtu.be/Yup1FUc2Qn0)
* [Deep Dive: Open Policy Agent](https://youtu.be/n94_FNhuzy4)

## Motivations 

If your organization has been operating Kubernetes, you probably have been looking for ways to control what end-users can do on the cluster and ways to ensure that clusters are in compliance with company policies. These policies may be there to meet governance and legal requirements or to enforce best practices and organizational conventions. With Kubernetes, how do we ensure compliance without sacrificing development agility and operational independence? 

For example, you can enforce policies like:

* All images must be from approved repositories
* All ingress hostnames must be globally unique
* All pods must have resource limits
* All namespaces must have a label that lists a point-of-contact

Kubernetes allows decoupling policy decisions from the API server by means of [admission controller webhooks](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/) to intercept admission requests before they are persisted as objects in Kubernetes. [Gatekeeper](https://github.com/open-policy-agent/gatekeeper) was created to enable users to customize admission control via configuration, not code and to bring awareness of the cluster’s state, not just the single object under evaluation at admission time. Gatekeeper is a customizable admission webhook for Kubernetes that enforces policies executed by the [Open Policy Agent (OPA)](https://www.openpolicyagent.org), a policy engine for Cloud Native environments hosted by CNCF.

## Evolution 

Before we dive into the current state of Gatekeeper, let’s take a look at how the Gatekeeper project has evolved. 

* Gatekeeper v1.0 - Uses OPA as the admission controller with the kube-mgmt sidecar enforcing configmap-based policies. It provides validating and mutating admission control. Donated by Styra. 
* Gatekeeper v2.0 - Uses Kubernetes policy controller as the admission controller with OPA and kube-mgmt sidecars enforcing configmap-based policies. It provides validating and mutating admission control and audit functionality. Donated by Microsoft. 
* Gatekeeper v3.0 - The admission controller is integrated with the [OPA constraint framework](https://github.com/open-policy-agent/frameworks/tree/master/constraint) to enforce CRD-based policies and allow declaratively configured policies to be reliably shareable. Built with kubebuilder, it provides validating and, eventually, mutating (to be implemented) admission control and audit functionality. This enables the creation of policy templates for [Rego](https://www.openpolicyagent.org/docs/v0.10.7/how-do-i-write-policies/) policies, creation of policies as CRDs, and storage of audit results on policy CRDs. This project is a collaboration between Google, Microsoft, Red Hat, and Styra. 

![](/images/blog/2019-05-22-opa-gatekeeper/v3.png)
 
## Gatekeeper v3.0 Features 

Now let’s take a closer look at the current state of Gatekeeper and how you can leverage all the latest features. Consider an organization that wants to ensure all objects in a cluster have departmental information provided as part of the object’s labels. How do we do this with Gatekeeper? 

### Validating Admission Control 

Once all the Gatekeeper components have been [installed](https://github.com/open-policy-agent/gatekeeper) in your cluster, the API server will trigger the Gatekeeper admission webhook to process the admission request whenever a resource in the cluster is created, updated, or deleted. 

During the validation process, Gatekeeper acts as a bridge between the API server and OPA. The API server will enforce all policies executed by OPA.

### Policies and Constraints 

With the integration of the OPA Constraint Framework, a constraint is a declaration that its author wants a system to meet a given set of requirements. Each constraint is written with [Rego](https://www.openpolicyagent.org/docs/v0.10.7/how-do-i-write-policies/), a declarative query language used by OPA to enumerate instances of data that violate the expected state of the system. All constraints are evaluated as a logical AND. If one constraint is not satisfied, then the whole request is rejected. 

Before defining a constraint, you need to create a Constraint Template that allows people to declare new constraints. Each template describes both the [Rego](https://www.openpolicyagent.org/docs/v0.10.7/how-do-i-write-policies/) logic that enforces the constraint and the schema for the constraint, which includes the schema of the CRD and the parameters that can be passed into a constraint, much like arguments to a function. 

For example, here is a constraint template CRD that requires certain labels to be present on an arbitrary object. 

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

Once a constraint template has been deployed in the cluster, an admin can now create individual constraint CRDs as defined by the constraint template. For example, here is a constraint CRD that requires the label `hr` to be present on all namespaces. 

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

Similarly, another constraint CRD that requires the label `finance` to be present on all namespaces can easily be created from the same constraint template. 

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

As you can see, with the Constraint framework, we can reliably share Regos via the constraint templates, define the scope of enforcement with the match field, and provide user-defined parameters to the constraints to create customized behavior for each constraint. 

### Audit 

The audit functionality enables periodic evaluations of replicated resources against the constraints enforced in the cluster to detect pre-existing misconfigurations. Audit results are stored as violations listed in the status field of the constraint CRD.  

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

Audit requires replication of Kubernetes resources into OPA before they can be evaluated against the enforced constraints. Data replication is also required by constraints that need access to objects in the cluster other than the object under evaluation. For example, a constraint that enforces uniqueness of ingress hostname must have access to all other ingresses in the cluster. 

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