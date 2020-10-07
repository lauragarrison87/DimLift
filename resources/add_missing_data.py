import random
import time

import pandas as pd

df = pd.read_csv("synthetic-body2.csv", keep_default_na=False, na_values=[""])


def str_time_prop(start, end, format, prop):
    """Get a time at a proportion of a range of two formatted times.

    start and end should be strings specifying times formated in the
    given format (strftime-style), giving an interval [start, end].
    prop specifies how a proportion of the interval to be taken after
    start.  The returned time will be in the specified format.
    """

    stime = time.mktime(time.strptime(start, format))
    etime = time.mktime(time.strptime(end, format))

    ptime = stime + prop * (etime - stime)

    return time.strftime(format, time.localtime(ptime))


def random_date(start, end, prop):
    return str_time_prop(start, end, '%d.%m.%Y', prop)


length_all = len(df)

list_birth_dates = []
for i in range(length_all):
    list_birth_dates.append(random_date("01.01.1950", "01.01.1999", random.random()))

df['d1'] = list_birth_dates

print(df)

# print(df['b1'].value_counts())

missing_per_col = {'index': 0, 'a1': 10, 'a2': 15, 'a3': 25, 'b1': 35, 'b2': 15, 'b3': 30, 'c1': 25, 'o1': 0, 'o2': 20, 'd1': 10}
my_list = list(range(length_all))

data_top = df.head()

for col_name in data_top:

    random_delete = random.sample(my_list, int(length_all * missing_per_col[col_name] / 100))

    for index in range(len(df[col_name].tolist())):
        if index in random_delete:
            df[col_name][index] = ""

    if col_name == 'o1':
        for index in range(len(df[col_name].tolist())):
            if df['a1'][index] == "" or df['a2'][index] == "":
                df[col_name][index] = ""

print(df)

df = df.rename(columns={'a1': 'height', 'a2': 'weight', 'a3': 'waist circumference', 'b1': 'education level', 'b2': 'workout frequency', 'b3': 'smoking', 'c1': 'gender', 'o1': 'BMI', 'o2': 'cardiac risk', 'd1': 'birthdate'}, errors="raise")

df.to_csv('synthetic_dates_missingness2.csv', index=False)
