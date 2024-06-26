from rest_framework.pagination import PageNumberPagination, _get_page_links
from rest_framework.utils.urls import remove_query_param, replace_query_param
from rest_framework.response import Response
from collections import OrderedDict


def _get_displayed_page_numbers(number_show, current, final):
    assert current >= 1
    assert final >= current

    if final <= (number_show*3 + 2):
        return list(range(1, final + 1))

    # We always include the first two pages, last two pages, and
    # two pages either side of the current page.

    included = {i for i in range(1, number_show + 1)}
    included = included.union({i for i in range(current - number_show, current + number_show + 1)})
    included = included.union({i for i in range(final - number_show + 1, final + 1)})

    # If the break would only exclude a single page number then we
    # may as well include the page number instead of the break.
    if current <= (number_show*2):
        for i in range(number_show, number_show*2):
            included.add(i)
    if current >= final - (number_show*2 -1):
        for i in range(number_show -1, number_show*2 -1):
            included.add(final - i)

    # Now sort the page numbers and drop anything outside the limits.
    included = [
        idx for idx in sorted(included)
        if 0 < idx <= final
    ]

    # Finally insert any `...` breaks
    if current > (number_show*2 + 1):
        included.insert(number_show, None)
    if current < final - (number_show*2):
        included.insert(len(included) - number_show, None)
    return included



class DefaultPagination(PageNumberPagination):
    number_show_page = 2
    page_size = 8
    
    
    def get_html_context(self):
        base_url = self.request.build_absolute_uri()

        def page_number_to_url(page_number):
            if page_number == 1:
                return remove_query_param(base_url, self.page_query_param)
            else:
                return replace_query_param(base_url, self.page_query_param, page_number)

        current = self.page.number
        final = self.page.paginator.num_pages
        number_show = self.number_show_page
        page_numbers = _get_displayed_page_numbers(number_show, current, final)
        page_links = _get_page_links(page_numbers, current, page_number_to_url)

        return {
            'next_url': self.get_next_link(),
            'previous_url': self.get_previous_link(),
            'page_links': page_links
        }


    def get_paginated_response(self, data):
      return Response(OrderedDict([
        ('count', self.page.paginator.count),
        ('links', self.get_html_context()),
        # ('next', self.get_next_link()),
        # ('previous', self.get_previous_link()),
        ('results', data)
      ]))
    