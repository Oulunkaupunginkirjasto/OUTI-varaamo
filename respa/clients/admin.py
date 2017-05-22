from django.contrib import admin
from django.contrib.admin import site as admin_site

from clients.models import Configuration
from resources.admin.base import CommonExcludeMixin, PopulateCreatedAndModifiedMixin


class ConfigurationAdmin(PopulateCreatedAndModifiedMixin, CommonExcludeMixin, admin.ModelAdmin):
    readonly_fields = ('id',)
    exclude = CommonExcludeMixin.exclude + ('resources',)

admin_site.register(Configuration, ConfigurationAdmin)
