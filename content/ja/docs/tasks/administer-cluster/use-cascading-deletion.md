---
title: クラスターでカスケード削除を使用する
content_type: task
weight: 360
---

<!--overview-->

このページでは、{{<glossary_tooltip text="ガベージコレクション" term_id="garbage-collection">}}中にクラスターで使用する[カスケード削除](/ja/docs/concepts/architecture/garbage-collection/#cascading-deletion)のタイプを指定する方法を示します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

また、さまざまな種類のカスケード削除を試すために、[サンプルのDeploymentを作成する](/ja/docs/tasks/run-application/run-stateless-application-deployment/#creating-and-exploring-an-nginx-deployment)必要があります。 タイプごとにDeploymentを再作成する必要があります。

## Podのオーナーリファレンスを確認する {#check-owner-references-on-your-pods}

Podに`ownerReferences`フィールドが存在することを確認します:

```shell
kubectl get pods -l app=nginx --output=yaml
```

出力には、次のように`ownerReferences`フィールドがあります。

```yaml
apiVersion: v1
    ...
    ownerReferences:
    - apiVersion: apps/v1
      blockOwnerDeletion: true
      controller: true
      kind: ReplicaSet
      name: nginx-deployment-6b474476c4
      uid: 4fdcd81c-bd5d-41f7-97af-3a3b759af9a7
    ...
```

## フォアグラウンドカスケード削除を使用する {#use-foreground-cascading-deletion}

デフォルトでは、Kubernetesは[バックグラウンドカスケード削除](/ja/docs/concepts/architecture/garbage-collection/#background-deletion)を使用して、オブジェクトの依存関係を削除します。
クラスターが動作しているKubernetesのバージョンに応じて、`kubectl`またはKubernetes APIのいずれかを使用して、フォアグラウンドカスケード削除に切り替えることができます。 {{<version-check>}}

`kubectl`またはKubernetes APIを使用して、フォアグラウンドカスケード削除を使用してオブジェクトを削除することができます。

**kubectlを使用する**

以下のコマンドを実行してください:
<!--TODO: verify release after which the --cascade flag is switched to a string in https://github.com/kubernetes/kubectl/commit/fd930e3995957b0093ecc4b9fd8b0525d94d3b4e-->


```shell
kubectl delete deployment nginx-deployment --cascade=foreground
```

**Kubernetes APIを使用する**

1. ローカルプロキシセッションを開始します:

   ```shell
   kubectl proxy --port=8080
   ```

1. 削除のトリガーとして`curl`を使用します:

   ```shell
   curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/deployments/nginx-deployment \
       -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
       -H "Content-Type: application/json"
   ```

   出力には、次のように`foregroundDeletion`{{<glossary_tooltip text="ファイナライザー" term_id="finalizer">}}が含まれています。

   ```
   "kind": "Deployment",
   "apiVersion": "apps/v1",
   "metadata": {
       "name": "nginx-deployment",
       "namespace": "default",
       "uid": "d1ce1b02-cae8-4288-8a53-30e84d8fa505",
       "resourceVersion": "1363097",
       "creationTimestamp": "2021-07-08T20:24:37Z",
       "deletionTimestamp": "2021-07-08T20:27:39Z",
       "finalizers": [
         "foregroundDeletion"
       ]
       ...
   ```

## バッググラウンドカスケード削除を使用する {#use-background-cascading-deletion}

1. [サンプルのDeploymentを作成する](/ja/docs/tasks/run-application/run-stateless-application-deployment/#creating-and-exploring-an-nginx-deployment)。
1. クラスターが動作しているKubernetesのバージョンに応じて、`kubectl`またはKubernetes APIのいずれかを使用してDeploymentを削除します。{{<version-check>}}

`kubectl`またはKubernetes APIを使用して、バックグラウンドカスケード削除を使用してオブジェクトを削除できます。

Kubernetesはデフォルトでバックグラウンドカスケード削除を使用し、`--cascade`フラグまたは`propagationPolicy`引数なしで以下のコマンドを実行した場合も同様です。

**kubectlを使用する**

以下のコマンドを実行してください:

```shell
kubectl delete deployment nginx-deployment --cascade=background
```

**Kubernetes APIを使用する**

1. ローカルプロキシセッションを開始します:

   ```shell
   kubectl proxy --port=8080
   ```

1. 削除のトリガーとして`curl`を使用します:

   ```shell
   curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/deployments/nginx-deployment \
       -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Background"}' \
       -H "Content-Type: application/json"
   ```

   出力は、次のようになります。

   ```
   "kind": "Status",
   "apiVersion": "v1",
   ...
   "status": "Success",
   "details": {
       "name": "nginx-deployment",
       "group": "apps",
       "kind": "deployments",
       "uid": "cc9eefb9-2d49-4445-b1c1-d261c9396456"
   }
   ```


## オーナーオブジェクトの削除と従属オブジェクトの孤立 {#set-orphan-deletion-policy}

デフォルトでは、Kubernetesにオブジェクトの削除を指示すると、{{<glossary_tooltip text="コントローラー" term_id="controller">}}は従属オブジェクトも削除します。クラスターが動作しているKubernetesのバージョンに応じて、`kubectl`またはKubernetes APIを使用して、これらの従属オブジェクトをKubernetesで*orphan*にすることができます。{{<version-check>}}

**kubectlを使用する**

以下のコマンドを実行してください:

```shell
kubectl delete deployment nginx-deployment --cascade=orphan
```

**Kubernetes APIを使用する**

1. ローカルプロキシセッションを開始します:

   ```shell
   kubectl proxy --port=8080
   ```

1. 削除のトリガーとして`curl`を使用します:

   ```shell
   curl -X DELETE localhost:8080/apis/apps/v1/namespaces/default/deployments/nginx-deployment \
       -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
       -H "Content-Type: application/json"
   ```

   出力には、次のように`finalizers`フィールドに`orphan`が含まれます。

   ```
   "kind": "Deployment",
   "apiVersion": "apps/v1",
   "namespace": "default",
   "uid": "6f577034-42a0-479d-be21-78018c466f1f",
   "creationTimestamp": "2021-07-09T16:46:37Z",
   "deletionTimestamp": "2021-07-09T16:47:08Z",
   "deletionGracePeriodSeconds": 0,
   "finalizers": [
     "orphan"
   ],
   ...
   ```

Deploymentによって管理されているPodがまだ実行中であることを確認できます。

```shell
kubectl get pods -l app=nginx
```

## {{% heading "whatsnext" %}}

* Kubernetesの[オーナーと従属](/ja/docs/concepts/overview/working-with-objects/owners-dependents/)について学ぶ。
* Kubernetes [ファイナライザー(Finalizers)](/ja/docs/concepts/overview/working-with-objects/finalizers/)について学ぶ。
* [ガベージコレクション](/ja/docs/concepts/architecture/garbage-collection/)について学ぶ。
