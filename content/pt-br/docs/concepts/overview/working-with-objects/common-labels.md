---
title: Labels Recomendadas
content_type: concept
---

<!-- overview -->
Você pode visualizar e gerenciar objetos Kubernetes com mais ferramentas do que kubectl e um *dashboard*. Um conjunto comum de *labels* permite que as ferramentas funcionem de forma interoperável, descrevendo os objetos de uma maneira em comum, permitindo que todas ferramentas entendam.

Além de ferramentas de suporte, as *labels* recomendadas descrevem aplicativos de uma forma que permitem a consulta.


<!-- body -->
Os metadados são organizados em torno do conceito de _aplicação_. O Kubernetes não é
uma plataforma como serviço (PaaS) e não tem ou impõe uma noção formal de um aplicativo.
Em vez disso, os aplicativos são informais e descritos com metadados. A definição do que um aplicativo contém é livre.

{{< note >}}
Essas são as *labels* recomendadas. Elas facilitam o gerenciamento de aplicativos
mas não são necessárias para nenhuma ferramenta principal.
{{< /note >}}

As anotações e as *labels* compartilhadas possuem um prefixo em comum:`app.kubernetes.io`. *Labels* sem prefixo são privativas do usuário. O prefixo compartilhado garante que as *labels* compartilhadas não interfiram com as *labels* personalizadas do usuário.

## Labels

Para tirar o máximo proveito do uso das *labels*, elas devem ser aplicadas em todos *resource object*.

| Key                                 | Descrição           | Exemplo  | Tipo |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | Nome da aplicação | `mysql` | string |
| `app.kubernetes.io/instance`        | Atributo único indicando a instância da aplicação | `mysql-abcxzy` | string |
| `app.kubernetes.io/version`         | A versão atual da aplicação (e.g., um versionamento semântico, um *hash* de revisão, etc.) | `5.7.21` | string |
| `app.kubernetes.io/component`       | O componente com a arquitetura | `database` | string |
| `app.kubernetes.io/part-of`         | O nome da aplicação de alto nível que esta faz parte | `wordpress` | string |
| `app.kubernetes.io/managed-by`      | A ferramenta usada para gerenciar a operação de uma aplicação | `helm` | string |
| `app.kubernetes.io/created-by`      | A controller/user criadora desse recurso | `controller-manager` | string |

Para demonstrar essas *labels* na prática, considerando o seguinte {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}} objeto:

```yaml
# This is an excerpt
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/created-by: controller-manager
```

## Aplicações e Instâncias de Aplicações

Um aplicativo pode ser instalado uma ou mais vezes em um cluster Kubernetes e,em alguns casos, com o mesmo *namespace*. Por exemplo, WordPress pode ser instalado mais de uma vez, sendo que diferentes sites são diferentes instalaçãoes do Wordpress.

O nome da aplicação e o nome da instância são gravadas separadamente, Por exemplo, o Wordpress tem a`app.kubernetes.io/name` do `wordpress` enquanto tem o nome da instância representada por `app.kubernetes.io/instance` com o valor de `wordpress-abcxzy`. Isso permite que a aplicação e a instância da aplicação possa ser identificada. Toda instância de aplicação deve ter um nome único.

## Exemplos

Para ilustrar as diferentes maneiras de utilizar as *labels*, os exemplos abaixo apresentção uma complexidade variada. 

### Um simples *Stateless Service*

Considerando o case de um simples *stateless service* implantado utilizando os objetos `Deployment` e `Service`, os 2 trechos abaixo representam como as *labels* podem ser utilizadas da maneira mais simples possível.

O `Deployment` é usado para supervisionar os *pods* que autoexecutam a aplicação.
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

O `Service` usado para exibir a aplicação.
```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

### Aplicação Web com Banco de Dados

Considerando uma aplicação razoavelmente complicada: uma aplicação web (WordPress) utilizando um banco de dados (MySQL), instalada com Helm. Os trechos a seguir mostra como iniciar os objetos usados para implantar a aplicação.

Para iniciar exibindo como o `Deployment` é usado para o WordPress:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

O `Service` usado para exibir o WordPress:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: wordpress
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "4.9.4"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: server
    app.kubernetes.io/part-of: wordpress
...
```

O MySQL é exposto como um StatefulSet com metadados para ele e para o aplicativo maior ao qual ele pertence: 

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
...
```

O `Service` usado para exibir o MySQL como parte do WordPress:

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: mysql-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/managed-by: helm
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
...
```

Utilizando os comandos MySQL, `StatefulSet` e `Service`, você receberá notificação sobre ambos, MySQL e WordPress, o aplicativo maior está incluso.

