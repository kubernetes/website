---
title: 调试StatefulSet
---

{% capture overview %}

此任务展示如何调试StatefulSet。

{% endcapture %}

{% capture prerequisites %}


* 你需要有一个Kubernetes集群，通过必要的配置使kubectl命令行工具与您的集群进行通信。
* 你应该有一个运行中的StatefulSet，以便用于调试。

{% endcapture %}

{% capture steps %}

## 调试StatefulSet

由于StatefulSet在创建时设置了`app=myapp`标签，列出仅属于该StatefulSet的所有pod时，可以使用以下命令：

```shell
kubectl get pods -l app=myapp
```

如果您发现列出的任何Pods长时间处于`Unknown` 或`Terminating`状态，请参阅[删除 StatefulSet Pods](/docs/tasks/manage-stateful-set/delete-pods/)关于如何处理它们的说明任务。您可以使用[调试 Pods](/docs/user-guide/debugging-pods-and-replication-controllers/#debugging-pods)指南来调试StatefulSet中的各个Pod。

StatefulSets提供了一个调试机制，可以使用注解来暂停所有控制器在Pod上的操作。在任何StatefulSet Pod上设置`pod.alpha.kubernetes.io/initialized`注解为`"false"`将*pause* StatefulSet的所有操作。暂停时，StatefulSet将不执行任何伸缩操作。一旦调试钩子设置完成后，就可以在StatefulSet pod的容器内执行命令，而不会造成伸缩操作的干扰。您可以通过执行以下命令将注解设置为`"false"`：

```shell
kubectl annotate pods <pod-name> pod.alpha.kubernetes.io/initialized="false" --overwrite
```

当注解设置为`"false"`时，StatefulSet在其Pods变得不健康或不可用时将不会响应。在每个StatefulSet Pod上删除注解或将其设置为`"true"`,它将不会创建副本Pod。

### 逐步初始化

您也可以使用相同的注解来调试StatefulSet的`.spec.template.metadata.annotations`字段中将`pod.alpha.kubernetes.io/initialized`注解设置为`"false"`。

```yaml
apiVersion: apps/v1beta1
kind: StatefulSet
metadata:
  name: my-app
spec:
  serviceName: "my-app"
  replicas: 3
  template:
    metadata:
      labels:
        app: my-app
      annotations:
        pod.alpha.kubernetes.io/initialized: "false"
...
...
...

```

设置注解后，如果创建了StatefulSet，您可以等待每个Pod来验证它是否正确初始化。StatefulSet将不会创建任何后续的Pods，直到在已经创建的每个Pod上将调试注解设置为`"true"` (或删除)。 您可以通过执行以下命令将注解设置为`"true"`：

```shell
kubectl annotate pods <pod-name> pod.alpha.kubernetes.io/initialized="true" --overwrite
```

{% endcapture %}

{% capture whatsnext %}

点击链接[调试init-container](/docs/tasks/troubleshoot/debug-init-containers/)，了解更多信息。

{% endcapture %}

{% include templates/task.md %}
