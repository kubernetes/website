---
title: 配置多個調度器
content_type: task
weight: 20
---
<!--
reviewers:
- davidopp
- madhusudancs
title: Configure Multiple Schedulers
content_type: task
weight: 20
-->

<!-- overview -->

<!--
Kubernetes ships with a default scheduler that is described
[here](/docs/reference/command-line-tools-reference/kube-scheduler/).
If the default scheduler does not suit your needs you can implement your own scheduler.
Moreover, you can even run multiple schedulers simultaneously alongside the default
scheduler and instruct Kubernetes what scheduler to use for each of your pods. Let's
learn how to run multiple schedulers in Kubernetes with an example.
-->
Kubernetes 自帶了一個默認調度器，其詳細描述請查閱
[這裏](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/)。
如果默認調度器不適合你的需求，你可以實現自己的調度器。
而且，你甚至可以和默認調度器一起同時運行多個調度器，並告訴 Kubernetes 爲每個
Pod 使用哪個調度器。
讓我們通過一個例子講述如何在 Kubernetes 中運行多個調度器。

<!--
A detailed description of how to implement a scheduler is outside the scope of this
document. Please refer to the kube-scheduler implementation in
[pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler)
in the Kubernetes source directory for a canonical example.
-->
關於實現調度器的具體細節描述超出了本文範圍。
請參考 kube-scheduler 的實現，規範示例代碼位於
[pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Package the scheduler

Package your scheduler binary into a container image. For the purposes of this example,
you can use the default scheduler (kube-scheduler) as your second scheduler.
Clone the [Kubernetes source code from GitHub](https://github.com/kubernetes/kubernetes)
and build the source.
-->
## 打包調度器

將調度器可執行文件打包到容器鏡像中。出於示例目的，可以使用默認調度器
（kube-scheduler）作爲第二個調度器。
克隆 [GitHub 上 Kubernetes 源代碼](https://github.com/kubernetes/kubernetes)，
並編譯構建源代碼。

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make
```

<!--
Create a container image containing the kube-scheduler binary. Here is the `Dockerfile`
to build the image:
-->
創建一個包含 kube-scheduler 二進制文件的容器鏡像。用於構建鏡像的 `Dockerfile` 內容如下：

```docker
FROM busybox
ADD ./_output/local/bin/linux/amd64/kube-scheduler /usr/local/bin/kube-scheduler
```

<!--
Save the file as `Dockerfile`, build the image and push it to a registry. This example
pushes the image to
[Google Container Registry (GCR)](https://cloud.google.com/container-registry/).
For more details, please read the GCR
[documentation](https://cloud.google.com/container-registry/docs/). Alternatively
you can also use the [docker hub](https://hub.docker.com/search?q=). For more details
refer to the docker hub [documentation](https://docs.docker.com/docker-hub/repos/create/#create-a-repository).
-->
將文件保存爲 `Dockerfile`，構建鏡像並將其推送到鏡像倉庫。
此示例將鏡像推送到 [Google 容器鏡像倉庫（GCR）](https://cloud.google.com/container-registry/)。
有關詳細信息，請閱讀 GCR [文檔](https://cloud.google.com/container-registry/docs/)。
或者，你也可以使用 [Docker Hub](https://hub.docker.com/search?q=)。
有關更多詳細信息，請參閱 Docker Hub
[文檔](https://docs.docker.com/docker-hub/repos/create/#create-a-repository)。

<!--
# The image name and the repository
# used in here is just an example
-->
```shell
# 這裏使用的鏡像名稱和倉庫只是一個例子
docker build -t gcr.io/my-gcp-project/my-kube-scheduler:1.0 .
gcloud docker -- push gcr.io/my-gcp-project/my-kube-scheduler:1.0
```

<!--
## Define a Kubernetes Deployment for the scheduler

Now that you have your scheduler in a container image, create a pod
configuration for it and run it in your Kubernetes cluster. But instead of creating a pod
directly in the cluster, you can use a [Deployment](/docs/concepts/workloads/controllers/deployment/)
for this example. A [Deployment](/docs/concepts/workloads/controllers/deployment/) manages a
[Replica Set](/docs/concepts/workloads/controllers/replicaset/) which in turn manages the pods,
thereby making the scheduler resilient to failures. Here is the deployment
config. Save it as `my-scheduler.yaml`:
-->
## 爲調度器定義 Kubernetes Deployment

現在將調度器放在容器鏡像中，爲它創建一個 Pod 配置，並在 Kubernetes 集羣中
運行它。但是與其在集羣中直接創建一個 Pod，不如使用
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)。
Deployment 管理一個 [ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/)，
ReplicaSet 再管理 Pod，從而使調度器能夠免受一些故障的影響。
以下是 Deployment 配置，將其保存爲 `my-scheduler.yaml`：

{{% code_sample file="admin/sched/my-scheduler.yaml" %}}

<!--
In the above manifest, you use a [KubeSchedulerConfiguration](/docs/reference/scheduling/config/)
to customize the behavior of your scheduler implementation. This configuration has been passed to
the `kube-scheduler` during initialization with the `--config` option. The `my-scheduler-config` ConfigMap stores the configuration file. The Pod of the`my-scheduler` Deployment mounts the `my-scheduler-config` ConfigMap as a volume.
-->
在以上的清單中，你使用 [KubeSchedulerConfiguration](/zh-cn/docs/reference/scheduling/config/) 
來自定義調度器實現的行爲。當使用 `--config` 選項進行初始化時，該配置被傳遞到 `kube-scheduler`。
`my-scheduler-config` ConfigMap 存儲配置數據。
`my-scheduler` Deployment 的 Pod 將 `my-scheduler-config` ConfigMap 掛載爲一個卷。

<!--
In the aforementioned Scheduler Configuration, your scheduler implementation is represented via
a [KubeSchedulerProfile](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile).
-->
在前面提到的調度器配置中，你的調度器呈現爲一個
[KubeSchedulerProfile](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile)。
{{< note >}}
<!--
To determine if a scheduler is responsible for scheduling a specific Pod, the `spec.schedulerName` field in a
PodTemplate or Pod manifest must match the `schedulerName` field of the `KubeSchedulerProfile`.
All schedulers running in the cluster must have unique names.
-->
要確定一個調度器是否可以調度特定的 Pod，PodTemplate 或 Pod 清單中的 `spec.schedulerName` 
字段必須匹配 `KubeSchedulerProfile` 中的 `schedulerName` 字段。
運行在集羣中的所有調度器必須擁有唯一的名稱。
{{< /note >}}

<!--
Also, note that you create a dedicated service account `my-scheduler` and bind the ClusterRole
`system:kube-scheduler` to it so that it can acquire the same privileges as `kube-scheduler`.
-->
還要注意，我們創建了一個專用的服務賬號 `my-scheduler` 並將集羣角色 `system:kube-scheduler`
綁定到它，以便它可以獲得與 `kube-scheduler` 相同的權限。

<!--
Please see the
[kube-scheduler documentation](/docs/reference/command-line-tools-reference/kube-scheduler/) for
detailed description of other command line arguments and
[Scheduler Configuration reference](/docs/reference/config-api/kube-scheduler-config.v1/) for
detailed description of other customizable `kube-scheduler` configurations.
-->
請參閱 [kube-scheduler 文檔](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/)
獲取其他命令行參數以及 [Scheduler 配置參考](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/)
獲取自定義 `kube-scheduler` 配置的詳細說明。

<!--
## Run the second scheduler in the cluster

In order to run your scheduler in a Kubernetes cluster, create the deployment
specified in the config above in a Kubernetes cluster:
-->
## 在集羣中運行第二個調度器

爲了在 Kubernetes 集羣中運行我們的第二個調度器，在 Kubernetes 集羣中創建上面配置中指定的 Deployment：

```shell
kubectl create -f my-scheduler.yaml
```

<!--
Verify that the scheduler pod is running:
-->
驗證調度器 Pod 正在運行：

```shell
kubectl get pods --namespace=kube-system
```

輸出類似於：

```
NAME                                           READY     STATUS    RESTARTS   AGE
....
my-scheduler-lnf4s-4744f                       1/1       Running   0          2m
...
```

<!--
You should see a "Running" my-scheduler pod, in addition to the default kube-scheduler
pod in this list.
-->
此列表中，除了默認的 `kube-scheduler` Pod 之外，你應該還能看到處於 “Running” 狀態的
`my-scheduler` Pod。


<!--
### Enable leader election

To run multiple-scheduler with leader election enabled, you must do the following:

Update the following fields for the KubeSchedulerConfiguration in the `my-scheduler-config` ConfigMap in your YAML file:
-->
### 啓用領導者選舉

要在啓用了 leader 選舉的情況下運行多調度器，你必須執行以下操作：

更新你的 YAML 文件中的 `my-scheduler-config` ConfigMap 裏的 KubeSchedulerConfiguration 相關字段如下：

* `leaderElection.leaderElect` to `true`
* `leaderElection.resourceNamespace` to `<lock-object-namespace>`
* `leaderElection.resourceName` to `<lock-object-name>`

{{< note >}}
<!--
The control plane creates the lock objects for you, but the namespace must already exist.
You can use the `kube-system` namespace.
-->
控制平面會爲你創建鎖對象，但是命名空間必須已經存在。
你可以使用 `kube-system` 命名空間。
{{< /note >}}

<!--
If RBAC is enabled on your cluster, you must update the `system:kube-scheduler` cluster role.
Add your scheduler name to the resourceNames of the rule applied for `endpoints` and `leases` resources, as in the following example:
-->
如果在集羣上啓用了 RBAC，則必須更新 `system：kube-scheduler` 集羣角色。
將調度器名稱添加到應用了 `endpoints` 和 `leases` 資源的規則的 resourceNames 中，如以下示例所示：

```shell
kubectl edit clusterrole system:kube-scheduler
```

{{% code_sample file="admin/sched/clusterrole.yaml" %}}

<!--
## Specify schedulers for pods
-->
## 爲 Pod 指定調度器

<!--
Now that your second scheduler is running, create some pods, and direct them
to be scheduled by either the default scheduler or the one you deployed.
In order to schedule a given pod using a specific scheduler, specify the name of the
scheduler in that pod spec. Let's look at three examples.
-->
現在第二個調度器正在運行，創建一些 Pod，並指定它們由默認調度器或部署的調度器進行調度。
爲了使用特定的調度器調度給定的 Pod，在那個 Pod 的 spec 中指定調度器的名稱。讓我們看看三個例子。

<!--
- Pod spec without any scheduler name
-->
- Pod spec 沒有任何調度器名稱

  {{% code_sample file="admin/sched/pod1.yaml" %}}

  <!--
  When no scheduler name is supplied, the pod is automatically scheduled using the
  default-scheduler.
  -->
  如果未提供調度器名稱，則會使用 default-scheduler 自動調度 pod。

  <!--
  Save this file as `pod1.yaml` and submit it to the Kubernetes cluster.
  -->
  將此文件另存爲 `pod1.yaml`，並將其提交給 Kubernetes 集羣。

  ```shell
  kubectl create -f pod1.yaml
  ```

<!--
- Pod spec with `default-scheduler`
-->
- Pod spec 設置爲 `default-scheduler`

  {{% code_sample file="admin/sched/pod2.yaml" %}}

  <!--
  A scheduler is specified by supplying the scheduler name as a value to `spec.schedulerName`. In this case, we supply the name of the
  default scheduler which is `default-scheduler`.
  -->
  通過將調度器名稱作爲 `spec.schedulerName` 參數的值來指定調度器。
  在這種情況下，我們提供默認調度器的名稱，即 `default-scheduler`。

  <!--
  Save this file as `pod2.yaml` and submit it to the Kubernetes cluster.
  -->
  將此文件另存爲 `pod2.yaml`，並將其提交給 Kubernetes 集羣。

  ```shell
  kubectl create -f pod2.yaml
  ```

<!--
- Pod spec with `my-scheduler`
-->
- Pod spec 設置爲 `my-scheduler`

  {{% code_sample file="admin/sched/pod3.yaml" %}}

  <!--
  In this case, we specify that this pod should be scheduled using the scheduler that we
  deployed - `my-scheduler`. Note that the value of `spec.schedulerName` should match the name supplied for the scheduler
  in the `schedulerName` field of the mapping `KubeSchedulerProfile`.
  -->
  在這種情況下，我們指定此 Pod 使用我們部署的 `my-scheduler` 來調度。
  請注意，`spec.schedulerName` 參數的值應該與調度器提供的 `KubeSchedulerProfile` 中的 `schedulerName` 字段相匹配。

  <!--
  Save this file as `pod3.yaml` and submit it to the Kubernetes cluster.
  -->
  將此文件另存爲 `pod3.yaml`，並將其提交給 Kubernetes 集羣。

  ```shell
  kubectl create -f pod3.yaml
  ```

<!--
  Verify that all three pods are running.
-->
  確認所有三個 Pod 都在運行。

  ```shell
  kubectl get pods
  ```

<!-- discussion -->

<!--
### Verifying that the pods were scheduled using the desired schedulers
-->
### 驗證是否使用所需的調度器調度了 Pod

<!--
In order to make it easier to work through these examples, we did not verify that the
pods were actually scheduled using the desired schedulers. We can verify that by
changing the order of pod and deployment config submissions above. If we submit all the
pod configs to a Kubernetes cluster before submitting the scheduler deployment config,
we see that the pod `annotation-second-scheduler` remains in "Pending" state forever
while the other two pods get scheduled. Once we submit the scheduler deployment config
and our new scheduler starts running, the `annotation-second-scheduler` pod gets
scheduled as well.
-->
爲了更容易地完成這些示例，我們沒有驗證 Pod 實際上是使用所需的調度程序調度的。
我們可以通過更改 Pod 的順序和上面的部署配置提交來驗證這一點。
如果我們在提交調度器部署配置之前將所有 Pod 配置提交給 Kubernetes 集羣，
我們將看到註解了 `annotation-second-scheduler` 的 Pod 始終處於 `Pending` 狀態，
而其他兩個 Pod 被調度。
一旦我們提交調度器部署配置並且我們的新調度器開始運行，註解了
`annotation-second-scheduler` 的 Pod 就能被調度。
<!--
Alternatively, you can look at the "Scheduled" entries in the event logs to
verify that the pods were scheduled by the desired schedulers.
-->
或者，可以查看事件日誌中的 `Scheduled` 條目，以驗證是否由所需的調度器調度了 Pod。

```shell
kubectl get events
```

<!--
You can also use a [custom scheduler configuration](/docs/reference/scheduling/config/#multiple-profiles)
or a custom container image for the cluster's main scheduler by modifying its static pod manifest
on the relevant control plane nodes.
-->
你也可以使用[自定義調度器配置](/zh-cn/docs/reference/scheduling/config/#multiple-profiles)
或自定義容器鏡像，用於集羣的主調度器，方法是在相關控制平面節點上修改其靜態 Pod 清單。
