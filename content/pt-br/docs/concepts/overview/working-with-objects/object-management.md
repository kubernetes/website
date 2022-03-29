---
title: Gerenciamento de Objetos do Kubernetes
content_type: concept
weight: 15
---

<!-- overview -->
A ferramenta de linha de comando `kubectl` suporta várias maneiras diferentes de criar e 
gerenciar objetos do Kubernetes. Este documento fornece uma visão geral das diferntes
abordagens. Leia o [livro do Kubectl](https://kubectl.docs.kubernetes.io) para detalhes
do gerenciamento de objetos pelo *Kubectl*.

<!-- body -->

## Técnicas de Gerenciamento

{{< warning >}}
Um objeto Kubernetes deve ser gerenciado utilizando uma única técnica. Mistura e 
combinação de técnicas para um mesmo objeto resulta em um comportamento indefinido.
{{< /warning >}}

| Técnica de gerenciamento             | Opera em         | Ambiente recomendado | Número de agentes de escrita suportados  | Curva de aprendizado |
|----------------------------------|----------------------|------------------------|--------------------|----------------|
| Comandos imperativos              | Objetos ativos       | Projetos em desenvolvimento | 1+                 | Baixo         |
| Configuração do objeto imperativo  | Arquivos individuais     | Projetos em produção    | 1                  | Moderado       |
| Configuração da declaração do objeto | Diretórios de arquivos | Projetos em produção    | 1+                 | Alto           |

## Comandos imperativos

Ao usar comandos imperativos, um usuário opera diretamente em 
objetos ativos em um *cluster*. O usuário fornece operações para
o comando `kubectl`  como argumentos ou *flags*.

Isso é a maneira recomendada para iniciar ou executar uma única tarefa
em um *cluster*. Pois esta técnica opera diretamente em objetos ativos,
não fornecendo uma histórico de configurações anteriores.

### Exemplos

Execute uma instância do *nginx container* criando um objeto de *deploy*:

```sh
kubectl create deployment nginx --image nginx
```

### Comparações

Vantagens comparadas às configurações de objetos:

- Os comandos são expressos como uma única palavra de ação .
- Os comandos exigem um único passo para realizar mudanças no *cluster*.

Desvantagens comparadas às configurações de objetos:

- Os comandos não integram com o processo de revisão de mudanças. 
- Os comandos não fornecem uma trilha de auditoria associada a mudanças.
- Os comandos não fornecem uma fonte de registros, exceto o que está ativo.
- Os comandos não fornecem um *template* para a criação de novos objetos.

## Configuração do objeto imperativo

Na configuração do objeto imperativo o comando kubectl especifica a operação
(criar, substituir, etc.), *flags* opcionais e pelo menos uma arquivo de nomes. 
O arquivo especificado deve conter uma definição completa do objeto em formato
YAML ou JSON. 

Veja a [referência da API ](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
para mais detalhes sobre as definições de objetos.

{{< warning >}}
O comando imperativo `replace` substitui a especificação exstente
coom uma nova, descartando todas as alterações do objeto ausente do
arquivo de configuração. Essa abordagem não deve ser utilizada com 
tipos de recursos cujas especificações são atualizadas independentemente 
do arquivo de configuração. Serviços do tipo `LoadBalancer`, por exemplo, 
possuem seu campo `externalIPs` atualizado independente da configuração 
do cluster.
{{< /warning >}}

### Exemplos

Crie os objetos definidos no arquivo de configuração: 

```sh
kubectl create -f nginx.yaml
```

Exclua os objetos definidos em dois arquivos de cofiguração:

```sh
kubectl delete -f nginx.yaml -f redis.yaml
```

Atualize os objetos definidos em um arquivo de configuração substituindo
a configuração ativa:

```sh
kubectl replace -f nginx.yaml
```

### Comparações 

Vantagens comparadas à comandos imperativos:

- A configuração do objeto pode ser salva em um sistema de controle de código, como o Git.
- A configuração do objeto pode integrar com processos como revisão de mudanças antes de *push* e trilhas de auditoria.
- A configuração do objeto fornece um *template* para criar novos objetos.

Desvantagens comparadas aos comandos imperativos:

- A configuração do objeto exige um entendimento básico ao esquema de objetos.
- A configuração do objeto exige um passo adicional para escrever o arquivo YAML.

Vantagens comparadas à configuração da declaração do objeto:

- O comportamento de configuração do objeto imperativo é simples e fácil de entender.
- A partir da versão 1.5 do Kubernetes a configuração do objeto imperativo é mais madura.

Desvantagens comparadas à configuração da declaração do objeto:

- A configuração do objeto imperativo funciona melhor em arquivos e não diretórios.
- Atualizações a objetos ativos devem ser mencionadas nos arquivos de configuração ou serão perdidas durante a próxima substituição.

## Configuração da declaração do objeto

Ao usar configuração da declaração de objeto, um usuário opera em arquivos 
de configuração de objetos armazenados localmente, entretanto o usuário não
define as operações a serem realizadas nos arquivos. Operações de criar, atualizar
e deletar são detectadas automaticamente por objeto pelo `kubectl`. Isso hablita
trabalhar em diretórios, onde operações diferentes podem ser necessárias para
diferentes objetos.

{{< note >}}
Configuração da declaração do objeto retém mudanças realizadas por outros
agentes de escrita, mesmo que as alterações não sejam mescladas de volta 
ao arquivo de configuração do objeto. Isso é possível usando a operação
da API `patch` para gravar apenas as diferenças observadas, em vez de usar
a operação da API `replace` para substituir toda a configuração do objeto. 
{{< /note >}}

### Exemplos

Processe todos os arquivos de configuração de objetos no diretório `configs` e
crie ou corrija os objetos ativos. É possível primeiro executar `diff` para ver
o que mudou e então aplicar:

```sh
kubectl diff -f configs/
kubectl apply -f configs/
```

Diretórios do processo recursivamente: 

```sh
kubectl diff -R -f configs/
kubectl apply -R -f configs/
```

### Comparações

Vantagens comparadas à configuração do objeto imperativo:

- As alterações feitas diretamente em objetos ativos são mantidas, mesmo que não sejam mescladas novamente nos arquivos de configuração. 
- A configuração declarativa dos objetos tem melhor suporte para operar em diretórios e detectar automaticamente tipos de operação (criar, corrigir, excluir) por objeto. 

Desvantagens comparadas à configuração do objeto imperativo:

- A configuração declarativa do objeto é mais difícil de depurar e entender os resultados quando eles são inesperados. 
- Atualizações parciais usando *diffs* criam operações complexas de mesclagem e correção. 

## {{% heading "whatsnext" %}}

- Leia sobre [Gerenciando Objetos do Kubernetes Usando Comandos Imperativos](/docs/tasks/manage-kubernetes-objects/imperative-command/)
- Leia sobre [Gerenciando Objetos do Kubernetes Usando Configuração do Objeto (Imperativo)](/docs/tasks/manage-kubernetes-objects/imperative-config/)
- Leia sobre [Gerenciando Objetos do Kubernetes Usando Configuração do Objeto (Declarativo)](/docs/tasks/manage-kubernetes-objects/declarative-config/)
- Leia sobre [Gerenciando Objetos do Kubernetes Usando Kustomize (Declarativo)](/docs/tasks/manage-kubernetes-objects/kustomization/)
- Leia sobre [Referências de comando do Kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
- Leia sobre [Livro do Kubectl](https://kubectl.docs.kubernetes.io)
- Leia sobre [Referencia da API do Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)

