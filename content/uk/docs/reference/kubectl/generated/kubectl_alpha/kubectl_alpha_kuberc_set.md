---
title: kubectl alpha kuberc set
content_type: tool-reference
weight: 30
auto_generated: true
---

## {{% heading "synopsis" %}}

Встановлює значення у файлі конфігурації kuberc.

Використовуйте --section, щоб вказати, чи встановлювати стандартні значення чи аліаси.

Для стандартних значень: Встановлює стандартні значення прапорців для команд kubectl. Прапорець --command повинен вказувати лише команду (наприклад, "get", "create", "set env"), не ресурси.

Для аліасів: Створює аліас команд з опціональними значеннями прапорців та аргументами. Використовуйте --prependarg та --appendarg, щоб включити ресурси або інші аргументи.

```sh
kubectl alpha kuberc set --section (defaults|aliases) --command COMMAND
```

## {{% heading "examples" %}}

```sh
  # Встановити стандартний формат виводу команди 'get'
  kubectl alpha kuberc set --section defaults --command get --option output=wide

  # Встановити стандартний формат виводу для підкоманди
  kubectl alpha kuberc set --section defaults --command "set env" --option output=yaml

  # Створити аліас 'getn' для команди 'get' з попередньо доданим ресурсом 'nodes'
  kubectl alpha kuberc set --section aliases --name getn --command get --prependarg nodes --option output=wide

  # Створити аліас 'runx' для команди 'run' з доданими аргументами
  kubectl alpha kuberc set --section aliases --name runx --command run --option image=nginx --appendarg "--" --appendarg custom-arg1

  # Перезаписати наявне стандартне значення
  kubectl alpha kuberc set --section defaults --command get --option output=json --overwrite
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--appendarg strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Аргумент для додавання до команди (можна вказувати кілька разів, лише для аліасів)</p></td>
</tr>

<tr>
<td colspan="2">--command string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Команда для налаштування (наприклад, 'get', 'create', 'set env')</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>довідка для set</p></td>
</tr>

<tr>
<td colspan="2">--kuberc string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу kuberc для використання налаштувань. Це можна вимкнути, експортувавши KUBECTL_KUBERC=false або вимкнувши функцію KUBERC=off.</p></td>
</tr>

<tr>
<td colspan="2">--name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Назва аліасу (обовʼязково для --section=aliases)</p></td>
</tr>

<tr>
<td colspan="2">--option strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Опція прапорця у формі flag=value (можна вказувати кілька разів)</p></td>
</tr>

<tr>
<td colspan="2">--overwrite</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Дозволити перезапис наявних записів</p></td>
</tr>

<tr>
<td colspan="2">--prependarg strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Аргумент для додавання на початку команди (можна вказувати кілька разів, лише для аліасів)</p></td>
</tr>

<tr>
<td colspan="2">--section string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Розділ для модифікації: 'defaults' або 'aliases'</p></td>
</tr>

</tbody>
</table>

## {{% heading "parentoptions" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--as string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя користувача для виконання операції. Користувач може бути звичайним користувачем або службовим обліковим записом  в просторі імен.</p></td>
</tr>

<tr>
<td colspan="2">--as-group strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Група для виконання операції, цей прапорець можна повторювати для вказівки кількох груп.</p></td>
</tr>

<tr>
<td colspan="2">--as-uid string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>UID для виконання операції.</p></td>
</tr>

<tr>
<td colspan="2">--as-user-extra strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Додаткові дані користувача для виконання операції, цей прапорець можна повторювати для вказівки кількох значень для одного ключа.</p></td>
</tr>

<tr>
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "$HOME/.kube/cache"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Стандартна тека кешу</p></td>
</tr>

<tr>
<td colspan="2">--certificate-authority string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу сертифіката для центру сертифікації</p></td>
</tr>

<tr>
<td colspan="2">--client-certificate string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу клієнтського сертифіката для TLS</p></td>
</tr>

<tr>
<td colspan="2">--client-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу клієнтського ключа для TLS</p></td>
</tr>

<tr>
<td colspan="2">--cluster string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Назва кластера kubeconfig для використання</p></td>
</tr>

<tr>
<td colspan="2">--context string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Назва контексту kubeconfig для використання</p></td>
</tr>

<tr>
<td colspan="2">--disable-compression</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, відмовитися від стиснення відповідей для всіх запитів до сервера</p></td>
</tr>

<tr>
<td colspan="2">--insecure-skip-tls-verify</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, сертифікат сервера не буде перевірятися на дійсність. Це зробить ваші HTTPS-зʼєднання небезпечними</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу kubeconfig для використання в запитах CLI.</p></td>
</tr>

<tr>
<td colspan="2">--match-server-version</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Вимагати, щоб версія сервера відповідала версії клієнта</p></td>
</tr>

<tr>
<td colspan="2">-n, --namespace string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Якщо присутній, область простору імен для цього запиту CLI</p></td>
</tr>

<tr>
<td colspan="2">--password string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Пароль для базової автентифікації до API сервера</p></td>
</tr>

<tr>
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Назва профілю для захоплення. Одне з (none|cpu|heap|goroutine|threadcreate|block|mutex|trace)</p></td>
</tr>

<tr>
<td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "profile.pprof"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Назва файлу для запису профілю</p></td>
</tr>

<tr>
<td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість часу очікування перед відмовою від одного запиту до сервера. Ненульові значення повинні містити відповідну одиницю часу (наприклад, 1s, 2m, 3h). Значення нуль означає, що запити не повинні мати обмеження за часом.</p></td>
</tr>

<tr>
<td colspan="2">-s, --server string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Адреса та порт сервера Kubernetes API</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Стандартно: 1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Записи в драйвері сховища будуть буферизуватися протягом цієї тривалості та зафіксовані до нелокальних бекендів як єдина транзакція</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cadvisor"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>назва бази даних</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "localhost:8086"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>хост бази даних:порт</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>пароль бази даних</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-secure</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>використовувати захищене зʼєднання з базою даних</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stats"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>назва таблиці</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>імʼя користувача бази даних</p></td>
</tr>

<tr>
<td colspan="2">--tls-server-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Назва сервера для використання при перевірці сертифіката сервера. Якщо не надано, використовується імʼя хоста, використане для звʼязку з сервером</p></td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Токен на предʼявника для аутентифікації до API сервера</p></td>
</tr>

<tr>
<td colspan="2">--user string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя користувача kubeconfig для використання</p></td>
</tr>

<tr>
<td colspan="2">--username string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя користувача для базової автентифікації в API сервера</p></td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>--version, --version=raw виводить інформацію про версію та виходить; --version=vX.Y.Z... встановлює отриману версію</p></td>
</tr>

<tr>
<td colspan="2">--warnings-as-errors</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Трактувати попередження, отримані від сервера, як помилки та виходити з ненульовим кодом виходу</p></td>
</tr>

</tbody>
</table>

## {{% heading "seealso" %}}

* [kubectl alpha kuberc](../) — Керувати файлами конфігурації kuberc
