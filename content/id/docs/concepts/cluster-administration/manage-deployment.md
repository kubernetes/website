---
title: Mengelola Resource
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

You've deployed your application and exposed it via a service. Now what? Kubernetes provides a number of tools to help you manage your application deployment, including scaling and updating. Among the features that we will discuss in more depth are [configuration berkass](/docs/concepts/configuration/overview/) and [labels](/docs/concepts/overview/working-with-objects/labels/).

{{% /capture %}}


{{% capture body %}}

## Mengelola konfigurasi _resource_

Banyak aplikasi perlu membuat beberapa _resource_, seperti Deployment dan Service. Pengelolaan beberapa _resource_ dapat disederhanakan dengan mengelompokkannya dalam berkas yang sama (dengan pemisah `---` dalam YAML). Contoh:

{{< codenew file="application/nginx-app.yaml" >}}

Beberapa _resource_ dapat dibuat seperti satu _resource_:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
```

```shell
service/my-nginx-svc created
deployment.apps/my-nginx created
```

_Resource_ akan dibuat dalam urutan seperti pada berkas. Oleh karena itu, lebih baik menspecify _service_ dahulu agar menjamin _scheduler_ dapat membagikan _pod_ yang terkait _service_ as they are created by the controller(s), such as Deployment.
# since that will ensure the scheduler can spread the pods associated with the service as they are created by the controller(s), such as Deployment.

`kubectl apply` juga dapat menerima beberapa argumen `-f`:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-svc.yaml -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

Selain berkas, dapat juga mengirimkan direktori sebagai argumen:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/
```

`kubectl` akan membaca berkass apapun yang berakhiran `.yaml`, `.yml`, or `.json`.

Disarankan untuk meletakkan _resource_ yang terkait _microservice_ atau application tier yang sama dalam satu berkas, dan mengelompokkan semua berkas associated dengan aplikasi anda dalam satu direktori. Jika tiers of your aplikasi bind to each other using DNS, maka anda dapat saja deploy all of the components of your stack en masse.

A URL can also be specified as a configuration source, which is handy for deploying directly from configuration berkass checked into github:

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/application/nginx/nginx-deployment.yaml
```

```shell
deployment.apps/my-nginx created
```

## Operasi majemuk dalam kubectl

Pembuatan _resource_ bukanlah satu-satunya operasi yang bisa dijalankan `kubectl` secara majemuk. Dia juga dapat mengekstrak nama _resource_ dari berkas konfigurasi untuk menjalankan operasi lainnya, khususnya untuk menghapus _resource_ yang telah dibuat:

```shell
kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
```

```shell
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

Pada kasus dua _resource_, mudah untuk menspecify keduanya pada command line menggunakan sintaks _resource_/nama:

```shell
kubectl delete deployments/my-nginx services/my-nginx-svc
```

Namun, untuk jumlah yang lebih besar, akan sangat memudahkan untuk menspecify selektor (label query) menggunakan `-l` atau `--selector` untuk memfilter _resource_ berdasarkan label:

```shell
kubectl delete deployment,services -l app=nginx
```

```shell
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

Karena `kubectl` mengembalikan nama resource yang sama dengan sintaks yang diterima, mudah untuk menyambung operasi menggunakan `$()` atau `xargs`:

```shell
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service)
```

```shell
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

With the above commands, we first create resources under `examples/application/nginx/` and print the resources created with `-o name` output format
(print each resource as resource/name). Then we `grep` only the "service", and then print it with `kubectl get`.

If you happen to organize your resources across several subdirectories within a particular directory, you can recursively perform the operations on the subdirectories also, by specifying `--recursive` or `-R` alongside the `--filename,-f` flag.

For instance, assume there is a directory `project/k8s/development` that holds all of the manifests needed for the development environment, organized by resource type:

```
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

By default, menjalankan operasi bulk pada `project/k8s/development` akan berhenti pada direktori tingkat pertama, tanpa menghiraukan tingkat yang lebih dalam. Sehingga ketika kita menjalankan operasi pembuatan dengan perintah  berikut, kita akan mendapatkan eror:

```shell
kubectl apply -f project/k8s/development
```

```shell
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

Instead, specify the `--recursive` or `-R` flag with the `--filename,-f` flag as such:

```shell
kubectl apply -f project/k8s/development --recursive
```

```shell
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

Flag `--recursive` bekerja untuk operasi apapun yang menerima flag `--filename,-f` seperti: `kubectl {create,get,delete,describe,rollout} etc.`

Flag `--recursive` juga bekerja saat beberapa argumen `-f` diberikan:

```shell
kubectl apply -f project/k8s/namespaces -f project/k8s/development --recursive
```

```shell
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

Jika anda tertarik mempelajari lebih lanjut tentang `kubectl`, silahkan baca [Ikhtisar kubectl](/id/docs/reference/kubectl/overview/).

## Memakai label secara efektif

Contoh yang kita lihat sejauh ini hanya menggunakan paling banyak satu label pada _resource_ apapun. Ada banyak skenario ketika membutuhkan beberapa label untuk membedakan sebuah kelompok dari yang lainnya.

For instance, different applications would use different values for the `app` label, tapi pada aplikasi multi-tier, seperti pada [contoh buku tamu](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/), tiap tier perlu dibedakan. Untuk menandai tier frontend bisa menggunakan label:

```yaml
     labels:
        app: guestbook
        tier: frontend
```

seperti halnya Redis master dan slave memiliki label `tier` yang berbeda, atau bahkan label tambahan `role`:

```yaml
     labels:
        app: guestbook
        tier: backend
        role: master
```

dan

```yaml
     labels:
        app: guestbook
        tier: backend
        role: slave
```

Label memungkinkan kita untuk memilah _resource_ dengan pembeda berupa label:

```shell
kubectl apply -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
kubectl get pods -Lapp -Ltier -Lrole
```

```shell
NAME                           READY     STATUS    RESTARTS   AGE       APP         TIER       ROLE
guestbook-fe-4nlpb             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-ght6d             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-jpy62             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1       Running   0          1m        guestbook   backend    master
guestbook-redis-slave-2q2yf    1/1       Running   0          1m        guestbook   backend    slave
guestbook-redis-slave-qgazl    1/1       Running   0          1m        guestbook   backend    slave
my-nginx-divi2                 1/1       Running   0          29m       nginx       <none>     <none>
my-nginx-o0ef1                 1/1       Running   0          29m       nginx       <none>     <none>
```

```shell
kubectl get pods -lapp=guestbook,role=slave
```
```shell
NAME                          READY     STATUS    RESTARTS   AGE
guestbook-redis-slave-2q2yf   1/1       Running   0          3m
guestbook-redis-slave-qgazl   1/1       Running   0          3m
```

## Canary deployments

Skenario lain yang menggunakan beberapa label yaitu saat membedakan deployment komponen yang sama namun dengan rilis atau konfigurasi yang berbeda. Adalah praktik yang umum untuk mendeploy sebuah *canary* dari rilis aplikasi yang baru (berdasarkan tag image dalam templat pod) bersamaan dengan rilis sebelumnya sehingga rilis yang baru dapat menerima live traffic sebelum benar-benar roll out -- bekerja?.


For instance, you can use a `track` label to differentiate different releases.

The primary, stable release would have a `track` label with value as `stable`:

```yaml
     name: frontend
     replicas: 3
     ...
     labels:
        app: guestbook
        tier: frontend
        track: stable
     ...
     image: gb-frontend:v3
```

and then you can create a new release of the guestbook frontend that carries the `track` label with different value (i.e. `canary`), so that two sets of pods would not overlap:

```yaml
     name: frontend-canary
     replicas: 1
     ...
     labels:
        app: guestbook
        tier: frontend
        track: canary
     ...
     image: gb-frontend:v4
```

Servis frontend akan meliputi kedua set replika dengan menentukan subset bersama dari label-labelnya (i.e. menghapus label `track`) sehingga traffic akan diarahkan ke kedua aplikasi:

```yaml
  selector:
     app: guestbook
     tier: frontend
```

Anda dapat tweak-mengatur jumlah replika rilis stable dan canary untuk menentukan rasio dari tiap rilis yang akan menerima live prod traffic (dalam kasus ini 3:1).
Ketika telah yakin, anda dapat mengganti stable track ke rilis aplikasi baru dan menghapus canary.

Untuk contoh yang lebih jelas, cek pada [tutorial of deploying Ghost](https://github.com/kelseyhightower/talks/tree/master/kubecon-eu-2016/demo#deploy-a-canary).

## Memperbarui label

Kadang, pod dan resource lain yang sudah ada harus melabeli ulang sebelum membuat resource baru. Hal ini dapat dilakukan dengan cara `kubectl label`.
Contohnya jika anda ingin melabeli ulang semua pod nginx sebagai frontend tier, tinggal jalankan:

```shell
kubectl label pods -l app=nginx tier=fe
```

```shell
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```

Perintah ini melakukan filter pada semua pod dengan label "app=nginx", lalu melabelinya dengan "tier=fe".
Untuk melihat pod yang telah dilabeli, jalankan:

```shell
kubectl get pods -l app=nginx -L tier
```
```shell
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

This outputs all "app=nginx" pods, with an additional label column of pods' tier (specified with `-L` or `--label-columns`).

For more information, please see [labels](/docs/concepts/overview/working-with-objects/labels/) and [kubectl label](/docs/reference/generated/kubectl/kubectl-commands/#label).

## Memperbarui anotasi

Sometimes you would want to attach annotations to resources. Annotations are arbitrary non-identifying metadata for retrieval by API clients such as tools, libraries, etc. This can be done with `kubectl annotate`. For example:

```shell
kubectl annotate pods my-nginx-v4-9gw19 description='my frontend running nginx'
kubectl get pods my-nginx-v4-9gw19 -o yaml
```
```shell
apiVersion: v1
kind: pod
metadata:
  annotations:
    description: my frontend running nginx
...
```

For more information, please see [annotations](/docs/concepts/overview/working-with-objects/annotations/) and [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands/#annotate) document.

## Scaling aplikasi anda

When load on your application grows or shrinks, it's easy to scale with `kubectl`. For instance, to decrease the number of nginx replicas from 3 to 1, do:

```shell
kubectl scale deployment/my-nginx --replicas=1
```
```shell
deployment.extensions/my-nginx scaled
```

Sekarang anda hanya memiliki satu pod yang dikelola oleh deployment.

```shell
kubectl get pods -l app=nginx
```
```shell
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

Agar sistem dapat menyesuaikan jumlah replika nginx yang dibutuhkan secara otomatis dari 1 hingga 3, lakukan: 

```shell
kubectl autoscale deployment/my-nginx --min=1 --max=3
```
```shell
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

Sekarang replika nginx akan scaled up and down as needed, automatically.

Informasi tambahan dapat dilihat pada dokumen [kubectl scale](/docs/reference/generated/kubectl/kubectl-commands/#scale), [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale) dan [horizontal pod autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/).


## Pembaruan resource di tempat

Sometimes it's necessary to make narrow, non-disruptive updates to resources you've created.

### kubectl apply

It is suggested to maintain a set of configuration berkass in source control (see [configuration as code](http://martinfowler.com/bliki/InfrastructureAsCode.html)),
so that they can be maintained and versioned along with the code for the resources they configure.
Then, you can use [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply) to push your configuration changes to the cluster.

This command will compare the version of the configuration that you're pushing with the previous version and apply the changes you've made, without overwriting any automated changes to properties you haven't specified.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
deployment.apps/my-nginx configured
```

Note that `kubectl apply` attaches an annotation to the resource in order to determine the changes to the configuration since the previous invocation. When it's invoked, `kubectl apply` does a three-way diff between the previous configuration, the provided input and the current configuration of the resource, in order to determine how to modify the resource.

Currently, resources are created without this annotation, so the first invocation of `kubectl apply` will fall back to a two-way diff between the provided input and the current configuration of the resource. During this first invocation, it cannot detect the deletion of properties set when the resource was created. For this reason, it will not remove them.

All subsequent calls to `kubectl apply`, and other commands that modify the configuration, such as `kubectl replace` and `kubectl edit`, will update the annotation, allowing subsequent calls to `kubectl apply` to detect and perform deletions using a three-way diff.

### kubectl edit

Alternatively, you may also update resources with `kubectl edit`:

```shell
kubectl edit deployment/my-nginx
```

This is equivalent to first `get` the resource, edit it in text editor, and then `apply` the resource with the updated version:

```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# do some edit, and then save the berkas

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```

This allows you to do more significant changes more easily. Note that you can specify the editor with your `EDITOR` or `KUBE_EDITOR` environment variables.

For more information, please see [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands/#edit) document.

### kubectl patch

You can use `kubectl patch` to update API objects in place. This command supports JSON patch,
JSON merge patch, and strategic merge patch. See
[Update API Objects in Place Using kubectl patch](/docs/tasks/run-application/update-api-object-kubectl-patch/)
and
[kubectl patch](/docs/reference/generated/kubectl/kubectl-commands/#patch).

## Disruptive updates

In some cases, you may need to update resource fields that cannot be updated once initialized, or you may just want to make a recursive change immediately, such as to fix broken pods created by a Deployment. To change such fields, use `replace --force`, which deletes and re-creates the resource. In this case, you can simply modify your original configuration berkas:

```shell
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
```
```shell
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```

## Membarui aplikasi tanpa outage servis

Suatu saat, anda akan perlu untuk membarui aplikasi yang telah terdeploy, biasanya dengan mengganti image atau tag sebagaimana dalam skenario canary deployment di atas. `kubectl` mendukung beberapa operasi pembaruan, each of which is applicable to different scenarios.

Kami akan memandu anda untuk membuat dan membarui aplikasi melalui Deployment.

Misal anda telah menjalankan nginx versi 1.7.9:

```shell
kubectl run my-nginx --image=nginx:1.7.9 --replicas=3
```
```shell
deployment.apps/my-nginx created
```

Untuk memperbarui versi ke 1.9.1, ganti `.spec.template.spec.containers[0].image` dari `nginx:1.7.9` ke `nginx:1.9.1`, dengan perintah kubectl yang telah dipelajari di atas.

```shell
kubectl edit deployment/my-nginx
```

That's it! The Deployment will declaratively update the deployed nginx application progressively behind the scene. It ensures that only a certain number of old replicas may be down while they are being updated, and only a certain number of new replicas may be created above the desired number of pods. To learn more details about it, visit [Deployment page](/docs/concepts/workloads/controllers/deployment/).

{{% /capture %}}

{{% capture whatsnext %}}

- [Learn about how to use `kubectl` for application introspection and debugging.](/docs/tasks/debug-application-cluster/debug-application-introspection/)
- [Configuration Best Practices and Tips](/docs/concepts/configuration/overview/)

{{% /capture %}}
