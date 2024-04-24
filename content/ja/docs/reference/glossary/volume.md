---
title: ボリューム
id: volume
date: 2018-04-12
full_link: /docs/concepts/storage/volumes/
short_description: >
  データを格納するディレクトリで、Pod内のコンテナからアクセス可能です。

aka:
tags:
- core-object
- fundamental
---
 データを格納するディレクトリで、{{< glossary_tooltip text="Pod" term_id="pod" >}}内の{{< glossary_tooltip text="コンテナ" term_id="container" >}}からアクセス可能です。

<!--more-->

Kubernetesボリュームはボリュームを含んだPodが存在する限り有効です。そのため、ボリュームはPod内で実行されるどのコンテナよりも長く存在し、コンテナが再起動してもボリューム内のデータは維持されます。

詳しくは[ストレージ](/ja/docs/concepts/storage/)をご覧ください。
