---
title: StatefulSet
id: statefulset
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/statefulset/
short_description: >
  Manages the deployment and scaling of a set of Pods, *and provides guarantees about the ordering and uniqueness* of these Pods.

aka: 
tags:
- fundamental
- core-object
- workload
- storage
---

StatefulSetはDeploymentと{{< glossary_tooltip text="Pod" term_id="pod" >}}のセットのスケーリングの管理をし、それらのPodの*順序とユニーク性を保証* します。

<!--more--> 

{{< glossary_tooltip term_id="deployment" >}}のように、StatefulSetは指定したコンテナのspecに基づいてPodを管理します。Deploymentとは異なり、StatefulSetは各Podにおいて管理が大変な同一性を維持します。これらのPodは同一のspecから作成されますが、それらは交換可能ではなく、リスケジュール処理をまたいで維持される永続的な識別子を持ちます。

StatefulSetは他のコントローラーと同様のパターンで動作します。ユーザーはStatefulSet*オブジェクト* の理想的な状態を定義し、StatefulSet*コントローラー* は現在の状態から、理想状態になるために必要なアップデートを行います。

