---
title: হ্যালো মিনিকুব (Hello Minikube)
content_type: tutorial
weight: 5
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

এই টিউটোরিয়ালটি আপনাকে দেখায় কিভাবে মিনিকুব ব্যবহার করে কুবারনেটিস এ একটি নমুনা অ্যাপ চালাতে হয়। 
টিউটোরিয়ালটি একটি কন্টেইনার চিত্র প্রদান করে যা NGINX ব্যবহার করে সমস্ত অনুরোধগুলোকে প্রতিধ্বনিত করে ৷

## {{% heading "objectives" %}}

* মিনিকিউবে একটি সরল অ্যাপ্লিকেশন স্থাপন করুন।
* অ্যাপ্লিকেশনটিকে চালান।
* অ্যাপ্লিকেশন লগ (log) দেখুন।

## {{% heading "prerequisites" %}}

এই টিউটোরিয়ালটি একটি কন্টেইনার ইমেজ প্রদান করে যা NGINX ব্যবহার করে সমস্ত অনুরোধে সাড়া দেয়।

<!-- lessoncontent -->

## একটি মিনিকিউব ক্লাস্টার তৈরি করা।

1. ক্লিক করুন **Launch Terminal** এ

    {{< kat-button >}}

{{< note >}}
মিনিকুব স্থানীয়ভাবে ইনস্টল করা থাকলে, `minikube start` চালান। `minikube dashboard` কমান্ড কার্যকর করার আগে, একটি নতুন টার্মিনাল খুলুন, সেই টার্মিনালে `minikube dashboard` কমান্ডটি চালান এবং মূল টার্মিনালে ফিরে যান।
{{< /note >}}

2. একটি ব্রাউজারে কুবারনেটিস ড্যাশবোর্ড খুলুন:

    ```shell
    minikube dashboard
    ```

3. Katacoda পরিবেশ (Katacoda Environment): টার্মিনাল প্যানেলের শীর্ষে প্লাস ক্লিক করুন, তারপরে ক্লিক করুন **Select port to view on Host 1** ।

4. Katacoda পরিবেশ (Katacoda Environment): `30000` লিখুন এবং **Display Port** এ ক্লিক করুন।

{{< note >}}
আপনি যখন  `minikube dashboard` কমান্ড ইস্যু করেন, তখন ড্যাশবোর্ড অ্যাড-অন এবং প্রক্সি সক্রিয় হয় এবং প্রক্সিতে সংযোগ করার জন্য একটি ডিফল্ট ওয়েব ব্রাউজার উইন্ডো খোলে।
আপনি ড্যাশবোর্ড থেকে কুবারনেটিস সংস্থান তৈরি করতে পারেন যেমন ডিপ্লয়মেন্ট বা সার্ভিস।

আপনি যদি  `root` এনভায়রনমেন্টে কমান্ড নির্বাহ করছেন, তাহলে [URL ব্যবহার করে ড্যাশবোর্ড অ্যাক্সেস করা] (#open-dashboard-with-url) পড়ুন।

ডিফল্টরূপে, ড্যাশবোর্ড শুধুমাত্র কুবারনেটিস অভ্যন্তরীণ ভার্চুয়াল নেটওয়ার্ক থেকে অ্যাক্সেসযোগ্য।

`dashboard` কমান্ড কুবারনেটিস ভার্চুয়াল নেটওয়ার্কের বাইরে থেকে ড্যাশবোর্ড অ্যাক্সেস করার জন্য একটি অস্থায়ী প্রক্সি তৈরি করে।

আপনি `Ctrl+C` টিপে প্রক্সি থেকে প্রস্থান করতে পারেন।
কমান্ডটি শেষ হওয়ার পরে, ড্যাশবোর্ডটি কুবারনেটিস ক্লাস্টারে চলতে থাকে।
আপনি আবার `dashboard` কমান্ড চালিয়ে ড্যাশবোর্ড অ্যাক্সেস করার জন্য আরেকটি প্রক্সি তৈরি করতে পারেন।
{{< /note >}}

## URL ব্যবহার করে ড্যাশবোর্ড খুলুন

আপনি যদি ওয়েব ব্রাউজারটি স্বয়ংক্রিয়ভাবে খুলতে না চান তবে আপনি `--url` ফ্ল্যাগ দিয়ে নিম্নলিখিত কমান্ডটি কার্যকর করে ড্যাশবোর্ড অ্যাক্সেস URL মুদ্রণ করতে পারেন :

```shell
minikube dashboard --url
```

## ডিপ্লয়মেন্ট (Deployment) তৈরি করুন

কুবারনেটিস [পডস](/bn/docs/concepts/workloads/pods/)  নেটওয়ার্কিং উদ্দেশ্যে এক বা একাধিক পাত্রের একটি গ্রুপ একসাথে গোষ্ঠীবদ্ধ করে।
এই টিউটোরিয়ালের পডটিতে (pod) শুধুমাত্র একটি পাত্র রয়েছে। কুবারনেটিস
[Deployment](/bn/docs/concepts/workloads/controllers/deployment/) হলো পডের
একটি স্বাস্থ্য পরীক্ষা করে এবং পডের ধারকটি বন্ধ হয়ে গেলে পুনরায় চালু করে। পড তৈরি এবং স্কেলিং পরিচালনা করার উপায় হিসাবে স্থাপনের সুপারিশ করা হয়।

1. পড পরিচালনা ও ডিপ্লয়মেন্ট তৈরি করতে `kubectl create` কমান্ডটি চালান। এই পডগুলি প্রদত্ত Docker ইমেজ এর উপর ভিত্তি করে কন্টেইনার চালায়।

    ```shell
    kubectl create deployment hello-node --image=k8s.gcr.io/echoserver:1.4
    ```

2. ডিপ্লয়মেন্টটি দেখুন:

    ```shell
    kubectl get deployments
    ```

    অনুরূপ আউটপুট দেখবেন:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

3. পডটি দেখুন:

    ```shell
    kubectl get pods
    ```

    অনুরূপ আউটপুট দেখবেন:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. ক্লাস্টার ইভেন্ট দেখুন:

    ```shell
    kubectl get events
    ```

5. `kubectl` এর কনফিগারেশন দেখুন:

    ```shell
    kubectl config view
    ```

{{< note >}}
`kubectl` কমান্ড সম্পর্কে আরও তথ্যের জন্য, দেখুন [kubectl overview](/docs/reference/kubectl/).
{{< /note >}}

## সার্ভিস (Service) তৈরি করুন

সাধারণত, পড শুধুমাত্র কুবারনেটিস ক্লাস্টারের অভ্যন্তরীণ আইপি (Internal IP) ঠিকানা দ্বারা অ্যাক্সেসযোগ্য। কুবারনেটিস ভার্চুয়াল নেটওয়ার্কের বাইরে থেকে 'hello-node' কন্টেইনারকে অ্যাক্সেসযোগ্য করতে, আপনাকে কুবারনেটিস সার্ভিস হিসাবে পডটিকে প্রকাশ করতে হবে।

1. সর্বজনীন ইন্টারনেটে (Public Internet) পডটি প্রকাশ করুন `kubectl expose` কমান্ড ব্যবহার করে:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    `--type=LoadBalancer` ফ্ল্যগটি নির্দেশ করে যে আপনি ক্লাস্টারের বাইরে আপনার পরিষেবা প্রকাশ করতে চান।
    `k8s.gcr.io/echoserver` কনটেইনারের ভিতরের অ্যাপ্লিকেশন কোড শুধুমাত্র TCP port 8080 থেকেই শোনা হয়। আপনি যদি একটি ভিন্ন পোর্ট প্রকাশ করতে `kubectl expose` ব্যবহার করেন, তাহলে ক্লায়েন্টরা সেই অন্য পোর্টের সাথে সংযোগ করতে পারবে না।

2. তৈরি করা সার্ভিসটি দেখুন:

    ```shell
    kubectl get services
    ```

    অনুরূপ আউটপুট দেখবেন:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    ক্লাউড প্রদানকারীরা (Cloud Providers) যারা লোড ব্যালেন্সার (Load Balancer) সমর্থন করে, তাতে একটি External IP Address ব্যবস্থা করা হয়, সার্ভিসটি অ্যাক্সেস করার জন্য।
    মিনিকিউব-এ, `LoadBalancer` প্রকারটি `minikube service` কমান্ডের মাধ্যমে পরিষেবাটিকে অ্যাক্সেসযোগ্য করে তোলে।

3. নিম্নলিখিত কমান্ড চালান:

    ```shell
    minikube service hello-node
    ```

4. Katacoda পরিবেশ (Katacoda Environment): টার্মিনাল প্যানেলের শীর্ষে প্লাস ক্লিক করুন, তারপরে ক্লিক করুন **Select port to view on Host 1**

5. শুধুমাত্র Katacoda পরিবেশ (Katacoda Environment): সার্ভিস আউটপুটে `8080` এর বিপরীতে প্রদর্শিত ৫-সংখ্যার পোর্ট নম্বরটি নোট করুন। এই পোর্ট নম্বরটি এলোমেলোভাবে তৈরি করা হয়েছে এবং এটি আপনার জন্য আলাদা হতে পারে। পোর্ট নম্বর টেক্সট বক্সে আপনার নম্বর টাইপ করুন, তারপর ডিসপ্ল পোর্টে (default port) ক্লিক করুন। আগের উদাহরণটি ব্যবহার করে, আপনি `30369` টাইপ করবেন।

    এটি একটি ব্রাউজার উইন্ডো খোলে যা আপনার অ্যাপটি পরিবেশন করে এবং অ্যাপের প্রতিক্রিয়া দেখায়।

## অ্যাডন সক্রিয় করুন (Addons)

মিনিকিউব টুলটিতে অন্তর্নির্মিত অ্যাডনগুলির (Internal addons) একটি সেট রয়েছে যা স্থানীয় কুবারনেটিস পরিবেশে এনেবেল (enable), ডিজেবল (disable) এবং ওপেন (open) করা যেতে পারে।

1. বর্তমানে সমর্থিত অ্যাডনগুলির তালিকা:

    ```shell
    minikube addons list
    ```

    অনুরূপ আউটপুট দেখবেন:

    ```
    addon-manager: enabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    gvisor: disabled
    helm-tiller: disabled
    ingress: disabled
    ingress-dns: disabled
    logviewer: disabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    storage-provisioner-gluster: disabled
    ```

2. একটি অ্যাডন এনেবেল (enable) করুন, উদাহরণস্বরূপ `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    অনুরূপ আউটপুট দেখবেন:

    ```
    The 'metrics-server' addon is enabled
    ```

3. আপনার তৈরি করা পড এবং সার্ভিস দেখুন:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    অনুরূপ আউটপুট দেখবেন:

    ```
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/coredns-5644d7b6d9-mh9ll                1/1       Running   0          34m
    pod/coredns-5644d7b6d9-pqd2t                1/1       Running   0          34m
    pod/metrics-server-67fb648c5                1/1       Running   0          26s
    pod/etcd-minikube                           1/1       Running   0          34m
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-apiserver-minikube                 1/1       Running   0          34m
    pod/kube-controller-manager-minikube        1/1       Running   0          34m
    pod/kube-proxy-rnlps                        1/1       Running   0          34m
    pod/kube-scheduler-minikube                 1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/metrics-server         ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

4. ডিজেবল (disable)  করুন `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    অনুরূপ আউটপুট দেখবেন:

    ```
    metrics-server was successfully disabled
    ```

## পরিষ্কার করুন (Clean up)

এখন আপনি আপনার ক্লাস্টারে তৈরি রিসোর্সগুলি পরিষ্কার করতে পারেন:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

ঐচ্ছিকভাবে, মিনিকিউব ভার্চুয়াল মেশিন (Minikube Virtual Machine) বন্ধ করুন:

```shell
minikube stop
```

ঐচ্ছিকভাবে, মিনিকিউব ভার্চুয়াল মেশিন (Minikube Virtual Machine) মুছুন ফেলুন:

```shell
minikube delete
```

## {{% heading "whatsnext" %}}


* _[kubectl এর সাথে কুবারনেটিসে আপনার প্রথম অ্যাপ স্থাপন](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_ করার টিউটোরিয়াল। 
* [Deployment objects](/docs/concepts/workloads/controllers/deployment/) এর ব্যাপারে আরো জানুন।
* [Deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/) এর ব্যাপারে আরো জানুন।
* [Service objects](/docs/concepts/services-networking/service/) এর ব্যাপারে আরো জানুন।
