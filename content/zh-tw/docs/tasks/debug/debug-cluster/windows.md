---
title: Windows 調試技巧
content_type: concept
---

<!--
reviewers:
- aravindhp
- jayunit100
- jsturtevant
- marosset
title: Windows debugging tips
content_type: concept
-->

<!-- overview -->

<!-- body -->

<!-- 
## Node-level troubleshooting {#troubleshooting-node}

1. My Pods are stuck at "Container Creating" or restarting over and over

   Ensure that your pause image is compatible with your Windows OS version.
   See [Pause container](/docs/concepts/windows/intro/#pause-container)
   to see the latest / recommended pause image and/or get more information.
-->
## 工作節點級別排障 {#troubleshooting-node}

1. 我的 Pod 都卡在 “Container Creating” 或者不斷重啓

   確保你的 pause 映像檔跟你的 Windows 版本兼容。
   查看 [Pause 容器](/zh-cn/docs/concepts/windows/intro/#pause-container)
   以瞭解最新的或建議的 pause 映像檔，或者瞭解更多資訊。

   {{< note >}}
   <!--
   If using containerd as your container runtime the pause image is specified in the
   `plugins.plugins.cri.sandbox_image` field of the of config.toml configuration file.
   -->
   如果你在使用 containerd 作爲你的容器運行時，那麼 pause 映像檔在 config.toml 設定檔案的
   `plugins.plugins.cri.sandbox_image` 中指定。
   {{< /note >}}

<!-- 
2. My pods show status as `ErrImgPull` or `ImagePullBackOff`

   Ensure that your Pod is getting scheduled to a
   [compatible](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility)
   Windows Node.

   More information on how to specify a compatible node for your Pod can be found in
   [this guide](/docs/concepts/windows/user-guide/#ensuring-os-specific-workloads-land-on-the-appropriate-container-host).
-->
2. 我的 Pod 狀態顯示 'ErrImgPull' 或者 'ImagePullBackOff'

   保證你的 Pod 被調度到[兼容的](https://docs.microsoft.com/zh-cn/virtualization/windowscontainers/deploy-containers/version-compatibility)
   Windows 節點上。

   關於如何爲你的 Pod 指定一個兼容節點，
   可以查看這個指可以查看[這個指南](/zh-cn/docs/concepts/windows/user-guide/#ensuring-os-specific-workloads-land-on-the-appropriate-container-host)
   以瞭解更多的資訊。

<!-- 
## Network troubleshooting {#troubleshooting-network}

1. My Windows Pods do not have network connectivity

   If you are using virtual machines, ensure that MAC spoofing is **enabled** on all
   the VM network adapter(s).
-->
## 網路排障 {#troubleshooting-network}

1. 我的 Windows Pod 沒有網路連接

   如果你使用的是虛擬機，請確保所有 VM 網卡上都已啓用 MAC spoofing。

<!-- 
1. My Windows Pods cannot ping external resources

   Windows Pods do not have outbound rules programmed for the ICMP protocol. However,
   TCP/UDP is supported. When trying to demonstrate connectivity to resources
   outside of the cluster, substitute `ping <IP>` with corresponding
   `curl <IP>` commands.
-->
2. 我的 Windows Pod 不能 ping 通外界資源

   Windows Pod 沒有爲 ICMP 協議編寫出站規則，但 TCP/UDP 是支持的。當試圖演示與叢集外部資源的連接時，
   可以把 `ping <IP>` 替換爲 `curl <IP>` 命令。

   <!--
   If you are still facing problems, most likely your network configuration in
   [cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf)
   deserves some extra attention. You can always edit this static file. The
   configuration update will apply to any new Kubernetes resources.
   -->
   如果你仍然遇到問題，很可能你需要額外關注
   [cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf)
   的設定。你可以隨時編輯這個靜態檔案。更新設定將應用於新的 Kubernetes 資源。

   <!--
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
   -->
   Kubernetes 的網路需求之一（查看 [Kubernetes 模型](/zh-cn/docs/concepts/cluster-administration/networking/)）
   是叢集通信不需要內部的 NAT。
   爲了遵守這一要求，對於你不希望發生的出站 NAT 通信，這裏有一個
   [ExceptionList](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf#L20)。
   然而，這也意味着你需要從 `ExceptionList` 中去掉你試圖查詢的外部 IP。
   只有這樣，來自你的 Windows Pod 的流量纔會被正確地 SNAT 轉換，以接收來自外部環境的響應。
   就此而言，你的 `cni.conf` 中的 `ExceptionList` 應該如下所示：

   <!--
   ```conf
   "ExceptionList": [
                   "10.244.0.0/16",  # Cluster subnet
                   "10.96.0.0/12",   # Service subnet
                   "10.127.130.0/24" # Management (host) subnet
               ]
   ```
   -->

   ```conf
   "ExceptionList": [
       "10.244.0.0/16",  # 集羣子網
       "10.96.0.0/12",   # 服務子網
       "10.127.130.0/24" # 管理（主機）子網
   ]
   ```
<!--  
1. My Windows node cannot access `NodePort` type Services

   Local NodePort access from the node itself fails. This is a known
   limitation. NodePort access works from other nodes or external clients.
-->
3. 我的 Windows 節點無法訪問 `NodePort` 類型 Service

   從節點本身訪問本地 NodePort 失敗，是一個已知的限制。
   你可以從其他節點或外部客戶端正常訪問 NodePort。

<!--
1. vNICs and HNS endpoints of containers are being deleted

   This issue can be caused when the `hostname-override` parameter is not passed to
   [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/). To resolve
   it, users need to pass the hostname to kube-proxy as follows:
-->
4. 容器的 vNIC 和 HNS 端點正在被刪除

   當 `hostname-override` 參數沒有傳遞給
   [kube-proxy](/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/)
   時可能引發這一問題。想要解決這個問題，使用者需要將主機名傳遞給 kube-proxy，如下所示：

   ```powershell
   C:\k\kube-proxy.exe --hostname-override=$(hostname)
   ```

<!-- 
1. My Windows node cannot access my services using the service IP

   This is a known limitation of the networking stack on Windows. However, Windows Pods can access the Service IP.
-->
5. 我的 Windows 節點無法通過服務 IP 訪問我的服務

   這是 Windows 上網路棧的一個已知限制。但是 Windows Pod 可以訪問 Service IP。

<!--
1. No network adapter is found when starting the kubelet

   The Windows networking stack needs a virtual adapter for Kubernetes networking to work.
   If the following commands return no results (in an admin shell),
   virtual network creation — a necessary prerequisite for the kubelet to work — has failed:
-->
6. 啓動 kubelet 時找不到網路適配器

   Windows 網路棧需要一個虛擬適配器才能使 Kubernetes 網路工作。
   如果以下命令沒有返回結果（在管理員模式的 shell 中），
   則意味着創建虛擬網路失敗，而虛擬網路的存在是 kubelet 正常工作的前提：

   ```powershell
   Get-HnsNetwork | ? Name -ieq "cbr0"
   Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
   ```

   <!--
   Often it is worthwhile to modify the [InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7) parameter of the start.ps1 script,
   in cases where the host's network adapter isn't "Ethernet".
   Otherwise, consult the output of the `start-kubelet.ps1` script to see if there are errors during virtual network creation.
   -->
   如果主機的網路適配器不是 "Ethernet"，通常有必要修改 `start.ps1` 腳本的
   [InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7)
   參數。否則，如果虛擬網路創建過程出錯，請檢查 `start-kubelet.ps1` 腳本的輸出。

<!--    
1. DNS resolution is not properly working

   Check the DNS limitations for Windows in this [section](/docs/concepts/services-networking/dns-pod-service/#dns-windows).
-->
7. DNS 解析工作異常

   查閱[這一節](/zh-cn/docs/concepts/services-networking/dns-pod-service/#dns-windows)瞭解 Windows 系統上的 DNS 限制。

<!--
1. `kubectl port-forward` fails with "unable to do port forwarding: wincat not found"

   This was implemented in Kubernetes 1.15 by including `wincat.exe` in the pause infrastructure container `mcr.microsoft.com/oss/kubernetes/pause:3.6`.
   Be sure to use a supported version of Kubernetes.
   If you would like to build your own pause infrastructure container be sure to include [wincat](https://github.com/kubernetes/kubernetes/tree/master/build/pause/windows/wincat).
-->
8. `kubectl port-forward` 失敗，錯誤爲 "unable to do port forwarding: wincat not found"

   在 Kubernetes 1.15 中，pause 基礎架構容器 `mcr.microsoft.com/oss/kubernetes/pause:3.6`
   中包含 `wincat.exe` 來實現端口轉發。
   請確保使用 Kubernetes 的受支持版本。如果你想構建自己的 pause 基礎架構容器，
   請確保其中包含 [wincat](https://github.com/kubernetes/kubernetes/tree/master/build/pause/windows/wincat)。

<!--   
1. My Kubernetes installation is failing because my Windows Server node is behind a proxy

   If you are behind a proxy, the following PowerShell environment variables must be defined:
-->
9. 我的 Kubernetes 安裝失敗，因爲我的 Windows 伺服器節點使用了代理伺服器

   如果使用了代理伺服器，必須定義下面的 PowerShell 環境變量：

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
-->
## Flannel 故障排查 {#troubleshooting-network}

1. 使用 Flannel 時，我的節點在重新加入叢集后出現問題

   當先前刪除的節點重新加入叢集時, flannelD 嘗試爲節點分配一個新的 Pod 子網。
   使用者應該在以下路徑中刪除舊的 Pod 子網設定檔案：

   ```powershell
   Remove-Item C:\k\SourceVip.json
   Remove-Item C:\k\SourceVipRequest.json
   ```

<!-- 
1. Flanneld is stuck in "Waiting for the Network to be created"

   There are numerous reports of this [issue](https://github.com/coreos/flannel/issues/1066);
   most likely it is a timing issue for when the management IP of the flannel network is set.
   A workaround is to relaunch `start.ps1` or relaunch it manually as follows:
-->
2. Flanneld 卡在 "Waiting for the Network to be created"

   關於這個[問題](https://github.com/coreos/flannel/issues/1066)有很多報告；
   很可能是 Flannel 網路管理 IP 的設置時機問題。
   一個變通方法是重新啓動 `start.ps1` 或按如下方式手動重啓：

   <!--
   ```powershell
   [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows_Worker_Hostname>")
   C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows_Worker_Node_IP> --ip-masq=1 --kube-subnet-mgr=1
   ```
   -->
   ```powershell
   [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows 工作節點主機名>")
   C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows 工作節點 IP> --ip-masq=1 --kube-subnet-mgr=1
   ```

<!-- 
1. My Windows Pods cannot launch because of missing `/run/flannel/subnet.env`

   This indicates that Flannel didn't launch correctly. You can either try
   to restart `flanneld.exe` or you can copy the files over manually from
   `/run/flannel/subnet.env` on the Kubernetes master to `C:\run\flannel\subnet.env`
   on the Windows worker node and modify the `FLANNEL_SUBNET` row to a different
   number. For example, if node subnet 10.244.4.1/24 is desired:
-->
3. 我的 Windows Pod 無法啓動，因爲缺少 `/run/flannel/subnet.env`

   這表明 Flannel 沒有正確啓動。你可以嘗試重啓 `flanneld.exe` 或者你可以將 Kubernetes 控制節點的
   `/run/flannel/subnet.env` 檔案手動拷貝到 Windows 工作節點上，放在 `C:\run\flannel\subnet.env`；
   並且將 `FLANNEL_SUBNET` 行修改爲不同取值。例如，如果期望節點子網爲 10.244.4.1/24：

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

如果這些步驟都不能解決你的問題，你可以通過以下方式獲得關於在 Kubernetes 中運行 Windows 容器的幫助：

* StackOverflow [Windows Server Container](https://stackoverflow.com/questions/tagged/windows-server-container) topic
* Kubernetes 官方論壇 [discuss.kubernetes.io](https://discuss.kubernetes.io/)
* Kubernetes Slack [#SIG-Windows Channel](https://kubernetes.slack.com/messages/sig-windows)

