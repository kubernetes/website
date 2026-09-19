---
title: Генерування довідкової документації для Configuration API
content_type: task
weight: 60
---

<!-- overview -->

На цій сторінці показано, як можна створити оновлену довідкову документацію для Configuration API Kubernetes. Вона призначена для людей, які роблять внесок у Kubernetes.

Довідка з Configuration API документує формати конфігурації для інструментів та компонентів Kubernetes — наприклад, формати `kubelet`, `kube-apiserver`, `kube-scheduler`, `kubeconfig` та `kubeadm`. Опублікована довідка знаходиться за адресою [/docs/reference/config-api/](/docs/reference/config-api/).

`genref` у [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs) є генератором, який будує цю довідку. Він читає типи конфігурації Go кожного компонента та рендерить їх у вигляді Markdown.

Якщо ви знайшли помилки в згенерованому вмісті, швидше за все, вам потрібно [виправити їх у висхідному репозиторії](/docs/contribute/generate-ref-docs/contribute-upstream/).

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## Налаштування локальних репозиторіїв {#set-up-the-local-repositories}

Вам знадобляться локальні клони `kubernetes/website` та `kubernetes-sigs/reference-docs`.

Якщо ви ще не зробили форк та клон `kubernetes/website`, перегляньте розділ [Робота з локальним клоном](/docs/contribute/new-content/open-a-pr/#fork-the-repo). Клонуйте `reference-docs`:

```shell
git clone https://github.com/kubernetes-sigs/reference-docs
```

Наступні кроки посилаються на ваш клон `kubernetes/website` як `<web-base>`, а ваш клон `reference-docs` як `<rdocs-base>`.

## Встановлення змінних збирання {#set-build-variables}

Встановіть це у вашій оболонці. Це застосовується до кожної команди `make` у кроках, що йдуть далі, незалежно від того, з якої теки ви її запускаєте.

```shell
export K8S_WEBROOT=/шлях/до/вашого/website   # ваш клон website (<web-base>)
```

## Збирання та публікація довідки Configuration API {#build-and-publish-the-configuration-api-reference}

З `<rdocs-base>`:

```shell
cd <rdocs-base>
make copyconfigapi
```

Ця команда виконується у два етапи:

1. **`configapi`** — будує та запускає `genref`, який генерує Markdown у `genref/output/md`
2. **`copyconfigapi`** — копіює згенеровані файли у ваш клон website за адресою `<web-base>/content/en/docs/reference/config-api/`.

Перший запуск завантажує залежності модулів Go і може тривати кілька хвилин.

Перевірте, що змінилося у вашому клоні website:

```shell
cd <web-base>
git status
```

Шукайте оновлення, зроблені в `content/en/docs/reference/config-api` — наприклад:

```text
content/en/docs/reference/config-api/kubelet-config.v1beta1.md
content/en/docs/reference/config-api/kubeadm-config.v1beta4.md
content/en/docs/reference/config-api/apiserver-config.v1.md
content/en/docs/reference/config-api/client-authentication.v1.md
```

## Попередній перегляд website та локальне тестування {#preview-website-and-test-locally}

Перегляньте ваші оновлення:

```shell
cd <web-base>
git submodule update --init --recursive --depth 1   # якщо ще не зроблено
make container-serve
```

Потім відкрийте локальний попередній перегляд у вашому вебоглядачі та підтвердьте, що сторінки, які ви оновили, завантажуються належним чином. Hugo показує цей локальний попередній перегляд за адресою <http://localhost:1313/> Тож сторінка для перевірки — <http://localhost:1313/docs/reference/config-api/>

## Збереження змін у коміті {#commit-the-changes}

Якщо ви повторно згенерували довідку з Configuration API для оновлення релізу, закомітьте змінені файли в `content/en/docs/reference/config-api/` у `<web-base>`, потім відкрийте [pull request](/docs/contribute/new-content/open-a-pr/) у [kubernetes/website](https://github.com/kubernetes/website).

## {{% heading "whatsnext" %}}

* [Генерування довідкової документації для Kubernetes API](/docs/contribute/generate-ref-docs/kubernetes-api/)
* [Швидкий старт генерування довідкової документації](/docs/contribute/generate-ref-docs/quickstart/)
* [Внесок до довідкової висхідної документації](/docs/contribute/generate-ref-docs/contribute-upstream/)
