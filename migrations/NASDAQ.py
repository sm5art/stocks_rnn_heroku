import os
import pandas
from init_db import get_db

def main():
    db = get_db()
    nasdaq = db.NASDAQ
    nasdaq.drop()
    csv = pandas.read_csv('migrations/companylist.csv')
    csv =  csv.drop(['LastSale','ADR TSO', 'IPOyear','Unnamed: 9' ], 1)
    csv.columns = ['symbol', 'name', 'market_cap', 'sector', 'industry', 'summary_quote']
    documents = csv.to_dict('index')
    documents = documents.values()
    nasdaq.insert_many(documents)

main()
