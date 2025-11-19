---
title: 使用 kubeadm 創建一個高可用 etcd 叢集
content_type: task
weight: 70
---
<!--
reviewers:
- sig-cluster-lifecycle
title: Set up a High Availability etcd Cluster with kubeadm
content_type: task
weight: 70
-->

<!-- overview -->

<!--
By default, kubeadm runs a local etcd instance on each control plane node.
It is also possible to treat the etcd cluster as external and provision
etcd instances on separate hosts. The differences between the two approaches are covered in the
[Options for Highly Available topology](/docs/setup/production-environment/tools/kubeadm/ha-topology) page.
-->
默認情況下，kubeadm 在每個控制平面節點上運行一個本地 etcd 實例。也可以使用外部的 etcd 叢集，並在不同的主機上提供 etcd 實例。
這兩種方法的區別在[高可用拓撲的選項](/zh-cn/docs/setup/production-environment/tools/kubeadm/ha-topology)頁面中闡述。

<!--
This task walks through the process of creating a high availability external
etcd cluster of three members that can be used by kubeadm during cluster creation.
-->
這個任務將指導你創建一個由三個成員組成的高可用外部 etcd 叢集，該叢集在創建過程中可被 kubeadm 使用。

## {{% heading "prerequisites" %}}

<!--
- Three hosts that can talk to each other over TCP ports 2379 and 2380. This
  document assumes these default ports. However, they are configurable through
  the kubeadm config file.
-->
- 三個可以通過 2379 和 2380 端口相互通信的主機。本文檔使用這些作爲默認端口。
  不過，它們可以通過 kubeadm 的設定文件進行自定義。
<!--
- Each host must have systemd and a bash compatible shell installed.
- Each host must [have a container runtime, kubelet, and kubeadm installed](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
-->
- 每個主機必須安裝 systemd 和 bash 兼容的 shell。
- 每臺主機必須[安裝有容器運行時、kubelet 和 kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)。
<!--
- Each host should have access to the Kubernetes container image registry (`registry.k8s.io`) or list/pull the required etcd image using
  `kubeadm config images list/pull`. This guide will set up etcd instances as
  [static pods](/docs/tasks/configure-pod-container/static-pod/) managed by a kubelet.
-->
- 每個主機都應該能夠訪問 Kubernetes 容器映像檔倉庫 (registry.k8s.io)，
  或者使用 `kubeadm config images list/pull` 列出/拉取所需的 etcd 映像檔。
  本指南將把 etcd 實例設置爲由 kubelet 管理的[靜態 Pod](/zh-cn/docs/tasks/configure-pod-container/static-pod/)。
<!--
- Some infrastructure to copy files between hosts. For example `ssh` and `scp`
  can satisfy this requirement.
-->
- 一些可以用來在主機間複製文件的基礎設施。例如 `ssh` 和 `scp` 就可以滿足此需求。

<!-- steps -->

<!--
## Setting up the cluster
-->
## 建立叢集   {#setting-up-cluster}

<!--
The general approach is to generate all certs on one node and only distribute
the _necessary_ files to the other nodes.
-->
一般來說，是在一個節點上生成所有證書並且只分發這些**必要**的文件到其它節點上。

{{< note >}}
<!--
kubeadm contains all the necessary cryptographic machinery to generate
the certificates described below; no other cryptographic tooling is required for
this example.
-->
kubeadm 包含生成下述證書所需的所有必要的密碼學工具；在這個例子中，不需要其他加密工具。
{{< /note >}}

{{< note >}}
<!--
The examples below use IPv4 addresses but you can also configure kubeadm, the kubelet and etcd
to use IPv6 addresses. Dual-stack is supported by some Kubernetes options, but not by etcd. For more details
on Kubernetes dual-stack support see [Dual-stack support with kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/).
-->
下面的例子使用 IPv4 地址，但是你也可以使用 IPv6 地址設定 kubeadm、kubelet 和 etcd。
一些 Kubernetes 選項支持雙協議棧，但是 etcd 不支持。關於 Kubernetes 雙協議棧支持的更多細節，
請參見 [kubeadm 的雙棧支持](/zh-cn/docs/setup/production-environment/tools/kubeadm/dual-stack-support/)。
{{< /note >}}

<!--
1. Configure the kubelet to be a service manager for etcd.
-->
1. 將 kubelet 設定爲 etcd 的服務管理器。

   {{< note >}}
   <!--
   You must do this on every host where etcd should be running.
   -->
   你必須在要運行 etcd 的所有主機上執行此操作。
   {{< /note >}}

   <!--
   Since etcd was created first, you must override the service priority by creating a new unit file
   that has higher precedence than the kubeadm-provided kubelet unit file.
   -->
   由於 etcd 是首先創建的，因此你必須通過創建具有更高優先級的新文件來覆蓋
   kubeadm 提供的 kubelet 單元文件。

   <!--
   ```sh
   cat << EOF > /etc/systemd/system/kubelet.service.d/kubelet.conf
   # Replace "systemd" with the cgroup driver of your container runtime. The default value in the kubelet is "cgroupfs".
   # Replace the value of "containerRuntimeEndpoint" for a different container runtime if needed.
   ```
   -->
   
   ```sh
   cat << EOF > /etc/systemd/system/kubelet.service.d/kubelet.conf
   # 將下面的 "systemd" 替換爲你的容器運行時所使用的 cgroup 驅動。
   # kubelet 的默認值爲 "cgroupfs"。
   # 如果需要的話，將 "containerRuntimeEndpoint" 的值替換爲一個不同的容器運行時。
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
   檢查 kubelet 的狀態以確保其處於運行狀態：

   ```shell
   systemctl status kubelet
   ```

<!--
1. Create configuration files for kubeadm.

   Generate one kubeadm configuration file for each host that will have an etcd
   member running on it using the following script.
-->
2. 爲 kubeadm 創建設定文件。

   使用以下腳本爲每個將要運行 etcd 成員的主機生成一個 kubeadm 設定文件。

   <!--
   ```sh
   # Update HOST0, HOST1 and HOST2 with the IPs of your hosts
   export HOST0=10.0.0.6
   export HOST1=10.0.0.7
   export HOST2=10.0.0.8

   # Update NAME0, NAME1 and NAME2 with the hostnames of your hosts
   export NAME0="infra0"
   export NAME1="infra1"
   export NAME2="infra2"

   # Create temp directories to store files that will end up on other hosts
   mkdir -p /tmp/${HOST0}/ /tmp/${HOST1}/ /tmp/${HOST2}/
   -->

   ```sh
   # 使用你的主機 IP 更新 HOST0、HOST1 和 HOST2 的 IP 地址
   export HOST0=10.0.0.6
   export HOST1=10.0.0.7
   export HOST2=10.0.0.8

   # 使用你的主機名更新 NAME0、NAME1 和 NAME2
   export NAME0="infra0"
   export NAME1="infra1"
   export NAME2="infra2"

   # 創建臨時目錄來存儲將被分發到其它主機上的文件
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

   If you already have a CA then the only action that is copying the CA's `crt` and
   `key` file to `/etc/kubernetes/pki/etcd/ca.crt` and
   `/etc/kubernetes/pki/etcd/ca.key`. After those files have been copied,
   proceed to the next step, "Create certificates for each member".
-->
3. 生成證書頒發機構。

   如果你已經擁有 CA，那麼唯一的操作是複製 CA 的 `crt` 和 `key` 文件到
   `etc/kubernetes/pki/etcd/ca.crt` 和 `/etc/kubernetes/pki/etcd/ca.key`。
   複製完這些文件後繼續下一步，“爲每個成員創建證書”。

   <!--
   If you do not already have a CA then run this command on `$HOST0` (where you generated the configuration files for kubeadm).
   -->
   如果你還沒有 CA，則在 `$HOST0`（你爲 kubeadm 生成配置文件的位置）上運行此命令。

   ```shell
   kubeadm init phase certs etcd-ca
   ```

   <!--
   This creates two files:
   -->
   這一操作創建如下兩個文件：

   - `/etc/kubernetes/pki/etcd/ca.crt`
   - `/etc/kubernetes/pki/etcd/ca.key`

<!--
1. Create certificates for each member.
-->
4. 爲每個成員創建證書。

   <!--
   ```sh
   # cleanup non-reusable certificates
   # No need to move the certs because they are for HOST0
   # clean up certs that should not be copied off this host
   ```
   -->
   ```shell
   kubeadm init phase certs etcd-server --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST2}/
   # 清理不可重複使用的證書
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
   # 不需要移動 certs 因爲它們是給 HOST0 使用的

   # 清理不應從此主機複製的證書
   find /tmp/${HOST2} -name ca.key -type f -delete
   find /tmp/${HOST1} -name ca.key -type f -delete
   ```

<!--
1. Copy certificates and kubeadm configs.
   The certificates have been generated and now they must be moved to their
   respective hosts.
-->
5. 複製證書和 kubeadm 配置。

   證書已生成，現在必須將它們移動到對應的主機。

   ```shell
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

   The complete list of required files on `$HOST0` is:
-->
6. 確保已經所有預期的文件都存在

   `$HOST0` 所需文件的完整列表如下：

   ```none
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

   ```console
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

   ```console
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

   Now that the certificates and configs are in place it's time to create the
   manifests. On each host run the `kubeadm` command to generate a static manifest
   for etcd.
-->
7. 創建靜態 Pod 清單。

   既然證書和配置已經就緒，是時候去創建清單了。
   在每臺主機上運行 `kubeadm` 命令來生成 etcd 使用的靜態清單。

   ```shell
   root@HOST0 $ kubeadm init phase etcd local --config=/tmp/${HOST0}/kubeadmcfg.yaml
   root@HOST1 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   root@HOST2 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   ```

<!--
1. Optional: Check the cluster health.
-->
8. 可選：檢查集羣運行狀況。

   <!--
   If `etcdctl` isn't available, you can run this tool inside a container image.
   You would do that directly with your container runtime using a tool such as
   `crictl run` and not through Kubernetes
   -->
   如果 `etcdctl` 不可用，你可以在容器鏡像內運行此工具。
   你可以使用 `crictl run` 這類工具直接在容器運行時執行此操作，而不是通過 Kubernetes。

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
   - 將 `${HOST0}` 設置爲要測試的主機的 IP 地址。

## {{% heading "whatsnext" %}}

<!--
Once you have an etcd cluster with 3 working members, you can continue setting up a
highly available control plane using the
[external etcd method with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/).
-->
一旦擁有了一個正常工作的 3 成員的 etcd 叢集，
你就可以基於[使用 kubeadm 外部 etcd 的方法](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)，
繼續部署一個高可用的控制平面。
