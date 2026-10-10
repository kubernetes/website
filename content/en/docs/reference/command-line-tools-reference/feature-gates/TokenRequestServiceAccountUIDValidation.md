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
This is used to ensure that the UID provided in the TokenRequest matches
the UID of the ServiceAccount for which the token is being requested.
It helps prevent misuse of the TokenRequest API by ensuring that
tokens are only issued for the correct ServiceAccount.

