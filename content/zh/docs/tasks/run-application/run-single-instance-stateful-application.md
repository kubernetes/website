---
title: 运行一个单实例有状态应用
content_template: templates/tutorial
---

{{% capture overview %}}

本文介绍在 Kubernetes 中使用 PersistentVolume 和 Deployment 如何运行一个单实例有状态应用. 该应用是 MySQL.

{{% /capture %}}


{{% capture objectives %}}

* 在环境中通过磁盘创建一个PersistentVolume.
* 创建一个MySQL Deployment.
* 在集群内以一个已知的 DNS 名将 MySQL 暴露给其他 pods.

{{% /capture %}}


{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* {{< include "default-storage-class-prereqs.md" >}}

{{% /capture %}}

{{% capture lessoncontent %}}

## 部署MySQL

注意: 在配置的 yaml 文件中定义密码的做法是不安全的. 具体安全解决方案请参考
[Kubernetes Secrets](/docs/concepts/configuration/secret/).

{{< codenew file="application/mysql/mysql-deployment.yaml" >}}
{{< codenew file="application/mysql/mysql-pv.yaml" >}}

1. 部署 YAML 文件中定义的 PV 和 PVC：

        kubectl apply -f https://k8s.io/examples/application/mysql/mysql-pv.yaml

1. 部署 YAML 文件中定义的 Deployment：

        kubectl apply -f https://k8s.io/examples/application/mysql/mysql-deployment.yaml

1. 展示 Deployment 相关信息:

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


1. 列举出 Deployment 创建的 pods:

        kubectl get pods -l app=mysql

        NAME                   READY     STATUS    RESTARTS   AGE
        mysql-63082529-2z3ki   1/1       Running   0          3m

1. 查看 PersistentVolumeClaim:

        kubectl describe pvc mysql-pv-claim

        Name:         mysql-pv-claim
        Namespace:    default
        StorageClass:
        Status:       Bound
        Volume:       mysql-pv-volume
        Labels:       <none>
        Annotations:    pv.kubernetes.io/bind-completed=yes
                        pv.kubernetes.io/bound-by-controller=yes
        Capacity:     20Gi
        Access Modes: RWO
        Events:       <none>

## 访问 MySQL 实例


前面 YAML 文件中创建了一个允许集群内其他 pods 访问数据库的服务. 该服务中选项
`clusterIP: None` 让服务 DNS 名称直接解析为 Pod 的 IP 地址. 当在一个服务下只有一个 pod
并且不打算增加 pods 的数量这是最好的.


运行 MySQL 客户端以连接到服务器:

```
kubectl run -it --rm --image=mysql:5.6 --restart=Never mysql-client -- mysql -h mysql -ppassword
```

此命令在集群内创建一个新的 Pod 并运行 MySQL 客户端,并通过 Service 将其连接到服务器.如果连接成功,你就知道有状态的 MySQL 数据库正处于运行状态.

```
Waiting for pod default/mysql-client-274442439-zyp6i to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

mysql>
```

## 更新


Deployment 中镜像或其他部分同往常一样可以通过 `kubectl apply` 命令更新. 以下是
特定于有状态应用的一些注意事项:

* 不要弹性伸缩. 弹性伸缩仅适用于单实例应用. 下层的 PersistentVolume 仅只能挂载一个 pod. 对于集群级有状态应用, 请参考 StatefulSet 文档
  [StatefulSet documentation](/docs/concepts/workloads/controllers/statefulset/).
* 在 Deployment 的 YAML 文件中使用 `strategy:` `type: Recreate` . 该选项指示 Kubernetes 不使用滚动升级. 滚动升级将无法工作, 由于一次不能运行多个 pod. 在更新配置文件
创建一个新的 pod 前 `Recreate` 策略将先停止第一个 pod.


## 删除 Deployment


通过名称删除部署的对象:

```
kubectl delete deployment,svc mysql
kubectl delete pvc mysql-pv-claim
kubectl delete pv mysql-pv-volume
```

如果通过手动的方式分配 PersistentVolume, 那么也需要手动的删除它，以及释放下层资源.
如果是用过动态分配 PersistentVolume 的方式，在删除 PersistentVolumeClaim 后 PersistentVolume 将被自动的删除. 一些存储服务(比如 EBS 和 PD)也会在 PersistentVolume 被删除时自动回收下层资源.

{{% /capture %}}


{{% capture whatsnext %}}

* 了解更多 Deployment 对象请参考 [Deployment objects](/docs/concepts/workloads/controllers/deployment/).

* 了解更多 Deployment 应用请参考 [Deploying applications](/docs/user-guide/deploying-applications/)

* kubectl run 文档请参考[kubectl run documentation](/docs/reference/generated/kubectl/kubectl-commands/#run)

* 卷和持久卷请参考 [Volumes](/docs/concepts/storage/volumes/) 和 [Persistent Volumes](/docs/concepts/storage/persistent-volumes/)

{{% /capture %}}


