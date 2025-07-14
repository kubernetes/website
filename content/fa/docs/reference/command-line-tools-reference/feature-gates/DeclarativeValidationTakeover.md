---
title: DeclarativeValidationTakeover
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
---
وقتی فعال باشد، همراه با دروازه ویژگی [DeclarativeValidation](/docs/reference/command-line-tools-reference/feature-gates/DeclarativeValidation.md)، خطاهای اعتبارسنجی اعلانی مستقیماً به فراخواننده بازگردانده می‌شوند و جایگزین خطاهای اعتبارسنجی دست‌نویس برای قوانینی می‌شوند که پیاده‌سازی اعلانی دارند. وقتی غیرفعال باشد (و `DeclarativeValidation` فعال باشد)، خطاهای اعتبارسنجی دست‌نویس همیشه بازگردانده می‌شوند و اعتبارسنجی اعلانی را در حالت __mismatch validation mode__ قرار می‌دهند که پاسخ‌های API را نظارت می‌کند اما بر آنها تأثیری نمی‌گذارد. این حالت اعتبارسنجی __mismatch validation mode__ امکان نظارت بر معیارهای `declarative_validation_mismatch_total` و `declarative_validation_panic_total` را فراهم می‌کند که جزئیات پیاده‌سازی برای یک پیاده‌سازی ایمن‌تر هستند، کاربر معمولی نیازی به تعامل مستقیم با آن ندارد. این دروازه ویژگی فقط روی kube-apiserver کار می‌کند. نکته: اگرچه اعتبارسنجی اعلانی با اعتبارسنجی دست‌نویس، معادل‌سازی عملکردی را هدف قرار می‌دهد، اما شرح دقیق پیام‌های خطا ممکن است بین این دو رویکرد متفاوت باشد.