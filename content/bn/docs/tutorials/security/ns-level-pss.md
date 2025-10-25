---
title: নেমস্পেস স্তরে পড সিকিউরিটি স্ট্যান্ডার্ড প্রয়োগ করুন
content_type: tutorial
weight: 20
---

{{% alert title="নোট" %}}
এই টিউটোরিয়াল শুধুমাত্র নতুন ক্লাস্টারের জন্য প্রযোজ্য।
{{% /alert %}}

**Pod Security Admission** হল একটি অ্যাডমিশন কন্ট্রোলার যা পড তৈরি হওয়ার সময় 
[Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) 
প্রয়োগ করে। এটি Kubernetes v1.25-এ GA (General Availability) হয়েছে।
এই টিউটোরিয়ালে, আপনি `baseline` পড সিকিউরিটি স্ট্যান্ডার্ড একটি নির্দিষ্ট নেমস্পেসে প্রয়োগ করবেন।

আপনি চাইলে ক্লাস্টার স্তরে একাধিক নেমস্পেসে একসাথে পড সিকিউরিটি স্ট্যান্ডার্ড প্রয়োগ করতে পারেন।
বিস্তারিত জানতে দেখুন:
[Apply Pod Security Standards at the cluster level](https://kubernetes.io/docs/tutorials/security/cluster-level-pss/)।

## {{% heading "পূর্বশর্ত" %}}

আপনার ওয়ার্কস্টেশনে নিম্নলিখিত টুলগুলি ইনস্টল করুন:

- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)

## ক্লাস্টার তৈরি করুন

1. নিম্নলিখিত কমান্ড দিয়ে একটি `kind` ক্লাস্টার তৈরি করুন:

   ```shell
   kind create cluster --name psa-ns-level
   ```

   আউটপুট হবে এরকম:

   ```
   Creating cluster "psa-ns-level" ...
    ✓ Ensuring node image (kindest/node:v1.25.0) 🖼
    ✓ Preparing nodes 📦
    ✓ Writing configuration 📜
    ✓ Starting control-plane 🕹️
    ✓ Installing CNI 🔌
    ✓ Installing StorageClass 💾
   Set kubectl context to "kind-psa-ns-level"
   You can now use your cluster with:

   kubectl cluster-info --context kind-psa-ns-level

   Not sure what to do next? 😅  Check out https://kind.sigs.k8s.io/docs/user/quick-start/
   ```

2. নতুন ক্লাস্টারে `kubectl` কনটেক্সট সেট করুন:

   ```shell
   kubectl cluster-info --context kind-psa-ns-level
   ```

   আউটপুট হবে এরকম:

   ```
   Kubernetes control plane is running at https://127.0.0.1:50996
   CoreDNS is running at https://127.0.0.1:50996/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

## একটি নেমস্পেস তৈরি করুন

`example` নামে একটি নতুন নেমস্পেস তৈরি করুন:

```shell
kubectl create ns example
```

আউটপুট হবে:

```
namespace/example created
```

## সেই নেমস্পেসে পড সিকিউরিটি স্ট্যান্ডার্ড সক্রিয় করুন

1. নিম্নলিখিত কমান্ড দিয়ে `example` নেমস্পেসে `baseline` পড সিকিউরিটি স্ট্যান্ডার্ড `warn` মোডে প্রয়োগ করুন:

   ```shell
   kubectl label --overwrite ns example \
     pod-security.kubernetes.io/warn=baseline \
     pod-security.kubernetes.io/warn-version=latest
   ```

2. একই নেমস্পেসে একাধিক পড সিকিউরিটি স্ট্যান্ডার্ড চেক কনফিগার করতে পারেন। নিচের কমান্ডটি `baseline` স্ট্যান্ডার্ড `enforce` মোডে এবং `restricted` স্ট্যান্ডার্ড `warn` ও `audit` মোডে প্রয়োগ করে:

   ```shell
   kubectl label --overwrite ns example \
     pod-security.kubernetes.io/enforce=baseline \
     pod-security.kubernetes.io/enforce-version=latest \
     pod-security.kubernetes.io/warn=restricted \
     pod-security.kubernetes.io/warn-version=latest \
     pod-security.kubernetes.io/audit=restricted \
     pod-security.kubernetes.io/audit-version=latest
   ```

## পড সিকিউরিটি স্ট্যান্ডার্ড প্রয়োগ যাচাই করুন

1. `example` নেমস্পেসে একটি `baseline` পড তৈরি করুন:

   ```shell
   kubectl apply -n example -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```

   পডটি তৈরি হবে, তবে একটি সতর্কবার্তা সহ। উদাহরণস্বরূপ:

   ```
   Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false ...
   pod/nginx created
   ```

2. `default` নেমস্পেসে একই পড তৈরি করুন:

   ```shell
   kubectl apply -n default -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```

   আউটপুট হবে:

   ```
   pod/nginx created
   ```

`example` নেমস্পেসে পড সিকিউরিটি স্ট্যান্ডার্ড প্রয়োগ করা হয়েছে, তাই সতর্কবার্তা দেখানো হয়েছে। কিন্তু `default` নেমস্পেসে কোন সতর্কবার্তা ছাড়াই পডটি তৈরি হয়েছে।

## ক্লিন আপ

উপরের ক্লাস্টারটি মুছে ফেলতে নিম্নলিখিত কমান্ড চালান:

```shell
kind delete cluster --name psa-ns-level
```

## {{% heading "পরবর্তী পদক্ষেপ" %}}

- একটি [শেল স্ক্রিপ্ট](https://kubernetes.io/examples/security/kind-with-namespace-level-baseline-pod-security.sh) চালিয়ে উপরের সব ধাপ একসাথে সম্পন্ন করুন:

  1. kind ক্লাস্টার তৈরি
  2. নতুন নেমস্পেস তৈরি
  3. `baseline` পড সিকিউরিটি স্ট্যান্ডার্ড `enforce` মোডে এবং `restricted` পড সিকিউরিটি স্ট্যান্ডার্ড `warn` ও `audit` মোডে প্রয়োগ
  4. নির্দিষ্ট সিকিউরিটি স্ট্যান্ডার্ড সহ একটি পড তৈরি

- [Pod Security Admission](https://kubernetes.io/docs/concepts/security/pod-security-admission/)
- [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- [Apply Pod Security Standards at the cluster level](https://kubernetes.io/docs/tutorials/security/cluster-level-pss/)
