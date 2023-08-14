---
title: Configurar um provedor de credenciais de imagem para o kubelet
description: Configure o plugin de provedor de credenciais de imagem do kubelet
content_type: task
min-kubernetes-server-version: v1.26
weight: 120
---

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!-- overview -->

A partir do Kubernetes v1.20, o kubelet pode obter dinamicamente as credenciais para um registro de imagem de contêiner usando plugins executáveis. O kubelet e o plugin executável se comunicam por meio de stdio (stdin, stdout e stderr) usando APIs versionadas do Kubernetes. Esses plugins permitem que o kubelet solicite credenciais para um registro de contêiner dinamicamente, em vez de armazenar credenciais estáticas no disco. Por exemplo, o plugin pode se comunicar com um servidor de metadados local para recuperar credenciais de curta duração para uma imagem que está sendo baixada pelo kubelet.

Você pode estar interessado em usar essa funcionalidade se alguma das condições abaixo for verdadeira:

* Chamadas de API para um serviço de provedor de nuvem são necessárias para recuperar informações de autenticação para um registro.
* As credenciais têm tempos de expiração curtos e é necessário solicitar novas credenciais com frequência.
* Armazenar credenciais de registro no disco ou em `imagePullSecrets` não é aceitável.

Este guia demonstra como configurar o mecanismo de plugin do provedor de credenciais de imagem do kubelet.

## {{% heading "prerequisites" %}}

* Você precisa de um cluster Kubernetes com nós que suportem plugins de provedor de credenciais do kubelet. Esse suporte está disponível no Kubernetes {{< skew currentVersion >}}; As versões v1.24 e v1.25 do Kubernetes incluíram isso como um recurso beta, ativado por padrão.

* Uma implementação funcional de um plugin executável de provedor de credenciais. Você pode criar seu próprio plugin ou usar um fornecido por provedores de nuvem.

{{< version-check >}}

<!-- steps -->

## Instalando Plugins nos Nós

Um plugin de provedor de credenciais é um binário executável que será executado pelo kubelet. Certifique-se de que o binário do plugin exista em cada nó do seu cluster e esteja armazenado em um diretório conhecido. O diretório será necessário posteriormente ao configurar as _flags_ do kubelet.

## Configurando o Kubelet

Para usar esse recurso, o kubelet espera que duas flags sejam definidas:

* `--image-credential-provider-config` - o caminho para o arquivo de configuração do plugin de provedor de credenciais.
* `--image-credential-provider-bin-dir` - o caminho para o diretório onde estão localizados os binários do plugin de provedor de credenciais.

### Configurar um provedor de credenciais do kubelet

O arquivo de configuração passado para `--image-credential-provider-config` é lido pelo kubelet para determinar quais plugins executáveis devem ser invocados para quais imagens de contêiner. Aqui está um exemplo de arquivo de configuração que você pode acabar usando se estiver usando o plugin baseado no [ECR](https://aws.amazon.com/ecr/):

```yaml
apiVersion: kubelet.config.k8s.io/v1
kind: CredentialProviderConfig
# providers é uma lista de plug-ins auxiliares do provedor de credenciais que serão habilitados pelo kubelet.
# Vários provedores podem corresponder a uma única imagem, caso em que as credenciais
# de todos os provedores serão devolvidos ao kubelet. Se vários provedores forem chamados
# para uma única imagem, os resultados são combinados. Se os provedores retornarem 
# chaves de autenticação sobrepostas, o valor do provedor anterior da lista é usado.
providers:
   # name é o nome necessário do provedor de credenciais. Deve corresponder ao nome do
   # executável do provedor visto pelo kubelet. O executável deve estar no 
   # diretório bin do kubelet (definido pela flag --image-credential-provider-bin-dir).
   - name: ecr
     # matchImages é uma lista obrigatória de strings usadas para corresponder às imagens para
     # determinar se este provedor deve ser invocado. Se uma das strings corresponder à
     # imagem solicitada do kubelet, o plug-in será invocado e terá uma chance
     # para fornecer credenciais. Espera-se que as imagens contenham o domínio de registro
     # e caminho da URL.
     #
     # Cada entrada em matchImages é um padrão que pode opcionalmente conter uma porta e um caminho.
     # Globs podem ser usados no domínio, mas não na porta ou no caminho. Globs são suportados
     # como subdomínios como '*.k8s.io' ou 'k8s.*.io' e domínios de nível superior como 'k8s.*'.
     # A correspondência de subdomínios parciais como 'app*.k8s.io' também é suportada. Cada glob só pode corresponder
     # a um único segmento de subdomínio, então `*.io` **não** corresponde a `*.k8s.io`.
     #
     # Existe uma correspondência entre uma imagem e uma matchImage quando todas as opções abaixo são verdadeiras:
     # - Ambos contêm o mesmo número de partes de domínio e cada parte faz correspondência.
     # - O caminho da URL de um matchImages deve ser um prefixo do caminho do URL da imagem de destino.
     # - Se matchImages contiver uma porta, a porta também deverá corresponder à imagem.
     #
     # Valores de exemplo de matchImages:
     # - 123456789.dkr.ecr.us-east-1.amazonaws.com
     # - *.azurecr.io
     # - gcr.io
     # - *.*.registry.io
     # - Registry.io:8080/path
     matchImages:
       - "*.dkr.ecr.*.amazonaws.com"
       - "*.dkr.ecr.*.amazonaws.cn"
       - "*.dkr.ecr-fips.*.amazonaws.com"
       - "*.dkr.ecr.us-iso-east-1.c2s.ic.gov"
       - "*.dkr.ecr.us-isob-east-1.sc2s.sgov.gov"
     # defaultCacheDuration é a duração padrão em que o plug-in armazenará as credenciais na memória
     # se a duração do cache não for fornecida na resposta do plug-in. Este campo é obrigatório.
     defaultCacheDuration: "12h"
     # Versão de entrada necessária do exec CredentialProviderRequest. O CredentialProviderResponse retornado
     # DEVE usar a mesma versão de codificação da entrada. Os valores atualmente suportados são:
     # - credentialprovider.kubelet.k8s.io/v1
     apiVersion: credentialprovider.kubelet.k8s.io/v1
     # Argumentos para passar ao comando quando for executá-lo.
     # +optional
     args:
       - get-credentials
     # Env define variáveis de ambiente adicionais para expor ao processo. Esses valores
     # são combinados com o ambiente do host, bem como as variáveis que o client-go usa
     # para passar o argumento para o plugin.
     # +optional
     env:
       - name: AWS_PROFILE
         value: example_profile
```

O campo `providers` é uma lista de plugins habilitados usados pelo kubelet. Cada entrada tem alguns campos obrigatórios:

* `name`: o nome do plugin que DEVE corresponder ao nome do binário executável que existe no diretório passado para `--image-credential-provider-bin-dir`.
* `matchImages`: uma lista de strings usadas para comparar com imagens, a fim de determinar se este provedor deve ser invocado. Mais sobre isso abaixo.
* `defaultCacheDuration`: a duração padrão em que o kubelet armazenará em cache as credenciais em memória, caso a duração de cache não tenha sido especificada pelo plugin.
* `apiVersion`: a versão da API que o kubelet e o plugin executável usarão ao se comunicar.

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
