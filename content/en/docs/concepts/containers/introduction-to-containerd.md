---
reviewers:
- ridavid2002
title: Introduction to Containerd
content_type: concept
---

<!-- overview -->

This page walks you through the overall process of reviewing the containerd configuration file along with how to list the containerd containers.

## {{% heading "prerequisites" %}}

This requires access to a cluster where containerd is configured.

## Access The Management Cluster

To access the management cluster from within a bastion, you need the IP of the management cluster.

<!-- steps -->

1. From the deployment host, obtain the `INTERNAL-IP` related to the `control-plane,master` role for the next step:

    ```shell
    deploymentMachine:~$ kubectl get nodes -o wide -n <namespace>

    NAME                 STATUS   ROLES                  AGE   VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE       KERNEL-VERSION                      CONTAINER-RUNTIME
    kind-control-plane   Ready    control-plane,master   63m   v1.21.1   172.18.0.3    <none>        Ubuntu 21.04   5.10.60.1-microsoft-standard-WSL2   containerd://1.5.2
    ```

1. SSH into the bastion

    ```shell
    deploymentMachine:~$ ssh -i "key.pem" ubuntu@10-0-1-2
    ```

1. SSH into the management cluster

    ```shell
    ubuntu@ip-10-1-2-3:~$ ssh ubuntu@10.1.2.3
    ```

    {{< note >}}
    The default SSH information during cluster creation may work sufficiently for your needs, however, if you face permission issues, add your SSH key used to access the bastion <b><u>to</u></b> the bastion to use for accessing the management cluster.
    {{< /note >}}

## Containerd Configuration File

### Find Containerd Version

```shell
ubuntu@ip-10-1-2-3:~$ ctr version
Client:
  Version:  v1.5.2
  Revision: 36cc874494a56a253cd181a1a685b44b58a2e34a
  Go version: go1.16.4
```

### Locate Configuration File

The simplest solution is to utilize find and grep.

```shell
ubuntu@ip-10-1-2-3:~$ sudo find / | grep toml
/usr/share/python-wheels/pytoml-0.1.21-py2.py3-none-any.whl
/etc/containerd/config.toml
```

### Review Configuration File

```shell
ubuntu@ip-10-1-2-3:~$ cat /etc/containerd/config.toml
## template: jinja

# Use config version 2 to enable new configuration fields.
# Config file is parsed as version 1 by default.
version = 2

imports = ["/etc/containerd/conf.d/*.toml"]

[plugins]
  [plugins."io.containerd.grpc.v1.cri"]
    sandbox_image = "k8s.gcr.io/pause:3.5"
    [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
    runtime_type = "io.containerd.runc.v2"
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

## Containers In A Kubelet

### List Containers

```shell
ubuntu@ip-10-1-2-3:~$ sudo ctr --namespace k8s.io containers ls

CONTAINER                                                           IMAGE                                               RUNTIME
0540fb64f70ed4de6b487100365c7892d94652ac2bd5e3b4257b61d5e11cb57d    k8s.gcr.io/pause:3.5                                io.containerd.runc.v2
11f87d9d4c7f7637c302a2cec74aadad0db2cc6df3cba001c9ff7f4fb3b6c1c5    k8s.gcr.io/pause:3.5                                io.containerd.runc.v2
3ad8e1bd772bb68b78b8cdada5ca7cb5d836396376f204357f5b6e7330f57826    k8s.gcr.io/pause:3.5                                io.containerd.runc.v2
482809757cce884b97608314f665c5820ebc03ed5bdb5b9bd8d07fce9524285c    k8s.gcr.io/pause:3.5                                io.containerd.runc.v2
51a37c251400c520a0745fdf550a8f03264dac1e1bfd39bc7ece7198dd18bf61    k8s.gcr.io/kube-apiserver:v1.21.1                   io.containerd.runc.v2
53f8738259761c7ebed4fc944634cea9301235a300453062869aeee7a4f3652b    k8s.gcr.io/kube-proxy:v1.21.1                       io.containerd.runc.v2
6ce2dce4b3dbe7c7caeb9ba21a11f4dcc8836d229c251570226f3559ebecad8a    k8s.gcr.io/pause:3.5                                io.containerd.runc.v2
6db718378b52d7e7bdffe9f4cf6a903f66db942334b2a433c71585fda867c681    k8s.gcr.io/coredns/coredns:v1.8.0                   io.containerd.runc.v2
70145218b8052e5cf81697827c30c6e05f666e8c94683e45277ef8eb7f30dd5f    k8s.gcr.io/pause:3.5                                io.containerd.runc.v2
70f0ec2102e096b30125b58643fe10f410f8fb9aaab804fe98e3a7df990d451c    k8s.gcr.io/etcd:3.4.13-0                            io.containerd.runc.v2
75ebe05c0b516f953239c9a847929daa99adceb4afcc526bcdb710239deff846    k8s.gcr.io/pause:3.5                                io.containerd.runc.v2
7a5e43b0817b0272769e592a5aa49300b4480f66717b0084aa326529e5188fd0    k8s.gcr.io/coredns/coredns:v1.8.0                   io.containerd.runc.v2
867720fd84b7f2843fa777000d062e8a821e23bcdb84ea2d16b45d1b99cdaf97    k8s.gcr.io/pause:3.5                                io.containerd.runc.v2
94dbaa0513a1097a5d5adede0bf5d3386f62c738e59603304e1c4699251f5a78    k8s.gcr.io/pause:3.5                                io.containerd.runc.v2
```

As seen, we define a 'pause' image as default in containerd as well. This can be modified by updating the containerd configuration file.

{{< note >}}
```kubectl get pods```, does not show "pause" images, but ```ctr containers ls``` does, thats because pause images are not actual applications, but rather, they are containers that hold the network namespaces for the pods as discussed in, the [What is the role of 'pause' container](https://groups.google.com/g/kubernetes-users/c/jVjv0QK4b_o?pli=1) discussion. 
{{< /note >}}

## {{% heading "whatsnext" %}}

On Windows, containerd is also commonly used as of [containerd v1.3.0](https://github.com/containerd/containerd/releases/tag/v1.3.0-beta.0), to experiment with containerd on windows nodes, you can try out the [sig-windows-dev-tools](https://github.com/kubernetes-sigs/sig-windows-dev-tools) which installs a Kubernetes cluster with containerd running in both Linux as well as windows.

Learn more about [Getting started with containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md).
