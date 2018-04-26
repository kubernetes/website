---
approvers:
- jdef
title: Kubernetes on Mesos
+cn-approvers:
 +- okzhchy
 +- tianshapjq
---

* TOC
{:toc}
<!--
## About Kubernetes on Mesos 
-->

<!-- TODO: Update, clean up. -->

<!--
Mesos allows dynamic sharing of cluster resources between Kubernetes and other first-class Mesos frameworks such as [HDFS][1], [Spark][2], and [Chronos][3].
Mesos also ensures applications from different frameworks running on your cluster are isolated and that resources are allocated fairly among them.

Mesos clusters can be deployed on nearly every IaaS cloud provider infrastructure or in your own physical datacenter. Kubernetes on Mesos runs on-top of that and therefore allows you to easily move Kubernetes workloads from one of these environments to the other.

This tutorial will walk you through setting up Kubernetes on a Mesos cluster.
It provides a step by step walk through of adding Kubernetes to a Mesos cluster and starting your first pod with an nginx webserver.

**NOTE:** There are [known issues with the current implementation][7] and support for centralized logging and monitoring is not yet available.
Please [file an issue against the kubernetes-mesos project][8] if you have problems completing the steps below.

Further information is available in the Kubernetes on Mesos [contrib directory][13]. 
-->

## 关于 Kubernetes on Mesos 


Mesos 支持 Kubernetes 和其他 Mesos 一级框架如 [HDFS][1], [Spark][2], 和 [Chronos][3] 的集群资源动态共享。
同时 Mesos 保证了集群中不同框架中应用间合理的资源分配与隔离。

Mesos 集群可以部署在几乎所有IaaS云供应商的基础设施上或您自己的物理数据中心中。Kubernetes on Mesos 可以让您可以更容易地把 Kubernetes 的工作负载从其中一个环境迁移至其他环境中。

本教程将带您在 Mesos 集群上安装 Kubernetes。将会告诉您如何一步一步地添加 Kubernetes 到 Mesos 集群并启动第一个 nginx web 服务器 pod。

**注意:**  [当前步骤中的已知问题][7] 以及不支持集中日志和监控.
如果您在以下步骤中遇到问题，请 [在 kubernetes-mesos 提出 issue][8] .

更多信息请参阅 Kubernetes on Mesos [贡献目录][13].

<!--
### Prerequisites 
- Understanding of [Apache Mesos][6]
- A running [Mesos cluster on Google Compute Engine][5]
- A [VPN connection][10] to the cluster
- A machine in the cluster which should become the Kubernetes *master node* with:
  - Go (see [here](https://git.k8s.io/community/contributors/devel/development.md) for required versions)
  - make (i.e. build-essential)
  - Docker
-->
### 先决条件  
  - 了解[Apache Mesos][6]
- 运行的 [谷歌计算引擎 GCE 上面的 Mesos 集群][5]
- [ VPN 连接][10] 到集群
- 集群中的一台机器作为 Kubernetes 的 * master 节点* 具有如下特性:

  - 支持 Go 语言 (点击 [这里](https://git.k8s.io/community/contributors/devel/development.md) 查看版本要求)
  - make (i.e. build-essential)
  - Docker

<!-- 
**Note**: You *can*, but you *don't have to* deploy Kubernetes-Mesos on the same machine the Mesos master is running on.
-->

**注意**: 您 *可以*, 但是您*不一定要* 将 Kubernetes-Mesos 和 Mesos 的Master 节点部署在同一台机器上.
<!--
### Deploy Kubernetes-Mesos

Log into the future Kubernetes *master node* over SSH, replacing the placeholder below with the correct IP address.
-->
### 部署 Kubernetes-Mesos
使用 SSH 登录到 Kubernetes 的 *master 节点* , 将以下占位符替换为相应的IP地址.
```shell
ssh jclouds@${ip_address_of_master_node}
```

<!--Build Kubernetes-Mesos.-->
构建 Kubernetes-Mesos

```shell
git clone https://github.com/kubernetes-incubator/kube-mesos-framework
cd kube-mesos-framework
make
```
<!--
Set some environment variables.
The internal IP address of the master may be obtained via `hostname -i`.
-->
设置环境变量。Set some environment variables.
使用 `hostname -i` 命令来获取 master 的内部 IP 地址.

```shell
export KUBERNETES_MASTER_IP=$(hostname -i)
export KUBERNETES_MASTER=http://${KUBERNETES_MASTER_IP}:8888
```
<!--
Note that KUBERNETES_MASTER is used as the api endpoint. If you have existing `~/.kube/config` and point to another endpoint, you need to add option `--server=${KUBERNETES_MASTER}` to kubectl in later steps.
-->
请注意，KUBERNETES_MASTER 被用来作为 api endpoint. 如果您已经定义了这个文件 `~/.kube/config` 并且指向了其他终端，您需要在后面步骤中在 kubectl 命令后加上 `--server=${KUBERNETES_MASTER}` .
<!--
### Deploy etcd

Start etcd and verify that it is running:
-->
### 部署 etcd

启动 etcd 并验证运行状况:
```shell
sudo docker run -d --hostname $(uname -n) --name etcd \
  -p 4001:4001 -p 7001:7001 quay.io/coreos/etcd:v2.2.1 \
  --listen-client-urls http://0.0.0.0:4001 \
  --advertise-client-urls http://${KUBERNETES_MASTER_IP}:4001
```

```shell
$ sudo docker ps
CONTAINER ID   IMAGE                        COMMAND   CREATED   STATUS   PORTS                NAMES
fd7bac9e2301   quay.io/coreos/etcd:v2.2.1   "/etcd"   5s ago    Up 3s    2379/tcp, 2380/...   etcd
```

<!--
It's also a good idea to ensure your etcd instance is reachable by testing it
-->
同时最好用以下代码测试您的 etcd 实例，保证可达
```shell
curl -L http://${KUBERNETES_MASTER_IP}:4001/v2/keys/
```

<!--
If connectivity is OK, you will see an output of the available keys in etcd (if any).
-->
如果连接正常，您会看到数据库中的 键值 列表（如果有的话）

<!--
### Start Kubernetes-Mesos Services
-->
启动 Kubernetes-Mesos 服务

<!--
Update your PATH to more easily run the Kubernetes-Mesos binaries:
-->
将 Kubernetes-Mesos 添加到环境变量 PATH 里面

```shell
export PATH="$(pwd)/_output/local/go/bin:$PATH"
```

<!--
Identify your Mesos master: depending on your Mesos installation this is either a `host:port` like `mesos-master:5050` or a ZooKeeper URL like `zk://zookeeper:2181/mesos`.
In order to let Kubernetes survive Mesos master changes, the ZooKeeper URL is recommended for production environments.
-->
确认您的 Mesos master 节点：取决于您的安装方式，可能是 `host:port` 形式，就像 `mesos-master:5050`；或者是 ZooKeeper URL 的形式，就像 `zk://zookeeper:2181/mesos`。为了让 Kubernetes 在 Mesos master 节点的更改时运行良好，在生产环境中推荐使用 ZooKeeper URL 的形式。

```shell
export MESOS_MASTER=<host:port or zk:// url>
```

<!--
Create a cloud config file `mesos-cloud.conf` in the current directory with the following contents:
-->
使用下列语句在当前路径创建一个 cloud 配置文件 `mesos-cloud.conf`

```shell
$ cat <<EOF >mesos-cloud.conf
[mesos-cloud]
        mesos-master        = ${MESOS_MASTER}
EOF
```

<!--
Now start the kubernetes-mesos API server, controller manager, and scheduler on the master node:
-->
现在，在 master 节点上启动下列组件 kubernetes-mesos API server, controller manager, 以及 scheduler：

```shell
$ km apiserver \
  --address=${KUBERNETES_MASTER_IP} \
  --etcd-servers=http://${KUBERNETES_MASTER_IP}:4001 \
  --service-cluster-ip-range=10.10.10.0/24 \
  --port=8888 \
  --cloud-provider=mesos \
  --cloud-config=mesos-cloud.conf \
  --secure-port=0 \
  --v=1 >apiserver.log 2>&1 &

$ km controller-manager \
  --master=${KUBERNETES_MASTER_IP}:8888 \
  --cloud-provider=mesos \
  --cloud-config=./mesos-cloud.conf  \
  --v=1 >controller.log 2>&1 &

$ km scheduler \
  --address=${KUBERNETES_MASTER_IP} \
  --mesos-master=${MESOS_MASTER} \
  --etcd-servers=http://${KUBERNETES_MASTER_IP}:4001 \
  --mesos-user=root \
  --api-servers=${KUBERNETES_MASTER_IP}:8888 \
  --cluster-dns=10.10.10.10 \
  --cluster-domain=cluster.local \
  --v=2 >scheduler.log 2>&1 &
```

<!--Disown your background jobs so that they'll stay running if you log out.-->
运行 disown 命令，保证后台任务在您登出后保持运行.

```shell
disown -a
```

<!--
#### Validate KM Services

Interact with the kubernetes-mesos framework via `kubectl`:
-->
#### 验证 KM 服务

通过 `kubectl` 与 kubernetes-mesos 框架进行交互:

```shell
$ kubectl get pods
NAME      READY     STATUS    RESTARTS   AGE
```

```shell
# NOTE: your service IPs will likely differ
$ kubectl get services
NAME             CLUSTER-IP       EXTERNAL-IP     PORT(S)        AGE
k8sm-scheduler   10.10.10.113     <none>          10251/TCP      1d
kubernetes       10.10.10.1       <none>          443/TCP        1d
```

<!--
Lastly, look for Kubernetes in the Mesos web GUI by pointing your browser to
`http://<mesos-master-ip:port>`. Make sure you have an active VPN connection.
Go to the Frameworks tab, and look for an active framework named "Kubernetes".

## Spin up a pod

Write a JSON pod description to a local file:
-->
最后，使用浏览器访问 Mesos web GUI 所在地址 `http://<mesos-master-ip:port>`. 确保您有 VPN 连接正在运行.
在 Frameworks 选项卡中找到运行中的框架  "Kubernetes".

## 启动 pod

在本地文件中创建一个 JSON 格式的 pod 描述文件:


```shell
$ cat <<EOPOD >nginx.yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
EOPOD
```

<!--
Send the pod description to Kubernetes using the `kubectl` CLI:
-->
使用 `kubectl` CLI 向 Kubernetes 发送 pod 描述文件:

```shell
$ kubectl create -f ./nginx.yaml
pod "nginx" created
```

<!--
Wait a minute or two while `dockerd` downloads the image layers from the internet.
We can use the `kubectl` interface to monitor the status of our pod:
-->
耐心等待一到两分钟，`dockerd` 下载镜像。我们可以用 `kubectl` 查看 pod 运行状态

```shell
$ kubectl get pods
NAME      READY     STATUS    RESTARTS   AGE
nginx     1/1       Running   0          14s
```

<!--
Verify that the pod task is running in the Mesos web GUI. Click on the
Kubernetes framework. The next screen should show the running Mesos task that
started the Kubernetes pod.
## Launching kube-dns

Kube-dns is an addon for Kubernetes which adds DNS-based service discovery to the cluster. For a detailed explanation see [DNS in Kubernetes][4].

The kube-dns addon runs as a pod inside the cluster. The pod consists of three co-located containers:

- a local etcd instance
- the [kube-dns][11] DNS server

We assume that kube-dns will use

- the service IP `10.10.10.10`
- and the `cluster.local` domain.

Note that we have passed these two values already as parameter to the apiserver above.

A template for a replication controller spinning up the pod with the 3 containers can be found at [cluster/addons/dns/kubedns-controller.yaml.in][12] in the repository. The following steps are necessary in order to get a valid replication controller yaml file:

{% assign dns_replicas = "{{ pillar['dns_replicas'] }}" %}
{% assign dns_domain = "{{ pillar['dns_domain'] }}" %}
- replace `{{ dns_replicas }}`  with `1`
- replace `{{ dns_domain }}` with `cluster.local.`
- add `--kube_master_url=${KUBERNETES_MASTER}` parameter to the kube2sky container command.

In addition the service template at [cluster/addons/dns/kubedns-controller.yaml.in][12] needs the following replacement:

{% assign dns_server = "{{ pillar['dns_server'] }}" %}
- `{{ dns_server }}` with `10.10.10.10`.

To do this automatically:
-->

通过浏览器访问 Mesos web GUI 检查 pod 运行状态. 点击 Kubernetes 框架. 接下来将会显示启动 Kubernetes pod 的 Mesos 任务.

## 启动 kube-dns 组件

Kube-dns 是一个 Kubernetes 组件，给集群增加了基于DNS的服务发现. 详情请见 [DNS in Kubernetes][4].

Kube-dns 组件作为一个pod运行在集群中，这个 pod 包含了三个同时运行的容器:

- 一个本地etcd实例
-  [kube-dns][11] DNS服务器

 kube-dns 的默认参数

- service IP `10.10.10.10`
- 和 `cluster.local` domain.

请注意我们已经把以上两个参数传入了上述 apiserver.

我们提供了一个 replication controller 模板，用来启动上述 pod ，可以通过这个链接进行下载 [cluster/addons/dns/kubedns-controller.yaml.in][12] . 接下来我们来创建可用的 replication controller yaml 文件:

{% assign dns_replicas = "{{ pillar['dns_replicas'] }}" %}
{% assign dns_domain = "{{ pillar['dns_domain'] }}" %}
- 将 `{{ dns_replicas }}`  替换为 `1`
- 将 `{{ dns_domain }}` 替换为 `cluster.local.`
- 向 kube2sky container command 添加 `--kube_master_url=${KUBERNETES_MASTER}` 参数.

另外， [cluster/addons/dns/kubedns-controller.yaml.in][12] 中的 service 模板需要做如下替换:

{% assign dns_server = "{{ pillar['dns_server'] }}" %}
- `{{ dns_server }}` with `10.10.10.10`.

以下是上述操作的自动脚本:

```shell{% raw %}
sed -e "s/{{ pillar\['dns_replicas'\] }}/1/g;"\
"s,\(command = \"/kube2sky\"\),\\1\\"$'\n'"        - --kube_master_url=${KUBERNETES_MASTER},;"\
"s/{{ pillar\['dns_domain'\] }}/cluster.local/g" \
  cluster/addons/dns/kubedns-controller.yaml.in > kubedns-controller.yaml
sed -e "s/{{ pillar\['dns_server'\] }}/10.10.10.10/g" \
  cluster/addons/dns/kubedns-svc.yaml.in > kubedns-svc.yaml{% endraw %}
```

<!--
Now the kube-dns pod and service are ready to be launched:
-->
现在 kube-dns 的 pod 和 service 已经准备完毕，下面是启动指令

```shell
kubectl create -f ./kubedns-controller.yaml
kubectl create -f ./kubedns-svc.yaml
```

<!--
Check with `kubectl get pods --namespace=kube-system` that 3/3 containers of the pods are eventually up and running. Note that the kube-dns pods run in the `kube-system` namespace, not in  `default`.

To check that the new DNS service in the cluster works, we start a busybox pod and use that to do a DNS lookup. First create the `busybox.yaml` pod spec:
-->
运行 `kubectl get pods --namespace=kube-system` 确认 3/3 也就是这个pod的所有容器都是 `running` 状态. 需要注意，kube-dns 的 pod 运行在 `kube-system` namespace, 而不是 `default` 下.

为了确认新的 DNS 服务正在运行，我们在集群中启动一个 busybox pod 进行 DNS 检索. 首先创建一个 `busybox.yaml` pod 定义文件:

```shell
cat <<EOF >busybox.yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
  - image: busybox
    command:
      - sleep
      - "3600"
    imagePullPolicy: IfNotPresent
    name: busybox
  restartPolicy: Always
EOF
```

<!--
Then start the pod:
-->
然后启动 pod:

```shell
kubectl create -f ./busybox.yaml
```

<!--
When the pod is up and running, start a lookup for the Kubernetes master service, made available on 10.10.10.1 by default:
-->
Pod 启动之后，通过以下命令尝试解析 Kubernetes master service，默认返回值应该为 10.10.10.1.

```shell
kubectl  exec busybox -- nslookup kubernetes
```

<!--
If everything works fine, you will get this output:
-->
如果一切正常，将会看到如下结果

```shell
Server:    10.10.10.10
Address 1: 10.10.10.10

Name:      kubernetes
Address 1: 10.10.10.1
```

<!--
## Support Level
-->
## 支持

<!--
IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Mesos/GCE            |              |        |             | [docs](/docs/getting-started-guides/mesos/)                                  |          | Community ([Kubernetes-Mesos Authors](https://github.com/mesosphere/kubernetes-mesos/blob/master/AUTHORS.md))
-->

IaaS层        | Config. Mgmt | OS     | Networking 网络  | Docs 文档                                        | Conforms | 支持
------------- | ------------ | ------ | --------------  | -------------------------------------------------| ---------| --------
Mesos/GCE     |              |        |                  | [docs](/docs/getting-started-guides/mesos/)     |          | Community ([Kubernetes-Mesos Authors](https://github.com/mesosphere/kubernetes-mesos/blob/master/AUTHORS.md))


<!--
For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions/) chart.
-->
查看解决方法，请参阅 [解决方法](/docs/getting-started-guides/#table-of-solutions/) 

<!--
## What next?

Try out some of the standard [Kubernetes examples][9].

Read about Kubernetes on Mesos' architecture in the [contrib directory][13].

**NOTE:** Some examples require Kubernetes DNS to be installed on the cluster.
Future work will add instructions to this guide to enable support for Kubernetes DNS.

**NOTE:** Please be aware that there are [known issues with the current Kubernetes-Mesos implementation][7]. 
-->
## 延伸阅读

试试标准例子 [Kubernetes examples][9].

看看 Kubernetes on Mesos 架构 [contrib directory][13].

**注意:** 有些例子需要在集群中预先安装 Kubernetes DNS .
以后会在本指南中加入 Kubernetes DNS 的激活方法.

**注意:** 以下是一些 [当前 Kubernetes-Mesos 实践中的已知问题][7].

[1]: https://docs.mesosphere.com/latest/usage/service-guides/hdfs/
[2]: https://docs.mesosphere.com/latest/usage/service-guides/spark/
[3]: https://mesos.github.io/chronos/docs/getting-started.html
[4]: https://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md
[5]: https://dcos.io/docs/latest/administration/installing/cloud/gce/
[6]: http://mesos.apache.org/
[7]: https://github.com/kubernetes-incubator/kube-mesos-framework/blob/master/docs/issues.md
[8]: https://github.com/mesosphere/kubernetes-mesos/issues
[9]: https://github.com/kubernetes/examples/tree/{{page.githubbranch}}/
[10]: http://open.mesosphere.com/getting-started/cloud/google/mesosphere/#vpn-setup
[11]: https://git.k8s.io/kubernetes/cluster/addons/dns/README.md#kube-dns
[12]: https://git.k8s.io/kubernetes/cluster/addons/dns/kubedns-controller.yaml.in
[13]: https://github.com/kubernetes-incubator/kube-mesos-framework/blob/master/README.md
