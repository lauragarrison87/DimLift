library(dplyr)
library(mice)
library(missMDA)


# @Laura: change it to your folder
clinical_data_whole <- read.csv("~/Documents/OneDrive/Dokumente/Magdeburg/intelliJ_projects/flask_test/clinical_data_whole.csv", stringsAsFactors=TRUE)

clinical_Data_whole_MICE <- clinical_data_whole
clinical_Data_whole_HotDeck <- clinical_data_whole
clinical_Data_whole_MissMDA <- clinical_data_whole

highest_missing_percentage = 75

p_missing <- unlist(lapply(clinical_data_whole, function(x) sum(is.na(x))))/nrow(clinical_data_whole)

sort(p_missing, decreasing = TRUE)

clinical_data_whole_less_than_80_percent_missing <- clinical_data_whole %>%
  # @Laura: right now it is 78%. It is not working with more
  select_if(function(col) sum(is.na(col))/nrow(clinical_data_whole) < highest_missing_percentage * 0.01 && sum(is.na(col))/nrow(clinical_data_whole) > 0.00)

print(clinical_data_whole_less_than_80_percent_missing)
imp <- mice(clinical_data_whole_less_than_80_percent_missing, maxit=0)

predM = imp$predictorMatrix
meth = imp$method

head(predM)

# Specify a separate imputation model for variables of interest

# Ordered categorical variables
poly <- c("Group_coded", "Clinical.diagnosis.at.lumbar.puncture", "Boston.STRIVE.Criteria.at.lumbar.puncture_coded")

# Dichotomous variable
log <- c()  # c("Sex", "Hypertonie", "Diabetes", "Hyperlipidämie")

# Unordered categorical variable
poly2 <- c("ID", "Boston.STRIVE.Criteria.at.lumbar.puncture", "ICH.at.lumbar.puncture", "Sex", "Hypertonie", "Diabetes", "Hyperlipidämie")

# This needs to be commented out otherwise it is not working correctly

# Turn their methods matrix into the specified imputation models
# meth[poly] = "polr"
# meth[log] = "logreg"
# meth[poly2] = "polyreg"

meth

imp2 <- mice(clinical_data_whole_less_than_80_percent_missing, maxit = 3,
             predictorMatrix = predM,
             method = meth, print =  TRUE)

completedData_mice <- complete(imp2) # use the complete dataset with the data from the first iteration

col_names <- colnames(completedData_mice)

for (i in 1:length(col_names)) {
  if(col_names[i] %in% colnames(completedData_mice))
  {
    clinical_Data_whole_MICE[col_names[i]] <- completedData_mice[col_names[i]]
  }
}

write.csv(clinical_Data_whole_MICE,paste("clinical_data_imputed_MICE", highest_missing_percentage, ".csv", sep = ""), row.names = FALSE)



#*** prepare imputation method
vars <- colnames(clinical_data_whole_less_than_80_percent_missing)
V <- length(vars)
impMethod <- rep("hotDeck", V)
method <- "cor"

#*** imputation in mice
imp <- mice::mice( data=clinical_data_whole_less_than_80_percent_missing, m=1, method=impMethod, method=method )
summary(imp)

completedData_hotDeck <- complete(imp)

col_names <- colnames(completedData_hotDeck)

for (i in 1:length(col_names)) {
  if(col_names[i] %in% colnames(completedData_hotDeck))
  {
    clinical_Data_whole_HotDeck[col_names[i]] <- completedData_hotDeck[col_names[i]]
  }
}


write.csv(clinical_Data_whole_HotDeck, paste("clinical_data_imputed_HotDeck", highest_missing_percentage, ".csv", sep = ""), row.names = FALSE)


res.comp = imputePCA(clinical_data_whole_less_than_80_percent_missing,ncp=2)
col_names <- colnames(res.comp$completeObs)

for (i in 1:length(col_names)) {
  if(col_names[i] %in% colnames(res.comp$completeObs))
  {
    clinical_Data_whole_MissMDA[col_names[i]] <- res.comp[["completeObs"]][,i]
  }
}

write.csv(clinical_Data_whole_MissMDA,paste("clinical_data_imputed_MissMDA", highest_missing_percentage, ".csv", sep = ""), row.names = FALSE)

