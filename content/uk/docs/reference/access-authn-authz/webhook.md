---
title: Режим Webhook
content_type: concept
weight: 36
---

<!-- overview -->

Webhook — це зворотний виклик HTTP: HTTP POST, який відбувається, коли щось стається; просте сповіщення про подію через HTTP POST. Вебзастосунок, що реалізує Webhook, буде надсилати POST повідомлення на URL, коли відбуваються певні події.

<!-- body -->

Коли вказано режим `Webhook`, Kubernetes звертається до зовнішнього REST сервісу для визначення привілеїв користувача.

## Формат файлу конфігурації {#configuration-file-format}

Режим `Webhook` потребує файл для HTTP конфігурації, що вказується за допомогою прапорця `--authorization-webhook-config-file=SOME_FILENAME`.

Файл конфігурації використовує формат файлу [kubeconfig](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/). У файлі "users" стосується конфігурації webhook API сервера, а "clusters" — до віддаленого сервісу.

Приклад конфігурації, що використовує клієнтську автентифікацію HTTPS:

```yaml
# Версія Kubernetes API
apiVersion: v1
# тип API обʼєкта
kind: Config
# кластери відносяться до віддаленого сервісу
clusters:
  - name: name-of-remote-authz-service
    cluster:
      # CA для перевірки віддаленого сервісу
      certificate-authority: /path/to/ca.pem
      # URL віддаленого сервісу для запитів. Має використовувати 'https'. Не може включати параметри.
      server: https://authz.example.com/authorize

# користувачі відносяться до конфігурації webhook API сервера
users:
  - name: name-of-api-server
    user:
      client-certificate: /path/to/cert.pem # сертифікат для використання webhook втулком
      client-key: /path/to/key.pem          # ключ, що відповідає сертифікату

# файли kubeconfig вимагають контекст. Вкажіть один для API сервера.
current-context: webhook
contexts:
- context:
    cluster: name-of-remote-authz-service
    user: name-of-api-server
  name: webhook
```

## Запити корисного навантаження {#request-payloads}

При ухваленні рішення про авторизацію, API сервер надсилає JSON- серіалізований обʼєкт `authorization.k8s.io/v1beta1` `SubjectAccessReview`, що описує дію. Цей обʼєкт містить поля, що описують користувача, який намагається зробити запит, та деталі про ресурс, до якого здійснюється доступ, або атрибути запиту.

Зверніть увагу, що обʼєкти API webhook підлягають тим самим [правилам сумісності версій](/docs/concepts/overview/kubernetes-api/), що й інші обʼєкти API Kubernetes. Імплементатори повинні бути обізнані з менш суворими обіцянками сумісності для бета-обʼєктів і перевіряти поле "apiVersion" запиту для забезпечення правильної десеріалізації. Додатково, API сервер повинен увімкнути групу розширень API `authorization.k8s.io/v1beta1` (`--runtime-config=authorization.k8s.io/v1beta1=true`).

Приклад тіла запиту:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "namespace": "kittensandponies",
      "verb": "get",
      "group": "unicorn.example.org",
      "resource": "pods"
    },
    "user": "jane",
    "group": [
      "group1",
      "group2"
    ]
  }
}
```

Віддалений сервіс має заповнити поле `status` запиту і відповісти, дозволяючи або забороняючи доступ. Поле `spec` у відповіді ігнорується і може бути пропущене. Дозвільна відповідь виглядатиме так:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": true
  }
}
```

Для заборони доступу є два методи.

Перший метод є кращим у більшості випадків і вказує, що webhook авторизації не дозволяє або не має "думки" ("no opinion") щодо запиту, але якщо інші авторизатори налаштовані, вони отримують шанс дозволити запит. Якщо немає інших авторизаторів або жоден з них не дозволяє запит, запит забороняється. Webhook поверне:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": false,
    "reason": "user does not have read access to the namespace"
  }
}
```

Другий метод негайно відмовляє, перериваючи оцінку іншими налаштованими авторизаторами. Це слід використовувати лише вебхуками, які мають детальні знання про повну конфігурацію авторизатора кластера. Webhook поверне:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "status": {
    "allowed": false,
    "denied": true,
    "reason": "user does not have read access to the namespace"
  }
}
```

Доступ до нересурсних шляхів здійснюється як:

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "nonResourceAttributes": {
      "path": "/debug",
      "verb": "get"
    },
    "user": "jane",
    "group": [
      "group1",
      "group2"
    ]
  }
}
```

{{< feature-state feature_gate_name="AuthorizeWithSelectors" >}}

При виклику вебхука авторизації Kubernetes передає селектори міток і полів у запиті до вебхука авторизації. Вебхук авторизації може приймати рішення про авторизацію на основі селекторів полів і міток, якщо це необхідно.

[Документація API SubjectAccessReview](/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/) надає вказівки щодо того, як ці поля мають інтерпретуватися і оброблятися вебхуками авторизації, зокрема використанням розібраних вимог замість сирих рядків селекторів та як безпечно обробляти невідомі оператори.

```json
{
  "apiVersion": "authorization.k8s.io/v1beta1",
  "kind": "SubjectAccessReview",
  "spec": {
    "resourceAttributes": {
      "verb": "list",
      "group": "",
      "resource": "pods",
      "fieldSelector": {
        "requirements": [
          {"key":"spec.nodeName", "operator":"In", "values":["mynode"]}
        ]
      },
      "labelSelector": {
        "requirements": [
          {"key":"example.com/mykey", "operator":"In", "values":["myvalue"]}
        ]
      }
    },
    "user": "jane",
    "group": [
      "group1",
      "group2"
    ]
  }
}
```

Нересурсні шляхи включають: `/api`, `/apis`, `/metrics`, `/logs`, `/debug`, `/healthz`, `/livez`, `/openapi/v2`, `/readyz` та `/version.` Клієнти потребують доступу до `/api`, `/api/*`, `/apis`, `/apis/*`, та `/version` для визначення, які ресурси та версії присутні на сервері. Доступ до інших нересурсних шляхів може бути заборонений без обмеження доступу до REST API.

За подальшою інформацією звертайтеся до [документації SubjectAccessReview API](/docs/reference/kubernetes-api/authorization-resources/subject-access-review-v1/) та [імплементації webhook.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/apiserver/plugin/pkg/authorizer/webhook/webhook.go).
