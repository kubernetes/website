---
title: Migrando de PodSecurityPolicy Para Controlador de admissão Integrado
reviewers:
- tallclair
- liggitt
content_type: task
min-kubernetes-server-version: v1.22
---

<!-- overview -->

Esta página descreve o processo de migração de `PodSecurityPolicies` para 
o controlador de admissão `PodSecurity` integrado. Isso pode ser feito de maneira 
eficaz usando uma combinação de modos `dry-run` (ensaio/simulação), `audit` e
`warn`, embora isso se torne mais difícil se PSPs mutáveis forem usados.

## {{% heading "prerequisites" %}}

{{% version-check %}}

- Garantir que a funcionalidade `PodSecurity` do [portal de funcionalidades]
(/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features) 
esteja habilitada.

Esta página pressupõe que você já esteja familiarizado com os conceitos básicos da
[Segurança de Admissão de Pod](/docs/concepts/security/pod-security-admission/).

<!-- body -->

## Abordagem global

Existem várias estratégias que você pode usar para migrar de `PodSecurityPolicy` 
para a Segurança de Admissão de Pod. As etapas a seguir são um possível caminho 
de migração, com o objetivo de minimizar os dois riscos, de uma interrupção 
de produção e/ou uma lacuna de segurança.

<!-- Keep section header numbering in sync with this list. -->
0. Decida se a Segurança de Admissão de Pod é o adequado para o seu caso de uso.
1. Revise as permissões do namespace
2. Simplifique e padronize as `PodSecurityPolicies`
3. Atualize os namespaces
   1. Identifique um nível apropriado de segurança de Pod
   2. Verifique o nível de segurança do Pod
   3. Aplique o nível de segurança do Pod
   4. Desvie o `PodSecurityPolicy`
4. Revise os processos de criação do namespace
5. Desabilite o `PodSecurityPolicy`

## 0. Decida se a Segurança de Admissão de Pod é o correto para você {#is-psa-right-for-you}

Segurança de Admissão de Pod foi projetado para atender às necessidades de segurança mais 
comuns, e para fornecer um conjunto padrão de níveis de segurança entre clusters. 
No entanto, é menos flexível do que o `PodSecurityPolicy`. Notavelmente, os seguintes 
recursos são suportados pela `PodSecurityPolicy` mas não pela Segurança de Admissão do Pod:

- **Definindo restrições de segurança padrão** - Segurança de Admissão de Pod 
  é um controlador de admissão não mutável, significando que não modificará 
  os pods antes de validá-los. Se você estava confiando nesse aspecto do PSP, 
  você precisará modificar suas cargas de trabalho para atender às restrições 
  de segurança do Pod, ou usar um [Webhook de admissão mutante]
  (/docs/reference/access-authn-authz/extensible-admission-controllers/)
  para fazer essas mudanças. Veja [Simplificando e padronizando `PodSecurityPolicies`]
  (#simplify-psps) abaixo, para mais detalhes.

- **Controle de granularidade sobre a definição de política** 
- A Segurança de Admissão de Pod somente suporta 
  [3 níveis padrão](/docs/concepts/security/pod-security-standards/).
  Se você precisar de mais controle sobre restrições específicas, então você 
  precisará usar um [Webhook de validação de admissão]
  (/docs/reference/access-authn-authz/extensible-admission-controllers/) 
  para fazer cumprir essas políticas.

- **Granularidade da política de sub-namespace** - `PodSecurityPolicy` permite 
  vincular políticas diferentes a contas de serviço ou usuários, mesmo dentro 
  de um único namespace. Esta abordagem tem muitas armadilhas e não é recomendada, 
  mas se você precisa desse recurso de qualquer maneira, você vai precisar usar 
  um webhook de terceiros. A exceção a isso é se você apenas precisar liberar 
  completamente usuários específicos ou [Classes de Runtime](/docs/concepts/containers/runtime-class/),
  nesse caso a Segurança de Admissão do Pod irá expor alguma
  [Configuração estática para isenções](/docs/concepts/security/pod-security-admission/#exemptions).

Mesmo que a Segurança de Admissão de Pod não atenda a todas as suas necessidades, 
ela foi projetada para ser _complementar_ a outros mecanismos de aplicação de políticas, 
e pode fornecer um controle de falha útil, rodando ao lado de outro Webhook de admissão.


## 1. Revise as permissões de namespace {#review-namespace-permissions}

A Admissão de segurança do Pod é controlada através de [rótulos em namespaces]
(/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces).
Isso significa que qualquer um que pode atualizar (ou corrigir, ou criar) um namespace, 
também pode modificar o nível de segurança para esse namespace, o que poderia ser 
usado para burlar uma política mais restritiva. Antes de continuar, garanta que 
apenas usuários confiáveis, privilegiados tenham essas permissões no namespace. 
Não é recomendado conceder essas permissões tão poderosas aos usuários que 
não deveriam ter permissões elevadas, mas se você precisar, necessitará usar um
[webhook de admissão](/docs/reference/access-authn-authz/extensible-admission-controllers/)
para colocar restrições adicionais ao definir rótulos de segurança de pod 
em objetos Namespace.

## 2. Simplifique e padronize as `PodSecurityPolicies` {#simplify-psps}

Nesta seção, você reduzirá as `PodSecurityPolicies` mutantes e removerá as opções 
que estão fora do escopo dos padrões de segurança de pod. Você deve fazer 
as alterações recomendadas aqui, em uma cópia da `PodSecurityPolicy` original,  
sendo modificada offline. O PSP clonado deve ter um nome diferente do original 
(por exemplo, coloque um `0` antes). Não crie as novas políticas no Kubernetes ainda
- que será coberto no [implementador de políticas atualizadas](#psp-update-rollout) 
na seção abaixo.

### 2.a. Elimine campos puramente mutantes {#eliminate-mutating-fields}

Se a `PodSecurityPolicy` está mudando os pods, então você pode eliminar os pods que 
não satisfazem os requisitos do nível de segurança do Pod, quando você finalmente 
desativar a `PodSecurityPolicy`. Para evitar isso, você deve eliminar todo PSP mutante 
antes da troca. Infelizmente o PSP não separa de maneira clara os campos mutantes 
e de validação, portanto, esta não é uma migração direta.

Você pode começar eliminando os campos que são puramente mutantes e não têm nenhuma 
influência na política de validação. Esses campos de referência (também listados no 
[Mapeando Padrões de Segurança `PodSecurityPolicies` ao Pod]
(/docs/reference/access-authn-authz/psp-to-pod-security-standards/)) são:

- `.spec.defaultAllowPrivilegeEscalation`
- `.spec.runtimeClass.defaultRuntimeClassName`
- `.metadata.annotations['seccomp.security.alpha.kubernetes.io/defaultProfileName']`
- `.metadata.annotations['apparmor.security.beta.kubernetes.io/defaultProfileName']`
- `.spec.defaultAddCapabilities` - Embora tecnicamente um campo de mutação e validação, 
   devam ser fundidos em `.spec.allowedCapabilities` 
   que executa a mesma validação sem realizar mutações.

{{< caution >}}
Remover isso pode resultar em cargas de trabalho perdendo configuração necessária, 
e causar problemas. Veja [Implementando as políticas atualizadas](#psp-update-rollout) 
abaixo, para obter sugestões sobre como implementar essas mudanças com segurança.
{{< /caution >}}

### 2.b. Elimine as opções não cobertas pelos padrões de segurança 
de pod {#eliminate-non-standard-options}

Existem vários campos em `PodSecurityPolicy` que não são cobertos pelos padrões 
de segurança de Pod. Se você precisa aplicar essas opções, você precisará complementar 
a admissão de segurança de Pod com um
[webhook de admissão](/docs/reference/access-authn-authz/extensible-admission-controllers/),
que está fora do escopo deste guia.

Primeiro, você pode remover os campos puramente validadores que não cobrem os 
padrões de segurança de Pod. Esses campos (também listados no
[Mapeando de Padrões de Segurança `PodSecurityPolicies` ao Pod](/docs/reference/access-authn-authz/psp-to-pod-security-standards/)
referenciados por "no opinion") que são:

- `.spec.allowedHostPaths`
- `.spec.allowedFlexVolumes`
- `.spec.allowedCSIDrivers`
- `.spec.forbiddenSysctls`
- `.spec.runtimeClass`

Você também pode remover os seguintes campos, relacionados a grupos 
de contrôles POSIX / UNIX.

{{< caution >}}
Se algum deles usar a estratégia `MustRunAs` eles podem estar mudando! 
Remover isso pode resultar em cargas de trabalho, não definindo corretamente 
os grupos necessários, e causar problemas. Veja [Implantando as políticas atualizadas]
(#psp-update-rollout) abaixo para obter sugestões sobre como implementar 
essas mudanças com segurança. 

{{< /caution >}}

- `.spec.runAsGroup`
- `.spec.supplementalGroups`
- `.spec.fsGroup`

Os campos de mutação restantes são necessários para suportar adequadamente os padrões 
de segurança de Pod, e precisarão ser tratados caso a caso mais tarde:

- `.spec.requiredDropCapabilities` - Necessário para derrubar `ALL` para o perfil restrito.
- `.spec.seLinux` - (Apenas mutação com a regra `MustRunAs`) necessário para fazer cumprir 
  os requisitos de SELinux da `Baseline` e Perfis restritos.
- `.spec.runAsUser` - (Não mutante com a regra `RunAsAny`) necessário para aplicar 
  `RunAsNonRoot` para o perfil restrito.
- `.spec.allowPrivilegeEscalation` - (Se somente mutante estiver como `false`) 
  necessário para o perfil restrito.

### 2.c. Implantando os PSPs atualizados {#psp-update-rollout}

Em seguida, você pode implantar as políticas alteradas ao seu cluster. 
Você deve prosseguir com cautela, a remoção das opções de mutação pode resultar 
em cargas de trabalho com perda da configuração necessária.

Para cada atualização `PodSecurityPolicy`:

1. Identifique Pods em execução sob o PSP original. Isso pode ser feito usando 
a anotação `kubernetes.io/psp`. 
Por exemplo, usando o kubectl:
   ```sh
   PSP_NAME="original" # Defina o nome do PSP que você está checando
   kubectl get pods --all-namespaces -o jsonpath="{range .items[?(@.metadata.annotations.kubernetes\.io\/psp=='$PSP_NAME')]}{.metadata.namespace} {.metadata.name}{'\n'}{end}"
   ```
2. Compare esses Pods em execução com a especificação original do Pod, 
   para determinar se a `PodSecurityPolicy` modificou o Pod. Para pods criados pelo 
   [recurso de cargas de trabalho](/docs/concepts/workloads/controllers/)
   você pode comparar o pod com o `PodTemplate` no controlador de recurso. 
   Se alguma alteração for identificada, o Pod original ou `PodTemplate` 
   deve ser atualizado com a configuração desejada.
   Os campos para revisar são:
   - `.metadata.annotations['container.apparmor.security.beta.kubernetes.io/*']` 
     (Substitua * pelo nome de cada contêiner)
   - `.spec.runtimeClassName`
   - `.spec.securityContext.fsGroup`
   - `.spec.securityContext.seccompProfile`
   - `.spec.securityContext.seLinuxOptions`
   - `.spec.securityContext.supplementalGroups`
   - Em contêneres, sob `.spec.containers[*]` e `.spec.initContainers[*]`:
       - `.securityContext.allowPrivilegeEscalation`
       - `.securityContext.capabilities.add`
       - `.securityContext.capabilities.drop`
       - `.securityContext.readOnlyRootFilesystem`
       - `.securityContext.runAsGroup`
       - `.securityContext.runAsNonRoot`
       - `.securityContext.runAsUser`
       - `.securityContext.seccompProfile`
       - `.securityContext.seLinuxOptions`
3. Crie a nova `PodSecurityPolicies`. Se quaisquer `Roles` ou `ClusterRoles` estão 
   permitindo `use` em todas as PSPs, isso poderia ocasionar que um novo PSPs 
   fosse usado em vez de suas contrapartes mutantes.
4. Altere sua autorização, para permitir o acesso aos novos PSPs. No RBAC isso 
   significa alterar todas `Roles` ou `ClusterRoles`, que dão a permissão `use` 
   no PSP original, para dar a permissão também ao PSP alterado.
5. Verifique: após algum tempo, execute novamente o comando da etapa 1 
   para ver se algum dos Pods ainda está usando os PSPs originais. 
   Observe que os pods precisam ser recriados depois que as novas políticas 
   foram implantadas, antes que elas possam ser totalmente verificadas.
6. (opcional) Depois de verificar se os PSPs originais, não estão mais em uso, 
   você pode exclui-los.

## 3. Alterar Namespaces {#update-namespaces}

As etapas a seguir precisarão ser executadas em cada namespace do cluster. Comandos 
referenciados nessas etapas, usam a variável `$NAMESPACE` 
para referir-se ao namespace sendo alterado.

### 3.a. Identifique um nível apropriado de segurança de Pod {#identify-appropriate-level}

Comece a revisar os [Padrões de Segurança de Pod](/docs/concepts/security/pod-security-standards/) 
e familiarize-se com os 3 níveis diferentes.

Existem várias maneiras de escolher um nível de segurança de Pod para o seu namespace:

1. **Por requisitos de segurança para o namespace** - Se você estiver familiarizado 
   com o nível de acesso esperado para o namespace, você pode escolher um nível 
   apropriado com base nesses requisitos, semelhante a como alguém poderia 
   abordar isso em um novo cluster.
2. **Por existir PodSecurityPolicies** - Usando a referência
   [Mapeando a `PodSecurityPolicies` para os Padrões de Segurança de Pod]
   (/docs/reference/access-authn-authz/psp-to-pod-security-standards/)
   você pode mapear cada PSP para um nível Padrão de Segurança de Pod.
   Se os seus PSPs não são baseados nos Padrões de Segurança de Pod, você
   pode precisar decidir, entre escolher um nível que seja pelo menos tão permissivo 
   quanto o PSP, e um nível que é pelo menos tão restritivo quanto a PSP. Você pode 
   ver quais PSPs estão em uso pelos Pods em um determinado namespace com este comando:

   ```sh
   kubectl get pods -n $NAMESPACE -o jsonpath="{.items[*].metadata.annotations.kubernetes\.io\/psp}" | tr " " "\n" | sort -u
   ```

3. **Por existirem pods** - Usando as estratégias em [verificando o nível de segurança do pod]
   (#verify-pss-level), você pode testar os dois níveis `Baseline` e `Restricted` para 
   ver se eles são suficientemente permissivos para as cargas de trabalho existentes, 
   e escolher o nível menos privilegiado válido.

{{< caution >}}
As opções 2 e 3 acima são baseadas em Pods _existentes_, e podem perder cargas de 
trabalho que não estão atualmente executando, como CronJobs, cargas de trabaho 
escaladas-para-zero, ou outras cargas de trabalho que não foram implantadas.
{{< /caution >}}

### 3.b. Verifique o nível de segurança do pod {#verify-pss-level}

Depois de selecionar um nível de segurança de pod para o namespace 
(ou se você está tentando vários), é uma boa ideia testá-lo primeiro 
(você pode pular esta etapa se estiver usando o nível privilegiado). A segurança
de Pod, inclui várias ferramentas para ajudar a testar e implantar perfis com segurança.

Primeiro, você pode fazer uma simulação da política, que irá avaliar se os pods 
estão executando corretamente no namespace de acordo com a política aplicada, 
sem fazer com que a nova política tenha efeito:

```sh
# $LEVEL é o nível de `dry-run`, entre "baseline" ou "restricted".
kubectl label --dry-run=server --overwrite ns $NAMESPACE pod-security.kubernetes.io/enforce=$LEVEL
```
Este comando retornará um aviso para quaisquer Pods _existentes_ que não são válidos 
sob o nível proposto.

A segunda opção é melhor para capturar cargas de trabalho, que não estão executando 
no momento: modo de auditoria. Quando executando sob o modo de auditoria 
(ao contrário de impositivo), Pods que violam o nível da política são registrados 
nos logs de auditoria, que podem ser revisados mais tarde após um tempo 
hábil, mas não são bloqueados. O modo de aviso funciona da mesma forma, 
mas retorna o aviso ao usuário imediatamente. Você pode definir o nível de auditoria
em um namespace com este comando:
```sh
kubectl label --overwrite ns $NAMESPACE pod-security.kubernetes.io/audit=$LEVEL
```

Se qualquer uma dessas abordagens produz violações inesperadas, você precisará 
atualizar quem estiver violando as cargas de trabalho: para atender aos requisitos 
da política, ou relaxar o nível de segurança do namespace de Pod.

### 3.c. Aplicar o nível de segurança do pod {#enforce-pod-security-level}

Quando você estiver satisfeito que o nível escolhido pode ser aplicado com segurança 
no namespace, você pode atualizar o namespace para aplicar o nível desejado:

```sh
kubectl label --overwrite ns $NAMESPACE pod-security.kubernetes.io/enforce=$LEVEL
```

### 3.d. Desviando a `PodSecurityPolicy` {#bypass-psp}

Finalmente, você pode desviar efetivamente a `PodSecurityPolicy` de nível no namespace 
ligando totalmente {{< example file="policy/privileged-psp.yaml" >}} PSP privilegiado {{< /example >}} 
para todas as contas de serviço do namespace.

```sh
# Os seguintes comandos no escopo do cluster são necessários apenas uma vez.

kubectl apply -f privileged-psp.yaml
kubectl create clusterrole privileged-psp --verb use --resource podsecuritypolicies.policy --resource-name privileged

# Desabilitar por namespace

kubectl create -n $NAMESPACE rolebinding disable-psp --clusterrole privileged-psp --group system:serviceaccounts:$NAMESPACE
```

Desde que a PSP privilegiada seja intocável, e o controlador de admissão do PSP sempre
prefira PSPs imutáveis, isso garantirá que os pods neste namespace não estão mais 
sendo modificados ou restritos pela `PodSecurityPolicy`.

A vantagem de desativar `PodSecurityPolicy` baseada em por-namespace como essa, é 
se o problema surge você pode facilmente desfazer a mudança, apagando a `RoleBinding`. 
Apenas certifique-se de que as pré-existentes `PodSecurityPolicies` ainda estão no lugar!

```sh
# Desfazer a `PodSecurityPolicy` desabilitada.
kubectl delete -n $NAMESPACE rolebinding disable-psp
```

## 4. Revise os processos de criação de namespace {#review-namespace-creation-process}

Agora que os namespaces existentes foram atualizados para aplicar a segurança 
de admissão dos Pods, você deve garantir que seus processos, e/ou políticas 
para criar novos namespaces, estão atualizadas para garantir que um
apropriado perfil se seguranca do Pod, seja aplicado aos seus novos namespaces.

Você também pode configurar estaticamente o controlador de admissão de segurança 
de Pods para aplicar um nível padrão, `audit`, e/ou `warn` para os namespaces sem rótulos. 
Veja [Configurar o controlador de admissão]
(/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller)
para mais informações.

## 5. Desative a `PodSecurityPolicy` {#disable-psp}

Finalmente, você está pronto para desativar a `PodSecurityPolicy`. Para fazer isso, 
você precisará modificar a configuração de admissão do servidor de API:
[Como faço para desligar um controlador de admissão?]
(/docs/reference/access-authn-authz/admission-controllers/#how-do-i-turn-off-an-admission-controller).

Para verificar se a `PodSecurityPolicy` no controlador de admissão não está mais ativada, 
você pode executar manualmente um teste, se passando por um usuário sem acesso a nenhuma 
`PodSecurityPolicies` (veja o 
[exemplo de PodSecurityPolicy](/docs/concepts/security/pod-security-policy/#example)), 
ou verificando nos logs do servidor de API. Na inicialização, o servidor de API 
produz linhas de log, listando os plugins carregados pelo controlador de admissão:

```
I0218 00:59:44.903329      13 plugins.go:158] Loaded 16 mutating admission controller(s) successfully in the following order: NamespaceLifecycle,LimitRanger,ServiceAccount,NodeRestriction,TaintNodesByCondition,Priority,DefaultTolerationSeconds,ExtendedResourceToleration,PersistentVolumeLabel,DefaultStorageClass,StorageObjectInUseProtection,RuntimeClass,DefaultIngressClass,MutatingAdmissionWebhook.
I0218 00:59:44.903350      13 plugins.go:161] Loaded 14 validating admission controller(s) successfully in the following order: LimitRanger,ServiceAccount,PodSecurity,Priority,PersistentVolumeClaimResize,RuntimeClass,CertificateApproval,CertificateSigning,CertificateSubjectRestriction,DenyServiceExternalIPs,ValidatingAdmissionWebhook,ResourceQuota.
```

Você deveria olhar a `PodSecurity` (validando controladores de admissão), 
e nenhuma lista deveria conter a `PodSecurityPolicy`.

Depois de ter certeza de que o controlador de admissão da PSP está desativado 
(e depois de tempo suficiente, para estar confiante de que você não precisará reverter), 
você está livre para excluir seu `PodSecurityPolicies` e quaisquer `Roles`, `ClusterRoles`, 
`RoleBindings` e `ClusterRoleBindings` associadas (Apenas certifique-se de que eles não
concedem quaisquer outras permissões não relacionadas).
