---
title: 改变默认 StorageClass
---

<!--
title: Change the default StorageClass
-->

{% capture overview %}
<!--
This page shows how to change the default Storage Class that is used to
provision volumes for PersistentVolumeClaims that have no special requirements.
-->
本文展示了如何改变默认的 Storage Class，它用于为没有特殊需求的 PersistentVolumeClaims 配置 volumes。

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

<!--
## Why change the default storage class?
-->
## 为什么要改变默认 storage class？

<!--
Depending on the installation method, your Kubernetes cluster may be deployed with
an existing StorageClass that is marked as default. This default StorageClass
is then used to dynamically provision storage for PersistentVolumeClaims
that do not require any specific storage class. See
[PersistentVolumeClaim documentation](/docs/user-guide/persistent-volumes/#class-1)
for details.
-->
取决于安装模式，您的 Kubernetes 集群可能和一个被标记为默认的已有 StorageClass 一起部署。这个默认的 StorageClass 以后将被用于动态的为没有特定 storage class 需求的 PersistentVolumeClaims 配置存储。更多细节请查看 [PersistentVolumeClaim 文档](/docs/user-guide/persistent-volumes/#class-1)。

<!--
The pre-installed default StorageClass may not fit well with your expected workload;
for example, it might provision storage that is too expensive. If this is the case,
you can either change the default StorageClass or disable it completely to avoid
dynamic provisioning of storage.
-->
预先安装的默认 StorageClass 可能不能很好的适应您期望的工作负载；例如，它配置的存储可能太过昂贵。如果是这样的话，您可以改变默认 StorageClass，或者完全禁用它以防止动态配置存储。

<!--
Simply deleting the default StorageClass may not work, as it may be re-created
automatically by the addon manager running in your cluster. Please consult the docs for your installation
for details about addon manager and how to disable individual addons.
-->
简单的删除默认 StorageClass 可能行不通，因为它可能会被您集群中的扩展管理器自动重建。请查阅您的安装文档中关于扩展管理器的细节，以及如何禁用单个扩展。

<!--
## Changing the default StorageClass
-->
## 改变默认 StorageClass

<!--
1. List the StorageClasses in your cluster:
-->
1. 列出您集群中的 StorageClasses：

        kubectl get storageclass

<!--
    The output is similar to this:
-->
	输出类似这样：

        NAME                 TYPE
        standard (default)   kubernetes.io/gce-pd
        gold                 kubernetes.io/gce-pd

<!--
   The default StorageClass is marked by `(default)`.
-->
   默认 StorageClass 以 `(default)` 标记。

<!--
2. Mark the default StorageClass as non-default:
-->
2. 标记默认 StorageClass  非默认：

<!--
   The default StorageClass has an annotation
   `storageclass.kubernetes.io/is-default-class` set to `true`. Any other value
   or absence of the annotation is interpreted as `false`.
-->
   默认 StorageClass 的注解 `storageclass.kubernetes.io/is-default-class` 设置为 `true`。注解的其它任意值或者缺省值将被解释为 `false`。

<!--
   To mark a StorageClass as non-default, you need to change its value to `false`:
-->
   要标记一个 StorageClass 为非默认的，您需要改变它的值为 `false`：

        kubectl patch storageclass <your-class-name> -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'

<!--
    where `<your-class-name>` is the name of your chosen StorageClass.
-->
    这里的 `<your-class-name>` 是您选择的 StorageClass 的名字。

<!--
3. Mark a StorageClass as default:
-->
3. 标记一个 StorageClass 为默认的：

<!--
   Similarly to the previous step, you need to add/set the annotation
   `storageclass.kubernetes.io/is-default-class=true`.
-->
   和前面的步骤类似，您需要添加/设置注解 `storageclass.kubernetes.io/is-default-class=true`。

        kubectl patch storageclass <your-class-name> -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'

<!--
   Please note that at most one StorageClass can be marked as default. If two
   or more of them are marked as default, Kubernetes ignores the annotation,
   i.e. it behaves as if there is no default StorageClass.
-->
   请注意，最多只能有一个 StorageClass 能够被标记为默认。如果它们中有两个或多个被标记为默认，Kubernetes 将忽略这个注解，也就是它将表现为没有默认 StorageClass。

<!--
4. Verify that your chosen StorageClass is default:
-->
4. 验证您选用的 StorageClass 为默认的：

        kubectl get storageclass

<!--
    The output is similar to this:
-->
    输出类似这样：

        NAME             TYPE
        standard         kubernetes.io/gce-pd
        gold (default)   kubernetes.io/gce-pd

{% endcapture %}

{% capture whatsnext %}
<!--
* Learn more about [StorageClasses](/docs/concepts/storage/persistent-volumes/).
-->
* 了解更多关于  [StorageClasses](/docs/concepts/storage/persistent-volumes/)。
  {% endcapture %}

{% include templates/task.md %}
