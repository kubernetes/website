---
title: APIListChunking
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: aplgha 
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.8"
  - stage: beta
    defaultValue: true
    fromVersion: "1.9"  
    toVersion: "1.28" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.29"    
    toVersion: "1.32"
removed: true
---
به کلاینت‌های API این امکان را بدهید که منابع را از سرور API به صورت تکه‌تکه بازیابی کنند (`LIST` یا `GET`).
