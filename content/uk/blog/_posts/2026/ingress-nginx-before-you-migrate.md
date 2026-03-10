---
layout: blog
title: "Що потрібно знати перед міграцією: пʼять несподіваних особливостей поведінки Ingress-NGINX"
date: 2026-02-27T07:30:00-08:00
slug: ingress-nginx-before-you-migrate
author: >
  [Steven Jin](https://github.com/Stevenjin8) (Microsoft)
translators: >
  [Андрій Головін](https://github.com/Andygol)
---

Як було [оголошено](/blog/2025/11/11/ingress-nginx-retirement/) в листопаді 2025 року, Kubernetes припинить підтримку Ingress-NGINX у березні 2026 року. Незважаючи на широке використання, Ingress-NGINX має безліч несподіваних стандартних налаштувань і побічних ефектів, які, ймовірно, присутні у вашому кластері зараз. У цьому дописі описано ці особливості, щоб ви могли безпечно здійснити міграцію та свідомо вирішити, які з них зберегти. У дописі також порівнюється Ingress-NGINX та Gateway API і показано, як зберегти особливості Ingress-NGINX у Gateway API. Ризик, що повторюється в кожному розділі, є однаковим: на перший погляд правильно виконане перетворення все одно може спричинити перебої в роботі, якщо не врахувати особливості Ingress-NGINX.

Я припускаю, що ви, читачі, маєте певне уявлення про Ingress-NGINX та Ingress API. У більшості прикладів як бекенд використовується [`httpbin`](https://github.com/postmanlabs/httpbin).

Також зверніть увагу, що Ingress-NGINX і NGINX Ingress — це два окремі контролери Ingress. [Ingress-NGINX](https://github.com/kubernetes/ingress-nginx) — це контролер Ingress, який підтримується та керується спільнотою Kubernetes і який буде виведений з експлуатації в березні 2026 року. [NGINX Ingress](https://docs.nginx.com/nginx-ingress-controller/) — це контролер Ingress від F5. Обидва використовують NGINX як рівень обробки даних, але в іншому не повʼязані між собою. Відтепер у цій публікації ми будемо обговорювати лише Ingress-NGINX.

## 1. Збіги регулярних виразів базуються на префіксах і не чутливі до регістру {#1-regex-matches-are-prefix-based-and-case-insensitive}

Припустимо, ви хочете перенаправити всі запити зі шляхом, що складається лише з трьох великих літер, до сервісу `httpbin`. Ви можете створити наступний Ingress з анотацією `nginx.ingress.kubernetes.io/use-regex:  "true"` annotation and the regex pattern of `/[A-Z]{3}`.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: regex-match-ingress
  annotations:
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  ingressClassName: nginx
  rules:
  - host: regex-match.example.com
    http:
      paths:
      - path: "/[A-Z]{3}"
        pathType: ImplementationSpecific
        backend:
          service:
            name: httpbin
            port:
              number: 8000
```

Однак, оскільки регулярні вирази не враховують префікси та регістр, Ingress-NGINX перенаправляє будь-який запит із шляхом, що починається з будь-яких трьох літер, на httpbin:

```bash
curl -sS -H "Host: regex-match.example.com" http://<your-ingress-ip>/uuid
```

Результат буде схожим на:

```yaml
{
  "uuid": "e55ef929-25a0-49e9-9175-1b6e87f40af7"
}
```

**Примітка:** Точка доступу `/uuid` httpbin повертає випадковий UUID. UUID у тілі відповіді означає, що запит був успішно перенаправлений до httpbin.

За допомогою Gateway API ви можете використовувати [HTTP path match](https://gateway-api.sigs.k8s.io/reference/spec/#httppathmatch) з `type` типу `RegularExpression` для зіставлення шляхів за регулярним виразом. Зіставлення `RegularExpression` залежать від конкретної реалізації, тому перевірте реалізацію Gateway API, щоб переконатися в семантиці зіставлення `RegularExpression`. Популярні реалізації Gateway API на основі Envoy, такі як [Istio](https://istio.io/)[^1], [Envoy Gateway](https://gateway.envoyproxy.io/) та [Kgateway](https://kgateway.dev/), виконують повне співставлення з урахуванням регістру.

Отже, якщо ви не знаєте, що шаблони Ingress-NGINX є префіксами і не чутливі до регістру, і, не знаючи про це, клієнти або застосунки надсилають трафік до `/uuid` (або `/uuid/some/other/path`), ви можете створити такий маршрут HTTP.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: regex-match-route
spec:
  hostnames:
  - regex-match.example.com
  parentRefs:
  - name: <your gateway>  # Змінюйте це залежно від вашого випадку використання
  rules:
  - matches:
    - path:
        type: RegularExpression
        value: "/[A-Z]{3}"
    backendRefs:
    - name: httpbin
      port: 8000
```

Однак, якщо ваша реалізація Gateway API виконує повне співставлення з урахуванням регістру, вищевказаний маршрут HTTP не буде відповідати запиту зі шляхом `/uuid`. Таким чином, вищевказаний маршрут HTTP спричинить збій, оскільки запити, які Ingress-NGINX маршрутизував до httpbin, завершаться з помилкою 404 Not Found на шлюзі.

Щоб зберегти співставлення регулярних виразів без урахування регістру, ви можете використовувати наступний маршрут HTTP.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: regex-match-route
spec:
  hostnames:
  - regex-match.example.com
  parentRefs:
  - name: <your gateway>  # Змінюйте це залежно від вашого випадку використання
  rules:
  - matches:
    - path:
        type: RegularExpression
        value: "/[a-zA-Z]{3}.*"
    backendRefs:
    - name: httpbin
      port: 8000
```

Крім того, вищезазначені проксі підтримують прапорець `(?i)` для позначення збігів, нечутливих до регістру. Використовуючи цей прапорець, шаблон може бути таким: `(?i)/[a-z]{3}.*`.

## 2. `nginx.ingress.kubernetes.io/use-regex` застосовується до всіх шляхів хоста у всіх (Ingress-NGINX) Ingresses {#2-the-nginx-ingress-kubernetes-io-use-regex-applies-to-all-paths-of-a-host-across-all-ingress-nginx-ingresses}

Тепер припустимо, що у вас є Ingress з анотацією `nginx.ingress.kubernetes.io/use-regex: "true"`, але ви хочете маршрутизувати запити з шляхом `/headers` до `httpbin`. На жаль, ви зробили помилку і встановили шлях `/Header` замість `/headers`.

```yaml
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: regex-match-ingress
  annotations:
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  ingressClassName: nginx
  rules:
  - host: regex-match.example.com
    http:
      paths:
      - path: "<some regex pattern>"
        pathType: ImplementationSpecific
        backend:
          service:
            name: <your backend>
            port:
              number: 8000
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: regex-match-ingress-other
spec:
  ingressClassName: nginx
  rules:
  - host: regex-match.example.com
    http:
      paths:
      - path: "/Header" # тут помилка, має бути /headers
        pathType: Exact
        backend:
          service:
            name: httpbin
            port:
              number: 8000
```

Більшість очікує, що запит до `/headers` поверне відповідь 404 Not Found, оскільки `/headers` не відповідає `Exact` шляху `/Header`. Однак, оскільки Ingress `regex-match-ingress` має анотацію `nginx.ingress.kubernetes.io/use-regex: "true"` і хост `regex-match.example.com`, **всі шляхи з хостом `regex-match.example.com` розглядаються як регулярні вирази у всіх (Ingress-NGINX) Ingress.** Оскільки шаблони регулярних виразів є префіксними збігами, що не чутливі до регістру, `/headers` збігається з шаблоном `/Header`, і Ingress-NGINX маршрутизує такі запити до `httpbin`. Виконання команди

```bash
curl -sS -H "Host: regex-match.example.com" http://<your-ingress-ip>/headers
```

дасть наступний результат:

```yaml
{
  "headers": {
    ...
  }
}
```

**Примітка:** Точка доступу `/headers` httpbin повертає заголовки запиту. Те, що відповідь містить заголовки запиту в тілі, означає, що запит був успішно перенаправлений на httpbin.

Gateway API не перетворює і не інтерпретує збіги `Exact` і `Prefix` як шаблони регулярних виразів. Тому, якщо ви перетворили вищезазначені Ingresses у наступний маршрут HTTP і зберегли типи помилок і збігів, запити до `/headers` будуть відповідати кодом 404 Not Found замість 200 OK.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: regex-match-route
spec:
  hostnames:
  - regex-match.example.com
  rules:
  ...
  - matches:
    - path:
        type: Exact
        value: "/Header"
    backendRefs:
    - name: httpbin
      port: 8000
```

Щоб зберегти відповідність префіксів без врахування регістру, можна змінити

```yaml
  - matches:
    - path:
        type: Exact
        value: "/Header"
```

на

```yaml
  - matches:
    - path:
        type: RegularExpression
        value: "(?i)/Header"
```

А ще краще, ви могли б виправити помилку і змінити шаблон на

```yaml
  - matches:
    - path:
        type: Exact
        value: "/headers"
```

## 3. Переписування цільового обʼєкта передбачає використання регулярного виразу {#3-rewrite-target-implies-regex}

У цьому випадку припустимо, що ви хочете переписати шлях запитів із `/ip` на `/uuid` перед їх маршрутизацією до `httpbin`, і, як у розділі 2, ви хочете маршрутизувати запити із шляхом `/headers` до `httpbin`. Однак ви випадково зробили помилку і встановили шлях `/IP` замість `/ip` і `/Header` замість `/headers`.

```yaml
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: rewrite-target-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: "/uuid"
spec:
  ingressClassName: nginx
  rules:
  - host: rewrite-target.example.com
    http:
      paths:
      - path: "/IP"
        pathType: Exact
        backend:
          service:
            name: httpbin
            port:
              number: 8000
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: rewrite-target-ingress-other
spec:
  ingressClassName: nginx
  rules:
  - host: rewrite-target.example.com
    http:
      paths:
      - path: "/Header"
        pathType: Exact
        backend:
          service:
            name: httpbin
            port:
              number: 8000
```

Анотація `nginx.ingress.kubernetes.io/rewrite-target: «/uuid»` призводить до того, що запити, які відповідають шляхам в Ingress `rewrite-target-ingress`, мають свої шляхи перетворені на `/uuid` перед тим, як бути перенаправленими на бекенд.

Незважаючи на те, що жоден Ingress не має анотації `nginx.ingress.kubernetes.io/use-regex: "true"`, наявність анотації `nginx.ingress.kubernetes.io/rewrite-target` в Ingress `rewrite-target-ingress` призводить до того, що **всі шляхи з хостом `rewrite-target.example.com` розглядаються як шаблони регулярних виразів.** Іншими словами, `nginx.ingress.kubernetes.io/rewrite-target` тихо додає анотацію `nginx.ingress.kubernetes.io/use-regex: "true"`, разом з усіма побічними ефектами, описаними вище.

Наприклад, шлях запиту до `/ip` перезаписується на `/uuid`, оскільки `/ip` відповідає префіксу `/IP`, що не чутливий до регістру, в Ingress `rewrite-target-ingress`. Після виконання команди

```bash
curl -sS -H "Host: rewrite-target.example.com" http://<your-ingress-ip>/ip
```

результат буде схожим на:

```yaml
{
  "uuid": "12a0def9-1adg-2943-adcd-1234aadfgc67"
}
```

Як і в прикладі `nginx.ingress.kubernetes.io/use-regex`, Ingress-NGINX обробляє `path` інших інгресів з хостом `rewrite-target.example.com` як префіксні шаблони, що не розрізняють регістр. Виконання команди

```bash
curl -sS -H "Host: rewrite-target.example.com" http://<your-ingress-ip>/headers
```

дає результат, який виглядає так

```yaml
{
  "headers": {
    ...
  }
}
```

Ви можете налаштувати перезапис шляхів у Gateway API за допомогою [фільтра перезапису HTTP URL](https://gateway-api.sigs.k8s.io/reference/spec/#httpurlrewritefilter), який не перетворює ваші збіги `Exact` та `Prefix` у шаблони регулярних виразів. Однак, якщо ви не знаєте про побічні ефекти анотації `nginx.ingress.kubernetes.io/rewrite-target` і не розумієте, що `/Header` і `/IP` є помилками, ви можете створити такий маршрут HTTP.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: rewrite-target-route
spec:
  hostnames:
  - rewrite-target.example.com
  parentRefs:
  - name: <your-gateway>
  rules:
  - matches:
    - path:
        type: Exact
        value: "/IP"
    filters:
    - type: URLRewrite
      urlRewrite:
        path:
          type: ReplaceFullPath
          replaceFullPath: /uuid
    backendRefs:
    - name: httpbin
      port: 8000
  - matches:
    - path:
        # Це точне співпадіння, незалежно від інших правил.
        type: Exact
        value: "/Header"
    backendRefs:
    - name: httpbin
      port: 8000
```

Як і в розділі 2, оскільки `/IP` тепер є типом збігу `Exact` у вашому маршруті HTTP, запити до `/ip` будуть відповідати кодом 404 Not Found замість 200 OK. Аналогічно, запити до `/headers` також будуть відповідати кодом 404 Not Found замість 200 OK. Таким чином, цей маршрут HTTP порушить роботу застосунків і клієнтів, які покладаються на маршрути `/ip` і `/headers`.

Щоб виправити це, ви можете змінити збіги в маршруті HTTP на збіги регулярних виразів і змінити шаблони шляхів на збіги префіксів, що не чутливі до регістру, як показано нижче.

```yaml
  - matches:
    - path:
        type: RegularExpression
        value: "(?i)/IP.*"
...
  - matches:
    - path:
        type: RegularExpression
        value: "(?i)/Header.*"
```

Або ви можете залишити тип збігу `Exact` і виправити помилки.

## 4. Запити, в яких відсутній кінцевий слеш, перенаправляються на той самий шлях з кінцевим слешем {#4-requests-missing-a-trailing-slash-are-redirected-to-the-same-path-with-a-trailing-slash}

Розглянемо наступний Ingress:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: trailing-slash-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: trailing-slash.example.com
    http:
      paths:
      - path: "/my-path/"
        pathType: Exact
        backend:
          service:
            name: <your-backend>
            port:
              number: 8000
```

Ви можете очікувати, що Ingress-NGINX відповість на `/my-path` кодом 404 Not Found, оскільки `/my-path` не збігається з `Exact` шляхом `/my-path/`. Однак Ingress-NGINX перенаправляє запит на `/my-path/` з кодом 301 Moved Permanently, оскільки єдина відмінність між `/my-path` і `/my-path/` — це кінцевий слеш.

```bash
curl -isS -H "Host: trailing-slash.example.com" http://<your-ingress-ip>/my-path
```

Результат виглядає так:

```http
HTTP/1.1 301 Moved Permanently
...
Location: http://trailing-slash.example.com/my-path/
...
```

Те саме стосується випадків, коли ви змінюєте `pathType` на `Prefix`. Однак перенаправлення не відбувається, якщо шлях є шаблоном регулярного виразу.

Сумісні реалізації Gateway API не конфігурують жодних перенаправлень без попередження. Якщо клієнти або сервіси нижчого рівня залежать від цього перенаправлення, міграція до Gateway API, який не конфігурує перенаправлення запитів явно, спричинить збій, оскільки запити до `/my-path` тепер будуть відповідати кодом 404 Not Found замість 301 Moved Permanently. Ви можете явно налаштувати перенаправлення за допомогою [фільтра перенаправлення HTTP-запитів](https://gateway-api.sigs.k8s.io/reference/spec/#httprequestredirectfilter) наступним чином:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: trailing-slash-route
spec:
  hostnames:
  - trailing-slash.example.com
  parentRefs:
  - name: <your-gateway>
  rules:
  - matches:
    - path:
        type: Exact
        value: "/my-path"
    filters:
      requestRedirect:
        statusCode: 301
        path:
          type: ReplaceFullPath
          replaceFullPath: /my-path/
  - matches:
    - path:
        type: Exact # або Prefix
        value: "/my-path/"
    backendRefs:
    - name: <your-backend>
      port: 8000
```

## 5. Ingress-NGINX нормалізує URL-адреси {#5-ingress-nginx-normalizes-urls}

*Нормалізація URL-адреси* — це процес перетворення URL-адреси в канонічну форму перед її зіставленням з правилами Ingress і маршрутизацією. Особливості нормалізації URL-адреси визначені в [RFC 3986, розділ 6.2](https://datatracker.ietf.org/doc/html/rfc3986#section-6.2), але ось декілька прикладів

* видалення сегментів шляху, які є лише `.`: `my/./path -> my/path`
* сегмент шляху `..` видаляє попередній сегмент: `my/../path -> /path`
* видалення послідовних косих рисок у шляху: `my//path -> my/path`

Ingress-NGINX нормалізує URL-адреси перед їх порівнянням з правилами Ingress. Наприклад, розглянемо наступний Ingress:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: path-normalization-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: path-normalization.example.com
    http:
      paths:
      - path: "/uuid"
        pathType: Exact
        backend:
          service:
            name: httpbin
            port:
              number: 8000
```

Ingress-NGINX нормалізує шлях наступних запитів до `/uuid`. Тепер, коли запит відповідає шляху `Exact` `/uuid`, Ingress-NGINX відповідає або кодом 200 OK, або кодом 301 Moved Permanently до `/uuid`.

Для наступних команд

```bash
curl -sS -H "Host: path-normalization.example.com" http://<your-ingress-ip>/uuid
curl -sS -H "Host: path-normalization.example.com" http://<your-ingress-ip>/ip/abc/../../uuid
curl -sSi -H "Host: path-normalization.example.com" http://<your-ingress-ip>////uuid
```

результати схожі на

```yaml
{
  "uuid": "29c77dfe-73ec-4449-b70a-ef328ea9dbce"
}
```

```yaml
{
  "uuid": "d20d92e8-af57-4014-80ba-cf21c0c4ffae"
}
```

```http
HTTP/1.1 301 Moved Permanently
...
Location: /uuid
...
```

Ваші бекенди можуть покладатися на реалізацію API Ingress/Gateway для нормалізації URL-адрес. При цьому більшість реалізацій API Gateway мають стагжартно увімкнену функцію нормалізації шляхів. Наприклад, Istio, Envoy Gateway та Kgateway нормалізують сегменти `.` та `..` без додаткових налаштувань. Для отримання детальнішої інформації перегляньте документацію для кожної реалізації API Gateway, яку ви використовуєте.

## Підсумок {#conclusion}

Оскільки ми всі поспішаємо реагувати на виведення з експлуатації Ingress-NGINX, сподіваюся, що ця публікація додасть вам впевненості в тому, що ви зможете безпечно та ефективно здійснити міграцію, незважаючи на всі складнощі Ingress-NGINX.

SIG Network також працює над підтримкою найпоширеніших анотацій Ingress-NGINX (та деяких несподіваних поведінок) в [Ingress2Gateway](https://github.com/kubernetes-sigs/ingress2gateway), щоб допомогти вам перетворити конфігурацію Ingress-NGINX на Gateway API та запропонувати альтернативи для непідтримуваних поведінок.

SIG Network випустила Gateway API 1.5 сьогодні (27 лютого 2026 року), яка вдосконалює такі функції, як [ListenerSet](https://gateway-api.sigs.k8s.io/api-types/listenerset/) (що дозволяє розробникам додатків краще управляти сертифікатами TLS) та фільтр HTTPRoute CORS, що дозволяє конфігурувати CORS.

[^1]: Ви можете використовувати Istio виключно як контролер Gateway API без інших функцій сервісної мережі.
