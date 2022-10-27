---
title: Reference (রেফারেন্স)
linkTitle: "রেফারেন্স"
main_menu: true
weight: 70
content_type: ধারণা
no_list: true
---

<!--পরিদর্শন-->

কুবারনেটিস ডকুমেন্টেশনের এই বিভাগে রেফারেন্স রয়েছে।

<!--ডকুমেন্টেশন বডি-->

## এপিআই রেফারেন্স

- [শব্দকোষ](/docs/reference/glossary/) - কুবারনেটিস পরিভাষার একটি ব্যাপক, প্রমিত তালিকা

- [কুবারনেটিস এপিআই রেফারেন্স](/docs/reference/kubernetes-api/)
- [কুবারনেটিস জন্য এক-পৃষ্ঠা এপিআই রেফারেন্স {{< param "version" >}}](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
- [কুবারনেটিস এপিআই-এর ব্যবহার](/docs/reference/using-api/) - কুবারনেটিস এপিআই-এর পরিদর্শন
- [এপিআই প্রবেশাধিকার নিয়ন্ত্রণ](/docs/reference/access-authn-authz/) কুবারনেটিস কীভাবে এপিআই অ্যাক্সেস নিয়ন্ত্রণ করে তার বিশদ বিবরণ
- [সুপরিচিত লেবেল, টীকা এবং কলঙ্ক](/docs/reference/labels-annotations-taints/)

## অধিকারীরূপে সমর্থিত ক্লায়েন্ট লাইব্রেরি

একটি প্রোগ্রামিং ভাষা থেকে কুবারনেটিস এপিআই কল করতে, আপনি ব্যবহার করতে পারেন
[ক্লায়েন্ট লাইব্রেরি](/docs/reference/using-api/client-libraries/). অধিকারীরূপে সমর্থিত ক্লায়েন্ট লাইব্রেরিগুলি:

- [কুবারনেটিস Go ক্লায়েন্ট লাইব্রেরি](https://github.com/kubernetes/client-go/)
- [কুবারনেটিস Python ক্লায়েন্ট লাইব্রেরি](https://github.com/kubernetes-client/python)
- [কুবারনেটিস Java ক্লায়েন্ট লাইব্রেরি](https://github.com/kubernetes-client/java)
- [কুবারনেটিস JavaScript ক্লায়েন্ট লাইব্রেরি](https://github.com/kubernetes-client/javascript)
- [কুবারনেটিস C# ক্লায়েন্ট লাইব্রেরি](https://github.com/kubernetes-client/csharp)
- [কুবারনেটিস Haskell ক্লায়েন্ট লাইব্রেরি](https://github.com/kubernetes-client/haskell)

## সিএলআই

- [kubectl](/docs/reference/kubectl/) - কমান্ড চালানো এবং কুবারনেটিস ক্লাস্টার পরিচালনার জন্য প্রধান CLI টুল।
  - [JSONPath](/docs/reference/kubectl/jsonpath/) - সিনট্যাক্স গাইড [JSONPath expressions](https://goessner.net/articles/JsonPath/) kubectl এর সাথে ব্যবহারের জন্য ।
- [কিউবএডিএম](/docs/reference/setup-tools/kubeadm/) - CLI টুল যা সহজে একটি নিরাপদ কুবারনেটিস ক্লাস্টার সরবরাহ করতে পারে।

## উপাদান

- [কিউবলেট](/docs/reference/command-line-tools-reference/kubelet/) - প্রাথমিক এজেন্ট যা প্রতিটি নোডে চলে। কিউবলেটটি পডস্পেকসের একটি সেট নেয় এবং নিশ্চিত করে যে বর্ণিত পাত্রগুলি চলমান এবং স্বাস্থ্যকর।
- [কিউব-এপিআইসার্ভার](/docs/reference/command-line-tools-reference/kube-apiserver/) - রেস্ট এপিআই যা এপিআই অবজেক্ট যেমন পড, সার্ভিস, রেপ্লিকেশন কন্ট্রোলারের জন্য ডেটা যাচাই করে এবং কনফিগার করে।
- [কিউব-কন্ট্রোলার-ম্যানেজার](/docs/reference/command-line-tools-reference/kube-controller-manager/) - ডেমন যা কুবারনেটসের সাথে পাঠানো মূল নিয়ন্ত্রণ লুপগুলিকে এম্বেড করে।
- [কিউব-প্রক্সি](/docs/reference/command-line-tools-reference/kube-proxy/) - ব্যাক-এন্ডের একটি সেট জুড়ে সাধারণ TCP/UDP স্ট্রিম ফরওয়ার্ডিং বা রাউন্ড-রবিন TCP/UDP ফরওয়ার্ডিং করতে পারে।
- [কিউব-শিডিউলার](/docs/reference/command-line-tools-reference/kube-scheduler/) - শিডিউলার যে প্রাপ্যতা, কর্মক্ষমতা, এবং ক্ষমতা পরিচালনা করে।

  - [শিডিউলার নীতি](/docs/reference/scheduling/policies)
  - [শিডিউলার প্রোফাইল](/docs/reference/scheduling/config#profiles)

- [পোর্ট এবং প্রোটোকলের](/docs/reference/ports-and-protocols/) তালিকা যা
  কন্ট্রোল প্লেন এবং কর্মী নোডগুলিতে খুলে রাখা উচিত

## কনফিগ এপিআইগুলি

এই বিভাগটি "অপ্রকাশিত" এপিআই-এর জন্য ডকুমেন্টেশন হোস্ট করে যা কুবারনেটিস উপাদান বা টুল কনফিগার করতে ব্যবহৃত হয়। এই এপিআইগুলির বেশিরভাগই এপিআই-সার্ভার দ্বারা আরামদায়ক উপায়ে প্রকাশ করা হয় না যদিও সেগুলি একটি ব্যবহারকারী বা অপারেটরের জন্য একটি ক্লাস্টার ব্যবহার বা পরিচালনা করার জন্য অপরিহার্য।

- [কিউব-এপিআইসার্ভার কনফিগারেশন (v1alpha1)](/docs/reference/config-api/apiserver-config.v1alpha1/)
- [কিউব-এপিআইসার্ভার কনফিগারেশন (v1)](/docs/reference/config-api/apiserver-config.v1/)
- [কিউব-এপিআইসার্ভার এনক্রিপশন (v1)](/docs/reference/config-api/apiserver-encryption.v1/)
- [কিউবলেট কনফিগারেশন (v1alpha1)](/docs/reference/config-api/kubelet-config.v1alpha1/) এবং
  [কিউবলেট কনফিগারেশন (v1beta1)](/docs/reference/config-api/kubelet-config.v1beta1/)
- [কিউবলেট শংসাপত্র প্রদানকারী (v1alpha1)](/docs/reference/config-api/kubelet-credentialprovider.v1alpha1/)
- [কিউব-শিডিউলার কনফিগারেশন (v1beta2)](/docs/reference/config-api/kube-scheduler-config.v1beta2/) এবং
  [কিউব-শিডিউলার কনফিগারেশন (v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/)
- [কিউব-প্রক্সি কনফিগারেশন (v1alpha1)](/docs/reference/config-api/kube-proxy-config.v1alpha1/)
- [`audit.k8s.io/v1` এপিআই](/docs/reference/config-api/apiserver-audit.v1/)
- [ক্লায়েন্ট প্রমাণীকরণ এপিআই (v1beta1)](/docs/reference/config-api/client-authentication.v1beta1/) এবং
  [ক্লায়েন্ট প্রমাণীকরণ এপিআই (v1)](/docs/reference/config-api/client-authentication.v1/)
- [ওয়েবহুক অ্যাডমিশন কনফিগারেশন (v1)](/docs/reference/config-api/apiserver-webhookadmission.v1/)

## কিউবএডিএম এর জন্য কনফিগার এপিআই

- [v1beta2](/docs/reference/config-api/kubeadm-config.v1beta2/)
- [v1beta3](/docs/reference/config-api/kubeadm-config.v1beta3/)

## ডিজাইন ডক্স

কুবারনেটিস কার্যকারিতার জন্য ডিজাইন ডক্সের একটি সংরক্ষণাগার বলা যায়। ভাল শুরু পয়েন্ট হয়
[কুবারনেটিস স্থাপত্য](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md) এবং
[কুবারনেটিস ডিজাইন পরিদর্শন](https://git.k8s.io/community/contributors/design-proposals).
