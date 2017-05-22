from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib import admin
from django.utils.translation import ugettext_lazy as _

from users.models import User, KohaUserIdentifier


class KohaUserInline(admin.StackedInline):
    model = KohaUserIdentifier

class UserAdmin(DjangoUserAdmin):
    fieldsets = DjangoUserAdmin.fieldsets + (
        (None, {'fields': ('department_name', 'uuid', 'favorite_resources')}),
    )
    inlines = DjangoUserAdmin.inlines + [KohaUserInline,]

admin.site.register(User, UserAdmin)
