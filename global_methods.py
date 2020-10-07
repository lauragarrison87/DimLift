import pandas as pd

import global_variables as gv
import numpy as np


def fill_nan_values(df):

    df = df.fillna(df.mean())
    df = df.fillna('not defined')  # still have to be defined for correctly identified column data types

    return df.iloc[:, 0]


def get_column_id(df, name):
    if name in list(df.columns):
        return name
    else:
        if '_' in name:
            return get_column_id(df, name.rsplit('_', 1)[0])
        else:
            return False


def normalize_values(current_col_for_normalization, current_data_type, col_id):
    current_col_normalized_in_function = current_col_for_normalization

    if current_data_type == gv.id_data_type__numerical or current_data_type == gv.id_data_type__date:
        # normalize_column(current_col)
        # mean_val = current_col.mean()
        # std_val = current_col.std()

        min_val = np.amin(current_col_for_normalization)
        max_val = np.amax(current_col_for_normalization)

        normalized_values = list()

        for index_normalization in range(len(current_col_for_normalization)):
            row = current_col_for_normalization[index_normalization]

            if np.isnan(min_val):
                normalized_values.append(row)
            elif min_val == max_val:
                normalized_values.append(row)
            else:
                normalized_values.append((row - min_val) / (max_val - min_val))

        current_col_normalized_in_function = pd.Series(normalized_values)
        current_col_normalized_in_function = current_col_normalized_in_function.rename(col_id)

    return current_col_normalized_in_function

