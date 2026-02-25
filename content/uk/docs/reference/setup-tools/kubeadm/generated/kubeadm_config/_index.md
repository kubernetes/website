Керування конфігурацією для кластера kubeadm, збереженою у ConfigMap у кластері

### Опис {#synopsis}

У просторі імен kube-system є ConfigMap з назвою "kubeadm-config", яку kubeadm використовує для зберігання внутрішньої конфігурації кластера. kubeadm CLI v1.8.0+ автоматично створює ConfigMap з конфігурацією, що використовується командою 'kubeadm init', але якщо ви ініціалізували кластер за допомогою kubeadm v1.7.x або нижчої версії, вам слід скористатися командою 'kubeadm init phase upload-config', щоб створити ConfigMap. Це необхідно для того, щоб команда 'kubeadm upgrade' могла правильно налаштувати ваш оновлений кластер.

```shell
kubeadm config [flags]
```

### Параметри {#options}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка config</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig, який буде використовуватися при спілкуванні з кластером. Якщо прапорець не встановлено, можна шукати існуючий файл kubeconfig у стандартних місцях.</p></td>
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
            <td colspan="2">--rootfs string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до реальної кореневої файлової системи хоста. Це призведе до зміни корення (chroot) kubeadm на вказаних шлях</p></td>
        </tr>
    </tbody>
</table>
