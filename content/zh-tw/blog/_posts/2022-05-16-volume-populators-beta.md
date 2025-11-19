---
layout: blog
title: "Kubernetes 1.24: 卷填充器功能進入 Beta 階段"
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
卷填充器功能現在已經經歷兩個發行版本並進入 Beta 階段！
在 Kubernetes v1.24 中 `AnyVolumeDataSource` 特性門控默認被啓用。
這意味着使用者可以指定任何自定義資源作爲 PVC 的數據源。

<!--
An [earlier blog article](/blog/2021/08/30/volume-populators-redesigned/) detailed how the
volume populators feature works. In short, a cluster administrator can install a CRD and
associated populator controller in the cluster, and any user who can create instances of 
the CR can create pre-populated volumes by taking advantage of the populator.
-->
[之前的一篇博客](/blog/2021/08/30/volume-populators-redesigned/)詳細介紹了卷填充器功能的工作原理。
簡而言之，叢集管理員可以在叢集中安裝 CRD 和相關的填充器控制器，
任何可以創建 CR 實例的使用者都可以利用填充器創建預填充卷。

<!--
Multiple populators can be installed side by side for different purposes. The SIG storage
community is already seeing some implementations in public, and more prototypes should
appear soon.
-->
出於不同的目的，可以一起安裝多個填充器。存儲 SIG 社區已經有了一些公開的實現，更多原型應該很快就會出現。

<!--
Cluster administrations are **strongly encouraged** to install the
volume-data-source-validator controller and associated `VolumePopulator` CRD before installing
any populators so that users can get feedback about invalid PVC data sources.
-->
**強烈建議**叢集管理人員在安裝任何填充器之前安裝 volume-data-source-validator 控制器和相關的
`VolumePopulator` CRD，以便使用者可以獲得有關無效 PVC 數據源的反饋。

<!--
## New Features
-->
## 新功能

<!--
The [lib-volume-populator](https://github.com/kubernetes-csi/lib-volume-populator) library
on which populators are built now includes metrics to help operators monitor and detect
problems. This library is now beta and latest release is v1.0.1.
-->
構建填充器的 [lib-volume-populator](https://github.com/kubernetes-csi/lib-volume-populator)
庫現在包含可幫助操作員監控和檢測問題的指標。這個庫現在是 beta 階段，最新版本是 v1.0.1。

<!--
The [volume data source validator](https://github.com/kubernetes-csi/volume-data-source-validator)
controller also has metrics support added, and is in beta. The `VolumePopulator` CRD is
beta and the latest release is v1.0.1.
-->
[卷數據源校驗器](https://github.com/kubernetes-csi/volume-data-source-validator)控制器也添加了指標支持，
處於 beta 階段。`VolumePopulator` CRD 是 beta 階段，最新版本是 v1.0.1。

<!--
## Trying it out
-->
## 嘗試一下

<!--
To see how this works, you can install the sample "hello" populator and try it
out.
-->
要查看它是如何工作的，你可以安裝 “hello” 示例填充器並嘗試一下。

<!--
First install the volume-data-source-validator controller.
-->
首先安裝 volume-data-source-validator 控制器。

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/volume-data-source-validator/v1.0.1/client/config/crd/populator.storage.k8s.io_volumepopulators.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/volume-data-source-validator/v1.0.1/deploy/kubernetes/rbac-data-source-validator.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/volume-data-source-validator/v1.0.1/deploy/kubernetes/setup-data-source-validator.yaml
```
<!--
Next install the example populator.
-->
接下來安裝 hello 示例填充器。

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/lib-volume-populator/v1.0.1/example/hello-populator/crd.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes-csi/lib-volume-populator/87a47467b86052819e9ad13d15036d65b9a32fbb/example/hello-populator/deploy.yaml
```
<!--
Your cluster now has a new CustomResourceDefinition that provides a test API named Hello.
Create an instance of the `Hello` custom resource, with some text:
-->
你的叢集現在有一個新的 CustomResourceDefinition，它提供了一個名爲 Hello 的測試 API。
創建一個 `Hello` 自定義資源的實例，內容如下：

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
創建一個將該 CR 引用爲其數據源的 PVC。

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
接下來，運行一個讀取 PVC 中文件的 Job。

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
等待 Job 完成（包括其所有依賴項）。

```shell
kubectl wait --for=condition=Complete job/example-job
```

<!--
And last examine the log from the job.
-->
最後檢查 Job 中的日誌。

```shell
kubectl logs job/example-job
```
<!--
The output should be:
-->
輸出應該是：

```terminal
Hello, world!
```
<!--
Note that the volume already contained a text file with the string contents from
the CR. This is only the simplest example. Actual populators can set up the volume
to contain arbitrary contents.
-->
請注意，該卷已包含一個文本文件，其中包含來自 CR 的字符串內容。這只是最簡單的例子。
實際填充器可以將卷設置爲包含任意內容。

<!--
## How to write your own volume populator
-->
## 如何編寫自己的卷填充器

<!--
Developers interested in writing new poplators are encouraged to use the
[lib-volume-populator](https://github.com/kubernetes-csi/lib-volume-populator) library
and to only supply a small controller wrapper around the library, and a pod image
capable of attaching to volumes and writing the appropriate data to the volume.
-->
鼓勵有興趣編寫新的填充器的開發人員使用
[lib-volume-populator](https://github.com/kubernetes-csi/lib-volume-populator) 庫，
只提供一個小型控制器，以及一個能夠連接到卷並向卷寫入適當數據的 Pod 映像檔。

<!--
Individual populators can be extremely generic such that they work with every type
of PVC, or they can do vendor specific things to rapidly fill a volume with data
if the volume was provisioned by a specific CSI driver from the same vendor, for
example, by communicating directly with the storage for that volume.
-->
單個填充器非常通用，它們可以與所有類型的 PVC 一起使用，
或者如果卷是來自同一供應商的特定 CSI 驅動程序供應的，
它們可以執行供應商特定的的操作以快速用數據填充卷，例如，通過通信直接使用該卷的存儲。

<!--
## How can I learn more?
-->
## 我怎樣才能瞭解更多？

<!--
The enhancement proposal,
[Volume Populators](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1495-volume-populators), includes lots of detail about the history and technical implementation
of this feature.
-->
增強提案，
[卷填充器](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1495-volume-populators)，
包含有關此功能的歷史和技術實現的許多詳細信息。

<!--
[Volume populators and data sources](/docs/concepts/storage/persistent-volumes/#volume-populators-and-data-sources), within the documentation topic about persistent volumes,
explains how to use this feature in your cluster.
-->
[卷填充器與數據源](/zh-cn/docs/concepts/storage/persistent-volumes/#volume-populators-and-data-sources),
在有關持久卷的文檔主題中，解釋瞭如何在叢集中使用此功能。

<!--
Please get involved by joining the Kubernetes storage SIG to help us enhance this
feature. There are a lot of good ideas already and we'd be thrilled to have more!
-->
請加入 Kubernetes 的存儲 SIG，幫助我們增強這一功能。這裏已經有很多好的主意了，我們很高興能有更多！

