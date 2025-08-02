---
title: Створення діаграм
linktitle: Створення діаграм
content_type: concept
weight: 60
---

<!-- overview -->

Цей посібник показує, як створювати, редагувати та поширювати діаграмами за допомогою JavaScript бібліотеки Mermaid. Mermaid.js дозволяє створювати діаграми за допомогою простого синтаксису, подібного до Markdown, всередині Markdown-файлів. Ви також можете використовувати Mermaid для створення файлів зображень у форматі `.svg` або `.png`, які ви можете додати до документації.

Цільовою аудиторією цього посібника є будь-хто, хто бажає дізнатися про Mermaid та/або як створювати і додавати діаграми до документації Kubernetes.

На схемі 1 показані теми, які розглядаються в цьому розділі.

{{< mermaid >}}
flowchart LR
    subgraph m[Mermaid.js]
    direction TB
        S[ ]-.-
        C[створення<br>діаграм<br>в markdown] -->
        D[в редакторі<br>on-line]
    end
    A[Чому діаграми<br>є корисними?] --> m
    m --> N[3 x методи<br>створення<br>діаграм]
    N --> T[Приклади]
    T --> X[Стилі<br>andта<br>заголовки]
    X --> V[Поради]


    classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
    classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
    class A,C,D,N,X,m,T,V box
    class S spacewhite

%% ви можете додавати гіперпосилання на вузли діаграми Mermaid за допомогою операторів click

click A "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqNkkFr2zAUx7-KUK9yydjNGx1ds9uWwxJKwM5BseRZq2UFWSYZpbBuH2CX0evYadeQtSw0bT-D9I32JLvE3WkCm6f3f-_3f4J3jjPFOI5xXqplVlBt0Nv3aYXg1M38g6aLAsnkHdeSCnb4sZ61GhOaZ0aoCk1etxl_xgmaRYfRPnGSuEv3xW7sg_tsb-y9vXffXs71kb12V3Ztf0N2be9CZoMk1WdMLasZiqKjPWOYgBbar6H4FnAAc1e-SVVRKSrezcQr1gbHif1lH-yd-4qeGtmt73Lfkb0NE23dJcy09cKr4IpkS5DhMkqeoxUC9cabgn3b_h8v6iYaBcwksT-8GZjuQARMJ0-CPE3sTyBu7a59FK0YXNcB-scjwXoH3wb6HzunofMUwGGOPhT-bZCVtK6HPEdztUK5KMv4IM9zUhutznh8MBgMujhaCmaK-NliRTJVKh20F_9A6gXN-LIQhu9Zfdw-7nCDJ7geDR2TEzIkIzIlkkzIqZ-vL497Xphg2a4ebOi5r0qxKbjkKY4hZDynTWlSnFYXUNosGDX8DRNGaRzntKw5wbQxavypynBsdMMfi4aCwm7LruriLzapRXs" _blank

click C "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqNkkFr2zAUx7-KUK9yydjNGx1ds9uWwxJKwM5BseRZq2UFWSYZpbBuH2CX0evYadeQtSw0bT-D9I32JLvE3WkCm6f3f-_3f4J3jjPFOI5xXqplVlBt0Nv3aYXg1M38g6aLAsnkHdeSCnb4sZ61GhOaZ0aoCk1etxl_xgmaRYfRPnGSuEv3xW7sg_tsb-y9vXffXs71kb12V3Ztf0N2be9CZoMk1WdMLasZiqKjPWOYgBbar6H4FnAAc1e-SVVRKSrezcQr1gbHif1lH-yd-4qeGtmt73Lfkb0NE23dJcy09cKr4IpkS5DhMkqeoxUC9cabgn3b_h8v6iYaBcwksT-8GZjuQARMJ0-CPE3sTyBu7a59FK0YXNcB-scjwXoH3wb6HzunofMUwGGOPhT-bZCVtK6HPEdztUK5KMv4IM9zUhutznh8MBgMujhaCmaK-NliRTJVKh20F_9A6gXN-LIQhu9Zfdw-7nCDJ7geDR2TEzIkIzIlkkzIqZ-vL497Xphg2a4ebOi5r0qxKbjkKY4hZDynTWlSnFYXUNosGDX8DRNGaRzntKw5wbQxavypynBsdMMfi4aCwm7LruriLzapRXs" _blank

click D "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqNkkFr2zAUx7-KUK9yydjNGx1ds9uWwxJKwM5BseRZq2UFWSYZpbBuH2CX0evYadeQtSw0bT-D9I32JLvE3WkCm6f3f-_3f4J3jjPFOI5xXqplVlBt0Nv3aYXg1M38g6aLAsnkHdeSCnb4sZ61GhOaZ0aoCk1etxl_xgmaRYfRPnGSuEv3xW7sg_tsb-y9vXffXs71kb12V3Ztf0N2be9CZoMk1WdMLasZiqKjPWOYgBbar6H4FnAAc1e-SVVRKSrezcQr1gbHif1lH-yd-4qeGtmt73Lfkb0NE23dJcy09cKr4IpkS5DhMkqeoxUC9cabgn3b_h8v6iYaBcwksT-8GZjuQARMJ0-CPE3sTyBu7a59FK0YXNcB-scjwXoH3wb6HzunofMUwGGOPhT-bZCVtK6HPEdztUK5KMv4IM9zUhutznh8MBgMujhaCmaK-NliRTJVKh20F_9A6gXN-LIQhu9Zfdw-7nCDJ7geDR2TEzIkIzIlkkzIqZ-vL497Xphg2a4ebOi5r0qxKbjkKY4hZDynTWlSnFYXUNosGDX8DRNGaRzntKw5wbQxavypynBsdMMfi4aCwm7LruriLzapRXs" _blank

click N "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqNkkFr2zAUx7-KUK9yydjNGx1ds9uWwxJKwM5BseRZq2UFWSYZpbBuH2CX0evYadeQtSw0bT-D9I32JLvE3WkCm6f3f-_3f4J3jjPFOI5xXqplVlBt0Nv3aYXg1M38g6aLAsnkHdeSCnb4sZ61GhOaZ0aoCk1etxl_xgmaRYfRPnGSuEv3xW7sg_tsb-y9vXffXs71kb12V3Ztf0N2be9CZoMk1WdMLasZiqKjPWOYgBbar6H4FnAAc1e-SVVRKSrezcQr1gbHif1lH-yd-4qeGtmt73Lfkb0NE23dJcy09cKr4IpkS5DhMkqeoxUC9cabgn3b_h8v6iYaBcwksT-8GZjuQARMJ0-CPE3sTyBu7a59FK0YXNcB-scjwXoH3wb6HzunofMUwGGOPhT-bZCVtK6HPEdztUK5KMv4IM9zUhutznh8MBgMujhaCmaK-NliRTJVKh20F_9A6gXN-LIQhu9Zfdw-7nCDJ7geDR2TEzIkIzIlkkzIqZ-vL497Xphg2a4ebOi5r0qxKbjkKY4hZDynTWlSnFYXUNosGDX8DRNGaRzntKw5wbQxavypynBsdMMfi4aCwm7LruriLzapRXs" _blank

click T "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqNkkFr2zAUx7-KUK9yydjNGx1ds9uWwxJKwM5BseRZq2UFWSYZpbBuH2CX0evYadeQtSw0bT-D9I32JLvE3WkCm6f3f-_3f4J3jjPFOI5xXqplVlBt0Nv3aYXg1M38g6aLAsnkHdeSCnb4sZ61GhOaZ0aoCk1etxl_xgmaRYfRPnGSuEv3xW7sg_tsb-y9vXffXs71kb12V3Ztf0N2be9CZoMk1WdMLasZiqKjPWOYgBbar6H4FnAAc1e-SVVRKSrezcQr1gbHif1lH-yd-4qeGtmt73Lfkb0NE23dJcy09cKr4IpkS5DhMkqeoxUC9cabgn3b_h8v6iYaBcwksT-8GZjuQARMJ0-CPE3sTyBu7a59FK0YXNcB-scjwXoH3wb6HzunofMUwGGOPhT-bZCVtK6HPEdztUK5KMv4IM9zUhutznh8MBgMujhaCmaK-NliRTJVKh20F_9A6gXN-LIQhu9Zfdw-7nCDJ7geDR2TEzIkIzIlkkzIqZ-vL497Xphg2a4ebOi5r0qxKbjkKY4hZDynTWlSnFYXUNosGDX8DRNGaRzntKw5wbQxavypynBsdMMfi4aCwm7LruriLzapRXs" _blank

click X "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqNkkFr2zAUx7-KUK9yydjNGx1ds9uWwxJKwM5BseRZq2UFWSYZpbBuH2CX0evYadeQtSw0bT-D9I32JLvE3WkCm6f3f-_3f4J3jjPFOI5xXqplVlBt0Nv3aYXg1M38g6aLAsnkHdeSCnb4sZ61GhOaZ0aoCk1etxl_xgmaRYfRPnGSuEv3xW7sg_tsb-y9vXffXs71kb12V3Ztf0N2be9CZoMk1WdMLasZiqKjPWOYgBbar6H4FnAAc1e-SVVRKSrezcQr1gbHif1lH-yd-4qeGtmt73Lfkb0NE23dJcy09cKr4IpkS5DhMkqeoxUC9cabgn3b_h8v6iYaBcwksT-8GZjuQARMJ0-CPE3sTyBu7a59FK0YXNcB-scjwXoH3wb6HzunofMUwGGOPhT-bZCVtK6HPEdztUK5KMv4IM9zUhutznh8MBgMujhaCmaK-NliRTJVKh20F_9A6gXN-LIQhu9Zfdw-7nCDJ7geDR2TEzIkIzIlkkzIqZ-vL497Xphg2a4ebOi5r0qxKbjkKY4hZDynTWlSnFYXUNosGDX8DRNGaRzntKw5wbQxavypynBsdMMfi4aCwm7LruriLzapRXs" _blank

click V "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqNkkFr2zAUx7-KUK9yydjNGx1ds9uWwxJKwM5BseRZq2UFWSYZpbBuH2CX0evYadeQtSw0bT-D9I32JLvE3WkCm6f3f-_3f4J3jjPFOI5xXqplVlBt0Nv3aYXg1M38g6aLAsnkHdeSCnb4sZ61GhOaZ0aoCk1etxl_xgmaRYfRPnGSuEv3xW7sg_tsb-y9vXffXs71kb12V3Ztf0N2be9CZoMk1WdMLasZiqKjPWOYgBbar6H4FnAAc1e-SVVRKSrezcQr1gbHif1lH-yd-4qeGtmt73Lfkb0NE23dJcy09cKr4IpkS5DhMkqeoxUC9cabgn3b_h8v6iYaBcwksT-8GZjuQARMJ0-CPE3sTyBu7a59FK0YXNcB-scjwXoH3wb6HzunofMUwGGOPhT-bZCVtK6HPEdztUK5KMv4IM9zUhutznh8MBgMujhaCmaK-NliRTJVKh20F_9A6gXN-LIQhu9Zfdw-7nCDJ7geDR2TEzIkIzIlkkzIqZ-vL497Xphg2a4ebOi5r0qxKbjkKY4hZDynTWlSnFYXUNosGDX8DRNGaRzntKw5wbQxavypynBsdMMfi4aCwm7LruriLzapRXs" _blank

{{< /mermaid >}}

Схема 1. Теми, які розглядаються в цьому розділі

Все що вам треба для роботи з Mermaid це:

* Знання основ markdown.
* Користуватись онлайн редактором Mermaid.
* Користуватись [Hugo shortcodes](/docs/contribute/style/hugo-shortcodes/).
* Користуватись [Hugo shortcode {{</* figure */>}}](https://gohugo.io/content-management/shortcodes/#figure).
* Виконувати [локальний перегляд в Hugo](/docs/contribute/new-content/open-a-pr/#preview-locally).
* Знати як брати участь у [створенні нового контенту](/docs/contribute/new-content/).

{{< note >}}
Ви можете клацнути на будь-яку діаграму в цьому розділі, щоб перейти до онлайн редактора Mermaid для ознайомлення з нею та редагування
{{< /note >}}

<!--body-->

## Чому слід використовувати діаграми в документації {#why-you-should-use-diagrams-in-documentation}

Діаграми покращують ясність та сприйняття документації. Це має переваги як для користувачів, так і для контриб'юторів.

Переваги для користувачів включають:

* __Приємне перше враження__. Детальна текстова сторінка привітання може налякати користувачів, особливо новачків у Kubernetes.
* __Швидке освоєння концепцій__. Діаграма може допомогти користувачам зрозуміти ключові моменти складної теми. Ваша діаграма може слугувати візуальним навчальним посібником для занурення в деталі теми.
* __Краще запамʼятовування__. Для деяких легше запамʼятати зображення, ніж текст.

Переваги для учасників включають:

* __Допомога у розробці структури та контенту__ вашого внеску. Наприклад, ви можете почати з простої діаграми, яка охоплює високий рівень, а потім зануритися в деталі.
* __Розширення та зростання спільноти користувачів__. Зручна для сприйняття документація, доповнена діаграмами, приваблює нових користувачів, які раніше неохоче брали участь у проєкті через уявну складність.

Вам слід враховувати вашу цільову аудиторію. Окрім досвідчених користувачів K8s, у вас буде багато новачків у Kubernetes. Навіть проста діаграма може допомогти новим користувачам засвоїти концепції Kubernetes. Вони стають впевненішими та більш схильними до подальшого дослідження Kubernetes та документації.

## Mermaid {#mermaid}

[Mermaid](https://mermaid-js.github.io/mermaid/#/) — це бібліотека JavaScript з відкритим вихідним кодом, яка дозволяє створювати, редагувати та легко ділитися діаграмами, використовуючи простий синтаксис, схожий на Markdown, який використовується в файлах Markdown.

Нижче наведено особливості Mermaid:

* Простий синтаксис коду.
* Включає вебінструмент для кодування та перегляду ваших діаграм.
* Підтримує кілька форматів, включаючи діаграми процесів, станів та послідовностей.
* Легке співробітництво з колегами через URL-адресу для кожної діаграми.
* Широкий вибір форм, ліній, тем та стилів.

Переваги використання Mermaid:

* Немає потреби в спеціальних інструментах для створення діаграм.
* Відповідає поточному робочому процесу з використанням PR. Ви можете розглядати код Mermaid як просто текст Markdown, доданий у ваш PR.
* Простий інструмент створює прості діаграми. Не хочете витрачати час на створення надто складних і деталізованих зображень. Тримайте їх простими!

Mermaid надає простий, відкритий та прозорий метод для спільнот SIG для додавання, редагування та співпраці над діаграмами для нової чи наявної документації.

{{< note >}}
Ви все ще можете використовувати Mermaid для створення/редагування діаграм, навіть якщо вона не підтримується у вашому середовищі. Цей метод називається __Mermaid+SVG__ і пояснюється нижче.
{{< /note >}}

### Онлайн редактор {#live-editor}

[Онлайн редактор Mermaid](https://mermaid-js.github.io/mermaid-live-editor) — це вебінструмент, який дозволяє створювати, редагувати та переглядати діаграми.

Нижче наведено функції редактора:

* Показує код Mermaid разом зі згенерованою діаграмою.
* Генерує URL для кожної збереженої діаграми. URL відображається в адресному рядку вашого оглядача. Ви можете поділитися URL з колегами, які можуть отримати доступ до діаграми та змінювати її.
* Можливість отримати файли `.svg` або `.png`.

{{< note >}}
Онлайн редактор — це найпростіший і найшвидший спосіб створення та редагування діаграм Mermaid.
{{< /note >}}

## Методи створення діаграм {#methods-for-creating-diagrams}

На схемі 2 показано три способи створення та додавання діаграм.

{{< mermaid >}}
graph TB
    A[Діаграма]
    B[В тексті<br><br>Код Mermaid<br>додається<br> у файл .md]
    C[Mermaid+SVG<br><br>Файл svg, згенерований<br>Mermaid,<br>додається у файл .md]
    D[Зовнішні іструменти<br><br>Файл svg, згенерований<br>стороннім інстументом,<br>додається у файл .md]

    A --> B
    A --> C
    A --> D

    classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
    class A,B,C,D box

%% ви можете додавати гіперпосилання на вузли діаграми Mermaid за допомогою операторів click

click A "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqVks1Kw0AQx19lWY9upV6jFNpGPHmqeEk8pMmmDSZNyYdWSqG2HjwIgpQKnn2AYltstckzzL6Rs2kqRRR0YZfZmf_-ZmZ3u9T0LU4V2giMdpOcVvQWwVHWYCTGMIGp6OO6gsn5OlDR4JGIAczhXdyIgRgf1oOSnPAMKczICQ88w7Eyz0x6YCJGqLtH9YP0EjEk4haZS_gge56Vc6tafnK3dnb8xXzJdeFlgxF4gynmTWCONaXwirEEFrCUyvww-znvLzlVDZ4yUCLG4k6uBA3ZVV8MsWfMhZ0u_l-NZECa-ROJhRWC0fiOTmH194rzhyGFQolUtjfV7Y26EZquEYYqt0nd7xDbcV1lx7ZtFkaBf8GVnWKxmNuFK8eKmsp-u8NM3_WDLHawBSFlVmFVpkoSZdRbXzV-ma4U6TRqco_rVEHT4rYRu5FO9VYPpXHbMiJ-ZDmRH1DFNtyQM2rEkV-7bplUiYKYb0SqY-AP9HJV7xMRDjlt" _blank

click B "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqVks1Kw0AQx19lWY9upV6jFNpGPHmqeEk8pMmmDSZNyYdWSqG2HjwIgpQKnn2AYltstckzzL6Rs2kqRRR0YZfZmf_-ZmZ3u9T0LU4V2giMdpOcVvQWwVHWYCTGMIGp6OO6gsn5OlDR4JGIAczhXdyIgRgf1oOSnPAMKczICQ88w7Eyz0x6YCJGqLtH9YP0EjEk4haZS_gge56Vc6tafnK3dnb8xXzJdeFlgxF4gynmTWCONaXwirEEFrCUyvww-znvLzlVDZ4yUCLG4k6uBA3ZVV8MsWfMhZ0u_l-NZECa-ROJhRWC0fiOTmH194rzhyGFQolUtjfV7Y26EZquEYYqt0nd7xDbcV1lx7ZtFkaBf8GVnWKxmNuFK8eKmsp-u8NM3_WDLHawBSFlVmFVpkoSZdRbXzV-ma4U6TRqco_rVEHT4rYRu5FO9VYPpXHbMiJ-ZDmRH1DFNtyQM2rEkV-7bplUiYKYb0SqY-AP9HJV7xMRDjlt" _blank

click C "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqVks1Kw0AQx19lWY9upV6jFNpGPHmqeEk8pMmmDSZNyYdWSqG2HjwIgpQKnn2AYltstckzzL6Rs2kqRRR0YZfZmf_-ZmZ3u9T0LU4V2giMdpOcVvQWwVHWYCTGMIGp6OO6gsn5OlDR4JGIAczhXdyIgRgf1oOSnPAMKczICQ88w7Eyz0x6YCJGqLtH9YP0EjEk4haZS_gge56Vc6tafnK3dnb8xXzJdeFlgxF4gynmTWCONaXwirEEFrCUyvww-znvLzlVDZ4yUCLG4k6uBA3ZVV8MsWfMhZ0u_l-NZECa-ROJhRWC0fiOTmH194rzhyGFQolUtjfV7Y26EZquEYYqt0nd7xDbcV1lx7ZtFkaBf8GVnWKxmNuFK8eKmsp-u8NM3_WDLHawBSFlVmFVpkoSZdRbXzV-ma4U6TRqco_rVEHT4rYRu5FO9VYPpXHbMiJ-ZDmRH1DFNtyQM2rEkV-7bplUiYKYb0SqY-AP9HJV7xMRDjlt" _blank

click D "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqVks1Kw0AQx19lWY9upV6jFNpGPHmqeEk8pMmmDSZNyYdWSqG2HjwIgpQKnn2AYltstckzzL6Rs2kqRRR0YZfZmf_-ZmZ3u9T0LU4V2giMdpOcVvQWwVHWYCTGMIGp6OO6gsn5OlDR4JGIAczhXdyIgRgf1oOSnPAMKczICQ88w7Eyz0x6YCJGqLtH9YP0EjEk4haZS_gge56Vc6tafnK3dnb8xXzJdeFlgxF4gynmTWCONaXwirEEFrCUyvww-znvLzlVDZ4yUCLG4k6uBA3ZVV8MsWfMhZ0u_l-NZECa-ROJhRWC0fiOTmH194rzhyGFQolUtjfV7Y26EZquEYYqt0nd7xDbcV1lx7ZtFkaBf8GVnWKxmNuFK8eKmsp-u8NM3_WDLHawBSFlVmFVpkoSZdRbXzV-ma4U6TRqco_rVEHT4rYRu5FO9VYPpXHbMiJ-ZDmRH1DFNtyQM2rEkV-7bplUiYKYb0SqY-AP9HJV7xMRDjlt" _blank

{{< /mermaid >}}

Схема 2. Методи створення діаграм.

### В тексті {#inline}

На схемі 3 показано кроки для додавання діаграми за допомогою методу Inline.

{{< mermaid >}}
graph LR
A[1. Використовуйте онлайн редактор<br>для створення/редагування<br>діаграм] -->
B[2. Збережіть<br>URL діаграми] -->
C[3. Скопіюйте код Mermaid<br>у ваш файл markdown] -->
D[4. Додайте підпис]

    classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
    class A,B,C,D box

%% ви можете додавати гіперпосилання на вузли діаграми Mermaid за допомогою операторів click

click A "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNpVkc1OwkAUhV9lMm6LgrqqhoQfd7jBuGpZDO1UGtoOaUvAEBIEFy6MJMbg2jdQBMOPwCvceSPvFDDaJu29d875cmamQy1hc6rTm5A1aqRUNoOckTkk8AwzWMBa9mAm72Qf1jCWA5hjNSXYrGAJ7zCHFUHFFCbYLJRK9s6rYRb7pRySxDhOIFN0rOTw6Ff9ibQx_pPx1iNHybyH3-8KSaWyZpA3jjHLK3zANHF-yZHsy0elvy6XyH8PzHaugnGCrjeVHzboeNrnVoMJueShz1xbQeSAqBTygcj7ZD9L4rOwbotWsGMVjVNkvSijEmw5CMV2o46mYgbqJfhYHouiIndIVbSJ43qefuA4jhbFoahz_SCdTu_qVMu145qeabQ1S3giTNbO_kBITstrBa2oSFSj_jYw3lJHiUwa17jPTapjaXOHNb3YpGbQRWmzYbOYX9huLEKqO8yLuEZZMxZXt4FF9Ths8r2o6DK8dH-n6v4AeRf_cQ" _blank

click B "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNpVkc1OwkAUhV9lMm6LgrqqhoQfd7jBuGpZDO1UGtoOaUvAEBIEFy6MJMbg2jdQBMOPwCvceSPvFDDaJu29d875cmamQy1hc6rTm5A1aqRUNoOckTkk8AwzWMBa9mAm72Qf1jCWA5hjNSXYrGAJ7zCHFUHFFCbYLJRK9s6rYRb7pRySxDhOIFN0rOTw6Ff9ibQx_pPx1iNHybyH3-8KSaWyZpA3jjHLK3zANHF-yZHsy0elvy6XyH8PzHaugnGCrjeVHzboeNrnVoMJueShz1xbQeSAqBTygcj7ZD9L4rOwbotWsGMVjVNkvSijEmw5CMV2o46mYgbqJfhYHouiIndIVbSJ43qefuA4jhbFoahz_SCdTu_qVMu145qeabQ1S3giTNbO_kBITstrBa2oSFSj_jYw3lJHiUwa17jPTapjaXOHNb3YpGbQRWmzYbOYX9huLEKqO8yLuEZZMxZXt4FF9Ths8r2o6DK8dH-n6v4AeRf_cQ" _blank

click C "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNpVkc1OwkAUhV9lMm6LgrqqhoQfd7jBuGpZDO1UGtoOaUvAEBIEFy6MJMbg2jdQBMOPwCvceSPvFDDaJu29d875cmamQy1hc6rTm5A1aqRUNoOckTkk8AwzWMBa9mAm72Qf1jCWA5hjNSXYrGAJ7zCHFUHFFCbYLJRK9s6rYRb7pRySxDhOIFN0rOTw6Ff9ibQx_pPx1iNHybyH3-8KSaWyZpA3jjHLK3zANHF-yZHsy0elvy6XyH8PzHaugnGCrjeVHzboeNrnVoMJueShz1xbQeSAqBTygcj7ZD9L4rOwbotWsGMVjVNkvSijEmw5CMV2o46mYgbqJfhYHouiIndIVbSJ43qefuA4jhbFoahz_SCdTu_qVMu145qeabQ1S3giTNbO_kBITstrBa2oSFSj_jYw3lJHiUwa17jPTapjaXOHNb3YpGbQRWmzYbOYX9huLEKqO8yLuEZZMxZXt4FF9Ths8r2o6DK8dH-n6v4AeRf_cQ" _blank

click D "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNpVkc1OwkAUhV9lMm6LgrqqhoQfd7jBuGpZDO1UGtoOaUvAEBIEFy6MJMbg2jdQBMOPwCvceSPvFDDaJu29d875cmamQy1hc6rTm5A1aqRUNoOckTkk8AwzWMBa9mAm72Qf1jCWA5hjNSXYrGAJ7zCHFUHFFCbYLJRK9s6rYRb7pRySxDhOIFN0rOTw6Ff9ibQx_pPx1iNHybyH3-8KSaWyZpA3jjHLK3zANHF-yZHsy0elvy6XyH8PzHaugnGCrjeVHzboeNrnVoMJueShz1xbQeSAqBTygcj7ZD9L4rOwbotWsGMVjVNkvSijEmw5CMV2o46mYgbqJfhYHouiIndIVbSJ43qefuA4jhbFoahz_SCdTu_qVMu145qeabQ1S3giTNbO_kBITstrBa2oSFSj_jYw3lJHiUwa17jPTapjaXOHNb3YpGbQRWmzYbOYX9huLEKqO8yLuEZZMxZXt4FF9Ths8r2o6DK8dH-n6v4AeRf_cQ" _blank

{{< /mermaid >}}

Схема 3. Кроки метода inline

Ось перелік кроків, які слід виконати для додавання діаграми за допомогою методу Inline:

1. Створіть вашу діаграму за допомогою онлайн редактора.
2. Збережіть URL діаграми для подальшого доступу.
3. Скопіюйте код Mermaid у місце в вашому файлі `.md` туди, де ви хочете, щоб зʼявилася діаграма.
4. Додайте підпис під діаграмою, використовуючи текст Markdown.

Під час побудови Hugo виконується код Mermaid і перетворюється на діаграму.

{{< note >}}
Вам може здатися, що відстеження URL-адрес діаграм є громіздким. У такому випадку зробіть примітку у файлі `.md`, що код Mermaid самодокументується. Учасники можуть копіювати код Mermaid до та з онлайн редактора для редагування діаграм.
{{< /note >}}

Ось приклад фрагмента коду, що міститься у файлі `.md`:

```md
---
title: My PR
---
Figure 17 shows a simple A to B process.
some markdown text
...
{{</* mermaid */>}}
    graph TB
    A --> B
{{</* /mermaid */>}}

Figure 17. A to B
more text
```

{{< note >}}
Необхідно включити теґи Hugo Mermaid shortcode на початку та в кінці блоку коду Mermaid. Під діаграмою слід додати підпис.
{{< /note >}}

Для отримання додаткової інформації про підписи до діаграм, дивіться [Як використовувати підписи](#how-to-use-captions).

Нижче наведено переваги методу Inline:

* Використання онлайн редактора.
* Легко копіювати код Mermaid до та з онлайн редактора та вашого файлу `.md`.
* Відсутність необхідності окремої обробки файлів зображень `.svg`.
* Текст контенту, код діаграми та підпис до діаграми знаходяться в одному файлі `.md`.

Ви повинні використовувати [локальний](/docs/contribute/new-content/open-a-pr/#preview-locally) та Netlify попередній перегляд для перевірки правильного показу діаграми.

{{< caution >}}
Набір функцій в онлайн редакторі Mermaid може не підтримувати набір функцій Mermaid в проєкті [kubernetes/website](https://github.com/kubernetes/website). Також слід зазначити, що учасники можуть згадувати `kubernetes/website` як `k/website`. Якщо ви бачите синтаксичну помилку або пустий екран після побудови Hugo, розгляньте можливість використання методу Mermaid+SVG.
{{< /caution >}}

### Mermaid+SVG {#mermaid-svg}

На схемі 4 показано кроки для додавання діаграми за допомогою методу Mermaid+SVG.

{{< mermaid >}}

flowchart LR
A[1. Використовуйте онлайн<br> редактор для<br> створеня/редагування діаграми]
B[2. Збережіть<br>URL діаграми]
C[3. Згенеруйте файл .svg та<br>завантажте його до теки images/ ]
subgraph w[ ]
direction TB
D[4. Використовуйте<br>shortcode figure<br>для використання файла<br> .svg у файлі .md] -->
E[5. Додайте підпис]
end
A --> B
B --> C
C --> w

    classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
    class A,B,C,D,E,w box

%% ви можете додавати гіперпосилання на вузли діаграми Mermaid за допомогою операторів click

click A "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp9Ustu2zAQ_BWCucqO08dFLQLEj1tOaXsSc6AlyhIqkQZF1SmCAG7SY4EAReD-RhrHrR3Xzi8s_6hLxjZaoKgO0u5yZnd2qHMaq0TQkKaFGsUZ14YcnzB5FB00CXyFOTzA2o5hbj_ZS1jDnb2CBUYzgskKlnALC1i97utDgqgZ3GPhwSHtmGCytNdPZ1u2w6zs9f4OPMWGd_hduTJS7MQXx_j-BfNTJtvRM1TyDb7DzJN-2Im9tF9c23cnx_9idKLnnjF1sxxrp9l-9nqXpFl9GBAs3bo28BOrXoOr4AC_3gL1TmHttlg76AydmJO85ANR7RMcU9X9gebDjIwilya5FrHJlSRv20x2oxf_988NrjKljbOfpPmg1sKL8aYR1PM3devQdoUn6ZtFrnZlOyHNMjkljcYhk73oJYq4wbHO6c21PaJf9_Do2qJqIRO8bAcnqLrtgw5a6IMRk0wSfOKCV1VXpKSvzlBrUYR7aZoGldHqvQj3Wq3WJm6M8sRk4cHwLIhVobQ_e_VHE3IUtINO0A16wch1owEthS55nuAveO6AjJpMlILREMNEpLwuDKNMXiC0HibciF6SG6VpmPKiEgHltVFvPsqYhkbXYgvq5hxvp9ygLn4DXER0IQ" _blank

click B "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp9Ustu2zAQ_BWCucqO08dFLQLEj1tOaXsSc6AlyhIqkQZF1SmCAG7SY4EAReD-RhrHrR3Xzi8s_6hLxjZaoKgO0u5yZnd2qHMaq0TQkKaFGsUZ14YcnzB5FB00CXyFOTzA2o5hbj_ZS1jDnb2CBUYzgskKlnALC1i97utDgqgZ3GPhwSHtmGCytNdPZ1u2w6zs9f4OPMWGd_hduTJS7MQXx_j-BfNTJtvRM1TyDb7DzJN-2Im9tF9c23cnx_9idKLnnjF1sxxrp9l-9nqXpFl9GBAs3bo28BOrXoOr4AC_3gL1TmHttlg76AydmJO85ANR7RMcU9X9gebDjIwilya5FrHJlSRv20x2oxf_988NrjKljbOfpPmg1sKL8aYR1PM3devQdoUn6ZtFrnZlOyHNMjkljcYhk73oJYq4wbHO6c21PaJf9_Do2qJqIRO8bAcnqLrtgw5a6IMRk0wSfOKCV1VXpKSvzlBrUYR7aZoGldHqvQj3Wq3WJm6M8sRk4cHwLIhVobQ_e_VHE3IUtINO0A16wch1owEthS55nuAveO6AjJpMlILREMNEpLwuDKNMXiC0HibciF6SG6VpmPKiEgHltVFvPsqYhkbXYgvq5hxvp9ygLn4DXER0IQ" _blank

click C "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp9Ustu2zAQ_BWCucqO08dFLQLEj1tOaXsSc6AlyhIqkQZF1SmCAG7SY4EAReD-RhrHrR3Xzi8s_6hLxjZaoKgO0u5yZnd2qHMaq0TQkKaFGsUZ14YcnzB5FB00CXyFOTzA2o5hbj_ZS1jDnb2CBUYzgskKlnALC1i97utDgqgZ3GPhwSHtmGCytNdPZ1u2w6zs9f4OPMWGd_hduTJS7MQXx_j-BfNTJtvRM1TyDb7DzJN-2Im9tF9c23cnx_9idKLnnjF1sxxrp9l-9nqXpFl9GBAs3bo28BOrXoOr4AC_3gL1TmHttlg76AydmJO85ANR7RMcU9X9gebDjIwilya5FrHJlSRv20x2oxf_988NrjKljbOfpPmg1sKL8aYR1PM3devQdoUn6ZtFrnZlOyHNMjkljcYhk73oJYq4wbHO6c21PaJf9_Do2qJqIRO8bAcnqLrtgw5a6IMRk0wSfOKCV1VXpKSvzlBrUYR7aZoGldHqvQj3Wq3WJm6M8sRk4cHwLIhVobQ_e_VHE3IUtINO0A16wch1owEthS55nuAveO6AjJpMlILREMNEpLwuDKNMXiC0HibciF6SG6VpmPKiEgHltVFvPsqYhkbXYgvq5hxvp9ygLn4DXER0IQ" _blank

click D "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp9Ustu2zAQ_BWCucqO08dFLQLEj1tOaXsSc6AlyhIqkQZF1SmCAG7SY4EAReD-RhrHrR3Xzi8s_6hLxjZaoKgO0u5yZnd2qHMaq0TQkKaFGsUZ14YcnzB5FB00CXyFOTzA2o5hbj_ZS1jDnb2CBUYzgskKlnALC1i97utDgqgZ3GPhwSHtmGCytNdPZ1u2w6zs9f4OPMWGd_hduTJS7MQXx_j-BfNTJtvRM1TyDb7DzJN-2Im9tF9c23cnx_9idKLnnjF1sxxrp9l-9nqXpFl9GBAs3bo28BOrXoOr4AC_3gL1TmHttlg76AydmJO85ANR7RMcU9X9gebDjIwilya5FrHJlSRv20x2oxf_988NrjKljbOfpPmg1sKL8aYR1PM3devQdoUn6ZtFrnZlOyHNMjkljcYhk73oJYq4wbHO6c21PaJf9_Do2qJqIRO8bAcnqLrtgw5a6IMRk0wSfOKCV1VXpKSvzlBrUYR7aZoGldHqvQj3Wq3WJm6M8sRk4cHwLIhVobQ_e_VHE3IUtINO0A16wch1owEthS55nuAveO6AjJpMlILREMNEpLwuDKNMXiC0HibciF6SG6VpmPKiEgHltVFvPsqYhkbXYgvq5hxvp9ygLn4DXER0IQ" _blank

click E "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp9Ustu2zAQ_BWCucqO08dFLQLEj1tOaXsSc6AlyhIqkQZF1SmCAG7SY4EAReD-RhrHrR3Xzi8s_6hLxjZaoKgO0u5yZnd2qHMaq0TQkKaFGsUZ14YcnzB5FB00CXyFOTzA2o5hbj_ZS1jDnb2CBUYzgskKlnALC1i97utDgqgZ3GPhwSHtmGCytNdPZ1u2w6zs9f4OPMWGd_hduTJS7MQXx_j-BfNTJtvRM1TyDb7DzJN-2Im9tF9c23cnx_9idKLnnjF1sxxrp9l-9nqXpFl9GBAs3bo28BOrXoOr4AC_3gL1TmHttlg76AydmJO85ANR7RMcU9X9gebDjIwilya5FrHJlSRv20x2oxf_988NrjKljbOfpPmg1sKL8aYR1PM3devQdoUn6ZtFrnZlOyHNMjkljcYhk73oJYq4wbHO6c21PaJf9_Do2qJqIRO8bAcnqLrtgw5a6IMRk0wSfOKCV1VXpKSvzlBrUYR7aZoGldHqvQj3Wq3WJm6M8sRk4cHwLIhVobQ_e_VHE3IUtINO0A16wch1owEthS55nuAveO6AjJpMlILREMNEpLwuDKNMXiC0HibciF6SG6VpmPKiEgHltVFvPsqYhkbXYgvq5hxvp9ygLn4DXER0IQ" _blank

{{< /mermaid >}}

Схема 4. Кроки методу Mermaid+SVG

Нижче наведено кроки, які слід виконати для додавання діаграми за допомогою методу Mermaid+SVG:

1. Створіть діаграму за допомогою онлайн редактора.
2. Збережіть URL діаграми для подальшого доступу.
3. Згенеруйте файл зображення `.svg` для діаграми та завантажте його до відповідної теки `images/`.
4. Використовуйте shortcode `{{</* figure */>}}` для посилання на діаграму у файлі `.md`.
5. Додайте підпис за допомогою параметра `caption` у shortcode `{{</* figure */>}}`.

Наприклад, використовуйте онлайн редактор для створення діаграми з назвою `boxnet`. Збережіть URL діаграми для подальшого доступу. Згенеруйте та завантажте файл `boxnet.svg` до відповідної теки `../images/`.

Використовуйте shortcode `{{</* figure */>}}` у файлі `.md` вашого PR, щоб посилатися на файл зображення `.svg` та додати підпис.

```json
{{</* figure src="/static/images/boxnet.svg" alt="Boxnet figure" class="diagram-large" caption="Figure 14. Boxnet caption" */>}}
```

Для отримання додаткової інформації про підписи до діаграм дивіться [Як використовувати підписи](#how-to-use-captions).

{{< note >}}
Shortcode "\{\{< figure >}}" є рекомендованим методом для додавання файлів зображень `.svg` до вашої документації. Ви також можете використовувати стандартний Markdown синтаксис додавання зображеннь, наприклад: `![my boxnet diagram](static/images/boxnet.svg)`. Але вам потрібно додати підпис під діаграмою.
{{< /note >}}

Ви повинні додати URL онлйн редактора як коментар у файлі зображення `.svg`, використовуючи текстовий редактор. Наприклад, ви б включили наступне на початку файлу зображення `.svg`:

```none
<!-- Щоб переглянути або редагувати код Mermaid, використовуйте наступний URL: -->
<!-- https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb ... <продовження рядка URL> -->
```

Нижче наведено переваги методу Mermaid+SVG:

* Використання інструменту онлайн редактора.
* Інструмент онлайн редактора підтримує найсучасніший набір функцій Mermaid.
* Використання існуючих методів [kubernetes/website](https://github.com/kubernetes/website) для обробки файлів зображень `.svg`.
* Середовище не вимагає підтримки Mermaid.

Переконайтеся, що ваша діаграма правильно відображається, використовуючи [локальний](/docs/contribute/new-content/open-a-pr/#preview-locally) та Netlify попередній перегляд.

### Зовнішні інструменти {#extrenal-tool}

На схемі 5 показано кроки, яких слід дотримуватися для додавання діаграми за допомогою зовнішнього інструменту.

Спочатку створіть діаграму за допомогою зовнішнього інструменту і збережіть її як файл зображення у форматі `.svg` або `.png`. Після цього виконайте ті самі кроки, що й у методі __Mermaid+SVG__ для додавання файлів зображень у форматі `.svg`.

{{< mermaid >}}
flowchart LR
A[1. Використовуйте pjdysusq<br> редактор для<br> стовреня/редагування діаграми]
B[2. Якщо можливо, збережіть<br> координати діаграми<br>для доступу учасників]
C[3. Згенеруйте файл .svg та<br>завантажте його до теки images/ ]
subgraph w[ ]
direction TB
D[4. Використовуйте<br>shortcode figure<br>для використання файла<br> .svg у файлі .md] -->
E[5. Додайте підпис]
end
A --> B
B --> C
C --> w

    classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
    class A,B,C,D,E,w box

click A "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp9kttu00AQhl9ltb110pTDjUGVmsMdV8Cd3QvHXicGH8J6TVpVldIGCSEhVUIoPAYhbdq0Je4rzL4R_zoHVSCRC2d2_M8_38z6hPtZILjNwzgb-n1PKvbqtZseOHt1Rt9oQXdU6hEt9Jk-p5Jmeky3iOZs8C44zov8w8uu3GdQzOmKpnRnVHrEcLjXF6t3m0qjWeqL3a34EmYz_C9NGiV6UiVHeP6mxaGbNp0noPgJ1y9UMiRLuqZ7QM2otBjd0C-aV27XeqLP9deqnyGumK8gXNIU3Rf_mBvlitGgloYRMA96zPRYf0bRGUoxPKpmAGk5TwHygy7NCKbndg36Ewxv6Z7V8489htS0sr5BthrNZIBnpJCVcCirjkY6B-qCRYnXE_kuQ5u86PakN-izoWOOQSSFr6IsZW-bbtp2nv3_SkzjvJ9JZW6UhVGvkOLxnLO_SjeL34ywQl8PMt6m9YTVk-CQ1Wr7btpxngPiO9qaC1ytAGub4PhgbEEt0gDfj5EzUDeroIUVVsHQTd2U4efHXp63Rci62RFY49jeCcPQypXM3gt7p9ForOPaMApU394bHFl-FmeyevfikQk7sJpWy2pbHWto3LjFEyETLwrwVZ8YoctVXyTC5TbCQIReESuXu-kppMUg8JToBJHKJLdDL86Fxb1CZW-OU5_bShZiI2pHHm4nWatO_wCdOqqx"

click B "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp9kttu00AQhl9ltb110pTDjUGVmsMdV8Cd3QvHXicGH8J6TVpVldIGCSEhVUIoPAYhbdq0Je4rzL4R_zoHVSCRC2d2_M8_38z6hPtZILjNwzgb-n1PKvbqtZseOHt1Rt9oQXdU6hEt9Jk-p5Jmeky3iOZs8C44zov8w8uu3GdQzOmKpnRnVHrEcLjXF6t3m0qjWeqL3a34EmYz_C9NGiV6UiVHeP6mxaGbNp0noPgJ1y9UMiRLuqZ7QM2otBjd0C-aV27XeqLP9deqnyGumK8gXNIU3Rf_mBvlitGgloYRMA96zPRYf0bRGUoxPKpmAGk5TwHygy7NCKbndg36Ewxv6Z7V8489htS0sr5BthrNZIBnpJCVcCirjkY6B-qCRYnXE_kuQ5u86PakN-izoWOOQSSFr6IsZW-bbtp2nv3_SkzjvJ9JZW6UhVGvkOLxnLO_SjeL34ywQl8PMt6m9YTVk-CQ1Wr7btpxngPiO9qaC1ytAGub4PhgbEEt0gDfj5EzUDeroIUVVsHQTd2U4efHXp63Rci62RFY49jeCcPQypXM3gt7p9ForOPaMApU394bHFl-FmeyevfikQk7sJpWy2pbHWto3LjFEyETLwrwVZ8YoctVXyTC5TbCQIReESuXu-kppMUg8JToBJHKJLdDL86Fxb1CZW-OU5_bShZiI2pHHm4nWatO_wCdOqqx"

click C "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp9kttu00AQhl9ltb110pTDjUGVmsMdV8Cd3QvHXicGH8J6TVpVldIGCSEhVUIoPAYhbdq0Je4rzL4R_zoHVSCRC2d2_M8_38z6hPtZILjNwzgb-n1PKvbqtZseOHt1Rt9oQXdU6hEt9Jk-p5Jmeky3iOZs8C44zov8w8uu3GdQzOmKpnRnVHrEcLjXF6t3m0qjWeqL3a34EmYz_C9NGiV6UiVHeP6mxaGbNp0noPgJ1y9UMiRLuqZ7QM2otBjd0C-aV27XeqLP9deqnyGumK8gXNIU3Rf_mBvlitGgloYRMA96zPRYf0bRGUoxPKpmAGk5TwHygy7NCKbndg36Ewxv6Z7V8489htS0sr5BthrNZIBnpJCVcCirjkY6B-qCRYnXE_kuQ5u86PakN-izoWOOQSSFr6IsZW-bbtp2nv3_SkzjvJ9JZW6UhVGvkOLxnLO_SjeL34ywQl8PMt6m9YTVk-CQ1Wr7btpxngPiO9qaC1ytAGub4PhgbEEt0gDfj5EzUDeroIUVVsHQTd2U4efHXp63Rci62RFY49jeCcPQypXM3gt7p9ForOPaMApU394bHFl-FmeyevfikQk7sJpWy2pbHWto3LjFEyETLwrwVZ8YoctVXyTC5TbCQIReESuXu-kppMUg8JToBJHKJLdDL86Fxb1CZW-OU5_bShZiI2pHHm4nWatO_wCdOqqx"

click D "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp9kttu00AQhl9ltb110pTDjUGVmsMdV8Cd3QvHXicGH8J6TVpVldIGCSEhVUIoPAYhbdq0Je4rzL4R_zoHVSCRC2d2_M8_38z6hPtZILjNwzgb-n1PKvbqtZseOHt1Rt9oQXdU6hEt9Jk-p5Jmeky3iOZs8C44zov8w8uu3GdQzOmKpnRnVHrEcLjXF6t3m0qjWeqL3a34EmYz_C9NGiV6UiVHeP6mxaGbNp0noPgJ1y9UMiRLuqZ7QM2otBjd0C-aV27XeqLP9deqnyGumK8gXNIU3Rf_mBvlitGgloYRMA96zPRYf0bRGUoxPKpmAGk5TwHygy7NCKbndg36Ewxv6Z7V8489htS0sr5BthrNZIBnpJCVcCirjkY6B-qCRYnXE_kuQ5u86PakN-izoWOOQSSFr6IsZW-bbtp2nv3_SkzjvJ9JZW6UhVGvkOLxnLO_SjeL34ywQl8PMt6m9YTVk-CQ1Wr7btpxngPiO9qaC1ytAGub4PhgbEEt0gDfj5EzUDeroIUVVsHQTd2U4efHXp63Rci62RFY49jeCcPQypXM3gt7p9ForOPaMApU394bHFl-FmeyevfikQk7sJpWy2pbHWto3LjFEyETLwrwVZ8YoctVXyTC5TbCQIReESuXu-kppMUg8JToBJHKJLdDL86Fxb1CZW-OU5_bShZiI2pHHm4nWatO_wCdOqqx"

click E "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp9kttu00AQhl9ltb110pTDjUGVmsMdV8Cd3QvHXicGH8J6TVpVldIGCSEhVUIoPAYhbdq0Je4rzL4R_zoHVSCRC2d2_M8_38z6hPtZILjNwzgb-n1PKvbqtZseOHt1Rt9oQXdU6hEt9Jk-p5Jmeky3iOZs8C44zov8w8uu3GdQzOmKpnRnVHrEcLjXF6t3m0qjWeqL3a34EmYz_C9NGiV6UiVHeP6mxaGbNp0noPgJ1y9UMiRLuqZ7QM2otBjd0C-aV27XeqLP9deqnyGumK8gXNIU3Rf_mBvlitGgloYRMA96zPRYf0bRGUoxPKpmAGk5TwHygy7NCKbndg36Ewxv6Z7V8489htS0sr5BthrNZIBnpJCVcCirjkY6B-qCRYnXE_kuQ5u86PakN-izoWOOQSSFr6IsZW-bbtp2nv3_SkzjvJ9JZW6UhVGvkOLxnLO_SjeL34ywQl8PMt6m9YTVk-CQ1Wr7btpxngPiO9qaC1ytAGub4PhgbEEt0gDfj5EzUDeroIUVVsHQTd2U4efHXp63Rci62RFY49jeCcPQypXM3gt7p9ForOPaMApU394bHFl-FmeyevfikQk7sJpWy2pbHWto3LjFEyETLwrwVZ8YoctVXyTC5TbCQIReESuXu-kppMUg8JToBJHKJLdDL86Fxb1CZW-OU5_bShZiI2pHHm4nWatO_wCdOqqx"

{{< /mermaid >}}

Схема 5. Кроки методу з використання зовнішнього інструменту

Нижче наведено кроки, які слід виконати для додавання діаграми за допомогою методу External Tool:

1. Використовуйте зовнішній інструмент для створення діаграми.
2. Збережіть координати діаграми для доступу інших учасників. Наприклад, ваш інструмент може надати посилання на зображення діаграми, або ви можете зберегти файл з вихідним кодом, такий як `.xml`, у публічному репозиторії для подальшого доступу інших учасників.
3. Згенеруйте та збережіть діаграму у вигляді файлу зображення `.svg` або `.png`. Завантажте цей файл у відповідну теку `../images/`.
4. Використовуйте shortcode `{{</* figure */>}}` для посилання на діаграму у файлі `.md`.
5. Додайте підпис за допомогою параметра `caption` у shortcode `{{</* figure */>}}`.

Ось приклад використання shortcode `{{</* figure */>}}` для діаграми `images/apple.svg`:

```text
{{</* figure src="/static/images/apple.svg" alt="red-apple-figure" class="diagram-large" caption="Figure 9. A Big Red Apple" */>}}
```

Якщо ваш зовнішній інструмент малювання дозволяє:

* Ви можете включати кілька логотипів `.svg` або `.png`, іконок та зображень у свою діаграму. Однак, переконайтеся, що ви дотримуєтеся авторських прав і дотримуєтесь [керівництва](/docs/contribute/style/content-guide/) Kubernetes щодо використання контенту третіх сторін.
* Ви повинні зберегти координати діаграми для подальшого доступу інших учасників. Наприклад, ваш інструмент може надати посилання на зображення діаграми, або ви можете зберегти файл з вихідним кодом, наприклад `.xml`, для доступу інших учасників.

Для отримання додаткової інформації про логотипи та зображення K8s і CNCF, зверніться до розділу [CNCF Artwork](https://github.com/cncf/artwork).

Нижче наведено переваги методу External Tool:

* Учасники добре знайомі з зовнішнім інструментом.
* Діаграми потребують більше деталей, ніж може надати Mermaid.

Не забудьте перевірити, чи правильно відображається ваша діаграма, використовуючи [локальний](/docs/contribute/new-content/open-a-pr/#preview-locally) та Netlify попередній перегляд.

## Приклади {#examples}

У цьому розділі показано декілька прикладів діаграм Mermaid.

{{< note >}}
У прикладах блоків коду не використано теґ Hugo Mermaid. Це дозволяє вам скопіювати блок коду до онлайн редактора щоб поекспериментувати на власний розсуд. Зверніть увагу, що редактор не розпізнає Hugo shortcodes.
{{< /note >}}

### Приклад 1 — Обмеження на поширення топології Podʼів {#example-1-pod-topology-spread-constraints}

Схема 6 показує діаграму зі сторінки [Обмеження на поширення топології Podʼів](/docs/concepts/scheduling-eviction/topology-spread-constraints/#node-labels)

{{< mermaid >}}
    graph TB
    subgraph "zoneB"
    n3(Node3)
    n4(Node4)
    end
    subgraph "zoneA"
    n1(Node1)
    n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4 k8s;
    class zoneA,zoneB cluster;

click n3 "https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZ3JhcGggVEJcbiAgICBzdWJncmFwaCBcInpvbmVCXCJcbiAgICAgICAgbjMoTm9kZTMpXG4gICAgICAgIG40KE5vZGU0KVxuICAgIGVuZFxuICAgIHN1YmdyYXBoIFwiem9uZUFcIlxuICAgICAgICBuMShOb2RlMSlcbiAgICAgICAgbjIoTm9kZTIpXG4gICAgZW5kXG5cbiAgICBjbGFzc0RlZiBwbGFpbiBmaWxsOiNkZGQsc3Ryb2tlOiNmZmYsc3Ryb2tlLXdpZHRoOjRweCxjb2xvcjojMDAwO1xuICAgIGNsYXNzRGVmIGs4cyBmaWxsOiMzMjZjZTUsc3Ryb2tlOiNmZmYsc3Ryb2tlLXdpZHRoOjRweCxjb2xvcjojZmZmO1xuICAgIGNsYXNzRGVmIGNsdXN0ZXIgZmlsbDojZmZmLHN0cm9rZTojYmJiLHN0cm9rZS13aWR0aDoycHgsY29sb3I6IzMyNmNlNTtcbiAgICBjbGFzcyBuMSxuMixuMyxuNCBrOHM7XG4gICAgY2xhc3Mgem9uZUEsem9uZUIgY2x1c3RlcjtcbiIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkZWZhdWx0XCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6dHJ1ZX0" _blank

click n4 "https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZ3JhcGggVEJcbiAgICBzdWJncmFwaCBcInpvbmVCXCJcbiAgICAgICAgbjMoTm9kZTMpXG4gICAgICAgIG40KE5vZGU0KVxuICAgIGVuZFxuICAgIHN1YmdyYXBoIFwiem9uZUFcIlxuICAgICAgICBuMShOb2RlMSlcbiAgICAgICAgbjIoTm9kZTIpXG4gICAgZW5kXG5cbiAgICBjbGFzc0RlZiBwbGFpbiBmaWxsOiNkZGQsc3Ryb2tlOiNmZmYsc3Ryb2tlLXdpZHRoOjRweCxjb2xvcjojMDAwO1xuICAgIGNsYXNzRGVmIGs4cyBmaWxsOiMzMjZjZTUsc3Ryb2tlOiNmZmYsc3Ryb2tlLXdpZHRoOjRweCxjb2xvcjojZmZmO1xuICAgIGNsYXNzRGVmIGNsdXN0ZXIgZmlsbDojZmZmLHN0cm9rZTojYmJiLHN0cm9rZS13aWR0aDoycHgsY29sb3I6IzMyNmNlNTtcbiAgICBjbGFzcyBuMSxuMixuMyxuNCBrOHM7XG4gICAgY2xhc3Mgem9uZUEsem9uZUIgY2x1c3RlcjtcbiIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkZWZhdWx0XCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6dHJ1ZX0" _blank

click n1 "https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZ3JhcGggVEJcbiAgICBzdWJncmFwaCBcInpvbmVCXCJcbiAgICAgICAgbjMoTm9kZTMpXG4gICAgICAgIG40KE5vZGU0KVxuICAgIGVuZFxuICAgIHN1YmdyYXBoIFwiem9uZUFcIlxuICAgICAgICBuMShOb2RlMSlcbiAgICAgICAgbjIoTm9kZTIpXG4gICAgZW5kXG5cbiAgICBjbGFzc0RlZiBwbGFpbiBmaWxsOiNkZGQsc3Ryb2tlOiNmZmYsc3Ryb2tlLXdpZHRoOjRweCxjb2xvcjojMDAwO1xuICAgIGNsYXNzRGVmIGs4cyBmaWxsOiMzMjZjZTUsc3Ryb2tlOiNmZmYsc3Ryb2tlLXdpZHRoOjRweCxjb2xvcjojZmZmO1xuICAgIGNsYXNzRGVmIGNsdXN0ZXIgZmlsbDojZmZmLHN0cm9rZTojYmJiLHN0cm9rZS13aWR0aDoycHgsY29sb3I6IzMyNmNlNTtcbiAgICBjbGFzcyBuMSxuMixuMyxuNCBrOHM7XG4gICAgY2xhc3Mgem9uZUEsem9uZUIgY2x1c3RlcjtcbiIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkZWZhdWx0XCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6dHJ1ZX0" _blank

click n2 "https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZ3JhcGggVEJcbiAgICBzdWJncmFwaCBcInpvbmVCXCJcbiAgICAgICAgbjMoTm9kZTMpXG4gICAgICAgIG40KE5vZGU0KVxuICAgIGVuZFxuICAgIHN1YmdyYXBoIFwiem9uZUFcIlxuICAgICAgICBuMShOb2RlMSlcbiAgICAgICAgbjIoTm9kZTIpXG4gICAgZW5kXG5cbiAgICBjbGFzc0RlZiBwbGFpbiBmaWxsOiNkZGQsc3Ryb2tlOiNmZmYsc3Ryb2tlLXdpZHRoOjRweCxjb2xvcjojMDAwO1xuICAgIGNsYXNzRGVmIGs4cyBmaWxsOiMzMjZjZTUsc3Ryb2tlOiNmZmYsc3Ryb2tlLXdpZHRoOjRweCxjb2xvcjojZmZmO1xuICAgIGNsYXNzRGVmIGNsdXN0ZXIgZmlsbDojZmZmLHN0cm9rZTojYmJiLHN0cm9rZS13aWR0aDoycHgsY29sb3I6IzMyNmNlNTtcbiAgICBjbGFzcyBuMSxuMixuMyxuNCBrOHM7XG4gICAgY2xhc3Mgem9uZUEsem9uZUIgY2x1c3RlcjtcbiIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkZWZhdWx0XCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6dHJ1ZX0" _blank

{{< /mermaid >}}

Схема 6. Обмеження поширення топології Podʼів

Код:

```text
graph TB
   subgraph "zoneB"
       n3(Node3)
       n4(Node4)
   end
   subgraph "zoneA"
       n1(Node1)
       n2(Node2)
   end

   classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
   classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
   classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
   class n1,n2,n3,n4 k8s;
   class zoneA,zoneB cluster;
```

### Приклад 2 – Ingress {#example-2-ingress}

Схема 7 показує діаграму, що зʼявляється на сторінці [Що таке Ingress](/docs/concepts/services-networking/ingress/#what-is-ingress).

{{< mermaid >}}
graph LR;
client([client])-. Ingress-managed <br> load balancer .->ingress[Ingress];
ingress-->|routing rule|service[Service];
subgraph cluster
ingress;
service-->pod1[Pod];
service-->pod2[Pod];
end
classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class ingress,service,pod1,pod2 k8s;
class client plain;
class cluster cluster;

click client "https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZ3JhcGggIExSXG4gIGNsaWVudChbY2xpZW50XSktLiBJbmdyZXNzLW1hbmFnZWQgPGJyPiBsb2FkIGJhbGFuY2VyIC4tPmluZ3Jlc3NbSW5ncmVzc107XG4gIGluZ3Jlc3MtLT58cm91dGluZyBydWxlfHNlcnZpY2VbU2VydmljZV07XG4gIHN1YmdyYXBoIGNsdXN0ZXJcbiAgaW5ncmVzcztcbiAgc2VydmljZS0tPnBvZDFbUG9kXTtcbiAgc2VydmljZS0tPnBvZDJbUG9kXTtcbiAgZW5kXG4gIGNsYXNzRGVmIHBsYWluIGZpbGw6I2RkZCxzdHJva2U6I2ZmZixzdHJva2Utd2lkdGg6NHB4LGNvbG9yOiMwMDA7XG4gIGNsYXNzRGVmIGs4cyBmaWxsOiMzMjZjZTUsc3Ryb2tlOiNmZmYsc3Ryb2tlLXdpZHRoOjRweCxjb2xvcjojZmZmO1xuICBjbGFzc0RlZiBjbHVzdGVyIGZpbGw6I2ZmZixzdHJva2U6I2JiYixzdHJva2Utd2lkdGg6MnB4LGNvbG9yOiMzMjZjZTU7XG4gIGNsYXNzIGluZ3Jlc3Msc2VydmljZSxwb2QxLHBvZDIgazhzO1xuICBjbGFzcyBjbGllbnQgcGxhaW47XG4gIGNsYXNzIGNsdXN0ZXIgY2x1c3RlcjtcbiIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkZWZhdWx0XCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9" _blank

click ingress "https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZ3JhcGggIExSXG4gIGNsaWVudChbY2xpZW50XSktLiBJbmdyZXNzLW1hbmFnZWQgPGJyPiBsb2FkIGJhbGFuY2VyIC4tPmluZ3Jlc3NbSW5ncmVzc107XG4gIGluZ3Jlc3MtLT58cm91dGluZyBydWxlfHNlcnZpY2VbU2VydmljZV07XG4gIHN1YmdyYXBoIGNsdXN0ZXJcbiAgaW5ncmVzcztcbiAgc2VydmljZS0tPnBvZDFbUG9kXTtcbiAgc2VydmljZS0tPnBvZDJbUG9kXTtcbiAgZW5kXG4gIGNsYXNzRGVmIHBsYWluIGZpbGw6I2RkZCxzdHJva2U6I2ZmZixzdHJva2Utd2lkdGg6NHB4LGNvbG9yOiMwMDA7XG4gIGNsYXNzRGVmIGs4cyBmaWxsOiMzMjZjZTUsc3Ryb2tlOiNmZmYsc3Ryb2tlLXdpZHRoOjRweCxjb2xvcjojZmZmO1xuICBjbGFzc0RlZiBjbHVzdGVyIGZpbGw6I2ZmZixzdHJva2U6I2JiYixzdHJva2Utd2lkdGg6MnB4LGNvbG9yOiMzMjZjZTU7XG4gIGNsYXNzIGluZ3Jlc3Msc2VydmljZSxwb2QxLHBvZDIgazhzO1xuICBjbGFzcyBjbGllbnQgcGxhaW47XG4gIGNsYXNzIGNsdXN0ZXIgY2x1c3RlcjtcbiIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkZWZhdWx0XCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9" _blank

click service "https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZ3JhcGggIExSXG4gIGNsaWVudChbY2xpZW50XSktLiBJbmdyZXNzLW1hbmFnZWQgPGJyPiBsb2FkIGJhbGFuY2VyIC4tPmluZ3Jlc3NbSW5ncmVzc107XG4gIGluZ3Jlc3MtLT58cm91dGluZyBydWxlfHNlcnZpY2VbU2VydmljZV07XG4gIHN1YmdyYXBoIGNsdXN0ZXJcbiAgaW5ncmVzcztcbiAgc2VydmljZS0tPnBvZDFbUG9kXTtcbiAgc2VydmljZS0tPnBvZDJbUG9kXTtcbiAgZW5kXG4gIGNsYXNzRGVmIHBsYWluIGZpbGw6I2RkZCxzdHJva2U6I2ZmZixzdHJva2Utd2lkdGg6NHB4LGNvbG9yOiMwMDA7XG4gIGNsYXNzRGVmIGs4cyBmaWxsOiMzMjZjZTUsc3Ryb2tlOiNmZmYsc3Ryb2tlLXdpZHRoOjRweCxjb2xvcjojZmZmO1xuICBjbGFzc0RlZiBjbHVzdGVyIGZpbGw6I2ZmZixzdHJva2U6I2JiYixzdHJva2Utd2lkdGg6MnB4LGNvbG9yOiMzMjZjZTU7XG4gIGNsYXNzIGluZ3Jlc3Msc2VydmljZSxwb2QxLHBvZDIgazhzO1xuICBjbGFzcyBjbGllbnQgcGxhaW47XG4gIGNsYXNzIGNsdXN0ZXIgY2x1c3RlcjtcbiIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkZWZhdWx0XCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9" _blank

click pod1 "https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZ3JhcGggIExSXG4gIGNsaWVudChbY2xpZW50XSktLiBJbmdyZXNzLW1hbmFnZWQgPGJyPiBsb2FkIGJhbGFuY2VyIC4tPmluZ3Jlc3NbSW5ncmVzc107XG4gIGluZ3Jlc3MtLT58cm91dGluZyBydWxlfHNlcnZpY2VbU2VydmljZV07XG4gIHN1YmdyYXBoIGNsdXN0ZXJcbiAgaW5ncmVzcztcbiAgc2VydmljZS0tPnBvZDFbUG9kXTtcbiAgc2VydmljZS0tPnBvZDJbUG9kXTtcbiAgZW5kXG4gIGNsYXNzRGVmIHBsYWluIGZpbGw6I2RkZCxzdHJva2U6I2ZmZixzdHJva2Utd2lkdGg6NHB4LGNvbG9yOiMwMDA7XG4gIGNsYXNzRGVmIGs4cyBmaWxsOiMzMjZjZTUsc3Ryb2tlOiNmZmYsc3Ryb2tlLXdpZHRoOjRweCxjb2xvcjojZmZmO1xuICBjbGFzc0RlZiBjbHVzdGVyIGZpbGw6I2ZmZixzdHJva2U6I2JiYixzdHJva2Utd2lkdGg6MnB4LGNvbG9yOiMzMjZjZTU7XG4gIGNsYXNzIGluZ3Jlc3Msc2VydmljZSxwb2QxLHBvZDIgazhzO1xuICBjbGFzcyBjbGllbnQgcGxhaW47XG4gIGNsYXNzIGNsdXN0ZXIgY2x1c3RlcjtcbiIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkZWZhdWx0XCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9" _blank

click pod2 "https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZ3JhcGggIExSXG4gIGNsaWVudChbY2xpZW50XSktLiBJbmdyZXNzLW1hbmFnZWQgPGJyPiBsb2FkIGJhbGFuY2VyIC4tPmluZ3Jlc3NbSW5ncmVzc107XG4gIGluZ3Jlc3MtLT58cm91dGluZyBydWxlfHNlcnZpY2VbU2VydmljZV07XG4gIHN1YmdyYXBoIGNsdXN0ZXJcbiAgaW5ncmVzcztcbiAgc2VydmljZS0tPnBvZDFbUG9kXTtcbiAgc2VydmljZS0tPnBvZDJbUG9kXTtcbiAgZW5kXG4gIGNsYXNzRGVmIHBsYWluIGZpbGw6I2RkZCxzdHJva2U6I2ZmZixzdHJva2Utd2lkdGg6NHB4LGNvbG9yOiMwMDA7XG4gIGNsYXNzRGVmIGs4cyBmaWxsOiMzMjZjZTUsc3Ryb2tlOiNmZmYsc3Ryb2tlLXdpZHRoOjRweCxjb2xvcjojZmZmO1xuICBjbGFzc0RlZiBjbHVzdGVyIGZpbGw6I2ZmZixzdHJva2U6I2JiYixzdHJva2Utd2lkdGg6MnB4LGNvbG9yOiMzMjZjZTU7XG4gIGNsYXNzIGluZ3Jlc3Msc2VydmljZSxwb2QxLHBvZDIgazhzO1xuICBjbGFzcyBjbGllbnQgcGxhaW47XG4gIGNsYXNzIGNsdXN0ZXIgY2x1c3RlcjtcbiIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkZWZhdWx0XCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9" _blank

{{< /mermaid >}}
Схема 7. Ingress

Код:

```text
graph LR;
 client([client])-. Ingress-managed <br> load balancer .->ingress[Ingress];
 ingress-->|routing rule|service[Service];
 subgraph cluster
 ingress;
 service-->pod1[Pod];
 service-->pod2[Pod];
 end
 classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
 classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
 classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
 class ingress,service,pod1,pod2 k8s;
 class client plain;
 class cluster cluster;
```

### Приклад 3 — Потік системи К8s {#example-3-k8s-system-flow}

На схемі 8 зображено Mermaid-діаграму послідовності, яка показує системний потік між компонентами K8 для запуску контейнера.

{{< figure src="/docs/images/diagram-guide-example-3.svg" alt="Потік системи К8s" class="diagram-large" caption="Схема 8. Потік системи К8s" link="https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiJSV7aW5pdDp7XCJ0aGVtZVwiOlwibmV1dHJhbFwifX0lJVxuc2VxdWVuY2VEaWFncmFtXG4gICAgYWN0b3IgbWVcbiAgICBwYXJ0aWNpcGFudCBhcGlTcnYgYXMgY29udHJvbCBwbGFuZTxicj48YnI-YXBpLXNlcnZlclxuICAgIHBhcnRpY2lwYW50IGV0Y2QgYXMgY29udHJvbCBwbGFuZTxicj48YnI-ZXRjZCBkYXRhc3RvcmVcbiAgICBwYXJ0aWNpcGFudCBjbnRybE1nciBhcyBjb250cm9sIHBsYW5lPGJyPjxicj5jb250cm9sbGVyPGJyPm1hbmFnZXJcbiAgICBwYXJ0aWNpcGFudCBzY2hlZCBhcyBjb250cm9sIHBsYW5lPGJyPjxicj5zY2hlZHVsZXJcbiAgICBwYXJ0aWNpcGFudCBrdWJlbGV0IGFzIG5vZGU8YnI-PGJyPmt1YmVsZXRcbiAgICBwYXJ0aWNpcGFudCBjb250YWluZXIgYXMgbm9kZTxicj48YnI-Y29udGFpbmVyPGJyPnJ1bnRpbWVcbiAgICBtZS0-PmFwaVNydjogMS4ga3ViZWN0bCBjcmVhdGUgLWYgcG9kLnlhbWxcbiAgICBhcGlTcnYtLT4-ZXRjZDogMi4gc2F2ZSBuZXcgc3RhdGVcbiAgICBjbnRybE1nci0-PmFwaVNydjogMy4gY2hlY2sgZm9yIGNoYW5nZXNcbiAgICBzY2hlZC0-PmFwaVNydjogNC4gd2F0Y2ggZm9yIHVuYXNzaWduZWQgcG9kcyhzKVxuICAgIGFwaVNydi0-PnNjaGVkOiA1LiBub3RpZnkgYWJvdXQgcG9kIHcgbm9kZW5hbWU9XCIgXCJcbiAgICBzY2hlZC0-PmFwaVNydjogNi4gYXNzaWduIHBvZCB0byBub2RlXG4gICAgYXBpU3J2LS0-PmV0Y2Q6IDcuIHNhdmUgbmV3IHN0YXRlXG4gICAga3ViZWxldC0-PmFwaVNydjogOC4gbG9vayBmb3IgbmV3bHkgYXNzaWduZWQgcG9kKHMpXG4gICAgYXBpU3J2LT4-a3ViZWxldDogOS4gYmluZCBwb2QgdG8gbm9kZVxuICAgIGt1YmVsZXQtPj5jb250YWluZXI6IDEwLiBzdGFydCBjb250YWluZXJcbiAgICBrdWJlbGV0LT4-YXBpU3J2OiAxMS4gdXBkYXRlIHBvZCBzdGF0dXNcbiAgICBhcGlTcnYtLT4-ZXRjZDogMTIuIHNhdmUgbmV3IHN0YXRlIiwibWVybWFpZCI6IntcbiAgXCJ0aGVtZVwiOiBcImRlZmF1bHRcIlxufSIsInVwZGF0ZUVkaXRvciI6ZmFsc2UsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjp0cnVlfQ" >}}

Код:

```text

%%{init:{"theme":"neutral"}}%%
sequenceDiagram
    actor me
    participant apiSrv as control plane<br><br>api-server
    participant etcd as control plane<br><br>etcd datastore
    participant cntrlMgr as control plane<br><br>controller<br>manager
    participant sched as control plane<br><br>scheduler
    participant kubelet as node<br><br>kubelet
    participant container as node<br><br>container<br>runtime
    me->>apiSrv: 1. kubectl create -f pod.yaml
    apiSrv-->>etcd: 2. save new state
    cntrlMgr->>apiSrv: 3. check for changes
    sched->>apiSrv: 4. watch for unassigned pods(s)
    apiSrv->>sched: 5. notify about pod w nodename=" "
    sched->>apiSrv: 6. assign pod to node
    apiSrv-->>etcd: 7. save new state
    kubelet->>apiSrv: 8. look for newly assigned pod(s)
    apiSrv->>kubelet: 9. bind pod to node
    kubelet->>container: 10. start container
    kubelet->>apiSrv: 11. update pod status
    apiSrv-->>etcd: 12. save new state
```

## Як стилізувати діаграми {#how-to-style-diagrams}

Ви можете стилізувати один або декілька елементів діаграми за допомогою CSS. Це досягається за допомогою двох типів операторів у коді Mermaid.

* `classDef` визначає клас атрибутів стилю.
* `class` визначає один або декілька елементів, до яких буде застосовано клас.

В коді до [схеми 7]([#example-2-ingress](https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZ3JhcGggIExSXG4gIGNsaWVudChbY2xpZW50XSktLiBJbmdyZXNzLW1hbmFnZWQgPGJyPiBsb2FkIGJhbGFuY2VyIC4tPmluZ3Jlc3NbSW5ncmVzc107XG4gIGluZ3Jlc3MtLT58cm91dGluZyBydWxlfHNlcnZpY2VbU2VydmljZV07XG4gIHN1YmdyYXBoIGNsdXN0ZXJcbiAgaW5ncmVzcztcbiAgc2VydmljZS0tPnBvZDFbUG9kXTtcbiAgc2VydmljZS0tPnBvZDJbUG9kXTtcbiAgZW5kXG4gIGNsYXNzRGVmIHBsYWluIGZpbGw6I2RkZCxzdHJva2U6I2ZmZixzdHJva2Utd2lkdGg6NHB4LGNvbG9yOiMwMDA7XG4gIGNsYXNzRGVmIGs4cyBmaWxsOiMzMjZjZTUsc3Ryb2tlOiNmZmYsc3Ryb2tlLXdpZHRoOjRweCxjb2xvcjojZmZmO1xuICBjbGFzc0RlZiBjbHVzdGVyIGZpbGw6I2ZmZixzdHJva2U6I2JiYixzdHJva2Utd2lkdGg6MnB4LGNvbG9yOiMzMjZjZTU7XG4gIGNsYXNzIGluZ3Jlc3Msc2VydmljZSxwb2QxLHBvZDIgazhzO1xuICBjbGFzcyBjbGllbnQgcGxhaW47XG4gIGNsYXNzIGNsdXN0ZXIgY2x1c3RlcjtcbiIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkZWZhdWx0XCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6dHJ1ZX0)) ви можете побачити приклад.

```text
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff; // визначає стиль для класу k8s
class ingress,service,pod1,pod2 k8s; // Клас k8s застосовується до елементів ingress, service, pod1 та pod2.
```

Ви можете включити один або декілька операторів `classDef` та `class` у вашу діаграму.  Ви також можете використовувати офіційний шістнадцятковий код кольору K8s `#326ce5` для компонентів K8s у вашій діаграмі.

Для отримання додаткової інформації про стилізацію та класи див. [Mermaid Styling and classes docs](https://mermaid-js.github.io/mermaid/#/flowchart?id=styling-and-classes).

## Як використовувати підписи до діаграм {#how-to-use-captions}

Підпис — це короткий опис діаграми. Підпис може містити назву або короткий опис діаграми. Підписи не замінюють пояснювальний текст у вашій документації, а радше слугують як "контекстний звʼязок" між цим текстом та вашою діаграмою.

Поєднання тексту та діаграми, повʼязаних разом за допомогою підпису, допомагає надати чітке уявлення про інформацію, яку ви хочете донести до користувача.

Без підписів ви змушуєте користувача шукати текст над або під діаграмою, щоб зрозуміти її значення. Це може викликати невдоволення користувача.

На схемі 9 показано три компоненти правильного використання підписів: діаграма, підпис до діаграми та посилання на діаграму в тексті.

{{< mermaid >}}
flowchart
    A[Діаграма<br><br>вбудований код Mermaid або<br>файл зображення SVG]
    B[Підпис діаграми<br><br>Вкажіть, Схема номер. та<br>текст підпису]
    C[Посилання на діаграму<br><br>Посилайтесь<br>Схема номер в тексті]

    classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
    class A,B,C box

click A "https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNptkctOwkAYhV9lMmyrwW01JlyMK1ckbqiLoZ1KY0tJOw0YQsJFdyQmxrA1vgEgKBeBV_j_N_JvQUBjk3bOzJye70ymwU3fklzntuvXzLIIlFFh9GSK8IJ9GMA7tuj7BYOzUnAevzCCIXZhDCtSA1jCFGYM5jQdsysZeMKxGK0PYRW78YH0DBYMPskxTMI-YEK_LfGJFa4vbza8bBFeiTeGNUyxzWD8Cz7dwZ-JRAnYxw72NAZv-EhpVI9R5IrEBFvHDDubvjROYI5t7DBY7-Oxu6XmiAorbNMZFslZ4lI0DP4UwO6uwKF_FudTXC_Z-a8KgxHbl8A-cTdk0xVhmJc2K_l1Zjuuq6ds29ZCFfh3Uk-l0-mtPqo5lirrJ9W6ZvquHyR7pwchLKNltVycwzXubS6A7rMRWwyuytKTBtdJWtIWkasMblSaZI2qllDywnKUH3DdFm4oNS4i5RfuKybXVRDJH1PeEbeB8Lau5jc-OB9Q" _blank

click B "https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNptkctOwkAYhV9lMmyrwW01JlyMK1ckbqiLoZ1KY0tJOw0YQsJFdyQmxrA1vgEgKBeBV_j_N_JvQUBjk3bOzJye70ymwU3fklzntuvXzLIIlFFh9GSK8IJ9GMA7tuj7BYOzUnAevzCCIXZhDCtSA1jCFGYM5jQdsysZeMKxGK0PYRW78YH0DBYMPskxTMI-YEK_LfGJFa4vbza8bBFeiTeGNUyxzWD8Cz7dwZ-JRAnYxw72NAZv-EhpVI9R5IrEBFvHDDubvjROYI5t7DBY7-Oxu6XmiAorbNMZFslZ4lI0DP4UwO6uwKF_FudTXC_Z-a8KgxHbl8A-cTdk0xVhmJc2K_l1Zjuuq6ds29ZCFfh3Uk-l0-mtPqo5lirrJ9W6ZvquHyR7pwchLKNltVycwzXubS6A7rMRWwyuytKTBtdJWtIWkasMblSaZI2qllDywnKUH3DdFm4oNS4i5RfuKybXVRDJH1PeEbeB8Lau5jc-OB9Q" _blank

click C "https://mermaid-js.github.io/mermaid-live-editor/edit#pako:eNptkctOwkAYhV9lMmyrwW01JlyMK1ckbqiLoZ1KY0tJOw0YQsJFdyQmxrA1vgEgKBeBV_j_N_JvQUBjk3bOzJye70ymwU3fklzntuvXzLIIlFFh9GSK8IJ9GMA7tuj7BYOzUnAevzCCIXZhDCtSA1jCFGYM5jQdsysZeMKxGK0PYRW78YH0DBYMPskxTMI-YEK_LfGJFa4vbza8bBFeiTeGNUyxzWD8Cz7dwZ-JRAnYxw72NAZv-EhpVI9R5IrEBFvHDDubvjROYI5t7DBY7-Oxu6XmiAorbNMZFslZ4lI0DP4UwO6uwKF_FudTXC_Z-a8KgxHbl8A-cTdk0xVhmJc2K_l1Zjuuq6ds29ZCFfh3Uk-l0-mtPqo5lirrJ9W6ZvquHyR7pwchLKNltVycwzXubS6A7rMRWwyuytKTBtdJWtIWkasMblSaZI2qllDywnKUH3DdFm4oNS4i5RfuKybXVRDJH1PeEbeB8Lau5jc-OB9Q" _blank

{{< /mermaid >}}

Схема 9. Компоненти заголовків

{{< note >}}
Ви завжди повинні додавати підпис до кожної діаграми у вашій документації.
{{< /note >}}

**Діаграма**

Методи `Mermaid+SVG` та `External Tool` генерують файли зображень у форматі `.svg`.

Існує  shortcode `{{</* figure */>}}` для діаграми, що знаходиться у файлі зображення `.svg`, збереженому в `/images/docs/components-of-kubernetes.svg`:

```none
{{</* figure src="/images/docs/components-of-kubernetes.svg" alt="Kubernetes pod running inside a cluster" class="diagram-large" caption="Схема 4. Компоненти архітектури Kubernetes" */>}}
```

Ви повинні передавати значення `src`, `alt`, `class` та `caption` у shortcode `{{</* figure */>}}`. Ви можете змінювати розмір діаграми, використовуючи класи `diagram-large`, `diagram-medium` та `diagram-small`.

{{< note >}}
Діаграми, створені за допомогою методу `Inline`, не використовують shortcode "\{\{< figure >}}". Код Mermaid визначає, як діаграма буде відображатися на вашій сторінці.
{{< /note >}}

Дивіться [Методи створення діаграм](#methods-for-creating-diagrams) для отримання додаткової інформації про різні методи створення діаграм.

**Підпис до діаграми**

Далі додайте підпис до діаграми.

Якщо ви використовуєте діаграму з файла зображення `.svg`, вам слід використовувати параметр `caption` shortcodeʼа `{{</* figure */>}}`.

```none
{{</* figure src="/images/docs/components-of-kubernetes.svg" alt="Kubernetes pod running inside a cluster" class="diagram-large" caption="Схема 4. Компоненти архітектури Kubernetes" */>}}
```

Якщо ви використовуєте діаграму, що є вбудованим кодом Mermaid, тоді слід використовувати текст Markdown.

```none
Схема 4. Компоненти архітектури Kubernetes
```

Нижче наведено кілька аспектів, які слід враховувати при додаванні підписів до діаграм:

* Використовуйте shortcode `{{</* figure */>}}` для додавання підпису до діаграм, створених за допомогою методів `Mermaid+SVG` та `External Tool`.
* Використовуйте простий текст Markdown для додавання підпису до діаграм, створених за допомогою методу `Inline`.
* Перед підписом діаграми додайте `Схема НОМЕР.`. Ви повинні використовувати слово `Схема`, і номер повинен бути унікальним для кожної діаграми на вашій сторінці документації. Додайте крапку після номера.
* Додайте текст підпису діаграми після `Схема НОМЕР.` в тому ж рядку. Підпис повинен закінчуватися крапкою. Зберігайте текст підпису коротким.
* Розташовуйте підпис до діаграми __ПІД__ вашою діаграмою.

**Посилання на діаграму**

Нарешті, ви можете додати посилання на діаграму. Воно використовується у вашому тексті та повинно передувати самій діаграмі. Це дозволяє користувачеві повʼязати ваш текст із відповідною діаграмою. `Схема НОМЕР` у вашому посиланні та підписі повинні співпадати.

Вам слід уникати використання розпливчастих посилань, таких як `..зображення нижче..` або `..наступна схема..`

Ось приклад посилання на діаграму:

```text
Схема 10 зображує компоненти архітектури Kubernetes.
Панель управління ...
```

Посилання на діаграми є необовʼязковими, і є випадки, коли вони можуть бути невідповідними. Якщо ви не впевнені, додайте посилання на діаграму у ваш текст, щоб побачити, чи виглядає і звучить воно добре. Коли виникають сумніви, використовуйте посилання на діаграму.

**Повна картина**

Схема 10 показує діаграму архітектури Kubernetes, яка включає діаграму, підпис до діаграми та посилання на діаграму. Shortcode `{{</* figure */>}}` показує діаграму, додає підпис і включає необовʼязковий параметр `link`, щоб ви могли мати гіперпосилання на діаграму. Посилання на діаграму знаходиться в цьому абзаці.

Ось shortcode `{{</* figure */>}}` для цієї діаграми:

```
{{</* figure src="/images/docs/components-of-kubernetes.svg" alt="Kubernetes pod running inside a cluster" class="diagram-large" caption="Схема 10. Архітектура Kubernetes." link="/docs/concepts/overview/components/" */>}}
```

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Kubernetes pod running inside a cluster" class="diagram-large" caption="Схема 10. Архітектура Kubernetes." link="/uk/docs/concepts/overview/components/" >}}

## Поради {#tips}

* Завжди використовуйте оналйн редактор для створення/редагування вашої діаграми.

* Завжди використовуйте локальний Hugo та попередній перегляд Netlify, щоб перевірити, як діаграма відображається в документації.

* Включайте джерела діаграм, такі як URL, місцезнаходження вихідного коду або вказуйте, що код є самодокументуючим.

* Завжди використовуйте підписи до діаграм.

* Дуже корисно включати зображення діаграми у форматі `.svg` або `.png` та/або вихідний код Mermaid у тікетах та PRs.

* Для методів `Mermaid+SVG` та `External Tool` використовуйте файли зображень `.svg`, оскільки вони залишаються чіткими при збільшенні діаграми.

* Найкраща практика для файлів `.svg` — завантажити їх в інструмент для редагування SVG та використати функцію "Конвертувати текст у криві". Це гарантує, що діаграма відображатиметься однаково на всіх системах, незалежно від доступності шрифтів і підтримки рендерингу шрифтів.

* Mermaid не підтримує додаткові іконки або зображень.

* Shortcodes Hugo Mermaid не працюють в оналайн редакторі.

* Кожного разу, коли ви змінюєте діаграму в оналайн редакторі, ви __повинні__ зберегти її, щоб згенерувати новий URL для діаграми.

* Натисніть на діаграми в цьому розділі, щоб переглянути код і відображення діаграми в оналайн редакторі.

* Перегляньте вихідний код цієї сторінки, `diagram-guide.md`, для отримання додаткових прикладів.

* Ознайомтеся з [документацією Mermaid](https://mermaid-js.github.io/mermaid/#/), щоб отримати пояснення та приклади.

Найважливіше — __Робіть діаграми простими__. Це заощадить час вам і вашим колегам-учасникам, а також полегшить читання для нових та досвідчених користувачів.
