---
title: ConfigMapを使ったRedisの設定
content_type: tutorial
---

<!-- overview -->

本ページでは、[ConfigMapを使ったコンテナの設定](/docs/tasks/configure-pod-container/configure-pod-configmap/)に基づき、ConfigMapを使ってRedisの設定を行う実践的な例を提供します。



## {{% heading "objectives" %}}


* 以下の要素を含む`kustomization.yaml`ファイルを作成する:
  * ConfigMapGenerator
  * ConfigMapを使ったPodリソースの設定
* `kubectl apply -k ./`コマンドにてディレクトリ全体を適用する
* 設定が正しく反映されていることを確認する



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* この例は、バージョン1.14以上での動作を確認しています。
* [ConfigMapを使ったコンテナの設定](/ja/docs/tasks/configure-pod-container/configure-pod-configmap/)を読んで理解しておいてください。



<!-- lessoncontent -->


## 実践例: ConfigMapを使ったRedisの設定

以下の手順に従って、ConfigMapに保存されているデータを使用してRedisキャッシュを設定できます。

最初に、`redis-config`ファイルからConfigMapを含む`kustomization.yaml`を作成します:

{{% codenew file="pods/config/redis-config" %}}

```shell
curl -OL https://k8s.io/examples/pods/config/redis-config

cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-redis-config
  files:
  - redis-config
EOF
```

Podリソースの設定を`kustomization.yaml`に入れます:

{{% codenew file="pods/config/redis-pod.yaml" %}}

```shell
curl -OL https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/pods/config/redis-pod.yaml

cat <<EOF >>./kustomization.yaml
resources:
- redis-pod.yaml
EOF
```

kustomizationディレクトリを反映して、ConfigMapオブジェクトとPodオブジェクトの両方を作成します:

```shell
kubectl apply -k .
```

作成されたオブジェクトを確認します
```shell
> kubectl get -k .
NAME                                        DATA   AGE
configmap/example-redis-config-dgh9dg555m   1      52s

NAME        READY   STATUS    RESTARTS   AGE
pod/redis   1/1     Running   0          52s
```

この例では、設定ファイルのボリュームは`/redis-master`にマウントされています。
`path`を使って`redis-config`キーを`redis.conf`という名前のファイルに追加します。
したがって、redisコンフィグのファイルパスは`/redis-master/redis.conf`です。
ここが、コンテナイメージがredisマスターの設定ファイルを探す場所です。

`kubectl exec`を使ってPodに入り、`redis-cli`ツールを実行して設定が正しく適用されたことを確認してください:

```shell
kubectl exec -it redis -- redis-cli
127.0.0.1:6379> CONFIG GET maxmemory
1) "maxmemory"
2) "2097152"
127.0.0.1:6379> CONFIG GET maxmemory-policy
1) "maxmemory-policy"
2) "allkeys-lru"
```

作成したPodを削除します:
```shell
kubectl delete pod redis
```



## {{% heading "whatsnext" %}}


* [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)について学ぶ

