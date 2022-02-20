---
title: "Changing the Container Runtime on a Node from Docker Engine to containerd"
weight: 8
content_type: task 
---

This task outlines the steps needed to update your container runtime to containerd from Docker. It is applicable for cluster operators running Kubernetes 1.23 or earlier. Also  this covers an example scenario for migrating from dockershim to containerd and alternative container runtimes can be picked from this [page](https://kubernetes.io/docs/setup/production-environment/container-runtimes/).

## {{% heading "prerequisites" %}}

{{% thirdparty-content %}}

Install containerd. For more information see, [containerd's installation documentation](https://containerd.io/docs/getting-started/) and for specific prerequisite follow [this](/docs/setup/production-environment/container-runtimes/#containerd).

## Drain the node 

```
# replace <node-to-drain> with the name of your node you are draining
kubectl drain <node-to-drain> --ignore-daemonsets
```
## Stop the Docker daemon

```shell
systemctl stop kubelet
systemctl disable docker.service --now
```

## Install Containerd

This [page](/docs/setup/production-environment/container-runtimes/#containerd) contains detailed steps to install containerd.

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Linux" %}}

1. Install the `containerd.io` package from the official Docker repositories. 
Instructions for setting up the Docker repository for your respective Linux distribution and installing the `containerd.io` package can be found at 
[Install Docker Engine](https://docs.docker.com/engine/install/#server).

2. Configure containerd:

   ```shell
   sudo mkdir -p /etc/containerd
   containerd config default | sudo tee /etc/containerd/config.toml
   ```

3. Restart containerd:

   ```shell
   sudo systemctl restart containerd
   ```

{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}

Start a Powershell session, set `$Version` to the desired version (ex: `$Version="1.4.3"`), and then run the following commands:

1. Download containerd:

   ```powershell
   curl.exe -L https://github.com/containerd/containerd/releases/download/v$Version/containerd-$Version-windows-amd64.tar.gz -o containerd-windows-amd64.tar.gz
   tar.exe xvf .\containerd-windows-amd64.tar.gz
   ```

2. Extract and configure:

   ```powershell
   Copy-Item -Path ".\bin\" -Destination "$Env:ProgramFiles\containerd" -Recurse -Force
   cd $Env:ProgramFiles\containerd\
   .\containerd.exe config default | Out-File config.toml -Encoding ascii

   # Review the configuration. Depending on setup you may want to adjust:
   # - the sandbox_image (Kubernetes pause image)
   # - cni bin_dir and conf_dir locations
   Get-Content config.toml

   # (Optional - but highly recommended) Exclude containerd from Windows Defender Scans
   Add-MpPreference -ExclusionProcess "$Env:ProgramFiles\containerd\containerd.exe"
   ```

3. Start containerd:

   ```powershell
   .\containerd.exe --register-service
   Start-Service containerd
   ```

{{% /tab %}}
{{< /tabs >}}

## Configure the kubelet to use containerd as its container runtime

Edit the file `/var/lib/kubelet/kubeadm-flags.env` and add the containerd runtime to the flags. `--container-runtime=remote` and `--container-runtime-endpoint=unix:///run/containerd/containerd.sock"`

For users using kubeadm should consider the following:

The `kubeadm` tool stores the CRI socket for each host as an annotation in the Node object for that host.

To change it you must do the following:

Execute `kubectl edit no <NODE-NAME>` on a machine that has the kubeadm `/etc/kubernetes/admin.conf` file.

This will start a text editor where you can edit the Node object.

To choose a text editor you can set the `KUBE_EDITOR` environment variable.

- Change the value of `kubeadm.alpha.kubernetes.io/cri-socket` from `/var/run/dockershim.sock`
   to the CRI socket path of your choice (for example `unix:///run/containerd/containerd.sock`).
   
   Note that new CRI socket paths must be prefixed with `unix://` ideally.

- Save the changes in the text editor, which will update the Node object.

## Restart the kubelet

```shell
systemctl start kubelet
```

## Verify that the node is healthy

Run `kubectl get nodes -o wide` and containerd appears as the runtime for the node we just changed.

## Remove Docker Engine

{{% thirdparty-content %}}

Finally if everything goes well remove docker

{{< tabs name="tab-remove-docker-enigine" >}}
{{% tab name="CentOS" %}}

```shell
sudo yum remove docker-ce docker-ce-cli
```
{{% /tab %}}
{{% tab name="Debian" %}}

```shell
sudo apt-get purge docker-ce docker-ce-cli
```
{{% /tab %}}
{{% tab name="Fedora" %}}

```shell
sudo dnf remove docker-ce docker-ce-cli
```
{{% /tab %}}
{{% tab name="Ubuntu" %}}

```shell
sudo apt-get purge docker-ce docker-ce-cli
```
{{% /tab %}}
{{< /tabs >}}