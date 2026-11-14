---
title: Створення діаграм
linktitle: Створення діаграм
content_type: concept
weight: 60
---

<!-- overview -->

Цей посібник показує, як створювати, редагувати та поширювати діаграми за допомогою JavaScript-бібліотеки Mermaid. Mermaid.js дозволяє створювати діаграми за допомогою простого синтаксису, подібного до Markdown, всередині Markdown-файлів. Ви також можете використовувати Mermaid для створення файлів зображень у форматі `.svg` або `.png`, які ви можете додати до документації.

Цільовою аудиторією цього посібника є будь-хто, хто бажає дізнатися про Mermaid та/або як створювати і додавати діаграми до документації Kubernetes.

На схемі 1 показані теми, які розглядаються в цьому розділі.

{{< mermaid >}}
flowchart LR
subgraph m[Mermaid.js]
direction TB
S[ ]-.-
C[створення<br>діаграм<br>у markdown] -->
D[онлайн-<br>редактор]
end
A[Чому діаграми<br>корисні?] --> m
m --> N[3 методи<br>створення<br>діаграм]
N --> T[Приклади]
T --> X[Стилі<br>та<br>підписи]
X --> V[Поради]



    classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
    classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
    class A,C,D,N,X,m,T,V box
    class S spacewhite

%% ви можете додавати гіперпосилання на вузли діаграми Mermaid за допомогою операторів click

click A "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqNksFOGzEQhl_FMlcvCuptW1FR0lubQxOhSOscnLWX3bK2I69XoUJIhT5Ab7lWPXGNIEgpEHiF2TfqrAkicGL3Mpr5_P1zmBOaWqloTLPSTtNcOE--fOOmqseHTkxyopOvymlRyO3v1YgbWTiV-sIaMvjETT8ho2g74mY_ac6ac7iE--YnXMMKVs3vD2O3C4tmBnO4wu4c7tpO84to4Y6knZoRiaJdbroJ3OOLWyT-wSoKUCtZYOMGpajEYGUkN3sJXCB8h5KXZliGtJuQv2zOMH_2MfiJ5kaHope8I0het0qUhxdv2RrDe0EwSOBPq8eYdllU4GgQRsME_qJpCbfNLHjPYR5MD2hawEPYqcWHAT9AUwh9sjz-BL-0FFXVVRkZ22OSFWUZb2VZxirv7JGKtzqdzrqOpoX0ebwzOWapLa0Ls_evJNVEpGqaF149uzZ1z_Va13mh27CRPbbPuqzHhkyzATto99sc9zeyKKP68Wjwrk5ailOfK604jbGUKhN16Tnl5hTReiKFV59l4a2jcSbKSjEqam_7P0xKY-9q9QR1C4FXqdfU6X-wSDhG" _blank
click C "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqNksFOGzEQhl_FMlcvCuptW1FR0lubQxOhSOscnLWX3bK2I69XoUJIhT5Ab7lWPXGNIEgpEHiF2TfqrAkicGL3Mpr5_P1zmBOaWqloTLPSTtNcOE--fOOmqseHTkxyopOvymlRyO3v1YgbWTiV-sIaMvjETT8ho2g74mY_ac6ac7iE--YnXMMKVs3vD2O3C4tmBnO4wu4c7tpO84to4Y6knZoRiaJdbroJ3OOLWyT-wSoKUCtZYOMGpajEYGUkN3sJXCB8h5KXZliGtJuQv2zOMH_2MfiJ5kaHope8I0het0qUhxdv2RrDe0EwSOBPq8eYdllU4GgQRsME_qJpCbfNLHjPYR5MD2hawEPYqcWHAT9AUwh9sjz-BL-0FFXVVRkZ22OSFWUZb2VZxirv7JGKtzqdzrqOpoX0ebwzOWapLa0Ls_evJNVEpGqaF149uzZ1z_Va13mh27CRPbbPuqzHhkyzATto99sc9zeyKKP68Wjwrk5ailOfK604jbGUKhN16Tnl5hTReiKFV59l4a2jcSbKSjEqam_7P0xKY-9q9QR1C4FXqdfU6X-wSDhG" _blank
click D "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqNksFOGzEQhl_FMlcvCuptW1FR0lubQxOhSOscnLWX3bK2I69XoUJIhT5Ab7lWPXGNIEgpEHiF2TfqrAkicGL3Mpr5_P1zmBOaWqloTLPSTtNcOE--fOOmqseHTkxyopOvymlRyO3v1YgbWTiV-sIaMvjETT8ho2g74mY_ac6ac7iE--YnXMMKVs3vD2O3C4tmBnO4wu4c7tpO84to4Y6knZoRiaJdbroJ3OOLWyT-wSoKUCtZYOMGpajEYGUkN3sJXCB8h5KXZliGtJuQv2zOMH_2MfiJ5kaHope8I0het0qUhxdv2RrDe0EwSOBPq8eYdllU4GgQRsME_qJpCbfNLHjPYR5MD2hawEPYqcWHAT9AUwh9sjz-BL-0FFXVVRkZ22OSFWUZb2VZxirv7JGKtzqdzrqOpoX0ebwzOWapLa0Ls_evJNVEpGqaF149uzZ1z_Va13mh27CRPbbPuqzHhkyzATto99sc9zeyKKP68Wjwrk5ailOfK604jbGUKhN16Tnl5hTReiKFV59l4a2jcSbKSjEqam_7P0xKY-9q9QR1C4FXqdfU6X-wSDhG" _blank
click N "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqNksFOGzEQhl_FMlcvCuptW1FR0lubQxOhSOscnLWX3bK2I69XoUJIhT5Ab7lWPXGNIEgpEHiF2TfqrAkicGL3Mpr5_P1zmBOaWqloTLPSTtNcOE--fOOmqseHTkxyopOvymlRyO3v1YgbWTiV-sIaMvjETT8ho2g74mY_ac6ac7iE--YnXMMKVs3vD2O3C4tmBnO4wu4c7tpO84to4Y6knZoRiaJdbroJ3OOLWyT-wSoKUCtZYOMGpajEYGUkN3sJXCB8h5KXZliGtJuQv2zOMH_2MfiJ5kaHope8I0het0qUhxdv2RrDe0EwSOBPq8eYdllU4GgQRsME_qJpCbfNLHjPYR5MD2hawEPYqcWHAT9AUwh9sjz-BL-0FFXVVRkZ22OSFWUZb2VZxirv7JGKtzqdzrqOpoX0ebwzOWapLa0Ls_evJNVEpGqaF149uzZ1z_Va13mh27CRPbbPuqzHhkyzATto99sc9zeyKKP68Wjwrk5ailOfK604jbGUKhN16Tnl5hTReiKFV59l4a2jcSbKSjEqam_7P0xKY-9q9QR1C4FXqdfU6X-wSDhG" _blank
click T "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqNksFOGzEQhl_FMlcvCuptW1FR0lubQxOhSOscnLWX3bK2I69XoUJIhT5Ab7lWPXGNIEgpEHiF2TfqrAkicGL3Mpr5_P1zmBOaWqloTLPSTtNcOE--fOOmqseHTkxyopOvymlRyO3v1YgbWTiV-sIaMvjETT8ho2g74mY_ac6ac7iE--YnXMMKVs3vD2O3C4tmBnO4wu4c7tpO84to4Y6knZoRiaJdbroJ3OOLWyT-wSoKUCtZYOMGpajEYGUkN3sJXCB8h5KXZliGtJuQv2zOMH_2MfiJ5kaHope8I0het0qUhxdv2RrDe0EwSOBPq8eYdllU4GgQRsME_qJpCbfNLHjPYR5MD2hawEPYqcWHAT9AUwh9sjz-BL-0FFXVVRkZ22OSFWUZb2VZxirv7JGKtzqdzrqOpoX0ebwzOWapLa0Ls_evJNVEpGqaF149uzZ1z_Va13mh27CRPbbPuqzHhkyzATto99sc9zeyKKP68Wjwrk5ailOfK604jbGUKhN16Tnl5hTReiKFV59l4a2jcSbKSjEqam_7P0xKY-9q9QR1C4FXqdfU6X-wSDhG" _blank
click X "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqNksFOGzEQhl_FMlcvCuptW1FR0lubQxOhSOscnLWX3bK2I69XoUJIhT5Ab7lWPXGNIEgpEHiF2TfqrAkicGL3Mpr5_P1zmBOaWqloTLPSTtNcOE--fOOmqseHTkxyopOvymlRyO3v1YgbWTiV-sIaMvjETT8ho2g74mY_ac6ac7iE--YnXMMKVs3vD2O3C4tmBnO4wu4c7tpO84to4Y6knZoRiaJdbroJ3OOLWyT-wSoKUCtZYOMGpajEYGUkN3sJXCB8h5KXZliGtJuQv2zOMH_2MfiJ5kaHope8I0het0qUhxdv2RrDe0EwSOBPq8eYdllU4GgQRsME_qJpCbfNLHjPYR5MD2hawEPYqcWHAT9AUwh9sjz-BL-0FFXVVRkZ22OSFWUZb2VZxirv7JGKtzqdzrqOpoX0ebwzOWapLa0Ls_evJNVEpGqaF149uzZ1z_Va13mh27CRPbbPuqzHhkyzATto99sc9zeyKKP68Wjwrk5ailOfK604jbGUKhN16Tnl5hTReiKFV59l4a2jcSbKSjEqam_7P0xKY-9q9QR1C4FXqdfU6X-wSDhG" _blank
click V "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqNksFOGzEQhl_FMlcvCuptW1FR0lubQxOhSOscnLWX3bK2I69XoUJIhT5Ab7lWPXGNIEgpEHiF2TfqrAkicGL3Mpr5_P1zmBOaWqloTLPSTtNcOE--fOOmqseHTkxyopOvymlRyO3v1YgbWTiV-sIaMvjETT8ho2g74mY_ac6ac7iE--YnXMMKVs3vD2O3C4tmBnO4wu4c7tpO84to4Y6knZoRiaJdbroJ3OOLWyT-wSoKUCtZYOMGpajEYGUkN3sJXCB8h5KXZliGtJuQv2zOMH_2MfiJ5kaHope8I0het0qUhxdv2RrDe0EwSOBPq8eYdllU4GgQRsME_qJpCbfNLHjPYR5MD2hawEPYqcWHAT9AUwh9sjz-BL-0FFXVVRkZ22OSFWUZb2VZxirv7JGKtzqdzrqOpoX0ebwzOWapLa0Ls_evJNVEpGqaF149uzZ1z_Va13mh27CRPbbPuqzHhkyzATto99sc9zeyKKP68Wjwrk5ailOfK604jbGUKhN16Tnl5hTReiKFV59l4a2jcSbKSjEqam_7P0xKY-9q9QR1C4FXqdfU6X-wSDhG" _blank

{{< /mermaid >}}

Схема 1. Теми, які розглядаються в цьому розділі.

Все, що потрібно, щоб почати працювати з Mermaid:

* Знання основ markdown.
* Вміння користуватися онлайн-редактором Mermaid.
* Вміння користуватися [shortcode Hugo](/docs/contribute/style/hugo-shortcodes/).
* Вміння користуватися [shortcode Hugo {{</* figure */>}}](https://gohugo.io/content-management/shortcodes/#figure).
* Вміння виконувати [локальний перегляд у Hugo](/docs/contribute/new-content/open-a-pr/#preview-locally).
* Знайомство з процесом [створення нового контенту](/docs/contribute/new-content/).

{{< note >}}
Ви можете клацнути на кожну діаграму в цьому розділі, щоб переглянути її код і згенеровану діаграму в онлайн-редакторі Mermaid.
{{< /note >}}

<!--body-->

## Чому слід використовувати діаграми в документації {#why-you-should-use-diagrams-in-documentation}

Діаграми покращують ясність та сприйняття документації. Це має переваги як для користувачів, так і для учасників.

Переваги для користувачів включають:

* __Приємне перше враження__. Детальна текстова сторінка привітання може налякати користувачів, особливо новачків у Kubernetes.
* __Швидке освоєння концепцій__. Діаграма може допомогти користувачам зрозуміти ключові моменти складної теми. Ваша діаграма може слугувати візуальним навчальним посібником для занурення в деталі теми.
* __Краще запамʼятовування__. Для деяких легше запамʼятати зображення, ніж текст.

Переваги для учасників включають:

* __Допомога у розробці структури та контенту__ вашого внеску. Наприклад, ви можете почати з простої діаграми, яка охоплює основні моменти, а потім заглибитися в деталі.
* __Розширення та зростання спільноти користувачів__. Зручна для сприйняття документація, доповнена діаграмами, приваблює нових користувачів, які раніше неохоче брали участь у проєкті через уявну складність.

Вам слід враховувати вашу цільову аудиторію. Окрім досвідчених користувачів K8s, у вас буде багато новачків у Kubernetes. Навіть проста діаграма може допомогти новим користувачам засвоїти концепції Kubernetes. Вони стають впевненішими та більш схильними до подальшого дослідження Kubernetes та документації.

## Mermaid {#mermaid}

[Mermaid](https://mermaid-js.github.io/mermaid/#/) — це бібліотека JavaScript з відкритим вихідним кодом, яка дозволяє створювати, редагувати та легко ділитися діаграмами, використовуючи простий синтаксис, схожий на Markdown, який вбудовується безпосередньо у файли Markdown.

Нижче наведено особливості Mermaid:

* Простий синтаксис коду.
* Включає вебінструмент для кодування та перегляду ваших діаграм.
* Підтримує кілька форматів, включаючи діаграми процесів, станів та послідовностей.
* Легке співробітництво з колегами через URL-адресу для кожної діаграми.
* Широкий вибір форм, ліній, тем та стилів.

Переваги використання Mermaid:

* Немає потреби в окремих інструментах для створення діаграм, крім Mermaid.
* Відповідає поточному робочому процесу з використанням PR. Ви можете розглядати код Mermaid як просто текст Markdown, доданий у ваш PR.
* Простий інструмент створює прості діаграми. Не варто загрузати у (пере)створенні надто складного й деталізованого зображення. Робіть простіше!

Mermaid надає простий, відкритий та прозорий метод для спільнот SIG для додавання, редагування та співпраці над діаграмами для нової чи наявної документації.

{{< note >}}
Ви все ще можете використовувати Mermaid для створення/редагування діаграм, навіть якщо Mermaid не підтримується у вашому середовищі. Цей метод називається __Mermaid+SVG__ і пояснюється нижче.
{{< /note >}}

### Онлайн-редактор {#live-editor}

[Онлайн-редактор Mermaid](https://mermaid-js.github.io/mermaid-live-editor) — це вебінструмент, який дозволяє створювати, редагувати та переглядати діаграми.

Нижче наведено можливості онлайн-редактора:

* Показує код Mermaid разом зі згенерованою діаграмою.
* Генерує URL для кожної збереженої діаграми. URL відображається в адресному рядку вашого браузера. Ви можете поділитися URL з колегами, які можуть отримати доступ до діаграми та змінювати її.
* Можливість завантажити файли `.svg` або `.png`.

{{< note >}}
Онлайн-редактор — це найпростіший і найшвидший спосіб створення та редагування діаграм Mermaid.
{{< /note >}}

## Методи створення діаграм {#methods-for-creating-diagrams}

На схемі 2 показано три способи створення та додавання діаграм.

{{< mermaid >}}
graph TB
A[Учасник]
B[В тексті<br><br>Код Mermaid<br>додається у файл .md]
C[Mermaid+SVG<br><br>Файл svg, згенерований<br>Mermaid, додається<br>у файл .md]
D[Зовнішній інструмент<br><br>Файл svg, згенерований<br>зовнішнім інструментом,<br>додається у файл .md]

    A --> B
    A --> C
    A --> D

    classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
    class A,B,C,D box

%% ви можете додавати гіперпосилання на вузли діаграми Mermaid за допомогою операторів click

click A "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqVkstKAzEUhl8lpEtTqdtRCm1HXLmquJlxkc5k2sG5lJmMF0qhF0EXgiBSwa0-QNEWbe34DCdvZDJOpVIXGkhIzvnO_5-EdLAV2gxruBnRdgsdVM2gYsCjuISx6EMKbzA_MoOqAbdIDGAKc9EXAzHaaURlNeEBPmCC9lnkU9fOIhMVkdV3kruW9A0SQyQuYAwzeEebvi31akZesVE_3PvWesqZ-KRJELzCi_RLYSp6UvFZ5lQ3M0XmxRJaM1PpdT_dgPtMJBUjcaVWmCG5pNltemIIC-UlBv_vReZ-Ci9-FZbQgvz5fcwAyVFBxWIZVVcPtdWDvgQtj8axzhzUCM-Q43qeVnAch8Q8Co-ZViiVSvm-eOravKVttc-IFXphlOW2V0RQhVRJjehKCRPsfz20_B4dBZmYt5jPTKzJrc0cmnjcxGbQlWjStilnu7bLwwhrDvViRjBNeFg_Dyys8ShhS0h3qfxtfk51PwER6DaD" _blank

click B "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqVkstKAzEUhl8lpEtTqdtRCm1HXLmquJlxkc5k2sG5lJmMF0qhF0EXgiBSwa0-QNEWbe34DCdvZDJOpVIXGkhIzvnO_5-EdLAV2gxruBnRdgsdVM2gYsCjuISx6EMKbzA_MoOqAbdIDGAKc9EXAzHaaURlNeEBPmCC9lnkU9fOIhMVkdV3kruW9A0SQyQuYAwzeEebvi31akZesVE_3PvWesqZ-KRJELzCi_RLYSp6UvFZ5lQ3M0XmxRJaM1PpdT_dgPtMJBUjcaVWmCG5pNltemIIC-UlBv_vReZ-Ci9-FZbQgvz5fcwAyVFBxWIZVVcPtdWDvgQtj8axzhzUCM-Q43qeVnAch8Q8Co-ZViiVSvm-eOravKVttc-IFXphlOW2V0RQhVRJjehKCRPsfz20_B4dBZmYt5jPTKzJrc0cmnjcxGbQlWjStilnu7bLwwhrDvViRjBNeFg_Dyys8ShhS0h3qfxtfk51PwER6DaD" _blank

click C "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqVkstKAzEUhl8lpEtTqdtRCm1HXLmquJlxkc5k2sG5lJmMF0qhF0EXgiBSwa0-QNEWbe34DCdvZDJOpVIXGkhIzvnO_5-EdLAV2gxruBnRdgsdVM2gYsCjuISx6EMKbzA_MoOqAbdIDGAKc9EXAzHaaURlNeEBPmCC9lnkU9fOIhMVkdV3kruW9A0SQyQuYAwzeEebvi31akZesVE_3PvWesqZ-KRJELzCi_RLYSp6UvFZ5lQ3M0XmxRJaM1PpdT_dgPtMJBUjcaVWmCG5pNltemIIC-UlBv_vReZ-Ci9-FZbQgvz5fcwAyVFBxWIZVVcPtdWDvgQtj8axzhzUCM-Q43qeVnAch8Q8Co-ZViiVSvm-eOravKVttc-IFXphlOW2V0RQhVRJjehKCRPsfz20_B4dBZmYt5jPTKzJrc0cmnjcxGbQlWjStilnu7bLwwhrDvViRjBNeFg_Dyys8ShhS0h3qfxtfk51PwER6DaD" _blank

click D "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqVkstKAzEUhl8lpEtTqdtRCm1HXLmquJlxkc5k2sG5lJmMF0qhF0EXgiBSwa0-QNEWbe34DCdvZDJOpVIXGkhIzvnO_5-EdLAV2gxruBnRdgsdVM2gYsCjuISx6EMKbzA_MoOqAbdIDGAKc9EXAzHaaURlNeEBPmCC9lnkU9fOIhMVkdV3kruW9A0SQyQuYAwzeEebvi31akZesVE_3PvWesqZ-KRJELzCi_RLYSp6UvFZ5lQ3M0XmxRJaM1PpdT_dgPtMJBUjcaVWmCG5pNltemIIC-UlBv_vReZ-Ci9-FZbQgvz5fcwAyVFBxWIZVVcPtdWDvgQtj8axzhzUCM-Q43qeVnAch8Q8Co-ZViiVSvm-eOravKVttc-IFXphlOW2V0RQhVRJjehKCRPsfz20_B4dBZmYt5jPTKzJrc0cmnjcxGbQlWjStilnu7bLwwhrDvViRjBNeFg_Dyys8ShhS0h3qfxtfk51PwER6DaD" _blank

{{< /mermaid >}} 

Схема 2. Методи створення діаграм.

### В тексті {#inline}

На схемі 3 показано кроки для додавання діаграми за допомогою методу Inline.

{{< mermaid >}}
graph LR
A[1. Використовуйте онлайн-редактор<br>для створення/редагування<br>діаграми] -->
B[2. Збережіть<br>URL діаграми] -->
C[3. Скопіюйте код Mermaid<br>у markdown-файл сторінки] -->
D[4. Додайте підпис]


    classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
    class A,B,C,D box

%% ви можете додавати гіперпосилання на вузли діаграми Mermaid за допомогою операторів click

click A "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp1ks1OwkAUhV9lMmxbBXVVDQlQd7jBuGpZDO1UGvpDSgkYQoLg0khiDK59A0Uw_Ai8wp038k4Lxo2dpL339pwvZ6btUSu0OdXobcSadVKumEHByB0ReIYFrGArBrAQ92IIW5iKESyxmhNsNrCGd1jCRkXFHGbYrKRKDC5qUR77tRiTxDhNIHN0bMT4-Ff9ibQpPpNx6hGTZD7A-zcsqkRV82ZQNE4wzSt8wDzxfomJGIpH6biplMk_rpJxiq43uQPYoePpkFwOZuSKRz5zbQkRI-KzqGGHnUAVD8me1mlwjI3sDVoOVN04Q-qLREhhSkQ8tjt5TFUzkIvgZXms1dK5Q2phlziu52kZx3GUVhyFDa5lstnsvlY7rh3XtVyzq1ihF0bJu_M_EFJQikpJ0SWJKtRPo-MX60mRSeM697lJNSxt7rC2F5vUDPoobTdtFvNL243DiGoO81pcoawdh9d3gUW1OGrzg0h3Gf4A_l7V_wHgzghR" _blank

click B "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp1ks1OwkAUhV9lMmxbBXVVDQlQd7jBuGpZDO1UGvpDSgkYQoLg0khiDK59A0Uw_Ai8wp038k4Lxo2dpL339pwvZ6btUSu0OdXobcSadVKumEHByB0ReIYFrGArBrAQ92IIW5iKESyxmhNsNrCGd1jCRkXFHGbYrKRKDC5qUR77tRiTxDhNIHN0bMT4-Ff9ibQpPpNx6hGTZD7A-zcsqkRV82ZQNE4wzSt8wDzxfomJGIpH6biplMk_rpJxiq43uQPYoePpkFwOZuSKRz5zbQkRI-KzqGGHnUAVD8me1mlwjI3sDVoOVN04Q-qLREhhSkQ8tjt5TFUzkIvgZXms1dK5Q2phlziu52kZx3GUVhyFDa5lstnsvlY7rh3XtVyzq1ihF0bJu_M_EFJQikpJ0SWJKtRPo-MX60mRSeM697lJNSxt7rC2F5vUDPoobTdtFvNL243DiGoO81pcoawdh9d3gUW1OGrzg0h3Gf4A_l7V_wHgzghR" _blank

click C "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp1ks1OwkAUhV9lMmxbBXVVDQlQd7jBuGpZDO1UGvpDSgkYQoLg0khiDK59A0Uw_Ai8wp038k4Lxo2dpL339pwvZ6btUSu0OdXobcSadVKumEHByB0ReIYFrGArBrAQ92IIW5iKESyxmhNsNrCGd1jCRkXFHGbYrKRKDC5qUR77tRiTxDhNIHN0bMT4-Ff9ibQpPpNx6hGTZD7A-zcsqkRV82ZQNE4wzSt8wDzxfomJGIpH6biplMk_rpJxiq43uQPYoePpkFwOZuSKRz5zbQkRI-KzqGGHnUAVD8me1mlwjI3sDVoOVN04Q-qLREhhSkQ8tjt5TFUzkIvgZXms1dK5Q2phlziu52kZx3GUVhyFDa5lstnsvlY7rh3XtVyzq1ihF0bJu_M_EFJQikpJ0SWJKtRPo-MX60mRSeM697lJNSxt7rC2F5vUDPoobTdtFvNL243DiGoO81pcoawdh9d3gUW1OGrzg0h3Gf4A_l7V_wHgzghR" _blank

click D "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp1ks1OwkAUhV9lMmxbBXVVDQlQd7jBuGpZDO1UGvpDSgkYQoLg0khiDK59A0Uw_Ai8wp038k4Lxo2dpL339pwvZ6btUSu0OdXobcSadVKumEHByB0ReIYFrGArBrAQ92IIW5iKESyxmhNsNrCGd1jCRkXFHGbYrKRKDC5qUR77tRiTxDhNIHN0bMT4-Ff9ibQpPpNx6hGTZD7A-zcsqkRV82ZQNE4wzSt8wDzxfomJGIpH6biplMk_rpJxiq43uQPYoePpkFwOZuSKRz5zbQkRI-KzqGGHnUAVD8me1mlwjI3sDVoOVN04Q-qLREhhSkQ8tjt5TFUzkIvgZXms1dK5Q2phlziu52kZx3GUVhyFDa5lstnsvlY7rh3XtVyzq1ihF0bJu_M_EFJQikpJ0SWJKtRPo-MX60mRSeM697lJNSxt7rC2F5vUDPoobTdtFvNL243DiGoO81pcoawdh9d3gUW1OGrzg0h3Gf4A_l7V_wHgzghR" _blank



{{< /mermaid >}}

Схема 3. Кроки методу Inline.

Ось перелік кроків, які слід виконати для додавання діаграми за допомогою методу Inline:

1. Створіть вашу діаграму за допомогою онлайн-редактора.
2. Збережіть URL діаграми для подальшого доступу.
3. Скопіюйте код Mermaid у те місце файлу `.md`, де має зʼявитися діаграма.
4. Додайте підпис під діаграмою, використовуючи текст Markdown.

Під час збирання Hugo виконує код Mermaid і перетворює його на діаграму.

{{< note >}}
Вам може здатися, що відстеження URL-адрес діаграм є громіздким. У такому випадку зробіть примітку у файлі `.md`, що код Mermaid самодокументується. Учасники можуть копіювати код Mermaid до та з онлайн-редактора для редагування діаграм.
{{< /note >}}

Ось приклад фрагмента коду, що міститься у файлі `.md`:

```
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

* Використання онлайн-редактора.
* Легко копіювати код Mermaid до та з онлайн-редактора та вашого файлу `.md`.
* Відсутність необхідності окремої обробки файлів зображень `.svg`.
* Текст контенту, код діаграми та підпис до діаграми знаходяться в одному файлі `.md`.

Ви повинні використовувати [локальний](/docs/contribute/new-content/open-a-pr/#preview-locally) та Netlify попередній перегляд для перевірки правильного показу діаграми.

{{< caution >}}
Набір можливостей в онлайн-редакторі Mermaid може не підтримувати набір можливостей Mermaid в проєкті [kubernetes/website](https://github.com/kubernetes/website). Також слід зазначити, що учасники можуть згадувати `kubernetes/website` як `k/website`. Якщо ви бачите синтаксичну помилку або порожній екран після побудови Hugo, розгляньте можливість використання методу Mermaid+SVG.
{{< /caution >}}

### Mermaid+SVG {#mermaid-svg}

На схемі 4 показано кроки для додавання діаграми за допомогою методу Mermaid+SVG.

{{< mermaid >}}
flowchart LR
A[1. Використовуйте онлайн-редактор<br>для створення/редагування<br>діаграми]
B[2. Збережіть<br>URL діаграми]
C[3. Згенеруйте файл .svg<br>і завантажте його<br>до теки images/]
subgraph w[ ]
direction TB
D[4. Використовуйте shortcode figure<br>для посилання на файл .svg<br>у файлі .md<br>сторінки] -->
E[5. Додайте підпис]
end
A --> B
B --> C
C --> w

    classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
    class A,B,C,D,E,w box

click A "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqFUk1P20AQ_Sur5eqEAO3FrZDIx40TbU9eDht7HVu1d6P1GlMhpAR6rIRUofRvpAkpCSHhL-z-o84uIeKAhA_emfF7s2_e-AKHImLYx3EmqjChUqHjE8KPgr060r_1XD_otRnouRmaK73WE3OtFxDNECQrvdRjvdCrGiBm-g6SB4syg89deQj50twgR5y4JjNgrMzN7hY9hW4TOF35mWNGrj6A96OenxLeDPZByR_9V88c758ZmSvzy6K_nRyjNxit4MAxpu5CYG01m59O7xLVi7Oe7WBGSN9DzYkAyBjau-EWMN5UrzdzrJGtghVzlOa0x4pduKYouz1J-wmqAgRplEoWqlRw9LVJeDv48I5_RSKkst6jOO2Vkr2yTD8BZwjc5Ys3CI7xG_KvtzWYpJ5Hrjh83gH4srKST1Gtdkh4J_gIim5Bg3V-s8MnAN3BdSAPRmA8gs1bOIIRmi5ogZ8uqAgnHMETZrQo2ixGXXEO2rPM34nj2CuUFN-Zv9NoNDZxrUojlfh7_XMvFJmQ7tunV03Qkdf0Wl7b63iV7YY9nDOZ0zSC__HCAglWCcsZwT6EEYtpmSmCCb8EaNmPqGKdKFVCYj-mWcE8TEslvvzgIfaVLNkLqJ1SWFW-QV3-B1LNfjY" _blank

click B "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqFUk1P20AQ_Sur5eqEAO3FrZDIx40TbU9eDht7HVu1d6P1GlMhpAR6rIRUofRvpAkpCSHhL-z-o84uIeKAhA_emfF7s2_e-AKHImLYx3EmqjChUqHjE8KPgr060r_1XD_otRnouRmaK73WE3OtFxDNECQrvdRjvdCrGiBm-g6SB4syg89deQj50twgR5y4JjNgrMzN7hY9hW4TOF35mWNGrj6A96OenxLeDPZByR_9V88c758ZmSvzy6K_nRyjNxit4MAxpu5CYG01m59O7xLVi7Oe7WBGSN9DzYkAyBjau-EWMN5UrzdzrJGtghVzlOa0x4pduKYouz1J-wmqAgRplEoWqlRw9LVJeDv48I5_RSKkst6jOO2Vkr2yTD8BZwjc5Ys3CI7xG_KvtzWYpJ5Hrjh83gH4srKST1Gtdkh4J_gIim5Bg3V-s8MnAN3BdSAPRmA8gs1bOIIRmi5ogZ8uqAgnHMETZrQo2ixGXXEO2rPM34nj2CuUFN-Zv9NoNDZxrUojlfh7_XMvFJmQ7tunV03Qkdf0Wl7b63iV7YY9nDOZ0zSC__HCAglWCcsZwT6EEYtpmSmCCb8EaNmPqGKdKFVCYj-mWcE8TEslvvzgIfaVLNkLqJ1SWFW-QV3-B1LNfjY" _blank

click C "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqFUk1P20AQ_Sur5eqEAO3FrZDIx40TbU9eDht7HVu1d6P1GlMhpAR6rIRUofRvpAkpCSHhL-z-o84uIeKAhA_emfF7s2_e-AKHImLYx3EmqjChUqHjE8KPgr060r_1XD_otRnouRmaK73WE3OtFxDNECQrvdRjvdCrGiBm-g6SB4syg89deQj50twgR5y4JjNgrMzN7hY9hW4TOF35mWNGrj6A96OenxLeDPZByR_9V88c758ZmSvzy6K_nRyjNxit4MAxpu5CYG01m59O7xLVi7Oe7WBGSN9DzYkAyBjau-EWMN5UrzdzrJGtghVzlOa0x4pduKYouz1J-wmqAgRplEoWqlRw9LVJeDv48I5_RSKkst6jOO2Vkr2yTD8BZwjc5Ys3CI7xG_KvtzWYpJ5Hrjh83gH4srKST1Gtdkh4J_gIim5Bg3V-s8MnAN3BdSAPRmA8gs1bOIIRmi5ogZ8uqAgnHMETZrQo2ixGXXEO2rPM34nj2CuUFN-Zv9NoNDZxrUojlfh7_XMvFJmQ7tunV03Qkdf0Wl7b63iV7YY9nDOZ0zSC__HCAglWCcsZwT6EEYtpmSmCCb8EaNmPqGKdKFVCYj-mWcE8TEslvvzgIfaVLNkLqJ1SWFW-QV3-B1LNfjY" _blank

click D "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqFUk1P20AQ_Sur5eqEAO3FrZDIx40TbU9eDht7HVu1d6P1GlMhpAR6rIRUofRvpAkpCSHhL-z-o84uIeKAhA_emfF7s2_e-AKHImLYx3EmqjChUqHjE8KPgr060r_1XD_otRnouRmaK73WE3OtFxDNECQrvdRjvdCrGiBm-g6SB4syg89deQj50twgR5y4JjNgrMzN7hY9hW4TOF35mWNGrj6A96OenxLeDPZByR_9V88c758ZmSvzy6K_nRyjNxit4MAxpu5CYG01m59O7xLVi7Oe7WBGSN9DzYkAyBjau-EWMN5UrzdzrJGtghVzlOa0x4pduKYouz1J-wmqAgRplEoWqlRw9LVJeDv48I5_RSKkst6jOO2Vkr2yTD8BZwjc5Ys3CI7xG_KvtzWYpJ5Hrjh83gH4srKST1Gtdkh4J_gIim5Bg3V-s8MnAN3BdSAPRmA8gs1bOIIRmi5ogZ8uqAgnHMETZrQo2ixGXXEO2rPM34nj2CuUFN-Zv9NoNDZxrUojlfh7_XMvFJmQ7tunV03Qkdf0Wl7b63iV7YY9nDOZ0zSC__HCAglWCcsZwT6EEYtpmSmCCb8EaNmPqGKdKFVCYj-mWcE8TEslvvzgIfaVLNkLqJ1SWFW-QV3-B1LNfjY" _blank

click E "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqFUk1P20AQ_Sur5eqEAO3FrZDIx40TbU9eDht7HVu1d6P1GlMhpAR6rIRUofRvpAkpCSHhL-z-o84uIeKAhA_emfF7s2_e-AKHImLYx3EmqjChUqHjE8KPgr060r_1XD_otRnouRmaK73WE3OtFxDNECQrvdRjvdCrGiBm-g6SB4syg89deQj50twgR5y4JjNgrMzN7hY9hW4TOF35mWNGrj6A96OenxLeDPZByR_9V88c758ZmSvzy6K_nRyjNxit4MAxpu5CYG01m59O7xLVi7Oe7WBGSN9DzYkAyBjau-EWMN5UrzdzrJGtghVzlOa0x4pduKYouz1J-wmqAgRplEoWqlRw9LVJeDv48I5_RSKkst6jOO2Vkr2yTD8BZwjc5Ys3CI7xG_KvtzWYpJ5Hrjh83gH4srKST1Gtdkh4J_gIim5Bg3V-s8MnAN3BdSAPRmA8gs1bOIIRmi5ogZ8uqAgnHMETZrQo2ixGXXEO2rPM34nj2CuUFN-Zv9NoNDZxrUojlfh7_XMvFJmQ7tunV03Qkdf0Wl7b63iV7YY9nDOZ0zSC__HCAglWCcsZwT6EEYtpmSmCCb8EaNmPqGKdKFVCYj-mWcE8TEslvvzgIfaVLNkLqJ1SWFW-QV3-B1LNfjY" _blank



{{< /mermaid >}}

Схема 4. Кроки методу Mermaid+SVG.

Нижче наведено кроки, які слід виконати для додавання діаграми за допомогою методу Mermaid+SVG:

1. Створіть діаграму за допомогою онлайн-редактора.
2. Збережіть URL діаграми для подальшого доступу.
3. Згенеруйте файл зображення `.svg` для діаграми та завантажте його до відповідної теки `images/`.
4. Використовуйте shortcode `{{</* figure */>}}` для посилання на діаграму у файлі `.md`.
5. Додайте підпис за допомогою параметра `caption` у shortcode `{{</* figure */>}}`.

Наприклад, використовуйте онлайн-редактор для створення діаграми з назвою `boxnet`. Збережіть URL діаграми для подальшого доступу. Згенеруйте та завантажте файл `boxnet.svg` до відповідної теки `../images/`.

Використовуйте shortcode `{{</* figure */>}}` у файлі `.md` вашого PR, щоб посилатися на файл зображення `.svg` та додати підпис.

```json
{{</* figure src="/static/images/boxnet.svg" alt="Boxnet figure" class="diagram-large" caption="Figure 14. Boxnet caption" */>}}
```

Для отримання додаткової інформації про підписи до діаграм дивіться [Як використовувати підписи](#how-to-use-captions).

{{< note >}}
Shortcode figure є рекомендованим методом для додавання файлів зображень `.svg` до вашої документації. Ви також можете використовувати стандартний Markdown синтаксис додавання зображень, наприклад: `![my boxnet diagram](static/images/boxnet.svg)`. Також потрібно буде додати підпис під діаграмою.
{{< /note >}}

Ви повинні додати URL онлайн-редактора як блок коментаря у файлі зображення `.svg`, використовуючи текстовий редактор. Наприклад, додайте таке на початку файлу зображення `.svg`:

```
<!-- Щоб переглянути або редагувати код Mermaid, використовуйте наступний URL: -->
<!-- https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb ... <продовження рядка URL> -->
```

Нижче наведено переваги методу Mermaid+SVG:

* Використання інструменту онлайн-редактора.
* Інструмент онлайн-редактора підтримує найсучасніший набір можливостей Mermaid.
* Використання наявних методів [kubernetes/website](https://github.com/kubernetes/website) для обробки файлів зображень `.svg`.
* Середовище не вимагає підтримки Mermaid.

Переконайтеся, що ваша діаграма правильно відображається, використовуючи [локальний](/docs/contribute/new-content/open-a-pr/#preview-locally) та Netlify попередній перегляд.

### Зовнішній інструмент {#external-tool}

На схемі 5 показано кроки, яких слід дотримуватися для додавання діаграми за допомогою зовнішнього інструменту.

Спочатку створіть діаграму за допомогою зовнішнього інструменту і збережіть її як файл зображення у форматі `.svg` або `.png`. Після цього виконайте ті самі кроки, що й у методі __Mermaid+SVG__ для додавання файлів зображень у форматі `.svg`.

{{< mermaid >}}
flowchart LR
A[1. Використовуйте зовнішній<br>інструмент для створення/редагування<br>діаграми]
B[2. Якщо можливо, збережіть<br>координати діаграми<br>для доступу<br>учасників]
C[3. Згенеруйте файл .svg<br>або .png<br>і завантажте його<br>до відповідної<br>теки images/]
subgraph w[ ]
direction TB
D[4. Використовуйте shortcode figure<br>для посилання на файл<br>svg або png<br>у файлі .md сторінки] -->
E[5. Додайте підпис]
end
A --> B
B --> C
C --> w
classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
class A,B,C,D,E,w box

click A "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqFk8tu00AYhV9l5G6dNOWyMahSc9mxAnZ2F449Tix8iewxKaoqpQkSICFVQog-BiGXkjSN8wr_vBFnJk6F2LCx_xmfOfOdf8aXhpf63LCMIEqHXt_NBHv12knO7JM6o2-0onsq5YhW8lqOqaSZnNAa1ZLRbzWkrfwhP6snrV92s1O8t0oqRxA-0BKjMaMFbeQN0xYzbYd5fLk51uWCpjSHfIa3nlZGtICVmh_h-UCrcydp2k_A9JPu5RcqGSZLuqMNEOFpKp5ftNSGd2Aay6_aBvh6xwV0W5qCYMX-9d7vpxnxKjX_hHZyohNN5Cesu8ZqNAMLZ0Bp2U-BcktznWSp0-7bIj_Cc00bVs_f97TxFFwlqw-S3r5BinS6D4sVU9Dqdq4BOqeyYkG-GfZa0E43XVVbkN1qC-iRa8XC2O3x_Bg8edHtZe6gz4Y2w9APM-6JME3Y26aTtO1n_znLvJ9mQt0DFoS9IuN_N2SnGoK1m8PpMNXHx5xKiqSsinlIOXkUIHA99veHj93VBVHw56xWO3WSjv0cbN9Bo25BdbN2VXKAIgxPfNxHJWcI09RFC0egi6GTeJGb520esG56Af4oso6CIDBzkaXvuHXUaDSqujYMfdG3TgYXppdGaaa_vagM2JnZNFtm2-yYQ-VkmEbMs9gNffwbl07CmGOIPo-5Y1gofR64RSQcw0muIC0Gvit4xw9FmhlW4EY5Nw23EOmbD4lnWCIr-EHUDl0cVVyprv4Ax97fkg"

click B "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqFk8tu00AYhV9l5G6dNOWyMahSc9mxAnZ2F449Tix8iewxKaoqpQkSICFVQog-BiGXkjSN8wr_vBFnJk6F2LCx_xmfOfOdf8aXhpf63LCMIEqHXt_NBHv12knO7JM6o2-0onsq5YhW8lqOqaSZnNAa1ZLRbzWkrfwhP6snrV92s1O8t0oqRxA-0BKjMaMFbeQN0xYzbYd5fLk51uWCpjSHfIa3nlZGtICVmh_h-UCrcydp2k_A9JPu5RcqGSZLuqMNEOFpKp5ftNSGd2Aay6_aBvh6xwV0W5qCYMX-9d7vpxnxKjX_hHZyohNN5Cesu8ZqNAMLZ0Bp2U-BcktznWSp0-7bIj_Cc00bVs_f97TxFFwlqw-S3r5BinS6D4sVU9Dqdq4BOqeyYkG-GfZa0E43XVVbkN1qC-iRa8XC2O3x_Bg8edHtZe6gz4Y2w9APM-6JME3Y26aTtO1n_znLvJ9mQt0DFoS9IuN_N2SnGoK1m8PpMNXHx5xKiqSsinlIOXkUIHA99veHj93VBVHw56xWO3WSjv0cbN9Bo25BdbN2VXKAIgxPfNxHJWcI09RFC0egi6GTeJGb520esG56Af4oso6CIDBzkaXvuHXUaDSqujYMfdG3TgYXppdGaaa_vagM2JnZNFtm2-yYQ-VkmEbMs9gNffwbl07CmGOIPo-5Y1gofR64RSQcw0muIC0Gvit4xw9FmhlW4EY5Nw23EOmbD4lnWCIr-EHUDl0cVVyprv4Ax97fkg"

click C "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqFk8tu00AYhV9l5G6dNOWyMahSc9mxAnZ2F449Tix8iewxKaoqpQkSICFVQog-BiGXkjSN8wr_vBFnJk6F2LCx_xmfOfOdf8aXhpf63LCMIEqHXt_NBHv12knO7JM6o2-0onsq5YhW8lqOqaSZnNAa1ZLRbzWkrfwhP6snrV92s1O8t0oqRxA-0BKjMaMFbeQN0xYzbYd5fLk51uWCpjSHfIa3nlZGtICVmh_h-UCrcydp2k_A9JPu5RcqGSZLuqMNEOFpKp5ftNSGd2Aay6_aBvh6xwV0W5qCYMX-9d7vpxnxKjX_hHZyohNN5Cesu8ZqNAMLZ0Bp2U-BcktznWSp0-7bIj_Cc00bVs_f97TxFFwlqw-S3r5BinS6D4sVU9Dqdq4BOqeyYkG-GfZa0E43XVVbkN1qC-iRa8XC2O3x_Bg8edHtZe6gz4Y2w9APM-6JME3Y26aTtO1n_znLvJ9mQt0DFoS9IuN_N2SnGoK1m8PpMNXHx5xKiqSsinlIOXkUIHA99veHj93VBVHw56xWO3WSjv0cbN9Bo25BdbN2VXKAIgxPfNxHJWcI09RFC0egi6GTeJGb520esG56Af4oso6CIDBzkaXvuHXUaDSqujYMfdG3TgYXppdGaaa_vagM2JnZNFtm2-yYQ-VkmEbMs9gNffwbl07CmGOIPo-5Y1gofR64RSQcw0muIC0Gvit4xw9FmhlW4EY5Nw23EOmbD4lnWCIr-EHUDl0cVVyprv4Ax97fkg"

click D "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqFk8tu00AYhV9l5G6dNOWyMahSc9mxAnZ2F449Tix8iewxKaoqpQkSICFVQog-BiGXkjSN8wr_vBFnJk6F2LCx_xmfOfOdf8aXhpf63LCMIEqHXt_NBHv12knO7JM6o2-0onsq5YhW8lqOqaSZnNAa1ZLRbzWkrfwhP6snrV92s1O8t0oqRxA-0BKjMaMFbeQN0xYzbYd5fLk51uWCpjSHfIa3nlZGtICVmh_h-UCrcydp2k_A9JPu5RcqGSZLuqMNEOFpKp5ftNSGd2Aay6_aBvh6xwV0W5qCYMX-9d7vpxnxKjX_hHZyohNN5Cesu8ZqNAMLZ0Bp2U-BcktznWSp0-7bIj_Cc00bVs_f97TxFFwlqw-S3r5BinS6D4sVU9Dqdq4BOqeyYkG-GfZa0E43XVVbkN1qC-iRa8XC2O3x_Bg8edHtZe6gz4Y2w9APM-6JME3Y26aTtO1n_znLvJ9mQt0DFoS9IuN_N2SnGoK1m8PpMNXHx5xKiqSsinlIOXkUIHA99veHj93VBVHw56xWO3WSjv0cbN9Bo25BdbN2VXKAIgxPfNxHJWcI09RFC0egi6GTeJGb520esG56Af4oso6CIDBzkaXvuHXUaDSqujYMfdG3TgYXppdGaaa_vagM2JnZNFtm2-yYQ-VkmEbMs9gNffwbl07CmGOIPo-5Y1gofR64RSQcw0muIC0Gvit4xw9FmhlW4EY5Nw23EOmbD4lnWCIr-EHUDl0cVVyprv4Ax97fkg"

click E "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNqFk8tu00AYhV9l5G6dNOWyMahSc9mxAnZ2F449Tix8iewxKaoqpQkSICFVQog-BiGXkjSN8wr_vBFnJk6F2LCx_xmfOfOdf8aXhpf63LCMIEqHXt_NBHv12knO7JM6o2-0onsq5YhW8lqOqaSZnNAa1ZLRbzWkrfwhP6snrV92s1O8t0oqRxA-0BKjMaMFbeQN0xYzbYd5fLk51uWCpjSHfIa3nlZGtICVmh_h-UCrcydp2k_A9JPu5RcqGSZLuqMNEOFpKp5ftNSGd2Aay6_aBvh6xwV0W5qCYMX-9d7vpxnxKjX_hHZyohNN5Cesu8ZqNAMLZ0Bp2U-BcktznWSp0-7bIj_Cc00bVs_f97TxFFwlqw-S3r5BinS6D4sVU9Dqdq4BOqeyYkG-GfZa0E43XVVbkN1qC-iRa8XC2O3x_Bg8edHtZe6gz4Y2w9APM-6JME3Y26aTtO1n_znLvJ9mQt0DFoS9IuN_N2SnGoK1m8PpMNXHx5xKiqSsinlIOXkUIHA99veHj93VBVHw56xWO3WSjv0cbN9Bo25BdbN2VXKAIgxPfNxHJWcI09RFC0egi6GTeJGb520esG56Af4oso6CIDBzkaXvuHXUaDSqujYMfdG3TgYXppdGaaa_vagM2JnZNFtm2-yYQ-VkmEbMs9gNffwbl07CmGOIPo-5Y1gofR64RSQcw0muIC0Gvit4xw9FmhlW4EY5Nw23EOmbD4lnWCIr-EHUDl0cVVyprv4Ax97fkg"

{{< /mermaid >}}

Схема 5. Кроки методу External Tool

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

* Ви можете включати кілька логотипів `.svg` або `.png`, іконок та зображень у свою діаграму. Однак, переконайтеся, що ви дотримуєтеся авторського права та [настанов](/docs/contribute/style/content-guide/) документації Kubernetes щодо використання контенту третіх сторін.
* Ви повинні зберегти координати діаграми для подальшого доступу інших учасників. Наприклад, ваш інструмент може надати посилання на зображення діаграми, або ви можете зберегти файл з вихідним кодом, наприклад `.xml`, для доступу інших учасників.

Для отримання додаткової інформації про логотипи та зображення K8s і CNCF, зверніться до розділу [CNCF Artwork](https://github.com/cncf/artwork).

Нижче наведено переваги методу External Tool:

* Учасники добре знайомі з зовнішнім інструментом.
* Діаграми потребують більше деталей, ніж може надати Mermaid.

Не забудьте перевірити, чи правильно відображається ваша діаграма, використовуючи [локальний](/docs/contribute/new-content/open-a-pr/#preview-locally) та Netlify попередній перегляд.

## Приклади {#examples}

У цьому розділі показано кілька прикладів діаграм Mermaid.

{{< note >}}
У прикладах блоків коду не використано теґ Hugo Mermaid. Це дозволяє вам скопіювати блок коду до онлайн-редактора, щоб поекспериментувати самостійно. Зверніть увагу, що редактор не розпізнає Hugo shortcodes.
{{< /note >}}

### Приклад 1 — Обмеження на поширення топології Podʼів {#example-1-pod-topology-spread-constraints}

Схема 6 показує діаграму зі сторінки [Обмеження на поширення топології Podʼів](/docs/concepts/scheduling-eviction/topology-spread-constraints/#node-labels).

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

Схема 6. Обмеження поширення топології Podʼів.

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

### Приклад 2 — Ingress {#example-2-ingress}

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

### Приклад 3 — Потік системи K8s {#example-3-k8s-system-flow}

На схемі 8 зображено Mermaid-діаграму послідовності, яка показує системний потік між компонентами K8s для запуску контейнера.

{{< figure src="/docs/images/diagram-guide-example-3.svg" alt="Діаграма потоку системи K8s" class="diagram-large" caption="Схема 8. Діаграма потоку системи K8s" link="https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiJSV7aW5pdDp7XCJ0aGVtZVwiOlwibmV1dHJhbFwifX0lJVxuc2VxdWVuY2VEaWFncmFtXG4gICAgYWN0b3IgbWVcbiAgICBwYXJ0aWNpcGFudCBhcGlTcnYgYXMgY29udHJvbCBwbGFuZTxicj48YnI-YXBpLXNlcnZlclxuICAgIHBhcnRpY2lwYW50IGV0Y2QgYXMgY29udHJvbCBwbGFuZTxicj48YnI-ZXRjZCBkYXRhc3RvcmVcbiAgICBwYXJ0aWNpcGFudCBjbnRybE1nciBhcyBjb250cm9sIHBsYW5lPGJyPjxicj5jb250cm9sbGVyPGJyPm1hbmFnZXJcbiAgICBwYXJ0aWNpcGFudCBzY2hlZCBhcyBjb250cm9sIHBsYW5lPGJyPjxicj5zY2hlZHVsZXJcbiAgICBwYXJ0aWNpcGFudCBrdWJlbGV0IGFzIG5vZGU8YnI-PGJyPmt1YmVsZXRcbiAgICBwYXJ0aWNpcGFudCBjb250YWluZXIgYXMgbm9kZTxicj48YnI-Y29udGFpbmVyPGJyPnJ1bnRpbWVcbiAgICBtZS0-PmFwaVNydjogMS4ga3ViZWN0bCBjcmVhdGUgLWYgcG9kLnlhbWxcbiAgICBhcGlTcnYtLT4-ZXRjZDogMi4gc2F2ZSBuZXcgc3RhdGVcbiAgICBjbnRybE1nci0-PmFwaVNydjogMy4gY2hlY2sgZm9yIGNoYW5nZXNcbiAgICBzY2hlZC0-PmFwaVNydjogNC4gd2F0Y2ggZm9yIHVuYXNzaWduZWQgcG9kcyhzKVxuICAgIGFwaVNydi0-PnNjaGVkOiA1LiBub3RpZnkgYWJvdXQgcG9kIHcgbm9kZW5hbWU9XCIgXCJcbiAgICBzY2hlZC0-PmFwaVNydjogNi4gYXNzaWduIHBvZCB0byBub2RlXG4gICAgYXBpU3J2LS0-PmV0Y2Q6IDcuIHNhdmUgbmV3IHN0YXRlXG4gICAga3ViZWxldC0-PmFwaVNydjogOC4gbG9vayBmb3IgbmV3bHkgYXNzaWduZWQgcG9kKHMpXG4gICAgYXBpU3J2LT4-a3ViZWxldDogOS4gYmluZCBwb2QgdG8gbm9kZVxuICAgIGt1YmVsZXQtPj5jb250YWluZXI6IDEwLiBzdGFydCBjb250YWluZXJcbiAgICBrdWJlbGV0LT4-YXBpU3J2OiAxMS4gdXBkYXRlIHBvZCBzdGF0dXNcbiAgICBhcGlTcnYtLT4-ZXRjZDogMTIuIHNhdmUgbmV3IHN0YXRlIiwibWVybWFpZCI6IntcbiAgXCJ0aGVtZVwiOiBcImRlZmF1bHRcIlxufSIsInVwZGF0ZUVkaXRvciI6ZmFsc2UsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjp0cnVlfQ" >}}

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

Ви можете стилізувати один або кілька елементів діаграми за допомогою загальновідомої номенклатури CSS. Це досягається за допомогою двох типів операторів у коді Mermaid.

* `classDef` визначає клас атрибутів стилю.
* `class` визначає один або кілька елементів, до яких буде застосовано клас.

У коді до [схеми 7](https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZ3JhcGggIExSXG4gIGNsaWVudChbY2xpZW50XSktLiBJbmdyZXNzLW1hbmFnZWQgPGJyPiBsb2FkIGJhbGFuY2VyIC4tPmluZ3Jlc3NbSW5ncmVzc107XG4gIGluZ3Jlc3MtLT58cm91dGluZyBydWxlfHNlcnZpY2VbU2VydmljZV07XG4gIHN1YmdyYXBoIGNsdXN0ZXJcbiAgaW5ncmVzcztcbiAgc2VydmljZS0tPnBvZDFbUG9kXTtcbiAgc2VydmljZS0tPnBvZDJbUG9kXTtcbiAgZW5kXG4gIGNsYXNzRGVmIHBsYWluIGZpbGw6I2RkZCxzdHJva2U6I2ZmZixzdHJva2Utd2lkdGg6NHB4LGNvbG9yOiMwMDA7XG4gIGNsYXNzRGVmIGs4cyBmaWxsOiMzMjZjZTUsc3Ryb2tlOiNmZmYsc3Ryb2tlLXdpZHRoOjRweCxjb2xvcjojZmZmO1xuICBjbGFzc0RlZiBjbHVzdGVyIGZpbGw6I2ZmZixzdHJva2U6I2JiYixzdHJva2Utd2lkdGg6MnB4LGNvbG9yOiMzMjZjZTU7XG4gIGNsYXNzIGluZ3Jlc3Msc2VydmljZSxwb2QxLHBvZDIgazhzO1xuICBjbGFzcyBjbGllbnQgcGxhaW47XG4gIGNsYXNzIGNsdXN0ZXIgY2x1c3RlcjtcbiIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkZWZhdWx0XCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6dHJ1ZX0), ви можете побачити приклади обох.

```text
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff; // визначає стиль для класу k8s
class ingress,service,pod1,pod2 k8s; // Клас k8s застосовується до елементів ingress, service, pod1 та pod2.
```

Ви можете включити один або кілька операторів `classDef` та `class` у вашу діаграму. Ви також можете використовувати офіційний шістнадцятковий код кольору K8s `#326ce5` для компонентів K8s у вашій діаграмі.

Для отримання додаткової інформації про стилізацію та класи див. [документацію Mermaid про стилі та класи](https://mermaid-js.github.io/mermaid/#/flowchart?id=styling-and-classes).

## Як використовувати підписи до діаграм {#how-to-use-captions}

Підпис — це короткий опис діаграми. Підпис може містити назву або короткий опис діаграми. Підписи не замінюють пояснювальний текст у вашій документації, а радше слугують як "контекстний звʼязок" між цим текстом та вашою діаграмою.

Поєднання тексту та діаграми, повʼязаних разом за допомогою підпису, допомагає надати чітке уявлення про інформацію, яку ви хочете донести до користувача.

Без підписів ви змушуєте користувача шукати текст над або під діаграмою, щоб зрозуміти її значення. Це може викликати невдоволення користувача.

На схемі 9 показано три компоненти правильного використання підписів: діаграма, підпис до діаграми та посилання на діаграму в тексті.

{{< mermaid >}}
flowchart
A[Діаграма<br><br>Вбудований код Mermaid<br>або файли зображень SVG]
B[Підпис до діаграми<br><br>Додайте номер схеми<br>і текст підпису]
C[Посилання на діаграму<br><br>Вкажіть номер схеми<br>у тексті]

    classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
    class A,B,C box

click A "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp1kc1OwkAQx19ls1xrgtdqTPgwnjyReKEelnYrjf0gZQkYQsKH3kxMDOnVVwAFLSDlFWbeyFlERRM32cnszj__38xul9uRI7nJXT9q23URKyssVGGMCUzgBfsU32FyXItP9IZHmOIIZpDBM1XWkMKCwZKOM3Yu40B4zlY2gSlkDG8pWcAKUgZvpJlu7V5hDmu8Z5WLs0srLFbhiVgz2ECKA6atKfyip9_0sQZpTxzCnBE-o_Ic-wwHeEe2Oy0mTAtgSddDBpsffxwRskRIyHBAza-2Q6zxQZtN_oBxtDf2UneOCQ6p8__Boz0wJsSyQkbL9kWzWZYuq0Ud5nq-b-Zc1zWaKo6upZnL5_O7_KDtOapuHjY6hh35UbytHe2ZsIJRNErahxs8-Hxx-ryullhc1WUgLW5S6khXtHxlcSvskbTVcISSp46nopibrvCb0uCipaLKTWhzU8Ut-SUqe-IqFsFO1fsA9lEZHQ" _blank

click B "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp1kc1OwkAQx19ls1xrgtdqTPgwnjyReKEelnYrjf0gZQkYQsKH3kxMDOnVVwAFLSDlFWbeyFlERRM32cnszj__38xul9uRI7nJXT9q23URKyssVGGMCUzgBfsU32FyXItP9IZHmOIIZpDBM1XWkMKCwZKOM3Yu40B4zlY2gSlkDG8pWcAKUgZvpJlu7V5hDmu8Z5WLs0srLFbhiVgz2ECKA6atKfyip9_0sQZpTxzCnBE-o_Ic-wwHeEe2Oy0mTAtgSddDBpsffxwRskRIyHBAza-2Q6zxQZtN_oBxtDf2UneOCQ6p8__Boz0wJsSyQkbL9kWzWZYuq0Ud5nq-b-Zc1zWaKo6upZnL5_O7_KDtOapuHjY6hh35UbytHe2ZsIJRNErahxs8-Hxx-ryullhc1WUgLW5S6khXtHxlcSvskbTVcISSp46nopibrvCb0uCipaLKTWhzU8Ut-SUqe-IqFsFO1fsA9lEZHQ" _blank

click C "https://mermaid-js.github.io/mermaid-live-editor/edit/#pako:eNp1kc1OwkAQx19ls1xrgtdqTPgwnjyReKEelnYrjf0gZQkYQsKH3kxMDOnVVwAFLSDlFWbeyFlERRM32cnszj__38xul9uRI7nJXT9q23URKyssVGGMCUzgBfsU32FyXItP9IZHmOIIZpDBM1XWkMKCwZKOM3Yu40B4zlY2gSlkDG8pWcAKUgZvpJlu7V5hDmu8Z5WLs0srLFbhiVgz2ECKA6atKfyip9_0sQZpTxzCnBE-o_Ic-wwHeEe2Oy0mTAtgSddDBpsffxwRskRIyHBAza-2Q6zxQZtN_oBxtDf2UneOCQ6p8__Boz0wJsSyQkbL9kWzWZYuq0Ud5nq-b-Zc1zWaKo6upZnL5_O7_KDtOapuHjY6hh35UbytHe2ZsIJRNErahxs8-Hxx-ryullhc1WUgLW5S6khXtHxlcSvskbTVcISSp46nopibrvCb0uCipaLKTWhzU8Ut-SUqe-IqFsFO1fsA9lEZHQ" _blank

{{< /mermaid >}}

Схема 9. Складові підпису.

{{< note >}}
Ви завжди повинні додавати підпис до кожної діаграми у вашій документації.
{{< /note >}}

**Діаграма**

Методи `Mermaid+SVG` та `External Tool` генерують файли зображень у форматі `.svg`.

Ось shortcode `{{</* figure */>}}` для діаграми, визначеної у файлі зображення `.svg`, збереженому в `/images/docs/components-of-kubernetes.svg`:

```none
{{</* figure src="/images/docs/components-of-kubernetes.svg" alt="Kubernetes pod running inside a cluster" class="diagram-large" caption="Схема 4. Компоненти архітектури Kubernetes" */>}}
```

Ви повинні передавати значення `src`, `alt`, `class` та `caption` у shortcode `{{</* figure */>}}`. Ви можете змінювати розмір діаграми, використовуючи класи `diagram-large`, `diagram-medium` та `diagram-small`.

{{< note >}}
Діаграми, створені за допомогою методу `Inline`, не використовують shortcode figure. Код Mermaid визначає, як діаграма буде відображатися на вашій сторінці.
{{< /note >}}

Дивіться [Методи створення діаграм](#methods-for-creating-diagrams) для отримання додаткової інформації про різні методи створення діаграм.

**Підпис до діаграми**

Далі додайте підпис до діаграми.

Якщо ваша діаграма визначена у файлі зображення `.svg`, використовуйте параметр `caption` shortcode `{{</* figure */>}}`.

```none
{{</* figure src="/images/docs/components-of-kubernetes.svg" alt="Kubernetes pod running inside a cluster" class="diagram-large" caption="Схема 4. Компоненти архітектури Kubernetes" */>}}
```

Якщо ваша діаграма визначена вбудованим кодом Mermaid, використовуйте текст Markdown.

```none
Схема 4. Компоненти архітектури Kubernetes
```

Нижче наведено кілька аспектів, які слід враховувати під час додавання підписів до діаграм:

* Використовуйте shortcode `{{</* figure */>}}` для додавання підпису до діаграм, створених за допомогою методів `Mermaid+SVG` та `External Tool`.
* Використовуйте простий текст Markdown для додавання підпису до діаграм, створених за допомогою методу `Inline`.
* Перед підписом діаграми додайте `Схема НОМЕР.`. Ви повинні використовувати слово `Схема`, і номер повинен бути унікальним для кожної діаграми на вашій сторінці документації. Додайте крапку після номера.
* Додайте текст підпису діаграми після `Схема НОМЕР.` в тому ж рядку. Підпис повинен закінчуватися крапкою. Зберігайте текст підпису коротким.
* Розташовуйте підпис до діаграми __ПІД__ вашою діаграмою.

**Посилання на діаграму**

Нарешті, ви можете додати посилання на діаграму. Воно використовується у вашому тексті та повинно передувати самій діаграмі. Це дозволяє користувачеві повʼязати ваш текст із відповідною діаграмою. `Схема НОМЕР` у вашому посиланні та підписі мають збігатися.

Вам слід уникати просторових посилань, таких як `..зображення нижче..` або `..наступна схема..`

Ось приклад посилання на діаграму:

```text
Схема 10 зображує компоненти архітектури Kubernetes.
Панель управління ...
```

Посилання на діаграми є необовʼязковими, і є випадки, коли вони можуть бути невідповідними. Якщо ви не впевнені, додайте посилання на діаграму у ваш текст, щоб побачити, чи виглядає і звучить воно добре. Коли виникають сумніви, використовуйте посилання на діаграму.

**Повна картина**

Схема 10 показує діаграму архітектури Kubernetes, яка включає діаграму, підпис до діаграми та посилання на діаграму. Shortcode `{{</* figure */>}}` показує діаграму, додає підпис і включає необовʼязковий параметр `link`, щоб ви могли мати гіперпосилання на діаграму. Посилання на діаграму міститься в цьому абзаці.

Ось shortcode `{{</* figure */>}}` для цієї діаграми:

```
{{</* figure src="/images/docs/components-of-kubernetes.svg" alt="Kubernetes pod running inside a cluster" class="diagram-large" caption="Схема 10. Архітектура Kubernetes." link="https://kubernetes.io/docs/concepts/overview/components/" */>}}
```

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Kubernetes pod running inside a cluster" class="diagram-large" caption="Схема 10. Архітектура Kubernetes." link="/uk/docs/concepts/overview/components/" >}}

## Поради {#tips}

* Завжди використовуйте онлайн-редактор для створення/редагування вашої діаграми.

* Завжди використовуйте локальний Hugo та попередній перегляд Netlify, щоб перевірити, як діаграма відображається в документації.

* Включайте джерела діаграм, такі як URL, місцезнаходження вихідного коду або вказуйте, що код є самодокументуючим.

* Завжди використовуйте підписи до діаграм.

* Дуже корисно включати зображення діаграми у форматі `.svg` або `.png` та/або вихідний код Mermaid у тікетах та PRs.

* Для методів `Mermaid+SVG` та `External Tool` використовуйте файли зображень `.svg`, оскільки вони залишаються чіткими під час збільшення діаграми.

* Найкраща практика для файлів `.svg` — завантажити їх в інструмент для редагування SVG та використати функцію "Конвертувати текст у криві". Це гарантує, що діаграма відображатиметься однаково на всіх системах, незалежно від доступності шрифтів і підтримки рендерингу шрифтів.

* Mermaid не підтримує додаткові іконки або зображення.

* Shortcodes Hugo Mermaid не працюють в онлайн-редакторі.

* Кожного разу, коли ви змінюєте діаграму в онлайн-редакторі, ви __повинні__ зберегти її, щоб згенерувати новий URL для діаграми.

* Натисніть на діаграми в цьому розділі, щоб переглянути код і відображення діаграми в онлайн-редакторі.

* Перегляньте вихідний код цієї сторінки, `diagram-guide.md`, для отримання додаткових прикладів.

* Ознайомтеся з [документацією Mermaid](https://mermaid-js.github.io/mermaid/#/), щоб отримати пояснення та приклади.

Найважливіше — __Робіть діаграми простими__. Це заощадить час вам і вашим колегам-учасникам, а також полегшить читання для нових та досвідчених користувачів.
