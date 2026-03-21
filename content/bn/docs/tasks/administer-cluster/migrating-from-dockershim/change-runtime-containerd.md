---
title: "একটি Node এ Docker Engine থেকে containerd এ কন্টেইনার রানটাইম পরিবর্তন করা"
weight: 10
content_type: task 
---

এই টাস্কটি Docker থেকে আপনার কন্টেইনার রানটাইম containerd এ আপডেট করার জন্য প্রয়োজনীয় ধাপগুলি রূপরেখা দেয়। এটি
কুবারনেটিস 1.23 বা তার আগের সংস্করণ চালানো ক্লাস্টার অপারেটরদের জন্য প্রযোজ্য। এটি dockershim থেকে containerd এ মাইগ্রেট করার জন্য একটি
উদাহরণ দৃশ্যও কভার করে। বিকল্প কন্টেইনার রানটাইম
এই [পৃষ্ঠা](/bn/docs/setup/production-environment/container-runtimes/) থেকে বেছে নেওয়া যেতে পারে।

## {{% heading "prerequisites" %}}

{{% thirdparty-content %}}

containerd ইনস্টল করুন। আরও তথ্যের জন্য
[containerd এর ইনস্টলেশন ডকুমেন্টেশন](https://containerd.io/docs/getting-started/)
দেখুন এবং নির্দিষ্ট পূর্বশর্তের জন্য
[containerd গাইড](/bn/docs/setup/production-environment/container-runtimes/#containerd) অনুসরণ করুন।

## Node ড্রেইন করুন

```shell
kubectl drain <node-to-drain> --ignore-daemonsets
```

`<node-to-drain>` কে আপনার Node এর নাম দিয়ে প্রতিস্থাপন করুন যা আপনি ড্রেইন করছেন।

## Docker ডেমন বন্ধ করুন

```shell
systemctl stop kubelet
systemctl disable docker.service --now
```

## Containerd ইনস্টল করুন

containerd ইনস্টল করার বিস্তারিত ধাপের জন্য [গাইড](/bn/docs/setup/production-environment/container-runtimes/#containerd)
অনুসরণ করুন।

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Linux" %}}

1. অফিসিয়াল Docker রিপোজিটরি থেকে `containerd.io` প্যাকেজ ইনস্টল করুন।
   আপনার নিজ নিজ Linux ডিস্ট্রিবিউশনের জন্য Docker রিপোজিটরি সেট আপ করার এবং
   `containerd.io` প্যাকেজ ইনস্টল করার নির্দেশাবলী
   [Getting started with containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md) এ পাওয়া যাবে।

1. containerd কনফিগার করুন:

   ```shell
   sudo mkdir -p /etc/containerd
   containerd config default | sudo tee /etc/containerd/config.toml
   ```
1. containerd রিস্টার্ট করুন:

   ```shell
   sudo systemctl restart containerd
   ```
{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}

একটি Powershell সেশন শুরু করুন, `$Version` কে কাঙ্ক্ষিত ভার্সনে সেট করুন (যেমন: `$Version="1.4.3"`), এবং
তারপর নিম্নলিখিত কমান্ডগুলি চালান:

1. containerd ডাউনলোড করুন:

   ```powershell
   curl.exe -L https://github.com/containerd/containerd/releases/download/v$Version/containerd-$Version-windows-amd64.tar.gz -o containerd-windows-amd64.tar.gz
   tar.exe xvf .\containerd-windows-amd64.tar.gz
   ```

2. এক্সট্র্যাক্ট এবং কনফিগার করুন:

   ```powershell
   Copy-Item -Path ".\bin\" -Destination "$Env:ProgramFiles\containerd" -Recurse -Force
   cd $Env:ProgramFiles\containerd\
   .\containerd.exe config default | Out-File config.toml -Encoding ascii

   # কনফিগারেশন পর্যালোচনা করুন। সেটআপের উপর নির্ভর করে আপনি সামঞ্জস্য করতে চাইতে পারেন:
   # - sandbox_image (Kubernetes pause image)
   # - cni bin_dir এবং conf_dir লোকেশন
   Get-Content config.toml

   # (ঐচ্ছিক - কিন্তু অত্যন্ত সুপারিশকৃত) Windows Defender স্ক্যান থেকে containerd বাদ দিন
   Add-MpPreference -ExclusionProcess "$Env:ProgramFiles\containerd\containerd.exe"
   ```

3. containerd শুরু করুন:

   ```powershell
   .\containerd.exe --register-service
   Start-Service containerd
   ```

{{% /tab %}}
{{< /tabs >}}


## kubelet কে তার কন্টেইনার রানটাইম হিসাবে containerd ব্যবহার করতে কনফিগার করুন

`/var/lib/kubelet/kubeadm-flags.env` ফাইল এডিট করুন এবং ফ্ল্যাগে containerd রানটাইম যোগ করুন;
`--container-runtime-endpoint=unix:///run/containerd/containerd.sock`।

kubeadm ব্যবহারকারীদের সচেতন হওয়া উচিত যে kubeadm টুল প্রতিটি Node এ

`/var/lib/kubelet/instance-config.yaml` ফাইলে হোস্টের CRI সকেট সংরক্ষণ করে। আপনি Node এ এই `/var/lib/kubelet/instance-config.yaml` ফাইল তৈরি করতে পারেন।

`/var/lib/kubelet/instance-config.yaml` ফাইল `containerRuntimeEndpoint` প্যারামিটার সেট করার অনুমতি দেয়।

আপনি এই প্যারামিটারের মান আপনার নির্বাচিত CRI সকেটের পাথে সেট করতে পারেন (উদাহরণস্বরূপ `unix:///run/containerd/containerd.sock`)।

## kubelet রিস্টার্ট করুন

```shell
systemctl start kubelet
```

## যাচাই করুন যে Node সুস্থ আছে

`kubectl get nodes -o wide` চালান এবং আমরা এইমাত্র পরিবর্তন করেছি এমন Node এর জন্য রানটাইম হিসাবে containerd প্রদর্শিত হয়।

## Docker Engine সরান

{{% thirdparty-content %}}

যদি Node সুস্থ দেখায়, Docker সরান।

{{< tabs name="tab-remove-docker-engine" >}}
{{% tab name="CentOS" %}}

```shell
sudo yum remove docker-ce docker-ce-cli
```
{{% /tab %}}
{{% tab name="Debian" %}}

```shell
sudo apt-get purge docker-ce docker-ce-cli
```
{{% /tab %}}
{{% tab name="Fedora" %}}

```shell
sudo dnf remove docker-ce docker-ce-cli
```
{{% /tab %}}
{{% tab name="Ubuntu" %}}

```shell
sudo apt-get purge docker-ce docker-ce-cli
```
{{% /tab %}}
{{< /tabs >}}

পূর্ববর্তী কমান্ডগুলি আপনার হোস্টে ইমেজ, কন্টেইনার, ভলিউম বা কাস্টমাইজড কনফিগারেশন ফাইল সরায় না।
সেগুলি মুছতে, [Docker Engine আনইনস্টল করতে](https://docs.docker.com/engine/install/ubuntu/#uninstall-docker-engine) Docker এর নির্দেশাবলী অনুসরণ করুন।

{{< caution >}}
Docker Engine আনইনস্টল করার জন্য Docker এর নির্দেশাবলী containerd মুছে ফেলার ঝুঁকি তৈরি করে। কমান্ড এক্সিকিউট করার সময় সতর্ক থাকুন।
{{< /caution >}}

## Node আনকর্ডন করুন

```shell
kubectl uncordon <node-to-uncordon>
```

`<node-to-uncordon>` কে আপনার Node এর নাম দিয়ে প্রতিস্থাপন করুন যা আপনি আগে ড্রেইন করেছিলেন।
