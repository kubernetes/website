---
title: Windows 调试技巧
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
## 工作节点级别排障 {#troubleshooting-node}

1. 我的 Pod 都卡在 “Container Creating” 或者不断重启

   确保你的 pause 镜像跟你的 Windows 版本兼容。
   查看 [Pause 容器](/zh-cn/docs/concepts/windows/intro/#pause-container)
   以了解最新的或建议的 pause 镜像，或者了解更多信息。

   {{< note >}}
   <!--
   If using containerd as your container runtime the pause image is specified in the
   `plugins.plugins.cri.sandbox_image` field of the of config.toml configuration file.
   -->
   如果你在使用 containerd 作为你的容器运行时，那么 pause 镜像在 config.toml 配置文件的
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
2. 我的 Pod 状态显示 'ErrImgPull' 或者 'ImagePullBackOff'

   保证你的 Pod 被调度到[兼容的](https://docs.microsoft.com/zh-cn/virtualization/windowscontainers/deploy-containers/version-compatibility)
   Windows 节点上。

   关于如何为你的 Pod 指定一个兼容节点，
   可以查看这个指可以查看[这个指南](/zh-cn/docs/concepts/windows/user-guide/#ensuring-os-specific-workloads-land-on-the-appropriate-container-host)
   以了解更多的信息。

<!-- 
## Network troubleshooting {#troubleshooting-network}

1. My Windows Pods do not have network connectivity

   If you are using virtual machines, ensure that MAC spoofing is **enabled** on all
   the VM network adapter(s).
-->
## 网络排障 {#troubleshooting-network}

1. 我的 Windows Pod 没有网络连接

   如果你使用的是虚拟机，请确保所有 VM 网卡上都已启用 MAC spoofing。

<!-- 
1. My Windows Pods cannot ping external resources

   Windows Pods do not have outbound rules programmed for the ICMP protocol. However,
   TCP/UDP is supported. When trying to demonstrate connectivity to resources
   outside of the cluster, substitute `ping <IP>` with corresponding
   `curl <IP>` commands.
-->
2. 我的 Windows Pod 不能 ping 通外界资源

   Windows Pod 没有为 ICMP 协议编写出站规则，但 TCP/UDP 是支持的。当试图演示与集群外部资源的连接时，
   可以把 `ping <IP>` 替换为 `curl <IP>` 命令。

   <!--
   If you are still facing problems, most likely your network configuration in
   [cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf)
   deserves some extra attention. You can always edit this static file. The
   configuration update will apply to any new Kubernetes resources.
   -->
   如果你仍然遇到问题，很可能你需要额外关注
   [cni.conf](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf)
   的配置。你可以随时编辑这个静态文件。更新配置将应用于新的 Kubernetes 资源。

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
   Kubernetes 的网络需求之一（查看 [Kubernetes 模型](/zh-cn/docs/concepts/cluster-administration/networking/)）
   是集群通信不需要内部的 NAT。
   为了遵守这一要求，对于你不希望发生的出站 NAT 通信，这里有一个
   [ExceptionList](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/l2bridge/cni/config/cni.conf#L20)。
   然而，这也意味着你需要从 `ExceptionList` 中去掉你试图查询的外部 IP。
   只有这样，来自你的 Windows Pod 的流量才会被正确地 SNAT 转换，以接收来自外部环境的响应。
   就此而言，你的 `cni.conf` 中的 `ExceptionList` 应该如下所示：

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
       "10.244.0.0/16",  # 集群子网
       "10.96.0.0/12",   # 服务子网
       "10.127.130.0/24" # 管理（主机）子网
   ]
   ```
<!--  
1. My Windows node cannot access `NodePort` type Services

   Local NodePort access from the node itself fails. This is a known
   limitation. NodePort access works from other nodes or external clients.
-->
3. 我的 Windows 节点无法访问 `NodePort` 类型 Service

   从节点本身访问本地 NodePort 失败，是一个已知的限制。
   你可以从其他节点或外部客户端正常访问 NodePort。

<!--
1. vNICs and HNS endpoints of containers are being deleted

   This issue can be caused when the `hostname-override` parameter is not passed to
   [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/). To resolve
   it, users need to pass the hostname to kube-proxy as follows:
-->
4. 容器的 vNIC 和 HNS 端点正在被删除

   当 `hostname-override` 参数没有传递给
   [kube-proxy](/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/)
   时可能引发这一问题。想要解决这个问题，用户需要将主机名传递给 kube-proxy，如下所示：

   ```powershell
   C:\k\kube-proxy.exe --hostname-override=$(hostname)
   ```

<!-- 
1. My Windows node cannot access my services using the service IP

   This is a known limitation of the networking stack on Windows. However, Windows Pods can access the Service IP.
-->
5. 我的 Windows 节点无法通过服务 IP 访问我的服务

   这是 Windows 上网络栈的一个已知限制。但是 Windows Pod 可以访问 Service IP。

<!--
1. No network adapter is found when starting the kubelet

   The Windows networking stack needs a virtual adapter for Kubernetes networking to work.
   If the following commands return no results (in an admin shell),
   virtual network creation — a necessary prerequisite for the kubelet to work — has failed:
-->
6. 启动 kubelet 时找不到网络适配器

   Windows 网络栈需要一个虚拟适配器才能使 Kubernetes 网络工作。
   如果以下命令没有返回结果（在管理员模式的 shell 中），
   则意味着创建虚拟网络失败，而虚拟网络的存在是 kubelet 正常工作的前提：

   ```powershell
   Get-HnsNetwork | ? Name -ieq "cbr0"
   Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
   ```

   <!--
   Often it is worthwhile to modify the [InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7) parameter of the start.ps1 script,
   in cases where the host's network adapter isn't "Ethernet".
   Otherwise, consult the output of the `start-kubelet.ps1` script to see if there are errors during virtual network creation.
   -->
   如果主机的网络适配器不是 "Ethernet"，通常有必要修改 `start.ps1` 脚本的
   [InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7)
   参数。否则，如果虚拟网络创建过程出错，请检查 `start-kubelet.ps1` 脚本的输出。

<!--    
1. DNS resolution is not properly working

   Check the DNS limitations for Windows in this [section](/docs/concepts/services-networking/dns-pod-service/#dns-windows).
-->
7. DNS 解析工作异常

   查阅[这一节](/zh-cn/docs/concepts/services-networking/dns-pod-service/#dns-windows)了解 Windows 系统上的 DNS 限制。

<!--
1. `kubectl port-forward` fails with "unable to do port forwarding: wincat not found"

   This was implemented in Kubernetes 1.15 by including `wincat.exe` in the pause infrastructure container `mcr.microsoft.com/oss/kubernetes/pause:3.6`.
   Be sure to use a supported version of Kubernetes.
   If you would like to build your own pause infrastructure container be sure to include [wincat](https://github.com/kubernetes/kubernetes/tree/master/build/pause/windows/wincat).
-->
8. `kubectl port-forward` 失败，错误为 "unable to do port forwarding: wincat not found"

   在 Kubernetes 1.15 中，pause 基础架构容器 `mcr.microsoft.com/oss/kubernetes/pause:3.6`
   中包含 `wincat.exe` 来实现端口转发。
   请确保使用 Kubernetes 的受支持版本。如果你想构建自己的 pause 基础架构容器，
   请确保其中包含 [wincat](https://github.com/kubernetes/kubernetes/tree/master/build/pause/windows/wincat)。

<!--   
1. My Kubernetes installation is failing because my Windows Server node is behind a proxy

   If you are behind a proxy, the following PowerShell environment variables must be defined:
-->
9. 我的 Kubernetes 安装失败，因为我的 Windows 服务器节点使用了代理服务器

   如果使用了代理服务器，必须定义下面的 PowerShell 环境变量：

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

1. 使用 Flannel 时，我的节点在重新加入集群后出现问题

   当先前删除的节点重新加入集群时, flannelD 尝试为节点分配一个新的 Pod 子网。
   用户应该在以下路径中删除旧的 Pod 子网配置文件：

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

   关于这个[问题](https://github.com/coreos/flannel/issues/1066)有很多报告；
   很可能是 Flannel 网络管理 IP 的设置时机问题。
   一个变通方法是重新启动 `start.ps1` 或按如下方式手动重启：

   <!--
   ```powershell
   [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows_Worker_Hostname>")
   C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows_Worker_Node_IP> --ip-masq=1 --kube-subnet-mgr=1
   ```
   -->
   ```powershell
   [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows 工作节点主机名>")
   C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows 工作节点 IP> --ip-masq=1 --kube-subnet-mgr=1
   ```

<!-- 
1. My Windows Pods cannot launch because of missing `/run/flannel/subnet.env`

   This indicates that Flannel didn't launch correctly. You can either try
   to restart `flanneld.exe` or you can copy the files over manually from
   `/run/flannel/subnet.env` on the Kubernetes master to `C:\run\flannel\subnet.env`
   on the Windows worker node and modify the `FLANNEL_SUBNET` row to a different
   number. For example, if node subnet 10.244.4.1/24 is desired:
-->
3. 我的 Windows Pod 无法启动，因为缺少 `/run/flannel/subnet.env`

   这表明 Flannel 没有正确启动。你可以尝试重启 `flanneld.exe` 或者你可以将 Kubernetes 控制节点的
   `/run/flannel/subnet.env` 文件手动拷贝到 Windows 工作节点上，放在 `C:\run\flannel\subnet.env`；
   并且将 `FLANNEL_SUBNET` 行修改为不同取值。例如，如果期望节点子网为 10.244.4.1/24：

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
### 进一步探查   {#further-investigation}

如果这些步骤都不能解决你的问题，你可以通过以下方式获得关于在 Kubernetes 中运行 Windows 容器的帮助：

* StackOverflow [Windows Server Container](https://stackoverflow.com/questions/tagged/windows-server-container) topic
* Kubernetes 官方论坛 [discuss.kubernetes.io](https://discuss.kubernetes.io/)
* Kubernetes Slack [#SIG-Windows Channel](https://kubernetes.slack.com/messages/sig-windows)

