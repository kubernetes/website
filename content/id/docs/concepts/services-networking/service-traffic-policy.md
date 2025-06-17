---
title: Kebijakan Lalu Lintas Internal (Service Internal Traffic Policy)
content_type: concept
weight: 120
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

_Kebijakan Lalu Lintas Internal Service_ memungkinkan pembatasan lalu lintas internal untuk hanya 
merutekan lalu lintas tersebut ke Endpoint pada Node asal lalu lintas tersebut. "Lalu Lintas Internal" 
dalam konteks ini merujuk pada lalu lintas yang berasal dari Pod dalam klaster saat ini. Fitur ini dapat 
membantu mengurangi biaya dan meningkatkan performa.

<!-- body -->

## Menggunakan Kebijakan Lalu Lintas Internal pada Service

Kamu dapat mengaktifkan kebijakan lalu lintas internal (_internal-only_) untuk sebuah 
{{< glossary_tooltip text="Service" term_id="service" >}}, dengan mengonfigurasi 
`.spec.internalTrafficPolicy` menjadi `Local`. Konfigurasi ini akan mengarahkan kube-proxy 
untuk hanya merutekan lalu lintas internal ke Endpoint yang berada pada Node asal lalu lintas klaster.

{{< note >}}
Untuk Pod pada Node yang tidak memiliki Endpoint untuk Service tertentu, Service 
akan berperilaku sebagaimana tidak ada Endpoint (Untuk pod pada Node tersebut), Meskipun 
Service memiliki Endpoint pada Node lain.
{{< /note >}}


Contoh berikut menunjukkan seperti apa konfigurasi Service ketika kamu mengonfigurasikan
`.spec.internalTrafficPolicy` menjadi `Local`:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  internalTrafficPolicy: Local
```

## Cara Kerja

Kube-proxy memfilter Endpoint yang dirutekan berdasarkan konfigurasi `spec.internalTrafficPolicy`. 
Ketika diatur ke `Local`, hanya Endpoint lokal pada Node yang dipertimbangkan. Ketika diatur ke 
`Cluster` (nilai _default_) atau tidak diatur, Kubernetes akan mempertimbangkan semua Endpoint.

## {{% heading "whatsnext" %}}

* Baca mengenai [Topology Aware Routing](/docs/concepts/services-networking/topology-aware-routing)
* Baca mengenai [Service External Traffic Policy](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* Ikuti tutorial [Connecting Applications with Services](/docs/tutorials/services/connect-applications-service/)
