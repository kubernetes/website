
Створює токени запуску на сервері.

### Опис {#synopsis}

Ця команда створює токен запуску для вас. Ви можете вказати способи використання цього токену, "час життя" і необовʼязковий опис, зрозумілий людині.

[token] — це власне токен, який потрібно записати. Це має бути безпечно згенерований випадковий токен виду "[a-z0-9]{6}.[a-z0-9]{16}". Якщо [token] не вказано, kubeadm згенерує випадковий токен замість нього.

```shell
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
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо використовується разом із '--print-join-command', виводить повний прапорець 'kubeadm join', необхідний для приєднання до кластера як панелі управління. Щоб створити новий ключ сертифіката, потрібно використовувати 'kubeadm init phase upload-certs --upload-certs'.</p></td>
        </tr>
        <tr>
            <td colspan="2">--config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу конфігурації kubeadm.</p></td>
        </tr>
        <tr>
            <td colspan="2">--description string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Опис, зрозумілий для людини, як використовується цей токен.</p></td>
        </tr>
        <tr>
            <td colspan="2">--groups strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "system:bootstrappers:kubeadm:default-node-token"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Додаткові групи, які будуть автентифікуватися за допомогою цього токена при використанні для автентифікації. Повинно відповідати &quot;\Asystem:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]\z&quot;</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>довідка create</p></td>
        </tr>
        <tr>
            <td colspan="2">--print-join-command</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Замість того, щоб виводити тільки токен, вивести повний прапорець 'kubeadm join', необхідний для приєднання до кластера за допомогою токена.</p></td>
        </tr>
        <tr>
            <td colspan="2">--ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 24h0m0s</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість перед автоматичним видаленням токена (наприклад, 1s, 2m, 3h). Якщо встановлено '0', токен ніколи не закінчиться.</p></td>
        </tr>
        <tr>
            <td colspan="2">--usages strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "signing,authentication"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Описує способи, в яких цей токен може використовуватися. Ви можете передавати --usages кілька разів або надати список параметрів через кому. Дійсні параметри: [signing,authentication]</p></td>
        </tr>
    </tbody>
</table>

### Параметри успадковані від батьківських команд {#options-inherited-from-parent-commands}

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
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Чи ввімкнути режим dry-run чи ні</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/admin.conf"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig для використання при спілкуванні з кластером. Якщо прапорець не встановлено, можна шукати наявний файл kubeconfig у наборі стандартних місць.</p></td>
        </tr>
        <tr>
            <td colspan="2">--rootfs string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до реальної кореневої файлової системи хоста. Це призведе до зміни корення (chroot) kubeadm на вказаних шлях</p></td>
        </tr>
    </tbody>
</table>
