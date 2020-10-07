/**
 * This file contains all descriptive statistic keys
 * @type {string}
 */

//---------------------------all dimensions
const statistics_key__missing_values_percentage = "missing_values_percentage";
const statistics_key__percentage_of_outliers = "percentage_of_outliers";

//---------------------------numerical dimensions
const statistics_key__mean_value = "mean_value";
const statistics_key__std_value = "std_value";
const statistics_key__median_value = "median_value";
const statistics_key__q25_value = "q25_value";
const statistics_key__q75_value = "q75_value";
const statistics_key__outliers_removed = "outliers_removed";
const statistics_key_iqr_range = "iqr_range";
const statistics_key_coefficient_of_unalikeability = "coefficient_of_unalikeability";

const statistics_key_overall_deviation = 'overall_deviation';
const statistics_key_index_round = 'index_round';
const deviation_ending = "_deviation";
const radar_chart_stats_key_ending = "_radar_stats_short";

//-------------------------------categorical dimensions
const statistics_key__highest_relative_frequency = "highest_relative_frequency";
const statistics_key__amount_of_categories = "amount_of_categories";
const statistics_key__categories = "categories";
const statistics_key__unique_value = "unique_value";
const statistics_key__count = "count";
const statistics_key__relativeFrequency = "relativeFrequency";




const number_of_modes = "number_of_modes";

//----------------------------wilcox
const wilcox_ModVR = "modVR";
const wilcox_VarNC = "varNC";
const wilcox_MNDif = "mnDif";
const wilcox_StDev = "stDev";
const wilcox_ranVR = "ranVR";

const statistics_iqv = "iqv";
const statistics_h_star = "h_star";
const statistics_cnv = "cnv";

const key_id = "id";
const key_data_type = "data_type";
const key_column_values = "column_values";
const key_header ="header";
const key_removed_during_data_formatting = "key_removed_during_data_formatting";

const changes_general_key = "changes";
const changes_key_datatype_change = "key_datatype_change";


const all_descriptive_statistic_measures_all_dimensions = [statistics_key__missing_values_percentage, statistics_key_coefficient_of_unalikeability, wilcox_StDev, wilcox_VarNC, number_of_modes];
//const all_descriptive_statistic_measures_all_dimensions = [statistics_key__percentage_of_outliers, statistics_key__missing_values_percentage, statistics_key_coefficient_of_unalikeability, wilcox_ranVR, wilcox_StDev, wilcox_MNDif, wilcox_VarNC, wilcox_ModVR, statistics_cnv, statistics_h_star, statistics_iqv, number_of_modes];
const all_descriptive_statistic_measures_categorical = all_descriptive_statistic_measures_all_dimensions; //[statistics_key__amount_of_categories, statistics_key__highest_relative_frequency, statistics_key_coefficient_of_unalikeability];
const all_descriptive_statistic_measures_numerical = all_descriptive_statistic_measures_all_dimensions; [statistics_key__mean_value, statistics_key__std_value, statistics_key__median_value, statistics_key__q25_value, statistics_key__q75_value, statistics_key_iqr_range, statistics_key_coefficient_of_unalikeability];
