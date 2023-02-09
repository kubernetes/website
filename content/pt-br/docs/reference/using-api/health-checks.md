---
title: Kubernetes API health endpoints
content_type: concept
weight: 50
---

<!-- overview -->
O Kubernetes {{< glossary_tooltip term_id="kube-apiserver" text="servidor de API" >}} fornece endpoints de API para indicar o status atual do servidor de API. Esta página descreve esses endpoints da API e explica como você pode usá-los.

<!-- body -->

## Endpoints da API para health

O servidor de API do kubernetes fornece 3 endpoints(`healthz`, `livez` and `readyz`) para indicar o status atual do servidor de API.
O endpoint  `healthz` é descontinuado (desde Kubernetes v1.16), e você deve usar algum endpoint mais específico como `livez` e `readyz`.
O endpoint `livez` pode ser usado com a [flag](/docs/reference/command-line-tools-reference/kube-apiserver) `--livez-grace-period` para especificar a duração de inicialização.
Para um desligamento elegante, você pode especificar a [flag](/docs/reference/command-line-tools-reference/kube-apiserver) `--shutdown-delay-duration` junto com o endpoint `/readyz`.
As máquinas que verificam o `healthz`/`livez`/`readyz` do servidor API devem se basear no código de status HTTP.
Um código de status `200` indica que o servidor API está `healthy`/`live`/`ready`, dependendo do endpoint chamado.
As opções mais detalhadas mostradas abaixo destinam-se a ser usadas manualmente para depurar seu cluster ou entender o estado do servidor de API.

Os exemplos seguintes mostrarão  como você pode interagir com os endpoints de API health.

Para todos os endpoints, você pode usar o parâmetro `verbose` para imprimir as verificações e seus status.
Isso pode ser útil para um operador humano depurar o status atual do servidor de API, ele não se destina a ser consumido por uma máquina:

```shell
curl -k https://localhost:6443/livez?verbose
```

Ou de um host remoto com autenticação:

```shell
kubectl get --raw='/readyz?verbose'
```

A saída ficará assim:

    [+]ping ok
    [+]log ok
    [+]etcd ok
    [+]poststarthook/start-kube-apiserver-admission-initializer ok
    [+]poststarthook/generic-apiserver-start-informers ok
    [+]poststarthook/start-apiextensions-informers ok
    [+]poststarthook/start-apiextensions-controllers ok
    [+]poststarthook/crd-informer-synced ok
    [+]poststarthook/bootstrap-controller ok
    [+]poststarthook/rbac/bootstrap-roles ok
    [+]poststarthook/scheduling/bootstrap-system-priority-classes ok
    [+]poststarthook/start-cluster-authentication-info-controller ok
    [+]poststarthook/start-kube-aggregator-informers ok
    [+]poststarthook/apiservice-registration-controller ok
    [+]poststarthook/apiservice-status-available-controller ok
    [+]poststarthook/kube-apiserver-autoregistration ok
    [+]autoregister-completion ok
    [+]poststarthook/apiservice-openapi-controller ok
    healthz check passed

O Kubernetes servidor de API também suporta excluir verificações específicas. 
Os parâmetros da consulta também podem ser combinados como neste exemplo:

```shell
curl -k 'https://localhost:6443/readyz?verbose&exclude=etcd'
```

A saída mostra que a verificação `etcd` está excluída:

    [+]ping ok
    [+]log ok
    [+]etcd excluded: ok
    [+]poststarthook/start-kube-apiserver-admission-initializer ok
    [+]poststarthook/generic-apiserver-start-informers ok
    [+]poststarthook/start-apiextensions-informers ok
    [+]poststarthook/start-apiextensions-controllers ok
    [+]poststarthook/crd-informer-synced ok
    [+]poststarthook/bootstrap-controller ok
    [+]poststarthook/rbac/bootstrap-roles ok
    [+]poststarthook/scheduling/bootstrap-system-priority-classes ok
    [+]poststarthook/start-cluster-authentication-info-controller ok
    [+]poststarthook/start-kube-aggregator-informers ok
    [+]poststarthook/apiservice-registration-controller ok
    [+]poststarthook/apiservice-status-available-controller ok
    [+]poststarthook/kube-apiserver-autoregistration ok
    [+]autoregister-completion ok
    [+]poststarthook/apiservice-openapi-controller ok
    [+]shutdown ok
    healthz check passed

## Verificações individuais de health

{{< feature-state state="alpha" >}}

Cada verificação individual de health expõe um endpoint HTTP e pode ser verificado individualmente.
O esquema para as verificações de health individuais é `/livez/<healthcheck-name>` onde  `livez` e `readyz` são usados para indicar se você quer verificar a vivacidade ou a prontidão do servidor de API.
O caminho `<healthcheck-name>` pode ser descoberto usando a flag `verbose` demonstrada acima, e pegue o caminho entre `[+]` e `ok`.
Essas verificações individuais de health, não devem ser consumidas por máquinas mas podem ser úteis para  sererm depuradas manualmente em um sistema:

```shell
curl -k https://localhost:6443/livez/etcd
```