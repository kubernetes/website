---

title: 改变默认 StorageClass
---

{% capture overview %}

本文展示了如何改变默认的 Storage Class，它用于为没有特殊需求的 PersistentVolumeClaims 配置 volumes。

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}


## 为什么要改变默认 storage class？


取决于安装模式，您的 Kubernetes 集群可能和一个被标记为默认的已有 StorageClass 一起部署。这个默认的 StorageClass 以后将被用于动态的为没有特定 storage class 需求的 PersistentVolumeClaims 配置存储。更多细节请查看 [PersistentVolumeClaim 文档](/docs/user-guide/persistent-volumes/#class-1)。


预先安装的默认 StorageClass 可能不能很好的适应您期望的工作负载；例如，它配置的存储可能太过昂贵。如果是这样的话，您可以改变默认 StorageClass，或者完全禁用它以防止动态配置存储。


简单的删除默认 StorageClass 可能行不通，因为它可能会被您集群中的扩展管理器自动重建。请查阅您的安装文档中关于扩展管理器的细节，以及如何禁用单个扩展。


## 改变默认 StorageClass


1. 列出您集群中的 StorageClasses：

        kubectl get storageclass


	输出类似这样：

        NAME                 TYPE
        standard (default)   kubernetes.io/gce-pd
        gold                 kubernetes.io/gce-pd


   默认 StorageClass 以 `(default)` 标记。


2. 标记默认 StorageClass  非默认：


   默认 StorageClass 的注解 `storageclass.kubernetes.io/is-default-class` 设置为 `true`。注解的其它任意值或者缺省值将被解释为 `false`。


   要标记一个 StorageClass 为非默认的，您需要改变它的值为 `false`： 

        kubectl patch storageclass <your-class-name> -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'


    这里的 `<your-class-name>` 是您选择的 StorageClass 的名字。


3. 标记一个 StorageClass 为默认的：


   和前面的步骤类似，您需要添加/设置注解 `storageclass.kubernetes.io/is-default-class=true`。

        kubectl patch storageclass <your-class-name> -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'


   请注意，最多只能有一个 StorageClass 能够被标记为默认。如果它们中有两个或多个被标记为默认，Kubernetes 将忽略这个注解，也就是它将表现为没有默认 StorageClass。


4. 验证您选用的 StorageClass 为默认的：

        kubectl get storageclass


    输出类似这样：

        NAME             TYPE
        standard         kubernetes.io/gce-pd
        gold (default)   kubernetes.io/gce-pd

{% endcapture %}

{% capture whatsnext %}

* 了解更多关于  [StorageClasses](/docs/concepts/storage/persistent-volumes/)。
  {% endcapture %}

{% include templates/task.md %}
