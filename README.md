# DimLift
This Javascript / Python project is the authors' implementation of the article **[DimLift: Interactive Hierarchical Data Exploration through Dimensional Bundling](https://github.com/lauragarrison87/DimLift/blob/master/paper/garrison-2021-dimlift.pdf)**.

![DimLift](/paper/garrison_dimlift.jpg)

## Authors
***Laura Garrison<sup>1</sup>, Juliane Müller<sup>2</sup>, Stefanie Schreiber<sup>2,3</sup>, Steffen Oeltze-Jafra<sup>2,3</sup>, Helwig Hauser<sup>1</sup>, and Stefan Bruckner<sup>1</sup>***

<sup>1</sup>Dept. of Informatics \& Mohn Medical Imaging and Visualization Centre, Dept. of Radiology, Haukeland Univ. Hospital, University of Bergen, Norway \
<sup>2</sup>Dept. of Neurology, Otto von Guericke University Magdeburg, Germany\
<sup>3</sup>Center for Behavioral Brain Sciences, Otto von Guericke University Magdeburg, Germany

accepted to _IEEE Transactions on Visualization and Computer Graphics_ journal, 2021

## What is DimLift?
The identification of interesting patterns and relationships is essential to exploratory data analysis. This becomes increasingly difficult in high dimensional datasets. While dimensionality reduction techniques can be utilized to reduce the analysis space, these may unintentionally bury key dimensions within a larger grouping and obfuscate meaningful patterns. With this work we introduce _DimLift_, a novel visual analysis method for creating and interacting with _dimensional bundles_. Generated through an iterative dimensionality reduction or user-driven approach,dimensional bundles are expressive groups of dimensions that contribute similarly to the variance of a dataset. Interactive exploration and reconstruction methods via a layered parallel coordinates plot allow users to lift interesting and subtle relationships to the surface, even in complex scenarios of missing and mixed data types.



## Getting started with DimLift
1. Clone repository from github
2. Install dependencies. If using an IDE, this may be managed/prompted for you. Instructions for command line installation follow below.
   ```
   # dependencies listed in requirements.txt:
   pip install numpy flask matplotlib pandas jsonpickle scikit_learn simplejson
   ```
   
   Our system requires R and two R-packages, FactoMineR and factoextra. These can take a while to install (~30min). 
   ```
   # installing r with homebrew
   brew install r
   
   # R package dependencies
   Rscript -e "install.packages(\"FactoMineR\",repos = \"http://cran.us.r-project.org\")"
   Rscript -e "install.packages(\"factoextra\",repos = \"http://cran.us.r-project.org\")"
   ```
 
3. Start the application backend. Note that our application is built using Python v3.8. Use the absolute directory path, e.g.,
   ```
   python3 /Users/path/to/DimLift/app.py
   ```
   
4. Open `templates/index.html` in your browser (we suggest Chrome).  
   _Depending on your screen size, you may need to zoom out on your browser (_ **ctl -** _or_ **cmd -** _). On our 13" screen we zoom out to 75%._
   ```
   cd templates
   open index.html
   ```

## Sample Exploration
To understand how DimLift works, we will explore the dataset `biolflor_matched.csv`. In line 30 of `app.py` change `Soils.csv` to `biolflor_matched.csv`, and start the application. If you already have `index.html` open, just refresh your browser and the dataset will update in the view. 

_*Note*: Depending on the processing power of your machine, loading in the dataset may take a little while._ We demonstrate this short exploration [here](https://youtu.be/NRe9lbH4wKU) if you prefer to follow along with video.
1. Once data are loaded into the main application, you will see a set of dimensional bundles in the parallel coordinates plot.
2. Change the sorting method to **round in grouping** to better understand which dimensions are extracted and bundled first - this order of extraction tells us which dimensions are contributing MOST strongly to the overall variance of the dataset in a stepwise fashion
3. **Investigate** the third bundle from the left, the **Mycoflor** bundle. Use the navigation icons below the axis to (1) swap the axes to visualize the variance in principal component 1 (PC1) and principal component 2 (PC2), respectively. Click the middle icon to drill down to a plot of PC1 vs PC2 to observe possible grouping patterns. Finally, (3) expand the bundle to observe contributing dimensions
4. **Modify** the bundle by right-clicking on the large, rightmost rectangle glyph above the bundle axis, and click **modify group**
5. In the new panel above the parallel coordinates plot, use the search bar at the top left to locate: (1) pH and (2) light. Clicking on these dimensions in the left panel adds them automatically to the bundle. Once you have added both, click the button **run dimensionality reduction** at the bottom right of this panel. 
5. Your bundle is recreated with these additional dimensions in the parallel coordinates plot. Expand this bundle, and select only scores at or below -0.6 in PC1 by clicking and dragging along the dimension bundle axis. We can see that with this filter applied, only OM (obligate micorrhizae) plants with mid-high pH, low moisture, and higher light values remain. 


## Analyze your own data
Adding your own data for analysis is a bit of a manual process at the moment, but is relatively straightforward:
- save your data in `csv` format
- add `csv` file to */resources*
- in **app.py** line 30 specify the path to your csv file, e.g. `biolflor_matched.csv`

