---
layout: blog
title: "フォレンジックコンテナ分析"
date: 2023-03-10
slug: forensic-container-analysis
author: >
  Adrian Reber (Red Hat)
---

前回投稿した[Kubernetesにおけるフォレンジックコンテナチェックポイント処理][forensic-blog]では、Kubernetesでのチェックポイントの作成や、それがどのようにセットアップされ、どのように使用されるのかを紹介しました。
機能の名前はフォレンジックコンテナチェックポイントですが、Kubernetesによって作成されたチェックポイントの実際の分析方法については、詳細を説明しませんでした。
この記事では、チェックポイントがどのように分析されるのかについての詳細を提供します。

チェックポイントの作成はまだKubernetesでalpha機能であり、この記事ではその機能が将来どのように動作するのかについてのプレビューを提供します。

## 準備

チェックポイント作成のサポートを有効にするためのKubernetesの設定方法や、基盤となるCRI実装方法についての詳細は[Kubernetesにおけるフォレンジックコンテナチェックポイント処理][forensic-blog]を参照してください。

一例として、この記事内でチェックポイントを作成し分析するコンテナイメージ(`quay.io/adrianreber/counter:blog`)を準備しました。
このコンテナはコンテナ内でファイルを作成することができ、後でチェックポイント内で探したい情報をメモリーに格納しておくこともできます。

コンテナを実行するためにはPodが必要であり、この例では下記のPodマニフェストを使用します。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: counters
spec:
  containers:
  - name: counter
    image: quay.io/adrianreber/counter:blog
```

この結果、`counter`と呼ばれるコンテナが`counters`と呼ばれるPod内で実行されます。

一度コンテナが実行されると、コンテナで下記アクションが行えます。

```console
$ kubectl get pod counters --template '{{.status.podIP}}'
10.88.0.25
$ curl 10.88.0.25:8088/create?test-file
$ curl 10.88.0.25:8088/secret?RANDOM_1432_KEY
$ curl 10.88.0.25:8088
```

最初のアクセスはコンテナ内で`test-file`という内容で`test-file`と呼ばれるファイルを作成します。
次のアクセスで、コンテナのメモリー内のどこかにシークレット情報(`RANDOM_1432_KEY`)を記憶します。
最後のアクセスは内部のログファイルに1行追加するだけです。

チェックポイントを分析する前の最後のステップは、チェックポイントを作成することをKubernetesに指示することです。
前回の記事で説明したように、これには*kubelet*限定の`チェックポイント`APIエンドポイントへのアクセスを必要とします。

*default*名前空間内の*counters*という名前のPod内の*counter*という名前のコンテナに対して、*kubelet* APIエンドポイントが次の場所で到達可能です。
```shell
# Podが実行されているNode上で実行する
curl -X POST "https://localhost:10250/checkpoint/default/counters/counter"
```

厳密には、*kubelet*の自己署名証明書を許容し*kubelet* `チェックポイント`APIの使用を認可するために、下記の`curl`コマンドのオプションが必要です。

```shell
--insecure --cert /var/run/kubernetes/client-admin.crt --key /var/run/kubernetes/client-admin.key
```

チェックポイントの作成が終了すると、`/var/lib/kubelet/checkpoints/checkpoint-<pod-name>_<namespace-name>-<container-name>-<timestamp>.tar`でチェックポイントが利用可能になります。

この記事の後述のステップでは、チェックポイントアーカイブを分析する際に`checkpoint.tar`という名前を使用します。

## `checkpointctl`を使用したチェックポイントアーカイブの分析

チェックポイントが作成したコンテナに関するいくつかの初期情報を得るためには、このように[checkpointctl][checkpointctl]を使用します。

```console
$ checkpointctl show checkpoint.tar --print-stats
+-----------+----------------------------------+--------------+---------+---------------------+--------+------------+------------+-------------------+
| CONTAINER |              IMAGE               |      ID      | RUNTIME |       CREATED       | ENGINE |     IP     | CHKPT SIZE | ROOT FS DIFF SIZE |
+-----------+----------------------------------+--------------+---------+---------------------+--------+------------+------------+-------------------+
| counter   | quay.io/adrianreber/counter:blog | 059a219a22e5 | runc    | 2023-03-02T06:06:49 | CRI-O  | 10.88.0.23 | 8.6 MiB    | 3.0 KiB           |
+-----------+----------------------------------+--------------+---------+---------------------+--------+------------+------------+-------------------+
CRIU dump statistics
+---------------+-------------+--------------+---------------+---------------+---------------+
| FREEZING TIME | FROZEN TIME | MEMDUMP TIME | MEMWRITE TIME | PAGES SCANNED | PAGES WRITTEN |
+---------------+-------------+--------------+---------------+---------------+---------------+
| 100809 us     | 119627 us   | 11602 us     | 7379 us       |          7800 |          2198 |
+---------------+-------------+--------------+---------------+---------------+---------------+
```

これによって、チェックポイントアーカイブ内のチェックポイントについてのいくつかの情報が、すでに取得できています。
コンテナの名前やコンテナランタイムやコンテナエンジンについての情報を見ることができます。
チェックポイントのサイズ(`CHKPT SIZE`)もリスト化されます。
これは大部分がチェックポイントに含まれるメモリーページのサイズですが、コンテナ内の全ての変更されたファイルのサイズ(`ROOT FS DIFF SIZE`)についての情報もあります。

追加のパラメーター`--print-stats`はチェックポイントアーカイブ内の情報を復号化し、2番目のテーブル(*CRIU dump statistics*)で表示します。
この情報はチェックポイント作成中に収集され、CRIUがコンテナ内のプロセスをチェックポイントするために必要な時間と、チェックポイント作成中に分析され書き込まれたメモリーページ数の概要を示します。

## より深く掘り下げる

`checkpointctl`の助けを借りて、チェックポイントアーカイブについてのハイレベルな情報を得ることができます。
チェックポイントアーカイブをさらに分析するには、それを展開する必要があります。
チェックポイントアーカイブは*tar*アーカイブであり、`tar xf checkpoint.tar`の助けを借りて展開可能です。

チェックポイントアーカイブを展開すると、下記のファイルやディレクトリが作成されます。

* `bind.mounts` - このファイルにはバインドマウントについての情報が含まれており、復元中に全ての外部ファイルとディレクトリを正しい場所にマウントするために必要になります。
* `checkpoint/` - このディレクトリにはCRIUによって作成された実際のチェックポイントが含まれています。
* `config.dump`と`spec.dump` - これらのファイルには、復元中に必要とされるコンテナについてのメタデータが含まれています。
* `dump.log` - このファイルにはチェックポイント作成中に作成されたCRIUのデバッグ出力が含まれています。
* `stats-dump` - このファイルには、`checkpointctl`が`--print-stats`でダンプ統計情報を表示するために使用するデータが含まれています。
* `rootfs-diff.tar` - このファイルには、コンテナのファイルシステム上で変更された全てのファイルが含まれています。

### ファイルシステムの変更 - `rootfs-diff.tar`

コンテナのチェックポイントをさらに分析するための最初のステップは、コンテナ内で変更されたファイルを見ることです。
これは`rootfs-diff.tar`ファイルを参照することで行えます。

```console
$ tar xvf rootfs-diff.tar
home/counter/logfile
home/counter/test-file
```

これでコンテナ内で変更されたファイルを調べられます。

```console
$ cat home/counter/logfile
10.88.0.1 - - [02/Mar/2023 06:07:29] "GET /create?test-file HTTP/1.1" 200 -
10.88.0.1 - - [02/Mar/2023 06:07:40] "GET /secret?RANDOM_1432_KEY HTTP/1.1" 200 -
10.88.0.1 - - [02/Mar/2023 06:07:43] "GET / HTTP/1.1" 200 -
$ cat home/counter/test-file
test-file 
```

このコンテナのベースになっているコンテナイメージ(`quay.io/adrianreber/counter:blog`)と比較すると、コンテナが提供するサービスへの全てのアクセス情報を含んだ`logfile`や予想通り作成された`test-file`ファイルを確認することができます。

`rootfs-diff.tar`の助けを借りることで、作成または変更された全てのファイルを、コンテナのベースイメージと比較して検査することが可能です。

### チェックポイント処理したプロセスを分析する - `checkpoint/`

ディレクトリ`checkpoint/`はコンテナ内でプロセスをチェックポイントしている間にCRIUによって作成されたデータを含んでいます。
ディレクトリ`checkpoint/`の内容は、CRIUの一部として配布されている[CRIT][crit]ツールを使用して分析できるさまざまな[イメージファイル][image-files]で構成されています。

まず、コンテナの内部プロセスの概要を取得してみましょう。

```console
$ crit show checkpoint/pstree.img | jq .entries[].pid
1
7
8
```

この出力はコンテナのPID名前空間の内部に3つのプロセス(PIDが1と7と8)があることを意味しています。

これはコンテナのPID名前空間の内部からの視界を表示しているだけです。
復元中に正確にそれらのPIDが再作成されます。
コンテナのPID名前空間の外部からPIDは復元後に変更されます。

次のステップは、それらの3つのプロセスについての追加情報を取得することです。

```console
$ crit show checkpoint/core-1.img | jq .entries[0].tc.comm
"bash"
$ crit show checkpoint/core-7.img | jq .entries[0].tc.comm
"counter.py"
$ crit show checkpoint/core-8.img | jq .entries[0].tc.comm
"tee"
```

これは、コンテナ内の3つのプロセスが`bash`と`counter.py`(Pythonインタプリター)と`tee`であることを意味しています。
プロセスの親子関係についての詳細は、`checkpoint/pstree.img`に分析するデータがさらにあります。

ここまでで収集した情報をまだ実行中のコンテナと比較してみましょう。

```console
$ crictl inspect --output go-template --template "{{(index .info.pid)}}" 059a219a22e56
722520
$ ps auxf | grep -A 2 722520
fedora    722520  \_ bash -c /home/counter/counter.py 2>&1 | tee /home/counter/logfile
fedora    722541      \_ /usr/bin/python3 /home/counter/counter.py
fedora    722542      \_ /usr/bin/coreutils --coreutils-prog-shebang=tee /usr/bin/tee /home/counter/logfile
$ cat /proc/722520/comm
bash
$ cat /proc/722541/comm
counter.py
$ cat /proc/722542/comm
tee
```

この出力では、まずコンテナ内の最初のプロセスのPIDを取得しています。
そしてコンテナを実行しているシステム上で、そのPIDと子プロセスを探しています。
3つのプロセスが表示され、最初のものはコンテナPID名前空間の中でPID 1である"bash"です。
次に`/proc/<PID>/comm`を見ると、チェックポイントイメージと正確に同じ値を見つけることができます。

覚えておく重要なことは、チェックポイントはコンテナのPID名前空間内の視界が含まれていることです。
なぜなら、これらの情報はプロセスを復元するために重要だからです。

`crit`がコンテナについて教えてくれる最後の例は、UTS名前空間に関する情報です。

```console
$ crit show checkpoint/utsns-12.img
{
    "magic": "UTSNS",
    "entries": [
        {
            "nodename": "counters",
            "domainname": "(none)"
        }
    ]
}
```

UTS名前空間内のホストネームが`counters`であることを教えてくれます。

チェックポイント作成中に収集された各リソースCRIUについて、`checkpoint/`ディレクトリは対応するイメージファイルを含んでいます。
このイメージファイルは`crit`を使用することで分析可能です。

#### メモリーページを見る

CRITを使用して復号化できるCRIUからの情報に加えて、CRIUがディスクに書き込んだ生のメモリーページを含んでいるファイルもあります。

```console
$ ls  checkpoint/pages-*
checkpoint/pages-1.img  checkpoint/pages-2.img  checkpoint/pages-3.img
```

最初にコンテナを使用した際に、メモリー内のどこかにランダムキー(`RANDOM_1432_KEY`)を保存しました。
見つけることができるかどうか見てみましょう。

```console
$ grep -ao RANDOM_1432_KEY checkpoint/pages-*
checkpoint/pages-2.img:RANDOM_1432_KEY
```

そして実際に、私のデータがあります。
この方法で、コンテナ内のプロセスの全てのメモリーページの内容を簡単に見ることができます。
しかし、チェックポイントアーカイブにアクセスできるなら誰でも、コンテナのプロセスのメモリー内に保存された全ての情報にアクセスできることを覚えておくことも重要です。

#### さらなる分析のためにgdbを使用する

チェックポイントイメージを見るための他の方法は`gdb`です。
CRIUリポジトリは、チェックポイントをコアダンプファイルに変換する[coredump][criu-coredump]スクリプトを含んでいます。

```console
$ /home/criu/coredump/coredump-python3
$ ls -al core*
core.1  core.7  core.8
```

`coredump-python3`スクリプトを実行すると、チェックポイントイメージがコンテナ内の各プロセスに対し1つのコアダンプファイルに変換されます。
`gdb`を使用してプロセスの詳細を見ることもできます。

```console
$ echo info registers | gdb --core checkpoint/core.1 -q

[New LWP 1]

Core was generated by `bash -c /home/counter/counter.py 2>&1 | tee /home/counter/logfile'.

#0  0x00007fefba110198 in ?? ()
(gdb)
rax            0x3d                61
rbx            0x8                 8
rcx            0x7fefba11019a      140667595587994
rdx            0x0                 0
rsi            0x7fffed9c1110      140737179816208
rdi            0xffffffff          4294967295
rbp            0x1                 0x1
rsp            0x7fffed9c10e8      0x7fffed9c10e8
r8             0x1                 1
r9             0x0                 0
r10            0x0                 0
r11            0x246               582
r12            0x0                 0
r13            0x7fffed9c1170      140737179816304
r14            0x0                 0
r15            0x0                 0
rip            0x7fefba110198      0x7fefba110198
eflags         0x246               [ PF ZF IF ]
cs             0x33                51
ss             0x2b                43
ds             0x0                 0
es             0x0                 0
fs             0x0                 0
gs             0x0                 0
```

この例では、チェックポイント中の全てのレジストリの値を見ることができ、コンテナのPID 1のプロセスの完全なコマンドライン(`bash -c /home/counter/counter.py 2>&1 | tee /home/counter/logfile`)を見ることもできます。

## まとめ

コンテナチェックポイントを作成することで、コンテナを停止することやチェックポイントが作成されたことを知ることなく、実行中のコンテナのチェックポイントを作成することが可能です。
Kubernetesにおいてコンテナのチェックポイントを作成した結果がチェックポイントアーカイブです。
`checkpointctl`や`tar`、`crit`、`gdb`のような異なるツールを使用して、チェックポイントを分析できます。
`grep`のようなシンプルなツールでさえ、チェックポイントアーカイブ内の情報を見つけることが可能です。

この記事で示したチェックポイントの分析方法のさまざまな例は出発点にすぎません。
この記事ではチェックポイントの分析を始める方法を紹介しましたが、要件によってはかなり詳細に特定の物事を見ることも可能です。

## 参加するためにはどうすればよいですか？

SIG Nodeにはいくつかの方法でアクセスできます。

* Slack: [#sig-node][slack-sig-node]
* Slack: [#sig-security][slack-sig-security]
* [メーリングリスト][sig-node-ml]

[forensic-blog]: https://kubernetes.io/ja/blog/2022/12/05/forensic-container-checkpointing-alpha/
[checkpointctl]: https://github.com/checkpoint-restore/checkpointctl
[image-files]: https://criu.org/Images
[crit]: https://criu.org/CRIT
[slack-sig-node]: https://kubernetes.slack.com/messages/sig-node
[slack-sig-security]: https://kubernetes.slack.com/messages/sig-security
[sig-node-ml]: https://groups.google.com/forum/#!forum/kubernetes-sig-node
[criu-coredump]: https://github.com/checkpoint-restore/criu/tree/criu-dev/coredump
