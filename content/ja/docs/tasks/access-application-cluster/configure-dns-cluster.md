---
title: クラスターのDNSを設定する
weight: 130
content_type: concept
---

<!-- overview -->
Kubernetesは、DNSクラスターアドオンを提供しており、サポートされているほとんどの環境ではデフォルトで有効になっています。
Kubernetesバージョン1.11以降では、CoreDNSが推奨されており、kubeadmでデフォルトでインストールされます。

<!-- body -->
KubernetesクラスターでCoreDNSを構成する方法の詳細については、[DNSサービスのカスタマイズ](/docs/tasks/administer-cluster/dns-custom-nameservers/)を参照してください。
kube-dnsを使用してKubernetes DNSを利用する方法の例については、[Kubernetes DNSサンプルプラグイン](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)を参照してください。
