---
title: রেফারেন্স
# approvers: 
# - chenopis  ( The list of approvers is not necessary for the localized version. However, it is included because it helps maintain a certain line break, which further aids in updating a file.That's why it's kept in comment form. )
linkTitle: "রেফারেন্স"
main_menu: true
weight: 70
content_type: concept
no_list: true
---

<!-- overview -->

কুবারনেটিস ডকুমেন্টেশনের এই বিভাগে রেফারেন্স রয়েছে।

<!-- body -->

## API রেফারেন্স

- [শব্দকোষ](/bn/docs/reference/glossary/) - কুবারনেটিস পরিভাষার একটি ব্যাপক, প্রমিত তালিকা

- [কুবারনেটিস API রেফারেন্স](/bn/docs/reference/kubernetes-api/)
- [কুবারনেটিস {{< param "version" >}} জন্য এক-পৃষ্ঠা API রেফারেন্স ](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
- [কুবারনেটিস API-এর ব্যবহার](/bn/docs/reference/using-api/) - কুবারনেটিস API-এর ওভারভিউ
- [API অ্যাক্সেস কন্ট্রোল](/bn/docs/reference/access-authn-authz/) কুবারনেটিস কীভাবে API অ্যাক্সেস কন্ট্রোল করে তার বিশদ বিবরণ
- [সুপরিচিত লেবেল, Annotations এবং Taints](/bn/docs/reference/labels-annotations-taints/)

## অফিসিয়ালি সাপোর্টেড ক্লায়েন্ট লাইব্রেরি

একটি প্রোগ্রামিং ভাষা থেকে কুবারনেটিস API কল করতে, আপনি ব্যবহার করতে পারেন
[ক্লায়েন্ট লাইব্রেরি](/bn/docs/reference/using-api/client-libraries/). অফিসিয়ালি সাপোর্টেড 
ক্লায়েন্ট লাইব্রেরিগুলো:

- [কুবারনেটিস Go ক্লায়েন্ট লাইব্রেরি](https://github.com/kubernetes/client-go/)
- [কুবারনেটিস Python ক্লায়েন্ট লাইব্রেরি](https://github.com/kubernetes-client/python)
- [কুবারনেটিস Java ক্লায়েন্ট লাইব্রেরি](https://github.com/kubernetes-client/java)
- [কুবারনেটিস JavaScript ক্লায়েন্ট লাইব্রেরি](https://github.com/kubernetes-client/javascript)
- [কুবারনেটিস C# ক্লায়েন্ট লাইব্রেরি](https://github.com/kubernetes-client/csharp)
- [কুবারনেটিস Haskell ক্লায়েন্ট লাইব্রেরি](https://github.com/kubernetes-client/haskell)

## CLI

* [kubectl](/bn/docs/reference/kubectl/) - কমান্ড চালানো এবং কুবারনেটিস ক্লাস্টার পরিচালনার জন্য প্রধান CLI টুল।
  * [JSONPath](/bn/docs/reference/kubectl/jsonpath/) - সিনট্যাক্স গাইড [JSONPath expressions](https://goessner.net/articles/JsonPath/) kubectl এর সাথে ব্যবহারের জন্য ।
* [kubeadm](/bn/docs/reference/setup-tools/kubeadm/) - CLI টুল যা সহজে একটি নিরাপদ কুবারনেটিস ক্লাস্টার সরবরাহ করতে পারে।

## উপাদান

* [kubelet](/bn/docs/reference/command-line-tools-reference/kubelet/) - প্রাথমিক
  এজেন্ট যা প্রতিটি নোডে চলে। kubelet টি পডস্পেকসের একটি সেট নেয়
  এবং নিশ্চিত করে যে বর্ণিত কন্টেইনার গুলো চলমান এবং স্বাস্থ্যকর।
* [kube-apiserver](/bn/docs/reference/command-line-tools-reference/kube-apiserver/) -
  REST API যা API অবজেক্ট যেমন পড, সার্ভিস, রেপ্লিকেশন কন্ট্রোলারের জন্য
  ডেটা যাচাই করে এবং কনফিগার করে।
* [kube-controller-manager](/bn/docs/reference/command-line-tools-reference/kube-controller-manager/) -
  ডেমন(Daemon) যা কুবারনেটসের সাথে পাঠানো মূল কন্ট্রোল লুপগুলোকে এম্বেড করে।
* [kube-proxy](/bn/docs/reference/command-line-tools-reference/kube-proxy/) -
  ব্যাক-এন্ডের একটি সেট জুড়ে সাধারণ TCP/UDP স্ট্রিম ফরওয়ার্ডিং বা রাউন্ড-রবিন TCP/UDP
  ফরওয়ার্ডিং করতে পারে।
* [kube-scheduler](/bn/docs/reference/command-line-tools-reference/kube-scheduler/) -
  শিডিউলার যে প্রাপ্যতা, পারফরমেন্স, এবং ক্ষমতা পরিচালনা করে।

  * [শিডিউলার পলিসি](/bn/docs/reference/scheduling/policies)
  * [শিডিউলার প্রোফাইল](/bn/docs/reference/scheduling/config#profiles)

- [পোর্ট এবং প্রোটোকলের](/bn/docs/reference/ports-and-protocols/) তালিকা যা
  কন্ট্রোল প্লেন এবং ওয়ার্কার নোডগুলোতে খুলে রাখা উচিত

## কনফিগ API গুলো

এই বিভাগটি "unpublished" API-এর জন্য ডকুমেন্টেশন হোস্ট করে 
যা কুবারনেটিস উপাদান বা টুল কনফিগার করতে ব্যবহৃত হয়। 
এই API গুলোর বেশিরভাগই API সার্ভার দ্বারা RESTful উপায়ে প্রকাশ করা হয় না 
যদিও সেগুলো একটি ব্যবহারকারী বা অপারেটরের জন্য একটি ক্লাস্টার ব্যবহার বা পরিচালনা করার জন্য অপরিহার্য।


* [kubeconfig (v1)](/bn/docs/reference/config-api/kubeconfig.v1/)
* [kube-apiserver admission (v1)](/bn/docs/reference/config-api/apiserver-admission.v1/)
* [kube-apiserver configuration (v1alpha1)](/bn/docs/reference/config-api/apiserver-config.v1alpha1/) এবং
* [kube-apiserver configuration (v1beta1)](/bn/docs/reference/config-api/apiserver-config.v1beta1/) এবং
  [kube-apiserver configuration (v1)](/bn/docs/reference/config-api/apiserver-config.v1/)
* [kube-apiserver event rate limit (v1alpha1)](/bn/docs/reference/config-api/apiserver-eventratelimit.v1alpha1/)
* [kubelet configuration (v1alpha1)](/bn/docs/reference/config-api/kubelet-config.v1alpha1/) ,
  [kubelet configuration (v1beta1)](/bn/docs/reference/config-api/kubelet-config.v1beta1/) এবং
  [kubelet configuration (v1)](/bn/docs/reference/config-api/kubelet-config.v1/)
* [kubelet credential providers (v1)](/bn/docs/reference/config-api/kubelet-credentialprovider.v1/)
* [kube-scheduler configuration (v1beta3)](/bn/docs/reference/config-api/kube-scheduler-config.v1beta3/) এবং
  [kube-scheduler configuration (v1)](/bn/docs/reference/config-api/kube-scheduler-config.v1/)
* [kube-controller-manager configuration (v1alpha1)](/bn/docs/reference/config-api/kube-controller-manager-config.v1alpha1/)
* [kube-proxy configuration (v1alpha1)](/bn/docs/reference/config-api/kube-proxy-config.v1alpha1/)
* [`audit.k8s.io/v1` API](/bn/docs/reference/config-api/apiserver-audit.v1/)
* [Client authentication API (v1beta1)](/bn/docs/reference/config-api/client-authentication.v1beta1/) এবং 
  [Client authentication API (v1)](/bn/docs/reference/config-api/client-authentication.v1/)
* [WebhookAdmission configuration (v1)](/bn/docs/reference/config-api/apiserver-webhookadmission.v1/)
* [ImagePolicy API (v1alpha1)](/bn/docs/reference/config-api/imagepolicy.v1alpha1/)

## kubeadm এর জন্য কনফিগ API

* [v1beta3](/bn/docs/reference/config-api/kubeadm-config.v1beta3/)
* [v1beta4](/bn/docs/reference/config-api/kubeadm-config.v1beta4/)

## এক্সটার্নাল API গুলো

এগুলো হলো কুবারনেটিস প্রকল্প দ্বারা সংজ্ঞায়িত API, কিন্তু মূল প্রকল্প দ্বারা 
বাস্তবায়িত হয় না:

* [Metrics API (v1beta1)](/bn/docs/reference/external-api/metrics.v1beta1/)
* [Custom Metrics API (v1beta2)](/bn/docs/reference/external-api/custom-metrics.v1beta2)
* [External Metrics API (v1beta1)](/bn/docs/reference/external-api/external-metrics.v1beta1)

## ডিজাইন ডক্স

কুবারনেটিস কার্যকারিতার জন্য ডিজাইন ডক্সের একটি সংরক্ষণাগার। ভাল শুরু পয়েন্ট হয়
[কুবারনেটিস আর্কিটেকচার](https://git.k8s.io/design-proposals-archive/architecture/architecture.md) এবং
[কুবারনেটিস ডিজাইন ওভারভিউ](https://git.k8s.io/design-proposals-archive)।
