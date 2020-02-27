---
reviewers:
- michmike
- patricklang
title: Guide for adding Windows Nodes in Kubernetes
min-kubernetes-server-version: v1.17
content_template: templates/tutorial
weight: 70
---

{{% capture overview %}}

The Kubernetes platform can now be used to run both Linux and Windows containers. This page shows how one or more Windows nodes can be registered to a cluster.

{{% /capture %}}


{{% capture prerequisites %}}

* Obtain a [Windows Server 2019 license](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing)
(or higher) in order to configure the Windows node that hosts Windows containers.
If you are using VXLAN/Overlay networking you must have also have [KB4489899](https://support.microsoft.com/help/4489899) installed.

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

### Networking Configuration

Once you have a Linux-based Kubernetes control-plane ("Master") node you are ready to choose a networking solution. This guide illustrates using Flannel in VXLAN mode for simplicity.

#### Configuring Flannel

1. Prepare Kubernetes master for Flannel

    Some minor preparation is recommended on the Kubernetes master in our cluster. It is recommended to enable bridged IPv4 traffic to iptables chains when using Flannel. This can be done using the following command:

    ```bash
    sudo sysctl net.bridge.bridge-nf-call-iptables=1
    ```

1. Download & configure Flannel for Linux

    Download the most recent Flannel manifest:

    ```bash
    wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
    ```

    Modify the `net-conf.json` section of the flannel manifest in order to set the VNI to 4096 and the Port to 4789. It should look as follows:

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

    {{< note >}}To use L2Bridge/Host-gateway mode instead change the value of `Type` to `"host-gw"` and omit `VNI` and `Port`.{{< /note >}}

1. Apply the Flannel manifest and validate

    Let's apply the Flannel configuration:

    ```bash
    kubectl apply -f kube-flannel.yml
    ```

    After a few minutes, you should see all the pods as running if the Flannel pod network was deployed.

    ```bash
    kubectl get pods -n kube-system
    ```

    The output should include the Linux flannel DaemonSet as running:

    ```
    NAMESPACE     NAME                                      READY        STATUS    RESTARTS   AGE
    ...
    kube-system   kube-flannel-ds-54954                     1/1          Running   0          1m
    ```

1. Add Windows Flannel and kube-proxy DaemonSets

    Now we will add Windows-compatible versions of Flannel and kube-proxy. In order
    to ensure that we get a compatible version of kube-proxy, we'll need to substitute
    the tag of the image. The following example shows usage for Kubernetes 1.17.3,
    but you should adjust the version for your own deployment.

    ```bash
    curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/download/0.1/kube-proxy.yml | sed 's/VERSION/v1.17.3/g' | kubectl apply -f -
    kubectl apply -f https://github.com/kubernetes-sigs/sig-windows-tools/releases/download/0.1/flannel-overlay.yml
    ```

    {{< note >}}
    If you're using host-gateway use https://github.com/kubernetes-sigs/sig-windows-tools/releases/download/0.1/flannel-host-gw.yml instead
    {{< /note >}}

### Joining a Windows worker node
{{< note >}}
You must install the `Containers` feature and install Docker. Instructions
to do so can be found [here](https://docs.docker.com/ee/docker-ee/windows/docker-ee/#install-docker-engine---enterprise).
{{< /note >}}

{{< note >}}
All code snippets in Windows sections are to be run in a PowerShell environment
with elevated permissions (Administrator) on the Windows worker node.
{{< /note >}}

1. Install wins, kubelet, and kubeadm.

   ```PowerShell
   curl.exe -LO https://github.com/kubernetes-sigs/sig-windows-tools/releases/download/0.1/PrepareNode.ps1
   .\PrepareNode.ps1 -KubernetesVersion v1.17.0
   ```
{{< note >}}
Kubernetes version must be >= 1.17.0
{{< /note >}}

1. Run kubeadm to join the node

    Use the command that was given to you when you ran `kubeadm init` on the master node.
    If you no longer have this command, or the token has expired, you can run `kubeadm token create --print-join-command`
    on the master to generate a new token and join command.


#### Verifying your installation
You should now be able to view the Windows node in your cluster by running:

```bash
kubectl get nodes -o wide
```

{{% /capture %}}

