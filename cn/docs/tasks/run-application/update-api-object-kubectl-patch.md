---
title: 使用 kubectl patch 更新 API 对象
description: 使用 kubectl patch 更新 Kubernetes 对象。做一个策略性合并补丁或一个 JSON 合并补丁。
---
<!--
---
title: Update API Objects in Place Using kubectl patch
description: Use kubectl patch to update Kubernetes API objects in place. Do a strategic merge patch or a JSON merge patch.
---
-->

{% capture overview %}

<!--
This task shows how to use `kubectl patch` to update an API object in place. The exercises
in this task demonstrate a strategic merge patch and a JSON merge patch.
-->
本文说明了如何使用 `kubectl patch` 更新 API 对象。本文中的例子演示了一个策略性合并补丁和一个 JSON 合并补丁。

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

<!--
## Use a strategic merge patch to update a Deployment

Here's the configuration file for a Deployment that has two replicas. Each replica
is a Pod that has one container:
-->
## 使用策略性合并补丁更新一个 Deployment

这里有一个副本数为 2 的 Deployment 配置文件，每个副本是一个拥有单个容器的 Pod ：

{% include code.html language="yaml" file="deployment-patch-demo.yaml" ghlink="/docs/tasks/run-application/deployment-patch-demo.yaml" %}

<!--
Create the Deployment:
-->
创建这个 Deployment ：

```shell
kubectl create -f https://k8s.io/docs/tasks/run-application/deployment-patch-demo.yaml
```

<!--
View the Pods associated with your Deployment:
-->
查看和这个 Deployment 关联的 Pod ：

```shell
kubectl get pods
```

<!--
The output shows that the Deployment has two Pods. The `1/1` indicates that
each Pod has one container:
-->
输出内容显示这个 Deployment 拥有两个 Pod 。`1/1` 表示每个 Pod 拥有一个容器：


```
NAME                        READY     STATUS    RESTARTS   AGE
patch-demo-28633765-670qr   1/1       Running   0          23s
patch-demo-28633765-j5qs3   1/1       Running   0          23s
```

<!--
Make a note of the names of the running Pods. Later, you will see that these Pods
get terminated and replaced by new ones.
-->
记下这些运行中的 Pod 的名称，稍后您会看到这些 Pod 被终止了并且会被新的 Pod 所取代。

<!--
At this point, each Pod has one Container that runs the nginx image. Now suppose
you want each Pod to have two containers: one that runs nginx and one that runs redis.
-->
此时，每个 Pod 拥有一个运行 nginx 镜像的容器。现在假设您希望每个 Pod 拥有两个容器：一个运行 nginx，另一个运行 redis。

<!--
Create a file named `patch-file.yaml` that has this content:
-->
创建一个文件 `patch-file.yaml` ，内容如下：

```shell
spec:
  template:
    spec:
      containers:
      - name: patch-demo-ctr-2
        image: redis
```

<!--
Patch your Deployment:
-->
给这个 Deployment 打补丁：

```shell
kubectl patch deployment patch-demo --patch "$(cat patch-file.yaml)"
```

<!--
View the patched Deployment:
-->
查看打补丁后的 Deployment：

```shell
kubectl get deployment patch-demo --output yaml
```

<!--
The output shows that the PodSpec in the Deployment has two Containers:
-->
输出内容显示这个 Deployment 的 PodSpec 中有两个容器：

```shell
containers:
- image: redis
  imagePullPolicy: Always
  name: patch-demo-ctr-2
  ...
- image: nginx
  imagePullPolicy: Always
  name: patch-demo-ctr
  ...
```

<!--
View the Pods associated with your patched Deployment:
-->
查看打补丁后的 Deployment 所关联的 Pod ：

```shell
kubectl get pods
```

<!--
The output shows that the running Pods have different names from the Pods that
were running previously. The Deployment terminated the old Pods and created two
new Pods that comply with the updated Deployment spec. The `2/2` indicates that
each Pod has two Containers:
-->
输出内容显示当前正在运行的 Pod 名称与打补丁之前的 Pod 名称不一样了。这个 Deployment 终止了原先的 Pod 然后使用更新后的 spec 重新创建了两个新的 Pod 。`2/2` 表示每个 Pod 拥有两个容器：

```
NAME                          READY     STATUS    RESTARTS   AGE
patch-demo-1081991389-2wrn5   2/2       Running   0          1m
patch-demo-1081991389-jmg7b   2/2       Running   0          1m
```

<!--
Take a closer look at one of the patch-demo Pods:
-->
让我们仔细看看这个补丁例子中的其中一个 Pod ：

```shell
kubectl get pod <your-pod-name> --output yaml
```

<!--
The output shows that the Pod has two Containers: one running nginx and one running redis:
-->
输出内容显示这个 Pod 拥有两个容器，一个运行 nginx ，一个运行 redis ：

```
containers:
- image: redis
  ...
- image: nginx
  ...
```

<!--
### Notes on the strategic merge patch
-->
### 关于策略性合并补丁的说明

<!--
With a patch, you do not have to specify an entire object; you specify only the portion
of the object that you want to change. For example, in the preceding exercise, you specified
one Container in the `containers` list in a `PodSpec`.
-->
通过补丁，您可以避免定义整个对象，只需要定义您希望更改的部分。比如：在上述例子中，您只需要在 `PodSpec` 中 `containers` 列表中定义了一个容器。

<!--
The patch you did in the preceding exercise is called a *strategic merge patch*.
With a strategic merge patch, you can update a list by specifying only the elements
that you want to add to the list. The existing list elements remain, and the new elements
are merged with the existing elements. In the preceding exercise, the resulting `containers`
list has both the original nginx Container and the new redis Container.
-->
上述例子中的补丁称为 *策略性合并补丁* 。通过策略性合并补丁，您只需要定义新增的元素就可以更新一个列表。列表中已有的元素仍然保留，新增的元素和已有的元素会被合并。上述例子中，最终结果的 `containers` 列表中既有原先的 nginx 容器，也有新增的 redis 容器。

<!--
## Use a JSON merge patch to update a Deployment
-->
## 使用一个 JSON 合并补丁更新一个 Deployment

<!--
A strategic merge patch is different from a
[JSON merge patch](https://tools.ietf.org/html/rfc6902).
With a JSON merge patch, if you
want to update a list, you have to specify the entire new list. And the new list completely
replaces the existing list.
-->
策略性合并补丁与 [JSON 合并补丁](https://tools.ietf.org/html/rfc6902) 是不一样的。如果您希望使用 JSON 合并补丁更新一个列表，您必须重新定义整个列表。新的列表会完全替换掉原先的列表。

<!--
The `kubectl patch` command has a `type` parameter that you can set to one of these values:

<table>
  <tr><th>Parameter value</th><th>Merge type</th></tr>
  <tr><td>json</td><td><a href="https://tools.ietf.org/html/rfc6902">JSON Patch, RFC 6902</a></td></tr>
  <tr><td>merge</td><td><a href="https://tools.ietf.org/html/rfc7386">JSON Merge Patch, RFC 7386</a></td></tr>
  <tr><td>strategic</td><td>Strategic merge patch</td></tr>
</table>
-->
`kubectl patch` 命令拥有一个 `type` 参数，您可以将其设置为以下值：

<table>
  <tr><th>参数值</th><th>合并类型</th></tr>
  <tr><td>json</td><td><a href="https://tools.ietf.org/html/rfc6902">JSON 补丁, RFC 6902</a></td></tr>
  <tr><td>merge</td><td><a href="https://tools.ietf.org/html/rfc7386">JSON 合并补丁, RFC 7386</a></td></tr>
  <tr><td>strategic</td><td>策略性合并补丁</td></tr>
</table>

<!--
For a comparison of JSON patch and JSON merge patch, see
[JSON Patch and JSON Merge Patch](http://erosb.github.io/post/json-patch-vs-merge-patch/).
-->
关于 JSON 补丁 与 JSON 合并补丁的区别，请查看 [JSON 补丁 与 JSON 合并补丁](http://erosb.github.io/post/json-patch-vs-merge-patch/)。

<!--
The default value for the `type` parameter is `strategic`. So in the preceding exercise, you
did a strategic merge patch.
-->
`type` 参数的默认值是 `strategic`。因此，在上述例子中，您打了一个策略性合并补丁。

<!--
Next, do a JSON merge patch on your same Deployment. Create a file named `patch-file-2.yaml`
that has this content:
-->
接下来，继续使用上述的 Deployment 做一个 JSON 合并补丁。创建一个名为 `patch-file-2.yaml` 的文件，内容如下：

```shell
spec:
  template:
    spec:
      containers:
      - name: patch-demo-ctr-3
        image: gcr.io/google-samples/node-hello:1.0
```

<!--
In your patch command, set `type` to `merge`:
-->
在 patch 命令中，设置参数 `type` 的值为 `merge` ：

```shell
kubectl patch deployment patch-demo --type merge --patch "$(cat patch-file-2.yaml)"
```

<!--
View the patched Deployment:
-->
查看打补丁后的 Deployment ：

```shell
kubectl get deployment patch-demo --output yaml
```

<!--
The `containers` list that you specified in the patch has only one Container.
The output shows that your list of one Container replaced the existing `containers` list.
-->
在这个补丁中您定义的 `containers` 列表只有一个容器。输出内容显示这个只有一个容器的 `containers` 列表把原先的 `containers` 列表替换了。

```shell
spec:
  containers:
  - image: gcr.io/google-samples/node-hello:1.0
    ...
    name: patch-demo-ctr-3
```

<!--
List the running Pods:
-->
列出运行中的 Pod ：

```shell
kubectl get pods
```

<!--
In the output, you can see that the existing Pods were terminated, and new Pods
were created. The `1/1` indicates that each new Pod is running only one Container.
-->
在输出内容中，您可以看到原先的 Pod 被终止了，然后有新的 Pod 被创建了。`1/1` 表示每个 Pod 只拥有一个容器。

```shell
NAME                          READY     STATUS    RESTARTS   AGE
patch-demo-1307768864-69308   1/1       Running   0          1m
patch-demo-1307768864-c86dc   1/1       Running   0          1m
```

<!--
## Alternate forms of the kubectl patch command
-->
## kubectl patch 命令的其它形式

<!--
The `kubectl patch` command takes YAML or JSON. It can take the patch as a file or
directly on the command line.
-->
`kubectl patch` 命令接受 YAML 或 JSON 格式的补丁，且补丁能够以文件或直接以命令行参数的形式进行传递。

<!--
Create a file named `patch-file.json` that has this content:
-->
创建一个名为 `patch-file.json` 的文件，内容如下：

```shell
{
   "spec": {
      "template": {
         "spec": {
            "containers": [
               {
                  "name": "patch-demo-ctr-2",
                  "image": "redis"
               }
            ]
         }
      }
   }
}
```

<!--
The following commands are equivalent:
-->
以下的命令是等价的：


```shell
kubectl patch deployment patch-demo --patch "$(cat patch-file.yaml)"
kubectl patch deployment patch-demo --patch $'spec:\n template:\n  spec:\n   containers:\n   - name: patch-demo-ctr-2\n     image: redis'

kubectl patch deployment patch-demo --patch "$(cat patch-file.json)"
kubectl patch deployment patch-demo --patch '{"spec": {"template": {"spec": {"containers": [{"name": "patch-demo-ctr-2","image": "redis"}]}}}}'
```

<!--
## Summary
-->
## 总结

<!--
In this exercise, you `kubectl patch` to change the live configuration
of a Deployment object. You did not change the configuration file that you originally used to
create the Deployment object. Other commands for updating API objects include
-->
在这个例子中，您使用 `kubectl patch` 命令对一个 Deployment 的实时配置进行了更新。您并没有改变原先用来创建 Deployment 对象的那个配置文件。其它用于更新 API 对象的命令有：
[kubectl annotate](/docs/user-guide/kubectl/{{page.version}}/#annotate),
[kubectl edit](/docs/user-guide/kubectl/{{page.version}}/#edit),
[kubectl replace](/docs/user-guide/kubectl/{{page.version}}/#replace),
[kubectl scale](/docs/user-guide/kubectl/{{page.version}}/#scale),
and
[kubectl apply](/docs/user-guide/kubectl/{{page.version}}/#apply).

{% endcapture %}


{% capture whatsnext %}

<!--
* [Kubernetes Object Management](/docs/tutorials/object-management-kubectl/object-management/)
* [Managing Kubernetes Objects Using Imperative Commands](/docs/tutorials/object-management-kubectl/imperative-object-management-command/)
* [Imperative Management of Kubernetes Objects Using Configuration Files](/docs/tutorials/object-management-kubectl/imperative-object-management-configuration/)
* [Declarative Management of Kubernetes Objects Using Configuration Files](/docs/tutorials/object-management-kubectl/declarative-object-management-configuration/)
-->
* [Kubernetes 对象管理](/docs/tutorials/object-management-kubectl/object-management/)
* [使用命令式命令管理 Kubernetes 对象](/docs/tutorials/object-management-kubectl/imperative-object-management-command/)
* [使用配置文件对 Kubernetes 对象进行命令式管理](/docs/tutorials/object-management-kubectl/imperative-object-management-configuration/)
* [使用配置文件对 Kubernetes 对象进行声明式管理](/docs/tutorials/object-management-kubectl/declarative-object-management-configuration/)

{% endcapture %}

{% include templates/task.md %}
