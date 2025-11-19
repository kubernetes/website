---
title: 運行一個單實例有狀態應用
content_type: tutorial
weight: 20
---

<!-- overview -->

<!--
This page shows you how to run a single-instance stateful application
in Kubernetes using a PersistentVolume and a Deployment. The
application is MySQL.
-->
本文介紹在 Kubernetes 中如何使用 PersistentVolume 和 Deployment 運行一個單實例有狀態應用。
該示例應用是 MySQL。

## {{% heading "objectives" %}}

<!--
* Create a PersistentVolume referencing a disk in your environment.
* Create a MySQL Deployment.
* Expose MySQL to other pods in the cluster at a known DNS name.
-->
* 在你的環境中創建一個引用磁盤的 PersistentVolume。
* 創建一個 MySQL Deployment。
* 在集羣內以一個已知的 DNS 名稱將 MySQL 暴露給其他 Pod。

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
你可以通過創建一個 Kubernetes Deployment 並使用 PersistentVolumeClaim 將其連接到
某已有的 PersistentVolume 來運行一個有狀態的應用。
例如，這裏的 YAML 描述的是一個運行 MySQL 的 Deployment，其中引用了 PersistentVolumeClaim。
文件爲 /var/lib/mysql 定義了卷掛載，並創建了一個 PersistentVolumeClaim，尋找一個 20G 大小的卷。
該申領可以通過現有的滿足需求的捲來滿足，也可以通過動態供應卷的機制來滿足。

<!--
Note: The password is defined in the config yaml, and this is insecure. See
[Kubernetes Secrets](/docs/concepts/configuration/secret/)
for a secure solution.
-->
注意：在配置的 YAML 文件中定義密碼的做法是不安全的。具體安全解決方案請參考
[Kubernetes Secrets](/zh-cn/docs/concepts/configuration/secret/)。

{{% code_sample file="application/mysql/mysql-deployment.yaml" %}}
{{% code_sample file="application/mysql/mysql-pv.yaml" %}}

<!--
1. Deploy the PV and PVC of the YAML file:
-->
1. 部署 YAML 文件中定義的 PV 和 PVC：

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mysql/mysql-pv.yaml
   ```

<!--
1. Deploy the contents of the YAML file:
-->
2. 部署 YAML 文件中定義的 Deployment：

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mysql/mysql-deployment.yaml
   ```

<!--
1. Display information about the Deployment:
-->
3. 展示 Deployment 相關信息：

   ```shell
   kubectl describe deployment mysql
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似於：

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
       Image:      mysql:9
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
4. 列舉出 Deployment 創建的 Pod：

   ```shell
   kubectl get pods -l app=mysql
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似於：

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
   輸出類似於：

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
## 訪問 MySQL 實例   {#accessing-the-mysql-instance}

前面 YAML 文件中創建了一個允許集羣內其他 Pod 訪問的數據庫 Service。該 Service 中選項
`clusterIP: None` 讓 Service 的 DNS 名稱直接解析爲 Pod 的 IP 地址。
當在一個 Service 下只有一個 Pod 並且不打算增加 Pod 的數量這是最好的。

運行 MySQL 客戶端以連接到服務器：

```shell
kubectl run -it --rm --image=mysql:9 --restart=Never mysql-client -- mysql -h mysql -ppassword
```

<!--
This command creates a new Pod in the cluster running a MySQL client
and connects it to the server through the Service. If it connects, you
know your stateful MySQL database is up and running.
-->
此命令在集羣內創建一個新的 Pod 並運行 MySQL 客戶端，並通過 Service 連接到服務器。
如果連接成功，你就知道有狀態的 MySQL 數據庫正處於運行狀態。

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

Deployment 中鏡像或其他部分同往常一樣可以通過 `kubectl apply` 命令更新。
以下是特定於有狀態應用的一些注意事項：

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
* 不要對應用進行規模擴縮。這裏的設置僅適用於單實例應用。下層的 PersistentVolume
  僅只能掛載到一個 Pod 上。對於集羣級有狀態應用，請參考
  [StatefulSet 文檔](/zh-cn/docs/concepts/workloads/controllers/statefulset/)。
* 在 Deployment 的 YAML 文件中使用 `strategy:` `type: Recreate`。
  該選項指示 Kubernetes **不**使用滾動升級。滾動升級無法工作，因爲這裏一次不能運行多個
  Pod。在使用更新的配置文件創建新的 Pod 前，`Recreate` 策略將保證先停止第一個 Pod。

<!--
## Deleting a deployment

Delete the deployed objects by name:
-->
## 刪除 Deployment    {#deleting-a-deployment}

通過名稱刪除部署的對象：

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
如果通過手動的方式供應 PersistentVolume，那麼也需要手動刪除它以釋放下層資源。
如果是用動態供應方式創建的 PersistentVolume，在刪除 PersistentVolumeClaim 後
PersistentVolume 將被自動刪除。
一些存儲服務（比如 EBS 和 PD）也會在 PersistentVolume 被刪除時自動回收下層資源。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).

* Learn more about [Deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/)

* [kubectl run documentation](/docs/reference/generated/kubectl/kubectl-commands/#run)

* [Volumes](/docs/concepts/storage/volumes/) and [Persistent Volumes](/docs/concepts/storage/persistent-volumes/)
-->
* 欲進一步瞭解 Deployment 對象，請參考 [Deployment 對象](/zh-cn/docs/concepts/workloads/controllers/deployment/)

* 進一步瞭解[部署應用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)

* 參閱 [kubectl run 文檔](/docs/reference/generated/kubectl/kubectl-commands/#run)

* 參閱[卷](/zh-cn/docs/concepts/storage/volumes/)和[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)
