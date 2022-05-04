---
reviewers:
- mtaufen
- dawnchen
title: Reconfigure a Node's Kubelet in a Live Cluster
content_type: task
min-kubernetes-server-version: v1.11
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.22" state="deprecated" >}}

{{< caution >}}
The [Dynamic Kubelet Configuration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/281-dynamic-kubelet-configuration)
feature is deprecated in 1.22 and removed in 1.24.
Please switch to alternative means distributing configuration to the Nodes of your cluster.
{{< /caution >}}

[Dynamic Kubelet Configuration](https://github.com/kubernetes/enhancements/issues/281)
allowed you to change the configuration of each
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} in a running Kubernetes cluster,
by deploying a {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} and configuring
each {{< glossary_tooltip term_id="node" >}} to use it.

Please find documentation on this feature in [earlier versions of documentation](https://v1-23.docs.kubernetes.io/docs/tasks/administer-cluster/reconfigure-kubelet/).

## Migrating from using Dynamic Kubelet Configuration

There is no recommended replacement for this feature that works generically
across various Kubernetes distributions. If you are using managed Kubernetes
version, please consult with the vendor hosting Kubernetes for the best
practices for customizing your Kubernetes. If you are using KubeAdm, refer to
[Configuring each kubelet in your cluster using kubeadm](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/).

In order to migrate off the Dynamic Kubelet Configuration feature, the
alternative mechanism should be used to distribute kubelet configuration files.
In order to apply configuration, config file must be updated and kubelet restarted.
See the [Set Kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/)
for information.

Please note, the `DynamicKubeletConfig` feature gate cannot be set on a kubelet
starting v1.24 as it has no effect. However, the feature gate is not removed
from the API server or the controller manager before v1.26. This is designed for
the control plane to support nodes with older versions of kubelets and for
satisfying the [Kubernetes version skew policy](/releases/version-skew-policy/).
