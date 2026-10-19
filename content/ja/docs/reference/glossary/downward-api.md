---
title: Downward API
id: downward-api
short_description: >
  Podやコンテナのフィールドの値を、コンテナ内で実行されているコードに公開するための仕組みです。
aka:
full_link: /docs/concepts/workloads/pods/downward-api/
tags:
- architecture
---
Podやコンテナのフィールドの値を、コンテナ内で実行されているコードに公開するためのKubernetesの仕組みです。
<!--more-->
コンテナのコードをKubernetesに直接結合させるような変更を加えることなく、コンテナが自分自身についての情報を持つことは有用な場合があります。

KubernetesのDownward APIを用いることで、コンテナは自分自身やKubernetesクラスター内のコンテキストに関する情報を取得することができます。
コンテナ内のアプリケーションは、Kubernetes APIのクライアントとして動作することなく、その情報にアクセスできます。

実行中のコンテナにPodおよびコンテナフィールドを公開する方法は2つあります:

- [環境変数](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)を使用する
- [`downwardAPI`ボリューム](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)を使用する

これらPodおよびコンテナフィールドを公開する2つの方法を総称して、_downward API_ と呼びます。
