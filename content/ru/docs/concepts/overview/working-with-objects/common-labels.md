---
title: Рекомендуемые метки
content_type: concept
---

<!-- overview -->

Вы можете визуализировать и управлять объектами Kubernetes не только с помощью kubectl и панели управления. С помощью единого набора меток можно единообразно описывать объекты, что позволяет инструментам согласованно работать между собой.

В дополнение к существующим инструментам, рекомендуемый набор меток описывают приложения в том виде, в котором они могут быть получены.



<!-- body -->


Метаданные сосредоточены на понятии _приложение_. Kubernetes — это не платформа как услуга (PaaS), поэтому не закрепляет формальное понятие приложения.
Вместо этого приложения являются неформальными и описываются через метаданные. Определение приложения довольно расплывчатое.

{{< note >}}

Это рекомендуемые для использования метки. Они облегчают процесс управления приложениями, но при этом не являются обязательными для основных инструментов.

{{< /note >}}

Общие метки и аннотации используют один и тот же префикс: `app.kubernetes.io`. Метки без префикса являются приватными для пользователей. Совместно используемый префикс гарантирует, что общие метки не будут влиять на пользовательские метки.

## Метки

Чтобы извлечь максимум пользы от использования таких меток, они должны добавляться к каждому ресурсному объекту.

| Ключ                                 | Описание           | Пример  | Тип |
| ----------------------------------- | --------------------- | -------- | ---- |
| `app.kubernetes.io/name`            | Имя приложения | `mysql` | string |
| `app.kubernetes.io/instance`        | Уникальное имя экземпляра приложения | `wordpress-abcxzy` | string |
| `app.kubernetes.io/version`         | Текущая версия приложения (например, семантическая версия, хеш коммита и т.д.) | `5.7.21` | string |
| `app.kubernetes.io/component`       | Имя компонента в архитектуре | `database` | string |
| `app.kubernetes.io/part-of`         | Имя основного приложения, частью которого является текущий объект | `wordpress` | string |
| `app.kubernetes.io/managed-by`  | Инструмент управления приложением | `helm` | string |

Для демонстрации этих меток, рассмотрим следующий объект `StatefulSet`:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  labels:
    app.kubernetes.io/name: mysql
    app.kubernetes.io/instance: wordpress-abcxzy
    app.kubernetes.io/version: "5.7.21"
    app.kubernetes.io/component: database
    app.kubernetes.io/part-of: wordpress
    app.kubernetes.io/managed-by: helm
```

## Приложения и экземпляры приложений

Одно и то же приложение может быть установлено несколько раз в кластер Kubernetes, в ряде случаев — в одинаковое пространство имен. Например, WordPress может быть установлен более одного раза, тогда каждый из сайтов будет иметь собственный установленный экземпляр WordPress.

Имя приложения и имя экземпляра хранятся по отдельности. Например, WordPress имеет ключ `app.kubernetes.io/name` со значением `wordpress`, при этом у него есть имя экземпляра, представленное ключом `app.kubernetes.io/instance` со значением `wordpress-abcxzy`. Такой механизм позволяет идентифицировать как приложение, так и экземпляры приложения. У каждого экземпляра приложения должно быть уникальное имя.

## Примеры

Следующие примеры показывают разные способы использования общих меток, поэтому они различаются по степени сложности.

### Простой сервис без состояния

Допустим, у нас есть простой сервис без состояния, развернутый с помощью объектов `Deployment` и `Service`. Следующие два фрагмента конфигурации показывают, как можно использовать метки в самом простом варианте.

Объект `Deployment` используется для наблюдения за подами, на которых запущено приложение.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

Объект `Service` используется для открытия доступа к приложению.

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: myservice
    app.kubernetes.io/instance: myservice-abcxzy
...
```

### Веб-приложение с базой данных

Рассмотрим случай немного посложнее: веб-приложение (WordPress), которое использует базу данных (MySQL), установленное с помощью Helm. В следующих фрагментов конфигурации объектов отображена отправная точка развертывания такого приложения.

Следующий объект `Deployment` используется для WordPress:

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

Объект `Service` используется для открытия доступа к WordPress:


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

MySQL открывается в виде `StatefulSet` с метаданными как для самого приложения, так и основного (родительского) приложения, к которому принадлежит СУБД:

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

Объект `Service` предоставляет MySQL в составе WordPress:

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

Вы заметите, что `StatefulSet` и `Service` MySQL содержат больше информации о MySQL и WordPress.


