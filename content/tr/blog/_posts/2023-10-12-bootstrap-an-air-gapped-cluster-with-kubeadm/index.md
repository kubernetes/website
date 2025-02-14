---
layout: blog
title: "Bootstrap an Air Gapped Cluster With Kubeadm"
date: 2023-10-12
slug: bootstrap-an-air-gapped-cluster-with-kubeadm
author: >
  Rob Mengert (Defense Unicorns)
---

Ever wonder how software gets deployed onto a system that is deliberately disconnected from the Internet and other networks? These systems are typically disconnected due to their sensitive nature. Sensitive as in utilities (power/water), banking, healthcare, weapons systems, other government use cases, etc. Sometimes it's technically a water gap, if you're running Kubernetes on an underwater vessel. Still, these environments need software to operate. This concept of deployment in a disconnected state is what it means to deploy to the other side of an [air gap](https://en.wikipedia.org/wiki/Air_gap_(networking)).

Again, despite this posture, software still needs to run in these environments. Traditionally, software artifacts are physically carried across the air gap on hard drives, USB sticks, CDs, or floppy disks (for ancient systems, it still happens). Kubernetes lends itself particularly well to running software behind an air gap for several reasons, largely due to its declarative nature.

In this blog article, I will walk through the process of bootstrapping a Kubernetes
cluster in an air-gapped lab environment using Fedora Linux and kubeadm.

## The Air Gap VM Setup

A real air-gapped network can take some effort to set up, so for this post, I will use an example VM on a laptop and do some network modifications. Below is the topology:

{{< figure src="airgap-vm.svg" alt="Topology on the host/laptop which shows that connectivity to the internet from the air gap VM is not possible. However, connectivity between the host/laptop and the VM is possible" >}}

### Local topology

This VM will have its network connectivity disabled but in a way that doesn't shut down the VM's virtual NIC. Instead, its network will be downed by injecting a default route to a dummy interface, making anything internet-hosted unreachable. However, the VM still has a connected route to the bridge interface on the host, which means that network connectivity to the host is still working. This posture means that data can be transferred from the host/laptop to the VM via `scp`, even with the default route on the VM black-holing all traffic that isn't destined for the local bridge subnet. This type of transfer is analogous to carrying data across the air gap and will be used throughout this post.

Other details about the lab setup:

**VM OS:** Fedora 37  
**Kubernetes Version:** v1.27.3  
**CNI Plugins Version:** v1.3.0  
**CNI Provider and Version:** Flannel v0.22.0  

While this single VM lab is a simplified example, the below diagram more approximately shows what a real air-gapped environment could look like:

{{< figure src="example_production_topology.svg" alt="Example production topology which shows 3 control plane Kubernetes nodes and 'n' worker nodes along with a Docker registry in an air-gapped environment.  Additionally shows two workstations, one on each side of the air gap and an IT admin which physically carries the artifacts across." >}}

Note, there is still intentional isolation between the environment and the internet.  There are also some things that are not shown in order to keep the diagram simple, for example malware scanning on the secure side of the air gap.

Back to the single VM lab environment.

## Identifying the required software artifacts

I have gone through the trouble of identifying all of the required software components that need to be carried across the air gap in order for this cluster to be stood up:

- Docker (to host an internal container image registry)
- Containerd
- libcgroup
- socat
- conntrack-tools
- CNI plugins
- crictl
- kubeadm
- kubelet
- kubectl and k9s (strictly speaking, these aren't required to bootstrap a cluster but they are handy to interact with one)
- kubelet.service systemd file
- kubeadm configuration file
- Docker registry container image
- Kubernetes component container images
- CNI network plugin container images ([Flannel](https://github.com/flannel-io/flannel) will be used for this lab)
- CNI network plugin manifests
- CNI tooling container images

The way I identified these was by trying to do the installation and working through all of the errors that are thrown around an additional dependency being required. In a real air-gapped scenario, each transport of artifacts across the air gap could represent anywhere from 20 minutes to several weeks of time spent by the installer. That is to say that the target system could be located in a data center on the same floor as your desk, at a satellite downlink facility in the middle of nowhere, or on a submarine that's out to sea. Knowing what is on that system at any given time is important so you know what you have to bring.

## Prepare the Node for K8s

Before downloading and moving the artifacts to the VM, let's first prep that VM to run Kubernetes.

### VM preparation

_Run these steps as a normal user_

**Make destination directory for software artifacts**

```bash
mkdir ~/tmp
```
_Run the following steps as the superuser_ (`root`)

Write to `/etc/sysctl.d/99-k8s-cri.conf`:

```bash
cat > /etc/sysctl.d/99-k8s-cri.conf << EOF
net.bridge.bridge-nf-call-iptables=1
net.ipv4.ip_forward=1
net.bridge.bridge-nf-call-ip6tables=1
EOF
```

Write to `/etc/modules-load.d/k8s.conf` (enable `overlay` and `nbr_netfilter`):
```bash
echo -e overlay\\nbr_netfilter > /etc/modules-load.d/k8s.conf
```
Install iptables:
```bash
dnf -y install iptables-legacy
```
Set iptables to use legacy mode (not `nft` emulating `iptables`):
```bash
update-alternatives --set iptables /usr/sbin/iptables-legacy
```

Turn off swap:
```bash
touch /etc/systemd/zram-generator.conf
systemctl mask systemd-zram-setup@.service
sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab
```

Disable `firewalld` (this is OK in a demo context):
```bash
systemctl disable --now firewalld
```

Disable `systemd-resolved`:
```bash
systemctl disable --now systemd-resolved
```

Configure DNS defaults for NetworkManager:
```bash
sed -i '/\[main\]/a dns=default' /etc/NetworkManager/NetworkManager.conf
```

Blank the system-level DNS resolver configuration:

```bash
unlink /etc/resolv.conf || true
touch /etc/resolv.conf
```

Disable SELinux _(just for a demo - check before doing this in production!)_:

```bash
setenforce 0
```

**Make sure all changes survive a reboot**
```bash
reboot
```
## Download all the artifacts

On the laptop/host machine, download all of the artifacts enumerated in the previous section.  Since the air gapped VM is running Fedora 37, all of the dependencies shown in this part are for Fedora 37.  Note, this procedure will only work on AArch64 or AMD64 CPU architectures as they are the most popular and widely available..  You can execute this procedure anywhere you have write permissions; your home directory is a perfectly suitable choice.

Note, operating system packages for the Kubernetes artifacts that need to be carried across can now be found at [pkgs.k8s.io](/blog/2023/08/15/pkgs-k8s-io-introduction/). This blog post will use a combination of Fedora repositories and GitHub in order to download all of the required artifacts. When you’re doing this on your own cluster, you should decide whether to use the official Kubernetes packages, or the official packages from your operating system distribution - both are valid choices.



```bash
# Set architecture variables
UARCH=$(uname -m)

if [["$UARCH" == "arm64" || "$UARCH" == "aarch64"]]; then

    ARCH="aarch64"
    K8s_ARCH="arm64"

else

    ARCH="x86_64"
    K8s_ARCH="amd64"

fi
```

Set environment variables for software versions to use:

```bash
CNI_PLUGINS_VERSION="v1.3.0"
CRICTL_VERSION="v1.27.0"
KUBE_RELEASE="v1.27.3"
RELEASE_VERSION="v0.15.1"
K9S_VERSION="v0.27.4"
```

**Create a `download` directory, change into it, and download all of the RPMs and configuration files**
```bash
mkdir download && cd download

curl -O https://download.docker.com/linux/fedora/37/${ARCH}/stable/Packages/docker-ce-cli-23.0.2-1.fc37.${ARCH}.rpm

curl -O https://download.docker.com/linux/fedora/37/${ARCH}/stable/Packages/containerd.io-1.6.19-3.1.fc37.${ARCH}.rpm

curl -O https://download.docker.com/linux/fedora/37/${ARCH}/stable/Packages/docker-compose-plugin-2.17.2-1.fc37.${ARCH}.rpm

curl -O https://download.docker.com/linux/fedora/37/${ARCH}/stable/Packages/docker-ce-rootless-extras-23.0.2-1.fc37.${ARCH}.rpm

curl -O https://download.docker.com/linux/fedora/37/${ARCH}/stable/Packages/docker-ce-23.0.2-1.fc37.${ARCH}.rpm

curl -O https://download-ib01.fedoraproject.org/pub/fedora/linux/releases/37/Everything/${ARCH}/os/Packages/l/libcgroup-3.0-1.fc37.${ARCH}.rpm

echo -e "\nDownload Kubernetes Binaries"

curl -L -O "https://github.com/containernetworking/plugins/releases/download/${CNI_PLUGINS_VERSION}/cni-plugins-linux-${K8s_ARCH}-${CNI_PLUGINS_VERSION}.tgz"

curl -L -O "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${K8s_ARCH}.tar.gz"

curl -L --remote-name-all https://dl.k8s.io/release/${KUBE_RELEASE}/bin/linux/${K8s_ARCH}/{kubeadm,kubelet}

curl -L -O "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubelet/lib/systemd/system/kubelet.service"

curl -L -O "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/kubepkg/templates/latest/deb/kubeadm/10-kubeadm.conf"

curl -L -O "https://dl.k8s.io/release/${KUBE_RELEASE}/bin/linux/${K8s_ARCH}/kubectl"

echo -e "\nDownload dependencies"

curl -O "https://dl.fedoraproject.org/pub/fedora/linux/releases/37/Everything/${ARCH}/os/Packages/s/socat-1.7.4.2-3.fc37.${ARCH}.rpm"

curl -O "https://dl.fedoraproject.org/pub/fedora/linux/releases/37/Everything/${ARCH}/os/Packages/l/libcgroup-3.0-1.fc37.${ARCH}.rpm"

curl -O "https://dl.fedoraproject.org/pub/fedora/linux/releases/37/Everything/${ARCH}/os/Packages/c/conntrack-tools-1.4.6-4.fc37.${ARCH}.rpm"

curl -LO "https://github.com/derailed/k9s/releases/download/${K9S_VERSION}/k9s_Linux_${K8s_ARCH}.tar.gz"

curl -LO "https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml"
```
**Download all of the necessary container images:**

```bash
images=(
    "registry.k8s.io/kube-apiserver:${KUBE_RELEASE}"
    "registry.k8s.io/kube-controller-manager:${KUBE_RELEASE}"
    "registry.k8s.io/kube-scheduler:${KUBE_RELEASE}"
    "registry.k8s.io/kube-proxy:${KUBE_RELEASE}"
    "registry.k8s.io/pause:3.9"
    "registry.k8s.io/etcd:3.5.7-0"
    "registry.k8s.io/coredns/coredns:v1.10.1"
    "registry:2.8.2"
    "flannel/flannel:v0.22.0"
    "flannel/flannel-cni-plugin:v1.1.2"
)

for image in "${images[@]}"; do
    # Pull the image from the registry
    docker pull "$image"

    # Save the image to a tar file on the local disk
    image_name=$(echo "$image" | sed 's|/|_|g' | sed 's/:/_/g')
    docker save -o "${image_name}.tar" "$image"

done
```

The above commands will take a look at the CPU architecture for the current host/laptop, create and change into a directory called download, and finally download all of the dependencies. Each of these files must then be transported over the air gap via scp. The exact syntax of the command will vary depending on the user on the VM, if you created an SSH key, and the IP of your air gap VM. The rough syntax is:
```bash
scp -i <<SSH_KEY>> <<FILE>> <<AIRGAP_VM_USER>>@<<AIRGAP_VM_IP>>:~/tmp/
```
Once all of the files have been transported to the air gapped VM, the rest of the blog post will take place from the VM. Open a terminal session to that system.

### Put the artifacts in place

Everything that is needed in order to bootstrap a Kubernetes cluster now exists on the air-gapped VM. This section is a lot more complicated since various types of artifacts are now on disk on the air-gapped VM. Get a root shell on the air gap VM as the rest of this section will be executed from there. Let's start by setting the same architecture variables and environmental as were set on the host/laptop and then install all of the RPM packages:

```bash
UARCH=$(uname -m)
# Set architecture variables

if [["$UARCH" == "arm64" || "$UARCH" == "aarch64"]]; then

    ARCH="aarch64"
    K8s_ARCH="arm64"

else

    ARCH="x86_64"
    K8s_ARCH="amd64"

fi

# Set environment variables
CNI_PLUGINS_VERSION="v1.3.0"
CRICTL_VERSION="v1.27.0"
KUBE_RELEASE="v1.27.3"
RELEASE_VERSION="v0.15.1"
K9S_VERSION="v0.27.4"

cd ~/tmp/

dnf -y install ./*.rpm
```

Next, install the CNI plugins and `crictl`:


```bash
mkdir -p /opt/cni/bin
tar -C /opt/cni/bin -xz -f "cni-plugins-linux-${K8s_ARCH}-v1.3.0.tgz"
tar -C /usr/local/bin-xz -f "crictl-v1.27.0-linux-${K8s_ARCH}.tar.gz"
```

Make kubeadm, kubelet and kubectl executable and move them from the `/tmp`
directory to `/usr/local/bin`:
```bash
chmod +x kubeadm kubelet kubectl
mv kubeadm kubelet kubectl /usr/local/bin
```

Define an override for the systemd kubelet service file, and move it to the proper location:

```bash
mkdir -p /etc/systemd/system/kubelet.service.d

sed "s:/usr/bin:/usr/local/bin:g" 10-kubeadm.conf > /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

The CRI plugin for containerd is disabled by default; enable it:
```bash
sed -i 's/^disabled_plugins = \["cri"\]/#&/' /etc/containerd/config.toml
```

Put a custom `/etc/docker/daemon.json` file in place:
```bash
echo '{

"exec-opts": ["native.cgroupdriver=systemd"],

"insecure-registries" : ["localhost:5000"],

"allow-nondistributable-artifacts": ["localhost:5000"],

"log-driver": "json-file",

"log-opts": {

"max-size": "100m"

},

"group": "rnd",

"storage-driver": "overlay2",

"storage-opts": [

"overlay2.override_kernel_check=true"

]

}' > /etc/docker/daemon.json
```
Two important items to highlight in the Docker `daemon.json` configuration file. The insecure-registries line means that the registry in brackets does not support TLS. Even inside an air gapped environment, this isn't a good practice but is fine for the purposes of this lab. The allow-nondistributable-artifacts line tells Docker to permit pushing nondistributable artifacts to this registry. Docker by default does not push these layers to avoid potential issues around licensing or distribution rights. A good example of this is the Windows base container image. This line will allow layers that Docker marks as "foreign" to be pushed to the registry. While not a big deal for this article, that line could be required for some air gapped environments. All layers have to exist locally since nothing inside the air gapped environment can reach out to a public container image registry to get what it needs.

(Re)start Docker and enable it so it starts at system boot:

```bash
systemctl restart docker
systemctl enable docker
```

Start, and enable, containerd and the kubelet:

```bash
systemctl enable --now containerd
systemctl enable --now kubelet
```

The container image registry that runs in Docker is only required for any CNI related containers and subsequent workload containers. This registry is **not** used to house the Kubernetes component containers. Note, nerdctl would have also worked here as an alternative to Docker and would have allowed for direct interaction with containerd. Docker was chosen for its familiarity.

Start a container image registry inside Docker:

```bash
docker load -i registry_2.8.2.tar
docker run -d -p 5000:5000 --restart=always --name registry registry:2.8.2
```

### Load Flannel containers into the Docker registry

**Note**: _Flannel was chosen for this lab due to familiarity.  Chose whatever CNI works best in your environment._

```bash
docker load -i flannel_flannel_v0.22.0.tar
docker load -i flannel_flannel-cni-plugin_v1.1.2.tar
docker tag flannel/flannel:v0.22.0 localhost:5000/flannel/flannel:v0.22.0
docker tag flannel/flannel-cni-plugin:v1.1.1 localhost:5000/flannel/flannel-cni-plugin:v1.1.1
docker push localhost:5000/flannel/flannel:v0.22.0
docker push localhost:5000/flannel/flannel-cni-plugin:v1.1.1
```

Load container images for Kubernetes components, via `ctr`:

```bash
images_files=(
    "registry.k8s.io/kube-apiserver:${KUBE_RELEASE}"
    "registry.k8s.io/kube-controller-manager:${KUBE_RELEASE}"
    "registry.k8s.io/kube-scheduler:${KUBE_RELEASE}"
    "registry.k8s.io/kube-proxy:${KUBE_RELEASE}"
    "registry.k8s.io/pause:3.9"
    "registry.k8s.io/etcd:3.5.7-0"
    "registry.k8s.io/coredns/coredns:v1.10.1"
    
)


for index in "${!image_files[@]}"; do

    if [[-f "${image_files[$index]}" ]]; then

        # The below line loads the images where they need to be on the VM
        ctr -n k8s.io images import ${image_files[$index]}

    else

        echo "File ${image_files[$index]} not found!" 1>&2

    fi

done
```

A totally reasonable question here could be "Why not use the Docker registry that was just stood up to house the K8s component images?" This simply didn't work even with the proper modification to the configuration file that gets passed to kubeadm.

### Spin up the Kubernetes cluster

Check if a cluster is already running and tear it down if it is:

```bash
if systemctl is-active --quiet kubelet; then

    # Reset the Kubernetes cluster

    echo "A Kubernetes cluster is already running. Resetting the cluster..."

    kubeadm reset -f

fi
```

Log into the Docker registry from inside the air-gapped VM:

```bash
# OK for a demo; use secure credentials in production!

DOCKER_USER=user
DOCKER_PASS=pass
echo ${DOCKER_PASS} | docker login --username=${DOCKER_USER} --password-stdin localhost:5000
```

Create a cluster configuration file and initialize the cluster:

```bash
echo "---

apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
clusterName: kubernetes
kubernetesVersion: v1.27.3
networking:
    dnsDomain: cluster.local
    podSubnet: 10.244.0.0/16 # --pod-network-cidr
    serviceSubnet: 10.96.0.0/12
---
apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration
localAPIEndpoint:
    advertiseAddress: 10.10.10.10 # Update to the IP address of the air gap VM
    bindPort: 6443
nodeRegistration:
    criSocket: unix:///run/containerd/containerd.sock # or rely on autodetection
    name: airgap # this must match the hostname of the air gap VM
# Since this is a single node cluster, this taint has to be commented out,
# otherwise the coredns pods will not come up.
# taints:
# - effect: NoSchedule
# key: node-role.kubernetes.io/master" > kubeadm_cluster.yaml

kubeadm init --config kubeadm_config.yaml
```

Set `$KUBECONFIG` and use `kubectl` to wait until the API server is healthy:

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf

until kubectl get nodes; do
    echo -e "\nWaiting for API server to respond..." 1>&2
    sleep 5

done
```

### Set up networking

Update Flannel image locations in the Flannel manifest, and apply it:

```bash
sed -i 's/image: docker\.io/image: localhost:5000/g' kube-flannel.yaml
kubectl apply -f kube-flannel.yaml
```

Run `kubectl get pods -A --watch` until all pods are up and running.

## Run an example Pod

With a cluster operational, the next step is a workload. For this simple demonstration, the [Podinfo](https://github.com/stefanprodan/podinfo) application will be deployed.

### Install Helm

This first part of the procedure must be executed from the host/laptop. If not already present, install Helm following [Installing Helm](https://helm.sh/docs/intro/install/).

Next, download the helm binary for Linux:

```bash
UARCH=$(uname -m)
# Reset the architecture variables if needed
if [["$UARCH" == "arm64" || "$UARCH" == "aarch64"]]; then

    ARCH="aarch64"
    K8s_ARCH="arm64"

else

    ARCH="x86_64"
    K8s_ARCH="amd64"

fi

curl -LO https://get.helm.sh/helm-v3.12.2-linux-${K8s_ARCH}.tar.gz
```

Add the Podinfo helm repository, download the Podinfo helm chart, download the Podinfo container image, and then finally save it to the local disk:

```bash
helm repo add https://stefanprodan.github.io/podinfo
helm fetch podinfo/podinfo --version 6.4.0
docker pull ghcr.io/stefanprodan/podinfo:6.4.0
```

### Save the podinfo image to a tar file on the local disk
```bash
docker save -o podinfo_podinfo-6.4.0.tar ghcr.io/stefanprodan/podinfo
```

```suggestion

### Transfer the image across the air gap

Reuse the `~/tmp` directory created on the air gapped VM to transport these artifacts across the air gap:

```bash
scp -i <<SSH_KEY>> <<FILE>> <<AIRGAP_VM_USER>>@<<AIRGAP_VM_IP>>:~/tmp/
```

### Continue on the isolated side

_Now pivot over to the air gap VM for the rest of the installation procedure._


Switch into `~/tmp`:
```
cd ~/tmp
```

Extract and move the `helm` binary:

```
tar -zxvf helm-v3.0.0-linux-amd64.tar.gz
mv linux-amd64/helm /usr/local/bin/helm
```

Load the Podinfo container image into the local Docker registry:

```bash
docker load -i podinfo_podinfo-6.4.0.tar
docker tag podinfo/podinfo:6.4.0 localhost:5000/podinfo/podinfo:6.4.0
docker push localhost:5000/podinfo/podinfo:6.4.0
```

Ensure "$KUBECONFIG` is set correctly, then install the Podinfo Helm chart:

```
# Outside of a demo or lab environment, use lower (or even least) privilege
# credentials to manage your workloads.
export KUBECONFIG=/etc/kubernetes/admin.conf
helm install podinfo ./podinfo-6.4.0.tgz --set image.repository=localhost:5000/podinfo/podinfo
```

Verify that the Podinfo application comes up:
```bash
kubectl get pods -n default
```
Or run k9s (a terminal user interface for Kubernetes):
```bash
k9s
```
## Zarf

Zarf is an open-source tool that takes a declarative approach to software packaging and delivery, including air gap. This same podinfo application will be installed onto the air gap VM using Zarf in this section. The first step is to install [Zarf](https://zarf.dev/install/) on the host/laptop.

Alternatively, a prebuilt binary can be downloaded onto the host/laptop from [GitHub](https://github.com/defenseunicorns/zarf/releases/) for various OS/CPU architectures.

A binary is also needed across the air gap on the VM:
```bash
UARCH=$(uname -m)
# Set the architecture variables if needed
if [["$UARCH" == "arm64" || "$UARCH" == "aarch64"]]; then

    ARCH="aarch64"
    K8s_ARCH="arm64"

else

    ARCH="x86_64"
    K8s_ARCH="amd64"

fi

export ZARF_VERSION=v0.28.3

curl -LO "https://github.com/defenseunicorns/zarf/releases/download/${ZARF_VERSION}/zarf_${ZARF_VERSION}_Linux_${K8s_ARCH}"
```
Zarf needs to bootstrap itself into a Kubernetes cluster through the use of an init package. That also needs to be transported across the air gap so let's download it onto the host/laptop:
```bash
curl -LO "https://github.com/defenseunicorns/zarf/releases/download/${ZARF_VERSION}/zarf-init-${K8s_ARCH}-${ZARF_VERSION}.tar.zst"
```
The way that Zarf is declarative is through the use of a zarf.yaml file. Here is the zarf.yaml file that will be used for this Podinfo installation. Write it to whatever directory you you have write access to on your host/laptop; your home directory is fine:
```
echo 'kind: ZarfPackageConfig
metadata:
    name: podinfo
    description: "Deploy helm chart for the podinfo application in K8s via zarf"
components:
    - name: podinfo
        required: true
        charts:
            - name: podinfo
              version: 6.4.0
              namespace: podinfo-helm-namespace
              releaseName: podinfo
              url: https://stefanprodan.github.io/podinfo
        images:
        - ghcr.io/stefanprodan/podinfo:6.4.0' > zarf.yaml
```
The next step is to build the Podinfo package. This must be done from the same directory location where the zarf.yaml file is located.
```bash
zarf package create --confirm
```
This command will download the defined helm chart and image and put them into a single file written to disk. This single file is all that needs to be carried across the air gap:

```bash
ls zarf-package-*

```
Sample output:
```bash
zarf-package-podinfo-arm64.tar.zst
```

Transport the linux zarf binary, zarf init package and Podinfo package over to the air gapped VM:

```bash
scp -i <<SSH_KEY>> <<FILE>> <<AIRGAP_VM_USER>>@<<AIRGAP_VM_IP>>:~/tmp/
```

From the air gapped VM, switch into the ~/tmp directory where all of the artifacts were placed:
```bash
cd ~/tmp
```
Set `$KUBECONFIG` to a file with credentials for the local cluster; also set the Zarf version:
```bash
export KUBECONFIG=/etc/kubernetes/admin.conf

export ZARF_VERSION=$(zarf version)
```
Make the `zarf` binary executable and (as `root`) move it to `/usr/bin`:
```bash
chmod +x zarf && sudo mv zarf /usr/bin
```

Likewise, move the Zarf init package to `/usr/bin`:
```bash
mv zarf-init-arm64-${ZARF_VERSION}.tar.zst /usr/bin
```

Initialize Zarf into the cluster:
```
zarf init --confirm --components=git-server
```
When this command is done, a Zarf package is ready to be deployed.
```bash
zarf package deploy
```
This command will search the current directory for a Zarf package. Select the podinfo package (zarf-package-podinfo-${K8s_ARCH}.tar.zst) and continue. Once the package deployment is complete, run `zarf tools monitor` in order to bring up k9s to view the cluster.

## Conclusion

This is one method that can be used to spin up an air-gapped cluster and two methods to deploy
a mission application. Your mileage may vary on different operating systems regarding the
exact software artifacts that need to be carried across the air gap, but conceptually this procedure is still valid.

This demo also created an artificial air-gapped environment. In the real world, every missed dependency
could represent hours, if not days, or weeks of lost time to get running software in the air-gapped environment.
This artificial air gap also obscured some common methods or air gap software delivery such as using a
_data diode_. Depending on the environment, the diode can be very expensive to use.
Also, none of the artifacts were scanned before being carried across the air gap.
The presence of the air gap in general means that the workload running there is more sensitive, and nothing should be carried across unless it's known to be safe.