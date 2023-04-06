---
title: Configurar um provedor de credenciais de imagem kubelet.
reviewers:
- liggitt
- cheftako
description: Configure o plugin de provedor de credenciais de imagem do kubelet.
content_type: task
min-kubernetes-server-version: v1.26
weight: 120
---

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!-- overview -->

A partir do Kubernetes v1.20, o kubelet pode recuperar dinamicamente as credenciais para um registro de imagem de contêiner usando plugins executáveis. O kubelet e o plugin de execução se comunicam por meio de stdio (stdin, stdout e stderr) usando APIs versionadas do Kubernetes. Esses plugins permitem que o kubelet solicite credenciais para um registro de contêiner dinamicamente, em vez de armazenar credenciais estáticas no disco. Por exemplo, o plugin pode se comunicar com um servidor de metadados local para recuperar credenciais de curta duração para uma imagem que está sendo puxada pelo kubelet.

Você pode estar interessado em usar essa capacidade se alguma das condições abaixo for verdadeira:

* Chamadas de API para um serviço de provedor de nuvem são necessárias para recuperar informações de autenticação para um registro.
* As credenciais têm tempos de expiração curtos e é necessário solicitar novas credenciais com frequência.
* Armazenar credenciais de registro no disco ou em `imagePullSecrets` não é aceitável.

Este guia demonstra como configurar o mecanismo de plugin do provedor de credenciais de imagem do kubelet.

## {{% heading "prerequisites" %}}

* Você precisa de um cluster Kubernetes com nós que suportem plugins de provedor de credenciais do kubelet. Esse suporte está disponível no Kubernetes {{< skew currentVersion >}}; As versões v1.24 e v1.25 do Kubernetes incluíram isso como um recurso beta, ativado por padrão.

* Uma implementação funcional de um plugin exec de provedor de credenciais. Você pode construir seu próprio plugin ou usar um fornecido por provedores de nuvem.

{{< version-check >}}

<!-- steps -->

## Instalando Plugins nos Nós

Um plugin de provedor de credenciais é um binário executável que será executado pelo kubelet. Certifique-se de que o binário do plugin exista em cada nó do seu cluster e armazenado em um diretório conhecido. O diretório será necessário posteriormente ao configurar as flags do kubelet.

## Configurando o Kubelet

Para usar esse recurso, o kubelet espera que duas flags sejam definidas:

* `--image-credential-provider-config` - o caminho para o arquivo de configuração do plugin de provedor de credenciais.
* `--image-credential-provider-bin-dir` - o caminho para o diretório onde estão localizados os binários do plugin de provedor de credenciais.

### Configurar um provedor de credenciais do kubelet

O arquivo de configuração passado para `--image-credential-provider-config` é lido pelo kubelet para determinar quais plugins exec devem ser invocados para quais imagens de contêiner. Aqui está um exemplo de arquivo de configuração que você pode acabar usando se estiver usando o plugin baseado no [ECR](https://aws.amazon.com/ecr/):

```yaml
apiVersion: kubelet.config.k8s.io/v1
kind: CredentialProviderConfig
# providers is a list of credential provider helper plugins that will be enabled by the kubelet.
# Multiple providers may match against a single image, in which case credentials
# from all providers will be returned to the kubelet. If multiple providers are called
# for a single image, the results are combined. If providers return overlapping
# auth keys, the value from the provider earlier in this list is used.
providers:
  # name is the required name of the credential provider. It must match the name of the
  # provider executable as seen by the kubelet. The executable must be in the kubelet's
  # bin directory (set by the --image-credential-provider-bin-dir flag).
  - name: ecr
    # matchImages is a required list of strings used to match against images in order to
    # determine if this provider should be invoked. If one of the strings matches the
    # requested image from the kubelet, the plugin will be invoked and given a chance
    # to provide credentials. Images are expected to contain the registry domain
    # and URL path.
    #
    # Each entry in matchImages is a pattern which can optionally contain a port and a path.
    # Globs can be used in the domain, but not in the port or the path. Globs are supported
    # as subdomains like '*.k8s.io' or 'k8s.*.io', and top-level-domains such as 'k8s.*'.
    # Matching partial subdomains like 'app*.k8s.io' is also supported. Each glob can only match
    # a single subdomain segment, so `*.io` does **not** match `*.k8s.io`.
    #
    # A match exists between an image and a matchImage when all of the below are true:
    # - Both contain the same number of domain parts and each part matches.
    # - The URL path of an matchImages must be a prefix of the target image URL path.
    # - If the matchImages contains a port, then the port must match in the image as well.
    #
    # Example values of matchImages:
    # - 123456789.dkr.ecr.us-east-1.amazonaws.com
    # - *.azurecr.io
    # - gcr.io
    # - *.*.registry.io
    # - registry.io:8080/path
    matchImages:
      - "*.dkr.ecr.*.amazonaws.com"
      - "*.dkr.ecr.*.amazonaws.cn"
      - "*.dkr.ecr-fips.*.amazonaws.com"
      - "*.dkr.ecr.us-iso-east-1.c2s.ic.gov"
      - "*.dkr.ecr.us-isob-east-1.sc2s.sgov.gov"
    # defaultCacheDuration is the default duration the plugin will cache credentials in-memory
    # if a cache duration is not provided in the plugin response. This field is required.
    defaultCacheDuration: "12h"
    # Required input version of the exec CredentialProviderRequest. The returned CredentialProviderResponse
    # MUST use the same encoding version as the input. Current supported values are:
    # - credentialprovider.kubelet.k8s.io/v1
    apiVersion: credentialprovider.kubelet.k8s.io/v1
    # Arguments to pass to the command when executing it.
    # +optional
    args:
      - get-credentials
    # Env defines additional environment variables to expose to the process. These
    # are unioned with the host's environment, as well as variables client-go uses
    # to pass argument to the plugin.
    # +optional
    env:
      - name: AWS_PROFILE
        value: example_profile
```

O campo `providers` é uma lista de plugins habilitados usados pelo kubelet. Cada entrada tem alguns campos obrigatórios:

* `name`: o nome do plugin que DEVE corresponder ao nome do binário executável que existe no diretório passado para `--image-credential-provider-bin-dir`.
* `matchImages`: uma lista de strings usadas para comparar com imagens, a fim de determinar se este provedor deve ser invocado. Mais sobre isso abaixo.
* `defaultCacheDuration`: a duração padrão em que o kubelet armazenará em cache as credenciais em memória, caso a duração de cache não tenha sido especificada pelo plugin.
* `apiVersion`: a versão da API que o kubelet e o plugin exec usarão ao se comunicar.

Cada provedor de credenciais também pode receber argumentos opcionais e variáveis de ambiente. Consulte os implementadores do plugin para determinar qual conjunto de argumentos e variáveis de ambiente são necessários para um determinado plugin.

#### Configurar a correspondência de imagens

O campo `matchImages` de cada provedor de credenciais é usado pelo kubelet para determinar se um plugin deve ser invocado
para uma determinada imagem que um Pod está usando. Cada entrada em `matchImages` é um padrão de imagem que pode opcionalmente conter uma porta e um caminho.
Globs podem ser usados no domínio, mas não na porta ou no caminho. Globs são suportados como subdomínios como `*.k8s.io` ou `k8s.*.io`,
e domínios de nível superior como `k8s.*`. Correspondência de subdomínios parciais como `app*.k8s.io` também é suportada. Cada glob só pode corresponder
a um único segmento de subdomínio, então `*.io` NÃO corresponde a `*.k8s.io`.

Uma correspondência existe entre um nome de imagem e uma entrada `matchImage` quando todos os itens abaixo são verdadeiros:

* Ambos contêm o mesmo número de partes de domínio e cada parte corresponde.
* O caminho da URL da imagem correspondente deve ser um prefixo do caminho da URL da imagem de destino.
* Se o `matchImages` contiver uma porta, então a porta deve corresponder na imagem também.

Alguns valores de exemplo de padrões `matchImages` são:

* `123456789.dkr.ecr.us-east-1.amazonaws.com`
* `*.azurecr.io`
* `gcr.io`
* `*.*.registry.io`
* `foo.registry.io:8080/path`

## {{% heading "whatsnext" %}}

* Leia os detalhes sobre `CredentialProviderConfig` na [referência da API de configuração do kubelet (v1)](/docs/reference/config-api/kubelet-config.v1/).
* Leia a [referência da API do provedor de credenciais do kubelet (v1)](/docs/reference/config-api/kubelet-config.v1/).
