---
reviewers:
- sig-cluster-lifecycle
title: Customizing control plane configuration with kubeadm
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

{{< feature-state for_k8s_version="1.12" state="stable" >}}

The kubeadm `ClusterConfiguration` object exposes the field `extraArgs` that can override the default flags passed to control plane
components such as the APIServer, ControllerManager and Scheduler. The components are defined using the following fields:

- `apiServer`
- `controllerManager`
- `scheduler`

The `extraArgs` field consist of `key: value` pairs. To override a flag for a control plane component:

1.  Add the appropriate fields to your configuration.
2.  Add the flags to override to the field.
3.  Run `kubeadm init` with `--config <YOUR CONFIG YAML>`.

For more details on each field in the configuration you can navigate to our
[API reference pages](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2#ClusterConfiguration).

{{< note >}}
You can generate a `ClusterConfiguration` object with default values by running `kubeadm config print init-defaults` and saving the output to a file of your choice.
{{< /note >}}

{{% /capture %}}

{{% capture body %}}

## APIServer flags

For details, see the [reference documentation for kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/).

Example usage:
```yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.13.0
apiServer:
  extraArgs:
    advertise-address: 192.168.0.103
    anonymous-auth: "false"
    enable-admission-plugins: AlwaysPullImages,DefaultStorageClass
    audit-log-path: /home/johndoe/audit.log
```

## ControllerManager flags

For details, see the [reference documentation for kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/).

Example usage:
```yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.13.0
controllerManager:
  extraArgs:
    cluster-signing-key-file: /home/johndoe/keys/ca.key
    bind-address: 0.0.0.0
    deployment-controller-sync-period: "50"
```

## Scheduler flags

For details, see the [reference documentation for kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).

Example usage:
```yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.13.0
scheduler:
  extraArgs:
    address: 0.0.0.0
    config: /home/johndoe/schedconfig.yaml
    kubeconfig: /home/johndoe/kubeconfig.yaml
```

{{% /capture %}}
