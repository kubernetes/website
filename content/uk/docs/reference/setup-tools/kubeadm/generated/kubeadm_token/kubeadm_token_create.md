<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->


Створює токени bootstrap на сервері

### Опис {#synopsis}



Ця команда створить для вас токен bootstrap. Ви можете вказати способи використання цього токена, "час життя" і необовʼязковий опис, зрозумілий людині.

[token] — це власне токен, який потрібно записати. Це має бути безпечно згенерований випадковий токен у форматі "[a-z0-9]{6}.[a-z0-9]{16}". Якщо [token] не вказано, kubeadm натомість згенерує випадковий токен.


```
kubeadm token create [token]
```

### Параметри {#options}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--certificate-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Якщо використовується разом із '--print-join-command', виводить повний прапорець 'kubeadm join', необхідний для приєднання до кластера в ролі панелі управління. Щоб створити новий ключ сертифіката, потрібно використати 'kubeadm init phase upload-certs --upload-certs'.</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до конфігураційного файлу kubeadm.</p></td>
</tr>

<tr>
<td colspan="2">--description string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Зрозумілий для людини опис того, як використовується цей токен.</p></td>
</tr>

<tr>
<td colspan="2">--groups strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "system:bootstrappers:kubeadm:default-node-token"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Додаткові групи, від імені яких цей токен автентифікуватиметься, коли його використовують для автентифікації. Має відповідати &quot;\Asystem:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]\z&quot;</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>довідка для create</p></td>
</tr>

<tr>
<td colspan="2">--print-join-command</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Замість того, щоб виводити тільки токен, вивести повний прапорець 'kubeadm join', необхідний для приєднання до кластера за допомогою токена.</p></td>
</tr>

<tr>
<td colspan="2">--ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 24h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Час до автоматичного видалення токена (наприклад, 1s, 2m, 3h). Якщо встановлено '0', термін дії токена ніколи не спливе</p></td>
</tr>

<tr>
<td colspan="2">--usages strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "signing,authentication"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Описує способи, якими можна використовувати цей токен. Ви можете передавати --usages кілька разів або надати список параметрів через кому. Допустимі параметри: [signing,authentication]</p></td>
</tr>

</tbody>
</table>



### Параметри, успадковані від батьківських команд {#options-inherited-from-parent-commands}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Чи вмикати режим пробного запуску</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig, який використовується для спілкування з кластером. Якщо прапорець не встановлено, може бути переглянутий набір стандартних місць для пошуку наявного файлу kubeconfig.</p></td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до 'справжньої' кореневої файлової системи хоста. Це змусить kubeadm виконати chroot у вказаний шлях.</p></td>
</tr>

</tbody>
</table>



