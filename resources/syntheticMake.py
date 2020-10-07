#https://machinelearningmastery.com/generate-test-datasets-python-scikit-learn/ (another resource)
#resource: https://towardsdatascience.com/exploratory-data-analysis-with-pandas-508a5e8a5964
from random import uniform

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Variables
## measurements
# a1: height
# a2: weight
# a3: waist circumference

## lifestyle
# b1: education
# b2: workout frequency / week
# b3: smoker

# c1: gender

# o1: BMI class -> (uw, h, ov, o, exo) -- underweight, healthy, overweight, obese, extremely obese (a1,b1)
# o2: cardiac risk class -> (low, med, high) males with high a2 have increased cardiac risk (a3, b2, b3, c1)
from numpy import sort

mu1, sigma1 = 1.6, 0.1 #avg height in meters, std. dev.
mu2, sigma2 = 10, 1
n = 500

# grp 1: measurements (a1 = height, a2 = weight, a3 = waist circumference)
a1 = np.random.normal(mu1, sigma1, n)
a2 = np.random.normal(0, 0.8, n) + 50 + 10 * a1  # introduce differences so isn't just noise + exact copy of a1
a3 = np.random.normal(0.07, 0.01, n) + a1 * 0.4

print(sort(np.random.normal(0, 3, n)))

# grp 2: lifestyle (b1 = education, b2 = workout intensity, b3 = smoker)
b1_raw = np.random.normal(mu2, sigma2, n)
b1_bins = np.percentile(b1_raw, q=np.linspace(20, 100, 5))
b1 = np.digitize(b1_raw, b1_bins) # apply bins to data

b2_bins = np.percentile(b1_raw, q=np.linspace(20, 100, 5)) #(data source to bin, use percentile to set bin spacing, minimum is 20, max 100, 5 bins)
b2 = np.digitize(b1_raw, b2_bins) # apply bins to data

b3_bins = np.percentile(b1_raw, q=np.linspace(50, 100, 2)) # "smoker"
b3 = np.digitize(b1_raw, b3_bins)

c1 = np.random.randint(0, 2, n) #binary target variable = "gender"

# grp 3: -> outcome measures from other dimensions; point is to show transitive relationship
o1 = a2 / (a1 * a1) # BMI
# o1_bins = np.percentile(o1_raw, q=np.linspace(20, 100, 5))
# o1 = np.digitize(o1_raw, o1_bins)# binned BMI

o2_raw = np.random.normal(1, 0.01, n) + np.add(4 * a3, 10 * b2) + np.add(50 * b3, 2 * c1) #random stuff to decide cardiac risk
o2_bins = np.percentile(o2_raw, q=np.linspace(33, 100, 3))
o2 = np.digitize(o2_raw, o2_bins)
#print(o2)
#o2 = np.random.normal(1, 0.01, n) + np.multiply(a2, b2)


#plt.plot(a1, b1)
#plt.savefig('test.png')

#make dataframe
df = pd.DataFrame(list(zip(a1, a2, a3, b1, b2, b3, c1, o1, o2)), columns=['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'o1', 'o2'])

#convert relevant variables to categorical data items
df['b1'] = df.b1.replace({0: "some HS", 1: "HS", 2: "Uni", 3: "Grad", 4: "Grad plus"})
df['b2'] = df.b2.replace({0: "inactive", 1: "light", 2: "moderate", 3: "heavy", 4: "turbo"})
df['b3'] = df.b3.replace({0: "NS", 1: "S"})
df['c1'] = df.c1.replace({0: "F", 1: "M"})
# df['o1'] = df.o1.replace({0: "UW", 1: "H", 2: "OW", 3: "OB", 4: "MOB"}) #0: "Underweight", 1: "Healthy", 2: "Overweight", 3: "Obese", 4: "Mordibly obese"
df['o2'] = df.o2.replace({0: "low", 1: "med", 2: "high"})
#print(df.o1)
print(df.dtypes)
print(df)

df.reset_index(inplace=True)
df.to_csv('synthetic-body2.csv', index=None)
