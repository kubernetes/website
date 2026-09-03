---
content_type: "reference"
title: Kubelet Pods API
weight: 20
---

{{< feature-state feature_gate_name="PodsAPI" >}}

Kubelet Pods API дає змогу локальним компонентам вузла отримувати інформацію про {{< glossary_tooltip text="Podʼи" term_id="pod" >}}, що працюють на {{< glossary_tooltip term_id="Node" text="Вузлі" >}}, безпосередньо від kubelet. Це підвищує надійність, усуваючи залежність від сервера API Kubernetes для отримання локальної інформації про вузол, а також зменшує навантаження на {{< glossary_tooltip text="панель управління" term_id="control-plane" >}}.

Доступ до цього API обмежено локальними адміністраторами (зазвичай `root`) через права доступу до файлу на UNIX-сокеті.

## Точка доступу {#endpoint}

API слухає на UNIX-сокеті за адресою: `/var/lib/kubelet/pods-api/pods-api.sock`

{{< note >}}
Цей API не підтримується на вузлах Windows.
{{< /note >}}

## Операції {#operations}

API надає наступні методи gRPC:

### `ListPods` {#list-pods}

Повертає список усіх подів, які наразі керуються kubelet на вузлі.

### `WatchPods` {#watch-pods}

Повертає потік оновлень подів. Коли стан пода змінюється локально, kubelet надсилає оновлену інформацію про под через потік.

### `GetPod` {#get-pod}

Повертає інформацію про конкретний под, ідентифікований за його UID.

## Визначення API {#api-definition}

API використовує наступне визначення protobuf:

```protobuf
import "google/protobuf/field_mask.proto";
import "k8s.io/api/core/v1/generated.proto";

service Pods {
    // ListPods повертає список обʼєктів v1.Pod, який за бажанням можна відфільтрувати за допомогою маски полів.
    rpc ListPods(PodListRequest) returns (PodListResponse) {}
    // WatchPods повертає потік оновлень Pod, який за бажанням можна відфільтрувати за допомогою маски полів.
    rpc WatchPods(PodWatchRequest) returns (stream PodWatchResponse) {}
    // GetPod повертає обʼєкт v1.Pod для заданого UID пода, за бажанням можна відфільтрувати за допомогою маски полів.
    rpc GetPod(PodGetRequest) returns (PodGetResponse) {}
}

message PodListRequest {
    // Опційна маска полів у метаданих gRPC, щоб вказати, які поля пода повертати.
}

message PodListResponse {
    repeated v1.Pod pods = 1;
}

message PodWatchRequest {
    // Опційна маска полів у метаданих gRPC, щоб вказати, які поля пода повертати.
}

message PodWatchResponse {
    v1.Pod pod = 1;
}

message PodGetRequest {
    string podUID = 1;
    // Опційна маска полів у метаданих gRPC, щоб вказати, які поля пода повертати.
}

message PodGetResponse {
    v1.Pod pod = 1;
}
```

## Вибір полів {#field-selection}

API підтримує `google.protobuf.FieldMask`, щоб дозволити клієнтам запитувати лише конкретні поля, які їм потрібні (наприклад, `status.phase`, `status.podIPs`). Це забезпечує ефективну передачу даних. Якщо маска полів не надана, повертається повний обʼєкт `v1.Pod`.

## Надійність та доступність {#reliability}

API надає найактуальнішу інформацію, відому локально kubelet, отриману з його внутрішнього кешу та узгодження з середовищем виконання контейнерів. Він залишається доступним навіть у разі втрати вузлом звʼязку з панеллю управління Kubernetes.

Якщо джерела подів kubelet ще не завершили початкову синхронізацію (наприклад, відразу після запуску або перезапуску kubelet), кожна операція повертає помилку gRPC `FAILED_PRECONDITION` замість неповних даних. Після завершення синхронізації запити обробляються нормально.

## Обмеження швидкості {#rate-limiting}

`kubelet` обмежує швидкість запитів `ListPods` та `GetPod`, щоб захистити себе від надмірного навантаження. Зазвичай сервер дозволяє `100` запитів на секунду з піковим значенням `10` токенів. Запити, що перевищують цей ліміт, отримують помилку gRPC `RESOURCE_EXHAUSTED`.

Потоки `WatchPods` не підпадають під це обмеження швидкості; натомість повільний споживач, який відстає від свого потоку подій, втрачає з’єднання спостереження (див. [Метрики](#metrics)).

## Метрики {#metrics}

`kubelet` надає такі метрики для API подів, з мітками `server_api_version` та `status_code`:

* `kubelet_pod_requests_total`: кумулятивна кількість запитів до API.
* `kubelet_pod_requests_list_total`: кількість запитів до точки доступу `ListPods`.
* `kubelet_pod_requests_get_total`: кількість запитів до точки доступу `GetPod`.
* `kubelet_pod_requests_watch_total`: кількість запитів до точки доступу `WatchPods`.

`kubelet` також надає метрику `kubelet_pod_watch_events_dropped_total`, яка рахує події спостереження, відкинуті через те, що клієнт не встигав споживати свій потік подій.
