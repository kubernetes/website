---
title: Bin Packing Sumber Daya untuk Sumber Daya Tambahan
content_type: concept
weight: 10
---

<!-- overview -->

{{< feature-state for_k8s_version="1.16" state="alpha" >}}

_Kube-scheduler_ dapat dikonfigurasikan untuk mengaktifkan pembungkusan rapat 
(_bin packing_) sumber daya bersama dengan sumber daya tambahan melalui fungsi prioritas 
`RequestedToCapacityRatioResourceAllocation`. Fungsi-fungsi prioritas dapat digunakan 
untuk menyempurnakan _kube-scheduler_ sesuai dengan kebutuhan.



<!-- body -->

## Mengaktifkan _Bin Packing_ menggunakan RequestedToCapacityRatioResourceAllocation

Sebelum Kubernetes 1.15, _kube-scheduler_ digunakan untuk memungkinkan mencetak 
skor berdasarkan rasio permintaan terhadap kapasitas sumber daya utama seperti 
CPU dan Memori. Kubernetes 1.16 menambahkan parameter baru ke fungsi prioritas 
yang memungkinkan pengguna untuk menentukan sumber daya beserta dengan bobot 
untuk setiap sumber daya untuk memberi nilai dari Node berdasarkan rasio 
permintaan terhadap kapasitas. Hal ini memungkinkan pengguna untuk _bin pack_
sumber daya tambahan dengan menggunakan parameter yang sesuai untuk meningkatkan
pemanfaatan sumber daya yang langka dalam klaster yang besar. Perilaku 
`RequestedToCapacityRatioResourceAllocation` dari fungsi prioritas dapat 
dikontrol melalui pilihan konfigurasi yang disebut `RequestToCapacityRatioArguments`.
Argumen ini terdiri dari dua parameter yaitu `shape` dan `resources`. Shape 
memungkinkan pengguna untuk menyempurnakan fungsi menjadi yang paling tidak 
diminta atau paling banyak diminta berdasarkan nilai `utilization` dan `score`. 
Sumber daya terdiri dari `name` yang menentukan sumber daya mana yang dipertimbangkan 
selama penilaian dan `weight` yang menentukan bobot masing-masing sumber daya.

Di bawah ini adalah contoh konfigurasi yang menetapkan `requestedToCapacityRatioArguments` 
pada perilaku _bin packing_ untuk sumber daya tambahan `intel.com/foo` dan `intel.com/bar`

```json
{
    "kind" : "Policy",
    "apiVersion" : "v1",

    ...

    "priorities" : [

       ...

      {
        "name": "RequestedToCapacityRatioPriority",
        "weight": 2,
        "argument": {
          "requestedToCapacityRatioArguments": {
            "shape": [
              {"utilization": 0, "score": 0},
              {"utilization": 100, "score": 10}
            ],
            "resources": [
              {"name": "intel.com/foo", "weight": 3},
              {"name": "intel.com/bar", "weight": 5}
            ]
          }
        }
      }
    ],
  }
```

**Fitur ini dinonaktifkan secara _default_**

### Tuning RequestedToCapacityRatioResourceAllocation Priority Function

`shape` digunakan untuk menentukan perilaku dari fungsi `RequestedToCapacityRatioPriority`.

```yaml
 {"utilization": 0, "score": 0},
 {"utilization": 100, "score": 10}
```

Argumen di atas memberikan Node nilai 0 jika utilisasi 0% dan 10 untuk utilisasi 100%, 
yang kemudian mengaktfikan perilaku _bin packing_. Untuk mengaktifkan dari paling 
yang tidak diminta, nilainya harus dibalik sebagai berikut.

```yaml
 {"utilization": 0, "score": 100},
 {"utilization": 100, "score": 0}
```

`resources` adalah parameter opsional yang secara _default_ diatur ke:

``` yaml
"resources": [
              {"name": "CPU", "weight": 1},
              {"name": "Memory", "weight": 1}
            ]
```

Ini dapat digunakan untuk menambahkan sumber daya tambahan sebagai berikut:

```yaml
"resources": [
              {"name": "intel.com/foo", "weight": 5},
              {"name": "CPU", "weight": 3},
              {"name": "Memory", "weight": 1}
            ]
```

Parameter `weight` adalah opsional dan diatur ke 1 jika tidak ditentukan. 
Selain itu, `weight` tidak dapat diatur ke nilai negatif.

### Bagaimana Fungsi Prioritas RequestedToCapacityRatioResourceAllocation Menilai Node

Bagian ini ditujukan bagi kamu yang ingin memahami secara detail internal
dari fitur ini.
Di bawah ini adalah contoh bagaimana nilai dari Node dihitung untuk satu kumpulan
nilai yang diberikan.

```
Sumber daya yang diminta

intel.com/foo : 2
Memory: 256MB
CPU: 2

Bobot dari sumber daya

intel.com/foo : 5
Memory: 1
CPU: 3

FunctionShapePoint {{0, 0}, {100, 10}}

Spesifikasi dari Node 1

Tersedia:

intel.com/foo : 4
Memory : 1 GB
CPU: 8

Digunakan:

intel.com/foo: 1
Memory: 256MB
CPU: 1


Nilai Node:

intel.com/foo  = resourceScoringFunction((2+1),4)
               =  (100 - ((4-3)*100/4)
               =  (100 - 25)
               =  75
               =  rawScoringFunction(75)
               = 7

Memory         = resourceScoringFunction((256+256),1024)
               = (100 -((1024-512)*100/1024))
               = 50
               = rawScoringFunction(50)
               = 5

CPU            = resourceScoringFunction((2+1),8)
               = (100 -((8-3)*100/8))
               = 37.5
               = rawScoringFunction(37.5)
               = 3

NodeScore   =  ((7 * 5) + (5 * 1) + (3 * 3)) / (5 + 1 + 3)
            =  5


Spesifikasi dari Node 2

Tersedia:

intel.com/foo: 8
Memory: 1GB
CPU: 8

Digunakan:

intel.com/foo: 2
Memory: 512MB
CPU: 6


Nilai Node:

intel.com/foo  = resourceScoringFunction((2+2),8)
               =  (100 - ((8-4)*100/8)
               =  (100 - 25)
               =  50
               =  rawScoringFunction(50)
               = 5

Memory         = resourceScoringFunction((256+512),1024)
               = (100 -((1024-768)*100/1024))
               = 75
               = rawScoringFunction(75)
               = 7

CPU            = resourceScoringFunction((2+6),8)
               = (100 -((8-8)*100/8))
               = 100
               = rawScoringFunction(100)
               = 10

NodeScore   =  ((5 * 5) + (7 * 1) + (10 * 3)) / (5 + 1 + 3)
            =  7

```


