---
title: TokenRequestServiceAccountUIDValidation
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"

---
Це використовується для того, щоб переконатися, що UID, вказаний у TokenRequest, відповідає UID ServiceAccount, для якого запитується токен. Це допомагає запобігти зловживанню API TokenRequest, гарантуючи, що токени видаються тільки для правильного ServiceAccount.
