from rest_framework import serializers, viewsets

from munigeo import api as munigeo_api
from resources.api.base import NullableDateTimeField, TranslatedModelSerializer, register_view
from resources.models import Unit


class UnitSerializer(TranslatedModelSerializer, munigeo_api.GeoModelSerializer):
    opening_hours_today = serializers.DictField(
        source='get_opening_hours',
        child=serializers.ListField(
            child=serializers.DictField(
                child=NullableDateTimeField())
        )
    )
    reservable_days_in_advance = serializers.ReadOnlyField()
    reservable_before = serializers.SerializerMethodField()
    reservable_after_days = serializers.ReadOnlyField()
    reservable_after = serializers.SerializerMethodField()

    def get_reservable_before(self, obj):
        request = self.context.get('request')
        user = request.user if request else None

        if user and obj.is_admin(user):
            return None
        else:
            return obj.get_reservable_before()

    def get_reservable_after(self, obj):
        request = self.context.get('request')
        user = request.user if request else None

        if user and obj.is_admin(user):
            return None
        else:
            return obj.get_reservable_after()

    class Meta:
        model = Unit


class UnitViewSet(munigeo_api.GeoModelAPIView, viewsets.ReadOnlyModelViewSet):
    def get_queryset(self):
        qs = self.queryset
        if self.request.client_configuration:
            config = self.request.client_configuration
            if config.units:
                qs = qs.filter(pk__in=config.units.all())
        return qs

    queryset = Unit.objects.exclude(resources__isnull=True)
    serializer_class = UnitSerializer


register_view(UnitViewSet, 'unit')
