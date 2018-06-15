import numpy as np
from keras.models import Sequential
from keras.layers import Dense, Dropout
import tensorflow as tf

# Generate dummy data
x_train = np.random.random((1000, 3))
y_train = np.random.randint(2, size=(1000, 3))
x_test = np.random.random((100, 3))
y_test = np.random.randint(2, size=(100, 3))

model = Sequential()
model.add(Dense(16, input_dim=3, activation='relu'))

model.add(Dense(16, activation='relu'))
model.add(Dense(16, activation='relu'))

model.add(Dense(3, activation='sigmoid'))

model.compile(loss='categorical_crossentropy',
              optimizer='rmsprop',
              metrics=['accuracy'])

training_data = tf.constant([0.10, 0.20, 0.50]);
target_data   = tf.constant([0.50, 0.40, 0.10]);

print(training_data)
print(target_data)

model.fit(x_train, y_train,
          epochs=10,
          batch_size=16)

			  
model.fit(x_train, y_train,
          epochs=10,
          batch_size=16)

#score = model.evaluate(x_test, y_test, batch_size=12)
