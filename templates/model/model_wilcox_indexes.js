/**
 * compute all the wilcox indices
 * @param data
 * @returns {[]}
 */
function get_wilcox_indices (data) {


    let wilcox_objects = [];

    let k = data.length;

    if (data.length < 2) {
        wilcox_objects.push({
            key: wilcox_StDev,
            value: 0
        });
        wilcox_objects.push({
            key: wilcox_VarNC,
            value: 0
        });
        wilcox_objects.push({
            key: wilcox_ranVR,
            value: 0
        });
        wilcox_objects.push({
            key: wilcox_MNDif,
            value: 0
        });
        wilcox_objects.push({
            key: wilcox_ModVR,
            value: 0
        });

        return wilcox_objects;
    }
    let fm = d3.max(data, function(d) { return +d[statistics_key__relativeFrequency];});

    let n_total_size = 0;
    data.forEach(function (cat) {
        n_total_size += cat[statistics_key__relativeFrequency];
    });

    let modVR = (k * (1-fm/n_total_size)) / (k-1);

    wilcox_objects.push({
        key: wilcox_ModVR,
        value: modVR
    });


    let sum_value_varnc = 0;
    let sum_value_iqv = 0;
    let sum_value_h_star = 0;

    data.forEach(function (cat) {
        sum_value_varnc += (cat[statistics_key__relativeFrequency] - n_total_size/k) * (cat[statistics_key__relativeFrequency] - n_total_size/k);
        sum_value_iqv += cat[statistics_key__relativeFrequency] * cat[statistics_key__relativeFrequency];
        if (cat[statistics_key__relativeFrequency] !== 0) {
            sum_value_h_star += cat[statistics_key__relativeFrequency] * Math.log(cat[statistics_key__relativeFrequency]);
        }
    });

    let varNC = (sum_value_varnc /(((n_total_size * n_total_size) * (k-1))/k)) ;
    wilcox_objects.push({
        key: wilcox_VarNC,
        value: varNC
    });

    let ranVR = d3.min(data, function(d) { return +d[statistics_key__relativeFrequency];}) / fm;

    wilcox_objects.push({
        key: wilcox_ranVR,
        value: ranVR
    });


    let sum_distances_mnDif = 0;
    for (let i =0; i< k-1; i++) {
        for (let j=i+1; j<k; j++) {
            sum_distances_mnDif += Math.abs(data[i][statistics_key__relativeFrequency] - data[j][statistics_key__relativeFrequency]);
        }
    }

    let mn_dif = 1- (1/(n_total_size *(k-1))) * sum_distances_mnDif;
    wilcox_objects.push({
        key: wilcox_MNDif,
        value: mn_dif
    });


    let sum_distances_stDev = 0;
    for (let i =0; i< k-1; i++) {
        for (let j=i+1; j<k; j++) {
            sum_distances_stDev += (data[i][statistics_key__relativeFrequency] - data[j][statistics_key__relativeFrequency]) * (data[i][statistics_key__relativeFrequency] - data[j][statistics_key__relativeFrequency]);
        }
    }


    let stDev = Math.sqrt(sum_distances_stDev / (n_total_size * n_total_size * (k-1)));
   // let stDev = 1- Math.sqrt(sum_distances_stDev / (n_total_size * n_total_size * (k-1)));

    //let stDev = Math.sqrt(sum_value_varnc /(((n_total_size * n_total_size) * (k-1))/k)) ;

    wilcox_objects.push({
        key: wilcox_StDev,
        value: stDev
    });


    let iqv = (k/(k-1)) * (1- sum_value_iqv);
    wilcox_objects.push({
        key: statistics_iqv,
        value: iqv
    });


    let h_star = - sum_value_h_star / Math.log(k);
    wilcox_objects.push({
        key: statistics_h_star,
        value: h_star
    });

    let cnv = 1- Math.sqrt(1-iqv);
    wilcox_objects.push({
        key: statistics_cnv,
        value: cnv
    });

    return wilcox_objects;
}
//
// function varNC(data) {
//     let k = data.length;
//     let n_total_size = 0;
//     data.forEach(function (cat) {
//         n_total_size += cat[statistics_key__relativeFrequency];
//     });
//
//     let sum_value_varnc = 0;
//     data.forEach(function (cat) {
//         sum_value_varnc += (cat[statistics_key__relativeFrequency] - n_total_size/k) * (cat[statistics_key__relativeFrequency] - n_total_size/k)
//     });
//
//     let varNC = 1- (1/(n_total_size * n_total_size)) * k/(k-1) * sum_value_varnc;
//
//     return varNC;
// }
//
// function mnDif(data) {
//     let k = data.length;
//     let n_total_size = 0;
//     data.forEach(function (cat) {
//         n_total_size += cat[statistics_key__relativeFrequency];
//     });
//
//     let sum_distances_mnDif = 0;
//     for (let i =0; i< k-1; i++) {
//         for (let j=i+1; j<k; j++) {
//             sum_distances_mnDif += Math.abs(data[i][statistics_key__relativeFrequency] - data[j][statistics_key__relativeFrequency]);
//         }
//     }
//
//     let mn_dif = 1- (1/(n_total_size *(k-1))) * sum_distances_mnDif;
//
//     return mn_dif;
// }
//
// function stDev(data) {
//     let k = data.length;
//     let n_total_size = 0;
//     data.forEach(function (cat) {
//         n_total_size += cat[statistics_key__relativeFrequency];
//     });
//
//     let sum_distances_stDev = 0;
//     for (let i =0; i< k-1; i++) {
//         for (let j=i+1; j<k; j++) {
//             sum_distances_stDev += (data[i][statistics_key__relativeFrequency] - data[j][statistics_key__relativeFrequency]) * (data[i][statistics_key__relativeFrequency] - data[j][statistics_key__relativeFrequency]);
//         }
//     }
//
//     let stDev = 1- Math.sqrt(sum_distances_stDev / (n_total_size * n_total_size * (k-1)));
//
//     return stDev;
// }