---
title: 运行一个单实例有状态应用
content_type: tutorial
weight: 20
---

<!-- overview -->

<!--
This page shows you how to run a single-instance stateful application
in Kubernetes using a PersistentVolume and a Deployment. The
application is MySQL.
-->
本文介绍在 Kubernetes 中如何使用 PersistentVolume 和 Deployment 运行一个单实例有状态应用。
该示例应用是 MySQL。

## {{% heading "objectives" %}}

<!--
* Create a PersistentVolume referencing a disk in your environment.
* Create a MySQL Deployment.
* Expose MySQL to other pods in the cluster at a known DNS name.
-->
* 在你的环境中创建一个引用磁盘的 PersistentVolume。
* 创建一个 MySQL Deployment。
* 在集群内以一个已知的 DNS 名称将 MySQL 暴露给其他 Pod。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* {{< include "default-storage-class-prereqs.md" >}}

<!-- lessoncontent -->

## 部署 MySQL   {#deploy-mysql}

<!--
You can run a stateful application by creating a Kubernetes Deployment
and connecting it to an existing PersistentVolume using a
PersistentVolumeClaim. For example, this YAML file describes a
Deployment that runs MySQL and references the PersistentVolumeClaim. The file
defines a volume mount for /var/lib/mysql, and then creates a
PersistentVolumeClaim that looks for a 20G volume. This claim is
satisfied by any existing volume that meets the requirements,
or by a dynamic provisioner.
-->
你可以通过创建一个 Kubernetes Deployment 并使用 PersistentVolumeClaim 将其连接到
某已有的 PersistentVolume 来运行一个有状态的应用。
例如，这里的 YAML 描述的是一个运行 MySQL 的 Deployment，其中引用了 PersistentVolumeClaim。
文件为 /var/lib/mysql 定义了卷挂载，并创建了一个 PersistentVolumeClaim，寻找一个 20G 大小的卷。
该申领可以通过现有的满足需求的卷来满足，也可以通过动态供应卷的机制来满足。

<!--
Note: The password is defined in the config yaml, and this is insecure. See
[Kubernetes Secrets](/docs/concepts/configuration/secret/)
for a secure solution.
-->
注意：在配置的 YAML 文件中定义密码的做法是不安全的。具体安全解决方案请参考
[Kubernetes Secrets](/zh-cn/docs/concepts/configuration/secret/)。

{{% code_sample file="application/mysql/mysql-deployment.yaml" %}}
{{% code_sample file="application/mysql/mysql-pv.yaml" %}}

<!--
1. Deploy the PV and PVC of the YAML file:
-->
1. 部署 YAML 文件中定义的 PV 和 PVC：

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mysql/mysql-pv.yaml
   ```

<!--
1. Deploy the contents of the YAML file:
-->
2. 部署 YAML 文件中定义的 Deployment：

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mysql/mysql-deployment.yaml
   ```

<!--
1. Display information about the Deployment:
-->
3. 展示 Deployment 相关信息：

   ```shell
   kubectl describe deployment mysql
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

   ```
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
   ```

<!--
1. List the pods created by the Deployment:
-->
4. 列举出 Deployment 创建的 Pod：

   ```shell
   kubectl get pods -l app=mysql
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

   ```
   NAME                   READY     STATUS    RESTARTS   AGE
   mysql-63082529-2z3ki   1/1       Running   0          3m
   ```

<!--
1. Inspect the PersistentVolumeClaim:
-->
5. 查看 PersistentVolumeClaim：

   ```shell
   kubectl describe pvc mysql-pv-claim
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

   ```
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
   ```

<!--
## Accessing the MySQL instance

The preceding YAML file creates a service that
allows other Pods in the cluster to access the database. The Service option
`clusterIP: None` lets the Service DNS name resolve directly to the
Pod's IP address. This is optimal when you have only one Pod
behind a Service and you don't intend to increase the number of Pods.

Run a MySQL client to connect to the server:
-->
## 访问 MySQL 实例   {#accessing-the-mysql-instance}

前面 YAML 文件中创建了一个允许集群内其他 Pod 访问的数据库 Service。该 Service 中选项
`clusterIP: None` 让 Service 的 DNS 名称直接解析为 Pod 的 IP 地址。
当在一个 Service 下只有一个 Pod 并且不打算增加 Pod 的数量这是最好的。

运行 MySQL 客户端以连接到服务器：

```shell
kubectl run -it --rm --image=mysql:5.6 --restart=Never mysql-client -- mysql -h mysql -ppassword
```

<!--
This command creates a new Pod in the cluster running a MySQL client
and connects it to the server through the Service. If it connects, you
know your stateful MySQL database is up and running.
-->
此命令在集群内创建一个新的 Pod 并运行 MySQL 客户端，并通过 Service 连接到服务器。
如果连接成功，你就知道有状态的 MySQL 数据库正处于运行状态。

```
Waiting for pod default/mysql-client-274442439-zyp6i to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

mysql>
```

<!--
## Updating

The image or any other part of the Deployment can be updated as usual
with the `kubectl apply` command. Here are some precautions that are
specific to stateful apps:
-->
## 更新   {#updating}

Deployment 中镜像或其他部分同往常一样可以通过 `kubectl apply` 命令更新。
以下是特定于有状态应用的一些注意事项：

<!--
* Don't scale the app. This setup is for single-instance apps
  only. The underlying PersistentVolume can only be mounted to one
  Pod. For clustered stateful apps, see the
  [StatefulSet documentation](/docs/concepts/workloads/controllers/statefulset/).
* Use `strategy:` `type: Recreate` in the Deployment configuration
  YAML file. This instructs Kubernetes to _not_ use rolling
  updates. Rolling updates will not work, as you cannot have more than
  one Pod running at a time. The `Recreate` strategy will stop the
  first pod before creating a new one with the updated configuration.
-->
* 不要对应用进行规模扩缩。这里的设置仅适用于单实例应用。下层的 PersistentVolume
  仅只能挂载到一个 Pod 上。对于集群级有状态应用，请参考
  [StatefulSet 文档](/zh-cn/docs/concepts/workloads/controllers/statefulset/)。
* 在 Deployment 的 YAML 文件中使用 `strategy:` `type: Recreate`。
  该选项指示 Kubernetes **不**使用滚动升级。滚动升级无法工作，因为这里一次不能运行多个
  Pod。在使用更新的配置文件创建新的 Pod 前，`Recreate` 策略将保证先停止第一个 Pod。

<!--
## Deleting a deployment

Delete the deployed objects by name:
-->
## 删除 Deployment    {#deleting-a-deployment}

通过名称删除部署的对象：

```shell
kubectl delete deployment,svc mysql
kubectl delete pvc mysql-pv-claim
kubectl delete pv mysql-pv-volume
```

<!--
If you manually provisioned a PersistentVolume, you also need to manually
delete it, as well as release the underlying resource.
If you used a dynamic provisioner, it automatically deletes the
PersistentVolume when it sees that you deleted the PersistentVolumeClaim.
Some dynamic provisioners (such as those for EBS and PD) also release the
underlying resource upon deleting the PersistentVolume.
-->
如果通过手动的方式供应 PersistentVolume，那么也需要手动删除它以释放下层资源。
如果是用动态供应方式创建的 PersistentVolume，在删除 PersistentVolumeClaim 后
PersistentVolume 将被自动删除。
一些存储服务（比如 EBS 和 PD）也会在 PersistentVolume 被删除时自动回收下层资源。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).

* Learn more about [Deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/)

* [kubectl run documentation](/docs/reference/generated/kubectl/kubectl-commands/#run)

* [Volumes](/docs/concepts/storage/volumes/) and [Persistent Volumes](/docs/concepts/storage/persistent-volumes/)
-->
* 欲进一步了解 Deployment 对象，请参考 [Deployment 对象](/zh-cn/docs/concepts/workloads/controllers/deployment/)

* 进一步了解[部署应用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)

* 参阅 [kubectl run 文档](/docs/reference/generated/kubectl/kubectl-commands/#run)

* 参阅[卷](/zh-cn/docs/concepts/storage/volumes/)和[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)
