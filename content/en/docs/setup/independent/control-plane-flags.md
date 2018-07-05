---
reviewers:
- sig-cluster-lifecycle
title: Customizing control plane configuration with kubeadm
content_template: templates/concept
weight: 50
---

{{% capture overview %}}

kubeadm’s configuration exposes the following fields that can be used to override the default flags passed to control plane components such as the APIServer, ControllerManager and Scheduler:

- `APIServerExtraArgs`
- `ControllerManagerExtraArgs`
- `SchedulerExtraArgs`

These fields consist of `key: value` pairs. To override a flag for a control plane component:

1.  Add the appropriate field to your configuration.
2.  Add the flags to override to the field.

For more details on each field in the configuration you can navigate to our
[API reference pages](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm#MasterConfiguration).

{{% /capture %}}

{{% capture body %}}

## APIServer flags

For details, see the [reference documentation for kube-apiserver](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/).

Example usage:
```yaml
apiVersion: kubeadm.k8s.io/v1alpha2
kind: MasterConfiguration
kubernetesVersion: v1.11.0
metadata:
  name: 1.11-sample
apiServerExtraArgs:
  advertise-address: 192.168.0.103
  anonymous-auth: false
  enable-admission-plugins: AlwaysPullImages,DefaultStorageClass
  audit-log-path: /home/johndoe/audit.log
```

## ControllerManager flags

For details, see the [reference documentation for kube-controller-manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/).

Example usage:
```yaml
apiVersion: kubeadm.k8s.io/v1alpha2
kind: MasterConfiguration
kubernetesVersion: v1.11.0
metadata:
  name: 1.11-sample
controllerManagerExtraArgs:
  cluster-signing-key-file: /home/johndoe/keys/ca.key
  bind-address: 0.0.0.0
  deployment-controller-sync-period: 50
```

## Scheduler flags

For details, see the [reference documentation for kube-scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/).

Example usage:
```yaml
apiVersion: kubeadm.k8s.io/v1alpha2
kind: MasterConfiguration
kubernetesVersion: v1.11.0
metadata:
  name: 1.11-sample
schedulerExtraArgs:
  address: 0.0.0.0
  config: /home/johndoe/schedconfig.yaml
  kubeconfig: /home/johndoe/kubeconfig.yaml
```

{{% /capture %}}
