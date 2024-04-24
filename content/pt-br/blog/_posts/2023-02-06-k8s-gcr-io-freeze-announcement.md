---
layout: blog
title: "k8s.gcr.io O registro de imagens será congelado a partir de 3 de abril de 2023"
date: 2023-02-06
slug: k8s-gcr-io-freeze-announcement
---

**Autor**: Mahamed Ali (Rackspace Technology)

O projeto Kubernetes executa um registro de imagens de propriedade da comunidade chamado `registry.k8s.io` para hospedar suas imagens de contêiner. 
No dia 3 de abril de 2023, o antigo registro k8s.gcr.io será congelado e nenhuma nova imagem para o Kubernetes e subprojetos relacionados será enviada para o registro antigo.

Este registro `registry.k8s.io` substituiu o antigo e está disponível há vários meses. Publicamos uma [postagem no blog](/pt-br/blog/2022/11/28/registry-k8s-io-faster-cheaper-ga/) sobre seus benefícios para a comunidade e o projeto Kubernetes. 
Este post também anunciou que versões futuras do Kubernetes não estarão disponíveis no registro antigo. Agora chegou essa hora.

O que essa mudança significa para os colaboradores:
- Se você é um mantenedor de um subprojeto, precisará atualizar seus manifestos e Helm charts para usar o novo registro.

O que essa mudança significa para os usuários finais:
- A versão 1.27 do Kubernetes não será publicada no registro antigo.
- As versões de patch para 1.24, 1.25 e 1.26 não serão mais publicadas no registro antigo a partir de abril. Leia a linha do tempo abaixo para obter detalhes sobre os lançamentos finais de patches no registro antigo.
- A partir da versão 1.25, o registro de imagem padrão foi definido como `registry.k8s.io`. Este valor é substituível nos programas `kubeadm` e `kubelet`, mas defini-lo como `k8s.gcr.io` falhará para novas versões após abril, pois as imagens dessas novas versões não estarão disponíveis no registro antigo.
- Se você quiser aumentar a confiabilidade do seu cluster e remover a dependência do registro de propriedade da comunidade ou se estiver executando o Kubernetes em redes onde o tráfego externo é restrito, considere hospedar uma cópia local do registro de imagens. Alguns fornecedores de nuvem podem oferecer soluções para isso.

## Linha do tempo das mudanças

- `k8s.gcr.io` será congelado no dia 3 de abril de 2023
- Espera-se que a versão 1.27 seja lançada em 12 de abril de 2023
- A última versão da 1.23 no `k8s.gcr.io` será 1.23.18 (a versão 1.23 deixará de ser suportada antes do congelamento do k8s.gcr.io)
- A última versão 1.24 no `k8s.gcr.io` será 1.24.12
- A última versão 1.25 no `k8s.gcr.io` será 1.25.8
- A última versão 1.26 no `k8s.gcr.io` será 1.26.3

## Próximos passos

Certifique-se de que o seu cluster não tenha dependências no registro de imagens antigo. Por exemplo, você pode executar este comando para listar as imagens usadas pelos Pods:

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

Pode haver outras dependências no antigo registro de imagens. 
Certifique-se de revisar quaisquer dependências potenciais para manter seu cluster saudável e atualizado.

## Agradecimentos

__A mudança é difícil__, e a evolução de nossa plataforma de serviço de imagem é necessária para garantir um futuro sustentável para o projeto. Nós nos esforçamos para melhorar as coisas para todos que utilizam o Kubernetes. Muitos colaboradores de todos os cantos da nossa comunidade têm trabalhado muito e com dedicação para garantir que estamos tomando as melhores decisões possíveis, executando planos e fazendo o nosso melhor para comunicar esses planos.

Obrigado a Aaron Crickenberger, Arnaud Meukam, Benjamin Elder, Caleb Woodbine, Davanum Srinivas, Mahamed Ali, e Tim Hockin do grupo de interesse especial (SIG) K8s Infra, Brian McQueen, e Sergey Kanzhelev do SIG Node, Lubomir Ivanov do SIG Cluster Lifecycle, Adolfo García Veytia, Jeremy Rickard, Sascha Grunert, e Stephen Augustus do SIG Release, Bob Killen and Kaslin Fields do SIG Contribex, Tim Allclair do Comitê de Resposta de Segurança. Um grande obrigado também aos nossos amigos que atuam como pontos de contato com nossos provedores de nuvem parceiros: Jay Pipes da Amazon e Jon Johnson Jr. do Google.