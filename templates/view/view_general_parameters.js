const color__categorical_data = "#900C3F";
const color__numerical_data = "#1A5276";
const color__date_data = "#D68910";
const color__grouped_data = "#eb34b7";

const color_applied_filters = '#b3cde3';

const id_duplicate_dimensions = "__duplicate_dimension";

let color_scale_descriptive_statistics = d3.scaleLinear()
    .range(['#D1CBCA', 'white']);


const color_upper_vis_missing_values = '#444168';
const color_upper_vis_variance = '#800080';
const color_upper_vis_contribution = 'black'

const opacity_deviation_lines = 0.3;
const stroke_width_deviation_lines = 1;

const animation_duration_time = 1000;
const animation_duration_time_pop_up_view = 200;


let dimension_plots_range_width_height = [];
let dimension_plots_range_width_height_likelihood = [];

let sort_parallel_coordinates_by = wilcox_VarNC;

const min_opacity = 0.3;
let color_grad_mixed_datatype;

let carousel, cells, cellCount, selectedIndex, cellWidth, cellHeight, rotateFn, radius, theta;

// ---------------------------------ids and labels of dimension plots
const dimension_plot_preferences = [{
    id: id_likelihood_of_errors_dimensions,
    label: language_id_data_preparation_heading,
    datatype: [id_data_type__numerical, id_data_type__categorical, id_data_type__date],
    scatterplot_x_axis: all_descriptive_statistic_measures_all_dimensions[1],
    scatterplot_y_axis: all_descriptive_statistic_measures_all_dimensions[0],
    deviation: false,
    all_descriptive_statistical_measures : all_descriptive_statistic_measures_all_dimensions
}/*, {
    id: id_quantitative_dimensions,
    label: language_id_quantitative_dimensions_heading,
    datatype: [id_data_type__numerical, id_data_type__date],
    scatterplot_x_axis: statistics_key__mean_value,
    scatterplot_y_axis: statistics_key__std_value,
    deviation: false,
    all_descriptive_statistical_measures : all_descriptive_statistic_measures_numerical
}, {
    id: id_categorical_dimensions,
    label: language_id_categorical_dimensions_heading,
    datatype: [id_data_type__categorical],
    scatterplot_x_axis: statistics_key__highest_relative_frequency,
    scatterplot_y_axis: statistics_key__amount_of_categories,
    deviation: false,
    all_descriptive_statistical_measures : all_descriptive_statistic_measures_categorical
}*/];

const likelihood_of_correlation_plot_preferences = {
    id: id_likelihood_of_correlation,
    label: language_id_likelihood_of_correlation_plot_heading,
    datatype: [id_data_type__categorical, id_data_type__numerical],
  //  datatype: [id_data_type__categorical, id_data_type__numerical, id_data_type__date],
    scatterplot_x_axis: statistics_key_overall_deviation,
    scatterplot_y_axis: key_data_type
};

const item_plot_preferences = [{
    id: id_view_items_parallel_coordinates,
    label: id_view_items_parallel_coordinates,
    width: 'calc(100% / 4 * 3 - var(--main-margin))'
}, {
    id: id_view_items_applied_filters,
    label: id_view_items_applied_filters,
    width: 'calc(100% / 4 - var(--main-margin))'
}];


const data_cleansing_buttons = [{
    id: id_applied_data_cleansing_button,
    image: "resources/round_double_arrow_black_18dp.png"
} /*, {
    id: id_outlier_removing_button,
    image: "resources/removing_outliers.png"
}*/ /*, {
    id: id_data_type_identification_and_formatting_button,
    image: "resources/datatype_change.png"
}*/];

let brushed_dimensions = [];