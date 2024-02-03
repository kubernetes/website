---
title: "macOS এ ব্যাশ স্বয়ংক্রিয় সমাপ্তি"
description: "macOS-এ ব্যাশ স্বয়ংক্রিয় সমাপ্তি এর জন্য কিছু ঐচ্ছিক কনফিগারেশন।"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### ভূমিকা

Bash-এর জন্য kubectl কমপ্লিশন স্ক্রিপ্ট `kubectl completion bash` দিয়ে তৈরি করা যেতে পারে। আপনার শেলে এই স্ক্রিপ্টটি সোর্স করা kubectl সম্পূর্ণতা সক্ষম করে। 

কিন্তু, kubectl কমপ্লিসন স্ক্রিপ্ট নির্ভর করে [**bash-completion**](https://github.com/scop/bash-completion) যা আপনাকে আগে ইনস্টল করতে হবে।

{{< warning>}}
bash-completion এর দুটি সংস্করণ আছে, v1 এবং v2। V1 Bash 3.2 এর জন্য (যা macOS-এ ডিফল্ট), এবং v2 হল Bash 4.1+ এর জন্য। kubectl পূর্ণতা স্ক্রিপ্ট ** কাজ করে না** সঠিকভাবে bash-completion v1 এবং Bash 3.2 এর সাথে। এর জন্য **ব্যাশ-সম্পূর্ণ v2** এবং **ব্যাশ 4.1+** প্রয়োজন। সুতরাং, macOS-এ kubectl সমাপ্তি সঠিকভাবে ব্যবহার করতে সক্ষম হতে, আপনাকে Bash 4.1+ ([*instructions*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)) ইনস্টল এবং ব্যবহার করতে হবে। নিম্নলিখিত নির্দেশাবলী অনুমান করে যে আপনি Bash 4.1+ ব্যবহার করেন (অর্থাৎ, 4.1 বা তার পরবর্তী যেকোনো Bash সংস্করণ)।
{{< /warning >}}

### Bash আপগ্রেড করুন

এখানে নির্দেশাবলী অনুমান করে আপনি ব্যাশ 4.1+ ব্যবহার করছেন। আপনি রান করে আপনার ব্যাশের সংস্করণটি পরীক্ষা করতে পারেন: 

```bash
echo $BASH_VERSION
```

যদি এটি খুব পুরানো হয়, আপনি Homebrew ব্যবহার করে এটি ইনস্টল/আপগ্রেড করতে পারেন: 

```bash
brew install bash
```

আপনার শেল পুনরায় লোড করুন এবং যাচাই করুন যে পছন্দসই সংস্করণটি ব্যবহার করা হচ্ছে: 

```bash
echo $BASH_VERSION $SHELL
```

Homebrew সাধারণত `/usr/local/bin/bash` এ ইনস্টল হয়। 

### ব্যাশ-কমপ্লিসন ইনস্টল করুন

{{< note >}}
উল্লিখিত হিসাবে, এই নির্দেশাবলী অনুমান করে আপনি Bash 4.1+ ব্যবহার করেন, যার মানে আপনি bash-completion v2 ইনস্টল করবেন (Bash 3.2 এবং bash-completion v1 এর বিপরীতে, এই ক্ষেত্রে kubectl সমাপ্তি কাজ করবে না)।
{{< /note >}}

আপনি পরীক্ষা করতে পারেন যদি আপনার bash-completion v2 ইতিমধ্যেই `type _init_completion` দিয়ে ইনস্টল করা আছে। যদি না হয়, আপনি homebrew দিয়ে এটি ইনস্টল করতে পারেন:

```bash
brew install bash-completion@2
```

এই কমান্ডের আউটপুটে যেমন বলা হয়েছে, আপনার `~/.bash_profile` ফাইলে নিম্নলিখিত যোগ করুন: 

```bash
brew_etc="$(brew --prefix)/etc" && [[ -r "${brew_etc}/profile.d/bash_completion.sh" ]] && . "${brew_etc}/profile.d/bash_completion.sh"
```

আপনার শেল পুনরায় লোড করুন এবং যাচাই করুন যে bash-completion v2 সঠিকভাবে `type _init_completion` দিয়ে ইনস্টল করা আছে। 

### kubectl অটোকমপ্লিসন চালু করুন

আপনাকে এখন নিশ্চিত করতে হবে যে আপনার সমস্ত শেল সেশনে kubectl কমপ্লিসনের স্ক্রিপ্টটি পাওয়া যায়। এটি অর্জন করার একাধিক উপায় রয়েছে:  

- আপনার `~/.bash_profile` ফাইলে কমপ্লিসনের স্ক্রিপ্ট উৎস করুন:

    ```bash
    echo 'source <(kubectl completion bash)' >>~/.bash_profile
    ```

- `/usr/local/etc/bash_completion.d` ডিরেক্টরিতে কমপ্লিসনের স্ক্রিপ্ট যোগ করুন:

    ```bash
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- আপনার যদি kubectl এর জন্য একটি উপনাম থাকে তবে আপনি সেই উপনামের সাথে কাজ করার জন্য শেল কমপ্লিসন বাড়াতে পারেন:

    ```bash
    echo 'alias k=kubectl' >>~/.bash_profile
    echo 'complete -o default -F __start_kubectl k' >>~/.bash_profile
    ```

- আপনি যদি হোমব্রু দিয়ে kubectl ইনস্টল করেন (যেমন [এখানে ব্যাখ্যা করা হয়েছে](/docs/tasks/tools/install-kubectl-macos/#install-with-homebrew-on-macos)), তাহলে kubectl কমপ্লিসনের স্ক্রিপ্ট ইতিমধ্যেই `/-এ থাকা উচিত usr/local/etc/bash_completion.d/kubectl`। সেক্ষেত্রে আপনার কিছু করার দরকার নেই।

   {{< note >}}
   bash-completion v2-এর Homebrew ইনস্টলেশনটি `BASH_COMPLETION_COMPAT_DIR` ডিরেক্টরির সমস্ত ফাইলকে উৎস করে, তাই পরবর্তী দুটি পদ্ধতি কাজ করে।
   {{< /note >}}

যে কোনো ক্ষেত্রে, আপনার শেল পুনরায় লোড করার পরে, kubectl সমাপ্তি কাজ করা উচিত।
