from rest_framework import serializers

class MMSSDurationField(serializers.DurationField):
    """Serializes a duration as MM:SS (no hours segment), since Django's
    DurationField default output (HH:MM:SS) isn't the display format
    the frontend expects. Never used for durations that could hit 1hr+."""

    def to_representation(self, value):
        full = super().to_representation(value)  # e.g. "00:00:15"
        # strip a leading "HH:" prefix
        parts = full.split(":")
        if len(parts) == 3:
            return f"{parts[1]}:{parts[2]}"
        return full