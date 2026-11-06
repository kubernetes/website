---
title: Посібник з вмісту документації
linktitle: Посібник з вмісту
content_type: concept
weight: 10
---

<!-- overview -->

Ця сторінка містить настанови щодо документації Kubernetes.

Якщо у вас є запитання щодо того, що дозволено, приєднайтеся до каналу #sig-docs у [Kubernetes Slack](https://slack.k8s.io/) і запитайте!

Ви можете зареєструватися на Kubernetes Slack за адресою https://slack.k8s.io/.

Інформацію про створення нового вмісту для документації Kubernetes див. у [посібнику зі стилю](/docs/contribute/style/style-guide).

<!-- body -->

## Огляд {#overview}

Вихідний код вебсайту Kubernetes, зокрема документації, розміщено в репозиторії [kubernetes/website](https://github.com/kubernetes/website).

Більшість документації Kubernetes розташована в теці `kubernetes/website/content/<language_code>/docs` і стосується саме [проєкту Kubernetes](https://github.com/kubernetes/kubernetes).

## Що дозволено {#what-s-allowed}

Документація Kubernetes допускає вміст для сторонніх проєктів лише тоді, коли:

- Вміст документує програмне забезпечення в проєкті Kubernetes
- Вміст документує програмне забезпечення поза проєктом, яке потрібне для роботи Kubernetes
- Вміст є канонічним на kubernetes.io або посилається на канонічний вміст в іншому місці

### Сторонній вміст {#third-party-content}

Документація Kubernetes містить прикладні приклади проєктів, що входять до проєкту Kubernetes, — проєктів, розміщених в організаціях GitHub [kubernetes](https://github.com/kubernetes) і [kubernetes-sigs](https://github.com/kubernetes-sigs).

Посилання на активний вміст у проєкті Kubernetes завжди дозволені.

Для роботи Kubernetes потрібен деякий сторонній вміст. Приклади — середовища виконання контейнерів (containerd, CRI-O, Docker), [мережеві політики](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) (втулки CNI), [контролери Ingress](/docs/concepts/services-networking/ingress-controllers/) і [логування](/docs/concepts/cluster-administration/logging/).

Документація може посилатися на стороннє програмне забезпечення з відкритим кодом (OSS) поза проєктом Kubernetes лише тоді, коли воно потрібне для роботи Kubernetes.

### Вміст із подвійним джерелом {#dual-sourced-content}

Коли це можливо, документація Kubernetes посилається на канонічні джерела замість розміщення вмісту з подвійним джерелом.

Вміст із подвійним джерелом потребує вдвічі більше зусиль (або й більше!) на підтримку і швидше застаріває.

{{< note >}}
Якщо ви супровідник проєкту Kubernetes і вам потрібна допомога з розміщенням власної документації, попросіть допомоги в [#sig-docs у Kubernetes Slack](https://kubernetes.slack.com/messages/C1J0BPD2M/).
{{< /note >}}

### Додаткова інформація {#more-information}

Якщо у вас є запитання щодо дозволеного вмісту, приєднайтеся до каналу #sig-docs у [Kubernetes Slack](https://slack.k8s.io/) і запитайте!

## {{% heading "whatsnext" %}} {#what-s-next}

- Ознайомтеся з [посібником зі стилю](/docs/contribute/style/style-guide).
