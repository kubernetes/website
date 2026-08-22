### Опис {#synopsis}

Приєднати etcd до вузлів панелі управління

```sh
kubeadm join phase etcd-join [flags]
```

### Приклади {#examples}

```sh
# Приєднати etcd до екземпляра панелі управління
kubeadm join phase control-plane-join-etcd all
```

### Параметри {#options}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--apiserver-advertise-address string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Якщо вузол має хостити новий екземпляр панелі управління, IP-адреса, яку сервер API буде оголошувати як ту, на якій він слухає. Якщо не встановлено, буде використовуватися стандартний інтерфейс.</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу конфігурації kubeadm.</p></td>
</tr>

<tr>
<td colspan="2">--control-plane</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Створити новий екземпляр панелі управління на цьому вузлі</p></td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Не застосовувати жодних змін; просто вивести, що буде зроблено.</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>довідка для etcd-join</p></td>
</tr>

<tr>
<td colspan="2">--node-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Вказати імʼя вузла.</p></td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до теки, що містить файли з назвами &quot;target[suffix][+patchtype].extension&quot;. Наприклад, &quot;kube-apiserver0+merge.yaml&quot; або просто &quot;etcd.json&quot;. &quot;target&quot; може бути одним з &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;, &quot;corednsdeployment&quot;. &quot;patchtype&quot; може бути одним з &quot;strategic&quot;, &quot;merge&quot; або &quot;json&quot; і відповідають форматам патчів, підтримуваних kubectl. Типовий &quot;patchtype&quot; — &quot;strategic&quot;. &quot;extension&quot; має бути або &quot;json&quot;, або &quot;yaml&quot;. &quot;suffix&quot; — це необовʼязковий рядок, який можна використовувати для визначення, які патчі застосовуються першими в алфавітно-числовому порядку.</p></td>
</tr>

</tbody>
</table>

### Options inherited from parent commands

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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до реальної кореневої файлової системи хоста. Це призведе до зміни корення (chroot) kubeadm на вказаних шлях</p></td>
</tr>

</tbody>
</table>
