from abc import ABC, abstractmethod

class BaseEngine(ABC):
    @abstractmethod
    def get_message(self):
        pass

    @abstractmethod
    def get_token_count(self, message):
        pass
