from rest_framework import serializers, viewsets

from .models import Configuration

all_views = []


def register_view(klass, name, base_name=None):
    entry = {'class': klass, 'name': name}
    if base_name is not None:
        entry['base_name'] = base_name
    all_views.append(entry)


class ConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuration
        fields = ['id', 'default_route', 'purposes', 'resources', 'units']


class ConfigurationViewSet(viewsets.ReadOnlyModelViewSet):
    def get_queryset(self):
        user = self.request.user
        client_config = self.request.client_configuration
        if user.is_superuser:
            return self.queryset
        elif client_config:
            return self.queryset.filter(pk=client_config.pk)
        else:
            return self.queryset.none()

    lookup_field = 'key'
    queryset = Configuration.objects.all()
    serializer_class = ConfigurationSerializer

register_view(ConfigurationViewSet, 'client')
