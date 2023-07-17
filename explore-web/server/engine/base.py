from abc import ABC, abstractmethod

class BaseEngine(ABC):
    @abstractmethod
    def next(self):
        pass

    @abstractmethod
    def more(self, topic, previous, current, user_inputs):
        pass

    @abstractmethod
    def summary(self, topic, first_option, current):
      pass