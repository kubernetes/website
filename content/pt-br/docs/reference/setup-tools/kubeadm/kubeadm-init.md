---
title: kubeadm init
content_type: concept
weight: 20
---

<!-- overview -->

Este comando inicializa um nó da camada de gerenciamento do Kubernetes.

<!-- body -->

{{< include "generated/kubeadm_init.md" >}}

### Fluxo do comando Init {#init-workflow}

O comando `kubeadm init` inicializa um nó da camada de gerenciamento do Kubernetes
através da execução dos passos abaixo:

1. Roda uma série de verificações pré-execução para validar o estado do sistema
   antes de efetuar mudanças. Algumas verificações emitem apenas avisos, outras
   são consideradas erros e cancelam a execução do kubeadm até que o problema
   seja corrigido ou que o usuário especifique a opção
   `--ignore-preflight-errors=<lista-de-erros-a-ignorar>`.

1. Gera uma autoridade de certificação (CA) auto-assinada para criar identidades
   para cada um dos componentes do cluster. O usuário pode informar seu próprio
   certificado CA e/ou chave ao instalar estes arquivos no diretório de
   certificados configurado através da opção `--cert-dir` (por padrão, este
   diretório é `/etc/kubernetes/pki`).
   Os certificados do servidor da API terão entradas adicionais para nomes
   alternativos (_subject alternative names_, ou SANs) especificados através da
   opção `--apiserver-cert-extra-sans`. Estes argumentos serão modificados para
   caracteres minúsculos quando necessário.

1. Escreve arquivos kubeconfig adicionais no diretório `/etc/kubernetes` para o
   kubelet, para o gerenciador de controladores e para o escalonador utilizarem
   ao conectarem-se ao servidor da API, cada um com sua própria identidade, bem
   como um arquivo kubeconfig adicional para administração do cluster chamado
   `admin.conf`.

1. Gera manifestos de Pods estáticos para o servidor da API, para o gerenciador
   de controladores e para o escalonador. No caso de uma instância externa do
   etcd não ter sido providenciada, um manifesto de Pod estático adicional é
   gerado para o etcd.

   Manifestos de Pods estáticos são escritos no diretório `/etc/kubernetes/manifests`;
   o kubelet lê este diretório em busca de manifestos de Pods para criar na
   inicialização.

   Uma vez que os Pods da camada de gerenciamento estejam criados e rodando,
   a sequência de execução do comando `kubeadm init` pode continuar.

1. Aplica _labels_ e _taints_ ao nó da camada de gerenciamento de modo que cargas
   de trabalho adicionais não sejam escalonadas para executar neste nó.

1. Gera o token que nós adicionais podem utilizar para associarem-se a uma
   camada de gerenciamento no futuro. Opcionalmente, o usuário pode fornecer um
   token através da opção `--token`, conforme descrito na documentação do
   comando [kubeadm token](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-token/).

1. Prepara todas as configurações necessárias para permitir que nós se associem
   ao cluster utilizando os mecanismos de
   [Tokens de Inicialização](/pt-br/docs/reference/access-authn-authz/bootstrap-tokens/)
   e [Inicialização TLS](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/):

   - Escreve um ConfigMap para disponibilizar toda a informação necessária para
     associar-se a um cluster e para configurar regras de controle de acesso
     baseada em funções (RBAC).

   - Permite o acesso dos tokens de inicialização à API de assinaturas CSR.

   - Configura a auto-aprovação de novas requisições CSR.

   Para mais informações, consulte
   [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/).

1. Instala um servidor DNS (CoreDNS) e os componentes adicionais do kube-proxy
   através do servidor da API. A partir da versão 1.11 do Kubernetes, CoreDNS é
   o servidor DNS padrão. Mesmo que o servidor DNS seja instalado nessa etapa,
   o seu Pod não será escalonado até que um CNI seja instalado.

   {{< warning >}}
   O uso do kube-dns com o kubeadm foi descontinuado na versão v1.18 e removido
   na versão v1.21 do Kubernetes.
   {{< /warning >}}

### Utilizando fases de inicialização com o kubeadm {#init-phases}

O kubeadm permite que você crie um nó da camada de gerenciamento em fases
utilizando o comando `kubeadm init phase`.

Para visualizar a lista ordenada de fases e subfases, você pode rodar o comando
`kubeadm init --help`. A lista estará localizada no topo da ajuda e cada fase
tem sua descrição listada juntamente com o comando. Perceba que ao rodar o
comando `kubeadm init` todas as fases e subfases são executadas nesta ordem
exata.

Algumas fases possuem flags específicas. Caso você deseje ver uma lista de todas
as opções disponíveis, utilize a flag `--help`. Por exemplo:

```shell
sudo kubeadm init phase control-plane controller-manager --help
```

Você também pode utilizar a flag `--help` para ver uma lista de subfases de uma
fase superior:

```shell
sudo kubeadm init phase control-plane --help
```

`kubeadm init` também expõe uma flag chamada `--skip-phases` que pode ser
utilizada para pular a execução de certas fases. Esta flag aceita uma lista de
nomes de fases. Os nomes de fases aceitos estão descritos na lista ordenada
acima.

Um exemplo:

```shell
sudo kubeadm init phase control-plane all --config=configfile.yaml
sudo kubeadm init phase etcd local --config=configfile.yaml
# agora você pode modificar os manifestos da camada de gerenciamento e do etcd
sudo kubeadm init --skip-phases=control-plane,etcd --config=configfile.yaml
```

O que este exemplo faz é escrever os manifestos da camada de gerenciamento e do
etcd no diretório `/etc/kubernetes/manifests`, baseados na configuração descrita
no arquivo `configfile.yaml`. Isto permite que você modifique os arquivos e
então pule estas fases utilizando a opção `--skip-phases`. Ao chamar o último
comando, você cria um nó da camada de gerenciamento com os manifestos
personalizados.

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Como alternativa, você pode também utilizar o campo `skipPhases` na configuração
`InitConfiguration`.

### Utilizando kubeadm init com um arquivo de configuração {#config-file}

{{< caution >}}
O arquivo de configuração ainda é considerado uma funcionalidade de estado beta
e pode mudar em versões futuras.
{{< /caution >}}

É possível configurar o comando `kubeadm init` com um arquivo de configuração ao
invés de argumentos de linha de comando, e algumas funcionalidades mais avançadas
podem estar disponíveis apenas como opções do arquivo de configuração. Este
arquivo é fornecido utilizando a opção `--config` e deve conter uma estrutura
`ClusterConfiguration` e, opcionalmente, mais estruturas separadas por `---\n`.
Combinar a opção `--config` com outras opções de linha de comando pode não ser
permitido em alguns casos.

A configuração padrão pode ser emitida utilizando o comando
[kubeadm config print](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-config/).

Se a sua configuração não estiver utilizando a última versão, é **recomendado**
que você migre utilizando o comando
[kubeadm config migrate](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-config/).

Para mais informações sobre os campos e utilização da configuração, você pode
consultar a
[página de referência da API](/docs/reference/config-api/kubeadm-config.v1beta3/).

### Utilizando kubeadm init com _feature gates_ {#feature-gates}

O kubeadm suporta um conjunto de _feature gates_ que são exclusivos do kubeadm e
podem ser utilizados somente durante a criação de um cluster com `kubeadm init`.
Estas funcionalidades podem controlar o comportamento do cluster. Os
_feature gates_ são removidos assim que uma funcionalidade atinge a disponibilidade
geral (_general availability_, ou GA).

Para informar um _feature gate_, você pode utilizar a opção `--feature-gates`
do comando `kubeadm init`, ou pode adicioná-las no campo `featureGates` quando
um [arquivo de configuração](/docs/reference/config-api/kubeadm-config.v1beta3/#kubeadm-k8s-io-v1beta3-ClusterConfiguration)
é utilizado através da opção `--config`.

A utilização de
[_feature gates_ dos componentes principais do Kubernetes](/docs/reference/command-line-tools-reference/feature-gates)
com o kubeadm não é suportada. Ao invés disso, é possível enviá-los através da
[personalização de componentes com a API do kubeadm](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).

Lista dos _feature gates_:

{{< table caption="_feature gates_ do kubeadm" >}}
_Feature gate_                | Valor-padrão | Versão Alfa | Versão Beta
:-----------------------------|:-------------|:------------|:-----------
`PublicKeysECDSA`             | `false`      | 1.19        | -
`RootlessControlPlane`        | `false`      | 1.22        | -
`UnversionedKubeletConfigMap` | `true`       | 1.22        | 1.23
{{< /table >}}

{{< note >}}
Assim que um _feature gate_ atinge a disponibilidade geral, ele é removido desta
lista e o seu valor fica bloqueado em `true` por padrão. Ou seja, a funcionalidade
estará sempre ativa.
{{< /note >}}

Descrição dos _feature gates_:

`PublicKeysECDSA`
: Pode ser utilizado para criar um cluster que utilize certificados ECDSA no
lugar do algoritmo RSA padrão. A renovação dos certificados ECDSA existentes
também é suportada utilizando o comando `kubeadm certs renew`, mas você não pode
alternar entre os algoritmos RSA e ECDSA dinamicamente ou durante atualizações.

`RootlessControlPlane`
: Quando habilitada esta opção, os componentes da camada de gerenciamento cuja
instalação de Pods estáticos é controlada pelo kubeadm, como o `kube-apiserver`,
`kube-controller-manager`, `kube-scheduler` e `etcd`, têm seus contêineres
configurados para rodarem como usuários não-root. Se a opção não for habilitada,
estes componentes são executados como root. Você pode alterar o valor deste
_feature gate_ antes de atualizar seu cluster para uma versão mais recente do
Kubernetes.

`UnversionedKubeletConfigMap`
: Esta opção controla o nome do {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}
onde o kubeadm armazena os dados de configuração do kubelet. Quando esta opção
não for especificada ou estiver especificada com o valor `true`, o ConfigMap
será nomeado `kubelet-config`. Caso esteja especificada com o valor `false`, o
nome do ConfigMap incluirá as versões maior e menor do Kubernetes instalado
(por exemplo, `kubelet-config-{{< skew currentVersion >}}`). O kubeadm garante
que as regras de RBAC para leitura e escrita deste ConfigMap serão apropriadas
para o valor escolhido. Quando o kubeadm cria este ConfigMap (durante a execução
dos comandos `kubeadm init` ou `kubeadm upgrade apply`), o kubeadm irá respeitar
o valor da opção `UnversionedKubeletConfigMap`. Quando tal ConfigMap for lido
(durante a execução dos comandos `kubeadm join`, `kubeadm reset`,
`kubeadm upgrade...`), o kubeadm tentará utilizar o nome do ConfigMap sem a
versão primeiro. Se esta operação não for bem-sucedida, então o kubeadm irá
utilizar o nome legado (versionado) para este ConfigMap.

{{< note >}}
Informar a opção `UnversionedKubeletConfigMap` com o valor `false` é suportado,
mas está **descontinuado**.
{{< /note >}}

### Adicionando parâmetros do kube-proxy {#kube-proxy}

Para informações sobre como utilizar parâmetros do kube-proxy na configuração
do kubeadm, veja:
- [referência do kube-proxy](/docs/reference/config-api/kube-proxy-config.v1alpha1/)

Para informações sobre como habilitar o modo IPVS com o kubeadm, veja:
- [IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md)

### Informando opções personalizadas em componentes da camada de gerenciamento {#control-plane-flags}

Para informações sobre como passar as opções aos componentes da camada de
gerenciamento, veja:
- [opções da camada de gerenciamento](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)

### Executando o kubeadm sem uma conexão à internet {#without-internet-connection}

Para executar o kubeadm sem uma conexão à internet, você precisa baixar as imagens
de contêiner requeridas pela camada de gerenciamento.

Você pode listar e baixar as imagens utilizando o subcomando
`kubeadm config images`:

```shell
kubeadm config images list
kubeadm config images pull
```

Você pode passar a opção `--config` para os comandos acima através de um
[arquivo de configuração do kubeadm](#config-file) para controlar os campos
`kubernetesVersion` e `imageRepository`.

Todas as imagens padrão hospedadas em `registry.k8s.io` que o kubeadm requer suportam
múltiplas arquiteturas.

### Utilizando imagens personalizadas {#custom-images}

Por padrão, o kubeadm baixa imagens hospedadas no repositório de contêineres
`registry.k8s.io`. Se a versão requisitada do Kubernetes é um rótulo de integração
contínua (por exemplo, `ci/latest`), o repositório de contêineres
`gcr.io/k8s-staging-ci-images` é utilizado.

Você pode sobrescrever este comportamento utilizando o
[kubeadm com um arquivo de configuração](#config-file). Personalizações permitidas
são:

* Fornecer um valor para o campo `kubernetesVersion` que afeta a versão das
  imagens.
* Fornecer um repositório de contêineres alternativo através do campo
  `imageRepository` para ser utilizado no lugar de `registry.k8s.io`.
* Fornecer um valor específico para os campos `imageRepository` e `imageTag`,
  correspondendo ao repositório de contêineres e tag a ser utilizada, para as imagens
  dos componentes etcd ou CoreDNS.

Caminhos de imagens do repositório de contêineres padrão `registry.k8s.io` podem diferir
dos utilizados em repositórios de contêineres personalizados através do campo
`imageRepository` devido a razões de retrocompatibilidade. Por exemplo, uma
imagem pode ter um subcaminho em `registry.k8s.io/subcaminho/imagem`, mas quando
utilizado um repositório de contêineres personalizado, o valor padrão será
`meu.repositoriopersonalizado.io/imagem`.

Para garantir que você terá as imagens no seu repositório personalizado em
caminhos que o kubeadm consiga consumir, você deve:

* Baixar as imagens dos caminhos padrão `registry.k8s.io` utilizando o comando
  `kubeadm config images {list|pull}`.
* Subir as imagens para os caminhos listados no resultado do comando
  `kubeadm config images list --config=config.yaml`, onde `config.yaml` contém
  o valor customizado do campo `imageRepository`, e/ou `imageTag` para os
  componentes etcd e CoreDNS.
* Utilizar o mesmo arquivo `config.yaml` quando executar o comando `kubeadm init`.

#### Imagens personalizadas para o _sandbox_ (imagem `pause`) {#custom-pause-image}

Para configurar uma imagem personalizada para o _sandbox_, você precisará
configurar o {{< glossary_tooltip text="agente de execução de contêineres" term_id="container-runtime" >}}
para utilizar a imagem.
Verifique a documentação para o seu agente de execução de contêineres para
mais informações sobre como modificar esta configuração; para alguns agentes de
execução de contêiner você também encontrará informações no tópico
[Agentes de Execução de Contêineres](/docs/setup/production-environment/container-runtimes/).

### Carregando certificados da camada de gerenciamento no cluster

Ao adicionar a opção `--upload-certs` ao comando `kubeadm init` você pode
subir temporariamente certificados da camada de gerenciamento em um Secret no
cluster. Este Secret expira automaticamente após 2 horas. Os certificados são
encriptados utilizando uma chave de 32 bytes que pode ser especificada através
da opção `--certificate-key`. A mesma chave pode ser utilizada para baixar
certificados quando nós adicionais da camada de gerenciamento estão se associando
ao cluster, utilizando as opções `--control-plane` e `--certificate-key` ao rodar
`kubeadm join`.

O seguinte comando de fase pode ser usado para subir os certificados novamente
após a sua expiração:

```shell
kubeadm init phase upload-certs --upload-certs --certificate-key=ALGUM_VALOR --config=ALGUM_ARQUIVO_YAML
```

Se a opção `--certificate-key` não for passada aos comandos `kubeadm init`
e `kubeadm init phase upload-certs`, uma nova chave será gerada automaticamente.

O comando abaixo pode ser utilizado para gerar uma nova chave sob demanda:

```shell
kubeadm certs certificate-key
```

### Gerenciamento de certificados com o kubeadm

Para informações detalhadas sobre gerenciamento de certificados com o kubeadm,
consulte [Gerenciamento de Certificados com o kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).
O documento inclui informações sobre a utilização de autoridades de certificação
(CA) externas, certificados personalizados e renovação de certificados.

### Gerenciando o arquivo _drop-in_ do kubeadm para o kubelet {#kubelet-drop-in}

O pacote `kubeadm` é distribuído com um arquivo de configuração para rodar o
`kubelet` utilizando `systemd`. Note que o kubeadm nunca altera este arquivo.
Este arquivo _drop-in_ é parte do pacote DEB/RPM do kubeadm.

Para mais informações, consulte
[Gerenciando o arquivo drop-in do kubeadm para o systemd](/docs/setup/production-environment/tools/kubeadm/kubelet-integration/#the-kubelet-drop-in-file-for-systemd).

### Usando o kubeadm com agentes de execução CRI

Por padrão, o kubeadm tenta detectar seu agente de execução de contêineres. Para
mais detalhes sobre esta detecção, consulte o
[guia de instalação CRI do kubeadm](/pt-br/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#instalando-agente-de-execucao).

### Configurando o nome do nó

Por padrão, o `kubeadm` gera um nome para o nó baseado no endereço da máquina.
Você pode sobrescrever esta configuração utilizando a opção `--node-name`. Esta
opção passa o valor apropriado para a opção [`--hostname-override`](/docs/reference/command-line-tools-reference/kubelet/#options)
do kubelet.

Note que sobrescrever o hostname de um nó pode
[interferir com provedores de nuvem](https://github.com/kubernetes/website/pull/8873).

### Automatizando o kubeadm

Ao invés de copiar o token que você obteve do comando `kubeadm init` para cada nó,
como descrito no [tutorial básico do kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/),
você pode paralelizar a distribuição do token para facilitar a automação.
Para implementar esta automação, você precisa saber o endereço IP que o nó da
camada de gerenciamento irá ter após a sua inicialização, ou utilizar um nome
DNS ou um endereço de um balanceador de carga.

1. Gere um token. Este token deve ter a forma `<string de 6 caracteres>.<string de 16 caracteres>`.
   Mais especificamente, o token precisa ser compatível com a expressão regular:
   `[a-z0-9]{6}\.[a-z0-9]{16}`.

   O kubeadm pode gerar um token para você:

   ```shell
    kubeadm token generate
   ```

1. Inicialize o nó da camada de gerenciamento e os nós de carga de trabalho de
   forma concorrente com este token. Conforme os nós forem iniciando, eles
   deverão encontrar uns aos outros e formar o cluster. O mesmo argumento
   `--token` pode ser utilizado em ambos os comandos `kubeadm init` e
   `kubeadm join`.

1. O mesmo procedimento pode ser feito para a opção `--certificate-key` quando
   nós adicionais da camada de gerenciamento associarem-se ao cluster. A chave
   pode ser gerada utilizando:

   ```shell
   kubeadm certs certificate-key
   ```

Uma vez que o cluster esteja inicializado, você pode buscar as credenciais para
a camada de gerenciamento no caminho `/etc/kubernetes/admin.conf` e utilizá-las
para conectar-se ao cluster.

Note que este tipo de inicialização tem algumas garantias de segurança relaxadas
pois ele não permite que o hash do CA raiz seja validado com a opção
`--discovery-token-ca-cert-hash` (pois este hash não é gerado quando os nós são
provisionados). Para detalhes, veja a documentação do comando
[kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/).

## {{% heading "whatsnext" %}}

* [kubeadm init phase](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/)
  para entender mais sobre as fases do comando `kubeadm init`
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) para
  inicializar um nó de carga de trabalho do Kubernetes e associá-lo ao cluster
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/)
  para atualizar um cluster do Kubernetes para uma versão mais recente
* [kubeadm reset](/pt-br/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
  para reverter quaisquer mudanças feitas neste host pelos comandos
  `kubeadm init` ou `kubeadm join`
