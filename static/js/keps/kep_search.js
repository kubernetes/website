  $(document).ready(function() {
    $('#keps_search').keyup(function() {
      search_table($(this).val());
    });
    $("select").on('change', function() {
      if ($(this).val() != 'all') {
        search_table($(this).val());
      } else {
        reset_keps_table();
      }

    })

    function search_table(value) {
      $('#keps_table').find("tr:gt(0)").each(function() {
        var found = 'false';
        $(this).each(function() {
          if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            found = 'true';
          }
        });
        if (found == 'true') {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    }

    function reset_keps_table() {
      $('#keps_table tr').each(function(f) {
        $(this).show();
      });
    }
  });