import React from "react";


const Input = ({ name, value, label, error, type, ...rest }) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input {...rest} type={type} value={value} name={name} id={name} className="form-control" />
            {error && (Array.isArray(error) ?
                error.map(item => <div className="alert alert-danger">{item}</div>) :
                <div className="alert alert-danger">{error}</div>)
            }
        </div>
    );
};

export default Input;