
Run this to revert any changes made to this host by 'kubeadm init' or 'kubeadm join'.

运行这条命令还原当前节点上 **kubeadm init** 或者 **kubeadm join** 所做的所有更改。

### Synopsis

### 概要

Run this to revert any changes made to this host by 'kubeadm init' or 'kubeadm join'.

运行这条命令还原当前节点上 **kubeadm init** 或者 **kubeadm join** 所做的所有更改。

```
kubeadm reset
```

### Options

### 选项

```
      --cert-dir string                    The path to the directory where the certificates are stored. If specified, clean this directory. (default "/etc/kubernetes/pki")
      --cri-socket string                  The path to the CRI socket to use with crictl when cleaning up containers. (default "/var/run/dockershim.sock")
      --ignore-checks-errors stringSlice   A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
```

```
    --cert-dir string: 存放证书的路径。如果指定了，则清除这个目录。（默认为 "/etc/kubernetes/pki"）
    --cri-socket string: 使用 crictl 清理容器时 CRI 套接字的路径。（默认为 "/var/run/dockershim.sock"）
    --ignore-checks-errors stringSlice: 一个检查列表，检查出来的错误会作为警告显示。示例: 'IsPrivilegedUser,Swap'。"all" 表示忽略所有检测到的错误。
```    
