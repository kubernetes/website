---
title: "Анотації аудиту"
weight: 10
---

<!-- overview -->

Ця сторінка служить довідником по анотаціях аудиту простору імен kubernetes.io. Ці анотації застосовуються до обʼєктів `Event` з API-групи `audit.k8s.io`.

{{< note >}}
Наступні анотації не використовуються в межах Kubernetes API. Коли ви [вмикаєте аудит](/docs/tasks/debug/debug-cluster/audit/) у своєму кластері, дані аудиту подій записуються за допомогою `Event` з API-групи `audit.k8s.io`. Ці анотації застосовуються до подій аудиту. Події аудиту відрізняються від обʼєктів у [API подій](/docs/reference/kubernetes-api/cluster-resources/event-v1/) (API-група `events.k8s.io`).
{{< /note >}}

<!-- body -->

## k8s.io/deprecated

Приклад: `k8s.io/deprecated: "true"`

Значення **повинно** бути "true" або "false". Значення "true" вказує на те, що в запит використовував застарілу версію API.

## k8s.io/removed-release

Приклад: `k8s.io/removed-release: "1.22"`

Значення **повинно** бути у форматі "\<MAJOR>\.\<MINOR>\". Встановлюється на цільовий випуск видалення на запити до застарілих версій API з цільовим випуском видалення.

## pod-security.kubernetes.io/exempt

Приклад: `pod-security.kubernetes.io/exempt: namespace`

Значення **повинно** бути одним із `user`, `namespace` або `runtimeClass`, що відповідає [вимогам виключень безпеки Pod](/docs/concepts/security/pod-security-admission/#exemptions). Ця анотація вказує на те, на чому засновано виключення з дотримання безпеки Pod.

## pod-security.kubernetes.io/enforce-policy

Приклад: `pod-security.kubernetes.io/enforce-policy: restricted:latest`

Значення **повинно** бути `privileged:<version>`, `baseline:<version>`,
`restricted:<version>`, що відповідає рівням [стандарту безпеки Pod](/docs/concepts/security/pod-security-standards), супроводжуваних версією, яка **повинна** бути `latest` або дійсною версією Kubernetes у форматі `v<MAJOR>.<MINOR>`. Ця анотація надає інформацію про рівень виконання, який дозволив або відхилив Pod під час допуску PodSecurity.

Див. [Стандарти безпеки Pod](/docs/concepts/security/pod-security-standards/) для отримання додаткової інформації.

## pod-security.kubernetes.io/audit-violations

Приклад:  `pod-security.kubernetes.io/audit-violations: would violate
PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "example" must set securityContext.allowPrivilegeEscalation=false), ...`

Значення деталізує порушення аудиту політики, воно містить рівень [стандарту безпеки Pod](/docs/concepts/security/pod-security-standards/), який був порушений, а також конкретні політики з полів, які були порушені з дотримання безпеки Pod.

Див. [Стандарти безпеки Pod](/docs/concepts/security/pod-security-standards/) для отримання додаткової інформації.

## apiserver.latency.k8s.io/etcd

Приклад: `apiserver.latency.k8s.io/etcd: "4.730661757s"`

Ця анотація вказує на міру затримки, що виникає на рівні зберігання, вона враховує час, необхідний для надсилання даних до etcd і отримання повної відповіді назад.

Значення цієї анотації аудиту не включає час, витрачений на допуск або перевірку.

## apiserver.latency.k8s.io/decode-response-object

Приклад: `apiserver.latency.k8s.io/decode-response-object: "450.6649ns"`

Ця анотація записує час, необхідний для декодування відповіді, отриманої від рівня зберігання (etcd)

## apiserver.latency.k8s.io/apf-queue-wait

Приклад: `apiserver.latency.k8s.io/apf-queue-wait: "100ns"`

Ця анотація записує час, який запит провів у черзі через пріоритети сервера API.

Дивіться [API Priority та Fairness](/docs/concepts/cluster-administration/flow-control/) (APF) для отримання додаткової інформації про цей механізм.

## authorization.k8s.io/decision

Приклад: `authorization.k8s.io/decision: "forbid"`

Значення має бути **forbid** або **allow**. Ця анотація вказує на те, чи було дозволено запит у логах аудиту Kubernetes.

Див. [Аудит](/docs/tasks/debug/debug-cluster/audit/) для отримання додаткової інформації.

## authorization.k8s.io/reason

Приклад: `authorization.k8s.io/reason: "Зрозуміла для людини причина рішення"`

Ця анотація вказує причину для [рішення](#authorization-k8s-io-decision) в логах аудиту Kubernetes.

Див. [Аудит](/docs/tasks/debug/debug-cluster/audit/) для отримання додаткової інформації.

## missing-san.invalid-cert.kubernetes.io/$hostname

Приклад: `missing-san.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "покладається на застаріле поле загального імені замість розширення SAN для перевірки субʼєкта"`

Використовується у Kubernetes версії v1.24 та пізніше.

Ця анотація вказує, що вебхук або агрегований API-сервер використовує недійсний сертифікат, у якого відсутні `subjectAltNames`. Підтримка цих сертифікатів відключена у Kubernetes 1.19 та видалена у Kubernetes 1.23.

Запити до точок доступу, які використовують ці сертифікати, будуть невдалими. Serviceʼи, які використовують ці сертифікати, повинні замінити їх якомога швидше, щоб уникнути перерви у роботі при використанні середовищ Kubernetes 1.23+.

Додаткову інформацію можна знайти в документації Go: [Відключення загального імені X.509](https://go.dev/doc/go1.15#commonname).

## insecure-sha1.invalid-cert.kubernetes.io/$hostname

Приклад: `insecure-sha1.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "використовує небезпечний підпис SHA-1"`

Використовується у Kubernetes версії v1.24 та пізніше.

Ця анотація вказує, що вебхук або агрегований API-сервер використовує недійсний сертифікат, підписаний небезпечним хешем SHA-1. Підтримка цих небезпечних сертифікатів відключена у Kubernetes 1.24 та буде видалена в майбутніх версіях.

Serviceʼи, які використовують ці сертифікати, повинні замінити їх якнайшвидше, щоб забезпечити належну безпеку зʼєднань та уникнути перебоїв у майбутніх випусках.

Додаткову інформацію можна знайти в документації Go: [Відхилення сертифікатів SHA-1](https://go.dev/doc/go1.18#sha1).

## validation.policy.admission.k8s.io/validation_failure

Приклад: `validation.policy.admission.k8s.io/validation_failure: '[{"message": "Недійсне значення", {"policy": "policy.example.com", {"binding": "policybinding.example.com", {"expressionIndex": "1", {"validationActions": ["Audit"]}]'`

Використовується у Kubernetes версії v1.27 та пізніше.

Ця анотація вказує, що перевірка політики допуску не вдалася для запиту API або що перевірка призвела до помилки, коли політика була налаштована з `failurePolicy: Fail`.

Значення анотації є обʼєктом JSON. `message` у JSON надає повідомлення про невдачу перевірки.

`policy`, `binding` і `expressionIndex` в JSON ідентифікують імʼя `ValidatingAdmissionPolicy`, імʼя `ValidatingAdmissionPolicyBinding` та індекс у політиці `validations` виразів CEL, які не вдалося, відповідно.

`validationActions` показують, які дії були вжиті для цієї невдачі перевірки. Див. [Політика валідації допуску](/docs/reference/access-authn-authz/validating-admission-policy/) для отримання додаткових відомостей щодо `validationActions`.
