---
title: Labels Recomendadas
content_type: concept
weight: 100
---

<!-- overview -->
Você pode visualizar e gerenciar objetos do Kubernetes com mais ferramentas além do kubectl e
do dashboard. Um conjunto comum de labels permite que as ferramentas funcionem de maneira interoperável, descrevendo
objetos de forma comum que todas as ferramentas possam entender.

Além de oferecer suporte às ferramentas, as labels recomendadas descrevem aplicações
de uma forma que pode ser consultada.


<!-- body -->
Os metadados são organizados em torno do conceito de uma _aplicação_. O Kubernetes não é
uma plataforma como serviço (PaaS) e não tem, nem impõe, uma noção formal de aplicação.
Em vez disso, as aplicações são informais e descritas com metadados. A definição de
o que uma aplicação contém é flexível.

{{< note >}}
Estas são labels recomendadas. Elas facilitam o gerenciamento de aplicações,
mas não são obrigatórias para nenhuma ferramenta principal.
{{< /note >}}

As labels e anotações compartilhadas usam um prefixo comum: `app.kubernetes.io`. Labels
sem um prefixo são privadas dos usuários. O prefixo compartilhado garante que as labels
compartilhadas não interfiram com as labels personalizadas do usuário.

## Labels

Para aproveitar ao máximo essas labels, elas devem ser aplicadas
em cada objeto de recurso.

| Chave                               | Descrição             | Exemplo  | Tipo |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | O nome da aplicação | `mysql` | string |
| `app.kubernetes.io/instance`        | Um nome exclusivo que identifica a instância de uma aplicação | `mysql-abcxyz` | string |
| `app.kubernetes.io/version`         | A versão atual da aplicação (por exemplo, [SemVer 1.0](https://semver.org/spec/v1.0.0.html), hash de revisão, etc.) | `5.7.21` | string |
| `app.kubernetes.io/component`       | O componente dentro da arquitetura | `database` | string |
| `app.kubernetes.io/part-of`         | O nome de uma aplicação de nível superior da qual esta faz parte | `wordpress` | string |
| `app.kubernetes.io/managed-by`      | A ferramenta usada para gerenciar a operação de uma aplicação | `Helm` | string |

Para ilustrar essas labels em ação, considere o seguinte objeto do tipo {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}:

```yaml
# Este é um trecho
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxyz
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/managed-by: Helm
```

## Aplicações e instâncias de aplicações

Uma aplicação pode ser instalada uma ou mais vezes em um cluster Kubernetes e,
em alguns casos, no mesmo namespace. Por exemplo, o WordPress pode ser instalado mais
de uma vez, onde sites diferentes são instalações diferentes do WordPress.

O nome de uma aplicação e o nome da instância são registrados separadamente. Por
exemplo, o WordPress tem um `app.kubernetes.io/name` de `wordpress`, enquanto tem
um nome de instância, representado como `app.kubernetes.io/instance` com um valor de
`wordpress-abcxyz`. Isso permite que a aplicação e a instância da aplicação
sejam identificáveis. Cada instância de uma aplicação deve ter um nome exclusivo.

## Exemplos

Para ilustrar diferentes formas de usar essas labels, os exemplos a seguir têm complexidades variadas.

### Um serviço sem estado simples

Considere o caso de um serviço sem estado (stateless) simples implantado usando objetos `Deployment` e `Service`. Os dois trechos a seguir representam como as labels poderiam ser usadas em sua forma mais simples.

O `Deployment` é usado para supervisionar os pods que executam a própria aplicação.
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxyz
...
```

O `Service` é usado para expor a aplicação.
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxyz
...
```

### Aplicação web com um banco de dados

Considere uma aplicação um pouco mais complicada: uma aplicação web (WordPress)
usando um banco de dados (MySQL), instalada usando o Helm. Os trechos a seguir ilustram
o início dos objetos usados para implantar essa aplicação.

O início do `Deployment` a seguir é usado para o WordPress:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxyz
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

O `Service` é usado para expor o WordPress:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxyz
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

O MySQL é exposto como um `StatefulSet` com metadados tanto para ele quanto para a aplicação maior à qual pertence:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxyz
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
...
```

O `Service` é usado para expor o MySQL como parte do WordPress:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxyz
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
...
```

Com o `StatefulSet` e o `Service` do MySQL, você notará que informações sobre o MySQL e o WordPress, a aplicação mais ampla, estão incluídas.
