function kernelDensityEstimator(kernel, X) {
    return function(V) {
        return X.map(function(x) {
            return {[statistics_key__unique_value]:x, [statistics_key__relativeFrequency]: d3.mean(V, function(v) { return kernel(x - v); })};//[x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
    };
}

function kernelEpanechnikov(k) {
    return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}