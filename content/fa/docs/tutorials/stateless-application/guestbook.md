```
deployment.apps "redis-follower" deleted
deployment.apps "redis-leader" deleted
deployment.apps "frontend" deleted
service "frontend" deleted
```

2. لیست پادها را بررسی کنید تا مطمئن شوید هیچ پادی در حال اجرا نیست:

```shell
kubectl get pods
```

خروجی باید مشابه زیر باشد:

```
No resources found in default namespace.
```


## {{% heading "گام بعدی" %}}

* تکمیل آموزش‌های تعاملی [مبانی کوبرنتیز](/docs/tutorials/kubernetes-basics/)
* استفاده از کوبرنتیز برای ایجاد یک وبلاگ با استفاده از [Persistent Volumes برای MySQL و Wordpress](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/#visit-your-new-wordpress-blog)
* مطالعه بیشتر درباره [اتصال برنامه‌ها با Serviceها](/docs/tutorials/services/connect-applications-service/)
* مطالعه بیشتر درباره [استفاده مؤثر از Labels](/docs/concepts/overview/working-with-objects/labels/#using-labels-effectively)