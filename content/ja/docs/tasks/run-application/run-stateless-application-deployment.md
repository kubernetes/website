---
title: Deploymentを使用してステートレスアプリケーションを実行する
min-kubernetes-server-version: v1.9
content_type: tutorial
weight: 10
---

<!-- overview -->

このページでは、Kubernetes Deploymentオブジェクトを使用してアプリケーションを実行する方法を説明します。




## {{% heading "objectives" %}}


* nginx deploymentを作成します。
* kubectlを使ってdeploymentに関する情報を一覧表示します。
* deploymentを更新します。




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- lessoncontent -->

## nginx deploymentの作成と探検 {#creating-and-exploring-an-nginx-deployment}

Kubernetes Deploymentオブジェクトを作成することでアプリケーションを実行できます。また、YAMLファイルでDeploymentを記述できます。例えば、このYAMLファイルはnginx:1.14.2 Dockerイメージを実行するデプロイメントを記述しています:

{{% codenew file="application/deployment.yaml" %}}


1. YAMLファイルに基づいてDeploymentを作成します:

        kubectl apply -f https://k8s.io/examples/application/deployment.yaml

1. Deploymentに関する情報を表示します:

        kubectl describe deployment nginx-deployment

    出力はこのようになります:

        Name:     nginx-deployment
        Namespace:    default
        CreationTimestamp:  Tue, 30 Aug 2016 18:11:37 -0700
        Labels:     app=nginx
        Annotations:    deployment.kubernetes.io/revision=1
        Selector:   app=nginx
        Replicas:   2 desired | 2 updated | 2 total | 2 available | 0 unavailable
        StrategyType:   RollingUpdate
        MinReadySeconds:  0
        RollingUpdateStrategy:  1 max unavailable, 1 max surge
        Pod Template:
          Labels:       app=nginx
          Containers:
           nginx:
            Image:              nginx:1.14.2
            Port:               80/TCP
            Environment:        <none>
            Mounts:             <none>
          Volumes:              <none>
        Conditions:
          Type          Status  Reason
          ----          ------  ------
          Available     True    MinimumReplicasAvailable
          Progressing   True    NewReplicaSetAvailable
        OldReplicaSets:   <none>
        NewReplicaSet:    nginx-deployment-1771418926 (2/2 replicas created)
        No events.

1. Deploymentによって作成されたPodを一覧表示します:

        kubectl get pods -l app=nginx

    出力はこのようになります:

        NAME                                READY     STATUS    RESTARTS   AGE
        nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
        nginx-deployment-1771418926-r18az   1/1       Running   0          16h

1. Podに関する情報を表示します:

        kubectl describe pod <pod-name>

    ここで`<pod-name>`はPodの1つの名前を指定します。

## Deploymentの更新

新しいYAMLファイルを適用してDeploymentを更新できます。このYAMLファイルは、Deploymentを更新してnginx 1.16.1を使用するように指定しています。

{{% codenew file="application/deployment-update.yaml" %}}

1. 新しいYAMLファイルを適用します:

         kubectl apply -f https://k8s.io/examples/application/deployment-update.yaml

1. Deploymentが新しい名前でPodを作成し、古いPodを削除するのを監視します:

         kubectl get pods -l app=nginx

## レプリカ数を増やすことによるアプリケーションのスケール

新しいYAMLファイルを適用することで、Deployment内のPodの数を増やすことができます。このYAMLファイルは`replicas`を4に設定します。これはDeploymentが4つのPodを持つべきであることを指定します:

{{% codenew file="application/deployment-scale.yaml" %}}

1. 新しいYAMLファイルを適用します:

        kubectl apply -f https://k8s.io/examples/application/deployment-scale.yaml

1. Deploymentに4つのPodがあることを確認します:

        kubectl get pods -l app=nginx

    出力はこのようになります:

        NAME                               READY     STATUS    RESTARTS   AGE
        nginx-deployment-148880595-4zdqq   1/1       Running   0          25s
        nginx-deployment-148880595-6zgi1   1/1       Running   0          25s
        nginx-deployment-148880595-fxcez   1/1       Running   0          2m
        nginx-deployment-148880595-rwovn   1/1       Running   0          2m

## Deploymentの削除

Deploymentを名前を指定して削除します:

    kubectl delete deployment nginx-deployment

## ReplicationControllers -- 昔のやり方

複製アプリケーションを作成するための好ましい方法はDeploymentを使用することです。そして、DeploymentはReplicaSetを使用します。 DeploymentとReplicaSetがKubernetesに追加される前は、[ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/)を使用して複製アプリケーションを構成していました。




## {{% heading "whatsnext" %}}


* [Deploymentオブジェクト](/ja/docs/concepts/workloads/controllers/deployment/)の詳細




