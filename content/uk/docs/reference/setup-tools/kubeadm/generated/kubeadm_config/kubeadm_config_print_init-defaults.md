
Вивід стандартної конфігурації ініціалізації, яка може використовуватись у `kubeadm init`.

### Опис {#synopsis}

Ця команда виводить обʼєкти, такі як стандартну конфігурацію ініціалізації, які можуть бути використані у `kubeadm init`.

Зверніть увагу, що конфіденційні значення, такі як поля Bootstrap Token, замінюються значеннями-заповнювачами, такими як abcdef.0123456789abcdef", щоб пройти перевірку, але не виконувати реальні дії для створення токена.

```shell
kubeadm config print init-defaults [flags]
```

### Параметри {#options}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--component-configs strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список обʼєктів API конфігурації компонентів через кому для виводу типових значень. Доступні значення: [KubeProxyConfiguration KubeletConfiguration]. Якщо цей прапорець не встановлено, конфігурації компонентів не буде надруковано.</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>довідка init-defaults</p></td>
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
            <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/admin.conf"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig для використання при спілкуванні з кластером. Якщо прапорець не встановлено, набір стандартних розташувань може бути перевірений на наявність поточного файлу kubeconfig.</p></td>
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
