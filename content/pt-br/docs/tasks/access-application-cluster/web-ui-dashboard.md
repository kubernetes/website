---
title: Instalação e Acesso ao Painel do Kubernetes
description: >-
  Instale a interface web (Painel do Kubernetes) e acesse-a.
content_type: concept
weight: 10
card:
  name: tasks
  weight: 30
  title: Use o Painel Web do Kubernetes
---

<!-- overview -->

O Painel é uma interface de usuário web para o Kubernetes. Através do Painel, você pode implantar aplicações containerizadas em um cluster Kubernetes, solucionar problemas em suas aplicações e gerenciar os recursos do cluster.

O Painel oferece uma visão geral das aplicações em execução no seu cluster, além de permitir a criação ou modificação de recursos individuais do Kubernetes (como Deployments, Jobs, DaemonSets, etc.). Por exemplo, você pode escalar um Deployment, iniciar uma atualização contínua (_rolling update_), reiniciar um pod ou implantar novas aplicações utilizando um assistente de implantação.

O Painel também fornece informações sobre o estado dos recursos do Kubernetes em seu cluster e sobre quaisquer erros que possam ter ocorrido.
![Kubernetes Dashboard UI](/images/docs/ui-dashboard.png)

<!-- body -->

## Instalando o Kubernetes Dashboard

{{< note >}}
Atualmente, o Painel do Kubernetes suporta apenas a instalação baseada em Helm, pois é mais rápida e nos oferece melhor controle sobre todas as dependências necessárias para a execução do Painel.
{{< /note >}}

A interface de usuário do Painel não é implantada por padrão. Para implantá-la, execute o seguinte comando:

```shell
# Adicionando o repositório do kubernetes-dashboard
helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/
# Instale o "kubernetes-dashboard" usando helm chart
helm upgrade --install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard --create-namespace --namespace kubernetes-dashboard
```

## Acessando o painel do Kubernetes

Para proteger os dados do seu cluster, o Painel é implantado com uma configuração RBAC mínima por padrão. Atualmente, o Painel oferece suporte apenas ao login com um Bearer Token. Para criar um token para esta demonstração, você pode seguir nosso guia de [criação de um usuário de exemplo](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md).

Acesse o nosso guia sobre [criação de um usuário de exemplo](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md) para gerar um token de acesso.

{{< warning >}}
O usuário de exemplo criado no tutorial terá privilégios administrativos e é apenas para fins educacionais.
{{< /warning >}}

### Proxy via linha de comando

Você pode habilitar o acesso ao Painel usando a ferramenta de linha de comando `kubectl`,
executando o seguinte comando:

```
kubectl proxy
```

O kubectl disponibilizará o Painel em [http://localhost:8443/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/](http://localhost:8443/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/).

O acesso à interface é _restrito_ à máquina onde o comando é executado. Consulte `kubectl proxy --help` para mais opções.

{{< note >}}
O método de autenticação kubeconfig **não** oferece suporte a provedores de identidade externos ou autenticação baseada em certificados X.509.
{{< /note >}}

## Visualização de boas-vindas

Ao acessar o Painel em um cluster vazio, você verá a página de boas-vindas.
Esta página contém um link para este documento, bem como um botão para implantar sua primeira aplicação.

Além disso, você pode visualizar quais aplicações do sistema estão em execução por padrão no namespace `kube-system`
[namespace](/docs/tasks/administer-cluster/namespaces/) do seu cluster, como o próprio Painel do Kubernetes.

![Página de boas-vindas do painel do Kubernetes](/images/docs/ui-dashboard-zerostate.png)

## Instalando aplicações containerizadas

O Painel permite criar e implantar uma aplicação containerizada como um Deployment e um Service opcional através de um assistente simples. Você pode especificar os detalhes da aplicação manualmente ou carregar um arquivo de _manifesto_ em YAML ou JSON contendo a configuração da aplicação.

Clique no botão **CRIAR** no canto superior direito de qualquer página para iniciar.

### Especificando detalhes da aplicação

O assistente de implantação espera que você forneça as seguintes informações:

- **Nome da aplicação** (obrigatório): Nome para a sua aplicação.
  A [label](/docs/concepts/overview/working-with-objects/labels/) com o nome será adicionado ao Deployment e ao Service (se houver) que serão implantados.

O nome da aplicação deve ser único dentro do [namespace](/docs/tasks/administer-cluster/namespaces/) do Kubernetes selecionado. Ele deve começar com uma letra minúscula, terminar com uma letra minúscula ou um número e conter apenas letras minúsculas, números e hífens (-). O limite é de 24 caracteres. Espaços à esquerda e à direita são ignorados.

- **Imagem do contêiner** (obrigatório):
  A URL pública de uma [imagem de contêiner](/docs/concepts/containers/images/) Docker em qualquer registro de imagens público ou uma imagem privada (comumente hospedada no Google Container Registry ou Docker Hub). A especificação da imagem do container deve terminar com dois pontos (:).

- **Número de pods** (obrigatório): O número desejado de Pods nos quais você deseja que sua aplicação implantada. O valor deve ser um número inteiro positivo.

  Um [Deployment](/docs/concepts/workloads/controllers/deployment/) será criado para manter o número desejado de Pods em seu cluster.

- **Service** (opcional): Para algumas partes da sua aplicação (por exemplo, frontends), você pode querer expor um [Service](/docs/concepts/services-networking/service/) em um endereço de IP externo, possivelmente público, fora do seu cluster (external Service).

  {{< note >}}
  Para Services externos, você pode precisar abrir uma ou mais portas para fazê-lo.
  {{< /note >}}

  Outros Services que são visíveis apenas de dentro do cluster são chamados de Services internos.

  Independentemente do tipo de Service, se você optar por criá-lo e seu contêiner escutar em uma porta (entrada), será necessário especificar duas portas. O Serviço será criado mapeando a porta (entrada) para a porta de destino vista pelo contêiner. Este Service direcionará o tráfego para seus Pods implantados. Os protocolos suportados são TCP e UDP. O nome de DNS interno para este Service será o valor especificado como nome da aplicação acima.

Se necessário, você pode expandir a seção **Opções avançadas** onde você pode especificar mais configurações:

- **Descrição**: O texto inserido aqui será adicionado como uma
  [annotation](/docs/concepts/overview/working-with-objects/annotations/)
  ao Deployment e exibido nos detalhes da aplicação.

- **Labels**: Por padrão as [labels](/docs/concepts/overview/working-with-objects/labels/) usadas para sua aplicação são o nome e a versão da aplicação. Você pode especificar labels adicionais para serem aplicadas ao Deployment, ao Service (se houver) e aos Pods, como release, tier, environment e track.

  Exemplo:

  ```conf
  release=1.0
  tier=frontend
  environment=pod
  track=stable
  ```

- **Namespace**: O Kubernetes suporta múltiplos clusters virtuais apoiados pelo mesmo cluster físico.
  Esses clusters virtuais são chamados de [namespaces](/docs/tasks/administer-cluster/namespaces/).
  Eles permitem que você particione os recursos em grupos logicamente nomeados.

  O Dashboard oferece todos os namespaces disponíveis em uma lista suspensa e permite que você crie um novo namespace.
  O nome do namespace pode conter no máximo 63 caracteres alfanuméricos e hífens (-), mas não pode conter letras maiúsculas.
  Os nomes dos namespaces não devem consistir apenas de números.
  Se o nome for definido como um número, como 10, o pod será colocado no namespace padrão.

  Caso a criação do namespace seja bem-sucedida, ele será selecionado por padrão.
  Se a criação falhar, o primeiro namespace será selecionado.

- **Image Pull Secret**:
  Caso a imagem do contêiner Docker especificada seja privada, pode ser necessário fornecer credenciais de
  [pull secret](/docs/concepts/configuration/secret/).

  O Dashboard oferece todos as secrets disponíveis em uma lista suspensa e permite que você crie uma nova secret.

  O nome da secret deve seguir a sintaxe do nome de domínio DNS, por exemplo `new.image-pull.secret`.
  The content of a secret must be base64-encoded and specified in a
  O conteúdo de uma secret deve ser codificado em base64 e especificado em um arquivo
  [`.dockercfg`](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
  O nome da secret pode consistir em no máximo 253 caracteres.

  Caso a criação da secret de pull de imagem seja bem-sucedida, ele será selecionado por padrão. Se a criação falhar, nenhuma secret será aplicada.

- **CPU requirement (cores)** and **Memory requirement (MiB)**:
  Você pode especificar os [resource limits](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
  para o contêiner. Por padrão, os Pods são executados com limits de CPU e memória ilimitados.

- **Run command** and **Run command arguments**:
  Por padrão, seus contêiners executam a imagem Docker especificada por padrão
  [entrypoint command](/docs/tasks/inject-data-application/define-command-argument-container/).
  Você pode usar as opções e argumentos de comando para substituir o padrão.

- **Run as privileged**: Esta configuração determina se os processos em
  [privileged containers](/docs/concepts/workloads/pods/#privileged-mode-for-containers)
  são equivalentes a processos executados como root no host.
  Contêiners privilegiados podem fazer uso de capacidades como manipular stack de rede e acessar dispositivos.

- **Environment variables**: O Kubernetes expõe Services por meio
  de [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
  Você pode compor variáveis de ambiente ou passar argumentos para seus comandos usando os valores das variáveis de ambiente.
  Eles podem ser usados em aplicativos para encontrar um Service.
  Os valores podem referenciar outras variáveis usando a sintaxe `$(VAR_NAME)`.

### Upload de um arquivo YAML ou JSON

O Kubernetes suporta configuração declarativa.
Nesse estilo, toda a configuração é armazenada em manifestos (arquivos de configuração YAML ou JSON).
Os manifestos utilizam os esquemas de recursos da [API do Kubernetes](/docs/concepts/overview/kubernetes-api/).

Como alternativa à especificação dos detalhes da aplicação no assistente de implantação,
você pode definir sua aplicação em um ou mais manifestos e fazer o upload dos arquivos usando o Dashboard.

## Usando a Dashboard

As seções a seguir descrevem as visualizações da interface do Kubernetes Dashboard; o que elas fornecem e como podem ser usadas.

### Navegação

Quando há objetos do Kubernetes definidos no cluster, o Dashboard os exibe na visualização inicial.
Por padrão, apenas objetos do namespace _default_ são exibidos e
isso pode ser alterado usando o seletor de namespace localizado no menu de navegação.

O Dashboard exibe a maioria dos tipos de objetos do Kubernetes e os agrupa em algumas categorias de menu.

#### Visão geral do administrador

Para administradores de cluster e namespace, o Dashboard lista Nodes, Namespaces e PersistentVolumes e possui visualizações detalhadas para eles.
A visualização da lista de Nodes contém métricas de uso de CPU e memória agregadas em todos os Nodes.
A visualização de detalhes mostra as métricas de um Node, sua especificação, status,
recursos alocados, eventos e pods em execução no node.

#### Workloads

Mostra todas as aplicações em execução no namespace selecionado.
A visualização lista as aplicações por tipo de workload (por exemplo: Deployments, ReplicaSets, StatefulSets).
Cada tipo de workload pode ser visualizado separadamente.
As listas resumem informações acionáveis sobre os workloads, como o número de
pods ready para um ReplicaSet ou o uso de memória atual para um Pod.

As visualizações detalhadas dos workloads mostram informações de status e especificação e
revelam as relações entre objetos.
Por exemplo, Pods que um ReplicaSet está controlando ou novos ReplicaSets e HorizontalPodAutoscalers para Deployments.

#### Services

Exibe recursos do Kubernetes que permitem expor services para o mundo externo e
descobri-los dentro de um cluster.
Por essa razão, as visualizações de Service e Ingress mostram os Pods direcionados por eles,
endpoints internos para conexões de cluster e endpoints externos para usuários externos.

#### Storage

A visualização de armazenamento exibe recursos PersistentVolumeClaim que são usados por aplicações para armazenar dados.

#### ConfigMaps e Secrets {#config-maps-and-secrets}

Exibe todos os recursos do Kubernetes que são usados para a configuração ao vivo de aplicações em execução em clusters.
A visualização permite editar e gerenciar objetos de configuração e exibe secrets ocultos por padrão.

#### Visualizador de logs

Listas de Pods e páginas de detalhes vinculam a um visualizador de logs integrado ao Dashboard.
O visualizador permite explorar logs de contêiners pertencentes a um único Pod.

![Logs viewer](/images/docs/ui-dashboard-logs-view.png)

## {{% heading "whatsnext" %}}

Para mais informações, veja a
[página do projeto Kubernetes Dashboard](https://github.com/kubernetes/dashboard).
