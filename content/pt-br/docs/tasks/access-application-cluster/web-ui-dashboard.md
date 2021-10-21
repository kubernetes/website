---
title: Implantar e acessar o painel Kubernetes
description: >-
  Implementa a interface web do usuário (Kubernetes Dashboard) e acessá-lo.
content_type: concept
weight: 10
card:
  name: tasks
  weight: 30
  title: Usar a interface de usuário do Dashboard web
---


<!-- overview -->

Dashboard é uma interface de usuário Kubernetes baseada na Web.
Você pode usar o dashboard para implantar aplicativos contêineres para um cluster Kubernetes,
solucione problemas de seu aplicativo conteinerizado e gerencie os recursos do cluster.
Você pode usar o dashboard para obter uma visão geral dos aplicativos em execução no seu cluster,
bem como para criar ou modificar recursos individuais do Kubernetes
(como Deploys, tarefas, daemonsets, etc).
Por exemplo, você pode dimensionar um deploy, iniciar uma atualização de rolamento, reiniciar um pod
ou criar deploy para novos aplicativos usando um assistente de deploy.

Dashboard Também fornece informações sobre o estado dos recursos da Kubernetes em seu cluster e em quaisquer erros que possam ter ocorrido.

![Kubernetes Dashboard UI](/images/docs/ui-dashboard.png)

<!-- body -->

## Implantando a interface do usuário do Dashboard

O UI do painel não é implantado por padrão.Para implantar, execute o seguinte comando:
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.3.1/aio/deploy/recommended.yaml
```

## Acessando a interface do usuário do Dashboard

Para proteger seus dados de cluster, o Dashboard é implantado com uma configuração mínima do RBAC por padrão.
Atualmente, o dashboard apenas suporta o login com um Bearer Token.
Para criar um token para esta demonstração, você pode seguir nosso guia sobre
[criando um usuário de amostra](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md).

{{< warning >}}
O usuário de amostra criado no tutorial terá privilégios administrativos e é apenas para fins educacionais.
{{< /warning >}}

### Proxy de linha de comando.

Você pode ativar o acesso ao painel usando a ferramenta de linha de comando `kubectl`
executando o seguinte comando:

```
kubectl proxy
```

Kubectl tornará o dashboard disponível em [http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/serviços/https:kubernetes-dashboard:/proxy/](http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/serviços/https:kubernetes-dashboard:/proxy/).

A interface de usuário pode ser acessada _somente_ pela máquina onde o comando é executado. Veja `kubectl proxy --help` para mais opções.

{{< note >}}
O método de autenticação do kubeconfig **não** suporta a provedores de identidade externa
ou autenticação baseada em certificado X.509.
{{< /note >}}

## Página de boas vindas

Quando você acessa o dashboard em um cluster vazio, você verá a página de boas-vindas.
Esta página contém um link para este documento, bem como um botão para implantar sua primeira aplicação.
Além disso, você pode visualizar quais aplicações do sistema estão sendo executadas por padrão no `kube-system`
[namespace](/docs/tasks/administer-cluster/namespaces/) do seu cluster, por exemplo, o próprio painel.

![Kubernetes Dashboard welcome page](/images/docs/ui-dashboard-zerostate.png)

## Implantando aplicações conteinerizadas

Dashboard Permite criar e implantar uma Aplicações Conteinerizadas como uma implantação e serviço opcional com um simples assistente.
Você pode especificar manualmente os detalhes da aplicação ou carregar um arquivo YAML ou JSON _manifest_ contendo a configuração da aplicação.

Clique no botão **Create** no canto superior direito de qualquer página para começar.

### Especificando detalhes da aplicação

O assistente de implantação espera que você forneça as seguintes informações:

- **App name** (obrigatório):Nome para sua aplicação.
  Uma [label](/docs/concepts/overview/working-with-objects/labels/) Com o nome será
  adicionado à implantação e serviço, se houver, que será implantado.

  O nome do aplicativo deve ser exclusivo dentro do [namespace](/docs/tasks/administer-cluster/namespaces/) kubernetes selecionado.
  Deve começar com um caractere minúsculo e terminar com um caractere minúsculo ou um número,
  e conter apenas letras minúsculas, números e traços (-). Está limitado a 24 caracteres.
  Espaços à frente ou atrás serão ignorados.

- **Container image** (obrigatório):
  A URL de uma imagem de conteiner pública do Docker 
  The URL of a public Docker [container image](/docs/concepts/containers/images/) em qualquer registry,
  ou imagem privada (comumente hospedado no Google Container Registry ou Docker Hub).
  A especificação da imagem do contêiner deve terminar com um cólon.

- **Number of pods** (obrigatório): O número de alvo de pods que você deseja que seu aplicativo seja implantado.
  O valor deve ser um inteiro positivo.

  Um [Deployment](/docs/concepts/workloads/controllers/deployment/) será criado para
  manter o número desejado de pods em seu cluster.

- **serviço** (opcional): Para algumas partes da sua aplicação (por exemplo, frontends), você pode querer expor um
  [serviço](/docs/concepts/serviços-networking/serviço/) em um externo,
  talvez endereço IP público fora do seu cluster (serviço externa).

  {{< note >}}
  Para serviços externos, talvez seja necessário abrir uma ou mais portas para fazê-lo.
  {{< /note >}}

  Outros serviços que são visíveis apenas de dentro do cluster são chamadas de serviços internos.

  Independentemente do tipo de serviço, se você optar por criar um serviço e seu contêiner ouve
  Em uma porta (recebida), você precisa especificar duas portas.
  O serviço será criado mapeando a porta (recebida) para a porta de destino vista pelo contêiner.
  Este serviço roteará para seus pods implantados. Os protocolos suportados são TCP e UDP.
  O nome DNS interno para este serviço será o valor especificado como nome do aplicativo acima.

Se necessário, você pode expandir a seção **Advanced options** onde você pode especificar mais configurações:

- **Description**: O texto que você colocar aqui será adicionado como uma
  [anotação](/docs/concepts/overview/working-with-objects/annotations/)
  para a implantação e exibida nos detalhes do aplicativo.

- **Labels**: [labels](/docs/concepts/overview/working-with-objects/labels/) padrão ser usado
  Para sua aplicação, o nome e a versão do aplicativo.
  Você pode especificar rótulos adicionais a serem aplicados à implantação, Serviço (se houver) e pods,
  como liberação, ambiente, nível, partição e trilha de liberação.

  Exemplo:

  ```conf
  release=1.0
  tier=frontend
  environment=pod
  track=stable
  ```

- **Namespace**: Kubernetes suporta vários clusters virtuais apoiados pelo mesmo cluster físico.
  Esses clusters virtuais são chamados [namespaces](/docs/tasks/administer-cluster/namespaces/).
  Eles permitem que você divida os recursos em grupos logicamente chamados.

  Dashboard oferece todos os namespaces disponíveis em uma lista suspensa e permite criar um novo namespace.
  O nome do namespace pode conter no máximo 63 caracteres alfanuméricos e traços (-), mas não pode conter letras maiúsculas.
  Os nomes dos namespaces não devem consistir em apenas números.
  Se o nome for definido como um número, como 10, o pod será colocado no namespace padrão.

  Caso a criação do namespace seja bem sucedido, ele é selecionado por padrão.
  Se a criação falhar, o primeiro namespace será selecionado.

- **Image Pull Secret**:
  Caso a imagem do contêiner Docker especificado seja privada, pode exigir
  credenciais de [pull secret](/docs/concepts/configuration/secret/).

  Dashboard oferece todos os segredos disponíveis em um dropdown e permite que você crie um novo segredo.
  O nome secreto deve seguir a sintaxe do nome de domínio DNS, por exemplo `new.image-pull.secret`.
  O conteúdo de um segredo deve ser codificado à base64 e especificado em um arquivo
  [`.dockercfg`](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
  O nome secreto pode consistir em um máximo de 253 caracteres.

  Caso a criação da imagem pull secret seja bem sucedida, ele é selecionado por padrão. Se a criação falhar, nenhum segredo é aplicado.

- **CPU requirement (cores)** and **Memory requirement (MiB)**:
  You can specify the minimum [resource limits](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
  for the container. By default, Pods run with unbounded CPU and memory limits.

- **Run command** and **Run command arguments**:
  By default, your containers run the specified Docker image's default
  [entrypoint command](/docs/tasks/inject-data-application/define-command-argument-container/).
  You can use the command options and arguments to override the default.

- **Run as privileged**: This setting determines whether processes in
  [privileged containers](/docs/concepts/workloads/pods/#privileged-mode-for-containers)
  are equivalent to processes running as root on the host.
  Privileged containers can make use of capabilities like manipulating the network stack and accessing devices.

- **Environment variables**: Kubernetes exposes serviços through
  [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
  You can compose environment variable or pass arguments to your commands using the values of environment variables.
  They can be used in applications to find a serviço.
  Values can reference other variables using the `$(VAR_NAME)` syntax.

### Uploading a YAML or JSON file

Kubernetes supports declarative configuration.
In this style, all configuration is stored in manifests (YAML or JSON configuration files).
The manifests use Kubernetes [API](/docs/concepts/overview/kubernetes-api/) resource schemas.

As an alternative to specifying application details in the deploy wizard,
you can define your application in one or more manifests, and upload the files using Dashboard.

## Using Dashboard

Following sections describe views of the Kubernetes Dashboard UI; what they provide and how can they be used.

### Navigation

When there are Kubernetes objects defined in the cluster, Dashboard shows them in the initial view.
By default only objects from the _default_ namespace are shown and
this can be changed using the namespace selector located in the navigation menu.

Dashboard shows most Kubernetes object kinds and groups them in a few menu categories.

#### Admin overview

For cluster and namespace administrators, Dashboard lists Nodes, Namespaces and PersistentVolumes and has detail views for them.
Node list view contains CPU and memory usage metrics aggregated across all Nodes.
The details view shows the metrics for a Node, its specification, status,
allocated resources, events and pods running on the node.

#### Workloads

Shows all applications running in the selected namespace.
The view lists applications by workload kind (for example: Deployments, ReplicaSets, StatefulSets).
and each workload kind can be viewed separately.
The lists summarize actionable information about the workloads,
such as the number of ready pods for a ReplicaSet or current memory usage for a Pod.

Detail views for workloads show status and specification information and
surface relationships between objects.
For example, Pods that ReplicaSet is controlling or new ReplicaSets and HorizontalPodAutoscalers for Deployments.

#### serviços

Shows Kubernetes resources that allow for exposing serviços to external world and
discovering them within a cluster.
For that reason, serviço and Ingress views show Pods targeted by them,
internal endpoints for cluster connections and external endpoints for external users.

#### Storage

Storage view shows PersistentVolumeClaim resources which are used by applications for storing data.

#### ConfigMaps and Secrets {#config-maps-and-secrets}

Shows all Kubernetes resources that are used for live configuration of applications running in clusters.
The view allows for editing and managing config objects and displays secrets hidden by default.

#### Logs viewer

Pod lists and detail pages link to a logs viewer that is built into Dashboard.
The viewer allows for drilling down logs from containers belonging to a single Pod.

![Logs viewer](/images/docs/ui-dashboard-logs-view.png)

## {{% heading "whatsnext" %}}


For more information, see the
[Kubernetes Dashboard project page](https://github.com/kubernetes/dashboard).

