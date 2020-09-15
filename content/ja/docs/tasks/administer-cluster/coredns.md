---
title: サービスディスカバリーにCoreDNSを使用する
min-kubernetes-server-version: v1.9
content_type: task
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

kube-dnsの手動デプロイや置き換えについては、[CoreDNS GitHub project](https://github.com/coredns/deployment/tree/master/kubernetes)のドキュメントを参照してください。

## CoreDNSへの移行 {#migrating-to-coredns}

### kubeadmを使用した既存のクラスターのアップグレード {#upgrading-an-existing-cluster-with-kubeadm}

Kubernetesバージョン1.10以降では、`kube-dns`を使用しているクラスターを`kubeadm`を使用してアップグレードするときに、CoreDNSに移行することもできます。この場合、`kubeadm`は、`kube-dns` ConfigMapをベースにしてCoreDNS設定("Corefile")を生成し、フェデレーション、スタブドメイン、および上流のネームサーバーの設定を保持します。

kube-dnsからCoreDNSに移行する場合は、アップグレード時に必ず`CoreDNS`フィーチャーゲートを`true`に設定してください。たとえば、`v1.11.0`のアップグレードは次のようになります:
```
kubeadm upgrade apply v1.11.0 --feature-gates=CoreDNS=true
```

Kubernetesバージョン1.13以降では、`CoreDNS`フィーチャーゲートが削除され、CoreDNSがデフォルトで使用されます。アップグレードしたクラスターでkube-dnsを使用する場合は、[こちら](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase#cmd-phase-addon)のガイドに従ってください。

1.11以前のバージョンでは、Corefileはアップグレード中に作成されたものによって**上書き**されます。**カスタマイズしている場合は、既存のConfigMapを保存する必要があります。** 新しいConfigMapが稼働したら、カスタマイズを再適用できます。

Kubernetesバージョン1.11以降でCoreDNSを実行している場合、アップグレード中、既存のCorefileは保持されます。


### kubeadmを使用してCoreDNSの代わりにkube-dnsをインストールする {#installing-kube-dns-instead-of-coredns-with-kubeadm}

{{< note >}}
Kubernetes 1.11では、CoreDNSは一般利用可能(GA)にアップグレードされ、デフォルトでインストールされます。
{{< /note >}}

{{< warning >}}
Kubernetes 1.18では、kubeadmでのkube-dns使用は非推奨となり、将来のバージョンでは削除されます。
{{< /warning >}}

1.13以前のバージョンにkube-dnsをインストールするには、`CoreDNS`フィーチャーゲートの値を`false`に設定します:

```
kubeadm init --feature-gates=CoreDNS=false
```

バージョン1.13以降の場合は、[こちら](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase#cmd-phase-addon)に記載されているガイドに従ってください。

## CoreDNSのアップグレード {#upgrading-coredns}

CoreDNSはv1.9以降のKubernetesで使用できます。Kubernetesに同梱されているCoreDNSのバージョンと、CoreDNSに加えられた変更は[こちら](https://github.com/coredns/deployment/blob/master/kubernetes/CoreDNS-k8s_version.md)で確認できます。

CoreDNSだけをアップグレードしたい場合や、独自のカスタムイメージを使用したい場合は、CoreDNSを手動でアップグレードすることができます。スムーズなアップグレードのために役立つ[ガイドラインとウォークスルー](https://github.com/coredns/deployment/blob/master/kubernetes/Upgrading_CoreDNS.md)が用意されています。

## CoreDNSのチューニング {#tuning-coredns}

リソース使用率が問題になる場合は、CoreDNSの設定を調整すると役立つ場合があります。詳細は、[CoreDNSのスケーリングに関するドキュメント](https://github.com/coredns/deployment/blob/master/kubernetes/Scaling_CoreDNS.md)を参照してください。



## {{% heading "whatsnext" %}}


[CoreDNS](https://coredns.io)は、`Corefile`を変更することで、kube-dnsよりも多くのユースケースをサポートするように設定することができます。詳細は[CoreDNSサイト](https://coredns.io/2017/05/08/custom-dns-entries-for-kubernetes/)を参照してください。


