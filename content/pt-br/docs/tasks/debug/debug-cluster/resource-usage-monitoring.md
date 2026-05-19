---
content_type: concept
title: Ferramentas para Monitorar Recursos
weight: 15
---

<!-- overview -->

Para escalonar uma aplicação e fornecer um serviço confiável, você precisa
entender como a aplicação se comporta quando é implantada. Você pode examinar
o desempenho da aplicação em um cluster Kubernetes examinando os contêineres,
[pods](/docs/concepts/workloads/pods/),
[services](/docs/concepts/services-networking/service/), e
as características do cluster geral. O Kubernetes fornece informações detalhadas
sobre o uso de recursos de uma aplicação em cada um desses níveis.
Essas informações permitem que você avalie o desempenho da sua aplicação e
onde os gargalos podem ser removidos para melhorar o desempenho geral.

<!-- body -->

No Kubernetes, o monitoramento de aplicações não depende de uma única solução de monitoramento.
Em clusters novos, você pode usar pipelines de [métricas de recursos](#pipeline-de-métricas-de-recursos) ou
[métricas completas](#pipeline-de-métricas-completas) para coletar estatísticas de monitoramento.

## Pipeline de métricas de recursos

O pipeline de métricas de recursos fornece um conjunto limitado de métricas relacionadas aos
componentes do cluster, como o controlador
[Horizontal Pod Autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/),
bem como o utilitário `kubectl top`.
Essas métricas são coletadas pelo
[metrics-server](https://github.com/kubernetes-sigs/metrics-server) leve, de curto prazo e em memória,
e são expostas via API `metrics.k8s.io`. 

O metrics-server descobre todos os nós no cluster e
consulta o [kubelet](/docs/reference/command-line-tools-reference/kubelet/) de cada nó para
uso de CPU e memória. O kubelet atua como uma ponte entre a camada de gerenciamento do Kubernetes e
os nós de carga de trabalho, gerenciando os pods e contêineres executando em uma máquina. O kubelet
traduz cada pod em seus contêineres integrantes e busca estatísticas de uso
de contêineres individuais do agente de execução de contêiner através da interface do agente
de execução de contêiner. Se você usa um agente de execução de contêiner que utiliza cgroups e
namespaces do Linux para implementar contêineres, e o agente de execução de contêiner não publica
estatísticas de uso, então o kubelet pode consultar essas estatísticas diretamente
(usando código do [cAdvisor](https://github.com/google/cadvisor)).
Não importa como essas estatísticas chegam, o kubelet então expõe as estatísticas agregadas de
uso de recursos do pod através da API de Métricas de Recursos do metrics-server.
Esta API é servida em `/metrics/resource/v1beta1` nas portas autenticadas e
somente leitura do kubelet. 

## Pipeline de métricas completas

Um pipeline de métricas completas oferece acesso a métricas mais ricas. O Kubernetes pode
responder a essas métricas automaticamente escalonando ou adaptando o cluster
baseado no seu estado atual, usando mecanismos como o Horizontal Pod
Autoscaler. O pipeline de monitoramento busca métricas do kubelet e
então as expõe ao Kubernetes através de um adaptador que implemente a API
`custom.metrics.k8s.io` ou `external.metrics.k8s.io`.


O Kubernetes é projetado para funcionar com [OpenMetrics](https://openmetrics.io/),
que é um dos
[Projetos de Monitoramento CNCF de Observabilidade e Análise](https://landscape.cncf.io/?group=projects-and-products&view-mode=card#observability-and-analysis--monitoring),
construído sobre e estendendo cuidadosamente o [formato de exposição do Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/)
de maneiras quase 100% retrocompatíveis.

Se você der uma olhada no
[CNCF Landscape](https://landscape.cncf.io/?group=projects-and-products&view-mode=card#observability-and-analysis--monitoring),
você pode ver vários projetos de monitoramento que podem funcionar com o Kubernetes *coletando*
dados de métricas e usando isso para ajudá-lo a observar seu cluster. Cabe a você selecionar a ferramenta
ou ferramentas que atendam às suas necessidades. O landscape da CNCF para observabilidade e análise inclui uma
mistura de software de código aberto, software-como-serviço pago e outros produtos comerciais.

Quando você projeta e implementa um pipeline de métricas completas, você pode tornar esses dados de monitoramento
disponíveis de volta ao Kubernetes. Por exemplo, um HorizontalPodAutoscaler pode usar as métricas processadas
para determinar quantos Pods executar para um componente da sua carga de trabalho.

A integração de um pipeline de métricas completas na sua implementação do Kubernetes está fora
do escopo da documentação do Kubernetes devido ao escopo muito amplo de possíveis
soluções.

A escolha da plataforma de monitoramento depende fortemente das suas necessidades, orçamento e recursos técnicos.
O Kubernetes não recomenda nenhum pipeline de métricas específico; [muitas opções](https://landscape.cncf.io/?group=projects-and-products&view-mode=card#observability-and-analysis--monitoring) estão disponíveis.
Seu sistema de monitoramento deve ser capaz de lidar com o padrão de transmissão de métricas [OpenMetrics](https://openmetrics.io/)
e precisa ser escolhido para se adequar melhor ao design geral e implantação da
sua plataforma de infraestrutura.


## {{% heading "whatsnext" %}}


Aprenda sobre ferramentas adicionais de depuração, incluindo:

* [Logging](/docs/concepts/cluster-administration/logging/)
* [Acessando contêineres via `exec`](/docs/tasks/debug/debug-application/get-shell-running-container/)
* [Conectando a contêineres via proxies](/docs/tasks/extend-kubernetes/http-proxy-access-api/)
* [Conectando a contêineres via encaminhamento de porta](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* [Inspecionar nó do Kubernetes com crictl](/docs/tasks/debug/debug-cluster/crictl/)
