---
title: Informações de Segurança e Divulgação do Kubernetes
aliases: [/pt-br/security/]
content_type: concept
weight: 20
---

<!-- overview -->

Esta página descreve informações de segurança e divulgação do Kubernetes.


<!-- body -->
## Anúncios de Segurança

Junte-se ao grupo [kubernetes-security-announce](https://groups.google.com/forum/#!forum/kubernetes-security-announce) para receber e-mails sobre segurança e os principais anúncios de API.


## Relatar uma Vulnerabilidade

Somos extremamente gratos pelos pesquisadores de segurança e usuários que relatam vulnerabilidades para a Comunidade Open Source do Kubernetes. Todos os relatos são minuciosamente investigados por um conjunto de voluntários da comunidade.

Para relatar, envie sua vulnerabilidade para o [programa de recompensa de bug do Kubernetes](https://hackerone.com/kubernetes). Isso possibilita a triagem e o tratamento da vulnerabilidade com tempos de resposta padronizados. 

Você também pode enviar um e-mail para a lista privada [security@kubernetes.io](mailto:security@kubernetes.io) com os detalhes de segurança e os detalhes esperados para [todos os relatos de bugs do Kubernetes](https://github.com/kubernetes/kubernetes/blob/master/.github/ISSUE_TEMPLATE/bug-report.yaml).

Você pode criptografar seu e-mail para esta lista usando as chaves GPG dos [membros do Comitê de Resposta de Segurança](https://git.k8s.io/security/README.md#product-security-committee-psc). A criptografia usando GPG NÃO é requerida para fazer a divulgação.

### Quando Devo Relatar uma Vulnerabilidade?

- Você acha que você descobriu uma potencial vulnerabilidade de segurança no Kubernetes
- Você não tem certeza como a vulnerabilidade afeta o Kubernetes
- Você acha que você descobriu uma vulnerabilidade em outro projeto que o Kubernetes depende
    - Para projetos com seus próprios processos de relatar e divulgar vulnerabilidade, por favor informe o problema diretamente para os responsáveis deste projeto


### Quando Não Devo Relatar uma Vulnerabilidade?

- Você precisa de ajuda para ajustar os componentes do Kubernetes para segurança
- Você precisa de ajuda para aplicar as atualizações relacionadas a segurança
- Seu problema não é relacionado a segurança

## Resposta de Vulnerabilidade de Segurança

Cada relato é confirmado e analisado pelos membros do Comitê de Resposta de Segurança com 3 dias úteis. Isso iniciará o [Processo de Release de Segurança](https://git.k8s.io/security/security-release-process.md#disclosures).

Qualquer informação de vulnerabilidade compartilhada com o Comitê de Resposta de Segurança fica dentro do projeto Kubernetes e não vai ser disseminada para outro projeto, a menos que seja necessário para corrigir o problema.

À medida que o problema de segurança passa da triagem, para correção identificada e para o planejamento da release, vamos manter o relator atualizado.

## Momento de Divulgação Pública

Uma data de divulgação pública é negociada pelo Comitê de Resposta de Segurança do Kubernetes e pelo relator do bug. Preferimos divulgar totalmente o bug mais rápido possível assim que uma mitigação estiver disponível para os usuários. É razoável adiar a divulgação quando o bug ou a correção não estiver completamente compreendida, a solução não estiver bem testada, ou para coordenação do fornecedor. O prazo para a divulgação é de imediato (especialmente se já for conhecido publicamente) para algumas semanas. Para uma vulnerabilidade com uma mitigação simples, esperamos que a data do relato até a data de divulgação seja da ordem de 7 dias. O Comitê de Resposta de Segurança do Kubernetes possui a palavra final ao estabelecer uma data de divulgação.

