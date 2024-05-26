---
title: 拡張リソースをNodeにアドバタイズする
content_type: task
weight: 70
---

<!-- overview -->

このページでは、Nodeに対して拡張リソースを指定する方法を説明します。拡張リソースを利用すると、Kubernetesにとって未知のノードレベルのリソースをクラスター管理者がアドバタイズできるようになります。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Nodeの名前を取得する

```shell
kubectl get nodes
```

この練習で使いたいNodeを1つ選んでください。

## Nodeの1つで新しい拡張リソースをアドバタイズする

Node上の新しい拡張リソースをアドバタイズするには、HTTPのPATCHリクエストをKubernetes APIサーバーに送ります。たとえば、Nodeの1つに4つのドングルが接続されているとします。以下に、4つのドングルリソースをNodeにアドバタイズするPATCHリクエストの例を示します。

```shell
PATCH /api/v1/nodes/<選択したNodeの名前>/status HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
Host: k8s-master:8080

[
  {
    "op": "add",
    "path": "/status/capacity/example.com~1dongle",
    "value": "4"
  }
]
```

Kubernetesは、ドングルとは何かも、ドングルが何に利用できるのかを知る必要もないことに注意してください。上のPATCHリクエストは、ただNodeが4つのドングルと呼ばれるものを持っているとKubernetesに教えているだけです。

Kubernetes APIサーバーに簡単にリクエストを送れるように、プロキシを実行します。

```shell
kubectl proxy
```

もう1つのコマンドウィンドウを開き、HTTPのPATCHリクエストを送ります。`<選択したNodeの名前>`の部分は、選択したNodeの名前に置き換えてください。

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "add", "path": "/status/capacity/example.com~1dongle", "value": "4"}]' \
http://localhost:8001/api/v1/nodes/<選択したNodeの名前>/status
```

{{< note >}}
上のリクエストにある`~1`は、PATCHのパスにおける`/`という文字をエンコーディングしたものです。JSON-Patch内のoperationのpathはJSON-Pointerとして解釈されます。詳細については、[IETF RFC 6901](https://tools.ietf.org/html/rfc6901)のsection 3を読んでください。
{{< /note >}}

出力には、Nodeがキャパシティー4のdongleを持っていることが示されます。

```
"capacity": {
  "cpu": "2",
  "memory": "2049008Ki",
  "example.com/dongle": "4",
```

Nodeの説明を確認します。

```
kubectl describe node <選択したNodeの名前>
```

出力には、再びdongleリソースが表示されます。

```yaml
Capacity:
 cpu:  2
 memory:  2049008Ki
 example.com/dongle:  4
```

これで、アプリケーション開発者は特定の数のdongleをリクエストするPodを作成できるようになりました。詳しくは、[拡張リソースをコンテナに割り当てる](/ja/docs/tasks/configure-pod-container/extended-resource/)を読んでください。

## 議論

拡張リソースは、メモリやCPUリソースと同様のものです。たとえば、Nodeが持っている特定の量のメモリやCPUがNode上で動作している他のすべてのコンポーネントと共有されるのと同様に、Nodeが搭載している特定の数のdongleが他のすべてのコンポーネントと共有されます。そして、アプリケーション開発者が特定の量のメモリとCPUをリクエストするPodを作成できるのと同様に、Nodeが搭載している特定の数のdongleをリクエストするPodが作成できます。

拡張リソースはKubernetesには詳細を意図的に公開しないため、Kubernetesは拡張リソースの実体をまったく知りません。Kubernetesが知っているのは、Nodeが特定の数の拡張リソースを持っているということだけです。拡張リソースは整数値でアドバタイズしなければなりません。たとえば、Nodeは4つのdongleをアドバタイズできますが、4.5のdongleというのはアドバタイズできません。

### Storageの例

Nodeに800GiBの特殊なディスクストレージがあるとします。この特殊なストレージの名前、たとえばexample.com/special-storageという名前の拡張リソースが作れます。そして、そのなかの一定のサイズ、たとえば100GiBのチャンクをアドバタイズできます。この場合、Nodeはexample.com/special-storageという種類のキャパシティ8のリソースを持っているとアドバタイズします。

```yaml
Capacity:
 ...
 example.com/special-storage: 8
```

特殊なストレージに任意のサイズのリクエストを許可したい場合、特殊なストレージを1バイトのサイズのチャンクでアドバタイズできます。その場合、example.com/special-storageという種類の800Giのリソースとしてアドバタイズします。

```yaml
Capacity:
 ...
 example.com/special-storage:  800Gi
```

すると、コンテナは好きなバイト数の特殊なストレージを最大800Giまでリクエストできるようになります。

## クリーンアップ

以下に、dongleのアドバタイズをNodeから削除するPATCHリクエストを示します。

```
PATCH /api/v1/nodes/<選択したNodeの名前>/status HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
Host: k8s-master:8080

[
  {
    "op": "remove",
    "path": "/status/capacity/example.com~1dongle",
  }
]
```

Kubernetes APIサーバーに簡単にリクエストを送れるように、プロキシを実行します。

```shell
kubectl proxy
```

もう1つのコマンドウィンドウで、HTTPのPATCHリクエストを送ります。`<選択したNodeの名前>`の部分は、選択したNodeの名前に置き換えてください。

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "remove", "path": "/status/capacity/example.com~1dongle"}]' \
http://localhost:8001/api/v1/nodes/<選択したNodeの名前>/status
```

dongleのアドバタイズが削除されたことを検証します。

```
kubectl describe node <選択したNodeの名前> | grep dongle
```

(出力には何も表示されないはずです)

## {{% heading "whatsnext" %}}

### アプリケーション開発者向け

* [拡張リソースをコンテナに割り当てる](/ja/docs/tasks/configure-pod-container/extended-resource/)

### クラスター管理者向け

* [Namespaceに対してメモリの最小値と最大値の制約を設定する](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)
* [Namespaceに対してCPUの最小値と最大値の制約を設定する](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)



