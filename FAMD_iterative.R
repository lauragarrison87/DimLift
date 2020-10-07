library(FactoMineR)
library(factoextra)
library(jsonlite)

myArgs <- commandArgs(trailingOnly = TRUE)


data <- read.csv(myArgs)


########################################################################
# get contributing and not contributing variables from dataframe
get_contributing_variables <- function(data_frame_var_contrib) {

  col_names_var_contrib <- colnames(data_frame_var_contrib)


  contributing_variables <- c()
  not_contributing_variables <- c()

  index <- 1

  sum_contri <- 0

  for (val in data_frame_var_contrib[1,]){
    sum_contri <- sum_contri + abs(val)
    if (abs(val) > 100/length(col_names_var_contrib)) {
      contributing_variables <- append(contributing_variables, col_names_var_contrib[index])
    } else {
      not_contributing_variables <- append(not_contributing_variables, col_names_var_contrib[index])
    }
    index <- index +1
  }

  df_contributing_variables_from_wine <- as.data.frame(data[,contributing_variables])

  if (length(not_contributing_variables) > 0) {
    df_NOT_contributing_variables_from_wine <- as.data.frame(data[,not_contributing_variables])
    return (list(df_contributing_variables_from_wine, df_NOT_contributing_variables_from_wine))
  } else {
    return (list(df_contributing_variables_from_wine, NULL))
  }
}




########################################################################
#run FAMD
run_FAMD <- function(data_frame, index) {

  data_types <- sapply(data_frame, class)

  run_type <- 'MCA'
  if ((any(data_types=="integer") || any(data_types == "numeric")) && (any(data_types == "factor") || any(data_types == "character"))) {
    run_type <- 'famd'
  } else if ((any(data_types=="integer") || any(data_types == "numeric")) && (!any(data_types == "factor") || !any(data_types == "character"))) {
    run_type <- 'PCA'
  }


  if(run_type == 'famd' || run_type == 'MCA') {
    ################################
    # do FAMD in case of qualitative and quantitative data
    res.famd <- FAMD(data_frame, graph = FALSE)
    var <- get_famd_var(res.famd)

    # print(res.famd$eig)

    var_contrib <- res.famd[["var"]][["contrib"]]

    # Contribution to the first dimension
    # print(fviz_contrib(res.famd, "var", axes = 1))
    # print(fviz_contrib(res.famd, "var", axes = 2))

    data_frame_var_contribution <- as.data.frame(t(var_contrib))

    return(list(data_frame_var_contribution, res.famd$eig, res.famd$ind$coord, res.famd$var$coord, index))

  } else if (run_type == 'PCA') {
    ##########################
    # in case of only numerical values use PCA
    res.famd = PCA(data_frame, scale.unit=TRUE, ncp=5, graph=FALSE)

    var <- res.famd$var

    # print(res.famd$eig)


    # print(fviz_contrib(res.famd, "var", axes = 1))
    # print(fviz_contrib(res.famd, "var", axes = 2))

    var_contrib <- var$contrib

    data_frame_var_contribution <- as.data.frame(t(var_contrib))

    return(list(data_frame_var_contribution, res.famd$eig, res.famd$ind$coord, res.famd$var$coord, index))
  }
}

get_famds <- function(data, index) {

  if (length(colnames(data))<=1) {
    # not enough dimensions for a meaningful FAMD
    return(list(colnames(data)))
  }

  contribution_of_dimensions_and_eigen_value <- run_FAMD(data, index)

  eigenvalue <- contribution_of_dimensions_and_eigen_value[[2]]

  if (eigenvalue[1][1] > 1) {

    contribution_of_dimensions <- contribution_of_dimensions_and_eigen_value[[1]]

    contributing_and_not_contributing <- get_contributing_variables(contribution_of_dimensions)

    INITIAL_contributing <- contributing_and_not_contributing[[1]]
    INITIAL_not_contributing <- contributing_and_not_contributing[[2]]

    if (length(INITIAL_contributing) <2) {
      return(list(colnames(data)))
    }

    INITIAL_contributing_PC_FINAL <- run_FAMD(INITIAL_contributing, index)

    return(c(Recall(INITIAL_not_contributing, index + 1), list(INITIAL_contributing_PC_FINAL)))

  } else {
    return(list(colnames(data)))
  }
}

list_final_contributing <- get_famds(data, 1)

cat(jsonlite::toJSON(list_final_contributing, pretty=TRUE))