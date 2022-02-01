---
title: "Changing the container runtime from Docker Engine to containerd"
weight: 8
content_type: task 
---
This task outlines the steps needed to update your container runtime to containerd from Docker. It is applicable for cluster operators running Kubernetes 1.23 or earlier. 

## {{% heading "prerequisites" %}}

{{% thirdparty-content %}}

Install containerd. For more information see, [containerd's installation documentation](https://containerd.io/docs/getting-started/) and for specific prerequisite follow [this](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#containerd)

## {{% heading "Drain Node" %}} 
```
# replace <node-to-drain> with the name of your node you are draining
kubectl drain <node-to-drain> --ignore-daemonsets
```
## {{% heading "Stop the Docker daemon" %}}

```
systemctl stop kubelet
systemctl stop docker
```

## {{% heading "Install Containerd" %}} 

## Migrate a Linux node {#migration-linux}

The details of this are explained [here](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#containerd) 

## Migrate a Windows node {#migrate-windows-powershell}

The details of this are explained [here](https://kubernetes.io/docs/setup/production-environment/container-runtimes/#containerd)

## Configure the kubelet to use containerd as its container runtime {#use-containerd-as-runtime}

Edit the file `/var/lib/kubelet/kubeadm-flags.env` and add the containerd runtime to the flags. `--container-runtime=remote` and `--container-runtimeendpoint=unix:///run/containerd/containerd.sock"`

For users using kubeadm should consider the following:
Kubeadm stores the CRI socket for each host as an annotation in the Node object for that host.
To change it you must do the following:
-Execute `kubectl edit no <NODE-NAME>` on a machine that has the kubeadm `/etc/kubernetes/admin.conf` file.
This will start a text editor where you can edit the Node object.
To choose a text editor you can set the `KUBE_EDITOR` environment variable.
- Change the value of `kubeadm.alpha.kubernetes.io/cri-socket` from `/var/run/dockershim.sock`to the CRI socket path of your chose (for example `unix:///run/containerd/containerd.sock`).
Note that new CRI socket paths must be prefixed with `unix://` ideally.
- Save the changes in the text editor, which will update the Node object.

{{% heading "Restart kubelet" %}}

\```shell
systemctl start kubelet
\```

{{%heading "verify pods are running" %}}

Run `kubectl get nodes -o wide` and containerd appears as the runtime for the node we just changed.

{{%heading "Remove Docker" %}}

{{% thirdparty-content %}}

Finally if everything goes well remove docker
\```shell
apt purge docker-ce docker-ce-cli
OR
yum remove docker-ce docker-ce-cli
\```



