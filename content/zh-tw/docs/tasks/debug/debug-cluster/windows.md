---
title: Windows 除錯小技巧
content_type: concept
---
<!--
title: Windows debugging tips
content_type: concept
-->
<!-- overview -->

<!-- body -->
<!-- 
## Node-level troubleshooting {#troubleshooting-node}

1. My Pods are stuck at "Container Creating" or restarting over and over

   Ensure that your pause image is compatible with your Windows OS version.
   See [Pause container](/docs/setup/production-environment/windows/intro-windows-in-kubernetes#pause-container)
   to see the latest / recommended pause image and/or get more information.

   {{< note >}}
   If using containerd as your container runtime the pause image is specified in the
   `plugins.plugins.cri.sandbox_image` field of the of config.toml configration file.
   {{< /note >}}
-->
## 工作節點級別排障 {#troubleshooting-node}

1. 我的 Pod 都卡在 “Container Creating” 或者不斷重啟

   確保你的 pause 映象跟你的 Windows 版本相容。
   檢視 [Pause 容器](zh/docs/setup/production-environment/windows/intro-windows-in-kubernetes#pause-container)
   以瞭解最新的或建議的 pause 映象，或者瞭解更多資訊。

   {{< note >}}
   如果你使用了 containerd 作為你的容器執行時，pause 映象在 config.toml 配置檔案的
   `plugins.plugins.cri.sandbox_image` 中指定。
   {{< /note >}}
<!-- 
2. My pods show status as `ErrImgPull` or `ImagePullBackOff`

   Ensure that your Pod is getting scheduled to a [compatable](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility) Windows Node.

   More information on how to specify a compatable node for your Pod can be found in [this guide](/docs/setup/production-environment/windows/user-guide-windows-containers/#ensuring-os-specific-workloads-land-on-the-appropriate-container-host).
-->
2. 我的 pod 狀態顯示 'ErrImgPull' 或者 ‘ImagePullBackOff’

   保證你的 Pod 被排程到[相容的](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility) Windows 節點上。

   關於如何為你的 Pod 指定一個相容節點，
   的更多資訊可以檢視這個指可以檢視[這個指南](/zh-cn/docs/setup/production-environment/windows/user-guide-windows-containers/#ensuring-os-specific-workloads-land-on-the-appropriate-container-host)以瞭解更多的資訊。
<!-- 
## Network troubleshooting {#troubleshooting-network}

1. My Windows Pods do not have network connectivity

   If you are using virtual machines, ensure that MAC spoofing is **enabled** on all
   the VM network adapter(s).
-->
## 網路排障 {#troubleshooting-network}

1. 我的 Windows Pod 沒有網路連線

   如果你使用的是虛擬機器，請確保所有 VM 網絡卡上都已啟用 MAC spoofing。
<!-- 
2. My Windows Pods cannot ping external resources

   Windows Pods do not have outbound rules programmed for the ICMP protocol. However,
   TCP/UDP is supported. When trying to demonstrate connectivity to resources
   outside of the cluster, substitute `ping <IP>` with corresponding
   `curl <IP>` commands.

   If you are still facing problems, most likely your network configuration in
   [cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf)
   deserves some extra attention. You can always edit this static file. The
   configuration update will apply to any new Kubernetes resources.

   One of the Kubernetes networking requirements
   (see [Kubernetes model](/docs/concepts/cluster-administration/networking/)) is
   for cluster communication to occur without
   NAT internally. To honor this requirement, there is an
   [ExceptionList](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf#L20)
   for all the communication where you do not want outbound NAT to occur. However,
   this also means that you need to exclude the external IP you are trying to query
   from the `ExceptionList`. Only then will the traffic originating from your Windows
   pods be SNAT'ed correctly to receive a response from the outside world. In this
   regard, your `ExceptionList` in `cni.conf` should look as follows:

   ```conf
   "ExceptionList": [
                   "10.244.0.0/16",  # Cluster subnet
                   "10.96.0.0/12",   # Service subnet
                   "10.127.130.0/24" # Management (host) subnet
               ]
   ```
-->
2. 我的 Windows Pod 不能 ping 通外界資源

   Windows Pod 沒有為 ICMP 協議編寫出站規則，但 TCP/UDP 是支援的。當試圖演示與叢集外部資源的連線時，可以把 `ping <IP>` 替換為 `curl <IP>` 命令。

   如果你仍然遇到問題，很可能你需要額外關注
   [cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf)
   的配置。你可以隨時編輯這個靜態檔案。更新配置將應用於新的 Kubernetes 資源。

   Kubernetes 的網路需求之一 (檢視 [Kubernetes 模型](/zh-cn/docs/concepts/cluster-administration/networking/)) 
   是叢集通訊不需要內部的 NAT。
   為了遵守這一要求， 對於你不希望發生的出站 NAT 通訊，這裡有一個
   [ExceptionList](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf#L20) 。
   然而，這也意味著你需要從 `ExceptionList` 中去掉你試圖查詢的外部IP。
   只有這樣，來自你的 Windows Pod 的流量才會被正確地 SNAT 轉換，以接收來自外部環境的響應。
   就此而言，你的 `cni.conf` 中的 `ExceptionList` 應該如下所示：

   ```conf
   "ExceptionList": [
                   "10.244.0.0/16",  # Cluster subnet
                   "10.96.0.0/12",   # Service subnet
                   "10.127.130.0/24" # Management (host) subnet
               ]
   ```
<!--  
3. My Windows node cannot access `NodePort` type Services

   Local NodePort access from the node itself fails. This is a known
   limitation. NodePort access works from other nodes or external clients.

4. vNICs and HNS endpoints of containers are being deleted

   This issue can be caused when the `hostname-override` parameter is not passed to
   [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/). To resolve
   it, users need to pass the hostname to kube-proxy as follows:

   ```powershell
   C:\k\kube-proxy.exe --hostname-override=$(hostname)
   ```
-->
3. 我的 Windows 節點無法訪問 `NodePort` 型別服務

   從節點本身訪問本地 NodePort 失敗，是一個已知的限制。你可以從其他節點或外部客戶端正常訪問 NodePort。

4. 容器的 vnic 和 HNS endpoints 正在被刪除

   當 `hostname-override` 引數沒有傳遞給 [kube-proxy](/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/)
   時可能引發這一問題。想要解決這個問題，使用者需要將主機名傳遞給 kube-proxy，如下所示：

   ```powershell
   C:\k\kube-proxy.exe --hostname-override=$(hostname)
   ```
<!-- 
5. My Windows node cannot access my services using the service IP

   This is a known limitation of the networking stack on Windows. However, Windows Pods can access the Service IP.

6. No network adapter is found when starting the kubelet

   The Windows networking stack needs a virtual adapter for Kubernetes networking to work.
   If the following commands return no results (in an admin shell),
   virtual network creation — a necessary prerequisite for the kubelet to work — has failed:

   ```powershell
   Get-HnsNetwork | ? Name -ieq "cbr0"
   Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
   ```

   Often it is worthwhile to modify the [InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7) parameter of the start.ps1 script,
   in cases where the host's network adapter isn't "Ethernet".
   Otherwise, consult the output of the `start-kubelet.ps1` script to see if there are errors during virtual network creation.
-->
5. 我的 Windows 節點無法透過服務 IP 訪問我的服務

   這是 Windows 上網路棧的一個已知限制。但是 Windows Pod 可以訪問 Service IP。

6. 啟動 kubelet 時找不到網路介面卡

   Windows 網路棧需要一個虛擬介面卡才能使 Kubernetes 網路工作。
   如果以下命令沒有返回結果（在管理員模式的 shell 中），
   則意味著建立虛擬網路失敗，而虛擬網路的存在是 kubelet 正常工作前提：

   ```powershell
   Get-HnsNetwork | ? Name -ieq "cbr0"
   Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
   ```

   如果主機的網路介面卡不是 "Ethernet"，通常有必要修改 `start.ps1` 指令碼的
   [InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7) 引數。
   否則，如果虛擬網路建立過程出錯，請檢查 `start-kubelet.ps1` 指令碼的輸出。
<!--    
7. DNS resolution is not properly working

   Check the DNS limitations for Windows in this [section](#dns-limitations).

8. `kubectl port-forward` fails with "unable to do port forwarding: wincat not found"

   This was implemented in Kubernetes 1.15 by including `wincat.exe` in the pause infrastructure container `mcr.microsoft.com/oss/kubernetes/pause:3.6`.
   Be sure to use a supported version of Kubernetes.
   If you would like to build your own pause infrastructure container be sure to include [wincat](https://github.com/kubernetes/kubernetes/tree/master/build/pause/windows/wincat).
-->
7. DNS 解析工作異常

   在[本節](#dns-limitations)中瞭解 Windows 系統上的 DNS 限制。

8. `kubectl port-forward` 失敗，錯誤為 "unable to do port forwarding: wincat not found"

   在 Kubernetes 1.15 中，pause 基礎架構容器 `mcr.microsoft.com/oss/kubernetes/pause:3.6`
   中包含 `wincat.exe` 來實現埠轉發。
   請確保使用 Kubernetes 的受支援版本。如果你想構建自己的 pause 基礎架構容器，
   請確保其中包含 [wincat](https://github.com/kubernetes/kubernetes/tree/master/build/pause/windows/wincat)。
<!--   
9. My Kubernetes installation is failing because my Windows Server node is behind a proxy

   If you are behind a proxy, the following PowerShell environment variables must be defined:

   ```PowerShell
   [Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://proxy.example.com:80/", [EnvironmentVariableTarget]::Machine)
   [Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://proxy.example.com:443/", [EnvironmentVariableTarget]::Machine)
   ```
-->
9. 我的 Kubernetes 安裝失敗，因為我的 Windows 伺服器節點使用了代理伺服器

   如果使用了代理伺服器，必須定義下面的 PowerShell 環境變數：

   ```PowerShell
   [Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://proxy.example.com:80/", [EnvironmentVariableTarget]::Machine)
   [Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://proxy.example.com:443/", [EnvironmentVariableTarget]::Machine)
   ```
<!-- 
### Flannel troubleshooting

1. With Flannel, my nodes are having issues after rejoining a cluster

   Whenever a previously deleted node is being re-joined to the cluster, flannelD
   tries to assign a new pod subnet to the node. Users should remove the old pod
   subnet configuration files in the following paths:

   ```powershell
   Remove-Item C:\k\SourceVip.json
   Remove-Item C:\k\SourceVipRequest.json
   ```
-->
## Flannel 故障排查 {#troubleshooting-network}

1. 使用 Flannel 時，我的節點在重新加入集群后出現問題

   當先前刪除的節點重新加入叢集時, flannelD 嘗試為節點分配一個新的 Pod 子網。
   使用者應該在以下路徑中刪除舊的 Pod 子網配置檔案：

   ```powershell
   Remove-Item C:\k\SourceVip.json
   Remove-Item C:\k\SourceVipRequest.json
   ```
<!-- 
2. Flanneld is stuck in "Waiting for the Network to be created"

   There are numerous reports of this [issue](https://github.com/coreos/flannel/issues/1066);
   most likely it is a timing issue for when the management IP of the flannel network is set.
   A workaround is to relaunch `start.ps1` or relaunch it manually as follows:

   ```powershell
   [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows_Worker_Hostname>")
   C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows_Worker_Node_IP> --ip-masq=1 --kube-subnet-mgr=1
   ```
-->
2. Flanneld 卡在 "Waiting for the Network to be created"

   關於這個[問題](https://github.com/coreos/flannel/issues/1066)有很多報告 ；
   很可能是 flannel 網路管理 IP 的設定時機問題。
   一個變通方法是重新啟動 `start.ps1` 或按如下方式手動重啟：

   ```powershell
   [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows 工作節點主機名>")
   C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows 工作節點 IP> --ip-masq=1 --kube-subnet-mgr=1
   ```
<!-- 
3. My Windows Pods cannot launch because of missing `/run/flannel/subnet.env`

   This indicates that Flannel didn't launch correctly. You can either try
   to restart `flanneld.exe` or you can copy the files over manually from
   `/run/flannel/subnet.env` on the Kubernetes master to `C:\run\flannel\subnet.env`
   on the Windows worker node and modify the `FLANNEL_SUBNET` row to a different
   number. For example, if node subnet 10.244.4.1/24 is desired:

   ```env
   FLANNEL_NETWORK=10.244.0.0/16
   FLANNEL_SUBNET=10.244.4.1/24
   FLANNEL_MTU=1500
   FLANNEL_IPMASQ=true
   ```
-->
3. 我的 Windows Pod 無法啟動，因為缺少 `/run/flannel/subnet.env`

   這表明 Flannel 沒有正確啟動。你可以嘗試重啟`flanneld.exe` 或者你可以將 Kubernetes 控制節點的
   `/run/flannel/subnet.env` 檔案手動複製到 Windows 工作節點上，放在 `C:\run\flannel\subnet.env`；
   並且將 `FLANNEL_SUBNET` 行修改為不同取值。例如，如果期望節點子網為 10.244.4.1/24：

   ```env
   FLANNEL_NETWORK=10.244.0.0/16
   FLANNEL_SUBNET=10.244.4.1/24
   FLANNEL_MTU=1500
   FLANNEL_IPMASQ=true
   ```
<!-- 
### Further investigation

If these steps don't resolve your problem, you can get help running Windows containers on Windows nodes in Kubernetes through:

* StackOverflow [Windows Server Container](https://stackoverflow.com/questions/tagged/windows-server-container) topic
* Kubernetes Official Forum [discuss.kubernetes.io](https://discuss.kubernetes.io/)
* Kubernetes Slack [#SIG-Windows Channel](https://kubernetes.slack.com/messages/sig-windows)
-->
### 進一步探查   {#further-investigation}

如果這些步驟都不能解決你的問題，你可以透過以下方式獲得關於在 Kubernetes 中執行 Windows 容器的幫助：

* StackOverflow [Windows Server Container](https://stackoverflow.com/questions/tagged/windows-server-container) topic
* Kubernetes 官方論壇 [discuss.kubernetes.io](https://discuss.kubernetes.io/)
* Kubernetes Slack [#SIG-Windows Channel](https://kubernetes.slack.com/messages/sig-windows)
