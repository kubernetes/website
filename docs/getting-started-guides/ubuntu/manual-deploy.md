---
title: Manually Deploying Kubernetes on Ubuntu 16.04 LTS
---

{％ capture overview ％}
This document will lead you to build a kubernetes cluster.This cluster contains three nodes those are 1 master node and 2 worker nodes.
{％ endcapture ％}

The Container Network Interface (CNI) for this document is Flannel, and you can modify it as you like.

{% capture prerequisites %}
## Prerequisites
1. All machines can connect to the Internet.
2. All machines can communicate with each other.
3. All machines can be logged by ssh without password by.
4. All nodes of the `/etc/host` must be able to parse the other hosts on the cluster.
5. All machines is using `/bin/bash` when user login shell.
6. You have to have sudo permissions.
7. This guide has been tested without problems at ubuntu 16.04 LTS.
{% endcapture %}

{% capture steps %}
## Starting a Cluster

### Set Up Working Directory

clone `kubernetes.github.io` to master node

```shell
$ git clone https://github.com/kubernetes/kubernetes.github.io.git
```

### Start Installing Docker

This step must be done on **all nodes**

Use this command to quickly install the latest version of Docker.

```shell
$ curl -fsSL "https://get.docker.com/" | sh
```

#### Confirm  Docker Installation Status

You can use the command to confirm whether the Docker installation is successful.

```shell
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

### Start installing Etcd

This step is done on **master** node

> You can get the latest version of Etcd.[Download Etcd](https://github.com/coreos/etcd/tags)

You can use the command to install etcd and link to `/usr/bin/`.

```shell
$ cd /opt
$ wget -qO- "https://github.com/coreos/etcd/releases/download/v3.2.1/etcd-v3.2.1-linux-amd64.tar.gz" | tar -zx
$ mv etcd-v3.2.1-linux-amd64 etcd
$ cd etcd/ && ln etcd /usr/bin/ && ln etcdctl /usr/bin/
```

#### Set etcd

Go to the `kubernetes.github.io` folder

Copy **etcd.conf** to the local and then modify it

```shell
$ cp ./docs/getting-started-guides/ubuntu/file/etcd/etcd.conf /etc/default/etcd.conf
$ sed -i 's/192.168.16.100/<YOUR_MASTER_IP>/g' /etc/default/etcd.conf
```

Copy **etcd.service** to the local

```shell
$ cp ./docs/getting-started-guides/ubuntu/file/etcd/etcd.service /lib/systemd/system/
```

Start the **Etcd service**

```shell
$ systemctl enable etcd.service && systemctl start etcd.service
```

#### Confirm Etcd Service Status

You can use the command to confirm whether the Etcd service status is healthy.

```shell
$ etcdctl cluster-health
$ member ba17e528c1905b6d is healthy: got healthy result from http://192.168.16.100:2379
$ cluster is healthy
```

### Add Flannel Config To Etcd

You can use the command to add flannel config to etcd.

```shell
$ etcdctl set /atomic.io/network/config < ./docs/getting-started-guides/ubuntu/file/flannel/flannel-config.json
```

## Start Installing Flannel

This step must be done on **all nodes**

> You can get the latest version of Flannel.[Download Flannel](https://github.com/coreos/flannel/tags)

You can use the command to install flannel and link to `/usr/bin/`.

```shell
$ cd /opt
$ wget -qO- "https://github.com/coreos/flannel/releases/download/v0.7.1/flannel-v0.7.1-linux-amd64.tar.gz" | tar -zx
$ ln flanneld /usr/bin/ && ln mk-docker-opts.sh /usr/bin/
```

### Set Flannel

Go to the `kubernetes.github.io` folder

Copy **flannel.conf** to the local and then modify it

```shell
$ cp ./docs/getting-started-guides/ubuntu/file/flannel/flanneld /etc/default/flanneld
$ sed -i 's/192.168.16.100/<YOUR_MASTER_IP>/g' /etc/default/flanneld
$ sed -i 's/enp0s8/<YOUR_INTERFACE>/g' /etc/default/flanneld
```

Copy **flanneld.service** to the local and then modify it

```shell
$ cp ./docs/getting-started-guides/ubuntu/file/flannel/flanneld.service /lib/systemd/system/
```

Start the flannel service

```shell
$ systemctl enable flanneld.service && systemctl start flanneld.service
```

You can use the command to build a docker start parameter.

```shell
$ /opt/flannel/mk-docker-opts.sh -d /run/docker_opts.env -c
```

modify **docker.service** to use the flannel config.

```shell
$ /sbin/iptables -I FORWARD -s 0.0.0.0/0 -j ACCEPT
$ sed -i 's/-H fd:\/\//$DOCKER_OPTS/g' /lib/systemd/system/docker.service
$ sed -i '12 i\EnvironmentFile=/run/docker_opts.env' /lib/systemd/system/docker.service
```

restart docker service

```shell
$ systemctl daemon-reload && systemctl restart docker
```

## Start Installing Kubernetes Master Node

You will install these packages on all of your **master** node:

1. kubectl
2. kubelet
3. kubernetes-cni

```shell
$ apt-get update && apt-get install -y apt-transport-https
$ curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
$ cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF
$ apt-get update
$ apt-get update && apt-get install -y kubectl kubelet kubernetes-cni
```

### Setup OpenSSL

Go to the `kubernetes.github.io` folder

Copy **openssl.conf** to the local and then modify it

```shell
$ mkdir -p /etc/kubernetes/pki
$ cp ./docs/getting-started-guides/ubuntu/file/openssl/master/openssl.conf /etc/kubernetes/pki
$ sed -i 's/192.168.16.100/<YOUR_MASTER_IP>/g' /etc/kubernetes/pki/openssl.conf
```

You can use the command to get CA Private Key for this kubernetes cluster.

```shell
$ openssl genrsa -out /etc/kubernetes/pki/ca-key.pem 2048
$ openssl req -x509 -new -nodes -key /etc/kubernetes/pki/ca-key.pem -days 1000 -out /etc/kubernetes/pki/ca.pem -subj '/CN=kube-ca'
$ openssl genrsa -out /etc/kubernetes/pki/admin-key.pem 2048
$ openssl req -new -key /etc/kubernetes/pki/admin-key.pem -out /etc/kubernetes/pki/admin.csr -subj '/CN=kube-admin'
$ openssl x509 -req -in /etc/kubernetes/pki/admin.csr -CA /etc/kubernetes/pki/ca.pem -CAkey /etc/kubernetes/pki/ca-key.pem -CAcreateserial -out /etc/kubernetes/pki/admin.pem -days 1000
$ openssl genrsa -out /etc/kubernetes/pki/apiserver-key.pem 2048
$ openssl req -new -key /etc/kubernetes/pki/apiserver-key.pem -out /etc/kubernetes/pki/apiserver.csr -subj '/CN=kube-apiserver' -config /etc/kubernetes/pki/openssl.conf
$ openssl x509 -req -in /etc/kubernetes/pki/apiserver.csr -CA /etc/kubernetes/pki/ca.pem -CAkey /etc/kubernetes/pki/ca-key.pem -CAcreateserial -out /etc/kubernetes/pki/apiserver.pem -days 1000 -extensions v3_req -extfile /etc/kubernetes/pki/openssl.conf
```

### Setup kubernetes

Go to the `kubernetes.github.io` folder

Copy **kubelet** and **user.csv** and **admin.conf** to the local and then modify it

```shell
$ cp ./docs/getting-started-guides/ubuntu/file/kubernetes/master/user.csv /etc/kubernetes
$ cp ./docs/getting-started-guides/ubuntu/file/kubernetes/master/admin.conf /etc/kubernetes
$ cp ./docs/getting-started-guides/ubuntu/file/kubernetes/master/kubelet /etc/kubernetes
$ sed -i 's/192.168.16.100/<YOUR_MASTER_IP>/g' /etc/kubernetes/admin.conf
```

Copy **kube-apiserver.yml** and **kube-controller-manager.yml** and **kube-scheduler.yml** to the local and then modify it

```shell
$ cp ./docs/getting-started-guides/ubuntu/file/kubernetes/master/kube-apiserver.yml /etc/kubernetes/manifests
$ cp ./docs/getting-started-guides/ubuntu/file/kubernetes/master/kube-controller-manager.yml /etc/kubernetes/manifests
$ cp ./docs/getting-started-guides/ubuntu/file/kubernetes/master/kube-scheduler.yml /etc/kubernetes/manifests

$ sed -i 's/192.168.16.100/<YOUR_MASTER_IP>/g' /etc/kubernetes/manifests/kube-apiserver.yml
$ sed -i 's/192.168.16.100/<YOUR_MASTER_IP>/g' /etc/kubernetes/manifests/kube-controller-manager.yml
$ sed -i 's/192.168.16.100/<YOUR_MASTER_IP>/g' /etc/kubernetes/manifests/kube-scheduler.yml
```

Copy **kubelet.service** to the local and restart kubelet service

```shell
$ cp ./docs/getting-started-guides/ubuntu/file/kubernetes/master/kubelet.service /lib/systemd/system/kubelet.service

$ systemctl daemon-reload && systemctl restart kubelet.service
```

Wait a cup of coffee time to start kubernetes components

Use this command you will be able to view the kubernetes node situation

```shell
$ kubectl get node
NAME      STATUS         AGE
master   Ready,master   1m
```

## Start Installing Kubernetes Worker Node

You will install these packages on all of your **worker** node:

1. kubelet
2. kubernetes-cni

```shell
$ curl -s "https://packages.cloud.google.com/apt/doc/apt-key.gpg" | apt-key add -
$ echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" > /etc/apt/sources.list.d/kubernetes.list
$ apt-get update && apt-get install -y kubelet kubernetes-cni
```

### Setup OpenSSL

Go to the `kubernetes.github.io` folder

Copy **openssl.conf** to the local and then modify it

```shell
$ mkdir -p /etc/kubernetes/pki
$ cp ./docs/getting-started-guides/ubuntu/file/openssl/worker/openssl.conf /etc/kubernetes/pki
$ sed -i 's/192.168.16.101/<YOUR_WORKER_IP>/g' /etc/kubernetes/pki/openssl.conf
$ sed -i 's/node1/<YOUR_NODE_HOSTNAME>/g' /etc/kubernetes/pki/openssl.conf
```

**Warning:** This step has to been done in Master Node

{: .warning}

You have to pass those ca-key.pem ca.pem admin.pem admin-key.pem to **Worker Node** frome **Master Node**

```shell
$ cd /etc/kubernetes/pki
$ for file in ca-key.pem ca.pem admin.pem admin-key.pem; do
scp ${file} <WORKER_NODE>:/etc/kubernetes/pki/
done
```

**Warning:** And back to Worker Node

{: .warning}

You can use the command to get CA Private Key .

```shell
$ openssl genrsa -out /etc/kubernetes/pki/node-key.pem 2048
$ openssl req -new -key /etc/kubernetes/pki/node-key.pem -out /etc/kubernetes/pki/node.csr -subj '/CN=kube-node' -config /etc/kubernetes/pki/openssl.conf
$ openssl x509 -req -in /etc/kubernetes/pki/node.csr -CA /etc/kubernetes/pki/ca.pem -CAkey /etc/kubernetes/pki/ca-key.pem -CAcreateserial -out /etc/kubernetes/pki/node.pem -days 1000 -extensions v3_req -extfile /etc/kubernetes/pki/openssl.conf
```

### Setup kubernetes

Go to the `kubernetes.github.io` folder

Copy **kubelet** and **kubelet-user.conf** and **admin.conf** to the local and then modify it

```shell
$ cp ./docs/getting-started-guides/ubuntu/file/kubernetes/worker/kubelet /etc/kubernetes
$ cp ./docs/getting-started-guides/ubuntu/file/kubernetes/worker/admin.conf /etc/kubernetes
$ cp ./docs/getting-started-guides/ubuntu/file/kubernetes/worker/kubelet-user.conf /etc/kubernetes


$ sed -i 's/192.168.16.100/<YOUR_MASTER_IP>/g' /etc/kubernetes/admin.conf
$ sed -i 's/192.168.16.100/<YOUR_MASTER_IP>/g' /etc/kubernetes/kubelet-user.conf
```

Go to the `kubernetes.github.io` folder

Copy **kubelet.service** to the local and restart kubelet service

```shell
$ cp ./docs/getting-started-guides/ubuntu/file/kubernetes/worker/kubelet.service /lib/systemd/system/kubelet.service

$ systemctl daemon-reload && systemctl restart kubelet.service
```

Wait a cup of coffee time to start kubernetes components

**Warning:** This check step has to been done in Master Node

{: .warning}

Use this command you will be able to view the kubernetes node situation

```shell
$ kubectl get node
NAME      STATUS         AGE       VERSION
master   Ready,master     1m       v1.7.5
node1     Ready          21m       v1.7.5
```

## Start Installing Kubernetes Addons

This step will install kubernetes addon components,This will be executed on the **Master Node**

Copy **kube-proxy.yml** and **kube-dns.yml** and **kube-dash.yml**  and **kube-monitor.yml** to the local and then modify it

```shell
$ mkdir /etc/kubernetes/addon
$ cp ./docs/getting-started-guides/ubuntu/file/kubernetes/addon/kube-proxy.yml /etc/kubernetes/addon
$ cp ./docs/getting-started-guides/ubuntu/file/kubernetes/addon/kube-dns.yml /etc/kubernetes/addon
$ cp ./docs/getting-started-guides/ubuntu/file/kubernetes/addon/kube-dash.yml /etc/kubernetes/addon
$ cp ./docs/getting-started-guides/ubuntu/file/kubernetes/addon/kube-monitor.yml /etc/kubernetes/addon

$ sed -i 's/192.168.16.100/<YOUR_MASTER_IP>/g' /etc/kubernetes/addon/kube-dash.yml
$ sed -i 's/192.168.16.100/<YOUR_MASTER_IP>/g' /etc/kubernetes/addon/kube-monitor.yml
$ sed -i 's/192.168.16.100/<YOUR_MASTER_IP>/g' /etc/kubernetes/addon/kube-proxy.yml
```

Use this command you will be able to create kubernetes addon components.

```shell
$ cd /etc/kubernetes
$ kubectl apply -f addon/
```

Wait a cup of coffee time to start kubernetes components.

You can view kubernetes dashboard by visiting https://<YOUR_MASTER_IP>:80
{% endcapture %}

{% include templates/task.md %}
