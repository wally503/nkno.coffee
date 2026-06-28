# Django Reference — nkno.coffee

A living cheat sheet for Django + DRF patterns used in this project.

---

## Models

### ForeignKey

```python
class Bean(models.Model):
    roaster = models.ForeignKey(
        'Roaster',
        on_delete=models.CASCADE,       # delete bean if roaster deleted
        related_name='beans',           # roaster.beans.all() from the other side
        null=True, blank=True           # optional FK
    )
```

**`on_delete` options:**
| Option | Behavior |
|---|---|
| `CASCADE` | Delete child when parent deleted |
| `SET_NULL` | Set FK to null (requires `null=True`) |
| `PROTECT` | Block parent deletion if children exist |
| `SET_DEFAULT` | Set FK to `default=` value |

**Why `related_name`:** Django auto-generates a reverse accessor as `<model>_set` (e.g. `roaster.bean_set`). Setting `related_name='beans'` gives you `roaster.beans.all()` instead — cleaner and explicit.

---

### ManyToManyField (M2M)

```python
class Bean(models.Model):
    flavor_notes = models.ManyToManyField(
        'FlavorNote',
        blank=True,
        related_name='beans'
    )
```

Django creates the bridge table automatically. You don't need to define it unless you need extra fields on the relationship.

**Using it:**
```python
bean.flavor_notes.all()        # get all related
bean.flavor_notes.add(note)    # add one
bean.flavor_notes.set([n1, n2]) # replace all
bean.flavor_notes.remove(note) # remove one
bean.flavor_notes.clear()      # remove all
```

---

### Bridge Table (M2M with extra fields)

Use when the relationship itself carries data (e.g. a "use order" or a "setting value").

```python
class BrewRecipeStep(models.Model):
    recipe = models.ForeignKey('BrewRecipe', on_delete=models.CASCADE, related_name='steps')
    brew_step = models.ForeignKey('BrewStep', on_delete=models.CASCADE)
    order = models.PositiveIntegerField()
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['order']
        unique_together = [('recipe', 'brew_step')]
```

**If you also want M2M sugar on the parent model:**
```python
class BrewRecipe(models.Model):
    steps = models.ManyToManyField(
        'BrewStep',
        through='BrewRecipeStep',     # point at the explicit bridge table
        related_name='recipes'
    )
```

`through=` tells Django to use your model instead of the auto-generated one — you keep the M2M API but also have the extra fields.

---

### Common Field Types

```python
models.CharField(max_length=255)
models.TextField(blank=True)
models.IntegerField()
models.PositiveIntegerField()
models.FloatField()
models.BooleanField(default=False)
models.DateField(auto_now_add=True)     # set on create, never updated
models.DateTimeField(auto_now=True)     # updated every save
models.DecimalField(max_digits=5, decimal_places=2)
models.JSONField(default=dict)
models.URLField(blank=True)
models.UUIDField(default=uuid.uuid4, editable=False)
```

**`blank` vs `null`:**
- `null=True` — database column allows NULL
- `blank=True` — Django form/serializer validation allows empty string
- For strings: use `blank=True` only. For non-strings (FK, int, etc.): use `null=True, blank=True` together.

---

### Meta class

```python
class Bean(models.Model):
    class Meta:
        ordering = ['-created_at']               # default queryset order
        unique_together = [('roaster', 'name')]  # composite uniqueness
        verbose_name = 'Coffee Bean'             # singular display name
        verbose_name_plural = 'Coffee Beans'     # plural display name
        db_table = 'coffee_bean'                 # explicit table name (optional)
```

---

## ORM Queries

### Basic lookups

```python
Bean.objects.all()
Bean.objects.filter(roaster=roaster_instance)
Bean.objects.get(id=1)               # raises exception if 0 or 2+ results
Bean.objects.get_or_create(name='Ethiopia Yirgacheffe', defaults={'roaster': r})
Bean.objects.first()
Bean.objects.count()
Bean.objects.exists()
```

### Double-underscore syntax (`__`)

Used to traverse FK relationships in filters and annotations. Produces flat keys, not nested objects.

```python
# Filter across FK
Bean.objects.filter(roaster__name='Counter Culture')
Bean.objects.filter(roaster__country__iso_code='US')

# Ordering across FK
Bean.objects.order_by('roaster__name')

# Text lookups
Bean.objects.filter(name__icontains='yirg')     # case-insensitive contains
Bean.objects.filter(name__startswith='E')
Bean.objects.filter(name__in=['A', 'B', 'C'])

# Null checks
Bean.objects.filter(process_method__isnull=True)
```

**Why `__`:** Django uses it to distinguish field traversal from Python attribute access. `roaster__name` means "join to the roaster table, then filter on the name column."

### Annotations / aggregates

```python
from django.db.models import Count, Avg, Max

Bean.objects.annotate(log_count=Count('drinklogs'))
Bean.objects.aggregate(avg_rating=Avg('drinklogs__rating'))
```

### Prefetch / select_related

```python
# FK or OneToOne — single JOIN, use for "to-one" relationships
Bean.objects.select_related('roaster')

# M2M or reverse FK — separate query, use for "to-many"
Bean.objects.prefetch_related('flavor_notes')

# Both at once
Bean.objects.select_related('roaster').prefetch_related('flavor_notes')
```

**Why it matters:** without these, Django hits the DB once per row in a loop (N+1 queries). These collapse it to 1–2 queries total.

---

## Django REST Framework (DRF)

### Serializer

```python
from rest_framework import serializers
from .models import Bean

class BeanSerializer(serializers.ModelSerializer):
    roaster_name = serializers.CharField(source='roaster.name', read_only=True)
    flavor_notes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Bean
        fields = ['id', 'name', 'roaster', 'roaster_name', 'flavor_notes', 'process_method']
        read_only_fields = ['id']
```

**`source=`** — lets you pull a value from a FK traversal and expose it under a different name. `source='roaster.name'` gives you `roaster_name` in the response without nesting.

### ViewSet

```python
from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter, OrderingFilter

class BeanViewSet(viewsets.ModelViewSet):
    serializer_class = BeanSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'roaster__name']       # ?search=...
    ordering_fields = ['name', 'created_at']         # ?ordering=name
    ordering = ['-created_at']                       # default ordering

    def get_queryset(self):
        return Bean.objects.select_related('roaster').filter(user=self.request.user)
```

**`ModelViewSet`** gives you `list`, `create`, `retrieve`, `update`, `partial_update`, `destroy` for free.

### Router / URLs

```python
# api/urls.py
from rest_framework.routers import DefaultRouter
from .views import BeanViewSet

router = DefaultRouter()
router.register(r'beans', BeanViewSet, basename='bean')
urlpatterns = router.urls
```

**What the router generates:**
| URL | Method | Action |
|---|---|---|
| `/beans/` | GET | list |
| `/beans/` | POST | create |
| `/beans/{id}/` | GET | retrieve |
| `/beans/{id}/` | PUT | update |
| `/beans/{id}/` | PATCH | partial_update |
| `/beans/{id}/` | DELETE | destroy |

### Custom actions on a ViewSet

```python
from rest_framework.decorators import action
from rest_framework.response import Response

class BeanViewSet(viewsets.ModelViewSet):
    ...
    @action(detail=True, methods=['get'])
    def logs(self, request, pk=None):
        bean = self.get_object()
        logs = bean.drinklogs.all()
        serializer = DrinkLogSerializer(logs, many=True)
        return Response(serializer.data)
    # URL: GET /beans/{id}/logs/

    @action(detail=False, methods=['get'])
    def recent(self, request):
        qs = self.get_queryset().order_by('-created_at')[:10]
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
    # URL: GET /beans/recent/
```

`detail=True` → operates on a single object (has `pk` in URL). `detail=False` → operates on the collection.

---

## Filtering & Pagination

### Server-side search + ordering (already in project)

Query params automatically handled by `SearchFilter` and `OrderingFilter`:
```
GET /api/beans/?search=ethiopia
GET /api/beans/?ordering=-name
GET /api/beans/?ordering=roaster__name
```

### Manual queryset filtering from query params

```python
def get_queryset(self):
    qs = Bean.objects.all()
    roaster_id = self.request.query_params.get('roaster')
    if roaster_id:
        qs = qs.filter(roaster_id=roaster_id)   # _id suffix on FK field name
    return qs
```

### Pagination (DRF built-in)

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
```

Response shape:
```json
{
  "count": 80,
  "next": "http://.../api/beans/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## Admin

```python
from django.contrib import admin
from .models import Bean

@admin.register(Bean)
class BeanAdmin(admin.ModelAdmin):
    list_display = ['name', 'roaster', 'process_method', 'created_at']
    list_filter = ['process_method', 'roaster']
    search_fields = ['name', 'roaster__name']
    raw_id_fields = ['roaster']      # for FKs with many options — shows ID input instead of dropdown
```

---

## Migrations

```bash
python manage.py makemigrations          # generate migration from model changes
python manage.py migrate                 # apply to DB
python manage.py showmigrations          # see which are applied
python manage.py sqlmigrate app 0003     # see the SQL a migration would run
python manage.py migrate app 0002        # roll back to a specific migration
```

**Gotchas:**
- Adding a non-nullable field to an existing table requires either a `default=` or making it `null=True`
- Renaming a field produces a drop+add by default — Django will ask if it's a rename; say yes to preserve data
- `makemigrations` only detects changes in apps listed in `INSTALLED_APPS`

---

## Django App Structure (project pattern)

```
myapp/
  models/
    __init__.py       # import all models here so Django finds them
    bean.py
    roaster.py
  api/
    __init__.py
    serializers.py
    views.py
    urls.py
  admin.py
  apps.py
  choices.py          # CharField choices constants
  constants/          # any other shared constants
```

---

## Choices / Constants

```python
# choices.py
class ProcessMethod(models.TextChoices):
    WASHED = 'washed', 'Washed'
    NATURAL = 'natural', 'Natural'
    HONEY = 'honey', 'Honey'

# in model
process_method = models.CharField(
    max_length=50,
    choices=ProcessMethod.choices,
    blank=True
)
```

Access in code: `ProcessMethod.WASHED` → `'washed'`. The second value is the human-readable label shown in admin/forms.

---

## Auth (JWT / httpOnly cookies — project setup)

- `djangorestframework-simplejwt` handles token generation
- Tokens stored in httpOnly cookies (browser only — TUI clients use `Authorization: Bearer <token>` header)
- Endpoints: `/api/auth/login/`, `/api/auth/logout/`, `/api/auth/valid/`
- `VITE_DEV_BYPASS` env flag bypasses auth in dev frontend

---

## Quick Lookup: Common Patterns

| Task | Code |
|---|---|
| FK field | `models.ForeignKey('Model', on_delete=models.CASCADE, related_name='...')` |
| M2M field | `models.ManyToManyField('Model', blank=True, related_name='...')` |
| M2M with extra fields | `through='BridgeModel'` on the M2M + explicit model |
| Filter on FK field value | `qs.filter(roaster__name='...')` |
| Filter on FK id | `qs.filter(roaster_id=42)` |
| Null check | `qs.filter(field__isnull=True)` |
| Case-insensitive search | `qs.filter(name__icontains='...')` |
| Avoid N+1 (FK) | `.select_related('roaster')` |
| Avoid N+1 (M2M) | `.prefetch_related('flavor_notes')` |
| Expose FK field in serializer | `serializers.CharField(source='roaster.name', read_only=True)` |
| Current user in viewset | `self.request.user` |
| Query param in viewset | `self.request.query_params.get('key')` |
| Custom URL action | `@action(detail=True/False, methods=['get'])` |
