---
reviewers:
- ptux
content_type: concept
title: トラブルシューティング
---

<!-- overview -->

時には物事がうまくいかないこともあります。このガイドは、それらを正すことを目的としています。

 2つのセクションから構成されています:

* [Troubleshooting your application](/docs/tasks/debug-application-cluster/debug-application/) - Kubernetesにコードをデプロイしていて、なぜ動かないのか不思議に思っているユーザーに便利です。
* [Troubleshooting your cluster](/docs/tasks/debug-application-cluster/debug-cluster/) - クラスター管理者やKubernetesクラスターに不満がある人に有用です。

また、使用している[リリース](https://github.com/kubernetes/kubernetes/releases)の既知の問題を確認する必要があります。

<!-- body -->

## ヘルプを受けます

もしあなたの問題が上記のどのガイドでも解決されない場合は、Kubernetesコミュニティから助けを得るための様々な方法があります。

### ご質問

本サイトのドキュメントは、様々な疑問に対する答えを提供するために構成されています。

[Concepts](/docs/concepts/)では、Kubernetesのアーキテクチャと各コンポーネントの動作について説明し、[Setup](/docs/setup/)では、使い始めるための実用的な手順を提供しています。
[Tasks](/docs/tasks/) は、よく使われるタスクの実行方法を示し、 [Tutorials](/docs/tutorials/)は、実世界の業界特有、またはエンドツーエンドの開発シナリオ、より包括的なウォークスルーとなります。
[Reference](/docs/reference/)セクションでは、[Kubernetes API(/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)と`kubectl`](/docs/reference/kubectl/overview/)などのコマンドラインインターフェース（CLI）に関する詳しいドキュメントが提供されています。

## ヘルプ!私の質問はカバーされていません!今すぐ助けてください!

### Stack Overflow

コミュニティの誰かがすでに同じような質問をしている可能性があり、あなたの問題を解決できるかもしれません。
Kubernetesチームも[posts tagged Kubernetes](https://stackoverflow.com/questions/tagged/kubernetes)を監視しています。
もし役立つ既存の質問がない場合は、[ask a new one](https://stackoverflow.com/questions/ask?tags=kubernetes)。


### Slack

Kubernetesコミュニティの多くの人々は、Kubernetes Slackの`#kubernetes-users`チャンネルにたむろしています。
Slackは登録が必要です。[request an invitation](https://slack.kubernetes.io)ことができ、登録は誰でも可能です）。
お気軽にお越しいただき、何でも質問してください。
登録が完了したら、WebブラウザまたはSlackの専用アプリから[Kubernetes organization in Slack](https://kubernetes.slack.com)にアクセスします。


Once you are registered, browse the growing list of channels for various subjects of
interest. For example, people new to Kubernetes may also want to join the
[`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice) channel. As another example, developers should join the
[`#kubernetes-dev`](https://kubernetes.slack.com/messages/kubernetes-dev) channel.

登録が完了したら、増え続けるチャンネルリストを見て、興味のある様々なテーマについて調べてみましょう。
たとえば、Kubernetes の初心者は、次のチャンネルに参加するのもよいでしょう。
[`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice)
別の例として、開発者は[`#kubernetes-dev`](https://kubernetes.slack.com/messages/kubernetes-dev)チャンネルに参加するとよいでしょう。

また、多くの国別／現地語チャンネルがあります。これらのチャンネルに参加すれば、地域特有のサポートや情報を得ることができます。

{{< table caption="Country / language specific Slack channels" >}}
Country | Channels
:---------|:------------
中国 | [`#cn-users`](https://kubernetes.slack.com/messages/cn-users), [`#cn-events`](https://kubernetes.slack.com/messages/cn-events)
フィンランド | [`#fi-users`](https://kubernetes.slack.com/messages/fi-users)
フランス | [`#fr-users`](https://kubernetes.slack.com/messages/fr-users), [`#fr-events`](https://kubernetes.slack.com/messages/fr-events)
ドイツ | [`#de-users`](https://kubernetes.slack.com/messages/de-users), [`#de-events`](https://kubernetes.slack.com/messages/de-events)
インド | [`#in-users`](https://kubernetes.slack.com/messages/in-users), [`#in-events`](https://kubernetes.slack.com/messages/in-events)
イタリア | [`#it-users`](https://kubernetes.slack.com/messages/it-users), [`#it-events`](https://kubernetes.slack.com/messages/it-events)
日本 | [`#jp-users`](https://kubernetes.slack.com/messages/jp-users), [`#jp-events`](https://kubernetes.slack.com/messages/jp-events)
韓国 | [`#kr-users`](https://kubernetes.slack.com/messages/kr-users)
オランダ | [`#nl-users`](https://kubernetes.slack.com/messages/nl-users)
ノルウェー | [`#norw-users`](https://kubernetes.slack.com/messages/norw-users)
ポーランド | [`#pl-users`](https://kubernetes.slack.com/messages/pl-users)
ロシア | [`#ru-users`](https://kubernetes.slack.com/messages/ru-users)
スペイン | [`#es-users`](https://kubernetes.slack.com/messages/es-users)
スウェーデン | [`#se-users`](https://kubernetes.slack.com/messages/se-users)
トルコ | [`#tr-users`](https://kubernetes.slack.com/messages/tr-users), [`#tr-events`](https://kubernetes.slack.com/messages/tr-events)
{{< /table >}}

### フォーラム

Kubernetesの公式フォーラムへの参加は大歓迎です[discuss.kubernetes.io](https://discuss.kubernetes.io)。

### バグと機能の要望

バグらしきものを発見した場合、または機能要望を出したい場合。
GitHub課題追跡システム](https://github.com/kubernetes/kubernetes/issues)をご利用ください。
課題を提出する前に、既存の課題を検索して、あなたの課題が解決されているかどうかを確認してください。

バグを報告する場合は、そのバグを再現するための詳細な情報を含めてください。

* Kubernetes のバージョン: `kubectl version`
* クラウドプロバイダー、OSディストリビューション、ネットワーク構成、Dockerバージョン
* 問題を再現するための手順


