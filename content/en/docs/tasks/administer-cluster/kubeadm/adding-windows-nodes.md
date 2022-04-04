---
reviewers:
- jayunit100
- jsturtevant
- marosset
- perithompson
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

### Joining a Windows worker node

{{< note >}}
All code snippets in Windows sections are to be run in a PowerShell environment
with elevated permissions (Administrator) on the Windows worker node unless otherwise noted.
{{< /note >}}

{{< tabs name="tab-windows-kubeadm-runtime-installation" >}}

{{% tab name="CRI-containerD" %}}

### Intro

The following instructions are require HostProcess container support with Kubernetes 1.22+.  If you do not support HostProcess containers in you cluster you can install Flannel and kube-proxy as windows services directly on the host.  

The Before running any of these step the Windows node should have the following Windows Features installed: `Containers`,`Hyper-V`,`Hyper-V-PowerShell`.  These can be installed using the Powershell `Install-WindowsFeature` command.

{{< note >}}
The following instructions are the manual steps to configure nodes. You can use the [image-builder](https://image-builder.sigs.k8s.io/capi/windows/windows.html) used as part of the Cluster Api project implements the following along with other optimizations.
{{< /note >}}

#### Install containerD

Follow the instructions for [installing the Containerd runtime on Windows using powershell](../../../setup/production-environment/container-runtimes.md#containerd)

#### Install kubelet

Kubeadm sets some flags via a environment file.  To support this it is common to use [nssm](https://nssm.cc/) to configure kubelet.  To install nssm do the following:

``` powershell
mkdir c:\k
$arch = "win64"
curl.exe -L https://k8stestinfrabinaries.blob.core.windows.net/nssm-mirror/nssm-2.24.zip -o nssm.zip
tar.exe C c:\k\ -xvf .\nssm.zip --strip-components 2 */$arch/*.exe
```

Next we will set `$KubernetesVersion` to the desired version (ex: `$KubernetesVersion="v1.24.0"`), and then run the following commands to install kubelet:

``` powerShell
curl.exe -L https://dl.k8s.io/$KubernetesVersion/bin/windows/amd64/kubelet.exe -o c:\k\kubelet.exe

@"
# Start file needed to support kubeadm extra args
`$FileContent = Get-Content -Path "/var/lib/kubelet/kubeadm-flags.env"
`$kubeAdmArgs = `$FileContent.TrimStart(`'KUBELET_KUBEADM_ARGS=`').Trim(`'"`')

`$args = "--cert-dir=`$env:SYSTEMDRIVE/var/lib/kubelet/pki",
        "--config=`$env:SYSTEMDRIVE/var/lib/kubelet/config.yaml",
        "--bootstrap-kubeconfig=`$env:SYSTEMDRIVE/etc/kubernetes/bootstrap-kubelet.conf",
        "--kubeconfig=`$env:SYSTEMDRIVE/etc/kubernetes/kubelet.conf",
        "--hostname-override=$(hostname)",
        "--enable-debugging-handlers",
        "--cgroups-per-qos=false",
        "--enforce-node-allocatable=``"``"",
        "--resolv-conf=``"``""

`$kubeletCommandLine = "c:\k\kubelet.exe " + (`$args -join " ") + " `$kubeAdmArgs"
Invoke-Expression `$kubeletCommandLine
"@ | Set-Content -Path c:\k\Start-kubelet.ps1

c:\k\nssm.exe install kubelet Powershell -ExecutionPolicy Bypass -NoProfile c:\k\Start-kubelet.ps1
c:\k\nssm.exe set Kubelet AppStdout C:\k\kubelet.log
c:\k\nssm.exe set Kubelet AppStderr C:\k\kubelet.err.log 
```

We need to open a firewall port:

```
New-NetFirewallRule -Name kubelet -DisplayName 'kubelet' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 10250
```

Verify kubelet is installed with `Get-service kubelet`.  Kubeadm will start kubelet during joining the node. 

```
Get-Service kubelet
Status   Name     DisplayName
------   ----     -----------
Stopped  kubelet  kubelet
```

#### Install kubeadm

Start a Powershell session, set `$KubernetesVersion` to the desired version (ex: `$KubernetesVersion="v1.24.0"`), and then run the following commands:

```
curl.exe -L https://dl.k8s.io/$KubernetesVersion/bin/windows/amd64/kubeadm.exe -o c:\k\kubeadm.exe
```

#### Run `kubeadm` to join the node

Use the command that was given to you when you ran `kubeadm init` on a control plane host. You will need to add  `--cri-socket "npipe:////./pipe/containerd-containerd"` to tell kubeadm to use the correct containerd pipe.

The command will look like:

```
 ./kubeadm.exe join 10.240.0.10:6443 --token <your token> --discovery-token-ca-cert-hash sha256:<your hash> --cri-socket "npipe:////./pipe/containerd-containerd" 
```

If you no longer have this command, or the token has expired, you can run `kubeadm token create --print-join-command`
(on a control plane host) to generate a new token and join command.

#### Install Flannel CNI DaemonSet

We will leverage host-process containers to run flannel as a DaemonSet:

```
kubectl apply -f https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-overlay-hpc.yml
```

#### Install kube-proxy DaemonSet

We will leverage host-process containers to run kube-proxy as a DaemonSet.  This can be run from any Linux machine that has kubectl installed with its context configured to your new cluster.

``` powershell
curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/kube-proxy-flannel-hpc.yml | sed 's/KUBERNETES_VERSION/v1.23.5/g' | kubectl apply -f -
```

{{% /tab %}}

{{% tab name="Docker Engine" %}}

#### Install Docker Engine

Install the `Containers` feature

```powershell
Install-WindowsFeature -Name containers
```

Install Docker
Instructions to do so are available at [Install Docker Engine - Enterprise on Windows Servers](https://docs.microsoft.com/en-us/virtualization/windowscontainers/quick-start/set-up-environment?tabs=Windows-Server#install-docker).

[Install cri-dockerd](https://github.com/Mirantis/cri-dockerd) which is required so that the kubelet
can communicate with Docker on a CRI compatible endpoint.

{{< note >}}
Docker Engine does not implement the [CRI](/docs/concepts/architecture/cri/)
which is a requirement for a container runtime to work with Kubernetes.
For that reason, an additional service [cri-dockerd](https://github.com/Mirantis/cri-dockerd)
has to be installed. cri-dockerd is a project based on the legacy built-in
Docker Engine support that was [removed](/dockershim) from the kubelet in version 1.24.
{{< /note >}}

Install `crictl` from the [cri-tools project](https://github.com/kubernetes-sigs/cri-tools)
which is required so that kubeadm can talk to the CRI endpoint.

#### Install wins, kubelet, and kubeadm

```PowerShell
curl.exe -LO https://raw.githubusercontent.com/kubernetes-sigs/sig-windows-tools/master/kubeadm/scripts/PrepareNode.ps1
.\PrepareNode.ps1 -KubernetesVersion {{< param "fullversion" >}}
```

#### Add Windows Flannel and kube-proxy DaemonSets

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

#### Run `kubeadm` to join the node

Use the command that was given to you when you ran `kubeadm init` on a control plane host.
If you no longer have this command, or the token has expired, you can run `kubeadm token create --print-join-command`
(on a control plane host) to generate a new token and join command.

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
