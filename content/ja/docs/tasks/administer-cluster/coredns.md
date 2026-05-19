---
title: サービスディスカバリーにCoreDNSを使用する
min-kubernetes-server-version: v1.9
content_type: task
weight: 380
---

<!-- overview -->
このページでは、CoreDNSのアップグレードプロセスと、kube-dnsの代わりにCoreDNSをインストールする方法を説明します。


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## CoreDNSについて {#about-coredns}

[CoreDNS](https://coredns.io)は、KubernetesクラスターDNSとして稼働させることができる柔軟で拡張可能なDNSサーバーです。Kubernetesと同様に、CoreDNSプロジェクトは{{< glossary_tooltip text="CNCF" term_id="cncf" >}}によってホストされています。

既存のデプロイでkube-dnsを置き換えるか、クラスターのデプロイとアップグレードを代行してくれるkubeadmのようなツールを使用することで、クラスターでkube-dnsの代わりにCoreDNSを使用することができます。

## CoreDNSのインストール {#installing-coredns}

kube-dnsの手動デプロイや置き換えについては、[CoreDNS website](https://coredns.io/manual/installation/)のドキュメントを参照してください。

## CoreDNSへの移行 {#migrating-to-coredns}

### kubeadmを使用した既存のクラスターのアップグレード {#upgrading-an-existing-cluster-with-kubeadm}

Kubernetesバージョン1.21で`kubeadm`はDNSアプリケーションとしての`kube-dns`に対するサポートを削除しました。
`kubeadm` v{{< skew currentVersion >}}に対してサポートされるクラスターDNSアプリケーションは`CoreDNS`のみです。

`kube-dns`を使用しているクラスターを`kubeadm`を使用してアップグレードするときに、CoreDNSに移行することができます。
この場合、`kubeadm`は、`kube-dns` ConfigMapをベースにして`CoreDNS`設定("Corefile")を生成し、スタブドメインおよび上流のネームサーバーの設定を保持します。

## CoreDNSのアップグレード {#upgrading-coredns}

Kubernetesのバージョンごとに`kubeadm`がインストールする`CoreDNS`のバージョンは、[KubernetesにおけるCoreDNSのバージョン](https://github.com/coredns/deployment/blob/master/kubernetes/CoreDNS-k8s_version.md)のページで確認することができます。


`CoreDNS`のみをアップグレードしたい場合や、独自のカスタムイメージを使用したい場合は、`CoreDNS`を手動でアップグレードすることができます。
スムーズなアップグレードのために役立つ[ガイドラインとウォークスルー](https://github.com/coredns/deployment/blob/master/kubernetes/Upgrading_CoreDNS.md)が用意されています。
クラスターをアップグレードする際には、既存の`CoreDNS`設定("Corefile")が保持されていることを確認してください。

`kubeadm`ツールを使用してクラスターをアップグレードしている場合、`kubeadm`は既存のCoreDNSの設定を自動的に保持する処理を行うことができます。

## CoreDNSのチューニング {#tuning-coredns}

リソース使用率が問題になる場合は、CoreDNSの設定を調整すると役立つ場合があります。
詳細は、[CoreDNSのスケーリングに関するドキュメント](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md)を参照してください。

## {{% heading "whatsnext" %}}


[CoreDNS](https://coredns.io)は、設定("Corefile")を変更することで、`kube-dns`よりも多くのユースケースをサポートする構成にすることができます。
詳細はKubernetes CoreDNSプラグインの[ドキュメント](https://coredns.io/plugins/kubernetes/)を参照するか、[CoreDNSブログ](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/)を参照してください。


