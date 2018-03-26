---
reviewers:
- mikedanese
- luxas
- errordeveloper
- jbeda
title: Creating HA clusters with kubeadm
---

{% capture overview %}

This guide shows you how to install and set up a highly available Kubernetes cluster using kubeadm.

This document shows you how to perform setup tasks that kubeadm doesn't perform: provision hardware; configure multiple systems; and load balancing.

**Note:** This guide is only one potential solution, and there are many ways to configure a highly available cluster. If a better solution works for you, please use it. If you find a better solution that can be adopted by the community, feel free to contribute it back.
{: .note}

{% endcapture %}

{% capture prerequisites %}

- Three machines that meet [kubeadm's minimum requirements](https://kubernetes.io/docs/setup/independent/install-kubeadm/#before-you-begin) for the masters
- Three machines that meet [kubeadm's minimum requirements](https://kubernetes.io/docs/setup/independent/install-kubeadm/#before-you-begin) for the workers
- **Optional:** At least three machines that meet [kubeadm's minimum requirements](https://kubernetes.io/docs/setup/independent/install-kubeadm/#before-you-begin)
   if you intend to host etcd on dedicated nodes (see information below)
- 1GB or more of RAM per machine (any less will leave little room for your apps)
- Full network connectivity between all machines in the cluster (public or
   private network is fine)

{% endcapture %}

{% capture steps %}

## Installing prerequisites on masters

For each master that has been provisioned, follow the [installation guide](/docs/setup/independent/install-kubeadm/) on how to install kubeadm and its dependencies. At the end of this step, you should have all the dependencies installed on each master.

## Setting up an HA etcd cluster

For highly available setups, you will need to decide how to host your etcd cluster. A cluster is composed of at least 3 members. We recommend one of the following models:

1. Hosting etcd cluster on separate compute nodes (Virtual Machines), or
2. Hosting etcd cluster on the master nodes.

While the first option provides more performance and better hardware isolation, it is also more expensive and requires an additional support burden.

For **Option 1**: create 3 virtual machines that follow [CoreOS's hardware recommendations](https://coreos.com/etcd/docs/latest/op-guide/hardware.html). For the sake of simplicity, we will refer to them as `etcd0`, `etcd1` and `etcd2`.

For **Option 2**: you can skip to the next step. Any reference to `etcd0`, `etcd1` and `etcd2` throughout this guide should be replaced with `master0`, `master1` and `master2` accordingly, since your master nodes host etcd.

### Create etcd CA certs

1. Install `cfssl` and `cfssljson`:

   ```shell
   curl -o /usr/local/bin/cfssl https://pkg.cfssl.org/R1.2/cfssl_linux-amd64
   curl -o /usr/local/bin/cfssljson https://pkg.cfssl.org/R1.2/cfssljson_linux-amd64
   chmod +x /usr/local/bin/cfssl*
   ```

1. SSH into `etcd0` and run the following:

   ```shell
   mkdir -p /etc/kubernetes/pki/etcd
   cd /etc/kubernetes/pki/etcd
   ```
   ```shell
   cat >ca-config.json <<EOF
   {
       "signing": {
           "default": {
               "expiry": "43800h"
           },
           "profiles": {
               "server": {
                   "expiry": "43800h",
                   "usages": [
                       "signing",
                       "key encipherment",
                       "server auth",
                       "client auth"
                   ]
               },
               "client": {
                   "expiry": "43800h",
                   "usages": [
                       "signing",
                       "key encipherment",
                       "client auth"
                   ]
               },
               "peer": {
                   "expiry": "43800h",
                   "usages": [
                       "signing",
                       "key encipherment",
                       "server auth",
                       "client auth"
                   ]
               }
           }
       }
   }
   EOF
   ```
   ```shell
   cat >ca-csr.json <<EOF
   {
       "CN": "etcd",
       "key": {
           "algo": "rsa",
           "size": 2048
       }
   }
   EOF
   ```

   **Optional:** You can modify `ca-csr.json` to add a section for `names`.
   See [the CFSSL wiki](https://github.com/cloudflare/cfssl/wiki/Creating-a-new-CSR) for an example.
   {: .note}

1. Next, generate the CA certs like so:

   ```shell
   cfssl gencert -initca ca-csr.json | cfssljson -bare ca -
   ```

### Generate etcd client certs

1. Generate the client certificates.

   While on `etcd0`, run the following:

   ```shell
   cat >client.json <<EOF
   {
       "CN": "client",
       "key": {
           "algo": "ecdsa",
           "size": 256
       }
   }
   EOF
   ```
   ```shell
   cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=client client.json | cfssljson -bare client
   ```

This should result in `client.pem` and `client-key.pem` being created.

### Create SSH access

In order to copy certs between machines, you must enable SSH access for `scp`.

1. First, open new tabs in your shell for `etcd1` and `etcd2`. Ensure you are SSHed into all three machines and then run the following (it will be a lot quicker if you use tmux syncing - to do this in iTerm enter `cmd+shift+i`):

   ```shell
   export PEER_NAME=$(hostname)
   export PRIVATE_IP=$(ip addr show eth1 | grep -Po 'inet \K[\d.]+')
   ```

   Make sure that `eth1` corresponds to the network interface for the IPv4 address of the private network. This might vary depending on your networking setup, so please check by running `echo $PRIVATE_IP` before continuing.

1. Next, generate some SSH keys for the boxes:

   ```shell
   ssh-keygen -t rsa -b 4096 -C "<email>"
   ```

   Make sure to replace `<email>` with your email, a placeholder, or an empty string. Keep hitting enter until files exist in `~/.ssh`.

1. Output the contents of the public key file for `etcd1` and `etcd2`, like so:

   ```shell
   cat ~/.ssh/id_rsa.pub
   ```

1. Finally, copy the output for each and paste them into `etcd0`'s `~/.ssh/authorized_keys` file. This will permit `etcd1` and `etcd2` to SSH in to the machine.

### Generate etcd server and peer certs

1. In order to generate certs, each etcd machine needs the root CA generated by `etcd0`. On `etcd1` and `etcd2`, run the following:

   ```shell
   mkdir -p /etc/kubernetes/pki/etcd
   cd /etc/kubernetes/pki/etcd
   scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/ca.pem .
   scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/ca-key.pem .
   scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/client.pem .
   scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/client-key.pem .
   scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/ca-config.json .
   ```

   Where `<etcd0-ip-address>` corresponds to the public or private IPv4 of `etcd0`.

1. Once this is done, run the following on all etcd machines:

   ```shell
   cfssl print-defaults csr > config.json
   sed -i '0,/CN/{s/example\.net/'"$PEER_NAME"'/}' config.json
   sed -i 's/www\.example\.net/'"$PRIVATE_IP"'/' config.json
   sed -i 's/example\.net/'"$PEER_NAME"'/' config.json

   cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=server config.json | cfssljson -bare server
   cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=peer config.json | cfssljson -bare peer
   ```

   The above will replace the default configuration with your machine's hostname as the peer name, and its IP addresses. Make sure
   these are correct before generating the certs. If you found an error, reconfigure `config.json` and re-run the `cfssl` commands.

This will result in the following files: `peer.pem`, `peer-key.pem`, `server.pem`, `server-key.pem`.

### Run etcd

Now that all the certificates have been generated, you will now install and set up etcd on each machine.

{% capture choose %}
Please select one of the tabs to see installation instructions for the respective way to run etcd.
{% endcapture %}

{% capture systemd %}

1. First you will install etcd binaries like so:

   ```shell
   export ETCD_VERSION=v3.1.10
   curl -sSL https://github.com/coreos/etcd/releases/download/${ETCD_VERSION}/etcd-${ETCD_VERSION}-linux-amd64.tar.gz | tar -xzv --strip-components=1 -C /usr/local/bin/
   rm -rf etcd-$ETCD_VERSION-linux-amd64*
   ```

   It is worth noting that etcd v3.1.10 is the preferred version for Kubernetes v1.9. For other versions of Kubernetes please consult [the changelog](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md).

   Also, please realise that most distributions of Linux already have a version of etcd installed, so you will be replacing the system default.

1. Next, generate the environment file that systemd will use:

   ```
   touch /etc/etcd.env
   echo "PEER_NAME=$PEER_NAME" >> /etc/etcd.env
   echo "PRIVATE_IP=$PRIVATE_IP" >> /etc/etcd.env
   ```

1. Now copy the systemd unit file like so:

   ```shell
   cat >/etc/systemd/system/etcd.service <<EOF
   [Unit]
   Description=etcd
   Documentation=https://github.com/coreos/etcd
   Conflicts=etcd.service
   Conflicts=etcd2.service

   [Service]
   EnvironmentFile=/etc/etcd.env
   Type=notify
   Restart=always
   RestartSec=5s
   LimitNOFILE=40000
   TimeoutStartSec=0

   ExecStart=/usr/local/bin/etcd --name ${PEER_NAME} \
       --data-dir /var/lib/etcd \
       --listen-client-urls https://${PRIVATE_IP}:2379 \
       --advertise-client-urls https://${PRIVATE_IP}:2379 \
       --listen-peer-urls https://${PRIVATE_IP}:2380 \
       --initial-advertise-peer-urls https://${PRIVATE_IP}:2380 \
       --cert-file=/etc/kubernetes/pki/etcd/server.pem \
       --key-file=/etc/kubernetes/pki/etcd/server-key.pem \
       --client-cert-auth \
       --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.pem \
       --peer-cert-file=/etc/kubernetes/pki/etcd/peer.pem \
       --peer-key-file=/etc/kubernetes/pki/etcd/peer-key.pem \
       --peer-client-cert-auth \
       --peer-trusted-ca-file=/etc/kubernetes/pki/etcd/ca.pem \
       --initial-cluster <etcd0>=https://<etcd0-ip-address>:2380,<etcd1>=https://<etcd1-ip-address>:2380,<etcd2>=https://<etcd2-ip-address>:2380 \
       --initial-cluster-token my-etcd-token \
       --initial-cluster-state new

   [Install]
   WantedBy=multi-user.target
   EOF
   ```

   Make sure you replace `<etcd0-ip-address>`, `<etcd1-ip-address>` and `<etcd2-ip-address>` with the appropriate IPv4 addresses. Also, make sure that you replace `<etcd0>`, `<etcd1>` and `<etcd2>` with real hostnames of each machine. These machines must be able to reach every other using DNS or make sure that records are added to `/etc/hosts`.

1. Finally, launch etcd like so:

   ```shell
   systemctl daemon-reload
   systemctl start etcd
   ```

1. Check that it launched successfully:

   ```shell
   systemctl status etcd
   ```
{% endcapture %}

{% capture static_pods %}

**Note**: This is only supported on nodes that have the all dependencies for the kubelet installed. If you are hosting etcd on the master nodes, this has already been set up. If you are hosting etcd on dedicated nodes, you should either use systemd or run the [installation guide](/docs/setup/independent/install-kubeadm/) on each dedicated etcd machine.

1. The first step is to run the following to generate the manifest file:

   ```shell
   cat >/etc/kubernetes/manifests/etcd.yaml <<EOF
   apiVersion: v1
   kind: Pod
   metadata:
   labels:
       component: etcd
       tier: control-plane
   name: <podname>
   namespace: kube-system
   spec:
   containers:
   - command:
       - etcd --name ${PEER_NAME} \
       - --data-dir /var/lib/etcd \
       - --listen-client-urls https://${PRIVATE_IP}:2379 \
       - --advertise-client-urls https://${PRIVATE_IP}:2379 \
       - --listen-peer-urls https://${PRIVATE_IP}:2380 \
       - --initial-advertise-peer-urls https://${PRIVATE_IP}:2380 \
       - --cert-file=/certs/server.pem \
       - --key-file=/certs/server-key.pem \
       - --client-cert-auth \
       - --trusted-ca-file=/certs/ca.pem \
       - --peer-cert-file=/certs/peer.pem \
       - --peer-key-file=/certs/peer-key.pem \
       - --peer-client-cert-auth \
       - --peer-trusted-ca-file=/certs/ca.pem \
       - --initial-cluster etcd0=https://<etcd0-ip-address>:2380,etcd1=https://<etcd1-ip-address>:2380,etcd2=https://<etcd2-ip-address>:2380 \
       - --initial-cluster-token my-etcd-token \
       - --initial-cluster-state new
       image: gcr.io/google_containers/etcd-amd64:3.1.0
       livenessProbe:
       httpGet:
           path: /health
           port: 2379
           scheme: HTTP
       initialDelaySeconds: 15
       timeoutSeconds: 15
       name: etcd
       env:
       - name: PUBLIC_IP
       valueFrom:
           fieldRef:
           fieldPath: status.hostIP
       - name: PRIVATE_IP
       valueFrom:
           fieldRef:
           fieldPath: status.podIP
       - name: PEER_NAME
       valueFrom:
           fieldRef:
           fieldPath: metadata.name
       volumeMounts:
       - mountPath: /var/lib/etcd
       name: etcd
       - mountPath: /certs
       name: certs
   hostNetwork: true
   volumes:
   - hostPath:
       path: /var/lib/etcd
       type: DirectoryOrCreate
       name: etcd
   - hostPath:
       path: /etc/kubernetes/pki/etcd
       name: certs
   EOF
   ```

   Make sure you replace:
   * `<podname>` with the name of the node you're running on (e.g. `etcd0`, `etcd1` or `etcd2`)
   * `<etcd0-ip-address>`, `<etcd1-ip-address>` and `<etcd2-ip-address>` with the public IPv4s of the other machines that host etcd.

{% endcapture %}

{% assign tab_set_name = "etcd_mode" %}
{% assign tab_names = "Choose one...,systemd,Static Pods" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: choose | push: systemd | push: static_pods %}

{% include tabs.md %}

## Set up master Load Balancer

The next step is to create a Load Balancer that sits in front of your master nodes. How you do this depends on your environment; you could, for example, leverage a cloud provider Load Balancer, or set up your own using NGINX, keepalived, or HAproxy.

{% capture choose %}
Please select one of the tabs to see installation instructions for information on load balancing in the respective environment.
{% endcapture %}

{% capture cloud %}
Some examples of cloud provider solutions are:

* [AWS Elastic Load Balancer](https://aws.amazon.com/elasticloadbalancing/)
* [GCE Load Balancing](https://cloud.google.com/compute/docs/load-balancing/)
* [Azure](https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-overview)

You will need to ensure that the load balancer routes to **just `master0` on port 6443**. This is because kubeadm will perform health checks using the load balancer IP. Since `master0` is set up individually first, the other masters will not have running apiservers, which will result in kubeadm hanging indefinitely.

If possible, use a smart load balancing algorithm like "least connections", and use health checks so unhealthy nodes can be removed from circulation. Most providers will provide these features.
{% endcapture %}

{% capture onsite %}
In an on-site environment there may not be a physical load balancer available. Instead, a virtual IP pointing to a healthy master node can be used. There are a number of solutions for this including keepalived, Pacemaker and probably many others, some with and some without load balancing.

As an example we outline a simple setup based on keepalived. Depending on environment and requirements people may prefer different solutions. The configuration shown here provides an _active/passive_ failover without load balancing. If required, load balancing can by added quite easily by setting up HAProxy, NGINX or similar on the master nodes (not covered in this guide). 

1. Install keepalived, e.g. using your distribution's package manager. The configuration shown here works with version `1.3.5` but is expected to work with may other versions. Make sure to have it enabled (chkconfig, systemd, ...) so that it starts automatically when the respective node comes up.

2. Create the following configuration file _/etc/keepalived/keepalived.conf_ on all master nodes:

    ```shell
    ! Configuration File for keepalived
    global_defs {
      router_id LVS_DEVEL
    }
    
    vrrp_script check_apiserver {
      script "/etc/keepalived/check_apiserver.sh"
      interval 3
      weight -2
      fall 10
      rise 2
    }
    
    vrrp_instance VI_1 {
        state <STATE>
        interface <INTERFACE>
        virtual_router_id 51
        priority <PRIORITY>
        authentication {
            auth_type PASS
            auth_pass 4be37dc3b4c90194d1600c483e10ad1d
        }
        virtual_ipaddress {
            <VIRTUAL-IP>
        }
        track_script {
            check_apiserver
        }
    }
    ```

    In the section `vrrp_instance VI_1`, change few lines depending on your setup:

    * `state` is either `MASTER` (on the first master nodes) or `BACKUP` (the other master nodes).
    * `interface` is the name of an existing public interface to bind the virtual IP to (usually the primary interface).
    * `priority` should be higher for the first master node, e.g. 101, and lower for the others, e.g. 100.
    * `auth_pass` use any random string here.
    * `virtual_ipaddresses` should contain the virtual IP for the master nodes.

3. Install the following health check script to _/etc/keepalived/check_apiserver.sh_ on all master nodes:

    ```shell
    #!/bin/sh

    errorExit() {
        echo "*** $*" 1>&2
        exit 1
    }

    curl --silent --max-time 2 --insecure https://localhost:6443/ -o /dev/null || errorExit "Error GET https://localhost:6443/"
    if ip addr | grep -q <VIRTUAL-IP>; then
        curl --silent --max-time 2 --insecure https://<VIRTUAL-IP>:6443/ -o /dev/null || errorExit "Error GET https://<VIRTUAL-IP>:6443/"
    fi
    ```
    
    Replace the `<VIRTUAL-IP>` by your chosen virtual IP.

4. Restart keepalived. While no Kubernetes services are up yet it will log health check fails on all master nodes. This will stop as soon as the first master node has been bootstrapped.

{% endcapture %}

{% assign tab_set_name = "lb_mode" %}
{% assign tab_names = "Choose one...,Cloud,On-Site" | split: ',' | compact %}
{% assign tab_contents = site.emptyArray | push: choose | push: cloud | push: onsite %}

{% include tabs.md %}

## Acquire etcd certs

Only follow this step if your etcd is hosted on dedicated nodes (**Option 1**). If you are hosting etcd on the masters (**Option 2**), you can skip this step since you've already generated the etcd certificates on the masters.

1. Generate SSH keys for each of the master nodes by following the steps in the [create ssh access](#create-ssh-access) section. After doing this, each master will have an SSH key in `~/.ssh/id_rsa.pub` and an entry in `etcd0`'s `~/.ssh/authorized_keys` file.

1. Run the following:

   ```shell
   mkdir -p /etc/kubernetes/pki/etcd
   scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/ca.pem /etc/kubernetes/pki/etcd
   scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/client.pem /etc/kubernetes/pki/etcd
   scp root@<etcd0-ip-address>:/etc/kubernetes/pki/etcd/client-key.pem /etc/kubernetes/pki/etcd
   ```

## Run `kubeadm init` on `master0` {#kubeadm-init-master0}

1. In order for kubeadm to run, you first need to write a configuration file:

   ```shell
   cat >config.yaml <<EOF
   apiVersion: kubeadm.k8s.io/v1alpha1
   kind: MasterConfiguration
   api:
     advertiseAddress: <private-ip>
   etcd:
     endpoints:
     - https://<etcd0-ip-address>:2379
     - https://<etcd1-ip-address>:2379
     - https://<etcd2-ip-address>:2379
     caFile: /etc/kubernetes/pki/etcd/ca.pem
     certFile: /etc/kubernetes/pki/etcd/client.pem
     keyFile: /etc/kubernetes/pki/etcd/client-key.pem
   networking:
     podSubnet: <podCIDR>
   apiServerCertSANs:
   - <load-balancer-ip>
   apiServerExtraArgs:
     apiserver-count: "3"
   EOF
   ```

   Ensure that the following placeholders are replaced:

   - `<private-ip>` with the private IPv4 of the master server.
   - `<etcd0-ip>`, `<etcd1-ip>` and `<etcd2-ip>` with the IP addresses of your three etcd nodes
   - `<podCIDR>` with your Pod CIDR. Please read the [CNI network section](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/#pod-network) of the docs for more information. Some CNI providers do not require a value to be set.

   **Note:** If you are using Kubernetes 1.9+, you can replace the `apiserver-count: 3` extra argument with `endpoint-reconciler-type: lease`. For more information, see [the documentation](https://kubernetes.io/docs/admin/high-availability/#endpoint-reconciler).

1. When this is done, run kubeadm like so:

   ```shell
   kubeadm init --config=config.yaml
   ```

## Run `kubeadm init` on `master1` and `master2`

Before running kubeadm on the other masters, you need to first copy the K8s CA cert from `master0`. To do this, you have two options:

#### Option 1: Copy with scp

1. Follow the steps in the [create ssh access](#create-ssh-access) section, but instead of adding to `etcd0`'s `authorized_keys` file, add them to `master0`.
1. Once you've done this, run:

   ```shell
   scp root@<master0-ip-address>:/etc/kubernetes/pki/* /etc/kubernetes/pki
   rm apiserver.crt
   ```

#### Option 2: Copy paste

1. Copy the contents of `/etc/kubernetes/pki/ca.crt`, `/etc/kubernetes/pki/ca.key`, `/etc/kubernetes/pki/sa.key` and `/etc/kubernetes/pki/sa.pub` and create these files manually on `master1` and `master2`.

When this is done, you can follow the [previous step](#kubeadm-init-master0) to install the control plane with kubeadm.

## Add `master1` and `master2` to load balancer

Once kubeadm has provisioned the other masters, you can add them to the load balancer pool.

## Install CNI network

Follow the instructions [here](/docs/setup/independent/create-cluster-kubeadm/#pod-network) to install the pod network. Make sure this corresponds to whichever pod CIDR you provided in the master configuration file.

## Install workers

Next provision and set up the worker nodes. To do this, you will need to provision at least 3 Virtual Machines.

1. To configure the worker nodes, [follow the same steps](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/#44-joining-your-nodes) as non-HA workloads.

## Configure workers

1. Reconfigure kube-proxy to access kube-apiserver via the load balancer:

   ```shell
   kubectl get configmap -n kube-system kube-proxy -o yaml > kube-proxy-cm.yaml
   sed -i 's#server:.*#server: https://<masterLoadBalancerFQDN>:6443#g' kube-proxy-cm.yaml
   kubectl apply -f kube-proxy-cm.yaml --force
   # restart all kube-proxy pods to ensure that they load the new configmap
   kubectl delete pod -n kube-system -l k8s-app=kube-proxy
   ```

1. Reconfigure the kubelet to access kube-apiserver via the load balancer:

   ```shell
   sudo sed -i 's#server:.*#server: https://<masterLoadBalancerFQDN>:6443#g' /etc/kubernetes/kubelet.conf
   sudo systemctl restart kubelet
   ```

{% endcapture %}

{% include templates/task.md %}
