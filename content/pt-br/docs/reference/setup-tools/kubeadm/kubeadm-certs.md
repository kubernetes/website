---
title: kubeadm certs
content_type: conceito
weight: 90
---


O `kubeadm certs` fornece os utilitários para gerenciar os certificados. Para obter mais detalhes sobre como esses comandos podem ser usados, consulte [Gerenciamento de Certificados com o kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).

## kubeadm certs {#cmd-certs}

Um conjunto de utilitários para usar os certificados Kubernetes

{{< tabs name="tab-certs" >}}
{{< tab name="visão geral" include="generated/kubeadm_certs.md" />}}
{{< /tabs >}}

## kubeadm certs renew {#cmd-certs-renew}

Você pode renovar todos os certificados Kubernetes usando o subcomando `all` ou renová-los seletivamente. Para mais detalhes, consulte [Manual de renovação do certificado](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal).

{{< tabs name="tab-certs-renew" >}}
{{< tab name="renew" include="generated/kubeadm_certs_renew.md" />}}
{{< tab name="all" include="generated/kubeadm_certs_renew_all.md" />}}
{{< tab name="admin.conf" include="generated/kubeadm_certs_renew_admin.conf.md" />}}
{{< tab name="apiserver-etcd-client" include="generated/kubeadm_certs_renew_apiserver-etcd-client.md" />}}
{{< tab name="apiserver-kubelet-client" include="generated/kubeadm_certs_renew_apiserver-kubelet-client.md" />}}
{{< tab name="apiserver" include="generated/kubeadm_certs_renew_apiserver.md" />}}
{{< tab name="controller-manager.conf" include="generated/kubeadm_certs_renew_controller-manager.conf.md" />}}
{{< tab name="etcd-healthcheck-client" include="generated/kubeadm_certs_renew_etcd-healthcheck-client.md" />}}
{{< tab name="etcd-peer" include="generated/kubeadm_certs_renew_etcd-peer.md" />}}
{{< tab name="etcd-server" include="generated/kubeadm_certs_renew_etcd-server.md" />}}
{{< tab name="front-proxy-client" include="generated/kubeadm_certs_renew_front-proxy-client.md" />}}
{{< tab name="scheduler.conf" include="generated/kubeadm_certs_renew_scheduler.conf.md" />}}
{{< /tabs >}}

## kubeadm certs certificate-key {#cmd-certs-certificate-key}

Este comando pode ser usado para gerar uma nova chave do certificado da camada de gerenciamento. A chave pode ser passada como `--certificate-key` to [`kubeadm init`](/docs/reference/setup-tools/kubeadm/kubeadm-init) e [`kubeadm join`](/docs/reference/setup-tools/kubeadm/kubeadm-join) para permitir uma  cópia automática dos certificados ao unir nós adicionais a camada de gerenciamento.

{{< tabs name="tab-certs-certificate-key" >}}
{{< tab name="certificate-key" include="generated/kubeadm_certs_certificate-key.md" />}}
{{< /tabs >}}

## kubeadm certs check-expiration {#cmd-certs-check-expiration}

Este comando verifica a expiração dos certificados na PKI local gerenciada pelo kubeadm. Para mais detalhes, consulte [Verificar a expiração do certificado](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#check-certificate-expiration).

{{< tabs name="tab-certs-check-expiration" >}}
{{< tab name="check-expiration" include="generated/kubeadm_certs_check-expiration.md" />}}
{{< /tabs >}}

## kubeadm certs generate-csr {#cmd-certs-generate-csr}

Este comando pode ser usado para gerar chaves e CSRs para todos os certificados da camada de gerenciamento e arquivos kubeconfig. O usuário pode então assinar os CSRs com uma autoridade de certificação de sua escolha.

{{< tabs name="tab-certs-generate-csr" >}}
{{< tab name="generate-csr" include="generated/kubeadm_certs_generate-csr.md" />}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init) para inicializar um nó da camada de gerenciamento do Kubernetes 
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join) para inicializar um nó de carga de trabalho do Kubernetes e associá-lo ao cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset) para reverter quaisquer alterações feitas, neste host, pelo `kubeadm init` ou `kubeadm join`
