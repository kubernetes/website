---
reviewers:
- tallclair
- dchen1107
title: Runtime Class
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

This page describes the RuntimeClass resource and runtime selection mechanism.

{{% /capture %}}


{{% capture body %}}

## Runtime Class

RuntimeClass is an alpha feature for selecting the container runtime configuration to use to run a
pod's containers.

### Set Up

As an early alpha feature, there are some additional setup steps that must be taken in order to use
the RuntimeClass feature:

1. Enable the RuntimeClass feature gate (on apiservers & kubelets, requires version 1.12+)
2. Install the RuntimeClass CRD
3. Configure the CRI implementation on nodes (runtime dependent)
4. Create the corresponding RuntimeClass resources

#### 1. Enable the RuntimeClass feature gate

See [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/) for an explanation
of enabling feature gates. The `RuntimeClass` feature gate must be enabled on apiservers _and_
kubelets.

#### 2. Install the RuntimeClass CRD

The RuntimeClass [CustomResourceDefinition][] (CRD) can be found in the addons directory of the
Kubernetes git repo: [kubernetes/cluster/addons/runtimeclass/runtimeclass_crd.yaml][runtimeclass_crd]

Install the CRD with `kubectl apply -f runtimeclass_crd.yaml`.

[CustomResourceDefinition]: /docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/
[runtimeclass_crd]: https://github.com/kubernetes/kubernetes/tree/master/cluster/addons/runtimeclass/runtimeclass_crd.yaml


#### 3. Configure the CRI implementation on nodes

The configurations to select between with RuntimeClass are CRI implementation dependent. See the
corresponding documentation for your CRI implementation for how to configure. As this is an alpha
feature, not all CRIs support multiple RuntimeClasses yet.

{{< note >}}
RuntimeClass currently assumes a homogeneous node configuration across the cluster
(which means that all nodes are configured the same way with respect to container runtimes). Any heterogeneity (varying configurations) must be
managed independently of RuntimeClass through scheduling features (see [Assigning Pods to
Nodes](/docs/concepts/configuration/assign-pod-node/)).
{{< /note >}}

The configurations have a corresponding `RuntimeHandler` name, referenced by the RuntimeClass. The
RuntimeHandler must be a valid DNS 1123 subdomain (alpha-numeric + `-` and `.` characters).

#### 4. Create the corresponding RuntimeClass resources

The configurations setup in step 3 should each have an associated `RuntimeHandler` name, which
identifies the configuration. For each RuntimeHandler (and optionally the empty `""` handler),
create a corresponding RuntimeClass object.

The RuntimeClass resource currently only has 2 significant fields: the RuntimeClass name
(`metadata.name`) and the RuntimeHandler (`spec.runtimeHandler`). The object definition looks like this:

```yaml
apiVersion: node.k8s.io/v1alpha1  # RuntimeClass is defined in the node.k8s.io API group
kind: RuntimeClass
metadata:
  name: myclass  # The name the RuntimeClass will be referenced by
  # RuntimeClass is a non-namespaced resource
spec:
  runtimeHandler: myconfiguration  # The name of the corresponding CRI configuration
```


{{< note >}}
It is recommended that RuntimeClass write operations (create/update/patch/delete) be
restricted to the cluster administrator. This is typically the default. See [Authorization
Overview](https://kubernetes.io/docs/reference/access-authn-authz/authorization/) for more details.
{{< /note >}}

### Usage

Once RuntimeClasses are configured for the cluster, using them is very simple. Specify a
`runtimeClassName` in the Pod spec. For example:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

This will instruct the Kubelet to use the named RuntimeClass to run this pod. If the named
RuntimeClass does not exist, or the CRI cannot run the corresponding handler, the pod will enter the
`Failed` terminal [phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase). Look for a
corresponding [event](/docs/tasks/debug-application-cluster/debug-application-introspection/) for an
error message.

If no `runtimeClassName` is specified, the default RuntimeHandler will be used, which is equivalent
to the behavior when the RuntimeClass feature is disabled.

{{% /capture %}}
