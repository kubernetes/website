---
title: 使用 kubeadm 建立高可用 etcd 叢集
content_type: task
weight: 70
---
<!--
---
title: Set up a High Availability etcd Cluster with kubeadm
content_type: task
weight: 70
---
-->

<!-- overview -->

<!--
By default, kubeadm runs a local etcd instance on each control plane node.
It is also possible to treat the etcd cluster as external and provision
etcd instances on separate hosts. The differences between the two approaches are covered in the
[Options for Highly Available topology](/docs/setup/production-environment/tools/kubeadm/ha-topology) page.
-->
預設情況下，kubeadm 會在每個控制平面節點上執行一個本機 etcd 執行個體。
您也可以將 etcd 叢集視為外部叢集，並在各自獨立的主機上佈建 etcd 執行個體。
這兩種做法的差異詳見[高可用拓撲選項](/docs/setup/production-environment/tools/kubeadm/ha-topology)頁面。

<!--
This task walks through the process of creating a high availability external
etcd cluster of three members that can be used by kubeadm during cluster creation.
-->
本任務將逐步說明如何建立一個由三個成員組成的高可用外部 etcd 叢集，供 kubeadm 在建立叢集時使用。

## {{% heading "prerequisites" %}}

<!--
- Three hosts that can talk to each other over TCP ports 2379 and 2380. This
  document assumes these default ports. However, they are configurable through
  the kubeadm config file.
- Each host must have systemd and a bash compatible shell installed.
- Each host must [have a container runtime, kubelet, and kubeadm installed](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
- Each host should have access to the Kubernetes container image registry (`registry.k8s.io`) or list/pull the required etcd image using
  `kubeadm config images list/pull`. This guide will set up etcd instances as
  [static pods](/docs/tasks/configure-pod-container/static-pod/) managed by a kubelet.
- Some infrastructure to copy files between hosts. For example `ssh` and `scp`
  can satisfy this requirement.
-->
- 三台能透過 TCP 連接埠 2379 與 2380 相互通訊的主機。本文件假設使用這些預設連接埠，
  不過這些連接埠可透過 kubeadm 設定檔調整。
- 每台主機都必須安裝 systemd 以及相容於 bash 的 shell。
- 每台主機都必須[安裝容器執行階段、kubelet 與 kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)。
- 每台主機都應能存取 Kubernetes 容器映像檔儲存庫（`registry.k8s.io`），或使用
  `kubeadm config images list/pull` 列出／拉取所需的 etcd 映像檔。本指南會將 etcd 執行個體設定為
  由 kubelet 管理的[靜態 Pod](/docs/tasks/configure-pod-container/static-pod/)。
- 一些用於在主機之間複製檔案的基礎設施，例如 `ssh` 與 `scp` 即可滿足此需求。

<!-- steps -->

<!--
## Setting up the cluster
-->
## 設定叢集 {#setting-up-the-cluster}

<!--
The general approach is to generate all certs on one node and only distribute
the _necessary_ files to the other nodes.
-->
一般做法是在某一個節點上產生所有憑證，並只將_必要_的檔案分發到其他節點。

{{< note >}}
<!--
kubeadm contains all the necessary cryptographic machinery to generate
the certificates described below; no other cryptographic tooling is required for
this example.
-->
kubeadm 包含產生下述憑證所需的所有加密機制；本範例不需要其他加密工具。
{{< /note >}}

{{< note >}}
<!--
The examples below use IPv4 addresses but you can also configure kubeadm, the kubelet and etcd
to use IPv6 addresses. Dual-stack is supported by some Kubernetes options, but not by etcd. For more details
on Kubernetes dual-stack support see [Dual-stack support with kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/).
-->
以下範例使用 IPv4 位址，但您也可以將 kubeadm、kubelet 與 etcd 設定為使用 IPv6 位址。
部分 Kubernetes 選項支援雙堆疊（dual-stack），但 etcd 並不支援。關於 Kubernetes 雙堆疊支援的更多細節，
請參閱[使用 kubeadm 的雙堆疊支援](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/)。
{{< /note >}}

<!--
1. Configure the kubelet to be a service manager for etcd.
-->
1. 將 kubelet 設定為 etcd 的服務管理器。

   {{< note >}}
   <!--
   You must do this on every host where etcd should be running.
   -->
   您必須在每一台要執行 etcd 的主機上進行此設定。
   {{< /note >}}
   <!--
   Since etcd was created first, you must override the service priority by creating a new unit file
   that has higher precedence than the kubeadm-provided kubelet unit file.
   -->
   由於 etcd 會先建立，您必須建立一個新的 unit 檔，使其優先序高於 kubeadm 所提供的 kubelet unit 檔，
   藉此覆寫服務的優先順序。

   ```sh
   cat << EOF > /etc/systemd/system/kubelet.service.d/kubelet.conf
   # 將 "systemd" 替換為您的容器執行階段所使用的 cgroup 驅動程式。kubelet 的預設值為 "cgroupfs"。
   # 如有需要，請將 "containerRuntimeEndpoint" 的值替換為其他容器執行階段。
   #
   apiVersion: kubelet.config.k8s.io/v1beta1
   kind: KubeletConfiguration
   authentication:
     anonymous:
       enabled: false
     webhook:
       enabled: false
   authorization:
     mode: AlwaysAllow
   cgroupDriver: systemd
   address: 127.0.0.1
   containerRuntimeEndpoint: unix:///var/run/containerd/containerd.sock
   staticPodPath: /etc/kubernetes/manifests
   EOF

   cat << EOF > /etc/systemd/system/kubelet.service.d/20-etcd-service-manager.conf
   [Service]
   ExecStart=
   ExecStart=/usr/bin/kubelet --config=/etc/systemd/system/kubelet.service.d/kubelet.conf
   Restart=always
   EOF

   systemctl daemon-reload
   systemctl restart kubelet
   ```

   <!--
   Check the kubelet status to ensure it is running.
   -->
   檢查 kubelet 狀態以確認它正在執行。

   ```sh
   systemctl status kubelet
   ```

<!--
1. Create configuration files for kubeadm.
-->
1. 為 kubeadm 建立設定檔。

   <!--
   Generate one kubeadm configuration file for each host that will have an etcd
   member running on it using the following script.
   -->
   使用以下指令稿，為每一台將執行 etcd 成員的主機產生一份 kubeadm 設定檔。

   ```sh
   # 將 HOST0、HOST1 與 HOST2 更新為您各主機的 IP
   export HOST0=10.0.0.6
   export HOST1=10.0.0.7
   export HOST2=10.0.0.8

   # 將 NAME0、NAME1 與 NAME2 更新為您各主機的主機名稱
   export NAME0="infra0"
   export NAME1="infra1"
   export NAME2="infra2"

   # 建立暫存目錄，存放之後要複製到其他主機的檔案
   mkdir -p /tmp/${HOST0}/ /tmp/${HOST1}/ /tmp/${HOST2}/

   HOSTS=(${HOST0} ${HOST1} ${HOST2})
   NAMES=(${NAME0} ${NAME1} ${NAME2})

   for i in "${!HOSTS[@]}"; do
   HOST=${HOSTS[$i]}
   NAME=${NAMES[$i]}
   cat << EOF > /tmp/${HOST}/kubeadmcfg.yaml
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: InitConfiguration
   nodeRegistration:
       name: ${NAME}
   localAPIEndpoint:
       advertiseAddress: ${HOST}
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: ClusterConfiguration
   etcd:
       local:
           serverCertSANs:
           - "${HOST}"
           peerCertSANs:
           - "${HOST}"
           extraArgs:
           - name: initial-cluster
             value: ${NAMES[0]}=https://${HOSTS[0]}:2380,${NAMES[1]}=https://${HOSTS[1]}:2380,${NAMES[2]}=https://${HOSTS[2]}:2380
           - name: initial-cluster-state
             value: new
           - name: name
             value: ${NAME}
           - name: listen-peer-urls
             value: https://${HOST}:2380
           - name: listen-client-urls
             value: https://${HOST}:2379
           - name: advertise-client-urls
             value: https://${HOST}:2379
           - name: initial-advertise-peer-urls
             value: https://${HOST}:2380
   EOF
   done
   ```

<!--
1. Generate the certificate authority.
-->
1. 產生憑證授權機構（CA）。

   <!--
   If you already have a CA then the only action that is copying the CA's `crt` and
   `key` file to `/etc/kubernetes/pki/etcd/ca.crt` and
   `/etc/kubernetes/pki/etcd/ca.key`. After those files have been copied,
   proceed to the next step, "Create certificates for each member".
   -->
   如果您已經有 CA，那麼唯一要做的就是將 CA 的 `crt` 與 `key` 檔複製到
   `/etc/kubernetes/pki/etcd/ca.crt` 與 `/etc/kubernetes/pki/etcd/ca.key`。
   複製完這些檔案後，請繼續下一步「為每個成員建立憑證」。

   <!--
   If you do not already have a CA then run this command on `$HOST0` (where you
   generated the configuration files for kubeadm).
   -->
   如果您還沒有 CA，請在 `$HOST0`（也就是您為 kubeadm 產生設定檔的主機）上執行此指令。

   ```
   kubeadm init phase certs etcd-ca
   ```

   <!--
   This creates two files:
   -->
   這會建立兩個檔案：

   - `/etc/kubernetes/pki/etcd/ca.crt`
   - `/etc/kubernetes/pki/etcd/ca.key`

<!--
1. Create certificates for each member.
-->
1. 為每個成員建立憑證。

   ```sh
   kubeadm init phase certs etcd-server --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST2}/
   # 清除不可重複使用的憑證
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST1}/
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   # 無需移動憑證，因為它們本來就屬於 HOST0

   # 清除不應從這台主機複製出去的憑證
   find /tmp/${HOST2} -name ca.key -type f -delete
   find /tmp/${HOST1} -name ca.key -type f -delete
   ```

<!--
1. Copy certificates and kubeadm configs.
-->
1. 複製憑證與 kubeadm 設定檔。

   <!--
   The certificates have been generated and now they must be moved to their
   respective hosts.
   -->
   憑證已經產生，現在必須將它們移動到各自對應的主機上。

   ```sh
   USER=ubuntu
   HOST=${HOST1}
   scp -r /tmp/${HOST}/* ${USER}@${HOST}:
   ssh ${USER}@${HOST}
   USER@HOST $ sudo -Es
   root@HOST $ chown -R root:root pki
   root@HOST $ mv pki /etc/kubernetes/
   ```

<!--
1. Ensure all expected files exist.
-->
1. 確認所有預期的檔案皆存在。

   <!--
   The complete list of required files on `$HOST0` is:
   -->
   `$HOST0` 上所需的完整檔案清單如下：

   ```
   /tmp/${HOST0}
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── ca.key
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   <!--
   On `$HOST1`:
   -->
   在 `$HOST1` 上：

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   <!--
   On `$HOST2`:
   -->
   在 `$HOST2` 上：

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

<!--
1. Create the static pod manifests.
-->
1. 建立靜態 Pod 設定檔。

   <!--
   Now that the certificates and configs are in place it's time to create the
   manifests. On each host run the `kubeadm` command to generate a static manifest
   for etcd.
   -->
   憑證與 kubeadm 設定檔都就緒後，接著就要建立靜態 Pod 設定檔。在每一台主機上執行 `kubeadm` 指令，
   為 etcd 產生靜態設定檔。

   ```sh
   root@HOST0 $ kubeadm init phase etcd local --config=/tmp/${HOST0}/kubeadmcfg.yaml
   root@HOST1 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   root@HOST2 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   ```

<!--
1. Optional: Check the cluster health.
-->
1. 選用：檢查叢集健康狀態。

    <!--
    If `etcdctl` isn't available, you can run this tool inside a container image.
    You would do that directly with your container runtime using a tool such as
    `crictl run` and not through Kubernetes
    -->
    如果無法使用 `etcdctl`，您可以在容器映像檔內執行此工具。
    此時應直接透過容器執行階段（例如 `crictl run` 這類工具）來執行，而非透過 Kubernetes。

    ```sh
    ETCDCTL_API=3 etcdctl \
    --cert /etc/kubernetes/pki/etcd/peer.crt \
    --key /etc/kubernetes/pki/etcd/peer.key \
    --cacert /etc/kubernetes/pki/etcd/ca.crt \
    --endpoints https://${HOST0}:2379 endpoint health
    ...
    https://[HOST0 IP]:2379 is healthy: successfully committed proposal: took = 16.283339ms
    https://[HOST1 IP]:2379 is healthy: successfully committed proposal: took = 19.44402ms
    https://[HOST2 IP]:2379 is healthy: successfully committed proposal: took = 35.926451ms
    ```

    <!--
    - Set `${HOST0}`to the IP address of the host you are testing.
    -->
    - 將 `${HOST0}` 設定為您正在測試的主機的 IP 位址。

## {{% heading "whatsnext" %}}

<!--
Once you have an etcd cluster with 3 working members, you can continue setting up a
highly available control plane using the
[external etcd method with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/).
-->
當您擁有一個具備 3 個正常運作成員的 etcd 叢集後，
就可以繼續使用 [kubeadm 的外部 etcd 方法](/docs/setup/production-environment/tools/kubeadm/high-availability/)
建立高可用的控制平面。
