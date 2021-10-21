---
title: Implantar e acessar o Kubernetes Dashboard
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
Você pode usar o dashboard para implantar aplicações contêineres para um cluster Kubernetes,
solucione problemas de seu aplicativo conteinerizado e gerencie os recursos do cluster.
Você pode usar o dashboard para obter uma visão geral dos aplicações em execução no seu cluster,
bem como para criar ou modificar recursos individuais do Kubernetes
(como Deploys, tarefas, daemonsets, etc).
Por exemplo, você pode dimensionar um deploy, iniciar uma atualização de rolamento, reiniciar um pod
ou criar deploy para novos aplicações usando um assistente de deploy.

Dashboard também fornece informações sobre o estado dos recursos da Kubernetes em seu cluster e em quaisquer erros que possam ter ocorrido.

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

- **Nome do App** (obrigatório):Nome para sua aplicação.
  Uma [label](/docs/concepts/overview/working-with-objects/labels/) Com o nome será
  adicionado à implantação e serviço, se houver, que será implantado.

  O nome do aplicativo deve ser exclusivo dentro do [namespace](/docs/tasks/administer-cluster/namespaces/) kubernetes selecionado.
  Deve começar com um caractere minúsculo e terminar com um caractere minúsculo ou um número,
  e conter apenas letras minúsculas, números e traços (-). Está limitado a 24 caracteres.
  Espaços à frente ou atrás serão ignorados.

- **Imagem do contênier** (obrigatório):
  A URL de uma imagem de conteiner pública do Docker 
  The URL of a public Docker [container image](/docs/concepts/containers/images/) em qualquer registry,
  ou imagem privada (comumente hospedado no Google Container Registry ou Docker Hub).
  A especificação da imagem do contêiner deve terminar com um cólon.

- **Número de pods** (obrigatório): O número de alvo de pods que você deseja que seu aplicativo seja implantado.
  O valor deve ser um inteiro positivo.

  Um [Deployment](/docs/concepts/workloads/controllers/deployment/) será criado para
  manter o número desejado de pods em seu cluster.

- **Serviço** (opcional): Para algumas partes da sua aplicação (por exemplo, frontends), você pode querer expor um
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

- **Descrição**: O texto que você colocar aqui será adicionado como uma
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

- **Requisitos de CPU (núcleos)** e **Requisitos de Memória (MiB)**:
  Você pode especificar o limite mínimo de [recursos](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
  para o contêiner. Por padrão, as vagens são executadas com limites de memória e memória ilimitados.

- **Executar comando** and **Executar comandos com argumentos**:
  Por padrão, seus contêineres Docker executam o [comando entrypoint](/docs/tasks/inject-data-application/define-command-argument-container/).
  padrão da imagem especificada.
  Você pode usar as opções de comando e argumentos para substituir o padrão.

- **Executar com privilégios**: Essa configuração determina se os processos em
  [contêineres com privilégios](/docs/concepts/workloads/pods/#privileged-mode-for-containers)
  são equivalentes a processos em execução como root no host.
  Contêineres com privilégios podem fazer uso de recursos como manipular a pilha de rede e acessando dispositivos.

- **Variáveis de ambiente**: Kubernetes expõe serviços através de
  [variáveis de ambiente](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
  Você pode compor uma variável de ambiente ou passar argumentos para seus comandos usando os valores das variáveis de ambiente.
  Eles podem ser usados em aplicações para encontrar um serviço.
  Valores podem fazer referência a outras variáveis usando a sintaxe `$(VAR_NAME)`.

### Carregando um arquivo YAML ou JSON

Kubernetes suporta a configuração declarativa.
Nesse estilo, toda a configuração é armazenada em manifestos (arquivos de configuração YAML ou JSON).
Os manifestos usam os esquemas de recursos da [API](/docs/concepts/overview/kubernetes-api/) Kubernetes.

Como alternativa para especificar detalhes do aplicativo no Reploy Wizard,
Você pode definir sua aplicação em um ou mais manifestos e carregar os arquivos usando o Dashboard.

## Usando o Dashboard

As seções seguintes descrevem as visualizações da interface de usuário do Dashboard Kubernetes; o que eles fornecem e como eles podem ser usados.

### Navegação

Quando há objetos Kubernetes definidos no cluster, o painel mostra-os na visualização inicial.
Por padrão, somente objetos do namespace _default_ são mostrados e
Isso pode ser alterado usando o seletor de namespace localizado no menu de navegação.

Dashboard mostra a maioria dos tipos de objeto Kubernetes e os agrupa em algumas categorias de menu.

#### Visão geral do administrador

Para administradores de cluster e namespace, o painel liste os nós, namespaces e persistentvolumes e tem exibições de detalhes para eles.
A visualização de lista de nó contém métricas de uso de CPU e memória agregadas em todos os nós.
A visualização Detalhes mostra as métricas para um nó, sua especificação, status,
recursos alocados, eventos e vagens em execução no nó.

#### Cargas de trabalho

Mostra todos os aplicações em execução no namespace selecionado.
A exibição lista aplicações pelo tipo de carga de trabalho (por exemplo: Deployments, ReplicaSets, StatefulSets).
e cada tipo de carga de trabalho pode ser visto separadamente.
As listas resumem informações acionáveis sobre as cargas de trabalho,
como o número de pods prontos para um uso de replicaset ou de memória atual para um pod.

Visualizações de detalhes para cargas de trabalho mostram informações de status e especificação e
relações superficiais entre objetos.
Pods controlados pela ReplicaSet ou novas ReplicaSets e HorizontalPodAutoscalers para Deployments.

#### Serviços

Mostra recursos kubernetes que permitem a exposição de servios para o mundo externo e
descobrindo-os dentro de um cluster.
Por esse motivo, o Serviço e a Ingress Views mostram pods direcionadas por eles,
endpoints internos para conexões de cluster e endpoints externos para usuários externos.

#### Armazenar

Visualização de armazenamento mostra recursos PersistentVolumeClaim que são usados por aplicações para armazenar dados.

#### ConfigMaps e Secrets {#config-maps-and-secrets}

Mostra todos os recursos kubernetes que são usados para a configuração em tempo real de aplicações em execução em clusters.
A visualização permite editar e gerenciar objetos de configuração e exibe segredos ocultos por padrão.

#### Visualização de Logs

Listas de listas e detalhes do POD link para um visualizador de logs que é construído no painel.
O espectador permite que os logs de perfuração de contêineres pertencem a uma única vagem.

![visualização de Logs](/images/docs/ui-dashboard-logs-view.png)

## {{% heading "whatsnext" %}}


Para mais informações, veja a
[página do projeto Kubernetes Dashboard](https://github.com/kubernetes/dashboard).

