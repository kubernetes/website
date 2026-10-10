---
reviewers:
- mitul3737
title: উইন্ডোজে kubectl ইনস্টল এবং সেট আপ করুন
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: উইন্ডোজে kubectl ইনস্টল করুন
---

## {{% heading "prerequisites" %}}

আপনাকে অবশ্যই একটি kubectl সংস্করণ ব্যবহার করতে হবে যা আপনার ক্লাস্টারের একটি ছোট সংস্করণের পার্থক্যের মধ্যে রয়েছে। উদাহরণ স্বরূপ, একটি v{{< skew currentVersion >}} ক্লায়েন্ট v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}}, and v{{< skew currentVersionAddMinor 1 >}} কন্ট্রল প্লেনের সাথে যোগাযোগ করতে পারবে।
kubectl এর সর্বশেষ সামঞ্জস্যপূর্ণ সংস্করণ ব্যবহার করা অপ্রত্যাশিত সমস্যাগুলি এড়াতে সাহায্য করে৷

## উইন্ডোজে kubectl ইনস্টল করুন

উইন্ডোজে kubectl ইনস্টল করার জন্য নিম্নলিখিত পদ্ধতিগুলো অনুসরণ করতে পারেন:

- [উইন্ডোজে কার্ল ব্যাবহার kubectl বাইনারি ইনস্টল করুন](#install-kubectl-binary-with-curl-on-windows)
- [Chocolatey, Scoop, বা winget ব্যবহার করে Windows এ ইনস্টল করুন](#install-nonstandard-package-tools)

### উইন্ডোজে কার্ল ব্যাবহার kubectl বাইনারি ইনস্টল করুন

1. সর্বশেষ {{< skew currentVersion >}} প্যাচ রিলিজ ডাউনলোড করুন: [kubectl {{% skew currentPatchVersion %}}](https://dl.k8s.io/release/v{{% skew currentPatchVersion %}}/bin/windows/amd64/kubectl.exe)।

   অথবা যদি আপনার `curl` ইনস্টল থাকে, এই কমান্ডটি ব্যবহার করুন:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/release/v{{% skew currentPatchVersion %}}/bin/windows/amd64/kubectl.exe"
   ```

   {{< note >}}
   সর্বশেষ স্থিতিশীল সংস্করণ খুঁজে বের করতে (উদাহরণস্বরূপ, স্ক্রিপ্টিংয়ের জন্য), [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt) দেখতে পারেন।
   {{< /note >}}

1. বাইনারি যাচাই করুন (অপশনাল)

   `kubectl` চেকসাম ফাইলটি ডাউনলোড করুন:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{% skew currentPatchVersion %}}/bin/windows/amd64/kubectl.exe.sha256"
   ```

   চেকসাম ফাইলের বিপরীতে `kubectl` বাইনারি যাচাই করুন:

   - ডাউনলোড করা চেকসাম ফাইলের সাথে ম্যানুয়ালি `CertUtil` এর আউটপুট তুলনা করতে কমান্ড প্রম্পট ব্যবহার করে:

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   - একটি `True` বা `False` ফলাফল পেতে `-eq` অপারেটর ব্যবহার করে যাচাইকরণ স্বয়ংক্রিয় করতে PowerShell ব্যবহার করে:

     ```powershell
      $(Get-FileHash -Algorithm SHA256 .\kubectl.exe).Hash -eq $(Get-Content .\kubectl.exe.sha256)
     ```

1. আপনার `PATH` এনভায়রনমেন্ট ভেরিয়েবলে `kubectl` বাইনারি ফোল্ডারটি অ্যাপেন্ড বা প্রিপেন্ড করুন।

1. `kubectl`-এর সংস্করণ ডাউনলোড করা একই রকম তা নিশ্চিত করতে পরীক্ষা করুন

   ```cmd
   kubectl version --client
   ```
   {{< note >}}
   উপরের কমান্ডটি একটি সতর্ক বার্তা তৈরি করবে:
   ```
   WARNING: This version information is deprecated and will be replaced with the output from kubectl version --short.
   ```
   আপনি এই সতর্কতা উপেক্ষা করতে পারেন. আপনি শুধুমাত্র `kubectl` এর যে সংস্করণটি ইনস্টল করেছেন তা পরীক্ষা করছেন।
   
   {{< /note >}}
   
   অথবা সংস্করণের বিস্তারিত দেখার জন্য এটি ব্যবহার করুন:

   ```cmd
   kubectl version --client --output=yaml
   ```

1. প্লাগইন ইনস্টল করার পরে, ইনস্টলেশন ফাইলগুলি পরিষ্কার করুন:

   ```powershell
   del kubectl.exe kubectl.exe.sha256
   ```

{{< note >}}
[উইন্ডোজের জন্য ডকার ডেস্কটপ](https://docs.docker.com/docker-for-windows/#kubernetes) `PATH`-এ `kubectl` এর নিজস্ব সংস্করণ যোগ করে।
আপনি যদি আগে ডকার ডেস্কটপ ইনস্টল করে থাকেন, তাহলে আপনাকে ডকার ডেস্কটপ ইনস্টলার দ্বারা যোগ করা একটির আগে আপনার `PATH` এন্ট্রি স্থাপন করতে হবে অথবা ডকার ডেস্কটপের `kubectl` সরিয়ে ফেলতে হবে।
{{< /note >}}

### Chocolatey, Scoop, বা winget ব্যবহার করে Windows এ ইনস্টল করুন {#install-nonstandard-package-tools}

1. উইন্ডোজে kubectl ইনস্টল করতে আপনি উভয় [Chocolatey](https://chocolatey.org) প্যাকেজ ম্যানেজার, [Scoop](https://scoop.sh) কমান্ড-লাইন ইনস্টলার, অথবা [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) প্যাকেজ ম্যানেজার ব্যবহার করতে পারেন। 

   {{< tabs name="kubectl_win_install" >}}
   {{% tab name="choco" %}}
   ```powershell
   choco install kubernetes-cli
   ```
   {{% /tab %}}
   {{% tab name="scoop" %}}
   ```powershell
   scoop install kubectl
   ```
   {{% /tab %}}
   {{% tab name="winget" %}}
   ```powershell
   winget install -e --id Kubernetes.kubectl
   ```
   {{% /tab %}}
   {{< /tabs >}}

1. আপনার ইনস্টল করা সংস্করণ আপ-টু-ডেট কিনা তা নিশ্চিত করতে পরীক্ষা করুন:

   ```powershell
   kubectl version --client
   ```

1. আপনার হোম ডিরেক্টরিতে নেভিগেট করুন:

   ```powershell
   # If you're using cmd.exe, run: cd %USERPROFILE%
   cd ~
   ```

1. `.kube` ডিরেক্টরি তৈরি করুন:

   ```powershell
   mkdir .kube
   ```

1. আপনার তৈরি করা `.kube` ডিরেক্টরিতে ঢুকে পড়ুন:

   ```powershell
   cd .kube
   ```

1. একটি দূরবর্তী Kubernetes ক্লাস্টার ব্যবহার করতে kubectl কনফিগার করুরু

   ```powershell
   New-Item config -type file
   ```

{{< note >}}
আপনার পছন্দের টেক্সট এডিটর, যেমন নোটপ্যাড দিয়ে কনফিগার ফাইলটি সম্পাদনা করুন।
{{< /note >}}

## kubectl কনফিগারেশন যাচাই করুন

{{< include "included/verify-kubectl.md" >}}

## অপশনাল kubectl কনফিগারেশন এবং প্লাগইন

### শেল ওটোকমপ্লিট চালু করুন

kubectl Bash, Zsh, Fish এবং PowerShell-এর জন্য ওটোকম্পিট সমর্থন প্রদান করে, যা আপনাকে অনেক টাইপিং করা থেকে রক্ষা করতে পারে।

পাওয়ারশেলের জন্য ওটোকম্পিট সেট আপ করার পদ্ধতিগুলি নীচে দেওয়া হল।

{{< include "included/optional-kubectl-configs-pwsh.md" >}}

### `kubectl convert` প্লাগইন ইনস্টল করুন

{{< include "included/kubectl-convert-overview.md" >}}

1. কমান্ড সহ সর্বশেষ রিলিজ ডাউনলোড করুন:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/release/v{{% skew currentPatchVersion %}}/bin/windows/amd64/kubectl-convert.exe"
   ```

1. বাইনারি যাচাই করুন (অপশনাল)।

   `kubectl-convert` চেকসাম ফাইলটি ডাউনলোড কর্সনা 

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{% skew currentPatchVersion %}}/bin/windows/amd64/kubectl-convert.exe.sha256"
   ```

   চেকসাম ফাইলের বিপরীতে `kubectl-convert` বাইনারি যাচাই করুন:

   - ডাউনলোড করা চেকসাম ফাইলের সাথে ম্যানুয়ালি `CertUtil` এর আউটপুট তুলনা করতে কমান্ড প্রম্পট ব্যবহার করে:

     ```cmd
     CertUtil -hashfile kubectl-convert.exe SHA256
     type kubectl-convert.exe.sha256
     ```

   - একটি `True` বা `False` ফলাফল পেতে `-eq` অপারেটর ব্যবহার করে যাচাইকরণ স্বয়ংক্রিয় করতে PowerShell ব্যবহার করে:

     ```powershell
     $($(CertUtil -hashfile .\kubectl-convert.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl-convert.exe.sha256)
     ```

1. আপনার `PATH` এনভায়রনমেন্ট ভেরিয়েবলের সাথে `kubectl-convert` বাইনারি ফোল্ডারটি অ্যাপেন্ড বা প্রিপেন্ড করুন।

1. প্লাগইন সফলভাবে ইনস্টল করা হয়েছে যাচাই করুন।

   ```shell
   kubectl convert --help
   ```

   আপনি যদি একটি ত্রুটি দেখতে না পান, এর মানে হল প্লাগইনটি সফলভাবে ইনস্টল করা হয়েছে।

1. প্লাগইন ইনস্টল করার পরে, ইনস্টলেশন ফাইলগুলি পরিষ্কার করুন:

   ```powershell
   del kubectl-convert.exe kubectl-convert.exe.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
