---
reviewers:
- vincepri
- bart0sh
title: Container Runtimes
content_type: concept
weight: 20
---
<!-- overview -->

{{% dockershim-removal %}}

Você precisa instalar um
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
dentro de cada node do cluster de modo que os Pods possam ser executados. Esta pagina descreve
o que está envolvido e quais as tarefas relacionadas para configurar nodes.

Kubernetes {{< skew currentVersion >}} requer que você use uma runtime que
esteja em conformidade com
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI).

Veja [CRI version support](#cri-versions) para mais informações.

Esta página fornece um resumo de como usar vários tipos mais comuns de container runtimes com
Kubernetes.

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)

{{< note >}}
Versões do Kubernetes anteriores a v1.24 incluiam uma integração direta com o Docker Engine,
usando um componente chamado _dockershim_. Esta integração direta especial não faz mais parte do
Kubernetes (essa remoção foi
[anunciada](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)
como parte da liberação v1.20).
Você pode ler
[Verifique se a remoção do Dockershim afeta você](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
para compreender como essa remoção pode afetá-lo. Para saber mais sobre a migração de uma utilização com dockershim, veja
[Migrando do dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/).

Se você estiver executando uma versão do Kubernetes diferente da v{{< skew currentVersion >}},
verifique a documentação dessa versão.
{{< /note >}}


<!-- body -->
## Instalar e configurar pré-requisitos

As etapas a seguir aplicam as configurações mais comuns para nodes do Kubernetes no Linux. 

Você pode pular uma configuração específica se tiver certeza de que não precisa dela.

Para mais informações, veja [Network Plugin Requirements](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#network-plugin-requirements) ou a documentação para o seu container runtime específico.

### Encaminhando IPv4 e deixando que o iptables veja bridged traffic (tráfego em modo bridge)

Verifique se o `br_netfilter` está cerragado e sendo executado `lsmod | grep br_netfilter`. 

Para carregá-lo explicitamente, execute `sudo modprobe br_netfilter`.

Para que o iptables de node's Linux veja corretamente o tráfego em modo bridge, verifique se `net.bridge.bridge-nf-call-iptables` está setado como 1 em seu `sysctl` config. Por exemplo:

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# sysctl parãmetros exigidos pela configuração, os parâmetros persistem nas reinicializações
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# Aplicar sysctl parâmetros sem reiniciar
sudo sysctl --system
```

## Cgroup drivers

No Linux, {{< glossary_tooltip text="control groups" term_id="cgroup" >}}
são usados ​​para restringir os recursos que são alocados aos processos.

Ambos {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} e o 
 container runtime inplícito precisam interagir com control groups para impor
[resource management for pods and containers](/docs/concepts/configuration/manage-resources-containers/) e definir
recursos como cpu/memory e limites de requisição. Para interagir com control
groups, o kubelet e o container runtime precisam usar um *cgroup driver*.
É extremamente necessário que o kubelet e o container runtime utilizem o mesmo cgroup
driver e que estejam configurados da mesma maneira.

Existem dois cgroup drivers disponíveis:

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)

### cgroupfs driver {#cgroupfs-cgroup-driver}

O `cgroupfs` driver é o cgroup driver padrão no kubelet. Quando o  `cgroupfs`
driver é utilizado, o kubelet e o container runtime interagem diretamente com o
cgroup do sistema de arquivos para configurar cgroups.

O `cgroupfs` driver **não** é recomendado quando
[systemd](https://www.freedesktop.org/wiki/Software/systemd/) é o 
init system porque o systemd espera um único gerenciado cgroup no 
sistema. Além disso, se você utilizar [cgroup v2](/docs/concepts/architecture/cgroups)
, utilize o  `systemd` cgroup driver ao invés do
`cgroupfs`.

### systemd cgroup driver {#systemd-cgroup-driver}

When [systemd](https://www.freedesktop.org/wiki/Software/systemd/) is chosen as the init
system for a Linux distribution, the init process generates and consumes a root control group
(`cgroup`) and acts as a cgroup manager.

systemd has a tight integration with cgroups and allocates a cgroup per systemd
unit. As a result, if you use `systemd` as the init system with the `cgroupfs`
driver, the system gets two different cgroup managers.

Two cgroup managers result in two views of the available and in-use resources in
the system. In some cases, nodes that are configured to use `cgroupfs` for the
kubelet and container runtime, but use `systemd` for the rest of the processes become
unstable under resource pressure.

The approach to mitigate this instability is to use `systemd` as the cgroup driver for
the kubelet and the container runtime when systemd is the selected init system.

To set `systemd` as the cgroup driver, edit the
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/)
option of `cgroupDriver` and set it to `systemd`. For example:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
...
cgroupDriver: systemd
```

If you configure `systemd` as the cgroup driver for the kubelet, you must also
configure `systemd` as the cgroup driver for the container runtime. Refer to
the documentation for your container runtime for instructions. For example:

*  [containerd](#containerd-systemd)
*  [CRI-O](#cri-o)

{{< caution >}}
Changing the cgroup driver of a Node that has joined a cluster is a sensitive operation.
If the kubelet has created Pods using the semantics of one cgroup driver, changing the container
runtime to another cgroup driver can cause errors when trying to re-create the Pod sandbox
for such existing Pods. Restarting the kubelet may not solve such errors.

If you have automation that makes it feasible, replace the node with another using the updated
configuration, or reinstall it using automation.
{{< /caution >}}


### Migrating to the `systemd` driver in kubeadm managed clusters

If you wish to migrate to the `systemd` cgroup driver in existing kubeadm managed clusters,
follow [configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).

## CRI version support {#cri-versions}

Your container runtime must support at least v1alpha2 of the container runtime interface.

Kubernetes {{< skew currentVersion >}}  defaults to using v1 of the CRI API.
If a container runtime does not support the v1 API, the kubelet falls back to
using the (deprecated) v1alpha2 API instead.

## Container runtimes

{{% thirdparty-content %}}

### containerd

This section outlines the necessary steps to use containerd as CRI runtime.

Use the following commands to install Containerd on your system:

Follow the instructions for [getting started with containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md). Return to this step once you've created a valid configuration file, `config.toml`. 

{{< tabs name="Finding your config.toml file" >}}
{{% tab name="Linux" %}}
You can find this file under the path `/etc/containerd/config.toml`.
{{% /tab %}}
{{% tab name="Windows" %}}
You can find this file under the path `C:\Program Files\containerd\config.toml`.
{{% /tab %}}
{{< /tabs >}}

On Linux the default CRI socket for containerd is `/run/containerd/containerd.sock`.
On Windows the default CRI endpoint is `npipe://./pipe/containerd-containerd`.

#### Configuring the `systemd` cgroup driver {#containerd-systemd}

To use the `systemd` cgroup driver in `/etc/containerd/config.toml` with `runc`, set

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

The `systemd` cgroup driver is recommended if you use [cgroup v2](/docs/concepts/architecture/cgroups).

{{< note >}}
If you installed containerd from a package (for example, RPM or `.deb`), you may find
that the CRI integration plugin is disabled by default.

You need CRI support enabled to use containerd with Kubernetes. Make sure that `cri`
is not included in the`disabled_plugins` list within `/etc/containerd/config.toml`;
if you made changes to that file, also restart `containerd`.
{{< /note >}}

If you apply this change, make sure to restart containerd:

```shell
sudo systemctl restart containerd
```

When using kubeadm, manually configure the
[cgroup driver for kubelet](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/#configuring-the-kubelet-cgroup-driver).

#### Overriding the sandbox (pause) image {#override-pause-image-containerd}

In your [containerd config](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) you can overwrite the
sandbox image by setting the following config:

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.2"
```

You might need to restart `containerd` as well once you've updated the config file: `systemctl restart containerd`.

### CRI-O

This section contains the necessary steps to install CRI-O as a container runtime.

To install CRI-O, follow [CRI-O Install Instructions](https://github.com/cri-o/cri-o/blob/main/install.md#readme).

#### cgroup driver

CRI-O uses the systemd cgroup driver per default, which is likely to work fine
for you. To switch to the `cgroupfs` cgroup driver, either edit
`/etc/crio/crio.conf` or place a drop-in configuration in
`/etc/crio/crio.conf.d/02-cgroup-manager.conf`, for example:

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

You should also note the changed `conmon_cgroup`, which has to be set to the value
`pod` when using CRI-O with `cgroupfs`. It is generally necessary to keep the
cgroup driver configuration of the kubelet (usually done via kubeadm) and CRI-O
in sync.

For CRI-O, the CRI socket is `/var/run/crio/crio.sock` by default.

#### Overriding the sandbox (pause) image {#override-pause-image-cri-o}

In your [CRI-O config](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md) you can set the following
config value:

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.6"
```

This config option supports live configuration reload to apply this change: `systemctl reload crio` or by sending
`SIGHUP` to the `crio` process.

### Docker Engine {#docker}

{{< note >}}
These instructions assume that you are using the
[`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) adapter to integrate
Docker Engine with Kubernetes.
{{< /note >}}

1. On each of your nodes, install Docker for your Linux distribution as per
  [Install Docker Engine](https://docs.docker.com/engine/install/#server).

2. Install [`cri-dockerd`](https://github.com/Mirantis/cri-dockerd), following
   the instructions in that source code repository.

For `cri-dockerd`, the CRI socket is `/run/cri-dockerd.sock` by default.

### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/20.10/overview.html) (MCR) is a commercially
available container runtime that was formerly known as Docker Enterprise Edition.

You can use Mirantis Container Runtime with Kubernetes using the open source
[`cri-dockerd`](https://github.com/Mirantis/cri-dockerd) component, included with MCR.

To learn more about how to install Mirantis Container Runtime,
visit [MCR Deployment Guide](https://docs.mirantis.com/mcr/20.10/install.html).

Check the systemd unit named `cri-docker.socket` to find out the path to the CRI
socket.

#### Overriding the sandbox (pause) image {#override-pause-image-cri-dockerd-mcr}

The `cri-dockerd` adapter accepts a command line argument for
specifying which container image to use as the Pod infrastructure container (“pause image”).
The command line argument to use is `--pod-infra-container-image`.

## {{% heading "whatsnext" %}}

As well as a container runtime, your cluster will need a working
[network plugin](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model).
