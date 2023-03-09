---
title: "verify kubectl install"
description: "How to verify kubectl."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

kubectl-এর জন্য একটি Kubernetes ক্লাস্টার খুঁজে পেতে এবং অ্যাক্সেস করতে, এটির একটি [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) 
প্রয়োজন ,
যেটা আপনি [kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh) ব্যবহার করে একটি ক্লাস্টার তৈরি করার সময় যা স্বয়ংক্রিয়ভাবে তৈরি করতে পারেন 
অথবা সফলভাবে একটি Minikube ক্লাস্টার স্থাপন করুন।

সাধারণত, kubectl কনফিগারেশন `~/.kube/config` এ অবস্থিত।

ক্লাস্টার ষ্টেট পেয়ে kubectl সঠিকভাবে কনফিগার করা হয়েছে তা পরীক্ষা করুন:

```shell
kubectl cluster-info
```

আপনি যদি একটি URL প্রতিক্রিয়া দেখতে পান, তাহলে আপনার ক্লাস্টার অ্যাক্সেস করার জন্য kubectl সঠিকভাবে কনফিগার করা হয়েছে।

আপনি যদি নিম্নলিখিতগুলির মতো একটি বার্তা দেখতে পান, kubectl সঠিকভাবে কনফিগার করা হয়নি বা একটি Kubernetes ক্লাস্টারের সাথে সংযোগ করতে সক্ষম হয়নি।

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

উদাহরণস্বরূপ, আপনি যদি আপনার ল্যাপটপে (স্থানীয়ভাবে) একটি কুবারনেটস ক্লাস্টার চালাতে চান, তাহলে আপনাকে প্রথমে মিনিকুবের মতো একটি টুল ইনস্টল করতে হবে এবং তারপরে উপরে বর্ণিত কমান্ডগুলি পুনরায় চালাতে হবে।

যদি kubectl ক্লাস্টার-তথ্য url প্রতিক্রিয়া প্রদান করে কিন্তু আপনি আপনার ক্লাস্টার অ্যাক্সেস করতে না পারেন, এটি সঠিকভাবে কনফিগার করা হয়েছে কিনা তা পরীক্ষা করতে, ব্যবহার করুন: 

```shell
kubectl cluster-info dump
```
