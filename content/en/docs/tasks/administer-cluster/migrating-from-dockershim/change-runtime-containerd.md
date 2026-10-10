---
title: "Changing the Container Runtime on a Node from Docker Engine to containerd"
weight: 10
content_type: task 
---

This task outlines the steps needed to update your container runtime to containerd from Docker. It
is applicable for cluster operators running Kubernetes 1.23 or earlier. This also covers an
example scenario for migrating from dockershim to containerd. Alternative container runtimes
can be picked from this [page](/docs/setup/production-environment/container-runtimes/).

## {{% heading "prerequisites" %}}

{{% thirdparty-content %}}

Install containerd. For more information see
[containerd's installation documentation](https://containerd.io/docs/getting-started/)
and for specific prerequisite follow
[the containerd guide](/docs/setup/production-environment/container-runtimes/#containerd).

## Drain the node 

```shell
kubectl drain <node-to-drain> --ignore-daemonsets
```

Replace `<node-to-drain>` with the name of your node you are draining.

## Stop the Docker daemon

```shell
systemctl stop kubelet
systemctl disable docker.service --now
```

## Install Containerd

Follow the [guide](/docs/setup/production-environment/container-runtimes/#containerd)
for detailed steps to install containerd.

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Linux" %}}

1. Install the `containerd.io` package from the official Docker repositories. 
   Instructions for setting up the Docker repository for your respective Linux distribution and
   installing the `containerd.io` package can be found at 
   [Getting started with containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md).

1. Configure containerd:

   ```shell
   sudo mkdir -p /etc/containerd
   containerd config default | sudo tee /etc/containerd/config.toml
   ```
1. Restart containerd:

   ```shell
   sudo systemctl restart containerd
   ```
{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}

Start a Powershell session, set `$Version` to the desired version (ex: `$Version="1.4.3"`), and
then run the following commands:

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

Edit the file `/var/lib/kubelet/kubeadm-flags.env` and add the containerd runtime to the flags;
`--container-runtime-endpoint=unix:///run/containerd/containerd.sock`.

Users using kubeadm should be aware that the kubeadm tool stores the host's CRI socket in the 

`/var/lib/kubelet/instance-config.yaml` file on each node. You can create this `/var/lib/kubelet/instance-config.yaml` file on the node.

The `/var/lib/kubelet/instance-config.yaml` file allows setting the `containerRuntimeEndpoint` parameter. 

You can set this parameter's value to the path of your chosen CRI socket (for example `unix:///run/containerd/containerd.sock`).

## Restart the kubelet

```shell
systemctl start kubelet
```

## Verify that the node is healthy

Run `kubectl get nodes -o wide` and containerd appears as the runtime for the node we just changed.

## Remove Docker Engine

{{% thirdparty-content %}}

If the node appears healthy, remove Docker.

{{< tabs name="tab-remove-docker-engine" >}}
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

The preceding commands don't remove images, containers, volumes, or customized configuration files on your host.
To delete them, follow Docker's instructions to [Uninstall Docker Engine](https://docs.docker.com/engine/install/ubuntu/#uninstall-docker-engine).

{{< caution >}}
Docker's instructions for uninstalling Docker Engine create a risk of deleting containerd. Be careful when executing commands.
{{< /caution >}}

## Uncordon the node 

```shell
kubectl uncordon <node-to-uncordon>
```

Replace `<node-to-uncordon>` with the name of your node you previously drained.
