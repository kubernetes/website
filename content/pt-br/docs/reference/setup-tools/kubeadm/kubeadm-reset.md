---
title: kubeadm reset
content_type: conceito
weight: 60
---
<!-- overview -->
Executa o melhor esforço para reverter as alterações feitas pelo `kubeadm init` ou `kubeadm join`.

<!-- body -->
{{< include "generated/kubeadm_reset.md" >}}

### Fluxo de execução do comando `reset` {#reset-workflow}

O `kubeadm reset` é o responsável por limpar o sistema de arquivos local dos nós a partir dos arquivos que foram criados usando os comandos `kubeadm init` ou `kubeadm join`. O `reset` dos nós da camanda de gerenciamento também remove o etcd local do nó do cluster etcd.

O `kubeadm reset phase` pode ser usado para executar separadamente as fases do fluxo de trabalho acima. Para pular uma lista de fases você pode usar `--skip-phases`, que funciona de maneira semelhante aos executores de fases dos comandos `kubeadm join` e `kubeadm init`.

### Limpeza do etcd externo

O `kubeadm reset` não excluirá nenhum dado do etcd se o etcd externo estiver em uso. Isso significa que, se você executar o `kubeadm init` novamente usando os mesmos etcd endpoints, verá o estado dos clusters anteriores.

Para limpar dados etcd, é recomendável que você use um cliente como etcdctl, tal como:

```bash
etcdctl del "" --prefix
```

Consulte a [documentação do etcd](https://github.com/coreos/etcd/tree/master/etcdctl) para obter mais informações.

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init) para inicializar um nó do plano de controle do Kubernetes 
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join) para inicializar um nó de carga de trabalho do Kubernetes e associá-lo ao cluster
