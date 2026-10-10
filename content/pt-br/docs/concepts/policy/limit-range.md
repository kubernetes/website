---
title: Intervalos de limite
content_type: concept
weight: 10
---

<!-- overview -->

Por padrão, os cointêineres são executados com [recursos computacionais](/docs/concepts/configuration/manage-resources-containers/) ilimitados em um cluster Kubernetes. Com cotas de recursos, os administradores de cluster podem restringir o consumo e a criação de recursos baseado no {{< glossary_tooltip text="namespace" term_id="namespace" >}}. Dentro de um _namespace_, pod ou contêiner pode haver o consumo de quantidade de CPU e memória definidos de acordo com a cota de recursos do _namespace_. Existe a preocupação de que um Pod ou contêiner possa monopolizar todos os recursos disponíveis, justamente por conta disso existe o conceito de _Limit Range_, ou intervalos de limite, que pode ser definido como uma política utilizada para a restrição de alocação de recursos (para pods ou contêineres) em um _namespace_.

<!-- body -->

Um _LimitRange_ fornece restrições que podem:

- Aplicar o uso mínimo e máximo de recursos computacionais por pod ou contêiner em um _namespace_.
- Impor a solicitação de armazenamento mínimo e máximo por _PersistentVolumeClaim_ em um _namespace_.
- Impor a proporção entre solicitação e limite para um recurso em um _namespace_.
- Definir a solicitação/limite padrão para recursos computacionais em um _namespace_ e utilizá-los automaticamente nos contêineres em tempo de execução.

## Ativando o LimitRange

O suporte ao _LimitRange_ foi ativado por padrão desde o Kubernetes 1.10.

Um _LimitRange_ é aplicado em um _namespace_ específico quando há um objeto _LimitRange_ nesse _namespace_.

O nome de um objeto _LimitRange_ deve ser um [nome de subdomínio DNS](/pt-br/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) válido.

### Visão geral do Limit Range

- O administrador cria um _LimitRange_ em um _namespace_.
- Os usuários criam recursos como pods, contêineres e _PersistentVolumeClaims_ no _namespace_.
- O controlador de admissão `LimitRanger` impõe padrões e limites para todos os pods e contêineres que não definem os requisitos de recursos computacionais e rastreia o uso para garantir que não exceda o mínimo, o máximo e a proporção de recursos definidos em qualquer _LimitRange_ presente no _namespace_.
- Se estiver criando ou atualizando um recurso (Pod, Container, _PersistentVolumeClaim_) que viola uma restrição _LimitRange_, a solicitação ao servidor da API falhará com um código de status HTTP `403 FORBIDDEN` e uma mensagem explicando a restrição violada.
- Se um _LimitRange_ for ativado em um _namespace_ para recursos computacionais como `cpu` e `memória`, os usuários deverão especificar solicitações ou limites para esses valores. Caso contrário, o sistema pode rejeitar a criação do pod.
- As validações de _LimitRange_ ocorrem apenas no estágio de Admissão de Pod, não em Pods em Execução.

Alguns exemplos de políticas que podem ser criadas utilizando os intervalos de limite são:

- Em um cluster de 2 nós com capacidade de 8 GiB de RAM e 16 núcleos, restrinja os Pods em um namespace para solicitar 100m de CPU com um limite máximo de 500m para CPU e solicitar 200Mi para memória com um limite máximo de 600Mi para memória.
- Defina o limite e a solicitação de CPU padrão para 150m e a solicitação padrão de memória para 300Mi para contêineres iniciados sem solicitações de CPU e memória em suas especificações.

Caso os limites totais do namespace sejam menores que a soma dos limites dos Pods/Contêineres, pode haver contenção por recursos. Nesse caso, os contêineres ou Pods não serão criados.

Nem a contenção nem as alterações em um _LimitRange_ afetarão os recursos já criados.

## {{% heading "whatsnext" %}}

Consulte o [documento de design LimitRanger](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md) para obter mais informações.

Para exemplos de uso de limites, leia:

- [Como configurar restrições mínimas e máximas de CPU por _namespace_](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/).
- [Como configurar restrições de memória mínima e máxima por _namespace_](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/).
- [como configurar solicitações e limites de CPU padrão por _namespace_](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/).
- [como configurar solicitações e limites de memória padrão por _namespace_](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/).
- [como configurar o consumo mínimo e máximo de armazenamento por _namespace_](/docs/tasks/administer-cluster/limit-storage-consumption/#limitrange-to-limit-requests-for-storage).
- Um [exemplo detalhado de configuração de cota por _namespace_](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/).

