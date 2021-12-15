---
reviewers:
- ptux
content_type: concept
title: トラブルシューティング
---

<!-- overview -->

Sometimes things go wrong. This guide is aimed at making them right. It has
two sections:

時には物事がうまくいかないこともあります。このガイドは、それらを正すことを目的としています。

 2つのセクションから構成されています:

* [Troubleshooting your application](/docs/tasks/debug-application-cluster/debug-application/) - Kubernetesにコードをデプロイしていて、なぜ動かないのか不思議に思っているユーザーに便利です。
* [Troubleshooting your cluster](/docs/tasks/debug-application-cluster/debug-cluster/) - クラスタ管理者やKubernetesクラスタに不満がある人に有用です。

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

Many people from the Kubernetes community hang out on Kubernetes Slack in the `#kubernetes-users` channel.
Slack requires registration; you can [request an invitation](https://slack.kubernetes.io),
and registration is open to everyone). Feel free to come and ask any and all questions.
Once registered, access the [Kubernetes organisation in Slack](https://kubernetes.slack.com)
via your web browser or via Slack's own dedicated app.

Once you are registered, browse the growing list of channels for various subjects of
interest. For example, people new to Kubernetes may also want to join the
[`#kubernetes-novice`](https://kubernetes.slack.com/messages/kubernetes-novice) channel. As another example, developers should join the
[`#kubernetes-dev`](https://kubernetes.slack.com/messages/kubernetes-dev) channel.

There are also many country specific / local language channels. Feel free to join
these channels for localized support and info:

{{< table caption="Country / language specific Slack channels" >}}
Country | Channels
:---------|:------------
China | [`#cn-users`](https://kubernetes.slack.com/messages/cn-users), [`#cn-events`](https://kubernetes.slack.com/messages/cn-events)
Finland | [`#fi-users`](https://kubernetes.slack.com/messages/fi-users)
France | [`#fr-users`](https://kubernetes.slack.com/messages/fr-users), [`#fr-events`](https://kubernetes.slack.com/messages/fr-events)
Germany | [`#de-users`](https://kubernetes.slack.com/messages/de-users), [`#de-events`](https://kubernetes.slack.com/messages/de-events)
India | [`#in-users`](https://kubernetes.slack.com/messages/in-users), [`#in-events`](https://kubernetes.slack.com/messages/in-events)
Italy | [`#it-users`](https://kubernetes.slack.com/messages/it-users), [`#it-events`](https://kubernetes.slack.com/messages/it-events)
Japan | [`#jp-users`](https://kubernetes.slack.com/messages/jp-users), [`#jp-events`](https://kubernetes.slack.com/messages/jp-events)
Korea | [`#kr-users`](https://kubernetes.slack.com/messages/kr-users)
Netherlands | [`#nl-users`](https://kubernetes.slack.com/messages/nl-users)
Norway | [`#norw-users`](https://kubernetes.slack.com/messages/norw-users)
Poland | [`#pl-users`](https://kubernetes.slack.com/messages/pl-users)
Russia | [`#ru-users`](https://kubernetes.slack.com/messages/ru-users)
Spain | [`#es-users`](https://kubernetes.slack.com/messages/es-users)
Sweden | [`#se-users`](https://kubernetes.slack.com/messages/se-users)
Turkey | [`#tr-users`](https://kubernetes.slack.com/messages/tr-users), [`#tr-events`](https://kubernetes.slack.com/messages/tr-events)
{{< /table >}}

### Forum

You're welcome to join the official Kubernetes Forum: [discuss.kubernetes.io](https://discuss.kubernetes.io).

### Bugs and feature requests

If you have what looks like a bug, or you would like to make a feature request,
please use the [GitHub issue tracking system](https://github.com/kubernetes/kubernetes/issues).

Before you file an issue, please search existing issues to see if your issue is
already covered.

If filing a bug, please include detailed information about how to reproduce the
problem, such as:

* Kubernetes version: `kubectl version`
* Cloud provider, OS distro, network configuration, and Docker version
* Steps to reproduce the problem


