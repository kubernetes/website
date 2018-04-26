---
title: 生成 kubeconfig 文件给调度器使用
approvers:
cn-approvers:
- okzhchy
---

<!-- 
Generates a kubeconfig file for the scheduler to use

### Synopsis


Generates the kubeconfig file for the scheduler to use and saves it to /etc/kubernetes/scheduler.conf file. 

Alpha Disclaimer: this command is currently alpha.
-->

生成 kubeconfig 文件给调度器使用

### 概要


生成 kubeconfig 文件给调度器使用且把它保存至/etc/kubernetes/scheduler.conf。

Alpha 免责声明：此命令处于 Alpha 阶段。


<!-- 
```
kubeadm alpha phase kubeconfig scheduler
```
 -->
```
kubeadm alpha phase kubeconfig scheduler
```

<!-- 
### Options

```
      --apiserver-advertise-address string   The IP address the API server is accessible on
      --apiserver-bind-port int32            The port the API server is accessible on (default 6443)
      --cert-dir string                      The path where certificates are stored (default "/etc/kubernetes/pki")
      --config string                        Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)
      --kubeconfig-dir string                The port where to save the kubeconfig file (default "/etc/kubernetes")
```

 -->

### 选择项

```
      --apiserver-advertise-address string   可访问 API server 的IP地址
      --apiserver-bind-port int32            可访问 API server 的端口（默认值 6443）
      --cert-dir string                      证书存储路径（默认值 "/etc/kubernetes/pki"）
      --config string                        kubeadm 配置文件存储路径（警告: 配置文件使用是实验性的）
      --kubeconfig-dir string                kubeconfig 文件存储路径（默认值 "/etc/kubernetes"）
```
