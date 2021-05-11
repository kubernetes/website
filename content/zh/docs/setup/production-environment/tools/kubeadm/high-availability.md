---
title: 利用 kubeadm 创建高可用集群
content_type: task
weight: 60
---

<!--
reviewers:
- sig-cluster-lifecycle
title: Creating Highly Available clusters with kubeadm
content_type: task
weight: 60
-->

<!-- overview -->

<!--
This page explains two different approaches to setting up a highly available Kubernetes
cluster using kubeadm:

- With stacked control plane nodes. This approach requires less infrastructure. The etcd members
and control plane nodes are co-located.
- With an external etcd cluster. This approach requires more infrastructure. The
control plane nodes and etcd members are separated.

-->
本文讲述了使用 kubeadm 设置一个高可用的 Kubernetes 集群的两种不同方式：

- 使用堆控制平面节点。这种方法所需基础设施较少。etcd 成员和控制平面节点位于同一位置。
- 使用外部集群。这种方法所需基础设施较多。控制平面的节点和 etcd 成员是分开的。

<!--
Before proceeding, you should carefully consider which approach best meets the needs of your applications
and environment. [This comparison topic](/docs/setup/production-environment/tools/kubeadm/ha-topology/) outlines the advantages and disadvantages of each.

If you encounter issues with setting up the HA cluster, please provide us with feedback
in the kubeadm [issue tracker](https://github.com/kubernetes/kubeadm/issues/new).

See also [The upgrade documentation](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-15).
-->
在下一步之前，你应该仔细考虑哪种方法更好的满足你的应用程序和环境的需求。 
[这是对比文档](/zh/docs/setup/production-environment/tools/kubeadm/ha-topology/) 讲述了每种方法的优缺点。

如果你在安装 HA 集群时遇到问题，请在 kubeadm [问题跟踪](https://github.com/kubernetes/kubeadm/issues/new)里向我们提供反馈。

你也可以阅读 [升级文件](/zh/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
<!--
This page does not address running your cluster on a cloud provider. In a cloud
environment, neither approach documented here works with Service objects of type
LoadBalancer, or with dynamic PersistentVolumes.
-->
{{< caution >}}
这篇文档没有讲述在云提供商上运行集群的问题。在云环境中，此处记录的方法不适用于类型为 LoadBalancer 的服务对象，或者具有动态的 PersistentVolumes。
{{< /caution >}}



## {{% heading "prerequisites" %}}


<!--
For both methods you need this infrastructure:

- Three machines that meet [kubeadm's minimum requirements](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) for
  the control-plane nodes
- Three machines that meet [kubeadm's minimum
  requirements](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) for the workers
- Full network connectivity between all machines in the cluster (public or
  private network)
- sudo privileges on all machines
- SSH access from one device to all nodes in the system
- `kubeadm` and `kubelet` installed on all machines. `kubectl` is optional.
-->
对于这两种方法，你都需要以下基础设施：

- 配置满足 [kubeadm 的最低要求](/zh/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin)
  的三台机器作为控制面节点
- 配置满足 [kubeadm 的最低要求](/zh/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin)
  的三台机器作为工作节点
- 在集群中，确保所有计算机之间存在全网络连接（公网或私网）
- 在所有机器上具有 sudo 权限
- 从某台设备通过 SSH 访问系统中所有节点的能力
- 所有机器上已经安装 `kubeadm` 和 `kubelet`，`kubectl` 是可选的。

<!--
For the external etcd cluster only, you also need:

- Three additional machines for etcd members
-->
仅对于外部 etcd 集群来说，你还需要：

- 给 etcd 成员使用的另外三台机器

<!-- steps -->

<!--
## First steps for both methods

### Create load balancer for kube-apiserver
-->
## 这两种方法的第一步

### 为 kube-apiserver 创建负载均衡器

{{< note >}}
<!--
There are many configurations for load balancers. The following example is only one
option. Your cluster requirements may need a different configuration.
-->
使用负载均衡器需要许多配置。你的集群搭建可能需要不同的配置。
下面的例子只是其中的一方面配置。
{{< /note >}}

<!--
1.  Create a kube-apiserver load balancer with a name that resolves to DNS.

    - In a cloud environment you should place your control plane nodes behind a TCP
      forwarding load balancer. This load balancer distributes traffic to all
      healthy control plane nodes in its target list. The health check for
      an apiserver is a TCP check on the port the kube-apiserver listens on
      (default value `:6443`).

    - It is not recommended to use an IP address directly in a cloud environment.

    - The load balancer must be able to communicate with all control plane nodes
      on the apiserver port. It must also allow incoming traffic on its
      listening port.

    - Make sure the address of the load balancer always matches
      the address of kubeadm's `ControlPlaneEndpoint`.

    - Read the [Options for Software Load Balancing](https://github.com/kubernetes/kubeadm/blob/master/docs/ha-considerations.md#options-for-software-load-balancing)
      guide for more details.
-->
1.  创建一个名为 kube-apiserver 的负载均衡器解析 DNS。

    - 在云环境中，应该将控制平面节点放置在 TCP 后面转发负载平衡。
      该负载均衡器将流量分配给目标列表中所有运行状况良好的控制平面节点。
      API 服务器的健康检查是在 kube-apiserver 的监听端口（默认值 `:6443`）
      上进行的一个 TCP 检查。

    - 不建议在云环境中直接使用 IP 地址。

    - 负载均衡器必须能够在 API 服务器端口上与所有控制平面节点通信。
      它还必须允许其监听端口的入站流量。

    - 确保负载均衡器的地址始终匹配 kubeadm 的 `ControlPlaneEndpoint` 地址。

    - 阅读[软件负载平衡选项指南](https://github.com/kubernetes/kubeadm/blob/master/docs/ha-considerations.md#options-for-software-load-balancing)
      以获取更多详细信息。

<!--
1.  Add the first control plane nodes to the load balancer and test the
    connection:

    ```sh
    nc -v LOAD_BALANCER_IP PORT
    ```

    - A connection refused error is expected because the apiserver is not yet
      running. A timeout, however, means the load balancer cannot communicate
      with the control plane node. If a timeout occurs, reconfigure the load
      balancer to communicate with the control plane node.

1.  Add the remaining control plane nodes to the load balancer target group.
-->
2.  添加第一个控制平面节点到负载均衡器并测试连接：

    ```shell
    nc -v LOAD_BALANCER_IP PORT
    ```

    - 由于 apiserver 尚未运行，预期会出现一个连接拒绝错误。
      然而超时意味着负载均衡器不能和控制平面节点通信。
      如果发生超时，请重新配置负载均衡器与控制平面节点进行通信。

3.  将其余控制平面节点添加到负载均衡器目标组。

<!--
## Stacked control plane and etcd nodes

### Steps for the first control plane node
-->
## 使用堆控制平面和 etcd 节点

### 控制平面节点的第一步

<!--
1.  Initialize the control plane:

    ```sh
    sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs
    ```
    - You can use the `--kubernetes-version` flag to set the Kubernetes version to use.
    It is recommended that the versions of kubeadm, kubelet, kubectl and Kubernetes match.
    - The `--control-plane-endpoint` flag should be set to the address or DNS and port of the load balancer.

    - The `--upload-certs` flag is used to upload the certificates that should be shared
    across all the control-plane instances to the cluster. If instead, you prefer to copy certs across
    control-plane nodes manually or using automation tools, please remove this flag and refer to [Manual
    certificate distribution](#manual-certs) section bellow.
-->
1.  初始化控制平面：

    ```shell
    sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs
    ```

    - 你可以使用 `--kubernetes-version` 标志来设置要使用的 Kubernetes 版本。
      建议将 kubeadm、kebelet、kubectl 和 Kubernetes 的版本匹配。
    - 这个 `--control-plane-endpoint` 标志应该被设置成负载均衡器的地址或 DNS 和端口。
    - 这个 `--upload-certs` 标志用来将在所有控制平面实例之间的共享证书上传到集群。
      如果正好相反，你更喜欢手动地通过控制平面节点或者使用自动化
      工具复制证书，请删除此标志并参考如下部分[证书分配手册](#manual-certs)。

    {{< note >}}
    <!--
    The `kubeadm init` flags `--config` and `--certificate-key` cannot be mixed, therefore if you want
    to use the [kubeadm configuration](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2) you must add the `certificateKey` field in the appropriate config locations (under `InitConfiguration` and `JoinConfiguration: controlPlane`).
    -->
    标志 `kubeadm init`、`--config` 和 `--certificate-key` 不能混合使用，
    因此如果你要使用
    [kubeadm 配置](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2)，
    你必须在相应的配置文件
    （位于 `InitConfiguration` 和 `JoinConfiguration: controlPlane`）添加 `certificateKey` 字段。
    {{< /note >}}

    {{< note >}}
    <!--
    Some CNI network plugins like Calico require a CIDR such as `192.168.0.0/16` and
    some like Weave do not. See the [CNI network documentation](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network).
    To add a pod CIDR pass the flag `--pod-network-cidr`, or if you are using a kubeadm configuration file
    set the `podSubnet` field under the `networking` object of `ClusterConfiguration`.
    -->
    一些 CNI 网络插件如 Calico 需要 CIDR 例如 `192.168.0.0/16` 和一些像 Weave 没有。参考
    [CNI 网络文档](/zh/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)。
    通过传递 `--pod-network-cidr` 标志添加 pod CIDR，或者你可以使用 kubeadm
    配置文件，在 `ClusterConfiguration` 的 `networking` 对象下设置 `podSubnet` 字段。
    {{< /note >}}

    <!--
    - The output looks similar to:
    -->
    - 输出类似于：

      ```sh
      ...
      You can now join any number of control-plane node by running the following command on each as a root:
      kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07

      Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
      As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use kubeadm init phase upload-certs to reload certs afterward.

      Then you can join any number of worker nodes by running the following on each as root:
        kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
      ```

    <!--
    - Copy this output to a text file. You will need it later to join control plane and worker nodes to the cluster.
    - When `--upload-certs` is used with `kubeadm init`, the certificates of the primary control plane
    are encrypted and uploaded in the `kubeadm-certs` Secret.
    - To re-upload the certificates and generate a new decryption key, use the following command on a control plane
    node that is already joined to the cluster:
    -->
    - 将此输出复制到文本文件。 稍后你将需要它来将控制平面节点和工作节点加入集群。
    - 当 `--upload-certs` 与 `kubeadm init` 一起使用时，主控制平面的证书
      被加密并上传到 `kubeadm-certs` Secret 中。
    - 要重新上传证书并生成新的解密密钥，请在已加入集群节点的控制平面上使用以下命令：

      ```shell
      sudo kubeadm init phase upload-certs --upload-certs
      ```
    <!--
    - You can also specify a custom `--certificate-key` during `init` that can later be used by `join`.
      To generate such a key you can use the following command:
    -->
    - 你还可以在 `init` 期间指定自定义的 `--certificate-key`，以后可以由 `join` 使用。
      要生成这样的密钥，可以使用以下命令：

      ```shell
      kubeadm certs certificate-key
      ```

    {{< note >}}
    <!--
    The `kubeadm-certs` Secret and decryption key expire after two hours.
    -->
    `kubeadm-certs` 密钥和解密密钥会在两个小时后失效。
    {{< /note >}}

    {{< caution >}}
    <!--
    As stated in the command output, the certificate key gives access to cluster sensitive data, keep it secret!
    -->
    正如命令输出中所述，证书密钥可访问群集敏感数据。请妥善保管！
    {{< /caution >}}

<!--
1.  Apply the CNI plugin of your choice:
    [Follow these instructions](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network) to install the CNI provider. Make sure the configuration corresponds to the Pod CIDR specified in the kubeadm configuration file if applicable.

    In this example we are using Weave Net:
-->
2.  应用你所选择的 CNI 插件：
    [请遵循以下指示](/zh/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)
    安装 CNI 提供程序。如果适用，请确保配置与 kubeadm 配置文件中指定的 Pod
    CIDR 相对应。

    在此示例中，我们使用 Weave Net：

    ```shell
    kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
    ```

<!--
1.  Type the following and watch the pods of the control plane components get started:
-->
3.  输入以下内容，并查看控制平面组件的 Pods 启动：

    ```shell
    kubectl get pod -n kube-system -w
    ```

<!--
### Steps for the rest of the control plane nodes
-->
### 其余控制平面节点的步骤

{{< note >}}
<!--
Since kubeadm version 1.15 you can join multiple control-plane nodes in parallel.
Prior to this version, you must join new control plane nodes sequentially, only after
the first node has finished initializing.
-->
从 kubeadm 1.15 版本开始，你可以并行加入多个控制平面节点。
在此版本之前，你必须在第一个节点初始化后才能依序的增加新的控制平面节点。
{{< /note >}}

<!--
For each additional control plane node you should:

1.  Execute the join command that was previously given to you by the `kubeadm init` output on the first node.
    It should look something like this:

    ```sh
    sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
    ```

    - The `--control-plane` flag tells `kubeadm join` to create a new control plane.
    - The `--certificate-key ...` will cause the control plane certificates to be downloaded
    from the `kubeadm-certs` Secret in the cluster and be decrypted using the given key.

-->
对于每个其他控制平面节点，你应该：

1.  执行先前由第一个节点上的 `kubeadm init` 输出提供给你的 join 命令。
    它看起来应该像这样：

    ```sh
    sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
    ```

    - 这个 `--control-plane` 命令通知 `kubeadm join` 创建一个新的控制平面。
    - `--certificate-key ...` 将导致从集群中的 `kubeadm-certs` Secret 下载
      控制平面证书并使用给定的密钥进行解密。

<!--
## External etcd nodes

Setting up a cluster with external etcd nodes is similar to the procedure used for stacked etcd
with the exception that you should setup etcd first, and you should pass the etcd information
in the kubeadm config file.
-->
## 外部 etcd 节点

使用外部 etcd 节点设置集群类似于用于堆叠 etcd 的过程，
不同之处在于你应该首先设置 etcd，并在 kubeadm 配置文件中传递 etcd 信息。

<!--
### Set up the etcd cluster

1.  Follow [these instructions](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) to set up the etcd cluster.

1.  Setup SSH as described [here](#manual-certs).

1.  Copy the following files from any etcd node in the cluster to the first control plane node:

    ```sh
    export CONTROL_PLANE="ubuntu@10.0.0.7"
    scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
    scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
    scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
    ```

    - Replace the value of `CONTROL_PLANE` with the `user@host` of the first control-plane machine.
-->
### 设置 ectd 集群

1.  按照 [这些指示](/zh/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) 
    去设置 etcd 集群。

1.  根据[这里](#manual-certs)的描述配置 SSH。

1.  将以下文件从集群中的任何 etcd 节点复制到第一个控制平面节点：

    ```shell
    export CONTROL_PLANE="ubuntu@10.0.0.7"
    scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
    scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
    scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
    ```

    - 用第一台控制平面机的 `user@host` 替换 `CONTROL_PLANE` 的值。

<!--
### Set up the first control plane node

1.  Create a file called `kubeadm-config.yaml` with the following contents:

    ```yaml
    apiVersion: kubeadm.k8s.io/v1beta2
    kind: ClusterConfiguration
    kubernetesVersion: stable
    controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"
    etcd:
        external:
            endpoints:
            - https://ETCD_0_IP:2379
            - https://ETCD_1_IP:2379
            - https://ETCD_2_IP:2379
            caFile: /etc/kubernetes/pki/etcd/ca.crt
            certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
            keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key
    ```
-->

### 设置第一个控制平面节点

1.  用以下内容创建一个名为 `kubeadm-config.yaml` 的文件：

    ```yaml
    apiVersion: kubeadm.k8s.io/v1beta2
    kind: ClusterConfiguration
    kubernetesVersion: stable
    controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"
    etcd:
        external:
            endpoints:
            - https://ETCD_0_IP:2379
            - https://ETCD_1_IP:2379
            - https://ETCD_2_IP:2379
            caFile: /etc/kubernetes/pki/etcd/ca.crt
            certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
            keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key
    ```

    {{< note >}}
    <!--
    The difference between stacked etcd and external etcd here is that the external etcd setup requires
    a configuration file with the etcd endpoints under the `external` object for `etcd`.
    In the case of the stacked etcd topology this is managed automatically.
    -->
    这里的内部（stacked） etcd 和外部 etcd 之前的区别在于设置外部 etcd
    需要一个 `etcd` 的 `external` 对象下带有 etcd 端点的配置文件。
    如果是内部 etcd，是自动管理的。
    {{< /note >}}

    <!--
    -  Replace the following variables in the config template with the appropriate values for your cluster:
    -->
    - 在你的集群中，将配置模板中的以下变量替换为适当值：

      - `LOAD_BALANCER_DNS`
      - `LOAD_BALANCER_PORT`
      - `ETCD_0_IP`
      - `ETCD_1_IP`
      - `ETCD_2_IP`

<!--
The following steps are similar to the stacked etcd setup:
-->
以下的步骤与设置内置 etcd 的集群是相似的：

<!--
1.  Run `sudo kubeadm init --config kubeadm-config.yaml --upload-certs` on this node.

1.  Write the output join commands that are returned to a text file for later use.

1.  Apply the CNI plugin of your choice. The given example is for Weave Net:
-->
1. 在节点上运行 `sudo kubeadm init --config kubeadm-config.yaml --upload-certs` 命令。

1. 记下输出的 join 命令，这些命令将在以后使用。

1. 应用你选择的 CNI 插件。以下示例适用于 Weave Net：

   ```shell
   kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
   ```

<!--
### Steps for the rest of the control plane nodes

The steps are the same as for the stacked etcd setup:

- Make sure the first control plane node is fully initialized.
- Join each control plane node with the join command you saved to a text file. It's recommended
to join the control plane nodes one at a time.
- Don't forget that the decryption key from `--certificate-key` expires after two hours, by default.
-->
### 其他控制平面节点的步骤

步骤与设置内置 etcd 相同：

- 确保第一个控制平面节点已完全初始化。
- 使用保存到文本文件的 join 命令将每个控制平面节点连接在一起。
  建议一次加入一个控制平面节点。
- 不要忘记默认情况下，`--certificate-key` 中的解密秘钥会在两个小时后过期。

<!--
## Common tasks after bootstrapping control plane

### Install workers
-->
## 列举控制平面之后的常见任务

### 安装工作节点

<!--
Worker nodes can be joined to the cluster with the command you stored previously
as the output from the `kubeadm init` command:
-->
你可以使用之前存储的 `kubeadm init` 命令的输出将工作节点加入集群中：

```sh
sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

<!--
## Manual certificate distribution {#manual-certs}

If you choose to not use `kubeadm init` with the `--upload-certs` flag this means that
you are going to have to manually copy the certificates from the primary control plane node to the
joining control plane nodes.

There are many ways to do this. In the following example we are using `ssh` and `scp`:

SSH is required if you want to control all nodes from a single machine.
-->
## 手动证书分发 {#manual-certs}

如果你选择不将 `kubeadm init` 与 `--upload-certs` 命令一起使用，
则意味着你将必须手动将证书从主控制平面节点复制到
将要加入的控制平面节点上。

有许多方法可以实现这种操作。在下面的例子中我们使用 `ssh` 和 `scp`：

如果要在单独的一台计算机控制所有节点，则需要 SSH。

<!--
1. Enable ssh-agent on your main device that has access to all other nodes in
   the system:
-->
1. 在你的主设备上启用 ssh-agent，要求该设备能访问系统中的所有其他节点：

   ```shell
   eval $(ssh-agent)
   ```

<!--
1. Add your SSH identity to the session:
-->
2. 将 SSH 身份添加到会话中：

   ```shell
   ssh-add ~/.ssh/path_to_private_key
   ```

<!--
1. SSH between nodes to check that the connection is working correctly.
-->
3. 检查节点间的 SSH 以确保连接是正常运行的

   <!--
   - When you SSH to any node, make sure to add the `-A` flag:
   -->
   - SSH 到任何节点时，请确保添加 `-A` 标志：

     ```shell
     ssh -A 10.0.0.7
     ```

   <!--
   - When using sudo on any node, make sure to preserve the environment so SSH
     forwarding works:
   -->
   - 当在任何节点上使用 sudo 时，请确保保持环境变量设置，以便 SSH
     转发能够正常工作：

     ```shell
     sudo -E -s
     ```
<!--
1. After configuring SSH on all the nodes you should run the following script on the first control plane node after
   running `kubeadm init`. This script will copy the certificates from the first control plane node to the other
   control plane nodes:
-->
4. 在所有节点上配置 SSH 之后，你应该在运行过 `kubeadm init` 命令的第一个
   控制平面节点上运行以下脚本。
   该脚本会将证书从第一个控制平面节点复制到另一个控制平面节点：

   <!--
   In the following example, replace `CONTROL_PLANE_IPS` with the IP addresses of the
   other control plane nodes.
   -->
   在以下示例中，用其他控制平面节点的 IP 地址替换 `CONTROL_PLANE_IPS`。

   ```sh
   USER=ubuntu # 可定制
   CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
   for host in ${CONTROL_PLANE_IPS}; do
       scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
       scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
   done
   ```

   {{< caution >}}
   <!--
   Copy only the certificates in the above list. kubeadm will take care of generating the rest of the certificates
   with the required SANs for the joining control-plane instances. If you copy all the certificates by mistake,
   the creation of additional nodes could fail due to a lack of required SANs.
   -->
   只需要复制上面列表中的证书。kubeadm 将负责生成其余证书以及加入控制平面实例所需的 SAN。
   如果你错误地复制了所有证书，由于缺少所需的 SAN，创建其他节点可能会失败。
   {{< /caution >}}

<!--
1. Then on each joining control plane node you have to run the following script before running `kubeadm join`.
   This script will move the previously copied certificates from the home directory to `/etc/kubernetes/pki`:
-->
5. 然后，在每个即将加入集群的控制平面节点上，你必须先运行以下脚本，然后
   再运行 `kubeadm join`。
   该脚本会将先前复制的证书从主目录移动到 `/etc/kubernetes/pki`：

   ```shell
   USER=ubuntu # 可定制
   mkdir -p /etc/kubernetes/pki/etcd
   mv /home/${USER}/ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/ca.key /etc/kubernetes/pki/
   mv /home/${USER}/sa.pub /etc/kubernetes/pki/
   mv /home/${USER}/sa.key /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
   mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
   mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
   ```

