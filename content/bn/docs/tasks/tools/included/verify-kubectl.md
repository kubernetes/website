---
title: "kubectl ইনস্টল যাচাই করুন"
description: "কিভাবে kubectl যাচাই করবেন।"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

kubectl-এর জন্য একটি কুবারনেটিস ক্লাস্টার খুঁজে পেতে এবং অ্যাক্সেস পেতে, যার জন্য প্রয়োজন
[kubeconfig ফাইল](/docs/concepts/configuration/organize-cluster-access-kubeconfig/),
যা স্বয়ংক্রিয়ভাবে তৈরি হয় যখন আপনি একটি ক্লাস্টার তৈরি করেন 
[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh) 
ব্যবহার করে অথবা সফলভাবে একটি Minikube ক্লাস্টার স্থাপন করুন।
ডিফল্টরূপে, kubectl কনফিগারেশন `~/.kube/config` এ অবস্থিত।

ক্লাস্টার অবস্থা পেয়ে kubectl সঠিকভাবে কনফিগার করা হয়েছে তা পরীক্ষা করুন:

```shell
kubectl cluster-info
```

আপনি যদি একটি URL দেখতে পান, তাহলে আপনার ক্লাস্টার অ্যাক্সেস করার জন্য kubectl সঠিকভাবে কনফিগার করা হয়েছে।

আপনি যদি নিম্নলিখিতগুলোর মতো একটি বার্তা দেখতে পান, তাহলে বুঝবেন যে kubectl সঠিকভাবে কনফিগার করা হয়নি
অথবা একটি Kubernetes ক্লাস্টারের সাথে সংযোগ করতে সক্ষম নয়। 

```
সার্ভারের সাথে সংযোগ <server-name:port> প্রত্যাখ্যান করা হয়েছিল - আপনি কি সঠিক হোস্ট বা পোর্ট উল্লেখ করেছেন?
```

উদাহরণস্বরূপ, আপনি যদি আপনার ল্যাপটপে (স্থানীয়ভাবে) একটি কুবারনেটিস ক্লাস্টার চালাতে চান, 
তাহলে আপনাকে প্রথমে মিনিকুবের মতো একটি টুল ইনস্টল করতে হবে এবং তারপরে উপরে বর্ণিত কমান্ডগুলি পুনরায় চালাতে হবে।

যদি kubectl ক্লাস্টার-তথ্য url প্রতিক্রিয়া প্রদান করে কিন্তু আপনি আপনার ক্লাস্টার অ্যাক্সেস করতে না পারেন, 
এটি সঠিকভাবে কনফিগার করা হয়েছে কিনা তা পরীক্ষা করতে, ব্যবহার করুন:

```shell
kubectl cluster-info dump
```

### 'No Auth Provider Found' ত্রুটি বার্তার সমস্যা সমাধান  {#no-auth-provider-found}

কুবারনেটিস 1.26-এ, kubectl নিম্নলিখিত ক্লাউড প্রদানকারীদের পরিচালিত কুবারনেটিস অফারগুলোর জন্য অন্তর্নির্মিত অথেনটিকেশন সরিয়ে দিয়েছে। 
এই প্রদানকারীরা ক্লাউডের-নির্দিষ্ট অথেনটিকেশন প্রদানের জন্য kubectl প্লাগইন প্রকাশ করেছে।
নির্দেশাবলীর জন্য, নিম্নলিখিত প্রদানকারী ডকুমেন্টেশন পড়ুন:

* Azure AKS: [kubelogin plugin](https://azure.github.io/kubelogin/)
* Google Kubernetes Engine: [gke-gcloud-auth-plugin](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_plugin)

(একই ত্রুটির বার্তা দেখার অন্যান্য কারণও থাকতে পারে, এই পরিবর্তনের সাথে সম্পর্কিত নয়।) 
