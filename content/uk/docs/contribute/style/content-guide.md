---
title: Посібник з вмісту документації
linktitle: Посібник з вмісту
content_type: concept
weight: 10
---

<!-- overview -->

Ця сторінка містить вказівки щодо документації Kubernetes.

Якщо у вас є запитання про те, що дозволено, приєднуйтесь до каналу #sig-docs у [Kubernetes Slack](https://slack.k8s.io/) і запитуйте!

Ви можете зареєструватися на Kubernetes Slack за адресою https://slack.k8s.io/.

Для отримання інформації про створення нового вмісту для документації Kubernetes, дотримуйтесь [посібника зі стилю](/docs/contribute/style/style-guide).

<!-- body -->

## Огляд {#overview}

Сирці вебсайту Kubernetes, включаючи документацію, знаходиться в репозиторії [kubernetes/website](https://github.com/kubernetes/website).

Більшість документації Kubernetes знаходиться в теці `kubernetes/website/content/<language_code>/docs` і специфічна для [проєкту Kubernetes](https://github.com/kubernetes/kubernetes).

## Що дозволено {#what-is-allowed}

Документація Kubernetes дозволяє вміст зі сторонніх проєктів тільки тоді, коли:

- Вміст документує програмне забезпечення в проєкті Kubernetes
- Вміст документує програмне забезпечення, яке знаходиться поза проєктом, але необхідне для функціонування Kubernetes
- Вміст є канонічним на kubernetes.io або посилається на канонічний вміст в іншому місці

### Сторонній вміст {#third-party-content}

Документація Kubernetes включає приклади застосування проєктів у проєкті Kubernetes — проєктів, що знаходяться в організаціях GitHub [kubernetes](https://github.com/kubernetes) та [kubernetes-sigs](https://github.com/kubernetes-sigs).

Посилання на активний вміст у проєкті Kubernetes завжди дозволені.

Для функціонування Kubernetes необхідний деякий сторонній вміст. Прикладами є контейнерні середовища (containerd, CRI-O, Docker), [мережева політика](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) (втулки CNI), [контролери Ingress](/docs/concepts/services-networking/ingress-controllers/), та [логування](/docs/concepts/cluster-administration/logging/).

Документація може посилатися на стороннє програмне забезпечення з відкритим вихідним кодом (OSS) поза проєктом Kubernetes тільки якщо воно необхідне для функціонування Kubernetes.

### Контент з подвійним джерелом {#dual-sourced-content}

Коли це можливо, документація Kubernetes посилається на канонічні джерела замість розміщення дублікату вмісту.

Контент з подвійним джерелом вимагає вдвічі більше зусиль (або більше!) для підтримки та швидше стає застарілим.

{{< note >}}
Якщо ви є супроводжувачем проєкту Kubernetes і вам потрібна допомога з розміщенням власної документації, попросіть допомоги в [#sig-docs у Kubernetes Slack](https://kubernetes.slack.com/messages/C1J0BPD2M/).
{{< /note >}}

### Додаткова інформація {#additional-information}

Якщо у вас є запитання про дозволений вміст, приєднуйтесь до каналу #sig-docs у [Kubernetes Slack](https://slack.k8s.io/) і запитуйте!

## {{% heading "whatsnext" %}}

- Ознайомтесь з [посібником зі стилю](/docs/contribute/style/style-guide).
