{% if page.tags %}
## Tags

Click on the following tags to see other pages relating to these topics:

{% for tag in page.tags %}- [{{tag}}](/docs/tagviewer/#{{tag}})
{% endfor %}
{% endif %}
