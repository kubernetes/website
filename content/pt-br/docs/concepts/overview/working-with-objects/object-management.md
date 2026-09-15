---
title: Gerenciamento de objetos do Kubernetes
content_type: concept
weight: 20
---

<!-- overview -->
A ferramenta de linha de comando `kubectl` suporta várias maneiras diferentes de criar e gerenciar
{{< glossary_tooltip text="objetos" term_id="object" >}} do Kubernetes. Este documento fornece uma visão geral das diferentes
abordagens. Leia o [Kubectl book](https://kubectl.docs.kubernetes.io) para
conhecer os detalhes de como gerenciar objetos com o Kubectl.

<!-- body -->

## Técnicas de gerenciamento

{{< warning >}}
Um objeto do Kubernetes deve ser gerenciado usando apenas uma técnica. Misturar
e combinar técnicas para o mesmo objeto resulta em comportamento indefinido.
{{< /warning >}}

| Técnica de gerenciamento           | Opera em             | Ambiente recomendado | Escritores suportados | Curva de aprendizado |
|------------------------------------|----------------------|----------------------|-----------------------|----------------------|
| Comandos imperativos               | Objetos ativos (live) | Projetos de desenvolvimento | 1+                  | Mais baixa      |
| Configuração imperativa de objetos | Arquivos individuais | Projetos de produção | 1                     | Moderada             |
| Configuração declarativa de objetos | Diretórios de arquivos | Projetos de produção | 1+                  | Mais alta            |

## Comandos imperativos

Ao usar comandos imperativos, o usuário opera diretamente em objetos ativos (live)
em um cluster. O usuário fornece as operações ao
comando `kubectl` como argumentos ou flags.

Esta é a maneira recomendada para começar ou para executar uma tarefa única (one-off)
em um cluster. Como esta técnica opera diretamente em
objetos ativos, ela não fornece histórico das configurações anteriores.

### Exemplos

Execute uma instância do contêiner nginx criando um objeto Deployment:

```sh
kubectl create deployment nginx --image nginx
```

### Vantagens e desvantagens

Vantagens em comparação com a configuração de objetos:

- Os comandos são expressos como uma única palavra de ação.
- Os comandos exigem apenas uma única etapa para fazer alterações no cluster.

Desvantagens em comparação com a configuração de objetos:

- Os comandos não se integram aos processos de revisão de alterações.
- Os comandos não fornecem um registro de auditoria (audit trail) associado às alterações.
- Os comandos não fornecem uma fonte de registros, exceto o que está ativo.
- Os comandos não fornecem um modelo para criar novos objetos.

## Configuração imperativa de objetos

Na configuração imperativa de objetos, o comando kubectl especifica a
operação (create, replace, etc.), flags opcionais e pelo menos um nome
de arquivo. O arquivo especificado deve conter uma definição completa do objeto
no formato YAML ou JSON.

Consulte a [referência da API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
para obter mais detalhes sobre as definições de objetos.

{{< warning >}}
O comando imperativo `replace` substitui a spec existente
pela recém-fornecida, descartando todas as alterações feitas no objeto que estejam ausentes do
arquivo de configuração. Esta abordagem não deve ser usada com tipos de
recursos cujas specs são atualizadas de forma independente do arquivo de configuração.
Services do tipo `LoadBalancer`, por exemplo, têm seu campo `externalIPs` atualizado
de forma independente da configuração, pelo cluster.
{{< /warning >}}

### Exemplos

Crie os objetos definidos em um arquivo de configuração:

```sh
kubectl create -f nginx.yaml
```

Exclua os objetos definidos em dois arquivos de configuração:

```sh
kubectl delete -f nginx.yaml -f redis.yaml
```

Atualize os objetos definidos em um arquivo de configuração sobrescrevendo
a configuração ativa:

```sh
kubectl replace -f nginx.yaml
```

### Vantagens e desvantagens

Vantagens em comparação com os comandos imperativos:

- A configuração de objetos pode ser armazenada em um sistema de controle de versão, como o Git.
- A configuração de objetos pode se integrar a processos como a revisão de alterações antes do push e registros de auditoria.
- A configuração de objetos fornece um modelo para criar novos objetos.

Desvantagens em comparação com os comandos imperativos:

- A configuração de objetos exige compreensão básica do schema do objeto.
- A configuração de objetos exige a etapa adicional de escrever um arquivo YAML.

Vantagens em comparação com a configuração declarativa de objetos:

- O comportamento da configuração imperativa de objetos é mais simples e fácil de entender.
- A partir da versão 1.5 do Kubernetes, a configuração imperativa de objetos é mais madura.

Desvantagens em comparação com a configuração declarativa de objetos:

- A configuração imperativa de objetos funciona melhor em arquivos, não em diretórios.
- As atualizações em objetos ativos devem ser refletidas nos arquivos de configuração, caso contrário serão perdidas durante a próxima substituição.

## Configuração declarativa de objetos

Ao usar a configuração declarativa de objetos, o usuário opera em arquivos de
configuração de objetos armazenados localmente; no entanto, o usuário não define as
operações a serem realizadas nos arquivos. As operações de criação, atualização e exclusão
são detectadas automaticamente por objeto pelo `kubectl`. Isso permite trabalhar
com diretórios, onde operações diferentes podem ser necessárias para objetos diferentes.

{{< note >}}
A configuração declarativa de objetos mantém as alterações feitas por outros
escritores, mesmo que as alterações não sejam mescladas de volta ao arquivo de configuração do objeto.
Isso é possível usando a operação de API `patch` para gravar apenas
as diferenças observadas, em vez de usar a operação de API `replace`
para substituir toda a configuração do objeto.
{{< /note >}}

### Exemplos

Processe todos os arquivos de configuração de objetos no diretório `configs` e crie ou
aplique patch aos objetos ativos. Você pode primeiro executar um `diff` para ver quais alterações serão
feitas e, em seguida, aplicar:

```sh
kubectl diff -f configs/
kubectl apply -f configs/
```

Processe diretórios recursivamente:

```sh
kubectl diff -R -f configs/
kubectl apply -R -f configs/
```

### Vantagens e desvantagens

Vantagens em comparação com a configuração imperativa de objetos:

- As alterações feitas diretamente em objetos ativos são mantidas, mesmo que não sejam mescladas de volta aos arquivos de configuração.
- A configuração declarativa de objetos tem melhor suporte para operar em diretórios e detectar automaticamente os tipos de operação (create, patch, delete) por objeto.

Desvantagens em comparação com a configuração imperativa de objetos:

- A configuração declarativa de objetos é mais difícil de depurar e de entender os resultados quando eles são inesperados.
- As atualizações parciais usando diffs criam operações complexas de merge e patch.

## {{% heading "whatsnext" %}}

- [Gerenciando objetos do Kubernetes usando comandos imperativos](/docs/tasks/manage-kubernetes-objects/imperative-command/)
- [Gerenciamento imperativo de objetos do Kubernetes usando arquivos de configuração](/docs/tasks/manage-kubernetes-objects/imperative-config/)
- [Gerenciamento declarativo de objetos do Kubernetes usando arquivos de configuração](/docs/tasks/manage-kubernetes-objects/declarative-config/)
- [Gerenciamento declarativo de objetos do Kubernetes usando Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/)
- [Referência de comandos do Kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
- [Kubectl Book](https://kubectl.docs.kubernetes.io)
- [Referência da API do Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
