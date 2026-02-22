---
reviewers:
- aravindhp
- jayunit100
- jsturtevant
- marosset
title: Windows debugging tips
content_type: concept
---

<!-- overview -->

<!-- body -->

## Node-level troubleshooting {#troubleshooting-node}

1. My Pods are stuck at "Container Creating" or restarting over and over

   Ensure that your pause image is compatible with your Windows OS version.
   See [Pause container](/docs/concepts/windows/intro/#pause-container)
   to see the latest / recommended pause image and/or get more information.

   {{< note >}}
   If using containerd as your container runtime the pause image is specified in the
   `plugins.plugins.cri.sandbox_image` field of the of config.toml configuration file.
   {{< /note >}}

1. My pods show status as `ErrImgPull` or `ImagePullBackOff`

   Ensure that your Pod is getting scheduled to a
   [compatible](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility)
   Windows Node.

   More information on how to specify a compatible node for your Pod can be found in
   [this guide](/docs/concepts/windows/user-guide/#ensuring-os-specific-workloads-land-on-the-appropriate-container-host).

## Network troubleshooting {#troubleshooting-network}

1. My Windows Pods do not have network connectivity

   If you are using virtual machines, ensure that MAC spoofing is **enabled** on all
   the VM network adapter(s).

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

   ```conf
   "ExceptionList": [
                   "10.244.0.0/16",  # Cluster subnet
                   "10.96.0.0/12",   # Service subnet
                   "10.127.130.0/24" # Management (host) subnet
               ]
   ```

1. My Windows node cannot access `NodePort` type Services

   Local NodePort access from the node itself fails. This is a known
   limitation. NodePort access works from other nodes or external clients.

1. vNICs and HNS endpoints of containers are being deleted

   This issue can be caused when the `hostname-override` parameter is not passed to
   [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/). To resolve
   it, users need to pass the hostname to kube-proxy as follows:

   ```powershell
   C:\k\kube-proxy.exe --hostname-override=$(hostname)
   ```

1. My Windows node cannot access my services using the service IP

   This is a known limitation of the networking stack on Windows. However, Windows Pods can access the Service IP.

1. No network adapter is found when starting the kubelet

   The Windows networking stack needs a virtual adapter for Kubernetes networking to work.
   If the following commands return no results (in an admin shell),
   virtual network creation — a necessary prerequisite for the kubelet to work — has failed:

   ```powershell
   Get-HnsNetwork | ? Name -ieq "cbr0"
   Get-NetAdapter | ? Name -Like "vEthernet (Ethernet*"
   ```

   Often it is worthwhile to modify the [InterfaceName](https://github.com/microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1#L7)
   parameter of the `start.ps1` script, in cases where the host's network adapter isn't "Ethernet".
   Otherwise, consult the output of the `start-kubelet.ps1` script to see if there are errors during virtual network creation.

1. DNS resolution is not properly working

   Check the DNS limitations for Windows in this [section](/docs/concepts/services-networking/dns-pod-service/#dns-windows).

1. `kubectl port-forward` fails with "unable to do port forwarding: wincat not found"

   This was implemented in Kubernetes 1.15 by including `wincat.exe` in the pause infrastructure container
   `mcr.microsoft.com/oss/kubernetes/pause:3.6`.
   Be sure to use a supported version of Kubernetes.
   If you would like to build your own pause infrastructure container be sure to include
   [wincat](https://github.com/kubernetes/kubernetes/tree/master/build/pause/windows/wincat).

1. My Kubernetes installation is failing because my Windows Server node is behind a proxy

   If you are behind a proxy, the following PowerShell environment variables must be defined:

   ```PowerShell
   [Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://proxy.example.com:80/", [EnvironmentVariableTarget]::Machine)
   [Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://proxy.example.com:443/", [EnvironmentVariableTarget]::Machine)
   ```

### Flannel troubleshooting

1. With Flannel, my nodes are having issues after rejoining a cluster

   Whenever a previously deleted node is being re-joined to the cluster, flannelD
   tries to assign a new pod subnet to the node. Users should remove the old pod
   subnet configuration files in the following paths:

   ```powershell
   Remove-Item C:\k\SourceVip.json
   Remove-Item C:\k\SourceVipRequest.json
   ```

1. Flanneld is stuck in "Waiting for the Network to be created"

   There are numerous reports of this [issue](https://github.com/coreos/flannel/issues/1066);
   most likely it is a timing issue for when the management IP of the flannel network is set.
   A workaround is to relaunch `start.ps1` or relaunch it manually as follows:

   ```powershell
   [Environment]::SetEnvironmentVariable("NODE_NAME", "<Windows_Worker_Hostname>")
   C:\flannel\flanneld.exe --kubeconfig-file=c:\k\config --iface=<Windows_Worker_Node_IP> --ip-masq=1 --kube-subnet-mgr=1
   ```

1. My Windows Pods cannot launch because of missing `/run/flannel/subnet.env`

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

### Further investigation

If these steps don't resolve your problem, you can get help running Windows containers on Windows nodes in Kubernetes through:

* StackOverflow [Windows Server Container](https://stackoverflow.com/questions/tagged/windows-server-container) topic
* Kubernetes Official Forum [discuss.kubernetes.io](https://discuss.kubernetes.io/)
* Kubernetes Slack [#SIG-Windows Channel](https://kubernetes.slack.com/messages/sig-windows)

