import React from "react";

const Select = ({ name, label, options, error, ...rest }) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select name={name} id={name} {...rest} className="form-control">
                {/* <option value="" /> */}
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.display_name}
                    </option>
                ))}
            </select>
            {error && (Array.isArray(error) ?
                error.map(item => <div className="alert alert-danger">{item}</div>) :
                <div className="alert alert-danger">{error}</div>)
            }
        </div>
    );
};

export default Select;
