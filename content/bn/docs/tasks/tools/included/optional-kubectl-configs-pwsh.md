---
title: "PowerShell স্বয়ংক্রিয় সমাপ্তি"
description: "powershell স্বয়ংক্রিয় সমাপ্তি এর জন্য কিছু ঐচ্ছিক কনফিগারেশন।"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

PowerShell-এর জন্য kubectl সমাপ্তি স্ক্রিপ্ট `kubectl completion powershell` কমান্ড দিয়ে তৈরি করা যেতে পারে।

আপনার সমস্ত শেল সেশনে এটি করতে, আপনার `$PROFILE` ফাইলে নিম্নলিখিত লাইন যোগ করুন:

```powershell
kubectl completion powershell | Out-String | Invoke-Expression
```

এই কমান্ডটি প্রতিটি PowerShell স্টার্ট আপে স্বয়ংক্রিয় সমাপ্তি স্ক্রিপ্ট পুনরায় তৈরি করবে। আপনি চাইলে জেনারেট করা স্ক্রিপ্টটি সরাসরি আপনার `$PROFILE` ফাইলে যোগ করতে পারেন। 

আপনার `$PROFILE` ফাইলে জেনারেট করা স্ক্রিপ্ট যোগ করতে, আপনার পাওয়ারশেল প্রম্পটে নিম্নলিখিত লাইনটি চালান:

```powershell
kubectl completion powershell >> $PROFILE
```

আপনার শেল পুনরায় লোড করার পরে, kubectl স্বয়ংক্রিয় সমাপ্তি কাজ করা উচিত।
