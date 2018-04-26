<!-----
approvers:
- bprashanth
- erictune
- foxish
- janetkuo
- smarterclayton
title: Delete a Stateful Set
----->
---
approvers:
- bprashanth
- erictune
- foxish
- janetkuo
- smarterclayton
title: 删除StatefulSet
---

{% capture overview %}

<!--This task shows you how to delete a StatefulSet.-->
本任务将展示如何删除一个StatefulSet。

{% endcapture %}

{% capture prerequisites %}

<!--* This task assumes you have an application running on your cluster represented by a StatefulSet.-->
* 本任务假定您有一个应用程序已经以StatefulSet的方式部署在Kubernetes集群中运行。

{% endcapture %}

{% capture steps %}

<!--## Deleting a StatefulSet-->
## 删除一个StatefulSet

<!--You can delete a StatefulSet in the same way you delete other resources in Kubernetes: use the `kubectl delete` command, and specify the StatefulSet either by file or by name.-->
您可以像删除Kubernetes中其他资源一样通过`kubectl delete`命令删除一个StatefulSet。待删除的StatefulSet可以通过文件或者名字指定：

```shell
kubectl delete -f <file.yaml>
```

```shell
kubectl delete statefulsets <statefulset-name>
```

<!--You may need to delete the associated headless service separately after the StatefulSet itself is deleted.-->
在StatefulSet被删除后，您可能还需要单独删除与之关联的Headless Service。

```shell
kubectl delete service <service-name>
```

<!--Deleting a StatefulSet through kubectl will scale it down to 0, thereby deleting all pods that are a part of it. If you want to delete just the StatefulSet and not the pods, use `--cascade=false`.-->
通过kubectl删除一个StatefulSet将缩减Pod数量至0，从而删除所有属于这个StatefulSet的Pod。如果仅仅想删除StatefulSet对象而保留Pod，请在删除时使用`--cascade=false`。

```shell
kubectl delete -f <file.yaml> --cascade=false
```

<!--By passing `--cascade=false` to `kubectl delete`, the Pods managed by the StatefulSet are left behind even after the StatefulSet object itself is deleted. If the pods have a label `app=myapp`, you can then delete them as follows:-->
通过在使用`kubectl delete`命令时设置`--cascade = false`，即使在StatefulSet对象本身被删除之后，StatefulSet所管理的Pod也将会被保留下来。如果这些Pod包含标签`app=myapp`，您可以通过以下命令删除它：

```shell
kubectl delete pods -l app=myapp
```

<!--### Persistent Volumes-->
### 持久化卷（Persistent Volumes）

<!--Deleting the Pods in a StatefulSet will not delete the associated volumes. This is to ensure that you have the chance to copy data off the volume before deleting it. Deleting the PVC after the pods have left the [terminating state](/docs/user-guide/pods/index#termination-of-pods) might trigger deletion of the backing Persistent Volumes depending on the storage class and reclaim policy. You should never assume ability to access a volume after claim deletion.-->
删除StatefulSet中的Pod将不会删除其所关联的持久化卷，这将确保您在彻底删除卷设备之前可以拷贝和备份其中的数据。
在Pod经历了[terminating状态](/docs/user-guide/pods/index#termination-of-pods)之后删除PVC可能会导致PV的删除，这一过程需要根据StorageClass和PV Reclaim Policy的配置来决定。PVC被删除后，将不能保证用户仍能访问PV。

<!--**Note: Use caution when deleting a PVC, as it may lead to data loss.**-->
**注意：删除PVC时要小心，否则可能导致数据丢失。**

<!--### Complete deletion of a StatefulSet-->
### StatefulSet的完整删除

<!--To simply delete everything in a StatefulSet, including the associated pods, you can run a series of commands similar to the following:-->
如果要简单地删除StatefulSet中包含的所有内容，包括所关联的Pod，您可以尝试执行以下一系列命令：

```shell{% raw %}
grace=$(kubectl get pods <stateful-set-pod> --template '{{.spec.terminationGracePeriodSeconds}}')
kubectl delete statefulset -l app=myapp
sleep $grace
kubectl delete pvc -l app=myapp
{% endraw %}
```

<!--In the example above, the Pods have the label `app=myapp`; substitute your own label as appropriate.-->
在上面的例子中，所有的Pod包含标签`app=myapp`，您可以将其替换成为您环境中实际使用的Pod标签。

<!--### Force deletion of StatefulSet pods-->
### 强制删除StatefulSet中的Pod

<!--If you find that some pods in your StatefulSet are stuck in the 'Terminating' or 'Unknown' states for an extended period of time, you may need to manually intervene to forcefully delete the pods from the apiserver. This is a potentially dangerous task. Refer to [Deleting StatefulSet Pods](/docs/tasks/manage-stateful-set/delete-pods/) for details.-->
如果您发现StatefulSet中的某些Pod长期停留在'Terminating'或者'Unknown'状态，则可能需要手动干预才能强制删除API server中的Pod。这一强制操作可能包含一些潜在风险，详细信息请参阅[删除StatefulSet中的Pod](/docs/tasks/manage-stateful-set/delete-pods/)。

{% endcapture %}

{% capture whatsnext %}

Learn more about [force deleting StatefulSet Pods](/docs/tasks/run-application/force-delete-stateful-set-pod/).
更多有关强制删除StatefulSet中的Pod的信息，请参阅[强制删除StatefulSet中的Pod](/docs/tasks/run-application/force-delete-stateful-set-pod/)。

{% endcapture %}

{% include templates/task.md %}
