from rest_framework.permissions import BasePermission



class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        # print("authenticators:", request.authenticators, flush=True)
        # print("user:", request.user, flush=True)
        return bool(request.user and request.user.is_superuser)

class SuperUserDestroyMixin:
    def get_permissions(self):
        # print("Hit Brew Mixin", flush=True)
        if self.action == 'destroy':
            return [IsSuperUser()]
        # print("non-destroy path", flush=True)
        return super().get_permissions()