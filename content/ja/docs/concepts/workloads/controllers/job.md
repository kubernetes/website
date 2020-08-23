---
title: Job
content_type: concept
feature:
  title: バッチ実行
  description: >
    Kubernetesはサービスに加えて、バッチやCIのワークロードを管理し、必要に応じて失敗したコンテナを置き換えることができます。
weight: 60
---

<!-- overview -->

Jobは1つ以上のPodを作成し、指定された数のPodが正常に終了することを保証します。
JobはPodの正常終了を追跡します。正常終了が指定された回数に達すると、そのタスク(つまりJob)は完了します。Jobを削除すると、そのJobが作成したPodがクリーンアップされます。

簡単な例としては、1つのPodを確実に実行して完了させるために、1つのJobオブジェクトを作成することです。
ノードのハードウェア障害やノードの再起動などにより最初のPodが失敗したり削除されたりした場合、Jobオブジェクトは新たなPodを立ち上げます。

また、Jobを使用して複数のPodを並行して実行することもできます。




<!-- body -->

## Jobの実行例

ここでは、Jobの設定例を示します。πの値を2000桁目まで計算して出力します。
完了までに10秒程度かかります。

{{< codenew file="controllers/job.yaml" >}}

このコマンドで例を実行できます。

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/job.yaml
```
```
job.batch/pi created
```

Jobのステータスは、`kubectl`を用いて確認します。

```shell
kubectl describe jobs/pi
```
```
Name:           pi
Namespace:      default
Selector:       controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
Labels:         controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
                job-name=pi
Annotations:    kubectl.kubernetes.io/last-applied-configuration:
                  {"apiVersion":"batch/v1","kind":"Job","metadata":{"annotations":{},"name":"pi","namespace":"default"},"spec":{"backoffLimit":4,"template":...
Parallelism:    1
Completions:    1
Start Time:     Mon, 02 Dec 2019 15:20:11 +0200
Completed At:   Mon, 02 Dec 2019 15:21:16 +0200
Duration:       65s
Pods Statuses:  0 Running / 1 Succeeded / 0 Failed
Pod Template:
  Labels:  controller-uid=c9948307-e56d-4b5d-8302-ae2d7b7da67c
           job-name=pi
  Containers:
   pi:
    Image:      perl
    Port:       <none>
    Host Port:  <none>
    Command:
      perl
      -Mbignum=bpi
      -wle
      print bpi(2000)
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason            Age   From            Message
  ----    ------            ----  ----            -------
  Normal  SuccessfulCreate  14m   job-controller  Created pod: pi-5rwd7
```

Jobの完了したPodを表示するには、`kubectl get pods`を使います。

あるJobに属するすべてのPodの一覧を機械可読な形式で出力するには、次のようなコマンドを使います。

```shell
pods=$(kubectl get pods --selector=job-name=pi --output=jsonpath='{.items[*].metadata.name}')
echo $pods
```
```
pi-5rwd7
```

ここでのセレクターは、Jobのセレクターと同じです。`--output=jsonpath`オプションは、返されたリストの各Podから名前だけを取得する式を指定します。


いずれかのPodの標準出力を表示します。

```shell
kubectl logs $pods
```
出力例は以下の通りです。
```shell
3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632788659361533818279682303019520353018529689957736225994138912497217752834791315155748572424541506959508295331168617278558890750983817546374649393192550604009277016711390098488240128583616035637076601047101819429555961989467678374494482553797747268471040475346462080466842590694912933136770289891521047521620569660240580381501935112533824300355876402474964732639141992726042699227967823547816360093417216412199245863150302861829745557067498385054945885869269956909272107975093029553211653449872027559602364806654991198818347977535663698074265425278625518184175746728909777727938000816470600161452491921732172147723501414419735685481613611573525521334757418494684385233239073941433345477624168625189835694855620992192221842725502542568876717904946016534668049886272327917860857843838279679766814541009538837863609506800642251252051173929848960841284886269456042419652850222106611863067442786220391949450471237137869609563643719172874677646575739624138908658326459958133904780275901
```

## Jobの仕様の作成

他のすべてのKubernetesの設定と同様に、Jobには`apiVersion`、`kind`、および`metadata`フィールドが必要です。
その名前は有効な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)である必要があります。

Jobには[`.spec`セクション](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)も必要です。

### Podテンプレート

`.spec.template`は、`.spec`の唯一の必須フィールドです。

`.spec.template`は[Podテンプレート](/ja/docs/concepts/workloads/pods/#pod-templates)です。
ネストされており、`apiVersion`や`kind`ないことを除けば、{{< glossary_tooltip text="Pod" term_id="pod" >}}とまったく同じスキーマを持ちます。

Podの必須フィールドに加えて、JobのPodテンプレートでは、適切なラベル([Podセレクター](#pod-selector)参照)と適切な再起動ポリシーを指定しなければなりません。

`Never`または`OnFailure`と等しい[`RestartPolicy`](/ja/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)のみが許可されます。

### Podセレクター {#pod-selector}

`.spec.selector`フィールドはオプションです。ほとんどの場合、指定すべきではありません。
セクション「[独自のPodセレクターの指定](#specifying-your-own-pod-selector)」を参照してください。


### Jobの並列実行 {#parallel-jobs}

Jobとして実行するのに適したタスクは、大きく分けて3つあります。

1. 非並列Job
   - 通常は、Podが失敗しない限り、1つのPodのみが起動されます。
   - そのPodが正常に終了するとすぐにJobが完了します。
2. *固定の完了数*を持つ並列Job
   - `.spec.completions`に、0以外の正の値を指定します。
   - Jobはタスク全体を表し、1から`.spec.completions`の範囲内の各値に対して、1つの成功したPodがあれば完了です。
   - **まだ実装されていません**が、各Podには、1から`.spec.completions`の範囲内で異なるインデックスが渡されます。
3. *ワークキュー*を持つ並列Job
   - `.spec.completions`は指定しません。デフォルトは`.spec.parallelism`です。
   - Podは、それぞれが何を処理するか決定するために、 Pod間または外部サービス間で調整する必要があります。例えば、あるPodはワークキューから最大N個のアイテムのバッチを取得します。
   - 各Podはすべてのピアが完了したかどうか、つまりJob全体が完了したかどうかを、独立して判断できます。
   - Jobの _任意の_ Podが正常終了すると、新しいPodは作成されません。
   - 少なくとも1つのPodが正常終了し、すべてのPodが終了すると、Jobは正常に完了します。
   - Podが正常終了した後は、他のPodがこのタスクの処理を行ったり、出力を書き込んだりしてはなりません。それらはすべて終了する必要があります。

_非並列_ Jobの場合、`.spec.completions`と`.spec.parallelism`の両方を未設定のままにすることができます。両方が設定されていない場合、どちらもデフォルトで1になります。

_ワークキュー_ を持つJobの場合、`.spec.completions`を未設定のままにし、`.spec.parallelism`を非負整数にする必要があります。


様々な種類のJobを利用する方法の詳細については、セクション「[Jobのパターン](#job-patterns)」をご覧ください。

#### 並列処理の制御

並列処理数(`.spec.parallelism`)については、任意の非負整数を設定できます。
指定しない場合、デフォルトで1になります。
0を指定した場合、並列処理数が増えるまで、Jobは実質的に一時停止されます。

以下に挙げる様々な理由から、実際の並列処理数(任意の時点で実行されるPodの数)が、要求された数より多い場合と少ない場合があります。

- _固定完了数_ を持つJobの場合、並行して実行されるPodの実際の数は、残りの完了数を超えることはありません。`.spec.parallelism`の大きい値は事実上無視されます。
- _ワークキュー_ を持つJobの場合、Podが成功しても新しいPodは開始されません。ただし、残りのPodは完了できます。
- Jobコントローラー({{< glossary_tooltip term_id="controller" >}})が反応する時間がない場合も考えられます。
- Jobコントローラーが何らかの理由(`ResourceQuota`がない、権限がないなど)でPodの作成に失敗した場合、要求された数よりも少ないPod数になる可能性があります。
- Jobコントローラーは、同じJob内で以前のPodが過剰に失敗したために、新しいPodの作成を調整する場合があります。
- Podをグレースフルにシャットダウンした場合、停止までに時間がかかります。

## Podおよびコンテナの障害の処理

Pod内のコンテナは、その中のプロセスが0以外の終了コードで終了した、またはメモリー制限を超えたためにコンテナが強制終了されたなど、さまざまな理由で失敗する可能性があります。これが発生し、`.spec.template.spec.restartPolicy = "OnFailure"`であ場合、Podはノードに残りますが、コンテナは再実行されます。したがって、プログラムはローカルで再起動するケースを処理するか、`.spec.template.spec.restartPolicy = "Never"`を指定する必要があります。
`restartPolicy`の詳細な情報は、[Podのライフサイクル](/ja/docs/concepts/workloads/pods/pod-lifecycle/#example-states)を参照してください。

さまざまな理由で、Pod全体が失敗することもあります。例えば、Podが(ノードのアップグレード、再起動、削除などにより)ノードから切り離された場合や、Podのコンテナが失敗して`.spec.template.spec.restartPolicy = "Never"`が設定されている場合などです。Podが失敗した場合、Jobコントローラーは新しいPodを開始します。つまり、アプリケーションは新しいPodで再起動されたケースを処理する必要があります。特に、前の実行によって発生した一時ファイル、ロック、不完全な出力などに対する処理が必要です。

たとえ`.spec.parallelism = 1`、`.spec.completions = 1`、`.spec.template.spec.restartPolicy = "Never"`を指定しても、同じプログラムが2回起動される場合があることに注意してください。

`.spec.parallelism`と`.spec.completions`の両方を1より大きい値に指定した場合は、複数のPodが同時に実行される可能性があります。したがって、Podは同時実行性にも対応する必要があります。

### Pod Backoff Failure Policy

構成の論理エラーなどが原因で、ある程度の再試行後にJobを失敗させたい場合があります。
そのためには、`.spec.backoffLimit`を設定して、Jobが失敗したと見なすまでの再試行回数を指定します。デフォルトでは6に設定されています。
失敗したPodは、6分を上限とする指数バックオフ遅延(10秒、20秒、40秒...)に従って、Jobコントローラーにより再作成されます。
JobのPodが削除されるか、Jobの他のPodがその時間に失敗することなく成功すると、バックオフカウントがリセットされます。

{{< note >}}
Jobに`restartPolicy = "OnFailure"`がある場合、Jobのバックオフ制限に達すると、Jobを実行しているコンテナが終了することに注意してください。これにより、Jobの実行可能ファイルのデバッグがより困難になる可能性があります。Jobのデバッグするまたはロギングシステムを使用する場合は、`restartPolicy = "Never"`を設定して、失敗したJobからの出力が誤って失われないようにすることをお勧めします。
{{< /note >}}

## Jobの終了とクリーンアップ

Jobが完了すると、Podは作成されなくなりますが、Podの削除も行われません。それらを保持しておくと、完了したPodのログを表示して、エラー、警告、またはその他の診断の出力を確認できます。
Jobオブジェクトは完了後も残るため、ステータスを表示できます。ステータスを確認した後、古いJobを削除するのはユーザーの責任です。`kubectl`(例えば`kubectl delete jobs/pi`や`kubectl delete -f ./job.yaml`)を用いてJobを削除してください。`kubectl`でJobを削除すると、Jobが作成したすべてのPodも削除されます。

デフォルトでは、Podが失敗する(`restartPolicy=Never`)かコンテナがエラーで終了する(`restartPolicy=OnFailure`)場合を除き、Jobは中断されずに実行されます。その時点でJobは上記の`.spec.backoffLimit`に従います。`.spec.backoffLimit`に達すると、Jobは失敗としてマークされ、実行中のPodはすべて終了されます。

Jobを終了する別の方法は、アクティブな期限を設定することです。
これを行うには、Jobの`.spec.activeDeadlineSeconds`フィールドを秒数に設定します
`activeDeadlineSeconds`は、作成されたPodの数に関係なく、Jobの期間に適用されます。
Jobが`activeDeadlineSeconds`に到達すると、実行中のすべてのPodが終了し、Jobのステータスは`type: Failed`および`reason: DeadlineExceeded`となります。

Jobの`.spec.activeDeadlineSeconds`は、`.spec.backoffLimit`よりも優先されることに注意してください。したがって、1つ以上の失敗したPodを再試行しているJobは、`backoffLimit`にまだ達していない場合でも、`activeDeadlineSeconds`で指定された制限時間に達すると、追加のPodをデプロイしません。

以下に例を挙げます。

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-with-timeout
spec:
  backoffLimit: 5
  activeDeadlineSeconds: 100
  template:
    spec:
      containers:
      - name: pi
        image: perl
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

Job内のJobの仕様と[Podテンプレートの仕様](/ja/docs/concepts/workloads/pods/init-containers/#detailed-behavior)の両方に`activeDeadlineSeconds`フィールドがあることに注意してください。このフィールドが適切なレベルに設定されていることを確認してください。

`restartPolicy`はPodに適用され、Job自体には適用されないことに注意してください。Jobのステータスが`type: Failed`になると、Jobの自動再起動は行われません。
つまり、 `.spec.activeDeadlineSeconds`と`.spec.backoffLimit`でアクティブ化されるJob終了のメカニズムは、手作業での介入が必要になるような永続的なJobの失敗を引き起こします。

## 終了したJobの自動クリーンアップ

終了したJobは、通常、もう必要ありません。それらをシステム内に保持すると、APIサーバーに負担がかかります。[CronJobs](/ja/docs/concepts/workloads/controllers/cron-jobs/)などの上位レベルのコントローラーによってJobが直接管理されている場合、指定された容量ベースのクリーンアップポリシーに基づいて、JobをCronJobsでクリーンアップできます。 

### 終了したJobのTTLメカニズム

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

完了したJob(`Complete`または`Failed`)を自動的にクリーンアップする別の方法は、[TTLコントローラー](/ja/docs/concepts/workloads/controllers/ttlafterfinished/)が提供するTTLメカニズムを使用して、完了したリソースを指定することです。Jobの`.spec.ttlSecondsAfterFinished`フィールドに指定します。

TTLコントローラーがJobをクリーンアップすると、Jobが連鎖的に削除されます。つまり、Podなどの依存オブジェクトがJobとともに削除されます。Jobが削除されるとき、ファイナライザーなどのライフサイクル保証が優先されることに注意してください。

例は以下の通りです。

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-with-ttl
spec:
  ttlSecondsAfterFinished: 100
  template:
    spec:
      containers:
      - name: pi
        image: perl
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
```

Job`pi-with-ttl`は、Jobが終了してから`100`秒後に自動的に削除される。

フィールドが`0`に設定されている場合は、Jobは終了後すぐに自動的に削除されます。フィールドが設定されていない場合は、このJobは終了後にTTLコントローラーによってクリーンアップされません。

このTTLメカニズムはアルファ版であり、`TTLAfterFinished`フィーチャーゲートであることに注意してください。詳細は[TTLコントローラー](/ja/docs/concepts/workloads/controllers/ttlafterfinished/)のドキュメントを参照してください。

## Jobのパターン {#job-patterns}

Jobオブジェクトは、Podの信頼性の高い並列実行をサポートするために使用できます。Jobオブジェクトは、科学的コンピューティングで一般的に見られるような、密接に通信する並列プロセスをサポートするようには設計されていません。しかし、独立しているが関連性のある*ワークアイテム*の集合の並列処理はサポートしています。

例えば送信する電子メール、レンダリングするフレーム、トランスコードするファイル、スキャンするNoSQLデータベースのキーの範囲などです。

複雑なシステムでは、複数の異なるワークアイテムの集合があるかもしれません。ここでは、ユーザーがまとめて管理したい作業項目の1つの集合(バッチJob)を考えています。

並列計算にはいくつかのパターンがあり、それぞれ長所と短所があります。
トレードオフは以下の通りです。

- 各ワークアイテムに1つのJobオブジェクトを使用する場合と、すべてのワークアイテムに1つのJobオブジェクトを使用する場合を比較すると、後者の方がワークアイテムの数が多い場合に適しています。前者では、ユーザーとシステムが大量のJobオブジェクトを管理するためのオーバーヘッドが発生します。
- 作成されたPodの数がワークアイテムの数に等しい場合と、各Podが複数のワークアイテムを処理する場合を比較すると、前者の方が一般的に既存のコードやコンテナへの変更が少ないです。後者は上記の項目と同様の理由で、大量のワークアイテムを処理するのに適しています。
- いくつかのアプローチでは、ワークキューを使用します。これはキューサービスを実行している必要があり、既存のプログラムやコンテナを変更してワークキューを使用するようにする必要があります。他のアプローチは、既存のコンテナ化されたアプリケーションに適応するのがさらに容易です。

ここでは、上記のトレードオフに対応するものを、2から4列目にまとめています。
パターン名は、例とより詳細な説明へのリンクでもあります。

|                            パターン名                                                            | 単一のJobオブジェクト | ワークアイテムよりPodが少ないか？ | アプリをそのまま使用するか？ |  Kube 1.1で動作するか？ |
| ----------------------------------------------------------------------------------------------- |:-----------------:|:---------------------------:|:-------------------:|:-------------------:|
| [Jobテンプレートを拡張する](/ja/docs/tasks/job/parallel-processing-expansion/)                      |                   |                             |          ✓          |          ✓          |
| [ワークアイテムごとにPodでキューを作成する](/ja/docs/tasks/job/coarse-parallel-processing-work-queue/) |         ✓         |                             |      場合による      |          ✓          |
| [Pod数が可変であるキューを作成する](/ja/docs/tasks/job/fine-parallel-processing-work-queue/)         |         ✓         |             ✓               |                     |          ✓          |
| 単一のJob静的な処理を割り当てる                                                                      |         ✓         |                             |          ✓          |                     |

完了数を`.spec.completions`で指定すると、Jobコントローラーが作成した各Podは同じ[`spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)を持ちます。つまり、あるタスクを実行するすべてのPodは、同じコマンドラインと同じイメージ、同じボリューム、そして(ほぼ)同じ環境変数を持ちます。これらのパターンは、Podが異なる処理を行うように配置するための様々な方法です。

以下の表では、パターンごとに必要な`.spec.parallelism`と`.spec.completions`の設定を示します。
ここで、`W`はワークアイテム数とします。

|                            パターン名                                                            | `.spec.completions` |  `.spec.parallelism` |
| ----------------------------------------------------------------------------------------------- |:-------------------:|:--------------------:|
| [Jobテンプレートを拡張する](/ja/docs/tasks/job/parallel-processing-expansion/)                      |          1          |     1とする必要あり      |
| [ワークアイテムごとにPodでキューを作成する](/ja/docs/tasks/job/coarse-parallel-processing-work-queue/) |          W          |        任意           |
| [Pod数が可変であるキューを作成する](/ja/docs/tasks/job/fine-parallel-processing-work-queue/)         |          1          |        任意          |
| 単一のJob静的な処理を割り当てる                                                                      |          W          |        任意           |


## 高度な使用方法

### 独自のPodセレクターを指定する {#specifying-your-own-pod-selector}

通常、Jobオブジェクトを作成する際には`.spec.selector`を指定しません。
システムのデフォルトのロジックで、Jobの作成時にこのフィールドを追加します。
セレクターの値は、他のJobと重複しないように選択されます。

しかし、場合によっては、この自動的に設定されるセレクターを上書きする必要があるかもしれません。
これを行うには、Jobの`.spec.selector`を指定します。

これを行う際には十分に注意が必要です。もし指定したラベルセレクターが、そのJobのPodに対して固有でなく、無関係なPodにマッチする場合、無関係なJobのPodが削除されたり、このJobが他のPodを完了したものとしてカウントしたり、一方または両方のJobがPodの作成や完了まで実行を拒否することがあります。
もし固有でないセレクターを選択した場合は、他のコントローラー(例えばレプリケーションコントローラーなど)やそのPodも予測不能な動作をする可能性があります。Kubernetesは`.spec.selector`を指定する際のミスを防ぐことはできません。

ここでは、この機能を使いたくなるようなケースの例をご紹介します。
`old`というJobがすでに実行されているとします。既存のPodを実行し続けたいが、作成した残りのPodには別のPodテンプレートを使用し、Jobには新しい名前を付けたいとします。
これらのフィールドは更新が不可能であるため、Jobを更新することはできません。
そのため、`kubectl delete jobs/old --cascade=false`を使って、`old`というJobを削除し、一方で _そのPodは実行したまま_ にします。
削除する前に、どのセレクターを使っているかメモしておきます。

```
kubectl get job old -o yaml
```
```
kind: Job
metadata:
  name: old
  ...
spec:
  selector:
    matchLabels:
      controller-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```
次に`new`という名前の新しいJobを作成し、同じセレクターを明示的に指定します。
既存のPodには`controller-uid=a8f3d00d-c6d2-11e5-9f87-42010af00002`というラベルが付いているので、それらも同様にJob`new`で制御されます。

システムが自動的に生成するセレクターを使用していないので、新しいJobでは`manualSelector: true`を指定する必要があります。

```
kind: Job
metadata:
  name: new
  ...
spec:
  manualSelector: true
  selector:
    matchLabels:
      controller-uid: a8f3d00d-c6d2-11e5-9f87-42010af00002
  ...
```

新しいJob自体は`a8f3d00d-c6d2-11e5-9f87-42010af00002`とは異なるuidを持つでしょう。
`manualSelector: true`を設定すると、あなたが何をしているかを知っていることをシステムに伝え、この不一致を許容するようにします。

## 代替案

### ベアPod

Podが実行されているノードが再起動したり障害が発生したりすると、Podは終了し、再起動されません。しかし、Jobは終了したPodを置き換えるために新しいPodを作成します。
このため、アプリケーションが単一のPodしか必要としない場合でも、ベアPodではなくJobを使用することをお勧めします。

### レプリケーションコントローラー

Jobは[レプリケーションコントローラー](/ja/docs/user-guide/replication-controller)を補完するものです。
レプリケーションコントローラーは終了が予想されないPod(例えばWebサーバー)を管理し、Jobは終了が予想されるPod(例えばバッチタスク)を管理します。

[Podのライフサイクル](/ja/docs/concepts/workloads/pods/pod-lifecycle/)で説明したように、`Job`は`RestartPolicy`が`OnFailure`または`Never`と等しいPodに対して*のみ*適切です。
(注意: `RestartPolicy`が設定されていない場合、デフォルト値は`Always`です。)

### 単一のJobでコントローラーPodを起動

もう一つのパターンは、単一のJobでPodを作成し、そのPodが他のPodを作成し、それらのPodに対するカスタムコントローラーのように動作するというものです。これは最も柔軟性がありますが、始めるのがやや複雑で、Kubernetesとの統合性が低いかもしれません。

このパターンの例として、Podを起動してスクリプトを実行するJobがSparkマスターコントローラー([Sparkの例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/spark/README.md)を参照)を起動し、Sparkドライバーを実行してからクリーンアップするというものがあります。

このアプローチの利点は、全体的なプロセスがJobオブジェクトが完了する保証を得ながらも、どのようなPodが作成され、どのように作業が割り当てられるかを完全に制御できることです。

## Cron Job {#cron-jobs}

Unixのツールである`cron`と同様に、指定した日時に実行されるJobを作成するために、[`CronJob`](/ja/docs/concepts/workloads/controllers/cron-jobs/)を使用することができます。
