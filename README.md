# DimLift
This Javascript / Python project is the authors' implementation of the article **[DimLift: Interactive Hierarchical Data Exploration through Dimensional Bundling](https://github.com/lauragarrison87/DimLift/blob/master/paper/garrison-2021-dimlift.pdf)**.

## Authors
***Laura Garrison<sup>1</sup>, Juliane Müller<sup>2</sup>, Stefanie Schreiber<sup>2,3</sup>, Stefan Bruckner<sup>1</sup>, Helwig Hauser<sup>1</sup>, Steffen Oeltze-Jafra<sup>2,3</sup>***

<sup>1</sup>Dept. of Informatics \& Mohn Medical Imaging and Visualization Centre, Dept. of Radiology, Haukeland Univ. Hospital, University of Bergen, Norway \
<sup>2</sup>Dept. of Neurology, Otto von Guericke University Magdeburg, Germany\
<sup>3</sup>Center for Behavioral Brain Sciences, Otto von Guericke University Magdeburg, Germany

accepted for TVCG 2021

![DimLift](/paper/garrison_dimlift.jpg)

## What is DimLift?
The identification of interesting patterns and relationships is essential to exploratory data analysis. This becomes increasingly difficult in high dimensional datasets. While dimensionality reduction techniques can be utilized to reduce the analysis space, these may unintentionally bury key dimensions within a larger grouping and obfuscate meaningful patterns. With this work we introduce _DimLift_, a novel visual analysis method for creating and interacting with _dimensional bundles_. Generated through an iterative dimensionality reduction or user-driven approach,dimensional bundles are expressive groups of dimensions that contribute similarly to the variance of a dataset. Interactive exploration and reconstruction methods via a layered parallel coordinates plot allow users to lift interesting and subtle relationships to the surface, even in complex scenarios of missing and mixed data types.



## Getting started with DimLift
- Download repository from github
- Open project in development environment, e.g., IntelliJ Idea
- Install package dependencies listed in **requirements.txt**. Depending on your IDE, this may be managed/prompted for you. 
- Run **app.py** (right click and choose 'run')
- Navigate to */templates/index.html* and open in web browser, i.e., Chrome
- Depending on the size screen you are working with, you may want to zoom out on your browser (_ctl -_ or _cmd -_)


## Analyze your own data
Adding your own data for analysis is a bit of a manual process at the moment, but is relatively straightforward:
- save your data in `csv` format
- add `csv` file to */resources*
- in **app.py** line 30 specify the path to your csv file, e.g. `resources/FDA_nutrients.csv`

