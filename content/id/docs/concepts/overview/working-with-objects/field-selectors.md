---
title: Selektor Field
weight: 60
---

Selektor *field* memungkinkan kamu untuk [memilih (*select*) *resource* Kubernetes](/docs/concepts/overview/working-with-objects/kubernetes-objects) berdasarkan 
nilai dari satu atau banyak *field resource*. Di bawah ini merupakan contoh dari beberapa *query* selektor *field*:

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`

Perintah `kubectl` di bawah ini memilih semua Pod dengan *field* [`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) yang bernilai
`Running`:

```shell
kubectl get pods --field-selector status.phase=Running
```

{{< note >}}
Pada dasarnya, selektor *field* merupakan filter dari *resource*. Secara *default*, tidak ada selektor/filter apapun yang diterapkan. Artinya,
semua *resource* dengan tipe apapun akan terpilih. Akibatnya, *query* dengan perintah `kubectl` di bawah ini akan memberikan hasil yang sama:

```shell
kubectl get pods
kubectl get pods --field-selector ""
```
{{< /note >}}

## *Field* yang didukung

Selektor-selektor *field* yang didukung oleh Kubernetes bervariasi tergantung dari tipe *resource*. Semua tipe *resource* mendukung *field*
`metadata.name` dan `metadata.namespace`. Jika kamu menggunakan selektor *field* yang tidak didukung, maka akan terjadi error. Contohnya:

```shell
kubectl get ingress --field-selector foo.bar=baz
```
```
Error from server (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```

## Operator yang didukung

Kamu dapat menggunakan operator `=`, `==`, dan `!=` pada selektor *field* (`=` dan `==` punya arti yang sama). Sebagai contoh, perintah `kubectl` ini
memilih semua Kubernetes Service yang tidak terdapat pada *namespace* `default`:

```shell
kubectl get services --field-selector metadata.namespace!=default
```

## Selektor berantai

Seperti halnya [label](/docs/concepts/overview/working-with-objects/labels) dan selektor-selektor lainnya, kamu dapat membuat selektor *field* berantai
(*chained*) dengan *list* yang dipisahkan oleh koma. Perintah `kubectl` di bawah ini memilih semua Pod dengan `status.phase` tidak sama dengan
`Running` dan *field* `spec.restartPolicy` sama dengan `Always`:

```shell
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

## *Resource* dengan beberapa tipe

Kamu dapat menggunakan selektor-selektor *field* dengan beberapa tipe *resource* sekaligus. Perintah `kubectl` di bawah ini memilih semua Statefulset
dan Service yang tidak terdapat pada *namespace* `default`:

```shell
kubectl get statefulsets,services --all-namespaces --field-selector metadata.namespace!=default
```
