import requests
from bs4 import BeautifulSoup
import psycopg2
import pandas as pd
from datetime import datetime

usuario 	= 'postgres'
password 	= 'postgres'
host		= 'localhost'
port 		= '5432'
db			= 'atn_db'


connection = psycopg2.connect(user=usuario,
                                  password=password,
                                  host=host,
                                  port=port,
                                  database=db)
cursor = connection.cursor()
postgreSQL_select_Query = "select nombre, url from imn_estaciones"

cursor.execute(postgreSQL_select_Query)
records = cursor.fetchall()

if connection:
    cursor.close()
    connection.close()
    print("PostgreSQL connection is closed")

index = 0

for row in records:
    url = row[1]
    print(str(index) + ":" + url)

    if index <= 3:
        try:
            page_main = requests.get(url)
            soup = BeautifulSoup(page_main.text,"html.parser")
            url_table = soup.find("iframe", id="datos")
            url_table = url_table['src']

            url = url[:url.rfind("/")] 

            lst = []
            for pos,char in enumerate(url_table):
                if(char == "/"):
                    lst.append(pos)

            url_table = url_table[lst[1]:]
            url_table = url + url_table
            print(url_table)
            print("---------------------------------------------------------------")

            page_table = requests.get(url_table)
            if page_table.status_code == 200:
                numTable = 0
                table_main = []

                soup = BeautifulSoup(page_table.text,"html.parser")
                tables = soup.find_all('table')
                for table in tables:
                    table_rows = table.find_all('tr')
                    
                    dato =[]
                    for tr in table_rows:
                        line = tr.text.replace('\n',';')
                        line = line[1:-1]
                        dato.append(line.split(";"))
                        print(line)
                    if numTable == 0:
                        print(datetime.now())
                        print(dato[1][0])
                    numTable += 1

                    columns = dato[0]
                    df= pd.DataFrame(dato[1:],columns=columns)
                    print(df)

                    print("---------------------------------------------------------------")
        except:
            print("ERROR al procesar solicitud")
            print("---------------------------------------------------------------")

    index += 1
