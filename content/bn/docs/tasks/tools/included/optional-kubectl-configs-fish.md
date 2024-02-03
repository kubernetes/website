---
title: "fish স্বয়ংক্রিয় সমাপ্তি"
description: "fish শেল স্বয়ংক্রিয় সমাপ্তি চালু করার জন্য ঐচ্ছিক কনফিগারেশন।"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

{{< note >}}
kubectl 1.23 বা তার পরের সংস্করণ প্রয়োজন fish এর স্বয়ংক্রিয় সমাপ্তি করার জন্য । 
{{< /note >}}

fish এর জন্য kubectl সমাপ্তি স্ক্রিপ্ট `kubectl completion fish` কমান্ড দিয়ে তৈরি করা যেতে পারে। আপনার শেলের মধ্যে সমাপ্তি স্ক্রিপ্ট সোর্স করা kubectl স্বয়ংক্রিয় সমাপ্তি চালু করে।

আপনার সমস্ত শেল সেশনে এটি করতে, আপনার `~/.config/fish/config.fish` ফাইলে নিম্নলিখিত লাইন যুক্ত করুন:

```shell
kubectl completion fish | source
```

আপনার শেল পুনরায় লোড করার পরে, kubectl স্বয়ংক্রিয় সমাপ্তি কাজ করা উচিত। 
