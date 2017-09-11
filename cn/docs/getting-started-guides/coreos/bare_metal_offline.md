---
approvers:
- erictune
- thockin
title: Offline
---

本文档介绍了如何在CoreOS系统上部署Kubernetes。主要针对需要在离线环境下部署的场景，无论您是真实部署前的POC测试还是由于应用程序受限必须在离线环境中使用，本文档都是适用的。

* TOC
{:toc}


## 前提条件

1. 安装了 *CentOS 6* 系统的PXE服务器
2. 集群中需要至少两台物理裸机节点

## 概要设计

1. 管理tftp目录
  * /tftpboot/(coreos)(centos)(RHEL)
  * /tftpboot/pxelinux.0/(MAC) -> 链接到Linux镜像配置文件
2. 安装时更新pxelinux链接
3. 更新DHCP配置，添加所需要部署的主机的相关信息
4. 创建一个etcd集群
5. 确保集群处于离线环境[etcd discovery tool](https://discovery.etcd.io/).
6. 安装配置CoreOS slave节点作为Kubernetes节点

## 本文档定义的一些变量

| Node Description              | MAC               | IP          |
| :---------------------------- | :---------------: | :---------: |
| CoreOS/etcd/Kubernetes Master | d0:00:67:13:0d:00 | 10.20.30.40 |
| CoreOS Slave 1                | d0:00:67:13:0d:01 | 10.20.30.41 |
| CoreOS Slave 2                | d0:00:67:13:0d:02 | 10.20.30.42 |


## 设置PXELINUX CentOS

请参阅[这篇指南](http://docs.fedoraproject.org/en-US/Fedora/7/html/Installation_Guide/ap-pxe-server.html)以了解完整的CentOS PXELINUX环境设置步骤。本节内容仅是上述指南文档的概要缩写版本。

1. 安装CentOS上所需要的相关软件包

```shell
sudo yum install tftp-server dhcp syslinux
```

2. 编辑`/etc/xinetd.d/tftp`文件以启用tftp服务

```conf
disable = no
```

3. 拷贝所需的syslinux镜像文件

```shell
su -
mkdir -p /tftpboot
cd /tftpboot
cp /usr/share/syslinux/pxelinux.0 /tftpboot
cp /usr/share/syslinux/menu.c32 /tftpboot
cp /usr/share/syslinux/memdisk /tftpboot
cp /usr/share/syslinux/mboot.c32 /tftpboot
cp /usr/share/syslinux/chain.c32 /tftpboot

/sbin/service dhcpd start
/sbin/service xinetd start
/sbin/chkconfig tftp on
```

4. 设置默认引导菜单

```shell
mkdir /tftpboot/pxelinux.cfg
touch /tftpboot/pxelinux.cfg/default
```

5. 编辑默认引导菜单`/tftpboot/pxelinux.cfg/default`

```conf
default menu.c32
prompt 0
timeout 15
ONTIMEOUT local
display boot.msg

MENU TITLE Main Menu

LABEL local
        MENU LABEL Boot local hard drive
        LOCALBOOT 0
```

至此，您应当已经配置好一个可用的PXELINUX环境用来运行CoreOS节点了。您可以使用VirtualBox或者在物理裸机上对PXELINUX环境所提供的服务进行验证。

## 添加CoreOS至PXE

本节描述在已有PXELINUX环境的前提下，如何配置CoreOS镜像与之并存。

1. 查找或者创建TFTP根目录，后续所有步骤都将基于此目录。
    * 本文中我们假设`/tftpboot`是根目录。
2. tftp根目录准备好后，我们将为CoreOS镜像创建一个新的目录结构。
3. 下载由CoreOS团队提供的CoreOS PXE相关文件。

```shell
MY_TFTPROOT_DIR=/tftpboot
mkdir -p $MY_TFTPROOT_DIR/images/coreos/
cd $MY_TFTPROOT_DIR/images/coreos/
wget http://stable.release.core-os.net/amd64-usr/current/coreos_production_pxe.vmlinuz
wget http://stable.release.core-os.net/amd64-usr/current/coreos_production_pxe.vmlinuz.sig
wget http://stable.release.core-os.net/amd64-usr/current/coreos_production_pxe_image.cpio.gz
wget http://stable.release.core-os.net/amd64-usr/current/coreos_production_pxe_image.cpio.gz.sig
gpg --verify coreos_production_pxe.vmlinuz.sig
gpg --verify coreos_production_pxe_image.cpio.gz.sig
```

4. 再次编辑菜单`/tftpboot/pxelinux.cfg/default`

```conf
default menu.c32
prompt 0
timeout 300
ONTIMEOUT local
display boot.msg

MENU TITLE Main Menu

LABEL local
        MENU LABEL Boot local hard drive
        LOCALBOOT 0

MENU BEGIN CoreOS Menu

    LABEL coreos-master
        MENU LABEL CoreOS Master
        KERNEL images/coreos/coreos_production_pxe.vmlinuz
        APPEND initrd=images/coreos/coreos_production_pxe_image.cpio.gz cloud-config-url=http://<xxx.xxx.xxx.xxx>/pxe-cloud-config-single-master.yml

    LABEL coreos-slave
        MENU LABEL CoreOS Slave
        KERNEL images/coreos/coreos_production_pxe.vmlinuz
        APPEND initrd=images/coreos/coreos_production_pxe_image.cpio.gz cloud-config-url=http://<xxx.xxx.xxx.xxx>/pxe-cloud-config-slave.yml
MENU END
```

此文件配置了系统将从本地磁盘引导，但添加了从PXE CoreOS镜像引导的选项。

## DHCP配置

本节将介绍如何配置DHCP服务器分发新的镜像。这里我们假设集群中有其他的服务器需要从不同的CoreOS镜像引导。

1. 添加`filename`字段到 _host_ 或者 _subnet_ 部分。

```conf
filename "/tftpboot/pxelinux.0";
```

2. 现在，我们可以创建pxelinux配置文件，这些配置将来也可以作为其他不同CoreOS部署的模版。

```conf
subnet 10.20.30.0 netmask 255.255.255.0 {
        next-server 10.20.30.242;
        option broadcast-address 10.20.30.255;
        filename "<other default image>";

        ...
        # http://www.syslinux.org/wiki/index.php/PXELINUX
        host core_os_master {
                hardware ethernet d0:00:67:13:0d:00;
                option routers 10.20.30.1;
                fixed-address 10.20.30.40;
                option domain-name-servers 10.20.30.242;
                filename "/pxelinux.0";
        }
        host core_os_slave {
                hardware ethernet d0:00:67:13:0d:01;
                option routers 10.20.30.1;
                fixed-address 10.20.30.41;
                option domain-name-servers 10.20.30.242;
                filename "/pxelinux.0";
        }
        host core_os_slave2 {
                hardware ethernet d0:00:67:13:0d:02;
                option routers 10.20.30.1;
                fixed-address 10.20.30.42;
                option domain-name-servers 10.20.30.242;
                filename "/pxelinux.0";
        }
        ...
}
```

稍后我们将介绍节点的配置。

## Kubernetes

部署以上配置前，需要首先创建一个`etcd`主节点(master)。为了做到这一点，我们需要使用一个特殊的cloud-config.yaml来pxe CoreOS，可以有两种方式：
1. 第一种方式是将云配置文件模版化，然后通过编程的方式为不同的集群提供不同的配置。
2. 第二种方式是运行一个服务发现协议从而可以在云环境中做服务的自动发现。

在本示例中，我们将通过静态方式创建一个etcd服务器，用于运行Kubernetes主控组件，并用作etcd主节点。

由于我们的集群处于一个离线的环境中，所以大部分的CoreOS和Kubernetes帮助进程是受限的。为了完成部署，我们需要下载Kubernetes的各个可执行文件到本地然后再启动运行。

一种简单的方案是在DHCP/TFTP主机上搭建一个简易的web服务器，从而环境中的CoreOS PXE机器可以从其上下载各个可执行文件。

为了达到这一目标，我们将启动一个`apache`服务器并提供运行Kubernetes所需要的各个可执行文件。

以下脚本运行在上文中准备好的PXE服务器上：

```shell
rm /etc/httpd/conf.d/welcome.conf
cd /var/www/html/
wget -O kube-register  https://github.com/kelseyhightower/kube-register/releases/download/v0.0.2/kube-register-0.0.2-linux-amd64
wget -O setup-network-environment https://github.com/kelseyhightower/setup-network-environment/releases/download/v1.0.0/setup-network-environment
wget https://storage.googleapis.com/kubernetes-release/release/v0.15.0/bin/linux/amd64/kubernetes
wget https://storage.googleapis.com/kubernetes-release/release/v0.15.0/bin/linux/amd64/kube-apiserver
wget https://storage.googleapis.com/kubernetes-release/release/v0.15.0/bin/linux/amd64/kube-controller-manager
wget https://storage.googleapis.com/kubernetes-release/release/v0.15.0/bin/linux/amd64/kube-scheduler
wget https://storage.googleapis.com/kubernetes-release/release/v0.15.0/bin/linux/amd64/kubectl
wget https://storage.googleapis.com/kubernetes-release/release/v0.15.0/bin/linux/amd64/kubecfg
wget https://storage.googleapis.com/kubernetes-release/release/v0.15.0/bin/linux/amd64/kubelet
wget https://storage.googleapis.com/kubernetes-release/release/v0.15.0/bin/linux/amd64/kube-proxy
wget -O flanneld https://storage.googleapis.com/k8s/flanneld
```

以上脚本将准备好运行Kubernetes所需的所有可执行文件。未来这些文件将可通过互联网直接进行更新。

现在可以开始准备部署了！

## 云平台配置

以下Kubernetes离线版本部署配置文件经过了一定的裁减。

以下内容基于配置文件: [master.yml](/docs/getting-started-guides/coreos/cloud-configs/master.yaml), 以及[node.yml](/docs/getting-started-guides/coreos/cloud-configs/node.yaml)

将文件中的一些占位字段做如下修改：

 - 使用您的PXE服务器的ip地址替换文件中的`<PXE_SERVER_IP>` (例如10.20.30.242)
 - 使用Kubernetes master节点的ip地址替换文件中的`<MASTER_SERVER_IP>` (例如10.20.30.40)
 - 如果您使用私有docker镜像仓库，请使用您的镜像仓库DNS名字替换文件中的`rdocker.example.com`
 - 如果您使用代理，请用代理服务器地址（包含端口）替换文件中的`rproxy.example.com`
 - 在配置文件最后添加您的SSH公钥

### master.yml

在PXE服务器上创建并编辑文件`/var/www/html/coreos/pxe-cloud-config-master.yml`。

```yaml
#cloud-config
---
write_files:
  - path: /opt/bin/waiter.sh
    owner: root
    content: |
      #! /usr/bin/bash
      until curl http://127.0.0.1:4001/v2/machines; do sleep 2; done
  - path: /opt/bin/kubernetes-download.sh
    owner: root
    permissions: 0755
    content: |
      #! /usr/bin/bash
      /usr/bin/wget -N -P "/opt/bin" "http://<PXE_SERVER_IP>/kubectl"
      /usr/bin/wget -N -P "/opt/bin" "http://<PXE_SERVER_IP>/kubernetes"
      /usr/bin/wget -N -P "/opt/bin" "http://<PXE_SERVER_IP>/kubecfg"
      chmod +x /opt/bin/*
  - path: /etc/profile.d/opt-path.sh
    owner: root
    permissions: 0755
    content: |
      #! /usr/bin/bash
      PATH=$PATH/opt/bin
coreos:
  units:
    - name: 10-eno1.network
      runtime: true
      content: |
        [Match]
        Name=eno1
        [Network]
        DHCP=yes
    - name: 20-nodhcp.network
      runtime: true
      content: |
        [Match]
        Name=en*
        [Network]
        DHCP=none
    - name: get-kube-tools.service
      runtime: true
      command: start
      content: |
        [Service]
        ExecStartPre=-/usr/bin/mkdir -p /opt/bin
        ExecStart=/opt/bin/kubernetes-download.sh
        RemainAfterExit=yes
        Type=oneshot
    - name: setup-network-environment.service
      command: start
      content: |
        [Unit]
        Description=Setup Network Environment
        Documentation=https://github.com/kelseyhightower/setup-network-environment
        Requires=network-online.target
        After=network-online.target
        [Service]
        ExecStartPre=-/usr/bin/mkdir -p /opt/bin
        ExecStartPre=/usr/bin/wget -N -P /opt/bin http://<PXE_SERVER_IP>/setup-network-environment
        ExecStartPre=/usr/bin/chmod +x /opt/bin/setup-network-environment
        ExecStart=/opt/bin/setup-network-environment
        RemainAfterExit=yes
        Type=oneshot
    - name: etcd.service
      command: start
      content: |
        [Unit]
        Description=etcd
        Requires=setup-network-environment.service
        After=setup-network-environment.service
        [Service]
        EnvironmentFile=/etc/network-environment
        User=etcd
        PermissionsStartOnly=true
        ExecStart=/usr/bin/etcd \
        --name ${DEFAULT_IPV4} \
        --addr ${DEFAULT_IPV4}:4001 \
        --bind-addr 0.0.0.0 \
        --cluster-active-size 1 \
        --data-dir /var/lib/etcd \
        --http-read-timeout 86400 \
        --peer-addr ${DEFAULT_IPV4}:7001 \
        --snapshot true
        Restart=always
        RestartSec=10s
    - name: fleet.socket
      command: start
      content: |
        [Socket]
        ListenStream=/var/run/fleet.sock
    - name: fleet.service
      command: start
      content: |
        [Unit]
        Description=fleet daemon
        Wants=etcd.service
        After=etcd.service
        Wants=fleet.socket
        After=fleet.socket
        [Service]
        Environment="FLEET_ETCD_SERVERS=http://127.0.0.1:4001"
        Environment="FLEET_METADATA=role=master"
        ExecStart=/usr/bin/fleetd
        Restart=always
        RestartSec=10s
    - name: etcd-waiter.service
      command: start
      content: |
        [Unit]
        Description=etcd waiter
        Wants=network-online.target
        Wants=etcd.service
        After=etcd.service
        After=network-online.target
        Before=flannel.service
        Before=setup-network-environment.service
        [Service]
        ExecStartPre=/usr/bin/chmod +x /opt/bin/waiter.sh
        ExecStart=/usr/bin/bash /opt/bin/waiter.sh
        RemainAfterExit=true
        Type=oneshot
    - name: flannel.service
      command: start
      content: |
        [Unit]
        Wants=etcd-waiter.service
        After=etcd-waiter.service
        Requires=etcd.service
        After=etcd.service
        After=network-online.target
        Wants=network-online.target
        Description=flannel is an etcd backed overlay network for containers
        [Service]
        Type=notify
        ExecStartPre=-/usr/bin/mkdir -p /opt/bin
        ExecStartPre=/usr/bin/wget -N -P /opt/bin http://<PXE_SERVER_IP>/flanneld
        ExecStartPre=/usr/bin/chmod +x /opt/bin/flanneld
        ExecStartPre=-/usr/bin/etcdctl mk /coreos.com/network/config '{"Network":"10.100.0.0/16", "Backend": {"Type": "vxlan"}}'
        ExecStart=/opt/bin/flanneld
    - name: kube-apiserver.service
      command: start
      content: |
        [Unit]
        Description=Kubernetes API Server
        Documentation=https://github.com/kubernetes/kubernetes
        Requires=etcd.service
        After=etcd.service
        [Service]
        ExecStartPre=-/usr/bin/mkdir -p /opt/bin
        ExecStartPre=/usr/bin/wget -N -P /opt/bin http://<PXE_SERVER_IP>/kube-apiserver
        ExecStartPre=/usr/bin/chmod +x /opt/bin/kube-apiserver
        ExecStart=/opt/bin/kube-apiserver \
        --address=0.0.0.0 \
        --port=8080 \
        --service-cluster-ip-range=10.100.0.0/16 \
        --etcd-servers=http://127.0.0.1:4001 \
        --logtostderr=true
        Restart=always
        RestartSec=10
    - name: kube-controller-manager.service
      command: start
      content: |
        [Unit]
        Description=Kubernetes Controller Manager
        Documentation=https://github.com/kubernetes/kubernetes
        Requires=kube-apiserver.service
        After=kube-apiserver.service
        [Service]
        ExecStartPre=/usr/bin/wget -N -P /opt/bin http://<PXE_SERVER_IP>/kube-controller-manager
        ExecStartPre=/usr/bin/chmod +x /opt/bin/kube-controller-manager
        ExecStart=/opt/bin/kube-controller-manager \
        --master=127.0.0.1:8080 \
        --logtostderr=true
        Restart=always
        RestartSec=10
    - name: kube-scheduler.service
      command: start
      content: |
        [Unit]
        Description=Kubernetes Scheduler
        Documentation=https://github.com/kubernetes/kubernetes
        Requires=kube-apiserver.service
        After=kube-apiserver.service
        [Service]
        ExecStartPre=/usr/bin/wget -N -P /opt/bin http://<PXE_SERVER_IP>/kube-scheduler
        ExecStartPre=/usr/bin/chmod +x /opt/bin/kube-scheduler
        ExecStart=/opt/bin/kube-scheduler --master=127.0.0.1:8080
        Restart=always
        RestartSec=10
    - name: kube-register.service
      command: start
      content: |
        [Unit]
        Description=Kubernetes Registration Service
        Documentation=https://github.com/kelseyhightower/kube-register
        Requires=kube-apiserver.service
        After=kube-apiserver.service
        Requires=fleet.service
        After=fleet.service
        [Service]
        ExecStartPre=/usr/bin/wget -N -P /opt/bin http://<PXE_SERVER_IP>/kube-register
        ExecStartPre=/usr/bin/chmod +x /opt/bin/kube-register
        ExecStart=/opt/bin/kube-register \
        --metadata=role=node \
        --fleet-endpoint=unix:///var/run/fleet.sock \
        --healthz-port=10248 \
        --api-endpoint=http://127.0.0.1:8080
        Restart=always
        RestartSec=10
  update:
    group: stable
    reboot-strategy: off
ssh_authorized_keys:
  - ssh-rsa AAAAB3NzaC1yc2EAAAAD...
```

### node.yml

在PXE服务器上创建并编辑文件`/var/www/html/coreos/pxe-cloud-config-slave.yml`。

```yaml
#cloud-config
---
write_files:
  - path: /etc/default/docker
    content: |
      DOCKER_EXTRA_OPTS='--insecure-registry="rdocker.example.com:5000"'
coreos:
  units:
    - name: 10-eno1.network
      runtime: true
      content: |
        [Match]
        Name=eno1
        [Network]
        DHCP=yes
    - name: 20-nodhcp.network
      runtime: true
      content: |
        [Match]
        Name=en*
        [Network]
        DHCP=none
    - name: etcd.service
      mask: true
    - name: docker.service
      drop-ins:
        - name: 50-insecure-registry.conf
          content: |
            [Service]
            Environment="HTTP_PROXY=http://rproxy.example.com:3128/" "NO_PROXY=localhost,127.0.0.0/8,rdocker.example.com"
    - name: fleet.service
      command: start
      content: |
        [Unit]
        Description=fleet daemon
        Wants=fleet.socket
        After=fleet.socket
        [Service]
        Environment="FLEET_ETCD_SERVERS=http://<MASTER_SERVER_IP>:4001"
        Environment="FLEET_METADATA=role=node"
        ExecStart=/usr/bin/fleetd
        Restart=always
        RestartSec=10s
    - name: flannel.service
      command: start
      content: |
        [Unit]
        After=network-online.target
        Wants=network-online.target
        Description=flannel is an etcd backed overlay network for containers
        [Service]
        Type=notify
        ExecStartPre=-/usr/bin/mkdir -p /opt/bin
        ExecStartPre=/usr/bin/wget -N -P /opt/bin http://<PXE_SERVER_IP>/flanneld
        ExecStartPre=/usr/bin/chmod +x /opt/bin/flanneld
        ExecStart=/opt/bin/flanneld -etcd-endpoints http://<MASTER_SERVER_IP>:4001
    - name: docker.service
      command: start
      content: |
        [Unit]
        After=flannel.service
        Wants=flannel.service
        Description=Docker Application Container Engine
        Documentation=http://docs.docker.io
        [Service]
        EnvironmentFile=-/etc/default/docker
        EnvironmentFile=/run/flannel/subnet.env
        ExecStartPre=/bin/mount --make-rprivate /
        ExecStart=/usr/bin/docker -d --bip=${FLANNEL_SUBNET} --mtu=${FLANNEL_MTU} -s=overlay -H fd:// ${DOCKER_EXTRA_OPTS}
        [Install]
        WantedBy=multi-user.target
    - name: setup-network-environment.service
      command: start
      content: |
        [Unit]
        Description=Setup Network Environment
        Documentation=https://github.com/kelseyhightower/setup-network-environment
        Requires=network-online.target
        After=network-online.target
        [Service]
        ExecStartPre=-/usr/bin/mkdir -p /opt/bin
        ExecStartPre=/usr/bin/wget -N -P /opt/bin http://<PXE_SERVER_IP>/setup-network-environment
        ExecStartPre=/usr/bin/chmod +x /opt/bin/setup-network-environment
        ExecStart=/opt/bin/setup-network-environment
        RemainAfterExit=yes
        Type=oneshot
    - name: kube-proxy.service
      command: start
      content: |
        [Unit]
        Description=Kubernetes Proxy
        Documentation=https://github.com/kubernetes/kubernetes
        Requires=setup-network-environment.service
        After=setup-network-environment.service
        [Service]
        ExecStartPre=/usr/bin/wget -N -P /opt/bin http://<PXE_SERVER_IP>/kube-proxy
        ExecStartPre=/usr/bin/chmod +x /opt/bin/kube-proxy
        ExecStart=/opt/bin/kube-proxy \
        --etcd-servers=http://<MASTER_SERVER_IP>:4001 \
        --logtostderr=true
        Restart=always
        RestartSec=10
    - name: kube-kubelet.service
      command: start
      content: |
        [Unit]
        Description=Kubernetes Kubelet
        Documentation=https://github.com/kubernetes/kubernetes
        Requires=setup-network-environment.service
        After=setup-network-environment.service
        [Service]
        EnvironmentFile=/etc/network-environment
        ExecStartPre=/usr/bin/wget -N -P /opt/bin http://<PXE_SERVER_IP>/kubelet
        ExecStartPre=/usr/bin/chmod +x /opt/bin/kubelet
        ExecStart=/opt/bin/kubelet \
        --address=0.0.0.0 \
        --port=10250 \
        --hostname-override=${DEFAULT_IPV4} \
        --api-servers=<MASTER_SERVER_IP>:8080 \
        --healthz-bind-address=0.0.0.0 \
        --healthz-port=10248 \
        --logtostderr=true
        Restart=always
        RestartSec=10
  update:
    group: stable
    reboot-strategy: off
ssh_authorized_keys:
  - ssh-rsa AAAAB3NzaC1yc2EAAAAD...
```

## 创建pxelinux.cfg相关文件

为 _slave_ 节点创建一个pxelinux目标文件： `vi /tftpboot/pxelinux.cfg/coreos-node-slave`

```conf
default coreos
prompt 1
timeout 15

display boot.msg

label coreos
    menu default
    kernel images/coreos/coreos_production_pxe.vmlinuz
    append initrd=images/coreos/coreos_production_pxe_image.cpio.gz cloud-config-url=http://<pxe-host-ip>/coreos/pxe-cloud-config-slave.yml console=tty0 console=ttyS0 coreos.autologin=tty1 coreos.autologin=ttyS0
```

为 _master_ 节点也创建一个： `vi /tftpboot/pxelinux.cfg/coreos-node-master`

```conf
default coreos
prompt 1
timeout 15

display boot.msg

label coreos
    menu default
    kernel images/coreos/coreos_production_pxe.vmlinuz
    append initrd=images/coreos/coreos_production_pxe_image.cpio.gz cloud-config-url=http://<pxe-host-ip>/coreos/pxe-cloud-config-master.yml console=tty0 console=ttyS0 coreos.autologin=tty1 coreos.autologin=ttyS0
```

## 指定pxelinux目标

在上一步骤中我们已经设置了master和slave节点的目标, 我们需要将特定的主机配置为这些目标。为实现这一点，我们可以通过将指定的MAC地址配置到指定的pxelinux.cfg文件的方法来解决。

参照本文开始时的MAC地址列表，可以做出下文中的修改。更多细节信息请参阅[相关文档](http://www.syslinux.org/wiki/index.php/PXELINUX).

```shell
cd /tftpboot/pxelinux.cfg
ln -s coreos-node-master 01-d0-00-67-13-0d-00
ln -s coreos-node-slave 01-d0-00-67-13-0d-01
ln -s coreos-node-slave 01-d0-00-67-13-0d-02
```

重启这些服务器令这些镜像PXE化并准备开始运行容器！

## 创建测试pod

现在，Kubernetes已经成功部署在CoreOS上了，我们可以创建一些pod来测试部署。

请参考[一个简单的nginx样例部署](/docs/user-guide/simple-nginx)来测试集群环境。

更多完整的应用程序示例，请参阅[示例目录](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/)中的各种例子。

## 一些用于调试的帮助命令

列出etcd中的所有关键字：

```shell
etcdctl ls --recursive
```

列出所有fleet集群中的机器：

```shell
fleetctl list-machines
```

查阅master节点上各种Kubernetes服务的系统状态：

```shell
systemctl status kube-apiserver
systemctl status kube-controller-manager
systemctl status kube-scheduler
systemctl status kube-register
```

查阅集群节点上各种服务的系统状态：

```shell
systemctl status kube-kubelet
systemctl status docker.service
```

列举Kubernetes环境中的各种对象：

```shell
kubectl get pods
kubectl get nodes
```

结束Kubernetes中的所有pod：

```shell
for i in `kubectl get pods | awk '{print $1}'`; do kubectl delete pod $i; done
```

## 支持级别


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Bare-metal (Offline) | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/coreos/bare_metal_offline)              |          | Community ([@jeffbean](https://github.com/jeffbean))

有关所有解决方案的支持级别信息，请参阅[解决方案列表](/docs/getting-started-guides/#table-of-solutions)。
