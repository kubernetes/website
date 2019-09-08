---
reviewers:
- michmike
- patricklang
title: Guide for adding Windows Nodes in Kubernetes
min-kubernetes-server-version: v1.14
content_template: templates/tutorial
weight: 70
---

{{% capture overview %}}

The Kubernetes platform can now be used to run both Linux and Windows containers. This page shows how one or more Windows nodes can be registered to a cluster.

{{% /capture %}}


{{% capture prerequisites %}}

* Obtain a [Windows Server 2019 license](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing)  (or higher) in order to configure the Windows node that hosts Windows containers. You can use your organization's licenses for the cluster, or acquire one from Microsoft, a reseller, or via the major cloud providers such as GCP, AWS, and Azure by provisioning a virtual machine running Windows Server through their marketplaces. A [time-limited trial](https://www.microsoft.com/en-us/cloud-platform/windows-server-trial) is also available.

* Build a Linux-based Kubernetes cluster in which you have access to the control-plane (some examples include [Creating a single control-plane cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/), [AKS Engine](/docs/setup/production-environment/turnkey/azure/), [GCE](/docs/setup/production-environment/turnkey/gce/), [AWS](/docs/setup/production-environment/turnkey/aws/).

{{% /capture %}}


{{% capture objectives %}}

* Register a Windows node to the cluster
* Configure networking so Pods and Services on Linux and Windows can communicate with each other

{{% /capture %}}


{{% capture lessoncontent %}}

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

While the Kubernetes control-plane runs on your Linux node(s), the following components are configured and run on your Windows node(s).

1. kubelet
2. kube-proxy
3. kubectl (optional)
4. Container runtime

Get the latest binaries from [https://github.com/kubernetes/kubernetes/releases](https://github.com/kubernetes/kubernetes/releases), starting with v1.14 or later. The Windows-amd64 binaries for kubeadm, kubectl, kubelet, and kube-proxy can be found under the CHANGELOG link.

### Networking Configuration

Once you have a Linux-based Kubernetes control-plane ("Master") node you are ready to choose a networking solution. This guide illustrates using Flannel in VXLAN mode for simplicity.

#### Configuring Flannel in VXLAN mode on the Linux control-plane

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
    1. In the `cni-conf.json` section of your `kube-flannel.yml`, change the network name to `vxlan0`.

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

1. Apply the Flannel manifest and validate

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

    The output looks like as follows:

    ```
    NAMESPACE     NAME                                      READY        STATUS    RESTARTS   AGE
    kube-system   etcd-flannel-master                       1/1          Running   0          1m
    kube-system   kube-apiserver-flannel-master             1/1          Running   0          1m
    kube-system   kube-controller-manager-flannel-master    1/1          Running   0          1m
    kube-system   kube-dns-86f4d74b45-hcx8x                 3/3          Running   0          12m
    kube-system   kube-flannel-ds-54954                     1/1          Running   0          1m
    kube-system   kube-proxy-Zjlxz                          1/1          Running   0          1m
    kube-system   kube-scheduler-flannel-master             1/1          Running   0          1m
    ```

    Verify that the Flannel DaemonSet has the NodeSelector applied.

    ```bash
    kubectl get ds -n kube-system
    ```

    The output looks like as follows. The NodeSelector `beta.kubernetes.io/os=linux` is applied.

    ```
    NAME              DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR                                               AGE
    kube-flannel-ds   2         2         2       2            2           beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux   21d
    kube-proxy        2         2         2       2            2           beta.kubernetes.io/os=linux                                 26d
    ```



### Join Windows Worker Node

In this section we'll cover configuring a Windows node from scratch to join a cluster on-prem. If your cluster is on a cloud you'll likely want to follow the cloud specific guides in the [public cloud providers section](#public-cloud-providers).

#### Preparing a Windows Node

{{< note >}}
All code snippets in Windows sections are to be run in a PowerShell environment with elevated permissions (Administrator) on the Windows worker node.
{{< /note >}}

1. Download the [SIG Windows tools](https://github.com/kubernetes-sigs/sig-windows-tools) repository containing install and join scripts
   ```PowerShell
   [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
   Start-BitsTransfer https://github.com/kubernetes-sigs/sig-windows-tools/archive/master.zip
   tar -xvf .\master.zip --strip-components 3 sig-windows-tools-master/kubeadm/v1.15.0/*
   Remove-Item .\master.zip
   ```

1. Customize the Kubernetes [configuration file](https://github.com/kubernetes-sigs/sig-windows-tools/blob/master/kubeadm/v1.15.0/Kubeclustervxlan.json) 

    ```
    {
    "Cri" : {  // Contains values for container runtime and base container setup
        "Name" : "dockerd", // Container runtime name
        "Images" : {
            "Pause" : "mcr.microsoft.com/k8s/core/pause:1.2.0",  // Infrastructure container image
            "Nanoserver" : "mcr.microsoft.com/windows/nanoserver:1809",  // Base Nanoserver container image
            "ServerCore" : "mcr.microsoft.com/windows/servercore:ltsc2019"  // Base ServerCore container image
        }
    },
    "Cni" : {  // Contains values for networking executables
        "Name" : "flannel",  // Name of network fabric
        "Source" : [{ // Contains array of objects containing values for network daemon(s)
            "Name" : "flanneld",  // Name of network daemon
            "Url" : "https://github.com/coreos/flannel/releases/download/v0.11.0/flanneld.exe"  // Direct URL pointing to network daemon executable
            }
        ],
        "Plugin" : {  // Contains values for CNI network plugin
            "Name": "vxlan" // Backend network mechanism to use: ["vxlan" | "bridge"]
        },
        "InterfaceName" : "Ethernet"  // Designated network interface name on Windows node to use as container network
    },
    "Kubernetes" : {  // Contains values for Kubernetes node binaries
        "Source" : {  // Contains values for Kubernetes node binaries 
            "Release" : "1.15.0",  // Version of Kubernetes node binaries
            "Url" : "https://dl.k8s.io/v1.15.0/kubernetes-node-windows-amd64.tar.gz"  // Direct URL pointing to Kubernetes node binaries tarball
        },
        "ControlPlane" : {  // Contains values associated with Kubernetes control-plane ("Master") node
            "IpAddress" : "kubemasterIP",  // IP address of control-plane ("Master") node
            "Username" : "localadmin",  // Username on control-plane ("Master") node with remote SSH access  
            "KubeadmToken" : "token",  // Kubeadm bootstrap token
            "KubeadmCAHash" : "discovery-token-ca-cert-hash"  // Kubeadm CA key hash
        },
        "KubeProxy" : {  // Contains values for Kubernetes network proxy configuration
            "Gates" : "WinOverlay=true"  // Comma-separated key-value pairs passed to kube-proxy feature gate flag
        },
        "Network" : {  // Contains values for IP ranges in CIDR notation for Kubernetes networking
            "ServiceCidr" : "10.96.0.0/12",  // Service IP subnet used by Services in CIDR notation
            "ClusterCidr" : "10.244.0.0/16"  // Cluster IP subnet used by Pods in CIDR notation 
        }
    },
    "Install" : {  // Contains values and configurations for Windows node installation
        "Destination" : "C:\\ProgramData\\Kubernetes"  // Absolute DOS path where Kubernetes will be installed on the Windows node
    }
}
  ```

{{< note >}}
Users can generate values for the `ControlPlane.KubeadmToken` and `ControlPlane.KubeadmCAHash` fields by running  `kubeadm token create --print-join-command` on the Kubernetes control-plane ("Master") node.
{{< /note >}}

1. Install containers and Kubernetes (requires a system reboot)

Use the previously downloaded [KubeCluster.ps1](https://github.com/kubernetes-sigs/sig-windows-tools/blob/master/kubeadm/v1.15.0/KubeCluster.ps1) script to install Kubernetes on the Windows Server container host:

  ```PowerShell
    .\KubeCluster.ps1 -ConfigFile .\Kubeclustervxlan.json -install 
  ```
  where `-ConfigFile` points to the path of the Kubernetes configuration file.

{{< note >}}
In the example below, we are using overlay networking mode. This requires Windows Server version 2019 with [KB4489899](https://support.microsoft.com/help/4489899) and at least Kubernetes v1.14 or above. Users that cannot meet this requirement must use  `L2bridge` networking instead by selecting `bridge` as the [plugin](https://github.com/kubernetes-sigs/sig-windows-tools/blob/master/kubeadm/v1.15.0/Kubeclusterbridge.json#L18) in the configuration file.  
{{< /note >}}

  ![alt_text](../kubecluster.ps1-install.gif "KubeCluster.ps1 install output")


On the Windows node you target, this step will:

1. Enable Windows Server containers role (and reboot)
1. Download and install the chosen container runtime
1. Download all needed container images
1. Download Kubernetes binaries and add them to the `$PATH` environment variable
1. Download CNI plugins based on the selection made in the Kubernetes Configuration file
1. (Optionally) Generate a new SSH key which is required to connect to the control-plane ("Master") node during joining

      {{< note >}}For the SSH key generation step, you also need to add the generated public SSH key to the `authorized_keys` file on your (Linux) control-plane node. You only need to do this once. The script prints out the steps you can follow to do this, at the end of its output.{{< /note >}}

Once installation is complete, any of the generated configuration files or binaries can be modified before joining the Windows node. 

#### Join the Windows Node to the Kubernetes cluster
This section covers how to join a [Windows node with Kubernetes installed](#preparing-a-windows-node) with an existing (Linux) control-plane, to form a cluster.

Use the previously downloaded [KubeCluster.ps1](https://github.com/kubernetes-sigs/sig-windows-tools/blob/master/kubeadm/v1.15.0/KubeCluster.ps1) script to join the Windows node to the cluster:

  ```PowerShell
    .\KubeCluster.ps1 -ConfigFile .\Kubeclustervxlan.json -join 
  ```
  where `-ConfigFile` points to the path of the Kubernetes configuration file.

![alt_text](../kubecluster.ps1-join.gif "KubeCluster.ps1 join output")

{{< note >}}
Should the script fail during the bootstrap or joining procedure for whatever reason, start a new PowerShell session before starting each consecutive join attempt.
{{< /note >}}

This step will perform the following actions:

1. Connect to the control-plane ("Master") node via SSH, to retrieve the [Kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file.
1. Register kubelet as a Windows service
1. Configure CNI network plugins
1. Create an HNS network on top of the chosen network interface
    {{< note >}}
    This may cause a network blip for a few seconds while the vSwitch is being created.
    {{< /note >}}
1. (If vxlan plugin is selected) Open up inbound firewall UDP port 4789 for overlay traffic
1. Register flanneld as a Windows service
1. Register kube-proxy as a Windows service

Now you can view the Windows nodes in your cluster by running the following:

```bash
kubectl get nodes
```

#### Remove the Windows Node from the Kubernetes cluster
In this section we'll cover how to remove a Windows node from a Kubernetes cluster. 

Use the previously downloaded [KubeCluster.ps1](https://github.com/kubernetes-sigs/sig-windows-tools/blob/master/kubeadm/v1.15.0/KubeCluster.ps1) script to remove the Windows node from the cluster:

  ```PowerShell
    .\KubeCluster.ps1 -ConfigFile .\Kubeclustervxlan.json -reset 
  ```
  where `-ConfigFile` points to the path of the Kubernetes configuration file.

![alt_text](../kubecluster.ps1-reset.gif "KubeCluster.ps1 reset output")

This step will perform the following actions on the targeted Windows node:

1. Delete the Windows node from the Kubernetes cluster
1. Stop all running containers
1. Remove all container networking (HNS) resources
1. Unregister all Kubernetes services (flanneld, kubelet, kube-proxy)
1. Delete all Kubernetes binaries (kube-proxy.exe, kubelet.exe, flanneld.exe, kubeadm.exe)
1. Delete all CNI network plugins binaries
1. Delete [Kubeconfig file](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) used to access the Kubernetes cluster


### Public Cloud Providers

#### Azure

AKS-Engine can deploy a complete, customizable Kubernetes cluster with both Linux & Windows nodes. There is a step-by-step walkthrough available in the [docs on GitHub](https://github.com/Azure/aks-engine/blob/master/docs/topics/windows.md).

#### GCP

Users can easily deploy a complete Kubernetes cluster on GCE following this step-by-step walkthrough on [GitHub](https://github.com/kubernetes/kubernetes/blob/master/cluster/gce/windows/README-GCE-Windows-kube-up.md)

#### Deployment with kubeadm and cluster API

Kubeadm is becoming the de facto standard for users to deploy a Kubernetes cluster. Windows node support in kubeadm is an alpha feature since Kubernetes release v1.16. We are also making investments in cluster API to ensure Windows nodes are properly provisioned. For more details, please consult the [kubeadm for Windows KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cluster-lifecycle/kubeadm/20190424-kubeadm-for-windows.md).


### Next Steps

Now that you've configured a Windows worker in your cluster to run Windows containers you may want to add one or more Linux nodes as well to run Linux containers. You are now ready to schedule Windows containers on your cluster.

{{% /capture %}}

