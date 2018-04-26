
生成 controller-manager 静态 Pod 清单。

### 概要

<!--
Generates the controller-manager static Pod manifest.

### Synopsis
-->

<!--
Generates the static Pod manifest file for the controller-manager and saves it into /etc/kubernetes/manifests/kube-controller-manager.yaml file.

Alpha Disclaimer: this command is currently alpha.

```
kubeadm alpha phase controlplane controller-manager
```
-->

为 controller-manager 生成静态 Pod 清单，并将其保存进 /etc/kubernetes/manifests/kube-controller-manager.yaml 文件。

<!--
### Options

```
      --cert-dir string             The path where certificates are stored (default "/etc/kubernetes/pki")
      --config string               Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
      --kubernetes-version string   Choose a specific Kubernetes version for the control plane (default "stable-1.8")
      --pod-network-cidr string     The range of IP addresses used for the Pod network
```
-->

### 选项

```
      --cert-dir string             证书存储路径 （默认 "/etc/kubernetes/pki"）
      --config string               kubeadm 的配置文件路径 （WARNING: 配置文件的使用是实验性的）
      --kubernetes-version string   指定一个 Kubernetes 版本 （默认 "stable-1.8"）
      --pod-network-cidr string     用于 Pod 网络的 IP 地址范围
```
