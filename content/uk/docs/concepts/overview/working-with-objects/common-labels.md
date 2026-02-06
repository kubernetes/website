---
title: Рекомендовані Мітки
content_type: concept
weight: 100
---

<!-- overview -->
Ви можете візуалізувати та керувати обʼєктами Kubernetes за допомогою інших інструментів, ніж kubectl та панель інструментів (dashboard). Загальний набір міток дозволяє інструментам працювати між собою, описуючи обʼєкти спільним чином, який можуть розуміти всі інструменти.

Крім підтримки інструментів, рекомендовані мітки описують застосунки так, що до них можна звертатись.

<!-- body -->
Метадані організовані навколо концепції _застосунку_. Kubernetes не є платформою як сервіс (PaaS) і не має формального поняття застосунку або його виконання. Замість цього застосунки є неформальними та описуються метаданими. Визначення того, що включає застосунок, є гнучким.

{{< note >}}
Це рекомендовані мітки. Вони полегшують управління застосунками, але не обовʼязкові для будь-яких основних інструментів.
{{< /note >}}

Спільні мітки та анотації мають спільний префікс: `app.kubernetes.io`. Мітки без префіксу є приватними для користувачів. Спільний префікс забезпечує, що спільні мітки не втручаються у власні мітки користувача.

## Мітки {#labels}

Щоб повною мірою скористатися цими мітками, їх слід застосовувати до кожного обʼєкта ресурсу.

| Ключ                               | Опис                  | Приклад  | Тип |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | Назва застосунку         | `mysql` | рядок |
| `app.kubernetes.io/instance`        | Унікальна назва, що ідентифікує екземпляр застосунку | `mysql-abcxyz` | рядок |
| `app.kubernetes.io/version`         | Поточна версія застосунку (наприклад, [SemVer 1.0](https://semver.org/spec/v1.0.0.html), хеш ревізії і т.д.) | `5.7.21` | рядок |
| `app.kubernetes.io/component`       | Компонент всередині архітектури | `database` | рядок |
| `app.kubernetes.io/part-of`         | Назва вищого рівня застосунку, частину якого складає цей | `wordpress` | рядок |
| `app.kubernetes.io/managed-by`      | Інструмент, який використовується для управління операцією застосунку | `Helm` | рядок |

Щоб проілюструвати ці мітки в дії, розгляньте наступний обʼєкт {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}:

```yaml
# Це уривок
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

## Застосунки та екземпляри застосунків {#applications-and-application-instances}

Застосунок можна встановити один або декілька разів в кластер Kubernetes і, у деяких випадках, в тому ж просторі імен. Наприклад, WordPress можна встановити більше одного разу, де різні вебсайти є різними екземплярами WordPress.

Назва застосунку та назва екземпляра записуються окремо. Наприклад, у WordPress є `app.kubernetes.io/name` — `wordpress`, тоді як назва екземпляра представлена як `app.kubernetes.io/instance` зі значенням `wordpress-abcxyz`. Це дозволяє ідентифікувати застосунок та його екземпляр. Кожен екземпляр застосунку повинен мати унікальну назву.

## Приклади {#examples}

Щоб проілюструвати різні способи використання цих міток, наведено різні приклади складності.

### Простий Stateless Service {#a-simple-stateless-service}

Розгляньте випадок простого Stateless Serviceʼу, розгорнутого за допомогою обʼєктів `Deployment` та `Service`. Наведені нижче два уривки представляють, як можуть бути використані мітки у їх найпростішій формі.

`Deployment` використовується для нагляду за Podʼами, які виконують сам застосунок.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxyz
...
```

`Service` використовується для відкриття доступу до застосунку.

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxyz
...
```

### Вебзастосунок із базою даних {#web-application-with-a-database}

Розгляньмо трохи складніший застосунок: вебзастосунок (WordPress) із базою даних (MySQL), встановлений за допомогою Helm. Наведені нижче уривки ілюструють початок обʼєктів, які використовуються для розгортання цього застосунку.

Початок цього `Deployment` використовується для WordPress:

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

`Service` використовується для відкриття доступу до WordPress:

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

MySQL представлено як `StatefulSet` з метаданими як для нього, так і для застосунку, до якого він належить:

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

`Service` використовується для відкриття доступу до MySQL як частини WordPress:

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

З MySQL `StatefulSet` та `Service` ви побачите, що включена інформація як про MySQL, так і про WordPress.
