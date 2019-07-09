---
reviewers:
- michmike
- patricklang
title: Guide for adding Windows Nodes in Kubernetes
content_template: templates/concept
weight: 70
---

{{% capture overview %}}

The Kubernetes platform can now be used to run both Linux and Windows containers. One or more Windows nodes can be registered to a cluster. This guide shows how to:

* Register a Windows node to the cluster
* Configure networking so pods on Linux and Windows can communicate

{{% /capture %}}

{{% capture body %}}

## Before you begin

* Obtain a [Windows Server license](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing) in order to configure the Windows node that hosts Windows containers. You can use your organization's licenses for the cluster, or acquire one from Microsoft, a reseller, or via the major cloud providers such as GCP, AWS, and Azure by provisioning a virtual machine running Windows Server through their marketplaces. A [time-limited trial](https://www.microsoft.com/en-us/cloud-platform/windows-server-trial) is also available.

* Build a Linux-based Kubernetes cluster in which you have access to the control plane (some examples include [Getting Started from Scratch](https://github.com/kubernetes/kubernetes/tree/master/build/), [kubeadm/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/), [AKS Engine](/docs/setup/production-environment/turnkey/azure/), [GCE](/docs/setup/production-environment/turnkey/gce/), [AWS](/docs/setup/production-environment/turnkey/aws/).

## Getting Started: Adding a Windows Node to Your Cluster

### Plan IP Addressing

Kubernetes cluster management requires careful planning of your IP addresses so that you do not inadvertently cause network collision. This guide assumes that you are familiar with the [Kubernetes networking concepts](/docs/concepts/cluster-administration/networking/).

In order to deploy your cluster you need the following address spaces:

| Subnet / address range | Description | Default value |
| --- | --- | --- |
| Service Subnet | A non-routable, purely virtual subnet that is used by pods to uniformly access services without caring about the network topology. It is translated to/from routable address space by `kube-proxy` running on the nodes. | 10.96.0.0/12 |
| Cluster Subnet | This is a global subnet that is used by all pods in the cluster. Each node is assigned a smaller /24 subnet from this for their pods to use. It must be large enough to accommodate all pods used in your cluster. To calculate *minimumsubnet* size: `(number of nodes) + (number of nodes * maximum pods per node that you configure)`. Example: for a 5 node cluster for 100 pods per node: `(5) + (5 * 100) = 505.` | 10.244.0.0/16 |
| Kubernetes DNS Service IP | IP address of `kube-dns` service that is used for DNS resolution & cluster service discovery. | 10.96.0.10 |

Review the networking options supported in 'Intro to Windows containers in Kubernetes: Supported Functionality: Networking' to determine how you need to allocate IP addresses for your cluster.

### Components that run on Windows

While the Kubernetes control plane runs on your Linux node(s), the following components are configured and run on your Windows node(s).

1. kubelet
2. kube-proxy
3. kubectl (optional)
4. Container runtime

Get the latest binaries from [https://github.com/kubernetes/kubernetes/releases](https://github.com/kubernetes/kubernetes/releases), starting with v1.14 or later. The Windows-amd64 binaries for kubeadm, kubectl, kubelet, and kube-proxy can be found under the CHANGELOG link.

### Networking Configuration

Once you have a Linux-based Kubernetes master node you are ready to choose a networking solution. This guide illustrates using Flannel in VXLAN mode for simplicity.

#### Configuring Flannel in VXLAN mode on the Linux controller

1. Prepare Kubernetes master for Flannel

    Some minor preparation is recommended on the Kubernetes master in our cluster. It is recommended to enable bridged IPv4 traffic to iptables chains when using Flannel. This can be done using the following command:

    ```bash
    sudo sysctl net.bridge.bridge-nf-call-iptables=1
    ```

1. Download & configure Flannel

    Download the most recent Flannel manifest:

    ```bash
    wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
    ```

    There are two sections you should modify to enable the vxlan networking backend:

    After applying the steps below, the `net-conf.json` section of `kube-flannel.yml` should look as follows:

    ```json
    net-conf.json: |
        {
          "Network": "10.244.0.0/16",
          "Backend": {
            "Type": "vxlan",
            "VNI" : 4096,
            "Port": 4789
          }
        }
    ```

    {{< note >}}The VNI must be set to 4096 and port 4789 for Flannel on Linux to interoperate with Flannel on Windows. Support for other VNIs is coming soon. See the [VXLAN documentation](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)
    for an explanation of these fields.{{< /note >}}

1. In the `net-conf.json` section of your `kube-flannel.yml`, double-check:
    1. The cluster subnet (e.g. "10.244.0.0/16") is set as per your IP plan.
        * VNI 4096 is set in the backend
        * Port 4789 is set in the backend
    2. In the `cni-conf.json` section of your `kube-flannel.yml`, change the network name to `vxlan0`.


    Your `cni-conf.json` should look as follows:

    ```json
    cni-conf.json: |
        {
          "name": "vxlan0",
          "plugins": [
            {
              "type": "flannel",
              "delegate": {
                "hairpinMode": true,
                "isDefaultGateway": true
              }
            },
            {
              "type": "portmap",
              "capabilities": {
                "portMappings": true
              }
            }
          ]
        }
    ```

1. Apply the Flannel yaml and Validate

    Let's apply the Flannel configuration:

    ```bash
    kubectl apply -f kube-flannel.yml
    ```

    Next, since the Flannel pods are Linux-based, apply a NodeSelector patch, which can be found [here](https://github.com/Microsoft/SDN/blob/1d5c055bb195fecba07ad094d2d7c18c188f9d2d/Kubernetes/flannel/l2bridge/manifests/node-selector-patch.yml), to the Flannel DaemonSet pod:

    ```bash
    kubectl patch ds/kube-flannel-ds-amd64 --patch "$(cat node-selector-patch.yml)" -n=kube-system
    ```

    After a few minutes, you should see all the pods as running if the Flannel pod network was deployed.

    ```bash
    kubectl get pods --all-namespaces
    ```

    ![alt_text](../flannel-master-kubeclt-get-pods.png "flannel master kubectl get pods screen capture")

    Verify that the Flannel DaemonSet has the NodeSelector applied.

    ```bash
    kubectl get ds -n kube-system
    ```

    ![alt_text](../flannel-master-kubectl-get-ds.png "flannel master kubectl get ds screen capture")

#### Join Windows Worker

In this section we'll cover configuring a Windows node from scratch to join a cluster on-prem. If your cluster is on a cloud you'll likely want to follow the cloud specific guides in the next section.

#### Preparing a Windows Node
{{< note >}}
All code snippets in Windows sections are to be run in a PowerShell environment with elevated permissions (Admin).
{{< /note >}}

1. Install Docker (requires a system reboot)

    Kubernetes uses [Docker](https://www.docker.com/) as its container engine, so we need to install it. You can follow the [official Docs instructions](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-docker/configure-docker-daemon#install-docker), the [Docker instructions](https://store.docker.com/editions/enterprise/docker-ee-server-windows), or try the following *recommended* steps:

    ```PowerShell
    Enable-WindowsOptionalFeature -FeatureName Containers
    Restart-Computer -Force
    Install-Module -Name DockerMsftProvider -Repository PSGallery -Force
    Install-Package -Name Docker -ProviderName DockerMsftProvider
    ```

    If you are behind a proxy, the following PowerShell environment variables must be defined:

    ```PowerShell
    [Environment]::SetEnvironmentVariable("HTTP_PROXY", "http://proxy.example.com:80/", [EnvironmentVariableTarget]::Machine)
    [Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://proxy.example.com:443/", [EnvironmentVariableTarget]::Machine)
    ```

    If after reboot you see the following error, you need to restart the docker service manually

    ![alt_text](../windows-docker-error.png "windows docker error screen capture")    

    ```PowerShell
    Start-Service docker
    ```

    {{< note >}}
    The "pause" (infrastructure) image is hosted on Microsoft Container Registry (MCR). You can access it using "docker pull mcr.microsoft.com/k8s/core/pause:1.2.0". The DOCKERFILE is available at https://github.com/kubernetes-sigs/sig-windows-tools/tree/master/cmd/wincat.
    {{< /note >}}

1. Prepare a Windows directory for Kubernetes

    Create a "Kubernetes for Windows" directory to store Kubernetes binaries as well as any deployment scripts and config files.

    ```PowerShell
    mkdir c:\k
    ```

1. Copy Kubernetes certificate

    Copy the Kubernetes certificate file `$HOME/.kube/config` [from the Linux controller](https://docs.microsoft.com/en-us/virtualization/windowscontainers/kubernetes/creating-a-linux-master#collect-cluster-information) to this new `C:\k` directory on your Windows node.

    Tip: You can use tools such as [xcopy](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/xcopy), [WinSCP](https://winscp.net/eng/download.php), or this [PowerShell wrapper for WinSCP](https://www.powershellgallery.com/packages/WinSCP/5.13.2.0) to transfer the config file between nodes.

1. Download Kubernetes binaries

    To be able to run Kubernetes, you first need to download the `kubelet` and `kube-proxy` binaries. You download these from the Node Binaries links in the CHANGELOG.md file of the [latest releases](https://github.com/kubernetes/kubernetes/releases/). For example 'kubernetes-node-windows-amd64.tar.gz'. You may also optionally download `kubectl` to run on Windows which you can find under Client Binaries.

    Use the [Expand-Archive](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.archive/expand-archive?view=powershell-6) PowerShell command to extract the archive and place the binaries into `C:\k`.

#### Join the Windows node to the Flannel cluster

The Flannel overlay deployment scripts and documentation are available in [this repository](https://github.com/Microsoft/SDN/tree/master/Kubernetes/flannel/overlay). The following steps are a simple walkthrough of the more comprehensive instructions available there.

Download the [Flannel start.ps1](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1) script, the contents of which should be extracted to `C:\k`:

```PowerShell
cd c:\k
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
wget https://raw.githubusercontent.com/Microsoft/SDN/master/Kubernetes/flannel/start.ps1 -o c:\k\start.ps1
```

{{< note >}}
[start.ps1](https://github.com/Microsoft/SDN/blob/master/Kubernetes/flannel/start.ps1) references [install.ps1](https://github.com/Microsoft/SDN/blob/master/Kubernetes/windows/install.ps1), which downloads additional files such as the `flanneld` executable and the [Dockerfile for infrastructure pod](https://github.com/Microsoft/SDN/blob/master/Kubernetes/windows/Dockerfile) and install those for you. For overlay networking mode, the [firewall](https://github.com/Microsoft/SDN/blob/master/Kubernetes/windows/helper.psm1#L111) is opened for local UDP port 4789. There may be multiple powershell windows being opened/closed as well as a few seconds of network outage while the new external vSwitch for the pod network is being created the first time. Run the script using the arguments as specified below:
{{< /note >}}

```PowerShell
.\start.ps1 -ManagementIP <Windows Node IP> -NetworkMode overlay  -ClusterCIDR <Cluster CIDR> -ServiceCIDR <Service CIDR> -KubeDnsServiceIP <Kube-dns Service IP> -LogDir <Log directory>
```

| Parameter | Default Value | Notes |
| --- | --- | --- |
| -ManagementIP | N/A (required) | The IP address assigned to the Windows node. You can use `ipconfig` to find this. |
| -NetworkMode | l2bridge | We're using `overlay` here |
| -ClusterCIDR | 10.244.0.0/16 | Refer to your cluster IP plan |
| -ServiceCIDR | 10.96.0.0/12 | Refer to your cluster IP plan |
| -KubeDnsServiceIP | 10.96.0.10 | |
| -InterfaceName | Ethernet | The name of the network interface of the Windows host. You can use <code>ipconfig</code> to find this. |
| -LogDir | C:\k | The directory where kubelet and kube-proxy logs are redirected into their respective output files. |

Now you can view the Windows nodes in your cluster by running the following:

```bash
kubectl get nodes
```

{{< note >}}
You may want to configure your Windows node components like kubelet and kube-proxy to run as services. View the services and background processes section under [troubleshooting](#troubleshooting) for additional instructions. Once you are running the node components as services, collecting logs becomes an important part of troubleshooting. View the [gathering logs](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs) section of the contributing guide for further instructions.
{{< /note >}}

### Public Cloud Providers

#### Azure

AKS-Engine can deploy a complete, customizable Kubernetes cluster with both Linux & Windows nodes. There is a step-by-step walkthrough available in the [docs on GitHub](https://github.com/Azure/aks-engine/blob/master/docs/topics/windows.md).

#### GCP

Users can easily deploy a complete Kubernetes cluster on GCE following this step-by-step walkthrough on [GitHub](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/windows/README-GCE-Windows-kube-up.md)

#### Deployment with kubeadm and cluster API

Kubeadm is becoming the de facto standard for users to deploy a Kubernetes cluster. Windows node support in kubeadm will come in a future release. We are also making investments in cluster API to ensure Windows nodes are properly provisioned.

### Next Steps

Now that you've configured a Windows worker in your cluster to run Windows containers you may want to add one or more Linux nodes as well to run Linux containers. You are now ready to schedule Windows containers on your cluster.

{{% /capture %}}
