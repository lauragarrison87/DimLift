
const qualitative_bar_height = 6;
const qualitative_bar_max_width = 50;

let dimensions_count_shown = 10;

const id_class_dimension = "dimension";
const id_class_dimension_expanded = "dimension_expanded";

const contributing_background_color = '#808080';
const id_frequency_bar = "frequency_bar";
const id_statistics_background = "statistics_background";
const id_contribution_background = "contribution_background";
const id_contribution_circle = "contribution_circle";
const id_axis_label_text = "axis_label_text";
const splitter = "_splitter_";
const id_percentage_of_variance_view = "percentage_of_variance_view";
const id_percentage_of_missing_values = "percentage_of_missing_values";
const id_contri_ending = "__contri_ending";
const id_loadings_view = "loadings_view";
const id_axis_svg_contribution = "axis_svg_contribution";

let allow_dragging = [];

const id_swap_dimension = "swap_dimension";
const id_drilldown_dimension = "dril_down_dimension";
const id_drillup_dimension = "dril_up_dimension";
const id_expand_dimension = "expand_dimension";
const id_shrink_dimensions = 'shrink_dimension';
const id_PC1PC2_text = "pc1pc2_text";

const id_pc1pc2_scatterplot_svg = "pc1pc2_scatterplot_svg";
const id_pc1pc2_scatterplot_circles = "pc1pc2_scatterplot_circles";
const id_PC1 = "PC1";
const id_PC2 = "PC2";
const id_tick_lines = "tick_lines";

const duration_time = 200;
const opacity_path = 0.15;
const opacity_path_hover = 1;
const opacity_qualitative_frequency = 0.8;

let x_scale_pcp_new;

let foreground_pcp_new;

let y_scale_pcp_new = {};

let pcp_new_height;
let width_pcp_new;

let line_pcp_new;
let dragging = {};
let svg_pcp_new;

let qualitative_bar_width_scale;

let data_all_pcp_new;

let dimensions = [];
let dimensions_new = [];

const margin_pcp_plot_new = {top: 120, right: 100, bottom: 40, left: 100};

let dimensions_brushed_filtered = [];
let actives_copy = [];

let statistics_scale;
const newly_generated_group_background_color = "#800080";

const y_start_minus = 27;
const upper_vis_heights = 36;
const missing_values_vis_height = upper_vis_heights - 10;

let tippy_instances_contribution = [];
let tippy_instances_circles_contribution = [];

const margin_scatterplot_pc1pc2 = {top: 5, right: 2, bottom: 3, left: 2};
let width_scatterplot_PC1PC2;
let height_scatterplot_PC1PC2;

let color_scale_loading;

const min_stroke_width_group = 2;
const max_stroke_width_group = 7;