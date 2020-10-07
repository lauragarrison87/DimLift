library(FactoMineR)
library(factoextra)
library(jsonlite)

myArgs <- commandArgs(trailingOnly = TRUE)


data <- read.csv(myArgs)

########################################################################
#run FAMD
run_FAMD <- function(data_frame) {

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

    return(list(data_frame_var_contribution, res.famd$eig, res.famd$ind$coord, res.famd$var$coord, -1))

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

    return(list(data_frame_var_contribution, res.famd$eig, res.famd$ind$coord, res.famd$var$coord, -1))
  }
}

list_final_contributing <- run_FAMD(data)

cat(jsonlite::toJSON(list_final_contributing, pretty=TRUE))


