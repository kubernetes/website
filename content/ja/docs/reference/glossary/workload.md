---
title: ワークロード
id: workloads
date: 2019-02-13
full_link: /docs/concepts/workloads/
short_description: >
   ワークロードとは、Kubernetes上で実行中のアプリケーションです。

aka: 
tags:
- fundamental
---
   ワークロードとは、Kubernetes上で実行中のアプリケーションです。

<!--more--> 

異なる種類のワークロードやその一部を表すコアオブジェクトはさまざまなものがあり、DaemonSet、Deployment、Job、ReplicaSet、StatefulSetオブジェクトなどがあります。

たとえば、ウェブサーバーとデータベースを含むワークロードの場合、データベースを1つの{{< glossary_tooltip term_id="StatefulSet" >}}で実行し、ウェブサーバーを{{< glossary_tooltip term_id="Deployment" >}}で実行するという構成が考えられます。
