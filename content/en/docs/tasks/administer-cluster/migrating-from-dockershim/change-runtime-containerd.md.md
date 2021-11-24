---
title: "Migrating Container runtime from dockershim to containerd"
weight: 10
content_type: task 
---

- Drain Node
```
# replace <node-to-drain> with the name of your node you are draining
kubectl drain <node-to-drain> --ignore-daemonsets
```
- Stop the Docker daemon
```
systemctl stop kubelet
systemctl stop docker
```
- Install & start containerd 


### For Linux systems
Use the following commands to install Containerd on your system:

Install and configure prerequisites:

```shell
cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# Setup required sysctl params, these persist across reboots.
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

Install containerd:

1. Install the `containerd.io` package from the official Docker repositories. 
   You can find instructions for installing `containerd` at
   [Starting Containerd](https://containerd.io/docs/getting-started/#starting-containerd).

2. Configure containerd:

   ```shell
   sudo mkdir -p /etc/containerd
   containerd config default | sudo tee /etc/containerd/config.toml
   ```

3. Restart containerd:

   ```shell
   sudo systemctl restart containerd
   ```
### For windows powershell

Start a Powershell session, set `$Version` to the desired version (ex: `$Version=1.4.3`), 
and then run the following commands:

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
- configure kubelet to use containerd

   Edit the file `/var/lib/kubelet/kubeadm-flags.env` and add the containerd runtime to the flags. `--container-runtime=remote` and `--container-runtimeendpoint=unix:///run/containerd/containerd.sock"`

   For users using kubeadm should consider the following:
   
   Kubeadm stores the CRI socket for each host as an annotation in the Node object for that host.
   To change it you must do the following:
   ```
      - Execute `kubectl edit no <NODE-NAME>` on a machine that has the kubeadm `/etc/kubernetes/admin.conf` file.
      
      This will start a text editor where you can edit the Node object.
      
      To choose a text editor you can set the `KUBE_EDITOR` environment variable.
          - Change the value of `kubeadm.alpha.kubernetes.io/cri-socket` from `/var/run/dockershim.sock`to the CRI socket path of your chose (for example `unix:///run/containerd/containerd.sock`).
   
   Note that new CRI socket paths must be prefixed with `unix://` ideally.
    - Save the changes in the text editor, which will update the   Node object.
   ```
      
   

- restart kubelet
`systemctl start kubelet`

- verify pods are running 
Run `kubectl get nodes -o wide` and containerd appears as the runtime for the node we just changed.

- finally if everything goes well remove docker
   ```
   apt purge docker-ce docker-ce-cli
   OR
   yum remove docker-ce docker-ce-cli
   ```



