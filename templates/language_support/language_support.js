/**
 * This file supports multiple languages
 * all Strings are defined in this class
 * @type {string}
 */



// global variables for multi language
var language_eng = 'eng';
var language_de = 'de';

var current_language = language_eng;

/**
 * get language label by id
 * @param id
 * @returns string label
 */
function get_language_label_by_id(id) {
    var result = language_string.filter(function (obj) {
        return obj.id === id;
    });

    if (result.length === 0) {
        return id;
    } else {

        if (current_language === language_eng) {
            return result[0].eng;
        } else if (current_language === language_de) {
            return result[0].de;
        }
    }
}

const language_id_dimensions_heading = 'language_id_dimensions_heading';
const language_id_quantitative_dimensions_heading = 'language_id_quantitative_dimensions_heading';
const language_id_categorical_dimensions_heading = 'language_id_categorical_dimensions_heading';
const language_id_data_preparation_heading = 'language_id_data_preparation_heading';
const language_id_items_plot_heading = 'language_id_items_plot_heading';
const language_id_likelihood_of_correlation_plot_heading = 'language_id_likelihood_of_correlation_plot_heading';
const language_id_correlation_plot_heading = 'language_id_correlation_plot_heading';
const language_id_applied_data_cleansing_heading = 'language_id_applied_data_cleansing_heading';
const language_id_sort_by = "language_id_sort_by";
const language_id_search = "language_id_search";

const language_id_tooltip_toggle_deviation = "language_id_tooltip_toggle_deviation";

const language_id_resulting_deviation = "language_id_resulting_deviation";
const language_id_eigenvalue = "language_id_eigenvalue";
const language_id_contribution = "language_id_contribution";
const language_id_loading = "language_id_loading";

const language_id_group_legend = 'language_id_group_legend';
const language_id_group_legend_mixed_data = 'language_id_group_legend_mixed_data';

const language_id_opacity_missing_data = 'language_id_opacity_missing_data';


// global variable of all used strings
var language_string = [
    {id: language_id_dimensions_heading, eng: 'Dimensions Overview', de: 'Dimensionen-Überblick'},
    {id: language_id_quantitative_dimensions_heading, eng: 'Quantitative Dimensions', de: 'Quantitative Dimensionen'},
    {id: language_id_categorical_dimensions_heading, eng: 'Categorical Dimensions', de: 'Kategorische Dimensionen'},
    {id: language_id_data_preparation_heading, eng: '', de: 'Alle Dimensionen'},
    {id: language_id_items_plot_heading, eng: 'Subset Selection', de: 'Filter-Ansicht'},
    {id: language_id_likelihood_of_correlation_plot_heading, eng: 'Possibility of Correlations Based on Applied Subset Selection', de: 'Wahrscheinlichkeit von Korrelationen'},
    {id: language_id_correlation_plot_heading, eng: 'Correlations', de: 'Korrelationen'},

    {id: id_id_unalikeability_view, eng: "Coefficient of Unalikeability", de: "Unähnlichkeitskoeffizient"},

    {id: statistics_key__missing_values_percentage, eng: 'Missing Values', de: 'Fehlwerte in Prozent'},
    {id: statistics_key__percentage_of_outliers, eng: 'percentage of outliers', de: 'Ausreißer in Prozent'},
    {id: statistics_key_coefficient_of_unalikeability, eng: 'Coef. of Unalikeability', de:'Koeffizient der Unähnlichkeit'},

    {id: statistics_key__mean_value, eng: 'mean', de: 'Mittelwert'},
    {id: statistics_key__amount_of_categories, eng: 'number of categories', de: 'Anzahl der Kategorien'},
    {id: statistics_key__highest_relative_frequency, eng: 'highest relative frequency', de:'höchste relative Häufigkeit'},
    {id: statistics_key__median_value, eng: 'median', de: 'Median'},
    {id: statistics_key__std_value, eng: 'Standard Deviation', de: 'Standardabweichung'},
    {id: statistics_key__q25_value, eng: 'q25', de: 'q25'},
    {id: statistics_key__q75_value, eng: 'q75', de: 'q75'},
    {id: statistics_key_iqr_range, eng: 'IQR', de: 'Interquartilsabstand'},

    {id: statistics_key_coefficient_of_unalikeability+radar_chart_stats_key_ending, eng: 'unalike', de:'Koeffizient der Unähnlichkeit'},
    {id: statistics_key_overall_deviation, eng: "Overall Deviation", de: "Summe der Abweichungen"},
    {id: wilcox_ModVR, eng: "ModVR", de: "ModVR"},
    {id: wilcox_VarNC, eng: "Variance", de: "var"},
    {id: wilcox_MNDif, eng: "MNDif", de: "MNDif"},
    {id: wilcox_StDev, eng: "Standard Deviation", de: "stDev"},
    {id: wilcox_ranVR, eng: "ranVR", de: "ranVR"},

    {id: statistics_cnv, eng: "CNV", de: "CNV"},
    {id: statistics_h_star, eng: "H*", de: "H*"},
    {id: statistics_iqv, eng: "IQV", de: "IQV"},
    {id: number_of_modes, eng: "Number of Modes", de: "Anzahl der Modes"},

    {id: statistics_key__mean_value+radar_chart_stats_key_ending, eng: 'mean', de: 'Mittelwert'},
    {id: statistics_key__amount_of_categories+radar_chart_stats_key_ending, eng: 'cat', de: 'Anzahl der Kategorien'},
    {id: statistics_key__highest_relative_frequency+radar_chart_stats_key_ending, eng: 'rel frequ', de:'höchste relative Häufigkeit'},
    {id: statistics_key__median_value+radar_chart_stats_key_ending, eng: 'med', de: 'Median'},
    {id: statistics_key__std_value+radar_chart_stats_key_ending, eng: 'std', de: 'Standardabweichung'},
    {id: statistics_key__q25_value+radar_chart_stats_key_ending, eng: 'q25', de: 'q25'},
    {id: statistics_key__q75_value+radar_chart_stats_key_ending, eng: 'q75', de: 'q75'},
    {id: statistics_key_iqr_range+radar_chart_stats_key_ending, eng: 'IQR', de: 'Interquartilsabstand'},

    {id: statistics_key__percentage_of_outliers + radar_chart_stats_key_ending, eng: 'outliers', de: 'Ausreißer %'},
    {id: statistics_key__missing_values_percentage + radar_chart_stats_key_ending, eng: 'missing', de: 'Fehlwerte %'},
    {id: wilcox_ModVR+radar_chart_stats_key_ending, eng: "ModVR", de: "ModVR"},
    {id: wilcox_VarNC+radar_chart_stats_key_ending, eng: "var", de: "VarNC"},
    {id: wilcox_MNDif+radar_chart_stats_key_ending, eng: "MNDif", de: "MNDif"},
    {id: wilcox_StDev+radar_chart_stats_key_ending, eng: "std", de: "stDev"},
    {id: wilcox_ranVR+radar_chart_stats_key_ending, eng: "ranVR", de: "ranVR"},

    {id: statistics_cnv+radar_chart_stats_key_ending, eng: "CNV", de: "CNV"},
    {id: statistics_h_star+radar_chart_stats_key_ending, eng: "H*", de: "H*"},
    {id: statistics_iqv+radar_chart_stats_key_ending, eng: "IQV", de: "IQV"},
    {id: number_of_modes+radar_chart_stats_key_ending, eng: "number of modes", de: "Anzahl der Modes"},

    {id: statistics_key__percentage_of_outliers + radar_chart_stats_key_ending + deviation_ending, eng: 'Δ outliers', de: 'Δ Ausreißer %'},
    {id: statistics_key__missing_values_percentage + radar_chart_stats_key_ending+ deviation_ending, eng: 'Δ missing', de: 'Δ Fehlwerte %'},
    {id: wilcox_ModVR+radar_chart_stats_key_ending+ deviation_ending, eng: "Δ ModVR", de: "Δ ModVR"},
    {id: wilcox_VarNC+radar_chart_stats_key_ending+ deviation_ending, eng: "Δ var", de: "Δ VarNC"},
    {id: wilcox_MNDif+radar_chart_stats_key_ending+ deviation_ending, eng: "Δ MNDif", de: "Δ MNDif"},
    {id: wilcox_StDev+radar_chart_stats_key_ending+ deviation_ending, eng: "Δ std", de: "Δ stDev"},
    {id: wilcox_ranVR+radar_chart_stats_key_ending+ deviation_ending, eng: "Δ ranVR", de: "Δ ranVR"},
    {id: statistics_key_coefficient_of_unalikeability+radar_chart_stats_key_ending+deviation_ending, eng: 'Δ unalike', de:'Δ Koeffizient der Unähnlichkeit'},
    {id: statistics_cnv+radar_chart_stats_key_ending+ deviation_ending, eng: "Δ CNV", de: "Δ CNV"},
    {id: statistics_h_star+radar_chart_stats_key_ending+ deviation_ending, eng: "Δ H*", de: "Δ H*"},
    {id: statistics_iqv+radar_chart_stats_key_ending+ deviation_ending, eng: "Δ IQV", de: "Δ IQV"},
    {id: number_of_modes+radar_chart_stats_key_ending+ deviation_ending, eng: "Δ number of modes", de: "Δ Anzahl der Modes"},

    {id: statistics_key_index_round, eng: "round in grouping", de:"Runde in Gruppierung"},
    {id: statistics_key__mean_value+deviation_ending, eng: 'Δ mean', de: 'Δ Mittelwert'},
    {id: statistics_key__amount_of_categories + deviation_ending, eng: 'Δ number of categories', de: 'Δ Anzahl der Kategorien'},
    {id: statistics_key__highest_relative_frequency + deviation_ending, eng: 'Δ highest relative frequency', de:'Δ höchste relative Häufigkeit'},
    {id: statistics_key__median_value+deviation_ending, eng: 'Δ median', de: 'Δ Median'},
    {id: statistics_key__std_value+deviation_ending, eng: 'Δ Standard Deviation', de: 'Δ Standardabweichung'},
    {id: statistics_key__q25_value+deviation_ending, eng: 'Δ q25', de: 'Δ q25'},
    {id: statistics_key__q75_value + deviation_ending, eng: 'Δ q75', de: 'Δ q75'},
    {id: statistics_key_iqr_range+deviation_ending, eng: 'Δ IQR', de: 'Δ Interquartilsabstand'},
    {id: statistics_key_coefficient_of_unalikeability + deviation_ending, eng: 'Δ Coef. of Unalikeability', de:'Δ Koeffizient der Unähnlichkeit'},
    {id: statistics_key__missing_values_percentage + deviation_ending, eng: 'Δ Missing Values', de: 'Δ Fehlwerte in Prozent'},
    {id: statistics_key__percentage_of_outliers + deviation_ending, eng: 'Δ percentage of outliers', de: 'Δ Ausreißer in Prozent'},
    {id: wilcox_ModVR+deviation_ending, eng: "Δ ModVR", de: "Δ ModVR"},
    {id: wilcox_VarNC+deviation_ending, eng: "Δ Variance", de: "Δ VarNC"},
    {id: wilcox_MNDif+deviation_ending, eng: "Δ MNDif", de: "Δ MNDif"},
    {id: wilcox_StDev+deviation_ending, eng: "Δ Standard Deviation", de: "Δ stDev"},
    {id: wilcox_ranVR+deviation_ending, eng: "Δ ranVR", de: "Δ ranVR"},

    {id: statistics_cnv+deviation_ending, eng: "Δ CNV", de: "Δ CNV"},
    {id: statistics_h_star+deviation_ending, eng: "Δ H*", de: "Δ H*"},
    {id: statistics_iqv+deviation_ending, eng: "Δ IQV", de: "Δ IQV"},
    {id: number_of_modes+deviation_ending, eng: "Δ Number of Modes", de: "Δ Anzahl der Modes"},

    {id: id_view_items_parallel_coordinates, eng: '', de: 'Parallele Koordinaten'},
    {id: id_view_items_applied_filters, eng: 'Applied Selections', de: 'Angewandte Filter'},

    {id: language_id_sort_by, eng: 'Sort Axes by: ', de: 'Sortieren nach: '},
    {id: language_id_search, eng: 'Search for Dimension...', de: 'Suche...'},

    {id: language_id_tooltip_toggle_deviation, eng: "Toggle between real statistical measures and deviations resulting from applied filters.", de: "Umschalten zwischen wirklichen statistischen Werten und den Abweichungen resultierend von den angewandten Filtern."},
    {id: id_scatterplot_x_axis, eng: "Change x axis measure", de: "Ändere die x-Achsen Maßeinheit"},
    {id: id_scatterplot_y_axis, eng: "Change y axis measure", de: "Ändere die y-Achsen Maßeinheit"},

    //{id: id_applied_data_cleansing_button, eng: "automatically identify best suitable data type and convert", de: "Automatisches Erkennen und Konvertieren zum als best passensten Datentyp."},
    {id: id_outlier_removing_button, eng: "automatically remove possible outliers", de: "Automatisches Entfernen von möglichen Ausreißern."},
    {id: id_data_type_identification_and_formatting_button, eng: "inspect and redefine applied data cleansing", de: "Anschauen des angewandten data cleansings"},

    {id: id_previous_button, eng: "rotate to the left", de:'rotiere nach links'},
    {id: id_next_button, eng: "rotate to the right", de:'rotiere nach rechts'},

    {id: id_data_type__categorical, eng: "qualitative", de:'rotiere nach rechts'},
    {id: id_data_type__numerical, eng: "quantitative", de:'rotiere nach rechts'},
    {id: id_data_type__date, eng: "date", de:'rotiere nach rechts'},
    {id: id_percentage_of_missing_values, eng: 'available data: ', de:'Prozentzahl der vorhandenen Daten: '},
    {id: id_percentage_of_variance_view, eng:'included variance: ', de:'inkludierte Varianz: '},
    {id: language_id_eigenvalue, eng:'eigenvalue: ', de:'Eigenwert: '},

    {id: language_id_contribution, eng:'contribution: ', de:'Beitrag: '},
    {id: language_id_loading, eng:'loading: ', de:'Loading: '},

    {id: id_drilldown_dimension, eng:'drill down', de:'Loading: '},
    {id: id_drillup_dimension, eng:'roll up', de:'Loading: '},
    {id: id_expand_dimension, eng:'expand dimension', de:'Loading: '},
    {id: id_shrink_dimensions, eng:'collapse dimension', de:'abc'},
    {id: id_swap_dimension, eng:'swap dimension', de:'Loading: '},

    {id: language_id_group_legend, eng: 'grouping', de: ''},
    {id: language_id_group_legend_mixed_data, eng: 'grouping of mixed data', de: ''},

    {id: language_id_resulting_deviation, eng: 'deviation', de:''},
    {id: language_id_opacity_missing_data, eng: 'opacity = missing values %', de:''},
    {id: language_id_modify_group, eng: 'modify group', de: 'verändere Gruppe'},
    {id: language_id_run_dimensionality_reduction, eng: 'run dimensionality reduction', de: ''},
    {id: language_id_applied_data_cleansing_heading, eng: 'Apply Dimensionality Reduction', de:'Angewandte Datenbereinigung'}
];