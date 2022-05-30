---
title: Windows 调试小技巧
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
   See [Pause container](/docs/setup/production-environment/windows/intro-windows-in-kubernetes#pause-container)
   to see the latest / recommended pause image and/or get more information.

   If using containerd as your container runtime the pause image is specified in the
   `plugins.plugins.cri.sandbox_image` field of the of config.toml configration file.
-->
## 节点级故障排查 {#troubleshooting-node}

1. 我的 Pod 卡在了 “Container Creating” 或反复重启
   
   确保你的 pause 镜像与你的 Windows 操作系统版本兼容。
   参见 [Pause 容器](/zh/docs/setup/production-environment/windows/intro-windows-in-kubernetes#pause-container)以查看最新的或推荐的 pause 镜像，并/或获取更多信息。
   
   {{< note >}}
   如果使用 containerd 作为你的容器运行时，pause 镜像将在 config.toml 配置文件的
   `plugins.plugins.cri.sandbox_image` 字段中指定。
   {{< /note >}}
<!--
1. My pods show status as `ErrImgPull` or `ImagePullBackOff`

   Ensure that your Pod is getting scheduled to a [compatable](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility) Windows Node.

   More information on how to specify a compatable node for your Pod can be found in [this guide](/docs/setup/production-environment/windows/user-guide-windows-containers/#ensuring-os-specific-workloads-land-on-the-appropriate-container-host).
-->
2. 我的 Pod 显示状态为 `ErrImgPull` 或 `ImagePullBackOff`
   
   确保你的 Pod 正调度到一个[兼容的](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility) Windows 节点。
   
   有关如何为你的 Pod 指定兼容节点的更多信息，请参考[这个指南](/zh/docs/setup/production-environment/windows/user-guide-windows-containers/#ensuring-os-specific-workloads-land-on-the-appropriate-container-host)。
<!--
## Network troubleshooting {#troubleshooting-network}

1. My Windows Pods do not have network connectivity

   If you are using virtual machines, ensure that MAC spoofing is **enabled** on all
   the VM network adapter(s).
-->
## 网络故障排查 {#troubleshooting-network}

1. 我的 Windows Pod 没有网络连接
   
   如果你正在使用虚拟机，请确保在所有虚拟机网络适配器上**启用** MAC spoofing。
<!--
1. My Windows Pods cannot ping external resources
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
-->
2. 我的 Windows Pod 无法 ping 通外部资源
   
   Windows Pod 没有为 ICMP 协议编写出站规则，但支持 TCP/UDP。
   当尝试演示与集群外部资源的连接时，将 `ping <IP>` 替换为对应的 `curl <IP>` 命令。
   
   如果你仍然遇到问题，很可能需要额外关注 [cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf) 中的网络配置。
   你可以随时编辑这个静态文件。
   更新配置将应用到所有新的 Kubernetes 资源。
   
   Kubernetes 联网的其中一个要求（参见 [Kubernetes 模型](/zh/docs/concepts/cluster-administration/networking/)）是集群通信无需内部 NAT。
   为了满足此要求，对于你不希望发生出站 NAT 的所有通信，都会有一个 [ExceptionList](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf#L20)。
   然而这意味着你需要排除正尝试从 `ExceptionList` 查询的外部 IP。
   只有这样，源自 Windows Pod 的流量才能被正确 SNAT，以接收外界的响应。
   就此而言，`cni.conf` 中的 `ExceptionList` 应如下所示：
   
   ```conf
   "ExceptionList": [
                   "10.244.0.0/16",  # Cluster subnet
                   "10.96.0.0/12",   # Service subnet
                   "10.127.130.0/24" # Management (host) subnet
               ]
   ```
<!--
1. My Windows node cannot access `NodePort` type Services
   Local NodePort access from the node itself fails. This is a known
   limitation. NodePort access works from other nodes or external clients.

1. vNICs and HNS endpoints of containers are being deleted
   This issue can be caused when the `hostname-override` parameter is not passed to
   [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/). To resolve
   it, users need to pass the hostname to kube-proxy as follows:
-->
3. 我的 Windows 节点无法访问 `NodePort` 类别的 Service
   
   从节点本身访问本地 NodePort 失败。
   这是一个已知的限制。
   只能从其他节点或外部客户端访问 NodePort。

4. 容器的 vNIC 和 HNS 端点正在被删除
   
   当 `hostname-override` 参数未传递到 [kube-proxy](/zh/docs/reference/command-line-tools-reference/kube-proxy/) 时可能引起这个问题。
   要解决这个问题，用户需要运行以下命令将 hostname 传递到 kube-proxy：
   
   ```powershell
   C:\k\kube-proxy.exe --hostname-override=$(hostname)
   ```
<!--
1. My Windows node cannot access my services using the service IP
   This is a known limitation of the networking stack on Windows. However, Windows Pods can access the Service IP.

1. No network adapter is found when starting the kubelet
   The Windows networking stack needs a virtual adapter for Kubernetes networking to work.
   If the following commands return no results (in an admin shell),
   virtual network creation — a necessary prerequisite for the kubelet to work — has failed:

   Often it is worthwhile to modify the [InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7) parameter of the `start.ps1` script,
   in cases where the host's network adapter isn't "Ethernet".
   Otherwise, consult the output of the `start-kubelet.ps1` script to see if there are errors during virtual network creation.
-->
5. 我的 Windows 节点无法使用 Service IP 访问我的服务
   
   这是 Windows 上网络栈的一个已知限制。
   然而 Windows Pod 可以访问 Service IP。

6. 启动 kubelet 时找不到网络适配器
   
   Windows 网络栈需要一个虚拟适配器才能让 Kubernetes 网络生效。
   如果（在以管理员身份运行的 shell 中）以下命令没有返回结果，
   则说明虚拟网络创建已失败，而虚拟网络是 kubelet 工作的前提条件：
   
   ```powershell
   Get-HnsNetwork | ? Name -ieq "cbr0"
   Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
   ```
   
   如果主机的网络适配器不是 “Ethernet”，通常需要修改 `start.ps1` 脚本的 [InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7) 参数。
   否则，请参阅 `start-kubelet.ps1` 脚本的输出，检查创建虚拟网络期间是否有错误。
<!--
1. DNS resolution is not properly working
   Check the DNS limitations for Windows in this [section](#dns-limitations).

1. `kubectl port-forward` fails with "unable to do port forwarding: wincat not found"
   This was implemented in Kubernetes 1.15 by including `wincat.exe` in the pause infrastructure container `mcr.microsoft.com/oss/kubernetes/pause:3.6`.
   Be sure to use a supported version of Kubernetes.
   If you would like to build your own pause infrastructure container be sure to include [wincat](https://github.com/kubernetes/kubernetes/tree/master/build/pause/windows/wincat).
1. My Kubernetes installation is failing because my Windows Server node is behind a proxy
   If you are behind a proxy, the following PowerShell environment variables must be defined:
-->
7. DNS 解析工作不正常
   
   参考[这一节](#dns-limitations)，了解 Windows 上的 DNS 限制。

8. `kubectl port-forward` 失败且提示 “unable to do port forwarding: wincat not found”
   
   这个功能特性是在 Kubernetes 1.15 将 `wincat.exe` 纳入 pause 基础容器
   `mcr.microsoft.com/oss/kubernetes/pause:3.6` 后实现的。
   务必使用支持的 Kubernetes 版本。
   如果你想要构建你自己的 pause 基础镜像，请务必纳入 [wincat](https://github.com/kubernetes/kubernetes/tree/master/build/pause/windows/wincat)。

9. 我的 Kubernetes 安装因我的 Windows Server 节点使用了代理服务器而失败
   
   如果你使用了代理服务器，必须定义以下 PowerShell 环境变量：
   
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
### Flannel 故障排查 {#flannel-troubleshooting}

1. 使用 Flannel 时，我的节点在重新接入集群后遇到问题
   
   每当先前删除的节点重新接入集群时，flannelD 都会尝试为该节点分配一个新的 Pod 子网。
   用户应移除以下路径中旧的 Pod 子网配置文件：
   
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
2. Flanneld 卡在了 “Waiting for the Network to be created”
   
   有很多这个 [issue](https://github.com/coreos/flannel/issues/1066) 的报告；
   这很可能是 flannel 网络管理 IP 的设置时机问题。
   一个变通办法是重新启动 `start.ps1` 或按以下方式手动重新启动 Flanneld：
   
   ```powershell
   [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows_Worker_Hostname>")
   C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows_Worker_Node_IP> --ip-masq=1 --kube-subnet-mgr=1
   ```
<!--
1. My Windows Pods cannot launch because of missing `/run/flannel/subnet.env`

   This indicates that Flannel didn't launch correctly. You can either try
   to restart `flanneld.exe` or you can copy the files over manually from
   `/run/flannel/subnet.env` on the Kubernetes master to `C:\run\flannel\subnet.env`
   on the Windows worker node and modify the `FLANNEL_SUBNET` row to a different
   number. For example, if node subnet 10.244.4.1/24 is desired:
-->
3. 我的 Windows Pod 因为缺少 `/run/flannel/subnet.env` 而无法启动
   
   这表明 Flannel 未正确启动。
   你可以尝试重新启动 `flanneld.exe`，或可以将这些文件从 Kubernetes master 上的
   `/run/flannel/subnet.env` 手动复制到 Windows worker 节点的
   `C:\run\flannel\subnet.env`，并将 `FLANNEL_SUBNET` 一行修改为不同的数值。
   例如，如果期望的节点子网是 10.244.4.1/24：
   
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
### 进一步调查 {#further-investigation}

如果上述步骤没有解决你的问题，你可以通过以下方式获取帮助，
以便在 Kubernetes 中的 Windows 节点上运行 Windows 容器：

* StackOverflow [Windows Server Container](https://stackoverflow.com/questions/tagged/windows-server-container) 话题
* Kubernetes 官方论坛 [discuss.kubernetes.io](https://discuss.kubernetes.io/)
* Kubernetes Slack [#SIG-Windows 频道](https://kubernetes.slack.com/messages/sig-windows)