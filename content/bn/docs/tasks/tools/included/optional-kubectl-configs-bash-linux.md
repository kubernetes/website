---
title: "লিনাক্সে ব্যাশ স্বয়ংক্রিয় সমাপ্তি"
description: "লিনাক্সে ব্যাশ স্বয়ংক্রিয় সমাপ্তি এর জন্য কিছু ঐচ্ছিক কনফিগারেশন।"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### ভূমিকা

ব্যাশ-এর জন্য kubectl কমপ্লিশন স্ক্রিপ্ট `kubectl completion bash` কমান্ড দিয়ে তৈরি করা যেতে পারে। আপনার শেলে সমাপ্তি স্ক্রিপ্ট সোর্স করা kubectl অটোকমপ্লিসন সক্ষম করে।

যাইহোক, কমপ্লিসন স্ক্রিপ্ট [**ব্যাশ-কমপ্লিসন**](https://github.com/scop/bash-completion) এর উপর নির্ভর করে, তার মানে হচ্ছে আপনাকে প্রথমে এই সফ্টওয়্যারটি ইনস্টল করতে হবে (আপনার ব্যাশ-কমপ্লিসন ইতিমধ্যেই ইনস্টল করা আছে কিনা তা `type _init_completion` চালিয়ে পরীক্ষা করতে পারেন)।

### ব্যাশ-কমপ্লিসন ইনস্টল করুন

ব্যাশ-কমপ্লিসন অনেক প্যাকেজ ম্যানেজার দ্বারা প্রদান করা হয় ([এখানে](https://github.com/scop/bash-completion#installation) দেখুন)। আপনি এটিকে `apt-get install bash-completion` অথবা `yum install bash-completion`, ইত্যাদি দিয়ে ইনস্টল করতে পারেন।

উপরের কমান্ডগুলি `/usr/share/bash-completion/bash_completion` তৈরি করে, যা ব্যাশ-কমপ্লিসন এর প্রধান স্ক্রিপ্ট। আপনার প্যাকেজ ম্যানেজারের উপর নির্ভর করে, আপনাকে ম্যানুয়ালি এই ফাইলটি আপনার `~/.bashrc` ফাইলে সোর্স করতে হবে। 
জানতে চাইলে, আপনার শেল পুনরায় লোড করুন এবং `type_init_completion` চালান। কমান্ডটি সফল হলে, আপনি ইতিমধ্যেই সেট করেছেন, অন্যথায় আপনার `~/.bashrc` ফাইলে নিম্নলিখিত যোগ করুন:

```bash
source /usr/share/bash-completion/bash_completion
```

আপনার শেল পুনরায় লোড করুন এবং `type _init_completion` লিখে ব্যাশ-কমপ্লিসন সঠিকভাবে ইনস্টল করা হয়েছে কিনা তা যাচাই করুন। 

### kubectl অটোকমপ্লিসন চালু করুন

#### ব্যাশ

আপনাকে এখন নিশ্চিত করতে হবে যে kubectl সমাপ্তি স্ক্রিপ্টটি আপনার সমস্ত শেল সেশনে পাওয়া যায়। আপনি এটি করতে পারেন যা দুটি উপায় আছেঃ 

{{< tabs name="kubectl_bash_autocompletion" >}}
{{< tab name="User" codelang="bash" >}}
echo 'source <(kubectl completion bash)' >>~/.bashrc
{{< /tab >}}
{{< tab name="System" codelang="bash" >}}
kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null
{{< /tab >}}
{{< /tabs >}}

আপনার যদি kubectl এর জন্য একটি অ্যালিঅ্যাস থাকে তবে আপনি সেই অ্যালিঅ্যাসের সাথে কাজ করার জন্য শেল কমপ্লিসন বাড়াতে পারেনঃ

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
```

{{< note >}}
ব্যাশ-কমপ্লিসনের সূত্র `/etc/bash_completion.d`-এ সমস্ত কমপ্লিসন স্ক্রিপ্ট।
{{< /note >}}

উভয় পন্থা সমতুল্য। আপনার শেল পুনরায় লোড করার পরে, kubectl অটোকমপ্লিসন কাজ করা উচিত।
শেলের বর্তমান সেশনে ব্যাশ অটোকমপ্লিসন সক্ষম করতে, ~/.bashrc ফাইলটি উৎস করুনঃ 
```bash
source ~/.bashrc
```
