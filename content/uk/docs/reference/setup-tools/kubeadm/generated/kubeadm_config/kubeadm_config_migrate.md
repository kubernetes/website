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


Зчитує стару версію типів API конфігурації kubeadm з файлу і виводить аналогічний обʼєкт конфігурації для новішої версії

### Опис {#synopsis}



Ця команда дозволяє конвертувати обʼєкти конфігурації старих версій у найновішу підтримувану версію локально в інструменті CLI, нічого не змінюючи в кластері.
У цій версії kubeadm підтримуються такі версії API:
- kubeadm.k8s.io/v1beta4

Крім того, kubeadm може записувати конфігурацію лише версії "kubeadm.k8s.io/v1beta4", але читати обидва типи. Тож незалежно від того, яку версію ви передаєте тут параметру --old-config, обʼєкт API буде прочитано, десеріалізовано, заповнено типовими значеннями, конвертовано, валідовано та повторно серіалізовано під час запису у stdout або в --new-config, якщо його вказано.

Іншими словами, вихідні дані цієї команди — це те, що kubeadm фактично прочитав би внутрішньо, якби ви передали цей файл команді "kubeadm init"


```
kubeadm config migrate [flags]
```

### Параметри {#options}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--allow-experimental-api</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Дозволити міграцію на експериментальні, ще не випущені API.</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>довідка для migrate</p></td>
</tr>

<tr>
<td colspan="2">--new-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до отриманого еквівалентного конфігураційного файлу kubeadm з використанням нової версії API. Необовʼязково, якщо не вказано, вивід буде надіслано у STDOUT.</p></td>
</tr>

<tr>
<td colspan="2">--old-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до конфігураційного файлу kubeadm, який використовує стару версію API і який має бути конвертований. Цей прапорець є обовʼязковим.</p></td>
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



