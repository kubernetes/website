---
title: 単一レプリカのステートフルアプリケーションを実行する
content_template: templates/tutorial
weight: 20
---

{{% capture overview %}}

このページでは、PersistentVolumeとDeploymentを使用して、Kubernetesで単一レプリカのステートフルアプリケーションを実行する方法を説明します。アプリケーションはMySQLです。

{{% /capture %}}


{{% capture objectives %}}

* 自身の環境のディスクを参照するPersistentVolumeを作成します。
* MySQLのDeploymentを作成します。
* MySQLをDNS名でクラスター内の他のPodに公開します。

{{% /capture %}}


{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* {{< include "default-storage-class-prereqs.md" >}}

{{% /capture %}}


{{% capture lessoncontent %}}

## MySQLをデプロイする

Kubernetes Deploymentを作成し、PersistentVolumeClaimを使用して既存のPersistentVolumeに接続することで、ステートフルアプリケーションを実行できます。
たとえば、以下のYAMLファイルはMySQLを実行し、PersistentVolumeClaimを参照するDeploymentを記述しています。
このファイルは/var/lib/mysqlのボリュームマウントを定義してから、20Gのボリュームを要求するPersistentVolumeClaimを作成します。
この要求は、要件を満たす既存のボリューム、または動的プロビジョナーによって満たされます。

注：パスワードはYAMLファイル内に定義されており、これは安全ではありません。安全な解決策については[Kubernetes Secret](/docs/concepts/configuration/secret/)を参照してください 。

{{< codenew file="application/mysql/mysql-deployment.yaml" >}}
{{< codenew file="application/mysql/mysql-pv.yaml" >}}

1. YAMLファイルに記述されたPVとPVCをデプロイします。

        kubectl create -f https://k8s.io/examples/application/mysql/mysql-pv.yaml

1. YAMLファイルの内容をデプロイします。

        kubectl create -f https://k8s.io/examples/application/mysql/mysql-deployment.yaml

1. 作成したDeploymentの情報を表示します。

        kubectl describe deployment mysql

        Name:                 mysql
        Namespace:            default
        CreationTimestamp:    Tue, 01 Nov 2016 11:18:45 -0700
        Labels:               app=mysql
        Annotations:          deployment.kubernetes.io/revision=1
        Selector:             app=mysql
        Replicas:             1 desired | 1 updated | 1 total | 0 available | 1 unavailable
        StrategyType:         Recreate
        MinReadySeconds:      0
        Pod Template:
          Labels:       app=mysql
          Containers:
           mysql:
            Image:      mysql:5.6
            Port:       3306/TCP
            Environment:
              MYSQL_ROOT_PASSWORD:      password
            Mounts:
              /var/lib/mysql from mysql-persistent-storage (rw)
          Volumes:
           mysql-persistent-storage:
            Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
            ClaimName:  mysql-pv-claim
            ReadOnly:   false
        Conditions:
          Type          Status  Reason
          ----          ------  ------
          Available     False   MinimumReplicasUnavailable
          Progressing   True    ReplicaSetUpdated
        OldReplicaSets:       <none>
        NewReplicaSet:        mysql-63082529 (1/1 replicas created)
        Events:
          FirstSeen    LastSeen    Count    From                SubobjectPath    Type        Reason            Message
          ---------    --------    -----    ----                -------------    --------    ------            -------
          33s          33s         1        {deployment-controller }             Normal      ScalingReplicaSet Scaled up replica set mysql-63082529 to 1

1. Deploymentによって作成されたPodを一覧表示します。

        kubectl get pods -l app=mysql

        NAME                   READY     STATUS    RESTARTS   AGE
        mysql-63082529-2z3ki   1/1       Running   0          3m

1. PersistentVolumeClaimを確認します。

        kubectl describe pvc mysql-pv-claim

        Name:         mysql-pv-claim
        Namespace:    default
        StorageClass:
        Status:       Bound
        Volume:       mysql-pv-volume
        Labels:       <none>
        Annotations:    pv.kubernetes.io/bind-completed=yes
                        pv.kubernetes.io/bound-by-controller=yes
        Capacity:     20Gi
        Access Modes: RWO
        Events:       <none>

## MySQLインスタンスにアクセスする

前述のYAMLファイルは、クラスター内の他のPodがデータベースにアクセスできるようにするServiceを作成します。
Serviceのオプションで`clusterIP: None`を指定すると、ServiceのDNS名がPodのIPアドレスに直接解決されます。
このオプションは、ServiceのバックエンドのPodが1つのみであり、Podの数を増やす予定がない場合に適しています。

MySQLクライアントを実行してサーバーに接続します。

```
kubectl run -it --rm --image=mysql:5.6 --restart=Never mysql-client -- mysql -h mysql -ppassword
```

このコマンドは、クラスター内にMySQLクライアントを実行する新しいPodを作成し、Serviceを通じてMySQLサーバーに接続します。
接続できれば、ステートフルなMySQLデータベースが稼働していることが確認できます。

```
Waiting for pod default/mysql-client-274442439-zyp6i to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

mysql>
```

## アップデート

イメージまたはDeploymentの他の部分は、`kubectl apply`コマンドを使用して通常どおりに更新できます。
ステートフルアプリケーションに固有のいくつかの注意事項を以下に記載します。

* アプリケーションをスケールしないでください。このセットアップは単一レプリカのアプリケーション専用です。
  下層にあるPersistentVolumeは1つのPodにしかマウントできません。
  クラスター化されたステートフルアプリケーションについては、[StatefulSetのドキュメント](/docs/concepts/workloads/controllers/statefulset/)を参照してください。
* Deploymentを定義するYAMLファイルでは`strategy: type: Recreate`を使用して下さい。
  この設定はKubernetesにローリングアップデートを使用 _しない_ ように指示します。
  同時に複数のPodを実行することはできないため、ローリングアップデートは使用できません。
  `Recreate`戦略は、更新された設定で新しいPodを作成する前に、最初のPodを停止します。

## Deploymentの削除

名前を指定してデプロイしたオブジェクトを削除します。

```
kubectl delete deployment,svc mysql
kubectl delete pvc mysql-pv-claim
kubectl delete pv mysql-pv-volume
```

PersistentVolumeを手動でプロビジョニングした場合は、PersistentVolumeを手動で削除し、また、下層にあるリソースも解放する必要があります。
動的プロビジョニング機能を使用した場合は、PersistentVolumeClaimを削除すれば、自動的にPersistentVolumeも削除されます。
一部の動的プロビジョナー(EBSやPDなど)は、PersistentVolumeを削除すると同時に下層にあるリソースも解放します。

{{% /capture %}}


{{% capture whatsnext %}}

* [Deploymentオブジェクト](/docs/concepts/workloads/controllers/deployment/)についてもっと学ぶ

* [アプリケーションのデプロイ](/docs/user-guide/deploying-applications/)についてもっと学ぶ

* [kubectl runのドキュメント](/docs/reference/generated/kubectl/kubectl-commands/#run)

* [Volumes](/docs/concepts/storage/volumes/)と[Persistent Volumes](/docs/concepts/storage/persistent-volumes/)

{{% /capture %}}


