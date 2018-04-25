---
approvers:
- mikedanese
- luxas
- errordeveloper
- jbeda
cn-approvers:
- xiaosuiba
title: 使用 kubeadm 创建高可用集群
---
<!--
title: Creating HA clusters with kubeadm
-->

{% capture overview %}

<!--
This guide shows you how to install and set up a highly available Kubernetes cluster using kubeadm.

This document shows you how to perform setup tasks that kubeadm doesn't perform: provision hardware; configure multiple systems; and load balancing.
-->
本指南为您展示了如何使用 kubeadm 安装并设置一个高可用集群。

本文为您展示了如何执行 kubeadm 没有执行的配置任务：配置硬件；配置多个系统和负载均衡。

<!--
**Note:** This guide is only one potential solution, and there are many ways to configure a highly available cluster. If a better solution works for you, please use it. If you find a better solution that can be adopted by the community, feel free to contribute it back.
{: .note}
-->
**注意：**本指南只是一个潜在的解决方案，还存在很多可以配置高可用集群的方法。如果有更好的解决方案适合您，请使用它。如果您找到了社区可以使用的更好的解决方案，请随时为社区提供回馈。
{: .note}

{% endcapture %}

{% capture prerequisites %}

<!--
- Three machines that meet [kubeadm's minimum requirements](https://kubernetes.io/docs/setup/independent/install-kubeadm/#before-you-begin) for the masters
- Three machines that meet [kubeadm's minimum requirements](https://kubernetes.io/docs/setup/independent/install-kubeadm/#before-you-begin) for the workers
- **Optional:** At least three machines that meet [kubeadm's minimum requirements](https://kubernetes.io/docs/setup/independent/install-kubeadm/#before-you-begin) 
   if you intend to host etcd on dedicated nodes (see information below)
- 1GB or more of RAM per machine (any less will leave little room for your apps)
- Full network connectivity between all machines in the cluster (public or
   private network is fine)
-->
- 三台满足 [kubeadm 最低要求](https://kubernetes.io/docs/setup/independent/install-kubeadm/#before-you-begin) 的机器，用作 master。
- 三台满足 [kubeadm 最低要求](https://kubernetes.io/docs/setup/independent/install-kubeadm/#before-you-begin) 的机器，用作 worker（工作节点）。
- **可选：** 至少三台满足 [kubeadm 最低要求](https://kubernetes.io/docs/setup/independent/install-kubeadm/#before-you-begin) 的机器 - 如果您希望在专用的节点上托管 etcd（请查看下面的信息）
- 每台机器有 1GB 或更多内存（少于该值将导致应用内存不足）
- 集群中所有机器之间网络连接良好（公共或私有网络都可以）

{% endcapture %}

{% capture steps %}

<!--
## Installing prerequisites on masters

For each master that has been provisioned, follow the [installation guide](/docs/setup/independent/install-kubeadm/) on how to install kubeadm and its dependencies. At the end of this step, you should have all the dependencies installed on each master.
-->
## 在 master 上安装先决条件

对于创建好的每个 master，请参照 [安装指南](/docs/setup/independent/install-kubeadm/) 中有关如何安装 kubeadm 及其依赖的信息。在本步骤结束时，您应该在每个 master 上安装了所有的依赖项。

<!--
## Setting up an HA etcd cluster

For highly available setups, you will need to decide how to host your etcd cluster. A cluster is composed of at least 3 members. We recommend one of the following models:

1. Hosting etcd cluster on separate compute nodes (Virtual Machines), or
2. Hosting etcd cluster on the master nodes.
-->
## 设置高可用 etcd 集群

对于高可用配置，您需要决定如何托管您的 etcd 集群。一个集群由至少 3 个成员组成。我们推荐以下模型之一：

1. 在独立的计算节点（虚拟机）上托管 etcd 集群，或者
2. 在 master 节点上托管 etcd 集群

<!--
While the first option provides more performance and better hardware isolation, it is also more expensive and requires an additional support burden.

For **Option 1**: create 3 virtual machines that follow [CoreOS's hardware recommendations](https://coreos.com/etcd/docs/latest/op-guide/hardware.html). For the sake of simplicity, we 
will refer to them as `etcd0`, `etcd1` and `etcd2`.

For **Option 2**: you can skip to the next step. Any reference to `etcd0`, `etcd1` and `etcd2` throughout this guide should be replaced with `master0`, `master1` and `master2` accordingly, since your master nodes host etcd.
-->
虽然第一种选项提供了更多的性能和更好的硬件隔离，但它也更加昂贵，并且需要额外的支持。

对于 **选项 1**：创建 3 个符合 [CoreOS 推荐硬件配置](https://coreos.com/etcd/docs/latest/op-guide/hardware.html) 的虚拟机。为了简单起见，我们将它们称为 `etcd0`、`etcd1` 和 `etcd2`。

<!--
### Create etcd CA certs
-->
### 创建 etcd CA 证书

<!--
1. Install `cfssl` and `cfssljson`:
-->
1. 安装 `cfssl` 和 `cfssljson`：

    ```shell
    curl -o /usr/local/bin/cfssl https://pkg.cfssl.org/R1.2/cfssl_linux-amd64
    curl -o /usr/local/bin/cfssljson https://pkg.cfssl.org/R1.2/cfssljson_linux-amd64
    chmod +x /usr/local/bin/cfssl*
    ```

<!--
1. SSH into `etcd0` and run the following:
-->
1. SSH 进入 `etcd0` 并运行如下命令：

    ```shell
    mkdir -p /etc/kubernetes/pki/etcd
    cd /etc/kubernetes/pki/etcd
    ```
    ```shell
    cat >ca-config.json <<EOL
    {
        "signing": {
            "default": {
                "expiry": "43800h"
            },
            "profiles": {
                "server": {
                    "expiry": "43800h",
                    "usages": [
                        "signing",
                        "key encipherment",
                        "server auth",
                        "client auth"
                    ]
                },
                "client": {
                    "expiry": "43800h",
                    "usages": [
                        "signing",
                        "key encipherment",
                        "client auth"
                    ]
                },
                "peer": {
                    "expiry": "43800h",
                    "usages": [
                        "signing",
                        "key encipherment",
                        "server auth",
                        "client auth"
                    ]
                }
            }
        }
    }
    EOL
    ```
    ```shell
    cat >ca-csr.json <<EOL
    {
        "CN": "etcd",
        "key": {
            "algo": "rsa",
            "size": 2048
        }
    }
    EOL
    ```

<!--
    Ensure that the `names` section in `ca-csr.json` matches your own company or personal address, or that you use a suitable default.
-->
    请确保 `ca-csr.json` 中的 `names` 小节和您的公司或个人地址相匹配，或者您也可以使用一个合适的默认值。

<!--
1. Next, generate the CA certs like so:
-->
1. 接下来，像这样生成 CA 证书：

    ```shell
    cfssl gencert -initca ca-csr.json | cfssljson -bare ca -
    ```

<!--
### Generate etcd client certs

1. Generate the client certificates. 
-->
### 生成 etcd 客户端证书

1. 生成客户端证书

<!--
   While on `etcd0`, run the following:
   -->
   在 `etcd0` 上运行如下命令：

    ```shell
    cat >client.json <<EOL
    {
        "CN": "client",
        "key": {
            "algo": "ecdsa",
            "size": 256
        }
    }
    EOL
    ```
    ```shell
    cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=client client.json | cfssljson -bare client
    ```

<!--
This should result in `client.pem` and `client-key.pem` being created.

### Create SSH access

In order to copy certs between machines, you must enable SSH access for `scp`.

1. First, open new new tabs in your shell for `etcd1` and `etcd2`. Ensure you are SSHed into all three machines and then run the following (it will be a lot quicker if you use tmux syncing - to do this in iTerm enter `cmd+shift+i`):
-->
这会创建  `client.pem` 和 `client-key.pem`。

### 创建 SSH 访问

为了在机器之间复制证书，您必须为 `scp` 启用 SSH 访问。

1. 首先，在您的 shell 中为 `etcd1` 和 `etcd2` 打开新的选项卡。确保您已经 SSH 进入所有三台机器，然后运行以下命令（如果您使用 tmux 同步 - 请在 iTerm 中输入 `cmd+shift+i`，这将会快很多）：

    ```shell
    export PEER_NAME=$(hostname)
    export PRIVATE_IP=$(ip addr show eth1 | grep -Po 'inet \K[\d.]+')
    ```

<!--
    Make sure that `eth1` corresponds to the network interface for the IPv4 address of the private network. This might vary depending on your networking setup, so please check by running `echo $PRIVATE_IP` before continuing.
-->
    请确保 `eth1` 对应于私有网络 iPv4 地址的网络接口。这可能取决于您的网络配置，因此，请在继续之前运行 `echo $PRIVATE_IP` 进行检查。

<!--
1. Next, generate some SSH keys for the boxes:
-->
1. 接下来，为每个 box 生成 SSH 密钥：

    ```shell
    ssh-keygen -t rsa -b 4096 -C "<email>"
    ```

<!--
    Make sure to replace `<email>` with your email, a placeholder, or an empty string. Keep hitting enter until files exist in `~/.ssh`.

1. Output the contents of the public key file for `etcd1` and `etcd2`, like so:
-->
    请确保将 `<email>` 替换为您的 email、占位符或者一个空字符串。继续回车直到文件出现在 `~/.ssh` 中。

1. 输出 `etcd1` 和 `etcd2` 的公钥文件的内容，像这样：

    ```shell
    cat ~/.ssh/id_rsa.pub
    ```

<!--
1. Finally, copy the output for each and paste them into `etcd0`'s `~/.ssh/authorized_keys` file. This will permit `etcd1` and `etcd2` to SSH in to the machine.

### Generate etcd server and peer certs

1. In order to generate certs, each etcd machine needs the root CA generated by `etcd0`. On `etcd1` and `etcd2`, run the following:
-->
1. 最后，复制每个输出并粘贴到 `etcd0` 的 `~/.ssh/authorized_keys`  文件中。这将允许 `etcd1` 和 `etcd2` SSH 到 `etcd0` 中。

    ```shell
    mkdir -p /etc/kubernetes/pki/etcd
    cd /etc/kubernetes/pki/etcd
    scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/ca.pem .
    scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/ca-key.pem .
    scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/client.pem .
    scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/client-key.pem .
    scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/ca-config.json .
    ```

<!--
    Where `<etcd0-ip-address>` corresponds to the public or private IPv4 of `etcd0`.

1. Once this is done, run the following on all etcd machines:
-->
    其中 `<etcd0-ip-address>` 对应于 `etcd0` 的公共或私有 IPv4 地址。

1. 完成之后，请在所有 etcd 机器上运行以下命令：

    ```shell
    cfssl print-defaults csr > config.json
    sed -i '0,/CN/{s/example\.net/'"$PEER_NAME"'/}' config.json
    sed -i 's/www\.example\.net/'"$PRIVATE_IP"'/' config.json
    sed -i 's/example\.net/'"$PUBLIC_IP"'/' config.json

    cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=server config.json | cfssljson -bare server
    cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=peer config.json | cfssljson -bare peer
    ```

<!--
    The above will replace the default configuration with your machine's hostname as the peer name, and its IP addresses. Make sure
    these are correct before generating the certs. If you found an error, reconfigure `config.json` and re-run the `cfssl` commands.

This will result in the following files: `peer.pem`, `peer-key.pem`, `server.pem`, `server-key.pem`.
-->
    以上内容将使用您机器的 hostname 替换默认配置中的节点名称。请在生成证书之前，确保这些都是正确的。如果发现错误，请重新配置 `config.json` 并重新运行 `cfssl` 命令。

这将产生以下文件：`peer.pem`、`peer-key.pem`、`server.pem`、`server-key.pem`。

<!--
### Run etcd

Now that all the certificates have been generated, you will now install and set up etcd on each machine. 

{% capture choose %}
Please select one of the tabs to see installation instructions for the respective way to run etcd.
{% endcapture %}
-->
### 运行 etcd

现在所有的证书都已经生成，您将在每台机器上安装并设置 etcd.

{% capture choose %}
请选择其中一个选项卡以查看有关运行 etcd 的各种方式的安装说明。
{% endcapture %}

{% capture systemd %}

<!--
1. First you will install etcd binaries like so:
-->
1. 首先，您将安装 etcd 二进制文件，如下所示：

    ```shell
    export ETCD_VERSION=v3.1.10
    curl -sSL https://github.com/coreos/etcd/releases/download/${ETCD_VERSION}/etcd-${ETCD_VERSION}-linux-amd64.tar.gz | tar -xzv --strip-components=1 -C /usr/local/bin/
    rm -rf etcd-$ETCD_VERSION-linux-amd64*
    ```

<!--
    It is worth noting that etcd v3.1.10 is the preferred version for Kubernetes v1.9. For other versions of Kubernetes please consult [the changelog](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md).

    Also, please realise that most distributions of Linux already have a version of etcd installed, so you will be replacing the system default.

1. Next, generate the environment file that systemd will use:
-->
    值得注意的是，etcd v3.1.10 是 Kubernetes v1.9 的首选版本。对于其他版本的 Kubernetes，请参考 [changelog](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md)。

    另外请注意，大多数 Linux 发行版都已安装了一个 etcd 版本，因此您将替换系统的默认安装版本。

1. 接下来，生成 systemd 将会使用的环境文件：

    ```
    touch /etc/etcd.env
    echo "PEER_NAME=$PEER_NAME" >> /etc/etcd.env
    echo "PRIVATE_IP=$PRIVATE_IP" >> /etc/etcd.env
    ```
<!--
1. Now copy the systemd unit file like so:
-->
1. 现在复制 systemd unit 文件，如下所示：

    ```shell
    cat >/etc/systemd/system/etcd.service <<EOL
    [Unit]
    Description=etcd
    Documentation=https://github.com/coreos/etcd
    Conflicts=etcd.service
    Conflicts=etcd2.service

    [Service]
    EnvironmentFile=/etc/etcd.env
    Type=notify
    Restart=always
    RestartSec=5s
    LimitNOFILE=40000
    TimeoutStartSec=0

    ExecStart=/usr/local/bin/etcd --name ${PEER_NAME} \
        --data-dir /var/lib/etcd \
        --listen-client-urls https://${PRIVATE_IP}:2379 \
        --advertise-client-urls https://${PRIVATE_IP}:2379 \
        --listen-peer-urls https://${PRIVATE_IP}:2380 \
        --initial-advertise-peer-urls https://${PRIVATE_IP}:2380 \
        --cert-file=/etc/kubernetes/pki/etcd/server.pem \
        --key-file=/etc/kubernetes/pki/etcd/server-key.pem \
        --client-cert-auth \
        --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.pem \
        --peer-cert-file=/etc/kubernetes/pki/etcd/peer.pem \
        --peer-key-file=/etc/kubernetes/pki/etcd/peer-key.pem \
        --peer-client-cert-auth \
        --peer-trusted-ca-file=/etc/kubernetes/pki/etcd/ca.pem \
        --initial-cluster etcd0=https://<etcd0-ip-address>:2380,etcd1=https://<etcd1-ip-address>:2380,etcd2=https://<etcd2-ip-address>:2380 \
        --initial-cluster-token my-etcd-token \
        --initial-cluster-state new

    [Install]
    WantedBy=multi-user.target
    EOL
    ```

<!--
    Make sure you replace `<etcd0-ip-address>`, `<etcd1-ip-address>` and `<etcd2-ip-address>` with the appropriate IPv4 addresses.

1. Finally, launch etcd like so:
-->
    请确保用恰当的 IPv4 地址替换 `<etcd0-ip-address>`、
    `<etcd1-ip-address>` 和 `<etcd2-ip-address>`。

1. 最后，像这样启动 etcd:

    ```shell
    systemctl daemon-reload
    systemctl start etcd
    ```

<!--
1. Check that it launched successfully:
-->
1. 检查它是否成功启动：

    ```shell
    systemctl status etcd
    ```
{% endcapture %}

{% capture static_pods %}

<!--
**Note**: This is only supported on nodes that have the all dependencies for the kubelet installed. If you are hosting etcd on the master nodes, this has already been set up. If you are hosting etcd on dedicated nodes, you should either use systemd or run the [installation guide](/docs/setup/independent/install-kubeadm/) on each dedicated etcd machine.

1. The first step is to run the following to generate the manifest file:
-->
**注意**：这仅支持安装了所有 kubelet 及其依赖的节点。如果您在 master 节点上托管 etcd，则该配置已经设置好了。如果您在专用节点上托管 etcd，则应该使用 systemd 或在每台专用 etcd 机器上运行 [安装指南](/docs/setup/independent/install-kubeadm/)。

    ```shell
    cat >/etc/kubernetes/manifests/etcd.yaml <<EOL
    apiVersion: v1
    kind: Pod
    metadata:
    labels:
        component: etcd
        tier: control-plane
    name: <podname>
    namespace: kube-system
    spec:
    containers:
    - command:
        - etcd --name ${PEER_NAME} \
        - --data-dir /var/lib/etcd \
        - --listen-client-urls https://${PRIVATE_IP}:2379 \
        - --advertise-client-urls https://${PRIVATE_IP}:2379 \
        - --listen-peer-urls https://${PRIVATE_IP}:2380 \
        - --initial-advertise-peer-urls https://${PRIVATE_IP}:2380 \
        - --cert-file=/certs/server.pem \
        - --key-file=/certs/server-key.pem \
        - --client-cert-auth \
        - --trusted-ca-file=/certs/ca.pem \
        - --peer-cert-file=/certs/peer.pem \
        - --peer-key-file=/certs/peer-key.pem \
        - --peer-client-cert-auth \
        - --peer-trusted-ca-file=/certs/ca.pem \
        - --initial-cluster etcd0=https://<etcd0-ip-address>:2380,etcd1=https://<etcd1-ip-address>:2380,etcd1=https://<etcd2-ip-address>:2380 \
        - --initial-cluster-token my-etcd-token \
        - --initial-cluster-state new
        image: gcr.io/google_containers/etcd-amd64:3.1.0
        livenessProbe:
        httpGet:
            path: /health
            port: 2379
            scheme: HTTP
        initialDelaySeconds: 15
        timeoutSeconds: 15
        name: etcd
        env:
        - name: PUBLIC_IP
        valueFrom:
            fieldRef:
            fieldPath: status.hostIP
        - name: PRIVATE_IP
        valueFrom:
            fieldRef:
            fieldPath: status.podIP
        - name: PEER_NAME
        valueFrom:
            fieldRef:
            fieldPath: metadata.name
        volumeMounts:
        - mountPath: /var/lib/etcd
        name: etcd
        - mountPath: /certs
        name: certs
    hostNetwork: true
    volumes:
    - hostPath:
        path: /var/lib/etcd
        type: DirectoryOrCreate
        name: etcd
    - hostPath:
        path: /etc/kubernetes/pki/etcd
        name: certs
    EOL
    ```
<!--
    Make sure you replace:
    * `<podname>` with the name of the node you're running on (e.g. `etcd0`, `etcd1` or `etcd2`)
    * `<etcd0-ip-address>`, `<etcd1-ip-address>` and `<etcd2-ip-address>` with the public IPv4s of the other machines that host etcd.
-->
    请确保替换：
    * `<podname>` 为您正在运行的 node 的名称（例如 `etcd0`、`etcd1` 或 `etcd2`）
    * `<etcd0-ip-address>`、 `<etcd1-ip-address>` 和 `<etcd2-ip-address>` 为其他托管 etcd 的机器的公共 IPv4 地址。

{% endcapture %}

<!--
{% assign tab_names = "Choose one...,systemd,Static Pods" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: choose | push: systemd | push: static_pods %}
-->
{% assign tab_names = "选择一个...,systemd,Static Pods" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: choose | push: systemd | push: static_pods %}

{% include tabs.md %}
<!--
## Set up master Load Balancer

The next step is to create a Load Balancer that sits in front of your master nodes. How you do this depends on your environment; you could, for example, leverage a cloud provider Load Balancer, or set up your own using nginx, keepalived, or HAproxy. Some examples of cloud provider solutions are:

* [AWS Elastic Load Balancer](https://aws.amazon.com/elasticloadbalancing/)
* [GCE Load Balancing](https://cloud.google.com/compute/docs/load-balancing/)
* [Azure](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-overview)

You will need to ensure that the load balancer routes to **just `master0` on port 6443**. This is because kubeadm will perform health checks using the load balancer IP. Since `master0` is set up individually first, the other masters will not have running apiservers, which will result in kubeadm hanging indefinitely.

If possible, use a smart load balancing algorithm like "least connections", and use health checks so unhealthy nodes can be removed from circulation. Most providers will provide these features.
-->
## 设置 master 负载均衡器

下一步是创建一个位于 master 节点前面的负载均衡器。如何做到这一点取决于您的环境；例如，您可以利用云服务提供商的负载均衡器，或者使用  nginx、keepalived 或者 HAproxy。某些云服务提供商的解决方案为：

* [AWS Elastic Load Balancer](https://aws.amazon.com/elasticloadbalancing/)
* [GCE Load Balancing](https://cloud.google.com/compute/docs/load-balancing/)
* [Azure](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-overview)

您需要确保负载均衡器只路由到 **`master0` 上的 6443 端口**。这是因为 kubeadm 将使用负载均衡器 IP 执行健康检查。由于 `master0` 是第一个单独配置的，其他 master 不会运行 apiserver，这将导致 kubeadm 无限期地挂起。

如果可能的话，请使用智能负载均衡算法，如“最少连接数（least connections）”，并使用健康检查，以便将不健康节点从循环中删除。大多数的服务提供商都将提供这些功能。

<!--
## Acquire etcd certs

Only follow this step if your etcd is hosted on dedicated nodes (**Option 1**). If you are hosting etcd on the masters (**Option 2**), you can skip this step since you've already generated the etcd certificates on the masters.

1. Generate SSH keys for each of the master nodes by following the steps in the [create ssh access](#create-ssh-access) section. After doing this, each master will have an SSH key in `~/.ssh/id_rsa.pub` and an entry in `etcd0`'s `~/.ssh/authorized_keys` file.

1. Run the following:
-->
## 获取 etcd 证书

仅在您的 etcd 托管在专用节点上（**选项 1**）时执行下列步骤。如果您在 master 上（**选项 2**）托管 etcd，则可以跳过此步骤，因为您已经在 master 上生成了 etcd 证书。

1. 按照 [创建 ssh 访问](#创建-ssh-访问) 一节中的步骤为每个 master 节点生成 SSH 密钥。执行以后，每个 master 中的 `~/.ssh/id_rsa.pub` 下将生成一个 SSH 密钥，并且在 `etcd0` 的 `~/.ssh/authorized_keys` 文件中存在一条记录。

    ```shell
    mkdir -p /etc/kubernetes/pki/etcd
    scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/ca.pem /etc/kubernetes/pki/etcd
    scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/client.pem /etc/kubernetes/pki/etcd
    scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/client-key.pem /etc/kubernetes/pki/etcd
    ```

<!--
## Run `kubeadm init` on `master0` {#kubeadm-init-master0}

1. In order for kubeadm to run, you first need to write a configuration file:
-->
## 在 `master0` 上运行 `kubeadm init` 

1. 为了运行 kubeadm，首先需要编写一个配置文件：

    ```shell
    cat >config.yaml <<EOL
    apiVersion: kubeadm.k8s.io/v1alpha1
    kind: MasterConfiguration
    api:
      advertiseAddress: <private-ip>
    etcd:
      endpoints:
      - https://<etcd0-ip-address>:2379
      - https://<etcd1-ip-address>:2379
      - https://<etcd2-ip-address>:2379
      caFile: /etc/kubernetes/pki/etcd/ca.pem
      certFile: /etc/kubernetes/pki/etcd/client.pem
      keyFile: /etc/kubernetes/pki/etcd/client-key.pem
    networking:
      podSubnet: <podCIDR>
    apiServerCertSANs:
    - <load-balancer-ip>
    apiServerExtraArgs:
      apiserver-count: 3
    EOL
    ```

<!--
    Ensure that the following placeholders are replaced:

    - `<private-ip>` with the private IPv4 of the master server.
    - `<etcd0-ip>`, `<etcd1-ip>` and `<etcd2-ip>` with the IP addresses of your three etcd nodes
    - `<podCIDR>` with your Pod CIDR. Please read the [CNI network section](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/#pod-network) of the docs for more information. Some CNI providers do not require a value to be set.

    **Note:** If you are using Kubernetes 1.9+, you can replace the `apiserver-count: 3` extra argument with `endpoint-reconciler-type=lease`. For more information, see [the documentation](https://kubernetes.io/docs/admin/high-availability/#endpoint-reconciler).

1. When this is done, run kubeadm like so:
-->
    请确保替换了下列占位符：

    - `<private-ip>` 替换为 master 服务器的私有 IPv4 地址。
    - `<etcd0-ip>`、`<etcd1-ip>` 和 `<etcd2-ip>` 替换为三个 etcd 节点的地址。
    - `<podCIDR>` 替换为 Pod CIDR。请阅读 [CNI 网络小节](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/#pod-network) 文档以获取更多信息。某些 CNI provider 不需要设置。

    **注意：**如果您正在使用 Kubernetes 1.9+，您可以使用 `endpoint-reconciler-type=lease` 替换 `apiserver-count: 3` 附加参数。有关更多信息，请参阅 [文档](https://kubernetes.io/docs/admin/high-availability/#endpoint-reconciler)。

1. 完成后，像这样运行 kubeadm：

    ```shell
    kubeadm init --config=config.yaml
    ```

<!--
## Run `kubeadm init` on `master1` and `master2`

Before running kubeadm on the other masters, you need to first copy the K8s CA cert from `master0`. To do this, you have two options:

#### Option 1: Copy with scp

1. Follow the steps in the [create ssh access](#create-ssh-access) section, but instead of adding to `etcd0`'s `authorized_keys` file, add them to `master0`. 
1. Once you've done this, run:
-->
## 在 `master1` 和 `master2` 上运行 `kubeadm init`

在其余 master 上运行 kubeadm 之前，您首先需要从 `master0` 复制 K8s CA 证书。要做到这一点，您有两种选择：

#### 选项 1：使用 scp 复制

1. 按照 [创建 ssh 访问](#创建-ssh-访问) 部分中的步骤操作，但不添加到 `etcd0` 的 `authorized_keys` 文件，将它们 添加到 `master0` 中。
2. 完成后，请运行：

    ```shell
    scp root@<master0-ip-address>:/etc/kubernetes/pki/* /etc/kubernetes/pki
    rm apiserver.crt
    ```

<!--
#### Option 2: Copy paste

1. Copy the contents of `/etc/kubernetes/pki/ca.crt` and `/etc/kubernetes/pki/ca.key` and create these files manually on `master1` and `master2`.

When this is done, you can follow the [previous step](#kubeadm-init-master0) to install the control plane with kubeadm.
-->
#### 选项 2：复制粘贴

1. 复制 `/etc/kubernetes/pki/ca.crt` 和 `/etc/kubernetes/pki/ca.key` 的内容并在
`master1` 和 `master2` 上手动创建这些文件。

完成此操作后，可以参照 [上一步](#kubeadm-init-master0)，使用 kubeadm 安装控制平面。

<!--
## Add `master1` and `master2` to load balancer

Once kubeadm has provisioned the other masters, you can add them to the load balancer pool.

## Install CNI network

Follow the instructions [here](/docs/setup/independent/create-cluster-kubeadm/#pod-network) to install the pod network. Make sure this corresponds to whichever pod CIDR you provided in the master configuration file.
-->
## 将 `master1` 和 `master2` 添加到负载均衡器中

一旦 kubeadm 配置好了其它 master，您就可以将它们添加到负载均衡器中。

## 安装 CNI 网络

按照 [此处](/docs/setup/independent/create-cluster-kubeadm/#pod-network) 的说明安装 pod 网络。请确保这和您 master 配置文件中的任何 CIDR 都相匹配。

<!--
## Install workers

Next provision and set up the worker nodes. To do this, you will need to provision at least 3 Virtual Machines.

1. To configure the worker nodes, [follow the same steps](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/#44-joining-your-nodes) as non-HA workloads.
-->
## 安装工作节点

接下来创建并设置工作节点。为此，您需要配置至少 3 台虚拟机。

1. 要配置工作节点，请执行和非高可用工作负载 [相同的步骤](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/#44-joining-your-nodes)。

<!--
## Configure workers

1. Reconfigure kube-proxy to access kube-apiserver via the load balancer:
-->
## 配置工作节点

1. 重新配置 kube-proxy 以通过负载均衡器访问 kube-apiserver：

    ```shell
    kubectl get configmap -n kube-system kube-proxy -o yaml > kube-proxy.yaml
    sudo sed -i 's#server:.*#server: https://<masterLoadBalancerFQDN>:6443#g' kube-proxy.cm
    kubectl apply -f kube-proxy.cm --force
    # restart all kube-proxy pods to ensure that they load the new configmap
    kubectl delete pod -n kube-system -l k8s-app=kube-proxy
    ```

<!--
1. Reconfigure the kubelet to access kube-apiserver via the load balancer:
-->
1. 重新配置 kubelet 以通过负载均衡器访问 kube-apiserver：

    ```shell
    sudo sed -i 's#server:.*#server: https://<masterLoadBalancerFQDN>:6443#g' /etc/kubernetes/kubelet.conf
    sudo systemctl restart kubelet
    ```

{% endcapture %}

{% include templates/task.md %}
