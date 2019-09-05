---
reviewers:
- tallclair
- dchen1107
title: Runtime Class
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.14" state="beta" >}}

This page describes the RuntimeClass resource and runtime selection mechanism.

{{< warning >}}
RuntimeClass includes *breaking* changes in the beta upgrade in v1.14. If you were using
RuntimeClass prior to v1.14, see [Upgrading RuntimeClass from Alpha to
Beta](#upgrading-runtimeclass-from-alpha-to-beta).
{{< /warning >}}

{{% /capture %}}


{{% capture body %}}

## Runtime Class

RuntimeClass is a feature for selecting the container runtime configuration. The container runtime
configuration is used to run a Pod's containers.

## Motivation

You can set a different RuntimeClass between different Pods to provide a balance of
performance versus security. For example, if part of your workload deserves a high
level of information security assurance, you might choose to schedule those Pods so
that they run in a container runtime that uses hardware virtualization. You'd then
benefit from the extra isolation of the alternative runtime, at the expense of some
additional overhead.

You can also use RuntimeClass to run different Pods with the same container runtime
but with different settings.

### Set Up

Ensure the RuntimeClass feature gate is enabled (it is by default). See [Feature
Gates](/docs/reference/command-line-tools-reference/feature-gates/) for an explanation of enabling
feature gates. The `RuntimeClass` feature gate must be enabled on apiservers _and_ kubelets.

1. Configure the CRI implementation on nodes (runtime dependent)
2. Create the corresponding RuntimeClass resources

#### 1. Configure the CRI implementation on nodes

The configurations available through RuntimeClass are Container Runtime Interface (CRI)
implementation dependent. See the corresponding documentation ([below](#cri-configuration)) for your
CRI implementation for how to configure.

{{< note >}}
RuntimeClass assumes a homogeneous node configuration across the cluster by default (which means
that all nodes are configured the same way with respect to container runtimes). To support
heterogenous node configurations, see [Scheduling](#scheduling) below.
{{< /note >}}

The configurations have a corresponding `handler` name, referenced by the RuntimeClass. The
handler must be a valid DNS 1123 label (alpha-numeric + `-` characters).

#### 2. Create the corresponding RuntimeClass resources

The configurations setup in step 1 should each have an associated `handler` name, which identifies
the configuration. For each handler, create a corresponding RuntimeClass object.

The RuntimeClass resource currently only has 2 significant fields: the RuntimeClass name
(`metadata.name`) and the handler (`handler`). The object definition looks like this:

```yaml
apiVersion: node.k8s.io/v1beta1  # RuntimeClass is defined in the node.k8s.io API group
kind: RuntimeClass
metadata:
  name: myclass  # The name the RuntimeClass will be referenced by
  # RuntimeClass is a non-namespaced resource
handler: myconfiguration  # The name of the corresponding CRI configuration
```

{{< note >}}
It is recommended that RuntimeClass write operations (create/update/patch/delete) be
restricted to the cluster administrator. This is typically the default. See [Authorization
Overview](/docs/reference/access-authn-authz/authorization/) for more details.
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

### CRI Configuration

For more details on setting up CRI runtimes, see [CRI installation](/docs/setup/production-environment/container-runtimes/).

#### dockershim

Kubernetes built-in dockershim CRI does not support runtime handlers.

#### [containerd](https://containerd.io/)

Runtime handlers are configured through containerd's configuration at
`/etc/containerd/config.toml`. Valid handlers are configured under the runtimes section:

```
[plugins.cri.containerd.runtimes.${HANDLER_NAME}]
```

See containerd's config documentation for more details:
https://github.com/containerd/cri/blob/master/docs/config.md

#### [cri-o](https://cri-o.io/)

Runtime handlers are configured through cri-o's configuration at `/etc/crio/crio.conf`. Valid
handlers are configured under the [crio.runtime
table](https://github.com/kubernetes-sigs/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table):

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

See cri-o's config documentation for more details:
https://github.com/kubernetes-sigs/cri-o/blob/master/cmd/crio/config.go

### Scheduling

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

As of Kubernetes v1.16, RuntimeClass includes support for heterogenous clusters through its
`scheduling` fields. Through the use of these fields, you can ensure that pods running with this
RuntimeClass are scheduled to nodes that support it. To use the scheduling support, you must have
the RuntimeClass [admission controller][] enabled (the default, as of 1.16).

To ensure pods land on nodes supporting a specific RuntimeClass, that set of nodes should have a
common label which is then selected by the `runtimeclass.scheduling.nodeSelector` field. The
RuntimeClass's nodeSelector is merged with the pod's nodeSelector in admission, effectively taking
the intersection of the set of nodes selected by each. If there is a conflict, the pod will be
rejected.

If the supported nodes are tainted to prevent other RuntimeClass pods from running on the node, you
can add `tolerations` to the RuntimeClass. As with the `nodeSelector`, the tolerations are merged
with the pod's tolerations in admission, effectively taking the union of the set of nodes tolerated
by each.

To learn more about configuring the node selector and tolerations, see [Assigning Pods to
Nodes](/docs/concepts/configuration/assign-pod-node/).

[admission controller]: /docs/reference/access-authn-authz/admission-controllers/

### Upgrading RuntimeClass from Alpha to Beta

The RuntimeClass Beta feature includes the following changes:

- The `node.k8s.io` API group and `runtimeclasses.node.k8s.io` resource have been migrated to a
  built-in API from a CustomResourceDefinition.
- The `spec` has been inlined in the RuntimeClass definition (i.e. there is no more
  RuntimeClassSpec).
- The `runtimeHandler` field has been renamed `handler`.
- The `handler` field is now required in all API versions. This means the `runtimeHandler` field in
  the Alpha API is also required.
- The `handler` field must be a valid DNS label ([RFC 1123](https://tools.ietf.org/html/rfc1123)),
  meaning it can no longer contain `.` characters (in all versions). Valid handlers match the
  following regular expression: `^[a-z0-9]([-a-z0-9]*[a-z0-9])?$`.

**Action Required:** The following actions are required to upgrade from the alpha version of the
RuntimeClass feature to the beta version:

- RuntimeClass resources must be recreated *after* upgrading to v1.14, and the
  `runtimeclasses.node.k8s.io` CRD should be manually deleted:
  ```
  kubectl delete customresourcedefinitions.apiextensions.k8s.io runtimeclasses.node.k8s.io
  ```
- Alpha RuntimeClasses with an unspecified or empty `runtimeHandler` or those using a `.` character
  in the handler are no longer valid, and must be migrated to a valid handler configuration (see
  above).

### Further Reading

- [RuntimeClass Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/runtime-class.md)
- [RuntimeClass Scheduling Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/runtime-class-scheduling.md)

{{% /capture %}}
