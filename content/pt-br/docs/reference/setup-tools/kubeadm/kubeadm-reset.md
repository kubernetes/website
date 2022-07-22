---
title: kubeadm reset
content_type: conceito
weight: 60
---
<!-- overview -->
Executa uma melhor reversão das alterações feitas pelo `kubeadm init` ou `kubeadm join`.

<!-- body -->
{{< include "generated/kubeadm_reset.md" >}}

### Redefinindo o fluxo de trabalho {#reset-workflow}

O `kubeadm reset` é o responsável por limpar um sistema de arquivos local dos nós a partir dos arquivos que foram criados usando os comandos `kubeadm init` ou `kubeadm join`. O `reset` dos nós do plano de controle também remove o etcd local do nó do cluster etcd.

O `kubeadm reset phase` pode ser usado para executar separadamente as fases do fluxo de trabalho acima. Para pular uma lista de fases você pode usar `--skip-phases`, que funciona de maneira semelhante `kubeadm join` e `kubeadm init`.

### External etcd clean up

O `kubeadm reset` não excluirá nenhum dado etcd se o etcd externo estiver em uso. Isso significa que, se você executar o `kubeadm init` novamente usando os mesmos etcd endpoints, verá o estado dos clusters anteriores.

Para limpar dados etcd, é recomendável que você use um cliente como etcdctl, tal como:

```bash
etcdctl del "" --prefix
```

Consulte a [documentação etcd](https://github.com/coreos/etcd/tree/master/etcdctl) para obter mais informações.

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init) para inicializar um nó da camada de gerenciamento do Kubernetes 
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join) para inicializar um nó `worker` do Kubernetes e associá-lo ao cluster
