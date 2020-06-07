---
title: 配置多个调度器
content_template: templates/task
---
<!--
---
reviewers:
- davidopp
- madhusudancs
title: Configure Multiple Schedulers
content_template: templates/task
---
-->

{{% capture overview %}}

<!--
Kubernetes ships with a default scheduler that is described [here](/docs/admin/kube-scheduler/).
-->
Kubernetes 自带了一个默认调度器，其详细描述请查阅[这里](/docs/reference/command-line-tools-reference/kube-scheduler/)。
<!--
If the default scheduler does not suit your needs you can implement your own scheduler.
-->
如果默认调度器不适合您的需求，您可以实现自己的调度器。
<!--
Not just that, you can even run multiple schedulers simultaneously alongside the default scheduler and instruct Kubernetes what scheduler to use for each of your pods. Let's learn how to run multiple schedulers in Kubernetes with an example.
-->
不仅如此，您甚至可以伴随着默认调度器同时运行多个调度器，并告诉 Kubernetes 为每个 pod 使用什么调度器。
让我们通过一个例子讲述如何在 Kubernetes 中运行多个调度器。

<!--
A detailed description of how to implement a scheduler is outside the scope of this document. Please refer to the kube-scheduler implementation in[pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/{{< param "githubbranch" >}}/pkg/scheduler)in the Kubernetes source directory for a canonical example.
-->
关于实现调度器的具体细节描述超出了本文范围。
请参考 kube-scheduler 的实现，规范示例代码位于 [pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/{{< param "githubbranch" >}}/pkg/scheduler)。

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

<!--
## Package the scheduler
-->
## 打包调度器

<!--
Package your scheduler binary into a container image. For the purposes of this example,let's just use the default scheduler (kube-scheduler) as our second scheduler as well.
-->
将调度器二进制文件打包到容器镜像中。出于示例目的，我们就使用默认调度器（kube-scheduler）作为我们的第二个调度器。
<!--
Clone the [Kubernetes source code from Github](https://github.com/kubernetes/kubernetes)and build the source.
-->
从 Github 克隆 [Kubernetes 源代码](https://github.com/kubernetes/kubernetes)，并编译构建源代码。

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make
```

<!--
Create a container image containing the kube-scheduler binary. Here is the `Dockerfile`to build the image:
-->
创建一个包含 kube-scheduler 二进制文件的容器镜像。用于构建镜像的 `Dockerfile` 内容如下：

```docker
FROM busybox
ADD ./_output/dockerized/bin/linux/amd64/kube-scheduler /usr/local/bin/kube-scheduler
```

<!--
Save the file as `Dockerfile`, build the image and push it to a registry. This example pushes the image to[Google Container Registry (GCR)](https://cloud.google.com/container-registry/).
-->
将文件保存为 `Dockerfile`，构建镜像并将其推送到镜像仓库。
此示例将镜像推送到 [Google 容器镜像仓库（GCR）](https://cloud.google.com/container-registry/)。
<!--
For more details, please read the GCR[documentation](https://cloud.google.com/container-registry/docs/).
-->
有关详细信息，请阅读 GCR [文档](https://cloud.google.com/container-registry/docs/)。

```shell
docker build -t gcr.io/my-gcp-project/my-kube-scheduler:1.0 .
gcloud docker -- push gcr.io/my-gcp-project/my-kube-scheduler:1.0
```

<!--
## Define a Kubernetes Deployment for the scheduler
-->
## 为调度器定义 Kubernetes Deployment

<!--
Now that we have our scheduler in a container image, we can just create a pod config for it and run it in our Kubernetes cluster. But instead of creating a pod directly in the cluster, let's use a [Deployment](/docs/concepts/workloads/controllers/deployment/)for this example. A [Deployment](/docs/concepts/workloads/controllers/deployment/) manages a[Replica Set](/docs/concepts/workloads/controllers/replicaset/) which in turn manages the pods,thereby making the scheduler resilient to failures. Here is the deployment config. Save it as `my-scheduler.yaml`:
-->
现在我们将调度器放在容器镜像中，我们可以为它创建一个 pod 配置，并在我们的 Kubernetes 集群中运行它。
但是与其在集群中直接创建一个 pod，不如使用 [Deployment](/docs/concepts/workloads/controllers/deployment/)。
[Deployment](/docs/concepts/workloads/controllers/deployment/) 管理一个 [Replica Set](/docs/concepts/workloads/controllers/replicaset/)，Replica Set 再管理 pod，从而使调度器能够适应故障。
以下是 Deployment 配置，被保存为 `my-scheduler.yaml`：

{{< codenew file="admin/sched/my-scheduler.yaml" >}}

<!--
An important thing to note here is that the name of the scheduler specified as an argument to the scheduler command in the container spec should be unique. This is the name that is matched against the value of the optional `spec.schedulerName` on pods, to determine whether this scheduler is responsible for scheduling a particular pod.
-->
这里需要注意的是，在该部署文件中 Container 的 spec 配置的调度器启动命令参数（--scheduler-name）指定的调度器名称应该是惟一的。
这个名称应该与 pods 上的可选参数 `spec.schedulerName` 的值相匹配，也就是说调度器名称的匹配关系决定了 pods 的调度任务由哪个调度器负责。

<!--
Note also that we created a dedicated service account `my-scheduler` and bind the cluster role`system:kube-scheduler` to it so that it can acquire the same privileges as `kube-scheduler`.
-->
还要注意，我们创建了一个专用服务帐户 `my-scheduler` 并将集群角色 `system:kube-scheduler` 绑定到它，以便它可以获得与 `kube-scheduler` 相同的权限。

<!--
Please see the[kube-scheduler documentation](/docs/admin/kube-scheduler/) for detailed description of other command line arguments.
-->
请参阅 [kube-scheduler 文档](/docs/reference/command-line-tools-reference/kube-scheduler/)以获取其他命令行参数的详细说明。

<!--
## Run the second scheduler in the cluster
-->
## 在集群中运行第二个调度器

<!--
In order to run your scheduler in a Kubernetes cluster, just create the deployment specified in the config above in a Kubernetes cluster:
-->
为了在 Kubernetes 集群中运行我们的第二个调度器，只需在 Kubernetes 集群中创建上面配置中指定的 Deployment：

```shell
kubectl create -f my-scheduler.yaml
```

<!--
Verify that the scheduler pod is running:
-->
验证调度器 pod 正在运行：

```shell
$ kubectl get pods --namespace=kube-system
NAME                                           READY     STATUS    RESTARTS   AGE
....
my-scheduler-lnf4s-4744f                       1/1       Running   0          2m
...
```

<!--
You should see a "Running" my-scheduler pod, in addition to the default kube-scheduler pod in this list.
-->
此列表中，除了默认的 kube-scheduler pod 之外，您应该还能看到处于 “Running” 状态的 my-scheduler pod。

<!--
To run multiple-scheduler with leader election enabled, you must do the following:
-->
要在启用了 leader 选举的情况下运行多调度器，您必须执行以下操作：

<!--
First, update the following fields in your YAML file:
-->
首先，更新上述 Deployment YAML（my-scheduler.yaml）文件中的以下字段：

* `--leader-elect=true`
* `--lock-object-namespace=lock-object-namespace`
* `--lock-object-name=lock-object-name`

<!--
If RBAC is enabled on your cluster, you must update the `system:kube-scheduler` cluster role. Add you scheduler name to the resourceNames of the rule applied for endpoints resources, as in the following example:
-->
如果在集群上启用了 RBAC，则必须更新 `system：kube-scheduler` 集群角色。将调度器名称添加到应用于端点资源的规则的 resourceNames，如以下示例所示：
```
$ kubectl edit clusterrole system:kube-scheduler
- apiVersion: rbac.authorization.k8s.io/v1
  kind: ClusterRole
  metadata:
    annotations:
      rbac.authorization.kubernetes.io/autoupdate: "true"
    labels:
      kubernetes.io/bootstrapping: rbac-defaults
    name: system:kube-scheduler
  rules:
  - apiGroups:
    - ""
    resourceNames:
    - kube-scheduler
    - my-scheduler
    resources:
    - endpoints
    verbs:
    - delete
    - get
    - patch
    - update
```

<!--
## Specify schedulers for pods
-->
## 指定 pod 的调度器

<!--
Now that our second scheduler is running, let's create some pods, and direct them to be scheduled by either the default scheduler or the one we just deployed. In order to schedule a given pod using a specific scheduler, we specify the name of the scheduler in that pod spec. Let's look at three examples.
-->
现在我们的第二个调度器正在运行，让我们创建一些 pod，并指定它们由默认调度器或我们刚部署的调度器进行调度。
为了使用特定的调度器调度给定的 pod，我们在那个 pod 的 spec 中指定调度器的名称。让我们看看三个例子。


<!--
- Pod spec without any scheduler name
-->
 -  Pod spec 没有任何调度器名称

  {{< codenew file="admin/sched/pod1.yaml" >}}

<!--
  When no scheduler name is supplied, the pod is automatically scheduled using the  default-scheduler.
-->
如果未提供调度器名称，则会使用 default-scheduler 自动调度 pod。

<!--
  Save this file as `pod1.yaml` and submit it to the Kubernetes cluster.
-->
将此文件另存为 `pod1.yaml`，并将其提交给 Kubernetes 集群。

```shell
kubectl create -f pod1.yaml
```

<!--
- Pod spec with `default-scheduler`
-->
 -  Pod spec 设置为 `default-scheduler`

  {{< codenew file="admin/sched/pod2.yaml" >}}

<!--
  A scheduler is specified by supplying the scheduler name as a value to `spec.schedulerName`. In this case, we supply the name of the  default scheduler which is `default-scheduler`.
-->
通过将调度器名称作为 `spec.schedulerName` 参数的值来指定调度器。在这种情况下，我们提供默认调度器的名称，即 `default-scheduler`。

<!--
  Save this file as `pod2.yaml` and submit it to the Kubernetes cluster.
-->
将此文件另存为 `pod2.yaml`，并将其提交给 Kubernetes 集群。

```shell
kubectl create -f pod2.yaml
```

<!--
- Pod spec with `my-scheduler`
-->
 -  Pod spec 设置为 `my-scheduler`

  {{< codenew file="admin/sched/pod3.yaml" >}}

<!--
  In this case, we specify that this pod should be scheduled using the scheduler that we  deployed - `my-scheduler`. Note that the value of `spec.schedulerName` should match the name supplied to the scheduler  command as an argument in the deployment config for the scheduler.
-->
在这种情况下，我们指定此 pod 使用我们部署的 `my-scheduler` 来调度。
请注意，`spec.schedulerName` 参数的值应该与 Deployment 中配置的提供给 scheduler 命令的参数名称匹配。

<!--
  Save this file as `pod3.yaml` and submit it to the Kubernetes cluster.
-->
将此文件另存为 `pod3.yaml`，并将其提交给 Kubernetes 集群。

```shell
kubectl create -f pod3.yaml
```

<!--
  Verify that all three pods are running.
-->
确认所有三个 pod 都在运行。

```shell
kubectl get pods
```

{{% /capture %}}

{{% capture discussion %}}

<!--
### Verifying that the pods were scheduled using the desired schedulers
-->
### 验证是否使用所需的调度器调度了 pod

<!--
In order to make it easier to work through these examples, we did not verify that the pods were actually scheduled using the desired schedulers. We can verify that by changing the order of pod and deployment config submissions above. If we submit all the pod configs to a Kubernetes cluster before submitting the scheduler deployment config,we see that the pod `annotation-second-scheduler` remains in "Pending" state forever while the other two pods get scheduled. Once we submit the scheduler deployment config and our new scheduler starts running, the `annotation-second-scheduler` pod gets scheduled as well.
-->
为了更容易地完成这些示例，我们没有验证 pod 实际上是使用所需的调度程序调度的。
我们可以通过更改 pod 的顺序和上面的部署配置提交来验证这一点。
如果我们在提交调度器部署配置之前将所有 pod 配置提交给 Kubernetes 集群，我们将看到注解了 `annotation-second-scheduler` 的 pod 始终处于 “Pending” 状态，而其他两个 pod 被调度。
一旦我们提交调度器部署配置并且我们的新调度器开始运行，注解了 `annotation-second-scheduler` 的 pod 就能被调度。

<!--
Alternatively, one could just look at the "Scheduled" entries in the event logs to verify that the pods were scheduled by the desired schedulers.
-->
或者，可以查看事件日志中的 “Scheduled” 条目，以验证是否由所需的调度器调度了 pod。

```shell
kubectl get events
```

{{% /capture %}}
