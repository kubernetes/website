---
title: huge pageを管理する
content_type: task
description: クラスター内のスケジュール可能なリソースとしてhuge pageの設定と管理を行います。
---

<!-- overview -->
{{< feature-state state="stable" >}}

Kubernetesでは、事前割り当てされたhuge pageをPod内のアプリケーションに割り当てたり利用したりすることをサポートしています。このページでは、ユーザーがhuge pageを利用できるようにする方法について説明します。

## {{% heading "prerequisites" %}}

1. Kubernetesのノードがhuge pageのキャパシティを報告するためには、ノード上でhuge pageを事前割り当てしておく必要があります。1つのノードでは複数のサイズのhuge pageが事前割り当てできます。

ノードは、すべてのhuge pageリソースを、スケジュール可能なリソースとして自動的に探索・報告してくれます。

<!-- steps -->

## API

huge pageはコンテナレベルのリソース要求で`hugepages-<size>`という名前のリソースを指定することで利用できます。ここで、`<size>`は、特定のノード上でサポートされている整数値を使った最も小さなバイナリ表記です。たとえば、ノードが2048KiBと1048576KiBのページサイズをサポートしている場合、ノードはスケジュール可能なリソースとして、`hugepages-2Mi`と`hugepages-1Gi`の2つのリソースを公開します。CPUやメモリとは違い、huge pageはオーバーコミットをサポートしません。huge pageリソースをリクエストするときには、メモリやCPUリソースを同時にリクエストしなければならないことに注意してください。

1つのPodのspec内に書くことで、Podから複数のサイズのhuge pageを利用することもできます。その場合、すべてのボリュームマウントで`medium: HugePages-<hugepagesize>`という表記を使う必要があります。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: huge-pages-example
spec:
  containers:
  - name: example
    image: fedora:latest
    command:
    - sleep
    - inf
    volumeMounts:
    - mountPath: /hugepages-2Mi
      name: hugepage-2mi
    - mountPath: /hugepages-1Gi
      name: hugepage-1gi
    resources:
      limits:
        hugepages-2Mi: 100Mi
        hugepages-1Gi: 2Gi
        memory: 100Mi
      requests:
        memory: 100Mi
  volumes:
  - name: hugepage-2mi
    emptyDir:
      medium: HugePages-2Mi
  - name: hugepage-1gi
    emptyDir:
      medium: HugePages-1Gi
```

Podで1種類のサイズのhuge pageをリクエストするときだけは、`medium: HugePages`という表記を使うこともできます。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: huge-pages-example
spec:
  containers:
  - name: example
    image: fedora:latest
    command:
    - sleep
    - inf
    volumeMounts:
    - mountPath: /hugepages
      name: hugepage
    resources:
      limits:
        hugepages-2Mi: 100Mi
        memory: 100Mi
      requests:
        memory: 100Mi
  volumes:
  - name: hugepage
    emptyDir:
      medium: HugePages
```

- huge pageのrequestsはlimitsと等しくなければなりません。limitsを指定した場合にはこれがデフォルトですが、requestsを指定しなかった場合にはデフォルトではありません。
- huge pageはコンテナのスコープで隔離されるため、各コンテナにはそれぞれのcgroupサンドボックスの中でcontainer specでリクエストされた通りのlimitが設定されます。
- huge pageベースのEmptyDirボリュームは、Podがリクエストしたよりも大きなサイズのページメモリーを使用できません。
- `shmget()`に`SHM_HUGETLB`を指定して取得したhuge pageを使用するアプリケーションは、`/proc/sys/vm/hugetlb_shm_group`に一致する補助グループ(supplemental group)を使用して実行する必要があります。
- namespace内のhuge pageの使用量は、ResourceQuotaに対して`cpu`や`memory`のような他の計算リソースと同じように`hugepages-<size>`というトークンを使用することで制御できます。
- 複数のサイズのhuge pageのサポートはフィーチャーゲートによる設定が必要です。{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}と{{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}}上で、`HugePageStorageMediumSize`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を使用すると有効にできます(`--feature-gates=HugePageStorageMediumSize=true`)。
