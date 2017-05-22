from django.utils.deprecation import MiddlewareMixin

from clients.models import Configuration


class ClientConfigurationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.client_configuration = None
        key = request.META.get("HTTP_VARAAMO_CLIENT_KEY")
        if key:
            try:
                config = Configuration.objects.get(key=key)
                request.client_configuration = config
            except (Configuration.MultipleObjectsReturned, Configuration.DoesNotExist):
                pass
