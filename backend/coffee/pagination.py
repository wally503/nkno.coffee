from rest_framework.pagination import PageNumberPagination

class DynamicPageSizePagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100

class LargeDynamicPageSizePagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 2000