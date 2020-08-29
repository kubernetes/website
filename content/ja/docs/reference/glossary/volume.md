---
title: ボリューム
id: volume
date: 2018-04-12
full_link: /docs/concepts/storage/volumes/
short_description: >
  Pod内のコンテナからアクセス可能なデータを含むディレクトリです。

aka: 
tags:
- core-object
- fundamental
---
 {{< glossary_tooltip text="Pod" term_id="pod" >}}内の{{< glossary_tooltip text="コンテナ" term_id="container" >}}からアクセス可能なデータを含むディレクトリです。

<!--more--> 

Kubernetesボリュームはボリュームを含むPodが存在する限り有効です。そのためボリュームはPod内で実行されるすべてのコンテナよりも長持ちし、コンテナの再起動後もデータは保持されます。

詳しくは[ストレージ](https://kubernetes.io/docs/concepts/storage/)をご覧下さい。
