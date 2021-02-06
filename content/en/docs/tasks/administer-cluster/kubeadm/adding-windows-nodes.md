---
reviewers:
- michmike
- patricklang
title: Adding Windows nodes
min-kubernetes-server-version: 1.17
content_type: tutorial
weight: 30
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

You can use Kubernetes to run a mixture of Linux and Windows nodes, so you can mix Pods that run on Linux on with Pods that run on Windows. This page shows how to register Windows nodes to your cluster.




## {{% heading "prerequisites" %}}
 {{< version-check >}}

* Obtain a [Windows Server 2019 license](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing)
(or higher) in order to configure the Windows node that hosts Windows containers.
If you are using VXLAN/Overlay networking you must have also have [KB4489899](https://support.microsoft.com/help/4489899) installed.

* A Linux-based Kubernetes kubeadm cluster in which you have access to the control plane (see [Creating a single control-plane cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)).




## {{% heading "objectives" %}}


* Register a Windows node to the cluster
* Configure networking so Pods and Services on Linux and Windows can communicate with each other




<!-- lessoncontent -->

## Getting Started: Adding a Windows Node to Your Cluster

### Networking Configuration

Once you have a Linux-based Kubernetes control-plane node you are ready to choose a networking solution. This guide illustrates using Flannel in VXLAN mode for simplicity.

#### Configuring Flannel

1. Prepare Kubernetes control plane for Flannel

    Some minor preparation is recommended on the Kubernetes control plane in our cluster. It is recommended to enable bridged IPv4 traffic to iptables chains when using Flannel. The following command must be run on all Linux nodes:

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
            "VNI": 4096,
            "Port": 4789
          }
        }
    ```

    {{< note >}}The VNI must be set to 4096 and port 4789 for Flannel on Linux to interoperate with Flannel on Windows. See the [VXLAN documentation](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan).
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

    Now you can add Windows-compatible versions of Flannel and kube-proxy. In order
    to ensure that you get a compatible version of kube-proxy, you'll need to substitute
    the tag of the image. The following example shows usage for Kubernetes {{< param "fullversion" >}},
    but you should adjust the version for your own deployment.

    ```bash
    curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/kube-proxy.yml | sed 's/VERSION/{{< param "fullversion" >}}/g' | kubectl apply -f -
    kubectl apply -f https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-overlay.yml
    ```
    {{< note >}}
    If you're using host-gateway use https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-host-gw.yml instead
    {{< /note >}}

    {{< note >}}
If you're using a different interface rather than Ethernet (i.e. "Ethernet0 2") on the Windows nodes, you have to modify the line:

```powershell
wins cli process run --path /k/flannel/setup.exe --args "--mode=overlay --interface=Ethernet"
```

in the `flannel-host-gw.yml` or `flannel-overlay.yml` file and specify your interface accordingly.

```bash
# Example
curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-overlay.yml | sed 's/Ethernet/Ethernet0 2/g' | kubectl apply -f -
```
    {{< /note >}}
    


### Joining a Windows worker node

{{< note >}}
All code snippets in Windows sections are to be run in a PowerShell environment
with elevated permissions (Administrator) on the Windows worker node.
{{< /note >}}

{{< tabs name="tab-windows-kubeadm-runtime-installation" >}}
{{% tab name="Docker EE" %}}

#### Install Docker EE

Install the `Containers` feature

```powershell
Install-WindowsFeature -Name containers
```

Install Docker
Instructions to do so are available at [Install Docker Engine - Enterprise on Windows Servers](https://hub.docker.com/editions/enterprise/docker-ee-server-windows).

#### Install wins, kubelet, and kubeadm  

```PowerShell
curl.exe -LO https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/PrepareNode.ps1
.\PrepareNode.ps1 -KubernetesVersion {{< param "fullversion" >}}
```

#### Run `kubeadm` to join the node

Use the command that was given to you when you ran `kubeadm init` on a control plane host.
If you no longer have this command, or the token has expired, you can run `kubeadm token create --print-join-command`
(on a control plane host) to generate a new token and join command.

{{% /tab %}}
{{% tab name="CRI-containerD" %}}

#### Install containerD

```powershell
curl.exe -LO https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/Install-Containerd.ps1
.\Install-Containerd.ps1
```

{{< note >}}
To install a specific version of containerD specify the version with -ContainerDVersion.

```powershell
# Example
.\Install-Containerd.ps1 -ContainerDVersion v1.4.1
```

{{< /note >}}

{{< note >}}
If you're using a different interface rather than Ethernet (i.e. "Ethernet0 2") on the Windows nodes, specify the name with `-netAdapterName`.

```powershell
# Example
.\Install-Containerd.ps1 -netAdapterName "Ethernet0 2"
```

{{< /note >}}

#### Install wins, kubelet, and kubeadm

```PowerShell
curl.exe -LO https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/PrepareNode.ps1
.\PrepareNode.ps1 -KubernetesVersion {{< param "fullversion" >}} -ContainerRuntime containerD
```

#### Run `kubeadm` to join the node

Use the command that was given to you when you ran `kubeadm init` on a control plane host.
If you no longer have this command, or the token has expired, you can run `kubeadm token create --print-join-command`
(on a control plane host) to generate a new token and join command.

{{< note >}}
If using **CRI-containerD** add `--cri-socket "npipe:////./pipe/containerd-containerd"` to the kubeadm call
{{< /note >}}

{{% /tab %}}
{{< /tabs >}}

### Verifying your installation

You should now be able to view the Windows node in your cluster by running:

```bash
kubectl get nodes -o wide
```

If your new node is in the `NotReady` state it is likely because the flannel image is still downloading.
You can check the progress as before by checking on the flannel pods in the `kube-system` namespace:

```shell
kubectl -n kube-system get pods -l app=flannel
```

Once the flannel Pod is running, your node should enter the `Ready` state and then be available to handle workloads.

## {{% heading "whatsnext" %}}

- [Upgrading Windows kubeadm nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes)
