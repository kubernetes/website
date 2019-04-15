---
title: " Creating a Raspberry Pi cluster running Kubernetes, the installation (Part 2) "
date: 2015-12-22
slug: creating-raspberry-pi-cluster-running
url: /blog/2015/12/Creating-Raspberry-Pi-Cluster-Running
---
At Devoxx Belgium and Devoxx Morocco, [Ray Tsang](https://twitter.com/saturnism) and I ([Arjen Wassink](https://twitter.com/ArjenWassink)) showed a Raspberry Pi cluster we built at Quintor running HypriotOS, Docker and Kubernetes. While we received many compliments on the talk, the most common question was about how to build a Pi cluster themselves! We’ll be doing just that, in two parts. The [first part covered the shopping list for the cluster](https://kubernetes.io/blog/2015/11/creating-a-Raspberry-Pi-cluster-running-Kubernetes-the-shopping-list-Part-1), and this second one will show you how to get kubernetes up and running . . .


Now you got your Raspberry Pi Cluster all setup, it is time to run some software on it. As mentioned in the previous blog I based this tutorial on the Hypriot linux distribution for the ARM processor. Main reason is the bundled support for Docker. I used [this version of Hypriot](http://downloads.hypriot.com/hypriot-rpi-20151004-132414.img.zip) for this tutorial, so if you run into trouble with other versions of Hypriot, please consider the version I’ve used.

First step is to make sure every Pi has Hypriot running, if not yet please check the [getting started guide](http://blog.hypriot.com/getting-started-with-docker-on-your-arm-device/) of them. Also hook up the cluster switch to a network so that Internet is available and every Pi get an IP-address assigned via DHCP. Because we will be running multiple Pi’s it is practical to give each Pi a unique hostname. I renamed my Pi’s to rpi-master, rpi-node-1, rpi-node-2, etc for my convenience. Note that on Hypriot the hostname is set by editing the /boot/occidentalis.txt file, not the /etc/hostname. You could also set the hostname using the Hypriot flash tool.


The most important thing about running software on a Pi is the availability of an ARM distribution. Thanks to [Brendan Burns](https://twitter.com/brendandburns), there are Kubernetes components for ARM available in the [Google Cloud Registry](https://cloud.google.com/container-registry/docs/). That’s great. The second hurdle is how to install Kubernetes. There are two ways; directly on the system or in a Docker container. Although the container support has an experimental status, I choose to go for that because it makes it easier to install Kubernetes for you. Kubernetes requires several processes (etcd, flannel, kubectl, etc) to run on a node, which should be started in a specific order. To ease that, systemd services are made available to start the necessary processes in the right way. Also the systemd services make sure that Kubernetes is spun up when a node is (re)booted. To make the installation real easy I created an simple install script for the master node and the worker nodes. All is available at [GitHub](https://github.com/awassink/k8s-on-rpi). So let’s get started now!

### Installing the Kubernetes master node

First we will be installing Kubernetes on the master node and add the worker nodes later to the cluster. It comes basically down to getting the git repository content and executing the installation script.

```
$ curl -L -o k8s-on-rpi.zip https://github.com/awassink/k8s-on-rpi/archive/master.zip

$ apt-get update

$ apt-get install unzip

$ unzip k8s-on-rpi.zip

$ k8s-on-rpi-master/install-k8s-master.sh
```

The install script will install five services:

* docker-bootstrap.service - is a separate Docker daemon to run etcd and flannel because flannel needs to be running before the standard Docker daemon (docker.service) because of network configuration.
* k8s-etcd.service - is the etcd service for storing flannel and kubelet data.
* k8s-flannel.service - is the flannel process providing an overlay network over all nodes in the cluster.
* docker.service - is the standard Docker daemon, but with flannel as a network bridge. It will run all Docker containers.
* k8s-master.service - is the kubernetes master service providing the cluster functionality.

The basic details of this installation procedure is also documented in the [Getting Started Guide](https://github.com/kubernetes/kubernetes/blob/release-1.1/docs/getting-started-guides/docker-multinode/master.md) of Kubernetes. Please check it to get more insight on how a multi node Kubernetes cluster is setup.


Let’s check if everything is working correctly. Two docker daemon processes must be running.

```
$ ps -ef|grep docker
root       302     1  0 04:37 ?        00:00:14 /usr/bin/docker daemon -H unix:///var/run/docker-bootstrap.sock -p /var/run/docker-bootstrap.pid --storage-driver=overlay --storage-opt dm.basesize=10G --iptables=false --ip-masq=false --bridge=none --graph=/var/lib/docker-bootstrap

root       722     1 11 04:38 ?        00:16:11 /usr/bin/docker -d -bip=10.0.97.1/24 -mtu=1472 -H fd:// --storage-driver=overlay -D
```



The etcd and flannel containers must be up.
```
$ docker -H unix:///var/run/docker-bootstrap.sock ps

CONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS              PORTS               NAMES

4855cc1450ff        andrewpsuedonym/flanneld     "flanneld --etcd-endp"   2 hours ago         Up 2 hours                              k8s-flannel

ef410b986cb3        andrewpsuedonym/etcd:2.1.1   "/bin/etcd --addr=127"   2 hours ago         Up 2 hours                              k8s-etcd


The hyperkube kubelet, apiserver, scheduler, controller and proxy must be up.

$ docker ps

CONTAINER ID        IMAGE                                           COMMAND                  CREATED             STATUS              PORTS               NAMES

a17784253dd2        gcr.io/google\_containers/hyperkube-arm:v1.1.2   "/hyperkube controller"   2 hours ago         Up 2 hours                              k8s\_controller-manager.7042038a\_k8s-master-127.0.0.1\_default\_43160049df5e3b1c5ec7bcf23d4b97d0\_2174a7c3

a0fb6a169094        gcr.io/google\_containers/hyperkube-arm:v1.1.2   "/hyperkube scheduler"   2 hours ago         Up 2 hours                              k8s\_scheduler.d905fc61\_k8s-master-127.0.0.1\_default\_43160049df5e3b1c5ec7bcf23d4b97d0\_511945f8

d93a94a66d33        gcr.io/google\_containers/hyperkube-arm:v1.1.2   "/hyperkube apiserver"   2 hours ago         Up 2 hours                              k8s\_apiserver.f4ad1bfa\_k8s-master-127.0.0.1\_default\_43160049df5e3b1c5ec7bcf23d4b97d0\_b5b4936d

db034473b334        gcr.io/google\_containers/hyperkube-arm:v1.1.2   "/hyperkube kubelet -"   2 hours ago         Up 2 hours                              k8s-master

f017f405ff4b        gcr.io/google\_containers/hyperkube-arm:v1.1.2   "/hyperkube proxy --m"   2 hours ago         Up 2 hours                              k8s-master-proxy
```


### Deploying the first pod and service on the cluster

When that’s looking good we’re able to access the master node of the Kubernetes cluster with kubectl. Kubectl for ARM can be downloaded from googleapis storage. kubectl get nodes shows which cluster nodes are registered with its status. The master node is named 127.0.0.1.
```
$ curl -fsSL -o /usr/bin/kubectl https://storage.googleapis.com/kubernetes-release/release/v1.1.2/bin/linux/arm/kubectl

$ kubectl get nodes

NAME              LABELS                                   STATUS    AGE

127.0.0.1         kubernetes.io/hostname=127.0.0.1         Ready      1h


An easy way to test the cluster is by running a busybox docker image for ARM. kubectl run can be used to run the image as a container in a pod. kubectl get pods shows the pods that are registered with its status.

$ kubectl run busybox --image=hypriot/rpi-busybox-httpd

$ kubectl get pods -o wide

NAME                   READY     STATUS    RESTARTS   AGE       NODE

busybox-fry54          1/1       Running   1          1h        127.0.0.1

k8s-master-127.0.0.1   3/3       Running   6          1h        127.0.0.1
```


Now the pod is running but the application is not generally accessible. That can be achieved by creating a service. The cluster IP-address is the IP-address the service is avalailable within the cluster. Use the IP-address of your master node as external IP and the service becomes available outside of the cluster (e.g. at http://192.168.192.161 in my case).
```
$ kubectl expose rc busybox --port=90 --target-port=80 --external-ip=\<ip-address-master-node\>

$ kubectl get svc

NAME         CLUSTER\_IP   EXTERNAL\_IP       PORT(S)   SELECTOR      AGE

busybox      10.0.0.87    192.168.192.161   90/TCP    run=busybox   1h

kubernetes   10.0.0.1     \<none\>            443/TCP   \<none\>        2h

$ curl http://10.0.0.87:90/
```


```
\<html\>

\<head\>\<title\>Pi armed with Docker by Hypriot\</title\>

  \<body style="width: 100%; background-color: black;"\>

    \<div id="main" style="margin: 100px auto 0 auto; width: 800px;"\>

      \<img src="pi\_armed\_with\_docker.jpg" alt="pi armed with docker" style="width: 800px"\>

    \</div\>

  \</body\>

\</html\>
```
### Installing the Kubernetes worker nodes

The next step is installing Kubernetes on each worker node and add it to the cluster. This also comes basically down to getting the git repository content and executing the installation script. Though in this installation the k8s.conf file needs to be copied on forehand and edited to contain the IP-address of the master node.

```
$ curl -L -o k8s-on-rpi.zip https://github.com/awassink/k8s-on-rpi/archive/master.zip

$ apt-get update

$ apt-get install unzip

$ unzip k8s-on-rpi.zip

$ mkdir /etc/kubernetes

$ cp k8s-on-rpi-master/rootfs/etc/kubernetes/k8s.conf /etc/kubernetes/k8s.conf
```
### Change the ip-address in /etc/kubernetes/k8s.conf to match the master node ###
```
$ k8s-on-rpi-master/install-k8s-worker.sh
```



The install script will install four services. These are the quite similar to ones on the master node, but with the difference that no etcd service is running and the kubelet service is configured as worker node.

Once all the services on the worker node are up and running we can check that the node is added to the cluster on the master node.
```
$ kubectl get nodes

NAME              LABELS                                   STATUS    AGE

127.0.0.1         kubernetes.io/hostname=127.0.0.1         Ready     2h

192.168.192.160   kubernetes.io/hostname=192.168.192.160   Ready     1h

$ kubectl scale --replicas=2 rc/busybox

$ kubectl get pods -o wide

NAME                   READY     STATUS    RESTARTS   AGE       NODE

busybox-fry54          1/1       Running   1          1h        127.0.0.1

busybox-j2slu          1/1       Running   0          1h        192.168.192.160

k8s-master-127.0.0.1   3/3       Running   6          2h        127.0.0.1
```


### Enjoy your Kubernetes cluster!

Congratulations! You now have your Kubernetes Raspberry Pi cluster running and can start playing with Kubernetes and start learning. Checkout the [Kubernetes User Guide](https://github.com/kubernetes/kubernetes/blob/master/docs/user-guide/README.md) to find out what you all can do. And don’t forget to pull some plugs occasionally like Ray and I do :-)


Arjen Wassink, Java Architect and Team Lead, Quintor
