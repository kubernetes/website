---
title: 运行一个单实例有状态应用
---

{% capture overview %}

本文介绍在Kubernetes中使用PersistentVolume和Deployment如何运行一个单实例有状态应用. 该应用是MySQL.

{% endcapture %}


{% capture objectives %}

* 在环境中通过磁盘创建一个PersistentVolume.
* 创建一个MySQL Deployment.
* 在集群内以一个已知的DNS名将MySQL暴露给其他pods.

{% endcapture %}


{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

* 为了数据持久性我们将在环境上通过磁盘创建一个持久卷. 环境支持的类型见这里[here](/docs/user-guide/persistent-volumes/#types-of-persistent-volumes). 本篇文档将介绍 `GCEPersistentDisk` . `GCEPersistentDisk`卷只能工作在Google Compute Engine
平台上.

{% endcapture %}


{% capture lessoncontent %}
<!--
## Set up a disk in your environment
-->
## 在环境中设置一个磁盘
<!--
You can use any type of persistent volume for your stateful app. See
[Types of Persistent Volumes](/docs/user-guide/persistent-volumes/#types-of-persistent-volumes)
for a list of supported environment disks. For Google Compute Engine, run:
-->

你可以为有状态的应用使用任何类型的持久卷. 有关支持环境的磁盘列表，请参考持久卷类型[Types of Persistent Volumes](/docs/user-guide/persistent-volumes/#types-of-persistent-volumes). 对于Google Compute Engine, 请运行:

```
gcloud compute disks create --size=20GB mysql-disk
```
<!--
Next create a PersistentVolume that points to the `mysql-disk`
disk just created. Here is a configuration file for a PersistentVolume
that points to the Compute Engine disk above:
-->

接下来创建一个指向刚创建的 `mysql-disk`磁盘的PersistentVolume. 下面是一个PersistentVolume的配置文件，它指向上面创建的Compute Engine磁盘:

{% include code.html language="yaml" file="gce-volume.yaml" ghlink="/docs/tasks/run-application/gce-volume.yaml" %}
<!--
Notice that the `pdName: mysql-disk` line matches the name of the disk
in the Compute Engine environment. See the
[Persistent Volumes](/docs/concepts/storage/persistent-volumes/)
for details on writing a PersistentVolume configuration file for other
environments.
-->

注意`pdName: mysql-disk` 这行与Compute Engine环境中的磁盘名称相匹配. 有关为其
他环境编写PersistentVolume配置文件的详细信息，请参见持久卷[Persistent Volumes](/docs/concepts/storage/persistent-volumes/).
<!--
Create the persistent volume:
-->

创建持久卷:

```
kubectl create -f https://k8s.io/docs/tasks/run-application/gce-volume.yaml
```


<!--
## Deploy MySQL
-->

## 部署MySQL
<!--
You can run a stateful application by creating a Kubernetes Deployment
and connecting it to an existing PersistentVolume using a
PersistentVolumeClaim.  For example, this YAML file describes a
Deployment that runs MySQL and references the PersistentVolumeClaim. The file
defines a volume mount for /var/lib/mysql, and then creates a
PersistentVolumeClaim that looks for a 20G volume. This claim is
satisfied by any volume that meets the requirements, in this case, the
volume created above.
-->

通过创建Kubernetes Deployment并使用PersistentVolumeClaim将其连接到现已存在的PersistentVolume上来运行一个有状态的应用.  例如, 下面这个YAML文件描述了一个运行MySQL
并引用PersistentVolumeClaim的Deployment. 该文件定义了一个volume其挂载目录为/var/lib/mysql, 然后创建一个内存为20G的卷的PersistentVolumeClaim. 此申领可以通过任
何符合需求的卷来满足, 在本例中满足上面创建的卷.

<!--
Note: The password is defined in the config yaml, and this is insecure. See
[Kubernetes Secrets](/docs/concepts/configuration/secret/)
for a secure solution.
-->

注意: 在配置的yaml文件中定义密码的做法是不安全的. 具体安全解决方案请参考
[Kubernetes Secrets](/docs/concepts/configuration/secret/).

{% include code.html language="yaml" file="mysql-deployment.yaml" ghlink="/docs/tasks/run-application/mysql-deployment.yaml" %}
<!--
1. Deploy the contents of the YAML file:
-->

1. 部署YAML文件中定义的内容:

       kubectl create -f https://k8s.io/docs/tasks/run-application/mysql-deployment.yaml

<!--
1. Display information about the Deployment:
-->

1. 展示Deployment相关信息:

       kubectl describe deployment mysql

        Name:                 mysql
        Namespace:            default
        CreationTimestamp:    Tue, 01 Nov 2016 11:18:45 -0700
        Labels:               app=mysql
        Annotations:          deployment.kubernetes.io/revision=1
        Selector:             app=mysql
        Replicas:             1 desired | 1 updated | 1 total | 0 available | 1 unavailable
        StrategyType:         Recreate
        MinReadySeconds:      0
        Pod Template:
          Labels:       app=mysql
          Containers:
           mysql:
            Image:      mysql:5.6
            Port:       3306/TCP
            Environment:
              MYSQL_ROOT_PASSWORD:      password
            Mounts:
              /var/lib/mysql from mysql-persistent-storage (rw)
          Volumes:
           mysql-persistent-storage:
            Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
            ClaimName:  mysql-pv-claim
            ReadOnly:   false
        Conditions:
          Type          Status  Reason
          ----          ------  ------
          Available     False   MinimumReplicasUnavailable
          Progressing   True    ReplicaSetUpdated
        OldReplicaSets:       <none>
        NewReplicaSet:        mysql-63082529 (1/1 replicas created)
        Events:
          FirstSeen    LastSeen    Count    From                SubobjectPath    Type        Reason            Message
          ---------    --------    -----    ----                -------------    --------    ------            -------
          33s          33s         1        {deployment-controller }             Normal      ScalingReplicaSet Scaled up replica set mysql-63082529 to 1

<!--
1. List the pods created by the Deployment:
-->

1. 列举出Deployment创建的pods:

       kubectl get pods -l app=mysql

        NAME                   READY     STATUS    RESTARTS   AGE
        mysql-63082529-2z3ki   1/1       Running   0          3m
<!--
1. Inspect the Persistent Volume:
-->

1. 查看持久卷:

       kubectl describe pv mysql-pv

        Name:            mysql-pv
        Labels:          <none>
        Status:          Bound
        Claim:           default/mysql-pv-claim
        Reclaim Policy:  Retain
        Access Modes:    RWO
        Capacity:        20Gi
        Message:
        Source:
            Type:        GCEPersistentDisk (a Persistent Disk resource in Google Compute Engine)
            PDName:      mysql-disk
            FSType:      ext4
            Partition:   0
            ReadOnly:    false
        No events.

<!--
1. Inspect the PersistentVolumeClaim:
-->

1. 查看PersistentVolumeClaim:

       kubectl describe pvc mysql-pv-claim

        Name:         mysql-pv-claim
        Namespace:    default
        Status:       Bound
        Volume:       mysql-pv
        Labels:       <none>
        Capacity:     20Gi
        Access Modes: RWO
        No events.

<!--
## Accessing the MySQL instance
-->

## 访问MySQL实例

<!--
The preceding YAML file creates a service that
allows other Pods in the cluster to access the database. The Service option
`clusterIP: None` lets the Service DNS name resolve directly to the
Pod's IP address. This is optimal when you have only one Pod
behind a Service and you don't intend to increase the number of Pods.
-->

前面YAML文件中创建了一个允许集群内其他pods访问数据库的服务. 该服务中选项
`clusterIP: None` 让服务DNS名称直接解析为Pod的IP地址. 当在一个服务下只有一个pod
并且不打算增加pods的数量这是最好的.

<!--
Run a MySQL client to connect to the server:
-->

运行MySQL客户端以连接到服务器:

```
kubectl run -it --rm --image=mysql:5.6 mysql-client -- mysql -h <pod-ip> -p <password>
```
<!--
This command creates a new Pod in the cluster running a MySQL client
and connects it to the server through the Service. If it connects, you
know your stateful MySQL database is up and running.
-->

此命令在集群内创建一个新的Pod并运行MySQL客户端,并通过服务将其连接到服务器.如果连接成功,你就知道有状态的MySQL database正处于运行状态.

```
Waiting for pod default/mysql-client-274442439-zyp6i to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

mysql>
```
<!--
## Updating
-->

## 更新

<!--
The image or any other part of the Deployment can be updated as usual
with the `kubectl apply` command. Here are some precautions that are
specific to stateful apps:

* Don't scale the app. This setup is for single-instance apps
  only. The underlying PersistentVolume can only be mounted to one
  Pod. For clustered stateful apps, see the
  [StatefulSet documentation](/docs/concepts/workloads/controllers/petset/).
* Use `strategy:` `type: Recreate` in the Deployment configuration
  YAML file. This instructs Kubernetes to _not_ use rolling
  updates. Rolling updates will not work, as you cannot have more than
  one Pod running at a time. The `Recreate` strategy will stop the
  first pod before creating a new one with the updated configuration.
-->

Deployment中镜像或其他部分同往常一样可以通过 `kubectl apply` 命令更新. 以下是
特定于有状态应用的一些注意事项:

* 不要弹性伸缩. 弹性伸缩仅适用于单实例应用. 下层的PersistentVolume仅只能挂载一个pod. 对于集群级有状态应用, 请参考StatefulSet文档
  [StatefulSet documentation](/docs/concepts/workloads/controllers/petset/).
* 在Deployment的YAML文件中使用 `strategy:` `type: Recreate` . 该选项指示Kubernetes不使用滚动升级. 滚动升级将无法工作, 由于一次不能运行多个pod. 在更新配置文件
创建一个新的pod前 `Recreate`策略将先停止第一个pod.

<!--
## Deleting a deployment
-->

## 删除deployment

<!--
Delete the deployed objects by name:
-->

通过名称删除部署的对象:

```
kubectl delete deployment,svc mysql
kubectl delete pvc mysql-pv-claim
kubectl delete pv mysql-pv
```
<!--
Also, if you are using Compute Engine disks:
-->

如果使用Compute Engine磁盘，也可以使用如下命令:

```
gcloud compute disks delete mysql-disk
```

{% endcapture %}


{% capture whatsnext %}

* 了解更多Deployment对象请参考 [Deployment objects](/docs/concepts/workloads/controllers/deployment/).

* 了解更多Deployment应用请参考 [Deploying applications](/docs/user-guide/deploying-applications/)

* kubectl run文档请参考[kubectl run documentation](/docs/user-guide/kubectl/v1.6/#run)

* 卷和持久卷请参考[Volumes](/docs/concepts/storage/volumes/) and [Persistent Volumes](/docs/concepts/storage/persistent-volumes/)

{% endcapture %}

{% include templates/tutorial.md %}
