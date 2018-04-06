---
reviewers:
- chrisnegus
title: Kubernetes on Fedora (Single Node)
---

* TOC
{:toc}

To try out Kubernetes on Fedora, you have a few choices:

* **kubeadm** - The kubeadm command provides a toolkit to bootstrap a Kubernetes cluster that is reasonable secure, extensible, and upgradable. See this document for details on using kubeadm with flannel networking to set up Kubernetes in Fedora (either as a single-node or multi-node configuration).
* **minikube** - With minikube, you run a single-node Kubernetes cluster in a virtual machine on your laptop or desktop system. See [Running Kubernetes Locally via Minikube](https://kubernetes.io/docs/getting-started-guides/minikube/) for details. See [Alternative Container Runtimes](https://kubernetes.io/docs/getting-started-guides/minikube/#alternative-container-runtimes) to replace Docker with CRI-O or rkt runtimes for minikube.

OpenShift implementations of Kubernetes are also available with Fedora:

* **minishift** - Like minikube, **minishift** runs a virtual machine to start up a single-node Kubernetes cluster. With minishift, however, OpenShift is the platform set up to manage Kubernetes. Use instructions from [Installing Minishift](https://docs.openshift.org/latest/minishift/getting-started/installing.html), being sure to set up the [KVM driver](https://docs.openshift.org/latest/minishift/getting-started/setting-up-driver-plugin.html#kvm-driver-fedora) before starting minishift.

* **oc cluster up** - A quick way to directly set up an OpenShift cluster on Fedora is to install a few required packages, then run **oc cluster up**, as described in [Start a local OpenShift all-in-one cluster](https://developer.fedoraproject.org/deployment/openshift/about.html).

* **openshift-ansible** - Use ansible playbooks to set up OpenShift in a single-node cluster directly on a Fedora system. Ansible playbooks for running OpenShift are available from the [Kubespray](https://github.com/kubernetes-incubator/kubespray) Github site.

The description here for running Kubernetes using kubeadm has been tested on Fedora and Fedora Atomic distributions. The resulting Kubernetes configuration has these attributes:

* Single node Kubernetes cluster (continue to Kubernetes Multi-node Setup to add nodes)
* Flannel networking
* Pod address range of 10.244.0.0/16
* For the single-node setup, master and node are on a single system, so the master is allowed to run pods


## Prerequisites

Get and set up the latest Fedora or Fedora Atomic on any cloud, virtualization, or bare metal environment. To do that, you can obtain appropriate media and instructions for:

* [Fedora Server Download](https://getfedora.org/en/server/download/) or
* [Fedora Atomic Host Download](https://getfedora.org/en/atomic/download/)

Follow these steps to prepare the system:

1. Make sure that operating system software is up to date. On Fedora Atomic, type:

    <pre><tt># <b>atomic host upgrade</b>
   # <b>systemctl reboot</b>
    </tt></pre>

   On a Fedora Server or Fedora Workstation system, type:

    <pre><tt># <b>dnf update -y</b>
   # <b>systemctl reboot</b>
    </tt></pre>

    Once the system comes up, log in again and run the next steps.

2. Disable swap. Comment out (#) any swap areas from /etc/fstab. For example, a commented out swap line in /etc/fstab might appear as follows:

    <pre><tt>
    <b>#</b> /dev/mapper/fedora--atomic-swap swap  swap  defaults  0 0
    </tt></pre>

3. Disable selinux. Change the SELINUX type in /etc/sysconfig/selinux to permissive, so it appears as follows:

        SELINUX=permissive

4. Immediately disable swap and SELinux:

    <pre><tt>
    # <b>swapoff -a</b>
    # <b>setenforce 0</b>
    </tt></pre>

5. Disable firewalld. On Fedora Server or Workstation only (firewalld is no on Fedora Atomic by default), type the following.

    <pre><tt>
    # <b>systemctl stop firewalld</b>
    # <b>systemctl disable firewalld</b>
    </tt></pre>

**WARNING**: Although disabling security features, such as SELinux and Firewalld, are currently needed to get this procedure to work properly, disabling them is not good practice when using Kubernetes in production. For that reason, this procedure is best used for trying and learning about Kubernetes in non-production environments.

## Set up Kubernetes

1. Install kubernetes-kubeadm for your OS:

    Fedora Atomic Host

    <pre><tt># <b>rpm-ostree install kubernetes-kubeadm ethtool ebtables -r</b>
    <i>Log in again after automatic reboot</i>
    </tt></pre>

    Fedora Workstation or Server

    <pre><tt># <b>dnf install kubernetes-kubeadm ethtool ebtables -y</b>
    </tt></pre>

2. Enable kubelet service, which manages pods on each node. (The kubelet service will start automatically after you run kubeadm init in the next step.)

    <pre><tt># <b>systemctl enable --now kubelet</b>
    </tt></pre>

3. Initialize Kubernetes. Options choose a set of IP addresses used for pods on the node and skips checks that will fail because of a later docker version:

    <pre><tt># <b>kubeadm init --pod-network-cidr=10.244.0.0/16 \
        --ignore-preflight-errors=SystemVerification</b>
    ...
    </tt></pre>

    Your Kubernetes master has initialized successfully!

    **IMPORTANT**: The output from kubeadm init shows commands to run next. To add another node later, be sure to save the kubeadm join command line, which included token information you need to connect to the master.

4. Create a .kube directory in your home directory, add a configuration file, and change ownership (to be able to use kubectl later as a regular user, login as that user and append sudo to the cp and chown commands here):

    <pre><tt># <b>mkdir -p $HOME/.kube</b>
   # <b>cp -i /etc/kubernetes/admin.conf $HOME/.kube/config</b>
   # <b>chown $(id -u):$(id -g) $HOME/.kube/config</b>
    </tt></pre>

5. Apply the flannel network plugin:

    <pre><tt># <b>kubectl apply \
        -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml</b>
    clusterrole "flannel" created
    clusterrolebinding "flannel" created
    serviceaccount "flannel" created
    configmap "kube-flannel-cfg" created
    daemonset "kube-flannel-ds" created
    </tt></pre>

6. Allow pods to run on the master. Pods do not run on the master by default, for security reasons. For single-node clusters, you must override the default. If you plan to add a node, this is not required:

    <pre><tt># <b>kubectl taint nodes --all node-role.kubernetes.io/master-</b>
    node "fedoraatomic27" untainted
    </tt></pre>

7. Check that the etcd and all kube- services are running:

    <pre><tt># <b>kubectl get pods --all-namespaces</b>
    NAMESPACE   NAME                                  READ STATUS RESTARTS AGE
    kube-system etcd-fedoraatomic27                    1/1 Running  7      56m
    kube-system kube-apiserver-fedoraatomic2           1/1 Running  8      56m
    kube-system kube-controller-manager-fedoraatomic27 1/1 Running  0      56m
    kube-system kube-dns-6f4fd4bdf-krfvt               3/3 Running  0      56m
    kube-system kube-flannel-ds-dwgw8                  1/1 Running  0       7m
    kube-system kube-proxy-t9pdb                       1/1 Running  0      56m
    kube-system kube-scheduler-fedoraatomic27          1/1 Running  0      56m
    </tt></pre>

At this point, you have a working kubernetes single-node cluster. Next try running a pod.

## Try Kubernetes with an nginx pod
To make sure your Kubernetes cluster is working, try running an Nginx (Web server and reverse proxy server) from a pod.

1. Get and run three replicas of the nginx pod, opening port 80 to access its content:

    <pre><tt># <b>kubectl run nginx --image=nginx --port=80 --replicas=3</b>
    deployment "nginx" created
    </tt></pre>

2. List information about running pods. The first set of output shows nginx pods being created; the second shows them running:

    <pre><tt># <b>kubectl get pods -o wide</b>
    NAME                 READY STATUS     RESTARTS   AGE IP     NODE
    nginx-7587c6fdb6-6mvmt 0/1 ContainerCreating 0   10s <none> fedoraatomic27
    nginx-7587c6fdb6-6nzq8 0/1 ContainerCreating 0   10s <none> fedoraatomic27
    nginx-7587c6fdb6-7xssr 0/1 ContainerCreating 0   10s <none> fedoraatomic27
    # <b>kubectl get pods -o wide</b>
    NAME                 READY STATUS   RESTARTS AGE IP         NODE
    nginx-7587c6fdb6-6mvmt 0/1 Running  0        10s 10.244.0.3 fedoraatomic27
    nginx-7587c6fdb6-6nzq8 0/1 Running  0        10s 10.244.0.4 fedoraatomic27
    nginx-7587c6fdb6-7xssr 0/1 Running  0        10s 10.244.0.5 fedoraatomic27
    </tt></pre>

3. Expose nginx ports to they are accessible from the host:

    <pre><tt># <b>kubectl expose deployment nginx --type NodePort</b>
    service "nginx" exposed
    # kubectl get svc</b>
    NAME       TYPE        CLUSTER-IP      EXTERNAL-IP  PORT(S)       AGE
    kubernetes ClusterIP   10.96.0.1       <none>       443/TCP       1h
    nginx      NodePort    10.102.237.87   <none>       80:30361/TCP  20s
    </tt></pre>

4. Check that nginx service is accessible (using the CLUSTER-IP from your output above or the exposed port from the local host). If you are running the service from a cloud or virtual machine, the exposed port lets you access the service from your local system using the VM’s name or IP address:

    <pre><tt># <b>curl http://10.102.237.87:80</b>
    &lt;h1&gt;Welcome to nginx!&lt;h1&gt;
    &lt;p&gt;If you see this page, the nginx web server is successfully installed and working.
    Further configuration is required.&lt;p&gt;

    # <b>curl http://myfedoravm:30361</b>
    &lt;h1&gt;Welcome to nginx!&lt;h1&gt; ...
    </tt></pre>

5. Add optional packages. As you use kubernetes, there are other tools available with Fedora you might find useful for working with containers. These include:

    * **[buildah](https://github.com/projectatomic/buildah)** - Used to build containers without the docker command or service.
    * **[skopeo](https://github.com/projectatomic/skopeo)** - Uset to interact with local and remote container images and registries.
    * **[runc](https://github.com/projectatomic/runc)** - Runs containers without requiring an active runtime environment.

    To install these packages for your OS:

    Fedora Atomic Host
    
    <pre><tt># <b>rpm-ostree -r buildah skopeo runc</b>
    <i>Log in again after automatic reboot</i>
    </tt></pre>

    Fedora Workstation or Server
    
    <pre><tt># <b>dnf install buildah skopeo runc</b>
    </tt></pre>

At this point, your Kubernetes cluster is ready to use

To add other systems to expand Kubernetes from a single-node to a multi-node cluster, refer to [Kubernetes on Fedora - Multi-node](https://kubernetes.io/docs/getting-started-guides/fedora/flannel_multi_node_cluster/) for details.


## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Bare-metal           | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/fedora_manual_config/)      |          | Community
libvirt              | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/fedora_manual_config/)      |          | Community
KVM                  | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/fedora_manual_config/)      |          | Community


For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.
