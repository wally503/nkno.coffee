from enum import Enum

class LotState(Enum):
    SEALED = "sealed"
    FROZEN = "frozen"
    THAWED = "thawed"
    OPEN = "open"

class LifecycleKind(Enum):
    OPENED = "opened"
    FINISHED = "finished"
    FROZEN = "frozen"
    THAWED = "thawed"
    TRANSFERRED = "transferred"
    MERGED = "merged"
    ADJUSTED = "adjusted"

class Granularity(Enum):
    BAG = "bag"
    BULK = "bulk"
    GRANULAR = "granular"