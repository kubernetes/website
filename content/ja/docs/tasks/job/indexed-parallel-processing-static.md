---
title: 静的な処理の割り当てを使用した並列処理のためのインデックス付きJob
content_type: task
min-kubernetes-server-version: v1.21
weight: 30
---

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

<!-- overview -->

この例では、複数の並列ワーカープロセスを使用するKubernetesのJobを実行します。各ワーカーは、それぞれが自分のPod内で実行される異なるコンテナです。Podはコントロールプレーンが自動的に設定する*インデックス値*を持ち、この値を利用することで、各Podは処理するタスク全体のどの部分を処理するのかを特定できます。

Podのインデックスは、{{< glossary_tooltip text="アノテーション" term_id="annotation" >}}内の`batch.kubernetes.io/job-completion-index`を整数値の文字列表現として利用できます。コンテナ化されたタスクプロセスがこのインデックスを取得できるようにするために、このアノテーションの値は[downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#the-downward-api)の仕組みを利用することで公開できます。利便性のために、コントロールプレーンは自動的にdownward APIを設定して、`JOB_COMPLETION_INDEX`環境変数にインデックスを公開します。

以下に、この例で実行するステップの概要を示します。

1. **completionのインデックスを使用してJobのマニフェストを定義する**。downward APIはPodのインデックスのアノテーションを環境変数またはファイルとしてコンテナに渡してくれます。
2. **そのマニフェストに基づいてインデックス付き(Indexed)のJobを開始する**。

## {{% heading "prerequisites" %}}

あらかじめ基本的な非並列の[Job](/docs/concepts/workloads/controllers/job/)の使用に慣れている必要があります。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

インデックス付きJobを作成できるようにするには、[APIサーバー](/docs/reference/command-line-tools-reference/kube-apiserver/)と[コントローラーマネージャー](/docs/reference/command-line-tools-reference/kube-controller-manager/)上で`IndexedJob`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効にしていることを確認してください。

<!-- steps -->

## アプローチを選択する

ワーカープログラムから処理アイテムにアクセスするには、いくつかの選択肢があります。

1. `JOB_COMPLETION_INDEX`環境変数を読み込む。Job{{< glossary_tooltip text="コントローラー" term_id="controller" >}}は、この変数をcompletion indexを含むアノテーションに自動的にリンクします。
1. completion indexを含むファイルを読み込む。
1. プログラムを修正できない場合、プログラムをスクリプトでラップし、上のいずれかの方法でインデックスを読み取り、プログラムが入力として使用できるものに変換する。

この例では、3番目のオプションを選択肢して、[rev](https://man7.org/linux/man-pages/man1/rev.1.html)ユーティリティを実行したいと考えているとしましょう。このプログラムはファイルを引数として受け取り、内容を逆さまに表示します。

```shell
rev data.txt
```

`rev`ツールは[`busybox`](https://hub.docker.com/_/busybox)コンテナイメージから利用できます。

これは単なる例であるため、各Podはごく簡単な処理(短い文字列を逆にする)をするだけです。現実のワークロードでは、たとえば、シーンデータをもとに60秒の動画を生成するというようなタスクを記述したJobを作成するかもしれません。ビデオレンダリングJobの各処理アイテムは、ビデオクリップの特定のフレームのレンダリングを行うものになるでしょう。その場合、インデックス付きの完了が意味するのは、クリップの最初からフレームをカウントすることで、Job内の各Podがレンダリングと公開をするのがどのフレームであるかがわかるということです。

## インデックス付きJobを定義する

以下は、completion modeとして`Indexed`を使用するJobのマニフェストの例です。

{{% codenew language="yaml" file="application/job/indexed-job.yaml" %}}

上記の例では、Jobコントローラーがすべてのコンテナに設定する組み込みの`JOB_COMPLETION_INDEX`環境変数を使っています。[initコンテナ](/ja/docs/concepts/workloads/pods/init-containers/)がインデックスを静的な値にマッピングし、その値をファイルに書き込み、ファイルを[emptyDir volume](/docs/concepts/storage/volumes/#emptydir)を介してワーカーを実行しているコンテナと共有します。オプションとして、インデックスとコンテナに公開するために[downward APIを使用して独自の環境変数を定義する](/ja/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)こともできます。[環境変数やファイルとして設定したConfigMap](/ja/docs/tasks/configure-pod-container/configure-pod-configmap/)から値のリストを読み込むという選択肢もあります。

他には、以下の例のように、直接[downward APIを使用してアノテーションの値をボリュームファイルとして渡す](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#store-pod-fields)こともできます。

{{% codenew language="yaml" file="application/job/indexed-job-vol.yaml" %}}

## Jobを実行する

次のコマンドでJobを実行します。

```shell
# このコマンドでは1番目のアプローチを使っています ($JOB_COMPLETION_INDEX に依存しています)
kubectl apply -f https://kubernetes.io/examples/application/job/indexed-job.yaml
```

このJobを作成したら、コントロールプレーンは指定した各インデックスごとに一連のPodを作成します。`.spec.parallelism`の値が同時に実行できるPodの数を決定し、`.spec.completions`の値がJobが作成するPodの合計数を決定します。

`.spec.parallelism`は`.spec.completions`より小さいため、コントロールプレーンは別のPodを開始する前に最初のPodの一部が完了するまで待機します。

Jobを作成したら、少し待ってから進行状況を確認します。

```shell
kubectl describe jobs/indexed-job
```

出力は次のようになります。

```
Name:              indexed-job
Namespace:         default
Selector:          controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
Labels:            controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
                   job-name=indexed-job
Annotations:       <none>
Parallelism:       3
Completions:       5
Start Time:        Thu, 11 Mar 2021 15:47:34 +0000
Pods Statuses:     2 Running / 3 Succeeded / 0 Failed
Completed Indexes: 0-2
Pod Template:
  Labels:  controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
           job-name=indexed-job
  Init Containers:
   input:
    Image:      docker.io/library/bash
    Port:       <none>
    Host Port:  <none>
    Command:
      bash
      -c
      items=(foo bar baz qux xyz)
      echo ${items[$JOB_COMPLETION_INDEX]} > /input/data.txt

    Environment:  <none>
    Mounts:
      /input from input (rw)
  Containers:
   worker:
    Image:      docker.io/library/busybox
    Port:       <none>
    Host Port:  <none>
    Command:
      rev
      /input/data.txt
    Environment:  <none>
    Mounts:
      /input from input (rw)
  Volumes:
   input:
    Type:       EmptyDir (a temporary directory that shares a pod's lifetime)
    Medium:
    SizeLimit:  <unset>
Events:
  Type    Reason            Age   From            Message
  ----    ------            ----  ----            -------
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-njkjj
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-9kd4h
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-qjwsz
  Normal  SuccessfulCreate  1s    job-controller  Created pod: indexed-job-fdhq5
  Normal  SuccessfulCreate  1s    job-controller  Created pod: indexed-job-ncslj
```

この例では、各インデックスごとにカスタムの値を使用してJobを実行します。次のコマンドでPodの1つの出力を確認できます。

```shell
kubectl logs indexed-job-fdhq5 # これを対象のJobのPodの名前に一致するように変更してください。
```

出力は次のようになります。

```
xuq
```
