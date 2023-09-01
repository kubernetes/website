---
title: dockershimからの移行
weight: 20
content_type: task
---

<!-- overview -->

dockershimから他のコンテナランタイムに移行する際に知っておくべき情報を紹介します。

Kubernetes 1.20で[dockershim deprecation](blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)が発表されてから、様々なワークロードやKubernetesインストールにどう影響するのかという質問が寄せられています。

この問題をよりよく理解するために、[dockershimの削除に関するFAQ](/ja/dockershim)ブログが役に立つでしょう。

dockershimから代替のコンテナランタイムに移行することが推奨されます。
[コンテナランタイム](/ja/docs/setup/production-environment/container-runtimes/)のセクションをチェックして、どのような選択肢があるかを確認してください。
問題が発生した場合は、必ず[問題の報告](https://github.com/kubernetes/kubernetes/issues)をしてください。
そうすれば、問題が適時に修正され、クラスターがdockershimの削除に対応できるようになります。
