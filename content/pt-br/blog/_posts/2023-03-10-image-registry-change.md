---
layout: blog
title: "Redirecionamento do registro de imagens k8s.gcr.io para registry.k8s.io - O que você precisa saber"
date: 2023-03-10T17:00:00.000Z
slug: image-registry-redirect
---

**Autores**: Bob Killen (Google), Davanum Srinivas (AWS), Chris Short (AWS), Frederico Muñoz (SAS
Institute), Tim Bannister (The Scale Factory), Ricky Sadowski (AWS), Grace Nguyen (Expo), Mahamed
Ali (Rackspace Technology), Mars Toktonaliev (independent), Laura Santamaria (Dell), Kat Cosgrove
(Dell)


Na segunda-feira, dia 20 de março, o registro de imagens k8s.gcr.io [vai ser redirecionado para o registro de imagens da comunidade](https://kubernetes.io/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/), **registry.k8s.io**.


## O que você precisa saber sobre essa mudança
- Na segunda-feira, dia 20 de março, o tráfego do registro de imagens antigo k8s.gcr.io vai ser redirecionado para
registry.k8s.io com o objetivo final de encerramento do k8s.gcr.io.
- Se você está executando em um ambiente restrito, e aplica políticas rígidas de acesso a nomes de domínios
ou endereços IPs limitado a k8s.gcr.io, **o _pull_ de imagens não vai funcionar** depois que o k8s.gcr.io começar
a redirecionar para o novo registro de imagens.
- Um pequeno subconjunto de clientes que não seguem o padrão não lidam com redirecionamentos HTTP, e neste caso eles
precisam ser apontados diretamente para registry.k8s.io.
- O redirecionamento é um paliativo para ajudar os usuários a fazer essa troca. O registro obsoleto k8s.gcr.io será desativado em algum momento. **Por isso, atualize seus manifestos o mais rápido possível para apontar para registry.k8s.io**.
- Se você mantém seu próprio registro de imagens, você pode copiar as imagens que você precisa para reduzir o tráfego
ao registro de imagens da comunidade.

Se você acha que vai ser impactado, ou gostaria de saber mais sobre essa mudança, leia mais abaixo.

## Como eu posso checar se eu vou ser afetado?
Para testar a conectividade ao registry.k8s.io (e saber se consegue baixar as imagens), pode executar o
comando abaixo em um namespace da sua escolha:

```
kubectl run hello-world -ti --rm --image=registry.k8s.io/busybox:latest --restart=Never -- date
```

Quando executar o comando acima, é esperada a seguinte saída caso tudo esteja funcionando corretamente:

```
$ kubectl run hello-world -ti --rm --image=registry.k8s.io/busybox:latest --restart=Never -- date
Fri Feb 31 07:07:07 UTC 2023
pod "hello-world" deleted
```

## Quais erros são esperados caso eu seja afetado?
Os erros podem depender do tipo de agente de execução de contêiner que você está usando, e para qual endpoint você está
sendo direcionado, mas devem ser erros como `ErrImagePull`, `ImagePullBackOff`, ou falha na criação do
container com o aviso `FailedCreatePodSandBox`.

Abaixo um exemplo de uma mensagem de erro mostrando uma instalação por trás de um proxy falhando devido a um certificado desconhecido:

```
FailedCreatePodSandBox: Failed to create pod sandbox: rpc error: code = Unknown desc = Error response from daemon: Head “https://us-west1-docker.pkg.dev/v2/k8s-artifacts-prod/images/pause/manifests/3.8”: x509: certificate signed by unknown authority
```

## Quais imagens serão afetadas?
**TODAS** as imagens no k8s.gcr.io serão afetadas por essa mudança. O k8s.gcr.io hospeda muitas imagens além das releases do Kubernetes. Um grande número de subprojetos do Kubernetes hospedam seus projetos nele também. Alguns exemplos incluem 
as imagens `dns/k8s-dns-node-cache`, `ingress-nginx/controller`, e
`node-problem-detector/node-problem-detector`.

## Eu fui afetado, o que devo fazer?
Para usuários afetados que usam um ambiente restrito, a melhor opção é copiar as imagens necessárias
para um registro privado ou configurar um cache de _pull-through_ no seu registro de imagens.

Existem várias ferramentas para copiar imagens entre registros de imagens. [Crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/doc/crane_copy.md) é uma dessas ferramentas, as imagens podem ser copiadas para um registro de imagens privado com `crane copy SRC DST`. Também existem ferramentas específicas de fornecedores, como o [gcrane](https://cloud.google.com/container-registry/docs/migrate-external-containers#copy) que faz uma função similar mas simplificada para a plataforma da Google.


## Como eu posso encontrar quais imagens estão usando o registro de imagens antigo, e corrigir elas?

**Opção 1**: Veja esse comando do kubectl no [blog post anterior](/pt-br/blog/2023/02/06/k8s-gcr-io-freeze-announcement/#próximos-passos):

```
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

**Opção 2**: Um plugin do `kubectl` [krew](https://krew.sigs.k8s.io/) chamado [`community-images`](https://github.com/kubernetes-sigs/community-images#kubectl-community-images) foi desenvolvido para escanear e reportar qualquer
imagem usando o endpoint k8s.gcr.io.

Se você tem o krew instalado, pode instalar o plugin com:

```
kubectl krew install community-images
```

E gerar um relatório com:

```
kubectl community-images
```

Para métodos alternativos de instalação ou exemplos de saída, veja o repositório [kubernetes-sigs/community-images](https://github.com/kubernetes-sigs/community-images).

**Opção 3**: Se você não tem acesso diretamente ao cluster, ou gerencia muitos clusters - o melhor
caminho é executar uma busca sobre seus manifestos e charts por _"k8s.gcr.io"_.

**Opção 4**: Se você quer prevenir a execução de imagens a partir do k8s.gcr.io no seu cluster, existem políticas
para [Gatekeeper](https://open-policy-agent.github.io/gatekeeper-library/website/) e
[Kyverno](https://kyverno.io/) disponíveis no [repositório de melhores práticas para AWS EKS](https://github.com/aws/aws-eks-best-practices/tree/master/policies/k8s-registry-deprecation) que vão bloquear o pull das imagens. Você
pode usar essas políticas de terceiros com qualquer cluster Kubernetes.

**Opção 5**: Como a **ÚLTIMA** opção, você pode usar um [webhook de admissão](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) para alterar o
endereço da imagem dinamicamente. Isso deve ser feito apenas como uma medida paliativa enquanto os
seus manifestos são atualizados. Você pode encontrar um webhook de admissão e uma política do 
Kyverno (de terceiros) em [k8s-gcr-quickfix](https://github.com/abstractinfrastructure/k8s-gcr-quickfix).


## Por que o Kubernetes mudou para um registro de imagem diferente?

O k8s.gcr.io é hospedado em um domínio customizado no [Google Cloud Registry (GCR)](https://cloud.google.com/container-registry?hl=pt-br)
que foi configurado exclusivamente para o projeto do Kubernetes. Isso funcionou desde o nascimento do projeto,
e nós agradecemos ao Google por prover esses recursos, mas atualmente, existem outros provedores de nuvem e fornecedores
que gostariam de hospedar imagens para fornecer uma melhor experiência para as pessoas nas suas plataformas. 
Além do Google ter [renovado o compromisso de doar $3 milhões](https://www.cncf.io/google-cloud-recommits-3m-to-kubernetes/) para manter a infraestrutura do projeto ano passado, a Amazon Web Services anunciou uma doação correspondente 
[durante o seu keynote na Kubecon NA 2022 em Detroit](https://youtu.be/PPdimejomWo?t=236). Isso proporcionará
uma melhor experiência para os usuários (servidores mais pertos = downloads mais rápidos) e vai reduzir 
a largura de banda de saída e os custos do GCR ao mesmo tempo.

Para mais detalhes sobre essa mudança, leia mais em [registry.k8s.io: rápido, barato e em disponibilidade geral (GA)](/pt-br/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/).


## Por que está sendo feito um redirecionamento?

O projeto mudou para o [registry.k8s.io ano passado na versão 1.25](/pt-br/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/); entretanto, a maioria do tráfego de pull de imagens ainda continua sendo
feito para o antigo endpoint k8s.gcr.io. Isso não foi sustentável para nós como um projeto pois não estamos
usando os recursos que foram doados para o projeto por outros provedores e estamos correndo o risco de ficar 
sem recursos dado o custo de servir esse tráfego.

O redirecionamento vai permitir que o projeto aproveite as vantagens desses novos recursos, reduzindo
significantemente os cursos da largura de banda de saída. Nós esperamos que apenas um pequeno subconjunto
de usuários executando em ambientes restritos ou clientes antigos que não consigam fazer o redirecionamento
apropriadamente sejam impactados.

## O que vai acontecer com o k8s.gcr.io?
Para além do redirecionamento, o k8s.gcr.io vai ser congelado [e não vai ser atualizado com novas imagens
depois do dia 03 de abril de 2023](https://kubernetes.io/blog/2023/02/06/k8s-gcr-io-freeze-announcement/).
O `k8s.gcr.io` não vai receber nenhuma nova release, patch ou atualização de segurança. Ele continuará 
disponível para ajudar as pessoas na migração, mas **SERÁ** removido totalmente no futuro.

## Ainda tenho perguntas, onde devo ir?
Para mais informações sobre o registry.k8s.io e porque foi desenvolvido, leia em [registry.k8s.io: rápido, barato e em disponibilidade geral (GA)](/pt-br/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/).

Se você quer saber mais sobre o congelamento das imagens e as últimas imagens que vão ficar disponíveis lá, 
leia o blog post: [k8s.gcr.io O registro de imagens será congelado a partir de 3 de abril de 2023](/pt-br/blog/2023/02/06/k8s-gcr-io-freeze-announcement/).

Informações sobre a arquitetura do registry.k8s.io e sobre sua [árvore de decisão de tratamento das requisições](https://github.com/kubernetes/registry.k8s.io/blob/8408d0501a88b3d2531ff54b14eeb0e3c900a4f3/cmd/archeio/docs/request-handling.md) 
pode ser encontradas no repositório [kubernetes/registry.k8s.io](https://github.com/kubernetes/registry.k8s.io).

Se você encontrar um bug no novo registro de imagens ou no redirecionamento, por favor abra uma issue no repositório [kubernetes/registry.k8s.io](https://github.com/kubernetes/registry.k8s.io/issues/new/choose).
**Por favor verifique se já não existe uma issue aberta parecida antes de abrir uma nova**.

