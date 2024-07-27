---
title: কুবারনেটিস ডাউনলোড করুন
type: docs
---

কুবারনেটিস প্রতিটি উপাদানের জন্য বাইনারি পাঠায় সেইসাথে একটি ক্লাস্টারের সাথে বুটস্ট্র্যাপ বা
ইন্টারঅ্যাক্ট (interact) করার জন্য ক্লায়েন্ট অ্যাপ্লিকেশনগুলোর একটি আদর্শ সেটও পাঠায়। এপিআই
সার্ভারের মতো উপাদানগুলো একটি ক্লাস্টারের ভিতরে কন্টেইনার ইমেজগুলোর মধ্যে চলতে সক্ষম।
সেই উপাদানগুলো অফিসিয়াল রিলিজ প্রক্রিয়ার অংশ হিসাবে কন্টেইনার ইমেজেও পাঠানো হয়।
সমস্ত বাইনারি এবং সেইসাথে কন্টেইনার ইমেজ একাধিক অপারেটিং সিস্টেমের পাশাপাশি
একাধিক হার্ডওয়্যার আর্কিটেকচারের জন্য উপলব্ধ (available)।

### kubectl

<!-- overview -->

কুবারনেটিস কমান্ড-লাইন টুল, [kubectl](/bn/docs/reference/kubectl/kubectl/),
আপনাকে কুবারনেটিস ক্লাস্টারগুলোর বিপরীতে কমান্ড চালানোর অনুমতি দেয়।

আপনি অ্যাপ্লিকেশন স্থাপন(deploy) করতে, ক্লাস্টার রিসোর্স পরিদর্শন ও পরিচালনা করতে এবং লগ দেখতে kubectl
ব্যবহার করতে পারেন। kubectl অপারেশনগুলোর একটি সম্পূর্ণ তালিকা সহ আরও তথ্যের জন্য,
[`kubectl` রেফারেন্স ডকুমেন্টেশন](/bn/docs/reference/kubectl/) দেখুন।

kubectl বিভিন্ন লিনাক্স প্ল্যাটফর্ম, ম্যাকওস  এবং উইন্ডোজে ইনস্টলযোগ্য।
নীচে আপনার পছন্দের অপারেটিং সিস্টেম খুঁজুন।

- [লিনাক্সে kubectl ইনস্টল করুন](/bn/docs/tasks/tools/install-kubectl-linux)
- [macOS এ kubectl ইনস্টল করুন](/bn/docs/tasks/tools/install-kubectl-macos)
- [উইন্ডোজে kubectl ইনস্টল করুন](/bn/docs/tasks/tools/install-kubectl-windows)

## কন্টেইনার ইমেজ

সমস্ত কুবারনেটিস কন্টেইনার ছবি `registry.k8s.io`
কন্টেইনার ইমেজ রেজিস্ট্রিতে স্থাপন করা হয় ।

| কন্টেইনার ইমেজ                                                           | সাপোর্টেড আর্কিটেকচার             |
| ------------------------------------------------------------------------- | --------------------------------- |
| registry.k8s.io/kube-apiserver:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-controller-manager:v{{< skew currentPatchVersion >}} | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}}              | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-scheduler:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}             | amd64, arm, arm64, ppc64le, s390x |

### কন্টেইনার ইমেজ আর্কিটেকচার

সমস্ত কন্টেইনার ইমেজ একাধিক আর্কিটেকচারের জন্য উপলব্ধ, যেখানে কন্টেইনার
রানটাইম অন্তর্নিহিত প্ল্যাটফর্মের উপর ভিত্তি করে সঠিকটি বেছে নেওয়া উচিত।
কন্টেইনার ইমেজ নামের প্রত্যয়যোগ একটি ডেডিকেটেড আর্কিটেকচারও নেওয়া সম্ভব,
উদাহরণস্বরূপ
`registry.k8s.io/kube-apiserver-arm64:v{{< skew currentPatchVersion >}}`।

### কন্টেইনার ইমেজ স্বাক্ষর

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

কুবারনেটিস {{< skew currentVersion >}} এর জন্য,
কন্টেইনার ইমেজগুলো [sigstore](https://sigstore.dev) স্বাক্ষর
ব্যবহার করে স্বাক্ষরিত হয়:

{{< note >}}
কন্টেইনার ইমেজ sigstore স্বাক্ষর বর্তমানে বিভিন্ন ভৌগলিক অবস্থানের মধ্যে মেলে না।
এই সমস্যা সম্পর্কে আরও তথ্য সংশ্লিষ্ট [GitHub issue](https://github.com/kubernetes/registry.k8s.io/issues/187)
তে পাওয়া যাবে।
{{< /note >}}

কুবারনেটিস প্রজেক্ট [SPDX 2.3](https://spdx.dev/specifications/) ফরম্যাটে স্বাক্ষরিত
কুবারনেটিস কন্টেইনার ইমেজের একটি তালিকা প্রকাশ করে।
আপনি এই তালিকাটি আনতে ব্যবহার করতে পারেন:

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" | grep "SPDXID: SPDXRef-Package-registry.k8s.io" |  grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/'
```

কুবারনেটিস মূল উপাদানগুলোর স্বাক্ষরিত কন্টেইনার ইমেজগুলো ম্যানুয়ালি যাচাই করতে,
[স্বাক্ষরিত কন্টেইনার ইমেজগুলো যাচাই](/bn/docs/tasks/administer-cluster/verify-signed-artifacts) করুন।

আপনি যদি একটি নির্দিষ্ট আর্কিটেকচারের জন্য একটি কন্টেইনার ইমেজ নেন,
তাহলে একক-আর্কিটেকচার ইমেজটি মাল্টি-আর্কিটেকচার ম্যানিফেস্ট তালিকার মতোই সাইন ইন করা হয়।

## বাইনারি

{{< release-binaries >}}
