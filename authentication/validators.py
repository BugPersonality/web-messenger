from django.core.exceptions import ValidationError


class OneNum:

    def validate(self, password, user=None):
        if not any(map(str.isdigit, password)):
            raise ValidationError(
                "Password must have at least one num"
            )

    def get_help_text(self):
        return "Password must have at least one num"


class OneLetter:

    def validate(self, password, user=None):
        if not any(map(str.isalpha, password)):
            raise ValidationError(
                "Password must have at least one letter"
            )

    def get_help_text(self):
        return "Password must have at least one letter"
