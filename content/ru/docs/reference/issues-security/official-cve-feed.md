---
title: Официальный CVE-фид
linkTitle: CVE-фид
weight: 25
outputs:
  - json
  - html
  - rss 
layout: cve-feed
---

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

Поддерживаемый сообществом список официальных CVE, анонсированных
Комитетом по реагированию на проблемы безопасности Kubernetes. Подробности см. на странице
[Общие сведения о безопасности Kubernetes и раскрытии информации](/ru/docs/reference/issues-security/security/).

Проект Kubernetes публикует фиды с анонсами проблем в области безопасности в формате [JSON](/docs/reference/issues-security/official-cve-feed/index.json) и [RSS](/docs/reference/issues-security/official-cve-feed/feed.xml), доступные для автоматического считывания. Доступ к ним можно получить, выполнив следующие команды:

{{< tabs name="CVE-фиды" >}}
{{% tab name="JSON-фид" %}}
[Ссылка на JSON-формат](/docs/reference/issues-security/official-cve-feed/index.json)
```shell
curl -Lv https://k8s.io/docs/reference/issues-security/official-cve-feed/index.json
```
{{% /tab %}}
{{% tab name="RSS-фид" %}}
[Ссылка на RSS-формат](/docs/reference/issues-security/official-cve-feed/feed.xml)
```shell
curl -Lv https://k8s.io/docs/reference/issues-security/official-cve-feed/feed.xml
```
{{% /tab %}}
{{< /tabs >}}

{{< cve-feed >}}

<!-- | CVE ID      | Краткое описание проблемы | Ссылка на Issue на GitHub'е |
| ----------- | ----------- | --------- |
| [CVE-2021-25741](https://www.cve.org/CVERecord?id=CVE-2021-25741)      | Symlink Exchange Can Allow Host Filesystem Access | [#104980](https://github.com/kubernetes/kubernetes/issues/104980) |
| [CVE-2020-8565](https://www.cve.org/CVERecord?id=CVE-2020-8565)      | Incomplete fix for CVE-2019-11250 allows for token leak in logs when logLevel >= 9 | [#95623](https://github.com/kubernetes/kubernetes/issues/95623) | -->

Список автоматически обновляется с заметной, но небольшой задержкой (от нескольких минут до нескольких часов)
с момента анонса CVE до момента его появления в этом фиде.

В качестве источника используется набор GitHub Issues, отфильтрованный по контролируемому и
ограниченному лейблу `official-cve-feed`. Исходные данные хранятся в бакете Google Cloud, 
право на запись в который есть только у небольшого числа доверенных представителей сообщества.
