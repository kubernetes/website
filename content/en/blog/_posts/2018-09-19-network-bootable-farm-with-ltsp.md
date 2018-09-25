---
layout: blog
title: "Building network bootable servers farm for Kubernetes with LTSP"
date:  2018-09-19
---

**Author**: Andrei Kvapil (WEDOS)

![k8s+ltsp](/images/blog/2018-09-19-network-bootable-farm-with-ltsp/k8s+ltsp.svg)



Hi all, I want to show you one cool technology. I use it for Kubernetes and it is working very well.
It may be really useful for large baremetal kubernetes deployments.

Since this moment you don't need to think about installing OS and binaries on each node anymore.
Why? You can do that automatically through Dockerfile!

This fact that you can buy and put into production environment new 100 servers and get them working immideatly - it's really amazing!

Intrigued? Let me show you everything by order.

# Summary

First, we need to understand how exactly is it working.

In short, for all nodes we have prepared image with the OS, Docker, Kubelet and everything else what you exactly need there.
This image with the kernel is building automatically by CI using Dockerfile.
End nodes is booting kernel and OS from this image via network.

Nodes are using overlayfs as root filesystem and after reboot any changes will be lost (like in docker containers).
You have some config-file where you can describe mounts and some initial commands which should be executed during node boot (example set root user ssh-key and kubeadm join commands)

## Image preparing process

We will use LTSP project because it's gives us everthing what we exactly need for organize network booting environment.
Basically LTSP it is pack of shell-scripts which makes our life much easer.

It is provides initramfs module, few helper-scripts, and some configuration system which prepares system on early sate of boot, before main init process call.

**This is how image preparation procedure is looking like:**

- You're deploying basesystem in the chroot envinronment.
- Do any needed changes there, install software.
- Run `ltsp-build-image` command

And after that you will got squashed image from this chroot with all software inside.
Each node will download this image during the boot and use it as rootfs.
For update node you can just reboot it, the new squashed image will be downloaded and mounted into rootfs.

## Server components

**Server part of LTSP includes two componets in our case:**

- **TFTP-server** - TFTP is initial protocol, it is used for download kernel, initramfs and main config.
- **NBD-server** - NBD protocol used for distribute squashed rootfs image to the clients. It is fastest way, but if you want it can be replaced by NFS or AoE protocol.

You should also have:

- **DHCP-server** - it will distribute IP-settings and few specific options to the clients for make them possible to boot from our LTSP-server.

## Node booting process

**This is how node is booting up**

- First time node will ask DHCP for IP-settings and `next-server`, `filename` options.
- Then node will apply settings and will download bootloader (pxelinux or grub)
- Bootloader will download and read config with the kernel and initramfs image.
- Then bootloader will download kernel and initramfs and execute it with specific cmdline options.
- During the boot initramfs modlules will handle options from cmdline and do some actions like connect NBD-device, prepare overlay rootfs, etc.
- Afterwards it will call ltsp-init system instead normal init.
- ltsp-init scripts will prepare system on the earler stage, before main init will be called. Basically apply setting from lts.conf (main config): write fstab and rc.local entries etc.
- Call main init (systemd) which is booting configured system as usual, mounts shares from fstab, start targets and services, executes commands from rc.local file.
- In the end you have fully configured and booted system ready for further operations.

# Preparing server

As I said before I'm preparing LTSP-server with the squashed image automaically using Dockerfile, this method is quite good, because you have all steps described in your git repository.
You have versioning, you can have a banches, use CI and everything that you used to use for preparing your usual docker projects.

Otherwise you can deploy LTSP server manually executing all steps by your hands, it is good practic for learning and for understand basic principles.
Just repeat all the steps listed here by hand, if you want just to try to install LTSP without Dockerfile.

## Used patches list

LTSP still have some issues whcih authors don’t want to apply, yet. However LTSP is easy customizable so I prepared few patches for myself, I bring them here.
Maybe I’ll ripen to create a fork if the community will warmly accept my solution.

  * [feature-grub.diff](https://github.com/kvaps/ltsp/compare/feature-grub.diff)
      LTSP not supported EFI by default, so I've prepared patch which adds GRUB2 with EFI support.
  * [feature_preinit.diff](https://github.com/kvaps/ltsp/compare/feature_preinit.diff)
      This patch adds PREINIT option to lts.conf which allows to run custom commands before main init call. It may be useful for modify systemd units and configure network. Remarkable that all environment variables from boot environment are saved and you can use them in your scripts.
  * [feature_initramfs_params_from_lts_conf.diff](https://github.com/kvaps/ltsp/compare/feature_initramfs_params_from_lts_conf.diff)
      Solves problem with NBD_TO_RAM option, after this patch you can specify it on lts.conf inside chroot. (not in tftp directory)
  * [nbd-server-wrapper.sh](https://gist.githubusercontent.com/kvaps/1a6a7d8b73bf7444f0f99b22379c9e4e/raw/eb0d60c638ef72b7e28438b7f4d2beda89c41f75/nbd-server-wrapper.sh)
      This is not patch but special wrapper script which allows you to run NBD-server in foregroud, it is useful if you want to run it inside docker container.

## Dockerfile stages

We will use [stage building](https://docs.docker.com/develop/develop-images/multistage-build/) in our Dockerfile for leave only needed parts in our docker image, the rest unused parts will be removed from the final image.

```
ltsp-base
(install basic LTSP server software)
   |
   |---basesystem
   |   (prepare chroot with main software and kernel)
   |     |
   |     |---builder
   |     |   (build additional software from sources, if needed)
   |     |
   |     '---ltsp-image
   |         (install additional software, docker, kubelet and build squashed image)
   |
   '---final-stage
       (copy squashed image, kernel and initramfs into first stage)
```

### Stage 1: ltsp-base

Let's start writing our Dockerfile. This is the first part:

```Dockerfile
FROM ubuntu:16.04 as ltsp-base

ADD nbd-server-wrapper.sh /bin/
ADD /patches/feature-grub.diff /patches/feature-grub.diff
RUN apt-get -y update \
 && apt-get -y install \
      ltsp-server \
      tftpd-hpa \
      nbd-server \
      grub-common \
      grub-pc-bin \
      grub-efi-amd64-bin \
      curl \
      patch \
 && sed -i 's|in_target mount|in_target_nofail mount|' \
      /usr/share/debootstrap/functions \
  # Add EFI support and Grub bootloader (#1745251)
 && patch -p2 -d /usr/sbin < /patches/feature-grub.diff \
 && rm -rf /var/lib/apt/lists \
 && apt-get clean
```

At this stage our docker image already have installed:

* NBD-server
* TFTP-server
* LTSP-scripts with grub bootloader support (for EFI)

### Stage 2: basesystem

In this stage we will prepare a chroot environment with basesystem, and install basic software with the kernel there.
We will use classic **debootstrap** instead **ltsp-build-client** for prepare base image, because **ltsp-build-client** will install GUI and few other things which we don't need for the server deployment.

```Dockerfile
FROM ltsp-base as basesystem

ARG DEBIAN_FRONTEND=noninteractive

# Prepare base system
RUN debootstrap --arch amd64 xenial /opt/ltsp/amd64

# Install updates
RUN echo "\
      deb http://archive.ubuntu.com/ubuntu xenial main restricted universe multiverse\n\
      deb http://archive.ubuntu.com/ubuntu xenial-updates main restricted universe multiverse\n\
      deb http://archive.ubuntu.com/ubuntu xenial-security main restricted universe multiverse" \
      > /opt/ltsp/amd64/etc/apt/sources.list \
 && ltsp-chroot apt-get -y update \
 && ltsp-chroot apt-get -y upgrade

# Installing LTSP-packages
RUN ltsp-chroot apt-get -y install ltsp-client-core

# Apply initramfs patches
# 1: Read params from /etc/lts.conf during the boot (#1680490)
# 2: Add support for PREINIT variables in lts.conf
ADD /patches /patches
RUN patch -p4 -d /opt/ltsp/amd64/usr/share < /patches/feature_initramfs_params_from_lts_conf.diff \
 && patch -p3 -d /opt/ltsp/amd64/usr/share < /patches/feature_preinit.diff

# Write new local client config for boot NBD image to ram:
RUN echo "[Default]\nLTSP_NBD_TO_RAM = true" \
      > /opt/ltsp/amd64/etc/lts.conf

# Install packages
RUN echo 'APT::Install-Recommends "0";\nAPT::Install-Suggests "0";' \
      >> /opt/ltsp/amd64/etc/apt/apt.conf.d/01norecommend \
 && ltsp-chroot apt-get -y install \
      software-properties-common \
      apt-transport-https \
      ca-certificates \
      ssh \
      bridge-utils \
      pv \
      jq \
      vlan \
      bash-completion \
      screen \
      vim \
      mc \
      lm-sensors \
      htop \
      jnettop \
      rsync \
      curl \
      wget \
      tcpdump \
      arping \
      apparmor-utils \
      nfs-common \
      telnet \
      sysstat \
      ipvsadm \
      ipset \
      make

# Install kernel
RUN ltsp-chroot apt-get -y install linux-generic-hwe-16.04
```

Note that you may encounter problems with some packages, such as `lvm2`.
They have not fully optimized for installing in unprivileged chroot.
Their postinstall scripts try to call some privileged commands which can fail with errors and block whole package installation.

Solution:
* Some of them can be simple installed before the kernel without any problems (like `lvm2`)
* But for some of them you will need to use this workaround for install without postinstall script.

### Stage 3: builder

Now we can build all necessary software and kernel modules. It's really cool that you can do that automatically in this stage.
You can skip this stage if you have nothing to do here.

Here is example for install latest MLNX_EN driver:

```Dockerfile
FROM basesystem as builder

# Set cpuinfo (for building from sources)
RUN cp /proc/cpuinfo /opt/ltsp/amd64/proc/cpuinfo

# Compile Mellanox driver
RUN ltsp-chroot sh -cx \
   '  VERSION=4.3-1.0.1.0-ubuntu16.04-x86_64 \
   && curl -L http://www.mellanox.com/downloads/ofed/MLNX_EN-${VERSION%%-ubuntu*}/mlnx-en-${VERSION}.tgz \
      | tar xzf - \
   && export \
        DRIVER_DIR="$(ls -1 | grep "MLNX_OFED_LINUX-\|mlnx-en-")" \
        KERNEL="$(ls -1t /lib/modules/ | head -n1)" \
   && cd "$DRIVER_DIR" \
   && ./*install --kernel "$KERNEL" --without-dkms --add-kernel-support \
   && cd - \
   && rm -rf "$DRIVER_DIR" /tmp/mlnx-en* /tmp/ofed*'

# Save kernel modules
RUN ltsp-chroot sh -c \
    ' export KERNEL="$(ls -1t /usr/src/ | grep -m1 "^linux-headers" | sed "s/^linux-headers-//g")" \
   && tar cpzf /modules.tar.gz /lib/modules/${KERNEL}/updates'

```

### Stage 4: ltsp-image

In this stage we will install what we builded on the previus step:

```Dockerfile
FROM basesystem as ltsp-image

# Retrieve kernel modules
COPY --from=builder /opt/ltsp/amd64/modules.tar.gz /opt/ltsp/amd64/modules.tar.gz

# Install kernel modules
RUN ltsp-chroot sh -c \
    ' export KERNEL="$(ls -1t /usr/src/ | grep -m1 "^linux-headers" | sed "s/^linux-headers-//g")" \
   && tar xpzf /modules.tar.gz \
   && depmod -a "${KERNEL}" \
   && rm -f /modules.tar.gz'
```

Then do additional changes for finalize our ltsp-image:

```Dockerfile
# Install docker
RUN ltsp-chroot sh -c \
   '  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - \
   && echo "deb https://download.docker.com/linux/ubuntu xenial stable" \
        > /etc/apt/sources.list.d/docker.list \
   && apt-get -y update \
   && apt-get -y install \
        docker-ce=$(apt-cache madison docker-ce | grep 17.03 | head -1 | awk "{print $ 3}")'

# Configure docker options
RUN DOCKER_OPTS="$(echo \
      --storage-driver=overlay2 \
      --iptables=false \
      --ip-masq=false \
      --log-driver=json-file \
      --log-opt=max-size=10m \
      --log-opt=max-file=5 \
      )" \
 && sed "/^ExecStart=/ s|$| $DOCKER_OPTS|g" \
      /opt/ltsp/amd64/lib/systemd/system/docker.service \
      > /opt/ltsp/amd64/etc/systemd/system/docker.service

# Install kubeadm, kubelet and kubectl
RUN ltsp-chroot sh -c \
      '  curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - \
      && echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" \
           > /etc/apt/sources.list.d/kubernetes.list \
      && apt-get -y update \
      && apt-get -y install kubelet kubeadm kubectl cri-tools'

# Disable automatic updates
RUN rm -f /opt/ltsp/amd64/etc/apt/apt.conf.d/20auto-upgrades

# Disable apparmor profiles
RUN ltsp-chroot find /etc/apparmor.d \
      -maxdepth 1 \
      -type f \
      -name "sbin.*" \
      -o -name "usr.*" \
      -exec ln -sf "{}" /etc/apparmor.d/disable/ \;

# Write kernel cmdline options
RUN KERNEL_OPTIONS="$(echo \
      init=/sbin/init-ltsp \
      forcepae \
      console=tty1 \
      console=ttyS0,9600n8 \
      nvme_core.default_ps_max_latency_us=0 \
    )" \
 && sed -i "/^CMDLINE_LINUX_DEFAULT=/ s|=.*|=\"${KERNEL_OPTIONS}\"|" \
      "/opt/ltsp/amd64/etc/ltsp/update-kernels.conf"
```

Then we will make squased image from our chroot:

```Dockerfile
# Cleanup caches
RUN rm -rf /opt/ltsp/amd64/var/lib/apt/lists \
 && ltsp-chroot apt-get clean

# Build squashed image
RUN ltsp-update-image
```

### Stage 5: Final stage
In the final stage we will save only our squashed image and kernels with initramfs.

```Dockerfile
FROM ltsp-base
COPY --from=ltsp-image /opt/ltsp/images /opt/ltsp/images
COPY --from=ltsp-image /etc/nbd-server/conf.d /etc/nbd-server/conf.d
COPY --from=ltsp-image /var/lib/tftpboot /var/lib/tftpboot
```

Ok, now we have docker image which includes:
  - TFTP-server
  - NBD-server
  - configured bootloader
  - kernel with initramfs
  - squashed rootfs image

# Usage

OK, now when our docker-image with LTSP-server, kernel, initramfs and squashed rootfs fully prepared we can run deployment with it.

We can do that as usual, but one more thing is networking.
Unfortunately we can't use standard Kubernetes service for our deployment, because during the boot our nodes are not part of Kubernetes cluster and they requires ExternalIP, but Kubernetes is always enable NAT for ExternalIPs, and there is no way for disable this behavior.

For now I have two ways for avoid this: use `hostNetwork: true` or use [pipework](https://github.com/dreamcat4/docker-images/blob/master/pipework/3.%20Examples.md#kubernetes), the second option will also provide you redundancy because, in case of failure, the IP will be moved with the Pod to another node. Unfortunately pipework is not native and a less secure method.
If you have some better option for that please let me know.

Here is example for deployment with hostNetwork:

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: ltsp-server
  labels:
      app: ltsp-server
spec:
  selector:
    matchLabels:
      name: ltsp-server
  replicas: 1
  template:
    metadata:
      labels:
        name: ltsp-server
    spec:
      hostNetwork: true
      containers:
      - name: tftpd
        image: gitlab.opennebula.wedos.cloud:4567/moonshot/docker-ltsp
        command: [ "/usr/sbin/in.tftpd", "-L", "-u", "tftp", "-a", ":69", "-s", "/var/lib/tftpboot" ]
        lifecycle:
          postStart:
            exec:
              command: ["/bin/sh", "-c", "cd /var/lib/tftpboot/ltsp/amd64; ln -sf config/lts.conf ." ]
        volumeMounts:
        - name: config
          mountPath: "/var/lib/tftpboot/ltsp/amd64/config"

      - name: nbd-server
        image: gitlab.opennebula.wedos.cloud:4567/moonshot/docker-ltsp
        command: [ "/bin/nbd-server-wrapper.sh" ]

      volumes:
      - name: config
        configMap:
          name: ltsp-config
```

As you can see it also requires configmap with **lts.conf** file.
Here is example part from mine:

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: ltsp-config
data:
  lts.conf: |
    [default]
    KEEP_SYSTEM_SERVICES           = "ssh ureadahead dbus-org.freedesktop.login1 systemd-logind polkitd cgmanager ufw rpcbind nfs-kernel-server"

    PREINIT_00_TIME                = "ln -sf /usr/share/zoneinfo/Europe/Prague /etc/localtime"
    PREINIT_01_FIX_HOSTNAME        = "sed -i '/^127.0.0.2/d' /etc/hosts"
    PREINIT_02_DOCKER_OPTIONS      = "sed -i 's|^ExecStart=.*|ExecStart=/usr/bin/dockerd -H fd:// --storage-driver overlay2 --iptables=false --ip-masq=false --log-driver=json-file --log-opt=max-size=10m --log-opt=max-file=5|' /etc/systemd/system/docker.service"

    FSTAB_01_SSH                   = "/dev/data/ssh     /etc/ssh          ext4 nofail,noatime,nodiratime 0 0"
    FSTAB_02_JOURNALD              = "/dev/data/journal /var/log/journal  ext4 nofail,noatime,nodiratime 0 0"
    FSTAB_03_DOCKER                = "/dev/data/docker  /var/lib/docker   ext4 nofail,noatime,nodiratime 0 0"

    # Each command will stop script execution when fail
    RCFILE_01_SSH_SERVER           = "cp /rofs/etc/ssh/*_config /etc/ssh; ssh-keygen -A"
    RCFILE_02_SSH_CLIENT           = "mkdir -p /root/.ssh/; echo 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDBSLYRaORL2znr1V4a3rjDn3HDHn2CsvUNK1nv8+CctoICtJOPXl6zQycI9KXNhANfJpc6iQG1ZPZUR74IiNhNIKvOpnNRPyLZ5opm01MVIDIZgi9g0DUks1g5gLV5LKzED8xYKMBmAfXMxh/nsP9KEvxGvTJB3OD+/bBxpliTl5xY3Eu41+VmZqVOz3Yl98+X8cZTgqx2dmsHUk7VKN9OZuCjIZL9MtJCZyOSRbjuo4HFEssotR1mvANyz+BUXkjqv2pEa0I2vGQPk1VDul5TpzGaN3nOfu83URZLJgCrX+8whS1fzMepUYrbEuIWq95esjn0gR6G4J7qlxyguAb9 admin@kubernetes' >> /root/.ssh/authorized_keys"
    RCFILE_03_KERNEL_DEBUG         = "sysctl -w kernel.unknown_nmi_panic=1 kernel.softlockup_panic=1; modprobe netconsole netconsole=@/vmbr0,@10.9.0.15/"
    RCFILE_04_SYSCTL               = "sysctl -w fs.file-max=20000000 fs.nr_open=20000000 net.ipv4.neigh.default.gc_thresh1=80000 net.ipv4.neigh.default.gc_thresh2=90000 net.ipv4.neigh.default.gc_thresh3=100000"
    RCFILE_05_FORWARD              = "echo 1 > /proc/sys/net/ipv4/ip_forward"
    RCFILE_06_MODULES              = "modprobe br_netfilter"
    RCFILE_07_JOIN_K8S             = "kubeadm join --token 2a4576.504356e45fa3d365 10.9.0.20:6443 --discovery-token-ca-cert-hash sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
```

* **KEEP_SYSTEM_SERVICES** - during the boot LTSP automatically removes some services, this variable is needed for prevent this behavior.
* **PREINIT_*** - commands listed here will be executed before systemd running (this functional was added by [feature_preinit.diff](#used-patches-list) patch)
* **FSTAB_*** - entries writed here will be added to `/etc/fstab` file.
As you can see, I use `nofail` option, that means that if partition not existing, it will continue boot without error.
* **RCFILE_*** - those commands will be writed to `rc.local` file, which will be called by systemd during the boot.
Here I load kernel modules and add  some sysctl tunes, then call `kubeadm join` command, which adds my node to the Kubernetes cluster.

More details about all variables used here you can get from [lts.conf manpage](http://manpages.ubuntu.com/manpages/xenial/man5/lts.conf.5.html).

Now you can configure your DHCP, basically you should set `next-server` and `filename` options.

I use ISC-DHCP server, and here is example `dhcpd.conf`:

```
shared-network ltsp-netowrk {
    subnet 10.9.0.0 netmask 255.255.0.0 {
        authoritative;
        default-lease-time -1;
        max-lease-time -1;

        option domain-name              "example.org";
        option domain-name-servers      10.9.0.1;
        option routers                  10.9.0.1;
        next-server                     ltsp-1;  # write LTSP-server hostname here

        if option architecture = 00:07 {
            filename "/ltsp/amd64/grub/x86_64-efi/core.efi";
        } else {
            filename "/ltsp/amd64/grub/i386-pc/core.0";
        }

        range 10.9.200.0 10.9.250.254; 
    }
```

You can start from this, but what about me, I have multiple LTSP-servers and I configure leases statically for each node via Ansible playbook.

Try to run your first node if everything was right, you will have running system there.
Node also will be added to your Kubernetes cluster.

Now you can try to do your own changes.

If you need something more, note that LTSP can be easily changed to your needs.
Feel free to look into source code you can find many answers there.
