---
title: Довідник Метрик Kubernetes
content_Тип: reference
auto_generated: false
description: >-
  Деталі щодо метрик, які експортують компоненти Kubernetes.
---

## Метрики (v1.35) {#metrics-v1-35}

<!-- (auto-generated 2026 Jan 06) -->
<!-- (auto-generated v1.35) -->

Ця сторінка містить деталі метрик, які експортують різні компоненти Kubernetes. Ви можете запитувати точки доступу метрик для цих компонентів за допомогою HTTP-запиту та отримувати поточні дані метрик у форматі Prometheus.

### Список стабільних метрик Kubernetes {#list-of-stable-kubernetes-metrics}

Стабільні метрики дотримуються суворих API контрактів, і жодні мітки не можуть бути додані або видалені зі стабільних метрик протягом їхнього життєвого циклу.

<div class="metrics">
    <div class="metric" data-stability="stable">
        <div class="metric_name">apiserver_admission_controller_admission_duration_seconds</div>
        <div class="metric_help">Гістограма затримки контролера допуску в секундах, визначена за назвою та розподілена для кожної операції та ресурсу API і типу (перевірка або допуск).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span><span class="metric_label">operation</span><span class="metric_label">rejected</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">apiserver_admission_step_admission_duration_seconds</div>
        <div class="metric_help">Гістограма затримки підетапу допуску в секундах для кожної операції, ресурсу API та типу етапу (валідація або допуск).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation</span><span class="metric_label">rejected</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">apiserver_admission_webhook_admission_duration_seconds</div>
        <div class="metric_help">Гістограма затримки вебхука в секундах, ідентифікована за назвою та розбита за кожною операцією, ресурсом API та типом (валідація або допуск).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span><span class="metric_label">operation</span><span class="metric_label">rejected</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">apiserver_current_inflight_requests</div>
        <div class="metric_help">Максимальна кількість поточних використаних запитів цього apiserver на тип запиту за останню секунду.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">request_kind</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">apiserver_longrunning_requests</div>
        <div class="metric_help">Вимірювач усіх активних тривалих запитів apiserver, розділених за дієсловом, групою, версією, ресурсом, областю та компонентом. Не всі запити відстежуються таким чином.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">component</span><span class="metric_label">group</span><span class="metric_label">resource</span><span class="metric_label">scope</span><span class="metric_label">subresource</span><span class="metric_label">verb</span><span class="metric_label">version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">apiserver_request_duration_seconds</div>
        <div class="metric_help">Розподіл затримки відповіді в секундах для кожного дієслова, значення dry run, групи, версії, ресурсу, субресурсу, області застосування та компонента.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">component</span><span class="metric_label">dry_run</span><span class="metric_label">group</span><span class="metric_label">resource</span><span class="metric_label">scope</span><span class="metric_label">subresource</span><span class="metric_label">verb</span><span class="metric_label">version</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">apiserver_request_total</div>
        <div class="metric_help">Лічильник запитів apiserver з розбивкою по кожному дієслову, dry run, групі, версії, ресурсу, області застосування, компоненту і коду HTTP-відповіді.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span><span class="metric_label">component</span><span class="metric_label">dry_run</span><span class="metric_label">group</span><span class="metric_label">resource</span><span class="metric_label">scope</span><span class="metric_label">subresource</span><span class="metric_label">verb</span><span class="metric_label">version</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">apiserver_requested_deprecated_apis</div>
        <div class="metric_help">Вимірювач запитуваних застарілих API, розподілених за групами API, версією, ресурсом, субресурсом і видаленим_випуском.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">removed_release</span><span class="metric_label">resource</span><span class="metric_label">subresource</span><span class="metric_label">version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">apiserver_response_sizes</div>
        <div class="metric_help">Розподіл розміру відповіді в байтах для кожної групи, версії, дієслова, ресурсу, субресурсу, області дії та компонента.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">component</span><span class="metric_label">group</span><span class="metric_label">resource</span><span class="metric_label">scope</span><span class="metric_label">subresource</span><span class="metric_label">verb</span><span class="metric_label">version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">apiserver_storage_objects</div>
        <div class="metric_help">[ЗАСТАРІЛО, розгляньте можливість використання apiserver_resource_objects замість цього]Кількість збережених обʼєктів на момент останньої перевірки з розподілом за типом. У разі помилки вибірки значення буде -1.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">resource</span></li>
            <li class="metric_deprecated_version"><label class="metric_detail">Застаріло у версіях:</label><span>1.34.0</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">apiserver_storage_size_bytes</div>
        <div class="metric_help">Розмір сховища для файлу бази даних, фізично виділеного в байтах.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">storage_cluster_id</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">container_cpu_usage_seconds_total</div>
        <div class="metric_help">Сукупний час процесора, який споживає контейнер, у секундах ядра</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">container</span><span class="metric_label">pod</span><span class="metric_label">namespace</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">container_memory_working_set_bytes</div>
        <div class="metric_help">Поточний робочий набір контейнера в байтах</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">container</span><span class="metric_label">pod</span><span class="metric_label">namespace</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">container_start_time_seconds</div>
        <div class="metric_help">Час запуску контейнера в секундах епохи Unix</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">container</span><span class="metric_label">pod</span><span class="metric_label">namespace</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">cronjob_controller_job_creation_skew_duration_seconds</div>
        <div class="metric_help">Час між запланованим запуском cronjob і створенням відповідного завдання</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">job_controller_job_pods_finished_total</div>
        <div class="metric_help">Кількість завершених Podʼів, які повністю відстежуються</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">completion_mode</span><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">job_controller_job_sync_duration_seconds</div>
        <div class="metric_help">Час, необхідний для синхронізації завдання</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">action</span><span class="metric_label">completion_mode</span><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">job_controller_job_syncs_total</div>
        <div class="metric_help">Кількість синхронізацій завдання</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">action</span><span class="metric_label">completion_mode</span><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">job_controller_jobs_finished_total</div>
        <div class="metric_help">Кількість завершених завдань</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">completion_mode</span><span class="metric_label">reason</span><span class="metric_label">result</span></li>
            </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">kube_pod_resource_limit</div>
        <div class="metric_help">Ліміт ресурсів для робочих навантажень в кластері, з розбивкою за Podʼами. Це показує використання ресурсів, яке планувальник і kubelet очікують на кожен Pod для ресурсів, а також одиницю виміру для ресурсу, якщо така є.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">node</span><span class="metric_label">scheduler</span><span class="metric_label">priority</span><span class="metric_label">resource</span><span class="metric_label">unit</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">kube_pod_resource_request</div>
        <div class="metric_help">Ресурси, запитувані робочими навантаженнями в кластері, з розбивкою за Podʼами. Це показує використання ресурсів, яке планувальник і kubelet очікують на кожен Pod для ресурсів, а також одиницю виміру для ресурсу, якщо така є.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">node</span><span class="metric_label">scheduler</span><span class="metric_label">priority</span><span class="metric_label">resource</span><span class="metric_label">unit</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">kubernetes_healthcheck</div>
        <div class="metric_help">Ця метрика фіксує результат однієї перевірки справності.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">kubernetes_healthchecks_total</div>
        <div class="metric_help">Ця метрика фіксує результати всіх перевірок справності.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span><span class="metric_label">status</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">node_collector_evictions_total</div>
        <div class="metric_help">Кількість виселень Node, що відбулися з моменту запуску поточного екземпляра NodeController.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
        <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">zone</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">node_cpu_usage_seconds_total</div>
        <div class="metric_help">Сукупний час процесора, споживаний вузлом у секундах ядра</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">node_memory_working_set_bytes</div>
        <div class="metric_help">Поточний робочий набір вузла в байтах</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">pod_cpu_usage_seconds_total</div>
        <div class="metric_help">Сукупний час процесора, споживаний Podʼом у секундах ядра</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">pod</span><span class="metric_label">namespace</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">pod_memory_working_set_bytes</div>
        <div class="metric_help">Поточний робочий набір Podʼа в байтах</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">pod</span><span class="metric_label">namespace</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">resource_scrape_error</div>
        <div class="metric_help">1, якщо сталася помилка під час отримання метрик контейнера, 0 в іншому випадку</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">scheduler_framework_extension_point_duration_seconds</div>
        <div class="metric_help">Затримка для запуску всіх втулків певної точки розширення.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">extension_point</span><span class="metric_label">profile</span><span class="metric_label">status</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">scheduler_pending_pods</div>
        <div class="metric_help">Кількість відкладених Podʼів за типом черги. 'active' означає кількість Podʼів в activeQ; 'backoff' означає кількість Pods у backoffQ; 'unschedulable' означає кількість Podʼів в unschedulablePods, які планувальник намагався запланувати, але не зміг; 'gated' означає кількість незапланованих Podʼів, які планувальник ніколи не намагався запланувати, тому що вони є gated.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">queue</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">scheduler_pod_scheduling_attempts</div>
        <div class="metric_help">Кількість спроб успішно запланувати Pod.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">scheduler_preemption_attempts_total</div>
        <div class="metric_help">Загальна кількість спроб випередження в кластері до цього часу</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">scheduler_preemption_victims</div>
        <div class="metric_help">Кількість обраних жертв випередження</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">scheduler_queue_incoming_pods_total</div>
        <div class="metric_help">Кількість Podʼів, доданих до черг планування за подіями та типами черг.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">event</span><span class="metric_label">queue</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">scheduler_schedule_attempts_total</div>
        <div class="metric_help">Кількість спроб запланувати Podʼи, за результатом. "unscheduled" означає, що Pod не вдалося запланувати, тоді як "error" означає внутрішню проблему планувальника.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">profile</span><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="stable">
        <div class="metric_name">scheduler_scheduling_attempt_duration_seconds</div>
        <div class="metric_help">Затримка спроби планування в секундах (алгоритм планування + привʼязка)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">STABLE</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">profile</span><span class="metric_label">result</span></li>
        </ul>
    </div>
</div>

### Список бета-метрик Kubernetes {#list-of-beta-kubernetes-metrics}

Бета-метрики дотримуються менш суворих API контрактів порівняно зі стабільними метриками. Жодні мітки не можуть бути видалені з бета-метрик протягом їхнього життєвого циклу, проте мітки можуть бути додані, поки метрика перебуває на етапі бета-тестування. Це забезпечує впевненість у тому, що бета-метрики підтримуватимуть існуючі панелі моніторингу та оповіщення, водночас дозволяючи вносити зміни в майбутньому.

<div class="metrics">
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_authentication_config_controller_automatic_reload_last_timestamp_seconds</div>
        <div class="metric_help">Мітка часу останнього автоматичного перезавантаження конфігурації автентифікації, розділена за статусом та ідентифікатором apiserver.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">apiserver_id_hash</span><span class="metric_label">status</span></li>
        </ul>
        </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_authentication_config_controller_automatic_reloads_total</div>
        <div class="metric_help">Загальна кількість автоматичних перезавантажень конфігурації автентифікації, розподілених за статусом та ідентифікацією apiserver.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">apiserver_id_hash</span><span class="metric_label">status</span></li>
        </ul>
        </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_authorization_config_controller_automatic_reload_last_timestamp_seconds</div>
        <div class="metric_help">Мітка часу останнього автоматичного перезавантаження конфігурації авторизації, розділена за статусом та ідентифікатором apiserver.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">apiserver_id_hash</span><span class="metric_label">status</span></li>
        </ul>
        </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_authorization_config_controller_automatic_reloads_total</div>
        <div class="metric_help">Загальна кількість автоматичних перезавантажень конфігурації авторизації, розподілених за статусом та ідентифікатором apiserver.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">apiserver_id_hash</span><span class="metric_label">status</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_cel_compilation_duration_seconds</div>
        <div class="metric_help">Час компіляції CEL у секундах.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_cel_evaluation_duration_seconds</div>
        <div class="metric_help">CEL evaluation time in seconds.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_flowcontrol_current_executing_requests</div>
        <div class="metric_help">Кількість запитів на початковій (для WATCH) або будь-якій (для не-WATCH) стадії виконання в підсистемі API Priority and Fairness</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">flow_schema</span><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_flowcontrol_current_executing_seats</div>
        <div class="metric_help">Паралельність (кількість місць), яку займають поточні запити, що виконуються (початкова стадія для WATCH, будь-яка інша стадія) у підсистемі API Priority and Fairness</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">flow_schema</span><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_flowcontrol_current_inqueue_requests</div>
        <div class="metric_help">Кількість запитів, що перебувають у чергах підсистеми API Priority and Fairness</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">flow_schema</span><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_flowcontrol_dispatched_requests_total</div>
        <div class="metric_help">Кількість виконаних запитів в підсистемі API Priority and Fairness</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">flow_schema</span><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_flowcontrol_nominal_limit_seats</div>
        <div class="metric_help">Номінальна кількість місць виконання, налаштована для кожного рівня пріоритету</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_flowcontrol_rejected_requests_total</div>
        <div class="metric_help">Кількість запитів, відхилених підсистемою API Priority and Fairness</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">flow_schema</span><span class="metric_label">priority_level</span><span class="metric_label">reason</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_flowcontrol_request_wait_duration_seconds</div>
        <div class="metric_help">Час очікування запиту в черзі</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">execute</span><span class="metric_label">flow_schema</span><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_validating_admission_policy_check_duration_seconds</div>
        <div class="metric_help">Затримка допуску валідації для окремих виразів валідації в секундах, позначена політикою, а також включно із зобовʼязуючими та примусовими діями, що були вжиті.</div>
            <ul>
                <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
                <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
                <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">enforcement_action</span><span class="metric_label">error_type</span><span class="metric_label">policy</span><span class="metric_label">policy_binding</span></li>
            </ul>
        </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_validating_admission_policy_check_total</div>
        <div class="metric_help">Перевірка політики допуску перевіряє загальну суму, позначену політикою, і далі ідентифікує обовʼязковість та вжиті заходи щодо забезпечення дотримання.</div>
            <ul>
                <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
                <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
                <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">enforcement_action</span><span class="metric_label">error_type</span><span class="metric_label">policy</span><span class="metric_label">policy_binding</span></li>
            </ul>
	</div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_validation_declarative_validation_mismatch_total</div>
        <div class="metric_help">Кількість разів, коли результати декларативної валідації відрізнялися від результатів рукописної валідації для основних типів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">apiserver_validation_declarative_validation_panic_total</div>
        <div class="metric_help">Кількість випадків, коли декларативна валідація панікувала під час валідації.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">disabled_metrics_total</div>
        <div class="metric_help">Кількість вимкнених метрик.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">hidden_metrics_total</div>
        <div class="metric_help">Кількість прихованих метрик.</div>
        <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
	        <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
	    </ul>
	</div>
    <div class="metric" data-stability="beta">
	    <div class="metric_name">kubelet_image_volume_mounted_errors_total</div>
        <div class="metric_help">Кількість невдалих спроб монтування тому образу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
        </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">kubelet_image_volume_mounted_succeed_total</div>
        <div class="metric_help">Кількість успішних підключень томів образів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="beta">
	    <div class="metric_name">kubelet_image_volume_requested_total</div>
        <div class="metric_help">Кількість запитаних томів образів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">kubernetes_feature_enabled</div>
        <div class="metric_help">Ця метрика фіксує дані про стадію та ввімкнення функції k8s.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span><span class="metric_label">stage</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">prober_probe_total</div>
        <div class="metric_help">Кумулятивний номер проби життєздатності, готовності або запуску для контейнера за результатом.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">container</span><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">pod_uid</span><span class="metric_label">probe_type</span><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">registered_metrics_total</div>
        <div class="metric_help">Кількість зареєстрованих метрик з розбивкою за рівнем стабільності та версією застарівння.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">deprecated_version</span><span class="metric_label">stability_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="beta">
        <div class="metric_name">scheduler_pod_scheduling_sli_duration_seconds</div>
        <div class="metric_help">E2e затримка для пакета, що планується, з моменту потрапляння пакета в чергу на планування і може включати декілька спроб планування.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">BETA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">attempts</span></li>
        </ul>
    </div>
</div>

### Список альфа-метрик Kubernetes {#list-of-alpha-kubernetes-metrics}

Альфа-метрики не мають жодних гарантій API. Ці метрики слід використовувати на свій страх і ризик, наступні версії Kubernetes можуть взагалі вилучити ці метрики або мутувати API таким чином, щоб зламати наявні інформаційні панелі та сповіщення.

<div class="metrics">
    <div class="metric" data-stability="alpha">
        <div class="metric_name">aggregator_discovery_aggregation_count_total</div>
        <div class="metric_help">Лічильник кількості разів, коли виявлення (discovery) було агреговано</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">aggregator_discovery_nopeer_requests_total</div>
        <div class="metric_help">Лічильник кількості запитів на виявлення без агрегації партнерів (non peer-aggregated)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">aggregator_discovery_peer_aggregated_cache_hits_total</div>
        <div class="metric_help">Лічильник кількості разів, коли виявлення було надано з кешу, агрегованого партнерами (peer-aggregated cache)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">aggregator_discovery_peer_aggregated_cache_misses_total</div>
        <div class="metric_help">Лічильник кількості виявлень, агрегований по всіх API-серверах</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">aggregator_openapi_v2_regeneration_count</div>
        <div class="metric_help">Лічильник кількості регенерацій специфікації OpenAPI v2 розбито за назвою APIService та причиною.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">apiservice</span><span class="metric_label">reason</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">aggregator_openapi_v2_regeneration_duration</div>
        <div class="metric_help">Показник тривалості регенерації специфікації OpenAPI v2 у секундах.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">reason</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">aggregator_unavailable_apiservice</div>
        <div class="metric_help">Кількість APIService, які позначені як недоступні, з розбивкою за назвою APIService.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">aggregator_unavailable_apiservice_total</div>
        <div class="metric_help">Лічильник APIServices, які позначені як недоступні, з розбивкою за назвою APIService та причиною.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span><span class="metric_label">reason</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiextensions_apiserver_validation_ratcheting_seconds</div>
        <div class="metric_help">Час для порівняння старого з новим для цілей CRDValidationRatcheting під час UPDATE в секундах.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiextensions_openapi_v2_regeneration_count</div>
        <div class="metric_help">Лічильник кількості регенерацій специфікації OpenAPI v2, розбитий за назвою та причиною виклику CRD.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">crd</span><span class="metric_label">reason</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiextensions_openapi_v3_regeneration_count</div>
        <div class="metric_help">Лічильник кількості регенерацій специфікації OpenAPI v3 з розбивкою за групами, версіями, джерелом CRD та причиною.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">crd</span><span class="metric_label">group</span><span class="metric_label">reason</span><span class="metric_label">version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_admission_match_condition_evaluation_errors_total</div>
        <div class="metric_help">Кількість помилок оцінки умов допуску, ідентифікованих за назвою ресурсу, що містить умову допуску, з розбивкою для кожного типу, що містить matchConditions ("вебхук" або "політика"), операцію та тип допуску (валідація або допуск).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">kind</span><span class="metric_label">name</span><span class="metric_label">operation</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_admission_match_condition_evaluation_seconds</div>
        <div class="metric_help">Час оцінки відповідності умов допуску в секундах, ідентифікований за назвою і розбитий для кожного типу, що містить matchConditions ("вебхук" або "політика"), операцію і тип (валідація або допуск).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">kind</span><span class="metric_label">name</span><span class="metric_label">operation</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_admission_match_condition_exclusions_total</div>
        <div class="metric_help">Кількість виключень для оцінки відповідності умов допуску, ідентифікована за назвою ресурсу, що містить умову відповідності, і розбита для кожного типу, що містить matchConditions ("вебхук" або "політика"), операцію і тип допуску (валідація або допуск).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">kind</span><span class="metric_label">name</span><span class="metric_label">operation</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_admission_step_admission_duration_seconds_summary</div>
        <div class="metric_help">Зведення затримок на підетапах допуску в секундах для кожної операції, ресурсу API та типу етапу (валідація або допуск) для кожної операції та ресурсу API.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="summary"><label class="metric_detail">Тип:</label> <span class="metric_type">Summary</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation</span><span class="metric_label">rejected</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_admission_webhook_fail_open_count</div>
        <div class="metric_help">Кількість відкритих помилок вебхука допуску, ідентифікованих за іменами та розбитих за кожним типом допуску (валідація або допуск).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_admission_webhook_rejection_count</div>
        <div class="metric_help">Кількість відмов від вебхуків допуску, ідентифікованих за іменами та розбитих за кожним типом допуску (валідація або допуск) та операцією. Додаткові мітки вказують на тип помилки (error_webhook_error або apiserver_internal_error, якщо сталася помилка; no_error в іншому випадку) і необовʼязково ненульовий код відмови, якщо вебхук відхиляє запит з кодом HTTP-статусу (обробляється apiserver, коли код більше або дорівнює 400). Коди, більші за 600, усікаються до 600, щоб обмежити кардинальність метрики.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">error_type</span><span class="metric_label">name</span><span class="metric_label">operation</span><span class="metric_label">rejection_code</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_admission_webhook_request_total</div>
        <div class="metric_help">Загальна кількість запитів на вебхук, ідентифікована за назвою та розбита за типом допуску (валідація чи модифікація) та операцією. Додаткові мітки вказують, чи був запит відхилений, і код статусу HTTP. Коди, що перевищують 600, усікаються до 600, щоб обмежити кардинальність метрики.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span><span class="metric_label">name</span><span class="metric_label">operation</span><span class="metric_label">rejected</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_audit_error_total</div>
        <div class="metric_help">Лічильник подій аудиту, які не були перевірені належним чином. Мітка plugin визначає втулок, на який вплинула помилка.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">plugin</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_audit_event_total</div>
        <div class="metric_help">Лічильник подій аудиту, що генеруються та надсилаються до бекенду аудиту.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_audit_level_total</div>
        <div class="metric_help">Лічильник рівнів політики для подій аудиту (1 на запит).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_audit_requests_rejected_total</div>
        <div class="metric_help">Лічильник запитів apiserver, відхилених через помилку в логах аудиту в бекенді.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_authentication_config_controller_last_config_info</div>
        <div class="metric_help">Інформація про останню застосовану конфігурацію автентифікації з хешем як міткою, розділена за ідентифікатором apiserver.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">apiserver_id_hash</span><span class="metric_label">hash</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_authentication_jwt_authenticator_jwks_fetch_last_key_set_info</div>
        <div class="metric_help">Інформація про останній JWKS, отриманий автентифікатором JWT з хешем як міткою, розділена за ідентифікатором сервера API та емітентом jwt.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">jwt_issuer_hash</span><span class="metric_label">apiserver_id_hash</span><span class="metric_label">hash</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_authentication_jwt_authenticator_jwks_fetch_last_timestamp_seconds</div>
        <div class="metric_help">Часовий відбиток останнього успішного або невдалого виклику JWKS, розділений за результатом, ідентифікатором API-сервера та емітентом JWT для автентифікатора JWT.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">apiserver_id_hash</span><span class="metric_label">jwt_issuer_hash</span><span class="metric_label">result</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_authentication_jwt_authenticator_latency_seconds</div>
        <div class="metric_help">Затримка операцій автентифікації jwt у секундах. Це час, витрачений на автентифікацію токена лише у випадку пропуску в кеші (тобто коли токен не знайдено в кеші).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">jwt_issuer_hash</span><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">apiserver_authorization_config_controller_last_config_info</div>
        <div class="metric_help">Інформація про останню застосовану конфігурацію авторизації з хешем як міткою, розділена за ідентифікатором apiserver.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">apiserver_id_hash</span><span class="metric_label">hash</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_authorization_decisions_total</div>
        <div class="metric_help">Загальна кількість кінцевих рішень, прийнятих авторизатором, з розбивкою за типом авторизатора, імʼям та рішенням.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">decision</span><span class="metric_label">name</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_authorization_match_condition_evaluation_errors_total</div>
        <div class="metric_help">Загальна кількість помилок, коли вебхук авторизації стикається з помилкою умови збігу, з розбивкою за типом та іменем авторизації.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_authorization_match_condition_evaluation_seconds</div>
        <div class="metric_help">Час оцінки умови збігу авторизації в секундах, з розбивкою за типом та іменем авторизатора.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_authorization_match_condition_exclusions_total</div>
        <div class="metric_help">Загальна кількість винятків, коли вебхук авторизації пропускається, оскільки умови збігу виключають його.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_authorization_webhook_duration_seconds</div>
        <div class="metric_help">Затримка запиту в секундах.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_authorization_webhook_evaluations_fail_open_total</div>
        <div class="metric_help">Результат NoOpinion через тайм-аут вебхуку або помилку.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_authorization_webhook_evaluations_total</div>
        <div class="metric_help">Перехід туди-назад до вебхуків авторизації.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_cache_list_fetched_objects_total</div>
        <div class="metric_help">Кількість об’єктів, зчитаних із кешу спостереження під час обслуговування запиту LIST</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">index</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_cache_list_returned_objects_total</div>
        <div class="metric_help">Кількість об’єктів, повернутих за запитом LIST із кешу спостереження</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_cache_list_total</div>
        <div class="metric_help">Кількість запитів LIST, наданих із кешу спостереження</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">index</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_certificates_registry_csr_honored_duration_total</div>
        <div class="metric_help">Загальна кількість виданих CSR із запитаною тривалістю, яка була виконана, розділена за підписувачами (лише імена підписувачів kubernetes.io визначено окремо)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">signerName</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_certificates_registry_csr_requested_duration_total</div>
        <div class="metric_help">Загальна кількість виданих CSR із запитаною тривалістю, розділена за підписувачами (лише імена підписантів kubernetes.io визначено конкретно)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">signerName</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_client_certificate_expiration_seconds</div>
        <div class="metric_help">Розподіл залишкового терміну служби сертифіката, який використовується для автентифікації запиту.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_clusterip_repair_ip_errors_total</div>
        <div class="metric_help">Кількість помилок, виявлених в clusterips циклом ремонту, за типами: leak, repair, full, outOfRange, duplicate, unknown, invalid</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_clusterip_repair_reconcile_errors_total</div>
        <div class="metric_help">Кількість збоїв узгодження в циклі узгодження ремонту clusterip</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_conversion_webhook_duration_seconds</div>
        <div class="metric_help">Затримка запиту конверсії вубхука</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">failure_type</span><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_conversion_webhook_request_total</div>
        <div class="metric_help">Лічильник конверсійних запитів вубхук з успішністю/неуспішністю та типом помилки</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">failure_type</span><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_crd_conversion_webhook_duration_seconds</div>
        <div class="metric_help">Тривалість конверсії CRD вебхука в секундах</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">crd_name</span><span class="metric_label">from_version</span><span class="metric_label">succeeded</span><span class="metric_label">to_version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_current_inqueue_requests</div>
        <div class="metric_help">Максимальна кількість запитів у черзі в цьому apiserver для кожного типу запитів за останню секунду.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">request_kind</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_delegated_authn_request_duration_seconds</div>
        <div class="metric_help">Затримка запиту в секундах. Розбито за кодом статусу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_delegated_authn_request_total</div>
        <div class="metric_help">Кількість HTTP-запитів, розділених за кодом статусу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_delegated_authz_request_duration_seconds</div>
        <div class="metric_help">Затримка запиту в секундах. Розбито за кодом статусу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_delegated_authz_request_total</div>
        <div class="metric_help">Кількість HTTP-запитів, розділених за кодом статусу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_egress_dialer_dial_duration_seconds</div>
        <div class="metric_help">Гістограма затримки набору в секундах, позначена протоколом (http-connect або grpc), транспортом (tcp або uds)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">protocol</span><span class="metric_label">transport</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_egress_dialer_dial_failure_count</div>
        <div class="metric_help">Кількість невдалих спроб зʼєднання, позначених протоколом (http-connect або grpc), транспортом (tcp або uds) та стадією (зʼєднання або проксі). Етап вказує на те, на якому етапі сталася помилка зʼєднання</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">protocol</span><span class="metric_label">stage</span><span class="metric_label">transport</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_egress_dialer_dial_start_total</div>
        <div class="metric_help">Стартує зʼєднання, позначене протоколом (http-connect або grpc) і транспортом (tcp або uds).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">protocol</span><span class="metric_label">transport</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">apiserver_encryption_config_controller_automatic_reload_last_timestamp_seconds</div>
	    <div class="metric_help">Мітка часу останнього успішного або невдалого автоматичного перезавантаження конфігурації шифрування, розділена за ідентифікатором apiserver.</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">apiserver_id_hash</span><span class="metric_label">status</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_encryption_config_controller_automatic_reloads_total</div>
        <div class="metric_help">Загальна кількість успішних і невдалих перезавантажень конфігурації шифрування, розподілених за ідентифікаторами apiserver.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">apiserver_id_hash</span><span class="metric_label">status</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_encryption_config_controller_last_config_info</div>
        <div class="metric_help">Інформація про останню застосовану конфігурацію шифрування з хешем як міткою, розділена за ідентифікатором apiserver.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">apiserver_id_hash</span><span class="metric_label">hash</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_envelope_encryption_dek_cache_fill_percent</div>
        <div class="metric_help">Відсоток слотів кешу, які наразі зайняті кешованими DEK.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_envelope_encryption_dek_cache_inter_arrival_time_seconds</div>
        <div class="metric_help">Час (у секундах) між надходженням запитів на трансформацію.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">transformation_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_envelope_encryption_dek_source_cache_size</div>
        <div class="metric_help">Кількість записів у вихідному кеші ключа шифрування даних (DEK). При перезапуску це значення є наближеним значенням кількості розшифрованих RPC-викликів, які сервер зробить до втулка KMS.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">provider_name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_envelope_encryption_invalid_key_id_from_status_total</div>
        <div class="metric_help">Кількість разів, коли невірний keyID повертається викликом Status RPC з розбивкою по помилках.</div>
            <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">error</span><span class="metric_label">provider_name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_envelope_encryption_key_id_hash_last_timestamp_seconds</div>
        <div class="metric_help">Останній раз в секундах, коли було використано keyID.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">apiserver_id_hash</span><span class="metric_label">key_id_hash</span><span class="metric_label">provider_name</span><span class="metric_label">transformation_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_envelope_encryption_key_id_hash_status_last_timestamp_seconds</div>
        <div class="metric_help">Останній час у секундах, коли ідентифікатор ключа було повернуто викликом Status RPC.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">apiserver_id_hash</span><span class="metric_label">key_id_hash</span><span class="metric_label">provider_name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_envelope_encryption_key_id_hash_total</div>
        <div class="metric_help">Кількість разів використання keyID з розподілом за типом перетворення, провайдером та ідентичністю apiserver.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">apiserver_id_hash</span><span class="metric_label">key_id_hash</span><span class="metric_label">provider_name</span><span class="metric_label">transformation_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_envelope_encryption_kms_operations_latency_seconds</div>
        <div class="metric_help">Загальна тривалість роботи KMS зі статусом коду помилки gRPC.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">grpc_status_code</span><span class="metric_label">method_name</span><span class="metric_label">provider_name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">apiserver_externaljwt_fetch_keys_data_timestamp</div>
	    <div class="metric_help">Мітка часу Unix у секундах останнього успішного значення data_timestamp FetchKeys, повернутого зовнішнім підписувачем</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
	    </ul>
	</div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">apiserver_externaljwt_fetch_keys_request_total</div>
	    <div class="metric_help">Загальна кількість спроб синхронізації підтримуваних JWK</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">apiserver_externaljwt_fetch_keys_success_timestamp</div>
	    <div class="metric_help">Unix Timestamp у секундах останнього успішного запиту FetchKeys</div>
	        <ul>
	            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
	        </ul>
	</div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">apiserver_externaljwt_request_duration_seconds</div>
	    <div class="metric_help">Тривалість та час запиту на виклики до external-jwt-signer</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span><span class="metric_label">method</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">apiserver_externaljwt_sign_request_total</div>
	    <div class="metric_help">Загальна кількість спроб підписати JWT</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_current_inqueue_seats</div>
        <div class="metric_help">Кількість місць у чергах підсистеми API Priority and Fairness, що перебувають на розгляді в даний момент</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">flow_schema</span><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_current_limit_seats</div>
        <div class="metric_help">Поточна похідна кількість місць виконання, доступних для кожного рівня пріоритету</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_current_r</div>
        <div class="metric_help">R(час останньої зміни)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_demand_seats</div>
        <div class="metric_help">Спостереження, в кінці кожної наносекунди, за (кількістю місць, які може використати кожен рівень пріоритету) / (номінальна кількість місць для цього рівня)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="timingratiohistogram"><label class="metric_detail">Тип:</label> <span class="metric_type">TimingRatioHistogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_demand_seats_average</div>
        <div class="metric_help">Середньозважене за часом значення demand_seats за останній період коригування</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_demand_seats_high_watermark</div>
        <div class="metric_help">Найвищий показник, за останній період коригування, для demand_seats</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_demand_seats_smoothed</div>
        <div class="metric_help">Згладжені вимоги до місць</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_demand_seats_stdev</div>
        <div class="metric_help">Середньозважене за часом стандартне відхилення, за останній період коригування, demand_seats</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_dispatch_r</div>
        <div class="metric_help">R(час останньої диспетчеризації)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_epoch_advance_total</div>
        <div class="metric_help">Кількість разів, коли лічильник прогресу набору черг стрибнув назад</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span><span class="metric_label">success</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_latest_s</div>
        <div class="metric_help">S(останній відправлений запит)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_lower_limit_seats</div>
        <div class="metric_help">Налаштовано нижню межу кількості місць виконання, доступних для кожного рівня пріоритету</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_next_discounted_s_bounds</div>
        <div class="metric_help">min і max, за чергою, для S (найстаріша заявка в черзі) — оціночне значення незавершеної роботи</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">bound</span><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_next_s_bounds</div>
        <div class="metric_help">min і max, за чергами, для S (найстаріша заявка в черзі)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">bound</span><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_priority_level_request_utilization</div>
        <div class="metric_help">Спостереження наприкінці кожної наносекунди кількості запитів (у частках від відповідного ліміту), що очікують або перебувають на будь-якій стадії виконання (але тільки на початковій стадії для WATCH)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="timingratiohistogram"><label class="metric_detail">Тип:</label> <span class="metric_type">TimingRatioHistogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">phase</span><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_priority_level_seat_utilization</div>
        <div class="metric_help">Спостереження наприкінці кожної наносекунди за використанням місць на будь-якій стадії виконання (але тільки на початковій стадії для WATCH)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="timingratiohistogram"><label class="metric_detail">Тип:</label> <span class="metric_type">TimingRatioHistogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span></li><li class="metric_labels_constant"><label class="metric_detail">Const Мітки:</label><span class="metric_label">phase:executing</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_read_vs_write_current_requests</div>
        <div class="metric_help">Спостереження наприкінці кожної наносекунди за кількістю запитів (у частках від відповідного ліміту), які очікують на виконання або перебувають на стадії виконання</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="timingratiohistogram"><label class="metric_detail">Тип:</label> <span class="metric_type">TimingRatioHistogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">phase</span><span class="metric_label">request_kind</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_request_concurrency_in_use</div>
        <div class="metric_help">Паралельність (кількість місць), яку займають поточні запити, що виконуються (початкова стадія для WATCH, будь-яка інша стадія) у підсистемі API Priority and Fairness</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">flow_schema</span><span class="metric_label">priority_level</span></li><li class="metric_deprecated_version"><label class="metric_detail">Застаріло у версіях:</label><span>1.31.0</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_request_concurrency_limit</div>
        <div class="metric_help">Номінальна кількість місць виконання, налаштована для кожного рівня пріоритету</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span></li><li class="metric_deprecated_version"><label class="metric_detail">Застаріло у версіях:</label><span>1.30.0</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_request_dispatch_no_accommodation_total</div>
        <div class="metric_help">Кількість випадків, коли спроба диспетчеризації призвела до відмови у розміщенні через відсутність вільних місць</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">flow_schema</span><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_request_execution_seconds</div>
        <div class="metric_help">Тривалість початкового (для WATCH) або будь-якого (для не-WATCH) етапу виконання запиту в підсистемі API Priority and Fairness</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">flow_schema</span><span class="metric_label">priority_level</span><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_request_queue_length_after_enqueue</div>
        <div class="metric_help">Довжина черги в підсистемі API Priority and Fairness, яку бачить кожен запит після того, як його поставлено в чергу</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">flow_schema</span><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_seat_fair_frac</div>
        <div class="metric_help">Справедлива частка паралелізму сервера для виділення кожному рівню пріоритету, який може його використовувати</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_target_seats</div>
        <div class="metric_help">Цілі розподілу місць</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_upper_limit_seats</div>
        <div class="metric_help">Налаштована верхня межа кількості місць виконання, доступних для кожного рівня пріоритету</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_watch_count_samples</div>
        <div class="metric_help">Кількість спостерігачів для запитів, що змінюються, в API Priority and Fairness</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">flow_schema</span><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_flowcontrol_work_estimated_seats</div>
        <div class="metric_help">Кількість розрахункових місць (максимум початкових і кінцевих місць), повʼязаних із запитами в API Priority and Fairness</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">flow_schema</span><span class="metric_label">priority_level</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_init_events_total</div>
        <div class="metric_help">Лічильник подій init, оброблених у watch кеші, з розбивкою за типами ресурсів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_kube_aggregator_x509_insecure_sha1_total</div>
        <div class="metric_help">Підраховує кількість запитів до серверів з незахищеними SHA1-підписами в обслуговуючому сертифікаті АБО кількість збоїв зʼєднання через незахищені SHA1-підписи (або/або, залежно від середовища виконання)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_kube_aggregator_x509_missing_san_total</div>
        <div class="metric_help">Підраховує кількість запитів до серверів, у яких відсутнє розширення SAN в обслуговуючому сертифікаті, АБО кількість збоїв зʼєднання через відсутність x509 сертифіката, у якому відсутнє розширення SAN (або, залежно від середовища виконання)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_mutating_admission_policy_check_duration_seconds</div>
        <div class="metric_help">Затримка допуску мутації для окремих проявів мутації в секундах, позначена політикою та звʼязком.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">error_type</span><span class="metric_label">policy</span><span class="metric_label">policy_binding</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_mutating_admission_policy_check_total</div>
        <div class="metric_help">Перевірка загальної політики допуску мутацій, позначена політикою та додатково ідентифікована звʼязком.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">error_type</span><span class="metric_label">policy</span><span class="metric_label">policy_binding</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_nodeport_repair_port_errors_total</div>
        <div class="metric_help">Кількість помилок, виявлених на портах циклом виправлення, з розбивкою за типом помилки: leak, repair, full, outOfRange, duplicate, unknown</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_nodeport_repair_reconcile_errors_total</div>
        <div class="metric_help">Кількість невдалих спроб узгодження в циклі узгодження відновлення nodeport</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності::</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_request_aborts_total</div>
        <div class="metric_help">Кількість запитів, які apiserver перервав, можливо, через таймаут, для кожної групи, версії, дієслова, ресурсу, субресурсу та області дії</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span><span class="metric_label">scope</span><span class="metric_label">subresource</span><span class="metric_label">verb</span><span class="metric_label">version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_request_body_size_bytes</div>
        <div class="metric_help">Розмір тіла запиту Apiserver в байтах з розбивкою за ресурсами та дієсловами.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span><span class="metric_label">verb</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_request_filter_duration_seconds</div>
        <div class="metric_help">Розподіл затримки фільтрації запитів у секундах для кожного типу фільтрів</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">filter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_request_post_timeout_total</div>
        <div class="metric_help">Відстежує активність обробників запитів після того, як повʼязані з ними запити були вичерпані apiserverʼом</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">source</span><span class="metric_label">status</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_request_sli_duration_seconds</div>
        <div class="metric_help">Розподіл затримок відповіді (не враховуючи тривалості вебхука та часу очікування в черзі пріоритету і справедливості) в секундах для кожного дієслова, групи, версії, ресурсу, субресурсу, області дії та компонента.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">component</span><span class="metric_label">group</span><span class="metric_label">resource</span><span class="metric_label">scope</span><span class="metric_label">subresource</span><span class="metric_label">verb</span><span class="metric_label">version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_request_slo_duration_seconds</div>
        <div class="metric_help">Розподіл затримок відповіді (не враховуючи тривалості вебхука та часу очікування в черзі пріоритету і справедливості) в секундах для кожного дієслова, групи, версії, ресурсу, субресурсу, області дії та компонента.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">component</span><span class="metric_label">group</span><span class="metric_label">resource</span><span class="metric_label">scope</span><span class="metric_label">subresource</span><span class="metric_label">verb</span><span class="metric_label">version</span></li><li class="metric_deprecated_version"><label class="metric_detail">Застаріло у версіях:</label><span>1.27.0</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_request_terminations_total</div>
        <div class="metric_help">Кількість запитів, які apiserver припинив з метою самозахисту.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span><span class="metric_label">component</span><span class="metric_label">group</span><span class="metric_label">resource</span><span class="metric_label">scope</span><span class="metric_label">subresource</span><span class="metric_label">verb</span><span class="metric_label">version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_request_timestamp_comparison_time</div>
        <div class="metric_help">Час, витрачений на порівняння старих і нових обʼєктів у запитах UPDATE або PATCH</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code_path</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_rerouted_request_total</div>
        <div class="metric_help">Загальна кількість запитів, які були перенаправлені на рівноправний kube apiserver через те, що локальний apiserver не зміг їх обслужити</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_resource_objects</div>
        <div class="metric_help">Кількість збережених обʼєктів на момент останньої перевірки, розділених за видами. У разі помилки під час вилучення значення буде -1.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_resource_size_estimate_bytes</div>
        <div class="metric_help">Орієнтовний розмір обʼєктів, що зберігаються в базі даних. Орієнтовний розмір базується на сумі останніх спостережуваних розмірів серіалізованих обʼєктів. У разі помилки під час вилучення значення буде -1.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_selfrequest_total</div>
        <div class="metric_help">Лічильник самозвернень apiserver, розбитий для кожного дієслова, ресурсу API та субресурсу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span><span class="metric_label">subresource</span><span class="metric_label">verb</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_storage_consistency_checks_total</div>
        <div class="metric_help">Лічильник стану перевірок узгодженості між etcd та кешем спостереження</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span><span class="metric_label">status</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_storage_data_key_generation_duration_seconds</div>
        <div class="metric_help">Затримки в секундах операцій генерації ключів шифрування даних (DEK).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_storage_data_key_generation_failures_total</div>
        <div class="metric_help">Загальна кількість невдалих операцій генерації ключів шифрування даних (DEK).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_storage_db_total_size_in_bytes</div>
        <div class="metric_help">Загальний розмір файлу бази даних, фізично виділений в байтах.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">endpoint</span></li><li class="metric_deprecated_version"><label class="metric_detail">Застаріло у версіях:</label><span>1.28.0</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_storage_decode_errors_total</div>
        <div class="metric_help">Кількість збережених помилок декодування обʼєктів з розподілом за типами обʼєктів</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_storage_envelope_transformation_cache_misses_total</div>
        <div class="metric_help">Загальна кількість пропусків кешу при доступі до ключа дешифрування (KEK).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_storage_events_received_total</div>
        <div class="metric_help">Кількість отриманих подій etcd з розбивкою за типами.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_storage_list_evaluated_objects_total</div>
        <div class="metric_help">Кількість протестованих обʼєктів під час обслуговування LIST-запиту зі сховища</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_storage_list_fetched_objects_total</div>
        <div class="metric_help">Кількість обʼєктів, прочитаних зі сховища під час обслуговування LIST-запиту</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_storage_list_returned_objects_total</div>
        <div class="metric_help">Кількість обʼєктів, що повертаються на запит LIST зі сховища</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_storage_list_total</div>
        <div class="metric_help">Кількість запитів LIST, виконаних зі сховища</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_storage_transformation_duration_seconds</div>
        <div class="metric_help">Затримки в секундах операцій перетворення значень.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">transformation_type</span><span class="metric_label">transformer_prefix</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_storage_transformation_operations_total</div>
        <div class="metric_help">Загальна кількість перетворень. Успішне перетворення матиме статус "OK", а у випадку невдалого перетворення — інший рядок статусу. Поля status, resource і transformation_type можна використовувати для сповіщень. Наприклад, ви можете відстежувати збої в шифруванні/розшифруванні за допомогою типу перетворення (наприклад, from_storage для розшифрування і to_storage для шифрування). Крім того, ці поля можна використовувати, щоб переконатися, що до кожного ресурсу застосовуються правильні перетворення.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">resource</span><span class="metric_label">status</span><span class="metric_label">transformation_type</span><span class="metric_label">transformer_prefix</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_stream_translator_requests_total</div>
        <div class="metric_help">Загальна кількість запитів, які були оброблені проксі StreamTranslatorProxy, що обробляє поток RemoteCommand/V5</div>
        <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">apiserver_stream_tunnel_requests_total</div>
	    <div class="metric_help">Загальна кількість запитів, які були оброблені проксі StreamTunnelProxy, що обробляє поток PortForward/V2</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_terminated_watchers_total</div>
        <div class="metric_help">Лічильник спостерігачів закрито через відсутність реакції за типом ресурсу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_tls_handshake_errors_total</div>
        <div class="metric_help">Кількість запитів, відхилених з помилкою 'TLS handshake error from'</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_validation_declarative_validation_panics_total</div>
        <div class="metric_help">Кількість випадків паніки в декларативній валідації, з розбивкою за ідентифікатором валідації.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">validation_identifier</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_validation_declarative_validation_parity_discrepancies_total</div>
        <div class="metric_help">Кількість розбіжностей між декларативною та рукописною валідацією, з розбивкою за ідентифікатором валідації.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">validation_identifier</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_watch_cache_consistent_read_total</div>
        <div class="metric_help">Лічильник послідовних читань з кешу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">fallback</span><span class="metric_label">group</span><span class="metric_label">resource</span><span class="metric_label">success</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_watch_cache_events_dispatched_total</div>
        <div class="metric_help">Лічильник подій, відправлених у кеш watch, розбитий за типами ресурсів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_watch_cache_events_received_total</div>
        <div class="metric_help">Лічильник подій, отриманих у кеші watch, розбитий за типом ресурсу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_watch_cache_initializations_total</div>
        <div class="metric_help">Лічильник ініціалізацій кешу watch, розбитий за типами ресурсів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_watch_cache_read_wait_seconds</div>
        <div class="metric_help">Гістограма часу, витраченого на очікування оновлення кешу watch.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">apiserver_watch_cache_resource_version</div>
	    <div class="metric_help">Поточна версія ресурсу кешу спостереження з розбивкою за типом ресурсу.</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_watch_events_sizes</div>
        <div class="metric_help">Перегляд розподілу розміру події в байтах</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span><span class="metric_label">version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_watch_events_total</div>
        <div class="metric_help">Кількість подій, надісланих клієнтам watch</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span><span class="metric_label">version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_watch_list_duration_seconds</div>
        <div class="metric_help">Розподіл затримки відповіді в секундах для запитів до списків спостереження за групами, версіями, ресурсами та сферами застосування.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span><span class="metric_label">scope</span><span class="metric_label">version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_webhooks_x509_insecure_sha1_total</div>
        <div class="metric_help">Підраховує кількість запитів до серверів з незахищеними SHA1-підписами в обслуговуючому сертифікаті АБО кількість збоїв зʼєднання через незахищені SHA1-підписи (або/або, залежно від середовища виконання)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">apiserver_webhooks_x509_missing_san_total</div>
        <div class="metric_help">Підраховує кількість запитів до серверів, у яких відсутнє розширення SAN в обслуговуючому сертифікаті, АБО кількість збоїв зʼєднання через відсутність x509 сертифіката, у якому відсутнє розширення SAN (або/або, залежно від середовища виконання)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">attach_detach_controller_attachdetach_controller_forced_detaches</div>
        <div class="metric_help">Кількість разів, коли контролер A/D виконував примусове відʼєднання</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">reason</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">attachdetach_controller_total_volumes</div>
        <div class="metric_help">Кількість томів в A/D контролері</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">plugin_name</span><span class="metric_label">state</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">authenticated_user_requests</div>
        <div class="metric_help">Лічильник автентифікованих запитів, розбитий за іменами користувачів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">username</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">authentication_attempts</div>
        <div class="metric_help">Лічильник автентифікованих спроб.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">authentication_duration_seconds</div>
        <div class="metric_help">Тривалість автентифікації в секундах з розбивкою за результатами.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">authentication_token_cache_active_fetch_count</div>
        <div class="metric_help"></div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">status</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">authentication_token_cache_fetch_total</div>
        <div class="metric_help"></div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">status</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">authentication_token_cache_request_duration_seconds</div>
        <div class="metric_help"></div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">status</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">authentication_token_cache_request_total</div>
        <div class="metric_help"></div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">status</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">authorization_attempts_total</div>
        <div class="metric_help">Лічильник спроб авторизації з розбивкою за результатом. Це може бути "allowed", "denied", "no-opinion" або "error".</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">authorization_duration_seconds</div>
        <div class="metric_help">Тривалість авторизації в секундах з розбивкою за результатами.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">cloud_provider_webhook_request_duration_seconds</div>
        <div class="metric_help">Затримка запиту в секундах. З розбивкою по коду статусу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span><span class="metric_label">webhook</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">cloud_provider_webhook_request_total</div>
        <div class="metric_help">Кількість HTTP-запитів, розділених за кодом статусу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span><span class="metric_label">webhook</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">clustertrustbundle_publisher_sync_duration_seconds</div>
	    <div class="metric_help">Час, необхідний для синхронізації кластерного пакета довіри.</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">clustertrustbundle_publisher_sync_total</div>
	    <div class="metric_help">Кількість синхронізацій, що відбулися у видавцеві кластерних пакетів довіри.</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">container_swap_limit_bytes</div>
        <div class="metric_help">Поточний обсяг ліміту свопу контейнера в байтах. Повідомляється тільки на системах, що не є Windows.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">container</span><span class="metric_label">pod</span><span class="metric_label">namespace</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">container_swap_usage_bytes</div>
        <div class="metric_help">Поточний обсяг використання свопу контейнера у байтах. Відображається лише на системах, відмінних від Windows</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">container</span><span class="metric_label">pod</span><span class="metric_label">namespace</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">csi_operations_seconds</div>
        <div class="metric_help">Тривалість роботи інтерфейсу Container Storage Interface з кодом помилки gRPC усього</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">driver_name</span><span class="metric_label">grpc_status_code</span><span class="metric_label">method_name</span><span class="metric_label">migrated</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">device_taint_eviction_controller_pod_deletion_duration_seconds</div>
        <div class="metric_help">Затримка, у секундах, між моментом активації ефекту позначення пристрою позначкою taint і видаленням Pod за допомогою контролера DeviceTaintEvictionController.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">device_taint_eviction_controller_pod_deletions_total</div>
        <div class="metric_help">Загальна кількість Podʼів, видалених DeviceTaintEvictionController з початку роботи.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">dra_grpc_operations_duration_seconds</div>
	    <div class="metric_help">Тривалість у секундах операцій DRA gRPC</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">driver_name</span><span class="metric_label">grpc_status_code</span><span class="metric_label">method_name</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">dra_operations_duration_seconds</div>
	    <div class="metric_help">Гістограма затримки в секундах для тривалості обробки всіх ResourceClaims, на які посилається pod, коли pod запускається або зупиняється. Ідентифікується за назвою операції (PrepareResources або UnprepareResources) і відокремлюється за успішністю операції. Кількість невдалих операцій надається через загальний підрахунок гістограми.</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	    <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
	    <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">is_error</span><span class="metric_label">operation_name</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">dra_resource_claims_in_use</div>
        <div class="metric_help">Кількість ResourceClaims, які наразі використовуються на вузлі, за назвою драйвера (значення мітки driver_name) та для всіх драйверів (спеціальне значення &lt;any&gt; для driver_name). Зверніть увагу, що сума всіх підрахунків за драйверами не є загальною кількістю використовуваних ResourceClaims, оскільки один і той самий ResourceClaim може використовувати пристрої з різних драйверів. Замість цього використовуйте підрахунок для &lt;any&gt; driver_name.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">driver_name</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_controller_changes</div>
        <div class="metric_help">Кількість змін EndpointSlice</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_controller_desired_endpoint_slices</div>
        <div class="metric_help">Кількість EndpointSlices, які могли б існувати при ідеальному розподілі точок доступу</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_controller_endpoints_added_per_sync</div>
        <div class="metric_help">Кількість точок доступу, доданих під час кожної синхронізації Service</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_controller_endpoints_desired</div>
        <div class="metric_help">Кількість бажаних точок доступу</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_controller_endpoints_removed_per_sync</div>
        <div class="metric_help">Кількість видалених точок доступу під час кожної синхронізації Service</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_controller_endpointslices_changed_per_sync</div>
        <div class="metric_help">Кількість EndpointSlices, змінених під час кожної синхронізації Service</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">topology</span><span class="metric_label">traffic_distribution</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_controller_num_endpoint_slices</div>
        <div class="metric_help">Кілкість EndpointSlices</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_controller_services_count_by_traffic_distribution</div>
        <div class="metric_help">Кількість Services, що використовують певний trafficDistribution</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">traffic_distribution</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_controller_syncs</div>
        <div class="metric_help">Кількість синхронізацій EndpointSlice</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_mirroring_controller_addresses_skipped_per_sync</div>
        <div class="metric_help">Кількість адрес, пропущених під час кожної синхронізації точок доступу через те, що вони недійсні або перевищують MaxEndpointsPerSubset</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_mirroring_controller_changes</div>
        <div class="metric_help">Кількість змін EndpointSlice</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_mirroring_controller_desired_endpoint_slices</div>
        <div class="metric_help">Кількість EndpointSlices, які могли б існувати при ідеальному розподілі точок доступу</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_mirroring_controller_endpoints_added_per_sync</div>
        <div class="metric_help">Кількість точок доступу, доданих під час кожної синхронізації Endpoints</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_mirroring_controller_endpoints_desired</div>
        <div class="metric_help">Кількість бажаних точок доступу</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_mirroring_controller_endpoints_removed_per_sync</div>
        <div class="metric_help">Кількість видалених точок доступу під час кожної синхронізації Endpoints</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_mirroring_controller_endpoints_sync_duration</div>
        <div class="metric_help">Тривалість syncEndpoints() у секундах</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_mirroring_controller_endpoints_updated_per_sync</div>
        <div class="metric_help">Кількість точок доступу, оновлених під час кожної синхронізації Endpoints</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">endpoint_slice_mirroring_controller_num_endpoint_slices</div>
        <div class="metric_help">Кількість EndpointSlices</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">ephemeral_volume_controller_create_failures_total</div>
        <div class="metric_help">Кількість запитів на створення PersistentVolumeClaim</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">ephemeral_volume_controller_create_total</div>
        <div class="metric_help">Кількість запитів на створення PersistentVolumeClaim</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">etcd_bookmark_counts</div>
        <div class="metric_help">Кількість закладок etcd (подій, що сповіщають про хід виконання) з розподілом за типами.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">etcd_lease_object_counts</div>
        <div class="metric_help">Кількість обʼєктів, закріплених за одним lease etcd.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">etcd_request_duration_seconds</div>
        <div class="metric_help">Затримка запиту etcd в секундах для кожної операції та типу обʼєкта.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">operation</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">etcd_request_errors_total</div>
        <div class="metric_help">Etcd підраховує кількість невдалих запитів для кожної операції та типу обʼєкта.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">operation</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">etcd_requests_total</div>
        <div class="metric_help">Підрахунок запитів etcd здійснюється для кожної операції та типу обʼєкта.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">operation</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">etcd_version_info</div>
        <div class="metric_help">Версія сервера etcd</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">binary_version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">field_validation_request_duration_seconds</div>
        <div class="metric_help">Розподіл затримки відповіді в секундах для кожного значення валідації поля</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">field_validation</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">force_cleaned_failed_volume_operation_errors_total</div>
        <div class="metric_help">Кількість томів, які не пройшли примусове очищення після реконструкції, не пройшли примусового очищення під час запуску kubelet.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">force_cleaned_failed_volume_operations_total</div>
        <div class="metric_help">Кількість томів, які були примусово очищені після невдалої реконструкції під час запуску kubelet. Сюди входять як успішні, так і невдалі очищення.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">garbagecollector_controller_resources_sync_error_total</div>
        <div class="metric_help">Кількість помилок синхронізації ресурсів збирача сміття</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">horizontal_pod_autoscaler_controller_desired_replicas</div>
	    <div class="metric_help">Поточна бажана кількість реплік для обʼєктів HPA.</div>
	    <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">hpa_name</span><span class="metric_label">namespace</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">horizontal_pod_autoscaler_controller_metric_computation_duration_seconds</div>
        <div class="metric_help">Час (у секундах), який контролер HPA витрачає на обчислення однієї метрики. Мітка 'action' має бути або 'scale_down', або 'scale_up', або 'none'. Мітка 'error' повинна мати значення 'spec', 'internal' або 'none'. Мітка 'metric_type' відповідає HPA.spec.metrics[*].type</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">action</span><span class="metric_label">error</span><span class="metric_label">metric_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">horizontal_pod_autoscaler_controller_metric_computation_total</div>
        <div class="metric_help">Кількість обчислень метрики. Мітка 'action' має бути або 'scale_down', або 'scale_up', або 'none'. Також мітка 'error' повинна мати значення 'spec', 'internal' або 'none'. Мітка 'metric_type' відповідає HPA.spec.metrics[*].type</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">action</span><span class="metric_label">error</span><span class="metric_label">metric_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">horizontal_pod_autoscaler_controller_num_horizontal_pod_autoscalers</div>
        <div class="metric_help">Поточна кількість контрольованих обʼєктів HPA.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">horizontal_pod_autoscaler_controller_reconciliation_duration_seconds</div>
        <div class="metric_help">Час (у секундах), який потрібен контролеру HPA для одноразового узгодження. Мітка 'action' має бути або 'scale_down', або 'scale_up', або 'none'. Також мітка 'error' має бути або 'spec', або 'internal', або 'none'. Зауважте, що якщо під час звірки виникають і специфічні, і внутрішні помилки, то в мітці `error` відображається перша з них.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">action</span><span class="metric_label">error</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">horizontal_pod_autoscaler_controller_reconciliations_total</div>
        <div class="metric_help">Кількість коригувань контролера HPA. Мітка 'action' має бути або 'scale_down', або 'scale_up', або 'none'. Також мітка 'error' має бути або 'spec', або 'internal', або 'none'. Зверніть увагу, що якщо під час узгодження виникають як специфічні, так і внутрішні помилки, то в мітці `error` відображається перша з них.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">action</span><span class="metric_label">error</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">job_controller_job_finished_indexes_total</div>
        <div class="metric_help">`Кількість готових індексів. Можливі значення для мітки статусу: "successed", "failed". Можливі значення для мітки backoffLimit: "perIndex" та "global"`.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">backoffLimit</span><span class="metric_label">status</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">job_controller_job_pods_creation_total</div>
        <div class="metric_help">`Кількість Podʼів, створених контролером Job, позначених причиною створення Podʼа. Ця метрика також розрізняє Podʼи, створені з використанням різних налаштувань PodReplacementPolicy. Можливі значення мітки "reason": "new", "recreate_terminating_or_failed", "recreate_failed", "recreate_failed". Можливі значення мітки "status": "succeeded", "failed".`</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">reason</span><span class="metric_label">status</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">job_controller_jobs_by_external_controller_total</div>
        <div class="metric_help">Кількість Job, якими керує зовнішній контролер</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">controller_name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">job_controller_pod_failures_handled_by_failure_policy_total</div>
        <div class="metric_help">`Кількість збійних Podʼів, оброблених політикою збоїв, відносно дії політики збоїв, застосованої на основі відповідного правила. Можливі значення мітки дії відповідають можливим значенням дії правила політики відмов, а саме: "FailJob", "Ignore" та "Count".`</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">action</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">job_controller_terminated_pods_tracking_finalizer_total</div>
        <div class="metric_help">`Кількість завершених Podʼів (phase=Failed|Successed), які мають завершувач batch.kubernetes.io/job-tracking, Мітка події може бути "add" або "delete".`</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">event</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kube_apiserver_clusterip_allocator_allocated_ips</div>
        <div class="metric_help">Показник, що вимірює кількість виділених IP-адрес для Services</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">cidr</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">kube_apiserver_clusterip_allocator_allocation_duration_seconds</div>
	    <div class="metric_help">Тривалість у секундах для виділення кластерного IP за допомогою ServiceCIDR</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">cidr</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kube_apiserver_clusterip_allocator_allocation_errors_total</div>
        <div class="metric_help">Кількість помилок при виділенні кластерних IP-адрес</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">cidr</span><span class="metric_label">scope</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kube_apiserver_clusterip_allocator_allocation_total</div>
        <div class="metric_help">Кількість розподілених кластерних IP-адрес</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">cidr</span><span class="metric_label">scope</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kube_apiserver_clusterip_allocator_available_ips</div>
        <div class="metric_help">Показник, що вимірює кількість доступних IP-адрес для Services</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">cidr</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kube_apiserver_nodeport_allocator_allocated_ports</div>
        <div class="metric_help">Вимірювання кількості виділених NodePorts для Service</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kube_apiserver_nodeport_allocator_allocation_errors_total</div>
        <div class="metric_help">Кількість помилок при спробі надання NodePort</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">scope</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kube_apiserver_nodeport_allocator_allocation_total</div>
        <div class="metric_help">Кількість виділених NodePorts</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">scope</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kube_apiserver_nodeport_allocator_available_ports</div>
        <div class="metric_help">Вимірювання кількості доступних NodePorts для Services</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kube_apiserver_pod_logs_backend_tls_failure_total</div>
        <div class="metric_help">Загальна кількість запитів до Podʼів/логів, які завершилися невдало через перевірку TLS сервером kubelet</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kube_apiserver_pod_logs_insecure_backend_total</div>
        <div class="metric_help">Загальна кількість запитів до Podʼів/логів за типом використання: enforce_tls, skip_tls_allowed, skip_tls_denied</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">usage</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kube_apiserver_pod_logs_pods_logs_backend_tls_failure_total</div>
        <div class="metric_help">Загальна кількість запитів до Podʼів/логів, які завершилися невдало через перевірку TLS сервера kubelet</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_deprecated_version"><label class="metric_detail">Застаріло у версіях:</label><span>1.27.0</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kube_apiserver_pod_logs_pods_logs_insecure_backend_total</div>
        <div class="metric_help">Загальна кількість запитів до Podʼів/логів за типом використання: enforce_tls, skip_tls_allowed, skip_tls_denied</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">usage</span></li><li class="metric_deprecated_version"><label class="metric_detail">Застаріло у версіях:</label><span>1.27.0</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_active_pods</div>
        <div class="metric_help">Кількість Podʼів, які kubelet вважає активними і які розглядаються при прийнятті нових Podʼів. статичне значення істинне, якщо Pod не від apiserver'а.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">static</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">kubelet_admission_rejections_total</div>
	    <div class="metric_help">Кумулятивна кількість відмов у прийнятті pod від Kubelet.</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">reason</span></li>
            </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_certificate_manager_client_expiration_renew_errors</div>
        <div class="metric_help">Лічильник помилок поновлення сертифікатів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_certificate_manager_client_ttl_seconds</div>
        <div class="metric_help">Показник TTL (час життя) клієнтського сертифіката Kubelet. Значення в секундах до закінчення терміну дії сертифіката (відʼємне, якщо термін дії вже закінчився). Якщо клієнтський сертифікат недійсний або невикористаний, значення буде +INF.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_certificate_manager_server_rotation_seconds</div>
        <div class="metric_help">Гістограма кількості секунд, які проіснував попередній сертифікат перед ротацією.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_certificate_manager_server_ttl_seconds</div>
        <div class="metric_help">Показник найкоротшого TTL (time-to-live) сертифікату обслуговування Kubelet. Значення в секундах до закінчення терміну дії сертифіката (відʼємне, якщо термін дії вже закінчився). Якщо обслуговуючий сертифікат недійсний або невикористаний, значення буде +INF.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_cgroup_manager_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах для операцій cgroup manager. Розбито за методами.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">kubelet_cgroup_version</div>
	    <div class="metric_help">версія cgroup на хостах.</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
	    </ul>
	</div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">kubelet_container_aligned_compute_resources_count</div>
	    <div class="metric_help">Сумарна кількість вирівняних обчислювальних ресурсів, виділених контейнерам за типом вирівнювання.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">boundary</span><span class="metric_label">scope</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_container_aligned_compute_resources_failure_count</div>
        <div class="metric_help">Кумулятивна кількість невдалих спроб розподілити виділені обчислювальні ресурси між контейнерами за типом виділення.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">boundary</span><span class="metric_label">scope</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_container_log_filesystem_used_bytes</div>
        <div class="metric_help">Байти, що використовуються логами контейнера у файловій системі.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">uid</span><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">container</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_container_requested_resizes_total</div>
        <div class="metric_help">Кількість запитів на зміну розміру, підрахована на рівні контейнера. Різні ресурси в одному контейнері підраховуються окремо. Мітка 'requirement' (вимога) відноситься до 'memory' (пам'ять) або 'limits' (обмеження); мітка 'operation' (операція) може бути 'add' (додати), 'remove' (видалити), 'increase' (збільшити) або 'decrease' (зменшити).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation</span><span class="metric_label">requirement</span><span class="metric_label">resource</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_containers_per_pod_count</div>
        <div class="metric_help">Кількість контейнерів на один Pod.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_cpu_manager_allocation_per_numa</div>
        <div class="metric_help">Кількість CPU, виділених на одному вузлі NUMA</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">numa_node</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">kubelet_cpu_manager_exclusive_cpu_allocation_count</div>
	    <div class="metric_help">Загальна кількість процесорів, виділених виключно контейнерам, що працюють на цьому вузлі</div>
	        <ul>
	            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
	        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_cpu_manager_pinning_errors_total</div>
        <div class="metric_help">Кількість розподілів ядер процесора, які потребували pinning, зазнали невдачі.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_cpu_manager_pinning_requests_total</div>
        <div class="metric_help">Кількість розподілів ядер процесора, які потребували pinning.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">kubelet_cpu_manager_shared_pool_size_millicores</div>
	    <div class="metric_help">Розмір спільного пулу процесорів для негарантованих QoS podʼів, у міліядрах процесора.</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
	    </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_credential_provider_config_info</div>
        <div class="metric_help">Інформація про останню застосовану конфігурацію постачальника облікових даних із хешем як міткою</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">hash</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_credential_provider_plugin_duration</div>
        <div class="metric_help">Тривалість виконання в секундах для втулка постачальника облікових даних</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">plugin_name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_credential_provider_plugin_errors_total</div>
        <div class="metric_help">Кількість помилок від втулка постачальника облікових даних</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">plugin_name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_cri_losing_support</div>
        <div class="metric_help">версія Kubernetes, у якій поточна реалізація CRI втратить підтримку, якщо не буде оновлена.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">version</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_desired_pods</div>
        <div class="metric_help">Кількість Podʼів, які kubelet має запустити. static має значення true, якщо pod не від apiserverʼа.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">static</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_device_plugin_alloc_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах обслуговування запиту на виділення втулка пристрою. Розбито за назвою ресурсу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">resource_name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_device_plugin_registration_total</div>
        <div class="metric_help">Загальна кількість реєстрацій втулків для пристроїв. Розбито за назвою ресурсу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">resource_name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_evented_pleg_connection_error_count</div>
        <div class="metric_help">Кількість помилок, що виникли під час встановлення потокового зʼєднання з середовищем виконання CRI.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_evented_pleg_connection_latency_seconds</div>
        <div class="metric_help">Затримка потокового зʼєднання з процесом виконання CRI, вимірюється в секундах.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_evented_pleg_connection_success_count</div>
        <div class="metric_help">Кількість разів, коли потоковий клієнт отримував події CRI.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_eviction_stats_age_seconds</div>
        <div class="metric_help">Час між збором статистики та виселенням Pod на основі цієї статистики за сигналом про виселення</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">eviction_signal</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_evictions</div>
        <div class="metric_help">Сумарна кількість виселень Podʼів за сигналом про виселення</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">eviction_signal</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_graceful_shutdown_end_time_seconds</div>
        <div class="metric_help">Останній час заврешення належного припинення  роботи програмного забезпечення в секундах unix</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_graceful_shutdown_start_time_seconds</div>
        <div class="metric_help">Останній час запуску належного припинення  роботи програмного забезпечення в секундах unix</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_http_inflight_requests</div>
        <div class="metric_help">Кількість запитів http під час польоту</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">long_running</span><span class="metric_label">method</span><span class="metric_label">path</span><span class="metric_label">server_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_http_requests_duration_seconds</div>
        <div class="metric_help">Тривалість обслуговування http-запитів у секундах</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">long_running</span><span class="metric_label">method</span><span class="metric_label">path</span><span class="metric_label">server_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_http_requests_total</div>
        <div class="metric_help">Кількість http запитів, отриманих з моменту запуску сервера</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">long_running</span><span class="metric_label">method</span><span class="metric_label">path</span><span class="metric_label">server_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_image_garbage_collected_total</div>
        <div class="metric_help">Загальна кількість образів, зібраних системою збирання сміття kubelet, незалежно від використання диска або віку образів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">reason</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_image_manager_ensure_image_requests_total</div>
        <div class="metric_help">Кількість запитів ensure-image, оброблених kubelet.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">present_locally</span><span class="metric_label">pull_policy</span><span class="metric_label">pull_required</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_image_pull_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах для отримання образу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">image_size_in_bytes</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_imagemanager_image_mustpull_checks_total</div>
        <div class="metric_help">КЛічильник кількості разів, коли kubelet перевіряв, чи потрібно повторно перевірити облікові дані для доступу до образу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">result</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_imagemanager_inmemory_pulledrecords_usage_percent</div>
        <div class="metric_help">Використання кешу в памʼяті ImagePulledRecords у відсотках.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_imagemanager_inmemory_pullintents_usage_percent</div>
        <div class="metric_help">Використання кешу в памʼяті ImagePullIntents у відсотках.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
	</ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_imagemanager_ondisk_pulledrecords</div>
        <div class="metric_help">Кількість ImagePulledRecords, збережених на диску.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_imagemanager_ondisk_pullintents</div>
        <div class="metric_help">Кількість ImagePullIntents, збережених на диску.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_lifecycle_handler_http_fallbacks_total</div>
        <div class="metric_help">The number of times lifecycle handlers successfully fell back to http from https.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_managed_ephemeral_containers</div>
        <div class="metric_help">Поточна кількість ефемерних контейнерів у Podʼах, якими керує цей kubelet.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_memory_manager_pinning_errors_total</div>
        <div class="metric_help">Кількість розподілів сторінок памʼяті, які потребували закріплення, що не вдалося.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_memory_manager_pinning_requests_total</div>
        <div class="metric_help">Кількість розподілів сторінок памʼяті, які потребували закріплення.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_mirror_pods</div>
        <div class="metric_help">Кількість дзеркальних Podʼів, які спробує створити kubelet (по одному на кожен допустимий статичний Pod)</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_node_name</div>
        <div class="metric_help">Імʼя вузла. Кількість завжди дорівнює 1.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">node</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_node_startup_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах запуску вузла в цілому.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_node_startup_post_registration_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах запуску вузла після реєстрації.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_node_startup_pre_kubelet_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах запуску вузла до запуску kubelet.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_node_startup_pre_registration_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах запуску вузла перед реєстрацією.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_node_startup_registration_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах запуску вузла під час реєстрації.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_orphan_pod_cleaned_volumes</div>
        <div class="metric_help">Загальна кількість осиротілих Pod, чиї томи були очищені під час останнього періодичного обстеження.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_orphan_pod_cleaned_volumes_errors</div>
        <div class="metric_help">Кількість осиротілих Pod, чиї томи не вдалося очистити під час останнього періодичного обстеження.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_orphaned_runtime_pods_total</div>
        <div class="metric_help">Кількість Podʼів, які були виявлені в середовищі виконання контейнерів, які невідомі для pod worker. Це зазвичай вказує на те, що kubelet був перезапущений під час примусового видалення Pod в API або в локальній конфігурації, що є незвичним.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pleg_discard_events</div>
        <div class="metric_help">Кількість подій відхилення в PLEG (Pod Lifecycle Event Generator).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pleg_last_seen_seconds</div>
        <div class="metric_help">Позначка часу в секундах, коли PLEG востаннє був активний.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pleg_relist_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах для повторного переліку Podʼів в PLEG.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pleg_relist_interval_seconds</div>
        <div class="metric_help">Інтервал у секундах між повторними переліками в PLEG.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_deferred_accepted_resizes_total</div>
        <div class="metric_help">Кумулятивна кількість змін розміру, які були прийняті після відстрочки.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">retry_trigger</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_in_progress_resizes</div>
        <div class="metric_help">Кількість поточних змін розміру для podʼів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_infeasible_resizes_total</div>
        <div class="metric_help">Кількість неможливих змін розміру для podʼів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">reason_detail</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_pending_resizes</div>
        <div class="metric_help">Кількість очікуючих змін розміру для podʼів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">reason</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_resize_duration_milliseconds</div>
        <div class="metric_help">Тривалість у мілісекундах для активації зміни розміру podʼа</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">success</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_resources_endpoint_errors_get</div>
        <div class="metric_help">Кількість запитів до точки доступу PodResource Get, які повернули помилку. Розбито за версіями API сервера.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">server_api_version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_resources_endpoint_errors_get_allocatable</div>
        <div class="metric_help">Кількість запитів до точки доступу PodResource GetAllocatableResources, які повернули помилку. Розбито за версіями API сервера.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">server_api_version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_resources_endpoint_errors_list</div>
        <div class="metric_help">Кількість запитів до точки доступу PodResource List, які повернули помилку. Розбито за версіями API сервера.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">server_api_version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_resources_endpoint_requests_get</div>
        <div class="metric_help">Кількість запитів до точки доступу PodResource Get, розбита за версіями API сервера.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">server_api_version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_resources_endpoint_requests_get_allocatable</div>
        <div class="metric_help">Кількість запитів до точки доступу PodResource GetAllocatableResources, розбита за версіями API сервера.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">server_api_version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_resources_endpoint_requests_list</div>
        <div class="metric_help">Кількість запитів до точки доступу PodResource List, розбита за версіями API сервера.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">server_api_version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_resources_endpoint_requests_total</div>
        <div class="metric_help">Загальна кількість запитів до точки доступу PodResource, розбита за версіями API сервера.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">server_api_version</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_start_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах від першого виявлення kubelet'ом Podʼа до початку його запуску.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_start_sli_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах для запуску Pod, за виключенням часу на завантаження образів та виконання init-контейнерів, виміряна з моменту позначки часу створення Pod до того, як всі його контейнери будуть відзначені як запущені та доступні для спостереження через watch.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_start_total_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах для запуску Pod з моменту створення, включаючи час на завантаження образів та виконання init-контейнерів, виміряна з позначки часу створення Pod до того моменту, коли всі його контейнери будуть відзначені як запущені та доступні для спостережені через watch.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_status_sync_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах синхронізації оновлення статусу Pod. Вимірює час від виявлення зміни статусу Pod до успішного оновлення API для цього Pod, навіть якщо відбулося кілька проміжних змін статусу Pod.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_worker_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах синхронізації одного Pod, розбита за операціями: create, update або sync.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_pod_worker_start_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах від моменту, коли kubelet виявляє Pod до початку запуску виконавця робочого навантаження.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_podcertificate_states</div>
        <div class="metric_help">Вектор-показник, що повідомляє про кількість джерел спроєцьованих томів сертифікатів подів, згрупованих за signer_name та state.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">signer_name</span><span class="metric_label">state</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_preemptions</div>
        <div class="metric_help">Загальна кількість передчасних випереджень Podʼів за ресурсом випередження.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">preemption_signal</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_restarted_pods_total</div>
        <div class="metric_help">Кількість Podʼів, які були перезапущені через те, що вони були видалені та створені знову з тим самим UID, поки kubelet відстежував їх (звично для статичних Podʼів, надзвичайно рідко для pod API).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">static</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_run_podsandbox_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах операцій run_podsandbox. Розбито за RuntimeClass.Handler.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">runtime_handler</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_run_podsandbox_errors_total</div>
        <div class="metric_help">Загальна кількість помилок операцій run_podsandbox в розрізі RuntimeClass.Handler.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">runtime_handler</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_running_containers</div>
        <div class="metric_help">Кількість контейнерів, що зараз працюють.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">container_state</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_running_pods</div>
        <div class="metric_help">Кількість Podʼів, які мають працюючий pod sandbox</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_runtime_operations_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах операцій середовища виконання. Розбито за типом операції.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_runtime_operations_errors_total</div>
        <div class="metric_help">Загальна кількість помилок операцій середовища виконання за типом операції.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_runtime_operations_total</div>
        <div class="metric_help">Загальна кількість операцій середовища виконання за типом операції.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_server_expiration_renew_errors</div>
        <div class="metric_help">Лічильник помилок оновлення сертифікатів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_sleep_action_terminated_early_total</div>
        <div class="metric_help">Кількість разів, коли обробник сну життєвого циклу був завершений до завершення його роботи.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_started_containers_errors_total</div>
        <div class="metric_help">Загальна кількість помилок під час запуску контейнерів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span><span class="metric_label">container_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_started_containers_total</div>
        <div class="metric_help">Загальна кількість запущених контейнерів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">container_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_started_host_process_containers_errors_total</div>
        <div class="metric_help">Сукупна кількість помилок при запуску контейнерів hostprocess. Ця метрика буде збиратися тільки у Windows.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span><span class="metric_label">container_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_started_host_process_containers_total</div>
        <div class="metric_help">Сукупна кількість запущених контейнерів hostprocess. Ця метрика буде збиратися лише у Windows.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">container_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_started_pods_errors_total</div>
        <div class="metric_help">Сукупна кількість помилок під час запуску Podʼів</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_started_pods_total</div>
        <div class="metric_help">Сукупна кількість запущених Podʼів</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_started_user_namespaced_pods_errors_total</div>
        <div class="metric_help">Кумулятивна кількість помилок під час запуску podʼів з іменами просторів користувачів. Цей показник збирається тільки в Linux.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_started_user_namespaced_pods_total</div>
        <div class="metric_help">CКумулятивна кількість запущених podʼів з іменами просторів користувачів. Цей показник збирається тільки в Linux.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_topology_manager_admission_duration_ms</div>
        <div class="metric_help">Тривалість у мілісекундах для обслуговування запиту на допуск Podʼа.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_topology_manager_admission_errors_total</div>
        <div class="metric_help">Кількість відмов запитів допуску, коли не вдалося виділити ресурси.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_topology_manager_admission_requests_total</div>
        <div class="metric_help">Кількістьт заявок допуску, для яких потрібне вирівнювання ресурсів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_volume_metric_collection_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах для розрахунку статистики тому</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">metric_source</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_volume_stats_available_bytes</div>
        <div class="metric_help">Кількість доступних байт в томі</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">namespace</span><span class="metric_label">persistentvolumeclaim</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_volume_stats_capacity_bytes</div>
        <div class="metric_help">Місткість тому у байтах</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">namespace</span><span class="metric_label">persistentvolumeclaim</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_volume_stats_health_status_abnormal</div>
        <div class="metric_help">Статус справності аномального тому. Значення 1 або 0. 1 — означає, що том н є справним, 0 — говорить про справність тому</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">namespace</span><span class="metric_label">persistentvolumeclaim</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_volume_stats_inodes</div>
        <div class="metric_help">Максимальна кількість inode в томі</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">namespace</span><span class="metric_label">persistentvolumeclaim</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_volume_stats_inodes_free</div>
        <div class="metric_help">Кількість вільних inode в томі</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">namespace</span><span class="metric_label">persistentvolumeclaim</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_volume_stats_inodes_used</div>
        <div class="metric_help">Кількість використаних inode у томі</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">namespace</span><span class="metric_label">persistentvolumeclaim</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_volume_stats_used_bytes</div>
        <div class="metric_help">Кількість використаних байт у томі</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">namespace</span><span class="metric_label">persistentvolumeclaim</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubelet_working_pods</div>
        <div class="metric_help">Кількість Podʼів, які фактично виконує kubelet, з розбивкою за фазами життєвого циклу, чи є Pod бажаним, осиротілим або тільки для виконання (також осиротілим), а також чи є Pod статичним. Осиротілий Pod був видалений з локальної конфігурації або примусово видалений в API та споживає ресурси, які не є видимими в інших випадках.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">config</span><span class="metric_label">lifecycle</span><span class="metric_label">static</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_conntrack_reconciler_deleted_entries_total</div>
        <div class="metric_help">Кумулятивні потоки conntrack видалені за допомогою узгоджувача conntrack</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">ip_family</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_conntrack_reconciler_sync_duration_seconds</div>
        <div class="metric_help">ReconcileConntrackFlowsLatency затримка в секундах</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">ip_family</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">kubeproxy_iptables_ct_state_invalid_dropped_packets_total</div>
	    <div class="metric_help">пакети, що відкидаються iptables для вирішення проблем з відстеженням</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
	    </ul>
	</div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">kubeproxy_iptables_localhost_nodeports_accepted_packets_total</div>
	    <div class="metric_help">Кількість пакетів, прийнятих на nodeports інтерфейсу loopback</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
	    </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_network_programming_duration_seconds</div>
        <div class="metric_help">В Cluster Network Programming Latency затримка в секундах</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">ip_family</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_proxy_healthz_total</div>
        <div class="metric_help">Сукупний стан справності проксі-сервера HTTP</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_proxy_livez_total</div>
        <div class="metric_help">Сукупний стан життєздатності проксі-сервера HTTP</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_sync_full_proxy_rules_duration_seconds</div>
        <div class="metric_help">Затримка SyncProxyRules у секундах для повних повторних синхронізацій</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">ip_family</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_sync_partial_proxy_rules_duration_seconds</div>
        <div class="metric_help">Затримка SyncProxyRules у секундах для часткових повторних синхронізацій</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">ip_family</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_sync_proxy_rules_duration_seconds</div>
        <div class="metric_help">SyncProxyRules затримка в секундах</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">ip_family</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_sync_proxy_rules_endpoint_changes_pending</div>
        <div class="metric_help">Правила проксі, що очікують на розгляд зміни Endpoint</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_sync_proxy_rules_endpoint_changes_total</div>
        <div class="metric_help">Кумулятивні проксі-правила зміни Endpoint</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_sync_proxy_rules_iptables_last</div>
        <div class="metric_help">Кількість правил iptables, записаних kube-proxy під час останньої синхронізації</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">ip_family</span><span class="metric_label">table</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_sync_proxy_rules_iptables_partial_restore_failures_total</div>
        <div class="metric_help">Сукупні помилки часткового відновлення iptables проксі-сервера</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">ip_family</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_sync_proxy_rules_iptables_restore_failures_total</div>
        <div class="metric_help">Сукупні помилки відновлення iptables проксі-сервера</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">ip_family</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_sync_proxy_rules_iptables_total</div>
        <div class="metric_help">Загальна кількість правил iptables, якими володіє kube-proxy</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">ip_family</span><span class="metric_label">table</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_sync_proxy_rules_last_queued_timestamp_seconds</div>
        <div class="metric_help">Останній раз, коли синхронізація правил проксі була поставлена в чергу</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">ip_family</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_sync_proxy_rules_last_timestamp_seconds</div>
        <div class="metric_help">Останній раз, коли правила проксі були успішно синхронізовані</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">ip_family</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">kubeproxy_sync_proxy_rules_nftables_cleanup_failures_total</div>
	    <div class="metric_help">Накопичені помилки очищення nftables проксі-сервера</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">ip_family</span></li>
	    </ul>
	</div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">kubeproxy_sync_proxy_rules_nftables_sync_failures_total</div>
	    <div class="metric_help">Накопичені збої синхронізації nftables проксі-сервера</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">ip_family</span></li>
	    </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_sync_proxy_rules_no_local_endpoints_total</div>
        <div class="metric_help">Кількість сервісів з політикою локального трафіку без точок доступу</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">ip_family</span><span class="metric_label">traffic_policy</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_sync_proxy_rules_service_changes_pending</div>
        <div class="metric_help">Правила проксі в очікувані, що змінюють Service</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubeproxy_sync_proxy_rules_service_changes_total</div>
        <div class="metric_help">Сукупні правила проксі в очікувані, що змінюють Service</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">kubernetes_build_info</div>
        <div class="metric_help">Метрика з постійним значенням '1', позначена як major, minor, версія git, коміт git, стан дерева git, дата збірки, версія Go, компілятор, з якого було зібрано Kubernetes, та платформа, на якій він працює.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">build_date</span><span class="metric_label">compiler</span><span class="metric_label">git_commit</span><span class="metric_label">git_tree_state</span><span class="metric_label">git_version</span><span class="metric_label">go_version</span><span class="metric_label">major</span><span class="metric_label">minor</span><span class="metric_label">platform</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">leader_election_master_status</div>
        <div class="metric_help">Ознака того, чи є система звітності головною для відповідного lease, 0 вказує на резервну копію, 1 — на головну. "name" — це рядок, який використовується для ідентифікації lease. Будь ласка, згрупуйте за назвою.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">leader_election_slowpath_total</div>
        <div class="metric_help">Загальна кількість повільних шляхів, використаних при поновленні leases лідера. 'name' — це рядок, який використовується для ідентифікації lease. Будь ласка, згрупуйте за іменами.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">node_authorizer_graph_actions_duration_seconds</div>
        <div class="metric_help">Гістограма тривалості дій з графом в авторизаторі вузла.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">node_collector_unhealthy_nodes_in_zone</div>
        <div class="metric_help">Вимірювання кількості не готових вузлів за зонами.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">zone</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">node_collector_update_all_nodes_health_duration_seconds</div>
        <div class="metric_help">Час у секундах, протягом якого NodeController оновлює стан справності усіх вузлів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">node_collector_update_node_health_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах, протягом якої NodeController оновлює стан справності одного вузла.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">node_collector_zone_health</div>
        <div class="metric_help">Індикатор, що вимірює відсоток справних вузлів у кожній зоні.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">zone</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">node_collector_zone_size</div>
        <div class="metric_help">Вимірювання кількості зареєстрованих вузлів за зонами.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">zone</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">node_controller_cloud_provider_taint_removal_delay_seconds</div>
        <div class="metric_help">Кількість секунд після створення вузла, коли NodeController видалив позначку хмарного провайдера з одного вузла.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">node_controller_initial_node_sync_delay_seconds</div>
        <div class="metric_help">Кількість секунд після створення вузла, коли NodeController завершив початкову синхронізацію одного вузла.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">node_ipam_controller_cidrset_allocation_tries_per_request</div>
        <div class="metric_help">Кількість точок доступу, доданих під час кожної синхронізації Service</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">clusterCIDR</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">node_ipam_controller_cidrset_cidrs_allocations_total</div>
        <div class="metric_help">Лічильник, що вимірює загальну кількість розподілів CIDR.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">clusterCIDR</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">node_ipam_controller_cidrset_cidrs_releases_total</div>
        <div class="metric_help">Лічильник, що вимірює загальну кількість оновлень CIDR.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">clusterCIDR</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">node_ipam_controller_cidrset_usage_cidrs</div>
        <div class="metric_help">Індикатор, що вимірює відсоток виділених CIDR.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">clusterCIDR</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">node_ipam_controller_cirdset_max_cidrs</div>
        <div class="metric_help">Максимальна кількість CIDR, яку можна виділити.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">clusterCIDR</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">node_swap_usage_bytes</div>
        <div class="metric_help">Поточне використання свопу вузла у байтах. Відображається лише на системах, відмінних від Windows</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">plugin_manager_total_plugins</div>
        <div class="metric_help">Кількість втулків у Plugin Manager</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">socket_path</span><span class="metric_label">state</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">pod_gc_collector_force_delete_pod_errors_total</div>
        <div class="metric_help">Кількість помилок, що виникли при примусовому видаленні Podʼів з моменту запуску Pod GC Controller.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">namespace</span><span class="metric_label">reason</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">pod_gc_collector_force_delete_pods_total</div>
        <div class="metric_help">Кількість Podʼів, які було примусово видалено з моменту запуску контролера Pod GC Controller.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">namespace</span><span class="metric_label">reason</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">pod_security_errors_total</div>
        <div class="metric_help">Кількість помилок, що перешкоджають нормальній оцінці. Нефатальні помилки можуть призвести до того, що для оцінювання буде використано останній обмежений профіль.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">fatal</span><span class="metric_label">request_operation</span><span class="metric_label">resource</span><span class="metric_label">subresource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">pod_security_evaluations_total</div>
        <div class="metric_help">Кількість оцінок політики, що відбулися, не враховуючи проігнорованих або звільнених від розгляду запитів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">decision</span><span class="metric_label">mode</span><span class="metric_label">policy_level</span><span class="metric_label">policy_version</span><span class="metric_label">request_operation</span><span class="metric_label">resource</span><span class="metric_label">subresource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">pod_security_exemptions_total</div>
        <div class="metric_help">Кількість звільнених запитів, не враховуючи ігнорованих або тих, що виходять за межі області застосування.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">request_operation</span><span class="metric_label">resource</span><span class="metric_label">subresource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">pod_swap_usage_bytes</div>
        <div class="metric_help">Поточний обсяг використання підкачки у байтах. Відображається лише на системах, відмінних від Windows</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">pod</span><span class="metric_label">namespace</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">prober_probe_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах для відповіді проби.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">container</span><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">probe_type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">pv_collector_bound_pv_count</div>
        <div class="metric_help">Вимірювач кількості постійного тому, який наразі привʼязаний</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">storage_class</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">pv_collector_bound_pvc_count</div>
        <div class="metric_help">Вимірювач кількості поточно привʼязаних persistent volume claim</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">namespace</span><span class="metric_label">storage_class</span><span class="metric_label">volume_attributes_class</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">pv_collector_total_pv_count</div>
        <div class="metric_help">Вимірювач загальної кількості постійних томів</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">plugin_name</span><span class="metric_label">volume_mode</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">pv_collector_unbound_pv_count</div>
        <div class="metric_help">Вимірювач кількості постійних томів, що зараз не привʼязані</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">storage_class</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">pv_collector_unbound_pvc_count</div>
        <div class="metric_help">Вимірювач кількості не привʼязаних persistent volume claim</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">namespace</span><span class="metric_label">storage_class</span><span class="metric_label">volume_attributes_class</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">reconstruct_volume_operations_errors_total</div>
        <div class="metric_help">Кількість томів, які не вдалося відновити з операційної системи під час запуску kubelet.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">reconstruct_volume_operations_total</div>
        <div class="metric_help">Кількість томів, які намагалися відновити з операційної системи під час запуску kubelet. Сюди входять як успішні, так і невдалі спроби відновлення.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">replicaset_controller_sorting_deletion_age_ratio</div>
        <div class="metric_help">Відношення віку вибраних видалених Podʼів до поточного наймолодшого віку Podʼів (на даний момент). Має бути менше ніж 2. Мета цієї метрики — виміряти приблизну ефективність впливу функціоналу LogarithmicScaleDown на сортування (і видалення) Podʼів при зменшенні масштабу набору реплік. При обчисленні та створенні звітів враховуються лише готові Podʼи.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">resourceclaim_controller_creates_total</div>
	    <div class="metric_help">Кількість запитів на створення ResourceClaims, класифікованих за статусом створення та доступом адміністратора</div>
	    <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">admin_access</span><span class="metric_label">status</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">resourceclaim_controller_resource_claims</div>
	    <div class="metric_help">Кількість ResourceClaims, класифікованих за статусом виділення, доступом адміністратора та джерелом. Джерелом може бути 'resource_claim_template' (створено на основі шаблону), 'extended_resource' (розширені ресурси) або порожнє (створено користувачем вручну).</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">allocated</span><span class="metric_label">admin_access</span><span class="metric_label">source</span></li>
	    </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">rest_client_dns_resolution_duration_seconds</div>
        <div class="metric_help">Затримка DNS-резолвера в секундах. Розбито за хостами.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">host</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">rest_client_exec_plugin_call_total</div>
        <div class="metric_help">Кількість викликів втулка exec, розділених за типом події, що виникла (no_error, plugin_execution_error, plugin_not_found_error, client_internal_error) та необовʼязковим кодом завершення роботи. Код завершення буде встановлено у 0 тоді і тільки тоді, коли виклик втулка був успішним.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">call_status</span><span class="metric_label">code</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">rest_client_exec_plugin_certificate_rotation_age</div>
        <div class="metric_help">Гістограма кількості секунд, які прожив останній клієнтський сертифікат втулка auth exec до того, як його було ротовано. Якщо клієнтські сертифікати втулка auth exec не використовуються, гістограма не міститиме даних.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">rest_client_exec_plugin_policy_call_total</div>
        <div class="metric_help">Кількість порівнянь втулка exec з політикою втулків та списком дозволених allowlist (якщо такий є), розділених залежно від того, чи дозволяє політика використання втулка.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">allowed</span><span class="metric_label">denied</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">rest_client_exec_plugin_ttl_seconds</div>
        <div class="metric_help">Показник найкоротшого TTL (часу життя) клієнтських сертифікатів, якими керує втулок auth exec. Значення в секундах до закінчення терміну дії сертифіката (відʼємне, якщо термін дії вже закінчився). Якщо втулки auth exec не використовуються або не керують сертифікатами TLS, значення буде +INF.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">rest_client_rate_limiter_duration_seconds</div>
        <div class="metric_help">Затримка обмежувача швидкості на стороні клієнта в секундах. Розбито за дієсловами та хостами.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">host</span><span class="metric_label">verb</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">rest_client_request_duration_seconds</div>
        <div class="metric_help">Час затримки запиту в секундах. Розбито за дієсловами та хостами.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">host</span><span class="metric_label">verb</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">rest_client_request_retries_total</div>
        <div class="metric_help">Кількість повторних спроб запиту, з розподілом за кодом статусу, дієсловом та хостом.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span><span class="metric_label">host</span><span class="metric_label">verb</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">rest_client_request_size_bytes</div>
        <div class="metric_help">Розмір запиту в байтах. Розбито за дієсловом та хостом.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">host</span><span class="metric_label">verb</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">rest_client_requests_total</div>
        <div class="metric_help">Кількість HTTP-запитів, розділених за кодом статусу, методом та хостом.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span><span class="metric_label">host</span><span class="metric_label">method</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">rest_client_response_size_bytes</div>
        <div class="metric_help">Розмір відповіді в байтах. Розбито за дієсловом та хостом.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">host</span><span class="metric_label">verb</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">rest_client_transport_cache_entries</div>
        <div class="metric_help">Кількість транспортних записів у внутрішньому кеші.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">rest_client_transport_create_calls_total</div>
        <div class="metric_help">Кількість викликів для отримання нового транспорту, розділена за результатом операції hit: отримано з кешу, miss: створено та додано до кешу, uncacheable: створено та не кешовано</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">retroactive_storageclass_errors_total</div>
        <div class="metric_help">Загальна кількість невдалих ретроактивних присвоєнь StorageClass до persistent volume claim</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">retroactive_storageclass_total</div>
        <div class="metric_help">Загальна кількість ретроактивних присвоєнь StorageClass для persistent volume claim</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">root_ca_cert_publisher_sync_duration_seconds</div>
        <div class="metric_help">Кількість синхронізацій просторів імен, що відбулися у видавця сертифікатів root ca.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">root_ca_cert_publisher_sync_total</div>
        <div class="metric_help">Кількість синхронізацій просторів імен, що відбулися у видавця сертифікатів root ca.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">code</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">running_managed_controllers</div>
        <div class="metric_help">Показує, де зараз запущено екземпляри контролера</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">manager</span><span class="metric_label">name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_async_api_call_execution_duration_seconds</div>
        <div class="metric_help">Тривалість у секундах виконання виклику API в async-диспетчері.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">call_type</span><span class="metric_label">result</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_async_api_call_execution_total</div>
        <div class="metric_help">Загальна кількість викликів API, виконаних async-диспетчером.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">call_type</span><span class="metric_label">result</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_batch_attempts_total</div>
        <div class="metric_help">Кількість результатів при спробі використання пакетної обробки.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">profile</span><span class="metric_label">result</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_batch_cache_flushed_total</div>
        <div class="metric_help">Кількість очищень кешу за причинами.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">profile</span><span class="metric_label">reason</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_cache_size</div>
        <div class="metric_help">Кількість вузлів, Podʼів та передбачуваних (звʼязаних) Podʼів у кеші планувальника.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">type</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">scheduler_event_handling_duration_seconds</div>
	    <div class="metric_help">Затримка обробки подій у секундах.</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">event</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_get_node_hint_duration_seconds</div>
        <div class="metric_help">Затримка для отримання підказки про вузол.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">hinted</span><span class="metric_label">profile</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_goroutines</div>
        <div class="metric_help">Кількість запущених підпрограм, розділених за роботою, яку вони виконують, наприклад, звʼязуванням.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">scheduler_inflight_events</div>
	    <div class="metric_help">Кількість подій, які наразі відстежуються в черзі планування.</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">event</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_pending_async_api_calls</div>
        <div class="metric_help">Кількість викликів API, які наразі очікують у черзі async.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">call_type</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_permit_wait_duration_seconds</div>
        <div class="metric_help">Тривалість очікування на отримання дозволу.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">result</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_plugin_evaluation_total</div>
        <div class="metric_help">Кількість спроб запланувати Podʼи для кожного втулка і точки розширення (доступно тільки в PreFilter, Filter, PreScore і Score).</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">extension_point</span><span class="metric_label">plugin</span><span class="metric_label">profile</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_plugin_execution_duration_seconds</div>
        <div class="metric_help">Тривалість запуску втулка в певній точці розширення.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">extension_point</span><span class="metric_label">plugin</span><span class="metric_label">status</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">scheduler_preemption_goroutines_duration_seconds</div>
	    <div class="metric_help">Тривалість у секундах для запуску goroutines для витіснення.</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">result</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">scheduler_preemption_goroutines_execution_total</div>
	    <div class="metric_help">Кількість виконаних процедур витіснення.</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">result</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">scheduler_queueing_hint_execution_duration_seconds</div>
	    <div class="metric_help">Тривалість запуску функції підказки черги втулка.</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">event</span><span class="metric_label">hint</span><span class="metric_label">plugin</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_resourceclaim_creates_total</div>
        <div class="metric_help">Кількість запитів на створення ResourceClaims у планувальнику</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">status</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_scheduling_algorithm_duration_seconds</div>
        <div class="metric_help">Затримка алгоритму планування в секундах</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_store_schedule_results_duration_seconds</div>
        <div class="metric_help">Затримка для отримання відмови.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">profile</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_unschedulable_pods</div>
        <div class="metric_help">Кількість незапланованих Podʼів, розбитих за назвою втулка. Pod збільшує показник для всіх втулків, які спричинили його незапланованість, тому ця метрика має сенс лише у розбивці за втулками.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">plugin</span><span class="metric_label">profile</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_volume_binder_cache_requests_total</div>
        <div class="metric_help">Загальна кількість запитів кешу привʼязування томів </div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scheduler_volume_scheduling_stage_error_total</div>
        <div class="metric_help">Кількість помилок на етапі планування томів</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">scrape_error</div>
        <div class="metric_help">1, якщо виникла помилка при отриманні метрик контейнера, 0 в іншому випадку</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_deprecated_version"><label class="metric_detail">Застаріло у версіях:</label><span>1.29.0</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
	    <div class="metric_name">selinux_warning_controller_selinux_volume_conflict</div>
	    <div class="metric_help">Конфлікт між двома Podʼами, що використовують один і той самий том</div>
	    <ul>
	        <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
	        <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
	        <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">property</span><span class="metric_label">pod1_namespace</span><span class="metric_label">pod1_name</span><span class="metric_label">pod1_value</span><span class="metric_label">pod2_namespace</span><span class="metric_label">pod2_name</span><span class="metric_label">pod2_value</span></li>
            </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">service_controller_loadbalancer_sync_total</div>
        <div class="metric_help">Метрика, що підраховує кількість разів, коли був налаштований будь-який балансувальник навантаження, як наслідок зміни сервісу/вузла на кластері</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">service_controller_nodesync_error_total</div>
        <div class="metric_help">Метрика, яка підраховує кількість разів, коли будь-який балансувальник навантаження був налаштований і помилявся, як наслідок зміни вузлів у кластері</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">service_controller_nodesync_latency_seconds</div>
        <div class="metric_help">Метрика, що вимірює затримку синхронізації вузлів, яка оновлює хости балансувальника навантаження при оновленні вузлів кластера.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">service_controller_update_loadbalancer_host_latency_seconds</div>
        <div class="metric_help">Метрика, що вимірює затримку оновлення кожного з хостів балансувальника навантаження.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">serviceaccount_invalid_legacy_auto_token_uses_total</div>
        <div class="metric_help">Використання сукупних недійсних автоматично згенерованих застарілих токенів</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">serviceaccount_legacy_auto_token_uses_total</div>
        <div class="metric_help">Використання сукупних автоматично згенерованих застарілих токенів</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">serviceaccount_legacy_manual_token_uses_total</div>
        <div class="metric_help">Використання сукупних вручну створених застарілих токенів</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">serviceaccount_legacy_tokens_total</div>
        <div class="metric_help">Використані токени застарілих службових облікових записів</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">serviceaccount_stale_tokens_total</div>
        <div class="metric_help">Використані токени службових облікових записів з простроченим терміном придатності</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">serviceaccount_valid_tokens_total</div>
        <div class="metric_help">Використання дійсних токенів проєцьованих службових облікових записів</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">statefulset_controller_statefulset_max_unavailable</div>
        <div class="metric_help">Максимальна допустима кількість недоступних подів під час поступового оновлення StatefulSet</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">pod_management_policy</span><span class="metric_label">statefulset_name</span><span class="metric_label">statefulset_namespace</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">statefulset_controller_statefulset_unavailable_replicas</div>
        <div class="metric_help">Поточна кількість недоступних подів у StatefulSet</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">pod_management_policy</span><span class="metric_label">statefulset_name</span><span class="metric_label">statefulset_namespace</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">storage_count_attachable_volumes_in_use</div>
        <div class="metric_help">Підрахунок кількості використовуваних томів</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">node</span><span class="metric_label">volume_plugin</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">storage_operation_duration_seconds</div>
        <div class="metric_help">Тривалість операції зберігання</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">migrated</span><span class="metric_label">operation_name</span><span class="metric_label">status</span><span class="metric_label">volume_plugin</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">taint_eviction_controller_pod_deletion_duration_seconds</div>
        <div class="metric_help">Затримка, в секундах, між моментом активації ефекту заплямування (taint) для Pod і його видаленням через TaintEvictionController.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">taint_eviction_controller_pod_deletions_total</div>
        <div class="metric_help">Загальна кількість Podʼів, видалених TaintEvictionController з моменту його запуску.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">ttl_after_finished_controller_job_deletion_duration_seconds</div>
        <div class="metric_help">Час, необхідний для видалення завдання (job) з моменту, коли воно стало доступним для видалення</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">version_info</div>
        <div class="metric_help">Надає інформацію про сумісність версії компонента. Мітка компонента — це назва компонента, зазвичай kube, але вона має значення для aggregated-apiservers.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">binary</span><span class="metric_label">component</span><span class="metric_label">emulation</span><span class="metric_label">min_compat</span></li>
        </ul>
	</div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">volume_manager_selinux_container_errors_total</div>
        <div class="metric_help">Кількість помилок, коли kubelet не може обчислити контекст SELinux для контейнера. Kubelet не зможе запустити такий Pod і спробує ще раз, тому значення цієї метрики може не відповідати дійсній кількості контейнерів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">access_mode</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">volume_manager_selinux_container_warnings_total</div>
        <div class="metric_help">Кількість помилок, коли kubelet не може обчислити контекст SELinux для контейнера, які ігноруються. Вони стануть справжніми помилками, коли функцію SELinuxMountReadWriteOncePod буде розширено на всі режими доступу до томів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">access_mode</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">volume_manager_selinux_pod_context_mismatch_errors_total</div>
        <div class="metric_help">Кількість помилок, коли Pod визначає різні контексти SELinux для своїх контейнерів, які використовують однаковий обʼєм. Kubelet не зможе запустити такий Pod і спробує ще раз, тому значення цієї метрики може не відповідати дійсній кількості Podʼів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">access_mode</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">volume_manager_selinux_pod_context_mismatch_warnings_total</div>
        <div class="metric_help">Кількість помилок, коли Pod визначає різні контексти SELinux для своїх контейнерів, які використовують той самий том. Це ще не помилки, але вони стануть справжніми помилками, коли можливість SELinuxMountReadWriteOncePod буде розширено на всі режими доступу до тома.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">access_mode</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">volume_manager_selinux_volume_context_mismatch_errors_total</div>
        <div class="metric_help">Кількість помилок, коли Pod використовує том, який вже змонтовано з іншим контекстом SELinux, ніж потрібен Pod. Kubelet не зможе запустити такий Pod і повторити спробу, тому значення цієї метрики може не відповідати дійсній кількості Podʼів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">access_mode</span><span class="metric_label">volume_plugin</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">volume_manager_selinux_volume_context_mismatch_warnings_total</div>
        <div class="metric_help">Кількість помилок, коли Pod використовує том, який вже змонтовано з іншим контекстом SELinux, ніж потрібен Pod. Це ще не помилки, але вони стануть справжніми помилками, коли функцію SELinuxMountReadWriteOncePod буде розширено на всі режими доступу до томів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">access_mode</span><span class="metric_label">volume_plugin</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">volume_manager_selinux_volumes_admitted_total</div>
        <div class="metric_help">Кількість томів, контекст SELinux яких був нормальним і які буде змонтовано за допомогою параметра контексту mount -o.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">access_mode</span><span class="metric_label">volume_plugin</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">volume_manager_total_volumes</div>
        <div class="metric_help">Кількість томів у Volume Manager</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="custom"><label class="metric_detail">Тип:</label> <span class="metric_type">Custom</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">plugin_name</span><span class="metric_label">state</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">volume_operation_total_errors</div>
        <div class="metric_help">Всього помилок в роботі з томом</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation_name</span><span class="metric_label">plugin_name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">volume_operation_total_seconds</div>
        <div class="metric_help">Тривалість операції зберігання від початку до кінця в секундах</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">operation_name</span><span class="metric_label">plugin_name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">watch_cache_capacity</div>
        <div class="metric_help">Загальний обсяг кешу watch, розбитий за типами ресурсів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">watch_cache_capacity_decrease_total</div>
        <div class="metric_help">Загальна кількість подій зменшення ємності кешу watch, з розбивкою за типами ресурсів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">watch_cache_capacity_increase_total</div>
        <div class="metric_help">Загальна кількість подій збільшення ємності кешу watch, з розбивкою за типами ресурсів.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">group</span><span class="metric_label">resource</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">workqueue_adds_total</div>
        <div class="metric_help">Загальна кількість додавань, оброблених робочою чергою</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">workqueue_depth</div>
        <div class="metric_help">Поточна глибина робочої черги</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">workqueue_longest_running_processor_seconds</div>
        <div class="metric_help">Скільки секунд працював найдовший процесор у черзі.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">workqueue_queue_duration_seconds</div>
        <div class="metric_help">Скільки часу в секундах елемент перебуває в черзі до того, як його буде запитано.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">workqueue_retries_total</div>
        <div class="metric_help">Загальна кількість повторних спроб, оброблених робочою чергою</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="counter"><label class="metric_detail">Тип:</label> <span class="metric_type">Counter</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">workqueue_unfinished_work_seconds</div>
        <div class="metric_help">Скільки секунд роботи було виконано, яка виконується і не спостерігається параметром work_duration. Великі значення вказують на застряглі потоки. Про кількість застряглих потоків можна зробити висновок, спостерігаючи за швидкістю, з якою цей показник зростає.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="gauge"><label class="metric_detail">Тип:</label> <span class="metric_type">Gauge</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span></li>
        </ul>
    </div>
    <div class="metric" data-stability="alpha">
        <div class="metric_name">workqueue_work_duration_seconds</div>
        <div class="metric_help">Скільки часу в секундах займає обробка елемента з робочої черги.</div>
        <ul>
            <li><label class="metric_detail">Рівень стабільності:</label><span class="metric_stability_level">ALPHA</span></li>
            <li data-type="histogram"><label class="metric_detail">Тип:</label> <span class="metric_type">Histogram</span></li>
            <li class="metric_labels_varying"><label class="metric_detail">Мітки:</label><span class="metric_label">name</span></li>
        </ul>
    </div>
</div>
