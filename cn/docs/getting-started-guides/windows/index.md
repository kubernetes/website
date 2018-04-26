<!--
---
title: Windows Server Containers
---


Kubernetes version 1.5 introduces support for Windows Server Containers. In version 1.5, the Kubernetes control plane (API Server, Scheduler, Controller Manager, etc) continue to run on Linux, while the kubelet and kube-proxy can be run on Windows Server.

**Note:** Windows Server Containers on Kubernetes is an Alpha feature in Kubernetes 1.5.
-->
---
title: Windows Server 容器
---


Kubernetes v1.5引入了对Windows Server容器的支持。在版本1.5中，Kubernetes控制面板（API服务器，调度器，控制管理器等）仍然运行在Linux上，但是kubelet和kube-proxy可以运行在Windows Server上。

**注意:** 在Kubernetes 1.5中，Kubernetes中的Windows Server容器还属于Alpha功能。

<!--
## Prerequisites
In Kubernetes version 1.5, Windows Server Containers for Kubernetes is supported using the following:

1. Kubernetes control plane running on existing Linux infrastructure (version 1.5 or later)
2. Kubenet network plugin setup on the Linux nodes
3. Windows Server 2016 (RTM version 10.0.14393 or later)
4. Docker Version 1.12.2-cs2-ws-beta or later for Windows Server nodes (Linux nodes and Kubernetes control plane can run any Kubernetes supported Docker Version)
-->
## 前提条件

在Kubernetes v1.5中，Windows Server容器对Kubernetes的支持使用如下方法：

1. Kubernetes控制面板还是运行在已有的Linux基础设施（v1.5及以后的版本）上
2. 在Linux节点上搭建Kubenet网络插件
3. Windows Server 2016 （RTM版本10.0.14393或之后的）
4. 对Windows Server节点而言，需要Docker 版本 v1.12.2-cs2-ws-beta或之后的（Linux节点和Kubernetes控制面板可以运行在任何支持Docker版本的Kubernetes上）

<!--
## Networking
Network is achieved using L3 routing. Because third-party networking plugins (e.g. flannel, calico, etc) don't natively work on Windows Server, existing technology that is built into the Windows and Linux operating systems is relied on. In this L3 networking approach, a /16 subnet is chosen for the cluster nodes, and a /24 subnet is assigned to each worker node. All pods on a given worker node will be connected to the /24 subnet. This allows pods on the same node to communicate with each other. In order to enable networking between pods running on different nodes, routing features that are built into Windows Server 2016 and Linux are used.

### Linux
The above networking approach is already supported on Linux using a bridge interface, which essentially creates a private network local to the node. Similar to the Windows side, routes to all other pod CIDRs must be created in order to send packets via the "public" NIC.
-->
## 网络 
网络是通过L3路由实现的。由于第三方的网络插件（比如 flannel，calico等）本身在Windows Server上无法工作，它只能依赖于内嵌在Windows和Linux操作系统中的已有技术。在这个L3网络方法中，集群中的节点都选择使用/16的子网，每个工作节点选择/24的子网。在给定工作节点上的所有pod都会连接到/24的子网。这样，在同一个节点上的所有pod就能相互通信。为了激活运行在不同节点上的pod之间的网络，它使用了内嵌在Window server 2016 和Linux内的路由功能。

### Linux
以上网络方法在Linux上已经使用网桥接口实现，网桥接口本质上是在节点上创建了一个本地私有网络。与Windows方面一样，为了使用“公开”NIC发送数据包，必须创建到所有其他节点CIDR的路由。

<!--
### Windows
Each Window Server node should have the following configuration:

1. Two NICs (virtual networking adapters) are required on each Windows Server node - The two Windows container networking modes of interest (transparent and L2 bridge) use an external Hyper-V virtual switch. This means that one of the NICs is entirely allocated to the bridge, creating the need for the second NIC.
2. Transparent container network created - This is a manual configuration step and is shown in **_Route Setup_** section below
3. RRAS (Routing) Windows feature enabled - Allows routing between NICs on the box, and also "captures" packets that have the destination IP of a POD running on the node. To enable, open "Server Manager". Click on "Roles", "Add Roles". Click "Next". Select "Network Policy and Access Services". Click on "Routing and Remote Access Service" and the underlying checkboxes
4. Routes defined pointing to the other pod CIDRs via the "public" NIC - These routes are added to the built-in routing table as shown in **_Route Setup_** section below

The following diagram illustrates the Windows Server networking setup for Kubernetes Setup
![Windows Setup](windows-setup.png)
-->
### Windows
每个Windows server节点都必须做如下配置：

1. 每个Windows Server节点都都必须要有两块NIC（虚拟网络适配器） - 这两种Windows容器网络模式（传输层和L2网桥）使用一个外部Hyper-V虚拟交换机。这意味着其中有一个NIC完全分配给该网桥，这也是为什么还需要创建一个NIC。
2. 创建传输层容器网络 - 这是一个手工配置步骤，会在下面的**_Route Setup_**章节中介绍
3. 启用RRAS（路由）Windows功能 - 允许同一台机器上两个NIC之间的路由，并能“截获”目标地址是运行在该节点上的POD的数据包。要启用该功能，打开“服务器管理”，点击“角色”，“添加角色”，点击“下一步”，选择“网络策略和访问服务”，点击“路由和远程访问服务”，并选择底下的复选框。
4. 通过“公开”NIC将 - 这些路由添加到内嵌的路由表中，请参考下面的**_Route Setup_**章节

以下图表显示了在Windows Server上搭建Kubernetes的网络配置

<!--
## Setting up Windows Server Containers on Kubernetes
To run Windows Server Containers on Kubernetes, you'll need to set up both your host machines and the Kubernetes node components for Windows and setup Routes for Pod communication on different nodes.

### Host Setup
**Windows Host Setup**

1. Windows Server container host running Windows Server 2016 and Docker v1.12. Follow the setup instructions outlined by this blog post: https://msdn.microsoft.com/en-us/virtualization/windowscontainers/quick_start/quick_start_windows_server
2. DNS support for Windows recently got merged to docker master and is currently not supported in a stable docker release. To use DNS build docker from master or download the binary from [Docker master](https://master.dockerproject.org/)
3. Pull the `apprenda/pause` image from `https://hub.docker.com/r/apprenda/pause` 
4. RRAS (Routing) Windows feature enabled
5. Install a VMSwitch of type `Internal`, by running `New-VMSwitch -Name KubeProxySwitch -SwitchType Internal` command in *PowerShell* window. This will create a new Network Interface with name `vEthernet (KubeProxySwitch)`. This interface will be used by kube-proxy to add Service IPs.
-->
## 在Kubernetes上搭建Windows server 容器
要在Kubernetes上运行Windows Server容器，你需要配置你的主机机器和Windows上的Kubernetes节点组件，并为在不同的节点上Pod之间的通信搭建路由。

### 主机配置
**Windows主机配置**

1. Windows Server容器要运行Windows Server 2016 和 Docker v1.12。参考这个博客发表的搭建方法：https://msdn.microsoft.com/en-us/virtualization/windowscontainers/quick_start/quick_start_windows_server
2. 对Windows DNS的支持最近刚并到docker master中，目前在稳定的docker发布版中还不支持。要使用DNS，你可以从master中构建docker，或从【docker master】(https://master.dockerproject.org/)中下载二进制。
3. 从`https://hub.docker.com/r/apprenda/pause`中拖拽`apprenda/pause`镜像
4. 启用RRAS（路由） Windows功能
5. 在*PowerShell*窗口下运行`New-VMSwitch -Name KubeProxySwitch -SwitchType Internal`命令来安装类型为‘Internal’的VMSwitch。这会创建一个新的名为`vEthernet (KubeProxySwitch)`的网络接口。kube-proxy会使用这个接口来添加Service IP。

<!--
**Linux Host Setup**

1. Linux hosts should be setup according to their respective distro documentation and the requirements of the Kubernetes version you will be using. 
2. CNI network plugin installed.

### Component Setup

Requirements

* Git
* Go 1.7.1+
* make (if using Linux or MacOS)
* Important notes and other dependencies are listed [here](https://git.k8s.io/community/contributors/devel/development.md#building-kubernetes-on-a-local-osshell-environment)
-->
**Linux 主机配置**

1. Linux主机必须根据他们各自发行版的文档和你准备使用的Kubernetes的版本需求来配置。
2. 安装CNI网络插件。

## 组件配置

要求

* Git
* Go 1.7.1+
* make (如果使用的是Linux 或 MacOS)
* 关键注解和其他依赖关系都列在【这里】(https://git.k8s.io/community/contributors/devel/development.md#building-kubernetes-on-a-local-osshell-environment)

<!--
**kubelet**

To build the *kubelet*, run:

1. `cd $GOPATH/src/k8s.io/kubernetes`
2. Build *kubelet*
   1. Linux/MacOS: `KUBE_BUILD_PLATFORMS=windows/amd64 make WHAT=cmd/kubelet`
   2. Windows: `go build cmd/kubelet/kubelet.go`

**kube-proxy**

To build *kube-proxy*, run:

1. `cd $GOPATH/src/k8s.io/kubernetes`
2. Build *kube-proxy*
   1. Linux/MacOS: `KUBE_BUILD_PLATFORMS=windows/amd64 make WHAT=cmd/kube-proxy`
   2. Windows: `go build cmd/kube-proxy/proxy.go`
-->
**kubelet**

要构建*kubelet*，运行：

1. `cd $GOPATH/src/k8s.io/kubernetes`
2. 构建 *kubelet*
   1. Linux/MacOS: `KUBE_BUILD_PLATFORMS=windows/amd64 make WHAT=cmd/kubelet`
   2. Windows: `go build cmd/kubelet/kubelet.go`

**kube-proxy**

要构建*kube-proxy*,运行：

1. `cd $GOPATH/src/k8s.io/kubernetes`
2. 构建 *kube-proxy*
   1. Linux/MacOS: `KUBE_BUILD_PLATFORMS=windows/amd64 make WHAT=cmd/kube-proxy`
   2. Windows: `go build cmd/kube-proxy/proxy.go`
   
<!--
### Route Setup
The below example setup assumes one Linux and two Windows Server 2016 nodes and a cluster CIDR 192.168.0.0/16
-->
### 路由配置
如下实例配置是假设你有一个Linux和两个Windows Server 2016 节点，以及集群CIDR 192.168.0.0/16。

| Hostname | Routable IP address | Pod CIDR |
| --- | --- | --- |
| Lin01 | `<IP of Lin01 host>` | 192.168.0.0/24 |
| Win01 | `<IP of Win01 host>` | 192.168.1.0/24 |
| Win02 | `<IP of Win02 host>` | 192.168.2.0/24 |

**Lin01**

```
ip route add 192.168.1.0/24 via <IP of Win01 host>
ip route add 192.168.2.0/24 via <IP of Win02 host>
```

**Win01**

```
docker network create -d transparent --gateway 192.168.1.1 --subnet 192.168.1.0/24 <network name>
<!--
# A bridge is created with Adapter name "vEthernet (HNSTransparent)". Set its IP address to transparent network gateway
-->
# 创建了一个适配器名为"vEthernet (HNSTransparent)"的网桥。将它的IP地址设置为传输层网络网关
netsh interface ipv4 set address "vEthernet (HNSTransparent)" addr=192.168.1.1
route add 192.168.0.0 mask 255.255.255.0 192.168.0.1 if <Interface Id of the Routable Ethernet Adapter> -p
route add 192.168.2.0 mask 255.255.255.0 192.168.2.1 if <Interface Id of the Routable Ethernet Adapter> -p
```

**Win02**

```
docker network create -d transparent --gateway 192.168.2.1 --subnet 192.168.2.0/24 <network name>
<!--
# A bridge is created with Adapter name "vEthernet (HNSTransparent)". Set its IP address to transparent network gateway
-->
# 创建了一个适配器名为"vEthernet (HNSTransparent)"的网桥。将它的IP地址设置为传输层网络网关
netsh interface ipv4 set address "vEthernet (HNSTransparent)" addr=192.168.2.1
route add 192.168.0.0 mask 255.255.255.0 192.168.0.1 if <Interface Id of the Routable Ethernet Adapter> -p
route add 192.168.1.0 mask 255.255.255.0 192.168.1.1 if <Interface Id of the Routable Ethernet Adapter> -p
```

<!--
## Starting the Cluster
To start your cluster, you'll need to start both the Linux-based Kubernetes control plane, and the Windows Server-based Kubernetes node components. 
## Starting the Linux-based Control Plane
Use your preferred method to start Kubernetes cluster on Linux. Please note that Cluster CIDR might need to be updated.
## Starting the Windows Node Components
To start kubelet on your Windows node:
Run the following in a PowerShell window. Be aware that if the node reboots or the process exits, you will have to rerun the commands below to restart the kubelet

1. Set environment variable *CONTAINER_NETWORK* value to the docker container network to use
`$env:CONTAINER_NETWORK = "<docker network>"`

2. Run *kubelet* executable using the below command
`kubelet.exe --hostname-override=<ip address/hostname of the windows node>  --pod-infra-container-image="apprenda/pause" --resolv-conf="" --api_servers=<api server location>`

To start kube-proxy on your Windows node:

Run the following in a PowerShell window with administrative privileges. Be aware that if the node reboots or the process exits, you will have to rerun the commands below to restart the kube-proxy.

1. Set environment variable *INTERFACE_TO_ADD_SERVICE_IP* value to `vEthernet (KubeProxySwitch)` which we created in **_Windows Host Setup_** above
`$env:INTERFACE_TO_ADD_SERVICE_IP = "vEthernet (KubeProxySwitch)"`

2. Run *kube-proxy* executable using the below command
`.\proxy.exe --v=3 --proxy-mode=userspace --hostname-override=<ip address/hostname of the windows node> --master=<api server location> --bind-address=<ip address of the windows node>`
-->
## 启动集群
要启动你的集群，你需要将基于Linux的Kubernetes控制面板和基于Windows Server的Kubernetes节点组件都启动。
## 启动基于Linux的Kubernetes控制面板
你可以使用喜欢的方式在Linux上启动Kubernetes集群。请注意，该集群的CIDR可能需要更新。
## 启动Windows节点组件
要在你的Windows节点上启动kubelet：
在PowerShell窗口下运行以下命令。需要注意的是，如果节点重启或进程退出了，你需要重新运行以下命令来重启kubelet

1. 将环境变量*CONTAINER_NETWORK*的值设置为docker容器网络
`$env:CONTAINER_NETWORK = "<docker network>"`

2. 使用如下命令运行可执行文件 *kubelet*
`kubelet.exe --hostname-override=<ip address/hostname of the windows node>  --pod-infra-container-image="apprenda/pause" --resolv-conf="" --api_servers=<api server location>`

要在你的Windows节点上启动kube-proxy：
使用管理员权限在PowerShell窗口里运行以下命令。需要注意的是，如果节点重启或进程退出了，你需要重新运行以下命令来重启kube-proxy。
`.\proxy.exe --v=3 --proxy-mode=userspace --hostname-override=<ip address/hostname of the windows node> --master=<api server location> --bind-address=<ip address of the windows node>`

<!--
## Scheduling Pods on Windows
Because your cluster has both Linux and Windows nodes, you must explicitly set the nodeSelector constraint to be able to schedule Pods to Windows nodes. You must set nodeSelector with the label beta.kubernetes.io/os to the value windows; see the following example:
-->
## 在Windows上调度Pod 
由于你的集群中既有Linux也有Windows节点，为了能将Pod调度到Windows节点上，你必须显示地设置nodeSelector限制条件。你必须把nodeSelector的标签beta.kubernetes.io/os的值设置为windows；请看下面的例子：
```
{
  "apiVersion": "v1",
  "kind": "Pod",
  "metadata": {
    "name": "iis",
    "labels": {
      "name": "iis"
    }
  },
  "spec": {
    "containers": [
      {
        "name": "iis",
        "image": "microsoft/iis",
        "ports": [
          {
            "containerPort": 80
          }
        ]
      }
    ],
    "nodeSelector": {
      "beta.kubernetes.io/os": "windows"
    }
  }
}
```
<!--
## Known Limitations:
1. There is no network namespace in Windows and as a result currently only one container per pod is supported
2. Secrets currently do not work because of a bug in Windows Server Containers described [here](https://github.com/docker/docker/issues/28401)
3. ConfigMaps have not been implemented yet.
4. `kube-proxy` implementation uses `netsh portproxy` and as it only supports TCP, DNS currently works only if the client retries DNS query using TCP
-->
## 已知限制：
1. Windows系统没有网络命名空间，因此目前只支持一个pod上只有一个容器。
2. 由于Windows Server容器的一个问题，Secrets目前不可用。该问题在【这里】描述(https://github.com/docker/docker/issues/28401)。
3. ConfigMaps目前还没有实现。
4. `kube-proxy`的实现使用了netsh portproxy`，由于`netsh portproxy`只支持TCP，因此只有在客户端使用TCP来重试DNS查询的时候，DNS才会有用。


