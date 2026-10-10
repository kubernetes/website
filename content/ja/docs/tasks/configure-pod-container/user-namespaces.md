---
title: Podでユーザー名前空間を使用する
content_type: task
weight: 210
min-kubernetes-server-version: v1.25
---

<!-- overview -->
{{< feature-state feature_gate_name="UserNamespacesSupport" >}}

このページでは、Podにユーザー名前空間を設定する方法について説明します。
これにより、コンテナ内で実行されるユーザーをホスト上のユーザーから分離できます。

コンテナ内でrootとして実行されているプロセスは、ホスト上では別の(root以外の)ユーザーとして実行できます。
つまり、そのプロセスはユーザー名前空間内の操作に対しては完全な権限を持ちますが、名前空間外の操作に対しては権限を持ちません。

この機能を使うことで、コンテナが侵害された場合にホストや同じノード上の他のPodへの被害を軽減できます。
ユーザー名前空間が有効であれば悪用できなかったとされる、**HIGH**または**CRITICAL**と評価された[セキュリティ脆弱性][KEP-vulns]がいくつかあります。
ユーザー名前空間は将来の脆弱性の一部も軽減することが期待されています。

ユーザー名前空間を使用しない場合、rootとして実行されているコンテナが侵害されてホストに到達すると、ノード上でroot権限を持つことになります。
また、コンテナに何らかのケーパビリティが付与されていた場合、そのケーパビリティはホスト上でも有効です。
ユーザー名前空間を使用する場合、これらはいずれも当てはまりません。

[KEP-vulns]: https://github.com/kubernetes/enhancements/tree/217d790720c5aef09b8bd4d6ca96284a0affe6c2/keps/sig-node/127-user-namespaces#motivation

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% thirdparty-content single="true" %}}
<!-- if adding another runtime in the future, omit the single setting -->

* ノードのOSがLinuxであること
* ホスト上でコマンドを実行できること
* Podにexecで入れること
* `UserNamespacesSupport`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)を有効にすること

{{< note >}}
ユーザー名前空間を有効にするフィーチャーゲートは、ステートレスなPodのみがサポートされていた頃は`UserNamespacesStatelessPodsSupport`という名前でした。
Kubernetes v1.25からv1.27のみが`UserNamespacesStatelessPodsSupport`を認識します。
{{</ note >}}

使用するクラスターには、Podでユーザー名前空間を使用するための[要件](/docs/concepts/workloads/pods/user-namespaces/#before-you-begin)を満たすノードが少なくとも1つ含まれている**必要があります**。

ノードが混在しており、一部のノードのみがPodのユーザー名前空間をサポートしている場合は、ユーザー名前空間を使用するPodが適切なノードに[スケジュール](/docs/concepts/scheduling-eviction/assign-pod-node/)されるようにする必要もあります。

<!-- steps -->

## ユーザー名前空間を使用するPodを実行する {#create-pod}

Podのユーザー名前空間は、`.spec`の`hostUsers`フィールドを`false`に設定することで有効になります。
例:

{{% code_sample file="pods/user-namespaces-stateless.yaml" %}}

1. クラスター上にPodを作成します:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/user-namespaces-stateless.yaml
   ```

1. Pod内でexecし、`readlink /proc/self/ns/user`を実行します:

   ```shell
   kubectl exec -ti userns -- bash
   ```

次のコマンドを実行します:

```shell
readlink /proc/self/ns/user
```

出力は次のようになります:

```shell
user:[4026531837]
```

さらに次を実行します:

```shell
cat /proc/self/uid_map
```

出力は次のようになります:
```shell
0  833617920      65536
```

次に、ホスト上でシェルを開き、同じコマンドを実行します。

`readlink`コマンドは、プロセスが実行されているユーザー名前空間を表示します。
ホスト上とコンテナ内で実行した場合、異なる値になるはずです。

コンテナ内の`uid_map`ファイルの最後の数値は65536である必要があります。
ホスト上ではそれより大きい数値になります。

kubeletをユーザー名前空間内で実行している場合は、Pod内でコマンドを実行した出力を、ホスト上で次のコマンドを実行した出力と比較する必要があります:

```shell
readlink /proc/$pid/ns/user
```

`$pid`はkubeletのPIDに置き換えてください。
