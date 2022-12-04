---
layout: blog
title: "registry.k8s.io: rápido, barato e disponibilidade geral (GA)"
date: 2022-11-28
slug: registry-k8s-io-faster-cheaper-ga
---

**Autores**: Adolfo García Veytia (Chainguard), Bob Killen (Google)

A partir do Kubernetes 1.25, o nosso repositório de imagens de contêiner mudou de k8s.gcr.io para [registry.k8s.io](https://registry.k8s.io). 
Este novo repositório distribui a carga por várias regiões e Provedores de Nuvem, funcionando como uma espécie de rede de entrega de conteúdo (CDN) para imagens de contêiner do Kubernetes. 
Essa mudança reduz a dependência do projeto de uma única entidade e fornece uma experiência mais rápida de download para um grande número de usuários.

## TL;DR: O que você precisa saber sobre essa mudança

* As imagens de contêiner para versões do Kubernetes a partir de 1.25 não serão mais publicadas no k8s.gcr.io, apenas no registry.k8s.io
* Em dezembro, nas próximas versões de patch, o novo padrão de domínio do registro será backported para todas as branches ainda com suporte (1.22, 1.23, 1.24).
* Em um ambiente restrito, se você executar e aplicar as políticas de acesso aos endereços de domínio/IP limitados ao k8s.gcr.io, os _pulls de imagem não funcionarão_ após a migração para este novo repositório. Para esses usuários, o método recomendado é espelhar o lançamento das imagens em um repositório privado.

Se você quiser saber mais sobre o motivo que fizemos essa mudança, ou alguns dos possíveis problemas que você pode encontrar, continue lendo.

## Por que o Kubernetes mudou para um registro de imagens diferente?

O K8s.gcr.io está hospedado em um domínio personalizado do [Google Container Registry](https://cloud.google.com/container-registry) (GCR) que foi configurado exclusivamente para o projeto Kubernetes. 
Isso funcionou bem desde o início do projeto, e agradecemos ao Google por fornecer esses recursos, mas hoje existem outros fornecedores e provedores de nuvem que gostariam de hospedar as imagens para fornecer uma melhor experiência para as pessoas em suas plataformas. 
Além do compromisso renovado do Google de [doar US$ 3 milhões para apoiar](https://www.cncf.io/google-cloud-recommits-3m-to-kubernetes/) a infraestrutura do projeto, a Amazon anunciou uma doação correspondente durante sua palestra na Kubecon NA 2022 em Detroit. 
Isso fornecerá uma melhor experiência para os usuários (servidores mais próximos = downloads mais rápidos) e reduzirá a largura de banda de saída e os custos do GCR ao mesmo tempo. O registry.k8s.io espalhará a carga entre o Google e a Amazon, e com outros provedores no futuro.

## Por que não há uma lista estável de domínios/IPs? Por que não posso restringir o pull de imagens?

O registry.k8s.io é um [redirecionador seguro de blob](https://github.com/kubernetes/registry.k8s.io/blob/main/cmd/archeio/docs/request-handling.md) que conecta os clientes ao provedor de nuvem mais próximo. 
A natureza dessa mudança significa que o pull de uma imagem cliente pode ser redirecionado para qualquer um dos vários backends. 
Esperamos que o conjunto de backends continue mudando e aumente à medida que mais e mais provedores de nuvem e fornecedores se juntem para ajudar a espelhar as atualizações das imagens.

Os mecanismos de controle mais restritos como proxies de main-in-the-middle ou as políticas de rede que restringem o acesso a uma lista específica de domínios/IPs, quebrarão com essa mudança. 
Para esses cenários, encorajamos você a espelhar as atualizações das imagens em um repositório local sobre o qual você tem um controle rigoroso.

Para mais informações sobre esta política, consulte a seção [estabilidade registry.k8s.io](https://github.com/kubernetes/registry.k8s.io#stability) na documentação.

## Que tipo de erros eu verei? Como saberei se ainda estou usando o endereço antigo?

Os erros dependem do tipo de tempo da execução do contêiner que você está usando e para qual o endpoint você está roteado, mas ele deve se apresentar como um contêiner que não pode ser criado com o aviso `FailedCreatePodSandBox`.

Abaixo temos um exemplo da mensagem de erro mostrando uma falha na implantação do proxy que não pode ser feito o pull devido a um certificado desconhecido:

```
FailedCreatePodSandBox: Failed to create pod sandbox: rpc error: code = Unknown desc = Error response from daemon: Head “https://us-west1-docker.pkg.dev/v2/k8s-artifacts-prod/images/pause/manifests/3.8”: x509: certificate signed by unknown authority
```

## Estou impressionado com essa mudança, como faço para reverter para o endereço de registro antigo?

Se usar o novo nome de domínio do registro não for uma opção, você pode reverter para o nome de domínio antigo para versões de cluster menores de 1.25. Tenha em mente que, eventualmente, você terá que mudar para o novo registro, pois as novas tags de imagem não serão mais enviadas para o GCR.

### Revertendo o nome do registro em kubeadm

O registro usado pelo kubeadm para realizar o pull das suas imagens pode ser controlado por dois métodos:

Definindo a flag `--image-repository`.

```
kubeadm init --image-repository=k8s.gcr.io
```

Ou em [kubeadm config](https://kubernetes.io/docs/reference/config-api/kubeadm-config.v1beta3/) `ClusterConfiguration`:

```yaml
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
imageRepository: "k8s.gcr.io"
```

### Revertendo o Nome do Registro em kubelet

A imagem usada pelo kubelet para o pod sandbox (`pausa`) pode ser substituída pela flag `--pod-infra-container-image`. 
Por exemplo:

```
kubelet --pod-infra-container-image=k8s.gcr.io/pause:3.5
```

## Agradecimentos

_A mudança é difícil_, e a evolução de nossa plataforma de serviço de imagem é necessária para garantir um futuro sustentável para o projeto. 
Nós nos esforçamos para melhorar as coisas para todos que utilizam o Kubernetes. 
Muitos colaboradores de todos os cantos da nossa comunidade têm trabalhado muito e com dedicação para garantir que estamos tomando as melhores decisões possíveis, executando planos e fazendo o nosso melhor para comunicar esses planos.

Obrigado a Aaron Crickenberger, Arnaud Meukam, Benjamin Elder, Caleb Woodbine, Davanum Srinivas, Mahamed Ali, and Tim Hockin from SIG K8s Infra, Brian McQueen, and Sergey Kanzhelev from SIG Node, Lubomir Ivanov from SIG Cluster Lifecycle, Adolfo García Veytia, Jeremy Rickard, Sascha Grunert, and Stephen Augustus from SIG Release, Bob Killen and Kaslin Fields from SIG Contribex, Tim Allclair from the Security Response Committee. 
Um grande obrigado também aos nossos amigos que atuam como ligação com nossos provedores de nuvem parceiros: Jay Pipes da Amazon e Jon Johnson Jr. do Google.
