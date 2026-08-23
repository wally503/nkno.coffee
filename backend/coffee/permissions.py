from rest_framework.permissions import BasePermission

class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)

class SuperUserDestroyMixin:
    def get_permissions(self):
        # print("Hit Coffee Mixin", flush=True)
        if self.action == 'destroy':
            return [IsSuperUser()]
        return super().get_permissions()