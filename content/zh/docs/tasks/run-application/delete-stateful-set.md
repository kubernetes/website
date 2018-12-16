---
reviewers:
- bprashanth
- erictune
- foxish
- janetkuo
- smarterclayton
title: 删除 StatefulSet
content_template: templates/task
weight: 60
---

{{% capture overview %}}

<!--
This task shows you how to delete a StatefulSet.
--->
本文介绍如何删除 StatefulSet。

{{% /capture %}}

{{% capture prerequisites %}}

<!--
* This task assumes you have an application running on your cluster represented by a StatefulSet.
--->
* 本文假设在您的集群上已经运行了由 StatefulSet 创建的应用。

{{% /capture %}}

{{% capture steps %}}

## 删除 StatefulSet

<!--
You can delete a StatefulSet in the same way you delete other resources in Kubernetes: use the `kubectl delete` command, and specify the StatefulSet either by file or by name.
--->
您可以像删除 Kubernetes 中的其他资源一样删除 StatefulSet：使用 `kubectl delete` 命令，并按文件或者名字指定 StatefulSet。

```shell
kubectl delete -f <file.yaml>
```

```shell
kubectl delete statefulsets <statefulset-name>
```

<!--
You may need to delete the associated headless service separately after the StatefulSet itself is deleted.
--->
删除 StatefulSet 之后，您可能需要单独删除关联的无头服务。

```shell
kubectl delete service <service-name>
```

<!--
Deleting a StatefulSet through kubectl will scale it down to 0, thereby deleting all pods that are a part of it. 
If you want to delete just the StatefulSet and not the pods, use `--cascade=false`.
--->
通过 kubectl 删除 StatefulSet 会将其缩容为0，因此删除属于它的所有pods。
如果您只想删除 StatefulSet 而不删除 pods，使用 `--cascade=false`。

```shell
kubectl delete -f <file.yaml> --cascade=false
```

<!--
By passing `--cascade=false` to `kubectl delete`, the Pods managed by the StatefulSet are left behind even after the StatefulSet object itself is deleted. If the pods have a label `app=myapp`, you can then delete them as follows:
--->
通过将 `--cascade=false` 传递给 `kubectl delete`，在删除 StatefulSet 对象之后，StatefulSet 管理的 pods 会被保留下来。如果 pods 有一个标签 `app=myapp`，则可以按照如下方式删除它们：

```shell
kubectl delete pods -l app=myapp
```

### Persistent Volumes

<!--
Deleting the Pods in a StatefulSet will not delete the associated volumes. This is to ensure that you have the chance to copy data off the volume before deleting it. Deleting the PVC after the pods have left the [terminating state](/docs/concepts/workloads/pods/pod/#termination-of-pods) might trigger deletion of the backing Persistent Volumes depending on the storage class and reclaim policy. You should never assume ability to access a volume after claim deletion.
--->
删除 StatefulSet 管理的 pods 并不会删除关联的卷。这是为了确保您有机会在删除卷之前从卷中复制数据。在pods离开[终止状态](/docs/concepts/workloads/pods/pod/#termination-of-pods)后删除 PVC 可能会触发删除支持的 Persistent Volumes，具体取决于存储类和回收策略。声明删除后，您永远不应该假设能够访问卷。

<!--
**Note: Use caution when deleting a PVC, as it may lead to data loss.**
--->
**注意：删除 PVC 时要谨慎，因为这可能会导致数据丢失。**

<!--
### Complete deletion of a StatefulSet
--->
### 完全删除 StatefulSet

<!--
To simply delete everything in a StatefulSet, including the associated pods, you can run a series of commands similar to the following:
--->
要简单地删除 StatefulSet 中的所有内容，包括关联的 pods，您可能需要运行一系列类似于以下内容的命令：

```shell
grace=$(kubectl get pods <stateful-set-pod> --template '{{.spec.terminationGracePeriodSeconds}}')
kubectl delete statefulset -l app=myapp
sleep $grace
kubectl delete pvc -l app=myapp

```

<!--
In the example above, the Pods have the label `app=myapp`; substitute your own label as appropriate.
--->
在上面的例子中，pods 的标签为 `app=myapp`；适当地替换您自己的标签。

<!--
### Force deletion of StatefulSet pods
--->
### 强制删除 StatefulSet 类型的 pods

<!--
If you find that some pods in your StatefulSet are stuck in the 'Terminating' or 'Unknown' states for an extended period of time, you may need to manually intervene to forcefully delete the pods from the apiserver. This is a potentially dangerous task. Refer to [Deleting StatefulSet Pods](/docs/tasks/manage-stateful-set/delete-pods/) for details.
--->
如果您发现 StatefulSet 中的某些 pods 长时间处于 'Terminating' 或者 'Unknown' 状态，则可能需要手动干预以强制从 apiserver 中删除 pods。这是一项潜在的危险任务。详细信息请阅读[删除 StatefulSet 类型的 Pods](/docs/tasks/manage-stateful-set/delete-pods/)。

{{% /capture %}}

{{% capture whatsnext %}}

<!--
Learn more about [force deleting StatefulSet Pods](/docs/tasks/run-application/force-delete-stateful-set-pod/).
--->
了解更多有关[强制删除 StatefulSet 类型的 Pods](/docs/tasks/run-application/force-delete-stateful-set-pod/)。

{{% /capture %}}


