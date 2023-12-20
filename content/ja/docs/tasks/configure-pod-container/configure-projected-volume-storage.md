---
title: ストレージにProjectedボリュームを使用するようPodを設定する
content_type: task
weight: 100
---

<!-- overview -->
このページでは、[`projected`](/docs/concepts/storage/volumes/#projected)(投影)ボリュームを使用して、既存の複数のボリュームソースを同一ディレクトリ内にマウントする方法を説明します。
現在、`secret`、`configMap`、`downwardAPI`および`serviceAccountToken`ボリュームを投影できます。

{{< note >}}
`serviceAccountToken`はボリュームタイプではありません。
{{< /note >}}


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->
## ProjectedボリュームをPodに設定する

この課題では、ローカルファイルからユーザーネームおよびパスワードの{{< glossary_tooltip text="Secret" term_id="secret" >}}を作成します。
次に、単一のコンテナを実行するPodを作成し、[`projected`](/docs/concepts/storage/volumes/#projected)ボリュームを使用してそれぞれのSecretを同じ共有ディレクトリにマウントします。

以下にPodの設定ファイルを示します:

{{% codenew file="pods/storage/projected.yaml" %}}

1. Secretを作成します:

    ```shell
    # ユーザーネームおよびパスワードを含むファイルを作成します:
    echo -n "admin" > ./username.txt
    echo -n "1f2d1e2e67df" > ./password.txt

    # これらのファイルからSecretを作成します:
    kubectl create secret generic user --from-file=./username.txt
    kubectl create secret generic pass --from-file=./password.txt
    ```
1. Podを作成します:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/storage/projected.yaml
    ```
1. Pod内のコンテナが実行されていることを確認するため、Podの変更を監視します:

    ```shell
    kubectl get --watch pod test-projected-volume
    ```
    出力は次のようになります:
    ```
    NAME                    READY     STATUS    RESTARTS   AGE
    test-projected-volume   1/1       Running   0          14s
    ```
1. 別の端末にて、実行中のコンテナへのシェルを取得します:

    ```shell
    kubectl exec -it test-projected-volume -- /bin/sh
    ```
1. シェル内にて、投影されたソースを含む`projected-volume`ディレクトリが存在することを確認します:

    ```shell
    ls /projected-volume/
    ```

## クリーンアップ

PodおよびSecretを削除します:

```shell
kubectl delete pod test-projected-volume
kubectl delete secret user pass
```



## {{% heading "whatsnext" %}}

* [`projected`](/docs/concepts/storage/volumes/#projected)ボリュームについてさらに学ぶ
* [all-in-oneボリューム](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/node/all-in-one-volume.md)のデザインドキュメントを読む

