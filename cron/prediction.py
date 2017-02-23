import numpy
import pandas
import math

from keras.models import Sequential
from keras.layers import Dense
from keras.layers.convolutional import Convolution1D
from keras.layers.convolutional import MaxPooling1D
from keras.layers import LSTM, Dropout, Activation
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error

import urllib
import urllib2

from pandas_datareader import DataReader
import datetime
import time
import csv
import re
import pymongo
from pandas.tseries.offsets import BDay


from init_db import get_db
db = get_db()



stocks = []

start = datetime.datetime(2010, 1, 1)
end = datetime.datetime.today() + datetime.timedelta(days=1)

discriminator = None

if datetime.datetime.utcnow().weekday() < 5  and datetime.datetime.utcnow() < datetime.datetime.fromordinal(datetime.datetime.utcnow().date().toordinal())+datetime.timedelta(hours=22):
    discriminator = datetime.datetime.utcnow().date()
else:
    discriminator = datetime.datetime.utcnow().date() + BDay(1)

cursor = db.stock_preds.find({ 'pred_date': {'$ne': datetime.datetime.fromordinal(discriminator.toordinal())} })

for stock in cursor:
    stocks.append(stock)

def get_yahoo_finance(stock):
    f = DataReader(stock, 'yahoo', start, end)
    return f

def get_data_for_index(i):
    f = get_yahoo_finance(stocks[i]['symbol'])
    return f['Adj Close'].values

def create_dataset(dataset, look_back=1):
    dataX, dataY = [], []
    for i in range(len(dataset)-look_back):
        a = dataset[i:(i+look_back)]
        dataX.append(a)
        dataY.append(dataset[i + look_back])
    return numpy.array(dataX), numpy.array(dataY)


def create_data(index):
    dataset = get_data_for_index(index)
    scaler = MinMaxScaler(feature_range=(0, 1))
    dataset = scaler.fit_transform(dataset)
    train_size = int(len(dataset))
    train = dataset[0:train_size]
    #test = dataset[train_size:]
    look_back = 1
    trainX, trainY = create_dataset(train, look_back=look_back)
    #testX, testY = create_dataset(test, look_back)
    trainX = numpy.reshape(trainX, (trainX.shape[0], 1, trainX.shape[1]))
    #testX = numpy.reshape(testX, (testX.shape[0],1,testX.shape[1]))
    return trainX, trainY, scaler, dataset

def train(index, epochs=11):
    # make predictions
    model = Sequential()
    model.add(Convolution1D(4,1,input_dim=1))
    model.add(LSTM(4))
    model.add(Activation('sigmoid'))
    model.add(Dense(1))
    model.compile(loss='mean_squared_error', optimizer='adam')
    trainX, trainY, scaler, dataset = create_data(index)
    model.fit(trainX, trainY, nb_epoch=epochs, batch_size=1, verbose=2)
    trainPredict = model.predict(trainX)
    #testPredict = model.predict(testX)
    # invert predictions
    trainPredict = scaler.inverse_transform(trainPredict)
    trainY = scaler.inverse_transform([trainY])
    #testPredict = scaler.inverse_transform(testPredict)
    #testY = scaler.inverse_transform([testY])
    # calculate root mean squared error
    trainScore = math.sqrt(mean_squared_error(trainY[0], trainPredict[:,0]))
    print('Train Score: %.2f RMSE' % (trainScore))
    #testScore = math.sqrt(mean_squared_error(testY[0], testPredict[:,0]))
    #print('Test Score: %.2f RMSE' % (testScore))
    # shift train predictions for plotting
    return model, dataset,trainPredict, scaler

#    db.stock_preds.update_one({'symbol':'AAPL'}, {'$set':{ 'previous_points': [{'date': start, 'value': 23},{'date': end, 'value': 43}] }})

def convert_time(time):
    return datetime.datetime.utcfromtimestamp(time.astype('O')/1e9)


def main():
    for i in range(len(stocks)):
        symbol = stocks[i]['symbol']
        print(symbol)
        csv = get_yahoo_finance(symbol)
        model, dataset, trainPredict, scaler = train(i)
        dates = csv.index.values
        previous_dates = dates[-30:]
        previous_points = csv['Adj Close'][-30:]
        previous = []
        for i in range(len(previous_points)):
            previous.append({ "date": convert_time(previous_dates[i]),"value": previous_points[i] })
        time_of_prediction = convert_time(dates[-1])+BDay(1)
        y1 = model.predict(numpy.array(dataset[-1:]).reshape(1,1,1))
        prediction = scaler.inverse_transform(y1).reshape(1)[0]
        previous_predictions = []
        for i in trainPredict:
            previous_predictions.append(float(i[0]))
        last_percent_change = previous_points[-1]/previous_points[-2]
        previous_predictions.append(previous_predictions[-1]*last_percent_change)
        db.stock_preds.update_one({'symbol': symbol}, {'$set':{ 'previous_points': previous, 'previous_predictions': previous_predictions[-30:], 'prediction': float(prediction), 'pred_date': time_of_prediction }})



main()
