---
title: Acessando serviços em execução em clusters
content_type: task
weight: 140
---

<!-- overview -->
Esta página mostra como se conectar a serviços em execução no cluster Kubernetes.

{{% heading "pré-requisitos" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Acessando serviços em execução no cluster

No Kubernetes, [nós](/docs/concepts/architecture/nodes/), [pods](/docs/concepts/workloads/pods/) e [serviços](/docs/concepts/services-networking/service/) têm todos seus próprios IPs. Em muitos casos, os IPs dos nós, dos pods e alguns dos IPs de serviço em um cluster não serão
roteáveis, portanto, não estarão acessíveis a partir de uma máquina fora do cluster, como seu computador de mesa.

## Maneiras de se conectar

Você tem várias opções para se conectar a nós, pods e serviços de fora do cluster:

  - Acesse serviços através de IPs públicos.
    - Use um serviço com tipo `NodePort` ou `LoadBalancer` para tornar o serviço acessível fora do cluster. Consulte a documentação de [serviços]((/docs/concepts/services-networking/service/)) e
[kubectl expose](/docs/reference/generated/kubectl/kubectl-commands/#expose).
    - Dependendo do ambiente do cluster, isso pode expor o serviço apenas para a rede corporativa, ou pode expô-lo para a Internet. Pense se o serviço que está sendo exposto é seguro. Ele faz sua própria autenticação?
    - Coloque pods atrás de serviços. Para acessar um pod específico de um conjunto de réplicas, como para depurar, coloque um rótulo exclusivo no pod e crie um novo serviço que selecione este rótulo.
    - Na maioria dos casos, não deve ser necessário para o desenvolvedor de aplicativos acessar diretamente nós através de seus IPs de nó.
  - Acesse serviços, nós ou pods usando o Verbo Proxy.
    - Faz autenticação e autorização do servidor de API antes de acessar o serviço remoto. Use isto se os serviços não forem seguros o suficiente para expor à Internet, ou para obter acesso a portas no IP do nó, ou para depuração.
    - Proxies podem causar problemas para algumas aplicações web.
    - Só funciona para HTTP/HTTPS.
    - Descrito [aqui](#manually-constructing-apiserver-proxy-urls).
  - Acesse a partir de um nó ou pod no cluster.
    - Execute um pod e, em seguida, conecte-se a um shell nele usando [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec). Conecte-se a outros nós, pods e serviços a partir desse shell.
    - Alguns clusters podem permitir que você faça ssh para um nó no cluster. De lá, você pode ser capaz de acessar os serviços do cluster. Este é um método não padrão e funcionará em alguns clusters, mas
não em outros. Navegadores e outras ferramentas podem ou não estar instalados. O DNS do cluster pode não funcionar.

## Descobrindo serviços integrados

Normalmente, existem vários serviços que são iniciados em um cluster pelo kube-system. Obtenha uma lista desses serviços com o comando `kubectl cluster-info`:

```shell
kubectl cluster-info
```

A saída é semelhante a esta:

```
O mestre do Kubernetes está em execução em https://192.0.2.1
elasticsearch-logging está em execução em https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy
kibana-logging está em execução em https://192.0.2.1/api/v1/namespaces/kube-system/services/kibana-logging/proxy
kube-dns está em execução em https://192.0.2.1/api/v1/namespaces/kube-system/services/kube-dns/proxy
grafana está em execução em https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
heapster está em execução em https://192.0.2.1/api/v1/namespaces/kube-system/services/monitoring-heapster/proxy
```

Isso mostra a URL proxy-verbo para acessar cada serviço. Por exemplo, este cluster tem o registro em nível de cluster habilitado (usando o Elasticsearch), que pode ser acessado em `https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/` se as credenciais adequadas forem passadas ou através de um proxy kubectl, por exemplo: `http://localhost:8080/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/`.

{{< note >}}
Consulte [Acessando clusters usando a API Kubernetes](/docs/tasks/administer-cluster/access-cluster-api/#accessing-the-cluster-api) para obter informações sobre como passar credenciais ou usar o proxy kubectl.
{{< /note >}}

## Construindo manualmente URLs de proxy do apiserver

Como mencionado acima, você usa o comando `kubectl cluster-info` para recuperar a URL do proxy do serviço. Para criar URLs de proxy que incluem pontos de extremidade, sufixos e parâmetros de serviço, você adiciona à URL do proxy do serviço:
`http://`*`endereço_do_mestre_do_kubernetes`*`/api/v1/namespaces/`*`nome_do_namespace`*`/services/`[https:]nome_do_serviço[:nome_da_porta]`*`/proxy`

Se você não especificou um nome para a porta, não é necessário especificar *nome_da_porta* na URL. Você também pode usar o número da porta no lugar do *nome_da_porta* para portas nomeadas e não nomeadas.

Por padrão, o servidor API usa proxy para o seu serviço usando HTTP. Para usar HTTPS, adicione o prefixo `https:` ao nome do serviço:
`http://<endereço_do_mestre_do_kubernetes>/api/v1/namespaces/<nome_do_namespace>/services/<nome_do_serviço>/proxy`

Os formatos suportados para o segmento `<nome_do_serviço>` da URL são:

* `<nome_do_serviço>` - faz proxy para a porta padrão ou não nomeada usando http
* `<nome_do_serviço>:<nome_da_porta>` - faz proxy para a porta nomeada ou número da porta especificado usando http
* `https:<nome_do_serviço>:` - faz proxy para a porta padrão ou não nomeada usando https (observe o dois-pontos no final)
* `https:<nome_do_serviço>:<nome_da_porta>` - faz proxy para a porta nomeada ou número da porta especificado usando https

##### Exemplos

* Para acessar o ponto de extremidade de serviço Elasticsearch `_search?q=user:kimchy`, você usaria:

  ```
  http://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_search?q=user:kimchy
  ```
  
* Para acessar as informações de saúde do cluster Elasticsearch `_cluster/health?pretty=true`, você usaria:

  ```
  https://192.0.2.1/api/v1/namespaces/kube-system/services/elasticsearch-logging/proxy/_cluster/health?pretty=true
  ```

  As informações de saúde são semelhantes a estas:
  
  ```json
    {
      "cluster_name" : "kubernetes_logging",
      "status" : "yellow",
      "timed_out" : false,
      "number_of_nodes" : 1,
      "number_of_data_nodes" : 1,
      "active_primary_shards" : 5,
      "active_shards" : 5,
      "relocating_shards" : 0,
      "initializing_shards" : 0,
      "unassigned_shards" : 5
    }
    ```
    
* Para acessar as informações de saúde do serviço Elasticsearch `_cluster/health?pretty=true`, você usaria:

  ```
  https://192.0.2.1/api/v1/namespaces/kube-system/services/https:elasticsearch-logging:/proxy/_cluster/health?pretty=true
  ```

#### Usando navegadores da web para acessar serviços em execução no cluster

Você pode ser capaz de colocar um URL de proxy de apiserver na barra de endereço de um navegador. No entanto:

  - Os navegadores da web geralmente não podem passar tokens, portanto, você pode precisar usar autenticação básica (senha). Apiserver pode ser configurado para aceitar autenticação básica, mas o seu cluster pode não estar configurado para aceitar autenticação básica.
  - Alguns aplicativos da web podem não funcionar, principalmente aqueles com javascript do lado do cliente que constroem URLs de uma maneira que não está ciente do prefixo do caminho do proxy.
