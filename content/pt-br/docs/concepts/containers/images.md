---
title: Imagens
content_type: concept
weight: 10
hide_summary: true # Listed separately in section index
---

<!-- overview -->

Uma imagem de contêiner representa dados binários que encapsulam uma aplicação e todas as suas dependências de software. As imagens de contêiner são pacotes de software executáveis que podem ser executados de forma autônoma e que fazem suposições muito bem definidas sobre seu agente de execução do ambiente.

Normalmente, você cria uma imagem de contêiner da sua aplicação e a envia para um registro antes de fazer referência a ela em um {{< glossary_tooltip text="Pod" term_id="pod" >}}.

Esta página fornece um resumo sobre o conceito de imagem de contêiner.

{{< note >}}
Se você está procurando pelas imagens de contêiner de uma versão do Kubernetes
(como a v{{< skew latestVersion >}}, a versão menor mais recente),
visite [Download Kubernetes](https://kubernetes.io/releases/download/).
{{< /note >}}

<!-- body -->

## Nomes das imagens

As imagens de contêiner geralmente recebem um nome como `pause`, `exemplo/meuconteiner`, ou `kube-apiserver`.
As imagens também podem incluir um hostname de algum registro; por exemplo: `exemplo.registro.ficticio/nomeimagem`,
e um possível número de porta; por exemplo: `exemplo.registro.ficticio:10443/nomeimagem`.

Se você não especificar um nome de host do registro, o Kubernetes assume que você está se referindo ao [registro público do Docker](https://hub.docker.com/).
Você pode alterar esse comportamento definindo um registro de imagem padrão na configuração do [agente de execução do contêiner](/docs/setup/production-environment/container-runtimes/).

Após a parte do nome da imagem, você pode adicionar uma _tag_ ou _digest_ (da mesma forma que faria ao usar comandos
como `docker` ou `podman`). As tags permitem identificar diferentes versões da mesma série de imagens.
Digests são identificadores únicos para uma versão específica de uma imagem. Digests são hashes do conteúdo da imagem e são imutáveis. As tags podem ser movidas para apontar para imagens diferentes, mas os digests são fixos.

Tags de imagem consistem em letras minúsculas e maiúsculas, dígitos, sublinhados (`_`),
pontos (`.`) e hifens (`-`). Elas podem ter até 128 caracteres de comprimento e devem seguir
o seguinte padrão de expressão regular: `[a-zA-Z0-9_][a-zA-Z0-9._-]{0,127}`.
Você pode ler mais sobre e encontrar a expressão regular de validação na
[Especificação de Distribuição OCI](https://github.com/opencontainers/distribution-spec/blob/master/spec.md#workflow-categories).
Se você não especificar uma tag, o Kubernetes assume que você está se referindo à tag `latest`.

Digests de imagem consistem em um algoritmo de hash (como `sha256`) e um valor de hash. Por exemplo:
`sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07`.
Você pode encontrar mais informações sobre o formato de digests na
[Especificação de Imagem OCI](https://github.com/opencontainers/image-spec/blob/master/descriptor.md#digests).

Alguns exemplos de nomes de imagem que o Kubernetes pode usar são:

- `busybox` - Nome da imagem apenas, sem tag ou digest. O Kubernetes usará o registro público do Docker e a tag `latest`. (Equivalente a `docker.io/library/busybox:latest`)
- `busybox:1.32.0` - Nome da imagem com tag. O Kubernetes usará o registro público do Docker. (Equivalente a `docker.io/library/busybox:1.32.0`)
- `registry.k8s.io/pause:latest` - Nome da imagem com um registro personalizado e tag `latest`.
- `registry.k8s.io/pause:3.5` - Nome da imagem com um registro personalizado e tag diferente de `latest`.
- `registry.k8s.io/pause@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` - Nome da imagem com digest.
- `registry.k8s.io/pause:3.5@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` - Nome da imagem com tag e digest. Apenas o digest será usado para o download.

## Atualizando imagens

Quando você cria um {{< glossary_tooltip text="Deployment" term_id="deployment" >}},
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}, Pod ou outro
objeto que inclua um template de Pod, por padrão a política utilizada para baixar as imagens dos contêineres nesse Pod será definida como `IfNotPresent` quando não especificada explicitamente.
Essa política faz com que o {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} ignore o download da imagem se ela já existir.

### Política de download de imagem

A `imagePullPolicy` de um contêiner e a tag da imagem afetam quando o
[kubelet](/docs/reference/command-line-tools-reference/kubelet/) tenta puxar (download) a imagem especificada.

Aqui está uma lista dos valores que você pode definir para `imagePullPolicy` e os efeitos
que esses valores têm:

`IfNotPresent`  
: a imagem será baixada apenas se não estiver presente localmente.

`Always`  
: toda vez que o kubelet iniciar um contêiner, ele consultará o registro de imagens
  de contêiner para resolver o nome para um
  [digest](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier).
  Se o kubelet tiver uma imagem de contêiner com exatamente esse digest em cache local, ele usará
  a imagem em cache; caso contrário, o kubelet fará o download da imagem com o digest resolvido
  e usará essa imagem para iniciar o contêiner.

`Never`  
: o kubelet não tenta buscar a imagem. Se a imagem já estiver presente localmente
  de alguma forma, o kubelet tentará iniciar o contêiner; caso contrário, a inicialização falhará.
  Veja [imagens pré-baixadas](#pre-pulled-images) para mais detalhes.

A semântica de cache do provedor de imagens subjacente torna mesmo
`imagePullPolicy: Always` eficiente, desde que o registro esteja acessível de forma confiável.
Seu agente de execução de contêiner pode perceber que as camadas da imagem já existem no nó,
evitando que precisem ser baixadas novamente.

{{< note >}}
Você deve evitar o uso da tag `:latest` ao implantar contêineres em produção,
pois isso torna mais difícil rastrear qual versão da imagem está em execução
e também dificulta realizar um rollback corretamente.

Em vez disso, especifique uma tag significativa como `v1.42.0` e/ou um digest.
{{< /note >}}

Para garantir que o Pod sempre use a mesma versão de uma imagem de contêiner,
você pode especificar o digest da imagem;
substitua `<image-name>:<tag>` por `<image-name>@<digest>`
(por exemplo, `image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`).

Ao usar tags de imagem, se o registro de imagens alterar o código que a tag representa,
você pode acabar com uma mistura de Pods executando o código antigo e o novo.
Um digest de imagem identifica de forma única uma versão específica da imagem,
então o Kubernetes executa o mesmo código sempre que inicia um contêiner com aquele nome
de imagem e digest especificado. Especificar uma imagem por digest fixa o código que será
executado, de modo que uma alteração no registro não leve a essa mistura de versões.

Existem [controladores de admissão](/docs/reference/access-authn-authz/admission-controllers/)
de terceiros que mutam Pods (e templates de Pods) quando eles são criados,
de forma que a carga de trabalho em execução seja definida com base em um digest de imagem
em vez de uma tag. Isso pode ser útil se você quiser garantir que toda sua carga de trabalho
esteja executando o mesmo código, independentemente das mudanças de tags no registro.

#### Política padrão de download de imagem {#imagepullpolicy-defaulting}

Quando você (ou um controlador) envia um novo Pod para o servidor de API, seu cluster define o campo
`imagePullPolicy` quando certas condições são atendidas:

- se você omitir o campo `imagePullPolicy` e especificar o digest da imagem do contêiner,
  o `imagePullPolicy` será automaticamente definido como `IfNotPresent`;
- se você omitir o campo `imagePullPolicy` e a tag da imagem do contêiner for `:latest`,
  o `imagePullPolicy` será automaticamente definido como `Always`;
- se você omitir o campo `imagePullPolicy` e não especificar uma tag para a imagem do contêiner,
  o `imagePullPolicy` será automaticamente definido como `Always`;
- se você omitir o campo `imagePullPolicy` e especificar uma tag para a imagem do contêiner
  que não seja `:latest`, o `imagePullPolicy` será automaticamente definido como `IfNotPresent`.

{{< note >}}
O valor de `imagePullPolicy` do contêiner é sempre definido quando o objeto é _criado_
pela primeira vez, e não é atualizado se a tag ou o digest da imagem for alterado posteriormente.

Por exemplo, se você criar um Deployment com uma imagem cuja tag _não_ é `:latest`,
e mais tarde atualizar a imagem desse Deployment para a tag `:latest`, o campo `imagePullPolicy`
_NÃO_ será alterado para `Always`. Você deve alterar manualmente a política de puxar imagem de qualquer
objeto após sua criação inicial.
{{< /note >}}

#### Download obrigatório da imagem

Se você deseja forçar sempre o download da imagem, pode fazer uma das seguintes opções:

- Defina o `imagePullPolicy` do contêiner como `Always`.
- Omita o `imagePullPolicy` e use `:latest` como a tag da imagem a ser usada;
  o Kubernetes definirá a política como `Always` ao enviar o Pod.
- Omita o `imagePullPolicy` e a tag da imagem a ser usada;
  o Kubernetes definirá a política como `Always` ao enviar o Pod.
- Ative o controlador de admissão [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages).

### ImagePullBackOff

Quando o kubelet começa a criar contêineres para um Pod usando um agente de execução de contêiner,
é possível que o contêiner esteja no estado [Waiting](/docs/concepts/workloads/pods/pod-lifecycle/#container-state-waiting) devido a `ImagePullBackOff`.

O status `ImagePullBackOff` significa que um contêiner não pôde ser iniciado porque o Kubernetes
não conseguiu fazer o download da imagem do contêiner (por motivos como nome de imagem inválido
ou tentativa de download de um registro privado sem `imagePullSecret`).
A parte `BackOff` indica que o Kubernetes continuará tentando fazer o download da imagem,
com um atraso incremental entre as tentativas.

O Kubernetes aumenta o intervalo entre cada tentativa até atingir um limite definido no código,
que é de 300 segundos (5 minutos).

### Download de imagem por classe de agente de execução

{{< feature-state feature_gate_name="RuntimeClassInImageCriApi" >}}
O Kubernetes inclui suporte em estado alpha para realizar o download de imagens com base na RuntimeClass de um Pod.

Se você habilitar o [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `RuntimeClassInImageCriApi`,
o kubelet passará a referenciar imagens de contêiner por uma tupla (nome da imagem, manipulador de agente de execução)
em vez de apenas pelo nome da imagem ou digest.
Seu {{< glossary_tooltip text="agente de execução do contêiner" term_id="container-runtime" >}} pode adaptar seu comportamento
com base no manipulador de agente de execução selecionado.
Fazer download de imagens com base na classe de agente de execução será útil para contêineres baseados em máquina virtual, como contêineres do tipo Windows Hyper-V.

## Downloads de imagem em série e em paralelo

Por padrão, o kubelet realiza downloads de imagens de forma sequencial. Em outras palavras,
o kubelet envia apenas uma solicitação de download de imagem por vez para o serviço de imagens.
Outras solicitações de download precisam aguardar até que a solicitação em andamento seja concluída.

Os Nós tomam decisões de download de imagem de forma isolada. Mesmo quando você usa downloads de imagem
em série, dois Nós diferentes podem puxar a mesma imagem em paralelo.

Se você quiser habilitar downloads de imagem em paralelo, pode definir o campo
`serializeImagePulls` como `false` na [configuração do kubelet](/docs/reference/config-api/kubelet-config.v1beta1/).
Com `serializeImagePulls` definido como `false`, as solicitações de download de imagem serão enviadas
imediatamente para o serviço de imagens, permitindo que várias imagens sejam puxadas ao mesmo tempo.

Ao habilitar downloads de imagem em paralelo, certifique-se de que o serviço de imagens do seu
agente de execução do contêiner pode lidar com esse tipo de operação.

O kubelet nunca realiza download de múltiplas imagens em paralelo para um único Pod. Por exemplo,
se você tiver um Pod com um Init Container e um contêiner de aplicação, os downloads de imagem desses
dois contêineres não serão paralelizados.
No entanto, se você tiver dois Pods que usam imagens diferentes, o kubelet puxará as imagens
em paralelo para os dois Pods diferentes, quando o download paralelo estiver habilitado.

### Máximo de downloads de imagem em paralelo

{{< feature-state for_k8s_version="v1.32" state="beta" >}}

Quando `serializeImagePulls` está definido como `false`, o kubelet, por padrão, não impõe limite
ao número máximo de imagens sendo puxadas ao mesmo tempo. Se você quiser limitar a quantidade
de downloads de imagem paralelos, pode definir o campo `maxParallelImagePulls` na configuração do kubelet.
Com `maxParallelImagePulls` definido como _n_, apenas _n_ imagens podem ser puxadas simultaneamente,
e qualquer download de imagem além de _n_ terá que aguardar até que pelo menos um download em andamento seja concluído.

Limitar o número de downloads de imagem paralelos ajuda a evitar que o processo de download consuma
muita largura de banda de rede ou I/O de disco quando esta funcionalidade estiver habilitada.

Você pode definir `maxParallelImagePulls` para um número positivo maior ou igual a 1.
Se você definir `maxParallelImagePulls` como maior ou igual a 2, também deverá definir
`serializeImagePulls` como `false`.
O kubelet não iniciará se as configurações de `maxParallelImagePulls` forem inválidas.

## Multiarquitetura de imagens com índice de imagens

Além de fornecer o binário das imagens, um registro de contêiner também pode servir um [índice de imagem do contêiner](https://github.com/opencontainers/image-spec/blob/master/image-index.md). Um índice de imagem pode apontar para múltiplos [manifestos da imagem](https://github.com/opencontainers/image-spec/blob/master/manifest.md) para versões específicas de arquitetura de um contêiner. A ideia é que você possa ter um nome para uma imagem (por exemplo: `pause`, `exemple/meuconteiner`, `kube-apiserver`) e permitir que diferentes sistemas busquem o binário da imagem correta para a arquitetura de máquina que estão usando.

O próprio Kubernetes normalmente nomeia as imagens de contêiner com o sufixo `-$(ARCH)`. Para retrocompatibilidade, gere as imagens mais antigas com sufixos. A ideia é gerar a imagem `pause` que tem o manifesto para todas as arquiteturas e `pause-amd64` que é retrocompatível com as configurações anteriores ou arquivos YAML que podem ter codificado as imagens com sufixos.

## Usando um registro privado

Os registros privados podem exigir chaves para acessar as imagens deles.
As credenciais podem ser fornecidas de várias maneiras:
  - Configurando nós para autenticação em um registro privado
     - todos os pods podem ler qualquer registro privado configurado
     - requer configuração de nó pelo administrador do cluster
   - Imagens pré-obtidas
     - todos os pods podem usar qualquer imagem armazenada em cache em um nó
     - requer acesso root a todos os nós para configurar
   - Especificando ImagePullSecrets em um Pod
     - apenas pods que fornecem chaves próprias podem acessar o registro privado
   - Extensões locais ou específicas do fornecedor
     - se estiver usando uma configuração de nó personalizado, você (ou seu provedor de nuvem) pode implementar seu mecanismo para autenticar o nó ao registro do contêiner.

Essas opções são explicadas com mais detalhes abaixo.

### Configurando nós para autenticação em um registro privado

As instruções específicas para configurar as credenciais dependem do agente de execução de contêiner
e do registro que você escolheu utilizar. Você deve consultar a documentação da sua solução
para obter as informações mais precisas.

Para um exemplo de configuração de um registro de imagens de contêiner privado, veja a tarefa
[Realizar download de uma Imagem a partir de um Registro Privado](/docs/tasks/configure-pod-container/pull-image-private-registry).
Esse exemplo utiliza um registro privado no Docker Hub.

### Provedor de credenciais do kubelet para downloads de imagem autenticados {#kubelet-credential-provider}

{{< note >}}
Essa abordagem é especialmente adequada quando o kubelet precisa buscar credenciais de registro de forma dinâmica.
É mais comumente usada com registros fornecidos por provedores de nuvem, onde os tokens de autenticação têm vida curta.
{{< /note >}}

Você pode configurar o kubelet para invocar um binário de plugin a fim de buscar dinamicamente
as credenciais de registro para uma imagem de contêiner.
Essa é a maneira mais robusta e versátil de obter credenciais para registros privados,
mas também exige uma configuração no nível do kubelet para ser habilitada.

Veja [Configurar um provedor de credenciais de imagem no kubelet](/docs/tasks/administer-cluster/kubelet-credential-provider/) para mais detalhes.

### Interpretação do config.json {#config-json}

A interpretação do `config.json` varia entre a implementação original do Docker
e a interpretação feita pelo Kubernetes. No Docker, as chaves em `auths` podem especificar apenas URLs raiz,
enquanto o Kubernetes permite URLs com *glob* e também caminhos com correspondência por prefixo.
A única limitação é que os padrões *glob* (`*`) devem incluir o ponto (`.`) para cada subdomínio.
A quantidade de subdomínios correspondentes deve ser igual à quantidade de padrões glob (`*.`), por exemplo:

- `*.kubernetes.io` *não* corresponderá a `kubernetes.io`, mas corresponderá a `abc.kubernetes.io`
- `*.*.kubernetes.io` *não* corresponderá a `abc.kubernetes.io`, mas corresponderá a `abc.def.kubernetes.io`
- `prefix.*.io` corresponderá a `prefix.kubernetes.io`
- `*-good.kubernetes.io` corresponderá a `prefix-good.kubernetes.io`

Isso significa que um `config.json` como este é válido:

```json
{
    "auths": {
        "my-registry.io/images": { "auth": "…" },
        "*.my-registry.io/images": { "auth": "…" }
    }
}
```

As operações de pull de imagem agora passarão as credenciais para o agente de execução de contêiner via CRI
para cada padrão válido. Por exemplo, os seguintes nomes de imagem de contêiner
corresponderiam com sucesso:

- `my-registry.io/images`
- `my-registry.io/images/my-image`
- `my-registry.io/images/another-image`
- `sub.my-registry.io/images/my-image`

Mas não:

- `a.sub.my-registry.io/images/my-image`
- `a.b.sub.my-registry.io/images/my-image`

O kubelet realiza downloads de imagem de forma sequencial para cada credencial encontrada.
Isso significa que múltiplas entradas no `config.json` para caminhos diferentes também são possíveis:

```json
{
    "auths": {
        "my-registry.io/images": {
            "auth": "…"
        },
        "my-registry.io/images/subpath": {
            "auth": "…"
        }
    }
}
```

Se agora um contêiner especificar uma imagem `my-registry.io/images/subpath/my-image`
para ser baixada, o kubelet tentará fazer o download utilizando ambas as fontes de autenticação, caso uma delas falhe.

### Imagens pré-obtidas {#pre-pulled-images}

{{< note >}}
Essa abordagem é adequada se você puder controlar a configuração do nó. Isto
não funcionará de forma confiável se o seu provedor de nuvem for responsável pelo gerenciamento de nós e os substituir
automaticamente.
{{< /note >}}

Por padrão, o kubelet tenta realizar um "pull" para cada imagem do registro especificado.
No entanto, se a propriedade `imagePullPolicy` do contêiner for definida como` IfNotPresent` ou `Never`,
em seguida, uma imagem local é usada (preferencial ou exclusivamente, respectivamente).

Se você quiser usar imagens pré-obtidas como um substituto para a autenticação do registro,
você deve garantir que todos os nós no cluster tenham as mesmas imagens pré-obtidas.

Isso pode ser usado para pré-carregar certas imagens com o intuíto de aumentar a velocidade ou como uma alternativa para autenticação em um registro privado.

Todos os pods terão permissão de leitura a quaisquer imagens pré-obtidas.

### Especificando imagePullSecrets em um pod

{{< note >}}
Esta é a abordagem recomendada para executar contêineres com base em imagens
de registros privados.
{{< /note >}}

O Kubernetes oferece suporte à especificação de chaves de registro de imagem de contêiner em um Pod.
Todos os `imagePullSecrets` devem estar no mesmo namespace que o Pod.
Os Secrets referenciados devem ser do tipo `kubernetes.io/dockercfg` ou `kubernetes.io/dockerconfigjson`.

#### Criando um segredo com Docker config

Você precisa saber o nome de usuário, a senha do registro, o endereço de e-mail do cliente para autenticação
no registro, além do nome do host.
Execute o seguinte comando, substituindo os valores em letras maiúsculas pelos apropriados:

```shell
kubectl create secret docker-registry <name> \
  --docker-server=DOCKER_REGISTRY_SERVER \
  --docker-username=DOCKER_USER \
  --docker-password=DOCKER_PASSWORD \
  --docker-email=DOCKER_EMAIL
```

Se você já tem um arquivo de credenciais do Docker, em vez de usar o
comando acima, você pode importar o arquivo de credenciais como um Kubernetes
{{< glossary_tooltip text="Secrets" term_id="secret" >}}.
[Criar um segredo com base nas credenciais Docker existentes](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials) explica como configurar isso.

Isso é particularmente útil se você estiver usando vários registros privados de contêineres, como `kubectl create secret docker-registry` cria um Segredo que
só funciona com um único registro privado.

{{< note >}}
Os pods só podem fazer referência a *pull secrets* de imagem em seu próprio namespace,
portanto, esse processo precisa ser feito uma vez por namespace.
{{< /note >}}

#### Referenciando um imagePullSecrets em um pod

Agora, você pode criar Pods que referenciam esse Secret adicionando uma seção `imagePullSecrets`
na definição do Pod. Cada item no array `imagePullSecrets` pode referenciar apenas um Secret
no mesmo namespace.

Por exemplo:

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: foo
  namespace: awesomeapps
spec:
  containers:
    - name: foo
      image: janedoe/awesomeapp:v1
  imagePullSecrets:
    - name: myregistrykey
EOF

cat <<EOF >> ./kustomization.yaml
resources:
- pod.yaml
EOF
```

Isso precisa ser feito para cada pod que está usando um registro privado.

No entanto, a configuração deste campo pode ser automatizada definindo o imagePullSecrets
em um recurso de [ServiceAccount](/docs/tasks/configure-pod-container/configure-service-account/).

Verifique [Adicionar ImagePullSecrets a uma conta de serviço](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account) para obter instruções detalhadas.

Você pode usar isso em conjunto com um `.docker / config.json` por nó. As credenciais
serão mescladas.

## Casos de uso

Existem várias soluções para configurar registros privados. Aqui estão alguns
casos de uso comuns e soluções sugeridas.

1. Cluster executando apenas imagens não proprietárias (por exemplo, código aberto). Não há necessidade de ocultar imagens.
    - Use imagens públicas no Docker hub.
      - Nenhuma configuração necessária.
      - Alguns provedores de nuvem armazenam em cache ou espelham automaticamente imagens públicas, o que melhora a disponibilidade e reduz o tempo para extrair imagens.
1. Cluster executando algumas imagens proprietárias que devem ser ocultadas para quem está fora da empresa, mas
    visível para todos os usuários do cluster.
    - Use um [registro Docker](https://docs.docker.com/registry/) privado hospedado.
      - Pode ser hospedado no [Docker Hub](https://hub.docker.com/signup) ou em outro lugar.
      - Configure manualmente .docker/config.json em cada nó conforme descrito acima.
    - Ou execute um registro privado interno atrás de seu firewall com permissão de leitura.
      - Nenhuma configuração do Kubernetes é necessária.
    - Use um serviço de registro de imagem de contêiner que controla o acesso à imagem
      - Funcionará melhor com o escalonamento automático do cluster do que com a configuração manual de nós.
    - Ou, em um cluster onde alterar a configuração do nó é inconveniente, use `imagePullSecrets`.
1. Cluster com imagens proprietárias, algumas das quais requerem controle de acesso mais rígido.
    - Certifique-se de que o [controlador de admissão AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) está ativo. Caso contrário, todos os pods têm potencialmente acesso a todas as imagens.
    - Mova dados confidenciais para um recurso "secreto", em vez de empacotá-los em uma imagem.
1. Um cluster multilocatário em que cada locatário precisa de seu próprio registro privado.
    - Certifique-se de que o [controlador de admissão AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) está ativo. Caso contrário, todos os Pods de todos os locatários terão potencialmente acesso a todas as imagens.
    - Execute um registro privado com autorização necessária.
    - Gere credenciais de registro para cada locatário, coloque em segredo e preencha o segredo para cada namespace de locatário.
    - O locatário adiciona esse segredo a imagePullSecrets de cada namespace.

Se precisar de acesso a vários registros, você pode criar um segredo para cada registro.

## Provedor de credenciais legado embutido no kubelet

Em versões mais antigas do Kubernetes, o kubelet tinha uma integração direta com as credenciais de provedores de nuvem.
Isso permitia buscar dinamicamente as credenciais para registros de imagens.

Havia três implementações embutidas do provedor de credenciais do kubelet:
ACR (Azure Container Registry), ECR (Elastic Container Registry) e GCR (Google Container Registry).

Para mais informações sobre o mecanismo legado, consulte a documentação da versão do Kubernetes que você está utilizando.
As versões do Kubernetes da v1.26 até a v{{< skew latestVersion >}} não incluem mais esse mecanismo legado, portanto,
você precisará:
- configurar um provedor de credenciais de imagem no kubelet em cada nó
- ou especificar credenciais de download de imagem usando `imagePullSecrets` e pelo menos um Secret

## {{% heading "whatsnext" %}}

* Leia a [Especificação do Manifesto de Imagem OCI](https://github.com/opencontainers/image-spec/blob/master/manifest.md)
* Saiba mais sobre [coleta de lixo de imagens de contêiner](/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection).
* Saiba mais sobre [realizar download de uma imagem a partir de um registro privado](/docs/tasks/configure-pod-container/pull-image-private-registry).
