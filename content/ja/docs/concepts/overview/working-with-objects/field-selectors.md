---
title: フィールドセレクター(Field Selectors)
weight: 60
---

_フィールドセレクター(Field Selectors)_ は、1つかそれ以上のリソースフィールドの値を元に[Kubernetesリソースを選択](/docs/concepts/overview/working-with-objects/kubernetes-objects)するためのものです。  
フィールドセレクタークエリの例は以下の通りです。  

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`  

下記の`kubectl`コマンドは、[`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)フィールドの値が`Running`である全てのPodを選択します。  

```shell
kubectl get pods --field-selector status.phase=Running
```

{{< note >}}
フィールドセレクターは本質的にリソースの*フィルター*となります。デフォルトでは、セレクター/フィルターが指定されていない場合は、全てのタイプのリソースが取得されます。これは、下記の2つの`kubectl`クエリが同じであることを意味します。  

```shell
kubectl get pods
kubectl get pods --field-selector ""
```
{{< /note >}}

## サポートされているフィールド
サポートされているフィールドセレクターはKubernetesリソースタイプによって異なります。全てのリソースタイプは`metadata.name`と`metadata.namespace`フィールドをサポートしています。サポートされていないフィールドセレクターの使用をするとエラーとなります。  
例えば以下の通りです。  

```shell
kubectl get ingress --field-selector foo.bar=baz
```

```
Error from server (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```

## サポートされているオペレーター

ユーザーは、`=`、`==`や`!=`といったオペレーターをフィールドセレクターと組み合わせて使用できます。(`=`と`==`は同義)  
例として、下記の`kubectl`コマンドは`default`ネームスペースに属していない全てのKubernetes Serviceを選択します。

```shell
kubectl get services --field-selector metadata.namespace!=default
```

## 連結されたセレクター
[ラベル](/docs/concepts/overview/working-with-objects/labels)や他のセレクターと同様に、フィールドセレクターはコンマ区切りのリストとして連結することができます。  
下記の`kubectl`コマンドは、`status.phase`が`Runnning`でなく、かつ`spec.restartPolicy`フィールドが`Always`に等しいような全てのPodを選択します。  

```shell
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

## 複数のリソースタイプ

ユーザーは複数のリソースタイプにまたがったフィールドセレクターを利用できます。  
下記の`kubectl`コマンドは、`default`ネームスペースに属していない全てのStatefulSetとServiceを選択します。  

```shell
kubectl get statefulsets,services --field-selector metadata.namespace!=default
```