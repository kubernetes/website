---
title: "基于 Persistent Volumes 搭建 WordPress 和 MySQL 应用"
approvers:
- ahmetb
- jeffmendoza
---


本示例描述了如何在 Kubeernetes 上持久化安装 [WordPress](https://wordpress.org/) 和
[MySQL](https://www.mysql.com/) 。在这个安装里我们将使用官方的 [mysql](https://registry.hub.docker.com/_/mysql/) 和
[wordpress](https://registry.hub.docker.com/_/wordpress/) 镜像（WordPress 镜像包含一个 Apache 服务）。


展示的 Kubernetes 概念：

* [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) 定义持久化磁盘（磁盘生命周期不和 Pods 绑定）。
* [Services](https://kubernetes.io/docs/concepts/services-networking/service/) 使得 Pods 能够找到其它 Pods。
* [External Load Balancers](https://kubernetes.io/docs/concepts/services-networking/service/#type-loadbalancer) 对外暴露 Services。
* [Deployments](http://kubernetes.io/docs/user-guide/deployments/) 确保 Pods 持续运行。
* [Secrets](http://kubernetes.io/docs/user-guide/secrets/) 保存敏感密码信息。


## 快速入门


在一个名为 `password.txt` 的文件中放置你期望的 MySQL 密码，结尾不要有空行。如果你的编辑器添加了一个空行，开始的 `tr` 命令将会删除它。


**请注意：**如果你的集群强制启用 **_selinux_** 特性并且你将使用 [Host Path](#host-path) 作为存储，请遵照这个[额外步骤](#selinux)。

```shell
tr --delete '\n' <password.txt >.strippedpassword.txt && mv .strippedpassword.txt password.txt
kubectl create -f https://raw.githubusercontent.com/kubernetes/examples/master/mysql-wordpress-pd/local-volumes.yaml
kubectl create secret generic mysql-pass --from-file=password.txt
kubectl create -f https://raw.githubusercontent.com/kubernetes/examples/master/mysql-wordpress-pd/mysql-deployment.yaml
kubectl create -f https://raw.githubusercontent.com/kubernetes/examples/master/mysql-wordpress-pd/wordpress-deployment.yaml
```


## 目录




[在 Kubernetes 上持久化安装 MySQL 和 WordPress](#persistent-installation-of-mysql-and-wordpress-on-kubernetes)
  - [快速入门](#quickstart)
  - [目录](#table-of-contents)
  - [集群要求](#cluster-requirements)
  - [决定在哪里存储你的数据](#decide-where-you-will-store-your-data)
    - [Host Path](#host-path)
        - [SELinux](#selinux)
    - [GCE Persistent Disk](#gce-persistent-disk)
  - [创建 MySQL 密码 secret](#create-the-mysql-password-secret)
  - [部署 MySQL](#deploy-mysql)
  - [部署 WordPress](#deploy-wordpress)
  - [访问你的新 WordPress 博客](#visit-your-new-wordpress-blog)
  - [删除并重启你的博客](#take-down-and-restart-your-blog)
  - [接下来的步骤](#next-steps)




## 集群要求


Kubernetes本质是模块化的，可以在各种环境中运行。但并不是所有集群都相同。此处是本示例的一些要求：
* 需要 1.2 版本以上的 Kubernetes，以使用更新的特性，例如 PV Claims 和 Deployments。运行 `kubectl version` 来查看你的集群版本。
* [Cluster DNS](https://github.com/kubernetes/dns) 将被用于服务发现。
* 一个 [external load balancer](https://kubernetes.io/docs/concepts/services-networking/service/#type-loadbalancer) 将被用于接入 WordPress。
* 使用了 [Persistent Volume Claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)。你必须创建集群中需要的 Persistent Volumes。本示例将展示两种类型的 volume 的创建方法，但是任何类型的 volume 都是足够使用的。


查阅 [Getting Started Guide](http://kubernetes.io/docs/getting-started-guides/)，搭建一个集群并安装 [kubectl](http://kubernetes.io/docs/user-guide/prereqs/) 命令行工具。


## 决定在哪里存储你的数据


MySQL 和 WordPress 各自使用一个 [Persistent Volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) 来存储自己的数据。我们将使用一个 Persistent Volume Claim 来取得一个可用的持久化存储。本示例覆盖了 HostPath 和
GCEPersistentDisk 卷类型。你可以从两者中选择一个，或者查看 [Persistent Volumes的类型](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes)。


### Host Path


Host paths 是映射到主机上目录的卷。**这种类型应该只用于测试目的或者单节点集群**。如果 pod 在一个新的节点上重建，数据将不会在节点之间移动。如果 pod 被删除并在一个新的节点上重建，数据将会丢失。


##### SELinux


在支持 selinux 的系统上，保持它为 enabled/enforcing 是最佳选择。然而，docker 容器使用 "_svirt_sandbox_file_t_" 标签类型挂载 host path，这和默认的 /tmp ("_tmp_t_") 标签类型不兼容。在 mysql 容器试图对 _/var/lib/mysql_ 执行 `chown` 时将导致权限错误。
因此，要在一个启用 selinx 的系统上使用 host path，你应该预先创建 host path 路径（/tmp/data/）并将它的 selinux 标签类型改变为 "_svirt_sandbox_file_t_"，就像下面一样：

```shell
## on every node:
mkdir -p /tmp/data
chmod a+rwt /tmp/data  # match /tmp permissions
chcon -Rt svirt_sandbox_file_t /tmp/data
```


继续进行 host path 配置，在 Kubernetes 中使用 [local-volumes.yaml](https://git.k8s.io/examples/mysql-wordpress-pd/local-volumes.yaml) 创建 persistent volume 对象：

```shell
export KUBE_REPO=https://raw.githubusercontent.com/kubernetes/examples/master
kubectl create -f $KUBE_REPO/mysql-wordpress-pd/local-volumes.yaml
```



### GCE Persistent Disk


如果在 [Google Compute Engine](http://kubernetes.io/docs/getting-started-guides/gce/) 上运行集群，你可以使用这个存储选项。


创建两个永久磁盘。你需要在和 Kubernetes 集群相同的 [GCE zone](https://cloud.google.com/compute/docs/zones) 中创建这些磁盘。默认的安装脚本将在 `us-central1-b` zone 中创建集群，就像你在 [config-default.sh](https://git.k8s.io/kubernetes/cluster/gce/config-default.sh) 文件中看到的。替换下面的 `<zone>` 为合适的 zone。`wordpress-1` 和 `wordpress-2` 的名字必须和 [gce-volumes.yaml](https://git.k8s.io/examples/mysql-wordpress-pd/gce-volumes.yaml) 指定的 `pdName` 字段匹配。

```shell
gcloud compute disks create --size=20GB --zone=<zone> wordpress-1
gcloud compute disks create --size=20GB --zone=<zone> wordpress-2
```


在 Kubernetes 为这些磁盘创建 persistent volume 对象：

```shell
export KUBE_REPO=https://raw.githubusercontent.com/kubernetes/examples/master
kubectl create -f $KUBE_REPO/mysql-wordpress-pd/gce-volumes.yaml
```


## 创建 MySQL 密码 Secret


使用一个 [Secret](http://kubernetes.io/docs/user-guide/secrets/) 对象存储 MySQL 密码。首先，创建一个名为 `password.txt` 的文件(和 wordpress 示例文件在相同的文件夹)，并且将你的密码保存于其中。请确保密码文件的结尾没有空行。如果你的编辑器添加了一个，开始的 `tr` 命令将会删除这个空行。然后，创建这个 Secret 对象。

```shell
tr --delete '\n' <password.txt >.strippedpassword.txt && mv .strippedpassword.txt password.txt
kubectl create secret generic mysql-pass --from-file=password.txt
```


MySQL 和 WordPress pod 配置引用了这个 secret，所以这些 pods 就可以访问它。MySQL pod 会设置数据库密码，并且 WordPress 将使用这个密码来访问数据库。


## 部署 MySQL

<--
Now that the persistent disks and secrets are defined, the Kubernetes
pods can be launched. Start MySQL using
[mysql-deployment.yaml](https://git.k8s.io/examples/mysql-wordpress-pd/mysql-deployment.yaml).
-->
现在我们已经定义了永久磁盘和 secrets，可以启动 Kubernetes pods 了。使用 [mysql-deployment.yaml](https://git.k8s.io/examples/mysql-wordpress-pd/mysql-deployment.yaml) 启动 MySQL。

```shell
kubectl create -f $KUBE_REPO/mysql-wordpress-pd/mysql-deployment.yaml
```


查看 [mysql-deployment.yaml](https://git.k8s.io/examples/mysql-wordpress-pd/mysql-deployment.yaml)，注意到我们定义了一个挂载到 `/var/lib/mysql` 的卷，然后创建了一个请求 20G 卷的 Persistent Volume Claim。这个要求可以被任何符合这个要求的卷满足，在我们的例子中，可以是上面创建的卷中的一个。


再看一下 `env` 一节，我们引用上面创建的 `mysql-pass` secret 来指定密码。Secrets 可以有多组键值对。我们的只有一个键 `password.txt`，它是我们用来创建 secret 的文件名。[MySQL镜像](https://hub.docker.com/_/mysql/)  使用 `MYSQL_ROOT_PASSWORD` 环境变量设置数据库密码。


在很短的时间内，新建的 pod 将达到 `Running` 状态。列出所有的 pods，查看新建的 pod 的状态。

```shell
kubectl get pods
```

```
NAME                          READY     STATUS    RESTARTS   AGE
wordpress-mysql-cqcf4-9q8lo   1/1       Running   0          1m
```


Kubernetes 记录每个 pod 的 stderr 和 stdout。使用 `kubectl log` 查看一个 pod 的日志。从 `get pods` 复制 pod 名字，然后：

```shell
kubectl logs <pod-name>
```

```
...
2016-02-19 16:58:05 1 [Note] InnoDB: 128 rollback segment(s) are active.
2016-02-19 16:58:05 1 [Note] InnoDB: Waiting for purge to start
2016-02-19 16:58:05 1 [Note] InnoDB: 5.6.29 started; log sequence number 1626007
2016-02-19 16:58:05 1 [Note] Server hostname (bind-address): '*'; port: 3306
2016-02-19 16:58:05 1 [Note] IPv6 is available.
2016-02-19 16:58:05 1 [Note]   - '::' resolves to '::';
2016-02-19 16:58:05 1 [Note] Server socket created on IP: '::'.
2016-02-19 16:58:05 1 [Warning] 'proxies_priv' entry '@ root@wordpress-mysql-cqcf4-9q8lo' ignored in --skip-name-resolve mode.
2016-02-19 16:58:05 1 [Note] Event Scheduler: Loaded 0 events
2016-02-19 16:58:05 1 [Note] mysqld: ready for connections.
Version: '5.6.29'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server (GPL)
```


我们还需要在 [mysql-deployment.yaml](https://git.k8s.io/examples/mysql-wordpress-pd/mysql-deployment.yaml) 中创建一个 service 以允许其它 pods 访问这个 mysql 示例。`wordpress-mysql` 名称被解析为这个 pod 的 IP。


到此为止，我们创建了一个 Deployment，一个 Pod，一个 PVC，一个 Service，一个 Endpoint，两个 PV 和一个 Secret，显示如下：

```shell
kubectl get deployment,pod,svc,endpoints,pvc -l app=wordpress -o wide && \
  kubectl get secret mysql-pass && \
  kubectl get pv
```

```shell
NAME                     DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deploy/wordpress-mysql   1         1         1            1           3m
NAME                                  READY     STATUS    RESTARTS   AGE       IP           NODE
po/wordpress-mysql-3040864217-40soc   1/1       Running   0          3m        172.17.0.2   127.0.0.1
NAME                  CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE       SELECTOR
svc/wordpress-mysql   None         <none>        3306/TCP   3m        app=wordpress,tier=mysql
NAME                 ENDPOINTS         AGE
ep/wordpress-mysql   172.17.0.2:3306   3m
NAME                 STATUS    VOLUME       CAPACITY   ACCESSMODES   AGE
pvc/mysql-pv-claim   Bound     local-pv-2   20Gi       RWO           3m
NAME         TYPE      DATA      AGE
mysql-pass   Opaque    1         3m
NAME         CAPACITY   ACCESSMODES   STATUS      CLAIM                    REASON    AGE
local-pv-1   20Gi       RWO           Available                                      3m
local-pv-2   20Gi       RWO           Bound       default/mysql-pv-claim             3m
```


## 部署 WordPress


接下来使用 [wordpress-deployment.yaml](https://git.k8s.io/examples/mysql-wordpress-pd/wordpress-deployment.yaml) 部署 WordPress：

```shell
kubectl create -f $KUBE_REPO/mysql-wordpress-pd/wordpress-deployment.yaml
```


我们在这里使用了许多相同的特性，比如对 persistent storage 的 volume claim 和 password 的 secret。


[WordPress 镜像](https://hub.docker.com/_/wordpress/) 通过环境变量 `WORDPRESS_DB_HOST` 接收数据库的主机名。我们将这个环境变量值设置为我们创建的 MySQL
service 的名字：`wordpress-mysql`。


WordPress service 具有 `type: LoadBalancer` 的设置。这将 wordpress service 置于一个外部 IP 之下。


找到你的 WordPress service 的外部 IP 地址。**为这个 service 分配一个外部 IP 地址可能会耗时一分钟左右，这取决于你的集群环境。**

```shell
kubectl get services wordpress
```

```
NAME        CLUSTER-IP     EXTERNAL-IP     PORT(S)   AGE
wordpress   10.0.0.5       1.2.3.4         80/TCP    19h
```


## 访问你的新 WordPress 博客


现在，我们可以访问这个运行的 WordPress 应用。请使用你上面获取的 service 的外部 IP 地址。

```
http://<external-ip>
```


你应该可以看到熟悉的 WordPress 初始页面。

![WordPress init page](WordPress.png "WordPress init page")


> 警告：不要在这个页面上留下你的 WordPress 设置。如果被其他用户发现，他们可能在你的实例上创建一个网站并用它来为可能有害的内容提供服务。你应该继续创建用户名密码之后的安装过程，删除你的实例，或者建立一个防火墙来限制接入。


## 删除并重启你的博客


建立你的 WordPress 博客并简单使用一下。然后删除它的 pods 并再次启动它们。由于使用了永久磁盘，你的博客的状态将被保留。


所有的资源都被标记为 `app=wordpress`，你可以使用 label selector 轻松的删除它们：

```shell
kubectl delete deployment,service -l app=wordpress
kubectl delete secret mysql-pass
```


稍后使用原来的命令重建资源，这将会选择包含原来的完整数据的磁盘。由于我们没有删除 PV Claims，在删除我们的 pods 后，集群中没有任何一个 pod 能够 claim 它们。保留 PV Claims 也保证了重建 Pods 不会导致 PD 切换 Pods。


如果你已经准备好了释放你的永久磁盘及其上的数据，请运行：

```shell
kubectl delete pvc -l app=wordpress
```

And then delete the volume objects themselves:

```shell
kubectl delete pv local-pv-1 local-pv-2
```


或者

```shell
kubectl delete pv wordpress-pv-1 wordpress-pv-2
```


## 接下来的步骤

* [Introspection and Debugging](http://kubernetes.io/docs/user-guide/introspection-and-debugging/)
* [Jobs](http://kubernetes.io/docs/user-guide/jobs/) may be useful to run SQL queries.
* [Exec](http://kubernetes.io/docs/user-guide/getting-into-containers/)
* [Port Forwarding](http://kubernetes.io/docs/user-guide/connecting-to-applications-port-forward/)


[![Analytics](https://kubernetes-site.appspot.com/UA-36037335-10/GitHub/examples/mysql-wordpress-pd/README.md?pixel)]()

