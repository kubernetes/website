---
title: ファイナライザー
id: finalizer
date: 2021-07-07
full_link: /ja/docs/concepts/overview/working-with-objects/finalizers/
short_description: >
  削除対象としてマークされたオブジェクトを完全に削除する前に、特定の条件が満たされるまでKubernetesを待機させるための名前空間付きのキーです。

aka: 
tags:
- fundamental
- operation
---
ファイナライザーは、削除対象としてマークされたリソースを完全に削除する前に、特定の条件が満たされるまでKubernetesを待機させるための名前空間付きのキーです。
ファイナライザーは、削除されたオブジェクトが所有していたリソースをクリーンアップするように{{<glossary_tooltip text="コントローラー" term_id="controller">}}に警告します。

<!--more-->

Kubernetesにファイナライザーが指定されたオブジェクトを削除するように指示すると、Kubernetes APIはそのオブジェクトに`.metadata.deletionTimestamp`を追加し削除対象としてマークして、ステータスコード`202`(HTTP "Accepted")を返します。
コントロールプレーンやその他のコンポーネントがファイナライザーによって定義されたアクションを実行している間、対象のオブジェクトは終了中の状態のまま残っています。
それらのアクションが完了したら、そのコントローラーは関係しているファイナライザーを対象のオブジェクトから削除します。
`metadata.finalizers`フィールドが空になったら、Kubernetesは削除が完了したと判断しオブジェクトを削除します。

ファイナライザーはリソースの{{<glossary_tooltip text="ガベージコレクション" term_id="garbage-collection">}}を管理するために使うことができます。
例えば、コントローラーが対象のリソースを削除する前に関連するリソースやインフラをクリーンアップするためにファイナライザーを定義することができます。
