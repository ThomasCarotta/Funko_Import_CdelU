from django.apps import AppConfig


class FunkoImportConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'funko_import'

    def ready(self):
        import funko_import.signals