---
title: Adding Windows nodes
min-kubernetes-server-version: 1.17
content_type: task
weight: 110
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

You can use Kubernetes to run a mixture of Linux and Windows nodes, so you can mix Pods that run on Linux on with Pods that run on Windows. This page shows how to register Windows nodes to your cluster.


## {{% heading "prerequisites" %}}
 
 {{< version-check >}}
* Obtain a [Windows Server 2019 license](https://www.microsoft.com/en-us/windows-server/pricing) (or higher) in order to configure the Windows node that hosts Windows containers. If you are using VXLAN/Overlay networking you must have also have [KB4489899](https://support.microsoft.com/en-gb/topic/march-12-2019-kb4489899-os-build-17763-379-2a91a5c5-f351-f181-5501-510308a4030f) installed.
* A Linux-based Kubernetes kubeadm cluster in which you have access to the control plane (see [Creating a cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)).


<!-- steps -->


## Getting Started: Adding a Windows Node to Your Cluster

### Networking Configuration

Once you have a Linux-based Kubernetes control-plane node you are ready to choose a networking solution. This guide illustrates using Flannel in VXLAN mode for simplicity.

### Configuring Flannel

1.  Prepare Kubernetes control plane for Flannel

    Some minor preparation is recommended on the Kubernetes control plane in our cluster. It is recommended to enable bridged IPv4 traffic to iptables chains when using Flannel. The following command must be run on all Linux nodes:

    ```powershell
    sudo sysctl net.bridge.bridge-nf-call-iptables=1
    ```

2. Download & configure Flannel for Linux
      
   Download the most recent Flannel manifest:

    ```powershell
    wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
    ```
    Modify the `net-conf.json` section of the flannel manifest in order to set the VNI to 4096 and the Port to 4789. It should look as follows:

    ```powershell
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

{{< note >}}
The VNI must be set to 4096 and port 4789 for Flannel on Linux to interoperate with Flannel on Windows. See the [VXLAN documentation](https://github.com/flannel-io/flannel/blob/master/Documentation/backends.md#vxlan). for an explanation of these fields.
{{< /note >}}

{{< note >}}
To use L2Bridge/Host-gateway mode instead change the value of `Type` to `"host-gw"` and omit `VNI` and `Port`.
{{< /note >}}

3.  Apply the Flannel manifest and validate
    
    Let's apply the Flannel configuration:

    ```powershell
    kubectl apply -f kube-flannel.yml
    ```
    After a few minutes, you should see all the pods as running if the Flannel pod network was deployed.

    ```powershell
    kubectl get pods -n kube-system
    ```

    The output should include the Linux flannel DaemonSet as running:

    ```shell
    NAMESPACE     NAME                                      READY        STATUS    RESTARTS   AGE
    ...
    kube-system   kube-flannel-ds-54954                     1/1          Running   0          1m
    ```
4.  Add Windows Flannel and kube-proxy DaemonSets

    Now you can add Windows-compatible versions of Flannel and kube-proxy. In order to ensure that you get a compatible version of kube-proxy, you'll need to substitute the tag of the image. The following example shows usage for Kubernetes v{{< skew currentVersion >}}, but you should adjust the version for your own deployment.

    ```powershell
    curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/kube-proxy.yml | sed 's/VERSION/v{{< skew currentVersion >}}/g' | kubectl apply -f -kubectl apply -f https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-overlay.yml
    ```

{{< note >}}
If you're using host-gateway use https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-host-gw.yml instead
{{< /note >}}

  {{< note >}}
If you're using a different interface rather than Ethernet (i.e. "Ethernet0 2") on the Windows nodes, you have to modify the line: `powershell wins cli process run --path /k/flannel/setup.exe --args "--mode=overlay --interface=Ethernet"` in the `flannel-host-gw.yml` or `flannel-overlay.yml` file and specify your interface accordingly. `bash # Example curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-overlay.yml | sed 's/Ethernet/Ethernet0 2/g' | kubectl apply -f -`
{{< /note >}}

### Joining a Windows worker node


{{< note >}}
You must install the `Containers` feature and install Docker. Instructions to do so are available at [Install Docker Engine - Enterprise on Windows Servers](https://docs.docker.com/desktop/install/windows-install/#install-docker-engine---enterprise).
{{< /note >}}

{{< note >}}
All code snippets in Windows sections are to be run in a PowerShell environment with elevated permissions (Administrator) on the Windows worker node.
{{< /note >}}

1.  Install wins, kubelet, and kubeadm.

    ```powershell
    curl.exe -LO https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/PrepareNode.ps1.\PrepareNode.ps1 -KubernetesVersion v{{< skew currentVersion >}}
    ```

2. Run kubeadm to join the node

   Use the command that was given to you when you ran `kubeadm init` on a control plane host. If you no longer have this command, or the token has expired, you can run `kubeadm token create --print-join-command` (on a control plane host) to generate a new token and join command.


### Verifying your installation


1.  You should now be able to view the Windows node in your cluster by running:

    ```powershell
    kubectl get nodes -o wide
    ```

2. If your new node is in the `NotReady` state it is likely because the flannel image is still downloading. You can check the progress as before by checking on the flannel pods in the `kube-system` namespace: 

    ```powershell
    kubectl -n kube-system get pods -l app=flannel
    ```

  Once the flannel Pod is running, your node should enter the `Ready` state and then be available to handle workloads.


  
 ## {{% heading "whatsnext" %}}

* See how to [Upgrade Windows nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/).
