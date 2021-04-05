---
title: Ambiente de Contêiner
content_type: concept
weight: 20
---

<!-- overview -->

Essa página descreve os recursos disponíveis para contêineres no ambiente de contêiner.



<!-- body -->

## Ambiente de contêiner

O ambiente de contêiner do Kubernetes fornece recursos importantes para contêineres: 

* Um sistema de arquivos, que é a combinação de uma [imagem](/docs/concepts/containers/images/) e um ou mais [volumes](/docs/concepts/storage/volumes/).
* Informação sobre o contêiner propriamente.
* Informação sobre outros objetos no cluster.

### Informação de contêiner

O _hostname_ de um contêiner é o nome do Pod em que o contêiner está executando.
Isso é disponibilizado através do comando `hostname` ou da função [`gethostname`](https://man7.org/linux/man-pages/man2/gethostname.2.html) chamada na libc.

O nome do Pod e o Namespace são expostos como variáveis de ambiente através de um mecanismo chamado [downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).

Variáveis de ambiente definidas pelo usuário a partir da definição do Pod também são disponíveis para o contêiner, assim como qualquer variável de ambiente especificada estáticamente na imagem Docker.

### Informação do cluster

Uma lista de todos os serviços que estão executando quando um contêiner foi criado é disponibilizada para o contêiner como variáveis de ambiente.
Essas variáveis de ambiente são compatíveis com a funcionalidade _docker link_ do Docker.

Para um serviço nomeado *foo* que mapeia para um contêiner nomeado *bar*, as seguintes variáveis são definidas:

```shell
FOO_SERVICE_HOST=<o host em que o serviço está executando>
FOO_SERVICE_PORT=<a porta em que o serviço está executando>
```

Serviços possuem endereço IP dedicado e são disponibilizados para o contêiner via DNS,
se possuírem [DNS addon](https://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/) habilitado.



## {{% heading "whatsnext" %}}


* Aprenda mais sobre [hooks de ciclo de vida do contêiner](/docs/concepts/containers/container-lifecycle-hooks/).
* Obtenha experiência prática
  [anexando manipuladores a eventos de ciclo de vida do contêiner](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).


