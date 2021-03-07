---
reviewers:
- femrtnz
- jcjesus
- hugopfeffer
title: Imagens
content_type: concept
weight: 10
---

<!-- overview -->

Uma imagem de contêiner representa dados binários que encapsulam uma aplicação e todas as suas dependências de software. As imagens de contêiner são pacotes de software executáveis que podem ser executados de forma autônoma e que fazem suposições muito bem definidas sobre seu agente de execução do ambiente.

Normalmente, você cria uma imagem de contêiner da sua aplicação e a envia para um registro antes de fazer referência a ela em um {{< glossary_tooltip text="Pod" term_id="pod" >}}

Esta página fornece um resumo sobre o conceito de imagem de contêiner.  

<!-- body -->

## Nomes das imagens

As imagens de contêiner geralmente recebem um nome como `pause`, `exemplo/meuconteiner`, ou `kube-apiserver`.
As imagens também podem incluir um hostname de algum registro; por exemplo: `exemplo.registro.ficticio/nomeimagem`,
e um possível número de porta; por exemplo: `exemplo.registro.ficticio:10443/nomeimagem`.

Se você não especificar um hostname de registro, o Kubernetes presumirá que você se refere ao registro público do Docker.

Após a parte do nome da imagem, você pode adicionar uma _tag_ (como também usar com comandos como `docker` e` podman`).
As tags permitem identificar diferentes versões da mesma série de imagens.

Tags de imagem consistem em letras maiúsculas e minúsculas, dígitos, sublinhados (`_`),
pontos (`.`) e travessões (` -`).
Existem regras adicionais sobre onde você pode colocar o separador
caracteres (`_`,`-` e `.`) dentro de uma tag de imagem.
Se você não especificar uma tag, o Kubernetes presumirá que você se refere à tag `latest` (mais recente).

{{< caution >}}
Você deve evitar usar a tag `latest` quando estiver realizando o deploy de contêineres em produção,
pois é mais difícil rastrear qual versão da imagem está sendo executada, além de tornar mais difícil o processo de reversão para uma versão funcional.

Em vez disso, especifique uma tag significativa, como `v1.42.0`.
{{< /caution >}}

## Atualizando imagens

A política padrão de pull é `IfNotPresent` a qual faz com que o
{{<glossary_tooltip text = "kubelet" term_id = "kubelet">}} ignore 
o processo de *pull* da imagem, caso a mesma já exista. Se você prefere sempre forçar o processo de *pull*, 
você pode seguir uma das opções abaixo:

- defina a `imagePullPolicy` do contêiner para` Always`.
- omita `imagePullPolicy` e use`: latest` como a tag para a imagem a ser usada.
- omita o `imagePullPolicy` e a tag da imagem a ser usada.
- habilite o [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages) controlador de admissão.

Quando `imagePullPolicy` é definido sem um valor específico, ele também é definido como` Always`.

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

Se você executar o Docker em seus nós, poderá configurar o contêiner runtime do Docker
para autenticação em um registro de contêiner privado.

Essa abordagem é adequada se você puder controlar a configuração do nó.

{{< note >}}
O Kubernetes padrão é compatível apenas com as seções `auths` e` HttpHeaders` na configuração do Docker.
Auxiliares de credencial do Docker (`credHelpers` ou` credsStore`) não são suportados.
{{< /note >}}

Docker armazena chaves de registros privados no arquivo `$HOME/.dockercfg` ou `$HOME/.docker/config.json`. Se você colocar o mesmo arquivo na lista de caminhos de pesquisa abaixo, o kubelet o usa como provedor de credenciais ao obter imagens.

* `{--root-dir:-/var/lib/kubelet}/config.json`
* `{cwd of kubelet}/config.json`
* `${HOME}/.docker/config.json`
* `/.docker/config.json`
* `{--root-dir:-/var/lib/kubelet}/.dockercfg`
* `{cwd of kubelet}/.dockercfg`
* `${HOME}/.dockercfg`
* `/.dockercfg`

{{< note >}}
Você talvez tenha que definir `HOME=/root` explicitamente no ambiente do processo kubelet.
{{< /note >}}

Aqui estão as etapas recomendadas para configurar seus nós para usar um registro privado. Neste
exemplo, execute-os em seu desktop/laptop:

  1. Execute `docker login [servidor]` para cada conjunto de credenciais que deseja usar. Isso atualiza o `$HOME/.docker/config.json` em seu PC.
  1. Visualize `$HOME/.docker/config.json` em um editor para garantir que contém apenas as credenciais que você deseja usar.
  1. Obtenha uma lista de seus nós; por exemplo:
      - se você quiser os nomes: `nodes=$( kubectl get nodes -o jsonpath='{range.items[*].metadata}{.name} {end}' )`
      - se você deseja obter os endereços IP: `nodes=$( kubectl get nodes -o jsonpath='{range .items[*].status.addresses[?(@.type=="ExternalIP")]}{.address} {end}' )`
  1. Copie seu `.docker/config.json` local para uma das listas de caminhos de busca acima.
      - por exemplo, para testar isso: `for n in $nodes; do scp ~/.docker/config.json root@"$n":/var/lib/kubelet/config.json; done`

{{< note >}}
Para clusters de produção, use uma ferramenta de gerenciamento de configuração para que você possa aplicar esta
configuração para todos os nós onde você precisa.
{{< /note >}}

Verifique se está funcionando criando um pod que usa uma imagem privada; por exemplo:

```shell
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: private-image-test-1
spec:
  containers:
    - name: uses-private-image
      image: $PRIVATE_IMAGE_NAME
      imagePullPolicy: Always
      command: [ "echo", "SUCCESS" ]
EOF
```
```
pod/private-image-test-1 created
```

Se tudo estiver funcionando, então, após algum tempo, você pode executar:

```shell
kubectl logs private-image-test-1
```
e veja o resultado do comando:
```
SUCCESS
```

Se você suspeitar que o comando falhou, você pode executar:
```shell
kubectl describe pods/private-image-test-1 | grep 'Failed'
```
Em caso de falha, a saída é semelhante a:
```
  Fri, 26 Jun 2015 15:36:13 -0700    Fri, 26 Jun 2015 15:39:13 -0700    19    {kubelet node-i2hq}    spec.containers{uses-private-image}    failed        Failed to pull image "user/privaterepo:v1": Error: image user/privaterepo:v1 not found
```


Você deve garantir que todos os nós no cluster tenham o mesmo `.docker/config.json`. Caso contrário, os pods serão executados com sucesso em alguns nós e falharão em outros. Por exemplo, se você usar o escalonamento automático de nós, cada modelo de instância precisa incluir o `.docker/config.json` ou montar um drive que o contenha.

Todos os pods terão premissão de leitura às imagens em qualquer registro privado, uma vez que
as chaves privadas do registro são adicionadas ao `.docker/config.json`.

### Imagens pré-obtidas

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

O Kubernetes oferece suporte à especificação de chaves de registro de imagem de contêiner em um pod.

#### Criando um segredo com Docker config

Execute o seguinte comando, substituindo as palavras em maiúsculas com os valores apropriados:

```shell
kubectl create secret docker-registry <name> --docker-server=DOCKER_REGISTRY_SERVER --docker-username=DOCKER_USER --docker-password=DOCKER_PASSWORD --docker-email=DOCKER_EMAIL
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

Agora, você pode criar pods que fazem referência a esse segredo adicionando uma seção `imagePullSecrets`
na definição de Pod.

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
O Kubelet mesclará qualquer `imagePullSecrets` em um único `.docker/config.json` virtual

## {{% heading "whatsnext" %}}

* Leia a [OCI Image Manifest Specification](https://github.com/opencontainers/image-spec/blob/master/manifest.md)
