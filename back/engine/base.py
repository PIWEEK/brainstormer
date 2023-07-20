from abc import ABC, abstractmethod

class BaseEngine(ABC):
    @abstractmethod
    def next(self, topic, previous, user_inputs, saved, liked, disliked):
        pass

    @abstractmethod
    def more(self, topic, previous, current, user_inputs, saved, liked, disliked):
        pass

    @abstractmethod
    def keyword(self, topic, keyword, saved, liked, disliked):
        pass

    @abstractmethod
    def summary(self, topic, first_option, current):
      pass
