---
content_type: concept
title: Introspeksi dan _Debugging_ Aplikasi
---

<!-- overview -->

Setelah aplikasi kamu berjalan, kamu pasti perlu untuk men-_debug_ masalah yang ada di dalamnya.
Sebelumnya telah dijelaskan bagaimana kamu dapat menggunakan `kubectl get pods` untuk mengambil informasi status sederhana tentang
Pod kamu. Namun ada sejumlah cara untuk mendapatkan lebih banyak informasi tentang aplikasi kamu.




<!-- body -->

## Menggunakan `kubectl describe pod` untuk mengambil detil informasi Pod

Dalam contoh ini, kamu menggunakan Deployment untuk membuat dua buah Pod, yang hampir sama dengan contoh sebelumnya.

{{% codenew file="application/nginx-with-request.yaml" %}}

Buat Deployment dengan menjalankan perintah ini:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-with-request.yaml
```

```none
deployment.apps/nginx-deployment created
```

Cek status dari Pod dengan menggunakan perintah:

```shell
kubectl get pods
```

```none
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-1006230814-6winp   1/1       Running   0          11s
nginx-deployment-1006230814-fmgu3   1/1       Running   0          11s
```

Kamu dapat memperoleh lebih banyak informasi tentang masing-masing Pod ini dengan menggunakan perintah `kubectl describe pod`. Sebagai contoh:

```shell
kubectl describe pod nginx-deployment-1006230814-6winp
```

```none
Name:		nginx-deployment-1006230814-6winp
Namespace:	default
Node:		kubernetes-node-wul5/10.240.0.9
Start Time:	Thu, 24 Mar 2016 01:39:49 +0000
Labels:		app=nginx,pod-template-hash=1006230814
Annotations:    kubernetes.io/created-by={"kind":"SerializedReference","apiVersion":"v1","reference":{"kind":"ReplicaSet","namespace":"default","name":"nginx-deployment-1956810328","uid":"14e607e7-8ba1-11e7-b5cb-fa16" ...
Status:		Running
IP:		10.244.0.6
Controllers:	ReplicaSet/nginx-deployment-1006230814
Containers:
  nginx:
    Container ID:	docker://90315cc9f513c724e9957a4788d3e625a078de84750f244a40f97ae355eb1149
    Image:		nginx
    Image ID:		docker://6f62f48c4e55d700cf3eb1b5e33fa051802986b77b874cc351cce539e5163707
    Port:		80/TCP
    QoS Tier:
      cpu:	Guaranteed
      memory:	Guaranteed
    Limits:
      cpu:	500m
      memory:	128Mi
    Requests:
      memory:		128Mi
      cpu:		500m
    State:		Running
      Started:		Thu, 24 Mar 2016 01:39:51 +0000
    Ready:		True
    Restart Count:	0
    Environment:        <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-5kdvl (ro)
Conditions:
  Type          Status
  Initialized   True
  Ready         True
  PodScheduled  True
Volumes:
  default-token-4bcbi:
    Type:	Secret (a volume populated by a Secret)
    SecretName:	default-token-4bcbi
    Optional:   false
QoS Class:      Guaranteed
Node-Selectors: <none>
Tolerations:    <none>
Events:
  FirstSeen	LastSeen	Count	From					SubobjectPath		Type		Reason		Message
  ---------	--------	-----	----					-------------		--------	------		-------
  54s		54s		1	{default-scheduler }						Normal		Scheduled	Successfully assigned nginx-deployment-1006230814-6winp to kubernetes-node-wul5
  54s		54s		1	{kubelet kubernetes-node-wul5}	spec.containers{nginx}	Normal		Pulling		pulling image "nginx"
  53s		53s		1	{kubelet kubernetes-node-wul5}	spec.containers{nginx}	Normal		Pulled		Successfully pulled image "nginx"
  53s		53s		1	{kubelet kubernetes-node-wul5}	spec.containers{nginx}	Normal		Created		Created container with docker id 90315cc9f513
  53s		53s		1	{kubelet kubernetes-node-wul5}	spec.containers{nginx}	Normal		Started		Started container with docker id 90315cc9f513
```

Di sini kamu dapat melihat informasi konfigurasi tentang Container dan Pod (label, kebutuhan resource, dll.), serta informasi status tentang Container dan Pod (status, kesiapan, berapa kali _restart_, _event_, dll.) .

Keadaan (_state_) Container merupakan salah satu dari keadaan _Waiting, Running,_ atau _Terminated_. Tergantung dari keadaannya, informasi tambahan akan diberikan - di sini kamu dapat melihat bahwa untuk Container dalam keadaan _running_, sistem memberi tahu kamu kapan Container tersebut mulai dijalankan.

_Ready_ memberi tahu kepada kamu apakah Container berhasil melewati pemeriksaan kesiapan terakhir. (Dalam kasus ini, Container tidak memiliki pemeriksaan kesiapan yang dikonfigurasi; Container dianggap selalu siap jika tidak ada pemeriksaan kesiapan yang dikonfigurasi.)

Jumlah _restart_ memberi tahu kamu berapa kali Container telah dimulai ulang; informasi ini dapat berguna untuk mendeteksi kemacetan tertutup (_crash loop_) dalam Container yang dikonfigurasi dengan nilai _restart policy_ 'always.'.

Saat ini, satu-satunya kondisi yang terkait dengan Pod adalah kondisi _Binary Ready_, yang menunjukkan bahwa Pod tersebut dapat melayani permintaan dan harus ditambahkan ke kumpulan penyeimbang beban (_load balancing_) dari semua Service yang sesuai.

Terakhir, kamu melihat catatan (_log_) peristiwa terbaru yang terkait dengan Pod kamu. Sistem mengompresi beberapa peristiwa yang identik dengan menunjukkan kapan pertama dan terakhir kali peristiwa itu dilihat dan berapa kali peristiwa itu dilihat. "From" menunjukkan komponen yang mencatat peristiwa, "SubobjectPath" memberi tahu kamu objek mana (mis. Container dalam pod) yang dimaksud, dan "Reason" dan "Message" memberi tahu kamu apa yang sudah terjadi.

## Contoh: Men-_debug_ Pod yang _Pending_

Skenario umum yang bisa kamu deteksi menggunakan peristiwa (_event_) adalah saat kamu telah membuat Pod yang tidak muat di Node mana pun. Misalnya, karena Pod mungkin meminta lebih banyak sumber daya yang tersedia dalam Node mana pun, atau mungkin Pod menentukan _label selector_ yang tidak sesuai dengan Node mana pun. Katakanlah kamu sebelumnya membuat Deployment dengan 5 replika (bukan 2) dan meminta 600 millicore, bukan 500, pada klaster dengan empat Node di mana setiap mesin (virtual) memiliki 1 CPU. Sehingga salah satu Pod tidak akan bisa dijadwalkan. (Perhatikan bahwa Pod _addon_ seperti fluentd, skydns, dll., yang berjalan di setiap Node pada klaster, tidak bisa dijadwalkan jika kamu meminta sebanyak 1000 millicore.)

```shell
kubectl get pods
```

```none
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-1006230814-6winp   1/1       Running   0          7m
nginx-deployment-1006230814-fmgu3   1/1       Running   0          7m
nginx-deployment-1370807587-6ekbw   1/1       Running   0          1m
nginx-deployment-1370807587-fg172   0/1       Pending   0          1m
nginx-deployment-1370807587-fz9sd   0/1       Pending   0          1m
```

Untuk mencari sebab kenapa Pod nginx-deployment-1370807587-fz9sd tidak berjalan, kamu dapat menggunakan `kubectl describe pod` pada Pod yang _pending_ dan melihat setiap peristiwa yang terjadi di dalamnya:

```shell
kubectl describe pod nginx-deployment-1370807587-fz9sd
```

```none
  Name:		nginx-deployment-1370807587-fz9sd
  Namespace:	default
  Node:		/
  Labels:		app=nginx,pod-template-hash=1370807587
  Status:		Pending
  IP:
  Controllers:	ReplicaSet/nginx-deployment-1370807587
  Containers:
    nginx:
      Image:	nginx
      Port:	80/TCP
      QoS Tier:
        memory:	Guaranteed
        cpu:	Guaranteed
      Limits:
        cpu:	1
        memory:	128Mi
      Requests:
        cpu:	1
        memory:	128Mi
      Environment Variables:
  Volumes:
    default-token-4bcbi:
      Type:	Secret (a volume populated by a Secret)
      SecretName:	default-token-4bcbi
  Events:
    FirstSeen	LastSeen	Count	From			        SubobjectPath	Type		Reason			    Message
    ---------	--------	-----	----			        -------------	--------	------			    -------
    1m		    48s		    7	    {default-scheduler }			        Warning		FailedScheduling	pod (nginx-deployment-1370807587-fz9sd) failed to fit in any node
  fit failure on node (kubernetes-node-6ta5): Node didn't have enough resource: CPU, requested: 1000, used: 1420, capacity: 2000
  fit failure on node (kubernetes-node-wul5): Node didn't have enough resource: CPU, requested: 1000, used: 1100, capacity: 2000
```

Di sini kamu dapat melihat peristiwa yang dibuat oleh penjadwal yang mengatakan bahwa Pod gagal dijadwalkan karena alasan `FailedScheduling` (dan mungkin karena sebab yang lainnya). Pesan tersebut memberi tahu kamu bahwa tidak ada cukup sumber daya untuk Pod pada salah satu Node.

Untuk memperbaiki situasi ini, kamu dapat menggunakan `kubectl scale` untuk memperbarui Deployment kamu untuk menentukan empat replika atau yang lebih kecil. (Atau kamu bisa membiarkan satu Pod tertunda, dimana hal ini tidak berbahaya.)

Peristiwa seperti yang kamu lihat di bagian akhir keluaran dari perintah `kubectl description pod` akan tetap ada dalam etcd dan memberikan informasi tingkat tinggi tentang apa yang terjadi pada klaster. Untuk melihat daftar semua peristiwa kamu dapat menggunakan perintah

```shell
kubectl get events
```

tetapi kamu harus ingat bahwa peristiwa bersifat Namespace. Artinya, jika kamu tertarik dengan peristiwa untuk beberapa objek dalam Namespace (misalnya, apa yang terjadi dengan Pod pada Namespace `my-namespace`), kamu perlu secara eksplisit menyebutkan Namespace tersebut pada perintah:


```shell
kubectl get events --namespace=my-namespace
```
Untuk melihat peristiwa dari semua Namespace, kamu dapat menggunakan argumen `--all-namespaces`.

Sebagai tambahan dari perintah `kubectl describe pod`, cara lain untuk mendapatkan informasi tambahan tentang sebuah Pod (selain yang disediakan oleh `kubectl get pod`) adalah dengan meneruskan _flag_ format keluaran `-o yaml` ke perintah `kubectl get pod`. Ini akan memberikan kamu lebih banyak informasi dalam format YAML daripada `kubectl describe pod`--semua informasi dasar yang dimiliki sistem tentang Pod. Di sini kamu akan melihat hal-hal seperti anotasi (yang merupakan metadata nilai kunci tanpa batasan label, yang digunakan secara internal oleh komponen sistem Kubernetes), kebijakan mulai ulang, porta, dan volume.

```shell
kubectl get pod nginx-deployment-1006230814-6winp -o yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubernetes.io/created-by: |
      {"kind":"SerializedReference","apiVersion":"v1","reference":{"kind":"ReplicaSet","namespace":"default","name":"nginx-deployment-1006230814","uid":"4c84c175-f161-11e5-9a78-42010af00005","apiVersion":"extensions","resourceVersion":"133434"}}
  creationTimestamp: 2016-03-24T01:39:50Z
  generateName: nginx-deployment-1006230814-
  labels:
    app: nginx
    pod-template-hash: "1006230814"
  name: nginx-deployment-1006230814-6winp
  namespace: default
  resourceVersion: "133447"
  uid: 4c879808-f161-11e5-9a78-42010af00005
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: nginx
    ports:
    - containerPort: 80
      protocol: TCP
    resources:
      limits:
        cpu: 500m
        memory: 128Mi
      requests:
        cpu: 500m
        memory: 128Mi
    terminationMessagePath: /dev/termination-log
    volumeMounts:
    - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      name: default-token-4bcbi
      readOnly: true
  dnsPolicy: ClusterFirst
  nodeName: kubernetes-node-wul5
  restartPolicy: Always
  securityContext: {}
  serviceAccount: default
  serviceAccountName: default
  terminationGracePeriodSeconds: 30
  volumes:
  - name: default-token-4bcbi
    secret:
      secretName: default-token-4bcbi
status:
  conditions:
  - lastProbeTime: null
    lastTransitionTime: 2016-03-24T01:39:51Z
    status: "True"
    type: Ready
  containerStatuses:
  - containerID: docker://90315cc9f513c724e9957a4788d3e625a078de84750f244a40f97ae355eb1149
    image: nginx
    imageID: docker://6f62f48c4e55d700cf3eb1b5e33fa051802986b77b874cc351cce539e5163707
    lastState: {}
    name: nginx
    ready: true
    restartCount: 0
    state:
      running:
        startedAt: 2016-03-24T01:39:51Z
  hostIP: 10.240.0.9
  phase: Running
  podIP: 10.244.0.6
  startTime: 2016-03-24T01:39:49Z
```

## Contoh: Men-_debug_ Node yang mati/tidak terjangkau (_down/unreachable_)

Terkadang saat men-_debug_ melihat status sebuah Node akan sangat berguna - misalnya, karena kamu telah melihat perilaku aneh dari sebuah Pod yang sedang berjalan pada Node tersebut, atau untuk mencari tahu mengapa sebuah Pod tidak dapat dijadwalkan ke dalam Node tersebut. Seperti pada Pod, kamu dapat menggunakan perintah `kubectl description node` dan `kubectl get node -o yaml` untuk mengambil informasi mendetil tentang Node. Misalnya, disini kamu akan melihat jika sebuah Node sedang mati (terputus dari jaringan, atau kubelet mati dan tidak mau restart, dll.). Perhatikan peristiwa yang menunjukkan Node tersebut NotReady, dan juga perhatikan bahwa Pod tidak lagi berjalan (mereka akan dikeluarkan setelah lima menit berstatus NotReady).

```shell
kubectl get nodes
```

```none
NAME                     STATUS       ROLES     AGE     VERSION
kubernetes-node-861h     NotReady     <none>    1h      v1.13.0
kubernetes-node-bols     Ready        <none>    1h      v1.13.0
kubernetes-node-st6x     Ready        <none>    1h      v1.13.0
kubernetes-node-unaj     Ready        <none>    1h      v1.13.0
```

```shell
kubectl describe node kubernetes-node-861h
```

```none
Name:			kubernetes-node-861h
Role
Labels:		 kubernetes.io/arch=amd64
           kubernetes.io/os=linux
           kubernetes.io/hostname=kubernetes-node-861h
Annotations:        node.alpha.kubernetes.io/ttl=0
                    volumes.kubernetes.io/controller-managed-attach-detach=true
Taints:             <none>
CreationTimestamp:	Mon, 04 Sep 2017 17:13:23 +0800
Phase:
Conditions:
  Type		Status		LastHeartbeatTime			LastTransitionTime			Reason					Message
  ----    ------    -----------------     ------------------      ------          -------
  OutOfDisk             Unknown         Fri, 08 Sep 2017 16:04:28 +0800         Fri, 08 Sep 2017 16:20:58 +0800         NodeStatusUnknown       Kubelet stopped posting node status.
  MemoryPressure        Unknown         Fri, 08 Sep 2017 16:04:28 +0800         Fri, 08 Sep 2017 16:20:58 +0800         NodeStatusUnknown       Kubelet stopped posting node status.
  DiskPressure          Unknown         Fri, 08 Sep 2017 16:04:28 +0800         Fri, 08 Sep 2017 16:20:58 +0800         NodeStatusUnknown       Kubelet stopped posting node status.
  Ready                 Unknown         Fri, 08 Sep 2017 16:04:28 +0800         Fri, 08 Sep 2017 16:20:58 +0800         NodeStatusUnknown       Kubelet stopped posting node status.
Addresses:	10.240.115.55,104.197.0.26
Capacity:
 cpu:           2
 hugePages:     0
 memory:        4046788Ki
 pods:          110
Allocatable:
 cpu:           1500m
 hugePages:     0
 memory:        1479263Ki
 pods:          110
System Info:
 Machine ID:                    8e025a21a4254e11b028584d9d8b12c4
 System UUID:                   349075D1-D169-4F25-9F2A-E886850C47E3
 Boot ID:                       5cd18b37-c5bd-4658-94e0-e436d3f110e0
 Kernel Version:                4.4.0-31-generic
 OS Image:                      Debian GNU/Linux 8 (jessie)
 Operating System:              linux
 Architecture:                  amd64
 Container Runtime Version:     docker://1.12.5
 Kubelet Version:               v1.6.9+a3d1dfa6f4335
 Kube-Proxy Version:            v1.6.9+a3d1dfa6f4335
ExternalID:                     15233045891481496305
Non-terminated Pods:            (9 in total)
  Namespace                     Name                                            CPU Requests    CPU Limits      Memory Requests Memory Limits
  ---------                     ----                                            ------------    ----------      --------------- -------------
......
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  CPU Requests  CPU Limits      Memory Requests         Memory Limits
  ------------  ----------      ---------------         -------------
  900m (60%)    2200m (146%)    1009286400 (66%)        5681286400 (375%)
Events:         <none>
```

```shell
kubectl get node kubernetes-node-861h -o yaml
```

```yaml
apiVersion: v1
kind: Node
metadata:
  creationTimestamp: 2015-07-10T21:32:29Z
  labels:
    kubernetes.io/hostname: kubernetes-node-861h
  name: kubernetes-node-861h
  resourceVersion: "757"
  uid: 2a69374e-274b-11e5-a234-42010af0d969
spec:
  externalID: "15233045891481496305"
  podCIDR: 10.244.0.0/24
  providerID: gce://striped-torus-760/us-central1-b/kubernetes-node-861h
status:
  addresses:
  - address: 10.240.115.55
    type: InternalIP
  - address: 104.197.0.26
    type: ExternalIP
  capacity:
    cpu: "1"
    memory: 3800808Ki
    pods: "100"
  conditions:
  - lastHeartbeatTime: 2015-07-10T21:34:32Z
    lastTransitionTime: 2015-07-10T21:35:15Z
    reason: Kubelet stopped posting node status.
    status: Unknown
    type: Ready
  nodeInfo:
    bootID: 4e316776-b40d-4f78-a4ea-ab0d73390897
    containerRuntimeVersion: docker://Unknown
    kernelVersion: 3.16.0-0.bpo.4-amd64
    kubeProxyVersion: v0.21.1-185-gffc5a86098dc01
    kubeletVersion: v0.21.1-185-gffc5a86098dc01
    machineID: ""
    osImage: Debian GNU/Linux 7 (wheezy)
    systemUUID: ABE5F6B4-D44B-108B-C46A-24CCE16C8B6E
```



## {{% heading "whatsnext" %}}


Pelajari tentang alat _debugging_ tambahan, termasuk:

* [Pencatatan (_logging_)](/id/docs/concepts/cluster-administration/logging/)
* [Monitoring](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
* [Masuk ke Container melalui `exec`](/docs/tasks/debug-application-cluster/get-shell-running-container/)
* [Masuk ke Container melalui _proxy_](/docs/tasks/extend-kubernetes/http-proxy-access-api/)
* [Masuk ke Container melalui _port forwarding_](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* [Inspeksi Node Kubernetes dengan menggunakan crictl](/docs/tasks/debug-application-cluster/crictl/)


