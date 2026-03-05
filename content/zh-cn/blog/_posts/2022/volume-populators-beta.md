---
layout: blog
title: "Kubernetes 1.24: 卷填充器功能进入 Beta 阶段"
date: 2022-05-16
slug: volume-populators-beta
---
<!--
layout: blog
title: "Kubernetes 1.24: Volume Populators Graduate to Beta"
date: 2022-05-16
slug: volume-populators-beta
-->

<!--
**Author:**
Ben Swartzlander (NetApp)
-->
**作者：**
Ben Swartzlander (NetApp)

<!--
The volume populators feature is now two releases old and entering beta! The `AnyVolumeDataSource` feature
gate defaults to enabled in Kubernetes v1.24, which means that users can specify any custom resource
as the data source of a PVC.
-->
卷填充器功能现在已经经历两个发行版本并进入 Beta 阶段！
在 Kubernetes v1.24 中 `AnyVolumeDataSource` 特性门控默认被启用。
这意味着用户可以指定任何自定义资源作为 PVC 的数据源。

<!--
An [earlier blog article](/blog/2021/08/30/volume-populators-redesigned/) detailed how the
volume populators feature works. In short, a cluster administrator can install a CRD and
associated populator controller in the cluster, and any user who can create instances of 
the CR can create pre-populated volumes by taking advantage of the populator.
-->
[之前的一篇博客](/blog/2021/08/30/volume-populators-redesigned/)详细介绍了卷填充器功能的工作原理。
简而言之，集群管理员可以在集群中安装 CRD 和相关的填充器控制器，
任何可以创建 CR 实例的用户都可以利用填充器创建预填充卷。

<!--
Multiple populators can be installed side by side for different purposes. The SIG storage
community is already seeing some implementations in public, and more prototypes should
appear soon.
-->
出于不同的目的，可以一起安装多个填充器。存储 SIG 社区已经有了一些公开的实现，更多原型应该很快就会出现。

<!--
Cluster administrations are **strongly encouraged** to install the
volume-data-source-validator controller and associated `VolumePopulator` CRD before installing
any populators so that users can get feedback about invalid PVC data sources.
-->
**强烈建议**集群管理人员在安装任何填充器之前安装 volume-data-source-validator 控制器和相关的
`VolumePopulator` CRD，以便用户可以获得有关无效 PVC 数据源的反馈。

<!--
## New Features
-->
## 新功能

<!--
The [lib-volume-populator](https://github.com/kubernetes-csi/lib-volume-populator) library
on which populators are built now includes metrics to help operators monitor and detect
problems. This library is now beta and latest release is v1.0.1.
-->
构建填充器的 [lib-volume-populator](https://github.com/kubernetes-csi/lib-volume-populator)
库现在包含可帮助操作员监控和检测问题的指标。这个库现在是 beta 阶段，最新版本是 v1.0.1。

<!--
The [volume data source validator](https://github.com/kubernetes-csi/volume-data-source-validator)
controller also has metrics support added, and is in beta. The `VolumePopulator` CRD is
beta and the latest release is v1.0.1.
-->
[卷数据源校验器](https://github.com/kubernetes-csi/volume-data-source-validator)控制器也添加了指标支持，
处于 beta 阶段。`VolumePopulator` CRD 是 beta 阶段，最新版本是 v1.0.1。

<!--
## Trying it out
-->
## 尝试一下

<!--
To see how this works, you can install the sample "hello" populator and try it
out.
-->
要查看它是如何工作的，你可以安装 “hello” 示例填充器并尝试一下。

<!--
First install the volume-data-source-validator controller.
-->
首先安装 volume-data-source-validator 控制器。

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/volume-data-source-validator/v1.0.1/client/config/crd/populator.storage.k8s.io_volumepopulators.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/volume-data-source-validator/v1.0.1/deploy/kubernetes/rbac-data-source-validator.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/volume-data-source-validator/v1.0.1/deploy/kubernetes/setup-data-source-validator.yaml
```
<!--
Next install the example populator.
-->
接下来安装 hello 示例填充器。

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/lib-volume-populator/v1.0.1/example/hello-populator/crd.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/lib-volume-populator/87a47467b86052819e9ad13d15036d65b9a32fbb/example/hello-populator/deploy.yaml
```
<!--
Your cluster now has a new CustomResourceDefinition that provides a test API named Hello.
Create an instance of the `Hello` custom resource, with some text:
-->
你的集群现在有一个新的 CustomResourceDefinition，它提供了一个名为 Hello 的测试 API。
创建一个 `Hello` 自定义资源的实例，内容如下：

```yaml
apiVersion: hello.example.com/v1alpha1
kind: Hello
metadata:
  name: example-hello
spec:
  fileName: example.txt
  fileContents: Hello, world!
```
<!--
Create a PVC that refers to that CR as its data source.
-->
创建一个将该 CR 引用为其数据源的 PVC。

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: example-pvc
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Mi
  dataSourceRef:
    apiGroup: hello.example.com
    kind: Hello
    name: example-hello
  volumeMode: Filesystem
```
<!--
Next, run a Job that reads the file in the PVC.
-->
接下来，运行一个读取 PVC 中文件的 Job。

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: example-job
spec:
  template:
    spec:
      containers:
        - name: example-container
          image: busybox:latest
          command:
            - cat
            - /mnt/example.txt
          volumeMounts:
            - name: vol
              mountPath: /mnt
      restartPolicy: Never
      volumes:
        - name: vol
          persistentVolumeClaim:
            claimName: example-pvc
```
<!--
Wait for the job to complete (including all of its dependencies).
-->
等待 Job 完成（包括其所有依赖项）。

```shell
kubectl wait --for=condition=Complete job/example-job
```

<!--
And last examine the log from the job.
-->
最后检查 Job 中的日志。

```shell
kubectl logs job/example-job
```
<!--
The output should be:
-->
输出应该是：

```terminal
Hello, world!
```
<!--
Note that the volume already contained a text file with the string contents from
the CR. This is only the simplest example. Actual populators can set up the volume
to contain arbitrary contents.
-->
请注意，该卷已包含一个文本文件，其中包含来自 CR 的字符串内容。这只是最简单的例子。
实际填充器可以将卷设置为包含任意内容。

<!--
## How to write your own volume populator
-->
## 如何编写自己的卷填充器

<!--
Developers interested in writing new poplators are encouraged to use the
[lib-volume-populator](https://github.com/kubernetes-csi/lib-volume-populator) library
and to only supply a small controller wrapper around the library, and a pod image
capable of attaching to volumes and writing the appropriate data to the volume.
-->
鼓励有兴趣编写新的填充器的开发人员使用
[lib-volume-populator](https://github.com/kubernetes-csi/lib-volume-populator) 库，
只提供一个小型控制器，以及一个能够连接到卷并向卷写入适当数据的 Pod 镜像。

<!--
Individual populators can be extremely generic such that they work with every type
of PVC, or they can do vendor specific things to rapidly fill a volume with data
if the volume was provisioned by a specific CSI driver from the same vendor, for
example, by communicating directly with the storage for that volume.
-->
单个填充器非常通用，它们可以与所有类型的 PVC 一起使用，
或者如果卷是来自同一供应商的特定 CSI 驱动程序供应的，
它们可以执行供应商特定的的操作以快速用数据填充卷，例如，通过通信直接使用该卷的存储。

<!--
## How can I learn more?
-->
## 我怎样才能了解更多？

<!--
The enhancement proposal,
[Volume Populators](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1495-volume-populators), includes lots of detail about the history and technical implementation
of this feature.
-->
增强提案，
[卷填充器](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1495-volume-populators)，
包含有关此功能的历史和技术实现的许多详细信息。

<!--
[Volume populators and data sources](/docs/concepts/storage/persistent-volumes/#volume-populators-and-data-sources), within the documentation topic about persistent volumes,
explains how to use this feature in your cluster.
-->
[卷填充器与数据源](/zh-cn/docs/concepts/storage/persistent-volumes/#volume-populators-and-data-sources),
在有关持久卷的文档主题中，解释了如何在集群中使用此功能。

<!--
Please get involved by joining the Kubernetes storage SIG to help us enhance this
feature. There are a lot of good ideas already and we'd be thrilled to have more!
-->
请加入 Kubernetes 的存储 SIG，帮助我们增强这一功能。这里已经有很多好的主意了，我们很高兴能有更多！

